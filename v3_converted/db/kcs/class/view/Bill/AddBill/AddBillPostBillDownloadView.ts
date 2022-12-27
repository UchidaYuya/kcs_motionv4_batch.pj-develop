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
class AddBillPostBillDownloadView extends ViewBaseHtml {
	static PUB = "/Bill";
	static DEBUG = "off";

	constructor() //$this->O_Set = MtSetting::singleton();
	{
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillPostBillDownloadView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	checkCGIParam() //$this->O_Sess->setSelfAll( $this->H_Local );
	//// getパラメータは消す
	//		if( count( $_GET ) > 0 ){
	//			MtExceptReload::raise( null );
	//		}
	{}

	getLocalSession() {
		var value = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/menu.php");
		var H_sess = {
			[AddBillPostBillDownloadView.PUB]: this.O_Sess.getPub(AddBillPostBillDownloadView.PUB),
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
		var header = ["\u90E8\u7F72ID", "\u90E8\u7F72\u540D", "\u6570\u91CF", "\u91D1\u984D", "\u6D88\u8CBB\u7A0E"];

		for (var key in header) {
			var val = header[key];
			header[key] = this.H_dlprop.qt + val + this.H_dlprop.qt;
		}

		var str = header.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

		if (AddBillPostBillDownloadView.DEBUG !== "on") {
			print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
		} else {
			print(str + "<br>");
		}
	}

	outputDataLine(A_data: {} | any[]) {
		for (var key in A_data) //文字列をくくる
		//出力するデータ
		//データをつなげる
		//出力
		{
			var data = A_data[key];

			for (var col in data) {
				var val = data[col];
				data[col] = this.H_dlprop.qt + strtr(val, this.H_dlprop.H_strtr) + this.H_dlprop.qt;
			}

			var A_str = Array();
			A_str.push(data.userpostid);
			A_str.push(data.postname);
			A_str.push(data.num);
			A_str.push(data.price);
			A_str.push(data.tax);
			var str = A_str.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

			if (AddBillPostBillDownloadView.DEBUG != "on") {
				print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_data: {} | any[]) {
		if (AddBillPostBillDownloadView.DEBUG != "on") //ファイル名
			//ヘッダー設定
			{
				var filename = "\u8FFD\u52A0\u8ACB\u6C42\u90E8\u7F72\u4E00\u89A7_" + date("YmdHis") + "." + this.H_dlprop.extension;
				filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
				header("Pragma: private");
				header("Content-disposition: attachment; filename=" + filename);
				header("Content-type: application/octet-stream; name=" + filename);
			}

		if ("write" == this.H_dlprop.title) {
			this.outputHeaderLine();
		}

		this.outputDataLine(A_data);

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