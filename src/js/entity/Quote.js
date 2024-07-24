import OrderItem from "@/js/entity/Order/Order.Item.js";
import OrderFee from "@/js/entity/Order/Order.Fee.js";
import OrderLogo from "@/js/entity/Order/Order.Logo.js";
import OrderVendor from "@/js/entity/Order/Order.Vendor.js";
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

function create(id){
    return {
        id: id,
        info: {
            title: 'New Quote',
            status: 'draft',
            statuses: {
                sent: false,
                shipped: false,
                approved: false,
                paid: false,
            },
            category: 'standard',
            po_number: '',
            notes: {
                public: '',
                private: '',
                flags: []
            },
            attributes: [],
            events: [],
            tax: true,
            date: utils.time.getDateAsString(),
            deliver_by: '',
            deliver_by_strict: false,
            ship_by: '',
            delivery_method: '',
            payment_method: '',
            company: entity.order.company.create()
        },
        config: { tax: { enabled: true } },
        client: {
            name: 'New Client',
            email: '',
            info: '',
            id: '',
            ship_to: '',
            shipping: entity.customer.address.create(),
            billing: entity.customer.address.create(),
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
    let blank = create(0);
    let quote = data.quote;

    quote.id = init.id;
    quote.info.status = init.status;

    if( init.updated ){
        quote.info.date = utils.time.getDateAsString(init.updated);
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
    if( typeof quote.info.events === 'undefined' ) quote.info.events = [];
    if( typeof quote.config === 'undefined' ) quote.config = { tax: { enabled: false } }
    if( typeof quote.info.tax === 'undefined' ) quote.info.tax = false;
    if( typeof quote.totals.tax === 'undefined' ) quote.totals.tax = 0;
    if( typeof quote.totals.paid === 'undefined' ) quote.totals.paid = 0;
    if( typeof quote.info.delivery_method === 'undefined' ) quote.info.delivery_method = '';
    if( typeof quote.info.payment_method === 'undefined' ) quote.info.payment_method = '';
    if( typeof quote.client.shipping === 'undefined' ) quote.client.shipping = entity.customer.address.create();
    if( typeof quote.client.billing === 'undefined' ) quote.client.billing = entity.customer.address.create();
    if( typeof quote.client.shipping.phone === 'undefined' ) quote.client.shipping.phone = '';
    if( typeof quote.client.billing.phone === 'undefined' ) quote.client.billing.phone = '';
    if( typeof quote.info.ship_by === 'undefined' ) quote.info.ship_by = '';
    if( typeof quote.info.company === 'undefined' ) quote.info.company = entity.order.company.create();
    if( typeof quote.info.statuses === 'undefined' ) quote.info.statuses = blank.info.statuses;

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