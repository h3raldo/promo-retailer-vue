<script setup>
import Edit from "@/ViewComponents/Quotes/Quote/Items/Item/Edit.vue";
import Cost from '@/ViewComponents/Quotes/Quote/Items/Item/Cost.vue';
import SubItems from "@/ViewComponents/Quotes/Quote/Items/Item/SubItems.vue";
import Modal from "@/components/globals/bootstrap/Modal.vue";
</script>

<script>
import pricing from "@/js/Quotes/Quote/pricing.js";
import {computed, toRaw} from "vue";

export default {

	data() {
		return {}
	},

	props: ['item', 'itemIndex'],
	inject: ['quote', 'updatePricing', 'removeQuoteItem', 'addQuoteItem'],

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
			this.addQuoteItem( JSON.parse(JSON.stringify(toRaw(this.item))) );
		},
		remove() {
			this.removeQuoteItem(this.itemIndex);
		},
		move(fromIndex, direction) {
			let array = this.quote.items;
			let toIndex = fromIndex;

			switch (direction){
				case 'up':
					toIndex--;
					break;
				case 'down':
					toIndex++;
					break;
			}

			let element = this.quote.items[fromIndex];
			array.splice(fromIndex, 1);
			array.splice(toIndex, 0, element);
		}
	}
}
</script>

<template>
	<div class="row p-2 border-bottom pb-3">
		<div class="col col-4">
			<h5><i v-if="item.info.hidden" class="bi bi-eye-slash me-1"></i>{{ item.info.name }}</h5>

			<div>
				<img v-if="item.info.image.primary.length > 0" alt="" :src="item.info.image.primary" height="100" style="border-radius: 20px" />
				<div v-for="placement in item.decoration.placements" class="d-flex gap-2 align-items-center p-1 bg-light mb-1">
					<span>
						{{ placement.location.name }}
					</span>
					<span>
						<img :src="placement.logo.url" width="100"  alt="" />
					</span>
				</div>
			</div>

			<div class="mb-2">
				<span class="badge text-bg-secondary me-1" v-if="item.info.sku">Item # {{ item.info.sku }}</span>
				<span class="badge text-bg-secondary me-1" v-if="item.info.supplier.name">Supplier: {{ item.info.supplier.name }}</span>
			</div>

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
		</div>
		<div class="col col-7">
			<Cost />
			<SubItems />
		</div>
		<div class="col col-1 text-end">
			<div class="d-flex justify-content-end gap-3">

				<div>
					<button class="btn btn-danger" @click="remove"><i class="bi bi-trash"></i></button>
				</div>
			</div>
		</div>
	</div>
</template>