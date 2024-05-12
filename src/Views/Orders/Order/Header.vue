<script>
import LogoSearch from "@/EntityComponents/Order/Logos/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	components: {Modal, LogoSearch},
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
		saveUrl() {
			return this.urls.save;
		}
	},

	methods: {
		addAttribute()
		{
			this.order.info.attributes.push( entity.order.attribute.create() );
		},
		getData() {
			this.updatePricing();
			return {
				order: this.order,
				logos: this.logos,
				vendors: this.vendors,
			}
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
				<button :data-href="publicUrl" class="btn btn-outline-primary" disabled><i class="bi bi-eye"></i> Public Version</button>
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
					<!--
				<div class="col-2">
					<div class="form-floating">
						<select class="form-select" id="source" v-model="order.info.source">
							<option value="quote">Quote</option>
							<option value="magento">Magento</option>
						</select>
						<label for="source">Source</label>
					</div>
				</div>
				-->
				<div class="col-2">
					<div class="form-floating">
						<input type="text" class="form-control" id="client" placeholder="Quote Name"
							   v-model="order.info.reference_number">
						<label for="client">Reference Number</label>
					</div>
				</div>
				<div>
					<Modal :id="'quote-info-edit'" :title="'Quote Info'" :buttonText="''"
						   :buttonClasses="'btn btn-primary'" :icon="'bi-pencil'">
						<div class="d-flex flex-column gap-3">
							<div class="d-flex gap-4 align-items-center">
								<label class="col-2 text-end">Date:</label>
								<div class="col-2">
									<input type="date" class="form-control" placeholder="Date"
										   v-model="order.info.date">
								</div>
							</div>
							<div class="d-flex gap-4 align-items-center">
								<label class="col-2 text-end">In-Hands Date:</label>
								<div class="col-2">
									<input type="date" class="form-control" placeholder="In Hands Date"
										   v-model="order.info.deliver_by">
								</div>
								<div>
									<label>Is Firm?</label>
								</div>
								<div class="col-2">
									<select class="form-select" id="status" v-model="order.info.deliver_by_strict">
										<option :value="true">Yes</option>
										<option :value="false">No</option>
									</select>
								</div>
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">PO Number:</label>
								<input class="form-control" type="text" v-model="order.info.po_number" />
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Client Name:</label>
								<input class="form-control" type="text" v-model="order.client.name"/>
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Client Email:</label>
								<input class="form-control" type="text" v-model="order.client.email"/>
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Client Info:</label>
								<textarea class="form-control" v-model="order.client.info"></textarea>
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Ship To:</label>
								<textarea class="form-control" v-model="order.client.ship_to"></textarea>
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Order Notes (Public):</label>
								<textarea class="form-control" v-model="order.info.notes.public"></textarea>
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Order Notes (Private):</label>
								<textarea class="form-control" v-model="order.info.notes.private"></textarea>
							</div>

							<div v-for="attribute in order.info.attributes" class="d-flex gap-2 align-items-center">
								<div class="col-2">
									<input class="form-control text-end" type="text" placeholder="Name" v-model="attribute.name">
								</div>
								<div>:</div>
								<input class="form-control" type="text" placeholder="Value" v-model="attribute.value">
							</div>

							<div class="d-flex gap-4">
								<div class="col-2"></div>
								<div>
									<button class="btn btn-primary" @click="addAttribute"><i class="bi bi-plus-circle"></i> Add Attribute</button>
								</div>
							</div>
						</div>
					</Modal>
				</div>
			</div>
		</div>
	</div>
</template>
