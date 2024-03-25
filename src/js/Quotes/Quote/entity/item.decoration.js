import entity from "@/js/Quotes/Quote/entity.js";
import pricing from "@/js/Quotes/Quote/pricing.js";

let structure = {
    decorator: {
        create() {
            return {
                info: {
                    id: '',
                    zoho_id: '',
                    name: '',
                },
                sheets: [],
            }
        },
        sheet: {
            create( d ) {
                return {
                    name: '',
                    cost: [],
                    info: d.info
                }
            }
        }
    },
    placement: {
        create(){
            return {
                decorator: {}, /* entity/decorator/sheet */
                location: { name: '', id: '' },
                logo: {}, /* entity/logo */
                logo_color: { name: '' }
            }
        }
    }
}

function addDecoratorSheet( sheet, decorator, item )
{
    let id = decorator.id;

    let matchedDecorator = item.decoration.available.filter( d => d.info.id === id );
    if( matchedDecorator.length > 0 ) matchedDecorator = matchedDecorator[0];
    else {
        let newDecorator = structure.decorator.create();
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
        let tier = entity.item.tier.create();
        tier.qty = p.qty;
        tier.cost = p.price;
        tiers.push(tier);
    })

    let newSheet = structure.decorator.sheet.create( decorator );
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
    decorator: structure.decorator,
    placement: structure.placement,
    addDecoratorSheet: addDecoratorSheet,
    getPriceSheetName: getPriceSheetName
}