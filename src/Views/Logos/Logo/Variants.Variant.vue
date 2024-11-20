<script>
import entity from "@/js/entity.js";

export default {
	data(){
		return {
			contrast: false,
		}
	},
	computed: {
		apply_types(){
			return entity.logo.variant.types;
		}
	},
	props: ['variant', 'decorators', 'edit'],
}
</script>
<template>
	<div  class="col col-6 mb-3">
		<div class="row align-items-center">

			<div class="col text-center">
				<a :href="variant.url" target="_blank"><img :class="contrast ? 'bg-secondary p-2' : 'p-2'" :src="variant.url" alt="" width="200"></a>
				<br><a class="btn btn-sm btn-outline-secondary mt-3" @click="contrast = !contrast">Toggle BG</a>

				<a class="ms-2 btn btn-sm btn-outline-primary mt-3" @click="contrast = !contrast">Replace Image</a>
			</div>

			<div class="col">
				<div class="bg-light p-2">
					<template v-if="edit">

						<div class="mb-2">
							<label class="form-label">ID:</label>
							<input type="text" class="form-control" placeholder="ID" v-model="variant.uid" disabled>
						</div>
						<div class="mb-2">
							<label class="form-label">Applies To:</label>
							<select class="form-select" v-model="variant.apply_to">
								<option v-for="type in apply_types" :value="type">{{ type }}</option>
							</select>
						</div>
						<div class="mb-2">
							<label class="form-label">Color Count:</label>
							<input type="number" class="form-control" placeholder="Color Count" v-model="variant.color_count">
						</div>
						<div class="mb-2">
							<label class="form-label">thread_count:</label>
							<input type="number" class="form-control" placeholder="thread_count" v-model="variant.thread_count">
						</div>
						<div class="mb-2">

							<details>
								<summary>
									<label class="form-label">Decorators:</label>
								</summary>
								<div v-for="decorator in decorators">
									<label class="form-check-label bg-gray px-2 rounded small">
										<input class="form-check-input me-1" type="checkbox" v-model="variant.decorators" :value="decorator.handle">
										<span>{{ decorator.name }}</span>
									</label>
								</div>
							</details>
						</div>

					</template>
					<template v-else>
						<span class="badge text-bg-secondary me-1">ID: {{ variant.uid }}</span>
						<span class="badge text-bg-primary">{{ variant.apply_to }}</span>
						<div>Color count: {{ variant.color_count }}</div>
						<div>Thread count: {{ variant.thread_count }}</div>
						<div>Decorators:
							<span v-for="(decorator) in variant.decorators">{{ decorator }}, </span>
						</div>
					</template>

				</div>
			</div>
		</div>
	</div>
</template>