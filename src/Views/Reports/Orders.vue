<script setup>
import Loader from "@/components/globals/Loader.vue";
import utils from "@/js/utils.js";
import OrderSearch from "@/Views/Orders/Search.vue";
import POSearch from "@/Views/PurchaseOrders/Search.vue";
</script>

<script>
import utils from "@/js/utils.js";

export default {

	data(){
		return {
			loading: true,
			entity: 'orders',
			available: ['orders', 'purchase_orders'],
			report: {},
			searchParams: {},
			group: '',
		}
	},

	inject: ['alert', "symfony"],

	methods: {
		getReport(params){
			let self = this;
			if( !params ) params = '';

			let base_url;

			switch (this.entity){
				case 'orders':
					base_url = this.symfony.api.orders.report;
					break;
				case 'purchase_orders':
					base_url = this.symfony.api.purchase_orders.report;
					break;
			}

			let url = base_url + '?' + params

			self.loading = true;
			utils.ajax(url, (data) => {
				self.report = data;
				self.searchParams = data.search;
				self.loading = false;
			}, (error) => {
				self.alert(error.message, 'danger');
			})
		},
		prettify( column ){
			return column.replaceAll('_', ' ');
		},
		roundToHours( minutes )
		{
			let hrs = minutes / 60;
			return Math.round(hrs * 100) / 100
		}
	},

	mounted(){
		this.getReport();
	}
}
</script>
<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"><i class="bi bi-table"></i> Report - <span class="text-capitalize">{{ entity }}</span></h3>
		</div>
		<div class="d-flex gap-2 align-items-center">
			<div>
				Report Type:
			</div>
			<div>
				<select v-model="entity" class="form-select">
					<option v-for="type in available" :value="type" class="text-capitalize">{{ type.toUpperCase() }}</option>
				</select>
			</div>
		</div>
	</div>

	<template v-if="entity === 'orders'">
		<OrderSearch :getEntities="getReport" :searchParams="searchParams" />
	</template>
	<template v-else>
		<POSearch :getEntities="getReport" :searchParams="searchParams" />
	</template>

	<br><hr>

	<Loader v-if="loading" />
	<div v-else>
		<table class="table table-striped">
			<thead>
			<tr>
				<th class="col-4"></th>
				<th>Value/QTY</th>
				<th>TIME</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(value, key) in report.result">
				<td class="text-capitalize">{{ prettify(key) }}</td>

				<td colspan="2" v-if="key === 'count'">{{ value }}</td>
				<td colspan="2" v-else-if="key.includes('margin')">{{ value }}%</td>
				<td colspan="2" v-else>{{ utils.pricing.format(value) }}</td>
			</tr>
			<template v-if="report.decorator_totals">
				<tr>
					<td class="fw-bold">Decorators</td>
					<td></td>
					<td></td>
				</tr>
			<tr v-for="(decorator, decorator_id) in report.decorator_totals" class="border-bottom pb-3 mb-3">
				<td>{{ decorator_id }}</td>
				<td>{{ decorator.qty }}</td>
				<td>{{ roundToHours(decorator.production) }}hrs</td>
			</tr>
			</template>
			</tbody>
		</table>

		<template v-if="report.decorator_totals">

			<br><hr><br>


			<div v-for="(decorator, decorator_id) in report.decorator_totals" class="border-bottom pb-3 mb-3">

				<h2>{{ decorator_id }}</h2>

				<div>


					<table class="table table-sm table-bordered">
						<thead>
						<tr>
							<th>sheet</th>
							<th>logo</th>
							<th>qty</th>
							<th>production time</th>
						</tr>
						<tr>
							<th class="text-bg-secondary">{{ decorator_id }}</th>
							<th class="text-bg-secondary"></th>
							<th class="text-bg-secondary">{{ decorator.qty }}</th>
							<th class="text-bg-secondary">{{ roundToHours(decorator.production) }}hrs</th>
						</tr>
						</thead>
						<tbody>
						<template v-for="(sheet, sheet_id) in decorator.sheets">
							<tr>
								<td class="bg-light">
									{{ sheet_id }}<br>
									<span v-if="sheet.match === 'none'" class="text-danger"><small><i class="bi bi-info-circle"></i> no match</small></span>
									<span v-if="sheet.match === 'decorator'" class="text-danger"><small><i class="bi bi-info-circle"></i> using first decorator sheet</small></span>
									<span v-if="sheet.match === 'sheet'" class="text-success"><small><i class="bi bi-check-circle"></i> matched</small></span>
								</td>
								<td class="bg-light"></td>
								<td class="bg-light">{{ sheet.qty }}</td>
								<td class="bg-light">{{ roundToHours(sheet.production) }}hrs</td>
							</tr>
							<tr v-for="(logo, logo_id) in sheet.logos">
								<td></td>
								<td>
									<div class="row">
										<div class="col-8">
											<a :href="logo_id" target="_blank">{{logo_id.replace('https://res.cloudinary.com/promo-retailer/image/upload/logos/', '')}}</a>
											<details>
												<summary>POs</summary>
												<ul>
													<li v-for="(value, key) in logo.pos"><a :href="`/admin/purchase-orders/order/${key}/`" target="_blank">{{ key }}</a></li>
												</ul>
											</details>
										</div>
										<div class="col">
											<img :class="logo_id.includes('dark') ? 'bg-secondary' : ''" :src="logo_id" height="20" />
										</div>
									</div>
								</td>
								<td>{{logo.qty}}</td>
								<td>{{ roundToHours(logo.production) }}hrs</td>
							</tr>
						</template>
						</tbody>
					</table>

					<details class="pb-2">
						<summary>All Locations</summary>
						<table class="table table-sm">
							<thead>
							<tr>
								<th>location</th>
								<th>qty</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="( location, location_name) in decorator.locations">
								<td>{{ location_name }}</td>
								<td>{{ location.qty }}</td>
							</tr>
							</tbody>
						</table>
					</details>

					<details class="pb-2">
						<summary>All Logos</summary>
						<table class="table table-sm">
							<thead>
							<tr>
								<th>logo</th>
								<th>qty</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="( logo, logo_url) in decorator.logos">
								<td><a :href="logo_url" target="_blank">{{logo_url.replace('https://res.cloudinary.com/promo-retailer/image/upload/logos/', '')}}</a> </td>
								<td>{{ logo.qty }}</td>
							</tr>
							</tbody>
						</table>
					</details>

				</div>

			</div>

		</template>

	</div>
</template>