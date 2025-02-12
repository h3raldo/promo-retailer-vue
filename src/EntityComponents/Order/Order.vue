<script setup>
import Items from "@/EntityComponents/Order/Items.vue";
import Logos from "@/EntityComponents/Order/Logos.vue";
import Vendors from "@/EntityComponents/Order/Vendors.vue";
import References from "@/components/globals/References.vue";
import Tabs from "@/components/globals/Tabs.vue";
</script>
<script>
export default {
	data(){
		return {
			tabs: ['Info', 'Items', 'Logos', 'Vendors', 'References']
		}
	},
	inject: ['init'],
	computed: {
		POsCostAccurate(){
			if( !this.init || !this.init.qa || !this.init.qa.POs ) return true;

			return this.init.qa.POs.difference < 5;
		},
		POsCostDifferential(){
			if( !this.init.qa || !this.init.qa.POs ) return 100;
			return this.init.qa.POs.difference
		}
	}
}
</script>

<template>

	<span v-if="!POsCostAccurate" class="badge text-bg-danger">
		<i class="bi bi-exclamation-circle"></i>
		{{ Math.round(POsCostDifferential) }}% PO Diff
	</span>
	<Tabs :labels="tabs" first="Items">

		<template #Info>
			<slot name="info"></slot>
		</template>

		<template #Items>
			<Items />
		</template>

		<template #Logos>
			<Logos />
		</template>

		<template #Vendors>
			<Vendors />
		</template>

		<template #References>
			<References />
		</template>

	</Tabs>

</template>