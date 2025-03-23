<script setup>
import Tiers from "@/EntityComponents/Product/Variants/Tiers.vue";
import SelectOrCustom from "@/EntityComponents/Order/globals/item/SelectOrCustom.vue";
</script>
<script>
import entity from "@/js/entity.js";
import {toRaw} from "vue";

export default {
	data() {
		return {
			available: null,
			generate: {
				colors: [],
				sizes: [],
				images: [],
				cost: []
			}
		}
	},
	inject: ['variants', 'product', 'returnToModal'],
	computed: {
		generateErrorMessage() {
			let noImages = this.generate.colors.filter(c => (!c.image || !c.image.length || c.image === ''));
			if (noImages.length !== 0) return `Please select an image for ${noImages.length} colors`;

			if (!this.generate.sizes.length) return 'Please add at least one size';

			let noColors = this.generate.sizes.filter(c => (!c.name || !c.name.length || c.name.trim() === ''));
			if (noColors.length !== 0) return `Please enter a name for ${noColors.length} colors`;

			if( !this.generate.cost.length ) return 'Please add at least one cost tier.';

			return false;
		}
	},
	methods: {
		create() {
			this.variants.push(entity.product.variant.create())
		},
		generateVariants() {
			let self = this;

			self.generate.colors.forEach(c => {

				self.generate.sizes.forEach(s => {

					let variant = entity.product.variant.create();
					variant.color = c.name;
					variant.size = s.name
					variant.color_parent = c.color_parent;
					variant.color_secondary = c.color_secondary;
					variant.allowed_logo_types = c.allowed_logo_types;

					let img = entity.product.variant.image.create();
					img.url = c.image;
					variant.images.push(img);

					variant.cost_tiers = structuredClone(toRaw(self.generate.cost));
					if( s.manual_cost ){
						variant.cost_tiers.forEach( t => t.cost = s.manual_cost );
					}



					/* No more adding size cost tiers from sage

					if (s.cost && s.cost.length) {
						if (s.cost.length === 1) variant.cost = s.cost[0].cost;
						else variant.cost_tiers = s.cost;
					}

					if (!s.cost && self.generate.cost.length) {
						if (self.generate.cost.length === 1) variant.cost = self.generate.cost[0].cost;
						else variant.cost_tiers = structuredClone(toRaw(self.generate.cost));
					}*/

					self.variants.push(variant);
				})

			})

			this.$refs.generate.open = false;
			if( this.available && this.available.colors ) this.available.colors.length = 0;

			this.generate.colors.length = 0;

		},

		generateFromSage()
		{
			let product = entity.product.createFromSage( this.product.data.external.sage );
			this.available = product.available;
			this.generate = product.available;
		},

		imagesToArray( images )
		{
			let array = [];
			images.forEach( image => {
				array.push({
					title: image.title,
					value: image.url
				})
			})
			return array;
		}

	},

	mounted() {
		if ( !this.variants.length && this.product.data?.external?.sage )
			this.$refs.generate.open = true;
	},
}
</script>
<template>
	<div>

		<details class="bg-light p-3 mb-2" ref="generate">
			<summary>Generate Variants</summary>

			<button v-if="product.data?.external?.sage" class="btn btn-secondary btn-sm mt-2" @click="generateFromSage">Generate From Sage Info</button>

			<div class="mt-2 pb-4">

				<h5>Colors</h5>

				<div v-for="(color, ci) in generate.colors" class="mb-3">
					<div class="d-flex gap-2">
						<div class="flex-fill">
							<div class="form-floating">
								<input type="text" class="form-control" v-model="color.name">
								<label>Name</label>
							</div>
						</div>
						<div class="col-1 text-center align-self-center" v-if="color.image">
							<a :href="color.image" target="_blank"><img :src="color.image" width="50"></a>
						</div>
						<div class="flex-fill">
							<div v-if="generate.images.length" class="form-floating">
								<SelectOrCustom v-model="color.image" :array="imagesToArray(generate.images)" />
								<label>Image</label>
							</div>
							<div v-else class="form-floating">
								<input type="text" class="form-control" v-model="color.image">
								<label>Image</label>
							</div>
						</div>
						<div>
							<div class="form-floating">
								<input type="text" class="form-control" v-model="color.color_parent">
								<label>Parent Color</label>
							</div>
						</div>
						<div>
							<div class="form-floating">
								<input type="text" class="form-control" v-model="color.color_secondary">
								<label>Secondary Color</label>
							</div>
						</div>
						<div>
							<button class="btn btn-outline-danger" @click="generate.colors.splice(ci, 1)">
								<i class="bi bi-x"></i></button>
						</div>
					</div>

					<div class="mt-1 ps-2">
						<div class="d-flex gap-2 flex-wrap align-items-center">
							<label><small>Allowed Logo Types</small></label>
							<label v-for="type in entity.logo.variant.types" class="form-check-label bg-gray px-2 rounded small">
								<input class="form-check-input me-1" type="checkbox" :value="type" v-model="color.allowed_logo_types">
								<span>{{ type }}</span>
							</label>
						</div>
					</div>
				</div>


				<button class="btn btn-outline-primary btn-sm" @click="generate.colors.push({name: '', image: '', color_parent: '', color_secondary: '', allowed_logo_types: []})">Add Color</button>

			</div>

			<div class="pb-1">
				<h5>Sizes</h5>

				<div v-for="(size, si) in generate.sizes" class="d-flex gap-2 mb-2">
					<div class="flex-fill">
						<div class="form-floating">
							<input type="text" class="form-control" v-model="size.name">
							<label>Name</label>
						</div>
					</div>
					<div>
						<div class="form-floating">
							<input type="text" class="form-control" v-model.number="size.manual_cost">
							<label>Cost</label>
						</div>
					</div>
					<div>
						<button class="btn btn-outline-danger" @click="generate.sizes.splice(si, 1)">
							<i class="bi bi-x"></i></button>
					</div>
				</div>

				<button class="btn btn-outline-primary btn-sm" @click="generate.sizes.push({name: '', manual_cost: ''})">Add Size</button>
			</div>


			<div class="row mt-4">
				<div class="col-10">
					<h5>Base Cost</h5>
					<Tiers :tiers="generate.cost" :showMargin="true" />
				</div>
			</div>

			<div class="text-center pt-4">
				<button class="btn btn-primary" @click="generateVariants" :disabled="generateErrorMessage">Generate Variants</button>
				<p class="text-danger" v-if="generateErrorMessage">{{ generateErrorMessage }}</p>
			</div>
		</details>
	</div>
</template>
