<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import Grid from "@/components/globals/Grid.vue";
import SearchForm from "@/EntityComponents/Entity/Search.Form.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data() {
		return {
			searchState: {}
		}
	},
	props: ['type', 'onSelect', 'api', 'columns', 'entity', 'defaultParams'],
	inject: ['symfony'],
	computed: {},
	methods: {
		searchEntities(search, e) {
			e.preventDefault();
			let params = utils.form.toGetParams(e.target);
			search(params);
		},
	}
}
</script>
<template>
	<Grid :api="api" :columns="columns" :searchState="searchState" :entity="entity" :defaultParams="defaultParams">
		<template #header="{search}">
			<div class="d-flex pt-3">
				<div class="flex-fill">

					<form @submit="searchEntities(search, $event)" class="pt-1">

						<div class="row align-items-center">

							<template v-for="(column, i) in columns" >
								<div v-if="column.type === 'text'" class="col">
									<!-- client -->
									<div class="pb-2">
										<div class="form-floating">
											<input class="form-control" :type="column.type" :name="column.id" :placeholder="i" v-model="searchState[column.id]">
											<label class="form-label">{{ i }}</label>
										</div>
									</div>
								</div>
							</template>
							<div class="col">
								<div class="align-self-center">
									<button type="submit" class="btn btn-outline-primary"><i class="bi bi-search"></i> Search
									</button>
								</div>
							</div>
						</div>

						<template v-for="(column, i) in columns" >
						<div v-if="column.type === 'checkbox'" class="d-flex gap-4">
							<div>
								<div class="d-flex gap-2">
									<label class="fw-bold">{{ i }}</label>
									<label v-for="option in column.options" class="form-check-label bg-gray px-2 rounded small">
										<input class="form-check-input me-1" type="checkbox" :name="column.id + '[]'" :value="option.value" v-model="searchState[column.id]">
										<span>{{ option.label }}</span>
									</label>
								</div>
							</div>
						</div>
						</template>
					</form>
				</div>
			</div>
		</template>

		<template #item="{item}">
			<td v-for="column in columns">{{ item[column.id] }}</td>
			<td><button class="btn btn-primary" @click="onSelect(item)">Select</button></td>
		</template>
	</Grid>
</template>
