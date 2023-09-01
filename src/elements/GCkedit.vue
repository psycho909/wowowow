<script>
export default {
    name: "CKEdit",
    label: "文字區塊",
}
</script>
<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ""
    },
    valid: {
        type: Boolean,
        default: true
    },
    warning: {
        type: String,
        default: ""
    }
})
const emit = defineEmits(["update:modelValue"])
let editor = ref(null)
let editorConfig = ref({})
editor.value = ClassicEditor
editorConfig = {
    toolbar: {
        items: [
            'bold',
            'italic',
            'link',
        ]
    }
}
const textValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
watchEffect(() => {
    if (props.modelValue) {
        emit('update:modelValue', textValue.value);
    }
})
</script>
            
<template>
    <div class="g-ckedit" :class="[valid ? '' : 'warning']">
        <ckeditor :editor="editor" :config="editorConfig" v-model="textValue"></ckeditor>
        <template v-if="!valid">
            <div class="input-group__warning" :data-warning="`${warning}`"></div>
        </template>
    </div>
</template>
            