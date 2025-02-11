<script setup>
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Header from "@/Views/Products/Product/Header.vue";
import Variants from "@/Views/Products/Product/Variants/Variants.vue";
import Categories from "@/Views/Products/Product/Categories.vue";
import Editor from "@/Views/Products/Product/Placements/Editor.vue";
import Pricing from "@/Views/Products/Product/Decorators.vue";
import ProductView from "@/EntityComponents/Sage/Product.View.vue";
</script>
<script>
import utils from "@/js/utils.js";
import {computed} from "vue";

export default {
	inject: ['symfony'],
	props: ['init', 'returnToModal', 'afterCreate'],

	data() {
		return {
			id: this.$route.params.id,
			loading: true,
			notFound: false,
			entities: {},
			available: {},
			urls: this.symfony.api.products.product,
		}
	},

	computed: {
		tabs(){
			let tabs = ['Info', 'Variants', 'Categories', 'Template', 'Decorators'];
			if( this.productData && this.productData.external && this.productData.external.sage ) tabs.push('Sage');
			return tabs;
		},
		productData(){
			if( !this.entities.product ) return null;

			return this.entities.product.data;
		},
		_returnToModal(){
			if( !this.returnToModal ) return false;
			return this.returnToModal;
		},
		_afterCreate(){
			if( !this.afterCreate ) return false;
			return this.afterCreate;
		}
	},

	provide() {
		return {
			product: computed(() => this.entities.product),
			variants: computed(() => this.entities.variants),
			available: computed(() => this.available),
			returnToModal: this._returnToModal,
			afterCreate: this._afterCreate
		}
	},

	watch: {

	},

	methods: {
	},

	created() {

		if( this.init ){
			this.entities = this.init.entities;
			this.available = this.init.available;
			this.loading = false;
			return;
		}

		let self = this;
		let url = self.urls.get.replace(':id', self.id);

		utils.ajax(url, (d) => {

			self.loading = false;

			if (!d.entities.product) {
				self.notFound = true;
				return;
			}

			self.entities = d.entities
		});
	}
}
</script>
<template>

	<Loader v-if="loading" />

	<template v-if="!loading">

		<template v-if="notFound">
			<h1>Not Found</h1>
		</template>

		<template v-else>

			<Header />

			<Tabs :labels="tabs">
				<template #Info>

					<div class="row">
						<div class="col">

							<h4 class="border-bottom pb-2 mb-4 d-flex align-items-center justify-content-between">
								<span>Info</span>
								<a v-if="entities.product.company.name === 'SanMar'" class="btn btn-outline-primary btn-sm" :href="`https://www.sanmar.com/search/empty?text=${entities.product.sku}`" target="_blank">Sanmar Website</a>
							</h4>

							<div class="mb-2">
								<label class="form-label">Description</label>
								<textarea class="form-control" rows="4" v-model="productData.info.description"></textarea>
							</div>
						</div>
						<div class="col-4">

							<div class="bg-light p-3">
								<div class="border-bottom pb-2 mb-2 d-flex gap-3 align-items-center">
									<h6 class="mb-0"><i class="bi bi-layout-text-window-reverse"></i> Magento Settings</h6>
									<span v-if="entities.product.magento_id" class="badge text-bg-success">Product Created <i class="bi bi-check-circle-fill"></i></span>
									<span v-else class="badge text-bg-secondary">Not Created</span>
								</div>

								<div class="row mb-3">
									<div class="col">
										<label class="form-label">Product ID:</label>
										<input type="text" class="form-control" placeholder="Product ID" disabled="" v-model="entities.product.magento_id">
									</div>
								</div>
							</div>

						</div>
					</div>

					<br><br><br>

					<details v-if="productData.legacy" class="bg-light p-3 mt-4 mb-4">

						<summary>LEGACY INFO FROM GOOGLE SHEETS</summary>

						<table class="table table-sm">
							<thead>
							<tr>
								<th>Property</th>
								<th>Value</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="(value, property) in entities.product.data.legacy">
								<td>{{ property }}</td>
								<td>{{ value }}</td>
							</tr>
							</tbody>
						</table>

					</details>

				</template>

				<template #Sage>
					<ProductView :sageProduct="productData.external.sage" />
				</template>

				<template #Variants>
					<Variants />
				</template>

				<template #Categories>
					<Categories />
				</template>

				<template #Template>
					<Editor />
				</template>

				<template #Decorators>
					<Pricing />
				</template>
			</Tabs>
		</template>

	</template>

</template>