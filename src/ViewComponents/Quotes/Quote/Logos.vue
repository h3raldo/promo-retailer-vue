<script setup>
import LogoSearch from "@/ViewComponents/Quotes/Quote/Logos/Search.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>

<script>
import defaults from "@/js/Quotes/Quote/defaults.js";

export default {
	data() {
		return {}
	},

	inject: ['logos'],

	methods: {
		addCustomLogo(){
			let logo = defaults.logos.list()[0];
			logo.id += Math.floor(Math.random() * 500)
			this.logos.push( logo )
		},
		removeLogo(index) {
			this.logos.splice(index, 1);
		},
	},
}
</script>

<template>

	<div v-for="(logo, i) in logos" class="tier mb-1 mt-2 gap-3 row align-items-center">

		<div class="col">
				<div class="bg-light border p-2 d-inline-block"><img class="d-block" :src="logo.url" width="150" alt="" /></div>
		</div>
		<div class="col">
			<div class="form-floating">
				<input type="text" class="form-control" placeholder="Logo URL" v-model="logo.url" />
				<label>Logo URL</label>
			</div>
		</div>
		<div class="col">
			<div class="form-floating">
				<input type="text" class="form-control" placeholder="Logo Name" v-model="logo.name" />
				<label>Logo Name</label>
			</div>
		</div>
		<div class="col">
			<div class="form-floating">
				<input type="text" class="form-control" placeholder="Logo Variation" v-model="logo.variation" />
				<label>Logo Variation</label>
			</div>
		</div>
		<div class="col">
			<div class="form-floating">
				<input type="text" class="form-control" placeholder="Logo Group" v-model="logo.group" />
				<label>Logo Group</label>
			</div>
		</div>
		<div class="col-1">
			<button class="btn btn-outline-danger" @click="removeLogo(i)"><i class="bi bi-trash"></i></button>
		</div>

	</div>

	<div class="pt-4 border-top mt-4">
		<Modal :id="'quote-logo-search'" :title="'Logo Search'" :buttonText="'Add Logo'" :buttonClasses="'btn btn-primary'" :icon="'bi-plus-circle'">
			<LogoSearch />
		</Modal>
		<button class="btn btn-outline-primary ms-3" @click="addCustomLogo"><i class="bi bi-plus-circle"></i> Add Custom Logo</button>
	</div>


</template>

<style scoped>

</style>