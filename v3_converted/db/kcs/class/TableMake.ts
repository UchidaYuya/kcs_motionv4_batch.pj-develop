//
//   HTMLテーブル作成など
//
//   作成日：2004/04/14
//   作成者：上杉勝史
//   修正日：2004/05/27 森原 リンクの有無を選択できるように修正
//   修正日：2004/05/30 森原 テーブル日付が省略されなかった場合の処理を修正
//	修正日：2004/06/06 森原 thisがunsetの場合の処理を追加
//	修正日：2007/07/31 宝子山 MakeDate関数内のmktime関数使用部分のバグ修正
//	修正日：2008/02/28 宝子山 getTableNoの0付けの条件変更
//	修正日：2009/01/05 森原 英語化対応
//

require("DBUtil.php");

require("HTML/Table.php");

require("Smarty.class.php");

//20190410伊達追加
//年月をずらす
//20090105森原追加
//言語識別子(英語ならENG)
//機能：言語識別子を設定する
//言語識別子を返す
//機能：言語情報に応じて文言を切り替える
//引数：日本語の時の文言
//英語の時の文言
//機能：月数を渡すと、言語識別子に応じてフォーマットを変更する
//20090105森原追加ここまで
//年月のずらし設定 20190410 伊達
//
// PEAR HTML_Tableを使用してテーブルを生成する
// 
// [引　数] $sqli	: SQL
//		   $H_attr	: テーブル属性(Hash)
//		   $from	: レコード開始行
//		   $cnt		: 取得レコード数
// [返り値] $result	: 生成されたHTML文
//
//20040527森原追加
//機能：年月リンクの有無を選択するための仮想メソッド
//派生型でオーバーライドして、リンクを消せるようにする
//引数：$year	年
//引数：$month	月(1～12)
//返値：リンクをつけるべきならtrueを返す事
//20040527森原追加ここまで
//過去年月を指定した際にそれに対応したテーブル番号を取得する
class TableMake {
	constructor() {
		this.m_month_add = 0;
	}

	setLang(lang) {
		this.m_lang = lang;
	}

	getLang() {
		var lang = "JPN";

		if (undefined !== this.m_lang) {
			lang = this.m_lang;
		}

		return lang;
	}

	lang(lang_jpn, lang_eng) {
		if (!strcmp("ENG", this.getLang())) {
			return lang_eng;
		}

		return lang_jpn;
	}

	langMonth(month) {
		if (!strcmp("ENG", this.getLang())) {
			var cur = mktime(0, 0, 0, month, 1, date("Y"));
			return date("M", cur);
		}

		return month;
	}

	setMonthAdd(month_add) {
		this.m_month_add = month_add;
	}

	makeTable(sql, H_attr = false, from = 0, cnt = 0) //DBオブジェクトが無かったら作成
	//SQL実行
	//ヘッダが指定されていれば
	//DBの値を元にテーブル作成
	//列の属性
	//行の属性
	//タイトル行の属性
	//タイトル行のcolsapn,rowspan
	{
		if (GLOBALS.GO_db == false) {
			GLOBALS.GO_db = new DBUtil();
		}

		var O_tbl = new HTML_Table(H_attr.tbl);

		if (from < 0 || cnt <= 0) {
			var O_result = GLOBALS.GO_db.query(sql);
		} else {
			O_result = GLOBALS.GO_db.limitQuery(sql, from, cnt);
		}

		var cols = O_result.numCols();

		if (H_attr.colname == false) {
			var A_info = O_result.tableInfo();

			for (var col_cnt = 0; col_cnt < cols; col_cnt++) {
				if (H_attr.tdhead == false) {
					O_tbl.setHeaderContents(0, col_cnt, A_info[col_cnt].name);
				} else {
					O_tbl.setCellContents(0, col_cnt, A_info[col_cnt].name);
				}
			}
		} else {
			for (col_cnt = 0;; col_cnt < H_attr.colname.length; col_cnt++) {
				if (H_attr.tdhead == false) {
					O_tbl.setHeaderContents(0, col_cnt, H_attr.colname[col_cnt]);
				} else {
					O_tbl.setCellContents(0, col_cnt, H_attr.colname[col_cnt]);
				}
			}
		}

		var row_cnt = 0;

		while (A_row = O_result.fetchRow()) {
			row_cnt += 1;

			for (col_cnt = 0;; col_cnt < cols; col_cnt++) {
				O_tbl.setCellContents(row_cnt, col_cnt, A_row[col_cnt]);
			}
		}

		for (col_cnt = 0;; col_cnt < cols; col_cnt++) {
			if (H_attr["col" + col_cnt] == true) {
				O_tbl.setColAttributes(col_cnt, H_attr["col" + col_cnt]);
			}
		}

		O_tbl.altRowAttributes(0, H_attr.rowA, H_attr.rowB);
		O_tbl.setRowAttributes(0, H_attr.header, false);

		if (H_attr.spanhead == true) {
			{
				let _tmp_0 = H_attr.spanhead;

				for (var colnum in _tmp_0) {
					var H_spanhead = _tmp_0[colnum];
					var H_spanhead = array_merge(H_attr.header, H_spanhead);
					O_tbl.setCellAttributes(0, colnum, H_spanhead);
				}
			}
		}

		return O_tbl.toHTML();
	}

	isLink(year, month) {
		return true;
	}

	MakeDate(start = 25, current = true, setrootpost = false, showall = false, past = false) //$past	true:過去分データ修正用,false:現在用
	//スタート月を配列に入れる
	//月末に正しい月を引けないバグが出ていたのでmktimeを使わない形に修正 20060531miya
	//		// 現在用
	//		if($past == false){
	//			$A_ym = split(",", date("Y,n", mktime(0, 0, 0, date("m") - $start + 1, date("d"), date("Y"))));
	//		// 過去分データ修正用
	//		}else{
	//			$A_ym = split(",", date("Y,n", mktime(0, 0, 0, date("m") - $start, date("d"), date("Y"))));
	//		}
	//ここから修正
	//for ($A_tmp_ym[1]; $A_tmp_ym[1]<1;) {
	//$A_tmp_ym[1] = $A_tmp_ym[1] + 12;
	//$A_tmp_ym[0] = $A_tmp_ym[0] -1;
	//}
	//現在用は+1
	//ここでスタート年月の配列が完成
	//ここまで修正
	//テーブル生成
	//月の加算値をまとめる(20190419 伊達)
	//return $table;
	{
		A_tmp_ym[0] = date("Y");
		A_tmp_ym[1] = date("n");
		A_tmp_ym[1] = A_tmp_ym[1] - start;

		if (past == false) {
			A_tmp_ym[1] = A_tmp_ym[1] + 1;
		}

		for (A_tmp_ym[1]; A_tmp_ym[1] < 1; ) {
			A_tmp_ym[1] = A_tmp_ym[1] + 12;
			A_tmp_ym[0] = A_tmp_ym[0] - 1;
		}

		var A_ym = A_tmp_ym;

		if (_GET.ym != "") //年月を切り替えたときにカレント部署をログイン部署にする
			//部署登録変更（過去分）用
			{
				if (_GET.ym == "all") {
					_SESSION[_SERVER.PHP_SELF + ",cy"] = "all";
					_SESSION[_SERVER.PHP_SELF + ",cm"] = "all";
				} else {
					var A_tmp = split(",", _GET.ym);
					_SESSION[_SERVER.PHP_SELF + ",cy"] = _GET.ym.substr(0, 4);
					_SESSION[_SERVER.PHP_SELF + ",cm"] = _GET.ym.substr(4);
				}

				if (setrootpost == true) {
					_SESSION[_SERVER.PHP_SELF + ",past"] = _SESSION.postid;
				}

				delete _SESSION[_SERVER.PHP_SELF + ",p"];
				delete _SESSION[_SERVER.PHP_SELF + ",s"];
				header("Location: " + _SERVER.PHP_SELF);
				throw die();
			} else {
			if (undefined !== _SESSION[_SERVER.PHP_SELF + ",cy"] == false && undefined !== _SESSION[_SERVER.PHP_SELF + ",cm"] == false) {
				if (showall == true) {
					_SESSION[_SERVER.PHP_SELF + ",cy"] = "all";
					_SESSION[_SERVER.PHP_SELF + ",cm"] = "all";
				} else //現在用
					{
						if (past == false) //過去分データ修正用
							{
								_SESSION[_SERVER.PHP_SELF + ",cy"] = date("Y");
								_SESSION[_SERVER.PHP_SELF + ",cm"] = date("n");
							} else //mktimeの使い方間違いを修正（正確に末日を取れていなかった）
							{
								_SESSION[_SERVER.PHP_SELF + ",cy"] = date("Y", mktime(0, 0, 0, date("n") - 1, 1, date("Y")));
								_SESSION[_SERVER.PHP_SELF + ",cm"] = date("n", mktime(0, 0, 0, date("n") - 1, 1, date("Y")));
							}
					}
			}
		}

		var table = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"YM\">\n" + "<tr>\n";
		var month_add_y = +(this.m_month_add / 12);
		var month_add_m = +(this.m_month_add % 12);

		for (ymcnt = 0, addm = 0; ymcnt < start; ymcnt++, addm++) //-----------------------------------------
		//リンクとして表示する文字列
		//-----------------------------------------
		//----ここまでリンクとして表示する文字列----
		//上にもっていった
		//if($ymcnt == 0){
		//$table .= "<td>&nbsp;<span class=\"yy\">" . $A_ym[0]
		//. $this->lang("年", "") . "</span></td>\n";//20090105森原修正
		//}
		{
			var link_y = A_ym[0];
			var link_m = A_ym[1] + addm;
			link_y += month_add_y;
			link_m += month_add_m;

			if (link_m <= 0) {
				link_y--;
				link_m += 12;
			} else if (link_m > 12) {
				link_y++;
				link_m -= 12;
			}

			if (link_m == 1 || ymcnt == 0) {
				table += "<td>&nbsp;<span class=\"yy\">" + link_y + this.lang("\u5E74", "") + "</span></td>\n";
			}

			var link_m_string = this.langMonth(link_m) + this.lang("\u6708", "");

			if (_SESSION[_SERVER.PHP_SELF + ",cy"] == A_ym[0] && _SESSION[_SERVER.PHP_SELF + ",cm"] == A_ym[1] + addm) //20090105森原修正
				{
					table += "<td>&nbsp;<span class=\"curmm\">" + link_m_string + "</span></td>\n";
				} else if (undefined !== this && !this.isLink(A_ym[0], A_ym[1] + addm)) //20090105森原修正
				{
					table += "<td>&nbsp;<span class=\"mm\">" + link_m_string + "</span></td>\n";
				} else //20090105森原修正
				{
					table += "<td>&nbsp;<a href=\"?ym=" + A_ym[0] + (A_ym[1] + addm) + "\" class=\"mm\">" + link_m_string + "</a></td>\n";
				}

			if (A_ym[1] + addm == 12) {
				addm = 0;
				A_ym[0]++;
				A_ym[1] = 0;
			}
		}

		if (showall == true) {
			if (_SESSION[_SERVER.PHP_SELF + ",cy"] == "all" && _SESSION[_SERVER.PHP_SELF + ",cm"] == "all") {
				table += "<td>&nbsp;<span class=\"curmm\">\u3059\u3079\u3066</span></td>\n";
			} else {
				table += "<td>&nbsp;<a href=\"?ym=all\" class=\"mm\">\u3059\u3079\u3066</a></td>\n";
			}
		}

		table += "</tr>\n" + "</table>\n";
		return table;
	}

	getTableNo(targetYear = "", targetMonth = "", past = false) //$past	true:過去分データ修正用,false:現在用
	//指定された過去年月
	//現在年月
	//指定年月から現在年月までの月数を計算
	//現在用
	//整形（文字列の長さも考慮　2008/02/28 houshi）
	{
		if ("" == targetYear) targetYear = _SESSION[_SERVER.PHP_SELF + ",cy"];
		if ("" == targetMonth) targetMonth = _SESSION[_SERVER.PHP_SELF + ",cm"];
		var tableNo = "";
		var currentYear = date("Y");
		var currentMonth = date("n");
		var calc = 12 * (currentYear - targetYear) - targetMonth + 1 + currentMonth;

		if (past == false) //選択した年月が１年以上前でない場合
			//過去分データ修正用
			{
				if (calc < 13) //選択した月が１月の場合
					{
						if (targetMonth == 1) {
							tableNo = 12;
						} else {
							tableNo = targetMonth - 1;
						}
					} else //選択した月が１月の場合
					{
						if (targetMonth == 1) {
							tableNo = 24;
						} else {
							tableNo = targetMonth - 1 + 12;
						}
					}
			} else //選択した年月が１年以上前でない場合
			{
				if (calc < 14) {
					tableNo = targetMonth;
				} else {
					tableNo = targetMonth + 12;
				}
			}

		if (tableNo < 10 && tableNo.length == 1) {
			tableNo = "0" + tableNo;
		}

		return tableNo;
	}

	MakeDateKisyo(start, current = true) {
		if (start < 1) {
			start = 4;
		}

		var first_mon = mktime(0, 0, 0, start - 1, 1, date("Y"));
		var now_mon = mktime(0, 0, 0, date("m"), 1, date("Y"));
		var A_ym = split(",", date("Y,n", first_mon));

		if (first_mon >= now_mon) {
			A_ym[0] = A_ym[0] - 2;
		} else {
			A_ym[0] = A_ym[0] - 1;
		}

		if (_SESSION[_SERVER.PHP_SELF + ",search"].ym != "") {
			if (_SESSION[_SERVER.PHP_SELF + ",search"].ym == "all") {
				delete _SESSION[_SERVER.PHP_SELF + ",cy"];
				delete _SESSION[_SERVER.PHP_SELF + ",cm"];
			} else {
				_SESSION[_SERVER.PHP_SELF + ",cy"] = _SESSION[_SERVER.PHP_SELF + ",search"].ym.substr(0, 4);
				_SESSION[_SERVER.PHP_SELF + ",cm"] = _SESSION[_SERVER.PHP_SELF + ",search"].ym.substr(4);
			}
		}

		var table = "<table border=\"0\" cellspacing=\"0\" cellpadding=\"2\" class=\"orderListYM\">\n";

		for (var m_cnt = 0; m_cnt < 24; m_cnt++) {
			if (m_cnt == 0 || m_cnt == 12) {
				if (m_cnt == 0) {
					table += "<tr><th rowspan=\"2\" bgcolor=\"mediumaquamarine\" width=\"70\">&nbsp;\u5E74 \u6708&nbsp;</th>\n<td>&nbsp;<span class=\"yy\">\u524D\u5E74\u5EA6</span></td>\n";
				} else {
					if (undefined !== _SESSION[_SERVER.PHP_SELF + ",cy"] == false && undefined !== _SESSION[_SERVER.PHP_SELF + ",cm"] == false) {
						table += "<td rowspan=\"2\">&nbsp;&nbsp;<a href=\"javascript:setYM(24,'all')\" class=\"mm\"><span id=\"m24\" style=\"background-color:mediumaquamarine\">\u3059\u3079\u3066</span></a>&nbsp;</td></tr><tr>\n<td>&nbsp;<span class=\"yy\">\u5F53\u5E74\u5EA6</span></td>\n";
					} else {
						table += "<td rowspan=\"2\">&nbsp;&nbsp;<a href=\"javascript:setYM(24,'all')\" class=\"mm\"><span id=\"m24\">\u3059\u3079\u3066</span></a>&nbsp;</td></tr><tr>\n<td>&nbsp;<span class=\"yy\">\u5F53\u5E74\u5EA6</span></td>\n";
					}
				}
			}

			if (A_ym[1] == 12) {
				A_ym[0]++;
				A_ym[1] = 1;
			} else {
				A_ym[1]++;
			}

			if (_SESSION[_SERVER.PHP_SELF + ",cy"] == A_ym[0] && _SESSION[_SERVER.PHP_SELF + ",cm"] == A_ym[1]) //$table .= "<td>&nbsp;<span class=\"curmm\">" . $A_ym[1] . "月</span></td>\n";
				{
					table += "<td>&nbsp;<a href=\"javascript:setYM(" + m_cnt + "," + A_ym[0] + A_ym[1] + ")\" class=\"mm\"><span id=\"m" + m_cnt + "\" style=\"background-color:mediumaquamarine\">" + A_ym[1] + "\u6708</span></a></td>\n";
				} else if (now_mon < mktime(0, 0, 0, A_ym[1], 1, A_ym[0])) {
				table += "<td>&nbsp;<span class=\"mm\">" + A_ym[1] + "\u6708</span></td>\n";
			} else //$table .= "<td>&nbsp;<a href=\"?ym=" . $A_ym[0] . $A_ym[1] . "\" class=\"mm\">" . $A_ym[1] . "月</a></td>\n";
				{
					table += "<td>&nbsp;<a href=\"javascript:setYM(" + m_cnt + "," + A_ym[0] + A_ym[1] + ")\" class=\"mm\"><span id=\"m" + m_cnt + "\">" + A_ym[1] + "\u6708</span></a></td>\n";
				}
		}

		table += "</tr>\n" + "</table>\n";
		return table;
	}

};