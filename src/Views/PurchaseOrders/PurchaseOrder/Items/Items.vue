<script setup>
import Item from '@/EntityComponents/Order/Items/Item.vue';
import addItem from "@/EntityComponents/Order/Actions/AddItem.vue";
import addFee from "@/EntityComponents/Order/Actions/AddFee.vue";
import Fee from "@/EntityComponents/Order/Items/Fee.vue";
</script>

<script>
import pricing from "@/js/pricing.js";
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			editingPaid: false,
		}
	},

	inject: ['order', 'updateTotals', 'updatePricing', 'order'],

	watch: {
		'order.config.tax.enabled'(){
			this.updatePricing();
		},
	},

	computed: {
		showPrice(){
			return pricing.showPrice(this.order);
		}
	},

	methods: {

	},

	mounted() {}
}
</script>

<template>

	<div class="row bg-light fw-bold p-2">
		<div class="col col-4">Product</div>
		<div class="col col-6">Cost</div>
		<div class="col col-1">Subtotal</div>
		<div class="col col-1"></div>
	</div>

	<Item v-for="( item, index ) in order.items" :item="item" :itemIndex="index" />

	<div class="row border-bottom py-4 mb-4">
		<div class="col col-4"><addItem /></div>
	</div>

	<Fee v-for="(fee, index) in order.fees" :fee="fee" :feeIndex="index" />

	<div class="d-flex gap-3 justify-content-end">
		<div class="text-end">
			<addFee />
		</div>
		<div class="col-1 text-end"></div>
		<div class="col-1"><!-- actions --></div>
	</div>

	<div class="d-flex gap-3 justify-content-end align-items-center pt-2">
		<div class="text-end">Subtotal:</div>
		<div class="col-1 text-end">{{ pricing.format(order.totals.total) }}</div>
		<div class="col-1 text-end"></div>
	</div>

	<div class="d-flex gap-3 justify-content-end pt-2">
		<div class="text-end">
			<div class="form-check form-switch">
				<input class="form-check-input" type="checkbox" role="switch" v-model="order.config.tax.enabled">
				<label class="form-check-label">Tax:</label>
			</div>
		</div>
		<div class="col-1 text-end">
			<span v-if="order.config.tax.enabled">{{ pricing.format(order.totals.tax) }}</span>
			<span v-else>$0.00</span>
		</div>
		<div class="col-1"><!-- actions --></div>
	</div>

	<div class="d-flex gap-3 justify-content-end align-items-center pt-2">
		<div class="text-end">Total:</div>
		<div class="col-1 text-end">{{ pricing.format(order.totals.total + order.totals.tax) }}</div>
		<div class="col-1 text-end"></div>
	</div>

	<template v-if="showPrice">

		<div class="d-flex gap-3 justify-content-end pt-2">
			<div class="text-end"><i class="bi bi-eye-slash"></i> Cost:</div>
			<div class="col-1 text-end">{{ pricing.format(order.totals.cost) }}</div>
			<div class="col-1"><!-- actions --></div>
		</div>

		<div class="d-flex gap-3 justify-content-end pt-2">
			<div class="text-end"><i class="bi bi-eye-slash"></i> Margin:</div>
			<div class="col-1 text-end">{{ order.totals.margin }}%</div>
			<div class="col-1"><!-- actions --></div>
		</div>

		<div class="d-flex gap-3 justify-content-end pt-2">
			<div class="text-end"><i class="bi bi-eye-slash"></i> Profit:</div>
			<div class="col-1 text-end">{{ pricing.format(order.totals.total - order.totals.cost) }}</div>
			<div class="col-1"><!-- actions --></div>
		</div>

	</template>

	<div class="d-flex gap-3 justify-content-end pt-2">
		<div class="text-end"><button class="btn btn-outline-primary btn-sm" @click="updatePricing"><i class="bi bi-calculator"></i> Recalculate Pricing</button></div>
		<div class="col-1 text-end"></div>
		<div class="col-1 text-end"></div>
	</div>

</template>