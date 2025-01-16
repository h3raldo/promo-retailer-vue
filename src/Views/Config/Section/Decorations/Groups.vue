<script setup>
import ConfigSection from "@/EntityComponents/Config/ConfigSection.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import SearchDecorationSets from "@/EntityComponents/Decorations/SearchDecorationSets.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";
export default {
	data() {
		return {

		}
	},
	props: [],
	inject: ['alert'],
	computed: {

	},
	methods: {
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
		addSetToGroup( group ){

			return ( set_id ) => {
				if( group.sets.includes(set_id) ) return;
				group.sets.push( set_id );
			}
		}
	},
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

									<SearchDecorationSets :onSelect="addSetToGroup(group)" :id="group.id" />
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
