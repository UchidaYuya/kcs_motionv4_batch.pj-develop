//ＫＧ対応 KCS Motion上の電話の所属部署がＦＥＳＴＡ上の電話の部署情報と同じかをチェックする （Model）

import MtScriptAmbient from '../../MtScriptAmbient';
import ModelBase from '../ModelBase';

const fs = require('fs');
const Iconv  = require('iconv').Iconv;
export default class KgCheckTelnoPostidModel extends ModelBase {
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	chkFestaData(fileName: string) //エラーフラグ（false:エラー無し、true:エラー有り）
	{
		var errFlg = false;
		var H_checkedData = Array();
		var lineCounter = 1;
		var A_fileData = fs.readFileSync(fileName).toString().split('\r\n');

		if (A_fileData.length == 0) {
			errFlg = true;
			this.warningOut(1000, fileName + " が不正です\n", 1);
		}

		for (var lineData of A_fileData) //項目数エラー
		{
			var A_lineData = lineData.replace("\r\n",).split("\t");

			if (this.getSetting().get("DATA_COUNT") != A_lineData.length) {
				errFlg = true;
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

	editFestaData(H_billData: any[]) //ファイル種類毎に処理する
	{
		var H_rtnData = Array();

		for (var fileType of this.getSetting().get("A_FILE_HEAD_LIST")) //ファイルを１行ずつ処理する
		{
			for (var lineData of H_billData[fileType]) //改行コード除去
			{
				lineData = lineData.replace("\r\n","");
				const iconv = new Iconv('SJIS-WIN', 'UTF-8');
				lineData = iconv.convert(lineData);
				const telno = lineData.substr(0, 4);
				const userPostid = lineData.substr(4, 5);
				H_rtnData[fileType][telno] = userPostid;
			}
		}

		return H_rtnData;
	}


};
