<script setup>
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['rule', 'index', 'edit', 'paste', 'copy', 'copyActive', 'remove'],
	inject: ['symfony'],
	methods: {}
}
</script>
<template>
	<tr class="align-middle">
		<td class="col-1">
			<div class="d-flex gap-1">
				<template v-if="copyActive">
					<button class="btn btn-sm btn-outline-info ms-2" @click="paste(rule)">Paste</button>
				</template>
				<template v-else>
					<button class="btn btn-sm btn-primary" @click="edit(rule, index)"><i class="bi bi-pencil"></i></button>
					<button class="btn btn-sm btn-outline-primary" @click="copy(rule)"><i class="bi bi-copy"></i></button>
				</template>
			</div>
		</td>
		<td>
			<template v-if="rule.type === 'product'">
					<span>
						<small>
							<i class="bi bi-building"></i> {{ rule.entity.product.company.name }}
							|
							<i class="bi bi-box-seam me-1"></i>
							<a :href="symfony.views.products_product.replace(':id', rule.entity.product.id)" target="_blank">
								{{ rule.entity.product.sku }}
							</a>
							<span class="d-block">{{ rule.name }}</span>
						</small>
					</span>
				<small v-for="filter in rule.filters" class="d-flex gap-1">
					<span><span class="badge text-bg-secondary">{{ filter.attribute }}</span></span>
					<span>:</span>
					<span>{{ filter.value.join(', ')}}</span>
				</small>
			</template>
			<template v-else-if="rule.type === 'category'">
					<span>
						<small>
							<i class="bi bi-tags"></i> Category
						</small>
					</span>
				<span class="d-block">
						<span class="text-secondary">{{ rule.entity.category.path }}</span>
						{{ rule.name }}
					</span>
			</template>
		</td>
		<td>
			<small v-for="overwrite in rule.overwrites" class="d-flex gap-1">
				<span><span class="badge text-bg-warning">{{ overwrite.attribute }}</span></span>
				<span>:</span>
				<span>{{ overwrite.value }}</span>
			</small>
			<small v-if="rule.decoration_sets.length" class="d-flex gap-1">
				<span><span class="badge text-bg-warning">decoration sets</span></span>
				<span>:</span>
				<span>
					<span class="" v-for="set in rule.decoration_sets">
						<span class="text-nowrap">{{ set.id }}, </span>
					</span>
				</span>
			</small>
			<div v-if="rule.decoration_groups && rule.decoration_groups.length" class="d-flex gap-1">
				<div><span class="badge text-bg-warning">decoration groups</span></div>
				<div>:</div>
				<div>
					<span class="d-block" v-for="group in rule.decoration_groups"><span class="text-nowrap">{{ group.id }}, </span></span>
				</div>
			</div>
		</td>
		<td>
			<button class="btn btn-sm btn-danger" @click="remove(index)"><i class="bi bi-x"></i></button>
		</td>
	</tr>
</template>
