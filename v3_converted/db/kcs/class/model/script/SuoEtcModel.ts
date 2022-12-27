//
//SUOETC取込基底
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/25
//
//
//
//SUOETC取込基底
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/25
//

require("MtTableUtil.php");

require("MtPostUtil.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("MtSetting.php");

require("model/ModelBase.php");

//
//MtScriptAmbient 型のメンバー変数
//
//@var MtScriptAmbient
//@access protected
//
//
//対象年月
//
//@var string
//@access private
//
//
//コンストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@return void
//
//
//対象pactid,caridから、引数で渡された請求年月のpointflagがtrueのものを取得
//
//つまり、ドコモのポイント対象請求で他の取得
//
//@author ishizaki
//@since 2008/04/08
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $carid
//@access public
//@return void
//
//
//対象キャリアの tel_details_tb に入っている電話番号の一覧
//
//@author ishizaki
//@since 2008/04/08
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $carid
//@access public
//@return array
//
//
//tel_details_tb から対象となるレコードを削除
//
//@author ishizaki
//@since 2008/04/08
//
//@param integer $pactid
//@param string $yyyymm
//@param integer $carid
//@param array $H_value
//@access public
//@return integer
//
//
//auの引数で渡された請求年月日の各電話の請求金額を取得
//
//@author ishizaki
//@since 2008/04/09
//
//@param mixed $pactid
//@param mixed $yyyymm
//@param mixed $carid
//@access public
//@return void
//
//
//金額、プランに応じて対応ステージを返す
//
//@author ishizaki
//@since 2008/04/22
//
//@param mixed $charge
//@param mixed $pranid
//@access public
//@return void
//
//
//割引額調整の設定情報を返す
//
//@author ishizaki
//@since 2008/04/02
//
//@param integer $pactid
//@access public
//@return array
//
//
//指定した PactID, YYYYMMに該当する請求情報の一覧を取得
//
//@author ishizaki
//@since 2008/04/03
//
//@param integer $pactid
//@param integer $carid
//@param string $yyyymm
//@access public
//@return array
//
//
//指定した PactID, YYYYMMに該当する請求情報の一覧を削除
//
//@author ishizaki
//@since 2008/04/04
//
//@param integer $pactid
//@param integer $carid
//@param string $yyyymm
//@access public
//@return integer
//
//
//調整後のデータを更新する
//
//更新が成功するとtrue
//
//@author ishizaki
//@since 2008/04/04
//
//@param string $yyyymm
//@param array $A_details
//@access public
//@return boolean
//
//
//指定した電話番号が指定年月にどの会社CDの傘下に属していたかを調べる
//
//$yyyymmより、tableNoを算出し、対応するtel_tbかpostidを抜き出し、<br>
//部署名とcocdを取得する。
//
//@author ishizaki
//@since 2008/04/03
//
//@param integer $pactid
//@param string $telno
//@param integer $carid
//@param string $yyyymm
//@access public
//@return array
//
//
//ユーザの所属する部署の会社CDを返す
//
//@author ishizaki
//@since 2008/04/11
//
//@param mixed $pactid
//@param mixed $userid
//@access public
//@return boolean
//
//
//ユーザが所属している部署のXX(Level)階層の部署IDを取得
//
//@author ishizaki
//@since 2008/04/11
//
//@param integer $pactid
//@param integer $userid
//@param integer $level
//@access public
//@return void
//
//
//受け取った引数の電話番号が、その請求年月のときに所属した部署IDを返す
//
//@author ishizaki
//@since 2008/04/08
//
//@param integer $pactid
//@param text $telno
//@param integer $carid
//@param text $yyyymm
//@access public
//@return integer
//
//
//指定した電話のポイントステージの取得
//
//@author ishizaki
//@since 2008/04/08
//
//@param mixed $pactid
//@param mixed $telno
//@param mixed $carid
//@param mixed $yyyymm
//@access public
//@return void
//
//
//指定された請求月のデータが存在するかのチェック
//
//@author ishizaki
//@since 2008/04/10
//
//@param integer $pactid
//@param string $yyyymm
//@access public
//@return boolean
//
//
//SUO 会社CDの入っていない部署に登録されている電話の有無（確認）
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@return array
//
//
//SUO ドコモの各電話ごとの基本料合計の一覧
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@return array
//
//
//SUO ドコモの基本料割引額調整
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@return array
//
//
//SUO au請求情報取得
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $A_tellist
//@return array
//
//
//SUO auの消費税取得
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $A_tellist
//@return array
//
//
//SUO ドコモの消費税取得
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@return array
//
//
//SUO auの再計算した消費税の取得
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $A_tellist
//@return array
//
//
//SUO auの再計算した合計金額の所得
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $A_tellist
//@return array
//
//
//SUO auの合計項目を取得
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $A_tellist
//@return array
//
//
//SUO ドコモの再計算した消費税の取得
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@return array
//
//
//SUO ドコモの再計算した消費税の取得（個別税区分）
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@return array
//
//
//SUO ドコモの不要な消費税削除
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $H_value
//@return array
//
//
//SUO auの不要な消費税削除
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $H_value
//@return array
//
//
//SUO ドコモの消費税更新
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $H_value
//@return array
//
//
//SUO ドコモの消費税更新
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $H_value
//@return array
//
//
//SUO ドコモの基本料割引額調整の更新
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $H_value
//@return array
//
//
//SUO auの基本料割引額調整の更新
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $H_value
//@return array
//
//
//SUO auの合計金額の更新
//
//@author ishizaki
//@since 2008/04/01
//
//@access public
//@param integer $pactid
//@param string $yyyymm
//@param array $H_value
//@return array
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
class SuoEtcModel extends ModelBase {
	constructor(O_msa: ?MtScriptAmbient = undefined) {
		super();
		this.O_MtScriptAmbient = O_msa;
	}

	getTelDetailsPointflag(pactid, yyyymm, carid) {
		return this.O_TelModel.getTelDetailsPointflagCar(pactid, yyyymm, carid);
	}

	tweakDetailsTelno(pactid, yyyymm, carid) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + carid + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		return this.get_DB().queryHash(sql);
	}

	tweakDeleteRecode(pactid, yyyymm, carid, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + carid + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	getTelDetailsPointAU(pactid, yyyymm, carid) {
		return this.O_TelModel.getTelDetailsPointAU(pactid, yyyymm, carid);
	}

	getAuStage(charge, planid) //PacketWIN
	{
		if (true == (-1 !== this.getSetting().A_packet_win_single.indexOf(planid))) {
			return this.getSetting().suo_au_stage1;
		}

		if (charge >= this.getSetting().suo_au_stagecharge1 && charge < this.getSetting().suo_au_stagecharge2) {
			return this.getSetting().suo_au_stage2;
		} else if (charge >= this.getSetting().suo_au_stagecharge2) {
			return this.getSetting().suo_au_stage3;
		} else {
			return this.getSetting().suo_au_stage1;
		}
	}

	getTweakConf(pactid) {
		var A_conf = this.get_DB().queryHash("SELECT * FROM tweak_config_tb WHERE pactid = " + pactid);
		var H_conf = Array();

		for (var value of Object.values(A_conf)) {
			var corp_cd = value.corp_cd;
			delete value.pactid;
			delete value.corp_cd;
			H_conf[corp_cd] = value;
		}

		if (1 > H_conf.length) {
			return false;
		}

		return H_conf;
	}

	getTelDetails(pactid, carid, yyyymm) {
		var addsql = " AND carid = " + carid + " ORDER BY telno, detailno ";
		return this.O_TelModel.getTelDetailsData(pactid, yyyymm, addsql);
	}

	delTelDetails(pactid, carid, yyyymm) {
		var addsql = " AND carid = " + carid;
		return this.O_TelModel.delTelDetailsData(pactid, yyyymm, addsql);
	}

	copyInsertTelDetails(yyyymm, A_details) {
		return this.O_TelModel.insertCopyTelDetailsData(yyyymm, A_details);
	}

	getCOCDofTel(pactid, telno, carid, yyyymm) {
		var postid = this.getTelPostid(pactid, telno, carid, yyyymm);

		if (false == postid) {
			return false;
		}

		postid = this.get_DB().dbQuote(postid, "integer", true);
		var sql = "SELECT postname, pint1 AS cocd FROM " + MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm)) + " WHERE postid = " + postid;
		var A_tmp = this.get_DB().queryHash(sql);
		H_tmp.postname = A_tmp[0].postname;
		H_tmp.cocd = A_tmp[0].cocd;
		return H_tmp;
	}

	checkViewPointOfPost(pactid, userid) //Tweakの設定取得
	//対応会社CDのポイントフラグがセットされていなかったらfalse
	{
		var level = this.getSetting().suo_cd_post_level;
		var postid = this.getPostidOfUser(pactid, userid, level);

		if (false == postid) {
			for (var cnt = level - 1; cnt >= 0; cnt--) {
				postid = this.getPostidOfUser(pactid, userid, cnt);

				if (false != postid) {
					level = cnt;
					break;
				}
			}
		}

		if (level == 0) {
			return true;
		}

		var sql = "SELECT pint1 AS cocd FROM post_tb WHERE postid =" + postid;
		var cocd = this.get_DB().queryOne(sql);
		var A_conf = this.getTweakConf(pactid);

		if (false == (undefined !== A_conf[cocd].point_mng)) {
			return false;
		}

		return A_conf[cocd].point_mng;
	}

	getPostidOfUser(pactid, userid, level = undefined) {
		if (true == is_null(level)) {
			level = this.getSetting().suo_cd_post_level;
		}

		var post = new MtPostUtil();
		return post.getTargetLevelPostidFromUser(userid, pactid, level);
	}

	getTelPostid(pactid, telno, carid, yyyymm) {
		var post = new MtPostUtil();
		return post.getTargetLevelPostidFromTel(telno, pactid, carid, this.getSetting().suo_cd_post_level, MtTableUtil.getTableNo(yyyymm));
	}

	getTelAddPoint(pactid, telno, carid, yyyymm) {
		return this.O_TelModel.getTelAddPoint(pactid, telno, carid, yyyymm);
	}

	checkTweakPointTbData(pactid, yyyymm) {
		yyyymm = date("Y-m-d", mktime(0, 0, 0, yyyymm.substr(4, 2), 1, yyyymm.substr(0, 4)));
		var sql = "SELECT tp.postid FROM tweak_point_tb tp WHERE pactid = " + this.getDB().dbQuote(pactid, "integer") + " AND billdate = " + this.getDB().dbQuote(yyyymm, "date");

		if (0 < this.getDB().queryHash(sql).length) {
			return true;
		}

		return false;
	}

	insertThisPoint(pactid, yyyymm, H_data) {
		yyyymm = date("Y-m-d", mktime(0, 0, 0, yyyymm.substr(4, 2), 1, yyyymm.substr(0, 4)));
		var now = this.getDB().getNow();
		var sql = "INSERT INTO tweak_point_tb(" + "pactid," + "postid," + "billdate," + "d_thispoint," + "d_usedpoint," + "d_allpoint," + "au_thispoint," + "au_usedpoint," + "au_allpoint," + "recdate," + "fixdate" + ") VALUES(" + this.getDB().dbQuote(pactid, "integer") + "," + "?," + this.getDB().dbQuote(yyyymm, "date") + "," + "?," + "0," + "0," + "?," + "0," + "0," + this.getDB().dbQuote(now, "timestamp") + "," + this.getDB().dbQuote(now, "timestamp") + ")";
		var A_insertdata = Array();

		for (var postid in H_data) {
			var H_thispoint = H_data[postid];
			A_insertdata.push([postid, H_thispoint.docomo, H_thispoint.au]);
		}

		var O_prepare = this.getDB().prepare(sql);
		return this.getDB().executeMultiple(O_prepare, A_insertdata, false);
	}

	checkNullCocdPost(pactid, yyyymm) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT * FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid IN(" + this.getSetting().car_docomo + "," + this.getSetting().car_au + ")" + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakNewBaseDocomo(pactid, yyyymm) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, SUM(charge) AS charge FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND (code = '" + this.getSetting().A_suo_docomo_basecode[0] + "' AND charge > 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		var A_tmp = this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].charge;
		}

		return H_tmp;
	}

	tweakBaseDocomo(pactid, yyyymm) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND (code = '" + this.getSetting().A_suo_docomo_basecode[0] + "' AND charge < 0) " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakDetailsAU(pactid, yyyymm, A_tellist) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT tel.telno,tel.code,tel.codename,tel.charge,tel.detailno,tel.recdate,tel.tdcomment,uti.codetype FROM " + tel_details_tb + " tel " + "INNER JOIN utiwake_tb uti ON " + "tel.code = uti.code AND tel.carid  = uti.carid " + " WHERE " + " tel.pactid = " + pactid + " AND tel.carid = " + this.getSetting().car_au + " AND tel.telno IN('" + A_tellist.join("','") + "') ORDER BY tel.telno,tel.detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakTaxAU(pactid, yyyymm, A_tellist) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_au + " AND code = '" + this.getSetting().suo_au_taxcode + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakTaxDocomo(pactid, yyyymm) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno,code,charge,detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND code = '" + this.getSetting().suo_docomo_taxcode + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno,detailno";
		return this.get_DB().queryHash(sql);
	}

	tweakNewTaxAU(pactid, yyyymm, A_tellist) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().excise_tax + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_au + " AND taxkubun = '" + this.getSetting().suo_au_taxkubun + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		var A_tmp = this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	tweakNewTotalAU(pactid, yyyymm, A_tellist) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, SUM(charge) AS charge FROM " + tel_details_tb + " INNER JOIN utiwake_tb ON " + tel_details_tb + ".code = utiwake_tb.code AND " + tel_details_tb + ".carid = utiwake_tb.carid " + " WHERE " + " " + tel_details_tb + ".pactid = " + pactid + " AND " + tel_details_tb + ".carid = " + this.getSetting().car_au + " AND utiwake_tb.codetype = " + this.getSetting().suo_au_calc_total_codetype + " AND " + tel_details_tb + ".telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + " INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY " + tel_details_tb + ".telno ORDER BY " + tel_details_tb + ".telno";
		var A_tmp = this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].charge;
		}

		return H_tmp;
	}

	tweakTotalAU(pactid, yyyymm, A_tellist) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, code, charge, detailno,recdate FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_au + " AND code = '" + this.getSetting().suo_au_totalcode + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + tel_tb + ".telno IN('" + A_tellist.join("','") + "') AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) ORDER BY telno";
		return this.get_DB().queryHash(sql);
	}

	tweakNewTaxDocomo(pactid, yyyymm) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().excise_tax + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND taxkubun = '" + this.getSetting().suo_docomo_taxkubun + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		var A_tmp = this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	tweakNewTaxOnesDocomo(pactid, yyyymm) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var tel_tb = MtTableUtil.makeTableName("tel_tb", MtTableUtil.getTableNo(yyyymm));
		var post_tb = MtTableUtil.makeTableName("post_tb", MtTableUtil.getTableNo(yyyymm));
		var post_relation_tb = MtTableUtil.makeTableName("post_relation_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "SELECT telno, CAST(FLOOR(SUM(charge)*" + this.getSetting().excise_tax + ") AS INTEGER) AS tax FROM " + tel_details_tb + " WHERE " + " pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND code NOT IN('" + this.getSetting().A_suo_docomo_taxkubun_notones.join("','") + "')" + " AND taxkubun = '" + this.getSetting().suo_docomo_taxkubun_ones + "' " + " AND telno IN(" + "SELECT " + tel_tb + ".telno " + "FROM (" + tel_tb + " INNER JOIN " + tel_details_tb + " ON " + tel_tb + ".telno = " + tel_details_tb + ".telno) " + "INNER JOIN " + post_tb + " ON " + tel_tb + ".postid = " + post_tb + ".postid " + "WHERE " + post_tb + ".pactid = " + pactid + " AND " + post_tb + ".postid IN(" + "SELECT " + post_relation_tb + ".postidchild " + "FROM " + post_relation_tb + " WHERE " + "level >= " + this.getSetting().suo_cd_post_level + " AND pactid = " + pactid + ") AND " + post_tb + ".pint1 IS NOT NULL) GROUP BY telno ORDER BY telno";
		var A_tmp = this.get_DB().queryHash(sql);
		var H_tmp = Array();

		for (var cnt = 0; cnt < A_tmp.length; cnt++) {
			H_tmp[A_tmp[cnt].telno] = A_tmp[cnt].tax;
		}

		return H_tmp;
	}

	deleteTaxDocomo(pactid, yyyymm, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	deleteTaxAU(pactid, yyyymm, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "DELETE FROM " + tel_details_tb + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().car_au + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	updateTaxAU(pactid, yyyymm, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().car_au + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTaxDocomo(pactid, yyyymm, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTweakBaseDocomo(pactid, yyyymm, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().car_docomo + " AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		return this.get_DB().exec(sql);
	}

	updateTweakAU(pactid, yyyymm, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + ", codename = '" + H_value.codename + "' ,tdcomment = '" + H_value.tdcomment + "'" + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().car_au + "  AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	updateTotalAU(pactid, yyyymm, H_value) {
		var tel_details_tb = MtTableUtil.makeTableName("tel_details_tb", MtTableUtil.getTableNo(yyyymm));
		var sql = "UPDATE " + tel_details_tb + " SET charge = " + H_value.tweakcharge + " WHERE pactid = " + pactid + " AND carid = " + this.getSetting().car_au + "  AND telno = '" + H_value.telno + "' AND code = '" + H_value.code + "'" + " AND charge = " + H_value.charge + " AND detailno = " + H_value.detailno + " AND recdate = '" + H_value.recdate + "'";
		this.infoOut(sql, 0);
		return this.get_DB().exec(sql);
	}

	__destruct() {
		super.__destruct();
	}

};