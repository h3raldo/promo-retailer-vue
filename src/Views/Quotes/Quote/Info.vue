<script setup>
import Events from "@/components/globals/properties/Events.vue";
import Address from "@/components/globals/properties/Address.vue";
</script>
<script>
export default {
	inject: ['order'],
	methods: {
	}
}
</script>

<template>
	<div class="row">
		
		<div class="col">
			
			<div class="row mb-3">
				<div class="col">
					<label class="form-label">Category:</label>
					<select class="form-select" id="status" v-model="order.info.category">
						<option value="standard">Standard</option>
						<option value="bid">Bid</option>
						<option value="idea">Idea</option>
					</select>
				</div>
				<div class="col">
					<label class="form-label">PO Number:</label>
					<input class="form-control" type="text" v-model="order.info.po_number" />
				</div>
			</div>

			<div class="row mb-3">
				<div class="col">
					<label class="form-label">Quote Date:</label>
					<div>
						<input type="date" class="form-control" placeholder="Date" v-model="order.info.date" >
					</div>
				</div>
				<div class="col">
					<label class="form-label">Ship By:</label>
					<input type="date" class="form-control" placeholder="Date" v-model="order.info.ship_by">
				</div>
				<div class="col">
					<div class="row justify-content-between">
						<div class="col">
							<label class="form-label">In-Hands By:</label>
						</div>
						<div class="col-auto">
							<label class="form-check-label">
								<input class="form-check-input me-1" type="checkbox" v-model="order.info.deliver_by_strict">
								<span>Strict?</span>
							</label>
						</div>
					</div>
					<input type="date" class="form-control" placeholder="In Hands Date" v-model="order.info.deliver_by">
				</div>
			</div>


			<div class="mb-3">
				<label class="">Events:</label>
				<div class="col">
					<div class="bg-light p-3">
						<Events :events="order.info.events" />
					</div>
				</div>
			</div>

			<div class="row mb-3">
				<div class="col">
					<label class="form-label">Client Name:</label>
					<input class="form-control" type="text" v-model="order.client.name" />
				</div>
				<div class="col">
					<label class="form-label">Client Email:</label>
					<input class="form-control" type="text" v-model="order.client.email" />
				</div>
			</div>

			<div class="mb-3">
				<label class="form-label">Client Info:</label>
				<textarea class="form-control" v-model="order.client.info"></textarea>
			</div>

			<div class="mb-3">
				<label class="form-label">Order Notes (Public):</label>
				<textarea class="form-control" v-model="order.info.notes.public"></textarea>
			</div>
			<div class="mb-3">
				<label class="form-label">Order Notes (Private):</label>
				<textarea class="form-control" v-model="order.info.notes.private"></textarea>
			</div>
		</div>
		<div class="col-5">
			<div class="mb-3" v-if="order.client.ship_to !== ''">
				<label class="form-label">Ship To:</label>
				<textarea class="form-control" v-model="order.client.ship_to" rows="4"></textarea>
				<div class="form-text">DO NOT USE. Use Shipping Address Instead.</div>
			</div>
			<div class="mb-3">
				<label class="form-label">Shipping Address:</label>
				<div>
					<Address :address="order.client.shipping" />
				</div>
			</div>
			<div class="mb-3">
				<label class="form-label">Billing Address:</label>
				<div>
					<Address :address="order.client.billing" />
				</div>
			</div>
		</div>
	</div>
</template>