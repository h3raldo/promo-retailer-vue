<script>
export default {

	data() {
		return {}
	},

	props: ['result', 'closePreview'],

	computed: {
		firstImage() {
			return this.result.pics[0];
		}
	},

	methods: {}
}
</script>

<template>
	<div id="search_product_details">

		<button class="btn btn-small btn-outline-primary mt-4" @click="closePreview"><i class="bi bi-arrow-left-circle"></i> Back to Search</button>

		<div class="pt-3 mt-3">
			<div class="row">
				<div class="col col-5">
					<img :src="firstImage.url" alt="">
					<div class="pb-2">
						<img v-for="img in result.pics" :src="img.url" alt="" width="70">
					</div>
				</div>
				<div class="col col-7">

					<span v-if="result.verified" class="badge bg-secondary">Verified</span>
					<span v-if="result.discontinued" class="badge bg-danger">Discontinued</span>

					<h1 class="pb-2">{{ result.prName }}</h1>
					<div class="row mb-1">
						<div class="col col-2 fw-bold">Item #</div>
						<div class="col">{{ result.itemNum }}</div>
					</div>
					<div class="row mb-1">
						<div class="col col-2 fw-bold">Line</div>
						<div class="col col-grow">{{ result.lineName }}</div>
					</div>
					<div class="row mb-1">
						<div class="col col-2 fw-bold">Category</div>
						<div class="col col-grow">{{ result.category }}</div>
					</div>
					<div class="row mb-1">
						<div class="col col-2 fw-bold">Supplier</div>
						<div class="col col-grow">
							<div>
								{{ result.supplier.coName }}<br>
								{{ result.supplier.email }}<br>
								{{ result.supplier.tollFreeTel }}<br>
								<a href="https://{{ result.supplier.web }}" target="_blank">View Website</a>
							</div>
						</div>
					</div>

					<div class="py-2">
						<p>{{ result.description }}</p>
					</div>
				</div>
			</div>

			<table class="table table-striped">
				<thead>
				<tr>
					<th scope="col">Quantity</th>
					<th v-for="qty in result.qty" scope="col">{{ qty }}</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<th scope="row">List Price</th>
					<td v-for="catPrc in result.catPrc">{{ catPrc }}</td>
				</tr>
				<tr>
					<th scope="row">Net Cost</th>
					<td v-for="net in result.net">{{ net }}</td>
				</tr>
				<tr>
					<th scope="row">Prc</th>
					<td v-for="prc in result.prc">{{ prc }}</td>
				</tr>
				</tbody>
			</table>

			<br><br>

			<table class="table">
				<tr>
					<th scope="row">Colors</th>
					<td>{{ result.colors }}</td>
				</tr>
				<tr>
					<th scope="row">Themes</th>
					<td>{{ result.themes }}</td>
				</tr>
				<tr>
					<th scope="row">Decoration</th>
					<td>{{ result.decorationMethod }}. Price includes {{ result.priceIncludes }}</td>
				</tr>
			</table>

			<br>


			<h3>Options:</h3>
			<table class="table">
				<thead>
				<tr>
					<th scope="col">
						Quantity
					</th>
					<th scope="col" v-for="qty in result.qty">{{ qty }}</th>
				</tr>
				</thead>
				<tbody>
				<template v-for="option in result.options">
					<tr class="bg-light">
						<th scope="row" colspan="100"><b>{{ option.Name }}</b></th> <!-- option type: ex: Sizes -->
					</tr>
					<template v-for="value in option.Values">
						<tr>
							<th scope="row">{{ value.Value }}</th> <!-- option name:ex Small -->
							<td v-for="Prc in value.Prc">+{{ Prc }}</td>
						</tr>
					</template>
				</template>
				</tbody>
			</table>

			<br><br>

			<table class="table">
				<tr>
					<th scope="row">Product Compliance</th>
					<td>{{ result.productCompliance }}</td>
				</tr>
				<tr>
					<th scope="row">Production Time</th>
					<td>{{ result.prodTime }}</td>
				</tr>
				<tr>
					<th scope="row">Packaging</th>
					<td>{{ result.package }}</td>
				</tr>
				<tr>
					<th scope="row">Shipping</th>
					<td>Ships from {{ result.shipPointZip }}, {{ result.shipPointCountry }}</td>
				</tr>
				<tr>
					<th scope="row">Origin</th>
					<td>(unable to find property)</td>
				</tr>
				<tr>
					<th scope="row">Keywords</th>
					<td>{{ result.keywords }}</td>
				</tr>
				<tr>
					<th scope="row">Comment</th>
					<td>{{ result.comment }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<style scoped>

</style>