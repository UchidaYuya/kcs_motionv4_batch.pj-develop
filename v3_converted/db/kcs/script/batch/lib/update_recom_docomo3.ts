//===========================================================================
//機能：シミュレーションのドコモ部
//
//作成：森原
//===========================================================================
//顧客単位割引率がある場合に利用できるパケットパック(カンマで区切って複数)
//===========================================================================
//機能：統計情報からシミュレーションを行う(ドコモ専用)
const PACKETID_DISRATIO_PACT_FOMA = "3002,3003,3004,3014";

//違約金計算での前月と見なす日付
//携帯で自社宛と見なす比率のデフォルト値
//買い方なし
//買い方バリュー
//買い方ベーシック
//コンストラクタ
//-----------------------------------------------------------------------
//機能：スマートフォンによるパケットパックの絞り込みを行わないならtrueを返す
//機能：現在の買い方から、おすすめ後の買い方を配列に入れて返す
//機能：他キャリア時に当てはめる回線種別を返す
//-----------------------------------------------------------------------
//機能：通話通信料を求める(パケットパックあり)
//備考：パケットパックなしも、こちらを呼び出している
//無料通話の優先順位は、
//通話・一般パケット通信・国際通話・国際パケット通信で特になし
//機能：通話通信料を求める(パケットパック無し)
class UpdateRecomDocomo extends UpdateRecomBase {
	static g_penalty_limit = 1;
	static g_ratio_same_carrier = 50;
	static g_buysel_empty = 1;
	static g_buysel_value = 2;
	static g_buysel_basic = 3;

	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_inserter_log: TableInserterBase, assert) //統計情報平均値のデフォルト値
	//顧客単位割引率がある場合に利用できるパケットパック
	//同、顧客
	{
		var A_buysel = [UpdateRecomDocomo.g_buysel_empty, UpdateRecomDocomo.g_buysel_basic, UpdateRecomDocomo.g_buysel_value];
		super(listener, db, table_no, O_inserter_log, assert, G_CARRIER_DOCOMO, [G_CIRCUIT_FOMA, G_CIRCUIT_DOCOMO_XI], [G_CIRCUIT_FOMA, G_CIRCUIT_DOCOMO_XI], A_buysel, UpdateRecomDocomo.g_penalty_limit, {
			ratio_same_carrier: UpdateRecomDocomo.g_ratio_same_carrier
		});
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
			}
		};
		this.m_H_packetid_disratio_pact[G_CIRCUIT_FOMA] = PACKETID_DISRATIO_PACT_FOMA.split(",");
		var sql = "select pactid from pact_except_tb";
		sql += " where code='docomo_packetpack_enable'";
		sql += " order by pactid";
		sql += ";";
		var result = this.m_db.getAll(sql);

		for (var A_line of Object.values(result)) {
			var pactid = A_line[0];
			if (!(-1 !== this.m_A_pactid_disratio_pact.indexOf(pactid))) this.m_A_pactid_disratio_pact.push(pactid);
		}
	}

	is_ignore_smart() {
		return false;
	}

	get_buysel(is_penalty, H_tel: {} | any[], buysel_before, is_change_course, is_change_carrier) {
		if (is_change_carrier) //他キャリア間である
			//現在が違約金ありなら違約金が発生する
			{
				if (this.m_H_plan[H_tel.planid].penaltyflg) is_penalty = true;
				return [UpdateRecomDocomo.g_buysel_value];
			}

		if (G_CIRCUIT_MOVA == H_tel.cirid) //MOVAは常に買い方不明とする
			{
				return [UpdateRecomDocomo.g_buysel_empty];
			}

		if (is_change_course) //買い方を変更する場合
			//現在が違約金ありなら違約金が発生する
			{
				if (this.m_H_plan[H_tel.planid].penaltyflg) is_penalty = true;

				switch (buysel_before) {
					case UpdateRecomDocomo.g_buysel_basic:
						return [UpdateRecomDocomo.g_buysel_basic, UpdateRecomDocomo.g_buysel_value];

					case UpdateRecomDocomo.g_buysel_value:
						return [UpdateRecomDocomo.g_buysel_value];

					default:
						return [UpdateRecomDocomo.g_buysel_empty, UpdateRecomDocomo.g_buysel_value];
				}
			} else //買い方を変更しない場合
			{
				return [buysel_before];
			}
	}

	get_cirid_change_carrier() //FOMAとする
	{
		return G_CIRCUIT_FOMA;
	}

	calc_talkcomm_w_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], H_tgt_packet: {} | any[], raw_talk, raw_comm, H_other) //通話通信料割引率を取り出しておく
	//$is_allは、顧客単位の割引率があればtrue
	//電話単位の割引率は、通常はゼロになっている筈
	//-------------------------------------------------------------------
	//A)無料通話通信を求める
	//無料通話通信 := 無料通話 + 無料通信(パケットパックがあれば)
	//-------------------------------------------------------------------
	//B)国内パケット通信以外を求める
	//-------------------------------------------------------------------
	//C)パケホーダイ系なら、無料通話通信の残額をゼロにする
	//-------------------------------------------------------------------
	//D)国内パケットを求める
	//-------------------------------------------------------------------
	//E)通話通信料 := 国内パケット通信以外 + 国内パケット通信
	//-------------------------------------------------------------------
	//F)パケットパックありなら、定額通信料を加算する
	{
		var disratio = 0;
		var is_all = this.calc_disratio_talkcomm(disratio, H_log, H_ave, H_param, H_disratio, H_tgt_plan.cirid);
		var disratio_pact = is_all ? disratio : 0;
		var disratio_tel = is_all ? 0 : disratio;
		var free = 0;
		free += H_tgt_plan.free;
		if (H_tgt_packet.length) free += H_tgt_packet.freecharge;
		this.insert_log(H_log, "free_pass1", 0, free, "", UpdateRecomDocomo.g_log_talkcomm);
		var talkcomm = 0;

		if (is_all) //B.1)会社単位の割引がある(ビジネスセイバー)
			//国内パケット通信以外
			//:= (一般通話 + 国際通話 + 通話その他
			//+ 国際デジタル通信 + 国際パケット通信)
			//+ 国内デジタル通信
			// (1 - 会社単位の割引率)
			//- 無料通話通信
			//(1)国際パケット通信以外 := 一般通話 + 通話その他
			//+ 国際デジタル通信 + 国際パケット通信)
			//+ 国内デジタル通信
			//一般通話
			//通話その他
			//国際デジタル
			//国際パケット通信
			//国内デジタル通信
			//(2)国際パケット通信以外に会社単位の割引率を適用する
			//国際パケット通信以外 += 国際通話
			//国際通話
			//(3)国際パケット通信以外に無料通話通信を適用する
			{
				talkcomm = 0;
				talkcomm += raw_talk;
				talkcomm += H_other.talk_other;
				talkcomm += H_other.comm_abroad_digi;
				talkcomm += H_other.comm_abroad_packet;
				talkcomm += H_other.comm_domestic_digi;
				talkcomm = Math.round(talkcomm * (100 - disratio_pact) / 100);
				talkcomm += H_other.talk_abroad;
				this.apply_free(talkcomm, free);
			} else //B.2)会社単位の割引がない
			//国内パケット通信以外
			//:= 一般通話 * (1 - 電話単位の割引率)
			//+ 国際通話 + 通話その他 + 国際パケット通信 + 国際デジタル通信
			//+ 国内デジタル通信
			//- 無料通話通信
			//(1)国際パケット通信以外 := 一般通話
			//一般通話
			//(2)国際パケット通信以外に電話単位の割引率を適用する
			//(3)国際通話・通話その他・国際パケット通信・国際デジタル通信
			//+ 国内デジタル通信
			//国際通話
			//通話その他
			//国際デジタル
			//国際パケット通信
			//国内デジタル通信
			//(3)国際パケット通信以外に無料通話通信を適用する
			{
				talkcomm = 0;
				talkcomm += raw_talk;
				talkcomm = Math.round(talkcomm * (100 - disratio_tel) / 100);
				talkcomm += H_other.talk_abroad;
				talkcomm += H_other.talk_other;
				talkcomm += H_other.comm_abroad_digi;
				talkcomm += H_other.comm_abroad_packet;
				talkcomm += H_other.comm_domestic_digi;
				this.apply_free(talkcomm, free);
			}

		this.insert_log(H_log, "talkcomm_wo_comm_domestic", 0, talkcomm, "", UpdateRecomDocomo.g_log_talkcomm);
		if (H_tgt_packet.length && (H_tgt_packet.is_hodai || H_tgt_packet.is_hodai_mail)) free = 0;
		this.insert_log(H_log, "free_pass2", 0, free, "", UpdateRecomDocomo.g_log_talkcomm);
		var comm_domestic = 0;

		if (is_all) //D.1)会社単位の割引がある(ビジネスセイバー)
			//国内パケット通信
			//:= パケット通信 * (1 - 会社単位の割引率) - 無料通話通信
			//ただし、パケホーダイ系なら会社単位の割引率は反映しない
			//(1)国内パケット通信 := パケット通信
			//(2)国内パケット通信に会社単位の割引率を適用する
			//ただし、パケホーダイ系なら会社単位の割引率は反映しない
			//(3)国際パケット通信に無料通話通信を適用する
			{
				comm_domestic = 0;
				comm_domestic = raw_comm;

				if (H_tgt_packet.length && (H_tgt_packet.is_hodai || H_tgt_packet.is_hodai_mail)) //適用しない
					{} else comm_domestic = Math.round(comm_domestic * (100 - disratio_pact) / 100);

				this.apply_free(comm_domestic, free);
			} else //D.2)会社単位の割引がない
			//国内パケット通信
			//:= パケット通信 * (1 - 電話単位の割引率) - 無料通話通信
			//(1)国内パケット通信 := パケット通信
			//(2)国内パケット通信に電話単位の割引率を適用する
			//(3)国際パケット通信に無料通話通信を適用する
			{
				comm_domestic = 0;
				comm_domestic = raw_comm;
				comm_domestic = Math.round(comm_domestic * (100 - disratio_tel) / 100);
				this.apply_free(comm_domestic, free);
			}

		this.insert_log(H_log, "comm_domestic", 0, comm_domestic, "", UpdateRecomDocomo.g_log_talkcomm);
		talkcomm += comm_domestic;
		this.insert_log(H_log, "talkcomm_before_fixcharge", 0, talkcomm, "", UpdateRecomDocomo.g_log_talkcomm);

		if (H_tgt_packet.length) //定額通信料適用後通話通信料
			//:= 通話通信料
			//+ パケホーダイ定額通信料
			//+ (一般定額通信料 * (1 - 会社単位の割引率));
			{
				if (H_tgt_packet.is_hodai || H_tgt_packet.is_hodai_mail) //F.1)パケホーダイなら、パケホーダイ定額料を加算する
					{
						talkcomm += H_tgt_packet.fixcharge;
					} else //F.2)パケホーダイ以外なら、
					//一般定額通信料に割引率を反映して加算する
					{
						talkcomm += Math.round(H_tgt_packet.fixcharge * (100 - disratio_pact) / 100);
					}
			}

		this.insert_log(H_log, "talkcomm", 0, talkcomm, "", UpdateRecomDocomo.g_log_talkcomm);
		return talkcomm;
	}

	calc_talkcomm_wo_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], raw_talk, raw_comm, H_other) //新パケットを空配列にしてパケットパックありを呼び出す
	{
		return this.calc_talkcomm_w_packet(H_log, H_ave, H_param, H_disratio, H_tgt_plan, Array(), raw_talk, raw_comm, H_other);
	}

};