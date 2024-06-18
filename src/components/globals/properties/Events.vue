<script>
import entity from "@/js/entity.js";
export default {
	props: ['events'],
	methods: {
		add(){
			this.events.push(entity.event.create());
		},
		remove(i){
			this.events.splice(i, 1);
		}
	}
}
</script>
<template>
	<div class="row mb-2 g-2" v-for="(event, i) in events">
		<div class="col-2">
			<select class="form-select" v-model="event.type">
				<option value="follow-up">Follow-Up</option>
				<option value="general">General</option>
				<option value="urgent">Urgent</option>
				<option value="delivery">Delivery</option>
			</select>
		</div>
		<div class="col-2">
			<input type="date" class="form-control" placeholder="Date" v-model="event.date">
		</div>
		<div class="col">
			<input class="form-control" type="text" placeholder="Note" v-model="event.note">
		</div>
		<div class="col-2">
			<button class="btn btn-outline-danger" @click="remove(i)">Remove</button>
		</div>
	</div>
	<div>
		<button class="btn btn-outline-primary" @click="add">Add Event</button>
	</div>
</template>