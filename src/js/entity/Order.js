import OrderItem from "@/js/entity/Order/Order.Item.js";
import OrderFee from "@/js/entity/Order/Order.Fee.js";
import OrderLogo from "@/js/entity/Order/Order.Logo.js";
import OrderVendor from "@/js/entity/Order/Order.Vendor.js";
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

function create(id){
    let date = new Date();
    return {
        id: id,
        info: {
            title: 'New Order',
            status: 'new',
            category: 'standard',
            reference_number: '',
            po_number: '',
            source: 'quote',
            date: date.toISOString().split('T')[0],
            deliver_by: date.toISOString().split('T')[0],
            deliver_by_strict: false,
            attributes: [],
            events: [],
            notes: {
                public: '',
                private: '',
                flags: []
            },
            company: {
                id: '',
                name: '',
                parent: '',
                parent_name: '',
            }
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
    let order = data.order;

    order.id = init.id;
    order.info.status = init.status;

    if( typeof order.info.po_number === 'undefined' ) order.info.po_number = '';
    if( typeof order.info.attributes === 'undefined' ) order.info.attributes = [];
    if( typeof order.config === 'undefined' ) order.config = { tax: { enabled: false } }
    if( typeof order.info.tax === 'undefined' ) order.info.tax = false;
    if( typeof order.totals.tax === 'undefined' ) order.totals.tax = 0;
    if( typeof order.totals.paid === 'undefined' ) order.totals.paid = 0;
    if( typeof order.info.company === 'undefined' ) order.info.company = {name: '', id: '', parent: '', parent_name: ''};
    if( typeof order.info.events === 'undefined' ) order.info.events = [];

    order.fees.forEach( f => {
        if( typeof f.config === 'undefined' ) f.config = {tax: {enabled: true}}
    })

    return order;
}

function convertFromQuote( quote )
{
    let order = JSON.parse(JSON.stringify(quote));
    order.info.reference_number = quote.id;
    order.info.status = 'new';
    order.info.source = 'quote';
    return order;
}

function convertFromSource( data, cb )
{
    let order_data = JSON.parse(data.data);

    if( order_data.source === 'magento' ){
        console.log('attempt convert from magento', order_data);
        let order = entity.order.create(data.init.id);
        let logos = [];

        utils.ajax(`https://promoretailer.com/pr_api/?order=${order_data.source_id}`, (magento_order) => {

            order.info.source = 'magento';
            let stores = magento_order.store.split(':');
            order.info.title = `Web Order - ${stores[0].trim()} (${stores[stores.length-1].trim()})`;

            order.info.date = magento_order.date;
            order.client.name = magento_order.extra.customer.name.first + ' ' + magento_order.extra.customer.name.last;
            order.client.email = magento_order.extra.customer.email;
            // order.info.notes.public = magento_order.notes; // moved to attributes
            // order.info.notes.private = 'Store: ' + magento_order.store;  // moved to attributes
            order.totals.paid = magento_order.paid;

            if( magento_order.extra.customer.address.shipping.text ){
                order.client.ship_to = magento_order.extra.customer.address.shipping.text
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

            if( magento_order.company_id && magento_order.company_id !== '' ){
                utils.ajax(window.symfony.api.companies.company.get.replace(':id', magento_order.company_id), (res) => {
                    if( res.entity ) {
                        order.info.company.name = res.entity.name;
                        order.info.company.parent_name = res.entity.parent_name;
                        order.info.company.id = res.entity.id;
                    }
                    cb(order, logos);
                })
            } else{
                cb(order, logos);
            }
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
    item: OrderItem,
    fee: OrderFee,
    logo: OrderLogo,
    vendor: OrderVendor
}