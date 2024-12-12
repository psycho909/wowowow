let win = window;

let callTopBar = function (game) {
	var productData;
	//產品資料
	productData = {
		新楓之谷: {
			logoInfor: {
				logoUrl: "https://maplestory.beanfun.com/main",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_MS.png"
			},
			navList: {
				listUrl: ["https://www.facebook.com/www.maplestory.msfans.com.tw", "https://maplestory.beanfun.com/download", "https://bfweb.beanfun.com/Register/register"],
				listText: ["官方粉絲團", "遊戲下載", "申請帳號"]
			}
		},
		跑跑卡丁車: {
			logoInfor: {
				logoUrl: "https://tw.beanfun.com/KartRider/main.aspx",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_KR.png"
			},
			navList: {
				listUrl: ["https://www.facebook.com/kartriderTW", "https://forum.gamer.com.tw/B.php?bsn=08936", "https://www.gashplus.com/gashstore/GashStore.aspx", "https://tw.beanfun.com/kartrider/support_01.htm"],
				listText: ["官方粉絲團", "巴哈討論區", "樂豆點哪裡買", "申請帳號"]
			}
		},
		天堂免服: {
			logoInfor: {
				logoUrl: "https://tw.beanfun.com/LineageFree/index.aspx",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_LineageFree.png"
			},
			navList: {
				listUrl: ["https://forum.gamer.com.tw/A.php?bsn=842", "https://tw.beanfun.com/TW/Checklogin.aspx?Page=2", "https://www.gashplus.com/gashstore/GashStore.aspx", "https://tw.beanfun.com/TW/Checklogin.aspx?Page=3", "https://tw.beanfun.com/lineage/download.aspx", "https://tw.beanfun.com/lineage/story3_2.aspx"],
				listText: ["巴哈討論區", "樂豆點儲值", "樂豆點哪裡買", "線上購點", "遊戲下載", "申請帳號"]
			}
		},
		天堂: {
			logoInfor: {
				logoUrl: "https://tw.beanfun.com/lineage/index.aspx",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_L1.png"
			},
			navList: {
				listUrl: ["https://forum.gamer.com.tw/A.php?bsn=842", "https://tw.beanfun.com/TW/Checklogin.aspx?Page=2", "https://www.gashplus.com/gashstore/GashStore.aspx", "https://tw.beanfun.com/TW/Checklogin.aspx?Page=3", "https://tw.beanfun.com/TW/CheckLogin.aspx?Page=8", "https://tw.beanfun.com/lineage/download.aspx", "https://tw.beanfun.com/lineage/story3_2.aspx"],
				listText: ["巴哈討論區", "樂豆點儲值", "樂豆點哪裡買", "線上購點", "變更計費方式", "遊戲下載", "申請帳號"]
			}
		},
		天堂國際服: {
			logoInfor: {
				logoUrl: "https://tw.beanfun.com/lineagenew/www/index.aspx",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_L1.png"
			},
			navList: {
				listUrl: ["https://forum.gamer.com.tw/A.php?bsn=842", "https://tw.beanfun.com/TW/Checklogin.aspx?Page=2", "https://tw.beanfun.com/TW/Checklogin.aspx?Page=3", "https://bfweb.hk.beanfun.com/", "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/lineagenew/remastered/download/index.html", "https://lineagenew-event.beanfun.com/eventad/eventad?eventadid=3865", "http://hk.beanfun.com/game_zone/"],
				listText: ["巴哈討論區", "樂豆點儲值", "線上購點", "港澳樂豆點儲值/購買", "遊戲下載", "帳號申請", "港澳帳號申請"]
			}
		},
		絕對武力: {
			logoInfor: {
				logoUrl: "https://cso.beanfun.com/main.html",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_CSO.png"
			},
			navList: {
				listUrl: ["https://cso.beanfun.com/news.html", "https://www.facebook.com/csoline.tw", "https://forum.gamer.com.tw/B.php?bsn=11902", "https://cso.beanfun.com/download.html", "https://bfweb.beanfun.com/Register/register"],
				listText: ["公告專區", "官方粉絲團", "巴哈討論區", "遊戲下載", "申請帳號"]
			}
		},
		艾爾之光: {
			logoInfor: {
				logoUrl: "https://tw.beanfun.com/ELSWORD/index.aspx",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_ELS.png"
			},
			navList: {
				listUrl: ["https://www.facebook.com/elswordfans?v=wall", "https://forum.gamer.com.tw/A.php?bsn=12259", "https://tw.beanfun.com/elsword/index.aspx?url=downloads/game.aspx", "https://tw.beanfun.com/elsword/index.aspx?url=members/apply.aspx"],
				listText: ["官方粉絲團", "巴哈討論區", "遊戲下載", "申請帳號"]
			}
		},
		新瑪奇: {
			logoInfor: {
				logoUrl: "https://mabinogi.beanfun.com/Main",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_MABI.png"
			},
			navList: {
				listUrl: ["https://www.facebook.com/mabinogi.tw", "https://forum.gamer.com.tw/A.php?bsn=07422", "https://tw.beanfun.com/mabinogi/event/20110620_teach/index.html", "https://mabinogi.beanfun.com/Download?page=program", "https://bfweb.beanfun.com/Register/register?isbfApp=0&reUrl=https://tw.beanfun.com"],
				listText: ["官方粉絲團", "巴哈討論區", "儲值教學", "遊戲下載", "申請帳號"]
			}
		},
		爆爆王: {
			logoInfor: {
				logoUrl: "https://tw.beanfun.com/BNB/index.aspx",
				logoImg: "https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_BNB.png"
			},
			navList: {
				listUrl: ["https://www.facebook.com/hibnb", "https://tw.beanfun.com/TW/CheckLogin.aspx?Page=2", "http://www.gashplus.com/gashstore/GashStore.aspx", "https://tw.beanfun.com/bnb/download.htm", "https://tw.beanfun.com/bnb/images/member_750.html"],
				listText: ["官方粉絲團", "樂豆點儲值", "樂豆點哪裡買", "遊戲下載", "申請帳號"]
			}
		},
		新龍之谷: {
			logoInfor: {
				logoUrl: "https://dragonnest.beanfun.com/Main",
				logoImg: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/DragonNest/topBar/image/icon_DN.png"
			},
			navList: {
				listUrl: ["https://www.facebook.com/TWDragonNest/", "https://dragonnest.beanfun.com/Beginner", "https://tw-event.beanfun.com/DragonNest/eventad/EventAD.aspx?EventADID=616"],
				listText: ["官方粉絲團", "遊戲下載", "申請帳號"]
			}
		}
	};
	if (!productData[game]) {
		console.error(`Game "${game}" not found in productData.`);
		return; // Stop execution if game is not found
	}
	//判斷裝置
	var userAgent = navigator.userAgent;
	var isMobileTB = {
		Android: function () {
			return userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return userAgent.match(/IEMobile/i);
		},
		any: function () {
			return isMobileTB.Android() || isMobileTB.BlackBerry() || isMobileTB.iOS() || isMobileTB.Opera() || isMobileTB.Windows();
		}
	};

	//動態引入CSS
	var topbarCssObj = document.createElement("link");
	topbarCssObj.type = "text/css";
	topbarCssObj.rel = "stylesheet";
	topbarCssObj.href = "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/script/topBar/topBar.css";
	document.head.appendChild(topbarCssObj);

	//topBar元素
	var mainTarget = document.getElementById("top-bar");

	//組合topbar
	function componentTopbar(game) {
		var gameIcon = '<div id="game_content"><a href="{{officialSite}}" id="gameImg"><img src="{{logoImage}}" /></a><a href="{{official}}" id="gameId">{{prodName}}</a></div>';

		var topBarNav = '<div id="topBarNav"><a href="{{officialSite}}">回官網</a>{{navList}}</div>';

		var optionData = productData[game];

		//gameIcon區塊產生
		var gameIconArea = gameIcon.replace("{{officialSite}}", optionData.logoInfor.logoUrl).replace("{{logoImage}}", optionData.logoInfor.logoImg).replace("{{prodName}}", game).replace("{{official}}", optionData.logoInfor.logoUrl);

		//topBarNav區塊產生
		var topBarNavList = "";
		for (var i = 0; i < optionData.navList.listUrl.length; i++) {
			topBarNavList += '<a href="' + optionData.navList.listUrl[i] + '" target="_blank">' + optionData.navList.listText[i] + "</a>";
		}
		var topBarNavArea = topBarNav.replace("{{officialSite}}", optionData.logoInfor.logoUrl).replace("{{navList}}", topBarNavList);

		//組合各區塊
		var componentTopbar = '<div id="topBar"><div id="topBar_content">' + gameIconArea + topBarNavArea + "</div></div>";

		document.body.insertAdjacentHTML("afterbegin", componentTopbar);
	}

	function deviceWidth() {
		var topBarEle = document.getElementById("topBar");

		if (isMobileTB.any()) {
			//行動裝置隱藏
			topBarEle.style.display = "none";
		} else {
			//裝置寬度小於980隱藏
			if (window.innerWidth < 980) {
				topBarEle.style.display = "none";
			} else {
				topBarEle.style.display = "block";
			}
		}
	}

	componentTopbar(game);

	window.addEventListener("resize", function () {
		deviceWidth();
	});

	deviceWidth();
};

export default callTopBar;
