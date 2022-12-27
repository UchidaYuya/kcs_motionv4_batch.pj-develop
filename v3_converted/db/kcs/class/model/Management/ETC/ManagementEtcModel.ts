//
//ETC管理用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/04/03
//@uses ManagementModelBase
//@uses CardCoModel
//
//
//
//ETC管理用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/02/21
//@uses ModelBase
//@uses CardCoModel
//

require("model/Management/ManagementModelBase.php");

require("model/CardCoModel.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/02/21
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//ETCカード会社一覧データ取得
//
//@author houshiyama
//@since 2008/03/10
//
//@access public
//@return array
//@uses CardCoModel
//
//
//ETCカード会社一覧データ取得（使用中のみ）
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $A_post（部署一覧）
//@param mixed $cym
//@param array $H_post（CGIパラメータ）
//@access public
//@return void
//
//
//指定したカード番号のカード情報取得SQL文作成
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $cardno
//@param mixed $cardcoid
//@access public
//@return void
//
//
//card_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $cardno
//@param mixed $cardcoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//card_tbへの固定的なwhere句（テーブル名付き）作成
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $cardno
//@param mixed $cardcoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//前月にETCカードがあるかチェック
//
//@author houshiyama
//@since 2008/03/19
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//DBにそのETCカードがあるかチェック
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $postid
//@param mixed $cardno
//@param mixed $coid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//削除済みで同じIDがあるかチェック
//
//@author houshiyama
//@since 2008/03/25
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
//@since 2008/03/25
//
//@param mixed $cardno
//@param mixed $pre
//@access private
//@return void
//
//
//インサート文を作成する
//
//@author houshiyama
//@since 2008/03/12
//
//@param mixed $H_post
//@param boolean $pre
//@access public
//@return void
//
//
//指定したETCカードを削除
//
//@author houshiyama
//@since 2008/03/26
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//ETCカードのインサート文作成
//
//@author houshiyama
//@since 2008/03/26
//
//@param mixed $H_post
//@param mixed $tb
//@access public
//@return void
//
//
//ETCカードのupdate文作成
//
//@author houshiyama
//@since 2008/03/26
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//現在テーブルからETCカードを削除 <br>
//
//@author houshiyama
//@since 2008/03/26
//
//@param mixed $cardno
//@param mixed $cardcoid
//@access public
//@return void
//
//
//select句作成
//
//@author houshiyama
//@since 2008/03/14
//
//@access protected
//@return string
//
//
//更新に使うカラム決定
//
//@author houshiyama
//@since 2008/03/12
//
//@access protected
//@return $A_col
//
//
//セレクト用カラムにテーブル（エイリアス）名を付ける
//
//@author houshiyama
//@since 2008/04/25
//
//@param mixed $val
//@access private
//@return void
//
//
//更新に使うvalue決定
//
//@author houshiyama
//@since 2008/03/12
//
//@param mixed $H_post
//@access protected
//@return $A_val
//
//
//一覧データ取得（移動・削除画面用メソッド）
//
//@author houshiyama
//@since 2008/03/25
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
//@since 2008/03/25
//
//@param mixed $H_trg
//@access protected
//@return $A_rows
//
//
//移動、削除画面用一覧のwhere句作成
//
//@author houshiyama
//@since 2008/03/25
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
//@since 2008/03/26
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//指定したIDの請求数を取得
//
//@author houshiyama
//@since 2008/03/26
//
//@param mixed $cardno
//@param mixed $cardcoid
//@param mixed $pre
//@access protected
//@return void
//
//
//前月に指定のETCカードがあるかチェック
//
//@author houshiyama
//@since 2008/03/25
//
//@param mixed $cardno
//@param mixed $cardcoid
//@param mixed $A_prepost
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementEtcModel extends ManagementModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getEtcCoData() {
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		var A_res = CardCoModel.getCardCoKeyHash();
		A_data += A_res;
		return A_data;
	}

	getUseEtcCoData(A_post, cym, H_post) //テーブル名決定
	//検索値があれば加える
	{
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		this.setTableName(cym);
		var cardcoid = undefined;

		if (undefined !== H_post.cardcoid == true && H_post.cardcoid != "") {
			cardcoid = H_post.cardcoid;
		}

		var A_res = CardCoModel.getUseCardCoKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.card_tb, cardcoid);
		A_data += A_res;
		return A_data;
	}

	makeEtcSelectOneSQL(cardno) {
		var sql = "select " + this.makeEtcSelectSQL() + " from " + this.makeEtcFromSQL() + " where " + this.makeCommonEtcAliasWhere(cardno);
		return sql;
	}

	makeCommonEtcWhere(cardno, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and cardno=" + this.get_db().dbQuote(cardno, "text", true);

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	makeCommonEtcAliasWhere(cardno, delflg = "false") {
		var sql = " ca.pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and ca.cardno=" + this.get_db().dbQuote(cardno, "text", true);

		if (delflg != undefined) {
			sql += " and ca.delete_flg=" + delflg;
		}

		return sql;
	}

	checkPastExist(H_post: {} | any[]) {
		var res = this.checkEtcExist(this.O_Manage.convertNoView(H_post.cardno_view), true);
		return res;
	}

	checkEtcExist(cardno, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_card_tb;
		} else {
			tb = this.H_Tb.card_tb;
		}

		var sql = "select count(cardno) from " + tb + " where " + this.makeCommonEtcWhere(cardno);

		if (this.get_db().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkDeleteExist(H_post, pre = false) {
		var res = this.checkDeleteEtcExist(this.O_Manage.convertNoView(H_post.cardno_view), pre);
		return res;
	}

	checkDeleteEtcExist(cardno, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_card_tb;
		} else {
			tb = this.H_Tb.card_tb;
		}

		var sql = "select count(cardno) from " + tb + " where " + this.makeCommonEtcWhere(cardno, "true");

		if (this.get_db().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	makeAddManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_card_tb;
		} else {
			tb = this.H_Tb.card_tb;
		}

		var sql = this.makeInsertEtcSQL(H_post, tb);
		return sql;
	}

	makeDelManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_card_tb;
		} else {
			tb = this.H_Tb.card_tb;
		}

		var sql = this.makeDelEtcSQL(this.O_Manage.convertNoView(H_post.cardno_view), tb);
		return sql;
	}

	makeInsertEtcSQL(H_post, tb) {
		var sql = "insert into " + tb + " (" + this.makeColumns().join(",") + ") values (" + this.makeValues(H_post).join(",") + ")";
		return sql;
	}

	makeUpdateEtcSQL(H_sess, tb) {
		var sql = "update " + tb + " set " + this.makeUpdateSetSQL(this.makeColumns("update"), this.makeValues(H_sess.post, "update")) + " where " + this.makeCommonEtcWhere(H_sess.get.manageno, "false");
		return sql;
	}

	makeDelEtcSQL(cardno, tb) {
		var sql = "delete from " + tb + " where " + this.makeCommonEtcWhere(cardno, undefined);
		return sql;
	}

	makeEtcSelectSQL() {
		var A_col = ["ca.postid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "ca.cardno", "ca.cardno_view", "ca.cardcoid", "card_co_tb.cardconame", "coalesce(ca.username,'') as username", "ca.employeecode", "coalesce(ca.card_meigi,'') as card_meigi", "coalesce(ca.bill_cardno,'') as bill_cardno", "ca.bill_cardno_view", "ca.card_corpno", "ca.card_corpname", "ca.card_membername", "coalesce(ca.car_no,'') as car_no", "ca.userid", "us.username as billusername", "ca.memo", "ca.text1", "ca.text2", "ca.text3", "ca.text4", "ca.text5", "ca.text6", "ca.text7", "ca.text8", "ca.text9", "ca.text10", "ca.text11", "ca.text12", "ca.text13", "ca.text14", "ca.text15", "ca.int1", "ca.int2", "ca.int3", "ca.int4", "ca.int5", "ca.int6", "ca.date1", "ca.date2", "ca.date3", "ca.date4", "ca.date5", "ca.date6", "ca.mail1", "ca.mail2", "ca.mail3", "ca.url1", "ca.url2", "ca.url3"];
		return A_col.join(",");
	}

	makeColumns(type = "insert") //新規のみの項目
	{
		var A_col = ["cardno_view", "cardno", "cardcoid", "card_meigi", "bill_cardno_view", "bill_cardno", "card_corpno", "card_corpname", "card_membername", "car_no", "userid", "username", "employeecode", "memo", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "int4", "int5", "int6", "date1", "date2", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "fixdate", "pre_cardno"];

		if ("insert" == type) {
			A_col.push("pactid");
			A_col.push("postid");
			A_col.push("recdate");
		}

		return A_col;
	}

	putTableAlias(val) {
		var res = "ca." + val;
		return res;
	}

	makeValues(H_post, type = "insert") //ユーザ設定項目
	//契約日整形
	//新規のみの項目
	{
		H_post = this.makePropValue(H_post);

		for (var cnt = 1; cnt <= 6; cnt++) {
			H_post["date" + cnt] = this.O_Manage.convertDatetime(H_post["date" + cnt]);
		}

		var A_val = [this.get_db().dbQuote(H_post.cardno_view, "text", true), this.get_db().dbQuote(this.O_Manage.convertNoView(H_post.cardno_view), "text", true), this.get_db().dbQuote(H_post.cardcoid, "integer"), this.get_db().dbQuote(H_post.card_meigi, "text"), this.get_db().dbQuote(H_post.bill_cardno_view, "text"), this.get_db().dbQuote(this.O_Manage.convertNoView(H_post.bill_cardno_view), "text", true), this.get_db().dbQuote(H_post.card_corpno, "text"), this.get_db().dbQuote(H_post.card_corpname, "text"), this.get_db().dbQuote(H_post.card_membername, "text"), this.get_db().dbQuote(H_post.car_no, "text"), this.get_db().dbQuote(H_post.userid, "integer"), this.get_db().dbQuote(H_post.username, "text"), this.get_db().dbQuote(H_post.employeecode, "text"), this.get_db().dbQuote(H_post.memo, "text"), this.get_db().dbQuote(H_post.text1, "text"), this.get_db().dbQuote(H_post.text2, "text"), this.get_db().dbQuote(H_post.text3, "text"), this.get_db().dbQuote(H_post.text4, "text"), this.get_db().dbQuote(H_post.text5, "text"), this.get_db().dbQuote(H_post.text6, "text"), this.get_db().dbQuote(H_post.text7, "text"), this.get_db().dbQuote(H_post.text8, "text"), this.get_db().dbQuote(H_post.text9, "text"), this.get_db().dbQuote(H_post.text10, "text"), this.get_db().dbQuote(H_post.text11, "text"), this.get_db().dbQuote(H_post.text12, "text"), this.get_db().dbQuote(H_post.text13, "text"), this.get_db().dbQuote(H_post.text14, "text"), this.get_db().dbQuote(H_post.text15, "text"), this.get_db().dbQuote(H_post.int1, "integer"), this.get_db().dbQuote(H_post.int2, "integer"), this.get_db().dbQuote(H_post.int3, "integer"), this.get_db().dbQuote(H_post.int4, "integer"), this.get_db().dbQuote(H_post.int5, "integer"), this.get_db().dbQuote(H_post.int6, "integer"), this.get_db().dbQuote(H_post.date1, "timestamp"), this.get_db().dbQuote(H_post.date2, "timestamp"), this.get_db().dbQuote(H_post.date3, "timestamp"), this.get_db().dbQuote(H_post.date4, "timestamp"), this.get_db().dbQuote(H_post.date5, "timestamp"), this.get_db().dbQuote(H_post.date6, "timestamp"), this.get_db().dbQuote(H_post.mail1, "text"), this.get_db().dbQuote(H_post.mail2, "text"), this.get_db().dbQuote(H_post.mail3, "text"), this.get_db().dbQuote(H_post.url1, "text"), this.get_db().dbQuote(H_post.url2, "text"), this.get_db().dbQuote(H_post.url3, "text"), this.get_db().dbQuote(this.NowTime, "timestamp", true), this.get_db().dbQuote(H_post.pre_cardno, "text")];

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
			var A_res = this.get_db().queryRowHash(this.makeEtcListSQL(A_post, A_rows[cnt]));

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
				A_line.cardno = A_tmp[1];
				A_line.cardcoid = A_tmp[2];
				A_rows.push(A_line);
			}
		}

		return A_rows;
	}

	makeEtcWhereSQL(H_row) {
		var sql = " and " + "ca.cardno=" + this.get_db().dbQuote(H_row.cardno, "text", true) + " and " + "ca.delete_flg=false";
		return sql;
	}

	checkBillExist(H_sess) //テーブル名の決定
	//対象が今月
	{
		this.setTableName(H_sess[ManagementEtcModel.PUB].cym);
		var billflg = false;

		if (date("Ym") == H_sess[ManagementEtcModel.PUB].cym) //前月も変更のフラグあり
			{
				if (undefined !== H_sess.SELF.post.pastflg == true && 1 == H_sess.SELF.post.pastflg) //前月の請求無し
					{
						if (this.getBillCnt(H_sess.SELF.get.cardno, H_sess.SELF.get.cardcoid, true) == 0) {
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
						if (this.getBillCnt(H_sess.SELF.get.manageno, H_sess.SELF.get.cardcoid) == 0) {
							billflg = false;
						} else {
							billflg = true;
						}
					}
			}

		return billflg;
	}

	getBillCnt(cardno, cardcoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_card_details_tb;
		} else {
			tb = this.H_Tb.card_details_tb;
		}

		var sql = "select count(cardno) from " + tb + " where " + this.makeCommonEtcWhere(cardno, cardcoid, undefined);
		return this.get_db().queryOne(sql);
	}

	checkPreEtcAuth(cardno, A_prepost) //前月に無い
	{
		var sql = "select count(cardno) from " + this.H_Tb.pre_card_tb + " where " + this.makeCommonEtcWhere(cardno, "false") + " and " + " postid in (" + A_prepost.join(",") + ")";
		return this.get_db().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};