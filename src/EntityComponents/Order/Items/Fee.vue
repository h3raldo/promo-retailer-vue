<script setup>
import Tier from "@/EntityComponents/Order/globals/cost/Tier.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import VendorSelect from "@/EntityComponents/Order/globals/item/VendorSelect.vue";
import entity from "@/js/entity.js";
</script>

<script>
import pricing from "@/js/pricing.js";

export default {
	data() {
		return {
			itemName: '',
			supplier: ''
		}
	},

	inject: ['order', 'vendors', 'updateTotals', 'fn'],
	props: ['fee', 'feeIndex'],

	watch: {
		fee: {
			handler(){
				this.updateTotals();
			},
			deep: true
		}
	},


	computed: {
		subtotal(){
			return pricing.format(this.fee.pricing.price.subtotal);
		}
	},

	methods: {
		remove(index) {
			this.fn.fee.remove(index);
		},
		addItemNameToFee(event){
			if( !event.target.value ) return;
			let item = this.order.items[event.target.value];
			this.fee.name += ' ' + item.info.name;
			this.fee.vendor = item.info.supplier;
		}
	},

	mounted() {
	}
}
</script>

<template>
	<div class="d-flex gap-3 justify-content-end align-items-center pb-2">

		<div class="">
			<div class="d-flex align-items-center justify-content-end gap-2">
				<Modal :id="'fee-edit-'+feeIndex" :title="'Edit Fee'"  :icon="'bi-pencil-square'" :buttonType="'link'">
					<div class="row pb-3">
						<div class="col-12">
							<label class="form-label">Fee Name:</label>
							<input type="text" class="form-control" v-model="fee.name"/>
						</div>
					</div>
					<div class="row pb-3">
						<div class="col-2">
							<label class="form-label">Type:</label>
							<select class="form-select" v-model="fee.type">
								<option v-for="type in entity.order.fee.default.types" :value="type.value">{{ type.title }}</option>
							</select>
						</div>
						<div class="col-4">
							<label class="form-label">Item:</label>
							<select class="form-select" @change="addItemNameToFee">
								<option value="">--</option>
								<option v-for="(item, i) in order.items" :value="i">{{ item.info.name }}</option>
							</select>
						</div>
						<div class="col-6">
							<label class="form-label">Vendor:</label>
							<VendorSelect v-model="fee.vendor" />
						</div>
					</div>

					<Tier :tier="fee.tier" :index="feeIndex" :removeTier="remove" :canDelete="false" />

					<div class="form-check form-switch pt-3">
						<input class="form-check-input" type="checkbox" role="switch" v-model="fee.config.tax.enabled">
						<label class="form-check-label">Taxable</label>
					</div>
				</Modal>
				<span>
					<span v-if="fee.vendor.name" class="badge text-bg-secondary me-1">{{fee.vendor.name}}</span>
					{{ fee.name }}:
				</span>
			</div>
		</div>

		<div class="col-1 text-end">
			<span>{{ subtotal }}</span>
		</div>
		<div class="col-1 text-end">
			<button class="btn btn-danger btn-sm" @click="remove(feeIndex)"><i class="bi bi-trash"></i></button>
		</div>
	</div>

</template>