<script setup>
import Header from "@/Views/Orders/Order/Header.vue";
import Loader from "@/components/globals/Loader.vue";
import Order from "@/EntityComponents/Order/Order.vue";
</script>

<script>
import { mapWritableState } from 'pinia'
import {useOrderStore} from "@/stores/Order.js";
const orderStore = useOrderStore();

import {computed} from "vue";
import utils from "@/js/utils.js";
import pricing from "@/js/pricing.js";
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			id: this.$route.params.id,
			loading: true,
			urls: {},
			edited: false,
		}
	},

	inject: ['symfony'],

	computed: {
		...mapWritableState(useOrderStore, ['order','logos', 'decorators', 'vendors'])
	},

	methods: {
		addItem(item) {
			this.order.items.push(item)
			this.updatePricing();
		},
		removeItem(index) {
			this.order.items.splice(index, 1);
		},
		optionUpdated(item) {
			pricing.updateCombinedPriceTable(item);
			this.hasEdited();
		},
		updatePricing() {
			pricing.updateAllPricing(this.order);
			this.hasEdited();
		},
		updateTotals() {
			pricing.updateQuoteTotals(this.order);
			this.hasEdited();
		},

		hasEdited(status) {
			this.edited = (status !== false);
		},

		setup(init) {
			if (!init.order) {
				orderStore.order.id = init.new_order_id;
			} else {
				orderStore.$patch( { order: entity.order.patchData(init) } );
			}

			if (init.logos) this.logos = init.logos;
			if (init.decorators) this.logos = init.decorators;

			pricing.updateAllPricing(this.order);
		}
	},

	provide() {
		return {
			hasEdited: this.hasEdited,
			edited: computed(() => this.edited),
			decorators: computed(() => orderStore.decorators),
			order: computed(() => orderStore.order),
			logos: computed(() => orderStore.logos),
			vendors: computed(() => orderStore.vendors),
			urls: computed(() => this.urls),
			updatePricing: this.updatePricing,
			updateTotals: this.updateTotals,
			addQuoteItem: this.addItem,
			removeQuoteItem: this.removeItem,
			event: {
				item: {
					optionUpdated: this.optionUpdated
				}
			}
		}
	},

	created() {
		let self = this;
		self.urls = symfony.orders.order;

		let url = self.urls.get.replace(':id', this.id);
		utils.ajax(url, (data) => {
			self.setup(data);
			self.loading = false;
		})

	},

	mounted() {
		let self = this;

		if (this.vendors.length > 0) return;
		utils.ajax(this.symfony.quotes.decorators, (data) => {
			self.decorators = data;
		})
		entity.order.vendor.getAll().forEach(v => self.vendors.push(v))

		window.addEventListener('beforeunload', function (e) {
			if (!self.edited) return;
			e.preventDefault();
			e.returnValue = true;
		});
	}
}
</script>

<template>

	<Loader v-if="loading"/>

	<template v-if="!loading">
		<Header/>
		<Order/>
	</template>

</template>