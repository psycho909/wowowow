<script>
export default {
    name: "CKEdit",
    label: "文字區塊",
}
</script>
<script setup>
const props = defineProps(["modelValue"])
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
const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});
watchEffect(() => {
    if (props.modelValue) {
        emit('update:modelValue', value.value);
    }
})
</script>
            
<template>
    <div class="g-ckedit">
        <ckeditor :editor="editor" :config="editorConfig" v-model="value"></ckeditor>
    </div>
</template>
            