<script>
export default {
	props: ['totals']
}
</script>

<template>

	<div v-if="totals.decorations" class="row bg-gray p-3">

		<div class="col" v-for="(value, category) in totals.decorations">

			<h5>{{ category.toUpperCase() }}</h5>

			<ul>
				<li v-for="(count, key) in value">
					{{ key }}: {{ count }}
				</li>
			</ul>

		</div>

	</div>

</template>