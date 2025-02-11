<script setup>
</script>
<script>
export default {
	data() {
		return {
			color: '',
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
		errors(){
			return !!this.color
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
		}
	},
	methods: {
		edit()
		{
			this.variants.forEach( v => {
				if( v.color !== this.color ) return;
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
				<div class="form-floating">
					<select class="form-select" v-model="color">
						<option value="">Select color to edit</option>
						<option v-for="variant in availableVariants" :value="variant.color">{{ variant.color }}</option>
					</select>
					<label>Color To Edit</label>
				</div>
			</div>
			<div class="col">
				<h5>Edit Images</h5>

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

				<button class="btn btn-primary" @click="edit" :disabled="!errors">Bulk Edit</button>
			</div>
		</div>

	</details>

</template>
