//===========================================================================
//機能：請求明細から回線種別などを予測する(ドコモ専用)
//
//作成：森原
//===========================================================================
//全社共通の地域会社
//V3型の権限
//---------------------------------------------------------------------------
//機能：請求明細から回線種別などを予測する機能型(ドコモ専用)

require("lib/script_db.php");

require("lib/script_common.php");

const ARID_COMMON = 100;
const AUTH_V3 = 120;
const TOO_BIG_INTEGER = 2147483647;

//プランマスター(プランIDからプラン情報へのハッシュ)
//プラン情報は以下の通り
//id => プランID
//name => 名称
//arid => 地域会社
//cirid => 回線種別
//fix => array(基本料と第二基本料)
//prior_order => 優先度
//is_data => データ専用プランならtrue
//packet => array(組み合わせ可能なpacketid)
//パケットマスター(パケットIDから情報へのハッシュ)
//パケット情報は以下の通り
//id => パケットID
//name => 名称
//arid => 地域会社
//cirid => 回線種別
//fix => array(基本料と第二基本料)
//prior_order => 優先度
//全地域会社
//全回線種別
//地域会社,回線種別->パケットパックなしIDへの変換表
//ショップの地域会社(ホットライン専用)
//買い方によって優先するプランID
//V3型顧客を処理中ならtrue
//planidからbuyselidへのハッシュ
//地域会社共通以外のプラン => 共通のプラン
//同じくパケット
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：ショップの地域会社を設定する
//引数：ショップの地域会社(ホットライン専用)
//機能：V3型顧客フラグを設定する
//機能：回線種別などを予測する
//引数：予測する電話番号
//明細(telno,code,charge,prtelno)
//前月のtel_X_tbのtelno,arid,cirid,planid,packetid
//結果のハッシュを返す(詳細はGuessDocomo->executeを参照)
//エラーメッセージを返す(同上)
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：回線種別などを予測する
//引数：予測する電話番号
//明細(telno,code,charge,prtelno)
//前月のtel_X_tbのtelno,arid,cirid,planid,packetid
//結果のハッシュを返す
//エラーメッセージを返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：配列の値をある値に設定する
//引数：配列
//設定する値
//配列に設定する値が含まれていない時に設定する値
//機能：明細からの地域会社・回線種別の絞り込み
//引数：電話番号
//明細情報
//地域会社を絞り込んで返す
//回線種別を絞り込んで返す
//エラーメッセージを返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：明細からのプラン・パケットの絞り込み
//引数：電話番号
//明細情報
//プランを絞り込んで返す
//パケットを絞り込んで返す
//エラーメッセージを返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：前月データを用いた候補の絞り込み
//引数：電話番号
//明細情報
//前月データ
//地域会社を絞り込んで返す
//回線種別を絞り込んで返す
//プランを絞り込んで返す
//パケットを絞り込んで返す
//親番号を返す
//エラーメッセージを返す
//返値：深刻なエラーが発生したらfalseを返す
//機能：合致した地域会社・回線種別・プラン・パケットを取り出す
//引数：電話番号
//明細情報
//前月データ
//地域会社
//回線種別
//プラン
//パケット
//結果を返す
//エラーメッセージを返す
//返値：深刻なエラーが発生したらfalseを返す
class GuessDocomoCore extends ScriptDBAdaptor {
	GuessDocomoCore(listener, db, table_no) //プランマスターの準備
	//プラン第二基本料を読み出す
	//組み合わせ可能なパケットパックを読み出す
	//パケットマスターの準備
	//パケット第二基本料を読み出す
	//総務省の地域会社マスターは読まなくなった
	//全地域会社
	//地域会社無しも追加する
	//全回線種別
	//地域会社->パケットパックなしIDへの変換表を作る
	//買い方によって優先するプラン
	//planidからbuyselidへのハッシュ
	//地域会社共通のプランと、該当する他の地域会社のプランの対応関係を作る
	//同じくパケット
	{
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_shop_arid = undefined;
		var sql = "select planid as id,planname as name,arid,cirid,basic as fix";
		sql += ",coalesce(prior_order, " + TOO_BIG_INTEGER + ") as prior_order";
		var A_key_boolean = ["is_data"];

		for (var key of Object.values(A_key_boolean)) {
			sql += ",case when coalesce(" + key + ",false)" + " then 1 else 0 end as " + key;
		}

		sql += " from plan_tb";
		sql += " where carid=" + G_CARRIER_DOCOMO;
		sql += " and viewflg=true";
		sql += ";";
		var result = this.m_db.getHash(sql);
		this.m_H_plan = Array();

		for (var line of Object.values(result)) {
			line.fix = [line.fix];
			line.packet = Array();
			this.m_H_plan[line.id] = line;
		}

		sql = "select planid,basic from plan_basic_tb;";
		result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			var planid = line.planid;
			var basic = line.basic;
			if (undefined !== this.m_H_plan[planid]) this.m_H_plan[planid].fix.push(basic);
		}

		sql = "select * from plan_rel_packet_tb" + " where planid in (" + " select planid from plan_tb where carid=" + G_CARRIER_DOCOMO + ")" + ";";
		result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			if (!(undefined !== this.m_H_plan[line.planid])) continue;
			this.m_H_plan[line.planid].packet.push(line.packetid);
		}

		sql = "select packetid as id,packetname as name" + ",arid,cirid,fixcharge as fix";
		sql += ",coalesce(prior_order, " + TOO_BIG_INTEGER + ") as prior_order";
		sql += " from packet_tb";
		sql += " where carid=" + G_CARRIER_DOCOMO;
		sql += " and viewflg=true";
		sql += ";";
		result = this.m_db.getHash(sql);
		this.m_H_packet = Array();

		for (var line of Object.values(result)) {
			line.fix = [line.fix];
			this.m_H_packet[line.id] = line;
		}

		sql = "select packetid,fixcharge from packet_basic_tb;";
		result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			var packetid = line.packetid;
			var fix = line.fixcharge;
			if (undefined !== this.m_H_packet[packetid]) this.m_H_packet[packetid].fix.push(fix);
		}

		sql = "select arid from area_tb";
		sql += " where";
		sql += " (";
		sql += " carid=" + G_CARRIER_DOCOMO;
		sql += " and arid!=" + G_AREA_DOCOMO_UNKNOWN;
		sql += ")";
		sql += " or arid=" + ARID_COMMON;
		sql += ";";
		result = this.m_db.getAll(sql);
		this.m_A_arid = Array();

		for (var line of Object.values(result)) this.m_A_arid.push(line[0]);

		sql = "select cirid from circuit_tb";
		sql += " where carid=" + G_CARRIER_DOCOMO;
		sql += " and cirid!=" + G_CIRCUIT_DOCOMO_OTHER;
		sql += ";";
		result = this.m_db.getAll(sql);
		this.m_A_cirid = Array();

		for (var line of Object.values(result)) this.m_A_cirid.push(line[0]);

		sql = "select arid,cirid,packetid from packet_tb";
		sql += " where carid=1";
		sql += " and cirid in(" + G_CIRCUIT_FOMA + "," + G_CIRCUIT_DOCOMO_XI + ")";
		sql += " and is_empty=true";
		sql += ";";
		result = this.m_db.getHash(sql);
		this.m_H_packet_zero = Array();

		for (var line of Object.values(result)) this.m_H_packet_zero[line.arid + "," + line.cirid] = line.packetid;

		sql = "select planid from plan_tb" + " where coalesce(is_prior,false)=true;";
		result = this.m_db.getHash(sql);
		this.m_A_plan_prior = Array();

		for (var line of Object.values(result)) this.m_A_plan_prior.push(line.planid);

		sql = "select planid,buyselid from plan_tb;";
		result = this.m_db.getHash(sql);
		this.m_H_buyselid = Array();

		for (var line of Object.values(result)) this.m_H_buyselid[line.planid] = line.buyselid;

		sql = "select planid,planname,buyselid,cirid,arid" + " from plan_tb" + " where carid=" + G_CARRIER_DOCOMO + " order by arid,cirid,buyselid" + ";";
		result = this.m_db.getHash(sql);
		var H_100 = Array();
		var H_all = Array();

		for (var H_line of Object.values(result)) {
			var name = H_line.planname;
			name = str_replace("\u3000", "", name);
			name = str_replace(" ", "", name);
			name = mb_convert_kana(name, "VASK");
			var key = H_line.cirid + "," + name;

			if (ARID_COMMON == H_line.arid) {
				if (!(undefined !== H_100[key])) H_100[key] = Array();
				H_100[key][H_line.planid] = H_line.buyselid;
			} else {
				if (!(undefined !== H_all[key])) H_all[key] = Array();
				H_all[key][H_line.planid] = H_line.buyselid;
			}
		}

		this.m_H_planid_100 = Array();

		for (var key in H_all) {
			var H_planid = H_all[key];
			if (!(undefined !== H_100[key])) continue;

			for (var planid in H_planid) {
				var buyselid = H_planid[planid];

				if (1 == H_100[key].length) //地域会社共通に該当するプランが一個だけなのでそれを選ぶ
					{
						{
							let _tmp_0 = H_100[key];

							for (var k in _tmp_0) {
								var v = _tmp_0[k];
								this.m_H_planid_100[planid] = k;
								break;
							}
						}
					} else //地域会社共通に該当するプランが複数ある
					//買い方が合致するものを探す
					//合致しなければ先頭のプランを選ぶ
					{
						var is_match = false;
						if (!buyselid.length) var buyselid = 1;
						{
							let _tmp_1 = H_100[key];

							for (var k in _tmp_1) {
								var v = _tmp_1[k];

								if (buyselid == v) {
									is_match = true;
									this.m_H_planid_100[planid] = k;
									break;
								}
							}
						}

						if (!is_match) {
							{
								let _tmp_2 = H_100[key];

								for (var k in _tmp_2) {
									var v = _tmp_2[k];
									this.m_H_planid_100[planid] = k;
									break;
								}
							}
						}
					}
			}
		}

		sql = "select packetid,packetname,cirid,arid" + " from packet_tb" + " where carid=" + G_CARRIER_DOCOMO + " order by arid,cirid" + ";";
		result = this.m_db.getHash(sql);
		H_100 = Array();
		H_all = Array();

		for (var H_line of Object.values(result)) {
			name = H_line.packetname;
			name = str_replace("\u3000", "", name);
			name = str_replace(" ", "", name);
			name = mb_convert_kana(name, "VASK");
			key = H_line.cirid + "," + name;

			if (ARID_COMMON == H_line.arid) {
				H_100[key] = H_line.packetid;
			} else {
				if (!(undefined !== H_all[key])) H_all[key] = Array();
				H_all[key].push(H_line.packetid);
			}
		}

		this.m_H_packetid_100 = Array();

		for (var key in H_all) {
			var A_packetid = H_all[key];
			if (!(undefined !== H_100[key])) continue;

			for (var packetid of Object.values(A_packetid)) this.m_H_packetid_100[packetid] = H_100[key];
		}
	}

	set_shop_arid(shop_arid) {
		this.m_shop_arid = shop_arid;
	}

	set_v3(is_v3) {
		this.m_is_v3 = is_v3;
	}

	execute(telno, A_detail, H_last, H_result, H_errmsg) {
		H_result = {
			prtelno: undefined,
			cirid: undefined,
			arid: undefined,
			planid: undefined,
			planalert: false,
			packetid: undefined,
			packetalert: false
		};
		H_errmsg = {
			prtelno: Array(),
			cirid: Array(),
			arid: Array(),
			planid: Array(),
			packetid: Array()
		};
		return this.do_execute(telno, A_detail, H_last, H_result, H_errmsg);
	}

	do_execute(telno, A_detail, H_last, H_result, H_errmsg) //明細からの地域会社・回線種別の絞り込み
	{
		var A_arid = this.m_A_arid;
		var A_cirid = this.m_A_cirid;
		var A_plan = Array();
		var A_packet = Array();
		var prtelno = "";
		if (!this.pass1(telno, A_detail, A_arid, A_cirid, H_errmsg)) return false;
		if (!this.pass2(telno, A_detail, A_plan, A_packet, H_errmsg)) return false;
		if (!this.pass3(telno, A_detail, H_last, A_arid, A_cirid, A_plan, A_packet, prtelno, H_errmsg)) return false;
		if (!this.pass4(telno, A_detail, H_last, A_arid, A_cirid, A_plan, A_packet, prtelno, H_result, H_errmsg)) return false;
		return true;
	}

	setArray(A_tgt, value, def) {
		if (-1 !== A_tgt.indexOf(value)) {
			A_tgt = [value];
		} else {
			if (undefined !== def) A_tgt = [def];
		}
	}

	pass1(telno, A_detail, A_arid, A_cirid, H_errmsg) //1.1)PHSの処理は除去した
	//明細による処理は除去した
	//1.2)請求にパケット定額「02I」「200」があれば、FOMAとする。
	//1.3)請求にDopa「026」「226」があれば、回線種別その他とする
	//1.4)請求にiモード「027」「227」があれば、MOVAかFOMAとする
	//1.5)請求の「001」のうち、二つ目以降に100円があればMOVAとする。
	//1.6)請求に「*2P*」があれば、FOMAとする。
	//同)請求に「F**」があれば、FOMAとする
	//1.7)請求にダイヤル通話料(「020」か「220」)があり、
	//FOMA関連(「2P」「02I」/「F**」「200」)がなければ、MOVAとする。
	//1.8)ここまでで回線種別がMOVAとFOMAだけになったら、FOMAとする
	{
		return true;
	}

	pass2(telno, A_detail, A_plan, A_packet, H_errmsg) {
		for (var H_line of Object.values(A_detail)) //プラン候補の追加
		{
			var code = H_line.code;
			var charge = H_line.charge;

			if (0 == strcmp("001", code)) {
				{
					let _tmp_3 = this.m_H_plan;

					for (var id in _tmp_3) {
						var H_info = _tmp_3[id];
						if (!(-1 !== H_info.fix.indexOf(charge))) continue;
						if (!(-1 !== A_plan.indexOf(id))) A_plan.push(id);
					}
				}
			}

			if (0 == strcmp("02I", code) || 0 == strcmp("200", code)) {
				{
					let _tmp_4 = this.m_H_packet;

					for (var id in _tmp_4) {
						var H_info = _tmp_4[id];
						if (!(-1 !== H_info.fix.indexOf(charge))) continue;
						if (!(-1 !== A_packet.indexOf(id))) A_packet.push(id);
					}
				}
			}
		}

		return true;
	}

	pass3(telno, A_detail, H_last, A_arid, A_cirid, A_plan, A_packet, prtelno, H_errmsg) //親番号の取り出し
	//回線で絞り込む(地域では絞り込まない)
	//回線で絞り込む
	{
		var A_prtelno = Array();

		for (var H_line of Object.values(A_detail)) {
			if (0 == H_line.prtelno.length) continue;
			var pr = H_line.prtelno;
			if (!(-1 !== A_prtelno.indexOf(pr))) A_prtelno.push(pr);
		}

		if (A_prtelno.length) prtelno = A_prtelno[0];

		if (1 < A_arid.length) {
			if (-1 !== A_arid.indexOf(H_last.arid)) A_arid = [H_last.arid];
		}

		if (1 < A_arid.length) //総務省データの消滅により、この処理は削除した
			//ショップの地域会社があれば、それを優先する
			//ただしV3型顧客なら地域会社共通とする
			{
				if (!this.m_is_v3) {
					if (undefined !== this.m_shop_arid && -1 !== A_arid.indexOf(this.m_shop_arid)) A_arid = [this.m_shop_arid];
				} else {
					A_arid = [ARID_COMMON];
				}
			}

		if (1 != A_arid.length) {
			A_arid = [ARID_COMMON];
		}

		if (1 < A_cirid.length) {
			var A_temp = Array();

			for (var id of Object.values(A_plan)) {
				var H_info = this.m_H_plan[id];
				if (!(-1 !== A_temp.indexOf(H_info.cirid))) A_temp.push(H_info.cirid);
			}

			if (A_temp.length) A_cirid = A_temp;
			A_temp = Array();

			for (var id of Object.values(A_packet)) {
				H_info = this.m_H_packet[id];
				if (!(-1 !== A_temp.indexOf(H_info.cirid))) A_temp.push(H_info.cirid);
			}

			if (A_temp.length) A_cirid = A_temp;
		}

		if (1 < A_cirid.length) {
			if (-1 !== A_cirid.indexOf(H_last.cirid)) A_cirid = [H_last.cirid];
		}

		if (0 == A_cirid.length) {
			H_errmsg.cirid.push("\u56DE\u7DDA\u7A2E\u5225\u306E\u5019\u88DC\u5B58\u5728\u305B\u305A");
		} else if (1 < A_cirid.length) {
			H_errmsg.cirid.push("\u56DE\u7DDA\u7A2E\u5225\u306E\u5019\u88DC\u304C\u8907\u6570\u5B58\u5728\u3059\u308B");
			A_cirid = Array();
		}

		if (0 == A_cirid.length) A_plan = Array();
		A_temp = Array();

		for (var id of Object.values(A_plan)) {
			H_info = this.m_H_plan[id];
			if (!(-1 !== A_cirid.indexOf(H_info.cirid))) continue;
			A_temp.push(id);
		}

		A_plan = A_temp;

		if (1 < A_plan.length) {
			if (-1 !== A_plan.indexOf(H_last.planid)) //前月のプランと同じ名前で地域会社共通にあればそちらにする
				{
					var last = H_last.planid;
					if (undefined !== this.m_H_planid_100[last]) last = this.m_H_planid_100[last];
					A_plan = [last];
				}
		}

		if (1 < A_plan.length) {
			A_temp = Array();

			for (var id of Object.values(A_plan)) {
				if (undefined !== this.m_H_plan[id] && ARID_COMMON == this.m_H_plan[id].arid) A_temp.push(id);
			}

			if (A_temp.length) A_plan = A_temp;
		}

		if (1 < A_plan.length) {
			var cur_prior = undefined;
			A_temp = Array();

			for (var id of Object.values(A_plan)) {
				var tgt_prior = this.m_H_plan[id].prior_order;

				if (!(undefined !== cur_prior) || tgt_prior < cur_prior) {
					cur_prior = tgt_prior;
					A_temp = Array();
				}

				if (tgt_prior == cur_prior) A_temp.push(id);
			}

			A_plan = A_temp;
		}

		if (1 < A_plan.length) {
			A_temp = Array();

			for (var id of Object.values(this.m_A_plan_prior)) if (-1 !== A_plan.indexOf(id)) A_temp.push(id);

			if (A_temp.length) A_plan = A_temp;
		}

		if (0 == A_plan.length) {
			H_errmsg.planid.push("\u6599\u91D1\u30D7\u30E9\u30F3\u306E\u5019\u88DC\u5B58\u5728\u305B\u305A");
		} else if (1 < A_plan.length) {
			H_errmsg.planid.push("\u6599\u91D1\u30D7\u30E9\u30F3\u306E\u5019\u88DC\u304C\u8907\u6570\u5B58\u5728\u3059\u308B");
			A_plan = Array();
		}

		if (0 == A_cirid.length) A_packet = Array();
		A_temp = Array();

		for (var id of Object.values(A_packet)) {
			H_info = this.m_H_packet[id];
			if (!(-1 !== A_cirid.indexOf(H_info.cirid))) continue;
			A_temp.push(id);
		}

		A_packet = A_temp;

		if (1 < A_packet.length) {
			if (-1 !== A_packet.indexOf(H_last.packetid)) //前月のパケットと同じ名前で地域会社共通にあればそちらにする
				{
					last = H_last.packetid;
					if (undefined !== this.m_H_packetid_100[last]) last = this.m_H_packetid_100[last];
					A_packet = [last];
				}
		}

		if (1 < A_packet.length) {
			A_temp = Array();

			for (var id of Object.values(A_packet)) {
				if (undefined !== this.m_H_packet[id] && ARID_COMMON == this.m_H_packet[id].arid) A_temp.push(id);
			}

			if (A_temp.length) A_packet = A_temp;
		}

		if (1 == A_plan.length && undefined !== this.m_H_plan[A_plan[0]] && this.m_H_plan[A_plan[0]].packet.length) {
			var A_rel = this.m_H_plan[A_plan[0]].packet;
			A_temp = Array();

			for (var id of Object.values(A_packet)) {
				if (-1 !== A_rel.indexOf(id)) A_temp.push(id);
			}

			A_packet = A_temp;
		}

		if (1 < A_packet.length) {
			cur_prior = undefined;
			A_temp = Array();

			for (var id of Object.values(A_packet)) {
				tgt_prior = this.m_H_packet[id].prior_order;

				if (!(undefined !== cur_prior) || tgt_prior < cur_prior) {
					cur_prior = tgt_prior;
					A_temp = Array();
				}

				if (tgt_prior == cur_prior) A_temp.push(id);
			}

			A_packet = A_temp;
		}

		if (1 < A_packet.length || 0 == A_packet.length) //明細にパケット定額通信料が無ければ無しとする
			{
				if (1 == A_cirid.length && 1 == A_arid.length && (G_CIRCUIT_FOMA == A_cirid[0] || G_CIRCUIT_DOCOMO_XI == A_cirid[0])) {
					var key = A_arid[0] + "," + A_cirid[0];
					var match = false;

					for (var H_line of Object.values(A_detail)) {
						if (0 == strcmp("02I", H_line.code) || 0 == strcmp("200", H_line.code)) {
							match = true;
							break;
						}
					}

					if (!match && undefined !== this.m_H_packet_zero[key]) {
						A_packet = [this.m_H_packet_zero[key]];
					}
				}
			}

		if (0 == A_packet.length) {
			if (1 == A_cirid.length && (G_CIRCUIT_FOMA == A_cirid[0] || G_CIRCUIT_DOCOMO_XI == A_cirid[0])) {
				H_errmsg.packetid.push("\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306E\u5019\u88DC\u5B58\u5728\u305B\u305A");
			}
		}

		if (1 < A_packet.length) {
			A_packet = Array();
			H_errmsg.packetid.push("\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306E\u5019\u88DC\u304C\u8907\u6570\u5B58\u5728\u3059\u308B");
		}

		return true;
	}

	pass4(telno, A_detail, H_last, A_arid, A_cirid, A_plan, A_packet, prtelno, H_result, H_errmsg) {
		H_result.prtelno = prtelno;
		if (1 == A_arid.length) H_result.arid = A_arid[0];
		if (1 == A_cirid.length) H_result.cirid = A_cirid[0];

		if (1 == A_plan.length) {
			H_result.planid = A_plan[0];
			if (H_last.planid.length && strcmp(H_last.planid, H_result.planid)) H_result.planalert = true;
		}

		if (1 == A_packet.length) {
			H_result.packetid = A_packet[0];
			if (H_last.packetid.length && strcmp(H_last.packetid, H_result.packetid)) H_result.packetalert = true;
		}

		return true;
	}

};

//予測機能型
//処理中の顧客ID
//処理中の年
//処理中の月
//明細情報
//前月のtel_X_tbの情報
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//予測機能型
//機能：明細などを読み出す
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：確保済のリソースを解放する
//返値：深刻なエラーが発生したらfalseを返す
//機能：回線種別などを予測する
//引数：予測する電話番号
//結果のハッシュを返す
//エラーメッセージを返す
//返値：深刻なエラーが発生したらfalseを返す
//備考：電話番号はSQLのソート順で呼び出す事。
//備考：結果のハッシュの内容は以下のとおり
//prtelno => 親番号
//cirid => 回線種別ID
//arid => 地域会社ID
//planid => プランID
//planalert => 前月のプランと食い違えばtrue
//packetid => パケットID
//packetalert => 前月のパケットIDと食い違えばtrue
//備考：エラーメッセージの内容は以下の通り
//prtelno => array(親番号の予測に失敗したメッセージ ...)
//cirid => array(回線種別の予測に失敗したメッセージ ...)
//arid => array(地域会社の予測に失敗したメッセージ ...)
//planid => array(プランの予測に失敗したメッセージ ...)
//packetid => arrray(パケットの予測に失敗したメッセージ ...)
//備考：予測に失敗してもtrueを返す。
//回線種別・地域会社・プラン・パケットの予測に失敗した場合、
//それぞれの結果にはNULLが入る。
//機能：executeの返した警告を整形する
class GuessDocomo extends ScriptDBAdaptor {
	GuessDocomo(listener, db, table_no, O_core) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_O_core = O_core;
	}

	begin(pactid, year, month) //明細の読み出し
	//前月のtel_X_tbの情報
	{
		this.m_pactid = pactid;
		this.m_year = year;
		this.m_month = month;
		var table_no = this.getTableNo(year, month);
		var sql = "select telno,code,charge,prtelno";
		sql += " from tel_details_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " order by telno,detailno";
		sql += ";";
		this.m_O_detail = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		this.m_O_detail.query(sql);
		var last_year = year;
		var last_month = month;
		--last_month;

		if (0 == last_month) {
			last_month = 12;
			--last_year;
		}

		var last_table_no = this.getTableNo(last_year, last_month);
		sql = "select telno,arid,cirid,planid,packetid";
		sql += " from tel_" + last_table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " order by telno";
		sql += ";";
		this.m_O_last = new FetchAdaptor(this.m_listener, this.m_db, "telno");
		this.m_O_last.query(sql);
		return true;
	}

	end() {
		if (undefined !== this.m_O_detail) {
			this.m_O_detail.free();
			delete this.m_O_detail;
		}

		if (undefined !== this.m_O_last) {
			this.m_O_last.free();
			delete this.m_O_last;
		}

		return true;
	}

	execute(telno, H_result, H_errmsg) //DBからの値の取り出し
	{
		var line;
		var A_detail = Array();

		while (line = this.m_O_detail.fetch(telno)) A_detail.push(line);

		var H_last = undefined;

		while (line = this.m_O_last.fetch(telno)) if (!(undefined !== H_last)) H_last = line;

		return this.m_O_core.execute(telno, A_detail, H_last, H_result, H_errmsg);
	}

	format(H_errmsg) {
		var rval = "";
		var delim = "/";

		for (var H_line of Object.values(H_errmsg)) {
			for (var line of Object.values(H_line)) {
				if (line.length) {
					if (rval.length) rval += delim;
					rval += line;
				}
			}
		}

		return rval;
	}

};

//予測機能型
//クォート文字で囲むならtrue
//区切り文字
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：電話を追加する
//引数：顧客ID
//年
//月
//SQLファイルのプリフィックス
//tel_tbに追加するならtrue
//tel_X_tbに追加するならtrue
//CSVのファイル名
//返値：深刻なエラーが発生したらfalseを返す
//昨日：既存の電話を削除する
//引数：顧客ID
//年
//月
//SQLファイルのプリフィックス
//tel_tbならtrue/tel_X_tbならfalse
//返値：深刻なエラーが発生したらfalseを返す
//機能：電話を追加する
//引数：顧客ID
//年
//月
//SQLファイルのプリフィックス
//tel_tbならtrue/tel_X_tbならfalse
//CSVのファイル名
//返値：深刻なエラーが発生したらfalseを返す
class GuessDocomoTel extends ScriptDBAdaptor {
	GuessDocomoTel(listener, db, table_no) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_O_core = new GuessDocomoCore(listener, db, table_no);
		this.m_quote = false;
		this.m_delim = "\t";
	}

	execute(pactid, year, month, pre, use_tel, use_tel_X, csv_name = "") //ショップの地域会社を読み出す
	{
		var shop_arid = undefined;
		var sql = "select postidparent from post_relation_tb";
		sql += " where pactid=" + pactid;
		sql += " and level=0";
		sql += " limit 1";
		sql += ";";
		var top_postid = this.m_db.getOne(sql);

		if (undefined !== top_postid) {
			sql = "select shopid from shop_relation_tb";
			sql += " where pactid=" + pactid;
			sql += " and postid=" + top_postid;
			sql += " and carid=" + G_CARRIER_DOCOMO;
			sql += " limit 1";
			sql += ";";
			var shopid = this.m_db.getOne(sql);

			if (undefined !== shopid) {
				sql = "select arid from shop_carrier_tb";
				sql += " where shopid=" + shopid;
				sql += " and carid=" + G_CARRIER_DOCOMO;
				sql += " limit 1";
				sql += ";";
				shop_arid = this.m_db.getOne(sql);

				if (undefined !== shop_arid) {
					this.putError(G_SCRIPT_INFO, "\u30B7\u30E7\u30C3\u30D7\u5730\u57DF\u4F1A\u793E" + shop_arid + "/" + shopid);
					this.m_O_core.set_shop_arid(shop_arid);
				}
			}
		}

		sql = "select count(*) from fnc_relation_tb";
		sql += " where fncid=" + AUTH_V3;
		sql += " and pactid=" + pactid;
		sql += ";";
		var is_v3 = 0 < this.m_db.getOne(sql);
		this.putError(G_SCRIPT_INFO, (is_v3 ? "V3\u578B\u9867\u5BA2" : "V2\u578B\u9867\u5BA2") + pactid);
		this.m_O_core.set_v3(is_v3);

		if (use_tel) {
			if (!this.delete(pactid, year, month, pre, true)) {
				this.putError(G_SCRIPT_WARNING, "tel_tb\u306E\u96FB\u8A71\u524A\u9664\u306B\u5931\u6557");
				return false;
			}

			if (!this.do_execute(pactid, year, month, pre, true, "")) {
				this.putError(G_SCRIPT_WARNING, "tel_tb\u3078\u306E\u8FFD\u52A0\u306B\u5931\u6557");
				return false;
			}
		}

		if (use_tel_X) {
			if (!this.delete(pactid, year, month, pre, false)) {
				this.putError(G_SCRIPT_WARNING, "tel_X_tb\u306E\u96FB\u8A71\u524A\u9664\u306B\u5931\u6557");
				return false;
			}

			if (!this.do_execute(pactid, year, month, pre, false, csv_name)) {
				this.putError(G_SCRIPT_WARNING, "tel_X_tb\u3078\u306E\u8FFD\u52A0\u306B\u5931\u6557");
				return false;
			}
		}

		this.m_O_core.set_shop_arid(undefined);
		this.m_O_core.set_v3(false);
		return true;
	}

	delete(pactid, year, month, pre, is_tel) //手動入力フラグは常にtel_X_tbを見る
	{
		var table_no = this.getTableNo(year, month);
		var tel_tb = is_tel ? "tel_tb" : "tel_" + table_no + "_tb";
		var sqlwhere = " from " + tel_tb;
		sqlwhere += " where pactid=" + pactid;
		sqlwhere += " and carid=" + G_CARRIER_DOCOMO;
		sqlwhere += " and telno not in (";
		sqlwhere += " select telno from tel_" + table_no + "_tb";
		sqlwhere += " where pactid=" + pactid;
		sqlwhere += " and carid=" + G_CARRIER_DOCOMO;
		sqlwhere += " and coalesce(handflg,false)=true";
		sqlwhere += " group by telno";
		sqlwhere += ")";
		var fname = pre + tel_tb + ".0.delete";
		if (!this.m_db.backup(fname, "select *" + sqlwhere + ";")) return false;
		var sql = "delete";
		sql += sqlwhere;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	do_execute(pactid, year, month, pre, is_tel, csv_name) //CSVファイル作成
	//手動入力された電話を取り出す
	//"T" . 電話番号 -> 手動入力されたtel_tbの内容
	//手動入力電話のうち、削除が必要な電話
	//トップの部署を取り出す
	//処理すべき電話番号のリストを作る
	//電話追加の準備
	//手動入力電話のうち、削除が必要な部分を削除する
	{
		var fh = false;

		if (csv_name.length) {
			fh = fopen(csv_name, "at");

			if (false === fh) {
				this.putError(G_SCRIPT_WARNING, "CSV\u51FA\u529B:\u30D5\u30A1\u30A4\u30EB\u4F5C\u6210\u5931\u6557:" + csv_name);
				return false;
			}
		}

		var table_no = this.getTableNo(year, month);
		var tel_tb = is_tel ? "tel_tb" : "tel_" + table_no + "_tb";
		var tel_handflg_tb = "tel_" + table_no + "_tb";
		var sql = "select * from " + tel_tb;
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += ";";
		var result = this.m_db.getHash(sql);
		var H_tel_hand = Array();

		for (var line of Object.values(result)) H_tel_hand["T" + line.telno] = line;

		var A_delete_hand = Array();
		sql = "select postidparent from";
		if (is_tel) sql += " post_relation_tb";else sql += " post_relation_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and level=0";
		sql += " limit 1";
		sql += ";";
		result = this.m_db.getAll(sql);

		if (0 == result.length) {
			this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0:\u30C8\u30C3\u30D7\u306E\u90E8\u7F72\u304C\u306A\u3044");
			if (csv_name.length) fclose(fh);
			return false;
		}

		var top_postid = result[0][0];
		sql = "select telno from tel_details_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " group by telno";
		sql += " order by telno";
		sql += ";";
		var A_telno = this.m_db.getAll(sql);
		var O_ins = new TableInserter(this.m_listener, this.m_db, pre + tel_tb + ".insert", true);

		if (!O_ins.begin(tel_tb)) {
			this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0:\u8FFD\u52A0\u521D\u671F\u5316\u5931\u6557");
			if (csv_name.length) fclose(fh);
			return false;
		}

		O_ins.setConst({
			pactid: pactid,
			postid: top_postid,
			carid: G_CARRIER_DOCOMO,
			recdate: "now()",
			fixdate: "now()",
			handflg: "false"
		});
		var O_func = new GuessDocomo(this.m_listener, this.m_db, this.m_table_no, this.m_O_core);

		if (!O_func.begin(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0:\u4E88\u6E2C\u578B\u521D\u671F\u5316\u5931\u6557");
			if (csv_name.length) fclose(fh);
			return false;
		}

		var status = true;

		for (var line of Object.values(A_telno)) //その電話番号で手動入力電話があるか
		{
			var telno = line[0];

			if (!O_func.execute(telno, H_result, H_errmsg)) {
				status = false;
				this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0:\u51E6\u7406\u5931\u6557:" + telno);
				break;
			}

			var arid = H_result.arid;
			if (0 == arid.length) arid = G_AREA_DOCOMO_UNKNOWN;
			var cirid = H_result.cirid;
			if (0 == cirid.length) cirid = G_CIRCUIT_DOCOMO_OTHER;
			var telno_view = telno;
			if (11 == telno_view.length) telno_view = telno.substr(0, 3) + "-" + telno.substr(3, 4) + "-" + telno.substr(7, 4);
			var H_ins = {
				telno: telno,
				telno_view: telno_view,
				arid: arid,
				cirid: cirid,
				planid: H_result.planid,
				planalert: H_result.planalert ? "1" : "0",
				packetid: H_result.packetid,
				packetalert: H_result.packetalert ? "1" : "0"
			};

			if (undefined !== H_tel_hand["T" + telno]) //手動入力電話があれば、重複分を処理する
				//手動入力電話から不足情報を補う
				//手動入力電話の削除リストに追加する
				{
					var H_cur = H_tel_hand["T" + telno];

					if (is_tel) //tel_tbの場合、手入力を優先する
						{
							if (strcmp(H_ins.arid, H_cur.arid) || strcmp(H_ins.cirid, H_cur.cirid)) //地域会社・回線種別が異なれば、手動入力値とする
								{
									var A_needle = ["arid", "cirid", "planid", "planalert", "packetid", "packetalert"];

									for (var key of Object.values(A_needle)) H_ins[key] = H_cur[key];
								} else //地域会社・回線種別が同一なら、
								//手動入力値が不明の場合のみクランプ値を使用する
								{
									A_needle = ["planid", "planalert", "packetid", "packetalert"];

									for (var key of Object.values(A_needle)) if (0 == H_ins[key].length) H_ins[key] = H_cur[key];
								}
						} else //tel_X_tbの場合、手入力よりもクランプを優先する
						{
							if (strcmp(H_ins.arid, H_cur.arid) || strcmp(H_ins.cirid, H_cur.cirid)) //地域会社・回線種別が異なれば、クランプ値とする
								//なので何もしない
								{} else //地域会社・回線種別が同一なら、
								//手動入力値が不明の場合のみクランプ値を使用する
								{
									A_needle = ["planid", "planalert", "packetid", "packetalert"];

									for (var key of Object.values(A_needle)) if (0 == H_ins[key].length) H_ins[key] = H_cur[key];
								}
						}

					var A_skip = ["telno", "fixdate", "arid", "cirid", "planid", "planalert", "packetid", "packetalert", "handflg", "buyselid"];

					for (var key in H_cur) {
						var value = H_cur[key];
						if (-1 !== A_skip.indexOf(key)) continue;
						if (!(undefined !== H_ins[key])) H_ins[key] = value;
					}

					A_delete_hand.push("T" + telno);
				}

			if (undefined !== this.m_O_core.m_H_buyselid[H_result.planid]) H_ins.buyselid = this.m_O_core.m_H_buyselid[H_result.planid];

			if (!O_ins.insert(H_ins)) {
				this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0:\u96FB\u8A71\u8FFD\u52A0\u5931\u6557:" + telno);
				if (csv_name.length) fclose(fh);
				return false;
			}

			if (csv_name.length) {
				var A_result = [pactid, H_result.prtelno, telno, cirid, arid, H_result.planid, H_result.packetid, O_func.format(H_errmsg), tel_tb];

				for (var cnt = 0; cnt < A_result.length; ++cnt) {
					var msg = mb_convert_encoding(A_result[cnt], "SJIS-win", "UTF-8");
					if (this.m_quote) msg = "\"" + msg + "\"";
					A_result[cnt] = msg;
				}

				fputs(fh, A_result.join(this.m_delim) + "\r\n");
			}
		}

		if (A_delete_hand.length) {
			var sqlwhere = " from " + tel_tb;
			sqlwhere += " where pactid=" + pactid;
			sqlwhere += " and carid=" + G_CARRIER_DOCOMO;
			sqlwhere += " and telno in (";
			var comma = false;

			for (var telno of Object.values(A_delete_hand)) {
				if (comma) sqlwhere += ",";
				comma = true;
				telno = telno.substr(1);
				sqlwhere += "'" + telno + "'";
			}

			sqlwhere += ")";
			var fname = pre + tel_tb + ".1.delete";
			if (!this.m_db.backup(fname, "select *" + sqlwhere + ";")) return false;
			sql = "delete";
			sql += sqlwhere;
			sql += ";";
			this.putError(G_SCRIPT_SQL, sql);
			this.m_db.query(sql);
		}

		if (!O_func.end()) {
			this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0:\u4E88\u6E2C\u578B\u7D42\u4E86\u51E6\u7406\u5931\u6557");
			if (csv_name.length) fclose(fh);
			return false;
		}

		delete O_func;

		if (!O_ins.end()) {
			this.putError(G_SCRIPT_WARNING, "\u96FB\u8A71\u8FFD\u52A0:\u8FFD\u52A0\u7D42\u4E86\u5931\u6557");
			if (csv_name.length) fclose(fh);
			return false;
		}

		delete O_ins;
		if (csv_name.length) fclose(fh);
		return status;
	}

};

//クォート文字で囲むならtrue
//区切り文字
//予測機能型
//CSVファイル名
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//CSVファイル名
//機能：CSVファイルを出力する
//引数：顧客ID
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
class GuessDocomoCSV extends ScriptDBAdaptor {
	GuessDocomoCSV(listener, db, table_no, fname) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_quote = false;
		this.m_delim = "\t";
		this.m_O_core = new GuessDocomoCore(listener, db, table_no);
		this.m_fname = fname;
	}

	execute(pactid, year, month) //処理すべき電話番号のリストを作る
	//CSV出力を行う
	{
		var sql = "select telno";
		sql += " from tel_details_" + this.getTableNo(year, month) + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and telno in (";
		sql += " select telno from tel_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and (";
		sql += " coalesce(planalert,'')='1' or coalesce(packetalert,'')='1'";
		sql += " )";
		sql += " )";
		sql += " group by telno";
		sql += " order by telno";
		sql += ";";
		var A_telno = this.m_db.getAll(sql);
		var O_func = new GuessDocomo(this.m_listener, this.m_db, this.m_table_no, this.m_O_core);

		if (!O_func.begin(pactid, year, month)) {
			this.putError(G_SCRIPT_WARNING, "CSV\u51FA\u529B:\u4E88\u6E2C\u578B\u521D\u671F\u5316\u5931\u6557");
			return false;
		}

		var fh = fopen(this.m_fname, "at");

		if (false === fh) {
			this.putError(G_SCRIPT_WARNING, "CSV\u51FA\u529B:\u30D5\u30A1\u30A4\u30EB\u4F5C\u6210\u5931\u6557:" + this.m_fname);
			return false;
		}

		var status = true;

		for (var line of Object.values(A_telno)) {
			var telno = line[0];

			if (!O_func.execute(telno, H_result, H_errmsg)) {
				status = false;
				this.putError(G_SCRIPT_WARNING, "CSV\u51FA\u529B:\u51E6\u7406\u5931\u6557:" + telno);
				break;
			}

			var arid = H_result.arid;
			if (0 == arid.length) arid = G_AREA_DOCOMO_UNKNOWN;
			var cirid = H_result.cirid;
			if (0 == cirid.length) cirid = G_CIRCUIT_DOCOMO_OTHER;
			var A_result = [pactid, H_result.prtelno, telno, cirid, arid, H_result.planid, H_result.packetid, O_func.format(H_errmsg), "tel_tb"];

			for (var cnt = 0; cnt < A_result.length; ++cnt) {
				var msg = mb_convert_encoding(A_result[cnt], "SJIS-win", "UTF-8");
				if (this.m_quote) msg = "\"" + msg + "\"";
				A_result[cnt] = msg;
			}

			fputs(fh, A_result.join(this.m_delim) + "\r\n");
		}

		fclose(fh);

		if (!O_func.end()) {
			this.putError(G_SCRIPT_WARNING, "CSV\u51FA\u529B:\u4E88\u6E2C\u578B\u7D42\u4E86\u51E6\u7406\u5931\u6557");
			return false;
		}

		delete O_func;
		return status;
	}

};