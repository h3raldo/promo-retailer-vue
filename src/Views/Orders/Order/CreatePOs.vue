<script>
	import utils from "@/js/utils.js";
	import entity from "@/js/entity.js";

	export default {
		data(){
			return {
				loading: false,
				created: {},
			}
		},
		props: ['goToPurchaseOrder'],
		inject: ['order', 'symfony'],
		computed: {
			suppliers(){
				let matched_item_count = 0;
				let missing_items = false;
				let counts = {}
				let available = [];

				this.order.items.forEach( i => {
					if( !i.info.supplier || !i.info.supplier.company_id ) return;

					let id = i.info.supplier.company_id;
					if( !counts[id] ) available.push(i.info.supplier);

					if( !counts[id] ) counts[id] = 1;
					else counts[id]++;
					matched_item_count++;
				})

				if( matched_item_count < this.order.items.length ) missing_items = true;

				this.order.items.forEach( item => {

					item.decoration.placements.forEach( p => {
						if( !p.decorator || !p.decorator.info || !p.decorator.info.id ) return;

						let id = entity.order.vendor.getDecoratorCompanyID( p.decorator.info.id );
						if( !id ) return;

						if( !counts[id] ) {
							available.push({
								name: p.decorator.info.name,
								company_id: id,
								decorator_id: p.decorator.info.id,
							});
						}

						let existing = available.filter( i => i.company_id+'' === id );
						if( existing[0] ) existing[0].decorator_id = p.decorator.info.id;

						if( !counts[id] ) counts[id] = 1;
						else counts[id]++;
					})

				})

				return { available, counts, missing_items };
			}
		},
		methods: {
			createPO(supplier){
				let self = this;
				self.loading = true;

				let init = {
					"source": "order",
					"source_id": this.order.id,
					"company": supplier.company_id
				}

				console.log(supplier);

				if( supplier.decorator_id ) init.decorator_code = supplier.decorator_id;

				utils.ajax( this.symfony.api.purchase_orders.order.new, res => {
					console.log(res);
					self.created[supplier.company_id] = res;
					self.loading = false;
				}, err => {
					console.log(err);
					self.loading = false;
				}, init )
			},
		}
	}
</script>
<template>
	<div v-if="suppliers.available.length">

		<span v-if="suppliers.missing_items" class="badge text-bg-danger mb-2">Some item(s) missing verified suppliers.</span>

		<table class="table">
			<thead>
			<tr>
				<th>ID</th>
				<th class="">Company</th>
				<th class="">Items/Placements</th>
				<th></th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="supplier in suppliers.available" class="align-middle">

				<td>{{ supplier.company_id }}</td>
				<td>{{ supplier.name }}</td>
				<td>{{ suppliers.counts[supplier.company_id] }}</td>
				<td>
					<template v-if="created[supplier.company_id]">
						<button class="btn btn-outline-primary btn-sm" @click="goToPurchaseOrder(created[supplier.company_id].id)">View Purchase Order</button>
					</template>
					<template v-else>
						<button class="btn btn-primary btn-sm" @click="createPO(supplier)" :disabled="loading">Create PO</button>
					</template>
				</td>
			</tr>
			</tbody>
		</table>
	</div>
	<div v-else>
		<h3>No available suppliers</h3>
		<p>Only suppliers that are set on an item AND a company has been created for in symfony will show up here.</p>
	</div>
</template>