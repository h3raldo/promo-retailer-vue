<script setup>
</script>
<script>
export default {
	data(){
		return {
			background: ''
		}
	},
	props: ['image', 'link', 'width', 'height'],
	inject: [],
	methods: {
		toggle(){
			this.background = this.background === '' ? 'bg-secondary' : ''
		}
	}
}
</script>
<template>
	<div class="d-inline-block text-center">
		<div class="d-inline-block p-2" :class="background">
			<a v-if="link" target="_blank"><img :src="image" :height="height" :width="width" alt=""></a>
			<img v-else :src="image" :height="height" :width="width" alt="">
			<slot></slot>
		</div>
		<div class="mt-3">
			<button class="btn btn-outline-secondary btn-sm" @click="toggle">Toggle BG</button>
		</div>
	</div>
</template>
