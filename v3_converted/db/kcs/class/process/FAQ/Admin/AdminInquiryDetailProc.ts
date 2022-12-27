//
//お問い合わせの返信
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//2010/03/11 石崎 区分変更時にメールを送信しないように仕様を変更
//
//@uses FAQBaseProc
//@uses ShopFAQModel
//@uses InquiryDetailView
//@uses MtAuthority
//@uses MtMailUtil
//@uses GroupModel
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//FAQ表示
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//

require("process/FAQ/FAQBaseProc.php");

require("model/FAQ/Admin/AdminFAQModel.php");

require("view/FAQ/Admin/AdminInquiryDetailView.php");

require("MtAuthority.php");

require("MtMailUtil.php");

require("model/GroupModel.php");

//
//O_auth
//
//@var mixed
//@access protected
//
//
//H_car
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
//addNewClass
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
//@since 2008/10/19
//
//@access protected
//@return void
//
//
//検索条件の引数を設定する
//
//@author ishizaki
//@since 2008/10/21
//
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
class AdminInquiryDetailProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) //別ドメイン対応 20091110miya
	{
		super(H_param);
		this.O_auth = undefined;
		this.H_car = Array();
		this.O_group = new GroupModel();
		this.getSetting().loadConfig("group");
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_ADMIN;
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"list.php": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7",
			"": "\u304A\u554F\u3044\u5408\u308F\u305B\u8FD4\u4FE1"
		};
		this.O_view = new AdminInquiryDetailView(this.H_param);
	}

	getModel() {
		this.O_model = new AdminFAQModel();
	}

	addNewClass() {}

	selfProcessBody() //お問い合わせIDの取得
	//ユーザが削除されている
	//区分の作成
	//検索条件を継承先に設定してもらう
	//お問い合わせの詳細を取得
	{
		var id = this.O_view.getID();
		var mode = this.O_view.getMode();

		if ("editfnc" == mode) {
			var O_sess = MtSession.singleton();
			var fnc = O_sess.getself("fnc");

			if (false !== fnc && undefined != fnc) //管理記録
				{
					this.O_model.changeFnc(id, fnc);
					var H_data = {
						shopid: this.O_view.gSess().admin_shopid,
						shopname: this.O_view.gSess().admin_name,
						username: this.O_view.gSess().admin_personname,
						kind: "FAQ",
						type: "\u304A\u554F\u3044\u5408\u308F\u305B",
						comment: "inquiryid:" + id + "\u306E\u533A\u5206\u3092funcid:" + fnc + "\u306B\u8A2D\u5B9A"
					};
					this.getOut().writeAdminMnglog(H_data);
				}

			delete fnc;
			O_sess.clearSessionKeySelf("fnc");
		} else if ("statusfnc" == mode) {
			O_sess = MtSession.singleton();
			var status = O_sess.getself("status");

			if (false !== status && undefined != status) //管理記録
				{
					this.O_model.changeStatus(id, status);
					H_data = {
						shopid: this.O_view.gSess().admin_shopid,
						shopname: this.O_view.gSess().admin_name,
						username: this.O_view.gSess().admin_personname,
						kind: "FAQ",
						type: "\u304A\u554F\u3044\u5408\u308F\u305B",
						comment: "inquiryid:" + id + "\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u3092" + status + "\u306B\u5909\u66F4"
					};
					this.getOut().writeAdminMnglog(H_data);
				}

			delete status;
			O_sess.clearSessionKeySelf("status");
		} else if ("publicfnc" == mode) {
			O_sess = MtSession.singleton();
			var publiclevel = O_sess.getself("publiclevel");

			if (false !== publiclevel && undefined !== publiclevel) //管理記録
				{
					this.O_model.changePubliclevel(id, publiclevel);
					H_data = {
						shopid: this.O_view.gSess().admin_shopid,
						shopname: this.O_view.gSess().admin_name,
						username: this.O_view.gSess().admin_personname,
						kind: "FAQ",
						type: "\u304A\u554F\u3044\u5408\u308F\u305B",
						comment: "inquiryid:" + id + "\u306E\u516C\u958B\u7BC4\u56F2\u3092" + publiclevel + "\u306B\u8A2D\u5B9A"
					};
					this.getOut().writeAdminMnglog(H_data);
				}

			delete publiclevel;
			O_sess.clearSessionKeySelf("publiclevel");
		}

		var H_inquiryParam = this.O_model.getInquiryParam(id);

		if (!(!is_null(H_inquiryParam.pactid) && !is_null(H_inquiryParam.postid) && !is_null(H_inquiryParam.userid))) {
			this.O_view.setAssign("userdeleted", true);
		}

		this.O_auth = MtAuthority.singleton(H_inquiryParam.pactid);
		this.O_view.setAssign("H_inquiryParam", H_inquiryParam);
		var H_order = this.O_model.getOrderableList();
		var H_auth = this.O_model.getFunctionList(true);
		var H_temp = H_auth + H_order;

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
					H_fnc[key] = "\u3054\u6CE8\u6587\uFF08" + value.fncname + "\uFF09";
					break;

				default:
					H_fnc[key] = value.fncname;
					break;
			}
		}

		H_fnc["0"] = "\u305D\u306E\u4ED6";
		H_fnc["120"] = "\u3054\u6CE8\u6587";
		this.O_view.setAssign("H_car", H_fnc);
		this.setListMode();
		var H_InquiryDetail = this.O_model.getInquiryDetail(id, this.H_param);

		if (1 > H_InquiryDetail.length) {
			this.O_view.setAssign("err_str", "\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002");
			return true;
		} else {
			this.O_view.setAssign("InquiryDetail", H_InquiryDetail);
			var H_Post = this.O_view.gSess().getSelf("POST");
			var H_Files = this.O_view.gSess().getSelf("FILES");

			if (false != H_Files) {
				this.O_view.setAssign("files", H_Files);
				H_Post.attachment = this.O_view.gSess().getSelf("attachmentupfile");
				H_Post.attachmentname = H_Files.attachment.name;
			}

			var O_gs = this.O_view.gSess();

			if (false === this.O_view.getSubmitFlag()) {
				this.O_view.makeFormElements();
			} else //管理記録
				{
					O_sess = MtSession.singleton();
					var res = this.O_model.addInquiryFromAdmin(id, H_Post, O_gs.admin_shopid, O_gs.admin_groupid);
					H_data = {
						shopid: this.O_view.gSess().admin_shopid,
						shopname: this.O_view.gSess().admin_name,
						username: this.O_view.gSess().admin_personname,
						kind: "FAQ",
						type: "\u304A\u554F\u3044\u5408\u308F\u305B",
						comment: "inquiryid:" + id + "\u3078\u8FD4\u4FE1"
					};
					this.getOut().writeAdminMnglog(H_data);

					if (true == res) {
						var mail = this.O_model.getInquiryOwnerMail(id);
						var Admin = this.O_model.getAdminMail(O_sess.admin_groupid, false);

						if (false == is_null(mail)) //別ドメイン対応 20091110miya
							{
								var O_mail = new MtMailUtil();
								var title = this.getSetting().faq_inquiry_title;
								title = str_replace("{SYSTEM}", this.O_group.getGroupSystemname(mail[0].groupid), title);
								title += "(" + id + ")";
								var message = file_get_contents(this.getSetting().KCS_DIR + "/conf_sync/mail_template/res_admin_inquiry.txt");

								if (true == this.getSetting().existsKey("groupid" + mail[0].groupid + "_is_original_domain") && this.getSetting()["groupid" + O_gs.groupid + "_is_original_domain"] == true) {
									message = str_replace("{HOSTNAME}", this.getSetting()["groupid" + mail[0].groupid + "_hostname"], message);
								} else {
									message = str_replace("{HOSTNAME}", _SERVER.HTTP_HOST, message);
								}

								message = str_replace("{SYSTEM}", this.O_group.getGroupSystemname(mail[0].groupid), message);

								if (1 < mail[0].groupid) //別ドメイン対応 20091110miya
									{
										if (true == this.getSetting().existsKey("groupid" + mail[0].groupid + "_is_original_domain") && this.getSetting()["groupid" + O_gs.groupid + "_is_original_domain"] == true) {
											if (this.O_auth.chkPactFuncIni("fnc_pact_login")) {
												message = str_replace("{groupname}", this.O_group.getGroupName(mail[0].groupid) + "/" + mail[0].userid_ini + "/", message);
											} else {
												message = str_replace("{groupname}", "", message);
											}
										} else {
											if (this.O_auth.chkPactFuncIni("fnc_pact_login")) {
												message = str_replace("{groupname}", this.O_group.getGroupName(mail[0].groupid) + "/" + mail[0].userid_ini + "/", message);
											} else {
												message = str_replace("{groupname}", this.O_group.getGroupName(mail[0].groupid), message);
											}
										}
									} else {
									if (this.O_auth.chkPactFuncIni("fnc_pact_login")) {
										message = str_replace("{groupname}", "kcs/" + mail[0].userid_ini + "/", message);
									} else {
										message = str_replace("{groupname}", "", message);
									}
								}

								O_mail.send(mail[0].to, message, Admin[0].to, title, Admin[0].to_name, mail[0].to_name);
							}
					}

					this.setFinishFlag();
				}
		}
	}

	setListMode() {
		this.H_param.groupid = this.O_view.gSess().admin_groupid;
		this.H_param.shopid = this.O_view.gSess().shop_shopid;
	}

	__destruct() {
		super.__destruct();
	}

};