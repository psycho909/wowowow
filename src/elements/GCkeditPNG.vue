<!-- 有圖片壓縮功能 -->
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
            'fontSize'
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
    fontSize: {
        options: ["small", 'default', "big"],
    },
    image: {
        resizeUnit: 'px',
        toolbar: ['imageTextAlternative']
    },
    language: 'zh',
    translations: [translations]
};


let initialJPGQuality = 0.8; // JPG 壓縮率
let initialPNGQuality = 0.8; // PNG 壓縮率

// PNG 壓縮
async function compressPNGImage(file, ops = {}) {
    const { quality = initialPNGQuality, noCompressIfLarger = true } = ops;
    let { width, height } = ops;
    const arrayBuffer = await file.arrayBuffer();
    const decoded = UPNG.decode(arrayBuffer);
    const rgba8 = UPNG.toRGBA8(decoded);
    if (width && !height) {
        height = Math.round(decoded.height * (width / decoded.width));
    } else if (!width && height) {
        width = Math.round(decoded.width * (height / decoded.height));
    }
    width = width || decoded.width;
    height = height || decoded.height;

    const compressed = UPNG.encode(rgba8, width, height, 256 * quality);

    const newFile = new File([compressed], file.name || `${Date.now()}.png`, { type: "image/png" });
    return file.size > newFile.size ? newFile : file;
}
// 處理上傳圖片
async function handleImageUploadFile(file) {
    let output;
    let fileSize = 0;
    let finishSize = 0;
    if (file.size / 1024 > 1024) {
        fileSize = (file.size / 1024 / 1024).toFixed(2) + "mb";
    } else {
        fileSize = (file.size / 1024).toFixed(2) + "kb";
    }
    const options = {
        useWebWorker: true,
        initialQuality: initialJPGQuality
    };

    try {
        if (file.type === "image/png") {
            output = await compressPNGImage(file, options);
        } else {
            const compressedBlob = await imageCompression(file, options);
            output = new File([compressedBlob], file.name, { type: compressedBlob.type });
        }

        let compressedSize = 0;
        if (output.size / 1024 > 1024) {
            compressedSize = (output.size / 1024 / 1024).toFixed(2) + "mb";
        } else {
            compressedSize = (output.size / 1024).toFixed(2) + "kb";
        }
        return output; // 直接返回壓縮後的 File 物件
    } catch (error) {
        alert(error.message);
    }
}
// Custom upload adapter
class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    async upload() {
        return this.loader.file
            .then(file => new Promise(async (resolve, reject) => {
                document.querySelector("#loadingProgress").style.display = "block";
                let compressedFile = await handleImageUploadFile(file);
                const formData = new FormData();
                formData.append('file', compressedFile);
                axios.post(`api/ImageUpload/UploadImgCkeditor?OTP=${store.OTP ? store.OTP : 1}&CKEditorFuncNum=CommonPlatform-NoticeList`, formData)
                    .then(response => {
                        resolve({
                            default: response.data.url
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        reject(err);
                    }).finally(() => {
                        document.querySelector("#loadingProgress").style.display = "none";
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