//
//資産管理ダウンロードView
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@filesource
//@uses ManagementDownloadViewBase
//
//
//error_reporting(E_ALL);
//
//資産管理ダウンロードView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/02
//@uses ManagementDownloadViewBase
//

require("view/Management/ManagementDownloadViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/04/02
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_auth
//@param array $H_prop
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
//@access public
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_auth
//@param array $A_data
//@param array $H_prop
//@access protected
//@return void
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
class AssetsDownloadView extends ManagementDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(A_auth: {} | any[], H_prop: {} | any[], H_sess: {} | any[]) //表示言語分岐
	//ユーザ設定項目合体
	{
		if (this.O_Sess.language == "ENG") {
			this.H_View.A_head = ["System department ID", "Department ID", "Department name", "Admin number", "Admin type", "IMEI number", "Product name", "Color", "Handset type", "Purchase date", "Purchase cost", "First month of installment month", "At the time of installment payment", "Payment of monthly installment", "Firmware", "Version", "Accessories", "User", "Employee number", "Memo"];
		} else {
			this.H_View.A_head = ["\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID", "\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u7BA1\u7406\u756A\u53F7", "\u8CC7\u7523\u7A2E\u5225", "\u88FD\u9020\u756A\u53F7", "\u88FD\u54C1\u540D", "\u8272", "\u7AEF\u672B\u7A2E\u5225", "\u8CFC\u5165\u65E5", "\u53D6\u5F97\u4FA1\u683C", "\u5272\u8CE6\u958B\u59CB\u6708", "\u5272\u8CE6\u56DE\u6570", "\u5272\u8CE6\u6708\u984D", "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2", "\u30D0\u30FC\u30B8\u30E7\u30F3", "\u4ED8\u5C5E\u54C1", "\u4F7F\u7528\u8005\u540D", "\u793E\u54E1\u756A\u53F7", "\u30E1\u30E2"];
		}

		for (var key in H_prop) {
			var val = H_prop[key];
			this.H_View.A_head.push(val);
		}
	}

	getFileName(H_sess: {} | any[]) //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var filename = "PropertyInformation_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		} else {
			filename = "\u8CC7\u7523\u60C5\u5831_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		}

		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	outputDataLine(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //ユーザ設定項目
		{
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (key == "bought_date" || preg_match("/^date(\\d)/", key) == true) {
						var val = val.substr(0, 10);
					} else if (key == "pay_startdate") {
						val = val.substr(0, 7);
					}

					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}
			var A_str = [A_data[cnt].postid, A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].assetsno, A_data[cnt].assetstypename, A_data[cnt].serialno, A_data[cnt].productname, A_data[cnt].property, A_data[cnt].smpcirname, A_data[cnt].bought_date, A_data[cnt].bought_price, A_data[cnt].pay_startdate, A_data[cnt].pay_frequency, A_data[cnt].pay_monthly_sum, A_data[cnt].firmware, A_data[cnt].version, A_data[cnt].accessory, A_data[cnt].username, A_data[cnt].employeecode, A_data[cnt].note];

			for (var key in H_prop) {
				var val = H_prop[key];
				A_str.push(A_data[cnt][key]);
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (AssetsDownloadView.DEBUG != "on") {
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