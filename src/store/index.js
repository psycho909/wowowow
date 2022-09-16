import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			content: { body: [{ component: "Foo", uid: 33, content: { text: "sad" }, update: true }] }
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
			this.content.body.push({ component: data.cpt, uid, content: {} });
		},
		removeCpt(data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == data);
			if (_index > -1) {
				this.content.body = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			}
		},
		updateCpt(data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == data.uid);
			this.content.body[_index].content = data.content;
			this.content.body[_index].update = true;
		},
		upCpt(data) {
			var _index = this.content.body.findIndex((v, i) => v.uid == data);
			if (_index - 1 < 0) {
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
		setText(state, data) {}
	}
});
