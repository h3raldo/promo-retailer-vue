<script setup>
import Tiers from "@/ViewComponents/Quotes/Quote/globals/cost/Tiers.vue";
import OptionValues from "@/ViewComponents/Quotes/Quote/Items/Item/Options/Option.Values.vue";
</script>

<script>
import {toRaw} from "vue";

export default {
	data() {
		return {
			editingOptions: false,
			editingPricing: false,
			copyFrom: {}
		}
	},

	props: ['option', 'optionIndex', 'removeOption'],

	computed:{
		hasBeenSelected(){
			return !!this.option.selected.name
		},
		optionsButton(){
			return {
				class: this.editingOptions ? 'btn btn-primary' : 'btn btn-outline-primary',
				icon: this.editingOptions ? 'bi bi-x-circle' : 'bi bi-pencil-square',
				text: this.editingOptions ? 'Close' : 'Edit',
			}
		},
		pricingButton(){
			return {
				class: this.editingPricing ? 'btn btn-success' : 'btn btn-outline-success',
				icon: this.editingPricing ? 'bi bi-x-circle' : 'bi bi-pencil-square',
				text: this.editingPricing ? 'Close' : 'Pricing',
			}
		}
	},

	methods: {
		addTiers(){
			this.copyFrom.cost.forEach( t => {
				this.option.selected.cost.push( structuredClone(toRaw(t)) );
			})
		}
	},
}
</script>

<template>
	<div class="item-option py-3 border-bottom">

		<div class="d-flex gap-3 align-items-center">

			<!-- name -->
			<div class="col-3 fw-bold text-center">{{ option.name }}</div>

			<!-- select -->
			<div class="col-4">
				<select class="form-select" v-model="option.selected">
					<option :value="{}">Select {{ option.name }}</option>

					<template v-for="group in option.groups">
						<hr>
						<optgroup :label="group.name">
							<option v-for="value in group.values" :value="value">{{ value.name }}</option>
						</optgroup>
					</template>
				</select>
			</div>

			<!-- actions -->
			<div class="d-flex flex-grow-1 gap-2 align-items-center">

				<button :class="pricingButton.class" @click="editingPricing = !editingPricing" :disabled="!hasBeenSelected">
					<span class="d-flex gap-1">
						<i :class="pricingButton.icon"></i>
						<span>{{ pricingButton.text }}</span>
					</span>
				</button>

				<button :class="optionsButton.class" @click="editingOptions = !editingOptions">
					<span class="d-flex gap-1">
						<i :class="optionsButton.icon"></i>
						<span>{{ optionsButton.text }}</span>
					</span>
				</button>

				<div class="form-check form-switch flex-grow-1">
					<div class="d-flex justify-content-center gap-2">
						<input class="form-check-input" type="checkbox" role="switch" v-model="option.visible">
						<label class="form-check-label">
							Show Cost Table
						</label>
					</div>
				</div>

				<button class="btn btn-outline-danger" type="button" @click="removeOption(optionIndex)">
					<i class="bi bi-trash"></i>
				</button>

			</div>
		</div>


		<!-- edit tiers -->
		<div v-if="editingPricing && option.select !== ''" class="bg-light my-3">
			<Tiers :tiers="option.selected.cost" />

			<div class="pb-4 d-flex gap-3 align-items-center justify-content-center">
				<div>Add Tiers From:</div>
				<div>
					<select class="form-select" v-model="copyFrom">
						<option :value="{}">--</option>
						<template v-for="group in option.groups">
							<hr>
							<optgroup :label="group.name">
								<option v-for="value in group.values" :value="value">{{ value.name }}</option>
							</optgroup>
						</template>
					</select>
				</div>
				<div>
					<button class="btn btn-outline-primary" @click="addTiers">Add</button>
				</div>
			</div>
		</div>

		<!-- edit options -->
		<div v-if="editingOptions" class="bg-light p-3 my-3">
			<OptionValues :option="option" />
		</div>


	</div>
</template>