<script>
import utils from "@/js/utils.js";
import Modal from "@/components/globals/bootstrap/Modal.vue";

export default {
	name: "Header.Email",
	components: {Modal},
	data(){
		return {
			loading: false,
			error: false,
			type: 'blank',
			email: {
				from: 'admin@promoconnections.com',
				to: '',
				subject: '',
				body: '',
				ccs: [],
			},
			available: {
				from: ['admin@promoconnections.com', 'orders@promoconnections.com', 'sales@promoconnections.com', 'support@promoconnections.com'],
			},
			templates: []
		}
	},
	props: ['save'],
	inject: ['order', 'entities', 'symfony', 'urls', 'init'],
	methods: {
		send(){
			let self = this;
			self.error = false;
			let data = {
				to: self.email.to,
				subject: self.email.subject,
				body: self.email.body,
				ccs: self.email.ccs,
				from: self.email.from,
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
		changeTemplate( type ){
			let matched = this.templates.filter( t => t.type === type );
			if( matched.length === 0 ) return;
			let template = matched[0];

			this.email.subject = this.fillInVariables( template.subject );
			this.email.body = this.fillInVariables( template.body );
			this.email.to = this.fillInVariables( template.to );
			this.email.from = template.from;

			if( template.type === 'approval' )
				if( self.entities?.company?.data?.contacts?.approval?.cc )
					self.entities.company.data.contacts.approval.cc.forEach( c => self.email.ccs.push( c.email ) )
		},
		fillInVariables( string, test_required = false ){
			let self = this;

			let publicUrl = this.urls.public.replace(':id', this.init.public_id );

			let getTrackingNumbers = () => {
				let text = '';
				let numbers = self.order?.info?.tracking_numbers;
				if( !numbers ) return text;

				numbers.forEach( n => {
					let date = n.date;

					if( n.date ){
						let new_date = new Date( n.date + 'T12:00:00-06:00' );
						date = new_date.toLocaleDateString();
					}

					text += `${date} ${n.description}: ${n.number}`
				})

				return text;
			}

			let variables = [
				{
					variable: '[company_name]',
					value: self.entities?.company?.name,
				},
				{
					variable: '[client_name]',
					value: self.order?.client?.name,
				},
				{
					variable: '[client_email]',
					value: self.order?.client?.email,
				},
				{
					variable: '[approver_name]',
					value: self.entities?.company?.data?.contacts?.approval?.first_name,
				},
				{
					variable: '[approver_email]',
					value: self.entities?.company?.data?.contacts?.approval?.email,
				},
				{
					variable: '[reference_number]',
					value: self.order?.info?.reference_number,
				},
				{
					variable: '[sales_order_url]',
					value: publicUrl,
				},
				{
					variable: '[ship_date]',
					value: self.order?.info?.shipped,
				},
				{
					variable: '[tracking_info]',
					value: getTrackingNumbers(),
				}
			];


			if( test_required !== false ){
				let passed = true;
				test_required.forEach( t => {
					let found = variables.find( v => v.variable === `[${t}]` );
					if( !found ) return;
					if( !found.value ) passed = false;
				})
				return passed;
			}

			variables.forEach( v => {
				if( !v.value ) return;
				string = string.replaceAll( v.variable, v.value );
			})

			return string;
		}
	},
	watch: {
		type(val){
			this.changeTemplate( val );
		}
	},
	mounted() {
		this.type = 'blank';
		this.templates = this.entities.config.email_templates;
		this.templates.filter( t => {
			if( t.requires === '' ) t.passes = true;
			let requires = t.requires.split(',').map( r => r.trim() );

			t.passes = this.fillInVariables('', requires);
		})
		this.changeTemplate(this.type);
	}
}
</script>

<template>
	<Modal :title="'Create Email'" :buttonText="'Email'" :buttonClasses="'dropdown-item'" :icon="'bi-envelope'" ref="emailModal">
		<div class="mb-2">
			<label class="form-label">Template</label>
			<select class="form-select" v-model="type">
				<option v-for="template in templates" :value="template.type" :disabled="!template.passes">{{ template.label }}</option>
			</select>
		</div>
		<div class="row">
			<div class="col">
				<div class="mb-2">
					<label class="form-label">From</label>
					<select class="form-select" v-model="email.from">
						<option v-for="from in available.from" :key="from" :value="from">{{ from }}</option>
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
			<label class="form-label">CCs</label>
			<input type="text" class="form-control" :value="email.ccs.join(', ')" disabled>
		</div>
		<div class="mb-2">
			<label class="form-label">Message</label>
			<textarea class="form-control" rows="15" v-model="email.body"></textarea>
		</div>

		<div class="text-center py-3">
			<span class="text-danger pe-3" v-if="error">Error sending email!</span>
			<button class="btn btn-primary btn-lg" @click="send" :disabled="loading">Send Email</button>
		</div>
	</Modal>
</template>

<style scoped>

</style>