//
//購買管理ダウンロードのView
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
class BillPurchaseDetailsDownloadView extends BillDownloadViewBase {
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
			[BillPurchaseDetailsDownloadView.PUB]: this.O_Sess.getPub(BillPurchaseDetailsDownloadView.PUB),
			SELF: this.O_Sess.getSelfAll()
		};
		var pare_dir = dirname(_SERVER.PHP_SELF).replace(/\/Download/g, "");

		if (H_sess.SELF.dlmode === "0") {
			var key = pare_dir + "/menu.php";
		} else {
			key = pare_dir + "/BillPurchaseDetails.php";
		}

		var H_pare_sess = this.O_Sess.getPub(key);
		H_sess.SELF = H_sess.SELF + H_pare_sess;
		return H_sess;
	}

	getHeaderLine(H_kamoku: {} | any[], A_auth: {} | any[], H_sess: {} | any[]) {
		this.H_View.A_head = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u8CFC\u8CB7ID", "\u8CFC\u8CB7\u5148", "\u65E5\u4ED8", "\u4F1D\u7968\u756A\u53F7", "\u5546\u54C1\u30B3\u30FC\u30C9", "\u5185\u5BB9\u8A73\u7D30", "\u74B0\u5883\u5BFE\u5FDC\u5546\u54C1", "\u6570\u91CF", "\u91D1\u984D", "\u88DC\u52A9\u9805\u76EE"];
	}

	getFileName(mode) {
		if (0 == mode) {
			this.H_View.filename = "allpurchase_details_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		} else {
			this.H_View.filename = "purchase_details_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		}
	}

	outputHeaderLinePeculiar(A_head: {} | any[], H_sess: {} | any[], O_model) {
		print("\u8ACB\u6C42\u660E\u7D30" + this.H_View.H_dlprop.separator1);

		if (BillPurchaseDetailsDownloadView.DEBUG != "on") {
			print(this.mbConvertEncodingDL(str));
		} else {
			print(str + "<br>");
		}
	}

	outputDataLine(A_data: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //環境対応商品
		//金額非表示
		{
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (key == "buydate") {
						var val = val.substr(0, 10);
					}

					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}
			var green_flg = "";

			if (true == A_data[cnt].green) {
				green_flg = "\u5BFE\u5FDC";
			} else {
				green_flg = "";
			}

			if ("0" != A_data[cnt].codetype && 0 == A_data[cnt].charge) {
				A_data[cnt].charge = "";
			}

			var A_str = [A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].purchid, A_data[cnt].purchconame, A_data[cnt].buydate, A_data[cnt].slipno, A_data[cnt].itemcode, A_data[cnt].itemname, green_flg, A_data[cnt].itemsum, A_data[cnt].charge, A_data[cnt].comment];
			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (BillPurchaseDetailsDownloadView.DEBUG != "on") {
				print(this.mbConvertEncodingDL(str));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_auth: {} | any[], H_kamoku: {} | any[], H_sess: {} | any[], A_data: {} | any[], O_model) {
		if (BillPurchaseDetailsDownloadView.DEBUG != "on") {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		if ("write" == this.H_View.H_dlprop.title) {
			this.outputHeaderLine(this.H_View.A_head);
		}

		this.outputDataLine(A_data);
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};