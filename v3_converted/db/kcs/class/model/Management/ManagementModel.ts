//
//管理情報用Model
//
//更新履歴：<br>
//2008/02/27 宝子山浩平 作成
//
//@package Management
//@subpackage Model
//@author houshiyama
//@filesource
//@since 2008/02/27
//@uses ManagementModelBase
//
//
//
//管理情報用Model
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/03/14
//@uses ManagementModelBase
//

require("model/Management/ManagementModelBase.php");

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
//管理種別の配列を取得する
//
//@author houshiyama
//@since 2008/02/27
//
//@access public
//@return array
//
//
//管理種別の配列を取得する（英語）
//
//@author houshiyama
//@since 2008/02/27
//
//@access public
//@return array
//
//
//管理種別の配列を取得する
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $blank
//@access public
//@return array
//
//
//管理種別の配列を取得する（英語）
//
//@author houshiyama
//@since 2008/02/27
//
//@param mixed $blank
//@access public
//@return array
//
//
//一覧データ取得（移動・削除画面用メソッド）
//
//@author houshiyama
//@since 2008/03/17
//
//@param array $H_sess（CGIパラメータ）
//@param mixed $H_trg
//@param array $A_post（部署一覧）
//@access public
//@return void
//
//
//配列の各要素を分解
//
//@author houshiyama
//@since 2008/03/17
//
//@param mixed $H_trg
//@access protected
//@return void
//
//
//電話情報を取得するSQL文のwhere句作成
//
//@author houshiyama
//@since 2008/02/26
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//ETC情報を取得するSQL文のwhere句作成
//
//@author houshiyama
//@since 2008/02/26
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//購買情報を取得するSQL文のwhere句作成
//
//@author houshiyama
//@since 2008/03/18
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//コピー機情報を取得するSQL文のwhere句作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//資産情報を取得するSQL文のwhere句作成
//
//@author houshiyama
//@since 2008/08/24
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//運送情報を取得するSQL文のwhere句作成
//
//@author houshiyama
//@since 2010/02/24
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//EV情報を取得するSQL文のwhere句作成
//
//@author maeda
//@since 2010/08/09
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//ヘルスケア情報を取得するSQL文のwhere句作成
//
//@author houshiyama
//@since 2010/02/24
//
//@param mixed $H_row
//@access protected
//@return array
//
//
//電話一覧取得時のSQL文のselect句作成
//
//@author houshiyama
//@since 2008/02/26
//
//@access protected
//@return array
//
//
//ETC一覧取得時のSQL文のselect句作成
//
//@author houshiyama
//@since 2008/02/27
//
//@access protected
//@return array
//
//
//購買一覧取得時のSQL文のselect句作成
//
//@author houshiyama
//@since 2008/03/18
//
//@access protected
//@return array
//
//
//コピー機一覧取得時のSQL文のselect句作成
//
//@author houshiyama
//@since 2008/05/14
//
//@access protected
//@return array
//
//
//資産一覧取得時のSQL文のselect句作成
//
//@author houshiyama
//@since 2008/08/24
//
//@access protected
//@return array
//
//
//運送一覧取得時のSQL文のselect句作成
//
//@author houshiyama
//@since 2010/02/24
//
//@access protected
//@return array
//
//
//EV一覧取得時のSQL文のselect句作成
//
//@author maeda
//@since 2010/08/09
//
//@access protected
//@return array
//
//
//ヘルスケア一覧取得時のSQL文のselect句作成
//
//@author houshiyama
//@since 2010/02/24
//
//@access protected
//@return array
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
class ManagementModel extends ManagementModelBase {
	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getManagementType() {
		var sql = "select mid,mname_jpn from management_tb order by mid";
		return this.get_db().queryKeyAssoc(sql);
	}

	getManagementTypeEng() {
		var sql = "select mid,mname from management_tb order by mid";
		var H_res = this.get_db().queryKeyAssoc(sql);

		for (var key in H_res) {
			var val = H_res[key];

			if (preg_match("/tel/", val) == true) {
				H_res[key] = "Phone";
			} else if (preg_match("/etc/", val) == true) {
				H_res[key] = "ETC";
			} else if (preg_match("/copy/", val) == true) {
				H_res[key] = "Copy machine";
			} else if (preg_match("/assets/", val) == true) {
				H_res[key] = "Property";
			} else {
				H_res[key] = ucfirst(val);
			}
		}

		return H_res;
	}

	getUsableManagementType(blank = false) {
		if (true == blank) {
			var H_res = {
				"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
			};
		} else {
			H_res = Array();
		}

		H_res = H_res + this.getManagementType();

		if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == false) {
			delete H_res[ManagementModel.TELMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_vw") == false) {
			delete H_res[ManagementModel.ETCMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_vw") == false) {
			delete H_res[ManagementModel.PURCHMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_vw") == false) {
			delete H_res[ManagementModel.COPYMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_vw") == false) {
			delete H_res[ManagementModel.ASSMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_tran_manage_vw") == false) {
			delete H_res[ManagementModel.TRANMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_ev_manage_vw") == false) {
			delete H_res[ManagementModel.EVMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_healthcare_manage_vw") == false) {
			delete H_res[ManagementModel.HEALTHMID];
		}

		return H_res;
	}

	getUsableManagementTypeEng(blank = false) {
		if (true == blank) {
			var H_res = {
				"": "--Please select--"
			};
		} else {
			H_res = Array();
		}

		H_res = H_res + this.getManagementTypeEng();

		if (-1 !== this.A_Auth.indexOf("fnc_tel_manage_vw") == false) {
			delete H_res[ManagementModel.TELMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_etc_manage_vw") == false) {
			delete H_res[ManagementModel.ETCMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_purch_manage_vw") == false) {
			delete H_res[ManagementModel.PURCHMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_copy_manage_vw") == false) {
			delete H_res[ManagementModel.COPYMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_vw") == false) {
			delete H_res[ManagementModel.ASSMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_tran_manage_vw") == false) {
			delete H_res[ManagementModel.TRANMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_ev_manage_vw") == false) {
			delete H_res[ManagementModel.EVMID];
		}

		if (-1 !== this.A_Auth.indexOf("fnc_healthcare_manage_vw") == false) {
			delete H_res[ManagementModel.HEALTHMID];
		}

		return H_res;
	}

	getList(H_sess: {} | any[], H_trg: {} | any[], A_post: {} | any[]) //menuからの値を配列に整形
	//配下の対象が無ければエラー
	{
		this.setTableName(H_sess.cym);
		var A_data = Array();
		var A_rows = this.splitArrrayRow(H_trg);

		for (var cnt = 0; cnt < A_rows.length; cnt++) //選択対象に電話が含まれている時
		{
			if (A_rows[cnt].mid == ManagementModel.TELMID) {
				var A_res = this.get_db().queryRowHash(this.makeTelListSQL(A_post, A_rows[cnt]));
			} else if (A_rows[cnt].mid == ManagementModel.ETCMID) {
				A_res = this.get_db().queryRowHash(this.makeEtcListSQL(A_post, A_rows[cnt]));
			} else if (A_rows[cnt].mid == ManagementModel.PURCHMID) {
				A_res = this.get_db().queryRowHash(this.makePurchListSQL(A_post, A_rows[cnt]));
			} else if (A_rows[cnt].mid == ManagementModel.COPYMID) {
				A_res = this.get_db().queryRowHash(this.makeCopyListSQL(A_post, A_rows[cnt]));
			} else if (A_rows[cnt].mid == ManagementModel.ASSMID) {
				A_res = this.get_db().queryRowHash(this.makeAssetsListSQL(A_post, A_rows[cnt]));
			} else if (A_rows[cnt].mid == ManagementModel.TRANMID) {
				A_res = this.get_db().queryRowHash(this.makeTranListSQL(A_post, A_rows[cnt]));
			} else if (A_rows[cnt].mid == ManagementModel.EVMID) {
				A_res = this.get_db().queryRowHash(this.makeEvListSQL(A_post, A_rows[cnt]));
			} else if (A_rows[cnt].mid == ManagementModel.HEALTHMID) {
				A_res = this.get_db().queryRowHash(this.makeHealthListSQL(A_post, A_rows[cnt]));
			}

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
				A_line.mid = A_tmp[1];
				A_line.coid = A_tmp[2];
				A_line.manageno = A_tmp[3];
				A_rows.push(A_line);
			}
		}

		return A_rows;
	}

	makeTelWhereSQL(H_row) {
		var sql = " and " + "te.telno='" + H_row.manageno + "'" + " and " + "te.carid=" + H_row.coid;
		return sql;
	}

	makeEtcWhereSQL(H_row) {
		var sql = " and " + "ca.cardno='" + H_row.manageno + "'" + " and " + "ca.delete_flg=false";

		if (is_numeric(H_row.coid) == true) {
			sql += " and " + "ca.cardcoid=" + H_row.coid;
		}

		return sql;
	}

	makePurchWhereSQL(H_row) {
		var sql = " and " + "pu.purchid='" + H_row.manageno + "'" + " and " + "pu.purchcoid=" + H_row.coid + " and " + "pu.delete_flg=false";
		return sql;
	}

	makeCopyWhereSQL(H_row) {
		var sql = " and " + "co.copyid='" + H_row.manageno + "'" + " and " + "co.copycoid=" + H_row.coid + " and " + "co.delete_flg=false";
		return sql;
	}

	makeAssetsWhereSQL(H_row) {
		var sql = " and " + "ass.assetsid=" + H_row.coid + " and " + "ass.delete_flg=false";
		return sql;
	}

	makeTranWhereSQL(H_row) {
		var sql = " and " + "tr.tranid='" + H_row.manageno + "'" + " and " + "tr.trancoid=" + H_row.coid + " and " + "tr.delete_flg=false";
		return sql;
	}

	makeEvWhereSQL(H_row) {
		var sql = " and " + "ev.evid='" + H_row.manageno + "'" + " and " + "ev.evcoid=" + H_row.coid + " and " + "ev.delete_flg=false";
		return sql;
	}

	makeHealthWhereSQL(H_row) {
		var sql = " and " + "hlt.healthid='" + H_row.manageno + "'" + " and " + "hlt.healthcoid=" + H_row.coid + " and " + "hlt.delete_flg=false";
		return sql;
	}

	makeTelSelectSQL() {
		var A_col = ["te.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "te.telno as manageno", "te.telno_view as manageno_view", "te.carid as coid", "carrier_tb.carname as contract", "carrier_tb.carname_eng as contract_eng", "circuit_tb.cirname as note", "circuit_tb.cirname_eng as note_eng", ManagementModel.TELMID + " as mid", "'\u96FB\u8A71' as mtype", "'Phone' as mtype_eng", "coalesce(te.username,'') as username", "te.contractdate", "ass.assetsid", "coalesce(tra.main_flg,true) as main_flg", "te.webreliefservice"];
		return A_col.join(",");
	}

	makeEtcSelectSQL() {
		var A_col = ["ca.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "ca.cardno as manageno", "ca.cardno_view as manageno_view", "ca.cardcoid as coid", "coalesce(card_co_tb.cardconame,'') as contract", "coalesce(card_co_tb.cardconame,'') as contract_eng", "coalesce(ca.card_corpno,'') as note", "coalesce(ca.card_corpno,'') as note_eng", ManagementModel.ETCMID + " as mid", "'ETC' as mtype", "'ETC' as mtype_eng", "coalesce(ca.username,'') as username", "null as contractdate", "null", "true as main_flg", "null"];
		return A_col.join(",");
	}

	makePurchSelectSQL() {
		var A_col = ["pu.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "pu.purchid as manageno", "pu.purchid as manageno_view", "pu.purchcoid as coid", "coalesce(purchase_co_tb.purchconame,'') as contract", "coalesce(purchase_co_tb.purchconame,'') as contract_eng", "coalesce(pu.registcomp,'') as note", "coalesce(pu.registcomp,'') as note_eng", ManagementModel.PURCHMID + " as mid", "'\u8CFC\u8CB7' as mtype", "'Purchase' as mtype_eng", "coalesce(pu.username,'') as username", "pu.registdate as contractdate", "null", "true as main_flg", "null"];
		return A_col.join(",");
	}

	makeCopySelectSQL() {
		var A_col = ["co.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "co.copyid as manageno", "co.copyid as manageno_view", "co.copycoid as coid", "coalesce(copy_co_tb.copyconame,'') as contract", "coalesce(copy_co_tb.copyconame,'') as contract_eng", "coalesce(co.copyname,'') as note", "coalesce(co.copyname,'') as note_eng", ManagementModel.COPYMID + " as mid", "'\u30B3\u30D4\u30FC\u6A5F' as mtype", "'Copy machine' as mtype_eng", "coalesce(co.username,'') as username", "null as contractdate", "null", "true as main_flg", "null"];
		return A_col.join(",");
	}

	makeAssetsSelectSQL() {
		var A_col = ["ass.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "ass.assetsno as manageno", "ass.assetsno as manageno_view", "ass.assetsid as coid", "null as contract", "null as contract_eng", "coalesce(product_tb.productname,'') as note", "coalesce(product_tb.productname,'') as note_eng", ManagementModel.ASSMID + " as mid", "'\u8CC7\u7523' as mtype", "'Property' as mtype_eng", "coalesce(ass.username,'') as username", "null as contractdate", "null", "true as main_flg", "null"];
		return A_col.join(",");
	}

	makeTranSelectSQL() {
		var A_col = ["tr.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "tr.tranid as manageno", "tr.tranid as manageno_view", "tr.trancoid as coid", "coalesce(transit_co_tb.tranconame,'') as contract", "coalesce(transit_co_tb.tranconame,'') as contract_eng", "null as note", "null as note_eng", ManagementModel.TRANMID + " as mid", "'\u904B\u9001' as mtype", "'Transit' as mtype_eng", "coalesce(tr.username,'') as username", "null as contractdate", "null", "true as main_flg", "null"];
		return A_col.join(",");
	}

	makeEvSelectSQL() {
		var A_col = ["ev.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "ev.evid as manageno", "ev.evid as manageno_view", "ev.evcoid as coid", "coalesce(ev_co_tb.evconame,'') as contract", "coalesce(ev_co_tb.evconame,'') as contract_eng", "null as note", "null as note_eng", ManagementModel.EVMID + " as mid", "'EV' as mtype", "'EV' as mtype_eng", "coalesce(ev.username,'') as username", "null as contractdate", "null", "true as main_flg", "null"];
		return A_col.join(",");
	}

	makeHealthSelectSQL() {
		var A_col = ["hlt.postid", this.H_Tb.post_tb + ".postname", this.H_Tb.post_tb + ".userpostid", "hlt.healthid as manageno", "hlt.healthid as manageno_view", "hlt.healthcoid as coid", "coalesce(healthcare_co_tb.healthconame,'') as contract", "coalesce(healthcare_co_tb.healthconame,'') as contract_eng", "null as note", "null as note_eng", ManagementModel.HEALTHMID + " as mid", "'\u30D8\u30EB\u30B9\u30B1\u30A2' as mtype", "'Healthcare' as mtype_eng", "coalesce(hlt.username,'') as username", "null as contractdate", "null", "true as main_flg", "null"];
		return A_col.join(",");
	}

	__destruct() {
		super.__destruct();
	}

};