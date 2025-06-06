<script setup>
</script>
<script>
import entity from "@/js/entity.js";

export default {
	data() {
		return {
			logo: '',
			preview_logos: [{"id": "firetrol-primary--dark", "name": "Firetrol Primary Dark"}, {"id": "firetrol-primary--light", "name": "Firetrol Primary Light"}, {"id": "als-knockout-logo--dark", "name": "ALS Dark"}, {"id": "als-knockout-logo--light", "name": "ALS Light"}],
		}
	},
	props: ['location', 'placement', 'image', 'mouse', 'createPlacement', 'deletePlacement'],
	inject: [],
	computed: {
		logoLocation(){
			if( !this.placement ) return;
			let l = this.placement;

			return `top: ${l.top}px; left: ${l.left}px; width: ${l.width}px; height: ${l.height}px; transform: rotate(${l.rotation}deg);`
		}
	},
	methods: {
		generateTestImage(){
			entity.product.placement.editor.image.generateTest( this.logo, this.placement, this.image)
		},
		setupDragging(){
			this.mouse.placement = this.placement;
			this.mouse.down = true;

			let self = this;

			function handleMouseMove(e){
				if (!self.mouse.placement) return;

				let position = self.mouse.placement;

				if (!self.mouse.down) return;
				e.preventDefault();

				console.log('about to update', self.placement);

				if (self.mouse.started === false) {
					self.mouse.start.x = e.pageX;
					self.mouse.start.y = e.pageY;
					self.mouse.started = true;
				}

				if (self.mouse.end.x !== 0) {
					position.left += e.pageX - self.mouse.end.x;
					position.top += e.pageY - self.mouse.end.y;
				}

				self.mouse.end.x = e.pageX;
				self.mouse.end.y = e.pageY;
			}

			function handleMouseUp(e) {
				self.mouse.down = false;
				if( !self.mouse.started ) return;
				self.mouse.started = false;
				self.mouse.end.x = 0;
				self.mouse.end.y = 0;
				self.mouse.placement = false;

				window.removeEventListener('mouseup', handleMouseUp, true);
				document.removeEventListener('mousemove', handleMouseMove, true);
			}

			window.addEventListener('mouseup', handleMouseUp, true);
			document.addEventListener('mousemove', handleMouseMove, true);
		},
		newPlacement(){
			this.createPlacement(this.location.id);
		}
	},
	watch: {
		'placement.rotation'(){
			if( !this.placement ) return;
			this.placement.cloudinary = {rotation: entity.product.placement.editor.rotation.calcRotationDifference( this.placement )}
		},
		placement(){
			if( this.placement )
				entity.product.placement.editor.image.addRatioToPosition(this.placement , this.$refs.image, this.image);
		}
	},
	created() {
		this.logo = this.preview_logos[0].id;
	}
}
</script>
<template>
	<div class="d-flex  flex-wrap placement-row pb-4 mb-4 border-bottom">
		<div>
			<div class="placement-image-container">
				<img class="product-image" :src="image" alt="" ref="image">
				<div v-if="placement" @mousedown.capture="setupDragging(location.id)" class="logo-box" :style="logoLocation"></div>
			</div>
		</div>
		<div class="flex-fill placement-controls">
			<h2 class="pb-3">{{ location.name }}</h2>
	
			<template v-if="placement">
				<div class="row mb-3 mt-2">
					<div class="col-3">
						<label  class="form-label">Width</label>
						<input type="number" class="form-control" name="width" min="20" max="500" value="50" v-model="placement.width">
					</div>
					<div class="col-3">
						<label class="form-label">Height</label>
						<input type="number" class="form-control" name="height" min="20" max="500" value="50" v-model="placement.height">
					</div>
					<div class="col-6">
						<label class="form-label">Rotation ({{ placement.rotation }})</label>
						<input type="range" class="form-range" name="rotation" min="-180" max="180" value="0" v-model.number="placement.rotation">
					</div>
				</div>
	
				<div class="test-logo mb-4">
					<label class="mt-2">Preview w/ Logo</label>
					<div class="row">
						<div class="col-8">
							<select class="form-select" v-model="logo">
								<option v-for="logo in preview_logos" :value="logo.id">{{ logo.name }}</option>
							</select>
						</div>
						<div class="col-4">
							<button class="btn btn-primary form-control" @click="generateTestImage">Preview</button>
						</div>
					</div>
				</div>
	
				<button class="btn btn-outline-danger btn-clear-placement" @click="deletePlacement(location.id)">Clear</button>
			</template>
	
			<template v-else>
				<button class="btn btn-outline-primary" @click="newPlacement">Setup Location</button>
			</template>
	
			<input class="form-control mt-4 display-none" type="text" value="" id="json" name="json" disabled>
		</div>
	</div>
</template>