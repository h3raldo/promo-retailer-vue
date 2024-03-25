<script>
export default {

	data() {
		return {}
	},

	props: ['replaceResult', 'closePreview'],
	inject: ['quote'],

	computed: {

	},

	methods: {}
}
</script>

<template>
	<div id="search_replace" class="pt-4">
		<p>
			<button class="btn btn-small btn-outline-primary" @click="closePreview"><i class="bi bi-arrow-left-circle"></i> Back to Search</button>
		</p>
		<div class="row">
			<div class="col">
				<p class="fw-bold">Replace info of:</p>
				<div v-for="(item, i) in quote.items" class="d-flex align-items-center gap-2 pb-3">
					<button class="btn btn-primary btn-sm" @click="replaceResult(i, $event)">Replace</button> {{ item.info.name }}
				</div>
			</div>
			<div class="col">
				<b>Replace:</b>
				<div class="form-check">
					<input class="form-check-input" type="checkbox" checked disabled><label class="form-check-label">Name</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="checkbox" checked disabled><label class="form-check-label">Item #</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="checkbox" checked disabled><label class="form-check-label">Images</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="checkbox" checked disabled><label class="form-check-label">Supplier</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="checkbox" disabled><label class="form-check-label">Options</label>
				</div>
				<div class="form-check">
					<input class="form-check-input" type="checkbox" disabled><label class="form-check-label">Pricing</label>
				</div>
			</div>

		</div>
	</div>
</template>

<style scoped>

</style>