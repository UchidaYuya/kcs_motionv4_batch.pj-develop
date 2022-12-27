//ＫＧ通話明細データ（転送用詳細ファイル）取込処理 （Model）

import MtScriptAmbient from '../../MtScriptAmbient';
import ModelBase from '../ModelBase';

const PATH = require('path');
const {format} = require('util');
const Iconv  = require('iconv').Iconv;
export default class KgImportTuwaModel extends ModelBase {
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkBillData(fileName: string, baseName: any) //エラーフラグ（false:エラー無し、true:エラー有り）
	{
		let errFlg = false;
		let lineCounter = 1;
		const A_fileData = PATH.parse(fileName);

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}

		for (var lineData of A_fileData) //項目数エラー
		{
			var A_lineData = lineData.replace("\r\n","").split(this.getSetting().get("DELIM_TUWA"));

			if (this.getSetting().get("DATA_COUNT_TUWA") != A_lineData.length) {
				errFlg = true;
				this.warningOut(1000, fileName + " " + lineCounter + "行目の項目数が不正です\n", 1);
			}

			lineCounter++;
		}

		if (false == errFlg) //ファイルデータを返す
			{
				return {
					[baseName]: A_fileData
				};
			} else {
			return false;
		}
	}

	editBillData(H_billData: string) //拠点一覧を取得
	{
		var H_rtnData = Array();
		var A_baseName = Object.keys(H_billData);
		A_baseName.sort();

		for (var baseName of A_baseName) //ファイルを１行ずつ処理する
		{
			for (var lineData of H_billData[baseName]) //改行コード除去
			{
				var lineData = lineData.replace("\r\n",'');
				const iconv = new Iconv('SJIS-WIN', 'UTF-8');
				lineData = iconv.convert(lineData);
				var A_lineData = lineData.split(this.getSetting().get("DELIM_BILL"));

				if (A_lineData[2].replace("\"","") != this.getSetting().get("NAISEN")) {
					continue;
				}

				const telno = A_lineData[13].replace("\"","");
				const tmpDate = A_lineData[16].replace("\"","");
				const date = tmpDate.substr(0, 4) + "-" + tmpDate.substr(4, 2) + "-" + tmpDate.substr(6, 2) + " " + tmpDate.substr(8, 2) + ":" + tmpDate.substr(10, 2) + ":" + tmpDate.substr(12, 2);
				const tmpTime: any = A_lineData[3].replace("\"","");
				let hour: number = Math.floor(tmpTime / 3600);

				if (hour < 10) {
					hour = 0 + hour;
				}

				var time = format("%s%s", hour, new Date().toISOString()) + "0";
				var tmpKosyu = "KOSYU_NAME" + A_lineData[9].replace("\"","");
				var kosyu = this.getSetting()[tmpKosyu];

				if (undefined !== H_rtnData[baseName][telno] == false) //必要なデータのみ保持する array(拠点名(array(電話番号 => DBDATA)))
					//２重引用符除去
					{
						H_rtnData[baseName][telno] = [{
							date: date,
							time: time,
							totelno: A_lineData[20].replace("\"",""),
							charge: +A_lineData[4].replace("\"",""),
							toplace: kosyu
						}];
					} else {
					H_rtnData[baseName][telno].push({
						date: date,
						time: time,
						totelno: A_lineData[20].replace("\"",""),
						charge: +A_lineData[4].replace("\"",""),
						toplace: kosyu
					});
				}
			}
		}

		return H_rtnData;
	}

	async getTelnoBasename(pactid: string, tableno: string | undefined = undefined, carid: string) //現在テーブル
	//レコード数
	//１行ずつ処理し連想配列に格納する array(text1 => telno)
	{
		var H_dbData = Array();

		if (undefined == tableno) //過去テーブル
			{
				var tableName = "tel_tb";
			} else {
			tableName = "tel_" + tableno + "_tb";
		}

		var sql = "select telno,text1 " + "from " + tableName + " " + "where pactid = " + pactid + " " + "and carid = " + carid + " " + "order by text1,telno";
		var H_result = await this.getDB().queryHash(sql);
		var recCnt = H_result.length;

		for (var recCounter = 0; recCounter < recCnt; recCounter++) {
			if (false == (undefined !== H_dbData[H_result[recCounter].text1])) {
				H_dbData[H_result[recCounter].text1] = [H_result[recCounter].telno];
			} else {
				H_dbData[H_result[recCounter].text1].push(H_result[recCounter].telno);
			}
		}

		return H_dbData;
	}
};
