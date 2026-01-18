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
    ImageResize,
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
    Undo,
} from 'ckeditor5';
import translations from 'ckeditor5/translations/zh.js';
import 'ckeditor5/ckeditor5.css';
import { mainStore } from "../store/index";
import axios from 'axios';
const store = mainStore();
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
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
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
        Undo,
    ],
    image: {
        upload: {
            types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
        }
    },
    fontFamily: {
        supportAllValues: true
    },
    image: {
        resizeUnit: 'px',
        toolbar: ['imageTextAlternative']
    },
    language: 'zh',
    translations: [translations]
};

// Custom upload adapter
class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then(file => new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);
                document.querySelector("#loadingProgress").style.display = "block";
                axios.post(`api/ImageUpload/UploadImgCkeditor?OTP=${store.OTP ? store.OTP : 1}&CKEditorFuncNum=CommonPlatform-NoticeList`, formData)
                    .then(response => {
                        document.querySelector("#loadingProgress").style.display = "none";
                        resolve({
                            default: response.data.url
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        document.querySelector("#loadingProgress").style.display = "none";
                        reject(err);
                    });
            }));
    }

    abort() {
        // Abort the upload process
    }
}

// Plugin function to integrate the custom upload adapter
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

// Add the custom upload adapter plugin to the configuration
config.value.extraPlugins = [MyCustomUploadAdapterPlugin];

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