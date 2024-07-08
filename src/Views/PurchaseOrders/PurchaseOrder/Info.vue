<script setup>
import Events from "@/components/globals/properties/Events.vue";
</script>
<script>
export default {
	data(){
		return {

		}
	},
	inject: ['po', 'entities'],
	computed: {
		hasOrderShipTo(){
			return this.entities.order
			  && this.entities.order.order
			  && this.entities.order.order.client
			  && this.entities.order.order.client.ship_to
		}
	},
	methods: {
		copyToShipTo(){
			this.po.info.ship_to = this.entities.order.order.client.ship_to;
		}
	}
}
</script>

<template>

	<div class="row">
		<div class="col">

			<div class="mb-3">
				<label class="form-label">Vendor:</label>
				<input class="form-control" type="text" v-model="po.info.vendor.name"/>
			</div>

			<div class="row mb-3">
				<div class="col">
					<label class="form-label">Date:</label>
					<input type="date" class="form-control" placeholder="Date" v-model="po.info.date">
				</div>
				<div class="col">
					<label class="form-label">In-Hands Date:</label>
					<input type="date" class="form-control" placeholder="Date" v-model="po.info.deliver_by">
				</div>
				<div class="col">
					<label class="form-label">Strict?</label>
					<select class="form-select" id="status" v-model="po.info.deliver_by_strict">
						<option :value="true">Yes</option>
						<option :value="false">No</option>
					</select>
				</div>
			</div>

			<div class="mb-3">
				<label class="form-label">Events:</label>
				<div class="col">
					<div class="bg-light p-3">
						<Events :events="po.info.events" />
					</div>
				</div>
			</div>

			<div class="mb-3">
				<label class="form-label">Notes (Public):</label>
				<textarea class="form-control" v-model="po.info.notes.public"></textarea>
			</div>

			<div class="mb-3">
				<label class="form-label">Notes (Private):</label>
				<textarea class="form-control" v-model="po.info.notes.private"></textarea>
			</div>
		</div>

		<div class="col-5">
			<div class="mb-3">
				<label class="form-label">Ship To:</label>
				<textarea class="form-control" v-model="po.info.ship_to" rows="4"></textarea>

				<label class="form-check-label mt-2">
					<input class="form-check-input me-1" type="checkbox" v-model="po.info.ship_blind">
					Blind Ship
				</label>
			</div>


			<div class="row" v-if="hasOrderShipTo">
				<div class="col">
					<button class="btn btn-outline-primary" @click="copyToShipTo">Use Order Shipping Address</button>
				</div>
				<div class="col">
					<pre>{{ entities.order.order.client.ship_to }}</pre>
				</div>
			</div>

			<div class="mb-3">
				<label class="form-label">Bill To:</label>
				<textarea class="form-control" v-model="po.info.bill_to" rows="4"></textarea>
			</div>
		</div>
	</div>
</template>