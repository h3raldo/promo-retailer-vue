<script setup>
</script>
<script>
export default {
	data() {
		return {}
	},

	props: ['sageProduct'],

	computed: {
		firstImage() {
			return this.sageProduct.pics[0];
		}
	},
	inject: [],
	methods: {},
	created() {
		console.log('passed', this.sageProduct);
	}
}
</script>
<template>
	<div class="pt-3 mt-3">
		<div class="row">
			<div class="col col-5">
				<img v-if="firstImage" :src="firstImage.url" alt="">
				<div class="pb-2">
					<img v-for="img in sageProduct.pics" :src="img.url" alt="" width="70">
				</div>
			</div>
			<div class="col col-7">

				<span v-if="sageProduct.verified" class="badge bg-secondary">Verified</span>
				<span v-if="sageProduct.discontinued" class="badge bg-danger">Discontinued</span>

				<h1 class="pb-2">{{ sageProduct.prName }}</h1>

				<table class="table table-sm">
					<thead>
					<tr>
						<td class="col-3"></td>
						<td></td>
					</tr>
					</thead>
					<tbody>
					<tr>
						<th>Item #</th>
						<td>{{ sageProduct.itemNum }}</td>
					</tr>
					<tr>
						<th>Category</th>
						<td>{{ sageProduct.category }}</td>
					</tr>
					<tr>
						<th>Colors</th>
						<td>{{ sageProduct.colors }}</td>
					</tr>
					<tr>
						<th>Description</th>
						<td>{{ sageProduct.description }}</td>
					</tr>
					<tr>
						<th>Supplier</th>
						<td>
							{{ sageProduct.supplier.coName }}<br>
							{{ sageProduct.supplier.email }}<br>
							{{ sageProduct.supplier.tollFreeTel }}<br>
							<a href="https://{{ sageProduct.supplier.web }}" target="_blank">View Website</a>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
		</div>

		<br><br>

		<table class="table table-striped">
			<thead>
			<tr>
				<th scope="col">Quantity</th>
				<th v-for="qty in sageProduct.qty" scope="col">{{ qty }}</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<th>List Price</th>
				<td v-for="catPrc in sageProduct.catPrc">{{ catPrc }}</td>
			</tr>
			<tr>
				<th>Net Cost</th>
				<td v-for="net in sageProduct.net">{{ net }}</td>
			</tr>
			<tr>
				<th>Prc</th>
				<td v-for="prc in sageProduct.prc">{{ prc }}</td>
			</tr>
			</tbody>
		</table>

		<br><br>

		<h3>Options:</h3>
		<table class="table">
			<thead>
			<tr>
				<th scope="col">
					Quantity
				</th>
				<th scope="col" v-for="qty in sageProduct.qty">{{ qty }}</th>
			</tr>
			</thead>
			<tbody>
			<template v-for="option in sageProduct.options">
				<tr class="bg-light">
					<th colspan="100"><b>{{ option.Name }}</b></th> <!-- option type: ex: Sizes -->
				</tr>
				<template v-for="value in option.Values">
					<tr>
						<th>{{ value.Value }}</th> <!-- option name:ex Small -->
						<td v-for="Prc in value.Prc">+{{ Prc }}</td>
					</tr>
				</template>
			</template>
			</tbody>
		</table>

		<br><br>

		<table class="table">
			<tbody>
			<tr>
				<th class="col-3">Themes</th>
				<td>{{ sageProduct.themes }}</td>
			</tr>
			<tr>
				<th>Decoration</th>
				<td>{{ sageProduct.decorationMethod }}. Price includes {{ sageProduct.priceIncludes }}</td>
			</tr>
			<tr>
				<th>Line</th>
				<td>{{ sageProduct.lineName }}</td>
			</tr>
			<tr>
				<th>Product Compliance</th>
				<td>{{ sageProduct.productCompliance }}</td>
			</tr>
			<tr>
				<th>Production Time</th>
				<td>{{ sageProduct.prodTime }}</td>
			</tr>
			<tr>
				<th>Packaging</th>
				<td>{{ sageProduct.package }}</td>
			</tr>
			<tr>
				<th>Shipping</th>
				<td>Ships from {{ sageProduct.shipPointZip }}, {{ sageProduct.shipPointCountry }}</td>
			</tr>
			<tr>
				<th>Origin</th>
				<td>(unable to find property)</td>
			</tr>
			<tr>
				<th>Keywords</th>
				<td>{{ sageProduct.keywords }}</td>
			</tr>
			<tr>
				<th>Comment</th>
				<td>{{ sageProduct.comment }}</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>
