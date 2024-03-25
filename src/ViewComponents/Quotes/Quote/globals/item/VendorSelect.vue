<script setup>

</script>

<script>
export default {
	data() {
		return {
		}
	},

	props: ['modelValue'],
	inject: ['vendors'],

	computed: {
		selectedVendor: {
			get(){
				return this.modelValue
			},
			set(val){
				this.$emit('update:modelValue', val)
			}
		}
	}
}
</script>

<template>
	<select class="form-select" v-model="selectedVendor">
		<option :value={}>-- Select Vendor --</option>
		<option v-for="vendor in vendors" :value="vendor">{{ vendor.name }}</option>
	</select>
</template>