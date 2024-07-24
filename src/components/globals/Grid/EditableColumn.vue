<script>
import utils from "@/js/utils.js";
export default {
	data() {
		return {
			editing: false,
			loading: false,
			clickEvent: ''
		}
	},
	props: ['type', 'options', 'onChange', 'item', 'column', 'entity'],
	inject: ['symfony', 'alert'],
	methods: {
		async update(){
			let self = this;
			let api = this.symfony.api.entity.save.replace(':type', this.entity);

			let data = {
				id: self.item.id,
				column: self.column,
				value: self.item[self.column],
			}

			let response;
			this.loading = true;

			try {
				response = await utils.ajaxAsync(api, data);
				this.loading = false;
			} catch (e) {
				this.loading = false;
				this.alert('Unable to save item', 'danger', e.message);
				return;
			}

			if( !response || response.error === true ){
				this.alert('Could not save item', 'danger');
				return;
			}

			this.alert(`Item Saved! ID: ${this.item.id}`);
			this.doneEditing();

			if( self.onChange )
				self.onChange(self.item, self.column, self.item[self.column]);
		},
		edit()
		{
			this.editing = true;
			setTimeout(() => {
				document.addEventListener('click', this.bodyClick);
			}, 100);
		},
		doneEditing()
		{
			this.editing = false;
			document.removeEventListener('click', this.bodyClick);
		},
		bodyClick(e){
			let el = this.$refs.editableInput;
			if( el === null ) {
				this.doneEditing();
				return;
			}

			if( el === e.target || el.contains(e.target) )
				return;

			this.doneEditing();
		}
	},
	beforeDestroy() {
		document.removeEventListener('click', this.bodyClick);
	},
}
</script>
<template>

	<div ref="editableInput" v-if="editing">

		<template v-if="type === 'select'">

			<select class="form-select form-select-sm" v-model="item[column]" @change="update" :disabled="loading">
				<option v-for="option in options" :value="option.value">
					{{ option.title }}
				</option>
			</select>

		</template>

		<template v-else-if="type === 'date'">

			<input type="date" class="form-control form-control-sm" v-model="item[column]" @change="update" :disabled="loading">

		</template>

	</div>

	<div v-else @click="edit" ref="noEditContent">

		<slot></slot>

	</div>

</template>