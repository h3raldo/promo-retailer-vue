<script setup>
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Header from "@/Views/Products/Product/Header.vue";
import Variants from "@/Views/Products/Product/Variants.vue";
import Categories from "@/Views/Products/Product/Categories.vue";
import Editor from "@/Views/Products/Product/Placements/Editor.vue";
import Pricing from "@/Views/Products/Product/Decorators.vue";
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
			tabs: ['Info', 'Template', 'Categories', 'Variants', 'Decorators']
		}
	},

	computed: {
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
			<h1>Website Not Found</h1>
		</template>

		<template v-else>

			<Header />

			<Tabs :labels="tabs">
				<template #Info>

					<div class="mb-2">
						<label class="form-label">Description</label>
						<textarea class="form-control" rows="4" v-model="productData.info.description"></textarea>
					</div>

					<div v-if="productData.legacy" class="bg-light p-3 mt-4">

						<h4>LEGACY INFO FROM GOOGLE SHEETS</h4>
						<table class="table">
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
					</div>

					<div v-if="productData.external && productData.external.sage" class="bg-light p-3 mt-4">
						<h4>INFO FROM SAGE</h4>
						<table>
							<thead>
							<tr>
								<th>Attribute</th>
								<th>Value</th>
							</tr>
							</thead>
							<tbody>
							<template v-for="(value, property) in productData.external.sage">
							<tr v-if="property !== 'pics'">
								<td>{{property}}</td>
								<td>{{value}}</td>
							</tr>
							</template>
							</tbody>
						</table>
					</div>

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