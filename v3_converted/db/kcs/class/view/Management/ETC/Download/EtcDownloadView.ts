//
//ETC管理ダウンロードView
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
//ETC管理ダウンロードView
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
class EtcDownloadView extends ManagementDownloadViewBase {
	constructor() {
		super();
	}

	getHeaderLine(A_auth: {} | any[], H_prop: {} | any[], H_sess: {} | any[]) //請求閲覧権限がある時
	{
		this.H_View.A_head = ["\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID", "\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u30AB\u30FC\u30C9\u756A\u53F7", "\u30AB\u30FC\u30C9\u756A\u53F7\uFF08\u30CF\u30A4\u30D5\u30F3\u3001\u30B9\u30DA\u30FC\u30B9\u7121\u3057\uFF09", "\u30AB\u30FC\u30C9\u4F1A\u793EID", "\u30AB\u30FC\u30C9\u4F1A\u793E", "\u30AB\u30FC\u30C9\u540D\u7FA9", "\u30AB\u30FC\u30C9\u756A\u53F72", "\u30AB\u30FC\u30C9\u756A\u53F72\uFF08\u30CF\u30A4\u30D5\u30F3\u3001\u30B9\u30DA\u30FC\u30B9\u7121\u3057\uFF09", "\u6CD5\u4EBA\u756A\u53F7", "\u30AB\u30FC\u30C9\u6CD5\u4EBA\u540D", "\u30AB\u30FC\u30C9\u4F1A\u54E1\u540D\u79F0", "\u4F7F\u7528\u8005", "\u793E\u54E1\u756A\u53F7", "\u8ECA\u4E21\u756A\u53F7", "\u30E1\u30E2"];

		if (-1 !== A_auth.indexOf("fnc_card_billperson") == true) {
			this.H_View.A_head.push("\u30B7\u30B9\u30C6\u30E0\u8ACB\u6C42\u95B2\u89A7\u8005ID");
			this.H_View.A_head.push("\u8ACB\u6C42\u95B2\u89A7\u8005");
		}

		for (var key in H_prop) {
			var val = H_prop[key];
			this.H_View.A_head.push(val);
		}
	}

	getFileName(H_sess: {} | any[]) {
		var filename = "ETC\u30AB\u30FC\u30C9\u60C5\u5831_" + date("YmdHis") + "." + this.H_View.H_dlprop.extension;
		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	outputDataLine(A_auth: {} | any[], A_data: {} | any[], H_prop: {} | any[], H_sess: {} | any[], O_model) {
		for (var cnt = 0; cnt < A_data.length; cnt++) //請求閲覧権限がある時
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
					var employeecode = "*****";
				} else {
				username = A_data[cnt].username;
				employeecode = A_data[cnt].employeecode;
			}

			var A_str = [A_data[cnt].postid, A_data[cnt].userpostid, A_data[cnt].postname, A_data[cnt].cardno_view, A_data[cnt].cardno, A_data[cnt].cardcoid, A_data[cnt].cardconame, A_data[cnt].card_meigi, A_data[cnt].bill_cardno_view, A_data[cnt].bill_cardno, A_data[cnt].card_corpno, A_data[cnt].card_corpname, A_data[cnt].card_membername, username, employeecode, A_data[cnt].car_no, A_data[cnt].memo];

			if (-1 !== A_auth.indexOf("fnc_card_billperson") == true) {
				A_str.push(A_data[cnt].userid);
				A_str.push(A_data[cnt].billusername);
			}

			for (var key in H_prop) {
				var val = H_prop[key];
				A_str.push(A_data[cnt][key]);
			}

			var str = A_str.join(this.H_View.H_dlprop.separator1) + this.H_View.H_dlprop.RC;

			if (EtcDownloadView.DEBUG != "on") {
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