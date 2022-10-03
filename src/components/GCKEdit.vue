<script>
export default {
    name: "CKEdit",
    label: "文字區塊"
}
</script>
<script setup>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);
const props = defineProps(["data"])
let showEdit = ref(false);
let editor = ref(ClassicEditor)
let editorData = ref("")
let editorConfig = ref({
    toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote"],
    heading: {
        options: [
            { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
            { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
            { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
            { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
            { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
            { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
            { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" }
        ]
    }
})
const getEditorData = () => {
    console.log(editorData.value)
}
onMounted(async () => {
    var _uid = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
    if (!content.value.body[_uid].update) {
        showEdit.value = true;
    }
    await nextTick()

})
onUpdated(() => {

})
onUnmounted(() => {

})
</script>
    
<template>
    <div>
        <div>{{editorData}}</div>
        <g-modify :uid="props.data.uid" />

        <button type="button" class="btn" @click="getEditorData">getter CKEdit</button>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">文字區塊</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <div class="edit-align__box">
                    <div class="edit-align__text">對其方向:</div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">置左</span>
                        <span class="edit-radio__style"></span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">置中</span>
                        <span class="edit-radio__style"></span>
                    </div>
                    <div class="edit-radio__label">
                        <input type="text" class="edit-radio__input">
                        <span class="edit-radio__text">置右</span>
                        <span class="edit-radio__style"></span>
                    </div>
                </div>
                <div class="edit-theme__box">
                    <div class="edit-theme__text">主題顏色:</div>
                    <div class="edit-theme__select">
                        <select name="" id="">
                            <option value="-1">請選擇主題</option>
                        </select>
                    </div>
                </div>
                <div class="edit-text__box">
                    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="edit-btn__submit" @click="submit">確認送出</a>
                    <a href="javascript:;" class="edit-btn__reset" @click="reset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>
    