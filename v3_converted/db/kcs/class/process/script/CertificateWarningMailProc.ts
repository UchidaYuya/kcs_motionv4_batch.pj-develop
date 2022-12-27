//
//証明書期限切れ警告メール
//
//更新履歴：<br>
//2010/06/17 宮澤龍彦 作成
//
//@package CertificateWarningMail
//@subpackage Process
//@filesource
//@uses ProcessBaseBatch
//@uses CertificateWarningMailModel
//@uses CertificateWarningMailView
//@uses MtScriptAmbient
//@uses MtSetting
//@uses MtMailUtil
//@uses PostModel
//@uses GroupModel
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/06/17
//
//
//error_reporting(E_ALL|E_STRICT);
//
//証明書期限切れ警告メール
//
//@package CertificateWarningMail
//@subpackage Process
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/06/17
//

require("process/ProcessBaseBatch.php");

require("model/script/CertificateWarningMailModel.php");

require("view/script/CertificateWarningMailView.php");

require("MtScriptAmbient.php");

require("MtSetting.php");

require("MtMailUtil.php");

require("model/PostModel.php");

require("model/GroupModel.php");

//
//mail_dir
//
//@var mixed
//@access private
//
//
//H_mail
//
//@var mixed
//@access protected
//
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
//O_post
//
//@var mixed
//@access protected
//
//
//O_group
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
//@author miyazawa
//@since 2010/06/17
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author miyazawa
//@since 2010/06/17
//
//@param array $H_param
//@access protected
//@return void
//
//
//メンバーのメール情報にあるユーザに価格表お知らせメールを送信する為のファイルの生成
//
//@author ishizaki
//@since 2008/12/12
//
//@access private
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
class CertificateWarningMailProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //view作成
	//model作成
	//メールオブジェクト
	//セッティング
	//送信するメール情報
	//ポストモデル
	//メールファイルディレクトリ
	//グループオブジェクト
	{
		super(H_param);
		this.O_view = new CertificateWarningMailView();
		this.O_model = new CertificateWarningMailModel();
		this.O_mail = new MtMailUtil();
		this.O_set = MtSetting.singleton();
		this.H_mail = Array();
		this.O_post = new PostModel();
		this.mail_dir = this.O_set.write_mail_dir;
		this.O_group = new GroupModel();
	}

	doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//リスト取得
	//販売店ごとに配列に振り分け
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.set_Dirs(this.O_view.get_ScriptName());
		this.lockProcess(this.O_view.get_ScriptName());
		this.getOut().infoOut("\u671F\u9650\u307E\u3067\u4E00\u30F6\u6708\u3092\u5207\u3063\u3066\u3044\u308B\u8A3C\u660E\u66F8\u306E\u4E00\u89A7\u3092\u53D6\u5F97", false);
		var H_prsi = this.O_model.getPrsi();
		var nextmonth = date("Y-m-d", strtotime("+1 month"));
		var H_mail_shop = Array();

		if (true == Array.isArray(H_prsi) && 0 < H_prsi.length) //メールファイルの準備
			{
				for (var val of Object.values(H_prsi)) {
					if (false == (undefined !== H_mail_shop[val.shopid])) {
						H_mail_shop[val.shopid].mailtext = "\u4EE5\u4E0B\u306E\u304A\u5BA2\u69D8\u306E\u8A3C\u660E\u66F8\u306B\u6709\u52B9\u671F\u9650\u304C\u8FEB\u3063\u3066\u3044\u307E\u3059\u3002\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\n\n";
					}

					H_mail_shop[val.shopid].mailtext += val.compname + " " + val.postname + ": ";

					if (undefined != val.signeddate && strtotime(nextmonth) > strtotime(val.signeddate)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E00\u8A3C\u660E\u66F8(" + val.signeddate + ") ";
					}

					if (undefined != val.idv_signeddate_0 && strtotime(nextmonth) > strtotime(val.idv_signeddate_0)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(1)(" + val.idv_signeddate_0 + ") ";
					}

					if (undefined != val.idv_signeddate_1 && strtotime(nextmonth) > strtotime(val.idv_signeddate_1)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(2)(" + val.idv_signeddate_1 + ") ";
					}

					if (undefined != val.idv_signeddate_2 && strtotime(nextmonth) > strtotime(val.idv_signeddate_2)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(3)(" + val.idv_signeddate_2 + ") ";
					}

					if (undefined != val.idv_signeddate_3 && strtotime(nextmonth) > strtotime(val.idv_signeddate_3)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(4)(" + val.idv_signeddate_3 + ") ";
					}

					if (undefined != val.idv_signeddate_4 && strtotime(nextmonth) > strtotime(val.idv_signeddate_4)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(5)(" + val.idv_signeddate_4 + ") ";
					}

					if (undefined != val.idv_signeddate_5 && strtotime(nextmonth) > strtotime(val.idv_signeddate_5)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(6)(" + val.idv_signeddate_5 + ") ";
					}

					if (undefined != val.idv_signeddate_6 && strtotime(nextmonth) > strtotime(val.idv_signeddate_6)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(7)(" + val.idv_signeddate_6 + ") ";
					}

					if (undefined != val.idv_signeddate_7 && strtotime(nextmonth) > strtotime(val.idv_signeddate_7)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(8)(" + val.idv_signeddate_7 + ") ";
					}

					if (undefined != val.idv_signeddate_8 && strtotime(nextmonth) > strtotime(val.idv_signeddate_8)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(9)(" + val.idv_signeddate_8 + ") ";
					}

					if (undefined != val.idv_signeddate_9 && strtotime(nextmonth) > strtotime(val.idv_signeddate_9)) {
						H_mail_shop[val.shopid].mailtext += "\u7B2C\u4E8C\u8A3C\u660E\u66F8(10)(" + val.idv_signeddate_9 + ") ";
					}

					H_mail_shop[val.shopid].mailtext += "\n";
					H_mail_shop[val.shopid].postid = val.postid;
					H_mail_shop[val.shopid].shopname = val.shopname;
					H_mail_shop[val.shopid].groupid = val.groupid;
				}

				for (var shopid in H_mail_shop) //販売店ごとの宛先取得
				//データセット
				{
					var mailval = H_mail_shop[shopid];
					var A_addr = Array();
					A_addr = this.O_model.getShopAddress(shopid, mailval.postid);

					if (true == Array.isArray(A_addr) && 0 < A_addr.length) {
						this.H_mail[shopid].mailtext = mailval.mailtext;
						this.H_mail[shopid].to = join(",", A_addr);
						this.H_mail[shopid].to_name = mailval.shopname;
						this.H_mail[shopid].groupid = mailval.groupid;
						this.H_mail[shopid].type = "S";
					}
				}
			}

		if (0 < this.H_mail.length) {
			this.mailSendFlow();
		} else {
			this.getOut().infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u5BFE\u8C61\u30E6\u30FC\u30B6\u304C\u3044\u307E\u305B\u3093\u3002", false);
		}

		this.unLockProcess(this.O_view.get_ScriptName());
		this.set_ScriptEnd();
		throw die(0);
	}

	mailSendFlow() {
		this.getOut().infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u30D5\u30ED\u30FC", false);
		{
			let _tmp_0 = this.H_mail;

			for (var shopid in _tmp_0) //環境によってはnfsディレクトリ以下をメールファイルの置き場所とする
			//送信用元データファイルを生成
			{
				var value = _tmp_0[shopid];
				var H_temp = Array();
				H_temp.to = value.to;
				H_temp.to_name = value.to_name;
				H_temp.groupid = value.groupid;
				H_temp.groupname = this.O_group.getGroupName(value.groupid);
				H_temp.type = "S";

				if (false == file_exists(this.mail_dir)) {
					this.mail_dir = "/nfs/web" + this.mail_dir;
				}

				var mail_file = this.mail_dir + shopid + "_" + date("Ymdhis") + ".lst";
				this.getOut().infoOut(mail_file + "\u306E\u4F5C\u6210", false);
				var fp = fopen(mail_file, "x");
				var lock = flock(fp, LOCK_EX);
				fputs(fp, "<?php\n");
				fputs(fp, "$ml_list = '" + serialize([H_temp]) + "';\n");
				fputs(fp, "$title = '\u8A3C\u660E\u66F8\u671F\u9650\u5207\u308C\u306E\u304A\u77E5\u3089\u305B';\n");

				if (value.groupid <= 1) {
					fputs(fp, "$from = '" + this.O_set.mail_def_from + "';\n");
					fputs(fp, "$from_name = '" + this.O_set.mail_def_from_name + "';\n");
				} else {
					fputs(fp, "$from_name = '" + this.O_group.getGroupSystemname(value.groupid) + " \u904B\u55B6\u4FC2';\n");
					fputs(fp, "$from = '" + this.O_group._getAdminMailaddressForGroup(value.groupid) + "';\n");
				}

				fputs(fp, "$mailtext = '" + value.mailtext + "';\n");
				fputs(fp, "$status = 4;\n");
				fputs(fp, "?>\n");
				fclose(fp);
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};