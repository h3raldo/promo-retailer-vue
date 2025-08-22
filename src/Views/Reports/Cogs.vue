<script setup>
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
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

			let url = this.symfony.api.reports.product + '?' + params

			self.loading = true;
			utils.ajax(url, (data) => {
				self.report = data;
				self.loading = false;
			}, (error) => {
				self.alert(error.message, 'danger');
			})
		},
		formatPrice( price )
		{
			return utils.pricing.format( price );
		},
		subtractPercent( price, percent )
		{
			let new_price = price - (price * (percent / 100));
			return price - new_price;
		}
	},

	mounted(){
		this.getReport();
	}
}
</script>
<template>

	<h2>Report V2</h2>

	<Loader v-if="loading" />

	<template v-if="report.order_totals">

		<hr>

		<div class="row">
			<div class="col">
				<h4>Total Sales</h4>
				{{ formatPrice(report.order_totals.price_total) }}
			</div>
			<div class="col">
				<h4>Total Cost</h4>
				Actual: {{ formatPrice(report.purchase_order_totals.total_cost) }}
				<br>
				<span class="text-secondary">Estimated: {{ formatPrice(report.order_totals.total_cost) }}</span>
			</div>
			<div class="col">
				<h4>Commissions</h4>
				<table class="table">
					<tbody>
					<tr>
						<td>Actual Cost</td>
						<td>{{ formatPrice(report.purchase_order_totals.total_cost) }}</td>
					</tr>
					<tr>
						<td>Lender Commission (5%)</td>
						<td>-{{ formatPrice(subtractPercent(report.purchase_order_totals.total_cost, 5)) }}</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="col">
				<h4>Profit</h4>
				<table class="table">
					<tbody>
					<tr>
						<td>Sales</td>
						<td>{{ formatPrice(report.order_totals.price_total) }}</td>
					</tr>
					<tr>
						<td>Cost</td>
						<td>- {{ formatPrice(report.purchase_order_totals.total_cost) }}</td>
					</tr>
					<tr>
						<td>Lender Commission (5%)</td>
						<td>-{{ formatPrice(subtractPercent(report.purchase_order_totals.total_cost, 5)) }}</td>
					</tr>
					<tr>
						<td>profit</td>
						<td>{{ formatPrice( report.order_totals.price_total - report.purchase_order_totals.total_cost - subtractPercent(report.purchase_order_totals.total_cost, 5) ) }}</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>

		<table class="table">
			<thead>
			<tr>
				<th>Product</th>
				<th>Price</th>
				<th>Cost</th>
				<th>Tax</th>
				<th>Qty</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="product in report.product">
				<td>{{ product.name }}</td>
				<td>{{ formatPrice(product.price_total) }}</td>
				<td>{{ formatPrice(product.total_cost) }}</td>
				<td>{{ formatPrice(product.total_tax) }}</td>
				<td>{{ product.qty }}</td>
			</tr>
			</tbody>
		</table>

	</template>

</template>