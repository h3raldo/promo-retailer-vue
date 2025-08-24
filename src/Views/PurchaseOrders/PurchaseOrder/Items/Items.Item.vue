<script setup>
import Edit from "@/EntityComponents/Order/Items/Item/Edit.vue";
import Cost from '@/EntityComponents/Order/Items/Item/Cost.vue';
import SubItems from "@/EntityComponents/Order/Items/Item/SubItems.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
import pricing from "@/js/pricing.js";
</script>

<script>
import pricing from "@/js/pricing.js";
import {computed, toRaw} from "vue";

export default {

	data() {
		return {}
	},

	props: ['item', 'itemIndex'],
	inject: ['order', 'updatePricing', 'fn', 'symfony'],

	provide() {
		return {
			item: computed(() => this.item),
			itemIndex: computed(() => this.itemIndex)
		}
	},

	watch: {
		'item.cost.material.tiers': {
			handler(){
				this.updatePricing();
			},
			deep: true
		},
		'item.decoration': {
			handler(){
				this.updatePricing();
			},
			deep: true
		},
		'item.options': {
			handler(){
				this.updatePricing();
			},
			deep: true
		},
		'item.sizes': {
			handler(){
				this.updatePricing();
			},
			deep: true
		},
		'item.colors': {
			handler(){
				this.updatePricing();
			},
			deep: true
		},
		'item.pricing.base.material.overwrites': {
			handler(){
				this.updatePricing();
			},
			deep: true
		}
	},

	computed: {
		isOverMinimum(){
			return this.item.qty >= pricing.getMinimum(this.item);
		}
	},

	methods: {
		duplicate(){
			this.fn.item.duplicate(this.itemIndex);
		},
		remove() {
			this.fn.item.remove(this.itemIndex);
		},
		move(fromIndex, direction) {
			this.fn.item.move(fromIndex, direction);
		},
		getPlacementLogoClasses( variation ){
			let classes = 'p-1 text-center ';
			if( variation && variation.includes('dark') ) classes += 'bg-secondary';
			else classes += 'bg-light'

			return classes;
		}
	}
}
</script>

<template>
	<template v-for="color in item.subitems">
		<template v-for="size in color.sizes">
			<tr class="border-bottom pb-2">
				<td>
					<div v-if="item.info.image.primary && item.info.image.primary.length > 0">
						<a :href="item.info.image.primary" target="_blank"><img :src="item.info.image.primary" height="75" style="border-radius: 20px" /></a>
					</div>
				</td>
				<td>
					<h6><i v-if="item.info.hidden" class="bi bi-eye-slash me-1"></i>
						{{ item.info.name }}
					</h6>

					<template v-if="order.info.type === 'decorator'">
						<span v-if="item.personalization && item.personalization.length > 0" class="badge text-bg-warning">Has Personalization</span>

						<span v-if="item?.info?.product?.id" class="badge text-bg-secondary me-1">
				<i class="bi bi-box-seam me-1"></i>
				<a class="text-bg-secondary" :href="symfony.views.products_product.replace(':id', item.info.product.id)" target="_blank">{{ item.info.product.sku }}</a>
			</span>
						<span class="badge text-bg-secondary me-1" v-else-if="item.info.sku">{{ item.info.sku }}</span>

						<span class="badge text-bg-primary me-1" v-if="item.notes.flags.includes('RP')">Require Proof</span>
						<span class="badge text-bg-primary me-1" v-if="item.notes.flags.includes('NP')">Needs Package</span>

						<div v-for="placement in item.decoration.placements" class="d-flex gap-2 align-items-center p-1 mb-1 bg-light">
				<span class="col-4 text-center">
					{{ placement.location.name }}:
				</span>
							<span class="col-4" :class="getPlacementLogoClasses( placement.logo.variation )">
					<a :href="placement.logo.url" target="_blank"><img :src="placement.logo.url" width="100"  alt="" /></a>
				</span>
						</div>

					</template>

					<div class="alert alert-light d-flex align-items-center mb-2" role="alert" v-if="item.notes.public.length">
						<i class="bi bi-info-circle me-2"></i>
						<div>
							{{ item.notes.public }}
						</div>
					</div>

					<div class="alert alert-primary d-flex align-items-center mb-2" role="alert" v-if="item.notes.private.length">
						<i class="bi bi-eye-slash me-2"></i>
						<div>
							{{ item.notes.private }}
						</div>
					</div>

					<div class="d-flex gap-2">
						<Modal :id="'modal-edit-item-'+itemIndex" :title="item.info.name" :buttonText="'Edit'" :buttonClasses="'btn btn-sm btn-primary'" :icon="'bi-pencil-square'">
							<Edit />
						</Modal>
						<button class="btn btn-outline-primary btn-sm" @click="duplicate"><i class="bi bi-copy"></i></button>
						<button class="btn btn-outline-secondary btn-sm" @click="move(itemIndex, 'up')"><i class="bi bi-arrow-up"></i></button>
						<button class="btn btn-outline-secondary btn-sm" @click="move(itemIndex, 'down')"><i class="bi bi-arrow-down"></i></button>
					</div>

				</td>
				<td>{{ color.color.name }}</td>
				<td>{{ size.name }}</td>
				<td>{{ size.qty }}</td>
				<td><input type="number" class="form-control" v-model="size.pricing.totals.cost" disabled></td>
				<td><input type="number" class="form-control" v-model="size.pricing.totals.cost"></td>
				<td><input type="number" class="form-control" v-model="size.qty"></td>
				<td><button class="btn btn-danger" @click="remove"><i class="bi bi-trash"></i></button></td>
			</tr>
		</template>
	</template>
</template>