import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import * as fs from 'fs';
import * as Encoding from "encoding-japanese";

export default class SuoImportTanmatsuModel extends ModelBase {
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
			// var A_lineData = lineData.split(",",lineData.replace(lineData));
			var A_lineData = lineData.split(",");

			if (this.getSetting().get("TANMATSU_DATA_COUNT") != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
			}

			if ("" == A_lineData[0] || "" == A_lineData[1] || "" == A_lineData[3] || "" == A_lineData[4]) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "行目のデータに空欄があります\n", 1);
			}

			if (-1 !== this.getSetting().get("A_CARNO_LIST").indexOf(A_lineData[4]) == false) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "行目のキャリア番号が不正です\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return A_fileData;
			} else {
			return Array();
		}
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
