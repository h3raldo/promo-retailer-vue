<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Search from "@/EntityComponents/Company/Search.vue";
</script>

<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false
		}
	},

	inject: ['po', 'edited', 'alert','urls', 'fn'],

	computed: {
		publicUrl(){
			return this.urls.public.replace(':id', this.po.id);
		},
		saveUrl(){
			return this.urls.save;
		}
	},

	created() {
		console.log('created header', this.po.items);
	},

	methods: {
		getData(){
			return {
				po: this.po,
			}
		},

		onVendorSelect( company )
		{
			this.po.info.vendor.name = company.name;
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
			<div class="fw-bold fs-4">
				PO #{{ po.id }} <span v-if="po.info.vendor.name">-- {{ po.info.vendor.name }}</span> <span class="text-capitalize"> -- {{ po.info.type }}</span>
			</div>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<a :href="publicUrl" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Public Version</a>
				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex align-items-center">
		<div class="flex-grow-1">
			<div class="d-flex gap-3 align-items-center">

				<div>
					<div class="form-floating">
						<select class="form-select" id="status" v-model="po.info.status">
							<option value="open">Open</option>
							<option value="closed">Closed</option>
						</select>
						<label for="status">Status</label>
					</div>
				</div>

				<div class="col-4">
					<div class="form-floating">
						<input type="text" class="form-control" id="client" placeholder="Quote Name" v-model="po.info.title">
						<label for="client">Title</label>
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

				<div>
					<label class="form-check-label">
						<input class="form-check-input me-1" type="checkbox" v-model="po.info.statuses.paid">
						<span>Paid</span>
					</label>
					<br>
					<label class="form-check-label">
						<input class="form-check-input me-1" type="checkbox" v-model="po.info.statuses.sent">
						<span>Sent</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>
