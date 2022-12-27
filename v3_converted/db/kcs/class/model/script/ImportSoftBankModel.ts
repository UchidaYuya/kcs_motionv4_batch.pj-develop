//
//ソフトバンク請求データ取込処理 （Model）
//
//更新履歴：<br>
//2011/04/08 宝子山浩平 作成
//
//ImportSoftBankModel
//
//@package script
//@subpackage Model
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2011/04/08
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

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
class ImportSoftBankModel extends ModelBase {
	static UNREGIST_CODETYPE = 4;
	static UNREGIST_KAMOKU = 6;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	getDataDir(BillDate) {
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + BillDate + this.getSetting().SOFTBANK_DIR + "/bill/";
		return dataDir;
	}

	getUnregistCode(fileName, H_utiwake) //行番号
	{
		var A_data;
		var cnt = 0;
		var fp = fopen(fileName, "r");
		var A_file = file(fileName);
		var A_utiwakeNew = Array();

		while (false !== (A_data = this.fgetcsv_reg(fp))) {
			mb_convert_variables("UTF8", "SJIS", A_data);

			switch (cnt) {
				case 0:
					var A_codename = A_data;
					break;

				case 1:
					var A_code = A_data;
					break;

				case 2:
					var A_taxkubun = A_data;
					break;

				default:
					break;
			}

			cnt++;
		}

		fclose(fp);

		if (A_codename.length != A_code.length || A_codename.length != A_taxkubun.length) {
			throw new Error(fileName + " \u306E\u30D8\u30C3\u30C0\u30FC\u90E8\u5206\u304C\u4E0D\u6B63\u3067\u3059\n", 1);
		}

		for (var i = 0; i < A_code.length; i++) {
			if (i < 6 || "" == A_code[i].trim()) {
				continue;
			}

			if (A_code[i] in H_utiwake) {
				continue;
			}

			var code = A_code[i];
			var name = A_codename[i];
			var codetype = ImportSoftBankModel.UNREGIST_CODETYPE;
			var kamoku = ImportSoftBankModel.UNREGIST_KAMOKU;
			var carid = this.getSetting().SOFTBANK_CARID;
			var taxtype = A_taxkubun[i].trim();
			var recdate = fixdate = date("Y-m-d H:i:s");

			switch (taxtype) {
				case "\u5916\u7A0E":
					taxtype = "1";
					break;

				case "\u5185\u7A0E":
					taxtype = "3";
					break;

				case "\u7A0E\u5BFE\u8C61\u5916":
					taxtype = "4";
					break;

				case "":
					break;

				default:
					throw new Error(taxtype + " \u306F\u65B0\u305F\u306A\u7A0E\u533A\u5206\u3067\u3059\n", 1);
					break;
			}

			this.warningOut(1000, "\u4E0D\u660E\u306A\u5185\u8A33\u30B3\u30FC\u30C9\uFF1A" + code + " \u306E\"" + name + "\"\u3092\u767B\u9332\u3057\u307E\u3059\n", 0);
			A_utiwakeNew.push(compact("code", "name", "codetype", "kamoku", "taxtype", "carid", "recdate", "fixdate"));
		}

		return A_utiwakeNew;
	}

	getBillData(pactid, fileName) //チェック完了したデータを格納
	//$A_file = preg_split("/_|\./", basename($fileName));
	//ファイル名にドットが使われていると親番号に意図しない文字列が入るので修正
	//basenameから拡張子を抜く
	//行番号
	//明細番号の保存用
	//データ行を取得
	//一行をさらに列分のデータにする（空じゃなければ）
	//データが１行もなかった場合はエラー
	{
		var A_data;
		var H_data = Array();
		var basename = basename(fileName).replace(/\.csv$/g, "");
		var A_file = [basename.substr(0, basename.length - 7), basename.substr(-6), ".csv"];
		var cnt = 0;
		var fp = fopen(fileName, "r");
		var H_detailno = Array();

		while (false !== (A_data = this.fgetcsv_reg(fp))) {
			mb_convert_variables("UTF8", "SJIS-win", A_data);

			switch (cnt) {
				case 0:
					var A_codename = A_data;
					break;

				case 1:
					var A_code = A_data;
					break;

				case 2:
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

							var H_tmp = Array();
							H_tmp.pactid = pactid;
							H_tmp.userpostid = A_data[0];
							H_tmp.postname = A_data[1];
							H_tmp.telno = telno.replace(/-/g, "");
							H_tmp.telno_view = telno;
							H_tmp.carid = this.getSetting().SOFTBANK_CARID;
							H_tmp.cirid = this.getSetting().SOFTBANK_CIRID;
							H_tmp.arid = this.getSetting().ARID;
							H_tmp.employeecode = A_data[6];
							H_tmp.username = A_data[7];
							H_tmp.planname = A_data[8];
							H_tmp.recdate = date("Y-m-d H:i:s");
							H_tmp.fixdate = date("Y-m-d H:i:s");
							H_tmp.prtelno = A_file[0];

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

		fclose(fp);

		if (cnt === 0) {
			throw new Error(fileName + " \u306B\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\n", 1);
		}

		return H_data;
	}

	convertSimpleArray(A_array, key) {
		var A_return = Array();

		for (var i = 0; i < A_array.length; i++) {
			A_return.push(A_array[i][key]);
		}

		return A_return;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};