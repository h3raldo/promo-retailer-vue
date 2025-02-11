<script setup>
import Search from "@/EntityComponents/Product/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import ProductView from "@/Views/Products/Product/View.vue";
import Loader from "@/components/globals/Loader.vue";
import Edit from "@/Views/Websites/Website/Products/Edit.vue";
import Compiled from "@/Views/Websites/Website/Products/Compiled.vue";
import WebsiteSearch from "@/EntityComponents/Website/Search.vue"
import AddCategory from "@/Views/Websites/Website/Products/Add.Category.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";
import {toRaw} from "vue";

export default {
	data(){
		return {
			importing: {
				status: false,
				loading: false,
				data: {}
			},
			copy: {
				active: false,
				filters: [],
				decoration_sets: [],
				decoration_groups: [],
				overwrites: [],
			},
			compile: false,
		}
	},
	inject: ['symfony', 'website'],
	computed: {
		rules(){
			return this.website.product_rules.rules;
		}
	},
	methods: {
		productSelected(product){

			if( typeof product.itemNum !== 'undefined' ){
				this.createProductFromSage( product );
				return;
			}

			let rule = entity.website.product_rules.create('product', product);
			this.rules.push(rule)
		},

		removeRule(index){
			this.rules.splice(index,1);
		},

		createProductFromSage( sage_product )
		{
			this.importing.loading = true;

			let url = this.symfony.sage.item.replace(':id', sage_product.prodEId);
			let self = this;

			self.loading = true;
			utils.ajax(url, (data) => {
				self.loading = false;
				self.importing.loading = false;
				self.importing.data = entity.product.createFromSage( data.product )
				self.importing.status = true;
			})
		},
		returnToModal(){
			this.$refs.quickProductCreation.$refs.openModalButton.click();
		},
		afterCreate( product )
		{
			this.$refs.quickProductCreation.$refs.closeModalButton.click();
			this.productSelected(product);
			this.importing.status = false;
			this.importing.data = {}
		},
		copyConfig( rule )
		{
			this.copy.active = true;
			this.copy.filters = rule.filters;
			this.copy.decoration_sets = rule.decoration_sets;
			this.copy.decoration_groups = rule.decoration_groups;
			this.copy.overwrites = rule.overwrites;
		},
		pasteConfig( rule )
		{
			rule.filters = JSON.parse(JSON.stringify(toRaw(this.copy.filters)));
			rule.decoration_sets = JSON.parse(JSON.stringify(toRaw(this.copy.decoration_sets)));
			rule.decoration_groups = JSON.parse(JSON.stringify(toRaw(this.copy.decoration_groups)));
			rule.overwrites = JSON.parse(JSON.stringify(toRaw(this.copy.overwrites)));
		},
		copyFromWebsite( website )
		{
			website.product_rules.rules.forEach( rule => this.website.product_rules.rules.push( rule ) );
		}
	},
	created() {
		if( this.website.product_rules === null ) this.website.product_rules = {
			rules: [],
			global_rules: {
				filters: [],
				decoration_sets: [],
				decoration_groups: [],
				overwrites: [],
			}
		};
	}
}
</script>
<template>
	<div class="d-flex justify-content-between align-items-center bg-light p-2">
		<h5 class="mb-0">Product Rules ({{ rules.length }})</h5>
		<Modal title="Compile (Validate Product Decoration Settings)" id="compile-products" button-text="Validate & Preview Products..." buttonClasses="btn btn-outline-primary">
			<Compiled />
		</Modal>
	</div>

	<Loader v-if="importing.loading" />

	<template v-if="importing.status">
		<Modal title="New Product" id="new-product-creation"  button-text="Continue Importing Product" buttonClasses="btn btn-sm btn-warning" icon="bi-pencil" ref="quickProductCreation" :openOnCreation="true">
			<ProductView :init="importing.data" :returnToModal="returnToModal" :afterCreate="afterCreate" />
		</Modal>
	</template>

	<div>

	</div>

	<table class="table">
		<thead>
		<tr>
			<th class="col-1"><button v-if="copy.active" class="btn btn-sm btn-outline-success ms-2" @click="copy.active = false">Done Pasting</button></th>
			<th>Product</th>
			<th>Filters</th>
			<th>Overwrites</th>
			<th></th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="(rule, i) in rules" class="align-middle">
			<td>
				<Edit :rule="rule" :index="i" />

				<template v-if="copy.active">
					<button class="btn btn-sm btn-outline-info ms-2" @click="pasteConfig(rule)">Paste</button>
				</template>
				<template v-else>
					<button class="btn btn-sm btn-outline-primary ms-2" @click="copyConfig(rule)">Copy</button>
				</template>
			</td>
			<td>
				<template v-if="rule.type === 'product'">
					<span>
						<small>
							<i class="bi bi-building"></i> {{ rule.entity.product.company.name }}
							|
							<i class="bi bi-box-seam me-1"></i>
							<a :href="symfony.views.products_product.replace(':id', rule.entity.product.id)" target="_blank">
								{{ rule.entity.product.sku }}
							</a>
						</small>
					</span>
					<span class="d-block">{{ rule.name }}</span>
				</template>
				<template v-else-if="rule.type === 'category'">
					<span>
						<small>
							<i class="bi bi-tags"></i> Category
						</small>
					</span>
					<span class="d-block">
						<span class="text-secondary">{{ rule.entity.category.path }}</span>
						{{ rule.name }}
					</span>
				</template>
			</td>
			<td>
				<div v-for="filter in rule.filters" class="d-flex gap-1">
					<div><span class="badge text-bg-secondary">{{ filter.attribute }}</span></div>
					<div>:</div>
					<div>{{ filter.value.join(', ')}}</div>
				</div>
			</td>
			<td>
				<div v-for="overwrite in rule.overwrites" class="d-flex gap-1">
					<div><span class="badge text-bg-warning">{{ overwrite.attribute }}: {{ overwrite.value }}</span></div>
				</div>

				<div v-if="rule.decoration_sets.length" class="d-flex gap-1">
					<div><span class="badge text-bg-warning">decoration sets</span></div>
					<div>:</div>
					<div>
						<span class="d-block" v-for="set in rule.decoration_sets"><span class="text-nowrap">{{ set.id }}</span></span>
					</div>
				</div>

				<div v-if="rule.decoration_groups && rule.decoration_groups.length" class="d-flex gap-1">
					<div><span class="badge text-bg-warning">decoration groups</span></div>
					<div>:</div>
					<div>
						<span class="d-block" v-for="group in rule.decoration_groups"><span class="text-nowrap">{{ group.id }}</span></span>
					</div>
				</div>
			</td>
			<td>
				<button class="btn btn-sm btn-danger" @click="removeRule(i)"><i class="bi bi-x"></i></button>
			</td>
		</tr>
		</tbody>
		<tfoot>
		<tr>
			<td colspan="10">
				<div class="d-flex gap-2">
					<Search :onSelect="productSelected" buttonText="Add Product" buttonIcon="bi bi-plus-circle" :sage="true" />

					<AddCategory />

					<WebsiteSearch :onSelect="copyFromWebsite" buttonClasses="btn btn-outline-primary" buttonText="Copy from Website" icon="bi-copy" />
				</div>
			</td>
		</tr>
		</tfoot>
	</table>
</template>