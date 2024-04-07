<script setup>
import Result from "@/EntityComponents/Order/Actions/Sage/Result.vue";
import Results from "@/EntityComponents/Order/Actions/Sage/Results.vue";
import Replace from "@/EntityComponents/Order/Actions/Sage/Replace.vue";
</script>

<script>
import {toRaw} from "vue";
import utils from "@/js/utils.js";
import api from "@/js/api.js";

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

	inject: ['order', 'vendors', 'updatePricing', 'addQuoteItem', 'symfony'],

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
			this.$refs.closeModalButton.click();
		},
		selectResult(result) {
			let self = this;

			let addItem = () => {
				let item = api.sage.toQuoteItem(toRaw(self.result));
				api.sage.postCreation(item, self.vendors);
				self.addQuoteItem(item);
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
			let item = this.order.items[itemIndex];
			let sageItem = api.sage.toQuoteItem(toRaw(this.result));
			console.log(sageItem);
			api.sage.postCreation(sageItem, this.vendors);
			item.info.name = sageItem.info.name;
			item.info.sku = sageItem.info.sku;
			item.info.supplier = sageItem.info.supplier;
			item.info.image.primary = sageItem.info.image.primary;
			item.info.image.available = sageItem.info.image.available;
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

	<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#search_modal" data-item-index="0" ref="openModalButton">
		+ Add Sage Product
	</button>

	<div class="modal modal-xl fade text-start" id="search_modal" tabindex="-1" aria-labelledby="search_modalLabel"
		 aria-hidden="true" ref="modal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="search_modalLabel">Product Lookup</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
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
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeModalButton">Close</button>
				</div>
			</div>
		</div>
	</div>

</template>

<style scoped>

</style>