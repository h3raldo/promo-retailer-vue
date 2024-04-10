<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			name: '',
			loading: false,
			results: []
		}
	},

	inject: ['logos', 'symfony', 'fn'],

	methods: {
		add(logo){
			/* todo: do not add duplicates */
			this.fn.logo.add( logo )
			logo.added = true;
		},

		search(e) {
			e.preventDefault();
			let url = this.symfony.logos.search.replace(':name', this.name);
			let self = this;
			this.loading = true;
			utils.ajax(url, (data) => {
				self.results = [];

				data.forEach( l => {
					Object.keys(l.logos).forEach( key => {
						let v = l.logos[key];
						let logo = entity.order.logo.create()
						logo.id = v.uid;
						logo.variation = v.apply_to;
						logo.name = `${l.name}`;
						logo.url = v.url;
						logo.added = false;
						self.results.push(logo);
					})
				})

				self.loading = false;
			})
		},
	},
}
</script>

<template>

	<form @submit="search($event)" class="d-flex pb-4 pt-2 justify-content-center gap-2">
		<div class="col-4">
			<input type="text" class="form-control" placeholder="Search by Logo Name" v-model="name">
		</div>
		<div>
			<button class="btn btn-primary" type="submit">Search</button>
		</div>
	</form>

	<div v-if="loading" id="search-loader" class="text-center mt-4">
		<div class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>

	<div v-for="logo in results" class="row align-items-center gap-3 border-top pb-4 pt-4">

		<div class="col">
			<span class="d-block">{{ logo.name }}</span>
			<span class="badge text-bg-secondary me-1">{{ logo.variation }}</span>
		</div>
		<div class="col">
			<div class="bg-light border p-2 d-inline-block"><img :src="logo.url" width="100" alt="" /></div>
		</div>
		<div class="col">
			<button class="btn btn-outline-primary" @click="add(logo)" :disabled="logo.added"><i class="bi bi-plus"></i> Add Logo</button>
		</div>

	</div>

</template>

<style scoped>

</style>