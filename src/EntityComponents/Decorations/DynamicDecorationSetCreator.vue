<script setup>
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			placements: [],
			decorators: [],
			available: {
				locations: [
					{id: 'lcxxx', name: 'Top'},
					{id: 'lcxxx', name: 'Back'},
					{id: 'lcxxx', name: 'Left'},
					{id: 'lcxxx', name: 'Right'},
					{id: 'lcxxx', name: 'Right Sleeve'},
					{id: 'lcxxx', name: 'Left Sleeve'},
					{id: 'lcxxx', name: 'Left Chest'},
				]
			}
		}
	},
	props: [],
	inject: [],
	computed: {
		logoTypes(){
			return entity.website.default.logo_types
		},
	},
	methods: {
		addOption(placement){
			placement.options.push({
				location: '',
				logos: [],
				options: []
			})
		},
		add(){
			this.placements.push({
				location: '',
				logos: [],
				options: []
			});
		}
	}
}
</script>
<template>

	<div class="mt-3 p-3 border rounded">
		<h2>Generate Decoration</h2>

		<table class="table align-middle">
			<thead>
			<tr>
				<th>Location</th>
				<th>Logo Type</th>
				<th>Required</th>
				<th></th>
			</tr>
			</thead>
			<tbody>
			<template v-for="placement in placements">
				<tr>
					<td>
						<select class="form-select" v-model="placement.location">
							<option value="">-</option>
							<option v-for="location in available.locations" :value="location.id">{{ location.name }}</option>
						</select>
					</td>
					<td>
						<label v-for="type in logoTypes" class="form-check-label bg-gray px-2 rounded small me-2">
							<input class="form-check-input me-1" type="checkbox" :value="type" v-model="placement.logos">
							<span>{{ type }}</span>
						</label>
					</td>
					<td><input type="checkbox" class="form-check"></td>
					<td>
						<button class="btn btn-outline-primary" @click="addOption(placement)">Add Option</button>
					</td>
				</tr>
				<template v-for="option in placement.options">
					<tr>
						<td colspan="2">
							<div class="d-flex gap-2 align-items-center">
								<div class="bg-warning-subtle d-flex align-items-center py-2 px-3">
									<i class="bi bi-arrow-return-right"></i> ADD ON:
								</div>
								<div>
									<select class="form-select" v-model="option.location">
										<option value="">-</option>
										<option v-for="location in available.locations" :value="location.id">{{ location.name }}</option>
									</select>
								</div>
								<div>
									<label v-for="type in logoTypes" class="form-check-label bg-gray px-2 rounded small me-2">
										<input class="form-check-input me-1" type="checkbox" :value="type" v-model="option.logos">
										<span>{{ type }}</span>
									</label>
								</div>
							</div>
						</td>
						<td><input type="checkbox" class="form-check"></td>
						<td>
							<button class="btn btn-outline-primary" @click="addOption(option)">Add Option</button>
						</td>
					</tr>
					<template v-for="child_option in option.options">
						<tr>
							<td colspan="2">
								<div class="d-flex gap-2 align-items-center ps-4">
									<div class="bg-warning-subtle d-flex align-items-center py-2 px-3">
										<i class="bi bi-arrow-return-right"></i> ADD ON:
									</div>
									<div>
										<select class="form-select" v-model="child_option.location">
											<option value="">-</option>
											<option v-for="location in available.locations" :value="location.id">{{ location.name }}</option>
										</select>
									</div>
									<div>
										<label v-for="type in logoTypes" class="form-check-label bg-gray px-2 rounded small me-2">
											<input class="form-check-input me-1" type="checkbox" :value="type" v-model="child_option.logos">
											<span>{{ type }}</span>
										</label>
									</div>
								</div>
							</td>
							<td><input type="checkbox" class="form-check"></td>
							<td></td>
						</tr>
					</template>
				</template>
			</template>
			</tbody>
			<tfoot>
			<tr>
				<td colspan="4">
					<div class="d-flex gap-2">
						<button class="btn btn-primary btn-sm" @click="add">Add Placement</button>
					</div>
				</td>
			</tr>
			</tfoot>
		</table>
	</div>


</template>
