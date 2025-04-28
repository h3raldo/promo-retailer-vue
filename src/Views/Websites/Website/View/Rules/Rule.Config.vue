<script setup>
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['rule'],
	inject: [],
	methods: {
		getArrayAsString(array, property){
			let items = [];
			array.forEach(item => {
				items.push(item[property]);
			});
			return items.join(', ');
		}
	}
}
</script>
<template>
	<small v-for="overwrite in rule.overwrites" class="d-flex gap-1">
		<span><span class="badge text-bg-warning">{{ overwrite.attribute }}</span></span>
		<span>:</span>
		<span>{{ overwrite.value }}</span>
	</small>
	<template v-if="rule?.inputs?.length">
	<small class="d-flex gap-1">
		<span><span class="badge text-bg-warning">input fields</span></span>
		<span>:</span>
		<span>{{ getArrayAsString(rule.inputs, 'id') }}</span>
	</small>
	</template>
	<small v-if="rule.decoration_sets.length" class="d-flex gap-1">
		<span><span class="badge text-bg-warning">decoration sets</span></span>
		<span>:</span>
		<span>
			<span class="" v-for="set in rule.decoration_sets">
				<span class="text-nowrap">{{ set.id }}, </span>
			</span>
		</span>
	</small>
	<div v-if="rule.decoration_groups && rule.decoration_groups.length" class="d-flex gap-1">
		<div><span class="badge text-bg-warning">decoration groups</span></div>
		<div>:</div>
		<div>
			<span class="d-block" v-for="group in rule.decoration_groups">
				<span class="text-nowrap">{{ group.id }}, </span>
			</span>
		</div>
	</div>
</template>
