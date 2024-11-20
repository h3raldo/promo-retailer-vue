<script setup>
import VariantsVariant from "@/Views/Logos/Logo/Variants.Variant.vue";
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data(){
		return {
			edit: false
		}
	},
	computed: {
		apply_types(){
			return entity.logo.variant.types;
		}
	},
	props: ['variants', 'editable', 'decorators'],
}
</script>
<template>

	<div v-if="editable && !edit" class="mb-3">
		<button class="btn btn-sm btn-outline-primary" @click="edit = !edit">Edit Variants</button>
	</div>

	<div v-if="editable && edit" class="mb-3">
		<button class="btn btn-success" @click="edit = false">Done</button>
	</div>

	<div class="row">
		<template v-for="apply_type in apply_types">
			<template v-if="variants[apply_type]">
				<VariantsVariant :variant="variants[apply_type]" :decorators="decorators" :edit="edit" />
			</template>
			<template v-else-if="edit">
				<p>No Logo for {{ apply_type }}</p>
			</template>
		</template>
	</div>
</template>