//===========================================================================
//機能：trend_X_tbからplan_recom_tbを作る(AU専用)
//
//作成：森原
//===========================================================================
//携帯通話のうち、自社携帯への通話の比率
//---------------------------------------------------------------------------
//機能：trend_X_tbからplan_recom_tbを作る(AU専用)

import { G_AU_SIM_DAYTIME_RATIO, G_CARRIER_AU, G_CIRCUIT_AU_CDMA, G_CIRCUIT_AU_WIN, G_SIMWAY_AU_DATA } from "./script_common";
import { TableInserter } from "./script_db";
import { G_SCRIPT_DEBUG, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING } from "./script_log";
import UpdateRecomBase from "./update_recom_base";

// 2022cvt_026
// require("update_recom_base.php");

const MOBILE_RATIO_AU = 50;

//回線種別=>地域会社=>パケットパック無しのIDの配列
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//plan_recom_tbへのデータ挿入型
//sim_log_tbへのデータ挿入型
//処理する回線種別の配列(空ならCDMAとWIN両方)
//シミュレーション期間(1,3,6,12)
//追加ログを出力するならtrue
//-----------------------------------------------------------------------
//以下protected
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
//機能：WINのシミュレーションを行う
//引数：電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//平均値(内容はcalcAveのコメント参照)
//現在の回線種別・地域会社のプランマスター
//現在の回線種別・地域会社のパケットマスター
//現在の回線種別・地域会社のパケットパックなしのID
//plan_recom_tbに挿入する値
//sim_log_tbに挿入する値
//sim_log_tbに保存するメッセージ
//顧客全体の通話料割引率(無効ならnull)
//返値：深刻なエラーが発生したらfalseを返す
//機能：WINの特定のプラン・パケットの組み合わせの金額を求める
//引数：{charge,basic,talkcomm,othersum}を返す
//電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//sim_log_tbに格納する値
//平均値(内容はcalcAveのコメント参照)
//現在のプラン情報
//目的のプラン情報
//目的のパケット情報
//現在の回線種別・地域会社のパケットパックなしのID
//sim_log_tbに保存するメッセージ
//顧客全体の通話料割引率(無効ならnull)
//現プランと同じならtrue
//現パケットと同じならtrue
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：1Xのシミュレーションを行う
//引数：電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//平均値(内容はcalcAveのコメント参照)
//現在の回線種別・地域会社のプランマスター
//現在の回線種別・地域会社のパケットマスター
//現在の回線種別・地域会社のパケットパックなしのID
//plan_recom_tbに挿入する値
//sim_log_tbに挿入する値
//sim_log_tbに保存するメッセージ
//顧客全体の通話料割引率(無効ならnull)
//返値：深刻なエラーが発生したらfalseを返す
//機能：1Xの特定のプラン・パケットの組み合わせの金額を求める
//引数：{charge,basic,talkcomm,othersum}を返す
//電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//sim_log_tbに格納する値
//平均値(内容はcalcAveのコメント参照)
//現在のプラン情報
//目的のプラン情報
//目的のパケット情報
//現在の回線種別・地域会社のパケットパックなしのID
//sim_log_tbに保存するメッセージ
//顧客全体の通話料割引率(無効ならnull)
//現プランと同じならtrue
//現パケットと同じならtrue
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：データ専用プランのシミュレーションを行う
//引数：電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//平均値(内容はcalcAveのコメント参照)
//現在の回線種別・地域会社のプランマスター
//現在の回線種別・地域会社のパケットマスター
//現在の回線種別・地域会社のパケットパックなしのID
//plan_recom_tbに挿入する値
//sim_log_tbに挿入する値
//sim_log_tbに保存するメッセージ
//顧客全体の通話料割引率(無効ならnull)
//返値：深刻なエラーが発生したらfalseを返す
//機能：DATAの特定のプラン・パケットの組み合わせの金額を求める
//引数：{charge,basic,talkcomm,othersum}を返す
//電話番号・現行プランIDなどの情報(内容はdo_execute_simのコメント参照)
//sim_log_tbに格納する値
//平均値(内容はcalcAveのコメント参照)
//現在のプラン情報
//目的のプラン情報
//sim_log_tbに保存するメッセージ
//顧客全体の通話料割引率(無効ならnull)
//現プランと同じならtrue
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：通話通信料を求める(パケットパック無し)
//引数：sim_log_tbに挿入する値
//平均値
//新プラン
//通話料
//通信料
//顧客単位の通話通信料割引率
//機能：通話通信料を求める(パケットパックあり)
//引数：sim_log_tbに挿入する値
//平均値
//新プラン
//新パケット
//通話料
//通信料
//顧客単位の通話通信料割引率
export default class UpdateRecomAU extends UpdateRecomBase {
	m_H_ave_trend_default: any;
	m_H_packet_zero: any[];
	m_A_cirid: any;
	m_carid: string | undefined;
	m_db: any;
	m_H_packet: any;
	putError: any;
	m_A_monthcnt: any;
	calcAve: any;
	m_A_predata_disratio: any;
	insert_log_ave: any;
	insert_log: any;
	m_H_cur_plan: any;
	get_cur_plan: any;
	calc_result: any;
	m_O_inserter_recom: any;
	calc_comm_digi: any;
	get_min_key: any;
	get_min_key_plan: any;
	calc_basic: any;
	calc_tuwa_sec: any;
	calc_tuwa_cnt: any;
	calc_touch_sec: any;
	calc_raw_talk: any;
	calc_H_comm_from_plan: any;
	calc_talk_other: any;
	calc_talk_abroad: any;
	calc_comm_other: any;
	m_H_plan: any;
	get_min_key_packet: any;
	calc_H_comm: any;
	constructor(listener: any, db: any, table_no: any, inserter_recom: TableInserter, inserter_log: TableInserter, A_cirid: string | any[], A_monthcnt: string | any[], assert: number) //統計情報平均値のデフォルト値
	//パケットパック無しを取り出す
	//パケットパック無しがすべてそろっているか確認する
	{
		if (0 == A_cirid.length) A_cirid = [G_CIRCUIT_AU_CDMA, G_CIRCUIT_AU_WIN];
		if (0 == A_monthcnt.length) A_monthcnt = [1, 3, 6, 12];
		super(listener, db, table_no, inserter_recom, inserter_log, A_cirid, A_monthcnt, assert, G_CARRIER_AU);
		this.m_H_ave_trend_default = {
			timezone: {
				0: Math.round(G_AU_SIM_DAYTIME_RATIO),
				1: Math.round(100 - G_AU_SIM_DAYTIME_RATIO)
			},
			timezone_digi: {
				0: Math.round(G_AU_SIM_DAYTIME_RATIO),
				1: Math.round(100 - G_AU_SIM_DAYTIME_RATIO)
			},
			ismobile: {
				0: 50,
				1: 50
			},
			avetime: {
				0: Math.round(300),
				1: Math.round(300)
			},
			packetratio: {
				10: Math.round(50),
				12: Math.round(50),
				13: Math.round(0)
			}
		};
		this.m_H_packet_zero = Array();
// 2022cvt_015
		var sql = "select * from packet_tb where carid=" + this.m_carid;
		sql += " and cirid in (" + this.m_A_cirid.join(",") + ")";
		sql += " and simafter=true";
		sql += " and packetid<=3000";
		sql += " and (packetname='パケットなし')";
		sql += ";";
// 2022cvt_015
		var result = this.m_db.getHash(sql);

// 2022cvt_015
		for (var H_line of result) {
// 2022cvt_015
			var cirid = H_line.cirid;
// 2022cvt_015
			var arid = H_line.arid;
// 2022cvt_015
			var packetid = H_line.packetid;
			if (!(undefined !== this.m_H_packet_zero[cirid])) this.m_H_packet_zero[cirid] = Array();
			this.m_H_packet_zero[cirid][arid] = packetid;
		}

		{
			let _tmp_0 = this.m_H_packet;

// 2022cvt_015
			for (let cirid in _tmp_0) {
// 2022cvt_015
				var H_arid = _tmp_0[cirid];

// 2022cvt_015
				for (let arid in H_arid) {
// 2022cvt_015
					var A_packet = H_arid[arid];

					if (!(undefined !== this.m_H_packet_zero[cirid]) || !(undefined !== this.m_H_packet_zero[cirid][arid]) || 0 == this.m_H_packet_zero[cirid][arid].length) {
						this.putError(G_SCRIPT_WARNING, `パケットパックなしが存在しない/${cirid}/${arid}`);
					}
				}
			}
		}
	}

	do_execute_sim_prefetch(H_telno, A_predata, A_trend, A_top, memo, disratiotalk) //この回線種別・地域会社のプランマスターを取得する
	//1,3,6,12ヶ月のシミュレーションを行う
	{
// 2022cvt_015
		var telno = H_telno.telno;
// 2022cvt_015
		var arid = H_telno.arid;
// 2022cvt_015
		var cirid = H_telno.cirid;
// 2022cvt_015
		var planid = H_telno.planid;
// 2022cvt_015
		var packetid = H_telno.packetid;
// 2022cvt_015
		var H_plan = Array();
		if (undefined !== this.m_H_plan[cirid]) if (undefined !== this.m_H_plan[cirid][arid]) H_plan = this.m_H_plan[cirid][arid];

		if (0 == H_plan.length) {
			this.putError(G_SCRIPT_INFO, "プランマスター存在せず" + `${telno}/${cirid}/${arid}`);
			return true;
		}

		if (!(undefined !== this.m_H_cur_plan[planid])) {
			this.putError(G_SCRIPT_INFO, "現行プラン存在せず" + `${telno}/${cirid}/${arid}/${planid}`);
			return true;
		}

// 2022cvt_015
		var H_packet = Array();
		if (undefined !== this.m_H_packet[cirid]) if (undefined !== this.m_H_packet[cirid][arid]) H_packet = this.m_H_packet[cirid][arid];

		if (0 == H_packet.length) {
			this.putError(G_SCRIPT_INFO, "パケットマスター存在せず" + `${telno}/${cirid}/${arid}`);
			return true;
		}

// 2022cvt_015
		var packet_zero = undefined;
		if (undefined !== this.m_H_packet_zero[cirid]) if (undefined !== this.m_H_packet_zero[cirid][arid]) packet_zero = this.m_H_packet_zero[cirid][arid];

		if (!(undefined !== H_packet[packetid])) {
			if (!(undefined !== packet_zero)) {
				this.putError(G_SCRIPT_INFO, "が100を超えたので処理せず" + `${telno}/${cirid}/${arid}/${packetid}`);
				return true;
			}

			packetid = packet_zero;
			H_telno.packetid = packetid;
		}

// 2022cvt_015
		var H_recom: any = {
			telno: H_telno.telno,
			arid: H_telno.arid,
			mode: "000",
			flags: "0"
		};

// 2022cvt_015
		for (var length of Object.values(this.m_A_monthcnt)) //Nヶ月の平均を求める
		//この時点でH_recomに値がないのは以下の通り
		//basicbefore,tuwabefore,etcbefore
		//basicafter,tuwaafter,etcafter,
		//avecharge,diffcharge
		//recomplan,recompacket
		//reyuyutel1,2,3,4,5
		//sim_log_tbに挿入する値の共通部分
		//この時点でH_logに値が無いのは以下の通り
		//planid, packetid
		//code, key, value, memo
		//データ専用・WIN・1xに応じて分岐する
		{
			H_recom.monthcnt = length;
// 2022cvt_015
			var H_ave: any = Array();
			if (!this.calcAve(H_ave, A_predata, A_trend, A_top, length)) return false;
// 2022cvt_015
			var A_key = this.m_A_predata_disratio;

// 2022cvt_015
			for (var key of A_key) {
				if (100 < H_ave.predata[key]) {
					this.putError(G_SCRIPT_INFO, key + "が100を超えたので処理せず" + H_telno.telno);
					return true;
				}
			}

// 2022cvt_015
			var H_log = {
				monthcnt: length,
				telno: H_telno.telno
			};
			this.insert_log_ave(H_log, H_ave);
			if (undefined !== disratiotalk) this.insert_log(H_log, "disratiopact", 0, disratiotalk, "", 1);else this.insert_log(H_log, "disratiopact", 0, -1, "存在せず", 1);

// 2022cvt_022
			if (!this.m_H_cur_plan[planid].simway.localeCompare(G_SIMWAY_AU_DATA)) //データ専用プランである
				{
					if (!this.do_execute_data(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk)) return false;
// 2022cvt_022
				} else if (!H_telno.cirid.localeCompare(G_CIRCUIT_AU_CDMA, )) //1xである
				{
					if (!this.do_execute_1x(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk)) return false;
// 2022cvt_022
				} else if (!H_telno.cirid.localeCompare(G_CIRCUIT_AU_WIN)) //WINである
				{
					if (!this.do_execute_win(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk)) return false;
				}
		}

		return true;
	}

	do_execute_win(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk) //全プランに対してループする
	//planid,packetid -> 価格情報
	//もっとも安いプランとパケットパックを選択する
	//現行のプラン・パケットのどちらかが、おすすめと同一かどうか検査する
	//DBに挿入する
	{
// 2022cvt_015
		var H_cur_plan = this.get_cur_plan(H_telno.planid);
// 2022cvt_015
		var H_all_charge = Array();

// 2022cvt_015
		for (var planid in H_plan) //データ用プランは対象としない
		//全パケットに対してループする
		{
// 2022cvt_015
			var H_planinfo = H_plan[planid];
// 2022cvt_022
			if (!H_planinfo.simway.localeCompare(G_SIMWAY_AU_DATA)) continue;
			H_log.planid = planid;

// 2022cvt_015
			for (var packetid in H_packet) //適用可能なプラン・パケットで無ければスキップする
			{
// 2022cvt_015
				var H_packetinfo = H_packet[packetid];
				if (H_planinfo.packet.length && !(-1 !== H_planinfo.packet.indexOf(packetid))) continue;
				H_log.packetid = packetid;
// 2022cvt_015
				var H_charge = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};

				if (!this.do_execute_win_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, H_packetinfo, packet_zero, memo, disratiotalk, false, false)) {
					this.putError(G_SCRIPT_WARNING, `WIN計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}
		}

// 2022cvt_015
		var minkey = this.get_min_key(H_telno, H_all_charge);
// 2022cvt_015
		var minkey_plan = this.get_min_key_plan(minkey);
// 2022cvt_015
		var minkey_packet = this.get_min_key_packet(minkey);

		if (minkey_plan == H_telno.planid || minkey_packet == H_telno.packetid) //同一なので、そのプラン・パケットでシミュレーションをやり直す
			{
// 2022cvt_015
				var planid: string = minkey_plan;
// 2022cvt_015
				var H_planinfo = H_plan[planid];
				H_log.planid = -planid;
// 2022cvt_015
				var packetid: string = minkey_packet;
// 2022cvt_015
				var H_packetinfo = H_packet[packetid];
				H_log.packetid = -packetid;
				H_charge = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};
				this.putError(G_SCRIPT_DEBUG, "同一条件で再実行/" + H_telno.telno + "/" + planid + "/" + packetid);
				this.insert_log(H_log, "recalc", 0, 0, "", 1);

				if (!this.do_execute_win_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, H_packetinfo, packet_zero, memo + "/recalc", disratiotalk, H_telno.planid == planid, H_telno.packetid == packetid)) {
					this.putError(G_SCRIPT_WARNING, `WIN計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}

// 2022cvt_015
		var curkey = H_telno.planid + "," + H_telno.packetid;
		var minplan: string= "";
		this.calc_result(H_recom, H_telno, H_ave, H_plan, H_packet, minkey, curkey, H_all_charge);

		if (!this.m_O_inserter_recom.insert(H_recom)) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->insert失敗" + H_telno.telno + "/" + H_telno.cirid + "/" + H_telno.arid + "/" + H_telno.planid + "/" + minplan);
			return false;
		}

		return true;
	}

	do_execute_win_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_tgt_plan, H_tgt_packet, packet_zero, memo, disratiotalk, is_transparent_plan, is_transparent_packet) //基本料-------------------------------------------------------------
	//通話料-------------------------------------------------------------
	//総通話秒数を求める
	//総通話回数を求める
	//通話料課金単位秒数の差を補正した秒数を求める
	//無料通話料反映前の通話料を求める
	//通信料-------------------------------------------------------------
	//ezWeb,PCサイト,一般のパケット数から、新パケットでの通信費を求める
	//ダブル定額ezWeb通信料（上限額） := ezWeb通信料
	//ただし、新パケットのezWeb上限があれば、値の小さい方
	//ダブル定額ezWeb通信料（下限補正） := ↑上限額
	//ただし、新パケットの定額通信料よりも小さくならない
	//ダブル定額＋PCサイトビューア通信料 := ↑下限補正 + PCサイト通信料
	//ただし、新パケットのezWeb+PCサイトビューア上限があれば、値の小さい方
	//通信料合計 := ↑(ダブル定額 + PC通信料) + その他通信料
	//通信料合計に、デジタル通信を加算する
	//通話通信料---------------------------------------------------------
	//合計---------------------------------------------------------------
	//合計額 := 通話通信料 + 割引後基本料
	//その他に相当する部分
	//合計額に、その他に相当する部分をすべて足す
	//後処理-------------------------------------------------------------
	//結果を返す
	{
// 2022cvt_015
		var basic_sum = this.calc_basic(H_log, H_ave, H_tgt_plan, disratiotalk);
// 2022cvt_015
		var H_sec = this.calc_tuwa_sec(H_log, H_ave);
// 2022cvt_015
		var H_cnt = this.calc_tuwa_cnt(H_log, H_ave, H_sec);
// 2022cvt_015
		var H_touch = this.calc_touch_sec(H_log, H_ave, H_cur_plan, H_tgt_plan, H_sec, H_cnt);
// 2022cvt_015
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_AU);
// 2022cvt_015
		var H_comm = this.calc_H_comm(H_log, H_ave, H_tgt_packet, is_transparent_packet);
// 2022cvt_015
		var limit_mode = H_comm.mode;
		if (0 < H_tgt_packet.limit_mode && H_tgt_packet.limit_mode < limit_mode) limit_mode = H_tgt_packet.limit_mode;
		this.insert_log(H_log, "limit_mode", 0, limit_mode, memo);
// 2022cvt_015
		var limit_free = limit_mode;
		if (limit_free < H_tgt_packet.limit_free) limit_free = H_tgt_packet.limit_free;
		this.insert_log(H_log, "limit_free", 0, limit_free, memo);
// 2022cvt_015
		var limit_browse = limit_free + H_comm.browse;
		if (0 < H_tgt_packet.limit_browse && H_tgt_packet.limit_browse < limit_browse) limit_browse = H_tgt_packet.limit_browse;
		this.insert_log(H_log, "limit_browse", 0, limit_browse, memo);
// 2022cvt_015
		var raw_comm = limit_browse + H_comm.other;
		raw_comm += this.calc_comm_digi(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_AU);
		this.insert_log(H_log, "raw_comm", 0, raw_comm, memo, 1);

// 2022cvt_022
		if (!H_tgt_packet.packetid.localeCompare(packet_zero)) {
// 2022cvt_015
			var talkcomm = this.calc_talkcomm_wo_packet(H_log, H_ave, H_tgt_plan, raw_talk, raw_comm, disratiotalk);
		} else {
			talkcomm = this.calc_talkcomm_w_packet(H_log, H_ave, H_tgt_plan, H_tgt_packet, raw_talk, raw_comm, disratiotalk);
		}

// 2022cvt_015
		var total = Math.round(talkcomm + basic_sum);
// 2022cvt_015
		var other = H_ave.predata.predata_other;
		total += other;
		H_charge.charge = total;
		H_charge.basic = basic_sum;
		H_charge.talkcomm = talkcomm;
		H_charge.othersum = other;

// 2022cvt_015
		for (var key in H_charge) {
// 2022cvt_015
			var value = H_charge[key];
			this.insert_log(H_log, "result_" + key, 0, value, memo, 1);
		}

		return true;
	}

	do_execute_1x(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk) //全プランに対してループする
	//planid,packetid -> 価格情報
	//もっとも安いプランとパケットパックを選択する
	//現行のプラン・パケットのどちらかが、おすすめと同一かどうか検査する
	//DBに挿入する
	{
// 2022cvt_015
		var H_cur_plan = this.get_cur_plan(H_telno.planid);
// 2022cvt_015
		var H_all_charge = Array();

// 2022cvt_015
		for (var planid in H_plan) //データ用プランは対象としない
		{
// 2022cvt_015
			var H_planinfo = H_plan[planid];
// 2022cvt_022
			if (!H_planinfo.simway.localeCompare(G_SIMWAY_AU_DATA)) continue;
			H_log.planid = planid;

// 2022cvt_015
			for (var packetid in H_packet) //適用可能なプランで無ければスキップする
			{
// 2022cvt_015
				var H_packetinfo = H_packet[packetid];
				if (H_planinfo.packet.length && !(-1 !== H_planinfo.packet.indexOf(packetid))) continue;
				H_log.packetid = packetid;
// 2022cvt_015
				var H_charge = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};

				if (!this.do_execute_1x_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, H_packetinfo, packet_zero, memo, disratiotalk, false, false)) {
					this.putError(G_SCRIPT_WARNING, `1X計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}
		}

// 2022cvt_015
		var minkey = this.get_min_key(H_telno, H_all_charge);
// 2022cvt_015
		var minkey_plan = this.get_min_key_plan(minkey);
// 2022cvt_015
		var minkey_packet = this.get_min_key_packet(minkey);

		if (minkey_plan == H_telno.planid || minkey_packet == H_telno.packetid) //同一なので、そのプラン・パケットでシミュレーションをやり直す
			{
// 2022cvt_015
				var planid: string = minkey_plan;
// 2022cvt_015
				var H_planinfo = H_plan[planid];
				H_log.planid = -planid;
// 2022cvt_015
				var packetid: string = minkey_packet;
// 2022cvt_015
				var H_packetinfo = H_packet[packetid];
				H_log.packetid = -packetid;
				H_charge = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};
				this.putError(G_SCRIPT_DEBUG, "同一条件で再実行/" + H_telno.telno + "/" + planid + "/" + packetid);
				this.insert_log(H_log, "recalc", 0, 0, "", 1);

				if (!this.do_execute_1x_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, H_packetinfo, packet_zero, memo + "/recalc", disratiotalk, H_telno.planid == planid, H_telno.packetid == packetid)) {
					this.putError(G_SCRIPT_WARNING, `1X計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}

// 2022cvt_015
		var curkey = H_telno.planid + "," + H_telno.packetid;
		var minplan: string= "";
		
		this.calc_result(H_recom, H_telno, H_ave, H_plan, H_packet, minkey, curkey, H_all_charge);

		if (!this.m_O_inserter_recom.insert(H_recom)) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->insert失敗" + H_telno.telno + "/" + H_telno.cirid + "/" + H_telno.arid + "/" + H_telno.planid + "/" + minplan);
			return false;
		}

		return true;
	}

	do_execute_1x_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_tgt_plan, H_tgt_packet, packet_zero, memo, disratiotalk, is_transparent_plan, is_transparent_packet) //基本料-------------------------------------------------------------
	//通話料-------------------------------------------------------------
	//総通話秒数を求める
	//総通話回数を求める
	//通話料課金単位秒数の差を補正した秒数を求める
	//無料通話料反映前の通話料を求める
	//通信料-------------------------------------------------------------
	//ezWeb,PCサイト,一般のパケット数から、新パケットでの通信費を求める
	//各サービスの通信料を合計する
	//通信料合計に、デジタル通信を加算する
	//通話通信料---------------------------------------------------------
	//合計---------------------------------------------------------------
	//合計額 := 通話通信料 + 割引後基本料
	//その他に相当する部分
	//合計額に、その他に相当する部分をすべて足す
	//後処理-------------------------------------------------------------
	//結果を返す
	{
// 2022cvt_015
		var basic_sum = this.calc_basic(H_log, H_ave, H_tgt_plan, disratiotalk);
// 2022cvt_015
		var H_sec = this.calc_tuwa_sec(H_log, H_ave);
// 2022cvt_015
		var H_cnt = this.calc_tuwa_cnt(H_log, H_ave, H_sec);
// 2022cvt_015
		var H_touch = this.calc_touch_sec(H_log, H_ave, H_cur_plan, H_tgt_plan, H_sec, H_cnt);
// 2022cvt_015
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_AU);
// 2022cvt_015
		var H_comm = this.calc_H_comm(H_log, H_ave, H_tgt_packet, is_transparent_packet);
// 2022cvt_015
		var raw_comm = 0;

// 2022cvt_015
		for (var comm of H_comm) raw_comm += comm;

		raw_comm += this.calc_comm_digi(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_AU);
		this.insert_log(H_log, "raw_comm", 0, raw_comm, memo, 1);

// 2022cvt_022
		if (!H_tgt_packet.packetid.localeCompare(packet_zero)) {
// 2022cvt_015
			var talkcomm = this.calc_talkcomm_wo_packet(H_log, H_ave, H_tgt_plan, raw_talk, raw_comm, disratiotalk);
		} else {
			talkcomm = this.calc_talkcomm_w_packet(H_log, H_ave, H_tgt_plan, H_tgt_packet, raw_talk, raw_comm, disratiotalk);
		}

// 2022cvt_015
		var total = Math.round(talkcomm + basic_sum);
// 2022cvt_015
		var other = H_ave.predata.predata_other;
		total += other;
		H_charge.charge = total;
		H_charge.basic = basic_sum;
		H_charge.talkcomm = talkcomm;
		H_charge.othersum = other;

// 2022cvt_015
		for (var key in H_charge) {
// 2022cvt_015
			var value = H_charge[key];
			this.insert_log(H_log, "result_" + key, 0, value, memo, 1);
		}

		return true;
	}

	do_execute_data(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk) //全プランに対してループする
	//planid,packetid -> 価格情報
	//もっとも安いプランとパケットパックを選択する
	//現行のプランが、おすすめと同一かどうか検査する
	//DBに挿入する
	{
// 2022cvt_015
		var H_cur_plan = this.get_cur_plan(H_telno.planid);
// 2022cvt_015
		var H_all_charge = Array();

// 2022cvt_015
		for (var planid in H_plan) //データ用プラン以外は対象としない
		//パケットパックは無しとする
		//適用可能なプラン・パケットで無ければスキップする
		{
// 2022cvt_015
			var H_planinfo = H_plan[planid];
// 2022cvt_022
			if (H_planinfo.simway.localeCompare(G_SIMWAY_AU_DATA)) continue;
			H_log.planid = planid;
// 2022cvt_015
			var packetid = packet_zero;
			if (H_planinfo.packet.length && !(-1 !== H_planinfo.packet.indexOf(packetid))) continue;
			H_log.packetid = packetid;
// 2022cvt_015
			var H_charge = {
				charge: 0,
				basic: 0,
				talkcomm: 0,
				othersum: 0
			};

			if (!this.do_execute_data_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, memo, disratiotalk, false)) {
				this.putError(G_SCRIPT_WARNING, `DATA計算失敗/${planid}/${packetid}`);
				return false;
			}

			H_all_charge[planid + "," + packetid] = H_charge;
		}

// 2022cvt_015
		var minkey = this.get_min_key(H_telno, H_all_charge);
// 2022cvt_015
		var minkey_plan = this.get_min_key_plan(minkey);

		if (minkey_plan == H_telno.planid) //同一なので、そのプランでシミュレーションをやり直す
			{
// 2022cvt_015
				var planid: string = minkey_plan;
// 2022cvt_015
				var H_planinfo = H_plan[planid];
				H_log.planid = -planid;
				packetid = packet_zero;
				H_log.packetid = -packetid;
				H_charge = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};
				this.putError(G_SCRIPT_DEBUG, "同一条件で再実行/" + H_telno.telno + "/" + planid + "/" + packetid);
				this.insert_log(H_log, "recalc", 0, 0, "", 1);

				if (!this.do_execute_data_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, memo + "/recalc", disratiotalk, H_telno.planid == planid)) {
					this.putError(G_SCRIPT_WARNING, `DATA計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}

// 2022cvt_015
		var curkey = H_telno.planid + "," + H_telno.packetid;
		var minplan: string= "";
		this.calc_result(H_recom, H_telno, H_ave, H_plan, H_packet, minkey, curkey, H_all_charge);

		if (!this.m_O_inserter_recom.insert(H_recom)) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->insert失敗" + H_telno.telno + "/" + H_telno.cirid + "/" + H_telno.arid + "/" + H_telno.planid + "/" + minplan);
			return false;
		}

		return true;
	}

	do_execute_data_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_tgt_plan, memo, disratiotalk, is_transparent_plan) //基本料-------------------------------------------------------------
	//通話料-------------------------------------------------------------
	//総通話秒数を求める
	//総通話回数を求める
	//通話料課金単位秒数の差を補正した秒数を求める
	//無料通話料反映前の通話料を求める
	//通信料-------------------------------------------------------------
	//ezWeb,PCサイト,一般のパケット数から、新パケットでの通信費を求める
	//各サービスの通信料を合計する
	//通信料合計に、デジタル通信を加算する
	//通話通信料---------------------------------------------------------
	//合計---------------------------------------------------------------
	//合計額 := 通話通信料 + 割引後基本料
	//その他に相当する部分
	//合計額に、その他に相当する部分をすべて足す
	//後処理-------------------------------------------------------------
	//結果を返す
	{
// 2022cvt_015
		var basic_sum = this.calc_basic(H_log, H_ave, H_tgt_plan, disratiotalk);
// 2022cvt_015
		var H_sec = this.calc_tuwa_sec(H_log, H_ave);
// 2022cvt_015
		var H_cnt = this.calc_tuwa_cnt(H_log, H_ave, H_sec);
// 2022cvt_015
		var H_touch = this.calc_touch_sec(H_log, H_ave, H_cur_plan, H_tgt_plan, H_sec, H_cnt);
// 2022cvt_015
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_AU);
// 2022cvt_015
		var H_comm = this.calc_H_comm_from_plan(H_log, H_ave, H_tgt_plan, is_transparent_plan);
// 2022cvt_015
		var raw_comm = 0;

// 2022cvt_015
		for (var comm of H_comm) raw_comm += comm;

		raw_comm += this.calc_comm_digi(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_AU);
		this.insert_log(H_log, "raw_comm", 0, raw_comm, memo, 1);
// 2022cvt_015
		var talkcomm = this.calc_talkcomm_wo_packet(H_log, H_ave, H_tgt_plan, raw_talk, raw_comm, disratiotalk);
// 2022cvt_015
		var total = Math.round(talkcomm + basic_sum);
// 2022cvt_015
		var other = H_ave.predata.predata_other;
		total += other;
		H_charge.charge = total;
		H_charge.basic = basic_sum;
		H_charge.talkcomm = talkcomm;
		H_charge.othersum = other;

// 2022cvt_015
		for (var key in H_charge) {
// 2022cvt_015
			var value = H_charge[key];
			this.insert_log(H_log, "result_" + key, 0, value, memo, 1);
		}

		return true;
	}

	calc_talkcomm_wo_packet(H_log, H_ave, H_tgt_plan, raw_talk, raw_comm, disratiotalk) //割引率適用後通話料金
	//:= 通話料 * (1 - 電話単位の通話通信料割引率) + 通話その他
	//ただし、顧客単位の通話通信料割引率がある場合は通話料割引率はゼロ
	//無料通話料反映後通話料金
	//:= (↑割引率適用後通話料金 - 無料通話)
	//国際通話・国際デジタル通信・国際パケット通信を加算する
	{
// 2022cvt_015
		var ratio = H_ave.predata.predata_disratiotalk;
		if (undefined !== disratiotalk) ratio = 0;
// 2022cvt_015
		var talk = Math.round(raw_talk * (100 - ratio) / 100);
		talk += this.calc_talk_other(H_log, H_ave);
		this.insert_log(H_log, "talk_disratio_wo_packet", 0, talk, "");
		talk -= H_tgt_plan.free;
		this.insert_log(H_log, "talk_disratio_free_wo_packet", 0, talk, "");

		if (0 <= talk) //顧客単位通話通信料適用後通話料
			//:= ↑無料通話料反映後通話料金 * (1 - 顧客単位の通話通信料割引率)
			//通話通信料 := ↑通話料 + 通信料
			{
				ratio = 0;
				if (undefined !== disratiotalk) ratio = disratiotalk;
				talk = Math.round(talk * (100 - ratio) / 100);
				this.insert_log(H_log, "talk_disratio_free_disratiopact_wo_packet", 0, talk, "");
// 2022cvt_015
				var talkcomm = Math.round(talk + raw_comm);
				this.insert_log(H_log, "talkcomm_wo_packet", 0, talk, "");
			} else //顧客単位の通話通信料割引率は適用できない
			//通話通信料 := ↑無料通話料適用後通話料金 + 通信料
			//ただし、ゼロ未満にはならない
			{
				talkcomm = Math.round(talk + raw_comm);
				if (talkcomm < 0) talkcomm = 0;
				this.insert_log(H_log, "talkcomm_wo_packet", 0, talk, "");
			}

		talkcomm += this.calc_talk_abroad(H_log, H_ave);
		talkcomm += this.calc_comm_other(H_log, H_ave);
		this.insert_log(H_log, "talkcomm", 0, talkcomm, "", 1);
		return talkcomm;
	}

	calc_talkcomm_w_packet(H_log, H_ave, H_tgt_plan, H_tgt_packet, raw_talk, raw_comm, disratiotalk) //通話料金(無料通話反映後)
	//:= 通話料 * (1 - 電話単位の通話通信料割引率) + 通話その他 - 無料通話
	//ただし、顧客単位の通話通信料割引率がある場合は通話料割引率はゼロ
	//ただしゼロ未満にはならない
	//通話料金(顧客単位の通話通信料反映後)
	//:= ↑通話料金 * (1 - 顧客単位の通話通信料割引率)
	//通信料金(無料通信分反映後) := 通信料 - 無料通信分
	//ただしゼロ未満にはならない
	//通話通信料
	//:= (通話料 + 通信料) + パケット定額料
	//国際通話・国際デジタル通信・国際パケット通信を加算する
	{
// 2022cvt_015
		var ratio = H_ave.predata.predata_disratiotalk;
		if (undefined !== disratiotalk) ratio = 0;
// 2022cvt_015
		var talk = Math.round(raw_talk * (100 - ratio) / 100);
		talk += this.calc_talk_other(H_log, H_ave);
		talk -= H_tgt_plan.free;
		if (talk < 0) talk = 0;
		this.insert_log(H_log, "talk_disratio_free_w_packet", 0, talk, "");
		ratio = 0;
		if (undefined !== disratiotalk) ratio = disratiotalk;
		talk = Math.round(talk * (100 - ratio) / 100);
		this.insert_log(H_log, "talk_disratio_free_disratiopact_w_packet", 0, talk, "");
// 2022cvt_015
		var comm = raw_comm - H_tgt_packet.freecharge;
		if (comm < 0) comm = 0;
		this.insert_log(H_log, "comm_free_w_packet", 0, comm, "");
// 2022cvt_015
		var talkcomm = talk + comm;
		talkcomm += H_tgt_packet.fixcharge;
		this.insert_log(H_log, "talkcomm_w_packet", 0, talkcomm, "");
		talkcomm += this.calc_talk_abroad(H_log, H_ave);
		talkcomm += this.calc_comm_other(H_log, H_ave);
		this.insert_log(H_log, "talkcomm", 0, talkcomm, "", 1);
		return talkcomm;
	}

};
