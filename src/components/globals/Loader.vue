<script>
export default {
	data(){
		return {

		}
	},
	props: ['align'],
	computed: {
		alignClass(){
			let align = this.align ?? 'center';
			return 'text-' + align;
		}
	}
}
</script>
<template>
	<div :class="alignClass">
		<div class="py-3">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>
	</div>
</template>