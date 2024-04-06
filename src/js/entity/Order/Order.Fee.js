function create(){
    return {
        name: 'Service Charge',
        vendor: {},
        qty: 1,
        price: 0,
        cost: 0,
        margin: 35,
        tier: {
            qty: 1,
            price: 0,
            cost: 0,
            margin: 35,
        },
        pricing: {
            price: {
                subtotal: 0
            },
            cost: {
                subtotal: 0
            }
        }
    }
}

export default {
    create: create
}