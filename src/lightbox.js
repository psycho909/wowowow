import { GetServerList, GetUserData, InsertUserData } from "./api";
import { loadingHide, loadingShow } from "./loading";
import { mainStore } from "./store/index";
let ajax = false;
export function MessageLB(msg, url, callback) {
	$.gbox.open(`<div class="lb-message__text">${msg}</div>`, {
		addClass: "default lb-message",
		hasCloseBtn: true,
		hasActionBtn: true,
		afterClose() {
			if (url) window.location.href = url;
			else {
				$.gbox.close();
				if (callback) {
					callback();
				}
			}
		},
		actionBtns: [
			{
				text: "關閉",
				class: "lb-btn__close",
				click: function () {
					$.gbox.close();
				}
			}
		]
	});
}
