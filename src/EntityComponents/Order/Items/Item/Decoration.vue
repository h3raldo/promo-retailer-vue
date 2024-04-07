<script setup>
import Decorator from "@/EntityComponents/Order/Items/Item/Decoration/Decorator.vue";
</script>

<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			addingDecorators: false
		}
	},

	props: [],

	inject: ['item', 'itemIndex', 'decorators'],

	computed: {
		buttonText() {
			return this.addingDecorators ? 'x Close Prismic Decorators' : '+ Add Prismic Decorators';
		},
		buttonClasses() {
			return this.addingDecorators ? 'btn btn-primary btn-sm' : 'btn btn-outline-primary btn-sm';
		}
	},

	methods: {
		addDecoratorsOption(sheet, decorator, e) {
			entity.order.item.decoration.addDecoratorSheet(sheet, decorator, this.item);
			e.target.disabled = true;
		},
		removeDecorator(index){
			this.item.decoration.available.splice(index, 1);
		}
	},
}
</script>

<template>
	<div>

		<div v-for="decorator in item.decoration.available" class="item-option py-3 border-bottom">
			<Decorator :decorator="decorator" :remove="removeDecorator" />
		</div>

		<br>

		<button :class="buttonClasses" @click="addingDecorators = !addingDecorators">{{ buttonText }}</button>

		<div v-if="addingDecorators" class="pt-4">
			<div v-for="prismicDecorator in decorators" class="border-bottom col-6">
				<details>
					<summary class="py-2">{{ prismicDecorator.name }} - ({{ prismicDecorator.type }})</summary>
					<div v-for="sheet in prismicDecorator.unit" class="py-2 d-flex align-items-center gap-2 border-top ps-2">
						<span>
							<button class="btn btn-primary btn-sm"
									@click="addDecoratorsOption( sheet, prismicDecorator, $event )">Add</button>
						</span>
						<span>
							{{ entity.order.item.decoration.getPriceSheetName((sheet)) }}
						</span>
					</div>
				</details>
			</div>
		</div>

	</div>
</template>