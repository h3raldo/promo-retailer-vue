import {acceptHMRUpdate, defineStore} from "pinia";
import {reactive, ref, toRaw} from "vue";
import entity from "@/js/entity.js";

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {

    const po = reactive(
        entity.purchaseOrder.create(false)
    );

    let edited = ref(false);

    const fn = {
        hasEdited( status=null )
        {
            edited.value = ( status !== false );
        }
    }

    return {
        po,
        edited,
        fn: fn
    }

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePurchaseOrderStore, import.meta.hot))
}