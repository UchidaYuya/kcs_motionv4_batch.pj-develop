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

require("model/Bill/Transit/BillTransitModel.php");

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
class BillTransitDetailsModel extends BillTransitModel {
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
		var postid = H_sess[BillTransitDetailsModel.PUB].current_postid;
		this.setTableName(H_sess[BillTransitDetailsModel.PUB].cym);
		var A_allpost = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var A_data = Array();

		if (false === download) //件数取得
			//利用明細
			{
				if (H_sess.SELF.mode === "1") //12ヶ月前を越えたらエラー
					{
						if (H_sess[BillTransitDetailsModel.PUB].cym <= date("Ym", mktime(0, 0, 0, date("m") - 12, date("n"), date("Y")))) {
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

				if (undefined !== H_sess.SELF.trancoid == true && H_sess.SELF.trancoid != "") {
					H_sess.SELF.post.trancoid = H_sess.SELF.trancoid;
				}

				var A_tranbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillTransitDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
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
					} else //S227 hanashima 20201022
					//対象IDをループして運送ID毎にデータを取得
					//ヘッダー出力
					//出力する
					//S227 hanashima 20201022
					//				// ヘッダー出力
					//				$O_view->displayCSVHeader( $this->A_Auth, $H_sess );
					//				// 対象IDをループして運送ID毎にここで出力
					//				for( $cnt = 0; $cnt < count( $A_tranid ); $cnt++ ){
					//					$A_one_data = $this->get_DB()->queryHash( $this->makeBillDetailsDataSQL( $A_tranid[$cnt], "0,a" ) );
					//					// データ行出力
					//					$O_view->outputDataLine( $A_one_data );
					//				}
					{
						var A_one_datas = Array();

						for (cnt = 0;; cnt < A_tranid.length; cnt++) {
							A_one_datas.push(this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_tranid[cnt], "0,a")));
						}

						O_view.displayCSVHeader(this.A_Auth, H_sess);

						for (var A_one_data of Object.values(A_one_datas)) //データ行出力
						{
							O_view.outputDataLine(A_one_data);
						}

						if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
							{
								_SESSION.dataDownloadCheck = 2;
							}

						throw die();
					}
			} else if (undefined !== H_sess.SELF.dlmode === true && "1" === H_sess.SELF.dlmode) //S227 hanashima 20201022
			//対象IDをループして運送ID毎にデータを取得
			//ヘッダー出力
			//出力
			//S227 hanashima 20201022
			//			// ヘッダー出力
			//			$O_view->displayCSVHeader( $this->A_Auth, $H_sess );
			//			// 対象IDをループして運送ID毎にここで出力
			//			for( $cnt = 0; $cnt < count( $A_tranid ); $cnt++ ){
			//				$A_one_data = $this->get_DB()->queryHash( $this->makeBillHistoryDataSQL( $A_tranid[$cnt], "0,a" ) );
			//				$O_view->outputHistoryDataLine( $A_one_data );
			//			}
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = "0";
				}

				A_tranbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillTransitDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				A_tranid = this.getTranidDataOnly(A_tranbill);
				A_data[1] = Array();
				A_one_datas = Array();

				for (cnt = 0;; cnt < A_tranid.length; cnt++) {
					A_one_datas.push(this.get_DB().queryHash(this.makeBillHistoryDataSQL(A_tranid[cnt], "0,a")));
				}

				O_view.displayCSVHeader(this.A_Auth, H_sess);

				for (var A_one_data of Object.values(A_one_datas)) {
					O_view.outputHistoryDataLine(A_one_data);
				}

				if (undefined !== _COOKIE.dataDownloadRun) //セッションでダウンロード完了にする
					{
						_SESSION.dataDownloadCheck = 2;
					}

				throw die();
			} else //利用明細表示
			{
				if (H_sess.SELF.mode === "1") {
					if (false === download) //リミット設定
						{
							this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.detailoffset - 1) * H_sess.SELF.limit);
						}

					A_data[1] = this.get_DB().queryHash(this.makeBillHistoryDataSQL(H_sess.SELF.get, H_sess.SELF.hsort));
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
		var A_col = ["td.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "td.tranid", "transit_co_tb.tranconame", "td.code", "td.codename", "td.charge", "td.sendcount", "td.weight", "td.taxkubun", "td.detailno", "tt.username"];
		return A_col.join(",");
	}

	makeBillHistorySelectSQL() {
		var A_col = ["th.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "th.tranid", "th.trancoid", "transit_co_tb.tranconame", "th.charge", "th.excise", "th.insurance", "th.weight", "th.sendcount", "th.slipno", "th.to_name", "th.to_telno", "th.senddate", "th.comment", "tt.username"];
		return A_col.join(",");
	}

	makeBillDetailsFromSQL() {
		var sql = this.H_Tb.transit_details_tb + " as td " + " left join " + this.H_Tb.transit_tb + " as tt on td.pactid=tt.pactid and td.tranid=tt.tranid and td.trancoid=tt.trancoid" + " left join " + this.H_Tb.post_tb + " on tt.pactid=" + this.H_Tb.post_tb + ".pactid and tt.postid=" + this.H_Tb.post_tb + ".postid" + " left join transit_co_tb on td.trancoid=transit_co_tb.trancoid";
		return sql;
	}

	makeBillHistoryFromSQL() {
		var sql = this.H_Tb.transit_usehistory_tb + " as th " + " left join " + this.H_Tb.transit_tb + " as tt on th.pactid=tt.pactid and th.tranid=tt.tranid and th.trancoid=tt.trancoid" + " left join " + this.H_Tb.post_tb + " on tt.pactid=" + this.H_Tb.post_tb + ".pactid and tt.postid=" + this.H_Tb.post_tb + ".postid" + " left join transit_co_tb on th.trancoid=transit_co_tb.trancoid";
		return sql;
	}

	makeBillDetailsCntSQL(H_get) {
		var sql = "select " + " count(td.tranid) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get);
		return sql;
	}

	makeBillHistoryCntSQL(H_get) {
		var sql = "select " + " count(th.tranid) " + " from " + this.makeBillHistoryFromSQL() + " where " + this.makeBillHistoryWhereSQL(H_get);
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
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "td.tranid", "transit_co_tb.tranconame", "null as code", "'" + BillTransitDetailsModel.SUBSUMNAME + "' as codename", "coalesce(sum(td.charge),0) as charge", "coalesce(sum(td.sendcount),0) as sendcount", "coalesce(sum(td.weight),0) as weight", "null as taxkubun", detailno + " as detailno", "null as username"];
		return A_col.join(",");
	}

	makeBillDetailsSumSelectSQL() {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "td.tranid", "transit_co_tb.tranconame", "null as code", "'" + BillTransitDetailsModel.SUMNAME + "' as codename", "coalesce(sum(td.charge),0) as charge", "coalesce(sum(td.sendcount),0) as sendcount", "coalesce(sum(td.weight),0) as weight", "null as taxkubun", "max(td.detailno)+2 as detailno", "null as username"];
		return A_col.join(",");
	}

	makeBillDetailsSubSumSQL(H_get) {
		var no_sql = "select " + " max(td.detailno) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "td") + " and " + " code not in ('" + BillTransitDetailsModel.ASPCODE + "','" + BillTransitDetailsModel.ASXCODE + "')";
		var detailno = this.getDB().queryOne(no_sql) + 1;
		var sql = "select " + this.makeBillDetailsSubSumSelectSQL(detailno) + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "td") + " and " + " code not in ('" + BillTransitDetailsModel.ASPCODE + "','" + BillTransitDetailsModel.ASXCODE + "')" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "td.tranid," + "transit_co_tb.tranconame";
		return sql;
	}

	makeBillDetailsSumSQL(H_get) {
		var sql = "select " + this.makeBillDetailsSumSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "td") + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "td.tranid," + "transit_co_tb.tranconame";
		return sql;
	}

	makeBillHistoryWhereSQL(H_get, tb = "th") //契約ID
	//運送ID
	//会社
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".tranid=" + this.get_DB().dbQuote(H_get.tranid, "text", true));
		A_where.push(tb + ".trancoid=" + this.get_DB().dbQuote(H_get.trancoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsWhereSQL(H_get, tb = "td") //契約ID
	//運送ID
	//会社
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".tranid=" + this.get_DB().dbQuote(H_get.tranid, "text", true));
		A_where.push(tb + ".trancoid=" + this.get_DB().dbQuote(H_get.trancoid, "integer", true));
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
		var A_col = ["th.detailno", "th.senddate", "th.slipno", "th.to_name", "th.to_telno", "th.sendcount", "th.weight", "th.charge", "th.insurance", "th.excise", "th.comment"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",th.detailno ";
		}

		return sql;
	}

	getTranidDataOnly(A_tranbill) {
		var A_data = Array();

		for (var cnt = 0; cnt < A_tranbill.length; cnt++) {
			var A_tmp = Array();
			A_tmp.tranid = A_tranbill[cnt].tranid;
			A_tmp.trancoid = A_tranbill[cnt].trancoid;
			A_data.push(A_tmp);
		}

		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};