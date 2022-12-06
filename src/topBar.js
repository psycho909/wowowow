function gameNameFilter(gameseq) {
	var listData = [
		{
			guid: 1,
			gameName: "便利商店口袋版"
		},
		{
			guid: 2,
			gameName: "魔力寶貝M"
		},
		{
			guid: 3,
			gameName: "召喚圖板"
		},
		{
			guid: 4,
			gameName: "天堂M"
		},
		{
			guid: 5,
			gameName: "櫻桃小丸子-夢遊版"
		},
		{
			guid: 6,
			gameName: "小森生活"
		},
		{
			guid: 1003,
			gameName: "新楓之谷"
		},
		{
			guid: 2003,
			gameName: "龍之谷M"
		},
		{
			guid: 2005,
			gameName: "月光雕刻師"
		},
		{
			guid: 2006,
			gameName: "彈射世界"
		},
		{
			guid: 2008,
			gameName: "天堂月服"
		},
		{
			guid: 2010,
			gameName: "天堂免服"
		},
		{
			guid: 2011,
			gameName: "天堂國際服"
		},
		{
			guid: 2012,
			gameName: "曖昧瞬間"
		},
		{
			guid: 2013,
			gameName: "跑跑卡丁車"
		},
		{
			guid: 8,
			gameName: "罪惡童話:集體崩壞的公主"
		}
	];
	return listData.filter((v, i) => {
		return v.guid == gameseq;
	});
}
function CheckDevice() {
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
	return isMobileTB.any();
}

const topBar = (game) => {
	let data = {
		新楓之谷: `<div id='topBar'><div id='topBar_content'><div id='gameIcon'><a href='https://tw.beanfun.com/maplestory/main'><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_MS.png' width='99' height='40' /></a></div><div id='gameId'><div id='gameId_L'></div><div id='gameId_C'><a href='https://tw.beanfun.com/maplestory/main'>新楓之谷</a></div>          <div id='gameId_R'></div></div><div id='topBarNav'><a href='https://tw.beanfun.com/maplestory/main'>回官網</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://www.facebook.com/www.maplestory.msfans.com.tw' target='_blank'>官方粉絲團</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/maplestory/download' target='_blank'>遊戲下載</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://bfweb.beanfun.com/Register/register' target='_blank'>申請帳號</a></div></div></div><div class='clearFloat'></div>`,
		新瑪奇: `<div id='topBar'><div id='topBar_content'><div id='gameIcon'><a href='https://tw.beanfun.com/mabinogi/main.aspx'><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_MABI.png' width='99' height='40' /></a></div><div id='gameId'><div id='gameId_L'></div><div id='gameId_C'><a href='https://tw.beanfun.com/mabinogi/main.aspx'>新瑪奇</a></div>          <div id='gameId_R'></div></div><div id='topBarNav'><a href='https://tw.beanfun.com/mabinogi/main.aspx'>回官網</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://www.facebook.com/mabinogi.tw' target='_blank'>官方粉絲團</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://forum.gamer.com.tw/A.php?bsn=07422' target='_blank'>巴哈討論區</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/mabinogi/event/20110620_teach/index.html' target='_blank'>儲值教學</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/mabinogi/index.aspx?url=4_download.aspx' target='_blank'>遊戲下載</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/mabinogi/index.aspx?url=Net2.0/Home/np.html' target='_blank'>申請帳號</a></div></div></div><div class='clearFloat'></div>`,
		新龍之谷: `<div id='topBar'> <div id='topBar_content'><div id='gameIcon'><a href='https://tw.beanfun.com/DragonNest/Main.aspx'><img src='https://tw.hicdn.beanfun.com/beanfun/GamaWWW/DragonNest/topBar/image/icon_DN.png' width='99' height='40' /></a></div> <div id='gameId'> <div id='gameId_L'></div> <div id='gameId_C'><a href='https://tw.beanfun.com/DragonNest/Main.aspx'>新龍之谷</a></div> <div id='gameId_R'></div> </div> <div id='topBarNav'><a href='https://tw.beanfun.com/DragonNest/Main.aspx'>回官網</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://www.facebook.com/TWDragonNest/' target='_blank'>官方粉絲團</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/DragonNest/beginner.aspx' id='topbar_download'>遊戲下載</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://event.beanfun.com/DragonNest/eventad/EventAD.aspx?EventADID=616' target='_blank' id='topBar_newAccount'>申請帳號</a></div> </div> </div> <div class='clearFloat'></div>`,
		跑跑卡丁車: `<div id='topBar'><div id='topBar_content'><div id='gameIcon'><a href='https://tw.beanfun.com/KartRider/main.aspx'><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_KR.png' width='99' height='40' /></a></div><div id='gameId'><div id='gameId_L'></div><div id='gameId_C'><a href='https://tw.beanfun.com/KartRider/main.aspx'>跑跑卡丁車</a></div>          <div id='gameId_R'></div></div><div id='topBarNav'><a href='https://tw.beanfun.com/KartRider/main.aspx'>回官網</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://www.facebook.com/kartriderTW' target='_blank'>官方粉絲團</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://forum.gamer.com.tw/B.php?bsn=08936' target='_blank'>巴哈討論區</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://www.gashplus.com/gashstore/GashStore.aspx' target='_blank'>樂豆點哪裡買</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/kartrider/support_01.htm' target='_blank'>申請帳號</a></div></div></div><div class='clearFloat'></div>`,
		艾爾之光: `<div id='topBar'><div id='topBar_content'><div id='gameIcon'><a href='https://tw.beanfun.com/ELSWORD/index.aspx'><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_ELS.png' width='99' height='40' /></a></div><div id='gameId'><div id='gameId_L'></div><div id='gameId_C'><a href='https://tw.beanfun.com/ELSWORD/index.aspx'>艾爾之光</a></div>          <div id='gameId_R'></div></div><div id='topBarNav'><a href='https://tw.beanfun.com/ELSWORD/index.aspx'>回官網</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://www.facebook.com/elswordfans?v=wall' target='_blank'>官方粉絲團</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://forum.gamer.com.tw/A.php?bsn=12259' target='_blank'>巴哈討論區</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/Mania/index.aspx?url=/beanfun/Minisite.aspx?GameID=809' target='_blank'>改版攻略</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/elsword/index.aspx?url=downloads/game.aspx' target='_blank'>遊戲下載</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://tw.beanfun.com/elsword/index.aspx?url=members/apply.aspx' target='_blank'>申請帳號</a></div></div></div><div class='clearFloat'></div>`,
		絕對武力: `<div id='topBar'><div id='topBar_content'><div id='gameIcon'><a href='https://cso.beanfun.com/'><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/game/icon_CSO.png' width='99' height='40' /></a></div><div id='gameId'><div id='gameId_L'></div><div id='gameId_C'><a href='https://cso.beanfun.com/'>絕對武力</a></div>          <div id='gameId_R'></div></div><div id='topBarNav'><a href='https://cso.beanfun.com/'>回官網</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://cso.beanfun.com/news.html' target='_blank'>公告專區</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://www.facebook.com/csoline.tw' target='_blank'>官方粉絲團</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://forum.gamer.com.tw/B.php?bsn=11902' target='_blank'>巴哈討論區</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://cso.beanfun.com/download.html' target='_blank'>遊戲下載</a><img src='https://tw.beanfun.com/bfevent/bf/topBar/images/line.png' width='1' height='9' /><a href='https://bfweb.beanfun.com/Register/register' target='_blank'>申請帳號</a></div></div></div><div class='clearFloat'></div>`
	};
	if (gameNameFilter(game)[0]) {
		if (!CheckDevice() && data[gameNameFilter(game)[0].gameName]) {
			let head = document.getElementsByTagName("head")[0];
			let body = document.getElementsByTagName("body")[0];
			let link = document.createElement("link");
			let HTML = ``;
			link.href = "https://tw.beanfun.com/bfevent/bf/topBar/topBar.css";
			link.rel = "stylesheet";
			link.type = "text/css";
			HTML = data[gameNameFilter(game)[0].gameName];
			head.insertAdjacentElement("beforeend", link);
			body.insertAdjacentHTML("afterbegin", HTML);
		}
	}
};

export default topBar;
