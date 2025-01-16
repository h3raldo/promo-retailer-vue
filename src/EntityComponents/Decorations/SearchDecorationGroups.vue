<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			groups: [],
			loading: {
				groups: false,
			},
			query: ''
		}
	},
	props: ['onSelect', 'id'],
	inject: [],
	computed: {
		setResults(){
			let self = this;
			return this.sets.filter( s => {
				return ( s.name.toLowerCase().includes(self.query.toLowerCase()) || s.id.toLowerCase().includes(self.query.toLowerCase()) )
			})
		}
	},
	methods: {
		loadData(){
			let self = this;
			self.loading.groups = true;

			utils.config.get.option('decorationGroups', (v) => {
				this.groups = v;
				self.loading.sets = false;
			})
		},
		groupSelected(group, event)
		{
			this.onSelect(group);
			event.target.disabled = true;
			setTimeout(()=> { event.target.disabled = false }, 2000)
		},
		getLocationName(id)
		{
			return this.locations.filter( l => l.id === id)[0].name;
		},
	}
}
</script>
<template>
	<Modal :id="'group-search'+id" title="Search Decoration Groups" buttonText="Add Group(s)" icon="bi-plus-circle" buttonClasses="btn btn-primary" :onOpen="loadData">

		<Loader v-if="loading.sets || loading.locations" />

		<template v-else>

			<div>
				<div class="form-floating">
					<input class="form-control" type="text" v-model="query" placeholder="Search">
					<label>Search</label>
				</div>
			</div>

			<div>

				<table class="table">
					<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>ID</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="group in groups">
						<td>{{ group.name }}</td>
						<td>{{ group.description }}</td>
						<td>{{ group.id }}</td>
						<td><button class="btn btn-primary btn-sm" @click="groupSelected(group, $event)">Select</button> </td>
					</tr>
					</tbody>
				</table>

			</div>

		</template>
	</Modal>
</template>
