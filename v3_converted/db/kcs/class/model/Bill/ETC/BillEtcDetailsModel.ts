//
//ETC請求明細表示Model
//
//更新履歴：<br>
//2008/07/02 宝子山浩平 作成
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/07/02
//@uses BillEtcModel
//
//
//
//ETC請求明細表示Model
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/07/02
//@uses BillEtcModel
//

require("model/Bill/ETC/BillEtcModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/07/02
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
//@since 2008/07/02
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
//@since 2008/07/02
//
//@access private
//@return void
//
//
//ETC請求明細のFrom句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//ETC請求明細行数
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//ETC請求明細取得
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//合計データ行用select句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $H_get
//@access private
//@return void
//
//
//ETC請求詳細用where句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//ETC請求詳細用order句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $sort
//@access private
//@return void
//
//
//選択部署配下の購買ID取得 <br>
//購買ID単位の請求データからcardnoとcardcoidだけ抜き出す
//
//@author houshiyama
//@since 2008/07/02
//
//@param array $A_etcbill
//@access private
//@return void
//
//
//makeAllBillDetailsSQL
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@param mixed $sort
//@param mixed $mode
//@access private
//@return void
//
//
//ETC請求明細のFrom句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//利用明細のselect句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//ETC利用明細のFrom句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//ETC利用明細行数
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//ETC利用明細取得
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//合計データ行用select句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//合計データ行作成SQL
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $H_get
//@access private
//@return void
//
//
//ETC請求詳細用where句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//ETC請求詳細用order句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $sort
//@access private
//@return void
//
//
//ETC利用明細取得
//
//@author houshiyama
//@since 2008/07/02
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@param mixed $sort
//@param mixed $mode
//@access private
//@return void
//
//
//ETC請求明細のFrom句作成
//
//@author houshiyama
//@since 2008/07/02
//
//@access private
//@return void
//
//
//指定カードの利用レコードの数を返す
//
//@author houshiyama
//@since 2008/07/03
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/07/02
//
//@access public
//@return void
//
class BillEtcDetailsModel extends BillEtcModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, download = false, O_view = undefined) //選択された部署ID
	//テーブル名の決定
	//配下部署一覧
	//ダウンロード時は不要
	//HTML時は件数とデータ
	{
		var postid = H_sess[BillEtcDetailsModel.PUB].current_postid;
		this.setTableName(H_sess[BillEtcDetailsModel.PUB].cym);
		var A_allpost = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var A_data = Array();

		if (false === download) //件数取得
			//合計行分を加える
			//リミット設定
			{
				var linecnt = this.get_DB().queryOne(this.makeBillDetailsCntSQL(H_sess.SELF.get, H_sess.SELF.sort));

				if (linecnt > 0) {
					linecnt++;
				}

				A_data[0] = linecnt;
				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.detailoffset - 1) * H_sess.SELF.limit);
			}

		if (undefined !== H_sess.SELF.dlmode === true && "0" == H_sess.SELF.dlmode) //カード番号だけ抽出
			//viewのデータ行数セット
			//スタート行の書き込み
			//対象IDをループしてカード毎にここで出力（請求明細）
			//次のページまで空行で埋める
			//スタート行の書き込み
			//対象IDをループしてカード毎にここで出力（利用明細）
			//次のページまで空行で埋める
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = 0;
				}

				var A_etcbill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillEtcDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				var A_cardno = this.getcardnoDataOnly(A_etcbill);
				O_view.setDataCnt(A_cardno.length);
				O_view.writeStartDataLine();
				A_data[1] = Array();

				for (var cnt = 0; cnt < A_cardno.length; cnt++) //請求明細取得
				//利用回数(合計行に足す
				//viewのリスナーにデータを渡す
				{
					A_data = Array();
					var A_one_bill = this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_cardno[cnt], H_sess.SELF.sort));
					A_one_bill[0].usecnt = this.getUseCnt(A_cardno[cnt].cardno);
					O_view.writeBillDataLine(A_one_bill, "2");
				}

				O_view.writeBrankToNextPage();
				O_view.writeStartDataLine();

				for (cnt = 0;; cnt < A_cardno.length; cnt++) //利用明細取得
				//viewのリスナーにデータを渡す
				{
					A_data = Array();
					var A_one_use = this.get_DB().queryHash(this.makeUseHistoryDataSQL(A_cardno[cnt], H_sess.SELF.sort));
					O_view.writeUseDataLine(A_one_use, "2");
				}

				O_view.writeBrankToNextPage();
			} else {
			A_data[1] = this.get_DB().queryHash(this.makeBillDetailsDataSQL(H_sess.SELF.get, H_sess.SELF.sort));
		}

		if (false === download) {
			return A_data;
		} else {
			return A_data[1];
		}
	}

	makeBillDetailsSelectSQL() {
		var A_col = ["cd.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cd.cardno", "ct.cardno_view", "ct.bill_cardno", "ct.bill_cardno_view", "cd.cardcoid", "card_co_tb.cardconame", "ct.card_meigi", "ct.username", "cd.code", "cd.codename", "cd.charge", "cd.taxkubun", "cd.detailno"];
		return A_col.join(",");
	}

	makeBillDetailsFromSQL() {
		var sql = this.H_Tb.card_details_tb + " as cd " + " left join " + this.H_Tb.card_tb + " as ct on cd.pactid=ct.pactid and cd.cardno=ct.cardno" + " left join " + this.H_Tb.post_tb + " on ct.pactid=" + this.H_Tb.post_tb + ".pactid and ct.postid=" + this.H_Tb.post_tb + ".postid" + " left join card_co_tb on cd.cardcoid=card_co_tb.cardcoid" + " left join card_utiwake_tb on cd.cardcoid=card_utiwake_tb.cardcoid and cd.code=card_utiwake_tb.code";
		return sql;
	}

	makeBillDetailsCntSQL(H_get, sort) {
		var sql = "select " + " count(cd.cardno) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get);
		return sql;
	}

	makeBillDetailsDataSQL(H_get, sort) {
		var sql = "(select " + this.makeBillDetailsSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get) + ") union all (" + this.makeBillDetailsSumSQL(H_get) + ") " + this.makeBillDetailsOrderBySQL(sort);
		return sql;
	}

	makeBillDetailsSumSelectSQL() {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cd.cardno", "null as cardno_view", "null as bill_cardno", "null as bill_cardno_view", "null as cardcoid", "card_co_tb.cardconame", "null as card_meigi", "null as username", "null as code", "'\u5408\u8A08' as codename", "coalesce(sum(cd.charge),0) as charge", "null as taxkubun", "max(cd.detailno)+1 as detailno"];
		return A_col.join(",");
	}

	makeBillDetailsSumSQL(H_get) {
		var sql = "select " + this.makeBillDetailsSumSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "cd") + " and " + " card_utiwake_tb.codetype='0'" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "cd.cardno," + "card_co_tb.cardconame";
		return sql;
	}

	makeBillDetailsWhereSQL(H_get, tb = "cd") //契約ID
	//カード番号
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".cardno=" + this.get_db().dbQuote(H_get.cardno, "text", true));
		return A_where.join(" and ");
	}

	makeBillDetailsOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["detailno", "buydate", "slipno", "itemcode", "itemname", "itemsum", "charge", "comment"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",detailno ";
		}

		return sql;
	}

	getCardnoDataOnly(A_etcbill) {
		var A_data = Array();

		for (var cnt = 0; cnt < A_etcbill.length; cnt++) {
			var A_tmp = Array();
			A_tmp.cardno = A_etcbill[cnt].cardno;
			A_data.push(A_tmp);
		}

		return A_data;
	}

	makeAllBillDetailsSQL(A_post, postid, H_post, sort, mode) {
		var sql = "select " + this.makeBillDetailsSelectSQL() + " from " + this.makeAllBillDetailsFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "cb");

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		sql += this.makeBillOrderBySQL(sort) + ",cd.detailno";
		return sql;
	}

	makeAllBillDetailsFromSQL() {
		var sql = this.H_Tb.card_details_tb + " as cd " + " left join " + this.H_Tb.card_tb + " as ct on cd.pactid=ct.pactid and cd.cardno=ct.cardno" + " left join " + this.H_Tb.card_bill_tb + " as cb on cd.pactid=cb.pactid and cd.cardno=cb.cardno and cd.cardcoid=cb.cardcoid" + " left join " + this.H_Tb.post_tb + " on ct.pactid=" + this.H_Tb.post_tb + ".pactid and ct.postid=" + this.H_Tb.post_tb + ".postid" + " left join card_co_tb on cd.cardcoid=card_co_tb.cardcoid";
		return sql;
	}

	makeUseHistorySelectSQL() {
		var A_col = ["cu.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cu.cardno", "ct.cardno_view", "ct.bill_cardno", "ct.bill_cardno_view", "card_co_tb.cardconame", "ct.card_meigi", "ct.username", "cu.route_name", "cu.in_id", "cu.in_name", "cu.out_id", "cu.out_name", "cu.date", "cu.time", "cu.charge", "cu.discount1", "cu.discount2", "cu.car_type", "cu.note"];
		return A_col.join(",");
	}

	makeUseHistoryFromSQL() {
		var sql = this.H_Tb.card_usehistory_tb + " as cu " + " left join " + this.H_Tb.card_tb + " as ct on cu.pactid=ct.pactid and cu.cardno=ct.cardno " + " left join " + this.H_Tb.post_tb + " on ct.pactid=" + this.H_Tb.post_tb + ".pactid and ct.postid=" + this.H_Tb.post_tb + ".postid" + " left join card_co_tb on cu.cardcoid=card_co_tb.cardcoid";
		return sql;
	}

	makeUseHistoryCntSQL(H_get, sort) {
		var sql = "select " + " count(cu.cardno) " + " from " + this.makeUseHistoryFromSQL() + " where " + this.makeUseHistoryWhereSQL(H_get);
		return sql;
	}

	makeUseHistoryDataSQL(H_get, sort) {
		var sql = "(select " + this.makeUseHistorySelectSQL() + " from " + this.makeUseHistoryFromSQL() + " where " + this.makeUseHistoryWhereSQL(H_get) + ") union all (" + this.makeUseHistorySumSQL(H_get) + ") " + this.makeUseHistoryOrderBySQL(sort);
		return sql;
	}

	makeUseHistorySumSelectSQL() {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cu.cardno", "null as cardno_view", "null as bill_cardno", "null as bill_cardno_view", "card_co_tb.cardconame", "null as card_meigi", "null as username", "null as route_name", "null as in_id", "null as in_name", "null as out_id", "null as out_name", "null as date", "null as time", "coalesce(sum(cu.charge),0) as charge", "null as discount1", "null as discount2", "null as car_type", "'\u5408\u8A08' as note"];
		return A_col.join(",");
	}

	makeUseHistorySumSQL(H_get) {
		var sql = "select " + this.makeUseHistorySumSelectSQL() + " from " + this.makeUseHistoryFromSQL() + " where " + this.makeUseHistoryWhereSQL(H_get, "cu") + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "cu.cardno," + "card_co_tb.cardconame";
		return sql;
	}

	makeUseHistoryWhereSQL(H_get, tb = "cu") //契約ID
	//カード番号
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".cardno=" + this.get_db().dbQuote(H_get.cardno, "text", true));
		return A_where.join(" and ");
	}

	makeUseHistoryOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["date"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",time ";
		}

		return sql;
	}

	makeAllUseHistorySQL(A_post, postid, H_post, sort, mode) {
		var sql = "select " + this.makeUseHistorySelectSQL() + " from " + this.makeAllUseHistoryFromSQL() + " where " + this.makeCommonWhereSQL(A_post, postid, "cb");

		if (this.makeBillWhereSQL(H_post) != "") {
			sql += " and " + this.makeBillWhereSQL(H_post);
		}

		sql += this.makeBillOrderBySQL(sort) + ",cd.detailno";
		return sql;
	}

	makeAllUseHistoryFromSQL() {
		var sql = this.H_Tb.card_usehistory_tb + " as cu " + " left join " + this.H_Tb.card_tb + " as ct on cd.pactid=ct.pactid and cd.cardno=ct.cardno and cd.cardcoid=ct.cardcoid" + " left join " + this.H_Tb.card_bill_tb + " as cb on cd.pactid=cb.pactid and cd.cardno=cb.cardno and cd.cardcoid=cb.cardcoid" + " left join " + this.H_Tb.post_tb + " on ct.pactid=" + this.H_Tb.post_tb + ".pactid and ct.postid=" + this.H_Tb.post_tb + ".postid" + " left join card_co_tb on cd.cardcoid=card_co_tb.cardcoid";
		return sql;
	}

	getUseCnt(cardno) {
		var H_get = Array();
		H_get.cardno = cardno;
		var sql = "select count(cardno)" + " from " + this.H_Tb.card_usehistory_tb + " as cu " + " where " + this.makeUseHistoryWhereSQL(H_get);
		var cnt = this.get_DB().queryOne(sql);
		return cnt;
	}

	__destruct() {
		super.__destruct();
	}

};