<script setup>
import Email from "@/Views/Config/Section/Email.vue";
import Categories from "@/Views/Config/Section/Categories.vue";
import Decorations from "@/Views/Config/Section/Decorations.vue";
import Inputs from "@/Views/Config/Section/Inputs.vue";
import OrderTags from "@/Views/Config/Section/OrderTags.vue";
</script>
<script>
import utils from "@/js/utils.js";
	export default {
		data(){
			return {
				id: this.$route.params.section,
				settings: [
					{
						id: 'email',
						name: 'Email Settings',
						description: 'Approval email template',
					},
					{
						id: 'categories',
						name: 'Global Categories',
						description: 'Categories used globally for all products.',
					},
					{
						id: 'decorations',
						name: 'Decorations',
						description: 'Global decoration settings',
					},
					{
						id: 'inputs',
						name: 'Inputs',
						description: 'Global inputs used by websites.',
					},
					{
						id: 'tags',
						name: 'Order Tags',
						description: 'Global tags for sales orders.',
					}
				]
			}
		},
		computed: {
			section(){
				return this.id || false;
			}
		},
		inject: ['symfony', 'alert'],
		methods: {
			goToSection(section){
				if( section )
					this.$router.push( this.symfony.views.config_section.replace(':section', section) );

				this.id = section;
			}
		},
		mounted() {

		}
	}
</script>
<template>

	<div class="text-end bg-gray p-3 mb-4 d-flex gap-3 align-items-center">
		<div>
			<button v-if="id !== ''" class="btn btn-outline-secondary" @click="goToSection('')"><i class="bi bi-arrow-left"></i></button>
		</div>
		<h3 class="m-0"><i class="bi bi-gear"></i> Settings</h3>
	</div>

	<div v-if="section">
		<Email v-if="id === 'email'" />
		<Categories v-if="id === 'categories'" />
		<Decorations v-if="id === 'decorations'" />
		<Inputs v-if="id === 'inputs'" />
		<OrderTags v-if="id === 'tags'" />
	</div>

	<div v-else>
		<div v-for="s in settings" class="mb-3 border-bottom pb-4">
			<h5>{{ s.name }}</h5>
			<p>{{ s.description }}</p>
			<button class="btn btn-primary" @click="goToSection(s.id)">Edit {{ s.name }}</button>
		</div>
	</div>

</template>