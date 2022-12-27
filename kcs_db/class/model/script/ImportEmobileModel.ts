import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import * as Encoding from "encoding-japanese";

import fs from 'fs';

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
export default class ImportEmobileModel extends ModelBase {
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName: string) //エラーフラグ（false:エラー無し、true:エラー有り）
	//チェック完了したデータを格納
	//行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
// 2022cvt_015
		var errFlg = false;
// 2022cvt_015
		var A_checkedData = Array();
// 2022cvt_015
		var lineCounter = 1;
// 2022cvt_015
		// var A_fileData = file(fileName);
		var buffer = fs.readFileSync('utf8.txt', 'utf8');
		var text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE',
			type: 'string',
    });
		var A_fileData = text.toString().split("\r\n");


		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}

// 2022cvt_015
		for (var lineData of (A_fileData)) //項目数エラー
		//文字コード変換
		//ヘッダー行以外は配列へ格納
		{
// 2022cvt_015
            // var A_lineData = split(this.getSetting().DELIMITER, rtrim(lineData, "\r\n"));
			var A_lineData = lineData.split(this.getSetting().get("DELIMITER"));

			if (this.getSetting().get("DATA_COUNT") != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
			}

// 2022cvt_015
            // var lineData = rtrim(lineData, "\r\n");
			// var lineData = lineData.replace("\r\n");
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");

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

	editBillData(A_billData: any[]) //戻り値用配列
	//ファイルを１行ずつ処理する
	{
// 2022cvt_015
		var H_rtnData = Array();

// 2022cvt_015
		for (var lineData of (A_billData)) //カラムに分割
		//電話番号を取得
		//電話番号有り
		{
// 2022cvt_015
            // var A_lineData = split(this.getSetting().DELIMITER, rtrim(lineData));
			var A_lineData = lineData.split(this.getSetting().get("DELIMITER"), lineData.trimEnd());
// 2022cvt_015
			// var telno = trim(A_lineData[8], "\"");
			var telno = A_lineData[8].replace("\"", "");

			if ("00000000000" != telno + "") //税区分置き換え
				//会社合計金額を取得
				{
// 2022cvt_020
// 2022cvt_015
					// var taxStr = str_replace("  ", "", trim(A_lineData[14], "\""));
					var taxStr = A_lineData[14].replace("\"", "").replace("  ", "");
					var taxKubun: any;

					if ("" == taxStr) {
// 2022cvt_015
						taxKubun = 0;
					} else if ("合算" == taxStr) {
						taxKubun = 1;
					} else if ("個別" == taxStr) {
						taxKubun = 2;
					} else if ("内税" == taxStr) {
						taxKubun = 3;
					} else if ("対象外" == taxStr) {
						taxKubun = 4;
					}

					if (undefined !== H_rtnData[telno] == false) //配列要素に有る電話番号の場合
						{
							H_rtnData[telno][0] = {
								// code: trim(A_lineData[3], "\"") + "-" + trim(A_lineData[4], "\""),
								code: A_lineData[3].replace("\"", "") + "-" + A_lineData[4].replace("\"", ""),
								// codename: trim(A_lineData[11], "\""),
								codename: A_lineData[11].replace("\"", ""),
								// charge: +trim(A_lineData[12], "\""),
								charge: +A_lineData[12].replace("\"", ""),
								taxkubun: taxKubun,
								// bikou: rtrim(trim(A_lineData[15], "\""), "  "),
								bikou: A_lineData[15].replace("\"", "").trimEnd(),
								// prtelno: trim(A_lineData[1], "\"")
								prtelno: A_lineData[1].replace("\"", "")
							};
						} else {
						H_rtnData[telno][H_rtnData[telno].length] = {
							// code: trim(A_lineData[3], "\"") + "-" + trim(A_lineData[4], "\""),
							code: A_lineData[3].replace("\"", "") + "-" + A_lineData[4].replace("\"", ""),
							// codename: trim(A_lineData[11], "\""),
							codename: A_lineData[11].replace("\"", ""),
							// charge: +trim(A_lineData[12], "\""),
							charge: +A_lineData[12].replace("\"", ""),
							taxkubun: taxKubun,
							// bikou: rtrim(trim(A_lineData[15], "\""), "  "),
							bikou: A_lineData[15].replace("\"", "").replace("  ", ""),
							// prtelno: trim(A_lineData[1], "\"")
							prtelno: A_lineData[1].replace("\"", "").replace("  ", "")
						};
					}
				} else //合計
				{
					// if ("Z0" == trim(A_lineData[3], "\"") + "") //複数ファイル対応
					if ("Z0" == A_lineData[3].replace("\"", "") + "") //複数ファイル対応
						//会社合計がまだ無い場合
						{
							if (undefined !== H_rtnData[telno] == false) //会社合計が既に有る場合
								{
									H_rtnData[telno][0] = {
										// charge: +trim(A_lineData[12], "\"")
										charge: +A_lineData[12].replace("\"", "")
									};
								} else {
								H_rtnData[telno][H_rtnData[telno].length] = {
									// charge: +trim(A_lineData[12], "\"")
									charge: +A_lineData[12].replace("\"", "")
								};
							}
						}
				}
		}

		return H_rtnData;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
