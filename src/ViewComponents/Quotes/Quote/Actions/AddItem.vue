<script setup>
import SearchSage from "@/ViewComponents/Quotes/Quote/Actions/Sage/SearchSage.vue";
</script>

<script>
import entity from "@/js/Quotes/Quote/entity.js";
import defaults from "@/js/Quotes/Quote/defaults.js";

export default {
	data() {
		return {}
	},

	inject: ['quote', 'addQuoteItem'],

	computed: {

	},

	methods: {
		add() {
			let item = entity.item.create();
			item.sizes = defaults.item.sizes();
			this.addQuoteItem(item);
		}
	},

	mounted() {}
}
</script>

<template>

	<div>
		<button class="btn btn-outline-primary btn-sm me-3" @click="add">+ Add Manual Product</button>
		<SearchSage />
	</div>

</template>