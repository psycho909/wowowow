<script setup>
// const props = defineProps(["label", "options", "group", "modelValue", "valid"])
const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    options: {
        type: Array,
        default: ""
    },
    modelValue: {
        type: [String, Number],
        default: ""
    },
    group: {
        type: Boolean,
        default: false
    },
    valid: {
        type: Boolean,
        default: true
    },
    required: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(["update:modelValue"])
const selectValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
const updateValue = (event) => {
    emit("update:modelValue", event.target.value)
}
</script>
<template>
    <div class="select-group" :class="[valid ? '' : 'warning']">
        <div class="select-group__label" :class="[required ? 'required' : '']">{{ label }}</div>
        <div class="select-group__box" v-if="group">
            <select class="select-group__control" @change="updateValue" v-model="selectValue">
                <optgroup label="白色底配色">
                    <option :value="option.value" v-for="option in options[0]">{{ option.text }}</option>
                </optgroup>
                <optgroup label="異色底配色">
                    <option :value="option.value" v-for="option in options[1]">{{ option.text }}</option>
                </optgroup>
            </select>
            <div class="select-group__warning" v-if="!valid" :data-warning="`請填寫正確${label}`"></div>
        </div>
        <div class="select-group__box" v-else>
            <select class="select-group__control" @change="updateValue" v-model="selectValue">
                <template v-for="option in options">
                    <slot name="options" :option="option">
                        <option :value="option.value">{{ option.text }}</option>
                    </slot>

                </template>
            </select>
            <div class="select-group__warning" v-if="!valid" :data-warning="`請填寫正確${label}`"></div>
        </div>
    </div>
</template>