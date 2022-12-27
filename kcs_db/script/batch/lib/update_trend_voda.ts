//===========================================================================
//機能：通話明細から統計情報を抽出して、sim_trend_X_tbとsim_top_telno_X_tbを作る
//
//作成：中西
//日付：2008/10/16
//2011/08/26 森原
//通話明細がなく請求明細から通話秒数を求める部分を修正
// 2022cvt_016
//請求明細のcodetypeを'0'に限定
//デジタル通話は、通話秒数をplan_tb.chargeからのみ求めている
//===========================================================================
//32bit最大値 -- update_trend_nttdocomo.php に定義あり
//define("MAX_FLOAT32", 2147483647.0 );
//define("MAX_INT32", 2147483647 );
//sim_top_telno に登録する最大件数 -- update_trend_nttdocomo.php に定義あり
//define("MAX_TOP_TEL", 10 );
//平日昼間の利用率で、顧客単位のデフォルト値も無い場合の利用率
//define("G_AU_SIM_DAYTIME_RATIO", 70);
//---------------------------------------------------------------------------
//機能：通話明細から統計情報を抽出して、sim_trend_X_tbとsim_top_telno_X_tbを作る

// 2022cvt_026
// require("script_db.php");

// 2022cvt_026
// require("script_common.php");

import {ScriptDBAdaptor} from './script_db';
import { G_AU_SIM_DAYTIME_RATIO, G_PACKET_SIZE } from './script_common';
import { G_SCRIPT_SQL, G_SCRIPT_WARNING, ScriptLogBase } from './script_log';
import { A_data_comm_type, H_packet_detail, H_packet_type, Packet_detail_null } from './update_trend_au.conf';
import { DB_FETCHMODE_ASSOC } from '../../../class/MtDBUtil';
import { MAX_FLOAT32, MAX_INT32 } from './update_predata';

//sim_trend_X_tbへのデータ挿入型
//sim_top_telno_X_tbへのデータ挿入型
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//sim_trend_X_tbへのデータ挿入型
//sim_top_telno_X_tbへのデータ挿入型
//機能：既存のsim_trend_X_tbとsim_top_telno_X_tbからレコードを削除する
//引数：顧客ID
//キャリアID
//年
//月
//sim_trend_X_tb保存先ファイル名(空文字列ならファイル保存せず)
//sim_top_telno_X_tb保存先ファイル名(空文字列ならファイル保存せず)
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tbとsim_top_telno_X_tbを作る
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：sim_trend_X_tbの通話時間帯あたりの集計を求める
//引数：顧客ID
//テーブルNo
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tbの携帯・固定電話の集計を求める
//引数：顧客ID
//キャリアID
//テーブルNo
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
// Note:
// タイプには、もとのファイルに合わせてV0～V7まである。
// 'V0'; // '国内通話明細';		=> X
// // V1 は無い					=> X
// 'V2'; // 'パケット通信明細';	=> 0 (本来この中身が分かれるのだが、手がかりがない)
// 'V3'; // '国際通話明細';		=> X
// 'V4'; // '情報料明細';			=> X
// 'V5'; // '国際ローミング明細'; => X
// 'V6'; // '国際パケット通信明細';	=> 30
// 'V7'; // 'MMS通信明細';		=> 30
//	10	// iモード、ezWeb、S!など -- iモード専用サイト、メールなどのサービス
//	20	// フルブラウザ、PCサイトビューアーなど -- PCと同様のブラウザ
//	30	// 一般パケット通信など -- プロバイダー接続
//
//機能：sim_trend_X_tbのパケット種別あたりの集計を求める
//引数：顧客ID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
// Note:
// case中での null の扱いは特別です。以下は例：
// 2022cvt_016
// select type, toplace, (case when toplace is null or trim(toplace)='' then 0 else 10 end)
// from commhistory_07_tb
// 2022cvt_016
// where carid=3 and type like '%通信%';
//
//機能：sim_trend_X_tbのパケット種別のさらに詳細な集計比率を求める
//引数：顧客ID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：パケット比率の登録、executePacketRatioから呼ばれるサブ関数
//引数：電話番号
//合計パケット数
//key => value の配列
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tbから平日昼間の割合を得る
//引数：顧客ID
//テーブルNo
//返値：電話番号、平日昼間の割合(100%) が含まれている連想配列
//備考：'timezone'を作成した後に実行すること
//機能：sim_trend_X_tbの総通話時間を求める
//引数：顧客ID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tbの総通話回数を求める
//引数：顧客ID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：上位かけ先電話を求める
//引数：顧客ID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：commhistory_X_tbから、timeを秒数として取り出す部分を返す
//備考：timeが空文字列やNULLのレコードに対して使用しない事
//引数：timeに該当するカラム名
//機能：sim_trend_X_tbから、電話番号が空白のレコードを除外するSQL文を返す
//引数：顧客ID
//テーブル番号
//プレフィックス("tel_tb."を想定)
//返値：ANDで始まるSQL文の一部
const MAX_TOP_TEL = 10;
export default class updateTrendVoda extends ScriptDBAdaptor {
	m_inserter_toptel: any;
	m_inserter_trend: any;
	constructor(listener: ScriptLogBase | any, db: string, table_no: string, inserterTrend: any, inserterToptel: any) {
		super(listener, db, table_no);
		this.m_inserter_trend = inserterTrend;
		this.m_inserter_toptel = inserterToptel;
	}

	delete(pactid: any, carid: any, year: any, month: any, fname_trend: string | any[], fname_toptel: string | any[]) //sim_trend_X_tbをバックアップ
	//sim_top_telno_X_tbをバックアップ
	//2007/01/25 carid指定
	{
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
// 2022cvt_015
		var sqlfrom = " from sim_trend_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and carid=" + this.escape(carid) + " and code in (" + "'timezone'," + "'timezone_digi'," + "'packetcnt'," + "'packetratio'," + "'tuwasec'," + "'tuwacnt'," + "'ismobile'" + ")" + " and length(coalesce(telno,''))>0" + this.getSQLWhereTelno(pactid, carid, table_no);

		if (fname_trend.length) {
			if (!this.m_db.backup(fname_trend, "select *" + sqlfrom + ";")) return false;
		}

// 2022cvt_015
		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sqlfrom = " from sim_top_telno_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and carid=" + this.escape(carid);

		if (fname_toptel.length) {
			if (!this.m_db.backup(fname_toptel, "select *" + sqlfrom + ";")) return false;
		}

		sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid: any, carid: any, year: any, month: any) //挿入準備
	{
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
		if (!this.m_inserter_trend.begin("sim_trend_" + table_no + "_tb")) return false;
		if (!this.m_inserter_toptel.begin("sim_top_telno_" + table_no + "_tb")) return false;
		if (!this.m_inserter_trend.setConst({
			pactid: pactid,
			carid: carid,
			recdate: "now()"
		})) return false;
		if (!this.m_inserter_toptel.setConst({
			pactid: pactid,
			carid: carid,
			recdate: "now()"
		})) return false;
		if (!this.executeTimezone(pactid, carid, table_no)) return false;
		if (!this.executePacketCnt(pactid, carid, table_no)) return false;
		if (!this.executePacketRatio(pactid, carid, table_no)) return false;
		if (!this.executeTuwasec(pactid, carid, table_no)) return false;
		if (!this.executeTuwacnt(pactid, carid, table_no)) return false;
		if (!this.executeToptel(pactid, carid, table_no)) return false;
		if (!this.executeIsmobile(pactid, carid, table_no)) return false;
		if (!this.m_inserter_trend.end()) return false;
		if (!this.m_inserter_toptel.end()) return false;
		return true;
	}

	executeTimezone(pactid: any, carid: string, table_no: string) //通話の時間帯を求める
	//平日の08:00～19:00なら平日昼(0)
	//tdow=1は日曜日
	//それ以外なら(1)
	//時
	//曜日
	//byteの有無で通話/通信を判断する
	//デジタル通信の時間帯を求める
	//デジタル通信に分類されるタイプ
	//平日の01:00～21:00なら平日昼(0)、ホワイトプランの区分に合わせた
	//$sql .= " when tdow!=1 and thour>=8 and thour<19 then 0";	// tdow=1は日曜日
	//それ以外なら(1)
	//時
	//曜日
	//$sql .= " and byte is not null";	// byteの有無で通話/通信を判断する
	//デジタル通信に属する
	{
// 2022cvt_015
		var line;
// 2022cvt_016
		if (!("A_data_comm_type" in global)) A_data_comm_type;
// 2022cvt_015
		var sql = "select telno,key,sum(sec) as value, 'timezone' as code from";
		sql += "(";
		sql += "select telno,sec,(case";
		sql += " when tdow!=1 and thour>=8 and thour<19 then 0";
		sql += " else 1";
		sql += " end) as key";
		sql += " from";
		sql += "(";
		sql += "select telno," + this.getSQLTime() + " as sec";
		sql += ",to_number(to_char(date, 'HH24'), '99') as thour";
		sql += ",to_number(to_char(date, 'D'), '9') as tdow";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and trim(time) != ''";
		sql += " and length(time)>0";
		sql += " and time is not null";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
// 2022cvt_016
// 2022cvt_015
		var str_comm_type = "";
// 2022cvt_015
		var delim = "";

// 2022cvt_016
// 2022cvt_015
		for (var p_name of A_data_comm_type) {
// 2022cvt_016
			str_comm_type = delim + "'" + p_name + "'";
			delim = ",";
		}

		sql = "select telno,key,sum(sec) as value, 'timezone_digi' as code from";
		sql += "(";
		sql += "select telno,sec,(case";
		sql += " when thour>=1 and thour<21 then 0";
		sql += " else 1";
		sql += " end) as key";
		sql += " from";
		sql += "(";
		sql += "select telno," + this.getSQLTime() + " as sec";
		sql += ",to_number(to_char(date, 'HH24'), '99') as thour";
		sql += ",to_number(to_char(date, 'D'), '9') as tdow";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
// 2022cvt_016
		sql += " and type in(" + str_comm_type + ")";
		sql += " and time is not null";
		sql += " and trim(time) != ''";
		sql += " and length(time)>0";
		sql += " and time is not null";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_FLOAT32 < line.value) {
				line.value = MAX_INT32;
			}

			if (false == (undefined !== line.value)) {
				line.value = 0;
			}

			if (!this.m_inserter_trend.insert(line)) {
				return false;
			}
		}

		result.free();
		return true;
	}

	executeIsmobile(pactid: any, carid: string, table_no: string) //一般通話の集計を行う
	//080か090で始まっていたらキーは1で、それ以外はゼロ
	//byteの有無で通話/通信を判断する
	//デジタル通信の集計を行う
	//どのタイプがデジタル通信に入るのか？ * ToDo *
// 2022cvt_016
	//$str_comm_type = "";	// デジタル通信に分類されるタイプ
	//$delim = "";
// 2022cvt_016
	//foreach( $A_data_comm_type as $p_name ){
// 2022cvt_016
	//$str_comm_type = ($delim . "'" . $p_name . "'");
	//$delim = ",";
	//}
	//$sql = "select telno,key,sum(sec) as value,"
	//. "'ismobile_digi' as code from";
	//$sql .= "(";
	//$sql .= "select telno,sec";
	////080か090で始まっていたらキーは1で、それ以外はゼロ
	//$sql .= ",(case when '080'=pre or '090'=pre then 1 else 0 end) as key";
	//$sql .= " from";
	//$sql .= "(";
	//$sql .= "select telno," . $this->getSQLTime() . " as sec";
	//$sql .= ",substr(totelno,1,3) as pre";
	//$sql .= " from commhistory_" . $table_no . "_tb";
	//$sql .= " where pactid=" . $this->escape($pactid);
	////	$sql .= " and byte is not null";	// byteの有無で通話/通信を判断する
// 2022cvt_016
	//$sql .= " and type in(". $str_comm_type .")";	// デジタル通信に属する
	//$sql .= " and time is not null";
	//$sql .= " and length(time)>0";
	//$sql .= " and trim(time) != ''";
	//$sql .= " and time is not null";
	//$sql .= " and carid=" . $carid;
	//$sql .= $this->getSQLWhereTelno($pactid, $carid, $table_no);
	//$sql .= ") as inner_tb";
	//$sql .= ") as middle_tb";
	//$sql .= " group by telno,key";
	//$sql .= " order by telno,key";
	//$sql .= ";";
	//$O_result = $this->m_db->query($sql);
	//while ($H_line = $O_result->fetchRow(DB_FETCHMODE_ASSOC))
	//{
	//if (MAX_INT32 < $H_line["value"])
	//$H_line["value"] = MAX_INT32;
	//if ( ! $this->m_inserter_trend->insert($H_line))
	//return false;
	//}
	//$O_result->free();
	//
	{
// 2022cvt_015
		var H_line;
// 2022cvt_016
		if (!("A_data_comm_type" in global)) A_data_comm_type;
// 2022cvt_015
		var sql = "select telno,key,sum(sec) as value, 'ismobile' as code from";
		sql += "(";
		sql += "select telno,sec";
		sql += ",(case when '080'=pre or '090'=pre then 1 else 0 end) as key";
		sql += " from";
		sql += "(";
		sql += "select telno," + this.getSQLTime() + " as sec";
		sql += ",substr(totelno,1,3) as pre";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and trim(time) != ''";
		sql += " and length(time)>0";
		sql += " and time is not null";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
// 2022cvt_015
		var O_result = this.m_db.query(sql);

		while (H_line = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_INT32 < H_line.value) H_line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(H_line)) return false;
		}

		O_result.free();
		return true;
	}

	executePacketCnt(pactid: any, carid: string, table_no: string) //まずパケット明細から取得を試みる
	//これってあってんのかな？
	//本来あってはならない未分類値
	//エラーメッセージ用
	//byteの有無で通話/通信を判断する
// 	//echo $sql . "\n"; // DEBUG// 2022cvt_010
	//exit;
// 	//echo $sql . "\n"; // DEBUG// 2022cvt_010
	//パケット明細が無かった電話については、請求明細から取得する
	//パケット通信科目
	//140 は未分類のものです。合計値ではない。
	//146, 148 国際ものはカウントから除外する
	//BEGIN 内部テーブル
	//科目 => パケットの種類
	//S!未分類
	//S!メール
	//S!ブラウザ
	//S!その他
	//ブラウジング
	//一般パケット通信
	//is_data フラグによって、データ専用/それ以外を判断
	//パケットの種類 10～30 によって、それぞれ単価が異なる
	//is_empty フラグが true の場合は plan_tb の方から値を取得する 2009/01/09 by T.Naka
	//<- ここには来ないはず
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb, packet_tb
// 2022cvt_016
	//20110826morihara codetypeは'0'のみとする
	//$sql .= " and packet_tb.simbefore = true";	// * DEBUG * ToDo * これが余計、とりあえず外す。
	//既にパケット明細から結果が得られた電話は除く
	//byteの有無で通話/通信を判断する
	//内部テーブルの GROUP BY
	//END 内部テーブル
	//全体の GROUP BY, ORDER BY
// 	//echo $sql . "\n"; // * DEBUG *// 2022cvt_010
	//exit;
	{
// 2022cvt_015
		var line;
// 2022cvt_015
		var sql = "select telno, key, ceil(sum(byte2)/" + G_PACKET_SIZE + ") as value, 'packetcnt' as code from";
		sql += "(";
		sql += "select telno,byte2,(case";
// 2022cvt_016
		sql += " when type='V0' then 99";
// 2022cvt_016
		sql += " when type='V1' then 99";
// 2022cvt_016
		sql += " when type='V2' then 10";
// 2022cvt_016
		sql += " when type='V3' then 99";
// 2022cvt_016
		sql += " when type='V4' then 99";
// 2022cvt_016
		sql += " when type='V5' then 99";
// 2022cvt_016
		sql += " when type='V6' then 30";
// 2022cvt_016
		sql += " when type='V7' then 30";
		sql += " else 0";
		sql += " end) as key";
// 2022cvt_016
		sql += ",type";
		sql += " from(";
// 2022cvt_016
		sql += "select telno,byte as byte2,type";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is not null";
		sql += " and byte > 0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (line.key == 99) //パケット数として加算しない
				{
					continue;
// 2022cvt_016
				} else if (line.key != 0) //明細typeが存在した
// 2022cvt_016
				//unset( $line["type"] );	// typeは不要
				{
					if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
					if (!this.m_inserter_trend.insert(line)) return false;
				} else {
				this.putError(G_SCRIPT_WARNING, "パケット明細に未知のタイプがありました、電話番号=(" + line.telno + ")");
				return false;
			}
		}

		result.free();
// 2022cvt_015
		var packet_kamoku = "'140','141','142','143','144','145'";
		sql = "select telno, key, round(sum(value)) as value, 'packetcnt' as code";
		sql += " from (";
		sql += "select";
		sql += " details_tb.telno as telno,";
		sql += " (case";
		sql += "  when utiwake_tb.simkamoku = '140' then 10";
		sql += "  when utiwake_tb.simkamoku = '141' then 10";
		sql += "  when utiwake_tb.simkamoku = '142' then 10";
		sql += "  when utiwake_tb.simkamoku = '143' then 10";
		sql += "  when utiwake_tb.simkamoku = '144' then 20";
		sql += "  when utiwake_tb.simkamoku = '145' then 30";
		sql += "  else 0 end) as key,";
		sql += " (case";
		sql += "  when plan_tb.is_data = true and plan_tb.charge_other != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_other )";
		sql += "  when plan_tb.is_data = false and packet_tb.is_empty=false " + "and utiwake_tb.simkamoku in('140','141','142','143') and packet_tb.charge_mode != 0";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_mode )";
		sql += "  when plan_tb.is_data = false and packet_tb.is_empty=false " + "and utiwake_tb.simkamoku in('144') and packet_tb.charge_browse != 0";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_browse )";
		sql += "  when plan_tb.is_data = false and packet_tb.is_empty=false " + "and utiwake_tb.simkamoku in('145') and packet_tb.charge_other != 0";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_other )";
		sql += "  when plan_tb.is_data = false and packet_tb.is_empty=true " + "and utiwake_tb.simkamoku in('140','141','142','143') and plan_tb.charge_mode != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_mode )";
		sql += "  when plan_tb.is_data = false and packet_tb.is_empty=true " + "and utiwake_tb.simkamoku in('144') and plan_tb.charge_browse != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_browse )";
		sql += "  when plan_tb.is_data = false and packet_tb.is_empty=true " + "and utiwake_tb.simkamoku in('145') and plan_tb.charge_other != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_other )";
		sql += "  else 0";
		sql += " end) as value";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb on (details_tb.pactid=tel_tb.pactid and details_tb.telno=tel_tb.telno and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb on (details_tb.carid = utiwake_tb.carid and details_tb.code = utiwake_tb.code)";
		sql += " inner join plan_tb on (plan_tb.planid=tel_tb.planid and plan_tb.carid=tel_tb.carid)";
		sql += " left outer join packet_tb on (packet_tb.packetid=tel_tb.packetid and packet_tb.carid=tel_tb.carid)";
		sql += " where";
		sql += " tel_tb.pactid=" + this.escape(pactid) + " and tel_tb.carid=" + carid;
// 2022cvt_016
		sql += " and coalesce(utiwake_tb.codetype,'')='0'";
		sql += " and utiwake_tb.planflg = true and utiwake_tb.simkamoku in (" + packet_kamoku + ")";
		sql += this.getSQLWhereTelno(pactid, carid, table_no, "tel_tb.");
		sql += " and tel_tb.telno not in (";
		sql += "select telno";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is not null";
		sql += " and byte > 0";
		sql += " and carid=" + carid;
		sql += " group by telno";
		sql += ")";
		sql += " group by details_tb.telno, utiwake_tb.simkamoku,";
		sql += " plan_tb.charge_other, packet_tb.charge_mode, packet_tb.charge_browse, packet_tb.charge_other, key,";
		sql += " is_data, packet_tb.is_empty, plan_tb.charge_mode, plan_tb.charge_browse, plan_tb.charge_other";
		sql += ") as inner_tb";
		sql += "  group by telno, key order by telno";
		sql += ";";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
		return true;
	}

	executePacketRatio(pactid: any, carid: string, table_no: string) //DEBUG * ToDo *
	//いまのところ見分け方が解らない。。。
// 2022cvt_016
	//集計対象となるtypeを抜き出す
	//本来あってはならない未分類値
	//byteの有無で通話/通信を判断する
	//このタイプのものだけを集計する
// 	//echo $sql . "\n";// 2022cvt_010
	//exit;
	//最後の電話についての処理
	{
		return true;
		if (!("H_packet_detail" in global)) H_packet_detail;
// 2022cvt_016
		if (!("H_packet_type" in global)) H_packet_type;
		if (!("Packet_detail_null" in global)) Packet_detail_null;
// 2022cvt_016
// 2022cvt_015
		var in_type = "";
// 2022cvt_015
		var delim = "";

// 2022cvt_016
// 2022cvt_015
		for (var p_name in H_packet_type) {
// 2022cvt_016
// 2022cvt_015
			var p_type:any = H_packet_type[p_name];

// 2022cvt_016
			if (p_type == 10) //２回目以降には , が付く
				{
// 2022cvt_016
					in_type += delim + "'" + p_name + "'";
					delim = ",";
				}
		}

// 2022cvt_016
		if (in_type == "") //集計対象が空だった
			//何も入れずに終了
			{
				return true;
			}

// 2022cvt_015
		var sql = "select telno,key,sum(byte2) as value from";
		sql += "(";
		sql += "select telno,byte2,(case";

// 2022cvt_015
		for (var p_name in H_packet_detail) {
// 2022cvt_016
// 2022cvt_015
			var p_type:any = H_packet_detail[p_name];
// 2022cvt_016
			sql += " when toplace='" + p_name + "' then " + p_type;
		}

		sql += " when toplace is null then " + Packet_detail_null;
		sql += " else 0";
		sql += " end) as key";
		sql += " from(";
		sql += "select telno,byte as byte2,toplace";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is not null";
		sql += " and byte > 0";
// 2022cvt_016
		sql += " and type in(" + in_type + ")";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.query(sql);
// 2022cvt_015
		var prev_telno = "";
// 2022cvt_015
		var sum_packet = 0;
// 2022cvt_015
		var H_key_value = Array();

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //今回の電話番号を記録
		{
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;

			if (prev_telno === "") //初回
				{
					prev_telno = line.telno;
				}

			if (line.telno !== prev_telno) {
				if (!this.insertPacketRatio(prev_telno, sum_packet, H_key_value)) return false;
				H_key_value = Array();
				sum_packet = 0;
			}

			sum_packet += line.value;
			H_key_value[line.key] = line.value;
			prev_telno = line.telno;
		}

		result.free();
		if (!this.insertPacketRatio(prev_telno, sum_packet, H_key_value)) return false;
		return true;
	}

	insertPacketRatio(prev_telno: string, sum_packet: number, H_key_value: any[]) {
// 2022cvt_015
		for (var key in H_key_value) //0割に注意
		{
// 2022cvt_015
			var value = H_key_value[key];

			if (sum_packet != 0) //比率(%)
				{
// 2022cvt_015
					var ratio = +(value * 100 / sum_packet);
				} else {
				ratio = 0;
			}

// 2022cvt_015
			var inline = {
				telno: prev_telno,
				code: "packetratio",
				key: key,
				value: ratio
			};
			if (!this.m_inserter_trend.insert(inline)) return false;
		}

		return true;
	}

	getDaytimeRatio(pactid: string, carid: any, table_no: string) //最後の電話
	{
// 2022cvt_015
		var line;
// 2022cvt_015
		var sql = "select telno, key, value from sim_trend_" + table_no + "_tb";
		sql += " where pactid='" + pactid + "'";
		sql += " and code='timezone'";
		sql += " order by telno";
// 2022cvt_015
		var H_result = Array();
// 2022cvt_015
		var result = this.m_db.query(sql);
// 2022cvt_015
		var prev_tel: any;
		prev_tel = "";
// 2022cvt_015
		var val0 = 0;
// 2022cvt_015
		var val1 = 0;

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //電話番号が変わったら
		{
			if (prev_tel !== "" && line.telno !== prev_tel) {
				if (val0 + val1 > 0) {
// 2022cvt_015
					var ratio = +(val0 / (val0 + val1) * 100);
					H_result[prev_tel] = ratio;
				}

				val0 = 0;
				val1 = 1;
			}

			if (line.key == 0) {
				val0 = line.value;
			} else if (line.key == 1) {
				val1 = line.value;
			}

			prev_tel = line.telno;
		}

		if (val0 + val1 > 0) {
			ratio = +(val0 / (val0 + val1) * 100);
			H_result[prev_tel] = ratio;
		}

		return H_result;
	}

	executeTuwasec(pactid: any, carid: string, table_no: string) //まず通話明細から取得を試みる
	//エラーメッセージ用
	//通話の分類、国内=1と国際=2
	//'国内通話明細';
	//V1 は無いはず
	//'パケット通信明細';
	//'国際通話明細';
	//'情報料明細';
	//'国際ローミング明細';
	//'国際パケット通信明細';
	//'MMS通信明細';
	//本来あってはならない未分類値
	//byteの有無で通話/通信を判断する
	//2006/12/19 by T.Naka
// 	//echo $sql ."\n"; // DEBUG// 2022cvt_010
	//exit;
	//最後にバッファに残っている部分を出力する
	//平日昼間・それ以外の比率を100%で得る
	//通話明細が無かった電話については、請求明細から取得する
	//通常通話科目(text型)
	//20110826morihara 自社携帯とそれ以外で按分
	//$sql .= ",plan_tb.charge, plan_tb.chgunit, plan_tb.nightcharge";
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(kamokuが通常通話 and pactid,carid,planflg,simbefore)
	//$sql .= " and plan_tb.simbefore = true";	// * DEBUG * ToDo * これを抑制しないと結果が出ない
// 2022cvt_016
	//20110826morihara codetypeは'0'のみとする
	//既に通話明細から結果が得られた電話は除く
	//byteの有無で通話/通信を判断する
	//GROUP BYとORDER BY
	//20110826morihara 自社携帯とそれ以外で按分
	//$sql .= " group by details_tb.telno, plan_tb.charge, plan_tb.nightcharge, plan_tb.chgunit";
// 	//echo $sql ."\n"; // DEBUG// 2022cvt_010
	//exit;
	//デジタル通信の秒数を求める
	//ToDo: デジタル通信は本当にあるのだろうか。。。
	//とりあえずは通信明細から求めることを止めて、請求から求めることにしよう。
	//請求明細から取得する
	//デジタル通信科目
	//20110826morihara digichargeがゼロの場合に結果を出さないのではなく、
	//できるだけゼロに近い値に変更
	//$sql .= ",round(sum(details_tb.charge) * plan_tb.digichgunit / plan_tb.digicharge) as value";
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(kamokuがデジタル通信 and pactid,carid,planflg,simbefore)
	//$sql .= " and plan_tb.simbefore = true";	// * DEBUG * ToDo * これを抑制しないと結果が出ない
	//20110826morihara digichargeがゼロの場合に結果を出さないのではなく、
	//できるだけゼロに近い値に変更
	//$sql .= " and plan_tb.digicharge != 0";	// 0割を防ぐ、2010/06/21追加
// 2022cvt_016
	//20110826morihara codetypeは'0'のみとする
	//GROUP BYとORDER BY
// 	//echo $sql ."\n"; // DEBUG// 2022cvt_010
	//exit;
	//tuwasecが作られなかった場合はtuwasec=0を追加
	{
// 2022cvt_015
		var line;
// 2022cvt_015
		var H_telno = Array();
// 2022cvt_015
		var sql = "select telno";
		sql += ",sum(" + this.getSQLTime() + ") as value";
// 2022cvt_016
		sql += ",type";
		sql += ",(case";
// 2022cvt_016
		sql += " when type='V0' then 1";
// 2022cvt_016
		sql += " when type='V1' then 0";
// 2022cvt_016
		sql += " when type='V2' then 0";
// 2022cvt_016
		sql += " when type='V3' then 2";
// 2022cvt_016
		sql += " when type='V4' then 0";
// 2022cvt_016
		sql += " when type='V5' then 1";
// 2022cvt_016
		sql += " when type='V6' then 0";
// 2022cvt_016
		sql += " when type='V7' then 0";
		sql += " else 0";
// 2022cvt_016
		sql += " end) as type_check";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and trim(time) != ''";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
// 2022cvt_016
		sql += " group by telno, type";
		sql += " order by telno";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.query(sql);
// 2022cvt_015
		var cur_key = "";
// 2022cvt_015
		var cur_line:any = Array();

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
// 2022cvt_016
			if (line.type_check == 1) //「国内通話」だけを追加する
// 2022cvt_016
				//typeは不要
// 2022cvt_016
				//type_checkは不要
				//通常の通話
				{
					H_telno[line.telno] = 1;
// 2022cvt_016
					delete line.type;
// 2022cvt_016
					delete line.type_check;
					line.code = "tuwasec";
					line.key = 0;

					if (!line.value == true) {
						line.value = 0;
					}

// 2022cvt_015
					var key = line.telno;

// 2022cvt_022
					if (key!=cur_key) //電話番号が変わったら出力する
						{
							if (cur_key.length) {
								if (MAX_FLOAT32 < cur_line.value) cur_line.value = MAX_INT32;
								if (!this.m_inserter_trend.insert(cur_line)) return false;
							}

							cur_key = key;
							cur_line = line;
						} else //電話番号が変わっていないので、バッファの金額に加算する
						{
							cur_line.value += line.value;
						}
				}
		}

		if (cur_key.length) {
			if (MAX_FLOAT32 < cur_line.value) cur_line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(cur_line)) return false;
		}

		result.free();
// 2022cvt_015
		var H_daytime_ratio : any = this.getDaytimeRatio(pactid, carid, table_no);
// 2022cvt_015
		var tuwa_kamoku = "'121'";
		sql = "select details_tb.telno as telno";
		sql += ",sum(details_tb.charge) as sum_charge";
		sql += ",plan_tb.chgunit";
		sql += ",(coalesce(plan_tb.charge,0)*25+coalesce(plan_tb.chargefix,0)*75)/100 as plan_tb_charge";
		sql += ",(coalesce(plan_tb.nightcharge,0)*25+coalesce(plan_tb.nightchargefix,0)*75)/100 as plan_tb_nightcharge";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb";
		sql += " on (details_tb.pactid = tel_tb.pactid";
		sql += " and details_tb.telno = tel_tb.telno";
		sql += " and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " inner join plan_tb";
		sql += " on (plan_tb.planid=tel_tb.planid";
		sql += " and plan_tb.carid=tel_tb.carid)";
		sql += " where tel_tb.pactid = " + this.escape(pactid);
		sql += " and tel_tb.carid = " + this.escape(carid);
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.simkamoku in (" + tuwa_kamoku + ")";
// 2022cvt_016
		sql += " and coalesce(utiwake_tb.codetype,'')='0'";
		sql += this.getSQLWhereTelno(pactid, carid, table_no, "tel_tb.");
		sql += " and tel_tb.telno not in (";
		sql += "select telno";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and trim(time) != ''";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += " group by telno";
		sql += ")";
		sql += " group by details_tb.telno, plan_tb.chgunit";
		sql += ",plan_tb_charge,plan_tb_nightcharge";
		sql += " order by details_tb.telno";
		sql += ";";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //平日昼間とそれ以外の割合を得る
		//料金
		//20110826morihara 自社携帯とそれ以外で按分
		{
			H_telno[line.telno] = 1;
// 2022cvt_015
			var telno = line.telno;

			if (undefined !== H_daytime_ratio[telno]) {
// 2022cvt_015
				var daytime_ratio = H_daytime_ratio[telno];
			} else if (undefined !== H_daytime_ratio[""]) //会社全体のデフォルト値を適用
				{
					daytime_ratio = H_daytime_ratio[""];
				} else {
				daytime_ratio = G_AU_SIM_DAYTIME_RATIO;
			}

			line.charge = line.plan_tb_charge;
			line.nightcharge = line.plan_tb_nightcharge;

			if (line.charge == line.nightcharge) //等しければそのまま(100%)
				{
// 2022cvt_015
					var charge = line.charge * 100;
				} else //違っていれば平日昼間とそれ以外で比例配分
				{
					charge = line.charge * daytime_ratio + line.nightcharge * (100 - daytime_ratio);
				}

			if (!charge == true || charge == 0) //$this->putError(G_SCRIPT_WARNING,
				//"通話単価が設定されていません、20円で計算します、電話番号=(". $line["telno"] .")");
				//20110826morihara ゼロ割対策として単価を極端に安くする
				//$charge = 20;	// 仮にホワイトプランの単価で計算、ちょっと無理があるけど。
				{
					charge = 100;
				}

// 2022cvt_015
			var inline = {
				telno: line.telno,
				code: "tuwasec",
				key: 0,
				value: +(line.sum_charge * line.chgunit * 100 / charge)
			};
			if (!this.m_inserter_trend.insert(inline)) return false;
		}

		result.free();
// 2022cvt_015
		var digi_kamoku = "'147'";
		sql = "select details_tb.telno as telno";
		sql += ",round(sum(details_tb.charge) * plan_tb.digichgunit / " + "(" + "case when coalesce(plan_tb.digicharge,0)=0 then 1" + " else coalesce(plan_tb.digicharge,0) end" + ")) as value";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb";
		sql += " on (details_tb.pactid = tel_tb.pactid";
		sql += " and details_tb.telno = tel_tb.telno";
		sql += " and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid = utiwake_tb.carid";
		sql += " and details_tb.code = utiwake_tb.code)";
		sql += " inner join plan_tb";
		sql += " on (plan_tb.planid=tel_tb.planid";
		sql += " and plan_tb.carid=tel_tb.carid)";
		sql += " where tel_tb.pactid = " + this.escape(pactid);
		sql += " and tel_tb.carid = " + this.escape(carid);
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.simkamoku in (" + digi_kamoku + ")";
// 2022cvt_016
		sql += " and coalesce(utiwake_tb.codetype,'')='0'";
		sql += this.getSQLWhereTelno(pactid, carid, table_no, "tel_tb.");
		sql += " group by details_tb.telno, plan_tb.digicharge, plan_tb.digichgunit";
		sql += " order by details_tb.telno";
		sql += ";";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //デジタル通信
		{
			H_telno[line.telno] = 1;
			line.code = "tuwasec";
			line.key = 1;

			if (MAX_FLOAT32 < line.value) {
				line.value = MAX_INT32;
			}

			if (!line.value == true) {
				line.value = 0;
			}

			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
		sql = "SELECT " + "telno " + "FROM " + "sim_trend_" + table_no + "_tb " + "WHERE " + "code = 'predata_basic' " + this.getSQLWhereTelno(pactid, carid, table_no) + " ";

		if (H_telno.length > 0) {
			sql += "AND telno NOT IN('" + Object.keys(H_telno).join("','") + "') ";
		}

		sql += "GROUP BY telno";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
// 2022cvt_015
			var data = {
				telno: line.telno,
				code: "tuwasec",
				key: 0,
				value: 0
			};

			if (!this.m_inserter_trend.insert(data)) {
				return false;
			}
		}

		return true;
	}

	executeTuwacnt(pactid: any, carid: string, table_no: string) //通常の通話を求める
	//byteの有無で通話/通信を判断する
	//2006/12/19 by T.Naka
// 	//echo $sql . "\n";// 2022cvt_010
	//exit;
	//デジタル通信の回数を求める
	//これって見分け方あるんかな？ * ToDo *
// 2022cvt_016
	//$str_comm_type = "";	// デジタル通信に分類されるタイプ
	//$delim = "";
// 2022cvt_016
	//foreach( $A_data_comm_type as $p_name ){
// 2022cvt_016
	//$str_comm_type = ($delim . "'" . $p_name . "'");
	//$delim = ",";
	//}
	//$sql = "select telno";
	//$sql .= ",count(*) as value";
	//$sql .= " from commhistory_" . $table_no . "_tb";
	//$sql .= " where pactid=" . $this->escape($pactid);
// 2022cvt_016
	//$sql .= " and type in(". $str_comm_type .")";
	//$sql .= " and time is not null";
	//$sql .= " and trim(time) != ''";
	//$sql .= " and length(time)>0";
	//$sql .= " and carid=" . $carid;	// 2006/12/19 by T.Naka
	//$sql .= $this->getSQLWhereTelno($pactid, $carid, $table_no);
// 2022cvt_016
	//$sql .= " group by telno, type";
	//$sql .= " order by telno";
	//$sql .= ";";
// 	//echo $sql . "\n";// 2022cvt_010
	//exit;
	//$result = $this->m_db->query($sql);
	//
	//while ($line = $result->fetchRow(DB_FETCHMODE_ASSOC))
	//{
	//$line["code"] = 'tuwacnt';
	//$line["key"] = 1;	// デジタル通信
	//if (MAX_FLOAT32 < $line["value"])
	//$line["value"] = MAX_INT32;
	//if ( ! $this->m_inserter_trend->insert($line))
	//return false;
	//}
	//$result->free();
	//
	{
// 2022cvt_015
		var line;
// 2022cvt_016
		if (!("A_data_comm_type" in global)) A_data_comm_type;
// 2022cvt_015
		var sql = "select telno";
		sql += ",count(*) as value";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and trim(time) != ''";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno";
		sql += " order by telno";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //通常の通話
		{
			line.code = "tuwacnt";
			line.key = 0;
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
		return true;
	}

	executeToptel(pactid: any, carid: string, table_no: string) //byteの有無で通話/通信を判断する
	//2006/12/19 by T.Naka
	{
// 2022cvt_015
		var line;
// 2022cvt_015
		var sql = "select telno,totelno,sum " + this.getSQLTime() + " as sec";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and trim(time) != ''";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno,totelno";
		sql += " order by telno,sec desc";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.query(sql);
// 2022cvt_015
		var max_lines = 0;
// 2022cvt_015
		var prev_telno = "";

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //今回の電話番号を記録
		{
			if (prev_telno == "") //初回
				{
					prev_telno = line.telno;
				}

			if (line.telno !== prev_telno) //カウントを戻す
				{
					max_lines = 0;
				}

			if (++max_lines <= MAX_TOP_TEL) //最大相手先数
				//常に0ということは...実はrecidは不要なのでは。
				{
					line.recid = 0;
					if (MAX_FLOAT32 < line.sec) line.sec = MAX_INT32;
					if (!this.m_inserter_toptel.insert(line)) return false;
				}

			prev_telno = line.telno;
		}

		result.free();
		return true;
	}

	getSQLTime(column = "time") {
// 2022cvt_015
		var sql = "(";
		sql += `(60*60*cast(substring(${column},1,2) as int4))`;
		sql += `+(60*cast(substring(${column},3,2) as int4))`;
		sql += `+cast(substring(${column},5,2) as int4)`;
		sql += `+(case when substring(${column},7,1)='5' then 1 else 0 end)`;
		sql += ")";
		return sql;
	}

	getSQLWhereTelno(pactid: string, carid: string, table_no: string, prefix = "") {
// 2022cvt_015
		var sql = " and " + prefix + "telno in (";
		sql += " select telno from tel_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		sql += " and length(telno)>0";
		sql += " group by telno";
		sql += " )";
		return sql;
	}

};
