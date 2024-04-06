<script>
export default {
	data(){
		return {
			color: {},
			size: {},
			decoration_set: '',
			placement: [],
			locations: {}
		}
	},
	props: ['sku', 'placement_keys'],

	computed: {

	}
}
</script>

<template>

	<tr class="sku-decorations">
		<td>{{ sku.group }}</td>
		<td>
			{{ sku.title }}
			<details>
				<summary>Preview Pricing</summary>

				<div class="input-group mb-3">
					<input type="number" class="form-control qty" value="1">
					<button class="btn btn-outline-secondary preview-pricing" :data-json="sku.json_config" type="button">Quote</button>
				</div>

				<div class="pricing-info"></div>
			</details>
		</td>
		<td>
			<select class="color" v-model="color">
				<option :value="{}">---</option>
				<option v-for="color in sku.children" :value="color">{{ color.color }} ({{ color.vendor_color }})</option>
			</select>

			<template v-if="color.children">
				<select class="size" v-model="size">
					<option :value="{}">--</option>
					<option v-for="size in color.children" :value="size">{{ size.size }}</option>
				</select>
			</template>

		</td>
		<td>
			<template v-if="color.placements">
				<select class="set" v-model="placement">
					<option value="" :value="{}"></option>
					<option v-for="(set, set_id) in color.placements" :value="{id: set_id, locations: set}">{{ set_id }}</option>
				</select>
			</template>
		</td>
		<td>

			<div v-for="location in placement.locations" class="input-group mb-3 option-group">
				<span class="input-group-text" id="basic-addon1">{{ placement_keys[location.locations[0]].name }}:</span>

				<select class="option form-select" autocomplete="off">
					<template v-for="logos in location.logos">
						<template v-for="logo in logos">
							<option v-for="decorator in location.decorators" :value="{ logo: logo, decorator: decorator, location: location }">
								{{ logo.logo.uid}} :: {{ decorator }}
							</option>
						</template>
					</template>
				</select>

			</div>
		</td>
		<td>
			<button class="btn btn-primary preview-images" :data-group="sku.group" data-color="">Preview</button>
			<div class="preview-links"></div>
		</td>
	</tr>

</template>
