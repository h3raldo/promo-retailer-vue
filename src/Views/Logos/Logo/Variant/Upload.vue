<script>
import utils from "@/js/utils.js";
export default {
	data(){
		return {
			name_from_user: '',
			file: null,
			loading: false,
		}
	},
	props: ['logo_id', 'type', 'forcedName', 'onUpload'],
	inject: ['alert', 'symfony', 'logo'],
	computed: {
		name(){
			if( this.forcedName )
				return utils.slugify(this.forcedName)

			return utils.slugify(this.name_from_user);
		},
		validated(){
			return ( this.name.trim() !== '' && this.file !== null );
		}
	},
	methods: {
		fileChange(e)
		{
			this.file = e.target.files[0];
		},
		submit( e ){
			e.preventDefault();

			if( !this.validated ){
				return;
			}

			this.loading = true;
			this.sendData(this.name, this.file);
		},
		sendData(name, file) {
			let logo_id = this.logo_id, type = this.type, handle = this.logo.handle;
			let data = {file, name, type, logo_id, handle };
			let cb = this.handleResponse;

			const formData = new FormData();

			for (const name in data) formData.append(name, data[name]);

			console.log('Uploading asset', data);

			fetch(this.symfony.api.logos.logo.variant.upload, {method: 'POST', body: formData})
			  .then(res => res.json())
			  .then(res => cb(res))
			  .catch(error => {
				  cb({
					  error: true,
					  message: error.message
				  })
			  })
		},
		handleResponse(response) {
			this.loading = false;

			if (response.error === true) {
				this.alert('ERROR UPLOADING: ' + response.message, 'danger');
				return;
			}

			this.file = null;
			this.name_from_user = '';
			this.$refs.fileInput.value = '';



			this.onUpload(response);
		},
	}
}
</script>
<template>
	<form @submit="submit">
		<div class="row mb-3">
			<div class="col" v-if="!forcedName">
				<label class="form-label fw-bold">Name:</label>
				<input class="form-control" type="text" v-model="name_from_user">
				<div class="form-text">
					File will be renamed to: <b>{{ name }}</b>
				</div>
			</div>
			<div class="col">
				<label class="form-label fw-bold">Select image to upload:</label>
				<input class="form-control" type="file" accept="image/*" ref="fileInput" @change="fileChange">
			</div>
		</div>
		<div class="row">
			<div class="col">
				<button class="btn btn-primary" @click="submit" :disabled="!validated">Upload</button>
			</div>
		</div>
	</form>
</template>