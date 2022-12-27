//
//シミュレーション結果ダウンロード
//
//更新履歴：<br>
//2008/10/06 中西達夫 作成
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/10/06
//
//
//error_reporting(E_ALL);
//
//シミュレーション結果ダウンロード
//
//@uses ViewSmarty
//@package Sample
//@subpackage View
//@author nakanita
//@since 2008/10/06
//

require("MtSetting.php");

require("MtOutput.php");

require("view/ViewBaseHtml.php");

//
//ディレクトリ名
//
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
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param MtSetting $O_Set0 共通設定オブジェクト
//@param MtOutput $O_Out0 共通出力オブジェクト
//@access public
//@return void
//
//
//自身のセッションを取得する
//
//@author nakanita
//@since 2008/05/22
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return mixed
//
//
//ログインのチェックを行う
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//protected function checkLogin(){
//// ログインチェックを行わないときには、何もしないメソッドで親を上書きする
//}
//
//CGIパラメータのチェックを行う
//
//セッションにCGIパラメーターを付加する<br/>
//
//@author nakanita
//@since 2008/02/22
//
//@access protected
//@return void
//
//
//パラメーターのチェックを行う
//
//@author nakanita
//@since 2008/07/23
//
//@param array $H_sess
//@param array $H_g_sess
//@access public
//@return void
//
//
//downloadFile
//
//@author web
//@since 2013/01/30
//
//@param mixed $simid
//@param mixed $language
//@access public
//@return void
//
//
//displayDownload
//
//@author nakanita
//@since 2008/10/06
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author nakanita
//@since 2008/05/15
//
//@access public
//@return void
//
class RecomDownloadView extends ViewBaseHtml {
	static PUB = "/Recom3";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.O_Sess = MtSession.singleton();
		this.H_Dir = this.O_Sess.getPub(RecomDownloadView.PUB);
		this.H_Local = this.O_Sess.getSelfAll();
	}

	getSelfSession() //$H_sess = array( self::PUB => $this->O_Sess->getPub( self::PUB ),
	//"SELF" => $this->O_Sess->getSelfAll() );
	{
		var H_sess = this.O_Sess.getSelfAll();
		return H_sess;
	}

	getView() {
		return this.H_View;
	}

	checkCGIParam() //シミュレーションID -- GETで飛ばしている
	{
		var sess_flg = false;

		if (undefined !== _GET.simid == true && _GET.simid != "") {
			this.H_Local.get.simid = _GET.simid;
			sess_flg = true;
		}

		if (sess_flg == true) {
			this.O_Sess.setSelfAll(this.H_Local);
			MtExceptReload.raise(undefined);
		}
	}

	checkParamError(H_sess, H_g_sess) {}

	downloadFile(simid, language) //これがないとhttpsでDLできない
	//ブラウザ判定
	{
		var fileName = "Recom_" + date("YmdHis") + ".csv";
		header("Pragma: private");

		if (preg_match("/MSIE/i", _SERVER.HTTP_USER_AGENT)) {
			header("Content-Disposition: attachment; filename=\"" + mb_convert_encoding(fileName, "SJIS", "UTF-8") + "\"");
		} else if (preg_match("/Gecko/i", _SERVER.HTTP_USER_AGENT)) {
			header("Content-Disposition: attachment; filename=\"" + fileName + "\"");
		}

		header("Content-type: application/octet-stream; name=\"" + fileName + "\"");
		header("Content-Transfer-Encoding: binary");
		var filePath = KCS_DIR + "/files/Recom_" + simid + "_" + language + ".csv";

		if (!file_exists(filePath)) //指定された言語でファイルがなければ日本語にしてみる
			{
				filePath = KCS_DIR + "/files/Recom_" + simid + "_JPN.csv";

				if (!file_exists(filePath)) {
					return false;
				}
			}

		var record = file(filePath);

		for (var rec of Object.values(record)) {
			print(rec);
		}

		if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
			{
				_SESSION.dataDownloadCheck = 2;
			}
	}

	displayDownload() //ダウンロードファイル名
	//これがないとhttpsでDLできない
	//ブラウザ判定
	//header("Content-Length: " . filesize($fname));
	//ヘッダ行を出力
	//計算日
	//カラムヘッダを出力
	//コンテンツを出力
	{
		var downfname = "Recom_" + date("YmdHis") + ".csv";
		header("Pragma: private");

		if (preg_match("/MSIE/i", _SERVER.HTTP_USER_AGENT)) {
			header("Content-Disposition: attachment; filename=\"" + mb_convert_encoding(downfname, "SJIS", "UTF-8") + "\"");
		} else if (preg_match("/Gecko/i", _SERVER.HTTP_USER_AGENT)) {
			header("Content-Disposition: attachment; filename=\"" + downfname + "\"");
		}

		header("Content-type: application/octet-stream; name=\"" + downfname + "\"");
		header("Content-Transfer-Encoding: binary");
		var H_cond = this.H_View.cond[0];
		var fixdate = strtotime(H_cond.fixdate);
		print(mb_convert_encoding(this.O_Sess.compname + "\t" + this.O_Sess.postid + "\t" + H_cond.select_way_disp, "SJIS") + "\t" + this.H_View.H_data.length + "\t" + H_cond.year + "\t" + H_cond.month + "\t" + H_cond.monthcnt + "\t" + date("Y", fixdate) + "\t" + date("m", fixdate) + "\t" + date("d", fixdate) + "\r\n");

		if (this.O_Sess.language === "ENG") {
			print(mb_convert_encoding("Telephone number" + "\tBasic charge (current plan)" + "\tBasic charge (suggested plan)" + "\tCall charge (current plan)" + "\tCall charge (suggested plan)" + "\tMisc. (current plan)" + "\tMisc. (suggested plan)" + "\tDepartment name" + "\tUser department ID" + "\tService type" + "\tUser" + "\tEmployee number" + "\tCurrent purchase method" + "\tCurrent billing plan" + "\tCurrent packet" + "\tRecommended purchase method" + "\tRecommended billing plan" + "\tRecommended billing packet" + "\tAverage statement amount" + "\tEstimated cutback amount" + "\tPenalty" + "\tNumber of break-even months", "SJIS") + "\r\n");
		} else {
			print(mb_convert_encoding("\u96FB\u8A71\u756A\u53F7" + "\t\u57FA\u672C\u6599(\u524D)" + "\t\u57FA\u672C\u6599(\u5F8C)" + "\t\u901A\u8A71\u6599(\u524D)" + "\t\u901A\u8A71\u6599(\u5F8C)" + "\t\u305D\u306E\u4ED6(\u524D)" + "\t\u305D\u306E\u4ED6(\u5F8C)" + "\t\u90E8\u7F72\u540D" + "\t\u30E6\u30FC\u30B6\u30FC\u90E8\u7F72ID" + "\t\u56DE\u7DDA\u7A2E\u5225" + "\t\u4F7F\u7528\u8005" + "\t\u793E\u54E1\u756A\u53F7" + "\t\u73FE\u884C\u8CFC\u5165\u65B9\u5F0F" + "\t\u73FE\u884C\u6599\u91D1\u30D7\u30E9\u30F3" + "\t\u73FE\u884C\u30D1\u30B1\u30C3\u30C8" + "\t\u63A8\u5968\u8CFC\u5165\u65B9\u5F0F" + "\t\u63A8\u5968\u6599\u91D1\u30D7\u30E9\u30F3" + "\t\u63A8\u5968\u30D1\u30B1\u30C3\u30C8" + "\t\u5E73\u5747\u3054\u5229\u7528\u984D" + "\t\u4E88\u6E2C\u524A\u6E1B\u984D" + "\t\u9055\u7D04\u91D1" + "\t\u63A1\u7B97\u5206\u5C90\u6708\u6570", "SJIS") + "\r\n");
		}

		for (var A_row of Object.values(this.H_View.H_data)) {
			var delim = "";
			var idx = 0;

			for (var item of Object.values(A_row)) //タブ区切り
			{
				print(delim + mb_convert_encoding(item, "SJIS"));
				delim = "\t";
			}

			print("\r\n");
		}

		if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
			{
				_SESSION.dataDownloadCheck = 2;
			}
	}

	__destruct() {
		super.__destruct();
	}

};