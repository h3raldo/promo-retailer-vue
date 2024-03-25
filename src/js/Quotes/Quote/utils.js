import sage from "@/js/Quotes/Quote/utils/sage.js";
import pricing from "@/js/Quotes/Quote/pricing.js";
import utils from "@/js/utils.js";

export default
{
    ajax: utils.ajax,
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
    sage: sage,
    pricing: pricing
}