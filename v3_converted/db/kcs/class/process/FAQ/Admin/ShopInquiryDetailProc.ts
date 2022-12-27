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
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_auth = undefined;
		this.H_car = Array();
	}

	getView() {
		this.H_param.site = ViewBaseHtml.SITE_ADMIN;
		this.H_param.navi = {
			"menu.php": "FAQ\u30FB\u304A\u554F\u3044\u5408\u308F\u305B\u4E00\u89A7",
			"": "\u304A\u554F\u3044\u5408\u308F\u305B\u8FD4\u4FE1"
		};
		this.O_view = new ShopInquiryDetailView(this.H_param);
	}

	getModel() {
		this.O_model = new ShopFAQModel();
	}

	addNewClass() {}

	selfProcessBody() //お問い合わせIDの取得
	//ユーザの所属する部署がこの販売店に対して注文の出来るキャリアの一覧を取得
	//検索条件を継承先に設定してもらう
	//お問い合わせの詳細を取得
	{
		var id = this.O_view.getID();
		var mode = this.O_view.getMode();

		if ("editfnc" == mode) {
			var O_sess = MtSession.singleton();
			var fnc = O_sess.getself("fnc");

			if (false !== fnc && undefined != fnc) {
				this.O_model.changeFnc(id, fnc);
			}

			delete fnc;
			O_sess.clearSessionKeySelf("fnc");
		} else if ("statusfnc" == mode) {
			O_sess = MtSession.singleton();
			var status = O_sess.getself("status");

			if (false != status && undefined != status) {
				this.O_model.changeStatus(id, status);
			}

			delete status;
			O_sess.clearSessionKeySelf("status");
		} else if ("publicfnc" == mode) {
			O_sess = MtSession.singleton();
			var publiclevel = O_sess.getself("publiclevel");

			if (false != publiclevel && undefined != publiclevel) {
				this.O_model.changePubliclevel(id, publiclevel);
			}

			delete publiclevel;
			O_sess.clearSessionKeySelf("publiclevel");
		}

		var H_inquiryParam = this.O_model.getInquiryParam(id);
		this.O_auth = MtAuthority.singleton(H_inquiryParam.pactid);
		this.O_view.setAssign("H_inquiryParam", H_inquiryParam);
		var A_car = this.O_model.getAbleCariaToMyShop(H_inquiryParam.pactid, H_inquiryParam.postid, this.O_view.gSess().shopid);
		var A_auth = this.O_auth.getPactFuncid();
		this.H_car = this.O_model.getOrderable(A_auth, A_car);
		this.H_car["0"] = {
			fncid: 0,
			fncname: "\u305D\u306E\u4ED6"
		};
		this.O_view.setAssign("H_car", this.H_car);
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
			} else {
				this.O_model.addInquiryFromShop(id, H_Post, O_gs.shopid, O_gs.memid, O_gs.groupid, O_gs.name, O_gs.loginname);
				this.setFinishFlag();
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