<script setup>
import Items from "@/EntityComponents/Order/Items.vue";
import Logos from "@/EntityComponents/Order/Logos.vue";
import Vendors from "@/EntityComponents/Order/Vendors.vue";
import References from "@/components/globals/References.vue";
</script>

<script>
export default {

}
</script>

<template>

	<nav class="pt-4">
		<div class="nav nav-tabs" id="nav-tab" role="tablist">
			<button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-items" type="button">Items</button>
			<button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-logos" type="button">Logos</button>
			<button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-vendors" type="button">Vendors</button>
			<button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-references" type="button">References</button>
		</div>
	</nav>

	<div class="tab-content pt-3">
		<div class="tab-pane fade show active" id="tab-items">
			<Items />
		</div>

		<div class="tab-pane fade" id="tab-logos">
			<Logos />
		</div>

		<div class="tab-pane fade" id="tab-vendors">
			<Vendors />
		</div>

		<div class="tab-pane fade" id="tab-references">
			<References />
		</div>
	</div>

</template>