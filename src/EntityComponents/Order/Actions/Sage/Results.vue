<script>
export default {

	data() {
		return {}
	},

	props: ['results', 'previewResult', 'selectResult', 'replaceResult', 'loading'],

	inject: ['order'],

	computed: {
		showReplace(){
			return this.order.items.length > 0;
		}
	},

	methods: {}
}
</script>

<template>
	<div id="search_results">

		<div class="row row-cols-3 pt-3">
			<div class="col pb-3" v-for="result in results">
				<div class="border p-3 mt-3 d-flex flex-column" style="height: 100%">
					<div class="image text-center">
						<img :src="result.thumbPic" alt="" height="150">
					</div>

					<div class="supplier pb-1">
						<span class="badge bg-secondary me-1">#{{ result.itemNum }}</span>
						<span class="badge bg-secondary me-1">{{ result.supplier }}</span>
						<span class="badge bg-secondary">{{ result.category }}</span>
					</div>

					<div class="title flex-fill d-flex align-items-center">
						<h6 class="my-0">{{ result.name }}</h6>
					</div>

					<div class="details fs-6 mb-2">
						<details class="bg-light border p-2 my-1">
							<summary>Colors</summary>
							{{ result.colors }}
						</details>

						<details class="bg-light border p-2 my-1">
							<summary>Description</summary>
							{{ result.description }}
						</details>
					</div>

					<div class="actions d-flex gap-2 justify-content-end">
						<button class="btn btn-sm btn-secondary" @click="previewResult(result)" :disabled="loading">
							<i class="bi bi-info-circle"></i> Details
						</button>
						<button v-if="showReplace" class="btn btn-sm btn-secondary" @click="replaceResult(result)" :disabled="loading">
							Replace Existing
						</button>
						<button class="btn btn-sm btn-primary" @click="selectResult(result)" :disabled="loading">
							<i class="bi bi-plus-circle"></i> Add Item
						</button>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<style scoped>

</style>