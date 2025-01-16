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
	props: ['variant', 'decorators', 'editable'],
	inject: ['logo'],
	computed: {

	},
	methods: {

	}
}
</script>
<template>
	<div class="row align-items-center">

		<div class="col text-center">
			<div v-if="variant.image !== ''">
				<a :href="variant.image" target="_blank"><img :class="contrast ? 'bg-secondary p-2' : 'p-2'" :src="variant.image" alt="" width="200"></a>
			</div>
			<div v-else>
				IMAGE MISSING
			</div>
			<a class="btn btn-sm btn-outline-secondary mt-3" @click="contrast = !contrast">Toggle BG</a>
		</div>

		<div class="col">
			<div class="bg-light p-2">

				<div>Color count: {{ variant.data.color_count }}</div>
				<div>Thread count: {{ variant.data.thread_count }}</div>
				<div>
					Decorators:
					<span>{{ variant.allowed_decorators.join(', ') }}</span>
				</div>

				<div class="mt-2" v-if="editable">
					<Modal :id="'upload-variant-assets--'+variant.handle" :title="`Manage Assets (${variant.types.join(', ')})`"  :icon="''" :buttonClasses="'btn btn-outline-primary'" :buttonText="'Edit'">
						<Edit :variant="variant" :decorators="decorators" />
					</Modal>
				</div>

			</div>
		</div>
	</div>
</template>