<script setup>
import VendorSelect from "@/EntityComponents/Order/globals/item/VendorSelect.vue";
import Search from "@/EntityComponents/Company/Search.vue";
</script>

<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			searchingCompanies: false,
		}
	},

	inject: ['item', 'itemIndex', 'updatePricing', 'order'],

	watch: {
		'item.info.taxable'() {
			this.updatePricing();
		}
	},

	methods: {
		setImage(e){
			this.item.info.image.primary = e.target.value;
		},
		supplierSelected(company){
			this.order.fees.forEach( f => {
				if( !f.name.includes(this.item.info.name) ) return;
				console.log('adding supplier to matching fee', f);
				entity.order.fee.addCompany(company, f);
			})
		}
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

			<div class="border rounded p-2">
				<span class="text-secondary mb-0">Supplier</span>
				<VendorSelect v-model="item.info.supplier" :onSelect="supplierSelected" />
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