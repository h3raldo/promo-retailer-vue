<script setup>
import Rule from "@/Views/Websites/Website/View/Rules/Rule.vue";
import Search from "@/EntityComponents/Product/Search.vue";
import RuleEdit from "@/Views/Websites/Website/View/Rules/Rule.Edit.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
import entity from "@/js/entity.js";
import {computed} from "vue";

export default {
	name: "View.Bundle",
	data() {
		return {
			productEntities: {},
			edit: {
				rule: {},
				index: null,
				open: true,
				category: null,
			},
		}
	},
	inject: ['product'],
	methods: {
		productSelected(product)
		{
			if( typeof product.itemNum !== 'undefined' ){
				this.createProductFromSage( product );
				return;
			}

			this.productEntities[product.id] = product;
			let rule = entity.website.product_rules.create('product', product);
			this.product.data.bundle.products.push(rule)
		},
		editRule( rule, index )
		{
			this.edit.rule = rule;
			this.edit.index = index;
			this.edit.open = true;
			this.$refs.editModal.$refs.openModalButton.click();
		},
		paste(){

		},
		copy(){

		},
		duplicate(){

		},
		remove(){

		}
	},
	provide() {
		return {
			products: computed(() => this.productEntities),
		}
	},
	created(){
		if( typeof this.product.data.bundle === 'undefined' ) {
			this.product.data.bundle = {
				products: []
			};
		}
	}
}
</script>

<template>
	<div>

		<h1>Bundle</h1>


		<table class="table">
			<thead>
			<tr>
				<th colspan="5">Products <small class="fw-normal">{{ product.data.bundle.products.length }} Product(s)</small></th>
			</tr>
			</thead>
			<tbody>
				<Rule v-for="(product, pi) in product.data.bundle.products" :rule="product" :index="pi" :edit="editRule" :paste="paste" :copy="false" :copyActive="false" :duplicate="false" :remove="remove" :qty="true" />
			</tbody>
			<tfoot>
				<tr>
					<td colspan="5">
						<Search :onSelect="productSelected" buttonText="Add Product" buttonIcon="bi bi-plus-circle" :sage="false" />
					</td>
				</tr>
			</tfoot>
		</table>

		<Modal title="Edit Rule" buttonClasses="btn btn-sm btn-primary d-none" icon="bi-pencil" ref="editModal">
			<RuleEdit v-if="edit.index !== null && edit.open" :rule="edit.rule" :index="edit.index" />
		</Modal>
	</div>
</template>