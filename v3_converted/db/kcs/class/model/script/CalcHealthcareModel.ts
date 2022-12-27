//
//ドコモヘルスケア計算（Model）
//
//更新履歴：<br>
//2015/06/25 date 作成
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
//deleteHealthcareBill
//指定した会社の削除を行う
//@author web
//@since 2015/06/23
//
//@param mixed $tableNo
//@param mixed $pactid
//@param mixed $healthcoid
//@access public
//@return void
//
//
//deleteHealthcarePostBill
//指定した会社の削除を行う
//@author web
//@since 2015/06/23
//
//@param mixed $tableNo
//@param mixed $pactid
//@param mixed $healthcoid
//@access public
//@return void
//
//
//insertHealthcareBill
//healthcare_bill_xx_tbのinsert文の作成
//@author web
//@since 2015/06/23
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
//計算要求のきているやつを返す
//@author web
//@since 2015/06/23
//
//@access public
//@return void
//
//
//updateBillHistory
//再計算のアップデート。計算済みにする
//@author web
//@since 2015/06/23
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
//update
//計算開始
//@author date
//@since 2015/06/24
//
//@param mixed $pactid
//@param mixed $healthcoid
//@param mixed $tableNo
//@access public
//@return void
//
//
//__destruct
//
//@author miyazawa
//@since 2010/02/03
//
//@access public
//@return void
//
class CalcHealthcareModel extends ModelBase {
	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	//ここにカラム追加すれば計算してくれるよ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
		this.O_Post = new PostModel();
		this.A_calc_column = ["steps", "calories", "move"];
	}

	getNow() {
		return this.get_DB().getNow();
	}

	deleteHealthcareBill(tableNo, pactid, healthcoid) //$sql = "DELETE FROM healthcare_bill_".$no."_tb WHERE pactid=".$pactid." and healthcoid=".$healthcoid;
	{
		var no = sprintf("%02d", tableNo);
		var sql = "DELETE FROM healthcare_bill_" + no + "_tb WHERE pactid=" + pactid;
		this.getDB().query(sql);
	}

	deleteHealthcarePostBill(tableNo, pactid, healthcoid) //$sql = "DELETE FROM healthcare_post_bill_".$no."_tb WHERE pactid=".$pactid." and healthcoid=".$healthcoid;
	{
		var no = sprintf("%02d", tableNo);
		var sql = "DELETE FROM healthcare_post_bill_" + no + "_tb WHERE pactid=" + pactid;
		this.getDB().query(sql);
	}

	getHealthcareBill(tableNo, pactid) //selectとgroup byで使うもの
	//集計用
	//ヘルスケアIDごとのもの
	{
		var select = ["hlt.pactid", "hlt.healthid", "hlt.postid", "hlt.healthcoid"];
		var select_sum = Array();

		for (var column of Object.values(this.A_calc_column)) {
			select_sum.push("coalesce(sum(rec." + column + "),0) as " + column);
		}

		var sql = "SELECT " + select.join(",") + "," + select_sum.join(",") + " FROM healthcare_" + tableNo + "_tb as hlt" + " join healthcare_rechistory_" + tableNo + "_tb rec on hlt.healthid=rec.healthid and hlt.pactid=rec.pactid and hlt.healthcoid=rec.healthcoid " + "WHERE hlt.pactid=" + pactid + "  GROUP BY " + select.join(",");
		var res = this.getDB().queryHash(sql);
		return res;
	}

	getBillHistory(pactid, billdate) //日付指定
	{
		var sql = "SELECT pactid,year,month,healthcoid,status " + "FROM healthcare_bill_history_tb where status = '0'";

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

		if (pactid == "all") {
			var tableNo = MtTableUtil.getTableNo(billdate, false);
			var sql = "select pactid from healthcare_rechistory_" + tableNo + "_tb group by pactid";
			var pact_list = this.get_DB().queryCol(sql);

			for (var value of Object.values(pact_list)) {
				res.push({
					pactid: value,
					year: year,
					month: month,
					healthcoid: 0,
					status: 0
				});
			}
		} else {
			res.push({
				pactid: pactid,
				year: year,
				month: month,
				healthcoid: 0,
				status: 0
			});
		}

		return res;
	}

	updateBillHistory(pactid, year, month, healthcoid, status) {
		var sql = "UPDATE healthcare_bill_history_tb SET status = '2' " + "where " + "pactid = " + pactid + " and year = " + year + " and month = " + month + " and healthcoid = " + healthcoid + " and status = '" + status + "'";
		this.get_DB().query(sql);
	}

	InsertBillHistoryLog(pactid, year, month, healthcoid, nowtime) //請求履歴テーブルに集計時間を挿入
	{
		var insert_sql = "INSERT INTO healthcare_bill_history_tb(pactid,year,month,healthcoid,recdate,username,status)values(" + this.get_DB().dbQuote(pactid, "integer", true) + "," + this.get_DB().dbQuote(year, "integer", true) + "," + this.get_DB().dbQuote(month, "integer", true) + "," + this.get_DB().dbQuote(healthcoid, "integer", true) + "," + this.get_DB().dbQuote(nowtime, "date", true) + "," + "'calc_healthcare'," + "'2C')";
		this.get_DB().query(insert_sql);
	}

	update(pactid, healthcoid, tableNo, nowtime) //ルート部署を取得します
	//全部署取得
	//合計値の計算用の入れ物を用意する
	//healthcare_rechistoryから歩数合計を求めるよ
	//部署ごとのヘルスケアID数と歩数合計を求める
	//配下部署合計
	//DBに反映するぽよ
	//トランザクション開始
	//healthcare_bill_xx_tbを削除
	//healthcare_post_bill_xx_tbを削除
	//healthcare_bill_xx_tbへデータ取込
	{
		this.infoOut("pactid(" + pactid + ")\u306E\u518D\u8A08\u7B97\u958B\u59CB\n", 1);
		var outputBill = Array();
		var outputPostBill = Array();
		var post_root = this.O_Post.getRootPostid(pactid);
		var post_all = this.O_Post.getChildList(pactid, post_root, tableNo);
		var post_sum = Array();

		for (var postid of Object.values(post_all)) {
			post_sum[postid] = {
				local: Array(),
				all: Array()
			};

			for (var coid = 0; coid <= 1; coid++) {
				var temp = {
					healthid_num: 0
				};

				for (var value of Object.values(this.A_calc_column)) {
					temp[value] = 0;
				}

				post_sum[postid].local[coid] = temp;
				post_sum[postid].all[coid] = temp;
			}
		}

		var healthcare_bill = this.getHealthcareBill(tableNo, pactid);

		for (var bill of Object.values(healthcare_bill)) //$coid = $bill["healthcoid"];
		//メーカー問わず合計(でも今はメーカー一社しかないから・・)
		//データの集計
		//healthcare_bill_xx_tbへのコピー用データの作成
		//カラムの順番で追加してく
		//カラムの追加
		//時間追加
		//登録
		{
			var postid = bill.postid;
			post_sum[postid].local[0].healthid_num += 1;
			post_sum[postid].local[1].healthid_num += 1;

			for (var value of Object.values(this.A_calc_column)) {
				post_sum[postid].local[0][value] += bill[value];
				post_sum[postid].local[1][value] += bill[value];
			}

			var output = [pactid, postid, bill.healthid, bill.healthcoid];

			for (var value of Object.values(this.A_calc_column)) {
				output.push(bill[value]);
			}

			output.push(nowtime);
			outputBill.push(output);
		}

		for (var postid of Object.values(post_all)) //配下部署一覧の取得
		//配下部署の歩数を足していく。
		//post_bill用のデータ作成
		//healthcare_post_bill_xx_tb(pactid,postid,flag,recdate,coid,steps,healthid_num)
		{
			var child = this.O_Post.getChildList(pactid, postid, tableNo);

			for (var child_postid of Object.values(child)) {
				post_sum[postid].all[0].healthid_num += post_sum[child_postid].local[0].healthid_num;
				post_sum[postid].all[1].healthid_num += post_sum[child_postid].local[1].healthid_num;

				for (var value of Object.values(this.A_calc_column)) {
					post_sum[postid].all[0][value] += post_sum[child_postid].local[0][value];
					post_sum[postid].all[1][value] += post_sum[child_postid].local[1][value];
				}
			}

			for (coid = 0;; coid <= 1; coid++) //データの配列通りにデータ作る
			//全て自分部署のみ
			//全て配下部署込み
			{
				var data0 = [pactid, postid, "0", nowtime, coid];
				var data1 = [pactid, postid, "1", nowtime, coid];

				for (var column of Object.values(this.A_calc_column)) {
					data0.push(post_sum[postid].local[coid][column]);
					data1.push(post_sum[postid].all[coid][column]);
				}

				data0.push(post_sum[postid].local[coid].healthid_num);
				data1.push(post_sum[postid].all[coid].healthid_num);
				outputPostBill.push(data0);
				outputPostBill.push(data1);
			}
		}

		this.get_DB().beginTransaction();
		this.deleteHealthcareBill(tableNo, pactid, healthcoid);
		this.deleteHealthcarePostBill(tableNo, pactid, healthcoid);

		if (0 != outputBill.length) //healthcare_bill_X_tb取込失敗
			{
				var table = "healthcare_bill_" + tableNo + "_tb";
				var rtn = this.get_DB().pgCopyFromArray(table, outputBill);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + table + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					return false;
				} else {
					this.infoOut(table + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		if (0 != outputPostBill.length) //healthcare_bill_X_tb取込失敗
			{
				table = "healthcare_post_bill_" + tableNo + "_tb";
				rtn = this.get_DB().pgCopyFromArray(table, outputPostBill);

				if (rtn == false) {
					this.get_DB().rollback();
					this.errorOut(1000, "\n" + table + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
					return false;
				} else {
					this.infoOut(table + " \u3078\u30C7\u30FC\u30BF\u30FC\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n", 1);
				}
			}

		this.get_DB().commit();
		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};