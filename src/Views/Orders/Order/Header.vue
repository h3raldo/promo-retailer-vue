<script setup>
import Search from "@/EntityComponents/Company/Search.vue";
</script>
<script>
import LogoSearch from "@/EntityComponents/Order/Logos/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import CreatePOs from "@/Views/Orders/Order/CreatePOs.vue"
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	components: {Modal, LogoSearch, CreatePOs},
	data() {
		return {
			loading: false
		}
	},

	inject: ['order', 'logos', 'vendors', 'updatePricing', 'hasEdited', 'alert', 'symfony', 'urls'],

	computed: {
		publicUrl() {
			return this.urls.public.replace(':id', this.order.id);
		},
		packingSlip(){
			return this.symfony.api.orders.order.packing_slip.replace(':id', this.order.id);
		},
		saveUrl() {
			return this.urls.save;
		}
	},

	methods: {
		getData() {
			this.updatePricing();
			return {
				order: this.order,
				logos: this.logos,
				vendors: this.vendors,
			}
		},

		onVendorSelect( company )
		{
			this.order.info.company.name = company.name;
			this.order.info.company.id = company.id
		},

		ajaxUrl(url, cb, ecb) {
			let callback = {
				success(data) {
					if (data.error === false)
						cb(data)
					else
						ecb(data)
				},
				error(err) {
					ecb(err);
				}
			}

			utils.ajax(url, callback.success, callback.error, this.getData());
		},

		save() {
			let self = this;
			self.loading = true;

			let callback = {
				success() {
					self.alert('Order Saved!');
					self.loading = false;
					self.hasEdited(false);
				},
				error() {
					self.alert('Error saving order, see console.', 'danger');
					self.loading = false;
				}
			}

			this.ajaxUrl(this.saveUrl, callback.success, callback.error)
		},
		push() {
			let self = this;
			self.loading = true;

			this.order.info.status = 'pushed';

			let callback = {
				success() {
					self.hasEdited(false);

					self.ajaxUrl(
					  self.urls.push,
					  () => {
						  self.alert('Pushed to Zoho!');
						  self.loading = false;
					  },
					  () => {
						  self.alert('Error pushing, see console.', 'danger');
						  self.loading = false;
					  }
					)
				},
				error() {
					self.alert('Error saving, please copy data below and send to your friendly neighborhood developer.', 'danger', self.getData());
					self.loading = false;
				}
			}

			this.ajaxUrl(this.saveUrl, callback.success, callback.error);
		},
		goToPurchaseOrder( id ){
			this.$refs.poModal.$refs.closeModalButton.click();
			this.$router.push(this.symfony.views.purchase_orders_purchase_order.replace(':id', id))
		}
	}
}
</script>

<template>
	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-3">
			<div>
				<RouterLink :to="symfony.views.orders" class="btn btn-secondary"><i
				  class="bi bi-arrow-bar-left"></i></RouterLink>
			</div>
			<div class="fw-bold fs-4">
				ORDER #{{ order.id }}
			</div>
			<span class="badge text-bg-secondary align-self-center">{{ order.info.source }}</span>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<a :href="publicUrl" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Public Version</a>
				<a :href="packingSlip" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Packing Slip</a>
				<Modal :id="'create-po'" :title="'Create POs'" :buttonText="'Create POs'" :buttonClasses="'btn btn-primary'" :icon="'bi-node-plus'" ref="poModal">
					<CreatePOs :goToPurchaseOrder="goToPurchaseOrder"  />
				</Modal>
				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex align-items-center">
		<div class="flex-grow-1">
			<div class="d-flex gap-3 align-items-center">
				<div>
					<div class="form-floating">
						<select class="form-select" id="status" v-model="order.info.status">
							<option value="new">New</option>
							<option value="sent">Sent</option>
							<option value="confirmed">Confirmed</option>
							<option value="closed">Closed</option>
							<option value="complete">Complete</option>
						</select>
						<label for="status">Status</label>
					</div>
				</div>
				<div class="col-4">
					<div class="form-floating">
						<input type="text" class="form-control" id="client" placeholder="Quote Name" v-model="order.info.title">
						<label for="client">Title</label>
					</div>
				</div>
				<div class="col-2">
					<div class="form-floating">
						<input type="text" class="form-control" id="client" placeholder="Quote Name"
							   v-model="order.info.reference_number">
						<label for="client">Reference Number</label>
					</div>
				</div>

				<div class="col-3">
					<div class="input-group">
						<div class="form-floating">
							<input type="text" class="form-control" placeholder="Vendor" v-model="order.info.company.name" disabled>
							<label>Company</label>
						</div>
						<Search :on-select="onVendorSelect" :button-text="''" :button-icon="'bi-pencil'" />
					</div>
				</div>

			</div>
		</div>
	</div>
</template>
