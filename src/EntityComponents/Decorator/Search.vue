<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import SearchForm from "@/EntityComponents/Decorator/Search.Form.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			loading: false,
			query: '',
			results: []
		}
	},
	inject: ['symfony'],
	props: ['onSelect', 'buttonText', 'buttonIcon', 'type', 'size'],
	computed: {
		getType(){
			if( typeof this.type === 'undefined' ) return 'modal';
			return this.type;
		},
		buttonSize(){
			if( !this.size ) return ''

			return ' ' + this.size
		}
	},
	methods: {
		selected( decorator ){
			this.onSelect(decorator)

			if( this.getType === 'modal' )
				this.$refs.modal.$refs.closeModalButton.click();
		}
	}
}
</script>
<template>

	<template v-if="getType === 'modal'">
		<Modal :id="'decorator-search'" :title="'Search Decorators'" :buttonText="buttonText" :icon="buttonIcon" :buttonClasses="'btn btn-primary' + buttonSize" ref="modal">
			<SearchForm :selected="selected" />
		</Modal>
	</template>
	<template v-else-if="getType === 'details'">
		<details>
			<summary>Search</summary>
			<SearchForm :selected="selected" />
		</details>
	</template>
	<template v-else>
		<SearchForm :selected="selected" />
	</template>

</template>