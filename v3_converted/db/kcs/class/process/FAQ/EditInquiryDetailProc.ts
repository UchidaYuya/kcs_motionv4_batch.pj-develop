//
//お問い合わせの編集
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//
//@uses FAQBaseProc
//@uses UserFAQModel
//@uses InquiryDetailView
//@uses MtAuthority
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

require("view/FAQ/EditInquiryDetailView.php");

require("MtAuthority.php");

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
class EditInquiryDetailProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (2 == this.H_param.authtype) {
			this.H_param.site = ViewBaseHtml.SITE_SHOP;
		} else if (3 == this.H_param.authtype) {
			this.H_param.site = ViewBaseHtml.SITE_ADMIN;
		}

		this.H_param.navi = {
			"menu.php": "FAQ\u4E00\u89A7",
			"list.php": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7",
			"detail.php": "\u304A\u554F\u3044\u5408\u308F\u305B\u8FD4\u4FE1",
			"": "\u304A\u554F\u3044\u5408\u308F\u305B\u7DE8\u96C6"
		};
		this.O_view = new EditInquiryDetailView(this.H_param);
	}

	getModel() {
		this.O_model = new UserFAQModel();
	}

	addNewClass() {
		if (1 == this.H_param.authtype) {
			this.O_auth = MtAuthority.singleton(this.O_view.gSess().pactid);
		}
	}

	selfProcessBody(H_param) //お問い合わせIDの取得
	//検索条件を継承先に設定してもらう
	//対象となるお問い合わせの１レコードを取得
	{
		var detailid = this.O_view.getDetailID();
		H_param = this.setListMode(H_param);
		var H_InquiryDetailLine = this.O_model.getInquiryDetailLine(detailid, H_param);

		if (1 > H_InquiryDetailLine.length || false == H_InquiryDetailLine) {
			this.O_view.setAssign("err_str", "\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002");
		} else {
			var H_Post = this.O_view.gSess().getSelf("POST");
			var H_Files = this.O_view.gSess().getSelf("FILES");

			if (false != H_Files) {
				this.O_view.setAssign("files", H_Files);
				H_Post.attachment = this.O_view.gSess().getSelf("attachmentupfile");
				H_Post.attachmentname = H_Files.attachment.name;
			}

			if (detailid != H_Post.detailid) {
				this.O_view.gSess().setSelf("POST", undefined);
				delete H_Post;
			}

			var O_gs = this.O_view.gSess();
			this.O_view.setAssign("detailid", detailid);

			if (true === this.O_view.getSubmitFlag()) {
				require("MtUniqueString.php");

				var O_unique = MtUniqueString.singleton();
				O_unique.validate(H_Post.csrfid);
				var res = this.O_model.editInquiry(detailid, H_Post);

				if (true === res) {
					this.setFinishFlag();
				} else {
					this.getOut().errorOut(19, "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
				}
			} else {
				this.O_view.setAssign("formdefaults", H_InquiryDetailLine);
				this.O_view.makeFormElements();
			}
		}
	}

	setListMode(H_param) {
		H_param.groupid = this.O_view.gSess().groupid;

		if (1 == this.H_param.authtype) {
			H_param.pactid = this.O_view.gSess().pactid;
			H_param.postid = this.O_view.gSess().postid;
			H_param.userid = this.O_view.gSess().userid;
			H_param.secondroot = this.O_auth.chkPactFuncIni("fnc_not_view_root");
			H_param.su = this.O_view.gSess().su;
		}

		return H_param;
	}

	__destruct() {
		super.__destruct();
	}

};