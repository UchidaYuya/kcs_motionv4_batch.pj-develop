//===========================================================================
//機能：tel_details_X_tbからtel_bill_X_tbを作る
//
//作成：森原
//===========================================================================
//kamoku_rel_utiwake_tb.kamokuidに関わらず消費税と見なすtel_details_X_tb.code
//カンマで区切って複数指定可能
//第二ASP料金コード(カンマで区切って複数指定可能)
//第二ASP消費税コード(カンマで区切って複数指定可能)
//---------------------------------------------------------------------------
//機能：集計キャリアから対象キャリアへの連係情報を取得するDBアダプタ型

require("script_db.php");

require("script_common.php");

require("script_change_post.php");

const EXCISE_UTIWAKE_CODE = "ASX,ASX2,SECCALX,SECTELX";
const CODE_ASP_2ND = "ASP2";
const CODE_ASX_2ND = "ASX2";

//全ての集計キャリアID => array(キャリアID)
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
class DBAdaptorCarid extends ScriptDBAdaptor {
	DBAdaptorCarid(listener, db, table_no) //処理するキャリアを作る
	{
		this.ScriptDBAdaptor(listener, db, table_no);
		var sql = "select carid from carrier_tb" + " where carid!=" + G_CARRIER_ALL + " order by carid" + ";";
		this.m_H_carid_all = {
			[G_CARRIER_ALL]: Array()
		};
		var result = this.m_db.getAll(sql);

		for (var A_line of Object.values(result)) {
			var carid = A_line[0];
			if (!(-1 !== this.m_H_carid_all[G_CARRIER_ALL].indexOf(carid))) this.m_H_carid_all[G_CARRIER_ALL].push(carid);
		}
	}

};

//utiwake_tbから読み出すカラム名
//kamoku_rel_utiwake_tbから読み出すカラム名
//顧客ID
//年
//月
//処理が必要な電話番号(空文字列なら全て)
//この顧客専用の科目があればtrue
//変換表[キャリアID,元コード] = 切り替え情報
//切り替え情報は以下のハッシュ
//code		新コード
//kamoku		utiwake_tbのkamoku
//point		utiwake_tbのpoint
//taxtype		utiwake_tbのtaxtype
//kamokuid	kamoku_rel_utiwake_tbのkamokuid(顧客毎に異なる)
//削除が必要なキャリアID(空配列なら全て)
//請求情報があるキャリアID(処理するキャリアIDがあれば絞り込んでいる)
//キャリアID => 按分情報
//array("T" . 処理対象の電話番号)
//m_A_telnoの添え字
//明細読みだしインスタンス
//電話情報読み出しインスタンス
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：顧客の処理を開始する
//引数：顧客ID
//年
//月
//処理するキャリアID(空文字列なら全て)
//処理する電話番号(空文字列なら全て)
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客の処理を終了する
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理する顧客IDを返す
//機能：処理する年を返す
//機能：処理する月を返す
//機能：処理する電話番号を返す
//機能：この顧客専用の科目があればtrueを返す
//機能：請求情報があるキャリアIDを配列で返す
//機能：削除が必要なキャリアIDを配列で返す
//機能：按分インスタンスがあればtrueを返す
//引数：キャリアID
//機能：按分インスタンスを返す
//引数：キャリアID
//機能：最後まで電話情報を読み出せばtrueを返す
//機能：請求情報を読み出して返す
//引数：電話番号を返す
//請求情報を返す
//array(キャリアID => 電話情報)を返す
//返値：深刻なエラーが発生したらfalseを返す
//備考：請求情報は以下の形式
//array(
//carid => array(
//array(code, telno, charge, ...),
//...
//)
//);
//書き換えが必要な内訳コードを書き換えて返す
//電話番号一件ごとに、存在する全キャリアの請求情報を返す
class TelDetailsCache extends DBAdaptorCarid {
	constructor(listener, db, table_no) //顧客関連のメンバを初期化する
	{
		this.DBAdaptorCarid(listener, db, table_no);
		this.m_A_keys_utiwake = "kamoku,point,taxtype".split(",");
		this.m_A_keys_kamoku_rel_utiwake = "kamokuid".split(",");
		this.m_is_kamoku_ready = false;
		this.m_H_replace = Array();
		this.m_A_carid_delete = Array();
		this.m_A_carid_details = Array();
		this.m_H_change = Array();
		this.m_A_telno = Array();
		this.m_index = 0;
		this.m_O_details = undefined;
		this.m_O_telinfo = undefined;
	}

	begin(pactid, year, month, carid, telno) //顧客毎の情報をメンバに保存する
	//この顧客用の科目が存在するか確認する
	//変換する必要のあるコードを作成する
	//削除が必要なキャリアIDを決定する
	//請求情報があるキャリアIDを読み出す
	//按分インスタンスを作成する
	//処理対象の電話番号を読み出す
	//請求がある電話のみ読み出す
	//処理対象の電話情報を読み出す
	//請求がある電話のみ読み出す
	//処理対象の請求情報を読み出す
	{
		var no = this.getTableNo(year, month);
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
		this.m_telno = telno;
		this.m_index = 0;
		var sql = "select count(*) from kamoku_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += ";";
		this.m_is_kamoku_ready = 0 < this.m_db.getOne(sql);
		var A_replace = G_CALC_MINUS_REPLACE.split("/");
		this.m_H_replace = Array();

		for (var line of Object.values(A_replace)) //utiwake_tbから、必要な情報を読み出す
		//kamoku_rel_utiwake_tbから、必要な情報を読み出す
		{
			var keys = line.split(",");
			if (keys.length < 3) continue;
			var tgt_carid = keys[0];
			var from = keys[1];
			var to = keys[2];
			if (0 == tgt_carid.length || 0 == from.length || 0 == to.length) continue;
			var H_result_replace = {
				code: to
			};
			sql = "select";
			sql += " " + this.m_A_keys_utiwake.join(",");
			sql += " from utiwake_tb";
			sql += " where carid=" + tgt_carid;
			sql += " and code='" + this.escape(to) + "'";
			sql += " limit 1";
			sql += ";";
			var result = this.m_db.getHash(sql);
			if (result.length) result = result[0];else {
				result = Array();

				for (var k of Object.values(this.m_A_keys_utiwake)) result[k] = undefined;
			}

			for (var k in result) {
				var v = result[k];
				H_result_replace[k] = v;
			}

			sql = "select";
			sql += " kamokuid";
			sql += " from kamoku_rel_utiwake_tb";
			sql += " where carid=" + tgt_carid;
			sql += " and code='" + this.escape(to) + "'";
			if (this.m_is_kamoku_ready) sql += " and pactid=" + pactid;else sql += " and pactid=" + G_PACTID_DEFAULT;
			sql += " limit 1";
			sql += ";";
			result = this.m_db.getHash(sql);
			if (result.length) result = result[0];else {
				result = Array();

				for (var k of Object.values(this.m_A_keys_kamoku_rel_utiwake)) result[k] = undefined;
			}

			for (var k in result) {
				var v = result[k];
				H_result_replace[k] = v;
			}

			this.m_H_replace[tgt_carid + "," + from] = H_result_replace;
		}

		this.m_A_carid_delete = Array();

		if (!carid.length) //何もしない
			{} else {
			{
				let _tmp_0 = this.m_H_carid_all;

				for (var carid_all in _tmp_0) //集計キャリアなら、
				{
					var A_id = _tmp_0[carid_all];

					if (!strcmp(carid, carid_all)) //対象キャリアすべてが対象となる
						{
							this.m_A_carid_delete = A_id;
							break;
						}

					if (-1 !== A_id.indexOf(carid)) //そのキャリアだけが対象となる
						{
							this.m_A_carid_delete = [carid];
							break;
						}
				}
			}
		}

		this.m_A_carid_details = Array();
		sql = "select carid from tel_details_" + no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		if (this.m_A_carid_delete.length) sql += " and carid in (" + this.m_A_carid_delete.join(",") + ")";
		if (telno.length) sql += " and telno='" + this.escape(telno) + "'";
		sql += " group by carid";
		sql += " order by carid";
		sql += ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) this.m_A_carid_details.push(line[0]);

		for (var carid of Object.values(this.m_A_carid_details)) {
			this.m_H_change[carid] = new ChangePostInfo(this.m_listener, this.m_db, this.m_table_no);
			if (!this.m_H_change[carid].init(pactid)) return false;
			if (!this.m_H_change[carid].read(carid, year, month)) return false;
		}

		this.m_A_telno = Array();
		sql = "select";
		sql += " tel_X_tb.telno as telno";
		sql += " from tel_" + no + "_tb as tel_X_tb";
		sql += " left join (";
		sql += "select pactid,carid,telno,count(*) as dcnt";
		sql += " from tel_details_" + no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		if (this.m_A_carid_details.length) sql += " and carid in (" + this.m_A_carid_details.join(",") + ")";
		if (telno.length) sql += " and telno='" + this.escape(telno) + "'";
		sql += " group by pactid,carid,telno";
		sql += ") as details_tb";
		sql += " on tel_X_tb.pactid=details_tb.pactid";
		sql += " and tel_X_tb.carid=details_tb.carid";
		sql += " and tel_X_tb.telno=details_tb.telno";
		sql += " where tel_X_tb.pactid=" + this.escape(pactid);
		sql += " and dcnt>0";
		if (this.m_A_carid_details.length) sql += " and tel_X_tb.carid in (" + this.m_A_carid_details.join(",") + ")";
		if (telno.length) sql += " and tel_X_tb.telno='" + this.escape(telno) + "'";
		sql += " group by tel_X_tb.telno";
		sql += " order by tel_X_tb.telno";
		sql += ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) this.m_A_telno.push("T" + line[0]);

		sql = "select";
		sql += " tel_X_tb.*";
		sql += " ,case when contractdate is null then ''" + " else to_char(contractdate,'yyyy-mm-dd') end" + " as contractdate_wo_time";
		sql += " from tel_" + no + "_tb as tel_X_tb";
		sql += " left join (";
		sql += "select pactid,carid,telno,count(*) as dcnt";
		sql += " from tel_details_" + no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		if (this.m_A_carid_details.length) sql += " and carid in (" + this.m_A_carid_details.join(",") + ")";
		if (telno.length) sql += " and telno='" + this.escape(telno) + "'";
		sql += " group by pactid,carid,telno";
		sql += ") as details_tb";
		sql += " on tel_X_tb.pactid=details_tb.pactid";
		sql += " and tel_X_tb.carid=details_tb.carid";
		sql += " and tel_X_tb.telno=details_tb.telno";
		sql += " where tel_X_tb.pactid=" + this.escape(pactid);
		sql += " and dcnt>0";
		if (this.m_A_carid_details.length) sql += " and tel_X_tb.carid in (" + this.m_A_carid_details.join(",") + ")";
		if (telno.length) sql += " and tel_X_tb.telno='" + this.escape(telno) + "'";
		sql += " order by tel_X_tb.telno";
		sql += ";";
		this.m_O_telinfo = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		this.m_O_telinfo.query(sql);
		sql = "select";
		sql += " dtb.code as code";
		sql += ",dtb.charge as charge";
		sql += ",dtb.carid as carid";
		sql += ",dtb.telno as telno";

		for (var key of Object.values(this.m_A_keys_utiwake)) sql += ",utiwake_tb." + key + " as " + key;

		for (var key of Object.values(this.m_A_keys_kamoku_rel_utiwake)) sql += ",kamoku_rel_utiwake_tb." + key + " as " + key;

		sql += " from tel_details_" + no + "_tb as dtb";
		sql += " left join utiwake_tb";
		sql += " on dtb.code=utiwake_tb.code";
		sql += " and dtb.carid=utiwake_tb.carid";
		sql += " left join kamoku_rel_utiwake_tb";
		sql += " on dtb.code=kamoku_rel_utiwake_tb.code";
		sql += " and dtb.carid=kamoku_rel_utiwake_tb.carid";
		if (this.m_is_kamoku_ready) sql += " and dtb.pactid=kamoku_rel_utiwake_tb.pactid";else sql += " and dtb.pactid=(kamoku_rel_utiwake_tb.pactid" + " + dtb.pactid - " + G_PACTID_DEFAULT + ")";
		sql += " where dtb.pactid=" + this.escape(this.m_pactid);
		sql += " and utiwake_tb.codetype='0'";
		if (this.m_A_carid_details.length) sql += " and dtb.carid in (" + this.m_A_carid_details.join(",") + ")";
		if (telno.length) sql += " and dtb.telno='" + this.escape(telno) + "'";
		sql += " order by dtb.telno,dtb.carid";
		sql += ";";
		this.m_O_details = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		this.m_O_details.query(sql);
		return true;
	}

	end() {
		if (undefined !== this.m_O_details) this.m_O_details.free();
		delete this.m_O_details;
		if (undefined !== this.m_O_telinfo) this.m_O_telinfo.free();
		delete this.m_O_telinfo;
		return true;
	}

	getPactid() {
		return this.m_pactid;
	}

	getYear() {
		return this.m_year;
	}

	getMonth() {
		return this.m_month;
	}

	getTelno() {
		return this.m_telno;
	}

	isKamokuReady() {
		return this.m_is_kamoku_ready;
	}

	getCaridDetails() {
		return this.m_A_carid_details;
	}

	getCaridDelete() {
		return this.m_A_carid_delete;
	}

	isChange(carid) {
		return undefined !== this.m_H_change[carid];
	}

	getChange(carid) {
		return this.m_H_change[carid];
	}

	eof() {
		return this.m_A_telno.length <= this.m_index;
	}

	getDetails(telno, H_carid_details, H_carid_telinfo) //先頭のTを取る
	//内訳コードは変換せず、tel_details_X_tbを読み出す
	//boolean型のカラム名
	//内訳コードを変換しつつ、キャリアID単位に分割する
	//電話情報を読み出す
	{
		var H_line;
		var no = this.getTableNo(this.m_year, this.m_month);
		telno = "";
		H_carid_details = Array();
		H_carid_telinfo = Array();
		if (this.eof()) return true;
		telno = this.m_A_telno[this.m_index].substr(1);
		++this.m_index;
		var A_keys_boolean = ["point"];

		while (H_line = this.m_O_details.fetch(telno)) //保存する
		{
			var carid = H_line.carid;
			if (!(undefined !== H_carid_details[carid])) H_carid_details[carid] = Array();

			if (H_line.charge < 0) {
				var replace_key = carid + "," + H_line.code;

				if (undefined !== this.m_H_replace[replace_key]) //付け替える
					{
						{
							let _tmp_1 = this.m_H_replace[replace_key];

							for (var k in _tmp_1) {
								var value = _tmp_1[k];
								H_line[k] = value;
							}
						}
					}
			}

			if (!H_line.kamokuid.length) H_line.kamokuid = G_KAMOKU_DEFAULT;

			for (var k of Object.values(A_keys_boolean)) {
				if (undefined !== H_line[k] && !strcasecmp("t", H_line[k])) H_line[k] = true;else H_line[k] = false;
			}

			H_carid_details[carid].push(H_line);
		}

		H_carid_telinfo = Array();

		while (H_line = this.m_O_telinfo.fetch(telno)) {
			H_carid_telinfo[H_line.carid] = H_line;
		}

		return true;
	}

};

//データ挿入インスタンス
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データ挿入インスタンス
//機能：書き込むテーブル名を返す
//引数：テーブル番号
//機能：既存のtel_bill_X_tbからレコードを削除する
//引数：請求明細読み出しインスタンス
//保存先ファイル名(空文字列ならファイル保存せず)
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理を開始する
//引数：請求明細読み出しインスタンス
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理を終了する
//返値：深刻なエラーが発生したらfalseを返す
class UpdateTelBillBase extends ScriptDBAdaptor {
	UpdateTelBillBase(listener, db, table_no, inserter) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_O_inserter = inserter;
		this.m_O_inserter.setUnlock();
	}

	getTableNameTgt(table_no) {
		return "";
	}

	delete(O_cache, fname) {
		var table_no = this.getTableNo(O_cache.getYear(), O_cache.getMonth());
		var sqlfrom = " from " + this.getTableNameTgt(table_no);
		sqlfrom += " where pactid=" + this.escape(O_cache.getPactid());
		if (O_cache.getCaridDelete().length) sqlfrom += " and carid in (" + O_cache.getCaridDelete().join(",") + ")";
		if (O_cache.getTelno().length) sqlfrom += " and telno='" + this.escape(O_cache.getTelno()) + "'";

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	begin(O_cache) //挿入を準備する
	{
		var table_no = this.getTableNo(O_cache.getYear(), O_cache.getMonth());
		var table_name = this.getTableNameTgt(table_no);
		if (!this.m_O_inserter.begin(table_name)) return false;
		return true;
	}

	end() //挿入を実行する
	{
		if (!this.m_O_inserter.end()) return false;
		return true;
	}

};

//ポイントIDからドコモポイントへの変換表
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データ挿入インスタンス
//機能：書き込むテーブル名を返す
//引数：テーブル番号
//機能：一件の電話のすべてのキャリアを処理する
//引数：請求明細読み出しインスタンス
//処理する電話番号
//array(キャリアID => 処理する請求明細)
//array(キャリアID => 電話情報)
//array(キャリアID => array(集計結果))を返す
//返値：深刻なエラーが発生したらfalseを返す
//以下protected----------------------------------------------------------
//機能：一件の電話を処理する
//引数：array(キャリアID => array(集計結果))を返す
//按分インスタンス
//請求明細読み出しインスタンス
//処理する電話番号
//処理するキャリアID
//処理する請求明細
//電話情報
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客の請求明細を読み出し、サマリを作る
//引数：請求明細
//請求明細読み出しインスタンス
//請求情報があればtrueを返す
//{科目ID,金額}*を返す
//{ASP,ASX}を返す
//{料金総額,消費税総額}を返す
//総額を返す
//返値：深刻なエラーが発生したらfalseを返す
class UpdateTelBill extends UpdateTelBillBase {
	UpdateTelBill(listener, db, table_no, inserter) //ドコモポイントをマスターから読み出す
	{
		this.UpdateTelBillBase(listener, db, table_no, inserter);
		this.m_A_point = Array();
		var result = this.m_db.getHash("select pointid,addpoint from point_tb;");

		for (var line of Object.values(result)) this.m_A_point[line.pointid] = line.addpoint;
	}

	getTableNameTgt(table_no) {
		return "tel_bill_" + table_no + "_tb";
	}

	executeTelno(O_cache, telno, H_carid_details, H_carid_telinfo, H_tel_bill) //電話情報のキャリアIDに対してループ
	{
		H_tel_bill = Array();

		for (var carid in H_carid_telinfo) {
			var H_telinfo = H_carid_telinfo[carid];
			if (!(undefined !== H_carid_details[carid])) continue;

			if (!O_cache.isChange(carid)) {
				this.putError(G_SCRIPT_INFO, "\u6309\u5206\u60C5\u5831\u7121\u3057" + O_cache.getPactid() + "/" + carid + "/" + telno);
				continue;
			}

			if (!this.executeTelnoCarid(H_tel_bill, O_cache.getChange(carid), O_cache, telno, carid, H_carid_details[carid], H_telinfo)) return false;
		}

		return true;
	}

	executeTelnoCarid(H_tel_bill, O_change, O_cache, telno, carid, A_src, H_telinfo) //一ヶ月間の総額
	//キャリアがドコモで、MOVA・FOMA・Xiなら、ポイントステージを設定する
	//部署毎の比率に対してループする
	//残額
	{
		H_tel_bill[carid] = Array();
		var is_ready = false;
		var A_details = Array();
		var A_asp = [0, 0];
		var A_charge = [0, 0];
		var sum_point = 0;
		if (!this.getDetails(A_src, O_cache, is_ready, A_details, A_asp, A_charge, sum_point)) return false;
		var H_ratio = Array();
		var contract = undefined !== H_telinfo.contractdate_wo_time ? H_telinfo.contractdate_wo_time : "";
		var dummy = 0;
		if (!O_change.get(telno, H_telinfo.postid, contract, H_ratio, dummy)) return false;
		var H_total = Array();

		for (var cnt = 0; cnt < G_KAMOKU_LIMIT; ++cnt) {
			var charge = 0;
			if (undefined !== A_details[cnt]) charge = A_details[cnt];
			H_total["kamoku" + (1 + cnt)] = charge;
		}

		H_total.aspcharge = A_asp[0];
		H_total.aspexcise = A_asp[1];
		H_total.charge = A_charge[0] - H_total.aspcharge;
		H_total.excise = A_charge[1] - H_total.aspexcise;
		H_total.point = 0;

		if (G_CARRIER_DOCOMO == H_telinfo.carid && -1 !== [G_CIRCUIT_FOMA, G_CIRCUIT_MOVA, G_CIRCUIT_DOCOMO_XI].indexOf(H_telinfo.cirid)) //ポイントステージが未定義なら、1ポイントとして計算する
			{
				var stage = H_telinfo.pointstage;
				var ratio = 1;
				if (undefined !== this.m_A_point[stage]) ratio = this.m_A_point[stage];
				H_total.point = +(sum_point * G_POINT_RATIO);
				H_total.point = H_total.point * ratio;
			}

		var lastpostid = "";

		for (var postid in H_ratio) {
			var ratio = H_ratio[postid];
			lastpostid = postid;
		}

		var H_remain = H_total;

		for (var postid in H_ratio) //比率をかけてこの部署の金額を求める
		//この部署の金額を挿入する
		//結果を上位に返す
		{
			var ratio = H_ratio[postid];
			var H_cur = Array();
			if (0 == strcmp(lastpostid, postid)) H_cur = H_remain;else {
				for (var key in H_total) {
					var value = H_total[key];
					var value = value * 1 * ratio;
					value = Math.round(value);
					H_remain[key] -= value;
					H_cur[key] = value;
				}
			}
			H_cur.pactid = O_cache.getPactid();
			H_cur.postid = postid;
			H_cur.telno = telno;
			H_cur.carid = carid;
			H_cur.recdate = "now()";
			this.m_O_inserter.insert(H_cur);
			H_tel_bill[carid].push(H_cur);
		}

		return true;
	}

	getDetails(A_src, O_cache, is_ready, A_details, A_asp, A_charge, sum_point) //ASP利用料・ASP税額の取得を行う
	//料金総額・消費税額の取得を行う
	//ポイント対象総額の集計を行う
	{
		is_ready = false;
		if (!A_src.length) return true;

		if (O_cache.isKamokuReady()) //顧客専用の科目が設定されている
			{
				for (var line of Object.values(A_src)) {
					var kamokuid = line.kamokuid;
					if (!(undefined !== A_details[kamokuid])) A_details[kamokuid] = 0;
					A_details[kamokuid] = A_details[kamokuid] + line.charge;
				}
			} else //デフォルトの科目振り分けを行う
			{
				for (var line of Object.values(A_src)) {
					kamokuid = line.kamokuid;

					if (line.charge < 0 && G_KAMOKU_EXCISE != kamokuid) //消費税以外の請求額がマイナスなら割引額とする
						{
							kamokuid = G_KAMOKU_DISCOUNT;
						}

					if (!(undefined !== A_details[kamokuid])) A_details[kamokuid] = 0;
					A_details[kamokuid] = A_details[kamokuid] + line.charge;
				}
			}

		var A_code_asp = CODE_ASP_2ND.split(",");
		A_code_asp.push(G_CODE_ASP);

		for (var cnt = 0; cnt < A_code_asp.length; ++cnt) A_code_asp[cnt] = "'" + A_code_asp[cnt] + "'";

		var A_code_asx = CODE_ASX_2ND.split(",");
		A_code_asx.push(G_CODE_ASX);

		for (cnt = 0;; cnt < A_code_asx.length; ++cnt) A_code_asx[cnt] = "'" + A_code_asx[cnt] + "'";

		A_asp = [0, 0];

		for (var line of Object.values(A_src)) {
			if (-1 !== A_code_asp.indexOf("'" + line.code + "'")) A_asp[0] = A_asp[0] + line.charge;else if (-1 !== A_code_asx.indexOf("'" + line.code + "'")) A_asp[1] = A_asp[1] + line.charge;
		}

		var A_excise_utiwake_code = EXCISE_UTIWAKE_CODE.split(",");

		for (cnt = 0;; cnt < A_excise_utiwake_code.length; ++cnt) A_excise_utiwake_code[cnt] = "'" + A_excise_utiwake_code[cnt] + "'";

		A_charge = [0, 0];

		for (var line of Object.values(A_src)) {
			if (G_KAMOKU_EXCISE == line.kamokuid || -1 !== A_excise_utiwake_code.indexOf("'" + line.code + "'")) {
				A_charge[1] = A_charge[1] + line.charge;
			} else {
				A_charge[0] = A_charge[0] + line.charge;
			}
		}

		for (var line of Object.values(A_src)) {
			if (line.point) {
				if (!(undefined !== sum_point)) sum_point = 0;
				sum_point += line.charge;
			}
		}

		return true;
	}

};