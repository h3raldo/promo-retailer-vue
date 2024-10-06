let default_vendors = [
    { name: 'None', id: '', company_id: '', sage_id: '' },
    { name: 'Airline Graphics', id: '4141623000000122080', company_id: '7', sage_id: '' },
    { name: 'Ariel Premium Supply Inc', id: '20', company_id: '20', sage_id: '' },
    { name: 'Digispec', id: '19', company_id: '19', sage_id: '' },
    { name: 'Compass Industries', id: '4141623000000122431', company_id: '8', sage_id: '' },
    { name: 'Fluid Threads', id: '4141623000000151009', company_id: '9', sage_id: '' },
    { name: 'Hit Promotional Products Inc', id: '4141623000000122700', company_id: '10', sage_id: '' },
    { name: 'PR Inventory', id: '4141623000002551158', company_id: '17', sage_id: '' },
    { name: 'PR Production', id: '4141623000000120037', company_id: '6', sage_id: '' },
    { name: 'PIP Global', id: '4141623000000123022', company_id: '11', sage_id: '' },
    { name: 'Pro Golf Premiums', id: '4141623000000524177', company_id: '12', sage_id: '' },
    { name: 'Reflection Printing', id: '4141623000001740001', company_id: '13', sage_id: '' },
    { name: 'S&S Activewear', id: '4141623000000123123', sage_id: 62662, company_id: '14' },
    { name: 'Sanmar', id: '4141623000000123147', company_id: '15', sage_id: '' },
    { name: 'Stanco', id: '4141623000000524113', company_id: '16', sage_id: '' },
];

let default_decorators = [
        { id: 'proemba', company_id: '199' },
        { id: 'proemb1', company_id: '199' },
        { id: 'proscra', company_id: '200' },
        { id: 'proscrb', company_id: '200' },
        { id: 'proemb', company_id: '199' },
        { id: 'prolas', company_id: '201' },
        { id: 'prouvp', company_id: '6' },
        { id: 'provin', company_id: '6' },
        { id: 'prodtg', company_id: '6' },
        { id: 'proscr', company_id: '200' },
        { id: 'pippp1', company_id: '11' },
        { id: 'pipsp3', company_id: '11' },
        { id: 'pipsp2', company_id: '11' },
        { id: 'pipsp1', company_id: '11' },
        { id: 'pippp2', company_id: '11' },
        { id: 'pippp3', company_id: '11' },
        { id: 'driimp', company_id: '26' },
        { id: 'rtictmlas', company_id: '27' },
        { id: 'fluemb', company_id: '25' },
    ]
;

function create(){
    return {
        name: 'New Vendor',
        id: '',
        sage_id: 0,
    }
}

function getDecoratorCompanyID( decorator_id )
{
    let results = default_decorators.filter( d => d.id === decorator_id );
    if( !results.length ) return false;

    return results[0].company_id;
}

function getAll(){
    return default_vendors; // to reference the same object when lookups happen on the default vendors
    /*
    let vendors = [];

    default_vendors.forEach( v => {
        let vendor = this.create()
        vendor.name = v.name;
        vendor.id = v.id;
        if( v.sage_id ) vendor.sage_id = v.sage_id;
        vendors.push(vendor);
    })

    return vendors;
     */
}

function findByZohoID( id )
{
    let results = default_vendors.filter( v => v.id === id);
    if( results[0] ) return results[0];
    return false;
}


export default {
    create,
    getAll,
    findByZohoID,
    getDecoratorCompanyID
}