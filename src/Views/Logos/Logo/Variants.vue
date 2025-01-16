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

			this.logo_variants.forEach( v => {
				v.types.forEach( t => {
					if( !types[t] ) types[t] = 0;
					types[t]++;
				})
			})

			return Object.keys(types).filter( v => types[v] > 1 );
		},
	},
	props: ['logo', 'editable', 'decorators', 'logo_variants'],
	inject: ['symfony', 'alert'],
	provide() {
		return {
			logo: computed(() => this.logo),
			logo_variants: computed(() => this.logo_variants),
		}
	},
	methods: {
		setupNewVariant(){
			let self = this;
			let url = this.symfony.api.logos.logo.variant.new.replace(':id', this.logo.id);

			self.loading = true;
			utils.ajax(url, (r)=>{
				if( r.error ) self.alert('Error creating new variant', 'danger');
				self.logo_variants.push( r.entities.logo_variant );
				self.loading = false;
			})
		},
		removeVariant( index ){
			// this.logo_variants.splice( index, 1 );
		}
	},
	created(){
		console.log('passed', this.logo);
	}
}
</script>
<template>

	<div v-if="hasDuplicateTypes.length" class="alert alert-warning" role="alert">
		<i class="bi bi-exclamation-circle-fill"></i> Warning: There are duplicate types for: {{ hasDuplicateTypes.join(', ')}}.
	</div>

	<div class="row">
		<div class="col col-4 mb-3" v-for="(variant, vi) in logo_variants">
			<div class="bg-light border p-3 mb-2 d-flex flex-column" style="height: 100%">
				<div class="flex-fill">
					<h3 class="text-center"><span class="badge text-bg-primary">{{ variant.types.join(', ') }}</span></h3>
					<VariantsVariant :variant="variant" :decorators="decorators" :editable="editable" :logo="logo" />
				</div>
				<div class="text-center" v-if="editable">
					<button class="btn btn-outline-danger" @click="removeVariant(vi)" disabled><i class="bi bi-trash"></i> Remove</button>
				</div>
			</div>
		</div>
	</div>

	<div class="text-center pt-3" v-if="editable">
		<button class="btn btn-outline-primary" @click="setupNewVariant()"><i class="bi bi-plus-circle"></i> Add New Variant</button>
	</div>
</template>