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
//public function displayCSV( array $A_data,$cost_flg ){
//
//__destruct
//
//@author 伊達
//@since 2015/12/01
//
//@access public
//@return void
//
class AddBillDownloadView extends ViewBaseHtml {
	static PUB = "/Bill";
	static DEBUG = "off";

	constructor() //$this->H_Local = $this->O_Sess->getSelfAll();
	//$this->O_Set = MtSetting::singleton();
	{
		super();
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(AddBillDownloadView.PUB);
		this.H_Local = this.O_Sess.getPub(dirname(_SERVER.PHP_SELF) + "/menu.php");
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
			[AddBillDownloadView.PUB]: this.O_Sess.getPub(AddBillDownloadView.PUB),
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

	outputHeaderLine(cost_flg) {
		header.push("\u53D7\u4ED8\u756A\u53F7");
		header.push("\u660E\u7D30\u756A\u53F7\u756A\u53F7");
		header.push("\u90E8\u7F72ID");
		header.push("\u90E8\u7F72\u540D");
		header.push("\u540D\u523A\u8A18\u8F09\u6C0F\u540D");
		header.push("\u7A2E\u5225");
		header.push("\u5927\u5206\u985E");
		header.push("\u4E2D\u5206\u985E");
		header.push("\u5C0F\u5206\u985E");
		header.push("\u5546\u54C1\u30B3\u30FC\u30C9");
		header.push("\u5546\u54C1\u540D");
		header.push("\u6570\u91CF");

		if (cost_flg) {
			header.push("\u539F\u4FA1");
		}

		header.push("\u91D1\u984D");
		header.push("\u6D88\u8CBB\u7A0E");
		header.push("\u53D7\u4ED8\u65E5");
		header.push("\u7D0D\u54C1\u65E5");
		header.push("\u7D0D\u54C1\u5148");
		header.push("\u5165\u529B\u8005");
		header.push("\u78BA\u5B9A");
		header.push("\u5099\u8003");

		for (var key in header) {
			var val = header[key];
			header[key] = this.H_dlprop.qt + val + this.H_dlprop.qt;
		}

		var str = header.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

		if (AddBillDownloadView.DEBUG !== "on") {
			print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
		} else {
			print(str + "<br>");
		}
	}

	outputDataLine(A_data: {} | any[], cost_flg) {
		for (var key in A_data) //登録日は日付のみ抽出する
		//文字列をくくる
		//出力するデータ
		//データをつなげる
		//出力
		{
			var data = A_data[key];
			data.acceptdate = data.acceptdate.substr(0, 10);
			data.deliverydate = data.deliverydate.substr(0, 10);

			if (data.confirm_flg) {
				var confirm = "\u78BA\u5B9A";
			} else {
				confirm = "\u672A\u78BA\u5B9A";
			}

			for (var col in data) {
				var val = data[col];
				data[col] = this.H_dlprop.qt + strtr(val, this.H_dlprop.H_strtr) + this.H_dlprop.qt;
			}

			var A_str = Array();
			A_str.push(data.addbillid);
			A_str.push(data.addbillid_sub);
			A_str.push(data.userpostid);
			A_str.push(data.postname);
			A_str.push(data.card_name);
			A_str.push(data.coname);
			A_str.push(data.class1);
			A_str.push(data.class2);
			A_str.push(data.class3);
			A_str.push(data.productcode);
			A_str.push(data.productname);
			A_str.push(data.num);

			if (cost_flg) {
				A_str.push(data.cost);
			}

			A_str.push(data.price);
			A_str.push(data.tax);
			A_str.push(data.acceptdate);
			A_str.push(data.deliverydate);
			A_str.push(data.delivery_dest);
			A_str.push(data.username);
			A_str.push(confirm);
			A_str.push(data.comment);
			var str = A_str.join(this.H_dlprop.separator1) + this.H_dlprop.RC;

			if (AddBillDownloadView.DEBUG != "on") {
				print(mb_convert_encoding(str, "SJIS-win", "UTF-8"));
			} else {
				print(str + "<br>");
			}
		}
	}

	displayCSV(A_data: {} | any[], A_auth: {} | any[]) //受注内容入力権限があるa
	{
		var cost_flg = -1 !== A_auth.indexOf("fnc_addbill_input") ? true : false;

		if (AddBillDownloadView.DEBUG != "on") //ファイル名
			//ヘッダー設定
			{
				if (this.H_Local.input_flg == true) {
					var filename = "\u53D7\u6CE8\u5185\u5BB9\u4E00\u89A7_";
				} else {
					filename = "\u8FFD\u52A0\u8ACB\u6C42\u660E\u7D30\u4E00\u89A7_";
				}

				filename += date("YmdHis") + "." + this.H_dlprop.extension;
				filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
				header("Pragma: private");
				header("Content-disposition: attachment; filename=" + filename);
				header("Content-type: application/octet-stream; name=" + filename);
			}

		if ("write" == this.H_dlprop.title) {
			this.outputHeaderLine(cost_flg);
		}

		this.outputDataLine(A_data, cost_flg);

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