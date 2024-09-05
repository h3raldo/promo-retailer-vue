<script setup>
import Tiers from "@/EntityComponents/Order/globals/cost/Tiers.vue";
</script>

<script>
export default {
	data() {
		return {
			oldName: '',
			editPricing: false,
		}
	},

	props: ['item', 'itemIndex', 'textAttributes', 'editedName', 'remove', 'move', 'isRemovable'],

	methods: {
		edit(e, attribute){
			let newName = e.target.value;

			if( attribute === 'name' && this.editedName ) this.editedName(this.oldName, newName);
			this.item[attribute] = newName;
			this.oldName = newName;
		},
		clearTiers(){
			this.item.cost.length = 0;
		}
	},

	mounted(){
		if( this.item.name ) this.oldName = this.item.name;
	}
}
</script>

<template>
	<div>
		<div class="d-flex gap-3 align-items-center pb-2">
			<div class="col-2 text-center d-flex gap-2 justify-content-center">
				<button v-if="item.cost" class="btn btn-outline-primary" @click="editPricing = !editPricing" ><i class="bi bi-pencil-square"></i></button>

				<button class="btn btn-outline-secondary" @click="move(itemIndex, 'up')"><i class="bi bi-arrow-up"></i></button>
				<button class="btn btn-outline-secondary" @click="move(itemIndex, 'down')"><i class="bi bi-arrow-down"></i></button>
			</div>
			<div v-for="attribute in textAttributes" class="flex-fill">
				<div class="form-floating">
					<input type="text" class="form-control" :placeholder="attribute" :value="item[attribute]" @input="edit($event, attribute)" />
					<label>{{ attribute }}</label>
				</div>
			</div>
			<div class="col-2 text-center d-flex gap-2 justify-content-center">
				<button class="btn btn-outline-danger" @click="clearTiers" ><i class="bi bi-x-circle"></i> <i class="bi bi-cash-stack"></i></button>
				<button v-if="isRemovable" class="btn btn-outline-danger" @click="remove(itemIndex)" ><i class="bi bi-trash"></i></button>
			</div>
		</div>
		<div v-if="editPricing" class="pb-3 d-flex gap-3">
			<div class="col-1"></div>
			<div class="flex-fill p2">
				<Tiers :tiers="item.cost" />
			</div>
			<div class="col-1"></div>
		</div>
	</div>

</template>