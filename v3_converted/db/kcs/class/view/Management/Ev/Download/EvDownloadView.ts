//
//EV ID管理ダウンロードのView
//
//更新履歴：<br>
//2010/07/29 前田 作成
//
//@package Management
//@subpackage View
//@author maeda
//@since 2010/07/29
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
//@author maeda
//@since 2010/07/29
//@uses ManagementDownloadViewBase
//

require("view/Management/ManagementDownloadViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author maeda
//@since 2010/07/29
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//ヘッダー行の項目決定
//
//@author maeda
//@since 2010/07/29
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
//@author maeda
//@since 2010/07/29
//
//@access public
//@return void
//
//
//データ行の出力
//
//@author maeda
//@since 2010/07/29
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
//@author maeda
//@since 2010/07/29
//
//@access public
//@return void
//
class EvDownloadView extends ManagementDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(A_auth: {} | any[], H_prop: {} | any[], H_sess: {} | any[]) //ユーザ設定項目合体
	{
		this.H_View.A_head = ["\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID", "\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "EV ID", "\u30AD\u30E3\u30EA\u30A2ID", "\u30AD\u30E3\u30EA\u30A2", "\u4F7F\u7528\u8005", "\u8ECA\u4E21No", "\u8ECA\u7A2E", "\u96FB\u8A71\u9023\u7D61\u5148", "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9", "\u90F5\u4FBF\u756A\u53F7", "\u4F4F\u6240\uFF11", "\u4F4F\u6240\uFF12", "\u5EFA\u7269\u540D", "\u30E1\u30E2"];

		for (var key in H_prop) {
			var val = H_prop[key];
			this.H_View.A_head.push(val);
		}
	}

	getFileName(H_sess: {} | any[]) {
		var filename = "EV ID\u60C5\u5831_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	outputDataLine(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //ユーザ設定項目
		{
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (preg_match("/^date(\\d)/", key) == true) {
						var val = val.substr(0, 10);
					}

					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}

			if (-1 !== A_auth.indexOf("fnc_dldata_mng_co") && !(-1 !== A_auth.indexOf("fnc_dldata_not_mask"))) //マスクする
				{
					var username = "********";
					var ev_mail = "********@********";
				} else {
				username = A_data[cnt].username;
				ev_mail = A_data[cnt].ev_mail;
			}

			var A_str = [A_data[cnt].postid, A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].evid, A_data[cnt].evcoid, A_data[cnt].evconame, username, A_data[cnt].ev_car_number, A_data[cnt].ev_car_type, A_data[cnt].ev_telno, ev_mail, A_data[cnt].ev_zip, A_data[cnt].ev_addr1, A_data[cnt].ev_addr2, A_data[cnt].ev_building, A_data[cnt].memo];

			for (var key in H_prop) {
				var val = H_prop[key];

				if (preg_match("/^date/", key) == true) {
					A_data[cnt][key] = A_data[cnt][key].substr(0, 10);
				}

				A_str.push(A_data[cnt][key]);
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (EvDownloadView.DEBUG != "on") {
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