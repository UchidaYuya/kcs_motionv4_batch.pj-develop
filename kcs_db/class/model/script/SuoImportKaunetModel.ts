
import ModelBase from '../../model/ModelBase';
import MtScriptAmbient from '../../MtScriptAmbient';
import * as fs from 'fs';
import * as Encoding from "encoding-japanese";

export class SuoImportKaunetModel extends ModelBase {

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
			var A_lineData = lineData.replace("\r\n","").split("\t");


			if (this.getSetting().get("DATA_COUNT") != A_lineData.length) {
				errFlg = true;
				// this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
			}

			lineCounter++;
		}

		errFlg = false;

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
		for (var lineData of A_billData) //改行コード除去

		//文字コード変換
		//カラムに分割
		//必要なデータのみ保持する array(注文管理コード => array(注文日 => array(注文番号 => array(赤黒区分 => array(注文明細番号 => DBDATA))))
		//小数点以下切捨て
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

			// var A_lineData = split("\t", lineData);
			var A_lineData = lineData.split("\t");
			H_rtnData[A_lineData[35]][A_lineData[8]][A_lineData[6]][A_lineData[4]][A_lineData[7]] = {
				registcomp: A_lineData[12],
				registpost: A_lineData[17],
				username: A_lineData[16],
				itemcode: A_lineData[37],
				itemname: A_lineData[40],
				itemsum: A_lineData[49] * 1,
				charge: +A_lineData[51],
				taxkubun: A_lineData[48],
				green1: A_lineData[44],
				green2: A_lineData[45],
				green3: A_lineData[46],
				green4: A_lineData[47],
				akakuroorder: A_lineData[10]
			};
		}

		return H_rtnData;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
