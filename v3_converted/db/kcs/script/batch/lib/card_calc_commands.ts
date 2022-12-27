//===========================================================================
//機能：カード　集計計算プロセス のコマンド一覧
//
//作成：石崎
//2007/06/21 カード請求テーブルへのコピー文格納場所を変更 log/batch - log/batch/card_calc
//更新	20090611	森原	pgpoolのINSERTロック解除
//===========================================================================
//勘定科目用カラム数+1
//バッチ活動終了時間
//機能：カード単位の集計
//引数：顧客ID,実行時間,実行引数,使用テーブルNo. ,ログディレクトリ
//戻値：true 成功
//2007/02/27 石崎
//機能：部署単位の集計
//引数：顧客ID, 実行時間, 実行引数, 使用テーブルNo., ログDir
//戻値：true成功
//2007/02/27 石崎
//引数がおかしかった場合に使用法を表示し終了
//機能：カード系の集計ステータスを取得し、該当年月で未処理の
//未処理の顧客一覧を配列で返す
//実行引数,使用テーブルNo.
//戻値：整形処理後のデータを返す
//2007/02/26 石崎
//機能：終了した顧客のステータス情報を更新する
//引数：pactid, 実行時間,実行引数
//2007/02/26 石崎
//機能：活動時間内か否かを判定
//引数：
//戻値：boolean（true 活動可）
//2007/02/28 石崎
//機能：対象顧客の勘定科目一覧を取得
//引数：pactid
//戻値：勘定科目の一覧を返す
//2007/02/28 石崎
//機能：clamptask_tb にレコードを追加し二重起動を防止
//引数：$is_lock(trueロック、falseアンロック)、&$db ,実行時間
//戻値：true(成功)、false(失敗)
//2007/03/08 石崎
//機能：ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//引数：テーブル名、入力ファイル名、カラム名の配列
//戻値：終了コード　1（失敗）
error_reporting(E_ALL);
const KAMOKUMAX = 11;
const ENDTIME = 8;

function calc_card(pactid_num, nowtime, H_argx, useMonth, dbLogDir) //カード単位用コピー文パス
//振り分ける勘定科目の配列を取得
//引数による Where句 のつくり訳
//card_details_X_tb からデータを取得するためのSQL文を作成
//card_bill_X_tb の初期化 DELETE
//where句作成
//card_bill_X_tb へ集計結果を入力
//card_bill_X_tb で使用するカラム名の配列
//インポート失敗
{
	{
		if (!("dbh" in global)) dbh = undefined;
		if (!("logh" in global)) logh = undefined;
	}
	var copy_sql = dbLogDir + "card/card_bill_" + useMonth + "_" + pactid_num + "_" + date("Ymd") + ".sql";
	logh.putError(G_SCRIPT_INFO, "\u30AB\u30FC\u30C9\u5358\u4F4D\u96C6\u8A08\u3092\u958B\u59CB");
	var H_kamoku_list = get_kanjo_kamoku(pactid_num);
	var sql_where = "where ";

	if (H_argx["-c"] == 0) {
		sql_where += "co.pactid = " + pactid_num + " ";
	} else {
		sql_where += "cd.pactid = " + pactid_num + " and cd.cardcoid = " + H_argx["-c"] + " ";
	}

	sql_where = "";

	if (H_argx["-c"] != 0) {
		sql_where = " and cd.cardcoid = " + H_argx["-c"] + " ";
	}

	var sql_str = "select cd.pactid,cd.cardno,cx.postid,cd.cardcoid,cd.code,cd.charge " + "from card_details_" + useMonth + "_tb cd " + "inner join card_" + useMonth + "_tb cx on cd.pactid = cx.pactid and cd.cardno = cx.cardno " + "where cd.pactid = " + pactid_num + " " + sql_where + "order by cd.pactid,cd.cardno,cd.cardcoid";
	logh.putError(G_SCRIPT_INFO, "card_details_" + useMonth + "_tb \u304B\u3089\u8ACB\u6C42\u30C7\u30FC\u30BF\u306E\u62BD\u51FA");
	logh.putError(G_SCRIPT_INFO, "SQL:" + sql_str);
	var H_reserve = dbh.getHash(sql_str);

	if (H_reserve.length == 0) {
		logh.putError(G_SCRIPT_INFO, "pactid = " + pactid_num + " \u306E\u8ACB\u6C42\u60C5\u5831\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002\u51E6\u7406\u3092\u4E2D\u6B62\u3057\u307E\u3059");
		return false;
	}

	logh.putError(G_SCRIPT_INFO, "pactid = " + pactid_num + " \u306E\u5BFE\u8C61\u3068\u306A\u308B\u30EC\u30B3\u30FC\u30C9\u6570\u306F " + H_reserve.length + "\u4EF6\u3067\u3059");
	var count_ex = 0;

	for (var key in H_reserve) //前回のループと同一カードか？
	//1.初めてのループ
	{
		var value = H_reserve[key];

		if (undefined !== H_card_bill[count_ex] == false) {
			H_card_bill[count_ex].pactid = pactid_num;
			H_card_bill[count_ex].postid = value.postid;
			H_card_bill[count_ex].cardno = String(value.cardno);

			for (var cnt = 1; cnt < KAMOKUMAX; cnt++) {
				H_card_bill[count_ex]["kamoku" + cnt] = 0;
			}

			H_card_bill[count_ex].aspcharge = 0;
			H_card_bill[count_ex].aspexcise = 0;
			H_card_bill[count_ex].aspchargeintax = 0;
			H_card_bill[count_ex].charge = 0;
			H_card_bill[count_ex].cardcoid = value.cardcoid;
		} else if (String(H_card_bill[count_ex].cardno !== String(value.cardno || H_card_bill[count_ex].cardcoid != value.cardcoid))) //次のカードの準備
			{
				count_ex++;
				H_card_bill[count_ex].pactid = value.pactid;
				H_card_bill[count_ex].postid = value.postid;
				H_card_bill[count_ex].cardno = String(value.cardno);

				for (cnt = 1;; cnt < KAMOKUMAX; cnt++) {
					H_card_bill[count_ex]["kamoku" + cnt] = 0;
				}

				H_card_bill[count_ex].aspcharge = 0;
				H_card_bill[count_ex].aspexcise = 0;
				H_card_bill[count_ex].aspchargeintax = 0;
				H_card_bill[count_ex].charge = 0;
				H_card_bill[count_ex].cardcoid = value.cardcoid;
			}

		if (value.code == "ASPX") {
			H_card_bill[count_ex].aspchargeintax = value.charge;
		} else //対象請求会社に存在しないコードの場合はその他
			{
				if (undefined !== H_kamoku_list[value.cardcoid][value.code] == false) {
					if (undefined !== H_card_bill[count_ex].kamoku10 == false) {
						H_card_bill[count_ex].kamoku10 = value.charge;
					} else {
						H_card_bill[count_ex].kamoku10 += value.charge;
					}
				} else if (H_kamoku_list[value.cardcoid][value.code] == 0) {
					H_card_bill[count_ex].charge = value.charge;
				} else {
					if (undefined !== H_card_bill[count_ex]["kamoku" + H_kamoku_list[value.cardcoid][value.code]] == false) {
						H_card_bill[count_ex]["kamoku" + H_kamoku_list[value.cardcoid][value.code]] = value.charge;
					} else {
						H_card_bill[count_ex]["kamoku" + H_kamoku_list[value.cardcoid][value.code]] += value.charge;
					}
				}
			}
	}

	var del_where = "where ";

	if (H_argx["-c"] == 0) {
		del_where += "pactid = " + pactid_num + " ";
	} else {
		del_where += "pactid = " + pactid_num + " and cardcoid in(" + H_argx["-c"] + ",0) ";
	}

	var delete_sql = "DELETE FROM card_bill_" + useMonth + "_tb " + del_where;

	if (H_argx["-c"] == 0) {
		logh.putError(G_SCRIPT_INFO, "card_details_" + useMonth + "_tb \u304B\u3089 pactid = " + pactid_num + " \u306E\u30C7\u30FC\u30BF\u3092\u5168\u8ACB\u6C42\u4F1A\u793E\u5206\u3092\u524A\u9664\u3057\u307E\u3059");
	} else {
		logh.putError(G_SCRIPT_INFO, "card_details_" + useMonth + "_tb \u304B\u3089 pactid = " + pactid_num + " ,cardcoid = " + H_argx["-c"] + "\u306E\u30C7\u30FC\u30BF\u3092\u524A\u9664\u3057\u307E\u3059");
	}

	dbh.query(delete_sql);
	var copyFP = fopen(copy_sql, "w");

	if (copyFP == undefined) {
		logh.putError(G_SCRIPT_WARNING, "\u30B3\u30D4\u30FCSQL:" + copy_sql + " \u306E\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557");
		return false;
	}

	for (var value of Object.values(H_card_bill)) {
		fwrite(copyFP, value.pactid + "\t" + value.postid + "\t" + value.cardno + "\t");

		for (var kamoku_cnt = 1; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
			fwrite(copyFP, value["kamoku" + kamoku_cnt] + "\t");
		}

		fwrite(copyFP, value.aspcharge + "\t" + value.aspexcise + "\t" + value.aspchargeintax + "\t");
		fwrite(copyFP, value.charge + "\t" + value.cardcoid + "\t" + nowtime + "\n");
	}

	fclose(copyFP);
	var A_columns = ["pactid", "postid", "cardno"];

	for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
		A_columns.push("kamoku" + kamoku_cnt);
	}

	A_columns.push("aspcharge", "aspexcise", "aspchargeintax", "charge", "cardcoid", "recdate");
	var ins_res = doCopyInsert("card_bill_" + useMonth + "_tb", copy_sql, A_columns);

	if (ins_res != 0) {
		logh.putError(G_SCRIPT_WARNING, "card_bill_" + useMonth + "_tb\u3078 pactid[" + pactid_num + "]\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
		dbh.rollback();
	} else {
		logh.putError(G_SCRIPT_INFO, "card_bill_" + useMonth + "_tb\u3078 pactid[" + pactid_num + "]\u306E\u30C7\u30FC\u30BF\u3092\u30A4\u30F3\u30DD\u30FC\u30C8\u3057\u307E\u3057\u305F\uFF1A" + copy_sql);
	}

	return true;
};

function calc_post(pactid_num, nowtime, H_argx, useMonth, dbLogDir) //子部署を含まない部署単位の集計結果
//子部署も含む部署単位の集計結果
//card_post_bill_X_tb より対象顧客の部署単位集計を削除
//請求元会社一覧に0（全請求会社のまとめ）を追加
//対象顧客の部署を低階層順にソートした一覧を抽出
//部署単位集計結果コピー文作成
//card_post_bill_X_tb で使用するカラム名の配列
//インポート失敗
{
	{
		if (!("dbh" in global)) dbh = undefined;
		if (!("logh" in global)) logh = undefined;
	}
	var copy_sql = dbLogDir + "card_post_bill_" + useMonth + "_" + pactid_num + "_" + date("Ymd") + ".sql";
	var H_post_flag0 = Array();
	var H_card_post_1 = Array();
	logh.putError(G_SCRIPT_INFO, "\u90E8\u7F72\u5358\u4F4D\u96C6\u8A08\u3092\u958B\u59CB\uFF08\u4E0B\u4F4D\u90E8\u7F72\u542B\u307E\u305A\uFF09");
	var calc_post_sql = "SELECT pactid,postid,count(cardno)as card," + "Sum(kamoku1)as kamoku1, Sum(kamoku2)as kamoku2, Sum(kamoku3)as kamoku3, Sum(kamoku4)as kamoku4," + "Sum(kamoku5)as kamoku5, Sum(kamoku6)as kamoku6, Sum(kamoku7)as kamoku7, Sum(kamoku8)as kamoku8," + "Sum(kamoku9)as kamoku9, Sum(kamoku10)as kamoku10," + "Sum(aspchargeintax)as aspchargeintax, Sum(charge)as charge,cardcoid" + " FROM card_bill_" + useMonth + "_tb where pactid = " + pactid_num + " GROUP BY pactid,postid,cardcoid ORDER BY postid";
	logh.putError(G_SCRIPT_INFO, "\u914D\u4E0B\u90E8\u7F72\u3092\u542B\u307E\u306A\u3044\u90E8\u7F72\u5358\u4F4D\u306E\u96C6\u8A08\u30C7\u30FC\u30BF\u3092\u53D6\u5F97");
	logh.putError(G_SCRIPT_INFO, "SQL:" + calc_post_sql);
	var H_reserve = dbh.getHash(calc_post_sql);
	logh.putError(G_SCRIPT_INFO, "\u914D\u4E0B\u90E8\u7F72\u3092\u542B\u307E\u306A\u3044\uFF08\u8ACB\u6C42\u4F1A\u793E\u5358\u4F4D\u306E\uFF09\u4EF6\u6570 " + H_reserve.length + "\u4EF6");
	var count_ex = 0;

	for (var key in H_reserve) {
		var value = H_reserve[key];
		H_card_post_0[count_ex].pactid = value.pactid;
		H_card_post_0[count_ex].postid = value.postid;
		H_card_post_0[count_ex].flag = 0;
		H_card_post_0[count_ex].charge = value.charge;
		H_card_post_0[count_ex].aspchargeintax = value.aspchargeintax;
		H_card_post_0[count_ex].card = value.card;
		H_card_post_0[count_ex].cardcoid = value.cardcoid;

		for (var cnt = 1; cnt < KAMOKUMAX; cnt++) {
			H_card_post_0[count_ex]["kamoku" + cnt] = value["kamoku" + cnt];
		}

		count_ex++;
	}

	var delete_sql = "DELETE FROM card_post_bill_" + useMonth + "_tb where pactid = " + pactid_num;
	logh.putError(G_SCRIPT_INFO, "\u6B21\u306ESQL\u6587\u3067\u3001\u90E8\u7F72\u5358\u4F4D\u306E\u96C6\u8A08\u60C5\u5831\u3092\u521D\u671F\u5316\u3057\u307E\u3059\uFF1A" + delete_sql);
	dbh.query(delete_sql);

	for (var value of Object.values(H_card_post_0)) //初回の処理
	//初めての請求会社が処理対象となった場合
	{
		if (undefined !== nowPostid == false) //指定された請求月における対象顧客の全部署を抽出
			{
				var A_cardcoid = Array();
				var nowPostid = value.postid;
				var nowCardco = value.cardcoid;
				A_cardcoid.push(nowCardco);
				var get_post_sql = "SELECT postid FROM post_" + useMonth + "_tb where pactid = " + pactid_num;
				var H_post = dbh.getHash(get_post_sql);

				for (var pact_post of Object.values(H_post)) //現在の顧客、現在処理中の請求会社（cardcoid）を初期化 flag = 0
				//対象部署の全ETC会社を合計した金額を入れる領域も確保
				{
					H_post_flag0[pact_post.postid][nowCardco].postid = pact_post.postid;
					H_post_flag0[pact_post.postid][0].postid = pact_post.postid;
					H_post_flag0[pact_post.postid][nowCardco].flag = 0;
					H_post_flag0[pact_post.postid][0].flag = 0;
					H_post_flag0[pact_post.postid][nowCardco].charge = 0;
					H_post_flag0[pact_post.postid][0].charge = 0;
					H_post_flag0[pact_post.postid][nowCardco].charge = 0;
					H_post_flag0[pact_post.postid][0].charge = 0;
					H_post_flag0[pact_post.postid][nowCardco].aspcharge = 0;
					H_post_flag0[pact_post.postid][0].aspcharge = 0;
					H_post_flag0[pact_post.postid][nowCardco].aspexcise = 0;
					H_post_flag0[pact_post.postid][0].aspexcise = 0;
					H_post_flag0[pact_post.postid][nowCardco].aspchargeintax = 0;
					H_post_flag0[pact_post.postid][0].aspchargeintax = 0;
					H_post_flag0[pact_post.postid][nowCardco].card = 0;
					H_post_flag0[pact_post.postid][0].card = 0;
					H_post_flag0[pact_post.postid][nowCardco].cardcoid = 0;
					H_post_flag0[pact_post.postid][0].cardcoid = 0;

					for (var kamoku_cnt = 1; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
						H_post_flag0[pact_post.postid][nowCardco]["kamoku" + kamoku_cnt] = 0;
						H_post_flag0[pact_post.postid][0]["kamoku" + kamoku_cnt] = 0;
					}
				}
			}

		nowPostid = value.postid;
		nowCardco = value.cardcoid;

		if (-1 !== A_cardcoid.indexOf(nowCardco) == false) {
			A_cardcoid.push(nowCardco);

			for (var pact_post of Object.values(H_post)) {
				H_post_flag0[pact_post.postid][nowCardco].postid = pact_post.postid;
				H_post_flag0[pact_post.postid][nowCardco].flag = 0;
				H_post_flag0[pact_post.postid][nowCardco].charge = 0;
				H_post_flag0[pact_post.postid][nowCardco].aspcharge = 0;
				H_post_flag0[pact_post.postid][nowCardco].aspexcise = 0;
				H_post_flag0[pact_post.postid][nowCardco].aspchargeintax = 0;
				H_post_flag0[pact_post.postid][nowCardco].card = 0;
				H_post_flag0[pact_post.postid][nowCardco].cardcoid = 0;

				for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
					H_post_flag0[pact_post.postid][nowCardco]["kamoku" + kamoku_cnt] = 0;
				}
			}
		}

		H_post_flag0[nowPostid][nowCardco].charge = value.charge;
		H_post_flag0[nowPostid][0].charge += value.charge;
		H_post_flag0[nowPostid][nowCardco].aspchargeintax = value.aspchargeintax;
		H_post_flag0[nowPostid][0].aspchargeintax += value.aspchargeintax;
		H_post_flag0[nowPostid][nowCardco].card = value.card;
		H_post_flag0[nowPostid][0].card += value.card;

		for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
			H_post_flag0[nowPostid][nowCardco]["kamoku" + kamoku_cnt] += value["kamoku" + kamoku_cnt];
			H_post_flag0[nowPostid][0]["kamoku" + kamoku_cnt] += value["kamoku" + kamoku_cnt];
		}
	}

	A_cardcoid.push(0);
	var sql_str = "select postidparent,postidchild,level from post_relation_" + useMonth + "_tb where pactid = " + pactid_num + " order by level DESC";
	logh.putError(G_SCRIPT_INFO, "\u5BFE\u8C61\u9867\u5BA2\u306E\u90E8\u7F72\u3092\u6DF1\u6D45\u9806\u306E\u4E00\u89A7\u3092\u62BD\u51FA");
	logh.putError(G_SCRIPT_INFO, "SQL:" + sql_str);
	var H_post_list = dbh.getHash(sql_str);

	for (var value of Object.values(H_post_list)) //部署名と親部署名が異なる場合
	{
		if (value.postidchild != value.postidparent) //部署のデータが存在しない場合は代入
			//さらに親部署のデータが無い場合は代入
			{
				if (undefined !== H_card_post_1[value.postidchild] == false) {
					for (var card_coid of Object.values(A_cardcoid)) {
						H_card_post_1[value.postidchild][card_coid].charge = H_post_flag0[value.postidchild][card_coid].charge;
						H_card_post_1[value.postidchild][card_coid].aspchargeintax = H_post_flag0[value.postidchild][card_coid].aspchargeintax;
						H_card_post_1[value.postidchild][card_coid].card = H_post_flag0[value.postidchild][card_coid].card;

						for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
							H_card_post_1[value.postidchild][card_coid]["kamoku" + kamoku_cnt] = H_post_flag0[value.postidchild][card_coid]["kamoku" + kamoku_cnt];
						}
					}
				} else {
					for (var card_coid of Object.values(A_cardcoid)) {
						H_card_post_1[value.postidchild][card_coid].charge += H_post_flag0[value.postidchild][card_coid].charge;
						H_card_post_1[value.postidchild][card_coid].aspchargeintax += H_post_flag0[value.postidchild][card_coid].aspchargeintax;
						H_card_post_1[value.postidchild][card_coid].card += H_post_flag0[value.postidchild][card_coid].card;

						for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
							H_card_post_1[value.postidchild][card_coid]["kamoku" + kamoku_cnt] += H_post_flag0[value.postidchild][card_coid]["kamoku" + kamoku_cnt];
						}
					}
				}

				if (undefined !== H_card_post_1[value.postidparent] == false) {
					for (var card_coid of Object.values(A_cardcoid)) {
						H_card_post_1[value.postidparent][card_coid].charge = H_card_post_1[value.postidchild][card_coid].charge;
						H_card_post_1[value.postidparent][card_coid].aspchargeintax = H_card_post_1[value.postidchild][card_coid].aspchargeintax;
						H_card_post_1[value.postidparent][card_coid].card = H_card_post_1[value.postidchild][card_coid].card;

						for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
							H_card_post_1[value.postidparent][card_coid]["kamoku" + kamoku_cnt] = H_card_post_1[value.postidchild][card_coid]["kamoku" + kamoku_cnt];
						}
					}
				} else {
					for (var card_coid of Object.values(A_cardcoid)) {
						H_card_post_1[value.postidparent][card_coid].charge += H_card_post_1[value.postidchild][card_coid].charge;
						H_card_post_1[value.postidparent][card_coid].aspchargeintax += H_card_post_1[value.postidchild][card_coid].aspchargeintax;
						H_card_post_1[value.postidparent][card_coid].card += H_card_post_1[value.postidchild][card_coid].card;

						for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
							H_card_post_1[value.postidparent][card_coid]["kamoku" + kamoku_cnt] += H_card_post_1[value.postidchild][card_coid]["kamoku" + kamoku_cnt];
						}
					}
				}
			} else //顧客・部署・請求会社のデータが存在しない場合(つまりルート部署のみ)
			{
				if (undefined !== H_card_post_1[value.postidchild] == false) {
					for (var card_coid of Object.values(A_cardcoid)) {
						H_card_post_1[value.postidchild][card_coid].charge = H_post_flag0[value.postidchild][card_coid].charge;
						H_card_post_1[value.postidchild][card_coid].aspchargeintax = H_post_flag0[value.postidchild][card_coid].aspchargeintax;
						H_card_post_1[value.postidchild][card_coid].card = H_post_flag0[value.postidchild][card_coid].card;

						for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
							H_card_post_1[value.postidchild][card_coid]["kamoku" + kamoku_cnt] = H_post_flag0[value.postidchild][card_coid]["kamoku" + kamoku_cnt];
						}
					}
				} else {
					for (var card_coid of Object.values(A_cardcoid)) {
						H_card_post_1[value.postidchild][card_coid].charge += H_post_flag0[value.postidchild][card_coid].charge;
						H_card_post_1[value.postidchild][card_coid].aspchargeintax += H_post_flag0[value.postidchild][card_coid].aspchargeintax;
						H_card_post_1[value.postidchild][card_coid].card += H_post_flag0[value.postidchild][card_coid].card;

						for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
							H_card_post_1[value.postidchild][card_coid]["kamoku" + kamoku_cnt] += H_post_flag0[value.postidchild][card_coid]["kamoku" + kamoku_cnt];
						}
					}
				}
			}
	}

	logh.putError(G_SCRIPT_INFO, "\u90E8\u7F72\u5358\u4F4D\u96C6\u8A08\u7D50\u679C\u30B3\u30D4\u30FC\u6587\u4F5C\u6210");
	var copyFP = fopen(copy_sql, "w");

	if (copyFP == undefined) {
		logh.putError(G_SCRIPT_WARNING, "\u30B3\u30D4\u30FCSQL:" + copy_sql + " \u306E\u30AA\u30FC\u30D7\u30F3\u306B\u5931\u6557");
		return false;
	}

	for (var value of Object.values(H_post_list)) {
		for (var card_coid of Object.values(A_cardcoid)) //子部署を含まない
		//子部署を含む
		{
			fwrite(copyFP, pactid_num + "\t" + value.postidchild + "\t" + 0 + "\t" + H_post_flag0[value.postidchild][card_coid].charge + "\t");
			fwrite(copyFP, 0 + "\t" + 0 + "\t" + H_post_flag0[value.postidchild][card_coid].aspchargeintax + "\t");
			fwrite(copyFP, H_post_flag0[value.postidchild][card_coid].card + "\t" + card_coid + "\t");

			for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
				fwrite(copyFP, H_post_flag0[value.postidchild][card_coid]["kamoku" + kamoku_cnt] + "\t");
			}

			fwrite(copyFP, nowtime + "\n");
			fwrite(copyFP, pactid_num + "\t" + value.postidchild + "\t" + 1 + "\t" + H_card_post_1[value.postidchild][card_coid].charge + "\t");
			fwrite(copyFP, 0 + "\t" + 0 + "\t" + H_card_post_1[value.postidchild][card_coid].aspchargeintax + "\t");
			fwrite(copyFP, H_card_post_1[value.postidchild][card_coid].card + "\t" + card_coid + "\t");

			for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
				fwrite(copyFP, H_card_post_1[value.postidchild][card_coid]["kamoku" + kamoku_cnt] + "\t");
			}

			fwrite(copyFP, nowtime + "\n");
		}
	}

	fclose(copyFP);
	var A_columns = ["pactid", "postid", "flag", "charge", "aspcharge", "aspexcise", "aspchargeintax", "card", "cardcoid"];

	for (kamoku_cnt = 1;; kamoku_cnt < KAMOKUMAX; kamoku_cnt++) {
		A_columns.push("kamoku" + kamoku_cnt);
	}

	A_columns.push("recdate");
	var ins_res = doCopyInsert("card_post_bill_" + useMonth + "_tb", copy_sql, A_columns);

	if (ins_res != 0) {
		logh.putError(G_SCRIPT_WARNING, "card_post_bill_" + useMonth + "_tb\u3078 pactid[" + pactid_num + "]\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
		dbh.rollback();
	} else //インポート成功
		{
			logh.putError(G_SCRIPT_INFO, "card_post_bill_" + useMonth + "_tb\u3078 pactid[" + pactid_num + "]\u306E\u30C7\u30FC\u30BF\u3092\u30A4\u30F3\u30DD\u30FC\u30C8\u3057\u307E\u3057\u305F\uFF1A" + copy_sql);
		}

	return true;
};

function go_usage(message, argv = "") {
	print("\n\n");
	print(message + ":" + argv + "\n");
	print("php card_calc.php [m|p|y|c]=\u5404\u30D1\u30E9\u30E1\u30FC\u30BF(\u6307\u5B9A\u306A\u3057\u306E\u30C7\u30D5\u30A9\u30EB\u30C8\u5024)\n\n");
	print("\t\t-m={0|1}\t\t\t\u5B9F\u884C\u524D\u306B\u554F\u3044\u5408\u308F\u305B\u308B\u5834\u5408\u306F1(1)\n");
	print("\t\t-p=pactid\t\t\u51E6\u7406\u5BFE\u8C61\u9867\u5BA2\uFF08\u5168\u9867\u5BA2\uFF09\n");
	print("\t\t-y=yyyymm\t\t\u51E6\u7406\u5BFE\u8C61\u8ACB\u6C42\u5E74\u6708\uFF08\u73FE\u5728\u306E\u5E74\u6708\uFF09\n");
	print("\t\t-c=cardcoid\t\t\u51E6\u7406\u5BFE\u8C61\u8ACB\u6C42\u5143\u4F1A\u793EID\uFF08\u5168\u4F1A\u793E\uFF09\n");
	throw die(1);
};

function get_state(H_argx, useMonth) //card_calc_state_tb から、対象年月の処理済　顧客一覧を取得
{
	if (!("dbh" in global)) dbh = undefined;
	var A_detList = Array();
	var A_staList = Array();
	var sql_where = "";

	if (H_argx["-p"] != 0) {
		sql_where = " where pactid = " + H_argx["-p"];
	}

	var sql_str = "select pactid from card_details_" + useMonth + "_tb " + sql_where + " group by pactid";
	var res = dbh.getHash(sql_str);

	for (var value of Object.values(res)) {
		A_detList.push(value.pactid);
	}

	var year = H_argx["-y"].substr(0, 4);
	var month = H_argx["-y"].substr(4, 2);
	sql_str = "select pactid from card_calc_state_tb where targetmonth = '" + year + "-" + month + "-01'";
	var resx = dbh.getHash(sql_str);

	for (var value of Object.values(resx)) {
		A_staList.push(value.pactid);
	}

	if (H_argx["-m"] == 0) {
		A_detList = array_diff(A_detList, A_staList);
	}

	return A_detList;
};

function write_state(pactid, nowtime, H_argx) //同じ顧客、同じ年月で登録されているか確認
{
	{
		if (!("dbh" in global)) dbh = undefined;
		if (!("logh" in global)) logh = undefined;
	}
	var year = H_argx["-y"].substr(0, 4);
	var month = H_argx["-y"].substr(4, 2);
	var sql_str = "select * from card_calc_state_tb where pactid = " + pactid + " and targetmonth = '" + year + "-" + month + "-01'";
	var res = dbh.getHash(sql_str);

	if (res.length > 0) {
		sql_str = "UPDATE card_calc_state_tb SET recdate = '" + nowtime + "' WHERE pactid = " + pactid + " and targetmonth = '" + year + "-" + month + "-01'";
		logh.putError(G_SCRIPT_INFO, "\u96C6\u8A08\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u66F4\u65B0:" + pactid + ":" + H_argx["-y"] + ":" + nowtime);
		logh.putError(G_SCRIPT_INFO, "SQL:" + sql_str);
	} else //20090611森原 PGPOOL_NO_INSERT_LOCK 追加
		{
			sql_str = PGPOOL_NO_INSERT_LOCK + "INSERT INTO card_calc_state_tb values(" + pactid + ",'" + year + "-" + month + "-01','" + nowtime + "')";
			logh.putError(G_SCRIPT_INFO, "\u96C6\u8A08\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u633F\u5165:" + pactid + ":" + year + "-" + month + "-01:" + nowtime);
			logh.putError(G_SCRIPT_INFO, "SQL:" + sql_str);
		}

	dbh.query(sql_str);
};

function get_time() {
	var nowdate = date("H");

	if (nowdate >= ENDTIME) {
		return false;
	}

	return true;
};

function get_kanjo_kamoku(pactid_num) //勘定科目の一覧
{
	if (!("dbh" in global)) dbh = undefined;
	var H_kamoku_list = Array();
	var sql_str = "select kam.kamokuid,kru.code,kru.cardcoid from card_kamoku_tb kam " + "inner join card_kamoku_rel_utiwake_tb kru on kru.pactid = kam.pactid and kru.kamokuid = kam.kamokuid " + "where kru.pactid = " + pactid_num;
	var res = dbh.getHash(sql_str);

	if (res.length < 1) {
		sql_str = "select kam.kamokuid,kru.code,kru.cardcoid from card_kamoku_tb kam " + "inner join card_kamoku_rel_utiwake_tb kru on kru.pactid = kam.pactid and kru.kamokuid = kam.kamokuid " + "where kru.pactid = 0";
		res = dbh.getHash(sql_str);
	}

	for (var value of Object.values(res)) {
		H_kamoku_list[value.cardcoid][value.code] = value.kamokuid;
	}

	return H_kamoku_list;
};

function lock(is_lock, db, nowtime) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = db.escape("card_calc");

	if (is_lock == true) {
		db.begin();
		db.lock("clamptask_tb");
		var sql = "select count(*) from clamptask_tb " + "where command = '" + pre + "' and " + "status = 1";
		var count = db.getOne(sql);

		if (count != 0) {
			db.rollback();
			db.putError(G_SCRIPT_WARNING, "\u591A\u91CD\u52D5\u4F5C");
			return false;
		}

		sql = PGPOOL_NO_INSERT_LOCK + "insert into clamptask_tb(command,status,recdate) " + "values('" + pre + "',1,'" + nowtime + "')";
		db.query(sql);
		db.commit();
	} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + pre + "'";
		db.query(sql);
		db.commit();
	}

	return true;
};

function doCopyInsert(table, filename, A_columns) //ファイルを開く
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	{
		if (!("dbh" in global)) dbh = undefined;
		if (!("logh" in global)) logh = undefined;
	}
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var ins = new TableInserter(logh, dbh, filename + ".sql", true);
	ins.begin(table);

	while (line = fgets(fp)) //tabで区切り配列に
	//要素数チェック
	//カラム名をキーにした配列を作る
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != A_columns.length) {
			logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(A_columns)) {
			H_ins[col] = A_line[idx];
			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_ERROR, filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};

echo("\n\n");