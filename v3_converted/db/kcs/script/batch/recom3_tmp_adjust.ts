//シミュレーション結果を場当たり的に補正する
//「選択なし」の結果を２件にコピーする
//バッチが完成するまでの、一時的な処理
//2008/11/12	T.Naka
//このあたりの基本条件を書き換えて利用する
//$carid = 1;	// DoCoMo
//$cirid = "1";	// FOMA
//au
//CDMA1x, WIN
//$month = 11;
//$tel_X_tb = "tel_10_tb";	// month - 1
//month - 1
////////////////////////////////////////////////////////////////
//共通ログファイル名
//$dbLogFile = DATA_LOG_DIR . "/billbat.log";
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//$log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, $dbLogFile);
//標準出力に出力
//ログListener にログファイル名、ログ出力タイプを渡す
//$log_listener->PutListener($log_listener_type);
//DBハンドル作成
//エラー出力用ハンドル
//$logh = new ScriptLogAdaptor($log_listener, true);
//選択無しのbuyselidを得る
//print $buysel_none . "\n";
////////////////////////////////////////////////////////////////
//全てのパターンについて実行
//月とパケットに関しては全パターン実行する
//END monthcnt

require("lib/script_db.php");

require("lib/script_log.php");

var pactid = 4;
var carid = 3;
var cirid = "8,9";
var year = 2008;
var month = 10;
var tel_X_tb = "tel_09_tb";
var log_listener = new ScriptLogBase(0);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var sql = "select buyselid from buyselect_tb where buyselname='\u9078\u629E\u306A\u3057'";
var H_result = dbh.getHash(sql, true);
var buysel_none = "";
var delim = "";

for (var row of Object.values(H_result)) {
	buysel_none += delim + row.buyselid;
	delim = ",";
}

var A_monthcnt = [1, 2, 3, 6, 12];

for (var monthcnt of Object.values(A_monthcnt)) //パケット固定なし、あり
//END is_change_packet_free
{
	var A_change_packet = ["true", "false"];

	for (var is_change_packet_free of Object.values(A_change_packet)) //ターゲットである「買い換え有り」のシミュレーションIDを求める
	//「買い換え無し」で「選択なし」の電話を選び出す
	//トランザクション開始
	//$dbh->rollback();	// DEBUG * もとにもどす
	//本番実行！
	{
		sql = "SELECT " + "si.simid " + " FROM sim_index_tb si" + " INNER JOIN sim_details_tb sd on si.simid=sd.simid" + " WHERE si.pactid=" + pactid + " AND si.carid_before=" + carid + " AND si.status=2" + " AND si.is_save=false" + " AND si.year=" + year + " AND si.month=" + month + " AND si.monthcnt=" + monthcnt + " AND si.is_change_course=true" + " AND si.is_change_packet_free=" + is_change_packet_free + " group by si.simid";
		H_result = dbh.getHash(sql, true);

		for (var row of Object.values(H_result)) {
			print("INFO: target_simid=" + row.simid + "\n");
			var target_simid = row.simid;
		}

		if (H_result.length > 1) {
			print("ERROR: \u5BFE\u8C61simid\u304C\uFF12\u4EF6\u4EE5\u4E0A\u3042\u308A\u307E\u3059.\n");
			throw die(1);
		}

		var sql_body = "SELECT " + "si.simid," + "sd.telno," + "plan.planname," + "plan.buyselid," + "bsel.buyselname,packet.packetid,packet.packetname," + "recplan.planid as recplanid," + "recplan.planname as recplanname," + "recplan.buyselid as recbuyselid," + "recbsel.buyselname as recbuyselname," + "recpacket.packetid as recpacketid," + "recpacket.packetname as recpacketname," + "recplan_p.planid as recplanid_penalty," + "recplan_p.planname as recplanname_penalty," + "recplan_p.buyselid as recbuyselid_penalty," + "recbsel_p.buyselname as recbuyselname_penalty," + "recpacket_p.packetid as recpacketid_penalty," + "recpacket_p.packetname as recpacketname_penalty," + "sd.basic_before," + "sd.tel_before," + "sd.etc_before," + "sd.planid," + "sd.packetid," + "sd.basic_after," + "sd.tel_after," + "sd.etc_after," + "sd.charge_before," + "sd.charge_after " + " FROM sim_index_tb si" + " INNER JOIN sim_details_tb sd on si.simid=sd.simid" + " INNER JOIN " + tel_X_tb + " tel ON si.pactid=tel.pactid AND sd.telno=tel.telno AND si.carid_before=tel.carid" + " LEFT OUTER JOIN circuit_tb cir ON tel.cirid=cir.cirid" + " LEFT OUTER JOIN plan_tb plan ON tel.planid=plan.planid" + " LEFT OUTER JOIN packet_tb packet ON tel.packetid=packet.packetid" + " LEFT OUTER JOIN buyselect_tb bsel ON plan.buyselid=bsel.buyselid and plan.carid=bsel.carid" + " LEFT OUTER JOIN plan_tb recplan ON sd.planid=recplan.planid" + " LEFT OUTER JOIN packet_tb recpacket ON sd.packetid=recpacket.packetid" + " LEFT OUTER JOIN buyselect_tb recbsel ON recplan.buyselid=recbsel.buyselid and recplan.carid=recbsel.carid" + " LEFT OUTER JOIN plan_tb recplan_p ON sd.planid_penalty=recplan_p.planid" + " LEFT OUTER JOIN packet_tb recpacket_p ON sd.packetid_penalty=recpacket_p.packetid" + " LEFT OUTER JOIN buyselect_tb recbsel_p ON recplan_p.buyselid=recbsel_p.buyselid and recplan_p.carid=recbsel_p.carid";
		var sql_where = " WHERE si.pactid=" + pactid + " AND si.carid_before=" + carid + " AND tel.cirid in (" + cirid + ")" + " AND si.status=2" + " AND si.is_save=false" + " AND si.year=" + year + " AND si.month=" + month + " AND si.monthcnt=" + monthcnt + " AND recplan.simafter=true" + " AND plan.buyselid in (" + buysel_none + ")" + " AND si.is_change_course=false" + " AND si.is_change_packet_free=" + is_change_packet_free;
		sql = sql_body + sql_where;
		dbh.begin();
		H_result = dbh.getHash(sql, true);

		for (var row of Object.values(H_result)) //print $up_sql . "\n";
		{
			var up_sql = "update sim_details_tb set " + " basic_before = " + +(row.basic_before + "," + " tel_before = " + +(row.tel_before + "," + " etc_before = " + +(row.etc_before + "," + " planid = " + +(row.planid + ","))));

			if (row.packetid != "") //空のことがあるので
				{
					up_sql += " packetid = " + row.packetid + ",";
				}

			up_sql += " basic_after = " + +(row.basic_after + "," + " tel_after = " + +(row.tel_after + "," + " etc_after = " + +(row.etc_after + "," + " charge_before = " + +(row.charge_before + "," + " charge_after = " + +(row.charge_after + "," + " planid_penalty = planid, " + " packetid_penalty = packetid, " + " basic_after_penalty = basic_after, " + " tel_after_penalty = tel_after, " + " etc_after_penalty = etc_after, " + " charge_after_penalty = charge_after, " + " is_poor_penalty = true " + " where simid = " + target_simid + " and telno ='" + row.telno + "'")))));
			dbh.query(up_sql);
		}

		dbh.commit();
	}
}

throw die(0);