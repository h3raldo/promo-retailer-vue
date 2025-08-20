<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
		}
	},
	props: ['id', 'entity', 'callback'],
	inject: ['symfony', 'alert'],
	computed: {
		apiUrl(){
			let url = false;

			switch ( this.entity ) {
				case 'website':
					url = this.symfony.api.websites.website.duplicate;
			}

			return url.replace(':id', this.id);
		}
	},
	methods: {
		entityAction(){
			if( !this.apiUrl ) return;

			let self = this;
			self.loading = true;

			utils.ajaxPOST(self.apiUrl, response => {
				self.loading = false;
				if( response.error ){
					this.alert(response.message, 'danger');
					return;
				}

				this.$refs.modal.$refs.closeModalButton.click();

				this.alert(response.message, 'success');
				if( typeof this.callback === 'function' ) this.callback(response);

			}, error => {
				self.loading = false;
				this.alert(error.message, 'danger');
			} )
		}
	}
}
</script>
<template>
	<Modal :id="`entity-${entity}-duplicate-${id}`" :title="'Are you sure?'"  :icon="'bi-copy'" :buttonClasses="'btn btn-outline-secondary'" ref="modal">
		<p>This will duplicate the store, but not duplicate children stores. It will place it under the same company.</p>
		<button class="btn btn-outline-secondary" @click="entityAction" :disabled="loading"><i class="bi bi-copy"></i> Duplicate</button>
	</Modal>
</template>
