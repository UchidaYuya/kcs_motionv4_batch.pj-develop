
import ModelBase from '../../model/ModelBase';
import MtScriptAmbient from '../../MtScriptAmbient';
import * as fs from 'fs';
import * as Encoding from "encoding-japanese";

export class SuoImportSoftTeleModel extends ModelBase {

	O_msa: MtScriptAmbient;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName: string, A_sumData: any[], A_billData: any[], A_tuwaData: any[]) //エラーフラグ（false:エラー無し、true:エラー有り）
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
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}


		// for (var lineData of Object.values(A_fileData)) //使用するレコード区分のみ処理する
		for (var lineData of A_fileData)
		{

			var A_lineData =  lineData.replace("\r\n", "").split(",");

			var kubun = A_lineData[1].replace("\"","");

			if (kubun == this.getSetting().get("SUM_KUBUN") || kubun == this.getSetting().get("BILL_KUBUN") || kubun == this.getSetting().get("TUWA_KUBUN")) //項目数エラー
				{

					var variaName = "KUBUN" + kubun + "_COUNT";

					var dataCnt = this.getSetting()[variaName];

					if (dataCnt != A_lineData.length) {
						errFlg = true;
						this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
					}

					if (kubun == this.getSetting().get("SUM_KUBUN")) //使用するレコードのみ配列へ格納
						{
							A_sumData.push(lineData);
						} else if (kubun == this.getSetting().get("BILL_KUBUN")) //使用するレコードのみ配列へ格納
						{
							A_billData.push(lineData);
						} else if (kubun == this.getSetting().get("TUWA_KUBUN")) //使用するレコードのみ配列へ格納
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

	editSumData(A_sumData: any[]) //１行ずつ処理する
	{

		var billCharge = 0;


		// for (var lineData of Object.values(A_sumData) as any) {
		for (var lineData of A_sumData) {

			var A_lineData =  lineData.replace("\r\n").split(",");
			billCharge += A_lineData[7].replace("\"") / 100;
		}

		return billCharge;
	}

	editBillData(A_billData: Array<string>) //１行ずつ処理する
	{

		var H_rtnData:{ [key: string]: Array<any> } = {};

		var oldTelno = "";


		for (var lineData of A_billData) //改行コード除去
		//文字コード変換
		//カラムに分割
		//電話番号を取得
		//電話番号が変わった時の処理
		//必要なデータのみ保持する array(電話番号 => array(明細行番号 => DBDATA)
		{

			var lineData = lineData.replace("\r\n" , "");
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");

			const buffer = fs.readFileSync(lineData, 'utf8');
			const text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE', 
			type: 'string',
			});


			var A_lineData = lineData.split(",");

			var telnoview = A_lineData[4].replace("\"","");

			var detailno;

			// var telno = str_replace("-", "", telnoview);
			var telno = telnoview.replace("-", "");
			if (oldTelno != telno) //明細行番号をリセット
			{

				detailno = 0;
			}
			var taxCode;
			var taxName;
			if (A_lineData[10] != "") {

				taxCode = "TAX_CODE_" + A_lineData[10].replace("\"","");

				taxName = this.getSetting()[taxCode];
			} else {
				taxName = "null";
			}

			H_rtnData[telno][detailno] = {
				telnoview: telnoview,
				code: A_lineData[7].replace("\"", ""),
				codename: A_lineData[8].replace("\"", ""),
				charge: +A_lineData[9].replace("\"", ""),
				taxkubun: taxName,
				billno: A_lineData[3].replace("\"", "")
			};
			detailno++;
			oldTelno = telno;
		}

		return H_rtnData;
	}

	editTuwaData(A_tuwaData: any[]) //１行ずつ処理する
	{

		//var H_rtnData = Array();
		var H_rtnData:{ [key: string]: Array<any> } = {};//[文字][数値]の配列

		var oldTelno = "";
		var detailno = 0;

		// for (var lineData of Object.values(A_tuwaData) as any) //改行コード除去
		for (var lineData of A_tuwaData)
		//文字コード変換
		//カラムに分割
		//電話番号を取得
		//電話番号が変わった時の処理
		//必要なデータのみ保持する array(電話番号 => array(明細行番号 => DBDATA)
		{

			var lineData = lineData.replace("\r\n");
			// lineData = mb_convert_encoding(lineData, "UTF8", "SJIS-WIN");

			const buffer = fs.readFileSync(lineData, 'utf8');
			const text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE', 
			type: 'string',
			});

			var A_lineData = lineData.replace().split(",");

			// var telno = str_replace("-", "", A_lineData[4].split("\""));
			var telno = A_lineData[4].split("\"")("-", "");

			if (oldTelno != telno) //明細行番号をリセット
				{

					detailno = 0;
				}


			var date = A_lineData[7].replace("\"");

			var time = A_lineData[8].replace("\"");

			var startDate = date.substring(0, 4) + "-" + date.substring(4, 2) + "-" + date.substring(6, 2) + " " + time.substring(0, 2) + ":" + time.substring(2, 2) + ":" + time.substring(2, 2);

			var tuwatime = A_lineData[9].replace("\"").substring(0, 3) + ":" + A_lineData[9].replace("\"").substring(3, 2) + ":" + A_lineData[9].replace("\"").substring(5, 2) + "." + A_lineData[9].replace("\"").substring(7, 1);
			H_rtnData[telno][detailno] = {
				date: startDate,
				totelno: A_lineData[17].replace("\""),
				time: tuwatime,
				charge: +(A_lineData[12].replace("\"") / 100)
			};
			detailno++;
			oldTelno = telno;
		}

		return H_rtnData;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
