//===========================================================================
//機能：trend_X_tbからplan_recom_tbを作る(ドコモ専用)
//
//作成：森原
//===========================================================================
//携帯通話のうち、自社携帯への通話の比率
//---------------------------------------------------------------------------
//機能：trend_X_tbからplan_recom_tbを作る(ドコモ専用)

import { G_CARRIER_DOCOMO, G_CIRCUIT_FOMA, G_CIRCUIT_MOVA, G_DOCOMO_SIM_DAYTIME_RATIO, G_SIMWAY_DATA_NEW } from "./script_common";
import { G_SCRIPT_DEBUG, G_SCRIPT_ERROR, G_SCRIPT_INFO, G_SCRIPT_WARNING } from "./script_log";
import UpdateRecomBase from "./update_recom_base";

// 2022cvt_026
// require("update_recom_base.php");

export const MOBILE_RATIO_DOCOMO = 50;

//回線種別=>地域会社=>パケットパック無しのIDの配列
//ただし、FOMAのみ
//データ専用プランのplan_tb.simway
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
//機能：FOMAのシミュレーションを行う
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
//機能：FOMAの特定のプラン・パケットの組み合わせの金額を求める
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
//機能：movaのシミュレーションを行う
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
//機能：movaの特定のプラン・パケットの組み合わせの金額を求める
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
export default class UpdateRecomDocomo extends UpdateRecomBase {
	m_H_packet_zero: any[];
	m_H_ave_trend_default: any;
	m_A_simway_data: any[];
	constructor(listener, db, table_no, inserter_recom, inserter_log, A_cirid, A_monthcnt, assert) //統計情報平均値のデフォルト値
	//パケットパック無しを取り出す
	//パケットパック無しがFOMAにおいてすべてそろっているか確認する
	//データ専用プランのsimwayを指定する
	//パケットパックマスターを拡張して、パケホーダイ関連の情報を入れる
	{
		if (0 == A_cirid.length) A_cirid = [G_CIRCUIT_FOMA, G_CIRCUIT_MOVA];
		if (0 == A_monthcnt.length) A_monthcnt = [1, 3, 6, 12];
		super(listener, db, table_no, inserter_recom, inserter_log, A_cirid, A_monthcnt, assert, G_CARRIER_DOCOMO);
		this.m_H_ave_trend_default = {
			timezone: {
				0: Math.round(G_DOCOMO_SIM_DAYTIME_RATIO),
				1: Math.round(100 - G_DOCOMO_SIM_DAYTIME_RATIO)
			},
			timezone_digi: {
				0: Math.round(G_DOCOMO_SIM_DAYTIME_RATIO),
				1: Math.round(100 - G_DOCOMO_SIM_DAYTIME_RATIO)
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
		sql += " and cirid=" + G_CIRCUIT_FOMA;
		sql += " and simafter=true";
		sql += " and packetid<=3000";
		sql += " and (packetname='パケットパックなし')";
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
				if (G_CIRCUIT_FOMA != Number(cirid)) continue;

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
		this.m_A_simway_data = [G_SIMWAY_DATA_NEW];
		{
			let _tmp_1 = this.m_H_packet;

// 2022cvt_015
			for (let cirid in _tmp_1) //処理する回線種別でなければスキップ
			{
// 2022cvt_015
				var H_cirid = _tmp_1[cirid];
				if (!(-1 !== this.m_A_cirid.indexOf(cirid))) continue;

// 2022cvt_015
				for (let arid in H_cirid) {
// 2022cvt_015
					var H_arid = H_cirid[arid];

// 2022cvt_015
					for (let packetid in H_arid) //パケホーダイならtrueになるフラグを作る
					//パケホーダイ定額料・それ以外定額料をマスターに追加する
					{
// 2022cvt_015
						var H_packetid = H_arid[packetid];
// 2022cvt_016
// 2022cvt_015
						var type = "";
// 2022cvt_016
						if (undefined !== H_packetid.type) type = H_packetid.type;
// 2022cvt_016
						this.m_H_packet[cirid][arid][packetid].is_hodai = !(-1 === type.indexOf("H"));
// 2022cvt_015
						var fixcharge = 0;
						if (undefined !== H_packetid.fixcharge) fixcharge = H_packetid.fixcharge;

						if (this.m_H_packet[cirid][arid][packetid].is_hodai) {
							this.m_H_packet[cirid][arid][packetid].fixcharge_hodai = fixcharge;
							this.m_H_packet[cirid][arid][packetid].fixcharge_nothodai = 0;
						} else {
							this.m_H_packet[cirid][arid][packetid].fixcharge_hodai = 0;
							this.m_H_packet[cirid][arid][packetid].fixcharge_nothodai = fixcharge;
						}
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

		if (0 == H_packet.length && G_CIRCUIT_FOMA == cirid) {
			this.putError(G_SCRIPT_INFO, "FOMAパケットマスター存在せず" + `${telno}/${cirid}/${arid}`);
			return true;
		}

// 2022cvt_015
		var packet_zero = undefined;
		if (undefined !== this.m_H_packet_zero[cirid]) if (undefined !== this.m_H_packet_zero[cirid][arid]) packet_zero = this.m_H_packet_zero[cirid][arid];
// 2022cvt_015
		var H_recom: any = {
			telno: H_telno.telno,
			arid: H_telno.arid,
			mode: "000",
			flags: "0"
		};

// 2022cvt_015
		for (var length of this.m_A_monthcnt) //Nヶ月の平均を求める
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
		{
			H_recom.monthcnt = length;
// 2022cvt_015
			var H_ave: any = Array();
			if (!this.calcAve(H_ave, A_predata, A_trend, A_top, length)) return false;
// 2022cvt_015
			var A_key = this.m_A_predata_disratio;

// 2022cvt_015
			for (var key of Object.values(A_key)) {
				if (100 < H_ave.predata[key]) {
					this.putError(G_SCRIPT_INFO, key + "\u304C100\u3092\u8D85\u3048\u305F\u306E\u3067\u51E6\u7406\u305B\u305A" + H_telno.telno);
					return true;
				}
			}

// 2022cvt_015
			var H_log = {
				monthcnt: length,
				telno: H_telno.telno
			};
			this.insert_log_ave(H_log, H_ave);
			if (undefined !== disratiotalk) this.insert_log(H_log, "disratiopact", 0, disratiotalk, "", 1);else this.insert_log(H_log, "disratiopact", 0, -1, "\u5B58\u5728\u305B\u305A", 1);

			if (-1 !== this.m_A_simway_data.indexOf(this.m_H_cur_plan[planid].simway)) //データ専用プランである
				{
					if (!this.do_execute_data(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk)) return false;
// 2022cvt_022
				} else if (!H_telno.cirid.localeCompare(G_CIRCUIT_MOVA)) //movaである
				{
					if (!this.do_execute_mova(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk)) return false;
// 2022cvt_022
				} else if (!H_telno.cirid.localeCompare(G_CIRCUIT_FOMA)) //FOMAである
				{
					if (!this.do_execute_foma(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk)) return false;
				}
		}

		return true;
	}

	do_execute_foma(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk) //全プランに対してループする
	//planid,packetid -> 価格情報
	//もっとも安いプランとパケットパックを選択する
	//現行のプラン・パケットのどちらかが、おすすめと同一かどうか検査する
	//DBに挿入する
	{
		if (!(undefined !== H_packet[H_telno.packetid])) {
			if (!(undefined !== packet_zero)) {
				this.putError(G_SCRIPT_INFO, "現行FOMAパケットパック存在せず" + `${telno}/${cirid}/${arid}/${packetid}`);
				return true;
			}

			H_telno.packetid = packet_zero;
		}

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
			if (-1 !== this.m_A_simway_data.indexOf(H_planinfo.simway)) continue;
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

				if (!this.do_execute_foma_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, H_packetinfo, packet_zero, memo, disratiotalk, false, false)) {
					this.putError(G_SCRIPT_WARNING, `FOMA計算失敗/${planid}/${packetid}`);
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
				let planid = minkey_plan;
// 2022cvt_015
				var H_planinfo = H_plan[planid];
				H_log.planid = -planid;
// 2022cvt_015
				let packetid = minkey_packet;
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

				if (!this.do_execute_foma_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, H_packetinfo, packet_zero, memo + "/recalc", disratiotalk, H_telno.planid == planid, H_telno.packetid == packetid)) {
					this.putError(G_SCRIPT_WARNING, `FOMA計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}

// 2022cvt_015
		var curkey = H_telno.planid + "," + H_telno.packetid;
		this.calc_result(H_recom, H_telno, H_ave, H_plan, H_packet, minkey, curkey, H_all_charge);

		if (!this.m_O_inserter_recom.insert(H_recom)) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->insert失敗" + H_telno.telno + "/" + H_telno.cirid + "/" + H_telno.arid + "/" + H_telno.planid + "/" + minplan);
			return false;
		}

		return true;
	}

	do_execute_foma_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_tgt_plan, H_tgt_packet, packet_zero, memo, disratiotalk, is_transparent_plan, is_transparent_packet) //基本料-------------------------------------------------------------
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
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_DOCOMO);
// 2022cvt_015
		var H_comm = this.calc_H_comm(H_log, H_ave, H_tgt_packet, is_transparent_packet);
// 2022cvt_015
		var raw_comm = 0;

// 2022cvt_015
		for (var comm of Object.values(H_comm)) raw_comm += comm;

		raw_comm += this.calc_comm_digi(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_DOCOMO);
		this.insert_log(H_log, "raw_comm", 0, raw_comm, memo, 1);

// 2022cvt_022
		if (!packet_zero.localeCompare(H_tgt_packet.packetid)) {
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

	do_execute_mova(H_telno, H_ave, H_plan, H_packet, packet_zero, H_recom, H_log, memo, disratiotalk) //全プランに対してループする
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
		for (var planid in H_plan) //データ用プランは対象としない
		//パケットパックは無しとする
		//適用可能なプラン・パケットで無ければスキップする
		{
// 2022cvt_015
			var H_planinfo = H_plan[planid];
			if (-1 !== this.m_A_simway_data.indexOf(H_planinfo.simway)) continue;
			H_log.planid = planid;
// 2022cvt_015
			var packetid = "";
			if (H_planinfo.packet.length && !(-1 !== H_planinfo.packet.indexOf(packetid))) continue;
			H_log.packetid = packetid;
// 2022cvt_015
			var H_charge = {
				charge: 0,
				basic: 0,
				talkcomm: 0,
				othersum: 0
			};

			if (!this.do_execute_mova_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, memo, disratiotalk, false)) {
				this.putError(G_SCRIPT_WARNING, `mova計算失敗/${planid}/${packetid}`);
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
				let planid = minkey_plan;
// 2022cvt_015
				var H_planinfo = H_plan[planid];
				H_log.planid = -planid;
				packetid = "";
				H_log.packetid = packetid;
				H_charge = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};
				this.putError(G_SCRIPT_DEBUG, "同一条件で再実行/" + H_telno.telno + "/" + planid + "/" + packetid);
				this.insert_log(H_log, "recalc", 0, 0, "", 1);

				if (!this.do_execute_mova_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, memo + "/recalc", disratiotalk, H_telno.planid == planid)) {
					this.putError(G_SCRIPT_WARNING, `mova計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}

// 2022cvt_015
		var curkey = H_telno.planid + "," + H_telno.packetid;
		this.calc_result(H_recom, H_telno, H_ave, H_plan, H_packet, minkey, curkey, H_all_charge);

		if (!this.m_O_inserter_recom.insert(H_recom)) {
			this.putError(G_SCRIPT_ERROR, "inserter_recom->insert失敗" + H_telno.telno + "/" + H_telno.cirid + "/" + H_telno.arid + "/" + H_telno.planid + "/" + minplan);
			return false;
		}

		return true;
	}

	do_execute_mova_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_tgt_plan, memo, disratiotalk, is_transparent_plan) //基本料-------------------------------------------------------------
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
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_DOCOMO);
// 2022cvt_015
		var H_comm = this.calc_H_comm_from_plan(H_log, H_ave, H_tgt_plan, is_transparent_plan);
// 2022cvt_015
		var raw_comm = 0;

// 2022cvt_015
		for (var comm of Object.values(H_comm)) raw_comm += comm;

		raw_comm += this.calc_comm_digi(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_DOCOMO);
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
		{
// 2022cvt_015
			var H_planinfo = H_plan[planid];
			if (!(-1 !== this.m_A_simway_data.indexOf(H_planinfo.simway))) continue;
			H_log.planid = planid;
// 2022cvt_015
			var packetid = "";
			if (undefined !== packet_zero && packet_zero.length) packetid = packet_zero;
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
				this.putError(G_SCRIPT_WARNING, `data計算失敗/${planid}/${packetid}`);
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
				let planid = minkey_plan;
// 2022cvt_015
				var H_planinfo = H_plan[planid];
				H_log.planid = -planid;
				packetid = "";
				H_log.packetid = packetid;
				H_charge = {
					charge: 0,
					basic: 0,
					talkcomm: 0,
					othersum: 0
				};
				this.putError(G_SCRIPT_DEBUG, "同一条件で再実行/" + H_telno.telno + "/" + planid + "/" + packetid);
				this.insert_log(H_log, "recalc", 0, 0, "", 1);

				if (!this.do_execute_data_item(H_charge, H_telno, H_log, H_ave, H_cur_plan, H_planinfo, memo + "/recalc", disratiotalk, H_telno.planid == planid)) {
					this.putError(G_SCRIPT_WARNING, `data計算失敗/${planid}/${packetid}`);
					return false;
				}

				H_all_charge[planid + "," + packetid] = H_charge;
			}

// 2022cvt_015
		var curkey = H_telno.planid + "," + H_telno.packetid;
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
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_DOCOMO);
// 2022cvt_015
		var H_comm = this.calc_H_comm_from_plan(H_log, H_ave, H_tgt_plan, is_transparent_plan);
// 2022cvt_015
		var raw_comm = 0;

// 2022cvt_015
		for (var comm of Object.values(H_comm)) raw_comm += comm;

		raw_comm += this.calc_comm_digi(H_log, H_ave, H_tgt_plan, H_touch, is_transparent_plan, MOBILE_RATIO_DOCOMO);
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

	calc_talkcomm_wo_packet(H_log, H_ave, H_tgt_plan, raw_talk, raw_comm, disratiotalk) //割引率適用前通話通信料
	//:= 通話料 + 通信料 + 通話その他
	//ただし、ゼロ未満にはならない
	//電話単位・顧客単位割引率適用後通話通信料
	//:= 通話通信料 * (1 - 電話単位・顧客単位通話通信料割引率)
	//無料通話適用後通話通信料
	//:= 通話通信料 - 無料通話分
	//ただし、ゼロ未満にはならない
	{
// 2022cvt_015
		var talkcomm = raw_talk + raw_comm;
		talkcomm += this.calc_talk_other(H_log, H_ave);
		talkcomm += this.calc_talk_abroad(H_log, H_ave);
		talkcomm += this.calc_comm_other(H_log, H_ave);
		if (talkcomm < 0) talkcomm = 0;
		this.insert_log(H_log, "talkcomm_wo_packet", 0, talkcomm, "");
// 2022cvt_015
		var ratio = H_ave.predata.predata_disratiotalk;
		if (undefined !== disratiotalk) ratio = disratiotalk;
		talkcomm = Math.round(talkcomm * (100 - ratio) / 100);
		this.insert_log(H_log, "talkcomm_disratio_wo_packet", 0, talkcomm, "");
		talkcomm -= H_tgt_plan.free;
		if (talkcomm < 0) talkcomm = 0;
		this.insert_log(H_log, "talkcomm_disratio_free_wo_packet", 0, talkcomm, "");
		return talkcomm;
	}

	calc_talkcomm_w_packet(H_log, H_ave, H_tgt_plan, H_tgt_packet, raw_talk, raw_comm, disratiotalk) //割引率適用前通話通信料
	//:= 通話料 + 通信料 + 通話その他
	//ただし、ゼロ未満にはならない
	//電話単位・顧客単位割引率適用後通話通信料
	//:= 通話通信料 * (1 - 電話単位・顧客単位通話通信料割引率)
	//無料通話適用後通話通信料
	//:= 通話通信料 - 無料通話分
	//無料通信適用後通話通信料
	//:= 通話通信料 - 無料通信分
	//ただし、ゼロ未満にはならない
	//定額通信料適用後通話通信料
	//:= 通話通信料
	//+ パケホーダイ定額通信料
	//+ (一般定額通信料 * (1 - 顧客単位通話通信料割引率));
	{
// 2022cvt_015
		var talkcomm = raw_talk + raw_comm;
		talkcomm += this.calc_talk_other(H_log, H_ave);
		talkcomm += this.calc_talk_abroad(H_log, H_ave);
		talkcomm += this.calc_comm_other(H_log, H_ave);
		if (talkcomm < 0) talkcomm = 0;
		this.insert_log(H_log, "talkcomm_w_packet", 0, talkcomm, "");
// 2022cvt_015
		var ratio = H_ave.predata.predata_disratiotalk;
		if (undefined !== disratiotalk) ratio = disratiotalk;
		talkcomm = Math.round(talkcomm * (100 - ratio) / 100);
		this.insert_log(H_log, "talkcomm_disratio_w_packet", 0, talkcomm, "");
		talkcomm -= H_tgt_plan.free;
		this.insert_log(H_log, "talkcomm_disratio_free_w_packet", 0, talkcomm, "");
		talkcomm -= H_tgt_packet.freecharge;
		if (talkcomm < 0) talkcomm = 0;
		this.insert_log(H_log, "talkcomm_disratio_free_freecharge_w_packet", 0, talkcomm, "");
		ratio = 0;
		if (undefined !== disratiotalk) ratio = disratiotalk;
		talkcomm += H_tgt_packet.fixcharge_hodai;
		talkcomm += Math.round(H_tgt_packet.fixcharge_nothodai * (100 - ratio) / 100);
		this.insert_log(H_log, "talkcomm_disratio_free_freecharge_fixcharge_w_packet", 0, talkcomm, "");
		return talkcomm;
	}

};
