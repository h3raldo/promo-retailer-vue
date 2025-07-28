<script setup>
import Nav from "@/components/template/Nav.vue";
import {RouterView} from "vue-router";
</script>

<script>
import {computed} from "vue";

export default {
	data() {
		return {
			version: '3.0.0',
			symfony: window.symfony,
			alert: {
				enabled: false,
				message: '',
				type: 'success',
				data: '',
			},
			search: {},
			config: {},
			cache: {
				component: {}
			}
		}
	},

	computed:{

	},

	methods: {
		showAlert(message, type, data)
		{
			if( typeof data === 'object' ) data = JSON.stringify(data);
			this.alert.message = message;

			if( typeof type === 'string' ) this.alert.type = type;
			else this.alert.type = 'success'

			if( typeof data === 'string' ) this.alert.data = data;
			this.alert.enabled = true;

			let self = this;
			setTimeout( () => {
				self.alert.enabled = false;
			}, 4000)
		},

		updateLocalStorage(key)
		{
			localStorage.setItem(key, JSON.stringify(this[key]));
		}
	},

	provide() {
		return {
			alert: this.showAlert,
			updateLocalStorage: this.updateLocalStorage,
			symfony: computed(() => this.symfony),
			search: computed(() => this.search),
			config: computed(() => this.config),
			cache: computed(() => this.cache),
		}
	},

	created() {

	},

	mounted() {
		if( localStorage.getItem('search') )
			this.search = JSON.parse( localStorage.getItem('search'));

		if( localStorage.getItem('config') )
			this.config = JSON.parse( localStorage.getItem('config'));
	}
}
</script>

<template>

	<main class="d-flex">

		<aside class="main-menu-sidebar d-flex flex-column flex-shrink-0 p-3 text-white bg-dark">
			<Nav />
		</aside>

		<div class="main-body p-4 flex-grow-1" style="min-height: 100vh">
			<main>
				<div v-if="alert.enabled" class="toast-container position-fixed bottom-0 end-0 p-4">
					<div id="liveToast" :class="'toast show text-bg-'+alert.type" role="alert" aria-live="assertive" aria-atomic="true">
						<div class="toast-header">
							<strong class="me-auto">
								<span v-if="alert.type === 'success'">Success!</span>
								<span v-else>Alert!</span>
							</strong>
							<small>Just now</small>
							<button type="button" class="btn-close" @click="alert.enabled=false"></button>
						</div>
						<div class="toast-body">
							<div>{{ alert.message }}</div>
							{{ alert.data }}
						</div>
					</div>
				</div>

				<RouterView />

				<div class="d-flex justify-content-center align-items-center gap-2 pt-5">
					<div><img class="d-block" src="https://r2.promoconnections.com/web/logos/promo-connections-logo-icon-white.png" alt="" height="30"></div>
					<div class="fst-italic">ProConnect v{{ version }}</div>
				</div>
			</main>
		</div>

	</main>

</template>