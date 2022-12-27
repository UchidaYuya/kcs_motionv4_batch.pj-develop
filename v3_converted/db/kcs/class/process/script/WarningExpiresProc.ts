//
//販売店お客様情報
//
//更新履歴：<br>
//2008/08/20 石崎公久 作成
//
//@package Shop
//@subpackage Process
//@filesource
//@uses MtScriptAmbient
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/20
//
//
//error_reporting(E_ALL|E_STRICT);
//
//販売店お客様情報
//
//@package Shop
//@subpackage Process
//@uses MtScriptAmbient
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//

require("process/ProcessBaseBatch.php");

require("model/script/WarningExpiresModel.php");

require("view/script/WarningExpiresView.php");

require("MtScriptAmbient.php");

require("MtSetting.php");

require("MtMailUtil.php");

//
//Viewオブジェクト
//
//@var TweakCalcPointView
//@access protected
//
//
//Modelオブジェクト
//
//@var TweakCalcPointModel
//@access protected
//
//
//メール
//
//@var mixed
//@access protected
//
//
//O_Set
//
//@var mixed
//@access protected
//
//
//実行中のスクリプト固有のログディレクトリ
//
//@var string
//@access protected
//
//
//コンストラクター
//
//必要オブジェクトをメンバーに確保
//
//@author ishizaki
//@since 2008/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//1.固有ログディレクトリの取得
//2.スクリプトロック
//3.条件に期限切れ間近OR切れている会社部署の一覧を取得
//4.担当のメールアドレスに、証明書期限の情報をまとめる
//
//@author ishizaki
//@since 2008/03/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class WarningExpiresProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //view作成
	//model作成
	//別ドメイン対応 20091109miya
	{
		super(H_param);
		this.O_View = new WarningExpiresView();
		this.O_Model = new WarningExpiresModel();
		this.O_Mail = new MtMailUtil();
		this.O_Set = MtSetting.singleton();
		this.O_Set.loadConfig("group");
	}

	doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//条件に期限切れ間近OR切れている会社部署の一覧を取得
	//メッセージ格納ハッシュ
	//ショップの代表メールアドレス宛に、メッセージをまとめる
	//メール送信
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		var H_post = this.O_Model.getWarningExpireCorpList();
		var H_warning = Array();
		var count_post = H_post.length;

		if (0 == count_post) {
			this.unLockProcess(this.O_View.get_ScriptName());
			this.infoOut("\u5BFE\u8C61\u4EF6\u6570\u304C 0\u4EF6\u306E\u305F\u3081\u3001\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059\n");
			throw die(0);
		} else {
			this.infoOut("\u5BFE\u8C61\u4EF6\u6570 " + count_post + "\u4EF6 \u51E6\u7406\u3092\u958B\u59CB\u3057\u307E\u3059\n");
		}

		for (var i = 0; i < count_post; i++) {
			if (false == (undefined !== H_warning[H_post[i].mail])) //groupid追加 20091109miya
				{
					H_warning[H_post[i].mail].message = "\u8A3C\u660E\u66F8\u306E\u6709\u52B9\u671F\u9650\u304C\u4E00\u30F6\u6708\u4EE5\u5185\u3001\u307E\u305F\u306F\u671F\u9650\u5207\u308C\u3068\u306A\u308B\u4F01\u696D\u306E\u3054\u9023\u7D61\u3092\u3044\u305F\u3057\u307E\u3059\n";
					H_warning[H_post[i].mail].postmessage = "";
					H_warning[H_post[i].mail].count = 0;
					H_warning[H_post[i].mail].groupid = H_post[i].groupid;
				}

			H_warning[H_post[i].mail].postmessage += H_post[i].compname + " " + H_post[i].postname + "\n";
			var A_date = H_post[i].signeddate.split("-");
			H_warning[H_post[i].mail].postmessage += "\u6709\u52B9\u671F\u9650\uFF1A" + A_date[0] + "\u5E74 " + A_date[1] + "\u6708 " + A_date[2] + "\u65E5" + "\n\n";
			H_warning[H_post[i].mail].count++;
		}

		for (var mail in H_warning) //別ドメイン対応 20091109miya
		{
			var H_value = H_warning[mail];
			var message = H_value.message;
			message += "\u5BFE\u8C61\u3068\u306A\u308B\u4F01\u696D\u306F\u4EE5\u4E0B\u306E " + H_value.count + "\u4EF6\u3067\u3059\n\n";
			message += H_value.postmessage;
			this.infoOut(mail + " \u3042\u3066\u306B\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\n");
			this.infoOut("\u5BFE\u8C61\u4F01\u696D " + H_value.count + "\u4EF6\n");
			this.infoOut(message);

			if (true == this.O_Set.existsKey("systemname" + H_value.groupid)) {
				var title = this.O_Set["systemname" + H_value.groupid] + " \u8A3C\u660E\u66F8\u671F\u9650";
			} else {
				title = "KCS Motion \u8A3C\u660E\u66F8\u671F\u9650";
			}

			if (true == this.O_Set.existsKey("mail_def_from_" + H_value.groupid)) {
				var from = this.O_Set["mail_def_from_" + H_value.groupid];
			} else {
				from = this.O_Set.mail_error_from;
			}

			if (true == this.O_Set.existsKey("mail_def_from_name_" + H_value.groupid)) {
				var from_name = this.O_Set["mail_def_from_name_" + H_value.groupid];
			} else {
				from_name = this.O_Set.mail_error_from_name;
			}

			if ("KCSMotion V3 Mailer" == this.O_Set.mail_xmailer) {
				title += "\uFF08V3\uFF09";
			}

			this.O_Mail.send(mail, message, from, title, from_name);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw die(0);
	}

	__destruct() {
		super.__destruct();
	}

};