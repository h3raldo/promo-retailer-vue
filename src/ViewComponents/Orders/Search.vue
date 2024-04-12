
<script>
import utils from "@/js/utils.js";

export default {
	data(){
		return {}
	},
	props: ['getEntities', 'searchParams'],
	inject: ['symfony', 'alert'],
	methods: {
		search(e){
			e.preventDefault();
			let params = utils.form.toGetParams(e.target);
			this.getEntities(params);
		},
		createNew()
		{
			let self = this;

			utils.ajax( this.symfony.orders.order.new, (data) => {

				if( data.error === true || !data.id ){
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push( self.symfony.views.orders_order.replace(':id', data.id) )

			}, (error) => {
				this.alert('Error creating new order', 'danger');
			})
		}
	}
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2">
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<div class="d-flex pt-3">
		<div class="flex-fill">
			<form @submit="search" class="pt-1">
				<div class="row align-items-center">
					<div class="col">
						<!-- quote search -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="data_string" id="data_string" placeholder="Search anything in quote" v-model="searchParams.data_string">
								<label class="form-label" for="data_string">Quote Search</label>
							</div>
						</div>
					</div>
					<div class="col">
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
					</div>
					<div class="col">
						<!-- to -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="date" name="date_to" id="date_to" v-model="searchParams.date_to">
								<label class="form-label" for="date_to">To</label>
							</div>
						</div>
					</div>
					<div class="col">
						<div class="align-self-center">
							<button type="submit" class="btn btn-outline-primary"><i class="bi bi-search"></i> Search</button>
						</div>
					</div>
				</div>
				<div class="d-flex gap-4">
					<div>
						<div class="d-flex gap-2">
							<label class="fw-bold">Status: </label>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="new" v-model="searchParams.status">
									<span>New</span>
								</label>
							</div>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="sent" v-model="searchParams.status">
									<span>Sent</span>
								</label>
							</div>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="confirmed" v-model="searchParams.status">
									<span>Confirmed</span>
								</label>
							</div>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="closed" v-model="searchParams.status">
									<span>Closed</span>
								</label>
							</div>
						</div>
					</div>
					<div>
						<div class="d-flex gap-1">
							<label class="fw-bold border-start ps-3">Source: </label>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="source[]" value="magento" v-model="searchParams.source">
									<span>Magento</span>
								</label>
							</div>
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="source[]" value="quote"  v-model="searchParams.source">
									<span>Quotes</span>
								</label>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>