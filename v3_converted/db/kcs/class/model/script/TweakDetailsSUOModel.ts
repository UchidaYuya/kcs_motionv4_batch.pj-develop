//
//SUO割引額調整(model)
//
//更新履歴：<br>
//2008/03/31
//
//@uses TweakModel
//@uses MtTableUtil
//@uses MtPostUtil
//@uses MtDBUtil
//@uses MtOutput
//@uses MtSetting
//@uses PostModel
//@uses TelModel
//@package SUO
//@subpackage Model
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/31
//
//
//
//SUO割引額調整(model)
//
//@uses TweakModel
//@uses MtTableUtil
//@uses MtPostUtil
//@uses MtDBUtil
//@uses MtOutput
//@uses MtSetting
//@uses PostModel
//@uses TelModel
//@package SUO
//@subpackage Model
//@author ishizaki
//@since 2008/03/31
//

require("model/TweakModel.php");

require("model/TelModel.php");

require("MtTableUtil.php");

require("MtPostUtil.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("MtSetting.php");

require("model/PostModel.php");

//
//コンストラクト
//
//@author ishizaki
//@since 2008/03/07
//
//@access public
//@return void
//
//
//docomoの割引額調整対象コードを含む電話番号の一覧を返す
//
//@author ishizaki
//@since 2008/07/28
//
//@param mixed $pactid
//@param mixed $yyyymm
//@access public
//@return void
//
//
//引数の番号に同じく引数で渡されたコードのマイナス金額の一覧を取得
//
//@author ishizaki
//@since 2008/07/28
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $telno
//@param mixed $docomo_code
//@access public
//@return void
//
//
//sumChargeDocomoBasecode
//
//@author ishizaki
//@since 2008/07/28
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $telno
//@param mixed $docomo_code
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
class TweakDetailsSUOModel extends TweakModel {
	constructor(O_msa: ?MtScriptAmbient = undefined) {
		super(O_msa);
	}

	tweakTellistOfBaseDocomo(pactid, yyyymm) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var A_corp_cd = this.getTweakableCorpCd(pactid, this.getSetting().car_docomo);
		var sql = "SELECT telno FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND (code IN('" + this.getSetting().A_suo_docomo_basecode.join("','") + "') AND charge < 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM " + tel_tb + " " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL AND " + post_tb + ".pint1 IN (" + A_corp_cd.join(", ") + ")) GROUP BY telno ORDER BY telno";
		this.infoOut("\u5B9F\u884C:tweakTellistOfBaseDocomo:" + pactid + ":" + yyyymm, 0);
		this.infoOut(sql, 0);
		return this.get_DB().queryCol(sql);
	}

	searchTagetcodeDocomo(pactid, yyyymm, telno, docomo_code) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getSetting().car_docomo + " AND " + "code = " + this.getDB().dbQuote(docomo_code, "text", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true) + " AND " + "charge < 0";
		this.infoOut("\u5B9F\u884C:searchTagetcodeDocomo:" + pactid + ":" + yyyymm + ":" + telno + ":" + docomo_code, 0);
		this.infoOut(sql, 0);
		return this.getDB().queryHash(sql);
	}

	sumChargeDocomoBasecode(pactid, yyyymm, telno, docomo_code) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT SUM(charge) AS charge FROM " + tel_details_tb + " " + "WHERE " + "pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " AND " + "carid = " + this.getSetting().car_docomo + " AND " + "code = " + this.getDB().dbQuote(docomo_code, "text", true) + " AND " + "telno = " + this.getDB().dbQuote(telno, "text", true) + " AND " + "charge >= 0";
		this.infoOut("\u5B9F\u884C:sumChargeDocomoBasecode:" + pactid + ":" + yyyymm + ":" + telno + ":" + docomo_code, 0);
		this.infoOut(sql, 0);
		return this.getDB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};