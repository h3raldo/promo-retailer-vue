<script>
export default {
	data(){
		return {
			rules: [
				{
					group: '1717',
					supplier: 'sanmar',
					filters: [{attribute: 'sub_color_1', value: 'blue jean'}],
					decoration_sets: [{id: 'ftbkxxxx-proscr'}],
					overwrites: [{attribute: 'margin', value: '32%'}],
				},
				{
					group: '6014',
					supplier: 'sanmar',
					filters: [{attribute: 'sub_color_1', value: 'blue jean'}],
					decoration_sets: [{id: 'ftbkxxxx-proscr'}],
					overwrites: [{attribute: 'margin', value: '32%'}],
				},
				{
					group: '1566',
					supplier: 'S&S',
					filters: [{attribute: 'sub_color_1', value: 'blue jean'}],
					decoration_sets: [{id: 'ftbkxxxx-proscr'}],
					overwrites: [{attribute: 'margin', value: '32%'}],
				}
			]
		}
	}
}
</script>
<template>
	<h5>Product Rules</h5>
	<table class="table">
		<thead>
		<tr>
			<th>Group ID</th>
			<th>Supplier</th>
			<th>Filters</th>
			<th>Decoration Sets</th>
			<th>Overwrites</th>
			<th>-</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="rule in rules">
			<td>{{ rule.group }}</td>
			<td>{{ rule.supplier }}</td>
			<td>
				<div v-for="filter in rule.filters">
					{{ filter.attribute }}: <span class="badge text-bg-secondary">{{ filter.value }}</span>
				</div>
			</td>
			<td>
				<div v-for="set in rule.decoration_sets">{{ set.id }}</div>
			</td>
			<td>
				<div v-for="overwrite in rule.overwrites">{{ overwrite.attribute }}: <span class="badge text-bg-secondary">{{ overwrite.value }}</span></div>
			</td>
			<td>
				<button class="btn btn-sm btn-danger">Remove</button>
			</td>
		</tr>
		</tbody>
		<tfoot></tfoot>
	</table>
</template>