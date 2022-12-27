//
//運送請求明細表示Model
//
//更新履歴：<br>
//2010/03/05 宝子山浩平 作成
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2010/03/05
//@uses BillTransitModel
//
//
//
//運送請求明細表示Model
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2010/03/05
//@uses BillTransitModel
//

require("model/Bill/Healthcare/BillHealthcareModel.php");

//
//合計
//
//
//ASP
//
//
//コンストラクター
//
//@author houshiyama
//@since 2010/03/05
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
//対象の運送ID取得
//ダウンロードの時
//請求明細の時
//EXCELダウンロード実行
//CSVダウンロード実行
//利用明細の時
//CSVダウンロード実行
//（ダウンロードの時はここでスクリプト終了）
//ダウンロード以外の時データを取得してリターン
//
//@author houshiyama
//@since 2010/03/05
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
//@author houshiyama
//@since 2010/03/05
//
//@access private
//@return void
//
//
//請求明細のselect句作成（利用明細）
//
//@author houshiyama
//@since 2010/03/05
//
//@access private
//@return void
//
//
//運送請求明細のFrom句作成
//
//@author houshiyama
//@since 2010/03/05
//
//@access private
//@return void
//
//
//運送請求明細のFrom句作成（利用明細）
//
//@author houshiyama
//@since 2010/03/05
//
//@access private
//@return void
//
//
//運送請求明細行数
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//運送利用明細行数
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//運送請求明細取得
//
//@author houshiyama
//@since 2010/03/05
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
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $H_get
//@param mixed $sort
//@access private
//@return void
//
//
//合計データ行用select句作成（ASP抜き）
//
//@author houshiyama
//@since 2010/03/05
//
//@access private
//@return void
//
//
//合計データ行用select句作成
//
//@author houshiyama
//@since 2010/03/05
//
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $H_get
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $H_get
//@access private
//@return void
//
//
//運送請求詳細用where句作成
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//運送請求詳細用where句作成
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//運送請求詳細用order句作成
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $sort
//@access private
//@return void
//
//
//運送利用明細用order句作成
//
//@author houshiyama
//@since 2010/03/05
//
//@param mixed $sort
//@access private
//@return void
//
//
//選択部署配下の運送ID取得 <br>
//運送ID単位の請求データからtranidとtrancoidだけ抜き出す
//
//@author houshiyama
//@since 2010/03/05
//
//@param array $A_tranbill
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/03/05
//
//@access public
//@return void
//
class BillHealthcareDetailsModel extends BillHealthcareModel {
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
		var postid = H_sess[BillHealthcareDetailsModel.PUB].current_postid;
		this.setTableName(H_sess[BillHealthcareDetailsModel.PUB].cym);
		var A_allpost = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var A_data = Array();

		if (false === download) //// 件数取得
			//			// 利用明細
			//			if( $H_sess["SELF"]["mode"] === "1" ){
			//12ヶ月前を越えたらエラー
			//if( $H_sess[self::PUB]["cym"] <= date( "Ym", mktime( 0, 0, 0, date("m")-12, date("n"), date("Y") ) ) ){
			//}
			//			// 請求明細
			//			else{
			//				$linecnt = $this->get_DB()->queryOne( $this->makeBillDetailsCntSQL( $H_sess["SELF"]["get"] ) );
			//				// 合計行分を加える
			//				if( $linecnt > 0 ){
			//					if( in_array( "fnc_asp", $this->A_Auth, true ) === true ){
			//						$linecnt = $linecnt + 2;
			//					}
			//					else{
			//						$linecnt++;
			//					}
			//				}
			//				$A_data[0] = $linecnt;
			//			}
			{
				if (H_sess[BillHealthcareDetailsModel.PUB].cym <= date("Ym", mktime(0, 0, 0, date("m") - 24, date("n"), date("Y")))) {
					return A_data;
				}

				A_data[0] = this.get_DB().queryOne(this.makeBillHistoryCntSQL(H_sess.SELF.get));
			}

		if (undefined !== H_sess.SELF.dlmode === true && "0" == H_sess.SELF.dlmode) //EXCELダウンロード
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = "0";
				}

				if (undefined !== H_sess.SELF.trancoid == true && H_sess.SELF.trancoid != "") {
					H_sess.SELF.post.trancoid = H_sess.SELF.trancoid;
				}

				var A_tranbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillHealthcareDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				var A_tranid = this.getTranidDataOnly(A_tranbill);
				A_data[1] = Array();

				if (undefined !== H_sess.SELF.post.serial === true) //viewのデータ行数セット
					//スタート行の書き込み
					//対象IDをループしてカード毎にここで出力（利用明細）
					//次のページまで空行で埋める
					{
						O_view.setDataCnt(A_tranid.length);
						O_view.writeStartDataLine();

						for (var cnt = 0; cnt < A_tranid.length; cnt++) //利用明細取得
						//viewのリスナーにデータを渡す
						//$O_view->writeUseDataLine( $A_one_use, "4" );
						{
							A_data = Array();
							var A_one_use = this.get_DB().queryHash(this.makeBillHistoryDataSQL(A_tranid[cnt], H_sess.SELF.hsort));
							O_view.writeUseDataLine(A_one_use, H_sess.SELF.post.mtype);
						}

						O_view.writeBrankToNextPage();
					}
			} else if (undefined !== H_sess.SELF.dlmode === true && "1" === H_sess.SELF.dlmode) //ヘッダー出力
			//対象IDをループして運送ID毎にここで出力
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = "0";
				}

				var A_healthbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillHealthcareDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				var A_healthid = this.getHealthidDataOnly(A_healthbill);
				A_data[1] = Array();
				O_view.displayCSVHeader(this.A_Auth, H_sess);

				for (cnt = 0;; cnt < A_healthid.length; cnt++) {
					var A_one_data = this.get_DB().queryHash(this.makeBillHistoryDataSQL(A_healthid[cnt], "0,a"));
					O_view.outputHistoryDataLine(A_one_data);
				}

				throw die();
			} else //// 利用明細表示
			//			if( $H_sess["SELF"]["mode"] === "1" ){
			//}
			//			// 請求明細表示
			//			else{
			//				// SQL文作成
			//				$sql = $this->makeBillDetailsDataSQL( $H_sess["SELF"]["get"], $H_sess["SELF"]["sort"] );
			//				if( false === $download ){
			//					// リミット設定
			//					$this->get_DB()->setLimit( $H_sess["SELF"]["limit"], ( $H_sess["SELF"]["detailoffset"] - 1 ) * $H_sess["SELF"]["limit"] );
			//				}
			//				$A_data[1] = $this->get_DB()->queryHash( $sql );
			//			}
			{
				if (false === download) //リミット設定
					{
						this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.detailoffset - 1) * H_sess.SELF.limit);
					}

				A_data[1] = this.get_DB().queryHash(this.makeBillHistoryDataSQL(H_sess.SELF.get, H_sess.SELF.hsort));
			}

		if (false === download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeBillDetailsSelectSQL() {
		var A_col = ["dtl.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "dtl.healthid", "healthcare_co_tb.healthconame", "hlt.username"];
		return A_col.join(",");
	}

	makeBillHistorySelectSQL() {
		var A_col = ["hist.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "hist.healthid", "hist.healthcoid", "healthcare_co_tb.healthconame", "hlt.username", "hist.datadate", "coalesce(hist.steps,0) as steps", "coalesce(hist.calories,0) as calories", "coalesce(hist.move,0) as move"];
		return A_col.join(",");
	}

	makeBillDetailsFromSQL() {
		var sql = this.H_Tb.healthcare_details_tb + " as dtl " + " left join " + this.H_Tb.healthcare_tb + " as hlt on dtl.pactid=hlt.pactid and dtl.healthid=hlt.healthid and dtl.healthcoid=hlt.healthcoid" + " left join " + this.H_Tb.post_tb + " on hlt.pactid=" + this.H_Tb.post_tb + ".pactid and hlt.postid=" + this.H_Tb.post_tb + ".postid" + " left join healthcare_co_tb on dtl.healthcoid=healthcare_co_tb.healthcoid";
		return sql;
	}

	makeBillHistoryFromSQL() {
		var sql = this.H_Tb.healthcare_rechistory_tb + " as hist " + " left join " + this.H_Tb.healthcare_tb + " as hlt on hist.pactid=hlt.pactid and hist.healthid=hlt.healthid and hist.healthcoid=hlt.healthcoid" + " left join " + this.H_Tb.post_tb + " on hlt.pactid=" + this.H_Tb.post_tb + ".pactid and hlt.postid=" + this.H_Tb.post_tb + ".postid" + " left join healthcare_co_tb on hist.healthcoid=healthcare_co_tb.healthcoid";
		return sql;
	}

	makeBillDetailsCntSQL(H_get) {
		var sql = "select " + " count(dtl.healthid) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get);
		return sql;
	}

	makeBillHistoryCntSQL(H_get) {
		var sql = "select " + " count(hist.healthid) " + " from " + this.makeBillHistoryFromSQL() + " where " + this.makeBillHistoryWhereSQL(H_get);
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
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "hlt.healthid", "healthcare_co_tb.healthconame"];
		return A_col.join(",");
	}

	makeBillDetailsSumSelectSQL() {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "dtl.healthid"];
		return A_col.join(",");
	}

	makeBillDetailsSubSumSQL(H_get) {
		var no_sql = "select " + " max(td.detailno) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "td") + " and " + " code not in ('" + BillHealthcareDetailsModel.ASPCODE + "','" + BillHealthcareDetailsModel.ASXCODE + "')";
		var detailno = this.getDB().queryOne(no_sql) + 1;
		var sql = "select " + this.makeBillDetailsSubSumSelectSQL(detailno) + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "td") + " and " + " code not in ('" + BillHealthcareDetailsModel.ASPCODE + "','" + BillHealthcareDetailsModel.ASXCODE + "')" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "td.tranid," + "transit_co_tb.tranconame";
		return sql;
	}

	makeBillDetailsSumSQL(H_get) {
		var sql = "select " + this.makeBillDetailsSumSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "td") + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "td.tranid," + "transit_co_tb.tranconame";
		return sql;
	}

	makeBillHistoryWhereSQL(H_get, tb = "hist") //契約ID
	//運送ID
	//会社
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".healthid=" + this.get_DB().dbQuote(H_get.healthid, "text", true));
		A_where.push(tb + ".healthcoid=" + this.get_DB().dbQuote(H_get.healthcoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsWhereSQL(H_get, tb = "dtl") //契約ID
	//運送ID
	//会社
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".healthid=" + this.get_DB().dbQuote(H_get.healthid, "text", true));
		A_where.push(tb + ".healthcoid=" + this.get_DB().dbQuote(H_get.healthcoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["detailno", "code", "codename", "sendcount", "weight", "charge"];
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
		var A_col = ["hist.datadate", "hist.steps", "hist.calories", "hist.move"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",hist.datadate ";
		}

		return sql;
	}

	getHealthidDataOnly(A_healthbill) {
		var A_data = Array();

		for (var cnt = 0; cnt < A_healthbill.length; cnt++) {
			var A_tmp = Array();
			A_tmp.healthid = A_healthbill[cnt].healthid;
			A_tmp.healthcoid = A_healthbill[cnt].healthcoid;
			A_data.push(A_tmp);
		}

		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};