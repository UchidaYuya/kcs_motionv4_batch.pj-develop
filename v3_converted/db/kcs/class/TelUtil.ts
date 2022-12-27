//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//電話管理ユーティリティクラス
//
//作成日：2004/05/20
//作成者：末広
//
//2004.11.21 by suehiro NTTドコモ、au、vodafone、TUKAの地域会社プルダウンリストに未確定は表示しない機能を付加
//2004.11.21 by suehiro 電話管理では viewflag を見ない
//2004.11.22 by suehiro 機種切替え時に情報が残る不具合に対応
//2004.11.29 by suehiro 変更時のプラン・パケット表示の不具合に対応
//2004.12.08 by suehiro 閲覧者部署に存在しないユーザも表示
//2005.01.10 by suehiro 不要ロジック count($O_result) を指摘により削除
//2005.01.10 by suehiro blockHTML → htmlspecialchars 指摘により変更
//2005.03.08 by 上杉勝史 Javascript変更(変数nSWを6→5に）
//2005.04.14 by maeda Javascript変更(変数nSWをパラメータで指定可能に）
//2005.05.10 by T.Naka 部署が多いときの高速化、配下の部署チェックを全て削除
//2006.10.20 by houshiyama 電話管理改変に伴う新しい関数集を追加
//
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、配列($A_values)に積む
//キャリア(会社)
//1:全て と 99:不明 は除く
//$pactid があると検索ＵＩモード(現在分のみ)
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、配列($A_values)に積む
//地域会社
//$pactid があると検索ＵＩモード(現在分のみ)
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、配列($A_values)に積む
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、配列($A_values)に積む
//プラン
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、配列($A_values)に積む
//パケット
//FOMA(1)かムーバ(2)のみ
//&$O_form QuickFormオブジェクト
//$name HTML-UI名称
//$label QuickFormオブジェクト.ラベル
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//登録部署所属ユーザー取得SQL
//
//[引　数] $pactid：回線種別
//$postid：キャリア
//[返り値] $A_user：SQLリザルト
//
//2004.12.08 by suehiro 閲覧者部署に存在しないユーザも表示
//
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ポイントステージ取得SQL
//
//[引　数] $pactid：回線種別
//$postid：キャリア
//[返り値] $A_user：SQLリザルト
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//オプション項目取得SQL
//
//[引　数] $cirid：回線種別
//$carid：キャリア
//[返り値] $A_options：SQLリザルト
//
//2005/03/31 s.maeda 現在分の電話管理ではviewflgを条件に加えるよう変更
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、値(ID)と名称を配列に積むJavaScriptソースを返す
//地域会社
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// この関数は廃止 -- 2006/05/10 by T.Naka ****
//function getCarrierIDSQL($pactid="") {
//	if ( $pactid == "") {
//		// 全キャリアを select
//		$sql = "select carid from carrier_tb order by carid";
//	} else {
//		// 修正：且つ表示部署以下 by suehiro 2004.08.03
//		$O_authe = new authority($_SESSION["pactid"]);
//		$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
//		// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
//		$sql = "select carid from tel_tb where pactid=$pactid and postid IN (". join(",", $A_RES ) .") group by carid order by carid";
//	}
//	return $sql;
//}
//
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、値(ID)と名称を配列に積むJavaScriptソースを返す
//マスター管理事業者用に改造
//電話会社と地域会社のみ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//既存データをＤＢから取得し、値(ID)と名称を配列に積むJavaScriptソースを返す
//
//$pactid : ""(空) ... 編集
//指定   ... 検索
//$option : $pactid が指定されているとき(検索時) $option は 無効
//$option 条件文ＳＱＬ
//$cut_kikakutei CUT の場合、NTTドコモ、au、vodafone、TUKAの地域会社の未確定を表示しない
//
//2005/03/31 s.maeda 現在分の電話管理ではプラン、パケット、オプションはviewflgを条件に加えるよう変更
//2005/06/30 miya オプションの場合地域会社関係ないので引数に$syubetsuを追加
//2005/09/26 s.maeda 公私分計フラグ kousiflg を追加 True:公私分計権限あり、false:公私分計権限無し
//2005/09/26 s.maeda 公私分計で使用する契約ＩＤ kousipactid を追加
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//function makeAreaBufferJS($pactid = "",$option="",$cut_kikakutei="",$pastflg = false, $syubetsu = "") {
//ＵＩの表示・非表示制御(検索画面用)
//ＵＩの表示・非表示制御(検索画面用)
//ＵＩの表示・非表示制御(編集画面用)
//2004.11.22 by suehiro 機種切替え時に情報が残る不具合に対応
//ＵＩ生成JavaScript(共通部分)
//正当性チェック
//組み合わせ確認
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//公私分計パターン選択設定ＵＩ(プルダウン)
//2005/09/22 s.Maeda
//
//[引　数] $O_form:form名,$name:プルダウンのname属性,$label:表示用名称,$pactid:契約ID,$carid:キャリアID
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//
//	以下電話管理改変に伴うユーティリティクラス
//
//	作成日：2006/08/23
//	作成者：宝子山
//
//
// 文字列項目、数値項目、日付項目のプルダウン作成クラス
// 機能・・・文字列項目（H_character）、数値項目（H_numerical）、日付項目（H_date）
// 			のプルダウンを作成する
//
//
//機能・・・キャリア選択のプルダウン要素を作成（検索用）
//引数・・・$pactid（契約ID）
//返り値・・・$A_data（キャリアが入った配列）
//
//
//機能・・・エリア選択のプルダウンを作成（検索用）
//引数・・・$carid（キャリアID）
//返り値・・・$A_data（エリアが入った配列）
//
//
//機能・・・回線選択のプルダウンを作成（検索用）
//引数・・・$carid（キャリアID）
//返り値・・・$A_data（回線が入った配列）
//
//
//機能・・・プラン選択のプルダウンを作成（検索用）
//引数・・・$carid（キャリアID）、$arid（地域ID）、$cirid（回線ID）
//返り値・・・$A_data（プランが入った配列）
//変更履歴・・・プラン取得のSQLに、表示させないプランは除外するようにwhere句追加(viewflg=trueのみ表示) 20070827iga
//
//
//機能・・・パケット選択のプルダウンを作成（検索用）
//引数・・・$carid（キャリアID）、$arid（エリアID）、$cirid（回線ID）
//返り値・・・$A_data（パケットが入った配列）
//
//
//機能・・・プレミアクラブ選択のプルダウンを作成
//引数・・・$cirid（回線ID）
//返り値・・・$A_data（プレミアクラブが入った配列）
//
//
//機能・・・オプション選択のチェックボックスを作成
//引数・・・$carid（キャリアID）、$cirid（回線ID）、
//			$view（現在使われていないオプションの表示 true:見せる,false:見せない）
//返り値・・・$A_data（オプションが入った配列）
//
//
//機能・・・公私分計パターン選択のプルダウンを作成
//引数・・・$pactid（契約ID）、$carid（キャリアID）
//返り値・・・$A_data（プレミアクラブが入った配列）
//
//
//機能・・・登録部署所属ユーザー取得しプルダウン用配列作成
//引数・・・$pactid（契約ID）
//		  $postid（部署ID）
//		  $userid（ユーザーID）
//返り値・・・$A_date（結果配列）
//
//
//機能・・・不等号の決定を行う
//引数・・・$con（フォームで選択した値）
//返り値・・・=,<,>
//
//
//機能・・・ページリンク用の配列を作成
//引数・・・$num（リストの件数）
//		  $limit（1ページの表示件数）
//		  $current（現在のページ）
//返り値・・・$A_plist（ページリンク配列）
//
//
//   正当性チェック
//   組み合わせ確認
//
//機能・・・各項目の値がDBにあるかチェックする
//引数・・・$carid（電話会社）
//$arid（地域会社）
//$cirid（回線種別）
//$planid（プラン）
//$packet（パケット）
//$pclubid（プレミアクラブ）
//$options（オプション）
//
//機能・・・○ヶ月後の年月日を作成
//引数・・・$limit_month（何ヶ月先か？）
//返り値・・・$A_date = array(yaer , month , date)
//
//
//機能・・・新規登録確認画面のオプションの表示を作る
//引数・・・$A_option（オプション一覧）
//		  $A_val（選択したオプション）
//返り値・・・$A_date = array(yaer , month , date)
//
//
//機能・・・オプションの値をDB用に変形する
//引数・・・$options（オプション）
//返り値・・・$data（変形、シリアライズされたオプション）
//
//
//機能・・・quickform、addruleで追加するルール（プルダウン未選択をエラーにする）
//引数・・・$arg
//返り値・・・ture,false
//
//
//機能・・・ポストで来たオプションの変形する
//引数・・・$option（ポストのオプション）
//返り値・・・$option（変形されたオプション）
//
//--------------------------------------------------------
//配列から空要素を削除するarray_filterのコールバック関数
//--------------------------------------------------------
//
//  menu、download関数集
//
//
////機能・・・tel_tb,tel_reserve_tbから件数、一覧取得のsql文を作成する
////引数・・・$H_pos（ポストの値《検索条件》）
////			$H_get（ゲットの値《ソート条件》）
////			$H_val（limitの値）
////			$pactid（契約ID）
////			$current_pid（カレントの部署ID）
////			$A_postids（権限情報）
////			$mod（選択部署）
////			$level（カレント部署の階層）
////			$tb（検索対象のテーブル）
////			$A_Cols（補足項目のカラム）
////			$kousi（公私権限）
////			$charge（請求権限）
////			$download（download時）
////返り値・・・$A_sql（二つのsql文）
//
//
//機能・・・一覧表示用sqlのソート文作成
//引数・・・$sort（ソート指定）
//返り値・・・$sort_sql（ソート文）
//
//
//機能・・・一覧表示用sqlのソート文作成（予約用）
//引数・・・$sort（ソート指定）
//返り値・・・$sort_sql（ソート文）
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
//機能・・・オプション検索用のSQL文作成
//引数・・・$option（フォームのoption）
//返り値・・・$sql（sql文）
//
//
//機能・・・親番号一覧を返す（数字のみ番号）
//引数・・・$pactid（契約ID）
//返り値・・・$A_res（含まれていた親番号）
//
//
//購入方式
//
//@author houshiyama
//@since 2008/09/18
//
//@param mixed $O_form
//@param mixed $name
//@param mixed $label
//@param mixed $carid
//@param string $option
//@param string $pactid
//@access public
//@return void
//
//
//makeAreaBufferJS
//
//@author houshiyama
//@since 2008/09/18
//
//@param string $pactid
//@param string $option
//@param string $cut_kikakutei
//@param mixed $pastflg
//@param string $syubetsu
//@param mixed $kousiflg
//@param string $kousipactid
//@access public
//@return void
//
//パケットプラン登録変更用電話会社、回線種別プルダウンの作成

require("HTML/QuickForm.php");

require("TelUtil.php");

function makeCompanySelecter(O_form, name, label, option = "", pactid = "") //_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//carid 取得
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//if ( $pactid == "") {
//// 全キャリアを select
//$sql = "select carid from carrier_tb order by carid";
//} else {
//
//// 修正：且つ表示部署以下 by suehiro 2004.08.03
//$O_authe = new authority($_SESSION["pactid"]);
//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
//$sql = "select carid from tel_tb where pactid=$pactid and postid IN (". join(",", $A_RES ) .") group by carid order by carid";
//}
//SQL実行結果取得
{
	H_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
	var A_carid = Array();

	if (pactid != "") //管理者メニューでpactidが入ってこない.
		{
			var row;
			var sql = "select carid from pact_rel_carrier_tb where pactid=" + pactid;
			var O_result = GLOBALS.GO_db.query(sql);

			while (row = O_result.fetchRow()) {
				A_carid.push(row[0]);
			}

			O_result.free();
		}

	sql = "select carid,carname from carrier_tb";

	if (A_carid.length != 0) {
		sql += " where carid in (" + join(",", A_carid) + ")";
	}

	sql += " order by sort";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	O_result = GLOBALS.GO_db.query(sql);
	var row_count = 0;

	while (row = O_result.fetchRow()) //0:全て と 99:不明 は除く
	{
		var colid = row[0];

		if (!(colid == 0 || colid == 99)) {
			H_data[row[0]] = htmlspecialchars(row[1]);
		}
	}

	O_result.free();
	O_form.addElement("select", name, label, H_data, option);
};

function makeAreaSelecter(O_form, name, label, carid, option = "", pactid = "") {
	if (carid != "") //SQL実行
		//SQL文
		//有効のもののみ表示
		//if($pactid == "") {
		//} else {
		//// 検索用
		//// 修正：且つ表示部署以下 by suehiro 2004.08.03
		//$O_authe = new authority($_SESSION["pactid"]);
		//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
		//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
		//$sql = "select arid from tel_tb where pactid = $pactid and carid= $carid and postid IN (". join(",", $A_RES ) .") group by arid order by arid";
		//if(DEBUG==1) {
		//echo "SQL:".$sql."<br>";
		//}
		//$O_result = $GLOBALS["GO_db"]->query($sql);
		//while ($row =& $O_result->fetchRow()) {
		//$A_arid[] = $row[0];
		//}
		//$O_result->free();
		//if(count($A_arid) != 0){
		//$sql = "select arid,arname from area_tb".
		//" where ".
		//" arid in (".join(",",$A_arid).") ".
		//" order by sort";
		//} else {
		//$sql = "";
		//}
		//}
		//SQL実行
		{
			H_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
			var sql = "select arid,arname from area_tb" + " where " + " carid=" + carid + " " + " order by sort";

			if (sql != "") //SQL実行結果取得
				{
					if (DEBUG == 1) {
						echo("SQL:" + sql + "<br>");
					}

					var O_result = GLOBALS.GO_db.query(sql);

					while (row = O_result.fetchRow()) {
						var colid = row[0];
						H_data[row[0]] = htmlspecialchars(row[1]);
					}

					O_result.free();
				}

			if (H_data.length == 2) {
				delete H_data[-1];
			}
		} else {
		H_data[-1] = "-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
	}

	O_form.addElement("select", name, label, H_data, option);
};

function makeCircuitSelecter(O_form, name, label, carid, option = "", pactid = "") {
	if (carid != "") //SQL実行
		//if($pactid == "") {
		//ID 指定ナシ(新規入力)
		//} else {
		//// 検索用
		//// 修正：且つ表示部署以下 by suehiro 2004.08.03
		//$O_authe = new authority($_SESSION["pactid"]);
		//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
		//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
		//$sql = "select cirid from tel_tb where pactid = $pactid and carid=$carid and postid IN (". join(",", $A_RES ) .") group by cirid order by cirid";
		//$O_result = $GLOBALS["GO_db"]->query($sql);
		//while ($row =& $O_result->fetchRow()) {
		//$A_cirid[] = $row[0];
		//}
		//$O_result->free();
		//if(count($A_cirid) != 0){
		//$sql = "select cirid,cirname from circuit_tb ".
		//" where ".
		//" cirid in (".join(",",$A_cirid).") ".
		//" order by sort";
		//} else {
		//$sql = "";
		//}
		//}
		{
			H_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
			var sql = `select cirid,cirname from circuit_tb where carid=${carid} order by sort`;

			if (sql != "") //SQL実行結果取得
				{
					if (DEBUG == 1) {
						echo("SQL:" + sql + "<br>");
					}

					var O_result = GLOBALS.GO_db.query(sql);

					while (row = O_result.fetchRow()) {
						var colid = row[0];
						H_data[row[0]] = htmlspecialchars(row[1]);
					}

					O_result.free();
				}

			if (H_data.length == 2) {
				delete H_data[-1];
			}
		} else {
		H_data[-1] = "-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
	}

	O_form.addElement("select", name, label, H_data, option);
};

function makePlanSelecter(O_form, name, label, carid, arid, cirid, planid_org = "", pactid = "") //デフォルト値
//SQL実行
{
	H_data[-1] = "\u672A\u9078\u629E";
	var count = 0;

	if (carid != "" && arid != "" && cirid != "") {
		if (planid_org == "") //無効は含まない表示
			//if($pactid=="") {
			//入力UI
			//} else {
			//// 検索用
			//// 修正：且つ表示部署以下 by suehiro 2004.08.03
			//// 無効も含む表示
			//$O_authe = new authority($_SESSION["pactid"]);
			//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
			//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
			//$sql = "select planid from tel_tb where pactid = $pactid and planid is not null and postid IN (". join(",", $A_RES ) .") group by planid order by planid";
			//$O_result = $GLOBALS["GO_db"]->query($sql);
			//while ($row =& $O_result->fetchRow()) {
			//$A_planid[] = $row[0];
			//}
			//$O_result->free();
			//if(count($A_planid) != 0){
			//$sql = "select planid,planname from plan_tb ".
			//"where carid =".$carid." ".
			//"and arid =".$arid." ".
			//"and cirid =".$cirid." ".
			//"and planid in (".join(",",$A_planid).") ".
			//"order by sort";
			//} else {
			//$sql = "";
			//}
			//}
			{
				var sql = "select planid,planname from plan_tb " + "where carid =" + carid + " " + "and arid =" + arid + " " + "and cirid =" + cirid + " " + "order by sort";
			} else //無効も含む表示
			{
				sql = "select planid,planname from plan_tb " + "where carid =" + carid + " " + "and arid =" + arid + " " + "and cirid =" + cirid + " " + "order by sort";
			}

		if (DEBUG == 1) {
			echo("SQL:" + sql + "<br>");
		}

		if (sql != "") //SQL実行結果取得
			{
				var row;
				var O_result = GLOBALS.GO_db.query(sql);
				var row_count = 0;

				while (row = O_result.fetchRow()) {
					var colid = row[0];
					H_data[row[0]] = htmlspecialchars(row[1]);
					count++;
				}

				O_result.free();
			}
	}

	O_form.addElement("select", name, label, H_data, `id='${name}'`);
	return count;
};

function makePacketSelecter(O_form, name, label, carid, arid, cirid, packetid_org = "", pactid = "") //デフォルト値
//SQL実行
{
	H_data[-1] = "\u672A\u9078\u629E";
	var count = 0;

	if (carid != "" && arid != "") {
		if (packetid_org == "") //if ($pactid=="") {
			//入力ＵＩ
			//} else {
			//// 検索用
			//// 修正：且つ表示部署以下 by suehiro 2004.08.03
			//// 無効も含む表示
			//$O_authe = new authority($_SESSION["pactid"]);
			//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
			//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
			//$sql = "select packetid from tel_tb where pactid = $pactid and packetid is not null and postid IN (". join(",", $A_RES ) .") group by packetid order by packetid";
			//$O_result = $GLOBALS["GO_db"]->query($sql);
			//while ($row =& $O_result->fetchRow()) {
			//$A_packetid[] = $row[0];
			//}
			//$O_result->free();
			//if(count($A_packetid) != 0){
			//$sql = "select packetid,packetname from packet_tb ".
			//"where carid = $carid ".
			//"and arid =".$arid." ".
			//"and cirid =".$cirid." ".
			//"and packetid in (".join(",",$A_packetid).") ".
			//"order by sort";
			//} else {
			//$sql = "";
			//}
			//}
			{
				var sql = "select packetid,packetname from packet_tb " + "where carid =" + carid + " " + "and arid =" + arid + " " + "and cirid =" + cirid + " " + "order by sort";
			} else {
			sql = "select packetid,packetname from packet_tb " + "where carid =" + carid + " " + "and arid =" + arid + " " + "and cirid =" + cirid + " " + "order by sort";
		}

		if (DEBUG == 1) {
			echo("SQL:" + sql + "<br>");
		}

		if (sql != "") //SQL実行結果取得
			{
				var row;
				var O_result = GLOBALS.GO_db.query(sql);
				var row_count = 0;

				while (row = O_result.fetchRow()) {
					var colid = row[0];
					H_data[row[0]] = htmlspecialchars(row[1]);
					count++;
				}

				O_result.free();
			}
	}

	O_form.addElement("select", name, label, H_data, `id='${name}'`);
	return count;
};

function makeUserSelecter(O_form, name, label, pactid, postid, userid = "") //デフォルト値
//SQL実行
//2004.12.08 by suehiro 閲覧者部署に存在しないユーザも表示
//SQL実行結果取得
{
	H_data[-1] = "\u672A\u9078\u629E";
	var count = 0;
	var sql = "SELECT userid, username FROM user_tb WHERE pactid=" + pactid + " AND postid='" + postid + "' ";

	if (userid != "") {
		sql += " or userid = '" + userid + "' ";
	}

	sql += " AND type='US' ORDER BY userid";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	var O_result = GLOBALS.GO_db.query(sql);
	var row_count = 0;

	while (row = O_result.fetchRow()) {
		var colid = row[0];
		H_data[row[0]] = htmlspecialchars(row[1]);
		count++;
	}

	O_result.free();
	O_form.addElement("select", name, label, H_data);
	return count;
};

function makePointSelecter(O_form, name, label, carid, arid, cirid, pactid = "") //デフォルト値
//SQL実行
{
	H_data[-1] = "\u672A\u9078\u629E";
	var count = 0;

	if (carid != "" && arid != "" && cirid != "") //if($pactid=="") {
		//} else {
		//// 検索用
		//// 修正：且つ表示部署以下 by suehiro 2004.08.03
		//$O_authe = new authority($_SESSION["pactid"]);
		//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
		//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
		//$sql = "select pointstage from tel_tb where pactid = $pactid and carid = $carid and cirid =$cirid and pointstage is not null and postid IN (". join(",", $A_RES ) .") group by pointstage order by pointstage";
		//$O_result = $GLOBALS["GO_db"]->query($sql);
		//while ($row =& $O_result->fetchRow()) {
		//$A_pointid[] = $row[0];
		//}
		//$O_result->free();
		//if(count($A_pointid) != 0){
		//$sql = "select pointid,pointname from point_tb ".
		//"where ".
		//"pointid in (".join(",",$A_pointid).") ".
		//"order by pointid";
		//} else {
		//$sql = "";
		//}
		//}
		{
			var sql = "select pointid,pointname from point_tb " + "where carid =" + carid + " " + "and cirid =" + cirid + " " + "order by pointid";

			if (DEBUG == 1) {
				echo("SQL:" + sql + "<br>");
			}

			if (sql != "") //SQL実行結果取得
				{
					var row;
					var O_result = GLOBALS.GO_db.query(sql);
					var row_count = 0;

					while (row = O_result.fetchRow()) {
						var colid = row[0];
						H_data[row[0]] = htmlspecialchars(row[1]);
						count++;
					}

					O_result.free();
				}
		}

	O_form.addElement("select", name, label, H_data, `id='${name}'`);
	return count;
};

function makeOptions(O_form, name, label, cirid, carid, col_count = 1, pastflg = false) {
	if (cirid != "" && carid != "") //SQL文
		//電話現在分ではveiwflgを条件に加える
		//オプション
		//$O_form->addGroup($A_chkbox, $name, $label, array('&nbsp;', '&nbsp;', '<br />'));
		//$O_form->addGroup($A_chkbox, $name, $label, array('&nbsp;', '<br />'));
		{
			var sql_str = "SELECT opid, opname FROM option_tb WHERE cirid = " + cirid + " AND carid = " + carid;

			if (pastflg == false) {
				sql_str += " AND viewflg = true";
			}

			sql_str += " ORDER BY sort";

			if (DEBUG == 1) {
				echo(sql_str + "<br>");
			}

			var H_options = GLOBALS.GO_db.getHash(sql_str);

			for (var key in H_options) {
				var value = H_options[key];
				A_chkbox.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<labal><span style=\"width:" + (G_TEL_OPTION_WIDTH - 20) + "px\">" + htmlspecialchars(value.opname) + "</span></labal>"));
			}

			for (var i = 0; i < col_count; i++) {
				if (i == col_count - 1) {
					A_bitween.push("<br />");
				} else {
					A_bitween.push("&nbsp;");
				}
			}

			O_form.addGroup(A_chkbox, name, label, A_bitween);
		}

	return A_chkbox.length;
};

function creareAreaBufferJS(focusout_name = "telno") {
	var jsSource = "<script language=\"Javascript\" src=\"/js/telinfo.js\"></script>\n";
	return jsSource;
};

function makeAreaBufferJS4(formname = "form", focusout_name = "telno", pactid = "") //$starttime = time();
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//キャリアＩＤ取得
//注：引数 $pactid が指定されている場合、tel_tb で使用されている キャリアのみ select します。
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//if ( $pactid == "") {
//全キャリアを select
//} else {
//// 修正：且つ表示部署以下 by suehiro 2004.08.03
//$O_authe = new authority($_SESSION["pactid"]);
//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
//$sql = "select carid from tel_tb where pactid=$pactid and postid IN (". join(",", $A_RES ) .") group by carid order by carid";
//}
//} else {
//// 検索用
//// 修正：且つ表示部署以下 by suehiro 2004.08.03
//$O_authe = new authority($_SESSION["pactid"]);
//$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
//// tel_tb で使用されている キャリアのみ且つ表示部署以下 select
//$sql = "select arid from tel_tb where pactid = $pactid and postid IN (". join(",", $A_RES ) .") group by arid order by arid";
//$O_result = $GLOBALS["GO_db"]->query($sql);
//while ($row =& $O_result->fetchRow()) {
//$A_arid[] = $row[0];
//}
//$O_result->free();
//if(count($A_arid) != 0){
//$sql = "select carid,arid,arname from area_tb".
//" where ".
//" arid in (".join(",",$A_arid).") ".
//" order by sort";
//} else {
//$sql = "";
//}
//}
//イベント振分関数(JavaScript)生成
//共通ブルダウン書換関数(JavaScript)生成
//$endtime = time();
//print "time:".($endtime-$starttime);
{
	var jsSource = "<script language=\"javascript\" type=\"text/javascript\">\n";
	var sql = "select carid from carrier_tb order by carid";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	if (sql != "") {
		var row;
		var O_result = GLOBALS.GO_db.query(sql);
		var row_count = 0;

		while (row = O_result.fetchRow()) {
			A_carid.push(row[0]);
		}

		O_result.free();
	}

	sql = "select carid,arid,arname from area_tb " + " order by sort";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	if (sql != "") //SQL実行結果取得
		{
			O_result = GLOBALS.GO_db.query(sql);
			row_count = 0;

			while (row = O_result.fetchRow()) {
				A_arname[row[0]][row[1]] = htmlspecialchars(row[2]);
			}

			O_result.free();
		}

	if (A_carid.length != 0) {
		row_count = 0;

		for (var carid of Object.values(A_carid)) //0:全て と 99:不明 は除く
		{
			if (!(carid == 0 || carid == 99)) /////////////////////////////////////
				//キャリア毎地域会社取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				/////////////////////////////////////
				//キャリア毎回線種別取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				{
					delete A_data;
					A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
					row_count = 0;

					if (A_arname[carid].length != 0) {
						delete A_ids;
						var A_arname_buf = Object.keys(A_arname[carid]);

						for (var id of Object.values(A_arname_buf)) {
							var label = A_arname[carid][id];
							A_ids.push(id);
							A_data.push(`${id}:${label}`);
							row_count++;
						}

						A_areaid[carid] = A_ids;
					}

					if (row_count == 1) {
						delete A_data[0];
					}

					jsSource += `var arname_${carid} = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
					delete A_data;
					A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
					delete A_ids;
					row_count = 0;

					if (A_cirname[carid].length != 0) {
						var A_cirname_buf = Object.keys(A_cirname[carid]);

						for (var id of Object.values(A_cirname_buf)) {
							A_ids.push(id);
							label = A_cirname[carid][id];
							A_data.push(`${id}:${label}`);
							row_count++;
						}
					}

					A_cirid[carid] = A_ids;

					if (row_count == 1) {
						delete A_data[0];
					}

					jsSource += `var cirname_${carid} = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
				}
		}
	}

	jsSource += "var arname_0 = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";
	jsSource += "var cirname_0 = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";
	jsSource += "function selectCarid(carid_ui,areaid_name) {\n";
	jsSource += `\n\t\t\tif(carid_ui.options.value == -1){ //${caridが選択されたか}\n\t\t\t\t\tvar empty_buf = new Array('-1:-- 選択してください --');\n\t\t\t\t\tCreateSelecter(document.getElementById(areaid_name), empty_buf); \n\t\t\t}\n\t\t`;

	if (A_carid.length != 0) {
		for (var carid of Object.values(A_carid)) {
			jsSource += `\n\t\t\t\t\tif(carid_ui.options.value == ${carid}){ //${caridが選択されたか}\n\t\t\t\t\t\tCreateSelecter(document.getElementById(areaid_name), arname_${carid}); \n\t\t\t\t\t}\n\t\t\t`;
		}
	}

	jsSource += "}\n";
	jsSource += "\n\t\tfunction CreateSelecter(objList, dataArray) \n\t\t{ \n\n\t\t\t//option\u8981\u7D20\u3092\u89AA\u8981\u7D20\u306B\u8FFD\u52A0\u3059\u308B\u524D\u306B\u3059\u3067\u306B\u5B50\u8981\u7D20\u304C\u3042\u308B\u3068\u304D\u306F\u305D\u308C\u3092\u524A\u9664\n\t\t\tnSize = objList.childNodes.length;\n\t\t\twhile ( nSize!=0) {\n\t\t\t\tfor (nLoop = 0; nLoop < nSize; nLoop++){ \n\t\t\t\t\tif (objList.childNodes[nLoop] != undefined) {\n\t\t\t\t\t\t\tobjList.removeChild(objList.childNodes[nLoop]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tnSize = objList.childNodes.length;\n\t\t\t}\n\n\t\t\tvar nMax = dataArray.length;//select\u8981\u7D20\u3078\u4EE3\u5165\u3059\u308B\u5024\u306E\u914D\u5217\u6570 \n\t\t\tvar nLoop = 0;\n\t\t\tfor (nLoop = 0; nLoop < nMax; nLoop++){ \n\t\t\t\t//option\u8981\u7D20\u3092\u4F5C\u6210\n\t\t\t\toAdd = document.createElement('option');\n\n\t\t\t\t//option\u8981\u7D20\u3092\u89AA\u8981\u7D20\uFF08select\uFF09\u3078\u8FFD\u52A0\n\t\t\t\tobjList.appendChild(oAdd);\n\n\t\t\t\t// \u914D\u5217\u3092\u5206\u89E3\n\t\t\t\tvar data = dataArray[nLoop].split(':');\n\t\t\t\tid = data[0].replace(' ','');\n\t\t\t\tname = data[1];\n\n\t\t\t\t//option\u8981\u7D20\u306Evalue\u5C5E\u6027\u306B\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u5024\u3092\u8A2D\u5B9A\n\t\t\t\tobjList.childNodes[nLoop].setAttribute('value',id);\n\n\t\t\t\t//option\u8981\u7D20\u306E\u5B50\u8981\u7D20\u306BnameArray\u914D\u5217\u306E\u5024\u3092\u30C6\u30AD\u30B9\u30C8\u3068\u3057\u3066\u4F5C\u6210\n\t\t\t\toAddx= document.createTextNode(name);\n\n\t\t\t\t//\u3059\u3067\u306B\u5B50\u8981\u7D20\u304C\u3042\u308B\u3068\u304D\u306F\u305D\u308C\u3092\u524A\u9664\n\t\t\t\tif(objList.childNodes[nLoop].firstChild  != undefined)\n\t\t\t\t\tobjList.childNodes[nLoop].removeChild(objList.childNodes[nLoop].firstChild);\n\n\t\t\t\t//\u4F5C\u6210\u3057\u305F\u30C6\u30AD\u30B9\u30C8\u3092\u89AA\u8981\u7D20\uFF08option\uFF09\u3078\u8FFD\u52A0\n\t\t\t\tobjList.childNodes[nLoop].appendChild(oAddx);\n\t\t\t}\n\t\t\t//\u9023\u52D5\u3059\u308B\u65B9\u306Eselect\u8981\u7D20\u306E\u500B\u6570\u3092\u8A2D\u5B9A\u3059\u308B\n\t\t\tobjList.length=nLoop;\n\t\t}\n\t";
	jsSource += "</script>\n";
	return jsSource;
};

function makeAreaBufferJS(pactid = "", option = "", cut_kikakutei = "", pastflg = false, syubetsu = "", kousiflg = false, kousipactid = "") //$starttime = time();
//$jsSource = "<script language=\"javascript\" type=\"text/javascript\">\n";
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//pactid が指定されていた場合 -- 部署配下の情報を得る
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
// この部分まだ開発中で完全動作しません。最終的には不要かも 2006/05/10 T.Naka****
//	if( $pactid != "") {
//		$O_authe = new authority($_SESSION["pactid"]);
//		$A_RES = $O_authe->getFollowerPost($_SESSION["current_postid"],$_SESSION["pactid"]);
//		
//		$sql = "select " .
//				"tel.carid, ".	// 0
//				"tel.arid, ".	// 1
//					"ar.arname, ".	// 2
//					"ar.sort, ".		// 3
//				"tel.cirid, ".	// 4
//					"cir.cirname, ".	// 5
//					"cir.sort, ".	// 6
//				"tel.planid, ".	// 7
//					"plan.planname, ".	// 8
//					"plan.sort, ".	// 9
//				"tel.packetid, ".	// 10
//					"packet.packetname, ".	// 11
//					"packet.sort, ".	// 12
//				"tel.pointstage, ".	// 13
//					"pt.pointname, ".	// 14
//					"pt.sort " .	// 15
//			"from tel_tb tel " .
//			"inner join area_tb ar on ar.arid=tel.arid " .
//			"inner join circuit_tb cir on cir.carid=tel.carid and cir.cirid=tel.cirid " .
//			"left outer join plan_tb plan on plan.planid=tel.planid " .
//			"left outer join packet_tb packet on packet.packetid=tel.packetid " .
//			"left outer join point_tb pt on pt.pointid=tel.pointstage " .
//			"where tel.pactid=" . $pactid . " " .
//			"and tel.postid IN (". join(",", $A_RES ) .") ".
//			"group by " .
//				"tel.carid, ".	// 0
//				"tel.arid, ".	// 1
//					"ar.arname, ".	// 2
//					"ar.sort, ".		// 3
//				"tel.cirid, ".	// 4
//					"cir.cirname, ".	// 5
//					"cir.sort, ".	// 6
//				"tel.planid, ".	// 7
//					"plan.planname, ".	// 8
//					"plan.sort, ".	// 9
//				"tel.packetid, ".	// 10
//					"packet.packetname, ".	// 11
//					"packet.sort, ".	// 12
//				"tel.pointstage, ".	// 13
//					"pt.pointname, ".	// 14
//					"pt.sort " ;	// 15
//		
//		if(DEBUG==1) {
//			echo "SQL:".$sql."<br>";
//		}
//		// SQL実行
//		$O_result = $GLOBALS["GO_db"]->query($sql);
//		$row_count = 0;
//		while ($row =& $O_result->fetchRow()) {
//			
//			//// キャリアＩＤ取得
//			$A_carid[] = $row[0];
//			
//			//// 地域会社ＩＤ取得
//			// "select carid,arid,arname from area_tb" . " order by sort";
//			// 2004.11.21 by suehiro NTTドコモ、au、vodafone、TUKAの地域会社プルダウンリストに未確定は表示しない
//			if ( $cut_kikakutei == "CUT") { // CUTの場合、未確定を除く
//				$area_carid  = $row[0];
//				$area_arid   = $row[1];
//				$area_arname = $row[2];
//				if($area_arname == "未確定" && $area_carid == 1) {
//					continue;
//				}
//				if($area_arname == "未確定" && $area_carid == 3) {
//					continue;
//				}
//				if($area_arname == "未確定" && $area_carid == 4) {
//					continue;
//				}
//				if($area_arname == "未確定" && $area_carid == 5) {
//					continue;
//				}
//			}
//			
//			$A_arname[$area_carid][$area_arid] = htmlspecialchars($area_arname);
//			
//			//// 回線種別ＩＤ取得
//			// "select carid,cirid,cirname from circuit_tb " . " order by sort";
//			$A_cirname[$row[0]][$row[4]] = $row[5];
//			
//			//// プラン取得
//			// "select carid,arid,cirid,planid,planname from plan_tb " . " order by sort";
//			$A_plan_data[$row[0]][$row[1]][$row[4]][$row[7]] = $row[8];
//			
//			//// パケット取得
//			// "select carid,arid,cirid,packetid,packetname from packet_tb " . " order by sort";
//			$A_packet_data[$row[0]][$row[1]][$row[4]][$row[10]] = $row[11];
//			
//			//// ポイントステージ取得
//			// "select carid,cirid,pointid,pointname from point_tb ". " order by sort";
//			$A_point_data[$row[0]][$row[1]][$row[13]] = $row[14];
//		}
//		$O_result->free();
//	}
//
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//pactid が指定されていなかった場合 -- マスター一覧を得る
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//else{ // pactid == ""	// pactに関わらず全てマスターを出す
//// キャリアＩＤ取得
//全キャリアを select
//SQL実行
//// 地域会社ＩＤ取得
//// 回線種別ＩＤ取得
//// プラン取得
//// パケット取得
//// ポイントステージ取得
//} // END if pactid
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//オプション取得
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//電話現在分ではveiwflgを条件に加える
//SQL実行結果取得
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//公私分計パターン取得
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//全キャリアＩＤ取得
{
	var row;
	jsSource += "var beforeCirid = ''\n";
	var sql = "select carid from carrier_tb order by carid";
	var O_result = GLOBALS.GO_db.query(sql);
	var row_count = 0;

	while (row = O_result.fetchRow()) {
		A_carid.push(row[0]);
	}

	sql = "select carid,arid,arname from area_tb " + " order by sort";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) //2004.11.21 by suehiro NTTドコモ、au、vodafone、TUKAの地域会社プルダウンリストに未確定は表示しない
	{
		if (cut_kikakutei == "CUT") {
			var area_carid = row[0];
			var area_arid = row[1];
			var area_arname = row[2];

			if (area_arname == "\u672A\u78BA\u5B9A" && area_carid == 1) {
				continue;
			}

			if (area_arname == "\u672A\u78BA\u5B9A" && area_carid == 3) {
				continue;
			}

			if (area_arname == "\u672A\u78BA\u5B9A" && area_carid == 4) {
				continue;
			}

			if (area_arname == "\u672A\u78BA\u5B9A" && area_carid == 5) {
				continue;
			}
		}

		A_arname[row[0]][row[1]] = htmlspecialchars(row[2]);
	}

	sql = "select carid,cirid,cirname from circuit_tb" + " order by sort";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) {
		A_cirname[row[0]][row[1]] = row[2];
	}

	sql = "select carid,arid,cirid,planid,planname from plan_tb ";

	if (option != "") //電話過去分ではveiwflgを条件に加えない
		{
			if (pastflg == true) //電話現在分ではveiwflgを条件に加える
				{
					sql += `where ${option} `;
				} else {
				sql += `where viewflg = true and ${option} `;
			}
		} else //電話現在分ではveiwflgを条件に加える
		{
			if (pastflg == false) {
				sql += "where viewflg = true ";
			}
		}

	sql += " order by sort";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) {
		A_plan_data[row[0]][row[1]][row[2]][row[3]] = row[4];
	}

	sql = "select carid,arid,cirid,packetid,packetname from packet_tb ";

	if (option != "") //電話過去分ではveiwflgを条件に加えない
		{
			if (pastflg == true) //電話現在分ではveiwflgを条件に加える
				{
					sql += `where ${option} `;
				} else {
				sql += `where viewflg = true and ${option} `;
			}
		} else //電話現在分ではveiwflgを条件に加える
		{
			if (pastflg == false) {
				sql += "where viewflg = true ";
			}
		}

	sql += "order by sort";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) {
		A_packet_data[row[0]][row[1]][row[2]][row[3]] = row[4];
	}

	sql = "select carid,cirid,pointid,pointname from point_tb " + "order by pointid";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) {
		A_point_data[row[0]][row[1]][row[2]] = row[3];
	}

	O_result.free();
	sql = "select carid,cirid,opid,opname from option_tb ";

	if (pastflg == false) {
		sql += "where viewflg = true ";
	}

	sql += "order by sort";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	O_result = GLOBALS.GO_db.query(sql);
	row_count = 0;

	while (row = O_result.fetchRow()) {
		A_option_data[row[0]][row[1]][row[2]] = row[3];
	}

	O_result.free();

	if (kousiflg == true) {
		if (kousipactid != "") {
			sql = "select krp.carid, krp.patternid, kp.patternname " + "from kousi_rel_pact_tb krp inner join kousi_pattern_tb kp on krp.patternid = kp.patternid " + "where krp.pactid = " + kousipactid + " " + "order by krp.patternid";
		} else {
			sql = "";
		}

		if (DEBUG == 1) {
			echo("SQL:" + sql + "<br>");
		}

		if (sql != "") //SQL実行結果取得
			{
				O_result = GLOBALS.GO_db.query(sql);
				row_count = 0;

				while (row = O_result.fetchRow()) {
					A_patternname[row[0]][row[1]] = htmlspecialchars(row[2]);
				}

				O_result.free();
			}
	}

	jsSource += "var arname = new Array(); \n";
	jsSource += "var cirname = new Array(); \n";
	jsSource += "var plan = new Array(); \n";
	jsSource += "var packet = new Array(); \n";
	jsSource += "var point = new Array(); \n";
	jsSource += "var option = new Array(); \n";
	jsSource += "var kousipattern = new Array(); \n";

	if (A_carid.length != 0) {
		row_count = 0;

		for (var carid of Object.values(A_carid)) //0:全て と 99:不明 は除く
		{
			if (!(carid == 0 || carid == 99)) /////////////////////////////////////
				//キャリア毎地域会社取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				/////////////////////////////////////
				//キャリア毎回線種別取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				{
					delete A_data;
					A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
					row_count = 0;

					if (A_arname[carid].length != 0) {
						delete A_ids;
						var A_arname_buf = Object.keys(A_arname[carid]);

						for (var id of Object.values(A_arname_buf)) {
							var label = A_arname[carid][id];
							A_ids.push(id);
							A_data.push(`${id}:${label}`);
							row_count++;
						}

						A_areaid[carid] = A_ids;
					}

					if (row_count == 1) {
						delete A_data[0];
					}

					jsSource += `arname[${carid}] = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
					delete A_data;
					A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
					delete A_ids;
					row_count = 0;

					if (A_cirname[carid].length != 0) {
						var A_cirname_buf = Object.keys(A_cirname[carid]);

						for (var id of Object.values(A_cirname_buf)) {
							A_ids.push(id);
							label = A_cirname[carid][id];
							A_data.push(`${id}:${label}`);
							row_count++;
						}
					}

					A_cirid[carid] = A_ids;

					if (row_count == 1) {
						delete A_data[0];
					}

					jsSource += `cirname[${carid}] = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";

					if (kousiflg == true) /////////////////////////////////////
						//キャリア毎公私分計パターン取得
						//配列部(JavaScript)生成
						/////////////////////////////////////
						//SQL実行結果取得
						//JavaScript 中文
						//JavaScript 後文
						{
							delete A_data;
							A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
							row_count = 0;

							if (A_patternname[carid].length != 0) {
								delete A_ids;
								var A_patternname_buf = Object.keys(A_patternname[carid]);

								for (var id of Object.values(A_patternname_buf)) {
									label = A_patternname[carid][id];
									A_ids.push(id);
									A_data.push(`${id}:${label}`);
									row_count++;
								}

								A_patternid[carid] = A_ids;
							}

							if (row_count == 1) {
								delete A_data[0];
							}

							jsSource += `kousipattern[${carid}] = new Array(" `;
							jsSource += join("\",\"", A_data);
							jsSource += " \");\n";
						}
				}
		}
	}

	jsSource += "arname[0] = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";
	jsSource += "cirname[0] = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";

	if (kousiflg == true) {
		jsSource += "kousipattern[0] = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";
	}

	jsSource += "function selectCarid() {\n";

	if (syubetsu == "") {
		jsSource += `\n\t\t\t\tvar carid = document.getElementById('carid').value;\n\t\t\t\tif( carid == -1){ //${caridが選択されたか}\n\t\t\t\t\t\tvar empty_buf = new Array('-1:-- 選択してください --');\n\t\t\t\t\t\tCreateSelecter(document.getElementById('arname'), empty_buf); \n\t\t\t\t\t\tCreateSelecter(document.getElementById('cirname'), empty_buf);`;

		if (kousiflg == true) {
			jsSource += "CreateSelecter(document.getElementById('kousisel'), empty_buf);";
		}

		jsSource += "}";

		if (A_carid.length != 0) {
			jsSource += "else {\n";
			jsSource += "\n\t\t\t\tCreateSelecter(document.getElementById('arname'), arname[carid]); \n\t\t\t\tCreateSelecter(document.getElementById('cirname'), cirname[carid]);";

			if (kousiflg == true) {
				jsSource += "CreateSelecter(document.getElementById('kousisel'), kousipattern[carid]);";
			}

			jsSource += "}\n";
		}
	} else {
		jsSource += `\n\t\t\t\tvar carid = document.getElementById('carid').value;\n\t\t\t\tif( carid == -1){ //${caridが選択されたか}\n\t\t\t\t\t\tvar empty_buf = new Array('-1:-- 選択してください --');\n\t\t\t\t\t\tCreateSelecter(document.getElementById('cirname'), empty_buf);\n\t\t\t\t}\n\t\t\t`;

		if (A_carid.length != 0) {
			jsSource += "else {\n";
			jsSource += "\n\t\t\t\tCreateSelecter(document.getElementById('cirname'), cirname[carid]); \n\t\t\t";
			jsSource += "}\n";
		}
	}

	jsSource += "selectChange();\n";
	jsSource += "}\n";

	if (A_carid.length != 0) {
		for (var carid of Object.values(A_carid)) {
			if (A_areaid[carid].length == 0) {
				continue;
			}

			if (A_cirid[carid].length == 0) {
				continue;
			}

			jsSource += `plan[${carid}] = new Array();\n`;
			jsSource += `packet[${carid}] = new Array();\n`;
			jsSource += `point[${carid}] = new Array();\n`;
			jsSource += `option[${carid}] = new Array();\n`;

			for (var areaid of Object.values(A_areaid[carid])) {
				jsSource += `plan[${carid}][${areaid}] = new Array();\n`;
				jsSource += `packet[${carid}][${areaid}] = new Array();\n`;
				jsSource += `point[${carid}][${areaid}] = new Array();\n`;
				jsSource += `option[${carid}][${areaid}] = new Array();\n`;
			}
		}
	}

	if (A_carid.length != 0) {
		for (var carid of Object.values(A_carid)) {
			if (A_areaid[carid].length == 0) {
				continue;
			}

			if (A_cirid[carid].length == 0) {
				continue;
			}

			for (var areaid of Object.values(A_areaid[carid])) {
				for (var cirid of Object.values(A_cirid[carid])) /////////////////////////////////////
				//キャリア・地域会社・電話種別毎プラン取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				/////////////////////////////////////
				//キャリア・地域会社・電話種別毎パケット取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				{
					delete A_data;
					A_data.push("-1:\u672A\u9078\u629E");

					if (A_plan_data[carid][areaid][cirid].length != 0) {
						row_count = 0;
						var A_plan_buf = Object.keys(A_plan_data[carid][areaid][cirid]);

						for (var id of Object.values(A_plan_buf)) {
							label = A_plan_data[carid][areaid][cirid][id];
							A_data.push(`${id}:${label}`);
						}
					}

					jsSource += `plan[${carid}][${areaid}][${cirid}] = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
					delete A_data;
					A_data.push("-1:\u672A\u9078\u629E");

					if (A_packet_data[carid][areaid][cirid].length != 0) {
						row_count = 0;
						var A_packet_buf = Object.keys(A_packet_data[carid][areaid][cirid]);

						for (var id of Object.values(A_packet_buf)) {
							label = A_packet_data[carid][areaid][cirid][id];
							A_data.push(`${id}:${label}`);
						}
					}

					jsSource += `packet[${carid}][${areaid}][${cirid}] = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
				}
			}
		}
	}

	if (A_carid.length != 0) {
		for (var carid of Object.values(A_carid)) {
			if (A_cirid[carid].length == 0) {
				continue;
			}

			for (var cirid of Object.values(A_cirid[carid])) /////////////////////////////////////
			//キャリア・地域会社・電話種別毎ポイント取得
			//配列部(JavaScript)生成
			/////////////////////////////////////
			//SQL実行結果取得
			//SQL実行結果取得
			{
				delete A_data;
				A_data.push("-1:\u672A\u9078\u629E");

				if (A_point_data[carid][cirid].length != 0) //JavaScript 前文
					//JavaScript 中文
					//JavaScript 後文
					{
						row_count = 0;
						var A_point_buf = Object.keys(A_point_data[carid][cirid]);

						for (var id of Object.values(A_point_buf)) {
							label = A_point_data[carid][cirid][id];
							A_data.push(`${id}:${label}`);
						}

						jsSource += `point[${carid}][${cirid}] = new Array(" `;
						jsSource += join("\",\"", A_data);
						jsSource += " \");\n";
					}

				delete A_data;

				if (A_option_data[carid][cirid].length != 0) //JavaScript 前文
					//JavaScript 中文
					{
						row_count = 0;
						var A_option_buf = Object.keys(A_option_data[carid][cirid]);

						for (var id of Object.values(A_option_buf)) {
							label = A_option_data[carid][cirid][id];
							A_data.push(`${id}:${label}`);
						}

						jsSource += `option[${carid}][${cirid}] = new Array(" `;
						if (A_data.length > 0) jsSource += join("\",\"", A_data);
						jsSource += " \");\n";
					}
			}
		}
	}

	return jsSource;
};

function makeAreaBufferJS_NULL(focusout_name) //イベント振分関数(JavaScript)生成
{
	jsSource += "\n\t\tfunction selectChange() {\n\t\t\t// \u30D7\u30EB\u30C0\u30A6\u30F3\u304B\u3089\u30D5\u30A9\u30FC\u30AB\u30B9\u3092\u306F\u305A\u3059\n\t\t\tdocument.getElementById('" + focusout_name + "').focus();\n\t\t}\n\t";
	return jsSource;
};

function makeAreaBufferJS_changeSelector_SEARCH(focusout_name) //イベント振分関数(JavaScript)生成
{
	jsSource += `\n\t\tfunction selectChange() {\n\t\t\tvar changed = false;\n\t\t\tvar selected_carid = document.getElementById('carid').value;\n\t\t\tvar selected_arid = document.getElementById('arname').value;\n\t\t\tvar selected_cirid = document.getElementById('cirname').value;\n\n\t\t\tdocument.getElementById('plan_view_th').style.display = 'none';\n\t\t\tdocument.getElementById('plan_view_td').style.display = 'none';\n\t\t\tdocument.getElementById('plan').style.display = 'none';\n\t\t\tdocument.getElementById('packet_view_th').style.display = 'none';\n\t\t\tdocument.getElementById('packet_view_td').style.display = 'none';\n\t\t\tdocument.getElementById('packet').style.display = 'none';\n\n\t\t\tif( plan[selected_carid] != undefined) {\n\t\t\t\tif( plan[selected_carid][selected_arid] != undefined) {\n\t\t\t\t\tif( plan[selected_carid][selected_arid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(plan[selected_carid][selected_arid][selected_cirid].length > 1) {\n\t\t\t\t\t\t\tCreateSelecter(document.getElementById('plan'), plan[selected_carid][selected_arid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('plan_view_th').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('plan_view_td').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('plan').style.display = 'block';\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tif( packet[selected_carid] != undefined) {\n\t\t\t\tif( packet[selected_carid][selected_arid] != undefined) {\n\t\t\t\t\tif( packet[selected_carid][selected_arid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(packet[selected_carid][selected_arid][selected_cirid].length > 1) {\n\t\t\t\t\t\t\tCreateSelecter(document.getElementById('packet'), packet[selected_carid][selected_arid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('packet_view_th').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('packet_view_td').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('packet').style.display = 'block';\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif( beforeCirid != selected_cirid ) {\n\n\t\t\t\tbeforeCirid = selected_cirid;\n\n\t\t\t\tdocument.getElementById('docomo_point_view_th').style.display = 'none';\n\t\t\t\tdocument.getElementById('docomo_point_view_td').style.display = 'none';\n\t\t\t\tdocument.getElementById('docomo_point').style.display = 'none';\n\t\t\t\tdocument.getElementById('option_view').style.display = 'none';\n\n\t\t\t\tif( point[selected_carid] != undefined) {\n\t\t\t\t\tif( point[selected_carid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(point[selected_carid][selected_cirid].length > 1) {\n\t\t\t\t\t\t\tCreateSelecter(document.getElementById('docomo_point'), point[selected_carid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('docomo_point_view_th').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('docomo_point_view_td').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('docomo_point').style.display = 'block';\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif( option[selected_carid] != undefined) {\n\t\t\t\t\tif( option[selected_carid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(option[selected_carid][selected_cirid].length > 1) {\n\t\t\t\t\t\t\tCreateOptions(document.getElementById('option_tb'), option[selected_carid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('option_view').style.display = 'block';\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\t// プルダウンからフォーカスをはずす\n\t\t\tdocument.getElementById('${focusout_name}').focus();\n\n\t\t\t//全て(プラン。パケット、プレミアステージ)が非表示の場合、段も非表示\n\t\t\tif ( document.getElementById('plan_view_th').style.display == 'none' &&\n\t\t\t\t document.getElementById('packet_view_th').style.display == 'none' &&\n\t\t\t\t document.getElementById('docomo_point_view_th').style.display == 'none' ) {\n\t\t\t\tif (document.getElementById('plans_tr') != undefined) {\n\t\t\t\t\tdocument.getElementById('plans_tr').style.display = 'none';\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tif (document.getElementById('plans_tr') != undefined) {\n\t\t\t\t\tdocument.getElementById('plans_tr').style.display = 'block';\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t`;
	return jsSource;
};

function makeAreaBufferJS_changeSelector_EDIT(focusout_name) //イベント振分関数(JavaScript)生成
{
	var jsSource = "\n\t\tfunction selectChange() {\n\t\t\tvar changed = false;\n\t\t\tvar selected_carid = document.getElementById('carid').value;\n\t\t\tvar selected_arid = document.getElementById('arname').value;\n\t\t\tvar selected_cirid = document.getElementById('cirname').value;\n\n\t\t\tdocument.getElementById('plan_view').style.display = 'none';\n\t\t\tdocument.getElementById('plan').style.display = 'none';\n\t\t\tdocument.getElementById('packet_view').style.display = 'none';\n\t\t\tdocument.getElementById('packet').style.display = 'none';\n\n\t\t\t// 2004.11.22 by suehiro \u6A5F\u7A2E\u5207\u66FF\u3048\u6642\u306B\u60C5\u5831\u304C\u6B8B\u308B\u4E0D\u5177\u5408\u306B\u5BFE\u5FDC\n\t\t\tdocument.getElementById('plan').value = -1;\n\t\t\tdocument.getElementById('packet').value = -1;\n\n\t\t\tif(document.getElementById('docomo_plan_comment') != undefined) {\n\t\t\t\tdocument.getElementById('docomo_plan_comment').style.display = 'none';\n\t\t\t}\n\n\t\t\tif( plan[selected_carid] != undefined) {\n\t\t\t\tif( plan[selected_carid][selected_arid] != undefined) {\n\t\t\t\t\tif( plan[selected_carid][selected_arid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(plan[selected_carid][selected_arid][selected_cirid].length > 1) {\n\t\t\t\t\t\t\tCreateSelecter(document.getElementById('plan'), plan[selected_carid][selected_arid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('plan_view').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('plan').style.display = 'block';\n\t\t\t\t\t\t\tif(document.getElementById('docomo_plan_comment') != undefined) {\n\t\t\t\t\t\t\t\tif (selected_carid == " + DOCOMOCARID + ") {\n\t\t\t\t\t\t\t\t\tdocument.getElementById('docomo_plan_comment').style.display = 'block';\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tif( packet[selected_carid] != undefined) {\n\t\t\t\tif( packet[selected_carid][selected_arid] != undefined) {\n\t\t\t\t\tif( packet[selected_carid][selected_arid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(packet[selected_carid][selected_arid][selected_cirid].length > 1) {\n\t\t\t\t\t\t\tCreateSelecter(document.getElementById('packet'), packet[selected_carid][selected_arid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('packet_view').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('packet').style.display = 'block';\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif( beforeCirid != selected_cirid ) {\n\n\t\t\t\tbeforeCirid = selected_cirid;\n\n\t\t\t\tdocument.getElementById('docomo_point_view').style.display = 'none';\n\t\t\t\tdocument.getElementById('docomo_point').style.display = 'none';\n\t\t\t\tdocument.getElementById('option_view').style.display = 'none';\n\n\t\t\t\t// 2004.11.22 by suehiro \u6A5F\u7A2E\u5207\u66FF\u3048\u6642\u306B\u60C5\u5831\u304C\u6B8B\u308B\u4E0D\u5177\u5408\u306B\u5BFE\u5FDC\n\t\t\t\tdocument.getElementById('docomo_point').value = -1;\n\t\t\t\t// \u30AA\u30D7\u30B7\u30E7\u30F3\uFF35\uFF29\u30AF\u30EA\u30A2\n\t\t\t\tobjList = document.getElementById('option_tb');\n\t\t\t\tnSize = objList.childNodes.length;\n\t\t\t\twhile ( nSize!=0) {\n\t\t\t\t\tfor (nLoop = 0; nLoop < nSize; nLoop++){ \n\t\t\t\t\t\tif (objList.childNodes[nLoop] != undefined) {\n\t\t\t\t\t\t\t\tobjList.removeChild(objList.childNodes[nLoop]);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tnSize = objList.childNodes.length;\n\t\t\t\t}\n\n\t\t\t\tif( point[selected_carid] != undefined) {\n\t\t\t\t\tif( point[selected_carid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(point[selected_carid][selected_cirid].length > 1) {\n\n\t\t\t\t\t\t\tCreateSelecter(document.getElementById('docomo_point'), point[selected_carid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('docomo_point_view').style.display = 'block';\n\t\t\t\t\t\t\tdocument.getElementById('docomo_point').style.display = 'block';\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif( option[selected_carid] != undefined) {\n\t\t\t\t\tif( option[selected_carid][selected_cirid] != undefined) {\n\t\t\t\t\t\tchanged = true;\n\t\t\t\t\t\tif(option[selected_carid][selected_cirid].length > 1) {\n\t\t\t\t\t\t\tCreateOptions(document.getElementById('option_tb'), option[selected_carid][selected_cirid]); \n\t\t\t\t\t\t\tdocument.getElementById('option_view').style.display = 'block';\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t";
	return jsSource;
};

function makeAreaBufferJS_common(col_count = 1) //共通ブルダウン書換関数(JavaScript)生成
//共通チェックボックス書換関数(JavaScript)生成
{
	jsSource += "\n\t\tfunction CreateSelecter(objList, dataArray) \n\t\t{ \n\n\t\t\t//option\u8981\u7D20\u3092\u89AA\u8981\u7D20\u306B\u8FFD\u52A0\u3059\u308B\u524D\u306B\u3059\u3067\u306B\u5B50\u8981\u7D20\u304C\u3042\u308B\u3068\u304D\u306F\u305D\u308C\u3092\u524A\u9664\n\t\t\tnSize = objList.childNodes.length;\n\t\t\twhile ( nSize!=0) {\n\t\t\t\tfor (nLoop = 0; nLoop < nSize; nLoop++){ \n\t\t\t\t\tif (objList.childNodes[nLoop] != undefined) {\n\t\t\t\t\t\t\tobjList.removeChild(objList.childNodes[nLoop]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tnSize = objList.childNodes.length;\n\t\t\t}\n\n\t\t\tif(dataArray == undefined ) {\n\t\t\t\tvar dataArray = new Array(\"-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n\t\t\t}\n\n\t\t\tvar nMax = dataArray.length;//select\u8981\u7D20\u3078\u4EE3\u5165\u3059\u308B\u5024\u306E\u914D\u5217\u6570 \n\t\t\tvar nLoop = 0;\n\t\t\tfor (nLoop = 0; nLoop < nMax; nLoop++){ \n\t\t\t\t//option\u8981\u7D20\u3092\u4F5C\u6210\n\t\t\t\toAdd = document.createElement('option');\n\n\t\t\t\t//option\u8981\u7D20\u3092\u89AA\u8981\u7D20\uFF08select\uFF09\u3078\u8FFD\u52A0\n\t\t\t\tobjList.appendChild(oAdd);\n\n\t\t\t\t// \u914D\u5217\u3092\u5206\u89E3\n\t\t\t\tvar data = dataArray[nLoop].split(':');\n\t\t\t\tid = data[0].replace(' ','');\n\t\t\t\tname = data[1];\n\n\t\t\t\t//option\u8981\u7D20\u306Evalue\u5C5E\u6027\u306B\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u5024\u3092\u8A2D\u5B9A\n\t\t\t\tobjList.childNodes[nLoop].setAttribute('value',id);\n\n\t\t\t\t//option\u8981\u7D20\u306E\u5B50\u8981\u7D20\u306BnameArray\u914D\u5217\u306E\u5024\u3092\u30C6\u30AD\u30B9\u30C8\u3068\u3057\u3066\u4F5C\u6210\n\t\t\t\toAddx= document.createTextNode(name);\n\n\t\t\t\t//\u3059\u3067\u306B\u5B50\u8981\u7D20\u304C\u3042\u308B\u3068\u304D\u306F\u305D\u308C\u3092\u524A\u9664\n\t\t\t\tif(objList.childNodes[nLoop].firstChild  != undefined)\n\t\t\t\t\tobjList.childNodes[nLoop].removeChild(objList.childNodes[nLoop].firstChild);\n\n\t\t\t\t//\u4F5C\u6210\u3057\u305F\u30C6\u30AD\u30B9\u30C8\u3092\u89AA\u8981\u7D20\uFF08option\uFF09\u3078\u8FFD\u52A0\n\t\t\t\tobjList.childNodes[nLoop].appendChild(oAddx);\n\t\t\t}\n\t\t\t//\u9023\u52D5\u3059\u308B\u65B9\u306Eselect\u8981\u7D20\u306E\u500B\u6570\u3092\u8A2D\u5B9A\u3059\u308B\n\t\t\tobjList.length=nLoop;\n\t\t}\n\t";
	jsSource += "\n\t\tfunction CreateOptions(objList,objArray)\n\t\t{\n\n\t\t\tnSize = objList.childNodes.length;\n\t\t\twhile ( nSize!=0) {\n\t\t\t\tfor (nLoop = 0; nLoop < nSize; nLoop++){ \n\t\t\t\t\tif (objList.childNodes[nLoop] != undefined) {\n\t\t\t\t\t\t\tobjList.removeChild(objList.childNodes[nLoop]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tnSize = objList.childNodes.length;\n\t\t\t}\n\n\t\t\tif(objArray == undefined ) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\taddTD = document.createElement('TD'); \n\n\t\t\tvar nSW = " + col_count + ";\t// \uFF11\u884C\u306B\u8868\u793A\u3059\u308B\u30AA\u30D7\u30B7\u30E7\u30F3\u6570\n\n\t\t\tvar nMax = objArray.length;//\u8981\u7D20\u3078\u4EE3\u5165\u3059\u308B\u5024\u306E\u914D\u5217\u6570 \n\t\t\tvar nLoop = 0; \n\t\t\tfor (nLoop = 0; nLoop < nMax; nLoop++){ \n\n\t\t\t\t// \u914D\u5217\u3092\u5206\u89E3\n\t\t\t\tvar data = objArray[nLoop].split(':');\n\t\t\t\tid = data[0].replace(' ','');\n\t\t\t\tname = data[1];\n\n\t\t\t\tspanNode=document.createElement('SPAN'); \n\t\t\t\tspanNode.style.setAttribute('width','" + G_TEL_OPTION_WIDTH + "px'); \n\n\t\t\t\tviewText=document.createElement('INPUT'); \n\t\t\t\tviewText.setAttribute('type','checkbox'); \n\t\t\t\tviewText.setAttribute('name','options['+id+']'); \n\t\t\t\tviewText.setAttribute('value',1); \n\t\t\t\tviewText.setAttribute('checked',true); \n\t\t\t\tviewText.setAttribute('id','op_'+id); \n\t\t\t\tspanNode.appendChild(viewText);\n\n\t\t\t\tlaBel=document.createElement('label');\n\t\t\t\tlaBel.htmlFor = 'op_'+id;\n\t\t\t\tlaBel.appendChild(document.createTextNode(name)); \n\t\t\t\tspanNode.appendChild(laBel);\n\n\t\t\t\taddTD.appendChild(spanNode); \n\n\t\t\t\tif (nSW > 1) {\n\t\t\t\t\tnSW--;\n\t\t\t\t\tviewname=document.createTextNode(' '); \n\t\t\t\t\taddTD.appendChild(viewname); \n\t\t\t\t} else {\n\t\t\t\t\tnSW = " + col_count + ";\n\t\t\t\t\tbr=document.createElement('BR'); \n\t\t\t\t\taddTD.appendChild(br); \n\t\t\t\t}\n\t\t\t}\n\n\t\t\tobjList.appendChild(addTD); \n\t\t}\n\t";
	return jsSource;
};

function checkJustification(carid, arid, cirid, planid, packetid, pointid, H_options) //電話会社
{
	var sql = `select count(*) from carrier_tb where carid = ${carid}`;

	if (GLOBALS.GO_db.getOne(sql) < 1) {
		return "\u96FB\u8A71\u4F1A\u793E\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002";
	}

	sql = `select count(*) from area_tb where carid = ${carid} and arid = ${arid}`;

	if (GLOBALS.GO_db.getOne(sql) < 1) {
		return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
	}

	sql = `select count(*) from circuit_tb where carid = ${carid} and cirid = ${cirid}`;

	if (GLOBALS.GO_db.getOne(sql) < 1) {
		return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
	}

	if (planid != -1) {
		sql = `select count(*) from plan_tb where carid = ${carid} and arid= ${arid} and cirid = ${cirid} and planid= ${planid}`;

		if (GLOBALS.GO_db.getOne(sql) < 1) {
			return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30D7\u30E9\u30F3\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
		}
	}

	if (packetid != -1) {
		sql = `select count(*) from packet_tb where carid = ${carid} and arid= ${arid} and cirid = ${cirid} and packetid = ${packetid}`;

		if (GLOBALS.GO_db.getOne(sql) < 1) {
			return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30D1\u30B1\u30C3\u30C8\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
		}
	}

	if (pointid != -1) {
		sql = `select count(*) from point_tb where carid = ${carid} and cirid = ${cirid} and pointid = ${pointid}`;

		if (GLOBALS.GO_db.getOne(sql) < 1) {
			return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30D7\u30EC\u30DF\u30A2\u30AF\u30E9\u30D6\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
		}
	}

	if (H_options.length > 0) {
		var A_optionids = Object.keys(H_options);

		if (A_optionids.length > 0) {
			sql = `select count(*) from option_tb where carid = ${carid} and cirid = ${cirid}  and opid in (` + join(",", A_optionids) + ")";

			if (GLOBALS.GO_db.getOne(sql) < 1) {
				return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30AA\u30D7\u30B7\u30E7\u30F3\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
			}
		}
	}

	return 1;
};

function makeKousiPatternSelect(O_form, name, label, pactid, carid) {
	if (carid != "") //SQL文
		//セレクトリスト
		{
			var sql_str = "select krp.patternid, kp.patternname " + "from kousi_rel_pact_tb krp inner join kousi_pattern_tb kp on krp.patternid = kp.patternid " + "where krp.pactid = " + pactid + " and " + "krp.carid = " + carid + " order by krp.patternid";
			var H_patternname = GLOBALS.GO_db.getHash(sql_str);
			var H_select = {
				"-1": "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --"
			};

			for (var key in H_patternname) {
				var value = H_patternname[key];
				H_select[value.patternid] = htmlspecialchars(value.patternname);
			}
		} else {
		H_select = {
			"-1": "-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --"
		};
	}

	O_form.addElement("select", name, label, H_select);
};

//----------------------------------
//コンストラクタ（tel_property_tbから値取得）
//----------------------------------
class SelectorFactoryV2 {
	SelectorFactoryV2() //文字列項目用配列
	//数値項目用配列
	//日付項目用配列
	//SQL実行
	//SQL実行結果取得
	{
		this.H_character[0] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		this.H_numerical[0] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		this.H_date[0] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		this.H_date.orderdate = "\u8CFC\u5165\u65E5";
		this.H_date.contractdate = "\u5951\u7D04\u65E5";
		this.A_col = Array();
		var sql = "select colid,colname from tel_property_tb where pactid=" + _SESSION.pactid + " order by colid";

		if (DEBUG == 1) {
			echo(sql + "<br>");
		}

		var O_result = GLOBALS.GO_db.query(sql);

		while (row = O_result.fetchRow()) {
			if (row[0] <= 15) //文字列項目用配列の最後に追加
				{
					if (row[1] != "") {
						this.H_character[row[0]] = htmlspecialchars(row[1]);
						this.A_col.push("te.text" + row[0]);
					}
				} else if (row[0] > 15 && row[0] <= 18) //数値項目用配列の最後に追加
				{
					if (row[1] != "") {
						this.H_numerical[row[0] - 15] = htmlspecialchars(row[1]);
						this.A_col.push("te.int" + (row[0] - 15));
					}
				} else if (row[0] > 18 && row[0] <= 20) //日付項目
				{
					if (row[1] != "") {
						this.H_date[row[0] - 18] = htmlspecialchars(row[1]);
						this.A_col.push("te.date" + (row[0] - 18));
					}
				} else {
				echo("\u672A\u5B9A\u7FA9\u5024");
			}
		}

		O_result.free();
	}

};

function makeCompanySelecterAj(mode, pactid) //carid 取得
//追加モードの時
//先頭要素
{
	var A_carid = Array();

	if (mode == "add") {
		var sql = "select ca.carid,ca.carname from carrier_tb as ca " + " left outer join (select pactid,carid,relation_flg from pact_rel_carrier_tb where pactid=" + pactid + ") as pr on ca.carid = pr.carid " + " where " + " (pr.relation_flg = true)  or " + " (ca.defaultflg = true and pr.pactid is null) " + " order by ca.carid";
	} else {
		sql = "select ca.carid,ca.carname from carrier_tb as ca " + " left join tel_tb as te on ca.carid = te.carid " + " where ca.defaultflg = true" + " and te.pactid = " + pactid + " group by ca.carid,ca.carname " + " order by ca.carid";
	}

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	var A_data = GLOBALS.GO_db.getSimpleHash(sql);
	A_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
	ksort(A_data);
	return A_data;
};

function makeAreaSelecterAJ(carid = "") {
	if (carid != "") //有効のもののみ表示
		//SQL実行
		{
			var sql = "select arid,arname from area_tb where carid=" + carid + " order by sort";

			if (sql != "") {
				if (DEBUG == 1) {
					echo("SQL:" + sql + "<br>");
				}

				var A_data = GLOBALS.GO_db.getSimpleHash(sql);
			}

			A_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		} else {
		A_data[-1] = "-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
	}

	ksort(A_data);
	return A_data;
};

function makeCircuitSelecterAJ(carid = "") {
	if (carid != "") //SQL実行
		{
			var sql = "select cirid,cirname from circuit_tb where carid=" + carid + " order by sort";

			if (sql != "") {
				if (DEBUG == 1) {
					echo("SQL:" + sql + "<br>");
				}

				var A_data = GLOBALS.GO_db.getSimpleHash(sql);
			}

			A_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
		} else {
		A_data[-1] = "-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
	}

	ksort(A_data);
	return A_data;
};

function makePlanSelecterAJ(carid, arid = "", cirid = "") //sql文作成
//エリア、回線両方指定
//デバッグ
//ループさせて配列作成
//新しいプラン名が来たらtmp配列に追加
//配列変形
{
	if (arid != "" && cirid != "") //$sql = "select planid,planname from plan_tb where carid =" . $carid . " and arid =" . $arid . " and cirid =" . $cirid . " order by cirid,sort";
		{
			var sql = "select planid,planname from plan_tb where carid =" + carid + " and arid =" + arid + " and cirid =" + cirid + " and viewflg=true and planid <= 3000 order by cirid,sort";
		} else if (arid != "" && cirid == "") //$sql = "select planid,planname from plan_tb where planname in (select distinct(planname) from plan_tb where carid =" . $carid . " and arid =" . $arid . ") order by cirid,sort";
		{
			sql = "select planid,planname from plan_tb where planname in (select distinct(planname) from plan_tb where carid =" + carid + " and arid =" + arid + ") and viewflg=true and planid <= 3000 order by cirid,sort";
		} else if (arid == "" && cirid != "") //$sql = "select planid,planname from plan_tb where planname in (select distinct(planname) from plan_tb where carid =" . $carid . " and cirid =" . $cirid . ") order by cirid,sort";
		{
			sql = "select planid,planname from plan_tb where planname in (select distinct(planname) from plan_tb where carid =" + carid + " and cirid =" + cirid + ") and viewflg=true and planid <= 3000 order by cirid,sort";
		} else //$sql = "select planid,planname from plan_tb where planname in (select distinct(planname) from plan_tb where carid =" . $carid . ") order by cirid,sort";
		{
			sql = "select planid,planname from plan_tb where planname in (select distinct(planname) from plan_tb where carid =" + carid + ")" + " and viewflg=true and planid <= 3000 order by cirid,sort";
		}

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	var A_res = GLOBALS.GO_db.getSimpleHash(sql);
	var A_tmp = Array();
	var A_data = Array();
	var cnt = 0;

	for (var key in A_res) //tmp用配列にはプラン名を入れる
	{
		var val = A_res[key];

		if (A_tmp.length > 0) {
			var hit = false;

			for (var i = 0; i < A_tmp.length; i++) {
				if (A_tmp[i].planname == val) {
					A_tmp[i].planid.push(key);
					hit = true;
				}
			}

			if (hit == false) {
				cnt = A_tmp.length;
				A_tmp[cnt].planname = val;
				A_tmp[cnt].planid = Array();
				A_tmp[cnt].planid.push(key);
			}
		} else {
			A_tmp[cnt].planname = val;
			A_tmp[cnt].planid = Array();
			A_tmp[cnt].planid.push(key);
		}
	}

	A_data["--\u672A\u9078\u629E--"] = -1;

	for (var j = 0; j < A_tmp.length; j++) {
		A_data[A_tmp[j].planname] = A_tmp[j].planid.join(",");
	}

	A_data = array_flip(A_data);
	return A_data;
};

function makePacketSelecterAJ(carid, arid = "", cirid = "") //sql文作成
//エリア、回線両方指定
//ループさせて配列作成
//新しいプラン名が来たらtmp配列に追加
//配列変形
{
	if (arid != "" && cirid != "") {
		var sql = "select packetid,packetname from packet_tb where carid =" + carid + " and arid =" + arid + " and cirid =" + cirid + " and packetid <= 3000 order by sort";
	} else if (arid != "" && cirid == "") {
		sql = "select packetid,packetname from packet_tb where packetname in (select distinct(packetname) from packet_tb where carid =" + carid + " and arid =" + arid + ") and packetid <= 3000 order by packetname";
	} else if (arid == "" && cirid != "") {
		sql = "select packetid,packetname from packet_tb where packetname in (select distinct(packetname) from packet_tb where carid =" + carid + " and cirid =" + cirid + ") and packetid <= 3000 order by packetname";
	} else {
		sql = "select packetid,packetname from packet_tb where packetname in (select distinct(packetname) from packet_tb where carid =" + carid + ") and packetid <= 3000 order by packetname";
	}

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	var A_res = GLOBALS.GO_db.getSimpleHash(sql);
	var A_tmp = Array();
	var A_data = Array();
	var cnt = 0;

	for (var key in A_res) //tmp用配列にはプラン名を入れる
	{
		var val = A_res[key];

		if (A_tmp.length > 0) {
			var hit = false;

			for (var i = 0; i < A_tmp.length; i++) {
				if (A_tmp[i].packetname == val) {
					A_tmp[i].packetid.push(key);
					hit = true;
				}
			}

			if (hit == false) {
				cnt = A_tmp.length;
				A_tmp[cnt].packetname = val;
				A_tmp[cnt].packetid = Array();
				A_tmp[cnt].packetid.push(key);
			}
		} else {
			A_tmp[cnt].packetname = val;
			A_tmp[cnt].packetid = Array();
			A_tmp[cnt].packetid.push(key);
		}
	}

	A_data["--\u672A\u9078\u629E--"] = -1;

	for (var j = 0; j < A_tmp.length; j++) {
		A_data[A_tmp[j].packetname] = A_tmp[j].packetid.join(",");
	}

	A_data = array_flip(A_data);
	return A_data;
};

function makePclubSelecterAJ(cirid = "") //sql文作成
//ループさせて配列作成
//プランIDをキーにした配列に変える
{
	var A_data = Array();
	A_data[-1] = "--\u672A\u9078\u629E--";
	var sql = "select pointid,pointname from point_tb";

	if (cirid != "") {
		sql += " where cirid=" + cirid;
	}

	sql += " order by sort,pointid";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	var A_res = GLOBALS.GO_db.getHash(sql);
	var A_tmp = Array();
	var key = -1;

	for (var cnt = 0; cnt < A_res.length; cnt++) //ひとつ前の配列要素とプラン名が同じ
	{
		if (A_res[cnt].pointname == A_res[cnt - 1].pointname) {
			A_tmp[key].in_pointid += "," + A_res[cnt].pointid;
		} else {
			key++;
			A_tmp[key].pointname = A_res[cnt].pointname;
			A_tmp[key].in_pointid = A_res[cnt].pointid;
		}
	}

	for (var nk = 0; nk < A_tmp.length; nk++) {
		A_data[A_tmp[nk].in_pointid] = A_tmp[nk].pointname;
	}

	return A_data;
};

function makeOptionsAJ(carid, cirid = "", view = false) //sql文
//ループさせて配列作成
//新しいプラン名が来たらtmp配列に追加
//配列変形
{
	var sql = "select opid,opname from option_tb where carid = " + carid;

	if (cirid != "") {
		sql += " and cirid = " + cirid;
	}

	if (view == false) {
		sql += " and viewFlg = true ";
	}

	sql += " order by cirid,sort";

	if (DEBUG == 1) {
		echo(sql_str + "<br>");
	}

	var A_res = GLOBALS.GO_db.getSimpleHash(sql);
	var A_tmp = Array();
	var A_data = Array();
	var cnt = 0;

	for (var key in A_res) //tmp用配列にはプラン名を入れる
	{
		var val = A_res[key];

		if (A_tmp.length > 0) {
			var hit = false;

			for (var i = 0; i < A_tmp.length; i++) {
				if (A_tmp[i].opname == val) {
					A_tmp[i].in_opid.push(key);
					hit = true;
				}
			}

			if (hit == false) {
				cnt = A_tmp.length;
				A_tmp[cnt].opname = val;
				A_tmp[cnt].in_opid = Array();
				A_tmp[cnt].in_opid.push(key);
			}
		} else {
			A_tmp[cnt].opname = val;
			A_tmp[cnt].in_opid = Array();
			A_tmp[cnt].in_opid.push(key);
		}
	}

	for (var j = 0; j < A_tmp.length; j++) {
		A_data[j].opname = A_tmp[j].opname;
		A_data[j].in_opid = A_tmp[j].in_opid.join(" or ");
	}

	return A_data;
};

function makeKousiPatternSelectAJ(pactid, carid) {
	if (carid != "") //SQL文
		//セレクトリスト
		{
			var sql_str = "select krp.patternid, kp.patternname " + "from kousi_rel_pact_tb krp inner join kousi_pattern_tb kp on krp.patternid = kp.patternid " + "where krp.pactid = " + pactid + " and " + "krp.carid = " + carid + " order by krp.patternid";
			var H_patternname = GLOBALS.GO_db.getHash(sql_str);
			var H_select = {
				"-1": "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --"
			};

			for (var key in H_patternname) {
				var value = H_patternname[key];
				H_select[value.patternid] = htmlspecialchars(value.patternname);
			}
		} else {
		H_select = {
			"-1": "-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --"
		};
	}

	return H_select;
};

function makeUserSelecterV2(pactid, postid, userid = "") //SQL実行
{
	var sql = "select userid,username from user_tb where pactid=" + pactid + " and (postid=" + postid + " ";

	if (userid != "") {
		sql += " or userid = " + userid + " ";
	}

	sql += ") ORDER BY userid";

	if (DEBUG == 1) {
		echo("SQL:" + sql + "<br>");
	}

	var A_data = GLOBALS.GO_db.getSimpleHash(sql);
	A_data[-1] = "\u672A\u9078\u629E";
	ksort(A_data);
	return A_data;
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

function checkJustificationV2(carid, arid, cirid, planid, packetid, pclubid, options) //電話会社
{
	var sql = "select count(*) from carrier_tb where carid = " + carid;

	if (GLOBALS.GO_db.getOne(sql) < 1) {
		return "\u96FB\u8A71\u4F1A\u793E\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059\u3002";
	}

	sql = "select count(*) from area_tb where carid = " + carid + " and arid = " + arid;

	if (GLOBALS.GO_db.getOne(sql) < 1) {
		return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
	}

	sql = "select count(*) from circuit_tb where carid = " + carid + " and cirid = " + cirid;

	if (GLOBALS.GO_db.getOne(sql) < 1) {
		return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
	}

	if (planid != -1 && planid != "") {
		sql = "select count(*) from plan_tb where carid = " + carid + " and arid = " + arid + " and cirid = " + cirid + " and planid = " + planid;

		if (GLOBALS.GO_db.getOne(sql) < 1) {
			return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30D7\u30E9\u30F3\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
		}
	}

	if (packetid != -1 && packetid != "") {
		sql = "select count(*) from packet_tb where carid = " + carid + " and arid = " + arid + " and cirid = " + cirid + " and packetid = " + packetid;

		if (GLOBALS.GO_db.getOne(sql) < 1) {
			return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30D1\u30B1\u30C3\u30C8\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
		}
	}

	if (pclubid != -1 && pclubid != "") {
		sql = "select count(*) from point_tb where carid = " + carid + " and cirid = " + cirid + " and pointid = " + pclubid;

		if (GLOBALS.GO_db.getOne(sql) < 1) {
			return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30D7\u30EC\u30DF\u30A2\u30AF\u30E9\u30D6\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
		}
	}

	if (options != -1 && options != "") {
		sql = "select count(*) from option_tb where carid = " + carid + " and cirid = " + cirid + " and opid in (" + options + ")";

		if (GLOBALS.GO_db.getOne(sql) < 1) {
			return "\u96FB\u8A71\u4F1A\u793E\u30FB\u5730\u57DF\u4F1A\u793E\u30FB\u56DE\u7DDA\u7A2E\u5225\u30FB\u30AA\u30D7\u30B7\u30E7\u30F3\u306E\u7D44\u307F\u5408\u308F\u305B\u304C\u4E0D\u6B63\u3067\u3059\u3002";
		}
	}

	return 1;
};

function makeLimitLastDate(limit_month) //○ヶ月後の日付
{
	var last_date = date("Y/m/d", mktime("0", "0", "0", date("m") + limit_month, date("t"), date("Y")));
	var A_date = last_date.split("/");
	A_date[2] = date("t", mktime("0", "0", "0", A_date[1], A_date[2], A_date[0]));
	return A_date;
};

function makeOptionsValue(A_option, A_val) {
	A_val = A_val.split(",");
	var view = "";

	for (var i = 0; i < A_option.length; i++) {
		if (-1 !== A_val.indexOf(A_option[i].in_opid) == true) {
			view += "[\xD7]" + A_option[i].opname + "<br>";
		} else {
			view += "[&nbsp;&nbsp;&nbsp;]" + A_option[i].opname + "<br>";
		}
	}

	return view;
};

function makeOptionsSqlValue(options) //オプションを","で分けた配列に
//空要素は消して
//値とキーを入れ替え
//値を１に揃える
//シリアライズ
{
	var A_option = split(",", options);
	A_option = A_option.filter("removeEmpty");
	var A_data = array_flip(A_option);

	for (var key in A_data) {
		var val = A_data[key];
		A_data[key] = "1";
	}

	var data = serialize(A_data);
	return data;
};

function nonSelect(arg) {
	if (arg == -1) {
		return false;
	}

	return true;
};

function makePostOption(option) //","で区切り配列にして
//空要素は消して
//","で繋いで文字列に
{
	var A_opt = split(",", option);
	A_opt = A_opt.filter("removeEmpty");
	option = A_opt.join(",");
	return option;
};

function removeEmpty(val) {
	if (val == "") {
		return false;
	}

	return true;
};

function makeSelectSQL(H_pos, H_get, limit, current_postid, pactid, A_postids, mode, level, tb, A_Cols, kousi = false, charge = false, download = false) //まずサニタイジング
//if($download == true){
//請求権限があるとき、電話IDと請求者名取得
//ダウンロード以外
//予約のみ連結するカラム
//where節用配列
//スーパーユーザーの時（グローバルセッション参照）
//予約の時
//ダウンロードはリミット付けない
{
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

	var cnt_sql = "select count(te.telno) from " + tb + " as te \n\t\t\tleft outer join carrier_tb as ca on ca.carid = te.carid \n\t\t\tleft outer join post_tb as po on po.postid = te.postid \n\t\t\tleft outer join area_tb as ar on ar.arid = te.arid \n\t\t\tleft outer join circuit_tb as ci on ci.cirid = te.cirid \n\t\t\tleft outer join plan_tb as pl on pl.planid = te.planid \n\t\t\tleft outer join user_tb as us on te.userid = us.userid \n\t\t\tleft outer join packet_tb as pa on pa.packetid = te.packetid\n\t\t\twhere te.pactid = " + pactid;
	var get_sql = "select te.postid,po.userpostid,po.postname,\n\t\t\tte.telno_view,te.telno,\n\t\t\tca.carname,ca.carid,\n\t\t\tar.arname,ar.arid,\n\t\t\tci.cirname,ci.cirid,\n\t\t\tte.machine,te.color,\n\t\t\tpl.planname,pl.planid,\n\t\t\tpa.packetname,pa.packetid,\n\t\t\tpt.pointname,pt.pointid,\n\t\t\tte.username,te.employeecode,te.mail,\n\t\t\tte.contractdate,\n\t\t\tte.orderdate,";

	if (charge == true) {
		get_sql += "te.userid,us.username as uname,";
	}

	if (Array.isArray(A_Cols) == true && A_Cols.length > 0) {
		get_sql += A_Cols.join(",") + ",";
	}

	if (kousi == true) {
		get_sql += "case when te.kousiflg = '0' then '\u516C\u79C1\u5206\u8A08\u3059\u308B' " + "when te.kousiflg = '1' then '\u516C\u79C1\u5206\u8A08\u3057\u306A\u3044' " + "when te.kousiflg is null then '\u672A\u8A2D\u5B9A\uFF08\u4F1A\u793E\u306E\u57FA\u672C\u8A2D\u5B9A\u3092\u4F7F\u7528\uFF09' end," + "te.kousiptn,kp.patternname,";
	}

	get_sql += "te.memo,";
	get_sql += "te.options";

	if (download == false) {
		get_sql += ",te.planalert,te.packetalert";
	}

	if (tb == "tel_reserve_tb") //未実行取得のとき
		{
			if (H_get.rm == 0) {
				get_sql += ",te.reserve_date,te.add_edit_flg,te.exe_postid,po.postname as exe_postname,te.exe_userid,te.exe_name,te.exe_state";
			} else {
				get_sql += ",te.exe_date,te.add_edit_flg,te.exe_postid,po2.postname as exe_postname,te.exe_userid,te.exe_name,te.reserve_date,te.exe_state";
			}
		}

	get_sql += " from " + tb + " as te \n\t\t\tleft outer join carrier_tb as ca on ca.carid = te.carid \n\t\t\tleft outer join post_tb as po on po.postid = te.postid \n\t\t\tleft outer join area_tb as ar on ar.arid = te.arid \n\t\t\tleft outer join circuit_tb as ci on ci.cirid = te.cirid \n\t\t\tleft outer join plan_tb as pl on pl.planid = te.planid \n\t\t\tleft outer join user_tb as us on te.userid = us.userid \n\t\t\tleft outer join packet_tb as pa on pa.packetid = te.packetid\n\t\t\tleft outer join point_tb as pt on pt.pointid = te.pointstage";

	if (tb == "tel_reserve_tb") {
		get_sql += " left outer join post_tb as po2 on po2.postid = te.exe_postid ";
	}

	if (kousi == true) {
		get_sql += " left outer join kousi_pattern_tb kp on te.kousiptn = kp.patternid ";
	}

	get_sql += " where te.pactid = " + pactid;
	var A_where = Array();
	var A_input = Array();

	if (_SESSION.su == true && level == 0) {
		if (mode == "pid") //部署のみ
			{
				get_sql += " and te.postid = " + current_postid;
				cnt_sql += " and te.postid = " + current_postid;
			}
	} else {
		if (mode == "pid") //部署のみ
			{
				get_sql += " and te.postid = " + current_postid;
				cnt_sql += " and te.postid = " + current_postid;
			} else {
			get_sql += " and te.postid in (" + join(",", A_postids) + ")";
			cnt_sql += " and te.postid in (" + join(",", A_postids) + ")";
		}
	}

	if (tb == "tel_reserve_tb") {
		get_sql += " and te.exe_state in (" + H_get.rm + ")";
		cnt_sql += " and te.exe_state in (" + H_get.rm + ")";
	}

	if (undefined !== H_pos.submitName == true) //電話番号の入力があればwhereに追加
		{
			if (H_pos.telno != "") {
				var telno = H_pos.telno.replace(/(-|\(|\))/g, "");
				A_where.push("te.telno like '%" + telno + "%'");
				A_input.push("telno");
			}

			if (H_pos.machine != "") {
				A_where.push("te.machine like '%" + H_pos.machine + "%'");
				A_input.push("machine");
			}

			if (H_pos.color != "") {
				A_where.push("te.color like '%" + H_pos.color + "%'");
				A_input.push("color");
			}

			if (H_pos.username != "") {
				A_where.push("te.username like '%" + H_pos.username + "%'");
				A_input.push("username");
			}

			if (H_pos.employeecode != "") {
				A_where.push("te.employeecode like '%" + H_pos.employeecode + "%'");
				A_input.push("employeecode");
			}

			if (H_pos.user_username != "") {
				A_where.push("us.username like '%" + H_pos.user_username + "%'");
				A_input.push("user_username");
			}

			if (H_pos.mail != "") {
				A_where.push("te.mail like '%" + H_pos.mail + "%'");
				A_input.push("mail");
			}

			if (H_pos.character.column != 0 && H_pos.character.val != "") {
				A_where.push(makeCharSql(H_pos.character));
				A_input.push("character");
			}

			if (H_pos.numeric.column != 0 && H_pos.numeric.val != "") {
				A_where.push(makeNumSql(H_pos.numeric));
				A_input.push("numeric");
			}

			if (H_pos.date.column != "0" && H_pos.date.val.Y != "") {
				A_where.push(makeDateSql(H_pos.date));
				A_input.push("date");
			}

			if (H_pos.carid != -1) {
				A_where.push("te.carid=" + H_pos.carid);
				A_input.push("carid");
			}

			if (H_pos.areaid != -1) {
				A_where.push("te.arid=" + H_pos.areaid);
				A_input.push("areaid");
			}

			if (H_pos.circuitid != -1) {
				A_where.push("te.cirid=" + H_pos.circuitid);
				A_input.push("circuitid");
			}

			if (H_pos.planid != -1) {
				A_where.push("te.planid in (" + H_pos.planid + ")");
				A_input.push("planid");
			}

			if (H_pos.packetid != -1) {
				A_where.push("te.packetid in (" + H_pos.packetid + ")");
				A_input.push("packetid");
			}

			if (H_pos.pclubid != -1) {
				A_where.push("te.pointstage in (" + H_pos.pclubid + ")");
				A_input.push("pointstage");
			}

			if (H_pos.options != -1 && H_pos.options != "") {
				A_where.push(" (" + makeOptionSql(H_pos.options) + ")");
				A_input.push("options");
			}

			if (H_pos.kousi != -1 && kousi == true) //未設定
				{
					if (H_pos.kousi == 2) {
						A_where.push("(te.kousiflg is null or te.kousiflg=0)");
					} else {
						A_where.push("te.kousiflg=" + H_pos.kousi);
					}

					A_input.push("kousi");
				}

			if (H_pos.kousiselid != -1 && kousi == true) {
				A_where.push("te.kousiptn=" + H_pos.kousiselid);
				A_input.push("kousiselid");
			}

			if (A_where.length > 0) //検索条件がandの時
				{
					if (H_pos.search_condition == "and") {
						get_sql += " and (" + A_where.join(" and ") + ")";
						cnt_sql += " and (" + A_where.join(" and ") + ")";
					} else {
						get_sql += " and (" + A_where.join(" or ") + ")";
						cnt_sql += " and (" + A_where.join(" or ") + ")";
					}
				}
		}

	if (H_pos.submitName == "\u672A\u4F7F\u7528\u96FB\u8A71\u306E\u307F\u691C\u7D22") {
		get_sql += " and te.finishing_f is false";
		cnt_sql += " and te.finishing_f is false";
	} else if (H_pos.submitName == "\u8B66\u544A\u72B6\u614B\u306E\u307F\u691C\u7D22") {
		get_sql += " and (te.planalert = '1' or te.packetalert = '1') ";
		cnt_sql += " and (te.planalert = '1' or te.packetalert = '1') ";
	}

	if (tb == "tel_tb") {
		get_sql += " order by " + makeSortSql(H_get.s);
	} else {
		get_sql += " order by " + makeSortSqlReserve(H_get.rs);
	}

	if (download == false) {
		if (tb == "tel_tb") {
			var current = H_get.current - 1;

			if (current < 0) {
				current = 0;
			}

			get_sql += " offset " + current * limit + " limit " + limit;
		} else {
			current = H_get.r_current - 1;

			if (current < 0) {
				current = 0;
			}

			get_sql += " offset " + current * limit + " limit " + limit;
		}
	}

	if (DEBUG == 1) {
		echo(get_sql + "<br>");
	}

	var A_sql = Array();
	A_sql.push(cnt_sql);
	A_sql.push(get_sql);
	A_sql.push(A_input);
	return A_sql;
};

function makeSortSql(sort) {
	var A_sort = split("/", sort);
	var col_sp = A_sort[0];
	var jen_sp = A_sort[1];

	if (jen_sp == "d") {
		var jen = " desc";
	}

	if (col_sp == "0") {
		var column = "te.postid" + jen + ",te.telno";
	} else if (col_sp == "1") {
		column = "te.telno" + jen + ",te.postid";
	} else if (col_sp == "2") {
		column = "te.carid" + jen + ",te.arid" + jen + ",te.postid,te.telno";
	} else if (col_sp == "3") {
		column = "te.cirid" + jen + ",te.postid,te.telno";
	} else if (col_sp == "4") {
		column = "te.machine" + jen + ",te.postid,te.telno";
	} else if (col_sp == "5") {
		column = "te.planid" + jen + ",te.packetid" + jen + ",te.postid,te.telno";
	} else if (col_sp == "6") {
		column = "te.username" + jen + ",te.postid,te.telno";
	} else if (col_sp == "7") {
		column = "te.orderdate" + jen + ",te.postid,te.telno";
	} else {
		column = "te.postid" + jen + ",te.telno";
	}

	return column;
};

function makeSortSqlReserve(sort) {
	var A_sort = split("/", sort);
	var col_sp = A_sort[0];
	var jen_sp = A_sort[1];

	if (jen_sp == "d") {
		var jen = " desc";
	}

	if (col_sp == "0") {
		var column = "te.postid" + jen + ",te.reserve_date";
	} else if (col_sp == "1") {
		column = "te.telno" + jen + ",te.reserve_date";
	} else if (col_sp == "2") {
		column = "te.carid,te.arid" + jen + ",te.reserve_date,te.telno";
	} else if (col_sp == "3") {
		column = "te.cirid" + jen + ",te.reserve_date,te.telno";
	} else if (col_sp == "4") {
		column = "te.machine" + jen + ",te.reserve_date,te.telno";
	} else if (col_sp == "5") {
		column = "te.planid,te.packetid" + jen + ",te.reserve_date,te.telno";
	} else if (col_sp == "6") {
		column = "te.username" + jen + ",te.reserve_date,te.telno";
	} else if (col_sp == "7") {
		column = "te.orderdate" + jen + ",te.reserve_date,te.telno";
	} else if (col_sp == "8") {
		column = "te.reserve_date" + jen + ",te.telno";
	} else if (col_sp == "9") {
		column = "te.exe_date" + jen + ",te.reserve_date,te.telno";
	} else if (col_sp == "10") {
		column = "te.add_edit_flg" + jen + ",te.reserve_date,te.telno";
	} else {
		column = "te.reserve_date" + jen + ",te.telno";
	}

	return column;
};

function makeCharSql(A_char) {
	var sql = "te.text" + A_char.column + " like '%" + A_char.val + "%'";
	return sql;
};

function makeNumSql(A_num) {
	var sql = "te.int" + A_num.column + " " + makeSign(A_num.condition) + A_num.val;
	return sql;
};

function makeDateSql(A_date) //購入日、契約日以外の時
{
	if (is_numeric(A_date.column) == true) {
		var col = "date" + A_date.column;
	} else {
		col = A_date.column;
	}

	var sql = "te." + col + " " + makeSign(A_date.condition) + " '" + A_date.val.Y + "-" + A_date.val.m + "-" + A_date.val.d + "'";
	return sql;
};

function makeOptionSql(option) //データを配列にする
//検索用にフォーマット（データはserializeされている）
{
	var A_data = Array();
	var A_option = split(",", makePostOption(option));

	for (var i = 0; i < A_option.length; i++) {
		var A_data_detaile = Array();
		var A_option_detaile = split(" or ", A_option[i]);

		for (var j = 0; j < A_option_detaile.length; j++) {
			A_data_detaile.push("te.options like '%:" + A_option_detaile[j] + ";s%'");
		}

		var sql_detaile = A_data_detaile.join(" or ");
		A_data.push(sql_detaile);
	}

	var sql = "(" + A_data.join(") and (") + ")";
	return sql;
};

function checkPrtelno(pactid) //親番号一覧取得
{
	var sql = "select carid,prtelno from bill_prtel_tb where pactid=" + pactid;
	var A_prtelno = GLOBALS.GO_db.getHash(sql);

	for (var jjj = 0; jjj < A_prtelno.length; jjj++) {
		A_prtelno[jjj].prtelno = A_prtelno[jjj].prtelno.replace(/(\(|\)|-)/g, "");
	}

	return A_prtelno;
};

function makeBuySelSelecter(O_form, name, label, carid, option = "", pactid = "") {
	if (carid != "") //SQL実行
		//ID 指定ナシ(新規入力)
		{
			H_data[-1] = "-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
			var sql = "select buyselid,buyselname from buyselect_tb where carid=" + carid + " order by sort";

			if (sql != "") //SQL実行結果取得
				{
					if (DEBUG == 1) {
						echo("SQL:" + sql + "<br>");
					}

					var O_result = GLOBALS.GO_db.query(sql);

					while (row = O_result.fetchRow()) {
						var colid = row[0];
						H_data[row[0]] = htmlspecialchars(row[1]);
					}

					O_result.free();
				}

			if (H_data.length == 2) {
				delete H_data[-1];
			}
		} else {
		H_data[-1] = "-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --";
	}

	O_form.addElement("select", name, label, H_data, option);
};

function makePlanFormJS(pactid = "", option = "", cut_kikakutei = "", pastflg = false, syubetsu = "", kousiflg = false, kousipactid = "") //pactid が指定されていなかった場合 -- マスター一覧を得る
//キャリアＩＤ取得
//全キャリアを select
//SQL実行
//回線種別取得
//購入方式取得
//全キャリアＩＤ取得
//イベント振分関数(JavaScript)生成
{
	var row;
	jsSource += "var beforeCirid = ''\n";
	var sql = "select carid from carrier_tb order by sort";
	var O_result = GLOBALS.GO_db.query(sql);
	var row_count = 0;

	while (row = O_result.fetchRow()) {
		A_carid.push(row[0]);
	}

	sql = "select carid,cirid,cirname from circuit_tb order by sort";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) {
		A_cirname[row[0]][row[1]] = row[2];
	}

	sql = "select carid,buyselid,buyselname from buyselect_tb order by sort";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) {
		A_buyselname[row[0]][row[1]] = row[2];
	}

	jsSource += "var cirname = new Array(); \n";
	jsSource += "var buyselname = new Array(); \n";

	if (A_carid.length != 0) {
		row_count = 0;

		for (var carid of Object.values(A_carid)) //0:全て と 99:不明 は除く
		{
			if (!(carid == 0 || carid == 99)) /////////////////////////////////////
				//キャリア毎回線種別取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				/////////////////////////////////////
				//キャリア毎購入方式取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				{
					delete A_data;
					var A_data = Array();
					A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
					delete A_ids;
					row_count = 0;

					if (A_cirname[carid].length != 0) {
						var A_cirname_buf = Object.keys(A_cirname[carid]);

						for (var id of Object.values(A_cirname_buf)) {
							A_ids.push(id);
							var label = A_cirname[carid][id];
							A_data.push(`${id}:${label}`);
							row_count++;
						}
					}

					A_cirid[carid] = A_ids;

					if (row_count == 1) {
						delete A_data[0];
					}

					jsSource += `cirname[${carid}] = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
					delete A_data;
					A_data = Array();
					A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
					row_count = 0;

					if (A_buyselname[carid].length != 0) {
						delete A_ids;
						var A_ids = Array();
						var A_buyselname_buf = Object.keys(A_buyselname[carid]);

						for (var id of Object.values(A_buyselname_buf)) {
							label = A_buyselname[carid][id];
							A_ids.push(id);
							A_data.push(id + ":" + label);
							row_count++;
						}

						A_buyselid[carid] = A_ids;
					}

					jsSource += "buyselname[" + carid + "] = new Array(\" ";
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
				}
		}
	}

	jsSource += "cirname[0] = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";
	jsSource += "buyselname[0] = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";
	jsSource += "function selectCarid() {\n";

	if (syubetsu == "") {
		jsSource += "\n\t\t\t\tvar carid = document.getElementById('carid').value;\n\t\t\t\tif( carid == -1 ){ //" + carid + "\u304C\u9078\u629E\u3055\u308C\u305F\u304B\n\t\t\t\t\t\tvar empty_buf = new Array('-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --');\n\t\t\t\t\t\tCreateSelecter(document.getElementById('cirname'), empty_buf);\n\t\t\t\t\t\tCreateSelecter(document.getElementById('buyselname'), empty_buf);";
		jsSource += "}";

		if (A_carid.length != 0) {
			jsSource += "else {\n";
			jsSource += "\n\t\t\t\tCreateSelecter(document.getElementById('cirname'), cirname[carid]);\n\t\t\t\tCreateSelecter(document.getElementById('buyselname'), buyselname[carid]);";
			jsSource += "}\n";
		}
	} else {
		jsSource += "\n\t\t\t\tvar carid = document.getElementById('carid').value;\n\t\t\t\tif( carid == -1 ){ //" + carid + "\u304C\u9078\u629E\u3055\u308C\u305F\u304B\n\t\t\t\t\t\tvar empty_buf = new Array('-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --');\n\t\t\t\t\t\tCreateSelecter(document.getElementById('cirname'), empty_buf);\n\t\t\t\t}\n\t\t\t";

		if (A_carid.length != 0) {
			jsSource += "else {\n";
			jsSource += "\n\t\t\t\tCreateSelecter(document.getElementById('cirname'), cirname[carid]); \n\t\t\t";
			jsSource += "}\n";
		}
	}

	jsSource += "selectChange();\n";
	jsSource += "}\n";

	if (A_carid.length != 0) {
		for (var carid of Object.values(A_carid)) {
			if (A_cirid[carid].length == 0) {
				continue;
			}

			if (A_areaid[carid].length == 0) {
				continue;
			}
		}
	}

	return jsSource;
};

function makePacketFormJS() //全キャリアを select
//SQL実行
//回線種別ＩＤ取得
//全キャリアＩＤ取得
//イベント振分関数(JavaScript)生成
{
	var row;
	jsSource += "var beforeCirid = ''\n";
	var sql = "select carid from carrier_tb order by sort";
	var O_result = GLOBALS.GO_db.query(sql);
	var row_count = 0;

	while (row = O_result.fetchRow()) {
		A_carid.push(row[0]);
	}

	sql = "select carid,cirid,cirname from circuit_tb" + " order by sort";
	O_result = GLOBALS.GO_db.query(sql);

	while (row = O_result.fetchRow()) {
		A_cirname[row[0]][row[1]] = row[2];
	}

	jsSource += "var cirname = new Array(); \n";

	if (A_carid.length != 0) {
		row_count = 0;

		for (var carid of Object.values(A_carid)) //0:全て と 99:不明 は除く
		{
			if (!(carid == 0 || carid == 99)) /////////////////////////////////////
				//キャリア毎回線種別取得
				//配列部(JavaScript)生成
				/////////////////////////////////////
				//SQL実行結果取得
				//JavaScript 中文
				//JavaScript 後文
				{
					delete A_data;
					var A_data = Array();
					A_data.push("-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --");
					delete A_ids;
					row_count = 0;

					if (A_cirname[carid].length != 0) {
						var A_cirname_buf = Object.keys(A_cirname[carid]);

						for (var id of Object.values(A_cirname_buf)) {
							A_ids.push(id);
							var label = A_cirname[carid][id];
							A_data.push(`${id}:${label}`);
							row_count++;
						}
					}

					A_cirid[carid] = A_ids;

					if (row_count == 1) {
						delete A_data[0];
					}

					jsSource += `cirname[${carid}] = new Array(" `;
					jsSource += join("\",\"", A_data);
					jsSource += " \");\n";
				}
		}
	}

	jsSource += "cirname[0] = new Array(\"-1:-- \u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --\");\n";
	jsSource += "function selectCarid() {\n";
	jsSource += "\n\n\t\t\tvar carid = document.getElementById('carid').value;\n\n\t\t\tif( carid == -1){ //" + carid + "\u304C\u9078\u629E\u3055\u308C\u305F\u304B\n\t\t\t\t\tvar empty_buf = new Array('-1:-- \u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044 --');\n\t\t\t\t\tCreateSelecter(document.getElementById('cirname'), empty_buf);";
	jsSource += "}";

	if (A_carid.length != 0) {
		jsSource += "else {\n";
		jsSource += "\n\t\t\tCreateSelecter(document.getElementById('cirname'), cirname[carid]);";
		jsSource += "}\n";
	}

	jsSource += "selectChange();\n";
	jsSource += "}\n";
	return jsSource;
};