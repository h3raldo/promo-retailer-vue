<script setup>
import ConfigSection from "@/EntityComponents/Config/ConfigSection.vue";
</script>
<script>
export default {
	data() {
		return {
			available: {
				images: [
					{ id: 'front-flat', name: "Front Flat" },
					{ id: 'back-flat', name: "Back Flat" },
					{ id: 'front-model', name: "Front Model" },
					{ id: 'back-model', name: "Back Model" },
				]
			},
		}
	},
	props: [],
	methods: {
		add( locations ){
			locations.push({
				id: 'xxxxxxxx',
				name: 'New Location',
				images: []
			})
		},
		remove( i, locations ){
			locations.splice(i, 1);
		},
	},
}
</script>
<template>

	<ConfigSection option="decorationLocations">
		<template #header>
			<h3>Locations</h3>
			<p>Recognized decoration locations for template placement and order creation throughout.</p>
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
				<tr v-for="(location, i) in value">
					<td>
						<details class="">
							<summary>
								{{location.name}}
							</summary>

							<div class="row pb-3 align-items-center pt-2">

								<div class="col">
									<div class="form-floating mb-2">
										<input class="form-control" type="text" v-model="location.id" placeholder="ID">
										<label>ID</label>
									</div>

									<div class="form-floating">
										<input class="form-control" type="text" v-model="location.name" placeholder="Name">
										<label>Name</label>
									</div>
								</div>


								<div class="col">
									<div class="row">
										<div class="col-6 py-2" v-for="image in available.images">
											<label class="form-check-label bg-gray px-2 rounded small">
												<input class="form-check-input me-1" type="checkbox" :value="image.id" v-model="location.images">
												<span>{{ image.name }}</span>
											</label>
										</div>
									</div>
								</div>

							</div>
						</details>
					</td>
					<td>{{ location.id }}</td>
					<td><button class="btn btn-outline-danger btn-sm ms-4" @click="remove(i, value)"><i class="bi bi-x"></i></button></td>
				</tr>
				</tbody>

			</table>

			<button class="btn btn-primary" @click="add(value)">Add Location </button>

		</template>
	</ConfigSection>



</template>
