<script setup>
import Tabs from "@/components/globals/Tabs.vue";
import Upload from "@/Views/Logos/Logo/Variant/Upload.vue";
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data(){
		return {
			tabs: ['Info', 'Decorators', 'Assets'],
			bg_class: '',
			adding_custom: false,
			custom_type: '',
		}
	},
	props: ['variant', 'decorators', 'edit'],
	inject: ['logo'],
	computed: {
		apply_types(){
			return entity.logo.variant.types;
		},
		typeAssets(){
			if( !this.variant.assets ) this.variant.assets = [];
			return this.variant.assets;
		},
		custom_types(){
			return this.variant.types.filter( t => this.apply_types.indexOf( t ) === -1 );
		}
	},
	methods: {
		selectAllDecorators(){
			this.decorators.forEach( d => {
				this.variant.allowed_decorators.push( d.handle );
			})
		},
		onUpload( response ){
			response.images.forEach( image => {
				this.typeAssets.push( image )
			})
		},
		onUploadWeb( response ){
			response.images.forEach( image => {
				this.typeAssets.push( image );
				this.variant.image = image.url;
				this.variant.handle = response.web_file.handle;
				this.variant.image_cloudinary = response.web_file.cloudinary_url;
			})
			// @todo: on web upload, force a save because once web.png is uploaded, it needs to save that it belongs to that variant
		},
		addCustomLabel()
		{
			this.variant.types.push( this.custom_type );
			this.adding_custom = false;
			this.custom_type = '';
		}
	}
}
</script>
<template>

	<Tabs :labels="tabs">

		<template #Info>
			<div class="mb-2 col-6">
				<label class="form-label">ID:</label>
				<input type="text" class="form-control" placeholder="ID" v-model="variant.id" disabled>
			</div>

			<div class="mb-2">
				<label class="form-label d-block">Logo Type:</label>

				<label v-for="type in apply_types" class="form-check-label bg-gray px-2 rounded small">
					<input class="form-check-input me-1" type="checkbox" :value="type" v-model="variant.types">
					<span>{{ type }}</span>
				</label>

				<label v-for="type in custom_types" class="form-check-label bg-gray px-2 rounded small">
					<input class="form-check-input me-1" type="checkbox" :value="type" v-model="variant.types">
					<span>{{ type }}</span>
				</label>

				<button v-if="!adding_custom" class="btn btn-sm btn-outline-primary" @click="adding_custom = true">Add Custom</button>
				<div v-if="adding_custom" class="d-flex gap-2">
					<input type="text" class="form-control form-control-sm" placeholder="Custom Type" v-model="custom_type">
					<button class="btn btn-sm btn-outline-primary" @click="addCustomLabel">Add</button>
				</div>
			</div>
			<div class="mb-2 col-6">
				<label class="form-label">Color Count:</label>
				<input type="number" class="form-control" placeholder="Color Count" v-model="variant.data.color_count">
			</div>
			<div class="mb-2 col-6">
				<label class="form-label">thread_count:</label>
				<input type="number" class="form-control" placeholder="thread_count" v-model="variant.data.thread_count">
			</div>

		</template>

		<template #Decorators>
			<div class="mb-2">
				<button class="btn btn-outline-primary" @click="selectAllDecorators">Select All</button>
			</div>
			<div v-for="decorator in decorators">
				<label class="form-check-label bg-gray px-2 rounded small">
					<input class="form-check-input me-1" type="checkbox" v-model="variant.allowed_decorators" :value="decorator.handle">
					<span>{{ decorator.name }} :{{ decorator.handle }}</span>
				</label>
			</div>
		</template>

		<template #Assets>

			<div class="d-flex align-items-center gap-4">
				<p class="fw-bold mb-0">Web Version:</p>
				<div>
					<button class="btn btn-outline-secondary btn-sm" @click="bg_class = (!bg_class ? 'bg-secondary' : '')">Toggle BG</button>
				</div>
			</div>

			<div class="row align-items-center">
				<div class="col" :class="bg_class">
					<div v-if="!variant.image" class="text-center">No current web version</div>
					<div v-else class="p-3 text-center">
						<img :src="variant.image" loading="lazy" width="300">
					</div>
				</div>
				<div class="col">
					<div class="bg-light p-4">
						<h6 class="border-bottom pb-3 mb-3 text-center">Upload New Primary Image</h6>
						<div class="mt-2">
							<Upload :onUpload="onUploadWeb" :logo_id="logo.id" :variant_id="variant.id" :isWeb="true" />
						</div>
					</div>
				</div>
			</div>

			<br>
			<hr>
			<br>

			<div class="row">
				<div class="col">
					<p class="fw-bold">Assets: </p>
					<ul>
						<li v-for="asset in typeAssets"><a :href="asset.url" target="_blank">{{asset.file}}</a></li>
					</ul>
				</div>
				<div class="col">
					<div class="bg-light p-3">
						<h6 class="border-bottom pb-3 mb-3 text-center">Upload New Asset</h6>
						<div class="mt-2">
							<Upload :onUpload="onUpload" :logo_id="logo.id" :variant_id="variant.id" />
						</div>
					</div>
				</div>
			</div>

		</template>
	</Tabs>

</template>