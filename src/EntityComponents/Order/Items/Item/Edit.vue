<script setup>
import Options from "@/EntityComponents/Order/Items/Item/Options.vue";
import Decoration from "@/EntityComponents/Order/Items/Item/Decoration.vue";
import Tiers from "@/EntityComponents/Order/globals/cost/Tiers.vue";
import ListEditor from "@/EntityComponents/Order/globals/item/ListEditor.vue";
import Placements from "@/EntityComponents/Order/Items/Item/Decoration/Placements.vue";
import Notes from "@/EntityComponents/Order/Items/Item/Notes.vue";
import Info from "@/EntityComponents/Order/Items/Item/Info.vue";
</script>

<script>
import entity from "@/js/entity.js";
export default {
	data() {
		return {
			activeTab: 'info',
			addingDecorators: false
		}
	},

	inject: ['item', 'itemIndex', 'updatePricing', 'order'],

	computed: {
		showPlacements(){
			if( !this.order.config || !this.order.config.decoration ) return true;
			return this.order.config.decoration.placements;
		},
		showPrice(){
			if( !this.order.config )
				return true;

			return ( this.order.config.price )
		}
	},

	methods: {
		changeTab(tab, e)
		{
			this.$refs.tabs.querySelector('.active').classList.remove('active');
			this.activeTab = tab;
			e.target.classList.add('active');
		},
		sizeDeleted( size )
		{
			this.item.subitems.forEach( subitem => {
				if( typeof subitem.sizes[size.name] === 'object' ) delete subitem.sizes[size.name]
			})
		},
		sizeNameEdited( oldSizeName, newSizeName )
		{
			this.item.subitems.forEach( subitem => {
				let size = subitem.sizes[oldSizeName];
				if( typeof size !== 'object' ) return;

				subitem.sizes[newSizeName] = size;
				delete subitem.sizes[oldSizeName];
			})
		},
		addDefaultSizes()
		{
			entity.order.item.defaults.sizes().forEach( s => this.item.sizes.push(s) );
		},
		copyCostsToAll()
		{
			let tiers = this.item.cost.material.tiers;
			this.order.items.forEach( item => {
				if( item === this.item ) return;

				item.cost.material.tiers.length = 0;
				tiers.forEach( tier => {
					item.cost.material.tiers.push( JSON.parse(JSON.stringify(tier)) );
				})
			})
		}
	}
}
</script>

<template>
	<div>

		<nav>
			<div class="nav nav-tabs" id="nav-tab" role="tablist" ref="tabs">
				<button class="nav-link active" @click="changeTab('info', $event)">Info</button>
				<button class="nav-link" @click="changeTab('cost', $event)">Item Cost</button>
				<button class="nav-link" @click="changeTab('colors', $event)">Colors / Sizes</button>
				<button class="nav-link" @click="changeTab('decorators', $event)">Decorators</button>
				<button class="nav-link" @click="changeTab('placements', $event)">Placements</button>
				<button class="nav-link" @click="changeTab('options', $event)">Options</button>
				<button class="nav-link" @click="changeTab('notes', $event)">Notes</button>
				<button class="nav-link" @click="changeTab('personalization', $event)">Personalization</button>
			</div>
		</nav>

		<div class="tab-content pt-3">

			<!-- info -->
			<div v-if="activeTab==='info'">
				<Info />
			</div>

			<div v-if="activeTab==='notes'">
				<Notes />
			</div>

			<!-- options -->
			<div v-if="activeTab==='options'">
				<Options />
			</div>

			<!-- decorations -->
			<div v-if="activeTab==='decorators'">
				<Decoration />
			</div>

			<div v-if="activeTab==='placements'">
				<Placements />
			</div>

			<div v-if="activeTab==='personalization'">
				<div v-if="item.personalization && item.personalization.length > 0">
					<div v-for="personalization in item.personalization">
						<p class="fw-bold">{{ personalization.name }}</p>
						<table class="table table-striped table-sm">
							<tbody>
							<tr v-for="(value, key) in personalization.values">
								<td>{{key}}</td>
								<td>{{value}}</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div v-else>
					<h5>No Personalization</h5>
				</div>
			</div>

			<div v-if="activeTab==='colors'">
				<h5>Colors</h5>
				<div class="bg-light p-3">
					<ListEditor :list="item.colors" :textAttributes="['name']" :newItem="entity.order.item.color.create" :minimum="1" />
				</div>

				<h5 class="mt-4">Sizes</h5>
				<div class="bg-light p-3">
					<ListEditor :list="item.sizes" :textAttributes="['name']" :newItem="entity.order.item.size.create" :minimum="1" :deleted="sizeDeleted" :editedName="sizeNameEdited" :addDefaults="addDefaultSizes" />
				</div>
			</div>

			<!-- cost -->
			<div v-if="activeTab==='cost'">
				<div class="form-check form-switch pb-2">
					<input class="form-check-input" type="checkbox" role="switch" v-model="item.cost.material.visible">
					<label class="form-check-label">Show Cost Table</label>
				</div>
				<div class="bg-light border pb-2 pe-2">
					<Tiers :tiers="item.cost.material.tiers" :showMargin="true" />
				</div>

				<div class="mt-2">
					<h6>Price should overwrite: </h6>
					<div>
						<label class="form-check-label">
							<input class="form-check-input me-1" type="checkbox" v-model="item.pricing.base.material.overwrites.decoration">
							<span>Decoration</span>
						</label>
					</div>
					<div>
						<label class="form-check-label">
							<input class="form-check-input me-1" type="checkbox" v-model="item.pricing.base.material.overwrites.color">
							<span>Color</span>
						</label>
					</div>
					<div>
						<label class="form-check-label">
							<input class="form-check-input me-1" type="checkbox" v-model="item.pricing.base.material.overwrites.size">
							<span>Size</span>
						</label>
					</div>
					<div>
						<label class="form-check-label">
							<input class="form-check-input me-1" type="checkbox" v-model="item.pricing.base.material.overwrites.options">
							<span>Options</span>
						</label>
					</div>
				</div>

				<div class="pt-3">
					<button class="btn btn-outline-secondary btn-sm" @click="copyCostsToAll"><i class="bi bi-copy"></i> Copy Cost to All Items</button>
				</div>

			</div>
		</div>

	</div>
</template>