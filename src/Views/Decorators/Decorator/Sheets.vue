<script setup>

</script>
<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	data(){
		return {
			editing: false
		}
	},
	computed: {
		units(){
			return entity.decorator.sheet.filter.units;
		}
	},
	props: ['sheets', 'editable'],
	methods: {
		addTier( sheet ){
			sheet.price.push(entity.decorator.sheet.tier.create());
		},
		addSheet(){
			this.sheets.unit.push( entity.decorator.sheet.create() );
		},
		removeTier( sheet, index ){
			sheet.price.splice(index, 1);
		},
		formatPricing(price) {
			return utils.pricing.format(price);
		},
		isAll( sheet ){
			return sheet.filters[0].attr === 'all';
		}
	},
}
</script>
<template>
	<div class="bg-light p-2">

		<div class="row">
			<div class="col">
				<div v-if="editable">
					<button class="btn btn-outline-primary" @click="editing = !editing">Edit</button>
				</div>
				<h5>Unit Sheets</h5>
				<div v-for="unit_sheet in sheets.unit" class="pb-1 px-2">
				<table class="table table-sm table-bordered" v-if="!editing">
					<thead>
					<tr>
						<th>{{ unit_sheet.filters[0].value.from }} {{ unit_sheet.filters[0].attr }}
							- {{ unit_sheet.filters[0].value.to }} {{ unit_sheet.filters[0].attr }}</th>
						<th>Time/Price</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>Setup time: </td>
						<td>{{ unit_sheet.production.time_setup }}</td>
					</tr>
					<tr>
						<td>Group Size: </td>
						<td>{{ unit_sheet.production.time_group_size }}</td>
					</tr>
					<tr>
						<td>Time Per Group:</td>
						<td>{{ unit_sheet.production.time_per_group }}</td>
					</tr>
					<tr>
						<td colspan="2" class="fw-bold">Tiers</td>
					</tr>
					<tr v-for="tier in unit_sheet.price">
						<td>{{ tier.qty }}</td>
						<td>{{ formatPricing(tier.price) }}</td>
					</tr>
					</tbody>
				</table>
				<table class="table table-sm table-bordered" v-else>
						<thead>
						<tr>
							<th>
								<div class="d-flex gap-1" v-if="!isAll(unit_sheet)">
									<div class="col-2">
										<input type="number" class="form-control" v-model="unit_sheet.filters[0].value.from">
									</div>
									<div>
										<select class="form-select" v-model="unit_sheet.filters[0].attr">
											<option v-for="unit in units" :value="unit">{{ unit }}</option>
										</select>
									</div>
									<div class="col-1 text-center">-</div>
									<div class="col-2">
										<input type="number" class="form-control" v-model="unit_sheet.filters[0].value.to">
									</div>
									<div>
										<select class="form-select" v-model="unit_sheet.filters[0].attr">
											<option v-for="unit in units" :value="unit">{{ unit }}</option>
										</select>
									</div>
								</div>
								<div v-else>
									<select class="form-select" v-model="unit_sheet.filters[0].attr">
										<option v-for="unit in units" :value="unit">{{ unit }}</option>
									</select>
								</div>
							</th>
							<th>Time/Price</th>
							<th></th>
						</tr>
						</thead>
						<tbody>
						<tr class="align-middle">
							<td>Setup time: </td>
							<td><input type="number" class="form-control" v-model="unit_sheet.production.time_setup"></td>
							<td></td>
						</tr>
						<tr class="align-middle">
							<td>Group Size: </td>
							<td><input type="number" class="form-control" v-model="unit_sheet.production.time_group_size"></td>
							<td></td>
						</tr>
						<tr class="align-middle">
							<td>Time Per Group:</td>
							<td><input type="number" class="form-control" v-model="unit_sheet.production.time_per_group"></td>
							<td></td>
						</tr>
						<tr>
							<td colspan="3" class="fw-bold p-2 bg-light">Tiers</td>
						</tr>
						<tr v-for="(tier, i) in unit_sheet.price">
							<td><input type="number" class="form-control" v-model="tier.qty"></td>
							<td><input type="number" class="form-control" v-model="tier.price"></td>
							<td class="text-center"><button class="btn btn-outline-danger" @click="removeTier(unit_sheet, i)">X</button> </td>
						</tr>
						<tr>
							<td colspan="3" class="fw-bold text-end p-2">
								<button class="btn btn-primary" @click="addTier(unit_sheet)">Add Tier</button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>

				<div class="mb-3 text-center" v-if="editing"><button class="btn btn-outline-primary" @click="addSheet">Add Sheet</button></div>
			</div>
			<div class="col">
				<h5>Setup</h5>
			</div>
		</div>

	</div>
</template>