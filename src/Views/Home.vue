<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>

<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			loading: false,
			items: []
		}
	},
	inject: ['symfony'],
	methods: {
		load(){
			let self = this;
			let url = this.symfony.api.entity.events;
			self.loading = true;

			utils.ajax(url, (data) => {
				data.results.forEach( e => self.items.push(e) );
				console.log(self.items);
				self.loading = false;
			})
		},
		formatDate(date)
		{
			if( !date ) return '-';
			return utils.time.dateToNiceString(date);
		},
		getView( type, id ){
			switch (type){
				case 'order':
					this.$router.push({
						name: 'orders_order',
						params: { id }
					});
					break;
				case 'po':
					this.$router.push({
						name: 'purchase_orders_purchase_order',
						params: { id }
					});
					break;
				case 'quote':
					this.$router.push({
						name: 'quotes_quote',
						params: { id }
					});
					break;
			}

			return false;
		}
	},
	mounted() {
		this.load();
	}
}
</script>

<template>

	<h1 class="pb-4">Dashboard</h1>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"> Events</h3>
		</div>
	</div>

	<Loader v-if="loading" />

	<template v-if="!loading">

		<table class="table" v-if="items.length">
			<thead>
			<tr>
				<th>Date</th>
				<th>Status</th>
				<th>Type</th>
				<th>Note</th>
				<th></th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="item in items" class="align-middle">
				<td>
					{{ formatDate(item.date) }}
				</td>
				<td>
					{{ item.entity_status }}
				</td>
				<td>
					<span class="d-block small">{{ item.entity.toUpperCase() }} {{ item.entity_id }}</span>
					{{ item.entity_title }}
				</td>
				<td>
					<span class="badge text-bg-secondary">{{ item.type }}</span><br>
					{{ item.note }}
				</td>
				<td>
					<button class="btn btn-primary" @click="getView(item.entity, item.entity_id)">View</button>
				</td>
			</tr>
			</tbody>
		</table>

		<p v-if="!items.length">
			No events found.
		</p>

	</template>
</template>