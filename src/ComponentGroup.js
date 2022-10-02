import GFixed from "./components/GFixed.vue";
import GSlide from "./components/GSlide.vue";
// const context = require.context("./components", true, /.vue$/);
const modules = import.meta.glob("./components/*.vue");

// console.log(modules, Fixed);

export default {
	GFixed,
	GSlide
};
