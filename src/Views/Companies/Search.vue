
<script>
import utils from "@/js/utils.js";

export default {
	props: ['getEntities', 'searchParams'],
	inject: ['symfony', 'alert'],
	methods: {
		search(e){
			e.preventDefault();
			this.submitForm(e.target)
		},
		submitForm(form)
		{
			let params = utils.form.toGetParams(form);
			this.getEntities(params);
		},
		autoSubmit(){
			this.submitForm( this.$refs.form );
		},
		createNew() {
			let self = this;

			utils.ajax(this.symfony.api.companies.company.new, (data) => {

				if (data.error === true || !data.id) {
					self.alert(data.message, 'danger');
					return;
				}

				self.$router.push(this.symfony.views.companies_company.replace(':id', data.id))

			}, (error) => {
				this.alert('Error Creating', 'danger');
			})
		},
		onTabChange(label){
			this.type = label;
			this.retrieve();
		}
	}
}
</script>

<template>

	<div class="text-end pb-3 bg-gray p-3 mb-2 d-flex justify-content-between align-items-center">
		<h3 class="m-0"><i class="bi bi-building"></i> Companies/Vendors</h3>
		<button class="btn btn-primary p-3" @click="createNew"><i class="bi bi-plus-square-fill"></i> Create New</button>
	</div>

	<div class="d-flex pt-3">
		<div class="flex-fill">

			<form @submit="search" class="pt-1" ref="form">

				<div class="d-flex gap-4 align-items-center pb-2">
					<div class="flex-grow-1">
						<!-- quote search -->
						<div>
							<div class="form-floating">
								<input class="form-control" type="text" name="name" id="name" placeholder="Name" v-model="searchParams.name">
								<label class="form-label" for="name">Search by Name</label>
							</div>
						</div>
					</div>
					<div class="flex-grow-1">
						<!-- client -->
						<div>
							<div class="form-floating">
								<select class="form-select" v-model="searchParams.type" id="type" @change="autoSubmit" name="type">
									<option value="client">Client</option>
									<option value="vendor">Vendor</option>
								</select>
								<label class="form-label" for="type">Type</label>
							</div>
						</div>

					</div>
					<div class="flex-grow-1">
						<button type="submit" class="btn btn-outline-primary"><i class="bi bi-search"></i></button>
					</div>
				</div>

			</form>
		</div>
	</div>
</template>