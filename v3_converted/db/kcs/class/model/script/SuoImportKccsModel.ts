//
//ＳＵＯ ＫＣＣＳ請求データ取込処理 （Model）
//
//更新履歴：<br>
//2008/07/28 前田 聡 作成
//
//SuoImportKccsModel
//
//@package SUO
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2008/07/28
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2008/07/28
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//chkBillData
//
//@author maeda
//@since 2008/07/28
//
//@param mixed $fileName：ファイル名
//@access public
//@return ファイルデータ
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2008/07/28
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//__destruct
//
//@author maeda
//@since 2008/07/28
//
//@access public
//@return void
//
class SuoImportKccsModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName) //エラーフラグ（false:エラー無し、true:エラー有り）
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

		for (var lineData of Object.values(A_fileData)) //項目数エラー
		{
			var A_lineData = split("\t", rtrim(lineData, "\r\n"));

			if (this.getSetting().DATA_COUNT != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return A_fileData;
			} else {
			return false;
		}
	}

	editBillData(A_billData) //ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();
		var oldTelno = "";

		for (var lineData of Object.values(A_billData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//電話番号有り
		{
			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			var A_lineData = split("\t", rtrim(lineData));

			if ("" != trim(A_lineData[2], "\"") + "") //内訳コード有り
				//電話番号無し（グループ集計、会社集計）
				{
					if ("" != trim(A_lineData[4], "\"")) //電話番号を取得
						//電話番号が変わった時の処理
						//内訳コード無し（電話番号集計）
						{
							var telnoView = trim(A_lineData[2], "\"");
							var telno = str_replace("-", "", telnoView);

							if (oldTelno != telno) //明細行番号をリセット
								//キャリアＩＤをリセット
								{
									var detailno = 0;
									var carid = "";
								}

							if ("" == carid) //キャリア名がＮＴＴの場合
								{
									if ("NTT" == trim(A_lineData[3], "\"")) //キャリア名がＫＤＤＩの場合
										{
											if (preg_match("/\u6771\u65E5\u672C/", A_lineData[8]) == true) {
												carid = this.getSetting().KCCS_NTTEAST_CARID;
											} else {
												carid = this.getSetting().KCCS_NTTWEST_CARID;
											}
										} else {
										carid = this.getSetting().KCCS_CARID;
									}
								}

							H_rtnData[telno][detailno] = {
								telnoview: telnoView,
								code: trim(A_lineData[4], "\""),
								charge: +trim(A_lineData[6], "\""),
								carid: carid
							};
							detailno++;
							oldTelno = telno;
						} else //電話毎の消費税額を取得
						{
							if (this.getSetting().CODENAME_TAX == trim(A_lineData[5], "\"")) {
								H_rtnData[telno][detailno] = {
									telnoview: telnoView,
									code: this.getSetting().UTIWAKE_TAX_CODE,
									charge: +trim(A_lineData[6], "\""),
									carid: carid
								};
								detailno++;
								oldTelno = telno;
							}
						}
				} else //会社集計の場合
				{
					if ("" == trim(A_lineData[0], "\"")) //会社全体の請求金額を取得
						{
							if (this.getSetting().CODENAME_CHARGE == trim(A_lineData[5], "\"")) {
								H_rtnData.allcharge[0] = {
									telnoview: "",
									code: "",
									charge: +trim(A_lineData[6], "\""),
									carid: ""
								};
							}
						}
				}
		}

		return H_rtnData;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};