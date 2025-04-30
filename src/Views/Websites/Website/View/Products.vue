<script setup>
import Search from "@/EntityComponents/Product/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import ProductView from "@/Views/Products/Product/View.vue";
import Loader from "@/components/globals/Loader.vue";
import RuleEdit from "@/Views/Websites/Website/View/Rules/Rule.Edit.vue";
import Compiled from "@/Views/Websites/Website/View/Products/Compiled.vue";
import WebsiteSearch from "@/EntityComponents/Website/Search.vue"
import Rules from "@/Views/Websites/Website/View/Rules/Rules.vue";
import Categories from "@/Views/Websites/Website/View/Rules/Categories.vue";
import RulesGlobal from "@/Views/Websites/Website/View/Rules/Rules.Global.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";
import {computed, toRaw} from "vue";

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
				open: true,
				category: null,
			},
		}
	},
	inject: ['symfony', 'website', 'products', 'config', 'alert'],
	computed: {
		rules(){
			return this.website.product_rules.rules;
		},
		categoryTree() {
			this.setupCategories();

			this.website.product_rules.rules.forEach( (rule, i) => {
				if( rule.type !== 'product' ) return;

				let id = rule.entity.product.id;
				let product = this.products[id];
				if( !product?.categories ) return

				this.products[id].categories.forEach( c => {
					let cat = this.config.flatCategories[c];
					if( !cat ) return;

					cat.products.push(product)
					cat.rules.push({
						rule: rule,
						index: i
					})
				})
			});

			this.config.categories.forEach( c => {
				c.rules.sort( (a,b) => {
					let a_name = a.rule.entity.product.sku;
					let b_name = b.rule.entity.product.sku;

					if (a_name < b_name) {
						return -1;
					}
					if (a_name > b_name) {
						return 1;
					}
					return 0;
				})
			})

			return this.config.categories;
		}
	},
	methods: {
		setupCategories()
		{
			let traverse = (category) => {
				this.config.flatCategories[category.handle] = category;
				category.products = [];
				category.rules = [];

				if( category.children ) category.children.forEach( c => traverse(c) );
			}
			this.config.categories.forEach( c => traverse(c));
		},
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
			let rule = this.rules[index];

			if( rule.id === null ){
				this.rules.splice(index,1);
				return;
			}

			let result = (r) => {
				if( r.error !== false )
					error();
				else{
					this.alert('Rule deleted', 'success');
					this.rules.splice(index,1);
				}
			}

			let error = () => {
				this.alert('Error deleting rule', 'danger');
			}

			utils.ajaxDelete(this.symfony.api.entity.delete, result, error, {
				id: rule.id,
				entity: 'websiteRule'
			})
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
		duplicateRule( rule )
		{
			let new_rule = JSON.parse(JSON.stringify(toRaw(rule)))
			new_rule.id = null;
			this.rules.push(new_rule)
		},
		copyFromWebsite( website, products )
		{
			Object.keys(products).forEach( id => {
				this.products[id] = products[id];
			})
			website.product_rules.rules.forEach( rule => {
				rule.id = null;
				this.website.product_rules.rules.push( rule )
			});
			this.initialCategory();
		},
		editRule( rule, index )
		{
			this.edit.rule = rule;
			this.edit.index = index;
			this.edit.open = true;
			this.$refs.editModal.$refs.openModalButton.click();
		},
		editCategory( category )
		{
			if( this.edit.category) this.edit.category.isActive = false;

			this.edit.category = category
			this.edit.category.isActive = true;
		},
		stop(e){
			e.stopPropagation();
			e.preventDefault();
		},
		initialCategory(){
			let firstActive = this.categoryTree.filter( c => c.products.length > 0);
			if( firstActive.length > 0 ) this.editCategory( firstActive[0] );
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
		}


		else if( typeof this.website.product_rules?.global_rules?.decoration_sets === 'undefined' ) this.website.product_rules.global_rules = {
			filters: [],
			decoration_sets: [],
			decoration_groups: [],
			overwrites: [],
		}

		else{
			this.initialCategory();
		}

	}
}
</script>
<template>
	<div class="d-flex justify-content-between align-items-center border-bottom pb-3">
		<h5 class="mb-0">Total Rules: ({{ rules.length }})</h5>
		<div class="d-flex gap-2">
			<Search :onSelect="productSelected" buttonText="Add Product" buttonIcon="bi bi-plus-circle" :sage="true" />
			<!--			<AddCategory />-->
			<WebsiteSearch :onSelect="copyFromWebsite" buttonClasses="btn btn-outline-primary" buttonText="Copy from Website" icon="bi-copy" :returnFullEntity="true"  />
			<Modal title="Compile (Validate Product Decoration Settings)" id="compile-products" button-text="Validate & Preview Products" buttonClasses="btn btn-outline-primary">
				<Compiled />
			</Modal>
		</div>
	</div>

	<Loader v-if="importing.loading" />

	<br>

	<template v-if="importing.status">
		<Modal title="New Product" id="new-product-creation"  button-text="Continue Importing Product" buttonClasses="btn btn-sm btn-warning" icon="bi-pencil" ref="quickProductCreation" :openOnCreation="true">
			<ProductView :init="importing.data" :returnToModal="returnToModal" :afterCreate="afterCreate" />
		</Modal>
	</template>

	<Modal title="Edit Rule" buttonClasses="btn btn-sm btn-primary d-none" icon="bi-pencil" ref="editModal">
		<RuleEdit v-if="edit.index !== null && edit.open" :rule="edit.rule" :index="edit.index" />
	</Modal>

	<div>
		<div class="mb-3">
			<Categories :categories="categoryTree" :editCategory="editCategory" />
		</div>
		<div class="border p-2 px-3 mb-3">
			<RulesGlobal :globals="website.product_rules.global_rules" />
		</div>
		<div>
			<button v-if="copy.active" class="btn btn-sm btn-outline-success ms-2" @click="copy.active = false">Done Pasting</button>
		</div>
		<div>
			<Rules v-if="edit.category" :category="edit.category" :edit="editRule" :paste="pasteConfig" :copy="copyConfig" :duplicate="duplicateRule" :copyActive="copy.active" :remove="removeRule" />
		</div>
	</div>

	<br>

	<div>
		<div class="d-flex gap-2">
			<Search :onSelect="productSelected" buttonText="Add Product" buttonIcon="bi bi-plus-circle" :sage="true" />
<!--			<AddCategory />-->
			<WebsiteSearch :onSelect="copyFromWebsite" buttonClasses="btn btn-outline-primary" buttonText="Copy from Website" icon="bi-copy" :returnFullEntity="true" />
		</div>
	</div>
</template>

<style>
.dropdown-submenu {
	position: relative;
}

.dropdown-submenu .dropdown-menu {
	top: 0;
	left: 100%;
	margin-top: -1px;
}
</style>