<script setup>
import Events from "@/components/globals/properties/Events.vue";
import Address from "@/components/globals/properties/Address.vue";
</script>
<script>
import entity from "@/js/entity.js";
import utils from "@/js/utils.js";

export default {
	inject: ['order'],
	computed: {
		isShippingSameAsBilling(){
			return this.order.client.billing === this.order.client.shipping;
		}
	},
	methods: {
		addAttribute()
		{
			this.order.info.attributes.push( entity.order.attribute.create() );
		},
		removeAttribute(i)
		{
			this.order.info.attributes.splice(i, 1);
		},
		deliverByChanged(){
			if( this.order.info.deliver_by === '' || this.order.info.ship_by !== '' ) return
			this.order.info.ship_by = utils.time.removeDays(this.order.info.deliver_by, 3);
		},
		setBillingSameAsShipping(e){
			if( e.target.checked ){
				this.order.client.billing = this.order.client.shipping;
			} else {
				this.order.client.billing = entity.customer.address.create(this.order.client.billing)
			}
		}
	}
}
</script>
<template>

	<div class="row">

		<div class="col">

			<div class="row mb-3">
				<div class="col">
					<label class="form-label">Date:</label>
					<input type="date" class="form-control" placeholder="Date" v-model="order.info.date">
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
					<input type="date" class="form-control" placeholder="In Hands Date" v-model="order.info.deliver_by" @change="deliverByChanged">
				</div>
			</div>

			<div class="mb-3 row">
				<div class="col">
					<label class="form-label">Payment Method:</label>
					<select v-model="order.info.payment_method" class="form-select">
						<option value="">-</option>
						<option value="Credit Card">Credit Card</option>
						<option value="Purchase Order">Purchase Order</option>
						<option value="No Payment Necessary">No Payment Necessary</option>
					</select>
				</div>
				<div class="col">
					<label class="form-label">PO Number:</label>
					<input class="form-control" type="text" v-model="order.info.po_number" />
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

			<div class="mb-3 row">
				<div class="col">
					<label class="form-label">Client Name:</label>
					<input class="form-control" type="text" v-model="order.client.name"/>
				</div>
				<div class="col">
					<label class="form-label">Client Email:</label>
					<input class="form-control" type="text" v-model="order.client.email"/>
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

			<div v-for="(attribute, i) in order.info.attributes" class="d-flex gap-2 align-items-center mb-1">
				<div class="col-2">
					<input class="form-control text-end" type="text" placeholder="Name" v-model="attribute.name">
				</div>
				<div>:</div>
				<input class="form-control" type="text" placeholder="Value" v-model="attribute.value">
				<div>
					<button class="btn btn-outline-danger" @click="removeAttribute(i)"><i class="bi bi-trash"></i></button>
				</div>
			</div>

			<div class="mt-2">
				<button class="btn btn-primary" @click="addAttribute"><i class="bi bi-plus-circle"></i> Add Attribute</button>
			</div>
		</div>

		<div class="col-5">

			<div class="mb-3" v-if="order.client.ship_to !== ''">
				<label class="form-label">Ship To:</label>
				<textarea class="form-control" v-model="order.client.ship_to" rows="4"></textarea>
				<div class="form-text">DO NOT USE. Use Shipping Address Instead.</div>
			</div>

			<div class="mb-3">
				<label class="form-label">Shipping Method:</label>
				<textarea class="form-control" v-model="order.info.delivery_method"></textarea>
			</div>

			<div class="mb-3">
				<label class="form-label">Shipping Address:</label>
				<div>
					<Address :address="order.client.shipping" />
				</div>
			</div>

			<div class="mb-3">
				<label class="form-label d-flex gap-3">
					Billing Address:
					<label class="form-check-label">
						<input class="form-check-input me-1" type="checkbox" @change="setBillingSameAsShipping" :checked="isShippingSameAsBilling">
						<span>Same as Shipping</span>
					</label>
				</label>
				<div v-if="!isShippingSameAsBilling">
					<Address :address="order.client.billing" />
				</div>
			</div>

			<div class="mb-3">
				<label class="form-label">Date Shipped:</label>
				<input class="form-control" type="date" v-model="order.info.shipped">
			</div>
		</div>

	</div>
</template>