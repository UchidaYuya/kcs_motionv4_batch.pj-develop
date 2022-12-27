//error_reporting(E_ALL|E_STRICT);
//
//AddBillMasterProc
//マスタ一覧の表示
//@uses ProcessBaseHtml
//@package
//@author web
//@since 2015/11/11
//
header("Contet-Type: application/json; charset=UTF-8");

require("MtUniqueString.php");

require("process/ProcessBaseHtml.php");

require("model/script/SendBillMailModel.php");

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
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class SendTestMailProc extends ProcessBaseHtml {
	static PUB = "/Bill";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	get_View() {
		return new SendMailView();
	}

	get_Model(H_g_sess) {
		return new SendBillMailModel(this.get_DB(), H_g_sess);
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//セッション情報取得（グローバル）
	//modelオブジェクトの生成
	//ログインチェック
	//// 権限一覧取得
	//		$A_auth = $O_model->get_AuthIni();
	//		//	権限チェック
	//		if( in_array( "fnc_addbill_input", $A_auth ) == false ){
	//			$this->errorOut( 6, "", false );
	//		}
	//セッション情報取得（ローカル）
	//メール送信する。メールはカンマで区切られている
	//テストデータだょ
	//送信するよ
	//echo "true";
	//echo json_encode($res);
	//$test = json_encode($res);
	//var_dump( json_decode($test) );
	{
		var O_view = this.get_View();
		var H_g_sess = O_view.getGlobalSession();
		var O_model = this.get_Model(H_g_sess);
		O_view.startCheck();
		var H_sess = O_view.getLocalSession();

		if (strpos(_SERVER.HTTP_REFERER, "/Bill/Mail/SendOrderHistoryMail.php") !== false) {
			var mail_data = _SESSION["/Bill/Mail/SendOrderHistoryMail.php"].post;
		} else {
			mail_data = _SESSION["/Bill/Mail/SendMail.php"].post;
		}

		var to_mail = mail_data.test_mail.split(",");
		echo("\u4EE5\u4E0B\u306E\u5B9B\u5148\u306B\u30E1\u30FC\u30EB\u3057\u307E\u3057\u305F\u3002\n");
		var to_data = {
			postname: "(\u90E8\u7F72\u540D)",
			orderid: "(\u6CE8\u6587\u756A\u53F7)",
			telno: "(\u96FB\u8A71\u756A\u53F7)",
			telno_view: "(\u96FB\u8A71\u756A\u53F7)",
			username: "(\u4F7F\u7528\u8005)"
		};

		for (var mail of Object.values(to_mail)) //メールアドレスと名前を指定
		//送信先と送信時刻を表示しておく
		//送信ぽよ
		{
			to_data.mail = mail;
			echo(mail + "(" + date("Y-m-d H:i:d") + ")\n");
			O_model.sendMail(mail_data.comment, mail_data.mail, mail_data.subject, mail_data.name, false, to_data);
		}
	}

	__destruct() {
		super.__destruct();
	}

};