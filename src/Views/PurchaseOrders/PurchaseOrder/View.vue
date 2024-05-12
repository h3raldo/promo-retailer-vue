<script setup>
import Loader from "@/components/globals/Loader.vue";
import Header from "@/Views/PurchaseOrders/PurchaseOrder/Header.vue";
import Items from "@/Views/PurchaseOrders/PurchaseOrder/Items.vue";
</script>
<script>
import {computed} from "vue";
import {usePurchaseOrderStore} from "@/stores/PurchaseOrder.js";
import utils from "@/js/utils.js";
const purchaseOrderStore = usePurchaseOrderStore();

export default{
	inject: ['symfony'],

	data() {
		return {
			id: this.$route.params.id,
			loading: true,
			urls: this.symfony.purchase_orders.order,
		}
	},

	provide() {
		return {
			edited: computed(() => purchaseOrderStore.edited ),
			urls: computed(() => this.urls ),
			po: computed(() => purchaseOrderStore.po ),
			fn: computed(() => purchaseOrderStore.fn )
		}
	},

	methods: {

	},

	created() {
		let self = this;
		let url = self.urls.get.replace(':id', self.id);
		utils.ajax(url, (d) => {
			self.loading = false;

			let entity_data = d;
			purchaseOrderStore.po.id = self.id;
			// purchaseOrderStore.$patch({po: entity.purchaseOrder.patchData(entity_data, {})});

			console.log(purchaseOrderStore.po);
		})
	},

	beforeRouteLeave(){
		if( purchaseOrderStore.edited ){
			const answer = window.confirm(
			  'Do you really want to leave? You may have unsaved changes!'
			)
			// cancel the navigation and stay on the same page
			if (!answer) return false
			else purchaseOrderStore.fn.hasEdited(false);
		} else {
			return true;
		}
	}
}
</script>

<template>

	<Loader v-if="loading" />

	<template v-if="!loading">
		<Header />
		<Items />
	</template>

</template>