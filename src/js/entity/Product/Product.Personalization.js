let create = () => {
    return {
        sets: []
    }
}

let set = {
    create( variant, image ){
        return {
            info: {
                name: '',
                slug: ''
            },
            image: {
                variant: { id: variant.id, type: image.type },
                src: image.url,
                ratio: 0,
                rendered: {
                    width: 0,
                    height: 0
                },
                actual: {
                    width: 0,
                    height: 0
                }
            },
            locations: []
        }
    },
    buildFilters( set ){
        if( !set.locations.length )
            return 'co_rgb:000000,l_text:arial_14_normal_left:Keidra%20Matson/fl_layer_apply,g_north_west,x_100,y_100';

        let filters = [];

        set.locations.forEach( location => {
            let text = encodeURIComponent(location.default_text);
            let font_size = Math.floor( location.font_size * set.image.ratio );
            let color = location.color.replace('#', '');
            let left = Math.floor( ( set.image.actual.width / 100 ) * location.left );
            let top = Math.floor( ( (set.image.actual.height / 100 ) * location.top) + font_size/2.6 );
            let font = encodeURIComponent( location.font );

            filters.push( `co_rgb:${color},l_text:${font}_${font_size}_${location.font_weight}_left:${text}/fl_layer_apply,g_north_west,x_${left},y_${top}` );
        })

        return filters.join('/');
    },
    location: {
        create(){
            return {
                top: 0,
                left: 0,
                right: 0,
                color: '#000000',
                default_text: 'Default Text',
                font: 'arial',
                font_size: 14,
                font_weight: 'normal',
                text_align: 'left',
                label: 'Label',
            }
        }
    }
}

export default {
    create,
    set,
}