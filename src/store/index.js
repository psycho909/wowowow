import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			page: "EditPage",
			MODE: "",
			type: "",
			config: [],
			content: {
				body: [
					{
						component: "GFixed",
						uid: 3,
						content: {
							position: "left",
							hamburger: "hamburger-right",
							style: "blue",
							menus: [
								{ link: "", target: false, text: "標題一" },
								{ link: "", target: false, text: "標題二" },
								{ link: "", target: false, text: "標題三" }
							]
						},
						update: false
					},
					{ component: "GBg", uid: 1, content: { pc: "", mb: "", color: "#eed" }, update: false },
					{ component: "GSlogan", uid: 2, content: { pc: "./src/assets/css/img/slogan.png", mb: "", w: 1000, h: 187, mt: 250, mb: 24 }, update: false },
					{
						component: "GImg",
						uid: 4,
						content: {
							num: "2",
							imgs: [
								{ pc: "https://fakeimg.pl/440x320", mb: "https://fakeimg.pl/220x120", type: "pop", pop: { show: false, type: "text", title: "title1", style: "blue", text: "<p>abc1</p>" }, target: {} },
								{ pc: "https://fakeimg.pl/440x320", mb: "https://fakeimg.pl/220x120", type: "pop", pop: { show: false, type: "img", title: "titl2", style: "red", img: "https://fakeimg.pl/440x320" }, target: {} }
							]
						}
					},
					{
						component: "GVideo",
						uid: 45,
						content: {
							num: "3",
							type: "pop",
							videos: [
								{ url: "M7lc1UVf-VE", show: false },
								{ url: "M7lc1UVf-VE", show: false },
								{ url: "M7lc1UVf-VE", show: false }
							]
						},
						update: false
					},
					{
						component: "GSlide",
						uid: 46,
						content: {
							num: "4",
							slides: [
								{ pc: "https://fakeimg.pl/440x320?text=1", mb: "https://fakeimg.pl/440x320?text=1", open: false, url: "", attribute: false },
								{ pc: "https://fakeimg.pl/440x320?text=2", mb: "https://fakeimg.pl/440x320?text=2", open: false, url: "", attribute: false },
								{ pc: "https://fakeimg.pl/440x320?text=3", mb: "https://fakeimg.pl/440x320?text=3", open: false, url: "", attribute: false },
								{ pc: "https://fakeimg.pl/440x320?text=4", mb: "https://fakeimg.pl/440x320?text=4", open: false, url: "", attribute: false },
								{ pc: "https://fakeimg.pl/440x320?text=5", mb: "https://fakeimg.pl/440x320?text=5", open: false, url: "", attribute: false },
								{ pc: "https://fakeimg.pl/440x320?text=6", mb: "https://fakeimg.pl/440x320?text=6", open: false, url: "", attribute: false },
								{ pc: "https://fakeimg.pl/440x320?text=7", mb: "https://fakeimg.pl/440x320?text=7", open: false, url: "", attribute: false },
								{ pc: "https://fakeimg.pl/440x320?text=8", mb: "https://fakeimg.pl/440x320?text=8", open: false, url: "", attribute: false }
							]
						},
						update: false
					}
				]
			}
		};
	},
	getters: {
		getIndex: (state) => (id) => {
			return state.content.body.findIndex((v, i) => v.uid == id);
		}
	},
	actions: {
		addCpt(data) {
			var uid = Math.floor(Math.random() * 100);
			if (data.cpt == "GFixed") {
				this.content.body = [{ component: data.cpt, uid, content: {}, update: true }, ...this.content.body];
				return;
			}
			if (data.cpt == "GSlogan") {
				let bgIndex = this.content.body.findIndex((v, i) => {
					return v.component == "GBg";
				});
				this.content.body = [...this.content.body.slice(0, bgIndex + 1), { component: data.cpt, uid, content: {}, update: true }, ...this.content.body.slice(bgIndex + 1)];
				return;
			}
			this.content.body.push({ component: data.cpt, uid, content: {}, update: true });
		},
		removeCpt(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content.body = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			}
		},
		updateCpt(uid, data) {
			var _index = this.getIndex(uid);
			if (_index > -1) {
				this.content.body[_index].content = data;
				this.content.body[_index].update = false;
			}
		},
		editCptOpen(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content.body[_index].update = true;
			}
		},
		editCptClose(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content.body[_index].update = false;
			}
		},
		upCpt(data) {
			var _index = this.getIndex(data);
			if (_index - 1 < 0 || this.content.body[_index - 1].component == "GBg" || this.content.body[_index - 1].component == "GSlogan") {
				return;
			}
			var _temp = this.content.body[_index];
			var _content = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			this.content.body = _content;
			this.content.body.splice(_index - 1, 0, _temp);
		},
		downCpt(data) {
			var _index = this.getIndex(data);
			if (_index + 1 >= this.content.body.length) {
				return;
			}
			var _temp = this.content.body[_index];
			var _content = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			this.content.body = _content;
			this.content.body.splice(_index + 1, 0, _temp);
		},
		setPage(data) {
			this.page = data;
		},
		setType(data) {
			this.type = data;
		},
		setConfig(data) {
			this.config = data;
		},
		async setSubmit(data) {
			let done = await data;
			return done;
		},
		async setSave(data) {
			let done = await data;
			return done;
		}
	}
});
