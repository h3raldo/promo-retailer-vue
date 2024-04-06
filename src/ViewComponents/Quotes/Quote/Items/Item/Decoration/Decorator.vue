<script setup>
import Tiers from "@/ViewComponents/Quotes/Quote/globals/cost/Tiers.vue";
</script>

<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			selected: {},
			isEditing: false,
		}
	},

	props: ['decorator', 'remove'],

	computed: {},

	methods: {
		addSheet(){
			let sheet = entity.quote.item.decoration.decorator.sheet.create(this.decorator);
			sheet.name = 'New Sheet';
			this.decorator.sheets.push(sheet);
		},
		removeSheet(index){
			this.decorator.sheets.splice(index, 1);
		}
	},
}
</script>

<template>
	<div class="d-flex gap-3 align-items-center">
		<!-- name -->
		<div class="col-6 fw-bold">{{ decorator.info.name }} [{{ decorator.info.id }}]</div>

		<!-- select -->
		<div class="col-4">
			<select class="form-select" v-model="selected">
				<option :value="{}">-- Edit Pricing --</option>
				<option v-for="sheet in decorator.sheets" :value="sheet">{{ sheet.name }}</option>
			</select>
		</div>

		<!-- actions -->
		<div class="col-3 d-flex flex-grow-1 gap-2 align-items-center">
			<button class="btn btn-outline-primary" @click="isEditing = !isEditing">
				<span class="d-flex gap-1"><i class="bi bi-pencil-square"></i><span>Edit</span></span>
			</button>
			<button class="btn btn-outline-danger" @click="remove" type="button"><i class="bi bi-trash"></i></button>
		</div>

	</div>

	<div class="bg-light mt-3" v-if="selected.cost">
		<Tiers v-if="selected.cost" :tiers="selected.cost"/>
	</div>

	<div v-if="isEditing" class="bg-light mt-2">
		<div class="bg-light p-3 my-3">
			<div class="d-flex gap-2">
				<div class="col-6">
					<div class="ps-2 pe-3">
						<div class="form-floating">
							<input type="text" class="fw-bold form-control" placeholder="Item Name" v-model="decorator.info.name">
							<label>Name</label>
						</div>

						<div class="form-floating mt-2">
							<input type="text" class="fw-bold form-control" placeholder="Item Name" :value="decorator.info.id" disabled="disabled">
							<label>ID</label>
						</div>
					</div>
				</div>
				<div class="col-6">
					<div class="card mb-2">
						<div class="card-body">
							<div v-for="(sheet, i) in decorator.sheets" class="mb-2 d-flex gap-2">
								<div class="flex-grow-1">
									<input class="form-control" type="text" v-model="sheet.name">
								</div>
								<div>
									<button class="btn btn-link text-danger" @click="removeSheet(i)">
										<i class="bi bi-trash"></i>
									</button>
								</div>
							</div>
							<div class="pt-2">
								<button class="btn btn-outline-primary btn-sm" @click="addSheet">
									<i class="bi bi-plus-circle"></i> Add Sheet
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>