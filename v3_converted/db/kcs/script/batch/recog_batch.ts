//===========================================================================
//機能：自動承認バッチ
//
//作成：宮澤
//===========================================================================
//tryはこれが必要
//set_include_path('.:/usr/local/share/pear:/usr/local/share/pear/Smarty:/try_kcs/kcs/conf:/try_kcs/kcs/class:/try_kcs/kcs/INC');
//カレントディレクトリ変更
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//自動承認する発注情報を取得
//ord.accessory,";
//$logh->putError(G_SCRIPT_INFO, $sql);
//一件でもあれば自動承認プロセス作動
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//メール本文作成
//
//[引　数] $mailtype：メールのタイプ
//$H_mailparam：メールに使用するパラメータの配列
//[返り値] $H_mailcontent：題名と本文
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
global[WEB_DIR] = "/nfs/web/kcs";
set_include_path(get_include_path() + ":" + WEB_DIR + "/class:" + WEB_DIR + "/conf");
error_reporting(E_ALL);

require("lib/script_common.php");

chdir(BAT_DIR);

require(BAT_DIR + "/lib/script_db.php");

require(BAT_DIR + "/lib/script_log.php");

require("MailUtil.php");

var A_common = file(WEB_DIR + "/conf/common.php");

for (var ii = 0; ii < A_common.length; ii++) {
	if (preg_match("/define/", A_common[ii]) == true && preg_match("/KCS_DIR/", A_common[ii]) == true) {
		eval(A_common[ii]);
	}
}

var dbLogFile = G_LOG + "/recogbat" + date("Ym") + ".log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var sql = "SELECT \n\tapplyuser.mail AS applymail, \n\tapplyuser.username AS applyname, \n\tapplyuser.acceptmail5 AS applyacceptshop, \n\tord.nextpostid, \n\tord.nextpostname,\n\tord.orderid,\n\tord.pactid,\n\tpact.compname,\n\tord.postid,\n\tpost.postname,\n\tord.carid,\n\t'\uFF08\u81EA\u52D5\u627F\u8A8D\uFF09' AS loginname,\n\tord.type,\n\tord.cirid,\n\tord.model,\n\tord.color,\n\tord.dateto,\n\tord.datefrom,\n\tord.datechange,\n\tord.plan,\n\tord.packet,\n\tord.option,";
sql += "\n\tord.recdate,\n\tord.transfer,\n\tord.note";
sql += " FROM user_tb applyuser, order_tb ord, pact_tb pact, post_tb post, recog_batch_tb bat ";
sql += " WHERE applyuser.userid = ord.chargerid";
sql += " AND pact.pactid = ord.pactid";
sql += " AND post.postid = ord.postid";
sql += " AND ( (ord.pactid = bat.pactid AND bat.recogpostid IS NULL AND bat.orderpostid IS NULL)";
sql += "  OR (ord.pactid = bat.pactid AND ord.nextpostid = bat.recogpostid AND bat.orderpostid IS NULL)";
sql += "  OR (ord.pactid = bat.pactid AND bat.recogpostid IS NULL AND ord.postid = bat.orderpostid) )";
sql += " AND ord.status = 10";
var H_orderinfo = dbh.getHash(sql);
logh.putError(G_SCRIPT_BEGIN, "\u81EA\u52D5\u627F\u8A8D\u51E6\u7406\u958B\u59CB");
logh.putError(G_SCRIPT_INFO, "\u30AB\u30A6\u30F3\u30C8\uFF1A" + H_orderinfo.length + "\u4EF6");

if (H_orderinfo.length > 0) //orderid整形
	//begin
	//order_tbアップデート文作成
	//回答部署
	//回答ユーザ
	//order_tbアップデート実行
	//order_history_tbにインサート
	//commit
	//メール処理
	{
		for (var param of Object.values(H_orderinfo)) {
			A_orderid.push(param.orderid);
		}

		dbh.begin();
		var upd_sql = "UPDATE order_tb ";
		upd_sql += "SET status = 40, ";
		upd_sql += "enddate = now(), ";
		upd_sql += "nextpostid = NULL, ";
		upd_sql += "nextpostname = NULL, ";
		upd_sql += "anspost = NULL, ";
		upd_sql += "ansuser = NULL, ";
		upd_sql += "ansdate = now() ";
		upd_sql += "WHERE orderid IN (" + join(",", A_orderid) + ")";
		dbh.query(upd_sql);

		for (var key in H_orderinfo) //SQL用に整形
		//インサート文作成
		//order_history_tbインサート実行
		{
			var val = H_orderinfo[key];

			if (val.nextpostid != "") {
				var nextpostid = val.nextpostid;
			} else {
				nextpostid = "NULL";
			}

			if (val.nextpostname != "") {
				var nextpostname = "'" + val.nextpostname + "'";
			} else {
				nextpostname = "NULL";
			}

			if (val.applymail != "" && val.applyacceptshop == 1) {
				var applymail = "'" + val.applymail + "'";
			} else {
				applymail = "NULL";
			}

			var hist_sql = "INSERT INTO order_history_tb(" + "orderid," + "chpostid," + "chpostname," + "chname," + "chdate," + "answercomment," + "nextpostid," + "nextpostname," + "status," + "applymail, " + "recogmail) " + "VALUES(" + val.orderid + "," + nextpostid + "," + nextpostname + "," + "'\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u81EA\u52D5\u627F\u8A8D'," + "now()," + "NULL," + "NULL," + "NULL," + "40, " + applymail + "," + "NULL)";
			dbh.query(hist_sql);
			logh.putError(G_SCRIPT_INFO, "orderid=" + val.orderid + "\u3092\u81EA\u52D5\u627F\u8A8D");
		}

		dbh.commit();

		for (var key in H_orderinfo) // 発注（販売店の代表メールアドレスと担当者に飛ぶ）***//
		//メール送信用(tmp)
		//配列の重複を削除する
		//メール送信用
		//販売店側受付メールのfromとして使う
		//送信元
		//空白にしておけば共通メール設定のデフォルトメールアドレスが入る
		//パラメータセット
		//販売店へのメール作成
		//販売店へのメール送信
		//$logh->putError(G_SCRIPT_INFO, "orderid=" . $val["orderid"] . " の受注メールを販売店へ送信");
		// 販売店側受付（最終承認者と申請者に飛ぶ）***//
		//メール送信用
		//メール受け取りフラグが1なら送信リストに入れる
		//承認者には飛ばさない
		//		if ($val["recogmail"] != "" && $val["recogacceptshop"] == 1) {
		//			$H_mail_tmp = array('to_name' => $_SESSION["postname"]. " ". $val["recogname"], 'to' => $val["recogmail"]);
		//			array_push($A_mail_list_forcustomer, $H_mail_tmp);
		//		}
		{
			var val = H_orderinfo[key];
			var mailtype = "order";
			var get_mail_sql = "SELECT " + "mem.name as to_name, mem.mail as to FROM shop_member_tb mem, shop_tb shop, shop_relation_tb rel " + "WHERE shop.shopid=" + "(SELECT rel.shopid WHERE rel.pactid=" + val.pactid + " " + "AND rel.postid=" + val.postid + " " + "AND rel.carid=" + val.carid + ") " + "AND (mem.memid=shop.memid " + "OR mem.memid=" + "(SELECT rel.memid WHERE rel.pactid=" + val.pactid + " " + "AND rel.postid=" + val.postid + " " + "AND rel.carid=" + val.carid + ")) " + "AND mem.mail != '' AND mem.mail IS NOT NULL";
			var H_get_mail = dbh.getHash(get_mail_sql);
			var A_mail_list_tmp = Array();

			for (var i = 0; i < H_get_mail.length; i++) {
				var H_mailto = {
					to_name: strip_tags(H_get_mail[i].to_name),
					to: H_get_mail[i].to
				};
				A_mail_list_tmp.push(serialize(H_mailto));
			}

			var A_mail_list = Array();
			A_mail_list_tmp = array_unique(A_mail_list_tmp);

			for (var ky in A_mail_list_tmp) {
				var vl = A_mail_list_tmp[ky];
				A_mail_list.push(unserialize(vl));
			}

			var get_shop_sql = "SELECT shop.name, shop.postcode, mem.mail " + "FROM shop_tb shop, shop_member_tb mem, shop_relation_tb " + "WHERE shop.memid=mem.memid " + "AND shop.shopid=" + "(SELECT rel.shopid FROM shop_relation_tb rel WHERE rel.pactid=" + val.pactid + " " + "AND rel.postid=" + val.postid + " " + "AND rel.carid=" + val.carid + ")";
			var H_shop = dbh.getHash(get_shop_sql);
			var shopname = H_shop[0].name;
			var shopcode = H_shop[0].postcode;
			var shopmail = H_shop[0].mail;
			var from_name = val.compname + val.postname + val.loginname;
			var from = "";
			var H_mailparam = {
				type: val.type,
				cirid: val.cirid,
				carid: val.carid,
				orderid: val.orderid,
				model: val.model,
				color: val.color,
				dateto: val.dateto,
				datefrom: val.datefrom,
				datechange: val.datechange,
				plan: val.plan,
				packet: val.packet,
				option: val.option,
				shopname: shopname,
				shopcode: shopcode,
				compname: val.compname,
				postname: val.postname,
				recdate: val.recdate,
				transfer: val.transfer,
				note: val.note
			};
			var H_mailcontent = orderMailWrite(mailtype, H_mailparam);
			var O_mail = new MailUtil();
			O_mail.multiSend(A_mail_list, H_mailcontent.message, from, H_mailcontent.subject, from_name);
			var mailtype_forcustomer = "receipt";
			var A_mail_list_forcustomer = Array();

			if (val.applymail != "" && val.applyacceptshop == 1) {
				var H_mail_tmp = {
					to_name: val.applyname,
					to: val.applymail
				};
				A_mail_list_forcustomer.push(H_mail_tmp);
			}

			if (A_mail_list_forcustomer.length > 0) //受付メール作成
				//受付メール送信
				//$logh->putError(G_SCRIPT_INFO, "orderid=" . $val["orderid"] . " の受付メールをお客様に送信");
				{
					var H_mailcontent_forcustomer = orderMailWrite(mailtype_forcustomer, H_mailparam);
					O_mail.multiSend(A_mail_list_forcustomer, H_mailcontent_forcustomer.message, shopmail, H_mailcontent_forcustomer.subject, shopname);
				}
		}
	}

logh.putError(G_SCRIPT_END, "\u81EA\u52D5\u627F\u8A8D\u51E6\u7406\u5B8C\u4E86");

function orderMailWrite(mailtype, H_mailparam) //使用パラメータ
//発注種別
//キャリア
//回線種別
//発注会社名
//登録部署
//$chargername = $H_mailparam["chargername"];
//$address = $H_mailparam["address"];
//販売店名
//発注ID
//$H_accessory = $H_mailparam["accessory"];
//キャリアと回線種別
//不明の場合は空白
//同上
//発注ID桁揃え
//振り分け
//apply		:	申請（次の承認者へ飛ぶ）
//order		:	発注（販売店の代表メールアドレスと担当者に飛ぶ）
//receipt		:	販売店側受付（最終承認者と申請者に飛ぶ）
//complete		:	完了（最終承認者と申請者に飛ぶ）
//applycancell	:	承認中キャンセル（申請元の部署に飛ぶ）
//ordercancell	:	発注中キャンセル（最終承認者と申請者に飛ぶ）
//申請（次の承認者へ飛ぶ）（※ここは使われない）
{
	var err = new ScriptLogFile(G_SCRIPT_ALL, "stdout");
	var db = new ScriptDB(err);
	var type = H_mailparam.type;
	var carid = H_mailparam.carid;
	var cirid = H_mailparam.cirid;
	var compname = H_mailparam.compname;
	var postname = H_mailparam.postname;
	var shopname = H_mailparam.shopname;
	var shopcode = H_mailparam.shopcode;
	var recdate = H_mailparam.recdate;
	var orderid = H_mailparam.orderid;
	var model = H_mailparam.model;
	var color = H_mailparam.color;
	var dateto = H_mailparam.dateto;
	var datefrom = H_mailparam.datefrom;
	var datechange = H_mailparam.datechange;
	var plan = H_mailparam.plan;
	var packet = H_mailparam.packet;
	var H_option = H_mailparam.option;
	var transfer = H_mailparam.transfer;
	var note = H_mailparam.note;
	var carstr = "";
	var cirstr = "";
	var get_car_cir_sql = "SELECT " + "carrier_tb.carname, circuit_tb.cirname FROM carrier_tb,circuit_tb " + "WHERE carrier_tb.carid=" + carid + " " + "AND circuit_tb.cirid=" + cirid;
	var H_car_cir = db.getHash(get_car_cir_sql);

	if (carid == 99) {
		carstr = "";
	} else {
		carstr = H_car_cir[0].carname;
	}

	if (cirid == 0) {
		cirstr = "";
	} else {
		cirstr = H_car_cir[0].cirname;
	}

	var orderidstr = str_pad(orderid, 10, "0", STR_PAD_LEFT);

	if (mailtype == "apply") //発注種別
		//発注（販売店の代表メールアドレスと担当者に飛ぶ）
		{
			var typestr = "";

			switch (type) {
				case "N":
					typestr = "\u65B0\u898F\u767A\u6CE8";
					break;

				case "C":
					typestr = "\u6A5F\u7A2E\u5909\u66F4\uFF0F\u8CB7\u3044\u5897\u3057";
					break;

				case "S":
					typestr = "\u5951\u7D04\u5909\u66F4";
					break;

				case "P":
					typestr = "\u30D7\u30E9\u30F3\u5909\u66F4";
					break;

				case "O":
					typestr = "\u30AA\u30D7\u30B7\u30E7\u30F3\u5909\u66F4";
					break;

				case "D":
					typestr = "\u89E3\u7D04";
					break;

				case "A":
					typestr = "\u4ED8\u5C5E\u54C1";
					break;

				case "T":
					typestr = "\u540D\u7FA9\u5909\u66F4";
					break;

				case "M":
					typestr = "\u305D\u306E\u4ED6";
					break;

				case "BP":
					typestr = "\u4E00\u62EC\u30D7\u30E9\u30F3\u5909\u66F4";
					break;
			}

			var subject = "KCS Motion\uFF1A" + typestr + "\u306E\u7533\u8ACB\uFF08" + postname + "\uFF09";
			var message = "<< KCS Motion : " + typestr + "\u306E\u7533\u8ACB >>\n";
			message += "-------------------------------------------------------------\n";
			message += postname + "\u304B\u3089" + typestr + "\u306E\u7533\u8ACB\u304C\u5C4A\u3044\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
			message += "\n";
			message += "KCS Motion\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
			message += "\n";
			message += "https://www.kcsmotion.jp/\n";
			message += "-------------------------------------------------------------\n";
		} else if (mailtype == "order") //発注種別
		//販売店側受付（最終承認者と申請者に飛ぶ）
		{
			typestr = "";

			switch (type) {
				case "N":
					typestr = "\u65B0\u898F\u306E\u6CE8\u6587";
					break;

				case "C":
					typestr = "\u6A5F\u7A2E\u5909\u66F4\uFF0F\u8CB7\u3044\u5897\u3057\u306E\u4F9D\u983C";
					break;

				case "S":
					typestr = "\u5951\u7D04\u5909\u66F4\u306E\u4F9D\u983C";
					break;

				case "P":
					typestr = "\u30D7\u30E9\u30F3\u5909\u66F4\u306E\u4F9D\u983C";
					break;

				case "O":
					typestr = "\u30AA\u30D7\u30B7\u30E7\u30F3\u5909\u66F4\u306E\u4F9D\u983C";
					break;

				case "D":
					typestr = "\u89E3\u7D04\u306E\u4F9D\u983C";
					break;

				case "A":
					typestr = "\u4ED8\u5C5E\u54C1\u306E\u6CE8\u6587";
					break;

				case "T":
					typestr = "\u540D\u7FA9\u5909\u66F4\u306E\u4F9D\u983C";
					break;

				case "M":
					typestr = "\u305D\u306E\u4ED6\u306E\u4F9D\u983C";
					break;

				case "BP":
					typestr = "\u4E00\u62EC\u30D7\u30E9\u30F3\u5909\u66F4\u306E\u4F9D\u983C";
					break;
			}

			var datetostr = str_replace(" 00:00", "", dateto.substr(0, 16));
			var datefromstr = str_replace(" 00:00", "", datefrom.substr(0, 16));
			var datechangestr = str_replace(" 00:00", "", datechange.substr(0, 16));
			recdate = recdate.substr(0, 16);
			subject = "[" + compname + "]" + orderidstr + "/" + carstr + " " + typestr + "/KCS Motion";
			message = "<< KCS Motion : " + typestr + " >>\n";
			message += "-------------------------------------------------------------\n";
			message += typestr + "\u304C\u5C4A\u3044\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
			message += "-------------------------------------------------------------\n";
			message += "\u4F1A\u793E : " + compname + "\n";
			message += "\u767B\u9332\u90E8\u7F72 : " + postname + "\n";
			message += "\u4F9D\u983C\u65E5 : " + recdate + "\n";
			message += "-------------------------------------------------------------\n";
			message += carstr + " " + typestr + " " + cirstr + "\n";

			switch (type) {
				case "N":
					message += "\u6A5F\u7A2E\uFF1A" + model + "\n";
					message += "\u8272\uFF1A" + color + "\n";

					if (datetostr != "") {
						message += "\u5E0C\u671B\u7D0D\u54C1\u65E5\uFF1A" + datetostr + " \u307E\u3067\n";
					} else {
						message += "\u5E0C\u671B\u7D0D\u54C1\u65E5\uFF1A\u6307\u5B9A\u306A\u3057\n";
					}

					break;

				case "C":
					message += "\u6A5F\u7A2E\uFF1A" + model + "\n";
					message += "\u8272\uFF1A" + color + "\n";
					message += "\u5E0C\u671B\u7D0D\u54C1\u65E5\uFF1A";

					if (datefromstr != "") {
						message += datefromstr + " \u4EE5\u964D ";
					}

					if (datetostr != "") {
						message += datetostr + " \u307E\u3067";
					}

					if (datefromstr == "" && datetostr == "") {
						message += "\u6307\u5B9A\u306A\u3057";
					}

					message += "\n";

					if (-1 !== [2, 3].indexOf(cirid)) //ムーバ、PHSは切替開始時間あり
						{
							if (datechangestr != "") {
								message += "\u5207\u66FF\u958B\u59CB\u6642\u9593\uFF1A" + datechangestr + " \u4EE5\u964D\n";
							} else {
								message += "\u5207\u66FF\u958B\u59CB\u6642\u9593\uFF1A\u6307\u5B9A\u306A\u3057\n";
							}
						}

					break;

				case "S":
					message += "\u6A5F\u7A2E\uFF1A" + model + "\n";
					message += "\u8272\uFF1A" + color + "\n";

					if (datetostr != "") {
						message += "\u5E0C\u671B\u7D0D\u54C1\u65E5\uFF1A" + datetostr + " \u307E\u3067\n";
					} else {
						message += "\u5E0C\u671B\u7D0D\u54C1\u65E5\uFF1A\u6307\u5B9A\u306A\u3057\n";
					}

					if (carid == 1) //ドコモは切替開始時間あり
						{
							if (datechangestr != "") {
								message += "\u5207\u66FF\u958B\u59CB\u6642\u9593\uFF1A" + datechangestr + " \u4EE5\u964D\n";
							} else {
								message += "\u5207\u66FF\u958B\u59CB\u6642\u9593\uFF1A\u6307\u5B9A\u306A\u3057\n";
							}
						}

					break;

				case "P":
					if (plan != "") {
						var plan_sql = "SELECT planname FROM plan_tb WHERE planid=" + plan;
						var planname = db.getOne(plan_sql);
						message += "\u6599\u91D1\u30D7\u30E9\u30F3\uFF1A" + planname + "\n";
					}

					if (packet != "") {
						var packet_sql = "SELECT packetname FROM packet_tb WHERE packetid=" + packet;
						var packetname = db.getOne(packet_sql);
						message += "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF\uFF1A" + packetname + "\n";
					}

					if (datetostr != "") {
						message += "\u5E0C\u671B\u5909\u66F4\u65E5\uFF1A" + datetostr + " \u307E\u3067\n";
					} else {
						message += "\u5E0C\u671B\u5909\u66F4\u65E5\uFF1A\u6307\u5B9A\u306A\u3057\n";
					}

					break;

				case "O":
					message += "\u30AA\u30D7\u30B7\u30E7\u30F3\uFF1A\n";
					var option_sql = "select opid,opname from option_tb where " + "carid = " + carid + " " + "and cirid = " + cirid;
					var H_optionmaster_tmp = db.getHash(option_sql);

					for (var key in H_optionmaster_tmp) {
						var val = H_optionmaster_tmp[key];
						H_optionmaster[val.opid] = val.opname;
					}

					H_option = unserialize(H_option);

					for (var key in H_option) {
						var val = H_option[key];

						if (val == "put") {
							var val = "\u3064\u3051\u308B";
						} else if (val == "stay") {
							val = "\u5909\u66F4\u306A\u3057";
						} else if (val == "remove") {
							val = "\u5916\u3059";
						}

						message += "    " + H_optionmaster[key] + "\uFF1A" + val + "\n";
					}

					if (datetostr != "") {
						message += "\u5E0C\u671B\u5909\u66F4\u65E5\uFF1A" + datetostr + " \u307E\u3067\n";
					} else {
						message += "\u5E0C\u671B\u5909\u66F4\u65E5\uFF1A\u6307\u5B9A\u306A\u3057\n";
					}

					break;

				case "D":
					if (datechangestr != "") {
						message += "\u89E3\u7D04\u5E0C\u671B\u65E5\u6642\uFF1A" + datechangestr + " \u4EE5\u964D\n";
					} else {
						message += "\u89E3\u7D04\u5E0C\u671B\u65E5\u6642\uFF1A\u6307\u5B9A\u306A\u3057\n";
					}

					break;

				case "A":
					message += "\u5546\u54C1\u540D\uFF1A" + model + "\n";

					if (datetostr != "") {
						message += "\u5E0C\u671B\u7D0D\u54C1\u65E5\uFF1A" + datetostr + " \u307E\u3067\n";
					} else {
						message += "\u5E0C\u671B\u7D0D\u54C1\u65E5\uFF1A\u6307\u5B9A\u306A\u3057\n";
					}

					break;

				case "T":
					message += "\u540D\u7FA9\u5909\u66F4\uFF1A" + transfer + "\n";

					if (datechangestr != "") {
						message += "\u5E0C\u671B\u5909\u66F4\u65E5\uFF1A" + datechangestr + " \u307E\u3067\n";
					} else {
						message += "\u5E0C\u671B\u5909\u66F4\u65E5\uFF1A\u6307\u5B9A\u306A\u3057\n";
					}

					break;

				case "M":
					message += "\u7533\u8ACB/\u6CE8\u6587\u5185\u5BB9\uFF1A" + note + "\n";
					break;
			}

			message += "-------------------------------------------------------------\n";
			message += "KCS Motion\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
			message += "\n";
			message += "https://www.kcsmotion.jp/index_shop.php\n";
			message += "-------------------------------------------------------------\n";
		} else if (mailtype == "receipt") //発注種別
		//承認中キャンセル（申請元の部署に飛ぶ）（※ここは使われない）
		{
			typestr = "";

			switch (type) {
				case "N":
					typestr = "\u65B0\u898F\u306E\u3054\u6CE8\u6587";
					break;

				case "C":
					typestr = "\u6A5F\u7A2E\u5909\u66F4\uFF0F\u8CB7\u3044\u5897\u3057\u306E\u3054\u4F9D\u983C";
					break;

				case "S":
					typestr = "\u5951\u7D04\u5909\u66F4\u306E\u3054\u4F9D\u983C";
					break;

				case "P":
					typestr = "\u30D7\u30E9\u30F3\u5909\u66F4\u306E\u3054\u4F9D\u983C";
					break;

				case "O":
					typestr = "\u30AA\u30D7\u30B7\u30E7\u30F3\u5909\u66F4\u306E\u3054\u4F9D\u983C";
					break;

				case "D":
					typestr = "\u89E3\u7D04\u306E\u3054\u4F9D\u983C";
					break;

				case "A":
					typestr = "\u4ED8\u5C5E\u54C1\u306E\u3054\u6CE8\u6587";
					break;

				case "T":
					typestr = "\u540D\u7FA9\u5909\u66F4\u306E\u3054\u4F9D\u983C";
					break;

				case "M":
					typestr = "\u305D\u306E\u4ED6\u306E\u3054\u4F9D\u983C";
					break;

				case "BP":
					typestr = "\u4E00\u62EC\u30D7\u30E9\u30F3\u5909\u66F4\u306E\u3054\u4F9D\u983C";
					break;
			}

			subject = "KCS Motion\uFF1A" + typestr + "\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\uFF08" + orderidstr + "\uFF09";
			message = "<< KCS Motion : \u8CA9\u58F2\u5E97\u53D7\u4ED8\u306E\u304A\u77E5\u3089\u305B >>\n";
			message += "-------------------------------------------------------------\n";
			message += typestr + "\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
			message += "\n";
			message += "KCS Motion\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
			message += "\u767A\u6CE8ID\u306F " + orderidstr + " \u3067\u3059\u3002\n";
			message += "\n";
			message += "https://www.kcsmotion.jp/\n";
			message += "-------------------------------------------------------------\n";
		} else if (mailtype == "applycancell") {
		typestr = "";

		switch (type) {
			case "N":
				typestr = "\u65B0\u898F\u767A\u6CE8";
				break;

			case "C":
				typestr = "\u6A5F\u7A2E\u5909\u66F4\uFF0F\u8CB7\u3044\u5897\u3057";
				break;

			case "S":
				typestr = "\u5951\u7D04\u5909\u66F4";
				break;

			case "P":
				typestr = "\u30D7\u30E9\u30F3\u5909\u66F4";
				break;

			case "O":
				typestr = "\u30AA\u30D7\u30B7\u30E7\u30F3\u5909\u66F4";
				break;

			case "D":
				typestr = "\u89E3\u7D04";
				break;

			case "A":
				typestr = "\u4ED8\u5C5E\u54C1";
				break;

			case "T":
				typestr = "\u540D\u7FA9\u5909\u66F4";
				break;

			case "M":
				typestr = "\u305D\u306E\u4ED6";
				break;

			case "BP":
				typestr = "\u4E00\u62EC\u30D7\u30E9\u30F3\u5909\u66F4";
				break;
		}

		subject = "KCS Motion\uFF1A" + typestr + "\u306E\u7533\u8ACB\u53D6\u6D88\uFF08" + postname + "\uFF09";
		message = "<< KCS Motion : " + typestr + "\u306E\u7533\u8ACB\u53D6\u6D88 >>\n";
		message += "-------------------------------------------------------------\n";
		message += postname + "\u304B\u3089\u306E" + typestr + "\u306E\u7533\u8ACB\u304C\u53D6\u308A\u6D88\u3055\u308C\u307E\u3057\u305F\u3002\n";
		message += "\n";
		message += "KCS Motion\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
		message += "\n";
		message += "https://www.kcsmotion.jp/\n";
		message += "-------------------------------------------------------------\n";
	}

	var H_mailcontent = {
		subject: subject,
		message: message
	};
	return H_mailcontent;
};