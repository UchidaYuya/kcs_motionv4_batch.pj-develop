//
//お問い合わせの返信
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//
//@uses FAQBaseProc
//@uses ShopFAQModel
//@uses InquiryDetailView
//@uses MtAuthority
//@uses PactModel
//@users MtSession
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

require("view/FAQ/Shop/MakeFAQView.php");

require("MtAuthority.php");

require("model/PactModel.php");

require("MtSession.php");

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
//setListMode
//
//@author ishizaki
//@since 2008/10/23
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
class MakeFAQProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_SHOP;
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"list.php": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7",
			"": "FAQ\u4F5C\u6210"
		};
		this.O_view = new MakeFAQView(this.H_param);
	}

	getModel() {
		this.O_model = new ShopFAQModel();
	}

	addNewClass() {}

	selfProcessBody() {
		var inquiryid = this.O_view.getInquiryID();
		var mode = this.O_view.getMode();
		var A_auth = this.O_model.getPactAuthUnchainPactid();
		var A_car = this.O_model.getShopCarrierTb(this.O_view.gSess().shopid);
		var H_car = this.O_model.getOrderable(A_auth, A_car, 2);
		var H_tmp = H_car;
		H_car = {
			"120": "\u3054\u6CE8\u6587"
		};

		for (var fncid in H_tmp) {
			var fncname = H_tmp[fncid];
			H_car[fncid] = fncname;
		}

		H_car["0"] = "\u305D\u306E\u4ED6";
		this.O_view.setAssign("H_car", H_car);
		var H_Post = this.O_view.gSess().getSelf("POST");
		var H_Files = this.O_view.gSess().getSelf("FILES");

		if (false != H_Files) {
			this.O_view.setAssign("files", H_Files);
			H_Post.attachment = this.O_view.gSess().getSelf("attachmentupfile");
			H_Post.attachmentname = H_Files.attachment.name;
		}

		var O_gs = MtSession.singleton();

		if (true === this.O_view.getSubmitFlag()) {
			this.O_model.addNewFAQ(H_Post, O_gs.shopid, O_gs.memid, O_gs.groupid, O_gs.name, O_gs.loginname);
			this.setFinishFlag();
			var H_mng_str = {
				shopid: O_gs.shopid,
				groupid: O_gs.groupid,
				memid: O_gs.memid,
				name: O_gs.personname,
				postcode: O_gs.postcode,
				comment1: "ID:" + O_gs.memid,
				comment2: "\u65B0\u898FFAQ\u306E\u4F5C\u6210",
				kind: "FAQ",
				type: "\u304A\u554F\u3044\u5408\u308F\u305B",
				joker_flag: 0
			};
			this.getOut().writeShopMnglog(H_mng_str);
			return true;
		}

		if (true == is_null(mode)) //問い合わせIDがあれば、その情報を取得
			{
				if (false == is_null(inquiryid) && false != inquiryid) //0件以上
					{
						var H_inquiry = this.O_model.getInquiryDetail(inquiryid);
						var Inquirycount = H_inquiry.length;

						if (H_inquiry.length > 0) {
							var H_faq_tmplate = Array();
							H_faq_tmplate.title = H_inquiry[0].inquiryname;
							H_faq_tmplate.fnc = this.O_model.getFncFromInquiry(inquiryid);

							for (var tmp = 0; tmp < Inquirycount; tmp++) {
								if (1 == H_inquiry[tmp].authtype) {
									if (false == (undefined !== H_faq_tmplate.question)) {
										H_faq_tmplate.question = H_inquiry[tmp].contents;
									} else {
										H_faq_tmplate.question += "\n" + H_inquiry[tmp].contents;
									}
								} else {
									if (false == (undefined !== H_faq_tmplate.answer)) {
										H_faq_tmplate.answer = H_inquiry[tmp].contents;
									} else {
										H_faq_tmplate.answer += "\n" + H_inquiry[tmp].contents;
									}
								}
							}

							this.O_view.setAssign("formdefaults", H_faq_tmplate);
						}
					}

				this.O_view.setAssign("selectedfncid", this.O_view.gSess().getPub("/FAQ"));
				this.O_view.makeFormElements();
			} else if ("selectpact" == mode || "selectpactconf" == mode) {
			var O_pactmodel = new PactModel();
			var carid = this.getSetting().H_fnc_car[H_Post.fnc];

			if (true == is_null(carid) && "0" !== H_Post.fnc && "120" !== H_Post.fnc) {
				this.getOut().errorOut(0, "\u8CA9\u58F2\u5E97\u306A\u306E\u306B\u3001\u6CE8\u6587\u6A29\u9650\u3001\u3082\u3057\u304F\u306F\u305D\u306E\u4ED6\u4EE5\u5916\u306E\u533A\u5206\u304C\u6E21\u3055\u308C\u305F");
				throw die(0);
			}

			if (0 === H_Post.fnc) {
				var H_Pactlist = O_pactmodel.getPactHash("assoc", this.O_view.gSess().shopid);
			} else {
				H_Pactlist = O_pactmodel.getPactHash("assoc", this.O_view.gSess().shopid, carid);
			}

			if (false == is_null(inquiryid)) {
				this.O_view.setAssign("Inquiryparam", this.O_model.getInquiryParam(inquiryid));
			}

			this.O_view.setAssign("H_Post", H_Post);
			this.O_view.setAssign("mode", mode);
			this.O_view.setAssign("H_Pactlist", H_Pactlist);
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