<script setup>
</script>

<script>
import pricing from "@/js/pricing.js";

export default {
	data() {
		return {

		}
	},

	props: ['tier', 'index','removeTier', 'showMargin', 'canDelete', 'order'],

	computed:{
		editableMargin(){
			return this.showMargin
		},
		showPrice(){
			if( !this.order ) return true;
			return pricing.showPrice(this.order);
		},
		deletable(){
			if( typeof this.canDelete === 'undefined' ){
				return true;
			}

			return this.canDelete;
		}
	},

	methods: {
		calculateMargin(){
			this.tier.margin = pricing.calculateMargin( this.tier.cost, this.tier.price )
		},
		calculatePrice(){
			this.tier.price = pricing.addMargin( this.tier.cost, this.tier.margin )
		},
		onFocus(type){
			if( this.tier[type] === 0 ) this.tier[type] = '';
		},
		focusOut(type)
		{
			if( this.tier[type] === '' ) this.tier[type] = 0;
		},
		costChange()
		{
			if( !this.showPrice ){
				this.tier.price = this.tier.cost;
				return;
			}

			if( !this.editableMargin ) {
				if (this.tier.fixed) return;
				this.tier.price = 0;
				return;
			}

			if( this.tier.fixed ) return;
			this.tier.price = pricing.addMargin(this.tier.cost, this.tier.margin);
		}
	}
}
</script>

<template>
	<div class="tier d-flex align-items-end mb-1 mt-2 gap-3">

		<div class="row">
			<div class="col">
				<label class="form-label">Qty</label>
				<input type="number" class="form-control" v-model.number="tier.qty" min="1">
			</div>
			<div class="col">
				<label class="form-label">Cost</label>
				<div class="input-group">
					<span class="input-group-text">$</span>
					<input type="number" class="form-control" v-model.number="tier.cost" min="0" @focus="onFocus('cost')" @focusout="focusOut('cost')" @change="costChange">
				</div>
			</div>

			<template v-if="showPrice">

			<div v-if="editableMargin" class="col">
				<label class="form-label">Margin</label> <a href="#" v-if="tier.fixed" @click="calculateMargin"><i class="bi bi-calculator"></i></a>
				<div class="input-group">
					<input type="number" class="form-control" v-model.number="tier.margin" min="0" @change="costChange">
					<span class="input-group-text">%</span>
				</div>
			</div>

			<div class="col">
				<label class="form-label">
					<label class="form-check-label">
						<input class="form-check-input me-1" type="checkbox" v-model="tier.fixed" @change="costChange">
						<span :class="tier.fixed ? '' : 'opacity-25'">Fixed Price</span>
					</label>
				</label>
				<!--<a v-if="tier.fixed" href="#" @click="calculatePrice"><i class="bi bi-calculator"></i></a>-->
				<div class="input-group">
					<span class="input-group-text">$</span>
					<input type="number" class="form-control" v-model.number="tier.price" min="0" :disabled="!tier.fixed" @focus="onFocus('price')" @focusout="focusOut('price')">
				</div>
			</div>

			</template>
		</div>

		<div>
			<button class="btn btn-outline-danger" v-if="deletable" @click="removeTier(index)"><i class="bi bi-trash"></i></button>
		</div>
	</div>
</template>