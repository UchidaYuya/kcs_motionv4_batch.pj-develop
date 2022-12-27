//
//ＥＭＯＢＩＬＥ請求データ取込処理 （Model）
//
//更新履歴：<br>
//2009/02/04 前田 聡 作成
//
//ImportEmobileModel
//
//@package script
//@subpackage Model
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/02/04
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author maeda
//@since 2009/02/04
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//ファイル項目数チェック
//
//@author maeda
//@since 2009/02/04
//
//@param mixed $fileName：ファイル名
//@access public
//@return ファイルデータ
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2009/02/04
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//__destruct
//
//@author maeda
//@since 2009/02/04
//
//@access public
//@return void
//
class ImportEmobileModel extends ModelBase {
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
		var A_checkedData = Array();
		var lineCounter = 1;
		var A_fileData = file(fileName);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var lineData of Object.values(A_fileData)) //項目数エラー
		//文字コード変換
		//ヘッダー行以外は配列へ格納
		{
			var A_lineData = split(this.getSetting().DELIMITER, rtrim(lineData, "\r\n"));

			if (this.getSetting().DATA_COUNT != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			}

			var lineData = rtrim(lineData, "\r\n");
			lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");

			if (1 != lineCounter) {
				A_checkedData.push(lineData);
			}

			lineCounter++;
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return A_checkedData;
			} else {
			return false;
		}
	}

	editBillData(A_billData) //戻り値用配列
	//ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();

		for (var lineData of Object.values(A_billData)) //カラムに分割
		//電話番号を取得
		//電話番号有り
		{
			var A_lineData = split(this.getSetting().DELIMITER, rtrim(lineData));
			var telno = trim(A_lineData[8], "\"");

			if ("00000000000" != telno + "") //税区分置き換え
				//会社合計金額を取得
				{
					var taxStr = str_replace("\u3000", "", trim(A_lineData[14], "\""));

					if ("" == taxStr) {
						var taxKubun = 0;
					} else if ("\u5408\u7B97" == taxStr) {
						taxKubun = 1;
					} else if ("\u500B\u5225" == taxStr) {
						taxKubun = 2;
					} else if ("\u5185\u7A0E" == taxStr) {
						taxKubun = 3;
					} else if ("\u5BFE\u8C61\u5916" == taxStr) {
						taxKubun = 4;
					}

					if (undefined !== H_rtnData[telno] == false) //配列要素に有る電話番号の場合
						{
							H_rtnData[telno][0] = {
								code: trim(A_lineData[3], "\"") + "-" + trim(A_lineData[4], "\""),
								codename: trim(A_lineData[11], "\""),
								charge: +trim(A_lineData[12], "\""),
								taxkubun: taxKubun,
								bikou: rtrim(trim(A_lineData[15], "\""), "\u3000"),
								prtelno: trim(A_lineData[1], "\"")
							};
						} else {
						H_rtnData[telno][H_rtnData[telno].length] = {
							code: trim(A_lineData[3], "\"") + "-" + trim(A_lineData[4], "\""),
							codename: trim(A_lineData[11], "\""),
							charge: +trim(A_lineData[12], "\""),
							taxkubun: taxKubun,
							bikou: rtrim(trim(A_lineData[15], "\""), "\u3000"),
							prtelno: trim(A_lineData[1], "\"")
						};
					}
				} else //合計
				{
					if ("Z0" == trim(A_lineData[3], "\"") + "") //複数ファイル対応
						//会社合計がまだ無い場合
						{
							if (undefined !== H_rtnData[telno] == false) //会社合計が既に有る場合
								{
									H_rtnData[telno][0] = {
										charge: +trim(A_lineData[12], "\"")
									};
								} else {
								H_rtnData[telno][H_rtnData[telno].length] = {
									charge: +trim(A_lineData[12], "\"")
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