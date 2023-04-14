//middle.js
module.exports = (req, res, next) => {
	if (Object.keys(req.body).length == 0) {
		if (req.method === "POST") {
			req.method = "GET";
		}
		console.log("read");
	} else {
		console.log("write");
	}
	next();
};
