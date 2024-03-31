<script>

export default {

	data(){
		return {
			fileInput: '',
			pastedInput: '',
			loading: false,
			images: []
		}
	},

	inject: ['alert', 'symfony'],

	computed: {
		formClasses(){
			if( this.pastedInput !== '' ) return 'status--pasted'
			return ''
		},
		pastedFile(){
			return this.pastedInput !== ''
		}
	},

	methods:{
		uploadImage()
		{
			let file = false;

			if (this.$refs.fileInput.value) file = this.$refs.fileInput.files[0];
			if (this.pastedInput) file = this.pastedInput

			if (!file) {
				alert('No File Chosen/Pasted');
				return;
			}

			console.log('selected file');
			console.log(file);

			this.loading = true;
			this.sendData(file);
		},

		sendData(file) {
			let data = {file: file}
			let cb = this.handleResponse;

			const formData = new FormData();

			for (const name in data) formData.append(name, data[name]);

			fetch(this.symfony.images.upload, {method: 'POST', body: formData})
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

			response.images.forEach(image => this.images.push(image));
			this.reset();
		},

		handlePaste(e){
			e.preventDefault();

			for (const clipboardItem of e.clipboardData.files) {
				if (clipboardItem.type.startsWith('image/')) {
					this.pastedInput = clipboardItem;
				} else {
					alert('Pasted data is not an image');
				}
			}
		},

		reset() {
			this.pastedInput = '';
			this.$refs.fileInput.value = '';
		}
	},

	mounted() {
		document.addEventListener('paste', this.handlePaste)
	},

	unmounted() {
		document.removeEventListener('paste', this.handlePaste)
	}
}

</script>

<template>

	<div :class="formClasses">
		<div class="row align-items-end py-4">
			<div class="col">
				<label class="form-label fw-bold">Select image to upload:</label>
				<input class="form-control" type="file" accept="image/*" ref="fileInput">
			</div>
			<div class="col text-center">
				- OR -
			</div>
			<div class="col text-center">
				<span v-if="!pastedFile" class="before-pasted bg-light p-3">Paste Image (ctrl/cmd+v)</span>
				<span v-if="pastedFile" class="when-pasted border border-success p-3 text-success"><i class="bi bi-check-lg"></i> Image Pasted, Click Upload </span><br>
			</div>
		</div>

		<br>
		<div class="text-center">
			<button class="btn btn-primary" id="uploadImage" @click="uploadImage" :disabled="loading">
				<span v-if="loading">Uploading...</span>
				<span v-else>Upload Image</span>
			</button>
		</div>
	</div>

	<br><hr><br>

	<div>Uploaded Images:</div>

	<div class="py-3" id="uploaded">
		<div v-for="image in images" class="d-flex gap-3 align-items-center p-3 mb-3 bg-light">
			<div class="col-2">
				<img :src="image" alt="">
			</div>
			<div class="flex-fill">
				<span class="bg-white d-block p-3 border">{{ image }}</span>
			</div>
		</div>
	</div>

</template>