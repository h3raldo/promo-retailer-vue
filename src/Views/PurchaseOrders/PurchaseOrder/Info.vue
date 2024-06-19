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

	<div class="d-flex flex-column gap-3">

		<div class="d-flex gap-4 align-items-center">
			<label class="col-2 text-end">Date:</label>
			<div class="col-2">
				<input type="date" class="form-control" placeholder="Date"
					   v-model="po.info.date">
			</div>
		</div>

		<div class="d-flex gap-4 align-items-center">
			<label class="col-2 text-end">In-Hands Date:</label>
			<div class="col-2">
				<input type="date" class="form-control" placeholder="Date"
					   v-model="po.info.deliver_by">
			</div>
			<div>
				Strict?
			</div>
			<div class="col-2">
				<select class="form-select" id="status" v-model="po.info.deliver_by_strict">
					<option :value="true">Yes</option>
					<option :value="false">No</option>
				</select>
			</div>
		</div>

		<div class="d-flex gap-4 align-items-center">
			<label class="col-2 text-end">Follow-Up Date:</label>
			<div class="col-2">
				<input type="date" class="form-control" placeholder="Date"
					   v-model="po.info.follow_up_date">
			</div>
			<div>
				Note:
			</div>
			<div class="col">
				<input class="form-control" type="text" v-model="po.info.follow_up_note"/>
			</div>
		</div>

		<div class="d-flex gap-4 align-items-center">
			<label class="col-2 text-end">Events:</label>
			<div class="col">
				<div class="bg-light p-3">
					<Events :events="po.info.events" />
				</div>
			</div>
		</div>

		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Vendor:</label>
			<input class="form-control" type="text" v-model="po.info.vendor.name"/>
		</div>

		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Ship To:</label>
			<div class="col-5">
				<textarea class="form-control" v-model="po.info.ship_to" rows="4"></textarea>
			</div>
			<div class="col-5" v-if="hasOrderShipTo">
				<pre>{{ entities.order.order.client.ship_to }}</pre>
				<button class="btn btn-outline-primary" @click="copyToShipTo">Use Order Shipping Address</button>
			</div>
		</div>

		<div class="d-flex gap-4">
			<div class="col-2"></div>
			<div>
				<label class="form-check-label">
					<input class="form-check-input me-1" type="checkbox" v-model="po.info.ship_blind">
					Blind Ship
				</label>
			</div>
		</div>

		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Bill To:</label>
			<div class="col-5">
				<textarea class="form-control" v-model="po.info.bill_to" rows="4"></textarea>
			</div>
		</div>

		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Notes (Public):</label>
			<textarea class="form-control" v-model="po.info.notes.public"></textarea>
		</div>

		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Notes (Private):</label>
			<textarea class="form-control" v-model="po.info.notes.private"></textarea>
		</div>
	</div>
</template>