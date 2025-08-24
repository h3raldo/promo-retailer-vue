import {defineStore, acceptHMRUpdate} from "pinia";
import {reactive, ref, toRaw} from "vue";
import api from "@/js/api.js";
import entity from "@/js/entity.js";
import pricing from "@/js/pricing.js";

export const useQuoteStore = defineStore('quote', () => {

    let order = reactive(
        entity.quote.create( false )
    );

    const logos = reactive([]);
    const vendors = reactive([]);
    let edited = ref(false);

    const fn = {
        item: {
            add( new_item = {} )
            {
                let item = Object.assign( entity.quote.item.create(), new_item)
                // if( item.sizes.length === 1 ) item.sizes = entity.order.item.defaults.sizes();
                order.items.push(item);

                updatePricing();
            },
            duplicate( index ){
                let item = JSON.parse(JSON.stringify(toRaw(order.items[index])));
                item.row_id = '';
                item.local_id = 'order-item-' + Date.now();
                fn.item.add(item);
            },
            move(fromIndex, direction) {
                let toIndex = fromIndex;

                switch (direction){
                    case 'up':
                        toIndex--;
                        break;
                    case 'down':
                        toIndex++;
                        break;
                }

                let element = order.items[fromIndex];
                order.items.splice(fromIndex, 1);
                order.items.splice(toIndex, 0, element);
            },
            async addSageItem( sage_item )
            {
                let item = await api.sage.toQuoteItem(sage_item);
                console.log('supplier added?', item.info.supplier);
                // api.sage.postCreation(item, vendors);
                fn.item.add(item);
            },
            async replaceWithSageItem( index, sage_item )
            {
                let item = order.items[index];
                let sageItem = await api.sage.toQuoteItem(sage_item);
                console.log(sageItem);
                api.sage.postCreation(sageItem, vendors);
                item.info.name = sageItem.info.name;
                item.info.sku = sageItem.info.sku;
                item.info.supplier = sageItem.info.supplier;
                item.info.image.primary = sageItem.info.image.primary;
                item.info.image.available = sageItem.info.image.available;
            },
            remove( index )
            {
                order.items.splice(index, 1);
            }
        },
        fee: {
            add( new_fee = {} )
            {
                let fee = Object.assign( entity.quote.fee.create(), new_fee)
                order.fees.push(fee);

                updatePricing();
            },
            remove( index ){
                order.fees.splice(index, 1);
                updatePricing();
            }
        },
        vendor: {
            set( data )
            {
                vendors.length = 0;
                data.forEach( d => vendors.push(d) );
            },
            add( new_vendor={} )
            {
                let vendor = Object.assign( entity.quote.vendor.create(), new_vendor)
                vendors.push( vendor );
            },
            remove(index)
            {
                vendors.splice(index, 1);
            },
        },
        logo: {
            set( data )
            {
                logos.length = 0;
                data.forEach( d => logos.push(d) );
            },
            add( new_logo={} )
            {
                let logo = Object.assign( entity.order.logo.create(), new_logo)
                logos.push( logo );
            },
            addCustomLogo()
            {
                let logo = entity.order.logo.default()[0];
                logo.id += Math.floor(Math.random() * 500);
                logos.push( logo );
                console.log('log', logos);
            },
            remove(index)
            {
                logos.splice(index, 1);
            },
        }
    }

    function hasEdited( status=null )
    {
        edited.value = ( status !== false );
    }

    function updatePricing( updateEdit=true )
    {
        pricing.updateAllPricing( order );
        if( updateEdit ) hasEdited()
    }

    function updateTotals(){
        pricing.updateQuoteTotals( order );
        hasEdited();
    }

    function $reset()
    {
        Object.assign(order, JSON.parse(JSON.stringify(entity.quote.create(false))));
        hasEdited(false);
    }

    return {
        order,
        logos,
        vendors,
        edited,
        fn,
        updatePricing,
        updateTotals,
        hasEdited,
        $reset
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useQuoteStore, import.meta.hot))
}