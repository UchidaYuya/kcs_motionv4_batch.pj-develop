//===========================================================================
//機能：シミュレーション他キャリア後処理
//シミュレーション計算できなかった電話を、そのまま結果にコピーすｒ
//作成：中西	2009/02/17
//===========================================================================
//このスクリプトの日本語処理名
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//DEBUG * 標準出力に出してみる.
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//２重起動防止ロックをかける。既に起動中は強制終了
//5分毎に実行なので、これはやめた *
//if(lock(true, $dbh) == false){
//$logh->putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ . LOG_DELIM
//. "２重起動です、前回エラー終了の可能性があります." );
//exit(1);
//}
///*
//開始メッセージ -- ５分に１回呼ばれるので抑制する
//$logh->putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ . LOG_DELIM . "処理開始.");
//実行要求が入っているかどうか調べる
//ステータス=未実行
//各実行要求に対する処理
//２重起動ロック解除
//lock(false, $dbh);
//終了メッセージ -- ５分に１回呼ばれるので抑制する
//$logh->putError(G_SCRIPT_END, SCRIPT_NAMEJ . LOG_DELIM . "処理完了.");
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//sim_postprocess_tb を参照して、実行要求があるかどうかを調べる
//[引　数] &$db： DBハンドル
//&$logh： Logハンドル
//[返り値] 要求のあるsimid
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//過去年月を指定した際にそれに対応したテーブル番号を取得する
//[引　数] $targetYear:対象年, $targetMonth:対象月
//$past	true:過去分データ修正用, false:現在用
//[返り値] テーブル番号
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された部署配下の部署IDを配列で返す
//
//[引　数] $postid：部署ＩＤ, $pactid：企業コード
//$tableno：post_relation_X_tbのXに入る数値(空文字列なら現在)
//[返り値] 部署IDの配列
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptask_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//&$db： DBハンドル
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u4ED6\u30AD\u30E3\u30EA\u30A2\u5F8C\u51E6\u7406";
const SCRIPTNAME = "recom_postproc.php";

require("lib/script_db.php");

require("lib/script_log.php");

const LOG_DELIM = " ";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var sql = "select simid from sim_postprocess_tb where status=0";
var H_simid = dbh.getHash(sql, true);

if (is_null(H_simid) == true) //結果なし
	//空の配列とする
	{
		H_simid = Array();
	}

sql = "select planid from plan_tb where planname like '%\u305D\u306E\u4ED6%' and planid > 3000";
var H_other = dbh.getHash(sql, true);

if (H_other == undefined || H_other.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + "\u300C\u305D\u306E\u4ED6\u300D\u306B\u8A72\u5F53\u3059\u308B\u30D7\u30E9\u30F3(id>3000)\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
	var empty_plan = undefined;
} else //１件目を取得
	{
		empty_plan = H_other[0].planid;
	}

for (var A_simid of Object.values(H_simid)) //ステータスを実行中に
// DEBUG *
//sim_index_tbより情報を得る
//もし電話番号があれば、その電話だけをコピー
//tel_details_X_tb にある全ての電話を出す
//echo $sql . "\n";	// * DEBUG *
//得られた電話番号をテーブルに追加
//ここでトランザクションをかける
//$dbh->rollback();	// * DEBUG *
//ステータスを完了に
// DEBUG *
{
	var simid = A_simid.simid;
	update_postproc(simid, 1, dbh, logh);
	var nowdate = date("Y-m-d");
	sql = "select pactid, carid_before, year, month, postid, telno from sim_index_tb" + " where simid=" + simid;
	var H_index = dbh.getHash(sql, true);

	if (H_index == undefined || H_index.length == 0) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + "\u5BFE\u8C61\u3068\u306A\u308B\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u7D50\u679C\u304C\u3042\u308A\u307E\u305B\u3093\u3001simid=" + simid);
		continue;
	}

	var pactid = H_index[0].pactid;
	var carid = H_index[0].carid_before;

	if (is_numeric(pactid) == false || is_numeric(carid) == false) {
		logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u7D50\u679C\u306Bpactid,carid\u304C\u3042\u308A\u307E\u305B\u3093\u3001simid=" + simid);
		continue;
	}

	var tableNo = getTableNo(H_index[0].year, H_index[0].month, false);
	var tel_details_X_tb = "tel_details_" + tableNo + "_tb";
	var tel_X_tb = "tel_" + tableNo + "_tb";
	var where_post = "";
	var postid = H_index[0].postid;

	if (is_null(postid) == false && postid != "") //配下の部署IDを得る
		{
			var A_post = getFollowerPost(pactid, postid, tableNo);
			where_post = " and tel.postid in (" + A_post.join(",") + ")";
		}

	var where_telno = "";
	var telno = H_index[0].telno;

	if (is_null(telno) == false && telno != "") {
		where_telno = " and tel.telno='" + telno + "'";
	}

	var sub_sql = "select telno from sim_details_tb where simid=" + simid;
	sql = "select tel.telno, tel.planid, tel.packetid from " + tel_X_tb + " tel " + " inner join " + tel_details_X_tb + " td " + " on tel.pactid=td.pactid and tel.carid=td.carid and tel.telno=td.telno " + " inner join dummy_tel_tb dmy " + " on tel.pactid=dmy.pactid and tel.carid=dmy.carid and tel.telno != dmy.telno " + " and tel.pactid=" + pactid + " and tel.carid=" + carid + " where tel.telno not in (" + sub_sql + " ) " + where_post + where_telno + " group by tel.telno, tel.planid, tel.packetid";
	var H_tel = dbh.getHash(sql, true);
	dbh.begin();

	for (var A_tel of Object.values(H_tel)) //echo $sql . "\n";	// * DEBUG *
	{
		telno = A_tel.telno;
		var planid = A_tel.planid;

		if (is_null(planid) || planid == "") {
			if (is_null(empty_plan) == false) //空だったプランを補填する
				{
					planid = empty_plan;
				} else {
				continue;
			}
		}

		var packetid = A_tel.packetid;

		if (is_null(packetid) || packetid == "") {
			packetid = "null";
		}

		sql = "insert into sim_details_tb (" + " simid, " + " telno, " + " recdate, " + " basic_before, " + " tel_before, " + " etc_before, " + " planid, " + " packetid, " + " basic_after, " + " tel_after, " + " etc_after, " + " charge_before, " + " charge_after, " + " mass_target_1, " + " mass_target_2, " + " mass_target_3, " + " mass_target_4, " + " mass_target_5 " + ") values (" + simid + "," + "'" + telno + "'," + "'" + nowdate + "'," + 0 + "," + 0 + "," + 0 + "," + planid + "," + packetid + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + 0 + "," + "''," + "''," + "''," + "''," + "'' " + ")";
		dbh.query(sql);
	}

	dbh.commit();
	update_postproc(simid, 2, dbh, logh);
}

throw die(0);

function update_postproc(simid, status, db, log) {
	db.begin();
	var sql = "update sim_postprocess_tb set status=" + status + " where simid=" + simid;
	db.query(sql);
	db.commit();
};

function getTableNo(targetYear, targetMonth, past = false) //現在年月
//指定年月から現在年月までの月数を計算
//現在用
//整形（文字列の長さも考慮　2008/02/28 houshi）
{
	var tableNo = "";
	var currentYear = date("Y");
	var currentMonth = date("n");
	var calc = 12 * (currentYear - targetYear) - targetMonth + 1 + currentMonth;

	if (past == false) //選択した年月が１年以上前でない場合
		//過去分データ修正用
		{
			if (calc < 13) //選択した月が１月の場合
				{
					if (targetMonth == 1) {
						tableNo = 12;
					} else {
						tableNo = targetMonth - 1;
					}
				} else //選択した月が１月の場合
				{
					if (targetMonth == 1) {
						tableNo = 24;
					} else {
						tableNo = targetMonth - 1 + 12;
					}
				}
		} else //選択した年月が１年以上前でない場合
		{
			if (calc < 14) {
				tableNo = targetMonth;
			} else {
				tableNo = targetMonth + 12;
			}
		}

	if (tableNo < 10 && tableNo.length == 1) {
		tableNo = "0" + tableNo;
	}

	return tableNo;
};

function getFollowerPost(pactid, postid, tableNo = "") //pactid か postid が空の場合は空の配列を返す
//テーブルＮＯが無い場合は現在
//指定された部署が見つかったかどうか true：見つかった、false：見つかっていない
{
	if (!("dbh" in global)) dbh = undefined;

	if (pactid == "" || postid == "") {
		return Array();
	}

	var sql = "select postidparent,postidchild,level from ";

	if (tableNo == "") {
		sql += "post_relation_tb";
	} else {
		sql += "post_relation_" + tableNo + "_tb";
	}

	sql += " where pactid = " + pactid + " order by level";
	var H_return = dbh.getHash(sql);
	var H_postid = Array();
	var A_postid_list = Array();
	var target_find = false;

	for (var cnt = 0; cnt < H_return.length; cnt++) //指定された部署が見つかっていない場合
	{
		var level = H_return[cnt].level;
		var parentid = H_return[cnt].postidparent;
		var childid = H_return[cnt].postidchild;

		if (target_find == false) //指定された部署が見つかった場合の処理
			{
				if (postid == childid) //指定された部署の階層
					{
						var target_level = level;
						H_postid[childid] = true;
						A_postid_list.push(childid);
						target_find = true;
					}
			} else //指定された部署配下
			{
				if (target_level < level) {
					if (undefined !== H_postid[parentid] && H_postid[parentid] == true) {
						H_postid[childid] = true;
						A_postid_list.push(childid);
					}
				}
			}
	}

	delete H_postid;
	return A_postid_list;
};

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = "batch";

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "%") + "' and " + "status = 1;";
			var count = db.getOne(sql);

			if (count != 0) {
				db.rollback();
				return false;
			}

			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + db.escape(pre + "_" + SCRIPTNAME) + "', 1, '" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + db.escape(pre + "_" + SCRIPTNAME) + "';";
		db.query(sql);
		db.commit();
	}

	return true;
};

function getTimestamp() {
	var tm = localtime(Date.now() / 1000, true);
	var yyyy = tm.tm_year + 1900;
	var mm = tm.tm_mon + 1;
	if (mm < 10) mm = "0" + mm;
	var dd = tm.tm_mday + 0;
	if (dd < 10) dd = "0" + dd;
	var hh = tm.tm_hour + 0;
	if (hh < 10) hh = "0" + hh;
	var nn = tm.tm_min + 0;
	if (nn < 10) nn = "0" + nn;
	var ss = tm.tm_sec + 0;
	if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};