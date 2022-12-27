//
//コピー機請求ダウンロードのView
//
//更新履歴：<br>
//2008/07/15 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/07/15
//@filesource
//@uses BillCopyDownloadViewBase
//
//
//error_reporting(E_ALL);
//
//コピー機請求ダウンロードのView
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/07/15
//@uses BillCopyDownloadViewBase
//

require("view/Bill/BillDownloadViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/07/15
//
//@access public
//@return void
//@uses BillUtil
//
//
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2008/07/15
//
//@param array $H_kamoku
//@param array $A_auth
//@param array $H_sess（未使用）
//@access public
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2008/07/15
//
//@param $mode（未使用）
//@access public
//@return void
//
//
//各ページ固有のヘッダー行出力
//
//@author houshiyama
//@since 2008/07/15
//
//@param array $A_head
//@param array $H_sess
//@access protected
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2008/07/15
//
//@param array $H_kamoku
//@param array $A_data
//@param array $A_auth
//@param $mode
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/07/15
//
//@access public
//@return void
//
class BillCopyFullDownloadView extends BillDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(H_kamoku: {} | any[], A_auth: {} | any[], H_sess: {} | any[]) //asp権限あればaspセル追加
	{
		this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u8ACB\u6C42\u30B3\u30D4\u30FC\u6A5F\u6570", "\u30AB\u30A6\u30F3\u30C8", "\u3054\u5229\u7528\u91D1\u984D", "\u7A0E\u984D"];

		if (-1 !== A_auth.indexOf("fnc_asp") == true) {
			this.H_View.A_head.push(H_kamoku[2]);
			this.H_View.A_head.push(H_kamoku[3]);
			this.H_View.A_head.push("\u8ACB\u6C42\u984D\u5408\u8A08");
			this.H_View.A_head.push("\u7A0E\u984D");
		}
	}

	getFileName(mode) {
		this.H_View.filename = "copy_allpostbill_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
	}

	outputHeaderLinePeculiar(A_head: {} | any[], H_sess: {} | any[], O_model) {}

	outputDataLine(H_kamoku: {} | any[], A_data: {} | any[], A_auth: {} | any[], mode) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //asp権限あればaspセル追加
		{
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}
			var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].copyid_num, A_data[cnt].printcount, A_data[cnt].charge, A_data[cnt].excise];

			if (-1 !== A_auth.indexOf("fnc_asp") == true) {
				A_str.push(A_data[cnt].aspcharge);
				A_str.push(A_data[cnt].aspexcise);
				A_str.push(A_data[cnt].all_charge);
				A_str.push(A_data[cnt].all_excise);
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillCopyFullDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};