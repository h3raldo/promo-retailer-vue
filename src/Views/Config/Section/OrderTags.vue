<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			loading: false,
			saving: false,
			tags: []
		}
	},
	inject: ['symfony', 'alert'],
	computed: {
	},
	methods: {
		save(){
			let self = this;

			function success(){
				self.saving = false;
				self.alert('Saved!');
			}

			function error(){
				self.saving = false;
				self.alert('Error saving, see console.!', 'danger');
			}

			let data = {
				path: utils.config.keys.globalOrderTags,
				value: self.tags
			}

			this.saving = true;
			utils.ajax(this.symfony.api.config.save, success, error, data );
		},
		retrieve(){
			let self = this;
			self.loading = true;

			utils.config.get.option( 'globalOrderTags', (response) => {
				self.loading = false;

				if( !response ) return;
				self.tags = response;

				self.tags.forEach( (input) => {
					if( typeof input.color === 'undefined' ) input.color = '#000000';
				})
			})
		},
		create(){
			this.tags.push({
				id: 'new-tag',
				label: 'New Tag',
				color: '#000000',
			})
		}
	},
	mounted() {
		this.retrieve();
	}
}
</script>
<template>

	<div class="d-flex justify-content-between">
		<div>
			<h2>Order Tags</h2>
			<p>Tags to be used on orders to organize them.</p>
		</div>
		<div>
			<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save</button>
		</div>

	</div>

	<hr>

	<Loader v-if="loading" />

	<div v-else>

		<div v-for="tag in tags">
			<div class="row border-bottom mb-3">
				<div class="col">
					<div class="form-floating mb-3">
						<input type="text" class="form-control" v-model="tag.id" placeholder="ID">
						<label>ID (NO spaces, all lowercase)</label>
					</div>
				</div>
				<div class="col">
					<div class="form-floating mb-3">
						<input type="text" class="form-control" v-model="tag.label" placeholder="Label">
						<label>Label (Visible to Users)</label>
					</div>
				</div>
				<div class="col d-flex gap-2 align-items-center">
					<label>Label Color</label>
					<input type="color" class="form-control form-control-color form-control-sm" v-model="tag.color" placeholder="Color">
				</div>
			</div>
		</div>

		<div class="pt-3">
			<button class="btn btn-primary" @click="create">Create New Tag</button>
		</div>

	</div>

</template>