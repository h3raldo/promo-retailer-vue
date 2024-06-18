<script setup>
import Events from "@/components/globals/properties/Events.vue";
</script>
<script>
import entity from "@/js/entity.js";

export default {
	inject: ['order'],
	methods: {
		addAttribute()
		{
			this.order.info.attributes.push( entity.order.attribute.create() );
		},
		removeAttribute(i)
		{
			this.order.info.attributes.splice(i, 1);
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
					   v-model="order.info.date">
			</div>
		</div>
		<div class="d-flex gap-4 align-items-center">
			<label class="col-2 text-end">In-Hands Date:</label>
			<div class="col-2">
				<input type="date" class="form-control" placeholder="In Hands Date"
					   v-model="order.info.deliver_by">
			</div>
			<div>
				<label>Is Firm?</label>
			</div>
			<div class="col-2">
				<select class="form-select" id="status" v-model="order.info.deliver_by_strict">
					<option :value="true">Yes</option>
					<option :value="false">No</option>
				</select>
			</div>
		</div>
		<div class="d-flex gap-4 align-items-center">
			<label class="col-2 text-end">Events:</label>
			<div class="col">
				<div class="bg-light p-3">
					<Events :events="order.info.events" />
				</div>
			</div>
		</div>
		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">PO Number:</label>
			<input class="form-control" type="text" v-model="order.info.po_number" />
		</div>
		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Client Name:</label>
			<input class="form-control" type="text" v-model="order.client.name"/>
		</div>
		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Client Email:</label>
			<input class="form-control" type="text" v-model="order.client.email"/>
		</div>
		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Client Info:</label>
			<textarea class="form-control" v-model="order.client.info"></textarea>
		</div>
		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Ship To:</label>
			<textarea class="form-control" v-model="order.client.ship_to"></textarea>
		</div>
		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Order Notes (Public):</label>
			<textarea class="form-control" v-model="order.info.notes.public"></textarea>
		</div>
		<div class="d-flex gap-4">
			<label class="form-label col-2 text-end pt-2">Order Notes (Private):</label>
			<textarea class="form-control" v-model="order.info.notes.private"></textarea>
		</div>

		<div v-for="(attribute, i) in order.info.attributes" class="d-flex gap-2 align-items-center">
			<div class="col-2">
				<input class="form-control text-end" type="text" placeholder="Name" v-model="attribute.name">
			</div>
			<div>:</div>
			<input class="form-control" type="text" placeholder="Value" v-model="attribute.value">
			<div>
				<button class="btn btn-outline-danger" @click="removeAttribute(i)">Remove</button>
			</div>
		</div>

		<div class="d-flex gap-4">
			<div class="col-2"></div>
			<div>
				<button class="btn btn-primary" @click="addAttribute"><i class="bi bi-plus-circle"></i> Add Attribute</button>
			</div>
		</div>
	</div>
</template>