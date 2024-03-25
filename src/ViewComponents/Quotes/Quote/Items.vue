<script setup>
import Item from '@/ViewComponents/Quotes/Quote/Items/Item.vue';
import addItem from "@/ViewComponents/Quotes/Quote/Actions/AddItem.vue";
import addFee from "@/ViewComponents/Quotes/Quote/Actions/AddFee.vue";
import Fee from "@/ViewComponents/Quotes/Quote/Items/Fee.vue";
</script>

<script>
import pricing from "@/js/Quotes/Quote/pricing.js";

export default {
	data() {
		return {}
	},

	inject: ['quote', 'updateTotals', 'updatePricing'],

	computed: {
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

	<Item v-for="( item, index ) in quote.items" :item="item" :itemIndex="index" />

	<div class="row border-bottom py-4 mb-4">
		<div class="col col-4"><addItem /></div>
	</div>

	<Fee v-for="(fee, index) in quote.fees" :fee="fee" :feeIndex="index" />

	<div class="d-flex gap-3 justify-content-end">
		<div class="text-end">
			<addFee />
		</div>
		<div class="col-1 text-end"></div>
		<div class="col-1"><!-- actions --></div>
	</div>

	<div class="d-flex gap-3 justify-content-end align-items-center pt-2">
		<div class="text-end">Total:</div>
		<div class="col-1 text-end">{{ pricing.format(quote.totals.total) }}</div>
		<div class="col-1 text-end"></div>
	</div>

	<div class="d-flex gap-3 justify-content-end pt-2">
		<div class="text-end"><i class="bi bi-eye-slash"></i> Cost:</div>
		<div class="col-1 text-end">{{ pricing.format(quote.totals.cost) }}</div>
		<div class="col-1"><!-- actions --></div>
	</div>

	<div class="d-flex gap-3 justify-content-end pt-2">
		<div class="text-end"><i class="bi bi-eye-slash"></i> Margin:</div>
		<div class="col-1 text-end">{{ quote.totals.margin }}%</div>
		<div class="col-1"><!-- actions --></div>
	</div>

	<div class="d-flex gap-3 justify-content-end pt-2">
		<div class="text-end"><i class="bi bi-eye-slash"></i> Profit:</div>
		<div class="col-1 text-end">{{ pricing.format(quote.totals.total - quote.totals.cost) }}</div>
		<div class="col-1"><!-- actions --></div>
	</div>

	<div class="d-flex gap-3 justify-content-end pt-2">
		<div class="text-end"><button class="btn btn-outline-primary btn-sm" @click="updatePricing"><i class="bi bi-calculator"></i> Recalculate Pricing</button></div>
		<div class="col-1 text-end"></div>
		<div class="col-1 text-end"></div>
	</div>

</template>