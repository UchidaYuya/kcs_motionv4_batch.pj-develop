//
//注文雛型更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/07/16
//@uses OrderModifyModel
//
//
//
//注文雛型更新用Model
//
//@uses OrderModifyModel
//@package Order
//@author miyazawa
//@since 2008/07/16
//

require("OrderModifyModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//INSERT実行
//
//@author miyazawa
//@since 2008/04/01
//
//@param mixed $H_sess
//@param mixed $H_data
//@access public
//@return
//
//
//UPDATE実行
//
//@author miyazawa
//@since 2008/04/01
//
//@param mixed $H_sess
//@param mixed $H_data
//@access public
//@return
//
//
//部署の規定雛型フラグ削除実行
//
//@author miyazawa
//@since 2009/02/04
//
//@param mixed $H_sess
//@param mixed $H_data
//@access public
//@return
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class TemplateModifyModel extends OrderModifyModel {
	constructor(O_db0, H_g_sess, site_flg = OrderModelBase.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	insertTemplate(H_sess: {} | any[], H_data: {} | any[]) {
		var sess = MtSession.singleton();
		var sessL = sess.getPub("/MTTemplate");
		var tbname = "";

		if (!is_null(sessL.division_pattern) && "" != sessL.division_pattern) {
			tbname = "_" + sessL.division_pattern;
		}

		var ins_sql = "INSERT INTO mt_template" + tbname + "_tb(" + "pactid,\n\t\t\t\t\t\t\t carid,\n\t\t\t\t\t\t\t type,\n\t\t\t\t\t\t\t cirid,\n\t\t\t\t\t\t\t ppid,\n\t\t\t\t\t\t\t tempname,\n\t\t\t\t\t\t\t mask,\n\t\t\t\t\t\t\t value,\n\t\t\t\t\t\t\t product,\n\t\t\t\t\t\t\t free_acce,\n\t\t\t\t\t\t\t defflg,\n\t\t\t\t\t\t\t recdate,\n\t\t\t\t\t\t\t postid) " + "VALUES(" + this.H_G_Sess.pactid + "," + H_sess[TemplateModifyModel.PUB].carid + ",'" + H_sess[TemplateModifyModel.PUB].type + "'," + H_sess[TemplateModifyModel.PUB].cirid + "," + H_sess[TemplateModifyModel.PUB].ppid + ",'" + H_sess.SELF.tempname + "','" + H_data.mask + "','" + addslashes(H_data.value) + "','" + H_data.product + "','" + H_data.free_acce + "'," + H_sess.SELF.deftemp + ",'" + MtDateUtil.getNow() + "'," + H_sess.SELF.recogpostid + ")";
		return this.get_DB().query(ins_sql);
	}

	updateTemplate(H_sess: {} | any[], H_data: {} | any[]) {
		var sess = MtSession.singleton();
		var sessL = sess.getPub("/MTTemplate");
		var tbname = "";

		if (!is_null(sessL.division_pattern) && "" != sessL.division_pattern) {
			tbname = "_" + sessL.division_pattern;
		}

		var upd_sql = "UPDATE mt_template" + tbname + "_tb SET " + "tempname='" + H_sess.SELF.tempname + "'," + "mask='" + H_data.mask + "'," + "carid=" + this.get_DB().dbQuote(H_sess[TemplateModifyModel.PUB].carid, "integer", true) + "," + "cirid=" + this.get_DB().dbQuote(H_sess[TemplateModifyModel.PUB].cirid, "integer", true) + "," + "value='" + addslashes(H_data.value) + "'," + "product='" + H_data.product + "'," + "free_acce='" + H_data.free_acce + "'," + "defflg=" + H_sess.SELF.deftemp + "," + "recdate='" + MtDateUtil.getNow() + "'," + "postid=" + H_sess.SELF.recogpostid + " " + "WHERE tempid = " + H_sess[TemplateModifyModel.PUB].tempid;
		return this.get_DB().query(upd_sql);
	}

	clearTemplateDefault(H_sess: {} | any[]) //defflgだけではなくmt_templatE_tb.valueの中のdeftempも消さなければならない！ 20090316miya
	{
		var sql = "SELECT tempid, value FROM mt_template_tb " + "WHERE postid = " + H_sess.SELF.recogpostid + " " + "AND type='" + H_sess[TemplateModifyModel.PUB].type + "' " + "AND carid=" + H_sess[TemplateModifyModel.PUB].carid + " " + "AND cirid=" + H_sess[TemplateModifyModel.PUB].cirid;
		var H_temp = this.get_DB().queryHash(sql);

		if (true == Array.isArray(H_temp)) {
			var upd_sql = "";

			for (var key in H_temp) {
				var val = H_temp[key];
				var value_str = "";
				var H_value = unserialize(val.value);

				if (1 == H_value.deftemp) //SQLを溜めておいてまとめて実行
					{
						H_value.deftemp = 0;
						value_str = serialize(H_value);
						upd_sql += "UPDATE mt_template_tb SET value='" + value_str + "' WHERE tempid=" + val.tempid + ";";
					}
			}

			if ("" != upd_sql) {
				this.get_DB().query(upd_sql);
			}
		}

		sql = "UPDATE mt_template_tb SET " + "defflg=0 " + "WHERE postid = " + H_sess.SELF.recogpostid + " " + "AND type='" + H_sess[TemplateModifyModel.PUB].type + "' " + "AND carid=" + H_sess[TemplateModifyModel.PUB].carid + " " + "AND cirid=" + H_sess[TemplateModifyModel.PUB].cirid;
		return this.get_DB().query(sql);
	}

	__destruct() {
		super.__destruct();
	}

};