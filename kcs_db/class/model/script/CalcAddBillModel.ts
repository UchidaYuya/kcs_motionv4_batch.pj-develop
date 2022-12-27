

import MtScriptAmbient from "../../MtScriptAmbient";
import MtTableUtil from "../../MtTableUtil";
import ModelBase from "../ModelBase";
import PostModel from "../PostModel";


export default class CalcAddBillModel extends ModelBase {
	O_msa: MtScriptAmbient;
	O_Post: PostModel;
	A_calc_column: string[];
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
			{
				sql = "select pactid from pact_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
				var check = this.get_DB().queryCol(sql);

				if (!check) {
					this.infoOut("pactid=" + pactid + " は存在しないため、処理を行いません。\n", 1);
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
	{
		var data: any = {
			pactid: this.get_DB().dbQuote(pactid, "integer", true),
			year: this.get_DB().dbQuote(year, "integer", true),
			month: this.get_DB().dbQuote(month, "integer", true),
			recdate: this.get_DB().dbQuote(nowtime, "date", true),
			username: this.get_DB().dbQuote("calc_addbill", "text", true),
			status: this.get_DB().dbQuote("2C", "text", true),
			coid: this.get_DB().dbQuote("0", "integer", true)
		};
		var columns: string[] = Object.keys(data);
		var insert_sql = "INSERT INTO addbill_bill_history_tb(" + columns.join(",") + ")values(" + data.join(",") + ")";
		this.get_DB().query(insert_sql);
	}

	makeAddBillInsert(tablename, value, confirm_flg) //addbill_tbの確定になっているものをaddbill_xx_tbにいれる
	//DB用にデータを整形する
	{
		var data: any = {
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
		var keys: string[] = Object.keys(data);
		return "insert into " + tablename + "(" + keys.join(",") + ")values(" + data.join(",") + ")";
	}

	async makeConfirmSQL(pactid, tableNo) //------------------------------------------------------------------------------------------
	{
		var sql_list = Array();
		var sql = "select postid from post_" + tableNo + "_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", undefined);
		var post_list = await this.get_DB().queryCol(sql);

		if (!post_list) {
			post_list = Array();
		}

		sql = "select * from addbill_tb" + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and confirm_flg=true" + " and delete_flg=false";
		var tgt_list = await this.get_DB().queryHash(sql);

		for (var value of tgt_list) //コピーしたaddbill_tbのものは、delete_flgをtrueにする
		{
			if (!(-1 !== post_list.indexOf(value.postid))) {
				this.infoOut(value.addbillid + "," + value.addbillid_sub + " は登録部署が過去月にありませんでした。\n", 1);
				continue;
			}

			sql_list.push(this.makeAddBillInsert("addbill_" + tableNo + "_tb", value, true));
			sql_list.push("update addbill_tb set delete_flg=true" + " where" + " pactid=" + this.get_DB().dbQuote(value.pactid, "integer", true) + " and addbillid=" + this.get_DB().dbQuote(value.addbillid, "text", true) + " and addbillid_sub=" + this.get_DB().dbQuote(value.addbillid_sub, "integer", true) + " and delete_flg=false");
		}

		return sql_list;
	}

	async makeUnsettledSQL(pactid, tableNo) //請求にて未確定になっているものを取得
	{
		var sql_list = Array();
		var sql = "select * from addbill_" + tableNo + "_tb" + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and confirm_flg=false" + " and delete_flg=false";
		var tgt_list = await this.get_DB().queryHash(sql);

		for (var value of tgt_list) //addbill_tbで同じaddbillidがある場合は削除する
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

			var chk;
			if (chk == false) {
				if (cid == postid) {
					chk = true;
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

		delete H_postid[""];
		return A_result;
	}

	async makeBillPostData(pactid: number, tableNo: string, nowtime: string) //配下部署を取得します
	{
		var O_Post = new PostModel();
		var bill_post = Array();
		var addbill_tb = "addbill_" + tableNo + "_tb";
		var addbill_post_bill_tb = "addbill_post_bill_" + tableNo + "_tb";
		var post_tb = "post_" + tableNo + "_tb";
		var sql = "select postid from " + post_tb + " where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var post_list = await this.get_DB().queryCol(sql);
		sql = "select coid from addbill_co_tb where pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		var co_list = await this.get_DB().queryCol(sql);
		var ins_data: any = Array();
		ins_data.pactid = this.get_DB().dbQuote(pactid, "integer", true);
		ins_data.postid = 0;
		ins_data.coid = 0;
		ins_data.cnt = 0;
		ins_data.num = 0;
		ins_data.price = 0;
		ins_data.tax = 0;
		ins_data.flag = 0;
		ins_data.recdate = await this.get_DB().dbQuote(nowtime, "timestamp", true);
		var co_data = Array();
		var co_bill: any = Array();

		for (var coid of co_list) //部署ごとの合計を求める
		{
			sql = "select" + " postid" + ",count(*) AS cnt" + ",coalesce(SUM(num),0) AS num" + ",coalesce(SUM(price),0) AS price" + ",coalesce(SUM(tax),0) AS tax" + " from " + addbill_tb + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true) + " and coid =" + this.get_DB().dbQuote(coid, "integer", true) + " and confirm_flg = true" + " group by postid";
			co_bill[coid] = this.get_DB().queryKeyAssoc(sql);
		}

		var H_post_rel =  this.getPostRelation(pactid, tableNo);

		for (var postid of post_list) //配下部署の取得を行う
		
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

			for (var coid of co_list) //自部署のみの合計
		
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

	async update(pactid:number, tableNo: string, nowtime: string, confirm_flg: boolean, recalc_flg: boolean) //ここでの流れとしては・・
	{
		this.infoOut("pactid(" + pactid + ")の計算開始\n", 1);
		this.get_DB().beginTransaction();

		if (confirm_flg) //SQL実行
			{
				var confirm_sql = this.makeConfirmSQL(pactid, tableNo);

				if (!!confirm_sql) {
					for (var sql of Object.values(confirm_sql)) //レコードが余分にインサート、アップデートされてないか確認する
					{
						var tmpcnt = await this.get_DB().exec(sql);

						if (tmpcnt != 1) //問題が発生したのでロールバックして終了
							{
								this.get_DB().rollback();
								this.errorOut(1000, "\nnデータ取込に失敗しました[" + sql + "]\n", 0, "", "");
								return false;
							}
					}
				}
			}

		var unsettled_sql = await this.makeUnsettledSQL(pactid, tableNo);

		for (let sql of unsettled_sql) //レコードが余分にインサート、アップデートされてないか確認する
		{
			tmpcnt = this.get_DB().exec(sql);
			var error = false;

			if ( sql.match("/^delete/")) {
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
					this.errorOut(1000, "\nn請求から未確定への移動に失敗[" + tmpcnt + "," + sql + "]\n", 0, "", "");
					return false;
				}
		}

		this.deleteBillPost(pactid, tableNo);
		var bill_post = this.makeBillPostData(pactid, tableNo, nowtime);

		if (!!bill_post) //healthcare_bill_X_tb取込失敗
			{
				var table = "addbill_post_bill_" + tableNo + "_tb";
				var rtn = await this.get_DB().pgCopyFromArray(table, bill_post);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + table + " へのデータ取込に失敗しました\n", 0, "", "");
					return false;
				} else {
					this.infoOut(table + " へのデータ取込に失敗しました\n", 1);
				}
			}

		this.infoOut(" へデーターインポート完了\n", 1);
		this.get_DB().commit();
		return true;
	}

};
