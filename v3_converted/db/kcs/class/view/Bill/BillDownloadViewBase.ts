//
//請求情報ダウンロードView基底
//
//更新履歴：<br>
//2008/04/28 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/28
//@filesource
//@uses BillViewBase
//@uses DLUtil
//
//
//error_reporting(E_ALL);
//
//請求情報ダウンロードView基底
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/28
//@uses BillViewBase
//@uses DLUtil
//

require("view/Bill/BillViewBase.php");

require("DLUtil.php");

//
//デバッグ
//
//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/04/28
//
//@access public
//@return void
//@uses BillUtil
//
//
//menu画面のセッションを取得
//
//@author houshiyama
//@since 2008/04/28
//
//@access public
//@return void
//
//
//パラメータのエラーチェック
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//ダウンロードの設定取得 <br>
//dl_property_tbの値を変数にセット <br>
//
//@author houshiyama
//@since 2008/04/28
//
//@access public
//@return void
//
//
//ヘッダ行の項目を決定
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $H_kamoku
//@param array $A_auth
//@param array $H_sess
//@abstract
//@access protected
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2008/04/28
//
//@abstract
//@param $mode
//@access protected
//@return void
//
//
//Download出力<br>
//
//ヘッダー設定<br>
//ヘッダー行CSV出力<br>
//部署単位の時はカレント部署情報出力<br>
//残りのヘッダーとデータ行出力<br>
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $A_auth（権限一覧）
//@param array $H_kamoku（科目情報行）
//@param array $H_sess（CGI）
//@param array $A_head（ヘッダー行）
//@param array $O_model
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//ヘッダ行の出力
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_head
//@param array $H_sess
//@access protected
//@return void
//
//
//各ページ固有のヘッダー行出力
//
//@author houshiyama
//@since 2008/04/30
//
//@param array $A_head
//@param array $H_sess
//@abstract
//@access protected
//@return void
//
//
//ダウンロード用の文字コード変換
//
//@author houshiyama
//@since 2008/04/28
//
//@param mixed $str
//@access protected
//@return void
//
//
//Download出力<br>
//
//ヘッダー設定<br>
//ヘッダー行CSV出力<br>
//
//@author houshiyama
//@since 2008/04/28
//
//@param array $A_auth（権限一覧）
//@param array $H_kamoku（科目情報行）
//@param array $H_sess（CGI）
//@param array $A_head（ヘッダー行）
//@param array $O_model
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/28
//
//@access public
//@return void
//
class BillDownloadViewBase extends BillViewBase {
	static DEBUG = "off";

	constructor() {
		super();
	}

	getLocalSession() {
		var pare_dir = dirname(_SERVER.PHP_SELF).replace(/\/Download/g, "");
		var key = pare_dir + "/menu.php";
		var H_sess = {
			[BillDownloadViewBase.PUB]: this.O_Sess.getPub(BillDownloadViewBase.PUB),
			SELF: this.O_Sess.getPub(key)
		};
		return H_sess;
	}

	checkParamError(H_sess, H_g_sess) //請求情報基底のパラメータチェック
	//リストが無ければエラー
	{
		this.checkBaseParamError(H_sess, H_g_sess);

		if (undefined !== H_sess.SELF === false) {
			this.errorOut(8, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044", false, "/Bill/menu.php");
			throw die();
		}
	}

	setDLProperty() //半角→全角 変換対応文字列表
	//文字列項目クォーテーション
	{
		this.H_View.H_dlprop = DLUtil.getDLProperty();
		var separator = this.H_View.H_dlprop.separator1;
		var separator_sub = this.H_View.H_dlprop.separator2;
		this.H_View.H_dlprop.H_strtr = {
			[separator]: DLUtil.strConvert(separator),
			[separator_sub]: DLUtil.strConvert(separator_sub),
			"\"": "\u201D",
			"\t": " ",
			"\r\n": " ",
			"\r": " ",
			"\n": " "
		};

		if ("on" === this.H_View.H_dlprop.textize) {
			this.H_View.H_dlprop.qt = "\"";
		} else {
			this.H_View.H_dlprop.qt = "";
		}

		this.H_View.H_dlprop.RC = "\r\n";
	}

	displayCSV(A_auth: {} | any[], H_kamoku: {} | any[], H_sess: {} | any[], A_data: {} | any[], O_model) {
		if (BillDownloadViewBase.DEBUG !== "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		if ("write" === this.H_View.H_dlprop.title) {
			this.outputHeaderLinePeculiar(this.H_View.A_head, H_sess, O_model);
			this.outputHeaderLine(this.H_View.A_head);
		}

		this.outputDataLine(H_kamoku, A_data, A_auth, H_sess.mode);

		if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
			{
				_SESSION.dataDownloadCheck = 2;
			}

		throw die();
	}

	outputHeaderLine(A_head: {} | any[]) {
		for (var key in A_head) {
			var val = A_head[key];
			A_head[key] = this.H_View.H_dlprop.qt + val + this.H_View.H_dlprop.qt;
		}

		var str = A_head.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

		if (BillDownloadViewBase.DEBUG !== "on") {
			print(this.mbConvertEncodingDL(str));
		} else {
			print(str + "<br>");
		}
	}

	mbConvertEncodingDL(str) {
		return mb_convert_encoding(str, "SJIS-win", "UTF-8");
	}

	displayCSVHeader(A_auth: {} | any[], H_sess: {} | any[]) {
		if (BillDownloadViewBase.DEBUG !== "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		this.outputHeaderLine(this.H_View.A_head);
	}

	__destruct() {
		super.__destruct();
	}

};