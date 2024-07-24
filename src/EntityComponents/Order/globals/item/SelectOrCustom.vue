<script setup>

</script>

<script>
export default {
	data() {
		return {
			selectValue: '',
			inputValue: ''
		}
	},

	props: ['array', 'modelValue', 'type'],

	computed: {
		customType(){
			if( !this.type ) return 'text';

			return this.type;
		},
		isCustomValue(){
			return ( !this.array.includes(this.modelValue) && this.modelValue !== '' )
		},
		isCustom(){
			return this.selectValue === 'custom' || this.isCustomValue;
		}
	},

	methods: {
		change()
		{
			let value = ( this.isCustom ? this.inputValue : this.selectValue );
			this.$emit('update:modelValue', value)
		}
	},

	mounted(){
		if( this.isCustomValue ) this.inputValue = this.modelValue;
		else this.selectValue = this.modelValue
	}
}
</script>

<template>
	<template v-if="!isCustom">

		<select class="form-select" @change="change" ref="select" v-model="selectValue">
			<option value="">--</option>
			<option v-for="option in array" :value="option">{{ option }}</option>
			<option value="custom">[Custom]</option>
		</select>

	</template>
	<template v-else>

		<template v-if="customType === 'text'">
			<input @input="change" type="text" class="form-control" v-model="inputValue" />
		</template>
		<template v-else-if="customType === 'textarea'">
			<textarea @input="change" class="form-control" v-model="inputValue" />
		</template>

	</template>
</template>