//===========================================================================
//機能：シミュレーションのau部
//
//作成：森原
//===========================================================================
//===========================================================================
//機能：統計情報からシミュレーションを行う(au専用)

//違約金計算での前月と見なす日付
//携帯で自社宛と見なす比率のデフォルト値
//買い方なし
//買い方バリュー(シンプル)
//買い方ベーシック(フルサポート)
//買い方法人サポート
//デジタル通信1秒あたりパケット数(パケットその他に換算)
//コンストラクタ
//-----------------------------------------------------------------------
//機能：現在の買い方から、おすすめ後の買い方を配列に入れて返す
//機能：他キャリア時に当てはめる回線種別を返す
//-----------------------------------------------------------------------
//必要に応じて、平均値を補正する
//機能：通話通信料を求める(パケットパックあり)
//備考：パケットパックなしも、こちらを呼び出している
//無料通話の優先順位は、以下の通り
//通話 → 一般パケット通信 → 国際通話 → 国際パケット通信
//機能：通話通信料を求める(パケットパック無し)
class UpdateRecomAU extends UpdateRecomBase {
	static g_penalty_limit = 32;
	static g_ratio_same_carrier = 50;
	static g_buysel_empty = 7;
	static g_buysel_value = 8;
	static g_buysel_basic = 9;
	static g_buysel_hojin = 27;
	static g_touch_ave_touch = 64;

	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_inserter_log: TableInserterBase, assert) //統計情報平均値のデフォルト値
	{
		var A_buysel = [UpdateRecomAU.g_buysel_empty, UpdateRecomAU.g_buysel_basic, UpdateRecomAU.g_buysel_value, UpdateRecomAU.g_buysel_hojin];
		super(listener, db, table_no, O_inserter_log, assert, G_CARRIER_AU, [G_CIRCUIT_AU_CDMA, G_CIRCUIT_AU_WIN, G_CIRCUIT_AU_LTE], [G_CIRCUIT_AU_CDMA, G_CIRCUIT_AU_WIN, G_CIRCUIT_AU_LTE], A_buysel, UpdateRecomAU.g_penalty_limit, {
			ratio_same_carrier: UpdateRecomAU.g_ratio_same_carrier
		});
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
			}
		};
	}

	get_buysel(is_penalty, H_tel: {} | any[], buysel_before, is_change_course, is_change_carrier) {
		is_penalty = false;

		if (is_change_carrier) //他キャリア間である
			//現在が違約金ありなら違約金が発生する
			{
				if (this.m_H_plan[H_tel.planid].penaltyflg) is_penalty = true;
				return [UpdateRecomAU.g_buysel_value];
			}

		if (is_change_course) //現在が違約金ありなら違約金が発生する
			{
				if (this.m_H_plan[H_tel.planid].penaltyflg) is_penalty = true;

				switch (buysel_before) {
					case UpdateRecomAU.g_buysel_basic:
						return [UpdateRecomAU.g_buysel_basic];

					case UpdateRecomAU.g_buysel_value:
						return [UpdateRecomAU.g_buysel_value];

					case UpdateRecomAU.g_buysel_hojin:
						return [UpdateRecomAU.g_buysel_hojin];

					default:
						return [UpdateRecomAU.g_buysel_value, UpdateRecomAU.g_buysel_empty];
				}
			} else //買い方を変更しない場合
			{
				return [buysel_before];
			}
	}

	get_cirid_change_carrier() //WINとする
	{
		return G_CIRCUIT_AU_WIN;
	}

	touch_ave_touch(H_ave: {} | any[], H_touch: {} | any[], H_tgt_plan: {} | any[], H_log: {} | any[], memo) //移行先がデータ専用なら、デジタル通話をパケットその他に変更する
	{
		if (this.getValue(H_tgt_plan, "is_data", false)) {
			if (undefined !== H_touch[1]) {
				var sec = H_touch[1];
				H_touch[1] = 0;
				if (!(undefined !== H_ave.trend.packetcnt[30])) H_ave.trend.packetcnt[30] = 0;
				var packet = Math.round(sec * UpdateRecomAU.g_touch_ave_touch);
				H_ave.trend.packetcnt[30] = H_ave.trend.packetcnt[30] + packet;
				this.insert_log(H_log, "touch_ave_digi_sec", 0, sec, memo, UpdateRecomAU.g_log_ave);
				this.insert_log(H_log, "touch_ave_packet_other", 0, packet, memo, UpdateRecomAU.g_log_ave);
			}
		}
	}

	calc_talkcomm_w_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], H_tgt_packet: {} | any[], raw_talk, raw_comm, H_other) //通話通信料割引率を取り出しておく
	//$is_allは、顧客単位の割引率があればtrue
	//電話単位の割引率は、通常はゼロになっている筈
	//-------------------------------------------------------------------
	//A)通話料を求める(国際通話以外)
	//無料通話残額
	//-------------------------------------------------------------------
	//B)一般パケット通信料を求める
	//-------------------------------------------------------------------
	//C)国際通話を求める
	//国際通話 := 国際通話 - 無料通話(残)
	//(1)国際通話 := 国際通話
	//国際通話
	//(2)無料通話(残)を適用する
	//-------------------------------------------------------------------
	//D)国際パケット通信を求める
	//国際パケット通信 := 国際パケット通信 - 無料通話(残)
	//(1)国際パケット通信 := 国際パケット通信
	//国際パケット通信
	//(2)無料通話(残)を適用する(パケットパックの有無にかかわらず)
	//-------------------------------------------------------------------
	//E)通話通信料 := 通話料
	//+ パケット通信料 + 国際通話 + 国際のパケット通信料
	//-------------------------------------------------------------------
	//F)パケットパックありなら、定額通信料を加算する(割引率は適用しない)
	{
		var disratio = 0;
		var is_all = this.calc_disratio_talkcomm(disratio, H_log, H_ave, H_param, H_disratio, H_tgt_plan.cirid);
		var disratio_pact = is_all ? disratio : 0;
		var disratio_tel = is_all ? 0 : disratio;
		var talk_domestic = 0;
		var talk_free = H_tgt_plan.free;

		if (is_all) //A.1)会社単位の割引がある(コールワイド)
			//通話料 := (通話 + 通話その他 + 国際デジタル - 無料通話)
			// (1 - 会社単位の割引率)
			//(1)通話料 := 通話 + 通話その他 + 国際デジタル
			//通話
			//通話その他
			//国際デジタル
			//(2)無料通話を適用する
			//(3)会社単位の割引率を適用する
			{
				talk_domestic = 0;
				talk_domestic += raw_talk;
				talk_domestic += H_other.talk_other;
				talk_domestic += H_other.comm_abroad_digi;
				this.apply_free(talk_domestic, talk_free);
				talk_domestic = Math.round(talk_domestic * (100 - disratio_pact) / 100);
			} else //A.2)会社単位の割引が無い
			//通話料 := 通話 * (1 - 電話単位の割引率)
			//+ 通話その他 + 国際デジタル - 無料通話
			//(1)通話料 := 通話
			//通話
			//(2)電話単位の割引率を適用する
			//(3)通話その他と国際デジタルを加算する
			//通話その他
			//国際デジタル
			//(4)無料通話を適用する
			{
				talk_domestic = 0;
				talk_domestic = raw_talk;
				talk_domestic = Math.round(talk_domestic * (100 - disratio_tel) / 100);
				talk_domestic += H_other.talk_other;
				talk_domestic += H_other.comm_abroad_digi;
				this.apply_free(talk_domestic, talk_free);
			}

		this.insert_log(H_log, "talk_domestic", 0, talk_domestic, "", UpdateRecomAU.g_log_talkcomm);
		this.insert_log(H_log, "talk_free_remain_domestic", 0, talk_free, "", UpdateRecomAU.g_log_talkcomm);
		var comm_domestic = 0;
		var comm_free = 0;
		if (H_tgt_packet.length) comm_free += H_tgt_packet.freecharge;

		if (is_all) //B.1)会社単位の割引がある(コールワイド)
			//一般パケット通信料 := (パケット通信 + 国内デジタル通信
			//- 無料通話通信)
			//コールワイドの場合、会社単位割引率は適用しない
			//(1)通信料 := パケット通信 + 国内デジタル通信
			//(2)無料通話通信を適用する
			//パケットパックなしなら、無料通話の残りも適用する
			{
				comm_domestic = 0;
				comm_domestic += raw_comm;
				comm_domestic += H_other.comm_domestic_digi;
				this.apply_free(comm_domestic, comm_free);
				if (!H_tgt_packet.length) this.apply_free(comm_domestic, talk_free);
			} else //B.2)会社単位の割引がない
			//一般パケット通信料 := (パケット通信 + 国内デジタル通信)
			// (1 - 電話単位の割引率)
			//- 無料通話通信
			//(1)通信料 := パケット通信
			//(2)電話単位の割引率を適用する
			//(3)無料通話通信を適用する
			//パケットパックなしなら、無料通話の残りも適用する
			{
				comm_domestic = 0;
				comm_domestic += raw_comm;
				comm_domestic += H_other.comm_domestic_digi;
				comm_domestic = Math.round(comm_domestic * (100 - disratio_tel) / 100);
				this.apply_free(comm_domestic, comm_free);
				if (!H_tgt_packet.length) this.apply_free(comm_domestic, talk_free);
			}

		this.insert_log(H_log, "comm_domestic", 0, comm_domestic, "", UpdateRecomAU.g_log_talkcomm);
		this.insert_log(H_log, "comm_free_remain_domestic", 0, comm_free, "", UpdateRecomAU.g_log_talkcomm);
		var talk_abroad = 0;
		talk_abroad += H_other.talk_abroad;
		this.apply_free(talk_abroad, talk_free);
		this.insert_log(H_log, "talk_abroad", 0, talk_abroad, "", UpdateRecomAU.g_log_talkcomm);
		var comm_abroad = 0;
		comm_abroad += H_other.comm_abroad_packet;
		this.apply_free(comm_abroad, talk_free);
		this.insert_log(H_log, "comm_abroad", 0, comm_abroad, "", UpdateRecomAU.g_log_talkcomm);
		var talkcomm = 0;
		talkcomm += talk_domestic;
		talkcomm += comm_domestic;
		talkcomm += talk_abroad;
		talkcomm += comm_abroad;
		if (H_tgt_packet.length) talkcomm += H_tgt_packet.fixcharge;
		this.insert_log(H_log, "talkcomm", 0, talkcomm, "", UpdateRecomAU.g_log_talkcomm);
		return talkcomm;
	}

	calc_talkcomm_wo_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], raw_talk, raw_comm, H_other) //新パケットを空配列にしてパケットパックありを呼び出す
	{
		return this.calc_talkcomm_w_packet(H_log, H_ave, H_param, H_disratio, H_tgt_plan, Array(), raw_talk, raw_comm, H_other);
	}

};