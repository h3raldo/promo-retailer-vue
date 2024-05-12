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

	inject: ['po', 'edited', 'alert','urls'],

	computed: {
		publicUrl(){
			return this.urls.public.replace(':id', this.po.id);
		},
		saveUrl(){
			return this.urls.save;
		}
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
					self.alert('Quote Saved!');
					self.loading = false;
					self.edited(false);
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
				PO #{{ po.id }}
			</div>
			<span>
				<span class="badge text-bg-secondary align-self-center me-2" v-for="reference in po.info.created_from">
					{{reference.source.toUpperCase()}}: {{ reference.id }}
				</span>
			</span>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<button :data-href="publicUrl" class="btn btn-outline-primary" disabled><i class="bi bi-eye"></i> Public Version</button>
				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex align-items-center">
		<div class="flex-grow-1">
			<div class="d-flex gap-3 align-items-center">

				<div>
					<Modal :id="'quote-info-edit'" :title="'Quote Info'" :buttonText="''" :buttonClasses="'btn btn-primary'" :icon="'bi-pencil'">

						<div class="d-flex flex-column gap-3">

							<div class="d-flex gap-4 align-items-center">
								<label class="col-2 text-end">Date:</label>
								<div class="col-2">
									<input type="date" class="form-control" placeholder="Date"
										   v-model="po.info.date">
								</div>
							</div>

							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Vendor:</label>
								<input class="form-control" type="text" v-model="po.info.vendor.name"/>
							</div>

							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Order Notes (Public):</label>
								<textarea class="form-control" v-model="po.info.notes.public"></textarea>
							</div>

							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Order Notes (Private):</label>
								<textarea class="form-control" v-model="po.info.notes.private"></textarea>
							</div>
						</div>

					</Modal>
				</div>

				<div>
					<div class="form-floating">
						<select class="form-select" id="status" v-model="po.info.status">
							<option value="draft">Draft</option>
							<option value="sent">Sent</option>
							<option value="confirmed">Confirmed</option>
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
			</div>
		</div>
	</div>
</template>
