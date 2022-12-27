//
//メニュープロセス
//
//更新履歴：<br>
//2008/06/17 上杉勝史 作成
//
//@uses ProcessBaseHtml
//@uses MenuModel
//@uses FavoriteModel
//@uses InfoModel
//@uses MenuView
//@package Menu
//@filesource
//@author katsushi
//@since 2008/06/17
//
//error_reporting(E_ALL|E_STRICT);
//
//
//メニュープロセス
//
//@uses ProcessBaseHtml
//@uses MenuModel
//@uses FavoriteModel
//@uses InfoModel
//@uses MenuView
//@package Menu
//@author katsushi
//@since 2008/06/17
//

require("process/ProcessBaseHtml.php");

require("model/Menu/MenuModel.php");

require("model/FavoriteModel.php");

require("model/InfoModel.php");

require("view/Menu/MenuView.php");

require("model/UserAuth.php");

//
//O_Favorite
//
//@var mixed
//@access protected
//
//
//O_Info
//
//@var mixed
//@access protected
//
//
//__construct
//
//@author katsushi
//@since 2008/06/17
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author katsushi
//@since 2008/06/17
//
//@param array $H_param
//@access protected
//@return void
//
//
//addMenuGroup
//
//@author katsushi
//@since 2008/07/01
//
//@param array $H_menu
//@param array $A_favorite
//@access private
//@return void
//
//
//オーダー部分のタブを作成
//
//@author katsushi
//@since 2008/08/18
//
//@param array $A_pattern
//@access protected
//@return void
//
//
//__destruct
//
//@author katsushi
//@since 2008/06/17
//
//@access public
//@return void
//
class MenuProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("menu");
		this.getSetting().loadConfig("H_order_pattern");
		this.getSetting().loadConfig("H_fnc_car");
		this.O_Favorite = new FavoriteModel();
		this.O_Info = new InfoModel();
	}

	doExecute(H_param: {} | any[] = Array()) //// view の生成
	//// model の生成
	//s182期限切れお知らせの閲覧
	//表示言語分岐
	//$O_view->setAssign("onLoad", "selectTab(" . $tabno . ")");
	//オーダー専用ヘルプファイルセット
	//全セッションを消す
	//Smartyによる表示
	{
		var O_view = new MenuView();
		O_view.startCheck();
		var A_auth = O_view.getAuthBase();
		O_view.setHelpFile();
		var O_model = new MenuModel();

		if (A_auth.length == 0) {
			var H_func = Array();
		} else {
			H_func = O_model.getMenu(A_auth);
		}

		var A_fav = this.O_Favorite.getFavoriteMenuFncid(O_view.gSess().pactid, O_view.gSess().userid);
		O_view.setAssign("H_menu", this.addMenuGroup(H_func, A_fav));
		var show_info = false;
		var A_info = Array();
		var info_more = undefined;

		if (O_view.chkInfoFunc() == true) {
			A_info = this.O_Info.getAllInfoList(O_view.gSess().pactid, O_view.gSess().postid, O_view.gSess().userid, O_view.gSess().su, this.getSetting().menu_info_count + 1);
			info_more = "";

			if (A_info.length > this.getSetting().menu_info_count) {
				A_info.pop();

				if (O_view.gSess().language == "ENG") {
					info_more = "Continued here";
				} else {
					info_more = "\u7D9A\u304D\u306F\u3053\u3061\u3089\u3078";
				}
			}

			show_info = true;
		}

		var auth = new UserAuth(MtAuthority.singleton(O_view.gSess().pactid));
		var authlist = auth.getAllini(O_view.gSess().userid);

		if (-1 !== authlist.indexOf("fnc_fjp_co") && -1 !== authlist.indexOf("fnc_tel_division")) {
			O_view.setAssign("OrderByCategory", O_view.gSess().OrderByCategory);
			O_view.setAssign("divisioned_order", true);
		} else {
			O_view.setAssign("divisioned_order", false);
		}

		if (-1 !== authlist.indexOf("fnc_info_old")) {
			O_view.setAssign("info_old", true);
		} else {
			O_view.setAssign("info_old", false);
		}

		O_view.setAssign("info_more", info_more);
		O_view.setAssign("A_info", A_info);
		O_view.setAssign("show_info", show_info);
		O_view.addJs("xmlhttprequest.js");

		if (O_view.gSess().language == "ENG") {
			O_view.addJs("/eng/menu.js");
		} else {
			O_view.addJs("menu.js");
		}

		O_view.addJs("style_chenger.js?update=20180514");
		O_view.setAssign("selg", O_view.getCookieTab());
		O_view.setAssign("nowcar", O_view.getCookieOrderTab());
		var A_pact_auth = O_view.getAuthPact();
		var H_fnc_car = this.getSetting().H_fnc_car;
		var H_car_fnc = array_flip(H_fnc_car);
		var A_orderble_car = O_model.getOrderableCarrier(O_view.gSess().pactid, O_view.gSess().postid);
		var A_car = Array();

		for (var i = 0; i < A_orderble_car.length; i++) {
			if (-1 !== A_pact_auth.indexOf(H_car_fnc[A_orderble_car[i]]) == true) {
				A_car.push(A_orderble_car[i]);
			}
		}

		if (O_view.chkOrderFunc() == true) {
			O_view.setAssign("ordtab", "show");
		} else {
			O_view.setAssign("ordtab", "no");
		}

		O_view.setAssign("A_car", A_car);
		var A_pattern = O_model.getOrderPattern(A_car, O_view.gSess().pactid, O_view.gSess().OrderByCategory);
		var H_ptn = this.makeOrderPattern(A_pattern, O_view.gSess().language);
		O_view.setAssign("H_ptn", H_ptn);
		O_view.setAssign("helpauth", GLOBALS.G_HELP_DISPLAY);
		O_view.setAssign("orderhelpfile", O_model.getOrderHelpFile(O_view.gSess()));
		O_view.gSess().clearSessionMenu();
		O_view.displaySmarty();
	}

	addMenuGroup(H_func: {} | any[], A_favorite: {} | any[] = Array()) //親子関係の精査
	//メニュー用の連想配列
	//よく使う項目の生成
	//メニューリストの生成
	////	添付資料アップロードとダウンロードが分かれることになったので、ここをコメント化
	//		//	添付資料DLの削除を行うよ
	//		if( !empty($H_menu[3]) ){
	//			$menu_keys = array_keys($H_menu[3]);
	//			if( in_array(239,$menu_keys) && in_array(240,$menu_keys) ){
	//				unset( $H_menu[3][240] );
	//			}
	//		}
	//権限名変える。受注内容入力確定→受注内容マスタ登録
	{
		for (var fncid in H_func) {
			var H_val = H_func[fncid];

			if (H_val.parent != "") {
				if (H_val.parent in H_func == true) {
					delete H_func[fncid];
				}
			}
		}

		var H_menu = {
			"1": Array()
		};

		for (var i = 0; i < A_favorite.length; i++) {
			if (A_favorite[i] in H_func == true) {
				H_menu[1][A_favorite[i]] = H_func[A_favorite[i]];
			}
		}

		for (var fncid in H_func) {
			var H_val = H_func[fncid];

			for (i = 2;; i <= 6; i++) {
				if (-1 !== this.getSetting()["A_group" + i].indexOf(fncid) == true) {
					if (undefined !== H_menu[i] == false) {
						H_menu[i] = Array();
					}

					H_menu[i][fncid] = H_val;
					break;
				}
			}
		}

		if (undefined !== H_menu[5][242]) {
			H_menu[5][242].fncname = "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u767B\u9332";
		}

		return H_menu;
	}

	makeOrderPattern(A_pattern: {} | any[], language) {
		var H_ptn = Array();

		for (var i = 0; i < A_pattern.length; i++) {
			if (undefined !== H_ptn[A_pattern[i].carid] == false) {
				H_ptn[A_pattern[i].carid] = Array();
			}

			if (language == "ENG") {
				H_ptn[A_pattern[i].carid].push({
					name: A_pattern[i].ptnname_eng,
					url: "/MTOrder/select.php?carid=" + A_pattern[i].carid + "&cirid=" + A_pattern[i].cirid + "&type=" + A_pattern[i].type + "&ppid=" + A_pattern[i].ppid,
					menucomment: A_pattern[i].menucomment_eng
				});
			} else {
				H_ptn[A_pattern[i].carid].push({
					name: A_pattern[i].ptnname,
					url: "/MTOrder/select.php?carid=" + A_pattern[i].carid + "&cirid=" + A_pattern[i].cirid + "&type=" + A_pattern[i].type + "&ppid=" + A_pattern[i].ppid,
					menucomment: A_pattern[i].menucomment
				});
			}
		}

		return H_ptn;
	}

	__destruct() {
		super.__destruct();
	}

};