export default {
    create(id){
        let date = new Date();
        return {
            id: id,
            info: {
                title: 'New Quote',
                status: 'draft',
                category: 'standard',
                notes: {
                    public: '',
                    private: '',
                    flags: []
                },
                date: date.toISOString().split('T')[0],
                deliver_by: date.toISOString().split('T')[0],
                deliver_by_strict: false
            },
            client: {
                name: 'New Client',
                email: '',
                info: '',
                id: '',
                ship_to: '',
            },
            items: [],
            fees: [],
            totals: {
                total: 0,
                cost: 0,
                margin: 0,
                qty: 0,
            }
        }
    },
    patchData( init )
    {
        let quote = init.quote;

        quote.id = init.id;
        quote.info.status = init.status;

        if( typeof quote.info.notes === 'string' ){
            quote.info.notes = { public: '', private: init.quote.info.notes, flags: [] }
        }

        if( !quote.client.email )
            quote.client.email = '';

        if( !quote.client.ship_to )
            quote.client.ship_to = '';

        return quote;
    }
}