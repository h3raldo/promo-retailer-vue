<script setup>
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Header from "@/Views/Logos/Logo/Header.vue";
import Variants from "@/Views/Logos/Logo/Variants.vue";
</script>
<script>
import utils from "@/js/utils.js";
import {computed} from "vue";

export default {
	inject: ['symfony'],

	data() {
		return {
			id: this.$route.params.id,
			loading: true,
			notFound: false,
			entities: {
				logo: {},
				logo_variants: [],
				decorators: [],
			},
			urls: this.symfony.api.logos.logo,
			tabs: ['Variants', 'Configuration']
		}
	},

	provide() {
		return {
			logo: computed(() => this.entities.logo),
			logo_variants: computed(() => this.entities.logo_variants),
			decorators: computed(() => this.entities.decorators),
		}
	},

	methods: {
		getLogo( handle ){
			return this.entities.logo.filter( l => l.handle === handle )[0];
		}
	},

	created() {
		let self = this;
		let url = self.urls.get.replace(':id', self.id);

		utils.ajax(url, (d) => {

			self.loading = false;

			if (!d.entities.logo) {
				self.notFound = true;
				return;
			}

			self.entities.logo = d.entities.logo;
			self.entities.logo_variants = d.entities.logo_variants;
			d.entities.decorators.forEach( d => self.entities.decorators.push( d ));
		});
	}
}
</script>
<template>
	<Loader v-if="loading" />

	<template v-if="!loading">

		<template v-if="notFound">
			<h1>Logo Not Found</h1>
		</template>

		<template v-else>

			<Header />

			<Tabs :labels="tabs">
				<template #Configuration>
				</template>
				<template #Variants>
					<div v-if="entities.logo.handle.trim().length > 3">
						<Variants :logo="entities.logo" :editable="true" :decorators="entities.decorators" :logo_variants="entities.logo_variants" />
					</div>
					<div v-else>
						Logo handle (id) is required.
					</div>
				</template>
			</Tabs>

		</template>

	</template>
</template>