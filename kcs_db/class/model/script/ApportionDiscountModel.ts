//
//kddiサービス取込み 伊達
//
// //error_reporting(E_ALL|E_STRICT);// 2022cvt_011


// require("ImportBaseModel.php");
import ImportBaseModel from "../script/ImportBaseModel"


// require("MtAuthority.php");
import { DB_FETCHMODE_ORDERED } from "../../MtDBUtil";
import MtAuthority from "../../MtAuthority";

export const CLM_TELNO = 0;
export const CLM_TUWA = 1;
export const CLM_TUWA_K = 2;
export const CLM_TUWA_H = 3;
export const CLM_WARI_K = 4;
export const CLM_WARI_H = 5;
export const CLM_TAX = 6;
export const CLM_DETAILNO_K = 7;
export const CLM_DETAILNO_H = 8;
export const CLM_DETAILNO_TAX = 9;
export const CLM_CODE_K = 10;
export const CLM_CODE_H = 11;
export const CLM_POSTID = 12;
export const CLM_DETAILNO_TAIL = 13;
export const CLM_TUWA_TAX = 100;
export const CLM_NEW_TUWA_TAX = 101;
export const CLM_NEW_WARI = 102;
export const CLM_NEW_WARI_K = 103;
export const CLM_NEW_WARI_H = 104;
export const CLM_TUWA_OVER = 105;

export default class ApportionDiscountModel extends ImportBaseModel {
	pactid: number;
	utiwake: never[];
	asp: { [key: string]: any };
	A_Auth: any[];
	tbname: { [key: string]: any };
	detailno: {};

	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.pactid = 0;
		this.utiwake = [];
		// this.utiwake = undefined;
		this.asp = {};
		// this.asp = undefined;
		this.A_Auth = Array();
		this.tbno = "";
		this.tbname = {};
		this.detailno = {};
		this.nowdate = "";
	}

	setTableName() {
		if (!this.tbno) {
		// if (is_null(this.tbno)) {
			return false;
		}

		this.tbname.tel_details_xx_tb = "tel_details_" + this.tbno + "_tb";
		return true;
	}

	getBackUpTableNameList() {
		return [this.tbname.tel_details_xx_tb];
	}

	async setPactID(pactid: number, carid: any, asp_code: string | number, asx_code: string | number) //権限について
	//内訳の取得を行う
	//ASPが有効かチェック
	{
		this.pactid = pactid;

		var O_Auth = MtAuthority.singleton(pactid.toString());
		this.A_Auth = O_Auth.getPactFuncIni();


		var sql = "select code,name,taxtype,codetype from utiwake_tb where" + " carid=" + this.get_DB().dbQuote(carid, "integer", true);
		this.utiwake = await this.get_DB().queryKeyAssoc(sql);
		this.asp = {};

		if (-1 !== this.A_Auth.indexOf("fnc_asp")) //ASP利用料のチェック
			{
				sql = "select charge,manual from asp_charge_tb where" + " carid = " + this.get_DB().dbQuote(carid, "integer") + " and pactid = " + this.get_DB().dbQuote(pactid, "integer");
				this.asp = this.get_DB().queryRowHash(sql);

				if (!this.asp) {
				// if (is_null(this.asp)) {
					this.errorOut(1000, "pactid=" + pactid + "は「ASP利用料表示設定」権限が設定されていますが、asp_charge_tbに登録されていません\n", 0, "", "");
				}

				if (!(undefined !== this.utiwake[asp_code])) {
					this.errorOut(1000, "pactid=" + pactid + "は「ASP利用料表示設定」権限が設定されていますが、ASPの内訳コードがありません\n", 0, "", "");
					// this.asp = undefined;
					this.asp = {};
				}

				if (!(undefined !== this.utiwake[asx_code])) {
					this.errorOut(1000, "pactid=" + pactid + "は「ASP利用料表示設定」権限が設定されていますが、ASXの内訳コードがありません\n", 0, "", "");
					// this.asp = undefined;
					this.asp = {};
				}

				if (!this.asp) {
				// if (is_null(this.asp)) {
					return false;
				}
			}

		return true;
	}

	getUtiwakeInfo(code: string) {
		if (undefined !== this.utiwake[code]) {
			return this.utiwake[code];
		}

		return undefined;
	}

	getASP() {
		if (!this.asp) {
		// if (is_null(this.asp)) {
			return undefined;
		}

		return this.asp.charge;
	}

	getDetailNo(telno: string | number) //登録されていないtelnoのdetailnoの初期化
	//カウンターを足しておく
	{
		if (!(undefined !== this.detailno[telno])) {
			this.detailno[telno] = 0;
		}


		var res = this.detailno[telno];
		this.detailno[telno]++;
		return res;
	}

	outErrorInfo(title: string, args: { [x: string]: any; }) //変数の表示
	{
		this.infoOut(title + "(" + __filename + "," + 237 + ")\n", 0);


		for (var key in args) {

			var value = args[key];
			this.infoOut("\t" + key + "=" + value + "\n", 0);
		}

		this.errorOut(1000, "停止しました\n", 0, "", "");
	}

	async getPrtelnoList(pactid: any, carid: any) //親番号一覧を返す
	{

		var sql = "select replace(prtelno,'-','') as idx ,true" + " from bill_prtel_tb " + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true);
		return await this.get_DB().queryKeyAssoc(sql);
	}

	async getTelBill(pactid: string, carid: string, prtelno: string, code_tuwa: string, code_kazei_waribiki: { [key: string]: any }, code_hikazei_waribiki: { [key: string]: any }, tax_kubun: string, code_tax: number, asp_code: number, asx_code: number)
	{


		var sql_tel_list = "select" + " telno" + ",0 as charge" + ",0 as no" + ",null as code_k" + ",null as code_h" + ",false as is_tuwa" + ",0 as bill_type" + " from (" + " select" + " telno" + " from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " group by telno" + ") as temp";


		var sql_tuwa = "select" + " telno" + ",charge" + ",0 as no" + ",null as code_k" + ",null as code_h" + ",true as is_tuwa" + ",case " + " when taxkubun = " + tax_kubun[1] + " then 1" + " when taxkubun = " + tax_kubun[4] + " then 2" + " end as bill_type" + " from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " and code in (" + code_tuwa + ")";

		var sql_where_waribiki = "";

		var sql_code_k = "";

		var sql_code_h = "";


		for (var key in code_kazei_waribiki) //割引コードの指定
		//割引コードと対になる割引詳細文
		//複数のコードがあるならorを付ける
		//caseについて
		{

			var value = code_kazei_waribiki[key];

			var temp = "(det.code=" + value[0];
			temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

			if (sql_where_waribiki != "") {
				sql_where_waribiki += " or ";
			}

			sql_where_waribiki += temp;
			sql_code_k += " when det.code = " + value[0] + " then " + key;
		}


		for (var key in code_hikazei_waribiki) //割引コードの指定
		//割引コードと対になる割引詳細文
		//複数のコードがあるならorを付ける
		//caseについて
		{

			var value = code_hikazei_waribiki[key];
			temp = "(det.code=" + value[0];
			temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

			if (sql_where_waribiki != "") {
				sql_where_waribiki += " or ";
			}

			sql_where_waribiki += temp;
			sql_code_h += " when det.code = " + value[0] + " then " + key;
		}

		if (!!code_tax) {
			if (sql_where_waribiki != "") {
				sql_where_waribiki += " or ";
			}

			sql_where_waribiki += "( det.code in (" + code_tax + "))";
		}



		var sql_waribiki = "select" + " det.telno" + ",det.charge" + ",det.detailno as no" + ",case" + sql_code_k + " else null end as code_k" + ",case" + sql_code_h + " else null end as code_h" + ",false as is_tuwa" + ",case" + " when det.code in (" + code_tax + ") then 31" + " when det.taxkubun = " + tax_kubun[1] + " then 11" + " when det.taxkubun = " + tax_kubun[4] + " then 12" + " else null end as bill_type" + " from tel_details_" + this.tbno + "_tb as det" + " JOIN billhistory_" + this.tbno + "_tb hist on" + " hist.pactid=det.pactid" + " and hist.carid=det.carid" + " and hist.telno=det.telno" + " and hist.code=det.code" + " and hist.charge_details=det.charge" + " where" + " det.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and det.carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and det.prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + "and (" + sql_where_waribiki + ")";

		var sql_post_select = "";

		var sql_post_join = "";
		sql_post_select = ",tel.postid";
		sql_post_join = " join tel_" + this.tbno + "_tb tel on" + " tel.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and tel.carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and tel.telno=det.telno";


		var sql = "select" + " det.telno" + ",sum(case when det.is_tuwa then det.charge else 0 end) as charge_tuwa" + ",sum(case when det.bill_type=1 then det.charge else 0 end) as charge_tuwa_k" + ",sum(case when det.bill_type=2 then det.charge else 0 end) as charge_tuwa_h" + ",sum(case when det.bill_type=11 then det.charge else 0 end) as charge_wari_k" + ",sum(case when det.bill_type=12 then det.charge else 0 end) as charge_wari_h" + ",sum(case when det.bill_type=31 then det.charge else 0 end) as tax" + ",min(case when det.bill_type=11 then det.no end) as detailno_k" + ",min(case when det.bill_type=12 then det.no end) as detailno_h" + ",min(case when det.bill_type=31 then det.no end) as detailno_tax" + ",min(det.code_k) as code_k" + ",min(det.code_h) as code_h" + sql_post_select + ",(" + " select max(detailno) from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and telno=det.telno" + " and code not in (" + this.get_DB().dbQuote(asp_code, "text", true) + "," + this.get_DB().dbQuote(asp_code, "text", true) + ")" + ") as maxno" + " from ( (" + sql_tuwa + ") union all (" + sql_waribiki + ") union all (" + sql_tel_list + ")) as det" + sql_post_join + " group by det.telno" + sql_post_select + " order by charge_tuwa desc";
		return await this.get_DB().queryAll(sql, DB_FETCHMODE_ORDERED, false);
	}

	async getPostRelation(pactid: any) {

		var sql = "select " + " postidchild,postidparent,level" + " from post_relation_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " order by level";
		return await this.get_DB().queryHash(sql);
	}

	async checkProcessed(pactid: any, carid: any, prtelno: any, tdcomments: any[]) {

		var sql = "select true  from tel_details_" + this.tbno + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " and tdcomment in (" + tdcomments.join(",") + ")";

		var res = await this.get_DB().queryOne(sql);
		return !res ? false : true
		// return is_null(res) ? false : true;
	}


	async update_details(pactid: number, carid: string, prtelno: string, H_tel: { [x: string]: any; }, update_k_type: string, insert_k_code: any, insert_k_detail: any, kazei_tdcomment: any, update_h_type: string, insert_h_code: any, insert_h_detail: any, hikazei_tdcomment: any, update_t_type: string, insert_t_code: any, insert_t_detail: any, tax_tdcomment: any, kubun_kazei: any, kubun_hikazei: any, A_free_code_kazei: { [x: string]: any; }, A_free_code_hikazei: { [x: string]: any; }, tax_code: string, tax_rate: number, asp_code: string, asx_code: string) //内訳テーブルの取得を行う
	//税金内訳コード名
	//差込テンプレ
	//税金合計
	//電話番号ごとに
	//割引、税額、ASP、ASXの削除。
	//差替え時のみ削除を行う
	//割引と税額レコードいれる
	//ASP利用料の追加。
	{

		var sql_insert = "";

		var recdate = this.get_DB().dbQuote(this.nowdate, "timestamp", true);


		var temp = this.getUtiwakeInfo(tax_code.replace("'", ""));
		// var temp = this.getUtiwakeInfo(str_replace("'", "", tax_code));

		var tax_codename = this.get_DB().dbQuote(temp.name, "text", true);

		var temp_insert: { [key: string]: any } = {
			pactid: this.get_DB().dbQuote(pactid, "integer", true),
			telno: undefined,
			code: undefined,
			codename: this.get_DB().dbQuote(undefined, "text", true),
			charge: undefined,
			taxkubun: undefined,
			detailno: undefined,
			recdate: recdate,
			carid: this.get_DB().dbQuote(carid, "integer", true),
			tdcomment: this.get_DB().dbQuote(undefined, "text"),
			prtelno: this.get_DB().dbQuote(prtelno, "text", true),
			realcnt: this.get_DB().dbQuote(undefined, "integer")
		};

		var tax_total = 0;


		for (var key in H_tel) {

			var value = H_tel[key];
			tax_total += value[CLM_NEW_TUWA_TAX];
		}


		for (var key in H_tel) //電話番号
		//税区分
		//課税割引の更新作業
		//-----------------------------------------------------------------------------------
		//非課税
		//-----------------------------------------------------------------------------------
		//税区分
		//-----------------------------------------------------------------------------------
		//税金の対応
		//-----------------------------------------------------------------------------------
		{

			var value = H_tel[key];

			var add_no = 0;

			var detailno_tail = value[CLM_DETAILNO_TAIL] + 1 + add_no;
			temp_insert.telno = this.get_DB().dbQuote(value[CLM_TELNO], "text", true);
			temp_insert.taxkubun = kubun_kazei;
			temp_insert.tdcomment = kazei_tdcomment;


			if (update_k_type == "0") //-----------------------------------------------------------------------------------
				//差替え時の処理
				//-----------------------------------------------------------------------------------
				{
					if (value[CLM_NEW_WARI_K] != 0) //割引料金が発生している場合、insert文を作るよ
						//デフォルト値を入れましょう
						//割引額
						//既存のレコードがある場合は差額を入れる
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(value[CLM_NEW_WARI_K], "integer", true);

							if (value[CLM_DETAILNO_K] > 0) //既にレコードがある場合は元のdetailnoの場所に入れる
								//並び順
								//内訳コード
								//コード名
								{


									var code = A_free_code_kazei![value[CLM_CODE_K][0]].replace("'", "");
									// var code = str_replace("'", "", A_free_code_kazei[value[CLM_CODE_K]][0]);

									var utiwake = this.getUtiwakeInfo(code);
									temp.detailno = this.get_DB().dbQuote(value[CLM_DETAILNO_K] + add_no, "integer", true);
									temp.code = A_free_code_kazei![value[CLM_CODE_K]][0];
									temp.codename = this.get_DB().dbQuote(utiwake.name, "text", false);
								} else //既存レコードがない場合は差込む
								//並び順
								//内訳コード
								//詳細
								{
									temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
									temp.code = this.get_DB().dbQuote(insert_k_code, "text", true);
									temp.codename = this.get_DB().dbQuote(insert_k_detail, "text", true);
									detailno_tail++;
								}

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				} else //-----------------------------------------------------------------------------------
				//差込時
				//-----------------------------------------------------------------------------------
				//新しい割引額と現在の割引額の差を求める
				//差額がある場合は追記するぽよ
				{

					var wari = value[CLM_NEW_WARI_K] - value[CLM_WARI_K];

					if (wari != 0) //デフォルト値を入れましょう
						//割引額
						//並び順
						//内訳コード
						//詳細
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(wari, "integer", true);
							temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
							temp.code = this.get_DB().dbQuote(insert_k_code, "text", true);
							temp.codename = this.get_DB().dbQuote(insert_k_detail, "text", true);
							detailno_tail++;

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				}

			temp_insert.taxkubun = kubun_hikazei;
			temp_insert.tdcomment = hikazei_tdcomment;


			if (update_h_type == "0") //-----------------------------------------------------------------------------------
				//差替え時の処理
				//-----------------------------------------------------------------------------------
				{
					if (value[CLM_NEW_WARI_H] != 0) //割引料金が発生している場合、insert文を作るよ
						//デフォルト値を入れましょう
						//割引額
						//既存のレコードがある場合は差額を入れる
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(value[CLM_NEW_WARI_H], "integer", true);

							if (value[CLM_DETAILNO_H] > 0) //既にレコードがある場合は元のdetailnoの場所に入れる
								//並び順
								//内訳コード
								//コード名
								{

									code = A_free_code_hikazei[value[CLM_CODE_H][0]].replace("'", "");
									// code = str_replace("'", "", A_free_code_hikazei[value[CLM_CODE_H]][0]);
									utiwake = this.getUtiwakeInfo(code);
									temp.detailno = this.get_DB().dbQuote(value[CLM_DETAILNO_H] + add_no, "integer", true);
									temp.code = A_free_code_hikazei[value[CLM_CODE_H]][0];
									temp.codename = this.get_DB().dbQuote(utiwake.name, "text", false);
								} else //既存レコードがない場合は差込む
								//並び順
								//内訳コード
								//詳細
								{
									temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
									temp.code = this.get_DB().dbQuote(insert_h_code, "text", true);
									temp.codename = this.get_DB().dbQuote(insert_h_detail, "text", true);
									detailno_tail++;
								}

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				} else //-----------------------------------------------------------------------------------
				//差込時
				//-----------------------------------------------------------------------------------
				//新しい割引額と現在の割引額の差を求める
				//差額がある場合は追記するぽよ
				{
					wari = value[CLM_NEW_WARI_H] - value[CLM_WARI_H];

					if (wari != 0) //デフォルト値を入れましょう
						//割引額
						//並び順
						//内訳コード
						//詳細
						//既にデータがあるなら・・カンマつける
						{
							temp = temp_insert;
							temp.charge = this.get_DB().dbQuote(wari, "integer", true);
							temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
							temp.code = this.get_DB().dbQuote(insert_h_code, "text", true);
							temp.codename = this.get_DB().dbQuote(insert_h_detail, "text", true);
							detailno_tail++;

							if (sql_insert != "") {
								sql_insert += ",";
							}

							sql_insert += "(" + temp.join(",") + ")";
						}
				}

			if (tax_total > 0) //税区分
				{
					temp_insert.taxkubun = this.get_DB().dbQuote(undefined, "text", false);
					temp_insert.tdcomment = tax_tdcomment;


					if (update_t_type == "0") //-----------------------------------------------------------------------------------
						//差替え時の処理
						//-----------------------------------------------------------------------------------
						{

							var charge = value[CLM_TAX] + value[CLM_NEW_TUWA_TAX] - value[CLM_TUWA_TAX];

							if (charge != 0) //デフォルト値を入れましょう
								//既存のレコードがある場合は差額を入れる
								//既にデータがあるなら・・カンマつける
								{
									temp = temp_insert;
									temp.charge = this.get_DB().dbQuote(charge, "integer", true);

									if (value[CLM_DETAILNO_TAX] > 0) //既にレコードがある場合は元のdetailnoの場所に入れる
										//並び順
										//内訳コード
										{
											temp.detailno = this.get_DB().dbQuote(value[CLM_DETAILNO_TAX] + add_no, "integer", true);
											temp.code = tax_code;
											temp.codename = tax_codename;
										} else //既存レコードがない場合は差込む
										//並び順
										//内訳コード
										//詳細
										{
											temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
											temp.code = this.get_DB().dbQuote(insert_t_code, "text", true);
											temp.codename = this.get_DB().dbQuote(insert_t_detail, "text", true);
											detailno_tail++;
										}

									if (sql_insert != "") {
										sql_insert += ",";
									}

									sql_insert += "(" + temp.join(",") + ")";
								}
						} else //-----------------------------------------------------------------------------------
						//差込時
						//-----------------------------------------------------------------------------------
						//新しい割引額と現在の割引額の差を求める
						//差額がある場合は追記するぽよ
						{

							var tax = value[CLM_NEW_TUWA_TAX] - value[CLM_TUWA_TAX];

							if (tax != 0) //デフォルト値を入れましょう
								//割引額
								//並び順
								//内訳コード
								//詳細
								//既にデータがあるなら・・カンマつける
								{
									temp = temp_insert;
									temp.charge = this.get_DB().dbQuote(tax, "integer", true);
									temp.detailno = this.get_DB().dbQuote(detailno_tail, "integer", true);
									temp.code = this.get_DB().dbQuote(insert_t_code, "text", true);
									temp.codename = this.get_DB().dbQuote(insert_t_detail, "text", true);
									detailno_tail++;

									if (sql_insert != "") {
										sql_insert += ",";
									}

									sql_insert += "(" + temp.join(",") + ")";
								}
						}
				}
		}


		var sql_sum = "select sum(charge)  from tel_details_" + this.tbno + "_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true);

		var sum_old = await this.get_DB().queryOne(sql_sum);
		this.get_DB().beginTransaction();

		this.deleteASP(pactid, carid, prtelno, update_k_type == "0" ? A_free_code_kazei : undefined, update_h_type == "0" ? A_free_code_hikazei : undefined, update_t_type == "0" && tax_total > 0 ? tax_code : undefined, asp_code, asx_code);

		var res = this.get_DB().exec("insert into tel_details_" + this.tbno + "_tb" + " (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid,tdcomment,prtelno,realcnt) values " + sql_insert);

		var asp_charge = this.getASP();

		if (asp_charge) {
		// if (!is_null(asp_charge)) {

			var asp = this.getUtiwakeInfo(asp_code);

			var asx = this.getUtiwakeInfo(asx_code);

			var sql = "insert into tel_details_" + this.tbno + "_tb (pactid,telno,code,codename,charge,taxkubun,detailno,recdate,carid,tdcomment,prtelno,realcnt)" + "(select" + " " + this.get_DB().dbQuote(pactid, "integer", true) + ",telno" + ",code" + ",codename" + ",charge" + ",null" + ",detailno + detailno_add" + "," + recdate + "," + this.get_DB().dbQuote(carid, "integer", true) + ",null" + ",null" + ",null" + " from" + " (" + "select telno,max(detailno) as detailno from tel_details_" + this.tbno + "_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno =" + this.get_DB().dbQuote(prtelno, "text", true) + " group by telno" + ") as tel_tb" + " join (" + " select" + " " + this.get_DB().dbQuote(asp_code, "text", true) + " as code" + "," + this.get_DB().dbQuote(asp.name, "text", true) + " as codename" + "," + this.get_DB().dbQuote(asp_charge, "integer", true) + " as charge" + ", 2 as detailno_add" + " union" + " select" + " " + this.get_DB().dbQuote(asx_code, "text", true) + " as code" + "," + this.get_DB().dbQuote(asx.name, "text", true) + " as codename" + "," + this.get_DB().dbQuote(+(asp_charge * tax_rate), "integer", true) + " as charge" + ", 3 as detailno_add" + ") asp on true" + ")";
			res = this.get_DB().exec(sql);
		}


		var sum_new = await this.get_DB().queryOne(sql_sum);

		var error = false;

		if (sum_old == sum_new) {
			this.get_DB().commit();
		} else {
			error = true;
			this.get_DB().rollback();
		}
		var array = Array();
		array["error"] = error;
		array["sum_old"] = sum_old;
		array["sum_new"] = sum_new;
		return array;
	}

	async deleteASP(pactid: number, carid: string, prtelno: string, A_free_code_kazei: { [x: string]: any; } | undefined, A_free_code_hikazei: { [x: string]: any; } | undefined, tax_code: string | undefined, asp_code: string, asx_code: string) //課税通話料の割引コードについて
	//sql作成
	//削除SQLに書き換える
	{

		var sql_where_waribiki = "";

		if (A_free_code_kazei) {
		// if (!is_null(A_free_code_kazei)) {

			for (var key in A_free_code_kazei) //割引コードの指定
			//割引コードと対になる割引詳細文
			//複数のコードがあるならorを付ける
			{

				var value = A_free_code_kazei[key];

				var temp = "(det.code=" + value[0];
				temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

				if (sql_where_waribiki != "") {
					sql_where_waribiki += " or ";
				}

				sql_where_waribiki += temp;
			}
		}

		if (A_free_code_hikazei) {
		// if (!is_null(A_free_code_hikazei)) {

			for (var key in A_free_code_hikazei) //割引コードの指定
			//割引コードと対になる割引詳細文
			//複数のコードがあるならorを付ける
			{

				var value = A_free_code_hikazei[key];
				temp = "(det.code=" + value[0];
				temp += undefined !== value[1] ? " and hist.details1 = " + value[1] + ")" : ")";

				if (sql_where_waribiki != "") {
					sql_where_waribiki += " or ";
				}

				sql_where_waribiki += temp;
			}
		}

		if (tax_code) {
		// if (!is_null(tax_code)) {
			if (!!tax_code) {
				if (sql_where_waribiki != "") {
					sql_where_waribiki += " or ";
				}

				sql_where_waribiki += "( det.code in (" + tax_code + "))";
			}
		}

		if (sql_where_waribiki != "") {
			sql_where_waribiki += " or ";
		}

		sql_where_waribiki += "( det.code in (" + this.get_DB().dbQuote(asp_code, "text", true) + "," + this.get_DB().dbQuote(asx_code, "text", true) + "))";

		var sql_tel = " select det.pactid,det.telno,det.carid,det.detailno,det.code" + " from" + " (select telno from tel_details_" + this.tbno + "_tb where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and prtelno=" + this.get_DB().dbQuote(prtelno, "text", true) + " group by telno" + " ) as telno_list" + " JOIN tel_details_" + this.tbno + "_tb det on" + " det.pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and det.telno=telno_list.telno" + " LEFT JOIN billhistory_" + this.tbno + "_tb hist on" + " hist.pactid=det.pactid" + " and hist.carid=det.carid" + " and hist.telno=det.telno" + " and hist.code=det.code" + " and hist.charge_details=det.charge" + " where " + sql_where_waribiki;

		var sql = "delete from tel_details_" + this.tbno + "_tb where (pactid,telno,carid,detailno,code) in (" + sql_tel + ")";
		return await this.get_DB().exec(sql);
	}

	// __destruct() {
	// 	super.__destruct();
	// }

};
