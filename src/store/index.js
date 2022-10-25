import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			page: "EditPage",
			MODE: "",
			type: "",
			config: [],
			content: {}
		};
	},
	getters: {
		getIndex: (state) => (id) => {
			return state.content.body.findIndex((v, i) => v.uid == id);
		}
	},
	actions: {
		addCpt(data) {
			var uid = uuidv4();
			if (data.cpt == "GFixed") {
				this.content.body = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content.body];
				return;
			}
			if (data.cpt == "GSlogan") {
				let bgIndex = this.content.body.findIndex((v, i) => {
					return v.component == "GBg";
				});
				this.content.body = [...this.content.body.slice(0, bgIndex + 1), { component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content.body.slice(bgIndex + 1)];
				return;
			}
			this.content.body.push({ component: data.cpt, uid, content: {}, update: true, init: true });
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
				this.content.body[_index].init = false;
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
		setEnv(data) {
			this.MODE = data;
		},
		async setCreateEvent(data) {
			this.config = data;
			return data;
		},
		async setSave(data) {
			this.content = data;
			return data;
		},
		async setData(data) {
			this.content = data;
			return data;
		}
	}
});
