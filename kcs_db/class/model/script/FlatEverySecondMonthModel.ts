import ModelBase from "../../model/ModelBase";
import MtTableUtil from "../../MtTableUtil";
import MtSetting from "../../MtSetting";
import MtScriptAmbient from "../../MtScriptAmbient";

//
//__construct
//
//@author date
//@since 2015/08/20
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//getNow
//現在時刻を取得する
//@author web
//@since 2015/09/25
//
//@access public
//@return void
//
//
//getExcludeTelno
//除外リストの取得
//@author web
//@since 2015/09/25
//
//@param mixed $flatid
// 2022cvt_016
//@param mixed $flattype
// 2022cvt_016
//@param mixed $mcntype
//@access private
//@return void
//
//
//getParentTelno
//
//@author web
//@since 2015/09/25
//
//@param mixed $flatid
// 2022cvt_016
//@param mixed $flattype
// 2022cvt_016
//@param mixed $mcntype
//@access private
//@return void
//
//
//getCharge
//平準化の額を取得する
//@author web
//@since 2015/09/25
//
//@param mixed $esm
// 2022cvt_016
//@param mixed $mcntype
//@param mixed $fee_flag
//@access private
//@return void
//
//
//UpdateTeldetail
//tel_detailの更新
//@author date
//@since 2015/10/20
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $detail
//@param mixed $charge
//@param mixed $comment
//@param mixed $nowtime
//@param mixed $table
//@access private
//@return void
//
//
//InsertTelDetailsFree
//無料月用のtel_details_xx_tbのinsert
//@author web
//@since 2015/10/02
//
//@param mixed $table
//@param mixed $nowtime
//@param mixed $esm
// 2022cvt_016
//@param mixed $flattype
// 2022cvt_016
//@param mixed $mcntype
//@access private
//@return void
//
//
//InsertTelDetails
//有料月
//@author web
//@since 2015/10/02
//
//@param mixed $table
//@param mixed $table_prev
//@param mixed $nowtime
//@param mixed $esm
//@access private
//@return void
//
//
//updateTelDetails
//
//@author web
//@since 2015/09/25
//
//@param mixed $pactid
//@access private
//@return void
//
//
//getPrevTableNo
//前月のテーブル番号を取得
//@author web
//@since 2015/10/01
//
//@param mixed $year
//@param mixed $month
//@access private
//@return void
//
//
//update
//追加を行う
//@author web
//@since 2015/09/18
//
//@param mixed $pactid
//@access public
//@return void
//
//
//__destruct
//
//@author date
//@since 2015/09/18
//
//@access public
//@return void
//
export default class FlatEverySecondMonthModel extends ModelBase {;
	flats: any;
	O_msa: MtScriptAmbient;
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.flats = Array();
		this.O_msa = O_MtScriptAmbient;
		this.O_Setting = MtSetting.singleton();
		this.O_Setting.loadConfig("define");
		this.flats = {
			1: {
				prefix: "sp",
				label: "スマートフォン"
			},
			2: {
				prefix: "fp",
				label: "フューチャーフォン"
			},
			3: {
				prefix: "dc",
				label: "データカード"
			},
			4: {
				prefix: "etc",
				label: "その他"
			},
			5: {
				prefix: "etc01",
				label: "その他1"
			},
			6: {
				prefix: "etc02",
				label: "その他2"
			},
			7: {
				prefix: "etc03",
				label: "その他3"
			},
			8: {
				prefix: "etc04",
				label: "その他4"
			},
			9: {
				prefix: "etc05",
				label: "その他5"
			},
			10: {
				prefix: "etc06",
				label: "その他6"
			}
		};
	}

	getNow() {
		return this.get_DB().getNow();
	}

// 2022cvt_016
	getExcludeTelno(flatid: any, flattype: any, mcntype: any) //除外電話番号を取得
	//除外電話番号をSQL用にする
	{
// 2022cvt_015
		var res = Array();
// 2022cvt_016
// 2022cvt_015
		var sql = "select telno from bill_flat_exclude_tb where" + " flatid=" + this.getDB().dbQuote(flatid, "integer", true) + " and flattype=" + this.getDB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.getDB().dbQuote(mcntype, "integer", true);
// 2022cvt_015
		var exclude = this.getDB().queryCol(sql);

// 2022cvt_015
		for (var key in exclude) {
// 2022cvt_015
			var value = exclude[key];
			res.push(this.getDB().dbQuote(value, "text", true));
		}

		return res;
	}

// 2022cvt_016
	getParentTelno(flatid: any, flattype: any, mcntype: any) //対象の親番号を取得
	//親電話番号をSQL用にする
	{
// 2022cvt_015
		var res = Array();
// 2022cvt_016
// 2022cvt_015
		var sql = "select prtelno from bill_flat_prtel_tb" + " where flatid=" + this.getDB().dbQuote(flatid, "integer", true) + " and flattype=" + this.getDB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.getDB().dbQuote(mcntype, "integer", true);
// 2022cvt_015
		var prtelno = this.getDB().queryCol(sql);

// 2022cvt_015
		for (var key in prtelno) {
// 2022cvt_015
			var value = prtelno[key];
// 2022cvt_020
// 2022cvt_015
			// var telno = str_replace("-", "", value);
			var telno = value.replace("-", "");
			res.push(this.getDB().dbQuote(telno, "text", true));
		}

		return res;
	}

// 2022cvt_016
	getCharge(esm: { [key: string]: number; }, mcntype: string | number) //switch( $mcntype ){
	//		case 1:	$charge = $esm["sp_fee"];	break;
	//		case 2:	$charge = $esm["fp_fee"];	break;
	//		case 3:	$charge = $esm["dc_fee"];	break;
	//		case 4:	$charge = $esm["etc_fee"];	break;
	//		}
	{
// 2022cvt_015
		var charge = 0;

// 2022cvt_016
		if (undefined !== this.flats[mcntype]) {
// 2022cvt_016
// 2022cvt_015
			var prefix = this.flats[mcntype].prefix;
			charge = esm[prefix + "_fee"];
		}

		return charge;
	}

	UpdateTeldetail(pactid: any, carid: number, detail: { telno: any; detailno: number; prtelno: any; }, charge: number, charge_tax: number, comment: any, nowtime: any, table: string) //平準化の挿入
	//平準化の消費税挿入
	//ASPのdetailno修正
	//ASXのdetailno修正
	{
// 2022cvt_015
		var data: { [key: string]: any } = {};
		data.pactid = this.getDB().dbQuote(pactid, "integer", true);
		data.telno = this.getDB().dbQuote(detail.telno, "text", true);
		data.code = this.getDB().dbQuote("001", "text", true);
		data.codename = this.getDB().dbQuote("基本使用料", "text", true);
		data.charge = this.getDB().dbQuote(charge, "integer", true);
		data.taxkubun = this.getDB().dbQuote("合算", "text", true);
		data.detailno = this.getDB().dbQuote(detail.detailno + 1, "integer", true);
		data.recdate = this.getDB().dbQuote(nowtime, "timestamp", true);
		data.carid = this.getDB().dbQuote(carid, "integer", true);
		data.tdcomment = this.getDB().dbQuote(comment, "text", false);
		data.prtelno = this.getDB().dbQuote(detail.prtelno, "text", true);
		data.realcnt = "NULL";
// 2022cvt_015
		var keys = Object.keys(data);
// 2022cvt_015
		var sql = "insert into " + table + "(" + keys.join(",") + ")values(" + data.join(",") + ")";
// 2022cvt_015
		var tmpcnt = this.getDB().query(sql);
		data.code = this.getDB().dbQuote("955", "text", true);
		data.codename = this.getDB().dbQuote("消費税相当額", "text", true);
		data.charge = this.getDB().dbQuote(charge_tax, "integer", true);
		data.detailno = this.getDB().dbQuote(detail.detailno + 2, "integer", true);
		data.taxkubun = this.getDB().dbQuote("", "text");
		keys = Object.keys(data);
		sql = "insert into " + table + "(" + keys.join(",") + ")values(" + data.join(",") + ")";
		tmpcnt = this.getDB().query(sql);
		sql = "update " + table + " set detailno=" + this.getDB().dbQuote(detail.detailno + 4, "integer", true) + " where pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and telno=" + this.getDB().dbQuote(detail.telno, "text", true) + " and code=" + this.getDB().dbQuote("ASP", "text", true);
		tmpcnt = this.getDB().query(sql);
		sql = "update " + table + " set detailno=" + this.getDB().dbQuote(detail.detailno + 5, "integer", true) + " where pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and telno=" + this.getDB().dbQuote(detail.telno, "text", true) + " and code=" + this.getDB().dbQuote("ASX", "text", true);
		tmpcnt = this.getDB().query(sql);
	}

// 2022cvt_016
	InsertTelDetailsFree(table: string, nowtime: string, esm: { [x: string]: number; pactid?: any; flatid?: any; comment?: any; }, flattype: number, mcntype: string) //除外リスト
	//親番号の存在チェック
	//番号ごとに処理する
	{
// 2022cvt_015
		var carid = 1;
// 2022cvt_015
		var pactid = esm.pactid;
// 2022cvt_016
// 2022cvt_015
		var exclude = this.getExcludeTelno(esm.flatid, flattype, mcntype);
// 2022cvt_015
		var exclude_sql = "";

		if (!!exclude) {
			exclude_sql = " and det1.telno not in(" + exclude.join(",") + ")";
		}

// 2022cvt_016
// 2022cvt_015
		var prtelno = this.getParentTelno(esm.flatid, flattype, mcntype);

		if (!prtelno) {
			return false;
		}

// 2022cvt_015
		var sql = "select det1.telno,det1.prtelno,det1.detailno from " + table + " as det1 " + " where" + " det1.pactid= " + this.getDB().dbQuote(pactid, "integer", true) + " and det1.carid=" + this.getDB().dbQuote(carid, "integer", true) + exclude_sql + " and det1.prtelno in(" + prtelno.join(",") + ")" + " and det1.detailno=(" + "select max(detailno) from " + table + " as det2 where" + " det1.pactid = det2.pactid" + " and det1.telno=det2.telno" + " and COALESCE(det2.tdcomment,'') != " + this.getDB().dbQuote(esm.comment, "text", true) + " \tand code not in( 'ASP','ASX' )" + ")";
// 2022cvt_015
		var details = this.getDB().queryHash(sql);

// 2022cvt_015
		for (var key in details) //加算額の取得
		//tel_detail更新
		{
// 2022cvt_015
			var value = details[key];
// 2022cvt_016
// 2022cvt_015
			var charge = this.getCharge(esm, mcntype);
// 2022cvt_015
			var tax = +this.O_Setting.get("excise_tax");
// 2022cvt_015
			var charge_tax = +Math.floor(charge * tax);
			this.UpdateTeldetail(pactid, carid, value, charge, charge_tax, esm.comment, nowtime, table);
		}
	}

// 2022cvt_016
	InsertTelDetails(table: string, table_prev: string, nowtime: string, esm: { pactid: any; flatid: any; comment: any; }, flattype: number, mcntype: string) //除外リスト
	//親番号の存在チェック
	//
	{
// 2022cvt_015
		var carid = 1;
// 2022cvt_015
		var pactid = esm.pactid;
// 2022cvt_016
// 2022cvt_015
		var exclude = this.getExcludeTelno(esm.flatid, flattype, mcntype);
// 2022cvt_015
		var exclude_sql = "";

		if (!!exclude) {
			exclude_sql = " and det1.telno not in(" + exclude.join(",") + ")";
		}

// 2022cvt_016
// 2022cvt_015
		var prtelno = this.getParentTelno(esm.flatid, flattype, mcntype);

		if (!prtelno) {
			return false;
		}

// 2022cvt_015
		var sql = "select det1.telno,det1.prtelno,prev.charge,det1.detailno from " + table + " as det1" + " join " + table_prev + " prev on" + " prev.pactid= " + this.getDB().dbQuote(pactid, "integer", true) + " and prev.telno = det1.telno" + " and prev.carid=" + this.getDB().dbQuote(carid, "integer", true) + " and prev.code=" + this.getDB().dbQuote("001", "text", true) + " and prev.tdcomment=" + this.getDB().dbQuote(esm.comment, "text", false) + " where" + " det1.pactid= " + this.getDB().dbQuote(pactid, "integer", true) + " and det1.carid=" + this.getDB().dbQuote(carid, "integer", true) + exclude_sql + " and det1.prtelno in(" + prtelno.join(",") + ")" + " and det1.detailno=(" + "select max(detailno) from " + table + " as det2 where" + " det1.pactid = det2.pactid" + " and det1.telno=det2.telno" + " and COALESCE(det2.tdcomment,'') != " + this.getDB().dbQuote(esm.comment, "text", true) + " \tand code not in( 'ASP','ASX' )" + ")";
// 2022cvt_015
		var details = this.getDB().queryHash(sql);

// 2022cvt_015
		for (var key in details) //消費税は前月から引っ張ってくる
		//更新
		{
// 2022cvt_015
			var value = details[key];
// 2022cvt_015
			var charge = -value.charge;
			sql = "select charge from " + table_prev + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and telno=" + this.getDB().dbQuote(value.telno, "text", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and code=" + this.getDB().dbQuote("955", "text", true) + " and tdcomment=" + this.getDB().dbQuote(esm.comment, "text", false);
// 2022cvt_015
			var charge_tax = this.getDB().queryOne(sql);
			this.UpdateTeldetail(pactid, carid, value, charge, -charge_tax, esm.comment, nowtime, table);
		}
	}

	getBillFlatEsm(pactid: string, date: string) //SQL作る
	//pactidの指定がされていたらする
	{
// 2022cvt_015
		var sql = "select * from bill_flat_esm_tb where" + " start_date <= " + this.getDB().dbQuote(date, "date", true) + " and end_date > " + this.getDB().dbQuote(date, "date", true);

		if (pactid != "all") {
			sql += " and pactid=" + this.getDB().dbQuote(pactid, "integer", true);
		}

		return this.getDB().queryHash(sql);
	}

	async updateTelDetails(pactid: string, bill_date: string, mode: string) //recdateやfixdateの値を取得
	//指定された年月の対象となる平準化対象を取得
	//平準化対象の取得
	//顧客ごとにやる
	{
		var year: any;
		var month: any;
// 2022cvt_015
		var nowtime = this.getNow();

		if (bill_date == "none") {
// 2022cvt_015
			var tmp = this.getNow();
// 2022cvt_015
			year = tmp.substring(0, 4);
// 2022cvt_015
			month = tmp.substring(5, 2);
		} else {
			tmp = bill_date;
			year = tmp.substring(0, 4);
			month = tmp.substring(4, 2);
		}

// 2022cvt_015
		var tableNoPrev = this.getTableNoPrev(year, month);
// 2022cvt_015
		var tableNo = MtTableUtil.getTableNo(year + month, false);
// 2022cvt_015
		// var tgt_date = date("Y-m-d", mktime(0, 0, 0, month, 1, year));
		var tgt_date = new Date(year-2,month,1,0,0,0).toJSON().slice(0,10).replace(/-/g,'-');;
// 2022cvt_015
		var flat_esm = await this.getBillFlatEsm(pactid, tgt_date);

// 2022cvt_015
		for (var esm of (flat_esm)) //削除して追加する
		{
// 2022cvt_015
			var table = "tel_details_" + tableNo + "_tb";
// 2022cvt_015
			var table_prev = "tel_details_" + tableNoPrev + "_tb";
// 2022cvt_015
			var carid = 1;

			if (!esm == true) {
				continue;
			}

// 2022cvt_015
			var start_month = +esm.start_date.substring(5, 2);
// 2022cvt_015
			var fee_flag = start_month % 2 == month % 2;

			if (mode == "O") //tel_details_xx_tbから削除する
				{
// 2022cvt_015
					var sql = "delete from " + table + " where" + " pactid=" + this.getDB().dbQuote(esm.pactid, "integer", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and tdcomment =" + this.getDB().dbQuote(esm.comment, "text", true);
					this.getDB().query(sql);
				} else if (mode == "A") //既に追加されている場合は何もしない
				{
					sql = "select count(*) from " + table + " where" + " pactid=" + this.getDB().dbQuote(esm.pactid, "integer", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and tdcomment =" + this.getDB().dbQuote(esm.comment, "text", true);
// 2022cvt_015
					var num = await this.getDB().queryCol(sql);

					if (num) {
						continue;
					}
				} else //それ以外の指定があった場合はエラーなので何もしない
				{
					continue;
				}

			if (fee_flag) //無料月
				////	スマートフォンで調べる
				//				if( $esm["sp_fee"] > 0 && $esm["sp_stop"] == false ){
				//					$this->InsertTelDetailsFree($table,$nowtime,$esm,1,1);
				//				}
				//				//	フューチャーフォン
				//				if( $esm["fp_fee"] > 0 && $esm["fp_stop"] == false ){
				//					$this->InsertTelDetailsFree($table,$nowtime,$esm,1,2);
				//				}
				//				//	データカード
				//				if( $esm["dc_fee"] > 0 && $esm["dc_stop"] == false ){
				//					$this->InsertTelDetailsFree($table,$nowtime,$esm,1,3);
				//				}
				//				//	その他
				//				if( $esm["etc_fee"] > 0 && $esm["etc_stop"] == false ){
				//					$this->InsertTelDetailsFree($table,$nowtime,$esm,1,4);
				//				}
				{
					{
						let _tmp_0 = this.flats;

// 2022cvt_016
// 2022cvt_015
						for (var mcntype in _tmp_0) {
// 2022cvt_016
// 2022cvt_015
							var flat = _tmp_0[mcntype];
// 2022cvt_015
							var fee = flat.prefix + "_fee";
// 2022cvt_015
							var stop = flat.prefix + "_stop";

							if (esm[fee] > 0 && esm[stop] == false) {
// 2022cvt_016
								this.InsertTelDetailsFree(table, nowtime, esm, 1, mcntype);
							}
						}
					}
				} else //有料月
				////	スマートフォンで調べる
				//				if( $esm["sp_fee"] > 0 && $esm["sp_stop"] == false ){
				//					$this->InsertTelDetails($table,$table_prev,$nowtime,$esm,1,1);
				//				}
				//				//	フューチャーフォン
				//				if( $esm["fp_fee"] > 0 && $esm["fp_stop"] == false ){
				//					$this->InsertTelDetails($table,$table_prev,$nowtime,$esm,1,2);
				//				}
				//				//	データカード
				//				if( $esm["dc_fee"] > 0 && $esm["dc_stop"] == false ){
				//					$this->InsertTelDetails($table,$table_prev,$nowtime,$esm,1,3);
				//				}
				//				//	その他
				//				if( $esm["etc_fee"] > 0 && $esm["etc_stop"] == false ){
				//					$this->InsertTelDetails($table,$table_prev,$nowtime,$esm,1,4);
				//				}
				{
					{
						let _tmp_1 = this.flats;

// 2022cvt_016
// 2022cvt_015
						for (var mcntype in _tmp_1) {
// 2022cvt_016
// 2022cvt_015
							var flat = _tmp_1[mcntype];
							fee = flat.prefix + "_fee";
							stop = flat.prefix + "_stop";

							if (esm[fee] > 0 && esm[stop] == false) {
// 2022cvt_016
								this.InsertTelDetails(table, table_prev, nowtime, esm, 1, mcntype);
							}
						}
					}
				}
		}

		return true;
	}

	getTableNoPrev(year:any, month:any) {
// 2022cvt_015
		// var tmp = date("Y-m-d", mktime(0, 0, 0, month, 0, year));
		var tmp = new Date(year-2,month,1,0,0,0).toJSON().slice(0,10).replace(/-/g,'-');;
		year = tmp.substring(0, 4);
		month = tmp.substring(5, 2);
		tmp = year + month;
		return MtTableUtil.getTableNo(tmp, false);
	}

	async update(pactid: string, bill_date: string, mode: string) //トランザクション開始
	//コミット
	{
		this.get_DB().beginTransaction();
// 2022cvt_015
		var rtn = this.updateTelDetails(pactid, bill_date, mode);

		if (await rtn == false) {
			this.get_DB().rollback();
			this.errorOut(1000, "\n" + "失敗 \n", 0, "", "");
			return false;
		} else {
			this.infoOut("成功\n", 0);
		}

		this.get_DB().commit();
		return true;
	}

	// __destruct() //親のデストラクタを必ず呼ぶ
	// {
	// 	super.__destruct();
	// }

};
