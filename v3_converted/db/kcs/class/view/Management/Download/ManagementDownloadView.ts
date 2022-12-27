//
//全て一覧用ダウンロードのView
//
//更新履歴：<br>
//2008/03/21 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/02/28
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
//@since 2008/03/28
//@uses ManagementDownloadViewBase
//

require("view/Management/ManagementDownloadViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/03/28
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//ヘッダー行の項目決定
//
//@author houshiyama
//@since 2008/03/31
//
//@param array $A_auth
//@param array $H_prop
//@access public
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2008/03/31
//
//@access public
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2008/03/31
//
//@param array $A_auth
//@param array $A_data
//@param array $H_prop（ここでは使用しない）
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementDownloadView extends ManagementDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(A_auth: {} | any[], H_prop: {} | any[], H_sess: {} | any[]) //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			this.H_View.A_head = ["System department ID", "Department ID", "Department name", "Admin type", "Admin number", "Admin number(Without hyphens)", "Carrier", "Note", "User", "Contracted date"];
		} else {
			this.H_View.A_head = ["\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID", "\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u7BA1\u7406\u7A2E\u5225", "\u7BA1\u7406\u756A\u53F7", "\u7BA1\u7406\u756A\u53F7\uFF08\u30CF\u30A4\u30D5\u30F3\u306A\u3057\uFF09", "\u5951\u7D04\u4F1A\u793E", "\u5099\u8003", "\u4F7F\u7528\u8005", "\u5951\u7D04\u65E5"];
		}
	}

	getFileName(H_sess: {} | any[]) //表示言語分岐
	{
		if (this.O_Sess.language == "ENG") {
			var filename = "AdminInformations_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		} else {
			filename = "\u7BA1\u7406\u60C5\u5831_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		}

		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	outputDataLine(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //ダウンロードデータ管理権限があるが、ダウンロードデータマスクしない権限がない時
		//表示言語分岐
		{
			{
				let _tmp_0 = A_data[cnt];

				for (var key in _tmp_0) {
					var val = _tmp_0[key];

					if (key == "contractdate") {
						var val = val.substr(0, 10);
					}

					A_data[cnt][key] = this.H_View.H_dlprop.qt + strtr(val, this.H_View.H_dlprop.H_strtr) + this.H_View.H_dlprop.qt;
				}
			}

			if (-1 !== A_auth.indexOf("fnc_dldata_mng_co") && !(-1 !== A_auth.indexOf("fnc_dldata_not_mask"))) //マスクする
				{
					var username = "********";
				} else {
				username = A_data[cnt].username;
			}

			if (this.O_Sess.language == "ENG") {
				var A_str = [A_data[cnt].postid, A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].mtype_eng, A_data[cnt].manageno_view, A_data[cnt].manageno, A_data[cnt].contract_eng, A_data[cnt].note_eng, username, A_data[cnt].contractdate];
			} else {
				A_str = [A_data[cnt].postid, A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].mtype, A_data[cnt].manageno_view, A_data[cnt].manageno, A_data[cnt].contract, A_data[cnt].note, username, A_data[cnt].contractdate];
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (ManagementDownloadView.DEBUG != "on") {
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