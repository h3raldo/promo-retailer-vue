<script setup>
import ConfigSection from "@/EntityComponents/Config/ConfigSection.vue";
import Loader from "@/components/globals/Loader.vue";
import Search from "@/EntityComponents/Decorator/Search.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";
export default {
	data() {
		return {
			locations: null,
			loading: {
				locations: false
			}
		}
	},
	props: [],
	inject: ['alert'],
	computed: {
		logoTypes(){
			return entity.website.default.logo_types
		},
	},
	methods: {
		init(){
			let self = this;
			self.loading.locations = true;

			utils.config.get.option( 'decorationLocations', (v)=>{
				this.locations = v;
				self.loading.locations = false;
			})
		},
		onDecoratorSelect( set ){
			let self = this;
			return ( decorator ) => {
				if( set.decorators.includes(decorator.handle) ) {
					self.alert('Set already includes decorator', 'warning');
					return;
				}

				console.log('trying', decorator.handle, 'for', set.id, 'set')
				console.log(set);
				set.decorators.push( decorator.handle )
			}
		},
		removeDecorator( i, set ){
			set.decorators.splice( i, 1);
			console.log('after delete', set);
		},
		addSet( sets )
		{
			sets.push({
				id: 'xxxxxxxx',
				name: 'New Set',
				decorators: [],
				placements: [],
			})
		},
		removeSet(i, sets)
		{
			sets.splice(i, 1);
		},
		addPlacement( set )
		{
			set.placements.push({
				locations: ['nonexxxx'],
				logos: [],
				decorators: []
			})
		},
		removePlacement( i, set )
		{
			set.placements.splice( i, 1);
		}
	},
	mounted() {
		this.init();
	}
}
</script>
<template>

	<div>

		<ConfigSection option="decorationSets">

			<template #header>
				<h3>Decoration Sets</h3>
				<p>Recognized decoration sets for decoration creation.</p>
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
					<tr v-for="(set, i) in value">

						<td>
							<details>
								<summary class="h5 mb-0">{{ set.name }}</summary>

								<div class="px-3 py-3">

									<div class="row mb-3">
										<div class="col-5">
											<div class="form-floating mb-3">
												<input class="form-control" type="text" placeholder="Name" v-model="set.name">
												<label>Name</label>
											</div>

											<div class="form-floating">
												<input class="form-control" type="text" placeholder="ID" v-model="set.id">
												<label>ID</label>
											</div>
										</div>
										<div class="col d-flex">
											<div class="flex-fill">
												<div class="d-flex gap-2 mb-2">
													<label class="fw-bold">Decorators:</label>
													<span>(Creates a set for each decorator)</span>
												</div>

												<div class="d-flex flex-wrap gap-3 mb-3">
													<div v-for="(decorator, i) in set.decorators">
														<div class="input-group input-group-sm">
															<label class="input-group-text">{{ decorator }}</label>
															<button class="btn btn-outline-danger" @click.prevent="removeDecorator(i, set)"><i class="bi bi-x"></i></button>
														</div>
													</div>
												</div>

												<Search :onSelect="onDecoratorSelect(set)" button-text="Add Decorator" :button-icon="'bi-plus-circle'" size="btn-sm" :modalID="set.id" /><br>
											</div>
										</div>
									</div>

									<h5>Placements</h5>

									<div v-for="(placement, i) in set.placements" class="d-flex gap-3 bg-light p-3 mb-1">
										<div class="align-self-center">
											{{ i+1 }}.
										</div>
										<div class="col-3">
											<div class="form-floating">
												<select class="form-select" v-model="placement.locations[0]" :disabled="loading.locations">
													<option v-for="location in locations" :value="location.id">{{ location.name }}</option>
												</select>
												<label>Location</label>
											</div>
										</div>
										<div class="col">
											<label>Logo Types</label>
											<br>
											<template v-for="type in logoTypes">
												<label class="form-check-label bg-gray px-2 rounded small me-2">
													<input class="form-check-input me-1" type="checkbox" :value="type" v-model="placement.logos">
													<span>{{ type }}</span>
												</label>
											</template>
										</div>
										<div class="align-self-center">
											<button class="btn btn-outline-danger" @click="removePlacement(i, set)"><i class="bi bi-x"></i></button>
										</div>
									</div>

									<button class="btn btn-outline-primary mt-2" @click="addPlacement(set)"><i class="bi bi-plus-circle"></i> Add Placement</button>

								</div>

							</details>
						</td>
						<td>
							{{ set.id }}
						</td>
						<td>
							<button class="btn btn-danger btn-sm ms-2" @click="removeSet(i, value)"><i class="bi bi-x"></i></button>
						</td>

					</tr>
					</tbody>
				</table>

				<button class="btn btn-primary" @click="addSet(value)"><i class="bi bi-plus-circle"></i> Add Decoration Set</button>

			</template>

		</ConfigSection>

	</div>

</template>
