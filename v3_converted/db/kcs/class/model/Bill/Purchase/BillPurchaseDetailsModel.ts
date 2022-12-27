//
//購買請求明細表示Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/04/17
//@uses BillPurchaseModel
//
//
//
//購買請求明細表示Model
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/04/17
//@uses BillPurchaseModel
//

require("model/Bill/Purchase/BillPurchaseModel.php");

//
//合計
//
//
//ASP
//
//
//アルファパーチェスCOID
//
//
//アルファパーチェスcgiのmid
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//一覧データ取得
//
//@author houshiyama
//@since 2008/04/17
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
//@since 2008/04/15
//
//@access private
//@return void
//
//
//請求明細のselect句作成（商品ごと）
//
//@author houshiyama
//@since 2008/04/15
//
//@access private
//@return void
//
//
//購買請求明細のFrom句作成
//
//@author houshiyama
//@since 2008/05/09
//
//@access private
//@return void
//
//
//購買請求明細行数
//
//@author houshiyama
//@since 2008/04/17
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//購買請求明細取得
//
//@author houshiyama
//@since 2008/04/17
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//合計データ行用select句作成（ASP抜き）
//
//@author houshiyama
//@since 2008/08/06
//
//@access private
//@return void
//
//
//合計データ行用select句作成
//
//@author houshiyama
//@since 2008/04/24
//
//@access private
//@return void
//
//
//合計データ行用select句作成（商品ごと）
//
//@author houshiyama
//@since 2008/04/24
//
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author houshiyama
//@since 2008/08/06
//
//@param mixed $H_get
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author houshiyama
//@since 2008/04/24
//
//@param mixed $H_get
//@access private
//@return void
//
//
//合計データ行作成SQL（商品ごと）
//
//@author houshiyama
//@since 2008/04/24
//
//@param mixed $H_get
//@access private
//@return void
//
//
//購買請求詳細用where句作成
//
//@author houshiyama
//@since 2008/04/24
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//購買請求詳細用order句作成
//
//@author houshiyama
//@since 2008/04/24
//
//@param mixed $sort
//@access private
//@return void
//
//
//選択部署配下の購買ID取得 <br>
//購買ID単位の請求データからpurchidとpurchcoidだけ抜き出す
//
//@author houshiyama
//@since 2008/05/09
//
//@param array $A_purchbill
//@access private
//@return void
//
//
//makeAllBillDetailsSQL
//
//@author houshiyama
//@since 2008/07/04
//
//@param mixed $H_get
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/17
//
//@access public
//@return void
//
class BillPurchaseDetailsModel extends BillPurchaseModel {
	static SUMNAME = "\u5408\u8A08";
	static SUBSUMNAME = "\u8ACB\u6C42\u91D1\u984D";
	static ASPCODE = "ASP";
	static ASXCODE = "ASX";
	static SATCOID = 3;
	static COID_ASKUL = 1;
	static COID_KAUNET = 2;
	static COID_SAT = 3;
	static COID_ALL = 0;
	static COID_MONOTARO = 4;
	static SATMID = "103";

	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, download = false, O_view = undefined) //選択された部署ID
	//テーブル名の決定
	//配下部署一覧
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		var postid = H_sess[BillPurchaseDetailsModel.PUB].current_postid;
		this.setTableName(H_sess[BillPurchaseDetailsModel.PUB].cym);
		var A_allpost = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var A_data = Array();

		if (false === download) //件数取得
			//合計行分を加える
			{
				var linecnt = this.get_DB().queryOne(this.makeBillDetailsCntSQL(H_sess.SELF.get, H_sess.SELF.sort));

				if (linecnt > 0) {
					if (-1 !== this.A_Auth.indexOf("fnc_asp") === true) {
						linecnt = linecnt + 2;
					} else {
						linecnt++;
					}
				}

				A_data[0] = linecnt;
			}

		if (undefined !== H_sess.SELF.dlmode === true && "0" == H_sess.SELF.dlmode) //EXCELダウンロード
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = "0";
				}

				if (undefined !== H_sess.SELF.post.mtype == true) //if( self::SATMID === $H_sess["SELF"]["post"]["mtype"] ){
					//					$H_sess["SELF"]["post"]["purchcoid"] = self::SATCOID;
					//				}
					//				// アスクル・カウネット
					//				else{
					//					$H_sess["SELF"]["post"]["notpurchcoid"] = self::SATCOID;
					//				}
					//最初から複数選べるようにしとけよマジで・・・
					//この値は外しておく・・・
					{
						if (BillPurchaseDetailsModel.SATMID === H_sess.SELF.post.mtype) {
							H_sess.SELF.post.purchcoid_list = [BillPurchaseDetailsModel.COID_SAT, BillPurchaseDetailsModel.COID_MONOTARO];
						} else //アスクル・カウネット
							{
								H_sess.SELF.post.purchcoid_list = [BillPurchaseDetailsModel.COID_ASKUL, BillPurchaseDetailsModel.COID_KAUNET];
							}

						delete H_sess.SELF.post.purchcoid;
						delete H_sess.SELF.post.notpurchcoid;
					}

				if (undefined !== H_sess.SELF.purchcoid == true && H_sess.SELF.purchcoid != "") {
					H_sess.SELF.post.purchcoid = H_sess.SELF.purchcoid;
				}

				var A_purchbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillPurchaseDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				var A_purchid = this.getPurchidDataOnly(A_purchbill);
				A_data[1] = Array();

				if (undefined !== H_sess.SELF.post.serial === true) //viewのデータ行数セット
					//スタート行の書き込み
					//請求明細部分は要らなくなったが今後必要といわれた時用にコメント
					//				// 対象IDをループしてカード毎にここで出力（請求明細）
					//				for( $cnt = 0; $cnt < count( $A_purchid ); $cnt++ ){
					//					$A_data = array();
					//					// 請求明細取得
					//					$A_one_bill = $this->get_DB()->queryHash( $this->makeItemBillDetailsDataSQL( $A_purchid[$cnt] ) );
					//					// viewのリスナーにデータを渡す
					//					$O_view->writeBillDataLine( $A_one_bill, "3" );
					//				}
					//				// 次のページまで空行で埋める
					//				$O_view->writeBrankToNextPage();
					//対象IDをループしてカード毎にここで出力（利用明細）
					//次のページまで空行で埋める
					{
						O_view.setDataCnt(A_purchid.length);
						O_view.writeStartDataLine();

						for (var cnt = 0; cnt < A_purchid.length; cnt++) //利用明細取得
						//viewのリスナーにデータを渡す
						{
							A_data = Array();
							var A_one_use = this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_purchid[cnt], H_sess.SELF.sort));
							O_view.writeUseDataLine(A_one_use, "3");
						}

						O_view.writeBrankToNextPage();
					} else //S227 hanashima 20201022
					//対象IDをループして購買ID毎にデータを取得
					//ヘッダー出力
					//出力
					//S227 hanashima 20201022				
					//				// ヘッダー出力
					//				$O_view->displayCSVHeader( $this->A_Auth, $H_sess );
					//				// 対象IDをループして購買ID毎にここで出力
					//				for( $cnt = 0; $cnt < count( $A_purchid ); $cnt++ ){
					//					$A_one_data = $this->get_DB()->queryHash( $this->makeBillDetailsDataSQL( $A_purchid[$cnt], "0,a" ) );
					//					// データ行出力
					//					$O_view->outputDataLine( $A_one_data );
					//				}
					{
						var A_one_datas = Array();

						for (cnt = 0;; cnt < A_purchid.length; cnt++) {
							A_one_datas.push(this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_purchid[cnt], "0,a")));
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
			} else //SQL文作成
			{
				var sql = this.makeBillDetailsDataSQL(H_sess.SELF.get, H_sess.SELF.sort);

				if (false === download) //リミット設定
					{
						this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.detailoffset - 1) * H_sess.SELF.limit);
					}

				A_data[1] = this.get_DB().queryHash(sql);
			}

		if (false === download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeBillDetailsSelectSQL() {
		var A_col = ["pd.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "pd.purchid", "purchase_co_tb.purchconame", "pd.code", "pd.codename", "pd.charge", "pd.slipno", "pd.itemcode", "pd.itemname", "pd.itemsum", "pd.buydate", "pd.comment", "pd.taxkubun", "pd.detailno", "pd.green1", "pd.green2", "pd.green3", "pd.green4", "case when coalesce(pd.green1,'0')='1' or coalesce(pd.green2,'0')='1' or coalesce(pd.green3,'0')='1' or coalesce(pd.green4,'0')='1' then true else false end as green", "purchase_utiwake_tb.codetype"];
		return A_col.join(",");
	}

	makeItemBillDetailsSelectSQL() {
		var A_col = ["1 as sort", "pd.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "pd.purchid", "pd.purchcoid", "purchase_co_tb.purchconame", "coalesce(sum(pd.charge),0) as charge", "pd.itemname", "coalesce(sum(pd.itemsum),0) as itemsum", "case when coalesce(pd.green1,'0')='1' or coalesce(pd.green2,'0')='1' or coalesce(pd.green3,'0')='1' or coalesce(pd.green4,'0')='1' then true else false end as green"];
		return A_col.join(",");
	}

	makeBillDetailsFromSQL() {
		var sql = this.H_Tb.purchase_details_tb + " as pd " + " left join " + this.H_Tb.purchase_tb + " as pt on pd.pactid=pt.pactid and pd.purchid=pt.purchid and pd.purchcoid=pt.purchcoid" + " left join " + this.H_Tb.post_tb + " on pt.pactid=" + this.H_Tb.post_tb + ".pactid and pt.postid=" + this.H_Tb.post_tb + ".postid" + " left join purchase_co_tb on pd.purchcoid=purchase_co_tb.purchcoid" + " left join purchase_utiwake_tb on pd.code=purchase_utiwake_tb.code and pd.purchcoid=purchase_utiwake_tb.purchcoid";
		return sql;
	}

	makeBillDetailsCntSQL(H_get, sort) {
		var sql = "select " + " count(pd.purchid) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get);
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

	makeBillDetailsSubSumSelectSQL(detailno) {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "pd.purchid", "purchase_co_tb.purchconame", "null as code", "null as codename", "coalesce(sum(pd.charge),0) as charge", "null as slipno", "null as itemcode", "'" + BillPurchaseDetailsModel.SUBSUMNAME + "' as itemname", "null as itemsum", "null as buydate", "null as comment", "null as taxkubun", detailno + " as detailno", "null as green1", "null as green2", "null as green3", "null as green4", "false as green", "null as codetype"];
		return A_col.join(",");
	}

	makeBillDetailsSumSelectSQL() {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "pd.purchid", "purchase_co_tb.purchconame", "null as code", "null as codename", "coalesce(sum(pd.charge),0) as charge", "null as slipno", "null as itemcode", "'" + BillPurchaseDetailsModel.SUMNAME + "' as itemname", "null as itemsum", "null as buydate", "null as comment", "null as taxkubun", "max(pd.detailno)+2 as detailno", "null as green1", "null as green2", "null as green3", "null as green4", "false as green", "null as codetype"];
		return A_col.join(",");
	}

	makeItemBillDetailsSumSelectSQL() {
		var A_col = ["2 as sort", "null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "pd.purchid", "pd.purchcoid", "purchase_co_tb.purchconame", "coalesce(sum(pd.charge),0) as charge", "'\u5408\u8A08' as itemname", "null as itemsum", "false as green"];
		return A_col.join(",");
	}

	makeBillDetailsSubSumSQL(H_get) {
		var no_sql = "select " + " max(detailno) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "pd") + " and " + " pd.code not in ('" + BillPurchaseDetailsModel.ASPCODE + "','" + BillPurchaseDetailsModel.ASXCODE + "')";
		var detailno = this.getDB().queryOne(no_sql) + 1;
		var sql = "select " + this.makeBillDetailsSubSumSelectSQL(detailno) + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "pd") + " and " + " pd.code not in ('" + BillPurchaseDetailsModel.ASPCODE + "','" + BillPurchaseDetailsModel.ASXCODE + "')" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "pd.purchid," + "purchase_co_tb.purchconame";
		return sql;
	}

	makeBillDetailsSumSQL(H_get) {
		var sql = "select " + this.makeBillDetailsSumSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "pd") + " and " + " purchase_utiwake_tb.codetype='0'" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "pd.purchid," + "purchase_co_tb.purchconame";
		return sql;
	}

	makeItemBillDetailsSumSQL(H_get) {
		var sql = "select " + this.makeItemBillDetailsSumSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "pd") + " and " + " pd.code not in (" + this.get_DB().dbQuote(this.O_Set.utiwake_asp, "text", true) + "," + this.get_DB().dbQuote(this.O_Set.utiwake_asx, "text", true) + "," + "'009')" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "pd.purchid," + "pd.purchcoid," + "purchase_co_tb.purchconame";
		return sql;
	}

	makeBillDetailsWhereSQL(H_get, tb = "pd") //契約ID
	//購買ID
	//購買先
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".purchid=" + this.get_DB().dbQuote(H_get.purchid, "text", true));
		A_where.push(tb + ".purchcoid=" + this.get_DB().dbQuote(H_get.purchcoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["detailno", "buydate", "slipno", "itemcode", "itemname", "green", "itemsum", "charge", "comment"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] !== "0") {
			sql += ",detailno ";
		}

		return sql;
	}

	getPurchidDataOnly(A_purchbill) {
		var A_data = Array();

		for (var cnt = 0; cnt < A_purchbill.length; cnt++) {
			var A_tmp = Array();
			A_tmp.purchid = A_purchbill[cnt].purchid;
			A_tmp.purchcoid = A_purchbill[cnt].purchcoid;
			A_data.push(A_tmp);
		}

		return A_data;
	}

	makeItemBillDetailsDataSQL(H_get) {
		var sql = "(select " + this.makeItemBillDetailsSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get) + " and " + " pd.code not in (" + this.get_DB().dbQuote(this.O_Set.utiwake_asp, "text", true) + "," + this.get_DB().dbQuote(this.O_Set.utiwake_asx, "text", true) + "," + "'009')" + " group by " + "pd.pactid," + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "pd.purchid," + "pd.purchcoid," + "purchase_co_tb.purchconame," + "pd.itemname," + "pd.comment," + "green" + ") union all (" + this.makeItemBillDetailsSumSQL(H_get) + ") " + " order by sort,itemname ";
		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};