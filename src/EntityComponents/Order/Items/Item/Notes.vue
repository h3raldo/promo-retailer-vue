<script setup>
</script>

<script>
export default {
	data() {
		return {}
	},

	inject: ['item', 'itemIndex'],

	computed: {
	},

	methods: {
		noteToggle(e){
			let value = e.target.value;
			let checked = e.target.checked;

			if( !checked ){
				const index = this.item.notes.flags.indexOf(value);
				if (index > -1) this.item.notes.flags.splice(index, 1);
				return;
			}

			this.item.notes.flags.push(value);
		},
		getNoteFlags(){
			return [
				{
					name: 'Require Proof',
					value: 'RP',
					selected: false,
				},
				{
					name: 'Needs Package',
					value: 'NP',
					selected: false,
				}
			];
		}
	}
}
</script>

<template>

	<div>
		<div class="d-flex flex-column gap-2">
			<div class="form-floating">
				<textarea class="form-control" placeholder="Notes (Public)" v-model="item.notes.public" style="height: 100px;"></textarea>
				<label>Notes (Public)</label>
			</div>

			<div class="form-floating">
				<textarea class="form-control" placeholder="Decorator Notes" v-model="item.notes.decorator" style="height: 100px;"></textarea>
				<label>Decorator Notes</label>
			</div>

			<div class="form-floating">
				<textarea class="form-control" placeholder="Notes (Private)" v-model="item.notes.private" style="height: 100px;"></textarea>
				<label>Notes (Private)</label>
			</div>
		</div>

		<div class="mt-2">
			<div class="form-check" v-for="noteFlags in getNoteFlags()">
				<input @change="noteToggle" class="form-check-input" type="checkbox" :value="noteFlags.value" :id="'item-note-flag-'+ itemIndex + noteFlags.value" :checked="item.notes.flags.includes(noteFlags.value)">
				<label class="form-check-label" :for="'item-note-flag-'+ itemIndex + noteFlags.value">
					{{ noteFlags.name }}
				</label>
			</div>
		</div>
	</div>

</template>