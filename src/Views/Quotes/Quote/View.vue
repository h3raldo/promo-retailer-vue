<script setup>
import Header from "@/Views/Quotes/Quote/Header.vue";
import Loader from "@/components/globals/Loader.vue";
import Order from "@/EntityComponents/Order/Order.vue";
import Info from "@/Views/Quotes/Quote/Info.vue";

import {provide, inject, computed, reactive} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
const route = useRoute();
const router = useRouter();
import {useQuoteStore} from "@/stores/Quote.js";
const quoteStore = useQuoteStore();
import pricing from "@/js/pricing.js";
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

const data = reactive({
	id: route.params.id,
	loading: true,
	init: {},
	references: [],
	entities: {},
	urls: inject('symfony').value.quotes.quote,
})

function setup()
{
	quoteStore.$reset();

	let url = data.urls.get.replace(':id', data.id);
	utils.ajax(url, (d) => {

		let entity_data = JSON.parse(d.data);

		if( d.entities ) data.entities = d.entities;

		let init = d.init;
		data.init = d.init;

		if( init.order ) {
			data.references.push({
				source: 'order',
				reference_number: init.order,
				action: {
					title: `View Order`,
					click: () => {
						router.push({
							name: 'orders_order',
							params: { id: init.order }
						});
					}
				}
			})
		}

		if( !entity_data.quote ){
			quoteStore.order.id = entity_data.new_quote_id;
			init.public_id = entity_data.public_id;
		} else{
			quoteStore.$patch({order: entity.quote.patchData(entity_data, init)});
		}

		if( entity_data.logos ) quoteStore.fn.logo.set( entity_data.logos )
		if( entity_data.vendors ) quoteStore.fn.vendor.set( entity_data.vendors )
		else quoteStore.fn.vendor.set( entity.quote.vendor.getAll() )

		quoteStore.updatePricing(false);

		data.loading = false;
	})
}
setup();

onBeforeRouteLeave(() => {
	if( quoteStore.edited ){
		const answer = window.confirm(
		  'Do you really want to leave? You may have unsaved changes!'
		)
		// cancel the navigation and stay on the same page
		if (!answer) {
			return false
		} else {
			quoteStore.hasEdited(false);
		}
	} else {
		return true;
	}
})

provide('edited', computed(() => quoteStore.edited ))
provide('order', computed(() => quoteStore.order))
provide('logos', computed(() => quoteStore.logos))
provide('vendors', computed(() => quoteStore.vendors))
provide('urls', computed(() => data.urls))
provide('references', computed(() => data.references))
provide('entities', computed(() => data.entities))
provide('init', computed(() => data.init))

provide('hasEdited', quoteStore.hasEdited)
provide('updatePricing', quoteStore.updatePricing)
provide('updateTotals', quoteStore.updateTotals)

provide('fn', quoteStore.fn)

provide('event', {
	item: {
		optionUpdated: (item) => {
			pricing.updateCombinedPriceTable( item );
			quoteStore.hasEdited();
		}
	}
})
</script>

<template>

	<Loader v-if="data.loading" />

	<template v-if="!data.loading">
		<Header />
		<Order>
			<template #info>
				<Info />
			</template>
		</Order>
	</template>

</template>