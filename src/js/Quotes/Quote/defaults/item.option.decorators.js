import entity from "@/js/Quotes/Quote/entity.js";
import pricing from "@/js/Quotes/Quote/pricing.js";
import itemOption from "@/js/Quotes/Quote/entity/item.option.js";

function createOrAddDecorator( decorator, item )
{
    let option = itemOption.getOption('Decoration', item)
    if( option === false ) {
        item.options.push( createOption([decorator]) );
        return;
    }

    let group = createGroup(decorator);
    option.groups.push(group);
}

/**
 * Creates option from array of decorators
 *
 * @param decorators array
 * @returns {*}
 */
function createOption(decorators)
{
    let option = entity.item.option.create();
    option.name = 'Decoration';
    decorators.forEach( d => {
        let group = createGroup(d);
        option.groups.push(group);
    })
    return option;
}

function createGroup( d )
{
    let group = entity.item.option.group.create();
    group.name = d.name;

    d.unit.forEach( u => {
        let value = entity.item.option.group.value.create();
        value.name = getPriceSheetName( u );
        value.value = `${d.id}:${value.name}`;
        value.cost = u.price;
        value.cost.forEach( c => c.cost = c.price );
        pricing.applyDefaultMarginToTiers(value.cost);
        group.values.push(value);
    })

    return group;
}

function getPriceSheetName(sheet) {
    if (sheet.filters.length === 0) return 'All Types';

    let names = [];

    sheet.filters.forEach(f => {
        names.push(
            `${f.value.from} - ${f.value.to} ${f.attr}(s)`
        )
    })

    return names.join(' + ');
}


export default {
    createOptionOrAddDecorator: createOrAddDecorator
};