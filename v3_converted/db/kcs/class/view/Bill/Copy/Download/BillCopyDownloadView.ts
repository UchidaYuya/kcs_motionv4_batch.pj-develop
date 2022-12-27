//
//コピー機管理ダウンロードのView
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
//全て一覧用ダウンロードのView
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
//@param array $H_sess
//@access public
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2008/07/15
//
//@param $mode
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
//カレント部署の行だけを出力する
//
//@author houshiyama
//@since 2008/07/15
//
//@param array $H_kamoku
//@param array $A_data
//@param array $A_auth
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
//Download出力<br>
//
//ヘッダー設定<br>
//ヘッダー行CSV出力<br>
//部署単位の時はカレント部署情報出力<br>
//残りのヘッダーとデータ行出力<br>
//
//@author houshiyama
//@since 2008/07/15
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
//@since 2008/07/15
//
//@access public
//@return void
//
class BillCopyDownloadView extends BillDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(H_kamoku: {} | any[], A_auth: {} | any[], H_sess: {} | any[]) //asp権限あればaspセル追加
	{
		if (0 == H_sess.mode) {
			this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u8ACB\u6C42\u30B3\u30D4\u30FC\u6A5F\u6570", "\u30AB\u30A6\u30F3\u30C8", "\u3054\u5229\u7528\u91D1\u984D", "\u7A0E\u984D"];
		} else {
			this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u8ACB\u6C42\u30B3\u30D4\u30FC\u6A5FID", "\u62C5\u5F53\u8005", "\u30E1\u30FC\u30AB\u30FC", "\u6A5F\u7A2E", "\u30AB\u30A6\u30F3\u30C8", "\u3054\u5229\u7528\u91D1\u984D", "\u7A0E\u984D"];
		}

		if (-1 !== A_auth.indexOf("fnc_asp") == true) {
			this.H_View.A_head.push(H_kamoku[2]);
			this.H_View.A_head.push(H_kamoku[3]);
			this.H_View.A_head.push("\u8ACB\u6C42\u984D\u5408\u8A08");
			this.H_View.A_head.push("\u7A0E\u984D");
		}
	}

	getFileName(mode) {
		if (0 == mode) {
			this.H_View.filename = "copy_postbill_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		} else {
			this.H_View.filename = "copy_bill_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		}
	}

	outputHeaderLinePeculiar(A_head: {} | any[], H_sess: {} | any[], O_model) {
		if (0 == mode) {
			var H_co = O_model.getCopyCoData();
			var str = "\u8ACB\u6C42\u90E8\u7F72\u5358\u4F4D" + this.H_View.H_dlprop.separator1 + H_co[H_sess.copycoid] + this.H_View.H_dlprop.separator1 + "\n";
		} else {
			str = "\u8ACB\u6C42\u30B3\u30D4\u30FC\u6A5F\u5358\u4F4D" + this.H_View.H_dlprop.separator1;
		}

		if (BillCopyDownloadView.DEBUG != "on") {
			print(this.mbConvertEncodingDL(str));
		} else {
			print(str + "<br>");
		}
	}

	outputCurrentPostDataLine(H_kamoku: {} | any[], A_data: {} | any[], A_auth: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //フラグが0（カレント部署）
		{
			if (0 == A_data[cnt].flag) //asp権限あればaspセル追加
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

					var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC + this.H_View.H_dlprop.RC;

					if (BillCopyDownloadView.DEBUG != "on") {
						print(this.mbConvertEncodingDL(str));
					} else {
						print(str + "<br><br>");
					}
				}
		}
	}

	outputDataLine(H_kamoku: {} | any[], A_data: {} | any[], A_auth: {} | any[], mode) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //部署単位表示の時はカレント部署は出力しない（先に出力してるので）
		//部署単位
		//asp権限あればaspセル追加
		{
			if (0 == mode && 0 == A_data[cnt].flag) {
				continue;
			}

			{
				let _tmp_1 = A_data[cnt];

				for (var key in _tmp_1) {
					var val = _tmp_1[key];
					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}

			if (0 == mode) {
				var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].copyid_num];
			} else {
				A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].copyid, A_data[cnt].username, A_data[cnt].copyconame, A_data[cnt].copyname];
			}

			A_str.push(A_data[cnt].printcount);
			A_str.push(A_data[cnt].charge);
			A_str.push(A_data[cnt].excise);

			if (-1 !== A_auth.indexOf("fnc_asp") == true) {
				A_str.push(A_data[cnt].aspcharge);
				A_str.push(A_data[cnt].aspexcise);
				A_str.push(A_data[cnt].all_charge);
				A_str.push(A_data[cnt].all_excise);
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillCopyDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_auth: {} | any[], H_kamoku: {} | any[], H_sess: {} | any[], A_data: {} | any[], O_model) {
		if (BillCopyDownloadView.DEBUG != "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		if ("write" == this.H_View.H_dlprop.title) {
			this.outputHeaderLinePeculiar(this.H_View.A_head, H_sess, O_model);
		}

		if (0 == H_sess.mode) {
			if ("write" == this.H_View.H_dlprop.title) {
				this.outputHeaderLine(this.H_View.A_head);
			}

			this.outputCurrentPostDataLine(H_kamoku, A_data, A_auth);
		}

		if ("write" == this.H_View.H_dlprop.title) {
			this.outputHeaderLine(this.H_View.A_head);
		}

		this.outputDataLine(H_kamoku, A_data, A_auth, H_sess.mode);

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