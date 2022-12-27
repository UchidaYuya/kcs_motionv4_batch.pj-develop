//
//運送管理用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2010/02/19
//@uses ManagementModelBase
//@uses TransitCoModel
//
//
//
//運送管理用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2010/02/19
//@uses ManagementModelBase
//@uses TransitCoModel
//

require("model/Management/ManagementModelBase.php");

require("model/TransitCoModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2010/02/19
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//運送会社一覧データ取得
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return array
//@uses TransitCoModel
//
//
//ETCカード会社一覧データ取得（使用中のみ）
//
//getUseEtcCoData
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $A_post（部署一覧）
//@param mixed $cym
//@param array $H_post（CGIパラメータ）
//@access public
//@return void
//
//
//指定したIDの運送ID情報取得SQL文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $tranid
//@param mixed $trancoid
//@access public
//@return void
//
//
//transit_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $tranid
//@param mixed $trancoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//前月に運送IDがあるかチェック
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//DBにその運送IDがあるかチェック
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $postid
//@param mixed $tranid
//@param mixed $coid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//削除済みで同じIDがあるかチェック
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_post
//@param mixed $pre
//@access protected
//@return void
//
//
//削除済みIDがあるかチェック
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $tranid
//@param mixed $trancoid
//@param mixed $pre
//@access private
//@return void
//
//
//インサート文を作成する
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_post
//@param boolean $pre
//@access public
//@return void
//
//
//指定した運送IDを削除
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_get
//@access protected
//@return void
//
//
//運送IDのインサート文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_post
//@param mixed $tb
//@access public
//@return void
//
//
//運送IDのupdate文作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//現在テーブルから運送IDを削除 <br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $tranid
//@param mixed $trancoid
//@access public
//@return void
//
//
//select句作成
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return string
//
//
//更新に使うカラム決定
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $type
//@access protected
//@return $A_col
//
//
//更新に使うvalue決定
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_post
//@param mixed $type
//@access protected
//@return $A_val
//
//
//一覧データ取得（移動・削除画面用メソッド）
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_sess（CGIパラメータ）
//@param array $H_trg（処理対象一覧）
//@param array $A_post（部署一覧）
//@access public
//@return void
//
//
//配列の各要素を分解
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_trg
//@access protected
//@return $A_rows
//
//
//移動、削除画面用一覧のwhere句作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_row
//@access protected
//@return void
//
//
//請求があればtrue <br>
//請求が無ければfalse <br>
//
//対象が今月ならば前月をチェック <br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//指定したIDの請求数を取得
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $tranid
//@param mixed $trancoid
//@param mixed $pre
//@access protected
//@return void
//
//
//前月に指定の運送IDがあるかチェック
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $tranid
//@param mixed $trancoid
//@param mixed $A_prepost
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class ManagementTransitModel extends ManagementModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getTranCoData() {
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		A_data += TransitCoModel.getTranCoKeyHash();
		return A_data;
	}

	getUseTranCoData(A_post, cym, H_post) //テーブル名決定
	//検索値があれば加える
	{
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		this.setTableName(cym);
		var trancoid = undefined;

		if (undefined !== H_post.trancoid == true && H_post.trancoid != "") {
			trancoid = H_post.trancoid;
		}

		var A_res = TransitCoModel.getUseTranCoKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.transit_tb, trancoid);
		A_data += A_res;
		return A_data;
	}

	makeTranSelectOneSQL(tranid, trancoid) {
		var sql = "select " + this.makeColumns().join(",") + " from " + this.H_Tb.transit_tb + " where " + this.makeCommonTranWhere(tranid, trancoid);
		return sql;
	}

	makeCommonTranWhere(tranid, trancoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and tranid=" + this.get_db().dbQuote(tranid, "text", true) + " and trancoid=" + this.get_db().dbQuote(trancoid, "integer", true);

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	checkPastExist(H_post: {} | any[]) {
		var res = this.checkTranExist(H_post.tranid, H_post.trancoid, true);
		return res;
	}

	checkTranExist(tranid, trancoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_transit_tb;
		} else {
			tb = this.H_Tb.transit_tb;
		}

		var sql = "select count(tranid) from " + tb + " where " + this.makeCommonTranWhere(tranid, trancoid);

		if (this.get_db().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkDeleteExist(H_post, pre = false) {
		var res = this.checkDeleteTranExist(H_post.tranid, H_post.trancoid, pre);
		return res;
	}

	checkDeleteTranExist(tranid, trancoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_transit_tb;
		} else {
			tb = this.H_Tb.transit_tb;
		}

		var sql = "select count(tranid) from " + tb + " where " + this.makeCommonTranWhere(tranid, trancoid, "true");

		if (this.get_db().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	makeAddManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_transit_tb;
		} else {
			tb = this.H_Tb.transit_tb;
		}

		var sql = this.makeInsertTranSQL(H_post, tb);
		return sql;
	}

	makeDelManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_transit_tb;
		} else {
			tb = this.H_Tb.transit_tb;
		}

		var sql = this.makeDelTranSQL(H_post.tranid, H_post.trancoid, tb);
		return sql;
	}

	makeInsertTranSQL(H_post, tb) {
		var sql = "insert into " + tb + " (" + this.makeColumns().join(",") + ") values (" + this.makeValues(H_post).join(",") + ")";
		return sql;
	}

	makeUpdateTransitSQL(H_sess, tb) {
		var sql = "update " + tb + " set " + this.makeUpdateSetSQL(this.makeColumns("update"), this.makeValues(H_sess.post, "update")) + " where " + this.makeCommonTranWhere(H_sess.get.manageno, H_sess.get.coid, "false");
		return sql;
	}

	makeDelTranSQL(tranid, trancoid, tb) {
		var sql = "delete from " + tb + " where " + this.makeCommonTranWhere(tranid, trancoid, undefined);
		return sql;
	}

	makeTranSelectSQL() {
		var A_col = ["tr.postid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "tr.tranid", "tr.trancoid", "transit_co_tb.tranconame", "tr.username", "tr.employeecode", "tr.memo", "tr.text1", "tr.text2", "tr.text3", "tr.text4", "tr.text5", "tr.text6", "tr.text7", "tr.text8", "tr.text9", "tr.text10", "tr.text11", "tr.text12", "tr.text13", "tr.text14", "tr.text15", "tr.int1", "tr.int2", "tr.int3", "tr.int4", "tr.int5", "tr.int6", "tr.date1", "tr.date2", "tr.date3", "tr.date4", "tr.date5", "tr.date6", "tr.mail1", "tr.mail2", "tr.mail3", "tr.url1", "tr.url2", "tr.url3"];
		return A_col.join(",");
	}

	makeColumns(type = "insert") //新規のみの項目
	{
		var A_col = ["tranid", "trancoid", "username", "employeecode", "memo", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "int4", "int5", "int6", "date1", "date2", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "fixdate", "pre_tranid", "pre_trancoid"];

		if ("insert" == type) {
			A_col.push("pactid");
			A_col.push("postid");
			A_col.push("recdate");
		}

		return A_col;
	}

	makeValues(H_post, type = "insert") //ユーザ設定項目
	//新規のみの項目
	{
		H_post = this.makePropValue(H_post);

		for (var cnt = 1; cnt <= 6; cnt++) {
			H_post["date" + cnt] = this.O_Manage.convertDatetime(H_post["date" + cnt]);
		}

		var A_val = [this.get_db().dbQuote(H_post.tranid, "text", true), this.get_db().dbQuote(H_post.trancoid, "integer", true), this.get_db().dbQuote(H_post.username, "text"), this.get_db().dbQuote(H_post.employeecode, "text"), this.get_db().dbQuote(H_post.memo, "text"), this.get_db().dbQuote(H_post.text1, "text"), this.get_db().dbQuote(H_post.text2, "text"), this.get_db().dbQuote(H_post.text3, "text"), this.get_db().dbQuote(H_post.text4, "text"), this.get_db().dbQuote(H_post.text5, "text"), this.get_db().dbQuote(H_post.text6, "text"), this.get_db().dbQuote(H_post.text7, "text"), this.get_db().dbQuote(H_post.text8, "text"), this.get_db().dbQuote(H_post.text9, "text"), this.get_db().dbQuote(H_post.text10, "text"), this.get_db().dbQuote(H_post.text11, "text"), this.get_db().dbQuote(H_post.text12, "text"), this.get_db().dbQuote(H_post.text13, "text"), this.get_db().dbQuote(H_post.text14, "text"), this.get_db().dbQuote(H_post.text15, "text"), this.get_db().dbQuote(H_post.int1, "integer"), this.get_db().dbQuote(H_post.int2, "integer"), this.get_db().dbQuote(H_post.int3, "integer"), this.get_db().dbQuote(H_post.int4, "integer"), this.get_db().dbQuote(H_post.int5, "integer"), this.get_db().dbQuote(H_post.int6, "integer"), this.get_db().dbQuote(H_post.date1, "timestamp"), this.get_db().dbQuote(H_post.date2, "timestamp"), this.get_db().dbQuote(H_post.date3, "timestamp"), this.get_db().dbQuote(H_post.date4, "timestamp"), this.get_db().dbQuote(H_post.date5, "timestamp"), this.get_db().dbQuote(H_post.date6, "timestamp"), this.get_db().dbQuote(H_post.mail1, "text"), this.get_db().dbQuote(H_post.mail2, "text"), this.get_db().dbQuote(H_post.mail3, "text"), this.get_db().dbQuote(H_post.url1, "text"), this.get_db().dbQuote(H_post.url2, "text"), this.get_db().dbQuote(H_post.url3, "text"), this.get_db().dbQuote(this.NowTime, "timestamp", true), this.get_db().dbQuote(H_post.pre_tranid, "text"), this.get_db().dbQuote(H_post.pre_trancoid, "text")];

		if ("insert" == type) {
			A_val.push(this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true));
			A_val.push(this.get_db().dbQuote(H_post.recogpostid, "integer", true));
			A_val.push(this.get_db().dbQuote(this.NowTime, "timestamp", true));
		}

		return A_val;
	}

	getList(H_sess: {} | any[], H_trg: {} | any[], A_post: {} | any[]) //menuからの値を配列に整形
	//配下の対象が無ければエラー
	{
		this.setTableName(H_sess.cym);
		var A_data = Array();
		var A_rows = this.splitArrrayRow(H_trg);

		for (var cnt = 0; cnt < A_rows.length; cnt++) {
			var A_res = this.get_db().queryRowHash(this.makeTranListSQL(A_post, A_rows[cnt]));

			if (A_res !== undefined) {
				A_data.push(A_res);
			}
		}

		if (A_data.length === 0) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u914D\u4E0B\u306B\u7121\u3044", false, "./menu.php");
			throw die();
		}

		return A_data;
	}

	splitArrrayRow(H_trg: {} | any[]) {
		var A_rows = Array();

		for (var key in H_trg) {
			var value = H_trg[key];
			var A_line = Array();

			if (preg_match("/^id/", key) == true) {
				var A_tmp = split(":", value);
				A_line.postid = A_tmp[0];
				A_line.tranid = A_tmp[1];
				A_line.trancoid = A_tmp[2];
				A_rows.push(A_line);
			}
		}

		return A_rows;
	}

	makeTranWhereSQL(H_row) {
		var sql = " and " + "tr.tranid=" + this.get_db().dbQuote(H_row.tranid, "text", true) + " and " + "tr.trancoid=" + this.get_db().dbQuote(H_row.trancoid, "integer", true) + " and " + "tr.delete_flg=false";
		return sql;
	}

	checkBillExist(H_sess) //テーブル名の決定
	//対象が今月
	{
		this.setTableName(H_sess[ManagementTransitModel.PUB].cym);
		var billflg = false;

		if (date("Ym") == H_sess[ManagementTransitModel.PUB].cym) //前月も変更のフラグあり
			{
				if (undefined !== H_sess.SELF.post.pastflg == true && 1 == H_sess.SELF.post.pastflg) //前月の請求無し
					{
						if (this.getBillCnt(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, true) == 0) {
							billflg = false;
						} else {
							billflg = true;
						}
					}
			} else //削除の時
			{
				if (undefined !== H_sess.SELF.trg_list === true) {
					billflg = false;
					{
						let _tmp_0 = H_sess.SELF.trg_list;

						for (var key in _tmp_0) {
							var val = _tmp_0[key];

							if (preg_match("/^id/", key) == true) //ひとつでも請求があればエラー
								{
									var A_val = split(":", val);

									if (this.getBillCnt(A_val[1], A_val[2]) > 0) {
										billflg = true;
										break;
									}
								}
						}
					}
				} else //請求無し
					{
						if (this.getBillCnt(H_sess.SELF.get.manageno, H_sess.SELF.get.coid) == 0) {
							billflg = false;
						} else {
							billflg = true;
						}
					}
			}

		return billflg;
	}

	getBillCnt(tranid, trancoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_transit_details_tb;
		} else {
			tb = this.H_Tb.transit_details_tb;
		}

		var sql = "select count(tranid) from " + tb + " where " + this.makeCommonTranWhere(tranid, trancoid, undefined);
		return this.get_db().queryOne(sql);
	}

	checkPreTranAuth(tranid, trancoid, A_prepost) {
		var sql = "select count(tranid) from " + this.H_Tb.pre_transit_tb + " where " + this.makeCommonTranWhere(tranid, trancoid, "false");

		if (A_prepost.length > 0) {
			sql += " and " + " postid in (" + A_prepost.join(",") + ")";
		}

		return this.get_db().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};