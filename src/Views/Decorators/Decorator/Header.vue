<script>
export default {
	data(){
		return {
			types: [
				'Screenprinting',
				'Embroidery',
				'Laser Engrave',
				'Deboss',
				'Pad Printing',
				'Silk Screen',
				'4-Color Process',
				'Digibrite',
				'Digital InkJet',
				'Heat Transfer',
				'Sublimation',
				'UV Printing',
				'Vinyl',
				'DTG Printing',
			]
		}
	},
	inject: ['decorator'],
	computed: {
		save()
		{

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
				<i class="bi bi-brush"></i> {{ decorator.name }}
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
				<select class="form-select" id="status" v-model="decorator.status">
					<option value="new">New</option>
					<option value="enabled">Enabled</option>
					<option value="disabled">Disabled</option>
				</select>
				<label for="status">Status</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="name" placeholder="Name" v-model="decorator.name">
				<label for="name">Name</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<select class="form-select" v-model="decorator.type">
					<option v-for="type in types" :value="type">{{ type }}</option>
				</select>
				<label>Type</label>
			</div>
		</div>

		<div class="flex-grow-1">
			<div class="form-floating">
				<input type="text" class="form-control" id="handle" placeholder="Handle" v-model="decorator.handle">
				<label for="handle">Handle</label>
			</div>
		</div>

	</div>
</template>