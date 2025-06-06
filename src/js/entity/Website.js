let logo_types = [
    'primary',
    'primary2',
    'secondary',
    'secondary2',
    'additional',
    'other',
    'none',
]

let product_rules = {

    create( type, entity ){

        let data = {
            id: null,
            qty: 1,
            type,
            name: '',
            entity: {},
            filters: [],
            decoration_sets: [],
            decoration_groups: [],
            overwrites: [],
        }

        if( type === 'product' ){
            data.entity.product = {
                id: null,
                sku: '',
                name: '',
                company: {
                    name: '',
                    id: null
                },
            }

            if( entity ){
                data.entity.product.id = entity.id;
                data.entity.product.sku = entity.sku;
                data.name = entity.name;
                data.entity.name = entity.name;
                data.entity.product.company.id = entity.company.id;
                data.entity.product.company.name = entity.company.name;
            }

        } else if( type === 'category' ){
            data.entity.category = {
                handle: '',
                name: '',
                path: '',
                count: null,
            }

            if( entity ){
                data.entity.category.handle = entity.handle;
                data.entity.category.name = entity.name;
                data.entity.category.path = entity.path;
                data.entity.category.count = entity.count;
                data.name = entity.name;
            }
        }

        return data;
    }
}

export default {
    default: {
        logo_types
    },
    product_rules
}