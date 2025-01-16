<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			sets: [],
			locations: [],
			loading: {
				sets: false,
				locations: false
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
			self.loading.sets = true;
			self.loading.locations = true;

			utils.config.get.option('decorationSets', (v) => {
				this.sets = v;
				self.loading.sets = false;
			})

			utils.config.get.option('decorationLocations', (v) => {
				this.locations = v;
				self.loading.locations = false;
			})
		},
		setSelected(set_id, decorator_id, event)
		{
			let id = `${set_id}-${decorator_id}`;
			this.onSelect(id);
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
	<Modal :id="'set-search'+id" title="Search Decoration Sets" buttonText="Add Sets" icon="bi-plus-circle" buttonClasses="btn btn-primary" :onOpen="loadData">

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
						<th>ID</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="set in setResults">
						<td>
							<details>
								<summary>{{ set.name }}</summary>
								<div class="p-2 pb-3">

									<div class="row">
										<div class="col">
											<div class="pb-1">Placements:</div>
											<div v-for="(placement, i) in set.placements" class="d-flex gap-3 bg-light p-2 mb-1">
												<div class="align-self-center">
													{{ i+1 }}.
												</div>
												<div class="col-3">
													Location:<br> <span class="badge text-bg-secondary">{{ getLocationName(placement.locations[0]) }}</span>
												</div>
												<div class="col">
													Logos:<br> <span v-for="logo in placement.logos" class="badge text-bg-secondary me-2">{{ logo }}</span>
												</div>
											</div>
										</div>
										<div class="col">
											<div class="pb-2">Add Sets:</div>
											<div class="d-flex flex-wrap gap-2 mb-3 bg-light p-3">
												<div v-for="decorator in set.decorators">
													<button class="btn btn-outline-primary btn-sm" @click="setSelected(set.id, decorator, $event)"><i class="bi bi-plus-circle"></i> {{ decorator }}</button>
												</div>
											</div>
										</div>
									</div>



								</div>
							</details>

						</td>
						<td>{{ set.id }}</td>
						<td></td>
					</tr>
					</tbody>
				</table>

			</div>

		</template>
	</Modal>
</template>
