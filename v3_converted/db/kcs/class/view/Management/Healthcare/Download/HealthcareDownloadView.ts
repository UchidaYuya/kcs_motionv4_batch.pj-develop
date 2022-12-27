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
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2010/02/19
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
//@since 2010/02/19
//
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
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class HealthcareDownloadView extends ManagementDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(A_auth: {} | any[], H_prop: {} | any[], H_sess: {} | any[]) //ユーザ設定項目合体
	{
		this.H_View.A_head = ["\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID", "\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u30D8\u30EB\u30B9\u30B1\u30A2ID", "\u53D6\u5F97\u5148", "\u4F7F\u7528\u8005", "\u767B\u9332\u65E5", "\u793E\u54E1\u756A\u53F7", "\u5099\u8003"];

		for (var key in H_prop) {
			var val = H_prop[key];
			this.H_View.A_head.push(val);
		}
	}

	getFileName(H_sess: {} | any[]) {
		var filename = "\u30D8\u30EB\u30B9\u30B1\u30A2ID\u60C5\u5831_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	outputDataLine(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //ダウンロードデータ管理権限があるが、ダウンロードデータマスクしない権限がない時
		//ユーザ設定項目
		{
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (preg_match("/^date(\\d)/", key) == true || key == "registdate") {
						var val = val.substr(0, 10);
					}

					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}

			if (-1 !== A_auth.indexOf("fnc_dldata_mng_co") && !(-1 !== A_auth.indexOf("fnc_dldata_not_mask"))) //マスクする
				{
					var username = "********";
					var employeecode = "*****";
				} else //マスクしない
				{
					username = A_data[cnt].username;
					employeecode = A_data[cnt].employeecode;
				}

			var A_str = [A_data[cnt].postid, A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].healthid, A_data[cnt].healthconame, username, A_data[cnt].registdate, employeecode, A_data[cnt].remarks];

			for (var key in H_prop) {
				var val = H_prop[key];
				A_str.push(A_data[cnt][key]);
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (HealthcareDownloadView.DEBUG != "on") {
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