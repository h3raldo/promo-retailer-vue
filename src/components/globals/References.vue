<script setup>
	import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>

<script>
export default {
	inject: ['references', 'symfony'],
	methods: {
		referenceAction( reference ){
			let self = this;

			switch (reference.source){
				case 'order':
					return [
						{
							title: 'View Order',
							type: 'view',
							action(){
								self.$router.push({
									name: 'orders_order',
									params: { id: reference.reference_number }
								});
							}
						}
					];
				case 'po':
					return [
						{
							title: 'View PO',
							type: 'view',
							action() {
								self.$router.push({
									name: 'purchase_orders_purchase_order',
									params: {id: reference.reference_number}
								});
							}
						},
						{
							title: 'Delete',
							type: 'delete',
							action() {
								window.location = self.symfony.api.purchase_orders.order.delete.replace(':id', reference.reference_number) + '?return=' + window.location ;
							}
						}
					];
				case 'quote':
					return [
						{
							title: 'View Quote',
							type: 'view',
							action() {
								self.$router.push({
									name: 'quotes_quote',
									params: {id: reference.reference_number}
								});
							}
						}
					]
			}

			return [];
		}
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
			<th class="col-3">Status</th>
			<th></th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="reference in references" class="align-middle">
			<td>{{ reference.source.toUpperCase() }}</td>
			<td>{{ reference.reference_number }}</td>
			<td>{{ reference.title }}</td>
			<td>{{ reference.status }}</td>
			<td>
				<div class="d-flex gap-3">
					<template v-for="action in referenceAction(reference)">
						<template v-if="action.type === 'delete'">
							<Modal :id="'delete-item-confirm-'+reference.reference_number" :title="'Are you sure?'"  :icon="'bi-trash'" :buttonClasses="'btn btn-danger'" :buttonText="action.title">
								<p>{{ reference.source.toUpperCase() }} {{ reference.reference_number }} will be deleted permanently. Cannot be undone.</p>
								<button class="btn btn-danger"  @click="action.action"><i class="bi bi-trash"></i> {{ action.title }}</button>
							</Modal>
						</template>

						<template v-else-if="action.type === 'view'">
							<button class="btn btn-outline-primary" @click="action.action"><i class="bi bi-arrow-right-circle"></i> {{ action.title }}</button>
						</template>
					</template>
				</div>
			</td>
		</tr>
		</tbody>
	</table>

</template>