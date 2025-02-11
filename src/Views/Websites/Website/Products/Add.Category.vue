<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import CategorySelector from "@/EntityComponents/Product/Categories/CategorySelector.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			categories: [],
		}
	},
	props: [],
	inject: ['website', 'symfony'],
	methods: {
		categorySelected(selected){

			selected.categories.forEach(category => {
				let rule = entity.website.product_rules.create('category', category);
				this.website.product_rules.rules.push(rule);
			})

			this.$refs.modal.$refs.closeModalButton.click();
		},
	}
}
</script>
<template>
	<Modal title="Add Category" buttonText="Add Category" :icon="'bi-plus-circle'" ref="modal">
		<CategorySelector :onSelect="categorySelected" />
	</Modal>
</template>
