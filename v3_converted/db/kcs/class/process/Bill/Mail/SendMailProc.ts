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

require("model/Bill/Mail/SendMailModel.php");

require("view/Bill/Mail/SendMailView.php");

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
//getList
//送信対象者一覧の取得
//@author web
//@since 2016/10/28
//
//@param mixed $O_model
//@param mixed $H_sess
//@param mixed $all_flag
//@access private
//@return void
//
//
//getListCount
//一覧の全体数を取得する
//@author web
//@since 2016/10/28
//
//@param mixed $O_model
//@param mixed $H_sess
//@access private
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
class SendMailProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new SendMailView();
	}

	get_Model(H_g_sess) {
		return new SendMailModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//define.iniを読み込む
	//$H_define_ini = parse_ini_file(KCS_DIR."/conf_sync/define.ini", true);
	//権限一覧取得
	//権限チェック
	//-----------------------------------------------------------------------------------
	//フォームの登録を行う
	//-----------------------------------------------------------------------------------
	//-----------------------------------------------------------------------------------
	//フォームの項目チェックと、DBの更新について
	//-----------------------------------------------------------------------------------
	//メール送信対象の一覧の取得ぽよ
	//メール送信対象一覧の全体数ぽよ
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
		O_view.makeMailForm(H_sess.SELF.post);
		O_view.makeListForm(H_sess.SELF.limit);

		if (O_view.validate() == true) {
			if (H_sess.SELF.post.submit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.SELF.post.submit == O_view.RecName) //CSRF
				//メール送信対象の一覧取得
				//グループフラグのオンオフをbool型で取得
				//メールの種別取得
				//メールの送信先について
				//cc_flagがあるなら設定
				//DB更新成功
				{
					var O_unique = MtUniqueString.singleton();
					O_unique.validate(H_sess.SELF.post.csrfid);
					var data = this.getList(O_model, H_sess, true);
					var group_flag = H_sess.SELF.post.group_flag == "on";
					var mail_type_no = this.getMailType(H_sess.SELF.post_prev.mail_type);
					var mail_target = undefined;

					if (undefined !== H_sess.SELF.post_prev.mail_target) {
						switch (H_sess.SELF.post_prev.mail_target) {
							case "applicant":
								mail_target = 1;
								break;

							case "authorizer":
								mail_target = 2;
								break;
						}
					}

					var cc_flag = false;

					if (undefined !== H_sess.SELF.post.cc_flag) {
						switch (H_sess.SELF.post.cc_flag) {
							case "on":
								cc_flag = true;
								break;

							case "off":
								cc_flag = false;
								break;
						}
					} else if (H_sess.SELF.post_prev.mail_type == "order_history" && mail_target === 1) {
						cc_flag = true;
					} else if (undefined !== H_sess.SELF.post.cc_flag) //cc_flagがonであるならtrueとする
						{
							if (H_sess.SELF.post.cc_flag == "on") {
								cc_flag = true;
							}
						}

					var A_sql = O_model.makeSQL(mail_type_no, H_sess.SELF.post.name, H_sess.SELF.post.subject, H_sess.SELF.post.mail, H_sess.SELF.post.comment, group_flag, H_sess.SELF.post.test_mail, data, mail_target, cc_flag);

					if (O_model.execDB(A_sql) == true) //完了画面
						{
							O_view.endView();
							throw die();
						} else //エラー画面
						{
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "/Menu/menu.php");
						}
				}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		data = this.getList(O_model, H_sess, false);
		var data_cnt = this.getListCount(O_model, H_sess);
		O_view.displaySmarty(data, data_cnt);
	}

	getMailType(mail_type) {
		switch (mail_type) {
			case "bill":
				return 2;

			case "management":
				return 1;

			case "order_history":
				return 3;
		}

		return undefined;
	}

	getList(O_model, H_sess, all_flag) //全て取得フラグ
	{
		var offset = 1;
		var limit = 0;

		if (!all_flag) //指定されたオフセットで表示
			//指定された件数で表示
			{
				offset = H_sess.SELF.offset;
				limit = H_sess.SELF.limit;
			}

		switch (H_sess.SELF.post_prev.mail_type) {
			case "bill":
			case "management":
				var res = O_model.getSendListForTel(H_sess.SELF.post_prev.mail_type, H_sess.SELF.cym, H_sess.SELF.postid, H_sess.SELF.tel_list, H_sess.SELF.sort, offset, limit);
				break;

			case "order_history":
				res = O_model.getSendListForOrder(H_sess.SELF.order_list, H_sess.SELF.post_prev.mail_target, H_sess.SELF.sort, offset, limit);
				break;
		}

		return res;
	}

	getListCount(O_model, H_sess) //一覧の取得
	{
		switch (H_sess.SELF.post_prev.mail_type) {
			case "bill":
			case "management":
				var cnt = O_model.getSendListForTelCount(H_sess.SELF.post_prev.mail_type, H_sess.SELF.cym, H_sess.SELF.postid, H_sess.SELF.tel_list);
				break;

			case "order_history":
				cnt = O_model.getSendListCountForOrder(H_sess.SELF.order_list, H_sess.SELF.post_prev.mail_target);
				break;
		}

		return cnt;
	}

	__destruct() {
		super.__destruct();
	}

};