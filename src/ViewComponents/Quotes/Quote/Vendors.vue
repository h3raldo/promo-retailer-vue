<script setup>
</script>

<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {}
	},

	inject: ['vendors'],

	methods: {
		add(){
			this.vendors.push( entity.quote.vendor.create() );
		},
		remove(index) {
			this.vendors.splice(index, 1);
		},
	},
}
</script>

<template>

	<div v-for="(vendor, i) in vendors"  class="row col-8 align-items-end mb-3 border-bottom pb-4">

		<div class="col">
			<div>
				<label class="form-label">Name</label>
				<input type="text" class="form-control" placeholder="name" v-model="vendor.name" />
			</div>
		</div>
		<div class="col">
			<div>
				<label class="form-label">Zoho ID</label>
				<input type="text" class="form-control" placeholder="Zoho ID" v-model="vendor.id" />
			</div>
		</div>
		<div class="col">
			<div>
				<label class="form-label">Sage ID</label>
				<input type="number" class="form-control" placeholder="Sage ID" v-model.number="vendor.sage_id" />
			</div>
		</div>
		<div class="col">
			<button class="btn btn-outline-danger" @click="remove(i)"><i class="bi bi-trash"></i></button>
		</div>
	</div>

	<div class="pt-4">
		<button class="btn btn-primary" @click="add">Add Vendor</button>
	</div>

</template>

<style scoped>

</style>