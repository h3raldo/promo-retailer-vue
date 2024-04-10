<script setup>
import { inject } from 'vue'

const fn = inject('fn')

function add(){
	fn.item.add();
}

import SearchSage from "@/EntityComponents/Order/Actions/Sage/SearchSage.vue";
</script>

<template>

	<div>
		<button class="btn btn-outline-primary btn-sm me-3" @click="add">+ Add Manual Product</button>
		<SearchSage />
	</div>

</template>