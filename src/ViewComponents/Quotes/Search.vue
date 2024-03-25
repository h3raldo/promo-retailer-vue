
<script>
export default {
	props: ['getQuotes'],
	methods: {
		search(e){
			e.preventDefault();
			let params = this.getParams(e.target);
			this.getQuotes(params);
		},

		getParams(form){
			let params = [];

			let inputs = form.elements;

			for (let i = 0; i < inputs.length; i++) {
				let input = inputs[i];

				if( !input.name ) continue;
				if( input.type === 'checkbox' && input.checked !== true ) continue;

				params.push( input.name + '=' + input.value );
			}

			return params.join('&')
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
								<label class="form-label" for="data_string">Quote Search</label>
							</div>
						</div>

						<!-- client -->
						<div class="pb-2">
							<div class="form-floating">
								<input class="form-control" type="text" name="client" id="client" placeholder="Client" value="">
								<label class="form-label" for="client">Client</label>
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
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="sent" checked="">
									<span>Sent</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="confirmed" checked="">
									<span>Confirmed</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="pushed">
									<span>Pushed</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="status[]" value="closed">
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
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="standard" checked="">
									<span>Standard</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="bid" checked="">
									<span>Bid</span>
								</label>
							</div>
							<div>
								<label class="form-check-label">
									<input class="form-check-input me-1" type="checkbox" name="category[]" value="idea" checked="">
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
							<a href="/quotes/" class="btn btn-outline-secondary"><i class="bi bi-x-octagon"></i> Clear All</a>
						</div>
					</div>
				</div>
			</form>
		</div>
		<div class="text-center pe-4">
			<a class="btn btn-primary p-3" href="/quotes/create/"><i class="bi bi-plus-square-fill"></i> New Quote</a>
		</div>
	</div>
</template>