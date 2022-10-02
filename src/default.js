import CKEditor from "@ckeditor/ckeditor5-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/default.scss";
import GControl from "./components/GControl.vue";
import GEdit from "./components/GEdit.vue";
const pinia = createPinia();
const app = createApp(App);
app.component("GEdit", GEdit);
app.component("GControl", GControl);
app.use(pinia).use(CKEditor);
app.directive("reload", (el, binding) => {
	if (binding.oldValue !== binding.value) {
		el.load();
	}
});
app.mount("#app");
