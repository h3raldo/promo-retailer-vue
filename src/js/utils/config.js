import utils from "@/js/utils.js";

let keys = {
    approvalEmail: 'email/order/approval',
    globalInputs: 'global:product:custom_fields',
    globalCategories: 'global/product/categories',
    decorationLocations: 'global/decoration/locations',
    decorationSets: 'global/decoration/sets',
    decorationGroups: 'global/decoration/groups',
}

let retrieve = ( key, callback, error_callback  ) => {
    utils.ajax(self.symfony.api.config.get + '?path=' + key, (response) => {
        if( !response.value ) callback(null);
        callback( response.value );
    }, error_callback)
}

export default {
    get: {
        option( key, callback, error_callback ){
            console.log('want to get', key, keys[key])
            retrieve( keys[key], callback, error_callback );
        },
        approvalEmail( callback, error_callback ) {
            retrieve( keys.approvalEmail, callback, error_callback );
        },
        globalCategories( callback, error_callback ) {
            retrieve( keys.globalCategories, callback, error_callback );
        },
    },
    keys
}

/**
 * MIGRATE
 * Generate individual sets from config sets
 * GROUPS - change sets --> placements KEY
 * GROUPS -
 */