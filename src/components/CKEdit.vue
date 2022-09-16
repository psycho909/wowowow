<script setup>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

let editor = ref(ClassicEditor)
let editorData = ref("<p>Content of the editor.</p>")
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
onUnmounted(() => {
    console.log("Child onUnmounted")
})
</script>
    
<template>
    <h2>Chid</h2>
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
    <button type="button" class="btn" @click="getEditorData">getter CKEdit</button>
</template>
    