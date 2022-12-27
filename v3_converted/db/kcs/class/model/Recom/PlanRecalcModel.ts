//
//シミュレーション再実行依頼
//
//@uses ModelBase
//@package Recom
//@filesource
//@author nakanita
//@since 2008/12/16
//
//
//
//シミュレーション再実行依頼
//
//@uses ModelBase
//@package Recom
//@author nakanita
//@since 2008/11/21
//

require("model/ModelBase.php");

//
//__construct
//
//@author nakanita
//@since 2008/12/16
//
//@param mixed $O_db
//@access public
//@return void
//
//
//シミュレーションの手入力条件を保存する
//
//@author nakanita
//@since 2008/12/16
//
//@param mixed $H_sess
//@param mixed $H_cond
//@param mixed $pactid
//@param mixed $shopid
//@param mixed $user_memid
//@param mixed $yyyy
//@param mixed $mm
//@access public
//@return void
//
//
//シミュレーションの、１個の手入力条件を保存する
//
//@author nakanita
//@since 2009/01/28
//
//@param mixed $H_sess
//@param mixed $H_cond
//@param mixed $pactid
//@param mixed $shopid
//@param mixed $user_memid
//@param mixed $yyyy
//@param mixed $mm
//@param mixed $handid
//@access private
//@return void
//
//
//range の値を select_way に変換する
//
//@author nakanita
//@since 2008/12/25
//
//@param mixed $range
//@access private
//@return void
//
//
//upRecalcEntry
//
//@author nakanita
//@since 2008/12/19
//
//@param mixed $H_sess
//@param mixed $H_cond
//@param mixed $pactid
//@param mixed $shopid
//@param mixed $user_memid
//@param mixed $yyyy
//@param mixed $mm
//@access public
//@return void
//
//
//条件登録を削除する
//
//@author nakanita
//@since 2009/01/28
//
//@param mixed $simid
//@access private
//@return void
//
//
//シミュレーション条件のステータスを更新する
//
//@author nakanita
//@since 2008/12/19
//
//@param mixed $simid
//@param mixed $status
//@access public
//@return void
//
//
//シミュレーション再計算依頼があるかどうかを調べる
//電話管理画面からの依頼で二重登録防止に用いている
//
//@author nakanita
//@since 2009/02/20
//
//@param mixed $pactid
//@access public
//@return void
//
//
//特定の会社、キャリアのシミュレーション結果を消す
//電話管理画面からの依頼で以前のデータ削除に用いている
//
//@author nakanita
//@since 2009/02/23
//
//@param mixed $pactid
//@param mixed $carid
//@access public
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2008/11/21
//
//@access public
//@return void
//
class PlanRecalcModel extends ModelBase {
	constructor() {
		super();
	}

	setRecalcEntry(H_sess, H_cond, pactid, shopid, user_memid, yyyy, mm, handid) //var_dump( $H_sess );	// * DEBUG *
	//var_dump( $H_cond );	// * DEBUG *
	//simidを得る
	//carid_aferr が指定されていなければ、単体シミュレーション
	//$this->getDB()->rollback();	// * DEBUG *
	//本番
	{
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_numeric(shopid) == false) {
			this.getOut().errorOut(5, "shopid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_numeric(user_memid) == false) {
			this.getOut().errorOut(5, "user_memid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_null(H_sess.carid) == true || H_sess.carid == "") //何もしない * ToDo * 本来何らかの警告を発するべき
			{
				return 0;
			}

		this.getDB().beginTransaction();
		var sql_simid = "SELECT nextval('sim_index_tb_simid_seq')";

		if (is_null(H_cond.carid_after) == true || +(H_cond.carid_after == 0)) //このときcarid_afterをbeforeと同じにする
			{
				H_cond.simid = this.get_DB().queryOne(sql_simid);
				H_cond.parent_simid = "null";
				H_cond.carid_before = H_sess.carid;
				H_cond.carid_after = H_sess.carid;
				H_cond.is_change_carrier = "false";
				this.setRecalcEachEntry(H_sess, H_cond, pactid, shopid, user_memid, yyyy, mm, handid);
			} else //多キャリアシミュレーション、全てのキャリアにわたってエントリーを入れる
			//実行すべきキャリア、DoCoMo, au , softbank の３つについて実行する
			//★ 直値埋め ★
			{
				var A_allcarid = [1, 3, 4];

				for (var carid of Object.values(A_allcarid)) //ここを全キャリアに渡って変える
				//$H_cond['carid_after']	// ここには値が入っているので、特に上書きしない
				{
					H_cond.simid = this.get_DB().queryOne(sql_simid);

					if (undefined !== H_cond.parent_simid == false || H_cond.parent_simid == undefined) //初回に親simidを設定する
						{
							H_cond.parent_simid = H_cond.simid;
						}

					H_cond.carid_before = carid;
					H_cond.is_change_carrier = "true";
					this.setRecalcEachEntry(H_sess, H_cond, pactid, shopid, user_memid, yyyy, mm, handid);
				}
			}

		this.getDB().commit();
		return 0;
	}

	setRecalcEachEntry(H_sess, H_cond, pactid, shopid, user_memid, yyyy, mm, handid) //今日の日付
	//現行シミュレーション条件
	//ステータス、handidで場合分け
	//電話番号から半角数字以外を除く
	//エントリーデータを作成
	//$this->debugOut($sql);
	{
		var nowtime = this.getDB().getNow();

		if (H_sess.buysel != "") {
			var is_change_course = "true";
		} else {
			is_change_course = "false";
		}

		if (handid != 0) //4=未エントリー -- 条件指定シミュレーション
			{
				var status = 4;
				var is_hotline = "false";
			} else //実行依頼 -- Hotline電話管理からの依頼
			{
				status = 0;
				is_hotline = "true";
			}

		var telno = H_sess.telno.replace(/[^0-9]/g, "");
		var sql = "INSERT INTO sim_index_tb (" + "simid," + "parent_simid," + "status," + "recdate," + "fixdate," + "is_manual," + "is_save," + "label," + "handid," + "pactid," + "carid_before," + "carid_after," + "is_change_carrier," + "year," + "month," + "select_way," + "postid," + "postname," + "telno," + "monthcnt," + "is_change_course," + "change_packet_free_mode," + "discount_way," + "discount_base," + "discount_tel," + "ratio_cellular," + "ratio_same_carrier," + "ratio_daytime," + "ratio_increase_tel," + "ratio_increase_comm," + "shopid," + "user_memid," + "is_hotline " + ") values (" + H_cond.simid + "," + H_cond.parent_simid + "," + status + "," + this.getDB().dbQuote(nowtime, "timestamp", true) + "," + this.getDB().dbQuote(nowtime, "timestamp", true) + "," + "true," + "false," + "'(HotlineEntry)'," + handid + "," + pactid + "," + this.getDB().dbQuote(H_cond.carid_before, "int", false) + "," + this.getDB().dbQuote(H_cond.carid_after, "int", false) + "," + H_cond.is_change_carrier + "," + +(yyyy + "," + +(mm + "," + this.rangeToSelectWay(H_sess.range) + "," + this.getDB().dbQuote(H_cond.postid, "int", false) + "," + "'" + H_cond.postname + "'," + "'" + telno + "'," + H_sess.period + "," + is_change_course + "," + +(H_sess.pakefree + "," + H_cond.discount_way + "," + this.getDB().dbQuote(H_cond.discount_base, "int", false) + "," + this.getDB().dbQuote(H_cond.discount_tel, "int", false) + "," + this.getDB().dbQuote(H_cond.ratio_cellular, "int", false) + "," + this.getDB().dbQuote(H_cond.ratio_same_carrier, "int", false) + "," + this.getDB().dbQuote(H_cond.ratio_daytime, "int", false) + "," + this.getDB().dbQuote(H_cond.ratio_increase_tel, "int", false) + "," + this.getDB().dbQuote(H_cond.ratio_increase_comm, "int", false) + "," + shopid + "," + user_memid + "," + "'" + is_hotline + "'" + ")")));
		var ret_line = this.get_DB().exec(sql);
		return 0;
	}

	rangeToSelectWay(range) //range->select_way 変換
	{
		switch (range) {
			case "all":
				var select_way = 1;
				break;

			case "self":
				select_way = 2;
				break;

			case "one":
				select_way = 3;
				break;

			default:
				select_way = 0;
				break;
		}

		return select_way;
	}

	upRecalcEntry(H_sess, H_cond, pactid, shopid, user_memid, yyyy, mm) //var_dump( $H_sess );	// * DEBUG *
	//var_dump( $H_cond );	// * DEBUG *
	//セッションの save_point に付いている
	//新規エントリーを登録
	//旧エントリーを消去する
	{
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_numeric(shopid) == false) {
			this.getOut().errorOut(5, "shopid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_numeric(user_memid) == false) {
			this.getOut().errorOut(5, "user_memid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var simid = H_sess.save_point;

		if (is_null(simid) == true || is_numeric(simid) == false) {
			this.getOut().errorOut(5, "simid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select handid from sim_index_tb where simid=" + simid;
		var handid = this.get_DB().queryOne(sql);
		this.setRecalcEntry(H_sess, H_cond, pactid, shopid, user_memid, yyyy, mm, handid);
		this.deleteEntry(simid);
		return 0;
	}

	deleteEntry(simid) //parent_simidを得る
	//sim_details_tb から削除
	//他キャリアの場合、同じparent_simidを持っているエントリーを全て消去する
	//$this->debugOut($sql);
	//sim_index_tb から削除
	//$this->getDB()->rollback();	// * DEBUG *
	//本番
	{
		this.getDB().beginTransaction();
		var sql = "select parent_simid from sim_index_tb where simid=" + simid;
		var parent_simid = this.get_DB().queryOne(sql);
		sql = "delete from sim_details_tb where simid in " + "(select simid from sim_index_tb where simid=" + simid;

		if (parent_simid != undefined && parent_simid != 0) {
			sql += " or parent_simid=" + parent_simid;
		}

		sql += ")";
		var ret_line = this.get_DB().exec(sql);
		sql = "delete from sim_index_tb where simid =" + simid;

		if (parent_simid != undefined && parent_simid != 0) {
			sql += " or parent_simid=" + parent_simid;
		}

		ret_line = this.get_DB().exec(sql);
		this.getDB().commit();
		return 0;
	}

	statRecalcEntry(simid, status) //他キャリアの場合、同じparent_simidを持っているエントリーを全て変更する
	//$this->debugOut($sql);
	//$this->getDB()->rollback();	// * DEBUG *
	//$this->getDB()->commit();	// 本番、ここでトランザクションは止めた
	{
		if (is_null(simid) == true || is_numeric(simid) == false) {
			this.getOut().errorOut(5, "simid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "UPDATE sim_index_tb set status=" + status + " where simid=" + simid + " or parent_simid=" + simid;
		var ret_line = this.get_DB().exec(sql);
	}

	existsHotlineEntry(pactid) //plan_history_tb";
	//$sql .= " and year=" . $newestYear;
	//$sql .= " and month=" . $newestMonth;
	//キャリアIDにかかわらずチェックする
	//$sql .= " and handid=0";	// 電話管理からの依頼だと0になる
	//is_hotlineフラグの方が確実
	{
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select count(*) from sim_index_tb";
		sql += " where pactid=" + pactid;
		sql += " and (status='0' or status='1')";
		sql += " and is_hotline=true";
		return this.get_DB().queryOne(sql);
	}

	deleteHotlineResult(pactid, carid) //保存されている電話は除く
	{
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_numeric(carid) == false) {
			this.getOut().errorOut(5, "carid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select simid from sim_index_tb" + " where pactid=" + pactid + " and carid_before=" + carid + " and (" + " is_manual=false" + " or (is_manual=true and is_hotline=true)" + " )" + " and is_save=false";
		var H_result = this.get_DB().queryHash(sql);

		for (var A_row of Object.values(H_result)) {
			this.deleteEntry(A_row.simid);
		}
	}

	__destruct() {
		super.__destruct();
	}

};