<script setup>
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['rule', 'index', 'edit', 'paste', 'copy', 'remove'],
	inject: ['symfony'],
	methods: {}
}
</script>
<template>
	<tr class="align-middle">
		<td>
			<button class="btn btn-primary btn-sm" @click="edit(rule, index)"><i class="bi bi-pencil"></i></button>

			<template v-if="copy.active">
				<button class="btn btn-sm btn-outline-info ms-2" @click="paste(rule)">Paste</button>
			</template>
			<template v-else>
				<button class="btn btn-sm btn-outline-primary ms-2" @click="copy(rule)">Copy</button>
			</template>
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
						</small>
					</span>
				<span class="d-block">{{ rule.name }}</span>
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
			<div v-for="filter in rule.filters" class="d-flex gap-1">
				<div><span class="badge text-bg-secondary">{{ filter.attribute }}</span></div>
				<div>:</div>
				<div>{{ filter.value.join(', ')}}</div>
			</div>
		</td>
		<td>
			<div v-for="overwrite in rule.overwrites" class="d-flex gap-1">
				<div><span class="badge text-bg-warning">{{ overwrite.attribute }}: {{ overwrite.value }}</span></div>
			</div>

			<div v-if="rule.decoration_sets.length" class="d-flex gap-1">
				<div><span class="badge text-bg-warning">decoration sets</span></div>
				<div>:</div>
				<div>
					<span class="d-block" v-for="set in rule.decoration_sets"><span class="text-nowrap">{{ set.id }}</span></span>
				</div>
			</div>

			<div v-if="rule.decoration_groups && rule.decoration_groups.length" class="d-flex gap-1">
				<div><span class="badge text-bg-warning">decoration groups</span></div>
				<div>:</div>
				<div>
					<span class="d-block" v-for="group in rule.decoration_groups"><span class="text-nowrap">{{ group.id }}</span></span>
				</div>
			</div>
		</td>
		<td>
			<button class="btn btn-sm btn-danger" @click="remove(index)"><i class="bi bi-x"></i></button>
		</td>
	</tr>
</template>
