import OrderItem from "@/js/entity/Order/Order.Item.js";
import OrderFee from "@/js/entity/Order/Order.Fee.js";
import OrderLogo from "@/js/entity/Order/Order.Logo.js";
import OrderVendor from "@/js/entity/Order/Order.Vendor.js";

function create(id){
    let date = new Date();
    return {
        id: id,
        info: {
            title: 'New Order',
            status: 'draft',
            category: 'standard',
            reference_number: '',
            source: 'quoting',
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
}

function patchData( init )
{
    let order = init.order;

    order.id = init.id;
    order.info.status = init.status;

    return order;
}

export default {
    create: create,
    patchData: patchData,
    item: OrderItem,
    fee: OrderFee,
    logo: OrderLogo,
    vendor: OrderVendor
}