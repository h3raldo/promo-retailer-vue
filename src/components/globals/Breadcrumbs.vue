<script setup>
</script>
<script>
export default {
	data() {
		return {
			entities: {
				'company': {
					'title': 'Company',
					'empty': 'NO COMPANY',
					'icon': 'bi bi-building'
				},
				'order': {
					'title': 'Sales Order',
					'empty': 'No Order',
					'icon': 'bi bi-table'
				},
				'quote': {
					'title': 'Quote',
					'empty': 'No Quote',
					'icon': 'bi bi-calculator'
				},
				'po': {
					'title': 'Purchase Order',
					'empty': 'No PO',
					'icon': 'bi bi-cash-coin'
				},
				'website': {
					'title': 'Website',
					'empty': 'No Website',
					'icon': 'bi bi-columns'
				},
				'logo': {
					'title': 'Logo',
					'empty': 'No Logo',
					'icon': 'bi bi-image'
				},
				'product': {
					'title': 'Product',
					'empty': 'No Product',
					'icon': 'bi bi-box-seam'
				}
			}
		}
	},
	props: ['items'],
	inject: ['symfony'],
	computed: {
		pathItems(){
			if( !this.items || this.items.length === 1 ) return [];
			return this.items.slice(0, -1);
		},
		currentItem(){
			return this.items[this.items.length - 1];
		}
	},
	methods: {
		getRouterLink(crumb)
		{
			if( !crumb.id ) return '';

			if( crumb.type === 'company' ){
				return symfony.views.companies_company.replace(':id', crumb.id)
			}

			if( crumb.type === 'order' ){
				return symfony.views.orders_order.replace(':id', crumb.id)
			}

			if( crumb.type === 'po' ){
				return symfony.views.purchase_orders_purchase_order.replace(':id', crumb.id)
			}

			if( crumb.type === 'website' ){
				return symfony.views.websites_website.replace(':id', crumb.id)
			}

			if( crumb.type === 'quote' ){
				return symfony.views.quotes_quote.replace(':id', crumb.id)
			}

			return '';
		}
	},
	created() {
		console.log(this.items);
	}
}
</script>
<template>

	<div class="d-flex gap-3 align-items-center">

		<template v-for="item in pathItems">

			<span v-if="item.type !== 'text'">
				<small class="d-block" style="font-size: 11px;">
					<span class="text-secondary"><i :class="entities[item.type].icon"></i> {{ entities[item.type].title }}</span>
				</small>
				<RouterLink v-if="getRouterLink(item)" :to="getRouterLink(item)">{{ item.title }}</RouterLink>
				<span class="fw-bold" v-else>{{ entities[item.type].empty }}</span>
			</span>
			<span v-else>
				<small class="d-block" style="font-size: 11px;">
					<span class="text-secondary"><i :class="item.icon"></i> {{ item.subtitle }}</span>
				</small>
				<span class="fw-bold">{{ item.title || 'No Name' }}</span>
			</span>

			<div>
				<i class="bi bi-chevron-right"></i>
			</div>

		</template>

		<span>
			<small class="d-block" style="font-size: 11px;">
				<i :class="entities[currentItem.type].icon"></i> {{ entities[currentItem.type].title }}
			</small>
			<span class="d-flex">
				<span class="fw-bold me-2">
					{{ currentItem.title || 'No Name' }}
				</span>
			</span>
		</span>

		<slot></slot>
	</div>

</template>
