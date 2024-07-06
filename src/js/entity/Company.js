import entity from "@/js/entity.js";

function create()
{
    return {
        data: {
            properties: [],
            type: { supplier: false, decorator: false },
            billing: { address: entity.customer.address.create() },
            shipping: { address: entity.customer.address.create() }
        },
    }
}

function patch( company )
{
    let base = create();

    if( !company.data ) company.data = base.data;
    if( !company.data.properties ) company.data.properties = base.data.properties;
    if( !company.data.type ) company.data.type = base.data.type;
    if( !company.data.billing ) company.data.billing = base.data.billing;
    if( !company.data.shipping ) company.data.shipping = base.data.shipping;

    if( typeof company.data.billing.address.company === 'undefined' ) company.data.billing.address.company = '';
    if( typeof company.data.shipping.address.company === 'undefined' ) company.data.shipping.address.company = '';

    if( company.data.billing.address.country === '' ) company.data.billing.address.country = base.data.billing.address.country;
    if( company.data.shipping.address.country === '' ) company.data.shipping.address.country = base.data.shipping.address.country;
}

export default {
    create,
    patch
}