import entity from "@/js/entity.js";

let default_tiers = [
    { qty: 1, margin: 40 },
    { qty: 12, margin: 38 },
    { qty: 24, margin: 36 },
    { qty: 48, margin: 34 },
    { qty: 72, margin: 32 },
    { qty: 144, margin: 30 },
    { qty: 288, margin: 28 },
];

function create(){
    return { qty: 1, price: 0, cost: 0, margin: entity.order.item.defaults.margin, fixed: false }
}

function default_cost_tiers(){
    let tiers = [];

    default_tiers.forEach( t => {
        let tier = create();
        tier.qty = t.qty;
        tier.margin = t.margin;
        tiers.push( tier )
    })

    return tiers;
}

export default {
    create: create,
    default: {
        cost: default_cost_tiers
    }
}