//
//ＳＵＯ ソフトバンクテレコム請求データ取込処理 （Model）
//
//更新履歴：<br>
//2009/07/14 前田 聡 作成
//
//SuoImportSoftTeleModel
//
//@package SUO
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/07/14
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2009/07/14
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//ファイル項目数チェック
//
//@author maeda
//@since 2009/11/06
//
//@param mixed $fileName：ファイル名
//@access public
//@return ファイルデータ
//
//
//請求金額合計を取得する
//
//@author maeda
//@since 2009/11/06
//
//@param mixed $A_sumData
//@access public
//@return 請求金額合計
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2009/11/06
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//editTuwaData
//
//@author maeda
//@since 2009/11/10
//
//@param mixed $A_tuwaData
//@access public
//@return void
//
//
//__destruct
//
//@author maeda
//@since 2009/07/14
//
//@access public
//@return void
//
class SuoImportSoftTeleModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName, A_sumData, A_billData, A_tuwaData) //エラーフラグ（false:エラー無し、true:エラー有り）
	//チェック完了したデータを格納
	//行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
		var errFlg = false;
		var H_checkedData = Array();
		var lineCounter = 1;
		var A_fileData = file(fileName);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) //使用するレコード区分のみ処理する
		{
			var A_lineData = split(",", rtrim(lineData, "\r\n"));
			var kubun = trim(A_lineData[1], "\"");

			if (kubun == this.getSetting().SUM_KUBUN || kubun == this.getSetting().BILL_KUBUN || kubun == this.getSetting().TUWA_KUBUN) //項目数エラー
				{
					var variaName = "KUBUN" + kubun + "_COUNT";
					var dataCnt = this.getSetting()[variaName];

					if (dataCnt != A_lineData.length) {
						errFlg = true;
						this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
					}

					if (kubun == this.getSetting().SUM_KUBUN) //使用するレコードのみ配列へ格納
						{
							A_sumData.push(lineData);
						} else if (kubun == this.getSetting().BILL_KUBUN) //使用するレコードのみ配列へ格納
						{
							A_billData.push(lineData);
						} else if (kubun == this.getSetting().TUWA_KUBUN) //使用するレコードのみ配列へ格納
						{
							A_tuwaData.push(lineData);
						}
				}

			lineCounter++;
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return true;
			} else {
			return false;
		}
	}

	editSumData(A_sumData) //１行ずつ処理する
	{
		var billCharge = 0;

		for (var lineData of Object.values(A_sumData)) {
			var A_lineData = split(",", rtrim(lineData, "\r\n"));
			billCharge += trim(A_lineData[7], "\"") / 100;
		}

		return billCharge;
	}

	editBillData(A_billData) //１行ずつ処理する
	{
		var H_rtnData = Array();
		var oldTelno = "";

		for (var lineData of Object.values(A_billData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//電話番号を取得
		//電話番号が変わった時の処理
		//必要なデータのみ保持する array(電話番号 => array(明細行番号 => DBDATA)
		{
			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			var A_lineData = split(",", rtrim(lineData));
			var telnoview = trim(A_lineData[4], "\"");
			var telno = str_replace("-", "", telnoview);

			if (oldTelno != telno) //明細行番号をリセット
				{
					var detailno = 0;
				}

			if (A_lineData[10] != "") {
				var taxCode = "TAX_CODE_" + trim(A_lineData[10], "\"");
				var taxName = this.getSetting()[taxCode];
			} else {
				taxName = "null";
			}

			H_rtnData[telno][detailno] = {
				telnoview: telnoview,
				code: trim(A_lineData[7], "\""),
				codename: trim(A_lineData[8], "\""),
				charge: +trim(A_lineData[9], "\""),
				taxkubun: taxName,
				billno: trim(A_lineData[3], "\"")
			};
			detailno++;
			oldTelno = telno;
		}

		return H_rtnData;
	}

	editTuwaData(A_tuwaData) //１行ずつ処理する
	{
		var H_rtnData = Array();
		var oldTelno = "";

		for (var lineData of Object.values(A_tuwaData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//電話番号を取得
		//電話番号が変わった時の処理
		//必要なデータのみ保持する array(電話番号 => array(明細行番号 => DBDATA)
		{
			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			var A_lineData = split(",", rtrim(lineData));
			var telno = str_replace("-", "", trim(A_lineData[4], "\""));

			if (oldTelno != telno) //明細行番号をリセット
				{
					var detailno = 0;
				}

			var date = trim(A_lineData[7], "\"");
			var time = trim(A_lineData[8], "\"");
			var startDate = date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2) + " " + time.substr(0, 2) + ":" + time.substr(2, 2) + ":" + time.substr(2, 2);
			var tuwatime = trim(A_lineData[9], "\"").substr(0, 3) + ":" + trim(A_lineData[9], "\"").substr(3, 2) + ":" + trim(A_lineData[9], "\"").substr(5, 2) + "." + trim(A_lineData[9], "\"").substr(7, 1);
			H_rtnData[telno][detailno] = {
				date: startDate,
				totelno: trim(A_lineData[17], "\""),
				time: tuwatime,
				charge: +(trim(A_lineData[12], "\"") / 100)
			};
			detailno++;
			oldTelno = telno;
		}

		return H_rtnData;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};