<script>
export default {
	data(){
		return {
			editing: false,
			states: ["Alaska", "Alabama", "Arkansas", "American Samoa", "Arizona", "California", "Colorado", "Connecticut", "District of Columbia", "Delaware", "Florida", "Georgia", "Guam", "Hawaii", "Iowa", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mississippi", "Montana", "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", "New York", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Virginia", "Virgin Islands", "Vermont", "Washington", "Wisconsin", "West Virginia", "Wyoming"],
			territories: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
			countries: ['United States', 'Canada', 'Mexico']
		}
	},
	props: ['address'],
	beforeMount() {
		if( !this.address.first_name ) this.editing = true;
	}
}
</script>

<template>

	<template v-if="editing">

		<div class="row g-2">

			<div class="col-12" v-if="typeof address.company != 'undefined'">
				<input type="text" class="form-control" placeholder="Company" v-model="address.company">
			</div>

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
				<template v-if="address.country === 'United States'">
					<select class="form-select" v-model="address.state">
						<option value="">- State -</option>
						<option v-for="state in states" :value="state">{{state}}</option>
					</select>
				</template>
				<template v-else-if="address.country === 'Canada'">
					<select class="form-select" v-model="address.state">
						<option value="">- Province -</option>
						<option v-for="territory in territories" :value="territory">{{territory}}</option>
					</select>
				</template>
				<template v-else>
					<input type="text" class="form-control" placeholder="State" v-model="address.state">
				</template>
			</div>

			<div class="col">
				<input type="text" class="form-control" placeholder="Zip Code" v-model="address.postal_code">
			</div>

			<div class="col-12">
				<select class="form-select" v-model="address.country">
					<option v-for="country in countries" :value="country">{{country}}</option>
				</select>
			</div>

			<div class="col-12" v-if="typeof address.phone !== 'undefined'">
				<input type="text" class="form-control" placeholder="Phone" v-model="address.phone">
			</div>

			<div class="col-12 text-end">
				<button class="btn btn-outline-primary" @click="editing = false"><i class="bi bi-check2"></i></button>
			</div>
		</div>

	</template>
	<template v-else>

		<div class="">
			<address class="fst-italic border-start border-3 ps-2">
				<span class="d-block">{{ address.company }}</span>
				<span class="d-block">
					<span v-if="address.company">Attn: </span>
					{{ address.first_name }} {{ address.last_name }}
				</span>
				<span class="d-block">{{ address.address_line_1 }}</span>
				<span class="d-block">{{ address.address_line_2 }}</span>
				<span class="d-block">{{ address.city }}, {{ address.state }} {{ address.postal_code }}</span>
				<span class="d-block">{{ address.country }}</span>
				<span class="d-block" v-if="address.phone"><i class="bi bi-telephone"></i> {{ address.phone }}</span>
				<button class="btn btn-link p-0 m-0 d-inline align-baseline" @click="editing = true"><i class="bi bi-pencil-square"></i></button>
			</address>
		</div>

	</template>



</template>