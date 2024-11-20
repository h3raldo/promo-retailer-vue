<script setup>
import Loader from "@/components/globals/Loader.vue";
import Items from "@/Views/Websites/Website/Preview/Items.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data(){
		return {
			data: {},
			loading: true,
		}
	},
	inject: ['symfony'],

	computed: {
		googleSheetUrl(){
			return `https://docs.google.com/spreadsheets/d/${this.data.google_sheet_id}/edit#gid=0`;
		},
		magentoUrl(){
			return `https://${this.data.uid}.promoretailer.dev`
		}
	},

	mounted() {
		let params = new URL(document.location).searchParams;
		let token = params.get('token');
		let id = params.get('documentId');

		let searchParams = new URLSearchParams();
		searchParams.set('token', token);
		searchParams.set('documentId', id);

		let url = this.symfony.website.get + '?' + searchParams.toString();

		let self = this;
		utils.ajax(url, data => {
			self.data = data;
			self.loading = false;
		})
	}
}
</script>

<template>

	<Loader v-if="loading" />

	<template v-if="data.id">

		<div class="bg-light p-5 mb-4 border">

			<div class="row align-items-center">
				<div class="col">
					<img :src="data.design.logo" alt="" width="200">
					<h1 class="color_primary">{{ data.name }}</h1>
					<p>
						<a target="_blank" :href="googleSheetUrl">View Spreadsheet</a>
						| <a target="_blank" :href="magentoUrl">View Magento Store</a>
						<template v-if="data.parent_id !== ''">
							| <a target="_blank" :href="`/preview/website/parent/${data.parent_id}/`">View all Children Stores</a>
						</template>
					</p>
				</div>
				<div class="col text-end">
					<div class="d-flex gap-2 justify-content-end pb-3">
						<button class="btn btn-primary clear-cache" data-refresh="true" :data-url="`/clear-cache/prismic/website/${data.id}/logos`">Refresh Logos</button>
						<button class="btn btn-outline-primary clear-cache" data-refresh="true" :data-url="`/sheets/clear-cache/website/${data.google_sheet_id}`">1. Refresh Website SKUs</button>
						<button class="btn btn-outline-success clear-cache" data-refresh="true" :data-url="`/clear-cache/prismic/website/${data.id}/document`">2. Refresh Website</button>
					</div>
					<div class="d-flex gap-2 justify-content-end">
						<button class="btn btn-outline-dark clear-cache" :data-url="`/magento/import/sql/${data.id}/skus/?token=${data.previewToken}`">Import SKUs</button>
						<button class="btn btn-outline-dark clear-cache" :data-url="`/magento/import/sql/${data.id}/design/?token=${data.previewToken}`">Import Website Data</button>
					</div>
				</div>

			</div>

		</div>

		<ul class="nav nav-pills mb-3 p-3 bg-light" >
			<li class="nav-item" role="presentation">
				<button class="nav-link active">Groups with Decoration Sets</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link">Categories</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" >Logos</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" >Website Data</button>
			</li>
		</ul>

		<Items :skus_with_decorations="data.skus_with_decorations" :placement_keys="data.placement_keys" />

	</template>


</template>