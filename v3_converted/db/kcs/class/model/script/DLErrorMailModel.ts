//
//請求DLエラーメール
//
//更新履歴：<br>
//2009/07/03 宮澤 作成
//
//@package script
//@subpackage Model
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/07/03
//
//
//顧客毎にクランプ情報を管理する権限
//
//価格表お知らせメール
//
//@package Shop
//@subpackage Model
//@author miyazawa
//@since 2009/07/03
//

require("model/ModelBase.php");

require("MtDateUtil.php");

const FNCID_PACT_CLAMP = 205;

//
//コンストラクト
//
//@author miyazawa
//@since 2009/07/03
//
//@access public
//@return void
//
//
//getPactlistOfPricetype
//
//@author miyazawa
//@since 2009/07/03
//
//@access public
//@return array
//
//
//getShopSUMail
//
//@author miyazawa
//@since 2009/07/03
//
//@param int $shopid
//@access public
//@return array
//
//
//getShopSUName
//
//@author miyazawa
//@since 2009/07/03
//
//@param int $shopid
//@access public
//@return array
//
//
//getRelPostid
//
//@author miyazawa
//@since 2009/07/03
//
//@param int $shopid
//@access public
//@return array
//
//
//エラーステータスの更新
//
//@author miyazawa
//@since 2009/07/03
//
//@param mixed $H_status
//@access public
//@return void
//
//
//ログイン情報が手動入力されたキャリアと顧客IDの取得
//
//@author morihara
//@sinse 2010/11/29
//
//@access public
//@return array
//
//
//ログイン情報が手動入力された顧客の管理者メールアドレスの取得
//
//@author morihara
//@sinse 2010/11/29
//
//@access public
//@return array
//
//
//デストラクト　親のを呼ぶだけ
//
//@author miyazawa
//@since 2009/07/03
//
//@access public
//@return void
//
class DLErrorMailModel extends ModelBase {
	constructor() {
		super();
	}

	getDLErrorList() //その会社・キャリアの担当販売店ID、会社のタイプ（M/H）も一緒に取得する
	{
		var sql = "SELECT cl.pactid, cl.carid, cl.error_type, cl.message, cl.recdate, rs.shopid, pa.type, pa.compname, ca.carname";
		sql += " FROM clamp_error_tb cl LEFT JOIN pact_rel_shop_tb rs ON cl.pactid=rs.pactid AND cl.carid=rs.carid";
		sql += " INNER JOIN pact_tb pa ON cl.pactid=pa.pactid";
		sql += " INNER JOIN carrier_tb ca ON cl.carid=ca.carid";
		sql += " WHERE is_send = FALSE ORDER BY pactid, carid, recdate";
		return this.getDB().queryHash(sql);
	}

	getDLErrorMemMail(shopid) //ショップ代表の送信先アドレスを得る
	{
		var sql = "SELECT mem.mail FROM shop_member_tb mem INNER JOIN shop_tb sh ON mem.memid=sh.memid WHERE mem.type='SU' AND mem.shopid=" + shopid;
		return this.getDB().queryOne(sql);
	}

	getDLErrorMemName(pactid, postid, shopid, carid) //ショップ代表の送信先担当者名を得る
	{
		var sql = "SELECT name FROM shop_member_tb mem INNER JOIN shop_relation_tb rel ON mem.shopid=rel.shopid AND mem.memid=rel.memid";
		sql += " WHERE rel.pactid=" + pactid;
		sql += " AND rel.postid=" + postid;
		sql += " AND rel.shopid=" + shopid;
		sql += " AND rel.carid=" + carid;
		return this.getDB().queryOne(sql);
	}

	getRelPostid(pactid, shopid, carid, level) //$levelで指定した階層の、そのショップに関連付けられた部署IDを一つだけ取得
	{
		var sql = "SELECT postidparent,level FROM post_relation_tb WHERE pactid=" + pactid;
		sql += " AND postidparent IN (SELECT postid FROM shop_relation_tb WHERE shopid=" + shopid + " AND pactid=" + pactid + " AND carid=" + carid + ")";
		sql += " AND level=" + level;
		return this.getDB().queryOne(sql);
	}

	updateErrorStatus(H_status = Array()) {
		if (true == 0 < H_status.length) {
			var sql = "";
			var now = MtDateUtil.getNow();

			for (var val of Object.values(H_status)) {
				sql = "UPDATE clamp_error_tb SET is_send=true, fixdate = '" + now + "'";
				sql += " WHERE is_send=false AND pactid=" + val.pactid + " AND carid=" + val.carid + " AND error_type='" + val.error_type + "' AND message='" + val.message + "';";
				this.getDB().exec(sql);
			}
		}
	}

	getHandInfo() {
		var sql = "select pactid,carid from clamp_tb" + " where pactid in (" + " select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + ")" + " order by pactid,carid" + ";";
		var result = this.getDB().queryHash(sql);
		var H_rval = Array();

		for (var H_line of Object.values(result)) {
			var carid = H_line.carid;
			var pactid = H_line.pactid;
			if (!(undefined !== H_rval[pactid])) H_rval[pactid] = Array();
			if (!(-1 !== H_rval[pactid].indexOf(carid))) H_rval[pactid].push(carid);
		}

		return H_rval;
	}

	getHandAddr() {
		var sql = "select pactid,mail from user_tb" + " where type='SU'" + " and pactid in (" + " select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + " )" + " order by pactid,userid" + ";";
		var result = this.getDB().queryHash(sql);
		var H_rval = Array();

		for (var H_line of Object.values(result)) {
			var addr = H_line.mail;
			var pactid = H_line.pactid;
			if (!addr.length) continue;
			if (!(undefined !== H_rval[pactid])) H_rval[pactid] = Array();
			if (!(-1 !== H_rval[pactid].indexOf(addr))) H_rval[pactid].push(addr);
		}

		return H_rval;
	}

	__destruct() {
		super.__destruct();
	}

};