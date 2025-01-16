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
		}
	},
	methods: {
		onUpload( response ){
			response.images.forEach( image => {
				this.typeAssets.push( image )
			})
		},
		onUploadWeb( response ){
			response.images.forEach( image => {
				this.typeAssets.push( image );
				this.variant.image = image.url;
			})
			// @todo: on web upload, force a save because once web.png is uploaded, it needs to save that it belongs to that variant
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
			<div v-for="decorator in decorators">
				<label class="form-check-label bg-gray px-2 rounded small">
					<input class="form-check-input me-1" type="checkbox" v-model="variant.allowed_decorators" :value="decorator.handle">
					<span>{{ decorator.name }}</span>
				</label>
			</div>
		</template>

		<template #Assets>

			<p class="fw-bold">Web Version:</p>
			<div class="row align-items-center">
				<div class="col">
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