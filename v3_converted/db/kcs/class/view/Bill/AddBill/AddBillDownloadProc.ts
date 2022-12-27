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
class AddBillMasterDownloadView extends ViewBaseHtml {
	static PUB = "/Management";
	static DEBUG = "off";

	constructor() //$this->O_Set = MtSetting::singleton();
	{
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillMasterDownloadView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	checkCGIParam() //$this->O_Sess->setSelfAll( $this->H_Local );
	//// getパラメータは消す
	//		if( count( $_GET ) > 0 ){
	//			MtExceptReload::raise( null );
	//		}
	{}

	getLocalSession() {
		var key = dirname(_SERVER.PHP_SELF) + "/AddBillMaster.php";
		var H_sess = {
			[AddBillMasterDownloadView.PUB]: this.O_Sess.getPub(AddBillMasterDownloadView.PUB),
			SELF: this.O_Sess.getPub(key)
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
		var header = ["\u7A2E\u5225", "\u5927\u5206\u985E", "\u4E2D\u5206\u985E", "\u5C0F\u5206\u985E", "\u5546\u54C1\u30B3\u30FC\u30C9", "\u5546\u54C1\u540D", "\u5185\u5BB9\u660E\u7D30", "\u539F\u4FA1\u5358\u4FA1", "\u91D1\u984D\u5358\u4FA1", "\u767B\u9332\u65E5", "\u5546\u54C1\u5099\u8003"];

		for (var key in header) {
			var val = header[key];
			header[key] = this.H_dlprop.qt + val + this.H_dlprop.qt;
		}

		var str = header.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

		if (AddBillMasterDownloadView.DEBUG !== "on") {
			print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
		} else {
			print(str + "<br>");
		}
	}

	outputDataLine(A_data: {} | any[]) {
		for (var key in A_data) //登録日は日付のみ抽出する
		//文字列をくくる
		//出力するデータ
		//データをつなげる
		//出力
		{
			var data = A_data[key];
			data.registdate = data.registdate.substr(0, 10);

			for (var col in data) {
				var val = data[col];
				data[col] = this.H_dlprop.qt + strtr(val, this.H_dlprop.H_strtr) + this.H_dlprop.qt;
			}

			var A_str = [data.coname, data.class1, data.class2, data.class3, data.productcode, data.productname, data.spec, data.cost, data.price, data.registdate, data.comment];
			var str = A_str.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

			if (AddBillMasterDownloadView.DEBUG != "on") {
				print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_data: {} | any[]) {
		if (AddBillMasterDownloadView.DEBUG != "on") //ファイル名
			//ヘッダー設定
			{
				var filename = "\u53D7\u6CE8\u5185\u5BB9\u30DE\u30B9\u30BF\u4E00\u89A7_" + date("YmdHis") + "." + this.H_dlprop.extension;
				filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
				header("Pragma: private");
				header("Content-disposition: attachment; filename=" + filename);
				header("Content-type: application/octet-stream; name=" + filename);
			}

		if ("write" == this.H_dlprop.title) {
			this.outputHeaderLine();
		}

		this.outputDataLine(A_data);
		throw die();
	}

	__destruct() {
		super.__destruct();
	}

};