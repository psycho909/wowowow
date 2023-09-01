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
							init: true
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
							init: true
						}
					]
				},
				2: {
					name: "模板類型2",
					description: "模板類型2的模板描述內容",
					content: [
						{
							component: "GArea",
							uid: "1",
							content: {
								subContent: [
									{ component: "GBg", uid: "2", content: { color: "#fff", pc: "", mobile: "", w: 1920, h: 958, mw: "", mh: "", validPC: true, validMobile: true }, update: false, init: true },
									{ component: "GIcon", uid: "c8c5e0f7-8030-4b05-80f4-845f3f740869", content: { icons: [{ pc: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/DragonNest/E20230718/assets/css/images/event3/btn-home.png", mobile: "", link: "", validPC: true, validMobile: true, validLink: true, w: 68, h: 68 }] }, update: false, init: true },
									{ component: "GLogo", uid: "ec483aab-ad03-44e3-9f7e-c6299166c8c2", content: { link: "", pc: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/DragonNest/E20230718/assets/css/images/event3/logo.png", mobile: "", validPC: true, validMobile: true, validLink: true, w: 278, h: 118 }, update: false, init: true },
									{
										component: "GDNNav",
										uid: "58ece568-b6d3-489a-a47e-32a5a0a5238b",
										content: {
											navs: [
												{ pc: "https://tw.hicdn.beanfun.com/beanfun/promo/DragonNest/E20230821/css/img/btn-pc1.png", mobile: "", w: 723, h: 133, mw: "", mh: "", link: "", validPC: true, validMobile: true, validLink: true },
												{ pc: "https://tw.hicdn.beanfun.com/beanfun/promo/DragonNest/E20230821/css/img/btn-pc2.png", mobile: "", w: 723, h: 133, mw: "", mh: "", link: "", validPC: true, validMobile: true, validLink: true }
											]
										},
										update: false,
										init: true
									}
								]
							},
							update: false,
							init: false,
							name: "home"
						}
					]
				}
			}
		};
	}
});
