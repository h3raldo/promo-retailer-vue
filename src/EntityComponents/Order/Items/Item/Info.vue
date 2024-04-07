<script setup>
import VendorSelect from "@/EntityComponents/Order/globals/item/VendorSelect.vue";
</script>

<script>
export default {
	data() {
		return {}
	},

	inject: ['item', 'itemIndex'],

	computed: {
	},

	methods: {
		setImage(e){
			this.item.info.image.primary = e.target.value;
		},
	}
}
</script>

<template>

	<div>

		<div class="d-flex flex-column gap-3 col-8 pt-3">
			<div class="d-flex gap-2">
				<div class="col-6">
					<div class="form-floating">
						<input type="text" class="form-control" placeholder="Item Name" v-model="item.info.name">
						<label>Item Name</label>
					</div>
				</div>
				<div class="flex-fill">
					<div class="form-floating">
						<input type="text" class="form-control" placeholder="Item #" v-model="item.info.sku">
						<label>Item #</label>
					</div>
				</div>
			</div>

			<div class="form-floating">
				<VendorSelect v-model="item.info.supplier" />
				<label>Supplier</label>
			</div>

			<div class="d-flex gap-3">
				<div class="flex-grow-1">
					<div class="form-floating">
						<input type="text" class="form-control" placeholder="Image" v-model="item.info.image.primary">
						<label>Image</label>
					</div>
				</div>
				<div v-if="item.info.image.available.length > 0" class="col-4">
					<div class="form-floating">
						<select class="form-select" @change="setImage">
							<option value="">--</option>
							<option v-for="image in item.info.image.available" :value="image.url">{{ image.caption || image.url }}</option>
						</select>
						<label>Available Images</label>
					</div>
				</div>
			</div>

			<div class="form-check form-switch">
				<input class="form-check-input" type="checkbox" role="switch" v-model="item.info.hidden">
				<label class="form-check-label">Hidden</label>
			</div>

			<div class="form-check form-switch">
				<input class="form-check-input" type="checkbox" role="switch" v-model="item.info.taxable">
				<label class="form-check-label">Taxable</label>
			</div>
		</div>

	</div>

</template>