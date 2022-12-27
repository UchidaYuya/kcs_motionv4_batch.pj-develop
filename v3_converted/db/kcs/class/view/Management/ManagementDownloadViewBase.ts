//
//管理情報ダウンロードView基底
//
//更新履歴：<br>
//2008/03/10 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/28
//@filesource
//@uses ManagementViewBase
//@uses DLUtil
//
//
//error_reporting(E_ALL);
//
//管理情報ダウンロードView基底
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/28
//@uses ManagementViewBase
//@uses DLUtil
//

require("view/Management/ManagementViewBase.php");

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
//@since 2008/03/28
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//menu画面のセッションを取得
//ローカルのセッションも合体
//
//@author houshiyama
//@since 2008/03/29
//
//@access public
//@return void
//
//
//パラメータのエラーチェック
//
//@author houshiyama
//@since 2008/03/29
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//ダウンロードの設定取得 <br>
//dl_property_tbの値を変数にセット <br>
//
//@author houshiyama
//@since 2008/03/31
//
//@access public
//@return void
//
//
//ヘッダ行の項目を決定
//
//@author houshiyama
//@since 2008/03/31
//
//@param array $A_auth
//@param array $H_prop
//@param array $H_sess
//@abstract
//@access protected
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2008/03/31
//
//@abstract
//@access protected
//@return void
//
//
//Download出力<br>
//
//ヘッダー設定<br>
//ヘッダー行CSV出力<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/03/28
//
//@param array $A_auth（権限一覧）
//@param array $A_head（ヘッダー行）
//@param array $H_data（表示データ）
//@param array $H_sess（CGIパラメータ）
//@param array $O_model（モデルオブジェクト）
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
//@access protected
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2008/03/31
//
//@param array $A_auth
//@param array $A_data
//@param array $H_prop
//@param array $H_sess
//@abstract
//@access protected
//@return void
//
//
//ダウンロード用の文字コード変換
//
//@author houshiyama
//@since 2008/03/31
//
//@param mixed $str
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/28
//
//@access public
//@return void
//
class ManagementDownloadViewBase extends ManagementViewBase {
	static DEBUG = "off";

	constructor() {
		super();
	}

	getLocalSession() //ローカルのセッションもあれば合体
	{
		var pare_dir = dirname(_SERVER.PHP_SELF).replace(/\/Download/g, "");
		var key = pare_dir + "/menu.php";
		var H_sess = {
			[ManagementDownloadViewBase.PUB]: this.O_Sess.getPub(ManagementDownloadViewBase.PUB),
			SELF: this.O_Sess.getPub(key)
		};
		var H_self = this.O_Sess.getSelfAll();

		if (Array.isArray(H_self) == true && H_self.length > 0) {
			H_sess.SELF = array_merge(H_sess.SELF, H_self);
		}

		return H_sess;
	}

	checkParamError(H_sess) //管理情報基底のパラメータチェック
	//リストが無ければエラー
	{
		this.checkBaseParamError(H_sess, H_g_sess);

		if (undefined !== H_sess.SELF == false) {
			this.errorOut(8, "\u51E6\u7406\u5BFE\u8C61\u304C\u7121\u3044", false, "/Management/menu.php");
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

		if ("on" == this.H_View.H_dlprop.textize) {
			this.H_View.H_dlprop.qt = "\"";
		} else {
			this.H_View.H_dlprop.qt = "";
		}

		this.H_View.H_dlprop.RC = "\r\n";
	}

	displayCSV(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		if (ManagementDownloadViewBase.DEBUG != "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		if ("write" == this.H_View.H_dlprop.title) //データ行の出力
			{
				this.outputHeaderLine(this.H_View.A_head);
			}

		this.outputDataLine(A_auth, A_data, H_prop, H_sess, O_model);

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

		var str = "//" + A_head.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

		if (ManagementDownloadViewBase.DEBUG != "on") {
			print(this.mbConvertEncodingDL(str));
		} else {
			print(str + "<br>");
		}
	}

	mbConvertEncodingDL(str) {
		return mb_convert_encoding(str, "SJIS-win", "UTF-8");
	}

	__destruct() {
		super.__destruct();
	}

};