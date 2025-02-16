<script setup>
import Search from "@/EntityComponents/Product/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import ProductView from "@/Views/Products/Product/View.vue";
import Loader from "@/components/globals/Loader.vue";
import RuleEdit from "@/Views/Websites/Website/View/Rules/Rule.Edit.vue";
import Compiled from "@/Views/Websites/Website/View/Products/Compiled.vue";
import WebsiteSearch from "@/EntityComponents/Website/Search.vue"
import AddCategory from "@/Views/Websites/Website/View/Products/Add.Category.vue";
import Rule from "@/Views/Websites/Website/View/Rules/Rule.vue";
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
			edit: {
				rule: {},
				index: null,
				open: true
			}
		}
	},
	inject: ['symfony', 'website', 'products'],
	computed: {
		rules(){
			return this.website.product_rules.rules;
		}
	},
	methods: {
		productSelected(product)
		{
			if( typeof product.itemNum !== 'undefined' ){
				this.createProductFromSage( product );
				return;
			}

			this.products[product.id] = product;
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
		},
		editRule( rule, index )
		{
			this.edit.rule = rule;
			this.edit.index = index;
			this.edit.open = true;
			this.$refs.editModal.$refs.openModalButton.click();
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

	<Modal title="Edit Rule" buttonClasses="btn btn-sm btn-primary d-none" icon="bi-pencil" ref="editModal">
		<RuleEdit v-if="edit.index !== null && edit.open" :rule="edit.rule" :index="edit.index" />
	</Modal>

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
			<Rule v-for="(rule, i) in rules" :rule="rule" :index="i" :edit="editRule" :paste="pasteConfig" :copy="copyConfig" :remove="removeRule" />
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