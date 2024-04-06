import entity from "@/js/entity.js";
import pricing from "@/js/pricing.js";

function create(){
    return {
        info: {
            id: '',
            zoho_id: '',
            name: '',
        },
        sheets: [],
    }
}

let sheet = {
    create( d ) {
        return {
            name: '',
            cost: [],
            info: d.info
        }
    }
}

function createOrAddDecorator( decorator, item )
{
    let option = entity.order.item.option.getOption('Decoration', item)
    if( option === false ) {
        item.options.push( createOption([decorator]) );
        return;
    }

    let group = createGroup(decorator);
    option.groups.push(group);
}

function createOption(decorators)
{
    let option = entity.order.item.option.create();
    option.name = 'Decoration';
    decorators.forEach( d => {
        let group = createGroup(d);
        option.groups.push(group);
    })
    return option;
}

function createGroup( d )
{
    let group = entity.order.item.option.group.create();
    group.name = d.name;

    d.unit.forEach( u => {
        let value = entity.order.item.option.group.value.create();
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
    create: create,
    sheet: sheet,
    createOptionOrAddDecorator: createOrAddDecorator
}