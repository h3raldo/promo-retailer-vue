<script setup>
import Search from "@/EntityComponents/Company/Search.vue";
import Breadcrumbs from "@/components/globals/Breadcrumbs.vue";
</script>

<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			loading: false
		}
	},

	inject: ['order', 'logos', 'vendors', 'updatePricing', 'hasEdited', 'alert', 'symfony', 'urls'],

	computed: {
		publicUrl(){
			return this.urls.public.replace(':id', this.order.id);
		},
		saveUrl(){
			return this.urls.save;
		},
		breadcrumbs(){
			return [
				{
					type: 'company',
					id: this.order.info.company.id,
					title: this.order.info.company.name,
				},
				{
					type: 'quote',
					id: this.order.id,
					title: '#' + this.order.id,
				}
			];
		}
	},

	methods: {
		getData(){
			this.updatePricing();
			return {
				quote: this.order,
				logos: this.logos,
				vendors: this.vendors,
			}
		},

		ajaxUrl(url, cb, ecb)
		{
			let callback = {
				success(data){
					if( data.error === false )
						cb(data)
					else
						ecb(data)
				},
				error(err) {
					ecb(err);
				}
			}

			utils.ajax( url, callback.success, callback.error, this.getData());
		},

		save(){
			let self = this;
			self.loading = true;

			let callback = {
				success(){
					self.alert('Quote Saved!');
					self.loading = false;
					self.hasEdited(false);
				},
				error() {
					self.alert('Error saving quote, see console.', 'danger');
					self.loading = false;
				}
			}

			this.ajaxUrl( this.saveUrl, callback.success, callback.error )
		},
		push(){
			let self = this;
			self.loading = true;

			this.order.info.status = 'pushed';

			let callback = {
				success(){
					self.hasEdited(false);

					self.ajaxUrl(
					  self.urls.push,
					  () => {
						  self.alert('Quote Pushed to Zoho!');
						  self.loading = false;

						  self.toOrder();
					  },
					  () => {
						  self.alert('Error pushing quote, see console.', 'danger');
						  self.loading = false;
					  }
					)
				},
				error() {
					self.alert('Error saving quote, please copy data below and send to your friendly neighborhood developer.', 'danger', self.getData());
					self.loading = false;
				}
			}

			this.ajaxUrl( this.saveUrl, callback.success, callback.error );
		},
		toOrder(){
			let data = this.getData();
			data.order = entity.order.convertFromQuote( data.quote );
			delete data.quote;

			let self = this;

			utils.ajax( this.symfony.orders.order.new, (data) => {

				if( !data || !data.id || data.error === true ){
					self.alert('Error converting to order: '+data.message, 'danger')
					return;
				}

				self.alert('Created New Order + Pushed to Zoho. Order ID: ' + data.id);

			}, (error)=> {
				self.alert('Error converting to order!', 'danger');
				console.log(error)
			}, data )
		},
		onVendorSelect( company )
		{
			this.order.info.company.name = company.name;
			this.order.info.company.id = company.id
		},
	}
}
</script>

<template>

	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-3">
			<div>
				<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
			</div>
			<Breadcrumbs :items="breadcrumbs">
				<span class="badge text-bg-secondary align-self-center">{{ order.info.category }}</span>
			</Breadcrumbs>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<a :href="publicUrl" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Public Version</a>
				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
				<button class="btn btn-danger btn-push-to-zoho" :disabled="loading" @click="push"><i class="bi bi-cloud-arrow-up-fill"></i> Push</button>
			</div>
		</div>
	</div>


	<div class="d-flex gap-3 align-items-center">
		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="order.info.status">
					<option v-for="status in entity.quote.default.statuses" :value="status.value">{{ status.title }}</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>
		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="Quote Name" v-model="order.info.title">
				<label for="client">Quote Title</label>
			</div>
		</div>
		<div class="col-3">
			<div class="input-group">
				<div class="form-floating">
					<input type="text" class="form-control" placeholder="Vendor" v-model="order.info.company.name" disabled>
					<label>Company</label>
				</div>
				<Search :onSelect="onVendorSelect" :buttonText="''" :buttonIcon="'bi-pencil'" />
			</div>
		</div>
	</div>

</template>
