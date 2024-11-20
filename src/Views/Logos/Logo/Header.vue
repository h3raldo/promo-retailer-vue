<script>
import Search from "@/EntityComponents/Company/Search.vue";

export default {
	components: {Search},
	data(){
		return {

		}
	},
	inject: ['logo'],
	computed: {
		save()
		{

		},
	},
	methods: {
		onCompanySelect(company){
			console.log('selected', company);
			this.logo.company.id = company.id;
			this.logo.company.name = company.name;
		}
	}
}
</script>
<template>
	<div class="d-flex justify-content-between align-items-center mb-2 bg-gray p-3">
		<div class="d-flex gap-3 align-items-center">
			<div>
				<button @click="$router.go(-1)" class="btn btn-secondary"><i class="bi bi-arrow-bar-left"></i></button>
			</div>
			<div class="fw-bold fs-4">
				<i class="bi bi-card-image"></i> {{ logo.name }}
			</div>
		</div>
		<div>
			<div class="text-end d-flex gap-2">
				<button class="btn btn-primary" :disabled="true" @click="save"><i class="bi bi-floppy-fill"></i> Save</button>
			</div>
		</div>
	</div>

	<div class="d-flex gap-3 align-items-center">

		<div>
			<div class="form-floating">
				<select class="form-select" id="status" v-model="logo.status">
					<option value="new">New</option>
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="name" placeholder="Name" v-model="logo.name">
				<label for="name">Name</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="handle" placeholder="Handle" v-model="logo.handle">
				<label for="handle">Handle</label>
			</div>
		</div>

		<div class="col-2">
			<div class="input-group">
				<div class="form-floating">
					<input type="text" class="form-control" placeholder="Vendor" v-model="logo.company.name" disabled>
					<label>Company</label>
				</div>
				<Search :onSelect="onCompanySelect" :button-text="''" :button-icon="'bi-pencil'" />
			</div>
		</div>

	</div>
</template>