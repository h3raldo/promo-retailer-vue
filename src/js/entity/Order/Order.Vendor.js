let default_vendors = [
    { name: 'None', id: '' },
    { name: 'Airline Graphics', id: '4141623000000122080' },
    { name: 'Compass Industries', id: '4141623000000122431' },
    { name: 'Fluid Threads', id: '4141623000000151009' },
    { name: 'Hit Promotional Products Inc', id: '4141623000000122700' },
    { name: 'PR Inventory', id: '4141623000002551158' },
    { name: 'PR Production', id: '4141623000000120037' },
    { name: 'PIP Global', id: '4141623000000123022' },
    { name: 'Pro Golf Premiums', id: '4141623000000524177' },
    { name: 'Reflection Printing', id: '4141623000001740001' },
    { name: 'S&S Activewear', id: '4141623000000123123', sage_id: 62662 },
    { name: 'Sanmar', id: '4141623000000123147' },
    { name: 'Stanco', id: '4141623000000524113' },
]

function create(){
    return {
        name: 'New Vendor',
        id: '',
        sage_id: 0,
    }
}

function getAll(){
    let vendors = [];

    default_vendors.forEach( v => {
        let vendor = this.create()
        vendor.name = v.name;
        vendor.id = v.id;
        if( v.sage_id ) vendor.sage_id = v.sage_id;
        vendors.push(vendor);
    })

    return vendors;
}


export default {
    create: create,
    getAll: getAll
}