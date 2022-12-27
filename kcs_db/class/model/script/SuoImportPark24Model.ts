import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import fs from "fs";
import Encoding from "encoding-japanese";
//
//__construct
//
//@author houshiyama
//@since 2010/11/29
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//請求データディレクトリ取得
//
//@author
//@since 2010/11/30
//
//@param mixed $BillDate
//@access public
//@return void
//
//
//ファイル内容をかみ砕いて取得<br>
//DBのテーブルに合わせた形に加工
//
//@author
//@since 2010/12/08
//
//@param mixed $pactid
//@param mixed $fileName
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2010/11/29
//
//@access public
//@return void
//
export default class SuoImportPark24Model extends ModelBase {

	static SEIKYU_CODE = "002";
	static SEIKYU_CODENAME = "請求金額";
	static CHUSHA_CODE = "001";
	static CHUSHA_CODENAME = "駐車料金";
	static ASPX_CODE = "ASPX";
	static ASPX_CODENAME = "ASP使用料（税込）";
	O_msa: MtScriptAmbient;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getDataDir(BillDate: string) {
// 2022cvt_015
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + BillDate + this.getSetting().PARK24_DIR + "/";
		return dataDir;
	}

	getBillData(pactid: any, fileName: string) //エラーフラグ（false:エラー無し、true:エラー有り）
	//行番号
	//チェック完了したデータを格納
	//ファイル読み込み
	//データが１行もなかった場合はエラー
	//エラー無し
	{
// 2022cvt_015
		var errFlg = false;
// 2022cvt_015
		var cnt = 0;
// 2022cvt_015
		var H_data = Array();
// 2022cvt_015
		// var A_fileData = file(fileName);
		var buffer = fs.readFileSync(fileName, 'utf8');
		var text = Encoding.convert(buffer, {
			from: 'SJIS',
			to: 'UNICODE', 
		    type: 'string'
		})
		var A_fileData = text.toString().split("\r\n");

		if (A_fileData.length == 0) {
			errFlg = true;
			throw new Error(fileName + " が不正です\n");
		}

// 2022cvt_015
		for (var line of (A_fileData)) {
			cnt++;

			if (1 < cnt) //データは2行目から
				//カンマ区切り
				//項目数エラー
				{
// 2022cvt_015
					// var A_line = split("\\,", rtrim(mb_convert_encoding(line, "UTF8", "SJIS"), "\r\n"));
					var A_line = line.replace("\r\n", "").split("\\,");

					if (this.getSetting().get("DATA_COUNT") != A_line.length && this.getSetting().get("DATA_COUNT") != A_line.length + 1) {
						errFlg = true;
						this.warningOut(1000, fileName + " " + cnt + "行目の項目数が不正です\n", 1);
					}

// 2022cvt_015
					var H_tmp: { [key: string]: any } = {};
// 2022cvt_015
					// var H_date = strptime(A_line[4], "%Y/%m/%d %H:%M");
					var H_date = new Date(Date.parse(A_line[4]));
					H_tmp.pactid = pactid;
					H_tmp.postname = A_line[1];
					H_tmp.cardno_view = A_line[3];
					H_tmp.cardno = A_line[3].replace(/-/g, "");
					H_tmp.in_id = A_line[4].replace(/\//g, "-");
					H_tmp.out_id = A_line[5].replace(/\//g, "-");
					H_tmp.charge = A_line[7];
					H_tmp.note = "駐車時間/（分）：" + A_line[6];
// 2022cvt_016
					H_tmp.car_type = A_line[8];
					H_tmp.in_name = A_line[9];

					if (true == (undefined !== A_line[10])) {
						H_tmp.discount1 = "車室番号：" + A_line[10];
					} else {
						H_tmp.discount1 = "";
					}

					H_tmp.code = SuoImportPark24Model.CHUSHA_CODE;
					H_tmp.codename = SuoImportPark24Model.CHUSHA_CODENAME;
					H_tmp.date = A_line[4];
					H_tmp.recdate = this.get_DB().getNow();
					H_tmp.fixdate = this.get_DB().getNow();
					H_tmp.delete_flg = "false";
					// H_tmp.date = H_date.tm_year + 1900 + "-" + (H_date.tm_mon + 1) + "-" + H_date.tm_mday;
					H_tmp.date = H_date.getFullYear() + "-" + (H_date.getMonth() +1) + "-" + H_date.getDate();
					H_tmp.cardcoid = this.getSetting().PARK24_CARDCOID;
					H_data.push(H_tmp);
				}
		}

		if (false == errFlg) //ファイルデータを返す
			//エラー有り
			{
				return H_data;
			} else {
			return Array();
		}
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
