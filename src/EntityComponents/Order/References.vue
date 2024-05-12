<script>
export default {
	inject: ['order', 'references'],
	methods: {
		goToQuote(id){
			this.$router.push({
				name: 'quotes_quote',
				params: { id }
			});
		},
	}
}
</script>

<template>
	<table class="table" v-if="references">
		<thead>
		<tr>
			<th>Source</th>
			<th>Reference Number</th>
			<th></th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="reference in references" class="align-middle">
			<td>{{ reference.source.toUpperCase() }}</td>
			<td>{{ reference.reference_number }}</td>
			<td>
				<button v-if="reference.action" class="btn btn-outline-primary btn-sm" @click="reference.action.click">{{ reference.action.title }}</button>
			</td>
		</tr>
		</tbody>
	</table>

</template>