<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>

<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: true,
			data: {}
		}
	},

	inject: ['symfony'],

	methods: {
		multi(e){
			utils.ajaxButtons.multi.click(e.target);
		},
		single(e){
			utils.ajaxButtons.single.click(e.target);
		},

		getClearSingleUrl( id, type ){
			return `/sheets/clear-cache/single/${id}/${type}`
		}
	},

	mounted() {
		if( this.data.globals ) return;
		let self = this;

		utils.ajax(this.symfony.sources.globals, (data) => {
			self.data = data;
			self.loading = false;
		})
	}
}

</script>

<template>

	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li class="nav-item" role="presentation">
			<button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Supplier Sheets</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Global Sheets</button>
		</li>
		<li class="nav-item" role="presentation">
			<button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Prismic</button>
		</li>
	</ul>

	<Loader v-if="loading" />

	<div class="tab-content" id="myTabContent">

		<!-- supplier sheets -->
		<div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
			<div class="py-3">
				<template v-for="spreadsheet in data.skus">
					<div class="row align-items-center">
						<div class="col-4">
							<span class="h3">{{ spreadsheet.name }}</span>
							<br>
							<a :href="`https://docs.google.com/spreadsheets/d/${spreadsheet.google_sheet_id}/edit#gid=0`" target="_blank">View Sheet</a> |
							<a :href="`/magento/import/products/generate/${spreadsheet.google_sheet_id}/${spreadsheet.zoho_id}/`" target="_blank">View Imports</a> |
							<a :href="`/zoho/supplier/export/${spreadsheet.id}/`" target="_blank">View Zoho Exports</a>
						</div>
						<div class="col-auto">
							<div class="btn-group">
								<button class="btn btn-outline-primary multi-step" @click="multi">
									<span>Refresh Groups</span>
									<input type="hidden" name="Refreshing Groups..." :value="`/sheets/clear-cache/single/${spreadsheet.google_sheet_id}/groups`">
									<input type="hidden" name="Importing Groups..." :value="`/import/supplier/groups/${spreadsheet.google_sheet_id}/${spreadsheet.zoho_id}/`">
								</button>

								<button class="btn btn-outline-success multi-step" @click="multi">
									<span>Refresh SKUs</span>
									<input type="hidden" name="Refreshing SKUs..." :value="`/sheets/clear-cache/single/${spreadsheet.google_sheet_id}/skus`">
									<input type="hidden" name="Importing SKUs..." :value="`/import/supplier/skus/${spreadsheet.google_sheet_id}/${spreadsheet.id}/`">
								</button>
							</div>
						</div>
					</div>
					<hr>
				</template>
			</div>
		</div>


		<!-- global sheets -->
		<div class="tab-pane fade pt-4" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
			<template v-for="global in data.globals">
				<div class="row align-items-center">
					<div class="col-4">
						<span class="h3">{{ global.type }}</span> &nbsp;
						<a :href="`https://docs.google.com/spreadsheets/d/${global.id}/edit#gid=0`" target="_blank">View Sheet</a>
					</div>
					<div class="col-auto">

						<button class="btn btn-outline-primary multi-step" @click="multi">
							<span>Refresh</span>

							<input type="hidden" name="Refreshing Sheet..." :value="`/sheets/clear-cache/single/${global.id}/${global.sheet}`">

							<template v-if="global.type === 'Zoho Vendor Ids'">
								<input type="hidden" name="Pushing..." value="/zoho/vendors/refresh/">
							</template>

							<template v-if="global.type === 'Input Fields'">
								<input type="hidden" name="Pushing to Magento..." value="/magento/import/custom_fields/">
							</template>

						</button>

					</div>
				</div>
				<hr>
			</template>
		</div>


		<!-- prismic -->
		<div class="tab-pane fade pt-4" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
			<h3>Decorators</h3>
			<button class="btn btn-primary single-step" data-url="/clear-cache/prismic/decorators" @click="single">Refresh Data</button>
		</div>

	</div>

</template>

<style>
.btn span{
	pointer-events: none;
}
</style>