import pricing from "@/js/pricing.js";
import entity from "@/js/entity.js";


function combineCostWithDecoration( item )
{
    let quantities = getItemQtyTiers(item);
    let base_tiers = {
        name: 'Price',
        tiers: getItemAndDecorationTiers( item, quantities )
    }

    let tiers = [base_tiers];

    if( pricing.item.shouldAddPrice('size', item) )
        getItemTiers( 'sizes', item, quantities ).forEach( t => tiers.push(t) );

    if( pricing.item.shouldAddPrice('color', item) )
        getItemTiers( 'colors', item, quantities ).forEach( t => tiers.push(t) );

    return tiers;
}
function getItemAndDecorationTiers( item, quantities )
{
    let placements = item.decoration.placements;
    let item_cost = item.cost.material.tiers;

    let placement_cost = [];
    quantities.forEach( qty => {
        let item_price = pricing.getTierPrice(item_cost, qty);
        let placement_price = 0;

        if( pricing.item.shouldAddPrice('decoration', item) ) {
            placements.forEach(p => {
                placement_price += pricing.getTierPrice(p.decorator.cost, qty, item);
            })
        }

        let tier = entity.order.item.tier.create();
        tier.qty = qty;
        tier.price = item_price + placement_price;
        placement_cost.push(tier);
    });

    return placement_cost;
}

function getItemTiers( key, item, quantities )
{
    let tiers = [];

    item[key].forEach( property => {

        let propertyTier = {
            name: property.name,
            tiers: []
        }

        let total = 0;
        if( property.cost.length < 1 ) return;

        quantities.forEach( qty => {
            let tier = entity.order.item.tier.create();
            tier.price = pricing.getTierPrice(property.cost, qty, item);
            total += tier.price;
            propertyTier.tiers.push(tier);
        })

        if( total === 0) return;

        tiers.push(propertyTier);
    })

    return tiers;
}

function getItemQtyTiers( item )
{
    let tiers = {};
    item.cost.material.tiers.forEach( t => tiers[t.qty] = true );

    if( pricing.item.shouldAddPrice('decoration', item) ) {
        item.decoration.placements.forEach(p => {
            if (!p.decorator.cost) return;
            p.decorator.cost.forEach(t => {
                tiers[t.qty] = true;
            })
        })
    }

    return Object.keys(tiers);
}


export default
{
    combineCostWithDecoration: combineCostWithDecoration
}