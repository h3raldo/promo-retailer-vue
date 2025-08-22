import pricing from "@/js/pricing.js";
import config from "@/js/utils/config.js"
import {toRaw} from "vue";

let ajax = {
    fetch(url, method, data, callback, errorCallback)
    {
        let init = {
            method: method
        }

        if( typeof data === 'object' ) {
            init.headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
            init.body = JSON.stringify(data);
        }

        fetch(url, init)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if( typeof data === 'string' )
                    data = JSON.parse(data);
                console.log(url, data);
                callback(data);
            })
            .catch(function (err) {
                console.log('ajax error', url, err);
                if (errorCallback) errorCallback(err);
            });
    },
}

export default
{
    config,
    ajax: ( url, callback, errorCallback, data ) =>
    {
        let method = ( typeof data === 'object' ) ? 'POST' : 'GET';
        ajax.fetch( url, method, data, callback, errorCallback );
    },

    ajaxDelete( url, callback, errorCallback, data=null )
    {
        ajax.fetch( url, 'DELETE', data, callback, errorCallback );
    },

    ajaxPOST( url, callback, errorCallback, data=null )
    {
        ajax.fetch( url, 'POST', data, callback, errorCallback );
    },

    duplicateObject( obj ){
        return JSON.parse(JSON.stringify(toRaw(obj)));
    },

    async ajaxAsync( url, data, method ){

        let init = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        };

        if( typeof data === 'object' ) {
            init.method = 'POST';
            init.body = JSON.stringify(data);
        }

        if( method ) init.method = method;

        const response = await fetch(url, init);
        let r = response.json();

        console.log(url, data);
        return r;
    },

    ajaxButtons: {
        multi: {
            click: button => {
                let call = ( url, cb ) => {
                    try {
                        fetch(url)
                            .then(r => r.json())
                            .then(data => {
                                console.log(data);
                                cb(data)
                            })
                    } catch (error){
                        console.log('ERROR IN CALL', error);
                        alert('Error with button call. Error logged in console.')
                    }
                }

                let urls = [];
                let text = button.querySelector('span');
                button.querySelectorAll('input').forEach( i => urls.push({url: i.value, title: i.name }) )
                console.log(urls);

                let i = 0;

                let sendCalls = () => {
                    console.log(urls);
                    console.log(i);
                    console.log(urls[i]);
                    if( !urls[i] ) {
                        text.innerText = 'Done!'
                        return;
                    }

                    text.innerText = urls[i].title;
                    call(urls[i].url, (data) => {
                        i++;
                        sendCalls();
                    })
                }

                button.disabled = true;
                sendCalls(i);
            },
        },

        single: {
            click(button){
                let refresh = button.getAttribute('data-refresh') === "true";
                let url = button.getAttribute('data-url');

                button.disabled = true;
                if( refresh )
                    button.innerText = 'Refreshing...'
                else
                    button.innerText = 'Importing...'

                fetch( url )
                    .then( r => r.json() )
                    .then( data => {
                        console.log( data );
                        if( refresh ) {
                            button.innerText = 'Done! Refreshing page...';
                            location.reload();
                        } else{
                            button.innerText = 'Done!';
                        }
                    })
            }
        }

    },

    pricing: pricing,

    time: {
        getDateAsString( provided ) {
            let date = new Date();
            if( provided ) date = new Date(provided)
            return this.dateToString(date);
        },
        dateToString( date, iso=true ){
            let month = date.getMonth() + 1;
            if( month < 10 ) month = '0' + month;

            let day = date.getDate();
            if( day < 10 ) day = '0' + day;

            return `${date.getFullYear()}-${month}-${day}`
        },
        dateToNiceString( stringDate, short=false )
        {
            let date = new Date(stringDate+'T12:00:00'+this.getUserTimezoneOffset()+':00');

            let options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }

            if( short ){
                options = {
                    year: '2-digit',
                    month: 'numeric',
                    day: 'numeric',
                }
            }

            return date.toLocaleDateString('en-us', options);
        },
        getUserTimezoneOffset()
        {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
            const getOffset = (tz) => Intl.DateTimeFormat("ia", {
                timeZoneName: "shortOffset",
                timeZone : tz
            })
                .formatToParts()
                .find((i) => i.type === "timeZoneName").value // => "GMT+/-hh:mm"
                .slice(3);

            let offset = getOffset(tz);
            let type = offset[0];
            let without = offset.substring(1);
            if( without.length < 2 ) without = '0' + without;

            return `${type}${without}`;
        },
        removeDays( date, days ){
            let temp = new Date(date);
            temp.setDate(temp.getDate()-days);
            return this.dateToString(temp)
        }
    },

    tiers: {
        sort( tiers ){
            let compare = ( a, b ) => {
                if( a.qty < b.qty ) return -1;
                if( a.qty > b.qty ) return 1;
                return 0
            }
            return tiers.sort(compare);
        }
    },

    slugify(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
        str = str.toLowerCase(); // convert string to lowercase
        str = str.replace(/[^a-z0-9& -]/g, '') // remove any non-alphanumeric characters
            .replace(/\s+/g, '-') // replace spaces with hyphens
            .replace(/-+/g, '-'); // remove consecutive hyphens
        return str;
    },

    array: {

        move(direction, fromIndex, items) {
            let toIndex = fromIndex;

            switch (direction){
                case 'up':
                    toIndex--;
                    break;
                case 'down':
                    toIndex++;
                    break;
            }

            let element = items[fromIndex];
            items.splice(fromIndex, 1);
            items.splice(toIndex, 0, element);
        },

    },

    form: {
        toGetParams( form ){
            let params = [];

            let inputs = form.elements;

            for (let i = 0; i < inputs.length; i++) {
                let input = inputs[i];

                if( !input.name ) continue;
                if( input.type === 'checkbox' && input.checked !== true ) continue;

                params.push( input.name + '=' + encodeURIComponent(input.value) );
            }

            return params.join('&')
        },
        paramsToArray( form, ignoreEmpty ){
            let params = [];

            let inputs = form.elements;

            for (let i = 0; i < inputs.length; i++) {
                let input = inputs[i];

                if( !input.name ) continue;
                if( input.type === 'checkbox' && input.checked !== true ) continue;

                if (!(ignoreEmpty && input.value === '')) {
                    params.push({
                        name: input.name,
                        value: input.value
                    });
                }
            }

            return params;
        }
    },

    entity: {
        product: {
            vendorColorToSlug(color) {
                const search = [/ /g, /\//g, / {2}/g, / /g, /\*/g];
                const replace = ['-', '-', '-', '-', ''];

                color = color.trim();

                search.forEach((pattern, index) => {
                    color = color.replace(pattern, replace[index]);
                });

                return color.toLowerCase();
            }
        }
    },
}