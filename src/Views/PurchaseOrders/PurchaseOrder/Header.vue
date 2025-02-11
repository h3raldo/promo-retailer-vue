<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Search from "@/EntityComponents/Company/Search.vue";
import entity from "@/js/entity.js";
import Breadcrumbs from "@/components/globals/Breadcrumbs.vue";
</script>

<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false
		}
	},

	inject: ['po', 'edited', 'alert','urls', 'fn', 'entities', 'symfony'],

	computed: {
		publicUrl(){
			return this.urls.public.replace(':id', this.po.id);
		},
		saveUrl(){
			return this.urls.save;
		},
		series(){
			if( !this.entities.po ) return false;
			let series = this.entities.po.series;

			if( !series ) return false;

			let current = series.filter( s => s.id === parseInt(this.po.id) )[0];

			return {
				position: current.position,
				total: series.length
			}
		},
		breadcrumbs(){
			let breadcrumbs = [
				{
					type: 'company',
					id: this.po.info.vendor.id,
					title: this.po.info.vendor.name,
				}
			];

			if( this.po.info.references && this.po.info.references[0] )
				breadcrumbs.push({
					type: 'order',
					id: this.po.info.references[0].reference_number,
					title: `#${this.po.info.references[0].reference_number}`,
				})

			breadcrumbs.push({
				type: 'po',
				id: this.po.id,
				title: `#${this.po.id}`,
			})

			return breadcrumbs;
		}
	},

	created() {
	},

	methods: {
		getData(){
			return {
				po: this.po,
			}
		},

		getPOLink( id )
		{
			return this.symfony.views.purchase_orders_purchase_order.replace(':id', id);
		},

		onVendorSelect( company )
		{
			this.po.info.vendor.name = company.name;
			this.po.info.vendor.id = company.id;
			this.po.info.vendor.info = company;
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
					self.alert('Saved!');
					self.loading = false;
					self.fn.hasEdited(false);
				},
				error() {
					self.alert('Error saving, see console.', 'danger');
					self.loading = false;
				}
			}

			this.ajaxUrl( this.saveUrl, callback.success, callback.error )
		}
	}
}
</script>

<template>
	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-3 align-items-center">
			<div>
				<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
			</div>
			<Breadcrumbs :items="breadcrumbs">
				<div class="me-2" v-if="series">
					<Modal title="POs in Series" :button-text="`PO Series ${series.position} / ${series.total}`" id="po-series" button-classes="btn btn-sm btn-outline-secondary">
						<p>List of POs created from the same order</p>
						<table class="table">
							<thead>
							<tr>
								<th>Position</th>
								<th>ID</th>
								<th>Status</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="series in entities.po.series">
								<td>{{ series.position }}</td>
								<td>PO# {{ series.id }} </td>
								<td>{{ series.status }}</td>
								<td>
									<template v-if="series.id === parseInt(po.id)">
										<button class="btn btn-sm btn-outline-primary" disabled>Current</button>
									</template>
									<a v-else class="btn btn-sm btn-outline-primary" :href="getPOLink(series.id)" target="_blank">View PO <i class="bi bi-arrow-right"></i></a>
								</td>
							</tr>
							</tbody>
						</table>
					</Modal>
				</div>
			</Breadcrumbs>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<a :href="publicUrl" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Public Version</a>
				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-center">

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="po.info.status">
					<option v-for="status in entity.purchaseOrder.default.statuses" :value="status.value">{{ status.title }}</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="client" placeholder="Quote Name" v-model="po.info.title">
				<label for="client">Title</label>
			</div>
		</div>

		<div class="col-2">
			<div class="form-floating">
				<input type="text" class="form-control" placeholder="Sales Order Number" :value="po.info.type" disabled>
				<label>PO Type</label>
			</div>
		</div>

		<div class="col-2">
			<div class="input-group">
				<div class="form-floating">
					<input type="text" class="form-control" placeholder="Vendor" v-model="po.info.vendor.name" disabled>
					<label>Vendor</label>
				</div>
				<Search :on-select="onVendorSelect" :button-text="''" :button-icon="'bi-pencil'" />
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-center pt-2">
		<label class="form-check-label bg-gray px-2 rounded small">
			<input class="form-check-input me-1" type="checkbox" v-model="po.info.statuses.paid">
			<span>Paid</span>
		</label>
		<label class="form-check-label bg-gray px-2 rounded small">
			<input class="form-check-input me-1" type="checkbox" v-model="po.info.statuses.sent">
			<span>Sent</span>
		</label>
	</div>

</template>
