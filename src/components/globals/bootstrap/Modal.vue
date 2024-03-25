<script setup>
</script>

<script>
export default {

	data() {
		return {

		}
	},

	inject: [],

	computed: {

	},

	props: ['id', 'title', 'buttonText', 'buttonClasses', 'buttonType', 'icon'],

	methods: {

	},

	mounted() {

	}
}
</script>

<template>

	<template v-if="buttonType === 'link'">
		<a href="#" data-bs-toggle="modal" :data-bs-target="'#'+id" ref="openModalButton">
			<i v-if="icon && icon.length > 0" :class="'bi '+ icon"></i> {{ buttonText }}
		</a>
	</template>
	<template v-else>
		<button type="button" :class="buttonClasses" data-bs-toggle="modal" :data-bs-target="'#'+id" ref="openModalButton">
			<i v-if="icon && icon.length > 0" :class="'bi '+ icon"></i>
			{{ buttonText }}
		</button>
	</template>


	<div class="modal modal-xl fade text-start" :id="id" tabindex="-1" ref="modal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="search_modalLabel">{{ title }}</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>

				<div class="modal-body">
					<slot></slot>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeModalButton">Close</button>
				</div>
			</div>
		</div>
	</div>

</template>