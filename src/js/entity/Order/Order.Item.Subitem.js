import entity from "@/js/entity.js";

function create( color ){

    let subitem= {
        qty: 1,
        options: {},
        color: {},
        sizes: {},
        pricing: {
            totals: {
                cost: 0,
                price: 0
            },
            base: {
                color: {
                    cost: 0,
                    price: 0
                },
                options: {
                    cost: 0,
                    price: 0
                }
            }
        },
    }

    if( color ) subitem.color = color;

    return subitem;
}

let size = {
    create( size ){
        return {
            name: size,
            qty: 0,
            pricing: {
                totals: {
                    cost: 0,
                    price: 0,
                    each: {
                        cost: 0,
                        price: 0
                    }
                },
                base: {
                    size: {
                        cost: 0,
                        price: 0
                    }
                }
            }
        }
    },
}

function setQtyForSize( qty, size_object, subitem )
{
    if( !subitem.sizes[size_object.name] ) subitem.sizes[size_object.name] = size.create( size_object.name );
    // console.log( size_object, qty, subitem.sizes[size_object.name] )
    subitem.sizes[size_object.name].qty = qty;
}

export default {
    create,
    setQtyForSize,
    size: size
}