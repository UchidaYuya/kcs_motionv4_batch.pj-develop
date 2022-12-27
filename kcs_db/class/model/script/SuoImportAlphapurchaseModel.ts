import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import * as Encoding from "encoding-japanese";

// const fs = require('fs');
import * as fs from "fs";
//
//__construct
//
//@author maeda
//@since 2008/04/23
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//請求取込に使用するデータを抜き出し加工して配列に格納する
//
//@author maeda
//@since 2008/04/30
//
//@param mixed $A_billData : 加工前データ
//@access public
//@return 請求取り込み用データ
//
//
//__destruct
//
//@author maeda
//@since 2008/04/23
//
//@access public
//@return void
//
export default class SuoImportAlphapurchaseModel extends ModelBase {
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
		var H_checkedData = Array();
// 2022cvt_015
		var lineCounter = 1;
// 2022cvt_015
		// var A_fileData = file(fileName);
		var A_fileData = fs.readFileSync(fileName).toString().split('\r\n');
		// var buffer = fs.readFileSync(fileName, 'utf8');
		// var text = Encoding.convert(buffer, {
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
			// var A_lineData = split(",", rtrim(lineData, "\r\n"));
			var A_lineData = lineData.split(",");

			if (this.getSetting().get("DATA_COUNT") != A_lineData.length) {
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
			return false;
		}
	}

	editBillData(A_billData) //ファイルを１行ずつ処理する
	{
// 2022cvt_015
		var H_rtnData = Array();

// 2022cvt_015
		for (var lineData of (A_billData)) //改行コード除去
		//文字コード変換
		//カラムに分割
		//アルファパーチェスのエコフラグをKCS Motionでのエコフラグに付け替え
		//数量＆金額がマイナスなら赤伝扱いする
		//必要なデータのみ保持する array(申請者アカウント => array(受注日 => array(受注番号 => array(赤黒区分 => array(受注明細番号 => DBDATA)))
		{
// 2022cvt_015
			// var lineData = rtrim(lineData, "\r\n");
			var lineData = lineData.replace("\r\n");
			
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
// 2022cvt_015
			// var A_lineData = split(",", rtrim(lineData));
			var A_lineData = lineData.split(",", lineData.replace());
// 2022cvt_020
			// A_lineData[33] = str_replace("n", 0, A_lineData[33].toLowerCase());
			A_lineData[33] = A_lineData[33].toLowerCase().replace("n", 0);
// 2022cvt_020
			A_lineData[33] = A_lineData[33].toLowerCase().replace("y", 1);
// 2022cvt_020
			A_lineData[34] = A_lineData[34].toLowerCase().replace("n", 0);
// 2022cvt_020
			A_lineData[34] = A_lineData[34].toLowerCase().replace("y", 1);
// 2022cvt_020
			A_lineData[35] = A_lineData[35].toLowerCase().str_replace("n", 0);
// 2022cvt_020
			A_lineData[35] = A_lineData[35].toLowerCase().replace("y", 1);

			if (A_lineData[18] < 0 && A_lineData[19]) {
// 2022cvt_015
				var akakuro = 1;
			} else {
				akakuro = 0;
			}

			H_rtnData[A_lineData[32] + ""][A_lineData[7]][A_lineData[11]][akakuro][A_lineData[12]] = {
				registcomp: A_lineData[3],
				registpost: A_lineData[5],
				username: A_lineData[6],
				itemcode: A_lineData[14],
				itemname: A_lineData[15],
				itemsum: A_lineData[18],
				charge: A_lineData[19],
				tax: A_lineData[24],
				shiptoname1: A_lineData[29],
				shiptoname2: A_lineData[30],
				shiptoname3: A_lineData[31],
				green1: A_lineData[33],
				green2: A_lineData[34],
				green3: A_lineData[35],
				delcharge: A_lineData[36],
				delchargetax: A_lineData[37]
			};
		}

		return H_rtnData;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
