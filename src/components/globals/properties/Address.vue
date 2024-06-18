<script>
export default {
	props: ['address']
}
</script>

<template>

	<div class="row g-3">

		<div class="col">
			<input type="text" class="form-control" placeholder="First name" v-model="address.first_name">
		</div>

		<div class="col">
			<input type="text" class="form-control" placeholder="Last name" v-model="address.last_name">
		</div>

		<div class="col-12">
			<input type="text" class="form-control" placeholder="Address" v-model="address.address_line_1">
		</div>

		<div class="col-12">
			<input type="text" class="form-control" placeholder="Apartment, suite, etc (optional)" v-model="address.address_line_2">
		</div>

		<div class="col">
			<input type="text" class="form-control" placeholder="City" v-model="address.city">
		</div>

		<div class="col">
			<input type="text" class="form-control" placeholder="State" v-model="address.state">
		</div>

		<div class="col">
			<input type="text" class="form-control" placeholder="Zip Code" v-model="address.postal_code">
		</div>

		<div class="col-12">
			<input type="text" class="form-control" placeholder="Country" v-model="address.country">
		</div>
	</div>

</template>
<script setup lang="ts">
</script>