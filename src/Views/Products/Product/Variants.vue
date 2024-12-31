<script setup>
import Tiers from "@/EntityComponents/Product/Variants/Tiers.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Tabs from "@/components/globals/Tabs.vue";
</script>
<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";
import {toRaw} from "vue";

export default {
	data(){
		return {
			tabs: ['Info', 'Cost', 'Images'],
			generate: {
				colors: [],
				sizes: [],
				images: [],
				cost: []
			}
		}
	},
	props: [],
	inject: ['variants', 'product', 'returnToModal', 'available'],
	computed: {
		generateErrorMessage(){
			let noImages = this.generate.colors.filter( c => (!c.image || !c.image.length || c.image === '' ) );
			if( noImages.length !== 0) return `Please select an image for ${noImages.length} colors`;

			if( !this.generate.sizes.length ) return 'Please add at least one size';

			let noColors = this.generate.sizes.filter( c => (!c.name || !c.name.length || c.name.trim() === '' ) );
			if( noColors.length !== 0) return `Please enter a name for ${noColors.length} colors`;

			return false;
		}
	},
	methods: {
		create(){
			this.variants.push(entity.product.variant.create())
		},
		slugify(name)
		{
			return utils.slugify(name)
		},
		priceFormat( price )
		{
			return utils.pricing.format(price);
		},
		defaultName( variant ){
			return `${this.product.name} - ${variant.color}, ${variant.size}`;
		},
		availableImageTypes( variant )
		{
			return entity.product.variant.defaults.images;
		},
		addImage( variant )
		{
			variant.images.push(entity.product.variant.image.create())
		},
		removeImage( i, variant )
		{
			variant.images.splice( i, 1);
		},
		hasImageError( image, variant )
		{
			return variant.images.filter( i => i.type === image.type ).length > 1;
		},
		customizeName( variant ){
			variant.name = this.defaultName(variant);
		},
		generateVariants()
		{
			let self = this;

			self.generate.colors.forEach( c => {

				self.generate.sizes.forEach( s => {

					let variant = entity.product.variant.create();
					variant.color = c.name;
					variant.size = s.name

					let img = entity.product.variant.image.create();
					img.url = c.image;
					variant.images.push(img);

					if( s.cost && s.cost.length ){
						if( s.cost.length === 1 ) variant.cost = s.cost[0].cost;
						else variant.cost_tiers = s.cost;
					}

					if( !s.cost && self.generate.cost.length ){
						if( self.generate.cost.length === 1 ) variant.cost =self.generate.cost[0].cost;
						else variant.cost_tiers = structuredClone( toRaw(self.generate.cost) );
					}

					self.variants.push(variant);
				})

			})

			this.$refs.generate.open = false;
			this.available.colors.length = 0;
			this.generate.colors.length = 0;

		}
	},

	created() {
		if( this.available.colors ) this.generate.colors = this.available.colors;
		if( this.available.sizes ) this.generate.sizes = this.available.sizes;
		if( this.available.images ) this.generate.images = this.available.images;
		if( this.available.cost ) this.generate.cost = this.available.cost;
	},

	mounted(){
		if( this.generate.colors.length ) this.$refs.generate.open = true;
	},
}
</script>
<template>
	<div>

		<details class="bg-light p-3 mb-4" ref="generate">
			<summary>Generate Variants</summary>

			<div class="row mt-3">
				<div class="col-9">
					<h5>Colors</h5>

					<div v-for="(color, ci) in generate.colors" class="d-flex gap-2 mb-2">
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
								<select class="form-select" v-model="color.image">
									<option value="">-- Select --</option>
									<option v-for="image in generate.images" :value="image.url">{{ image.title ? image.title : 'No Name' }}</option>
								</select>
								<label>Image</label>
							</div>
							<div v-else class="form-floating">
								<input type="text" class="form-control" v-model="color.image">
								<label>Image</label>
							</div>
						</div>
						<div>
							<button class="btn btn-outline-danger" @click="generate.colors.splice(ci, 1)"><i class="bi bi-x"></i></button>
						</div>
					</div>

					<button class="btn btn-outline-primary btn-sm" @click="generate.colors.push({name: '', image: ''})">Add Color</button>
				</div>
				<div class="col">
					<h5>Sizes</h5>

					<div v-for="(size, si) in generate.sizes" class="d-flex gap-2 mb-2">
						<div class="flex-fill">
							<div class="form-floating">
								<input type="text" class="form-control" v-model="size.name">
								<label>Name</label>
							</div>
						</div>
						<div>
							<button class="btn btn-outline-danger"@click="generate.sizes.splice(si, 1)"><i class="bi bi-x"></i></button>
						</div>
					</div>

					<button class="btn btn-outline-primary btn-sm" @click="generate.sizes.push({name: ''})">Add Size</button>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-6">
					<h5>Base Cost</h5>
					<Tiers :tiers="generate.cost" />
				</div>
			</div>

			<div class="text-center pt-4">
				<button class="btn btn-primary" @click="generateVariants" :disabled="generateErrorMessage">Generate Variants</button>
				<p class="text-danger" v-if="generateErrorMessage">{{ generateErrorMessage }}</p>
			</div>
		</details>

		<table class="table">

			<thead>
			<tr>
				<th style="width: 75px"></th>
				<th>ID</th>
				<th class="col-3">Color</th>
				<th>Size</th>
				<th>Cost</th>
				<th>Status</th>
				<th></th>
				<th class="col-1"></th>
			</tr>
			</thead>

			<tbody>
			<tr class="mb-3 align-middle" v-for="(variant, vi) in variants">

				<td>
					<template  v-if="variant.images && variant.images.length">
						<a :href="variant.images[0].url" target="_blank"><img :src="variant.images[0].url" alt="" loading="lazy" height="50"></a>
					</template>
				</td>

				<td>{{ variant.id }}</td>

				<td>{{variant.color}}</td>

				<td>{{ variant.size }}</td>

				<td>{{ priceFormat(variant.cost_tiers && variant.cost_tiers.length ? variant.cost_tiers[0].cost : variant.cost) }}</td>

				<td>{{ variant.status }}</td>

				<td>
					<Modal :title="`${variant.color}, ${variant.size}`" :id="slugify(variant.color)+slugify(variant.size)" button-text="Edit" buttonClasses="btn btn-sm btn-primary" icon="bi-pencil">

						<Tabs :labels="tabs">
							<template #Info>

								<div class="row pb-3">
									<div class="col-2">
										<div class="form-floating">
											<select class="form-select" v-model="variant.status">
												<option value="enabled">Enabled</option>
												<option value="disabled">Disabled</option>
												<option value="out-of-stock">Out of Stock</option>
											</select>
											<label>Status</label>
										</div>
									</div>
									<div class="col">
										<div class="d-flex gap-2">
											<template v-if="variant.name === null || variant.name === ''">
												<div class="form-floating flex-fill">
													<input class="form-control" type="text" placeholder="Name" :value="defaultName(variant)" disabled>
													<label>Name</label>
												</div>
												<button class="btn btn-primary" @click="customizeName(variant)"><i class="bi bi-pencil-square"></i> Custom Name</button>
											</template>
											<template v-else>
												<div class="form-floating flex-fill">
													<input class="form-control" type="text" placeholder="Name" v-model="variant.name">
													<label>Name</label>
												</div>
												<button class="btn btn-primary" @click="variant.name = null"><i class="bi bi-arrow-counterclockwise"></i> Default Name</button>
											</template>
										</div>
									</div>
								</div>

								<div class="row pb-3">
									<div class="col">
										<div class="form-floating">
											<input class="form-control" type="text" placeholder="Color" v-model="variant.color">
											<label>Color</label>
										</div>
									</div>
									<div class="col">
										<div class="form-floating">
											<input class="form-control" type="text" placeholder="Color" v-model="variant.color_secondary">
											<label>Secondary Color</label>
										</div>
									</div>
									<div class="col">
										<div class="form-floating">
											<input class="form-control" type="text" placeholder="Parent Color" v-model="variant.color_parent">
											<label>Parent Color</label>
										</div>
									</div>
									<div class="col">
										<div class="form-floating">
											<input class="form-control" type="text" placeholder="Parent Color" v-model="variant.color_parent_secondary">
											<label>Parent Secondary Color</label>
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-3">
										<div class="form-floating">
											<input class="form-control" type="text" placeholder="Size" v-model="variant.size">
											<label>Size</label>
										</div>
									</div>
									<div class="col-3">
										<div class="form-floating">
											<input class="form-control" type="number" placeholder="Weight (lbs)" v-model="variant.weight">
											<label>Weight (lbs)</label>
										</div>
									</div>
									<div class="col-3">
										<div class="form-floating">
											<input class="form-control" type="text" placeholder="SKU (Optional)" v-model="variant.sku">
											<label>SKU (Optional)</label>
										</div>
									</div>
								</div>

							</template>

							<template #Cost>

								<template v-if="variant.cost_tiers === null">
									<div class="form-floating flex-fill">
										<input class="form-control" type="number" placeholder="Cost" v-model="variant.cost">
										<label>Cost</label>
									</div>
									<button class="btn btn-outline-primary mt-3" @click="variant.cost_tiers = []"><i class="bi bi-pencil-square"></i> Use Tiered Cost</button>
								</template>
								<div v-else class="bg-light flex-fill">
									<div class="pt-3 ps-3 text-center">
										Variant Tier Cost
										<button class="btn btn-outline-primary ms-4" @click="variant.cost_tiers = null"><i class="bi bi-arrow-counterclockwise"></i> Use Flat Cost</button>
									</div>
									<Tiers :tiers="variant.cost_tiers" :can-delete-tiers="true" :show-margin="true" />
								</div>

							</template>

							<template #Images>

									<table class="table">
										<thead>
										<tr>
											<th style="width: 75px"></th>
											<th>Type</th>
											<th>URL</th>
											<th></th>
										</tr>
										</thead>
										<tbody>
										<tr v-for="(image, i) in variant.images" class="align-middle">
											<td>
												<a :href="image.url" target="_blank"><img :src="image.url" alt="" height="50"></a>
											</td>
											<td>
												<select class="form-select" v-model="image.type">
													<option v-for="image in availableImageTypes(variant)" :value="image.id">{{ image.name }}</option>
												</select>
												<span v-if="hasImageError(image, variant)" class="text-danger">Duplicate Image Type</span>
											</td>
											<td>
												<input type="text" class="form-control" v-model="image.url">
											</td>
											<td>
												<button class="btn btn-sm btn-outline-danger" @click="removeImage(i, variant)"><i class="bi bi-x"></i></button>
											</td>
										</tr>
										</tbody>
										<tfoot>
										<tr>
											<td></td>
											<td colspan="3">
												<button class="btn btn-outline-primary btn-sm" @click="addImage(variant)">Add Image</button>
											</td>
										</tr>
										</tfoot>
									</table>

							</template>
						</Tabs>

						<template v-if="returnToModal" #footer>
							<button class="btn btn-primary" @click="returnToModal">Done</button>
						</template>
					</Modal>
				</td>

				<td><button class="btn btn-outline-danger btn-sm" @click="variants.splice(vi, 1)"><i class="bi bi-x"></i></button></td>
			</tr>
			</tbody>
		</table>

		<div class="mt-3">
			<button class="btn btn-primary" @click="create">Add New Variant</button>
		</div>
	</div>
</template>
