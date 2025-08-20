<script setup>
import Tiers from "@/EntityComponents/Product/Variants/Tiers.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			filters: {
				color: '',
				size: '',
			},
			weight: 0,
			cost_tiers: [],
			images: {
				'front-flat': '',
				'front-model': '',
				'back-flat': '',
				'back-model': ''
			}
		}
	},
	props: [],
	inject: ['variants'],
	computed: {
		nothingFilledIn(){
			let imagesFilledIn = Object.keys(this.images).filter( k => this.images[k] ).length > 0;
			return !imagesFilledIn && !this.cost_tiers.length && !this.weight > 0;
		},
		availableColors(){
			let colors = {};
			this.variants.forEach( v => {
				if( !colors[v.color] ) colors[v.color] = { color: v.color, variants: [] };
				colors[v.color].variants.push(v);
			})
			return colors
		},
		availableSizes(){
			let sizes = {};
			this.variants.forEach( v => {
				if( !sizes[v.size] ) sizes[v.size] = { size: v.size, variants: [] };
				sizes[v.size].variants.push(v);
			})
			return sizes;
		}
	},
	methods: {
		edit()
		{
			this.variants.forEach( v => {

				let matches_color = true;
				if( this.filters.color ) matches_color = v.color === this.filters.color;

				let matches_size = true;
				if( this.filters.size ) matches_size = v.size === this.filters.size;

				if( !matches_color || !matches_size ) return;

				if( this.cost_tiers.length )
					v.cost_tiers = utils.duplicateObject(this.cost_tiers);

				if( this.weight > 0 )
					v.weight = this.weight;

				Object.keys(this.images).forEach( type => {
					if( this.images[type] ) this.editOrCreate(v, type, this.images[type]);
				})
			})
		},
		editOrCreate( variant, type, url ){
			let existing = variant.images.filter( i => {
				return i.type === type
			})

			if( !existing.length ) {
				variant.images.push({ type, url });
			} else {
				existing[0].url = url;
			}
		}
	}
}
</script>
<template>

	<details class="bg-light p-3 mb-4">
		<summary>Bulk Edit</summary>

		<div class="row pt-3">

			<div class="col">
				<div class="form-floating mb-3">
					<select class="form-select" v-model="filters.color">
						<option value="">- All Colors -</option>
						<option v-for="(obj, color) in availableColors" :value="color">{{ color }}</option>
					</select>
					<label>Filter Colors</label>
				</div>

				<div class="form-floating mb-3">
					<select class="form-select" v-model="filters.size">
						<option value="">- All Sizes -</option>
						<option v-for="(obj, size) in availableSizes" :value="size">{{ size }}</option>
					</select>
					<label>Filter Sizes</label>
				</div>

				<button class="btn btn-primary" @click="edit" :disabled="nothingFilledIn">Bulk Edit</button>
			</div>
			<div class="col">

				<details class="bg-light mb-4">
					<summary class="h4">Images</summary>
					<div>
						<table class="table table-light align-middle table-sm">
							<thead>
							<tr>
								<th></th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="(url, type) in images">
								<td>{{ type }}:</td>
								<td><input type="text" class="form-control" v-model="images[type]"></td>
							</tr>
							</tbody>
						</table>
					</div>
				</details>

				<details class="bg-light mb-4">
					<summary class="h4">Cost</summary>
					<div>
						<Tiers :tiers="cost_tiers" :can-delete-tiers="true" :show-margin="true" />
					</div>
				</details>

				<details class="bg-light mb-4">
					<summary class="h4">Weight</summary>
					<div>
						<div class="form-floating">
							<input type="number" class="form-control" v-model="weight" placeholder="Weight in lbs">
							<label>Weight (lbs)</label>
						</div>
					</div>
				</details>

			</div>
		</div>

	</details>

</template>
