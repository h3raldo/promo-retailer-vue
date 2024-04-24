let default_locations = {
    'lcxxxxxx': 'Left Chest',
    'rsxxxxxx': 'Right Sleeve',
    'byxxxxxx': 'Back Yoke',
    'bkxxxxxx': 'Back',
    'ftxxxxxx': 'Front',
    'lsxxxxxx': 'Left Sleeve',
    'lpxxxxxx': 'Left Panel',
    'rpxxxxxx': 'Right Panel',
    'plxxxxxx': 'Left Pocket',
    'prxxxxxx': 'Right Pocket',
    'rcxxxxxx': 'Right Chest',
    'slxxxxxx': 'Left Side',
    'srxxxxxx': 'Right Side',
    'llxxxxxx': 'Left Full Sleeve',
    'lrxxxxxx': 'Right Full Sleeve',
    'btxxxxxx': 'Bottom',
    'tpxxxxxx': 'Top',
    'rlnsxxxx': 'Right Lens',
    'llnsxxxx': 'Left Lens',
    'tprxxxxx': 'Top Right',
    'tprgxxxx': 'Top Right Glove Facing Out',
    'tprg2xxx': 'Top Right Glove Facing In',
    'ftmpxxxx': 'Front Mousepad',
    'tplxxxxx': 'Top Left',
    'btrxxxxx': 'Bottom Right',
    'btlxxxxx': 'Bottom Left',
    'nonexxxx': 'No Logo',
    'rcfxxxxx': 'Right Cuff'
}

function create(){
    return {
        decorator: {}, /* entity/decorator/sheet */
        location: { name: '', id: '' },
        logo: {}, /* entity/logo */
        logo_color: { name: '' }
    }
}

let location = {
    create(patch={})
    {
       return {
           name: patch.name ?? '',
           id: patch.id ?? ''
       }
    },
    createFromId(id)
    {
        return this.create({
            name: default_locations[id] ?? 'New Location',
            id: id
        })
    }
}

export default {
    create,
    location
}