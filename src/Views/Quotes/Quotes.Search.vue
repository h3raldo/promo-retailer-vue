
<script>
import utils from "@/js/utils.js";

export default {
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

	<div class="d-flex align-items-center bg-gray">
		<div class="flex-fill">

			<form @submit="search" class="bg-gray p-3">

				<div class="row">
					<div class="col">
						<!-- quote search -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="data_string" id="data_string" placeholder="Search anything in quote" v-model="searchParams.data_string">
								<label class="form-label" for="data_string">Quote Search</label>
							</div>
						</div>

						<!-- client -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="client" id="client" placeholder="Client" v-model="searchParams.client">
								<label class="form-label" for="client">Client</label>
							</div>
						</div>
					</div>
					<div class="col">
						<!-- from -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="date" name="date_from" id="date_from" v-model="searchParams.date_from">
								<label class="form-label" for="date_from">From</label>
							</div>
						</div>

						<!-- to -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="date" name="date_to" id="date_to" v-model="searchParams.date_to">
								<label class="form-label" for="date_to">To</label>
							</div>
						</div>
					</div>
					<div class="col">
						<div>
							<label class="fw-bold">Status</label>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="draft" v-model="searchParams.status">
									<span>Draft</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="sent" v-model="searchParams.status">
									<span>Sent</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="confirmed" v-model="searchParams.status">
									<span>Confirmed</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="pushed" v-model="searchParams.status">
									<span>Pushed</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="closed" v-model="searchParams.status">
									<span>Closed</span>
								</label>
							</div>
						</div>

					</div>

					<div class="col">
						<div>
							<label class="fw-bold">Category</label>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="standard" v-model="searchParams.category">
									<span>Standard</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="bid" v-model="searchParams.category">
									<span>Bid</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="idea" v-model="searchParams.category">
									<span>Idea</span>
								</label>
							</div>
						</div>
					</div>

					<div class="col d-flex gap-4 flex-column justify-content-center ">
						<div>
							<button type="submit" class="btn btn-outline-primary"><i class="bi bi-search"></i> Search</button>
						</div>
						<div>
<!--							<a href="/quotes/" class="btn btn-outline-secondary"><i class="bi bi-x-octagon"></i> Clear All</a>-->
						</div>
					</div>
				</div>
			</form>
		</div>
		<div class="text-center pe-4">
			<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> New Quote</button>
		</div>
	</div>
</template>