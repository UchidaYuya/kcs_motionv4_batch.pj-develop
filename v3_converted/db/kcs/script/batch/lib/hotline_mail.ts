//===========================================================================
//機能：ホットラインエラーメール送信機能
//
//作成：森原
//===========================================================================
//機能：ホットライン側顧客にエラーメールを送信する
//引数：データベースインスタンス
//顧客ID
//サブジェクト
//エラーメッセージ
//送信先アドレスを返す
//テーブル番号
//返値：深刻なエラーが発生したらfalseを返す

function sendErrorMessageHotLine(O_db, pactid, subject, A_msg, A_to, no) //try環境ではメール送信を止める
//顧客コード
//顧客会社名
//顧客部署名
//pact_tbとpost_tbから顧客会社名などを取り出す
//エラーメール送信先を確定する
//ルート部署を取り出す
{
	if (G_IS_TRY) return true;
	var pactcode = "";
	var compname = "";
	var postname = "";
	var sql = "select pact_tb.userid_ini,pact_tb.compname,post_x_tb.postname";
	sql += " from pact_tb";
	sql += " left join post_" + no + "_tb as post_x_tb";
	sql += " on pact_tb.pactid=post_x_tb.pactid";
	sql += " left join post_relation_" + no + "_tb as rel_x_tb";
	sql += " on post_x_tb.pactid=rel_x_tb.pactid";
	sql += " and post_x_tb.postid=rel_x_tb.postidparent";
	sql += " where pact_tb.pactid=" + pactid;
	sql += " and rel_x_tb.level=0";
	sql += " limit 1";
	sql += ";";
	var result = O_db.getAll(sql);

	if (result.length) //顧客コード
		//顧客会社名
		//顧客部署名
		{
			var line = result[0];
			pactcode = line[0];
			compname = line[1];
			postname = line[2];
		}

	sql = "select pactcode from pact_rel_shop_tb";
	sql += " where pactid=" + pactid;
	sql += " and carid=" + G_CARRIER_DOCOMO;
	sql += ";";
	result = O_db.getAll(sql);
	if (result.length && result[0][0].length) pactcode = result[0][0];
	A_msg.push("");
	A_msg.push("\u9867\u5BA2\u30B3\u30FC\u30C9 : " + pactcode);
	A_msg.push("\u9867\u5BA2\u4F1A\u793E\u540D : " + compname);
	A_msg.push("\u9867\u5BA2\u90E8\u7F72\u540D : " + postname);
	var from = G_MAIL_FROM;
	var A_bcc = G_MAIL_BCC.split(",");
	A_to = Array();
	sql = "select postidparent from post_relation_tb";
	sql += " where pactid=" + pactid;
	sql += " and level=0";
	sql += ";";
	result = O_db.getAll(sql);
	var parent = "";
	if (result.length) parent = result[0][0];
	sql = "select shop_member_tb.mail";
	sql += " from pact_tb";
	sql += " left join shop_relation_tb";
	sql += " on pact_tb.pactid=shop_relation_tb.pactid";
	sql += " left join shop_member_tb";
	sql += " on shop_relation_tb.memid=shop_member_tb.memid";
	sql += " where pact_tb.pactid=" + pactid;
	sql += " and shop_relation_tb.carid=" + G_CARRIER_DOCOMO;
	if (parent.length) sql += " and shop_relation_tb.postid=" + parent;
	sql += " limit 1";
	sql += ";";
	result = O_db.getAll(sql);

	if (result.length && result[0][0].length) {
		var A_addr = result[0][0].split(",");

		for (var addr of Object.values(A_addr)) {
			if (!(-1 !== A_to.indexOf(addr))) A_to.push(addr);
		}
	}

	sql = "select shop_member_tb.mail";
	sql += " from pact_tb";
	sql += " left join shop_relation_tb";
	sql += " on pact_tb.pactid=shop_relation_tb.pactid";
	sql += " left join shop_tb";
	sql += " on shop_relation_tb.shopid=shop_tb.shopid";
	sql += " left join shop_member_tb";
	sql += " on shop_tb.memid=shop_member_tb.memid";
	sql += " where pact_tb.pactid=" + pactid;
	sql += " and shop_relation_tb.carid=" + G_CARRIER_DOCOMO;
	if (parent.length) sql += " and shop_relation_tb.postid=" + parent;
	sql += " limit 1";
	sql += ";";
	result = O_db.getAll(sql);

	if (result.length && result[0][0].length) {
		A_addr = result[0][0].split(",");

		for (var addr of Object.values(A_addr)) {
			if (!(-1 !== A_to.indexOf(addr))) A_to.push(addr);
		}
	}

	if (G_IS_TRY) //try環境ではエラーメールは内部用にのみ送信する
		{
			A_msg.push("");
			A_msg.push("TRY\u74B0\u5883\u3067\u3042\u3063\u305F\u306E\u3067\u5916\u90E8\u306B\u306F\u9001\u4FE1\u3055\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002");
			A_msg.push("\u672C\u756A\u74B0\u5883\u3067\u3042\u308C\u3070\u4EE5\u4E0B\u306E\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306B\u9001\u4FE1\u3055\u308C\u307E\u3059\u3002");

			for (var to of Object.values(A_to)) A_msg.push(to);

			if (0 == A_to.length) A_msg.push("\t\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
			A_to = [G_MAIL_TO];
			A_bcc = Array();
			subject = "(try)" + subject;
		}

	for (var to of Object.values(A_to)) //EUC->utf-8$msg = mb_convert_encoding($msg, "JIS", "EUC-JP");
	{
		if (0 == to.length) continue;
		var O_mail = Mail.factory("smtp", {
			host: G_SMTP_HOST,
			port: G_SMTP_PORT
		});
		var msg = A_msg.join("\n");
		msg = mb_convert_encoding(msg, "JIS", "UTF-8");
		var H_headers = {
			Date: date("r"),
			To: to,
			From: from
		};
		if (A_bcc.length) H_headers.Bcc = A_bcc.join(",");
		H_headers["Return-Path"] = from;
		H_headers["MIME-Version"] = "1.0";
		H_headers.Subject = mb_encode_mimeheader(subject, "ISO-2022-JP-MS");
		H_headers["Content-Type"] = "text/plain; charset=\"ISO-2022-JP\"";
		H_headers["Content-Transfer-Encoding"] = "7bit";
		H_headers["X-Mailer"] = "Motion Mailer v2";
		var A_send_to = [to];

		for (var bcc of Object.values(A_bcc)) A_send_to.push(bcc);

		var rval = O_mail.send(A_send_to, H_headers, msg);
		if (PEAR.isError(rval)) return false;
	}

	return true;
};