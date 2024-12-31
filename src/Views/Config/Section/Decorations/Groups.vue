<script setup>
import ConfigSection from "@/EntityComponents/Config/ConfigSection.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";
export default {
	data() {
		return {
			sets: [],
			locations: [],
			loading: {
				sets: false
			},
			setQuery: '',
		}
	},
	props: [],
	inject: ['alert'],
	computed: {
		setResults(){
			let self = this;
			return this.sets.filter( s => {
				return ( s.name.toLowerCase().includes(self.setQuery.toLowerCase()) || s.id.toLowerCase().includes(self.setQuery.toLowerCase()) )
			})
		}
	},
	methods: {
		init() {
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
		addGroup( groups )
		{
			groups.push({
				id: 'new-group',
				name: 'New Set Group',
				description: '',
				placements: [],
			})
		},
		removeGroup(i, groups)
		{
			groups.splice(i, 1);
		},
		removeSet(i, group)
		{
			group.sets.splice(i, 1);
		},
		getLocationName(id)
		{
			return this.locations.filter( l => l.id === id)[0].name;
		},
		addSetToGroup( set_id, decorator_id, group, event ){
			let id = `${set_id}-${decorator_id}`;

			if( group.sets.includes(id) ) return;

			group.sets.push( id );
			event.target.disabled = true;
			setTimeout(()=> { event.target.disabled = false }, 2000)
		}
	},
	mounted() {
		this.init();
	}
}
</script>
<template>

	<div>

		<ConfigSection option="decorationGroups">

			<template #header>
				<h3>Set Groups</h3>
				<p>Set groups to quickly reference and assign to products and websites.</p>
			</template>

			<template #default="{value}">

				<table class="table">
					<thead>
					<tr>
						<th>Name</th>
						<th class="col-2">ID</th>
						<th class="col-1"></th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(group, i) in value">

						<td>
							<details>
								<summary>
									<span class="fw-bold">{{ group.name }}</span> <small>{{ group.description }}</small>
								</summary>

								<div class="p-3">

									<div class="d-flex gap-3 mb-2">
										<div class="col">
											<div class="form-floating mb-2">
												<input type="text" class="form-control" v-model="group.name" placeholder="Name">
												<label>Name</label>
											</div>
										</div>
										<div class="col">
											<div class="form-floating">
												<input type="text" class="form-control" v-model="group.id" placeholder="ID">
												<label>ID</label>
											</div>
										</div>
									</div>

									<div class="row">
										<div class="col">
											<div class="form-floating">
												<textarea class="form-control" v-model="group.description" placeholder="Description" rows="5"></textarea>
												<label>Description</label>
											</div>
										</div>
									</div>


									<label class="pt-3 form-label">Decoration Sets:</label>
									<div class="d-flex gap-2 flex-wrap pb-2">
										<div v-for="(set, i) in group.sets" class="col-2">
											<div class="input-group input-group-sm">
												<label class="input-group-text flex-fill">{{ set }}</label>
												<button class="btn btn-outline-danger" @click.prevent="removeSet(i, group)"><i class="bi bi-x"></i></button>
											</div>
										</div>
									</div>


									<Modal v-if="!loading.sets && !loading.locations" :id="'set-search'+group.id" title="Search Decoration Sets" buttonText="Add Sets" icon="bi-plus-circle" buttonClasses="btn btn-primary">

										<div>
											<div class="form-floating">
												<input class="form-control" type="text" v-model="setQuery" placeholder="Search">
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
																				<button class="btn btn-outline-primary btn-sm" @click="addSetToGroup(set.id, decorator, group, $event)"><i class="bi bi-plus-circle"></i> {{ decorator }}</button>
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

									</Modal>

								</div>
							</details>
						</td>
						<td>
							{{ group.id }}
						</td>
						<td>
							<button class="btn btn-danger btn-sm ms-2" @click="removeGroup(i, value)"><i class="bi bi-x"></i></button>
						</td>

					</tr>
					</tbody>
				</table>

				<button class="btn btn-primary" @click="addGroup(value)">
					<i class="bi bi-plus-circle"></i> Add Decoration Set
				</button>

			</template>

		</ConfigSection>

	</div>

</template>
