import pricing from "@/js/pricing.js";

export default {

    applyMarginToAll( margin, tiers ){
        tiers.forEach( t => {
            t.margin = margin;
            if( t.cost <= 0 ) return;
            t.price = pricing.addMargin(t.cost, margin);
        })
    },

    applyCostToAll( cost, tiers ){
        tiers.forEach( t => {
            t.cost = cost;
            if( t.margin <= 0 ) return;
            t.price = pricing.addMargin(t.cost, t.margin);
        })
    },

    applyPriceToAll( price, tiers ){
        tiers.forEach( t => {
            t.price = price;
            if( t.cost <= 0 ) return;
            t.margin = pricing.calculateMargin(t.cost, price);
        })
    },

    combinePriceBreaks( tiers ){
        let combined = {}

        tiers.forEach( tier => {
            let key = '';
            let tiers_total = 0;
            tier.cost.forEach( cost => {
                key += `[${cost.qty}-${cost.price}]`;
                tiers_total += cost.price;
            })
            if( tiers_total <= 0) return;

            if( !combined[key] ) combined[key] = { names: [], values: [], cost: tier.cost };
            if( combined[key] && combined[key].names ) {
                combined[key].names.push(tier.name);
                combined[key].values.push(tier.value);
            }
        })

        let combined_formatted = [];

        Object.keys( combined ).forEach( k => {
            let tier = combined[k];
            tier.name = tier.names.join(', ');
            tier.value = tier.values.join(', ');
            combined_formatted.push(tier);
        })

        return combined_formatted;
    }
}