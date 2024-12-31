<script setup>
import VariantsVariant from "@/Views/Logos/Logo/Variants.Variant.vue";
</script>
<script>
import entity from "@/js/entity.js";
import {computed} from "vue";

export default {
	data(){
		return {
		}
	},
	computed: {
		apply_types(){
			return entity.logo.variant.types;
		},
		variants(){
			return this.logo.variants
		}
	},
	props: ['logo', 'editable', 'decorators', 'assets'],
	provide() {
		return {
			logo: computed(() => this.logo),
			assets: computed(() => this.assets),
		}
	},
	methods: {
		setupNewVariant( type ){
			let uid = this.logo.handle + '--' + type;
			this.variants[type] = {
				apply_to: type,
				color_count: 0,
				decorators: [],
				thread_count: 0,
				uid: uid,
				url: 'https://res.cloudinary.com/promo-retailer/image/upload/logos/your-logo--light.png'
			};
		}
	}
}
</script>
<template>

	<div class="row">
		<div class="col col-4 mb-3" v-for="(apply_type, i) in apply_types">

			<div v-if="variants[apply_type]" class="bg-light border p-3 mb-2" style="height: 100%">

				<h3 class="text-center"><span class="badge text-bg-primary">{{ apply_type }}</span></h3>

				<VariantsVariant :variant="variants[apply_type]" :decorators="decorators" :apply_type="apply_type" :editable="editable" :logo="logo" />

			</div>

			<div v-else class="bg-light border p-3 mb-2 d-flex align-items-center justify-content-center text-center" style="height: 100%">
				<div>
					<h3><span class="badge text-bg-secondary">{{ apply_type }}</span></h3>
					<div v-if="editable">
						<br>
						<button class="btn btn-outline-secondary" @click="setupNewVariant(apply_type)">Setup Variant</button>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>