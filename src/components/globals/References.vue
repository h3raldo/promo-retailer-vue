<script>
export default {
	inject: ['references'],
	methods: {
		referenceAction( reference ){
			let self = this;

			switch (reference.source){
				case 'order':
					return {
						title: 'View Order',
						action(){
							self.$router.push({
								name: 'orders_order',
								params: { id: reference.reference_number }
							});
						}
					}
				case 'po':
					return {
						title: 'View Purchase Order',
						action(){
							self.$router.push({
								name: 'purchase_orders_purchase_order',
								params: { id: reference.reference_number }
							});
						}
					}
				case 'quote':
					return {
						title: 'View Quote',
						action(){
							self.$router.push({
								name: 'quotes_quote',
								params: { id: reference.reference_number }
							});
						}
					}
			}

			return false;
		},
	}
}
</script>

<template>
	<table class="table" v-if="references && references.length > 0">
		<thead>
		<tr>
			<th class="col-1">Type</th>
			<th class="col-2">Reference Number</th>
			<th class="col-3"></th>
			<th></th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="reference in references" class="align-middle">
			<td>{{ reference.source.toUpperCase() }}</td>
			<td>{{ reference.reference_number }}</td>
			<td>{{ reference.title }}</td>
			<td>
				<button v-if="referenceAction(reference)" class="btn btn-outline-primary btn-sm" @click="referenceAction(reference).action">{{ referenceAction(reference).title }}</button>
			</td>
		</tr>
		</tbody>
	</table>

</template>