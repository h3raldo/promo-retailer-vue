import entity from "@/js/entity.js";
import pricingTiers from "@/js/pricing/pricing.tiers.js";
import pricingTable from "@/js/pricing/pricing.table.js";
import pricingItem from "@/js/pricing/pricing.item.js";

export default
{
    format( price ){
        let USDollar = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        return USDollar.format(price)
    },

    round( price )
    {
        return parseFloat(price.toFixed(2));
    },

    getMinimum( item )
    {
        let {cost} = item;
        if( cost.material.tiers.length < 1 ) return 0;

        let tiers = cost.material.tiers;
        return parseInt(tiers[0].qty);
    },

    getTierPrice( tiers, qty, item ){
        let tier = this.getTier(tiers, qty);
        if( tier.fixed ) return parseFloat(tier.price);

        if( item ){
            let item_margin = this.getTierMargin( item.cost.material.tiers, qty );
            return this.addMargin(tier.cost, item_margin);
        }

        return parseFloat(tier.price);
    },

    getTierCost( tiers, qty ){
        let tier = this.getTier(tiers, qty);
        return parseFloat(tier.cost);
    },

    getTierMargin( tiers, qty ){
        let tier = this.getTier(tiers, qty);
        return tier.margin;
    },

    getTier( tiers, qty )
    {
        let matched = entity.order.item.tier.create();
        matched.margin = 0;

        if( !tiers || !tiers.length ) return matched;

        tiers.forEach( tier => {
            if( qty >= parseInt(tier.qty) ) matched = tier;
        })

        return matched;
    },

    addMargin( cost, margin ) {
        if( typeof margin === 'undefined' ) margin = entity.order.item.defaults.margin;
        return parseFloat( ( cost / ( (100 - margin) / 100 ) ).toFixed(2) );
    },

    calculateMargin( cost, price )
    {
        if( cost <= 0 && price <= 0 ) return 0;

        if( price <= 0 ){
            return (
                parseFloat( ( ( ( cost - price ) / cost ) * -100 ).toFixed(2) )
            )
        }

        return (
            parseFloat( ( ( ( price - cost ) / price ) * 100 ).toFixed(2) )
        )
    },

    applyDefaultMarginToTiers( tiers )
    {
        tiers.forEach( tier => {
            tier.price = this.addMargin(tier.cost, entity.order.item.defaults.margin);
            tier.margin = entity.order.item.defaults.margin;
        })
        return tiers;
    },

    updateCombinedPriceTable( item )
    {
        item.cost.combined = this.table.combineCostWithDecoration( item );
    },

    updateQuoteTotals( quote )
    {
        let total_qty = 0;
        let total_price = 0;
        let total_cost = 0;
        let total_margin = 0;
        let total_tax = 0

        quote.items.forEach(i => {
            total_qty += i.qty;
            total_price += i.pricing.totals.price;
            total_cost += i.pricing.totals.cost
            total_tax += i.pricing.totals.tax;
        })

        quote.fees.forEach( f => {
            f.pricing.price.subtotal = parseFloat( ( f.tier.qty * f.tier.price ).toFixed(2) );
            f.pricing.cost.subtotal = parseFloat( ( f.tier.qty * f.tier.cost ).toFixed(2) );
            if( f.config.tax.enabled ){
                f.pricing.tax.subtotal = this.calculateTax( f.pricing.price.subtotal );
            } else{
                f.pricing.tax.subtotal = 0;
            }


            total_price += f.pricing.price.subtotal
            total_cost += f.pricing.cost.subtotal
            total_tax += f.pricing.tax.subtotal
        });

        total_margin = this.calculateMargin( total_cost, total_price )

        quote.totals.qty = total_qty;
        quote.totals.margin = total_margin;
        quote.totals.cost = this.round(total_cost);


        if( quote.config.tax.enabled )
            quote.totals.tax = total_tax;
        else
            quote.totals.tax = 0;

        quote.totals.total = this.round(total_price);
    },

    calculateTax( price, tax=8.25 )
    {
        return price * (tax / 100);
    },

    updateAllPricing( quote )
    {
        quote.items.forEach( item => {
            this.item.updateItemPricing( item, quote.items );
            this.item.updateItemQty( item );
        })
        this.updateQuoteTotals( quote );
    },

    item: pricingItem,
    tiers: pricingTiers,
    table: pricingTable
}