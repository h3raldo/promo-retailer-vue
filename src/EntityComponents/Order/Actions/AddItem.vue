<script setup>
import { inject } from 'vue'

import entity from "@/js/entity.js";

const addQuoteItem = inject('addQuoteItem')

function add(){
	let item = entity.order.item.create();
	item.sizes = entity.order.item.defaults.sizes();
	addQuoteItem(item);
}

import SearchSage from "@/EntityComponents/Order/Actions/Sage/SearchSage.vue";
</script>

<template>

	<div>
		<button class="btn btn-outline-primary btn-sm me-3" @click="add">+ Add Manual Product</button>
		<SearchSage />
	</div>

</template>