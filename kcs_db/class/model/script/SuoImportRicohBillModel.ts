
import ModelBase from '../../model/ModelBase';
import MtScriptAmbient from '../../MtScriptAmbient';

import * as fs from 'fs';
import * as Encoding from "encoding-japanese";

export class SuoImportRicohBillModel extends ModelBase {

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
		var errFlg = false;
		var H_checkedData = Array();
		var lineCounter = 1;
		// var A_fileData = file(fileName);
		var A_fileData = fs.readFileSync(fileName).toString().split('\r\n');

		if (A_fileData.length == 0) {
			errFlg = true;
			// this.warningOut(1000, fileName + " \u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}

		// for (var lineData of Object.values(A_fileData)) //項目数エラー
		for (var lineData of A_fileData)
		{
			// var A_lineData = split("\t", rtrim(lineData, "\r\n"));
			var A_lineData =  lineData.replace("\r\n","").split("\t");

			if (this.getSetting().get("DATA_COUNT_BILL") != A_lineData.length) {
				errFlg = true;
				// this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ヘッダー行を除去
			//ファイルデータを返す
			//エラー有り
			{
				var A_rtnData = A_fileData.splice(1);
				return A_rtnData;
			} else {
			return false;
		}
	}

	editBillData(A_billData: any[]) //ファイルを１行ずつ処理する
	{
		var H_rtnData = Array();

		// for (var lineData of Object.values(A_billData)) //改行コード除去
		for (var lineData of A_billData)
		//文字コード変換
		//カラムに分割
		//必要なデータのみ保持する array(コピー機ＩＤ => DBDATA)
		//２重引用符、３桁区切り文字除去
		{
			// var lineData = rtrim(lineData, "\r\n");
			var lineData = lineData.replace("\r\n","");
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");

			const buffer = fs.readFileSync(lineData, 'utf8');
			const text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE', 
			type: 'string',
			});
			// var A_lineData = split("\t", rtrim(lineData));
			var A_lineData = lineData.replace("").split("\t");
			// H_rtnData[trim(A_lineData[3], "\"") + ""] = {
			H_rtnData[A_lineData[3].replace("\"") + ""] = {
				// copyname: trim(A_lineData[0], "\""),
				copyname: A_lineData[0].replace("\""),

				// monocnt: str_replace(",", "", trim(A_lineData[4], "\"")),
				monocnt:  A_lineData[4].replace("\"").replace(",", ""),

				// monocntpast: str_replace(",", "", trim(A_lineData[5], "\"")),
				monocntpast:  A_lineData[5].replace("\"").replace(",", ""),

				// colorcnt: str_replace(",", "", trim(A_lineData[6], "\"")),
				colorcnt:  A_lineData[6].replace("\"").replace(",", ""),

				// colorcntpast: str_replace(",", "", trim(A_lineData[7], "\"")),
				colorcntpast:  A_lineData[7].replace("\"").replace(",", ""),

				charge:  A_lineData[12].replace("\"").replace(",", ""),

				tax:  A_lineData[13].replace("\"").replace(",", "")
			};
		}

		return H_rtnData;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
