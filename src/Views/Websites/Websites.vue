<script setup>
import Grid from "@/components/globals/Grid.vue";
import Search from "@/Views/Websites/Search.vue";
import Status from "@/components/globals/Grid/Status.vue";
import EntityDelete from "@/EntityComponents/Entity/EntityDelete.vue";
import EntityDuplicate from "@/EntityComponents/Entity/EntityDuplicate.vue";
</script>

<script>

export default {
	name: 'Websites',
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
		afterDelete( response ){
			this.$refs.grid.getEntities()
		}
	},
	created() {
		if( typeof this.search.websites === 'undefined' ) this.search.websites = {}
	},
	emits: ['entityDeleted'],
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"><i class="bi bi-columns"></i> Websites</h3>
		</div>
	</div>

	<Grid :api="symfony.api.websites.search" :columns="columns" :searchState="searchState" :entity="'website'" ref="grid">
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
			<td class="d-flex gap-2">
				<EntityDuplicate :id="item.id" entity="website" :callback="afterDelete" />
				<EntityDelete :id="item.id" entity="website" :callback="afterDelete" />
			</td>
		</template>
	</Grid>

</template>
