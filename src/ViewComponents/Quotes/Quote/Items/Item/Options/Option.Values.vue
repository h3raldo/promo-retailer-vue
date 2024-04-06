<script setup>
</script>

<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			
		}
	},

	props: ['option'],

	computed:{
	},

	methods: {
		addGroup(){
			this.option.groups.push( entity.quote.item.option.group.create() );
		},
		removeGroup(i){
			this.option.groups.splice(i, 1);
		},
		addValue( group ){
			group.values.push( entity.quote.item.option.group.value.create() );
		},
		removeValue( group, i ){
			group.values.splice(i, 1);
		}
	},
}
</script>

<template>

	<div class="d-flex gap-2">

		<div class="col-3">

			<div class="ps-2 pe-3">
				<div class="form-floating">
					<input type="text" class="fw-bold form-control" v-model="option.name" placeholder="Item Name">
					<label>Option Name</label>
				</div>
			</div>

		</div>

		<div class="col-6">

			<div v-for="(group, groupIndex) in option.groups" class="card mb-2">

				<div class="card-header">
					<div class="d-flex gap-2">
						<input class="form-control" type="text" v-model="group.name">
						<button class="btn btn-outline-danger" @click="removeGroup(groupIndex)"><i class="bi bi-trash"></i></button>
					</div>
				</div>

				<div class="card-body">
					<div v-for="(value, i) in group.values" class="mb-2 d-flex gap-2">
						<div class="flex-grow-1">
							<input class="form-control" type="text" v-model="value.name">
						</div>

						<div>
							<button class="btn btn-link text-danger" @click="removeValue(group, i)"><i class="bi bi-trash"></i></button>
						</div>
					</div>

					<div class="pt-2">
						<button class="btn btn-outline-primary btn-sm" @click="addValue(group)"><i class="bi bi-plus-circle"></i> Add Value</button>
					</div>
				</div>

			</div>

			<div class="pt-2">
				<button class="btn btn-outline-primary" @click="addGroup"><i class="bi bi-collection"></i> Add Group</button>
			</div>
		</div>

	</div>

</template>