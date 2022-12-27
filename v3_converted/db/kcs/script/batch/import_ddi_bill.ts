//===========================================================================
//機能：請求情報ファイルインポートプロセス（WILLCOM専用）
//
//作成：前田
//更新履歴
//明細に出力しないコード配列に以下のコードを追加	2005/02/16 s.Maeda
//152020,154020,154040,158020,159500,162500
//会社単位請求に繰越額(810000)を追加 回線毎に按分できるよう対応	2005/07/20 s.Maeda
//ダミー電話の場合に明細出力しないコード Ｈ''ＬＩＮＫ情報料等(930004) を追加 2005/08/22 s.Maeda
//按分する場合でも端末販売代金(910000) はダミー電話に計上するよう対応 2005/08/23 s.Maeda
//ＤＢ２重化対応 ＣＯＰＹ文を廃止 2006/05/25 s.Maeda
//ビジネスサポート割引額＜非、非課税対象合計（＊）に対応 2006/06/19 s.Maeda
//ダミー電話番号の取得方法を変更 2006/07/31 s.Maeda
//内税、非課税対応 2006/08/17 s.Maeda
//複数請求ファイル一括取り込み 2006/08/24 s.Maeda
//ダミー電話の場合に明細出力しないコード 税込分・非課税分合計（＊）(790500) を追加 2006/09/19 s.Maeda
//＊レンタル無料期間(103010) を追加 2007/06/20 s.Maeda
//ＡＳＰ利用料をダミー電話番号は除外する方法を修正 2007/07/12 s.maeda
//※年間契約ご契約期間(164400) を追加 2007/07/23 s.Maeda
//※年契更新日１０月１日(164500) 、※次月への繰越額(680100)を追加 2007/09/20 s.Maeda
//※割賦代金請求残高を(108020)を追加 2008/01/23 s.Maeda
//W-VALUE対応 2008/01/25 s.maeda
//※年間契約ご契約期間を追加 (165045)2008/04/14 s.Maeda
//請求がマイナスの場合に対応 次月繰越金額(997000) 2004/04/17 s.Maeda
//除外コードにJHRファイルのグループ計(980900) を追加 2008/04/25 s.Maeda
//最終行の処理 2008/05/01 maeda 追加
//最終行の処理はダミー電話番号の場合は除外する 2008/05/21 maeda
//※ＰＲＩＮ無料期間(215400) を追加 2008/07/14 s.Maeda
//※年契更新日１０月１日(165050) を追加 2008/08/18 s.Maeda
//※年間契約ご契約期間を追加 (152450,154450)2008/08/26 s.Maeda
//※マルチパック対象を追加 (167010,167020)2008/08/26 s.Maeda
//明細に出力しないコード配列にコード追加(708000,708010,769100,769110,709000,709010) 2008/10/14 s.Maeda
//ダミー電話の場合に明細出力しないコード追加(930006) 2008/10/14 s.Maeda
//◇ご利用金額合計(996000) 追加 2008/12/26 s.Maeda
//※年間契約ご契約期間(165245) 追加 2009/05/26 s.Maeda
//※年契更新日７月１日(165250) 追加 2009/05/26 s.Maeda
//※年間契約ご契約期間((165145) 追加 2009/09/14 miyazawa
//※年契更新日１０月１日(165150) 追加 2009/09/14 miyazawa
//※年間契約ご契約期間(190145) 追加 2009/10/13 s.Maeda
//※利用パケット(230010) 追加 2009/11/13 s.Maeda
//※年間契約ご契約期間(190245)、 ※利用パケット(230015)、 ※利用パケット(740110) 追加 2009/12/11 s.Maeda
//===========================================================================
//ビジネスサポート割引月額料
//ビジネスサポート割引額
//ビジネスサポート割引額＜非
//消費税等
//define("CODE790000", "790000");                             // 非課税対象合計（＊）
//税込分・非課税分合計（＊）
//繰越額（＊）
//調整額（＊）
//define("CODE996000", "996000");								// ◇ご利用金額合計
//define("CODE997000", "997000");								// 次回振替金額（マイナス）
//define("CODE998000", "998000");								// 次回振替金額
//define("CODE999000", "999000");								// ご請求金額
//調整額
//一度にFETCHする行数
//データインポートする際の処理単位
//税区分 内税
//税区分 非対称等
//---------------------------------------------------------------------------
//共通ログファイル名
//ログListener を作成
//ログファイル名、ログ出力タイプを設定
//ログListener にログファイル名、ログ出力タイプを渡す
//DBハンドル作成
//エラー出力用ハンドル
//MtOutput（V3用）
//パラメータチェック
//数が正しくない
//旧ファイルヘッダ
//現行ファイルヘッダ
//明細に出力しないコード配列
//非課税対象合計（＊）(790000) を追加 2006/06/19 s.Maeda
//＊レンタル無料期間(103010) を追加 2007/06/20 s.Maeda
//※年間契約ご契約期間(164400) を追加 2007/07/23 s.Maeda
//※年契更新日１０月１日(164500) 、※次月への繰越額(680100)を追加 2007/09/20 s.Maeda
//※割賦代金請求残高を追加 (108020)2008/01/23 s.Maeda
//※年間契約ご契約期間を追加 (165045)2008/04/14 s.Maeda
//除外コードにJHRファイルのグループ計(980900) を追加 2008/04/25 s.Maeda
//※ＰＲＩＮ無料期間(215400) を追加 2008/07/14 s.Maeda
//※年契更新日１０月１日(165050) を追加 2008/08/18 s.Maeda
//※年間契約ご契約期間を追加 (152450,154450)2008/08/26 s.Maeda
//※マルチパック対象を追加 (167010,167020)2008/08/26 s.Maeda
//明細に出力しないコード配列にコード追加(708000,708010,769100,769110,709000,709010,103005) 2008/10/14 s.Maeda
//※年間契約ご契約期間(165245) 追加 2009/05/26 s.Maeda
//※年契更新日７月１日(165250) 追加 2009/05/26 s.Maeda
//※年間契約ご契約期間((165145) 追加 2009/09/14 miyazawa
//※年契更新日１０月１日(165150) 追加 2009/09/14 miyazawa
//※年間契約ご契約期間(190145) 追加 2009/10/13 s.Maeda
//※利用パケット(230010) 追加 2009/11/13 s.Maeda
//※年間契約ご契約期間(190245)、 ※利用パケット(230015)、 ※利用パケット(740110) 追加 2009/12/11 s.Maeda
//$A_exceptCode = array("110500","138500","142500","146100","146500","148500","150100","150400","150500","152100","152500","154100","154500","158100","158500","160110","160140","160150","160810","160840","160850","160910","160940","160950","161110","161140","161150","163400","163500","714000","724000","731000","701000","702000","724000","769500","980000",CODE790000,CODE996000,CODE997000,CODE998000,CODE999000,"152020","154020","154040","158020","159500","162500","410400","411400","103010","164400","680100","164500","108020","165045","215400","980900","165050","152450","154450","167010","167020","708000","708010","769100","769110","709000","709010","103005","165245","165250","165145","165150","190145","230010","190245","230015","740110",);
//按分する場合　電話回線毎に計上
//処理開始をログ出力
//請求データファイルがあるディレクトリを指定
//請求データファイルのディレクトリチェック
//ディレクトリのパスが不正の場合
//２重起動防止ロックをかける
//20110411
//税区分
//20080313
//pact_tb より登録されている契約ＩＤ、会社名を取得
//会社名マスターを作成
//utiwake_tb より内訳コード、内訳名称を取得
//$H_result = $dbh->getHash("select code,name,taxtype from utiwake_tb where carid = " . G_CARRIER_DDI . "order by code", true);	// 20110512
//20080313
//内訳コードマスターを作成
//テーブルＮＯ取得
//テーブル名設定
//処理する契約ＩＤ
//pactidでソート
//処理が終了した pactid を格納するための配列
//出力ファイル作成
//20110512
//DBに書き込む現在日時を取得
//pactid 毎に処理する
//出力ファイルクローズ
//処理する件数が０件なら直ちに終了する
//モードがオーバーライトの時はデータをインポートする前にデリート
//コミット
//完了したファイルを移動
//ロック解除
//処理終了をログ出力
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//使用説明
//[引　数] $comment 表示メッセージ
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//clamptasl_tb にレコードを追加し２重起動を防止する
//[引　数] $is_lock： true：ロックする、false：ロック解除
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//請求明細書のお客様番号よりダミーの電話番号と所属部署を取得する
//[引　数] $pactid：契約ＩＤ
//$reqno:お客様番号
//[返り値] ダミー電話番号と所属部署ＩＤ
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ルート部署のシステム用部署ＩＤを取得する
//[引　数] $pactid：契約ＩＤ
//$table：テーブル名
//[返り値] 成功：true、失敗：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ＡＳＰ利用料表示設定があるかないか
//[引　数] $pactid：契約ＩＤ
//[返り値] ある：true、ない：false
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ＡＳＰ利用料金の取得
//[引　数] $pactid：契約ＩＤ
//[返り値] ＡＳＰ利用料金
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルにエクスポートを行う
//pgpoolでのＤＢ２重化による対応
//[引　数] テーブル名、COPY用のファイル名、$db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う、lib/script_db.phpの共通関数を使用
//[引　数] テーブル名、入力ファイル名、カラム名の配列
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//ファイルからインポートを行う
//[引　数] テーブル名、COPY用のファイル名、$db
//[返り値] 終了コード　1（失敗）
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
//現在の日付を返す
//DBに書き込む現在日時に使用する
//_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
error_reporting(E_ALL);

require("lib/script_db.php");

require("lib/script_log.php");

require("lib/import_ddi_bill_except_code.php");

require("model/script/TelAmountModel.php");

require("MtOutput.php");

const DEBUG = 1;
const DDI_DIR = "/DDI/bill";
const FIN_DIR = "/fin";
const LOG_DELIM = " ";
const DDI_AREA_ID = 31;
const DDI_CIRCUIT_ID = 6;
const SCRIPTNAME = "import_ddi_bill.php";
const CODE721000 = "721000";
const CODE723500 = "723500";
const CODE730000 = "730000";
const CODE771000 = "771000";
const CODE790500 = "790500";
const CODE810000 = "810000";
const CODE850000 = "850000";
const TYOUSEI = "tyousei";
const NUM_FETCH = 10000;
const COPY_LINES = 10000;
const UTIZEI = 3;
const HITAISYOU = 4;
var dbLogFile = DATA_LOG_DIR + "/billbat.log";
var log_listener = new ScriptLogBase(0);
var log_listener_type = new ScriptLogFile(G_SCRIPT_INFO + G_SCRIPT_WARNING + G_SCRIPT_ERROR + G_SCRIPT_BEGIN + G_SCRIPT_END, dbLogFile);
log_listener.PutListener(log_listener_type);
var dbh = new ScriptDB(log_listener);
var logh = new ScriptLogAdaptor(log_listener, true);
var O_out = MtOutput.singleton();

if (_SERVER.argv.length != 7) //数が正しい
	{
		usage("");
	} else //$argvCounter 0 はスクリプト名のため無視
	{
		var argvCnt = _SERVER.argv.length;

		for (var argvCounter = 1; argvCounter < argvCnt; argvCounter++) //mode を取得
		{
			if (ereg("^-e=", _SERVER.argv[argvCounter]) == true) //モード文字列チェック
				{
					var mode = ereg_replace("^-e=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ao]$", mode) == false) {
						usage("\u30E2\u30FC\u30C9\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-y=", _SERVER.argv[argvCounter]) == true) //請求年月文字列チェック
				{
					var billdate = ereg_replace("^-y=", "", _SERVER.argv[argvCounter]);

					if (ereg("^[0-9]{6}$", billdate) == false) {
						usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					} else //年月チェック
						{
							var year = billdate.substr(0, 4);
							var month = billdate.substr(4, 2);

							if (year < 2000 || year > 2100 || (month < 1 || month > 12)) {
								usage("\u8ACB\u6C42\u5E74\u6708\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
							}
						}

					continue;
				}

			if (ereg("^-p=", _SERVER.argv[argvCounter]) == true) //契約ＩＤチェック
				{
					var pactid = ereg_replace("^-p=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^all$", pactid) == false && ereg("^[0-9]+$", pactid) == false) {
						usage("\u5951\u7D04\uFF29\uFF24\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-b=", _SERVER.argv[argvCounter]) == true) //バックアップの有無のチェック
				{
					var backup = ereg_replace("^-b=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ny]$", backup) == false) {
						usage("\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-t=", _SERVER.argv[argvCounter]) == true) //電話テーブルの指定をチェック
				{
					var teltable = ereg_replace("^-t=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[no]$", teltable) == false) {
						usage("\u96FB\u8A71\u30C6\u30FC\u30D6\u30EB\u306E\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			if (ereg("^-a=", _SERVER.argv[argvCounter]) == true) //会社一括請求データを電話回線毎に按分するかをチェック
				{
					var anbun = ereg_replace("^-a=", "", _SERVER.argv[argvCounter]).toLowerCase();

					if (ereg("^[ny]$", anbun) == false) {
						usage("\u4F1A\u793E\u4E00\u62EC\u8ACB\u6C42\u30C7\u30FC\u30BF\u306E\u6309\u5206\u6307\u5B9A\u304C\u4E0D\u6B63\u3067\u3059");
					}

					continue;
				}

			usage("");
		}
	}

var headSkuFile1 = "\"\u8ACB\u6C42\u5E74\u6708\u5EA6\",\"\u304A\u5BA2\u69D8\u756A\u53F7\",\"\u30DD\u30B1\u30C3\u30C8\u96FB\u8A71\u756A\u53F7\",\"\u3054\u5229\u7528\u6708\u6570\",\"\u6599\u91D1\u306E\u5185\u8A33\",\"\u3054\u5229\u7528\u671F\u9593\u7B49\",\"\u91D1\u984D\",\"\u7DE8\u96C6\uFF33\uFF25\uFF31\",\"\u30B0\u30EB\u30FC\u30D7\u30B3\u30FC\u30C9\",\"\u30B0\u30EB\u30FC\u30D7\u540D\"";
var headJhrFile1 = "\"\u8ACB\u6C42\u5E74\u6708\u5EA6\",\"\u304A\u5BA2\u69D8\u756A\u53F7\",\"\u30DD\u30B1\u30C3\u30C8\u96FB\u8A71\u756A\u53F7\",\"\u30D7\u30ED\u30D0\u30A4\u30C0\u540D\",\"\u91D1\u984D\",\"\u7DE8\u96C6\uFF33\uFF25\uFF31\",\"\u30B0\u30EB\u30FC\u30D7\u30B3\u30FC\u30C9\",\"\u30B0\u30EB\u30FC\u30D7\u540D\"";
var headSkuFile2 = "\"\u8ACB\u6C42\u5E74\u6708\u5EA6\",\"\u304A\u5BA2\u69D8\u756A\u53F7\",\"\u3054\u5951\u7D04\u96FB\u8A71\u756A\u53F7\u3000\",\"\u3054\u5229\u7528\u6708\u6570\",\"\u6599\u91D1\u306E\u5185\u8A33\",\"\u3054\u5229\u7528\u671F\u9593\u7B49\",\"\u91D1\u984D\",\"\u7DE8\u96C6\uFF33\uFF25\uFF31\",\"\u30B0\u30EB\u30FC\u30D7\u30B3\u30FC\u30C9\",\"\u30B0\u30EB\u30FC\u30D7\u540D\"";
var headJhrFile2 = "\"\u8ACB\u6C42\u5E74\u6708\u5EA6\",\"\u304A\u5BA2\u69D8\u756A\u53F7\",\"\u3054\u5951\u7D04\u96FB\u8A71\u756A\u53F7\u3000\",\"\u30D7\u30ED\u30D0\u30A4\u30C0\u540D\",\"\u91D1\u984D\",\"\u7DE8\u96C6\uFF33\uFF25\uFF31\",\"\u30B0\u30EB\u30FC\u30D7\u30B3\u30FC\u30C9\",\"\u30B0\u30EB\u30FC\u30D7\u540D\"";
headSkuFile1 = mb_convert_encoding(headSkuFile1, "CP51932", "UTF-8");
headJhrFile1 = mb_convert_encoding(headJhrFile1, "CP51932", "UTF-8");
headSkuFile2 = mb_convert_encoding(headSkuFile2, "CP51932", "UTF-8");
headJhrFile2 = mb_convert_encoding(headJhrFile2, "CP51932", "UTF-8");

if (anbun == "y") //ダミー電話番号の時は $A_exceptCode に加えて出力しないコード配列
	//ダミー電話の場合に明細出力しないコード Ｈ''ＬＩＮＫ情報料等(930004) を追加 2005/08/22 s.Maeda
	//ビジネスサポート割引額＜非(730000) を追加 2006/06/19 s.Maeda
	//ダミー電話の場合に明細出力しないコード 税込分・非課税分合計（＊）(790500) を追加 2006/09/19 s.Maeda
	//ダミー電話の場合に明細出力しないコード追加(930006) 2008/10/14 s.Maeda
	//按分しない場合　ダミー電話に計上
	{
		var A_exceptCodeOnlyDummy = [CODE721000, CODE723500, CODE730000, CODE771000, CODE790500, CODE810000, CODE850000, "930004", "930006", "703006"];
	} else if (anbun == "n") //ダミー電話番号の時は $A_exceptCode に加えて出力しないコード配列
	//ダミー電話の場合に明細出力しないコード Ｈ''ＬＩＮＫ情報料等(930004) を追加 2005/08/22 s.Maeda
	//ダミー電話の場合に明細出力しないコード 税込分・非課税分合計（＊）(790500) を追加 2006/09/19 s.Maeda
	//ダミー電話の場合に明細出力しないコード追加(930006) 2008/10/14 s.Maeda
	{
		A_exceptCodeOnlyDummy = ["930004", "930006", CODE790500, "703006"];
	}

var exceptCnt = A_exceptCode.length;
var exceptOnlyDummyCnt = A_exceptCodeOnlyDummy.length;
print("BEGIN: \uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB\n");
logh.putError(G_SCRIPT_BEGIN, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u958B\u59CB");
var dataDir = DATA_DIR + "/" + year + month + DDI_DIR;

if (is_dir(dataDir) == false) //ディレクトリのパスが正しい場合
	{
		print("\n\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
		logh.putError(G_SCRIPT_ERROR, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093");
	} else //処理する契約ＩＤ配列
	//ディレクトリハンドル
	//契約ＩＤの指定が全て（all）の時
	{
		var A_pactid = Array();
		var dirh = opendir(dataDir);

		if (pactid == "all") //処理する契約ＩＤを取得する
			//契約ＩＤが指定されている場合
			{
				var fileName;

				while (fileName = readdir(dirh)) //カレントと親ディレクトリを除いたディレクトリ名（＝契約ＩＤ）を配列へ格納する
				{
					if (is_dir(dataDir + "/" + fileName) == true && fileName != "." && fileName != "..") {
						A_pactid.push(fileName);
					}

					clearstatcache();
				}
			} else {
			A_pactid.push(pactid);
		}

		closedir(dirh);
	}

lock(true);
var O_tab = new TelAmountModel(dataDir, logh, _SERVER.argv, SCRIPTNAME);
var A_prtelnos = Array();
var H_taxMaster = {
	"0": "",
	"1": "\u5408\u7B97",
	"2": "\u500B\u5225",
	"3": "\u5185\u7A0E",
	"4": "\u975E\u5BFE\u79F0\u7B49",
	"5": "\u5408\u7B97\uFF0F\u975E\u5BFE\u79F0\u7B49"
};
mb_convert_variables("CP51932", "UTF-8", H_taxMaster);
var H_result = dbh.getHash("select pactid,compname from pact_tb order by pactid", true);
var pactCnt = H_result.length;

for (var pactCounter = 0; pactCounter < pactCnt; pactCounter++) {
	H_pactid[H_result[pactCounter].pactid] = H_result[pactCounter].compname;
}

H_result = dbh.getHash("select code,name,taxtype,codetype from utiwake_tb where carid = " + G_CARRIER_DDI + "order by code", true);
mb_convert_variables("CP51932", "UTF-8", H_result);
var codeCnt = H_result.length;

for (var codeCounter = 0; codeCounter < codeCnt; codeCounter++) //内訳コードマスターを作成
//税区分マスターを作成
//税区分が内税、非対称等の内訳コードマスターを作成
{
	H_code[H_result[codeCounter].code] = H_result[codeCounter].name;
	H_codetype[H_result[codeCounter].code] = H_result[codeCounter].codetype;
	H_taxtype[H_result[codeCounter].code] = H_result[codeCounter].taxtype;

	if (H_result[codeCounter].taxtype == UTIZEI || H_result[codeCounter].taxtype == HITAISYOU) {
		H_noTaxCode[H_result[codeCounter].code] = H_result[codeCounter].taxtype;
	}
}

var O_tableNo = new TableNo();
var tableNo = O_tableNo.get(year, month);
var tel_tb = "tel_tb";
var postrel_tb = "post_relation_tb";
var telX_tb = "tel_" + tableNo + "_tb";
var postX_tb = "post_" + tableNo + "_tb";
var postrelX_tb = "post_relation_" + tableNo + "_tb";
var teldetails_tb = "tel_details_" + tableNo + "_tb";
var dummytel_tb = "dummy_tel_tb";
var unregistCode = Array();
var provisionalCount = 0;
pactCnt = A_pactid.length;
A_pactid.sort();
var A_pactDone = Array();
var teldetailsFile = dataDir + "/" + teldetails_tb + year + month + pactid + ".ins";
var telFile = dataDir + "/" + tel_tb + year + month + pactid + ".ins";
var telXFile = dataDir + "/" + telX_tb + year + month + pactid + ".ins";
var utiwakeFile = dataDir + "/utiwake_tb" + year + month + pactid + ".ins";
var fp_teldetails = fopen(teldetailsFile, "w");
var fp_tel = fopen(telFile, "w");
var fp_telX = fopen(telXFile, "w");
O_tab.makeFile(year, month, pactid);
var now = getTimestamp();

for (pactCounter = 0;; pactCounter < pactCnt; pactCounter++) //請求データディレクトリにある契約ＩＤがマスターに登録されている場合
{
	if (undefined !== H_pactid[A_pactid[pactCounter]] == true) //処理する請求データファイル名配列
		//請求データファイル名を取得する
		//ファイル名順でソート
		//請求データファイルがなかった場合
		//請求データディレクトリにある契約ＩＤがマスターに登録されていない場合
		{
			var A_billFile = Array();
			var dataDirPact = dataDir + "/" + A_pactid[pactCounter];
			dirh = opendir(dataDirPact);

			while (fileName = readdir(dirh)) {
				if (is_file(dataDirPact + "/" + fileName) == true) {
					A_billFile.push(fileName);
				}

				clearstatcache();
			}

			A_billFile.sort();

			if (A_billFile.length == 0) //請求データファイルがあった場合
				{
					print("WARNING: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\n");
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
					closedir(dirh);
					continue;
				} else //ファイル名をキー、ファイルデータを値とした連想配列
				//ファイル名をキー、契約ＩＤを値とした連想配列
				//ファイル名をキー、請求年月を値とした連想配列
				//お客様番号をキー、マージしたファイルデータを値とした連想配列
				//tel_tb 登録済み電話番号リスト
				//tel_X_tb 登録済み電話番号リスト
				//ASP利用料表示権限があるかないか ある：true、ない：false
				//ASP利用料金
				//tel_tb インポートデータファイル出力用配列
				//telX_tb インポートデータファイル出力用配列
				//tel_details_X_tb インポートデータファイル出力用配列
				//ダミー電話番号とその電話を所属させる部署
				//お客様番号をキー、array(ダミー電話番号,部署ＩＤ)を値とした連想配列
				//お客様番号をキー、ファイル名配列を値とした連想配列
				//作業用配列
				//お客様番号数
				//お客様番号退避用変数
				//既にtel_details_X_tbに取り込まれている電話番号
				//20110512
				//ルート部署を取得
				//現在用
				//請求月用
				//ファイル数分処理を行う
				//お客様番号でソート
				//お客様番号数
				//お客様番号毎で処理する
				//お客様番号でソート
				//権限チェック 「ASP利用料表示設定」 がＯＮになっているか
				//請求月電話番号マスター作成
				//追加モードの場合は既に取り込み完了している電話番号を取得する
				//現在の登録電話番号数
				//請求月の電話番号数
				//異なるお客様番号ファイルのどれかにしか存在しない電話番号（ユニーク）
				//異なるお客様番号ファイルに重複して存在している電話番号をキー、
				//明細番号(detailno)を値にした連想配列
				//tel_tb へ追加する電話番号
				//tel_X_tb へ追加する電話番号
				//お客様番号毎で処理する
				//出力件数用変数初期化
				//tel_tb ファイル出力
				//バッファ出力
				//tel_X_tb ファイル出力
				//バッファ出力
				//tel_details_X_tb ファイル出力
				//バッファ出力
				{
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + A_pactid[pactCounter] + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + LOG_DELIM + year + month + LOG_DELIM + A_billFile.join(","));
					var H_fileData = Array();
					var H_filePact = Array();
					var H_fileBillDate = Array();
					var H_margeData = Array();
					var A_telno = Array();
					var A_telnoX = Array();
					var aspFlg = false;
					var aspCharge = 0;
					var A_telOutputBuff = Array();
					var A_telXOutputBuff = Array();
					var A_teldetailsOutputBuff = Array();
					var H_dummyData = Array();
					var H_dummyTel = "";
					var H_kokyakuno = Array();
					var A_tmp = Array();
					var multifileCnt = 0;
					var old_kokyakuno = "";
					var A_uniqTelnoX = Array();
					var prtelno = undefined;
					A_prtelnos;
					var A_utiwakeOutputBuff = Array();
					var rootPostid = getRootPostid(A_pactid[pactCounter], postrel_tb);
					var rootPostidX = getRootPostid(A_pactid[pactCounter], postrelX_tb);

					for (var fileCounter = 0; fileCounter < A_billFile.length; fileCounter++) //ファイルを１行ずつ配列へ格納する
					//var_dump(file($dataDirPact . "/" . $A_billFile[$fileCounter]));
					//ファイルの２行目を取得する。 全半角スペース、「"」は取り除き、カンマで区切られた文字を配列へセットする
					//var_dump($A_tmp);
					//お客様番号がキーとして存在していない場合
					{
						H_fileData[A_billFile[fileCounter]] = file(dataDirPact + "/" + A_billFile[fileCounter]);
						A_tmp = split(",", str_replace([" ", mb_convert_encoding("\u3000", "CP51932", "UTF-8"), "\""], ["", "", ""], H_fileData[A_billFile[fileCounter]][1]));

						if (undefined !== H_kokyakuno[A_tmp[1]] == false) //お客様番号をキー、ファイル名配列を値とした連想配列
							//お客様番号が既にキーとして存在している場合
							{
								H_kokyakuno[A_tmp[1]] = [A_billFile[fileCounter]];
							} else //お客様番号をキー、ファイル名配列を値とした連想配列
							{
								H_kokyakuno[A_tmp[1]].push(A_billFile[fileCounter]);
							}
					}

					asort(H_kokyakuno);
					multifileCnt = Object.keys(H_kokyakuno).length;

					for (var kokyakuno of Object.values(Object.keys(H_kokyakuno))) //お客様番号が切り替わった時の処理
					//お客様番号を退避
					{
						if (old_kokyakuno != "" && old_kokyakuno != kokyakuno) //初期化
							//ファイル名をキー、契約ＩＤを値とした連想配列
							{
								H_filePact = Array();
							}

						for (var filename of Object.values(H_kokyakuno[kokyakuno])) //ファイルヘッダー（１行目）チェック
						{
							if (chop(H_fileData[filename][0]) != headSkuFile1 && chop(H_fileData[filename][0]) != headJhrFile1 && chop(H_fileData[filename][0]) != headSkuFile2 && chop(H_fileData[filename][0]) != headJhrFile2) //エラーとなった契約ＩＤはとばすが処理は続ける
								{
									print("WARNING: " + dataDirPact + "/" + filename + " \u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u4E0D\u6B63\u3067\u3059\n");
									logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u306E\u30D5\u30A9\u30FC\u30DE\u30C3\u30C8\u304C\u4E0D\u6B63\u3067\u3059");
									continue;
								}

							for (var lineCounter = 1; lineCounter < H_fileData[filename].length; lineCounter++) //全半角スペース、「"」は取り除き、カンマで区切られた文字を配列へセットする
							//請求月チェック
							//カラム数でファイル識別　カラム数１０個：SKUファイル、８個：JHRファイル
							//ハイフンなし電話番号、ハイフンあり電話番号、内訳コード、金額、利用期間順で配列へセット
							{
								if ("" == H_fileData[filename][lineCounter].trim()) {
									break;
								}

								A_tmp = Array();
								A_tmp[lineCounter - 1] = split(",", str_replace([" ", mb_convert_encoding("\u3000", "CP51932", "UTF-8"), "\""], ["", "", ""], H_fileData[filename][lineCounter]));

								if (undefined !== H_fileBillDate[filename] == false) //請求データファイルの２行目の請求年月度をセット
									//パラメータの請求年月の１ヶ月前とファイルの請求年月度が違う場合
									{
										H_fileBillDate[filename] = A_tmp[lineCounter - 1][0];

										if (H_fileBillDate[filename] != date("Ym", mktime(0, 0, 0, month - 1, 1, year))) //エラーとなった契約ＩＤはとばすが処理は続ける
											{
												print("WARNING: " + dataDirPact + "/" + filename + " \u30D5\u30A1\u30A4\u30EB\u306E\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059\n");
												logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u8ACB\u6C42\u5E74\u6708\u304C\u4E0D\u6B63\u3067\u3059");
												continue;
											}
									}

								if (undefined !== H_filePact[filename] == false) //請求データファイルの２行目のお客様番号からpactidを取得しセットする
									//pactid が見つからなかった場合
									{
										var sql = "select pactid from bill_prtel_tb where carid = " + G_CARRIER_DDI + " " + "and prtelno = '" + A_tmp[lineCounter - 1][1] + "'";
										H_filePact[filename] = dbh.getOne(sql, true);
										prtelno = A_tmp[lineCounter - 1][1];
										A_prtelnos[prtelno] = 0;

										if (H_filePact[filename] == "") //エラーとなった契約ＩＤはとばすが処理は続ける
											{
												print("WARNING: " + dataDirPact + "/" + filename + " \u306E\u304A\u5BA2\u69D8\u756A\u53F7\uFF08" + A_tmp[lineCounter - 1][1] + "\uFF09\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\n");
												logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u306E\u304A\u5BA2\u69D8\u756A\u53F7\uFF08" + A_tmp[lineCounter - 1][1] + "\uFF09\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
												continue;
											}

										if (H_filePact[filename] != A_pactid[pactCounter]) //エラーとなった契約ＩＤはとばすが処理は続ける
											{
												print("WARNING: " + dataDirPact + "/" + filename + " \u30D5\u30A1\u30A4\u30EB\u306E\u5951\u7D04\uFF29\uFF24\u304C\u4E0D\u6B63\u3067\u3059\n");
												logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u5951\u7D04\uFF29\uFF24\u304C\u4E0D\u6B63\u3067\u3059");
												continue;
											}
									}

								if (undefined !== H_dummyTel[kokyakuno] == false) //pactidとお客様番号をもとにダミー電話番号とダミー電話番号用部署ＩＤを取得する
									//ダミー電話番号が設定されていない場合
									{
										H_dummyData = getDummy(A_pactid[pactCounter], A_tmp[lineCounter - 1][1]);

										if (H_dummyData.length == 0) //エラーとなった契約ＩＤはとばすが処理は続ける
											//ダミー電話番号が設定されていた場合
											{
												print("WARNING: " + dataDirPact + "/" + filename + " \u306E\u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");
												logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u306E\u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
												continue;
											} else //お客様番号が１つの場合
											{
												if (multifileCnt == 1) //ダミー電話番号を所属させる部署ＩＤが指定されていない場合
													//複数一括取り込みの場合
													{
														if (H_dummyData[0].postid == "") //ダミー電話番号とダミー電話番号を所属させる部署ＩＤ(ルート部署ＩＤ)
															//ダミー電話番号を所属させる部署ＩＤが指定されている場合
															{
																H_dummyTel[kokyakuno] = [H_dummyData[0].telno, rootPostidX];
															} else //ダミー電話番号とダミー電話番号を所属させる部署ＩＤ
															{
																H_dummyTel[kokyakuno] = [H_dummyData[0].telno, H_dummyData[0].postid];
															}
													} else //ダミー電話番号を所属させる部署ＩＤが指定されていない場合
													//代りにルート部署を設定するのではなくＷＡＲＮＩＮＧ扱いとする
													{
														if (H_dummyData[0].postid == "") //エラーとなった契約ＩＤはとばすが処理は続ける
															{
																print("WARNING: " + dataDirPact + "/" + filename + " \u306E\u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\uFF08" + H_dummyData[0].telno + "\uFF09\u306E\u6240\u5C5E\u90E8\u7F72\uFF29\uFF24\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");
																logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + dataDirPact + "/" + filename + "\uFF09\u306E\u30C0\u30DF\u30FC\u96FB\u8A71\u756A\u53F7\uFF08" + H_dummyData[0].telno + "\uFF09\u306E\u6240\u5C5E\u90E8\u7F72\uFF29\uFF24\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
																continue;
															} else //ダミー電話番号とダミー電話番号を所属させる部署ＩＤ
															{
																H_dummyTel[kokyakuno] = [H_dummyData[0].telno, H_dummyData[0].postid];
															}
													}
											}
									}

								if ("108000" == A_tmp[lineCounter - 1][7]) //「ご契約電話番号」に入っている番号（端末番号？）を退避
									//「ご利用期間等」に入っている電話番号を退避
									//「ご契約電話番号」と「ご利用期間等」の内容を入れ替える
									{
										var kappuNo = A_tmp[lineCounter - 1][2];
										var kappuTelno = str_replace("\u2010", "-", mb_convert_kana(mb_convert_encoding(A_tmp[lineCounter - 1][5], "UTF-8", "EUC-JP"), "a"));
										A_tmp[lineCounter - 1][2] = kappuTelno;
										A_tmp[lineCounter - 1][5] = kappuNo;
									}

								if (true == (undefined !== kappuTelno) && true == (undefined !== kappuNo)) {
									if (A_tmp[lineCounter - 1][2] == kappuNo) {
										A_tmp[lineCounter - 1][2] = kappuTelno;
									}
								}

								var telno = str_replace("-", "", A_tmp[lineCounter - 1][2]);
								var telno_view = A_tmp[lineCounter - 1][2];

								if (A_tmp[lineCounter - 1].length == 10) //配列が作られてなければ配列を設定する
									{
										if (undefined !== H_margeData[kokyakuno] == false) //配列が作られていれば追加する
											{
												H_margeData[kokyakuno] = [[telno, telno_view, A_tmp[lineCounter - 1][7], A_tmp[lineCounter - 1][6], A_tmp[lineCounter - 1][5], A_tmp[lineCounter - 1][4]]];
											} else {
											H_margeData[kokyakuno].push([telno, telno_view, A_tmp[lineCounter - 1][7], A_tmp[lineCounter - 1][6], A_tmp[lineCounter - 1][5], A_tmp[lineCounter - 1][4]]);
										}

										if (!(-1 !== A_exceptCode.indexOf(A_tmp[lineCounter - 1][7]))) {
											A_prtelnos[prtelno] += A_tmp[lineCounter - 1][6];
										}
									} else if (A_tmp[lineCounter - 1].length == 8) {
									if (undefined !== H_margeData[kokyakuno] == false) {
										H_margeData[kokyakuno] = [[telno, telno_view, A_tmp[lineCounter - 1][5], A_tmp[lineCounter - 1][4], ""]];
									} else {
										H_margeData[kokyakuno].push([telno, telno_view, A_tmp[lineCounter - 1][5], A_tmp[lineCounter - 1][4], ""]);
									}
								}
							}
						}

						old_kokyakuno = kokyakuno;
					}

					ksort(H_margeData);

					if (chkAsp(A_pactid[pactCounter]) == true) //ASP利用料を取得
						//ASP利用料が設定されていない場合
						{
							aspFlg = true;
							aspCharge = getAsp(A_pactid[pactCounter]);

							if (is_null(aspCharge)) //エラーとなった契約ＩＤはとばすが処理は続ける
								{
									print("WARNING: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D \uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");
									logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D \uFF21\uFF33\uFF30\u5229\u7528\u6599\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
									continue;
								}
						}

					var sql_str = `select telno from ${tel_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " order by telno";

					for (var data of Object.values(dbh.getHash(sql_str, true))) {
						A_telno.push(data.telno);
					}

					sql_str = `select telno from ${telX_tb} where pactid = ` + A_pactid[pactCounter] + " and " + "carid = " + G_CARRIER_DDI + " order by telno";

					for (var data of Object.values(dbh.getHash(sql_str, true))) {
						A_telnoX.push(data.telno);
					}

					if (mode == "a") {
						sql_str = "select distinct telno from " + teldetails_tb + " where pactid = " + A_pactid[pactCounter] + " and carid = " + G_CARRIER_DDI + " order by telno";

						for (var data of Object.values(dbh.getHash(sql_str, true))) {
							A_uniqTelnoX.push(data.telno);
						}
					}

					var telCnt = A_telno.length;
					var telCntX = A_telnoX.length;
					var A_uniqTelno = Array();
					var H_dupliTelno = Array();
					var A_telAddList = Array();
					var A_telXAddList = Array();

					for (var kokyakuno of Object.values(Object.keys(H_kokyakuno))) //マージ配列のソート（電話番号、内訳コード昇順）
					//print_r($H_margeData[$kokyakuno]);
					//ファイル出力準備
					//tel_X_tb で電話番号存在チェックしたか 未チェック：false、済み：true
					//tel_tb に電話登録する必要があるか 必要なし：false、必要あり：true
					//tel_X_tb に電話登録する必要があるか 必要なし：false、必要あり：true
					//消費税計算するために金額を集計しておく
					//電話毎に計算した消費税合計 請求データ消費税額 - $sumTax したものをダミー電話で調整する
					//電話毎の非課税対象金額
					//按分する場合　電話回線毎に計上
					//請求データを１行ずつ処理 END
					//未登録内訳コードが在ればエラー終了 houshi
					{
						rsort(H_margeData[kokyakuno]);
						var margeCnt = H_margeData[kokyakuno].length;
						var telChkFlg = false;
						var telAddFlg = true;
						var telAddFlgX = true;
						var detailNo = 0;
						var oldTelno = "";
						var sumChargePact = 0;
						var sumCharge = 0;
						var sumTax = 0;
						var noTaxCharge = 0;

						if (anbun == "y") //ビジネスサポート割引月額料
							//ビジネスサポート割引額
							//ビジネスサポート割引額＜非
							//消費税等
							//繰越額
							//調整額
							//回線毎のビジネスサポート割引月額料＋ビジネスサポート割引額＋調整額＋繰越額
							//電話毎に計算した割引額合計 $ikkatuAll - $sumIkkatu したものをダミー電話で調整する
							//ビジネスサポート割引月額料＋ビジネスサポート割引額＋調整額＋繰越額
							//会社毎の請求金額
							//請求電話台数
							//割引額を求める必要があるか ない：false、ある：true
							//会社単位の請求金額を調べる
							//案分対象の合計を求める
							//ビジネスサポート割引額＜非 に対応 2006/06/19 s.Maeda
							//案分対象の合計がマイナスなら割引率を求める
							{
								var busiTeigaku = 0;
								var busiWaribiki = 0;
								var busiWaribikiHi = 0;
								var billTax = 0;
								var kurikosi = 0;
								var adjust = 0;
								var ikkatu = 0;
								var sumIkkatu = 0;
								var ikkatuAll = 0;
								var billAll = 0;
								var billTelCnt = 0;
								var waribikiFlg = false;

								for (var margeCounter = 0; margeCounter < margeCnt; margeCounter++) //電話番号がない明細行にはダミー電話番号を設定する
								{
									if (!H_margeData[kokyakuno][margeCounter][0] == true) {
										H_margeData[kokyakuno][margeCounter][0] = H_margeData[kokyakuno][margeCounter][1] = H_dummyTel[kokyakuno][0];
									}

									if (H_margeData[kokyakuno][margeCounter][0] == H_dummyTel[kokyakuno][0]) //ビジネスサポート割引月額料
										{
											if (H_margeData[kokyakuno][margeCounter][2] == CODE721000) {
												busiTeigaku = H_margeData[kokyakuno][margeCounter][3];
											}

											if (H_margeData[kokyakuno][margeCounter][2] == CODE723500) {
												busiWaribiki = H_margeData[kokyakuno][margeCounter][3];
											}

											if (H_margeData[kokyakuno][margeCounter][2] == CODE730000) {
												busiWaribikiHi = H_margeData[kokyakuno][margeCounter][3];
											}

											if (H_margeData[kokyakuno][margeCounter][2] == CODE771000) {
												billTax = H_margeData[kokyakuno][margeCounter][3];
											}

											if (H_margeData[kokyakuno][margeCounter][2] == CODE810000) {
												kurikosi = H_margeData[kokyakuno][margeCounter][3];
											}

											if (H_margeData[kokyakuno][margeCounter][2] == CODE850000) {
												adjust = H_margeData[kokyakuno][margeCounter][3];
											}

											if (H_margeData[kokyakuno][margeCounter][2] == CODE996000 || H_margeData[kokyakuno][margeCounter][2] == CODE997000 || H_margeData[kokyakuno][margeCounter][2] == CODE998000 || H_margeData[kokyakuno][margeCounter][2] == CODE999000) {
												billAll = H_margeData[kokyakuno][margeCounter][3];
											}
										} else //電話番号が変わった場合
										{
											if (H_margeData[kokyakuno][margeCounter][0] != oldTelno) //追記モード かつ ＤＢに同じ電話番号がある場合はWARNINGを出して処理をスキップする
												{
													if (mode == "a" && -1 !== A_uniqTelnoX.indexOf(H_margeData[kokyakuno][margeCounter][0]) == true) //エラーとなった契約ＩＤはとばすが処理は続ける
														{
															print("WARNING: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF(" + H_kokyakuno[kokyakuno].join(",") + ")\u306B\u3042\u308B\u96FB\u8A71\u756A\u53F7" + H_margeData[kokyakuno][margeCounter][0] + "\u304C\u65E2\u306B\uFF24\uFF22\u306E\u5B58\u5728\u3059\u308B\u305F\u3081\u8FFD\u8A18\u30E2\u30FC\u30C9\u3067\u53D6\u308A\u8FBC\u307F\u3067\u304D\u307E\u305B\u3093\u3002\n");
															logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u8ACB\u6C42\u30C7\u30FC\u30BF(" + H_kokyakuno[kokyakuno].join(",") + ")\u306B\u3042\u308B\u96FB\u8A71\u756A\u53F7" + H_margeData[kokyakuno][margeCounter][0] + "\u304C\u65E2\u306B\uFF24\uFF22\u306E\u5B58\u5728\u3059\u308B\u305F\u3081\u8FFD\u8A18\u30E2\u30FC\u30C9\u3067\u53D6\u308A\u8FBC\u307F\u3067\u304D\u307E\u305B\u3093\u3002");
															continue;
														}

													billTelCnt++;
												}
										}

									oldTelno = H_margeData[kokyakuno][margeCounter][0];
								}

								ikkatuAll = busiTeigaku + busiWaribiki + busiWaribikiHi + adjust + kurikosi;

								if (ikkatuAll < 0) //割引率を求める
									//案分対象の合計がプラスなら電話台数で均等割する
									{
										waribikiFlg = true;
										var discountRatio = ikkatuAll / (billAll - billTax + ikkatuAll * -1) * -1;
									} else //均等割額を求める
									{
										ikkatu = Math.floor(ikkatuAll / billTelCnt);
									}

								oldTelno = "";
							}

						for (margeCounter = 0;; margeCounter < margeCnt; margeCounter++) //電話番号がない明細行にはダミー電話番号を設定する
						//ダミー電話番号の処理
						//処理した電話番号を退避
						//電話単位小計
						//会社単位合計
						//内訳種別コードの税区分が内税、非対称等であれば電話番号毎に非課税対象額をサマリーする
						{
							if (!H_margeData[kokyakuno][margeCounter][0] == true) {
								H_margeData[kokyakuno][margeCounter][0] = H_margeData[kokyakuno][margeCounter][1] = H_dummyTel[kokyakuno][0];
							}

							if (H_margeData[kokyakuno][margeCounter][0] != oldTelno && oldTelno != "") //按分する場合　電話回線毎に計上
								//消費税を出力
								//ASP利用料表示する
								//ダミー電話番号は除外 2007/07/12 s.maeda
								//初期化
								//初期化
								//初期化
								//電話番号存在チェックフラグを初期化
								//初期化 デフォルトは追加する
								//初期化 デフォルトは追加する
								//按分する場合　電話回線毎に計上
								{
									if (anbun == "y") //会社単位の請求がある場合
										//会社単位合計
										//消費税を求める
										//会社単位合計
										//按分しない場合
										{
											if (ikkatuAll != 0) //会社単位の請求合計がマイナスの場合
												{
													if (waribikiFlg == true) //電話回線毎の割引額を求める
														{
															ikkatu = Math.floor(sumCharge * discountRatio) * -1;
														}

													A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + TYOUSEI + "\t" + H_code[TYOUSEI] + "\t" + ikkatu + "\t" + H_taxMaster[H_taxtype[TYOUSEI]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + prtelno + "\n");
												}

											sumChargePact = sumChargePact + ikkatu;
											detailNo++;
											var tax = Math.floor((sumCharge + ikkatu - noTaxCharge) * G_EXCISE_RATE);
											sumChargePact = sumChargePact + tax;
										} else //消費税を求める
										{
											tax = Math.floor((sumCharge - noTaxCharge) * G_EXCISE_RATE);
										}

									A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_TAX + "\t" + H_code[G_CODE_TAX] + "\t" + tax + "\t" + H_taxMaster[H_taxtype[G_CODE_TAX]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + prtelno + "\n");
									detailNo++;

									if (aspFlg == true && oldTelno != H_dummyTel[kokyakuno][0]) //if($aspFlg == true){
										//合計用に１つ進める
										//ASP利用料を出力
										//ASP利用料消費税を出力
										{
											detailNo++;
											A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASP + "\t" + H_code[G_CODE_ASP] + "\t" + aspCharge + "\t" + H_taxMaster[H_taxtype[G_CODE_ASP]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + "\n");
											detailNo++;
											A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASX + "\t" + H_code[G_CODE_ASX] + "\t" + Math.floor(aspCharge * G_EXCISE_RATE) + "\t" + H_taxMaster[H_taxtype[G_CODE_ASX]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + "\n");
										}

									H_dupliTelno[oldTelno] = detailNo;
									detailNo = 0;
									sumCharge = 0;
									noTaxCharge = 0;
									telChkFlg = false;
									telAddFlg = true;
									telAddFlgX = true;
									sumTax = sumTax + tax;

									if (anbun == "y") {
										sumIkkatu = sumIkkatu + ikkatu;
									}
								}

							if (telChkFlg == false) //tel_X_tbに存在しているか、お客様番号が違うファイルで既に登録処理済みかチェック
								//電話番号があった場合
								{
									if (-1 !== A_telnoX.indexOf(H_margeData[kokyakuno][margeCounter][0]) == true || -1 !== A_telXAddList.indexOf(H_margeData[kokyakuno][margeCounter][0]) == true) //tel_X_tb に登録する必要なし
										{
											telAddFlgX = false;
										}

									if (telAddFlgX == true) //tel_X_tb に追加する電話を出力
										//tel_X_tb に追加処理した電話番号をリストへ追加
										//tel_tb にも追加するモード（-t=n）でダミー電話番号以外の時
										{
											if (H_margeData[kokyakuno][margeCounter][0] != H_dummyTel[kokyakuno][0]) {
												A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + rootPostidX + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + H_margeData[kokyakuno][margeCounter][1] + "\t" + G_CARRIER_DDI + "\t" + DDI_AREA_ID + "\t" + DDI_CIRCUIT_ID + "\t\\N\t" + now + "\t" + now + "\n");
											} else {
												A_telXOutputBuff.push(A_pactid[pactCounter] + "\t" + H_dummyTel[kokyakuno][1] + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + H_margeData[kokyakuno][margeCounter][1] + "\t" + G_CARRIER_DDI + "\t" + DDI_AREA_ID + "\t" + DDI_CIRCUIT_ID + "\t" + mb_convert_encoding("WILLCOM\u8ABF\u6574\u91D1", "CP51932", "UTF-8") + "\t" + now + "\t" + now + "\n");
											}

											telAddFlgX = false;
											A_telXAddList.push(H_margeData[kokyakuno][margeCounter][0]);

											if (teltable == "n" && H_margeData[kokyakuno][margeCounter][0] != H_dummyTel[kokyakuno][0]) //tel_tbに存在しているか、お客様番号が違うファイルで既に登録処理済みかチェック
												//電話番号があった場合
												{
													if (-1 !== A_telno.indexOf(H_margeData[kokyakuno][margeCounter][0]) == true || -1 !== A_telAddList.indexOf(H_margeData[kokyakuno][margeCounter][0]) == true) //tel_tb に登録する必要なし
														{
															telAddFlg = false;
														}

													if (telAddFlg == true) //tel_tb に追加する電話を出力
														//tel_tb に追加処理した電話番号をリストへ追加
														{
															A_telOutputBuff.push(A_pactid[pactCounter] + "\t" + rootPostid + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + H_margeData[kokyakuno][margeCounter][1] + "\t" + G_CARRIER_DDI + "\t" + DDI_AREA_ID + "\t" + DDI_CIRCUIT_ID + "\t" + now + "\t" + now + "\n");
															telAddFlg = false;
															A_telAddList.push(H_margeData[kokyakuno][margeCounter][0]);
														}
												}
										}

									telChkFlg = true;
								}

							if (undefined !== H_code[H_margeData[kokyakuno][margeCounter][2]] == false) {
								if (!(undefined !== A_utiwakeOutputBuff[H_margeData[kokyakuno][margeCounter][2]])) //$logh->putError(G_SCRIPT_ERROR, "登録されていない内訳コード[" . $H_margeData[$kokyakuno][$margeCounter][2] .	// 20110512
									//"]が見つかりました");
									{
										print("\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u5185\u8A33\u30B3\u30FC\u30C9[" + H_margeData[kokyakuno][margeCounter][2] + "]\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\n");
										print("\u5185\u8A33\u30B3\u30FC\u30C9\u3092\u66F4\u65B0\u3057\u3066\u304B\u3089\u3001\u518D\u5EA6\u51E6\u7406\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002\n");
										logh.putError(G_SCRIPT_WARNING, "\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u5185\u8A33\u30B3\u30FC\u30C9[" + H_margeData[kokyakuno][margeCounter][2] + "]\u304C\u898B\u3064\u304B\u308A\u307E\u3057\u305F");
										A_utiwakeOutputBuff[H_margeData[kokyakuno][margeCounter][2]] = mb_convert_encoding(H_margeData[kokyakuno][margeCounter][5], "UTF-8", "EUC-JP");
										unregistCode.push([H_margeData[kokyakuno][margeCounter][2], "unregist", A_pactid[pactCounter], G_CARRIER_DDI]);
									}

								continue;
							} else if ("4" == H_codetype[H_margeData[kokyakuno][margeCounter][2]]) //20110512
								{
									if (!(undefined !== A_checkoutcode[H_code[H_margeData[kokyakuno][margeCounter][2]]])) {
										A_checkoutcode[H_code[H_margeData[kokyakuno][margeCounter][2]]] = true;
										print("\u5185\u8A33\u30B3\u30FC\u30C9" + H_margeData[kokyakuno][margeCounter][2] + "\u306Ecodetype\u304C\u4EEE\u767B\u9332\u306E\u307E\u307E\u3067\u3059\n");
										logh.putError(G_SCRIPT_WARNING, "\u5185\u8A33\u30B3\u30FC\u30C9" + H_margeData[kokyakuno][margeCounter][2] + "]\u306Ecodetype\u304C\u4EEE\u767B\u9332\u306E\u307E\u307E\u3067\u3059");
										unregistCode.push([H_margeData[kokyakuno][margeCounter][2], "interim", A_pactid[pactCounter], G_CARRIER_DDI]);
										provisionalCount++;
									}

									continue;
								}

							for (var exceptCounter = 0; exceptCounter < exceptCnt; exceptCounter++) //除外コードがあれば次の明細へスキップする
							{
								if (A_exceptCode[exceptCounter] == H_margeData[kokyakuno][margeCounter][2]) //会社毎の請求金額を取得しておく(次回振替金額かご請求金額できている)
									{
										if (H_margeData[kokyakuno][margeCounter][2] == CODE996000 || H_margeData[kokyakuno][margeCounter][2] == CODE997000 || H_margeData[kokyakuno][margeCounter][2] == CODE998000 || H_margeData[kokyakuno][margeCounter][2] == CODE999000) {
											var sumBillData = H_margeData[kokyakuno][margeCounter][3];
										}

										oldTelno = H_margeData[kokyakuno][margeCounter][0];
										continue;
									}
							}

							if (H_margeData[kokyakuno][margeCounter][0] == H_dummyTel[kokyakuno][0]) //ダミー電話番号は以下のコードも除外する
								//按分しない場合　ダミー電話に計上
								//ダミー電話番号以外の処理
								{
									for (exceptCounter = 0;; exceptCounter < exceptOnlyDummyCnt; exceptCounter++) //除外コードがあれば次の明細へスキップする
									{
										if (A_exceptCodeOnlyDummy[exceptCounter] == H_margeData[kokyakuno][margeCounter][2]) //処理した電話番号を退避
											{
												oldTelno = H_margeData[kokyakuno][margeCounter][0];
												continue;
											}
									}

									if (anbun == "n") //内訳が消費税の時
										//按分する場合でも端末販売代金(910000) はダミー電話に計上するよう対応 2005/0823 s.Maeda
										{
											if (H_margeData[kokyakuno][margeCounter][2] == CODE771000) //ファイル出力
												{
													A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + H_margeData[kokyakuno][margeCounter][2] + "\t" + H_code[H_margeData[kokyakuno][margeCounter][2]] + "\t" + (H_margeData[kokyakuno][margeCounter][3] - sumTax) + "\t" + H_taxMaster[H_taxtype[H_margeData[kokyakuno][margeCounter][2]]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + H_margeData[kokyakuno][margeCounter][4] + "\t" + prtelno + "\n");
												} else //ファイル出力
												{
													A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + H_margeData[kokyakuno][margeCounter][2] + "\t" + H_code[H_margeData[kokyakuno][margeCounter][2]] + "\t" + H_margeData[kokyakuno][margeCounter][3] + "\t" + H_taxMaster[H_taxtype[H_margeData[kokyakuno][margeCounter][2]]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + H_margeData[kokyakuno][margeCounter][4] + "\t" + prtelno + "\n");
												}
										} else //ファイル出力
										{
											A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + H_margeData[kokyakuno][margeCounter][2] + "\t" + H_code[H_margeData[kokyakuno][margeCounter][2]] + "\t" + H_margeData[kokyakuno][margeCounter][3] + "\t" + H_taxMaster[H_taxtype[H_margeData[kokyakuno][margeCounter][2]]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + H_margeData[kokyakuno][margeCounter][4] + "\t" + prtelno + "\n");
										}
								} else //$detailNo が初期値で
								//お客様番号が違うファイルで同じ電話番号が存在し
								//既に取り込み処理をしている場合は $detailNo を続き番号に付け替える
								{
									if (detailNo == 0 && undefined !== H_dupliTelno[H_margeData[kokyakuno][margeCounter][0]] == true && H_dupliTelno[H_margeData[kokyakuno][margeCounter][0]] != 0) //ASP利用料表示する場合は退避していた場合
										{
											if (aspFlg == true) //$detailNo を２つ戻してセットする
												//既にバッファに格納されている対象電話番号のASP利用料を探して要素番号を取得する
												//対象の電話番号のASPとASXを除いた配列を作り直す
												//ASP利用料表示しない場合は退避していた $detailNo をそのままセットする
												{
													detailNo = H_dupliTelno[H_margeData[kokyakuno][margeCounter][0]] - 2;
													var keyNo = array_search(A_pactid[pactCounter] + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + G_CODE_ASP + "\t" + H_code[G_CODE_ASP] + "\t" + aspCharge + "\t" + H_taxMaster[H_taxtype[G_CODE_ASP]] + "\t" + (detailNo + 1) + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + "\n", A_teldetailsOutputBuff);
													var A_teldetailsOutputBuff_bef = A_teldetailsOutputBuff.slice(0, keyNo);
													var A_teldetailsOutputBuff_aft = A_teldetailsOutputBuff.slice(keyNo + 2);
													A_teldetailsOutputBuff = array_merge(A_teldetailsOutputBuff_bef, A_teldetailsOutputBuff_aft);
												} else {
												detailNo = H_dupliTelno[H_margeData[kokyakuno][margeCounter][0]];
											}
										}

									A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_margeData[kokyakuno][margeCounter][0] + "\t" + H_margeData[kokyakuno][margeCounter][2] + "\t" + H_code[H_margeData[kokyakuno][margeCounter][2]] + "\t" + H_margeData[kokyakuno][margeCounter][3] + "\t" + H_taxMaster[H_taxtype[H_margeData[kokyakuno][margeCounter][2]]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + H_margeData[kokyakuno][margeCounter][4] + "\t" + prtelno + "\n");
								}

							oldTelno = H_margeData[kokyakuno][margeCounter][0];
							sumCharge = sumCharge + H_margeData[kokyakuno][margeCounter][3];
							sumChargePact = sumChargePact + H_margeData[kokyakuno][margeCounter][3];

							if (-1 !== Object.keys(H_noTaxCode).indexOf(H_margeData[kokyakuno][margeCounter][2]) == true) {
								noTaxCharge = noTaxCharge + H_margeData[kokyakuno][margeCounter][3];
							}

							detailNo++;
						}

						if (0 < provisionalCount) //仮登録だけヒットするように
							//２重起動ロック解除
							{
								O_out.put(SCRIPTNAME + "::\u4EEE\u767B\u9332\u306E\u5185\u8A33\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u3059\n", MtOutput.LVL_WARN, {
									disp: 1
								});
								O_out.flushMessage();
								lock(false, dbh);
								throw die(1);
							}

						if (oldTelno != H_dummyTel[kokyakuno][0]) //最終行の処理 2008/05/01 maeda 追加
							//按分する場合　電話回線毎に計上
							//消費税を出力
							//ASP利用料表示する
							//ダミー電話番号は除外 2007/07/12 s.maeda
							//初期化
							//初期化
							//初期化
							//電話番号存在チェックフラグを初期化
							//初期化 デフォルトは追加する
							//初期化 デフォルトは追加する
							//按分する場合　電話回線毎に計上
							{
								if (anbun == "y") //会社単位の請求がある場合
									//会社単位合計
									//消費税を求める
									//会社単位合計
									//按分しない場合
									{
										if (ikkatuAll != 0) //会社単位の請求合計がマイナスの場合
											{
												if (waribikiFlg == true) //電話回線毎の割引額を求める
													{
														ikkatu = Math.floor(sumCharge * discountRatio) * -1;
													}

												A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + TYOUSEI + "\t" + H_code[TYOUSEI] + "\t" + ikkatu + "\t" + H_taxMaster[H_taxtype[TYOUSEI]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + prtelno + "\n");
											}

										sumChargePact = sumChargePact + ikkatu;
										detailNo++;
										tax = Math.floor((sumCharge + ikkatu - noTaxCharge) * G_EXCISE_RATE);
										sumChargePact = sumChargePact + tax;
									} else //消費税を求める
									{
										tax = Math.floor((sumCharge - noTaxCharge) * G_EXCISE_RATE);
									}

								A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_TAX + "\t" + H_code[G_CODE_TAX] + "\t" + tax + "\t" + H_taxMaster[H_taxtype[G_CODE_TAX]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + prtelno + "\n");
								detailNo++;

								if (aspFlg == true && oldTelno != H_dummyTel[kokyakuno][0]) //if($aspFlg == true){
									//合計用に１つ進める
									//ASP利用料を出力
									//ASP利用料消費税を出力
									{
										detailNo++;
										A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASP + "\t" + H_code[G_CODE_ASP] + "\t" + aspCharge + "\t" + H_taxMaster[H_taxtype[G_CODE_ASP]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + "\n");
										detailNo++;
										A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + oldTelno + "\t" + G_CODE_ASX + "\t" + H_code[G_CODE_ASX] + "\t" + Math.floor(aspCharge * G_EXCISE_RATE) + "\t" + H_taxMaster[H_taxtype[G_CODE_ASX]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + "\n");
									}

								H_dupliTelno[oldTelno] = detailNo;
								detailNo = 0;
								sumCharge = 0;
								noTaxCharge = 0;
								telChkFlg = false;
								telAddFlg = true;
								telAddFlgX = true;
								sumTax = sumTax + tax;

								if (anbun == "y") {
									sumIkkatu = sumIkkatu + ikkatu;
								}
							}

						if (anbun == "y") //会社単位の請求がある場合
							//会社単位合計
							{
								if (ikkatuAll != 0) //ダミー電話番号の調整額をファイル出力
									{
										A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_dummyTel[kokyakuno][0] + "\t" + TYOUSEI + "\t" + H_code[TYOUSEI] + "\t" + (ikkatuAll - sumIkkatu) + "\t" + H_taxMaster[H_taxtype[TYOUSEI]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + prtelno + "\n");
										detailNo++;
									}

								A_teldetailsOutputBuff.push(A_pactid[pactCounter] + "\t" + H_dummyTel[kokyakuno][0] + "\t" + CODE771000 + "\t" + H_code[CODE771000] + "\t" + (billTax - sumTax) + "\t" + H_taxMaster[H_taxtype[CODE771000]] + "\t" + detailNo + "\t" + now + "\t" + G_CARRIER_DDI + "\t" + "\t" + prtelno + "\n");
								sumChargePact = sumChargePact + (ikkatuAll - sumIkkatu) + (billTax - sumTax);
							}

						if (sumBillData != sumChargePact) //20110512 内訳コードがない＝合計金額ずれて当然＝utiwake_tbへの登録は合計金額の際によらず登録してやらないと合計金額ずれっぱなし
							//エラーとなった契約ＩＤはとばすが処理は続ける
							{
								makeUtiwakeCopyFile(A_utiwakeOutputBuff);

								if (0 != filesize(utiwakeFile)) {
									if (doCopyInsert("utiwake_tb", utiwakeFile, getUtiwakeColumn(), dbh) != 0) {
										print("ERROR: utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
										logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + "utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
									} else {
										print("INFO: utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
										logh.putError(G_SCRIPT_INFO, SCRIPTNAME + "utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
									}
								}

								print("WARNING: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u5408\u8A08\u91D1\u984D\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\n");
								logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u306E\u5408\u8A08\u91D1\u984D\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093");
								continue;
							} else {
							var amountdata = O_tab.makeAmountData({
								pactid: A_pactid[pactCounter],
								carid: G_CARRIER_DDI,
								prtelno: kokyakuno,
								charge: A_prtelnos[kokyakuno],
								recdate: getTimeStamp()
							});
							O_tab.writeFile(amountdata);
						}
					}

					var outTelCnt = outTelXCnt = outTeldetailsCnt = 0;
					mb_convert_variables("UTF-8", "CP51932", A_telOutputBuff);
					mb_convert_variables("UTF-8", "CP51932", A_telXOutputBuff);
					mb_convert_variables("UTF-8", "CP51932", A_teldetailsOutputBuff);

					for (var value of Object.values(A_telOutputBuff)) {
						fwrite(fp_tel, value);
						outTelCnt++;
					}

					fflush(fp_tel);

					for (var value of Object.values(A_telXOutputBuff)) {
						fwrite(fp_telX, value);
						outTelXCnt++;
					}

					fflush(fp_telX);

					for (var value of Object.values(A_teldetailsOutputBuff)) {
						fwrite(fp_teldetails, value);
						outTeldetailsCnt++;
					}

					fflush(fp_teldetails);

					if (0 < A_utiwakeOutputBuff.length) //20110512
						{
							makeUtiwakeCopyFile(A_utiwakeOutputBuff);

							if (0 != filesize(utiwakeFile)) {
								if (doCopyInsert("utiwake_tb", utiwakeFile, getUtiwakeColumn(), dbh) != 0) {
									print("ERROR: utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
									logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + "utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
								} else {
									print("INFO: utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
									logh.putError(G_SCRIPT_INFO, SCRIPTNAME + "utiwake_tb \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
								}
							}
						} else //正常処理が終わった pactid のみリストに追加
						{
							A_pactDone.push(A_pactid[pactCounter]);
							print("INFO: " + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + tel_tb + ":" + outTelCnt + "\u4EF6," + telX_tb + ":" + outTelXCnt + "\u4EF6," + teldetails_tb + ":" + outTeldetailsCnt + "\u4EF6)\n");
							logh.putError(G_SCRIPT_INFO, SCRIPTNAME + LOG_DELIM + H_pactid[A_pactid[pactCounter]] + "(pactid=" + A_pactid[pactCounter] + ") \u30A4\u30F3\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u51FA\u529B\u5B8C\u4E86(" + tel_tb + ":" + outTelCnt + "\u4EF6," + telX_tb + ":" + outTelXCnt + "\u4EF6," + teldetails_tb + ":" + outTeldetailsCnt + "\u4EF6)");
						}
				}

			closedir(dirh);
		} else {
		print("WARNING: \u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + " \u5951\u7D04\uFF29\uFF24\uFF1A" + A_pactid[pactCounter] + " \u306F pact_tb \u306B\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
	}
}

fclose(fp_teldetails);
fclose(fp_tel);
fclose(fp_telX);
O_tab.closeFile();
var pactDoneCnt = A_pactDone.length;

if (pactDoneCnt == 0) //処理する件数が０件をログ出力
	//処理終了をログ出力
	{
		print("WARNING: \u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u8ACB\u6C42\u60C5\u5831\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F\n");
		logh.putError(G_SCRIPT_WARNING, "\u30A4\u30F3\u30DD\u30FC\u30C8\u53EF\u80FD\u306A\u8ACB\u6C42\u60C5\u5831\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F");
		print("END: \uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86\n");
		logh.putError(G_SCRIPT_END, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86");
		lock(false);
		throw die(0);
	}

if (backup == "y") //tel_details_X_tb をエクスポートする
	//トランザクション開始
	//トランザクション内でないとカーソルが使えない
	//エクスポート失敗した場合
	//コミット
	{
		sql_str = "select * from " + teldetails_tb;
		var expFile = DATA_EXP_DIR + "/" + teldetails_tb + date("YmdHis") + ".exp";
		dbh.begin();

		if (doCopyExp(sql_str, expFile, dbh) != 0) {
			print("ERROR: " + teldetails_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n");
			logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
		} else {
			print("INFO: " + teldetails_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30FC\u30BF\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}

		dbh.commit();
	}

dbh.begin();

if (mode == "o") //delte失敗した場合
	{
		sql_str = "delete from " + teldetails_tb + " where pactid in (" + A_pactDone.join(",") + ") and " + "carid = " + G_CARRIER_DDI;
		var rtn = dbh.query(mb_convert_encoding(sql_str, "UTF-8", "CP51932"), false);

		if (DB.isError(rtn) == true) //ロールバック
			{
				dbh.rollback();
				print("ERROR: " + teldetails_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u306B\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			print("INFO: " + teldetails_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " \u306E\u30C7\u30EA\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (teltable == "n" && filesize(telFile) != 0) //tel_tb へのインポートが失敗した場合
	{
		var A_tel_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "recdate", "fixdate"];

		if (doCopyInsert(tel_tb, telFile, A_tel_col, dbh) != 0) //if(doCopyIn($tel_tb, $telFile, $dbh) != 0){
			//ロールバック
			{
				dbh.rollback();
				print("ERROR: " + tel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + tel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			print("INFO: " + tel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + tel_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (filesize(telXFile) != 0) //tel_X_tb へのインポートが失敗した場合
	{
		var A_telX_col = ["pactid", "postid", "telno", "telno_view", "carid", "arid", "cirid", "username", "recdate", "fixdate"];

		if (doCopyInsert(telX_tb, telXFile, A_telX_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				print("ERROR: " + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			print("INFO: " + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + telX_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (filesize(teldetailsFile) != 0) //tel_details_X_tb へのインポートが失敗した場合
	{
		var A_teldetails_col = ["pactid", "telno", "code", "codename", "charge", "taxkubun", "detailno", "recdate", "carid", "tdcomment", "prtelno"];

		if (doCopyInsert(teldetails_tb, teldetailsFile, A_teldetails_col, dbh) != 0) //ロールバック
			{
				dbh.rollback();
				print("ERROR: " + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo + "\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F " + rtn.userinfo);
			} else {
			print("INFO: " + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
			logh.putError(G_SCRIPT_INFO, SCRIPTNAME + teldetails_tb + " \u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
		}
	}

if (0 != filesize(O_tab.getfilePath())) {
	var A_amount_col = O_tab.getAmountColumn();

	if (0 != doCopyInsert(O_tab.getTableName(), O_tab.getFilePath(), A_amount_col, dbh)) {
		dbh.rollback();
		print("ERROR: " + O_tab.getTableName() + "\u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F" + rtn.userinfo + "\n");
		logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + O_tab.getTableName() + "\u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u304C\u5931\u6557\u3057\u307E\u3057\u305F" + rtn.userinfo);
	} else {
		print("INFO: " + O_tab.getTableName() + "\u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86\n");
		logh.putError(G_SCRIPT_INFO, SCRIPTNAME + O_tab.getTableName() + "\u3078\u306E\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u5B8C\u4E86");
	}
}

var A_notAmountCode = [""];
dbh.commit();

for (var pactDoneCounter = 0; pactDoneCounter < pactDoneCnt; pactDoneCounter++) //移動先ディレクトリ
//移動先ディレクトリがなければ作成
//ファイルの移動
{
	var finDir = dataDir + "/" + A_pactDone[pactDoneCounter] + FIN_DIR;

	if (is_dir(finDir) == false) //移動先ディレクトリ作成失敗
		{
			if (mkdir(finDir, 700) == false) {
				print("ERROR: \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n");
				logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
			} else {
				print("INFO: \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u4F5C\u6210\u5B8C\u4E86\n");
				logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " \u79FB\u52D5\u5148\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA(" + finDir + ")\u4F5C\u6210\u5B8C\u4E86");
			}
		}

	clearstatcache();
	dirh = opendir(dataDir + "/" + A_pactDone[pactDoneCounter]);

	while (mvFileName = readdir(dirh)) //ファイルなら移動する
	{
		if (is_file(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName) == true) //移動が失敗した場合
			{
				if (rename(dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName, finDir + "/" + mvFileName) == false) {
					print("ERROR: \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")\n");
					logh.putError(G_SCRIPT_ERROR, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				} else {
					print("INFO: \u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")\n");
					logh.putError(G_SCRIPT_INFO, SCRIPTNAME + " \u30D5\u30A1\u30A4\u30EB\u79FB\u52D5\u5B8C\u4E86(" + dataDir + "/" + A_pactDone[pactDoneCounter] + "/" + mvFileName + ")");
				}
			}

		clearstatcache();
	}

	closedir(dirh);
}

lock(false);
print("END: \uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86\n");
logh.putError(G_SCRIPT_END, "\uFF37\uFF29\uFF2C\uFF2C\uFF23\uFF2F\uFF2D\u8ACB\u6C42\u60C5\u5831\u30D5\u30A1\u30A4\u30EB\u30A4\u30F3\u30DD\u30FC\u30C8\u51E6\u7406\u7D42\u4E86");
throw die(0);

function usage(comment) {
	if (!("dbh" in global)) dbh = undefined;

	if (comment == "") {
		comment = "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u4E0D\u6B63\u3067\u3059";
	}

	print("\n" + comment + "\n\n");
	print("Usage) " + SCRIPTNAME + " -e={O|A} -y=YYYYMM -p={all|PACTID} -b={Y|N} -t={N|O} -a={Y|N}\n");
	print("\t\t-e \u30E2\u30FC\u30C9 \t(O:delete\u5F8CCOPY,A:\u8FFD\u52A0)\n");
	print("\t\t-y \u8ACB\u6C42\u5E74\u6708 \t(YYYY:\u5E74,MM:\u6708)\n");
	print("\t\t-p \u5951\u7D04\uFF29\uFF24 \t(all:\u5168\u9867\u5BA2\u5206\u3092\u5B9F\u884C,PACTID:\u6307\u5B9A\u3057\u305F\u5951\u7D04\uFF29\uFF24\u306E\u307F\u5B9F\u884C)\n");
	print("\t\t-b \u30D0\u30C3\u30AF\u30D1\u30C3\u30D7 (Y:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3059\u308B,N:\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3057\u306A\u3044)\n");
	print("\t\t-t \u96FB\u8A71\u30C6\u30FC\u30D6\u30EB (N:tel_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8,O:tel_X_tb \u3078\u30A4\u30F3\u30B5\u30FC\u30C8)\n");
	print("\t\t-a \u4F1A\u793E\u4E00\u62EC\u8ACB\u6C42\u30C7\u30FC\u30BF\u6309\u5206 (Y:\u6309\u5206\u3059\u308B\uFF0D\u96FB\u8A71\u56DE\u7DDA\u6BCE\u306B\u8A08\u4E0A,N:\u6309\u5206\u3057\u306A\u3044\uFF0D\u30C0\u30DF\u30FC\u96FB\u8A71\u306B\u8A08\u4E0A)\n\n");
	dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + comment);
	throw die(1);
};

function lock(is_lock) //ロックする
{
	if (!("dbh" in global)) dbh = undefined;
	var pre = "batch";
	var now = getTimestamp();

	if (is_lock == true) //既に起動中
		//ロック解除
		{
			dbh.begin();
			dbh.lock("clamptask_tb");
			var sql = "select count(*) from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "' and " + "status = 1;";
			var count = dbh.getOne(sql);

			if (count != 0) {
				dbh.rollback();
				print("\n\u65E2\u306B\u8D77\u52D5\u3057\u3066\u3044\u307E\u3059\n\n");
				dbh.putError(G_SCRIPT_ERROR, SCRIPTNAME + LOG_DELIM + "\u591A\u91CD\u52D5\u4F5C");
				return false;
			}

			sql = "insert into clamptask_tb(command,status,recdate) " + "values('" + dbh.escape(pre + "_" + SCRIPTNAME) + "',1,'" + now + "');";
			dbh.query(mb_convert_encoding(sql, "UTF-8", "CP51932"));
			dbh.commit();
		} else {
		dbh.begin();
		dbh.lock("clamptask_tb");
		sql = "delete from clamptask_tb " + "where command = '" + dbh.escape(pre + "_" + SCRIPTNAME) + "';";
		dbh.query(mb_convert_encoding(sql, "UTF-8", "CP51932"));
		dbh.commit();
	}

	return true;
};

function getDummy(pactid, reqno) //dummy_tbから所属部署ＩＤが取得できた場合
{
	if (!("dbh" in global)) dbh = undefined;
	if (!("dummytel_tb" in global)) dummytel_tb = undefined;
	if (!("postX_tb" in global)) postX_tb = undefined;
	var sql = "select telno,postid from " + dummytel_tb + " where pactid = " + pactid + " and " + "carid = " + G_CARRIER_DDI + " and reqno = '" + reqno + "'";
	var H_data = dbh.getHash(sql);

	if (H_data.length != 0 && H_data[0].postid != "") //本当にpost_X_tbに存在しているかチェックする
		//post_X_tbに部署が存在しなかった場合はdummy_tbで所得した部署ＩＤはなかったことにする
		{
			var sql_str = `select postid from ${postX_tb} where pactid = ` + pactid + " and postid = " + H_data[0].postid;
			var rtn = dbh.getOne(sql_str);

			if (rtn == "") {
				H_data[0].postid = "";
			}
		}

	return H_data;
};

function getRootPostid(pactid, table) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select postidparent from " + table + " where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
	var rootPostid = dbh.getOne(sql_str, true);
	return rootPostid;
};

function chkAsp(pactid) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select count(*) from fnc_relation_tb where pactid = " + pactid + " and " + "fncid = " + G_AUTH_ASP;
	var count = dbh.getOne(sql_str);

	if (count == 0) {
		return false;
	} else {
		return true;
	}
};

function getAsp(pactid) {
	if (!("dbh" in global)) dbh = undefined;
	var sql_str = "select charge from asp_charge_tb where pactid = " + pactid + " and " + "carid = " + G_CARRIER_DDI;
	var charge = dbh.getOne(sql_str);
	return charge;
};

function doCopyExp(sql, filename, db) //ログファイルハンドラ
//エクスポートファイルを開く
//エクスポートファイルオープン失敗
//無限ループ
//カーソルを開放
{
	if (!("logh" in global)) logh = undefined;
	var fp = fopen(filename, "wt");

	if (fp == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		return 1;
	}

	db.query(mb_convert_encoding("declare exp_cur cursor for " + sql, "UTF-8", "CP51932"));

	for (; ; ) //ＤＢから結果取得
	{
		var result = pg_query(db.m_db.connection, "fetch " + NUM_FETCH + " in exp_cur");

		if (result == false) //ファイルクローズ
			//カーソルを開放
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + "Fetch error, " + sql);
				fclose(fp);
				db.query("close exp_cur");
				return 1;
			}

		var A_line = pg_fetch_array(result);

		if (A_line == false) //ループ終了
			{
				break;
			}

		var str = "";

		do //データ区切り記号、初回のみ空
		{
			var delim = "";

			for (var item of Object.values(A_line)) //データ区切り記号
			//値がない場合はヌル（\N）をいれる
			{
				str += delim;
				delim = "\t";

				if (item == undefined) //nullを表す記号
					{
						str += "\\N";
					} else {
					str += item;
				}
			}

			str += "\n";
		} while (A_line = pg_fetch_array(result));

		if (fputs(fp, str) == false) //カーソルを開放
			{
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u3078\u306E\u66F8\u304D\u8FBC\u307F\u5931\u6557\u3001" + str);
				fclose(fp);
				db.query("CLOSE exp_cur");
				return 1;
			}
	}

	db.query("CLOSE exp_cur");
	fclose(fp);
	return 0;
};

function doCopyInsert(table, filename, columns, db) //ファイルを開く
//$ins->setDebug( true );
//インサート処理開始
//インサート処理おしまい、実質的な処理はここで行われる.
{
	if (!("logh" in global)) logh = undefined;
	if (!("pactid" in global)) pactid = undefined;
	if (!("billdate" in global)) billdate = undefined;
	var fp = fopen(filename, "rt");

	if (!fp) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557.");
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
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30C7\u30FC\u30BF\u6570\u304C\u8A2D\u5B9A\u3068\u7570\u306A\u308A\u307E\u3059\u3002\u30C7\u30FC\u30BF=" + line);
				fclose(fp);
				return 1;
			}

		var H_ins = Array();
		var idx = 0;

		for (var col of Object.values(columns)) //\N の場合はハッシュに追加しない
		{
			if (A_line[idx] != "\\N") {
				H_ins[col] = A_line[idx];
			}

			idx++;
		}

		if (ins.insert(H_ins) == false) {
			logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F\u3001\u30C7\u30FC\u30BF=" + line);
			fclose(fp);
			return 1;
		}
	}

	if (ins.end() == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + pactid + LOG_DELIM + LOG_DELIM + billdate + LOG_DELIM + filename + "\u306E\u30A4\u30F3\u30B5\u30FC\u30C8\u51E6\u7406\u306B\u5931\u6557.");
		fclose(fp);
		return 1;
	}

	fclose(fp);
	return 0;
};

function doCopyIn(table, filename, db) //ログファイルハンドラ
//インポートファイルを開く
//最後のあまり行を処理する
{
	if (!("logh" in global)) logh = undefined;
	var fp = fopen(filename, "rt");

	if (fp == false) {
		logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30D5\u30A1\u30A4\u30EB\u30AA\u30FC\u30D7\u30F3\u5931\u6557");
		return 1;
	}

	var line_cnt = 0;
	var H_lines = Array();

	while (line = fgets(fp)) //COPY文の文字列そのものを取得して配列に溜める
	//array_push( $H_lines, $line );
	//...こっちの方が速いらしい。
	//一定行数読み込んだら処理を行う
	{
		H_lines.push(line);
		line_cnt++;

		if (line_cnt >= COPY_LINES) //コピー処理を行う
			//空にする
			{
				var res_cpfile = pg_copy_from(db.m_db.connection, table, H_lines);

				if (res_cpfile == false) {
					logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30B3\u30D4\u30FC\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F.");
					fclose(fp);
					return 1;
				}

				H_lines = Array();
				line_cnt = 0;
			}
	}

	if (line_cnt > 0) //コピー処理を行う
		{
			res_cpfile = pg_copy_from(db.m_db.connection, table, H_lines);

			if (res_cpfile == false) {
				logh.putError(G_SCRIPT_WARNING, SCRIPTNAME + LOG_DELIM + filename + "\u306E\u30B3\u30D4\u30FC\u4E2D\u306B\u30A8\u30E9\u30FC\u767A\u751F.");
				fclose(fp);
				return 1;
			}
		}

	fclose(fp);
	return 0;
};

function makeUtiwakeCopyFile(utiwakeData) {
	if (!("utiwakeFile" in global)) utiwakeFile = undefined;
	var fp_utiwake = fopen(utiwakeFile, "w");

	if (Array.isArray(utiwakeData) && 0 < utiwakeData.length) {
		var nowtime = getTimeStamp();

		for (var code in utiwakeData) {
			var name = utiwakeData[code];
			fwrite(fp_utiwake, code + "\t" + name + "\t" + "6\t" + "4\t" + G_CARRIER_DDI + "\t" + nowtime + "\t" + nowtime + "\n");
		}
	}

	fclose(fp_utiwake);
};

function getUtiwakeColumn() {
	return ["code", "name", "kamoku", "codetype", "carid", "fixdate", "recdate"];
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