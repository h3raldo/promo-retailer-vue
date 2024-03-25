import defaults from "@/js/Quotes/Quote/defaults.js";

export default {
    create(){
        return {
            name: 'New Vendor',
            id: '',
            sage_id: 0,
        }
    },
    getAll(){
        let vendors = [];

        defaults.vendors.list.forEach( v => {
            let vendor = this.create()
            vendor.name = v.name;
            vendor.id = v.id;
            if( v.sage_id ) vendor.sage_id = v.sage_id;
            vendors.push(vendor);
        })

        return vendors;
    }
}