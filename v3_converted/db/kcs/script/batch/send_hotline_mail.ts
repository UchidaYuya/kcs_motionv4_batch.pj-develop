//===========================================================================
//機能：ホットラインエラーメール送信プロセス
//
//作成：森原
//===========================================================================
//プロセス解説文字列
//実行可能時間
//顧客毎にクランプ情報を管理する権限
//---------------------------------------------------------------------------
//機能：メール送信を行う
error_reporting(E_ALL);

require("Mail.php");

require("lib/process_base.php");

const G_PROCNAME_SEND_HOTLINE_MAIL = "send_hotline_mail";
const G_OPENTIME_SEND_HOTLINE_MAIL = "0000,2400";
const FNCID_PACT_CLAMP = 205;

//一時DBの接続用
//処理するショップID(空なら全ショップ)
//処理しないショップ
//メールを送信しないならtrue
//BCCへのメールを送信しないならtrue
//機能：コンストラクタ
//引数：エラー処理型
//データベース
//テーブル番号計算型
//一時DBの接続用
//処理するショップID
//処理しないショップID
//メールを送信しないならtrue
//BCCへのメールを送信しないならtrue
//機能：処理が必要なショップIDのリストを返す
//返値：array(
//array(
//"shopid" => ショップID,
//"name" => ショップ名,
//"postcode" => 販売店部門コード
//),
//...
//);
//機能：ショップIDごとにメールを送信する
//引数：顧客ID単位のエラーを追加して返す
//グループ単位のエラーを追加して返す
//getShopAllList()の返値の要素
//返値：深刻なエラーが発生したらfalseを返す
//機能：グループ単位のメールを送信する
//引数：グループ単位のエラー
//返値：深刻なエラーが発生したらfalseを返す
//機能：顧客単位のメールを送信する
//引数：顧客単位のエラー
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：手動入力されたクランプ情報がある顧客IDを配列にして返す
//機能：顧客単位のメールアドレスを取り出す
//引数：顧客ID
//返値：array(顧客ID => array(メールアドレス));
//機能：グループ毎の送信先アドレスを取り出す
//返値：array(グループID => array(送信先アドレス,))
//機能：あるショップの情報を返す
//引数：getShopAllList()の返値の要素
//返値：引数のハッシュに、以下のキーと値を追加して返す
//addr		メールアドレス(配列ではない)
//pact		array(処理が必要な顧客の情報)
//処理が必要な顧客の情報は、以下のハッシュ
//array(
//"pactid" => 顧客ID,
//"pactcode" => pact_rel_shop_tbのpactcode,
//);
//備考：メールアドレスが無ければ、警告を出さずに正常動作する
//機能：ある顧客のエラーリストを取り出す
//引数：顧客ID
//pact_rel_shop_tbのpactcode
//返値：array(
//"pactid" => 顧客ID,
//"postid" => トップの部署ID
//"groupid" => グループID
//"pactcode" => pact_rel_shop_tbのpactcode(無ければ会社名),
//"time_login" => array(ログイン失敗情報),
//"time_prtelno" => array(親番号失敗情報),
//"compname" => 会社名,
//"postname" => 部署名,
//"is_hotline" => ホットライン型顧客ならtrue,
//"memname" => 空文字列,
//);
//備考：取り出しに失敗したら空配列を返す
//機能：shop_member_tbから担当者名を取り出す
//引数：getPactErrorの返値
//ショップID
//返値：shop_member_tbの返値のmemnameを設定して返す
//-----------------------------------------------------------------------
//機能：メールの本文の、全体の見出しを追加する
//引数：本文を受け取り、末尾に追加して返す
//機能：メールの本文の、ショップ毎の見出しを追加する
//引数：本文を受け取り、末尾に追加して返す
//getShopInfoの返値の配列
//機能：一つのエラー情報を、追加する
//引数：本文を受け取り、末尾に追加して返す
//getPactError()の返値
//機能：メールを送信する
//引数：送信内容
//送信先のメールアドレス
//ショップID
//返値：深刻なエラーが発生したらfalseを返す
class FunctionSendHotlineMail extends ScriptDBAdaptor {
	constructor(listener, db, table_no, db_temp, A_shop_in: {} | any[], A_shop_out: {} | any[], stop_mail, stop_bcc) {
		super(listener, db, table_no);
		this.m_db_temp = db_temp;
		this.m_A_shop_in = A_shop_in;
		this.m_A_shop_out = A_shop_out;
		this.m_stop_mail = stop_mail;
		this.m_stop_bcc = stop_bcc;
	}

	getShopAllList() {
		var sql = "select shopid,name,postcode from shop_tb";
		sql += " where 1=1";

		if (this.m_A_shop_in.length) {
			sql += " and shopid in (" + this.m_A_shop_in.join(",") + ")";
		}

		if (this.m_A_shop_out.length) {
			sql += " and shopid not in (" + this.m_A_shop_out.join(",") + ")";
		}

		sql += " order by shopid";
		sql += ";";
		return this.m_db.getHash(sql);
	}

	executeShop(H_pact_body: {} | any[], H_group: {} | any[], H_shop: {} | any[]) //手動入力されたクランプIDのある顧客IDを取り出す
	//ショップの情報を取り出す
	//メールを送信する
	{
		var A_pactid_hand = this.getHandPactid();
		var H_shop_orig = H_shop;
		H_shop = this.getShopInfo(H_shop);

		if (!H_shop.addr.length) {
			this.putError(G_SCRIPT_WARNING, "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u898B\u3064\u304B\u3089\u305A" + H_shop.shopid + ":" + H_shop.name);
			return true;
		}

		var A_body = Array();

		for (var H_pact of Object.values(H_shop.pact)) //顧客のエラーを取り出す
		{
			var H_body = this.getPactError(H_pact.pactid, H_pact.pactcode);
			if (!Array.isArray(H_body) || !H_body.length) continue;
			H_body = this.getMemberName(H_body, H_shop.shopid);

			if (-1 !== A_pactid_hand.indexOf(H_pact.pactid)) //手動入力された顧客なら、顧客単位のエラーに追加する
				{
					if (!(undefined !== H_pact_body[H_pact.pactid])) H_pact_body[H_pact.pactid] = Array();
					H_pact_body[H_pact.pactid].push(H_body);
				} else if (H_body.is_hotline) //ホットラインなら、このショップに追加する
				{
					A_body.push(H_body);
				} else //ホットラインでなければ、グループのエラーとして保存する
				{
					var groupid = H_body.groupid;
					if (!groupid.length) continue;
					if (!(undefined !== H_group[groupid])) H_group[groupid] = Array();
					H_group[groupid].push({
						body: H_body,
						shop: H_shop
					});
				}
		}

		if (!A_body.length) return true;
		var A_msg = Array();
		this.addBodyAllHeader(A_msg);
		this.addBodyShopHeader(A_msg, H_shop);

		for (var H_body of Object.values(A_body)) this.addBodyPactError(A_msg, H_body);

		return this.sendMail(A_msg, H_shop.addr, H_shop.shopid);
	}

	executeGroup(H_group: {} | any[]) //全グループの送信先アドレスを取り出す
	//グループに対してループする
	{
		var H_addr = this.getAdminAddr();

		for (var groupid in H_group) //メールを送信する
		{
			var A_body_shop = H_group[groupid];
			if (!A_body_shop.length) continue;

			if (!(undefined !== H_addr[groupid])) {
				this.putError(G_SCRIPT_WARNING, "\u4EE3\u7406\u5E97\u306E\u7BA1\u7406\u7528\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u898B\u3064\u304B\u3089\u305A" + "/groupid:=" + groupid);
				continue;
			}

			var A_msg = Array();
			this.addBodyAllHeader(A_msg);

			for (var H_body_shop of Object.values(A_body_shop)) {
				var H_body = H_body_shop.body;
				var H_shop = Array();
				if (undefined !== H_body_shop.shop) H_shop = H_body_shop.shop;
				if (H_shop.length) this.addBodyShopHeader(A_msg, H_shop);
				this.addBodyPactError(A_msg, H_body);
			}

			for (var mailaddr of Object.values(H_addr[groupid])) {
				if (!this.sendMail(A_msg, mailaddr, -1)) return false;
			}
		}

		return true;
	}

	executePact(H_pact_body: {} | any[]) //メールアドレスを取り出す
	//顧客に対してループする
	{
		var H_all_addr = this.getPactAddr();

		for (var pactid in H_pact_body) //管理者メールアドレスに対してループする
		{
			var A_body = H_pact_body[pactid];

			if (!(undefined !== H_all_addr[pactid]) || !Array.isArray(H_all_addr[pactid]) || !H_all_addr[pactid].length) {
				this.putError(G_SCRIPT_WARNING, "\u30C9\u30B3\u30E2\u30D7\u30EC\u30DF\u30A2\u30AF\u30E9\u30D6\u306E\u60C5\u5831\u304C\u624B\u52D5\u5165\u529B\u3055\u308C\u3066\u3044\u308B\u304C\u3001" + "\u7BA1\u7406\u8005\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044" + "/pactid:=" + pactid);
				continue;
			}

			var A_msg = Array();
			this.addBodyAllHeader(A_msg);

			for (var H_body of Object.values(A_body)) {
				this.addBodyPactError(A_msg, H_body);
			}

			for (var addr of Object.values(H_all_addr[pactid])) {
				if (!this.sendMail(A_msg, addr, -1)) return false;
			}
		}

		return true;
	}

	getHandPactid() {
		var sql = "select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + ";";
		var result = this.m_db.getAll(sql);
		var A_pactid = Array();

		for (var A_line of Object.values(result)) {
			var pactid = A_line[0];
			if (!pactid.length || !is_numeric(pactid)) continue;
			A_pactid.push(pactid);
		}

		return A_pactid;
	}

	getPactAddr() {
		var sql = "select pactid,mail from user_tb" + " where pactid in (" + "select pactid from fnc_relation_tb" + " where fncid=" + FNCID_PACT_CLAMP + " )" + " and type='SU'" + " and mail is not null" + " order by pactid,userid" + ";";
		var result = this.m_db.getAll(sql);
		var H_addr = Array();

		for (var A_line of Object.values(result)) {
			var pactid = A_line[0];
			var addr = A_line[1];
			if (!addr.length) continue;
			if (!pactid.length || !is_numeric(pactid)) continue;
			if (!(undefined !== H_addr[pactid])) H_addr[pactid] = Array();
			if (!(-1 !== H_addr[pactid].indexOf(addr))) H_addr[pactid].push(addr);
		}

		return H_addr;
	}

	getAdminAddr() {
		var sql = "select shop_tb.groupid as groupid" + ",coalesce(shop_member_tb.mail,'') as mail" + " from shop_tb" + " left join shop_member_tb" + " on shop_tb.memid=shop_member_tb.memid" + " where shop_tb.type='A'" + " and coalesce(shop_member_tb.mail,'')!=''" + " order by shop_tb.groupid" + ";";
		var result = this.m_db.getHash(sql);
		var H_addr = Array();

		for (var H_line of Object.values(result)) {
			var key = H_line.groupid;
			var addr = H_line.mail;
			if (!(undefined !== H_addr[key])) H_addr[key] = Array();
			var is_in = false;

			for (var check of Object.values(H_addr[key])) if (!strcmp(check, addr)) is_in = true;

			if (is_in) continue;
			H_addr[key].push(addr);
		}

		return H_addr;
	}

	getShopInfo(H_shop: {} | any[]) //shop_tb.memid->shop_member_tb.mailのメールアドレスを取り出す
	//2009/02/27 by T.Naka
	//pact_rel_shop_tbから、関係するpactidを取り出す
	{
		var sql = "select mail from shop_tb";
		sql += " left join shop_member_tb";
		sql += " on shop_tb.shopid=shop_member_tb.shopid";
		sql += " and shop_tb.memid=shop_member_tb.memid";
		sql += " and shop_member_tb.type='SU'";
		sql += " where shop_tb.shopid=" + H_shop.shopid;
		sql += ";";
		var result = this.m_db.getAll(sql);
		var mailaddr = "";
		if (result.length) mailaddr = result[0][0];
		H_shop.addr = mailaddr;
		sql = "select shop_relation_tb.pactid,pact_rel_shop_tb.pactcode";
		sql += " from shop_relation_tb";
		sql += " left join pact_rel_shop_tb";
		sql += " on shop_relation_tb.pactid=pact_rel_shop_tb.pactid";
		sql += " and shop_relation_tb.shopid=pact_rel_shop_tb.shopid";
		sql += " and shop_relation_tb.carid=pact_rel_shop_tb.carid";
		sql += " left join post_relation_tb";
		sql += " on shop_relation_tb.pactid=post_relation_tb.pactid";
		sql += " and shop_relation_tb.postid=post_relation_tb.postidparent";
		sql += " where shop_relation_tb.shopid=" + H_shop.shopid;
		sql += " and shop_relation_tb.carid=" + G_CARRIER_DOCOMO;
		sql += " and post_relation_tb.level=0";
		sql += ";";
		var result_pact_rel_shop = this.m_db.getAll(sql);
		H_shop.pact = Array();

		for (var A_pact of Object.values(result_pact_rel_shop)) {
			H_shop.pact.push({
				pactid: A_pact[0],
				pactcode: A_pact[1]
			});
		}

		return H_shop;
	}

	getPactError(pactid, pactcode) //この顧客のDB側のエラーメッセージを取り出して、DBからは消す
	//この顧客のWEB側のエラーメッセージを取り出て、DBからは消す
	//DB・WEB側の両方から、最新のエラーを取り出す
	//顧客会社名
	//顧客部署名
	//トップの部署ID
	//ホットラインならtrue
	{
		var H_error = Array();
		var sql = " from clampdb_error_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += ";";
		var result = this.m_db.getAll("select message,fixdate " + sql);
		this.putError(G_SCRIPT_SQL, "delete " + sql);
		this.m_db.query("delete " + sql);

		for (var line of Object.values(result)) {
			var message = line[0];
			if (!(undefined !== H_error[message])) H_error[message] = Array();
			H_error[message].push(line[1]);
		}

		sql = " from clampweb_error_tb";
		sql += " where pactid=" + pactid;
		sql += " and carid=" + G_CARRIER_DOCOMO;
		sql += " and env=" + G_CLAMP_ENV;
		sql += ";";
		result = this.m_db_temp.getAll("select message,fixdate " + sql);
		this.putError(G_SCRIPT_SQL, "delete " + sql);
		this.m_db_temp.query("delete " + sql);

		for (var line of Object.values(result)) {
			message = line[0];
			if (!(undefined !== H_error[message])) H_error[message] = Array();
			H_error[message].push(line[1]);
		}

		var A_time_login = Array();
		var A_time_prtelno = Array();

		for (var key in H_error) {
			var A_time = H_error[key];
			if (!A_time.length) continue;
			A_time.sort();
			if (!strcmp(key, "login")) A_time_login.push({
				time: A_time
			});
			var pos = strpos(key, "prtelno");

			if (0 === pos) {
				var A_key = key.split("/");
				if (3 == A_key.length) A_time_prtelno.push({
					time: A_time,
					year: A_key[1],
					month: A_key[2]
				});else A_time_prtelno.push({
					time: A_time
				});
			}
		}

		if (0 == A_time_login.length && 0 == A_time_prtelno.length) return Array();
		var compname = "";
		var postname = "";
		var postid = "";
		var is_hotline = false;
		sql = "select pact_tb.userid_ini,pact_tb.compname,post_tb.postname";
		sql += ",post_tb.postid";
		sql += ",case when coalesce(pact_tb.type,'')='H' then 1" + " else 0 end";
		sql += ",pact_tb.groupid";
		sql += " from pact_tb";
		sql += " left join post_tb";
		sql += " on pact_tb.pactid=post_tb.pactid";
		sql += " left join post_relation_tb as rel_tb";
		sql += " on post_tb.pactid=rel_tb.pactid";
		sql += " and post_tb.postid=rel_tb.postidparent";
		sql += " where pact_tb.pactid=" + pactid;
		sql += " and rel_tb.level=0";
		sql += " limit 1";
		sql += ";";
		result = this.m_db.getAll(sql);

		if (result.length) {
			var line = result[0];
			if (!pactcode.length) pactcode = line[0];
			compname = line[1];
			postname = line[2];
			postid = line[3];
			is_hotline = line[4];
			var groupid = line[5];
		}

		if (!postid.length) {
			this.putError(G_SCRIPT_WARNING, "\u30C8\u30C3\u30D7\u306E\u90E8\u7F72\u898B\u3064\u304B\u3089\u305A" + pactid);
			return Array();
		}

		return {
			pactid: pactid,
			postid: postid,
			groupid: groupid,
			pactcode: pactcode,
			time_login: A_time_login,
			time_prtelno: A_time_prtelno,
			compname: compname,
			postname: postname,
			is_hotline: is_hotline,
			memname: ""
		};
	}

	getMemberName(H_body: {} | any[], shopid) {
		if (!H_body.length || !(undefined !== H_body.pactid) || !(undefined !== H_body.postid)) return H_body;
		var sql = "select name from shop_relation_tb";
		sql += " left join shop_member_tb";
		sql += " on shop_member_tb.shopid=shop_relation_tb.shopid";
		sql += " and shop_member_tb.memid=shop_relation_tb.memid";
		sql += " where shop_relation_tb.pactid=" + H_body.pactid;
		sql += " and shop_relation_tb.postid=" + H_body.postid;
		sql += " and shop_relation_tb.shopid=" + shopid;
		sql += " and shop_relation_tb.carid=" + G_CARRIER_DOCOMO;
		sql += " limit 1";
		sql += ";";
		var result = this.m_db.getAll(sql);
		H_body.memname = result[0][0];
		return H_body;
	}

	addBodyAllHeader(A_msg: {} | any[]) {
		A_msg.push("\u30D3\u30B8\u30CD\u30B9\u30D7\u30EC\u30DF\u30A2\u30AF\u30E9\u30D6" + " \u30C7\u30FC\u30BF\u81EA\u52D5\u53D6\u308A\u8FBC\u307F\u51E6\u7406\u306B\u304A\u3044\u3066\u3001");
		A_msg.push("\u4EE5\u4E0B\u306E\u554F\u984C\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002");
		A_msg.push("");
		A_msg.push("NTT DoCoMo \u30D3\u30B8\u30CD\u30B9\u30D7\u30EC\u30DF\u30A2\u30AF\u30E9\u30D6");
		A_msg.push(" (http://www.mydocomo.com/web/houjin/home/index.html)");
	}

	addBodyShopHeader(A_msg: {} | any[], H_shop: {} | any[]) {
		var shopname = "";
		var shoppostcode = "";
		if (undefined !== H_shop.name) shopname = H_shop.name;
		if (undefined !== H_shop.postcode) shoppostcode = H_shop.postcode;
		A_msg.push("");
		A_msg.push("\u8CA9\u58F2\u5E97\u540D\uFF1A" + shopname);
		A_msg.push("\u8CA9\u58F2\u5E97\u90E8\u9580\u30B3\u30FC\u30C9\uFF1A" + shoppostcode);
	}

	addBodyPactError(A_msg: {} | any[], H_body) //ログイン失敗と親番号見つからずで、二回繰り返す
	{
		var H_keys = {
			time_login: "\u30C9\u30B3\u30E2\u30B7\u30E7\u30C3\u30D7\u753B\u9762\u3088\u308A\u3001" + "\u6B63\u3057\u3044ID,\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u76F4\u3057\u3066\u4E0B\u3055\u3044\u3002",
			time_prtelno: "\u5951\u7D04\u89AA\u96FB\u8A71\u756A\u53F7\u306B\u5909\u66F4\u304C\u7121\u3044\u304B\u3054\u78BA\u8A8D\u4E0B\u3055\u3044\u3002"
		};

		for (var key in H_keys) //該当するエラーがなければ何もしない
		//問題の起きた年月(親番号)
		//最後の発生日時
		//見出し
		{
			var msg = H_keys[key];
			if (!H_body[key].length) continue;
			var A_time = H_body[key];
			var A_ym = Array();
			var time = "";

			for (var H_param of Object.values(A_time)) //年月があれば取り出す
			{
				if (undefined !== H_param.year && H_param.month) {
					A_ym.push([H_param.year, H_param.month]);
				}

				if (H_param.time.length) {
					var tm = H_param.time[H_param.time.length - 1];
					if ("" == time) time = tm;else if (time < tm) time = tm;
				}
			}

			A_msg.push("");
			A_msg.push(msg);
			A_msg.push("\u6700\u65B0\u78BA\u8A8D\u6642\u523B\uFF1A" + time);
			A_msg.push("\u9867\u5BA2\u30B3\u30FC\u30C9\uFF1A" + H_body.pactcode);
			A_msg.push("\u9867\u5BA2\u4F1A\u793E\u540D\uFF1A" + H_body.compname);
			A_msg.push("\u9867\u5BA2\u90E8\u7F72\u540D\uFF1A" + H_body.postname);
			A_msg.push("\u62C5\u5F53\u8005\uFF1A" + H_body.memname);

			if (A_ym.length) {
				var msg = "";

				for (var A_info of Object.values(A_ym)) {
					if (msg.length) msg += " ";else msg += "\u554F\u984C\u767A\u751F\u5E74\u6708\uFF1A";
					msg += A_info[0] + "\u5E74";
					msg += A_info[1] + "\u6708";
				}

				A_msg.push(msg);
			}
		}
	}

	sendMail(A_msg: {} | any[], mailaddr, shopid) //try環境ならメールは送信しない
	{
		var A_bcc = G_MAIL_BCC.split(",");
		if (this.m_stop_bcc) A_bcc = Array();
		var subject = "\u30D3\u30B8\u30CD\u30B9\u30D7\u30EC\u30DF\u30A2\u30AF\u30E9\u30D6 \u30C7\u30FC\u30BF\u53D6\u308A\u8FBC\u307F\u30A8\u30E9\u30FC";

		if (this.m_stop_mail) {
			this.putError(G_SCRIPT_INFO, "\u30E1\u30FC\u30EB\u9001\u4FE1\u305B\u305A" + "/to:=" + mailaddr + "/bcc:=" + A_bcc.join(",") + "/subject:=" + subject);
			echo("\u30E1\u30FC\u30EB\u9001\u4FE1\u305B\u305A(\u5185\u5BB9\u306F\u4EE5\u4E0B\u306E\u901A\u308A)\nTo:" + mailaddr + "\n" + "Bcc:" + A_bcc.join("/") + "\n");

			for (var msg of Object.values(A_msg)) echo(msg + "\n");

			return true;
		}

		if (G_IS_TRY) //try環境ではエラーメールは内部用にのみ送信する
			{
				A_msg.push("");
				A_msg.push("TRY\u74B0\u5883\u3067\u3042\u3063\u305F\u306E\u3067\u5916\u90E8\u306B\u306F\u9001\u4FE1\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
				A_msg.push("\u672C\u756A\u74B0\u5883\u3067\u3042\u308C\u3070\u4EE5\u4E0B\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306B\u9001\u4FE1\u3055\u308C\u307E\u3059\u3002");
				A_msg.push(mailaddr);
				mailaddr = G_MAIL_TO;
				A_bcc = Array();
				subject = "(try)" + subject;
			}

		var from = G_MAIL_FROM;
		var O_mail = Mail.factory("smtp", {
			host: G_SMTP_HOST,
			port: G_SMTP_PORT
		});
		var msg = A_msg.join("\n");
		msg = mb_convert_encoding(msg, "JIS", "UTF-8");
		var H_headers = {
			Date: date("r"),
			To: mailaddr,
			From: from
		};
		if (A_bcc.length) H_headers.Bcc = A_bcc.join(",");
		H_headers["Return-Path"] = from;
		H_headers["MIME-Version"] = "1.0";
		H_headers.Subject = mb_encode_mimeheader(subject, "ISO-2022-JP-MS");
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";
		var A_send_to = [mailaddr];

		for (var bcc of Object.values(A_bcc)) A_send_to.push(bcc);

		var rval = O_mail.send(A_send_to, H_headers, msg);

		if (PEAR.isError(rval)) {
			this.putError(G_SCRIPT_WARNING, "\u30E1\u30FC\u30EB\u9001\u4FE1\u3067\u304D\u305A" + mailaddr);
			return false;
		}

		this.putError(G_SCRIPT_INFO, "\u30E1\u30FC\u30EB\u9001\u4FE1\u5B8C\u4E86" + shopid);
		return true;
	}

};

//一時DBの接続用
//処理するショップID(空なら全ショップ)
//処理しないショップ
//メールを送信しないならtrue
//BCCへのメールを送信しないならtrue
//機能：コンストラクタ
//引数：プロセス名(ログ保存フォルダに使用する)
//ログ出力パス(右端はパス区切り文字/実在するフォルダ)
//デフォルトの営業時間
//機能：このプロセスの日本語処理名を返す
//機能：一個のARGVの内容を反映させる
//引数：{key,value,addkey}
//返値：深刻なエラーが発生したらfalseを返す
//機能：usageを表示する
//返値：{コマンドライン,解説}*を返す
//機能：マニュアル時に、問い合わせ条件を表示する
//返値：問い合わせ条件を返す
//機能：DBのセッションを開始する
//返値：深刻なエラーが発生したらfalseを返す
//機能：DBのセッションを終了する
//引数：commitするならtrue
//返値：深刻なエラーが発生したらfalseを返す
//-----------------------------------------------------------------------
//機能：実際の処理を実行する
//返値：深刻なエラーが発生したらfalseを返す
class ProcessSendHotlineMail extends ProcessBase {
	ProcessSendHotlineMail(procname, logpath, opentime) {
		this.ProcessBase(procname, logpath, opentime);

		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) {
			this.m_db_temp = new ScriptDB(this.m_listener, GLOBALS.G_dsn_temp);
		} else this.m_db_temp = this.m_db;

		this.m_args.addSetting({
			s: {
				type: "string"
			},
			S: {
				type: "string"
			},
			x: {
				type: "int"
			},
			X: {
				type: "int"
			}
		});
		this.m_A_shop_in = Array();
		this.m_A_shop_out = Array();
		this.m_stop_mail = false;
		this.m_stop_bcc = false;
	}

	getProcname() {
		return "\u30DB\u30C3\u30C8\u30E9\u30A4\u30F3\u30A8\u30E9\u30FC\u30E1\u30FC\u30EB\u9001\u4FE1\u30D7\u30ED\u30BB\u30B9";
	}

	commitArg(args) {
		if (!ProcessBase.commitArg(args)) return false;

		switch (args.key) {
			case "s":
				this.m_A_shop_in = args.value.split(",");
				break;

			case "S":
				this.m_A_shop_out = args.value.split(",");
				break;

			case "x":
				this.m_stop_mail = args.value;
				break;

			case "X":
				this.m_stop_bcc = args.value;
				break;
		}

		return true;
	}

	getUsage() {
		var rval = ProcessBase.getUsage();
		rval.push(["-s=shop_id[,shop_id ... ]", "\u51E6\u7406\u3059\u308B\u30B7\u30E7\u30C3\u30D7ID(\u3059\u3079\u3066)"]);
		rval.push(["-S=shop_id[,shop_id ... ]", "\u51E6\u7406\u3057\u306A\u3044\u30B7\u30E7\u30C3\u30D7ID(\u3059\u3079\u3066)"]);
		rval.push(["-x={0|1}", "\u30E1\u30FC\u30EB\u9001\u4FE1\u3092\u884C\u308F\u306A\u3044\u306A\u30891(0)"]);
		rval.push(["-X={0|1}", "BCC\u3092\u4ED8\u3051\u306A\u3044\u306A\u30891(0)"]);
		return rval;
	}

	getManual() {
		var rval = ProcessBase.getManual();
		rval += "\u51E6\u7406\u3059\u308B\u30B7\u30E7\u30C3\u30D7ID:";
		if (this.m_A_shop_in.length) rval += this.m_A_shop_in.join(",");else rval += "\u3059\u3079\u3066";
		rval += "\n";
		rval += "\u9664\u5916\u3059\u308B\u30B7\u30E7\u30C3\u30D7ID:";
		if (this.m_A_shop_out.length) rval += this.m_A_shop_out.join(",");else rval += "\u7121\u3057";
		rval += "\n";
		rval += "\u30E1\u30FC\u30EB\u9001\u4FE1" + (this.m_stop_mail ? "\u3057\u306A\u3044" : "\u3059\u308B") + "\n";
		rval += "BCC\u8FFD\u52A0" + (this.m_stop_bcc ? "\u3057\u306A\u3044" : "\u3059\u308B") + "\n";
		return rval;
	}

	beginDB() {
		this.m_db.begin();
		if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.begin();
		return true;
	}

	endDB(status) {
		if (this.m_debugflag) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
			this.putError(G_SCRIPT_INFO, "rollback\u30C7\u30D0\u30C3\u30B0\u30E2\u30FC\u30C9");
		} else if (!status) {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.rollback();
			this.m_db.rollback();
		} else {
			if (strcmp(GLOBALS.G_dsn, GLOBALS.G_dsn_temp)) this.m_db_temp.commit();
			this.m_db.commit();
		}

		return true;
	}

	do_execute() //送信機能インスタンスを作成する
	//ショップのリストを取り出す
	//ショップに対してループする
	//ホットライン型以外の処理を行う
	{
		var O_func = new FunctionSendHotlineMail(this.m_listener, this.m_db, this.m_table_no, this.m_db_temp, this.m_A_shop_in, this.m_A_shop_out, this.m_stop_mail, this.m_stop_bcc);
		var A_shop = O_func.getShopAllList();
		var H_group = Array();
		var H_pact_body = Array();

		for (var H_shop of Object.values(A_shop)) {
			if (!this.beginDB()) return false;
			var status = O_func.executeShop(H_pact_body, H_group, H_shop);
			if (!this.endDB(status)) return false;
			if (!status) return false;
		}

		if (!this.beginDB()) return false;
		status = O_func.executeGroup(H_group);

		if (status) {
			status &= O_func.executePact(H_pact_body);
		}

		if (!this.endDB(status)) return false;
		return status;
	}

};

checkClient(G_CLIENT_DB);
var log = G_LOG;
if ("undefined" !== typeof G_LOG_ADMIN_DOCOMO_DB) log = G_LOG_ADMIN_DOCOMO_DB;
var proc = new ProcessSendHotlineMail(G_PROCNAME_SEND_HOTLINE_MAIL, log, G_OPENTIME_SEND_HOTLINE_MAIL);
if (!proc.readArgs(undefined)) throw die(1);
if (!proc.execute()) throw die(1);
throw die(0);