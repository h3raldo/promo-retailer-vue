<script setup>
import Loader from "@/components/globals/Loader.vue";
import Tabs from "@/components/globals/Tabs.vue";
import Search from "@/Views/Companies/Search.vue";
import Grid from "@/components/globals/Grid.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			loading: false,
			type: 'client',
			columns: {
				'ID': { id: 'id' },
				'Type': { id: 'type' },
				'Name': { id: 'name' },
				'QB ID': { },
				'Supplier': { },
				'Decorator': { },
			},
		}
	},
	inject: ['symfony', 'alert', 'search'],
	computed: {
		searchState(){
			return this.search.companies;
		},
	},
	methods: {
		goToCompany(id) {
			this.$router.push(this.symfony.views.companies_company.replace(':id', id))
		},
	},
	created() {
		if( typeof this.search.companies === 'undefined' ) this.search.companies = { urlParams: 'type=client' }
	},
}
</script>

<template>

	<Grid :columns="columns" :searchState="searchState" :api="symfony.api.companies.search" :entity="'company'">
		<template #header="{search}">
			<Search :getEntities="search" :searchParams="searchState"></Search>
		</template>
		<template #item="{item}">

			<td @click="goToCompany(item.id)">{{ item.id }}</td>

			<td @click="goToCompany(item.id)">
				<span v-if="item.type" class="badge text-bg-success text-end">{{ item.type }}</span>
				<span v-else class="badge text-bg-secondary text-end">default</span>
			</td>

			<td @click="goToCompany(item.id)">
				<span v-if="item.parent_name" class="badge text-bg-secondary">{{ item.parent_name }}</span>
				{{ item.name }}
			</td>

			<td @click="goToCompany(item.id)" class="text-center">
				<span v-if="item.data && item.data.external && item.data.external.quickbooks.id">
					<i class="text-success bi bi-check-square-fill"></i>
				</span>
			</td>

			<td @click="goToCompany(item.id)">
				<span v-if="item.type === 'vendor'" class="text-center">
					<span v-if="item.data && item.data.type && item.data.type.supplier">
						<i class="bi bi-check-square-fill"></i>
					</span>
				</span>
			</td>

			<td @click="goToCompany(item.id)">
				<span v-if="item.type === 'vendor'" class="text-center">
					<span v-if="item.data && item.data.type && item.data.type.decorator">
						<i class="bi bi-check-square-fill"></i>
					</span>
				</span>
			</td>
			<td @click="goToCompany(item.id)"></td>
		</template>
	</Grid>

</template>