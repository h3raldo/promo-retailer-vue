<script setup>
import Search from "@/EntityComponents/Company/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import HeaderEmail from "@/Views/Orders/Order/Header.Email.vue";
</script>
<script>
import LogoSearch from "@/EntityComponents/Order/Logos/Search.vue";
import CreatePOs from "@/Views/Orders/Order/CreatePOs.vue"
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	components: {LogoSearch, CreatePOs},
	data() {
		return {
			loading: false,
			invoiced: false,
		}
	},

	inject: ['order', 'logos', 'vendors', 'updatePricing', 'hasEdited', 'alert', 'symfony', 'urls', 'init', 'entities'],

	computed: {
		ableToSendEmail(){
			return ( this.entities.company && this.entities.company.data && this.entities.company.data.contacts.approval && this.entities.company.data.contacts.approval.email)
		},
		ableToInvoice(){
			return !this.init.invoice_quickbooks_id && !this.invoiced && this.init.company_quickbooks_id
		},
		printView() {
			return this.symfony.api.orders.order.print.replace(':id', this.order.id );
		},
		publicUrl() {
			return this.urls.public.replace(':id', this.init.public_id );
		},
		packingSlip(){
			return this.symfony.api.orders.order.packing_slip.replace(':id', this.order.id);
		},
		saveUrl() {
			return this.urls.save;
		},
		deleteUrl()
		{
			return this.symfony.orders.order.delete.replace(':id', this.order.id);
		},
		duplicateUrl()
		{
			return this.symfony.orders.order.duplicate.replace(':id', this.order.id);
		},
		companyName()
		{
			let name = this.order.info.company.name;
			if( this.order.info.company.parent_name )
				name += ' (' + this.order.info.company.parent_name + ')';
			return name;
		}
	},

	methods: {
		email(){
			let mail = document.createElement("a");
			let self = this;

			function fillInVariables( string ){

				let variables = [
					{
						variable: '[company_name]',
						value: self.entities.company.name,
					},
					{
						variable: '[client_name]',
						value: self.order.client.name,
					},
					{
						variable: '[approver_name]',
						value: self.entities.company.data.contacts.approval.first_name,
					},
					{
						variable: '[approver_email]',
						value: self.entities.company.data.contacts.approval.email,
					},
					{
						variable: '[reference_number]',
						value: self.order.info.reference_number,
					},
					{
						variable: '[sales_order_url]',
						value: self.publicUrl,
					}
				]

				variables.forEach( v => {
					string = string.replaceAll( v.variable, v.value );
				})

				string = string.replace(/(?:\r\n|\r|\n)/g, '%0D%0A');

				return string;
			}

			utils.config.get.approvalEmail( (response) => {
				if( !response ) return;
				let body = fillInVariables( response.body );
				let subject = fillInVariables( response.subject );
				mail.href = `mailto:${self.entities.company.data.contacts.approval.email}?subject=${subject}&body=${body}`;
				self.order.info.statuses.emailed = true;
				self.save();
				mail.click();
			} )

		},
		invoice()
		{
			let self = this;
			let url = this.symfony.api.orders.order.invoice;
			let data = { order: self.order.id }

			let callback = {
				success() {
					self.alert('Invoice successfully created!');
					self.loading = false;
					self.invoiced = true;
				},
				error(r) {
					self.alert(`Error creating invoice. ${r.message}`, 'danger');
					self.loading = false;
				}
			}

			self.loading = true;
			this.ajaxUrl(url, callback.success, callback.error, data)
		},

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
			this.entities.company = company;
			this.order.info.company.name = company.name;
			this.order.info.company.id = company.id
			this.order.info.company.parent_name = company.parent
		},

		ajaxUrl(url, cb, ecb, data=this.getData()) {
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

			utils.ajax(url, callback.success, callback.error, data);
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
		},
		togglePaid(e){
			if( e.target.checked ){
				this.order.totals.paid = this.order.totals.total + this.order.totals.tax;
			} else {
				this.order.totals.paid = 0;
			}
		},
		toggleShipped(e){
			if( e.target.checked ){
				this.order.info.shipped = utils.time.getDateAsString();
			}
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

			<span v-if="init.invoice_quickbooks_id || invoiced" class="badge text-bg-success align-self-center"><i class="bi bi-currency-dollar"></i> Invoiced</span>
		</div>
		<div>
			<div class="text-end d-flex gap-2">

				<div class="btn-group">
					<button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
						View
					</button>
					<ul class="dropdown-menu">
						<li><a class="dropdown-item" :href="publicUrl"><i class="bi bi-eye"></i> Public View</a></li>
						<li><a class="dropdown-item" :href="printView"><i class="bi bi-printer"></i> Print View</a></li>
						<li><a class="dropdown-item" :href="packingSlip"><i class="bi bi-receipt"></i> Packing Slip</a></li>
					</ul>
				</div>

				<div class="btn-group">
					<button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
						Actions
					</button>
					<ul class="dropdown-menu">
						<li>
							<Modal :id="'create-po'" :title="'Create POs'" :buttonText="'Create POs'" :buttonClasses="'dropdown-item'" :icon="'bi-node-plus'" ref="poModal">
								<CreatePOs :goToPurchaseOrder="goToPurchaseOrder"  />
							</Modal>
						</li>
						<li v-if="ableToInvoice"><button class="dropdown-item" :disabled="loading" @click="invoice"><i class="bi bi-currency-dollar"></i> Invoice</button></li>
						<li v-if="ableToSendEmail">
							<HeaderEmail :save="save" :publicUrl="publicUrl" />
						</li>
						<li><hr class="dropdown-divider"></li>
						<li><a class="dropdown-item" :href="duplicateUrl"><i class="bi bi-copy"></i> Duplicate</a></li>
						<li>
							<Modal :id="'delete-order'" :title="'Are you sure?'" :buttonText="'Delete'" :icon="'bi-trash'" :buttonClasses="'dropdown-item text-danger'">
								<p>Will be deleted permanently. Cannot be undone.</p>
								<a class="btn btn-danger" :href="deleteUrl"><i class="bi bi-trash"></i> DELETE</a>
							</Modal>
						</li>
					</ul>
				</div>

				<button class="btn btn-primary" :disabled="loading" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-center">
		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="order.info.status">
					<option v-for="status in entity.order.default.statuses" :value="status.value">{{ status.title }}</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>
		<div>
			<div class="form-floating">
				<select class="form-select" id="type" v-model="order.info.type">
					<option v-for="type in entity.order.default.types" :value="type.value">{{ type.title }}</option>
				</select>
				<label for="type">Type</label>
			</div>
		</div>
		<div class="flex-grow-1">
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
					<input type="text" class="form-control" placeholder="Vendor" :value="companyName" disabled>
					<label>Company</label>
				</div>
				<Search :on-select="onVendorSelect" :button-text="''" :button-icon="'bi-pencil'" />
			</div>
		</div>

	</div>

	<div class="d-flex gap-3 align-items-center pt-2">
		<div>
			<label class="form-check-label bg-gray px-2 rounded small">
				<input class="form-check-input me-1" type="checkbox" @change="togglePaid" v-model="order.info.statuses.paid">
				<span>Paid</span>
			</label>
		</div>
		<div>
			<label class="form-check-label bg-gray px-2 rounded small">
				<input class="form-check-input me-1" type="checkbox" v-model="order.info.statuses.invoiced">
				<span>Invoiced</span>
			</label>
		</div>
		<div>
			<label class="form-check-label bg-gray px-2 rounded small">
				<input class="form-check-input me-1" type="checkbox" @change="toggleShipped" v-model="order.info.statuses.shipped">
				<span>Shipped</span>
			</label>
		</div>
		<div>
			<label class="form-check-label bg-gray px-2 rounded small">
				<input class="form-check-input me-1" type="checkbox" v-model="order.info.statuses.emailed">
				<span>Emailed</span>
			</label>
		</div>
	</div>
</template>
