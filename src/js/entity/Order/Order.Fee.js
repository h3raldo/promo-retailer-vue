import entity from "@/js/entity.js";

function create(){

    let tier = entity.order.item.tier.create();
    tier.fixed = true;

    return {
        name: 'Service Charge',
        vendor: {},
        qty: 1,
        tier: tier,
        type: 'setup',
        config: {
            tax: {
                enabled: true
            },
        },
        pricing: {
            price: {
                subtotal: 0
            },
            cost: {
                subtotal: 0
            },
            tax: {
                subtotal: 0
            }
        }
    }
}

const types = [
    {
        value: 'shipping',
        title: 'Shipping'
    },
    {
        value: 'setup',
        title: 'Setup Charge'
    },
    {
        value: 'run',
        title: 'Run Charge'
    },
    {
        value: 'rush',
        title: 'Rush Charge'
    },
    {
        value: 'fee',
        title: 'Fee'
    },
]

function addCompany( company, item )
{
    item.vendor.id = company.id;
    item.vendor.name = company.name;
    item.vendor.company_id = company.id;
}

export default {
    create,
    default: {
      types
    },
    addCompany
}