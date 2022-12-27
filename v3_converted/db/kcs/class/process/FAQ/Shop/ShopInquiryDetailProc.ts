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

require("model/FAQ/Shop/ShopFAQModel.php");

require("view/FAQ/Shop/ShopInquiryDetailView.php");

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
class ShopInquiryDetailProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) //別ドメイン対応 20091110miya
	{
		super(H_param);
		this.O_auth = undefined;
		this.H_car = Array();
		this.O_group = new GroupModel();
		this.getSetting().loadConfig("group");
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_SHOP;
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"list.php": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7",
			"": "\u304A\u554F\u3044\u5408\u308F\u305B\u8FD4\u4FE1"
		};
		this.O_view = new ShopInquiryDetailView(this.H_param);
	}

	getModel() {
		this.O_model = new ShopFAQModel();
	}

	addNewClass() {}

	selfProcessBody() //お問い合わせIDの取得
	//区分変更
	//ユーザが削除されていない
	//検索条件を継承先に設定してもらう
	//お問い合わせの詳細を取得
	{
		var id = this.O_view.getID();
		var mode = this.O_view.getMode();

		if ("editfnc" == mode) {
			var O_sess = MtSession.singleton();
			var fnc = O_sess.getself("fnc");

			if (false !== fnc && undefined != fnc) {
				var H_mng_str = {
					shopid: O_sess.shopid,
					groupid: O_sess.groupid,
					memid: O_sess.memid,
					name: O_sess.personname,
					postcode: O_sess.postcode,
					comment1: "ID:" + O_sess.memid,
					comment2: "\u304A\u554F\u3044\u5408\u308F\u305B" + id + "\u306E\u533A\u5206\u3092\u5909\u66F4",
					kind: "FAQ",
					type: "\u304A\u554F\u3044\u5408\u308F\u305B",
					joker_flag: 0
				};
				this.getOut().writeShopMnglog(H_mng_str);
				this.O_model.changeFnc(id, fnc);
			}

			delete fnc;
			O_sess.clearSessionKeySelf("fnc");
		} else if ("statusfnc" == mode) {
			O_sess = MtSession.singleton();
			var status = O_sess.getself("status");

			if (false !== status && undefined != status) {
				this.O_model.changeStatus(id, status);
				H_mng_str = {
					shopid: O_sess.shopid,
					groupid: O_sess.groupid,
					memid: O_sess.memid,
					name: O_sess.personname,
					postcode: O_sess.postcode,
					comment1: "ID:" + O_sess.memid,
					comment2: "\u304A\u554F\u3044\u5408\u308F\u305B" + id + "\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4",
					kind: "FAQ",
					type: "\u304A\u554F\u3044\u5408\u308F\u305B",
					joker_flag: 0
				};
				this.getOut().writeShopMnglog(H_mng_str);
			}

			delete status;
			O_sess.clearSessionKeySelf("status");
		} else if ("publicfnc" == mode) {
			O_sess = MtSession.singleton();
			var publiclevel = O_sess.getself("publiclevel");

			if (false !== publiclevel && undefined !== publiclevel) {
				this.O_model.changePubliclevel(id, publiclevel);
				H_mng_str = {
					shopid: O_sess.shopid,
					groupid: O_sess.groupid,
					memid: O_sess.memid,
					name: O_sess.personname,
					postcode: O_sess.postcode,
					comment1: "ID:" + O_sess.memid,
					comment2: "\u304A\u554F\u3044\u5408\u308F\u305B" + id + "\u306E\u516C\u958B\u30EC\u30D9\u30EB\u3092\u5909\u66F4",
					kind: "FAQ",
					type: "\u304A\u554F\u3044\u5408\u308F\u305B",
					joker_flag: 0
				};
				this.getOut().writeShopMnglog(H_mng_str);
			}

			delete publiclevel;
			O_sess.clearSessionKeySelf("publiclevel");
		}

		var H_inquiryParam = this.O_model.getInquiryParam(id);
		this.O_auth = MtAuthority.singleton(H_inquiryParam.pactid);
		this.O_view.setAssign("H_inquiryParam", H_inquiryParam);

		if (!is_null(H_inquiryParam.pactid) && !is_null(H_inquiryParam.postid) && !is_null(H_inquiryParam.userid)) //ユーザの所属する部署がこの販売店に対して注文の出来るキャリアの一覧を取得
			//$this->O_view->setAssign("makeAble", true);
			{
				var A_car = this.O_model.getAbleCariaToMyShop(H_inquiryParam.pactid, H_inquiryParam.postid, this.O_view.gSess().shopid);
				var A_auth = this.O_auth.getPactFuncid();
				var H_tmp = this.O_model.getOrderable(A_auth, A_car);
				var H_auth = this.O_model.getFunctionList(true);
				H_auth = H_auth + H_tmp;
				this.H_car["120"] = {
					fncid: 120,
					fncname: "\u3054\u6CE8\u6587"
				};

				if (H_auth.length > 0) {
					for (var fncid in H_auth) {
						var array = H_auth[fncid];

						switch (fncid) {
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
								this.H_car[fncid] = {
									fncid: fncid,
									fncname: "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\uFF08" + array.fncname + "\uFF09"
								};
								break;

							default:
								this.H_car[fncid] = array;
								break;
						}
					}
				}

				this.H_car["0"] = {
					fncid: 0,
					fncname: "\u305D\u306E\u4ED6"
				};
				this.O_view.setAssign("makeAble", -1 !== [0, 26, 27, 28, 85, 39, 120, 138].indexOf(H_inquiryParam.fncid));
				this.O_view.setAssign("H_car", this.H_car);
			} else {
			this.O_view.setAssign("userdeleted", true);
		}

		this.setListMode();
		var H_InquiryDetail = this.O_model.getInquiryDetail(id, this.H_param);

		if (1 > H_InquiryDetail.length) {
			this.O_view.setAssign("err_str", "\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002");
			return true;
		} else {
			this.O_view.setAssign("Inquirystatus", H_inquiryParam.inquirystatus);
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
			} else {
				var res = this.O_model.addInquiryFromShop(id, H_Post, O_gs.shopid, O_gs.memid, O_gs.groupid, O_gs.name, O_gs.loginname);

				if (true == res) {
					O_sess = MtSession.singleton();
					var mail = this.O_model.getInquiryOwnerMail(id);
					var Shop = this.O_model.getShopmemidMail(O_sess.memid);

					if (false == is_null(mail)) //別ドメイン対応 20091110miya
						{
							var O_mail = new MtMailUtil();
							var title = this.getSetting().faq_inquiry_title;
							title = str_replace("{SYSTEM}", this.O_group.getGroupSystemname(mail[0].groupid), title);
							title += "(" + id + ")";
							var message = file_get_contents(this.getSetting().KCS_DIR + "/conf_sync/mail_template/res_shop_inquiry.txt");

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

							O_mail.send(mail[0].to, message, Shop[0].to, title, Shop[0].to_name, mail[0].to_name);
						}
				}

				this.setFinishFlag();
				H_mng_str = {
					shopid: O_sess.shopid,
					groupid: O_sess.groupid,
					memid: O_sess.memid,
					name: O_sess.personname,
					postcode: O_sess.postcode,
					comment1: "ID:" + O_sess.memid,
					comment2: "\u304A\u554F\u3044\u5408\u308F\u305B" + id + "\u3078\u8FD4\u4FE1",
					kind: "FAQ",
					type: "\u304A\u554F\u3044\u5408\u308F\u305B",
					joker_flag: 0
				};
				this.getOut().writeShopMnglog(H_mng_str);
			}
		}
	}

	setListMode() {
		this.H_param.groupid = this.O_view.gSess().groupid;
		this.H_param.shopid = this.O_view.gSess().shopid;
	}

	__destruct() {
		super.__destruct();
	}

};