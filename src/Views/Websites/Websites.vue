<script>
import Grid from "@/components/globals/Grid.vue";
import Search from "@/Views/Websites/Search.vue";
import Status from "@/components/globals/Grid/Status.vue";

export default {
	name: 'Websites',
	components: {Search, Grid, Status},
	data(){
		return {
			loading: false,
			columns: {
				'ID': { id: 'id' },
				'Status': { id: 'status' },
				'Name': { id: 'name' },
				'Subdomain': { id: 'handle' },
			},
		}
	},
	inject: ['symfony', 'search'],
	computed: {
		searchState(){
			return this.search.websites;
		},
	},
	methods: {
		viewSingle( id ){
			this.$router.push( this.symfony.views.websites_website.replace(':id', id) )
		},
	},
	created() {
		if( typeof this.search.websites === 'undefined' ) this.search.websites = {}
	},
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"><i class="bi bi-columns"></i> Websites</h3>
		</div>
		<button class="btn btn-primary p-3" disabled><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<Grid :api="symfony.api.websites.search" :columns="columns" :searchState="searchState" :entity="'website'">
		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState" />
		</template>

		<template #item="{item}">
			<td @click="viewSingle(item.id)">{{ item.id }}</td>
			<td @click="viewSingle(item.id)">
				<Status :status="item.status" />
			</td>
			<td @click="viewSingle(item.id)">
				<span v-if="item.parent.id" class="text-secondary">{{ item.parent.name }} <i class="bi bi-chevron-double-right"></i> </span>
				{{ item.name }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.handle }}
			</td>
			<td @click="viewSingle(item.id)">

			</td>
		</template>
	</Grid>

</template>
