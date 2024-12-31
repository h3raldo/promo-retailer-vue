<script setup>
import Upload from "@/Views/Logos/Logo/Variant/Upload.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Edit from "@/Views/Logos/Logo/Variant/Edit.vue";
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data(){
		return {
			contrast: false,
		}
	},
	props: ['variant', 'decorators', 'apply_type', 'editable'],
	inject: ['logo', 'assets'],
	computed: {
		apply_types(){
			return entity.logo.variant.types;
		},
		typeAssets(){
			if( !this.assets ) return;
			return this.assets[this.apply_type];
		},
		webVersion(){
			if( !this.typeAssets ) return '';

			return this.typeAssets.filter( i => i.file === 'web.png' )[0];
		}
	},
	methods: {

	}
}
</script>
<template>
	<div class="row align-items-center">

		<div class="col text-center">
			<div v-if="variant.url !== ''">
				<a :href="variant.url" target="_blank"><img :class="contrast ? 'bg-secondary p-2' : 'p-2'" :src="variant.url" alt="" width="200"></a>
			</div>
			<div v-else>
				IMAGE MISSING
			</div>
			<a class="btn btn-sm btn-outline-secondary mt-3" @click="contrast = !contrast">Toggle BG</a>
		</div>

		<div class="col">
			<div class="bg-light p-2">

				<div>Color count: {{ variant.color_count }}</div>
				<div>Thread count: {{ variant.thread_count }}</div>
				<div>
					Decorators:
					<span v-for="(decorator) in variant.decorators">{{ decorator }}, </span>
				</div>

				<div class="mt-2" v-if="editable">
					<Modal :id="'upload-variant-assets--'+variant.uid" :title="`Manage Assets (${variant.apply_to})`"  :icon="''" :buttonClasses="'btn btn-outline-primary'" :buttonText="'Edit'">
						<Edit :variant="variant" :decorators="decorators" :apply_type="variant.apply_to" />
					</Modal>
				</div>

			</div>
		</div>
	</div>
</template>