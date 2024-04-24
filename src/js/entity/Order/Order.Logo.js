function create(){
    return {
        id: '',
        name: '',
        variation: '',
        url: '',
        group: '',
    }
}

function getDefault()
{
    let logo = create();
    logo.id = 'your-logo--light';
    logo.name = 'Your logo';
    logo.variation = 'light';
    logo.url = 'https://res.cloudinary.com/promo-retailer/image/upload/logos/your-logo--dark.png';

    return [logo]
}

function createFromLogoId( id )
{
    let logo = create();
    logo.id = id;
    logo.url = `https://res.cloudinary.com/promo-retailer/image/upload/logos/${id}.png`;
    logo.variation = id.split('--')[1];
    logo.name = id;

    return logo;
}

export default {
    create,
    createFromLogoId,
    default: getDefault
}