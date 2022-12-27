//機能：自動承認バッチV3対応
//作成：宮澤


import GroupModel from '../../class/model/GroupModel';
import MtSetting from '../../class/MtSetting';
import MtDateUtil from '../../class/MtDateUtil';
import MailUtil from '../../class/MailUtil';
import MtAuthority from '../../class/MtAuthority';
import { BAT_DIR, G_LOG } from "../../db_define/define";
import { G_SCRIPT_ALL, G_SCRIPT_BEGIN, G_SCRIPT_END, G_SCRIPT_INFO, ScriptLogAdaptor, ScriptLogBase, ScriptLogFile } from "./lib/script_log";
import { ScriptDB } from './lib/script_db';
import { DB_FETCHMODE_ASSOC } from '../../class/MtDBUtil';

export const WEB_DIR = "/nfs/web/kcs";
global[WEB_DIR] = "/nfs/web/kcs";
// set_include_path(get_include_path() + ":" + WEB_DIR + "/class:" + WEB_DIR + "/conf"); 一旦コメントアウト

const fs = require('fs');
const process = require('process');
process.chdir(BAT_DIR);
var A_common = fs.readFileSync(WEB_DIR + "/conf/common.php");

for (var ii = 0; ii < A_common.length; ii++) {
	if (A_common[ii].match("/define/") == true && A_common[ii].match("/KCS_DIR/") == true) 
		{}
}

var dbLogFile = G_LOG + "recogbat" + new Date().getFullYear() + '' + (new Date().getMonth() + 1) + ".log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
log_listener.putListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var sql = "SELECT \n\tapplyuser.mail AS applymail, \n\tapplyuser.username AS applyname, \n\tapplyuser.acceptmail5 AS applyacceptshop, \n\tapplyuser.language, \n\tord.chargerid, \n\tord.nextpostid, \n\tord.nextpostname,\n\tord.orderid,\n\tord.shopid,\n\tord.pactid,\n\tpact.type AS pacttype,\n\tpact.groupid,\n\tpact.compname,\n\tpact.userid_ini,\n\tord.postid,\n\tpost.postname,\n\tord.carid,\n\t'（自動承認）' AS loginname,\n\tord.ordertype,\n\tord.cirid,\n\tord.dateto,\n\tord.datefrom,\n\tord.datechange,\n\tord.recdate ";
sql += " FROM user_tb applyuser, mt_order_tb ord, pact_tb pact, post_tb post, recog_batch_tb bat ";
sql += " WHERE applyuser.userid = ord.chargerid";
sql += " AND pact.pactid = ord.pactid";
sql += " AND post.postid = ord.postid";
sql += " AND ( (ord.pactid = bat.pactid AND bat.recogpostid IS NULL AND bat.orderpostid IS NULL)";
sql += "  OR (ord.pactid = bat.pactid AND ord.nextpostid = bat.recogpostid AND bat.orderpostid IS NULL)";
sql += "  OR (ord.pactid = bat.pactid AND bat.recogpostid IS NULL AND ord.postid = bat.orderpostid) )";
sql += " AND ord.status = 10";
(async () => {
var H_orderinfo = await dbh.getHash(sql);

logh.putError(G_SCRIPT_BEGIN, "自動承認処理開始");
logh.putError(G_SCRIPT_INFO, "カウント：" + H_orderinfo.length + "件");

if (H_orderinfo.length > 0) //begin
	{
		var now = MtDateUtil.getNow();
		var status = 50;
		dbh.begin();

		for (var key in H_orderinfo) //mt_order_history_tbにインサート
		
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
			var knowledge;
			var certificate;
			var matterno = undefined;
			var ordpost = val.postid;
			var sql_str = "select postidparent from post_relation_tb where pactid = " + val.pactid + " and " + "postidparent = postidchild and " + "level = 0";
			var rootpostid = await dbh.getOne(sql_str);
			var fnc_sql = "SELECT count(rel.userid) FROM fnc_relation_tb rel INNER JOIN function_tb fnc ON rel.fncid=fnc.fncid WHERE fnc.ininame='fnc_not_view_root' AND rel.pactid=" + val.pactid;
			var fnc_result = await dbh.getOne(fnc_sql);

			if (true == 0 < fnc_result && ordpost != rootpostid) //$rootpostid = $this->getTargetRootPostid($val["pactid"], $ordpost, "post_relation_tb", 2);	// Post.phpから関数移植した 20101018miya
				//Post.phpから関数移植した 20101018miya
				{
					rootpostid = getTargetRootPostid(val.pactid, ordpost, "post_relation_tb", 2);
				}
				var H_prsi;
			if ("" != rootpostid) //第二証明書対応 20100803miya
				//第二証明書対応＋抜けてた項目追加 20100802miya
				{
					var prsi_sql = "SELECT pactcode,salepost,knowledge,signedget,signed,signeddate,aobnumber,worldtel,accountcomment,existcircuit,tdbcode,idv_signedget," + "idv_signeduse_0,idv_signed_0,idv_signeddate_0," + "idv_signeduse_1,idv_signed_1,idv_signeddate_1," + "idv_signeduse_2,idv_signed_2,idv_signeddate_2," + "idv_signeduse_3,idv_signed_3,idv_signeddate_3," + "idv_signeduse_4,idv_signed_4,idv_signeddate_4," + "idv_signeduse_5,idv_signed_5,idv_signeddate_5," + "idv_signeduse_6,idv_signed_6,idv_signeddate_6," + "idv_signeduse_7,idv_signed_7,idv_signeddate_7," + "idv_signeduse_8,idv_signed_8,idv_signeddate_8," + "idv_signeduse_9,idv_signed_9,idv_signeddate_9" + " FROM post_rel_shop_info_tb WHERE pactid=" + val.pactid + " AND postid=" + rootpostid + " AND shopid=" + val.shopid;
					let H_prsi = await dbh.getHash(prsi_sql);
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
				certificate = A_certificate.join("\n");
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
			upd_sql += "knowledge='" + knowledge.replace(/'/g, "\\'") + "',";
			upd_sql += "certificate='" + certificate.replace(/'/g, "\\'") + "',";

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
			ins_sql += "'システムによる自動承認',";
			ins_sql += "NULL,";
			ins_sql += "'" + now + "',";
			ins_sql += "NULL,";
			ins_sql += status;
			ins_sql += ");";
			dbh.query(ins_sql);
			logh.putError(G_SCRIPT_INFO, "orderid=" + val.orderid + "を自動承認");
		}

		dbh.commit();

		for (var key in H_orderinfo) // 発注（販売店の代表メールアドレスと担当者に飛ぶ）***//
		{
			var val = H_orderinfo[key];
			var mailtype = "order";
			var get_mail_sql = "SELECT " + "mem.name as to_name, mem.mail as to FROM shop_member_tb mem, shop_tb shop, shop_relation_tb rel " + "WHERE shop.shopid=" + "(SELECT rel.shopid WHERE rel.pactid=" + val.pactid + " " + "AND rel.postid=" + val.postid + " " + "AND rel.carid=" + val.carid + ") " + "AND (mem.memid=shop.memid " + "OR mem.memid=" + "(SELECT rel.memid WHERE rel.pactid=" + val.pactid + " " + "AND rel.postid=" + val.postid + " " + "AND rel.carid=" + val.carid + ")) " + "AND mem.mail != '' AND mem.mail IS NOT NULL";
			var H_get_mail = await dbh.getHash(get_mail_sql);
			var A_mail_list_tmp = Array();

			for (var i = 0; i < H_get_mail.length; i++) {
				var H_mailto = {
					to_name: H_get_mail[i].to_name.replace(/(<([^>]+)>)/gi, ""),
					to: H_get_mail[i].to
				};
				A_mail_list_tmp.push(JSON.stringify(H_mailto));
			}

			var A_mail_list = Array();
			A_mail_list_tmp = A_mail_list_tmp.filter(function (value, index, self) {
				return self.indexOf(value) === index;
			});

			for (var ky in A_mail_list_tmp) {
				var vl = A_mail_list_tmp[ky];
				A_mail_list.push(JSON.stringify(vl));// 2022cvt_008
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
					let O_mail = new MailUtil();
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
				{
					var H_mailcontent_forcustomer = orderMailWrite(mailtype_forcustomer, H_mailparam);
					let O_mail = new MailUtil();
					O_mail.multiSend(A_mail_list_forcustomer, H_mailcontent_forcustomer.message, shopmail, H_mailcontent_forcustomer.subject, shopname);
				}
		}
	}

logh.putError(G_SCRIPT_END, "自動承認処理完了");
})();

function orderMailWrite(mailtype: string, H_mailparam) //使用パラメータ
{
	var err = new ScriptLogFile(G_SCRIPT_ALL, "stdout");
	var db: any = new ScriptDB(err);
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

	if ("KMDB1" == process.HOSTNAME) {
		servername = "www.kcsmotion.jp";
	} else if ("AMDB1" == process.HOSTNAME) //サーバ移行に伴って修正 20100707miya
		{
			servername = "v3.kcsmotion.jp";
		} else {
		servername = O_conf.get("FULL_DOMAIN");
	}

	if ("" != servername) //KCSはURL変更なしとのこと
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

	var orderidstr = orderid.padStart(10, "0");
	var typestr;
	var type_sql = "SELECT ordersubject FROM mt_order_pattern_tb WHERE carid=" + carid + " AND cirid=" + cirid + " AND type='" + type + "'";
	typestr = db.getOne(type_sql);

	if ("D" == type) {
		cirstr = "";
	}
	var subject;
	var message;
	if (mailtype == "order") //整形する
		//販売店側受付（最終承認者と申請者に飛ぶ）
		{
			var datetostr = dateto.substr(0, 16).replace(" 00:00", "");
			var datefromstr = datefrom.substr(0, 16).replace(" 00:00", "");
			var datechangestr = datechange.substr(0, 16).replace(" 00:00", "");
			subject = "[" + compname + "]" + orderidstr + "/" + carstr + " " + typestr + "/" + systemname;
			message = "<< " + systemname + " : " + typestr + " >>\n";
			message += "-------------------------------------------------------------\n";
			message += typestr + "が届いたことをお知らせします。\n";
			message += "-------------------------------------------------------------\n";
			message += "会社 : " + compname + "\n";
			message += "登録部署 : " + applypostname + "\n";
			message += "-------------------------------------------------------------\n";
			message += carstr + " " + typestr + " " + cirstr + "\n";
			message += "-------------------------------------------------------------\n";
			message += systemname + "のサイトにアクセスして、詳細をご確認ください。\n";
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
				subject = systemname + " : " + typestr + " has been received (" + orderidstr + ")";
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
				subject = systemname + " : " + typestr + "を受け付けました（" + orderidstr + "）";
				message = "<< " + systemname + " : 販売店受付のお知らせ >>\n";
				message += "-------------------------------------------------------------\n";
				message += typestr + "を受け付けましたことをお知らせします。\n";
				message += "\n";
				message += systemname + "のサイトにアクセスして、詳細をご確認ください。\n";
				message += "発注IDは " + orderidstr + " です\n";
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

function getTargetRootPostid(pactid: string, curpostid: any, postreltable: string, level: number) //部署構成を取得
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

async function getPostrelationLevel(pactid: string, table: string) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
{
	var result;
	if (!("dbh" in global)) dbh;
	var sql_str = "select postidparent,postidchild,level " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
	var O_result: any = await dbh.query(sql_str);
 	var H_return;
	 for (result of O_result ) {
	// while (result = O_result.fetchRow(DB_FETCHMODE_ASSOC)) {
		H_return[result.postidchild] = {
			postidparent: result.postidparent,
			level: result.level
		};
	}

	return H_return;
};
