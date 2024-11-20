<script setup>
import Item from "@/Views/Websites/Website/Preview/Items/Item.vue";
</script>

<script>
export default {
	data(){
		return {
			data: {}
		}
	},
	props: ['skus_with_decorations', 'placement_keys'],
}
</script>

<template>
	<table class="table table-striped">
		<thead>
		<tr>
			<th scope="col" class="col-1">Group</th>
			<th scope="col" class="col-3">Title</th>
			<th scope="col" class="col-1">Color</th>
			<th scope="col" class="col-2">Decoration Set</th>
			<th scope="col" class="col-4">Options</th>
			<th scope="col" class="col-1"></th>
		</tr>
		</thead>
		<tbody>
			<Item v-for="sku in skus_with_decorations" :sku="sku" :placement_keys="placement_keys" />
		</tbody>
	</table>
</template>