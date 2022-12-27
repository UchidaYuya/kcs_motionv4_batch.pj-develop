//===========================================================================
//機能：基本料の生成処理（エニーユーザー専用）
//
//作成：中西	2007/01/24	初版作成
//===========================================================================
//このスクリプトの日本語処理名
//define("PRE_DUMMY_TEL", "ANY");	// ダミー電話番号の接頭子
//define("DUMMY_TEL_LENG", 11 );	// ダミー電話番号の長さ
//エニーユーザーのキャリアID
//エニーユーザーの回線ID
//のぞみサーバ利用料金のコード
//外線利用料金のコード
//使用料（国内）
//使用料（国際）
//消費税
//以下はcommonで定義済み
//define("G_EXCISE_RATE", 0.05);//消費税率
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//DEBUG * 標準出力に出してみる.
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//開始メッセージ
//パラメータチェック
//$cnt 0 はスクリプト名のため無視
//END 引数の取得
//請求データファイルがあるディレクトリを指定
//処理する契約ＩＤ配列
//処理が終了した pactid を格納するための配列
//契約ＩＤの指定が全て（all）の時
//テーブルＮＯ取得
//テーブル名設定
//出力ファイル作成
//teldetailsのファイル名が重ならないように
//会社名マスターを作成
//処理する契約ＩＤ
//全てのPactについてLOOP.
//END Pactごとの処理.
//出力ファイルクローズ
//メモリー解放
//ここまでに成功したファイルが無ければ終了する.
//バックアップをとる
//インポートを実行する
//２重起動ロック解除
//終了メッセージ
//END Main
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//
//[引　数] pactid, postid, db
//[返り値] 親部署の登録区分、親部署の「のぞみサーバ利用料金」、親部署の「外線利用料金」、部署ID
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 日割り計算
//[引　数]
//[返り値] 日割り計算後の料金
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 ある年月の月末の日を返す
//[引　数] 年、月
//[返り値] 日割り計算後の料金
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明 インサートファイルに書き出す
//[引　数] $A_fileData 書き出すデータ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//バックアップをとる
//[引　数] $db
//[返り値] なし
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//不要なデータをＤＢから削除する
//[引　数] 削除する電話データ（pact, telno, code）
//[返り値] なし
//[備　考] 使用料をまとめた分の、特定の電話、科目だけを消去する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//データをＤＢに登録する
//[引　数] $db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//処理を終えたデータを移動する
//[引　数] $pactid
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptask_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//&$db： DBハンドル
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
error_reporting(E_ALL);
const SCRIPT_NAMEJ = "\u30A8\u30CB\u30FC\u30E6\u30FC\u30B6\u30FC\u57FA\u672C\u6599\u751F\u6210";
const SCRIPTNAME = "gen_anyuser.php";

require("lib/script_db.php");

require("lib/script_log.php");

const ANYFU_DIR = "/anyfu/bill";
const LOG_DELIM = " ";
const ANY_CARRIER_ID = 13;
const ANY_CIRCUIT_ID = 29;
const CODE_NOZOMI = 100;
const CODE_GAISEN = 200;
const CODE_DOMES = 300;
const CODE_INTER = 400;
const CODE_TAX = 1000;
const TAX_KAZEI = "\u8AB2\u7A0E";
const TAX_HIKAZEI = "\u975E\u8AB2\u7A0E";
const TAX_TAISYOGAI = "\u5BFE\u8C61\u5916";
const TAX_KA_HIKAZEI = "\u8AB2\u7A0E\uFF0F\u975E\u8AB2\u7A0E";
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_ALL, dbLogFile);
var log_listener_type2 = new ScriptLogFile(G_SCRIPT_ALL, "STDOUT");
log_listener.PutListener(log_listener_type);
log_listener.PutListener(log_listener_type2);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
logh.putError(G_SCRIPT_BEGIN, SCRIPT_NAMEJ + LOG_DELIM + "\u51E6\u7406\u958B\u59CB.");

if (_SERVER.argv.length != 4) //数が正しくない
	{
		usage("", dbh);
		throw die(1);
	}

var argvCnt = _SERVER.argv.length;

for (var cnt = 1; cnt < argvCnt; cnt++) //請求年月を取得
{
	if (ereg("^-y=", _SERVER.argv[cnt]) == true) //請求年月文字列チェック
		{
			var billdate = ereg_replace("^-y=", "", _SERVER.argv[cnt]);

			if (ereg("^[0-9]{6}$", billdate) == false) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			} else //年月チェック
				{
					var year = billdate.substr(0, 4);
					var month = billdate.substr(4, 2);

					if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
						usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059(" + billdate + ")", dbh);
					}
				}

			var diffmon = (date("Y") - year) * 12 + (date("m") - month);

			if (diffmon < 0) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\u672A\u6765\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", dbh);
			} else if (diffmon >= 24) {
				usage("ERROR: \u8ACB\u6C42\u5E74\u6708\u306B\uFF12\u5E74\u4EE5\u4E0A\u524D\u306E\u5E74\u6708\u3092\u6307\u5B9A\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093(" + billdate + ")", dbh);
			}

			continue;
		}

	if (ereg("^-p=", _SERVER.argv[cnt]) == true) //契約ＩＤチェック
		{
			var pactid_in = ereg_replace("^-p=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^all$", pactid_in) == false && ereg("^[0-9]+$", pactid_in) == false) {
				usage("ERROR: \u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	if (ereg("^-b=", _SERVER.argv[cnt]) == true) //バックアップの有無のチェック
		{
			var backup = ereg_replace("^-b=", "", _SERVER.argv[cnt]).toLowerCase();

			if (ereg("^[ny]$", backup) == false) {
				usage("ERROR: \u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059", dbh);
			}

			continue;
		}

	usage("", dbh);
}

var dataDir = DATA_DIR + "/" + billdate + ANYFU_DIR;

if (is_dir(dataDir) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093.");
}

var A_pactid = Array();
var A_pactDone = Array();

if (pactid_in == "all") //処理する契約ＩＤを取得する
	//契約ＩＤが指定されている場合
	{
		var fileName;
		var dirh = opendir(dataDir);

		while (fileName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
		{
			if (is_dir(dataDir + "/" + fileName) && fileName != "." && fileName != "..") {
				A_pactid.push(fileName);
			}

			clearstatcache();
		}

		closedir(dirh);
	} else {
	A_pactid.push(pactid_in);
}

if (A_pactid.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "Pact\u7528\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u304C\uFF11\u3064\u3082\u3042\u308A\u307E\u305B\u3093.");
	throw die(1);
}

if (lock(true, dbh) == false) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\uFF12\u91CD\u8D77\u52D5\u3067\u3059\u3001\u524D\u56DE\u30A8\u30E9\u30FC\u7D42\u4E86\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059.");
	throw die(1);
}

var sql = "select ut.code, ut.name, ut.taxtype, kr.kamokuid from utiwake_tb ut ";
sql += "inner join kamoku_rel_utiwake_tb kr on ut.code=kr.code where ut.carid=" + ANY_CARRIER_ID;
var H_result = dbh.getHash(sql, true);

for (cnt = 0;; cnt < H_result.length; cnt++) //内訳コード => 内訳内容
{
	var code = H_result[cnt].code;
	H_utiwake[code] = H_result[cnt];
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var telX_tb = "tel_" + tableNo + "_tb";
var postX_tb = "post_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetailX_tb = "tel_details_" + tableNo + "_tb";
var file_teldetails = dataDir + "/" + teldetailX_tb + "_gen" + billdate + pactid_in + ".ins";
var fp_teldetails = fopen(file_teldetails, "w");

if (fp_teldetails == undefined) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u66F8\u304D\u8FBC\u307F\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
	throw die(1);
}

sql = "select pactid,compname from pact_tb order by pactid";
H_result = dbh.getHash(sql, true);
var pactCnt = H_result.length;

for (cnt = 0;; cnt < pactCnt; cnt++) //pactid => 会社名
{
	H_pactid[H_result[cnt].pactid] = H_result[cnt].compname;
}

pactCnt = A_pactid.length;
A_pactid.sort();

for (cnt = 0;; cnt < pactCnt; cnt++) //請求データディレクトリにある契約ＩＤがマスターに登録されているか？
//データディレクトリの存在確認
//計算処理後の詳細データ
//削除対象となるデータ
//対象となる電話のリストを得る
//停止中でない電話 || 請求の上がっている電話
//停止中だが請求が上がっている電話については警告を出す
//1と2の差異はdate1の箇所だけ.
//請求月電話番号マスター作成、停止フラグが立っていないもの
//ダミー電話を除く
//停止フラグが立っており、かつ請求があるもの
//利用停止フラグ = text8
//電話番号ごとの処理
//END 電話番号ごとの処理
//正常処理が終わった pactid のみ書き出し処理
{
	if (undefined !== H_pactid[A_pactid[cnt]] == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "pactid=" + A_pactid[cnt] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093.");
		continue;
	}

	var pactid = A_pactid[cnt];
	var pactname = H_pactid[pactid];
	var dataDirPact = dataDir + "/" + pactid;

	if (is_dir(dataDirPact) == false) //次のPactの処理にスキップする.
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30FC\u30BF\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA" + dataDirPact + "\u304C\u5B58\u5728\u3057\u307E\u305B\u3093.");
			continue;
		}

	var A_calcData = Array();
	var A_delData = Array();
	var errFlag = false;
	var colums1 = "tel.telno, tel.postid, tel.text1, tel.int1, tel.int2, tel.int3, to_char(tel.date1,'yyyy-mm-dd') as date1, post.ptext1, post.pint1, post.pint2";
	var colums2 = "tel.telno, tel.postid, tel.text1, tel.int1, tel.int2, tel.int3, tel.date1, post.ptext1, post.pint1, post.pint2";
	var A_telnoX = Array();
	sql = "select " + colums1 + " from " + telX_tb + " tel " + " inner join " + postX_tb + " post on tel.pactid=post.pactid and tel.postid=post.postid " + " where tel.pactid=" + A_pactid[cnt] + " and tel.carid=" + ANY_CARRIER_ID + " and (tel.text8 != '1' or tel.text8 is null)" + " and tel.telno not in (select telno from dummy_tel_tb where carid=" + ANY_CARRIER_ID + ")";

	for (var data of Object.values(dbh.getHash(sql, true))) {
		A_telnoX.push(data);
	}

	sql = "select " + colums1 + " from " + telX_tb + " tel " + " inner join " + postX_tb + " post on tel.pactid=post.pactid and tel.postid=post.postid " + " inner join " + teldetailX_tb + " td on tel.telno=td.telno and tel.carid=td.carid" + " where tel.pactid=" + A_pactid[cnt] + " and tel.carid=" + ANY_CARRIER_ID + " and tel.text8 = '1'" + " and tel.telno not in (select telno from dummy_tel_tb where carid=" + ANY_CARRIER_ID + ")" + " group by " + colums2;

	for (var data of Object.values(dbh.getHash(sql, true))) //停止中の電話は警告を出す
	{
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u96FB\u8A71\u756A\u53F7(" + data.telno + ")\u306F\u505C\u6B62\u4E2D\u3067\u3059\u304C\u3001\u8ACB\u6C42\u304C\u4E0A\u304C\u3063\u3066\u3044\u307E\u3059.");
		A_telnoX.push(data);
	}

	for (var A_data of Object.values(A_telnoX)) //消費税を生成するかどうか
	//国内使用料
	//国際使用料
	//消費税対象額
	//////// 請求情報を得る
	//////// 基本料の自動生成処理
	//echo "DEBUG: telno=$telno, nozomi_done=$nozomi_done, gaisen_done=$gaisen_done \n";
	{
		var telno = A_data.telno;
		var nozomi_done = false;
		var gaisen_done = false;
		var zei_done = false;
		var H_domes = Array();
		var H_inter = Array();
		var taxsum = 0;
		sql = "select code, charge, taxkubun, realcnt from " + teldetailX_tb + " where pactid=" + pactid + " and carid=" + ANY_CARRIER_ID + " and telno='" + telno + "'";
		var H_detail = dbh.getHash(sql, true);

		for (var A_detail of Object.values(H_detail)) //各コードごとの処理
		{
			switch (A_detail.code) {
				case CODE_NOZOMI:
					nozomi_done = true;
					break;

				case CODE_GAISEN:
					gaisen_done = true;
					break;

				case CODE_DOMES:
					H_domes.push(A_detail);
					break;

				case CODE_INTER:
					H_inter.push(A_detail);
					break;

				case CODE_TAX:
					zei_done = true;
					break;

				default:
					break;
			}

			if (A_detail.charge == 0) {
				A_delData.push([pactid, telno, A_detail.code]);
			} else //消費税合計に加算
				{
					if (A_detail.taxkubun == TAX_KAZEI && A_detail.code != CODE_TAX) //課税分の合計
						{
							taxsum += +A_detail.charge;
						}
				}
		}

		if (nozomi_done == false || gaisen_done == false) //のぞみと外線、両方上がっていたら自動生成しない
			//どちらか一方でも完了していなければ
			//電話/部署管理情報の登録区分から、法人/個人 の区別を得る
			//まず部署管理情報の登録区分を見る
			//「のぞみサーバ利用料金」を請求に登録する
			{
				if (A_data.ptext1 == "0") //代理店であれば ＝ 個人の場合：（代理店直下の場合）
					//"電話"管理の「のぞみサーバ利用料金」
					//"電話"管理の「外線利用料金」
					{
						var nozomi_charge = A_data.int2;
						var gaisen_charge = A_data.int3;
					} else if (A_data.ptext1 == "1" || A_data.ptext1 == "2") //そうでなければ ＝ 法人の場合：（個人で複数回線所有の場合も含む）
					//"部署"管理の「のぞみサーバ利用料金」
					//"部署"管理の「外線利用料金」
					{
						nozomi_charge = A_data.pint1;
						gaisen_charge = A_data.pint2;
					} else if (A_data.ptext1 == "3") //部署であれば、上にさかのぼって代理店/法人の別を取得する
					{
						var kubun, nozomi_tmp, gaisen_tmp, postid_tmp;
						[kubun, nozomi_tmp, gaisen_tmp, postid_tmp] = getParentKubun(pactid, A_data.postid, dbh);

						if (kubun == "0") //"電話"管理の「のぞみサーバ利用料金」
							//"電話"管理の「外線利用料金」
							//echo "DEBUG: 親部署の\"電話\"管理で登録、$kubun, $nozomi_tmp, $gaisen_tmp, $postid_tmp.\n";
							{
								nozomi_charge = A_data.int2;
								gaisen_charge = A_data.int3;
							} else if (kubun == "1" || kubun == "2") //"部署"管理の「のぞみサーバ利用料金」
							//"部署"管理の「外線利用料金」
							//echo "DEBUG: 親部署の\"部署\"管理で登録、$kubun, $nozomi_tmp, $gaisen_tmp, $postid_tmp.\n";
							{
								nozomi_charge = nozomi_tmp;
								gaisen_charge = gaisen_tmp;
							} else {
							logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u89AA\u90E8\u7F72\u306E\u767B\u9332\u533A\u5206\u304C\u4E0D\u660E\u3067\u3059(" + kubun + "), telno=" + telno + ", postid=" + postid_tmp);
							throw die(1);
						}
					} else //不明の区分
					{
						logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u767B\u9332\u533A\u5206\u304C\u4E0D\u660E\u3067\u3059(" + A_data.ptext1 + "), telno=" + telno + ", postid=" + A_data.postid);
						throw die(1);
					}

				if (nozomi_done == false) //電話管理の「端末台数」
					//echo "DEBUG: NoZoMi-1, realcnt= $realcnt \n";
					//台数があれば自動生成
					{
						var realcnt = A_data.int1;

						if (!is_null(realcnt) && realcnt != 0) //(請求金額) = (のぞみサーバ利用料金)ｘ(端末台数)
							//echo "DEBUG: NoZoMi-2, nozomi_charge = $nozomi_charge \n";
							//日割り計算
							//echo "DEBUG: NoZoMi-3, nozomi_charge = $nozomi_charge \n";
							//その結果０円でなければ生成
							{
								nozomi_charge = nozomi_charge * realcnt;
								nozomi_charge = DailyRate(A_data.date1, billdate, nozomi_charge);

								if (nozomi_charge != 0) //順序はコード番号/100という規則
									//消費税合計に加算
									//echo "DEBUG: NoZoMi-99, nozomi_charge = $nozomi_charge \n";
									{
										var detailNo = +(CODE_NOZOMI / 100);
										var A_meisai = [telno, CODE_NOZOMI, nozomi_charge, TAX_KAZEI, detailNo, realcnt];
										A_calcData.push(A_meisai);
										taxsum += nozomi_charge;
									}
							}
					}

				if (gaisen_done == false) //電話管理の「端末台数」
					//echo "DEBUG: Gaisen-1, realcnt= $realcnt \n";
					//echo "DEBUG: Gaisen-2, gaisen_charge= $gaisen_charge \n";
					//料金が登録されている場合のみ自動生成
					{
						realcnt = A_data.int1;

						if (is_null(realcnt) || realcnt == 0) {
							realcnt = 1;
						}

						gaisen_charge = DailyRate(A_data.date1, billdate, gaisen_charge);

						if (gaisen_charge != 0) //順序はコード番号/100という規則
							//消費税合計に加算
							//echo "DEBUG: Gaisen-99, gaisen_charge= $gaisen_charge \n";
							{
								detailNo = +(CODE_GAISEN / 100);
								A_meisai = [telno, CODE_GAISEN, gaisen_charge, TAX_KAZEI, detailNo, realcnt];
								A_calcData.push(A_meisai);
								taxsum += gaisen_charge;
							}
					}
			}

		if (H_domes.length >= 2) //課税/非課税２レコード（以上）だったら１レコードにまとめる
			//２レコードは滅多にないはず
			//金額の合計
			//$sum_count = 1;			// 最低でも1件とする => カウントは付けない
			//集計した新たなレコードを追加する
			//if( $sum_count == 0 ){ $sum_count = 1; }	// カウントは付けない
			//順序はコード番号/100という規則
			//既存のレコードを削除する
			{
				var sum_charge = 0;

				for (var A_detail of Object.values(H_domes)) //既存のレコードを集計
				//if($sum_count < $A_detail["realcnt"]){	// カウント最大のものを採用 => カウントは付けない
				//$sum_count = $A_detail["realcnt"];
				//}
				{
					sum_charge += +A_detail.charge;
				}

				detailNo = +(CODE_DOMES / 100);
				A_meisai = [telno, CODE_DOMES, sum_charge, TAX_KA_HIKAZEI, detailNo, "\\N"];
				A_calcData.push(A_meisai);
				A_delData.push([pactid, telno, CODE_DOMES]);
			}

		if (H_inter.length >= 2) //課税/非課税２レコード（以上）だったら１レコードにまとめる
			//２レコードは滅多にないはず
			//金額の合計
			//$sum_count = 1;			// 最低でも1件とする => カウントは付けない
			//集計した新たなレコードを追加する
			//if( $sum_count == 0 ){ $sum_count = 1; }	// カウントは付けない
			//順序はコード番号/100という規則
			//既存のレコードを削除する
			{
				sum_charge = 0;

				for (var A_detail of Object.values(H_inter)) //既存のレコードを集計
				//if($sum_count < $A_detail["realcnt"]){	// ウント最大のものを採用 => カウントは付けない
				//$sum_count = $A_detail["realcnt"];
				//}
				{
					sum_charge += +A_detail.charge;
				}

				detailNo = +(CODE_INTER / 100);
				A_meisai = [telno, CODE_INTER, sum_charge, TAX_KA_HIKAZEI, detailNo, "\\N"];
				A_calcData.push(A_meisai);
				A_delData.push([pactid, telno, CODE_INTER]);
			}

		if (taxsum != 0 && zei_done == false) //切り捨て(課税対象額 * 0.05)
			{
				var tax = Math.floor(taxsum * G_EXCISE_RATE);

				if (tax != 0) //消費税金額が0円の場合は生成しない -- 2007/04/12
					//順序はコード番号/100という規則
					//消費税の税区分は空文字列
					{
						detailNo = +(CODE_TAX / 100);
						A_meisai = [telno, CODE_TAX, tax, "", detailNo, "\\N"];
						A_calcData.push(A_meisai);
					}
			}
	}

	if (errFlag == false) //ファイルに書き出す
		{
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30FC\u30BF\u66F8\u51FA\u51E6\u7406\u958B\u59CB.");

			if (writeInsFile(pactid, A_calcData) == 1) //次のPactの処理にスキップする.
				{
					logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + pactname + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u30D5\u30A1\u30A4\u30EB\u306E\u66F8\u304D\u51FA\u3057\u306B\u5931\u6557.");
					continue;
				}

			fflush(fp_teldetails);
			A_pactDone.push(pactid);
		}
}

fclose(fp_teldetails);
delete H_pactid;
delete A_telnoX;
delete A_calcData;

if (A_pactDone.length == 0) {
	logh.putError(G_SCRIPT_ERROR, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u8AAD\u307F\u8FBC\u307F\u306B\u6210\u529F\u3057\u305FPact\u304C\uFF11\u3064\u3082\u7121\u304B\u3063\u305F.");
	throw die(1);
}

dbh.begin();

if (backup == "y") {
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u958B\u59CB.");
	doBackup(dbh);
	logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u51E6\u7406\u5B8C\u4E86.");
}

logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");
doDelete(A_pactDone, A_delData, dbh);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30C7\u30EA\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB.");
doImport(file_teldetails, dbh);
logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u5B8C\u4E86.");
dbh.commit();
lock(false, dbh);
logh.putError(G_SCRIPT_END, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u51E6\u7406\u5B8C\u4E86.");
throw die(0);

function getParentKubun(pactid, postid, db) //取得に失敗
{
	if (!("postX_tb" in global)) postX_tb = undefined;
	if (!("postrelX_tb" in global)) postrelX_tb = undefined;
	var level = 0;
	var kubun = "";

	do {
		var sql = "select post.postid, post.ptext1, post.pint1, post.pint2, rel.postidparent, rel.level from " + postX_tb + " post " + " inner join " + postrelX_tb + " rel on post.pactid=rel.pactid and post.postid=rel.postidchild " + " where post.pactid=" + pactid + " and post.postid=" + postid;
		var H_postrel = db.getHash(sql, true);

		for (var A_postrel of Object.values(H_postrel)) {
			kubun = A_postrel.ptext1;

			if (kubun == "0" || kubun == "1" || kubun == "2") {
				return [kubun, A_postrel.pint1, A_postrel.pint2, postid];
			} else if (kubun == "3") //１つ上に上がる
				{
					postid = A_postrel.postidparent;
					level = A_postrel.level;
				} else //不明な区分、そのまま返す
				{
					return [kubun, A_postrel.pint1, A_postrel.pint2, postid];
				}
		}
	} while (level > 0);

	return [kubun, 0, 0, postid];
};

function DailyRate(theDate, billdate, charge) //print "DEBUG: DailyRate( $theDate, $billdate, $charge )\n";
//日付が指定されていなければ、そのままの金額を返す
//billdateの１ヶ月前が対象となる月、-y=200704 なら対象月は200703。
//print "DEBUG: tailday=$tailday, day=$day, charge=$charge\n";
//print "DEBUG: result=".  floor($charge * ($tailday - $day + 1) / $tailday) . "\n";
//料金＝料金 *（月末日-開始日+1）/月の日数	（小数点以下は切捨て）
{
	if (is_null(theDate) || theDate == "") //print "DEBUG: DailyRate( no theDate )\n";
		{
			return charge;
		}

	[year, month, day] = split("-", theDate);
	var billyear = billdate.substr(0, 4);
	var billmon = billdate.substr(4, 2);
	--billmon;

	if (+(billmon < 1)) {
		billmon = 12;
		--billyear;
	}

	if (billyear < year) //print "DEBUG: DailyRate( future year )\n";
		{
			return 0;
		} else if (billyear == year && billmon < month) //print "DEBUG: DailyRate( future month )\n";
		{
			return 0;
		}

	if (billyear != year || billmon != month) //print "DEBUG: DailyRate( not this month )\n";
		{
			return charge;
		}

	var tailday = TailDate(year, month);
	return Math.floor(charge * (tailday - day + 1) / tailday);
};

function TailDate(yyyy, mm) //1ヶ月先に進む
//その1日前=今月末
//$y += 1900; $mo++;
//printf("%4d%02d%02d - %4d%02d%02d\n", $y, $mo, 1, $y, $mo, $d);
{
	++mm;

	if (mm > 12) {
		++yyyy;
		mm -= 12;
	}

	var tsuitachi = mktime(0, 0, 0, mm, 1, yyyy);
	var tailday = tsuitachi - 24 * 60 * 60;
	[h, mi, s, d, mo, y] = localtime(tailday);
	return d;
};

function writeInsFile(pactid, A_calcData) //データが空のときは終了.
//現在の日付を得る
//各データを書き出す
{
	if (!("H_utiwake" in global)) H_utiwake = undefined;
	if (!("fp_teldetails" in global)) fp_teldetails = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactname" in global)) pactname = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (A_calcData.length == 0) {
		return 0;
	}

	var nowtime = getTimestamp();

	for (var data of Object.values(A_calcData)) //data : telno, code, charge, taxkubun, detailNo
	//内訳コード
	//内訳コード名
	//末尾の空白を除く
	//税区分
	//表示順序
	//端末台数
	//realcnt １回線あたりの端末台数
	{
		var telno = data[0];
		var ut_code = data[1];
		var charge = data[2];
		var ut_name = H_utiwake[ut_code].name;
		ut_name = rtrim(ut_name, "\u3000 ");
		var taxkubun = data[3];
		var detailNo = data[4];
		var realcnt = data[5];
		fwrite(fp_teldetails, pactid + "\t" + telno + "\t" + ut_code + "\t" + ut_name + "\t" + charge + "\t" + taxkubun + "\t" + detailNo + "\t" + nowtime + "\t" + ANY_CARRIER_ID + "\t" + realcnt + "\n");
	}

	return 0;
};

function doBackup(db) //tel_details_X_tb をエクスポートする
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var outfile = DATA_EXP_DIR + "/" + teldetailX_tb + date("YmdHis") + ".exp";
	var sql = "select * from " + teldetailX_tb;
	var rtn = db.backup(outfile, sql);

	if (rtn == false) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
			db.rollback();
			throw die(1);
		}

	return 0;
};

function doDelete(A_pactDone, A_delData, db) //// 消費税を消去 -- 繰り返し処理したときにも問題無いように
//delte失敗した場合
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var sql_str = "delete from " + teldetailX_tb + " where pactid in (" + A_pactDone.join(",") + ")" + " and code='" + CODE_TAX + "'" + " and carid=" + ANY_CARRIER_ID;
	var rtn = db.query(sql_str, false);

	if ("object" === typeof rtn == true) //ロールバック
		//ロック解除
		//lock(false, $db);
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
			db.rollback();
			throw die(1);
		}

	for (var A_data of Object.values(A_delData)) //print "DEBUG: " . $sql_str . "\n";
	//delte失敗した場合
	{
		var pact = A_data[0];
		var telno = A_data[1];
		var code = A_data[2];
		sql_str = "delete from " + teldetailX_tb + " where pactid=" + pact + " and telno='" + telno + "'" + " and code='" + code + "'" + " and carid=" + ANY_CARRIER_ID;
		rtn = db.query(sql_str, false);

		if ("object" === typeof rtn == true) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3001" + rtn.userinfo);
				db.rollback();
				throw die(1);
			}
	}

	return 0;
};

function doImport(file_teldetails, db) //teldetailX_tbへのインポート
{
	if (!("teldetailX_tb" in global)) teldetailX_tb = undefined;
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (filesize(file_teldetails) > 0) {
		var teldetailX_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "realcnt"];

		if (doCopyInsert(teldetailX_tb, file_teldetails, teldetailX_col, db) != 0) //ロールバック
			//ロック解除
			//lock(false, $db);
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + "\u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F.");
				db.rollback();
				throw die(1);
			} else {
			logh.putError(G_SCRIPT_INFO, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + teldetailX_tb + " \u306E\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	} else //ファイルサイズが０？
		{
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + file_teldetails + "\u306E\u30D5\u30A1\u30A4\u30EB\u30B5\u30A4\u30BA\u304C\uFF10\u3067\u3059.");
			return 1;
		}

	return 0;
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactid_in" in global)) pactid_in = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
		return 1;
	}

	var ins = new TableInserter(logh, db, filename + ".sql", true);
	ins.begin(table);

	while (line = fgets(fp)) //データはtab区切り
	//インサート行の追加
	{
		var A_line = split("\t", rtrim(line, "\n"));

		if (A_line.length != columns.length) //要素数が異なっていたら
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002(" + A_line.length + "!=" + columns.length + "), \u30C7\u30FC\u30BF=" + line);
				fclose(fp);
				return 1;
			}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(columns)) {
			if (A_line[idx] != "\\N") //\N の場合はハッシュに追加しない
				{
					H_ins[col] = A_line[idx];
				}

			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid_in + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};

function finalData(pactid, pactDir, finDir) //同名のファイルが無いか
{
	if (!("logh" in global)) logh = undefined;
	if (!("billdate" in global)) billdate = undefined;

	if (is_file(finDir) == true) {
		logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + finDir + "\u306F\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3067\u306F\u3042\u308A\u307E\u305B\u3093.");
		return 1;
	}

	if (is_dir(finDir) == false) //なければ作成する
		{
			if (mkdir(finDir) == false) {
				logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + "\u7570\u52D5\u5148\u306E" + finDir + "\u304C\u4F5C\u6210\u3067\u304D\u306A\u304B\u3063\u305F.");
				return 1;
			}
		}

	var retval = 0;
	var dirh = opendir(pactDir);

	while (fname = readdir(dirh)) {
		var fpath = pactDir + "/" + fname;

		if (is_file(fpath)) //ファイル名が適合するものだけ
			{
				if (preg_match(ANY_PAT, fname)) //ファイル移動
					{
						if (rename(fpath, finDir + "/" + fname) == false) {
							logh.putError(G_SCRIPT_WARNING, SCRIPT_NAMEJ + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + fname + "\u306E\u7570\u52D5\u5931\u6557.");
							retval = 1;
						}
					}
			}

		clearstatcache();
	}

	closedir(dirh);
	return retval;
};

function usage(comment, db) //ロック解除
{
	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + _SERVER.argv[0] + " -y=YYYYMM -p={all|PACTID} -b={Y|N}\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	lock(false, db);
	throw die(1);
};

function lock(is_lock, db) //ロックする
{
	if (db == undefined) {
		return false;
	}

	var pre = "batch";

	if (is_lock == true) //既に起動中
		//現在の日付を得る
		//ロック解除
		{
			db.begin();
			db.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command like '" + db.escape(pre + "%") + "' and " + "status = 1;";
			var count = db.getOne(sql);

			if (count != 0) {
				db.rollback();
				return false;
			}

			var nowtime = getTimestamp();
			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + db.escape(pre + "_" + SCRIPTNAME) + "', 1, '" + nowtime + "');";
			db.query(sql);
			db.commit();
		} else {
		db.begin();
		db.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + db.escape(pre + "_" + SCRIPTNAME) + "';";
		db.query(sql);
		db.commit();
	}

	return true;
};

function getTimestamp() {
	var tm = localtime(Date.now() / 1000, true);
	var yyyy = tm.tm_year + 1900;
	var mm = tm.tm_mon + 1;
	if (mm < 10) mm = "0" + mm;
	var dd = tm.tm_mday + 0;
	if (dd < 10) dd = "0" + dd;
	var hh = tm.tm_hour + 0;
	if (hh < 10) hh = "0" + hh;
	var nn = tm.tm_min + 0;
	if (nn < 10) nn = "0" + nn;
	var ss = tm.tm_sec + 0;
	if (ss < 10) ss = "0" + ss;
	return `${yyyy}-${mm}-${dd} ${hh}:${nn}:${ss}+09`;
};