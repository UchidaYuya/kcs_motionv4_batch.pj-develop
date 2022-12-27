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

require("model/HealthcareCoModel.php");

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
class ManagementHealthcareModel extends ManagementModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getHealthcareCoData() {
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		A_data += HealthcareCoModel.getHealthcareCoKeyHash();
		return A_data;
	}

	getUseHealthcareCoData(A_post, cym, H_post) //テーブル名決定
	//検索値があれば加える
	{
		var A_data = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};
		this.setTableName(cym);
		var trancoid = undefined;

		if (undefined !== H_post.healthcoid == true && H_post.healthcoid != "") {
			trancoid = H_post.healthcoid;
		}

		var A_res = HealthcareCoModel.getUseHealthcareCoKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.healthcare_tb, healthcoid);
		A_data += A_res;
		return A_data;
	}

	makeHealthSelectOneSQL(healthid, healthcoid) {
		var sql = "select " + this.makeColumns().join(",") + " from " + this.H_Tb.healthcare_tb + " where " + this.makeCommonHealthWhere(healthid, healthcoid);
		return sql;
	}

	makeCommonHealthWhere(healthid, healthcoid, delflg = "false") {
		var sql = " pactid=" + this.get_db().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and healthid=" + this.get_db().dbQuote(healthid, "text", true) + " and healthcoid=" + this.get_db().dbQuote(healthcoid, "integer", true);

		if (delflg != undefined) {
			sql += " and delete_flg=" + delflg;
		}

		return sql;
	}

	checkPastExist(H_post: {} | any[]) {
		var res = this.checkHealthExist(H_post.healthid, H_post.healthcoid, true);
		return res;
	}

	checkHealthExist(healthid, healthcoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_healthcare_tb;
		} else {
			tb = this.H_Tb.healthcare_tb;
		}

		var sql = "select count(healthid) from " + tb + " where " + this.makeCommonHealthWhere(healthid, healthcoid);

		if (this.get_db().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkDeleteExist(H_post, pre = false) {
		var res = this.checkDeleteHealthExist(H_post.healthid, H_post.healthcoid, pre);
		return res;
	}

	checkDeleteHealthExist(healthid, healthcoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_healthcare_tb;
		} else {
			tb = this.H_Tb.healthcare_tb;
		}

		var sql = "select count(healthid) from " + tb + " where " + this.makeCommonHealthWhere(healthid, healthcoid, "true");

		if (this.get_db().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	makeAddManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_healthcare_tb;
		} else {
			tb = this.H_Tb.healthcare_tb;
		}

		var sql = this.makeInsertHealthSQL(H_post, tb);
		return sql;
	}

	makeDelManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_healthcare_tb;
		} else {
			tb = this.H_Tb.healthcare_tb;
		}

		var sql = this.makeDelHealthSQL(H_post.healthid, H_post.healthcoid, tb);
		return sql;
	}

	makeInsertHealthSQL(H_post, tb) {
		var sql = "insert into " + tb + " (" + this.makeColumns().join(",") + ") values (" + this.makeValues(H_post).join(",") + ")";
		return sql;
	}

	makeUpdateHealthSQL(H_sess, tb) {
		var sql = "update " + tb + " set " + this.makeUpdateSetSQL(this.makeColumns("update"), this.makeValues(H_sess.post, "update")) + " where " + this.makeCommonHealthWhere(H_sess.get.manageno, H_sess.get.coid, "false");
		return sql;
	}

	makeDelHealthSQL(healthid, healthcoid, tb) {
		var sql = "delete from " + tb + " where " + this.makeCommonHealthWhere(healthid, healthcoid, undefined);
		return sql;
	}

	makeHealthSelectSQL() {
		var A_col = ["hlt.postid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "hlt.healthid", "hlt.healthcoid", "healthcare_co_tb.healthconame", "hlt.username", "hlt.employeecode", "hlt.fixdate", "hlt.registdate", "hlt.remarks"];
		return A_col.join(",");
	}

	makeColumns(type = "insert") //新規のみの項目
	{
		var A_col = ["healthid", "healthcoid", "username", "employeecode", "registdate", "remarks", "fixdate"];

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
		if (H_post.registdate.Y != "" && H_post.registdate.m != "" && H_post.registdate.d != "") {
			var registdate = sprintf("%04d-%02d-%02d", H_post.registdate.Y, H_post.registdate.m, H_post.registdate.d);
		} else {
			registdate = "";
		}

		var A_val = [this.get_db().dbQuote(H_post.healthid, "text", true), this.get_db().dbQuote(H_post.healthcoid, "integer", true), this.get_db().dbQuote(H_post.username, "text"), this.get_db().dbQuote(H_post.employeecode, "text", true), this.get_db().dbQuote(registdate, "timestamp"), this.get_db().dbQuote(H_post.remarks, "text"), this.get_db().dbQuote(this.NowTime, "timestamp", true)];

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
			var A_res = this.get_db().queryRowHash(this.makeHealthListSQL(A_post, A_rows[cnt]));

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
				A_line.healthid = A_tmp[1];
				A_line.healthcoid = A_tmp[2];
				A_rows.push(A_line);
			}
		}

		return A_rows;
	}

	makeHealthWhereSQL(H_row) {
		var sql = " and " + "hlt.healthid=" + this.get_db().dbQuote(H_row.healthid, "text", true) + " and " + "hlt.healthcoid=" + this.get_db().dbQuote(H_row.healthcoid, "integer", true) + " and " + "hlt.delete_flg=false";
		return sql;
	}

	checkBillExist(H_sess) //テーブル名の決定
	//対象が今月
	{
		this.setTableName(H_sess[ManagementHealthcareModel.PUB].cym);
		var billflg = false;

		if (date("Ym") == H_sess[ManagementHealthcareModel.PUB].cym) //前月も変更のフラグあり
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

	getBillCnt(healthid, healthcoid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_healthcare_rechistory_tb;
		} else {
			tb = this.H_Tb.healthcare_rechistory_tb;
		}

		var sql = "select count(healthid) from " + tb + " where " + this.makeCommonHealthWhere(healthid, healthcoid, undefined);
		return this.get_db().queryOne(sql);
	}

	checkPreHealthAuth(healthid, healthcoid, A_prepost) {
		var sql = "select count(healthid) from " + this.H_Tb.pre_healthcare_tb + " where " + this.makeCommonHealthWhere(healthid, healthcoid, "false");

		if (A_prepost.length > 0) {
			sql += " and " + " postid in (" + A_prepost.join(",") + ")";
		}

		return this.get_db().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};