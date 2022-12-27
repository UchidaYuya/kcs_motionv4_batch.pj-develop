//===========================================================================
//会社増やす 石崎 20080613
//契約ID 4から最新のIDへ
//===========================================================================
//データ抽出用ＳＱＬ
//postid 変換テーブル
//ファイルオープン
//$fp_out = fopen("/kcs/script/batch/pactdata-" . $pactid . ".sql", "w+");
//クライアント文字コード設定ファイル出力
//データ抽出
error_reporting(E_ALL);

require("MtDBUtil.php");

const DEFPACT = 4;
var O_db = MtDBUtil.singleton();
var H_select = {
	pact_tb: "",
	post_tb: "",
	post_01_tb: "",
	post_02_tb: "",
	post_03_tb: "",
	post_04_tb: "",
	post_05_tb: "",
	post_06_tb: "",
	post_07_tb: "",
	post_08_tb: "",
	post_09_tb: "",
	post_10_tb: "",
	post_11_tb: "",
	post_12_tb: "",
	post_13_tb: "",
	post_14_tb: "",
	post_15_tb: "",
	post_16_tb: "",
	post_17_tb: "",
	post_18_tb: "",
	post_19_tb: "",
	post_20_tb: "",
	post_21_tb: "",
	post_22_tb: "",
	post_23_tb: "",
	post_24_tb: "",
	post_deleted_tb: "",
	post_relation_tb: "",
	post_relation_01_tb: "",
	post_relation_02_tb: "",
	post_relation_03_tb: "",
	post_relation_04_tb: "",
	post_relation_05_tb: "",
	post_relation_06_tb: "",
	post_relation_07_tb: "",
	post_relation_08_tb: "",
	post_relation_09_tb: "",
	post_relation_10_tb: "",
	post_relation_11_tb: "",
	post_relation_12_tb: "",
	post_relation_13_tb: "",
	post_relation_14_tb: "",
	post_relation_15_tb: "",
	post_relation_16_tb: "",
	post_relation_17_tb: "",
	post_relation_18_tb: "",
	post_relation_19_tb: "",
	post_relation_20_tb: "",
	post_relation_21_tb: "",
	post_relation_22_tb: "",
	post_relation_23_tb: "",
	post_relation_24_tb: "",
	post_relation_deleted_tb: "",
	tel_tb: "",
	tel_01_tb: "",
	tel_02_tb: "",
	tel_03_tb: "",
	tel_04_tb: "",
	tel_05_tb: "",
	tel_06_tb: "",
	tel_07_tb: "",
	tel_08_tb: "",
	tel_09_tb: "",
	tel_10_tb: "",
	tel_11_tb: "",
	tel_12_tb: "",
	tel_13_tb: "",
	tel_14_tb: "",
	tel_15_tb: "",
	tel_16_tb: "",
	tel_17_tb: "",
	tel_18_tb: "",
	tel_19_tb: "",
	tel_20_tb: "",
	tel_21_tb: "",
	tel_22_tb: "",
	tel_23_tb: "",
	tel_24_tb: "",
	tel_deleted_tb: "",
	asp_charge_tb: "",
	bill_01_tb: "",
	bill_02_tb: "",
	bill_03_tb: "",
	bill_04_tb: "",
	bill_05_tb: "",
	bill_06_tb: "",
	bill_07_tb: "",
	bill_08_tb: "",
	bill_09_tb: "",
	bill_10_tb: "",
	bill_11_tb: "",
	bill_12_tb: "",
	bill_13_tb: "",
	bill_14_tb: "",
	bill_15_tb: "",
	bill_16_tb: "",
	bill_17_tb: "",
	bill_18_tb: "",
	bill_19_tb: "",
	bill_20_tb: "",
	bill_21_tb: "",
	bill_22_tb: "",
	bill_23_tb: "",
	bill_24_tb: "",
	bill_custom_tb: "",
	bill_history_tb: "",
	bill_prtel_tb: "",
	commhistory_01_tb: "",
	commhistory_02_tb: "",
	commhistory_03_tb: "",
	commhistory_04_tb: "",
	commhistory_05_tb: "",
	commhistory_06_tb: "",
	commhistory_07_tb: "",
	commhistory_08_tb: "",
	commhistory_09_tb: "",
	commhistory_10_tb: "",
	commhistory_11_tb: "",
	commhistory_12_tb: "",
	disratio_tb: "",
	dl_property_tb: "",
	dummy_tel_tb: "",
	kamoku_tb: "",
	kamoku_rel_utiwake_tb: "",
	kousi_bill_01_tb: "",
	kousi_bill_02_tb: "",
	kousi_bill_03_tb: "",
	kousi_bill_04_tb: "",
	kousi_bill_05_tb: "",
	kousi_bill_06_tb: "",
	kousi_bill_07_tb: "",
	kousi_bill_08_tb: "",
	kousi_bill_09_tb: "",
	kousi_bill_10_tb: "",
	kousi_bill_11_tb: "",
	kousi_bill_12_tb: "",
	kousi_bill_13_tb: "",
	kousi_bill_14_tb: "",
	kousi_bill_15_tb: "",
	kousi_bill_16_tb: "",
	kousi_bill_17_tb: "",
	kousi_bill_18_tb: "",
	kousi_bill_19_tb: "",
	kousi_bill_20_tb: "",
	kousi_bill_21_tb: "",
	kousi_bill_22_tb: "",
	kousi_bill_23_tb: "",
	kousi_bill_24_tb: "",
	kousi_default_tb: "",
	kousi_fromtel_master_tb: "",
	kousi_rel_pact_tb: "",
	kousi_tel_bill_01_tb: "",
	kousi_tel_bill_02_tb: "",
	kousi_tel_bill_03_tb: "",
	kousi_tel_bill_04_tb: "",
	kousi_tel_bill_05_tb: "",
	kousi_tel_bill_06_tb: "",
	kousi_tel_bill_07_tb: "",
	kousi_tel_bill_08_tb: "",
	kousi_tel_bill_09_tb: "",
	kousi_tel_bill_10_tb: "",
	kousi_tel_bill_11_tb: "",
	kousi_tel_bill_12_tb: "",
	kousi_tel_bill_13_tb: "",
	kousi_tel_bill_14_tb: "",
	kousi_tel_bill_15_tb: "",
	kousi_tel_bill_16_tb: "",
	kousi_tel_bill_17_tb: "",
	kousi_tel_bill_18_tb: "",
	kousi_tel_bill_19_tb: "",
	kousi_tel_bill_20_tb: "",
	kousi_tel_bill_21_tb: "",
	kousi_tel_bill_22_tb: "",
	kousi_tel_bill_23_tb: "",
	kousi_tel_bill_24_tb: "",
	kousi_totel_master_tb: "",
	pact_rel_carrier_tb: "",
	pact_rel_shop_tb: "",
	plan_history_tb: "",
	plan_predata_tb: "",
	plan_recom_tb: "",
	recent_telcnt_tb: "",
	shop_relation_tb: "",
	tel_bill_01_tb: "",
	tel_bill_02_tb: "",
	tel_bill_03_tb: "",
	tel_bill_04_tb: "",
	tel_bill_05_tb: "",
	tel_bill_06_tb: "",
	tel_bill_07_tb: "",
	tel_bill_08_tb: "",
	tel_bill_09_tb: "",
	tel_bill_10_tb: "",
	tel_bill_11_tb: "",
	tel_bill_12_tb: "",
	tel_bill_13_tb: "",
	tel_bill_14_tb: "",
	tel_bill_15_tb: "",
	tel_bill_16_tb: "",
	tel_bill_17_tb: "",
	tel_bill_18_tb: "",
	tel_bill_19_tb: "",
	tel_bill_20_tb: "",
	tel_bill_21_tb: "",
	tel_bill_22_tb: "",
	tel_bill_23_tb: "",
	tel_bill_24_tb: "",
	tel_details_01_tb: "",
	tel_details_02_tb: "",
	tel_details_03_tb: "",
	tel_details_04_tb: "",
	tel_details_05_tb: "",
	tel_details_06_tb: "",
	tel_details_07_tb: "",
	tel_details_08_tb: "",
	tel_details_09_tb: "",
	tel_details_10_tb: "",
	tel_details_11_tb: "",
	tel_details_12_tb: "",
	tel_details_13_tb: "",
	tel_details_14_tb: "",
	tel_details_15_tb: "",
	tel_details_16_tb: "",
	tel_details_17_tb: "",
	tel_details_18_tb: "",
	tel_details_19_tb: "",
	tel_details_20_tb: "",
	tel_details_21_tb: "",
	tel_details_22_tb: "",
	tel_details_23_tb: "",
	tel_details_24_tb: "",
	tel_property_tb: "",
	tel_reserve_tb: "",
	template_tb: "",
	user_info_tb: "",
	user_info_rel_tb: "",
	card_asp_charge_tb: "",
	card_bill_01_tb: "",
	card_bill_02_tb: "",
	card_bill_03_tb: "",
	card_bill_04_tb: "",
	card_bill_05_tb: "",
	card_bill_06_tb: "",
	card_bill_07_tb: "",
	card_bill_08_tb: "",
	card_bill_09_tb: "",
	card_bill_10_tb: "",
	card_bill_11_tb: "",
	card_bill_12_tb: "",
	card_bill_13_tb: "",
	card_bill_14_tb: "",
	card_bill_15_tb: "",
	card_bill_16_tb: "",
	card_bill_17_tb: "",
	card_bill_18_tb: "",
	card_bill_19_tb: "",
	card_bill_20_tb: "",
	card_bill_21_tb: "",
	card_bill_22_tb: "",
	card_bill_23_tb: "",
	card_bill_24_tb: "",
	card_bill_history_tb: "",
	card_bill_master_tb: "",
	card_calc_state_tb: "",
	card_details_01_tb: "",
	card_details_02_tb: "",
	card_details_03_tb: "",
	card_details_04_tb: "",
	card_details_05_tb: "",
	card_details_06_tb: "",
	card_details_07_tb: "",
	card_details_08_tb: "",
	card_details_09_tb: "",
	card_details_10_tb: "",
	card_details_11_tb: "",
	card_details_12_tb: "",
	card_details_13_tb: "",
	card_details_14_tb: "",
	card_details_15_tb: "",
	card_details_16_tb: "",
	card_details_17_tb: "",
	card_details_18_tb: "",
	card_details_19_tb: "",
	card_details_20_tb: "",
	card_details_21_tb: "",
	card_details_22_tb: "",
	card_details_23_tb: "",
	card_details_24_tb: "",
	card_kamoku_tb: "",
	card_kamoku_rel_utiwake_tb: "",
	card_post_bill_01_tb: "",
	card_post_bill_02_tb: "",
	card_post_bill_03_tb: "",
	card_post_bill_04_tb: "",
	card_post_bill_05_tb: "",
	card_post_bill_06_tb: "",
	card_post_bill_07_tb: "",
	card_post_bill_08_tb: "",
	card_post_bill_09_tb: "",
	card_post_bill_10_tb: "",
	card_post_bill_11_tb: "",
	card_post_bill_12_tb: "",
	card_post_bill_13_tb: "",
	card_post_bill_14_tb: "",
	card_post_bill_15_tb: "",
	card_post_bill_16_tb: "",
	card_post_bill_17_tb: "",
	card_post_bill_18_tb: "",
	card_post_bill_19_tb: "",
	card_post_bill_20_tb: "",
	card_post_bill_21_tb: "",
	card_post_bill_22_tb: "",
	card_post_bill_23_tb: "",
	card_post_bill_24_tb: "",
	card_property_tb: "",
	card_usehistory_01_tb: "",
	card_usehistory_02_tb: "",
	card_usehistory_03_tb: "",
	card_usehistory_04_tb: "",
	card_usehistory_05_tb: "",
	card_usehistory_06_tb: "",
	card_usehistory_07_tb: "",
	card_usehistory_08_tb: "",
	card_usehistory_09_tb: "",
	card_usehistory_10_tb: "",
	card_usehistory_11_tb: "",
	card_usehistory_12_tb: "",
	card_01_tb: "",
	card_02_tb: "",
	card_03_tb: "",
	card_04_tb: "",
	card_05_tb: "",
	card_06_tb: "",
	card_07_tb: "",
	card_08_tb: "",
	card_09_tb: "",
	card_10_tb: "",
	card_11_tb: "",
	card_12_tb: "",
	card_13_tb: "",
	card_14_tb: "",
	card_15_tb: "",
	card_16_tb: "",
	card_17_tb: "",
	card_18_tb: "",
	card_19_tb: "",
	card_20_tb: "",
	card_21_tb: "",
	card_22_tb: "",
	card_23_tb: "",
	card_24_tb: "",
	card_tb: "",
	purchase_bill_01_tb: "",
	purchase_bill_02_tb: "",
	purchase_bill_03_tb: "",
	purchase_bill_04_tb: "",
	purchase_bill_05_tb: "",
	purchase_bill_06_tb: "",
	purchase_bill_07_tb: "",
	purchase_bill_08_tb: "",
	purchase_bill_09_tb: "",
	purchase_bill_10_tb: "",
	purchase_bill_11_tb: "",
	purchase_bill_12_tb: "",
	purchase_bill_13_tb: "",
	purchase_bill_14_tb: "",
	purchase_bill_15_tb: "",
	purchase_bill_16_tb: "",
	purchase_bill_17_tb: "",
	purchase_bill_18_tb: "",
	purchase_bill_19_tb: "",
	purchase_bill_20_tb: "",
	purchase_bill_21_tb: "",
	purchase_bill_22_tb: "",
	purchase_bill_23_tb: "",
	purchase_bill_24_tb: "",
	purchase_history_tb: "",
	purchase_details_01_tb: "",
	purchase_details_02_tb: "",
	purchase_details_03_tb: "",
	purchase_details_04_tb: "",
	purchase_details_05_tb: "",
	purchase_details_06_tb: "",
	purchase_details_07_tb: "",
	purchase_details_08_tb: "",
	purchase_details_09_tb: "",
	purchase_details_10_tb: "",
	purchase_details_11_tb: "",
	purchase_details_12_tb: "",
	purchase_details_13_tb: "",
	purchase_details_14_tb: "",
	purchase_details_15_tb: "",
	purchase_details_16_tb: "",
	purchase_details_17_tb: "",
	purchase_details_18_tb: "",
	purchase_details_19_tb: "",
	purchase_details_20_tb: "",
	purchase_details_21_tb: "",
	purchase_details_22_tb: "",
	purchase_details_23_tb: "",
	purchase_details_24_tb: "",
	purchase_kamoku_tb: "",
	purchase_kamoku_rel_utiwake_tb: "",
	purchase_post_bill_01_tb: "",
	purchase_post_bill_02_tb: "",
	purchase_post_bill_03_tb: "",
	purchase_post_bill_04_tb: "",
	purchase_post_bill_05_tb: "",
	purchase_post_bill_06_tb: "",
	purchase_post_bill_07_tb: "",
	purchase_post_bill_08_tb: "",
	purchase_post_bill_09_tb: "",
	purchase_post_bill_10_tb: "",
	purchase_post_bill_11_tb: "",
	purchase_post_bill_12_tb: "",
	purchase_post_bill_13_tb: "",
	purchase_post_bill_14_tb: "",
	purchase_post_bill_15_tb: "",
	purchase_post_bill_16_tb: "",
	purchase_post_bill_17_tb: "",
	purchase_post_bill_18_tb: "",
	purchase_post_bill_19_tb: "",
	purchase_post_bill_20_tb: "",
	purchase_post_bill_21_tb: "",
	purchase_post_bill_22_tb: "",
	purchase_post_bill_23_tb: "",
	purchase_post_bill_24_tb: "",
	purchase_tb: "",
	purchase_01_tb: "",
	purchase_02_tb: "",
	purchase_03_tb: "",
	purchase_04_tb: "",
	purchase_05_tb: "",
	purchase_06_tb: "",
	purchase_07_tb: "",
	purchase_08_tb: "",
	purchase_09_tb: "",
	purchase_10_tb: "",
	purchase_11_tb: "",
	purchase_12_tb: "",
	purchase_13_tb: "",
	purchase_14_tb: "",
	purchase_15_tb: "",
	purchase_16_tb: "",
	purchase_17_tb: "",
	purchase_18_tb: "",
	purchase_19_tb: "",
	purchase_20_tb: "",
	purchase_21_tb: "",
	purchase_22_tb: "",
	purchase_23_tb: "",
	purchase_24_tb: "",
	post_property_tb: ""
};
var pactid = O_db.nextID("pact_tb_pactid");
var postid = 0;

for (var cnt = 0; cnt < 25; cnt++) {
	var str = "";

	if (cnt != 0) {
		str = "_" + str_pad(cnt, 2, "0", STR_PAD_LEFT);
	}

	var postid_list = "SELECT postid,0 FROM post" + str + "_tb WHERE pactid = " + DEFPACT + " ORDER BY postid";
	H_postmap[cnt] = O_db.queryAssoc(postid_list);
	{
		let _tmp_0 = H_postmap[cnt];

		for (var key in _tmp_0) {
			var value = _tmp_0[key];
			var flag = false;

			for (var jnt = cnt - 1; jnt >= 0; jnt--) {
				if (true == (undefined !== H_postmap[jnt][key])) {
					H_postmap[cnt][key] = H_postmap[jnt][key];
					flag = true;
				}
			}

			if (flag == false) {
				H_postmap[cnt][key] = O_db.nextID("post_tb_postid");
			}
		}
	}

	if (postid == 0) {
		postid = H_postmap[cnt][key];
	}
}

var dir = "add_test_corp_" + date("Ymd");
chdir("/home/web");
mkdir(dir);
var fpall = fopen(dir + "/alldata.dump", "w");

for (var key in H_select) //pg_dump用に一時テーブルを作成
{
	var value = H_select[key];
	var get_table_keys = "SELECT * FROM " + key + " WHERE pactid = " + DEFPACT;
	var A_data = O_db.queryHash(get_table_keys);
	var fp = fopen(dir + "/" + key + ".dump", "w");
	fwrite(fp, "COPY " + key + " from STDIN;\n");
	fwrite(fpall, "COPY " + key + " from STDIN;\n");

	for (cnt = 0;; cnt < A_data.length; cnt++) {
		if (true == "pactid" in A_data[cnt]) {
			A_data[cnt].pactid = pactid;
		}

		if (true == "userid_ini" in A_data[cnt]) {
			A_data[cnt].userid_ini = "TESTCORP" + pactid;
		}

		if (true == "postid" in A_data[cnt]) {
			var ex_str = 0;

			if (true == preg_match("/_([0-9]{2})_/", key, A_temp)) {
				ex_str = +A_temp[1];
			}

			if (false == (undefined !== H_postmap[ex_str][A_data[cnt].postid])) {
				if (true == preg_match("/_(deleted)_/", key, A_temp)) {
					for (var znt = 0; znt < 25; znt++) {
						if (true == (undefined !== H_postmap[znt][A_data[cnt].postid])) {
							A_data[cnt].postid = H_postmap[znt][A_data[cnt].postid];
						}
					}
				} else {
					echo("XX:(" + ex_str + ")  postid:(" + A_data[cnt].postid + ")   table_name:(" + key + ")  \n");
					continue;
				}
			} else {
				A_data[cnt].postid = H_postmap[ex_str][A_data[cnt].postid];
			}
		}

		if (true == "postidparent" in A_data[cnt]) {
			ex_str = 0;

			if (true == preg_match("/_([0-9]{2})_/", key, A_temp)) {
				ex_str = +A_temp[1];
			}

			if (false == (undefined !== H_postmap[ex_str][A_data[cnt].postidparent])) {
				if (true == preg_match("/_(deleted)_/", key, A_temp)) {
					for (znt = 0;; znt < 25; znt++) {
						if (true == (undefined !== H_postmap[znt][A_data[cnt].postidparent])) {
							A_data[cnt].postidparent = H_postmap[znt][A_data[cnt].postidparent];
						}
					}
				} else {
					echo("XX:(" + ex_str + ")  postidparent:(" + A_data[cnt].postidparent + ")   table_name:(" + key + ")  \n");
					continue;
				}
			} else {
				A_data[cnt].postidparent = H_postmap[ex_str][A_data[cnt].postidparent];
			}
		}

		if (true == "postidchild" in A_data[cnt]) {
			ex_str = 0;

			if (true == preg_match("/_([0-9]{2})_/", key, A_temp)) {
				ex_str = +A_temp[1];
			}

			if (false == (undefined !== H_postmap[ex_str][A_data[cnt].postidchild])) {
				if (true == preg_match("/_(deleted)_/", key, A_temp)) {
					for (znt = 0;; znt < 25; znt++) {
						if (true == (undefined !== H_postmap[znt][A_data[cnt].postidchild])) {
							A_data[cnt].postidchild = H_postmap[znt][A_data[cnt].postidchild];
						}
					}
				} else {
					echo("XX:(" + ex_str + ")  postidchild:(" + A_data[cnt].postidchild + ")   table_name:(" + key + ")  \n");
					continue;
				}
			} else {
				A_data[cnt].postidchild = H_postmap[ex_str][A_data[cnt].postidchild];
			}
		}

		if (true == "compname" in A_data[cnt]) {
			A_data[cnt].compname = "\u30C6\u30B9\u30C8\u4F1A\u793E" + pactid;
		}

		if (true == "crg_post" in A_data[cnt]) {
			A_data[cnt].crg_post = "\u30C6\u30B9\u30C8crg_post";
		}

		if (true == "postname" in A_data[cnt]) {
			A_data[cnt].postname = "\u30C6\u30B9\u30C8\u90E8\u7F72" + A_data[cnt].postid;
		}

		if (true == (undefined !== A_data[cnt].username)) {
			A_data[cnt].username = "\u30C6\u30B9\u30C8\u30E6\u30FC\u30B6";
		}

		if (true == "tempid" in A_data[cnt] && key == "template_tb") {
			A_data[cnt].tempid = O_db.nextID("template_tb_tempid");
		}

		{
			let _tmp_1 = A_data[cnt];

			for (var columnname in _tmp_1) {
				var columnvalue = _tmp_1[columnname];

				if (columnvalue === undefined) {
					A_data[cnt][columnname] = "\\N";
				}

				A_data[cnt][columnname] = preg_replace("/\r/", "\\r", A_data[cnt][columnname]);
				A_data[cnt][columnname] = preg_replace("/\n/", "\\n", A_data[cnt][columnname]);
				A_data[cnt][columnname] = A_data[cnt][columnname].replace(/	/g, "\\t");

				if (columnvalue === true) {
					A_data[cnt][columnname] = "t";
				}

				if (columnvalue === false) {
					A_data[cnt][columnname] = "f";
				}
			}
		}
		fwrite(fp, A_data[cnt].join("\t") + "\n");
		fwrite(fpall, A_data[cnt].join("\t") + "\n");
	}

	fwrite(fp, "\\.");
	fwrite(fpall, "\\.\n");
	fclose(fp);
}

A_user_tb_data.pactid = pactid;
A_user_tb_data.userid = O_db.nextID("useruser_tb_userid");
A_user_tb_data.username = "\u30B9\u30FC\u30D1\u30FC\u30E6\u30FC\u30B6\u30FC";
A_user_tb_data.postid = postid;
A_user_tb_data.loginid = "testuser";
A_user_tb_data.passwd = "7f304aa6b904f5636966040d0836766c";
A_user_tb_data.type = "SU";
A_user_tb_data.mail = "\\N";
A_user_tb_data.acceptmail1 = "0";
A_user_tb_data.acceptmail2 = "0";
A_user_tb_data.acceptmail3 = "0";
A_user_tb_data.recdate = date("Y-m-d H:i:s");
A_user_tb_data.fixdate = date("Y-m-d H:i:s");
A_user_tb_data.acceptmail4 = "0";
A_user_tb_data.acceptmail5 = "0";
A_user_tb_data.zip = "\\N";
A_user_tb_data.addr1 = "\\N";
A_user_tb_data.addr2 = "\\N";
A_user_tb_data.building = "\\N";
A_user_tb_data.telno = "\\N";
A_user_tb_data.faxno = "\\N";
A_user_tb_data.passwd2nd = "\\N";
A_user_tb_data.passwd3rd = "\\N";
A_user_tb_data.passchanged = "\\N";
fp = fopen(dir + "/user_tb.dump", "w");
fwrite(fp, "COPY user_tb from STDIN;\n");
fwrite(fpall, "COPY user_tb from STDIN;\n");
fwrite(fp, A_user_tb_data.join("\t") + "\n");
fwrite(fpall, A_user_tb_data.join("\t") + "\n");
fwrite(fp, "\\.");
fwrite(fpall, "\\.\n");
fclose(fpall);