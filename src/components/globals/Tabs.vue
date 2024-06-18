<script>
export default {
	props: ['labels', 'onTabChange', 'first'],
	data(){
		return {
			activeLabel: this.labels[0]
		}
	},
	methods: {
		onLabelClick(label) {
			this.activeLabel = label.replace(' ', '');
			if( this.onTabChange ) this.onTabChange(label);
		},
		tabClasses(label){
			let classes = 'nav-link'
			if( label === this.activeLabel )  classes += ' active';
			return classes;
		}
	},
	mounted() {
		if( !this.first ) return;

		this.activeLabel = this.first;
	}
}
</script>
<template>
	<div class="pt-4">

		<div class="nav nav-tabs" role="tablist">
			<button v-for="label in labels" :key="label" @click="onLabelClick(label)" :class="tabClasses(label)">{{ label }}</button>
		</div>

		<div class="tab-content pt-3">
			<div class="tab-pane fade show active">
				<slot :name="activeLabel">
					{{ activeLabel }}
				</slot>
			</div>
		</div>
	</div>
</template>

