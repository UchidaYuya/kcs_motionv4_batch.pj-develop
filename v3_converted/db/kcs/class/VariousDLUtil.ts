//
//  汎用DL用関数
//  2007/12/04 houshiyama
//
//
//  電話管理ユーザー設定項目をハッシュで取得する関数
//
//
//  電話管理ユーザー設定項目をハッシュで取得する関数
//
//
//  ユーザー設定項目をハッシュで取得する関数
//
//
//  科目名をハッシュで取得する関数
//
//
//  変数項目名をハッシュで取得する関数
//
//
//  usort用比較関数
//
//
//  usort用比較関数
//
//
//  order句作成関数
//
//
//  表示順が空の時使われてない数字で表示順を埋めていく関数
//
//
//  ダウンロード時の項目名のマスター作成
//
//
//  取得データの出力関数
//
//
//  キャリアプルダウン生成関数
//
//
//  キャリアプルダウン生成関数
//
//
//  公私区分プルダウン生成関数
//
//
//  公私区分プルダウン生成関数
//
//
//  公私分計プルダウン生成関数
//
//
//  オプション表示作成関数
//引数：$options・・・シリアライズされたデータ
//	　$H_options・・・オプションマスター
//
//
//  用途部署用from句生成関数
//
//
//  用途請求情報（部署単位）用from句生成関数
//
//
//  用途請求情報（電話単位）用from句生成関数
//
//
//  用途電話情報用from句生成関数
//
//
//  用途資産情報用from句生成関数
//
//
//  用途全部用from句生成関数
//
//
//  select句作成関数
//
//
//  where句作成関数
//
//
//  区切り文字決定関数
//
//
//  文字列引用符決定関数
//
//
//重複する資産は電話の契約日が古いほうのみ残す
//
//@author houshiyama
//@since 2008/10/16
//
//@param mixed $A_data
//@access public
//@return void
//

function getPostproperty(O_db) {
	var sql = "select colid,colname from post_property_tb where pactid=" + _SESSION.pactid;
	var A_res = O_db.getSimpleHash(sql);
	var H_post_pro = {
		ptext1: "\u6587\u5B57\u52171",
		ptext2: "\u6587\u5B57\u52172",
		ptext3: "\u6587\u5B57\u52173",
		ptext4: "\u6587\u5B57\u52174",
		ptext5: "\u6587\u5B57\u52175",
		ptext6: "\u6587\u5B57\u52176",
		ptext7: "\u6587\u5B57\u52177",
		ptext8: "\u6587\u5B57\u52178",
		ptext9: "\u6587\u5B57\u52179",
		ptext10: "\u6587\u5B57\u521710",
		ptext11: "\u6587\u5B57\u521711",
		ptext12: "\u6587\u5B57\u521712",
		ptext13: "\u6587\u5B57\u521713",
		ptext14: "\u6587\u5B57\u521714",
		ptext15: "\u6587\u5B57\u521715",
		pint1: "\u6570\u50241",
		pint2: "\u6570\u50242",
		pint3: "\u6570\u50243",
		pdate1: "\u65E5\u4ED81",
		pdate2: "\u65E5\u4ED82"
	};

	for (var colnum in A_res) //文字項目
	{
		var colname = A_res[colnum];

		if (colnum >= 1 && colnum <= 15) {
			H_post_pro["ptext" + colnum] = colname;
		}

		if (colnum >= 16 && colnum <= 18) {
			H_post_pro["pint" + (colnum - 15)] = colname;
		}

		if (colnum >= 19 && colnum <= 20) {
			H_post_pro["pdate" + (colnum - 18)] = colname;
		}
	}

	return H_post_pro;
};

function getTelproperty(O_db) {
	var sql = "select colid,colname from tel_property_tb where pactid=" + _SESSION.pactid;
	var A_res = O_db.getSimpleHash(sql);
	var H_tel_pro = {
		text1: "\u6587\u5B57\u52171",
		text2: "\u6587\u5B57\u52172",
		text3: "\u6587\u5B57\u52173",
		text4: "\u6587\u5B57\u52174",
		text5: "\u6587\u5B57\u52175",
		text6: "\u6587\u5B57\u52176",
		text7: "\u6587\u5B57\u52177",
		text8: "\u6587\u5B57\u52178",
		text9: "\u6587\u5B57\u52179",
		text10: "\u6587\u5B57\u521710",
		text11: "\u6587\u5B57\u521711",
		text12: "\u6587\u5B57\u521712",
		text13: "\u6587\u5B57\u521713",
		text14: "\u6587\u5B57\u521714",
		text15: "\u6587\u5B57\u521715",
		int1: "\u6570\u50241",
		int2: "\u6570\u50242",
		int3: "\u6570\u50243",
		date1: "\u65E5\u4ED81",
		date2: "\u65E5\u4ED82"
	};

	for (var colnum in A_res) //文字項目
	{
		var colname = A_res[colnum];

		if (colnum >= 1 && colnum <= 15) {
			H_tel_pro["text" + colnum] = colname;
		}

		if (colnum >= 16 && colnum <= 18) {
			H_tel_pro["int" + (colnum - 15)] = colname;
		}

		if (colnum >= 19 && colnum <= 20) {
			H_tel_pro["date" + (colnum - 18)] = colname;
		}
	}

	return H_tel_pro;
};

function getManagementProperty(O_db, mid) {
	var sql = "select col,colname from management_property_tb where pactid=" + _SESSION.pactid + " and mid=" + mid;
	var H_res = O_db.getSimpleHash(sql);
	var H_tel_pro = {
		text1: "\u6587\u5B57\u52171",
		text2: "\u6587\u5B57\u52172",
		text3: "\u6587\u5B57\u52173",
		text4: "\u6587\u5B57\u52174",
		text5: "\u6587\u5B57\u52175",
		text6: "\u6587\u5B57\u52176",
		text7: "\u6587\u5B57\u52177",
		text8: "\u6587\u5B57\u52178",
		text9: "\u6587\u5B57\u52179",
		text10: "\u6587\u5B57\u521710",
		text11: "\u6587\u5B57\u521711",
		text12: "\u6587\u5B57\u521712",
		text13: "\u6587\u5B57\u521713",
		text14: "\u6587\u5B57\u521714",
		text15: "\u6587\u5B57\u521715",
		int1: "\u6570\u50241",
		int2: "\u6570\u50242",
		int3: "\u6570\u50243",
		int4: "\u6570\u50244",
		int5: "\u6570\u50245",
		int6: "\u6570\u50246",
		date1: "\u65E5\u4ED81",
		date2: "\u65E5\u4ED82",
		date3: "\u65E5\u4ED83",
		date4: "\u65E5\u4ED84",
		date5: "\u65E5\u4ED85",
		date6: "\u65E5\u4ED86",
		mail1: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B91",
		mail2: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B92",
		mail3: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B93",
		url1: "URL1",
		url2: "URL2",
		url3: "URL3"
	};

	for (var tcol in H_tel_pro) {
		var tcolname = H_tel_pro[tcol];

		for (var col in H_res) {
			var colname = H_res[col];

			if (tcol == col) {
				H_tel_pro[tcol] = colname;
			}
		}
	}

	return H_tel_pro;
};

function getKamokuHash(O_db, use = "") //部署単位か電話単位か？
//pactを絞る
//ソート
//kamoku_tbは科目は0から始まるが、bill_X_tbでは1から始まるためひとつずつずらす
//かつ用途別文字列を先頭にくっつける
{
	var str = "";

	if (use == "bill") {
		str = "BX_";
	} else if (use == "telbill") {
		str = "TBX_";
	}

	var sql = "select pactid,'kamoku' || kamokuid as kamoku,kamokuname from kamoku_tb where pactid in (0," + _SESSION.pactid + ") order by pactid";
	var A_kamoku = O_db.getHash(sql);
	var org_kamoku = false;
	var H_kamoku_tmp = Array();
	var H_kamoku = {
		[str + "kamoku1"]: "\u79D1\u76EE1",
		[str + "kamoku2"]: "\u79D1\u76EE2",
		[str + "kamoku3"]: "\u79D1\u76EE3",
		[str + "kamoku4"]: "\u79D1\u76EE4",
		[str + "kamoku5"]: "\u79D1\u76EE5",
		[str + "kamoku6"]: "\u79D1\u76EE6",
		[str + "kamoku7"]: "\u79D1\u76EE7",
		[str + "kamoku8"]: "\u79D1\u76EE8",
		[str + "kamoku9"]: "\u79D1\u76EE9",
		[str + "kamoku10"]: "\u79D1\u76EE10"
	};
	var default = G_KAMOKU_DEFAULT + 1;
	H_kamoku[str + "kamoku" + default] = G_KAMOKU_DEFAULT_LABEL;

	for (var cnt = 0; cnt < A_kamoku.length; cnt++) //独自の科目設定があるか調べる（あったらカウントを0に戻す）
	{
		if (A_kamoku[cnt].pactid != 0 && org_kamoku == false) {
			org_kamoku = true;
			cnt = 0;
		}

		if (org_kamoku == true) //自分のpactidのみ使う
			{
				if (A_kamoku[cnt].pactid == _SESSION.pactid) {
					H_kamoku_tmp[A_kamoku[cnt].kamoku] = A_kamoku[cnt].kamokuname;
				}
			} else //0のpactidのみ使う
			{
				if (A_kamoku[cnt].pactid == 0) {
					H_kamoku_tmp[A_kamoku[cnt].kamoku] = A_kamoku[cnt].kamokuname;
				}
			}
	}

	ksort(H_kamoku_tmp);

	for (var key in H_kamoku_tmp) {
		var val = H_kamoku_tmp[key];
		H_kamoku[str + preg_replace("/" + key.substr(6, 1) + "$/", key.substr(6, 1) + 1, key)] = val;
	}

	return H_kamoku;
};

function getFormulaHash(O_db, use = "") //部署単位か電話単位か？
//返り値となるハッシュ
{
	var str = "";

	if (use == "bill") {
		str = "BX_";
	} else if (use == "telbill") {
		str = "TBX_";
	}

	var sql = "select '" + str + "' || code as code,label from summary_formula_tb where pactid = " + _SESSION.pactid + " and code not like 'kamoku%'";
	var H_formula_tmp = O_db.getSimpleHash(sql);
	var H_formula = {
		[str + "calc1"]: "\u5909\u6570\u9805\u76EE1",
		[str + "calc2"]: "\u5909\u6570\u9805\u76EE2",
		[str + "cond1"]: "\u5909\u6570\u9805\u76EE3",
		[str + "cond2"]: "\u5909\u6570\u9805\u76EE4",
		[str + "cond3"]: "\u5909\u6570\u9805\u76EE5",
		[str + "sum1"]: "\u5408\u8A08\u9805\u76EE1",
		[str + "sum2"]: "\u5408\u8A08\u9805\u76EE2",
		[str + "sum3"]: "\u5408\u8A08\u9805\u76EE3"
	};

	for (var key in H_formula_tmp) {
		var val = H_formula_tmp[key];
		H_formula[key] = H_formula_tmp[key];
	}

	return H_formula;
};

function fncUsortView(A_1, A_2) {
	if (A_1.view_order == A_2.view_order) {
		return 0;
	}

	if (A_1.view_order > A_2.view_order) {
		return 1;
	}

	if (A_1.view_order < A_2.view_order) {
		return -1;
	}
};

function fncUsortSort(A_1, A_2) {
	if (A_1.sort_order == A_2.sort_order) {
		return 0;
	}

	if (A_1.sort_order > A_2.sort_order) {
		return 1;
	}

	if (A_1.sort_order < A_2.sort_order) {
		return -1;
	}
};

function makeOrderBy(H_order) //名前とマスターのキー対応配列
//ソートは名前ではなくマスターのキーで
{
	var H_replace = {
		userpostid: "postid",
		carname: "carid",
		arname: "arid",
		cirname: "cirid",
		planname: "planid",
		packetname: "packetid",
		telno_view: "telno"
	};
	var order = " order by " + H_order.join(",");

	for (var name in H_replace) {
		var id = H_replace[name];
		order = preg_replace("/\\." + name + "/", "." + id, order);
	}

	return order;
};

function setOrderNum(H_res) //表示順で使われた数字を取得
//表示順が空の要素に順に表示順を入れてく
{
	var A_nums = Array();
	var max_num = 1;

	for (var cnt = 0; cnt < H_res.length; cnt++) //表示順が入っているか？
	{
		if (H_res[cnt].view_order != "") {
			A_nums.push(H_res[cnt].view_order);
		}

		if (H_res[cnt].view_order > max_num) {
			max_num = H_res[cnt].view_order;
		}
	}

	var v_cnt = max_num + 1;

	for (cnt = 0;; cnt < H_res.length; cnt++) //表示順が空の時使ってない数字で埋める
	{
		if (H_res[cnt].view_order == "") //入力で使われてない数値
			{
				H_res[cnt].view_order = v_cnt;
				v_cnt++;
			}
	}

	return H_res;
};

function makeHeaderView(O_db) //タイトル行用配列
//ユーザー設定項目名取得
//科目名取得
//タイトル行用配列と合体
{
	var H_name = {
		postid: "\u30B7\u30B9\u30C6\u30E0\u90E8\u7F72ID",
		userpostid: "\u90E8\u7F72ID",
		postname: "\u90E8\u7F72\u540D\u79F0",
		postidparent: "\u30B7\u30B9\u30C6\u30E0\u6240\u5C5E\u90E8\u7F72ID",
		userpostidparent: "\u6240\u5C5E\u90E8\u7F72ID",
		postnameparent: "\u6240\u5C5E\u90E8\u7F72\u540D\u79F0",
		zip: "\u90F5\u4FBF\u756A\u53F7",
		addr1: "\u4F4F\u6240\uFF08\u90FD\u9053\u5E9C\u770C\uFF09",
		addr2: "\u4F4F\u6240",
		building: "\u5EFA\u7269",
		telno: "\u9867\u5BA2\u96FB\u8A71\u756A\u53F7",
		faxno: "\u9867\u5BA2FAX\u756A\u53F7",
		telno_view: "\u96FB\u8A71\u756A\u53F7",
		uname: "\u8ACB\u6C42\u95B2\u89A7\u8005",
		carname: "\u30AD\u30E3\u30EA\u30A2",
		arname: "\u5730\u57DF\u4F1A\u793E",
		buyselname: "\u8CFC\u5165\u65B9\u5F0F",
		cirname: "\u56DE\u7DDA\u7A2E\u5225",
		assetsno: "\u7BA1\u7406\u756A\u53F7",
		assetstypeid: "\u8CC7\u7523\u7A2E\u5225",
		productname: "\u6A5F\u7A2E",
		property: "\u8272",
		serialno: "\u88FD\u9020\u756A\u53F7",
		smpcirname: "\u7AEF\u672B\u7A2E\u5225",
		bought_date: "\u6A5F\u7A2E\u8CFC\u5165\u65E5",
		bought_price: "\u53D6\u5F97\u4FA1\u683C",
		pay_startdate: "\u5272\u8CE6\u958B\u59CB\u6708",
		pay_frequency: "\u5272\u8CE6\u56DE\u6570",
		pay_monthly_sum: "\u5272\u8CE6\u6708\u984D",
		firmware: "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2",
		version: "\u30D0\u30FC\u30B8\u30E7\u30F3",
		accessory: "\u4ED8\u5C5E\u54C1",
		planname: "\u6599\u91D1\u30D7\u30E9\u30F3",
		packetname: "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF",
		pointname: "\u30DD\u30A4\u30F3\u30C8\u30B9\u30C6\u30FC\u30B8",
		discounts: "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9",
		options: "\u30AA\u30D7\u30B7\u30E7\u30F3",
		employeecode: "\u793E\u54E1\u756A\u53F7",
		username: "\u4F7F\u7528\u8005",
		mail: "\u643A\u5E2F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
		orderdate: "\u6A5F\u7A2E\u8CFC\u5165\u65E5",
		memo: "\u30E1\u30E2",
		username_kana: "\u4F7F\u7528\u8005\u540D\uFF08\u304B\u306A\uFF09",
		simcardno: "SIM\u30AB\u30FC\u30C9\u756A\u53F7",
		contractdate: "\u5951\u7D04\u65E5",
		phone: "\u8ACB\u6C42\u53F0\u6570",
		point: "\u30DD\u30A4\u30F3\u30C8",
		charge: "\u7DCF\u984D",
		excise: "\u6D88\u8CBB\u7A0E",
		aspcharge: "ASP\u4F7F\u7528\u6599\u91D1",
		aspexcise: "ASP\u6D88\u8CBB\u7A0E",
		publiccharge: "\u516C\u7528\u6599\u91D1",
		publictax: "\u516C\u7528\u6599\u91D1\u6D88\u8CBB\u7A0E",
		privatecharge: "\u79C1\u7528\u6599\u91D1",
		privatetax: "\u79C1\u7528\u6599\u91D1\u6D88\u8CBB\u7A0E",
		kousiflg: "\u516C\u79C1\u533A\u5206",
		kousibunkei: "\u516C\u79C1\u5206\u8A08",
		patternname: "\u516C\u79C1\u5206\u8A08\u30D1\u30BF\u30FC\u30F3"
	};
	var H_post_pro = getPostproperty(O_db);

	if (true == GLOBALS.v3_flg) {
		var H_tel_pro = getManagementProperty(O_db, 1);
	} else {
		H_tel_pro = getTelproperty(O_db);
	}

	var H_kamoku = getKamokuHash(O_db);
	var H_formula = getFormulaHash(O_db);
	H_name = array_merge(H_name, H_post_pro);
	H_name = array_merge(H_name, H_tel_pro);
	H_name = array_merge(H_name, H_kamoku);
	H_name = array_merge(H_name, H_formula);
	return H_name;
};

function outputResult(H_res, textize, separator, H_options) //置換用配列
//結果をループ
{
	var H_strtr = {
		"\"": "\u201D",
		"\t": " ",
		"\r\n": " ",
		"\r": " ",
		"\n": " "
	};

	for (var cnt = 0; cnt < H_res.length; cnt++) //ダミー回線の電話番号は表示しない
	//出力
	{
		var A_line = Array();

		if (undefined !== H_res[cnt].dummy_flg == true && H_res[cnt].dummy_flg == "t") {
			H_res[cnt].telno_view = "";
		}

		{
			let _tmp_0 = H_res[cnt];

			for (var key in _tmp_0) //ダミーフラグ、システム日付（contractdate）は評価用なので表示は無し
			{
				var val = _tmp_0[key];

				if (key == "dummy_flg" || key == "sysdate" || key == "sysno") {
					continue;
				}

				if (val != "") {
					if (key == "options") {
						var val = makeOptionView(val, H_options);
					}

					if (key == "discounts") {
						val = makeOptionView(val, H_options);
					}

					if (preg_match("/date/", key) == true) {
						val = val.substr(0, 4) + "/" + val.substr(5, 2) + "/" + val.substr(8, 2);
					}
				}

				val = strtr(val, H_strtr);
				A_line.push(textize + val + textize);
			}
		}

		if (DEBUG != 1) //区切り文字で繋ぐ
			//sjisに変換
			{
				var output = A_line.join(separator) + "\n";
				output = mb_convert_encoding(output, "SJIS-win", "UTF-8");
				echo(output);
			} else //区切り文字で繋ぐ
			{
				output = "<tr><td nowrap>" + A_line.join("</td><td nowrap>" + separator) + "</td></tr>";
				echo(output);
			}

		delete output;
	}

	if (DEBUG == 1) {
		echo("</table>");
	}
};

function makeCarrierSelect() //キャリアプルダウン用
{
	var H_carrier = {
		"": ""
	};
	var sql = "select ca.carid,ca.carname from carrier_tb as ca " + " left outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + _SESSION.pactid + ") as pr on ca.carid = pr.carid " + " where (pr.relation_flg = true) or (ca.defaultflg = true and pr.pactid is null) " + " order by ca.sort";
	var H_tmp = GLOBALS.GO_db.getSimpleHash(sql);
	H_carrier = H_carrier + H_tmp;
	return H_carrier;
};

function makeCircuitSelect() //キャリアプルダウン用
{
	var H_circuit = {
		"": ""
	};
	var sql = "select ci.cirname,ci.cirname as cir from circuit_tb as ci " + " where carid in (select ca.carid from carrier_tb as ca " + " left outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + _SESSION.pactid + ") as pr on ca.carid = pr.carid " + " where (pr.relation_flg = true) or (ca.defaultflg = true and pr.pactid is null)) " + " group by ci.cirname" + " order by ci.cirname";
	H_circuit = array_merge(H_circuit, GLOBALS.GO_db.getSimpleHash(sql));
	return H_circuit;
};

function makeKousikubunSelect() {
	var H_kubun = {
		"": "",
		"2": "\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09",
		"0": "\u516C\u79C1\u5206\u8A08\u3059\u308B",
		"1": "\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044"
	};
	return H_kubun;
};

function makeKousipatternSelect() //SQL文
{
	var H_pattern = {
		"": ""
	};
	var sql = "select kp.patternname,kp.patternname as pattern" + " from kousi_rel_pact_tb krp inner join kousi_pattern_tb kp on krp.patternid = kp.patternid " + " where krp.pactid = " + _SESSION.pactid + " " + " order by krp.patternid";
	H_pattern = array_merge(H_pattern, GLOBALS.GO_db.getSimpleHash(sql));
	return H_pattern;
};

function makeKousibunkeiSelect() {
	var H_kousi = {
		"": "",
		"1": "\u5BFE\u8C61\u5916",
		"2": "\u81EA\u52D5\u8A08\u7B97",
		"3": "\u7DE8\u96C6\u4E2D",
		"4": "\u78BA\u5B9A\u6E08"
	};
	return H_kousi;
};

function makeOptionView(options, H_options) //オプションを分解
{
	var H_res = Array();
	var H_data = unserialize(options);

	if (Array.isArray(H_data) == true) {
		for (var key in H_data) {
			var val = H_data[key];

			if (key != -1) {
				H_res.push(H_options[key]);
			}
		}

		var res = H_res.join("|");
		return res;
	}
};

function makePostFrom(post_X_tb, post_relation_X_tb) //from句作成
{
	var from = " from " + post_X_tb + " left outer join " + post_relation_X_tb + " on " + post_X_tb + ".postid = " + post_relation_X_tb + ".postidchild" + " left outer join " + post_X_tb + " as " + post_X_tb + "2 on " + post_X_tb + "2.postid = " + post_relation_X_tb + ".postidparent";
	return from;
};

function makeBillFrom(post_X_tb, bill_X_tb, kousi_bill_X_tb, summary_bill_X_tb) //from句作成
{
	var from = " from " + bill_X_tb + " left outer join " + post_X_tb + " on " + post_X_tb + ".postid = " + bill_X_tb + ".postid" + " left outer join carrier_tb on " + bill_X_tb + ".carid = carrier_tb.carid" + " left outer join " + kousi_bill_X_tb + " on " + bill_X_tb + ".postid = " + kousi_bill_X_tb + ".postid" + " and " + bill_X_tb + ".flag = " + kousi_bill_X_tb + ".flag" + " and " + bill_X_tb + ".carid = " + kousi_bill_X_tb + ".carid" + " left outer join " + summary_bill_X_tb + " on " + bill_X_tb + ".postid = " + summary_bill_X_tb + ".postid" + " and " + bill_X_tb + ".flag = " + summary_bill_X_tb + ".flag" + " and " + bill_X_tb + ".carid = " + summary_bill_X_tb + ".carid";
	return from;
};

function makeTelBillFrom(post_X_tb, tel_X_tb, tel_bill_X_tb, kousi_tel_bill_X_tb, summary_tel_bill_X_tb, kousiflg) //from句作成
{
	var from = " from " + tel_bill_X_tb + " left outer join " + post_X_tb + " on " + post_X_tb + ".postid = " + tel_bill_X_tb + ".postid" + " left outer join " + tel_X_tb + " on " + tel_X_tb + ".telno = " + tel_bill_X_tb + ".telno" + " and " + tel_bill_X_tb + ".postid = " + tel_X_tb + ".postid" + " and " + tel_bill_X_tb + ".carid = " + tel_X_tb + ".carid" + " left outer join carrier_tb on " + tel_bill_X_tb + ".carid = carrier_tb.carid" + " left outer join " + kousi_tel_bill_X_tb + " on " + tel_bill_X_tb + ".postid = " + kousi_tel_bill_X_tb + ".postid" + " and " + tel_bill_X_tb + ".telno = " + kousi_tel_bill_X_tb + ".telno" + " and " + tel_bill_X_tb + ".carid = " + kousi_tel_bill_X_tb + ".carid" + " left outer join " + summary_tel_bill_X_tb + " on " + tel_bill_X_tb + ".postid = " + summary_tel_bill_X_tb + ".postid" + " and " + tel_bill_X_tb + ".telno = " + summary_tel_bill_X_tb + ".telno" + " and " + tel_bill_X_tb + ".carid = " + summary_tel_bill_X_tb + ".carid";

	if (kousiflg == true) {
		from += " left outer join kousi_pattern_tb on " + tel_X_tb + ".kousiptn = kousi_pattern_tb.patternid" + " left outer join kousi_default_tb on " + tel_X_tb + ".pactid = kousi_default_tb.pactid" + " and " + tel_X_tb + ".carid = kousi_default_tb.carid" + " left join kousi_pattern_tb as kousi_pattern_default_tb on kousi_default_tb.patternid = kousi_pattern_default_tb.patternid";
	}

	return from;
};

function makeTelFrom(post_X_tb, tel_X_tb, assets_X_tb, tel_rel_assets_X_tb) //from句作成
{
	var from = " from " + tel_X_tb + " left outer join carrier_tb on carrier_tb.carid = " + tel_X_tb + ".carid" + " left outer join " + post_X_tb + " on " + post_X_tb + ".postid = " + tel_X_tb + ".postid" + " left outer join area_tb on area_tb.arid = " + tel_X_tb + ".arid" + " left outer join buyselect_tb on buyselect_tb.buyselid = " + tel_X_tb + ".buyselid" + " left outer join circuit_tb on circuit_tb.cirid = " + tel_X_tb + ".cirid" + " left outer join plan_tb on plan_tb.planid = " + tel_X_tb + ".planid" + " left outer join user_tb on user_tb.userid = " + tel_X_tb + ".userid" + " left outer join packet_tb on packet_tb.packetid = " + tel_X_tb + ".packetid" + " left outer join point_tb on point_tb.pointid = " + tel_X_tb + ".pointstage" + " left outer join kousi_pattern_tb on kousi_pattern_tb.patternid = " + tel_X_tb + ".kousiptn " + " left outer join " + tel_rel_assets_X_tb + " on " + tel_X_tb + ".pactid = " + tel_rel_assets_X_tb + ".pactid " + " and " + tel_X_tb + ".telno = " + tel_rel_assets_X_tb + ".telno and " + tel_X_tb + ".carid = " + tel_rel_assets_X_tb + ".carid " + " left outer join " + assets_X_tb + " on " + tel_rel_assets_X_tb + ".assetsid = " + assets_X_tb + ".assetsid " + " and " + assets_X_tb + ".delete_flg=false " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid = " + assets_X_tb + ".smpcirid";
	return from;
};

function makeAssetsFrom(post_X_tb, tel_X_tb, assets_X_tb, tel_rel_assets_X_tb) //from句作成
{
	var from = " from " + assets_X_tb + " left outer join " + tel_rel_assets_X_tb + " on " + assets_X_tb + ".assetsid = " + tel_rel_assets_X_tb + ".assetsid " + " left outer join " + tel_X_tb + " on " + tel_rel_assets_X_tb + ".pactid = " + assets_X_tb + ".pactid " + " and " + tel_X_tb + ".telno = " + tel_rel_assets_X_tb + ".telno and " + tel_X_tb + ".carid = " + tel_rel_assets_X_tb + ".carid " + " left outer join carrier_tb on carrier_tb.carid = " + tel_X_tb + ".carid" + " left outer join " + post_X_tb + " on " + post_X_tb + ".postid = " + assets_X_tb + ".postid" + " left outer join area_tb on area_tb.arid = " + tel_X_tb + ".arid" + " left outer join buyselect_tb on buyselect_tb.buyselid = " + tel_X_tb + ".buyselid" + " left outer join circuit_tb on circuit_tb.cirid = " + tel_X_tb + ".cirid" + " left outer join plan_tb on plan_tb.planid = " + tel_X_tb + ".planid" + " left outer join user_tb on user_tb.userid = " + tel_X_tb + ".userid" + " left outer join packet_tb on packet_tb.packetid = " + tel_X_tb + ".packetid" + " left outer join point_tb on point_tb.pointid = " + tel_X_tb + ".pointstage" + " left outer join kousi_pattern_tb on kousi_pattern_tb.patternid = " + tel_X_tb + ".kousiptn " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid = " + assets_X_tb + ".smpcirid" + " left outer join assets_type_tb as att1 on " + assets_X_tb + ".assetstypeid=att1.assetstypeid " + " and " + assets_X_tb + ".pactid=att1.pactid " + " left outer join assets_type_tb as att2 on " + assets_X_tb + ".assetstypeid=att2.assetstypeid " + " and att2.pactid=0 ";
	return from;
};

function makeTelAllFrom(post_X_tb, post_relation_X_tb, tel_X_tb, bill_X_tb, tel_bill_X_tb, kousi_bill_X_tb, kousi_tel_bill_X_tb, summary_bill_X_tb, summary_tel_bill_X_tb, assets_X_tb, tel_rel_assets_X_tb, kousiflg) //from句作成
{
	var from = " from " + post_X_tb + " left outer join " + post_relation_X_tb + " on " + post_X_tb + ".postid = " + post_relation_X_tb + ".postidchild" + " left outer join " + post_X_tb + " as " + post_X_tb + "2 on " + post_X_tb + "2.postid = " + post_relation_X_tb + ".postidparent" + " left outer join " + tel_X_tb + " on " + post_X_tb + ".postid = " + tel_X_tb + ".postid" + " left outer join " + bill_X_tb + " on " + tel_X_tb + ".postid = " + bill_X_tb + ".postid" + " and " + bill_X_tb + ".carid = " + tel_X_tb + ".carid" + " left outer join " + tel_bill_X_tb + " on " + tel_X_tb + ".telno = " + tel_bill_X_tb + ".telno" + " and " + tel_X_tb + ".postid=" + tel_bill_X_tb + ".postid" + " and " + tel_X_tb + ".carid=" + tel_bill_X_tb + ".carid " + " left outer join carrier_tb on carrier_tb.carid = " + tel_X_tb + ".carid" + " left outer join area_tb on area_tb.arid = " + tel_X_tb + ".arid" + " left outer join buyselect_tb on buyselect_tb.buyselid = " + tel_X_tb + ".buyselid" + " left outer join circuit_tb on circuit_tb.cirid = " + tel_X_tb + ".cirid" + " left outer join plan_tb on plan_tb.planid = " + tel_X_tb + ".planid" + " left outer join user_tb on user_tb.userid = " + tel_X_tb + ".userid" + " left outer join packet_tb on packet_tb.packetid = " + tel_X_tb + ".packetid" + " left outer join point_tb on point_tb.pointid = " + tel_X_tb + ".pointstage" + " left outer join " + kousi_bill_X_tb + " on " + post_X_tb + ".postid = " + kousi_bill_X_tb + ".postid" + " and " + bill_X_tb + ".flag = " + kousi_bill_X_tb + ".flag" + " and " + bill_X_tb + ".carid = " + kousi_bill_X_tb + ".carid" + " left outer join " + kousi_tel_bill_X_tb + " on " + tel_bill_X_tb + ".postid = " + kousi_tel_bill_X_tb + ".postid" + " and " + tel_bill_X_tb + ".telno = " + kousi_tel_bill_X_tb + ".telno" + " and " + tel_bill_X_tb + ".carid = " + kousi_tel_bill_X_tb + ".carid" + " left outer join " + summary_bill_X_tb + " on " + bill_X_tb + ".postid = " + summary_bill_X_tb + ".postid" + " and " + bill_X_tb + ".flag = " + summary_bill_X_tb + ".flag" + " and " + bill_X_tb + ".carid = " + summary_bill_X_tb + ".carid" + " left outer join " + summary_tel_bill_X_tb + " on " + tel_bill_X_tb + ".postid = " + summary_tel_bill_X_tb + ".postid" + " and " + tel_bill_X_tb + ".telno = " + summary_tel_bill_X_tb + ".telno" + " and " + tel_bill_X_tb + ".carid = " + summary_tel_bill_X_tb + ".carid" + " left outer join " + tel_rel_assets_X_tb + " on " + tel_X_tb + ".pactid = " + tel_rel_assets_X_tb + ".pactid " + " and " + tel_X_tb + ".telno = " + tel_rel_assets_X_tb + ".telno and " + tel_X_tb + ".carid = " + tel_rel_assets_X_tb + ".carid " + " left outer join " + assets_X_tb + " on " + tel_rel_assets_X_tb + ".assetsid = " + assets_X_tb + ".assetsid " + " and " + assets_X_tb + ".delete_flg=false " + " left outer join smart_circuit_tb on smart_circuit_tb.smpcirid = " + assets_X_tb + ".smpcirid";

	if (kousiflg == true) {
		from += " left outer join kousi_pattern_tb on " + tel_X_tb + ".kousiptn = kousi_pattern_tb.patternid" + " left outer join kousi_default_tb on " + tel_X_tb + ".pactid = kousi_default_tb.pactid" + " and " + tel_X_tb + ".carid = kousi_default_tb.carid" + " left join kousi_pattern_tb as kousi_pattern_default_tb on kousi_default_tb.patternid = kousi_pattern_default_tb.patternid";
	} else {
		from += " left outer join kousi_pattern_tb on kousi_pattern_tb.patternid = " + tel_X_tb + ".kousiptn";
	}

	return from;
};

function makeSelect(A_columns, A_heads, tb_name, H_res, tel_X_tb, post_X_tb, assets_X_tb, H_name, H_kousi_label, kousiflg) //公私分計変数
//エイリアスの特別処理
//所属部署ID
{
	H_kousi_label = {
		label_not_use: "\u5BFE\u8C61\u5916",
		label_not_com: "\u81EA\u52D5\u8A08\u7B97",
		label_edit: "\u7DE8\u96C6\u4E2D",
		label_fix: "\u78BA\u5B9A\u6E08",
		label_else: "",
		no_not_use: "1",
		no_not_com: "2",
		no_edit: "3",
		no_fix: "4",
		no_else: ""
	};

	if (H_res.col_name == "userpostidparent") {
		A_heads.push(H_name[H_res.col_name]);
		A_columns.push(post_X_tb + "2.userpostid as userpostidparent");
	} else if (H_res.col_name == "postnameparent") {
		A_heads.push(H_name[H_res.col_name]);
		A_columns.push(post_X_tb + "2.postname as postnameparent");
	} else if (H_res.col_name == "uname") {
		A_heads.push(H_name[H_res.col_name]);
		A_columns.push("user_tb.username as uname");
	} else if (H_res.col_name == "kousiflg") {
		sel_str += " case when " + tel_X_tb + ".kousiflg = '0' then '\u516C\u79C1\u5206\u8A08\u3059\u308B'" + " when " + tel_X_tb + ".kousiflg = '1' then '\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044'" + " when " + tel_X_tb + ".kousiflg is null then '\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09' end ";
		A_columns.push(sel_str);
		A_heads.push(H_name[H_res.col_name]);
	} else if (H_res.col_name == "kousibunkei") //公私締日より後
		//select部分
		{
			kousiflg = true;
			var sql = "select coalesce(kousilimitday,0) from pact_tb where pactid=" + _SESSION.pactid;
			var kousilimitday = GLOBALS.GO_db.getAll(sql);

			if (date("j") > kousilimitday) {
				H_kousi_label.label_else = H_kousi_label.label_edit;
				H_kousi_label.no_else = H_kousi_label.no_edit;
			} else {
				H_kousi_label.label_else = H_kousi_label.label_fix;
				H_kousi_label.no_else = H_kousi_label.no_fix;
			}

			A_heads.push(H_name[H_res.col_name]);
			var sel_str = "case" + " when coalesce(" + tel_X_tb + ".kousiflg,'1') = '1' then '" + H_kousi_label.label_not_use + "'" + " when (case" + " when kousi_pattern_tb.patternid is null then kousi_pattern_default_tb.patternid" + " else kousi_pattern_tb.patternid end) not in" + " (select patternid from kousi_pattern_tb where coalesce(comhistflg,'0')='1') then '" + H_kousi_label.label_not_com + "'" + " when coalesce(" + tel_X_tb + ".kousi_fix_flg,0) = 2 then '" + H_kousi_label.label_edit + "'" + " when coalesce(" + tel_X_tb + ".kousi_fix_flg,0) = 1 then '" + H_kousi_label.label_fix + "'" + " else '" + H_kousi_label.label_else + "'" + " end as kousibunkei";
			A_columns.push(sel_str);
		} else if (H_res.col_name == "assetstypeid") {
		sel_str = "case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end as assetstypename";
		A_columns.push(sel_str);
		A_heads.push(H_name[H_res.col_name]);
	} else //請求部署（電話単位）は部署単位とカラム名がかぶるため別名を付ける
		{
			if (preg_match("/tel_bill_X_tb$/", H_res.tb_name) == true && H_res.download_type == "all") {
				A_heads.push(H_name[H_res.col_name]);
				A_columns.push(tb_name + "." + H_res.col_name + " as " + H_res.col_name + "_b");
			} else {
				A_heads.push(H_name[H_res.col_name]);
				A_columns.push(tb_name + "." + H_res.col_name);
			}
		}
};

function makeWhere(A_where, tb, tel_X_tb, H_res, A_integer, H_kousi_label) //公私分計の絞り込みは特別処理
{
	if (H_res.col_name == "kousibunkei") {
		var where_str = "case" + " when coalesce(" + tel_X_tb + ".kousiflg,'1') = '1' then " + H_kousi_label.no_not_use + " when (case" + " when kousi_pattern_tb.patternid is null then kousi_pattern_default_tb.patternid" + " else kousi_pattern_tb.patternid end) not in" + " (select patternid from kousi_pattern_tb where coalesce(comhistflg,'0')='1') then '" + H_kousi_label.no_not_com + "'" + " when coalesce(" + tel_X_tb + ".kousi_fix_flg,0) = 2 then " + H_kousi_label.no_edit + " when coalesce(" + tel_X_tb + ".kousi_fix_flg,0) = 1 then " + H_kousi_label.no_fix + " else " + H_kousi_label.no_else + " end " + H_res.sign + H_res.value;
		A_where.push(where_str);
	} else if (H_res.col_name == "carname") {
		A_where.push(tb + ".carid" + H_res.sign + H_res.value);
	} else //telno_viewのwhere句はtel_tbのtelno
		{
			if (H_res.col_name == "telno_view") {
				H_res.col_name = "telno";
				H_res.value = H_res.value.replace(/-|(|)/g, "");
			}

			if (preg_match("/^\\*/", H_res.value) == true && preg_match("/\\*$/", H_res.value) == true) {
				H_res.value = H_res.value.replace(/^\*/g, "%");
				H_res.value = H_res.value.replace(/\*$/g, "%");
				H_res.sign = H_res.sign.replace(/^=/g, " like ");
				A_where.push(tb + "." + H_res.col_name + H_res.sign + "'" + H_res.value + "'");
			} else if (preg_match("/\\*$/", H_res.value) == true) {
				H_res.sign = H_res.sign.replace(/^=/g, " like ");
				A_where.push(tb + "." + H_res.col_name + H_res.sign + "'" + H_res.value.replace(/\*$/g, "%") + "'");
			} else if (preg_match("/^\\*/", H_res.value) == true) {
				H_res.sign = H_res.sign.replace(/^=/g, " like ");
				A_where.push(tb + "." + H_res.col_name + H_res.sign + "'" + H_res.value.replace(/^\*/g, "%") + "'");
			} else //対象カラムが数値型の時
				{
					if (-1 !== A_integer.indexOf(H_res.col_name) == true) {
						A_where.push(tb + "." + H_res.col_name + H_res.sign + H_res.value);
					} else {
						A_where.push(tb + "." + H_res.col_name + H_res.sign + "'" + H_res.value + "'");
					}
				}
		}
};

function resSeparator(data) {
	if (data == "comma") {
		var separator = ",";
	} else if (data == "tab") {
		separator = "\t";
	} else {
		separator = " ";
	}

	return separator;
};

function resTextize(data) {
	if (data == "single") {
		var textize = "'";
	} else if (data == "double") {
		textize = "\"";
	} else {
		textize = "";
	}

	return textize;
};

function deleteDupliAssets(A_data) //まず重複の管理番号を調べる
//重複削除
//自前ソート（空き番埋め）
{
	var A_assetsno = Array();
	var A_delkey = Array();

	for (var cnt = 0; cnt < A_data.length; cnt++) {
		if (A_data[cnt].sysno != "") {
			if (-1 !== A_assetsno.indexOf(A_data[cnt].sysno + "") == false) {
				A_assetsno.push(A_data[cnt].sysno);
			} else //重複している番号ならば電話の日付を調べる
				{
					for (var dcnt = 0; dcnt < A_data.length; dcnt++) //同じ番号のデータが来たら比較
					{
						if (A_data[cnt].sysno == A_data[dcnt].sysno) //日付が古い方を残す（新しい方のキーは消す用の配列へ）
							{
								if (A_data[cnt].sysdate < A_data[dcnt].sysdate) {
									A_delkey.push(dcnt);
								} else {
									A_delkey.push(cnt);
								}

								break;
							}
					}
				}
		}
	}

	for (cnt = 0;; cnt < A_delkey.length; cnt++) {
		delete A_data[A_delkey[cnt]];
	}

	var A_res = Array();

	for (cnt = 0;; cnt < A_data.length; cnt++) {
		if (A_data[cnt] != undefined) {
			A_res.push(A_data[cnt]);
		}
	}

	return A_res;
};