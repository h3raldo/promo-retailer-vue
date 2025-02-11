<script setup>
import Variants from "@/Views/Logos/Logo/Variants.vue";
import LogoSearch from "@/EntityComponents/Logo/Search.vue";
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {}
	},
	props: ['editing'],
	inject: ['website', 'symfony', 'logos'],
	computed: {
		logo_types(){
			return entity.website.default.logo_types
		},
		websiteLogos(){
			if( !this.website.config ) return [];
			return this.website.config.logos;
		},
		organizedLogos(){
			let organized = {}
			this.logo_types.forEach(type => organized[type] = []);

			this.websiteLogos.forEach(logo => {
				if( logo.types.length )
					logo.types.forEach(type => organized[type].push(logo));
				else
					organized['none'].push(logo);
			})

			return organized;
		}
	},
	methods: {
		getLogo( id ){
			let logo = this.logos.filter( l => l.id === id )[0];
			if( !logo ) return {
				name: 'LOGO HANDLE NOT FOUND',
				id: null,
				variants: []
			}

			return logo;
		},
		viewLogo( id ){
			this.$router.push( this.symfony.views.logos_logo.replace(':id', id) )
		},
		addLogo( logo ){
			this.logos.push(logo)
			this.websiteLogos.push({id: logo.id, types: []})
			this.editing.logos = true;
		}
	}
}
</script>
<template>
	
	<div class="pb-3 d-flex align-items-center justify-content-center gap-3">
		<template v-if="editing.logos">
			<button class="btn btn-outline-success" @click="editing.logos = !editing.logos"><i class="bi bi-check2"></i> Done</button>
		</template>
		<template v-else>
			<button class="btn btn-primary" @click="editing.logos = !editing.logos"><i class="bi bi-pencil"></i> Edit Websites Logos</button>
		</template>
		<LogoSearch :buttonText="'Add Logo'" :buttonIcon="'bi bi-plus-circle'" :on-select="addLogo" :company-id="website.company.id" />
	</div>

	<template v-if="editing.logos">
		<div v-for="(logo, li) in website.config.logos" class="bg-light p-3 mb-2">

			<h5 class="mb-0 d-flex justify-content-between align-items-center">
				<span>{{ getLogo(logo.id).name }}</span>
				<button class="btn btn-danger" @click="website.config.logos.splice( li, 1 )"><i class="bi bi-x"></i> Remove</button>
			</h5>

			<div class="d-flex gap-3 align-items-center pt-2 pb-2 border my-2">
				<div v-for="type in logo_types">
					<label class="form-check-label bg-gray px-2 rounded small">
						<input class="form-check-input me-1" type="checkbox" v-model="logo.types" :value="type">
						<span>{{ type }}</span>
					</label>
				</div>
			</div>

			<Variants :logo="getLogo(logo.id)" />
		</div>
	</template>

	<template v-else>

		<div v-for="(logo_ids, type) in organizedLogos">

			<template v-if="logo_ids.length > 0">

				<h2 :class="type === 'none' ? 'text-uppercase text-danger' : 'text-uppercase' ">{{ type }}</h2>

				<div v-for="logo in logo_ids" class="bg-light p-3 mb-2">

					<div class="d-flex gap-2 align-items-center pb-2">
						<div class="d-flex align-items-center gap-2">
							<h5 class="mb-0">{{ getLogo(logo.id).name }} </h5>
						</div>
					</div>

					<Variants :logo="getLogo(logo.id)"  />

					<div>
						<button class="btn btn-sm btn-outline-primary" @click="viewLogo(getLogo(logo.id).id)">Edit Logo Details</button>
					</div>

				</div>

				<hr>

			</template>
		</div>

	</template>
	
</template>
