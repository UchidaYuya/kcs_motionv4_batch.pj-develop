//
//シミュレーションに関するモデル
//
//@uses ModelBase
//@filesource
//@package Recom
//@subpackage Model
//@author nakanita
//@since 2008/07/18
//
//
//
//Pactに関するモデル
//
//@uses ModelBase
//@package Recom
//@subpackage Model
//@author nakanita
//@since 2008/07/18
//

require("MtSetting.php");

require("MtDBUtil.php");

require("MtOutput.php");

require("model/ModelBase.php");

require("model/PostModel.php");

//
//部署範囲を表すSQL句
//
//@var mixed
//@access private
//
//
//削減金額のSQL句
//
//@var integer
//@access private
//
//
//FROM句を保持
//
//@var mixed
//@access private
//
//
//WHERE句を保持
//
//@var mixed
//@access private
//
//
//コンストラクタ
//
//@author nakanita
//@since 2008/07/18
//
//@param object $O_DB
//@access public
//@return void
//
//
//範囲指定の条件句を得る<br/>
//取得の前に setBorder を実行すること。
//
//@author nakanita
//@since 2008/11/07
//
//@access public
//@return void
//
//
//from句を得る<br/>
//取得の前に getRecomResult を実行すること。
//
//@author nakanita
//@since 2008/09/17
//
//@access public
//@return string
//
//
//where句を得る<br/>
//取得の前に getRecomResult を実行すること。
//
//@author nakanita
//@since 2008/09/17
//
//@access public
//@return string
//
//
//シミュレーション結果のあるキャリア一覧と、その最新年月を取得する<br>
//<br>
//このような形でキャリアごとに最新年月が返ってくる<br>
//yyyymm | carid_before |  carname  <br>
//--------+--------------+----------- <br>
//200807 |            1 | NTTドコモ <br>
//200712 |            3 | au <br>
//
//@author nakanita
//@since 2008/07/23
//
//@param integer $pactid
//@access public
//@return array
//
//ToDo
// 上とは別に、そもそもこの会社に電話があるかどうか調べてみよう。
//
//部署範囲の設定<br/>
//SgetRecomResult に先だって、あらかじめ部署範囲を設定しておくこと。
//
//@author nakanita
//@since 2008/08/14
//
//@param mixed $range
//@param mixed $pactid
//@param mixed $postid
//@access public
//@return void
//
//
//削減額の設定<br/>
//getRecomResult に先だって、あらかじめ削減額を設定しておくこと。
//
//@author nakanita
//@since 2008/08/13
//
//@param mixed $border_sel
//@param mixed $border
//@param mixed $slash
//@param mixed $buysel
//@access public
//@return void
//
//
//おすすめ結果を得る
//
//@author nakanita
//@since 2008/08/08
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $year
//@param mixed $month
//@param mixed $period
//@param mixed $sortkey
//@param mixed $buysel
//@param mixed $pakefree
//@param int $start=1
//@param float $limit=30
//@param boolean $allflag=false
//@access public
//@return void
//
//
//makeSelectStr
//
//@author nakanita
//@since 2008/08/08
//
//@access private
//@return void
//
//
//makeFromStr
//
//@author nakanita
//@since 2008/08/08
//
//@param mixed $month
//@access private
//@return void
//
//
//where句の作成
//
//@author nakanita
//@since 2008/08/08
//
//@param integer $pactid
//@param integer $carid
//@param integer $year
//@param integer $month
//@param integer $period
//@access private
//@return void
//
//
//ソート条件句を作成する
//
//@author nakanita
//@since 2008/08/11
//
//@param mixed $sortkey
//@access private
//@return void
//
//
//おすすめ結果の件数と合計値を取得する
//
//@author nakanita
//@since 2008/08/08
//
//@param mixed $pactid
//@param mixed $carid
//@param mixed $year
//@param mixed $month
//@param mixed $period
//@param mixed $buysel
//@param mixed $pakefree
//@param mixed $allflag=false
//@access public
//@return void
//
//
//保存したシミュレーション、又は手入力条件の一覧を得る
//
//@author nakanita
//@since 2008/10/06
//
//@param integer $pactid 	契約ID、ショップ側の場合であっても現行の契約IDを指定する
//@param integer $shopid	ショップ側の場合は値を設定、ユーザー側の場合は0を設定
//@param integer $user_memid 	ユーザー側の場合はユーザーID、ショップ側の場合はmemid
//@param integer $mode = 0		0:保存・ダウンロード、1:手入力条件
//@param integer $simid = null
//@access public
//@return void
//
//
//ダウンロード用のデータを得る
//
//@author nakanita
//@since 2008/10/06
//
//@param integer $pactid
//@param array $H_cond	シミュレーション条件、getIndexListによって取得したもの
//@param integer $postid
//@param integer $current_postid
//@access public
//@return void
//
//
//ダウンロード用のWhere句を生成する<br/>
//makeWhereStr と同等の内容
//
//@author nakanita
//@since 2008/10/06
//
//@param mixed $pactid
//@param mixed $H_cond
//@access private
//@return void
//
//
//シミュレーション結果を保存する
//
//@author nakanita
//@since 2008/10/08
//
//@param integer $pactid
//@param array $H_sess
//@param integer $shopid	ショップ側の場合保存したショップID、ユーザー側の場合はnull
//@param integer $user_memid	ショップ側の場合はmemid、ユーザー側の場合はuserid
//@access public
//@return void
//
//
//最終シミュレーション日付を設定する<br/>
//メニューからの結果表示ボタンで呼び出され、結果はショップのHotline一覧画面で参照される。
//
//@author nakanita
//@since 2008/11/14
//
//@param integer $pactid
//@param integer $carid
//@access public
//@return void
//
//
//月から対象となるtel_XX_tbを返す
//
//@author kitamura
//@since 2009/04/23
//
//@access public
//@return string
//
//
//pactidとsimidから月を取得
//
//@author kitamura
//@since 2009/04/23
//
//@param integer $pactid
//@param integer $simid
//@access public
//@return integer
//
//
//デストラクト　親のを呼ぶだけ
//
//@author nakanita
//@since 2008/07/18
//
//@access public
//@return void
//
class RecomModel extends ModelBase {
	constructor(O_db = undefined) {
		super(O_db);
		this.RangeSQL = "";
		this.BorderSQL = "";
		this.FromSQL1 = "";
		this.WhereSQL1 = "";
	}

	getBorderSQL() {
		return this.BorderSQL;
	}

	getFromSQL1() {
		return this.FromSQL1;
	}

	getWhereSQL1() {
		return this.WhereSQL1;
	}

	getSimCarrier(pactid) //$this->getOut()->debugOut( $sql );
	{
		if (is_numeric(pactid) == false) {
			this.O_Out.errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "select max(si.year*100+si.month) as YYYYMM, " + "si.carid_before, car.carname, car.carname_eng from sim_index_tb si " + "inner join carrier_tb car on car.carid=si.carid_before " + "inner join sim_details_tb sd on si.simid=sd.simid " + "where si.pactid=" + pactid + "and si.status=2 " + "and si.is_save=false " + "group by si.carid_before, car.carname, car.carname_eng " + "order by si.carid_before";
		return this.getDB().queryHash(sql);
	}

	setRange(range, telno, pactid, postid, current_postid) {
		if (is_numeric(pactid) == false) {
			this.getOut().errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_numeric(postid) == false) {
			this.getOut().errorOut(5, "postid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (range == "all") {
			var O_post = new PostModel();
			var root = O_post.getRootPostid(pactid);

			if (root === current_postid) //ルート部署だった場合は全てを表示する
				{
					this.RangeSQL = "";
					return;
				}

			var A_folpost = O_post.getChildList(pactid, current_postid);

			if (!Array.isArray(A_folpost) || A_folpost.length < 1) {
				this.getOut().errorOut(0, "postid\u304C\u4E00\u4EF6\u3082\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093", 0);
			}

			this.RangeSQL = "AND tel.postid in (" + join(",", A_folpost) + ") ";
		} else if (range == "self") {
			this.RangeSQL = "AND tel.postid=" + current_postid + " ";
		} else if (range == "one") //空白を除く.
			{
				telno = telno.trim();
				telno = str_replace(["-", "(", ")"], ["", "", ""], telno);
				this.RangeSQL = "AND tel.telno='" + telno + "' ";
			}
	}

	setBorder(border_sel, border, slash, buysel) {
		if (border_sel == "all") //全て=条件なし
			{
				this.BorderSQL = "";
			} else if (border_sel == "on") //予測削減額を指定
			//買い換え有りの場合はis_poorで切り分ける
			{
				if (buysel == "on") //さらに、上限が付いている場合には
					{
						this.BorderSQL = " and " + "((sd.charge_before - sd.charge_after >= " + border + " and sd.is_poor=false) or " + " (sd.charge_before - sd.charge_after_poor >= " + border + " and sd.is_poor=true) ) ";

						if (is_null(slash) == false && slash > 0) //安いフラグが付いている方が下であれば表示
							{
								this.BorderSQL += " and " + "money_penalty <= " + slash + " ";
							}
					} else //買い換え無しの場合は単純
					//違約金の上限はありません
					{
						this.BorderSQL = " and " + "sd.charge_before - sd.charge_after >= " + border + " ";
					}
			}
	}

	getRecomResult(pactid, carid, year, month, period, sortkey, buysel, pakefree, start = 1, limit = 30, allflag = false, simid = 0) //SQL文作成
	//削減額条件追加
	//ソート条件追加
	//表示件数条件追加
	//$this->debugOut( $sql );	// * DEBUG *
	{
		if (is_numeric(pactid) == false) {
			this.O_Out.errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		if (is_numeric(carid) == false) {
			this.O_Out.errorOut(5, "carid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		this.FromSQL1 = this.makeFromStr(month, allflag);
		this.WhereSQL1 = this.makeWhereStr(pactid, carid, year, month, period, buysel, pakefree, allflag, simid);
		var sql = this.makeSelectStr() + this.FromSQL1 + this.WhereSQL1;
		sql += this.BorderSQL;
		sql += this.makeSortCond(sortkey);
		sql += " limit " + limit + " offset " + (start - 1) * limit;
		var H_result = this.getDB().queryHash(sql);
		return H_result;
	}

	makeSelectStr() {
		var sql = "SELECT " + "tel.telno," + "post.postname," + "post.userpostid," + "cir.cirid," + "cir.cirname," + "cir.cirname_eng," + "cir.sort," + "tel.telno_view," + "tel.carid," + "tel.employeecode," + "tel.username," + "plan.planid," + "plan.planname," + "plan.planname_eng," + "plan.buyselid," + "bsel.buyselname," + "bsel.buyselname_eng," + "packet.packetid," + "packet.packetname," + "packet.packetname_eng," + "recplan.planid as recplanid," + "recplan.planname as recplanname," + "recplan.planname_eng as recplanname_eng," + "recplan.buyselid as recbuyselid," + "recbsel.buyselname as recbuyselname," + "recbsel.buyselname_eng as recbuyselname_eng," + "recpacket.packetid as recpacketid," + "recpacket.packetname as recpacketname," + "recpacket.packetname_eng as recpacketname_eng," + "sd.basic_before," + "sd.tel_before," + "sd.etc_before," + "sd.basic_after," + "sd.tel_after," + "sd.etc_after," + "sd.charge_before," + "sd.charge_after," + "sd.charge_before - sd.charge_after as diffcharge," + "recplan_p.planid as recplanid_poor," + "recplan_p.planname as recplanname_poor," + "recplan_p.planname_eng as recplanname_poor_eng," + "recplan_p.buyselid as recbuyselid_poor," + "recbsel_p.buyselname as recbuyselname_poor," + "recbsel_p.buyselname_eng as recbuyselname_poor_eng," + "recpacket_p.packetid as recpacketid_poor," + "recpacket_p.packetname as recpacketname_poor," + "recpacket_p.packetname_eng as recpacketname_poor_eng," + "sd.charge_after_poor," + "sd.charge_before - sd.charge_after_poor as diffcharge_poor," + "COALESCE(sd.money_penalty, 0) as penalty_money," + "COALESCE(sd.monthcnt_penalty, 0) as penalty_monthcnt," + "sd.mass_target_1," + "sd.mass_target_2," + "sd.mass_target_3," + "sd.mass_target_4," + "sd.mass_target_5," + "si.simid," + "si.fixdate," + "sd.is_poor as is_poor," + "case when is_poor=false then sd.charge_before - sd.charge_after " + " when is_poor=true  then sd.charge_before - sd.charge_after_poor end as diffcharge_sort ";
		return sql;
	}

	makeFromStr(month, allflag = false) //シミュレーション対象のtel_X_tbを求める
	//対象月は month - 1 です.
	//最新の tel_XX_tb 名を得る
	{
		var rec_month = month;

		if (--rec_month <= 0) {
			rec_month += 12;
		}

		if (rec_month < 10) {
			var rec_month_str = "0" + rec_month;
		} else {
			rec_month_str = rec_month;
		}

		var tel_newest_tb = "tel_" + rec_month_str + "_tb";
		var fromsql = "FROM " + "sim_index_tb si " + "INNER JOIN sim_details_tb sd ON si.simid=sd.simid " + "INNER JOIN " + tel_newest_tb + " tel ON si.pactid=tel.pactid AND sd.telno=tel.telno AND si.carid_before=tel.carid ";

		if (allflag == false) //全部表示ではないとき
			//現行の電話にも存在している
			{
				fromsql += "INNER JOIN tel_tb telnow ON si.pactid=telnow.pactid AND sd.telno=telnow.telno " + "AND si.carid_before=telnow.carid ";
			} else {
			fromsql += "LEFT JOIN tel_tb telnow ON si.pactid=telnow.pactid AND sd.telno=telnow.telno " + "AND si.carid_before=telnow.carid ";
		}

		fromsql += "INNER JOIN post_tb post ON tel.pactid=post.pactid AND tel.postid=post.postid " + "JOIN pact_tb AS pact ON si.pactid = pact.pactid " + "LEFT OUTER JOIN circuit_tb cir      ON tel.cirid=cir.cirid " + "LEFT OUTER JOIN plan_tb plan        ON tel.planid=plan.planid " + "LEFT OUTER JOIN packet_tb packet    ON tel.packetid=packet.packetid " + "LEFT OUTER JOIN buyselect_tb bsel   ON plan.buyselid=bsel.buyselid and plan.carid=bsel.carid " + "LEFT OUTER JOIN plan_tb recplan     ON sd.planid=recplan.planid " + "LEFT OUTER JOIN packet_tb recpacket ON sd.packetid=recpacket.packetid " + "LEFT OUTER JOIN buyselect_tb recbsel ON recplan.buyselid=recbsel.buyselid and recplan.carid=recbsel.carid " + "LEFT OUTER JOIN plan_tb recplan_p      ON sd.planid_poor=recplan_p.planid " + "LEFT OUTER JOIN packet_tb recpacket_p  ON sd.packetid_poor=recpacket_p.packetid " + "LEFT OUTER JOIN buyselect_tb recbsel_p ON recplan_p.buyselid=recbsel_p.buyselid and recplan_p.carid=recbsel_p.carid ";
		return fromsql;
	}

	makeWhereStr(pactid, carid, year, month, period, buysel, pakefree, allflag = false, simid = 0) //実行ステータス完了したもののみ
	//保存データは除外する
	//条件指定の場合、simid が入る
	//END simid
	{
		var wheresql = "WHERE " + "tel.pactid = " + pactid + " ";
		wheresql += "AND si.status=2 ";
		wheresql += "AND si.is_save=false ";

		if (simid != 0) //simid指定の有無によって条件を切り替える
			//他キャリアの場合、子供も表示する
			{
				wheresql += "AND (si.simid=" + simid + " OR si.parent_simid=" + simid + ") ";
			} else //手動入力の結果は除く。手動入力結果は simid で直接指定しているはずなので。2009/03/11
			//キャリアで絞り込む
			//対象年月の条件追加
			//月数の条件追加
			//除外プランは表示しない
			//警告フラグでの絞込
			//現在のプランが既におすすめと一致しているものは除く -- 2005/06/15追加
			//現在のプランとシミュレーション時のプランが変わっているものは除く、に変更
			//パケットがnullである可能性に注意
			//コースが変わったかどうか
			//パケットフリーか否か
			{
				wheresql += "AND (si.is_manual=false or si.is_hotline=true)";
				wheresql += "AND tel.carid = " + carid + " ";
				wheresql += "AND si.year=" + year + " ";
				wheresql += "AND si.month=" + +(month + " ");
				wheresql += "AND si.monthcnt=" + period + " ";

				if (allflag == false) //全部表示ではないとき
					{
						wheresql += "AND plan.simbefore=true ";
					}

				wheresql += "AND recplan.simafter=true ";
				wheresql += "AND (pact.type = 'H' OR telnow.planalert IS NULL OR telnow.planalert != '1') " + "AND (pact.type = 'H' OR telnow.packetalert IS NULL OR telnow.packetalert != '1') ";

				if (allflag == false) //全部表示ではないとき
					{
						wheresql += "AND (telnow.planid != recplan.planid " + "OR (recpacket.packetid is not null AND telnow.packetid != recpacket.packetid)) ";
					}

				wheresql += this.RangeSQL;

				if (buysel === "on") {
					wheresql += "AND si.is_change_course=true ";
				} else {
					wheresql += "AND si.is_change_course=false ";
				}

				wheresql += "AND si.change_packet_free_mode=" + +(pakefree + " ");
			}

		return wheresql;
	}

	makeSortCond(sortkey) {
		if (sortkey == "" || is_null(sortkey) == true) //デフォルトソート
			{
				sql += " order by post.userpostid, rec.telno";
				return sql;
			}

		var A_sort = ["userpostid", "sort", "telno", "planname", "packetname", "recplanname", "recpacketname", "telno", "charge_before", "diffcharge_sort", "penalty_money", "penalty_monthcnt"];
		var A_key = preg_split("/\\|/", sortkey);

		if (A_key[1] == "a") {
			var asc = "asc";
		} else if (A_key[1] == "d") {
			asc = "desc";
		}

		sql += " order by " + A_sort[A_key[0]] + " " + asc;

		if (A_key[2] != 2) //telno 以外.
			{
				sql += ", telno";
			}

		return sql;
	}

	getResultCnt(pactid, carid, year, month, period, buysel, pakefree, allflag = false, simid = 0) //合計値用ＳＱＬの実行 -- 安い方の値を合計している
	//削減額条件追加
	//$this->debugOut( $sum_sql );	// * DEBUG *
	{
		var sum_sql = "SELECT " + "count(tel.telno) as count," + "sum(sd.basic_before) as basicbefore," + "sum(sd.tel_before)   as tuwabefore," + "sum(sd.etc_before)   as etcbefore," + "sum(case when is_poor=false then sd.basic_after " + " when sd.is_poor=true then sd.basic_after_poor end) as basicafter," + "sum(case when sd.is_poor=false then sd.tel_after " + " when sd.is_poor=true then sd.tel_after_poor end) as tuwaafter," + "sum(case when is_poor=false then sd.etc_after " + " when sd.is_poor=true then sd.etc_after_poor end) as etcafter," + "max(si.fixdate) as max_fixdate " + this.makeFromStr(month, allflag) + this.makeWhereStr(pactid, carid, year, month, period, buysel, pakefree, allflag, simid);
		sum_sql += this.BorderSQL;
		return this.getDB().queryHash(sum_sql);
	}

	getIndexList(pactid, shopid, user_memid, mode = 0, simid = undefined, lang = undefined) //他キャリアで複数エントリーがある場合、代表の１件だけを表示する
	//userid 又は memid
	//保存・ダウンロードの場合
	//ここで表示データの整形を行ってしまおう！
	{
		if (is_numeric(pactid) == false) {
			this.O_Out.errorOut(5, "pactid\u304C\u6B63\u3057\u304F\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 0);
		}

		var sql = "SELECT " + "idx.simid," + "idx.status," + "idx.label," + "idx.carid_before," + "idx.carid_after," + "idx.is_change_carrier," + "car.carname," + "car.carname_eng," + "car2.carname as carname_after," + "car2.carname_eng as carname_after_eng," + "idx.select_way," + "idx.postid," + "idx.postname," + "idx.telno," + "idx.year," + "idx.month," + "idx.monthcnt," + "idx.is_change_course," + "idx.change_packet_free_mode," + "idx.discount_way," + "idx.discount_base," + "idx.discount_tel," + "idx.ratio_cellular," + "idx.ratio_same_carrier," + "idx.ratio_daytime," + "idx.fixdate," + "idx.is_all," + "idx.border, " + "idx.division, " + "idx.slash " + " from sim_index_tb idx " + " inner join carrier_tb car on idx.carid_before=car.carid " + " left outer join carrier_tb car2 on idx.carid_after=car2.carid " + " where idx.pactid=" + pactid + " and (idx.parent_simid is null or idx.simid=idx.parent_simid)";

		if (simid != undefined && is_numeric(simid)) {
			sql += " and idx.simid=" + simid;
		}

		if (is_null(shopid) == false && shopid != 0) {
			sql += " and idx.shopid=" + +shopid;
		}

		sql += " and idx.user_memid=" + +user_memid;

		if (mode == 0) //ソートはデータ保存日
			{
				sql += " and idx.status=2" + " and idx.is_save=true" + " order by idx.recdate desc";
			} else if (mode == 1) //ソートは handid
			{
				sql += " and ( idx.is_manual=true" + " or idx.is_hotline=true ) " + " and idx.is_save=false" + " and idx.handid != 0" + " order by idx.handid asc";
			}

		var H_data = this.getDB().queryHash(sql);
		var idx = 0;

		for (var H_row of Object.values(H_data)) //表示キャリアID
		//対象電話の表示
		{
			if (H_row.is_change_carrier == true) //他キャリア間
				{
					if (lang === "ENG") {
						H_data[idx].carname_disp = "Change to " + H_row.carname_after_eng;
					} else {
						H_data[idx].carname_disp = H_row.carname_after + " \u306B\u5909\u66F4";
					}
				} else //キャリア内
				{
					if (lang === "ENG") {
						H_data[idx].carname_disp = H_row.carname_eng;
					} else {
						H_data[idx].carname_disp = H_row.carname;
					}
				}

			switch (H_row.select_way) {
				case 0:
					if (lang === "ENG") {
						H_data[idx].select_way_disp = "Entire company";
					} else {
						H_data[idx].select_way_disp = "\u5168\u793E";
					}

					break;

				case 1:
					if (lang === "ENG") {
						H_data[idx].select_way_disp = "All child departments of " + H_row.postname;
					} else {
						H_data[idx].select_way_disp = H_row.postname + "\u90E8\u7F72\u4EE5\u4E0B\u5168\u3066";
					}

					break;

				case 2:
					H_data[idx].select_way_disp = H_row.postname;
					break;

				case 3:
					H_data[idx].select_way_disp = H_row.telno;
					break;

				default:
					H_data[idx].select_way_disp = "";
					break;
			}

			idx++;
		}

		return H_data;
	}

	getDownloadData(pactid, H_cond, postid, current_postid, lang = undefined) //部署範囲を準備する
	//switch( $H_cond['select_way'] ){
	//case 0:	$range = 'all';		break;
	//case 1:	$range = 'all';		break;
	//case 2:	$range = 'self';	break;
	//case 3:	$range = 'one';		break;
	//default:	$range = 'all';	break;
	//}
	//$this->setRange( $range, $H_cond[0]['telno'], $pactid, $postid, $current_postid );
	//上位部署のデータが見えないように範囲指定
	//SQL文の作成
	//ユーザー部署ID 9
	//社員番号 12
	//損益分岐月数 22
	//"si.fixdate " .	// 計算日	// 23
	//全てを表示するかどうか
	//$this->debugOut( $sql );	// * DEBUG *
	//$H_data = $this->getDB()->queryHash($sql);
	//var_dump( $H_data );
	{
		this.setRange("all", H_cond[0].telno, pactid, postid, postid);
		var sql = "SELECT " + "tel.telno_view," + "sd.basic_before," + "CASE WHEN sd.is_poor THEN sd.basic_after_poor ELSE sd.basic_after END as basic_after," + "sd.tel_before," + "CASE WHEN sd.is_poor THEN sd.tel_after_poor ELSE sd.tel_after END as tel_after," + "sd.etc_before," + "CASE WHEN sd.is_poor THEN sd.etc_after_poor ELSE sd.etc_after END as etc_after," + "post.postname," + "post.userpostid,";

		if (lang === "ENG") //回線種別名 10
			{
				sql += "cir.cirname_eng as cirname,";
			} else //回線種別名 10
			{
				sql += "cir.cirname,";
			}

		sql += "tel.username," + "tel.employeecode,";

		if (lang === "ENG") //18
			{
				sql += "bsel.buyselname_eng as buyselname," + "plan.planname_eng as planname," + "packet.packetname_eng as packetname," + "CASE WHEN sd.is_poor THEN recbsel_p.buyselname_eng ELSE recbsel.buyselname_eng END as recbuyselname," + "CASE WHEN sd.is_poor THEN recplan_p.planname_eng ELSE recplan.planname_eng END as recplanname," + "CASE WHEN sd.is_poor THEN recpacket_p.packetname_eng ELSE recpacket.packetname_eng END as recpacketname,";
			} else //18
			{
				sql += "bsel.buyselname," + "plan.planname," + "packet.packetname," + "CASE WHEN sd.is_poor THEN recbsel_p.buyselname ELSE recbsel.buyselname END as recbuyselname," + "CASE WHEN sd.is_poor THEN recplan_p.planname ELSE recplan.planname END as recplanname," + "CASE WHEN sd.is_poor THEN recpacket_p.packetname ELSE recpacket.packetname END as recpacketname,";
			}

		sql += "sd.charge_before," + "CASE WHEN sd.is_poor THEN sd.charge_before-sd.charge_after_poor ELSE sd.charge_before-sd.charge_after END as diffcharge," + "sd.money_penalty," + "sd.monthcnt_penalty ";

		if (H_cond[0].is_all == true) {
			var allflag = true;
		} else {
			allflag = false;
		}

		sql += this.makeFromStr(H_cond[0].month, allflag);
		sql += this.makeWhereStrForDownload(pactid, H_cond[0], allflag);
		return this.getDB().queryHash(sql);
	}

	makeWhereStrForDownload(pactid, H_cond, allflag = false) //実行ステータス完了したもののみ
	//保存データのみをとってくる
	//キャリアで絞り込む。。。他キャリアの場合、ここで絞り込めないじょ。
	//$wheresql .= "AND tel.carid = ". $H_cond['carid_before'] . " ";
	//対象年月の条件追加
	//月数の条件追加
	//period
	//除外プランは表示しない
	//警告フラグでの絞込
	//現在のプランが既におすすめと一致しているものは除く -- 2005/06/15追加
	//現在のプランとシミュレーション時のプランが変わっているものは除く、に変更
	//パケットがnullである可能性に注意
	//コースが変わったかどうか
	//パケットフリーか否か
	{
		var wheresql = "WHERE " + "(si.simid = " + H_cond.simid + " OR si.parent_simid=" + H_cond.simid + ") " + " AND tel.pactid = " + pactid + " ";
		wheresql += "AND si.status=2 ";
		wheresql += "AND si.is_save=true ";
		wheresql += "AND si.year=" + H_cond.year + " ";
		wheresql += "AND si.month=" + +(H_cond.month + " ");
		wheresql += "AND si.monthcnt=" + H_cond.monthcnt + " ";

		if (allflag == false) //全部表示ではないとき
			{
				wheresql += "AND plan.simbefore=true ";
				this.setBorder(H_cond.is_all ? "all" : "on", H_cond.border, H_cond.slash, H_cond.is_change_course ? "on" : "");
				wheresql += this.getBorderSQL();
			}

		wheresql += "AND recplan.simafter=true ";
		wheresql += "AND (pact.type = 'H' OR telnow.planalert IS NULL OR telnow.planalert != '1') " + "AND (pact.type = 'H' OR telnow.packetalert IS NULL OR telnow.packetalert != '1') ";

		if (allflag == false) //全部表示ではないとき
			{
				wheresql += "AND (telnow.planid != recplan.planid " + "OR (recpacket.packetid is not null AND telnow.packetid != recpacket.packetid)) ";
			}

		wheresql += this.RangeSQL;

		if (H_cond.is_change_course == true) {
			wheresql += "AND si.is_change_course=true ";
		} else {
			wheresql += "AND si.is_change_course=false ";
		}

		wheresql += "AND si.change_packet_free_mode=" + +(H_cond.is_change_packet_free + " ");
		return wheresql;
	}

	saveRecomData(pactid, H_sess, shopid, user_memid) //H_sess の中身
	//      'label' => string 'データ名'
	//      'simid' => string '187'
	//      'carid' => string '3'
	//      'range' => string 'all'
	//      'postid' => string ''
	//      'telno' => string ''	// オプション
	//      'period' => string '3'
	//      'buysel' => string 'on'	// オプション
	//      'pakefree' => string 'on'	// オプション
	//      'border_sel' => string 'all'	// オプション
	//成功
	{
		switch (H_sess.range) {
			case "one":
				var select_way = 3;
				break;

			case "self":
				select_way = 2;
				break;

			case "all":
			default:
				select_way = 1;
				break;
		}

		var postname = undefined;

		if (select_way == 1 || select_way == 2) {
			var sql = "SELECT postname FROM post_tb " + "WHERE " + "pactid = " + +(pactid + " AND " + "postid = " + +H_sess.postid);
			postname = this.get_DB().queryOne(sql);
		}

		var H_simid = this.getSameParentSimid(H_sess.simid);
		var parent_simid = undefined;

		for (var A_row of Object.values(H_simid)) //コピー元のsimidをセットする
		//$this->debugOut( "simid=" . $A_row['simid'] );
		//コピー先の書き込み用simidを発行する
		//複数件数だった場合、初回のsimidを記録する
		{
			H_sess.simid = A_row.simid;
			sql = "SELECT nextval('sim_index_tb_simid_seq')";
			var simid = this.get_DB().queryOne(sql);

			if (H_simid.length > 1 && is_null(parent_simid) == true) {
				parent_simid = simid;
			}

			this.saveRecomEachData(pactid, H_sess, shopid, user_memid, simid, parent_simid, select_way, postname);
		}

		return true;
	}

	getSameParentSimid(simid) {
		var sql = "select simid from sim_index_tb" + " where simid = " + simid + " or parent_simid=" + "(select parent_simid from sim_index_tb where simid=" + simid + ")";
		return this.get_DB().queryHash(sql);
	}

	saveRecomEachData(pactid, H_sess, shopid, user_memid, simid, parent_simid, select_way, postname) //sim_details_tb の値を取得
	//"全てを表示"の値を得る
	//sim_index_tb の値を取得
	//parent_simidのnull補正
	//echo $sql . "<br/>";	// * DEBUG *
	//成功
	{
		this.setRange(H_sess.range, str_replace("-", "", H_sess.telno), pactid, H_sess.postid, H_sess.postid);
		var tel_tb = this.getTargetTelTb(this.getSimMonth(pactid, H_sess.simid));
		var sql_from = "SELECT " + "dt.simid," + "dt.telno," + "dt.recdate," + "dt.basic_before," + "dt.tel_before," + "dt.etc_before," + "dt.planid," + "dt.packetid," + "dt.basic_after," + "dt.tel_after," + "dt.etc_after," + "dt.charge_before," + "dt.charge_after," + "dt.planid_poor," + "dt.packetid_poor," + "dt.basic_after_poor," + "dt.tel_after_poor," + "dt.etc_after_poor," + "dt.charge_after_poor," + "dt.money_penalty," + "dt.monthcnt_penalty," + "dt.is_poor," + "dt.mass_target_1," + "dt.mass_target_2," + "dt.mass_target_3," + "dt.mass_target_4," + "dt.mass_target_5," + "dt.is_override" + " from sim_details_tb dt" + " inner join sim_index_tb idx on idx.simid=dt.simid and idx.pactid=" + pactid + " inner join " + tel_tb + " tel on dt.telno = tel.telno and idx.pactid = tel.pactid and idx.carid_before = tel.carid" + " where dt.simid=" + H_sess.simid + " " + this.RangeSQL;

		if (undefined !== H_sess.division && -1 !== [1, 2].indexOf(H_sess.division)) {
			sql_from += " and tel.division=" + H_sess.division;
		}

		var H_from = this.getDB().queryHash(sql_from);

		for (var H_row of Object.values(H_from)) //sim_details_tb をコピーする
		//echo $sql . "<br/>";	// * DEBUG *
		{
			var sql = "INSERT INTO sim_details_tb (" + "simid," + "telno," + "recdate," + "basic_before," + "tel_before," + "etc_before," + "planid," + "packetid," + "basic_after," + "tel_after," + "etc_after," + "charge_before," + "charge_after," + "planid_poor," + "packetid_poor ," + "basic_after_poor ," + "tel_after_poor ," + "etc_after_poor ," + "charge_after_poor ," + "money_penalty," + "monthcnt_penalty," + "is_poor," + "mass_target_1," + "mass_target_2," + "mass_target_3," + "mass_target_4," + "mass_target_5," + "is_override " + ") values (" + simid + "," + "'" + H_row.telno + "'," + "'" + H_row.recdate + "'," + +(H_row.basic_before + "," + +(H_row.tel_before + "," + +(H_row.etc_before + "," + +(H_row.planid + "," + +(H_row.packetid + "," + +(H_row.basic_after + "," + +(H_row.tel_after + "," + +(H_row.etc_after + "," + +(H_row.charge_before + "," + +(H_row.charge_after + "," + +(H_row.planid_poor + "," + +(H_row.packetid_poor + "," + +(H_row.basic_after_poor + "," + +(H_row.tel_after_poor + "," + +(H_row.etc_after_poor + "," + +(H_row.charge_after_poor + "," + (is_null(H_row.money_penalty) ? "null" : +H_row.money_penalty) + "," + +(H_row.monthcnt_penalty + "," + (H_row.is_poor ? "true" : "false") + "," + "'" + H_row.mass_target_1 + "'," + "'" + H_row.mass_target_2 + "'," + "'" + H_row.mass_target_3 + "'," + "'" + H_row.mass_target_4 + "'," + "'" + H_row.mass_target_5 + "'," + (H_row.is_override ? "true" : "false") + " " + ")")))))))))))))))));
			var ret_line = this.get_DB().exec(sql);
		}

		if (H_sess.border_sel === "all") {
			var allflag = "true";
		} else {
			allflag = "false";
		}

		sql_from = "SELECT * from sim_index_tb idx " + " where pactid=" + pactid + " and simid=" + H_sess.simid;
		H_from = this.getDB().queryHash(sql_from);

		if (is_null(parent_simid) == true || parent_simid == "") {
			parent_simid = "null";
		}

		sql = "INSERT INTO sim_index_tb (" + "simid," + "parent_simid," + "status," + "recdate," + "fixdate," + "is_manual," + "is_save," + "label," + "handid," + "pactid," + "carid_before," + "carid_after," + "year," + "month," + "select_way," + "postid," + "postname," + "telno," + "monthcnt," + "is_change_course," + "change_packet_free_mode," + "discount_way," + "discount_base," + "discount_tel," + "ratio_cellular," + "ratio_same_carrier," + "ratio_daytime," + "ratio_increase_tel," + "ratio_increase_comm," + "shopid," + "user_memid," + "is_all," + "is_hotline, " + "border, " + "division, " + "slash " + ") values ( " + simid + "," + parent_simid + "," + H_from[0].status + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + "'" + H_from[0].fixdate + "'," + (H_from[0].is_manual ? "true" : "false") + "," + "true," + this.get_DB().dbQuote(H_sess.label, "text", true) + "," + +(H_form[0].handid + "," + H_from[0].pactid + "," + +(H_from[0].carid_before + "," + +(H_from[0].carid_after + "," + +(H_from[0].year + "," + +(H_from[0].month + "," + +(select_way + "," + +(H_from[0].postid + "," + (undefined !== postname ? "'" + postname + "'" : "null") + "," + (H_sess.telno.length > 0 ? "'" + H_sess.telno + "'" : "null") + "," + +(H_sess.period + "," + (H_sess.buysel === "on" ? "true" : "false") + "," + +(H_sess.pakefree + "," + +(H_from[0].discount_way + "," + +(H_from[0].discount_base + "," + +(H_from[0].discount_tel + "," + +(H_from[0].ratio_cellular + "," + +(H_from[0].ratio_same_carrier + "," + +(H_from[0].ratio_daytime + "," + +(H_from[0].ratio_increase_tel + "," + +(H_from[0].ratio_increase_comm + "," + +(shopid + "," + +(user_memid + "," + allflag + "," + (H_from[0].is_hotline ? "true" : "false") + "," + +(H_sess.border + "," + (H_sess.division.length ? +H_sess.division : "-1") + "," + +(H_sess.slash + ")")))))))))))))))))))));
		ret_line = this.get_DB().exec(sql);
		return true;
	}

	upSimDate(pactid, carid) //$nowdate = date("Y-m-d H:i:s");
	//echo $up_sql . "<br>";
	{
		var nowdate = this.getDateUtil().getToday();
		var sql = "select count(*) from sim_config_tb where  pactid=" + pactid + " and carid=" + carid;
		var cnt = this.get_DB().queryOne(sql);

		if (cnt > 0) {
			var up_sql = "update sim_config_tb set printdate='" + nowdate + "' where pactid=" + pactid + " and carid=" + carid;
		} else {
			up_sql = "insert into sim_config_tb (pactid,carid,printdate) values (" + pactid + "," + carid + ", '" + nowdate + "' )";
		}

		var ret_line = this.get_DB().exec(up_sql);
	}

	getTargetTelTb(month) //シミュレーション対象のtel_X_tbを求める
	//対象月は month - 1 です.
	//最新の tel_XX_tb 名を得る
	{
		var rec_month = month;

		if (--rec_month <= 0) {
			rec_month += 12;
		}

		if (rec_month < 10) {
			var rec_month_str = "0" + rec_month;
		} else {
			rec_month_str = rec_month;
		}

		var tel_newest_tb = "tel_" + rec_month_str + "_tb";
		return tel_newest_tb;
	}

	getSimMonth(pactid, simid) //sim_index_tb の値を取得
	{
		var sql_from = "SELECT month from sim_index_tb idx " + " where pactid=" + pactid + " and simid=" + simid;
		var month = this.getDB().queryOne(sql_from);
		return month;
	}

	__destruct() {
		super.__destruct();
	}

};