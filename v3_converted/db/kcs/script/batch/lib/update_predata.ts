//===========================================================================
//機能：tel_details_X_tbからsim_trend_X_tbを作る(ドコモ、au対応)
//
//作成：中西	2006/11/16
//更新：中西	2007/01/25	削除時にcarid指定
//：中西	2009/10/01	回線ごとの通話・通信割引率を０に固定
//===========================================================================
//32bit最大値
//---------------------------------------------------------------------------
//機能：tel_details_X_tbからsim_trend_X_tbを作る(ドコモ、au対応)

require("script_db.php");

require("script_common.php");

const MAX_FLOAT32 = 2147483647;
const MAX_INT32 = 2147483647;

//データ挿入型
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//データ挿入型
//機能：既存のsim_trend_X_tbからレコードを削除する
//引数：顧客ID
//キャリアID
//年
//月
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//保存先ファイル名(空文字列ならファイル保存せず)
//返値：深刻なエラーが発生したらfalseを返す
//機能：sim_trend_X_tbにレコードを作る
//引数：顧客ID
//キャリアID
//年
//月
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//以下protected
//機能：tel_details_X_tbの内容を、各simkamokuごとに集計を行う
//引数：顧客ID
//キャリアID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//返値：深刻なエラーが発生したらfalseを返す
//機能：tel_details_X_tbの内容を、各simkamokuごとに集計を行う（ドコモ専用）
//引数：顧客ID
//キャリアID
//テーブルNo
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//返値：深刻なエラーが発生したらfalseを返す
//備考：ドコモの場合
//simkamoku基本料のプラスは基本料に、マイナスは基本料割引に加算する
//simkamoku通話料のプラスは通話料に、マイナスは通話料割引に加算する
//simkamoku通信料のプラスは通信料に、マイナスは通信料割引に加算する
//機能：コードごとの合計を登録する
//引数：電話番号、コードごとの合計, 請求金額合計
//返値：深刻なエラーが発生したらfalseを返す
//機能：基本料割引率を付加
//引数：電話番号、基本料、基本料割引
//返値：深刻なエラーが発生したらfalseを返す
//機能：通話料割引率を付加
//auの場合 [通話料割引/通話料]、通信料は対象から外す
//Softbankの場合も auと同様に扱っている
//引数：電話番号、通話料、通話料割引
//返値：深刻なエラーが発生したらfalseを返す
//機能：通話料割引率を付加
//ドコモの場合 [(通話料割引)/(通話料+通信料)]、通信料も対象に含む
//引数：電話番号、通話料、通話料割引
//返値：深刻なエラーが発生したらfalseを返す
//機能：SQL文のWHERE節のうち、電話番号での絞り込み部分を作成する
//引数：テーブル名(末尾にピリオドをつけない事)
//電話番号を表すカラム名
//処理する電話番号の配列(空文字列なら全電話番号)
//無視する電話番号の配列
//テーブル番号
//顧客ID
//キャリアID
//返値：空文字列か、「 AND」から始まるWHERE節の条件部分を返す
class UpdatePredata extends ScriptDBAdaptor {
	UpdatePredata(listener, db, table_no, inserter) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_inserter = inserter;
	}

	delete(pactid, carid, year, month, A_telno, A_skip, fname) //sim_trend_X_tbをバックアップ
	{
		var table_no = this.getTableNo(year, month);
		var sqlfrom = " from sim_trend_" + table_no + "_tb" + " where pactid=" + this.escape(pactid) + " and carid=" + this.escape(carid) + " and code like 'predata%'" + " and length(coalesce(telno,''))>0";
		sqlfrom += this.getSQLWhereTelno("", "telno", A_telno, A_skip, table_no, pactid, carid);

		if (fname.length) {
			if (!this.m_db.backup(fname, "select *" + sqlfrom + ";")) return false;
		}

		var sql = "delete" + sqlfrom;
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		return true;
	}

	execute(pactid, carid, year, month, A_telno, A_skip) //挿入準備
	{
		var table_no = this.getTableNo(year, month);
		if (!this.m_inserter.begin("sim_trend_" + table_no + "_tb")) return false;
		if (!this.m_inserter.setConst({
			pactid: pactid,
			carid: carid,
			recdate: "now()"
		})) return false;

		switch (carid) {
			case G_CARRIER_DOCOMO:
				if (!this.executePredataDocomo(pactid, carid, table_no, A_telno, A_skip)) return false;
				break;

			case G_CARRIER_AU:
				if (!this.executePredata(pactid, carid, table_no, A_telno, A_skip)) return false;
				break;

			case G_CARRIER_VODA:
				if (!this.executePredata(pactid, carid, table_no, A_telno, A_skip)) return false;
				break;

			default:
				return false;
				break;
		}

		if (!this.m_inserter.end()) return false;
		return true;
	}

	executePredata(pactid, carid, table_no, A_telno, A_skip) //FROM節(tel_details_X_tb <- utiwake_tb)
	//WHERE節(pactid,carid)
	//ASP,ASXは除く
	//ORDER BYとGROUP BY
	//科目ごとに集計
	//コードごとの集計値
	//請求合計金額
	//最後の電話についての処理
	{
		var line;
		var sql = "select telno";
		sql += ",utiwake_tb.simkamoku as key";
		sql += ",sum(details_tb.charge) as value";
		sql += ",utiwake_tb.codetype";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid=utiwake_tb.carid";
		sql += " and details_tb.code=utiwake_tb.code)";
		sql += " where details_tb.pactid=" + this.escape(pactid);
		sql += " and details_tb.carid=" + this.escape(carid);
		sql += " and details_tb.code not in('";
		sql += this.escape(G_CODE_ASP) + "','" + this.escape(G_CODE_ASX);
		sql += "')";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid, carid);
		sql += " group by details_tb.telno, utiwake_tb.simkamoku, utiwake_tb.codetype";
		sql += " order by details_tb.telno";
		sql += ";";
		var result = this.m_db.query(sql);
		var prev_telno = "";
		var code_sum = Array();
		var code_total = 0;

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //あり得ないはず
		//今回の電話番号を記録
		{
			if (MAX_FLOAT32 < line.value) {
				line.value = MAX_INT32;
			}

			var kamoku = line.key;

			if (kamoku >= 100 && kamoku <= 109) {
				line.code = "predata_basic";
			} else if (kamoku >= 110 && kamoku <= 119) {
				line.code = "predata_disbasic";
			} else if (kamoku >= 120 && kamoku <= 129) {
				line.code = "predata_talk";
			} else if (kamoku >= 130 && kamoku <= 139) {
				line.code = "predata_distalk";
			} else if (kamoku >= 140 && kamoku <= 149) {
				line.code = "predata_com";
			} else if (kamoku >= 150 && kamoku <= 159) {
				line.code = "predata_discom";
			} else if (kamoku >= 160 && kamoku <= 169) {
				line.code = "predata_disother";
			} else if (kamoku >= 170 && kamoku <= 179) {
				line.code = "predata_fix";
			} else if (kamoku == 182) {
				line.code = "predata_except";
			} else if (kamoku >= 180 && kamoku <= 189) {
				line.code = "predata_other";
			} else if (kamoku >= 190 && kamoku <= 199) {
				line.code = "predata_tax";
			} else {
				line.code = "predata_other";
			}

			if (prev_telno === "") //初回
				{
					prev_telno = line.telno;
				}

			if (line.telno !== prev_telno) //文字列比較は型まで指定すること
				//codeごとの集計をまとめて登録する
				{
					if (!this.telSumInsert(prev_telno, code_sum, code_total)) {
						return false;
					}

					if (!this.telRatioBasic(prev_telno, code_sum)) {
						return false;
					}

					if (!this.telRatioTuwaAu(prev_telno, code_sum)) {
						return false;
					}

					code_sum = Array();
					code_total = 0;
				}

			if (line.code !== "predata_except") //「その他除外」は集計から除く
				{
					if (!(undefined !== code_sum[line.code])) {
						code_sum[line.code] = Array();
					}

					var code_sum_array = code_sum[line.code];

					if (!(undefined !== code_sum_array[line.key])) {
						code_sum_array[line.key] = line.value;
					} else {
						code_sum_array[line.key] += line.value;
					}

					code_sum[line.code] = code_sum_array;
				}

			if (line.codetype == 0) //codetype == 0 のものだけを集計
				{
					code_total += line.value;
				}

			prev_telno = line.telno;
		}

		result.free();

		if (prev_telno !== "") //処理すべき電話が１つでもあれば
			//codeごとの集計をまとめて登録する
			{
				if (!this.telSumInsert(prev_telno, code_sum, code_total)) return false;
				if (!this.telRatioBasic(prev_telno, code_sum)) return false;
				if (!this.telRatioTuwaAu(prev_telno, code_sum)) return false;
			}

		return true;
	}

	executePredataDocomo(pactid, carid, table_no, A_telno, A_skip) //FROM節(tel_details_X_tb <- utiwake_tb)
	//WHERE節(pactid,carid)
	//ASP,ASXは除く
	//ORDER BY
	//コードごとの集計値
	//請求合計金額
	//最後の電話についての処理
	{
		var line;
		var sql = "select telno";
		sql += ",utiwake_tb.simkamoku as key";
		sql += ",details_tb.charge as value";
		sql += " from tel_details_" + table_no + "_tb as details_tb";
		sql += " inner join utiwake_tb";
		sql += " on (details_tb.carid=utiwake_tb.carid";
		sql += " and details_tb.code=utiwake_tb.code)";
		sql += " where details_tb.pactid=" + this.escape(pactid);
		sql += " and details_tb.carid=" + this.escape(carid);
		sql += " and details_tb.code not in('";
		sql += this.escape(G_CODE_ASP) + "','" + this.escape(G_CODE_ASX);
		sql += "')";
		sql += this.getSQLWhereTelno("details_tb", "telno", A_telno, A_skip, table_no, pactid, carid);
		sql += " order by details_tb.telno";
		sql += ";";
		var result = this.m_db.query(sql);
		var prev_telno = "";
		var code_sum = Array();
		var code_total = 0;

		while (line = result.fetchRow(DB_FETCHMODE_ASSOC)) //あり得ないはず
		//今回の電話番号を記録
		{
			if (MAX_FLOAT32 < line.value) line.value = MAX_INT32;
			var kamoku = line.key;

			if (kamoku >= 100 && kamoku <= 109) {
				if (line.value >= 0) //プラスの場合は基本料
					{
						line.code = "predata_basic";
					} else //マイナスの場合は基本料割引
					//基本料割引に付け替える
					{
						line.code = "predata_disbasic";
						line.key = 110;
					}
			} else if (kamoku >= 110 && kamoku <= 119) {
				line.code = "predata_disbasic";
			} else if (kamoku >= 120 && kamoku <= 129) {
				if (line.value >= 0) //プラスの場合は通話料
					{
						line.code = "predata_talk";
					} else //マイナスの場合は通話料割引
					//通話料割引に付け替える
					{
						line.code = "predata_distalk";
						line.key = 130;
					}
			} else if (kamoku >= 130 && kamoku <= 139) {
				line.code = "predata_distalk";
			} else if (kamoku >= 140 && kamoku <= 149) {
				if (line.value >= 0) //プラスの場合は通信料
					{
						line.code = "predata_com";
					} else //マイナスの場合は通信料割引
					//通信料割引に付け替える
					{
						line.code = "predata_discom";
						line.key = 150;
					}
			} else if (kamoku >= 150 && kamoku <= 159) {
				line.code = "predata_discom";
			} else if (kamoku >= 160 && kamoku <= 169) {
				line.code = "predata_disother";
			} else if (kamoku >= 170 && kamoku <= 179) {
				line.code = "predata_fix";
			} else if (kamoku == 182) {
				continue;
			} else if (kamoku >= 180 && kamoku <= 189) {
				line.code = "predata_other";
			} else if (kamoku >= 190 && kamoku <= 199) {
				line.code = "predata_tax";
			} else {
				line.code = "predata_other";
			}

			if (prev_telno == "") //初回
				{
					prev_telno = line.telno;
				}

			if (line.telno !== prev_telno) //文字列比較は型まで指定すること
				//codeごとの集計をまとめて登録する
				{
					if (!this.telSumInsert(prev_telno, code_sum, code_total)) return false;
					if (!this.telRatioBasic(prev_telno, code_sum)) return false;
					if (!this.telRatioTuwaDocomo(prev_telno, code_sum)) return false;
					code_sum = Array();
				}

			if (!(undefined !== code_sum[line.code])) {
				code_sum[line.code] = Array();
			}

			var code_sum_array = code_sum[line.code];

			if (!(undefined !== code_sum_array[line.key])) {
				code_sum_array[line.key] = line.value;
			} else {
				code_sum_array[line.key] += line.value;
			}

			code_sum[line.code] = code_sum_array;
			prev_telno = line.telno;
		}

		result.free();

		if (prev_telno !== "") //処理すべき電話が１つでもあれば
			//codeごとの集計をまとめて登録する
			{
				if (!this.telSumInsert(prev_telno, code_sum, code_total)) return false;
				if (!this.telRatioBasic(prev_telno, code_sum)) return false;
				if (!this.telRatioTuwaDocomo(prev_telno, code_sum)) return false;
			}

		return true;
	}

	telSumInsert(telno, code_sum, code_total) {
		for (var code in code_sum) {
			var code_sum_array = code_sum[code];

			for (var key in code_sum_array) //「その他」は請求金額から差し引いて求める
			{
				var value = code_sum_array[key];

				if (code === "predata_other" && code_total != 0) //請求金額==0 は除外、DoCoMoのための暫定処置
					//print "DEBUG: telno=". $telno ."\n";
					//請求金額合計をセット
					//print "DEBUG: 請求合計=". $code_total ."\n";
					//その他以外の金額を全て引く
					{
						var value = code_total;

						for (var code1 in code_sum) {
							var code_sum_array1 = code_sum[code1];

							for (var key1 in code_sum_array1) {
								var value1 = code_sum_array1[key1];

								if (code1 !== "predata_other") //print "DEBUG: 差し引き(code:". $code1 .",key:". $key1 .")=". $value1 ."\n";
									{
										value -= value1;
									}
							}
						}
					}

				if (key === "") {
					var key = 0;
				}

				var inline = {
					telno: telno,
					code: code,
					key: key,
					value: value
				};
				if (!this.m_inserter.insert(inline)) return false;
			}
		}

		return true;
	}

	telRatioBasic(telno, code_sum) //基本料合計を得る
	//基本料割引を得る
	//0割に注意
	{
		if (!(undefined !== code_sum.predata_basic)) {
			var basic_sum = 0;
		} else {
			var code_sum_array = code_sum.predata_basic;
			basic_sum = 0;

			for (var key in code_sum_array) {
				var value = code_sum_array[key];
				basic_sum += value;
			}
		}

		if (!(undefined !== code_sum.predata_disbasic)) {
			var disbasic_sum = 0;
		} else {
			code_sum_array = code_sum.predata_disbasic;
			disbasic_sum = 0;

			for (var key in code_sum_array) {
				var value = code_sum_array[key];
				disbasic_sum += value;
			}
		}

		if (basic_sum != 0) //disbasic_sum はマイナス値、value はプラス値
			{
				var value = -+(disbasic_sum * 100 / basic_sum);
			} else {
			value = 0;
		}

		var inline = {
			telno: telno,
			code: "predata_disratiobasic",
			key: "200",
			value: value
		};
		if (!this.m_inserter.insert(inline)) return false;
		return true;
	}

	telRatioTuwaAu(telno, code_sum) // 2009/10/01 通話料割引率は固定で０にした * by T.Naka ****
	//		// 通話料合計を得る
	//		if( ! isset( $code_sum["predata_talk"] ))
	//		{	$talkcom_sum = 0;
	//		}
	//		else{
	//			$code_sum_array = $code_sum["predata_talk"];
	//			$talkcom_sum = 0;
	//			foreach( $code_sum_array as $key => $value ){
	//				$talkcom_sum += $value;
	//			}
	//		}
	//		// 通話料割引を得る
	//		if( ! isset( $code_sum["predata_distalk"] ))
	//		{	$distalkcom_sum = 0;
	//		}
	//		else{
	//			$code_sum_array = $code_sum["predata_distalk"];
	//			$distalkcom_sum = 0;
	//			foreach( $code_sum_array as $key => $value ){
	//				$distalkcom_sum += $value;
	//			}
	//		}
	//		
	//		// 0割に注意
	//		if( $talkcom_sum != 0 ){
	//			// distalkcom_sum はマイナス値、value はプラス値
	//			$value = -(int)($distalkcom_sum * 100 / $talkcom_sum);
	//		}
	//		else{
	//			$value = 0;
	//		}
	// 2009/10/01 通話料割引率は固定で０にした ***
	{
		var value = 0;
		var inline = {
			telno: telno,
			code: "predata_disratiotalk",
			key: "210",
			value: value
		};
		if (!this.m_inserter.insert(inline)) return false;
		return true;
	}

	telRatioTuwaDocomo(telno, code_sum) // 2009/10/01 通話料割引率は固定で０にした * by T.Naka ****
	//		// 通話料合計を得る
	//		if( ! isset( $code_sum["predata_talk"] ))
	//		{	$talk_sum = 0;
	//		}
	//		else{
	//			$code_sum_array = $code_sum["predata_talk"];
	//			$talk_sum = 0;
	//			foreach( $code_sum_array as $key => $value ){
	//				$talk_sum += $value;
	//			}
	//		}
	//		// 通話料割引を得る
	//		if( ! isset( $code_sum["predata_distalk"] ))
	//		{	$distalk_sum = 0;
	//		}
	//		else{
	//			$code_sum_array = $code_sum["predata_distalk"];
	//			$distalk_sum = 0;
	//			foreach( $code_sum_array as $key => $value ){
	//				$distalk_sum += $value;
	//			}
	//		}
	//		
	//		// 通信料合計を得る
	//		if( ! isset( $code_sum["predata_com"] ))
	//		{	$com_sum = 0;
	//		}
	//		else{
	//			$code_sum_array = $code_sum["predata_com"];
	//			$com_sum = 0;
	//			foreach( $code_sum_array as $key => $value ){
	//				$com_sum += $value;
	//			}
	//		}
	//		// 通信料割引を得る
	//		if( ! isset( $code_sum["predata_discom"] ))
	//		{	$discom_sum = 0;
	//		}
	//		else{
	//			$code_sum_array = $code_sum["predata_discom"];
	//			$discom_sum = 0;
	//			foreach( $code_sum_array as $key => $value ){
	//				$discom_sum += $value;
	//			}
	//		}
	//		
	//		$talkcom_sum = $talk_sum + $com_sum;
	//		$distalkcom_sum = $distalk_sum + $discom_sum;
	//		// 0割に注意
	//		if( $talkcom_sum != 0 ){
	//			// distalkcom_sum はマイナス値、value はプラス値
	//			$value = -(int)($distalkcom_sum * 100 / $talkcom_sum);
	//		}
	//		else{
	//			$value = 0;
	//		}
	// 2009/10/01 通話料割引率は固定で０にした  ***
	{
		var value = 0;
		var inline = {
			telno: telno,
			code: "predata_disratiotalk",
			key: "210",
			value: value
		};
		if (!this.m_inserter.insert(inline)) return false;
		return true;
	}

	getSQLWhereTelno(table_name, key, A_telno, A_skip, table_no, pactid, carid) //sim_trend_X_tbから、請求情報手入力済の電話番号を除外する
	{
		var sql = "";
		var A_src = [[A_telno, ""], [A_skip, "not"]];

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

		sql += " and " + table_name;
		if (table_name.length) sql += ".";
		sql += key;
		sql += " not in (";
		sql += " select telno from tel_" + table_no + "_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + carid;
		sql += " and hand_detail_flg=true";
		sql += " group by telno";
		sql += " )";
		return sql;
	}

};