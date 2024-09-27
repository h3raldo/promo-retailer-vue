import utils from "@/js/utils.js";

function approvalEmail( callback, error_callback )
{
    utils.ajax(self.symfony.api.config.get + '?path=email/order/approval', (response) => {
        if( !response.value ) callback(null);
        callback( response.value );
    }, error_callback)
}

export default {
    get: {
        approvalEmail
    }
}