<script setup>
</script>

<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
		}
	},

	inject: ['quote'],

	computed: {

	},

	methods: {
		addFee( isShipping ) {
			let fee = entity.quote.fee.create();

			if( isShipping ){
				fee.name = 'Estimated Shipping';
			}

			this.quote.fees.push(fee);
		}
	},

	mounted() {}
}
</script>

<template>

	<div class="d-flex gap-2">
		<button class="btn btn-outline-primary btn-sm" @click="addFee(true)"><i class="bi bi-plus-square"></i> Add Shipping</button>
		<button class="btn btn-primary btn-sm" @click="addFee(false)"><i class="bi bi-plus-square"></i> Add Setup / Fee</button>
	</div>

</template>