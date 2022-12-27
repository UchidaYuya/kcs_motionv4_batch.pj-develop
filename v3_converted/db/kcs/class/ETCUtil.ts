//
//	電話管理ユーティリティクラス
//
//	作成日：2006/11/29
//	作成者：宝子山
//
//
// 文字列項目、数値項目、日付項目のプルダウン作成クラス
// 機能・・・文字列項目（H_character）、数値項目（H_numerical）、日付項目（H_date）
// 			のプルダウンを作成する
//
//
//機能・・・登録部署所属ユーザー取得しプルダウン用配列作成
//引数・・・$pactid（契約ID）
//		  $postid（部署ID）
//		  $userid（ユーザーID）
//返り値・・・$A_date（結果配列）
//
//
//更新用SQL文を作る（新規登録、変更）関数
//機能・・・入力あればSQL文用に変形、なければNULL
//引数・・・$H_session（入力値）
//		  $mod（insertかupdateか）
//返り値・・・$H_sql（Sql用の値）
//
//
//SQL文の値を作る（文字列）関数
//機能・・・入力あればSQL文用に変形、なければNULL
//引数・・・$data（値）
//返り値・・・$res（変形した値）
//
//
//SQL文の値を作る（数値）関数
//機能・・・入力あればSQL文用に変形、なければNULL
//引数・・・$data（値）
//返り値・・・$res（変形した値）
//
//
//カード会社のプルダウン作成用
//機能・・・検索、新規、変更のカード会社プルダウンの中身作成
//引数・・・無
//返り値・・・$A_value
//
//
//フォーム作成関数(新規、変更）
//機能・・・クイックフォームでフォームを作る
//引数・・・$O_form（フォームオブジェクト）
//返り値・・・$O_form
//
//
//フォームが正しい時フリーズする関数
//機能・・・フォームをフリーズさせる
//引数・・・$O_form（フォームオブジェクト）
//返り値・・・$O_form
//
//
//機能・・・ページリンク用の配列を作成
//引数・・・$num（リストの件数）
//		  $limit（1ページの表示件数）
//		  $current（現在のページ）
//返り値・・・$A_plist（ページリンク配列）
//
//
//機能・・・一覧表示用sqlのソート文作成
//引数・・・$sort（ソート指定）
//返り値・・・$sort_sql（ソート文）
//
//
//リスト表示sql作成関数
//機能・・・一覧表示用のsql分を作成
//引数・・・$pactid（契約ID）
//		  $H_pos（ポストの値）
//		  $limit（表示件数）
//		  $page（表示ページ）
//返り値・・・$O_form
//
//
//機能・・・文字列項目検索用のSQL文作成
//引数・・・$A_char（フォームの文字列項目値）
//返り値・・・$sql（sql文）
//
//
//機能・・・数値項目検索用のSQL文作成
//引数・・・$A_num（フォームの文字列項目値）
//返り値・・・$sql（sql文）
//
//
//機能・・・日付項目検索用のSQL文作成
//引数・・・$A_date（フォームの文字列項目値）
//返り値・・・$sql（sql文）
//
//
//機能・・・不等号の決定を行う
//引数・・・$con（フォームで選択した値）
//返り値・・・=,<,>
//
//
//重複チェック（確認・完了）
//機能・・・入力されたカード番号がDBに既にあればfalseを返す
//引数・・・$card_view（入力電話番号）
//			$tb（対象テーブル）
//返り値・・・true,false
//
//
//重複チェック（確認・完了）
//機能・・・入力されたカード番号で削除済がDBに既にあればfalseを返す
//引数・・・$card_view（入力電話番号）
//			$tb（対象テーブル）
//返り値・・・true,false
//
//
//お客様番号（法人番号）の存在チェック
//機能・・・入力されたお客様番号（法人番号）が登録されていなければfalseを返す
//引数・・・$card_view（入力電話番号）
//			$tb（対象テーブル）
//返り値・・・true,false
//

//----------------------------------
//コンストラクタ（tel_property_tbから値取得）
//----------------------------------
class SelectorFactory {
	SelectorFactory() //文字列項目用配列
	//数値項目用配列
	//日付項目用配列
	//SQL実行
	//SQL実行結果取得
	{
		this.H_character[0] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		this.H_numerical[0] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		this.H_date[0] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		this.A_col = Array();
		var sql = "select colid,colname from card_property_tb where pactid=" + _SESSION.pactid + " order by colid";

		if (DEBUG == 1) {
			echo(sql + "<br>");
		}

		var O_result = GLOBALS.GO_db.query(sql);

		while (row = O_result.fetchRow()) {
			if (row[0] <= 15) //文字列項目用配列の最後に追加
				{
					if (row[1] != "") {
						this.H_character.push(htmlspecialchars(row[1]));
						this.A_col.push("et.text" + row[0]);
					}
				} else if (row[0] > 15 && row[0] <= 18) //数値項目用配列の最後に追加
				{
					if (row[1] != "") {
						this.H_numerical.push(htmlspecialchars(row[1]));
						this.A_col.push("et.int" + (row[0] - 15));
					}
				} else if (row[0] > 18 && row[0] <= 20) //日付項目
				{
					if (row[1] != "") {
						this.H_date.push(htmlspecialchars(row[1]));
						this.A_col.push("et.date" + (row[0] - 18));
					}
				} else {
				echo("\u672A\u5B9A\u7FA9\u5024");
			}
		}

		O_result.free();
	}

};

function makeUserSelecter(pactid, postid, userid = "") //SQL実行
{
	var sql = "select userid,username from user_tb where pactid=" + pactid + " and postid='" + postid + "' ";

	if (userid != "") {
		sql += " or userid = '" + userid + "' ";
	}

	sql += " and type='US' order by userid";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	var A_data = GLOBALS.GO_db.getSimpleHash(sql);
	A_data[-1] = "\u672A\u9078\u629E";
	ksort(A_data);
	return A_data;
};

function makeUpSql(H_session, mod) //ETCクレジット番号
//ETCクレジット番号（表示）
//ETCカード名義
//クレジット番号
//クレジット番号（表示）
//お客様番号（法人番号）
//クレジットカード法人名
//クレジットカード会員名称
//使用者ID
//社員番号
//ユーザー名
//車両番号
//文字列項目（15回ループで処理）
//数値項目（3回ループで処理）
//日付項目（2回ループで処理）
//メモ
//公私分計
//カード会社
//削除フラグ
//”,”で結合
{
	var cardno = H_session.cardno_view.replace(/(-|\(|\)|\s)/g, "");

	if (mod == "insert") {
		H_sql.cardno = makeSqlPartsChar(cardno);
	} else {
		H_sql.cardno = "cardno=" + makeSqlPartsChar(cardno);
	}

	if (mod == "insert") {
		H_sql.cardno_view = makeSqlPartsChar(H_session.cardno_view);
	} else {
		H_sql.cardno_view = "cardno_view=" + makeSqlPartsChar(H_session.cardno_view);
	}

	if (mod == "insert") {
		H_sql.card_meigi = makeSqlPartsChar(H_session.card_meigi);
	} else {
		H_sql.card_meigi = "card_meigi=" + makeSqlPartsChar(H_session.card_meigi);
	}

	var bill_cardno = H_session.bill_cardno_view.replace(/(-|\(|\)|\s)/g, "");

	if (mod == "insert") {
		H_sql.bill_cardno = makeSqlPartsChar(bill_cardno);
	} else {
		H_sql.bill_cardno = "bill_cardno=" + makeSqlPartsChar(bill_cardno);
	}

	if (mod == "insert") {
		H_sql.bill_cardno_view = makeSqlPartsChar(H_session.bill_cardno_view);
	} else {
		H_sql.bill_cardno_view = "bill_cardno_view=" + makeSqlPartsChar(H_session.bill_cardno_view);
	}

	if (mod == "insert") {
		H_sql.card_corpno = makeSqlPartsChar(H_session.card_corpno);
	} else {
		H_sql.card_corpno = "card_corpno=" + makeSqlPartsChar(H_session.card_corpno);
	}

	if (mod == "insert") {
		H_sql.card_corpname = makeSqlPartsChar(H_session.card_corpname);
	} else {
		H_sql.card_corpname = "card_corpname=" + makeSqlPartsChar(H_session.card_corpname);
	}

	if (mod == "insert") {
		H_sql.card_membername = makeSqlPartsChar(H_session.card_membername);
	} else {
		H_sql.card_membername = "card_membername=" + makeSqlPartsChar(H_session.card_membername);
	}

	if (mod == "insert") {
		H_sql.userid = makeSqlPartsInt(H_session.userid);
	} else {
		H_sql.userid = "userid=" + makeSqlPartsInt(H_session.userid);
	}

	if (mod == "insert") {
		H_sql.employecode = makeSqlPartsChar(H_session.employeecode);
	} else {
		H_sql.employecode = "employeecode=" + makeSqlPartsChar(H_session.employeecode);
	}

	if (mod == "insert") {
		H_sql.username = makeSqlPartsChar(H_session.username);
	} else {
		H_sql.username = "username=" + makeSqlPartsChar(H_session.username);
	}

	if (mod == "insert") {
		H_sql.car_no = makeSqlPartsChar(H_session.car_no);
	} else {
		H_sql.car_no = "car_no=" + makeSqlPartsChar(H_session.car_no);
	}

	var A_text = Array();

	for (var tcnt = 1; tcnt <= 15; tcnt++) {
		if (mod == "insert") {
			H_sql["text" + tcnt] = makeSqlPartsChar(H_session["text" + tcnt]);
		} else {
			H_sql["text" + tcnt] = "text" + tcnt + "=" + makeSqlPartsChar(H_session["text" + tcnt]);
		}
	}

	var A_numerical = Array();

	for (var ncnt = 1; ncnt <= 3; ncnt++) {
		if (mod == "insert") {
			H_sql["int" + ncnt] = makeSqlPartsInt(H_session["int" + ncnt]);
		} else {
			H_sql["int" + ncnt] = "int" + ncnt + "=" + makeSqlPartsInt(H_session["int" + ncnt]);
		}
	}

	var A_date = Array();

	for (var dcnt = 1; dcnt <= 2; dcnt++) {
		if (mod == "insert") {
			H_sql["date" + dcnt] = makeSqlPartsChar(H_session["date" + dcnt].Y + "-" + H_session["date" + dcnt].m + "-" + H_session["date" + dcnt].d);
		} else {
			H_sql["date" + dcnt] = "date" + dcnt + "=" + makeSqlPartsChar(H_session["date" + dcnt].Y + "-" + H_session["date" + dcnt].m + "-" + H_session["date" + dcnt].d);
		}
	}

	if (mod == "insert") {
		H_sql.memo = makeSqlPartsChar(H_session.memo);
	} else {
		H_sql.memo = "memo=" + makeSqlPartsChar(H_session.memo);
	}

	if (mod == "insert") {
		H_sql.kousiflg = makeSqlPartsInt(H_session.kousiflg);
	} else {
		H_sql.kousiflg = "kousiflg=" + makeSqlPartsInt(H_session.kousiflg);
	}

	if (mod == "insert") {
		H_sql.cardcoid = makeSqlPartsInt(H_session.cardcoid);
	} else {
		H_sql.cardcoid = "cardcoid=" + makeSqlPartsInt(H_session.cardcoid);
	}

	if (mod == "insert") {
		H_sql.delete_flg = "false";
	} else {
		H_sql.delete_flg = "delete_flg = false";
	}

	var values = H_sql.join(",");
	return values;
};

function makeSqlPartsChar(data) //空の時
{
	if (data == "" || data == undefined || data == "--") {
		var res = "NULL";
	} else {
		res = "'" + data + "'";
	}

	return res;
};

function makeSqlPartsInt(data) //空の時
{
	if (data == "" || data == undefined || data == -1) {
		var res = "NULL";
	} else {
		res = data;
	}

	return res;
};

function makeCardcoSelect() //DBからカード会社情報を取得
{
	var sql = "select cardcoid,cardconame from card_co_tb where defaultflg = true order by sort";
	var A_values = GLOBALS.GO_db.getSimpleHash(sql);
	A_values[-1] = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
	ksort(A_values);
	return A_values;
};

function makeForm(O_form) //ETCカード番号
//カード会社
//ETCカード名義
//クレジットカード番号
//お客様番号（法人番号）
//クレジットカード法人名
//クレジットカード会員名称
//請求閲覧者（部署に存在しないユーザも表示）
//公私分計設定
//公私分計デフォルトパターン選択
//DBから項目を取得
//A_values内の要素を指定するためのカウント
//文字項目
//数値項目
//日付項目
//
//	  入力制限のルールの設定
//
{
	O_form.addElement("text", "cardno_view", "ETC\u30AB\u30FC\u30C9\u756A\u53F7", {
		size: 26,
		maxlength: 19
	});
	O_form.addElement("select", "cardcoid", "\u30AB\u30FC\u30C9\u4F1A\u793E", makeCardcoSelect(), {
		id: "cardcoid"
	});
	O_form.addElement("text", "card_meigi", "ETC\u30AB\u30FC\u30C9\u540D\u7FA9", {
		size: 26,
		maxlength: 255
	});
	O_form.addElement("text", "bill_cardno_view", "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u756A\u53F7", {
		size: 26,
		maxlength: 19
	});
	O_form.addElement("text", "card_corpno", "\u304A\u5BA2\u69D8\u756A\u53F7\uFF08\u6CD5\u4EBA\u756A\u53F7\uFF09", {
		size: 26,
		maxlength: 255
	});
	O_form.addElement("text", "card_corpname", "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u6CD5\u4EBA\u540D", {
		size: 26,
		maxlength: 255
	});
	O_form.addElement("text", "card_membername", "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u4F1A\u54E1\u540D\u79F0", {
		size: 26,
		maxlength: 255
	});
	O_form.addElement("select", "userid", "\u8ACB\u6C42\u95B2\u89A7\u8005", makeUserSelecter(_SESSION.pactid, _SESSION[_SERVER.PHP_SELF + ",current_postid"]));
	A_kousi_radio.push(HTML_QuickForm.createElement("radio", undefined, undefined, "\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09", 2, "onclick=\"disableKousisel()\""));
	A_kousi_radio.push(HTML_QuickForm.createElement("radio", undefined, undefined, "\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044", 1, "onclick=\"disableKousisel()\""));
	A_kousi_radio.push(HTML_QuickForm.createElement("radio", undefined, undefined, "\u516C\u79C1\u5206\u8A08\u3059\u308B", 0, "onclick=\"disableKousisel()\""));
	O_form.addGroup(A_kousi_radio, "kousiflg", "\u516C\u79C1\u533A\u5206", "<br>");
	O_form.addElement("text", "username", "\u4F7F\u7528\u8005\u540D", {
		size: 22,
		maxlength: 255
	});
	O_form.addElement("text", "employeecode", "\u793E\u54E1\u756A\u53F7", {
		size: 22,
		maxlength: 255
	});
	O_form.addElement("text", "car_no", "\u8ECA\u4E21\u756A\u53F7", {
		size: 22,
		maxlength: 255
	});
	var sql = "select colid,colname from card_property_tb where pactid=" + _SESSION.pactid;
	var A_values = GLOBALS.GO_db.getSimpleHash(sql);
	var colid = 1;
	var valid_text_count = 0;

	for (var count = 1; count <= 15; count++) {
		var name = "text" + count;
		var label = A_values[colid++];
		O_form.addElement("text", name, label, {
			size: 22,
			maxlength: 255
		});

		if (label != "") {
			valid_text_count++;
		}
	}

	var valid_numerical_count = 0;

	for (count = 1;; count <= 3; count++) {
		name = "int" + count;
		label = A_values[colid++];
		O_form.addElement("text", name, label, {
			size: 22,
			maxlength: 10
		});

		if (label != "") {
			valid_numerical_count++;
			O_form.addRule(name, label + "\u304C\u4E0D\u6B63\u3067\u3059\u3002", "numeric", undefined, "client");
		}
	}

	var A_dateopt = {
		minYear: MIN_YEAR,
		maxYear: MAX_YEAR,
		format: "Y \u5E74 m \u6708 d",
		laststr: "\u65E5",
		language: "ja",
		addEmptyOption: true,
		emptyOptionText: "--"
	};
	var valid_date_count = 0;

	for (count = 1;; count <= 2; count++) {
		name = "date" + count;
		label = A_values[colid++];
		O_form.addElement("date", name, label, A_dateopt);

		if (label != "") {
			valid_date_count++;
			O_form.addRule(name, label + "\u306F\u3001\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002", "checkdate", undefined, "client");
		}
	}

	O_form.addElement("textarea", "memo", "\u30E1\u30E2", {
		rows: 5,
		cols: 50,
		maxlength: 512
	});

	if (H_session.recogpostid != "") {
		_SESSION[_SERVER.PHP_SELF + ",current_postid"] = H_session.recogpostid;
	}

	O_form.addElement("hidden", "recogpostname", "");
	O_form.addElement("hidden", "recogpostid", "");
	O_form.addElement("hidden", "flag", "");
	O_form.setJsWarnings("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
	O_form.setRequiredNote("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
	O_form.addRule("cardno_view", "ETC\u30AB\u30FC\u30C9\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
	O_form.addRule("cardno_view", "ETC\u30AB\u30FC\u30C9\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u534A\u89D2\u30B9\u30DA\u30FC\u30B9\u3001\u300C-\u300D\u306E\u307F\u3067\u3059", "regex", "/^[A-Za-z0-9\\-\\s]+$/", "client");
	O_form.addRule("bill_cardno_view", "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u534A\u89D2\u30B9\u30DA\u30FC\u30B9\u3001\u300C-\u300D\u306E\u307F\u3067\u3059", "regex", "/^[A-Za-z0-9\\-\\s]+$/", "client");
	O_form.addRule("card_corpno", "\u304A\u5BA2\u69D8\u756A\u53F7\uFF08\u6CD5\u4EBA\u756A\u53F7\uFF09\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u3059", "regex", "/^[0-9]+$/", "client");

	if (kousiFlg == true) {
		O_form.addRule(["kousiflg", "kousiselid"], "\u516C\u79C1\u5206\u8A08\u3059\u308B\u5834\u5408\u306F\u4F7F\u7528\u3059\u308B\u30D1\u30BF\u30FC\u30F3\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044", new checkDefaultSel(), 0, "client");
	}

	return O_form;
};

function freezeForm(O_form) //Formが正しかったらfreezeする
{
	if (O_form.validate()) //submitNameを"NEXT_NAME"から"SUBMIT_NAME"へ
		{
			O_form.updateElementAttr("submitName", {
				value: SUBMIT_NAME
			});
			O_form.updateAttributes({
				onsubmit: false
			});
			O_form.freeze();
		}

	return O_form;
};

function makePageLink(num, limit, current) //件数÷1ページの表示数＝ページの数
//表示する最後のページ
//リンクは11ページづつ表示
//1以下は1
{
	var pcnt = Math.ceil(num / limit);
	var la = current + 5;

	if (pcnt >= 11 && la < 11) {
		la = 11;
	}

	if (la > pcnt) {
		la = pcnt;
	}

	if (la < 11) {
		la = pcnt;
	}

	var st = la - 10;

	if (st < 1) {
		st = 1;
	}

	var A_plist = Array();

	for (var cnt = st; cnt <= la; cnt++) {
		A_plist.push(cnt);
	}

	return A_plist;
};

function makeSortSql(sort) {
	var A_sort = split("/", sort);
	var col_sp = A_sort[0];
	var jen_sp = A_sort[1];

	if (jen_sp == "d") {
		var jen = " desc";
	}

	if (col_sp == "0") {
		var column = "et.postid" + jen + ",et.cardno";
	} else if (col_sp == "1") {
		column = "et.cardno" + jen + ",et.postid";
	} else if (col_sp == "2") {
		column = "et.cardcoid" + jen + ",et.postid";
	} else if (col_sp == "3") {
		column = "et.card_meigi" + jen + ",et.postid,et.cardno";
	} else if (col_sp == "4") {
		column = "et.bill_cardno" + jen + ",et.postid,et.cardno";
	} else if (col_sp == "5") {
		column = "et.username" + jen + ",et.postid,et.cardno";
	} else if (col_sp == "6") {
		column = "et.car_no" + jen + ",et.postid,et.cardno";
	} else {
		column = "et.postid" + jen + ",et.cardno";
	}

	return column;
};

function makeListSQL(H_pos, H_get, current_postid, pactid, A_postids, level, tb, po_tb, A_Cols, kousi = false, charge = false, download = false) //まずサニタイジング
//請求権限があるとき、電話IDと請求者名取得
//スーパーユーザーの時
//where節作成
//検索実行時
//ダウンロード以外は件数指定
{
	var A_sql = Array();

	if (Array.isArray(H_pos) == true) {
		for (var key in H_pos) {
			var val = H_pos[key];

			if (Array.isArray(val) == true) {
				for (var ky in val) {
					var vl = val[ky];
					var vl = GLOBALS.GO_db.escapeSimple(vl);
				}
			} else {
				var val = GLOBALS.GO_db.escapeSimple(val);
			}
		}
	}

	var cnt_sql = "select count(et.cardno) ";
	var get_sql = "select et.postid,\n\t\t\t\t\t\tpo.userpostid,\n\t\t\t\t\t\tpo.postname,\n\t\t\t\t\t\tet.cardno_view,\n\t\t\t\t\t\tet.cardno,\n\t\t\t\t\t\tco.cardconame,\n\t\t\t\t\t\tet.card_meigi,\n\t\t\t\t\t\tet.bill_cardno_view,\n\t\t\t\t\t\tet.bill_cardno,\n\t\t\t\t\t\tet.card_corpno,\n\t\t\t\t\t\tet.card_corpname,\n\t\t\t\t\t\tet.card_membername,\n\t\t\t\t\t\tet.username,\n\t\t\t\t\t\tet.employeecode,\n\t\t\t\t\t\tet.car_no,\n\t\t\t\t\t\tet.memo ";

	if (charge == true) {
		get_sql += ",et.userid,us.username as uname ";
	}

	if (Array.isArray(A_Cols) == true && A_Cols.length > 0) {
		get_sql += "," + A_Cols.join(",") + " ";
	}

	if (kousi == true) {
		get_sql += ",case when et.kousiflg = 0 then '\u516C\u79C1\u5206\u8A08\u3059\u308B' " + " when et.kousiflg = 1 then '\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044' " + " when et.kousiflg is null then '\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09' end ";
	}

	var from = " from " + tb + " as et\n\t\t\tleft outer join " + po_tb + " as po on et.postid = po.postid\n\t\t\tleft outer join card_co_tb as co on et.cardcoid = co.cardcoid\n\t\t\tleft outer join user_tb as us on et.userid = us.userid ";
	var where = " where et.delete_flg = false and et.pactid = " + pactid;

	if (_SESSION.su == true && level == 0) //表示モードが所属部署のみ
		{
			if (H_get.mode == "pid") {
				where += " and et.postid = " + current_postid;
			}
		} else //表示モードが配下の部署の時
		{
			if (H_get.mode == "search") {
				where += " and et.postid in (" + A_postids.join(",") + ")";
			} else {
				where += " and et.postid = " + current_postid;
			}
		}

	var A_where = Array();
	var A_input = Array();

	if (undefined !== H_pos.submitName == true) //ETCカード番号
		{
			if (H_pos.cardno != "") {
				var cardno = H_pos.cardno.replace(/(-|\(|\)|\s)/g, "");
				A_where.push("et.cardno like '%" + cardno + "%'");
				A_input.push("cardno");
			}

			if (H_pos.cardcoid != "-1") {
				A_where.push("et.cardcoid = " + H_pos.cardcoid);
				A_input.push("cardcoid");
			}

			if (H_pos.card_meigi != "") {
				A_where.push("et.card_meigi like '%" + H_pos.card_meigi + "%'");
				A_input.push("card_meigi");
			}

			if (H_pos.card_corpno != "") {
				A_where.push("et.card_corpno like '%" + H_pos.card_corpno + "%'");
				A_input.push("card_corpno");
			}

			if (H_pos.bill_cardno != "") {
				var bill_cardno = H_pos.bill_cardno.replace(/(-|\(|\)|\s)/g, "");
				A_where.push("et.bill_cardno like '%" + bill_cardno + "%'");
				A_input.push("bill_cardno");
			}

			if (H_pos.card_corpname != "") {
				A_where.push("et.card_corpname like '%" + H_pos.card_corpname + "%'");
				A_input.push("card_corpname");
			}

			if (H_pos.card_membername != "") {
				A_where.push("et.card_membername like '%" + H_pos.card_membername + "%'");
				A_input.push("card_membername");
			}

			if (H_pos.username != "") {
				A_where.push("et.username like '%" + H_pos.username + "%'");
				A_input.push("username");
			}

			if (H_pos.employeecode != "") {
				A_where.push("et.employeecode like '%" + H_pos.employeecode + "%'");
				A_input.push("employeecode");
			}

			if (H_pos.user_username != "") {
				A_where.push("us.username like '%" + H_pos.user_username + "%'");
				A_input.push("user_username");
			}

			if (H_pos.car_no != "") {
				A_where.push("et.car_no like '%" + H_pos.car_no + "%'");
				A_input.push("car_no");
			}

			if (H_pos.character.column != 0 && H_pos.character.val != "") {
				A_where.push(makeCharSql(H_pos.character));
				A_input.push("character");
			}

			if (H_pos.numeric.column != 0 && H_pos.numeric.val != "") {
				A_where.push(makeNumSql(H_pos.numeric));
				A_input.push("numeric");
			}

			if (H_pos.date.column != "0" && (H_pos.date.val.Y != "" && H_pos.date.val.Y != "--")) {
				A_where.push(makeDateSql(H_pos.date));
				A_input.push("date");
			}

			if (A_where.length > 0) //検索条件がandの時
				{
					if (H_pos.search_condition == "and") {
						where += " and (" + A_where.join(" and ") + ")";
					} else {
						where += " and (" + A_where.join(" or ") + ")";
					}
				}
		}

	var sort = " order by " + makeSortSql(H_get.s);

	if (download == false) {
		var opt = " offset " + (H_get.current - 1) * H_get.limit + " limit " + H_get.limit;
	}

	A_sql.push(cnt_sql + from + where);
	A_sql.push(get_sql + from + where + sort + opt);
	A_sql.push(A_input);
	return A_sql;
};

function makeCharSql(A_char) {
	var sql = "et.text" + A_char.column + " like '%" + A_char.val + "%'";
	return sql;
};

function makeNumSql(A_num) {
	var sql = "et.int" + A_num.column + " " + makeSign(A_num.condition) + A_num.val;
	return sql;
};

function makeDateSql(A_date) //購入日、契約日以外の時
{
	if (is_numeric(A_date.column) == true) {
		var col = "date" + A_date.column;
	} else {
		col = A_date.column;
	}

	var sql = "et." + col + " " + makeSign(A_date.condition) + " '" + A_date.val.Y + "-" + A_date.val.m + "-" + A_date.val.d + "'";
	return sql;
};

function makeSign(con) {
	if (con == 0) {
		return "=";
	} else if (con == 1) {
		return "<";
	} else if (con == 2) {
		return ">";
	} else {
		echo("\u30A8\u30E9\u30FC");
	}
};

function checkDuplication(cardno_view, tb = "card_tb") {
	var res = true;
	var cardno = cardno_view.replace(/(-|\(|\)|\s)/g, "");
	var sql = "select count(cardno) from " + tb + " where " + " delete_flg is false " + " and cardno = '" + cardno + "'" + " and pactid = " + _SESSION.pactid;

	if (DEBUG == 1) {
		echo(sql + "<br>");
	}

	var O_result = GLOBALS.GO_db.query(sql);
	var row = O_result.fetchRow();

	if (row[0] >= 1) {
		res = false;
	}

	O_result.free();
	return res;
};

function checkDeleteDuplication(cardno_view, tb = "card_tb") {
	var res = true;
	var cardno = cardno_view.replace(/(-|\(|\)|\s)/g, "");
	var sql = "select count(cardno) from " + tb + " where " + " delete_flg is true " + " and cardno = '" + cardno + "'" + " and pactid = " + _SESSION.pactid;

	if (DEBUG == 1) {
		echo(sql + "<br>");
	}

	var O_result = GLOBALS.GO_db.query(sql);
	var row = O_result.fetchRow();

	if (row[0] >= 1) {
		res = false;
	}

	O_result.free();
	return res;
};

function checkCorpnoExist(corpno) {
	var res = false;
	corpno = corpno.replace(/(-|\(|\)|\s)/g, "");
	var sql = "select count(card_master_no) from card_bill_master_tb where " + " card_master_no = '" + corpno + "'" + " and pactid = " + _SESSION.pactid;

	if (DEBUG == 1) {
		echo(sql + "<br>");
	}

	var O_result = GLOBALS.GO_db.query(sql);
	var row = O_result.fetchRow();

	if (row[0] >= 1) {
		res = true;
	}

	O_result.free();
	return res;
};