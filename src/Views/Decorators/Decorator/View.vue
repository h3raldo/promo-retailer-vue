<script setup>
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Header from "@/Views/Decorators/Decorator/Header.vue";
import Sheets from "@/Views/Decorators/Decorator/Sheets.vue";
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
				decorator: {}
			},
			urls: this.symfony.api.decorators.decorator,
			tabs: ['Sheets', 'Configuration'],
		}
	},

	provide() {
		return {
			decorator: computed(() => this.entities.decorator),
		}
	},

	methods: {

	},

	created() {
		let self = this;
		let url = self.urls.get.replace(':id', self.id);

		utils.ajax(url, (d) => {

			self.loading = false;

			if (!d.entities.decorator) {
				self.notFound = true;
				return;
			}

			self.entities.decorator = d.entities.decorator;
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
				<template #Sheets>
					<Sheets :sheets="entities.decorator.sheets" :editable="true" />
				</template>
				<template #Configuration>
					<p>Config</p>
				</template>
			</Tabs>

		</template>

	</template>
</template>