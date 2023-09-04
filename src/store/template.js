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
											h: 0
										},
										update: false,
										init: true
									},
									{
										component: "GDNNav",
										uid: "5",
										content: {
											navs: [
												{
													pc: "",
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true
												},
												{
													pc: "",
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true
												},
												{
													pc: "",
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true
												},
												{
													pc: "",
													mobile: "",
													w: 0,
													h: 0,
													mw: "",
													mh: "",
													link: "",
													validPC: true,
													validMobile: true,
													validLink: true
												}
											]
										},
										update: false,
										init: true
									},
									{
										component: "GDNImg",
										uid: "dffac781-ab90-49cf-9e3a-cc9efa3ec7f0",
										content: {
											imgs: [
												{ pc: "", mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true },
												{ pc: "", mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true },
												{ pc: "", mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true },
												{ pc: "", mobile: "", w: 0, h: 0, mw: 0, mh: 0, link: "", validPC: true, validMobile: true, validLink: true }
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
