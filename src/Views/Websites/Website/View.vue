<script setup>
import Header from "@/Views/Websites/Website/Header.vue";
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Products from "@/Views/Websites/Website/Products.vue";
import Variants from "@/Views/Logos/Logo/Variants.vue";
import LogoSearch from "@/EntityComponents/Logo/Search.vue";
</script>
<script>
import utils from "@/js/utils.js";
import {computed} from "vue";
import entity from "@/js/entity.js";

export default {
	inject: ['symfony'],

	data() {
		return {
			id: this.$route.params.id,
			loading: true,
			notFound: false,
			entities: {
				website: {},
				logos: []
			},
			editing: {
				logos: false,
			},
			urls: this.symfony.api.websites.website,
			tabs: ['Configuration', 'Logos', 'Products', 'Categories'],
		}
	},

	computed: {
		logo_types(){
			return entity.website.default.logo_types
		},
		websiteLogos(){
			if( !this.entities.website.config ) return [];
			return this.entities.website.config.logos;
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

	provide() {
		return {
			website: computed(() => this.entities.website),
		}
	},

	watch: {

	},

	methods: {
		getLogo( handle ){
			let logo = this.entities.logos.filter( l => l.logo.handle === handle )[0];
			if( !logo ) return {
				name: 'LOGO HANDLE NOT FOUND',
				id: null,
				variants: []
			}

			return logo.logo;
		},
		getLogoVariants( handle ){
			console.log('getLogo',handle);
			let logo = this.entities.logos.filter( l => l.logo.handle === handle )[0];
			console.log('variant!',logo);
			if( !logo ) return []
			return logo.logo_variants;
		},
		viewLogo( id ){
			this.$router.push( this.symfony.views.logos_logo.replace(':id', id) )
		},
		addLogo( logo ){
			this.entities.logo.push(logo)
			this.websiteLogos.push({id: logo.handle, types: []})
			this.editing.logos = true;
		}
	},

	created() {
		let self = this;
		let url = self.urls.get.replace(':id', self.id);

		utils.ajax(url, (d) => {

			self.loading = false;

			if (!d.entities.website) {
				self.notFound = true;
				return;
			}

			self.entities.website = d.entities.website;
			self.entities.logos = d.entities.logos;
		});
	}
}
</script>
<template>

	<Loader v-if="loading" />

	<template v-if="!loading">

		<template v-if="notFound">
			<h1>Website Not Found</h1>
		</template>

		<template v-else>
			<Header />

			<Tabs :labels="tabs">
				<template #Configuration>

					<div class="row">
						<div class="col col-6">
							<h5>Colors:</h5>
							<div class="row mb-3">
								<div class="col">
									<label class="form-label">Primary Color:</label>
									<input type="color" class="form-control" placeholder="Primary Color" v-model="entities.website.config.design.color_primary">
								</div>
								<div class="col">
									<label class="form-label">Secondary Color:</label>
									<input type="color" class="form-control" placeholder="Secondary Color" v-model="entities.website.config.design.color_secondary">
								</div>
								<div class="col">
									<label class="form-label">Tertiary Color:</label>
									<input type="color" class="form-control" placeholder="Tertiary Color" v-model="entities.website.config.design.color_tertiary">
								</div>
							</div>
							<hr>
						</div>
						<div class="col">
							<h5>Magento</h5>
							<div class="bg-light p-3">
								<div class="row mb-3">
									<div class="col">
										<label class="form-label">Website ID:</label>
										<input type="text" class="form-control" placeholder="Website ID" v-model="entities.website.config.magento.website_id">
									</div>
									<div class="col">
										<label class="form-label">Store ID:</label>
										<input type="text" class="form-control" placeholder="Store ID" v-model="entities.website.config.magento.group_id">
									</div>
									<div class="col">
										<label class="form-label">Store View ID:</label>
										<input type="text" class="form-control" placeholder="Store View ID" v-model="entities.website.config.magento.store_id">
									</div>
								</div>
							</div>
						</div>
					</div>

				</template>

				<template #Logos>

					<div class="pb-3 d-flex align-items-center justify-content-center gap-3">
						<template v-if="editing.logos">
							<button class="btn btn-outline-success" @click="editing.logos = !editing.logos"><i class="bi bi-check2"></i> Done</button>
						</template>
						<template v-else>
							<button class="btn btn-primary" @click="editing.logos = !editing.logos"><i class="bi bi-pencil"></i> Edit Websites Logos</button>
						</template>
						<LogoSearch :buttonText="'Add Logo'" :buttonIcon="'bi bi-plus-circle'" :on-select="addLogo" :company-id="entities.website.company.id" />
					</div>

					<template v-if="editing.logos">
						<div v-for="(logo, li) in entities.website.config.logos" class="bg-light p-3 mb-2">

							<h5 class="mb-0 d-flex justify-content-between align-items-center">
								<span>{{ getLogo(logo.id).name }}</span>
								<button class="btn btn-danger" @click="entities.website.config.logos.splice( li, 1 )"><i class="bi bi-x"></i> Remove</button>
							</h5>

							<div class="d-flex gap-3 align-items-center pt-2 pb-2 border my-2">
								<div v-for="type in logo_types">
									<label class="form-check-label bg-gray px-2 rounded small">
										<input class="form-check-input me-1" type="checkbox" v-model="logo.types" :value="type">
										<span>{{ type }}</span>
									</label>
								</div>
							</div>

							<Variants :logo="getLogo(logo.id)" :logo_variants="getLogoVariants(logo.id)" />
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

									<Variants :logo="getLogo(logo.id)" :logo_variants="getLogoVariants(logo.id)" />

									<div>
										<button class="btn btn-sm btn-outline-primary" @click="viewLogo(getLogo(logo.id).id)">Edit Logo Details</button>
									</div>

								</div>

								<hr>

							</template>
						</div>

					</template>

				</template>

				<template #Products>
					<Products />
				</template>

				<template #Categories>
					<p>Coming soon.</p>
				</template>
			</Tabs>
		</template>

	</template>

</template>