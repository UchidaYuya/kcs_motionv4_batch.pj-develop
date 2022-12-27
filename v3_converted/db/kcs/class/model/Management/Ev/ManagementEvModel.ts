//
//EV ID管理用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author maeda
//@since 2010/07/15
//@uses ManagementModelBase
//@uses EvCoModel
//
//
//
//EV ID管理用モデル
//
//@package Management
//@subpackage Model
//@author maeda
//@since 2010/07/15
//@uses ManagementModelBase
//@uses EvCoModel
//

require("model/Management/ManagementModelBase.php");

require("model/EvCoModel.php");

//
//コンストラクター
//
//@author maeda
//@since 2010/07/15
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//EVキャリア一覧データ取得
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return array
//@uses EvCoModel
//
//
//EVキャリア一覧データ取得（使用中のみ）
//
//getUseEvCoData
//
//@author maeda
//@since 2010/07/15
//
//@param array $A_post（部署一覧）
//@param mixed $cym
//@param array $H_post（CGIパラメータ）
//@access public
//@return void
//
//
//指定したIDのEV ID情報取得SQL文作成
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $evid
//@param mixed $evcoid
//@access public
//@return void
//
//
//ev_tbへの固定的なwhere句作成
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $evid
//@param mixed $evcoid
//@param mixed $delflg
//@access protected
//@return void
//
//
//前月にEV IDがあるかチェック
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//DBにそのEV IDがあるかチェック
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $postid
//@param mixed $evid
//@param mixed $coid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//削除済みで同じIDがあるかチェック
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_post
//@param mixed $pre
//@access protected
//@return void
//
//
//削除済みIDがあるかチェック
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $evid
//@param mixed $evcoid
//@param mixed $pre
//@access private
//@return void
//
//
//インサート文を作成する
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_post
//@param boolean $pre
//@access public
//@return void
//
//
//指定したEV IDを削除
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_get
//@access protected
//@return void
//
//
//EV IDのインサート文作成
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_post
//@param mixed $tb
//@access public
//@return void
//
//
//EV IDのupdate文作成
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//現在テーブルからEV IDを削除 <br>
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $evid
//@param mixed $evcoid
//@access public
//@return void
//
//
//select句作成
//
//@author maeda
//@since 2010/07/15
//
//@access protected
//@return string
//
//
//更新に使うカラム決定
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $type
//@access protected
//@return $A_col
//
//
//更新に使うvalue決定
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_post
//@param mixed $type
//@access protected
//@return $A_val
//
//
//一覧データ取得（移動・削除画面用メソッド）
//
//@author maeda
//@since 2010/07/15
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
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_trg
//@access protected
//@return $A_rows
//
//
//移動、削除画面用一覧のwhere句作成
//
//@author maeda
//@since 2010/07/15
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
//@author maeda
//@since 2010/07/15
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//指定したIDの請求数を取得
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $evid
//@param mixed $evcoid
//@param mixed $pre
//@access protected
//@return void
//
//
//前月に指定のEV IDがあるかチェック
//
//@author maeda
//@since 2010/07/15
//
//@param mixed $evid
//@param mixed $evcoid
//@param mixed $A_prepost
//@access protected
//@return void
//
//
//デストラクタ
//
//@author maeda
//@since 2010/07/15
//
//@access public
//@return void
//
class ManagementEvModel extends ManagementModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getEvCoData() {
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		A_data += EvCoModel.getEvCoKeyHash();
		return A_data;
	}

	getUseEvCoData(A_post, cym, H_post) //テーブル名決定
	//検索値があれば加える
	{
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		this.setTableName(cym);
		var evcoid = undefined;

		if (undefined !== H_post.evcoid == true && H_post.evcoid != "") {
			evcoid = H_post.evcoid;
		}

		var A_res = EvCoModel.getUseEvCoKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.ev_tb, evcoid);
		A_data += A_res;
		return A_data;
	}

	makeEvSelectOneSQL(evid, evcoid) {
		var sql = "select " + this.makeColumns().join(",") + " from " + this.H_Tb.ev_tb + " where " + this.makeCommonEvWhere(evid, evcoid);
		return sql;
	}

	makeCommonEvWhere(evid, evcoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and evid=" + this.get_db().dbQuote(evid, "text", true) + " and evcoid=" + this.get_db().dbQuote(evcoid, "integer", true);

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	checkPastExist(H_post: {} | any[]) {
		var res = this.checkEvExist(H_post.evid, H_post.evcoid, true);
		return res;
	}

	checkEvExist(evid, evcoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_ev_tb;
		} else {
			tb = this.H_Tb.ev_tb;
		}

		var sql = "select count(evid) from " + tb + " where " + this.makeCommonEvWhere(evid, evcoid);

		if (this.get_db().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkDeleteExist(H_post, pre = false) {
		var res = this.checkDeleteEvExist(H_post.evid, H_post.evcoid, pre);
		return res;
	}

	checkDeleteEvExist(evid, evcoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_ev_tb;
		} else {
			tb = this.H_Tb.ev_tb;
		}

		var sql = "select count(evid) from " + tb + " where " + this.makeCommonEvWhere(evid, evcoid, "true");

		if (this.get_db().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	makeAddManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_ev_tb;
		} else {
			tb = this.H_Tb.ev_tb;
		}

		var sql = this.makeInsertEvSQL(H_post, tb);
		return sql;
	}

	makeDelManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_ev_tb;
		} else {
			tb = this.H_Tb.ev_tb;
		}

		var sql = this.makeDelEvSQL(H_post.evid, H_post.evcoid, tb);
		return sql;
	}

	makeInsertEvSQL(H_post, tb) {
		var sql = "insert into " + tb + " (" + this.makeColumns().join(",") + ") values (" + this.makeValues(H_post).join(",") + ")";
		return sql;
	}

	makeUpdateEvSQL(H_sess, tb) {
		var sql = "update " + tb + " set " + this.makeUpdateSetSQL(this.makeColumns("update"), this.makeValues(H_sess.post, "update")) + " where " + this.makeCommonEvWhere(H_sess.get.manageno, H_sess.get.coid, "false");
		return sql;
	}

	makeDelEvSQL(evid, evcoid, tb) {
		var sql = "delete from " + tb + " where " + this.makeCommonEvWhere(evid, evcoid, undefined);
		return sql;
	}

	makeEvSelectSQL() {
		var A_col = ["ev.postid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "ev.evid", "ev.evcoid", "ev_co_tb.evconame", "ev.username", "ev.ev_car_number", "ev.ev_car_type", "ev.ev_telno", "ev.ev_mail", "ev.ev_zip", "ev.ev_addr1", "ev.ev_addr2", "ev.ev_building", "ev.text1", "ev.text2", "ev.text3", "ev.text4", "ev.text5", "ev.text6", "ev.text7", "ev.text8", "ev.text9", "ev.text10", "ev.text11", "ev.text12", "ev.text13", "ev.text14", "ev.text15", "ev.int1", "ev.int2", "ev.int3", "ev.int4", "ev.int5", "ev.int6", "ev.date1", "ev.date2", "ev.date3", "ev.date4", "ev.date5", "ev.date6", "ev.mail1", "ev.mail2", "ev.mail3", "ev.url1", "ev.url2", "ev.url3"];
		return A_col.join(",");
	}

	makeColumns(type = "insert") //新規のみの項目
	{
		var A_col = ["evid", "userid", "username", "evcoid", "delete_flg", "fixdate", "ev_car_number", "ev_car_type", "ev_telno", "ev_mail", "ev_zip", "ev_addr1", "ev_addr2", "ev_building", "text1", "text2", "text3", "text4", "text5", "text6", "text7", "text8", "text9", "text10", "text11", "text12", "text13", "text14", "text15", "int1", "int2", "int3", "int4", "int5", "int6", "date1", "date2", "date3", "date4", "date5", "date6", "mail1", "mail2", "mail3", "url1", "url2", "url3", "memo", "sync_flg"];

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

		var A_val = [this.get_db().dbQuote(H_post.evid, "text", true), this.get_db().dbQuote(H_post.userid, "integer"), this.get_db().dbQuote(H_post.username, "text"), this.get_db().dbQuote(H_post.evcoid, "integer", true), this.get_db().dbQuote(H_post.delete_flg, "boolean"), this.get_db().dbQuote(this.NowTime, "timestamp", true), this.get_db().dbQuote(H_post.ev_car_number, "text"), this.get_db().dbQuote(H_post.ev_car_type, "text"), this.get_db().dbQuote(H_post.ev_telno, "text"), this.get_db().dbQuote(H_post.ev_mail, "text"), this.get_db().dbQuote(H_post.ev_zip, "text"), this.get_db().dbQuote(H_post.ev_addr1, "text"), this.get_db().dbQuote(H_post.ev_addr2, "text"), this.get_db().dbQuote(H_post.ev_building, "text"), this.get_db().dbQuote(H_post.text1, "text"), this.get_db().dbQuote(H_post.text2, "text"), this.get_db().dbQuote(H_post.text3, "text"), this.get_db().dbQuote(H_post.text4, "text"), this.get_db().dbQuote(H_post.text5, "text"), this.get_db().dbQuote(H_post.text6, "text"), this.get_db().dbQuote(H_post.text7, "text"), this.get_db().dbQuote(H_post.text8, "text"), this.get_db().dbQuote(H_post.text9, "text"), this.get_db().dbQuote(H_post.text10, "text"), this.get_db().dbQuote(H_post.text11, "text"), this.get_db().dbQuote(H_post.text12, "text"), this.get_db().dbQuote(H_post.text13, "text"), this.get_db().dbQuote(H_post.text14, "text"), this.get_db().dbQuote(H_post.text15, "text"), this.get_db().dbQuote(H_post.int1, "integer"), this.get_db().dbQuote(H_post.int2, "integer"), this.get_db().dbQuote(H_post.int3, "integer"), this.get_db().dbQuote(H_post.int4, "integer"), this.get_db().dbQuote(H_post.int5, "integer"), this.get_db().dbQuote(H_post.int6, "integer"), this.get_db().dbQuote(H_post.date1, "timestamp"), this.get_db().dbQuote(H_post.date2, "timestamp"), this.get_db().dbQuote(H_post.date3, "timestamp"), this.get_db().dbQuote(H_post.date4, "timestamp"), this.get_db().dbQuote(H_post.date5, "timestamp"), this.get_db().dbQuote(H_post.date6, "timestamp"), this.get_db().dbQuote(H_post.mail1, "text"), this.get_db().dbQuote(H_post.mail2, "text"), this.get_db().dbQuote(H_post.mail3, "text"), this.get_db().dbQuote(H_post.url1, "text"), this.get_db().dbQuote(H_post.url2, "text"), this.get_db().dbQuote(H_post.url3, "text"), this.get_db().dbQuote(H_post.memo, "text"), this.get_db().dbQuote(H_post.sync_flg, "boolean")];

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
			var A_res = this.get_db().queryRowHash(this.makeEvListSQL(A_post, A_rows[cnt]));

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
				A_line.evid = A_tmp[1];
				A_line.evcoid = A_tmp[2];
				A_rows.push(A_line);
			}
		}

		return A_rows;
	}

	makeEvWhereSQL(H_row) {
		var sql = " and " + "ev.evid=" + this.get_db().dbQuote(H_row.evid, "text", true) + " and " + "ev.evcoid=" + this.get_db().dbQuote(H_row.evcoid, "integer", true) + " and " + "ev.delete_flg=false";
		return sql;
	}

	checkBillExist(H_sess) //テーブル名の決定
	//対象が今月
	{
		this.setTableName(H_sess[ManagementEvModel.PUB].cym);
		var billflg = false;

		if (date("Ym") == H_sess[ManagementEvModel.PUB].cym) //前月も変更のフラグあり
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

	getBillCnt(evid, evcoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_ev_details_tb;
		} else {
			tb = this.H_Tb.ev_details_tb;
		}

		var sql = "select count(evid) from " + tb + " where " + this.makeCommonEvWhere(evid, evcoid, undefined);
		return this.get_db().queryOne(sql);
	}

	checkPreEvAuth(evid, evcoid, A_prepost) {
		var sql = "select count(evid) from " + this.H_Tb.pre_ev_tb + " where " + this.makeCommonEvWhere(evid, evcoid, "false");

		if (A_prepost.length > 0) {
			sql += " and " + " postid in (" + A_prepost.join(",") + ")";
		}

		return this.get_db().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};