//===========================================================================
//機能：自動承認バッチV3対応
//
//作成：宮澤
//===========================================================================
//tryはこれが必要
//set_include_path('.:/usr/local/share/pear:/usr/local/share/pear/Smarty:/try_kcs/kcs/conf:/try_kcs/kcs/class:/try_kcs/kcs/INC');
//本番
//★要注意：V2型のバッチなので、メールの設定はcommon.phpを見ること。mail.iniではない 20100707miya
//開発機
//define(WEB_DIR, "/kcs");
//require_once("Post.php");	// Post.phpから関数移植したので不要 20101018miya
//別ドメイン対応 20100803miya
//chdirの上に持ってきた 20101018miya
//chdirの上に持ってきた 20101018miya
//chdirの上に持ってきた 20101018miya
//カレントディレクトリ変更
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//モデル
//$O_Post = & new Post();	// Post.phpから関数移植したので不要 20101018miya
//自動承認する発注情報を取得
//一件でもあれば自動承認プロセス作動
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//メール本文作成
//
//[引　数] $mailtype：メールのタイプ
//$H_mailparam：メールに使用するパラメータの配列
//[返り値] $H_mailcontent：題名と本文
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された部署の指定された階層の親部署ＩＤを取得する
//
//[引　数] $pactid:契約ＩＤ
//$curpostid:カレント部署ＩＤ
//$postreltable:部署構成テーブル
//$level:返り値として返す親部署の階層レベル
//[返り値] システム用親部署ＩＤ
//2005/12/08 maeda
//Post.phpから移植 20101018miya
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//指定された会社の部署構成情報の取得(階層付)
//
//[引　数] $pactid：契約ＩＤ
//$table:検索対象テーブル
//[返り値] $H_return：子部署ＩＤをキー、親部署ＩＤと階層の連想配列を値とした連想配列
//2005/12/08 maeda
//Post.phpから移植 20101018miya
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
global[WEB_DIR] = "/nfs/web/kcs";
set_include_path(get_include_path() + ":" + WEB_DIR + "/class:" + WEB_DIR + "/conf");
error_reporting(E_ALL);

require("model/GroupModel.php");

require("MtDateUtil.php");

require("MtSetting.php");

require("lib/script_common.php");

require("lib/script_db.php");

require("lib/script_log.php");

require("MailUtil.php");

require("MtAuthority.php");

chdir(BAT_DIR);
var A_common = file(WEB_DIR + "/conf/common.php");

for (var ii = 0; ii < A_common.length; ii++) {
	if (preg_match("/define/", A_common[ii]) == true && preg_match("/KCS_DIR/", A_common[ii]) == true) //eval($A_common[$ii]);	// script_common.phpで既にdefineされているので不要 20101018miya
		{}
}

var dbLogFile = G_LOG + "recogbat" + date("Ym") + ".log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var sql = "SELECT \n\tapplyuser.mail AS applymail, \n\tapplyuser.username AS applyname, \n\tapplyuser.acceptmail5 AS applyacceptshop, \n\tapplyuser.language, \n\tord.chargerid, \n\tord.nextpostid, \n\tord.nextpostname,\n\tord.orderid,\n\tord.shopid,\n\tord.pactid,\n\tpact.type AS pacttype,\n\tpact.groupid,\n\tpact.compname,\n\tpact.userid_ini,\n\tord.postid,\n\tpost.postname,\n\tord.carid,\n\t'\uFF08\u81EA\u52D5\u627F\u8A8D\uFF09' AS loginname,\n\tord.ordertype,\n\tord.cirid,\n\tord.dateto,\n\tord.datefrom,\n\tord.datechange,\n\tord.recdate ";
sql += " FROM user_tb applyuser, mt_order_tb ord, pact_tb pact, post_tb post, recog_batch_tb bat ";
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

if (H_orderinfo.length > 0) //begin
	//commit
	//メール処理
	{
		var now = MtDateUtil.getNow();
		var status = 50;
		dbh.begin();

		for (var key in H_orderinfo) //mt_order_history_tbにインサート
		//SQL用に整形
		//受注時には売り上げ部門等の情報を取ってきて入れる 20090410miya
		//ルート部署取得
		//ルート部署非表示権限がある会社で、注文部署がルート部署でなければ第二階層の部署を取得
		//条件訂正（countではなくuseridそのものを取っていたのでfnc_resultが0にしかならなかった） 20100603miya
		//抜けてた項目追加 20100802miya
		//抜けてた項目追加 20100802miya
		//抜けてた項目追加 20100802miya
		//抜けてた項目追加 20100802miya
		//mt_order_teldetail_tbに書き込むためのSQLを作成
		//一括プラン変更の除外を他と一緒に変えないようにするためsubstatus=210は除く
		//mt_order_sub_tbに書き込むためのSQLを作成
		//アップデート実行
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

			var destinationcode = undefined;
			var salepost = undefined;
			var knowledge = undefined;
			var certificate = undefined;
			var matterno = undefined;
			var ordpost = val.postid;
			var sql_str = "select postidparent from post_relation_tb where pactid = " + val.pactid + " and " + "postidparent = postidchild and " + "level = 0";
			var rootpostid = dbh.getOne(sql_str);
			var fnc_sql = "SELECT count(rel.userid) FROM fnc_relation_tb rel INNER JOIN function_tb fnc ON rel.fncid=fnc.fncid WHERE fnc.ininame='fnc_not_view_root' AND rel.pactid=" + val.pactid;
			var fnc_result = dbh.getOne(fnc_sql);

			if (true == 0 < fnc_result && ordpost != rootpostid) //$rootpostid = $this->getTargetRootPostid($val["pactid"], $ordpost, "post_relation_tb", 2);	// Post.phpから関数移植した 20101018miya
				//Post.phpから関数移植した 20101018miya
				{
					rootpostid = getTargetRootPostid(val.pactid, ordpost, "post_relation_tb", 2);
				}

			if ("" != rootpostid) //第二証明書対応 20100803miya
				//第二証明書対応＋抜けてた項目追加 20100802miya
				{
					var prsi_sql = "SELECT pactcode,salepost,knowledge,signedget,signed,signeddate,aobnumber,worldtel,accountcomment,existcircuit,tdbcode,idv_signedget," + "idv_signeduse_0,idv_signed_0,idv_signeddate_0," + "idv_signeduse_1,idv_signed_1,idv_signeddate_1," + "idv_signeduse_2,idv_signed_2,idv_signeddate_2," + "idv_signeduse_3,idv_signed_3,idv_signeddate_3," + "idv_signeduse_4,idv_signed_4,idv_signeddate_4," + "idv_signeduse_5,idv_signed_5,idv_signeddate_5," + "idv_signeduse_6,idv_signed_6,idv_signeddate_6," + "idv_signeduse_7,idv_signed_7,idv_signeddate_7," + "idv_signeduse_8,idv_signed_8,idv_signeddate_8," + "idv_signeduse_9,idv_signed_9,idv_signeddate_9" + " FROM post_rel_shop_info_tb WHERE pactid=" + val.pactid + " AND postid=" + rootpostid + " AND shopid=" + val.shopid;
					var H_prsi = dbh.getHash(prsi_sql);
					destinationcode = H_prsi[0].pactcode;
					salepost = H_prsi[0].salepost;
					knowledge = H_prsi[0].knowledge;
					matterno = H_prsi[0].aobnumber;
					var signedget = H_prsi[0].signedget;
					var signeddate = H_prsi[0].signeddate;
					var worldtel = H_prsi[0].worldtel;
					var accountcomment = H_prsi[0].accountcomment;
					var existcircuit = H_prsi[0].existcircuit;
					var tdbcode = H_prsi[0].tdbcode;
					var idv_signedget = H_prsi[0].idv_signedget;
				}

			var A_certificate = Array();

			if ("anytime" != H_prsi[0].signedget) //随時取得でなければ第一証明書セット
				{
					if ("" != String(H_prsi[0].signed)) {
						A_certificate.push(H_prsi[0].signed);
						A_certificate.push("----------------------------------------");
					}
				}

			if ("anytime" != H_prsi[0].idv_signedget) //随時取得でなければ第二証明書セット
				{
					for (var ci = 0; ci < 10; ci++) {
						var idv_isset = false;

						if ("" != String(H_prsi[0]["idv_signeduse_" + ci])) {
							A_certificate.push(H_prsi[0]["idv_signeduse_" + ci]);
							idv_isset = true;
						}

						if ("" != String(H_prsi[0]["idv_signed_" + ci])) {
							A_certificate.push(H_prsi[0]["idv_signed_" + ci]);
							idv_isset = true;
						}

						if ("" != String(H_prsi[0]["idv_signeddate_" + ci])) {
							A_certificate.push(H_prsi[0]["idv_signeddate_" + ci]);
							idv_isset = true;
						}

						if (true == idv_isset) {
							A_certificate.push("----------------------------------------");
						}
					}
				}

			if (0 < A_certificate.length) {
				certificate = join("\n", A_certificate);
			} else {
				certificate = undefined;
			}

			var certificatelimit = undefined;

			if (undefined != certificate && undefined != H_prsi[0].signeddate) {
				certificatelimit = H_prsi[0].signeddate;
			}

			if ("" != val.chargerid) //販売店からのメールを受け取る設定のみメールアドレスを入れる
				{
					var get_selfmail_sql = "SELECT user_tb.mail, user_tb.acceptmail5 FROM user_tb WHERE userid=" + val.chargerid;
					var H_selfmail = dbh.getHash(get_selfmail_sql);

					if (H_selfmail[0].mail != "" && H_selfmail[0].acceptmail5 == 1) {
						var selfmailstr = H_selfmail[0].mail;
					} else {
						selfmailstr = undefined;
					}

					var recogmail = selfmailstr;
				}

			var upd_sql = "UPDATE mt_order_tb SET ";
			upd_sql += "status=" + status + ",";
			upd_sql += "nextpostid = NULL,";
			upd_sql += "nextpostname = NULL,";
			upd_sql += "chpostid=" + nextpostid + ",";
			upd_sql += "chpostname=" + nextpostname + ",";
			upd_sql += "recogmail='" + recogmail + "',";
			upd_sql += "destinationcode='" + destinationcode + "',";
			upd_sql += "salepost='" + salepost + "',";
			upd_sql += "knowledge='" + addslashes(knowledge) + "',";
			upd_sql += "certificate='" + addslashes(certificate) + "',";

			if ("" != certificatelimit) //第二証明書対応 20100803miya
				{
					upd_sql += "certificatelimit='" + certificatelimit + "',";
				} else {
				upd_sql += "certificatelimit=null,";
			}

			upd_sql += "matterno='" + matterno + "',";
			upd_sql += "worldtel='" + worldtel + "',";
			upd_sql += "accountcomment='" + accountcomment + "',";
			upd_sql += "existcircuit='" + existcircuit + "',";
			upd_sql += "tdbcode='" + tdbcode + "',";
			upd_sql += "anspost=" + nextpostname + ",";
			upd_sql += "ansuser=NULL,";
			upd_sql += "ansdate='" + now + "' ";
			upd_sql += "WHERE orderid = " + val.orderid + ";";
			var det_sql = "UPDATE mt_order_teldetail_tb SET substatus= " + status + " ";
			det_sql += "WHERE orderid = " + val.orderid + " AND substatus != 210;";
			var sub_sql = "UPDATE mt_order_sub_tb SET substatus= " + status + " ";
			sub_sql += "WHERE orderid = " + val.orderid + ";";
			dbh.query(upd_sql);
			dbh.query(det_sql);
			dbh.query(sub_sql);
			var ins_sql = "INSERT INTO mt_order_history_tb (orderid,chpostid,chpostname,chname,chuserid,chdate,answercomment,status) ";
			ins_sql += "VALUES(";
			ins_sql += val.orderid + ",";
			ins_sql += nextpostid + ",";
			ins_sql += nextpostname + ",";
			ins_sql += "'\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u81EA\u52D5\u627F\u8A8D',";
			ins_sql += "NULL,";
			ins_sql += "'" + now + "',";
			ins_sql += "NULL,";
			ins_sql += status;
			ins_sql += ");";
			dbh.query(ins_sql);
			logh.putError(G_SCRIPT_INFO, "orderid=" + val.orderid + "\u3092\u81EA\u52D5\u627F\u8A8D");
		}

		dbh.commit();

		for (var key in H_orderinfo) // 発注（販売店の代表メールアドレスと担当者に飛ぶ）***//
		//メール送信用(tmp)
		//配列の重複を削除する
		//メール送信用
		//販売店側受付メールのfromとして使う
		//送信元
		//文字化け対策で「自動承認」の文字を取った 20100707miya
		//空白にしておけば共通メール設定のデフォルトメールアドレスが入る
		//パラメータセット
		//宛先が一つでも入ってたら送信
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
			var from_name = val.compname + val.postname;
			var from = "";
			var H_mailparam = {
				type: val.ordertype,
				cirid: val.cirid,
				carid: val.carid,
				pactid: val.pactid,
				userid_ini: val.userid_ini,
				orderid: val.orderid,
				dateto: val.dateto,
				datefrom: val.datefrom,
				datechange: val.datechange,
				compname: val.compname,
				postname: val.postname,
				pacttype: val.pacttype,
				language: val.language,
				groupid: val.groupid
			};

			if (A_mail_list.length > 0) //販売店へのメール作成
				//販売店へのメール送信
				//$logh->putError(G_SCRIPT_INFO, "orderid=" . $val["orderid"] . " の受注メールを販売店へ送信");
				{
					var H_mailcontent = orderMailWrite(mailtype, H_mailparam);
					var O_mail = new MailUtil();
					O_mail.multiSend(A_mail_list, H_mailcontent.message, from, H_mailcontent.subject, from_name);
				}

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
//発注ID
//言語設定
//groupidによってグループ名、システム名を変更
//別ドメイン対応 20100803miya
//DB側からはSERVER_NAMEが取れないのでHOSTNAMEからSERVER_NAMEを作る
//不明の場合は空白
//同上
//発注ID桁揃え
//発注種別
//解約は回線種別を表示しない
{
	var err = new ScriptLogFile(G_SCRIPT_ALL, "stdout");
	var db = new ScriptDB(err);
	var O_group = new GroupModel(db);
	var type = H_mailparam.type;
	var carid = H_mailparam.carid;
	var cirid = H_mailparam.cirid;
	var pactid = H_mailparam.pactid;
	var userid_ini = H_mailparam.userid_ini;
	var authority = MtAuthority.singleton(pactid);
	var pactLogin = authority.chkPactFuncId(206);
	var plusUrl = "";

	if (pactLogin) {
		plusUrl = "/" + userid_ini;
	}

	var compname = H_mailparam.compname;
	var applypostname = H_mailparam.postname;
	var orderid = H_mailparam.orderid;
	var dateto = H_mailparam.dateto;
	var datefrom = H_mailparam.datefrom;
	var datechange = H_mailparam.datechange;
	var language = H_mailparam.language;
	var groupid = H_mailparam.groupid;
	var groupname = O_group.getGroupName(groupid);
	var systemname = O_group.getGroupSystemname(groupid);
	var O_conf = MtSetting.singleton();
	O_conf.loadConfig("group");

	if (true == O_conf.existsKey("groupid" + groupid + "_is_original_domain") && true == O_conf["groupid" + groupid + "_is_original_domain"]) {
		var original_domain = true;
		var domainname = O_conf["groupid" + groupid + "_hostname"];
	} else {
		original_domain = false;
	}

	var url = "";
	var url_shop = "";
	var servername = "";

	if ("KMDB1" == _SERVER.HOSTNAME) {
		servername = "www.kcsmotion.jp";
	} else if ("AMDB1" == _SERVER.HOSTNAME) //サーバ移行に伴って修正 20100707miya
		{
			servername = "v3.kcsmotion.jp";
		} else {
		servername = O_conf.FULL_DOMAIN;
	}

	if ("" != servername) //KCSはURL変更なしとのこと
		//別ドメイン対応で条件追加 20100803miya
		{
			url = "https://" + servername + "/" + groupname + plusUrl + "/\n";
			url_shop = "https://" + servername + "/" + groupname + "/index_shop.php\n";

			if (1 >= groupid || true == original_domain) {
				if (pactLogin) {
					url = "https://" + domainname + "/" + groupname + plusUrl + "/\n";
				} else {
					url = "https://" + domainname + "/\n";
				}

				url_shop = "https://" + domainname + "/index_shop.php\n";
			}

			if ("H" == H_mailparam.pacttype) //$systemname = "KCS Hotline";	// KCS以外のグループだと「KCS Hotline」はおかしいので「KCS」を抜いた 20090130miya
				//KCS以外はURL変える 20090514miya
				//別ドメイン対応で条件追加 20100803miya
				{
					systemname = "Hotline";

					if (1 == groupid || true == original_domain) {
						url = "https://" + domainname + "/Hotline/index.php\n";
					} else {
						url = "https://" + servername + "/" + groupname + "/hotline.php\n";
					}
				}
		}

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
	var typestr = "";
	var type_sql = "SELECT ordersubject FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
	typestr = db.getOne(type_sql);

	if ("D" == type) {
		cirstr = "";
	}

	if (mailtype == "order") //整形する
		//販売店側受付（最終承認者と申請者に飛ぶ）
		{
			var datetostr = str_replace(" 00:00", "", dateto.substr(0, 16));
			var datefromstr = str_replace(" 00:00", "", datefrom.substr(0, 16));
			var datechangestr = str_replace(" 00:00", "", datechange.substr(0, 16));
			var subject = "[" + compname + "]" + orderidstr + "/" + carstr + " " + typestr + "/" + systemname;
			var message = "<< " + systemname + " : " + typestr + " >>\n";
			message += "-------------------------------------------------------------\n";
			message += typestr + "\u304C\u5C4A\u3044\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
			message += "-------------------------------------------------------------\n";
			message += "\u4F1A\u793E : " + compname + "\n";
			message += "\u767B\u9332\u90E8\u7F72 : " + applypostname + "\n";
			message += "-------------------------------------------------------------\n";
			message += carstr + " " + typestr + " " + cirstr + "\n";
			message += "-------------------------------------------------------------\n";
			message += systemname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
			message += "\n";
			message += url_shop;
			message += "-------------------------------------------------------------\n";
		} else if (mailtype == "receipt") {
		if ("ENG" == language) //発注種別
			{
				typestr = "";
				typestr = "";
				type_sql = "SELECT returnsubject_eng FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
				typestr = db.getOne(type_sql);
				subject = systemname + "\uFF1A" + typestr + " has been received (" + orderidstr + ")";
				message = "<< " + systemname + " : Shop Reception Completed >>\n";
				message += "-------------------------------------------------------------\n";
				message += "A " + typestr + " has been received by the shop.\n";
				message += "\n";
				message += "Please access the " + systemname + " website to confirm the details.\n";
				message += "Order ID is " + orderidstr + ".\n";
				message += "\n";
				message += url;
				message += "-------------------------------------------------------------\n";
			} else //発注種別
			{
				typestr = "";
				typestr = "";
				type_sql = "SELECT returnsubject FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
				typestr = db.getOne(type_sql);
				subject = systemname + "\uFF1A" + typestr + "\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\uFF08" + orderidstr + "\uFF09";
				message = "<< " + systemname + " : \u8CA9\u58F2\u5E97\u53D7\u4ED8\u306E\u304A\u77E5\u3089\u305B >>\n";
				message += "-------------------------------------------------------------\n";
				message += typestr + "\u3092\u53D7\u3051\u4ED8\u3051\u307E\u3057\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n";
				message += "\n";
				message += systemname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
				message += "\u767A\u6CE8ID\u306F " + orderidstr + " \u3067\u3059\u3002\n";
				message += "\n";
				message += url;
				message += "-------------------------------------------------------------\n";
			}
	}

	var H_mailcontent = {
		subject: subject,
		message: message
	};
	return H_mailcontent;
};

function getTargetRootPostid(pactid, curpostid, postreltable, level) //部署構成を取得
{
	var H_postrellevel = getPostrelationLevel(pactid, postreltable);
	var targetpostid = curpostid;
	var targetlevel = -1;

	while (level != targetlevel) //指定された部署ＩＤが連想配列のキーとして存在している場合
	{
		if (!H_postrellevel[targetpostid] == false) //親部署ＩＤを返す
			//指定された部署ＩＤが連想配列のキーとして存在しない場合はカレント部署ＩＤを（ルート部署になるよう）返す
			{
				targetlevel = H_postrellevel[targetpostid].level;
				targetpostid = H_postrellevel[targetpostid].postidparent;
			} else {
			return curpostid;
		}
	}

	return targetpostid;
};

function getPostrelationLevel(pactid, table) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
{
	var result;
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select postidparent,postidchild,level " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
	var O_result = dbh.query(sql_str);

	while (result = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
		H_return[result.postidchild] = {
			postidparent: result.postidparent,
			level: result.level
		};
	}

	return H_return;
};