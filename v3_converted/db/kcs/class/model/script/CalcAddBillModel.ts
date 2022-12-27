//
//
//
//更新履歴：<br>
//2016/03/09 date 作成
//
//
//
//@package SUO
//@subpackage Model
//@author date<date@motion.co.jp>
//@filesource
//@since 2015/06/25
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author miyazawa
//@since 2010/02/03
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//getPostSum
//部署ごとの金額の合計などを算出する
//@author web
//@since 2016/01/08
//
//@param mixed $tableNo
//@param mixed $pactid
//@access public
//@return void
//
//
//getBillHistory
//再計算要求のきているやつを返す
//@author web
//@since 2015/06/23
//
//@access public
//@return void
//
//
//getCalcBillHistory
//計算をすべきpactidを返却する
//@author web
//@since 2015/06/23
//
//@access public
//@return void
//
//
//updateHistoryLog
//再計算用のログをDBに書き込み
//@author web
//@since 2016/01/20
//
//@param mixed $pactid
//@param mixed $year
//@param mixed $month
//@param mixed $healthcoid
//@param mixed $status
//@access public
//@return void
//
//
//InsertHistoryLog
//
//@author web
//@since 2016/01/20
//calc_addbillを実行した時のログ
//@param mixed $pactid
//@param mixed $year
//@param mixed $month
//@param mixed $healthcoid
//@param mixed $nowtime
//@access public
//@return void
//
//
//makeAddBillSqlData
//SQL用のデータを作成
//@author web
//@since 2016/02/03
//
//@access private
//@return void
//
//
//makeConfirmSQL
//addbill_tbの未確定になっているものを確定にする
//@author web
//@since 2016/01/29
//
//@access private
//@return void
//
//
//makeUnsettledSQL
//請求から未確定に戻す
//@author web
//@since 2016/02/03
//
//@param mixed $pactid
//@param mixed $tableNo
//@access private
//@return void
//
//
//getPostRelation
//部署のリレーションを取得する
//@author web
//@since 2016/02/10
//
//@param mixed $pactid
//@param string $tableno
//@access private
//@return void
//
//
//getChildList
//
//@author web
//@since 2016/02/10
//
//@param mixed $pactid
//@param mixed $postid
//@param string $tableno
//@access public
//@return void
//
//
//makeBillPostSql
//部署請求のSQLを作成
//@author web
//@since 2016/01/29
//
//@param mixed $pactid
//@param mixed $tableNo
//@param mixed $nowtime
//@access public
//@return void
//
//
//deleteBillPost
//部署請求の削除
//@author web
//@since 2016/02/03
//
//@param mixed $pactid
//@param mixed $tableNo
//@access private
//@return void
//
// update 
// 
// @author date 
// @since 2016/01/20
// 
// @param mixed $pactid 
// @param mixed $tableNo 
// @param mixed $nowtime 
// @access public
// @return void
//
//__destruct
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class CalcAddBillModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	//ここにカラム追加すれば計算してくれるよ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
		this.O_Post = new PostModel();
		this.A_calc_column = ["price"];
	}

	getNow() {
		return this.get_DB().getNow();
	}

	getPostSum(tableNo, pactid) //selectとgroup byで使うもの
	//集計用
	//IDごとのもの
	{
		var select = ["postid"];
		var select_sum = Array();

		for (var column of Object.values(this.A_calc_column)) {
			select_sum.push("coalesce(sum(" + column + "),0) as " + column);
		}

		var sql = "SELECT " + select.join(",") + "," + select_sum.join(",") + " FROM addbill_" + tableNo + "_tb" + " WHERE pactid=" + pactid + "  GROUP BY " + select.join(",");
		return this.getDB().queryHash(sql);
	}

	getRecalcBillHistory(pactid, billdate) //日付指定
	{
		var sql = "SELECT pactid,year,month,status " + "FROM addbill_bill_history_tb where status = '0'";

		if (billdate != "none") {
			var year = +billdate.substr(0, 4);
			var month = +billdate.substr(4, 2);
			sql += " and year=" + year + " and month=" + month;
		}

		if (pactid != "all") {
			sql += " and pactid=" + pactid;
		}

		return this.get_DB().queryHash(sql);
	}

	getCalcBillHistory(pactid, billdate) {
		var year = +billdate.substr(0, 4);
		var month = +billdate.substr(4, 2);
		var res = Array();

		if (pactid == "all") //請求のあるpactidを取得する
			//$sql = "select pactid from addbill_".$tableNo."_tb group by pactid";
			//$pact_list = $this->get_DB()->queryCol($sql);
			//取得したpactidごとに取得する
			{
				var tableNo = MtTableUtil.getTableNo(billdate, false);
				var sql = "(select pactid from addbill_tb where delete_flg=false and confirm_flg=true group by pactid) union" + "(select pactid from addbill_" + tableNo + "_tb group by pactid)";
				var pact_list = this.get_DB().queryCol(sql);

				for (var value of Object.values(pact_list)) {
					res.push({
						pactid: value,
						year: year,
						coid: 0,
						month: month,
						status: 0
					});
				}
			} else //pactidの存在チェック
			//指定されたpactidが存在するか・・
			{
				sql = "select pactid from pact_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
				var check = this.get_DB().queryCol(sql);

				if (!check) {
					this.infoOut("pactid=" + pactid + " \u306F\u5B58\u5728\u3057\u306A\u3044\u305F\u3081\u3001\u51E6\u7406\u3092\u884C\u3044\u307E\u305B\u3093\u3002\n", 1);
					return Array();
				}

				res.push({
					pactid: pactid,
					year: year,
					month: month,
					coid: 0,
					status: 0
				});
			}

		return res;
	}

	updateRecalcBillHistoryLog(pactid, year, month, status) {
		var sql = "UPDATE addbill_bill_history_tb SET status = '2' " + "where " + "pactid = " + pactid + " and year = " + year + " and month = " + month + " and status = '" + status + "'";
		this.get_DB().query(sql);
	}

	InsertCalcBillHistoryLog(pactid, year, month, nowtime) //請求履歴テーブルに集計時間を挿入するよ
	//DB用に整形する
	//columnを取得
	//SQL作成するぽよ
	//実行するぽよ
	{
		var data = {
			pactid: this.get_DB().dbQuote(pactid, "integer", true),
			year: this.get_DB().dbQuote(year, "integer", true),
			month: this.get_DB().dbQuote(month, "integer", true),
			recdate: this.get_DB().dbQuote(nowtime, "date", true),
			username: this.get_DB().dbQuote("calc_addbill", "text", true),
			status: this.get_DB().dbQuote("2C", "text", true),
			coid: this.get_DB().dbQuote("0", "integer", true)
		};
		var columns = Object.keys(data);
		var insert_sql = "INSERT INTO addbill_bill_history_tb(" + columns.join(",") + ")values(" + data.join(",") + ")";
		this.get_DB().query(insert_sql);
	}

	makeAddBillInsert(tablename, value, confirm_flg) //addbill_tbの確定になっているものをaddbill_xx_tbにいれる
	//DB用にデータを整形する
	//column
	{
		var data = {
			pactid: this.get_DB().dbQuote(value.pactid, "integer", true),
			postid: this.get_DB().dbQuote(value.postid, "integer", true),
			userid: this.get_DB().dbQuote(value.userid, "integer", true),
			tempid: this.get_DB().dbQuote(value.tempid, "integer", true),
			addbillid: this.get_DB().dbQuote(value.addbillid, "text", true),
			addbillid_sub: this.get_DB().dbQuote(value.addbillid_sub, "integer", true),
			coid: this.get_DB().dbQuote(value.coid, "integer", true),
			class1: this.get_DB().dbQuote(value.class1, "text", true),
			class2: this.get_DB().dbQuote(value.class2, "text", true),
			class3: this.get_DB().dbQuote(value.class3, "text", true),
			productcode: this.get_DB().dbQuote(value.productcode, "text", true),
			productname: this.get_DB().dbQuote(value.productname, "text", true),
			num: this.get_DB().dbQuote(value.num, "integer", true),
			price: this.get_DB().dbQuote(value.price, "integer", true),
			cost: this.get_DB().dbQuote(value.cost, "integer", true),
			tax: this.get_DB().dbQuote(value.tax, "integer", true),
			acceptdate: this.get_DB().dbQuote(value.acceptdate, "timestamp", true),
			deliverydate: this.get_DB().dbQuote(value.deliverydate, "timestamp", true),
			delivery_dest: this.get_DB().dbQuote(value.delivery_dest, "text", true),
			card_name: this.get_DB().dbQuote(value.card_name, "text", true),
			comment: this.get_DB().dbQuote(value.comment, "text", true),
			dummy_flg: this.get_DB().dbQuote(value.dummy_flg, "bool", true),
			delete_flg: this.get_DB().dbQuote(false, "bool", true),
			confirm_flg: this.get_DB().dbQuote(confirm_flg, "bool", true),
			update: this.get_DB().dbQuote(value.update, "timestamp", true),
			recdate: this.get_DB().dbQuote(value.recdate, "timestamp", true)
		};
		var keys = Object.keys(data);
		return "insert into " + tablename + "(" + keys.join(",") + ")values(" + data.join(",") + ")";
	}

	makeConfirmSQL(pactid, tableNo) //------------------------------------------------------------------------------------------
	//過去月の部署を取得する
	//対象リストを取得
	//請求ごとに処理
	{
		var sql_list = Array();
		var sql = "select postid from post_" + tableNo + "_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", undefined);
		var post_list = this.get_DB().queryCol(sql);

		if (is_null(post_list)) {
			post_list = Array();
		}

		sql = "select * from addbill_tb" + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and confirm_flg=true" + " and delete_flg=false";
		var tgt_list = this.get_DB().queryHash(sql);

		for (var value of Object.values(tgt_list)) //コピーしたaddbill_tbのものは、delete_flgをtrueにする
		{
			if (!(-1 !== post_list.indexOf(value.postid))) {
				this.infoOut(value.addbillid + "," + value.addbillid_sub + " \u306F\u767B\u9332\u90E8\u7F72\u304C\u904E\u53BB\u6708\u306B\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n", 1);
				continue;
			}

			sql_list.push(this.makeAddBillInsert("addbill_" + tableNo + "_tb", value, true));
			sql_list.push("update addbill_tb set delete_flg=true" + " where" + " pactid=" + this.get_DB().dbQuote(value.pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(value.addbillid, "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(value.addbillid_sub, "integer", true) + " and delete_flg=false");
		}

		return sql_list;
	}

	makeUnsettledSQL(pactid, tableNo) //請求にて未確定になっているものを取得
	//請求ごとに処理
	{
		var sql_list = Array();
		var sql = "select * from addbill_" + tableNo + "_tb" + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and confirm_flg=false" + " and delete_flg=false";
		var tgt_list = this.get_DB().queryHash(sql);

		for (var value of Object.values(tgt_list)) //addbill_tbで同じaddbillidがある場合は削除する
		//未確定になったものをaddbill_tbにいれる
		//コピーしたaddbill_xx_tbのものは、削除を行う
		{
			sql_list.push("delete from addbill_tb" + " where" + " pactid=" + this.get_DB().dbQuote(value.pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(value.addbillid, "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(value.addbillid_sub, "integer", true));
			sql_list.push(this.makeAddBillInsert("addbill_tb", value, false));
			sql_list.push("delete from addbill_" + tableNo + "_tb" + " where" + " pactid=" + this.get_DB().dbQuote(value.pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(value.addbillid, "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(value.addbillid_sub, "integer", true));
		}

		return sql_list;
	}

	getPostRelation(pactid, tableno = "") {
		var tablename = MtTableUtil.makeTableName("post_relation_tb", tableno);
		var sql = "select postidchild,postidparent,level" + " from " + tablename + " where " + " pactid=" + pactid + " order by level";
		return this.getDB().queryHash(sql);
	}

	getChildList(postid, H_post_rel) {
		var A_result = Array();
		var H_postid = Array();

		for (var key in H_post_rel) {
			var value = H_post_rel[key];
			var lvl = value.level;
			var pid = value.postidparent;
			var cid = value.postidchild;

			if (chk == false) {
				if (cid == postid) {
					var chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_result.push(cid);
				}
			} else {
				if (lvl > level) {
					if (undefined !== H_postid[pid] == true && H_postid[pid] == true) {
						H_postid[cid] = true;
						A_result.push(cid);
					}
				}
			}
		}

		delete H_postid;
		return A_result;
	}

	makeBillPostData(pactid, tableNo, nowtime) //配下部署を取得します
	//戻値用
	//対象のテーブル名を作成
	//部署一覧の取得
	//計算対象の種別の取得
	//INSERT用データ作成する。arrayのkeyの配列もここで固定しておく
	//部署のリレーションを取得する
	//部署ごとに合計を求めていく
	{
		var O_Post = new PostModel();
		var bill_post = Array();
		var addbill_tb = "addbill_" + tableNo + "_tb";
		var addbill_post_bill_tb = "addbill_post_bill_" + tableNo + "_tb";
		var post_tb = "post_" + tableNo + "_tb";
		var sql = "select postid from " + post_tb + " where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var post_list = this.get_DB().queryCol(sql);
		sql = "select coid from addbill_co_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var co_list = this.get_DB().queryCol(sql);
		var ins_data = Array();
		ins_data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		ins_data.postid = 0;
		ins_data.coid = 0;
		ins_data.cnt = 0;
		ins_data.num = 0;
		ins_data.price = 0;
		ins_data.tax = 0;
		ins_data.flag = 0;
		ins_data.recdate = this.get_DB().dbQuote(nowtime, "timestamp", true);
		var co_data = Array();

		for (var coid of Object.values(co_list)) //部署ごとの合計を求める
		{
			sql = "select" + " postid" + ",count(*) AS cnt" + ",coalesce(SUM(num),0) AS num" + ",coalesce(SUM(price),0) AS price" + ",coalesce(SUM(tax),0) AS tax" + " from " + addbill_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and coid =" + this.get_DB().dbQuote(coid, "integer", true) + " and confirm_flg = true" + " group by postid";
			co_bill[coid] = this.get_DB().queryKeyAssoc(sql);
		}

		var H_post_rel = this.getPostRelation(pactid, tableNo);

		for (var postid of Object.values(post_list)) //配下部署の取得を行う
		//種別全ての合計(自部署のみ)
		//自部署のみでカウント
		//自部署のみで数量合計
		//自部署のみで金額合計
		//自部署のみで税額合計
		//種別全ての合計(配下部署込み)
		//自部署のみでカウント
		//配下部署込みで数量合計
		//配下部署込みで金額合計
		//配下部署込みで税額合計
		//部署ID設定
		//種別ごとに計算を行うよ
		//種別の設定
		//種別全ての自部署のみのデータを作成
		//種別全ての配下部署込みのデータを作成
		{
			var post_under = this.getChildList(postid, H_post_rel);
			var total_only_cnt = 0;
			var total_only_num = 0;
			var total_only_price = 0;
			var total_only_tax = 0;
			var total_under_cnt = 0;
			var total_under_num = 0;
			var total_under_price = 0;
			var total_under_tax = 0;
			ins_data.postid = this.get_DB().dbQuote(postid, "integer", true);

			for (var coid of Object.values(co_list)) //自部署のみの合計
			//配下部署
			//種別の設定
			//部署合計を求める
			//配下部署込みの合計を求める
			//配下部署込みのデータを作成
			//自部署のみの合計を加算
			//配下部署込みの合計を加算
			{
				var only_cnt = 0;
				var only_num = 0;
				var only_price = 0;
				var only_tax = 0;
				var under_cnt = 0;
				var under_num = 0;
				var under_price = 0;
				var under_tax = 0;
				ins_data.coid = this.get_DB().dbQuote(coid, "integer", true);

				if (undefined !== co_bill[coid][postid]) {
					only_cnt = co_bill[coid][postid].cnt;
					only_num = co_bill[coid][postid].num;
					only_price = co_bill[coid][postid].price;
					only_tax = co_bill[coid][postid].tax;
				}

				ins_data.cnt = this.get_DB().dbQuote(only_cnt, "integer", true);
				ins_data.num = this.get_DB().dbQuote(only_num, "integer", true);
				ins_data.price = this.get_DB().dbQuote(only_price, "integer", true);
				ins_data.tax = this.get_DB().dbQuote(only_tax, "integer", true);
				ins_data.flag = this.get_DB().dbQuote(0, "integer", true);
				bill_post.push(ins_data);

				for (var pid of Object.values(post_under)) {
					if (undefined !== co_bill[coid][pid]) {
						under_cnt += co_bill[coid][pid].cnt;
						under_num += co_bill[coid][pid].num;
						under_price += co_bill[coid][pid].price;
						under_tax += co_bill[coid][pid].tax;
					}
				}

				ins_data.cnt = this.get_DB().dbQuote(under_cnt, "integer", true);
				ins_data.num = this.get_DB().dbQuote(under_num, "integer", true);
				ins_data.price = this.get_DB().dbQuote(under_price, "integer", true);
				ins_data.tax = this.get_DB().dbQuote(under_tax, "integer", true);
				ins_data.flag = this.get_DB().dbQuote(1, "integer", true);
				bill_post.push(ins_data);
				total_only_cnt += only_cnt;
				total_only_num += only_num;
				total_only_price += only_price;
				total_only_tax += only_tax;
				total_under_cnt += under_cnt;
				total_under_num += under_num;
				total_under_price += under_price;
				total_under_tax += under_tax;
			}

			ins_data.coid = this.get_DB().dbQuote(0, "integer", true);
			ins_data.cnt = this.get_DB().dbQuote(total_only_cnt, "integer", true);
			ins_data.num = this.get_DB().dbQuote(total_only_num, "integer", true);
			ins_data.price = this.get_DB().dbQuote(total_only_price, "integer", true);
			ins_data.tax = this.get_DB().dbQuote(total_only_tax, "integer", true);
			ins_data.flag = this.get_DB().dbQuote(0, "integer", true);
			bill_post.push(ins_data);
			ins_data.cnt = this.get_DB().dbQuote(total_under_cnt, "integer", true);
			ins_data.num = this.get_DB().dbQuote(total_under_num, "integer", true);
			ins_data.price = this.get_DB().dbQuote(total_under_price, "integer", true);
			ins_data.tax = this.get_DB().dbQuote(total_under_tax, "integer", true);
			ins_data.flag = this.get_DB().dbQuote(1, "integer", true);
			bill_post.push(ins_data);
		}

		return bill_post;
	}

	deleteBillPost(pactid, tableNo) {
		var addbill_post_bill_tb = "addbill_post_bill_" + tableNo + "_tb";
		var sql = "delete from " + addbill_post_bill_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		this.get_DB().query(sql);
	}

	update(pactid, tableNo, nowtime, confirm_flg, recalc_flg) //ここでの流れとしては・・
	//			addbill_tbの確定になっているものをaddbill_xx_tbにコピーする	
	//			コピーしたaddbill_tbのものはdelete_flgをtrueにする
	//トランザクション開始
	//---------------------------------------------------------------------
	//addbill_tbの未確定を確定にする。
	//---------------------------------------------------------------------
	//SQL実行
	//既存の部署削除
	//請求データの作成
	//addbill_post_biall_xx_tbに流し込み
	//コミット
	{
		this.infoOut("pactid(" + pactid + ")\u306E\u8A08\u7B97\u958B\u59CB\n", 1);
		this.get_DB().beginTransaction();

		if (confirm_flg) //SQL実行
			{
				var confirm_sql = this.makeConfirmSql(pactid, tableNo);

				if (!!confirm_sql) {
					for (var sql of Object.values(confirm_sql)) //レコードが余分にインサート、アップデートされてないか確認する
					{
						var tmpcnt = this.get_DB().exec(sql);

						if (tmpcnt != 1) //問題が発生したのでロールバックして終了
							{
								this.get_DB().rollback();
								this.errorOut(1000, "\n\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F[" + sql + "]\n", 0, "", "");
								return false;
							}
					}
				}
			}

		var unsettled_sql = this.makeUnsettledSQL(pactid, tableNo);

		for (var sql of Object.values(unsettled_sql)) //レコードが余分にインサート、アップデートされてないか確認する
		{
			tmpcnt = this.get_DB().exec(sql);
			var error = false;

			if (preg_match("/^delete/", sql)) {
				if (tmpcnt > 1) {
					error = true;
				}
			} else {
				if (tmpcnt != 1) {
					error = true;
				}
			}

			if (error) //問題が発生したのでロールバックして終了
				{
					this.get_DB().rollback();
					this.errorOut(1000, "\n\u8ACB\u6C42\u304B\u3089\u672A\u78BA\u5B9A\u3078\u306E\u79FB\u52D5\u306B\u5931\u6557[" + tmpcnt + "," + sql + "]\n", 0, "", "");
					return false;
				}
		}

		this.deleteBillPost(pactid, tableNo);
		var bill_post = this.makeBillPostData(pactid, tableNo, nowtime);

		if (!!bill_post) //healthcare_bill_X_tb取込失敗
			{
				var table = "addbill_post_bill_" + tableNo + "_tb";
				var rtn = this.get_DB().pgCopyFromArray(table, bill_post);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + table + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					return false;
				} else {
					this.infoOut(table + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		this.infoOut("\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
		this.get_DB().commit();
		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};