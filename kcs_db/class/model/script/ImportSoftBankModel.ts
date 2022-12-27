import ModelBase from "../../model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import * as Encoding from "encoding-japanese";

// const fs = require('fs');
import * as fs from "fs";
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
export default class ImportSoftBankModel extends ModelBase {
	static UNREGIST_CODETYPE = 4;
	static UNREGIST_KAMOKU = 6;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	getDataDir(BillDate: string) {
// 2022cvt_015
		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + BillDate + this.getSetting().SOFTBANK_DIR + "/bill/";
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
		var A_file = text.toString().split("\r\n");

// 2022cvt_015
		var A_utiwakeNew = Array();

		while (false !== (A_data = this.fgetcsv_reg(fp))) {
// 2022cvt_015
			// mb_convert_variables("UTF8", "SJIS", A_data);

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
			// throw new Error(fileName + " のヘッダー部分が不正です", 1);
			throw new Error(fileName + " のヘッダー部分が不正です");
		
		}

// 2022cvt_015
		for (var i = 0; i < A_code.length; i++) {
			if (i < 6 || "" == A_code[i].trim()) {
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
			var codetype = ImportSoftBankModel.UNREGIST_CODETYPE;
// 2022cvt_015
			var kamoku = ImportSoftBankModel.UNREGIST_KAMOKU;
// 2022cvt_015
			var carid = this.getSetting().SOFTBANK_CARID;
// 2022cvt_016
// 2022cvt_015
			var taxtype = A_taxkubun[i].trim();
// 2022cvt_015
			// var recdate = fixdate = date("Y-m-d H:i:s");
			var recdate = fixdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
			var fixdate = recdate;

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

				case "":
					break;

				default:
// 2022cvt_016
					// throw new Error(taxtype + " は新たな税区分です", 1);
					throw new Error(taxtype + " は新たな税区分です");
					break;
			}

			this.warningOut(1000, "不明な内訳コード" + code + " の\"" + name + "\"を登録します\n", 0);
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
	//$A_file = preg_split("/_|\./", basename($fileName));
	//ファイル名にドットが使われていると親番号に意図しない文字列が入るので修正
	//basenameから拡張子を抜く
	//行番号
	//明細番号の保存用
	//データ行を取得
	//一行をさらに列分のデータにする（空じゃなければ）
	//データが１行もなかった場合はエラー
	{
// 2022cvt_015
		var A_data: any;
// 2022cvt_015
		var H_data = Array();
// 2022cvt_015
		var basename = basename(fileName).replace(/\.csv$/g, "");
// 2022cvt_015
		var A_file = [basename.substring(0, basename.length - 7), basename.substring(-6), ".csv"];
// 2022cvt_015
		var cnt = 0;
// 2022cvt_015
		// var fp = fopen(fileName, "r");
		var fp = fs.readFileSync(fileName, "utf-8");
// 2022cvt_015
		var H_detailno = Array();

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
					if (!!A_data) //電話番号と機種契約番号が空の場合breakする。(花島)
						//if(empty($A_data[2]) && empty($A_data[4])){
						//							break;
						//						}
						//電話番号が空の場合、機種契約番号を入れる(花島)
						//同一電話番号が複数行になった場合の明細番号を連番にする 2020-02-04
						//ソフトバンクの仕様変更により配列3,4,5を6,7,8に変更(花島)
						//列ループ
						{
// 2022cvt_015
							var telno = !A_data[2] ? A_data[4] : A_data[2];
// 2022cvt_015
							var H_total_tmp = undefined;

							if (!!telno && undefined !== H_detailno[telno]) //if(empty($H_tmp["code"]) && $H_tmp["codename"] == "合計"){
								//								$H_total_tmp = array_pop($H_data);
								//								$detailno = $H_detailno[$telno];	// 表示順
								//							}
								//							else{
								//								$detailno = $H_detailno[$telno] + 1;	// 表示順
								//							}
								//表示順
								{
// 2022cvt_015
									var detailno = H_detailno[telno] + 1;
								} else //表示順
								{
									detailno = 1;
								}

// 2022cvt_015
							var H_tmp: { [key: string]: any } = {};
							H_tmp.pactid = pactid;
							H_tmp.userpostid = A_data[0];
							H_tmp.postname = A_data[1];
							H_tmp.telno = telno.replace(/-/g, "");
							H_tmp.telno_view = telno;
							H_tmp.carid = this.getSetting().SOFTBANK_CARID;
							H_tmp.cirid = this.getSetting().SOFTBANK_CIRID;
							H_tmp.arid = this.getSetting().get("ARID");
							H_tmp.employeecode = A_data[6];
							H_tmp.username = A_data[7];
							H_tmp.planname = A_data[8];
							// H_tmp.recdate = date("Y-m-d H:i:s");
							// H_tmp.fixdate = date("Y-m-d H:i:s");
							H_tmp.recdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
							H_tmp.fixdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
							H_tmp.prtelno = A_file[0];

// 2022cvt_015
							for (var ccnt = 9; ccnt < A_data.length; ccnt++) //if ($ccnt < 9) {
							//continue;
							//}
							//複数行になった場合に合計行が複数になるので1行に集約する 2020-02-04
							//$charge_tmp = 0;
							//							if(!is_null($H_total_tmp) && empty($H_tmp["code"]) && $H_tmp["codename"] == "合計"){
							//								$charge_tmp = (int)$H_total_tmp["charge"];
							//							}
							//							$H_tmp["charge"]   = $A_data[$ccnt] + $charge_tmp;
							//明細番号を保存
							{
								if ("" == A_data[ccnt].trim()) {
									continue;
								}

								H_tmp.code = A_code[ccnt];
								H_tmp.codename = A_codename[ccnt];
								H_tmp.taxkubun = A_taxkubun[ccnt];
								H_tmp.charge = A_data[ccnt];
								H_tmp.detailno = detailno;
								H_data.push(H_tmp);
								H_detailno[telno] = detailno;
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
			// throw new Error(fileName + " にデータがありません", 1);
			throw new Error(fileName + " にデータがありません");
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
