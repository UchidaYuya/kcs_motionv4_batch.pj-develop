import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import * as fs from 'fs';
import * as Encoding from "encoding-japanese";

// const fs = require('fs');
//
//__construct
//
//@author maeda
//@since 2008/07/02
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//chkBillData
//
//@author maeda
//@since 2008/07/02
//
//@param mixed $fileName：ファイル名
//@access public
//@return ファイルデータ
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2008/07/02
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//__destruct
//
//@author maeda
//@since 2008/07/02
//
//@access public
//@return void
//
export default class SuoImportRicohMeisaiModel extends ModelBase {
	O_msa: MtScriptAmbient;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName: any) //エラーフラグ（false:エラー無し、true:エラー有り）
	//チェック完了したデータを格納
	//行番号
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
// 2022cvt_015
		var errFlg = false;
// 2022cvt_015
		var H_checkedData = Array();
// 2022cvt_015
		var lineCounter = 1;
// 2022cvt_015
		// var A_fileData = file(fileName);
		var A_fileData = fs.readFileSync(fileName).toString().split('\r\n');
		// const buffer = fs.readFileSync(fileName, 'utf8');
		// const text = Encoding.convert(buffer, {
        //    from: 'SJIS',
        //    to: 'UNICODE', 
        //    type: 'string',
        // });
		// var A_fileData = text.toString().split("\r\n");

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}

// 2022cvt_015
		for (var lineData of (A_fileData)) //項目数エラー
		{
// 2022cvt_015
            // var A_lineData = split("\t", rtrim(lineData, "\r\n"));
			var A_lineData = lineData.split("\t");

			if (this.getSetting().get("DATA_COUNT_MEISAI") != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ヘッダー行を除去
			//ファイルデータを返す
			//エラー有り
			{
// 2022cvt_015
				var A_rtnData = A_fileData.splice(1);
				return A_rtnData;
			} else {
			return Array();
		}
	}

	editBillData(A_billData: any) //ファイルを１行ずつ処理する
	{
// 2022cvt_015
		var H_rtnData = Array();

// 2022cvt_015
		for (var lineData of (A_billData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//必要なデータのみ保持する array(コピー機ＩＤ array(並び順 => DBDATA))
		{
// 2022cvt_015
			// var lineData = rtrim(lineData, "\r\n");
			var lineData = lineData.replace(lineData, "\r\n");
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			const buffer = fs.readFileSync(lineData, 'utf8');
			const text = Encoding.convert(buffer, {
			   from: 'SJIS',
			   to: 'UNICODE', 
			   type: 'string',
			});
			lineData = text.toString().split("\r\n");
// 2022cvt_015
			// var A_lineData = split("\t", rtrim(lineData));
			var A_lineData = lineData.split("\t", lineData.replace(lineData));
			// H_rtnData[trim(A_lineData[0], "\"") + ""][A_lineData[5] * 10] = {
			H_rtnData[A_lineData[0].replace("0") + ""][A_lineData[5] * 10] = {
				text1: A_lineData[1],
				text2: A_lineData[2],
				text3: A_lineData[3],
				text4: A_lineData[4]
			};
		}

		return H_rtnData;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
