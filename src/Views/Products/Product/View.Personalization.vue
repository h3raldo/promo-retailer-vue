<script setup>
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			selected: {
				variant: null,
				image: null
			}
		}
	},
	props: [],
	inject: ['product', 'variants'],
	computed: {
		sets(){
			return this.product.personalization?.sets || null;
		},
		availableVariants(){
			let variants = [];
			let colors = [];


			this.variants.forEach( v => {
				if( colors.includes( v.color ) ) return;
				variants.push(v);
				colors.push(v.color);
			})

			return variants;
		},
	},
	methods: {
		previewImage(set){
			return set.image.src.replace('v1739940927', this.getFilters(set));
		},
		getFilters( set )
		{
			console.log(set);
			return entity.product.personalization.set.buildFilters( set );
		},
		addSet(){
			if( this.product.personalization == null ) this.product.personalization = entity.product.personalization.create();
			let set = entity.product.personalization.set.create( this.selected.variant, this.selected.image );
			this.sets.push(set)
		},
		addLocation( set ) {
			let location = entity.product.personalization.set.location.create()
			set.locations.push( location );
		},
		imageLoaded(event, set) {
			let image = event.target;
			set.image.actual.width = image.naturalWidth;
			set.image.actual.height = image.naturalHeight;
			set.image.rendered.width = image.width;
			set.image.rendered.height = image.height;
			set.image.ratio = image.naturalWidth / image.width;
		},
		deleteLocation( i, set )
		{
			set.locations.splice(i, 1);
		},
		variantChanged(){
			this.selected.image = null;
		}
	},
	mounted() {
		if( !this.variants.length ) return;
		this.selected.variant = this.variants[0];
		if( !this.selected.variant.images.length ) return;
		this.selected.image = this.variants[0].images[0];
	}
}
</script>
<style>
	.customizer-image{
		position: relative;
	}
	.customizer-image img{
		display: block;
	}
	.customizer-location{
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
	}
</style>
<template>

	<template v-if="availableVariants.length === 0">
		<h2>Product has no images.</h2>
	</template>

	<template v-if="sets">
		<template v-for="(set, oi) in sets">

		<div class="row">
			<div class="col">
				<div class="customizer-image">
					<img :src="set.image.src" alt="" @load="imageLoaded($event, set)">
					<div v-for="location in set.locations" class="customizer-location" :style="`top: ${location.top}%; left: ${location.left}%; font-size: ${location.font_size}px; color:${location.color}; font-weight: ${location.font_weight}; font-family: '${location.font}'`">{{ location.default_text }}</div>
				</div>
			</div>
			<div class="col">

				<div class="d-flex align-items-center gap-2">
					<div class="flex-grow-1">
						<div class="form-floating">
							<input type="text" class="form-control" v-model="set.info.name">
							<label class="form-label">Set Name (Note: Internal. Used to identify the personalization when building sites)</label>
						</div>
					</div>
					<div>
						<button class="btn btn-outline-danger" @click="sets.splice(oi,1)">Delete</button>
					</div>
				</div>

				<br>

				<div v-for="(location, i) in set.locations" class="bg-light px-4 py-2 mb-3">
					<div class="row mb-3 mt-2">
						<div class="col-6 mb-3">
							<label class="form-label">Label (Customer Will See)</label>
							<input type="text" class="form-control" v-model="location.label">
						</div>
						<div class="col-6 mb-3">
							<label class="form-label">Default Text</label>
							<input type="text" class="form-control" v-model="location.default_text">
						</div>
						<div class="col-1 mb-3">
							<label class="form-label">Color</label>
							<input type="color" class="form-control form-control-color" v-model="location.color">
						</div>
						<div class="col-5">
							<label class="form-label">Weight</label>
							<select class="form-control form-select" v-model="location.font_weight">
								<option value="normal">Normal</option>
								<option value="bold">Bold</option>
							</select>
						</div>
						<div class="col-6">
							<label class="form-label">Font</label>
							<select class="form-control form-select" v-model="location.font">
								<option value="arial">Arial</option>
								<option value="georgia">Georgia</option>
								<option value="open sans">Open Sans</option>
							</select>
						</div>
						<div class="col-4">
							<label class="form-label">Top ({{location.top}}%)</label>
							<input type="range" class="form-range" name="rotation" min="0" max="100" value="0" step=".5" v-model="location.top">
						</div>
						<div class="col-4">
							<label class="form-label">Left ({{location.left}}%)</label>
							<input type="range" class="form-range" name="rotation" min="0" max="100" value="0" step=".5" v-model="location.left">
						</div>
						<div class="col-4">
							<label class="form-label">Font Size ({{location.font_size}}px)</label>
							<input type="range" class="form-range" name="rotation" min="12" max="50" value="0" v-model="location.font_size">
						</div>
					</div>

					<button class="btn btn-outline-danger" @click="deleteLocation(i, set)">Delete</button>
				</div>

				<div class="d-flex gap-3">
					<button class="btn btn-primary" @click="addLocation(set)">Add Location</button>
						<a class="btn btn-outline-primary" :href="previewImage(set)" target="_blank">Preview Image</a>
				</div>
			</div>
		</div>

			<br><br>

		</template>
	</template>

	<div class="bg-light p-3 mb-4">
		<div class="row">
			<div class="col">
				<div class="form-floating">
					<select class="form-select mb-2" v-model="selected.variant" @change="variantChanged">
						<option :value="null">Select Color</option>
						<option v-for="variation in availableVariants" :value="variation">{{ variation.color }}</option>
					</select>
					<label class="form-label fw-bold">Color</label>
				</div>
			</div>
			<div v-if="selected.variant" class="col">
				<div class="form-floating">
					<select class="form-select mb-2" v-model="selected.image">
						<option :value="null">Select Image</option>
						<option v-for="image in selected.variant.images" :value="image">{{ image.type }}</option>
					</select>
					<label class="form-label fw-bold">Color</label>
				</div>
			</div>
		</div>


		<button class="btn btn-primary" @click="addSet" :disabled="!selected.variant || !selected.image">Add Set</button>
	</div>
</template>
