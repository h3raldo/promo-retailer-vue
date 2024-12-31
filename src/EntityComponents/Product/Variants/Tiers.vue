<script setup>
import Tier from "@/EntityComponents/Order/globals/cost/Tier.vue";
</script>

<script>
import entity from "@/js/entity.js";
import pricing from "@/js/pricing.js";

export default {
	data() {
		return {
			allMargin: '',
			allCost: '',
			allPrice: '',
		}
	},

	props: ['tiers', 'showMargin', 'canDeleteTiers',],

	computed: {},

	methods: {
		addTier() {
			this.tiers.push(entity.order.item.tier.create())
		},
		removeTier(index) {
			this.tiers.splice(index, 1);
		},
		applyMarginToAll() {
			pricing.tiers.applyMarginToAll(this.allMargin, this.tiers);
		},
		applyCostToAll() {
			pricing.tiers.applyCostToAll(this.allCost, this.tiers);
		},
		applyPriceToAll() {
			pricing.tiers.applyPriceToAll(this.allPrice, this.tiers);
		},
		addDefaultTiers() {
			let tiers = entity.order.item.tier.default.cost();
			tiers.forEach(t => this.tiers.push(t))
		}
	}
}
</script>

<template>
	<div class="px-3 pb-3 pt-1">

		<details class="p-2 border-bottom mb-3">
			<summary>Actions</summary>

			<div class="d-flex gap-3 pt-2">

				<div v-if="showMargin" class="col-3">
					<div class="input-group mb-3">
						<input type="number" class="form-control" placeholder="Apply margin to all" v-model="allMargin">
						<button class="btn btn-outline-primary" @click="applyMarginToAll">Apply</button>
					</div>
				</div>

				<!--
				<div class="col-3">
					<div class="input-group mb-3">
						<input type="number" class="form-control" placeholder="Apply price to all" v-model="allPrice">
						<button class="btn btn-outline-primary" @click="applyPriceToAll">Apply</button>
					</div>
				</div>
				-->

				<div class="col-3">
					<div class="input-group mb-3">
						<input type="number" class="form-control" placeholder="Apply cost to all" v-model="allCost">
						<button class="btn btn-outline-primary" @click="applyCostToAll">Apply</button>
					</div>
				</div>

				<div>
					<button class="btn btn-outline-primary" @click="addDefaultTiers">Add Default Tiers</button>
				</div>

			</div>
		</details>

		<div v-if="tiers">
			<Tier v-for="(tier, index) in tiers" :tier="tier" :index="index" :removeTier="removeTier" :showMargin="showMargin" :canDelete="canDeleteTiers" />
			<div class="mt-4">
				<button class="btn btn-outline-primary btn-sm" @click="addTier"><i class="bi bi-plus-square"></i> Tier
				</button>
			</div>
		</div>
	</div>
</template>