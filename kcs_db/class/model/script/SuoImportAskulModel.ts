//error_reporting(E_ALL|E_STRICT);

// require("model/ModelBase.php");
import ModelBase from '../ModelBase';
import MtScriptAmbient from '../../MtScriptAmbient';
import * as fs from 'fs';
import * as Encoding from "encoding-japanese";

export class SuoImportAskulModel extends ModelBase {

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
			this.warningOut(1000, fileName + "が不正です\n", 1);
			
		}

		// for (var lineData of Object.values(A_fileData)) //項目数エラー
		for (var lineData of A_fileData) //項目数エラー

		{
			// var A_lineData = split("\t", rtrim(lineData, "\r\n"));
			var A_lineData = lineData.split("\t");

			if (this.getSetting().get("DATA_COUNT") != A_lineData.length) {
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
		//金額がマイナスの場合は数量をマイナスにする
		//必要なデータのみ保持する array(部門コード => array(売上日 => array(売上ＮＯ => array(売上行ＮＯ => DBDATA)))
		//２重引用符除去、小数点以下切捨て
		{
			// var lineData = rtrim(lineData, "\r\n");
			var lineData = lineData.replace("\r\n", "");
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");
			const buffer = fs.readFileSync(lineData, 'utf8');
			const text = Encoding.convert(buffer, {
				from: 'SJIS',
				to: 'UNICODE', 
				type: 'string',
			});
			// var A_lineData = split("\t", rtrim(lineData));
			var A_lineData = lineData.replace(lineData,"").split("\t");

			// if (trim(A_lineData[26], "\"") * 1 < 0) {
			if (A_lineData[26].replace("\"") * 1 < 0) {
				// var itemsum = trim(A_lineData[22], "\"") * -1;
				var itemsum = A_lineData[22].replace("\"") * -1;
			} else {
				// itemsum = trim(A_lineData[22], "\"") * 1;
				itemsum = A_lineData[22].replace("\"") * 1;

			}

			// var charge = trim(A_lineData[26], "\"") * 1;
			var charge = A_lineData[26].replace("\"") * 1;
			// H_rtnData[trim(A_lineData[40], "\"") + ""][trim(A_lineData[15], "\"")][trim(A_lineData[16], "\"")][trim(A_lineData[17], "\"")] = {
			H_rtnData[A_lineData[40].replace("\"") + ""][A_lineData[15].replace("\"")][A_lineData[16].replace("\"")][A_lineData[17].replace( "\"")] = {
			// 	registcomp: trim(A_lineData[7], "\""),
			registcomp: A_lineData[7].replace("\""),
			// 	registpost: trim(A_lineData[8], "\""),
			registpost: A_lineData[8].replace("\""),
			// 	registzip: trim(A_lineData[9], "\""),
			registzip: A_lineData[9].replace( "\""),
			// 	registaddr1: trim(A_lineData[10], "\""),
			registaddr1: A_lineData[10].replace("\""),
			// 	registaddr2: trim(A_lineData[11], "\""),
			registaddr2: A_lineData[11].replace("\""),
			// 	registbuilding: trim(A_lineData[12], "\""),
			registbuilding: A_lineData[12].replace("\""),
			// 	itemcode: trim(A_lineData[18], "\""),
			itemcode: A_lineData[18].replace("\""),
			// 	itemname: trim(A_lineData[21], "\""),
			itemname: A_lineData[21].replace("\""),
			itemsum: itemsum,
			charge: charge,
			// 	tax: +trim(A_lineData[37], "\""),
			tax: +A_lineData[37].replace("\""),
			// 	taxkubun: trim(A_lineData[39], "\""),
			taxkubun: A_lineData[39].replace("\""),
			// 	green1: trim(A_lineData[41], "\""),
			green1: A_lineData[41].replace("\""),
			// 	green2: trim(A_lineData[42], "\""),
			green2: A_lineData[42].replace("\""),
			// 	green3: trim(A_lineData[43], "\""),
			green3: A_lineData[43].replace("\""),
			// 	green4: trim(A_lineData[44], "\"")
			green4: A_lineData[44].replace("\"")
			};
		}

		return H_rtnData;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
