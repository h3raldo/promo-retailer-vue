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
	props: ['variant', 'decorators', 'edit', 'apply_type'],
	inject: ['logo', 'assets'],
	computed: {
		apply_types(){
			return entity.logo.variant.types;
		},
		typeAssets(){
			if( !this.assets ) return [];
			return this.assets[this.apply_type];
		},
		webVersion(){
			if( this.variant.url ) return this.variant.url;

			console.log('no url!');
			if( !this.typeAssets ) return '';
			let web_asset = this.typeAssets.filter( i => i.file === 'web.png' )[0];
			if( web_asset.length < 1 ) return '';
			return web_asset['url'];
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
				this.variant.url = image.url;
			})
			// @todo: on web upload, force a save
		}
	}
}
</script>
<template>

	<Tabs :labels="tabs">

		<template #Info>

			<div class="mb-2">
				<label class="form-label">ID:</label>
				<input type="text" class="form-control" placeholder="ID" v-model="variant.uid" disabled>
			</div>
			<div class="mb-2 d-none">
				<label class="form-label">Applies To:</label>
				<select class="form-select" v-model="variant.apply_to">
					<option v-for="type in apply_types" :value="type">{{ type }}</option>
				</select>
			</div>
			<div class="mb-2">
				<label class="form-label">Color Count:</label>
				<input type="number" class="form-control" placeholder="Color Count" v-model="variant.color_count">
			</div>
			<div class="mb-2">
				<label class="form-label">thread_count:</label>
				<input type="number" class="form-control" placeholder="thread_count" v-model="variant.thread_count">
			</div>

		</template>

		<template #Decorators>
			<div v-for="decorator in decorators">
				<label class="form-check-label bg-gray px-2 rounded small">
					<input class="form-check-input me-1" type="checkbox" v-model="variant.decorators" :value="decorator.handle">
					<span>{{ decorator.name }}</span>
				</label>
			</div>
		</template>

		<template #Assets>

			<p class="fw-bold">Web Version:</p>
			<div class="row align-items-center">
				<div class="col">
					<div v-if="!webVersion">No current web version</div>
					<div v-else class="p-3 text-center">
						<img :src="webVersion" loading="lazy" width="300">
					</div>
				</div>
				<div class="col">
					<details class="bg-light p-2">
						<summary>Upload/Change Web Version</summary>
						<div class="mt-2">
							<Upload :onUpload="onUploadWeb" :logo_id="logo.id" :type="apply_type" :forcedName="'web'" />
						</div>
					</details>
				</div>
			</div>

			<hr>
			<p class="fw-bold">Assets: </p>
			<ul>
				<li v-for="asset in typeAssets"><a :href="asset.url" target="_blank">{{asset.file}}</a></li>
			</ul>

			<details class="bg-light p-2">
				<summary>Upload New Asset</summary>
				<div class="mt-2">
					<Upload :onUpload="onUpload" :logo_id="logo.id" :type="apply_type" />
				</div>
			</details>

		</template>
	</Tabs>

</template>