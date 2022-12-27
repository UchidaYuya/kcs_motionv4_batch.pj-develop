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
class BillTransitFullDownloadView extends BillDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(H_kamoku: {} | any[], A_auth: {} | any[], H_sess: {} | any[]) //asp権限あればaspセル追加
	{
		this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u8ACB\u6C42\u904B\u9001ID\u6570", "\u6570\u91CF", "\u91CD\u91CF", "\u904B\u8CC3", "\u4FDD\u967A\u6599", "\u6D88\u8CBB\u7A0E"];

		if (-1 !== A_auth.indexOf("fnc_asp") == true) {
			this.H_View.A_head.push(H_kamoku[3]);
			this.H_View.A_head.push(H_kamoku[4]);
			this.H_View.A_head.push("\u8ACB\u6C42\u984D\u5408\u8A08");
			this.H_View.A_head.push("\u7A0E\u984D");
		}
	}

	getFileName(mode) {
		this.H_View.filename = "transit_allpostbill_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
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
			var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].tranid_num, A_data[cnt].sendcount, A_data[cnt].weight, A_data[cnt].charge, A_data[cnt].kamoku2, A_data[cnt].excise];

			if (-1 !== A_auth.indexOf("fnc_asp") == true) {
				A_str.push(A_data[cnt].aspcharge);
				A_str.push(A_data[cnt].aspexcise);
				A_str.push(A_data[cnt].all_charge);
				A_str.push(A_data[cnt].all_excise);
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillTransitFullDownloadView.DEBUG != "on") {
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