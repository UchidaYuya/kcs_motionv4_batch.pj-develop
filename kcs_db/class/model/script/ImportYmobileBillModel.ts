//Ymobileインポート
//    WILLCOMのインポートを元にしている
//    (WILLCOMとファイル構成が同じと聞いたので・・)
//    2019527 伊達改造
// //error_reporting(E_ALL|E_STRICT);// 2022cvt_011
//データ取得開始位置 20190523伊達
//
//ImportYmobileBillModel
//
//@uses ModelBase
//@package
//@author web
//@since 2019/05/27
//


import ModelBase from "../../../class/model/ModelBase";
import MtScriptAmbient from "../../MtScriptAmbient";
import * as fs from "fs";
import * as Encoding from "encoding-japanese";
import { parse } from "csv-parse/sync";
import * as PATH from "path";
// require("model/ModelBase.php");

const DATA_ENTRY = 9;

export default class ImportYmobileBillModel extends ModelBase {
	static UNREGIST_CODETYPE = 4;
	static UNREGIST_KAMOKU = 6;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	getDataDir(BillDate: string) {

		var dataDir = this.getSetting().get("KCS_DIR") + this.getSetting().get("KCS_DATA") + "/" + BillDate + this.getSetting().DATA_DIR + "/bill/";
		return dataDir;
	}

	getUnregistCode(fileName: string, H_utiwake: { [key: string]: any }) //行番号
	{

		var cnt = 0;

		var buffer = fs.readFileSync(fileName, "utf8");
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		})
		var options = { escape: "\\" }
		var rows = parse(text, options);
		// var fp = fopen(fileName, "r");

		// var A_file = file(fileName);

		var A_utiwakeNew = Array();


		var A_codename = "";
		var A_code = "";
		var A_taxkubun = "";

		for (var A_data in rows) {
		// while (false !== (A_data = this.fgetcsv_reg(fp))) {

			// mb_convert_variables("UTF8", "SJIS-win", A_data);

			switch (cnt) {
				case 0:

					A_codename = A_data;
					break;

				case 1:

					A_code = A_data;
					break;

				case 2:

					A_taxkubun = A_data;
					break;

				default:
					break;
			}

			cnt++;
		}

		// fclose(fp);

		if (A_codename.length != A_code.length || A_codename.length != A_taxkubun.length) {
			throw new Error(fileName + " のヘッダー部分が不正です\n");
		}


		for (var i = DATA_ENTRY; i < A_code.length; i++) {
			if ("" == A_code[i].trim()) {
				continue;
			}

			if (A_code[i] in H_utiwake) {
				continue;
			}


			var code = A_code[i];

			var name = A_codename[i];
// 2022cvt_016

			var codetype = ImportYmobileBillModel.UNREGIST_CODETYPE;

			var kamoku = ImportYmobileBillModel.UNREGIST_KAMOKU;

			var carid = this.getSetting().get("CARID");
// 2022cvt_016

			var taxtype = A_taxkubun[i].trim();

			var recdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

			var fixdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

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
					throw new Error(taxtype + " は新たな税区分です\n");
					break;
			}

			this.warningOut(1000, "不明な内訳コード：" + code + " の\"" + name + "\"を登録します\n", 0);
// 2022cvt_016
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

	getBillData(pactid: string, fileName: string) //チェック完了したデータを格納
	//$A_file = preg_split("/_|\./", basename($fileName));
	//_yyyymm.csv$を削除するように修正 20190617伊達
	//ログインIDに_が含まれている場合、そこで区切られてしまうので修正(´・ω・`) 20190617
	//_yyyymm.csvを取り除く
	//行番号
	//明細番号の保存用
	//データ行を取得
	//一行をさらに列分のデータにする（空じゃなければ）
	//データが１行もなかった場合はエラー
	{

		var H_data = Array();

		// var pattern = ["/_(\\d){6}(.csv)$/", "/.csv$/"];

		var path = PATH.parse(fileName);
		var prtelno = path.base.replace("/_(\\d){6}(.csv)$/", "").replace("/.csv$/", "");
		// var prtelno = preg_replace(pattern, "", basename(fileName));

		var cnt = 0;

		var buffer = fs.readFileSync(fileName);
		var text = Encoding.convert(buffer, {
			from: "SJIS",
			to: "UNICODE",
			type: "string"
		});
		var options = { escape: "\\" }
		var rows = parse(text, options);
		// var fp = fopen(fileName, "r");

		var H_detailno = Array();
		var A_code = "";
		var A_codename = "";
		var A_taxkubun = "";

		for (var A_data in rows) {
		// while (false !== (A_data = this.fgetcsv_reg(fp))) {

			// mb_convert_variables("UTF8", "SJIS-win", A_data);

			switch (cnt) {
				case 0:

					A_codename = A_data;
					break;

				case 1:

					A_code = A_data;
					break;

				case 2:

					A_taxkubun = A_data;
					break;

				default:
					if (!!A_data) ////電話番号と機種契約番号が空の場合breakする。(花島)
						//						if(empty($A_data[2]) && empty($A_data[4])){
						//							break;
						//						}
						//電話番号が空の場合、機種契約番号を入れる(花島)
						//同一電話番号が複数行になった場合の明細番号を連番にする 2020-02-04
						//$H_tmp["employeecode"] = $A_data[3];
						//$H_tmp["prtelno"]      = $A_file[0];
						//// 列ループ
						//						for ($ccnt = 0; $ccnt < count($A_data); $ccnt++) {
						//							// データ取得開始列を修正 $ccnt<6 を $ccnt<5 へ 20130717 s.maeda
						//							if ($ccnt < 5) {
						//								continue;
						//							}
						//							if ("" == trim($A_data[$ccnt])) {
						//								continue;
						//							}
						//							$H_tmp["code"]     = $A_code[$ccnt];
						//							$H_tmp["codename"] = $A_codename[$ccnt];
						//							$H_tmp["taxkubun"] = $A_taxkubun[$ccnt];
						//							$H_tmp["charge"]   = $A_data[$ccnt];
						//							$H_tmp["detailno"] = $detailno;
						//							array_push($H_data, $H_tmp);
						//							$detailno++;
						//						}
						//
						//						//	↑　5未満無視ならccnt=5から始めればいいと思うけど、何か理由があるんかな(´・ω・`)
						{

							var telno = !A_data[2] ? A_data[4] : A_data[2];

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

									var detailno = H_detailno[telno] + 1;
								} else //表示順
								{
									detailno = 1;
								}


							var H_tmp: { [key: string]: any } = {};
							H_tmp.pactid = pactid;
							H_tmp.userpostid = A_data[0];
							H_tmp.postname = A_data[1];
							H_tmp.telno = telno.replace(/-/g, "");
							H_tmp.telno_view = telno;
							H_tmp.carid = this.getSetting().get("CARID");
							H_tmp.cirid = this.getSetting().get("CIRID");
							H_tmp.arid = this.getSetting().get("ARID");
							H_tmp.username = A_data[7];
							H_tmp.planname = A_data[8];
							H_tmp.recdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
							H_tmp.fixdate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
							H_tmp.prtelno = prtelno;


							for (var ccnt = DATA_ENTRY; ccnt < A_data.length; ccnt++) //複数行になった場合に合計行が複数になるので1行に集約する 2020-02-04
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

		if (cnt === 0) {
			throw new Error(fileName + " にデータがありません\n");
		}

		return H_data;
	}

	convertSimpleArray(A_array: Array<any>, key: string) {

		var A_return = Array();


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
