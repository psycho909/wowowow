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
								pc: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/GamaEvent/assets/css/images/slogan.png",
								mobile: "",
								validPC: true,
								validMobile: true,
								validUrl: true,
								target: true
							},
							update: false,
							init: true,
							first: true
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
							group: "1",
							content: {
								pc: {
									paddingTop: 80,
									paddingBottom: 80
								},
								mobile: {
									paddingTop: 100,
									paddingBottom: 100
								},
								subContent: [
									{
										component: "GBg",
										uid: "2",
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
										component: "GIcon",
										uid: "3",
										content: {
											icons: [
												{
													pc: "",
													mobile: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true,
													target: true,
													w: 0,
													h: 0
												},
												{
													pc: "",
													mobile: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true,
													target: true,
													w: 0,
													h: 0
												}
											]
										},
										update: false,
										init: true
									},
									{
										component: "GLogo",
										uid: "4",
										content: {
											link: "",
											pc: "",
											mobile: "",
											validPC: true,
											validMobile: true,
											validLink: true,
											w: 0,
											h: 0,
											target: true
										},
										update: false,
										init: true
									},
									{
										component: "GDNNav",
										uid: "5",
										content: {
											pcMarginTop: 104,
											mobileMarginTop: 80,
											pcItemMarginBottom: 0,
											mobileItemMarginBottom: 0,
											navs: [
												{
													pc: "",
													effectCheck: false,
													effectImg: "",
													effectImgW: "",
													effectImgH: "",
													validEffectImg: true,
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true,
													target: true
												},
												{
													pc: "",
													effectCheck: false,
													effectImg: "",
													effectImgW: "",
													effectImgH: "",
													validEffectImg: true,
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true,
													target: true
												},
												{
													pc: "",
													effectCheck: false,
													effectImg: "",
													effectImgW: "",
													effectImgH: "",
													validEffectImg: true,
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true,
													target: true
												},
												{
													pc: "",
													effectCheck: false,
													effectImg: "",
													effectImgW: "",
													effectImgH: "",
													validEffectImg: true,
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true,
													target: true
												}
											]
										},
										update: false,
										init: true
									},
									{
										component: "GDNImg",
										uid: "6",
										content: {
											pcMarginTop: 60,
											pcMarginBottom: 0,
											mobileMarginTop: 750,
											mobileMarginBottom: 0,
											imgs: [
												{ pc: "", effectCheck: false, effectImg: "", effectImgW: "", effectImgH: "", validEffectImg: true, mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true, target: true },
												{ pc: "", effectCheck: false, effectImg: "", effectImgW: "", effectImgH: "", validEffectImg: true, mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true, target: true },
												{ pc: "", effectCheck: false, effectImg: "", effectImgW: "", effectImgH: "", validEffectImg: true, mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true, target: true },
												{ pc: "", effectCheck: false, effectImg: "", effectImgW: "", effectImgH: "", validEffectImg: true, mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true, target: true }
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
				},
				3: {
					name: "模板類型3",
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
								pc: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/GamaEvent/assets/css/images/slogan.png",
								mobile: "",
								validPC: true,
								validMobile: true,
								validUrl: true,
								target: true
							},
							update: false,
							init: true,
							first: true
						}
					]
				},
			}
		};
	}
});
