<script setup>
import RuleConfig from "@/Views/Websites/Website/View/Rules/Rule.Config.vue";
import RuleEdit from "@/Views/Websites/Website/View/Rules/Rule.Edit.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
export default {
	data() {
		return {
			edit: false,
			rule: {
				filters: [],
				decoration_sets: [],
				decoration_groups: [],
				overwrites: [],
				inputs: [],
				type: 'product'
			}
		}
	},
	props: ['category'],
	inject: [],
	computed: {
		allProductIds(){
			let ids = {};
			this.category.rules.forEach(rule => {
				let id = rule?.rule?.entity?.product?.id;
				if( id ) ids[id] = true;
			})
			return Object.keys(ids);
		}
	},
	methods: {
		openModal(){
			this.edit = true;
			this.$refs.editModal.$refs.openModalButton.click();
		},
		clear(type){
			this.category.rules.forEach(rule => {
				rule.rule[type] = [];
			})
		},
		apply(){
			this.category.rules.forEach(rule => {
				if( this.rule.filters.length ){
					rule.rule.filters = [];
					this.rule.filters.forEach( f => rule.rule.filters.push(f) );
				}
				if( this.rule.decoration_sets.length ) {
					rule.rule.decoration_sets = [];
					this.rule.decoration_sets.forEach(d => rule.rule.decoration_sets.push(d));
				}
				if( this.rule.decoration_groups.length ) {
					rule.rule.decoration_groups = [];
					this.rule.decoration_groups.forEach(d => rule.rule.decoration_groups.push(d));
				}
				if( this.rule.overwrites.length ) {
					rule.rule.overwrites = [];
					this.rule.overwrites.forEach(o => rule.rule.overwrites.push(o));
				}
				if( this.rule.inputs.length ) {
					rule.rule.inputs = [];
					this.rule.inputs.forEach(i => rule.rule.inputs.push(i));
				}
			})
		}
	}
}
</script>
<template>
	<div class="d-flex justify-content-between gap-2 align-items-center">
		<div class="d-flex gap-2 align-items-center">
			<span>Bulk Edit This Category:</span>
			<button class="btn btn-sm btn-outline-secondary" @click="openModal">Edit</button>
			<button class="btn btn-sm btn-outline-primary" @click="apply">Apply</button>

			<div class="dropdown">
				<button class="btn btn-danger dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					Clear
				</button>
				<ul class="dropdown-menu">
					<li><button class="dropdown-item" @click="clear('decoration_sets')">Clear Sets</button></li>
					<li><button class="dropdown-item" @click="clear('decoration_groups')">Clear Groups</button></li>
					<li><button class="dropdown-item" @click="clear('overwrites')">Clear Overwrites</button></li>
					<li><button class="dropdown-item" @click="clear('filters')">Clear Filters</button></li>
				</ul>
			</div>

		</div>
		<div>
			<div v-for="filter in rule.filters" :key="filter.id">
				{{ filter.attribute }}: {{ filter.value.join(', ') }}
			</div>
			<RuleConfig :rule="rule" />
		</div>
	</div>
	<Modal title="Edit Rule" buttonClasses="btn btn-sm btn-primary d-none" icon="bi-pencil" ref="editModal">
		<RuleEdit v-if="edit" :rule="rule" :index="33333" :product_ids="allProductIds" />
	</Modal>
</template>
