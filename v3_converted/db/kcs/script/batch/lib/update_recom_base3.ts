//===========================================================================
//機能：シミュレーションの基底部
//
//作成：森原
//===========================================================================
//===========================================================================
//機能：定数定義

//ソフトバンクのキャリアID
//ソフトバンクの携帯の回線種別ID
//プランIDの下限値
//パケットIDの下限値
//共通地域会社
//パケット上限(全)のデフォルト値
//パケット比率(メール)のデフォルト値(他キャリア間で使用する)
//スマートフォン回線種別で、スマートフォンを表すグループID
class UpdateRecomConst {
	static g_carid_softbank = 4;
	static g_cirid_softbank_tel = 11;
	static g_min_planid = 3000;
	static g_min_packetid = 3000;
	static g_arid_common = 100;
	static g_limit_all = 10000000;
	static g_packetratio_mail = 0.1;
	static g_smart_circuit_tb_groupid_smart = "1";
};

//静的なプラン一覧(全キャリアで共有する)
//静的なパケット一覧(全キャリアで共有する)
//同一視するプランIDの配列(全キャリアで共有する)
//同一視するパケットIDの配列(全キャリアで共有する)
//キャリアIDから買い方なしへのハッシュ
//プラン一覧(キャリア・simbefore・simafterで絞り込んでいない)
//パケット一覧(キャリア・simbefore・simafterで絞り込んでいない)
//同一視するプランIDの配列
//同一視するパケットIDの配列
//sim_log_tbへのデータ挿入型
//ログレベル
//シミュレーション結果のキャリアID
//シミュレーション結果の回線種別の配列
//パケットパックなしが必須の回線種別の配列
//すべての買い方
//違約金計算で、前月と見なす日付
//携帯のうち自キャリアの比率のデフォルト値
//シミュレーション候補になるプランIDの下限値
//シミュレーション候補になるパケットIDの下限値
//共通地域会社
//キャリアIDからペナルティ(charge,spanfrom,spanto)へのハッシュ
//回線種別 => array(プランID)(自キャリア・シミュレーション対象限定)
//データ専用 => array(プランID)(自キャリア・シミュレーション対象限定)
//買い方 => array(プランID)(自キャリア・シミュレーション対象限定)
//回線種別 => array(パケットID)(自キャリア・シミュレーション対象限定)
//パケホーダイフラグ => array(パケットID)
//すべてのキャリア・地域会社のパケットパックなしの配列
//回線種別 => 共通地域会社のパケットパックなし
//(自キャリア・シミュレーション対象限定)
//predataのうち、割引率を表すキー
//predataのうち、無ければゼロを補うキー
//統計情報平均値のデフォルト値
//顧客ID => キャリアID => 回線種別 => 会社単位割引率
//顧客単位割引率がある場合に利用できるパケットパック
//顧客単位割引率がある顧客(ただし、disratio_tbではなくpact_except_tb由来)
//sim_log_tbのcodeの添え字
//sim_log_tbのkeyの添え字
//sim_log_tbのvalueの添え字
//sim_log_tbのmemoの添え字
//sim_log_tbのplanidの添え字
//sim_log_tbのpacketidの添え自慰
//通常のログレベル
//448 := (256 | 128 | 64)
//結果のログレベル
//各キャリアで通話通信料を求める課程のログレベル
//平均値のログレベル
//simidの切り替えログレベル
//スマートフォン回線種別で、スマートフォンを表すID
//コンストラクタ
//機能：ハッシュにキーを渡して値を取り出す
//機能：シミュレーション結果のキャリアIDを返す
//機能：シミュレーション結果の回線種別を返す
//機能：同じプラングループに属するならtrueを返す
//機能：同じパケットグループに属するならtrueを返す
//機能：動作パラメータに数値パラメータがあればtrueを返す
//備考：手動入力条件があって請求明細が使えなければtrueを返す
//-----------------------------------------------------------------------
//機能：現在の買い方から、おすすめ後の買い方を配列に入れて返す
//-----------------------------------------------------------------------
//機能：シミュレーションを行い、sim_detaisl_tbに挿入するレコードを返す
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：シミュレーション結果をもとに、DBに挿入する値を作る(違約金も含む)
//機能：一個のsim_details_tbのデータを作る
//機能：sim_details_tbのデータの内、違約金の一方の側を作る
//-----------------------------------------------------------------------
//機能：最安のプラン・パケットの組み合わせを取り出す
//返値：深刻なエラーが発生したらfalseを返す
//機能：他キャリア時に当てはめる回線種別を返す
//機能：最安のプラン・パケットの組み合わせを取り出す
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：スマートフォンによるパケットパックの絞り込みを行わないならtrueを返す
//機能：回線種別・計算方法に応じたプラン・パケットを取り出す
//機能：最安値を取り出す
//返値：最安値の「planid,packetid」を返す
//最安値の組み合わせがなければ空文字列を返す
//機能：最安値のコードから、プランIDを取り出す
//機能：最安値のコードから、パケットIDを取り出す
//機能：現在のプランの課金単位秒数を返す
//-----------------------------------------------------------------------
//機能：パケットありで最安のプラン・パケットの組み合わせを取り出す
//返値：深刻なエラーが発生したらfalseを返す
//機能：パケットありで全候補から最安の組み合わせを取り出す
//返値：深刻なエラーが発生したらfalseを返す
//機能：パケットなしで最安のプラン・パケットの組み合わせを取り出す
//返値：深刻なエラーが発生したらfalseを返す
//機能：パケットなしで全候補から最安の組み合わせを取り出す
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：プラン・パケットの金額で、ゼロ円の結果を返す
//機能：特定の組み合わせで金額を求める(パケットパックあり)
//返値：深刻なエラーが発生したらfalseを返す
//機能：特定の組み合わせで金額を求める(パケットパックなし)
//返値：深刻なエラーが発生したらfalseを返す
//必要に応じて、平均値を補正する
//-----------------------------------------------------------------------
//機能：通話通信料を求める(パケットパックあり)
//機能：通話通信料を求める(パケットパック無し)
//機能：ある数値に無料分を反映する
//-----------------------------------------------------------------------
//機能：基本料割引率を返す
//返値：顧客全体にかかる割引率ならtrueを返す(シミュレーションでは使わない)
//機能：通話通信料割引率を返す
//返値：顧客全体にかかる割引率ならtrueを返す
//機能：基本料割引率か通話通信料割引率を返す
//返値：顧客全体にかかる割引率ならtrueを返す
//機能：sim_index_tbのdisratio_wayとdisratio_base,disratio_telが
//不正な組み合わせになっていたらtrueを返す
//機能：割引後の基本料を返す
//備考：新プラン基本料 * (1 - 基本料割引率)
//機能：一般通話とデジタル通信の通話秒数を求める
//機能：一般通話とデジタル通信の通話回数を求める
//機能：一般通話とデジタル通信の補正後秒数を求める
//機能：無料通話料反映前の通話料を求める
//機能：デジタル通信料を返す
//機能：一般とデジタルの通話秒数から、金額を求める
//機能：パケット数から各サービスでの通信料を求める(パケットマスターより)
//返値：array("mode" => ez通信料,
//"browse" => PCサイト通信料, "other" => その他)
//機能：パケット数から各サービスでの通信料を求める(プランマスターより)
//返値：array("mode" => ez通信料,
//"browse" => PCサイト通信料, "other" => その他)
//機能：パケット数から各サービスでの通信料を求める(共通)
//機能：通話通信その他をハッシュにして返す
//機能：国際通話の通話料を返す
//機能：国際通話通話その他の通話料を返す
//機能：国際デジタル通信の料金を返す
//機能：国際パケット通信の料金を返す
//-----------------------------------------------------------------------
//機能：違約金を計算して返す
//返値：違約金が発生しなければfalseを返す
//機能：計算開始日からの経過月数を返す
//返値：違約金が発生しなければfalseを返す
//備考：前月とみなす日付が32なら、au形式(常に月末までを一ヶ月とみなす)
//同、1なら、ドコモ形式(2日なら来月末までを一ヶ月とみなす)
//同、0なら、eMobile形式(常に、来月末までを一ヶ月とみなす)
//-----------------------------------------------------------------------
//機能：電話情報と、12ヶ月のデータを取り出す
//備考：結果は以下の形式
//array(
//"tel" => 電話のフェッチインスタンス,
//"month" => array(0 => 一ヶ月分のフェッチ情報...)
//)
//一ヶ月分のフェッチ情報は以下の形式
//array(
//"predata" => 基本料割引率などのフェッチインスタンス
//"trend" => 統計情報のフェッチインスタンス
//"trend_default" => 統計情報デフォルト値
//"top" => 上位利用回線のフェッチインスタンス
//)
//機能：電話情報と、12ヶ月のデータを解放する
//機能：一個の電話情報を取り出す
//備考：取り出した情報は以下の形式
//array(
//"tel" => 電話情報のハッシュ
//"predata" => array(12ヶ月分のハッシュ)
//"trend" => array(12ヶ月分のハッシュ)
//"top" => array(12ヶ月分のハッシュ)
//)
//predataの各月のハッシュは、code => valueの形式である。
//trendの各月のハッシュは、code => key => valueの形式である。
//topのハッシュは、
//totelnoの先頭に"T"を付けたキーから秒数へのハッシュである。
//返値：電話情報が残っていなければfalseを返す
//-----------------------------------------------------------------------
//機能：処理すべき電話番号を取得するSQL文を返す
//機能：基本料割引率などを取得するSQL文を返す
//機能：統計情報を取得するSQL文を返す
//機能：使用頻度の高い電話を取得するSQL文を返す
//機能：SQL文のWHERE節のうち、電話番号での絞り込み部分を作成する
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
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：回線種別ごとの会社全体の割引率をハッシュにして返す
//返値：不正な内容ならfalseを返す
//機能：ある部署の配下に属する部署を配列にして返す
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
class UpdateRecomBase extends ScriptDBAdaptor {
	static s_H_plan = undefined;
	static s_H_packet = undefined;
	static s_A_group_planid = undefined;
	static s_A_group_packetid = undefined;
	static g_log_normal = 448;
	static g_log_result = 256;
	static g_log_talkcomm = 8;
	static g_log_ave = 4;
	static g_log_convert = 4;

	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_inserter_log: TableInserterBase, assert, carid_after, A_cirid_after: {} | any[], A_cirid_packet_zero: {} | any[], A_buysel: {} | any[], penalty_limit, H_param: {} | any[]) //キャリア毎の買い方なし
	//引数をメンバに格納する
	//sim_log_tbの添え字を取り出しておく
	//プラン・パケットを読み出す
	//ペナルティマスターを作る
	//シミュレーション対象のプランIDを取り出す
	//シミュレーション対象のパケットIDを取り出す
	//パケットパックなしを読み出す
	//predataのうち、割引率を表すキー
	//predataのうち、無ければゼロを補うキー
	//統計情報平均値のデフォルト値
	//スマートフォン回線種別
	{
		super(listener, db, table_no);
		this.m_H_buysel_empty = {
			[G_CARRIER_DOCOMO]: 1,
			[G_CARRIER_AU]: 7,
			[UpdateRecomConst.g_carid_softbank]: 10
		};
		this.m_O_inserter_log = O_inserter_log;
		this.m_assert = assert;
		this.m_carid_after = carid_after;
		this.m_A_cirid_after = A_cirid_after;
		this.m_A_cirid_packet_zero = A_cirid_packet_zero;
		this.m_A_buysel = A_buysel;
		this.m_penalty_limit = penalty_limit;
		this.m_ratio_same_carrier = this.getValue(H_param, "ratio_same_carrier", 0);
		this.m_min_planid = this.getValue(H_param, "min_planid", UpdateRecomConst.g_min_planid);
		this.m_min_packetid = this.getValue(H_param, "min_packetid", UpdateRecomConst.g_min_packetid);
		this.m_arid_common = this.getValue(H_param, "arid_common", UpdateRecomConst.g_arid_common);
		this.m_H_disratio = Array();
		this.m_H_packetid_disratio_pact = Array();
		this.m_A_pactid_disratio_pact = Array();
		this.m_log_index_code = this.m_O_inserter_log.getIndex("code");
		this.m_log_index_key = this.m_O_inserter_log.getIndex("key");
		this.m_log_index_value = this.m_O_inserter_log.getIndex("value");
		this.m_log_index_memo = this.m_O_inserter_log.getIndex("memo");
		this.m_log_index_planid = this.m_O_inserter_log.getIndex("planid");
		this.m_log_index_packetid = this.m_O_inserter_log.getIndex("packetid");

		if (!(undefined !== UpdateRecomBase.s_H_plan) || !(undefined !== UpdateRecomBase.s_H_packet)) //買い方テーブルを読み出す
			//プランに適用できるパケットIDを読み出す
			//プラン一覧を読み出す
			//パケットマスターの読み出し
			//同一視するプラン配列を作る
			//比較するカラム名
			//比較するカラム名の値を連結したキー => array(ID)
			//同一視するパケット配列を作る
			//比較するカラム名
			//比較するカラム名の値を連結したキー => array(ID)
			//他のキャリアで使えるように、静的メンバに保存する
			{
				var H_buysel = Array();
				var sql = "select buyselid" + ",buyselname" + ",(case when penaltyflg then 1 else 0 end) as penaltyflg" + " from buyselect_tb order by buyselid;";
				var result = this.m_db.getHash(sql);

				for (var H_line of Object.values(result)) H_buysel[H_line.buyselid] = H_line;

				{
					let _tmp_0 = this.m_H_buysel_empty;

					for (var carid in _tmp_0) {
						var buyselid = _tmp_0[carid];

						if (!(undefined !== H_buysel[buyselid])) {
							this.putError(G_SCRIPT_ERROR, "\u8CB7\u3044\u65B9\u306A\u3057\u304C\u5B58\u5728\u3057\u306A\u3044" + carid + "/" + buyselid);
						}
					}
				}
				var H_plan_rel_packet = Array();
				sql = "select planid,packetid from plan_rel_packet_tb;";
				result = this.m_db.getHash(sql);

				for (var H_line of Object.values(result)) {
					var planid = H_line.planid;
					var packetid = H_line.packetid;
					if (!(undefined !== H_plan_rel_packet[planid])) H_plan_rel_packet[planid] = Array();
					H_plan_rel_packet[planid].push(packetid);
				}

				var A_key = ("planid,planname,basic,free" + ",carid,cirid,charge,arid" + ",chgunit,nightcharge,digicharge,digichgunit" + ",nightdigicharge,charge_mode,charge_browse,charge_other" + ",chargefix,nightchargefix" + ",digichargefix,nightdigichargefix" + ",buyselid" + ",limit_mode,limit_browse,limit_all,limit_free").split(",");
				var A_key_planid = A_key;
				var A_key_boolean = "simbefore,simafter,is_data,is_hodai_mail".split(",");
				this.m_H_plan = Array();
				sql = "select ";
				var comma = false;

				for (var key of Object.values(A_key)) {
					sql += comma ? "," : " ";
					comma = true;
					sql += "plan_tb." + key + " as " + key;
				}

				for (var key of Object.values(A_key_boolean)) {
					sql += ",(case when plan_tb." + key + " then 1 else 0 end) as " + key;
				}

				sql += " from plan_tb";
				sql += ";";
				result = this.m_db.getHash(sql);
				var H_key_from_to = {
					charge: "chargefix",
					nightcharge: "nightchargefix",
					digicharge: "digichargefix",
					nightdigicharge: "nightdigichargefix"
				};

				for (var H_line of Object.values(result)) //メールホーダイ系ならデータ専用フラグをfalseにする
				//買い方が無ければ買い方なしとする
				//無料パケットその他(金額)のデータを作る(ドコモデータ専用)
				{
					planid = H_line.planid;
					H_line.packet = Array();
					if (H_line.is_hodai_mail) H_line.is_data = 0;
					if (undefined !== H_plan_rel_packet[planid]) H_line.packet = H_plan_rel_packet[planid];

					for (var from in H_key_from_to) {
						var to = H_key_from_to[from];
						if (undefined !== H_line[from] && !(undefined !== H_line[to])) H_line[to] = H_line[from];
					}

					if (!(undefined !== H_line.buyselid) && undefined !== this.m_H_buysel_empty[H_line.carid]) H_line.buyselid = this.m_H_buysel_empty[H_line.carid];

					if (undefined !== H_line.buyselid && undefined !== H_buysel[H_line.buyselid]) {
						{
							let _tmp_1 = H_buysel[H_line.buyselid];

							for (var key in _tmp_1) {
								var value = _tmp_1[key];
								H_line[key] = value;
							}
						}
					} else {
						H_line.buyselname = "";
						H_line.penaltyflg = 0;
					}

					H_line.free_packet_other = 0;

					if (H_line.is_data && G_CARRIER_DOCOMO == H_line.carid && (G_CIRCUIT_FOMA == H_line.cirid || G_CIRCUIT_MOVA == H_line.cirid)) {
						H_line.free_packet_other = H_line.free;
						H_line.free = 0;
					}

					this.m_H_plan[planid] = H_line;
				}

				A_key = ("packetid,packetname" + ",charge,fixcharge,freecharge,carid,cirid,arid" + ",charge_mode,charge_browse,charge_other" + ",limit_mode,limit_browse,limit_free,limit_all").split(",");
				var A_key_packetid = A_key;
				A_key_boolean = "simbefore,simafter,is_hodai,is_hodai_mail,is_empty".split(",");
				this.m_H_packet = Array();
				sql = "select ";
				sql += A_key.join(",");

				for (var key of Object.values(A_key_boolean)) {
					sql += ",(case when " + key + " then 1 else 0 end) as " + key;
				}

				sql += " from packet_tb";
				sql += ";";
				result = this.m_db.getHash(sql);

				for (var H_line of Object.values(result)) //無料パケットその他を入れる(ダミーなので常にゼロ)
				//メールホーダイ系なら、パケホーダイ系フラグをfalseにする
				{
					packetid = H_line.packetid;
					H_line.free_packet_other = 0;
					if (undefined !== H_line.is_hodai_mail && H_line.is_hodai_mail) H_line.is_hodai = 0;
					this.m_H_packet[packetid] = H_line;
				}

				A_key = Array();
				var A_key_expire = ("planid,planname,cirid,arid,arid,buyselid" + ",simbefore,simafter").split(",");

				for (var key of Object.values(A_key_planid)) if (!(-1 !== A_key_expire.indexOf(key))) A_key.push(key);

				var H_all = Array();
				{
					let _tmp_2 = this.m_H_plan;

					for (var planid in _tmp_2) {
						var H_plan = _tmp_2[planid];
						var label = "";

						for (var key of Object.values(A_key)) {
							label += ",";
							if (undefined !== H_plan[key]) label += H_plan[key];
						}

						if (!(undefined !== H_all[label])) H_all[label] = Array();
						H_all[label].push(planid);
					}
				}
				this.m_A_group_planid = Array();

				for (var label in H_all) {
					var A_id = H_all[label];
					this.m_A_group_planid.push(A_id);
				}

				A_key = Array();
				A_key_expire = "packetid,packetname,cirid,arid,simbefore,simafter".split(",");

				for (var key of Object.values(A_key_packetid)) if (!(-1 !== A_key_expire.indexOf(key))) A_key.push(key);

				H_all = Array();
				{
					let _tmp_3 = this.m_H_packet;

					for (var packetid in _tmp_3) {
						var H_packet = _tmp_3[packetid];
						label = "";

						for (var key of Object.values(A_key)) {
							label += ",";
							if (undefined !== H_packet[key]) label += H_packet[key];
						}

						if (!(undefined !== H_all[label])) H_all[label] = Array();
						H_all[label].push(packetid);
					}
				}
				this.m_A_group_packetid = Array();

				for (var label in H_all) {
					var A_id = H_all[label];
					this.m_A_group_packetid.push(A_id);
				}

				UpdateRecomBase.s_H_plan = this.m_H_plan;
				UpdateRecomBase.s_H_packet = this.m_H_packet;
				UpdateRecomBase.s_A_group_planid = this.m_A_group_planid;
				UpdateRecomBase.s_A_group_packetid = this.m_A_group_packetid;
			} else //すでに他のキャリアで読み出し済みなので、その値を使う
			{
				this.m_H_plan = UpdateRecomBase.s_H_plan;
				this.m_H_packet = UpdateRecomBase.s_H_packet;
				this.m_A_group_planid = UpdateRecomBase.s_A_group_planid;
				this.m_A_group_packetid = UpdateRecomBase.s_A_group_packetid;
			}

		this.m_H_penalty = Array();
		sql = "select carid,chargetype,charge,spanfrom,spanto";
		sql += " from penalty_tb where keyidtype='BS'";
		sql += " order by spanfrom,spanto";
		sql += ";";
		result = this.m_db.getHash(sql);

		for (var H_line of Object.values(result)) {
			var carid = H_line.carid;
			if (!(undefined !== this.m_H_penalty[carid])) this.m_H_penalty[carid] = Array();
			this.m_H_penalty[carid].push(H_line);
		}

		this.m_H_planid_cirid = Array();

		for (var cirid of Object.values(this.m_A_cirid_after)) this.m_H_planid_cirid[cirid] = Array();

		this.m_H_planid_data = Array();
		this.m_H_planid_data[0] = Array();
		this.m_H_planid_data[1] = Array();
		this.m_H_planid_buysel = Array();

		for (var buysel of Object.values(this.m_A_buysel)) this.m_H_planid_buysel[buysel] = Array();

		{
			let _tmp_4 = this.m_H_plan;

			for (var planid in _tmp_4) {
				var H_plan = _tmp_4[planid];
				if (planid < this.m_min_planid) continue;
				if (this.m_carid_after != H_plan.carid) continue;
				if (!(-1 !== this.m_A_cirid_after.indexOf(H_plan.cirid))) continue;
				if (!H_plan.simafter) continue;
				var cirid = H_plan.cirid;
				this.m_H_planid_cirid[cirid].push(planid);
				var is_data = H_plan.is_data;
				this.m_H_planid_data[is_data].push(planid);
				var buysel = H_plan.buyselid;
				if (-1 !== this.m_A_buysel.indexOf(buysel)) this.m_H_planid_buysel[buysel].push(planid);
			}
		}
		this.m_H_packetid_cirid = Array();

		for (var cirid of Object.values(this.m_A_cirid_after)) this.m_H_packetid_cirid[cirid] = Array();

		this.m_H_packetid_hodai = Array();
		this.m_H_packetid_hodai[0] = Array();
		this.m_H_packetid_hodai[1] = Array();
		{
			let _tmp_5 = this.m_H_packet;

			for (var packetid in _tmp_5) {
				var H_packet = _tmp_5[packetid];
				if (packetid < this.m_min_packetid) continue;
				if (this.m_carid_after != H_packet.carid) continue;
				if (!(-1 !== this.m_A_cirid_after.indexOf(H_packet.cirid))) continue;
				if (!H_packet.simafter) continue;
				cirid = H_packet.cirid;
				this.m_H_packetid_cirid[cirid].push(packetid);
				var is_hodai = H_packet.is_hodai;
				this.m_H_packetid_hodai[is_hodai].push(packetid);
			}
		}
		this.m_A_packet_zero_all = Array();
		this.m_H_packet_zero = Array();
		{
			let _tmp_6 = this.m_H_packet;

			for (var packetid in _tmp_6) {
				var H_packet = _tmp_6[packetid];
				if (!H_packet.is_empty) continue;
				cirid = H_packet.cirid;
				this.m_A_packet_zero_all.push(packetid);
				if (packetid < this.m_min_packetid) continue;
				if (this.m_carid_after != H_packet.carid) continue;
				if (!(-1 !== this.m_A_cirid_after.indexOf(H_packet.cirid))) continue;
				if (this.m_arid_common != H_packet.arid) continue;
				this.m_H_packet_zero[cirid] = packetid;
			}
		}

		for (var cirid of Object.values(A_cirid_packet_zero)) {
			if (!(undefined !== this.m_H_packet_zero[cirid])) {
				this.putError(G_SCRIPT_WARNING, "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306A\u3057\u304C\u5B58\u5728\u3057\u306A\u3044/cirid:=" + cirid + "/arid:=" + this.m_arid_common);
			}
		}

		this.m_A_predata_disratio = ["predata_disratiobasic", "predata_disratiotalk"];
		this.m_A_predata_required = ["predata_basic", "predata_disbasic", "predata_talk", "predata_distalk", "predata_com", "predata_discom", "predata_disother", "predata_fix", "predata_other", "predata_tax", "predata_disratiobasic", "predata_disratiotalk"];
		this.m_H_ave_trend_default = Array();
		this.m_A_smpcirid_smart = Array();
		sql = "select smpcirid from smart_circuit_tb" + " where groupid in (" + UpdateRecomConst.g_smart_circuit_tb_groupid_smart + ")" + ";";
		result = this.m_db.getHash(sql);

		for (var H_line of Object.values(result)) {
			this.m_A_smpcirid_smart.push(H_line.smpcirid);
		}
	}

	getValue(H_src: {} | any[], key, def) {
		if (undefined !== H_src[key]) return H_src[key];
		return def;
	}

	get_carid_after() {
		return this.m_carid_after;
	}

	get_cirid_after() {
		return this.m_A_cirid_after;
	}

	is_transparent_plan(planid_src, planid_dst) {
		for (var A_id of Object.values(this.m_A_group_planid)) {
			if (-1 !== A_id.indexOf(planid_src) && -1 !== A_id.indexOf(planid_dst)) return true;
		}

		return false;
	}

	is_transparent_packet(packetid_src, packetid_dst) {
		for (var A_id of Object.values(this.m_A_group_packetid)) {
			if (-1 !== A_id.indexOf(packetid_src) && -1 !== A_id.indexOf(packetid_dst)) return true;
		}

		return false;
	}

	is_not_transparent(H_param: {} | any[]) {
		if (undefined !== H_param.ratio_cellular || undefined !== H_param.ratio_same_carrier || undefined !== H_param.ratio_daytime || undefined !== H_param.ratio_increase_tel || undefined !== H_param.ratio_increase_comm) {
			this.putError(G_SCRIPT_DEBUG, "\u6570\u5024\u30D1\u30E9\u30E1\u30FC\u30BF\u3042\u308A/\u8ACB\u6C42\u660E\u7D30\u3067\u306F\u306A\u304F\u901A\u8A71\u901A\u4FE1\u660E\u7D30\u3092\u5229\u7528\u3059\u308B");
			return true;
		}

		return false;
	}

	get_buysel(is_penalty, H_tel: {} | any[], buysel_before, is_change_course, is_change_carrier) //派生型で実装する
	{
		is_penalty = false;
		buysel_before = this.m_H_plan[H_tel.planid].buyselid;
		return [buysel_before];
	}

	calc(is_error, A_details: {} | any[], H_tel: {} | any[], H_ave: {} | any[], A_param: {} | any[], H_disratio: {} | any[], pactid, monthcnt, cur_date, is_change_carrier) //実行パラメータを取り出す
	{
		is_error = false;
		var H_param = undefined;
		var H_is_change_hodai = Array();

		for (var H_item of Object.values(A_param)) //フラグを取り出す
		{
			if (!(undefined !== H_item.simid)) H_item.simid = -1;

			if (!(undefined !== H_param)) {
				H_param = H_item;
			} else //移動先のシミュレーションIDをログに残す
				{
					var H_log = this.m_O_inserter_log.getEmpty(false);
					H_log[this.m_O_inserter_log.getIndex("simid")] = H_item.simid;
					H_log[this.m_O_inserter_log.getIndex("pactid")] = pactid;
					H_log[this.m_O_inserter_log.getIndex("carid")] = this.get_carid_after();
					H_log[this.m_O_inserter_log.getIndex("recdate")] = date("Y-m-d H:i:s");
					H_log[this.m_O_inserter_log.getIndex("monthcnt")] = monthcnt;
					H_log[this.m_O_inserter_log.getIndex("telno")] = this.m_O_inserter_log.escapeStr(H_tel.telno);
					H_log[this.m_O_inserter_log.getIndex("planid")] = -1;
					H_log[this.m_O_inserter_log.getIndex("packetid")] = -1;
					this.insert_log(H_log, "convert_to", 0, H_param.simid, "", UpdateRecomBase.g_log_convert);
				}

			var is_change_hodai = this.getValue(H_item, "change_packet_free_mode", 0);
			var is_change_course = this.getValue(H_item, "is_change_course", 0);
			if (!(undefined !== H_is_change_hodai[is_change_hodai])) H_is_change_hodai[is_change_hodai] = Array();
			var A_is_change_course = Array();

			if (0 == is_change_course) {
				A_is_change_course.push(0);
			} else if (1 == is_change_course) {
				A_is_change_course.push(1);
			}

			for (var is of Object.values(A_is_change_course)) {
				if (!(undefined !== H_is_change_hodai[is_change_hodai][is])) H_is_change_hodai[is_change_hodai][is] = Array();
				H_is_change_hodai[is_change_hodai][is].push(H_item.simid);
			}
		}

		if (!(undefined !== H_param)) return true;
		if (-1 !== this.m_A_pactid_disratio_pact.indexOf(pactid)) this.putError(G_SCRIPT_INFO, "pactid_disratio_pact" + "\u306B\u9867\u5BA2ID\u304C\u3042\u308B");
		var H_result_hodai = Array();
		var H_penalty = Array();
		if (!this.calc_all(is_error, H_result_hodai, H_penalty, H_is_change_hodai, H_tel, H_ave, H_param, H_disratio, "", pactid, monthcnt, cur_date, is_change_carrier)) return false;
		if (is_error) return true;
		this.calc_result_all(A_details, H_tel, A_param, H_ave, H_result_hodai, H_penalty, is_change_carrier);
		return true;
	}

	calc_result_all(A_details: {} | any[], H_tel: {} | any[], A_param: {} | any[], H_ave: {} | any[], H_result_hodai: {} | any[], H_penalty: {} | any[], is_change_carrier) //実行パラメータに対してループする
	{
		for (var H_param of Object.values(A_param)) {
			var is_change_hodai = this.getValue(H_param, "change_packet_free_mode", 0);

			if (!(undefined !== H_result_hodai[is_change_hodai])) {
				this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30DB\u30FC\u30C0\u30A4\u30D5\u30E9\u30B0\u5074\u306E\u30C7\u30FC\u30BF\u5B58\u5728\u305B\u305A" + is_change_hodai);
				continue;
			}

			var is_change_course = this.getValue(H_param, "is_change_course", 0);

			if (!(undefined !== H_result_hodai[is_change_hodai][is_change_course])) {
				this.putError(G_SCRIPT_INFO, "\u8CB7\u3044\u65B9\u5074\u306E\u30C7\u30FC\u30BF\u5B58\u5728\u305B\u305A" + is_change_hodai + "/" + is_change_course);
				continue;
			}

			if (!(undefined !== H_result_hodai[is_change_hodai][is_change_course][0])) {
				this.putError(G_SCRIPT_INFO, "0\u4EF6\u76EE\u306E\u30C7\u30FC\u30BF\u5B58\u5728\u305B\u305A" + is_change_hodai + "/" + is_change_course);
				continue;
			}

			var penalty = undefined;
			if (undefined !== H_penalty[is_change_course]) penalty = H_penalty[is_change_course];
			this.calc_result(A_details, H_tel, H_param, H_ave, H_result_hodai, penalty, is_change_hodai, is_change_course, is_change_carrier);
		}
	}

	calc_result(A_details: {} | any[], H_tel, H_param: {} | any[], H_ave: {} | any[], H_result_hodai: {} | any[], penalty, is_change_hodai, is_change_course, is_change_carrier) //1件目があればtrue
	//現在のプラン・パケット
	//削減前の値を集計する
	//削減前平均支払額 := 削減前基本料 + 削減前通話通信料 + 削減前その他
	//使用頻度の高い電話を設定する
	//現在のプラン・パケット
	//1件目存在フラグ
	//違約金があるか
	//結果を保存する
	{
		var H_result = H_result_hodai[is_change_hodai][is_change_course];
		var is_result_1 = undefined !== H_result[1] && H_result[1].length;
		var curkey = H_tel.planid + ",";
		if (undefined !== H_tel.packetid) curkey += H_tel.packetid;
		var H_details = {
			simid: H_param.simid,
			telno: H_tel.telno,
			recdate: "now()",
			is_override: "false"
		};
		var H_keys = {
			basic_before: ["predata_basic", "predata_disbasic"],
			tel_before: ["predata_talk", "predata_distalk", "predata_com", "predata_discom", "predata_disother", "predata_fix"],
			etc_before: ["predata_other"]
		};

		for (var tgt in H_keys) {
			var A_src = H_keys[tgt];
			H_details[tgt] = 0;

			for (var src of Object.values(A_src)) H_details[tgt] += H_ave.predata[src];

			H_details[tgt] = Math.round(H_details[tgt]);
		}

		H_details.charge_before = Math.round(H_details.basic_before + H_details.tel_before + H_details.etc_before);

		for (var cnt = 1; cnt <= 5; ++cnt) H_details["mass_target_" + cnt] = "";

		cnt = 1;
		{
			let _tmp_7 = H_ave.top;

			for (var totelno in _tmp_7) {
				var sec = _tmp_7[totelno];
				var totelno = totelno.substr(1);
				H_details["mass_target_" + cnt] = totelno;
				++cnt;
				if (5 < cnt) break;
			}
		}
		curkey = H_tel.planid + ",";
		if (undefined !== H_tel.packetid) curkey += H_tel.packetid;

		for (cnt = 0;; cnt < 2; ++cnt) {
			if (!(undefined !== H_result[cnt]) || !H_result[cnt].length) continue;
			this.calc_result_item(H_details, H_tel, H_param, H_ave, curkey, H_result[cnt].minkey, H_result[cnt].charge, cnt ? "_poor" : "", is_change_carrier, cnt, is_result_1);
		}

		H_details.is_poor = is_result_1 ? "true" : "false";

		if (undefined !== penalty && is_result_1) //違約金を設定する
			//違約金を支払っても安くなる月数を求める
			{
				H_details.is_penalty = "true";
				H_details.money_penalty = penalty;

				if (undefined !== H_details.charge_after_poor) {
					var denominator = H_details.charge_after - H_details.charge_after_poor;

					if (denominator) {
						H_details.monthcnt_penalty = penalty / denominator;
						if (H_details.monthcnt_penalty < 0) H_details.monthcnt_penalty = 0;else H_details.monthcnt_penalty = Math.ceil(H_details.monthcnt_penalty);
					} else H_details.monthcnt_penalty = 0;
				}
			} else {
			H_details.is_penalty = "false";
		}

		A_details.push(H_details);
	}

	calc_result_item(H_details: {} | any[], H_tel: {} | any[], H_param: {} | any[], H_ave: {} | any[], curkey, minkey, H_charge: {} | any[], postfix, is_change_carrier, is_poor, is_result_1) //現在と同じ買い方
	//元のプランを取り出す
	{
		var mincharge = H_charge.charge;
		var minbasic = H_charge.basic;
		var mintalkcomm = H_charge.talkcomm;
		var minother = H_charge.othersum;
		var is_same = false;
		if (is_result_1 && is_poor) is_same = true;
		if (!is_result_1 && !is_poor) is_same = true;
		var is_not_trans = this.is_not_transparent(H_param);
		if (!is_change_carrier && is_same && !is_not_trans && H_details.charge_before <= mincharge) minkey = curkey;

		if (strstr(minkey, ",")) {
			var A_minkey = minkey.split(",");
			var minplan = A_minkey[0];
			var minpacket = A_minkey[1];
			H_details["planid" + postfix] = A_minkey[0];
			if (minpacket.length) H_details["packetid" + postfix] = A_minkey[1];else H_details["packetid" + postfix] = undefined;
		} else {
			H_details["planid" + postfix] = minkey;
			H_details["packetid" + postfix] = undefined;
		}

		var curplan = curkey;
		var curpacket = undefined;

		if (strstr(curkey, ",")) {
			var A_curkey = curkey.split(",");
			curplan = A_curkey[0];
			if (A_curkey[1].length) curpacket = A_curkey[1];
		}

		var is_transparent_plan = this.is_transparent_plan(curplan, H_details["planid" + postfix]);
		var is_transparent_packet = true;

		if (curpacket.length || H_details["packetid" + postfix].length) {
			is_transparent_packet = this.is_transparent_packet(curpacket.length ? curpacket : "", H_details["packetid" + postfix].length ? H_details["packetid" + postfix] : "");
		}

		if (is_transparent_plan && is_transparent_packet && !is_not_trans) //削減前と削減後のプランが等しい場合は、
			//支払総額・削減後基本料・通話通信料・その他
			//:= それぞれ削減前の値
			//他キャリアはこの条件は絶対に成立しない
			//数値パラメータがある場合も、こちらは成立しない
			{
				H_details["charge_after" + postfix] = H_details.charge_before;
				H_details["basic_after" + postfix] = H_details.basic_before;
				H_details["tel_after" + postfix] = H_details.tel_before;
				H_details["etc_after" + postfix] = H_details.etc_before;

				if (is_result_1) {
					if (1 == is_poor) H_details.is_override = "true";
				} else {
					if (0 == is_poor) H_details.is_override = "true";
				}
			} else //削減後通話通信料 := おすすめ通話通信料
			//削減後その他 := おすすめその他
			//削減後支払い総額 := 後基本料 + 後通話通信料 + 後その他
			{
				if (is_transparent_plan && !is_not_trans) //元のプランと同じなら、削減後基本料:=削減前基本料
					//ただし、数値パラメータがあれば成立しない
					{
						H_details["basic_after" + postfix] = H_details.basic_before;
					} else //でなければ、削減後基本料 := おすすめ基本料
					{
						H_details["basic_after" + postfix] = Math.round(minbasic);
					}

				H_details["tel_after" + postfix] = Math.round(mintalkcomm);
				H_details["etc_after" + postfix] = Math.round(minother);
				H_details["charge_after" + postfix] = Math.round(H_details["basic_after" + postfix] + H_details["tel_after" + postfix] + H_details["etc_after" + postfix]);

				if (!is_change_carrier && is_same && !is_not_trans && H_details.charge_before < H_details["charge_after" + postfix]) //自キャリアであり、
					//現在と同じ買い方であり、
					//数値パラメータがなく、
					//かつ削減後支払額が削減前支払額より大きい場合は、
					//削減後支払額を削減前支払額とする(削減額をゼロにする)
					//その場合の差額の調整は、まず通話料を削減し、
					//それでも差額がある場合は基本料を削減し、
					//最後にその他を削減する。
					//のこり調整額
					{
						var remain = H_details["charge_after" + postfix] - H_details.charge_before;
						H_details["charge_after" + postfix] = H_details.charge_before;
						var keys = ["tel_after", "basic_after", "etc_after"];

						for (var key of Object.values(keys)) {
							if (remain <= 0) break;

							if (remain < H_details[key + postfix]) {
								H_details[key + postfix] -= remain;
								remain = 0;
							} else if (0 < H_details[key + postfix]) {
								remain -= H_details[key + postfix];
								H_details[key + postfix] = 0;
							}
						}
					}
			}
	}

	calc_all(is_error, H_result_hodai: {} | any[], H_penalty: {} | any[], H_is_change_hodai: {} | any[], H_tel: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], memo, pactid, monthcnt, cur_date, is_change_carrier) //割引率が100%を超えたら処理を終了する
	//適用可能なプラン・パケットの一覧を取り出す
	//回線種別ごとの処理を行う
	{
		is_error = false;
		H_result_hodai = Array();
		H_penalty = Array();
		var A_key = this.m_A_predata_disratio;

		for (var key of Object.values(A_key)) {
			if (100 < H_ave.predata[key]) {
				this.putError(G_SCRIPT_INFO, key + "\u304C100\u3092\u8D85\u3048\u305F\u306E\u3067\u51E6\u7406\u305B\u305A" + H_tel.telno);
				return true;
			}
		}

		if (this.is_error_disratio(H_param)) {
			return true;
		}

		var H_log = this.m_O_inserter_log.getEmpty(false);
		H_log[this.m_O_inserter_log.getIndex("simid")] = this.getValue(H_param, "simid", -1);
		H_log[this.m_O_inserter_log.getIndex("pactid")] = pactid;
		H_log[this.m_O_inserter_log.getIndex("carid")] = this.get_carid_after();
		H_log[this.m_O_inserter_log.getIndex("recdate")] = date("Y-m-d H:i:s");
		H_log[this.m_O_inserter_log.getIndex("monthcnt")] = monthcnt;
		H_log[this.m_O_inserter_log.getIndex("telno")] = this.m_O_inserter_log.escapeStr(H_tel.telno);
		var A_planid = Array();
		var A_packetid = Array();
		var H_planid_course = Array();
		var H_packetid_hodai = Array();
		var H_is_penalty = Array();

		if (is_change_carrier) //他キャリアならキャリアごとの指定の回線種別とする
			{
				this.get_plan_packet(A_planid, A_packetid, H_planid_course, H_packetid_hodai, H_is_penalty, H_tel, this.get_cirid_change_carrier(), H_is_change_hodai, is_change_carrier, H_ave, H_param, H_log);
			} else //元の回線種別とする
			{
				this.get_plan_packet(A_planid, A_packetid, H_planid_course, H_packetid_hodai, H_is_penalty, H_tel, H_tel.cirid, H_is_change_hodai, is_change_carrier, H_ave, H_param, H_log);
			}

		if (this.getValue(H_is_penalty, 0, false) || this.getValue(H_is_penalty, 1, false)) //違約金を計算する
			{
				var penalty = 0;
				var is_penalty = this.calc_penalty(penalty, H_tel, cur_date);

				if (is_penalty) {
					for (var key in H_is_penalty) {
						var value = H_is_penalty[key];
						H_penalty[key] = penalty;
					}
				}
			}

		this.insert_log_ave(H_log, H_ave);
		return this.calc_all_cirid(H_result_hodai, H_is_change_hodai, H_tel, H_log, H_ave, H_param, H_disratio, A_planid, A_packetid, H_planid_course, H_packetid_hodai, memo, is_change_carrier);
	}

	get_cirid_change_carrier() //派生型で実装する
	{
		return 0;
	}

	calc_all_cirid(H_result_hodai, H_is_change_hodai: {} | any[], H_tel: {} | any[], H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], A_planid: {} | any[], A_packetid: {} | any[], H_planid_course: {} | any[], H_packetid_hodai: {} | any[], memo, is_change_carrier) //データ専用・回線種別に応じて分岐する
	{
		if (this.m_H_plan[H_tel.planid].is_data) //データ専用である
			{
				return this.calc_all_wo_packet(H_result_hodai, H_is_change_hodai, H_tel, H_log, H_ave, H_param, H_disratio, A_planid, A_packetid, H_planid_course, H_packetid_hodai, memo, is_change_carrier, true);
			}

		var cirid = is_change_carrier ? this.get_cirid_change_carrier() : H_tel.cirid;

		if (-1 !== this.m_A_cirid_after.indexOf(cirid)) //シミュレーション対象の回線種別である
			{
				if (-1 !== this.m_A_cirid_packet_zero.indexOf(cirid)) {
					if (!(undefined !== this.m_H_packet[H_tel.packetid])) {
						if (!(undefined !== this.m_H_packet_zero[cirid])) {
							this.putError(G_SCRIPT_INFO, "\u73FE\u884C\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u5B58\u5728\u305B\u305A" + H_tel.telno + "/" + cirid);
							return true;
						}

						H_tel.packetid = this.m_H_packet_zero[cirid];
					}

					return this.calc_all_w_packet(H_result_hodai, H_is_change_hodai, H_tel, H_log, H_ave, H_param, H_disratio, A_planid, A_packetid, H_planid_course, H_packetid_hodai, memo, is_change_carrier, false);
				} else //MOVAなど、パケットパックの存在しない回線種別である
					{
						return this.calc_all_wo_packet(H_result_hodai, H_is_change_hodai, H_tel, H_log, H_ave, H_param, H_disratio, A_planid, A_packetid, H_planid_course, H_packetid_hodai, memo, is_change_carrier, false);
					}
			}

		return true;
	}

	is_ignore_smart() {
		return true;
	}

	get_plan_packet(A_planid: {} | any[], A_packetid: {} | any[], H_planid_course: {} | any[], H_packetid_hodai: {} | any[], H_is_penalty: {} | any[], H_tel: {} | any[], cirid, H_is_change_hodai: {} | any[], is_change_carrier, H_ave: {} | any[], H_param: {} | any[], H_log: {} | any[]) //スマートフォン種別を取り出す
	//パケットパックをパケホーダイフラグに応じて分割する
	//他キャリアか否かで分岐
	//プラン・パケットの選択肢を記録する
	{
		A_planid = Array();
		A_packetid = Array();
		H_planid_course = {
			0: Array(),
			1: Array()
		};
		H_packetid_hodai = {
			0: Array(),
			1: Array(),
			2: Array()
		};
		H_is_penalty = {
			0: false,
			1: false
		};
		var is_smart = false;

		if (undefined !== H_tel.smpcirid && H_tel.smpcirid.length) {
			for (var id of Object.values(this.m_A_smpcirid_smart)) if (id === H_tel.smpcirid) is_smart = true;
		}

		if (undefined !== H_tel.smpcirid_cur && H_tel.smpcirid_cur.length) {
			for (var id of Object.values(this.m_A_smpcirid_smart)) if (id === H_tel.smpcirid_cur) is_smart = true;
		}

		if (this.is_ignore_smart()) is_smart = false;
		var is_cur_hodai = false;
		var is_cur_empty = false;

		if (undefined !== H_tel.packetid && undefined !== this.m_H_packet[H_tel.packetid]) {
			is_cur_hodai = this.m_H_packet[H_tel.packetid].is_hodai;
			is_cur_empty = this.m_H_packet[H_tel.packetid].is_empty;
		}

		if (undefined !== this.m_H_planid_cirid[cirid]) A_planid = this.m_H_planid_cirid[cirid];
		if (undefined !== this.m_H_packetid_cirid[cirid]) A_packetid = this.m_H_packetid_cirid[cirid];

		if (-1 !== this.m_A_pactid_disratio_pact.indexOf(H_param.pactid) && undefined !== this.m_H_packetid_disratio_pact[cirid]) {
			for (var packetid of Object.values(this.m_H_packetid_disratio_pact[cirid])) {
				if (!(-1 !== A_packetid.indexOf(packetid))) A_packetid.push(packetid);
			}
		}

		var buysel_before = this.m_H_plan[H_tel.planid].buyselid;
		var A_is_change_course = Array();

		for (var H_is_change_course of Object.values(H_is_change_hodai)) {
			for (var is_change_course in H_is_change_course) {
				var A_simid = H_is_change_course[is_change_course];
				if (!(-1 !== A_is_change_course.indexOf(is_change_course))) A_is_change_course.push(is_change_course);
			}
		}

		for (var is_change_course of Object.values(A_is_change_course)) {
			var is_penalty = false;
			var A_buysel = this.get_buysel(is_penalty, H_tel, buysel_before, is_change_course, is_change_carrier);
			H_is_penalty[is_change_course] = is_penalty;
			var A_id = Array();

			for (var buysel of Object.values(A_buysel)) {
				if (undefined !== this.m_H_planid_buysel[buysel]) for (var id of Object.values(this.m_H_planid_buysel[buysel])) if (!(-1 !== A_id.indexOf(id))) A_id.push(id);
			}

			H_planid_course[is_change_course] = array_intersect(A_planid, A_id);
		}

		if (is_change_carrier) //他キャリア間である
			//パケホーダイ変更ありのみ、すべて追加する
			{
				H_packetid_hodai[1] = A_packetid;
			} else //他キャリア間で無い
			//パケホーダイ変更無し(強)は、現在のみとする
			{
				if (is_smart) //スマートフォンである
					//現状が定額制か否かに応じて、パケット候補を絞り込む
					{
						if (is_cur_hodai) //現状は定額制なので、現状のみ
							{
								A_packetid = Array();
								if (undefined !== H_tel.packetid && undefined !== this.m_H_packet[H_tel.packetid]) A_packetid = [H_tel.packetid];
							} else //現状は従量制orパケット無しなので、従量制orパケット無し
							{
								var A_temp = Array();

								for (var id of Object.values(A_packetid)) {
									if (!(undefined !== this.m_H_packet[id])) continue;
									if (this.m_H_packet[id].is_hodai) continue;
									A_temp.push(id);
								}

								A_packetid = A_temp;
							}
					}

				H_packetid_hodai[1] = A_packetid;

				if (undefined !== H_is_change_hodai[0] && undefined !== H_tel.packetid && undefined !== this.m_H_packet[H_tel.packetid]) {
					H_packetid_hodai[0] = [H_tel.packetid];
					if (!(-1 !== A_packetid.indexOf(H_tel.packetid))) A_packetid.push(H_tel.packetid);
				}

				if (undefined !== H_is_change_hodai[2]) {
					if (is_cur_empty) //現状がパケット無しなので、全条件から
						{
							H_packetid_hodai[2] = H_packetid_hodai[1];
						} else //現状が従量制or定額制なので、現状から変えない
						{
							H_packetid_hodai[2] = H_packetid_hodai[0];
						}
				}
			}

		var msg = "\u30D7\u30E9\u30F3\u5019\u88DC";

		for (var key in H_planid_course) {
			var A_value = H_planid_course[key];
			msg += "/" + key + "=" + A_value.join(",");
		}

		if (UpdateRecomBase.g_log_ave <= this.m_assert) this.putError(G_SCRIPT_DEBUG, msg);
		msg = "\u30D1\u30B1\u30C3\u30C8\u5019\u88DC";

		for (var key in H_packetid_hodai) {
			var A_value = H_packetid_hodai[key];
			msg += "/" + key + "=" + A_value.join(",");
		}

		if (UpdateRecomBase.g_log_ave <= this.m_assert) this.putError(G_SCRIPT_DEBUG, msg);
	}

	get_min_key(H_tel: {} | any[], H_charge_all: {} | any[], A_planid: {} | any[], A_packetid: {} | any[], is_packet, is_change_carrier) //もっとも安いプランID,もっとも安いパケットID
	//同支払額
	{
		var minkey = "";
		var mincharge = 0;
		if (!is_packet) A_packetid = [""];

		for (var planid of Object.values(A_planid)) {
			for (var packetid of Object.values(A_packetid)) {
				var key = planid + "," + packetid;
				if (!(undefined !== H_charge_all[key])) continue;
				var H_charge = H_charge_all[key];

				if (0 == minkey.length || H_charge.charge < mincharge && 0 < H_charge.charge) {
					minkey = key;
					mincharge = H_charge.charge;
				}
			}
		}

		if (0 == minkey.length) {
			if (UpdateRecomBase.g_log_ave <= this.m_assert) this.putError(G_SCRIPT_DEBUG, "\u6709\u52B9\u30D7\u30E9\u30F3\u30FB\u30D1\u30B1\u30C3\u30C8\u5B58\u5728\u305B\u305A" + H_tel.telno);
			return "";
		}

		if (UpdateRecomBase.g_log_ave <= this.m_assert) this.putError(G_SCRIPT_DEBUG, H_tel.telno + "\u6700\u5B89\u5024\u78BA\u5B9A" + "/minkey=" + minkey + "/mincharge=" + mincharge);
		return minkey;
	}

	get_min_key_plan(minkey) {
		if (strstr(minkey, ",")) {
			var A_minkey = minkey.split(",");
			return A_minkey[0];
		}

		return minkey;
	}

	get_min_key_packet(minkey) {
		if (strstr(minkey, ",")) {
			var A_minkey = minkey.split(",");
			return A_minkey[1];
		}

		return undefined;
	}

	get_cur_plan(planid) {
		if (undefined !== this.m_H_plan[planid]) return this.m_H_plan[planid];
		return {
			planid: planid,
			chgunit: 0,
			digichgunit: 0
		};
	}

	calc_all_w_packet(H_result_hodai, H_is_change_hodai: {} | any[], H_tel: {} | any[], H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], A_planid: {} | any[], A_packetid: {} | any[], H_planid_course: {} | any[], H_packetid_hodai: {} | any[], memo, is_change_carrier, is_data) //全プランに対してループする
	//planid,packetid => 価格情報
	//パケホーダイ変更でループする
	{
		H_result_hodai = Array();
		var H_cur_plan = this.get_cur_plan(H_tel.planid);
		var H_charge_all = Array();

		for (var planid of Object.values(A_planid)) {
			H_log[this.m_log_index_planid] = planid;
			var H_plan = this.m_H_plan[planid];
			if (is_data && !H_plan.is_data) continue;
			if (!is_data && H_plan.is_data) continue;

			for (var packetid of Object.values(A_packetid)) //適用可能なプラン・パケットで無ければスキップする
			{
				H_log[this.m_log_index_packetid] = packetid;
				var H_packet = this.m_H_packet[packetid];
				if (H_plan.packet.length && !(-1 !== H_plan.packet.indexOf(packetid))) continue;

				if (H_plan.is_hodai_mail || H_packet.is_hodai_mail) {
					if (!(undefined !== H_ave.trend.is_hodai_mail) || !(undefined !== H_ave.trend.is_hodai_mail[0]) || !(undefined !== H_ave.trend.is_hodai_mail[1]) || !H_ave.trend.is_hodai_mail[0]) continue;
				}

				var H_charge = this.get_empty_charge();

				if (!this.calc_w_packet(H_charge, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_plan, H_packet, memo, false, false)) {
					this.putError(G_SCRIPT_WARNING, "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u3042\u308A\u8A08\u7B97\u5931\u6557/" + planid + "/" + packetid);
					return false;
				}

				H_charge_all[planid + "," + packetid] = H_charge;
			}
		}

		for (var is_change_hodai in H_is_change_hodai) //買い換えでループする
		{
			var H_is_change_course = H_is_change_hodai[is_change_hodai];
			var A_packetid_hodai = undefined !== H_packetid_hodai[is_change_hodai] ? H_packetid_hodai[is_change_hodai] : Array();

			for (var is_change_course in H_is_change_course) //他キャリアなら打ち切りフラグをtrueにする
			//他キャリアなら以後の処理を打ち切る
			//0件目の方が1件目より安ければ、1件目を削除する
			//(通話明細ではなく請求明細から金額を求めた場合に発生しうる)
			{
				var A_simid = H_is_change_course[is_change_course];
				var A_planid_course = undefined !== H_planid_course[is_change_course] ? H_planid_course[is_change_course] : Array();
				var is_skip = false;
				if (is_change_carrier) is_skip = true;
				if (is_change_course) is_skip = true;

				if (UpdateRecomBase.g_log_ave <= this.m_assert) {
					var msg = "";

					switch (is_change_hodai) {
						case 0:
							msg = "\u30D1\u30B1\u30C3\u30C8\u305D\u306E\u307E\u307E(\u5F37)";
							break;

						case 1:
							msg = "\u30D1\u30B1\u30C3\u30C8\u5909\u66F4";
							break;

						case 2:
							msg = "\u30D1\u30B1\u30C3\u30C8\u305D\u306E\u307E\u307E(\u5F31)";
							break;

						default:
							msg = "\u30D1\u30B1\u30C3\u30C8\u4E0D\u660E";
							break;
					}

					this.putError(G_SCRIPT_DEBUG, msg + "/" + (is_change_course ? "\u8CB7\u3044\u65B9\u5909\u66F4" : "\u8CB7\u3044\u65B9\u305D\u306E\u307E\u307E"));
				}

				var H_result_item = Array();
				if (!this.calc_all_w_packet_item(H_result_item, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_charge_all, A_planid_course, A_packetid_hodai, memo, is_change_carrier, is_skip)) return false;
				if (!H_result_item.length) continue;
				if (!(undefined !== H_result_hodai[is_change_hodai])) H_result_hodai[is_change_hodai] = Array();
				if (!(undefined !== H_result_hodai[is_change_hodai][is_change_course])) H_result_hodai[is_change_hodai][is_change_course] = Array();
				H_result_hodai[is_change_hodai][is_change_course][0] = H_result_item;
				if (is_change_carrier) continue;
				var buysel_before = this.m_H_plan[H_tel.planid].buyselid;
				var minkey_plan = this.get_min_key_plan(H_result_item.minkey);
				if (undefined !== this.m_H_plan[minkey_plan] && buysel_before == this.m_H_plan[minkey_plan].buyselid) continue;
				var A_planid_buysel = Array();

				if (undefined !== this.m_H_planid_buysel[buysel_before]) {
					for (var planid of Object.values(A_planid_course)) if (-1 !== this.m_H_planid_buysel[buysel_before].indexOf(planid)) A_planid_buysel.push(planid);
				}

				H_result_item = Array();
				if (!this.calc_all_w_packet_item(H_result_item, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_charge_all, A_planid_buysel, A_packetid_hodai, memo, is_change_carrier, is_skip)) return false;
				if (!H_result_item.length) continue;
				if (!(undefined !== H_result_hodai[is_change_hodai])) H_result_hodai[is_change_hodai] = Array();
				if (!(undefined !== H_result_hodai[is_change_hodai][is_change_course])) H_result_hodai[is_change_hodai][is_change_course] = Array();
				H_result_hodai[is_change_hodai][is_change_course][1] = H_result_hodai[is_change_hodai][is_change_course][0];
				H_result_hodai[is_change_hodai][is_change_course][0] = H_result_item;

				if (H_result_item.charge < H_result_hodai[is_change_hodai][is_change_course][1].charge) {
					delete H_result_hodai[is_change_hodai][is_change_course][1];
				}
			}
		}

		return true;
	}

	calc_all_w_packet_item(H_result_item: {} | any[], H_tel: {} | any[], H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_cur_plan: {} | any[], H_charge_all: {} | any[], A_planid: {} | any[], A_packetid: {} | any[], memo, is_change_carrier, is_skip) //最も安いプランとパケットパックを取り出す
	//最安の組み合わせがなければ、
	//現行のプラン・パケットのどちらかが、
	//おすすめと同一かどうか検査する
	//他キャリアでは合致する可能性はない
	{
		H_result_item = Array();
		var minkey = this.get_min_key(H_tel, H_charge_all, A_planid, A_packetid, true, is_change_carrier);

		if (!minkey.length || !(undefined !== H_charge_all[minkey])) //処理を打ち切るなら終了する
			{
				if (is_skip) return true;
				minkey = H_tel.planid + ",";
				if (undefined !== H_tel.packetid) minkey = minkey + H_tel.packetid;
				var H_charge = this.get_empty_charge();
			} else H_charge = H_charge_all[minkey];

		var minkey_plan = this.get_min_key_plan(minkey);
		var minkey_packet = this.get_min_key_packet(minkey);

		if (minkey_plan == H_tel.planid || minkey_packet == H_tel.packetid) //そのプラン・パケットでシミュレーションをやり直す
			{
				H_charge = this.get_empty_charge();
				var planid = minkey_plan;
				var packetid = minkey_packet;
				var H_plan = this.m_H_plan[planid];
				var H_packet = this.m_H_packet[packetid];
				H_log[this.m_log_index_planid] = -planid;
				H_log[this.m_log_index_packetid] = -packetid;
				if (UpdateRecomBase.g_log_ave <= this.m_assert) this.putError(G_SCRIPT_DEBUG, "\u540C\u4E00\u6761\u4EF6\u3067\u518D\u5B9F\u884C/" + H_tel.telno + "/" + planid + "/" + packetid);
				this.insert_log(H_log, "recalc", 0, 0, "");

				if (!this.calc_w_packet(H_charge, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_plan, H_packet, memo, this.is_transparent_plan(H_tel.planid, planid) && !this.is_not_transparent(H_param), this.is_transparent_packet(H_tel.packetid, packetid) && !this.is_not_transparent(H_param))) {
					this.putError(G_SCRIPT_WARNING, "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u3042\u308A\u518D\u8A08\u7B97\u5931\u6557" + planid + "/" + packetid);
					return false;
				}

				minkey = planid + "," + packetid;
			}

		H_result_item = {
			minkey: minkey,
			charge: H_charge
		};
		return true;
	}

	calc_all_wo_packet(H_result_hodai, H_is_change_hodai: {} | any[], H_tel: {} | any[], H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], A_planid: {} | any[], A_packetid: {} | any[], H_planid_course: {} | any[], H_packetid_hodai: {} | any[], memo, is_change_carrier, is_data) //全プランに対してループする
	//planid,packetid => 価格情報
	//パケホーダイ変更でループする
	{
		H_result_hodai = Array();
		var H_cur_plan = this.get_cur_plan(H_tel.planid);
		var H_charge_all = Array();

		for (var planid of Object.values(A_planid)) //メールホーダイ系でメール比率が無ければスキップする
		{
			H_log[this.m_log_index_planid] = planid;
			var H_plan = this.m_H_plan[planid];
			if (is_data && !H_plan.is_data) continue;
			if (!is_data && H_plan.is_data) continue;
			var packetid = "";
			var H_packet = Array();
			H_log[this.m_log_index_packetid] = packetid;

			if (H_plan.is_hodai_mail) {
				if (!(undefined !== H_ave.trend.is_hodai_mail) || !(undefined !== H_ave.trend.is_hodai_mail[0]) || !(undefined !== H_ave.trend.is_hodai_mail[1]) || !H_ave.trend.is_hodai_mail[0]) continue;
			}

			var H_charge = this.get_empty_charge();

			if (!this.calc_wo_packet(H_charge, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_plan, H_packet, memo, false, false)) {
				this.putError(G_SCRIPT_WARNING, "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306A\u3057\u8A08\u7B97\u5931\u6557/" + planid);
				return false;
			}

			H_charge_all[planid + "," + packetid] = H_charge;
		}

		for (var is_change_hodai in H_is_change_hodai) //買い換えでループする
		{
			var H_is_change_course = H_is_change_hodai[is_change_hodai];
			var A_packetid_hodai = undefined !== H_packetid_hodai[is_change_hodai] ? H_packetid_hodai[is_change_hodai] : Array();

			for (var is_change_course in H_is_change_course) //他キャリアなら打ち切りフラグをtrueにする
			//他キャリアなら以後の処理を打ち切る
			//0件目の方が1件目より安ければ、1件目を削除する
			//(通話明細ではなく請求明細から金額を求めた場合に発生しうる)
			{
				var A_simid = H_is_change_course[is_change_course];
				var A_planid_course = undefined !== H_planid_course[is_change_course] ? H_planid_course[is_change_course] : Array();
				var is_skip = false;
				if (is_change_carrier) is_skip = true;
				if (is_change_course) is_skip = true;

				if (UpdateRecomBase.g_log_ave <= this.m_assert) {
					var msg = "";

					switch (is_change_hodai) {
						case 0:
							msg = "\u30D1\u30B1\u30C3\u30C8\u305D\u306E\u307E\u307E(\u5F37)";
							break;

						case 1:
							msg = "\u30D1\u30B1\u30C3\u30C8\u5909\u66F4";
							break;

						case 2:
							msg = "\u30D1\u30B1\u30C3\u30C8\u305D\u306E\u307E\u307E(\u5F31)";
							break;

						default:
							msg = "\u30D1\u30B1\u30C3\u30C8\u4E0D\u660E";
							break;
					}

					this.putError(G_SCRIPT_DEBUG, msg + "/" + (is_change_course ? "\u8CB7\u3044\u65B9\u5909\u66F4" : "\u8CB7\u3044\u65B9\u305D\u306E\u307E\u307E"));
				}

				var H_result_item = Array();
				if (!this.calc_all_wo_packet_item(H_result_item, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_charge_all, A_planid_course, A_packetid_hodai, memo, is_change_carrier, is_skip)) return false;
				if (!H_result_item.length) continue;
				if (!(undefined !== H_result_hodai[is_change_hodai])) H_result_hodai[is_change_hodai] = Array();
				if (!(undefined !== H_result_hodai[is_change_hodai][is_change_course])) H_result_hodai[is_change_hodai][is_change_course] = Array();
				H_result_hodai[is_change_hodai][is_change_course][0] = H_result_item;
				if (is_change_carrier) continue;
				var buysel_before = this.m_H_plan[H_tel.planid].buyselid;
				var minkey_plan = this.get_min_key_plan(H_result_item.minkey);
				if (undefined !== this.m_H_plan[minkey_plan] && buysel_before == this.m_H_plan[minkey_plan].buyselid) continue;
				var A_planid_buysel = Array();

				if (undefined !== this.m_H_planid_buysel[buysel_before]) {
					for (var planid of Object.values(A_planid_course)) if (-1 !== this.m_H_planid_buysel[buysel_before].indexOf(planid)) A_planid_buysel.push(planid);
				}

				H_result_item = Array();
				if (!this.calc_all_wo_packet_item(H_result_item, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_charge_all, A_planid_buysel, A_packetid_hodai, memo, is_change_carrier, is_skip)) return false;
				if (!H_result_item.length) continue;
				if (!(undefined !== H_result_hodai[is_change_hodai])) H_result_hodai[is_change_hodai] = Array();
				if (!(undefined !== H_result_hodai[is_change_hodai][is_change_course])) H_result_hodai[is_change_hodai][is_change_course] = Array();
				H_result_hodai[is_change_hodai][is_change_course][1] = H_result_hodai[is_change_hodai][is_change_course][0];
				H_result_hodai[is_change_hodai][is_change_course][0] = H_result_item;

				if (H_result_item.charge < H_result_hodai[is_change_hodai][is_change_course][1].charge) {
					delete H_result_hodai[is_change_hodai][is_change_course][1];
				}
			}
		}

		return true;
	}

	calc_all_wo_packet_item(H_result_item: {} | any[], H_tel: {} | any[], H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_cur_plan: {} | any[], H_charge_all: {} | any[], A_planid: {} | any[], A_packetid: {} | any[], memo, is_change_carrier, is_skip) //最も安いプランとパケットパックを取り出す
	//最安の組み合わせがなければ、
	//現行のプランがおすすめと同一かどうか検査する
	//他キャリアでは合致する可能性はない
	{
		H_result_item = Array();
		var minkey = this.get_min_key(H_tel, H_charge_all, A_planid, A_packetid, false, is_change_carrier);

		if (!minkey.length || !(undefined !== H_charge_all[minkey])) //処理を打ち切るなら終了する
			{
				if (is_skip) return true;
				minkey = H_tel.planid + ",";
				if (undefined !== H_tel.packetid) minkey = minkey + H_tel.packetid;
				var H_charge = this.get_empty_charge();
			} else H_charge = H_charge_all[minkey];

		var minkey_plan = this.get_min_key_plan(minkey);

		if (minkey_plan == H_tel.planid) //そのプランでシミュレーションをやり直す
			{
				H_charge = this.get_empty_charge();
				var planid = minkey_plan;
				var packetid = "";
				var H_plan = this.m_H_plan[planid];
				var H_packet = Array();
				H_log[this.m_log_index_planid] = -planid;
				H_log[this.m_log_index_packetid] = "";
				if (UpdateRecomBase.g_log_ave <= this.m_assert) this.putError(G_SCRIPT_DEBUG, "\u540C\u4E00\u6761\u4EF6\u3067\u518D\u5B9F\u884C/" + H_tel.telno + "/" + planid + "/" + packetid);
				this.insert_log(H_log, "recalc", 0, 0, "");

				if (!this.calc_wo_packet(H_charge, H_tel, H_log, H_ave, H_param, H_disratio, H_cur_plan, H_plan, H_packet, memo, this.is_transparent_plan(H_tel.planid, planid) && !this.is_not_transparent(H_param), false)) {
					this.putError(G_SCRIPT_WARNING, "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306A\u3057\u518D\u8A08\u7B97\u5931\u6557" + planid + "/" + packetid);
					return false;
				}

				minkey = planid + "," + packetid;
			}

		H_result_item = {
			minkey: minkey,
			charge: H_charge
		};
		return true;
	}

	get_empty_charge() {
		return {
			charge: 0,
			basic: 0,
			talkcomm: 0,
			othersum: 0
		};
	}

	calc_w_packet(H_charge: {} | any[], H_tel: {} | any[], H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_cur_plan: {} | any[], H_tgt_plan: {} | any[], H_tgt_packet: {} | any[], memo, is_transparent_plan, is_transparent_packet) //基本料-------------------------------------------------------------
	//通話料-------------------------------------------------------------
	//総通話秒数を求める
	//総通話回数を求める
	//通話料課金単位秒数の差を補正した秒数を求める
	//必要に応じて、通話秒数と平均値を補正する
	//無料通話料反映前の通話料を求める
	//通信料-------------------------------------------------------------
	//ezWeb,PCサイト,一般のパケット数から、新パケットでの通信費を求める
	//ダブル定額ezWeb通信料（上限額） := ezWeb通信料
	//ただし、新パケットのezWeb上限があれば、値の小さい方
	//ダブル定額＋PCサイトビューア通信料 := ↑上限補正 + PCサイト通信料
	//ただし、新パケットのezWeb+PCサイトビューア上限があれば、値の小さい方
	//通信料合計 := ↑(ダブル定額 + PC通信料) + その他通信料
	//通信料合計よりパケット上限(全)が安ければそちら
	//ダブル定額ezWeb通信料（下限補正） := ↑上限額
	//ただし、新パケットの定額通信料よりも小さくならない
	//通話通信その他-----------------------------------------------------
	//通話通信料---------------------------------------------------------
	//合計---------------------------------------------------------------
	//合計額 := 通話通信料 + 割引後基本料
	//その他に相当する部分
	//合計額に、その他に相当する部分をすべて足す
	//後処理-------------------------------------------------------------
	//結果を返す
	{
		H_charge = this.get_empty_charge();
		var basic_sum = this.calc_basic(H_log, H_ave, H_tgt_plan, H_param, H_disratio);
		var H_sec = this.calc_tuwa_sec(H_log, H_ave);
		var H_cnt = this.calc_tuwa_cnt(H_log, H_ave, H_sec);
		var H_touch = this.calc_touch_sec(H_log, H_ave, H_cur_plan, H_tgt_plan, H_sec, H_cnt);
		this.touch_ave_touch(H_ave, H_touch, H_tgt_plan, H_log, memo);
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_param, H_tgt_plan, H_touch, is_transparent_plan, this.m_ratio_same_carrier);

		if (-1 !== this.m_A_packet_zero_all.indexOf(H_tgt_packet.packetid) || H_tgt_plan.is_hodai_mail) {
			var H_comm = this.calc_H_comm_from_plan(H_log, H_ave, H_param, H_tgt_plan, is_transparent_packet);
		} else {
			H_comm = this.calc_H_comm(H_log, H_ave, H_param, H_tgt_packet, is_transparent_packet);
		}

		var limit_mode = H_comm.mode;
		if (undefined !== H_tgt_packet.limit_mode && 0 < H_tgt_packet.limit_mode && H_tgt_packet.limit_mode < limit_mode) limit_mode = H_tgt_packet.limit_mode;
		this.insert_log(H_log, "limit_mode", 0, limit_mode, memo);
		var limit_browse = limit_mode + H_comm.browse;
		if (undefined !== H_tgt_packet.limit_browse && 0 < H_tgt_packet.limit_browse && H_tgt_packet.limit_browse < limit_browse) limit_browse = H_tgt_packet.limit_browse;
		this.insert_log(H_log, "limit_browse", 0, limit_browse, memo);
		var raw_comm = limit_browse + H_comm.other;
		var limit_all = this.getValue(H_tgt_packet, "limit_all", UpdateRecomConst.g_limit_all);

		if (limit_all < raw_comm) {
			raw_comm = limit_all;
		}

		this.insert_log(H_log, "limit_all", 0, raw_comm, memo);
		if (undefined !== H_tgt_packet.limit_free && raw_comm < H_tgt_packet.limit_free) raw_comm = H_tgt_packet.limit_free;
		this.insert_log(H_log, "limit_free", 0, raw_comm, memo);
		this.insert_log(H_log, "raw_comm", 0, raw_comm, memo);
		var H_other = this.calc_talkcomm_other(H_log, H_ave);
		H_other.comm_domestic_digi = this.calc_comm_digi(H_log, H_ave, H_param, H_tgt_plan, H_touch, is_transparent_plan, this.m_ratio_same_carrier);
		this.insert_log(H_log, "comm_domestic_digi", 0, H_other.comm_domestic_digi, memo);

		if (-1 !== this.m_A_packet_zero_all.indexOf(H_tgt_packet.packetid)) {
			var talkcomm = this.calc_talkcomm_wo_packet(H_log, H_ave, H_param, H_disratio, H_tgt_plan, raw_talk, raw_comm, H_other);
		} else {
			talkcomm = this.calc_talkcomm_w_packet(H_log, H_ave, H_param, H_disratio, H_tgt_plan, H_tgt_packet, raw_talk, raw_comm, H_other);
		}

		var total = Math.round(talkcomm + basic_sum);
		var other = H_ave.predata.predata_other;
		total += other;
		H_charge.charge = total;
		H_charge.basic = basic_sum;
		H_charge.talkcomm = talkcomm;
		H_charge.othersum = other;

		for (var key in H_charge) {
			var value = H_charge[key];
			this.insert_log(H_log, "result_" + key, 0, value, memo, UpdateRecomBase.g_log_result);
		}

		return true;
	}

	calc_wo_packet(H_charge: {} | any[], H_tel: {} | any[], H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_cur_plan: {} | any[], H_tgt_plan: {} | any[], H_tgt_packet: {} | any[], memo, is_transparent_plan, is_transparent_packet) //基本料-------------------------------------------------------------
	//通話料-------------------------------------------------------------
	//総通話秒数を求める
	//総通話回数を求める
	//通話料課金単位秒数の差を補正した秒数を求める
	//必要に応じて、通話秒数と平均値を補正する
	//無料通話料反映前の通話料を求める
	//通信料-------------------------------------------------------------
	//ezWeb,PCサイト,一般のパケット数から、新パケットでの通信費を求める
	//ダブル定額ezWeb通信料（上限額） := ezWeb通信料
	//ただし、新パケットのezWeb上限があれば、値の小さい方
	//ダブル定額＋PCサイトビューア通信料 := ↑上限補正 + PCサイト通信料
	//ただし、新パケットのezWeb+PCサイトビューア上限があれば、値の小さい方
	//通信料合計 := ↑(ダブル定額 + PC通信料) + その他通信料
	//通信料合計よりパケット上限(全)が安ければそちら
	//ダブル定額ezWeb通信料（下限補正） := ↑上限額
	//ただし、新パケットの定額通信料よりも小さくならない
	//通話通信その他-----------------------------------------------------
	//通話通信料---------------------------------------------------------
	//合計---------------------------------------------------------------
	//合計額 := 通話通信料 + 割引後基本料
	//その他に相当する部分
	//合計額に、その他に相当する部分をすべて足す
	//後処理-------------------------------------------------------------
	//結果を返す
	{
		H_charge = this.get_empty_charge();
		var basic_sum = this.calc_basic(H_log, H_ave, H_tgt_plan, H_param, H_disratio);
		var H_sec = this.calc_tuwa_sec(H_log, H_ave);
		var H_cnt = this.calc_tuwa_cnt(H_log, H_ave, H_sec);
		var H_touch = this.calc_touch_sec(H_log, H_ave, H_cur_plan, H_tgt_plan, H_sec, H_cnt);
		this.touch_ave_touch(H_ave, H_touch, H_tgt_plan, H_log, memo);
		var raw_talk = this.calc_raw_talk(H_log, H_ave, H_param, H_tgt_plan, H_touch, is_transparent_plan, this.m_ratio_same_carrier);
		var H_comm = this.calc_H_comm_from_plan(H_log, H_ave, H_param, H_tgt_plan, is_transparent_plan);
		var limit_mode = H_comm.mode;
		if (undefined !== H_tgt_packet.limit_mode && 0 < H_tgt_packet.limit_mode && H_tgt_packet.limit_mode < limit_mode) limit_mode = H_tgt_packet.limit_mode;
		this.insert_log(H_log, "limit_mode", 0, limit_mode, memo);
		var limit_browse = limit_mode + H_comm.browse;
		if (undefined !== H_tgt_packet.limit_browse && 0 < H_tgt_packet.limit_browse && H_tgt_packet.limit_browse < limit_browse) limit_browse = H_tgt_packet.limit_browse;
		this.insert_log(H_log, "limit_browse", 0, limit_browse, memo);
		var raw_comm = limit_browse + H_comm.other;
		var limit_all = this.getValue(H_tgt_packet, "limit_all", UpdateRecomConst.g_limit_all);

		if (limit_all < raw_comm) {
			raw_comm = limit_all;
		}

		this.insert_log(H_log, "limit_all", 0, raw_comm, memo);
		if (undefined !== H_tgt_packet.limit_free && raw_comm < H_tgt_packet.limit_free) raw_comm = H_tgt_packet.limit_free;
		this.insert_log(H_log, "limit_free", 0, raw_comm, memo);
		this.insert_log(H_log, "raw_comm", 0, raw_comm, memo);
		var H_other = this.calc_talkcomm_other(H_log, H_ave);
		H_other.comm_domestic_digi = this.calc_comm_digi(H_log, H_ave, H_param, H_tgt_plan, H_touch, is_transparent_plan, this.m_ratio_same_carrier);
		this.insert_log(H_log, "comm_domestic_digi", 0, H_other.comm_domestic_digi, memo);
		var talkcomm = this.calc_talkcomm_wo_packet(H_log, H_ave, H_param, H_disratio, H_tgt_plan, raw_talk, raw_comm, H_other);
		var total = Math.round(talkcomm + basic_sum);
		var other = H_ave.predata.predata_other;
		total += other;
		H_charge.charge = total;
		H_charge.basic = basic_sum;
		H_charge.talkcomm = talkcomm;
		H_charge.othersum = other;

		for (var key in H_charge) {
			var value = H_charge[key];
			this.insert_log(H_log, "result_" + key, 0, value, memo, UpdateRecomBase.g_log_result);
		}

		return true;
	}

	touch_ave_touch(H_ave: {} | any[], H_touch: {} | any[], H_tgt_plan: {} | any[], H_log: {} | any[], memo) //基底型では何もしない
	{}

	calc_talkcomm_w_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], H_tgt_packet: {} | any[], raw_talk, raw_comm, H_other) //派生型で実装する
	{
		return 0;
	}

	calc_talkcomm_wo_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], raw_talk, raw_comm, H_other) //派生型で実装する
	{
		return 0;
	}

	apply_free(target, remain_free) {
		if (target < 0) return;

		if (remain_free < target) {
			target -= remain_free;
			remain_free = 0;
		} else {
			remain_free -= target;
			target = 0;
		}
	}

	calc_disratio_basic(ratio, H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], cirid) {
		return this.calc_disratio_all(ratio, H_log, H_ave, H_param, H_disratio, cirid, "predata_disratiobasic", "discount_base", "discount_basic", "discount_basic_is_pact");
	}

	calc_disratio_talkcomm(ratio, H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], cirid) {
		return this.calc_disratio_all(ratio, H_log, H_ave, H_param, H_disratio, cirid, "predata_disratiotalk", "discount_tel", "discount_talkcomm", "discount_talkcomm_is_pact");
	}

	calc_disratio_all(ratio, H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], cirid, key_predata, key_index, key_log, key_log_is_pact) //電話単位
	{
		ratio = H_ave.predata[key_predata];
		var is_all = false;

		switch (this.getValue(H_param, "discount_way", 0)) {
			case 0:
				if (undefined !== H_disratio[cirid]) //会社単位
					{
						ratio = H_disratio[cirid];
						is_all = true;
					}

				break;

			case 1:
				ratio = this.getValue(H_param, key_index, ratio);
				is_all = true;
				break;

			case 2:
				ratio = this.getValue(H_param, key_index, ratio);
				break;

			case 3:
				ratio += this.getValue(H_param, key_index, ratio);
				if (ratio < 0) ratio = 0;
				if (100 < ratio) ratio = 100;
				break;
		}

		this.insert_log(H_log, key_log, 0, ratio, "");
		this.insert_log(H_log, key_log_is_pact, 0, is_all ? 1 : 0, "");
		return is_all;
	}

	is_error_disratio(H_param: {} | any[]) {
		var discount_way = this.getValue(H_param, "discount_way", 0);

		switch (discount_way) {
			case 0:
				break;

			case 1:
			case 2:
			case 3:
				if (!(undefined !== H_param.discount_base)) {
					this.putError(G_SCRIPT_INFO, "discount_base\u304C\u5B58\u5728\u3057\u306A\u3044" + discount_way);
					return true;
				}

				if (!(undefined !== H_param.discount_tel)) {
					this.putError(G_SCRIPT_INFO, "discount_tel\u304C\u5B58\u5728\u3057\u306A\u3044" + discount_way);
					return true;
				}

				break;
		}

		return false;
	}

	calc_basic(H_log: {} | any[], H_ave: {} | any[], H_tgt_plan: {} | any[], H_param: {} | any[], H_disratio: {} | any[]) {
		var ratio = 0;
		this.calc_disratio_basic(ratio, H_log, H_ave, H_param, H_disratio, H_tgt_plan.cirid);
		var basic_sum = Math.round(H_tgt_plan.basic * (100 - ratio) / 100);
		this.insert_log(H_log, "basic_sum", 0, basic_sum, "");
		return basic_sum;
	}

	calc_tuwa_sec(H_log: {} | any[], H_ave: {} | any[]) //0が一般、1がデジタル通信の秒数
	{
		var H_sec = [0, 0];

		for (var key = 0; key < 2; ++key) {
			if (undefined !== H_ave.trend.tuwasec[key]) {
				H_sec[key] = H_ave.trend.tuwasec[key];
			}

			this.insert_log(H_log, "tuwa_sec", key, H_sec[key], "");
		}

		return H_sec;
	}

	calc_tuwa_cnt(H_log: {} | any[], H_ave: {} | any[], H_sec: {} | any[]) //0が一般、1がデジタル通信の回数
	{
		var H_cnt = [0, 0];

		for (var key = 0; key < 2; ++key) {
			if (undefined !== H_ave.trend.tuwacnt[key]) {
				H_cnt[key] = H_ave.trend.tuwacnt[key];
				this.insert_log(H_log, "tuwa_cnt(comm)", key, H_cnt[key], "");
			} else if (undefined !== H_ave.trend.avetime[key] && H_ave.trend.avetime[key]) //通話回数 := 通話秒数 / 平均通話秒数
				{
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

	calc_touch_sec(H_log: {} | any[], H_ave: {} | any[], H_cur_plan: {} | any[], H_tgt_plan: {} | any[], H_sec: {} | any[], H_cnt: {} | any[]) //0が一般、1がデジタル通信の補正後秒数
	{
		var H_touch = [0, 0];
		var A_key = {
			0: "chgunit",
			1: "digichgunit"
		};

		for (var key in A_key) //補正後秒数 := 総通話秒数 - 総通話回数 * (元単位 - 新単位) / 2
		//ただしゼロ未満にはならない
		{
			var label = A_key[key];
			H_touch[key] = Math.round(H_sec[key] - H_cnt[key] * (H_cur_plan[label] - H_tgt_plan[label]) / 2);
			if (H_touch[key] < 0) H_touch[key] = 0;
			this.insert_log(H_log, "touch_sec", key, H_touch[key], "");
		}

		return H_touch;
	}

	calc_raw_talk(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_tgt_plan: {} | any[], H_touch: {} | any[], is_transparent, ratio_same_carrier) {
		var result = 0;

		if (is_transparent) //現プランと同じなので、請求情報の値を用いる
			{
				if (undefined !== H_ave.trend.predata_talk[121]) result = H_ave.trend.predata_talk[121];
			} else {
			result = this.calc_charge_from_sec(H_log, H_ave, H_param, H_tgt_plan, H_touch[0], "charge", "nightcharge", "chargefix", "nightchargefix", "chgunit", "timezone", "ismobile", "charge10", "increase_raw_talk", ratio_same_carrier);
		}

		this.insert_log(H_log, "raw_talk", 0, result, "");
		return result;
	}

	calc_comm_digi(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_tgt_plan: {} | any[], H_touch: {} | any[], is_transparent, ratio_same_carrier) {
		var result = 0;

		if (is_transparent) //現プランと同じなので、請求情報の値を用いる
			{
				if (undefined !== H_ave.trend.predata_com[147]) result = H_ave.trend.predata_com[147];
			} else {
			result = this.calc_charge_from_sec(H_log, H_ave, H_param, H_tgt_plan, H_touch[1], "digicharge", "nightdigicharge", "digichargefix", "nightdigichargefix", "digichgunit", "timezone_digi", "ismobile_digi", "digicharge10", "increase_comm_digi", ratio_same_carrier);
		}

		this.insert_log(H_log, "comm_digi", 0, result, "");
		return result;
	}

	calc_charge_from_sec(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_tgt_plan: {} | any[], touch_sec, key_charge_mobile, key_charge_night_mobile, key_charge_fix, key_charge_night_fix, key_unit, key_timezone, key_ismobile, label_charge, label_increase, ratio_same_carrier) //自社への通話比率を決定する
	//以下、比率や通話量は[2][2]の配列で扱う。
	//それらの添え字は[固定なら0,携帯なら1][昼間なら0,夜間なら1]とする。
	//単位あたり通話料を求める
	//昼夜の比率を取り出す
	//昼夜の比率が無ければ、すべて昼間とする
	//キャリア毎に全体の比率を設定しているので、あり得ない
	//相手先の比率が無ければ、すべて携帯とする
	//キャリア毎に全体の比率を設定しているので、あり得ない
	//小数点以下を含む、単位あたり金額
	//通話時間の増減比率(%)を反映する
	//無料通話料反映前の通話料
	//:= 切り上げ(↑補正後秒数 / 新単位) * 新単位通話料
	{
		ratio_same_carrier = this.getValue(H_param, "ratio_same_carrier", ratio_same_carrier);
		var A_charge = [[H_tgt_plan[key_charge_fix], H_tgt_plan[key_charge_night_fix]], [H_tgt_plan[key_charge_fix] * (100 - ratio_same_carrier) / 100 + H_tgt_plan[key_charge_mobile] * ratio_same_carrier / 100, H_tgt_plan[key_charge_night_fix] * (100 - ratio_same_carrier) / 100 + H_tgt_plan[key_charge_night_mobile] * ratio_same_carrier / 100]];
		var A_ratio_timezone = [0, 0];

		for (var key = 0; key < 2; ++key) {
			if (undefined !== H_ave.trend[key_timezone][key]) A_ratio_timezone[key] = H_ave.trend[key_timezone][key];
		}

		if (undefined !== H_param.ratio_daytime) {
			A_ratio_timezone[0] = H_param.ratio_daytime;
			A_ratio_timezone[1] = 100 - A_ratio_timezone[0];
		}

		var sum_timezone = A_ratio_timezone[0] + A_ratio_timezone[1];
		if (0 == sum_timezone) sum_timezone = A_ratio_timezone[0] = 1;
		var A_ratio_ismobile = [0, 0];

		for (key = 0;; key < 2; ++key) {
			if (undefined !== H_ave.trend[key_ismobile][key]) A_ratio_ismobile[key] = H_ave.trend[key_ismobile][key];
		}

		if (undefined !== H_param.ratio_cellular) {
			A_ratio_ismobile[1] = H_param.ratio_cellular;
			A_ratio_ismobile[0] = 100 - A_ratio_ismobile[1];
		}

		var sum_ismobile = A_ratio_ismobile[0] + A_ratio_ismobile[1];
		if (0 == sum_ismobile) sum_ismobile = A_ratio_ismobile[1] = 1;
		var charge = 0;

		for (var gcnt = 0; gcnt < 2; ++gcnt) {
			var charge_timezone = 0;

			for (var lcnt = 0; lcnt < 2; ++lcnt) {
				charge_timezone += A_charge[gcnt][lcnt] * A_ratio_timezone[lcnt];
			}

			charge_timezone /= sum_timezone;
			charge += charge_timezone * A_ratio_ismobile[gcnt];
		}

		charge /= sum_ismobile;
		this.insert_log(H_log, label_charge, 0, Math.round(charge * 10), "10\u500D\u5024");
		var ratio_increase = this.getValue(H_param, "ratio_increase_tel", 100);
		touch_sec = touch_sec * ratio_increase / 100;
		this.insert_log(H_log, label_increase, 0, touch_sec, "");
		var result = 0;
		var unit = H_tgt_plan[key_unit];

		if (unit) {
			result = Math.round(Math.ceil(touch_sec / unit) * charge);
		}

		return result;
	}

	calc_H_comm(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_tgt_packet: {} | any[], is_transparent) //パケットマスターのカラム名
	{
		var H_keys = {
			mode: "charge_mode",
			browse: "charge_browse",
			other: "charge_other"
		};
		return this.calc_H_comm_from_master(H_log, H_ave, H_param, H_tgt_packet, H_keys, is_transparent);
	}

	calc_H_comm_from_plan(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_tgt_plan: {} | any[], is_transparent) //パケットマスターのカラム名
	{
		var H_keys = {
			mode: "charge_mode",
			browse: "charge_browse",
			other: "charge_other"
		};
		return this.calc_H_comm_from_master(H_log, H_ave, H_param, H_tgt_plan, H_keys, is_transparent);
	}

	calc_H_comm_from_master(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_tgt_master: {} | any[], H_keys: {} | any[], is_transparent) //パケット数の増減(%)を取り出す
	//trendは、sim_trend_X_tbのcodeがpacketcntのkey
	//tgtは、返値のキー
	//nameは、マスターのカラム
	//predataは、sim_trend_X_tbのpredataのkey(同プラン・パケットの時のみ)
	{
		var H_comm = Array();
		var ratio_increase = this.getValue(H_param, "ratio_increase_comm", 100);
		var A_keys = [{
			trend: 10,
			tgt: "mode",
			name: H_keys.mode,
			predata: [140, 141, 142, 143]
		}, {
			trend: 20,
			tgt: "browse",
			name: H_keys.browse,
			predata: [144]
		}, {
			trend: 30,
			tgt: "other",
			name: H_keys.other,
			predata: [145]
		}];

		for (var H_key of Object.values(A_keys)) //パケット数
		//パケット数を取り出す
		//種別がiモードで、メールホーダイ系で、メール比率があれば反映する
		//新パケットでの通信料 := パケット数 * パケット単価
		//その他なら、無料パケットその他を適用する
		{
			var src = H_key.trend;
			var tgt = H_key.tgt;
			var name = H_key.name;
			var packetcnt = 0;
			if (undefined !== H_ave.trend.packetcnt[src]) packetcnt = H_ave.trend.packetcnt[src];
			this.insert_log(H_log, "packetcnt_" + tgt, 0, packetcnt, "");

			if (10 == src && undefined !== H_tgt_master.is_hodai_mail && H_tgt_master.is_hodai_mail && undefined !== H_ave.trend.is_hodai_mail && undefined !== H_ave.trend.is_hodai_mail[0] && undefined !== H_ave.trend.is_hodai_mail[1] && H_ave.trend.is_hodai_mail[0]) {
				packetcnt = packetcnt * (100 - H_ave.trend.is_hodai_mail[1]) / 100;
				this.insert_log(H_log, "packetcnt_" + tgt + "_mail", 0, packetcnt, "");
			}

			packetcnt = packetcnt * ratio_increase / 100;
			this.insert_log(H_log, "packetcnt_increase_" + tgt, 0, packetcnt, "");
			var charge = H_tgt_master[name];
			H_comm[tgt] = Math.round(packetcnt * charge);

			if (30 == src) //無料パケットその他
				//電話単位通話通信料割引率
				//パケットその他から無料パケットその他を引く
				//ただし、ゼロ未満にはならない
				{
					var free_packet_other = this.getValue(H_tgt_master, "free_packet_other", 0);
					var H_disratio = Array();
					if (!this.getDisratio(H_disratio, H_param.pactid)) H_disratio = Array();
					var ratio_talkcomm = 0;
					var is_ratio_talkcomm_pact = this.calc_disratio_talkcomm(ratio_talkcomm, H_log, H_ave, H_param, H_disratio, H_tgt_master.cirid);

					if (!is_ratio_talkcomm_pact) {
						if (100 != ratio_talkcomm) free_packet_other = Math.round(free_packet_other * 100 / (100 - ratio_talkcomm));
					}

					this.insert_log(H_log, "packet_other_free_" + tgt, 0, H_comm[tgt], "");
					H_comm[tgt] = H_comm[tgt] - free_packet_other;
					if (H_comm[tgt] < 0) H_comm[tgt] = 0;
					this.insert_log(H_log, "comm_other_free_" + tgt, 0, H_comm[tgt], "");
				}

			if (is_transparent) {
				H_comm[tgt] = 0;

				for (var key of Object.values(H_key.predata)) {
					if (undefined !== H_ave.trend.predata_com[key]) H_comm[tgt] += H_ave.trend.predata_com[key];
				}
			}

			this.insert_log(H_log, "comm_" + tgt, 0, H_comm[tgt], "");
		}

		return H_comm;
	}

	calc_talkcomm_other(H_log: {} | any[], H_ave: {} | any[]) {
		var H_other = {
			talk_abroad: this.calc_talk_abroad(H_log, H_ave),
			talk_other: this.calc_talk_other(H_log, H_ave),
			comm_abroad_digi: this.calc_comm_abroad_digi(H_log, H_ave),
			comm_abroad_packet: this.calc_comm_abroad_packet(H_log, H_ave)
		};
		return H_other;
	}

	calc_talk_abroad(H_log: {} | any[], H_ave: {} | any[]) {
		var talk_abroad = 0;
		var A_key = [122];

		for (var key of Object.values(A_key)) if (undefined !== H_ave.trend.predata_talk[key]) talk_abroad += H_ave.trend.predata_talk[key];

		talk_abroad = Math.round(talk_abroad);
		this.insert_log(H_log, "talk_abroad", 0, talk_abroad, "");
		return talk_abroad;
	}

	calc_talk_other(H_log: {} | any[], H_ave: {} | any[]) {
		var talk_other = 0;
		var A_key = [123];

		for (var key of Object.values(A_key)) if (undefined !== H_ave.trend.predata_talk[key]) talk_other += H_ave.trend.predata_talk[key];

		talk_other = Math.round(talk_other);
		this.insert_log(H_log, "talk_other", 0, talk_other, "");
		return talk_other;
	}

	calc_comm_abroad_digi(H_log: {} | any[], H_ave: {} | any[]) //国際デジタル通信の料金を加算する
	{
		var comm_abroad_digi = 0;
		var A_key = [148];

		for (var key of Object.values(A_key)) if (undefined !== H_ave.trend.predata_com[key]) comm_abroad_digi += H_ave.trend.predata_com[key];

		comm_abroad_digi = Math.round(comm_abroad_digi);
		this.insert_log(H_log, "comm_abroad_digi", 0, comm_abroad_digi, "");
		return comm_abroad_digi;
	}

	calc_comm_abroad_packet(H_log: {} | any[], H_ave: {} | any[]) //国際パケット通信の料金を加算する
	{
		var comm_abroad_packet = 0;
		var A_key = [146];

		for (var key of Object.values(A_key)) if (undefined !== H_ave.trend.predata_com[key]) comm_abroad_packet += H_ave.trend.predata_com[key];

		comm_abroad_packet = Math.round(comm_abroad_packet);
		this.insert_log(H_log, "comm_abroad_packet", 0, comm_abroad_packet, "");
		return comm_abroad_packet;
	}

	calc_penalty(penalty, H_tel: {} | any[], cur_date) //月数を取り出す
	//この月数に該当する違約金マスターが存在しないのでゼロ円とする
	{
		penalty = 0;
		var month = 0;
		if (!(undefined !== H_tel.orderdate) || !this.calc_penalty_month(month, H_tel.orderdate, cur_date, this.m_penalty_limit)) return false;
		var carid = H_tel.carid;

		if (!(undefined !== this.m_H_penalty[carid])) {
			this.putError(G_SCRIPT_WARNING, "\u3053\u306E\u9867\u5BA2\u306E\u9055\u7D04\u91D1\u30DE\u30B9\u30BF\u30FC\u304C\u306A\u3044" + carid);
			return false;
		}

		var A_penalty = this.m_H_penalty[carid];

		for (var H_penalty of Object.values(A_penalty)) {
			if (H_penalty.spanfrom <= month && month <= H_penalty.spanto) {
				if ("M" == H_penalty.chargetype) {
					var remain = H_penalty.spanto - month + 1;
					penalty = remain * H_penalty.charge;
					return true;
				} else {
					penalty = H_penalty.charge;
					return true;
				}
			}
		}

		penalty = 0;
		return true;
	}

	calc_penalty_month(month, start_date, cur_date, limit) //計算開始日より現在の日付が前ならゼロを返す
	{
		if (!(undefined !== start_date)) return false;
		var end_year = date("Y", strtotime(cur_date));
		var end_month = date("n", strtotime(cur_date));
		var start_year = date("Y", strtotime(start_date));
		var start_month = date("n", strtotime(start_date));
		month = (end_year - start_year) * 12 + (end_month - start_month);
		if (month < 0) return false;else if (0 == month) month = 1;
		start_date = date("j", strtotime(start_date));

		if (start_date <= limit) {
			++month;
		}

		return true;
	}

	fetchHist(H_fetch: {} | any[], pactid, year, month, A_telno_in: {} | any[], A_telno_out: {} | any[], A_postid_in: {} | any[], carid_before, A_cirid_before: {} | any[]) //処理すべき電話番号を取り出す
	//12ヶ月分の情報を取り出す
	{
		H_fetch = Array();
		var table_no = this.getTableNo(year, month);
		H_fetch.tel = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		H_fetch.tel.query(this.getSQLTelno(pactid, table_no, A_telno_in, A_telno_out, A_postid_in, carid_before, A_cirid_before));
		H_fetch.month = Array();
		var year2 = year;
		var month2 = month;

		for (var cnt = 0; cnt < 12; ++cnt) //predataを取り出す
		//trendを取り出す
		//trendのデフォルト値を取り出す
		//topを取り出す
		//一個前の月に移動する
		{
			var table_no2 = this.getTableNo(year2, month2);
			H_fetch.month[cnt] = Array();
			H_fetch.month[cnt].predata = new FetchAdaptor(this.m_listener, this.m_db, "telno");
			H_fetch.month[cnt].predata.query(this.getSQLPredata(pactid, table_no2, A_telno_in, A_telno_out, A_postid_in, carid_before));
			H_fetch.month[cnt].trend = new FetchAdaptor(this.m_listener, this.m_db, "telno");
			H_fetch.month[cnt].trend.query(this.getSQLTrend(pactid, table_no2, A_telno_in, A_telno_out, A_postid_in, carid_before));
			var sql = this.getSQLTrend(pactid, table_no2, [""], Array(), Array(), carid_before);
			var A_result = this.m_db.getHash(sql);
			var H_result = Array();

			for (var H_line of Object.values(A_result)) {
				var code = H_line.code;
				var key = H_line.key;
				var value = H_line.value;
				if (!(undefined !== H_result[code])) H_result[code] = Array();
				H_result[code][key] = value;
			}

			H_fetch.month[cnt].trend_default = H_result;
			H_fetch.month[cnt].top = new FetchAdaptor(this.m_listener, this.m_db, "telno");
			H_fetch.month[cnt].top.query(this.getSQLTop(pactid, table_no2, A_telno_in, A_telno_out, A_postid_in, carid_before));
			--month2;

			if (0 == month2) {
				month2 = 12;
				--year2;
			}
		}
	}

	freeHist(H_fetch: {} | any[]) {
		H_fetch.tel.free();

		for (var cnt = 0; cnt < 12; ++cnt) {
			H_fetch.month[cnt].predata.free();
			H_fetch.month[cnt].trend.free();
			H_fetch.month[cnt].top.free();
		}

		H_fetch = Array();
	}

	fetchHistTel(H_hist: {} | any[], H_fetch: {} | any[]) //電話情報を取り出す
	{
		var H_tel;

		while (H_tel = H_fetch.tel.fetchNext()) //H_telはtelno,planid,packetid,cirid等を持つ
		//値を取り出したので終了する
		{
			H_hist = Array();
			H_hist.tel = H_tel;
			var telno = H_hist.tel.telno;
			H_hist.predata = Array();
			H_hist.trend = Array();
			H_hist.top = Array();

			for (var cnt = 0; cnt < 12; ++cnt) //通話料割引率などを取り出す
			//通話料割引率などが無かった月は、統計情報などを取り出さない
			//統計情報の不足部分を顧客単位のデフォルト値で補う
			//顧客単位のデフォルト値が無い場合は、
			//calcAveの中で全顧客共通のデフォルト値を設定する
			//使用頻度の高い電話を取り出す
			{
				var H_line;
				H_hist.predata[cnt] = Array();
				H_hist.trend[cnt] = Array();
				H_hist.top[cnt] = Array();

				while (H_line = H_fetch.month[cnt].predata.fetch(telno)) {
					var code = H_line.code;
					var value = H_line.value;
					H_hist.predata[cnt][code] = value;
				}

				if (0 == H_hist.predata[cnt].length) continue;

				while (H_line = H_fetch.month[cnt].trend.fetch(telno)) {
					code = H_line.code;
					var key = H_line.key;
					value = H_line.value;
					if (!(undefined !== H_hist.trend[cnt][code])) H_hist.trend[cnt][code] = Array();
					H_hist.trend[cnt][code][key] = value;
				}

				{
					let _tmp_8 = H_fetch.month[cnt].trend_default;

					for (var code in _tmp_8) {
						var H_key = _tmp_8[code];
						if (!(undefined !== H_hist.trend[cnt][code])) H_hist.trend[cnt][code] = Array();

						for (var key in H_key) {
							var value = H_key[key];
							if (!(undefined !== H_hist.trend[cnt][code][key])) H_hist.trend[cnt][code][key] = value;
						}
					}
				}

				while (H_line = H_fetch.month[cnt].top.fetch(telno)) {
					var totelno = H_line.totelno;
					var sec = H_line.sec;
					H_hist.top[cnt]["T" + totelno] = sec;
				}
			}

			return true;
		}

		return false;
	}

	getSQLTelno(pactid, table_no, A_telno_in: {} | any[], A_telno_out: {} | any[], A_postid_in: {} | any[], carid_before, A_cirid_before: {} | any[]) //ホットラインか
	//FROM節(tel_X_tb <- tel_tb <- plan_tb <- packet_tb <- sim_trend_X_tb
	//ただし、ホットラインの場合はtel_X_tb <- tel_X_tb ...
	//WHERE節
	//predataは一件でもあれば良しとする
	//trendが無ければ処理しない
	//simbeforeがfalseなら除外する
	//packetがNULLでもシミュレーションの対象とする
	//V2型はプラン警告かパケット警告があれば除外していたが、
	//シミュレーション対象とした
	{
		var is_hotline = false;
		var sql = "select coalesce(type,'') from pact_tb";
		sql += " where pactid=" + pactid;
		sql += ";";
		var result = this.m_db.getAll(sql);
		if (1 == result.length && 0 == strcmp("H", result[0][0])) is_hotline = true;
		sql = "select tel_x_tb.telno as telno";
		sql += ",tel_x_tb.planid as planid";
		sql += ",tel_x_tb.packetid as packetid";
		sql += ",tel_x_tb.arid as arid";
		sql += ",tel_x_tb.cirid as cirid";
		sql += ",tel_x_tb.carid as carid";
		sql += ",tel_x_tb.orderdate as orderdate";
		sql += ",assets_x_tb.smpcirid as smpcirid";
		sql += ",assets_tb.smpcirid as smpcirid_cur";
		sql += " from tel_" + table_no + "_tb as tel_x_tb";
		if (is_hotline) sql += " left join tel_" + table_no + "_tb as alert_tb";else sql += " left join tel_tb as alert_tb";
		sql += " on tel_x_tb.carid=alert_tb.carid";
		sql += " and tel_x_tb.telno=alert_tb.telno";
		sql += " and tel_x_tb.pactid=alert_tb.pactid";
		sql += " left join plan_tb";
		sql += " on tel_x_tb.planid=plan_tb.planid";
		sql += " left join packet_tb";
		sql += " on tel_x_tb.packetid=packet_tb.packetid";
		sql += " left join (";
		sql += " select pactid,carid,telno,count(*) as count";
		sql += " from sim_trend_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid_before;
		sql += " and code like 'predata_%'";
		sql += " group by pactid,carid,telno";
		sql += " order by telno";
		sql += ") as details_tb";
		sql += " on tel_x_tb.carid=details_tb.carid";
		sql += " and tel_x_tb.telno=details_tb.telno";
		sql += " and tel_x_tb.pactid=details_tb.pactid";
		sql += " left join (";
		sql += " select pactid,carid,telno,count(*) as count";
		sql += " from sim_trend_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid_before;
		sql += " and code not like 'predata_%'";
		sql += " and code not in ('tuwasum', 'packetsum')";
		sql += " group by pactid,carid,telno";
		sql += " order by telno";
		sql += ") as details_trend_tb";
		sql += " on tel_x_tb.carid=details_trend_tb.carid";
		sql += " and tel_x_tb.telno=details_trend_tb.telno";
		sql += " and tel_x_tb.pactid=details_trend_tb.pactid";
		sql += " left join tel_tb as excise_tb";
		sql += " on tel_x_tb.carid=excise_tb.carid";
		sql += " and tel_x_tb.telno=excise_tb.telno";
		sql += " and tel_x_tb.pactid=excise_tb.pactid";
		sql += " left join tel_rel_assets_" + table_no + "_tb" + " as tel_rel_assets_x_tb";
		sql += " on tel_x_tb.pactid=tel_rel_assets_x_tb.pactid";
		sql += " and tel_x_tb.carid=tel_rel_assets_x_tb.carid";
		sql += " and tel_x_tb.telno=tel_rel_assets_x_tb.telno";
		sql += " and tel_rel_assets_x_tb.main_flg=true";
		sql += " left join assets_" + table_no + "_tb" + " as assets_x_tb";
		sql += " on tel_rel_assets_x_tb.assetsid=assets_x_tb.assetsid";
		sql += " and tel_rel_assets_x_tb.pactid=assets_x_tb.pactid";
		if (is_hotline) sql += " left join tel_rel_assets_" + table_no + "_tb as tel_rel_assets_tb";else sql += " left join tel_rel_assets_tb";
		sql += " on alert_tb.pactid=tel_rel_assets_tb.pactid";
		sql += " and alert_tb.carid=tel_rel_assets_tb.carid";
		sql += " and alert_tb.telno=tel_rel_assets_tb.telno";
		sql += " and tel_rel_assets_tb.main_flg=true";
		if (is_hotline) sql += " left join assets_" + table_no + "_tb as assets_tb";else sql += " left join assets_tb";
		sql += " on tel_rel_assets_tb.assetsid=assets_tb.assetsid";
		sql += " and tel_rel_assets_tb.pactid=assets_tb.pactid";
		sql += " where tel_x_tb.pactid=" + this.escape(pactid);
		sql += " and tel_x_tb.carid=" + this.escape(carid_before);
		sql += " and details_tb.count>0";
		sql += " and details_trend_tb.count>0";
		sql += " and plan_tb.planid is not null";
		sql += " and plan_tb.simbefore=true";
		sql += " and coalesce(packet_tb.simbefore,true)=true";
		sql += " and (excise_tb.exceptflg is null" + " or excise_tb.exceptflg=false)";
		sql += this.getSQLWhereTelno("tel_x_tb", "telno", A_telno_in, A_telno_out);
		sql += " and tel_x_tb.cirid in(" + A_cirid_before.join(",") + ")";
		if (A_postid_in.length) sql += " and tel_x_tb.postid in (" + A_postid_in.join(",") + ")";
		sql += " order by tel_x_tb.telno";
		sql += ";";
		return sql;
	}

	getSQLPredata(pactid, table_no, A_telno_in: {} | any[], A_telno_out: {} | any[], A_postid_in: {} | any[], carid_before) //codeがpredata_で始まるものだけ
	{
		var sql = "select trend_x_tb.telno as telno";
		sql += ",trend_x_tb.code as code";
		sql += ",sum(trend_x_tb.value) as value";
		sql += " from sim_trend_" + table_no + "_tb as trend_x_tb";
		sql += " left join tel_" + table_no + "_tb as tel_x_tb";
		sql += " on trend_x_tb.pactid=tel_x_tb.pactid";
		sql += " and trend_x_tb.carid=tel_x_tb.carid";
		sql += " and trend_x_tb.telno=tel_x_tb.telno";
		sql += " where trend_x_tb.pactid=" + this.escape(pactid);
		sql += " and trend_x_tb.carid=" + this.escape(carid_before);
		sql += " and trend_x_tb.code like 'predata_%'";
		sql += this.getSQLWhereTelno("trend_x_tb", "telno", A_telno_in, A_telno_out);
		if (A_postid_in.length) sql += " and tel_x_tb.postid in (" + A_postid_in.join(",") + ")";
		sql += " group by trend_x_tb.telno,trend_x_tb.code";
		sql += " order by trend_x_tb.telno,trend_x_tb.code";
		sql += ";";
		return sql;
	}

	getSQLTrend(pactid, table_no, A_telno_in: {} | any[], A_telno_out: {} | any[], A_postid_in: {} | any[], carid_before) //predataもそれ以外も抽出する
	{
		var sql = "select trend_x_tb.telno as telno";
		sql += ",trend_x_tb.code as code";
		sql += ",trend_x_tb.key as key";
		sql += ",trend_x_tb.value as value";
		sql += " from sim_trend_" + table_no + "_tb as trend_x_tb";
		sql += " left join tel_" + table_no + "_tb as tel_x_tb";
		sql += " on trend_x_tb.pactid=tel_x_tb.pactid";
		sql += " and trend_x_tb.carid=tel_x_tb.carid";
		sql += " and trend_x_tb.telno=tel_x_tb.telno";
		sql += " where trend_x_tb.pactid=" + this.escape(pactid);
		sql += " and trend_x_tb.carid=" + this.escape(carid_before);
		sql += this.getSQLWhereTelno("trend_x_tb", "telno", A_telno_in, A_telno_out);
		if (A_postid_in.length) sql += " and tel_x_tb.postid in (" + A_postid_in.join(",") + ")";
		sql += " order by trend_x_tb.telno,trend_x_tb.code,trend_x_tb.key";
		sql += ";";
		return sql;
	}

	getSQLTop(pactid, table_no, A_telno_in: {} | any[], A_telno_out: {} | any[], A_postid_in: {} | any[], carid_before) {
		var ignore = false;

		if (12 < table_no) {
			table_no -= 12;
			ignore = true;
		}

		while (table_no.length < 2) table_no = "0" + table_no;

		var sql = "select top_x_tb.telno as telno";
		sql += ",top_x_tb.totelno as totelno";
		sql += ",sum(top_x_tb.sec) as sec";
		sql += " from sim_top_telno_" + table_no + "_tb as top_x_tb";
		sql += " left join tel_" + table_no + "_tb as tel_x_tb";
		sql += " on top_x_tb.pactid=tel_x_tb.pactid";
		sql += " and top_x_tb.carid=tel_x_tb.carid";
		sql += " and top_x_tb.telno=tel_x_tb.telno";
		sql += " where top_x_tb.pactid=" + this.escape(pactid);
		sql += " and top_x_tb.carid=" + this.escape(carid_before);
		sql += this.getSQLWhereTelno("top_x_tb", "telno", A_telno_in, A_telno_out);
		if (ignore) sql += " and true=false";
		if (A_postid_in.length) sql += " and tel_x_tb.postid in (" + A_postid_in.join(",") + ")";
		sql += " group by top_x_tb.telno,top_x_tb.totelno";
		sql += " order by top_x_tb.telno,top_x_tb.totelno";
		sql += ";";
		return sql;
	}

	getSQLWhereTelno(table_name, key, A_telno_in: {} | any[], A_telno_out: {} | any[]) {
		var sql = "";
		var A_src = [[A_telno_in, ""], [A_telno_out, "not"]];

		for (var pair of Object.values(A_src)) {
			if (0 == pair[0].length) continue;
			sql += " and " + table_name;
			if (table_name.length) sql += ".";
			sql += key;
			sql += " " + pair[1] + " in(";
			var comma = false;

			for (var telno of Object.values(pair[0])) {
				if (comma) sql += ",";
				comma = true;
				sql += "'" + this.escape(telno) + "'";
			}

			sql += ")";
		}

		return sql;
	}

	calcAve(H_ave: {} | any[], A_predata: {} | any[], A_trend: {} | any[], A_top: {} | any[], length, is_change_carrier) //predataのデータのあった月数
	//統計情報のあった月数
	//使用頻度の高い電話のあった月数
	//array(0 => メール以外のパケット数,1 => メール)
	//メール比率のあった月
	//期間の合計を求める
	//期間で割る
	//割引率は最新月の値を使用する
	{
		H_ave = {
			trend: Array(),
			top: Array(),
			predata: Array()
		};
		var diff_predata = 0;
		var diff_trend = 0;
		var diff_top = 0;
		var H_packet = {
			0: 0,
			1: 0
		};
		var diff_packet = 0;

		for (var cnt = 0; cnt < length; ++cnt) //通話料割引率など
		//統計情報
		//使用頻度の高い電話
		//パケット総数とメール比率から、種別ごとのパケット数
		{
			if (A_predata[cnt].length) ++diff_predata;
			{
				let _tmp_9 = A_predata[cnt];

				for (var code in _tmp_9) {
					var value = _tmp_9[code];
					if (!(undefined !== H_ave.predata[code])) H_ave.predata[code] = 0;
					H_ave.predata[code] += value;
				}
			}
			if (A_trend[cnt].length) ++diff_trend;
			{
				let _tmp_10 = A_trend[cnt];

				for (var code in _tmp_10) {
					var H_key = _tmp_10[code];
					if (!(undefined !== H_ave.trend[code])) H_ave.trend[code] = Array();

					for (var key in H_key) {
						var value = H_key[key];
						if (!(undefined !== H_ave.trend[code][key])) H_ave.trend[code][key] = 0;
						H_ave.trend[code][key] = H_ave.trend[code][key] + value;
					}
				}
			}
			if (A_top[cnt].length) ++diff_top;
			{
				let _tmp_11 = A_top[cnt];

				for (var totelno in _tmp_11) {
					var sec = _tmp_11[totelno];
					if (!(undefined !== H_ave.top[totelno])) H_ave.top[totelno] = 0;
					H_ave.top[totelno] += sec;
				}
			}
			var is_ratio = false;
			var ratio = 0;

			if (is_change_carrier) //他キャリア間なら、比率が無ければデフォルト値とする
				{
					is_ratio = true;
					ratio = UpdateRecomConst.g_packetratio_mail;
				}

			if (undefined !== A_trend[cnt].packetratio) //比率を求める
				{
					var sum = 0;

					for (var value of Object.values(A_trend[cnt].packetratio)) sum += value;

					if (0 < sum) {
						is_ratio = true;
						ratio = 0;
						if (undefined !== A_trend[cnt].packetratio[11]) ratio = A_trend[cnt].packetratio[11] / sum;
					}
				}

			if (is_ratio) //種別毎の比率が比率が存在する
				//iモードのパケット総数をメールとそれ以外に分離して加算する
				{
					++diff_packet;
					var packet = 0;
					if (undefined !== A_trend[cnt].packetcnt && undefined !== A_trend[cnt].packetcnt[10]) packet = A_trend[cnt].packetcnt[10];
					H_packet[0] = H_packet[0] + packet * (1 - ratio);
					H_packet[1] = H_packet[1] + packet * ratio;
				}
		}

		if (diff_predata) {
			var temp = Array();
			{
				let _tmp_12 = H_ave.predata;

				for (var code in _tmp_12) {
					var value = _tmp_12[code];
					temp[code] = Math.round(value / diff_predata);
				}
			}
			H_ave.predata = temp;
		}

		if (diff_trend) {
			temp = Array();
			{
				let _tmp_13 = H_ave.trend;

				for (var code in _tmp_13) {
					var H_key = _tmp_13[code];
					if (!(undefined !== temp[code])) temp[code] = Array();

					for (var key in H_key) {
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
					let _tmp_14 = H_ave.top;

					for (var totelno in _tmp_14) {
						var sec = _tmp_14[totelno];
						temp[totelno] = Math.round(sec / diff_top);
					}
				}
				arsort(temp);
				reset(temp);
				H_ave.top = Array();
				cnt = 0;

				for (var totelno in temp) {
					var sec = temp[totelno];
					if (5 <= cnt) break;
					++cnt;
					H_ave.top[totelno] = sec;
				}
			}

		H_ave.trend.is_hodai_mail = Array();
		H_ave.trend.is_hodai_mail[0] = diff_packet == diff_trend ? 1 : 0;

		if (H_ave.trend.is_hodai_mail[0]) //メール比率が有効である
			{
				sum = H_packet[0] + H_packet[1];

				if (!sum) {
					H_ave.trend.is_hodai_mail[1] = 0;
				} else {
					H_ave.trend.is_hodai_mail[1] = 100 * H_packet[1] / sum;
				}
			} else //メール比率は無効である
			{
				H_ave.trend.is_hodai_mail[1] = 0;
			}

		var A_key = this.m_A_predata_disratio;

		for (var key of Object.values(A_key)) if (undefined !== A_predata[0][key]) H_ave.predata[key] = A_predata[0][key];

		A_key = this.m_A_predata_required;

		for (var key of Object.values(A_key)) if (!(undefined !== H_ave.predata[key])) H_ave.predata[key] = 0;

		{
			let _tmp_15 = this.m_H_ave_trend_default;

			for (var code in _tmp_15) {
				var H_code = _tmp_15[code];
				if (!(undefined !== H_ave.trend[code])) H_ave.trend[code] = H_code;
			}
		}
		return true;
	}

	getDisratio(H_disratio: {} | any[], pactid) {
		H_disratio = Array();

		if (undefined !== this.m_H_disratio[pactid][this.get_carid_after()]) {
			H_disratio = this.m_H_disratio[pactid][this.get_carid_after()];
			return true;
		}

		var sql = "select cirid,disratiotalk from disratio_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and carid=" + this.escape(this.get_carid_after());
		sql += ";";
		var result = this.m_db.getHash(sql);

		if (result.length) {
			var msg = "\u9867\u5BA2\u5168\u4F53\u306E\u901A\u8A71\u6599\u5272\u5F15\u7387";

			for (var line of Object.values(result)) {
				var cirid = line.cirid;
				if (!(undefined !== line.disratiotalk)) continue;
				var ratio = line.disratiotalk;
				H_disratio[cirid] = ratio;
				msg += "/" + cirid + "->" + ratio;

				if (100 < ratio) {
					this.putError(G_SCRIPT_WARNING, "\u9867\u5BA2\u5168\u4F53\u306E\u901A\u8A71\u6599\u5272\u5F15\u7387\u304C100%\u3092\u8D85\u3048\u3066\u3044\u308B/cirid=" + cirid);
					return false;
				}
			}

			this.putError(G_SCRIPT_INFO, msg);
		} else this.putError(G_SCRIPT_INFO, "\u9867\u5BA2\u5168\u4F53\u306E\u901A\u8A71\u6599\u5272\u5F15\u7387\u6307\u5B9A\u7121\u3057");

		this.m_H_disratio[pactid][this.get_carid_after()] = H_disratio;
		return true;
	}

	getRelationPost(pactid, table_no, postid) {
		var A_postid = [postid];

		while (true) {
			var sql = "select postidchild from post_relation_" + table_no + "_tb";
			sql += " where pactid=" + pactid;
			sql += " and postidparent in (" + A_postid.join(",") + ")";
			sql += ";";
			var A_result = this.m_db.getAll(sql);
			var A_new = Array();

			for (var A_line of Object.values(A_result)) A_new.push(A_line[0]);

			A_new = array_diff(A_new, A_postid);
			if (!A_new.length) break;

			for (var postid of Object.values(A_new)) A_postid.push(postid);
		}

		return A_postid;
	}

	insert_log(H_log, code, key, value, memo = "", level = UpdateRecomBase.g_log_normal) //planid,packetidが存在しなければ-1を設定しておく
	{
		if (this.m_assert < level) return;
		H_log[this.m_log_index_code] = this.m_O_inserter_log.escapeStr(code);
		H_log[this.m_log_index_key] = key;
		H_log[this.m_log_index_value] = Math.round(value);
		H_log[this.m_log_index_memo] = this.m_O_inserter_log.escapeStr(memo);
		if (!(undefined !== H_log[this.m_log_index_planid]) || 0 == H_log[this.m_log_index_planid].length || 0 == strcmp("\\N", H_log[this.m_log_index_planid])) H_log[this.m_log_index_planid] = -1;
		if (!(undefined !== H_log[this.m_log_index_packetid]) || 0 == H_log[this.m_log_index_packetid].length || 0 == strcmp("\\N", H_log[this.m_log_index_packetid])) H_log[this.m_log_index_packetid] = -1;
		if (!this.m_O_inserter_log.insertRaw(H_log, false)) this.putError(G_SCRIPT_ERROR, "inserter_log->insert\u5931\u6557" + H_log[this.m_O_inserter_log.getIndex("telno")]);
	}

	insert_log_ave(H_log, H_ave, level = UpdateRecomBase.g_log_ave) {
		{
			let _tmp_16 = H_ave.predata;

			for (var code in _tmp_16) {
				var value = _tmp_16[code];
				this.insert_log(H_log, code, 0, value, "ave_preadata", level);
			}
		}
		{
			let _tmp_17 = H_ave.trend;

			for (var code in _tmp_17) {
				var H_key = _tmp_17[code];

				for (var key in H_key) {
					var value = H_key[key];
					this.insert_log(H_log, code, key, value, "ave_trend", level);
				}
			}
		}
		{
			let _tmp_18 = H_ave.top;

			for (var telno in _tmp_18) {
				var sec = _tmp_18[telno];
				this.insert_log(H_log, telno, 0, sec, "ave_top", level);
			}
		}
	}

};