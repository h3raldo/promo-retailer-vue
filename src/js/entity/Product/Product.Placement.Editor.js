let rotation = (() => {

    let calcNewRotation = ( vertex, position ) =>
    {
        let angle = position.rotation;

        let cx = position.width / 2;
        let cy = position.height / 2;
        let x = vertex.x;
        let y = vertex.y;

        if( angle >= 90 || angle <= -90 ){
            cx = position.height / 2;
            cy = position.width / 2;

            if (angle > 90) {
                angle -= 90;
            } else if (angle < -90) {
                angle += 90; // Shift negative angles into the correct range
            }

        }

        let radians = (Math.PI / 180) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
            ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

        return {
            x: Math.floor(nx),
            y: Math.floor(ny - y) * -1
        }
    }

    let calcRotationDifference = ( position ) =>
    {
        let corner = {
            top: {
                left: { x: 0, y: position.height },
                right: { x: position.width, y: position.height }
            },
            bottom: {
                left: { x: 0, y: 0 }
            },
            inverse: {
                top: {
                    left: { x: 0, y: position.width },
                    right: { x: position.height, y: position.width }
                },
                bottom: {
                    left: { x: 0, y: 0 }
                }
            }
        }

        // console.log('rotation', position.rotation, typeof position.rotation, corner);

        if( position.rotation > 0 && position.rotation < 90 ){ // rotate right < 90
            return {
                x: calcNewRotation( corner.bottom.left, position ).x,
                y: calcNewRotation( corner.top.left, position ).y
            }
        } else if( position.rotation < 0 && position.rotation > -90 ){ // rotate left > -90
            return {
                x: calcNewRotation( corner.top.left, position ).x,
                y: calcNewRotation( corner.top.right, position ).y
            }
        } else if( position.rotation > 90 && position.rotation < 180 ){ // rotate right > 90
            return {
                x: calcNewRotation( corner.inverse.bottom.left, position ).x,
                y: calcNewRotation( corner.inverse.top.left, position ).y
            }
        } else if( position.rotation < -90 && position.rotation > -180 ){ // rotate left > 90

            console.log( 'result', corner,  calcNewRotation(corner.inverse.top.left, position).y );

            return {
                x: calcNewRotation(corner.inverse.top.left, position).x,
                y: calcNewRotation(corner.inverse.top.right, position).y
            }
        } else if( position.rotation === -90 ){
            return {
                x: calcNewRotation(corner.top.right, position).x,
                y: calcNewRotation(corner.inverse.top.right, position).y * -1
            }
        } else if( position.rotation === 90 && position.width > position.height ){
            return {
                x: calcNewRotation( corner.top.left, position ).x,
                y: calcNewRotation( corner.top.left, position ).y
            }
        }

        return { x: 0, y: 0 };
    }

    return {
        calcRotationDifference: calcRotationDifference,
        calcNewRotation: calcNewRotation
    }

})();

let image = {

    addRatioToPosition(position, product, image_url){
        let img = document.createElement('img');
        img.src = image_url;
        img.addEventListener('load', e => {
            let i = e.target;
            position.ratio = {
                render: {
                    width: i.width,
                    height: i.height,
                },
                value: {
                    width: product.width,
                    height: product.height
                }
            }
        })
    },

    getRatioValues( position )
    {
        let ratio_w = position.ratio.render.width / position.ratio.value.width;
        let ratio_h = position.ratio.render.height / position.ratio.value.height;

        console.log(position);

        return {
            left: Math.floor( (position.left + position.cloudinary.rotation.x) * ratio_w ),
            top: Math.floor( (position.top + position.cloudinary.rotation.y) * ratio_h ),
            width: Math.floor( position.width * ratio_w ),
            height: Math.floor( position.height * ratio_h ),
            rotation: position.rotation
        }
    },

    generateTest( logo_id, position, image )
    {
        let values = this.getRatioValues( position );

        let params = new URLSearchParams();
        params.set( 'manual', true );
        params.set( 'logo', logo_id );
        params.set( 'left', values.left );
        params.set( 'top', values.top );
        params.set( 'rotation', values.rotation );
        params.set( 'width', values.width );
        params.set( 'height', values.height );

        let url = image + '?' + params.toString();

        window.open(url, '_blank');

        return url;
    }

}

let variation = (() => {

    function createPlacements( placements, color )
    {
        let clone = JSON.parse( JSON.stringify(placements) );
        if( !placements.children ){
            placements.children = {};
        }

        delete clone.children;

        placements.children[color] = clone;
    }

    return {
        createPlacements
    }

})()

export default {
    rotation,
    image,
    variation
}