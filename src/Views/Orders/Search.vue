<script setup>
import entity from "@/js/entity.js";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data(){
		return {

		}
	},
	props: ['getEntities', 'searchParams', 'response'],
	inject: ['symfony', 'alert'],
	methods: {
		search(e){
			e.preventDefault();
			let params = utils.form.toGetParams(e.target);
			this.getEntities(params);
		},
		getPageClasses( page )
		{
			return 'page-item' + (page === parseInt(this.searchParams.page) ? ' active' : '');
		}
	},
	mounted() {
		console.log(this.entities);
	}
}
</script>

<template>
	<div class="d-flex pt-3">
		<div class="flex-fill">
			<form @submit="search" class="pt-1">
				<div class="row align-items-center">
					<div class="col">
						<!-- quote search -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="data_string" id="data_string" placeholder="Search anything in quote" v-model="searchParams.data_string">
								<label class="form-label" for="data_string">Content Search</label>
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
						<!-- to -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="author" placeholder="Author" v-model="searchParams.author">
								<label class="form-label">Author</label>
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

							<div v-for="status in entity.order.default.statuses">
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="status[]" :value="status.value" v-model="searchParams.status">
									<span>{{ status.title }}</span>
								</label>
							</div>

						</div>
					</div>
					<div>
						<div class="d-flex gap-2">
							<label class="fw-bold border-start ps-3">Type: </label>

							<div v-for="status in entity.order.default.types">
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="type[]" :value="status.value" v-model="searchParams.type">
									<span>{{ status.title }}</span>
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
							<div>
								<label class="form-check-label bg-gray px-2 rounded small">
									<input class="form-check-input me-1" type="checkbox" name="source[]" value="order"  v-model="searchParams.source">
									<span>Order</span>
								</label>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div class="d-flex gap-2 pt-2">
						<div>
							<select name="status_paid" class="form-select form-select-sm" v-model="searchParams.status_paid">
								<option value="null">Paid: Any</option>
								<option value="true">Paid: Yes</option>
								<option value="false">Paid: No</option>
							</select>
						</div>
						<div>
							<select name="status_invoiced" class="form-select form-select-sm" v-model="searchParams.status_invoiced">
								<option value="null">Invoiced: Any</option>
								<option value="true">Invoiced: Yes</option>
								<option value="false">Invoiced: No</option>
							</select>
						</div>
						<div>
							<select name="status_shipped" class="form-select form-select-sm" v-model="searchParams.status_shipped">
								<option value="null">Shipped: Any</option>
								<option value="true">Shipped: Yes</option>
								<option value="false">Shipped: No</option>
							</select>
						</div>
						<div>
							<select name="status_emailed" class="form-select form-select-sm" v-model="searchParams.status_emailed">
								<option value="null">Emailed: Any</option>
								<option value="true">Emailed: Yes</option>
								<option value="false">Emailed: No</option>
							</select>
						</div>
						<div>
							<div class="dropdown">
								<button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									Tags
								</button>
								<ul class="dropdown-menu">
									<template v-if="response?.entities?.config?.order_tags">
									<li v-for="tag in response.entities.config.order_tags" class="d-flex gap-1 align-items-center py-1 px-2">
										<input class="form-check-input mt-0" type="checkbox" name="tags[]" :value="tag.id" v-model="searchParams.tags">
										<label class="small text-nowrap">
											<span>{{ tag.label }}</span>
										</label>
									</li>
									</template>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
		<div>
		</div>
	</div>
</template>