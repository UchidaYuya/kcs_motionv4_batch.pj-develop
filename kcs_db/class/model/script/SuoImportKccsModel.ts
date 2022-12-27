
import ModelBase from '../ModelBase';
import MtScriptAmbient from '../../MtScriptAmbient';
import * as fs from 'fs';
import * as Encoding from 'encoding-japanese';

export class SuoImportKccsModel extends ModelBase {

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
		for (var lineData of A_fileData)
		{
			// var A_lineData = split("\t", rtrim(lineData, "\r\n"));
			var A_lineData = lineData.replace("\r\n", "").split("\t");

			if (this.getSetting().get("DATA_COUNT") != A_lineData.length) {
				errFlg = true;
				// this.warningOut(1000, fileName + " " + lineCounter + "\u884C\u76EE\u306E\u9805\u76EE\u6570\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
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

	editBillData(A_billData: any[]) //ファイルを１行ずつ処理する
	{
		var H_rtnData: { [key: string]: any } = {};
		var oldTelno = "";

		// for (var lineData of Object.values(A_billData)) //改行コード除去
		for (var lineData of A_billData)
		//文字コード変換
		//カラムに分割
		//電話番号有り
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

			// if ("" != trim(A_lineData[2], "\"") + "") //内訳コード有り
			if ("" != A_lineData[2].replace("\"") + "")
				//電話番号無し（グループ集計、会社集計）
				{
					// if ("" != trim(A_lineData[4], "\"")) //電話番号を取得
					if ("" != A_lineData[4].replace("\""))
						//電話番号が変わった時の処理
						//内訳コード無し（電話番号集計）
						{
							// var telnoView = trim(A_lineData[2], "\"");
							var telnoView = A_lineData[2].replace("\"");

							// var telno = str_replace("-", "", telnoView);
							var telno = telnoView.replace("-", "");

							var carid;
							var detailno;

							if (oldTelno != telno) //明細行番号をリセット
								//キャリアＩＤをリセット
								{
									// var detailno = 0;
									detailno = 0;
									// var carid = "";
									carid = "";
								}

							if ("" == carid) //キャリア名がＮＴＴの場合
								{
									// if ("NTT" == trim(A_lineData[3], "\"")) //キャリア名がＫＤＤＩの場合
									if ("NTT" == A_lineData[3].replace("\""))
										{

											// if (preg_match("/\u6771\u65E5\u672C/", A_lineData[8]) == true) {
											if ( A_lineData[8].match("/東日本/")) {
												carid = this.getSetting().get("KCCS_NTTEAST_CARID");
											} else {
												carid = this.getSetting().get("KCCS_NTTWEST_CARID");
											}
										} else {
										carid = this.getSetting().get("KCCS_CARID");
									}
								}

							H_rtnData[telno][detailno] = {
								telnoview: telnoView,
								// code: trim(A_lineData[4], "\""),
								code: A_lineData[4].split("\""),
								// charge: +trim(A_lineData[6], "\""),
								charge: +A_lineData[6].split("\""),
								carid: carid
							};
							detailno++;
							oldTelno = telno;
						} else //電話毎の消費税額を取得
						{
							// if (this.getSetting().CODENAME_TAX == trim(A_lineData[5], "\"")) {
							if (this.getSetting().get("CODENAME_TAX") == A_lineData[5].split("\"")) {							
								H_rtnData[telno][detailno] = {
									telnoview: telnoView,
									code: this.getSetting().get("UTIWAKE_TAX_CODE"),
									// charge: +trim(A_lineData[6], "\""),
									charge: +A_lineData[6].split("\""),
									carid: carid
								};
								detailno++;
								oldTelno = telno;
							}
						}
				} else //会社集計の場合
				{
					// if ("" == trim(A_lineData[0], "\"")) //会社全体の請求金額を取得
					if ("" == A_lineData[0].split("\""))
						{
							// if (this.getSetting().CODENAME_CHARGE == trim(A_lineData[5], "\"")) {
							if (this.getSetting().get("CODENAME_CHARGE") == A_lineData[5].split("\"")) {
								H_rtnData.allcharge[0] = {
									telnoview: "",
									code: "",
									// charge: +trim(A_lineData[6], "\""),
									harge: +A_lineData[6].split("\""),
									carid: ""
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
