//
//注文雛型変更Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/07/17
//@uses OrderModel
//@uses OrderUtil
//
//
//
//注文雛型変更Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/07/17
//

require("TemplateAddModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//雛型データ取得
//
//@author miyazawa
//@since 2008/07/17
//
//@param int $tempid
//@access public
//@return array
//
//
//雛型の削除
//
//@author maeda
//@since 2008/08/19
//
//@param mixed $tempid 雛型ＩＤ
//@access public
//@return 成功:true、失敗:false
//
//
//renameFjpCode
//
//@author igarashi
//@since 2011/06/07
//
//@param mixed $H_default
//@access public
//@return void
//
//
//changeTemplate
//
//@author web
//@since 2012/10/02
//
//@param mixed $H_sess
//@access public
//@return void
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
class TemplateModModel extends TemplateAddModel {
	constructor(O_db0, H_g_sess, site_flg = OrderModelBase.SITE_USER) //mt_template_tbの名前の決定
	{
		super(O_db0, H_g_sess, site_flg);
		this.m_tb = Array();
		var sess = MtSession.singleton();
		var sessL = sess.getPub("/MTTemplate");
		var tbname = "";

		if (!is_null(sessL.division_pattern) && "" != sessL.division_pattern) {
			tbname = "_" + sessL.division_pattern;
		}

		this.m_tb.mt_template_tb = "mt_template" + tbname + "_tb";
	}

	getTemplateData(tempid) //$sess = MtSession::singleton();
	//		$sessL = $sess->getPub('/MTTemplate');
	//		$tbname = "";
	//		if (!is_null($sessL["division_pattern"]) && "" != $sessL["division_pattern"])
	//		{
	//			$tbname = "_" . $sessL["division_pattern"];
	//		}
	//		
	//		$sql = "SELECT tempid, type, carid, arid, cirid, tempname, mask, value, product, free_acce, defflg, postid FROM mt_template".$tbname."_tb WHERE tempid=" . $tempid . " AND pactid=" . $this->H_G_Sess["pactid"];
	{
		var sql = "SELECT tempid, type, carid, arid, cirid, tempname, mask, value, product, free_acce, defflg, postid FROM " + this.m_tb.mt_template_tb + " WHERE tempid=" + tempid + " AND pactid=" + this.H_G_Sess.pactid;
		return this.get_DB().queryRowHash(sql);
	}

	delTemplateData(tempid) //パラメータチェック
	//削除成功
	{
		if ("" == +tempid) {
			return false;
		}

		var sess = MtSession.singleton();
		var sessL = sess.getPub("/MTTemplate");
		var tbname = "";

		if (!is_null(sessL.division_pattern) && "" != sessL.division_pattern) {
			tbname = "_" + sessL.division_pattern;
		}

		var sql = "delete from mt_template" + tbname + "_tb " + "where tempid = " + tempid;
		var rtn = this.getDB().exec(sql);

		if (PEAR.isError(rtn) == false && 1 == rtn) //削除失敗
			{
				return true;
			} else {
			return false;
		}
	}

	renameFjpCode(H_default) {
		if (undefined !== H_default.pbpostcode) {
			H_default.h_pbpostcode = H_default.pbpostcode;
		}

		if (undefined !== H_default.cfbpostcode) {
			H_default.h_cfbpostcode = H_default.cfbpostcode;
		}
	}

	changeTemplate(H_sess) {
		var result = H_sess;

		if (undefined !== result[TemplateModModel.PUB].carid && undefined !== result[TemplateModModel.PUB].tempid) {
			if (this.O_Set.car_other == result[TemplateModModel.PUB].carid) {
				var sql = "SELECT " + "carid, cirid, ppid" + " FROM " + this.m_tb.mt_template_tb + " WHERE " + "tempid=" + this.get_DB().dbQuote(result[TemplateModModel.PUB].tempid, "int", true);
				var info = this.get_DB().queryRowHash(sql);
				result[TemplateModModel.PUB].carid = info.carid;
				result[TemplateModModel.PUB].cirid = info.cirid;
				result[TemplateModModel.PUB].ppid = info.ppid;
				result.SELF.kind = "N-" + info.carid + "-" + info.cirid + "-" + info.ppid;
			}
		}

		return result;
	}

	__destruct() {
		super.__destruct();
	}

};