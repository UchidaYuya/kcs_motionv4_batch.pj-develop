//
//運送管理ダウンロードのView
//
//更新履歴：<br>
//2010/02/25 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2010/02/25
//@filesource
//@uses BillTransitDownloadViewBase
//
//
//error_reporting(E_ALL);
//
//全て一覧用ダウンロードのView
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2010/02/25
//@uses BillTransitDownloadViewBase
//

require("view/Bill/BillDownloadViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2010/02/25
//
//@access public
//@return void
//@uses BillUtil
//
//
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2010/02/25
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
//@since 2010/02/25
//
//@param $mode（未使用）
//@access public
//@return void
//
//
//各ページ固有のヘッダー行出力
//
//@author houshiyama
//@since 2010/02/25
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
//@since 2010/02/25
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
//@since 2010/02/25
//
//@access public
//@return void
//
class BillHealthcareFullDownloadView extends BillDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(H_kamoku: {} | any[], A_auth: {} | any[], H_sess: {} | any[]) {
		this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u30D8\u30EB\u30B9\u30B1\u30A2ID\u6570", "\u6B69\u6570", "\u30AB\u30ED\u30EA\u30FC(kcal)", "\u79FB\u52D5\u8DDD\u96E2(km)"];
	}

	getFileName(mode) {
		this.H_View.filename = "healthcare_allpostbill_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
	}

	outputHeaderLinePeculiar(A_head: {} | any[], H_sess: {} | any[], O_model) {}

	outputDataLine(H_kamoku: {} | any[], A_data: {} | any[], A_auth: {} | any[], mode) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}
			var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].healthid_num, A_data[cnt].steps, A_data[cnt].calories, A_data[cnt].move];
			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillHealthcareFullDownloadView.DEBUG != "on") {
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