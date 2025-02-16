<script setup>
import Tabs from "@/components/globals/Tabs.vue";
import Loader from "@/components/globals/Loader.vue";
import SearchDecorationSets from "@/EntityComponents/Decorations/SearchDecorationSets.vue";
import SearchDecorationGroups from "@/EntityComponents/Decorations/SearchDecorationGroups.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data(){
		return {
			loading: {
				data: false,
			},
			tabs: ['Filters', 'Decoration_Sets', 'Overwrites'],
			filters: [
				{ code: 'color', title: 'Color' },
				{ code: 'color_secondary', title: 'Color (Secondary)'},
				{ code: 'color_parent', title: 'Parent Color'},
				{ code: 'color_parent_secondary', title: 'Parent Color (Secondary)'},
				{ code: 'size', title: 'Size'},
			],
			overwrites: [
				{code: 'margin', title: 'Margin'},
				{code: 'price', title: 'Price'},
				{code: 'cost', title: 'Cost'},
			],
			available: {
				color: [],
				color_secondary: [],
				color_parent: [],
				color_parent_secondary: [],
				size: [],
			}
		}
	},
	props: ['rule', 'index'],
	inject: ['symfony'],
	methods: {
		addFilter(){
			this.rule.filters.push({
				attribute: 'color',
				value: []
			})
		},

		selectDecorationSet(set){
			this.rule.decoration_sets.push({
				id: set,
			})
		},

		selectDecorationGroup(group){
			this.rule.decoration_groups.push({
				id: group.id,
				name: group.name,
			})
		},

		addOverwrite(){
			this.rule.overwrites.push({
				attribute: 'margin',
				value: '',
			})
		},

		openModal()
		{
			if( this.rule.type !== 'product') return;

			this.loading.data = true;
			utils.ajax(this.symfony.api.products.product.variant.available.replace(':id', this.rule.entity.product.id), (d) => {
				Object.keys(d.response).forEach(key => {
					this.available[key] = d.response[key];
				})
				this.loading.data = false;
			})
		}
	},
	watch: {
		rule(){
			this.openModal();
		}
	},
	mounted() {
		if( typeof this.rule.decoration_groups === 'undefined' ) this.rule.decoration_groups = [];
		this.openModal();
	}
}
</script>
<template>
	<Loader v-if="loading.data" />
	<Tabs v-else :labels="tabs">
		<template #Filters>
			<div v-for="filter in rule.filters" class="d-flex gap-1 border-bottom py-2 my-2">
				<div>
					<button class="btn btn-outline-danger btn-sm" @click="rule.filters.splice(rule.filters.indexOf(filter), 1)"><i class="bi bi-x"></i></button>
				</div>
				<div class="col-2">
					<select class="form-select form-select-sm mb-2" v-model="filter.attribute">
						<option v-for="filter in filters" :value="filter.code">{{ filter.title }}</option>
					</select>
				</div>
				<div>:</div>
				<div class="d-flex gap-2 flex-wrap flex-fill">
					<div v-for="option in available[filter.attribute]" >
						<label class="form-check-label bg-gray px-2 rounded small">
							<input class="form-check-input me-1" type="checkbox" v-model="filter.value" :value="option">
							<span>{{ option }}</span>
						</label>
					</div>
				</div>
			</div>
			<button class="btn btn-outline-primary btn-sm" @click="addFilter">Add Filter</button>
		</template>
		<template #Decoration_Sets>

			<div class="d-flex gap-2 mb-3">
				<div class="flex-fill">
					<h4>Decoration Sets</h4>
					<div class="d-flex gap-2 mb-3">
						<span class="badge text-bg-secondary" v-for="(set, si) in rule.decoration_sets">{{ set.id }} <a @click.prevent="rule.decoration_sets.splice(si,1)" class="text-white" href="#">x</a></span>
					</div>
					<SearchDecorationSets :id="index" :onSelect="selectDecorationSet" />
				</div>

				<div class="col-6">
					<h4>Decoration Groups</h4>
					<div class="d-flex gap-2 mb-3">
						<span class="badge text-bg-secondary" v-for="(group, gi) in rule.decoration_groups">{{ group.id }} <a @click.prevent="rule.decoration_groups.splice(gi,1)" class="text-white" href="#">x</a></span>
					</div>
					<SearchDecorationGroups :id="index" :onSelect="selectDecorationGroup" />
				</div>
			</div>


		</template>
		<template #Overwrites>
			<p>Note: Applies to all Variants</p>

			<div v-for="overwrite in rule.overwrites" class="d-flex gap-1">
				<div>
					<button class="btn btn-outline-danger btn-sm" @click="rule.overwrites.splice(rule.overwrites.indexOf(overwrite), 1)"><i class="bi bi-x"></i></button>
				</div>
				<div class="col">
					<select class="form-select form-select-sm mb-2" v-model="overwrite.attribute">
						<option v-for="overwrite in overwrites" :value="overwrite.code">{{ overwrite.title }}</option>
					</select>
				</div>
				<div>:</div>
				<div class="col">
					<input type="text" class="form-control form-control-sm" v-model="overwrite.value">
				</div>
			</div>
			<button class="btn btn-outline-primary btn-sm" @click="addOverwrite">Add Overwrite</button>
		</template>
	</Tabs>
</template>
