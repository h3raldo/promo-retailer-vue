<script setup>
import Header from "@/Views/Orders/Order/Header.vue";
import Loader from "@/components/globals/Loader.vue";
import Order from "@/EntityComponents/Order/Order.vue";

import {provide, inject, computed, reactive} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
const route = useRoute();
const router = useRouter();
import {useOrderStore} from "@/stores/Order.js";
const orderStore = useOrderStore();
import pricing from "@/js/pricing.js";
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

const data = reactive({
	id: route.params.id,
	loading: true,
	references: [],
	urls: inject('symfony').value.orders.order,
})

function afterDataRetrieval( entity_data )
{
	if( !entity_data.order ) {
		orderStore.order.id = entity_data.new_order_id;
	} else{
		orderStore.$patch({order: entity_data.order});
	}

	if( entity_data.logos ) orderStore.fn.logo.set( entity_data.logos )
	if( entity_data.vendors ) orderStore.fn.vendor.set( entity_data.vendors )
	else orderStore.fn.vendor.set( entity.order.vendor.getAll() )


	if( entity_data.order.info.source && entity_data.order.info.reference_number ) {
		let { info } = entity_data.order;
		let ref = {
			source: info.source,
			reference_number: info.reference_number,
		}
		if( info.source === 'quote' ){
			ref.action = {
				title: `View Quote`,
				  click: () => {
					router.push({
						name: 'quotes_quote',
						params: {id: info.reference_number}
					});
				}
			}
		}
		data.references.push(ref)
	}

	orderStore.updatePricing(false);

	data.loading = false;
}

function setup()
{
	let url = data.urls.get.replace(':id', data.id);
	utils.ajax(url, (d) => {

		let entity_data = JSON.parse(d.data);
		let init = d.init;

		init.references.forEach( r => {
			data.references.push({
				source: 'po',
				reference_number: r.reference_number,
				title: r.title
			})
		})

		if( entity_data.source ) {
			entity.order.convertFromSource(d, (order, logos) => {
				console.log('patching after conversion', order);
				entity_data.order = order;
				entity_data.logos = logos;
				afterDataRetrieval(entity_data);
			})
			return;
		}

		if( entity_data.order ){
			entity_data.order = entity.order.patchData(entity_data, init);
		}

		afterDataRetrieval(entity_data);
	})
}

setup();

onBeforeRouteLeave(() => {
	if( orderStore.edited ){
		const answer = window.confirm(
		  'Do you really want to leave? You may have unsaved changes!'
		)
		// cancel the navigation and stay on the same page
		if (!answer) return false
		else orderStore.hasEdited(false);
	} else {
		return true;
	}
})

provide('edited', computed(() => orderStore.edited ))
provide('order', computed(() => orderStore.order))
provide('logos', computed(() => orderStore.logos))
provide('vendors', computed(() => orderStore.vendors))
provide('urls', computed(() => data.urls))
provide('references', computed(() => data.references))

provide('hasEdited', orderStore.hasEdited)
provide('updatePricing', orderStore.updatePricing)
provide('updateTotals', orderStore.updateTotals)

provide('fn', orderStore.fn)

provide('event', {
	item: {
		optionUpdated: (item) => {
			pricing.updateCombinedPriceTable( item );
			orderStore.hasEdited();
		}
	}
})
</script>

<template>

	<Loader v-if="data.loading" />

	<template v-if="!data.loading">
		<Header />
		<Order />
	</template>

</template>