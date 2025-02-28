<script setup>
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['status'],
	inject: [],
	methods: {
		getColor()
		{
			let statuses = {
				enabled: 'success',
				disabled: 'secondary',
				new: 'warning',
			}

			let className = 'secondary';
			if( statuses[this.status] ) className = statuses[this.status];

			return `text-bg-${className}`;
		}
	}
}
</script>
<template>
	<span class="badge" :class="getColor()">{{ status }}</span>
</template>
