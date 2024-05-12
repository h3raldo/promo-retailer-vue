<script setup>
import Result from "@/EntityComponents/Order/Actions/Sage/Result.vue";
import Results from "@/EntityComponents/Order/Actions/Sage/Results.vue";
import Replace from "@/EntityComponents/Order/Actions/Sage/Replace.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>

<script>
import {toRaw} from "vue";
import utils from "@/js/utils.js";

export default {

	data() {
		return {
			result: {},
			results: [],
			loading: false,
			preview: false,
			replace: false,
			view: 'results'
		}
	},

	inject: ['symfony', 'fn'],

	computed: {
		loadingClass() {
			return this.loading ? '' : 'd-none';
		},
		showPreview(){
			return this.view === 'preview';
		},
		showReplace(){
			return this.view === 'replace';
		},
		showResults(){
			return this.results.length > 0 && this.view === 'results' && this.loading === false
		}
	},

	props: [],

	methods: {
		search(e) {
			e.preventDefault();
			let formData = new FormData(e.target);
			let url = this.symfony.sage.search+'?' + new URLSearchParams(formData).toString();
			let self = this;

			self.loading = true;
			utils.ajax(url, (data) => {
				self.loading = false;
				if (data.ok !== true) {
					// some error handling
				}
				self.results = data.products;
			})
		},
		closeModal() {
			this.$refs.modal.$refs.closeModalButton.click();
		},
		selectResult(result) {
			let self = this;

			let addItem = () => {
				self.fn.item.addSageItem( toRaw(self.result) );
				self.closeModal();
			}

			// skip ajax call if we already loaded this product
			if (result.prodEId === this.result.prodEId) addItem();
			this.getResult(result.prodEId, addItem)
		},
		prepareReplaceResult(result){
			let self = this;
			this.getResult(result.prodEId, () => {
				self.replace = true;
				self.view = 'replace';
			})
		},
		replaceResult( itemIndex, e )
		{
			this.fn.item.replaceWithSageItem( itemIndex, toRaw(this.result) );
			e.target.disabled = true;
			e.target.innerText = 'Replaced!';
		},
		previewResult(result) {
			let self = this;
			this.getResult(result.prodEId, () => {
				self.preview = true;
				self.view = 'preview';
			})
		},
		closePreview() {
			this.view = 'results';
		},
		getResult(id, callback) {
			let url = this.symfony.sage.item.replace(':id', id);
			let self = this;

			self.loading = true;
			utils.ajax(url, (data) => {
				self.loading = false;
				self.result = data.product;
				callback(data.product);
			})

		}
	},

	mounted() {

	}
}
</script>

<template>

	<Modal :id="'sage-product-search'" :title="'Product Lookup'" :buttonText="'Add Sage Product'" :icon="'bi-plus-circle'" :buttonClasses="'btn btn-primary btn-sm'" ref="modal">

		<div id="search-form" class="p-3 bg-light border">
			<form @submit="search($event)">
				<div class="row">
					<div class="col mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="keywords" name="keywords">
							<label for="keywords" class="form-label">Keywords</label>
						</div>
					</div>
					<div class="col mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="categories" name="categories">
							<label for="categories" class="form-label">Categories</label>
						</div>
					</div>

					<div class="col mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="itemNum" name="itemNum">
							<label for="itemNum" class="form-label">Item Number</label>
						</div>
					</div>

					<div class="col mb-3">
						<div class="form-floating">
							<input type="text" class="form-control" id="colors" name="colors">
							<label for="colors" class="form-label">Colors</label>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<div class="form-floating">
							<input type="number" class="form-control" id="qty" name="qty">
							<label for="qty" class="form-label">Qty</label>
						</div>
					</div>

					<div class="col">
						<div class="form-floating">
							<input type="number" class="form-control" id="priceLow" name="priceLow">
							<label for="priceLow" class="form-label">From Price</label>
						</div>
					</div>

					<div class="col">
						<div class="form-floating">
							<input type="number" class="form-control" id="priceHigh" name="priceHigh">
							<label for="priceHigh" class="form-label">To Price</label>
						</div>
					</div>

					<div class="col">
						<button class="btn btn-outline-primary" type="submit">Search</button>
					</div>
				</div>
				<div class="lookup-list"></div>
			</form>
		</div>

		<div id="search-loader" :class="'text-center mt-4 ' + loadingClass">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>

		<Results v-if="showResults" :results="results" :previewResult="previewResult" :selectResult="selectResult" :replaceResult="prepareReplaceResult" :loading="loading"/>
		<Result v-if="showPreview" :result="result" :closePreview="closePreview"/>
		<Replace v-if="showReplace" :replaceResult="replaceResult" :closePreview="closePreview" />

	</Modal>


</template>