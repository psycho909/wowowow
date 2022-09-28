import Fixed from "./components/Fixed.vue";
import Slide from "./components/Slide.vue";
// const context = require.context("./components", true, /.vue$/);
const modules = import.meta.glob("./components/*.vue");

// console.log(modules, Fixed);

export default {
	Fixed,
	Slide
};
