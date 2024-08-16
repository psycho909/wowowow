<script>
export default {
    name: "CKEdit",
    label: "文字區塊",
}
</script>
<script setup>
import {
    ClassicEditor,
    AccessibilityHelp,
    AutoImage,
    Autosave,
    Bold,
    CloudServices,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageToolbar,
    ImageUpload,
    Italic,
    Link,
    List,
    ListProperties,
    Paragraph,
    PictureEditing,
    SelectAll,
    Table,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Undo
} from 'ckeditor5';
import translations from 'ckeditor5/translations/zh.js';
import 'ckeditor5/ckeditor5.css';
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
let config = ref({})
editor.value = ClassicEditor;
config.value = {
    toolbar: {
        items: [
            'bold',
            'italic',
            'link',
            'fontSize',
        ],
        shouldNotGroupWhenFull: false
    },
    plugins: [
        AccessibilityHelp,
        AutoImage,
        Autosave,
        Bold,
        CloudServices,
        Essentials,
        FontSize,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageToolbar,
        ImageUpload,
        Italic,
        Link,
        List,
        ListProperties,
        Paragraph,
        PictureEditing,
        SelectAll,
        Table,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        Undo
    ],
    fontFamily: {
        supportAllValues: true
    },
    fontSize: {
        options: ["small", 'default', "big"],
    },

    image: {
        toolbar: ['imageTextAlternative']
    },
    language: 'zh',
    translations: [translations]
};
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
const onEditorInput = (editor) => {
    console.log("onEditorInput")
}
</script>

<template>
    <div class="g-ckedit" :class="[valid ? '' : 'warning']">
        <ckeditor :editor="editor" :config="config" v-model="textValue" @input="onEditorInput"></ckeditor>
        <template v-if="!valid">
            <div class="input-group__warning" :data-warning="`${warning}`"></div>
        </template>
    </div>
</template>