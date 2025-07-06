<script setup>
import Tabs from "@/components/globals/Tabs.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Tiers from "@/EntityComponents/Product/Variants/Tiers.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			tabs: ['Info', 'Cost', 'Images'],
			adding_custom: false,
			custom_type: '',
		}
	},
	props: ['product', 'variant', 'vi', 'remove', 'returnToModal', 'product'],
	inject: [],
	computed: {
		custom_types(){
			return this.variant.allowed_logo_types.filter( t => entity.logo.variant.types.indexOf( t ) === -1 );
		}
	},
	methods: {
		slugify(name)
		{
			return utils.slugify(name)
		},
		priceFormat( price )
		{
			return utils.pricing.format(price);
		},
		availableImageTypes( variant )
		{
			return entity.product.variant.defaults.images;
		},
		addImage( variant )
		{
			if( !variant.images ) variant.images = [];
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
		defaultName( variant ){
			return `${this.product.name} - ${variant.color}, ${variant.size}`;
		},
		addCustomLabel()
		{
			this.variant.allowed_logo_types.push( this.custom_type );
			this.adding_custom = false;
			this.custom_type = '';
		}
	}
}
</script>
<template>
	<tr :class="`mb-3 align-middle ${variant.status === 'delete' ? 'to-delete' : ''}`" >

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

						<label class="fw-bold mt-3 mb-2">Allowed Logo Types</label>
						<div class="d-flex gap-2">
							<label v-for="type in entity.logo.variant.types" class="form-check-label bg-gray px-2 rounded small"><input class="form-check-input me-1" type="checkbox" name="allowed_logo_types[]" :value="type" v-model="variant.allowed_logo_types"><span>{{ type }}</span></label>
						</div>

						<label v-for="type in custom_types" class="form-check-label bg-gray px-2 rounded small">
							<input class="form-check-input me-1" type="checkbox" :value="type" v-model="variant.allowed_logo_types">
							<span>{{ type }}</span>
						</label>

						<button v-if="!adding_custom" class="btn btn-sm btn-outline-primary" @click="adding_custom = true">Add Custom</button>
						<div v-if="adding_custom" class="d-flex gap-2">
							<input type="text" class="form-control form-control-sm" placeholder="Custom Type" v-model="custom_type">
							<button class="btn btn-sm btn-outline-primary" @click="addCustomLabel">Add</button>
						</div>


						<!-- @todo: private product -->
						<!--
						<br><br>
						<label class="form-check-label bg-gray px-2 rounded small">
							<input class="form-check-input me-1" type="checkbox" :value="true" v-model="variant.data.private">
							<span>Private Product</span>
						</label>
						-->

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

		<td><button class="btn btn-outline-danger btn-sm" @click="remove(vi)" :disabled="variant.status === 'delete'"><i class="bi bi-x"></i></button></td>
	</tr>
</template>
