import { createPinia } from "pinia";
import { createApp } from "vue";
import { CkeditorPlugin } from "@ckeditor/ckeditor5-vue";
import App from "./App.vue";
import "./assets/css/default.scss";
import GEdit from "./components/GEdit.vue";
import GModify from "./components/GModify.vue";
/*
 * 網柑達 1.1.1
 */

const pinia = createPinia();
const app = createApp(App);
app.component("GEdit", GEdit);
app.component("GModify", GModify);
app.use(CkeditorPlugin).use(pinia);
app.directive("reload", (el, binding) => {
	if (binding.oldValue !== binding.value) {
		el.load();
	}
});
app.mount("#app");
