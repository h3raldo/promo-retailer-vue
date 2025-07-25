import OrderItem from "@/js/entity/Order/Order.Item.js";
import OrderFee from "@/js/entity/Order/Order.Fee.js";
import OrderLogo from "@/js/entity/Order/Order.Logo.js";
import OrderVendor from "@/js/entity/Order/Order.Vendor.js";
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

function create(id){
    return {
        id: id,
        info: {
            title: 'New Order',
            status: 'new',
            type: 'default',
            statuses: {
                shipped: false,
                invoiced: false,
                paid: false,
                emailed: false,
            },
            category: 'standard',
            reference_number: '',
            po_number: '',
            source: 'order',
            date: utils.time.getDateAsString(),
            deliver_by: '',
            deliver_by_strict: false,
            ship_by: '',
            shipped: '',
            tracking_number: '',
            delivery_method: '',
            payment_method: '',
            attributes: [],
            events: [],
            notes: {
                public: '',
                private: '',
                flags: []
            },
            company: company.create(),
            website: { id: null, name: '' },
            contact: { id: null },
        },
        config: {
            tax: {
                enabled: true
            }
        },
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

let statuses = [
    { value: 'new', title: 'New'},
    { value: 'sent', title: 'Sent'},
    { value: 'confirmed', title: 'Confirmed'},
    { value: 'closed', title: 'Closed'},
    { value: 'complete', title: 'Complete'},
];

let types = [
    { value: 'default', title: '-'},
    { value: 'bulk', title: 'Bulk'},
    { value: 'hold', title: 'On Hold'},
    { value: 'inventory', title: 'Inventory'},
    { value: 'production', title: 'Production'},
    { value: 'urgent', title: 'Urgent'},
];

let company = {
    create(){
        return {
            id: '',
            name: '',
            parent: '',
            parent_name: '',
        }
    }
}

function patchData( data, init )
{
    let blank = create(0);
    let order = data.order;

    order.id = init.id;

    if( typeof order.info.po_number === 'undefined' ) order.info.po_number = blank.info.po_number;
    if( typeof order.info.attributes === 'undefined' ) order.info.attributes = blank.info.attributes;
    if( typeof order.config === 'undefined' ) order.config = blank.config
    if( typeof order.totals.tax === 'undefined' ) order.totals.tax = 0;
    if( typeof order.totals.paid === 'undefined' ) order.totals.paid = 0;
    if( typeof order.info.company === 'undefined' ) order.info.company = company.create();
    if( typeof order.info.contact === 'undefined' ) order.info.contact = blank.info.contact;
    if( typeof order.info.events === 'undefined' ) order.info.events = [];
    if( typeof order.info.delivery_method === 'undefined' ) order.info.delivery_method = '';
    if( typeof order.info.payment_method === 'undefined' ) order.info.payment_method = '';
    if( typeof order.client.shipping === 'undefined' ) order.client.shipping = entity.customer.address.create();
    if( typeof order.client.billing === 'undefined' ) order.client.billing = entity.customer.address.create();
    if( typeof order.client.shipping.phone === 'undefined' ) order.client.shipping.phone = '';
    if( typeof order.client.billing.phone === 'undefined' ) order.client.billing.phone = '';
    if( typeof order.info.ship_by === 'undefined' ) order.info.ship_by = '';
    if( typeof order.info.statuses === 'undefined' ) order.info.statuses = blank.info.statuses;
    if( typeof order.info.statuses.shipped === 'undefined' ) order.info.statuses.shipped = blank.info.statuses.shipped;
    if( typeof order.info.shipped === 'undefined' ) order.info.shipped = blank.info.shipped;
    if( typeof order.info.tracking_number === 'undefined' ) order.info.tracking_number = blank.info.tracking_number;
    if( typeof order.info.website === 'undefined' ) order.info.website = blank.info.website;

    if( init.website && init.website.id ){
        order.info.website.id = init.website.id;
        order.info.website.name = init.website.name;
        order.info.company.id = init.website.company.id;
        order.info.company.name = init.website.company.name;
    }

    // for duplicated orders where paid has been undone
    if( order.info.statuses.paid === true && init.statuses.paid === false ){
        order.totals.paid = 0;
    }

    order.info.status = init.status;
    order.info.statuses = init.statuses;
    order.info.deliver_by = init.dateDeliverBy || '';
    order.info.ship_by = init.dateShipBy || '';

    let new_fee = OrderFee.create();
    order.fees.forEach( f => {
        if( typeof f.config === 'undefined' ) f.config = new_fee.config;
        if( typeof f.type === 'undefined' ) f.type = 'fee'; // because existing orders can't be guessed
    })

    order.items.forEach( i => {
        if( typeof i.notes.decorator === 'undefined' ) i.notes.decorator = '';
    })

    return order;
}

function convertFromQuote( quote )
{
    let order = JSON.parse(JSON.stringify(quote));
    order.info.reference_number = quote.id;
    order.info.status = 'new';
    order.info.source = 'quote';
    order.info.date = utils.time.getDateAsString()
    return order;
}

function convertFromSource( data, cb )
{
    let order_data = JSON.parse(data.data);

    if( order_data.source === 'magento' ){
        console.log('attempt convert from magento', order_data);
        let order = entity.order.create(data.init.id);
        let logos = [];

        utils.ajax(`https://promoconnections.com/pr_api/?order=${order_data.source_id}`, (magento_order) => {

            order.info.source = 'magento';
            let stores = magento_order.store.split(':');
            order.info.title = `Web Order - ${stores[0].trim()} (${stores[stores.length-1].trim()})`;

            order.info.date = magento_order.date;
            order.info.delivery_method = magento_order.delivery_method;
            order.info.payment_method = magento_order.payment.title;
            if( magento_order.payment.code === 'purchaseorder' ){
                order.info.po_number = magento_order.payment.po_number;
            }
            order.client.name = magento_order.extra.customer.name.first + ' ' + magento_order.extra.customer.name.last;
            order.client.email = magento_order.extra.customer.email;
            // order.info.notes.public = magento_order.notes; // moved to attributes
            // order.info.notes.private = 'Store: ' + magento_order.store;  // moved to attributes
            order.totals.paid = magento_order.paid;

            let phone = magento_order.extra.customer.phone;
            if( magento_order.extra.customer.address.shipping.street ){
                order.client.shipping.first_name = magento_order.extra.customer.address.shipping.first_name
                order.client.shipping.last_name = magento_order.extra.customer.address.shipping.last_name
                order.client.shipping.address_line_1 = magento_order.extra.customer.address.shipping.street
                order.client.shipping.address_line_2 = magento_order.extra.customer.address.shipping.street_2
                order.client.shipping.city = magento_order.extra.customer.address.shipping.city
                order.client.shipping.state = magento_order.extra.customer.address.shipping.state
                order.client.shipping.postal_code = magento_order.extra.customer.address.shipping.zip
                order.client.shipping.country = 'United States'
                order.client.shipping.phone =  magento_order.extra.customer.address.shipping.phone ?? phone;
            }
            if( magento_order.extra.customer.address.billing.street ){
                order.client.billing.first_name = magento_order.extra.customer.address.billing.first_name
                order.client.billing.last_name = magento_order.extra.customer.address.billing.last_name
                order.client.billing.address_line_1 = magento_order.extra.customer.address.billing.street
                order.client.billing.address_line_2 = magento_order.extra.customer.address.billing.street_2
                order.client.billing.city = magento_order.extra.customer.address.billing.city
                order.client.billing.state = magento_order.extra.customer.address.billing.state
                order.client.billing.postal_code = magento_order.extra.customer.address.billing.zip
                order.client.billing.country = 'United States'
            }

            order.info.reference_number = magento_order.reference_number;

            magento_order.order_attributes.forEach( attribute => {
                let attr = entity.order.attribute.create();
                attr.name = attribute.label;
                attr.value = attribute.value;
                order.info.attributes.push(attr);
            })


            // order.client.ship_to = magento_order.extra.customer.shipping
            // let shipping_fee order.fees.create()

            magento_order.line_items.forEach( magento_item => {
                let item = entity.order.item.create();
                item.info.name = magento_item.parent_name;
                item.info.sku = magento_item.configuration.group;
                item.notes.public = magento_item.options_text;
                item.info.image.primary = magento_item.configuration.image;

                if( magento_item.configuration.personalization ){
                    Object.keys( magento_item.configuration.personalization ).forEach( key => {
                        let config = magento_item.configuration.personalization[key];
                        item.personalization.push({
                            name: key,
                            values: config
                        });
                    })
                    console.log('personalization', item.personalization);
                }

                let supplier = false;
                if( magento_item.zoho_supplier_id ){
                    supplier = entity.order.vendor.findByZohoID( magento_item.zoho_supplier_id );
                }

                if( supplier ){
                    item.info.supplier = supplier
                }


                addPricing( magento_item, item, logos );
                addSubitem( magento_item, item );

                order.items.push(item);
            })

            addFees( magento_order, order );

            utils.ajax(window.symfony.api.websites.search + '?magento_store_id=' + magento_order.store_id, (res) => {
                let website = null;

                if( res.length ){
                    website = res[0];
                    order.info.company.name = website.company.name;
                    order.info.company.id = website.company.id;
                    order.info.website.id = website.id;
                    order.info.website.name = website.name;
                }

                cb(order, logos, website);
            })
        }, (error) => {
            console.log('oh no', error);
        });
    }
}

function addPricing( magento_item, item, logos )
{
    let tier = entity.order.item.tier.create();
    tier.fixed = true;
    let cost = 0;

    let decorator_cost = 0;
    let supplier_cost = 0;

    if(  magento_item.configuration.item_code ){
        let costs = magento_item.configuration.item_code.split(':');
        supplier_cost = parseFloat( costs[0] );
        decorator_cost = parseFloat( costs[1] );
    } else{
        tier.cost = supplier_cost;
    }

    tier.cost = supplier_cost;
    tier.price = magento_item.price;

    addDecorator( decorator_cost, magento_item, item, logos );

    if( parseFloat(magento_item.tax_amount) === 0 ) item.info.taxable = false;

    item.pricing.base.material.overwrites.decoration = true;
    item.cost.material.tiers.push(tier);
}

function addSubitem( magento_item, item )
{
    item.colors.length = 0;
    item.sizes.length = 0;
    item.subitems.length = 0;

    let size_name = magento_item.configuration.size;
    let color_name = magento_item.configuration.color;

    let size = entity.order.item.size.create(size_name)
    item.sizes.push( size );

    let color = entity.order.item.color.create(color_name);
    item.colors.push( color );

    let subitem = entity.order.item.subitem.create(color);
    item.subitems.push(subitem);

    entity.order.item.subitem.setQtyForSize( magento_item.qty, size, subitem );
}

function addDecorator( decorator_cost, magento_item, item, logos )
{
    if( magento_item.configuration.placements.length < 1 ){
        return;
    }

    let decoration = {
        name: magento_item.configuration.decoration_name,
        placements: magento_item.configuration.placements
    }

    let decorator = entity.order.item.decoration.decorator.create();
    decorator.info.name = decoration.placements[0].decorator;
    decorator.info.id = decoration.placements[0].decorator;

    let sheet = entity.order.item.decoration.decorator.sheet.create(decorator);
    sheet.name = decoration.name;

    const placement_cost = splitPlacementCost( decorator_cost, decoration.placements.length );

    let tier = entity.order.item.tier.create();
    tier.cost = placement_cost.each;

    sheet.cost.push(tier);
    decorator.sheets.push(sheet);

    item.decoration.available.push(decorator);

    decoration.placements.forEach( p => {
        let placement = entity.order.item.decoration.placement.create();
        placement.decorator = sheet;
        placement.location = entity.order.item.decoration.placement.location.createFromId(p.location);

        let logo = entity.order.logo.createFromLogoId(p.logo);
        placement.logo = logo;
        logos.push(logo);

        item.decoration.placements.push(placement);
    })

}

function splitPlacementCost( amount, number_of_placements )
{
    let round = (n, p = 2) => (e => Math.round(n * e) / e)(Math.pow(10, p))
    const each = round( amount / number_of_placements );
    const each_total = round( each * number_of_placements );
    const difference = amount - each_total;

    return {
        each,
        difference
    }
}

function addFees( magento_order, order )
{
    let fee = entity.order.fee.create();
    fee.name = magento_order.delivery_method;

    fee.tier.cost = parseFloat(magento_order.shipping_charge_base);
    fee.tier.price = fee.tier.cost;
    fee.pricing.cost.subtotal = fee.tier.cost;
    fee.pricing.price.subtotal = fee.tier.cost;

    console.log(fee.tier.cost, fee.tier.price);

    if( fee.tier.cost === 0 && fee.tier.price === 0 ) return;

    order.fees.push(fee);
}

function addSubitems( subitems, order )
{
    let groups = {};
    let {items} = order;

    subitems.forEach( subitem => {
        if( !groups[subitem.group] ) groups[subitem.group] = { colors: [], sizes: [], subitems: [] }
        groups[subitem.group].colors.push(subitem.color);
        groups[subitem.group].sizes.push(subitem.size);
        groups[subitem.group].subitems.push(subitem);
    })

    Object.keys(groups).forEach(group_sku => {
        let group = groups[group_sku];
        let item = items.filter( i => i.info.sku === group_sku )[0];
        item.colors.length = 0;
        item.sizes.length = 0;
        item.subitems.length = 0;

        group.sizes.forEach( size_name => {
            item.sizes.push( entity.order.item.size.create(size_name) );
        })
        group.colors.forEach( color_name => {
            let color = entity.order.item.color.create(color_name);
            item.colors.push( color );
            item.subitems.push( entity.order.item.subitem.create(color) );
        })

        group.subitems.forEach( subitem => {
            let targeted_subitem = item.subitems.filter( s => s.color.name === subitem.color )[0];
            let size = item.sizes.filter( s => s.name === subitem.size )[0];
            entity.order.item.subitem.setQtyForSize( subitem.qty, size, targeted_subitem );
        })
    })
}

export default {
    create,
    default: {
      statuses, types
    },
    patchData,
    convertFromQuote,
    convertFromSource,
    attribute: {
        create(){
            return {
                name: '',
                value: ''
            }
        }
    },
    company,
    item: OrderItem,
    fee: OrderFee,
    logo: OrderLogo,
    vendor: OrderVendor
}