<script setup>
import SelectOrCustom from "@/EntityComponents/Order/globals/item/SelectOrCustom.vue";
import entity from "@/js/entity.js";
</script>

<script>

import entity from "@/js/entity.js";

export default {
	data() {
		return {
			visible: true
		}
	},

	props: ['subitem'],
	inject: ['item', 'logos'],

	computed:{

	},

	methods: {
		add(){
			this.subitem.decoration.placements.push( entity.order.item.decoration.placement.create() );
		},
		remove(index){
			this.subitem.decoration.placements.splice(index, 1);
		}
	}
}
</script>

<template>

	<div v-for="(placement, placementIndex) in subitem.decoration.placements" class="d-flex gap-3 align-items-center pb-2">

		<div class="col-3">
			<div class="form-floating">
				<select class="form-select" v-model="placement.decorator">
					<option :value="{}">Select Decorator</option>
					<optgroup v-for="decorator in item.decoration.available" :label="decorator.info.name">
						<option v-for="sheet in decorator.sheets" :value="sheet">{{ sheet.name }}</option>
					</optgroup>
				</select>
				<label>Price Sheet</label>
			</div>
		</div>

		<div class="flex-fill">
			<div class="form-floating">
				<select class="form-select" v-model="placement.logo">
					<option :value="{}">Select Logo</option>
					<option v-for="logo in logos" :value="logo">{{ logo.name }} - {{ logo.variation }}</option>
				</select>
				<label>Logo</label>
			</div>
		</div>

		<div class="col-1 text-center">
			<div v-if="placement.logo.url">
				<img :src="placement.logo.url" width="100" alt="" />
			</div>
			<div v-else>
				<i class="bi bi-card-image"></i>
			</div>
		</div>

		<div class="col-2">
			<div class="form-floating">
				<SelectOrCustom :array="entity.order.item.decoration.default.logo.colors" v-model="placement.logo_color.name" />
				<label>Logo Color</label>
			</div>
		</div>

		<div class="col-2">
			<div class="form-floating">
				<SelectOrCustom :array="entity.order.item.decoration.default.logo.locations" v-model="placement.location.name" />
				<label>Logo Location</label>
			</div>
		</div>

		<div class="text-end">
			<button class="btn btn-outline-danger" @click="remove(placementIndex)"><i class="bi bi-trash"></i></button>
		</div>

	</div>

	<div class="pt-1">
		<button class="btn btn-primary btn-sm" @click="add"><i class="bi bi-plus-circle"></i> Add Placement</button>
	</div>

</template>