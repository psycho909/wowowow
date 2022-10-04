import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			page: "Page",
			type: "",
			config: [],
			content: {
				body: [
					{ component: "GBg", uid: 1, content: { pc: "", mb: "", color: "#eed" }, update: false },
					{ component: "GSlogan", uid: 2, content: { pc: "./src/assets/css/img/slogan.png", mb: "", w: 1000, h: 187 }, update: false },
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
			this.content.body.push({ component: data.cpt, uid, content: {}, update: true });
		},
		removeCpt(data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == data);
			if (_index > -1) {
				this.content.body = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			}
		},
		updateCpt(uid, data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == uid);
			if (_index > -1) {
				this.content.body[_index].content = data;
				this.content.body[_index].update = false;
			}
		},
		editCpt(data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == data);
			if (_index > -1) {
				this.content.body[_index].update = true;
			}
		},
		upCpt(data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == data);
			if (_index - 1 < 0 || this.content.body[_index - 1].component == "GBg" || this.content.body[_index - 1].component == "GSlogan") {
				return;
			}
			var _temp = this.content.body[_index];
			var _content = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			this.content.body = _content;
			this.content.body.splice(_index - 1, 0, _temp);
		},
		downCpt(data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == data);
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
		}
	}
});
