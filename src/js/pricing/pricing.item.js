import pricingUtils from "@/js/pricing.js";

function updateItemPricing( item, quote )
{
    let {items} = quote;
    let decorationPricing = getDecorationPricing(item, items);
    item.pricing.base.decoration.cost = decorationPricing.cost.each;
    item.pricing.base.decoration.price = decorationPricing.price.each;

    item.pricing.base.material.cost = getMaterialCost(item);
    item.pricing.base.material.price = getMaterialPrice(item);

    let sizeCost = getSizePricing(item);

    let item_pricing = {
        cost: 0,
        price: 0
    }

    item.subitems.forEach( subitem => {
        if( Array.isArray(subitem.sizes) ) subitem.sizes = {};
        if( Array.isArray(subitem.options) ) subitem.options = {};
        setSubItemPricing( subitem, item, items, sizeCost );
        item_pricing.cost += subitem.pricing.totals.cost;
        item_pricing.price += subitem.pricing.totals.price;
    })

    item.pricing.totals.cost = pricingUtils.round(item_pricing.cost);
    item.pricing.totals.price = pricingUtils.round(item_pricing.price);
    if( item.info.taxable ) item.pricing.totals.tax = pricingUtils.calculateTax( item.pricing.totals.price )
    else item.pricing.totals.tax = 0;

    pricingUtils.updateCombinedPriceTable(item);
}

function setSubItemPricing( subItem, item, items, sizeCost )
{
    let optionsPricing = getOptionsPricing(subItem, item, items);
    subItem.pricing.base.options.cost = optionsPricing.cost.each;
    subItem.pricing.base.options.price = optionsPricing.price.each;

    subItem.pricing.base.color.cost = pricingUtils.getTierCost( subItem.color.cost, item.qty );

    if( shouldAddPrice('color', item) )
        subItem.pricing.base.color.price = pricingUtils.getTierPrice( subItem.color.cost, item.qty, item );
    else
        subItem.pricing.base.color.price = 0


    let subitem_pricing = {
        price: 0,
        cost: 0
    }

    Object.keys( subItem.sizes ).forEach( k => {
        let size = subItem.sizes[k];
        size.pricing.base.size.cost = sizeCost[k].cost;
        size.pricing.base.size.price = sizeCost[k].price;
        updateSizePricing(item, subItem, size);
        size.pricing.totals.cost = pricingUtils.round(size.pricing.totals.each.cost * size.qty);
        size.pricing.totals.price = pricingUtils.round(size.pricing.totals.each.price * size.qty);
        subitem_pricing.cost += size.pricing.totals.cost
        subitem_pricing.price += size.pricing.totals.price
    })

    subItem.pricing.totals.cost = pricingUtils.round(subitem_pricing.cost);
    subItem.pricing.totals.price = pricingUtils.round(subitem_pricing.price);
}

function updateSizePricing( item, subitem, size )
{
    let price = {
        cost: 0,
        price: 0
    }

    price.cost += item.pricing.base.decoration.cost;
    price.cost += item.pricing.base.material.cost;
    price.cost += subitem.pricing.base.color.cost;
    price.cost += subitem.pricing.base.options.cost;
    price.cost += size.pricing.base.size.cost;

    price.price += item.pricing.base.material.price;
    price.price += item.pricing.base.decoration.price;
    price.price += subitem.pricing.base.color.price;
    price.price += subitem.pricing.base.options.price;
    price.price += size.pricing.base.size.price;

    size.pricing.totals.each.cost = pricingUtils.round(price.cost);
    size.pricing.totals.each.price = pricingUtils.round(price.price);
}

function getDecorationPricing(item, items)
{
    let pricing = {
        cost: { each: 0 },
        price: { each: 0 },
    }

    let decorator_qtys = getDecoratorQtys( items );

    item.decoration.placements.forEach( placement => {

        if( !placement.decorator.name ) return;

        let id = getPlacementDecoratorID(placement);
        let qty = item.qty;
        if( id !== '' ) qty = decorator_qtys[id];

        if( shouldAddPrice('decoration', item) )
            pricing.price.each += pricingUtils.getTierPrice(placement.decorator.cost, qty, item);

        pricing.cost.each += pricingUtils.getTierCost(placement.decorator.cost, qty);
    })

    return pricing;
}

function getSizePricing( item )
{
    let pricing = {};

    item.sizes.forEach( s => {

        let price = 0;

        if( shouldAddPrice('size', item) )
            price = pricingUtils.getTierPrice( s.cost, item.qty, item )

        pricing[s.name] = {
            cost: pricingUtils.getTierCost( s.cost, item.qty ),
            price: price
        };
    })

    return pricing;
}

function getOptionsPricing(subitem, item )
{
    let qty = getTotalQtyFromItem( item );

    let pricing = {
        price: { each: 0 },
        cost: { each: 0 }
    }

    Object.keys( subitem.options ).forEach( key => {
        let selected = subitem.options[key];
        let optionTiers = getOptionTiers(key, selected, item);
        pricing.cost.each += pricingUtils.getTierCost(optionTiers, qty);

        if( shouldAddPrice('options', item) )
            pricing.price.each += pricingUtils.getTierPrice(optionTiers, qty, item);
    })

    return pricing;
}

function getOptionTiers( key, selected, item )
{
    let tiers = [];
    let option = item.options.filter( o => o.name === key)[0];
    if( !option || !option.groups || !selected ) return tiers;

    option.groups.forEach( group => {
        let matched = group.values.filter( v => v.name === selected.name && v.value === selected.value );
        if( matched.length > 0 ) tiers = matched[0].cost
    })

    return tiers;
}

function getDecoratorQtys( items )
{
    let decorators = {};

    items.forEach( item => {
        if( !item.decoration ) return;
        item.decoration.placements.forEach( p => {
            let id = getPlacementDecoratorID( p );
            if( id === '' ) return;

            if( !decorators[id] ) decorators[id] = 0;
            decorators[id] += item.qty;
        });
    })

    return  decorators;
}

function getPlacementDecoratorID( placement )
{
    let logo = '', decorator_id = '', sheet = '', location ='';

    if( placement.logo.id )
        logo = ( placement.logo.group === '' ? placement.logo.id : placement.logo.group );

    if( placement.decorator.name ) {
        decorator_id = placement.decorator.info.id;
        sheet = placement.decorator.name;
    }

    if( placement.location.name ){
        location = placement.location.name.toLowerCase();
    }

    return logo + decorator_id + sheet.trim() + location;
}

function getMaterialPrice( item )
{
    let qty = getTotalQtyFromItem(item);
    let tier = pricingUtils.getTier( item.cost.material.tiers, qty );
    return parseFloat(tier.price) || 0;
}

function getMaterialCost( item )
{
    let qty = getTotalQtyFromItem(item);
    let tier = pricingUtils.getTier( item.cost.material.tiers, qty );
    return parseFloat(tier.cost);
}

function shouldAddPrice( type, item )
{
    return !item.pricing.base.material.overwrites[type];
}

function updateItemQty( item )
{
    item.qty = getTotalQtyFromItem( item );
}

function getTotalQtyFromItem( item )
{
    let qty = 0;
    item.subitems.forEach(s => {
        s.qty = getSubItemQty(s);
        qty += s.qty
    })
    return qty;
}

function getSubItemQty( s )
{
    let subitemQty = 0;
    Object.keys( s.sizes ).forEach( k => {
        let size = s.sizes[k];
        subitemQty += size.qty
    });
    return subitemQty;
}

export default
{
    updateItemPricing,
    updateItemQty,
    shouldAddPrice
}