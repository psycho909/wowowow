import { createPinia } from "pinia";
import { createApp } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import App from "./App.vue";
import "./assets/css/default.scss";
import GEdit from "./components/GEdit.vue";
import GModify from "./components/GModify.vue";

const app = createApp(App);
app.component("GEdit", GEdit);
app.component("GModify", GModify);
app.use(createPinia());
app.use(CKEditor);
app.mount("#app");
