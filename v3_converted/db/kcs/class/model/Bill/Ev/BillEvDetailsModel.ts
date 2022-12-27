//
//EV請求明細表示Model
//
//更新履歴：<br>
//2010/07/21 宮澤龍彦 作成
//
//@package Bill
//@subpackage Model
//@author miyazawa
//@filesource
//@since 2010/07/21
//@uses BillEvModel
//
//
//
//EV請求明細表示Model
//
//@package Bill
//@subpackage Model
//@author miyazawa
//@since 2010/07/21
//@uses BillEvModel
//

require("model/Bill/Ev/BillEvModel.php");

//
//合計
//
//
//ASP
//
//
//コンストラクター
//
//@author miyazawa
//@since 2010/07/21
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//一覧データ取得
//テーブル名の決定
//配下部署一覧取得
//件数取得（ダウンロード以外）
//リミット設定（ダウンロード以外）
//対象のEVID取得
//ダウンロードの時
//請求明細の時
//EXCELダウンロード実行
//CSVダウンロード実行
//利用明細の時
//CSVダウンロード実行
//（ダウンロードの時はここでスクリプト終了）
//ダウンロード以外の時データを取得してリターン
//
//@author miyazawa
//@since 2010/07/21
//
//@param array $H_sess
//@param mixed $download
//@param mixed $allflg （未使用）
//@param mixed $O_view（大量のデータを取得する時はメモリに溜めずここで出力するほか無い）
//@access public
//@return void
//
//
//請求明細のselect句作成
//
//@author miyazawa
//@since 2010/07/21
//
//@access private
//@return void
//
//
//請求明細のselect句作成（利用明細）
//
//@author miyazawa
//@since 2010/07/21
//
//@access private
//@return void
//
//
//EV請求明細のFrom句作成
//
//@author miyazawa
//@since 2010/07/21
//
//@access private
//@return void
//
//
//EV請求明細のFrom句作成（利用明細）
//
//@author miyazawa
//@since 2010/07/21
//
//@access private
//@return void
//
//
//EV請求明細行数
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//EV利用明細行数
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//EV請求明細取得
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//利用明細取得SQL文作成
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $H_get
//@param mixed $sort
//@access private
//@return void
//
//
//合計データ行用select句作成（ASP抜き）
//
//@author miyazawa
//@since 2008/08/06
//
//@access private
//@return void
//
//
//合計データ行用select句作成
//
//@author miyazawa
//@since 2010/07/21
//
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author miyazawa
//@since 2008/08/06
//
//@param mixed $H_get
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $H_get
//@access private
//@return void
//
//
//EV請求詳細用where句作成
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//EV請求詳細用where句作成
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//EV請求詳細用order句作成
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $sort
//@access private
//@return void
//
//
//EV利用明細用order句作成
//
//@author miyazawa
//@since 2010/07/21
//
//@param mixed $sort
//@access private
//@return void
//
//
//選択部署配下のEVID取得 <br>
//EVID単位の請求データからevidとevcoidだけ抜き出す
//
//@author miyazawa
//@since 2010/07/21
//
//@param array $A_evbill
//@access private
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/07/21
//
//@access public
//@return void
//
class BillEvDetailsModel extends BillEvModel {
	static SUMNAME = "\u5408\u8A08";
	static SUBSUMNAME = "\u8ACB\u6C42\u91D1\u984D";
	static ASPCODE = "ASP";
	static ASXCODE = "ASX";

	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, download = false, O_view = undefined) //選択された部署ID
	//テーブル名の決定
	//配下部署一覧
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		var postid = H_sess[BillEvDetailsModel.PUB].current_postid;
		this.setTableName(H_sess[BillEvDetailsModel.PUB].cym);
		var A_allpost = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var A_data = Array();

		if (false === download) //件数取得
			//利用明細
			{
				if (H_sess.SELF.mode === "1") //12ヶ月前を越えたらエラー
					{
						if (H_sess[BillEvDetailsModel.PUB].cym <= date("Ym", mktime(0, 0, 0, date("m") - 12, date("n"), date("Y")))) {
							return A_data;
						}

						A_data[0] = this.get_DB().queryOne(this.makeBillHistoryCntSQL(H_sess.SELF.get));
					} else //合計行分を加える
					{
						var linecnt = this.get_DB().queryOne(this.makeBillDetailsCntSQL(H_sess.SELF.get));

						if (linecnt > 0) {
							if (-1 !== this.A_Auth.indexOf("fnc_asp") === true) {
								linecnt = linecnt + 2;
							} else {
								linecnt++;
							}
						}

						A_data[0] = linecnt;
					}
			}

		if (undefined !== H_sess.SELF.dlmode === true && "0" == H_sess.SELF.dlmode) //EXCELダウンロード
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = "0";
				}

				if (undefined !== H_sess.SELF.evcoid == true && H_sess.SELF.evcoid != "") {
					H_sess.SELF.post.evcoid = H_sess.SELF.evcoid;
				}

				var A_evbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillEvDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				var A_evid = this.getEvidDataOnly(A_evbill);
				A_data[1] = Array();

				if (undefined !== H_sess.SELF.post.serial === true) //viewのデータ行数セット
					//スタート行の書き込み
					//対象IDをループしてカード毎にここで出力（請求明細）
					//次のページまで空行で埋める
					//スタート行の書き込み
					//対象IDをループしてカード毎にここで出力（利用明細）
					//次のページまで空行で埋める
					{
						O_view.setDataCnt(A_evid.length);
						O_view.writeStartDataLine();

						for (var cnt = 0; cnt < A_evid.length; cnt++) //利用明細取得
						//viewのリスナーにデータを渡す
						{
							A_data = Array();
							var A_one_use = this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_evid[cnt], H_sess.SELF.sort));
							O_view.writeBillDataLine(A_one_use, "4");
						}

						O_view.writeBrankToNextPage();
						O_view.writeStartDataLine();

						for (cnt = 0;; cnt < A_evid.length; cnt++) //利用明細取得
						//viewのリスナーにデータを渡す
						{
							A_data = Array();
							A_one_use = this.get_DB().queryHash(this.makeBillHistoryDataSQL(A_evid[cnt], H_sess.SELF.sort));
							O_view.writeUseDataLine(A_one_use, "4");
						}

						O_view.writeBrankToNextPage();
					} else //ヘッダー出力
					//対象IDをループしてEVID毎にここで出力
					{
						O_view.displayCSVHeader(this.A_Auth, H_sess);

						for (cnt = 0;; cnt < A_evid.length; cnt++) //データ行出力
						{
							var A_one_data = this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_evid[cnt], "0,a"));
							O_view.outputDataLine(A_one_data);
						}

						throw die();
					}
			} else if (undefined !== H_sess.SELF.dlmode === true && "1" === H_sess.SELF.dlmode) //ヘッダー出力
			//対象IDをループしてEVID毎にここで出力
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = "0";
				}

				A_evbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillEvDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				A_evid = this.getEvidDataOnly(A_evbill);
				A_data[1] = Array();
				O_view.displayCSVHeader(this.A_Auth, H_sess);

				for (cnt = 0;; cnt < A_evid.length; cnt++) {
					A_one_data = this.get_DB().queryHash(this.makeBillHistoryDataSQL(A_evid[cnt], "0,a"));
					O_view.outputHistoryDataLine(A_one_data);
				}

				throw die();
			} else //利用明細表示
			{
				if (H_sess.SELF.mode === "1") {
					if (false === download) //リミット設定
						{
							this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.detailoffset - 1) * H_sess.SELF.limit);
						}

					A_data[1] = this.get_DB().queryHash(this.makeBillHistoryDataSQL(H_sess.SELF.get, H_sess.SELF.sort));
				} else //SQL文作成
					{
						var sql = this.makeBillDetailsDataSQL(H_sess.SELF.get, H_sess.SELF.sort);

						if (false === download) //リミット設定
							{
								this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.detailoffset - 1) * H_sess.SELF.limit);
							}

						A_data[1] = this.get_DB().queryHash(sql);
					}
			}

		if (false === download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeBillDetailsSelectSQL() {
		var A_col = ["ed.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "ed.evid", "ev_co_tb.evconame", "ed.code", "ed.codename", "ed.number", "ed.charge", "ed.taxkubun", "ed.detailno", "et.username", "et.ev_car_number", "et.ev_car_type"];
		return A_col.join(",");
	}

	makeBillHistorySelectSQL() {
		var A_col = ["eh.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "eh.evid", "eh.evcoid", "ev_co_tb.evconame", "eh.charge_date", "eh.charge_station", "eh.charge_type", "eh.charge_start", "eh.charge_end", "eh.charge_time", "eh.charge_power", "eh.charge_fee", "eh.uniqueid", "et.username", "et.ev_car_number", "et.ev_car_type"];
		return A_col.join(",");
	}

	makeBillDetailsFromSQL() {
		var sql = this.H_Tb.ev_details_tb + " as ed " + " left join " + this.H_Tb.ev_tb + " as et on ed.pactid=et.pactid and ed.evid=et.evid and ed.evcoid=et.evcoid" + " left join " + this.H_Tb.post_tb + " on et.pactid=" + this.H_Tb.post_tb + ".pactid and et.postid=" + this.H_Tb.post_tb + ".postid" + " left join ev_co_tb on ed.evcoid=ev_co_tb.evcoid";
		return sql;
	}

	makeBillHistoryFromSQL() {
		var sql = this.H_Tb.ev_usehistory_tb + " as eh " + " left join " + this.H_Tb.ev_tb + " as et on eh.pactid=et.pactid and eh.evid=et.evid and eh.evcoid=et.evcoid" + " left join " + this.H_Tb.post_tb + " on et.pactid=" + this.H_Tb.post_tb + ".pactid and et.postid=" + this.H_Tb.post_tb + ".postid" + " left join ev_co_tb on eh.evcoid=ev_co_tb.evcoid";
		return sql;
	}

	makeBillDetailsCntSQL(H_get) {
		var sql = "select " + " count(ed.evid) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get);
		return sql;
	}

	makeBillHistoryCntSQL(H_get) {
		var sql = "select " + " count(eh.evid) " + " from " + this.makeBillHistoryFromSQL() + " where " + this.makeBillHistoryWhereSQL(H_get);
		return sql;
	}

	makeBillDetailsDataSQL(H_get, sort) {
		var sql = "(select " + this.makeBillDetailsSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get);

		if (-1 !== this.A_Auth.indexOf("fnc_asp") == true) {
			sql += ") union all (" + this.makeBillDetailsSubSumSQL(H_get);
		}

		sql += ") union all (" + this.makeBillDetailsSumSQL(H_get) + ") " + this.makeBillDetailsOrderBySQL(sort);
		return sql;
	}

	makeBillHistoryDataSQL(H_get, sort) {
		var sql = "select " + this.makeBillHistorySelectSQL() + " from " + this.makeBillHistoryFromSQL() + " where " + this.makeBillHistoryWhereSQL(H_get) + this.makeBillHistoryOrderBySQL(sort);
		return sql;
	}

	makeBillDetailsSubSumSelectSQL(detailno) {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "ed.evid", "ev_co_tb.evconame", "null as code", "'" + BillEvDetailsModel.SUBSUMNAME + "' as codename", "coalesce(sum(ed.number),0) as number", "coalesce(sum(ed.charge),0) as charge", "null as taxkubun", detailno + " as detailno", "null as username", "null as ev_car_number", "null as ev_car_type"];
		return A_col.join(",");
	}

	makeBillDetailsSumSelectSQL() {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "ed.evid", "ev_co_tb.evconame", "null as code", "'" + BillEvDetailsModel.SUMNAME + "' as codename", "coalesce(sum(ed.number),0) as number", "coalesce(sum(ed.charge),0) as charge", "null as taxkubun", "max(ed.detailno)+2 as detailno", "null as username", "null as ev_car_number", "null as ev_car_type"];
		return A_col.join(",");
	}

	makeBillDetailsSubSumSQL(H_get) {
		var no_sql = "select " + " max(detailno) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "ed") + " and " + " code not in ('" + BillEvDetailsModel.ASPCODE + "','" + BillEvDetailsModel.ASXCODE + "')";
		var detailno = this.getDB().queryOne(no_sql) + 1;
		var sql = "select " + this.makeBillDetailsSubSumSelectSQL(detailno) + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "ed") + " and " + " code not in ('" + BillEvDetailsModel.ASPCODE + "','" + BillEvDetailsModel.ASXCODE + "')" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "ed.evid," + "ev_co_tb.evconame";
		return sql;
	}

	makeBillDetailsSumSQL(H_get) {
		var sql = "select " + this.makeBillDetailsSumSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "ed") + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "ed.evid," + "ev_co_tb.evconame";
		return sql;
	}

	makeBillHistoryWhereSQL(H_get, tb = "eh") //契約ID
	//EVID
	//EV先
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".evid=" + this.get_DB().dbQuote(H_get.evid, "text", true));
		A_where.push(tb + ".evcoid=" + this.get_DB().dbQuote(H_get.evcoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsWhereSQL(H_get, tb = "ed") //契約ID
	//EVID
	//EV先
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".evid=" + this.get_DB().dbQuote(H_get.evid, "text", true));
		A_where.push(tb + ".evcoid=" + this.get_DB().dbQuote(H_get.evcoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["detailno", "codename", "number", "charge"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",detailno ";
		}

		return sql;
	}

	makeBillHistoryOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["eh.charge_date", "eh.charge_station", "eh.charge_type", "eh.charge_start", "eh.charge_end", "eh.charge_time", "eh.charge_power", "eh.charge_fee", "eh.uniqueid"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		return sql;
	}

	getEvidDataOnly(A_evbill) {
		var A_data = Array();

		for (var cnt = 0; cnt < A_evbill.length; cnt++) {
			var A_tmp = Array();
			A_tmp.evid = A_evbill[cnt].evid;
			A_tmp.evcoid = A_evbill[cnt].evcoid;
			A_data.push(A_tmp);
		}

		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};