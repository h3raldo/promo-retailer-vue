<script setup>
import Header from "@/Views/Websites/Website/Header.vue";
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Products from "@/Views/Websites/Website/View.Products.vue";
import ViewLogos from "@/Views/Websites/Website/View.Logos.vue";
import Search from "@/EntityComponents/Website/Search.vue";
import LogoSearch from "@/EntityComponents/Logo/Search.vue";
import BackgroundToggle from "@/EntityComponents/Logo/BackgroundToggle.vue";
</script>
<script>
import utils from "@/js/utils.js";
import {computed} from "vue";

export default {
	inject: ['symfony'],

	data() {
		return {
			id: this.$route.params.id,
			loading: false,
			notFound: false,
			entities: {
				website: {},
				logos: []
			},
			editing: {
				logos: false,
			},
			urls: this.symfony.api.websites.website,
			tabs: ['Settings', 'Logos', 'Products', 'Categories'],
		}
	},

	computed: {
		publicUrl(){
			return `https://${this.entities.website.handle}.promoretailer.com`;
		},
	},


	provide() {
		return {
			website: computed(() => this.entities.website),
			logos: computed(() => this.entities.logos),
		}
	},

	methods: {
		setParent(website){
			this.entities.website.parent.id = website.id;
			this.entities.website.parent.name = website.name;
		},
		setLogo(logo, variant){
			console.log(logo, variant);
			this.entities.website.config.design.logo.id = variant.id;
			this.entities.website.config.design.logo.image = variant.image;
		},
		initiate(){
			let self = this;
			let url = self.urls.get.replace(':id', self.id);
			self.loading = true;

			utils.ajax(url, (d) => {

				self.loading = false;

				if (!d.entities.website) {
					self.notFound = true;
					return;
				}

				self.entities.website = d.entities.website;
				self.entities.logos = d.entities.logos;

				if( typeof self.entities.website.config.orders === 'undefined' ){
					self.entities.website.config.orders = {
						processing_type: 'default',
						processing_date: null,
						approval: false,
						approval_contact: null,
						payment_required: true,
						shipping_required: true
					}
				}

				if( typeof self.entities.website.config.design.logo == 'undefined' )
					self.entities.website.config.design.logo = {
						id: null,
						image: null,
					}
			});
		}
	},

	watch: {
		'$route.params.id'(){
			this.id = this.$route.params.id;
			this.initiate();
		}
	},

	created() {
		this.initiate();
	}
}
</script>
<template>

	<Loader v-if="loading" />

	<template v-if="!loading">

		<template v-if="notFound">
			<h1>Website Not Found</h1>
		</template>

		<template v-else>
			<Header />

			<Tabs :labels="tabs">
				<template #Settings>

					<div class="row">
						<div class="col">

							<h4 class="border-bottom pb-2 mb-4">Design</h4>

							<div class="col-6">

								<div class="border-bottom pb-2 mb-2 d-flex gap-3 align-items-center justify-content-between">
									<h6 class="mb-0">Website Header Logo</h6>
									<LogoSearch :selectVariant="true" buttonClasses="btn btn-primary btn-sm" :buttonText="'Set Logo'" :buttonIcon="'bi bi-floppy'" :onSelect="setLogo" :company-id="entities.website.company.id" />
								</div>
								<div class="mb-4">
									<div v-if="entities.website.config.design.logo.id">
										<BackgroundToggle :image="entities.website.config.design.logo.image" height="100" />
									</div>
									<div v-else>
										-- No Logo Set --
									</div>
								</div>


								<table class="table table-sm align-middle">
									<thead>
									<tr>
										<th class="col-3">Colors</th>
										<th class="col-3"></th>
										<th></th>
									</tr>
									</thead>
									<tbody>
									<tr>
										<td>Primary</td>
										<td><span class="badge text-bg-secondary">{{ entities.website.config.design.color_primary || 'NOT SET' }}</span></td>
										<td>
											<input type="color" class="form-control form-control-color" placeholder="Primary Color" v-model="entities.website.config.design.color_primary">
										</td>
									</tr>
									<tr>
										<td>Secondary</td>
										<td><span class="badge text-bg-secondary">{{ entities.website.config.design.color_secondary || 'NOT SET' }}</span></td>
										<td>
											<input type="color" class="form-control form-control-color" placeholder="Secondary Color" v-model="entities.website.config.design.color_secondary">
										</td>
									</tr>
									<tr>
										<td>Tertiary</td>
										<td><span class="badge text-bg-secondary">{{ entities.website.config.design.color_tertiary || 'NOT SET' }}</span></td>
										<td>
											<input type="color" class="form-control form-control-color" placeholder="Tertiary Color" v-model="entities.website.config.design.color_tertiary">
										</td>
									</tr>
									</tbody>
								</table>

							</div>

							<br>

							<h4 class="border-bottom pb-2 mb-4">Orders & Checkout</h4>
							<div class="col-6">

								<table class="table table-sm align-middle">
									<thead>
									<tr>
										<th class="col-6">Setting</th>
										<th></th>
									</tr>
									</thead>
									<tbody>
									<tr>
										<td>Process Orders</td>
										<td>
											<select class="form-select form-select-sm" v-model="entities.website.config.orders.processing_type">
												<option value="default">Default (Immediately)</option>
												<option value="bulk">All at Once (Bulk Order)</option>
											</select>
										</td>
									</tr>
									<tr v-if="entities.website.config.orders.processing_type === 'bulk'">
										<td>Order Process Date</td>
										<td>
											<input type="date" class="form-control form-control-sm" v-model="entities.website.config.orders.processing_date">
										</td>
									</tr>
									<tr>
										<td>Approval</td>
										<td>
											<select class="form-select form-select-sm" v-model="entities.website.config.orders.approval">
												<option :value="false">Default (Does Not Need Approval)</option>
												<option :value="true">Needs Approval</option>
											</select>
										</td>
									</tr>
									<tr v-if="entities.website.config.orders.approval">
										<td>Approval Contact</td>
										<td>
											<select class="form-select form-select-sm" v-model="entities.website.config.orders.approval_contact">
												<option :value="false">Client</option>
												<option :value="true">John Appleseed (email@domain.com)</option>
											</select>
										</td>
									</tr>
									<tr>
										<td>Payment Required</td>
										<td>
											<select class="form-select form-select-sm" v-model="entities.website.config.orders.payment_required">
												<option :value="true">Default (Yes)</option>
												<option :value="false">No</option>
											</select>
										</td>
									</tr>
									<tr>
										<td>Shipping Required</td>
										<td>
											<select class="form-select form-select-sm" v-model="entities.website.config.orders.shipping_required">
												<option :value="true">Default (Yes)</option>
												<option :value="false">No</option>
											</select>
										</td>
									</tr>
									</tbody>
								</table>

							</div>

						</div>
						<div class="col-4">

							<div class="bg-light p-3 mb-4">
								<div class="border-bottom pb-2 mb-2 d-flex gap-3 align-items-center">
									<h6 class="mb-0"><i class="bi bi-bar-chart-line-fill"></i> Reporting</h6>
								</div>

								<table class="table table-light table-sm">
									<tbody>
									<tr class="">
										<td>Total Orders</td>
										<td>{{ entities.website._reports.orders.count }}</td>
									</tr>
									<tr>
										<td>Total Revenue</td>
										<td>{{ utils.pricing.format(entities.website._reports.orders.total) }}</td>
									</tr>
									<tr>
										<td>Total Cost</td>
										<td>{{ utils.pricing.format(entities.website._reports.orders.total_cost) }}</td>
									</tr>
									<tr>
										<td>Total Profit</td>
										<td>{{ utils.pricing.format(entities.website._reports.orders.total_profit) }}</td>
									</tr>
									<tr>
										<td>Total Margin</td>
										<td>{{ utils.pricing.calculateMargin( entities.website._reports.orders.total_cost, entities.website._reports.orders.total ) }}%</td>
									</tr>
									</tbody>
								</table>
							</div>

							<div class="bg-light p-3">
								<div class="border-bottom pb-2 mb-2 d-flex gap-3 align-items-center">
									<h6 class="mb-0"><i class="bi bi-layout-text-window-reverse"></i> Magento Settings</h6>
									<span v-if="entities.website.config.magento.store_id" class="badge text-bg-success">Store Connected <i class="bi bi-check-circle-fill"></i> </span>
									<span v-else class="badge text-bg-secondary">Store Not Created</span>
								</div>
								<div class="row mb-3">
									<div class="col">
										<label class="form-label">Website ID:</label>
										<input type="text" class="form-control" placeholder="Website ID" v-model="entities.website.config.magento.website_id" disabled>
									</div>
									<div class="col">
										<label class="form-label">Store ID:</label>
										<input type="text" class="form-control" placeholder="Store ID" v-model="entities.website.config.magento.group_id" disabled>
									</div>
									<div class="col">
										<label class="form-label">Store View ID:</label>
										<input type="text" class="form-control" placeholder="Store View ID" v-model="entities.website.config.magento.store_id" disabled
										>
									</div>
								</div>

								<a v-if="entities.website.config.magento.store_id" class="btn btn-success" :href="publicUrl" target="_blank"><small>Open Website &raquo;</small></a>
							</div>

							<br>

							<div class="bg-light p-3 mb-4">

								<div class="border-bottom pb-2 mb-2 d-flex gap-3 align-items-center">
									<h6 class="mb-0">Parent</h6>
									<Search :onSelect="setParent" :hideChildren="true" buttonClasses="btn btn-primary btn-sm" buttonText="Set Parent" icon="bi bi-plus-circle" />
									<span v-if="entities.website.parent.id" class="badge text-bg-warning">Parent: {{ entities.website.parent.name }}</span>
									<span v-else class="badge text-bg-secondary">No Parent</span>
								</div>

								<small>Note: Does not affect reporting. Only groups the website into the parent so that users may access the child sites via the top right dropdown.</small>

							</div>
						</div>
					</div>

				</template>

				<template #Logos>
					<ViewLogos :editing="editing"  />
				</template>

				<template #Products>
					<Products />
				</template>

				<template #Categories>
					<p>Coming soon.</p>
				</template>
			</Tabs>
		</template>

	</template>

</template>