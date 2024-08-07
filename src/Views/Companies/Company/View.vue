<script setup>
import Loader from "@/components/globals/Loader.vue";
import Address from "@/components/globals/properties/Address.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Search from "@/EntityComponents/Company/Search.vue";
import SearchCustomers from "@/components/api/Quickbooks/Search.Customers.vue";
</script>
<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	data(){
		return {
			loading: false,
			saving: false,
			id: this.$route.params.id,
			selectedParent: {},
			company: {},
			extra: {},
		}
	},
	inject: ['symfony', 'alert'],
	computed: {
		tabs(){
			return [
			  'Main',
			  'Contacts',
			  'Children'
			]
		}
	},
	methods: {
		retrieve(){
			let self = this;
			let url = this.symfony.api.companies.company.get.replace(':id', self.id);

			self.loading = true;
			utils.ajax(url, (data) => {
				self.company = data.entity;
				self.extra = data.extra;
				entity.company.patch(self.company);
				self.loading = false;
			})
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
			utils.ajax(url, callback.success, callback.error, this.company);
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

	<Loader v-if="loading"/>

	<template v-if="!loading && company.name">

		<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
			<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
			<h2 class="m-0 text-center">
				{{ company.name }}<br>
				<span class="h4" v-if="company.parent_name">Under: {{ company.parent_name }}</span>
			</h2>
			<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save Changes</button>
		</div>

		<br>
		<div class="row">
			<div class="col-9">
				<label class="form-label">Name</label>
				<input class="form-control" type="text" v-model="company.name" />
			</div>
			<div class="col">
				<label class="form-label">Type</label>
				<select class="form-select" v-model="company.type">
					<option value="client">Client</option>
					<option value="vendor">Vendor</option>
				</select>
			</div>
			<div class="col">
				<label class="form-label">&nbsp;</label><br>
				<Search :onSelect="selectParent" :buttonText="'Set Parent'" :buttonIcon="'bi-pencil'" />
			</div>
		</div>
		<div class="d-flex gap-3 pt-2">
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

				<div class="row pt-4">
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

						<h5>Quickbooks Customer</h5>
						<div v-if="!company.data.external.quickbooks.id" class="">
							<p class="text-danger">*Required. Needs a quickbook customer to match for invoicing.</p>
							<SearchCustomers :selected="selectQuickbooksCustomer"/>
						</div>
						<div v-else>
							<button class="btn btn-sm btn-outline-primary me-2" @click="clearQuickbooksCustomer"><i class="bi bi-pencil"></i></button>
							{{ company.data.external.quickbooks.company_name }} - {{ company.data.external.quickbooks.display_name }}
						</div>

						<br>

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

			<template #Children>

				<h3>Sub-Companies</h3>

				<div v-if="extra.children.length">

					<table class="table">
						<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th></th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="child in extra.children" class="align-middle">
							<td>{{ child.id }}</td>
							<td>{{ child.name }}</td>
							<td><button class="btn btn-outline-primary" @click="viewCompany(child.id)">View</button></td>
						</tr>
						</tbody>
					</table>
				</div>
				<div v-else>
					<p>No children companies.</p>
				</div>

			</template>
		</Tabs>

	</template>


</template>