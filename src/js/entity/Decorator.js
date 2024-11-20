
let filter = {
    create(){
        return {
            attr: 'all',
            value: {
                from: 0,
                to: 0
            },
        }
    },

    units: [
        'all',
        'color',
        'color-each',
        'thread',
        'thread-each',
        'location',
        'location-each',
    ]
}

export default {

    sheet: {
        create(){

            let sheet = {
                filters: [],
                label: 'none',
                price: [],
                production: {
                    time_setup: 0,
                    time_group_size: 0,
                    time_per_group: 0,
                }
            }

            sheet.filters.push(filter.create())

            return sheet;
        },

        filter,

        tier: {
            create(){
                return {
                    qty: 0,
                    price: 0,
                }
            }
        }
    }

}