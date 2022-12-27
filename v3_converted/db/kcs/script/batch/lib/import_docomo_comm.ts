//===========================================================================
//機能：請求明細をファイルからDBに取り込む(ドコモ専用)
//
//作成：森原
//===========================================================================
//---------------------------------------------------------------------------
//機能：通話明細をファイルからDBに取り込む(ドコモ専用)
//備考：クランプファイルの種別は、setTypeメソッドの引数で使用する値と、
//クラス内部で識別に用いる値とで異なる。
//setTypeメソッドに渡す値は、download_docomoのgetTypeTelメソッドが
//返す値を使用する。
//クラス内部では、commhistory_X_tb.typeの値を識別に用いる。

require("import_docomo_base.php");

//挿入型
//用途別・マルチナンバーのデータ挿入型
//相手先公私マスターのデータ挿入型
//処理中のファイル種別
//N	携帯
//P	携帯パケット
//I	携帯国際
//W	WORLD_WALKER(携帯海外から)
//+	WORLD_WALKERプラス
//f	FOMA
//p	FOMAパケット
//i	FOMA国際
//w	WORLD_WING(FOMA海外から)
//n	PHS
//R	WORLD_WALKERパケット
//G	WORLD_WINGパケット
//電話番号を新規追加する場合の回線種別
//一行の長さ
//行種別の{開始位置,文字数
//あり得る種別配列,管理行,詳細行,合計行,}
//親番号検査パラメータ{行種別,開始位置,文字数}
//管理行パラメータ
//yyyymm	年月の開始位置と文字数
//clampid	クランプIDの開始位置と文字数
//詳細行パラメータ配列
//詳細行パラメータの内容は以下の通り
//0	DB中のカラム名
//1	int|text|timestamp|callseg
//2	{開始位置,文字数}の配列
//3	追加パラメータ
//typeがintの時、乗数
//typeがtextの時、空文字列をnullとするなら1
//typeがcallsegの時、もう一つのカラム名
//4	{A_valueの添え字,A_valueの添え字}
//総額行パラメータ配列
//0	総額を求めるDBカラム
//1	開始位置
//2	文字数
//3	乗数
//総額を求めるDBカラムがtelnoの場合は電話件数
//4	{A_valueの添え字}
//DBに挿入する配列のテンプレート
//byteの添え字
//telnoの添え字
//chargeの添え字
//typeの添え字
//timeの添え字
//MOVAのパケット単価
//FOMAのパケット単価
//電話番号からパケット単価への変換表(FOMAのみ)
//パケット通信料を生成するならtrue
//byte_mail,byte_site,byte_otherからbyteを求めるならtrue
//電話番号毎の総額
//公私を作成するならtrue
//kousiflgのインデックス
//相手先のインデックス
//用途別のインデックス
//マルチナンバーのインデックス
//ベースの公私
//公私処理しない顧客ならtrue
//ベースの公私使用有無
//処理中の電話番号
//処理中の電話番号が公私を使用しないならtrue
//処理中の電話番号のベース公私
//相手先の公私マスター
//用途別の公私マスター
//マルチナンバーの公私マスター
//公私が存在する種別
//処理する年
//処理する月
//"C" . 私用とみなすマルチナンバー
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//電話番号の挿入型
//すべての親番号を検査するならtrue
//親番号・管理会社・年月が不正でも処理を実行するならtrue
//DB挿入型
//用途別・マルチナンバーのデータ挿入型
//相手先公私マスターのデータ挿入型
//警告出力済の親番号
//機能：commhistory_X_tbから既存のレコードを除去する
//引数：顧客ID
//年
//月
//保存先ファイル名(省略可能)
//用途別・マルチナンバー公私マスターの保存先ファイル名
//相手先公私マスターの保存先ファイル名
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客ID、年月で初期化する
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：読み込むファイルの種類を指定する
//引数：ファイルのタイプ(download_docomoで指定する三文字のアルファベット)
//処理する年
//処理する月
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客IDの処理を終了する
//備考：tel_tb,tel_X_tbへの挿入は事前に行っておく事
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：改行文字を含まない文字数を返す
//機能：現在処理中のファイル種別の解説文字列を返す
//機能：電話番号を元に、回線種別を返す
//引数：回線種別を返す
//電話番号
//返値：深刻なエラーが発生したらfalseを返す
//機能：ファイルから読み出した行を処理する
//引数：ファイル名
//行番号
//SJIS形式のままの行(末尾に\r\n)
//返値：深刻なエラーが発生したらfalseを返す
//機能：ファイルから読み出した管理行を処理する
//引数：ファイル名
//行番号
//SJIS形式のままの行(末尾に\r\n)
//返値：深刻なエラーが発生したらfalseを返す
//機能：ファイルから読み出した詳細行を処理する
//引数：ファイル名
//行番号
//SJIS形式のままの行(末尾に\r\n)
//返値：深刻なエラーが発生したらfalseを返す
//機能：タイムスタンプを変換する
//引数：年月を返す
//元の文字列の配列
//返値：深刻なエラーが発生したらfalseを返す
//機能：通話秒数を変換する
//引数：hhmmsssを返す
//元の文字列の配列[2]
//返値：深刻なエラーが発生したらfalseを返す
//機能：通話種別を変換する
//引数：年月を返す
//元の文字列の配列
//返値：深刻なエラーが発生したらfalseを返す
//機能：相手先・用途別・マルチナンバーから公私を設定する
//引数：追加中の行
//返値：深刻なエラーが発生したらfalseを返す
//機能：ファイルから読み出した合計行を処理する
//引数：ファイル名
//行番号
//SJIS形式のままの行(末尾に\r\n)
//返値：深刻なエラーが発生したらfalseを返す
class ImportDocomoComm extends ImportDocomoBase {
	ImportDocomoComm(listener, db, table_no, tel_tb, check_parent_all, force, inserter, inserter_from, inserter_to, A_parent_error) {
		this.ImportDocomoBase(listener, db, table_no, tel_tb, check_parent_all, force, A_parent_error);
		this.m_inserter = inserter;
		this.m_inserter_from = inserter_from;
		this.m_inserter_to = inserter_to;
		this.m_A_kousi_type = Array();
		var sql = "select type from kousi_commtype_tb";
		sql += " where carid=" + G_CARRIER_DOCOMO;
		sql += ";";
		var result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) this.m_A_kousi_type.push(line[0]);

		this.m_A_multinumber_private = Array();
		sql = " select multinumber" + " from multinumber_private_tb" + ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) this.m_A_multinumber_private.push("C" + line[0]);
	}

	delete(pactid, year, month, fname, fname_from, fname_to) //公私電話マスター(相手先)の削除
	//公私電話マスター(用途別・マルチナンバー)の削除
	{
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from commhistory_" + table_no + "_tb";
		sqlfrom += " where pactid=" + this.escape(pactid);
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sqlfrom = " from kousi_totel_master_tb" + " where pactid=" + this.escape(pactid);
		sqlfrom += " and kousiflg not in ('0', '1')";
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname_to.length) {
			if (!this.m_db.backup(fname_to, "select *" + sqlfrom + ";")) return false;
		}

		sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sqlfrom = " from kousi_fromtel_master_tb" + " where pactid=" + this.escape(pactid);
		sqlfrom += " and kousiflg not in ('0', '1')";
		sqlfrom += " and carid=" + this.escape(G_CARRIER_DOCOMO);

		if (fname_from.length) {
			if (!this.m_db.backup(fname_from, "select *" + sqlfrom + ";")) return false;
		}

		sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	begin(pactid, year, month) //パケットパック無しの単価を取り出す
	//FOMAデータプランのパケット単価を取り出す
	//公私権限があるかチェック
	//顧客単位のベース公私を取り出す
	{
		this.m_H_kousi_to = Array();
		this.m_H_kousi_occup = Array();
		this.m_H_kousi_multinumber = Array();
		var table_no = this.getTableNo(year, month);

		if (!this.setPactid(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, `setPactid/${pactid},${year},${month}`);
			return false;
		}

		var const = {
			pactid: pactid,
			carid: G_CARRIER_DOCOMO
		};

		if (!this.m_inserter.setConst(const)) {
			this.putError(G_SCRIPT_WARNING, `inserter->setConst/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter.begin("commhistory_" + table_no + "_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter->begin/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter_from.begin("kousi_fromtel_master_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter_from->begin/${pactid},${year},${month}`);
			return false;
		}

		if (!this.m_inserter_to.begin("kousi_totel_master_tb")) {
			this.putError(G_SCRIPT_WARNING, `inserter_to->begin/${pactid},${year},${month}`);
			return false;
		}

		this.m_A_sum = Array();
		var sql = "select charge from packet_tb";
		sql += " where carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and (packetname='" + this.escape("\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306A\u3057") + "'";
		sql += " or packetname='" + this.escape("\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u7121\u3057") + "')";
		sql += ";";
		var result = this.m_db.getAll(sql);
		this.m_mova_default = G_PACKET_CHARGE;
		this.m_foma_default = G_PACKET_CHARGE_FOMA;
		if (result.length) this.m_foma_default = result[0][0];
		sql = "select telno";
		sql += ",coalesce(charge_mode,0) as mode";
		sql += ",coalesce(charge_browse,0) as browse";
		sql += ",coalesce(charge_other,0) as other";
		sql += " from tel_" + table_no + "_tb as tel_tb";
		sql += " left join packet_tb";
		sql += " on tel_tb.packetid=packet_tb.packetid";
		sql += " and tel_tb.carid=packet_tb.carid";
		sql += " and tel_tb.cirid=packet_tb.cirid";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and tel_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and tel_tb.cirid in(" + this.escape(G_CIRCUIT_FOMA) + "," + this.escape(G_CIRCUIT_DOCOMO_XI) + ")";
		sql += " and packet_tb.packetid is not null";
		sql += " order by telno";
		sql += ";";
		result = this.m_db.getHash(sql);
		this.m_A_packet = Array();

		for (var line of Object.values(result)) {
			var telno = line.telno;
			this.m_A_packet[telno] = line;
		}

		sql = "select telno";
		sql += ",coalesce(charge_mode,0) as mode";
		sql += ",coalesce(charge_browse,0) as browse";
		sql += ",coalesce(charge_other,0) as other";
		sql += " from tel_" + table_no + "_tb as tel_tb";
		sql += " left join plan_tb";
		sql += " on tel_tb.planid=plan_tb.planid";
		sql += " and tel_tb.carid=plan_tb.carid";
		sql += " and tel_tb.cirid=plan_tb.cirid";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and tel_tb.carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += " and tel_tb.cirid in(" + this.escape(G_CIRCUIT_FOMA) + "," + this.escape(G_CIRCUIT_DOCOMO_XI) + ")";
		sql += " and (plan_tb.simway='" + this.escape(G_SIMWAY_DATA_NEW) + "'" + " or plan_tb.is_data=true)";
		sql += " and plan_tb.planid is not null";
		sql += " order by telno";
		sql += ";";
		result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			telno = line.telno;
			this.m_A_packet[telno] = line;
		}

		this.m_base_kousi_stop = true;
		sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_AUTH_KOUSI);
		sql += ";";
		this.m_base_kousi_stop = 0 == this.m_db.getOne(sql);
		this.m_base_kousi_default = true;
		this.m_base_kousi = 2;
		sql = "select kousiflg,patternid from kousi_default_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
		sql += ";";
		result = this.m_db.getHash(sql);

		if (result.length && 0 == strcmp(result[0].kousiflg, "0")) {
			var patid = result[0].patternid;
			sql = "select comhistbaseflg from kousi_pattern_tb";
			sql += " where patternid=" + this.escape(patid);
			sql += ";";
			result = this.m_db.getAll(sql);

			if (result.length && result[0][0].length) {
				this.m_base_kousi_default = false;
				this.m_base_kousi = result[0][0];
			}
		}

		return true;
	}

	setType(type, year, month) //公私関連
	{
		this.m_year = year;
		this.m_month = month;
		this.m_A_sum = Array();
		this.m_linetype = [11, 2, ["91"], "01", "11", "51"];
		this.m_A_param_admin = {
			yyyymm: [14, 4, 18, 2],
			clampid: [0, 9]
		};
		this.m_param_parent = ["51", 19, 11];
		this.m_insert_charge = false;
		this.m_insert_byte = false;
		this.m_insert_kousi = false;

		switch (type) {
			case "RMT":
				this.m_type = "N";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 86;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 13], 0], ["toplace", "text", [46, 6], 1], ["time", "text", [52, 7], 1], ["charge", "int", [66, 10], 1], ["callseg", "callseg", [76, 1], "callsegname"], ["chargeseg", "text", [77, 4], 1], ["discountseg", "text", [81, 1], 1], ["occupseg", "text", [82, 1], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];

				if (2005 <= year || 2004 == year && 12 == month) {
					for (var cnt = 0; cnt < this.m_A_param_details.length; ++cnt) {
						if (strcmp(this.m_A_param_details[cnt][0], "charge")) continue;
						this.m_A_param_details[cnt][3] = 0.1;
					}

					for (cnt = 0;; cnt < this.m_A_param_total.length; ++cnt) {
						if (strcmp(this.m_A_param_total[cnt][0], "charge")) continue;
						this.m_A_param_total[cnt][3] = 0.1;
					}
				}

				break;

			case "RMP":
				this.m_type = "P";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_insert_charge = true;

				if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 4]], ["time", "diffsec", [27, 4, 31, 4]], ["totelno", "text", [35, 40], 0], ["byte_mail", "int", [75, 12], 1], ["byte_site", "int", [87, 12], 1], ["byte_other", "int", [99, 12], 1], ["occupseg", "text", [129, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 12, 1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 86;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 4]], ["time", "diffsec", [27, 4, 31, 4]], ["totelno", "text", [35, 13], 0], ["byte", "int", [48, 12], 1], ["occupseg", "text", [60, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 38, 12, 1]];
				}

				break;

			case "RMK":
				this.m_type = "I";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 100;

				if (2007 <= year || 2006 == year && 3 <= month) //2006年3月より、昼夜別と用途別が一桁ずれる
					{
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 21], 0], ["toplace", "text", [54, 20], 1], ["time", "text", [74, 7], 1], ["charge", "int", [81, 10], 1], ["callseg", "callseg", [91, 1], "callsegname"], ["chargeseg", "text", [93, 4], 1], ["occupseg", "text", [97, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];
					} else {
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 21], 0], ["toplace", "text", [54, 20], 1], ["time", "text", [74, 7], 1], ["charge", "int", [81, 10], 1], ["callseg", "callseg", [91, 1], "callsegname"], ["chargeseg", "text", [92, 4], 1], ["occupseg", "text", [96, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];
				}

				break;

			case "RML":
				this.m_type = "W";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 86;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 21], 0], ["time", "text", [54, 6], 1], ["fromplace", "text", [60, 8], 1], ["charge", "int", [68, 12], 1], ["callsegname", "text", [80, 4], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 68, 12, 1]];
				break;

			case "RMN":
				this.m_type = "+";
				this.m_cirid = G_CIRCUIT_MOVA;
				this.m_linesize = 120;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 7], 1], ["fromplace", "text", [40, 20], 1], ["totelno", "text", [60, 26], 0], ["charge", "int", [86, 10], 1], ["callsegname", "text", [96, 4], 1], ["sendrec", "text", [96, 4], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 10, 1]];
				break;

			case "RMF":
				this.m_type = "f";
				this.m_cirid = G_CIRCUIT_FOMA;

				if (2017 <= year || 2016 == year && 2 <= month) //2016年5月より光電話にあわせてフォーマット変更
					{
						this.m_linesize = 132;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 26], 0], ["toplace", "text", [59, 6], 1], ["time", "text", [65, 7], 1], ["charge", "int", [72, 11], 0.01], ["chargeseg", "text", [83, 6], 1], ["discountseg", "text", [89, 2], 1], ["kubun1", "text", [91, 10], 1], ["kubun2", "text", [101, 10], 1], ["kubun3", "text", [111, 10], 1], ["multinumber", "text", [121, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 59, 11, 0.01]];
					} else {
					this.m_linesize = 119;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 13], 0], ["toplace", "text", [46, 6], 1], ["time", "text", [52, 7], 1], ["charge", "int", [59, 11], 0.01], ["chargeseg", "text", [70, 6], 1], ["discountseg", "text", [76, 2], 1], ["kubun1", "text", [78, 10], 1], ["kubun2", "text", [88, 10], 1], ["kubun3", "text", [98, 10], 1], ["multinumber", "text", [108, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 59, 11, 0.01]];
				}

				break;

			case "RMA":
				this.m_type = "p";
				this.m_cirid = G_CIRCUIT_FOMA;
				this.m_insert_charge = true;

				if (2008 <= year || 2007 == year && 7 <= month) //2007年7月以降、合計行のデータ量桁数増量
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 6], 1], ["totelno", "text", [39, 40], 0], ["byte_mail", "int", [79, 12], 1], ["byte_site", "int", [91, 12], 1], ["byte_other", "int", [103, 12], 1], ["comservice", "text", [125, 8], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 14, 1]];
						this.m_insert_byte = true;
					} else if (2006 <= year || 2005 == year && 11 <= month) //2005年11月以降、日付の書式変更
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 6], 1], ["totelno", "text", [39, 40], 0], ["byte_mail", "int", [79, 12], 1], ["byte_site", "int", [91, 12], 1], ["byte_other", "int", [103, 12], 1], ["comservice", "text", [125, 8], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 12, 1]];
						this.m_insert_byte = true;
					} else if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 4]], ["time", "text", [31, 4], 1], ["totelno", "text", [35, 40], 0], ["byte_mail", "int", [75, 12], 1], ["byte_site", "int", [87, 12], 1], ["byte_other", "int", [99, 12], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 99, 12, 1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 111;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 7], 1], ["totelno", "text", [40, 40], 0], ["byte", "int", [80, 12], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["byte", 38, 12, 1]];
				}

				break;

			case "RMW":
				this.m_type = "i";
				this.m_cirid = G_CIRCUIT_FOMA;
				this.m_linesize = 122;

				if (2007 <= year || 2006 == year && 3 <= month) //2006年3月より、マルチナンバーが一桁ずれる
					{
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 26], 0], ["toplace", "text", [59, 20], 1], ["time", "text", [79, 7], 1], ["charge", "int", [86, 11], 0.01], ["chargeseg", "text", [97, 6], 1], ["multinumber", "text", [112, 1], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 11, 0.01]];
					} else {
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 26], 0], ["toplace", "text", [59, 20], 1], ["time", "text", [79, 7], 1], ["charge", "int", [86, 11], 0.01], ["chargeseg", "text", [97, 6], 1], ["multinumber", "text", [111, 1], 1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 11, 0.01]];
				}

				break;

			case "RMJ":
				this.m_type = "w";
				this.m_cirid = G_CIRCUIT_FOMA;
				this.m_linesize = 120;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["time", "text", [33, 7], 1], ["fromplace", "text", [40, 20], 1], ["totelno", "text", [60, 26], 0], ["charge", "int", [86, 10], 0.1], ["callsegname", "text", [96, 4], 1], ["sendrec", "text", [96, 4], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 86, 10, 0.1]];
				break;

			case "RMS":
				this.m_type = "n";
				this.m_cirid = G_CIRCUIT_PHS;
				this.m_linesize = 147;
				this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 6]], ["totelno", "text", [33, 13], 0], ["toplace", "text", [46, 20, 66, 12], 1], ["time", "text", [81, 7], 1], ["charge", "int", [92, 10], 1], ["callseg", "callseg", [102, 1], "callsegname"], ["chargeseg", "text", [103, 8], 1], ["discountseg", "text", [113, 3], 1]];
				this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 66, 10, 1]];
				break;

			case "RMR":
				this.m_type = "R";
				this.m_cirid = G_CIRCUIT_MOVA;

				if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["totelno", "text", [41, 20], 0], ["byte_mail", "int", [61, 12], 1], ["byte_site", "int", [73, 12], 1], ["byte_other", "int", [85, 12], 1], ["charge", "int", [97, 11], 0.1], ["fromplace", "text", [108, 30], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 97, 11, 0.1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 124;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["fromplace", "text", [41, 30], 1], ["totelno", "text", [71, 20], 0], ["byte", "int", [91, 12], 1], ["charge", "int", [103, 11], 0.1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 103, 11, 0.1]];
				}

				break;

			case "RMG":
				this.m_type = "G";
				this.m_cirid = G_CIRCUIT_FOMA;

				if (2006 <= year || 2005 == year && 5 <= month) //2005年05月以降、通信料の内訳付き
					{
						this.m_linesize = 150;
						this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["totelno", "text", [41, 20], 0], ["byte_mail", "int", [61, 12], 1], ["byte_site", "int", [73, 12], 1], ["byte_other", "int", [85, 12], 1], ["charge", "int", [97, 11], 0.1], ["fromplace", "text", [108, 30], 1], ["comorg", "text", [108, 30], 1]];
						this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 97, 11, 0.1]];
						this.m_insert_byte = true;
					} else {
					this.m_linesize = 124;
					this.m_A_param_details = [["telno", "text", [0, 11], 0], ["date", "timestamp", [19, 8, 27, 7]], ["time", "text", [34, 7], 1], ["fromplace", "text", [41, 30], 1], ["totelno", "text", [71, 20], 0], ["byte", "int", [91, 12], 1], ["charge", "int", [103, 11], 0.1]];
					this.m_A_param_total = [["telno", 13, 6, 1], ["charge", 103, 11, 0.1]];
				}

				break;

			default:
				this.putError(G_SCRIPT_ERROR, `setType(${type})未定義タイプ`);
				return false;
		}

		this.m_A_empty = this.m_inserter.getEmpty(false);
		this.m_A_empty[this.m_inserter.getIndex("pactid")] = this.m_pactid;
		this.m_A_empty[this.m_inserter.getIndex("carid")] = G_CARRIER_DOCOMO;
		this.m_index_byte = this.m_inserter.getIndex("byte");
		this.m_index_telno = this.m_inserter.getIndex("telno");
		this.m_index_charge = this.m_inserter.getIndex("charge");
		this.m_index_type = this.m_inserter.getIndex("type");
		this.m_index_time = this.m_inserter.getIndex("time");

		if (2006 <= year || 2005 == year && 5 <= month) {
			this.m_index_byte_mail = this.m_inserter.getIndex("byte_mail");
			this.m_index_byte_site = this.m_inserter.getIndex("byte_site");
			this.m_index_byte_other = this.m_inserter.getIndex("byte_other");
		}

		for (cnt = 0;; cnt < this.m_A_param_details.length; ++cnt) {
			var tgt = this.m_A_param_details[cnt];
			var idx = [-1, -1];
			idx[0] = this.m_inserter.getIndex(tgt[0]);
			if (0 == strcmp("callseg", tgt[1])) idx[1] = this.m_inserter.getIndex(tgt[3]);else idx[1] = 0;

			if (idx[0] < 0 || idx[1] < 0) {
				this.putError(G_SCRIPT_ERROR, "\u6DFB\u3048\u5B57\u4E0D\u6B63" + tgt[0]);
				return false;
			}

			tgt[4] = idx;
		}

		for (cnt = 0;; cnt < this.m_A_param_total.length; ++cnt) {
			tgt = this.m_A_param_total[cnt];
			tgt[4] = this.m_inserter.getIndex(tgt[0]);

			if (tgt[4] < 0) {
				this.putError(G_SCRIPT_ERROR, "\u6DFB\u3048\u5B57\u4E0D\u6B63" + tgt[0]);
				return false;
			}
		}

		if (-1 !== this.m_A_kousi_type.indexOf(this.m_type)) {
			this.m_insert_kousi = true;
			this.m_index_kousi = this.m_inserter.getIndex("kousiflg");
			this.m_index_to = this.m_inserter.getIndex("totelno");
			this.m_index_occup = this.m_inserter.getIndex("occupseg");
			this.m_index_multinumber = this.m_inserter.getIndex("multinumber");
		}

		return true;
	}

	end() {
		return this.m_inserter.end() && this.m_inserter_from.end() && this.m_inserter_to.end();
	}

	getLineSize() {
		return this.m_linesize;
	}

	getTypeName() {
		switch (this.m_type) {
			case "N":
				return "\u643A\u5E2F\u901A\u8A71";

			case "P":
				return "\u643A\u5E2F\u30D1\u30B1\u30C3\u30C8";

			case "I":
				return "\u643A\u5E2F\u56FD\u969B";

			case "W":
				return "WorldWalker";

			case "+":
				return "WorldWalkerPlus";

			case "f":
				return "FOMA\u901A\u8A71";

			case "p":
				return "FOMA\u30D1\u30B1\u30C3\u30C8";

			case "i":
				return "FOMA\u56FD\u969B";

			case "w":
				return "WorldWing";

			case "n":
				return "PHS";

			case "R":
				return "WORLD_WALKER\u30D1\u30B1\u30C3\u30C8";

			case "G":
				return "WORLD_WING\u30D1\u30B1\u30C3\u30C8";
		}

		return "\u672A\u5B9A\u7FA9\u30D5\u30A1\u30A4\u30EB\u7A2E\u5225";
	}

	toCirid(cirid, telno) //PHSの処理は除去した
	{
		cirid = this.m_cirid;
		return true;
	}

	readLine(fname, lineno, line) //親番号の検査
	{
		var linetype = line.substr(this.m_linetype[0], this.m_linetype[1]);

		if (0 == strcmp(this.m_param_parent[0], linetype)) {
			var parent = line.substr(this.m_param_parent[1], this.m_param_parent[2]).trim();

			if (!this.checkParent(parent)) //親番号は一個でも合致したら処理継続
				{
					this.putOperator(G_SCRIPT_INFO, `親番号(${parent})見つからず` + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
				}
		}

		if (0 == strcmp(this.m_linetype[3], linetype)) {
			return this.readLineAdmin(fname, lineno, line);
		} else if (0 == strcmp(this.m_linetype[4], linetype)) {
			return this.readLineDetails(fname, lineno, line);
		} else if (0 == strcmp(this.m_linetype[5], linetype)) {
			return this.readLineTotal(fname, lineno, line);
		} else if (!(-1 !== this.m_linetype[2].indexOf(linetype))) {
			this.putOperator(G_SCRIPT_WARNING, "\u4E0D\u660E\u306A\u884C\u7A2E\u5225" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
			return false;
		}

		return true;
	}

	readLineAdmin(fname, lineno, line) {
		if (undefined !== this.m_A_param_admin.yyyymm) {
			var param = this.m_A_param_admin.yyyymm;
			var year = 0 + line.substr(param[0], param[1]);
			var month = 0 + line.substr(param[2], param[3]);

			if (year != this.m_year || month != this.m_month) {
				this.putOperator(G_SCRIPT_WARNING, `管理レコード年月不正${year}/${month}(` + this.getTypeName() + `/${fname}/${lineno})` + this.toUTF(line));
				return false;
			}
		}

		if (undefined !== this.m_A_param_admin.clampid) {
			param = this.m_A_param_admin.clampid;

			if (!this.checkClampId(line.substr(param[0], param[1]))) {
				this.putOperator(G_SCRIPT_WARNING, "\u7BA1\u7406\u30EC\u30B3\u30FC\u30C9\u9001\u4ED8\u5148\u30B3\u30FC\u30C9\u4E0D\u6B63(" + this.getTypeName() + `/${fname}/${lineno})` + this.toUTF(line));
				if (!this.m_force) return false;
			}
		}

		return true;
	}

	readLineDetails(fname, lineno, line) //DBに挿入する値
	//timeが4桁以上で6桁未満ならゼロを足す
	//公私の計算
	{
		var A_value = this.m_A_empty;

		for (var param of Object.values(this.m_A_param_details)) {
			var src = Array();

			for (var cnt = 0; cnt < param[2].length; cnt += 2) {
				if (0 == param[2][cnt + 1]) src.push("");
				src.push(line.substr(param[2][cnt], param[2][cnt + 1]));
			}

			switch (param[1]) {
				case "text":
					var text = "";

					for (var value of Object.values(src)) text += this.toUTF(value).trim();

					if (0 == param[3] || text.length) A_value[param[4][0]] = this.m_inserter.escapeStr(text);
					break;

				case "int":
					var int = 0;

					if (!this.toInt(int, src[0])) {
						this.putError(G_SCRIPT_WARNING, "\u8A73\u7D30\u30EC\u30B3\u30FC\u30C9" + "\u6570\u5024\u5909\u63DB\u5931\u6557" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					int *= param[3];
					if (strcmp("charge", param[0])) int = +Math.round(int);
					A_value[param[4][0]] = int;
					break;

				case "timestamp":
					var tm = undefined;

					if (!this.readLineDetailsTimestamp(tm, src) || !(undefined !== tm)) {
						this.putError(G_SCRIPT_WARNING, "\u8A73\u7D30\u30EC\u30B3\u30FC\u30C9" + "\u5E74\u6708\u6642\u523B\u5909\u63DB\u5931\u6557" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					A_value[param[4][0]] = tm;
					break;

				case "diffsec":
					var sec = undefined;

					if (!this.readLineDetailsDiffsec(sec, src) || !(undefined !== sec)) {
						this.putError(G_SCRIPT_WARNING, "\u8A73\u7D30\u30EC\u30B3\u30FC\u30C9" + "\u79D2\u6570\u5909\u63DB\u5931\u6557" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					A_value[param[4][0]] = sec;
					break;

				case "callseg":
					var seg = undefined;
					var segname = undefined;

					if (!this.readLineDetailsCallseg(seg, segname, src) || !(undefined !== seg) || !(undefined !== segname)) {
						this.putError(G_SCRIPT_WARNING, "\u8A73\u7D30\u30EC\u30B3\u30FC\u30C9" + "callseg\u5909\u63DB\u5931\u6557" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
						return false;
					}

					A_value[param[4][0]] = seg;
					if (param[3].length) A_value[param[4][1]] = segname;
					break;

				default:
					this.putError(G_SCRIPT_ERROR, "readLineDetails(\u672A\u5B9A\u7FA9type)" + this.getTypeName() + "/" + param[0] + "/" + param[1]);
					return false;
			}
		}

		if (undefined !== A_value[this.m_index_time] && 4 <= A_value[this.m_index_time].length) {
			while (A_value[this.m_index_time].length < 6) A_value[this.m_index_time] = A_value[this.m_index_time] + "0";
		}

		if (this.m_insert_byte) {
			var byte = 0;
			if (undefined !== A_value[this.m_index_byte_mail]) byte += A_value[this.m_index_byte_mail];
			if (undefined !== A_value[this.m_index_byte_site]) byte += A_value[this.m_index_byte_site];
			if (undefined !== A_value[this.m_index_byte_other]) byte += A_value[this.m_index_byte_other];
			A_value[this.m_index_byte] = byte;
		}

		if (this.m_insert_charge) //パケット数を取り出す
			//単価を掛けて金額を求める
			//四捨五入を行う
			//合計して保存する
			{
				var A_key = ["mail", "site", "other"];
				var H_packet = Array();
				H_packet.mail = 1 * A_value[this.m_index_byte_mail] / G_PACKET_SIZE;
				H_packet.site = 1 * A_value[this.m_index_byte_site] / G_PACKET_SIZE;
				H_packet.other = 1 * A_value[this.m_index_byte_other] / G_PACKET_SIZE;

				if (undefined !== this.m_A_packet[A_value[this.m_index_telno]]) //その他は、フルブラウザか否かで判断する
					{
						var H_master = this.m_A_packet[A_value[this.m_index_telno]];
						H_packet.mail = H_packet.mail * H_master.mode;
						H_packet.site = H_packet.site * H_master.mode;
						var totelno = "";
						if (undefined !== A_value[this.m_index_to]) totelno = A_value[this.m_index_to];

						if (false === strpos(totelno, "\uFF8C\uFF99\uFF8C\uFF9E\uFF97\uFF73\uFF7B\uFF9E") && false === strpos(totelno, "\u30D5\u30EB\u30D6\u30E9\u30A6\u30B6")) {
							H_packet.other = H_packet.other * H_master.browse;
						} else {
							H_packet.other = H_packet.other * H_master.other;
						}
					} else {
					if (0 == strcmp(this.m_type, "P")) var master = this.m_mova_default;else master = this.m_foma_default;

					for (var key of Object.values(A_key)) H_packet[key] = H_packet[key] * master;
				}

				for (var key of Object.values(A_key)) H_packet[key] = +Math.round(H_packet[key]);

				var packet = 0;

				for (var key of Object.values(A_key)) packet += H_packet[key];

				A_value[this.m_index_charge] = packet;
			}

		for (var param of Object.values(this.m_A_param_total)) {
			var key = param[0];
			var idx = param[4];
			if (!(undefined !== A_value[idx])) continue;
			if (!(undefined !== this.m_A_sum[key])) this.m_A_sum[key] = 0;
			if (0 == strcmp("telno", key)) this.m_A_sum[key] += 1;else this.m_A_sum[key] += A_value[idx];
		}

		A_value[this.m_index_type] = this.m_type;
		if (!this.readLineDetailsKousi(A_value)) return false;
		return this.m_inserter.insertRaw(A_value, false);
	}

	readLineDetailsTimestamp(tm, src) {
		if (8 != src[0].length) return false;
		var yyyy = src[0].substr(0, 4);
		var mm = src[0].substr(4, 2);
		var dd = src[0].substr(6, 2);

		if (1 < src.length) {
			if (6 != src[1].length && 7 != src[1].length && 4 != src[1].length) return false;
			var hh = src[1].substr(0, 2);
			var nn = src[1].substr(2, 2);
			var ss = src[1].substr(4, 2);
			if (0 == ss.length) ss = "00";

			if (6 < src[1].length) {
				var sub = 0 + src[1].substr(6, 1);
				tm = `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}.${sub}`;
			} else tm = `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}`;
		} else tm = `${yyyy}-${mm}-${dd}`;

		return true;
	}

	readLineDetailsDiffsec(sec, src) {
		for (var cnt = 0; cnt < 2; ++cnt) if (4 != src[cnt].length) return false;

		var hh = src[1].substr(0, 2) - src[0].substr(0, 2);
		var mm = src[1].substr(2, 2) - src[0].substr(2, 2);

		if (mm < 0) {
			mm += 60;
			--hh;
		}

		if (hh < 0) hh += 24;
		if (hh < 10) hh = "0" + hh;
		if (mm < 10) mm = "0" + mm;
		sec = hh + mm + "000";
		return true;
	}

	readLineDetailsCallseg(seg, segname, src) {
		seg = src[0];

		switch (seg) {
			case "0":
				segname = "\u305D\u306E\u4ED6";
				break;

			case "1":
				segname = "\u5206\u5272\u547C";
				break;

			case "4":
				segname = "\u885B\u661F";
				break;

			case "5":
				segname = "\u7740\u8EE2\u9001";
				break;

			case "8":
				segname = "\uFF18\uFF10\uFF10\uFF2D\uFF28\uFF5A\uFF08\u7559\u5B88\u96FB\u9060\u9694\u64CD\u4F5C\uFF09";
				break;

			case "9":
				segname = "\uFF11\uFF0E\uFF15\uFF27\uFF28\uFF5A\uFF08\u7559\u5B88\u96FB\u9060\u9694\u64CD\u4F5C\uFF09";
				break;

			case "A":
				segname = "\uFF26\uFF2F\uFF2D\uFF21\uFF08\u7559\u5B88\u96FB\u9060\u9694\u64CD\u4F5C\uFF09";
				break;

			case "B":
				segname = "\u885B\u661F\uFF08\u7559\u5B88\u96FB\u9060\u9694\u64CD\u4F5C\uFF09";
				break;

			case "C":
				segname = "\u901A\u5E38\u96FB\u8A71\uFF08\u7559\u5B88\u96FB\u9060\u9694\u64CD\u4F5C\uFF09";
				break;

			default:
				return false;
		}

		return true;
	}

	readLineDetailsKousi(A_value) {
		if (this.m_base_kousi_stop) return true;
		if (!this.m_insert_kousi) return true;
		var telno = A_value[this.m_index_telno];

		if (strcmp(telno, this.m_cur_telno)) //ベースとなる公私と、公私の有無を読み出す
			{
				this.m_cur_telno = telno;
				this.m_cur_kousi_stop = this.m_base_kousi_default;
				this.m_cur_kousi = this.m_base_kousi;
				var table_no = this.getTableNo(this.m_year, this.m_month);
				var sql = "select kousiflg,kousiptn";
				sql += " from tel_" + table_no + "_tb as tel_tb";
				sql += " where pactid=" + this.escape(this.m_pactid);
				sql += " and telno='" + this.escape(this.m_cur_telno) + "'";
				sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
				sql += ";";
				var result = this.m_db.getHash(sql);

				if (result.length && 0 == strcmp(result[0].kousiflg, "0") && 0 < result[0].kousiptn.length) {
					var patid = result[0].kousiptn;
					sql = "select comhistbaseflg";
					sql += ",coalesce(comhistflg,'0')";
					sql += " from kousi_pattern_tb";
					sql += " where patternid=" + this.escape(patid);
					sql += ";";
					result = this.m_db.getAll(sql);

					if (result.length && result[0][0].length) {
						this.m_cur_kousi_stop = false;
						this.m_cur_kousi = result[0][0];
					}

					if (result.length && result[0][1].length) this.m_cur_kousi_stop = 0 == strcmp("0", result[0][1]);
				}

				if (!(undefined !== this.m_H_kousi_to[telno]) && !(undefined !== this.m_H_kousi_occup[telno]) && !(undefined !== this.m_H_kousi_multinumber[telno])) {
					this.m_H_kousi_to[telno] = Array();
					this.m_H_kousi_occup[telno] = Array();
					this.m_H_kousi_multinumber[telno] = Array();

					if (!this.m_cur_kousi_stop) //相手先マスターを読み出す
						//用途別・マルチナンバーマスターを読み出す
						{
							sql = "select totelno,kousiflg from kousi_totel_master_tb";
							sql += " where pactid=" + this.escape(this.m_pactid);
							sql += " and telno='" + this.escape(this.m_cur_telno) + "'";
							sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
							sql += ";";
							result = this.m_db.getHash(sql);

							for (var line of Object.values(result)) {
								var key = line.totelno;
								var value = line.kousiflg;
								if (0 == value.length) continue;
								this.m_H_kousi_to[telno][key] = value;
							}

							sql = "select fromtelno,kousiflg,type" + " from kousi_fromtel_master_tb";
							sql += " where pactid=" + this.escape(this.m_pactid);
							sql += " and telno='" + this.escape(this.m_cur_telno) + "'";
							sql += " and carid=" + this.escape(G_CARRIER_DOCOMO);
							sql += ";";
							result = this.m_db.getHash(sql);

							for (var line of Object.values(result)) {
								key = line.fromtelno;
								value = line.kousiflg;
								if (0 == value.length) continue;
								var type = line.type;
								if (0 == strcmp(type, "M")) this.m_H_kousi_multinumber[telno][key] = value;else if (0 == strcmp(type, "O")) this.m_H_kousi_occup[telno][key] = value;
							}
						}
				}
			}

		if (this.m_cur_kousi_stop) return true;
		var kousi = this.m_cur_kousi;
		var kousi_ready = false;

		if (undefined !== A_value[this.m_index_multinumber] && A_value[this.m_index_multinumber].length && strcmp(A_value[this.m_index_multinumber], "\\N") && -1 !== this.m_A_multinumber_private.indexOf("C" + A_value[this.m_index_multinumber])) //マルチナンバーから予測
			{
				key = A_value[this.m_index_multinumber];

				if (!(undefined !== this.m_H_kousi_multinumber[telno][key])) {
					this.m_inserter_from.insert({
						pactid: this.m_pactid,
						telno: telno,
						carid: G_CARRIER_DOCOMO,
						fromtelno: key,
						kousiflg: "2",
						type: "M"
					});
					this.m_H_kousi_multinumber[telno][key] = this.m_cur_kousi;
				} else {
					var flag = this.m_H_kousi_multinumber[telno][key];

					if (0 == strcmp("0", flag) || 0 == strcmp("1", flag)) {
						kousi = flag;
						kousi_ready = true;
					}
				}
			}

		if (!kousi_ready && undefined !== A_value[this.m_index_occup] && A_value[this.m_index_occup].length && strcmp(A_value[this.m_index_occup], "\\N") && strcmp(A_value[this.m_index_occup], "0")) //用途別から予測
			{
				key = A_value[this.m_index_occup];

				if (!(undefined !== this.m_H_kousi_occup[telno][key])) {
					this.m_inserter_from.insert({
						pactid: this.m_pactid,
						telno: telno,
						carid: G_CARRIER_DOCOMO,
						fromtelno: key,
						kousiflg: "2",
						type: "O"
					});
					this.m_H_kousi_occup[telno][key] = this.m_cur_kousi;
				} else {
					flag = this.m_H_kousi_occup[telno][key];

					if (0 == strcmp("0", flag) || 0 == strcmp("1", flag)) {
						kousi = flag;
						kousi_ready = true;
					}
				}
			}

		if (!kousi_ready && undefined !== A_value[this.m_index_to] && A_value[this.m_index_to].length && strcmp(A_value[this.m_index_to], "\\N")) //相手先から予測
			{
				key = A_value[this.m_index_to];

				if (!(undefined !== this.m_H_kousi_to[telno][key])) {
					this.m_inserter_to.insert({
						pactid: this.m_pactid,
						telno: telno,
						carid: G_CARRIER_DOCOMO,
						totelno: key,
						kousiflg: "2",
						memo: ""
					});
					this.m_H_kousi_to[telno][key] = this.m_cur_kousi;
				} else {
					flag = this.m_H_kousi_to[telno][key];

					if (0 == strcmp("0", flag) || 0 == strcmp("1", flag)) {
						kousi = flag;
						kousi_ready = true;
					}
				}
			}

		A_value[this.m_index_kousi] = kousi;
		return true;
	}

	readLineTotal(fname, lineno, line) {
		var sum = this.m_A_sum;
		this.m_A_sum = Array();

		for (var param of Object.values(this.m_A_param_total)) {
			var src = line.substr(param[1], param[2]);
			var int = undefined;

			if (!this.toInt(int, src) || !(undefined !== int)) {
				this.putError(G_SCRIPT_WARNING, "\u5408\u8A08\u30EC\u30B3\u30FC\u30C9" + "\u6570\u5024\u5909\u63DB\u5931\u6557" + param[0] + "/" + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
				return false;
			}

			int *= param[3];
			if (strcmp("charge", param[0])) int = +Math.round(int);

			if (0.0001 < Math.abs(int - sum[param[0]])) {
				this.putError(G_SCRIPT_INFO, "\u5408\u8A08\u30EC\u30B3\u30FC\u30C9" + "\u5408\u8A08\u5408\u81F4\u305B\u305A" + param[0] + "/" + int + "," + sum[param[0]] + this.getTypeName() + `(${fname}/${lineno})` + this.toUTF(line));
			}
		}

		return true;
	}

};