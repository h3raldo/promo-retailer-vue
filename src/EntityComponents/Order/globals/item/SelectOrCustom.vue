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
		isString(){
			return typeof this.array[0] === 'string';
		},
		customType(){
			if( !this.type ) return 'text';

			return this.type;
		},
		isCustomValue(){
			if( this.isString )
				return ( !this.array.includes(this.modelValue) && this.modelValue !== '' )
			else
				return this.array.find( item => item.value === this.modelValue ) === undefined;
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
			<template v-for="option in array">
				<option v-if="isString" :value="option">{{ option }}</option>
				<option v-else :value="option.value">{{ option.title || '[No Title]' }}</option>
			</template>
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