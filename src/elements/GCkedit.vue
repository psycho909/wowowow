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
// editorConfig = {
//     plugins: [
//         EssentialsPlugin,
//         BoldPlugin,
//         ItalicPlugin,
//         LinkPlugin,
//         ParagraphPlugin
//     ],

//     toolbar: {
//         items: [
//             'bold',
//             'italic',
//             'link',
//             'undo',
//             'redo'
//         ]
//     }
// }
watchEffect(() => {
    if (props.modelValue) {
        emit('update:modelValue', props.modelValue);
    }
})
</script>
            
<template>
    <div class="g-ckedit">
        <ckeditor :editor="editor" v-model="modelValue"></ckeditor>
    </div>
</template>
            