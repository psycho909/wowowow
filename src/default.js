import CKEditor from "@ckeditor/ckeditor5-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/default.scss";
import Control from "./components/Control.vue";
import Edit from "./components/Edit.vue";
const pinia = createPinia();
const app = createApp(App);
app.component("Edit", Edit);
app.component("Control", Control);
app.use(pinia).use(CKEditor);
app.directive("reload", (el, binding) => {
	if (binding.oldValue !== binding.value) {
		el.load();
	}
});
app.mount("#app");
