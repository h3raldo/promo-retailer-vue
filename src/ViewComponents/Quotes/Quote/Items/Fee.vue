<script setup>
import Tier from "@/ViewComponents/Quotes/Quote/globals/cost/Tier.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import VendorSelect from "@/ViewComponents/Quotes/Quote/globals/item/VendorSelect.vue";
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

	inject: ['quote', 'vendors', 'updateTotals'],
	props: ['fee', 'feeIndex'],

	watch: {
		fee: {
			handler(){
				this.fee.pricing.price.subtotal = parseFloat( ( this.fee.tier.qty * this.fee.tier.price ).toFixed(2) );
				this.fee.pricing.cost.subtotal = parseFloat( ( this.fee.tier.qty * this.fee.tier.cost ).toFixed(2) );
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
			this.quote.fees.splice(index, 1);
		},
		addItemNameToFee(event){
			if( !event.target.value ) return;
			let item = this.quote.items[event.target.value];
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
						<div class="col">
							<label class="form-label">Name:</label>
							<input type="text" class="form-control" v-model="fee.name"/>
						</div>
						<div class="col">
							<label class="form-label">Item:</label>
							<select class="form-select" @change="addItemNameToFee">
								<option value="">--</option>
								<option v-for="(item, i) in quote.items" :value="i">{{ item.info.name }}</option>
							</select>
						</div>
						<div class="col">
							<label class="form-label">Vendor:</label>
							<VendorSelect v-model="fee.vendor" />
						</div>
					</div>
					<Tier :tier="fee.tier" :index="feeIndex" :removeTier="remove" />
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