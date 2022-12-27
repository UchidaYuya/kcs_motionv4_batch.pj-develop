//
//Felicaデータ取込処理 （Model）
//
//更新履歴：<br>
//2010/04/19 宮澤龍彦 作成
//
//ImportFelicaModel
//
//@package Felica
//@subpackage Model
//@author miyazawa<miyazawa@motion.co.jp>
//@filesource
//@since 2010/04/19
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author miyazawa
//@since 2010/04/19
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//ファイル項目数チェック
//
//@author miyazawa
//@since 2010/04/19
//
//@param mixed $fileList：ファイルリスト
//@access public
//@return void
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する（利用明細）
//
//@author miyazawa
//@since 2010/04/19
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 利用明細用データ
//
//
//利用明細の重複削除
//
//@author miyazawa
//@since 2010/07/06
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 利用明細用データ
//
//
//iccardidからpactid、useridを取得
//
//@author miyazawa
//@since 2010/04/19
//
//@param int $iccardid : FelicaID
//@param string $tableno : iccard_tbのテーブル番号
//@access public
//@return iccardid=>array(pactid,userid)の配列
//
//
//利用明細の重複削除再確認
//
//@author miyazawa
//@since 2010/11/01
//
//@access public
//@return void
//
//
//取り込んだ会社をiccard_index_tbに記録
//
//@author miyazawa
//@since 2010/07/29
//
//@param integer $pactid
//@param mixed $A_pactdata	会社ごとの取込データ
//@param string $is_import
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2010/04/19
//
//@access public
//@return void
//
class ImportFelicaModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName) //エラーフラグ（false:エラー無し、true:エラー有り）
	//チェック完了したデータを格納
	//行番号
	//ファイル読み込み
	//<br>でつながった文字列を文字列にする
	//データが１行もなかった場合はエラー
	//エラー無し
	{
		var errFlg = false;
		var H_checkedData = Array();
		var lineCounter = 0;
		var filestr = file(fileName);
		var A_fileData = split("<br>", filestr[0]);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		var A_rtnData = Array();

		for (var lineData of Object.values(A_fileData)) //文字コード変換
		//一度失敗したものは「false」で始まるファイルになっていて、既に文字コード変換済み
		//開発中のデータはSJISだったが本番運用はUTF-8だったのでコメントアウト
		//if (false == ereg("false", $fileName)) {
		//$lineData = mb_convert_encoding($lineData,"UTF-8","SJIS-win");
		//}
		//最終行は「__EOF」なので例外
		{
			if ("__EOF" != lineData && "" != lineData) //カンマ区切り
				//項目数エラー
				{
					lineCounter++;
					var A_lineData = split("\\,", rtrim(lineData, "\r\n"));

					if (this.getSetting().DATA_COUNT != A_lineData.length) {
						errFlg = true;
						this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
					} else {
						A_rtnData.push(A_lineData);
					}
				}
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return A_rtnData;
			} else {
			return false;
		}
	}

	editBillData(A_billData) //ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();

		for (var lineData of Object.values(A_billData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//カンマ区切り
		//原票番号の頭の数字の意味
		//99         ：往復宅配便
		//9［9以外］ ：メール便
		//1          ：着払い
		//2          ：着払い
		//3          ：宅配便
		//金額がマイナスの場合は数量をマイナスにする
		//福山通運では個数不要
		//if((trim($A_lineData[14],"\"") * 1) < 0){
		//$itemsum = trim($A_lineData[12],"\"") * (-1);
		//}else{
		//$itemsum = trim($A_lineData[12],"\"") * 1;
		//}
		//行番号（原票番号ごとに一行で来るから不要とは思うが一応用意しておく）
		//重量
		//荷受人住所
		//荷受人名称
		//■があったら除去
		//荷受人TEL
		//備考
		//必要なデータのみ保持する array(得意先コード => array(発送年月 => array(原票番号 => array(行番号 => DBDATA)))
		//２重引用符除去、小数点以下切捨て
		{
			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "SJIS-WIN", "UTF8");
			var A_lineData = split("\\,", rtrim(lineData));
			var charge = trim(A_lineData[14], "\"") * 1;
			var lineno = 0;

			if ("9" == A_lineData[11].substr(0, 1) && "9" != A_lineData[11].substr(1, 1)) //メール便はなし（空白）
				{
					var weight = 0;
				} else {
				weight = trim(A_lineData[13], "\"");
			}

			var to_address1 = trim(A_lineData[20], "\"");
			var to_address2 = trim(A_lineData[21], "\"");

			if ("9" == A_lineData[11].substr(0, 1) && "9" != A_lineData[11].substr(1, 1)) //メール便は「メール便」
				{
					var to_name1 = "\u30E1\u30FC\u30EB\u4FBF";
					var to_name2 = undefined;
				} else {
				if (true == is_numeric(trim(A_lineData[22], "\"")) || "" == trim(A_lineData[22], "\"") || undefined == trim(A_lineData[22], "\"")) //荷受人名称１が数字もしくは空白なら荷受人住所１を表示
					{
						to_name1 = to_address1;
						to_name2 = undefined;
					} else {
					to_name1 = trim(A_lineData[22], "\"");
					to_name2 = trim(A_lineData[23], "\"");
				}
			}

			if (true == 0 < to_name1.length) {
				to_name1 = str_replace("\u25A0", "", to_name1);
			}

			if (true == 0 < to_name2.length) {
				to_name2 = str_replace("\u25A0", "", to_name2);
			}

			var to_name = String(to_name1 + String(to_name2));

			if (true == is_numeric(trim(A_lineData[25], "\""))) //荷受人TELが数字の場合、戦闘に「0」を追加
				{
					var to_telno = trim(A_lineData[25], "\"");
					to_telno = "0" + String(to_telno);
				} else //荷受人ＴＥＬが数字ではなく、荷受人名称１が数字の場合は、荷受人名称１の頭に"0"を追加
				{
					if (false == is_numeric(trim(A_lineData[25], "\"")) && true == is_numeric(trim(A_lineData[22], "\""))) {
						to_telno = trim(A_lineData[22], "\"");
						to_telno = "0" + String(to_telno);
					} else {
						to_telno = trim(A_lineData[25], "\"");
					}
				}

			if ("1" == A_lineData[11].substr(0, 1) || "2" == A_lineData[11].substr(0, 1)) //着払いは「着払い」と表示
				{
					var comment = "\u7740\u6255\u3044";
				} else //それ以外は取得しない
				{
					comment = undefined;
				}

			H_rtnData[trim(A_lineData[0], "\"") + ""][trim(A_lineData[10], "\"")][trim(A_lineData[11], "\"")][lineno] = {
				weight: +weight,
				charge: +charge,
				sendcount: +trim(A_lineData[12], "\""),
				insurance: +trim(A_lineData[16], "\""),
				excise: +trim(A_lineData[17], "\""),
				to_name: to_name,
				to_telno: to_telno,
				comment: comment
			};
		}

		return H_rtnData;
	}

	uniqueBillData(A_billData) //iccard_history_parent_tb_pkeyとunique条件が違う、後に仕様を確認
	//ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();
		var sql = "select uniqueid,1 from iccard_history_parent_tb";
		var id_list = this.get_DB().queryAssoc(sql);

		for (var lineData of Object.values(A_billData)) //9が存在するか確認
		{
			if (!(undefined !== lineData[9])) {
				continue;
			}

			var uniqueid = lineData[9].trim();

			if (true == (undefined !== uniqueid)) //登録されてなければ登録する
				{
					if (!(undefined !== id_list[uniqueid])) //このIDは登録済みとしておく
						{
							H_rtnData.push(lineData);
							id_list[uniqueid] = 1;
						}
				}
		}

		return H_rtnData;
	}

	getPactUserFromIccard(iccardid, tableno = "") //20110527houshi 削除フラグを考慮、falseが複数あった場合は防げない
	{
		if (tableno == "") {
			var tablename = "iccard_tb";
		} else {
			tablename = "iccard_" + sprintf("%02d", tableno) + "_tb";
		}

		var sql = "SELECT pactid,userid FROM " + tablename + " WHERE iccardid='" + iccardid + "' and delflg=false";
		var A_pu = this.get_DB().queryRowHash(sql);
		return A_pu;
	}

	deleteDuplicateBillData() //uniqueBillDataで重複をキャッチできてないことがあるようなので暫定処置 20101101miya
	{
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_01_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_02_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_03_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_04_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_05_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_06_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_07_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_08_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_09_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_10_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_11_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_12_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_13_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_14_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_15_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_16_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_17_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_18_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_19_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_20_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_21_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_22_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_23_tb)");
		this.get_DB().query("DELETE FROM iccard_history_tb WHERE uniqueid IN (SELECT uniqueid FROM iccard_history_24_tb)");
	}

	recordICCardIndex(pactid, A_pactdata = Array(), is_import) //チェック済の会社
	{
		var A_recorded = Array();

		if (true == 0 < A_pactdata.length) //timestampのYYYY-MM-DD部分取得
			{
				var iccardcoid = A_pactdata[0].iccardcoid;
				var recdate = A_pactdata[0].recdate;
				var dataday = A_pactdata[0].usedate.substr(0, 10);

				if (undefined != pactid && undefined != iccardcoid && undefined != recdate && undefined != dataday) {
					var select_sql = "SELECT count(pactid) FROM iccard_index_tb WHERE pactid=" + pactid + " AND iccardcoid=" + iccardcoid + " AND dataday = '" + dataday + "'";
					var pactcnt = this.get_DB().queryOne(select_sql);

					if (true == 0 < pactcnt) {
						var index_sql = "UPDATE iccard_index_tb SET recdate='" + recdate + "', is_import=" + is_import + " WHERE pactid=" + pactid + " AND iccardcoid=" + iccardcoid + " AND dataday = '" + dataday + "'";
					} else {
						index_sql = "INSERT INTO iccard_index_tb (pactid,iccardcoid,dataday,is_import,recdate) VALUES (" + pactid + "," + iccardcoid + ",'" + dataday + "'," + is_import + ",'" + recdate + "')";
					}

					this.get_DB().query(index_sql);
				}
			}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};