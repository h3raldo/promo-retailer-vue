<script setup>
import Search from "@/EntityComponents/Product/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import ProductView from "@/Views/Products/Product/View.vue";
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			importing: {
				status: false,
				loading: false,
				data: {}
			},
			rules: [],
		}
	},
	inject: ['symfony'],
	computed: {
		decoration_sets(){
			return entity.order.item.decoration.default.logo.locations;
		}
	},
	methods: {
		productSelected(product){

			if( typeof product.itemNum !== 'undefined' ){
				this.createProductFromSage( product );
				return;
			}

			this.rules.push(
			  {
				  info: {
					imported: true,
					source: 'local',
					supplier: {
						name: product.company.name,
						imported: false
					},
					external: {}
				  },
				  sku: product.sku,
				  name: product.name,
				  filters: [],
				  decoration_sets: [],
				  overwrites: [],
			  }
			)
		},

		addFilter(rule){
			rule.filters.push({
				attribute: 'color',
				value: ''
			})
		},

		addDecorationSet(rule){
			rule.decoration_sets.push({
				id: '',
			})
		},

		addOverwrite(rule){
			rule.overwrites.push({
				attribute: 'margin',
				value: '',
			})
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
		}
	}
}
</script>
<template>
	<h5>Product Rules</h5>

	<Loader v-if="importing.loading" />

	<template v-if="importing.status">
		<Modal title="New Product" id="new-product-creation"  button-text="Continue Importing Product" buttonClasses="btn btn-sm btn-warning" icon="bi-pencil" ref="quickProductCreation" :openOnCreation="true">
			<ProductView :init="importing.data" :returnToModal="returnToModal" :afterCreate="afterCreate" />
		</Modal>
	</template>
	<table class="table">
		<thead>
		<tr>
			<th>Product ID</th>
			<th>Supplier</th>
			<th>Name</th>
			<th>Filters</th>
			<th>Decoration Sets</th>
			<th>Overwrites</th>
			<th>-</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="(rule, i) in rules" class="align-middle">
			<td>{{ rule.sku }}</td>
			<td>{{ rule.info.supplier.name }}</td>
			<td>
				{{ rule.name }}

				<button class="btn btn-sm btn-warning" v-if="!rule.info.imported"><i class="bi bi-exclamation-circle"></i> Finish Import <i class="bi bi-arrow-up-right-square"></i></button>
			</td>
			<td>
				<div v-for="filter in rule.filters" class="d-flex gap-1">
					<div>
						<select class="form-select form-select-sm mb-2" v-model="filter.attribute">
							<option value="color">Color</option>
							<option value="size">Size</option>
						</select>
					</div>
					<div>:</div>
					<div>
						<input type="text" class="form-control form-control-sm" v-model="filter.value">
					</div>
				</div>
				<button class="btn btn-outline-primary btn-sm" @click="addFilter(rule)">Add Filter</button>
			</td>
			<td>
				<div v-for="set in rule.decoration_sets">
					<select class="form-select form-select-sm mb-2" v-model="set.id">
						<option value="">None</option>
						<option v-for="d_set in decoration_sets" :value="d_set">{{d_set}}</option>
					</select>
				</div>
				<button class="btn btn-outline-primary btn-sm" @click="addDecorationSet(rule)">Add Set</button>
			</td>
			<td>
				<div v-for="overwrite in rule.overwrites" class="d-flex gap-1">
					<div class="col">
						<select class="form-select form-select-sm mb-2" v-model="overwrite.attribute">
							<option value="margin">Margin</option>
							<option value="price">Price</option>
							<option value="cost">Cost</option>
						</select>
					</div>
					<div>:</div>
					<div class="col">
						<input type="text" class="form-control form-control-sm" v-model="overwrite.value">
					</div>
				</div>
				<button class="btn btn-outline-primary btn-sm" @click="addOverwrite(rule)">Add Overwrite</button>
			</td>
			<td>
				<button class="btn btn-sm btn-danger" @click="removeRule(i)">Remove</button>
			</td>
		</tr>
		</tbody>
		<tfoot>
		<tr>
			<td colspan="10">
				<Search :onSelect="productSelected" buttonText="Add Existing Product" buttonIcon="bi bi-plus-circle" :sage="true" />
			</td>
		</tr>
		</tfoot>
	</table>
</template>