<script setup>
import Loader from "@/components/globals/Loader.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import SearchForm from "@/EntityComponents/Logo/Search.Form.vue";
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
	props: ['onSelect', 'buttonText', 'buttonIcon', 'type'],
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
		<Modal :id="'logo-search'" :title="'Search Logos'" :buttonText="buttonText" :icon="buttonIcon" :buttonClasses="'btn btn-primary'" ref="modal">
			<SearchForm :selected="selected" />
		</Modal>
	</template>
	<template v-else-if="getType === 'details'">
		<details>
			<summary>Search</summary>
			<SearchForm :selected="selected" />
		</details>
	</template>
	<template v-else>
		<SearchForm :selected="selected" />
	</template>

</template>