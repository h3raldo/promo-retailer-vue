<script setup>
import Nav from "@/components/template/Nav.vue";
import {RouterView} from "vue-router";
</script>

<script>
import {computed} from "vue";

export default {
	data() {
		return {
			version: '1.1.13',
			symfony: window.symfony,
			alert: {
				enabled: false,
				message: '',
				type: 'success',
				data: '',
			}
		}
	},

	computed:{

	},

	methods: {
		showAlert(message, type, data){
			if( typeof data === 'object' ) data = JSON.stringify(data);
			this.alert.message = message;

			if( typeof type === 'string' ) this.alert.type = type;
			else this.alert.type = 'success'

			if( typeof data === 'string' ) this.alert.data = data;
			this.alert.enabled = true;
		},
	},

	provide() {
		return {
			alert: this.showAlert,
			symfony: computed(() => this.symfony),
		}
	},

	created() {

	},

	mounted() {

	}
}
</script>

<template>

	<Nav />

	<div class="container py-3">
		<main>
			<div v-if="alert.enabled" :class="'alert alert-dismissible alert-'+alert.type" role="alert">
				<div>{{ alert.message }}</div>
				<textarea v-if="alert.data" class="form-control" readonly>{{alert.data}}</textarea>
				<button type="button" class="btn-close" aria-label="Close" @click="alert.enabled=false"></button>
			</div>

			<RouterView />

			<div class="d-flex justify-content-center align-items-center gap-2 pt-5">
				<div><img class="d-block" src="https://cdn.promoretailer.com/logos/promo-retailer-purple.png" alt="" height="30"></div>
				<div class="fst-italic">PR ProVue v{{ version }}</div>
			</div>
		</main>
	</div>

</template>

<style scoped>

</style>
