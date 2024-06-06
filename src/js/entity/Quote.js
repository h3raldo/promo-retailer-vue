import OrderItem from "@/js/entity/Order/Order.Item.js";
import OrderFee from "@/js/entity/Order/Order.Fee.js";
import OrderLogo from "@/js/entity/Order/Order.Logo.js";
import OrderVendor from "@/js/entity/Order/Order.Vendor.js";

function create(id){
    let date = new Date();
    return {
        id: id,
        info: {
            title: 'New Quote',
            status: 'draft',
            category: 'standard',
            po_number: '',
            notes: {
                public: '',
                private: '',
                flags: []
            },
            attributes: [],
            tax: false,
            date: date.toISOString().split('T')[0],
            deliver_by: date.toISOString().split('T')[0],
            deliver_by_strict: false
        },
        config: { tax: { enabled: false } },
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
            paid: 0,
            total: 0,
            cost: 0,
            margin: 0,
            qty: 0,
            tax: 0,
        }
    }
}

function patchData( data, init )
{
    let quote = data.quote;

    quote.id = init.id;
    quote.info.status = init.status;

    if( init.updated ){
        let date = new Date(init.updated);
        quote.info.date = date.toISOString().split('T')[0];
    }

    if( typeof quote.info.notes === 'string' ){
        quote.info.notes = { public: '', private: data.quote.info.notes, flags: [] }
    }

    if( !quote.client.email )
        quote.client.email = '';

    if( !quote.client.ship_to )
        quote.client.ship_to = '';

    if( typeof quote.info.po_number === 'undefined' ) quote.info.po_number = '';
    if( typeof quote.info.attributes === 'undefined' ) quote.info.attributes = [];
    if( typeof quote.config === 'undefined' ) quote.config = { tax: { enabled: false } }
    if( typeof quote.info.tax === 'undefined' ) quote.info.tax = false;
    if( typeof quote.totals.tax === 'undefined' ) quote.totals.tax = 0;
    if( typeof quote.totals.paid === 'undefined' ) quote.totals.paid = 0;

    quote.fees.forEach( f => {
        if( typeof f.config === 'undefined' ) f.config = {tax: {enabled: true}}
        if( typeof f.pricing.tax === 'undefined' ) f.pricing.tax = { subtotal: 0 }
    })

    return quote;
}

export default {
    create: create,
    patchData: patchData,
    item: OrderItem,
    fee: OrderFee,
    logo: OrderLogo,
    vendor: OrderVendor
}