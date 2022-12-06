import { defineStore } from "pinia";
export const templateStore = defineStore("template", {
	state: () => {
		return {
			template: {
				1: {
					name: "模板類型1",
					description: "模板類型1的模板描述內容",
					content: [
						{
							component: "GBg",
							uid: 1,
							content: {
								color: "#fff",
								pc: "",
								mobile: "",
								w: 1920,
								h: 958,
								mw: "",
								mh: "",
								validPC: true,
								validMobile: true
							},
							update: false,
							init: false
						},
						{
							component: "GSlogan",
							uid: 2,
							content: {
								link: "",
								mt: "250",
								mb: "24",
								pc: "https://alpha-tw.beanfun.com/3KO/removable/pchome/images/slogan.png",
								mobile: "",
								validPC: true,
								validMobile: true,
								validUrl: true
							},
							update: false,
							init: false
						}
					]
				}
			}
		};
	}
});
