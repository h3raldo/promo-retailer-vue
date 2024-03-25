<script setup>
import ListEditorItem from "@/ViewComponents/Quotes/Quote/globals/item/ListEditorItem.vue";
</script>

<script>
import {toRaw} from "vue";
export default {
	data() {
		return {}
	},

	props: ['list', 'textAttributes', 'newItem', 'minimum', 'deleted', 'editedName'],

	methods: {
		add(){
			this.list.push( this.newItem() );
		},
		remove(index) {
			if( this.deleted ) this.deleted(JSON.parse(JSON.stringify(toRaw(this.list[index]))));
			this.list.splice(index, 1);
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

	<ListEditorItem v-for="(item, i) in list" :item="item" :itemIndex="i" :textAttributes="textAttributes" :editedName="editedName" :remove="remove" :isRemovable="isRemovable(i)" />

	<div class="pt-2">
		<button class="btn btn-primary" @click="add"><i class="bi bi-plus-square"></i> Add</button>
	</div>

</template>

<style scoped>

</style>