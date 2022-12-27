//===========================================================================
//機能：通話明細から統計情報を抽出して、sim_trend_X_tbとsim_top_telno_X_tbを作る
//PacketRatioを作り直すために、一時的に作成したデータ更新用バッチ
//
//作成：中西
//日付：2006/12/11	パケットカウントから国際ものを外す
//更新：2007/01/25	削除時にcarid指定
//更新：2007/08/02  上杉顕一郎 通信専用プランの場合 plan_tb.charge -> plan_tb.charge_otherに変更
//更新：2010/09.13	PacketRatioを作り直すために、一時的に作成した
//===========================================================================
// 以下の設定が定義されている
//var $H_packet_type;			//パケットタイプ -> コードのマスター表
//var $H_packet_detail;		//パケットのtoplace -> 詳細分類コードのマスター表
//var	$Packet_detail_null;	//パケットのtoplaceがnullだった場合の分類先
//var	$H_tuwa_type;			//通話タイプ、通常通話と国際通話に分ける
//var	$A_data_comm_type;		//デジタル通信に分類されるタイプ
//32bit最大値 -- update_trend_nttdocomo.php に定義あり
//sim_top_telno に登録する最大件数 -- update_trend_nttdocomo.php に定義あり
//define("MAX_TOP_TEL", 10 );
//平日昼間の利用率で、顧客単位のデフォルト値も無い場合の利用率
//define("G_AU_SIM_DAYTIME_RATIO", 70);
//---------------------------------------------------------------------------
//機能：通話明細から統計情報を抽出して、sim_trend_X_tbとsim_top_telno_X_tbを作る

require("script_db.php");

require("script_common.php");

require("update_trend_au.conf");

const MAX_FLOAT32 = 2147483647;
const MAX_INT32 = 2147483647;

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
//Note:
// commhistory_X_tb のtypeには、明細書に入ってきた名前がそのまま記録されている。
// 通話/通信 の判別は byte が null か否かによって行う。
// type を列挙すると次のようになる。
// select distinct(type) from commhistory_07_tb where carid=3;
//------------------------------------------
// Ｃメール送信明細
// ＰＣサイトビューアー通信明細
// ａｕ国際電話通話明細
// グローバルパスポートパケット通信明細
// グローバルパスポート通話明細
// パケット通信明細（ＢＲＥＷ）
// パケット通信明細（ＥＺＷＩＮインターＮ）
// パケット通信明細（ＥＺＷＩＮメール）
// パケット通信明細（ＥＺｗｅｂ＠ｍａｉｌ）
// パケット通信明細（ＥＺｗｅｂｍｕｌｔｉ）
// パケット通信明細（ａｕ．ＮＥＴ）
// パケット通信明細（データ通信）
// パケット通信明細（ハローメッセンジャー）
// 各種ダイヤルサービス通話明細
// 通話明細
// 分計通話明細
// 以下は通話に分類
// select distinct(type) from commhistory_07_tb where carid=3 and byte is null;
//------------------------------
// Ｃメール送信明細
// ａｕ国際電話通話明細
// グローバルパスポート通話明細
// 各種ダイヤルサービス通話明細
// 通話明細
// 分計通話明細
// パケット通信明細（ハローメッセンジャー）
// 以下は通信に分類される。
// select distinct(type) from commhistory_07_tb  where carid=3 and byte is not null;
//------------------------------------------
// ＰＣサイトビューアー通信明細
// グローバルパスポートパケット通信明細
// パケット通信明細（ＢＲＥＷ）
// パケット通信明細（ＥＺＷＩＮインターＮ）
// パケット通信明細（ＥＺＷＩＮメール）
// パケット通信明細（ＥＺｗｅｂ＠ｍａｉｌ）
// パケット通信明細（ＥＺｗｅｂｍｕｌｔｉ）
// パケット通信明細（ａｕ．ＮＥＴ）
// パケット通信明細（データ通信）
//
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
// 以下の表に従って分類している。
// 問題なのは、ここに無い typeが新たに加わったとき。この場合は警告を出す。
//------------------------------------------
// ＰＣサイトビューアー通信明細				=> PC
// グローバルパスポートパケット通信明細		=> 国際
// パケット通信明細（ＢＲＥＷ）				=> EZ
// パケット通信明細（ＥＺＷＩＮインターＮ）	=> EZ
// パケット通信明細（ＥＺＷＩＮメール）		=> EZ
// パケット通信明細（ＥＺｗｅｂ＠ｍａｉｌ）	=> EZ
// パケット通信明細（ＥＺｗｅｂｍｕｌｔｉ）	=> EZ
// パケット通信明細（ａｕ．ＮＥＴ）			=> 一般
// パケット通信明細（データ通信）				=> 一般
//	EZ = 10	// iモード、ezWeb、Yahoo携帯など -- iモード専用サイト、メールなどのサービス
//	PC = 20	// フルブラウザ、PCサイトビューアーなど -- PCと同様のブラウザ
//	一般・国際 = 30	// 一般パケット通信など -- プロバイダー接続
//
//機能：sim_trend_X_tbのパケット種別あたりの集計を求める
//引数：顧客ID
//テーブルNo
//返値：深刻なエラーが発生したらfalseを返す
// Note:
// case中での null の扱いは特別です。以下は例：
// select type, toplace, (case when toplace is null or trim(toplace)='' then 0 else 10 end)
// from commhistory_07_tb
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
class updateTrendAu extends ScriptDBAdaptor {
	UpdateTrendAu(listener, db, table_no, inserterTrend, inserterToptel) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_inserter_trend = inserterTrend;
		this.m_inserter_toptel = inserterToptel;
	}

	delete(pactid, carid, year, month, fname_trend, fname_toptel) //sim_trend_X_tbをバックアップ
	//ここは関係ない *
	//		//sim_top_telno_X_tbをバックアップ
	//		$sqlfrom = " from sim_top_telno_" . $table_no . "_tb"
	//			. " where pactid=" . $this->escape($pactid)
	//			. " and carid=" . $this->escape($carid);	// 2007/01/25 carid指定
	//		if (strlen($fname_toptel))
	//		{
	//			if ( ! $this->m_db->backup
	//				($fname_toptel, "select *" . $sqlfrom . ";"))
	//					return false;
	//		}
	//		//sim_top_telno_X_tbから既存のレコードを削除
	//		$sql = "delete" . $sqlfrom;
	//		$sql .= ";";
	//		$this->putError(G_SCRIPT_SQL, $sql);
	//		$this->m_db->query($sql);
	{
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from sim_trend_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and carid=" + this.escape(carid) + " and code in (" + "'packetratio'" + ")" + " and length(coalesce(telno,''))>0" + this.getSQLWhereTelno(pactid, carid, table_no);

		if (fname_trend.length) {
			if (!this.m_db.backup(fname_trend, "select *" + sqlfrom + ";")) return false;
		}

		var sql = "delete" + sqlfrom;
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
		if (!this.executePacketRatio(pactid, carid, table_no)) return false;
		if (!this.m_inserter_trend.end()) return false;
		if (!this.m_inserter_toptel.end()) return false;
		return true;
	}

	executeTimezone(pactid, carid, table_no) //通話の時間帯を求める
	//平日の08:00～19:00なら平日昼(0)
	//tdow=1は日曜日
	//それ以外なら(1)
	//時
	//曜日
	//byteの有無で通話/通信を判断する
	//デジタル通信の時間帯を求める
	//デジタル通信に分類されるタイプ
	//平日の08:00～19:00なら平日昼(0)
	//tdow=1は日曜日
	//それ以外なら(1)
	//時
	//曜日
	//$sql .= " and byte is not null";	// byteの有無で通話/通信を判断する
	//デジタル通信に属する
	{
		var line;
		if (!("A_data_comm_type" in global)) A_data_comm_type = undefined;
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
		var str_comm_type = "";
		var delim = "";

		for (var p_name of Object.values(A_data_comm_type)) {
			str_comm_type = delim + "'" + p_name + "'";
			delim = ",";
		}

		sql = "select telno,key,sum(sec) as value, 'timezone_digi' as code from";
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
		sql += " and type in(" + str_comm_type + ")";
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
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
		return true;
	}

	executeIsmobile(pactid, carid, table_no) //一般通話の集計を行う
	//080か090で始まっていたらキーは1で、それ以外はゼロ
	//byteの有無で通話/通信を判断する
	//デジタル通信の集計を行う
	//デジタル通信に分類されるタイプ
	//080か090で始まっていたらキーは1で、それ以外はゼロ
	//$sql .= " and byte is not null";	// byteの有無で通話/通信を判断する
	//デジタル通信に属する
	{
		var H_line;
		if (!("A_data_comm_type" in global)) A_data_comm_type = undefined;
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
		var str_comm_type = "";
		var delim = "";

		for (var p_name of Object.values(A_data_comm_type)) {
			str_comm_type = delim + "'" + p_name + "'";
			delim = ",";
		}

		sql = "select telno,key,sum(sec) as value," + "'ismobile_digi' as code from";
		sql += "(";
		sql += "select telno,sec";
		sql += ",(case when '080'=pre or '090'=pre then 1 else 0 end) as key";
		sql += " from";
		sql += "(";
		sql += "select telno," + this.getSQLTime() + " as sec";
		sql += ",substr(totelno,1,3) as pre";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and type in(" + str_comm_type + ")";
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
		O_result = this.m_db.query(sql);

		while (H_line = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (MAX_INT32 < H_line.value) H_line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(H_line)) return false;
		}

		O_result.free();
		return true;
	}

	executePacketCnt(pactid, carid, table_no) //まずパケット明細から取得を試みる
	//本来あってはならない未分類値
	//エラーメッセージ用
	//byteの有無で通話/通信を判断する
	//echo $sql . "\n"; // DEBUG
	//パケット明細が無かった電話については、請求明細から取得する
	//パケット通信科目
	//140 は未分類のものです。合計値ではない。
	//146, 148 国際ものはカウントから除外する
	//BEGIN 内部テーブル
	//科目 => パケットの種類
	//ez未分類
	//ezメール
	//ezブラウザ
	//ezその他
	//ブラウジング
	//一般パケット通信
	//is_data が true か否かで、データ専用/それ以外のWIN,1X を判別
	//パケットの種類 10～30 によって、それぞれ単価が異なる
	//update 2007-08-02 上杉顕一郎 plan_tb.charge ->plan_tb.charge_other
	//update 2007-08-02 上杉顕一郎 plan_tb.charge ->plan_tb.charge_other
	//is_empty フラグが true の場合は plan_tb の方から値を取得する 2009/01/09 by T.Naka
	//<- ここには来ないはず
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb, packet_tb
	//既にパケット明細から結果が得られた電話は除く
	//byteの有無で通話/通信を判断する
	//内部テーブルの GROUP BY
	//END 内部テーブル
	//全体の GROUP BY, ORDER BY
	//echo $sql . "\n"; // DEBUG
	{
		if (!("H_packet_type" in global)) H_packet_type = undefined;
		var sql = "select telno, key, ceil(sum(byte2)/" + G_PACKET_SIZE + ") as value, 'packetcnt' as code from";
		sql += "(";
		sql += "select telno,byte2,(case";

		for (var p_name in H_packet_type) {
			var p_type = H_packet_type[p_name];
			sql += " when type='" + p_name + "' then " + p_type;
		}

		sql += " else 0";
		sql += " end) as key";
		sql += ",type";
		sql += " from(";
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
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (line.key == 99) //パケット数として加算しない
				{
					continue;
				} else if (line.key != 0) //明細typeが存在した
				//unset( $line["type"] );	// typeは不要
				{
					if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
					if (!this.m_inserter_trend.insert(line)) return false;
				} else {
				this.putError(G_SCRIPT_WARNING, "\u30D1\u30B1\u30C3\u30C8\u660E\u7D30\u306B\u672A\u77E5\u306E\u30BF\u30A4\u30D7\u304C\u3042\u308A\u307E\u3057\u305F\u3001\u96FB\u8A71\u756A\u53F7=(" + line.telno + ")\u3002lib/update_trend_au.conf\u306B\u8FFD\u8A18\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
				return false;
			}
		}

		result.free();
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
		sql += "  when plan_tb.is_data =true and plan_tb.charge_other != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_other )";
		sql += "  when plan_tb.is_data !=true and packet_tb.is_empty=false " + "and utiwake_tb.simkamoku in('140','141','142','143') and packet_tb.charge_mode != 0";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_mode )";
		sql += "  when plan_tb.is_data !=true and packet_tb.is_empty=false  " + "and utiwake_tb.simkamoku in('144') and packet_tb.charge_browse != 0";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_browse )";
		sql += "  when plan_tb.is_data !=true and packet_tb.is_empty=false " + "and utiwake_tb.simkamoku in('145') and packet_tb.charge_other != 0";
		sql += "   then (sum(details_tb.charge) / packet_tb.charge_other )";
		sql += "  when plan_tb.is_data !=true and packet_tb.is_empty=true " + "and utiwake_tb.simkamoku in('140','141','142','143') and plan_tb.charge_mode != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_mode )";
		sql += "  when plan_tb.is_data !=true and packet_tb.is_empty=true  " + "and utiwake_tb.simkamoku in('144') and plan_tb.charge_browse != 0";
		sql += "   then (sum(details_tb.charge) / plan_tb.charge_browse )";
		sql += "  when plan_tb.is_data !=true and packet_tb.is_empty=true " + "and utiwake_tb.simkamoku in('145') and plan_tb.charge_other != 0";
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
		sql += " and packet_tb.simbefore = true";
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
		sql += " group by details_tb.telno, utiwake_tb.simkamoku, plan_tb.is_data,";
		sql += " plan_tb.charge_other, packet_tb.charge_mode, packet_tb.charge_browse, packet_tb.charge_other, key,";
		sql += " packet_tb.is_empty, plan_tb.charge_mode, plan_tb.charge_browse, plan_tb.charge_other";
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

	executePacketRatio(pactid, carid, table_no) //集計対象となるtypeを抜き出す
	//本来あってはならない未分類値
	//byteの有無で通話/通信を判断する
	//このタイプのものだけを集計する
	//最後の電話についての処理
	{
		if (!("H_packet_detail" in global)) H_packet_detail = undefined;
		if (!("H_packet_type" in global)) H_packet_type = undefined;
		if (!("Packet_detail_null" in global)) Packet_detail_null = undefined;
		var in_type = "";
		var delim = "";

		for (var p_name in H_packet_type) {
			var p_type = H_packet_type[p_name];

			if (p_type == 10) //２回目以降には , が付く
				{
					in_type += delim + "'" + p_name + "'";
					delim = ",";
				}
		}

		if (in_type == "") //集計対象が空だった
			//何も入れずに終了
			{
				return true;
			}

		var sql = "select telno,key,sum(byte2) as value from";
		sql += "(";
		sql += "select telno,byte2,(case";

		for (var p_name in H_packet_detail) {
			var p_type = H_packet_detail[p_name];
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
		sql += " and type in(" + in_type + ")";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += ") as inner_tb";
		sql += ") as middle_tb";
		sql += " group by telno,key";
		sql += " order by telno,key";
		sql += ";";
		var result = this.m_db.query(sql);
		var prev_telno = "";
		var sum_packet = 0;
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

	insertPacketRatio(prev_telno, sum_packet, H_key_value) {
		for (var key in H_key_value) //0割に注意
		{
			var value = H_key_value[key];

			if (sum_packet != 0) //比率(%)
				{
					var ratio = +(value * 100 / sum_packet);
				} else {
				ratio = 0;
			}

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

	getDaytimeRatio(pactid, carid, table_no) //最後の電話
	{
		var line;
		var sql = "select telno, key, value from sim_trend_" + table_no + "_tb";
		sql += " where pactid='" + pactid + "'";
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
	//エラーメッセージ用
	//本来あってはならない未分類値
	//byteの有無で通話/通信を判断する
	//2006/12/19 by T.Naka
	//echo $sql ."\n"; // DEBUG
	//平日昼間・それ以外の比率を100%で得る
	//通話明細が無かった電話については、請求明細から取得する
	//通常通話科目
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(kamokuが通常通話 and pactid,carid,planflg,simbefore)
	//既に通話明細から結果が得られた電話は除く
	//byteの有無で通話/通信を判断する
	//GROUP BYとORDER BY
	//デジタル通信の秒数を求める
	//ToDo: デジタル通信は本当にあるのだろうか。。。
	//とりあえずは通信明細から求めることを止めて、請求から求めることにしよう。
	//請求明細から取得する
	//デジタル通信科目
	//FROM節(tel_details_X_tb <- tel_X_tb <- utiwake_tb <- plan_tb
	//WHERE節(kamokuがデジタル通信 and pactid,carid,planflg,simbefore)
	//0割を防ぐ、2010/06/21追加
	//GROUP BYとORDER BY
	//tuwasecが作られなかった場合はtuwasec=0を追加
	{
		if (!("H_tuwa_type" in global)) H_tuwa_type = undefined;
		var H_telno = Array();
		var sql = "select telno";
		sql += ",sum(" + this.getSQLTime() + ") as value";
		sql += ",type";
		sql += ",(case";

		for (var p_name in H_tuwa_type) {
			var p_type = H_tuwa_type[p_name];
			sql += " when type='" + p_name + "' then " + p_type;
		}

		sql += " else 0";
		sql += " end) as type_check";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno, type";
		sql += " order by telno";
		sql += ";";
		var result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) {
			if (line.type_check == 1) //「国内通話」だけを追加する
				//typeは不要
				//type_checkは不要
				//通常の通話
				{
					H_telno[line.telno] = 1;
					delete line.type;
					delete line.type_check;
					line.code = "tuwasec";
					line.key = 0;
					if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
					if (!this.m_inserter_trend.insert(line)) return false;
				} else if (line.type_check == 0) {
				this.putError(G_SCRIPT_WARNING, "\u901A\u8A71\u660E\u7D30\u306B\u672A\u77E5\u306E\u30BF\u30A4\u30D7(" + line.type + ")\u304C\u3042\u308A\u307E\u3057\u305F\u3002lib/update_trend_au.conf\u306B\u8FFD\u8A18\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
				return false;
			}
		}

		result.free();
		var H_daytime_ratio = this.getDaytimeRatio(pactid, carid, table_no);
		var tuwa_kamoku = "'121'";
		sql = "select details_tb.telno as telno";
		sql += ",sum(details_tb.charge) as sum_charge";
		sql += ",plan_tb.charge, plan_tb.chgunit, plan_tb.nightcharge";
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
		sql += this.getSQLWhereTelno(pactid, carid, table_no, "tel_tb.");
		sql += " and tel_tb.telno not in (";
		sql += "select telno";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += " group by telno";
		sql += ")";
		sql += " group by details_tb.telno, plan_tb.charge, plan_tb.nightcharge, plan_tb.chgunit";
		sql += " order by details_tb.telno";
		sql += ";";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //平日昼間とそれ以外の割合を得る
		//料金
		{
			H_telno[line.telno] = 1;
			var telno = line.telno;

			if (undefined !== H_daytime_ratio[telno]) {
				var daytime_ratio = H_daytime_ratio[telno];
			} else if (undefined !== H_daytime_ratio[""]) //会社全体のデフォルト値を適用
				{
					daytime_ratio = H_daytime_ratio[""];
				} else {
				daytime_ratio = G_AU_SIM_DAYTIME_RATIO;
			}

			if (line.charge == line.nightcharge) //等しければそのまま(100%)
				{
					var charge = line.charge * 100;
				} else //違っていれば平日昼間とそれ以外で比例配分
				{
					charge = line.charge * daytime_ratio + line.nightcharge * (100 - daytime_ratio);
				}

			var inline = {
				telno: line.telno,
				code: "tuwasec",
				key: 0,
				value: +(line.sum_charge * line.chgunit * 100 / charge)
			};
			if (!this.m_inserter_trend.insert(inline)) return false;
		}

		result.free();
		var digi_kamoku = "'147'";
		sql = "select details_tb.telno as telno";
		sql += ",round(sum(details_tb.charge) * plan_tb.digichgunit / plan_tb.digicharge) as value";
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
		sql += " and plan_tb.digicharge != 0";
		sql += " and utiwake_tb.planflg = true";
		sql += " and utiwake_tb.simkamoku in (" + digi_kamoku + ")";
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
	//byteの有無で通話/通信を判断する
	//2006/12/19 by T.Naka
	//デジタル通信の回数を求める
	//デジタル通信に分類されるタイプ
	//2006/12/19 by T.Naka
	{
		var line;
		if (!("A_data_comm_type" in global)) A_data_comm_type = undefined;
		var sql = "select telno";
		sql += ",count(*) as value";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
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
		var str_comm_type = "";
		var delim = "";

		for (var p_name of Object.values(A_data_comm_type)) {
			str_comm_type = delim + "'" + p_name + "'";
			delim = ",";
		}

		sql = "select telno";
		sql += ",count(*) as value";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and type in(" + str_comm_type + ")";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno, type";
		sql += " order by telno";
		sql += ";";
		result = this.m_db.query(sql);

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //デジタル通信
		{
			line.code = "tuwacnt";
			line.key = 1;
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			if (!this.m_inserter_trend.insert(line)) return false;
		}

		result.free();
		return true;
	}

	executeToptel(pactid, carid, table_no) //byteの有無で通話/通信を判断する
	//2006/12/19 by T.Naka
	{
		var line;
		var sql = "select telno,totelno,sum " + this.getSQLTime() + " as sec";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and byte is null";
		sql += " and time is not null";
		sql += " and length(time)>0";
		sql += " and carid=" + carid;
		sql += this.getSQLWhereTelno(pactid, carid, table_no);
		sql += " group by telno,totelno";
		sql += " order by telno,sec desc";
		sql += ";";
		var result = this.m_db.query(sql);
		var max_lines = 0;
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