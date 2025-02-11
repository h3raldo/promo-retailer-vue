<script setup>
import Search from "@/EntityComponents/Company/Search.vue";
import Breadcrumbs from "@/components/globals/Breadcrumbs.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data(){
		return {
			loading: false,
		}
	},
	inject: ['logo', 'symfony', 'alert'],
	computed: {
		saveData() {
			return {
				entities: {
					logo: this.logo,
				}
			}
		},
		canSave(){
			return this.logo.handle.trim() !== '';
		},
		breadcrumbs(){
			return [
				{
					type: 'company',
					id: this.logo.company.id,
					title: this.logo.company.name,
				},
				{
					type: 'logo',
					id: '',
					title: this.logo.name,
				}
			];
		}
	},
	methods: {
		save(){
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

			utils.ajax( this.symfony.api.logos.logo.save, onSuccess, onError, this.saveData )
		},
		goToCompany(){
			this.$router.push( this.symfony.views.companies_company.replace(':id', this.logo.company.id)	 );
		},
		onCompanySelect(company){
			console.log('selected', company);
			this.logo.company.id = company.id;
			this.logo.company.name = company.name;
		},
		nameChange(){
			if( this.logo.handle !== '' ) return;
			this.logo.handle = utils.slugify(this.logo.name);
		}
	}
}
</script>
<template>
	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-4 align-items-center">
			<div>
				<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
			</div>
			<Breadcrumbs :items="breadcrumbs" />
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<button class="btn btn-primary" :disabled="loading || !canSave" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-center">

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="logo.status">
					<option value="new">New</option>
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="name" placeholder="Name" v-model="logo.name" @change="nameChange">
				<label for="name">Name</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="handle" placeholder="Handle" v-model="logo.handle">
				<label for="handle">Handle</label>
			</div>
		</div>

		<div class="col-2">
			<div class="input-group">
				<div class="form-floating">
					<input type="text" class="form-control" placeholder="Vendor" v-model="logo.company.name" disabled>
					<label>Company</label>
				</div>
				<Search :onSelect="onCompanySelect" :button-text="''" :button-icon="'bi-pencil'" />
			</div>
		</div>

	</div>
</template>