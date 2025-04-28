<script setup>
import RuleConfig from "@/Views/Websites/Website/View/Rules/Rule.Config.vue";
import RuleEdit from "@/Views/Websites/Website/View/Rules/Rule.Edit.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>
<script>
export default {
	data() {
		return {
			edit: false
		}
	},
	props: ['globals'],
	inject: [],
	methods: {
		openModal(){
			this.edit = true;
			this.$refs.editModal.$refs.openModalButton.click();
		}
	}
}
</script>
<template>
	<div class="d-flex justify-content-between gap-2 align-items-center">
		<div class="d-flex gap-2 align-items-center">
			<span>Global Rules:</span>
			<button class="btn btn-sm btn-outline-primary" @click="openModal">Edit</button>
		</div>
		<div>
			<RuleConfig :rule="globals" />
		</div>
	</div>
	<Modal title="Edit Rule" buttonClasses="btn btn-sm btn-primary d-none" icon="bi-pencil" ref="editModal">
		<RuleEdit v-if="edit" :rule="globals" :index="3333" />
	</Modal>
</template>
