<script setup>
import Option from "@/EntityComponents/Order/Items/Item/Options/Option.vue";
</script>

<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			addingDecorators: false
		}
	},

	inject: ['item', 'itemIndex'],

	watch: {

	},

	computed: {

	},

	methods: {
		removeOption(i) {
			let option = this.item.options[i];
			this.item.subitems.forEach( subitem => {
				if( typeof subitem.options[option.name] === 'object' ) delete subitem.options[option.name]
			})
			this.item.options.splice(i, 1);
		},
		addOption() {
			this.item.options.push( entity.order.item.option.create(true) )
		}
	}
}
</script>

<template>
	<div>
		<Option v-for="(option, i) in item.options" :option="option" :optionIndex="i" :removeOption="removeOption" />

		<div class="mb-1 pt-4 d-flex">
			<div>
				<button class="btn btn-primary btn-sm" @click="addOption">+ Add Option</button>
			</div>
		</div>
	</div>
</template>