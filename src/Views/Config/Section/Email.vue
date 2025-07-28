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
			approval_body: '',
			approval_subject: '',
			emails: [
				{
					type: 'approval',
					label: 'Approval Email',
					subject: '',
					body: '',
				}
			],
			available: {
				from: ['admin@promoconnections.com', 'orders@promoconnections.com', 'sales@promoconnections.com', 'support@promoconnections.com'],
			}
		}
	},
	inject: ['symfony', 'alert'],
	methods: {
		save(){
			let self = this;

			function success( response ){
				self.saving = false;
				self.alert('Saved!');
			}

			function error( response ){
				self.saving = false;
				self.alert('Error saving, see console.!', 'danger');
			}

			let data = {
				path: utils.config.keys.emailTemplates,
				value: self.emails,
			}

			this.saving = true;
			utils.ajax(this.symfony.api.config.save, success, error, data );
		},
		retrieve(){
			let self = this;
			self.loading = true;

			utils.config.get.emailTemplates( (response) => {
				self.loading = false;

				if( !response ) return;
				self.emails = response;
			} )
		},
		add(){
			this.emails.push({
				type: 'new-email',
				label: 'New Email',
				requires: '',
				subject: '',
				body: '',
				to: '[client_email]',
				from: 'admin@promoconnections.com',
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
			<h2>Sales Order - Email Templates</h2>
			<p>Templates for sending emails. Following placeholders are available</p>
		</div>
		<div>
			<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save</button>
		</div>

	</div>

	<hr>

	<Loader v-if="loading" />

	<div class="row" v-else>
		<div class="col">

			<div v-for="email in emails">
				<details class="pb-3 border-bottom mb-3">
					<summary class="py-3 px-2">{{ email.label }}</summary>

					<div class="ps-3">

						<div class="row mb-2 pb-2">
							<div class="col">
								<div class="form-floating">
									<input type="text" class="form-control" v-model="email.label" placeholder="label">
									<label>Label (Internal only)</label>
								</div>
							</div>
							<div class="col">
								<div class="form-floating">
									<input type="text" class="form-control" v-model="email.type" placeholder="Type">
									<label>Type (internal ID)</label>
								</div>
							</div>
							<div class="col">
								<div class="form-floating">
									<input type="text" class="form-control" v-model="email.requires" placeholder="Requires">
									<label>Requires</label>
								</div>
							</div>
						</div>


						<div class="row">
							<div class="col">
								<div class="mb-2">
									<label class="form-label">From</label>
									<select class="form-select" v-model="email.from">
										<option v-for="from in available.from" :value="from">{{ from }}</option>
									</select>
								</div>
							</div>
							<div class="col">
								<div class="mb-2">
									<label class="form-label">To</label>
									<input type="text" class="form-control" v-model="email.to">
								</div>
							</div>
						</div>


						<div class="mb-2">
							<label class="form-label">Subject</label>
							<input type="text" class="form-control" v-model="email.subject">
						</div>

						<div class="mb-2">
							<label class="form-label">Body</label>
							<textarea class="form-control" rows="15" v-model="email.body"></textarea>
						</div>
					</div>
				</details>
			</div>

			<button class="btn btn-primary" @click="add"><i class="bi bi-plus-circle"></i> Add New Email Template</button>
		</div>


		<div class="col">
			<table class="table">
				<thead>
				<tr>
					<th>Variable</th>
					<th>Description</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>[company_name]</td>
					<td>Company Name</td>
				</tr>
				<tr>
					<td>[client_name]</td>
					<td>Name of user that placed the order</td>
				</tr>
				<tr>
					<td>[client_email]</td>
					<td>Email of user that placed the order</td>
				</tr>
				<tr>
					<td>[approver_name]</td>
					<td>Name of approver</td>
				</tr>
				<tr>
					<td>[approver_email]</td>
					<td>Email of approver</td>
				</tr>
				<tr>
					<td>[reference_number]</td>
					<td>Reference number of order</td>
				</tr>
				<tr>
					<td>[sales_order_url]</td>
					<td>Link to view sales order</td>
				</tr>
				<tr>
					<td>[ship_date]</td>
					<td>Sales order Ship Date</td>
				</tr>
				<tr>
					<td>[tracking_info]</td>
					<td>Table of all tracking numbers available.</td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>

</template>