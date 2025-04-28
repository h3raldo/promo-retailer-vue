<script setup>
import Breadcrumbs from "@/components/globals/Breadcrumbs.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import BackButton from "@/components/template/BackButton.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
		}
	},
	props: [],
	inject: ['website', 'symfony', 'alert'],
	computed: {
		canSave(){
			return this.handleValidates && this.website.name !== '' && this.website.handle !== '';
		},
		saveData() {
			return {
				entities: {
					website: this.website,
				}
			}
		},
		breadcrumbs(){

			let crumbs = [
				{
					type: 'company',
					id: this.website.company.id,
					title: this.website.company.name,
				},
			];

			if( this.website.parent.id )
				crumbs.push({
					type: 'website',
					id: this.website.parent.id,
					title: this.website.parent.name,
				})

			crumbs.push({
				type: 'website',
				id: '',
				title: this.website.name,
			})

			return crumbs;
		},
		handleValidates() {
			let str = this.website.handle;
			let code, i, len;

			for (i = 0, len = str.length; i < len; i++) {
				code = str.charCodeAt(i);
				if (!(code > 47 && code < 58) && // numeric (0-9)
				  !(code > 64 && code < 91) && // upper alpha (A-Z)
				  !(code > 96 && code < 123)) { // lower alpha (a-z)
					return false;
				}

				if (i === 0 && !(code > 64 && code < 91) && !(code > 96 && code < 123)) { // First character must be a letter
					return false;
				}
			}

			return true;
		},
	},
	methods: {
		createWebsite(){
			let self = this;

			this.save( ()=>{

				utils.ajax( this.symfony.api.websites.website.magento.create.replace(':id', self.website.id), (d) => {
					if( d.error === true ){
						self.alert('Error Creating Magento Store', 'danger', d.message);
						return;
					}

					self.website.config.magento.website_id = d.data.website.id;
					self.website.config.magento.store_id = d.data.store.id;
					self.website.config.magento.group_id = d.data.group.id;
					self.alert('Magento Store Created');

				})

			})
		},
		lowerCaseHandle()
		{
			this.website.handle = this.website.handle.toLowerCase();
		},
		goToWebsite(id){
			this.$refs.childrenModal.$refs.closeModalButton.click();
			this.$router.push(this.symfony.views.websites_website.replace(':id', id))
		},
		sync(){
			this.save( false, true)
		},
		save( cb, sync )
		{
			let self = this;
			this.loading = true;

			function onSuccess( r ){
				if( r.error === false ) self.alert('Saved')
				else self.alert('Error Saving', 'danger', r.message);
				self.loading = false;
				if( typeof cb === 'function') cb();
			}

			function onError( e ){
				self.alert('Error Saving', 'danger', e);
				if( typeof cb === 'function') cb();
			}

			let url = this.symfony.api.websites.website.save + ( sync === true ? '?syncMagento=true' : '' );
			utils.ajax( url, onSuccess, onError, this.saveData )
		},

		onCompanySelect( company )
		{
			this.website.company.id = company.id;
			this.website.company.name = company.name;
		},
	}
}
</script>
<template>

	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-3 align-items-center">
			<div>
				<BackButton />
			</div>
			<Breadcrumbs :items="breadcrumbs">
				<span class="align-self-end" v-if="website.children.length > 0">
					<Modal title="Children" buttonText="View Children" :icon="'bi-eye'" buttonClasses="btn btn-sm btn-outline-primary" ref="childrenModal">
						<table class="table">
							<thead>
							<tr>
								<th class="col-1"></th>
								<th class="col-1">ID</th>
								<th>Name</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="child in website.children">
								<td><button class="btn btn-primary btn-sm" @click="goToWebsite(child.id)">View</button> </td>
								<td>{{ child.id }}</td>
								<td>{{ child.name }}</td>
							</tr>
							</tbody>
						</table>
					</Modal>
				</span>
			</Breadcrumbs>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<button class="btn btn-primary" :disabled="loading || !canSave" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
				<button v-if="website.config.magento.store_id" class="btn btn-warning" :disabled="loading || !canSave" @click="sync"><i class="bi bi-arrow-repeat"></i> Sync To Magento</button>
				<button v-if="canSave && !website.config.magento.store_id" class="btn btn-warning btn-sm" @click="createWebsite"><i class="bi bi-cloud-plus"></i> Create Website</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-start">

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="website.status">
					<option value="new">New</option>
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" placeholder="Quote Name" v-model="website.name">
				<label>Title</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="input-group mb-3 has-validation">
				<template v-if="website.config.custom_domain">
					<div class="form-floating">
						<input type="text" class="form-control" placeholder="Subdomain" v-model="website.config.custom_domain" disabled>
						<label>Custom Domain</label>
					</div>
				</template>
				<template v-else>
					<span class="input-group-text">https://</span>
					<div :class="!handleValidates ? 'form-floating is-invalid': 'form-floating'">
						<input type="text" class="form-control" placeholder="Subdomain" v-model="website.handle" @change="lowerCaseHandle" :class="!handleValidates ? 'is-invalid': ''">
						<label>Subdomain</label>
					</div>
					<span class="input-group-text">.{{ symfony.brand.magento.domain }}</span>
					<div class="invalid-feedback">
						Needs to start with a letter and contain only letters, numbers.
					</div>
				</template>
				<a v-if="website.config.magento.store_id" class="btn btn-success btn-sm d-flex align-items-center" :href="`https://${website.handle}.${symfony.brand.magento.domain}`" target="_blank">View &nbsp;<i class="bi bi-box-arrow-up-right"></i></a>
			</div>
		</div>

		<div class="flex-grow-1" v-if="website.config.google_sheet_id">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="Google Sheet ID" v-model="website.config.google_sheet_id" disabled>
				<label for="client">Google Sheet ID</label>
			</div>
		</div>

	</div>

</template>