<script setup>
import Events from "@/components/globals/properties/Events.vue";
import Address from "@/components/globals/properties/Address.vue";
import SelectOrCustom from "@/EntityComponents/Order/globals/item/SelectOrCustom.vue";
</script>
<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	inject: ['order', 'entities'],
	computed: {
		isShippingSameAsBilling(){
			return this.order.client.billing === this.order.client.shipping;
		},
		companyId()
		{
			if( !this.order.info.company || !this.order.info.company.id ) return false
			return this.order.info.company.id;
		}
	},
	methods: {
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
		},
		copyAddressFromCompany(type){
			if( !this.entities || !this.entities.company ) return;

			let address = this.entities.company.data[type].address;
			this.order.client[type] = address;
		}
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
					<input type="date" class="form-control" placeholder="In Hands Date" v-model="order.info.deliver_by" @change="deliverByChanged">
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
				<label class="form-label">Shipping Method:</label>
				<SelectOrCustom :array="['Ground', 'Courier', 'Overnight', 'Will Call',]" :type="'textarea'" v-model="order.info.delivery_method" />
			</div>
			<div class="mb-3">
				<label class="form-label">Shipping Address:</label>
				<div>
					<Address :address="order.client.shipping" />
				</div>
				<button v-if="companyId" class="btn btn-sm btn-outline-primary" @click="copyAddressFromCompany('shipping')">Copy from Company</button>
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
				<button v-if="companyId" class="btn btn-sm btn-outline-primary" @click="copyAddressFromCompany('billing')">Copy from Company</button>
			</div>
		</div>
	</div>
</template>