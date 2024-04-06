import OrderItemSubitem from "@/js/entity/Order/Order.Item.Subitem.js";
import OrderItemTier from "@/js/entity/Order/Order.Item.Tier.js";
import OrderItemOption from "@/js/entity/Order/Order.Item.Option.js";
import OrderItemDecoration from "@/js/entity/Order/Order.Item.Decoration.js";
import entity from "@/js/entity.js";

function create(){
    let item = {
        id: '',
        info: {
            name: 'New Item',
            sku: '',
            hidden: false,
            taxable: true,
            image: {
                primary: '',
                available: []
            },
            supplier: {}
        },
        notes: {
            public: '',
            private: '',
            flags: []
        },
        qty: 1,
        options: [],
        colors: [],
        sizes: [],
        decoration: {
            available: [],
            placements: [],
        },
        subitems: [],
        pricing: {
            totals: {
                price: 0,
                cost: 0
            },
            base: {
                material: {
                    cost: 0,
                    price: 0,
                    overwrites: {
                        decoration: false,
                        color: false,
                        size: false,
                        options: false
                    }
                },
                decoration: {
                    cost: 0,
                    price: 0
                }
            }
        },
        cost: {
            material: {
                visible: true,
                tiers: []
            },
            combined: {
                tiers: []
            }
        }
    };
    item.colors.push(color.create());
    item.sizes.push(size.create());
    item.subitems.push( OrderItemSubitem.create() );
    return item;
}

let color = {
    create(){
        return {
            name: 'OC',
            cost: []
        }
    }
}

let size = {
    create(s){
        return {
            name: s ?? 'OS',
            cost: []
        }
    }
}

let image = {
    create(){
        return { url: '', caption: '' }
    }
}


let default_sizes = ['XS', 'SM', 'MD', 'LG', 'XL', '2XL', '3XL', '4XL', '5XL'];

let defaults = {
    margin: 35,
    sizes(){
        let sizes = [];
        default_sizes.forEach( s => sizes.push( entity.order.item.size.create(s) ) );
        return sizes;
    },
}

export default {
    create: create,
    defaults: defaults,
    color: color,
    size: size,
    image: image,
    subitem: OrderItemSubitem,
    tier: OrderItemTier,
    option: OrderItemOption,
    decoration: OrderItemDecoration
}