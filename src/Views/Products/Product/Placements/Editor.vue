<script setup>
import Placement from "@/Views/Products/Product/Placements/Editor/Placement.vue";
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			sku: 'ZLBPEWT',
			loading: {
				locations: false,
				remote: false,
				groups: false,
			},
			saving: false,
			selected: {
				image_type: 'front-flat',
				image: {},
				variation: {},
				variation_specific: false,
			},
			available: {
				placements: {},
				groups: [],
			},
			remote: {
				exists: false,
				data: {}
			},
			mouse: {
				down: false,
				started: false,
				start: {x: 0, y: 0},
				end: { x: 0, y: 0 },
				placement: false,
				initiated: false
			}
		}
	},
	computed: {
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
		availablePlacements() {
			let available = this.available.placements[this.selected.image.type];
			if( !available ) return [];

			return available

		},
		selectedImage(){
			if( !this.selected.variation ) return '';

			let self = this;
			return this.selected.variation.images.filter( i => i.type === self.selected.image.type )[0].url;
		},
		hasTemplates(){
			return Object.keys(this.remote.data).length > 0
		},
		selectedVariationColor(){
			if( !this.selected.variation  ) return '';
			return utils.entity.product.vendorColorToSlug( this.selected.variation.color );
		}
	},
	inject: ['product', 'variants', 'symfony', 'alert'],
	props: [],
	methods: {
		savePlacements(){
			let self = this;
			this.saving = true;

			let url = this.symfony.api.products.product.placements.push.replace(':product', this.product.id);

			function onSuccess( r ){
				self.saving = false;
				self.alert('Templates Pushed');
			}
			function onError( e ){
				self.saving = false;
				self.alert('Templates Push Error', 'danger', e);
			}

			utils.ajax( url, onSuccess, onError, self.remote.data )
		},
		getCurrentPlacements()
		{
			if( this.remote.data.children && this.remote.data.children[this.selectedVariationColor])
			{
				this.selected.variation_specific = true;
				return this.remote.data.children[this.selectedVariationColor];
			}

			return this.remote.data;
		},
		getPlacementLocation(placement_id)
		{
			let p_data = this.getCurrentPlacements();

			if( !p_data[placement_id] || !p_data[placement_id][this.selected.image.type] ) return false;

			return p_data[placement_id][this.selected.image.type];
		},
		setupNewLocation( placement_id )
		{
			let st_placements = this.getCurrentPlacements();

			if( !st_placements[placement_id] )
				st_placements[placement_id] = {}

			if( !st_placements[placement_id][this.selected.image.type] )
				st_placements[placement_id][this.selected.image.type] = {
					top: 0,
					left: 0,
					rotation: 0,
					width: 50,
					height: 50
				}

			return st_placements[placement_id][this.selected.image.type];
		},
		deletePlacement( placement_id )
		{
			delete this.remote.data[placement_id][this.selected.image.type]

			if( !Object.keys(this.remote.data[placement_id]).length )
				delete this.remote.data[placement_id];
		},
		copyToVariationSpecific()
		{
			entity.product.placement.editor.variation.createPlacements( this.remote.data, this.selectedVariationColor )
			this.selected.variation_specific = true;
		},
		getGroupLocationInfo()
		{
			let self = this;

			self.loading.locations = true;
			utils.ajax( this.symfony.api.products.product.placements.get.replace(':group', this.product.data.info.decoration_group), r => {
				self.loading.locations = false;
				self.available.placements = r;
			}, () => {
				self.loading.remote = false;
			})
		}
	},

	watch: {
		'selected.variation'(){
			this.selected.variation_specific = !!(this.remote.data.children && this.remote.data.children[this.selectedVariationColor]);

			if( this.selected.variation && this.selected.variation.images.length ){
				this.selected.image = this.selected.variation.images[0];
			}
		},
		'product.data.info.decoration_group'(){
			this.getGroupLocationInfo();
		}
	},

	created(){
		if( !this.variants.length ) return;

		this.selected.variation = this.variants[0];

		if( this.product.template ){
			this.remote.exists = true;
			this.remote.data = this.product.template;
		}

		let self = this;

		self.loading.groups = true;
		utils.config.get.option('decorationGroups', r => {
			self.loading.groups = false;
			self.available.groups = r;
		})

		this.getGroupLocationInfo();
	},

	mounted(){
		if( this.mouse.initiated === true ) return;
		this.mouse.initiated = true;
	}
}
</script>
<template>

	<template v-if="availableVariants.length === 0">
		<h2>Product has no images.</h2>
	</template>
	<template v-else>

	<div class="bg-light border p-4 mb-5">

		<h2>
			<span v-if="!remote.exists" class="badge bg-primary">New</span>
			<span v-else class="badge bg-secondary">Existing</span>
		</h2>

		<div class="row">
			<div class="col">
				<div class="form-floating">
					<select class="form-select mb-2" v-model="selected.variation">
						<option v-for="variation in availableVariants" :value="variation">{{ variation.color }}</option>
					</select>
					<label class="form-label fw-bold">Color</label>
				</div>

				<button v-if="!selected.variation_specific" class="btn btn-outline-primary" @click="copyToVariationSpecific">Copy Group Placements to Variation</button>
				<span v-else class="badge bg-primary">Editing Variation Specific Placements</span>
			</div>
			<div class="col">
				<div class="form-floating">
					<select class="form-select" id="image-type" v-model="selected.image">
						<option v-for="image in selected.variation.images" :value="image">{{ image.type }}</option>
					</select>
					<label for="image-type" class="form-label fw-bold">Image</label>
				</div>
			</div>
			<div class="col">
				<div class="form-floating">
					<select class="form-select" v-model="product.data.info.decoration_group" :disabled="loading.locations || loading.groups">
						<option v-for="group in available.groups" :value="group.id">{{ group.name }}</option>
					</select>
					<label>Decoration Group</label>
				</div>
			</div>
			<div class="col">
				<button class="btn btn-success" @click="savePlacements" :disabled="saving || !hasTemplates"><i class="bi bi-cloud"></i> Save Template</button>
			</div>
		</div>
	</div>

	<div class="placements-container">

		<Loader v-if="loading.locations || loading.remote" />

		<div v-else class="placements">

			<div v-if="!availablePlacements.length">
				<h3 class="warning text-center">No placements set for this image type</h3>
			</div>

			<div v-else>

				<Placement v-for="placement in availablePlacements"
						   :location="placement"
						   :placement="getPlacementLocation(placement.id)"
						   :image="selectedImage"
						   :mouse="mouse"
						   :createPlacement="setupNewLocation"
						   :deletePlacement="deletePlacement"
				/>

			</div>
		</div>

	</div>

	</template>

</template>

<style>

	.display-none{
		display: none !important;
	}

	.logo-box{
		background: red url(https://cdn.promoretailer.com/web/icons/arrow-up.svg) no-repeat top center;
		background-size: contain;
		position: absolute;
		border: 2px dotted #000;
		transform-origin: center;
		cursor: grab;
	}

	.placement-row.is-new h2,
	.placement-row.is-new{
		color: #ccc;
	}

	.placement-row.is-new .test-logo{
		opacity: .5;
	}

	.placement-image-container{
		position: relative;
		width: 600px
	}

	.placement-image-container.loading{
		opacity: .5;
		background: #000;
	}

	.placement-image-container img{
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none;
	}

	.is-new .btn-clear-placement{
		display: none;
	}

	.state--is-new,
	.state--existing{
		display: none;
	}

	.cf-new .state--is-new,
	.cf-existing .state--existing{
		display: inline-block;
	}

</style>