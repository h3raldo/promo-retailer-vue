import itemCost from "@/js/Quotes/Quote/defaults/item.cost.js";
import entity from "@/js/Quotes/Quote/entity.js";
import itemNotes from "@/js/Quotes/Quote/defaults/item.notes.js";
import itemOptionDecorators from "@/js/Quotes/Quote/defaults/item.option.decorators.js";
import itemDecoration from "@/js/Quotes/Quote/defaults/item.decoration.js";

let colors = ['Red', 'Blue', 'Orange'];
let logo_colors = ['Light', 'Gray', 'Mesh'];
let default_sizes = ['XS', 'SM', 'MD', 'LG', 'XL', '2XL', '3XL', '4XL', '5XL'];

export default {

    margin: 35,

    option: {
        colors(){
            return entity.item.option.arrayToOption('Color', colors);
        },
        logo_colors(){
            return entity.item.option.arrayToOption('Logo Color', logo_colors);
        },
        decorators: itemOptionDecorators
    },

    notes: itemNotes,

    sizes(){
        let sizes = [];
        default_sizes.forEach( s => sizes.push( entity.item.size.create(s) ) );
        return sizes;
    },
    subitem:{},
    decoration: itemDecoration,
    cost: itemCost

}