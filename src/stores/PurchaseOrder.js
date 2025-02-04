import {acceptHMRUpdate, defineStore} from "pinia";
import {reactive, ref, toRaw} from "vue";
import entity from "@/js/entity.js";
import api from "@/js/api.js";
import pricing from "@/js/pricing.js";

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {

    const po = reactive(
        entity.purchaseOrder.create(false)
    );

    const logos = reactive([]);
    const vendors = reactive([]);

    let edited = ref(false);

    const fn = {
        item: {
            add( new_item = {} )
            {
                let item = Object.assign( entity.quote.item.create(), new_item)
                // if( item.sizes.length === 1 ) item.sizes = entity.purchaseOrder.item.defaults.sizes();
                po.items.push(item);

                updatePricing();
            },
            duplicate( index ){
                fn.item.add( JSON.parse(JSON.stringify(toRaw(po.items[index]))) );
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

                let element = po.items[fromIndex];
                po.items.splice(fromIndex, 1);
                po.items.splice(toIndex, 0, element);
            },
            async addSageItem( sage_item )
            {
                let item = await api.sage.toQuoteItem(sage_item);
                api.sage.postCreation(item, vendors);
                fn.item.add(item);
            },
            async replaceWithSageItem( index, sage_item )
            {
                let item = po.items[index];
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
                po.items.splice(index, 1);
            }
        },
        fee: {
            add( new_fee = {} )
            {
                let fee = Object.assign( entity.quote.fee.create(), new_fee)
                po.fees.push(fee);

                updatePricing();
            },
            remove( index ){
                po.fees.splice(index, 1);

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
        },
        hasEdited( status=null )
        {
            edited.value = ( status !== false );
        }
    }

    function updatePricing( updateEdit=true )
    {
        pricing.updateAllPricing( po );
        if( updateEdit ) fn.hasEdited()
    }

    function updateTotals(){
        pricing.updateQuoteTotals( po );
        fn.hasEdited();
    }

    function $reset()
    {
        Object.assign(po, JSON.parse(JSON.stringify(entity.purchaseOrder.create(false))));
        po.items = [];
        po.fees = [];
        fn.hasEdited(false);
    }

    return {
        po,
        edited,
        fn,
        vendors,
        logos,
        updatePricing,
        updateTotals,
        hasEdited: fn.hasEdited,
        $reset
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePurchaseOrderStore, import.meta.hot))
}