<script setup>
import ListEditorItem from "@/EntityComponents/Order/globals/item/ListEditorItem.vue";
</script>

<script>
import {toRaw} from "vue";
export default {
	data() {
		return {}
	},

	props: ['list', 'textAttributes', 'newItem', 'minimum', 'deleted', 'editedName', 'addDefaults'],

	methods: {
		add(){
			this.list.push( this.newItem() );
		},
		remove(index) {
			if( this.deleted ) this.deleted(JSON.parse(JSON.stringify(toRaw(this.list[index]))));
			this.list.splice(index, 1);
		},

		move(fromIndex, direction) {
			let toIndex = fromIndex;

			switch (direction){
				case 'up':
					toIndex--;
					break;
				case 'down':
					toIndex++;
					break;
			}

			let element = this.list[fromIndex];
			this.list.splice(fromIndex, 1);
			this.list.splice(toIndex, 0, element);
		},

		isRemovable(index){
			if( this.list.length > this.minimum ) return true;

			index++;
			return ( index > this.minimum );
		}
	},
}
</script>

<template>

	<ListEditorItem v-for="(item, i) in list" :item="item" :itemIndex="i" :textAttributes="textAttributes" :editedName="editedName" :remove="remove" :move="move" :isRemovable="isRemovable(i)" />

	<div class="pt-2 d-flex gap-2">
		<button class="btn btn-primary" @click="add"><i class="bi bi-plus-square"></i> Add</button>
		<button v-if="addDefaults" class="btn btn-outline-primary" @click="addDefaults"><i class="bi bi-plus-square"></i> Add Defaults</button>
	</div>

</template>

<style scoped>

</style>