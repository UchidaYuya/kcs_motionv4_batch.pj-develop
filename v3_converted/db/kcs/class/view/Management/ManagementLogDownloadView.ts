//20160316 伊達
//error_reporting(E_ALL);
//require_once("MtOutput.php");

require("view/ViewBaseHtml.php");

require("MtSetting.php");

require("MtSession.php");

require("DLUtil.php");

//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//H_dlprop
//会社ごとのダウンロードフォーマット
//@var mixed
//@access protected
//
//
//__construct
//
//@author 伊達
//@since 2015/12/01
//
//@access public
//@return void
//
//
//checkCGIParam
//初期化
//@author web
//@since 2015/12/01
//
//@access public
//@return void
//
//
//getLocalSession
//ローカルセッションの取得
//@author 伊達
//@since 2015/12/01
//
//@access public
//@return void
//
//
//checkParamError
//セッションのエラーなど
//@author web
//@since 2015/12/01
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//setDLProperty
//CSV出力のセパレータやクォーテーションのくくりの設定
//@author 伊達
//@since 2015/12/01
//
//@access public
//@return void
//
//
//outputHeaderLine
//ヘッダー行の出力
//@author 伊達
//@since 2015/12/01
//
//@access protected
//@return void
//
//
//outputDataLine
//データ行の出力
//@author web
//@since 2015/12/01
//
//@param array $A_data
//@access public
//@return void
//
//
//displayCSV
//CSV出力
//@author 伊達
//@since 2015/12/01
//
//@param array $A_data
//@access public
//@return void
//
//
//__destruct
//
//@author 伊達
//@since 2015/12/01
//
//@access public
//@return void
//
class ManagementLogDownloadView extends ViewBaseHtml {
	static PUB = "/Management";
	static DEBUG = "off";

	constructor() //$this->H_Local = $this->O_Sess->getSelfAll();
	//$this->O_Set = MtSetting::singleton();
	{
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(ManagementLogDownloadView.PUB);
		this.H_Local = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/menu.php");
	}

	checkCGIParam() //$this->O_Sess->setSelfAll( $this->H_Local );
	//// getパラメータは消す
	//		if( count( $_GET ) > 0 ){
	//			MtExceptReload::raise( null );
	//		}
	{}

	getLocalSession() {
		var value = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/ManagementLog.php");
		var H_sess = {
			[ManagementLogDownloadView.PUB]: this.O_Sess.getPub(ManagementLogDownloadView.PUB),
			SELF: value
		};
		return H_sess;
	}

	checkParamError(H_sess, H_g_sess) ////	セッションで何かチェックすることがあればエラーにすること
	//		if( true ){
	//			$this->errorOut( 8, "管理番号が無い", false, "./menu.php" );
	//			exit();
	//		}
	{}

	setDLProperty() //半角→全角 変換対応文字列表
	//文字列項目クォーテーション
	{
		this.H_dlprop = DLUtil.getDLProperty();
		var separator = this.H_dlprop.separator1;
		var separator_sub = this.H_dlprop.separator2;
		this.H_dlprop.H_strtr = {
			[separator]: DLUtil.strConvert(separator),
			[separator_sub]: DLUtil.strConvert(separator_sub),
			"\"": "\u201D",
			"\t": " ",
			"\r\n": " ",
			"\r": " ",
			"\n": " "
		};

		if ("on" == this.H_dlprop.textize) {
			this.H_dlprop.qt = "\"";
		} else {
			this.H_dlprop.qt = "";
		}

		this.H_dlprop.RC = "\r\n";
	}

	outputHeaderLine() {
		header.push("\u7A2E\u5225");
		header.push("\u4F5C\u696D\u5185\u5BB9");
		header.push("\u7BA1\u7406\u756A\u53F7(\u5951\u7D04\u4F1A\u793E)");
		header.push("\u90E8\u7F72\u540D\u79F0");
		header.push("\u4F5C\u696D\u8005");
		header.push("\u4F5C\u696D\u65E5\u6642");

		for (var key in header) {
			var val = header[key];
			header[key] = this.H_dlprop.qt + val + this.H_dlprop.qt;
		}

		var str = header.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

		if (ManagementLogDownloadView.DEBUG !== "on") {
			print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
		} else {
			print(str + "<br>");
		}
	}

	outputDataLine(A_data: {} | any[], dl_mask_flg) {
		for (var key in A_data) ////	作業者をマスクする
		//			if( $dl_mask_flg ){
		//				$data["username"] = "●●●●";
		//			}
		//manageno
		//$A_str[] = $data["trg_postname"];
		//文字列をくくる
		//データをつなげる
		//出力
		{
			var data = A_data[key];
			var coname = "";

			if (data.coname != "") {
				data.manageno_view += "(" + data.coname + ")";
			}

			var A_str = Array();
			A_str.push(data.mname_jpn);
			A_str.push(data.comment);
			A_str.push(data.manageno_view);

			if (data.trg_postid_aft == "") {
				A_str.push(data.trg_postname);
			} else {
				A_str.push(data.trg_postname + "\u21D2" + data.trg_postname_aft);
			}

			A_str.push(data.username);
			A_str.push(data.recdate);

			for (var col in A_str) {
				var val = A_str[col];
				A_str[col] = this.H_dlprop.qt + strtr(val, this.H_dlprop.H_strtr) + this.H_dlprop.qt;
			}

			var str = A_str.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

			if (ManagementLogDownloadView.DEBUG != "on") {
				print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_data: {} | any[], A_auth) {
		var cost_flg = -1 !== A_auth.indexOf("fnc_addbill_input") ? true : false;

		if (-1 !== A_auth.indexOf("fnc_dldata_mng_co") && !(-1 !== A_auth.indexOf("fnc_dldata_not_mask"))) {
			var dl_mask_flg = true;
		} else {
			dl_mask_flg = false;
		}

		if (ManagementLogDownloadView.DEBUG != "on") //ファイル名
			//ヘッダー設定
			{
				var filename = "\u7BA1\u7406\u60C5\u5831\u7BA1\u7406\u8A18\u9332\u4E00\u89A7_";
				filename += date("YmdHis") + "." + this.H_dlprop.extension;
				filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
				header("Pragma: private");
				header("Content-disposition: attachment; filename=" + filename);
				header("Content-type: application/octet-stream; name=" + filename);
			}

		if ("write" == this.H_dlprop.title) {
			this.outputHeaderLine(cost_flg);
		}

		this.outputDataLine(A_data, cost_flg, dl_mask_flg);

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