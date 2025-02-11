<script setup>
import ProductView from "@/EntityComponents/Sage/Product.View.vue";
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['result', 'closePreview'],
	methods: {}
}
</script>

<template>
	<div id="search_product_details">
		<button class="btn btn-small btn-outline-primary mt-4" @click="closePreview"><i class="bi bi-arrow-left-circle"></i> Back to Search</button>
		<ProductView :sageProduct="result" />
	</div>
</template>