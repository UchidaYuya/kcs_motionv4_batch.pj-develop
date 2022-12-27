//
//お問い合わせ 新規追加
//
//更新履歴：<br>
//2008/08/27 石崎 作成
//
//@uses FAQBaseProc
//@uses UserFAQModel
//@uses MenuModel
//@uses PactModel
//@uses MtPostUtil
//@uses AddInquiryView
//@uses MtAuthority
//@uses MtMailUtil
//@uses GroupModel
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//お問い合わせメニュー
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/27
//

require("process/FAQ/FAQBaseProc.php");

require("model/FAQ/UserFAQModel.php");

require("model/Menu/MenuModel.php");

require("model/PactModel.php");

require("MtPostUtil.php");

require("view/FAQ/AddInquiryView.php");

require("MtAuthority.php");

require("MtMailUtil.php");

require("model/GroupModel.php");

//
//O_view
//
//@var mixed
//@access protected
//
//
//O_model
//
//@var mixed
//@access protected
//
//
//O_Pact
//
//@var mixed
//@access protected
//
//
//O_menu
//
//@var mixed
//@access protected
//
//
//O_group
//
//@var mixed
//@access protected
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
//Viewクラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//Modelクラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//必要クラスの生成
//
//@author ishizaki
//@since 2008/10/16
//
//@access protected
//@return void
//
//
//selfProcessBody
//
//@author ishizaki
//@since 2008/08/27
//
//@param array $H_param
//@access public
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
class AddInquiryProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) //別ドメイン対応 20091110miya
	{
		super(H_param);
		this.getSetting().loadConfig("menu");
		this.getSetting().loadConfig("group");
		this.O_group = new GroupModel();
	}

	getView() {
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"": "\u65B0\u898F\u304A\u554F\u3044\u5408\u308F\u305B"
		};
		this.O_view = new AddInquiryView(this.H_param);
	}

	getModel() {
		this.O_model = new UserFAQModel();
	}

	addNewClass() {
		this.O_menu = new MenuModel();
		this.O_Pact = new PactModel();
		this.O_Post = new MtPostUtil();
	}

	selfProcessBody(H_param: {} | any[] = Array()) //第二階層部署権限
	{
		var A_auth = this.O_view.getAuthUser();
		var H_auth = this.O_menu.getMenu(A_auth);
		H_auth["0"] = {
			fncname: "\u305D\u306E\u4ED6"
		};
		var H_order = this.filteringFunctionOrder(this.O_menu.getOrderableCarrier(this.O_view.gSess().pactid, this.O_view.gSess().postid));
		delete A_auth;
		var O_auth = MtAuthority.singleton(this.O_view.gSess().pactid);
		var fncid = this.O_view.getFncid();

		if (true == (undefined !== H_auth[fncid])) {
			this.O_view.setAssign("fncname", H_auth[fncid].fncname);
		} else if (true == (undefined !== H_order[fncid])) {
			this.O_view.setAssign("fncname", "\u3054\u6CE8\u6587\uFF08" + H_order[fncid].fncname + "\uFF09");
		} else {
			this.errorOut(8, "\u5B58\u5728\u3057\u306A\u3044\u533A\u5206");
			throw die(0);
		}

		var H_Post = this.O_view.gSess().getSelf("POST");
		var O_gs = this.O_view.gSess();

		if (false === this.O_view.getSubmitFlag()) {
			this.O_view.makeFormElements();
		} else {
			require("MtUniqueString.php");

			var O_unique = MtUniqueString.singleton();
			O_unique.validate(H_Post.csrfid);
			var id = this.O_model.addNewInquiry(fncid, H_Post, O_gs.pactid, O_gs.userid, O_gs.groupid);

			if (false !== id) //メール送信リストの取得
				//A_fncに含まれている区分からならショップにもメールを送る
				//メッセージ
				//別ドメイン対応 20091110miya
				//$message_shop = str_replace("{FILENAME}", "index_shop.php", $message);
				//管理者宛
				//ショップ宛
				{
					var O_mail = new MtMailUtil();
					var A_admin = this.O_model.getAdminMail(O_gs.groupid);
					var A_fnc = this.O_model.returnShopFnc();
					var A_tmp = Array();
					A_tmp = this.O_model.getShopMail(O_gs.postid, fncid);

					if (true === (-1 !== A_fnc.indexOf(fncid)) && 0 != fncid && 120 != fncid) {
						this.getSetting().loadConfig("H_fnc_car");
						var title = this.getSetting().faq_new_inquiry_title_order;
						title = str_replace("{TEMP}", this.getSetting().H_fnc_car_name[fncid], title);
					} else {
						title = this.getSetting().faq_new_inquiry_title;
					}

					title = str_replace("{SYSTEM}", this.O_group.getGroupSystemname(O_gs.groupid), title);
					title += "(" + id + ")";
					var message = file_get_contents(this.getSetting().KCS_DIR + "/conf_sync/mail_template/new_inquiry.txt");

					if (true == this.getSetting().existsKey("groupid" + O_gs.groupid + "_is_original_domain") && this.getSetting()["groupid" + O_gs.groupid + "_is_original_domain"] == true) {
						message = str_replace("{HOSTNAME}", this.getSetting()["groupid" + O_gs.groupid + "_hostname"], message);
					} else {
						message = str_replace("{HOSTNAME}", _SERVER.HTTP_HOST, message);
					}

					message = str_replace("{SYSTEM}", this.O_group.getGroupSystemname(O_gs.groupid), message);
					var message_admin = str_replace("{FILENAME}", "index_admin.php", message);

					if (1 < O_gs.groupid) //別ドメイン対応 20091110miya
						{
							if (true == this.getSetting().existsKey("groupid" + O_gs.groupid + "_is_original_domain") && this.getSetting()["groupid" + O_gs.groupid + "_is_original_domain"] == true) {
								var message_shop = str_replace("{FILENAME}", "index_shop.php", message);
							} else {
								message_shop = str_replace("{FILENAME}", this.O_group.getGroupName(O_gs.groupid) + "/index_shop.php", message);
							}
						} else {
						message_shop = str_replace("{FILENAME}", "index_shop.php", message);
					}

					var from_mail = this.O_model.getUsermail(O_gs.userid);

					for (var i = 0; i < A_admin.length; i++) {
						if (false == is_null(A_admin[i].to)) {
							if (1 < A_admin[i].groupid) //別ドメイン対応 20091110miya
								{
									if (true == this.getSetting().existsKey("groupid" + O_gs.groupid + "_is_original_domain") && this.getSetting()["groupid" + O_gs.groupid + "_is_original_domain"] == true) {
										message_admin = str_replace("{FILENAME}", "index_admin.php", message);
									} else {
										message_admin = str_replace("{FILENAME}", this.O_group.getGroupName(O_gs.groupid) + "/index_admin.php", message);
									}
								}

							O_mail.send(A_admin[i].to, message_admin, from_mail.to, title, from_mail.to_name, A_admin[i].to_name);
						}
					}

					if (0 < A_tmp.length) {
						for (i = 0;; i < A_tmp.length; i++) {
							if (false == is_null(A_tmp[i].to)) {
								O_mail.send(A_tmp[i].to, message_shop, from_mail.to, title, from_mail.to_name, A_tmp[i].to_name);
							}
						}
					}

					delete message;
				}

			this.setFinishFlag();
		}
	}

	__destruct() {
		super.__destruct();
	}

};