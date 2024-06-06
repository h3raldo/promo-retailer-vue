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
		publicUrl(){
			return this.urls.public.replace(':id', this.order.id);
		},
		saveUrl(){
			return this.urls.save;
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
		}
	}
}
</script>

<template>
	<div class="d-flex align-items-center p-3 bg-light">
		<div class="flex-grow-1">
			<div class="d-flex gap-3 align-items-center">
				<div>
					<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
				</div>
				<div>
					<div class="form-floating">
						<select class="form-select" id="status" v-model="order.info.status">
							<option value="draft">Draft</option>
							<option value="sent">Sent</option>
							<option value="confirmed">Confirmed</option>
							<option value="pushed">Pushed</option>
							<option value="closed">Closed</option>
						</select>
						<label for="status">Status</label>
					</div>
				</div>
				<div class="col-5">
					<div class="form-floating">
						<input type="text" class="form-control" id="client" placeholder="Quote Name" v-model="order.info.title">
						<label for="client">Quote Title</label>
					</div>
				</div>
				<div>
					<Modal :id="'quote-info-edit'" :title="'Quote Info'" :buttonText="''" :buttonClasses="'btn btn-primary'" :icon="'bi-pencil'">
						<div class="d-flex flex-column gap-3">
							<div class="d-flex gap-4 align-items-center">
								<label class="col-2 text-end">Category:</label>
								<div>
									<select class="form-select" id="status" v-model="order.info.category">
										<option value="standard">Standard</option>
										<option value="bid">Bid</option>
										<option value="idea">Idea</option>
									</select>
								</div>
							</div>
							<div class="d-flex gap-4 align-items-center">
								<label class="col-2 text-end">Quote Date:</label>
								<div class="col-2">
									<input type="date" class="form-control" placeholder="Date" v-model="order.info.date" >
								</div>
							</div>
							<div class="d-flex gap-4 align-items-center">
								<label class="col-2 text-end">In-Hands Date:</label>
								<div class="col-2">
									<input type="date" class="form-control" placeholder="In Hands Date" v-model="order.info.deliver_by">
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
								<input class="form-control" type="text" v-model="order.client.name" />
							</div>
							<div class="d-flex gap-4">
								<label class="form-label col-2 text-end pt-2">Client Email:</label>
								<input class="form-control" type="text" v-model="order.client.email" />
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
						</div>
					</Modal>
				</div>
			</div>
		</div>
		<div class="text-end d-flex gap-2">
			<a :href="publicUrl" class="btn btn-outline-primary"><i class="bi bi-eye"></i> Public Version</a>
			<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			<button class="btn btn-danger btn-push-to-zoho" :disabled="loading" @click="push"><i class="bi bi-cloud-arrow-up-fill"></i> Push</button>
<!--			<button class="btn btn-danger btn-push-to-zoho" :disabled="loading" @click="toOrder"><i class="bi bi-send"></i> Order</button>-->
		</div>
	</div>
</template>
