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
	var match = url.match(regExp);
	if (match && match[7].length == 11) {
		return match[7];
	} else {
		alert("Could not extract video ID.");
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
	window.addEventListener("DOMContentLoaded", function () {
		var body = document.getElementsByTagName("body")[0];
		var noscript = document.createElement("noscript");
		var iframe = document.createElement("iframe");
		iframe.src = "https://www.googletagmanager.com/ns.html?id=" + GTM;
		iframe.height = 0;
		iframe.width = 0;
		iframe.style = "display: none; visibility: hidden";
		noscript.append(iframe);
		body.insertAdjacentElement("afterbegin", noscript);
	});
};

export const InsertGA = (GA) => {
	window.addEventListener("DOMContentLoaded", function () {
		var body = document.getElementsByTagName("body")[0];
		var _script = document.createElement("script");
		_script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA;
		_script.async = true;
		body.insertAdjacentElement("afterbegin", _script);
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag("js", new Date());

		gtag("config", GA);
	});
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

export const CheckImage = (img) => {
	var regExp = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i;
	var match = regExp.test(img);
	return match;
};
