<script setup>
import Email from "@/Views/Config/Section/Email.vue";
import Categories from "@/Views/Config/Section/Categories.vue";
import Decorations from "@/Views/Config/Section/Decorations.vue";
</script>
<script>
import utils from "@/js/utils.js";
	export default {
		data(){
			return {
				id: this.$route.params.section,
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

	<div class="text-end pb-3 bg-gray p-3 mb-4 d-flex justify-content-between align-items-center">
		<h3 class="m-0"><i class="bi bi-person"></i> Config</h3>
		<button class="btn btn-outline-secondary p-3" @click="goToSection('')">View All</button>
	</div>

	<div v-if="section">
		<Email v-if="id === 'email'" />
		<Categories v-if="id === 'categories'" />
		<Decorations v-if="id === 'decorations'" />
	</div>

	<div v-else>
		<div>
			<h5>Email Settings</h5>
			<p>Approval email template</p>
			<button class="btn btn-primary" @click="goToSection('email')">Email Settings</button>
		</div>

		<hr>

		<div>
			<h5>Global Categories</h5>
			<p>Categories used globally for all products.</p>
			<button class="btn btn-primary" @click="goToSection('categories')">Edit Categories</button>
		</div>

		<hr>

		<div>
			<h5>Decorations</h5>
			<p>Global decoration settings</p>
			<button class="btn btn-primary" @click="goToSection('decorations')">Edit Decorations</button>
		</div>
	</div>

</template>