//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ページユーティリティ
//
//作成日：2004/5/17
//作成者：末広
//修正日：2004/5/30 森原 件数を外部から与えられるように修正した
//修正日：2004/6/30 末広 limitをセッションではなく引数から取得するように修正した
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ページング情報生成
//作成日：2004/5/17
//作成者：末広
//
//引数：
//$cnt_sql : 件数参照用ＳＱＬ
//$limit   : ページサイズ
//$start   :
//$O_smarty : smarty オブジェクト
//$lines   ：件数(マイナスなら本引数は使用しない)20040530森原追加
//戻値：
//なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ページング情報生成(高速版：expaln使用)
//作成日：2004/5/17
//作成者：末広
//
//条件が１つの場合のみ動作する
//
//引数：
//$cnt_sql : 件数参照用ＳＱＬ
//$limit   : ページサイズ
//$start   :
//$O_smarty : smarty オブジェクト
//$lines   ：件数(マイナスなら本引数は使用しない)20040530森原追加
//戻値：
//なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
class PageUtil {
	initPaging(cnt_sql, start, limit, O_smarty, lines = -1) //_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
	//SQL実行(件数)
	//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
	//20040530森原修正
	//if($_SESSION[$_SERVER["PHP_SELF"] . ",limit"] > 0){
	//テンプレートに代入
	//ページのリスト
	//カレントページ番号
	//カレントの前ページ番号
	//カレントの次ページ番号
	//ページ番号表示
	//検索ＨＩＴ数
	//$O_smarty->assign("limit", $_SESSION[$_SERVER["PHP_SELF"] . ",limit"]);
	{
		var cntall = lines;
		if (cntall < 0) cntall = GLOBALS.GO_db.getOne(cnt_sql);
		O_smarty.assign("cntall", cntall);
		var page_cnt = 1;

		if (limit > 0) //$page_cnt = floor($cntall / $_SESSION[$_SERVER["PHP_SELF"] . ",limit"]);
			//if(($cntall % $_SESSION[$_SERVER["PHP_SELF"] . ",limit"]) > 0){
			{
				page_cnt = Math.floor(cntall / limit);

				if (cntall % limit > 0) {
					page_cnt++;
				}
			}

		var A_page_list = Array();
		var scnt = start - 5;
		var ecnt = start + 5;

		for (var add_cnt = scnt; add_cnt <= ecnt; add_cnt++) {
			if (add_cnt > 0 && add_cnt <= page_cnt) {
				A_page_list.push(add_cnt);
			}
		}

		O_smarty.assign("rowcnt", H_user_list.length);
		O_smarty.assign("A_plist", A_page_list);
		O_smarty.assign("current", start);
		O_smarty.assign("prev", start - 1);
		O_smarty.assign("next", start + 1);
		O_smarty.assign("pagecnt", page_cnt);
		O_smarty.assign("cntall", cntall);
		O_smarty.assign("limit", limit);
	}

	initPagingExp(cnt_sql, start, limit, O_smarty, lines = -1) //追加
	//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
	//SQL実行(件数)
	//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
	//20040530森原修正
	//テンプレートに代入
	//ページのリスト
	//カレントページ番号
	//カレントの前ページ番号
	//カレントの次ページ番号
	//ページ番号表示
	//検索ＨＩＴ数
	{
		cnt_sql = "explain " + cnt_sql;
		var cntall = lines;

		if (cntall < 0) {
			var pre_cntall = GLOBALS.GO_db.getCol(cnt_sql);
			preg_match("/rows=[0-9]+ /", pre_cntall[1], A_match);
			preg_match("/[0-9]+/", A_match[0], A_match);
			cntall = A_match[0];
		}

		O_smarty.assign("cntall", cntall);
		var page_cnt = 1;

		if (limit > 0) {
			page_cnt = Math.floor(cntall / limit);

			if (cntall % limit > 0) {
				page_cnt++;
			}
		}

		var A_page_list = Array();
		var scnt = start - 5;
		var ecnt = start + 5;

		for (var add_cnt = scnt; add_cnt <= ecnt; add_cnt++) {
			if (add_cnt > 0 && add_cnt <= page_cnt) {
				A_page_list.push(add_cnt);
			}
		}

		O_smarty.assign("rowcnt", H_user_list.length);
		O_smarty.assign("A_plist", A_page_list);
		O_smarty.assign("current", start);
		O_smarty.assign("prev", start - 1);
		O_smarty.assign("next", start + 1);
		O_smarty.assign("pagecnt", page_cnt);
		O_smarty.assign("cntall", cntall);
		O_smarty.assign("limit", limit);
	}

};