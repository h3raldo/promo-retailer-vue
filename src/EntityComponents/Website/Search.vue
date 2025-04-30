<script setup>
import Search from "@/EntityComponents/Entity/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
import utils from "@/js/utils.js";

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
			},
			loading: false,
		}
	},
	props: ['onSelect', 'hideChildren', 'returnFullEntity'],
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
		async selected(entity) {
			let finalSelect = (e, p=null) => {
				this.onSelect(e, p)
				this.$refs.modal.$refs.closeModalButton.click();
				this.loading = false;
			}

			if( this.returnFullEntity !== true){
				finalSelect(entity);
				return;
			}

			this.loading = true;
			let r = await utils.ajaxAsync( this.symfony.api.websites.website.get.replace(':id', entity.id) )
			finalSelect(r.entities.website, r.entities.products);
		}
	},
}
</script>
<template>
	<Modal id="website-search" title="Search Websites" buttonText="Search Websites" icon="bi-table" buttonClasses="btn btn-primary" ref="modal">
		<Search :columns="columns" :api="symfony.api.websites.search" :entity="entity" :onSelect="selected" :defaultParams="defaultParams" :loading="loading" />
	</Modal>
</template>
