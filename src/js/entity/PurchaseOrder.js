function create(id){
    let date = new Date();
    return {
        id: id,
        info: {
            title: 'New Purchase Order',
            status: 'draft',
            vendor: {
                name: 'New Client',
                id: '',
                info: {}
            },
            notes: {
                public: '',
                private: '',
                flags: []
            },
            created_from: [
                { source: 'order', id: '123456' },
                { source: 'order', id: '34123456' }
            ],
            date: date.toISOString().split('T')[0]
        },
        config: {
            tax: {
                enabled: false
            },
        },
        items: [],
        fees: [],
        totals: {
            subtotal: 0,
            cost: 0,
            qty: 0,
            tax: 0,
        }
    }
}

function patchData( data, init )
{
    let po = data.po;
    return po;
}

export default {
    create,
    patchData,
}