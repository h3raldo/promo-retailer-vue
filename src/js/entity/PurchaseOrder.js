import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

function create(id){
    return {
        id: id,
        info: {
            title: 'New Purchase Order',
            status: 'open',
            statuses: {
                sent: false,
                paid: false,
                shipped: false,
            },
            date: utils.time.getDateAsString(),
            deliver_by: '',
            deliver_by_strict: false,
            ship_by: '',
            ship_to: `Promo Retailer \n14655 Northwest Fwy, Suite 127C \nHouston, TX 77040`,
            ship_blind: false,
            bill_to: `Promo Retailer \n14655 Northwest Fwy, Suite 127C \nHouston, TX 77040`,
            type: 'supplier',
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
            events: [],
            attributes: [],
            references: [],
        },
        config: {
            tax: {
                enabled: false
            },
            decoration: {
                placements: false,
                supplier: false,
            },
            price: false,
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
    { value: 'open', title: 'Open'},
    { value: 'sent', title: 'Sent'},
    { value: 'complete', title: 'Complete'},
];

function patchData( po, init )
{
    if( !po.info.follow_up_date ) po.info.follow_up_date = '';
    if( !po.info.follow_up_note ) po.info.follow_up_note = '';
    if( typeof po.info.ship_by === 'undefined' ) po.info.ship_by= '';
    if( typeof po.info.ship_blind === 'undefined' ) po.info.ship_blind = false;
    if( !po.info.events ) po.info.events = [];
    if( typeof po.info.statuses.shipped === 'undefined' ) po.info.statuses.shipped = false;

    let logos = []
    po.items.forEach( item => {
        item.decoration.placements.forEach( placement => {
            if( !placement.logo || !placement.logo.id ) return;
            let existing_logos = logos.filter( l => l.id === placement.logo.id )
            if( existing_logos.length > 0 ) return;
            logos.push( placement.logo );
        })
    })

    po.info.status = init.status;
    po.info.deliver_by = init.dateDeliverBy || '';
    po.info.ship_by = init.dateShipBy || '';

    return {
        po, logos
    };
}

function fromOrder( order, company_id, decorator_code)
{
    let po = create(null);
    let is_decorator = typeof decorator_code !== 'undefined';

    if( is_decorator ) po.info.type = 'decorator';

    po.info.deliver_by = order.info.deliver_by;
    po.info.deliver_by_strict = order.info.deliver_by_strict;
    po.info.title = order.info.title;

    order.items.forEach( item => {

        let matched_decorator = false;
        if( is_decorator ) {
            item.decoration.placements.forEach(p => {
                if (p.decorator && p.decorator.info && p.decorator.info.id
                    && entity.order.vendor.getDecoratorCompanyID(p.decorator.info.id) === company_id + ''
                ) matched_decorator = true;
            })
        }

        let matched_supplier = ( item.info.supplier && item.info.supplier.company_id && item.info.supplier.company_id === company_id );

        if( matched_decorator || matched_supplier ){
            po.items.push(fromOrderItemPrepare(item, is_decorator, matched_supplier));
        }
    })

    order.fees.forEach( f => {
        if( !f.vendor || !f.vendor.company_id || f.vendor.company_id !== company_id ) return;
        f.tier.price = f.tier.cost;
        f.tier.margin = 0;
        f.tier.fixed = true;
        po.fees.push(f);
    })

    return po;
}

function fromOrderItemPrepare( item, is_decorator, is_supplier )
{
    item.pricing.base.material.overwrites.decoration = !is_decorator;

    handleSupplierTiers( item.cost.material.tiers, is_decorator );

    item.decoration.placements.forEach( p => {
        // re-attach the price sheets
        item.decoration.available.forEach( d => {
            d.sheets.forEach( s => {
                if( s.name === p.decorator.name ) p.decorator = s;
            })
        })

        if( !p.decorator || !p.decorator.cost ) return;
        p.decorator.cost.forEach( t => {
            setTierToCost(t)
        })
    })

    item.options.forEach( o => {
        o.groups.forEach( g => {
            g.values.forEach( v => {
                v.cost.forEach( t => {
                    setTierToCost(t)
                })
            })
        })
    })

    item.sizes.forEach( s => {
        handleSupplierTiers( s.cost, is_decorator )
    })

    item.colors.forEach( s => {
        handleSupplierTiers(s.cost, is_decorator)
    })

    return item;
}

function handleSupplierTiers( tiers, is_decorator, is_supplier )
{
    tiers.forEach( t => {
        if( is_decorator && !is_supplier ){
            t.cost = 0;
            t.price = 0;
            t.margin = 0;
            t.fixed = true;
            return;
        }

        setTierToCost(t)
    })
}

function setTierToCost(t){
    t.price = t.cost;
    t.margin = 0;
    t.fixed = true;
}

let item = {
    create(){
        return entity.order.item.create();
    }
}

export default {
    create,
    default: {
        statuses
    },
    item,
    patchData,
    fromOrder,
}