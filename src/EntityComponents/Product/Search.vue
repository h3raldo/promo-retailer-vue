<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import SearchForm from "@/EntityComponents/Product/Search.Form.vue";
</script>
<script>
export default {
	data(){
		return {
			loading: false,
			query: '',
			results: []
		}
	},
	inject: ['symfony'],
	props: ['onSelect', 'buttonText', 'buttonIcon', 'type', 'sage'],
	computed: {
		getType() {
			if (typeof this.type === 'undefined') return 'modal';
			return this.type;
		}
	},
	methods: {
		selected(company) {
			this.onSelect(company)

			if (this.getType === 'modal')
				this.$refs.modal.$refs.closeModalButton.click();
		}
	}
}
</script>
<template>

	<template v-if="getType === 'modal'">
		<Modal id="product-search" title="Search Products" :buttonText="buttonText" :icon="buttonIcon" buttonClasses="btn btn-primary" ref="modal">
			<SearchForm :selected="selected" :sage="sage" />
		</Modal>
	</template>
	<template v-else-if="getType === 'details'">
		<details>
			<summary>Search</summary>
			<SearchForm :selected="selected" :sage="sage" />
		</details>
	</template>
	<template v-else>
		<SearchForm :selected="selected" :sage="sage" />
	</template>

</template>