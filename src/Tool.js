export const youtubePreview = (youtube) => {
	return {
		default: `https://img.youtube.com/vi/${youtube}/default.jpg`,
		hq: `https://img.youtube.com/vi/${youtube}/hqdefault.jpg`,
		sd: `https://img.youtube.com/vi/${youtube}/sddefault.jpg`
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
		var noscript = document.createElement("noscript");
		var iframe = document.createElement("iframe");
		iframe.src = "https://www.googletagmanager.com/gtag/js?id=" + GA;
		iframe.height = 0;
		iframe.width = 0;
		iframe.style = "display: none; visibility: hidden";
		noscript.append(iframe);
		body.insertAdjacentElement("afterbegin", noscript);

		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag("js", new Date());

		gtag("config", GA);
	});
};
