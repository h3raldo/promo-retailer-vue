<script setup>

import Search from "@/EntityComponents/Company/Search.vue";
</script>

<script>
export default {
	data() {
		return {
			isSearching: false,
		}
	},

	props: ['modelValue', 'onSelect'],
	inject: ['vendors'],

	computed: {
		selectedVendor: {
			get(){
				return this.modelValue
			},
			set(val){
				this.$emit('update:modelValue', val)
			}
		},
		isValidated(){
			return !!this.modelValue.company_id
		}
	},
	methods: {
		companySelected(company) {
			console.log('company selected', company);
			this.$emit('update:modelValue', {
				id: company.id,
				name: company.name,
				company_id: company.id
			})
			if( this.onSelect ) this.onSelect(company);
			this.isSearching = false;
		}
	}
}
</script>

<template>
	<div>
		<div class="d-flex gap-2 align-items-center">
			<span>{{ modelValue.name }}</span>

			<a class="align-items-start" v-if="!isSearching" @click="isSearching = true;">
				<i class="bi bi-pencil-square"></i>
			</a>

			<a class="" @click="isSearching = false;" v-if="isSearching">
				<i class="bi bi-x-circle-fill"></i>
			</a>

			<span v-if="modelValue.company_id" class="badge text-bg-success">Validated</span>
			<span v-else class="badge text-bg-secondary">Unvalidated</span>

		</div>
		<div v-if="isSearching" class="bg-light p-3 pb-1 mt-1">
			<Search :onSelect="companySelected" :buttonText="'Search Suppliers'" :type="'plain'" />
		</div>
	</div>

</template>