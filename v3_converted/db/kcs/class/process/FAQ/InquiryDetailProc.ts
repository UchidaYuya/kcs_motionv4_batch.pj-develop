//
//お問い合わせの返信編集
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//
//@uses FAQBaseProc
//@uses UserFAQModel
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

require("model/FAQ/UserFAQModel.php");

require("view/FAQ/InquiryDetailView.php");

require("MtAuthority.php");

require("MtMailUtil.php");

require("model/GroupModel.php");

//
//O_group
//
//@var mixed
//@access private
//
//
//O_auth
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
class InquiryDetailProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) //別ドメイン対応 20091110miya
	{
		super(H_param);
		this.O_group = new GroupModel();
		this.getSetting().loadConfig("group");
	}

	getView() {
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"list.php": "\u304A\u554F\u3044\u5408\u308F\u305B\u5C65\u6B74",
			"": "\u304A\u554F\u3044\u5408\u308F\u305B\u8FD4\u4FE1"
		};
		this.O_view = new InquiryDetailView(this.H_param);
	}

	getModel() {
		this.O_model = new UserFAQModel();
	}

	addNewClass() {
		this.O_auth = MtAuthority.singleton(this.O_view.gSess().pactid);
	}

	selfProcessBody() //お問い合わせIDの取得
	//検索条件を継承先に設定してもらう
	//お問い合わせの詳細を取得
	{
		var id = this.O_view.getID();
		this.setListMode();
		var H_InquiryDetail = this.O_model.getInquiryDetail(id, this.H_param);

		if (1 > H_InquiryDetail.length) {
			this.O_view.setAssign("err_str", "\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002");
		} else //投稿者の名前がnull（ユーザ削除済み）
			{
				if (is_null(H_InquiryDetail[0].username)) {
					this.O_view.setAssign("userdeleted", true);
				}

				this.O_view.setAssign("InquiryDetail", H_InquiryDetail);
				this.O_view.setAssign("inquirystatus", H_InquiryDetail[0].inquirystatus);
				var H_Post = this.O_view.gSess().getSelf("POST");
				var O_gs = this.O_view.gSess();

				if (false === this.O_view.getSubmitFlag()) {
					this.O_view.makeFormElements();
				} else {
					require("MtUniqueString.php");

					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_Post.csrfid);
					var res = this.O_model.addInquiry(id, H_Post, O_gs.pactid, O_gs.userid, O_gs.groupid);

					if (true === res) //メール送信リストの取得
						//A_fncに含まれている区分からならショップにもメールを送る
						//メッセージ
						//別ドメイン対応 20091110miya
						//管理者宛
						//ショップ宛
						{
							var O_mail = new MtMailUtil();
							var A_admin = this.O_model.getAdminMail(O_gs.groupid);
							var A_fnc = this.O_model.returnShopFnc();
							var nowfnc = this.O_model.returnFncid(id);
							var A_tmp = this.O_model.getShopMail(O_gs.postid, nowfnc);

							if (true === (-1 !== A_fnc.indexOf(nowfnc)) && 0 != nowfnc && 120 != nowfnc) {
								this.getSetting().loadConfig("H_fnc_car");
								var title = this.getSetting().faq_new_inquiry_title_order;
								title = str_replace("{TEMP}", this.getSetting().H_fnc_car_name[nowfnc], title);
							} else {
								title = this.getSetting().faq_new_inquiry_title;
							}

							title = str_replace("{SYSTEM}", this.O_group.getGroupSystemname(O_gs.groupid), title);
							title += "(" + id + ")";
							var message = file_get_contents(this.getSetting().KCS_DIR + "/conf_sync/mail_template/res_inquiry.txt");

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
	}

	setListMode() {
		this.H_param.groupid = this.O_view.gSess().groupid;
		this.H_param.pactid = this.O_view.gSess().pactid;
		this.H_param.postid = this.O_view.gSess().postid;
		this.H_param.userid = this.O_view.gSess().userid;
		this.H_param.secondroot = this.O_auth.chkPactFuncIni("fnc_not_view_root");

		if (true == this.H_param.secondroot) //$H_param["rootpostid"] = $this->O_post->
			{}

		this.H_param.su = this.O_view.gSess().su;
	}

	__destruct() {
		super.__destruct();
	}

};