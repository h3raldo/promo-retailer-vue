<script setup>
import Search from "@/ViewComponents/Reports/Search.vue";
import Loader from "@/components/globals/Loader.vue";
</script>

<script>
import utils from "@/js/utils.js";

export default {

	data(){
		return {
			loading: true,
			report: {},
			group: '',
		}
	},

	inject: ['alert', "symfony"],

	methods: {
		getReport(params){
			let self = this;
			if( !params ) params = '';

			let url = this.symfony.reports.orders + '?' + params

			self.loading = true;
			utils.ajax(url, (data) => {
				self.report = data.report;
				self.group = data.group;
				self.loading = false;
			}, (error) => {
				self.alert(error.message, 'danger');
			})
		}
	},

	mounted(){
		this.getReport();
	}
}
</script>
<template>
	<Search :search="getReport" />

	<br>

	<Loader v-if="loading" />

	<template v-if="report.skus">

		<ul class="nav nav-pills bac mb-3 p-3 bg-light" id="myTab" role="tablist">
			<li class="nav-item" role="presentation">
				<button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">SKUs</button>
			</li>
			<li class="nav-item" role="presentation">
				<button class="nav-link" id="compiled-tab" data-bs-toggle="tab" data-bs-target="#compiled-tab-pane" type="button" role="tab" aria-controls="compiled-tab-pane" aria-selected="false" >Logos</button>
			</li>
		</ul>

		<div class="tab-content" id="myTabContent">

			<!--
				  totals
			-->
			<div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">

				<table class="table">
					<thead>
						<tr>
							<th class="col-1">sku</th>
							<th class="col-2">color</th>
							<th class="col-1">size</th>
							<th class="col-4">group</th>
							<th class="col-1">qty</th>
							<th class="col-1">revenue</th>
							<th class="col-1">sup. cost</th>
							<th class="col-1">dec. cost</th>
						</tr>
					</thead>

					<tbody>

					<template v-for="sku in report.skus">
					<tr class="table-primary">
						<td colspan="4">
							<details class="ps-1">
								<summary>{{ sku.sku }}</summary>
								{{ sku.name }}
							</details>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>

						<template v-for="color in sku.colors">
						<tr>
							<td></td>
							<td>{{ color.color }}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>

							<template v-for="size in color.sizes">
							<tr>
								<td></td>
								<td></td>
								<td>{{ size.size }}</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>

								<template v-for="website in size.websites">
								<tr v-if="group === 'website'">
									<td></td>
									<td></td>
									<td></td>
									<td>{{ website.website }}</td>
									<td>{{ website.qty }}</td>
									<td>{{ utils.pricing.format(website.revenue) }}</td>
									<td>{{ utils.pricing.format(website.supplier_cost) }}</td>
									<td>{{ utils.pricing.format(website.decorator_cost) }}</td>
								</tr>

									<template v-if="group === 'store'">
									<tr v-for="store in website.stores">
										<td></td>
										<td></td>
										<td></td>
										<td><span class="badge text-bg-secondary">{{ website.website }}</span> {{ store.store }}</td>
										<td>{{ store.qty }}</td>
										<td>{{ utils.pricing.format(store.revenue) }}</td>
										<td>{{ utils.pricing.format(store.supplier_cost) }}</td>
										<td>{{ utils.pricing.format(store.decorator_cost) }}</td>
									</tr>
									</template>

								</template>

								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td>total</td>
									<td>{{ size.qty }}</td>
									<td>{{ utils.pricing.format(size.revenue) }}</td>
									<td>{{ utils.pricing.format(size.supplier_cost) }}</td>
									<td>{{ utils.pricing.format(size.decorator_cost) }}</td>
								</tr>

							</template>
						</template>
					</template>

					</tbody>

				</table>

			</div>


			<!--
				  logos
			-->
			<div class="tab-pane fade" id="compiled-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">

				<table class="table">
					<thead>
					<tr>
						<th class="col-6">logo</th>
						<th class="col-2">decorator</th>
						<th class="col-2">location</th>
						<th class="col-2">total qty</th>
					</tr>
					</thead>
					<tbody>
					<template v-for="logo in report.logos">
					<tr class="table-primary">
						<td>
							<div class="row align-items-center">
								<div class="col" style="width: 100px;height: 100px;display: flex;align-items: center;justify-content: center;">
									<img :src="logo.image" height="50" loading="lazy" alt="">
								</div>
								<div class="col">
									{{ logo.logo }}
								</div>
							</div>
						</td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<template v-for="decorator in logo.decorators">
					<tr>
						<td></td>
						<td>{{ decorator.decorator }}</td>
						<td></td>
						<td></td>
					</tr>
					<template v-for="location in decorator.locations">
					<tr>
						<td></td>
						<td></td>
						<td>{{ location.location }}</td>
						<td>{{ location.qty }}</td>
					</tr>
					</template>
					</template>
					</template>
					</tbody>
				</table>

			</div>

		</div>

	</template>

</template>