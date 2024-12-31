
let images = [
    { id: 'front-flat', name: "Front Flat" },
    { id: 'back-flat', name: "Back Flat" },
    { id: 'front-model', name: "Front Model" },
    { id: 'back-model', name: "Back Model" },
]

function create()
{
    return {
        id: null,
        sku: '',
        name: '',
        size: 'OS',
        status: 'enabled',
        color: 'Default',
        color_secondary: '',
        color_parent: '',
        color_parent_secondary: '',
        images: [],
        cost: 0,
        cost_tiers: null,
        weight: 0,
    }
}

export default {
    create,
    image: {
        create(){
            return {
                type: 'front-flat',
                url: ''
            }
        }
    },
    defaults: {
        images
    }
}