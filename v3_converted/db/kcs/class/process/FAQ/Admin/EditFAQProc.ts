//
//お問い合わせの返信
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//
//@uses FAQBaseProc
//@uses AdminFAQModel
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

require("model/FAQ/Admin/AdminFAQModel.php");

require("view/FAQ/Admin/EditFAQView.php");

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
class EditFAQProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_ADMIN;
		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"list.php": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7",
			"": "FAQ\u7DE8\u96C6"
		};
		this.O_view = new EditFAQView(this.H_param);
	}

	getModel() {
		this.O_model = new AdminFAQModel();
	}

	addNewClass() {}

	selfProcessBody() //区分の作成
	{
		var faqid = this.O_view.gSess().getSelf("faqid");
		var mode = this.O_view.getMode();
		this.O_view.setAssign("H_car", H_car);
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
					H_fnc[key] = "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\uFF08" + value.fncname + "\uFF09";
					break;

				default:
					H_fnc[key] = value.fncname;
					break;
			}
		}

		H_fnc["0"] = "\u305D\u306E\u4ED6";
		this.O_view.setAssign("H_car", H_fnc);
		var H_Post = this.O_view.gSess().getSelf("POST");
		var H_Files = this.O_view.gSess().getSelf("FILES");

		if (false != H_Files) {
			this.O_view.setAssign("files", H_Files);
			H_Post.attachment = this.O_view.gSess().getSelf("attachmentupfile");
			H_Post.attachmentname = H_Files.attachment.name;
		}

		var O_gs = MtSession.singleton();

		if (true === this.O_view.getSubmitFlag()) {
			H_Post.faqid = faqid;
			this.O_model.updateFAQAdmin(H_Post, O_gs.admin_shopid, O_gs.admin_groupid);
			var H_data = {
				shopid: O_gs.admin_shopid,
				shopname: O_gs.admin_name,
				username: O_gs.admin_personname,
				kind: "FAQ",
				type: "FAQ\u7DE8\u96C6",
				comment: "faqid:" + faqid + "\u3092\u7DE8\u96C6"
			};
			this.getOut().writeAdminMnglog(H_data);
			this.setFinishFlag();
			return true;
		}

		if (true == is_null(mode)) //問い合わせIDがあれば、その情報を取得
			{
				if (false == is_null(faqid) && false != faqid) //0件以上
					{
						var H_faq = this.O_model.getFAQDetail(faqid, Array());
						var faqcount = H_faq.length;

						if (0 < faqcount) {
							H_faq.title = H_faq.faqname;
							this.O_view.setAssign("formdefaults", H_faq);
						} else {
							this.getOut().errorOut(0, "faqid\u304C\u53D6\u5F97\u3067\u6765\u307E\u305B\u3093\u3067\u3057\u305F");
							throw die(0);
						}
					}

				this.O_view.makeFormElements();
			} else if ("selectpact" == mode || "selectpactconf" == mode) {
			var H_Pactlist = this.O_model.getPactHash(this.O_view.gSess().admin_groupid);
			H_faq = this.O_model.getFAQDetail(faqid, Array());

			if (true == H_faq.defaultflg && (true == (undefined !== H_Post.publictype) && 0 == H_Post.publictype)) {
				this.O_view.setAssign("defaultflg", 1);
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