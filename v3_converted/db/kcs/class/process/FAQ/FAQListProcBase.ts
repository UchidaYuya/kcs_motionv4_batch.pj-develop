//
//お問い合わせ履歴一覧
//
//更新履歴：<br>
//2008/09/30 石崎 作成
//
//@uses FAQBaceProc
//@uses MakePageLink
//@uses MtSession
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//require_once("process/ProcessBaseHtml.php");
//
//お問い合わせ履歴一覧
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/09/30
//

require("process/FAQ/FAQBaseProc.php");

require("view/MakePageLink.php");

require("MtSession.php");

//
//O_model
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
//setListMode
//
//@author ishizaki
//@since 2008/10/16
//
//@abstract
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
class FAQListProcBase extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("menu");
	}

	selfProcessBody(H_param: {} | any[] = Array()) //検索条件を継承先に設定してもらう
	{
		this.setListMode();
		var O_sess = MtSession.singleton();
		var nowpage = O_sess.getSelf("p");

		if (true == is_null(nowpage)) {
			nowpage = 1;
		}

		this.H_param.nowpage = nowpage;
		var H_inquiry = this.O_model.getInquiryList(this.H_param);
		var max_count = H_inquiry.max_count;
		nowpage = H_inquiry.nowpage;
		delete H_inquiry.max_count;
		delete H_inquiry.nowpage;
		var O_page = new MakePageLink();
		var pagelink = O_page.makePageLinkHTML(max_count, 30, nowpage);
		this.O_view.setAssign("pagelink", pagelink);
		this.O_view.makeFormElements();

		if (false === H_inquiry) {
			this.O_view.setAssign("err_str", "FAQ\u3001\u304A\u554F\u3044\u5408\u308F\u305B\u304C\u4E00\u4EF6\u3082\u767B\u9332\u3055\u308C\u3066\u304A\u308A\u307E\u305B\u3093\u3002");
			this.O_view.displayHTML();
			throw die(0);
		}

		this.O_view.setAssign("max_count", max_count);
		this.O_view.setAssign("H_list", H_inquiry);
	}

	__destruct() {
		super.__destruct();
	}

};