import {defineStore} from "pinia";
import {reactive} from "vue";
import entity from "@/js/entity.js";

export const useOrderStore = defineStore('order', () => {

    const order = reactive(
        entity.order.create( false )
    );

    const logos = reactive([]);
    const decorators = reactive([]);
    const vendors = reactive([]);

    function addOrderItem( cb )
    {
        let item = entity.order.item.create();
        cb(item);
        order.items.push(item);
    }

    return {
        order, logos, decorators, vendors, addOrderItem
    }

})