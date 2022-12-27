//
//運送管理ダウンロードのView
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@filesource
//@uses ManagementDownloadViewBase
//
//
//error_reporting(E_ALL);
//
//全て一覧用ダウンロードのView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@uses ManagementDownloadViewBase
//

require("view/Management/ManagementDownloadViewBase.php");

//class DocumentDownloadView extends ManagementViewBase{
//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//setFileName
//ファイル名の設定
//@author date
//@since 2015/08/17
//
//@param mixed $filename
//@access public
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $A_auth
//@param array $A_data
//@param array $H_prop
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
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class DocumentDownloadView extends ManagementDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(A_auth: {} | any[], H_prop: {} | any[], H_sess: {} | any[]) {}

	getFileName(H_sess: {} | any[]) {}

	setFileName(filename) {
		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	outputDataLine(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		for (var line of Object.values(A_data)) {
			var str = str_replace(",", this.H_View.H_dlprop.separator1, line) + this.H_View.H_dlprop.RC;

			if (DocumentDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		if (DocumentDownloadView.DEBUG != "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		this.outputDataLine(A_auth, A_data, H_prop, H_sess, O_model);

		if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
			{
				_SESSION.dataDownloadCheck = 2;
			}

		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};