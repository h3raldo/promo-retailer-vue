<script setup>
import Modal from "@/components/globals/bootstrap/Modal.vue";
import SubItem from "@/ViewComponents/Quotes/Quote/Items/Item/SubItems/SubItem.vue";
</script>

<script>
import entity from "@/js/entity.js";
import pricing from "@/js/pricing.js";
import {toRaw} from "vue";

export default {
	data() {
		return {

		}
	},

	computed:{
		hasOptions(){
			return this.item.options.length > 0;
		}
	},

	inject: ['item', 'itemIndex', 'quote', 'updatePricing'],

	methods: {
		addSubItem(){
			this.item.subitems.push( entity.quote.item.subitem.create() );
			this.updatePricing();
		},
		removeSubItem(index) {
			this.item.subitems.splice(index, 1);
			this.updatePricing();
		},
		duplicateSubItem(item){
			this.item.subitems.push( structuredClone(toRaw(item)) );
			this.updatePricing();
		},
		valueForSubItem(option){
			return {
				name: option.name,
				value: option.value
			}
		}
	}
}
</script>

<template>

	<div class="bg-light py-2 px-4 mb-3">

		<table class="table table-sm table-bordered">
			<thead>
				<tr>
					<th class="col-2">Color</th>
					<th v-for="size in item.sizes" class="text-center">{{ size.name }}</th>
					<th class="text-end">Qty</th>
					<th class="text-end">Total</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="subitem in item.subitems">
					<td>
						{{ subitem.color.name }}

						<span v-for="(option, key) in subitem.options" class="d-block">
							<span v-if="option"><span class="badge text-bg-secondary me-1">{{ key }}:</span> {{ option.name }}</span>
						</span>
					</td>
					<td v-for="size in item.sizes" class="text-center">
						{{ subitem.sizes[size.name] ? subitem.sizes[size.name].qty : '' }}
					</td>
					<td class="text-end">
						{{ subitem.qty }}
					</td>
					<td class="text-end">
						{{ pricing.format(subitem.pricing.totals.price) }}
					</td>
				</tr>
			</tbody>
			<tfoot>
			<tr>
				<td :colspan="item.sizes.length+2" class="text-end"><span class="fw-bold">Total:</span></td>
				<td class="text-end">{{ pricing.format(item.pricing.totals.price) }}</td>
			</tr>
			</tfoot>
		</table>

		<div>
			<Modal :id="'modal-subitems-item-'+itemIndex" :title="item.info.name" :buttonText="'SubItems'" :buttonClasses="'btn btn-outline-primary btn-sm'" :icon="'bi-pencil-square'">
				<table class="table table-bordered">
					<thead>
					<tr>
						<th></th>
						<th class="col-2">Color</th>
						<th v-for="size in item.sizes" class="text-center">
							{{ size.name }}
						</th>
						<th class="text-center">Total</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<SubItem v-for="(subitem, subitemIndex) in item.subitems" :subitem="subitem" :subitemIndex="subitemIndex" :remove="removeSubItem" :duplicate="duplicateSubItem" />
					</tbody>
				</table>


				<button class="btn btn-outline-primary btn-sm" @click="addSubItem">+ Add SubItem</button>

				<div class="text-center">
								<span>
									<b>Total Qty:</b> {{ item.qty }}
								</span>
					<span class="ps-4">
									<b>Total:</b> {{ pricing.format(item.pricing.totals.price) }}
								</span>
				</div>
			</Modal>
		</div>
	</div>
</template>