<script setup>
import Loader from "@/components/globals/Loader.vue";
import Address from "@/components/globals/properties/Address.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Search from "@/EntityComponents/Company/Search.vue";
import SearchCustomers from "@/components/api/Quickbooks/Search.Customers.vue";
import Logos from "@/Views/Companies/Company/Logos.vue";
import Websites from "@/Views/Companies/Company/Websites.vue";
import Breadcrumbs from "@/components/globals/Breadcrumbs.vue";
</script>
<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";
import {computed} from "vue";

export default {
	data(){
		return {
			loading: true,
			saving: false,
			id: this.$route.params.id,
			selectedParent: {},
			extra: {},
			entities: {},
		}
	},
	inject: ['symfony', 'alert'],
	computed: {
		tabs(){

			let tabs = [
				'Main',
				'Logos',
				'Websites',
				'Child_Companies',
				'Contacts',
				'Decorators',
				'Quickbooks',
			];

			if( !this.extra || !this.extra.children || !this.extra.children.length ){
				tabs.splice(tabs.indexOf('Child_Companies'), 1);
			}

			return tabs;
		},
		company(){
			return this.entities.company;
		},
		breadcrumbs(){

			let crumbs = [];

			if( this.company.parent_name )
				crumbs.push(
					{
						type: 'company',
						id: this.company.parent,
						title: this.company.parent_name,
					}
				);

			crumbs.push({
				type: 'company',
				title: this.company.name
			})

			return crumbs;
		}
	},
	methods: {
		retrieve(){
			let self = this;
			let url = this.symfony.api.companies.company.get.replace(':id', self.id);

			self.loading = true;
			utils.ajax(url, (data) => {
				self.extra = data.extra;
				self.entities = data.entities;
				entity.company.patch(self.company);
				self.loading = false;
			})
		},
		goToDecorator(id){
			this.$router.push( this.symfony.views.decorators_decorator.replace(':id', id) )
		},
		save() {
			let self = this;
			let url = this.symfony.api.companies.company.save;
			let callback = {
				success(d) {

					if( d.error === false )
						self.alert('Company Saved!');
					else
						self.alert(`Error saving: ${d.message}`, 'danger');

					self.saving = false;
				},
				error() {
					self.alert('Error saving, see console.', 'danger');
					self.saving = false;
				}
			}

			self.saving = true;
			utils.ajax(url, callback.success, callback.error, { entities: { company: this.company }});
		},
		addProperty(){
			this.company.data.properties.push({ name: 'Property', value: 'Value' })
		},
		removeProperty(index){
			this.company.data.properties.splice(index, 1);
		},
		selectParent(company){
			this.company.parent_name = company.name;
			this.company.parent = company.id;
		},
		viewCompany(id)
		{
			this.$router.push({
				name: 'companies_company',
				params: { id: id }
			});
		},
		clearQuickbooksCustomer(){
			this.company.data.external.quickbooks.id = '';
			this.company.data.external.quickbooks.display_name = '';
			this.company.data.external.quickbooks.company_name = '';
		},
		selectQuickbooksCustomer( customer ){
			this.company.data.external.quickbooks.id = customer.Id;
			this.company.data.external.quickbooks.display_name = customer.DisplayName;
			this.company.data.external.quickbooks.company_name = customer.CompanyName;
		},
		deletePrefilledData(){
			if( this.company.name === 'New Company' )
				this.company.name = '';
		},
		copyQBAddressToCompany( qb_address, type ) {
			let address = this.company.data.billing.address;
			if( type === 'shipping')
				address = this.company.data.shipping.address;

			address.company = ( this.company.parent_name ? this.company.parent_name : this.company.name ) ;
			address.first_name = this.extra.quickbooks_data.GivenName;
			address.last_name =this.extra.quickbooks_data.FamilyName;
			address.address_line_1 = qb_address.Line1;
			address.address_line_2 = qb_address.Line2;
			address.city = qb_address.City;
			address.state = qb_address.CountrySubDivisionCode;
			address.postal_code = qb_address.PostalCode;
		},
		onLogoSelect(logo){
			console.log('selected', logo);
		}
	},
	provide() {
		return {
			company: computed(() => this.company),
			entities: computed(() => this.entities),
		}
	},
	mounted() {
		this.retrieve();
	},
	created() {
		let self = this;

		this.$watch(
		  () => this.$route.params.id,
		  (newId, oldId) => {
			  self.id = newId;
			  self.retrieve();
		  }
		)
	}
}
</script>

<template>

	<Loader v-if="loading" />

	<template v-if="!loading">

		<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
			<div class="d-flex gap-3">
				<div>
					<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
				</div>
				<Breadcrumbs :items="breadcrumbs">
					<Search :onSelect="selectParent" buttonText="Set Parent Company" buttonIcon="bi-pencil" buttonClasses="btn btn-sm btn-outline-primary" />
				</Breadcrumbs>
			</div>
			<div class="">
				<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save Changes</button>
			</div>
		</div>


		<br>
		<div class="row">
			<div class="col-9">
				<div class="form-floating">
					<input class="form-control" type="text" v-model="company.name" @focus="deletePrefilledData" />
					<label class="form-label">Name</label>
				</div>
			</div>
			<div class="col">
				<div class="form-floating">
					<select class="form-select" v-model="company.type">
						<option value="client">Client</option>
						<option value="vendor">Vendor</option>
					</select>
					<label class="form-label">Type</label>
				</div>
			</div>
		</div>
		<div class="d-flex gap-3 pt-2" v-if="company.type === 'vendor'">
			<div>
				<label class="form-check-label">
					<input class="form-check-input me-1" type="checkbox" v-model="company.data.type.supplier">
					<span>Supplier</span>
				</label>
			</div>
			<div>
				<label class="form-check-label">
					<input class="form-check-input me-1" type="checkbox" v-model="company.data.type.decorator">
					<span>Decorator</span>
				</label>
			</div>
		</div>
		<br>

		<Tabs :labels="tabs">
			<template #Main>

				<div class="row pt-2">
					<div class="col">

						<!--
						<h5>Primary Contact</h5>
						<div class="row">
							<div class="col-10">
								<input class="form-control" type="text" placeholder="Primary Contact" disabled />
							</div>
							<div class="col-2">
								<button class="btn btn-outline-primary"><i class="bi bi-pencil"></i></button>
							</div>
						</div>

						<br>
						-->

						<details class="mb-3">
							<summary class="bg-light p-2">Billing Address</summary>
							<div class="p-3 bg-light">
								<Address :address="company.data.billing.address" />
							</div>
						</details>

						<details>
							<summary class="bg-light p-2">Shipping Address</summary>
							<div class="p-3 bg-light">
								<Address :address="company.data.shipping.address" />
							</div>
						</details>

						<hr>

						<div class="mt-2 pb-2">
							<label class="form-label">Approval Email</label>
							<input type="email" class="form-control" v-model="company.data.contacts.approval.email" />
						</div>

						<div class="mt-2 pb-2">
							<label class="form-label">Approval First Name</label>
							<input type="email" class="form-control" v-model="company.data.contacts.approval.first_name" />
						</div>

						<div class="mt-2 pb-2">
							<label class="form-label">Approval Last Name</label>
							<input type="email" class="form-control" v-model="company.data.contacts.approval.last_name" />
						</div>

						<div class="mt-2">
							<label class="form-check-label">
								<input class="form-check-input me-1" type="checkbox" v-model="company.data.config.contacts_from_order"><span>Generate Contacts from Orders</span>
							</label>
						</div>

					</div>
					<div class="col">
						<div v-for="(property, i) in company.data.properties" class="d-flex gap-3 pb-3">

							<div class="col-5">
								<input v-model="property.name" class="form-control" type="text" />
							</div>

							<div><label class="col-form-label">:</label></div>

							<div class="col-5">
								<input v-model="property.value" class="form-control" type="text" />
							</div>

							<div class="col-1">
								<button class="btn btn-outline-danger" @click="removeProperty(i)"><i class="bi bi-x-circle"></i></button>
							</div>

						</div>

						<button @click="addProperty" class="btn btn-primary">Add Property</button>
					</div>
				</div>

			</template>

			<template #Contacts>

				<h3>Company Contacts</h3>
				<div v-if="extra.contacts" class="bg-light p-3">
					<div v-for="contact in extra.contacts">{{ contact.first_name }} {{ contact.last_name }} <{{ contact.email }}></div>
				</div>

			</template>

			<template #Child_Companies>

				<h3>Sub-Companies</h3>

				<div v-if="extra.children.length">

					<table class="table align-middle">
						<thead>
						<tr>
							<th class="col-1"></th>
							<th>ID</th>
							<th>Name</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="child in extra.children">
							<td><button class="btn btn-sm btn-primary" @click="viewCompany(child.id)">Edit</button></td>
							<td>{{ child.id }}</td>
							<td>{{ child.name }}</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div v-else>
					<p>No children companies.</p>
				</div>

			</template>

			<template #Decorators>
				<h3>Decorators</h3>
				<div v-for="decorator in extra.decorators" class="py-2 col-6">
					<details class="bg-light p-2">
						<summary class="p-2 fw-bold">
							<span>{{ decorator.name }}</span> <span class="float-end"><code>{{ decorator.decorator_id }}</code></span>
							<button class="btn btn-outline-primary btn-sm ms-2" @click="goToDecorator(decorator.id)">Edit</button>
						</summary>

						<div v-for="unit_sheet in decorator.sheets.unit" class="pb-1 px-2">
							<table class="table table-sm table-bordered">
								<thead>
								<tr>
									<th>{{ unit_sheet.filters[0].value.from }} {{ unit_sheet.filters[0].attr }}
										- {{ unit_sheet.filters[0].value.to }} {{ unit_sheet.filters[0].attr }}</th>
									<th>Time</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>Setup time: </td>
									<td>{{ unit_sheet.production.time_setup }}</td>
								</tr>
								<tr>
									<td>Group Size: </td>
									<td>{{ unit_sheet.production.time_group_size }}</td>
								</tr>
								<tr>
									<td>Time Per Group:</td>
									<td>{{ unit_sheet.production.time_per_group }}</td>
								</tr>
								</tbody>
							</table>
						</div>
					</details>
				</div>
			</template>

			<template #Quickbooks>

				<h5>Quickbooks Customer</h5>
				 <div class="p-3 bg-light col-6">
					<div v-if="!company.data.external.quickbooks.id" class="">
						<p class="text-danger">*Required. Needs a quickbook customer to match for invoicing.</p>
						<SearchCustomers :selected="selectQuickbooksCustomer"/>
					</div>
					<div v-else>
						<button class="btn btn-sm btn-outline-primary me-2" @click="clearQuickbooksCustomer"><i class="bi bi-pencil"></i></button>
						{{ company.data.external.quickbooks.company_name }} - {{ company.data.external.quickbooks.display_name }}
					</div>
				 </div>

				<div v-if="extra.quickbooks_data" class="pt-3 row">
					<div class="col">

						 <div class="mb-2" v-if="extra.quickbooks_data.PrimaryEmailAddr">
							<label class="form-label">Primary Email</label>
							<input class="form-control" v-model="extra.quickbooks_data.PrimaryEmailAddr.Address" readonly disabled>
						 </div>

						<div class="row">
							<div class="col">
								<div class="mb-2">
									<label class="form-label">Primary First Name</label>
									<input class="form-control" v-model="extra.quickbooks_data.GivenName" readonly disabled>
								</div>
							</div>
							<div class="col">
								<div class="mb-2">
									<label class="form-label">Primary Last Name</label>
									<input class="form-control" v-model="extra.quickbooks_data.FamilyName" readonly disabled>
								</div>
							</div>
						</div>

						<div class="mb-2">
							<label class="form-label">Payment Method Ref</label>
							<input class="form-control" v-model="extra.quickbooks_data.PaymentMethodRef" readonly disabled>
						 </div>

						<div class="mb-2">
							<label class="form-label">Sales Term Ref</label>
							<input class="form-control" v-model="extra.quickbooks_data.SalesTermRef" readonly disabled>
						</div>


						<div class="mb-2">
							<label class="form-label">Tax Code Ref</label>
							<input class="form-control" v-model="extra.quickbooks_data.DefaultTaxCodeRef" readonly disabled>
						 </div>


					</div>

					<div class="col">
						<div class="mb-2" v-if="extra.quickbooks_data.BillAddr">
							<address>
								<h5>Billing Address</h5>
								<span class="d-block">{{ extra.quickbooks_data.BillAddr.Line1 }}</span>
								<span class="d-block">{{ extra.quickbooks_data.BillAddr.Line2 }}</span>
								<span class="d-block">{{ extra.quickbooks_data.BillAddr.City }},</span>
								<span class="d-block">{{ extra.quickbooks_data.BillAddr.CountrySubDivisionCode }}</span>
								<span class="d-block">{{ extra.quickbooks_data.BillAddr.PostalCode }}</span>
							</address>
							<button class="btn btn-sm btn-outline-primary" @click="copyQBAddressToCompany(extra.quickbooks_data.BillAddr, 'billing')">Copy to Primary Billing</button>
						</div>

						<div class="mb-2 pt-3" v-if="extra.quickbooks_data.ShipAddr">
							<address>
								<h5>Shipping Address</h5>
								<span class="d-block">{{ extra.quickbooks_data.ShipAddr.Line1 }}</span>
								<span class="d-block">{{ extra.quickbooks_data.ShipAddr.Line2 }}</span>
								<span class="d-block">{{ extra.quickbooks_data.ShipAddr.City }},</span>
								<span class="d-block">{{ extra.quickbooks_data.ShipAddr.CountrySubDivisionCode }}</span>
								<span class="d-block">{{ extra.quickbooks_data.ShipAddr.PostalCode }}</span>
							</address>
							<button class="btn btn-sm btn-outline-primary" @click="copyQBAddressToCompany(extra.quickbooks_data.ShipAddr, 'shipping')">Copy to Primary Shipping</button>
						</div>

						<div class="mb-2">
							<label class="form-check-label">
								<input class="form-check-input me-1" type="checkbox" v-model="extra.quickbooks_data.BillWithParent">
								<span>Bill Parent?</span>
							</label>
						</div>
					</div>
				</div>

			</template>

			<template #Websites>
				<Websites />
			</template>

			<template #Logos>
				<Logos />
			</template>
		</Tabs>

	</template>


</template>