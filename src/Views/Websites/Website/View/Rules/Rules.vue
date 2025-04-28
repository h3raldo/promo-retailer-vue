<script setup>
import Rule from "@/Views/Websites/Website/View/Rules/Rule.vue";
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['category', 'edit', 'paste', 'copy', 'copyActive', 'remove', 'duplicate'],
	inject: [],
	methods: {}
}
</script>
<template>
	<div class="">
		<table class="table">
			<thead>
			<tr>
				<th colspan="5">{{ category.name }} <small class="fw-normal">{{ category.rules.length }} Product(s)</small></th>
			</tr>
			</thead>
			<tbody>
				<Rule v-for="rule in category.rules" :rule="rule.rule" :index="rule.index" :edit="edit" :paste="paste" :copy="copy" :copyActive="copyActive" :duplicate="duplicate" :remove="remove" />
			</tbody>
		</table>
	</div>
</template>
