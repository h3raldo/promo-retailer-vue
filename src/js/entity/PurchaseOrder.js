import entity from "@/js/entity.js";

function create(id){
    let date = new Date();
    return {
        id: id,
        info: {
            title: 'New Purchase Order',
            status: 'open',
            statuses: {
                sent: false,
                paid: false,
            },
            date: date.toISOString().split('T')[0],
            deliver_by: date.toISOString().split('T')[0],
            deliver_by_strict: false,
            follow_up_date: '',
            follow_up_note: '',
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

function patchData( data, init )
{
    let po = data.po;
    if( !po.info.follow_up_date ) po.info.follow_up_date = '';
    if( !po.info.follow_up_note ) po.info.follow_up_note = '';
    if( typeof po.info.ship_blind === 'undefined' ) po.info.ship_blind = false;
    if( !po.info.events ) po.info.events = [];

    return po;
}

function fromOrder( order, company_id, decorator_code)
{
    let po = create(null);
    let is_decorator = typeof decorator_code !== 'undefined';

    if( is_decorator ) po.info.type = 'decorator';

    po.info.deliver_by = order.info.deliver_by;
    po.info.deliver_by_strict = order.info.deliver_by_strict;

    order.items.forEach( item => {
        if( is_decorator ){
            let matched = false;
            item.decoration.placements.forEach( p => {
                if( p.decorator.info.id === decorator_code ) matched = true;
            })
            if( matched === true ) po.items.push( fromOrderItemPrepare(item, is_decorator) );
            return;
        }

        if( !item.info.supplier || !item.info.supplier.company_id || item.info.supplier.company_id !== company_id ) return;
        po.items.push( fromOrderItemPrepare(item, is_decorator) );
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

function fromOrderItemPrepare( item, is_decorator )
{
    item.pricing.base.material.overwrites.decoration = !is_decorator;

    item.cost.material.tiers.forEach( t => {

        if( is_decorator ){
            t.cost = 0;
            t.price = 0;
            t.margin = 0;
            t.fixed = true;
            return;
        }

        t.price = t.cost;
        t.margin = 0;
        t.fixed = true;
    })

    item.decoration.placements.forEach( p => {
        // re-attach the price sheets
        item.decoration.available.forEach( d => {
            d.sheets.forEach( s => {
                if( s.name === p.decorator.name ) p.decorator = s;
            })
        })

        if( !p.decorator || !p.decorator.cost ) return;
        p.decorator.cost.forEach( t => {
            t.price = t.cost;
            t.margin = 0;
            t.fixed = true;
        })
    })

    item.options.forEach( o => {
        o.groups.forEach( g => {
            g.values.forEach( v => {
                v.cost.forEach( t => {
                    t.price = t.cost;
                    t.margin = 0;
                    t.fixed = true;
                })
            })
        })
    })

    return item;
}

let item = {
    create(){
        return entity.order.item.create();
    }
}

export default {
    create,
    item,
    patchData,
    fromOrder,
}