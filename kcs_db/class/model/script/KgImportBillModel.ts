//
//ＫＧ請求データ（転送用内線別月報ファイル）取込処理 （Model）
//


import ModelBase from '../ModelBase';
import MtScriptAmbient from '../../MtScriptAmbient';

import Encoding from 'encoding-japanese';
const fs = require("fs"); 
export default class KgImportBillModel extends ModelBase {
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName: string, baseName: string)
	{
		var errFlg:boolean = false;
		var lineCounter:number = 1;

		// ファイル読み込み
		var A_fileData = fs.readFileSync(fileName,"utf8").split('\n');

		// データが１行もなかった場合はエラー
		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}
		
		// ファイルを１行ずつ処理する
		for (var lineData of A_fileData)
		{
			var A_lineData = lineData.trim().split(this.getSetting().get("DELIM_BILL"));

			// 項目数エラー
			if (this.getSetting().get("DATA_COUNT_BILL") != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
			}

			lineCounter++;
		}

		// エラー無し
		if (false == errFlg) 
		{
			// ファイルデータを返す
			return { [baseName]: A_fileData };
		} else { // エラー有り
			return false;
		}
	}

	editBillData(H_billData) //拠点一覧を取得
	{
		
		const A_baseName = Object.keys(H_billData);
		let H_rtnData = {};
		A_baseName.sort();
		
		for (let baseName of A_baseName) //ファイルを１行ずつ処理する
		{	
			for (let lineData of H_billData[baseName]) 
			{
				lineData = lineData.replace("\r\n","");
							
				lineData = Encoding.convert(lineData, {
					from: "SJIS",
					to: "UNICODE",
					type: "string"
				});
				const A_lineData = lineData.trim().split(this.getSetting().get("DELIM_BILL"))
				let detailno = 0;
				const telno = A_lineData[1].split('\"').join('');
				
				for (const listNo of this.getSetting().getArray("A_PRINTTERN_LIST")) //呼種番号を取得
				{
					const kosyuNo = "TUWA" + listNo + "_KOSYU";
					const ryoukinNo = "TUWA" + listNo + "_RYOUKIN_COL";
					
					const code = this.getSetting().get(kosyuNo) + "-" + this.getSetting().get(ryoukinNo);
					const colNo = Number(this.getSetting().get("HEADDATA_COUNT")) + Number(this.getSetting().get("TUWADATA_COUNT")) * (listNo - 1) + Number(this.getSetting().get(ryoukinNo)) + Number(this.getSetting().get("TUWA_RYOUKIN_HEAD_COUNT")) - 1;
					
					const charge = +A_lineData[colNo].split('\"').join('');

					if (0 != charge) //必要なデータのみ保持する array(拠点名(array(電話番号 => array(明細行番号 => DBDATA))))
					{
						H_rtnData[baseName] = {
							[telno] : {
								[detailno] : {
									code: code,
									charge: charge
								}
							}
						};
						detailno++;
					}
				}
			}
		}
		
		return H_rtnData;
	}

	async getTelnoBasename(pactid: string, tableno: string | undefined, carid: number) //現在テーブル
	//レコード数
	//１行ずつ処理し連想配列に格納する array(text1 => telno)
	{
		let H_dbData = {};

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "tel_tb";
			} else {
			tableName = "tel_" + tableno + "_tb";
		}

		const sql = "select telno,text1 " + "from " + tableName + " " + "where pactid = " + pactid + " " + "and carid = " + carid + " " + "order by text1,telno";
		
		const H_result = await this.getDB().queryHash(sql);
		const recCnt = H_result.length;

		for (let recCounter = 0; recCounter < recCnt; recCounter++) {
			if (false == (undefined !== H_dbData[H_result[recCounter].text1])) {
				H_dbData[H_result[recCounter].text1] = [H_result[recCounter].telno];
			} else {
				H_dbData[H_result[recCounter].text1].push(H_result[recCounter].telno);
			}
		}
		return H_dbData;
	}

};