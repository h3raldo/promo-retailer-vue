<script setup>
</script>
<script>
export default {
	data() {
		return {
		}
	},
	props: [],
	inject: [],
	computed: {
		canGoBack() {
			return window.history.length > 1;
		}
	},
	methods: {
		goBack() {
			this.$router.back();
		}
	},

}
</script>
<template>
	<button @click="goBack" class="btn btn-secondary" :disabled="!canGoBack"><i class="bi bi-arrow-bar-left"></i></button>
</template>
