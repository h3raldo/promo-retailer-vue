<script setup>
import Tabs from "@/components/globals/Tabs.vue";
</script>
<script>
export default {
	data() {
		return {
			tabs: ['Run_Charges', 'Setup_Charges']
		}
	},
	props: [],
	inject: ['product'],
	methods: {}
}
</script>
<template>
	<div>

		<h4 class="mb-4">Dynamic Decorator Configuration</h4>

		<div v-for="decorator in product.data.pricing.dynamic.decorator" class="d-flex border-bottom pb-2 mb-2">
			<div class="flex-fill">
				<details>
					<summary class="h5">{{ decorator.id }}</summary>

					<div class="ps-3">

						<div class="row col-6 mb-3">
							<label class="col-sm-3 col-form-label">Limit Colors:</label>
							<div class="col-sm-9">
								<div class="row">
									<div class="col">
										<div class="form-floating">
											<input type="number" class="form-control" v-model="decorator.config.clr.min">
											<label>Min</label>
										</div>
									</div>
									<div class="col">
										<div class="form-floating">
											<input type="number" class="form-control" v-model="decorator.config.clr.max">
											<label>Max</label>
										</div>
									</div>
								</div>
							</div>
						</div>


						<div class="row col-6 mb-3 ">
							<label class="col-sm-3 col-form-label">Limit Locations:</label>
							<div class="col-sm-9">
								<div class="row">
									<div class="col">
										<div class="form-floating">
											<input type="number" class="form-control" v-model="decorator.config.clr.min">
											<label>Min</label>
										</div>
									</div>
									<div class="col">
										<div class="form-floating">
											<input type="number" class="form-control" v-model="decorator.config.clr.max">
											<label>Max</label>
										</div>
									</div>
								</div>
							</div>
						</div>

						<Tabs :labels="tabs">
							<template #Run_Charges>
								<div class="row pb-2 mb-1">
									<div v-for="(run, i) in decorator.pricing.run" class="col-6 mb-4">
										<div class="bg-light p-3">

											<div class="d-flex justify-content-between align-items-center pb-3">
												<div>
													<h5 class="mb-0">Run Charge #{{ i+1 }}</h5>
												</div>
												<div>
													<button class="btn btn-sm btn-outline-danger">Delete</button>
												</div>
											</div>

											<div class="row mb-3">
												<label class="col-sm-2 col-form-label">Label</label>
												<div class="col-sm-10">
													<select class="form-select" v-model="run.label">
														<option value="Oversized Imprint">Oversized Imprint</option>
														<option value="Oversized/Vertical Imprint">Oversized/Vertical Imprint</option>
														<option value="Large Imprint">Large Imprint</option>
														<option value="Add Personalization">Add Personalization</option>
														<option value="Set-Up Charge">Set-Up Charge</option>
														<option value="Multi-Color Set-Up">Multi-Color Set-Up</option>
														<option value="Personalization Set-Up Charge">Personalization Set-Up Charge</option>
														<option value="Add 2nd Location">Add 2nd Location</option>
														<option value="">None</option>
													</select>
												</div>
											</div>

											<div class="row mb-3">
												<label class="col-sm-2 col-form-label">Filters</label>
												<div class="col-sm-10">
													<div v-for="filter in run.filters" class="row">
														<div class="col">
															<div class="form-floating">
																<select class="form-select" v-model="filter.attr">
																	<option value="color">Color</option>
																	<option value="color-each">Color (Each)</option>
																	<option value="location">Location</option>
																	<option value="location-each">Location (Each)</option>
																	<option value="1char">1 Charge</option>
																</select>
																<label>Attribute</label>
															</div>
														</div>
														<div class="col" v-if="!filter.attr.includes('each')">
															<div class="form-floating">
																<input type="number" class="form-control" v-model="filter.value.from">
																<label>From</label>
															</div>
														</div>
														<div class="col" v-if="!filter.attr.includes('each')">
															<div class="form-floating">
																<input type="number" class="form-control" v-model="filter.value.to">
																<label>To</label>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div class="row">
												<label class="col-sm-2 col-form-label">Pricing</label>
												<div class="col-sm-10">
													<div>
														<div class="d-flex mb-2 align-items-center gap-2" v-for="tier in run.price">
															<div class="flex-fill">
																<div class="form-floating">
																	<input type="number" class="form-control" v-model="tier.qty">
																	<label>Qty</label>
																</div>
															</div>
															<div class="flex-fill">
																<div class="form-floating">
																	<input type="number" class="form-control" v-model="tier.price">
																	<label>Price ($)</label>
																</div>
															</div>
															<div>
																<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
															</div>
														</div>

														<button class="btn btn-sm btn-outline-primary"><i class="bi bi-plus"></i> Tier</button>
													</div>
												</div>
											</div>

										</div>
									</div>
								</div>
							</template>
							<template #Setup_Charges>
								<div class="row pb-2 mb-1">
									<div v-for="(setup, i) in decorator.pricing.setup" class="col-6 mb-4">
										<div class="bg-light p-3">

											<div class="d-flex justify-content-between align-items-center pb-3">
												<div>
													<h5 class="mb-0">Setup Charge #{{ i+1 }}</h5>
												</div>
												<div>
													<button class="btn btn-sm btn-outline-danger">Delete</button>
												</div>
											</div>

											<div class="row mb-3">
												<label class="col-sm-2 col-form-label">Label</label>
												<div class="col-sm-10">
													<select class="form-select" v-model="setup.label">
														<option value="Oversized Imprint">Oversized Imprint</option>
														<option value="Oversized/Vertical Imprint">Oversized/Vertical Imprint</option>
														<option value="Large Imprint">Large Imprint</option>
														<option value="Add Personalization">Add Personalization</option>
														<option value="Set-Up Charge">Set-Up Charge</option>
														<option value="Multi-Color Set-Up">Multi-Color Set-Up</option>
														<option value="Personalization Set-Up Charge">Personalization Set-Up Charge</option>
														<option value="Add 2nd Location">Add 2nd Location</option>
														<option value="">None</option>
													</select>
												</div>
											</div>

											<div class="row mb-3">
												<label class="col-sm-2 col-form-label">Filters</label>
												<div class="col-sm-10">
													<div v-for="filter in setup.filters" class="row">
														<div class="col">
															<div class="form-floating">
																<select class="form-select" v-model="filter.attr">
																	<option value="color">Color</option>
																	<option value="color-each">Color (Each)</option>
																	<option value="location">Location</option>
																	<option value="location-each">Location (Each)</option>
																	<option value="1char">1 Charge</option>
																</select>
																<label>Attribute</label>
															</div>
														</div>
														<div class="col" v-if="!filter.attr.includes('each')">
															<div class="form-floating">
																<input type="number" class="form-control" v-model="filter.value.from">
																<label>From</label>
															</div>
														</div>
														<div class="col" v-if="!filter.attr.includes('each')">
															<div class="form-floating">
																<input type="number" class="form-control" v-model="filter.value.to">
																<label>To</label>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div class="row">
												<label class="col-sm-2 col-form-label">Pricing</label>
												<div class="col-sm-10">
													<div>
														<div class="d-flex mb-2 align-items-center gap-2" v-for="tier in setup.price">
															<div class="flex-fill">
																<div class="form-floating">
																	<input type="number" class="form-control" v-model="tier.qty">
																	<label>Qty</label>
																</div>
															</div>
															<div class="flex-fill">
																<div class="form-floating">
																	<input type="number" class="form-control" v-model="tier.price">
																	<label>Price ($)</label>
																</div>
															</div>
															<div>
																<button class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
															</div>
														</div>

														<button class="btn btn-sm btn-outline-primary"><i class="bi bi-plus"></i> Tier</button>
													</div>
												</div>
											</div>

										</div>
									</div>
								</div>
							</template>
						</Tabs>

					</div>
				</details>
			</div>

			<div>
				<button class="btn btn-outline-danger btn-sm"><i class="bi bi-x"></i></button>
			</div>
		</div>



	</div>
</template>
