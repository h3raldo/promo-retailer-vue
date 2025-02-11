<script setup>
</script>

<script>
export default {
	data() {
		return {
		}
	},

	inject: ['order', 'fn'],

	computed: {

	},

	methods: {
		add( isShipping ) {
			let fee = {};
			if( isShipping ){
				fee.name = 'Shipping';
				fee.type = 'shipping';
			}
			this.fn.fee.add(fee)
		}
	},

	mounted() {}
}
</script>

<template>

	<div class="d-flex gap-2">
		<button class="btn btn-outline-primary btn-sm" @click="add(true)"><i class="bi bi-plus-square"></i> Add Shipping</button>
		<button class="btn btn-primary btn-sm" @click="add(false)"><i class="bi bi-plus-square"></i> Add Setup / Fee</button>
	</div>

</template>