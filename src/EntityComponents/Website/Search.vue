<script setup>
import Search from "@/EntityComponents/Entity/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
export default {
	data() {
		return {
			entity: 'website',
			columns: {
				'ID': { id: 'id' },
				'Status': {
					id: 'status',
					type: 'checkbox',
					options: [
						{label: 'New', value: 'new'},
						{label: 'Enabled', value: 'enabled'},
						{label: 'Disabled', value: 'disabled'},
					]
				},
				'Name': { id: 'name', type: 'text' },
				'Subdomain': { id: 'handle', type: 'text' },
			}
		}
	},
	props: ['onSelect', 'hideChildren'],
	inject: ['symfony', 'alert'],
	computed: {
		defaultParams() {

			let params = 'per_page=15'

			if( this.hideChildren !== true ){
				return params;
			}

			return params + '&children=false'
		}
	},
	methods: {
		selected(entity) {
			this.onSelect(entity)
			this.$refs.modal.$refs.closeModalButton.click();
		}
	}
}
</script>
<template>
	<Modal id="website-search" title="Search Websites" buttonText="Search Websites" icon="bi-table" buttonClasses="btn btn-primary" ref="modal">
		<Search :columns="columns" :api="symfony.api.websites.search" :entity="entity" :onSelect="selected" :defaultParams="defaultParams" />
	</Modal>
</template>
