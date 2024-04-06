export default {
    create( initialized ){
        let option = {
            each: 0,
            name: 'New Option',
            selected: {},
            groups: [],
            visible: false,
            type: 'custom',
        };

        if( initialized !== true ) return option

        option.groups.push(this.group.create(true));
        return option;
    },

    group: {
        create( initialized ){

            let group = {
                name: 'New Group',
                values: []
            }

            if( initialized !== true ) return group;

            group.values.push(this.value.create());
            return group
        },

        value: {
            create(){
                return {
                    name: 'New Value',
                    value: 'new-value',
                    cost: []
                }
            }
        }
    },

    getAllValues( option )
    {
        let values = [];

        option.groups.forEach( g => {
            g.values.forEach( v => values.push(v) )
        })

        return values;
    },

    getOption( name, item )
    {
        let options = item.options.filter( o => o.name === name);
        if( options.length >= 1 )
            return options[0];
        return false;
    },

    arrayToOption( name, array )
    {
        let option = this.create();
        option.name = name;

        let group = this.group.create();

        array.forEach( c => {
            let value = this.group.value.create();
            value.value = c;
            value.name = c;
            group.values.push(value);
        })

        option.groups.push(group);
        return option;
    }
}