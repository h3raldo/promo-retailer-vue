
<script>
import utils from "@/js/utils.js";
import entity from "@/js/entity.js";

export default {
	computed: {
		entity() {
			return entity
		}
	},
	props: ['getQuotes', 'searchParams'],
	inject: ['symfony', 'alert'],
	methods: {
		search(e){
			e.preventDefault();
			let params = utils.form.toGetParams(e.target);
			this.getQuotes(params);
		},
		createNew()
		{
			let self = this;

			utils.ajax( this.symfony.quotes.quote.new, (data) => {

				if( data.error === true || !data.id ){
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push( self.symfony.views.quotes_quote.replace(':id', data.id) )

			}, (error) => {
				this.alert('Error creating new quote', 'danger');
			})
		}
	}
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<div>
			<h3 class="mb-0"><i class="bi bi-calculator"></i> Quotes</h3>
		</div>
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<div class="d-flex pt-3">
		<div class="flex-fill">

			<form @submit="search" class="pt-1">

				<div class="d-flex gap-4 align-items-center pb-2">
					<div class="flex-grow-1">
						<!-- quote search -->
						<div>
							<div class="form-floating">
								<input class="form-control" type="text" name="data_string" id="data_string" placeholder="Search anything in quote" v-model="searchParams.data_string">
								<label class="form-label" for="data_string">Search</label>
							</div>
						</div>
					</div>
					<div class="flex-grow-1">
						<!-- client -->
						<div>
							<div class="form-floating">
								<input class="form-control" type="text" name="client" id="client" placeholder="Client" v-model="searchParams.client">
								<label class="form-label" for="client">Client</label>
							</div>
						</div>
					</div>
					<div class="flex-grow-1">
						<!-- from -->
						<div>
							<div class="form-floating">
								<input class="form-control" type="date" name="date_from" id="date_from" v-model="searchParams.date_from">
								<label class="form-label" for="date_from">From</label>
							</div>
						</div>
					</div>
					<div class="flex-grow-1">
						<!-- to -->
						<div>
							<div class="form-floating">
								<input class="form-control" type="date" name="date_to" id="date_to" v-model="searchParams.date_to">
								<label class="form-label" for="date_to">To</label>
							</div>
						</div>
					</div>
					<div class="">
						<div class="align-self-center">
							<button type="submit" class="btn btn-outline-primary"><i class="bi bi-search"></i></button>
						</div>
					</div>
				</div>

				<div class="d-flex gap-4">
					<div>
						<div class="d-flex gap-2">
							<label class="fw-bold">Status</label>

							<div v-for="status in entity.quote.default.statuses">
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="status[]" :value="status.value" v-model="searchParams.status">
									<span>{{ status.title }}</span>
								</label>
							</div>

						</div>
					</div>
					<div>
						<div class="d-flex gap-1">
							<label class="fw-bold">Category</label>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="standard" v-model="searchParams.category">
									<span>Standard</span>
								</label>
							</div>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="bid" v-model="searchParams.category">
									<span>Bid</span>
								</label>
							</div>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="idea" v-model="searchParams.category">
									<span>Idea</span>
								</label>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>