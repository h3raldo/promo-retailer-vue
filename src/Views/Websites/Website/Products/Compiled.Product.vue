<script setup>
</script>
<script>
export default {
	data() {
		return {
			set: '',
			placements: {},
			image: ''
		}
	},
	props: ['variant', 'logos', 'sets'],
	inject: [],
	computed: {
		currentPlacements(){
			if(!this.set) return [];
			return this.sets[this.set];
		},
		previewImage(){
			if(!this.set) return '';
			if(!this.placements) return '';
			if(!this.image) return '';

			let url = this.image.url + '?placements=';

			let url_placements = [];

			Object.keys( this.placements ).forEach( key => {
				url_placements.push( key + ':' + this.placements[key] );
			})

			url += url_placements.join(',');

			return url;
		}
	},
	watch: {
		set(){
			this.image = this.variant.variant.images[0];
			this.placements = {};
			this.currentPlacements.forEach( placement => {
				this.placements[placement.locations[0]] = this.getAvailableVariantsForPlacement( placement )[0].uid;
			})
		}
	},
	methods: {
		getAvailableVariantsForPlacement( placement ){
			let variantLine = this.variant;

			let allowed_logos = [];
			Object.keys( this.logos ).forEach( key => {
				let logo = this.logos[key];
				if( this.arrayIntersect( logo.types, placement.logos ).length > 0 )
					allowed_logos.push( logo );
			})

			let allowed_variants = [];
			allowed_logos.forEach( logo => {
				logo.variants.forEach( variant => {
					if( this.arrayIntersect( variant.types, variantLine.variant.allowed_logo_types ).length === 0 ) return;
					allowed_variants.push( variant );
				})
			})

			return allowed_variants;
		},
		arrayIntersect(array1, array2) {
			return array1.filter(value => array2.includes(value));
		},
	},
	mounted() {

	}
}
</script>
<template>
	<tr>
		<td>{{ variant.variant.id }}</td>
		<td>{{ variant.variant.color }}</td>
		<td>{{ variant.variant.size }}</td>
		<td class="d-flex gap-3">
			<div class="col-4">
				<select v-model="set" class="form-select form-select-sm">
					<option value="">Preview Decoration Set</option>
					<option v-for="set in variant.decoration_sets" :value="set">{{ s23et }}</option>
				</select>

				<div v-if="set" class="text-center">
					<button v-if="set" class="btn btn-secondary btn-sm mt-3" @click="set = ''">Close Preview</button>
				</div>
			</div>
			<div v-if="set" class="flex-fill pb-1">
				Locations:
				<div v-for="placement in currentPlacements">
					<div class="input-group pb-2">
						<span class="input-group-text">{{ placement.locations[0] }} :</span>
						<select class="form-select form-select-sm" v-model="placements[placement.locations[0]]">
							<option v-for="variant in getAvailableVariantsForPlacement(placement)">{{ variant.uid }}</option>
						</select>
					</div>
				</div>

				Image:
				<div class="d-flex align-items-center gap-3">
					<div class="input-group">
						<span class="input-group-text">Image</span>
						<select class="form-select form-select-sm" v-model="image">
							<option v-for="image in variant.variant.images" :value="image">{{ image.type }}</option>
						</select>
					</div>
				</div>

				<div class="mt-3 mb-2 text-center">
					<a :href="previewImage" target="_blank"><img class="col-6 border" :src="previewImage" alt=""></a>
				</div>

			</div>
		</td>
	</tr>
</template>
