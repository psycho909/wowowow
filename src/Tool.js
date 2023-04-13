export const CheckImage = async (url) => {
	return new Promise((resolve, reject) => {
		var elem = new Image();
		elem.onload = () => resolve(true);
		elem.onerror = () => resolve(false);
		elem.src = url;
	});
};
export const CheckUrl = (url) => {
	var regExp = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
	var match;
	if (Object.prototype.toString.call(url).includes("String")) {
		match = url.match(regExp);
		if (match) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export const youtubePreview = (youtube) => {
	return {
		default: `https://img.youtube.com/vi/${youtube}/default.jpg`,
		hq: `https://img.youtube.com/vi/${youtube}/hqdefault.jpg`,
		sd: `https://img.youtube.com/vi/${youtube}/sddefault.jpg`,
		max: `https://img.youtube.com/vi/${youtube}/maxresdefault.jpg`
	};
};

export const extractVideoID = (url) => {
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match;
	if (CheckUrl(url)) {
		match = url.match(regExp);
		if (match && match[7].length == 11) {
			return match[7];
		} else {
			return false;
		}
	} else {
		return false;
	}
};

export const InsertGTM = (GTM) => {
	(function (w, d, s, l, i) {
		w[l] = w[l] || [];
		w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
		var f = d.getElementsByTagName(s)[0],
			j = d.createElement(s),
			dl = l != "dataLayer" ? "&l=" + l : "";
		j.async = true;
		j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
		f.parentNode.insertBefore(j, f);
	})(window, document, "script", "dataLayer", GTM);
};

export const InsertGA = (GA) => {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.async = true;
	script.src = "//www.googletagmanager.com/gtag/js?id=" + GA;
	document.getElementsByTagName("head")[0].appendChild(script);

	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag("js", new Date());
	try {
		gtag("config", trackIDs[Prod].ga4);
	} catch (e) {
		console.log("GA錯誤");
	}
};

export const InsertCookie = () => {
	var body = document.getElementsByTagName("body")[0];
	var _script = document.createElement("script");
	_script.src = "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/script/cookie-bar/cookie-bar.js";
	_script.async = true;
	_script.setAttribute("id", "cookie-bar");
	body.insertAdjacentElement("beforeend", _script);
};

export const InsertHeader = () => {};

export const InsertScript = (code) => {
	function getAttributeValue(script) {
		const strippedString = source.replace(/(<([^>]+)>)/gi, "");
		return strippedString;
	}
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.appendChild(document.createTextNode(getAttributeValue(script)));
};

export const loadingShow = () => {
	$("#loadingProgress").show();
};

export const loadingHide = () => {
	$("#loadingProgress").hide();
};

export const pageInfo = (data) => {
	document.title = data.webtitle || data.eventName;
	document.querySelectorAll("meta[name='description']")[0].setAttribute("content", data.webDescription);
	// document.querySelectorAll("meta[property='og:title']")[0].setAttribute("content", data.ogTitle);
	// document.querySelectorAll("meta[property='og:description']")[0].setAttribute("content", data.ogDescription);
	// document.querySelectorAll("meta[property='og:image']")[0].setAttribute("content", data.ogUrl);
	if (Number(data.cookie) == 1) {
		if (document.querySelector("#cookieBarWrap")) {
			document.querySelector("#cookieBarWrap").classList.add("on");
		}
	}
	if (Number(data.header) == "true") {
		topBar(data.gameseq);
	}
	if (data.ga) {
		InsertGA(data.ga);
	}
	if (data.gtm) {
		InsertGTM(data.gtm);
	}
};

export const imgLoading = async (data) => {
	function promise(data) {
		return new Promise(function (resolve, reject) {
			var img = new Image();
			img.src = data;
			img.onload = function () {
				resolve(true);
			};
			img.onerror = function () {
				resolve(false);
			};
		});
	}
	let promiseAll = [];
	data.forEach((v, i) => {
		promiseAll.push(promise(v.pc));
	});
	return await Promise.all(promiseAll);
};

export const handleNumber = (e) => {
	return (e.target.value = e.target.value.replace(/[^\d]+/g, ""));
};
