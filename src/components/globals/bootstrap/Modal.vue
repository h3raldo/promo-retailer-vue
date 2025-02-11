<script setup>
</script>

<script>
export default {

	data() {
		return {

		}
	},

	inject: [],

	computed: {
		modalID(){
			if( this.id ) return this.id;
			return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
		},
		modalButtonText(){
			if( this.buttonText ) return this.buttonText;
			if( this.icon && !this.buttonText ) return '';
			if( this.title ) return this.title;
			return 'Open Modal';
		},
		modalButtonClasses(){
			if( this.buttonClasses ) return this.buttonClasses;
			return 'btn btn-primary';
		}
	},

	props: ['id', 'title', 'buttonText', 'buttonClasses', 'buttonType', 'icon', 'openOnCreation', 'onOpen'],

	methods: {
		clickedOpenButton(){
			if( this.onOpen ) this.onOpen();
		}
	},

	mounted() {
		if( this.openOnCreation ){
			this.$refs.openModalButton.click();
		}
	}
}
</script>

<template>

	<template v-if="buttonType === 'link'">
		<a href="#" data-bs-toggle="modal" :data-bs-target="'#'+modalID" ref="openModalButton" @click="clickedOpenButton">
			<i v-if="icon && icon.length > 0" :class="'bi '+ icon"></i> {{ modalButtonText }}
		</a>
	</template>
	<template v-else>
		<button type="button" :class="modalButtonClasses" data-bs-toggle="modal" :data-bs-target="'#'+modalID" ref="openModalButton" @click="clickedOpenButton">
			<i v-if="icon && icon.length > 0" :class="'bi '+ icon"></i>
			{{ modalButtonText }}
		</button>
	</template>


	<Teleport to="body">
		<div class="modal modal-xl fade text-start" :id="modalID" tabindex="-1" ref="modal">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="search_modalLabel">{{ title }}</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>

					<div class="modal-body">
						<slot></slot>
					</div>

					<div class="modal-footer">
						<slot name="footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" ref="closeModalButton">Close</button>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</Teleport>

</template>