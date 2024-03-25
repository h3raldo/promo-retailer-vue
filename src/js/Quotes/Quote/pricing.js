import entity from "@/js/Quotes/Quote/entity.js";
import pricingTiers from "@/js/Quotes/Quote/pricing/pricing.tiers.js";
import pricingTable from "@/js/Quotes/Quote/pricing/pricing.table.js";
import pricingItem from "@/js/Quotes/Quote/pricing/pricing.item.js";
import defaults from "@/js/Quotes/Quote/defaults.js";

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
        let matched = entity.item.tier.create();
        matched.margin = 0;

        if( !tiers || !tiers.length ) return matched;

        tiers.forEach( tier => {
            if( qty >= parseInt(tier.qty) ) matched = tier;
        })

        return matched;
    },

    addMargin( cost, margin ) {
        if( typeof margin === 'undefined' ) margin = defaults.item.margin;
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
            tier.price = this.addMargin(tier.cost, defaults.item.margin);
            tier.margin = defaults.item.margin;
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

        quote.items.forEach(i => {
            total_qty += i.qty;
            total_price += i.pricing.totals.price;
            total_cost += i.pricing.totals.cost
        })

        quote.fees.forEach( f => {
            total_price += f.pricing.price.subtotal
            total_cost += f.pricing.cost.subtotal
        });

        total_margin = this.calculateMargin( total_cost, total_price )

        quote.totals.qty = total_qty;
        quote.totals.margin = total_margin;
        quote.totals.cost = this.round(total_cost);
        quote.totals.total = this.round(total_price);
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