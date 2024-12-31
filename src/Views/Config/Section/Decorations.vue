<script setup>
import Tabs from "@/components/globals/Tabs.vue";
import Locations from "@/Views/Config/Section/Decorations/Locations.vue";
import Sets from "@/Views/Config/Section/Decorations/Sets.vue";
import Groups from "@/Views/Config/Section/Decorations/Groups.vue";
</script>
<script>
export default {
	data() {
		return {
			tabs: ['Sets', 'Groups', 'Locations']
		}
	},
	props: [],
	inject: [],
	methods: {}
}
</script>
<template>

	<h2>Global Decoration Settings</h2>

	<Tabs :labels="tabs" first="Groups">

		<template #Locations>
			<Locations />
		</template>

		<template #Sets>
			<Sets />
		</template>

		<template #Groups>
			<Groups />
		</template>
	</Tabs>
</template>
