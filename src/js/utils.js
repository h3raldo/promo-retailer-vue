export default
{
    ajax: ( url, callback, errorCallback, data ) => {

        let init = {
            method: 'GET'
        }

        if( typeof data === 'object' ){
            init.method = 'POST';
            init.headers = {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            };
            init.body = JSON.stringify(data);
        }

        fetch(url, init).then(function (response) {
            return response.json();
        }).then(function (data) {
            if( typeof data === 'string' )
                data = JSON.parse(data);
            console.log(url, data);
            callback(data);
        }).catch(function (err) {
            console.log('ajax error', url, err);
            if (errorCallback) errorCallback(err);
        });
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

    pricing: {
        format( price ){
            let USDollar = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            return USDollar.format(price)
        },
    }
}