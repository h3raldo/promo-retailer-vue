<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
			saving: false,
			value: null
		}
	},
	props: ['option'],
	inject: ['symfony', 'alert'],
	methods: {
		retrieve(){
			let self = this;
			self.loading = true;

			function success(value){
				self.loading = false;

				if( !value ) return;
				self.value = value;
			}

			function error(){
				self.alert('Error Retrieving!', 'danger');
			}

			utils.config.get.option(this.option, success, error)
		},
		save(){
			let self = this;

			function success( response ){
				self.saving = false;
				self.alert('Saved!');
			}

			function error( response ){
				self.saving = false;
				self.alert('Error saving, see console.!', 'danger');
			}

			let data = {
				path: utils.config.keys[self.option],
				value: self.value
			}

			this.saving = true;
			utils.ajax(this.symfony.api.config.save, success, error, data );
		},
	},
	mounted() {
		this.retrieve()
	}
}
</script>
<template>

	<div class="d-flex justify-content-between">
		<div>
			<slot name="header"></slot>
		</div>


		<div>
			<button class="btn btn-primary p-3" @click="save" :disabled="loading || saving"><i class="bi bi-floppy-fill"></i> Save</button>
		</div>
	</div>

	<br>

	<Loader v-if="loading" />
	<slot v-else :value="value"></slot>

</template>
