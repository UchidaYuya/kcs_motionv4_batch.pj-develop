//
//ユーティリティ・クラス(管理者用)
//
//2005.01.10 by suehiro blockHTML → htmlspecialchars 指摘により変更
//2005.01.10 by suehiro 不要ロジック count($O_result) を指摘により削除
//2005.03.25 by maeda 請求情報カスタマイズ設定ＵＩ(チェックボックス) makeBillCustomSelecter を追加
//2005.06.30 by maeda makeBillCustomSelecter にtype引数を追加
//
//@since 2004/08/12
//@author 末広秀樹
//@filesource
//@package Base
//@subpackage AdminUtil
//
//
//
//ユーティリティ・クラス(管理者用)
//
//2005.01.10 by suehiro blockHTML → htmlspecialchars 指摘により変更
//2005.01.10 by suehiro 不要ロジック count($O_result) を指摘により削除
//2005.03.25 by maeda 請求情報カスタマイズ設定ＵＩ(チェックボックス) makeBillCustomSelecter を追加
//2005.06.30 by maeda makeBillCustomSelecter にtype引数を追加
//
//@since 2004/08/12
//@author 末広秀樹
//@package Base
//@subpackage AdminUtil
//

require("DBUtil.php");

require("ErrorUtil.php");

require("common.conf");

//
//既存データをＤＢから取得し、配列($A_values)に積むプラン
//@param int プランID
//@return str キャリアのタイプ
//
//
//勘定科目内訳をＤＢから取得し、配列($A_values)に積むcarid での絞込み追加
//
//@param object &$O_form
//@param string $name
//@param string $label
//@param integer $pactid
//@param integer $caridp
//@return integer
//
//
//勘定科目内訳をＤＢから取得し、配列($A_values)に積む
//
//@param object &$O_form
//@param string $name
//@param string $label
//@return unknown
//
//
//勘定科目をＤＢから取得し、配列($A_values)に積む
//
//@param object &$O_form
//@param string $name
//@param string label
//@param integer $pactid
//@param string option
//@return integer
//
//
//既存データをＤＢから取得し、配列($A_values)に積むプラン
//
//@param object &$O_form
//@param string $name
//@param string $label
//@param integer $pactid default = ""
//@return unknown
//
//
//既存データをＤＢから取得し、配列($A_values)に積むプラン
//
//@param object &$O_form
//@param string $name
//@param string $name
//@param integer $pactid default = ""
//@return integer
//
//
//キャリア選択ＵＩ(チェックボックス)
//
//@param object &$O_form
//@param string $name
//@param string $label
//@param integer $col_count default = 3
//@return integer
//
//
//機能権限選択ＵＩ(チェックボックス)
//
//@param object &$O_form
//@param string $name
//@param string $label
//@param mixed $option default = NULL
//@param integer $col_count default = 3
//@retrun integer
//
//
//機能権限選択ＵＩ(チェックボックス)
//
//@param object &$O_form
//@param string $name
//@param string $label
//@param mixed $option default = NULL
//@param integer $col_count default = 3
//@return integer
//
//
//機能権限選択ＵＩ(チェックボックス)
//
//@param object &$O_form
//@param string $name
//@param string $label
//@param mixed $option default = NULL
//@param integer $col_count default = 3
//
//
//都道府県ＵＩ(プルダウン)
//
//@param object &$O_form
//@param string $name
//@param string $label
//@retrun void
//
//
//シミュレーション識別番号
//
//@param object &$O_form
//@param string $name
//@param string $label
//@param string $mode
//
//
//請求情報カスタマイズ設定ＵＩ(チェックボックス)
//
//@param $O_form フォームオブジェクト
//@param $name optionタグのname属性名
//@param $label 表示用名称
//@param $col_count 列数
//@param $pactid 契約ID
//@param $type 請求情報表示単位
//@return SQLリザルト
//
//
//公私分計パターン選択設定ＵＩ(チェックボックス)
//
//@since 2005/08/25
//@author s.Maeda
//@param $O_form フォームオブジェクト
//@param $name チェックボックスのname属性
//@param $label 表示用名称
//@param $col_count 列数
//@param $carid キャリアID
//@param $groupid グループ
//@return チェックボックス数
//
//
//公私分計パターン選択設定ＵＩ(プルダウン)
//
//@since 2005/08/26
//@author s.Maeda
//@param $O_form フォームオブジェクト
//@param $name プルダウンのname属性
//@param $label 表示用名称
//@param $carid キャリアID
//@param $groupid グループID
//
//
//公私分計パターン選択設定ＵＩ(プルダウン)ラベル無しバージョン
//
//@since 2005/08/31
//@author s.Maeda
//@param $O_form フォームオブジェクト
//@param $name プルダウンのname属性
//@param $carid キャリアID
//@param $groupid グループID
//@return パターン数
//
class AdminUtil {
	getType(planid) {
		var sql = " select circuit_tb.cirname from plan_tb " + " left join circuit_tb on circuit_tb.cirid = plan_tb.cirid " + " where plan_tb.planid = " + planid;
		var cirname = GLOBALS.GO_db.getOne(sql);

		if (cirname == "FOMA") {
			var type = "f";
		} else if (cirname == "\u30E0\u30FC\u30D0") {
			type = "m";
		} else if (cirname == "PHS") {
			type = "p";
		} else {
			type = "f";
		}

		return type;
	}

	makeKamokuRelUtiwakeSelector(O_form, name, label, pactid, carid) //デフォルト値
	//SQL実行
	//SQL実行結果取得
	//$O_form->addElement('select',$name,$label, $H_data,"id='$name' size='13'  style='width:545' multiple");
	{
		var count = 0;
		var sql = " select kamoku_tb.kamokuid,kamoku_tb.kamokuname, utiwake_tb.code, utiwake_tb.name, utiwake_tb.carid " + " from kamoku_rel_utiwake_tb " + " left join kamoku_tb on kamoku_tb.kamokuid = kamoku_rel_utiwake_tb.kamokuid and kamoku_tb.pactid = kamoku_rel_utiwake_tb.pactid" + " left join utiwake_tb on utiwake_tb.code =  kamoku_rel_utiwake_tb.code " + " where " + " kamoku_rel_utiwake_tb.pactid=" + pactid + " and " + " kamoku_rel_utiwake_tb.carid=" + carid + " order by kamoku_rel_utiwake_tb.code";

		if (DEBUG == 1) {
			echo("SQL:" + sql + "<br>");
		}

		var O_result = GLOBALS.GO_db.query(sql);

		while (row = O_result.fetchRow()) {
			var kamokuid = htmlspecialchars(row[0]);
			var kamokuname = htmlspecialchars(row[1]);
			var code = htmlspecialchars(row[2]);
			var utiwakename = htmlspecialchars(row[3]);
			carid = htmlspecialchars(row[4]);
			H_data[`${kamokuid}:${code}-${carid}`] = kamokuname + " --- " + code + " - " + utiwakename;
			count++;
		}

		O_result.free();
		O_form.addElement("select", name, label, undefined, `id='${name}' size='13'  style='width:745' multiple`);
		return count;
	}

	makeUtiwakeSelector(O_form, name, label) {
		O_form.addElement("select", name, label, H_data, `id='${name}' size='25' style='width:600' multiple`);
		return count;
	}

	makeKamokuSelector(O_form, name, label, pactid, option) //デフォルト値
	//SQL実行
	//SQL実行結果取得
	{
		var count = 0;
		var sql = " select kamokuid,kamokuname from kamoku_tb where pactid=" + pactid + " order by kamokuid";

		if (DEBUG == 1) {
			echo("SQL:" + sql + "<br>");
		}

		var first_id = "";
		var O_result = GLOBALS.GO_db.query(sql);

		while (row = O_result.fetchRow()) {
			var kamokuid = htmlspecialchars(row[0]);
			var kamokuname = htmlspecialchars(row[1]);
			H_data[kamokuid] = kamokuname;

			if (first_id == "") {
				first_id = kamokuid;
			}

			count++;
		}

		O_result.free();
		O_form.addElement("select", name, label, H_data, `id='${name}' size='25'  style='width:125' ` + option);
		return first_id;
	}

	makeDocomoShopSelector(O_form, name, label, pactid = "") //デフォルト値
	//SQL実行
	//SQL実行結果取得
	{
		var count = 0;
		var sql = " select shop_tb.shopid,shop_tb.name from shop_carrier_tb " + " left join shop_tb on  shop_tb.shopid = shop_carrier_tb.shopid " + " where " + " shop_carrier_tb.carid = 1";

		if (DEBUG == 1) {
			echo("SQL:" + sql + "<br>");
		}

		var O_result = GLOBALS.GO_db.query(sql);

		while (row = O_result.fetchRow()) {
			var shopid = htmlspecialchars(row[0]);
			var shopname = htmlspecialchars(row[1]);
			H_data[shopid] = shopname;
			count++;
		}

		O_result.free();
		O_form.addElement("select", name, label, H_data, `id='${name}' size='5' multiple`);
		return count;
	}

	makeAuShopSelector(O_form, name, label, pactid = "") //デフォルト値
	//SQL実行
	//SQL実行結果取得
	{
		var count = 0;
		var sql = " select shop_tb.shopid,shop_tb.name from shop_carrier_tb " + " left join shop_tb on  shop_tb.shopid = shop_carrier_tb.shopid " + " where " + " shop_carrier_tb.carid = 3";

		if (DEBUG == 1) {
			echo("SQL:" + sql + "<br>");
		}

		var O_result = GLOBALS.GO_db.query(sql);

		while (row = O_result.fetchRow()) {
			var shopid = htmlspecialchars(row[0]);
			var shopname = htmlspecialchars(row[1]);
			H_data[shopid] = shopname;
			count++;
		}

		O_result.free();
		O_form.addElement("select", name, label, H_data, `id='${name}' size='5' multiple`);
		return count;
	}

	makeCarrierSelecter(O_form, name, label, col_count = 3) //SQL文
	//オプション
	{
		var sql_str = "SELECT carid, carname FROM carrier_tb where carid<>0 and carid<>99 order by carid";

		if (DEBUG == 1) {
			echo(sql_str + "<br>");
		}

		var H_carriers = GLOBALS.GO_db.getHash(sql_str);

		for (var key in H_carriers) {
			var value = H_carriers[key];
			A_chkbox.push(HTML_QuickForm.createElement("checkbox", value.carid, undefined, "<span style=\"width:170px\">" + htmlspecialchars(value.carname) + "</span>"));
		}

		for (var i = 0; i < col_count; i++) {
			if (i == col_count - 1) {
				A_bitween.push("<br />");
			} else {
				A_bitween.push("&nbsp;");
			}
		}

		O_form.addGroup(A_chkbox, name, label, A_bitween);
		return A_chkbox.length;
	}

	makeCompanyFunctionSelecter(O_form, name, label, option = undefined, col_count = 3) //SQL文
	//オプション
	{
		var sql_str = "SELECT fncid, fncname FROM function_tb where type='CO' and enable = true order by show_order,fncid";

		if (DEBUG == 1) {
			echo(sql_str + "<br>");
		}

		var H_function = GLOBALS.GO_db.getHash(sql_str);

		for (var key in H_function) {
			var value = H_function[key];
			value.fncname = str_replace("<BR>", "", value.fncname);
			option.id = value.fncid;
			A_chkbox.push(HTML_QuickForm.createElement("checkbox", value.fncid, undefined, "<span style=\"width:200px\">" + htmlspecialchars(value.fncname) + "</span>", option));
		}

		for (var i = 0; i < col_count; i++) {
			if (i == col_count - 1) {
				A_bitween.push("<br />");
			} else {
				A_bitween.push("&nbsp;");
			}
		}

		O_form.addGroup(A_chkbox, name, label, A_bitween);
		return A_chkbox.length;
	}

	makeAdminFunctionSelecter(O_form, name, label, option = undefined, col_count = 3) //SQL文
	//オプション
	{
		var sql_str = "SELECT fncid, fncname FROM function_tb where type='SU' and enable = true order by show_order,fncid";

		if (DEBUG == 1) {
			echo(sql_str + "<br>");
		}

		var H_function = GLOBALS.GO_db.getHash(sql_str);

		for (var key in H_function) {
			var value = H_function[key];
			value.fncname = str_replace("<BR>", "", value.fncname);
			option.id = value.fncid;
			A_chkbox.push(HTML_QuickForm.createElement("checkbox", value.fncid, undefined, "<span style=\"width:200px\">" + htmlspecialchars(value.fncname) + "</span>", option));
		}

		for (var i = 0; i < col_count; i++) {
			if (i == col_count - 1) {
				A_bitween.push("<br />");
			} else {
				A_bitween.push("&nbsp;");
			}
		}

		O_form.addGroup(A_chkbox, name, label, A_bitween);
		return A_chkbox.length;
	}

	makeUserFunctionSelecter(O_form, name, label, option = undefined, col_count = 3) //SQL文
	//オプション
	{
		var sql_str = "SELECT fncid, fncname FROM function_tb where type='US' and enable = true order by show_order,fncid";

		if (DEBUG == 1) {
			echo(sql_str + "<br>");
		}

		var H_function = GLOBALS.GO_db.getHash(sql_str);

		for (var key in H_function) //V2とV3でかぶる項目
		{
			var value = H_function[key];
			option.id = value.fncid;

			if (value.fncid == 13 || value.fncid == 14 || value.fncid == 15 || value.fncid == 21 || value.fncid == 23 || value.fncid == 24 || value.fncid == 31) {
				value.fncname = value.fncname + "\uFF08v2\uFF09";
			}

			value.fncname = str_replace("<BR>", "", value.fncname);
			A_chkbox.push(HTML_QuickForm.createElement("checkbox", value.fncid, undefined, "<span style=\"width:200px\">" + htmlspecialchars(value.fncname) + "</span>", option));
		}

		for (var i = 0; i < col_count; i++) {
			if (i == col_count - 1) {
				A_bitween.push("<br />");
			} else {
				A_bitween.push("&nbsp;");
			}
		}

		O_form.addGroup(A_chkbox, name, label, A_bitween);
		return A_chkbox.length;
	}

	makeAddrAreaSelecter(O_form, name, label) //都道府県一覧を取得
	{
		if (file_exists(KCS_DIR + "/define/area.master") == true) {
			var A_area = file(KCS_DIR + "/define/area.master");
		}

		var H_area = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};

		for (var x = 0; x < A_area.length; x++) {
			A_area[x] = rtrim(A_area[x]);
			H_area[A_area[x]] = A_area[x];
		}

		O_form.addElement("select", name, label, H_area);
	}

	makeSimwaySelecter(O_form, name, label, mode) {
		if (mode == "new") {
			H_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		}

		H_data["0"] = "\u901A\u5E38";
		H_data["1"] = "\u901A\u8A71\u660E\u7D30\u3092\u4F7F\u7528";
		H_data["2"] = "\u901A\u8A71\u660E\u7D30\u3092\u4F7F\u7528(\u9577\u5F97)";
		H_data["3"] = "au\u30C7\u30FC\u30BF\u30D7\u30E9\u30F3";
		H_data["4"] = "\u30C9\u30B3\u30E2\u30C7\u30FC\u30BF\u30D7\u30E9\u30F322";
		H_data["5"] = "2005/6\u4EE5\u964D\u306B\u8FFD\u52A0\u3055\u308C\u305F\u30C9\u30B3\u30E2\u30C7\u30FC\u30BF\u30D7\u30E9\u30F3";
		O_form.addElement("select", name, label, H_data);
	}

	makeBillCustomSelecter(O_form, name, label, col_count = 3, pactid = "", type) //SQL文
	//チェックボックス
	//予備項目数設定（電話）
	//デフォルト予備文字列項目名称設定
	//デフォルト予備メールアドレス項目名称設定
	//デフォルト予備数値項目名称設定
	//デフォルト予備日付項目名称設定
	//デフォルト予備URL項目名称設定
	//デフォルト予備URL項目名称設定
	//pactid が指定されている場合。つまり更新時は予備項目名を検索し、チェックボックスを追加する
	//改行設定
	{
		var sql_str = "select colname, name from bill_custom_master_tb where type = '" + type + "' order by sort";
		var H_telcolname = GLOBALS.GO_db.getHash(sql_str);

		for (var key in H_telcolname) {
			var value = H_telcolname[key];
			A_chkbox.push(HTML_QuickForm.createElement("checkbox", value.colname, undefined, "<span style=\"width:200px\">" + htmlspecialchars(value.name) + "</span>"));
		}

		if ("TT" == type) //プルダウン追加　20150305 date
			//予備項目数設定（電話以外）
			{
				var textCnt = 15;
				var mailCnt = 3;
				var intCnt = 6;
				var dateCnt = 6;
				var urlCnt = 3;
				var selectCnt = 10;
			} else //プルダウン追加 20150305 date
			{
				textCnt = 15;
				mailCnt = 0;
				intCnt = 3;
				dateCnt = 3;
				urlCnt = 0;
				selectCnt = 0;
			}

		for (var cnt = 1; cnt <= textCnt; cnt++) {
			H_telcolname_add["text" + cnt] = "\u6587\u5B57\u5217" + mb_convert_kana(cnt, N);
		}

		for (cnt = 1;; cnt <= mailCnt; cnt++) {
			H_telcolname_add["mail" + cnt] = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9" + mb_convert_kana(cnt, N);
		}

		for (cnt = 1;; cnt <= intCnt; cnt++) {
			H_telcolname_add["int" + cnt] = "\u6570\u5024" + mb_convert_kana(cnt, N);
		}

		for (cnt = 1;; cnt <= dateCnt; cnt++) {
			H_telcolname_add["date" + cnt] = "\u65E5\u4ED8" + mb_convert_kana(cnt, N);
		}

		for (cnt = 1;; cnt <= urlCnt; cnt++) {
			H_telcolname_add["url" + cnt] = "URL" + mb_convert_kana(cnt, N);
		}

		for (cnt = 1;; cnt <= selectCnt; cnt++) {
			H_telcolname_add["select" + cnt] = "\u30D7\u30EB\u30C0\u30A6\u30F3" + mb_convert_kana(cnt, N);
		}

		if (pactid != "") //予備項目数設定（電話）
			//デフォルト予備項目名を会社毎の項目名に置き換え
			//pactid が指定されていない場合。つまり新規登録時
			{
				if (type == "TT") //電話情報予備項目名テーブルから検索
					//予備項目数設定（電話以外）
					{
						sql_str = "select col, colname from management_property_tb where mid = 1 and pactid = " + pactid + " order by col";
					} else if (type == "PP" or type == "PT") //電話情報予備項目名テーブルから検索
					{
						sql_str = "select colid, colname from post_property_tb where pactid = " + pactid + " order by colid";
					}

				var H_telproperty = GLOBALS.GO_db.getAssoc(sql_str);

				for (var key in H_telcolname_add) //予備項目数設定（電話以外）
				//項目名が設定されている場合は会社毎の項目名でチェックボックスを追加
				{
					var value = H_telcolname_add[key];

					if ("TT" != type) //文字列１～１５
						{
							if (ereg("^text", key) == true) //数値１～３
								{
									var convKey = str_replace("text", "", key);
								} else if (ereg("^int", key) == true) //日付１～２
								{
									convKey = str_replace("int", "", key);
									convKey = convKey + 15;
								} else if (ereg("^date", key) == true) {
								convKey = str_replace("date", "", key);
								convKey = convKey + 18;
							}
						} else {
						convKey = key;
					}

					if (undefined !== H_telproperty[convKey] == true) //$A_chkbox[] = &HTML_QuickForm::createElement('checkbox', $key, null, "<span style=\"width:200px\">" . htmlspecialchars($H_telproperty[$convKey]) . "</span>");
						//項目名が設定されていない場合はデフォルト項目名でチェックボックスを追加
						{
							if (ereg("^select", convKey) == true) //プルダウン対策
								{
									var check_name = H_telproperty[convKey].split(":");
									check_name = check_name[0];
								} else {
								check_name = H_telproperty[convKey];
							}

							A_chkbox.push(HTML_QuickForm.createElement("checkbox", key, undefined, "<span style=\"width:200px\">" + htmlspecialchars(check_name) + "</span>"));
						} else {
						A_chkbox.push(HTML_QuickForm.createElement("checkbox", key, undefined, "<span style=\"width:200px\">" + htmlspecialchars(H_telcolname_add[key]) + "</span>"));
					}
				}
			} else //電話情報予備項目を追加
			{
				for (var key in H_telcolname_add) {
					var value = H_telcolname_add[key];
					A_chkbox.push(HTML_QuickForm.createElement("checkbox", key, undefined, "<span style=\"width:200px\">" + htmlspecialchars(value) + "</span>"));
				}
			}

		for (var i = 0; i < col_count; i++) {
			if (i == col_count - 1) {
				A_bitween.push("<br />");
			} else {
				A_bitween.push("&nbsp;");
			}
		}

		O_form.addGroup(A_chkbox, name, label, A_bitween);
		return A_chkbox.length;
	}

	makeKousiPatternCheckbox(O_form, name, label, col_count = 3, carid, groupid) //チェックボックス
	//改行設定
	{
		if (0 == groupid) {
			groupid = 1;
		}

		var sql_str = "select patternid, patternname from kousi_pattern_tb where carid = " + carid + " AND groupid = " + groupid + " order by patternid";
		var H_patternname = GLOBALS.GO_db.getHash(sql_str);

		for (var key in H_patternname) {
			var value = H_patternname[key];
			A_chkbox.push(HTML_QuickForm.createElement("checkbox", value.patternid, undefined, "<span style=\"width:200px\">" + htmlspecialchars(value.patternname) + "</span>"));
		}

		for (var cnt = 0; cnt < col_count; cnt++) {
			if (cnt == col_count - 1) {
				A_bitween.push("<br />");
			} else {
				A_bitween.push("&nbsp;");
			}
		}

		O_form.addGroup(A_chkbox, name, label, A_bitween);
		return A_chkbox.length;
	}

	makeKousiPatternSelect(O_form, name, label, carid, groupid) //セレクトリスト
	{
		if (0 == groupid) {
			groupid = 1;
		}

		var sql_str = "select patternid, patternname from kousi_pattern_tb where carid = " + carid + " AND groupid = " + groupid + " order by patternid";
		var H_patternname = GLOBALS.GO_db.getHash(sql_str);
		var H_select = {
			"": "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
		};

		for (var key in H_patternname) {
			var value = H_patternname[key];
			H_select[value.patternid] = htmlspecialchars(value.patternname);
		}

		O_form.addElement("select", name, label, H_select);
	}

	makeKousiPatternSelectNoLabel(O_form, name, carid, groupid) //
	{
		var where_groupid = "";

		if (0 != groupid) {
			where_groupid = " AND groupid = " + groupid + " ";
		}

		var sql_str = "select patternid, patternname from kousi_pattern_tb where carid = " + carid + where_groupid + " order by patternid";
		var H_patternname = GLOBALS.GO_db.getHash(sql_str);

		if (H_patternname.length > 0) //セレクトリスト
			{
				for (var key in H_patternname) {
					var value = H_patternname[key];
					H_select[value.patternid] = htmlspecialchars(value.patternname);
				}
			} else {
			var H_select = {
				"": "\u767B\u9332\u306A\u3057"
			};
		}

		O_form.addElement("select", name, undefined, H_select);
		return H_patternname.length;
	}

};