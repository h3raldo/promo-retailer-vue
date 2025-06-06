<script setup>
import RuleConfig from "@/Views/Websites/Website/View/Rules/Rule.Config.vue";
</script>
<script>
export default {
	data() {
		return {}
	},
	props: ['rule', 'index', 'edit', 'paste', 'copy', 'copyActive', 'remove', 'duplicate', 'qty'],
	inject: ['symfony', 'products'],
	methods: {
		getProduct(){
			return this.products[ this.rule.entity.product.id ];
		}
	}
}
</script>
<template>
	<tr class="align-middle">
		<td style="width: 5.5rem;">
			<div class="d-flex gap-1">
				<template v-if="copyActive">
					<button class="btn btn-sm btn-outline-info ms-2" @click="paste(rule)">Paste</button>
				</template>
				<template v-else>
					<button class="btn btn-sm btn-primary" @click="edit(rule, index)"><i class="bi bi-pencil"></i></button>
					<button v-if="typeof copy === 'function'" class="btn btn-sm btn-outline-info" @click="copy(rule)">Copy</button>
					<button v-if="typeof duplicate === 'function'" class="btn btn-sm btn-outline-primary" @click="duplicate(rule)"><i class="bi bi-copy"></i></button>
				</template>
			</div>
		</td>
		<td>
			<template v-if="rule.type === 'product'">
				<div class="d-flex gap-3">
					<div style="width: 40px">
						<a v-if="getProduct().thumbnail" :href="getProduct().thumbnail" target="_blank"><img :src="getProduct().thumbnail" alt="" height="40" loading="lazy"></a>
					</div>
					<div class="flex-fill">
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
					</div>
					<div v-if="qty === true" class="col-1 d-flex align-items-center gap-3">
						<div>
							<i class="bi bi-x"></i>
						</div>
						<div>
							<input class="form-control" type="number" v-model="rule.qty">
						</div>
					</div>
				</div>
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
			<RuleConfig :rule="rule" />
		</td>
		<td>
			<button class="btn btn-sm btn-danger" @click="remove(index)"><i class="bi bi-x"></i></button>
		</td>
	</tr>
</template>
