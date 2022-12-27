//
//ICCardPrintOutPersonalModel
//交通費出力PDFモデル
//@uses ModelBase
//@package
//@author date
//@since 2015/11/02
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("TableMake.php");

require("MtTableUtil.php");

require("model/PostModel.php");

require("MtPostUtil.php");

//
//__construct
//コンストラクタ
//@author date
//@since 2015/11/02
//
//@param mixed $O_db0
//@param mixed $H_g_sess
//@access public
//@return void
//
//
//getFrom
//開始月を取得する
//@author date
//@since 2016/04/08
//
//@param mixed $datefrom
//@param mixed $time_limit_from
//@param mixed $time_limit_to
//@access private
//@return void
//
//
//getTo
//終了月を取得する
//@author web
//@since 2016/04/08
//
//@param mixed $dateto
//@param mixed $time_limit_from
//@param mixed $time_limit_to
//@access private
//@return void
//
//
//findUser
//
//@author web
//@since 2016/03/28
//
//@param mixed $pactid
//@param mixed $username
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author date
//@since 2015/11/02
//
//@access public
//@return void
//
class GetStepModel extends ModelBase {
	constructor(O_db0) {
		super(O_db0);
	}

	getFrom(datefrom, time_limit_from, time_limit_to) //データ取得開始月を求める
	//今月より後なら取得できるものはない
	{
		var y = +datefrom.substr(0, 4);
		var m = +datefrom.substr(4, 2);
		var d = +datefrom.substr(6, 2);
		var time_from = mktime(0, 0, 0, m, d, y);

		if (time_from > time_limit_to) {
			return undefined;
		}

		if (time_from < time_limit_from) {
			time_from = time_limit_from;
		}

		from.y = +date("Y", time_from);
		from.m = +date("m", time_from);
		from.d = +date("d", time_from);
		from.date = from.y + "-" + from.m + "-" + from.d;
		from.date = sprintf("%04d-%02d-%02d", from.y, from.m, from.d);
		return from;
	}

	getTo(dateto, time_limit_from, time_limit_to) //データ取得終了日を調べる
	//取得終了
	{
		if (!dateto) //指定されてない場合は今月の末日を指定する
			{
				var time_to = time_limit_to;
			} else //toが2年前なら取得出来るデータはない
			{
				var y = +dateto.substr(0, 4);
				var m = +dateto.substr(4, 2);
				var d = +dateto.substr(6, 2);
				time_to = mktime(0, 0, 0, m, d, y);

				if (time_to < time_limit_from) {
					return Array();
				}

				if (time_to > time_limit_to) {
					time_to = time_limit_to;
				}
			}

		to.y = +date("Y", time_to);
		to.m = +date("m", time_to);
		to.d = +date("d", time_to);
		to.date = sprintf("%04d-%02d-%02d", to.y, to.m, to.d);
		return to;
	}

	getStep(datefrom, dateto, user_list, id) //取得出来る期間を設定する。データは過去2年分しかない
	//ここより前は取得しない
	//ここより後は取得しない
	//取得From
	//取得To
	//条件文を作成する
	//ユーザーリストの条件文を作成する
	//テーブル毎に取得していく
	{
		var year_now = date("Y");
		var month_now = date("m");
		var time_limit_from = mktime(0, 0, 0, month_now + 1, 1, year_now - 2);
		var time_limit_to = mktime(0, 0, 0, month_now + 1, 0, year_now);
		var from = this.getFrom(datefrom, time_limit_from, time_limit_to);
		var to = this.getTo(dateto, time_limit_from, time_limit_to);
		var where = " WHERE " + " datadate >= " + this.get_DB().dbQuote(from.date, "date", true) + " AND datadate <= " + this.get_DB().dbQuote(to.date, "date", true);

		if (!!user_list) //ユーザーリストの条件を付与する
			{
				var where_user = "";

				for (var key in user_list) //足してく
				{
					var value = user_list[key];

					if (where_user != "") {
						where_user += " OR ";
					}

					where_user += "(" + " pact.userid_ini = " + this.get_DB().dbQuote(value.pactcode, "text", true) + " and hlt.healthid = " + this.get_DB().dbQuote(value.telno, "text", true) + ")";
				}

				if (where_user != "") {
					where += " and (" + where_user + ")";
				}
			}

		var key_list = Array();
		var result = Array();
		result.jsonrpc = "2.0";
		result.id = id;
		result.result = Array();

		for (var y = from.y; y <= to.y; y++) {
			var month_start = y == from.y ? from.m : 1;
			var month_end = y == to.y ? to.m : 12;

			for (var m = month_start; m <= month_end; m++) //データの取得
			//if( $year_now == $y && $month_now == $m ){
			//					$healthcare_tb = "healthcare_tb";
			//					$post_tb = "post_tb";
			//				}else{
			//					$healthcare_tb = "healthcare_".$tableNo."_tb";
			//					$post_tb = "post_".$tableNo."_tb";
			//				}
			//結果に積んでく
			{
				var date = sprintf("%04d%02d", y, m);
				var tableNo = MtTableUtil.getTableNo(date, false);
				var healthcare_tb = "healthcare_" + tableNo + "_tb";
				var post_tb = "post_" + tableNo + "_tb";
				var sql = "select" + " rec.healthid as telno" + ",rec.datadate as walkday" + ",pact.userid_ini as pactcode" + ",pact.compname as pactname" + ",post.postid" + ",post.postname" + ",rec.gender as sex" + ",rec.birthday" + ",rec.height" + ",rec.weight" + ",rec.metabolism as bm_cal" + ",rec.steps as number_of_steps" + ",rec.move as moving_distance" + ",rec.calories as used_cal" + ",rec.amount_fatburned as fat_combustion" + ",rec.sleep as time_of_sleeping" + ",rec.measurement_start as measuring_time" + ",rec.onset_sleep as sleep_onset_time" + ",rec.wakeup as awakening_hours" + ",rec.arousal_during_sleep as nocturnal_awakening" + " from  healthcare_rechistory_" + tableNo + "_tb as rec" + " join pact_tb pact on pact.pactid = rec.pactid" + " join " + healthcare_tb + " hlt on hlt.healthid = rec.healthid" + " join " + post_tb + " post on post.postid = hlt.postid" + where;
				var res = this.get_DB().queryHash(sql);

				for (var value of Object.values(res)) //新しい電話番号なら初期化する
				//wmdataに必要のないデータを消す
				//足してく
				{
					var key = value.pactcode + "," + value.pactname + "," + value.telno;

					if (!(undefined !== key_list[key])) {
						var no;
						key_list[key] = no = key_list.length;
						result.result[no].pactcode = value.pactcode;
						result.result[no].pactname = value.pactname;
						result.result[no].telno = value.telno;
						result.result[no].wm_data = Array();
					} else {
						no = key_list[key];
					}

					value.userpostid = value.pactcode + "_" + value.postid;
					delete value.telno;
					delete value.pactcode;
					delete value.pactname;
					result.result[no].wm_data.push(value);
				}
			}
		}

		return result;
	}

	__destruct() {
		super.__destruct();
	}

};