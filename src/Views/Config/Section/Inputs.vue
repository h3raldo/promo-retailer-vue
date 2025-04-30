<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			loading: false,
			saving: false,
			inputs: []
		}
	},
	inject: ['symfony', 'alert'],
	computed: {
	},
	methods: {
		save(){
			let self = this;

			function success(){
				self.saving = false;
				self.alert('Saved!');
			}

			function error(){
				self.saving = false;
				self.alert('Error saving, see console.!', 'danger');
			}

			let data = {
				path: utils.config.keys.globalInputs,
				value: self.inputs
			}

			this.saving = true;
			utils.ajax(this.symfony.api.config.save, success, error, data );
		},
		retrieve(){
			let self = this;
			self.loading = true;

			utils.config.get.option( 'globalInputs', (response) => {
				self.loading = false;

				if( !response ) return;
				self.inputs = response;

				self.inputs.forEach( (input) => {
					if( typeof input.options === 'undefined' ) input.options = [];
					if( input.type === 'yes/no' && input['default-value'] === '' ) input['default-value'] = 'no';
					delete input['option-value'];
				})
			})
		},
		addOption(input){
			input.options.push({
				value: 'option-1',
				label: 'Option 1',
				price: 0
			});
		},
		create(){
			this.inputs.push({
				id: 'new-input',
				type: 'text',
				required: 'no',
				'frontend-name': 'New Input',
				'default-value': '',
				options: [],
				price: 0
			})
		}
	},
	mounted() {
		this.retrieve();
	}
}
</script>
<template>

	<div class="d-flex justify-content-between">
		<div>
			<h2>Global Inputs</h2>
			<p>Used on products to store user information that they can fill out on the product page.</p>
		</div>
		<div>
			<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save</button>
		</div>

	</div>

	<hr>

	<Loader v-if="loading" />

	<div v-else>

		<div v-for="input in inputs">

			<details class="pb-3 border-bottom mb-3">
				<summary class="py-3 px-2">
					{{ input.id }} <span class="badge text-bg-secondary">{{ input.type }}</span>
					<span class="badge text-bg-warning ms-2" v-if="input.required === 'yes'">Required</span>
					<span class="badge text-bg-danger ms-2" v-if="input.type === 'dropdown' && !input.options.length">Missing Options</span>
					<span class="badge text-bg-danger ms-2" v-if="input.type === 'dropdown' && !input['default-value']">Missing Default Value</span>
				</summary>
				<div class="ps-3">

					<div class="row mb-3">
						<div class="col">
							<div class="form-floating">
								<input type="text" class="form-control" v-model="input.id" placeholder="ID">
								<label>ID</label>
							</div>
						</div>
						<div class="col">
							<div>
								<div class="form-floating">
									<select class="form-select" v-model="input.type">
										<option value="text">Text</option>
										<option value="yes/no">Yes / No</option>
										<option value="number">Number</option>
										<option value="dropdown">Dropdown</option>
									</select>
									<label>Field Type</label>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="form-floating">
								<select class="form-select" v-model="input['required']">
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</select>
								<label>Required</label>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="col">
							<div class="mb-3">
								<div class="form-floating">
									<input type="text" class="form-control" v-model="input['frontend-name']" placeholder="Name">
									<label>Public Name (Shows for the customer)</label>
								</div>
							</div>
						</div>
						<div class="col">
							<div class="mb-3">
								<template v-if="input.type === 'dropdown'">
									<div class="form-floating">
										<select class="form-select" v-model="input['default-value']">
											<option v-for="option in input.options" :value="option.value">{{ option.label }}</option>
										</select>
										<label>Default Value</label>
									</div>
								</template>
								<template v-else-if="['number', 'text'].includes(input.type)">
									<div class="form-floating">
										<input type="text" class="form-control" v-model="input['default-value']" placeholder="placeholder">
										<label>Default Value</label>
									</div>
								</template>
								<template v-else-if="['yes/no'].includes(input.type)">
									<div class="form-floating">
										<select class="form-select" v-model="input['default-value']">
											<option value="yes">Yes</option>
											<option value="no">No</option>
										</select>
										<label>Default Value</label>
									</div>
								</template>
							</div>
						</div>
					</div>

					<div v-if="input.type === 'dropdown'">
						<h5>Options:</h5>
						<table class="table">
							<thead>
							<tr>
								<th>Value</th>
								<th>Label</th>
								<th>Additional Price</th>
								<th></th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="(option, i) in input.options" :key="i">
								<td>
									<input type="text" class="form-control" v-model="option.value">
								</td>
								<td>
									<input type="text" class="form-control" v-model="option.label">
								</td>
								<td>
									<input type="text" class="form-control" v-model="option.price" disabled>
								</td>
								<td>
									<button class="btn btn-danger" @click="input.options.splice(i, 1)"><i class="bi bi-x"></i></button>
								</td>
							</tr>
							</tbody>
							<tfoot>
							<tr>
								<td colspan="3">
									<button class="btn btn-primary" @click="addOption(input)">Add Option</button>
								</td>
							</tr>
							</tfoot>
						</table>
					</div>

					<div class="mb-3">
						<div class="form-floating">
							<input type="number" class="form-control" v-model="input.price" placeholder="price" disabled>
							<label>Price</label>
						</div>
					</div>
				</div>
			</details>

		</div>

		<div class="pt-3">
			<button class="btn btn-primary" @click="create">Create New Input</button>
		</div>

	</div>

</template>