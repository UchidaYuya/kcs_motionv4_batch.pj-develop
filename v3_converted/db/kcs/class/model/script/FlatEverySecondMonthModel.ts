//error_reporting(E_ALL|E_STRICT);
//
//FlatEverySecondMonthModel
//
//@uses ModelBase
//@package
//@author date
//@since 2015/09/18
//

require("model/ModelBase.php");

require("MtTableUtil.php");

require("MtSetting.php");

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
//@param mixed $flattype
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
//@param mixed $flattype
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
//@param mixed $flattype
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
class FlatEverySecondMonthModel extends ModelBase {
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
				label: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3"
			},
			2: {
				prefix: "fp",
				label: "\u30D5\u30E5\u30FC\u30C1\u30E3\u30FC\u30D5\u30A9\u30F3"
			},
			3: {
				prefix: "dc",
				label: "\u30C7\u30FC\u30BF\u30AB\u30FC\u30C9"
			},
			4: {
				prefix: "etc",
				label: "\u305D\u306E\u4ED6"
			},
			5: {
				prefix: "etc01",
				label: "\u305D\u306E\u4ED61"
			},
			6: {
				prefix: "etc02",
				label: "\u305D\u306E\u4ED62"
			},
			7: {
				prefix: "etc03",
				label: "\u305D\u306E\u4ED63"
			},
			8: {
				prefix: "etc04",
				label: "\u305D\u306E\u4ED64"
			},
			9: {
				prefix: "etc05",
				label: "\u305D\u306E\u4ED65"
			},
			10: {
				prefix: "etc06",
				label: "\u305D\u306E\u4ED66"
			}
		};
	}

	getNow() {
		return this.get_DB().getNow();
	}

	getExcludeTelno(flatid, flattype, mcntype) //除外電話番号を取得
	//除外電話番号をSQL用にする
	{
		var res = Array();
		var sql = "select telno from bill_flat_exclude_tb where" + " flatid=" + this.getDB().dbQuote(flatid, "integer", true) + " and flattype=" + this.getDB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.getDB().dbQuote(mcntype, "integer", true);
		var exclude = this.getDB().queryCol(sql);

		for (var key in exclude) {
			var value = exclude[key];
			res.push(this.getDB().dbQuote(value, "text", true));
		}

		return res;
	}

	getParentTelno(flatid, flattype, mcntype) //対象の親番号を取得
	//親電話番号をSQL用にする
	{
		var res = Array();
		var sql = "select prtelno from bill_flat_prtel_tb" + " where flatid=" + this.getDB().dbQuote(flatid, "integer", true) + " and flattype=" + this.getDB().dbQuote(flattype, "integer", true) + " and mcntype=" + this.getDB().dbQuote(mcntype, "integer", true);
		var prtelno = this.getDB().queryCol(sql);

		for (var key in prtelno) {
			var value = prtelno[key];
			var telno = str_replace("-", "", value);
			res.push(this.getDB().dbQuote(telno, "text", true));
		}

		return res;
	}

	getCharge(esm, mcntype) //switch( $mcntype ){
	//		case 1:	$charge = $esm["sp_fee"];	break;
	//		case 2:	$charge = $esm["fp_fee"];	break;
	//		case 3:	$charge = $esm["dc_fee"];	break;
	//		case 4:	$charge = $esm["etc_fee"];	break;
	//		}
	{
		var charge = 0;

		if (undefined !== this.flats[mcntype]) {
			var prefix = this.flats[mcntype].prefix;
			charge = esm[prefix + "_fee"];
		}

		return charge;
	}

	UpdateTeldetail(pactid, carid, detail, charge, charge_tax, comment, nowtime, table) //平準化の挿入
	//平準化の消費税挿入
	//ASPのdetailno修正
	//ASXのdetailno修正
	{
		var data = Array();
		data.pactid = this.getDB().dbQuote(pactid, "integer", true);
		data.telno = this.getDB().dbQuote(detail.telno, "text", true);
		data.code = this.getDB().dbQuote("001", "text", true);
		data.codename = this.getDB().dbQuote("\u57FA\u672C\u4F7F\u7528\u6599", "text", true);
		data.charge = this.getDB().dbQuote(charge, "integer", true);
		data.taxkubun = this.getDB().dbQuote("\u5408\u7B97", "text", true);
		data.detailno = this.getDB().dbQuote(detail.detailno + 1, "integer", true);
		data.recdate = this.getDB().dbQuote(nowtime, "timestamp", true);
		data.carid = this.getDB().dbQuote(carid, "integer", true);
		data.tdcomment = this.getDB().dbQuote(comment, "text", false);
		data.prtelno = this.getDB().dbQuote(detail.prtelno, "text", true);
		data.realcnt = "NULL";
		var keys = Object.keys(data);
		var sql = "insert into " + table + "(" + keys.join(",") + ")values(" + data.join(",") + ")";
		var tmpcnt = this.getDB().query(sql);
		data.code = this.getDB().dbQuote("955", "text", true);
		data.codename = this.getDB().dbQuote("\u6D88\u8CBB\u7A0E\u76F8\u5F53\u984D", "text", true);
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

	InsertTelDetailsFree(table, nowtime, esm, flattype, mcntype) //除外リスト
	//親番号の存在チェック
	//番号ごとに処理する
	{
		var carid = 1;
		var pactid = esm.pactid;
		var exclude = this.getExcludeTelno(esm.flatid, flattype, mcntype);
		var exclude_sql = "";

		if (!!exclude) {
			exclude_sql = " and det1.telno not in(" + exclude.join(",") + ")";
		}

		var prtelno = this.getParentTelno(esm.flatid, flattype, mcntype);

		if (!prtelno) {
			return false;
		}

		var sql = "select det1.telno,det1.prtelno,det1.detailno from " + table + " as det1 " + " where" + " det1.pactid= " + this.getDB().dbQuote(pactid, "integer", true) + " and det1.carid=" + this.getDB().dbQuote(carid, "integer", true) + exclude_sql + " and det1.prtelno in(" + prtelno.join(",") + ")" + " and det1.detailno=(" + "select max(detailno) from " + table + " as det2 where" + " det1.pactid = det2.pactid" + " and det1.telno=det2.telno" + " and COALESCE(det2.tdcomment,'') != " + this.getDB().dbQuote(esm.comment, "text", true) + " \tand code not in( 'ASP','ASX' )" + ")";
		var details = this.getDB().queryHash(sql);

		for (var key in details) //加算額の取得
		//tel_detail更新
		{
			var value = details[key];
			var charge = this.getCharge(esm, mcntype);
			var tax = +this.O_Setting.excise_tax;
			var charge_tax = +Math.floor(charge * tax);
			this.UpdateTeldetail(pactid, carid, value, charge, charge_tax, esm.comment, nowtime, table);
		}
	}

	InsertTelDetails(table, table_prev, nowtime, esm, flattype, mcntype) //除外リスト
	//親番号の存在チェック
	//
	{
		var carid = 1;
		var pactid = esm.pactid;
		var exclude = this.getExcludeTelno(esm.flatid, flattype, mcntype);
		var exclude_sql = "";

		if (!!exclude) {
			exclude_sql = " and det1.telno not in(" + exclude.join(",") + ")";
		}

		var prtelno = this.getParentTelno(esm.flatid, flattype, mcntype);

		if (!prtelno) {
			return false;
		}

		var sql = "select det1.telno,det1.prtelno,prev.charge,det1.detailno from " + table + " as det1" + " join " + table_prev + " prev on" + " prev.pactid= " + this.getDB().dbQuote(pactid, "integer", true) + " and prev.telno = det1.telno" + " and prev.carid=" + this.getDB().dbQuote(carid, "integer", true) + " and prev.code=" + this.getDB().dbQuote("001", "text", true) + " and prev.tdcomment=" + this.getDB().dbQuote(esm.comment, "text", false) + " where" + " det1.pactid= " + this.getDB().dbQuote(pactid, "integer", true) + " and det1.carid=" + this.getDB().dbQuote(carid, "integer", true) + exclude_sql + " and det1.prtelno in(" + prtelno.join(",") + ")" + " and det1.detailno=(" + "select max(detailno) from " + table + " as det2 where" + " det1.pactid = det2.pactid" + " and det1.telno=det2.telno" + " and COALESCE(det2.tdcomment,'') != " + this.getDB().dbQuote(esm.comment, "text", true) + " \tand code not in( 'ASP','ASX' )" + ")";
		var details = this.getDB().queryHash(sql);

		for (var key in details) //消費税は前月から引っ張ってくる
		//更新
		{
			var value = details[key];
			var charge = -value.charge;
			sql = "select charge from " + table_prev + " where" + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and telno=" + this.getDB().dbQuote(value.telno, "text", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and code=" + this.getDB().dbQuote("955", "text", true) + " and tdcomment=" + this.getDB().dbQuote(esm.comment, "text", false);
			var charge_tax = this.getDB().queryOne(sql);
			this.UpdateTeldetail(pactid, carid, value, charge, -charge_tax, esm.comment, nowtime, table);
		}
	}

	getBillFlatEsm(pactid, date) //SQL作る
	//pactidの指定がされていたらする
	{
		var sql = "select * from bill_flat_esm_tb where" + " start_date <= " + this.getDB().dbQuote(date, "date", true) + " and end_date > " + this.getDB().dbQuote(date, "date", true);

		if (pactid != "all") {
			sql += " and pactid=" + this.getDB().dbQuote(pactid, "integer", true);
		}

		return this.getDB().queryHash(sql);
	}

	updateTelDetails(pactid, bill_date, mode) //recdateやfixdateの値を取得
	//指定された年月の対象となる平準化対象を取得
	//平準化対象の取得
	//顧客ごとにやる
	{
		var nowtime = this.getNow();

		if (bill_date == "none") {
			var tmp = this.getNow();
			var year = tmp.substr(0, 4);
			var month = tmp.substr(5, 2);
		} else {
			tmp = bill_date;
			year = tmp.substr(0, 4);
			month = tmp.substr(4, 2);
		}

		var tableNoPrev = this.getTableNoPrev(year, month);
		var tableNo = MtTableUtil.getTableNo(year + month, false);
		var tgt_date = date("Y-m-d", mktime(0, 0, 0, month, 1, year));
		var flat_esm = this.getBillFlatEsm(pactid, tgt_date);

		for (var esm of Object.values(flat_esm)) //削除して追加する
		{
			var table = "tel_details_" + tableNo + "_tb";
			var table_prev = "tel_details_" + tableNoPrev + "_tb";
			var carid = 1;

			if (!esm == true) {
				continue;
			}

			var start_month = +esm.start_date.substr(5, 2);
			var fee_flag = start_month % 2 == month % 2;

			if (mode == "O") //tel_details_xx_tbから削除する
				{
					var sql = "delete from " + table + " where" + " pactid=" + this.getDB().dbQuote(esm.pactid, "integer", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and tdcomment =" + this.getDB().dbQuote(esm.comment, "text", true);
					this.getDB().query(sql);
				} else if (mode == "A") //既に追加されている場合は何もしない
				{
					sql = "select count(*) from " + table + " where" + " pactid=" + this.getDB().dbQuote(esm.pactid, "integer", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true) + " and tdcomment =" + this.getDB().dbQuote(esm.comment, "text", true);
					var num = this.getDB().queryCol(sql);

					if (num > 0) {
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

						for (var mcntype in _tmp_0) {
							var flat = _tmp_0[mcntype];
							var fee = flat.prefix + "_fee";
							var stop = flat.prefix + "_stop";

							if (esm[fee] > 0 && esm[stop] == false) {
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

						for (var mcntype in _tmp_1) {
							var flat = _tmp_1[mcntype];
							fee = flat.prefix + "_fee";
							stop = flat.prefix + "_stop";

							if (esm[fee] > 0 && esm[stop] == false) {
								this.InsertTelDetails(table, table_prev, nowtime, esm, 1, mcntype);
							}
						}
					}
				}
		}

		return true;
	}

	getTableNoPrev(year, month) {
		var tmp = date("Y-m-d", mktime(0, 0, 0, month, 0, year));
		year = tmp.substr(0, 4);
		month = tmp.substr(5, 2);
		tmp = year + month;
		return MtTableUtil.getTableNo(tmp, false);
	}

	update(pactid, bill_date, mode) //トランザクション開始
	//コミット
	{
		this.get_DB().beginTransaction();
		var rtn = this.updateTelDetails(pactid, bill_date, mode);

		if (rtn == false) {
			this.get_DB().rollback();
			this.errorOut(1000, "\n" + "\u5931\u6557 \n", 0, "", "");
			return false;
		} else {
			this.infoOut("\u6210\u529F\n", 0);
		}

		this.get_DB().commit();
		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};