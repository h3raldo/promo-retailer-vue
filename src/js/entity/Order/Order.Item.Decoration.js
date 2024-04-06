import entity from "@/js/entity.js";
import pricing from "@/js/pricing.js";
import OrderItemDecorationDecorator from "@/js/entity/Order/Order.Item.Decoration.Decorator.js";
import OrderItemDecorationPlacement from "@/js/entity/Order/Order.Item.Decoration.Placement.js";

let default_logo_colors = ['White', 'Black', 'Full-Color', 'Match-Mesh', 'Tone on Tone'];
let default_logo_locations = ['Back', 'Back Yoke', 'Bottom', 'Bottom Left', 'Bottom Right', 'Front', 'Left Chest', 'Left Full Sleeve', 'Left Lens', 'Left Panel', 'Left Pocket', 'Left Side', 'Left Sleeve', 'Right Chest', 'Right Cuff', 'Right Full Sleeve', 'Right Lens', 'Right Panel', 'Right Pocket', 'Right Side', 'Right Sleeve', 'Top', 'Top Left', 'Top Right'];

function addDecoratorSheet( sheet, decorator, item )
{
    let id = decorator.id;

    let matchedDecorator = item.decoration.available.filter( d => d.info.id === id );
    if( matchedDecorator.length > 0 ) matchedDecorator = matchedDecorator[0];
    else {
        let newDecorator = OrderItemDecorationDecorator.create();
        newDecorator.info.id = decorator.id;
        newDecorator.info.name = decorator.name;
        newDecorator.info.zoho_id = decorator.zoho_id;
        item.decoration.available.push(newDecorator);
        matchedDecorator = newDecorator;
    }

    let matchedSheet = matchedDecorator.sheets.filter( s => s.name === getPriceSheetName(sheet) );
    if( matchedSheet > 0 ) return;

    matchedDecorator.sheets.push( decoratorSheetToVue( sheet, matchedDecorator ) );
}

function decoratorSheetToVue( sheet, decorator )
{
    let tiers = [];

    sheet.price.forEach( p => {
        let tier = entity.order.item.tier.create();
        tier.qty = p.qty;
        tier.cost = p.price;
        tiers.push(tier);
    })

    let newSheet = OrderItemDecorationDecorator.sheet.create( decorator );
    newSheet.cost = pricing.applyDefaultMarginToTiers( tiers );
    newSheet.name = getPriceSheetName( sheet );
    return newSheet;
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


export default
{
    addDecoratorSheet: addDecoratorSheet,
    getPriceSheetName: getPriceSheetName,
    default: {
        logo: {
            colors: default_logo_colors,
            locations: default_logo_locations
        }
    },
    placement: OrderItemDecorationPlacement,
    decorator: OrderItemDecorationDecorator,
}