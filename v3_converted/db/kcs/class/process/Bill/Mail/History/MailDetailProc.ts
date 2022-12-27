//error_reporting(E_ALL|E_STRICT);
//
//AddBillAddProc
//メール送信
//@uses ProcessBaseHtml
//@package
//@author date
//@since 2016/10/11
//

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("model/Bill/Mail/History/MailDetailModel.php");

require("view/Bill/Mail/History/MailDetailView.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access public
//@return void
//
//
//get_View
//viewオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@access protected
//@return void
//
//
//get_Model
//modelオブジェクトの取得
//@author date
//@since 2015/11/02
//
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//doExecute
//
//@author date
//@since 2015/11/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class MailDetailProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new MailHistoryMenuView();
	}

	get_Model(H_g_sess) {
		return new MailHistoryMenuModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//define.iniを読み込む
	//$H_define_ini = parse_ini_file(KCS_DIR."/conf_sync/define.ini", true);
	//権限一覧取得
	//権限チェック
	//メールの内容を取得
	//メール送信対象
	//メール送信対象の全体数ぽよ
	//一覧表示用のフォームの作成
	//メールフォームのデフォ値
	//Smartyによる表示
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var A_auth = O_model.get_AuthIni();

		if (-1 !== A_auth.indexOf("fnc_bill_mail") == false) {
			this.errorOut(6, "", false);
		}

		var H_sess = O_view.getLocalSession();
		var history = O_model.getHistory(H_g_sess.pactid, H_sess.SELF.history_id);
		var to_list = O_model.getToList(H_sess.SELF.history_id, history.type, H_sess.SELF.sort, H_sess.SELF.offset, H_sess.SELF.limit);
		var to_list_count = O_model.getToListCount(H_sess.SELF.history_id);
		O_view.makeListForm(H_sess.SELF.limit);
		var H_default = {
			mail: history.mail,
			name: history.username,
			subject: history.subject,
			comment: history.comment,
			test_mail: history.test_mail,
			group_flag: history.group_flag ? "on" : "off"
		};
		O_view.makeMailForm(H_default);
		O_view.displaySmarty(history, to_list, to_list_count, history.mail_target);
	}

	__destruct() {
		super.__destruct();
	}

};