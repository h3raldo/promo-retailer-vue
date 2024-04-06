function create(){
    return {
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
    }
}

export default {
    create: create,
    size: size
}