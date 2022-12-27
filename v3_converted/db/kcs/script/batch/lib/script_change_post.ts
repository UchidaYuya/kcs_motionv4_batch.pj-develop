//===========================================================================
//機能：change_post_tbから按分情報を取得する
//
//作成：森原
//===========================================================================
//require_once("script_db.php");
//require_once("script_common.php");
//---------------------------------------------------------------------------
//機能：change_post_tbから按分情報を取得する

//処理中の顧客ID
//按分停止フラグ
//複数回按分フラグ
//処理中のキャリアID
//処理中の年
//処理中の月
//そのキャリアでの、電話番号から按分情報へのハッシュ
//按分情報は、以下の内容からなるハッシュ
//delete => 削除日(無い事もある)
//move => 移動情報の配列
//移動情報は、以下の内容からなるハッシュ
//date => 移動日
//from => 元の部署ID
//to => 移動先の部署ID
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：顧客IDで初期化する
//機能：按分情報を読み出す
//引数：キャリアID(空文字列なら全キャリア)
//年
//月
//返値：深刻なエラーが発生したらfalseを返す
//機能：按分情報を取り出す
//引数：電話番号
//その電話の所属部署(tel_X_tbから読み出した値)
//その電話の契約日(tel_X_tbから読み出した値)
//結果を返す
//その電話の存在した秒数を返す
//返値：深刻なエラーが発生したらfalseを返す
//備考：結果は、部署IDから比率へのハッシュ
//-----------------------------------------------------------------------
//以下protected
//機能：電話削除・移動を読み出す
//備考：このメソッドが作る電話移動情報では、
//同一部署間での電話移動があった場合、
//それらの二つの部署に所属したとの情報を一つにまとめない。
//返値：深刻なエラーが発生したらfalseを返す
class ChangePostInfo extends ScriptDBAdaptor {
	ChangePostInfo(listener, db, table_no) {
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_stop_mt = false;
		this.m_multi_mt = false;
	}

	init(pactid) //按分しないフラグを読み出す
	{
		this.m_pactid = pactid;
		this.m_H_change = Array();
		this.m_stop_mt = false;
		var sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_FNCID_STOP_MT);
		sql += ";";
		var result = this.m_db.getAll(sql);

		if (result.length && result[0].length && 0 < result[0][0]) {
			this.putError(G_SCRIPT_INFO, `按分機能使用せず(${pactid})`);
			this.m_stop_mt = true;
		}

		this.m_multi_mt = false;
		sql = "select count(*) from fnc_relation_tb";
		sql += " where pactid=" + this.escape(pactid);
		sql += " and fncid=" + this.escape(G_FNCID_MULTI_MT);
		sql += ";";
		result = this.m_db.getAll(sql);

		if (result.length && result[0].length && 0 < result[0][0]) {
			if (this.m_stop_mt) {
				this.putError(G_SCRIPT_INFO, `複数按分と複数停止フラグが重複している(${pactid})按分停止`);
			} else {
				this.putError(G_SCRIPT_INFO, `複数按分(${pactid})`);
				this.m_multi_mt = true;
			}
		}

		return true;
	}

	read(carid, year, month) //按分しない場合はここで処理終了
	{
		if (0 == this.m_pactid.length) {
			this.putError(G_SCRIPT_WARNING, "\u5185\u90E8\u30A8\u30E9\u30FC(\u9867\u5BA2ID\u672A\u8A2D\u5B9A)");
			return false;
		}

		this.m_carid = carid;
		this.m_year = year;
		this.m_month = month;
		this.m_H_change = Array();
		if (this.m_stop_mt) return true;
		if (!this.getChange()) return false;
		return true;
	}

	get(telno, telnopostid, contract, H_ratio, seconds) //正しくない値
	//按分情報は前月である
	//この電話の按分情報が無ければ処理終了
	//部署移動情報が無ければ処理終了
	//日数がゼロなら処理終了
	{
		H_ratio = {
			[telnopostid]: 1
		};
		seconds = 0;
		var year1 = this.m_year;
		var month1 = this.m_month;
		--month1;

		if (0 == month1) {
			month1 = 12;
			--year1;
		}

		if (month1 < 10) month1 = "0" + month1;
		var year2 = this.m_year;
		var month2 = this.m_month;
		if (month2 < 10) month2 = "0" + month2;
		var begin = `${year1}-${month1}-01 00:00:00+09`;

		if (contract.length) {
			if (`${year1}-${month1}-01 00:00:00+09` <= contract && contract < `${year2}-${month2}-01 00:00:00+09`) {
				begin = contract;
			}
		}

		var end = `${year2}-${month2}-01 00:00:00+09`;
		if (undefined !== this.m_H_change[telno].delete) end = this.m_H_change[telno].delete;

		if (strtotime(end) < strtotime(begin)) {
			this.putOperator(G_SCRIPT_WARNING, "\u6309\u5206\u958B\u59CB\u65E5\u3088\u308A\u3082\u7D42\u4E86\u65E5\u304C\u5148\u306B\u3042\u308B(" + this.m_pactid + "," + telnopostid + "," + this.m_carid + "," + telno + `,${begin}/${end})`);
			return true;
		}

		seconds = strtotime(end) - strtotime(begin);
		if (!(undefined !== this.m_H_change[telno])) return true;
		var H_change = this.m_H_change[telno];
		if (!(undefined !== H_change.move) || 0 == H_change.move.length) return true;
		var cur = begin;
		var total = (strtotime(end) - strtotime(begin)) / (3600 * 24);
		if (0 == total) return true;
		H_ratio = Array();

		for (var move of Object.values(H_change.move)) {
			var movedate = move.date;
			if (strtotime(movedate) < strtotime(cur)) movedate = cur;
			if (strtotime(end) < strtotime(movedate)) movedate = end;
			var diff = (strtotime(movedate) - strtotime(cur)) / (3600 * 24);
			diff = diff * 1 / total;
			if (0 == diff) continue;
			H_ratio[move.from] = diff;
			cur = movedate;
		}

		diff = (strtotime(end) - strtotime(cur)) / (3600 * 24);
		diff = diff * 1 / total;
		if (0 != diff) H_ratio[telnopostid] = diff;
		var A_postid = Array();

		for (var key in H_ratio) {
			var value = H_ratio[key];
			if (!(-1 !== A_postid.indexOf(key))) A_postid.push(key);
		}

		var temp = Array();

		for (var postid of Object.values(A_postid)) {
			diff = 0;

			for (var key in H_ratio) {
				var value = H_ratio[key];
				if (postid == key) diff += value;
			}

			temp[postid] = diff;
		}

		H_ratio = temp;
		if (0 == H_ratio.length) H_ratio[telnopostid] = 1;
		return true;
	}

	getChange() //按分情報は前月
	{
		var year = this.m_year;
		var month = this.m_month;
		this.m_H_change = Array();
		var table_no = this.getTableNo(year, month);
		--month;

		if (0 == month) {
			month = 12;
			--year;
		}

		var sql = "select telno,postid,postidaft,status";
		sql += ",to_char(date,'yyyy-mm-dd') as date";
		sql += " from change_post_tb";
		sql += " where pactid=" + this.escape(this.m_pactid);
		if (this.m_carid.length) sql += " and carid=" + this.escape(this.m_carid);
		sql += " and (status='MT' or status='DT')";
		sql += " and date>='" + year + "-" + month + "-1'";
		var year2 = year;
		var month2 = month;
		++month2;

		if (13 == month2) {
			month2 = 1;
			++year2;
		}

		sql += " and date<'" + year2 + "-" + month2 + "-1'";
		if (this.m_multi_mt) sql += " order by telno,date,fixdate";else sql += " order by telno,fixdate,date";
		sql += ";";
		var result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			var telno = line.telno;
			if (!(undefined !== this.m_H_change[telno])) this.m_H_change[telno] = Array();
			var date = line.date;

			if (0 == strcmp("MT", line.status)) {
				var param = {
					date: date,
					from: line.postid,
					to: line.postidaft
				};

				if (!(undefined !== this.m_H_change[telno].move)) {
					this.m_H_change[telno].move = [param];
				} else {
					if (this.m_multi_mt) //複数按分
						{
							this.m_H_change[telno].move.push(param);
						} else //単一按分
						{
							var old_param = this.m_H_change[telno].move[0];
							param.from = old_param.from;
							this.m_H_change[telno].move[0] = param;
						}
				}
			} else {
				this.m_H_change[telno].delete = date;
			}
		}

		return true;
	}

};