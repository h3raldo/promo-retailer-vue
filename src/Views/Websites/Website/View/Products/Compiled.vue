<script setup>
import Loader from "@/components/globals/Loader.vue";
import CompiledProduct from "@/Views/Websites/Website/View/Products/Compiled.Product.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			status: {
				loading: false,
			},
			products: [],
			logos: [],
			sets: [],
			info: {}
		}
	},
	props: [],
	inject: ['symfony', 'website'],
	methods: {
		compile(){
			let self = this;
			self.status.loading = true;
			utils.ajax( this.symfony.api.websites.website.products.compiled.replace(':id', this.website.id), (d) => {
				self.products = d.products;
				self.logos = d.logos;
				self.sets = d.sets;
				self.info = d.info;
				self.status.loading = false;
			})
		}
	},
	created() {

	}
}
</script>
<template>
<div>

	<div class="d-flex justify-content-between align-items-center">
		<button class="btn btn-primary" @click="compile" :disabled="status.loading"><i class="bi bi-arrow-clockwise"></i> Compile Products</button>
		<span class="badge text-bg-secondary">Validated Products: {{ products.length }}</span>
	</div>

	<Loader v-if="status.loading" />

	<div v-else class="mt-3">

		<div v-for="result in products">

			<details class="py-2 border-bottom">
				<summary>{{ result.product.name }}</summary>

				<table class="table table-sm">
					<thead>
					<tr>
						<th class="col-1">ID</th>
						<th class="col-2">Color</th>
						<th class="col-1">Size</th>
						<th>Decoration Sets</th>
					</tr>
					</thead>
					<tbody>
					<CompiledProduct  v-for="variant in result.variants" :variant="variant" :logos="logos" :sets="sets" :info="info" />
					</tbody>
				</table>
			</details>

		</div>

	</div>

</div>
</template>
