//
//電話管理トップページ用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/02/20
//@uses ManagementTelModel
//
//
//
//電話管理トップページ用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/02/21
//@uses ManagementTelModel
//

require("model/Management/Tel/ManagementTelModel.php");

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
//電話管理一覧のデータを生成する <br>
//
//電話一覧件数取得<br>
//電話一覧取得<br>
//
//@author houshiyama
//@since 2008/02/26
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署ID）
//@param mixed $dounload
//@access private
//@return string
//
//
//一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/14
//
//@param array $H_sess
//@access private
//@return $sql
//
//
//件数を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/14
//
//@param array $H_sess
//@access private
//@return string
//
//
//電話一覧を取得するSQL文作成
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@param mixed $sort
//@access protected
//@return stringy
//
//
//where句作成
//
//@author houshiyama
//@since 2008/03/14
//
//@param mixed $H_post
//@param string $type
//@access protected
//@return void
//
//
//オーダー句のSQL文を作成する
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $sortt
//@access protected
//@return string
//
//
//オーダー句のSQL文を作成する（予約）
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $sortt
//@access protected
//@return string
//
//
//ユーザ設定項目取得 <br>
//
//@author houshiyama
//@since 2008/03/31
//
//@access public
//@return void
//
//
//電話一覧の件数を取得SQL文作成
//
//@author houshiyama
//@since 2008/02/29
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@access protected
//@return string
//
//
//電話一覧を取得するSQL文作成（予約）
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $A_post
//@param mixed $H_post（CGIパラメータ）
//@param mixed $sort
//@access protected
//@return stringy
//
//
//insertMngLog
//
//@author web
//@since 2016/04/01
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $postname
//@param mixed $userid
//@param mixed $username
//@param mixed $loginid
//@access public
//@return void
//
//
//convertLanguage
//
//@author
//@since 2010/12/13
//
//@param mixed $H_data
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
class ManagementTelMenuModel extends ManagementTelModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(H_sess, A_post, download = false) //テーブル名決定
	//フリーワードの値をローカルセッションのポストの値に合体させる
	//ダウンロード時は不要
	//予約権限あり
	{
		this.setTableName(H_sess[ManagementTelMenuModel.PUB].cym);
		var A_freeword = this.makeFreeWordArray(H_sess[ManagementTelMenuModel.PUB].freeword);

		if (A_freeword.length > 0) {
			H_sess.SELF.post.A_freeword = this.makeFreeWordArray(H_sess[ManagementTelMenuModel.PUB].freeword);
		}

		var A_data = Array();

		if (false == download) //件数取得
			//最期のページが無くなっていないかチェック
			{
				A_data[0] = this.get_DB().queryOne(this.makeTelListCntSQL(A_post, H_sess.SELF.post));

				if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
					H_sess.SELF.offset = H_sess.SELF.offset - 1;
				}

				this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
			}

		if (undefined !== H_sess.SELF.get.dlmode == true && H_sess.SELF.get.dlmode == "reserve") //ここが不要
			{} else {
			A_data[1] = this.get_DB().queryHash(this.makeTelListSQL(A_post, H_sess.SELF.post, H_sess.SELF.sort));
		}

		if (-1 !== this.A_Auth.indexOf("fnc_tel_reserve") == true && H_sess[ManagementTelMenuModel.PUB].cym == this.YM) //予約の表示条件を合体
			//ダウンロード時は不要
			{
				H_sess.SELF.post.r_mode = H_sess.SELF.r_mode;

				if (false == download) //件数取得
					//最期のページが無くなっていないかチェック
					{
						A_data[2] = this.get_DB().queryOne(this.makeTelReserveListCntSQL(A_post, H_sess.SELF.post));

						if (H_sess.SELF.offset > 1 && Math.ceil(A_data[0] / H_sess.SELF.limit) < H_sess.SELF.offset) {
							H_sess.SELF.offset = H_sess.SELF.offset - 1;
						}

						this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.r_offset - 1) * H_sess.SELF.limit);
					}

				if (undefined !== H_sess.SELF.get.dlmode == true && H_sess.SELF.get.dlmode == "now") //ここが不要
					{} else {
					A_data[3] = this.get_DB().queryHash(this.makeTelReserveListSQL(A_post, H_sess.SELF.post, H_sess.SELF.r_sort));
				}
			}

		if (false == download) {
			return A_data;
		} else {
			if (undefined !== H_sess.SELF.get.dlmode == true && H_sess.SELF.get.dlmode == "reserve") {
				this.convertLanguage(A_data[3]);
				return A_data[3];
			} else {
				this.convertLanguage(A_data[1]);
				return A_data[1];
			}
		}
	}

	makeListSQL(H_sess: {} | any[]) {
		return this.makeTelListSQL(H_sess);
	}

	makeListCntSQL(H_sess: {} | any[]) {
		return this.makeTelListCntSQL(H_sess);
	}

	makeTelListSQL(A_post, H_post: {} | any[], sort) {
		var sql = "select " + this.makeTelSelectSQL() + " from " + this.makeTelFromSQL("now", "main") + "where " + this.makeCommonWhereSQL(A_post, "te") + this.makeTelWhereSQL(H_post) + this.makeOrderBySQL(sort);
		return sql;
	}

	makeTelWhereSQL(H_post, type = "now") //ダミーフラグ
	//管理番号入力あり
	//未使用電話
	{
		var A_where = Array();
		var sql = " and (te.dummy_flg = false or te.dummy_flg is null) ";

		if (H_post.telno_view != "") {
			A_where.push("te.telno like '%" + this.O_Manage.convertNoView(H_post.telno_view) + "%'");
		}

		if (H_post.carid != "") {
			A_where.push("te.carid=" + H_post.carid);
		}

		if (H_post.username != "") {
			A_where.push("te.username like '%" + H_post.username + "%'");
		}

		if (H_post.employeecode != "") {
			A_where.push("te.employeecode like '%" + H_post.employeecode + "%'");
		}

		if (undefined !== H_post.extensionno && H_post.extensionno != "") {
			A_where.push("te.extensionno like '%" + H_post.extensionno + "%'");
		}

		if (H_post.warning_status != "") //警告あり
			{
				if ("0" == H_post.warning_status) {
					A_where.push("(te.planalert = '1' or te.packetalert = '1' or te.planalert = '3' or te.packetalert = '3')");
				} else if ("1" == H_post.warning_status) {
					A_where.push("(te.planalert = '1' or te.packetalert = '1')");
				} else if ("2" == H_post.warning_status) {
					A_where.push("(te.planalert != '1' and te.packetalert != '1' and (te.planalert = '3' or te.packetalert = '3'))");
				} else if ("3" == H_post.warning_status) {
					A_where.push("(te.planalert = '0' or te.packetalert = '2' or te.packetalert is null) and (te.packetalert = '0' or te.packetalert = '2' or te.packetalert is null)");
				}
			}

		if (H_post.cirid != "") {
			A_where.push("te.cirid=" + H_post.cirid);
		}

		if (H_post.buyselid != "") {
			A_where.push("te.buyselid=" + H_post.buyselid);
		}

		if (H_post.planid != "") {
			A_where.push("te.planid in (" + H_post.planid + ")");
		}

		if (H_post.packetid != "") {
			A_where.push("te.packetid in (" + H_post.packetid + ")");
		}

		if (H_post.pointid != "") {
			A_where.push("te.pointstage in (" + H_post.pointid + ")");
		}

		if (H_post.arid != "") {
			A_where.push("te.arid=" + H_post.arid);
		}

		if (H_post.discountid != "") {
			var dis_str = this.makeSerializeColWhere(H_post.discountid, H_post.search_condition, "te.discounts");

			if (dis_str !== false) {
				A_where.push(dis_str);
			}
		}

		if (H_post.opid != "") {
			var op_str = this.makeSerializeColWhere(H_post.opid, H_post.search_condition, "te.options");

			if (op_str !== false) {
				A_where.push(op_str);
			}
		}

		if (H_post.kousiflg != "") {
			A_where.push("te.kousiflg like '%" + H_post.kousiflg + "%'");
		}

		if (H_post.kousiptnid != "") {
			A_where.push("te.kousiptn=" + H_post.kousiptnid);
		}

		if (H_post.userid != "") {
			A_where.push("us.username like '%" + H_post.userid + "%'");
		}

		if (H_post.assetsno != "") {
			A_where.push("ass.assetsno like '%" + H_post.assetsno + "%'");
		}

		if (H_post.serialno != "") {
			A_where.push("ass.serialno like '%" + H_post.serialno + "%'");
		}

		if (H_post.firmware != "") {
			A_where.push("ass.firmware like '%" + H_post.firmware + "%'");
		}

		if (H_post.version != "") {
			A_where.push("ass.version like '%" + H_post.version + "%'");
		}

		if (H_post.smpcirid != "") {
			A_where.push("ass.smpcirid=" + H_post.smpcirid);
		}

		if (H_post.seriesname != "") {
			A_where.push("ass.seriesname like '%" + H_post.seriesname + "%'");
		}

		if (H_post.productname != "") {
			A_where.push("ass.productname like '%" + H_post.productname + "%'");
		}

		if (H_post.property != "") {
			A_where.push("ass.property like '%" + H_post.property + "%'");
		}

		if (H_post.text.column != "" && H_post.text.val != "") {
			A_where.push("te." + H_post.text.column + " like '%" + H_post.text.val + "%'");
		}

		if (H_post.int.column != "" && H_post.int.val != "") {
			if (H_post.int.column == "bought_price" || H_post.int.column == "pay_frequency" || H_post.int.column == "pay_monthly_sum") //割賦金月額を見る場合は、一回払いを無視しよう
				{
					A_where.push("ass." + H_post.int.column + " " + H_post.int.condition + " " + H_post.int.val);

					if (H_post.int.column == "pay_monthly_sum") {
						A_where.push("ass.pay_frequency != 1");
					}
				} else {
				A_where.push("te." + H_post.int.column + " " + H_post.int.condition + " " + H_post.int.val);
			}
		}

		if (H_post.date.column != "" && H_post.date.val.Y + H_post.date.val.m + H_post.date.val.d != "") //対象のカラムがどのテーブルか調べる
			//where作成
			{
				var col_from_tb = Array();
				col_from_tb.pay_startdate = "ass";
				col_from_tb.bought_date = "ass";
				col_from_tb.receiptdate = "ass";
				var tb = undefined !== col_from_tb[H_post.date.column] ? col_from_tb[H_post.date.column] : "te";
				var dateval = this.O_Manage.convertDatetime(H_post.date.val);

				if ("=" != H_post.date.condition) //array_push( $A_where, "te." . $H_post["date"]["column"] . " " . $H_post["date"]["condition"] . " " . $this->get_DB()->dbQuote( $dateval, "timestamp" ) );
					{
						if (">" == H_post.date.condition) {
							var dw = tb + "." + H_post.date.column + " " + H_post.date.condition + " " + this.get_DB().dbQuote(dateval + " 23:59:59", "timestamp");
						} else {
							dw = tb + "." + H_post.date.column + " " + H_post.date.condition + " " + this.get_DB().dbQuote(dateval + " 00:00:00", "timestamp");
						}

						A_where.push(dw);
					} else {
					dw = "(" + tb + "." + H_post.date.column + " >= " + this.get_DB().dbQuote(dateval + " 00:00:00", "timestamp");
					dw += " AND ";
					dw += tb + "." + H_post.date.column + " <= " + this.get_DB().dbQuote(dateval + " 23:59:59", "timestamp") + ")";
					A_where.push(dw);
				}
			}

		if (H_post.mail.column != "" && H_post.mail.val != "") {
			A_where.push("te." + H_post.mail.column + " like '%" + H_post.mail.val + "%'");
		}

		if (H_post.url.column != "" && H_post.url.val != "") {
			A_where.push("te." + H_post.url.column + " like '%" + H_post.url.val + "%'");
		}

		if (H_post.select_val.column != "" && H_post.select_val.val != "") {
			A_where.push("te." + H_post.select_val.column + " like '%" + H_post.select_val.val + "%'");
		}

		if (undefined !== H_post.A_freeword == true) {
			A_where.push(this.makeFreeWordWhere(this.getTelFreeWordCol(), H_post.A_freeword));
		}

		if (H_post.recogname != "") {
			A_where.push("recogu.username like '%" + H_post.recogname + "%'");
		}

		if (H_post.recogcode != "") {
			A_where.push("te.recogcode like '%" + H_post.recogcode + "%'");
		}

		if (H_post.pbpostname != "") {
			A_where.push("pbpo.postname like '%" + H_post.pbpostname + "%'");
		}

		if (H_post.pbpostcode_first != "") {
			A_where.push("te.pbpostcode_first like '%" + H_post.pbpostcode_first + "%'");
		}

		if (H_post.pbpostcode_second != "") {
			A_where.push("te.pbpostcode_second like '%" + H_post.pbpostcode_second + "%'");
		}

		if (H_post.cfbpostname != "") {
			A_where.push("cfbpo.postname like '%" + H_post.cfbpostname + "%'");
		}

		if (H_post.cfbpostcode_first != "") {
			A_where.push("te.cfbpostcode_first like '%" + H_post.cfbpostcode_first + "%'");
		}

		if (H_post.cfbpostcode_second != "") {
			A_where.push("te.cfbpostcode_second like '%" + H_post.cfbpostcode_second + "%'");
		}

		if (H_post.ioecode != "") {
			A_where.push("te.ioecode like '%" + H_post.ioecode + "%'");
		}

		if (H_post.coecode != "") {
			A_where.push("te.coecode like '%" + H_post.coecode + "%'");
		}

		if (H_post.commflag != "") {
			A_where.push("te.commflag = '" + H_post.commflag + "'");
		}

		if (H_post.employee_class != "") {
			A_where.push("te.employee_class = " + H_post.employee_class);
		}

		if (H_post.executive_no != "") {
			A_where.push("te.executive_no like '%" + H_post.executive_no + "%'");
		}

		if (H_post.executive_name != "") {
			A_where.push("te.executive_name like '%" + H_post.executive_name + "%'");
		}

		if (H_post.executive_mail != "") {
			A_where.push("te.executive_mail like '%" + H_post.executive_mail + "%'");
		}

		if (H_post.salary_source_name != "") {
			A_where.push("te.salary_source_name like '%" + H_post.salary_source_name + "%'");
		}

		if (H_post.salary_source_code != "") {
			A_where.push("te.salary_source_code like '%" + H_post.salary_source_code + "%'");
		}

		if (H_post.office_code != "") {
			A_where.push("te.office_code like '%" + H_post.office_code + "%'");
		}

		if (H_post.office_name != "") {
			A_where.push("te.office_name like '%" + H_post.office_name + "%'");
		}

		if (H_post.building_name != "") {
			A_where.push("te.building_name like '%" + H_post.building_name + "%'");
		}

		if (H_post.division != "") {
			if (H_post.division === "-1") {
				A_where.push("te.division is null");
			} else {
				A_where.push("te.division = '" + H_post.division + "'");
			}
		}

		sql += this.implodeWhereArray(A_where, H_post.search_condition);

		if (undefined !== H_post.trgtype["1"] == true && H_post.trgtype["1"] == "1") {
			sql += " and te.finishing_f is false";
		}

		if ("reserve" === type) {
			sql += " and te.exe_state in (" + H_post.r_mode + ") and te.order_flg is false ";
		}

		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = [this.H_Tb.post_tb + ".postname", "te.telno", "carrier_tb.carname", "circuit_tb.cirname", "plan_tb.planname", "ass.productname", "te.username", "ass.bought_date", "te.extensionno", "te.division"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",te.postid ";
		}

		if (A_sort[0] != 1) {
			sql += ",te.telno ";
		}

		sql += ",tra.main_flg desc,ass.recdate desc";
		return sql;
	}

	makeReserveOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["te.add_edit_flg", this.H_Tb.post_tb + ".postname", "te.telno", "carrier_tb.carname", "circuit_tb.cirname", "plan_tb.planname", "ass.productname", "te.username", "te.extensionno", "te.reserve_date", "te.exe_date"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",te.postid ";
		}

		if (A_sort[0] != 1) {
			sql += ",te.telno ";
		}

		sql += ",tra.main_flg desc";
		return sql;
	}

	getViewProperty() //selectは名前を修正する
	{
		var H_prop = this.getManagementProperty(ManagementTelMenuModel.TELMID);

		for (var key in H_prop) {
			var value = H_prop[key];

			if (preg_match("/select/", key)) {
				var temp = value.split(":");
				H_prop[key] = temp[0];
			}
		}

		return H_prop;
	}

	makeTelReserveListCntSQL(A_post, H_post: {} | any[]) {
		var sql = "select count(te.telno) " + " from " + this.makeTelReserveFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "te") + this.makeTelWhereSQL(H_post, "reserve");
		return sql;
	}

	makeTelReserveListSQL(A_post, H_post: {} | any[], sort) {
		var sql = "select " + this.makeTelSelectSQL("reserve") + " from " + this.makeTelReserveFromSQL() + "where " + this.makeCommonWhereSQL(A_post, "te") + this.makeTelWhereSQL(H_post, "reserve") + this.makeReserveOrderBySQL(sort);
		return sql;
	}

	insertMngLog(pactid, postid, postname, userid, username, loginid, dlmode, cym, joker) {
		var data = Array();

		if (dlmode == "now") {
			var comment2 = "\u96FB\u8A71\u7BA1\u7406\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9";
		} else if (dlmode == "reserve") {
			comment2 = "\u96FB\u8A71\u7BA1\u7406\u306E\u4E88\u7D04\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9";
		} else {
			comment2 = "\u96FB\u8A71\u7BA1\u7406\u3067\u914D\u4E0B\u5168\u3066\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9";
		}

		comment2 += "(" + cym + ")";
		data.pactid = this.get_DB().dbQuote(pactid, "int", true);
		data.postid = this.get_DB().dbQuote(postid, "int", true);
		data.targetpostid = this.get_DB().dbQuote(postid, "int", true);
		data.postname = this.get_DB().dbQuote(postname, "text", true);
		data.userid = this.get_DB().dbQuote(userid, "int", true);
		data.username = this.get_DB().dbQuote(username, "text", true);
		data.recdate = this.get_DB().dbQuote(date("Y-m-d H:i:s"), "date", true);
		data.comment1 = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2 = this.get_DB().dbQuote(comment2, "text", true);
		data.comment1_eng = this.get_DB().dbQuote("ID\uFF1A" + loginid, "text", true);
		data.comment2_eng = this.get_DB().dbQuote("download tel management", "text", true);
		data.kind = this.get_DB().dbQuote("D", "text", true);
		data.type = this.get_DB().dbQuote("\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9", "text", true);
		data.joker_flag = this.get_DB().dbQuote(joker === 1 ? 1 : 0, "integer", true);
		var keys = Object.keys(data);
		var sql = "INSERT INTO mnglog_tb (" + keys.join(",") + ")VALUES(" + data.join(",") + ")";
		this.get_DB().query(sql);
	}

	convertLanguage(H_data) {
		if (!Array.isArray(H_data)) {
			return false;
		}

		var sql = "SELECT itemname, itemname_eng FROM mt_order_item_tb " + "WHERE carid=4 AND cirid=11 AND type='N' AND inputname='webreliefservice' GROUP BY itemname, itemname_eng";
		var H_lang = this.get_DB().queryAssoc(sql);

		for (var key in H_data) {
			var val = H_data[key];

			if (!!val.webreliefservice) {
				H_data[key].webreliefservice_lng = H_lang[val.webreliefservice];
			} else {
				H_data[key].webreliefservice_lng = "";
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};