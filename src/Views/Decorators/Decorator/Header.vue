<script>
import utils from "@/js/utils.js";
import BackButton from "@/components/template/BackButton.vue";

export default {
	components: {BackButton},
	data(){
		return {
			loading: false,
			types: [
				'Screenprinting',
				'Embroidery',
				'Laser Engrave',
				'Deboss',
				'Pad Printing',
				'Silk Screen',
				'4-Color Process',
				'Digibrite',
				'Digital InkJet',
				'Heat Transfer',
				'Sublimation',
				'UV Printing',
				'Vinyl',
				'DTG Printing',
			  	'Patch'
			]
		}
	},
	inject: ['decorator', 'symfony', 'alert'],
	computed: {
		saveData() {
			return {
				entities: {
					decorator: this.decorator,
				}
			}
		}
	},
	methods: {
		save()
		{
			let self = this;
			this.loading = true;

			function onSuccess( r ){
				if( r.error === false ) self.alert('Saved')
				else self.alert('Error Saving', 'danger', r.message);
				self.loading = false;
			}

			function onError( e ){
				self.alert('Error Saving', 'danger', e);
			}

			utils.ajax( this.symfony.api.decorators.decorator.save, onSuccess, onError, this.saveData )
		}
	}
}
</script>
<template>
	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-3 align-items-center">
			<div>
				<BackButton />
			</div>
			<div class="fw-bold fs-4">
				<i class="bi bi-brush"></i> {{ decorator.name }}
			</div>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-center">

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="decorator.status">
					<option value="new">New</option>
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="name" placeholder="Name" v-model="decorator.name">
				<label for="name">Name</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<select class="form-select" v-model="decorator.type">
					<option v-for="type in types" :value="type">{{ type }}</option>
				</select>
				<label>Type</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="handle" placeholder="Handle" v-model="decorator.handle">
				<label for="handle">Handle</label>
			</div>
		</div>

	</div>
</template>