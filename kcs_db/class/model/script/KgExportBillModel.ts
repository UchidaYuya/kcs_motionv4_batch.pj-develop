//ＫＧ ＦＥＳＴＡ用データ出力処理 （Model）

import MtScriptAmbient from '../../MtScriptAmbient';
import ModelBase from '../ModelBase';

export default class KgExportBillModel extends ModelBase {
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	async getTelDetailsDataBaseName(pactid: string, tableno: string, carid: string, baseName: string, A_code_list: any[]) //拠点が東京
	//レコード数
	{	
		let H_dbData = {};
			
		let where = "where te.pactid = " + pactid + " and " + "te.carid = " + carid + " and " + "td.code in ('" + A_code_list.join(",") +"') and " + "te." + this.getSetting().get("BASENAME_COL") + " = '";
		
		if (baseName == this.getSetting().get("FILE_HEAD_TOKYO")) //同一電話番号用文字列置換え用
			{
				where += "東京'";
				var replaceStr = this.getSetting().get("LINE_BRANCH_TKY");
			} else if (baseName == this.getSetting().get("FILE_HEAD_OSAKA")) //同一電話番号用文字列置換え用
			{
				where += "大阪'";
				replaceStr = this.getSetting().get("LINE_BRANCH_OSK");
			} else {
			this.errorOut(1000, "拠点名が不正です\n", 0, "", "");
			return false;
		}

		const sql = "select te.telno,sum(td.charge) as charge " + "from tel_" + tableno + "_tb te inner join tel_details_" + tableno + "_tb td " + "on te.pactid = td.pactid and " + "te.carid = td.carid and " + "te.telno = td.telno " + where + " " + "group by te.telno " + "order by te.telno";
		
		const H_result = await this.getDB().queryRowHash(sql);
		
		const recCnt = H_result.length;

		for (var i = 0; i < recCnt; i++) {
			H_dbData[H_result[i].telno.replace(replaceStr, "")] = H_result[i].charge;
		}

		return H_dbData;
	}

};
