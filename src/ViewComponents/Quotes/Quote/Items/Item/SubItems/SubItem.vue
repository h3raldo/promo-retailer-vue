<script setup>
import "./SubItem.vue";
import Option from "@/ViewComponents/Quotes/Quote/Items/Item/Options/Option.vue";
</script>

<script>
import pricing from "@/js/Quotes/Quote/pricing.js";
import entity from "@/js/Quotes/Quote/entity.js";

export default {
	data() {
		return {
			editOptions: false,
		}
	},

	props: ['subitem', 'subitemIndex', 'remove', 'duplicate', 'totalQty'],
	inject: ['item', 'itemIndex', 'logos', 'updatePricing'],

	computed:{
		hasOptions(){
			return this.item.options.length > 0;
		}
	},

	watch: {
		subitem: {
			handler(){
				console.log('update!')
				this.updatePricing()
			},
			deep: true
		}
	},

	methods: {
		valueForSubItem(option){
			return {
				name: option.name,
				value: option.value
			}
		},
		sizeQtyChange(size, e){
			let value = e.target.value.trim();
			let qty = 0;
			if( value !== '' ) qty = parseInt(e.target.value);
			if( !this.subitem.sizes[size.name] ) this.subitem.sizes[size.name] = entity.item.subitem.size.create( size.name );
			console.log( size, qty, this.subitem.sizes[size.name] )
			this.subitem.sizes[size.name].qty = qty;
		},
		removeSize( size ){
			delete this.subitem.sizes[size];
		},
		hasSize( size ){
			return typeof this.subitem.sizes[size.name] === 'object'
		},
		getSizePricing( size ){
			if( !this.hasSize(size) ) return 0;
			return this.subitem.sizes[size.name].pricing.base.size.price;
		},
		getTotalEachPricing( size ){
			if( !this.hasSize(size) ) return 0;
			return this.subitem.sizes[size.name].pricing.totals.each.price;
		},
		getTotalPricing( size ){
			if( !this.hasSize(size) ) return 0;
			return this.subitem.sizes[size.name].pricing.totals.price;
		},
		getTablePricing( size ){
			let table = [
				{
					name: 'Item',
					price: this.item.pricing.base.material.price
				},
				{
					name: 'Decoration',
					price: this.item.pricing.base.decoration.price
				},
				{
					name: 'Options',
					price: this.subitem.pricing.base.options.price
				},
				{
					name: 'Color',
					price: this.subitem.pricing.base.color.price
				},
				{
					name: 'Size',
					price: this.getSizePricing(size)
				}
			];

			return table.filter( t => t.price > 0);
		}
	},

	mounted() {
		if( !this.subitem.color.name ) this.subitem.color = this.item.colors[0];
	}
}
</script>

<template>

	<tr>

		<td class="align-middle">
			<div class="text-center d-flex gap-2 align-items-center">
				<button class="btn btn-outline-primary btn-sm" @click="duplicate(subitem)"><i class="bi bi-copy"></i></button>
				<button class="btn btn-outline-primary btn-sm" @click="editOptions = !editOptions"><i class="bi bi-sliders2"></i></button>
			</div>
		</td>

		<td>
			<select v-model="subitem.color" class="form-select">
				<option v-for="color in item.colors" :value="color">{{ color.name }}</option>
			</select>
		</td>

		<td v-for="size in item.sizes">
			<input type="text" class="form-control" min="0" @change="sizeQtyChange(size, $event)" :value="hasSize(size) ? subitem.sizes[size.name].qty : ''">

			<div class="text-center" v-if="hasSize(size)">
				<div class="pr-tooltip">
					<i class="bi bi-info-circle"></i>
					<div class="pr-tooltip--content bg-light p-2 border text-start">
						<table class="table table-sm table-bordered text-end mb-0">
							<tbody>
								<tr v-for="row in getTablePricing(size)">
									<td>{{ row.name }}:</td>
									<td>{{ pricing.format(row.price) }}</td>
								</tr>
							</tbody>
							<tfoot class="fw-bold">
								<tr>
									<td>Each:</td>
									<td>{{ pricing.format(getTotalEachPricing(size)) }}</td>
								</tr>
								<tr>
									<td>Total:</td>
									<td>{{ pricing.format(getTotalPricing(size)) }}</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>

		</td>

		<td class="text-center align-middle">
			({{ subitem.qty }})
			<b>{{ pricing.format(subitem.pricing.totals.price) }}</b>
		</td>

		<td class="text-end align-middle">
			<button class="btn btn-outline-danger btn-sm" @click="remove(subitemIndex)"><i class="bi bi-trash"></i></button>
		</td>

	</tr>

	<tr v-if="editOptions" class="mb-2 bg-light p-3 ">
		<td colspan="9999">
			<div class="d-flex gap-2" v-if="hasOptions">
				<template v-for="option in item.options">
					<div class="col" v-if="option.groups.length > 0">
						<div class="form-floating">
							<select class="form-select" v-model="subitem.options[option.name]">
								<option :value="undefined">Select {{ option.name }}</option>
								<template v-for="group in option.groups">
									<hr>
									<optgroup :label="group.name">
										<option v-for="value in group.values" :value="valueForSubItem(value)">{{ value.name }}</option>
									</optgroup>
								</template>
							</select>
							<label>{{ option.name }}</label>
						</div>
					</div>
				</template>
			</div>
			<div class="text-center" v-else>
				No available options
			</div>
		</td>
	</tr>

</template>