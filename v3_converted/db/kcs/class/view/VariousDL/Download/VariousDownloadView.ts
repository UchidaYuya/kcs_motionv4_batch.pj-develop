//
//汎用ダウンロードView
//
//更新履歴：<br>
//2009/02/26 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2009/02/26
//@filesource
//@uses ViewSmarty
//@uses MtOutput
//@uses MtSession
//@uses MtUtil
//
//
//error_reporting(E_ALL);
//
//汎用ダウンロードView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2009/02/26
//@uses ViewSmarty
//@uses MtOutput
//@uses MtSession
//@uses MtUtil
//

require("view/VariousDL/PatternAddView.php");

require("MtOutput.php");

require("MtSession.php");

require("MtUtil.php");

//
//デバッグ
//
//
//メンバー変数
//
//@var mixed
//@access private
//
//MtSessionオブジェクト
//MtAuthorityオブジェクト
//権限一覧
//ローカルセッション
//MtSettingオブジェクト
//MtUtilオブジェクト
//表示用変数格納用
//英語ユーザ置き換えカラム一覧
//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//電話ダウンロードのCGIパラメータのチェックを行う<br>
//
//デフォルト値を入れる<br>
//
//確認画面へが実行されたら配列に入れる<br>
//部署変更が実行されたら配列を書換え<br>
//リセットが実行されたら配列を消してリロード<br>
//
//配列をセッションに入れる<br>
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//パラメータチェック <br>
//
//@author houshiyama
//@since 2008/03/18
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//ダウンロードの設定取得 <br>
//dl_pattern_tbの値を変数にセット <br>
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//ファイル名決定
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
//
//ヘッダー行作成
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $O_model
//@param mixed $H_sess
//@access public
//@return void
//
//
//csvファイル出力
//
//@author houshiyama
//@since 2009/03/02
//
//@param mixed $O_model
//@param mixed $A_data
//@param mixed $H_sess
//@access public
//@return void
//
//
//ヘッダ行の出力
//
//@author houshiyama
//@since 2008/04/02
//
//@param array $A_head
//@access protected
//@return void
//
//
//データ行の出力
//
//@author houshiyama
//@since 2009/02/26
//
//@param array $A_auth
//@param array $A_data
//@param array $H_prop
//@param array $H_sess
//@access protected
//@return void
//
//
//表示順が空の時使われてない数字で表示順を埋めていく関数
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $H_res
//@access public
//@return void
//
//
//usort用比較関数
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $A_1
//@param mixed $A_2
//@access private
//@return void
//
//
//ソート順が空の時使われてない数字でソート順を埋めていく関数
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $H_res
//@access public
//@return void
//public function setSortNum( $A_pattern ){
//
//$A_nums = array();
//$max_num = 0;
//// ソート順で使われた数字を取得
//for( $cnt = 0; $cnt < count( $A_pattern ); $cnt++ ){
//// ソート順が入っているか？
//if( $A_pattern[$cnt]["sort_order"] != "" ){
//array_push( $A_nums, $A_pattern[$cnt]["sort_order"] );
//}
//if( $A_pattern[$cnt]["sort_order"] > $max_num ){
//$max_num = $A_pattern[$cnt]["sort_order"];
//}
//}
//
//// ソート順が空の要素に順にソート順を入れてく
//$v_cnt = $max_num + 1;
//for( $cnt = 0; $cnt < count( $A_pattern ); $cnt++ ){
//// ソート順が空の時使ってない数字で埋める
//if( $A_pattern[$cnt]["sort_order"] == "" ){
//// 入力で使われてない数値
//$A_pattern[$cnt]["sort_order"] = $v_cnt;
//$v_cnt++;
//}
//}
//
//return $A_pattern;
//}
//
//
//ソート順が空の時使われてない数字でソート順を埋めていく関数
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $H_res
//@access public
//@return void
//
//
//usort用比較関数
//
//@author houshiyama
//@since 2009/02/27
//
//@param mixed $A_1
//@param mixed $A_2
//@access private
//@return void
//
//
//ダウンロード用の文字コード変換
//
//@author houshiyama
//@since 2008/03/31
//
//@param mixed $str
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2009/02/26
//
//@access public
//@return void
//
class VariousDownloadView extends PatternAddView {
	static DEBUG = "off";

	constructor() //英語置き換えがあるカラム
	{
		super();
		this.O_Sess = MtSession.singleton();
		this.O_Auth = MtAuthority.singleton(this.O_Sess.pactid);
		this.A_Auth = this.O_Auth.getUserFuncIni(this.O_Sess.userid, false);
		this.H_Local = this.O_Sess.getSelfAll();
		this.O_Set = MtSetting.singleton();
		this.O_Util = new MtUtil();
		this.H_View = Array();
		this.Now = this.getDateUtil().getNow();
		this.H_Engcol = {
			carname: "carname_eng",
			cirname: "cirname_eng",
			buyselname: "buyselname_eng",
			planname: "planname_eng",
			packetname: "packetname_eng",
			pointname: "pointname_eng",
			arname: "arname_eng",
			cardconame: "cardconame_eng",
			purchconame: "purchconame_eng",
			copyconame: "copyconame_eng",
			smpcirname: "smpcirname_eng"
		};
	}

	checkCGIParam() //リセットが実行されたらCGIパラメータを消してリロード
	{
		if (undefined !== _GET.dlmode == true) {
			this.H_Local.get = _GET;
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	getLocalSession() //dlid抜き出し
	{
		var H_sess = this.O_Sess.getPub("/VariousDL/menu.php");
		var A_prm = H_sess.post.pattern.split("|");
		H_sess.post.dlid = A_prm[0];
		H_sess.post.use = A_prm[1];
		return H_sess;
	}

	checkParamError(H_sess, H_g_sess) //モードが無ければエラー
	{
		if (undefined !== H_sess.mode == false) {
			this.errorOut(15, "\u5FC5\u9808GET\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u7121\u3044", false);
		}
	}

	setDLProperty(H_dlprop) //区切り文字
	//文字列引用符
	//半角→全角 変換対応文字列表
	{
		if (H_dlprop.separator == "comma") {
			this.H_View.H_dlprop.separator = ",";
		} else if (H_dlprop.separator == "tab") {
			this.H_View.H_dlprop.separator = "\t";
		} else {
			this.H_View.H_dlprop.separator = " ";
		}

		if (H_dlprop.textize == "single") {
			this.H_View.H_dlprop.textize = "'";
		} else if (H_dlprop.textize == "double") {
			this.H_View.H_dlprop.textize = "\"";
		} else {
			this.H_View.H_dlprop.textize = "";
		}

		this.H_View.H_dlprop.H_strtr = {
			"\"": "\u201D",
			"\t": " ",
			"\r\n": " ",
			"\r": " ",
			"\n": " "
		};
		this.H_View.H_dlprop.RC = "\r\n";
	}

	getFileName(H_sess: {} | any[]) //表示言語分岐
	{
		if ("ENG" == this.O_Sess.language) {
			if (H_sess.post.use == VariousDownloadView.POSTMODE) {
				var filename = "DepartmentInformation_";
			} else if (H_sess.post.use == VariousDownloadView.TELMODE) {
				filename = "TelephoneInformation_";
			} else if (H_sess.post.use == VariousDownloadView.ETCMODE) {
				filename = "ETCInformation_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHMODE) {
				filename = "PurchaseIDInformation_";
			} else if (H_sess.post.use == VariousDownloadView.COPYMODE) {
				filename = "CopyMachineInformation_";
			} else if (H_sess.post.use == VariousDownloadView.ASSMODE) {
				filename = "PropertyInformation_";
			} else if (H_sess.post.use == VariousDownloadView.POSTTELMODE) {
				filename = "DepartmentTelephoneInformation_";
			} else if (H_sess.post.use == VariousDownloadView.POSTETCMODE) {
				filename = "DepartmentETCInformation_";
			} else if (H_sess.post.use == VariousDownloadView.POSTPURCHMODE) {
				filename = "DepartmentPurchaseIDInformation_";
			} else if (H_sess.post.use == VariousDownloadView.POSTCOPYMODE) {
				filename = "DepartmentCopyMachineInformation_";
			} else if (H_sess.post.use == VariousDownloadView.POSTASSMODE) {
				filename = "DepartmentPropertyInformation_";
			} else if (H_sess.post.use == VariousDownloadView.TELPOSTBILLMODE) {
				filename = "TelephoneBillingInformation(Department)_";
			} else if (H_sess.post.use == VariousDownloadView.TELBILLMODE) {
				filename = "TelephoneBillingInformation(Telephone)_";
			} else if (H_sess.post.use == VariousDownloadView.ETCPOSTBILLMODE) {
				filename = "ETCBillingInformation(Department)_";
			} else if (H_sess.post.use == VariousDownloadView.ETCBILLMODE) {
				filename = "ETCBillingInformation(Card)_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHPOSTBILLMODE) {
				filename = "PurchaseBillingInformation(Department)_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHBILLMODE) {
				filename = "PurchaseBillingInformation(PurchaseID)_";
			} else if (H_sess.post.use == VariousDownloadView.COPYPOSTBILLMODE) {
				filename = "CopyMachineBillingInformation(Department)_";
			} else if (H_sess.post.use == VariousDownloadView.COPYBILLMODE) {
				filename = "CopyMachineBillingInformation(CopyMachine)_";
			} else if (H_sess.post.use == VariousDownloadView.TELALLMODE) {
				filename = "DepartmentTelephoneBillingInformation_";
			} else if (H_sess.post.use == VariousDownloadView.ETCALLMODE) {
				filename = "DepartmentETCBillingInformation_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHALLMODE) {
				filename = "DepartmentPurchaseIDBillingInformation_";
			} else if (H_sess.post.use == VariousDownloadView.COPYALLMODE) {
				filename = "DepartmentCopyMachineBillingInformation_";
			}
		} else {
			if (H_sess.post.use == VariousDownloadView.POSTMODE) {
				filename = "\u90E8\u7F72\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.TELMODE) {
				filename = "\u96FB\u8A71\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.ETCMODE) {
				filename = "ETC\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHMODE) {
				filename = "\u8CFC\u8CB7ID\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.COPYMODE) {
				filename = "\u30B3\u30D4\u30FC\u6A5F\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.ASSMODE) {
				filename = "\u8CC7\u7523\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.POSTTELMODE) {
				filename = "\u90E8\u7F72\u30FB\u96FB\u8A71\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.POSTETCMODE) {
				filename = "\u90E8\u7F72\u30FBETC\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.POSTPURCHMODE) {
				filename = "\u90E8\u7F72\u30FB\u8CFC\u8CB7ID\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.POSTCOPYMODE) {
				filename = "\u90E8\u7F72\u30FB\u30B3\u30D4\u30FC\u6A5F\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.POSTASSMODE) {
				filename = "\u90E8\u7F72\u30FB\u8CC7\u7523\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.TELPOSTBILLMODE) {
				filename = "\u96FB\u8A71\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.TELBILLMODE) {
				filename = "\u96FB\u8A71\u8ACB\u6C42\u60C5\u5831\uFF08\u96FB\u8A71\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.ETCPOSTBILLMODE) {
				filename = "ETC\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.ETCBILLMODE) {
				filename = "ETC\u8ACB\u6C42\u60C5\u5831\uFF08\u30AB\u30FC\u30C9\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHPOSTBILLMODE) {
				filename = "\u8CFC\u8CB7\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHBILLMODE) {
				filename = "\u8CFC\u8CB7\u8ACB\u6C42\u60C5\u5831\uFF08\u8CFC\u8CB7ID\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.COPYPOSTBILLMODE) {
				filename = "\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42\u60C5\u5831\uFF08\u90E8\u7F72\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.COPYBILLMODE) {
				filename = "\u30B3\u30D4\u30FC\u6A5F\u8ACB\u6C42\u60C5\u5831\uFF08\u30B3\u30D4\u30FC\u6A5F\u5358\u4F4D\uFF09_";
			} else if (H_sess.post.use == VariousDownloadView.TELALLMODE) {
				filename = "\u90E8\u7F72\u30FB\u96FB\u8A71\u30FB\u8ACB\u6C42\u8ACB\u6C42\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.ETCALLMODE) {
				filename = "\u90E8\u7F72\u30FBETC\u30FB\u8ACB\u6C42\u8ACB\u6C42\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.PURCHALLMODE) {
				filename = "\u90E8\u7F72\u30FB\u8CFC\u8CB7ID\u30FB\u8ACB\u6C42\u8ACB\u6C42\u60C5\u5831_";
			} else if (H_sess.post.use == VariousDownloadView.COPYALLMODE) {
				filename = "\u90E8\u7F72\u30FB\u30B3\u30D4\u30FC\u6A5F\u30FB\u8ACB\u6C42\u8ACB\u6C42\u60C5\u5831_";
			}
		}

		filename += this.Now.replace(/(-|:|\s)/g, "") + ".csv";
		this.H_View.filename = mb_convert_encoding(filename, "SJIS-win", "UTF-8");
	}

	getHeaderLine(O_model, H_sess, A_pattern) {
		this.H_View.A_head = Array();

		for (var cnt = 0; cnt < A_pattern.length; cnt++) {
			if (A_pattern[cnt].download == 1) //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) //パターン作成者が日本語なら置き換え必要
						{
							if (true == (-1 !== Object.keys(this.H_Engcol).indexOf(A_pattern[cnt].col_name))) {
								var col_name = this.H_Element[this.H_Engcol[A_pattern[cnt].col_name]].name;
							} else {
								col_name = this.H_Element[A_pattern[cnt].col_name].name;
							}
						} else {
						col_name = this.H_Element[A_pattern[cnt].col_name.replace(/_eng$/g, "")].name;
					}

					this.H_View.A_head.push(this.H_View.H_dlprop.textize + col_name + this.H_View.H_dlprop.textize);
				}
		}
	}

	displayCSV(O_model, A_data, H_sess) //ヘッダー行の出力
	//データ行の出力
	{
		if (VariousDownloadView.DEBUG == "on") {
			print(A_data.length + "<br>");
			print("<table border=\"1\">");
		} else {
			header("Pragma: private");
			header("Content-disposition: attachment; filename=" + this.H_View.filename);
			header("Content-type: application/octet-stream; name=" + this.H_View.filename);
		}

		this.outputHeaderLine(this.H_View.A_head);
		this.outputDataLine(A_data, H_sess);

		if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
			{
				_SESSION.dataDownloadCheck = 2;
			}
	}

	outputHeaderLine(A_head: {} | any[]) {
		if (VariousDownloadView.DEBUG == "on") {
			var str = "//" + A_head.join("</td><td nowrap>") + this.H_View.H_dlprop.RC;
			print("<tr><td nowrap>" + str + "</td></tr>");
		} else {
			str = "//" + A_head.join(this.H_View.H_dlprop.separator) + this.H_View.H_dlprop.RC;
			print(this.mbConvertEncodingDL(str));
		}
	}

	outputDataLine(A_data: {} | any[], H_sess: {} | any[]) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			var A_str = Array();
			{
				let _tmp_0 = A_data[cnt];

				for (var col in _tmp_0) //資産のsysnoとsysdateは抜かす
				{
					var val = _tmp_0[col];

					if (col != "sysno" && col != "sysdate" && col != "sysflg") //日付系の特別処理
						{
							if (preg_match("/^date\\d/", col) == true || col == "bought_date" || col == "orderdate" || col == "contractdate") {
								A_str.push(this.H_View.H_dlprop.textize + val.substr(0, 10) + this.H_View.H_dlprop.textize);
							} else if (col == "pay_startdate") {
								A_str.push(this.H_View.H_dlprop.textize + val.substr(0, 7) + this.H_View.H_dlprop.textize);
							} else {
								A_str.push(this.H_View.H_dlprop.textize + val + this.H_View.H_dlprop.textize);
							}
						}
				}
			}

			if (VariousDownloadView.DEBUG == "on") {
				var str = A_str.join("</td><td nowrap>");
				str = preg_replace("/<td>" + undefined + "<\\/td>/", "<td>-</td>", str);
				print("<tr><td nowrap>" + str + "</td></tr>");
			} else {
				str = A_str.join(this.H_View.H_dlprop.separator) + this.H_View.H_dlprop.RC;
				print(this.mbConvertEncodingDL(str));
			}
		}
	}

	setViewNum(A_pattern) //まずフォームの順でソート
	//表示順で使われた数字を取得
	//表示順が空の要素に順に表示順を入れてく
	{
		var A_tmp = Array();
		{
			let _tmp_1 = this.H_Element;

			for (var key in _tmp_1) {
				var val = _tmp_1[key];

				for (var cnt = 0; cnt < A_pattern.length; cnt++) //表示言語分岐
				{
					if ("ENG" == this.O_Sess.language) {
						if (key == A_pattern[cnt].col_name || key == this.H_Engcol[A_pattern[cnt].col_name]) {
							A_tmp.push(A_pattern[cnt]);
						}
					} else //末尾に_engが付いていたら取ってから比較
						{
							if (key == A_pattern[cnt].col_name.replace(/_eng$/g, "")) {
								A_tmp.push(A_pattern[cnt]);
							}
						}
				}
			}
		}
		A_pattern = A_tmp;
		var A_nums = Array();
		var max_num = 0;

		for (cnt = 0;; cnt < A_pattern.length; cnt++) //表示順が入っているか？
		{
			if (A_pattern[cnt].view_order != "") {
				A_nums.push(A_pattern[cnt].view_order);
			}

			if (A_pattern[cnt].view_order > max_num) {
				max_num = A_pattern[cnt].view_order;
			}
		}

		var v_cnt = max_num + 1;

		for (cnt = 0;; cnt < A_pattern.length; cnt++) //表示順が空の時使ってない数字で埋める
		{
			if (A_pattern[cnt].view_order == "") //入力で使われてない数値
				{
					A_pattern[cnt].view_order = v_cnt;
					v_cnt++;
				}
		}

		A_pattern.sort([this, "fncUsortView"]);
		return A_pattern;
	}

	fncUsortView(A_1, A_2) {
		if (A_1.view_order == A_2.view_order) {
			return 0;
		}

		if (A_1.view_order > A_2.view_order) {
			return 1;
		}

		if (A_1.view_order < A_2.view_order) {
			return -1;
		}
	}

	setSortNum(A_pattern) //ソート順で使われた数字を取得
	//ソート順が空の要素に順にソート順を入れてく
	{
		var A_nums = Array();
		var max_num = 0;

		for (var cnt = 0; cnt < A_pattern.length; cnt++) //ソート順が入っているか？
		{
			if (A_pattern[cnt].sort_order != "") {
				A_nums.push(A_pattern[cnt].sort_order);
			}

			if (A_pattern[cnt].sort_order > max_num) {
				max_num = A_pattern[cnt].sort_order;
			}
		}

		var s_cnt = max_num + 1;

		for (cnt = 0;; cnt < A_pattern.length; cnt++) //ソート順が空の時使ってない数字で埋める
		{
			if (A_pattern[cnt].sort_order == "") //入力で使われてない数値
				{
					A_pattern[cnt].sort_order = s_cnt;
					s_cnt++;
				}
		}

		return A_pattern;
	}

	fncUsortSort(A_1, A_2) {
		if (A_1.view_order == A_2.sort_order) {
			return 0;
		}

		if (A_1.view_order > A_2.sort_order) {
			return 1;
		}
	}

	mbConvertEncodingDL(str) {
		return mb_convert_encoding(str, "SJIS-win", "UTF-8");
	}

	__destruct() {
		super.__destruct();
	}

};