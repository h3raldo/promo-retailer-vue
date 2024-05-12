import entity from "@/js/entity.js";

function create(){

    let tier = entity.order.item.tier.create();
    tier.fixed = true;

    return {
        name: 'Service Charge',
        vendor: {},
        qty: 1,
        tier: tier,
        config: {
            tax: {
                enabled: true
            },
        },
        pricing: {
            price: {
                subtotal: 0
            },
            cost: {
                subtotal: 0
            },
            tax: {
                subtotal: 0
            }
        }
    }
}

export default {
    create: create
}