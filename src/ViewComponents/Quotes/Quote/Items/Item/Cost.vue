<script setup>
import pricing from "@/js/Quotes/Quote/pricing.js";
</script>

<script>
import pricing from "@/js/Quotes/Quote/pricing.js";

export default {
	data() {
		return {

		}
	},

	inject: ['item'],

	computed:{
		visibleOptions(){
			return this.item.options.filter( o => {
				if( !o.visible ) return false;
				return o.groups.filter( g => g.values.filter( v => v.cost.length > 0 ).length > 0 ).length > 0
			});
		}
	},

	methods: {
		getQtyBreaks( group ){
			let qtys = [];

			group.values.forEach( v => {
				v.cost.forEach( c => {
					if( !qtys.includes(c.qty) ) qtys.push(c.qty);
				})
			})

			return qtys.sort((a,b) => a-b);
		},
		combinePriceBreaks( tiers ){
			return pricing.tiers.combinePriceBreaks(tiers);
		}
	}
}
</script>

<template>
	<div>

		<template v-if="item.cost.material.tiers.length > 0 || visibleOptions.length > 0">

			<table v-if="item.cost.material.tiers.length > 0 && item.cost.material.visible && item.cost.combined[0]" class="table table-striped-columns border">
				<thead>
					<tr>
						<th>Qty</th>
						<th v-for="tier in item.cost.combined[0].tiers">{{ tier.qty }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(group, i) in item.cost.combined">
						<td>
							<span v-if="item.cost.combined.length <= 1">Price</span>
							<span v-else>{{ group.name }}</span>
						</td>
						<td v-for="tier in group.tiers">
							<span v-if="i > 0">+</span>{{ pricing.format(tier.price) }}
						</td>
					</tr>
				</tbody>
			</table>

			<div v-for="option in visibleOptions">
				<table class="table table-striped-columns border">

					<template v-for="group in option.groups">
						<thead>
							<tr>
								<th>{{ option.name }} <span v-if="option.groups.length > 1">{{ group.name }}</span></th>
								<th v-for="qty in getQtyBreaks(group)">{{ qty }}</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="value in combinePriceBreaks(group.values)">
								<td>{{ value.name }}</td>
								<td v-for="cost in value.cost">
									+{{ pricing.format(cost.price) }}
								</td>
							</tr>
						</tbody>
					</template>

				</table>
			</div>

		</template>

		<template v-else>
			<div class="alert alert-warning" role="alert">
				No pricing on item
			</div>
		</template>
	</div>
</template>