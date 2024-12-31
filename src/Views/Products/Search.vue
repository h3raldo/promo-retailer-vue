<script setup>
import entity from "@/js/entity.js";
</script>

<script>
import utils from "@/js/utils.js";

export default {
	props: ['getEntities', 'searchParams'],
	inject: ['symfony', 'alert'],
	methods: {
		search(e) {
			e.preventDefault();
			let params = utils.form.toGetParams(e.target);
			this.getEntities(params);
		}
	}
}
</script>

<template>

	<div class="d-flex pt-3">
		<div class="flex-fill">

			<form @submit="search" class="pt-1">

				<div class="row align-items-center">

					<div class="col">
						<!-- client -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="name" placeholder="Name" v-model="searchParams.name">
								<label class="form-label">Name</label>
							</div>
						</div>
					</div>
					<div class="col">
						<!-- client -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="sku" placeholder="SKU" v-model="searchParams.sku">
								<label class="form-label">SKU</label>
							</div>
						</div>
					</div>
					<div class="col">
						<div class="align-self-center">
							<button type="submit" class="btn btn-outline-primary"><i class="bi bi-search"></i> Search
							</button>
						</div>
					</div>
				</div>

				<div class="d-flex gap-4">
					<div>
						<div class="d-flex gap-2"><label class="fw-bold">Status</label>
							<label class="form-check-label bg-gray px-2 rounded small">
								<input class="form-check-input me-1" type="checkbox" name="status[]" value="enabled" v-model="searchParams.status">
								<span>Enabled</span>
							</label>
							<label class="form-check-label bg-gray px-2 rounded small">
								<input class="form-check-input me-1" type="checkbox" name="status[]" value="disabled" v-model="searchParams.status">
								<span>Disabled</span>
							</label>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>

</template>