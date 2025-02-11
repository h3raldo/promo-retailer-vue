<script setup>
import Upload from "@/Views/Logos/Logo/Variant/Upload.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Edit from "@/Views/Logos/Logo/Variant/Edit.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

export default {
	data(){
		return {
			contrast: false,
			confirmedDelete: false,
			loading: false,
		}
	},
	props: ['variant', 'decorators', 'editable', 'index'],
	inject: ['logo', 'alert', 'symfony'],
	computed: {

	},
	methods: {
		removeVariant(){
			let self = this;

			utils.ajax( self.symfony.api.logos.logo.variant.delete.replace(':id', self.variant.id), (r)=>{
				if( r.error && r.error === true ){
					self.alert('Error deleting variant', 'danger');
					return;
				}

				self.logo.variants.splice( self.index, 1 );
			})

		}
	}
}
</script>
<template>

	<div class="bg-light border p-3 mb-2 d-flex flex-column" style="height: 100%">
		<div class="flex-fill">
			<h3 class="text-center"><span class="badge text-bg-primary">{{ variant.types.join(', ') }}</span></h3>
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
							<Modal :id="'upload-variant-assets--'+variant.id" :title="`Manage Assets (${variant.types.join(', ')})`"  :icon="''" :buttonClasses="'btn btn-outline-primary'" :buttonText="'Edit'">
								<Edit :variant="variant" :decorators="decorators" />
							</Modal>
						</div>

					</div>
				</div>
			</div>
		</div>
		<div class="text-center" v-if="editable">
			<button v-if="!confirmedDelete" class="btn btn-outline-danger" @click="confirmedDelete = true"><i class="bi bi-trash"></i> Delete</button>
			<button v-else class="btn btn-danger" @click="removeVariant" :disabled="loading"><i class="bi bi-trash"></i> Confirm Delete?</button>
		</div>
	</div>

</template>