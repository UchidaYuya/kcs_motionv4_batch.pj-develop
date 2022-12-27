//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/10/23 石崎 作成
//
//@uses FAQListProcBase
//@uses AdminFAQModel
//@uses AdminFAQListView
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

require("model/FAQ/Admin/AdminFAQModel.php");

require("view/FAQ/Admin/AdminFAQListView.php");

//
//O_g
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
//@since 2008/11/07
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
class AdminFAQListProc extends FAQListProcBase {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_ADMIN;
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7"
		};
		this.O_view = new AdminFAQListView(this.H_param);
	}

	getModel() {
		this.O_model = new AdminFAQModel();
	}

	selfProcessBody(H_param: {} | any[] = Array()) {
		var fid = this.O_view.gSess().getSelf("fid");

		if (false == is_null(fid)) {
			this.O_model.deleteFAQ(fid);
			var H_data = {
				shopid: this.O_view.gSess().admin_shopid,
				shopname: this.O_view.gSess().admin_name,
				username: this.O_view.gSess().admin_personname,
				kind: "FAQ",
				type: "FAQ\u524A\u9664",
				comment: "faqid:" + fid + "\u3092\u524A\u9664"
			};
			this.getOut().writeAdminMnglog(H_data);
			this.O_view.gSess().clearSessionKeySelf("fid");
		}

		super.selfProcessBody(H_param);
	}

	setListMode() //$H_fnc["0"] = "その他";
	{
		this.H_param.groupid = this.O_view.gSess().admin_groupid;
		var H_order = this.O_model.getOrderableList();
		var H_auth = this.O_model.getFunctionList(true);
		H_auth["120"] = {
			fncid: 120,
			fncname: "\u3054\u6CE8\u6587"
		};
		var H_temp = H_auth + H_order;

		for (var key in H_temp) {
			var value = H_temp[key];

			switch (key) {
				case 21:
					continue;
					break;

				case 120:
					H_fnc[key] = "\u3054\u6CE8\u6587";
					break;

				case 26:
				case 27:
				case 28:
				case 85:
				case 39:
				case 138:
					H_fnc[key] = "\u3054\u6CE8\u6587\uFF08" + value.fncname + "\uFF09";
					break;

				default:
					H_fnc[key] = value.fncname;
					break;
			}
		}

		var H_fnc = {
			"": "\u3059\u3079\u3066\u304B\u3089\u691C\u7D22"
		} + H_fnc;
		this.O_view.setAssign("fncnamelist", H_fnc);
		var A_tmp = Object.keys(H_order);
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