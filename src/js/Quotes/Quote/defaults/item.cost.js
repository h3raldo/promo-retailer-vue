import entity from "@/js/Quotes/Quote/entity.js";

let default_tiers = [
    { qty: 1, margin: 40 },
    { qty: 12, margin: 38 },
    { qty: 24, margin: 36 },
    { qty: 48, margin: 34 },
    { qty: 72, margin: 32 },
    { qty: 144, margin: 30 },
    { qty: 288, margin: 28 },
];

export default {
    tiers(){
        let tiers = [];

        default_tiers.forEach( t => {
            let tier = entity.item.tier.create();
            tier.qty = t.qty;
            tier.margin = t.margin;
            tiers.push( tier )
        })

        return tiers;
    }
}