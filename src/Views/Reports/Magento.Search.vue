
<script>
import utils from "@/js/utils.js";

export default {
	props: ['search'],
	methods: {
		onSearch(e){
			e.preventDefault();
			let params = utils.form.toGetParams(e.target);
			this.search(params);
		}
	}
}
</script>

<template>

	<div class="d-flex align-items-center bg-gray">
		<div class="flex-fill">

			<form @submit="onSearch" class="bg-gray p-3">

				<div class="row">
					<div class="col">
						<div class="mb-3">
							<label for="start">From:</label>
							<input class="form-control" type="date" id="start" name="from" value="" min="2023-06-01" max="">
						</div>
						<div class="mb-3">
							<label for="start">To:</label>
							<input class="form-control" type="date" id="start" name="to" value="" min="2023-06-01" max="">
						</div>
						<div class="mb-3">
							<label for="group">Group By:</label><br>
							<select class="form-select" id="group" name="group">
								<option value="none" selected="">None</option>
								<option value="website">Website</option>
								<option value="store">Store</option>
							</select>
						</div>
					</div>
					<div class="col">
						<div class="mb-3">
							<label for="sku">Sku:</label>
							<input class="form-control" type="text" id="sku" name="sku" value="" placeholder="SKU1,SKU2,SKU3...">
						</div>
						<div class="mb-3">
							<label for="increment_id">Order Number:</label>
							<input class="form-control" type="text" id="increment_id" name="increment_id" value="" placeholder="123456,123457">
						</div>
						<!--
						<div class="mb-3">
							<label for="store_id">Store:</label>
							<input class="form-control" type="text" id="store_id" name="store_id" value="" placeholder="1,2,3">
						</div>
						-->
						<div class="mb-3">
							<label for="store_name">Website/Store Name:</label>
							<input class="form-control" type="text" id="store_name" name="store_name" value="" placeholder="Searches Website and Store Name">
						</div>
					</div>
					<div class="col">
						<div class="mb-3">
							<label for="status">Included Status(es):</label><br>
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="draft" value="draft" name="statuses[]" checked="">
								<label class="form-check-label" for="draft">Draft</label>
							</div>
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="confirmed" value="confirmed" name="statuses[]" checked="">
								<label class="form-check-label" for="confirmed">Confirmed</label>
							</div>
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="hold-for-bulk-order" value="hold-for-bulk-order" name="statuses[]" checked="">
								<label class="form-check-label" for="hold-for-bulk-order">Hold for Bulk Order</label>
							</div>
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="completed" value="completed" name="statuses[]" checked="">
								<label class="form-check-label" for="completed">Completed</label>
							</div>
						</div>
						<div class="">
							<label>Filter By Shipping Method:</label><br>
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="freeshipping" value="freeshipping" name="shipping[]" checked="" disabled="">
								<label class="form-check-label" for="freeshipping">Pickup</label>
							</div>
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="ups" value="ups" name="shipping[]" checked="" disabled="">
								<label class="form-check-label" for="ups">UPS</label>
							</div>
							<div class="form-check">
								<input class="form-check-input" type="checkbox" id="flatrate" value="flatrate" name="shipping[]" checked="" disabled="">
								<label class="form-check-label" for="flatrate">Flat Rate</label>
							</div>
						</div>
					</div>
					<div class="col">
						<label></label>
						<br>
						<button type="submit" class="btn btn-primary">Get Report</button>
					</div>
				</div>

			</form>
		</div>
	</div>
</template>