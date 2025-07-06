<script>
import utils from "@/js/utils.js";
import Modal from "@/components/globals/bootstrap/Modal.vue";

export default {
	name: "Header.Email",
	components: {Modal},
	data(){
		return {
			subject: '',
			to: '',
			body: '',
			loading: false,
			error: false,
			ccs: [],
		}
	},
	props: ['save', 'type', 'email'],
	inject: ['order', 'entities', 'symfony', 'urls', 'init'],
	methods: {
		send(){
			let self = this;
			self.error = false;
			let data = {
				to: self.to,
				subject: self.subject,
				body: self.body,
				ccs: self.ccs,
			}

			self.loading = true;
			utils.ajax(this.symfony.api.email.send, ()=> {
				self.$refs.emailModal.$refs.closeModalButton.click();
				self.order.info.statuses.emailed = true;
				self.save();
				self.loading = false;
			}, ()=>{
				self.error = true
				self.loading = false;
			}, data)
		},
		setupApprovalEmail(){
			let self = this;

			let fillInVariables = ( string ) => {

				let publicUrl = this.urls.public.replace(':id', this.init.public_id );

				let variables = [
					{
						variable: '[company_name]',
						value: self.entities.company.name,
					},
					{
						variable: '[client_name]',
						value: self.order.client.name,
					},
					{
						variable: '[approver_name]',
						value: self.entities.company.data.contacts.approval.first_name,
					},
					{
						variable: '[approver_email]',
						value: self.entities.company.data.contacts.approval.email,
					},
					{
						variable: '[reference_number]',
						value: self.order.info.reference_number,
					},
					{
						variable: '[sales_order_url]',
						value: publicUrl,
					}
				]

				variables.forEach( v => {
					string = string.replaceAll( v.variable, v.value );
				})

				//string = string.replace(/(?:\r\n|\r|\n)/g, '%0D%0A');

				return string;
			}

			utils.config.get.approvalEmail( (response) => {
				if( !response ) return;
				let body = fillInVariables( response.body );
				let subject = fillInVariables( response.subject );

				self.body = body;
				self.subject = subject;
				self.to = self.entities.company.data.contacts.approval.email;

				if( self.entities.company.data.contacts.approval.cc )
					self.entities.company.data.contacts.approval.cc.forEach( c => self.ccs.push( c.email ) )
			} )
		}
	},
	mounted() {
		if( this.type === 'approval' ){
			this.setupApprovalEmail();
			return;
		}

		this.to = this.email
		this.subject = 'Message from Promo Connections'
	}
}
</script>

<template>
	<Modal :id="'create-email'" :title="'Create Email'" :buttonText="'Email'" :buttonClasses="'dropdown-item'" :icon="'bi-envelope'" ref="emailModal">
		<div class="mb-2">
			<label class="form-label">Subject</label>
			<input type="text" class="form-control" v-model="subject">
		</div>
		<div class="mb-2">
			<label class="form-label">To</label>
			<input type="text" class="form-control" v-model="to">
		</div>
		<div class="mb-2">
			<label class="form-label">CCs</label>
			<input type="text" class="form-control" :value="ccs.join(', ')" disabled>
		</div>
		<div class="mb-2">
			<label class="form-label">Message</label>
			<textarea class="form-control" rows="15" v-model="body"></textarea>
		</div>

		<div class="text-center py-3">
			<span class="text-danger pe-3" v-if="error">Error sending email!</span>
			<button class="btn btn-primary btn-lg" @click="send" :disabled="loading">Send Email</button>
		</div>
	</Modal>
</template>

<style scoped>

</style>