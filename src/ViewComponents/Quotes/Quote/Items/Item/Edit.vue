<script setup>
import Options from "@/ViewComponents/Quotes/Quote/Items/Item/Options.vue";
import Decoration from "@/ViewComponents/Quotes/Quote/Items/Item/Decoration.vue";
import Tiers from "@/ViewComponents/Quotes/Quote/globals/cost/Tiers.vue";
import ListEditor from "@/ViewComponents/Quotes/Quote/globals/item/ListEditor.vue";
import Placements from "@/ViewComponents/Quotes/Quote/Items/Item/Decoration/Placements.vue";
import Notes from "@/ViewComponents/Quotes/Quote/Items/Item/Notes.vue";
import Info from "@/ViewComponents/Quotes/Quote/Items/Item/Info.vue";
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

	inject: ['item', 'itemIndex', 'updatePricing'],

	computed: {
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

			<div v-if="activeTab==='colors'">
				<h5>Colors</h5>
				<div class="bg-light p-3">
					<ListEditor :list="item.colors" :textAttributes="['name']" :newItem="entity.quote.item.color.create" :minimum="1" />
				</div>

				<h5 class="mt-4">Sizes</h5>
				<div class="bg-light p-3">
					<ListEditor :list="item.sizes" :textAttributes="['name']" :newItem="entity.quote.item.size.create" :minimum="1" :deleted="sizeDeleted" :editedName="sizeNameEdited" />
				</div>
			</div>

			<!-- cost -->
			<div v-if="activeTab==='cost'">
				<div class="form-check form-switch pb-2">
					<input class="form-check-input" type="checkbox" role="switch" v-model="item.cost.material.visible">
					<label class="form-check-label">Show Cost Table</label>
				</div>
				<div class="bg-light border">
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
			</div>
		</div>

	</div>
</template>