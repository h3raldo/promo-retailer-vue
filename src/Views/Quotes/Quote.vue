<script setup>
import Header from "@/ViewComponents/Quotes/Quote/Header.vue";
import Items from "@/ViewComponents/Quotes/Quote/Items.vue";
import Logos from "@/ViewComponents/Quotes/Quote/Logos.vue";
import Vendors from "@/ViewComponents/Quotes/Quote/Vendors.vue";
import Loader from "@/components/globals/Loader.vue";
</script>

<script>
import {computed} from "vue";
import utils from "@/js/utils.js";
import pricing from "@/js/Quotes/Quote/pricing.js";
import entity from "@/js/Quotes/Quote/entity.js";

export default {
	data(){
		return {
			id: this.$route.params.id,
			loading: true,

			edited: false,
			quote: {},
			logos: [],
			decorators: [],
			vendors: []
		}
	},

	inject: ['symfony'],

	methods: {
		addItem( item ){
			this.quote.items.push( item )
			this.updatePricing();
		},
		removeItem( index ){
			this.quote.items.splice(index, 1);
		},
		optionUpdated( item ){
			pricing.updateCombinedPriceTable( item );
			this.hasEdited();
		},
		updatePricing(){
			pricing.updateAllPricing( this.quote );
			this.hasEdited();
		},
		updateTotals(){
			pricing.updateQuoteTotals( this.quote );
			this.hasEdited();
		},

		hasEdited( status ){
			this.edited = ( status !== false );
		},

		setup( init ){
			if( !init.quote )
				this.quote = entity.quote.create(init.new_quote_id);
			else{
				this.quote = entity.quote.patchData(init);
			}

			if( init.logos ) this.logos = init.logos;
			if( init.decorators ) this.logos = init.decorators;

			pricing.updateAllPricing( this.quote );
		}
	},

	provide() {
		return {
			hasEdited: this.hasEdited,
			decorators: computed(() => this.decorators),
			edited: computed(() => this.edited ),
			quote: computed(() => this.quote),
			logos: computed(() => this.logos),
			vendors: computed(() => this.vendors),

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

	created()
	{
		let self = this;
		let url = this.symfony.quotes.quote.get.replace(':id', this.id);

		utils.ajax(url, (data) => {
			self.setup( data );
			self.loading = false;
		})
	},

	mounted() {
		let self = this;

		if( this.vendors.length > 0 ) return;
		utils.ajax(this.symfony.quotes.decorators, (data) => {
			self.decorators = data;
		})
		entity.vendor.getAll().forEach(v => self.vendors.push(v))

		window.addEventListener('beforeunload', function (e)
		{
			if( !self.edited ) return;
			e.preventDefault();
			e.returnValue = true;
		});
	}
}
</script>

<template>

	<Loader v-if="loading" />

	<template v-if="!loading">

		<Header/>

		<nav class="pt-4">
			<div class="nav nav-tabs" id="nav-tab" role="tablist">
				<button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-quote-items" type="button">Items</button>
				<button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-quote-logos" type="button">Logos</button>
				<button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-quote-vendors" type="button">Vendors</button>
			</div>
		</nav>

		<div class="tab-content pt-3">
			<div class="tab-pane fade show active" id="tab-quote-items">
				<Items />
			</div>

			<div class="tab-pane fade" id="tab-quote-logos">
				<Logos />
			</div>

			<div class="tab-pane fade" id="tab-quote-vendors">
				<Vendors />
			</div>
		</div>

	</template>
</template>