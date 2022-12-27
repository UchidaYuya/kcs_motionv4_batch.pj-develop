//===========================================================================
//機能：通話明細から統計情報を抽出して、sim_trend_X_tbとsim_top_telno_X_tbを作る
//
//作成：中西
//日付：2006/12/11	パケットカウントから国際ものを外す
//更新：2007/01/25	削除時にcarid指定
//：2007/03/14	パケ・ホーダイへの対応
//：2007/06/15	パケ・ホーダイフルへの対応、totelnoによるパケット分類
//：2009/10/20	パケットを分類する文字列に半角文字を追加
//2011/08/26 森原
//通話明細がなく請求明細から通話秒数を求める部分を修正
//請求明細のcodetypeを'0'に限定
//一般通話秒数の自社携帯宛の比率を100%から25%に変更
//デジタル通話は、通話秒数をplan_tb.chargeからのみ求めている
//===========================================================================
//32bit最大値
//sim_top_telno に登録する最大件数
//平日昼間の利用率で、顧客単位のデフォルト値も無い場合の利用率
//define("G_AU_SIM_DAYTIME_RATIO", 70);
//パケット種別の分類パターン、totelno の日本語文字列で行っている.
//---------------------------------------------------------------------------
//機能：通話明細から統計情報を抽出して、sim_trend_X_tbとsim_top_telno_X_tbを作る

require("script_db.php");

require("script_common.php");

const MAX_FLOAT32 = 2147483647;
const MAX_INT32 = 2147483647;
const MAX_TOP_TEL = 10;
const FULL_BROWSER_PATTERN = "/\uFF8C\uFF99\uFF8C\uFF9E\uFF97\uFF73\uFF7B\uFF9E|\u30D5\u30EB\u30D6\u30E9\u30A6\u30B6/";
const I_MODE_PATTERN = "/i\uFF93\uFF70\uFF84\uFF9E|\uFF49\u30E2\u30FC\u30C9/";

//sim_trend_X_tbへのデータ挿入型
//sim_top_telno_X_tbへのデータ挿入型
//シミュレーション科目 => key の対応表
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
//キャリアID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//Note:
// commhistory_X_tb のtype一覧
//	N:携帯/					通話
//	n:PHS/					通話
//	I:携帯国際/				国際通話
//	P:携帯パケット/			通信
//	f:FOMA/					通話
//	p:FOMAパケット/			通信
//	i:FOMA国際/				国際通話
//	W:WORLD_WALKER/			国際通話
//	w:WORLD_WING/			国際通話
//	+:WORLD_WALKERプラス/	国際通話
//	R:WORLD_WALKERパケット/	国際通信
//	G:WORLD_WINGパケット/	国際通信
//
//通話タイプ
//国内通話タイプ
//var	$OverseaTuwaTypes = "'I', 'i', 'W', 'w', '+'";	// 国際通話タイプ
//通信タイプ
//機能：sim_trend_X_tbの通話時間帯あたりの集計を求める
//引数：顧客ID
//キャリアID
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
//	iMode      = 10	// iモード、ezWeb、Yahoo携帯など -- iモード専用サイト、メールなどのサービス
//	Browsing   = 20	// フルブラウザ、PCサイトビューアーなど -- PCと同様のブラウザ
//	一般・国際 = 30	// 一般パケット通信など -- プロバイダー接続
//
//機能：sim_trend_X_tbのパケット種別あたりの集計を求める
//引数：顧客ID
//キャリアID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：各電話についてのパケット数を記録する。executePacketCntから呼ばれるサブ関数
//引数：明細情報
//請求情報
//電話番号
//返値：深刻なエラーが発生したらfalseを返す
//
// 通話明細から区別がつくのは以下の３種。
//	通信データ量（メール）	メール（ｉモード接続）での通信データ量（バイト）
//	通信データ量（サイト）	サイト（ｉモード接続）での通信データ量（バイト）
//	通信データ量（その他）	ｉモード接続以外での通信データ量（バイト）
//
//機能：sim_trend_X_tbのパケット種別のさらに詳細な集計比率を求める
//引数：顧客ID
//キャリアID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：電話一個分のパケット比率を記録する
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tbから平日昼間の割合を得る
//引数：顧客ID
//キャリアID
//テーブルNo
//返値：電話番号、平日昼間の割合(100%) が含まれている連想配列
//備考：'timezone'を作成した後に実行すること
//機能：sim_trend_X_tbの総通話時間を求める
//引数：顧客ID
//キャリアID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tbの総通話回数を求める
//引数：顧客ID
//キャリアID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：上位かけ先電話を求める
//引数：顧客ID
//キャリアID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
//機能：commhistory_X_tbから、timeを秒数として取り出す部分を返す
//備考：timeが空文字列やNULLのレコードに対して使用しない事
//引数：timeに該当するカラム名
//機能：sim_trend_X_tbから、電話番号が空白のレコードを除外するSQL文を返す
//引数：顧客ID
//キャリアID
//テーブル番号
//プレフィックス("tel_tb."を想定)
//返値：ANDで始まるSQL文の一部
class updateTrendNttDocomo extends ScriptDBAdaptor {
	constructor() {
		super(...arguments);
		this.DocomoTuwaTypes = "'N', 'n', 'I', 'f', 'i', 'W', 'w', '+'";
		this.DomesticTuwaTypes = "'N', 'n', 'f'";
		this.DocomoCommTypes = "'P', 'p', 'R', 'G'";
	}

	UpdateTrendNttDocomo(listener, db, table_no, inserterTrend, inserterToptel) //シミュレーション科目 => key の対応表
	{
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_inserter_trend = inserterTrend;
		this.m_inserter_toptel = inserterToptel;
		this.H_Kamoku_Key = {
			140: 10,
			141: 10,
			142: 10,
			143: 10,
			144: 20,
			145: 30,
			146: 30
		};
	}

	delete(pactid, carid, year, month, fname_trend, fname_toptel) //sim_trend_X_tbをバックアップ
	//sim_top_telno_X_tbをバックアップ
	//2007/01/25 carid指定
	{
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from sim_trend_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and carid=" + this.escape(carid) + " and code in (" + "'timezone'," + "'timezone_digi'," + "'packetcnt'," + "'packetratio'," + "'tuwasec'," + "'tuwacnt'," + "'ismobile'" + ")" + " and length(coalesce(telno,''))>0" + this.getSQLWhereTelno(pactid, carid, table_no);

		if (fname_trend.length) {
			if (!this.m_db.backup(fname_trend, "select *" + sqlfrom + ";")) return false;
		}

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

	execute(pactid, carid, year, month) //挿入準備
	{
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

	executeTimezone(pactid, carid, table_no) //平日の08:00～19:00なら平日昼(0)
	//tdow=1は日曜日
	//それ以外なら(1)
	//時
	//曜日
	//通話タイプ
	//明細からデジタル通信を見分けるか、手がかりがない。
	//むしろ請求からは明確にとれるのだが。
	{
		var line;
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
		sql += " and type in (" + this.DocomoTuwaTypes + ")";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and time is not null";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
		return true;
	}

	executeIsmobile(pactid, carid, table_no) //080か090で始まっていたらキーは1で、それ以外はゼロ
	//通話タイプ
	{
		var H_line;
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
		sql += " and type in (" + this.DocomoTuwaTypes + ")";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and time is not null";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
		var O_result = this.m_db.query(sql);

		while (H_line = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_INT32 < H_line.value) H_line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(H_line)) return false;
		}

		O_result.free();
		return true;
	}

	executePacketCnt(pactid, carid, table_no) //// まず通話明細を取得する	-- 2007/06/15
	//$sql .= " and telno = '09052422657'";	// DEBUG -- 特定の電話指定
	//echo $sql . "\n"; // DEBUG
	//最後の電話について記録
	//// 請求明細から取得する
	//パケット通信科目
	//140 は未分類のものです。合計値ではない。
	//BEGIN 内部テーブル
	//パケットの種類によって、それぞれ単価が異なる
	//パケットパック有りの場合はpacket_tb から、無ければplan_tbから得る
	//データ専用プランの場合is_data=true、無条件でplan_tb側から取る
	//is_empty フラグが true の場合は plan_tb の方から値を取得する 2009/01/09 by T.Naka
	//<- ここには来ないはず
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb, packet_tb
	//$sql .= " and tel_tb.telno = '09052422657'";	// DEBUG -- 特定の電話指定
	//20110826morihara codetypeは'0'のみとする
	//内部テーブルの GROUP BY
	//END 内部テーブル
	//全体の GROUP BY, ORDER BY
	//echo $sql . "\n"; // DEBUG
	//注意：請求データに通信科目が１件も入っていなくても、実際に通信している電話がある。
	//パケ・ホーダイは通信無料なので請求データだけを見ても無駄。
	//こういった電話は、請求データが０件であっても、通話明細を見なければならない。
	//最後の電話の書き込み処理
	//通話明細だけがあって請求情報が無い電話は、そのまま通話明細を上げる
	{
		var line;
		var sql = "select telno, totelno, sum(byte) as sum_byte";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " and byte is not null and byte > 0";
		sql += " group by telno, totelno";
		sql += " order by telno";
		var H_meisai = Array();
		var prev_tel = "";
		var sum_mode = 0;
		var sum_browse = 0;
		var sum_other = 0;
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //電話番号が変わったら
		{
			var telno = line.telno;

			if (prev_tel !== "" && telno !== prev_tel) //連想配列に記録する
				//変数初期化
				{
					H_meisai[prev_tel] = [+Math.ceil(sum_mode / G_PACKET_SIZE), +(sum_browse / G_PACKET_SIZE), +Math.ceil(sum_other / G_PACKET_SIZE)];
					sum_mode = 0;
					sum_browse = 0;
					sum_other = 0;
				}

			if (preg_match(FULL_BROWSER_PATTERN, line.totelno)) //'iﾓｰﾄﾞ(ﾌﾙﾌﾞﾗｳｻﾞ)'と入ってくる
				{
					sum_browse += line.sum_byte;
				} else if (preg_match(I_MODE_PATTERN, line.totelno)) //'iﾓｰﾄﾞ'と入ってくる
				{
					sum_mode += line.sum_byte;
				} else //それ以外は全てその他と見なす
				{
					sum_other += line.sum_byte;
				}

			prev_tel = telno;
		}

		H_meisai[prev_tel] = [+Math.ceil(sum_mode / G_PACKET_SIZE), +Math.ceil(sum_browse / G_PACKET_SIZE), +Math.ceil(sum_other / G_PACKET_SIZE)];
		result.free();
		var packet_kamoku = "'140','141','142','143','144','145','146'";
		sql = "select telno, simkamoku, sum(value) as value";
		sql += " from (";
		sql += "select";
		sql += " details_tb.telno as telno,";
		sql += " utiwake_tb.simkamoku as simkamoku,";
		sql += " (case";
		sql += "  when utiwake_tb.simkamoku in('140','141','142','143')";
		sql += "   and (plan_tb.is_data != true and packet_tb.is_empty = false and packet_tb.charge_mode != 0)";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_mode )";
		sql += "  when utiwake_tb.simkamoku in('140','141','142','143')";
		sql += "   and (plan_tb.is_data != true and packet_tb.is_empty = true and plan_tb.charge_mode != 0)";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_mode )";
		sql += "  when utiwake_tb.simkamoku in('140','141','142','143')";
		sql += "   and plan_tb.is_data = true and plan_tb.charge_mode != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_mode )";
		sql += "  when utiwake_tb.simkamoku in('144')";
		sql += "   and (plan_tb.is_data != true and packet_tb.is_empty = false and packet_tb.charge_browse != 0)";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_browse )";
		sql += "  when utiwake_tb.simkamoku in('144')";
		sql += "   and (plan_tb.is_data != true and packet_tb.is_empty = true and plan_tb.charge_browse != 0)";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_browse )";
		sql += "  when utiwake_tb.simkamoku in('144')";
		sql += "   and plan_tb.is_data = true and plan_tb.charge_browse != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_browse )";
		sql += "  when utiwake_tb.simkamoku in('145','146')";
		sql += "   and (plan_tb.is_data != true and packet_tb.is_empty = false and packet_tb.charge_other != 0)";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_other )";
		sql += "  when utiwake_tb.simkamoku in('145','146')";
		sql += "   and (plan_tb.is_data != true and packet_tb.is_empty = true and plan_tb.charge_other != 0)";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_other )";
		sql += "  when utiwake_tb.simkamoku in('145','146')";
		sql += "   and plan_tb.is_data = true and plan_tb.charge_other != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_other )";
		sql += "  else 0";
		sql += " end) as value";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join tel_" + table_no + "_tb as tel_tb on (details_tb.pactid=tel_tb.pactid and details_tb.telno=tel_tb.telno and details_tb.carid = tel_tb.carid)";
		sql += " inner join utiwake_tb on (details_tb.carid = utiwake_tb.carid and details_tb.code = utiwake_tb.code)";
		sql += " inner join plan_tb on (plan_tb.planid=tel_tb.planid and plan_tb.carid=tel_tb.carid)";
		sql += " left outer join packet_tb on (packet_tb.packetid=tel_tb.packetid and packet_tb.carid=tel_tb.carid and packet_tb.simbefore=true)";
		sql += " where";
		sql += " tel_tb.pactid=" + this.escape(pactid) + " and tel_tb.carid=" + carid;
		sql += " and utiwake_tb.planflg = true and utiwake_tb.simkamoku in (" + packet_kamoku + ")";
		sql += " and coalesce(utiwake_tb.codetype,'')='0'";
		sql += this.getSQLWhereTelno(pactid, carid, table_no, "tel_tb.");
		sql += " group by details_tb.telno, utiwake_tb.simkamoku,";
		sql += " plan_tb.charge_mode, plan_tb.charge_browse, plan_tb.charge_other, plan_tb.is_data,";
		sql += " packet_tb.charge_mode, packet_tb.charge_browse, packet_tb.charge_other, simkamoku,";
		sql += " plan_tb.charge_mode, plan_tb.charge_browse, plan_tb.charge_other, packet_tb.is_empty";
		sql += ") as inner_tb";
		sql += "  group by telno, simkamoku order by telno";
		sql += ";";
		result = this.m_db.query(sql);
		prev_tel = "";
		var H_result = Array();

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //電話番号が変わったら
		{
			telno = line.telno;

			if (prev_tel !== "" && telno !== prev_tel) //通話明細から消し込む
				//変数再初期化
				{
					if (this.writePacketCnt(H_meisai, H_result, prev_tel) == false) {
						return false;
					}

					delete H_meisai[prev_tel];
					H_result = Array();
				}

			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			H_result[line.simkamoku] = line.value;
			prev_tel = line.telno;
		}

		if (prev_tel !== "") //通話明細から消し込む
			{
				if (this.writePacketCnt(H_meisai, H_result, prev_tel) == false) {
					return false;
				}

				delete H_meisai[prev_tel];
			}

		result.free();

		for (var telno in H_meisai) //print "DEBUG: 通話明細のみ: telno=$telno, $p_mode, $p_browse, $p_other\n";
		{
			var A_meisai = H_meisai[telno];
			var p_mode, p_browse, p_other;
			[p_mode, p_browse, p_other] = A_meisai;

			if (p_mode != 0) //iモード、ezWeb、Yahoo携帯など
				//print_r( $inline );	// DEBUG
				{
					var inline = {
						telno: telno,
						code: "packetcnt",
						key: "10",
						value: +Math.round(p_mode)
					};
					if (!this.m_inserter_trend.insert(inline)) return false;
				}

			if (p_browse != 0) //フルブラウザ、PCサイトビューアーなど
				//print_r( $inline );	// DEBUG
				{
					inline = {
						telno: telno,
						code: "packetcnt",
						key: "20",
						value: +Math.round(p_browse)
					};
					if (!this.m_inserter_trend.insert(inline)) return false;
				}

			if (p_other != 0) //print_r( $inline );	// DEBUG
				{
					inline = {
						telno: telno,
						code: "packetcnt",
						key: "30",
						value: +Math.round(p_other)
					};
					if (!this.m_inserter_trend.insert(inline)) return false;
				}
		}

		return true;
	}

	writePacketCnt(H_meisai, H_result, prev_tel) //明細から得られた値で上書きする
	//書き込み処理
	{
		if (undefined !== H_meisai[prev_tel]) {
			var p_mode, p_browse, p_other;
			[p_mode, p_browse, p_other] = H_meisai[prev_tel];

			if (p_mode != 0 || p_browse != 0 || p_other != 0) //print "DEBUG: H_meisai: telno=$prev_tel, $p_mode, $p_browse, $p_other\n";
				//明細バイトがあれば、請求から求めた値は破棄する
				{
					if (undefined !== H_result["140"]) //print "DEBUG: 140を破棄、". $H_result['140'] . "\n";
						//ｉモード合計を破棄
						{
							delete H_result["140"];
						}

					if (undefined !== H_result["141"]) //print "DEBUG: 141を破棄、". $H_result['141'] . "\n";
						//ｉモードメールを破棄
						{
							delete H_result["141"];
						}

					if (undefined !== H_result["142"]) //print "DEBUG: 142を破棄、". $H_result['142'] . "\n";
						//ｉモードブラウザを破棄
						{
							delete H_result["142"];
						}

					if (undefined !== H_result["143"]) //print "DEBUG: 143を破棄、". $H_result['143'] . "\n";
						//ｉモードその他を破棄
						{
							delete H_result["143"];
						}

					if (p_mode > 0) //print "DEBUG: 140iモード上書き、". $p_mode . "\n";
						{
							H_result["140"] = p_mode;
						}

					if (undefined !== H_result["144"]) //print "DEBUG: 144を破棄、". $H_result['144'] . "\n";
						//フルブラウザを破棄
						{
							delete H_result["144"];
						}

					if (p_browse > 0) //print "DEBUG: 144フルブラウザ、". $p_browse . "\n";
						{
							H_result["144"] = p_browse;
						}

					if (undefined !== H_result["145"]) //print "DEBUG: 145を破棄、". $H_result['145'] . "\n";
						//一般パケット通信を破棄
						{
							delete H_result["145"];
						}

					if (p_other > 0) //print "DEBUG: 145一般パケット、". $p_other . "\n";
						{
							H_result["145"] = p_other;
						}
				}
		}

		var H_result_key = Array();

		for (var simkamoku in H_result) //科目 => key変換
		{
			var value = H_result[simkamoku];
			var key = this.H_Kamoku_Key[simkamoku];

			if (undefined !== H_result_key[key]) //２回目以降
				{
					H_result_key[key] += value;
				} else //初回
				{
					H_result_key[key] = value;
				}
		}

		for (var key in H_result_key) //print_r( $inline );	// DEBUG
		{
			var value = H_result_key[key];
			var inline = {
				telno: prev_tel,
				code: "packetcnt",
				key: key,
				value: +Math.round(value)
			};
			if (!this.m_inserter_trend.insert(inline)) return false;
		}

		return true;
	}

	executePacketRatio(pactid, carid, table_no) //通話明細から比率を求める
	//byteの有無で通話/通信を判断する
	//電話毎の結果
	{
		var line;
		var sql = "select telno,totelno";
		sql += ",sum(coalesce(byte,0)) as totalbytes";
		sql += ",sum(coalesce(byte_mail,0)) as sum_mail";
		sql += ",sum(coalesce(byte_site,0)) as sum_site";
		sql += ",sum(coalesce(byte_other,0)) as sum_other";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is not null";
		sql += " and byte > 0";
		sql += " and type in ('p','P')";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno,totelno";
		sql += " order by telno,totelno";
		sql += ";";
		var H_result = Array();
		var cur_telno = "";
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (strcmp(cur_telno, line.telno)) //電話番号が切り替わった
				{
					if (H_result.length) {
						if (!this.executePacketRatioTelno(pactid, carid, cur_telno, H_result)) return false;
					}

					H_result = Array();
					cur_telno = line.telno;
				}

			H_result[line.totelno] = line;
		}

		result.free();

		if (H_result.length) //最後の電話を処理する
			{
				if (!this.executePacketRatioTelno(pactid, carid, cur_telno, H_result)) return false;
			}

		return true;
	}

	executePacketRatioTelno(pactid, carid, telno, H_result: {} | any[]) //総バイト数を求め、それがゼロなら何もせずに戻る
	//各種別のパケット比率を記録する
	//メール
	{
		var totalbytes = 0;

		for (var line of Object.values(H_result)) totalbytes += line.totalbytes;

		if (!totalbytes) return true;
		var sum_mail = 0;
		var sum_site = 0;
		var sum_other = 0;

		for (var line of Object.values(H_result)) {
			if (preg_match(I_MODE_PATTERN, line.totelno)) //かけ先がiモードなら、種別をそのまま集計する
				{
					sum_mail += line.sum_mail;
					sum_site += line.sum_site;
					sum_other += line.sum_other;
				} else //そうでなければ、その他パケットとする
				{
					sum_other += line.totalbytes;
				}
		}

		var inline = {
			telno: telno,
			code: "packetratio",
			key: 11,
			value: +(sum_mail * 100 / totalbytes)
		};
		if (!this.m_inserter_trend.insert(inline)) return false;
		inline = {
			telno: telno,
			code: "packetratio",
			key: 12,
			value: +(sum_site * 100 / totalbytes)
		};
		if (!this.m_inserter_trend.insert(inline)) return false;
		inline = {
			telno: telno,
			code: "packetratio",
			key: 13,
			value: +(sum_other * 100 / totalbytes)
		};
		if (!this.m_inserter_trend.insert(inline)) return false;
		return true;
	}

	getDaytimeRatio(pactid, carid, table_no) //2006/12/19 by T.Naka
	//最後の電話
	{
		var line;
		var sql = "select telno, key, value from sim_trend_" + table_no + "_tb";
		sql += " where pactid='" + pactid + "'";
		sql += " and carid=" + carid;
		sql += " and code='timezone'";
		sql += " order by telno";
		var H_result = Array();
		var result = this.m_db.query(sql);
		var prev_tel = "";
		var val0 = 0;
		var val1 = 0;

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //電話番号が変わったら
		{
			if (prev_tel !== "" && line.telno !== prev_tel) {
				if (val0 + val1 > 0) {
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

	executeTuwasec(pactid, carid, table_no) //まず通話明細から取得を試みる
	//国内通話のみをカウントする
	//2006/12/19 by T.Naka
	//147 デジタル通信を除外する、直値埋め込み! // 2009/01/22
	//平日昼間・それ以外の比率を100%で得る
	//通話明細が無かった電話については、請求明細から取得する
	//通常通話科目
	//$sql .= ",plan_tb.charge, plan_tb.chgunit, plan_tb.nightcharge";
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(kamokuが通常通話 and pactid,carid,planflg,simbefore)
	//20110826morihara codetypeは'0'のみとする
	//既に通話明細から結果が得られた電話は除く
	//国内通話のみをカウントする
	//147 デジタル通信を除外する、直値埋め込み! // 2009/01/22
	//GROUP BYとORDER BY
	//20110826morihara 自社携帯とそれ以外で按分
	//$sql .= " group by details_tb.telno, plan_tb.charge, plan_tb.nightcharge, plan_tb.chgunit";
	//デジタル通信の秒数を求める
	//通信明細から求められないので、請求から求めることにしよう。
	//請求明細から取得する
	//デジタル通信科目
	//20110826morihara digichargeがゼロ円なら1円換算にした
	//$sql .= ",round(sum(details_tb.charge) * plan_tb.digichgunit / plan_tb.digicharge) as value";
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(kamokuがデジタル通信 and pactid,carid,planflg,simbefore)
	//20110826morihara 0割は通話料を1円換算にした
	//$sql .= " and plan_tb.digicharge != 0";	// 0割を防ぐ、2010/06/21追加
	//20110826morihara codetypeは'0'のみとする
	//GROUP BYとORDER BY
	//tuwasecが作られなかった場合はtuwasec=0を追加
	{
		var line;
		var H_telno = Array();
		var sql = "select telno";
		sql += ",sum(" + this.getSQLTime() + ") as value";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and type in (" + this.DomesticTuwaTypes + ")";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " and kubun1 != '\u30C7\u30B8\uFF16\uFF14\uFF2B'";
		sql += " group by telno, type";
		sql += " order by telno";
		sql += ";";
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //通常の通話
		{
			H_telno[line.telno] = 1;
			line.code = "tuwasec";
			line.key = 0;
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
		var H_daytime_ratio = this.getDaytimeRatio(pactid, carid, table_no);
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
		sql += " and plan_tb.simbefore = true";
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.simkamoku in (" + tuwa_kamoku + ")";
		sql += " and coalesce(utiwake_tb.codetype,'')='0'";
		sql += this.getSQLWhereTelno(pactid, carid, table_no, "tel_tb.");
		sql += " and tel_tb.telno not in (";
		sql += "select telno";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and type in (" + this.DomesticTuwaTypes + ")";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += " and kubun1 != '\u30C7\u30B8\uFF16\uFF14\uFF2B'";
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
		//20110826morihara ゼロ割対策として単価を極端に安くする
		{
			var telno = line.telno;

			if (undefined !== H_daytime_ratio[telno]) {
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
					var charge = line.charge * 100;
				} else //違っていれば平日昼間とそれ以外で比例配分
				{
					charge = line.charge * daytime_ratio + line.nightcharge * (100 - daytime_ratio);
				}

			if (is_null(charge) == true || charge == 0) {
				charge = 100;
			}

			if (charge != 0) //charge == 0 なのは通信専用プラン等のはず
				{
					H_telno[line.telno] = 1;
					var inline = {
						telno: line.telno,
						code: "tuwasec",
						key: 0,
						value: +(line.sum_charge * line.chgunit * 100 / charge)
					};
					if (!this.m_inserter_trend.insert(inline)) return false;
				}
		}

		result.free();
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
		sql += " and plan_tb.simbefore = true";
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.simkamoku in (" + digi_kamoku + ")";
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

			if (false == (undefined !== line.value)) {
				line.value = 0;
			}

			if (!this.m_inserter_trend.insert(line)) {
				return false;
			}
		}

		result.free();
		sql = "SELECT " + "telno " + "FROM " + "sim_trend_" + table_no + "_tb " + "WHERE " + "code = 'predata_basic' " + this.getSQLWhereTelno(pactid, carid, table_no) + " ";

		if (H_telno.length > 0) {
			sql += "AND telno NOT IN('" + Object.keys(H_telno).join("','") + "') ";
		}

		sql += "GROUP BY telno";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
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

	executeTuwacnt(pactid, carid, table_no) //通常の通話を求める
	//通話タイプ
	//2006/12/19 by T.Naka
	//
	//		// 通信明細からデジタル通信を見分ける手がかりがない。
	//		// デジタル通信の回数取得はあきらめよう。
	//
	{
		var line;
		var sql = "select telno";
		sql += ",count(*) as value";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and type in (" + this.DocomoTuwaTypes + ")";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno";
		sql += " order by telno";
		sql += ";";
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

	executeToptel(pactid, carid, table_no) //国内通話タイプ
	//2006/12/19 by T.Naka
	{
		var line;
		var sql = "select telno,totelno,sum " + this.getSQLTime() + " as sec";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and type in (" + this.DomesticTuwaTypes + ")";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno,totelno";
		sql += " order by telno,sec desc";
		sql += ";";
		var result = this.m_db.query(sql);
		var max_lines = 0;
		var prev_tel = "";

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //今回の電話番号を記録
		{
			if (prev_tel == "") //初回
				{
					prev_tel = line.telno;
				}

			if (line.telno !== prev_tel) //カウントを戻す
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

			prev_tel = line.telno;
		}

		result.free();
		return true;
	}

	getSQLTime(column = "time") {
		var sql = "(";
		sql += `(60*60*cast(substring(${column},1,2) as int4))`;
		sql += `+(60*cast(substring(${column},3,2) as int4))`;
		sql += `+cast(substring(${column},5,2) as int4)`;
		sql += `+(case when substring(${column},7,1)='5' then 1 else 0 end)`;
		sql += ")";
		return sql;
	}

	getSQLWhereTelno(pactid, carid, table_no, prefix = "") {
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