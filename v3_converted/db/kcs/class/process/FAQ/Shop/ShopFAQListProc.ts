//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/10/23 石崎 作成
//
//@uses FAQListProcBase
//@uses ShopFAQModel
//@uses ShopFAQListView
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/10/23
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//お問い合わせ履歴一覧
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/10/23
//

require("process/FAQ/FAQListProcBase.php");

require("model/FAQ/Shop/ShopFAQModel.php");

require("view/FAQ/Shop/ShopFAQListView.php");

//
//セッション
//
//@var mixed
//@access public
//
//
//コンストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access public
//@return void
//
//
//getView
//
//@author ishizaki
//@since 2008/09/30
//
//@access protected
//@return void
//
//
//getModel
//
//@author ishizaki
//@since 2008/09/30
//
//@access protected
//@return void
//
//
//selfProcessBody
//
//@author ishizaki
//@since 2008/11/04
//
//@param array $H_param
//@access public
//@return void
//
//
//検索条件の引数を設定する
//
//@author ishizaki
//@since 2008/10/16
//
//@param mixed $H_param
//@access protected
//@return void
//
//
//デストラクト
//
//@author ishizaki
//@since 2008/06/26
//
//@access public
//@return void
//
class ShopFAQListProc extends FAQListProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_SHOP;
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7"
		};
		this.O_view = new ShopFAQListView(this.H_param);
	}

	getModel() {
		this.O_model = new ShopFAQModel();
	}

	selfProcessBody(H_param: {} | any[] = Array()) {
		var fid = this.O_view.gSess().getSelf("fid");

		if (false == is_null(fid)) {
			this.O_model.deleteFAQ(fid);
			var H_mng_str = {
				shopid: this.O_view.gSess().shopid,
				groupid: this.O_view.gSess().groupid,
				memid: this.O_view.gSess().memid,
				name: this.O_view.gSess().personname,
				postcode: this.O_view.gSess().postcode,
				comment1: "ID:" + this.O_view.gSess().memid,
				comment2: "FAQ" + fid + "\u3092\u524A\u9664",
				kind: "FAQ",
				type: "FAQ\u306E\u524A\u9664",
				joker_flag: 0
			};
			this.getOut().writeShopMnglog(H_mng_str);
			this.O_view.gSess().clearSessionKeySelf("fid");
		}

		super.selfProcessBody(H_param);
	}

	setListMode() //$A_tmp = array_keys($H_order);
	{
		this.H_param.groupid = this.O_view.gSess().groupid;
		this.H_param.shopid = this.O_view.gSess().shopid;
		var H_order = this.O_model.getOrderableList(this.O_view.gSess().shopid);
		var H_auth = this.O_model.getFunctionList(true);
		var H_temp = H_auth + H_order;
		var H_fnc = {
			"": "\u3059\u3079\u3066\u304B\u3089\u691C\u7D22"
		};
		H_fnc[120] = "\u3054\u6CE8\u6587";

		for (var key in H_temp) {
			var value = H_temp[key];

			switch (key) {
				case 21:
				case 120:
					continue;
					break;

				case 26:
				case 27:
				case 28:
				case 85:
				case 39:
				case 138:
					H_fnc[key] = "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\uFF08" + value.fncname + "\uFF09";
					break;

				default:
					H_fnc[key] = value.fncname;
					break;
			}
		}

		H_fnc["0"] = "\u305D\u306E\u4ED6";
		this.O_view.setAssign("fncnamelist", H_fnc);
		var A_tmp = Object.keys(H_temp);
		A_tmp.push(120);
		A_tmp.push(0);
		this.H_param.fnc = A_tmp;
		var O_sess = MtSession.singleton();
		var S_POST = O_sess.getSelf("POST");
		var H_post = this.O_view.getPost();

		if (false != Array.isArray(H_post)) {
			this.H_param.search = H_post;
		} else if (undefined !== S_POST) {
			this.H_param.search = S_POST;
		}

		this.O_view.setAssign("H_jsfile", ["shopFAQDelete.js"]);
	}

	__destruct() {
		super.__destruct();
	}

};