//===========================================================================
//機能：現行のプラン・パケットパック・回線種別・地域会社を予測する
//
//作成：森原
//===========================================================================
//警告フラグを落とすオーダ種別
//---------------------------------------------------------------------------
//機能：料金プラン警告・パケットパック警告の処理型を生成する
//引数：エラー処理型
//データベース
//テーブル番号計算型
//---------------------------------------------------------------------------
//機能：料金プラン警告・パケットパック警告をたてる
//この型はマスター類の管理を行い、実際の検査は検査型が行う。
//この型のインスタンスは、CreateUpdateAlert関数を使って生成する

require("lib/script_db.php");

require("lib/script_common.php");

const ORDER_TYPE = "B,C,N,Nmnp,P,Ppl,S";

function CreateUpdateAlert(listener, db, table_no) {
	var alert = new UpdateAlert(listener, db, table_no);
	alert.m_checker_def = new CheckAlertBase(listener, db, table_no, G_CARRIER_UNKNOWN);
	var sql = "select carid from carrier_tb;";
	var result = db.getAll(sql);

	for (var line of Object.values(result)) {
		var carid = line[0];

		switch (carid) {
			case G_CARRIER_DOCOMO:
				alert.m_checker[carid] = new CheckAlertDocomo(listener, db, table_no);
				break;

			case G_CARRIER_AU:
				alert.m_checker[carid] = new CheckAlertAU(listener, db, table_no);
				break;

			default:
				alert.m_checker[carid] = new CheckAlertBase(listener, db, table_no, carid);
				break;
		}
	}

	return alert;
};

//プランマスター(プランIDから情報配列への変換表)
//情報配列は{基本料,地域会社,回線種別}
//パケットマスター(パケットIDから情報配列への変換表)
//情報配列は{定額通信料,地域会社,回線種別,is_empty}
//プランが存在するか否かの連想配列
//"carid,cirid"から、個数への配列
//パケットが存在するか否かの連想配列
//"carid,cirid"から、個数への配列
//回線種別マスター(キャリアIDから回線種別ID配列への変換表)
//地域会社マスター(キャリアIDから地域会社ID配列への変換表)
//キャリアIDから検査型への変換表
//デフォルトの検査型
//現在処理中の(顧客ID,キャリアID)
//(finishing_f,planalert,packetalert) -> {telno}*への変換表
//機能：コンストラクタ
//備考：この段階では、検査型インスタンスが入っていない
//このコンストラクタは直接呼び出さない事
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：tel_tbの警告フラグを設定する
//引数：処理する顧客ID配列(空なら全顧客対象)
//処理するキャリアID配列(空なら全キャリア対象)
//処理する年
//処理する月
//保存先ファイル名(空文字列ならファイル保存せず)
//返値：成功したらtrueを返す
//機能：電話番号一個の警告フラグを処理する
//引数：{pactid,carid,telno,検索キー}
//tel_details_X_tbからフェッチした値(FetchAdaptor型のオブジェクト)
//プラン・パケットがずれたもののリスト(FetchAdaptor型)
//前月にオーダがあったもの(FetchAdaptor型)
//返値：深刻なエラーが発生したらfalseを返す
//機能：バッファを出力する
//引数：出力するキー(空文字列ならすべて)
//返値：深刻なエラーが発生したらfalseを返す
//機能：SQL文のWHERE節を作る
//備考：protected
//引数：処理するキャリアID配列(空なら全キャリア対象)
//処理する顧客ID配列(空なら全顧客対象)
//当月に契約した電話を除外するならtrue
//テーブル名
//契約日チェックの年
//契約日チェックの月
class UpdateAlert extends ScriptDBAdaptor {
	UpdateAlert(listener, db, table_no) //プランマスター
	//プラン第二基本料をプランマスターに追加する
	//プランとパケットの連係情報を読み出す
	//パケットマスター
	//パケット第二定額使用料をパケットマスターに追加する
	//プラン個数マスター
	//パケット個数マスター
	//回線種別
	//地域会社
	//電話番号先頭六桁は総務省データの消滅に伴い削除した
	{
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_plan = Array();
		var sql = "select planid,basic,arid,cirid";
		sql += ",(case when is_data then 1 else 0 end) as is_empty";
		sql += ",(case when viewflg then 1 else 0 end) as viewflg";
		sql += " from plan_tb";
		sql += ";";
		var result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			var info = {
				charge: [line[1]],
				arid: line[2],
				cirid: line[3],
				is_data: line[4],
				viewflg: line[5],
				rel_packet: Array()
			};
			this.m_plan[line[0]] = info;
		}

		sql = "select planid,basic from plan_basic_tb;";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			var planid = line[0];
			var basic = line[1];
			if (!(undefined !== this.m_plan[planid])) continue;
			this.m_plan[planid].charge.push(basic);
		}

		sql = "select planid,packetid from plan_rel_packet_tb;";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			planid = line[0];
			var packetid = line[1];
			if (undefined !== this.m_plan[planid] && !(-1 !== this.m_plan[planid].rel_packet.indexOf(packetid))) this.m_plan[planid].rel_packet.push(packetid);
		}

		this.m_packet = Array();
		sql = "select packetid,fixcharge,arid,cirid";
		sql += ",(case when is_empty then 1 else 0 end) as is_empty";
		sql += ",(case when viewflg then 1 else 0 end) as viewflg";
		sql += " from packet_tb";
		sql += ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			info = {
				charge: [line[1]],
				arid: line[2],
				cirid: line[3],
				is_empty: line[4],
				viewflg: line[5]
			};
			this.m_packet[line[0]] = info;
		}

		sql = "select packetid,fixcharge from packet_basic_tb;";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			packetid = line[0];
			var fix = line[1];
			if (!(undefined !== this.m_packet[packetid])) continue;
			this.m_packet[packetid].charge.push(fix);
		}

		this.m_plan_count = Array();
		sql = "select carid,cirid,count(*) as count";
		sql += " from plan_tb";
		sql += " group by carid,cirid";
		sql += ";";
		result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			var key = line.carid + "," + line.cirid;
			this.m_plan_count[key] = line.count;
		}

		this.m_packet_count = Array();
		sql = "select carid,cirid,count(*) as count";
		sql += " from packet_tb";
		sql += " group by carid,cirid";
		sql += ";";
		result = this.m_db.getHash(sql);

		for (var line of Object.values(result)) {
			key = line.carid + "," + line.cirid;
			this.m_packet_count[key] = line.count;
		}

		this.m_circuit = Array();
		sql = "select carid,cirid";
		sql += " from circuit_tb";
		sql += ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			if (!(undefined !== this.m_circuit[line[0]])) this.m_circuit[line[0]] = Array();
			this.m_circuit[line[0]].push(line[1]);
		}

		this.m_area = Array();
		sql = "select carid,arid";
		sql += " from area_tb";
		sql += ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			if (!(undefined !== this.m_area[line[0]])) this.m_area[line[0]] = Array();
			this.m_area[line[0]].push(line[1]);
		}
	}

	execute(A_pactid, A_carid, year, month, fname) //電話番号のリストを取得
	//明細の読み出し
	//プラン・パケットの変わった電話番号のリストを取り出す
	//前月のオーダーを取り出す
	//前月のオーダーは、前月の1日から当月の14日の23:59:59まで
	//電話に対してループ
	//未出力のバッファがあれば出力する
	{
		var table_no = this.getTableNo(year, month);

		if (fname.length) {
			var sql = "select * from tel_tb";
			sql += this.getSQLWhere(A_carid, A_pactid);
			sql += ";";
			if (!this.m_db.backup(fname, sql)) return false;
		}

		sql = "update tel_tb set finishing_f=false";
		sql += ",planalert='0',packetalert='0'";
		sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
		sql += this.getSQLWhere(A_carid, A_pactid, true, "", year, month);
		sql += ";";
		this.putError(G_SCRIPT_SQL, sql);
		this.m_db.query(sql);
		sql = "select pactid,carid,telno";
		sql += ",(pactid || ',' || carid || ',' || telno) as key";
		sql += ",arid,cirid,planid,packetid";
		sql += " from tel_tb";
		sql += this.getSQLWhere(A_carid, A_pactid);
		sql += " order by key";
		sql += ";";
		var A_telinfo = this.m_db.getHash(sql);
		var O_detail = new FetchAdaptor(this.m_listener, this.m_db, "key");
		sql = "select code,charge";
		sql += ",(pactid || ',' || carid || ',' || telno) as key";
		sql += " from tel_details_" + table_no + "_tb as tel_details_tb";
		sql += this.getSQLWhere(A_carid, A_pactid);
		sql += " order by key";
		sql += ";";
		O_detail.query(sql);
		var lastyear = year;
		var lastmonth = month - 1;

		if (0 == lastmonth) {
			lastmonth = 12;
			--lastyear;
		}

		var last_table_no = this.getTableNo(lastyear, lastmonth);
		sql = "select (pactid || ',' || carid || ',' || telno) as key";
		sql += ",planchange,packetchange from (";
		sql += "select newtb.telno as telno";
		sql += ",newtb.pactid as pactid";
		sql += ",newtb.carid as carid";
		sql += ",oldtb.telno as oldtelno";
		sql += ",(case when newtb.planid!=oldtb.planid then 1";
		sql += " when newtb.planid is null" + " and oldtb.planid is not null then 1";
		sql += " when newtb.planid is not null" + " and oldtb.planid is null then 1";
		sql += " else 0 end) as planchange";
		sql += ",(case when newtb.packetid!=oldtb.packetid then 1";
		sql += " when newtb.packetid is null" + " and oldtb.packetid is not null then 1";
		sql += " when newtb.packetid is not null" + " and oldtb.packetid is null then 1";
		sql += " else 0 end) as packetchange";
		sql += " from tel_" + table_no + "_tb as newtb";
		sql += " left join tel_" + last_table_no + "_tb as oldtb";
		sql += " on newtb.pactid=oldtb.pactid";
		sql += " and newtb.carid=oldtb.carid";
		sql += " and newtb.telno=oldtb.telno";
		sql += this.getSQLWhere(A_carid, A_pactid, false, "newtb");
		sql += " ) as subtb";
		sql += " where (planchange=1 or packetchange=1)";
		sql += " and length(oldtelno)>1";
		sql += " order by key";
		var O_sup = new FetchAdaptor(this.m_listener, this.m_db, "key");
		O_sup.query(sql);
		sql = "select (p.pactid || ',' || p.carid || ',' || d.telno) as key";
		sql += " from mt_order_tb as p";
		sql += " left join mt_order_teldetail_tb as d";
		sql += " on p.orderid=d.orderid";
		sql += " where p.status>=130";
		sql += " and p.ordertype in (";
		var A_ordertype = ORDER_TYPE.split(",");
		var comma = false;

		for (var type of Object.values(A_ordertype)) {
			if (comma) sql += ",";
			comma = true;
			sql += "'" + this.escape(type) + "'";
		}

		sql += ")";
		sql += " and p.fixdate>='" + lastyear + "/" + lastmonth + "/01'";
		sql += " and p.fixdate<'" + year + "/" + month + "/15'";

		if (A_pactid.length) {
			sql += " and p.pactid in (";
			comma = false;

			for (var pactid of Object.values(A_pactid)) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(pactid);
			}

			sql += ")";
		}

		if (A_carid.length) {
			sql += " and p.carid in (";
			comma = false;

			for (var carid of Object.values(A_carid)) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(carid);
			}

			sql += ")";
		}

		sql += " and d.telno is not null";
		sql += " order by key";
		sql += ";";
		var A_mt_order_type = this.m_db.getHash(sql);
		var O_order = new FetchAdaptor(this.m_listener, this.m_db, "key");
		O_order.query(sql);
		var status = true;
		this.m_cur_key = "";
		this.m_A_cur = Array();

		for (var telinfo of Object.values(A_telinfo)) {
			if (!this.updateTelno(telinfo, O_detail, O_sup, O_order)) {
				status = false;
				break;
			}
		}

		if (this.m_cur_key.length && this.m_A_cur.length) status &= this.flushUpdate("");
		this.m_cur_key = "";
		this.m_A_cur = Array();
		O_order.free();
		O_sup.free();
		O_detail.free();
		return status;
	}

	updateTelno(telinfo, O_detail, O_sup, O_order) {
		var line;
		var A_detail = Array();

		while (line = O_detail.fetch(telinfo.key)) A_detail.push(line);

		var checker = this.m_checker_def;
		if (undefined !== this.m_checker[telinfo.carid]) checker = this.m_checker[telinfo.carid];
		var planalert = false;
		var packetalert = false;
		var sup_plan = false;
		var sup_packet = false;
		if (!checker.check(planalert, packetalert, this, telinfo, A_detail)) return false;
		var is_plan_change = false;
		var is_packet_change = false;
		var is_order = false;

		if (line = O_sup.fetch(telinfo.key)) {
			if (line.planchange) is_plan_change = true;
			if (line.packetchange) is_packet_change = true;
		}

		if (line = O_order.fetch(telinfo.key)) {
			is_order = true;
		}

		if (planalert) {
			if (is_order) {
				this.putError(G_SCRIPT_INFO, "\u30AA\u30FC\u30C0\u304C\u3042\u3063\u305F\u306E\u3067\u30D7\u30E9\u30F3\u8B66\u544A\u3092\u5F31\u306B" + `(${telinfo.carid},${telinfo.telno})`);
				sup_plan = true;
			}
		}

		if (packetalert) {
			if (is_order) {
				this.putError(G_SCRIPT_INFO, "\u30AA\u30FC\u30C0\u304C\u3042\u3063\u305F\u306E\u3067\u30D1\u30B1\u30C3\u30C8\u8B66\u544A\u3092\u5F31\u306B" + `(${telinfo.carid},${telinfo.telno})`);
				sup_packet = true;
			}
		}

		var finishing_f = 0 < A_detail.length;
		if (!finishing_f) return true;
		var key = telinfo.pactid + "," + telinfo.carid;

		if (this.m_cur_key.length && this.m_A_cur.length && strcmp(this.m_cur_key, key)) //顧客ID・電話会社のどちらかが切り替わったので、バッファを出力
			{
				if (!this.flushUpdate("")) return false;
				this.m_cur_key = "";
				this.m_A_cur = Array();
			}

		this.m_cur_key = key;
		planalert = planalert ? sup_plan ? "3" : "1" : "0";
		packetalert = packetalert ? sup_packet ? "3" : "1" : "0";
		key = (finishing_f ? "1" : "0") + "," + planalert + "," + packetalert;
		if (!(undefined !== this.m_A_cur[key])) this.m_A_cur[key] = Array();

		if (100 < this.m_A_cur[key].length) //バッファがある程度たまったら、バッファを出力
			{
				if (!this.flushUpdate(key)) return false;
				this.m_A_cur[key] = Array();
			}

		this.m_A_cur[key].push(telinfo.telno);
		return true;
	}

	flushUpdate(where) {
		{
			let _tmp_0 = this.m_A_cur;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				if (where.length && strcmp(where, key)) continue;
				if (0 == value.length) continue;
				var A = this.m_cur_key.split(",");
				var pactid = A[0];
				var carid = A[1];
				A = key.split(",");
				var finishing_f = A[0].length ? A[0] : "0";
				var planalert = A[1].length ? A[1] : "0";
				var packetalert = A[2].length ? A[2] : "0";
				var sql = "update tel_tb set";
				sql += " planalert='" + planalert + "'";
				sql += ",packetalert='" + packetalert + "'";
				sql += ",finishing_f=" + (finishing_f ? "true" : "false");
				sql += ",fixdate='" + date("Y-m-d H:i:s") + "'";
				sql += " where carid=" + this.escape(carid);
				sql += " and pactid=" + this.escape(pactid);
				sql += " and telno in (";
				var comma = false;

				for (var telno of Object.values(value)) {
					if (comma) sql += ",";
					comma = true;
					sql += "'" + this.escape(telno) + "'";
				}

				sql += ")";
				sql += ";";
				this.putError(G_SCRIPT_SQL, sql);
				this.m_db.query(sql);
			}
		}
		return true;
	}

	getSQLWhere(A_carid, A_pactid, check_contract = false, tablename = "", contract_year = 0, contract_month = 0) {
		var sql = "";
		if (A_carid.length || A_pactid.length) sql += " where";

		if (1 == A_carid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "carid=" + this.escape(A_carid[0]);
		} else if (1 < A_carid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "carid in(";
			var comma = false;

			for (var carid of Object.values(A_carid)) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(carid);
			}

			sql += ")";
		}

		if (A_carid.length && A_pactid.length) {
			sql += " and";
		}

		if (1 == A_pactid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "pactid=" + this.escape(A_pactid[0]);
		} else if (1 < A_pactid.length) {
			sql += " ";
			if (tablename.length) sql += tablename + ".";
			sql += "pactid in(";
			comma = false;

			for (var pactid of Object.values(A_pactid)) {
				if (comma) sql += ",";
				comma = true;
				sql += this.escape(pactid);
			}

			sql += ")";
		}

		if (check_contract) {
			if (A_carid.length || A_pactid.length) sql += " and";
			sql += " ";
			sql += "(";
			if (tablename.length) sql += tablename + ".";
			sql += "contractdate is null or ";
			if (tablename.length) sql += tablename + ".";
			sql += "contractdate<'" + contract_year + "/" + contract_month + "/01'";
			sql += ")";
		}

		return sql;
	}

};

//処理するキャリアID
//基本料を表す内訳コード
//パケット定額使用料を表すコード
//総務省発表データの地域会社を検査するか？
//パケットパックが存在する回線種別
//array(array(基本料, 付加利用料));
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//キャリアID
//機能：検査を行う
//備考：このメソッドをオーバーライドすると、基本チェックをしなくなる
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
//機能：電話情報の検査を行う
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
//機能：電話番号先頭六桁の検査を行う
//引数：警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//返値：深刻なエラーがおきたらfalseを返す
//機能：プランIDの検査を行う
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
//機能：プランIDの検査の内、従来の基本料の検査を行う
//引数：プラン警告が発生したらtrueを返す
//プラン情報
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
//機能：プランIDの検査の内、付加利用料付の基本料の検査を行う
//引数：プラン警告が発生したらtrueを返す
//プラン情報
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//基本料と付加利用料のペアがあればtrueを返す
//返値：深刻なエラーがおきたらfalseを返す
//機能：パケットIDの検査を行う
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
//機能：派生型で、追加の検査を行う
//備考：派生型では、arid,ciridがその他でない事を確認する事
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
//機能：パケットパックがある回線種別を配列で返す
//備考：できるだけ全キャリアに対処する
//機能：請求明細中の基本料のコードを配列で返す
//機能：請求明細中のパケット定額通信料のコードを配列で返す
class CheckAlertBase extends ScriptDBAdaptor {
	CheckAlertBase(listener, db, table_no, carid) //基本料を読み出す
	//パケットパックが存在する回線種別
	//基本料と付加利用料
	{
		this.ScriptDBAdaptor(listener, db, table_no);
		this.m_carid = carid;
		this.m_A_basic = Array();

		if (G_CARRIER_UNKNOWN != carid) {
			var sql = "select code from utiwake_tb" + " where carid=" + carid + " and simkamoku in ('100')" + " and coalesce(codetype,'')='0'" + ";";
			var result = this.m_db.getAll(sql);

			for (var line of Object.values(result)) this.m_A_basic.push(line[0]);
		}

		this.m_A_fix = Array();

		if (G_CARRIER_UNKNOWN != carid) {
			sql = "select code from utiwake_tb" + " where carid=" + carid + " and simkamoku in ('172')" + " and coalesce(codetype,'')='0'" + ";";
			result = this.m_db.getAll(sql);

			for (var line of Object.values(result)) this.m_A_fix.push(line[0]);
		}

		this.m_check_soumu_tel_tb_arid = false;
		this.m_A_cirid_foma = Array();
		sql = "select cirid from packet_tb where carid=" + carid + " group by cirid;";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) this.m_A_cirid_foma.push(line[0]);

		this.m_A_basic_option = Array();
		sql = "select code_src,code_dst from plan_option_code_tb" + " where carid=" + carid + ";";
		result = this.m_db.getAll(sql);

		for (var line of Object.values(result)) {
			this.m_A_basic_option.push({
				basic: line[0],
				option: line[1]
			});
		}
	}

	check(planalert, packetalert, master, telinfo, A_detail) {
		if (!this.checkTel(planalert, packetalert, master, telinfo, A_detail)) return false;
		if (!this.checkPlan(planalert, packetalert, master, telinfo, A_detail)) return false;
		if (!this.checkPacket(planalert, packetalert, master, telinfo, A_detail)) return false;
		if (!this.checkAdd(planalert, packetalert, master, telinfo, A_detail)) return false;
		return true;
	}

	checkTel(planalert, packetalert, master, telinfo, A_detail) //キャリアが全て・不正・その他の場合はプラン警告
	{
		if (G_CARRIER_ALL == telinfo.carid) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30AD\u30E3\u30EA\u30A2ID\u304C\u5168\u3066" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (G_CARRIER_UNKNOWN == telinfo.carid) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30AD\u30E3\u30EA\u30A2ID\u304C\u4E0D\u660E" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (G_CARRIER_OTHER == telinfo.carid) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30AD\u30E3\u30EA\u30A2ID\u304C\u305D\u306E\u4ED6" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (!this.checkTelno6(planalert, master, telinfo)) return false;
		return true;
	}

	checkTelno6(alert, master, telinfo) //総務省データの消滅に伴い、チェックを行わなくなった
	{
		return true;
	}

	checkPlan(planalert, packetalert, master, telinfo, A_detail) //プラン情報
	//プランIDと地域会社が食い違う場合も容認するように変更した
	{
		var key = telinfo.carid + "," + telinfo.cirid;

		if (!(undefined !== master.m_plan_count[key]) || 0 == master.m_plan_count[key]) {
			this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3\u30DE\u30B9\u30BF\u30FC\u7121\u3057" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (0 == telinfo.planid.length) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3ID\u672A\u5B9A\u7FA9" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (!(undefined !== master.m_plan[telinfo.planid])) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3ID\u306B\u5408\u81F4\u3059\u308B\u30DE\u30B9\u30BF\u30FC\u304C\u7121\u3044" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		var plan = master.m_plan[telinfo.planid];

		if (plan.cirid != telinfo.cirid) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3ID\u3068\u56DE\u7DDA\u7A2E\u5225\u304C\u98DF\u3044\u9055\u3046" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (!plan.viewflg) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3\u306Eviewflg\u304Cfalse" + `(${telinfo.carid},${telinfo.telno})`);
		}

		var is_basic_option = false;
		if (!this.checkPlanBasicWithOption(planalert, plan, master, telinfo, A_detail, is_basic_option)) return false;

		if (!is_basic_option) {
			if (!this.checkPlanBasic(planalert, plan, master, telinfo, A_detail)) return false;
		}

		return true;
	}

	checkPlanBasic(planalert, plan, master, telinfo, A_detail) //基本料を表すコード
	//合致する基本料があればtrue
	{
		var A_basic = this.getBasic();
		var match = false;

		for (var detail of Object.values(A_detail)) {
			if (!(-1 !== A_basic.indexOf(detail.code))) continue;

			if (-1 !== plan.charge.indexOf(detail.charge)) //合致した
				{
					match = true;
					break;
				}
		}

		if (A_detail.length && A_basic.length && !match) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3ID\u3068\u57FA\u672C\u6599\u304C\u98DF\u3044\u9055\u3046" + `(${telinfo.carid},${telinfo.telno})`);
		}

		return true;
	}

	checkPlanBasicWithOption(planalert, plan, master, telinfo, A_detail, is_basic_option) //基本料と付加利用料のペア
	//合致する基本料があればtrue
	{
		var A_pair = this.m_A_basic_option;
		var match = false;

		for (var H_pair of Object.values(A_pair)) //明細に対してループ(外側/付加利用料)
		{
			var code_basic = H_pair.basic;
			var code_option = H_pair.option;

			for (var gcnt = 0; gcnt < A_detail.length; ++gcnt) //付加利用料でなければ無視
			{
				if (strcmp(code_option, A_detail[gcnt].code)) continue;

				for (var lcnt = 0; lcnt < A_detail.length; ++lcnt) //ペアが存在した
				//基本料が合致するか
				{
					if (gcnt == lcnt) continue;
					if (strcmp(code_basic, A_detail[lcnt].code)) continue;
					is_basic_option = true;
					var charge = A_detail[gcnt].charge + A_detail[lcnt].charge;

					if (-1 !== plan.charge.indexOf(charge)) {
						match = true;
						break;
					}
				}

				if (match) break;
			}

			if (match) break;
		}

		if (is_basic_option) {
			this.putError(G_SCRIPT_DEBUG, "\u57FA\u672C\u6599+\u4ED8\u52A0\u5229\u7528\u6599\u304C\u5B58\u5728\u3057\u305F" + `(${telinfo.carid},${telinfo.telno})`);

			if (!match) {
				planalert = true;
				this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3ID\u3068\u57FA\u672C\u6599+\u4ED8\u52A0\u5229\u7528\u6599\u304C\u98DF\u3044\u9055\u3046" + `(${telinfo.carid},${telinfo.telno})`);
			}
		}

		return true;
	}

	checkPacket(planalert, packetalert, master, telinfo, A_detail) //パケット情報
	//パケットIDと地域会社が食い違う場合も容認するように変更した
	//定額通信料を表すコード
	//合致する基本料があればtrue
	//パケット定額使用料があればtrue
	{
		if (!(-1 !== this.getFoma().indexOf(telinfo.cirid))) //パケットパックが存在しない回線種別である
			//パケットパックが存在し、それがパケットパック無しでなければ
			//パケット警告とする
			{
				if (undefined !== telinfo.packetid && telinfo.packetid.length) {
					if (undefined !== master.m_packet[telinfo.packetid] && master.m_packet[telinfo.packetid].is_empty) //パケットパック無しなので問題なし
						{} else {
						this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u304C" + "\u5B58\u5728\u3057\u306A\u3044\u56DE\u7DDA\u7A2E\u5225\u3060\u304C\u3001\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u304C\u5B58\u5728\u3059\u308B" + `(${telinfo.carid},${telinfo.telno})`);
						packetalert = true;
					}
				}

				return true;
			}

		if (undefined !== telinfo.planid && telinfo.planid.length && undefined !== master.m_plan[telinfo.planid] && master.m_plan[telinfo.planid].is_data) //データ専用プランである
			{
				var is_empty = false;

				if (undefined !== telinfo.packetid && telinfo.packetid.length) {
					if (undefined !== master.m_packet[telinfo.packetid] && master.m_packet[telinfo.packetid].is_empty) is_empty = true;
				} else is_empty = true;

				if (is_empty) //パケットパックが存在しない
					//正常終了とする
					{
						return true;
					} else //パケットパックが存在する
					{
						this.putError(G_SCRIPT_INFO, "\u30C7\u30FC\u30BF\u5C02\u7528\u30D7\u30E9\u30F3\u306A\u306E\u306B" + "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u304C\u5B58\u5728\u3059\u308B" + `(${telinfo.carid},${telinfo.telno})`);
						packetalert = true;
						return true;
					}
			}

		var key = telinfo.carid + "," + telinfo.cirid;

		if (!(undefined !== master.m_packet_count[key]) || 0 == master.m_packet_count[key]) {
			this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8\u30DE\u30B9\u30BF\u30FC\u7121\u3057" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (0 == telinfo.packetid.length) {
			packetalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8ID\u304C\u7121\u3044" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		if (!(undefined !== master.m_packet[telinfo.packetid])) {
			packetalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8ID\u306B\u5408\u81F4\u3059\u308B\u30DE\u30B9\u30BF\u30FC\u304C\u7121\u3044" + `(${telinfo.carid},${telinfo.telno})`);
			return true;
		}

		var packet = master.m_packet[telinfo.packetid];

		if (packet.cirid != telinfo.cirid) {
			packetalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8ID\u3068\u56DE\u7DDA\u7A2E\u5225\u304C\u98DF\u3044\u9055\u3046" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (!packet.viewflg) {
			packetalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8\u306Eviewflg\u304Cfalse" + `(${telinfo.carid},${telinfo.telno})`);
		}

		var A_fix = this.getFix();
		var match = false;
		var is_fix = false;

		for (var detail of Object.values(A_detail)) {
			if (!(-1 !== A_fix.indexOf(detail.code))) continue;
			is_fix = true;

			if (-1 !== packet.charge.indexOf(detail.charge)) //合致した
				{
					match = true;
					break;
				}
		}

		if (A_detail.length && A_fix.length && !match && packet.charge.length && 0 != packet.charge[0]) {
			packetalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8ID\u3068\u30D1\u30B1\u30C3\u30C8\u5B9A\u984D\u901A\u4FE1\u6599\u304C\u98DF\u3044\u9055\u3046" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (is_fix && packet.is_empty) {
			packetalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\u306A\u3057\u3060\u304C\u5B9A\u984D\u901A\u4FE1\u6599\u306E\u8ACB\u6C42\u304C\u3042\u308B" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (undefined !== master.m_plan[telinfo.planid] && Array.isArray(master.m_plan[telinfo.planid].rel_packet) && master.m_plan[telinfo.planid].rel_packet.length && !(-1 !== master.m_plan[telinfo.planid].rel_packet.indexOf(telinfo.packetid))) {
			packetalert = true;
			this.putError(G_SCRIPT_INFO, "\u30D7\u30E9\u30F3\u3068\u30D1\u30B1\u30C3\u30C8\u306E\u9023\u4FC2\u60C5\u5831\u304C\u98DF\u3044\u9055\u3046" + `(${telinfo.carid},${telinfo.telno})`);
		}

		return true;
	}

	checkAdd(planalert, packetalert, master, telinfo, A_detail) {
		return true;
	}

	getFoma() {
		return this.m_A_cirid_foma;
	}

	getBasic() {
		return this.m_A_basic;
	}

	getFix() {
		return this.m_A_fix;
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：派生型で、追加の検査を行う
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
class CheckAlertDocomo extends CheckAlertBase {
	CheckAlertDocomo(listener, db, table_no) {
		this.CheckAlertBase(listener, db, table_no, G_CARRIER_DOCOMO);
	}

	checkAdd(planalert, packetalert, master, telinfo, A_detail) //地域会社がその他でないか
	{
		if (G_AREA_DOCOMO_UNKNOWN == telinfo.arid) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u5730\u57DF\u4F1A\u793E\u304C\u305D\u306E\u4ED6" + `(${telinfo.carid},${telinfo.telno})`);
		}

		if (G_CIRCUIT_DOCOMO_OTHER == telinfo.cirid) {
			planalert = true;
			this.putError(G_SCRIPT_INFO, "\u56DE\u7DDA\u7A2E\u5225\u304C\u305D\u306E\u4ED6" + `(${telinfo.carid},${telinfo.telno})`);
		}

		return true;
	}

};

//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//機能：派生型で、追加の検査を行う
//引数：プラン警告を返す
//パケット警告を返す
//UpdateAlert型
//処理する電話の情報(->carid,pactid,telno,postid,arid,cirid,planid,packetid)
//明細配列(->code,charge)
//返値：深刻なエラーがおきたらfalseを返す
class CheckAlertAU extends CheckAlertBase {
	CheckAlertAU(listener, db, table_no) //パケット定額通信料の内訳を読み出す処理は除去した
	{
		this.CheckAlertBase(listener, db, table_no, G_CARRIER_AU);
	}

	checkAdd(planalert, packetalert, master, telinfo, A_detail) //請求明細による検査は除去した
	//cdmaのパケット定額通信料があれば確実にCDMA
	//winのパケット定額通信料があれば確実にWIN
	{
		return true;
	}

};