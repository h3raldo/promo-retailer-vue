import pricing from "@/js/Quotes/Quote/pricing.js";
import entity from "@/js/Quotes/Quote/entity.js";
import utils from "@/js/Quotes/Quote/utils.js";
export default
{
    toQuoteItem( sageItem )
    {
        sageItem = structuredClone(sageItem);
        let item = entity.item.create();
        item.id = sageItem.prodEid;
        item.info.sku = sageItem.itemNum;
        item.info.name = sageItem.prName;

        item.info.image.available = this.getImages( sageItem );
        if( item.info.image.available.length > 0 )
            item.info.image.primary = item.info.image.available[0].url;

        item.info.supplier.sage_id = sageItem.suppId;
        item.info.supplier.name = sageItem.supplier.coName;

        let sageOptions = this.getOptions(sageItem);
        item.options = sageOptions.options;
        if( sageOptions.sizes.length > 0 )
            item.sizes = sageOptions.sizes;
        if( sageOptions.colors.length > 0 )
            item.colors = sageOptions.colors;
        item.cost.material.tiers = this.getCostTiers(sageItem)
        item.subitems[0].qty = pricing.getMinimum(item);
        return item;
    },

    getImages( sageItem ){
        let images = [];

        if( sageItem.pics && sageItem.pics.length > 0 ){
            sageItem.pics.forEach( p => {
                let img = entity.item.image.create();
                img.url = p.url;
                img.caption = p.caption;
                images.push(img);
            })
        }

        return images;
    },

    getOptions(sageItem)
    {
        let options = [];
        let colors = [];
        let sizes = [];

        sageItem.options.forEach( option => {

            if( option.Name.toLowerCase() === 'sizes' || option.Name.toLowerCase() === 'size' ){

                option.Values.forEach( value => {
                    let size = entity.item.size.create();
                    size.name = value.Value;
                    size.cost = this.matchPriceToQty( sageItem.qty, value.Net );
                    sizes.push(size);
                })

                return;
            }

            let new_option = entity.item.option.create();
            new_option.type = 'sage';
            new_option.name = option.Name;

            let group = entity.item.option.group.create();
            group.name = option.Name;

            option.Values.forEach( value => {

                let v = entity.item.option.group.value.create();
                v.name = value.Value;
                v.value = value.Value;
                v.cost = this.matchPriceToQty( sageItem.qty, value.Net );
                pricing.applyDefaultMarginToTiers(v.cost);

                group.values.push(v);
            })

            new_option.groups.push(group);

            options.push(new_option);
        })

        sageItem.colors.split(',').forEach( color => {
            let c = entity.item.color.create();
            c.name = color;
            colors.push(c);
        })

        return {
            options: options,
            colors: colors,
            sizes: sizes
        };
    },

    getCostTiers(sageItem)
    {
        return this.matchPriceToQty( sageItem.qty, sageItem.net );
    },

    matchPriceToQty( qty, prices )
    {
        let data = [];
        qty = qty.filter( q => parseInt(q) > 0);

        qty.forEach( (q, i) => {
            let tier = entity.item.tier.create();
            tier.qty = parseInt(q);
            if( prices && prices[i] ) {
                tier.cost = parseFloat(prices[i]) || 0;
                tier.price = pricing.addMargin(tier.cost);
            }
            data.push(tier);
        });

        return utils.tiers.sort( data );
    },

    /**
     * Post-processing of item, mainly to properly add the vendor if it doesn't exist in list of vendors
     * @param item
     * @param vendors
     */
    postCreation( item, vendors )
    {
        let matched_vendor = vendors.filter( v => v.sage_id === item.info.supplier.sage_id );
        if( matched_vendor.length > 0 ){
            item.info.supplier = matched_vendor[0];
            return;
        }

        let new_vendor =entity.vendor.create();
        new_vendor.sage_id = item.info.supplier.sage_id;
        new_vendor.name = item.info.supplier.name;

        item.info.supplier = new_vendor;
        vendors.push(new_vendor);
    }

}