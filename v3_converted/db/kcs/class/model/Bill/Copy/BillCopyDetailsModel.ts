//
//コピー機請求明細表示Model
//
//更新履歴：<br>
//2008/07/10 宝子山浩平 作成
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/07/10
//@uses BillCopyModel
//
//
//
//コピー機請求明細表示Model
//
//@package Bill
//@subpackage Model
//@author houshiyama
//@since 2008/07/10
//@uses BillCopyModel
//

require("model/Bill/Copy/BillCopyModel.php");

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
//@since 2008/07/10
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
//対象のコピー機ID取得
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
//@since 2008/07/10
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
//@since 2008/07/10
//
//@access private
//@return void
//
//
//請求明細のselect句作成（利用明細）
//
//@author houshiyama
//@since 2008/07/10
//
//@access private
//@return void
//
//
//コピー機請求明細のFrom句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@access private
//@return void
//
//
//コピー機請求明細のFrom句作成（利用明細）
//
//@author houshiyama
//@since 2008/07/10
//
//@access private
//@return void
//
//
//コピー機請求明細行数
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//コピー機利用明細行数
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $A_post
//@param mixed $postid
//@param mixed $H_post
//@access public
//@return void
//
//
//コピー機請求明細取得
//
//@author houshiyama
//@since 2008/07/10
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
//@since 2008/07/10
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
//@since 2008/08/06
//
//@access private
//@return void
//
//
//合計データ行用select句作成
//
//@author houshiyama
//@since 2008/07/10
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
//@since 2008/07/10
//
//@param mixed $H_get
//@access private
//@return void
//
//
//コピー機請求詳細用where句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//コピー機請求詳細用where句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $H_get
//@param mixed $tb
//@access private
//@return void
//
//
//makeBillDetailsSumWhereSQL
//
//@author web
//@since 2013/04/25
//
//@access private
//@return void
//
//
//コピー機請求詳細用order句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $sort
//@access private
//@return void
//
//
//コピー機利用明細用order句作成
//
//@author houshiyama
//@since 2008/07/10
//
//@param mixed $sort
//@access private
//@return void
//
//
//選択部署配下のコピー機ID取得 <br>
//コピー機ID単位の請求データからcopyidとcopycoidだけ抜き出す
//
//@author houshiyama
//@since 2008/07/10
//
//@param array $A_copybill
//@access private
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/07/10
//
//@access public
//@return void
//
class BillCopyDetailsModel extends BillCopyModel {
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
		var postid = H_sess[BillCopyDetailsModel.PUB].current_postid;
		this.setTableName(H_sess[BillCopyDetailsModel.PUB].cym);
		var A_allpost = this.O_Post.getChildList(this.H_G_Sess.pactid, postid, this.H_Tb.tableno);
		var A_data = Array();

		if (false === download) //件数取得
			//利用明細
			{
				if (H_sess.SELF.mode === "1") //12ヶ月前を越えたらエラー
					{
						if (H_sess[BillCopyDetailsModel.PUB].cym <= date("Ym", mktime(0, 0, 0, date("m") - 12, date("n"), date("Y")))) {
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

				if (undefined !== H_sess.SELF.copycoid == true && H_sess.SELF.copycoid != "") {
					H_sess.SELF.post.copycoid = H_sess.SELF.copycoid;
				}

				var A_copybill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillCopyDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				var A_copyid = this.getCopyidDataOnly(A_copybill);
				A_data[1] = Array();

				if (undefined !== H_sess.SELF.post.serial === true) //viewのデータ行数セット
					//スタート行の書き込み
					//対象IDをループしてカード毎にここで出力（請求明細）
					//次のページまで空行で埋める
					//対象IDをループしてカード毎にここで出力（利用明細）
					//出力があれば次のページまで空行で埋める
					{
						O_view.setDataCnt(A_copyid.length);
						O_view.writeStartDataLine();

						for (var cnt = 0; cnt < A_copyid.length; cnt++) //利用明細取得
						//viewのリスナーにデータを渡す
						{
							A_data = Array();
							var A_one_use = this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_copyid[cnt], H_sess.SELF.sort));
							O_view.writeBillDataLine(A_one_use, "4");
						}

						O_view.writeBrankToNextPage();
						A_one_use = Array();
						var useDetail = false;

						for (cnt = 0;; cnt < A_copyid.length; cnt++) //利用明細取得
						//初回出力ならスタート行を書く
						{
							A_data = Array();
							A_one_use = this.get_DB().queryHash(this.makeBillHistoryDataSQL(A_copyid[cnt], H_sess.SELF.sort));

							if (!useDetail && 0 < A_one_use.length) //スタート行の書き込み
								{
									useDetail = true;
									O_view.writeStartDataLine();
								}

							if (useDetail && 0 < A_one_use.length) //viewのリスナーにデータを渡す
								{
									O_view.writeUseDataLine(A_one_use, "4");
								}
						}

						if (useDetail) {
							O_view.writeBrankToNextPage();
						}
					} else //S227 hanashima 20201022
					//対象IDをループしてコピー機ID毎に取得
					//ヘッダー出力
					//S227 hanashima 20201022				
					//				// ヘッダー出力
					//				$O_view->displayCSVHeader( $this->A_Auth, $H_sess );
					//				// 対象IDをループしてコピー機ID毎にここで出力
					//				for( $cnt = 0; $cnt < count( $A_copyid ); $cnt++ ){
					//					$A_one_data = $this->get_DB()->queryHash( $this->makeBillDetailsDataSQL( $A_copyid[$cnt], "0,a" ) );
					//					// データ行出力
					//					$O_view->outputDataLine( $A_one_data );
					//				}
					{
						var A_one_datas = Array();

						for (cnt = 0;; cnt < A_copyid.length; cnt++) {
							A_one_datas.push(this.get_DB().queryHash(this.makeBillDetailsDataSQL(A_copyid[cnt], "0,a")));
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
			//対象IDをループしてコピー機ID毎にデータを取得
			//ヘッダー出力
			//出力
			//S227 hanashima 20201022
			//			// ヘッダー出力
			//			$O_view->displayCSVHeader( $this->A_Auth, $H_sess );
			//			// 対象IDをループしてコピー機ID毎にここで出力
			//			for( $cnt = 0; $cnt < count( $A_copyid ); $cnt++ ){
			//				$A_one_data = $this->get_DB()->queryHash( $this->makeBillHistoryDataSQL( $A_copyid[$cnt], "0,a" ) );
			//				$O_view->outputHistoryDataLine( $A_one_data );
			//			}
			{
				if (undefined !== H_sess.SELF.post.posttarget === false) {
					H_sess.SELF.post.posttarget = "0";
				}

				A_copybill = this.get_DB().queryHash(this.makeBillDataSQL(A_allpost, H_sess[BillCopyDetailsModel.PUB].current_postid, H_sess.SELF.post, H_sess.SELF.sort, H_sess.SELF.post.posttarget));
				A_copyid = this.getCopyidDataOnly(A_copybill);
				A_data[1] = Array();
				A_one_datas = Array();

				for (cnt = 0;; cnt < A_copyid.length; cnt++) {
					A_one_datas.push(this.get_DB().queryHash(this.makeBillHistoryDataSQL(A_copyid[cnt], "0,a")));
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
		var A_col = ["cd.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cd.copyid", "copy_co_tb.copyconame", "cd.code", "cd.codename", "cd.charge", "cd.printcount", "cd.taxkubun", "cd.detailno", "ct.username", "ct.copyname"];
		return A_col.join(",");
	}

	makeBillHistorySelectSQL() {
		var A_col = ["ch.pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "ch.copyid", "ch.copycoid", "copy_co_tb.copyconame", "ch.text1", "ch.text2", "ch.text3", "ch.text4", "ch.text5", "ch.int1", "ch.int2", "ch.int3", "ch.date1", "ch.date2", "ct.username", "ct.copyname"];
		return A_col.join(",");
	}

	makeBillDetailsFromSQL() {
		var sql = this.H_Tb.copy_details_tb + " as cd " + " inner join copy_utiwake_tb ut on cd.code=ut.code and cd.copycoid=ut.copycoid" + " left join " + this.H_Tb.copy_tb + " as ct on cd.pactid=ct.pactid and cd.copyid=ct.copyid and cd.copycoid=ct.copycoid" + " left join " + this.H_Tb.post_tb + " on ct.pactid=" + this.H_Tb.post_tb + ".pactid and ct.postid=" + this.H_Tb.post_tb + ".postid" + " left join copy_co_tb on cd.copycoid=copy_co_tb.copycoid";
		return sql;
	}

	makeBillHistoryFromSQL() {
		var sql = this.H_Tb.copy_history_tb + " as ch " + " left join " + this.H_Tb.copy_tb + " as ct on ch.pactid=ct.pactid and ch.copyid=ct.copyid and ch.copycoid=ct.copycoid" + " left join " + this.H_Tb.post_tb + " on ct.pactid=" + this.H_Tb.post_tb + ".pactid and ct.postid=" + this.H_Tb.post_tb + ".postid" + " left join copy_co_tb on ch.copycoid=copy_co_tb.copycoid";
		return sql;
	}

	makeBillDetailsCntSQL(H_get) {
		var sql = "select " + " count(cd.copyid) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get);
		return sql;
	}

	makeBillHistoryCntSQL(H_get) {
		var sql = "select " + " count(ch.copyid) " + " from " + this.makeBillHistoryFromSQL() + " where " + this.makeBillHistoryWhereSQL(H_get);
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
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cd.copyid", "copy_co_tb.copyconame", "null as code", "'" + BillCopyDetailsModel.SUBSUMNAME + "' as codename", "coalesce(sum(cd.charge),0) as charge", "0 as printcount", "null as taxkubun", detailno + " as detailno", "null as username", "null as copyname"];
		return A_col.join(",");
	}

	makeBillDetailsSumSelectSQL() {
		var A_col = ["null as pactid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "cd.copyid", "copy_co_tb.copyconame", "null as code", "'" + BillCopyDetailsModel.SUMNAME + "' as codename", "coalesce(sum(cd.charge),0) as charge", "coalesce(sum(cd.printcount),0) as printcount", "null as taxkubun", "max(cd.detailno)+2 as detailno", "null as username", "null as copyname"];
		return A_col.join(",");
	}

	makeBillDetailsSubSumSQL(H_get) {
		var no_sql = "select " + " max(detailno) " + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "cd") + " and " + " code not in ('" + BillCopyDetailsModel.ASPCODE + "','" + BillCopyDetailsModel.ASXCODE + "')";
		var detailno = this.getDB().queryOne(no_sql) + 1;
		var sql = "select " + this.makeBillDetailsSubSumSelectSQL(detailno) + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsWhereSQL(H_get, "cd") + " and " + " code not in ('" + BillCopyDetailsModel.ASPCODE + "','" + BillCopyDetailsModel.ASXCODE + "')" + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "cd.copyid," + "copy_co_tb.copyconame";
		return sql;
	}

	makeBillDetailsSumSQL(H_get) {
		var sql = "select " + this.makeBillDetailsSumSelectSQL() + " from " + this.makeBillDetailsFromSQL() + " where " + this.makeBillDetailsSumWhereSQL(H_get, "cd") + " group by " + this.H_Tb.post_tb + ".userpostid," + this.H_Tb.post_tb + ".postname," + "cd.copyid," + "copy_co_tb.copyconame";
		return sql;
	}

	makeBillHistoryWhereSQL(H_get, tb = "ch") //契約ID
	//コピー機ID
	//コピー機先
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".copyid=" + this.get_DB().dbQuote(H_get.copyid, "text", true));
		A_where.push(tb + ".copycoid=" + this.get_DB().dbQuote(H_get.copycoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsWhereSQL(H_get, tb = "cd") //契約ID
	//コピー機ID
	//コピー機先
	{
		var A_where = Array();
		A_where.push(tb + ".pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true));
		A_where.push(tb + ".copyid=" + this.get_DB().dbQuote(H_get.copyid, "text", true));
		A_where.push(tb + ".copycoid=" + this.get_DB().dbQuote(H_get.copycoid, "integer", true));
		return A_where.join(" and ");
	}

	makeBillDetailsSumWhereSQL(H_get, tb) {
		var where = this.makeBillDetailsWhereSQL(H_get, tb);
		where += "and ut" + ".codetype = '0'";
		return where;
	}

	makeBillDetailsOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["detailno", "codename", "printcount", "charge"];
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
		var A_col = ["ch.sort", "ch.text1", "ch.text2", "ch.text3", "ch.text4"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] === "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",ch.sort ";
		}

		return sql;
	}

	getCopyidDataOnly(A_copybill) {
		var A_data = Array();

		for (var cnt = 0; cnt < A_copybill.length; cnt++) {
			var A_tmp = Array();
			A_tmp.copyid = A_copybill[cnt].copyid;
			A_tmp.copycoid = A_copybill[cnt].copycoid;
			A_data.push(A_tmp);
		}

		return A_data;
	}

	__destruct() {
		super.__destruct();
	}

};