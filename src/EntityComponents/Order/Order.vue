<script setup>
import Items from "@/EntityComponents/Order/Items.vue";
import Logos from "@/EntityComponents/Order/Logos.vue";
import Vendors from "@/EntityComponents/Order/Vendors.vue";
</script>

<script>
export default {

}
</script>

<template>

	<nav class="pt-4">
		<div class="nav nav-tabs" id="nav-tab" role="tablist">
			<button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-quote-items" type="button">Items</button>
			<button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-quote-logos" type="button">Logos</button>
			<button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-quote-vendors" type="button">Vendors</button>
		</div>
	</nav>

	<div class="tab-content pt-3">
		<div class="tab-pane fade show active" id="tab-quote-items">
			<Items />
		</div>

		<div class="tab-pane fade" id="tab-quote-logos">
			<Logos />
		</div>

		<div class="tab-pane fade" id="tab-quote-vendors">
			<Vendors />
		</div>
	</div>

</template>