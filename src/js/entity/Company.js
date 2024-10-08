import entity from "@/js/entity.js";

function create()
{
    return {
        data: {
            type: {
                supplier: false,
                decorator: false
            },
            config: {
                contacts_from_order: true,
            },
            contacts: {
                primary: {},
                approval: {
                    email: '',
                    first_name: '',
                    last_name: '',
                }
            },
            billing: {
                email: '',
                terms: '',
                address: entity.customer.address.create()
            },
            shipping: {
                address: entity.customer.address.create()
            },
            properties: [
                {"name": "username", "value": ""},
                {"name": "password", "value": ""}
            ],
            external: {
                quickbooks: {
                    id: '',
                    display_name: '',
                    company_name: ''
                }
            }
        },
    }
}

function patch( company )
{
    let base = create();

    if( !company.data ) company.data = base.data;
    if( !company.data.properties ) company.data.properties = base.data.properties;
    if( !company.data.contacts ) company.data.contacts = base.data.contacts;
    if( typeof company.data.contacts.approval === 'undefined' ) company.data.contacts.approval = base.data.contacts.approval;
    if( !company.data.type ) company.data.type = base.data.type;
    if( !company.data.info ) company.data.info = base.data.info;
    if( !company.data.billing ) company.data.billing = base.data.billing;
    if( !company.data.shipping ) company.data.shipping = base.data.shipping;
    if( !company.data.external ) company.data.external = base.data.external;
    if( typeof company.data.config === 'undefined' ) company.data.config = base.data.config;

    if( typeof company.data.billing.address.company === 'undefined' ) company.data.billing.address.company = '';
    if( typeof company.data.shipping.address.company === 'undefined' ) company.data.shipping.address.company = '';

    if( company.data.billing.address.country === '' ) company.data.billing.address.country = base.data.billing.address.country;
    if( company.data.shipping.address.country === '' ) company.data.shipping.address.country = base.data.shipping.address.country;
}

export default {
    create,
    patch
}