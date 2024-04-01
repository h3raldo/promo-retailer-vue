
<script>
import utils from "@/js/utils.js";

export default {
	props: ['getEntities'],
	methods: {
		search(e){
			e.preventDefault();
			let params = utils.form.toGetParams(e.target);
			this.getEntities(params);
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
								<input class="form-control" type="text" name="data_string" id="data_string" placeholder="Search anything in quote" value="">
								<label class="form-label" for="data_string">Data Search</label>
							</div>
						</div>

						<!-- client -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="vendor" id="vendor" placeholder="Vendor" value="">
								<label class="form-label" for="vendor">Vendor</label>
							</div>
						</div>
					</div>
					<div class="col">
						<!-- from -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="date" name="date_from" id="date_from" value="">
								<label class="form-label" for="date_from">From</label>
							</div>
						</div>

						<!-- to -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="date" name="date_to" id="date_to" value="">
								<label class="form-label" for="date_to">To</label>
							</div>
						</div>
					</div>
					<div class="col">
						<div>
							<label class="fw-bold">Status</label>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="draft" checked="">
									<span>Draft</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="issued" checked="">
									<span>Issued</span>
								</label>
							</div>
						</div>

					</div>

					<div class="col d-flex gap-4 flex-column justify-content-center ">
						<div>
							<button type="submit" class="btn btn-outline-primary"><i class="bi bi-search"></i> Search</button>
						</div>
						<div>
							<a href="/quotes/" class="btn btn-outline-secondary"><i class="bi bi-x-octagon"></i> Clear All</a>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>