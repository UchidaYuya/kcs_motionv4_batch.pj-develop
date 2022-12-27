//
//コピー機管理ダウンロードのView
//
//更新履歴：<br>
//2008/04/28 宝子山浩平 作成
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses BillDownloadViewBase
//
//
//error_reporting(E_ALL);
//
//全て一覧用ダウンロードのView
//
//@package Bill
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@uses BillDownloadViewBase
//

require("view/Bill/BillDownloadViewBase.php");

//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//@uses BillUtil
//
//
//CGIパラメータのチェックを行う<br>
//
//@author houshiyama
//@since 2008/05/08
//
//@access public
//@return void
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
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $H_kamoku
//@param array $A_auth
//@param array $H_sess
//@param $mode
//@access public
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2008/04/02
//
//@param $mode
//@access public
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
//@access protected
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_data
//@access protected
//@return void
//
//
//データ行の出力（利用明細用）
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_data
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
//デストラクタ
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//
class BillCopyDetailsDownloadView extends BillDownloadViewBase {
	constructor() {
		super();
	}

	checkCGIParam() //モードを受け取る
	//getパラメータは消す
	{
		if (undefined !== _GET.dlmode == true && is_numeric(_GET.dlmode) == true) {
			this.H_Local.dlmode = _GET.dlmode;
		}

		this.O_Sess.setSelfAll(this.H_Local);

		if (_GET.length > 0) {
			MtExceptReload.raise(undefined);
		}
	}

	getLocalSession() //呼び出しページのセッションも取得し合体
	{
		var H_sess = {
			[BillCopyDetailsDownloadView.PUB]: this.O_Sess.getPub(BillCopyDetailsDownloadView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		var pare_dir = dirname(_SERVER.PHP_SELF).replace(/\/Download/g, "");

		if (H_sess.SELF.dlmode === "0" || H_sess.SELF.dlmode === "1") {
			var key = pare_dir + "/menu.php";
		} else {
			key = pare_dir + "/BillCopyDetails.php";
		}

		var H_pare_sess = this.O_Sess.getPub(key);
		H_sess.SELF = H_sess.SELF + H_pare_sess;
		return H_sess;
	}

	getHeaderLine(H_kamoku: {} | any[], A_auth: {} | any[], H_sess: {} | any[]) {
		if ("0" === H_sess.dlmode || "2" === H_sess.dlmode) {
			this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u30B3\u30D4\u30FC\u6A5FID", "\u30E1\u30FC\u30AB\u30FC", "\u6A5F\u7A2E", "\u5185\u8A33", "\u30AB\u30A6\u30F3\u30C8", "\u91D1\u984D", "\u7A0E\u533A\u5206"];
		} else {
			this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u30B3\u30D4\u30FC\u6A5FID", "\u30E1\u30FC\u30AB\u30FC", "\u6A5F\u7A2E", "", "", "", ""];
		}
	}

	getFileName(mode) {
		if (0 == mode) {
			this.H_View.filename = "allcopy_details_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		} else {
			this.H_View.filename = "copy_details_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		}
	}

	outputHeaderLinePeculiar(A_head: {} | any[], H_sess: {} | any[], O_model) {
		print("\u8ACB\u6C42\u660E\u7D30" + this.H_View.H_dlprop.separator1);

		if (BillCopyDetailsDownloadView.DEBUG != "on") {
			print(this.mbConvertEncodingDL(str));
		} else {
			print(str + "<br>");
		}
	}

	outputDataLine(A_data: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}
			var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].copyid, A_data[cnt].copyconame, A_data[cnt].copyname, A_data[cnt].codename, A_data[cnt].printcount, A_data[cnt].charge, A_data[cnt].taxkubun];
			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillCopyDetailsDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}
		}
	}

	outputHistoryDataLine(A_data: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			{
				let _tmp_1 = A_data[cnt];

				for (var key in _tmp_1) {
					var val = _tmp_1[key];
					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}
			var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].copyid, A_data[cnt].copyconame, A_data[cnt].copyname, A_data[cnt].text1, A_data[cnt].text2, A_data[cnt].text3, A_data[cnt].text4];
			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillCopyDetailsDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_auth: {} | any[], H_kamoku: {} | any[], H_sess: {} | any[], A_data: {} | any[], O_model) {
		if (BillCopyDetailsDownloadView.DEBUG != "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		if ("write" == this.H_View.H_dlprop.title) {
			this.outputHeaderLine(this.H_View.A_head);
		}

		if ("0" === H_sess.dlmode || "2" === H_sess.dlmode) {
			this.outputDataLine(A_data);
		} else {
			this.outputHistoryDataLine(A_data);
		}

		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};