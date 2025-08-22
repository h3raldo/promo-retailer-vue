<script>
import Grid from "@/components/globals/Grid.vue";
import Search from "@/Views/Decorators/Search.vue";
import utils from "@/js/utils.js";
import Modal from "@/components/globals/bootstrap/Modal.vue";

export default {
	name: 'Decorators',
	components: {Modal, Search, Grid},
	data(){
		return {
			loading: false,
			columns: {
				'ID': { id: 'id' },
				'Status': { },
				'Name': { id: 'name' },
				'Type': { id: 'type' },
				'Company': {  },
				'Handle': { id: 'handle' },
			},
		}
	},
	inject: ['symfony', 'search', 'alert'],
	computed: {
		searchState(){
			return this.search.decorators;
		},
	},
	methods: {
		viewSingle( id ){
			this.$router.push( this.symfony.views.decorators_decorator.replace(':id', id) )
		},
		async createNew(){
			this.loading = true;
			let r = await utils.ajaxAsync( this.symfony.api.entity.create, {
				type: 'decorator',
			});
			this.loading = false;

			if( r.error || !r.entity?.id ) {
				this.alert( r.message, 'danger');
				return;
			}

			this.viewSingle( r.entity.id );
		},
		async deleteEntity( id )
		{
			this.loading = true;
			let r = await utils.ajaxAsync( this.symfony.api.entity.delete, {
				id,
				type: 'decorator',
			}, 'DELETE');
			this.loading = false;

			if( r.error ) {
				this.alert( r.message, 'danger');
				return;
			}

			this.alert( r.message );
			this.$refs.grid.getEntities();
			this.$refs['deleteEntity-'+id].$refs.openModalButton.click();
		}
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
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<Grid :api="symfony.api.decorators.search" :columns="columns" :searchState="searchState" :entity="'decorator'" ref="grid">
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
				{{ item.company.name }}
			</td>
			<td @click="viewSingle(item.id)">
				{{ item.handle }}
			</td>
			<td>
				<Modal :id="'deleteEntity-'+item.id" title="Are you sure?"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'" :ref="'deleteEntity-'+item.id">
					<p>Will be deleted permanently. Cannot be undone.</p>
					<button class="btn btn-danger" @click="deleteEntity(item.id)">Yes, Delete - Decorator (ID: {{item.id}})</button>
				</Modal>
			</td>
		</template>
	</Grid>

</template>
