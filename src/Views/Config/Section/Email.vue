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
				path: utils.config.keys.approvalEmail,
				value: {
					body: self.approval_body,
					subject: self.approval_subject
				}
			}

			this.saving = true;
			utils.ajax(this.symfony.api.config.save, success, error, data );
		},
		retrieve(){
			let self = this;
			self.loading = true;

			utils.config.get.approvalEmail( (response) => {
				self.loading = false;

				if( !response ) return;
				self.approval_body = response.body;
				self.approval_subject = response.subject;
			} )
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
			<h2>Sales Order - Approval Email</h2>
			<p>Template for sending approval emails. Following placeholders are available</p>
		</div>
		<div>
			<button class="btn btn-primary p-3" @click="save" :disabled="saving"><i class="bi bi-floppy-fill"></i> Save</button>
		</div>

	</div>

	<hr>

	<Loader v-if="loading" />

	<div class="row" v-else>
		<div class="col">
			<div class="mb-2">
				<label class="form-label">Email Subject</label>
				<input type="text" class="form-control" v-model="approval_subject">
			</div>

			<div class="mb-2">
				<label class="form-label">Email Body</label>
				<textarea class="form-control" rows="15" v-model="approval_body"></textarea>
			</div>
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
				</tbody>
			</table>
		</div>
	</div>

</template>