import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import * as Encoding from "encoding-japanese";

// const fs = require('fs');
import * as fs from "fs";
import PATH from "path";

//
//__construct
//
//@author houshiyama
//@since 2011/04/08
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//請求データディレクトリ取得
//
//@author
//@since 2011/04/08
//
//@param mixed $BillDate
//@access public
//@return void
//
//
//未登録の内訳コードを見つける
//
//@author houshiyama
//@since 2011/04/12
//
//@param mixed $fileName
//@param mixed $H_utiwake
//@access public
//@return void
//
//
//ファイル内容をかみ砕いて取得<br>
//DBのテーブルに合わせた形に加工
//
//@author
//@since 2011/04/08
//
//@param mixed $pactid
//@param mixed $fileName
//@access public
//@return void
//
//更新履歴
//データ取得開始列を修正 $ccnt<6 を $ccnt<5 へ 20130717 s.maeda
//
//
//連想配列から指定したキーの配列を作る
//
//@author houshiyama
//@since 2011/04/26
//
//@param mixed $A_array
//@param mixed $key
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2011/04/08
//
//@access public
//@return void
//
export default class ImportWillcomModel extends ModelBase {
	static UNREGIST_CODETYPE = 4;
	static UNREGIST_KAMOKU = 6;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	getDataDir(BillDate: string) {
// 2022cvt_015
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + BillDate + this.getSetting().WILLCOM_DIR + "/bill/";
		return dataDir;
	}

	getUnregistCode(fileName: string, H_utiwake: any) //行番号
	{
// 2022cvt_015
		var A_data;
// 2022cvt_015
		var cnt = 0;
// 2022cvt_015
        // var fp = fopen(fileName, "r");
		var fp = fs.readFileSync(fileName, "utf8");
// 2022cvt_015
		// var A_file = file(fileName);
		var buffer = fs.readFileSync('utf8.txt', 'utf8');
		var text = Encoding.convert(buffer, {
           from: 'SJIS',
           to: 'UNICODE', 
           type: 'string',
        });
		var A_file = text.toString().split("\r/n");
// 2022cvt_015
		var A_utiwakeNew = Array();

		while (false !== (A_data = this.fgetcsv_reg(fp))) {
// 2022cvt_015
			// mb_convert_variables("UTF8", "SJIS-win", A_data);

			switch (cnt) {
				case 0:
// 2022cvt_015
					var A_codename = A_data;
					break;

				case 1:
// 2022cvt_015
					var A_code = A_data;
					break;

				case 2:
// 2022cvt_015
					var A_taxkubun = A_data;
					break;

				default:
					break;
			}

			cnt++;
		}

		// fclose(fp);
		// fs.closeSync(fp);

		if (A_codename.length != A_code.length || A_codename.length != A_taxkubun.length) {
			// throw new Error(fileName + " \u306E\u30D8\u30C3\u30C0\u30FC\u90E8\u5206\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
			throw new Error(fileName + " のヘッダー部分が不正です\n");
		}

// 2022cvt_015
		for (var i = 0; i < A_code.length; i++) {
			if (i < 5 || "" == A_code[i].trim()) {
				continue;
			}

			if (A_code[i] in H_utiwake) {
				continue;
			}

// 2022cvt_015
			var code = A_code[i];
// 2022cvt_015
			var name = A_codename[i];
// 2022cvt_016
// 2022cvt_015
			var codetype = ImportWillcomModel.UNREGIST_CODETYPE;
// 2022cvt_015
			var kamoku = ImportWillcomModel.UNREGIST_KAMOKU;
// 2022cvt_015
			var carid = this.getSetting().get("WILLCOM_CARID");
// 2022cvt_016
// 2022cvt_015
			var taxtype = A_taxkubun[i].trim();
			var fixdate: any;
			var recdate:any;
// 2022cvt_015
			// var recdate = fixdate = date("Y-m-d H:i:s");
			recdate = fixdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

// 2022cvt_016
			switch (taxtype) {
				case "外税":
// 2022cvt_016
					taxtype = "1";
					break;

				case "内税":
// 2022cvt_016
					taxtype = "3";
					break;

				case "税対象外":
// 2022cvt_016
					taxtype = "4";
					break;

				case "対象外":
// 2022cvt_016
					taxtype = "4";
					break;

				case "":
					break;

				default:
// 2022cvt_016
					// throw new Error(taxtype + " \u306F\u65B0\u305F\u306A\u7A0E\u533A\u5206\u3067\u3059\n", 1);
					throw new Error(taxtype + " は新たな税区分です\n");
					break;
			}

			this.warningOut(1000, "不明な内訳コード：" + code + " の\"" + name + "\"を登録します\n", 0);
// 2022cvt_016
			// A_utiwakeNew.push(compact("code", "name", "codetype", "kamoku", "taxtype", "carid", "recdate", "fixdate"));
			A_utiwakeNew.push({
				code: "code", 
				name: "name", 
				codetype: "codetype",
				kamoku: "kamoku",
				taxtype: "taxtype",
				carid: "carid",
				recdate: "recdate",
				fixdate: "fixdate"
			});
		}

		return A_utiwakeNew;
	}

	getBillData(pactid: any, fileName: string) //チェック完了したデータを格納
	//行番号
	//データ行を取得
	//一行をさらに列分のデータにする（空じゃなければ）
	//データが１行もなかった場合はエラー
	{
// 2022cvt_015
		var A_data: any;
// 2022cvt_015
		var H_data = Array();
// 2022cvt_015
		// var A_file = preg_split("/_|\\./", basename(fileName));
		var path = PATH.parse(fileName);
		var A_file = path.base.split("/_|\\./");

// 2022cvt_015
		var cnt = 0;
// 2022cvt_015
		// var fp = fopen(fileName, "r");
		var fp = fs.readFileSync(fileName, "utf8");
		var buffer = fs.readFileSync('utf8.txt', 'utf8');
		var text = Encoding.convert(buffer, {
           from: 'SJIS',
           to: 'UNICODE', 
           type: 'string',
        });
		A_data = text.toString().split("\r\n");

		while (false !== (A_data = this.fgetcsv_reg(fp))) {
// 2022cvt_015
			// mb_convert_variables("UTF8", "SJIS-win", A_data);

			switch (cnt) {
				case 0:
// 2022cvt_015
					var A_codename = A_data;
					break;

				case 1:
// 2022cvt_015
					var A_code = A_data;
					break;

				case 2:
// 2022cvt_015
					var A_taxkubun = A_data;
					break;

				default:
					if (!!A_data) //$H_tmp["employeecode"] = $A_data[3];
						//表示順
						//列ループ
						{
// 2022cvt_015
							var H_tmp: { [key: string]: any } = {};
							H_tmp.pactid = pactid;
							H_tmp.userpostid = A_data[0];
							H_tmp.postname = A_data[1];
							H_tmp.telno = A_data[2].replace(/-/g, "");
							H_tmp.telno_view = A_data[2];
							H_tmp.carid = this.getSetting().WILLCOM_CARID;
							H_tmp.cirid = this.getSetting().WILLCOM_CIRID;
							H_tmp.arid = this.getSetting().get("ARID");
							H_tmp.username = A_data[3];
							H_tmp.planname = A_data[4];
							// H_tmp.recdate = date("Y-m-d H:i:s");
							// H_tmp.fixdate = date("Y-m-d H:i:s");
							H_tmp.recdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
							H_tmp.fixdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
							H_tmp.prtelno = A_file[0];
// 2022cvt_015
							var detailno = 1;

// 2022cvt_015
							for (var ccnt = 0; ccnt < A_data.length; ccnt++) //データ取得開始列を修正 $ccnt<6 を $ccnt<5 へ 20130717 s.maeda
							{
								if (ccnt < 5) {
									continue;
								}

								if ("" == A_data[ccnt].trim()) {
									continue;
								}

								H_tmp.code = A_code[ccnt];
								H_tmp.codename = A_codename[ccnt];
								H_tmp.taxkubun = A_taxkubun[ccnt];
								H_tmp.charge = A_data[ccnt];
								H_tmp.detailno = detailno;
								H_data.push(H_tmp);
								detailno++;
							}
						}

					break;
			}

			cnt++;
		}

		// fclose(fp);
		// fs.closeSync(fp);

		if (cnt === 0) {
			// throw new Error(fileName + " \u306B\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\n", 1);
			throw new Error(fileName + " にデータがありません\n");
		}

		return H_data;
	}

	convertSimpleArray(A_array: string | any[], key: string | number) {
// 2022cvt_015
		var A_return = Array();

// 2022cvt_015
		for (var i = 0; i < A_array.length; i++) {
			A_return.push(A_array[i][key]);
		}

		return A_return;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
