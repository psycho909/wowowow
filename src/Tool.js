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
