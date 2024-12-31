<script>
import Grid from "@/components/globals/Grid.vue";
import Search from "@/Views/Decorators/Search.vue";

export default {
	name: 'Decorators',
	components: {Search, Grid},
	data(){
		return {
			loading: false,
			columns: {
				'ID': { id: 'id' },
				'Status': { },
				'Name': { id: 'name' },
				'Type': { id: 'type' },
				'Handle': { id: 'handle' },
			},
		}
	},
	inject: ['symfony', 'search'],
	computed: {
		searchState(){
			return this.search.decorators;
		},
	},
	methods: {
		viewSingle( id ){
			this.$router.push( this.symfony.views.decorators_decorator.replace(':id', id) )
		},
	},
	created() {
		if( typeof this.search.decorators === 'undefined' ) this.search.decorators = {}
	},
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"><i class="bi bi-brush"></i> Decorators</h3>
		</div>
		<button class="btn btn-primary p-3" disabled><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<Grid :api="symfony.api.decorators.search" :columns="columns" :searchState="searchState" :entity="'decorator'">
		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">
			<td @click="viewSingle(item.id)">{{ item.id }}</td>
			<td @click="viewSingle(item.id)">
				{{ item.status }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.name }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.type }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.handle }}
			</td>
			<td @click="viewSingle(item.id)">

			</td>
		</template>
	</Grid>

</template>
