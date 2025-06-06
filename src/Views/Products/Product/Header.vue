<script setup>
import Search from "@/EntityComponents/Company/Search.vue";
import Breadcrumbs from "@/components/globals/Breadcrumbs.vue";
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
	inject: ['product', 'symfony', 'afterCreate', 'returnToModal', 'variants', 'alert'],
	computed: {
		companyLink(){
			if( !this.product.company || !this.product.company.id ) return false;
			return this.symfony.views.companies_company.replace(':id', this.product.company.id)
		},
		createError(){
			if( !this.variants || !this.variants.length ) return 'No Variants';

			return false;
		},
		saveData() {
			let self = this;
			return {
				entities: {
					product: self.product,
					variants: self.variants,
				}
			}
		},
		hasSageSupplier(){
			return ( this.product.data && this.product.data.external && this.product.data.external.sage && this.product.data.external.sage.supplier && this.product.data.external.sage.supplier.suppId )
		},
		breadcrumbs(){
			return [
				{
					type: 'company',
					id: this.product.company.id,
					title: this.product.company.name,
				},
				{
					type: 'product',
					title: this.product.name,
				}
			];
		}
	},
	methods: {
		save(){
			let self = this;
			this.loading = true;

			function onSuccess( r ){
				if( r.error === false ) self.alert('Product Saved')
				else self.alert('Error Saving Product', 'danger', r.message);
				self.loading = false;
			}

			function onError( e ){
				self.alert('Error Saving Product', 'danger', e);
				self.loading = false;
			}

			utils.ajax( this.symfony.api.products.product.save, onSuccess, onError, this.saveData )
		},

		syncWithMagento(){
			let self = this;
			this.loading = true;

			function onSuccess( r ){
				if( r.error === false ) self.alert('Product Synced To Magento')
				else self.alert('Error Syncing', 'danger', r.message);
				self.product.magento_id = r.magento_id;
				self.loading = false;
			}

			function onError( e ){
				self.alert('Error Syncing', 'danger', e);
				self.loading = false;
			}

			utils.ajax( this.symfony.api.products.product.magento.sync.replace(':id', this.product.id), onSuccess, onError )
		},

		create(){
			let self = this;
			this.loading = true;

			function onSuccess( r ){
				if( r.error !== false || r.id === null ) {
					self.alert('Issue with Product Creation', 'danger', r.message);
					return;
				}

				self.product.id = r.id;
				if ( self.afterCreate ) self.afterCreate( self.product );
				self.loading = false;
			}

			function onError( e ){
				self.loading = false;
			}

			utils.ajax( this.symfony.api.products.product.create, onSuccess, onError, this.saveData )
		},

		onCompanySelect( company )
		{
			if( !this.product.company ) return;

			this.product.company.id = company.id;
			this.product.company.name = company.name;

			if( this.returnToModal ) this.returnToModal();
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
			<Breadcrumbs :items="breadcrumbs" />
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<template v-if="product.id === null">
					<span v-if="createError" class="text-danger">{{ createError }}</span>
					<button class="btn btn-primary" :disabled="loading || createError" @click="create"><i class="bi bi-floppy-fill"></i> Create</button>
				</template>
				<button v-else class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
				<button class="btn btn-warning" :disabled="loading" @click="syncWithMagento"><i class="bi bi-arrow-repeat"></i> Sync to Magento</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-start">

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="product.status">
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="product.bundle">
					<option :value="true">Bundle</option>
					<option :value="false">Default</option>
				</select>
				<label for="status">Type</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="Name" v-model="product.name">
				<label for="client">Name</label>
			</div>
		</div>

		<div class="col-2">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="SKU" v-model="product.sku">
				<label for="client">SKU</label>
			</div>
		</div>

		<div class="col-3">
			<div class="input-group">
				<template v-if="(!product.supplier || !product.supplier.id) && hasSageSupplier">
					<div class="form-floating">
						<input type="text" class="form-control" placeholder="Vendor" v-model="product.data.external.sage.supplier.coName" disabled>
						<label>Company</label>
					</div>
				</template>
				<template v-else>
					<div class="form-floating">
						<input v-if="product.company" type="text" class="form-control" placeholder="Vendor" v-model="product.company.name" disabled>
						<label>Company</label>
					</div>
					<Search :on-select="onCompanySelect" :button-text="''" :button-icon="'bi-pencil'" />
				</template>
			</div>
			<div class="form-text" v-if="companyLink"><RouterLink :to="companyLink">View Company</RouterLink></div>
		</div>

	</div>

</template>