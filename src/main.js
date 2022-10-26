import { createPinia } from "pinia";
import { createApp } from "vue";
import Main from "./Main.vue";
import "./assets/css/default.scss";

const pinia = createPinia();
const app = createApp(Main);
app.use(pinia);
app.mount("#app");
