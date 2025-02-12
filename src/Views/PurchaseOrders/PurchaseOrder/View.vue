<script setup>
import Loader from "@/components/globals/Loader.vue";
import Header from "@/Views/PurchaseOrders/PurchaseOrder/Header.vue";
import Items from "@/EntityComponents/Order/Items.vue";
import Tabs from "@/components/globals/Tabs.vue";
import References from "@/components/globals/References.vue";
import Info from "@/Views/PurchaseOrders/PurchaseOrder/Info.vue";
import Logos from "@/EntityComponents/Order/Logos.vue";
</script>
<script>
import {computed} from "vue";
import {usePurchaseOrderStore} from "@/stores/PurchaseOrder.js";
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";
const purchaseOrderStore = usePurchaseOrderStore();

export default{
	inject: ['symfony'],

	data() {
		return {
			id: this.$route.params.id,
			loading: true,
			urls: this.symfony.api.purchase_orders.order,
			po: purchaseOrderStore.po,
			entities: {
				order: {},
			},
			tabs: ['Info', 'Items', 'Vendor', 'Logos', 'References']
		}
	},

	provide() {
		return {
			edited: computed(() => purchaseOrderStore.edited ),
			urls: computed(() => this.urls ),
			po: computed(() => purchaseOrderStore.po ),
			entities: computed(() => this.entities ),
			order: computed(() => purchaseOrderStore.po ),
			fn: purchaseOrderStore.fn,
			references: computed(() => purchaseOrderStore.po.info.references ),
			vendors: computed(() => purchaseOrderStore.vendors ),
			logos: computed(() => purchaseOrderStore.logos ),
			updateTotals: purchaseOrderStore.updateTotals,
			updatePricing: purchaseOrderStore.updatePricing
		}
	},

	methods: {

	},

	created() {
		let self = this;
		let url = self.urls.get.replace(':id', self.id);
		purchaseOrderStore.$reset();

		utils.ajax(url, (d) => {

			let entity_data = d.data;
			let init = d.init;

			if( d.entities ){

				if( d.entities.order )
					self.entities.order = JSON.parse( d.entities.order.data );

				if( d.entities.po )
					self.entities.po = d.entities.po;
			}

			if ( !entity_data.po ) {
				self.loading = false;
				purchaseOrderStore.po.id = entity_data.id;

				if( entity_data.source && entity_data.source_id ) {
					console.log(d);
					utils.ajax(self.symfony.orders.order.get.replace(':id', entity_data.source_id), r => {
						const order = JSON.parse(r.data);
						order.logos.forEach( l => purchaseOrderStore.logos.push(l));
						let transformedOrder = entity.purchaseOrder.fromOrder(order.order, entity_data.company, entity_data.decorator_code);
						purchaseOrderStore.$patch({po: transformedOrder});
						purchaseOrderStore.po.id = self.id;
						purchaseOrderStore.updatePricing();

						purchaseOrderStore.po.info.references.push({
							source: entity_data.source,
							reference_number: entity_data.source_id,
						})

						utils.ajax(self.symfony.api.companies.company.get.replace(':id', entity_data.company), c => {
							purchaseOrderStore.po.info.vendor.info = c.entities.company;
							purchaseOrderStore.po.info.vendor.name = c.entities.company.name;
							purchaseOrderStore.po.info.vendor.id = entity_data.company;
							self.loading = false;
						})
					});
				}

				purchaseOrderStore.po.info.status = init.status;
				purchaseOrderStore.po.info.deliver_by = init.dateDeliverBy || '';
				purchaseOrderStore.po.info.ship_by = init.dateShipBy || '';

			} else{
				self.loading = false;
				purchaseOrderStore.po.id = entity_data.id;
				let { po, logos } = entity.purchaseOrder.patchData(entity_data.po, init);
				logos.forEach( l => purchaseOrderStore.logos.push(l));
				purchaseOrderStore.$patch({po: po, logos: logos});
			}
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

		<Tabs :labels="tabs" :first="'Items'">

			<template #Info>
				<Info />
			</template>

			<template #Items>
				<Items />
			</template>

			<template #Logos>
				<Logos />
			</template>

			<template #Vendor>
				<table class="table">
					<thead>
					<tr>
						<th class="col-1"></th>
						<th></th>
					</tr>
					</thead>
					<tbody>
						<tr>
							<td class="text-end fw-bold">ID:</td>
							<td>{{ po.info.vendor.id }}</td>
						</tr>
						<tr>
							<td class="text-end fw-bold">Name:</td>
							<td>{{ po.info.vendor.name }}</td>
						</tr>
					</tbody>
				</table>
			</template>

			<template #References>
				<References />
			</template>

		</Tabs>
	</template>

</template>