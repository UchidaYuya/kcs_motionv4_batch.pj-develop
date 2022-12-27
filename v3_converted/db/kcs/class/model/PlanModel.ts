//
//プランテーブル（plan_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//
//
//
//プランテーブル（plan_tb）からデータを取得するModel
//
//@package Base
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses ModelBase
//

require("ModelBase.php");

//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//s183 旧プラン
//
//コンストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $O_db
//@access public
//@return void
//
//
//planidをキーにplannameを値にして返す <br>
//viewflgの考慮追加2010/8/30 <br>
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $buyselid
//@param mixed $past
//@access public
//@return void
//
//
//planidをキーにplanname_engを値にして返す
//
//@author houshiyama
//@since 2008/12/09
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $buyselid
//@param mixed $past
//@access public
//@return void
//
//
//getPlanWithBuyselname
//
//@author katsushi
//@since 2008/09/02
//
//@param mixed $carid
//@param mixed $cirid
//@param string $buyselid
//@access public
//@return void
//
//
//指定したキャリア、回線のプラン数を返す
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//getPlanNameArray
//
//@author katsushi
//@since 2008/07/25
//
//@param array $A_planid
//@access public
//@return void
//
//
//getPlanHashKeyIsBuyselid
//
//@author web
//@since 2013/03/28
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return void
//
//
//デストラクト　親のを呼ぶだけ
//
//@author ishizaki
//@since 2008/05/21
//
//@access public
//@return void
//
class PlanModel extends ModelBase {
	constructor(O_db = undefined, H_g_sess = Array()) {
		super(O_db);
		this.O_oldplan = Array();
		this.O_Set = MtSetting.singleton();

		if (!!H_g_sess) //過去のプランを注文できるようにするぽよ s183
			{
				this.O_Set.loadConfig("H_order_oldplan");
				var key = "orderoldplan_pact" + H_g_sess.pactid;

				if (this.O_Set.existsKey(key)) {
					this.O_oldplan = this.O_Set[key];
				}
			}
	}

	getPlanKeyHash(carid, cirid = "", buyselid = "", past = true, default_planid = 0) //キャリアのみ指定
	//プラン名が同名ならばidをカンマで連結し重複を除く
	{
		var sql = "select planid,planname from plan_tb ";

		if ("" == cirid && "" == buyselid) {
			sql += " where carid=" + carid + " and planid > 3000 ";
		} else if ("" != cirid && "" == buyselid) {
			sql += " where carid=" + carid + " and cirid=" + cirid + " and planid > 3000 ";
		} else if ("" == cirid && "" != buyselid) {
			sql += " where carid=" + carid + " and buyselid=" + buyselid + " and planid > 3000 ";
		} else {
			sql += " where carid=" + carid + " and cirid=" + cirid + " and buyselid=" + buyselid + " and planid > 3000 ";
		}

		if (past == false) {
			if (default_planid == 0) {
				sql += " and viewflg=true ";
			} else //電話管理には表示しない設定になっているものでも、現在設定されているなら表示する
				{
					sql += " and ( viewflg=true or planid = " + default_planid + ") ";
				}
		}

		sql += " order by sort";
		var H_res = this.get_DB().queryAssoc(sql);

		if ("" == cirid) {
			var H_data = Array();

			for (var oid in H_res) {
				var oname = H_res[oid];
				var hit = false;

				for (var nid in H_data) {
					var nname = H_data[nid];

					if (oname === nname) //IDを連結
						//重複を削除
						{
							var key = nid + "," + oid;
							H_data[key] = nname;
							delete H_data[nid];
							hit = true;
							break;
						}
				}

				if (false === hit) {
					H_data[oid] = oname;
				}
			}
		} else {
			H_data = H_res;
		}

		return H_data;
	}

	getPlanEngKeyHash(carid, cirid = "", buyselid = "", past = true, default_planid = 0) //キャリアのみ指定
	//プラン名が同名ならばidをカンマで連結し重複を除く
	{
		var sql = "select planid,planname_eng from plan_tb ";

		if ("" == cirid && "" == buyselid) {
			sql += " where carid=" + carid + " and planid > 3000 ";
		} else if ("" != cirid && "" == buyselid) {
			sql += " where carid=" + carid + " and cirid=" + cirid + " and planid > 3000 ";
		} else if ("" == cirid && "" != buyselid) {
			sql += " where carid=" + carid + " and buyselid=" + buyselid + " and planid > 3000 ";
		} else {
			sql += " where carid=" + carid + " and cirid=" + cirid + " and buyselid=" + buyselid + " and planid > 3000 ";
		}

		if (past == false) {
			if (default_planid == 0) {
				sql += " and viewflg=true ";
			} else //電話管理には表示しない設定になっているものでも、現在設定されているなら表示する
				{
					sql += " and ( viewflg=true or planid = " + default_planid + ") ";
				}
		}

		sql += " order by sort";
		var H_res = this.get_DB().queryAssoc(sql);

		if ("" == cirid) {
			var H_data = Array();

			for (var oid in H_res) {
				var oname = H_res[oid];
				var hit = false;

				for (var nid in H_data) {
					var nname = H_data[nid];

					if (oname === nname) //IDを連結
						//重複を削除
						{
							var key = nid + "," + oid;
							H_data[key] = nname;
							delete H_data[nid];
							hit = true;
							break;
						}
				}

				if (false === hit) {
					H_data[oid] = oname;
				}
			}
		} else {
			H_data = H_res;
		}

		return H_data;
	}

	getPlanWithBuyselname(carid, cirid, buyselid = "") //if( "" == $cirid && "" == $buyselid ){
	//			$sql .= " WHERE plan_tb.carid = " . $carid . " AND plan_tb.planid > 3000 ";
	//		}
	//		// キャリアと回線指定
	//		else
	//idをカンマで連結し重複を除く
	//理解不能のため上だけ行ってコメントアウト（サーキットも必須に）
	//		if( "" == $cirid ){
	//			$H_data = array();
	//			foreach( $H_res as $oid => $oname ){
	//				$hit = false;
	//				foreach( $H_data as $nid => $nname ){
	//					if( $oname === $nname ){
	//						// IDを連結
	//						$key = $nid . "," . $oid;
	//						$H_data[$key] = $nname;
	//	
	//						// 重複を削除
	//						unset( $H_data[$nid] );
	//						$hit = true;
	//						break;
	//					}
	//				}
	//				if( false === $hit ){
	//					$H_data[$oid] = $oname;
	//				}
	//			}
	//		}
	//		else{
	//			$H_data = $H_res;
	//		}
	{
		var sql = "SELECT plan_tb.planid, plan_tb.planname || '(' || buyselect_tb.buyselname || ')' as planname FROM plan_tb INNER JOIN buyselect_tb ON buyselect_tb.buyselid = plan_tb.buyselid ";

		if ("" != cirid && "" == buyselid) {
			sql += " WHERE plan_tb.carid = " + carid + " AND plan_tb.cirid=" + cirid + " AND plan_tb.planid > 3000 ";
		} else {
			sql += " WHERE plan_tb.carid = " + carid + " AND plan_tb.cirid = " + cirid + " AND plan_tb.buyselid = " + buyselid + " AND plan_tb.planid > 3000 ";
		}

		sql += " ORDER BY plan_tb.sort,buyselect_tb.sort";
		var H_res = this.get_DB().queryAssoc(sql);
		var H_data = H_res;
		return H_data;
	}

	getPlanCnt(carid, cirid) {
		var sql = "select count(planid) from plan_tb " + " where " + " carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and cirid=" + this.get_DB().dbQuote(cirid, "integer", true, "cirid") + " and planid > 3000 ";
		var cnt = this.get_DB().queryOne(sql);
		return cnt;
	}

	getPlanNameArray(A_planid: {} | any[]) {
		var sql = "select p.planname || '(' || b.buyselname || ')' as planname from plan_tb p inner join buyselect_tb b on p.buyselid=b.buyselid where p.planid in (" + A_planid.join(",") + ") order by p.sort,b.sort";
		return this.get_DB().queryCol(sql);
	}

	getPlanHashKeyIsBuyselid(carid, cirid, lang = undefined) //s183 旧プランの追加
	{
		var planname = "planname";

		if (lang == "ENG") {
			planname = "planname_eng as planname";
		}

		var sql = `select planid,${planname},buyselid from plan_tb  where carid=` + carid + " and cirid = " + cirid + " and planid > 3000";
		var tmp_plan = "";

		if (!!this.O_oldplan) {
			var oldplan = this.O_oldplan["carid" + carid];

			if (!!oldplan) {
				tmp_plan = " or planid IN(" + oldplan + ")";
			}
		}

		if (tmp_plan == "") {
			sql += " and ordviewflg=true ";
		} else {
			sql += " and (ordviewflg=true" + tmp_plan + ") ";
		}

		var d = this.get_DB().queryHash(sql);
		var returnlist = Array();

		for (var key in d) {
			var value = d[key];
			returnlist[value.buyselid][value.planid] = value.planname;
		}

		return returnlist;
	}

	__destruct() {
		super.__destruct();
	}

};