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
		deleteUrl(){
			let url = false;

			switch ( this.entity ) {
				case 'website':
					url = this.symfony.api.websites.website.delete;
			}

			return url.replace(':id', this.id);
		}
	},
	methods: {
		entityDelete(){
			if( !this.deleteUrl ) return;

			let self = this;
			self.loading = true;

			utils.ajaxDelete(self.deleteUrl, response => {
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
	<Modal :id="`entity-${entity}-delete-${id}`" :title="'Are you sure?'"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'" ref="modal">
		<p>Will be deleted permanently. Cannot be undone.</p>
		<button class="btn btn-danger" @click="entityDelete" :disabled="loading"><i class="bi bi-trash"></i> DELETE</button>
	</Modal>
</template>
