//
//添付ファイルのダウンロード
//
//更新履歴：<br>
//2008/10/23 石崎 作成
//
//@uses FAQBaseProc
//@uses FAQModel
//@uses GetAttachmentView
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/10/23
//@filesource
//
//
//error_reporting(E_ALL|E_STRICT);
//
//添付ファイルのダウンロード
//
//@package FAQ
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/10/23
//

require("process/FAQ/FAQBaseProc.php");

require("model/FAQ/FAQModel.php");

require("view/FAQ/GetAttachmentView.php");

//
//O_model
//
//@var mixed
//@access private
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
class GetFAQAttachmentProc extends FAQBaseProc {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	getView() {
		if (2 == this.H_param.authtype) {
			this.H_param.site = ViewSmarty.SITE_SHOP;
		} else if (3 == this.H_param.authtype) {
			this.H_param.site = ViewSmarty.SITE_ADMIN;
		}

		this.O_view = new GetAttachmentView(this.H_param);
	}

	getModel() {
		this.O_model = new FAQModel();
	}

	addNewClass() {}

	selfProcessBody(H_param: {} | any[] = Array()) {
		if (1 === this.H_param.authtype) {
			var H_attachment = this.O_model.getFAQAttchment(this.O_view.ID, this.O_view.gSess().pactid, this.O_view.gSess().groupid);

			if (1 > H_attachment.length || true == is_null(H_attachment.attachment) || true == is_null(H_attachment.attachmentname)) {
				this.getOut().errorOut(8, "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u60C5\u5831\u304C\u53D6\u5F97\u51FA\u6765\u306A\u3044");
				throw die(0);
			}
		} else if (2 === this.H_param.authtype) {
			H_attachment = this.O_model.getShopFAQAttchment(this.O_view.ID, this.O_view.gSess().groupid);

			if (1 > H_attachment.length || true == is_null(H_attachment.attachment) || true == is_null(H_attachment.attachmentname)) {
				this.getOut().errorOut(8, "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u60C5\u5831\u304C\u53D6\u5F97\u51FA\u6765\u306A\u3044");
				throw die(0);
			}
		} else if (3 === this.H_param.authtype) {
			H_attachment = this.O_model.getAdminFAQAttchment(this.O_view.ID, this.O_view.gSess().admin_groupid);

			if (1 > H_attachment.length || true == is_null(H_attachment.attachment) || true == is_null(H_attachment.attachmentname)) {
				this.getOut().errorOut(8, "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u60C5\u5831\u304C\u53D6\u5F97\u51FA\u6765\u306A\u3044");
				throw die(0);
			}
		} else {
			this.getOut().errorOut(8, "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u60C5\u5831\u304C\u53D6\u5F97\u51FA\u6765\u306A\u3044");
			throw die(0);
		}

		this.O_view.setAssign("attachment", H_attachment.attachment);
		this.O_view.setAssign("attachmentname", H_attachment.attachmentname);
	}

	__destruct() {
		super.__destruct();
	}

};