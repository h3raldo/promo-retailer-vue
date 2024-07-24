export default {
    address: {
        create( init ){
            let address =  {
                company: '',
                first_name: '',
                last_name: '',
                address_line_1: '',
                address_line_2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'United States',
                phone: '',
            }

            return Object.assign( address, init );
        }
    }
}