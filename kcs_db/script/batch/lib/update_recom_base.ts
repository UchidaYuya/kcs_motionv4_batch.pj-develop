//===========================================================================
//機能：trend_X_tbからplan_recom_tbを作る(キャリア共通の基底型)
//
//作成：森原
//===========================================================================
//機能：trend_X_tbからplan_recom_tbを作る(キャリア共通の基底型)

import { sprintf } from "../../../db_define/define";
import { FetchAdaptor, ScriptDBAdaptor } from "./script_db";
import { G_SCRIPT_DEBUG, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_SQL, G_SCRIPT_WARNING } from "./script_log";

// 2022cvt_026
// require("script_db.php");

// 2022cvt_026
// require("script_common.php");

//処理するキャリアID
//plan_recom_tbへのデータ挿入型
//sim_log_tbへのデータ挿入型
//sim_log_tbを使用するならtrue
//sim_log_tbへの書き込みを行うならtrue
//回線種別=>地域会社=>プランID=>プランマスター
//プランマスターは以下のハッシュ
//plan_tbの全内容
//packet => 適用できるパケットIDの配列
//回線種別=>地域会社=>パケットID=>パケットマスター
//パケットマスターは以下のハッシュ
//packet_tbの全内容
//現行プラン情報
//プランID => プラン情報
//m_H_planと異なり、回線種別・地域会社ごとに
//分離しておらず、simafterによる制限が無い
//処理する回線種別の配列
//計算するシミュレーション期間の配列
//predataのうち、割引率を表すキー
//predataのうち、無ければゼロを補うキー
//統計情報平均値のデフォルト値
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//plan_recom_tbへのデータ挿入型
//sim_log_tbへのデータ挿入型
//処理する回線種別の配列(空ならCDMAとWIN両方)
//シミュレーション期間(1,3,6,12)
//追加ログを出力するならtrue
//処理するキャリアID
//機能：既存のplan_recom_tbからレコードを削除する
//引数：顧客ID
//年(削除すべき電話番号をtel_X_tbから取り出す時に使用する)
//月(削除すべき電話番号をtel_X_tbから取り出す時に使用する)
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//保存先ファイル名(空文字列ならファイル保存せず)
//plan_recom_tbから、過去のすべての年月のレコードを削除するならtrue
//返値：深刻なエラーが発生したらfalseを返す
//機能：plan_recom_tbにレコードを作る
//備考：このメソッド内部で、SQLのCOPYを行う。
//シミュレーションは下位のメソッドが行う。
//引数：顧客ID
//年
//月
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：plan_recom_tbにレコードを作る
//備考：このメソッド内部で、DBからのqueryと、queryした値の解放を行う。
//引数：顧客ID
//年
//月
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//返値：深刻なエラーが発生したらfalseを返す
//機能：シミュレーションを行う
//備考：このメソッドは、処理すべき電話番号に対してループして、
//plan_predata_tb,sim_trend_X_tbの各query結果から
//該当する電話番号のレコードを読み出して、下位のメソッドに渡す。
//引数：年
//月
//処理すべき電話番号のフェッチ
//{predata,trend,topのフェッチ + trendの顧客単位デフォルト値}
//回線種別から通話料割引率への変換表
//返値：深刻なエラーが発生したらfalseを返す
//機能：一個の電話番号のシミュレーションを行う
//備考：このメソッドでは、シミュレーション期間(1,3,6,12ヶ月)に対して
//ループして、電話番号の回線種別に応じた下位メソッドを呼び出す。
//引数：電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//基本料割引率などの情報(同上)
//統計情報(同上)
//使用頻度の高い電話(同上)
//顧客全体の通話料割引率(無効ならnull)
//sim_log_tbに保存するメッセージ
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：割引後の基本料を返す
//備考：新プラン基本料 * (1 - 基本料割引率)
//引数：sim_log_tbに格納する値
//平均値
//新プラン情報
//顧客単位の割引率
//機能：一般通話とデジタル通信の通話秒数を求める
//引数：sim_log_tbに格納する値
//平均値
//機能：一般通話とデジタル通信の通話回数を求める
//引数：sim_log_tbに格納する値
//平均値
//秒数(一般, デジタル通信)
//機能：一般通話とデジタル通信の補正後秒数を求める
//引数：sim_log_tbに格納する値
//平均値
//現プラン情報
//新プラン情報
//通話秒数(一般, デジタル)
//通話回数(一般, デジタル)
//機能：無料通話料反映前の通話料を求める
//引数：sim_log_tbに格納する値
//平均値
//新プラン
//補正後秒数(一般, デジタル)
//現プランと同じならtrue
//携帯通話のうち、自社携帯への通話の比率
//機能：デジタル通信料を返す
//引数：sim_log_tbに挿入する値
//平均値
//新プラン
//補正後秒数(一般, デジタル)
//現プランと同じならtrue
//携帯通話のうち、自社携帯への通話の比率
//機能：一般とデジタルの通話秒数から、金額を求める
//引数：sim_log_tbに格納する値
//平均値
//新プラン
//補正後秒数
//プラン情報での、昼間の単位あたり金額のキー(携帯宛)
//プラン情報での、夜間の単位あたり金額のキー(携帯宛)
//プラン情報での、昼間の単位あたり金額のキー(固定電話宛)
//プラン情報での、夜間の単位あたり金額のキー(固定電話宛)
//プラン情報での、課金単位秒数のキー
//平均値での、昼夜の利用率のキー
//平均値での、携帯・固定の利用率のキー
//sim_log_tbでの、単位あたり金額のプレフィックス
//sim_log_tbでの、計算後の金額のプレフィックス
//携帯通話のうち、自社携帯への通話の比率
//機能：パケット数から各サービスでの通信料を求める
//引数：sim_log_tbに挿入する値
//平均値
//新パケット情報
//現パケットと同じならtrue
//返値：array("mode" => ez通信料,
//"browse" => PCサイト通信料, "other" => その他)
//機能：パケット数から各サービスでの通信料を求める(データ専用)
//引数：sim_log_tbに挿入する値
//平均値
//新プラン情報
//現プランと同じならtrue
//返値：array("mode" => ez通信料,
//"browse" => PCサイト通信料, "other" => その他)
//機能：国際通話の通話料を返す
//引数：sim_log_tbに挿入する値
//平均値
//機能：国際通話通話その他の通話料を返す
//引数：sim_log_tbに挿入する値
//平均値
//機能：国際デジタル通信・国際パケット通信の料金を返す
//引数：sim_log_tbに挿入する値
//平均値
//-----------------------------------------------------------------------
//機能：シミュレーション結果をもとに、DBに挿入する値を作る
//引数：DBに挿入するハッシュを修正して返す
//電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//Nヶ月の平均(詳細はcalcAveのコメント参照)
//プランIDからプラン情報配列への変換表
//パケットIDからパケット情報配列への変換表
//最安値のプランID[,最安値のパケットID]
//現行のプランID [,現行のパケットID]
//プランIDから{charge(料金),talkcomm(通話通信料)}への変換表
//機能：最安値を取り出す
//引数：電話情報
//「planid,packetid」=> 料金情報
//返値：最安値の「planid,packetid」を返す
//機能：最安値のコードから、プランIDを取り出す
//機能：最安値のコードから、パケットIDを取り出す
//-----------------------------------------------------------------------
//機能：現在のプランの課金単位秒数を返す
//引数：現在のプランID
//返値：array("chgunit" => 一般の秒数, "digichgunit" => デジタルの秒数)
//機能：処理すべき電話番号を取得するSQL文を返す
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：基本料割引率などを取得するSQL文を返す
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：統計情報を取得するSQL文を返す
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：使用頻度の高い電話を取得するSQL文を返す
//引数：顧客ID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//機能：SQL文のWHERE節のうち、電話番号での絞り込み部分を作成する
//引数：テーブル名(末尾にピリオドをつけない事)
//電話番号を表すカラム名
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//返値：空文字列か、「 AND」から始まるWHERE節の条件部分を返す
//機能：Nヶ月の平均を求める
//備考：結果の配列は以下のとおり
//array(
//trend => array(
//sim_trend_X_tb.code => array(
//sim_trend_X_tb.key => value(平均値)
//),
//...
//),
//top => array(
//sim_top_telno_X_tb.totelno => sec(平均値)
//...
//),
//predata => array(
//sim_trend_X_tb.code => value(平均値)
//),
//)
//引数：結果の配列を返す
//通話料割引率などの情報
//統計情報
//使用頻度の高い電話
//平均を求める期間
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：sim_log_tbに値を書き込む
//引数：共通部分(plan,packetidを含む)
//code
//key
//value
//memo
//ログ出力に必要なデバッグレベル
//機能：平均値をsim_log_tbに書き込む
//引数：共通部分(plan,packetを含まない)
//平均値
//ログ出力に必要なデバッグレベル
export default class UpdateRecomBase extends ScriptDBAdaptor {
	m_O_inserter_recom: any;
	m_O_inserter_log: any;
	m_A_cirid: any;
	m_A_monthcnt: any;
	m_assert: number;
	m_is_sim_log: boolean;
	m_carid: any;
	m_H_plan: any[];
	m_H_packet: any[];
	m_H_cur_plan: any[];
	m_A_predata_disratio: string[];
	m_A_predata_required: string[];
	m_H_ave_trend_default: any[];
	constructor(listener, db, table_no, inserter_recom, inserter_log, A_cirid, A_monthcnt, assert, carid) //プランに適用できるパケットIDの読み出し
	//プランマスターの読み出し
	//パケットマスターの読み出し
	//現行プラン情報
	//predataのうち、割引率を表すキー
	//predataのうち、無ければゼロを補うキー
	//統計情報平均値のデフォルト値
	{
		super(listener, db, table_no);
		this.m_O_inserter_recom = inserter_recom;
		this.m_O_inserter_log = inserter_log;
		this.m_A_cirid = A_cirid;
		this.m_A_monthcnt = A_monthcnt;
		this.m_assert = assert % 10;
		this.m_is_sim_log = 0 != +(assert / 10);
		this.m_carid = carid;
// 2022cvt_015
		var H_plan_rel_packet = Array();
// 2022cvt_015
		var sql = "select planid,packetid from plan_rel_packet_tb;";
// 2022cvt_015
		var result = this.m_db.getHash(sql);

// 2022cvt_015
		for (var H_line of result) {
// 2022cvt_015
			var planid = H_line.planid;
// 2022cvt_015
			var packetid = H_line.packetid;
			if (!(undefined !== H_plan_rel_packet[planid])) H_plan_rel_packet[planid] = Array();
			H_plan_rel_packet[planid].push(packetid);
		}

		this.m_H_plan = Array();
		sql = "select * from plan_tb where carid=" + this.m_carid;
		sql += " and cirid in (" + this.m_A_cirid.join(",") + ")";
		sql += " and simafter=true";
		sql += " and planid<3000";
		sql += ";";
		result = this.m_db.getHash(sql);
// 2022cvt_015
		var H_key_from_to = {
			charge: "chargefix",
			nightcharge: "nightchargefix",
			digicharge: "digichargefix",
			nightdigicharge: "nightdigichargefix"
		};

// 2022cvt_015
		for (var H_line of result) {
// 2022cvt_015
			var cirid = H_line.cirid;
// 2022cvt_015
			var arid = H_line.arid;
			planid = H_line.planid;
			H_line.packet = Array();
			if (undefined !== H_plan_rel_packet[planid]) H_line.packet = H_plan_rel_packet[planid];
			if (!(undefined !== this.m_H_plan[cirid])) this.m_H_plan[cirid] = Array();
			if (!(undefined !== this.m_H_plan[cirid][arid])) this.m_H_plan[cirid][arid] = Array();

// 2022cvt_015
			for (var from in H_key_from_to) {
// 2022cvt_015
				var to = H_key_from_to[from];
				if (undefined !== H_line[from] && !(undefined !== H_line[to])) H_line[to] = H_line[from];
			}

			this.m_H_plan[cirid][arid][planid] = H_line;
		}

		this.m_H_packet = Array();
		sql = "select * from packet_tb where carid=" + this.m_carid;
		sql += " and cirid in (" + this.m_A_cirid.join(",") + ")";
		sql += " and simafter=true";
		sql += " and packetid<3000";
		sql += ";";
		result = this.m_db.getHash(sql);

// 2022cvt_015
		for (var H_line of result) {
			cirid = H_line.cirid;
			arid = H_line.arid;
			packetid = H_line.packetid;
			if (!(undefined !== this.m_H_packet[cirid])) this.m_H_packet[cirid] = Array();
			if (!(undefined !== this.m_H_packet[cirid][arid])) this.m_H_packet[cirid][arid] = Array();
			this.m_H_packet[cirid][arid][packetid] = H_line;
		}

		this.m_H_cur_plan = Array();
		sql = "select * from plan_tb where carid=" + this.m_carid;
		sql += ";";
		result = this.m_db.getHash(sql);

// 2022cvt_015
		for (var H_line of result) {
			planid = H_line.planid;
			this.m_H_cur_plan[planid] = H_line;
		}

		this.m_A_predata_disratio = ["predata_disratiobasic", "predata_disratiotalk"];
		this.m_A_predata_required = ["predata_basic", "predata_disbasic", "predata_talk", "predata_distalk", "predata_com", "predata_discom", "predata_disother", "predata_fix", "predata_other", "predata_tax", "predata_disratiobasic", "predata_disratiotalk"];
		this.m_H_ave_trend_default = Array();
	}

	delete(pactid, year, month, A_telno, A_skip, fname, delete_all = true) //sim_log_tbから該当するレコードを削除する(保存しない)
	{
// 2022cvt_015
		var sqlfrom = " from plan_recom_tb";
		sqlfrom += " where pactid=" + this.escape(pactid);
		sqlfrom += " and carid=" + this.m_carid;

		if (!delete_all) {
// 2022cvt_021
			sqlfrom += " and recomdate='" + this.escape(sprintf("%04d-%02d", year, month)) + "'";
		}

		sqlfrom += this.getSQLWhereTelno("plan_recom_tb", "telno", A_telno, A_skip);
		sqlfrom += " and telno in (";
		sqlfrom += "select telno from tel_" + this.getTableNo(year, month) + "_tb";
		sqlfrom += " where cirid in (" + this.m_A_cirid.join(",") + ")";
		sqlfrom += ")";

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

// 2022cvt_015
		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sqlfrom = " from sim_log_tb";
		sqlfrom += " where pactid=" + this.escape(pactid);
		sqlfrom += " and carid=" + this.m_carid;
		sqlfrom += this.getSQLWhereTelno("sim_log_tb", "telno", A_telno, A_skip);
		sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid, year, month, A_telno, A_skip) //DB挿入型の初期化を行う
	//ファイルに書き出した値をDBにインポートする
	{
		if (!this.m_O_inserter_recom.begin("plan_recom_tb")) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->begin失敗");
			return false;
		}

		if (!this.m_O_inserter_log.begin("sim_log_tb")) {
			this.putError(G_SCRIPT_ERROR, "inserter_log->begin失敗");
			return false;
		}

// 2022cvt_015
		let const_0 = {
			pactid: pactid,
// 2022cvt_021
			recomdate: sprintf("%04d-%02d", year, month),
			carid: this.m_carid,
			recdate: "now()"
		};

		if (!this.m_O_inserter_recom.setConst(const_0)) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->setConst失敗");
			return false;
		}

		var const_1 = {
			pactid: pactid,
			carid: this.m_carid,
			recdate: "now()"
		};

		if (!this.m_O_inserter_log.setConst(const_1)) {
			this.putError(G_SCRIPT_ERROR, "inserter_log->setConst失敗");
			return false;
		}

// 2022cvt_015
		var status = this.do_execute(pactid, year, month, A_telno, A_skip);

		if (!this.m_is_sim_log) {
			this.putError(G_SCRIPT_INFO, "sim_log_tbへは書き込まず");
		} else {
			if (status && !this.m_O_inserter_log.end()) {
				this.putError(G_SCRIPT_ERROR, "inserter_log->end失敗");
				status = false;
			}
		}

		if (status && !this.m_O_inserter_recom.end()) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->end失敗");
			status = false;
		}

		return status;
	}

	do_execute(pactid, year, month, A_telno, A_skip) //処理すべき電話番号
	//処理すべき電話番号を取り出すフェッチ型
	//sim_trend_X_tb,sim_top_telno_X_tbを十二ヶ月づつ取り出す
	//0..11 => array("trend" => ..., "top", "predata")
	//顧客全体の通話料割引率があれば取り出す
	//回線種別から通話料割引率への変換表
	//DBから読み出した値を使って、シミュレーションの実行を行う
	//queryした結果を解放する
	{
// 2022cvt_015
		var table_no = this.getTableNo(year, month);
// 2022cvt_015
		var O_fetch_tel: any = Array();
		O_fetch_tel = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		O_fetch_tel.query(this.getSQLTelno(pactid, table_no, A_telno, A_skip));
// 2022cvt_015
		var A_fetch = Array();
// 2022cvt_015
		var year2 = year;
// 2022cvt_015
		var month2 = month;

// 2022cvt_015
		for (var cnt = 0; cnt < 12; ++cnt) //predataを取り出す
		//trendを取り出す
		//trendのデフォルト値を取り出す
		//topを取り出す
		//一個前の月に移動する
		{
// 2022cvt_015
			var table_no2 = this.getTableNo(year2, month2);
			A_fetch[cnt] = Array();
			A_fetch[cnt].predata = new FetchAdaptor(this.m_listener, this.m_db, "telno");
			A_fetch[cnt].predata.query(this.getSQLPredata(pactid, table_no2, A_telno, A_skip));
			A_fetch[cnt].trend = new FetchAdaptor(this.m_listener, this.m_db, "telno");
			A_fetch[cnt].trend.query(this.getSQLTrend(pactid, table_no2, A_telno, A_skip));
// 2022cvt_015
			var sql = this.getSQLTrend(pactid, table_no2, [""], Array());
// 2022cvt_015
			var A_result = this.m_db.getHash(sql);
// 2022cvt_015
			var H_result = Array();

// 2022cvt_015
			for (var H_line of A_result) {
// 2022cvt_015
				var code = H_line.code;
// 2022cvt_015
				var key = H_line.key;
// 2022cvt_015
				var value = H_line.value;
				if (!(undefined !== H_result[code])) H_result[code] = Array();
				H_result[code][key] = value;
			}

			A_fetch[cnt].trend_default = H_result;
			A_fetch[cnt].top = new FetchAdaptor(this.m_listener, this.m_db, "telno");
			A_fetch[cnt].top.query(this.getSQLTop(pactid, table_no2, A_telno, A_skip));
			--month2;

			if (0 == month2) {
				month2 = 12;
				--year2;
			}
		}

// 2022cvt_015
		var A_disratiotalk = Array();
		sql = "select cirid,disratiotalk from disratio_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(this.m_carid);
		sql += ";";
// 2022cvt_015
		var result = this.m_db.getHash(sql);

		if (result.length) {
// 2022cvt_015
			var msg = "顧客全体の通話料割引率";

// 2022cvt_015
			for (var line of result) {
// 2022cvt_015
				var cirid = line.cirid;
// 2022cvt_015
				var ratio = line.disratiotalk;
				if (!(undefined !== ratio)) continue;
				A_disratiotalk[cirid] = ratio;
				msg += "/" + cirid + "->" + ratio;

				if (100 < ratio) {
					this.putError(G_SCRIPT_WARNING, "顧客全体の通話料割引率が100%を超えている/cirid=" + cirid);
					return false;
				}
			}

			this.putError(G_SCRIPT_INFO, msg);
		} else this.putError(G_SCRIPT_INFO, "顧客全体の通話料割引率指定無し");

// 2022cvt_015
		var status = this.do_execute_sim(year, month, O_fetch_tel, A_fetch, A_disratiotalk);
		O_fetch_tel.free();

		for (cnt = 0; cnt < 12; ++cnt) {
			A_fetch[cnt].predata.free();
			A_fetch[cnt].trend.free();
			A_fetch[cnt].top.free();
		}

		return status;
	}

	do_execute_sim(year: number, month: number, O_fetch_tel, A_fetch: any, A_disratiotalk) //処理すべき電話番号を取り出す
	{
// 2022cvt_015
		var H_telno;

		while (H_telno = O_fetch_tel.fetchNext()) //sim_log_tbに保存するメッセージ
		//H_telnoはtelno,planid,packetid,arid,ciridを持つ
		//12ヶ月分の通話料割引率など
		//以下のハッシュを12個持つ
		//code => value
		//12ヶ月分の統計情報
		//以下のハッシュを12個持つ
		//code => {key => value}*
		//12ヶ月分の通話頻度の高い電話
		//以下のハッシュを12個持つ
		//("T" . totelno) => sec
		//顧客全体の通話料割引率があれば取り出す
		{
// 2022cvt_015
			var memo = "";
// 2022cvt_015
			var telno = H_telno.telno;
// 2022cvt_015
			var A_predata = Array();
// 2022cvt_015
			var A_trend = Array();
// 2022cvt_015
			var A_top = Array();

// 2022cvt_015
			for (var cnt = 0; cnt < 12; ++cnt) //通話料割引率などを取り出す
			//通話料割引率などが無ければ、統計情報などを取り出さない
			//統計情報の不足部分を顧客単位のデフォルト値で補う
			//顧客単位のデフォルト値が無い場合は、
			//calcAveの中で全顧客共通のデフォルト値を設定する
			//使用頻度の高い電話を取り出す
			{
// 2022cvt_015
				var H_line;
				A_predata[cnt] = Array();
				A_trend[cnt] = Array();
				A_top[cnt] = Array();

				while (H_line = A_fetch[cnt].predata.fetch(telno)) {
// 2022cvt_015
					var code = H_line.code;
// 2022cvt_015
					var value = H_line.value;
					A_predata[cnt][code] = value;
				}

				if (0 == A_predata[cnt].length) continue;

				while (H_line = A_fetch[cnt].trend.fetch(telno)) {
					code = H_line.code;
// 2022cvt_015
					var key = H_line.key;
					value = H_line.value;
					if (!(undefined !== A_trend[cnt][code])) A_trend[cnt][code] = Array();
					A_trend[cnt][code][key] = value;
				}

				{
					let _tmp_0 = A_fetch[cnt].trend_default;

// 2022cvt_015
					for (let code in _tmp_0) {
// 2022cvt_015
						var H_key = _tmp_0[code];
						if (!(undefined !== A_trend[cnt][code])) A_trend[cnt][code] = Array();

// 2022cvt_015
						for (let key in H_key) {
// 2022cvt_015
							var value = H_key[key];
							if (!(undefined !== A_trend[cnt][code][key])) A_trend[cnt][code][key] = value;
						}
					}
				}

				while (H_line = A_fetch[cnt].top.fetch(telno)) {
// 2022cvt_015
					var totelno = H_line.totelno;
// 2022cvt_015
					var sec = H_line.sec;
					A_top[cnt]["T" + totelno] = sec;
				}
			}

// 2022cvt_015
			var cirid = H_telno.cirid;
// 2022cvt_015
			var disratiotalk = undefined;
			if (undefined !== A_disratiotalk[cirid]) disratiotalk = A_disratiotalk[cirid];
			if (!this.do_execute_sim_prefetch(H_telno, A_predata, A_trend, A_top, memo, disratiotalk)) return false;
		}

		return true;
	}

	do_execute_sim_prefetch(H_telno, A_predata, A_trend, A_top, memo, disratiotalk) //これ以降の処理は派生クラスで行う
	{
		return false;
	}

	calc_basic(H_log, H_ave, H_tgt_plan, disratiobasic) {
// 2022cvt_015
		var ratio = H_ave.predata.predata_disratiobasic;
		if (undefined !== disratiobasic) ratio = disratiobasic;
// 2022cvt_015
		var basic_sum = Math.round(H_tgt_plan.basic * (100 - ratio) / 100);
		this.insert_log(H_log, "basic_sum", 0, basic_sum, "", 1);
		return basic_sum;
	}

	calc_tuwa_sec(H_log, H_ave) //0が一般、1がデジタル通信の秒数
	{
// 2022cvt_015
		var H_sec = [0, 0];

// 2022cvt_015
		for (var key = 0; key < 2; ++key) {
			if (undefined !== H_ave.trend.tuwasec[key]) {
				H_sec[key] = H_ave.trend.tuwasec[key];
			}

			this.insert_log(H_log, "tuwa_sec", key, H_sec[key], "");
		}

		return H_sec;
	}

	calc_tuwa_cnt(H_log, H_ave, H_sec) //0が一般、1がデジタル通信の回数
	{
// 2022cvt_015
		var H_cnt = [0, 0];

// 2022cvt_015
		for (var key = 0; key < 2; ++key) {
			if (undefined !== H_ave.trend.tuwacnt[key]) {
				H_cnt[key] = H_ave.trend.tuwacnt[key];
				this.insert_log(H_log, "tuwa_cnt(comm)", key, H_cnt[key], "");
			} else if (undefined !== H_ave.trend.avetime[key] && H_ave.trend.avetime[key]) //通話回数 := 通話秒数 / 平均通話秒数
				{
// 2022cvt_015
					var ave = H_ave.trend.avetime[key];
					H_cnt[key] = Math.round(H_sec[key] / ave);
					this.insert_log(H_log, "tuwa_cnt(ave)", key, H_cnt[key], "");
				} else if (0 == key) {
				this.insert_log(H_log, "tuwa_cnt(null)", key, H_cnt[key], "");
			} else if (1 == key) //デジタルの回数 := 一般の回数 / 一般の秒数 * デジタルの秒数
				{
					if (H_sec[0]) H_cnt[key] = Math.round(H_cnt[0] / H_sec[0] * H_sec[key]);
					this.insert_log(H_log, "tuwa_cnt(null)", key, H_cnt[key], "");
				}
		}

		return H_cnt;
	}

	calc_touch_sec(H_log, H_ave, H_cur_plan, H_tgt_plan, H_sec, H_cnt) //0が一般、1がデジタル通信の補正後秒数
	{
// 2022cvt_015
		var H_touch = [0, 0];
// 2022cvt_015
		var A_key = {
			0: "chgunit",
			1: "digichgunit"
		};

// 2022cvt_015
		for (var key in A_key) //補正後秒数 := 総通話秒数 - 総通話回数 * (元単位 - 新単位) / 2
		//ただしゼロ未満にはならない
		{
// 2022cvt_015
			var label = A_key[key];
			H_touch[key] = Math.round(H_sec[key] - H_cnt[key] * (H_cur_plan[label] - H_tgt_plan[label]) / 2);
			if (H_touch[key] < 0) H_touch[key] = 0;
			this.insert_log(H_log, "touch_sec", key, H_touch[key], "");
		}

		return H_touch;
	}

	calc_raw_talk(H_log, H_ave, H_tgt_plan, H_touch, is_transparent, mobile_ratio) {
		if (is_transparent) //現プランと同じなので、請求情報の値を用いる
			{
// 2022cvt_015
				var result = 0;
				if (undefined !== H_ave.trend.predata_talk[121]) result = H_ave.trend.predata_talk[121];
				this.insert_log(H_log, "raw_talk", 0, result, "", 1);
				return result;
			} else {
			return this.calc_charge_from_sec(H_log, H_ave, H_tgt_plan, H_touch[0], "charge", "nightcharge", "chargefix", "nightchargefix", "chgunit", "timezone", "ismobile", "charge10", "raw_talk", mobile_ratio);
		}
	}

	calc_comm_digi(H_log, H_ave, H_tgt_plan, H_touch, is_transparent, mobile_ratio) {
		if (is_transparent) //現プランと同じなので、請求情報の値を用いる
			{
// 2022cvt_015
				var result = 0;
				if (undefined !== H_ave.trend.predata_com[147]) result = H_ave.trend.predata_com[147];
				this.insert_log(H_log, "comm_digi", 0, result, "", 1);
				return result;
			} else {
			return this.calc_charge_from_sec(H_log, H_ave, H_tgt_plan, H_touch[1], "digicharge", "nightdigicharge", "digichargefix", "nightdigichargefix", "digichgunit", "timezone_digi", "ismobile_digi", "digicharge10", "comm_digi", mobile_ratio);
		}
	}

	calc_charge_from_sec(H_log, H_ave, H_tgt_plan, touch_sec, key_charge_mobile, key_charge_night_mobile, key_charge_fix, key_charge_night_fix, key_unit, key_timezone, key_ismobile, label_charge, label_result, mobile_ratio) //以下、比率や通話量は[2][2]の配列で扱う。
	//それらの添え字は[固定なら0,携帯なら1][昼間なら0,夜間なら1]とする。
	//通話料を求める
	//昼夜の比率を取り出す
	//昼夜の比率が無ければ、すべて昼間とする
	//キャリア毎に全体の比率を設定しているので、あり得ない
	//相手先の比率が無ければ、すべて携帯とする
	//キャリア毎に全体の比率を設定しているので、あり得ない
	//小数点以下を含む、単位あたり金額
	//無料通話料反映前の通話料
	//:= 切り上げ(↑補正後秒数 / 新単位) * 新単位通話料
	{
// 2022cvt_015
		var A_charge = [[H_tgt_plan[key_charge_fix], H_tgt_plan[key_charge_night_fix]], [H_tgt_plan[key_charge_fix] * (100 - mobile_ratio) / 100 + H_tgt_plan[key_charge_mobile] * mobile_ratio / 100, H_tgt_plan[key_charge_night_fix] * (100 - mobile_ratio) / 100 + H_tgt_plan[key_charge_night_mobile] * mobile_ratio / 100]];
// 2022cvt_015
		var A_ratio_timezone = [0, 0];

// 2022cvt_015
		for (var key = 0; key < 2; ++key) {
			if (undefined !== H_ave.trend[key_timezone][key]) A_ratio_timezone[key] = H_ave.trend[key_timezone][key];
		}

// 2022cvt_015
		var sum_timezone = A_ratio_timezone[0] + A_ratio_timezone[1];
		if (0 == sum_timezone) sum_timezone = A_ratio_timezone[0] = 1;
// 2022cvt_015
		var A_ratio_ismobile = [0, 0];

		for (key = 0; key < 2; ++key) {
			if (undefined !== H_ave.trend[key_ismobile][key]) A_ratio_ismobile[key] = H_ave.trend[key_ismobile][key];
		}

// 2022cvt_015
		var sum_ismobile = A_ratio_ismobile[0] + A_ratio_ismobile[1];
		if (0 == sum_ismobile) sum_ismobile = A_ratio_ismobile[1] = 1;
// 2022cvt_015
		var charge = 0;

// 2022cvt_015
		for (var gcnt = 0; gcnt < 2; ++gcnt) {
// 2022cvt_015
			var charge_timezone = 0;

// 2022cvt_015
			for (var lcnt = 0; lcnt < 2; ++lcnt) {
				charge_timezone += A_charge[gcnt][lcnt] * A_ratio_timezone[lcnt];
			}

			charge_timezone /= sum_timezone;
			charge += charge_timezone * A_ratio_ismobile[gcnt];
		}

		charge /= sum_ismobile;
		this.insert_log(H_log, label_charge, 0, Math.round(charge * 10), "10倍値");
// 2022cvt_015
		var result = 0;
// 2022cvt_015
		var unit = H_tgt_plan[key_unit];

		if (unit) {
			result = Math.round(Math.ceil(touch_sec / unit) * charge);
		}

		this.insert_log(H_log, label_result, 0, result, "", 1);
		return result;
	}

	calc_H_comm(H_log, H_ave, H_tgt_packet, is_transparent) //trendは、sim_trend_X_tbのcodeがpacketcntのkey
	//tgtは、返値のキー
	//predataは、sim_trend_X_tbのpredataのkey(同プラン・パケットの時のみ)
	{
// 2022cvt_015
		var H_comm = Array();
// 2022cvt_015
		var A_keys = [{
			trend: 10,
			tgt: "mode",
			predata: [140, 141, 142, 143]
		}, {
			trend: 20,
			tgt: "browse",
			predata: [144]
		}, {
			trend: 30,
			tgt: "other",
			predata: [145]
		}];

// 2022cvt_015
		for (var H_key of Object.values(A_keys)) //パケット数
		//パケット数を取り出す
		//同プランなら、請求情報の金額を用いる
		{
// 2022cvt_015
			var src = H_key.trend;
// 2022cvt_015
			var tgt = H_key.tgt;
// 2022cvt_015
			var packetcnt = 0;
			if (undefined !== H_ave.trend.packetcnt[src]) packetcnt = H_ave.trend.packetcnt[src];
// 2022cvt_015
			var charge = H_tgt_packet["charge_" + tgt];
			H_comm[tgt] = Math.round(packetcnt * charge);
			this.insert_log(H_log, "packetcnt_" + tgt, 0, packetcnt, "");

			if (is_transparent) {
				H_comm[tgt] = 0;

// 2022cvt_015
				for (var key of Object.values(H_key.predata)) {
					if (undefined !== H_ave.trend.predata_com[key]) H_comm[tgt] += H_ave.trend.predata_com[key];
				}
			}

			this.insert_log(H_log, "comm_" + tgt, 0, H_comm[tgt], "", 1);
		}

		return H_comm;
	}

	calc_H_comm_from_plan(H_log, H_ave, H_tgt_plan, is_transparent) //trendは、sim_trend_X_tbのcodeがpacketcntのkey
	//tgtは、返値のキー
	//predataは、sim_trend_X_tbのpredataのkey(同プラン・パケットの時のみ)
	{
// 2022cvt_015
		var H_comm = Array();
// 2022cvt_015
		var A_keys = [{
			trend: 10,
			tgt: "mode",
			predata: [140, 141, 142, 143]
		}, {
			trend: 20,
			tgt: "browse",
			predata: [144]
		}, {
			trend: 30,
			tgt: "other",
			predata: [145]
		}];

// 2022cvt_015
		for (var H_key of Object.values(A_keys)) //パケット数
		//パケット数を取り出す
		//同プランなら、請求情報の金額を用いる
		{
// 2022cvt_015
			var src = H_key.trend;
// 2022cvt_015
			var tgt = H_key.tgt;
// 2022cvt_015
			var packetcnt = 0;
			if (undefined !== H_ave.trend.packetcnt[src]) packetcnt = H_ave.trend.packetcnt[src];
// 2022cvt_015
			var charge = H_tgt_plan["charge_" + tgt];
			H_comm[tgt] = Math.round(packetcnt * charge);
			this.insert_log(H_log, "packetcnt_" + tgt, 0, packetcnt, "");

			if (is_transparent) {
				H_comm[tgt] = 0;

// 2022cvt_015
				for (var key of Object.values(H_key.predata)) {
					if (undefined !== H_ave.trend.predata_com[key]) H_comm[tgt] += H_ave.trend.predata_com[key];
				}
			}

			this.insert_log(H_log, "comm_" + tgt, 0, H_comm[tgt], "", 1);
		}

		return H_comm;
	}

	calc_talk_abroad(H_log, H_ave) {
// 2022cvt_015
		var talk_abroad = 0;
// 2022cvt_015
		var A_key = [122];

// 2022cvt_015
		for (var key of Object.values(A_key)) if (undefined !== H_ave.trend.predata_talk[key]) talk_abroad += H_ave.trend.predata_talk[key];

		talk_abroad = Math.round(talk_abroad);
		this.insert_log(H_log, "talk_abroad", 0, talk_abroad, "", 1);
		return talk_abroad;
	}

	calc_talk_other(H_log, H_ave) {
// 2022cvt_015
		var talk_other = 0;
// 2022cvt_015
		var A_key = [123];

// 2022cvt_015
		for (var key of Object.values(A_key)) if (undefined !== H_ave.trend.predata_talk[key]) talk_other += H_ave.trend.predata_talk[key];

		talk_other = Math.round(talk_other);
		this.insert_log(H_log, "talk_other", 0, talk_other, "", 1);
		return talk_other;
	}

	calc_comm_other(H_log, H_ave) //国際デジタル通信・国際パケット通信の料金を加算する
	{
// 2022cvt_015
		var comm_other = 0;
// 2022cvt_015
		var A_key = [146, 148];

// 2022cvt_015
		for (var key of Object.values(A_key)) if (undefined !== H_ave.trend.predata_com[key]) comm_other += H_ave.trend.predata_com[key];

		comm_other = Math.round(comm_other);
		this.insert_log(H_log, "comm_other_other", 0, comm_other, "", 1);
		return comm_other;
	}

	calc_result(H_recom, H_telno, H_ave, H_plan, H_packet, minkey, curkey, H_all_charge) //削減前の値を集計する
	//削減前平均支払額 := 削減前基本料 + 削減前通話通信料 + 削減前その他
	//削減額がマイナスなら、元のプランを使用する
	//削減額などを求める
	//使用頻度の高い電話
	{
// 2022cvt_015
		var mincharge = H_all_charge[minkey].charge;
// 2022cvt_015
		var minbasic = H_all_charge[minkey].basic;
// 2022cvt_015
		var mintalkcomm = H_all_charge[minkey].talkcomm;
// 2022cvt_015
		var minother = H_all_charge[minkey].othersum;
// 2022cvt_015
		var H_keys = {
			basicbefore: ["predata_basic", "predata_disbasic"],
			tuwabefore: ["predata_talk", "predata_distalk", "predata_com", "predata_discom", "predata_disother", "predata_fix"],
			etcbefore: ["predata_other"]
		};

// 2022cvt_015
		for (var tgt in H_keys) {
// 2022cvt_015
			var A_src = H_keys[tgt];
			H_recom[tgt] = 0;

// 2022cvt_015
			for (var src of A_src) H_recom[tgt] += H_ave.predata[src];

			H_recom[tgt] = Math.round(H_recom[tgt]);
		}

		H_recom.avecharge = Math.round(H_recom.basicbefore + H_recom.tuwabefore + H_recom.etcbefore);
		if (H_recom.avecharge <= mincharge) minkey = curkey;

		if (minkey.indexOf(",")) {
// 2022cvt_015
			var A_minkey = minkey.split(",");
// 2022cvt_015
			var minplan = A_minkey[0];
// 2022cvt_015
			var minpacket = A_minkey[1];
			H_recom.recomplan = A_minkey[0];
			if (minpacket.length) H_recom.recompacket = A_minkey[1];else H_recom.recompacket = undefined;
		} else {
			H_recom.recomplan = minkey;
			H_recom.recompacket = undefined;
		}

		if (minkey == curkey) //削減前と削減後のプランが等しい場合は、
			//削減額 := ゼロ
			//削減後基本料・通話通信料・その他 := それぞれ削減前の値
			{
				H_recom.diffcharge = 0;
				H_recom.basicafter = H_recom.basicbefore;
				H_recom.tuwaafter = H_recom.tuwabefore;
				H_recom.etcafter = H_recom.etcbefore;
			} else //元のプランを取り出す
			//削減後通話通信料 := おすすめ通話通信料
			//削減後その他 := おすすめその他
			//削減額 := 支払総額 - 後基本料 - 後通話通信料 - 後その他
			{
// 2022cvt_015
				var curplan = curkey;

				if (curkey.indexOf(",")) {
// 2022cvt_015
					var A_curkey = curkey.split(",");
					curplan = A_curkey[0];
				}

				if (H_recom.recomplan == curplan) //元のプランと同じなら、削減後基本料:=削減前基本料
					{
						H_recom.basicafter = H_recom.basicbefore;
					} else //でなければ、削減後基本料 := おすすめ基本料
					{
						H_recom.basicafter = Math.round(minbasic);
					}

				H_recom.tuwaafter = Math.round(mintalkcomm);
				H_recom.etcafter = Math.round(minother);
				H_recom.diffcharge = Math.round(H_recom.avecharge - H_recom.basicafter - H_recom.tuwaafter - H_recom.etcafter);

				if (H_recom.diffcharge < 0) //削減額がマイナスの場合は、削減額をゼロにする。
					//その場合の差額の調整は、まず通話料を削減し、
					//それでも差額がある場合は基本料を削減し、
					//最後にその他を削減する。
					//のこり調整額
					{
// 2022cvt_015
						var remain = -H_recom.diffcharge;
						H_recom.diffcharge = 0;
// 2022cvt_015
						var keys = ["tuwaafter", "basicafter", "etcafter"];

// 2022cvt_015
						for (var key of Object.values(keys)) {
							if (remain <= 0) break;

							if (remain < H_recom[key]) {
								H_recom[key] -= remain;
								remain = 0;
							} else if (0 < H_recom[key]) {
								remain -= H_recom[key];
								H_recom[key] = 0;
							}
						}
					}
			}

// 2022cvt_015
		var cnt = 1;
		{
			let _tmp_1 = H_ave.top;

// 2022cvt_015
			for (var totelno in _tmp_1) {
// 2022cvt_015
				var sec = _tmp_1[totelno];
// 2022cvt_015
				var totelno = totelno.substr(1);
				H_recom["reyuyutel" + cnt] = totelno;
				++cnt;
				if (5 < cnt) break;
			}
		}
	}

	get_min_key(H_telno, H_all_charge) //もっとも安いプランID,もっとも安いパケットID
	//同支払額
	{
// 2022cvt_015
		var minkey = "";
// 2022cvt_015
		var mincharge = 0;

// 2022cvt_015
		for (var key in H_all_charge) {
// 2022cvt_015
			var H_charge = H_all_charge[key];

			if (0 == minkey.length || H_charge.charge < mincharge && 0 < H_charge.charge) {
				minkey = key;
				mincharge = H_charge.charge;
			}
		}

		if (0 == minkey.length) //現行のプランをおすすめとする
			{
				this.putError(G_SCRIPT_INFO, "有効プラン・パケット存在せず" + H_telno.telno);
				minkey = H_telno.planid + ",";
				if (undefined !== H_telno.packetid) minkey = minkey + H_telno.packetid;
				H_all_charge[minkey] = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};
			}

		if (this.m_assert) this.putError(G_SCRIPT_DEBUG, H_telno.telno + `最安値確定minkey=${minkey}/mincharge=${mincharge}/`);
		return minkey;
	}

	get_min_key_plan(minkey) {
		if (minkey.indexOf(",")) {
// 2022cvt_015
			var A_minkey = minkey.split(",");
			return A_minkey[0];
		}

		return minkey;
	}

	get_min_key_packet(minkey) {
		if (minkey.indexOf(",")) {
// 2022cvt_015
			var A_minkey = minkey.split(",");
			return A_minkey[1];
		}

		return undefined;
	}

	get_cur_plan(planid) {
		if (undefined !== this.m_H_cur_plan[planid]) return this.m_H_cur_plan[planid];
		return {
			planid: planid,
			chgunit: 0,
			digichgunit: 0
		};
	}

	getSQLTelno(pactid, table_no, A_telno, A_skip) //ホットラインか
	//FROM節(tel_X_tb <- tel_tb <- plan_tb <- packet_tb <- sim_trend_X_tb
	//ただし、ホットラインの場合はtel_X_tb <- tel_X_tb ...
	//WHERE節
	//一件でもあれば良しとする
	//packetがNULLでもシミュレーションの対象とする
	//ORDER節
	{
// 2022cvt_015
		var is_hotline = false;
// 2022cvt_016
// 2022cvt_015
		var sql = "select coalesce(type,'') from pact_tb";
		sql += " where pactid=" + pactid;
		sql += ";";
// 2022cvt_015
		var result = this.m_db.getAll(sql);
// 2022cvt_022
		if (1 == result.length && 0 == result[0][0].localeCompare("H")) is_hotline = true;
		sql = "select tel_tb.telno as telno";
		sql += ",tel_tb.planid as planid";
		sql += ",tel_tb.packetid as packetid";
		sql += ",tel_tb.arid as arid";
		sql += ",tel_tb.cirid as cirid";
		sql += " from tel_" + table_no + "_tb as tel_tb";
		if (is_hotline) sql += " left join tel_" + table_no + "_tb as alert_tb";else sql += " left join tel_tb as alert_tb";
		sql += " on tel_tb.carid=alert_tb.carid";
		sql += " and tel_tb.telno=alert_tb.telno";
		sql += " and tel_tb.pactid=alert_tb.pactid";
		sql += " left join plan_tb";
		sql += " on tel_tb.planid=plan_tb.planid";
		sql += " left join packet_tb";
		sql += " on tel_tb.packetid=packet_tb.packetid";
		sql += " left join (";
		sql += " select pactid,carid,telno,count(*) as count";
		sql += " from sim_trend_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + this.m_carid;
		sql += " and code like 'predata_%'";
		sql += " group by pactid,carid,telno";
		sql += " order by telno";
		sql += ") as details_tb";
		sql += " on tel_tb.carid=details_tb.carid";
		sql += " and tel_tb.telno=details_tb.telno";
		sql += " and tel_tb.pactid=details_tb.pactid";
		sql += " left join tel_tb as excise_tb";
		sql += " on tel_tb.carid=excise_tb.carid";
		sql += " and tel_tb.telno=excise_tb.telno";
		sql += " and tel_tb.pactid=excise_tb.pactid";
		sql += " where tel_tb.pactid=" + this.escape(pactid);
		sql += " and tel_tb.carid=" + this.escape(this.m_carid);
		sql += " and details_tb.count>0";
		sql += " and plan_tb.simbefore=true";
		sql += " and coalesce(packet_tb.simbefore,true)=true";

		if (!is_hotline) {
			sql += " and (alert_tb.planalert is null" + " or alert_tb.planalert!='1')";
			sql += " and (alert_tb.packetalert is null" + " or alert_tb.packetalert!='1')";
		}

		sql += " and (excise_tb.exceptflg is null or excise_tb.exceptflg=false)";
		sql += this.getSQLWhereTelno("tel_tb", "telno", A_telno, A_skip);
		sql += " and tel_tb.cirid in(" + this.m_A_cirid.join(",") + ")";
		sql += " order by tel_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLPredata(pactid, table_no, A_telno, A_skip) //codeがpredata_で始まるものだけ
	{
// 2022cvt_015
		var sql = "select telno,code,sum(value) as value";
		sql += " from sim_trend_" + table_no + "_tb as trend_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(this.m_carid);
		sql += " and code like 'predata_%'";
		sql += this.getSQLWhereTelno("", "telno", A_telno, A_skip);
		sql += " group by telno,code";
		sql += " order by telno,code";
		sql += ";";
		return sql;
	}

	getSQLTrend(pactid, table_no, A_telno, A_skip) //predataもそれ以外も抽出する
	{
// 2022cvt_015
		var sql = "select telno,code,key,value";
		sql += " from sim_trend_" + table_no + "_tb as trend_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(this.m_carid);
		sql += this.getSQLWhereTelno("", "telno", A_telno, A_skip);
		sql += " order by telno,code,key";
		sql += ";";
		return sql;
	}

	getSQLTop(pactid, table_no, A_telno, A_skip) {
// 2022cvt_015
		var ignore = false;

		if (12 < table_no) {
			table_no -= 12;
			ignore = true;
		}

		while (table_no.length < 2) table_no = "0" + table_no;

// 2022cvt_015
		var sql = "select telno,totelno,sum(sec) as sec";
		sql += " from sim_top_telno_" + table_no + "_tb as top_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(this.m_carid);
		sql += this.getSQLWhereTelno("", "telno", A_telno, A_skip);
		if (ignore) sql += " and true=false";
		sql += " group by telno,totelno";
		sql += " order by telno,totelno";
		sql += ";";
		return sql;
	}

	getSQLWhereTelno(table_name, key, A_telno, A_skip) {
// 2022cvt_015
		var sql = "";
// 2022cvt_015
		var A_src = [[A_telno, ""], [A_skip, "not"]];

// 2022cvt_015
		for (var pair of Object.values(A_src)) {
			if (0 == pair[0].length) continue;
			sql += " and " + table_name;
			if (table_name.length) sql += ".";
			sql += key;
			sql += " " + pair[1] + " in(";
// 2022cvt_015
			var comma = false;

// 2022cvt_015
			for (var telno of Object.values(pair[0])) {
				if (comma) sql += ",";
				comma = true;
				sql += "'" + this.escape(telno) + "'";
			}

			sql += ")";
		}

		return sql;
	}

	calcAve(H_ave, A_predata, A_trend, A_top, length) //predataのデータのあった月数
	//統計情報のあった月数
	//使用頻度の高い電話のあった月数
	//期間の合計を求める
	//期間で割る
	{
		H_ave = {
			trend: Array(),
			top: Array(),
			predata: Array()
		};
// 2022cvt_015
		var diff_predata = 0;
// 2022cvt_015
		var diff_trend = 0;
// 2022cvt_015
		var diff_top = 0;

// 2022cvt_015
		for (var cnt = 0; cnt < length; ++cnt) //通話料割引率など
		//統計情報
		//使用頻度の高い電話
		{
			if (A_predata[cnt].length) ++diff_predata;
			{
				let _tmp_2 = A_predata[cnt];

// 2022cvt_015
				for (var code in _tmp_2) {
// 2022cvt_015
					var value = _tmp_2[code];
					if (!(undefined !== H_ave.predata[code])) H_ave.predata[code] = 0;
					H_ave.predata[code] += value;
				}
			}
			if (A_trend[cnt].length) ++diff_trend;
			{
				let _tmp_3 = A_trend[cnt];

// 2022cvt_015
				for (var code in _tmp_3) {
// 2022cvt_015
					var H_key = _tmp_3[code];
					if (!(undefined !== H_ave.trend[code])) H_ave.trend[code] = Array();

// 2022cvt_015
					for (var key in H_key) {
// 2022cvt_015
						var value = H_key[key];
						if (!(undefined !== H_ave.trend[code][key])) H_ave.trend[code][key] = 0;
						H_ave.trend[code][key] = H_ave.trend[code][key] + value;
					}
				}
			}
			if (A_top[cnt].length) ++diff_top;
			{
				let _tmp_4 = A_top[cnt];

// 2022cvt_015
				for (var totelno in _tmp_4) {
// 2022cvt_015
					var sec = _tmp_4[totelno];
					if (!(undefined !== H_ave.top[totelno])) H_ave.top[totelno] = 0;
					H_ave.top[totelno] += sec;
				}
			}
		}

		if (diff_predata) {
// 2022cvt_015
			var temp = Array();
			{
				let _tmp_5 = H_ave.predata;

// 2022cvt_015
				for (var code in _tmp_5) {
// 2022cvt_015
					var value = _tmp_5[code];
					temp[code] = Math.round(value / diff_predata);
				}
			}
			H_ave.predata = temp;
		}

		if (diff_trend) {
			temp = Array();
			{
				let _tmp_6 = H_ave.trend;

// 2022cvt_015
				for (var code in _tmp_6) {
// 2022cvt_015
					var H_key = _tmp_6[code];
					if (!(undefined !== temp[code])) temp[code] = Array();

// 2022cvt_015
					for (var key in H_key) {
// 2022cvt_015
						var value = H_key[key];
						temp[code][key] = Math.round(value / diff_trend);
					}
				}
			}
			H_ave.trend = temp;
		}

		if (diff_top) //使用頻度の高い電話の上位を抜き出す
			{
				temp = Array();
				{
					let _tmp_7 = H_ave.top;

// 2022cvt_015
					for (var totelno in _tmp_7) {
// 2022cvt_015
						var sec = _tmp_7[totelno];
						temp[totelno] = Math.round(sec / diff_top);
					}
				}
				temp.sort();
				// reset(temp);
				temp[0];
				H_ave.top = Array();
				cnt = 0;

// 2022cvt_015
				for (var totelno in temp) {
// 2022cvt_015
					var sec = temp[totelno];
					if (5 <= cnt) break;
					++cnt;
					H_ave.top[totelno] = sec;
				}
			}

// 2022cvt_015
		var A_key = this.m_A_predata_disratio;

// 2022cvt_015
		for (var key of Object.values(A_key)) if (undefined !== A_predata[0][key]) H_ave.predata[key] = A_predata[0][key];

		A_key = this.m_A_predata_required;

// 2022cvt_015
		for (var key of Object.values(A_key)) if (!(undefined !== H_ave.predata[key])) H_ave.predata[key] = 0;

		{
			let _tmp_8 = this.m_H_ave_trend_default;

// 2022cvt_015
			for (var code in _tmp_8) {
// 2022cvt_015
				var H_code = _tmp_8[code];
				if (!(undefined !== H_ave.trend[code])) H_ave.trend[code] = H_code;
			}
		}
		return true;
	}

	insert_log(H_log, code, key, value, memo, level = 2) //planid,packetidが存在しなければ-1を設定しておく
	{
		if (this.m_assert < level) return;
		H_log.code = code;
		H_log.key = key;
		H_log.value = Math.round(value);
		H_log.memo = memo;
		if (!(undefined !== H_log.planid) || 0 == H_log.planid.length) H_log.planid = -1;
		if (!(undefined !== H_log.packetid) || 0 == H_log.packetid.length) H_log.packetid = -1;
		if (!this.m_O_inserter_log.insert(H_log)) this.putError(G_SCRIPT_ERROR, "inserter_log->insert失敗" + H_log.telno);
	}

	insert_log_ave(H_log, H_ave, level = 2) {
		{
			let _tmp_9 = H_ave.predata;

// 2022cvt_015
			for (var code in _tmp_9) {
// 2022cvt_015
				var value = _tmp_9[code];
				this.insert_log(H_log, code, 0, value, "ave_preadata", level);
			}
		}
		{
			let _tmp_10 = H_ave.trend;

// 2022cvt_015
			for (var code in _tmp_10) {
// 2022cvt_015
				var H_key = _tmp_10[code];

// 2022cvt_015
				for (var key in H_key) {
// 2022cvt_015
					var value = H_key[key];
					this.insert_log(H_log, code, key, value, "ave_trend", level);
				}
			}
		}
		{
			let _tmp_11 = H_ave.top;

// 2022cvt_015
			for (var telno in _tmp_11) {
// 2022cvt_015
				var sec = _tmp_11[telno];
				this.insert_log(H_log, telno, 0, sec, "ave_top", level);
			}
		}
	}

};
