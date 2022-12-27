import * as script_db from "../../batch/lib/script_db";
import { G_KAMOKU_EXCISE,G_EXCISE_RATE } from "../../batch/lib/script_common";
import * as script_change_post from "../../batch/lib/script_change_post";
import { TelDetailsCache, UpdateTelBillBase } from "../../batch/lib/update_tel_bill";
import {G_SCRIPT_WARNING,G_SCRIPT_INFO, ScriptLogBase,} from "../../batch/lib/script_log";

//パターンIDからパターン情報へのハッシュ
//パターン情報は以下のハッシュ
//is_public	ベースが公ならtrue/私ならfalse
//is_fix		定額控除ならtrue
//fixcharge	定額控除額(消費税額を除く)
//fixtax		定額消費税額
//is_comm		通話明細を使用するならtrue
//public_ratio内訳が無い場合の公用の比率
//is_private_term	端末を私用とするならtrue
//utiwake		内訳ハッシュ
//内訳ハッシュは、キャリアIDから内訳マスターへのハッシュ
//内訳マスターは、内訳コードから内訳情報へのハッシュ
//内訳情報は以下のハッシュ
//ratio		公用の比率
//is_public	ベースが公用ならtrue
//carid		キャリアID
//{MNPと見なすパターンIDの配列}の配列
//100%公用のパターン
// 2022cvt_016
//キャリアから、使用するcomm_tb::typeの配列へのハッシュ
//端末と見なす{carid,code}の配列
//計算済の「キャリアID,電話番号」=>trueのハッシュ
//キャリアID => 顧客全体で使用するパターンのパターンID
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データ挿入型
//機能：書き込むテーブル名を返す
//引数：テーブル番号
//機能：計算フラグがたっているものを保存する
//引数：請求明細読み出しインスタンス
//返値：深刻なエラーが発生したらfalseを返す
//機能：処理を開始する
//引数：請求明細読み出しインスタンス
//返値：深刻なエラーが発生したらfalseを返す
//機能：一件の電話のすべてのキャリアを処理する
//引数：請求明細読み出しインスタンス
//処理する電話番号
//array(キャリアID => 処理する請求明細)
//array(キャリアID => 電話情報)
//計算フラグを立てるなら1/落とすなら0/既存の値を参照するなら2
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：単一キャリアIDで実行された時に、MNPが無いか確認する
//引数：請求明細読み出しインスタンス
//テーブル連番
//返値：MNPならtrueを返す
//機能：すべてのキャリアIDで、一個の電話番号を処理する
//引数：請求明細読み出しインスタンス
//顧客ID
//年
//月
//テーブルNo
//電話番号
//array(キャリアID => 処理する請求明細)
//array(キャリアID => 電話情報)
//計算フラグを立てるなら1/落とすなら0/既存の値を参照するなら2
//返値：深刻なエラーが発生したらfalseを返す
//機能：公私の金額を求める
//引数：請求額など
//結果を格納するハッシュ{charge,tax,commのpublic,private,合計}を返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：通話料の比率を求める
//引数：顧客ID
//キャリアID(全キャリア以外)
//電話番号
//テーブルNo
//パターン情報
//ベースが公用ならtrue
//公の比率を返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：請求明細を読み出し、おおまかに集計する
//引数：顧客ID
//キャリアID
//年
//月
//テーブルNo
//電話番号
//パターン
//通話料とみなす請求明細の区分
//処理する請求明細
//結果を返す
//機能：MNPがあれば、定額負担額をキャリア間で按分する
//引数：全キャリアの請求情報を処理して返す
//機能：定額控除形式で計算する
//引数：パターン
//端末代金
//ベースが公用ならtrue
//結果を返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：比率方式で計算する
//引数：パターン
//パターンの内訳
//請求明細
//ベースが公用ならtrue
//通話明細を使用するならtrue
//通話明細から求めた公私比率
//結果を返す
//返値：深刻なエラーが発生したらfalseを返す
export class UpdateTelBillKousi extends UpdateTelBillBase {
	m_H_pattern: any[];
	m_A_mnp!: any[];
	m_H_public: any;
	m_H_comm_type!: any[];
	m_H_calcflg!: any[];
	m_A_term: any;
	m_H_default!: any[];

	async asyncConstructor() {
		var sql = "select carid,patternname,patternid,kousiflg";
		sql += ",kousimethod,kousicharge,comhistflg,kousiratio,teigakutax";
		sql += ",coalesce(is_private_term,0) as is_private_term";
		sql += " from kousi_pattern_tb";
		sql += " order by patternid";
		sql += ";";
// 2022cvt_015
		var A_result = await this.m_db.getHash(sql);

// 2022cvt_015
		for (var H_line of (A_result)) //控除額は、料金と消費税をあわせた値なので、消費税を引く
		//比率方式なのに端末を私用とするなら警告を出す
		{
			this.m_H_pattern[H_line.patternid] = {
				carid: H_line.carid,
		// 2022cvt_022
				// is_public: 0 == strcmp(H_line.kousiflg, "0"),
				is_public: 0 == H_line.kousiflg.localeCompare("0"),
		// 2022cvt_022
				// is_fix: 0 == strcmp(H_line.kousimethod, "0"),
				is_fix: 0 == H_line.kousimethod.localeCompare("0"),
				fixcharge: 0 + (H_line.kousicharge.length ? H_line.kousicharge : 0),
		// 2022cvt_022
				// is_comm: 0 == strcmp(H_line.comhistflg, "1"),
				is_comm: 0 == H_line.comhistflg.localeCompare("1"),

				public_ratio: 0.01 * (H_line.kousiratio.length ? H_line.kousiratio : 0),
				utiwake: Array(),
				fixtax: 0 + (H_line.teigakutax.length ? H_line.teigakutax : 0),
				is_private_term: 0 != H_line.is_private_term
			};
			this.m_H_pattern[H_line.patternid].fixcharge = this.m_H_pattern[H_line.patternid].fixcharge - this.m_H_pattern[H_line.patternid].fixtax;

			if (this.m_H_pattern[H_line.patternid].is_private_term && !this.m_H_pattern[H_line.patternid].is_fix) {
				this.putError(G_SCRIPT_WARNING, "比率方式の公私パターンなのに端末代金を私用に設定している" + "(比率方式では必ず比率が優先される)" + H_line.patternid + ":" + H_line.patternname);
			}
		}

		// 2022cvt_015
		var H_temp = Array();
		// 2022cvt_015
		var A_key = ["is_public", "fixcharge", "fixtax"];
		{
			let _tmp_0 = this.m_H_pattern;

		// 2022cvt_015
			for (var patid in _tmp_0) //定額以外はMNPとみなさない
			{
		// 2022cvt_015
				var H_pattern = _tmp_0[patid];
				if (!H_pattern.is_fix) continue;
		// 2022cvt_015
				var key = "";

		// 2022cvt_015
				for (var keykey of (A_key)) {
					key += ",";
					if (undefined !== H_pattern[keykey]) key += H_pattern[keykey];
				}

				if (!(undefined !== H_temp[key])) H_temp[key] = Array();
				H_temp[key].push(patid);
			}
		}
		this.m_A_mnp = Array();

		// 2022cvt_015
		for (var key in H_temp) {
		// 2022cvt_015
			var A_value = H_temp[key];
			if (A_value.length <= 1) continue;
			this.m_A_mnp.push(A_value);
		}

		sql = "select patternid,code,carid,kousiflg,kousiratio";
		sql += " from kousi_rel_utiwake_tb";
		sql += " where kousiflg in ('0','1')";
		sql += " order by patternid";
		sql += ";";
		A_result = await this.m_db.getHash(sql);

		// 2022cvt_015
		for (var H_line of (A_result)) {
		// 2022cvt_015
			var patternid = H_line.patternid;
			if (!(undefined !== this.m_H_pattern[patternid])) continue;
		// 2022cvt_015
			var carid = H_line.carid;
		// 2022cvt_015
			var code = H_line.code;
		// 2022cvt_015
			var ratio = 0.01 * (H_line.kousiratio.length ? H_line.kousiratio : 0);
		// 2022cvt_022
		// 2022cvt_015
			// var base = 0 == strcmp(H_line.kousiflg, "0");
			var base = 0 == H_line.kousiflg.localeCompare("0");
			if (!(undefined !== this.m_H_pattern[patternid].utiwake[carid])) this.m_H_pattern[patternid].utiwake[carid] = Array();
			this.m_H_pattern[patternid].utiwake[carid][code] = {
				ratio: ratio,
				is_public: base
			};
		}

		this.m_H_public = {
			is_public: true,
			is_fix: false,
			fixcharge: 0,
			is_comm: false,
			public_ratio: 1,
			utiwake: Array(),
			is_private_term: false
		};
		// 2022cvt_016
		this.m_H_comm_type = Array();
		// 2022cvt_016
		sql = "select carid,type from kousi_commtype_tb";
		sql += ";";
		// 2022cvt_015
		var result = await this.m_db.getHash(sql);

		// 2022cvt_015
		for (var line of (result)) {
			carid = line.carid;
		// 2022cvt_016
			if (!(undefined !== this.m_H_comm_type[carid])) this.m_H_comm_type[carid] = Array();
		// 2022cvt_016
			this.m_H_comm_type[carid].push(line.type);
		}
		this.m_H_calcflg = Array();
		this.m_A_term = Array();
		sql = "select code,carid from utiwake_term_tb" + " order by carid,code" + ";";
		this.m_A_term = this.m_db.getHash(sql);
	}

	// async UpdateTelBillKousi(listener, db, table_no, inserter) //パターンマスターを準備する
	constructor(listener: ScriptLogBase, db: script_db.ScriptDB, table_no: script_db.default, inserter: any) //パターンマスターを準備する
	//MNPとみなすパターンを抜き出す
	//パターン内訳マスターの準備をする
	//100%公用のパターンを作る
// 2022cvt_016
	//各キャリアで、処理するcommhistory_X_tb::typeを取得する
	//端末と見なす内訳を読み出す
	{
		// this.UpdateTelBillBase(listener, db, table_no, inserter);
		super(listener, db, table_no, inserter);
		this.m_H_pattern = Array();
// 2022cvt_015
// 		var sql = "select carid,patternname,patternid,kousiflg";
// 		sql += ",kousimethod,kousicharge,comhistflg,kousiratio,teigakutax";
// 		sql += ",coalesce(is_private_term,0) as is_private_term";
// 		sql += " from kousi_pattern_tb";
// 		sql += " order by patternid";
// 		sql += ";";
// // 2022cvt_015
// 		var A_result = await this.m_db.getHash(sql);

// // 2022cvt_015
// 		for (var H_line of (A_result)) //控除額は、料金と消費税をあわせた値なので、消費税を引く
// 		//比率方式なのに端末を私用とするなら警告を出す
// 		{
// 			this.m_H_pattern[H_line.patternid] = {
// 				carid: H_line.carid,
// // 2022cvt_022
// 				// is_public: 0 == strcmp(H_line.kousiflg, "0"),
// 				is_public: 0 == H_line.kousiflg.localeCompare("0"),
// // 2022cvt_022
// 				// is_fix: 0 == strcmp(H_line.kousimethod, "0"),
// 				is_fix: 0 == H_line.kousimethod.localeCompare("0"),
// 				fixcharge: 0 + (H_line.kousicharge.length ? H_line.kousicharge : 0),
// // 2022cvt_022
// 				// is_comm: 0 == strcmp(H_line.comhistflg, "1"),
// 				is_comm: 0 == H_line.comhistflg.localeCompare("1"),

// 				public_ratio: 0.01 * (H_line.kousiratio.length ? H_line.kousiratio : 0),
// 				utiwake: Array(),
// 				fixtax: 0 + (H_line.teigakutax.length ? H_line.teigakutax : 0),
// 				is_private_term: 0 != H_line.is_private_term
// 			};
// 			this.m_H_pattern[H_line.patternid].fixcharge = this.m_H_pattern[H_line.patternid].fixcharge - this.m_H_pattern[H_line.patternid].fixtax;

// 			if (this.m_H_pattern[H_line.patternid].is_private_term && !this.m_H_pattern[H_line.patternid].is_fix) {
// 				this.putError(G_SCRIPT_WARNING, "比率方式の公私パターンなのに端末代金を私用に設定している" + "(比率方式では必ず比率が優先される)" + H_line.patternid + ":" + H_line.patternname);
// 			}
// 		}

// // 2022cvt_015
// 		var H_temp = Array();
// // 2022cvt_015
// 		var A_key = ["is_public", "fixcharge", "fixtax"];
// 		{
// 			let _tmp_0 = this.m_H_pattern;

// // 2022cvt_015
// 			for (var patid in _tmp_0) //定額以外はMNPとみなさない
// 			{
// // 2022cvt_015
// 				var H_pattern = _tmp_0[patid];
// 				if (!H_pattern.is_fix) continue;
// // 2022cvt_015
// 				var key = "";

// // 2022cvt_015
// 				for (var keykey of (A_key)) {
// 					key += ",";
// 					if (undefined !== H_pattern[keykey]) key += H_pattern[keykey];
// 				}

// 				if (!(undefined !== H_temp[key])) H_temp[key] = Array();
// 				H_temp[key].push(patid);
// 			}
// 		}
// 		this.m_A_mnp = Array();

// // 2022cvt_015
// 		for (var key in H_temp) {
// // 2022cvt_015
// 			var A_value = H_temp[key];
// 			if (A_value.length <= 1) continue;
// 			this.m_A_mnp.push(A_value);
// 		}

// 		sql = "select patternid,code,carid,kousiflg,kousiratio";
// 		sql += " from kousi_rel_utiwake_tb";
// 		sql += " where kousiflg in ('0','1')";
// 		sql += " order by patternid";
// 		sql += ";";
// 		A_result = await this.m_db.getHash(sql);

// // 2022cvt_015
// 		for (var H_line of (A_result)) {
// // 2022cvt_015
// 			var patternid = H_line.patternid;
// 			if (!(undefined !== this.m_H_pattern[patternid])) continue;
// // 2022cvt_015
// 			var carid = H_line.carid;
// // 2022cvt_015
// 			var code = H_line.code;
// // 2022cvt_015
// 			var ratio = 0.01 * (H_line.kousiratio.length ? H_line.kousiratio : 0);
// // 2022cvt_022
// // 2022cvt_015
// 			// var base = 0 == strcmp(H_line.kousiflg, "0");
// 			var base = 0 == H_line.kousiflg.localeCompare("0");
// 			if (!(undefined !== this.m_H_pattern[patternid].utiwake[carid])) this.m_H_pattern[patternid].utiwake[carid] = Array();
// 			this.m_H_pattern[patternid].utiwake[carid][code] = {
// 				ratio: ratio,
// 				is_public: base
// 			};
// 		}

// 		this.m_H_public = {
// 			is_public: true,
// 			is_fix: false,
// 			fixcharge: 0,
// 			is_comm: false,
// 			public_ratio: 1,
// 			utiwake: Array(),
// 			is_private_term: false
// 		};
// // 2022cvt_016
// 		this.m_H_comm_type = Array();
// // 2022cvt_016
// 		sql = "select carid,type from kousi_commtype_tb";
// 		sql += ";";
// // 2022cvt_015
// 		var result = await this.m_db.getHash(sql);

// // 2022cvt_015
// 		for (var line of (result)) {
// 			carid = line.carid;
// // 2022cvt_016
// 			if (!(undefined !== this.m_H_comm_type[carid])) this.m_H_comm_type[carid] = Array();
// // 2022cvt_016
// 			this.m_H_comm_type[carid].push(line.type);
// 		}

		// this.m_H_calcflg = Array();
		// this.m_A_term = Array();
		// sql = "select code,carid from utiwake_term_tb" + " order by carid,code" + ";";
		// this.m_A_term = this.m_db.getHash(sql);
	}

	getTableNameTgt(table_no: string) {
		return "kousi_tel_bill_" + table_no + "_tb";
	}

	async fetch(O_cache) {
// 2022cvt_015
		var table_no = this.getTableNo(O_cache.getYear(), O_cache.getMonth());
// 2022cvt_015
		var sqlfrom = " from kousi_tel_bill_" + table_no + "_tb" + " where pactid=" + this.escape(O_cache.getPactid());
		if (O_cache.getCaridDetails().length) sqlfrom += " and carid in (" + O_cache.getCaridDetails().join(",") + ")";
		if (O_cache.getTelno().length) sqlfrom += " and telno='" + this.escape(O_cache.getTelno()) + "'";
		sqlfrom += " and coalesce(calcflg,0) in (1, 2)";
// 2022cvt_015
		var sql = "select carid,telno" + sqlfrom + ";";
// 2022cvt_015
		var result = await this.m_db.getHash(sql);
		this.m_H_calcflg = Array();

// 2022cvt_015
		for (var line of (result)) {
// 2022cvt_015
			var key = line.carid + "," + line.telno;
			this.m_H_calcflg[key] = true;
		}

		return true;
	}

	async begin(O_cache: any) //基底型の同名メソッドを呼び出す
	//顧客全体で使用するパターンを決定する
	//MNP不能なのにMNPしていたら終了する
	{
		// if (!UpdateTelBillBase.begin(O_cache)) return false;
		if (!super.begin(O_cache)) return false;

// 2022cvt_015
		var table_no = this.getTableNo(O_cache.getYear(), O_cache.getMonth());
		this.m_H_default = Array();
// 2022cvt_015
		var sql = "select carid,kousiflg,patternid";
		sql += " from kousi_default_tb where pactid=" + this.escape(O_cache.getPactid());
		sql += " order by carid";
		sql += ";";
// 2022cvt_015
		var A_result = await this.m_db.getHash(sql);

// 2022cvt_015
		for (var H_line of (A_result)) {
// 2022cvt_015
			var patternid = H_line.patternid;
// 2022cvt_022
			// if (0 == strcmp(H_line.kousiflg, "1")) patternid = "";
			if (0 == H_line.kousiflg.localeCompare("1")) patternid = "";
			this.m_H_default[H_line.carid] = patternid;
		}

		if (!this.isMNP(O_cache, table_no)) return false;
		return true;
	}

	executeTelno(O_cache, telno, H_carid_details, H_carid_telinfo, is_calcflg) //電話情報のデフォルト値を設定する
	//全キャリアの処理を行う
	{
// 2022cvt_015
		for (var carid in H_carid_telinfo) //按分情報がある事を確認する
		{
// 2022cvt_015
			var H_telinfo = H_carid_telinfo[carid];

			if (!O_cache.isChange(carid)) {
				this.putError(G_SCRIPT_INFO, "按分情報無し" + O_cache.getPactid() + "/" + carid + "/" + telno);
				return false;
			}

			if (!(undefined !== H_telinfo.kousiflg) || !H_telinfo.kousiflg.length || !(undefined !== H_telinfo.kousiptn) || !H_telinfo.kousiptn.length) //パターンが設定されていない
				{
					H_carid_telinfo[carid].kousiflg = "1";
					H_carid_telinfo[carid].kousiptn = undefined;
				} else //キャリアとパターンが食い違っていたらパターン無しとする
				{
// 2022cvt_022
					// if (undefined !== this.m_H_pattern[H_telinfo.kousiptn] && strcmp(H_telinfo.carid, this.m_H_pattern[H_telinfo.kousiptn].carid)) {
					if (undefined !== this.m_H_pattern[H_telinfo.kousiptn] && H_telinfo.carid.localeCompare(this.m_H_pattern[H_telinfo.kousiptn].carid)) {

						this.putError(G_SCRIPT_WARNING, "パターンIDのキャリアIDが電話のキャリアIDと食い違う" + "/telno:=" + H_telinfo.telno + "/carid:=" + H_telinfo.carid + "/patid:=" + H_telinfo.kousiptn + "/carid:=" + this.m_H_pattern[H_telinfo.kousiptn].carid + "/パターン無しと見なした");
						H_carid_telinfo[carid].kousiflg = "1";
						H_carid_telinfo[carid].kousiptn = undefined;
					}
				}
		}

// 2022cvt_015
		var table_no = this.getTableNo(O_cache.getYear(), O_cache.getMonth());
		if (!this.update(O_cache, O_cache.getPactid(), O_cache.getYear(), O_cache.getMonth(), table_no, telno, H_carid_details, H_carid_telinfo, is_calcflg)) return false;
		return true;
	}

	async isMNP(O_cache: any, table_no: string) //全キャリアで実行する場合は問題ない
	{
// 2022cvt_015
		var A_carid = O_cache.getCaridDetails();
		if (!A_carid.length) return false;
// 2022cvt_015
		var sql = "select telno from tel_details_" + table_no + "_tb";
		sql += " where pactid=" + this.m_db.escape(O_cache.getPactid());
		sql += " and carid in (" + A_carid.join(",") + ")";
		if (O_cache.getTelno().length) sql += " and telno='" + this.m_db.escape(O_cache.getTelno()) + "'";
		sql += " and telno in (";
		sql += "select telno from tel_details_" + table_no + "_tb";
		sql += " where pactid=" + this.m_db.escape(O_cache.getPactid());
		sql += " and carid not in (" + A_carid.join(",") + ")";
		if (O_cache.getTelno().length) sql += " and telno='" + this.m_db.escape(O_cache.getTelno()) + "'";
		sql += ")";
		sql += " group by telno";
		sql += " order by telno";
		sql += ";";
// 2022cvt_015
		var A_result = await this.m_db.getAll(sql);
		if (0 == A_result.length) return false;
// 2022cvt_015
		var msg = "";

// 2022cvt_015
		for (var A_line of (A_result)) msg += "," + A_line[0];

		this.putError(G_SCRIPT_WARNING, "キャリア(" + A_carid.join(",") + ")で起動したが、以下の電話は他キャリアとMNPを利用している" + msg);
		return true;
	}

	async update(O_cache, pactid, year, month, table_no, telno, H_carid_details, H_carid_telinfo, is_calcflg) //通話料とみなす請求明細の区分
	//全部のキャリアIDに対してループする
	//MNPの負担額を按分する
	{
// 2022cvt_015
		var H_bill = Array();
// 2022cvt_015
		var A_comm = [2, 3];

// 2022cvt_015
		for (var carid in H_carid_telinfo) //部署毎の比率を取り出す
		//パターンが無ければ全額公用
		//空文字列の可能性がある
		{
// 2022cvt_015
			var H_telinfo = H_carid_telinfo[carid];
// 2022cvt_015
			var H_ratio = Array();
// 2022cvt_015
			var contract = undefined !== H_telinfo.contractdate ? H_telinfo.contractdate : "";
// 2022cvt_015
			var seconds = 0;
			if (!O_cache.getChange(carid).get(telno, H_telinfo.postid, contract, H_ratio, seconds)) return false;
// 2022cvt_015
			var patid = undefined !== H_telinfo.kousiptn ? H_telinfo.kousiptn : "";
			if (!patid.length) patid = undefined !== this.m_H_default[carid] ? this.m_H_default[carid] : "";
// 2022cvt_022
			// if (strcmp(H_telinfo.kousiflg, "0")) patid = "";
			if (H_telinfo.kousiflg.localeCompare("0")) patid = "";
// 2022cvt_015
			var H_pat = this.m_H_public;
			if (patid.length && undefined !== this.m_H_pattern[patid]) H_pat = this.m_H_pattern[patid];
// 2022cvt_015
			var H_utiwake = Array();
			if (undefined !== H_pat.utiwake && undefined !== H_pat.utiwake[H_telinfo.carid]) H_utiwake = H_pat.utiwake[H_telinfo.carid];
// 2022cvt_015
			var H_carbill: { [key: string]: any } = {};

			if (!(undefined !== H_carid_details[carid])) {
				continue;
			}

			if (!this.getDetails(pactid, carid, year, month, table_no, telno, H_pat, A_comm, H_carid_details[carid], H_carbill)) return false;
			H_carbill.ratio = H_ratio;
			H_carbill.seconds = seconds;
			H_carbill.patid = patid;
			H_carbill.pattern = H_pat;
			H_carbill.utiwake = H_utiwake;
			H_bill[carid] = H_carbill;
		}

		if (!this.dispatchMNP(H_bill)) return false;

// 2022cvt_015
		for (var carid in H_bill) //パターン毎に公私の請求額を按分して、DBの挿入形式に変換する
		//部署の請求額を按分して保存する
		//部署毎の比率に対してループする
		//残額
		{
// 2022cvt_015
			H_carbill = H_bill[carid];
// 2022cvt_015
			var H_total = Array();
			if (!this.calc(H_carbill, H_total)) return false;
// 2022cvt_015
			var lastpostid = "";
			{
				let _tmp_1 = H_carbill.ratio;

// 2022cvt_015
				for (var postid in _tmp_1) {
// 2022cvt_015
					var ratio = _tmp_1[postid];
					lastpostid = postid;
				}
			}
// 2022cvt_015
			var H_remain = H_total;
			{
				let _tmp_2 = H_carbill.ratio;

// 2022cvt_015
				for (var postid in _tmp_2) //比率をかけてこの部署の金額を求める
				//この部署の金額を挿入する
				{
// 2022cvt_015
					var ratio = _tmp_2[postid];
// 2022cvt_015
					var H_cur: { [key: string]: any } = {};
// 2022cvt_022
					// if (!strcmp(lastpostid, postid)) H_cur = H_remain;else {
					if (!lastpostid.localeCompare(postid)) H_cur = H_remain;else {
// 2022cvt_015
						for (var key in H_total) {
// 2022cvt_015
							var value = H_total[key];
// 2022cvt_015
							value = Math.round(value * 1 * ratio);
							H_remain[key] -= value;
							H_cur[key] = value;
						}
					}
					H_cur.pactid = pactid;
					H_cur.postid = postid;
					H_cur.telno = telno;
					H_cur.carid = carid;
					H_cur.recdate = "now()";
// 2022cvt_015
					var key = H_telinfo.carid + "," + telno;
// 2022cvt_015
					var calcflg = undefined !== this.m_H_calcflg[key] ? 2 : 0;

					switch (is_calcflg) {
						case 0:
							H_cur.calcflg = 0;
							break;

						case 1:
							H_cur.calcflg = 1;
							break;

						default:
							H_cur.calcflg = calcflg;
							break;
					}

					this.m_O_inserter.insert(H_cur);
				}
			}
		}

		return true;
	}

	calc(H_carbill, H_total) //パターンに従って公私を求める
	//DB挿入形式に変換する
	{
// 2022cvt_015
		var H_pat = H_carbill.pattern;

		if (!(undefined !== H_pat.is_fix) || H_pat.is_fix) //定額控除で計算
			{
				if (!this.calcFix(H_pat, H_carbill.term, H_carbill.is_public, H_carbill.value)) return false;
			} else //比率で計算
			{
				if (!this.calcRatio(H_pat, H_carbill.utiwake, H_carbill.details, H_carbill.is_public, H_carbill.use_comm, H_carbill.public_ratio_comm, H_carbill.comm, H_carbill.value)) return false;
			}

		{
			let _tmp_3 = H_carbill.value;

// 2022cvt_015
			for (var key in _tmp_3) {
// 2022cvt_015
				var H_v = _tmp_3[key];

// 2022cvt_015
				for (var pre in H_v) {
// 2022cvt_015
					var value = H_v[pre];
// 2022cvt_015
					if ("total" == pre) var pre = "";
					H_total[pre + key] = value;
				}
			}
		}
		return true;
	}

	async calcComm(pactid, carid, telno, table_no, H_pat, is_public, public_ratio_comm) {
// 2022cvt_016
// 2022cvt_015
		var A_types = Array();
// 2022cvt_016
		if (undefined !== this.m_H_comm_type[carid]) A_types = this.m_H_comm_type[carid];
// 2022cvt_016
		if (0 == A_types.length) return true;
// 2022cvt_015
		var sql = "select kousiflg,sum(charge) as sum_charge";
		sql += " from commhistory_" + table_no + "_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(carid);
		sql += " and telno='" + this.escape(telno) + "'";

// 2022cvt_016
		if (A_types.length) {
// 2022cvt_015
			var comma = false;
// 2022cvt_016
			sql += " and type in (";

// 2022cvt_016
// 2022cvt_015
			for (var type of (A_types)) {
				if (comma) sql += ",";
				comma = true;
// 2022cvt_016
				sql += "'" + this.escape(type) + "'";
			}

			sql += ")";
		}

		sql += " group by kousiflg";
		sql += ";";
// 2022cvt_015
		var A_result = await this.m_db.getHash(sql);
// 2022cvt_015
		var public_1 = 0;
// 2022cvt_015
		var private_1 = 0;

// 2022cvt_015
		for (var H_line of (A_result)) {
// 2022cvt_015
			var key = H_line.kousiflg;
// 2022cvt_015
			var value = 0 + H_line.sum_charge;
// 2022cvt_022
			// if (0 == strcmp(key, "0")) public += value;else if (0 == strcmp(key, "1")) private += value;else {
			if (0 == key.localeCompare("0")) public_1 += value;else if (0 == key.localeCompare(key, "1")) private_1 += value;else {
				if (is_public) public_1 += value;else private_1 += value;
			}
		}

// 2022cvt_015
		var total = public_1 + private_1;
		if (0 == total) return true;
		public_ratio_comm = public_1 / total;
		return true;
	}

	getDetails(pactid, carid, year, month, table_no, telno, H_pat, A_comm, A_details, H_carbill) //端末に相当するコードを取り出す
	//通話明細を使用する場合は、その比率を求める
	//13ヶ月以上古い場合は通話明細を使用しない
	{
// 2022cvt_015
		var A_term = Array();

		if (H_pat.is_private_term) {
// 2022cvt_015
			for (var H_term of (this.m_A_term)) {
// 2022cvt_022
				// if (!strcmp(carid, H_term.carid)) A_term.push(H_term.code);
				if (!carid.localeCompare(H_term.carid)) A_term.push(H_term.code);
			}
		}

// 2022cvt_015
		var is_public = !(undefined !== H_pat.is_public) || H_pat.is_public;
// 2022cvt_015
		var use_comm = undefined !== H_pat.is_comm && H_pat.is_comm;
		if (12 < table_no) use_comm = false;
// 2022cvt_015
		var public_ratio_comm = is_public ? 1 : 0;

		if (use_comm) {
			if (!this.calcComm(pactid, carid, telno, table_no, H_pat, is_public, public_ratio_comm)) return false;
		}

// 2022cvt_015
		var H_v = {
			total: 0,
			public: 0,
			private: 0
		};
// 2022cvt_015
		var H_value = {
			charge: H_v,
			tax: H_v,
			comm: H_v
		};
// 2022cvt_015
		var term = 0;
// 2022cvt_015
		var H_result = Array();

// 2022cvt_015
		for (var H_line of (A_details)) {
// 2022cvt_015
			var charge = 0 + H_line.charge;
// 2022cvt_022
// 2022cvt_015
			// var is_excise = !strcmp(H_line.kamokuid, G_KAMOKU_EXCISE);
			var is_excise = !H_line.kamokuid.localeCompare(G_KAMOKU_EXCISE);
			if (-1 !== A_term.indexOf(H_line.code)) term += charge;else if (is_excise) H_value.tax.total = H_value.tax.total + charge;else H_value.charge.total = H_value.charge.total + charge;
			if (-1 !== A_comm.indexOf(H_line.kamoku)) H_value.comm.total = H_value.comm.total + charge;
// 2022cvt_016
// 2022cvt_015
			var key = (undefined !== H_line.code ? H_line.code : "") + "," + (undefined !== H_line.kamoku ? H_line.kamoku : "") + "," + (undefined !== H_line.taxtype ? H_line.taxtype : "") + "," + (is_excise ? 1 : 0);
			if (!(undefined !== H_result[key])) H_result[key] = 0;
			H_result[key] = H_result[key] + charge;
		}

// 2022cvt_015
		var A_result = Array();

// 2022cvt_015
		for (var key in H_result) {
// 2022cvt_015
			var total = H_result[key];
// 2022cvt_015
			var A_key = key.split(",");
			A_result.push({
				code: A_key[0],
				kamoku: A_key[1],
// 2022cvt_016
				taxtype: A_key[2],
				total: total,
				id: A_key[3]
			});
		}

		H_carbill = {
			value: H_value,
			term: term,
			is_public: is_public,
			use_comm: use_comm,
			public_ratio_comm: public_ratio_comm,
			comm: A_comm,
			details: A_result
		};
		return true;
	}

	dispatchMNP(H_bill) //処理済みのキャリアID
	{
// 2022cvt_015
		var A_feed = Array();

		while (true) //MNPに該当するキャリアIDを抜き出す
		//MNPを処理し終わったのでループを抜ける
		//MNPに該当するキャリアがあるので、キャリア毎の所属秒数を取り出す
		//定額負担額を取り出す
		//最後のキャリアIDを取り出す
		//定額負担額を按分する
		//回線数が一個なら処理をスキップする
		//オーバーした額を、まだ加算できるキャリアに加算する
		{
// 2022cvt_015
			var A_mnp = Array();
// 2022cvt_015
			var idx = -1;

// 2022cvt_015
			for (var carid in H_bill) {
// 2022cvt_015
				var H_line = H_bill[carid];
				if (-1 !== A_feed.indexOf(carid)) continue;
// 2022cvt_015
				var patid = H_line.patid;

				if (idx < 0) {
// 2022cvt_015
					for (var cnt = 0; cnt < this.m_A_mnp.length; ++cnt) {
						if (-1 !== this.m_A_mnp[cnt].indexOf(patid)) {
							A_mnp.push(carid);
							idx = cnt;
							break;
						}
					}
				} else {
					if (-1 !== this.m_A_mnp[idx].indexOf(patid)) {
						A_mnp.push(carid);
						break;
					}
				}
			}

			if (A_mnp.length <= 0) break;

// 2022cvt_015
			for (var carid_1 of (A_mnp)) A_feed.push(carid_1);

// 2022cvt_015
			var H_mnp = Array();
// 2022cvt_015
			var sum = 0;

// 2022cvt_015
			for (var carid in H_bill) {
// 2022cvt_015
				var H_line = H_bill[carid];
				if (!(-1 !== A_mnp.indexOf(carid))) continue;
// 2022cvt_015
				var seconds = H_line.seconds;
				H_mnp[carid] = seconds;
				sum += seconds;
			}

// 2022cvt_015
			var remaincharge = H_bill[A_mnp[0]].pattern.fixcharge;
// 2022cvt_015
			var remaintax = H_bill[A_mnp[0]].pattern.fixtax;
// 2022cvt_015
			var last_carid = "";

// 2022cvt_015
			for (var carid in H_mnp) {
// 2022cvt_015
				var seconds = H_mnp[carid];
				last_carid = carid;
			}

// 2022cvt_015
			for (var carid in H_mnp) {
// 2022cvt_015
				var seconds = H_mnp[carid];

				if (last_carid == carid) {
					H_bill[carid].pattern.fixcharge = remaincharge;
					H_bill[carid].pattern.fixtax = remaintax;
				} else {
// 2022cvt_015
					var fixcharge = Math.round(remaincharge * seconds / sum);
					H_bill[carid].pattern.fixcharge = fixcharge;
					remaincharge -= fixcharge;
// 2022cvt_015
					var fixtax = Math.round(remaintax * seconds / sum);
					H_bill[carid].pattern.fixtax = fixtax;
					remaintax -= fixtax;
				}
			}

			if (A_mnp.length <= 1) continue;
// 2022cvt_015
			var overcharge = 0;
// 2022cvt_015
			var overtax = 0;

// 2022cvt_015
			for (var carid_2 of (A_mnp)) //請求額がオーバーしていたらカットする
			{
// 2022cvt_015
				var charge = H_bill[carid_2].value.charge.total;
// 2022cvt_015
				var tax = H_bill[carid_2].value.tax.total;
				fixcharge = H_bill[carid_2].pattern.fixcharge;
				fixtax = H_bill[carid_2].pattern.fixtax;

				if (charge < fixcharge) //オーバーした額を加算して、負担額を実際の額まで引き下げる
					{
// 2022cvt_015
						var diff = fixcharge - charge;
						overcharge += diff;
						H_bill[carid_2].pattern.fixcharge = charge;
					}

				if (tax < fixtax) //オーバーした額を加算して、負担額を実際の額まで引き下げる
					{
						diff = fixtax - tax;
						overtax += diff;
						H_bill[carid_2].pattern.fixtax = tax;
					}
			}

// 2022cvt_015
			for (var carid_3 of (A_mnp)) //まだ加算できたら、請求額を加算する
			{
				charge = H_bill[carid_3].value.charge.total;
				tax = H_bill[carid_3].value.tax.total;
				fixcharge = H_bill[carid_3].pattern.fixcharge;
				fixtax = H_bill[carid_3].pattern.fixtax;

				if (0 < overcharge && fixcharge < charge) //加算できる額を取り出す
					{
						diff = charge - fixcharge;
						if (overcharge < diff) diff = overcharge;
						H_bill[carid_3].pattern.fixcharge += diff;
						overcharge -= diff;
					}

				if (0 < overtax && fixtax < tax) //加算できる額を取り出す
					{
						diff = tax - fixtax;
						if (overtax < diff) diff = overtax;
						H_bill[carid_3].pattern.fixtax += diff;
						overtax -= diff;
					}
			}
		}
		
		return true;
	}

	calcFix(H_pat, term, is_public, H_value) //控除額
	//消費税控除額
	//総額が控除額より少ない場合
	//使用料を定額控除と残額とに振り分ける
	//端末代金を私用に加算する
	//総額に対する控除分の比率を求める
	//通話費を控除分の比率で分計する
	//消費税を控除と残額とに振り分ける
	{
// 2022cvt_015
		var fix = undefined !== H_pat.fixcharge ? H_pat.fixcharge : 0;
// 2022cvt_015
		var tax = undefined !== H_pat.fixtax ? H_pat.fixtax : 0;

		if (H_value.charge.total < fix) //総額を控除額とする(ゼロ未満にはならない)
			{
// 2022cvt_015
				var nval = H_value.charge.total;
				if (nval < 0) nval = 0;
				tax += fix - nval;
				fix = nval;
			}

		if (H_value.tax.total < tax) //消費税額を控除額とする(ゼロ未満にはならない)
			{
				nval = H_value.tax.total;
				if (nval < 0) nval = 0;
				fix += tax - nval;
				tax = nval;
			}

		if (H_value.charge.total < fix) //総額を控除額とする(ゼロ未満にはならない)
			{
				nval = H_value.charge.total;
				if (nval < 0) nval = 0;
				fix = nval;
			}

// 2022cvt_015
		var key_fix = is_public ? "private" : "public";
// 2022cvt_015
		var key_remain = is_public ? "public" : "private";
		H_value.charge[key_fix] = fix;
		H_value.charge[key_remain] = H_value.charge.total - fix;
		H_value.charge.private += term;
// 2022cvt_015
		var total = H_value.charge.total + term;
// 2022cvt_015
		var ratio = 0 == total ? 0 : fix / total;
		H_value.comm[key_fix] = Math.round(ratio * H_value.comm.total);
		H_value.comm[key_remain] = H_value.comm.total - H_value.comm[key_fix];
		H_value.tax[key_fix] = tax;
		H_value.tax[key_remain] = H_value.tax.total - tax;
		return true;
	}

// 2022cvt_016
	calcRatio(H_pat, H_utiwake, A_details, is_public, use_comm, public_ratio_comm, A_comm, H_value) //消費税がゼロとなるtaxtype
	//ベースの公私比率を取り出す
	//請求の合計値を保存して、ゼロリセット
	//請求明細に対してループ
	//消費税を四捨五入
	//消費税に差額が出たらベース側を調整する
	//公私のうち一方がマイナスになったらゼロに補正する
	{
// 2022cvt_015
		var A_tax_zero = [0, 2, 3, 4];
// 2022cvt_015
		var base_ratio = undefined !== H_pat.public_ratio ? H_pat.public_ratio : 1;
// 2022cvt_015
		var H_value_orig = H_value;
// 2022cvt_015
		var H_v = {
			total: 0,
			public: 0,
			private: 0
		};
		H_value = {
			charge: H_v,
			tax: H_v,
			comm: H_v
		};

// 2022cvt_015
		for (var H_line of (A_details)) //ベースの公私比率
		//内訳科目の公私比率があれば、そちらで上書き
		//請求明細要素の支払額
		//うち公用分
		//うち私用分
		//消費税を加算
		{
// 2022cvt_015
			var ratio = base_ratio;
// 2022cvt_015
			var is_pub = is_public;
			if (undefined !== H_utiwake[H_line.code].ratio) ratio = H_utiwake[H_line.code].ratio;
			if (undefined !== H_utiwake[H_line.code].is_public) is_pub = H_utiwake[H_line.code].is_public;
			if (use_comm && -1 !== A_comm.indexOf(H_line.kamoku)) ratio = public_ratio_comm;
// 2022cvt_015
			var charge = 0 + H_line.total;
// 2022cvt_015
			var public_charge = +(charge * ratio);
// 2022cvt_015
			var private_charge = +(charge * (1 - ratio));
// 2022cvt_015
			var remain = charge - (public_charge + private_charge);
			if (is_pub) public_charge += remain;else private_charge += remain;

// 2022cvt_022
			// if (strcmp(H_line.id, "1")) //支払額を加算
			if (H_line.id.localeCompare("1")) //支払額を加算
				{
					H_value.charge.public = H_value.charge.public + public_charge;
					H_value.charge.private = H_value.charge.private + private_charge;
					H_value.charge.total = H_value.charge.total + charge;
				}

			if (-1 !== A_comm.indexOf(H_line.kamoku)) {
				H_value.comm.public = H_value.comm.public + public_charge;
				H_value.comm.private = H_value.comm.private + private_charge;
				H_value.comm.total = H_value.comm.total + charge;
			}

// 2022cvt_015
			var tax = 0;
// 2022cvt_016
			if (!(-1 !== A_tax_zero.indexOf(H_line.taxtype))) tax = +(charge * G_EXCISE_RATE);
// 2022cvt_015
			// var public_tax = Math.round(tax * ratio, 2);
			// roundは引数を持たないため２は削除（小林）
			var public_tax = Math.round(tax * ratio);

// 2022cvt_015
			// var private_tax = Math.round(tax * (1 - ratio), 2);
			// roundは引数を持たないため２は削除（小林）
			var private_tax = Math.round(tax * (1 - ratio));

			remain = tax - (public_tax + private_tax);
			if (is_pub) public_tax += remain;else private_tax += remain;
			H_value.tax.public = H_value.tax.public + public_tax;
			H_value.tax.private = H_value.tax.private + private_tax;
			H_value.tax.total = H_value.tax.total + tax;
		}

		H_value.tax.public = Math.round(H_value.tax.public);
		H_value.tax.private = Math.round(H_value.tax.private);
// 2022cvt_015
		var key_1 = is_public ? "public" : "private";
// 2022cvt_015
		var key_2 = is_public ? "private" : "public";
// 2022cvt_015
		var diff = H_value_orig.tax.total - H_value.tax.total;
		H_value.tax[key_1] = H_value.tax[key_1] + diff;

		if (0 < H_value_orig.tax.total) {
			if (H_value.tax[key_1] < 0 && 0 <= H_value.tax[key_2]) {
				H_value.tax[key_2] = H_value.tax[key_2] + H_value.tax[key_1];
				H_value.tax[key_1] = 0;
			}
		} else if (H_value_orig.tax.total < 0) {
			if (0 < H_value.tax[key_1] && H_value.tax[key_2] <= 0) {
				H_value.tax[key_2] = H_value.tax[key_2] + H_value.tax[key_1];
				H_value.tax[key_1] = 0;
			}
		}

		H_value.tax.total = H_value_orig.tax.total;
// 2022cvt_015
		var A_ways = ["charge", "tax", "comm"];

// 2022cvt_015
		for (var way of (A_ways)) {
// 2022cvt_015
			var A_keys = ["public", "private"];

// 2022cvt_015
			for (var cnt = 0; cnt < 2; ++cnt) {
// 2022cvt_015
				var key = A_keys[cnt];
// 2022cvt_015
				var key_inv = A_keys[cnt ? 0 : 1];

				if (0 < H_value[way].total && H_value[way][key] < 0 || H_value[way].total < 0 && 0 < H_value[way][key]) {
					H_value[way][key_inv] = H_value[way][key_inv] + H_value[way][key];
					H_value[way][key] = 0;
					break;
				}
			}
		}

		return true;
	}

};
