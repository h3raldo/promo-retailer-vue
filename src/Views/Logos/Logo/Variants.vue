<script setup>
import VariantsVariant from "@/Views/Logos/Logo/Variants.Variant.vue";
</script>
<script>
import {computed} from "vue";
import utils from "@/js/utils.js";

export default {
	data(){
		return {
			status: {
				loading: false,
			}
		}
	},
	computed: {
		hasDuplicateTypes(){
			let types = {};

			this.logo.variants.forEach( v => {
				v.types.forEach( t => {
					if( !types[t] ) types[t] = 0;
					types[t]++;
				})
			})

			return Object.keys(types).filter( v => types[v] > 1 );
		},
	},
	props: ['logo', 'editable', 'decorators'],
	inject: ['symfony', 'alert'],
	provide() {
		return {
			logo: computed(() => this.logo),
		}
	},
	methods: {
		setupNewVariant(){
			let self = this;
			let url = this.symfony.api.logos.logo.variant.new.replace(':id', this.logo.id);

			self.loading = true;
			utils.ajax(url, (r)=>{
				if( r.error ) self.alert('Error creating new variant', 'danger');
				self.logo.variants.push( r.entities.logo_variant );
				self.loading = false;
			})
		}
	}
}
</script>
<template>

	<div v-if="hasDuplicateTypes.length" class="alert alert-warning" role="alert">
		<i class="bi bi-exclamation-circle-fill"></i> Warning: There are duplicate types for: {{ hasDuplicateTypes.join(', ')}}.
	</div>

	<div class="row">
		<div class="col col-4 mb-3" v-for="(variant, vi) in logo.variants">
			<VariantsVariant :variant="variant" :decorators="decorators" :editable="editable" :logo="logo" :index="vi" />
		</div>
	</div>

	<div class="text-center pt-3" v-if="editable">
		<button class="btn btn-outline-primary" @click="setupNewVariant()"><i class="bi bi-plus-circle"></i> Add New Variant</button>
	</div>
</template>