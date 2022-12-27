//
//管理情報管理記録用Model
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/03/30
//@since 2010/07/09
//@uses ManageModel
//@uses ManagementUtil
//
//
//
//管理情報管理記録用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/30
//@uses ModelBase
//

require("model/Management/ManagementModel.php");

require("ManagementUtil.php");

//
//コンストラクター
//
//@author houshiyama
//@since 2008/03/30
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//管理記録一覧データを生成する <br>
//
//@author houshiyama
//@since 2008/03/30
//
//@param mixed $H_sess（CGIパラメータ）
//@access public
//@return array
//
//
//management_log_tbへのSQL文のselect句を作成する
//
//@author houshiyama
//@since 2008/04/01
//
//@access private
//@return void
//
//
//management_log_tbへのSQL文のfrom句を作成する
//
//@author houshiyama
//@since 2008/04/01
//
//@access private
//@return void
//
//
//getTreeJS
//部署ツリーの作成
//@author web
//@since 2015/12/15
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $current_postid
//@access public
//@return void
//
//
//makeManagementLogSearchSQL
//検索項目のSQLを作成
//@author web
//@since 2016/03/23
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//isSearchDate
//作業日時の指定が行われているか確認を行う
//@author date
//@since 2016/03/23
//
//@access private
//@return void
//
//
//management_log_tbへのSQL文のwhere句を作成する
//
//@author houshiyama
//@since 2008/03/30
//
//@param array $A_auth
//@param array $H_sess
//@param array $A_postid
//@access private
//@return string
//
//
//オーダー句のSQL文を作成する
//
//@author houshiyama
//@since 2008/03/04
//
//@param mixed $sortt
//@access private
//@return string
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/30
//
//@access public
//@return void
//
class ManagementLogModel extends ManagementModel {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getList(A_auth: {} | any[], H_sess: {} | any[], bLimit = true) //英語表記
	{
		var A_listsql = Array();
		var A_cntsql = Array();
		var A_data = Array();
		var A_post = this.O_Post.getChildList(this.H_G_Sess.pactid, this.H_G_Sess.postid);
		var mid = "";

		if (undefined !== H_sess.SELF.post == false) {
			H_sess.SELF.post = Array();
		}

		var cntsql = "select count(manageno) " + " from " + this.makeManagementLogFromSQL() + " where " + this.makeManagementLogWhereSQL(A_auth, H_sess.SELF, A_post);
		var sql = "select " + this.makeManagementLogSelectSQL(A_auth, H_sess.SELF) + " from " + this.makeManagementLogFromSQL() + " where " + this.makeManagementLogWhereSQL(A_auth, H_sess.SELF, A_post) + this.makeOrderBySQL(H_sess.SELF.sort);
		A_data[0] = this.get_DB().queryOne(cntsql);

		if (bLimit) {
			this.get_DB().setLimit(H_sess.SELF.limit, (H_sess.SELF.offset - 1) * H_sess.SELF.limit);
		}

		A_data[1] = this.get_db().queryHash(sql);
		var A_conv = {
			tel: "Phone",
			ETC: "ETC",
			purchase: "Purchase",
			copy: "Copy machine",
			assets: "Property",
			transit: "Transit",
			ev: "EV",
			healthcare: "Healthcare"
		};

		for (var cnt = 0; cnt < A_data[1].length; cnt++) {
			A_data[1][cnt].mname = A_conv[A_data[1][cnt].mname];
		}

		return A_data;
	}

	makeManagementLogSelectSQL() {
		var str = "case when ml.mid=" + ManagementLogModel.TELMID + " then carrier_tb.carname" + " when ml.mid=" + ManagementLogModel.ETCMID + " then card_co_tb.cardconame" + " when ml.mid=" + ManagementLogModel.PURCHMID + " then purchase_co_tb.purchconame" + " when ml.mid=" + ManagementLogModel.COPYMID + " then copy_co_tb.copyconame" + " when ml.mid=" + ManagementLogModel.ASSMID + " then case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end" + " when ml.mid=" + ManagementLogModel.TRANMID + " then transit_co_tb.tranconame" + " when ml.mid=" + ManagementLogModel.EVMID + " then ev_co_tb.evconame" + " when ml.mid=" + ManagementLogModel.HEALTHMID + " then healthcare_co_tb.healthconame" + " end as coname";
		var str_eng = "case when ml.mid=" + ManagementLogModel.TELMID + " then carrier_tb.carname_eng" + " when ml.mid=" + ManagementLogModel.ETCMID + " then card_co_tb.cardconame" + " when ml.mid=" + ManagementLogModel.PURCHMID + " then purchase_co_tb.purchconame" + " when ml.mid=" + ManagementLogModel.COPYMID + " then copy_co_tb.copyconame" + " when ml.mid=" + ManagementLogModel.ASSMID + " then case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end" + " when ml.mid=" + ManagementLogModel.TRANMID + " then transit_co_tb.tranconame" + " when ml.mid=" + ManagementLogModel.EVMID + " then ev_co_tb.evconame_eng" + " when ml.mid=" + ManagementLogModel.HEALTHMID + " then healthcare_co_tb.healthconame" + " end as coname_eng";
		var A_col = ["ml.mid", "mt.mname", "mt.mname_jpn", "ml.postid", "ml.username", "ml.manageno", "ml.manageno_view", "ml.coid", str, str_eng, "ml.comment", "ml.comment_eng", "ml.trg_postid", "ml.trg_postid_aft", "ml.trg_postname", "ml.trg_postname_aft", "ml.type", "ml.recdate"];
		return A_col.join(",");
	}

	makeManagementLogFromSQL() {
		var str = " management_log_tb as ml " + " left outer join management_tb as mt on ml.mid=mt.mid " + " left outer join carrier_tb on ml.coid=carrier_tb.carid " + " left outer join card_co_tb on ml.coid=card_co_tb.cardcoid " + " left outer join purchase_co_tb on ml.coid=purchase_co_tb.purchcoid " + " left outer join copy_co_tb on ml.coid=copy_co_tb.copycoid " + " left outer join assets_type_tb as att1 on ml.coid=att1.assetstypeid and ml.pactid=att1.pactid " + " left outer join assets_type_tb as att2 on ml.coid=att2.assetstypeid and att2.pactid=0 " + " left outer join transit_co_tb on ml.coid=transit_co_tb.trancoid " + " left outer join ev_co_tb on ml.coid=ev_co_tb.evcoid " + " left outer join healthcare_co_tb on ml.coid=healthcare_co_tb.healthcoid ";
		return str;
	}

	getTreeJS(pactid, postid, current_postid) {
		var H_tree = Array();
		var tb_no = "";
		H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
		var O_post = new MtPostUtil();
		H_tree.post_name = O_post.getPostTreeBand(pactid, postid, current_postid, tb_no, " -> ", "", 1, false);
		var O_tree = new TreeAJAX();
		O_tree.post_tb = "post_tb";
		O_tree.post_relation_tb = "post_relation_tb";
		H_tree.tree_str = O_tree.makeTree(postid);
		var O_xlist = new ListAJAX();
		O_xlist.post_tb = "post_tb";
		O_xlist.post_relation_tb = "post_relation_tb";
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	makeManagementLogSearchSQL(H_sess) //部署
	{
		var search = H_sess.search;
		var res = Array();

		if (search.pid != "" && search.post_condition == "multi") {
			var post_list = this.O_Post.getChildList(this.H_G_Sess.pactid, search.pid);
			res.push("ml.postid in (" + post_list.join(",") + ")");
		}

		var temp = Array();

		if (search.comment_sel != "") {
			temp.push("ml.comment like " + this.get_DB().dbQuote("%" + search.comment_sel + "%", "text", true));
		}

		if (search.comment != "") {
			temp.push("ml.comment like " + this.get_DB().dbQuote("%" + search.comment + "%", "text", true));
		}

		if (!!temp) {
			res.push("(" + temp.join(" and ") + ")");
		}

		temp = Array();

		if (search.manageno != "") {
			temp.push("ml.manageno like " + this.get_DB().dbQuote("%" + search.manageno + "%", "text", true));
			temp.push("ml.manageno_view like " + this.get_DB().dbQuote("%" + search.manageno + "%", "text", true));
			res.push("(" + temp.join(" or ") + ")");
		}

		if (search.username != "") {
			res.push("ml.username like " + this.get_DB().dbQuote("%" + search.username + "%", "text", true));
		}

		temp = ["ml.recdate >= '" + date("Y-m-d H:i:s", mktime(0, 0, 0, date("n") - 11, 1, date("Y"))) + "'"];

		if (search.recdate_from.Y != "" && search.recdate_from.m != "" && search.recdate_from.d != "" && search.recdate_from.H != "" && search.recdate_from.i != "") {
			var recdate_from = sprintf("%02d-%02d-%02d %02d:%02d:00", +search.recdate_from.Y, +search.recdate_from.m, +search.recdate_from.d, +search.recdate_from.H, +search.recdate_from.i);
			temp.push("ml.recdate >= " + this.get_DB().dbQuote(recdate_from, "timestamp", true));
		}

		if (search.recdate_to.Y != "" && search.recdate_to.m != "" && search.recdate_to.d != "" && search.recdate_to.H != "" && search.recdate_to.i != "") {
			var recdate_to = sprintf("%02d-%02d-%02d %02d:%02d:59", +search.recdate_to.Y, +search.recdate_to.m, +search.recdate_to.d, +search.recdate_to.H, +search.recdate_to.i);
			temp.push("ml.recdate <= " + this.get_DB().dbQuote(recdate_to, "timestamp", true));
		}

		if (!!temp) {
			res.push("(" + temp.join(" AND ") + ")");
		}

		if (!!res) {
			return "(" + res.join(" " + search.search_condition + " ") + ")";
		}

		return "";
	}

	isSearchDate(search) {
		if (search.recdate_from.Y != "") return true;
		if (search.recdate_from.m != "") return true;
		if (search.recdate_from.d != "") return true;
		if (search.recdate_to.Y != "") return true;
		if (search.recdate_to.m != "") return true;
		if (search.recdate_to.d != "") return true;
		return false;
	}

	makeManagementLogWhereSQL(A_auth: {} | any[], H_sess: {} | any[], A_postid: {} | any[]) //部署の絞込み(検索で絞込みが設定されていない場合に、ユーザーの部署、配下部署で絞り込む)
	//成り代り記録非表示権限
	{
		var A_where = Array();
		var A_midwhere = Array();

		if (undefined !== H_sess.mid == true) {
			var mid = H_sess.mid;
		} else {
			mid = "";
		}

		var search = H_sess.search;

		if (!(search.pid != "" && search.post_condition == "multi")) {
			A_where.push("ml.postid in (" + A_postid.join(",") + ")");
		}

		if (!(undefined !== H_sess.search) || !this.isSearchDate(H_sess.search)) //年月
			//指定月の設定
			{
				var cy = H_sess.cym.substr(0, 4);
				var cm = H_sess.cym.substr(4, 2);
				var endday = date("t", mktime(0, 0, 0, cm, 1, cy));
				var start = cy + "-" + cm + "-01";
				var end = cy + "-" + cm + "-" + endday;
				A_where.push("ml.recdate >= " + this.get_db().dbQuote(start + " 00:00:00", "timestamp", true));
				A_where.push("ml.recdate <= " + this.get_db().dbQuote(end + " 23:59:59", "timestamp", true));
			}

		if (mid == 0) //管理情報の絞込みに電話が含まれている時
			{
				if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.TELMID, "integer", true));
				}

				if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.ETCMID, "integer", true));
				}

				if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.PURCHMID, "integer", true));
				}

				if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.COPYMID, "integer", true));
				}

				if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.ASSMID, "integer", true));
				}

				if (-1 !== this.A_Auth.indexOf("fnc_tran_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.TRANMID, "integer", true));
				}

				if (-1 !== this.A_Auth.indexOf("fnc_ev_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.EVMID, "integer", true));
				}

				if (-1 !== this.A_Auth.indexOf("fnc_healthcare_manage_vw") == true) {
					A_midwhere.push(this.get_db().dbQuote(ManagementLogModel.HEALTHMID, "integer", true));
				}

				A_where.push("ml.mid in (" + A_midwhere.join(",") + ")");
			} else {
			A_where.push("ml.mid = " + mid);
		}

		if (-1 !== A_auth.indexOf("fnc_joker_operate") == true) {
			A_where.push("ml.joker_flag=0");
		}

		if (undefined !== H_sess.search) {
			search = this.makeManagementLogSearchSQL(H_sess);

			if (search != "") {
				A_where.push(search);
			}
		}

		var sql = A_where.join(" and ");
		return sql;
	}

	makeOrderBySQL(sort) {
		var A_sort = split(",", sort);
		var A_col = ["ml.mid", "ml.comment", "ml.manageno", "ml.trg_postid", "ml.username", "ml.recdate"];
		var sql = " order by " + A_col[A_sort[0]];

		if (A_sort[1] == "d") {
			sql += " desc ";
		}

		if (A_sort[0] != 0) {
			sql += ",recdate desc ";
		}

		return sql;
	}

	__destruct() {
		super.__destruct();
	}

};