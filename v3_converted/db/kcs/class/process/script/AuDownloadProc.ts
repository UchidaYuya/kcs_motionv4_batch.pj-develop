//
//au brossデータ ダウンロード （Process）
//
//更新履歴：<br>
//2009/06/01 前田 聡 作成
//
//AuDownloadProc
//
//@package script
//@subpackage Process
//@author maeda<maeda@motion.co.jp>
//@filesource
//@since 2009/06/01
//@uses MtTableUtil
//@uses ProcessBaseBatch
//@uses AuDownloadView
//@uses AuDownloadModel
//
//
//error_reporting(E_ALL|E_STRICT);
//関数を流用するためにSB側のモデルを生成 20091130miya

require("MtTableUtil.php");

require("process/ProcessBaseBatch.php");

require("view/script/AuDownloadView.php");

require("model/script/AuDownloadModel.php");

require("model/script/SBDownloadModel.php");

require("model/ClampModel.php");

//
//コンストラクタ
//
//@author maeda
//@since 2009/06/01
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author maeda
//@since 2009/06/01
//
//@param array $H_param
//@access protected
//@return void
//
//
//スクリプト終了処理
//
//@author maeda
//@since 2009/06/04
//
//@access public
//@return void
//
//
//タイムスタンプを日付と時間部分に分割
//
//@author maeda
//@since 2009/06/03
//
//@access public
//@return 日付と時間の配列
//
//
//タイムスタンプの日付部分を年、月、日に分割
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $A_date：日付（YYYY-MM-DD）
//@access public
//@return 年、月、日の配列
//
//
//タイムスタンプの時間部分を時、分、秒に分割
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $A_time：時間（hh:mm:ss）
//@access public
//@return 時、分、秒の配列
//
//
//現在時間から時間を取得
//
//@author maeda
//@since 2009/06/03
//
//@access public
//@return 時間
//
//
//現在日付から年月を取得
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $arrayFlg：戻り値を文字列、配列のどちらで受け取るか（false:文字列、true:配列）
//@access public
//@return 年月
//
//
//ダウンロード対象の請求年月を取得する
//
//@author maeda
//@since 2009/06/03
//
//@param mixed $months：当月から過去何ヶ月分の請求年月を取得するか
//@access public
//@return ダウンロード対象の請求年月リスト
//
//
//bross オプション設定
//
//@author maeda
//@since 2009/06/04
//
//@param mixed &$handle：ハンドル
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@param mixed $params：POSTパラメータ
//@param mixed $cookieFlg：クッキー使用必要かどうか（false：不要、true：必要）
//@access public
//@return void
//
//
//bross のログインページへ行く
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@access public
//@return http取得画面ソース
//
//
//bross ログイン処理
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $loginid：ログインＩＤ
//@param mixed $passwd：ログインパスワード
//@param mixed $recCode：請求コード
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@access public
//@return http取得画面ソース
//
//
//bross セッションＩＤを取得
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $source：http取得画面ソース
//@access public
//@return セッションＩＤ
//
//
//bross パスワード更新回数取得
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $source：http取得画面ソース
//@access public
//@return パスワード更新回数
//
//
//bross ダウンロードメニューページへ
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@param mixed $sessid：セッションＩＤ
//@access public
//@return http取得画面ソース
//
//
//bross 請求年月変更処理
//
//@author maeda
//@since 2009/06/05
//
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@param mixed $sessid：セッションＩＤ
//@param mixed $billDate：請求年月
//@access public
//@return http取得画面ソース
//
//
//bross データダウンロード処理
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@param mixed $sessid：セッションＩＤ
//@param mixed $billDate：請求年月
//@param mixed $eleNo：POSTデータ名要素番号
//@param mixed $filePath：ファイルダウンロード先ディレクトリ
//@param mixed &$A_zipRtn：解凍ファイルリスト
//@access public
//@return http取得画面ソース
//
//
//bross パスワード変更画面へ
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@param mixed $sessid：セッションＩＤ
//@access public
//@return http取得画面ソース
//
//
//bross パスワード変更確認画面へ
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@param mixed $sessid：セッションＩＤ
//@param mixed $oldPasswd：旧パスワード
//@param mixed $newPasswd：新パスワード
//@access public
//@return http取得画面ソース
//
//
//bross パスワード変更
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $sslKey：証明書ファイル名
//@param mixed $sslPass：証明書パスワード
//@param mixed $sessid：セッションＩＤ
//@param mixed $oldPasswd：旧パスワード
//@param mixed $newPasswd：新パスワード
//@param mixed $updateCnt：パスワード更新回数
//@access public
//@return http取得画面ソース
//
//
//データインポート処理
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $H_inputData：インポートデータ
//@param mixed $table：インポート先テーブル
//@access public
//@return void
//
//
//月末の日にちを取得
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $year：年
//@param mixed $month：月
//@access public
//@return 月末の日にち
//
//
//パスワード有効期限判定
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $date：パスワード最終更新日
//@param mixed $month：パスワード更新間隔
//@access public
//@return パスワード変更が必要かどうか（true：必要、false：不要）
//
//
//ファイルダウンロードリトライ判定
//
//@author maeda
//@since 2009/06/04
//
//@param mixed $A_date：ダウンロード済みファイルのダウンロード日付
//@access public
//@return リトライするかどうか（false：リトライしない、true：リトライする）
//
//
//日付の差分を取得
//
//@author maeda
//@since 2009/06/10
//
//@param mixed $year1：日付１の年
//@param mixed $month1：日付１の月
//@param mixed $day1：日付１の日
//@param mixed $year2：日付２の年
//@param mixed $month2：日付２の月
//@param mixed $day2：日付２の日
//@access public
//@return 差分日数
//
//
//デストラクタ
//
//@author maeda
//@since 2009/06/01
//
//@access public
//@return void
//
class AuDownloadProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	//関数を流用するためにSB側のモデルを生成 20091130miya
	{
		super(H_param);
		this.getSetting().loadConfig("au_download");
		this.O_View = new AuDownloadView();
		this.O_Model = new AuDownloadModel(this.get_MtScriptAmbient());
		this.O_SB_Model = new SBDownloadModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//$this->infoOut($this->getSetting()->AU_DOWNLOAD . "開始\n",1);	// メール削減のためコメントアウト 20091120miya
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//請求年月指定無し
	//請求年月ディレクトリを設定
	//ダウンロードリストファイルオープン 20090721miya
	//$dlfp = fopen($this->getSetting()->KCS_DIR . "/script/dl_au_list", "w");
	//リストファイルのディレクトリ変更 20140710 s.maeda
	//リスト作成用配列 20091016miya
	//pact指定が無い場合
	//エラーメール出力用配列
	//ダウンロードエラーメール送信用テーブル
	//ClmapModelインスタンス作成
	//特定の会社のダウンロードＩＤ取得 （pactid、ID、PASSWORD、パスワード更新年月、更新間隔、失敗フラグ、Hotlineかどうか）
	//タイムスタンプ取得
	//ＩＤリストが０件の場合
	//特定の会社でログインページへアクセス（メンテナンス中かテストする）
	//ログイン判定：失敗
	//配列クリア
	//ダウンロードＩＤリスト取得 （pactid、ID、PASSWORD、パスワード更新年月、更新間隔、失敗フラグ、Hotlineかどうか）
	//ＩＤリストが０件の場合
	//当月データがダウンロード可能かどうか
	//請求年月がnoneかつ契約ＩＤがallを指定された場合は
	//特定の会社で当月のデータが既にダウンロードされているかチェックする
	//会社タイプ一覧を取得
	//KCS Motion、Hotlineの順に処理するよう降順ソート
	//出力用配列
	//ダウンロード進捗管理テーブル
	//KCS Motion、Hotline毎で処理する
	//END KCS Motion、Hotline毎で処理する
	//エラーメール用データ登録
	//ダウンロードステータス登録
	//ダウンロードリストファイルクローズ 20090721miya
	//スクリプト終了処理
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.PactId = this.O_View.get_HArgv("-p");
		this.EndFlg = this.O_View.get_HArgv("-s");
		var nowYyyyMm = this.getYyyyMm(false);

		if ("none" == this.O_View.get_HArgv("-y")) //請求年月指定有り
			{
				this.BillDate = nowYyyyMm;
				var BillDateNoneFlg = true;
			} else {
			this.BillDate = this.O_View.get_HArgv("-y");
			BillDateNoneFlg = false;
		}

		var baseDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/";
		var dlfp = fopen(baseDir + "dl_au_list", "w");
		var A_success = Array();

		if ("all" == this.PactId) //pact指定がある場合
			{
				var pactParam = undefined;
			} else {
			pactParam = this.PactId;
		}

		var H_outClampError = Array();
		var O_ClampModel = new ClampModel();
		var H_clampData = O_ClampModel.getClampList(this.getSetting().CARID, this.getSetting().CHK_PACTID, this.getSetting().A_LOGIN_STATUS);
		var now = this.get_DB().getNow();

		if (H_clampData.length == 0) //エラーメッセージ出力
			//エラーメール出力
			//終了処理へ
			{
				this.infoOut("\n\u30ED\u30B0\u30A4\u30F3\u30C6\u30B9\u30C8\u7528\u306E\uFF29\uFF24\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
				H_outClampError.push({
					pactid: 0,
					carid: this.getSetting().CARID,
					error_type: "logintest",
					message: "\u30ED\u30B0\u30A4\u30F3\u30C6\u30B9\u30C8\u7528\u306E\uFF29\uFF24\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059",
					is_send: "false",
					recdate: now,
					fixdate: now
				});
				this.endScript();
			}

		var chkKeyFile = H_clampData.M[this.getSetting().CHK_PACTID][0].key_file;
		var chkKeyPass = H_clampData.M[this.getSetting().CHK_PACTID][0].key_pass;
		var chkCompname = H_clampData.M[this.getSetting().CHK_PACTID][0].compname;

		if (false == this.goLogin(chkKeyFile, chkKeyPass)) //エラーメッセージ出力
			//エラーメール出力
			//終了処理へ
			{
				this.infoOut("\n" + chkCompname + " \u69D8\u3067\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30B5\u30A4\u30C8\u3078\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\uFF08\u8A3C\u660E\u66F8\uFF09\n\n", 1);
				H_outClampError.push({
					pactid: 0,
					carid: this.getSetting().CARID,
					error_type: "logintest",
					message: "\u30C6\u30B9\u30C8\u7528\u306E\uFF29\uFF24\u3067\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30B5\u30A4\u30C8\u3078\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059",
					is_send: "false",
					recdate: now,
					fixdate: now
				});
				this.endScript();
			}

		var rtn = this.doLogin(H_clampData.M[this.getSetting().CHK_PACTID][0].clampid, H_clampData.M[this.getSetting().CHK_PACTID][0].clamppasswd, H_clampData.M[this.getSetting().CHK_PACTID][0].code, chkKeyFile, chkKeyPass);

		if ("" != strstr(rtn, this.getSetting().ERR_LOGIN_STR1) || "" != strstr(rtn, this.getSetting().ERR_LOGIN_STR2)) //エラーメッセージ出力
			//エラーメール出力
			//終了処理へ
			{
				this.infoOut("\n" + chkCompname + " \u69D8\u3067\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30B5\u30A4\u30C8\u3078\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
				H_outClampError.push({
					pactid: 0,
					carid: this.getSetting().CARID,
					error_type: "logintest",
					message: "\u30C6\u30B9\u30C8\u7528\u306E\uFF29\uFF24\u3067\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30B5\u30A4\u30C8\u3078\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059",
					is_send: "false",
					recdate: now,
					fixdate: now
				});
				this.endScript();
			} else //ログイン判定に成功したら最終ダウンロード日を更新する 20091130miya
			{
				var H_loginTest = Array();
				H_loginTest.push({
					pactid: this.getSetting().CHK_PACTID,
					carid: this.getSetting().CARID,
					detailno: 0,
					year: date("Y"),
					month: date("m"),
					type: "LoginCheck",
					dldate: undefined,
					is_ready: undefined,
					is_details: undefined,
					is_comm: undefined,
					is_info: undefined,
					is_calc: undefined,
					is_trend: undefined,
					is_recom: undefined,
					fixdate: now
				});
				this.doImport(H_loginTest, "clamp_index_tb");
			}

		H_clampData = Array();
		H_clampData = O_ClampModel.getClampList(this.getSetting().CARID, pactParam, this.getSetting().A_LOGIN_STATUS);

		if (H_clampData.length == 0) //エラーメッセージ出力
			//エラーメール出力
			//終了処理へ
			{
				this.infoOut("\n\u6709\u52B9\u306A\u30ED\u30B0\u30A4\u30F3\uFF29\uFF24\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
				H_outClampError.push({
					pactid: 0,
					carid: this.getSetting().CARID,
					error_type: "login",
					message: "\u6709\u52B9\u306A\u30ED\u30B0\u30A4\u30F3\uFF29\uFF24\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059",
					is_send: "false",
					recdate: now,
					fixdate: now
				});
				this.endScript();
			}

		var H_downloadedData = O_ClampModel.getDownloadedList(this.getSetting().CARID);
		var curFlg = true;

		if ("none" == this.O_View.get_HArgv("-y") && "all" == this.PactId) //特定の会社で当月のデータがダウンロードされていない場合
			{
				if (false == (undefined !== H_downloadedData[this.getSetting().CHK_PACTID][nowYyyyMm])) //当月データがダウンロード可能か不明の為 false に設定
					//ダウンロードテストディレクトリ
					//ダウンロードテストディレクトリ作成
					//セッションＩＤを取得
					//１種類ずつ処理する
					//END １種類ずつ処理する
					//ダウンロードテストディレクトリ削除
					{
						curFlg = false;
						var tmpDir = "/tmp/au-check/";
						this.makeDir(tmpDir);
						var sessid = this.getSessid(rtn);

						for (var targetFile of Object.values(this.getSetting().A_FILE_TYPE)) //ダウンロードメニューページへ
						//セッションＩＤを取得
						//請求年月を切替え
						//セッションＩＤを取得
						//ダウンロードする
						//ダウンロード結果判定：成功
						{
							var A_zipRtn = Array();
							rtn = this.goDownloadMenu(chkKeyFile, chkKeyPass, sessid);
							sessid = this.getSessid(rtn);
							rtn = this.chgBillDate(chkKeyFile, chkKeyPass, sessid, nowYyyyMm);
							sessid = this.getSessid(rtn);
							var element = "ELE_NO_" + targetFile;
							this.doDownload(chkKeyFile, chkKeyPass, sessid, nowYyyyMm, this.getSetting()[element], tmpDir, A_zipRtn);

							if (A_zipRtn.length != 0) {
								curFlg = true;
								exec("/bin/rm -rf " + tmpDir);
								break;
							}
						}

						exec("/bin/rm -rf " + tmpDir);
					}
			}

		var A_downloadedPactid = Object.keys(H_downloadedData);
		var A_compType = Object.keys(H_clampData);
		rsort(A_compType);
		var H_outClampIndex = Array();

		for (var compType of Object.values(A_compType)) //会社一覧を取得
		//会社毎に処理する
		//END 会社毎に処理する
		{
			var A_pactid = Object.keys(H_clampData[compType]);
			A_pactid.sort();

			for (var pactid of Object.values(A_pactid)) //実行時間制限がある場合
			//当月データがなく、新規会社でもない場合は処理をスキップ（新規会社は過去分をダウンロード）
			//枝番一覧を取得
			//ＩＤ、パスワードを１件ずつ処理する
			//END ＩＤ、パスワードを１件ずつ処理する
			{
				if ("Y" == this.EndFlg) //現在時を取得
					//終了時間が過ぎている場合
					//ループを抜けて終了処理へ
					{
						var hour = this.getHh();

						if (hour >= this.getSetting().ENDHOUR) //エラーメッセージ出力
							//エラーメール出力
							//エラーメール用データ登録
							//ダウンロードステータス登録
							//スクリプト終了処理
							{
								this.infoOut("\n\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5236\u9650\u6642\u9593(0\u6642\uFF5E" + this.getSetting().ENDHOUR + "\u6642)\u5916\u306E\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
								H_outClampError.push({
									pactid: 0,
									carid: this.getSetting().CARID,
									error_type: "login",
									message: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5236\u9650\u6642\u9593(0\u6642\uFF5E" + this.getSetting().ENDHOUR + "\u6642)\u5916\u306E\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059",
									is_send: "false",
									recdate: now,
									fixdate: now
								});
								this.doImport(H_outClampError, "clamp_error_tb");
								this.doImport(H_outClampIndex, "clamp_index_tb");
								this.endScript();
							}
					}

				if (false == (-1 !== A_downloadedPactid.indexOf(pactid))) //新規ではない場合
					{
						var newFlg = true;
					} else {
					newFlg = false;
				}

				if (false == curFlg && false == newFlg) {
					continue;
				}

				if (true == BillDateNoneFlg) //新規の場合
					//請求年月指定有りの場合は新規でも指定年月のみダウンロード対象
					{
						if (true == newFlg) //当月から過去分までの請求年月リストを取得する
							//新規ではない場合
							{
								var A_billDate = this.getBillDate(this.getSetting().MONTH_CNT);
							} else {
							A_billDate = [this.BillDate];
						}
					} else {
					A_billDate = [this.BillDate];
				}

				var A_detailno = Object.keys(H_clampData[compType][pactid]);

				for (var detailno of Object.values(A_detailno)) //ログインページへ
				//証明書が無い、内容が不正な場合
				//ログイン判定：失敗
				{
					var loginid = H_clampData[compType][pactid][detailno].clampid;
					var passwd = H_clampData[compType][pactid][detailno].clamppasswd;
					var recCode = H_clampData[compType][pactid][detailno].code;
					var keyFile = H_clampData[compType][pactid][detailno].key_file;
					var keyPass = H_clampData[compType][pactid][detailno].key_pass;
					rtn = this.goLogin(keyFile, keyPass);

					if (false == rtn) //エラーメッセージ出力
						//タイムスタンプ取得
						//エラーメール出力
						{
							this.infoOut("\n" + H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")\u306E\u3054\u8ACB\u6C42\u30B3\u30FC\u30C9(" + recCode + ")\u306E\u8A3C\u660E\u66F8\u304C\u4E0D\u6B63\u304B\u5B58\u5728\u3057\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n\n", 1);
							now = this.get_DB().getNow();
							H_outClampError.push({
								pactid: pactid,
								carid: this.getSetting().CARID,
								error_type: "login",
								message: H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")\u306E\u3054\u8ACB\u6C42\u30B3\u30FC\u30C9(" + recCode + ")\u306E\u8A3C\u660E\u66F8\u304C\u4E0D\u6B63\u304B\u5B58\u5728\u3057\u306A\u3044\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059",
								is_send: "false",
								recdate: now,
								fixdate: now
							});
							continue;
						}

					rtn = this.doLogin(loginid, passwd, recCode, keyFile, keyPass);

					if ("" != strstr(rtn, this.getSetting().ERR_LOGIN_STR1) || "" != strstr(rtn, this.getSetting().ERR_LOGIN_STR2)) //ログインステータスを失敗で更新
						//エラーメッセージ出力
						//タイムスタンプ取得
						//エラーメール出力
						//ログイン判定：成功
						{
							O_ClampModel.updateStatus(pactid, detailno, this.getSetting().CARID, this.getSetting().FAILURE);
							this.infoOut("\n" + H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")\u306E\u3054\u8ACB\u6C42\u30B3\u30FC\u30C9(" + recCode + ")\u30ED\u30B0\u30A4\u30F3\uFF29\uFF24\u3067\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059\n\n", 1);
							now = this.get_DB().getNow();
							H_outClampError.push({
								pactid: pactid,
								carid: this.getSetting().CARID,
								error_type: "login",
								message: H_clampData[compType][pactid][detailno].compname + "(pactid = " + pactid + ")\u306E\u3054\u8ACB\u6C42\u30B3\u30FC\u30C9(" + recCode + ")\u30ED\u30B0\u30A4\u30F3\uFF29\uFF24\u3067\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u306A\u304B\u3063\u305F\u70BA\u3001\u51E6\u7406\u3092\u30B9\u30AD\u30C3\u30D7\u3057\u307E\u3059",
								is_send: "false",
								recdate: now,
								fixdate: now
							});
							continue;
						} else //ログインステータスが未検証の場合
						//END 請求年月毎に処理する
						//パスワードの最終更新日時が不明な場合と一定期間パスワード変更していない場合はパスワード変更する
						{
							if (this.getSetting().INITIAL == H_clampData[compType][pactid][detailno].login_status) //ログインステータスを成功で更新
								//$rtn = $O_ClampModel->updateStatus($pactid,$detailno,$this->getSetting()->CARID,$this->getSetting()->SUCCESS);
								{
									O_ClampModel.updateStatus(pactid, detailno, this.getSetting().CARID, this.getSetting().SUCCESS);
								}

							for (var billDate of Object.values(A_billDate)) //当月データがなく、請求年月が当月の場合
							//請求年月ディレクトリを設定
							//請求年月ディレクトリ作成
							//auディレクトリを設定
							//auディレクトリ作成
							//請求ディレクトリを設定
							//請求ディレクトリを作成
							//通話明細ディレクトリを設定
							//通話明細ディレクトリを作成
							//会社毎請求ディレクトリを設定
							//会社毎請求ディレクトリを作成
							//会社毎通話明細ディレクトリを設定
							//会社毎通話明細ディレクトリを作成
							//対象会社で過去にダウンロードしているファイルがある場合
							//未ダウンロードファイルが無いの場合
							//セッションＩＤを取得
							//１種類ずつ処理する
							//END １種類ずつ処理する
							//ダウンロードリストファイルに書き込む 20090721miya
							{
								if (false == curFlg && billDate == nowYyyyMm) {
									continue;
								}

								var A_targetFile = Array();
								var dataDir = baseDir + billDate;
								this.makeDir(dataDir);
								dataDir += this.getSetting().CARRIER_DIR;
								this.makeDir(dataDir);
								var dataBillDir = dataDir + this.getSetting().BILL_DIR;
								this.makeDir(dataBillDir);
								var dataTuwaDir = dataDir + this.getSetting().TUWA_DIR;
								this.makeDir(dataTuwaDir);
								var dataPactBillDir = dataBillDir + "/" + pactid;
								this.makeDir(dataPactBillDir);
								var dataPactTuwaDir = dataTuwaDir + "/" + pactid;
								this.makeDir(dataPactTuwaDir);

								if (undefined !== H_downloadedData[pactid] == true) //対象請求年月でダウンロード済みのファイルがある場合
									//対象会社で過去にダウンロードしているファイルがない場合
									{
										if (undefined !== H_downloadedData[pactid][billDate] == true) //未ダウンロードファイルリストを取得
											//対象請求年月でダウンロード済みのファイルが無い場合
											{
												A_targetFile = array_diff(this.getSetting().A_FILE_TYPE, H_downloadedData[pactid][billDate].type);
											} else {
											A_targetFile = this.getSetting().A_FILE_TYPE;
										}
									} else {
									A_targetFile = this.getSetting().A_FILE_TYPE;
								}

								if (0 == A_targetFile.length) //処理をスキップ
									//未ダウンロードファイルが有るの場合
									{
										continue;
									} else //最終ダウンロード成功日から一定日数経過している場合
									//pactid指定時は一定日数経過していてもダウンロードする
									{
										if ("all" == this.PactId && true == (undefined !== H_downloadedData[pactid][billDate].dldate) && "" != H_downloadedData[pactid][billDate].dldate[0]) //dldateが空でないか条件追加 20091201miya
											//未ダウンロードファイル全てが最終ダウンロード成功日から一定日数経過している場合
											{
												if (false == this.chkRetry(H_downloadedData[pactid][billDate].dldate)) //処理をスキップ
													{
														continue;
													}
											}
									}

								sessid = this.getSessid(rtn);

								for (var targetFile of Object.values(A_targetFile)) //ダウンロードメニューページへ
								//セッションＩＤを取得
								//請求年月を切替え
								//セッションＩＤを取得
								//ファイルが請求明細
								//ダウンロード結果判定：成功
								{
									A_zipRtn = Array();
									rtn = this.goDownloadMenu(keyFile, keyPass, sessid);
									sessid = this.getSessid(rtn);
									rtn = this.chgBillDate(keyFile, keyPass, sessid, billDate);
									sessid = this.getSessid(rtn);
									element = "ELE_NO_" + targetFile;

									if (true == (-1 !== this.getSetting().A_BILL_TYPE.indexOf(targetFile))) //ファイルが通話明細
										{
											var filePath = dataPactBillDir;
										} else if (true == (-1 !== this.getSetting().A_TUWA_TYPE.indexOf(targetFile))) {
										filePath = dataPactTuwaDir;
									}

									this.doDownload(keyFile, keyPass, sessid, billDate, this.getSetting()[element], filePath, A_zipRtn);

									if (A_zipRtn.length != 0) //ダウンロードステータス更新
										//成功した場合配列に入れる 20091016miya
										{
											now = this.get_DB().getNow();
											H_outClampIndex.push({
												pactid: pactid,
												carid: this.getSetting().CARID,
												detailno: detailno,
												year: billDate.substr(0, 4),
												month: billDate.substr(4, 2),
												type: targetFile,
												dldate: now,
												is_ready: true,
												is_details: undefined,
												is_comm: undefined,
												is_info: undefined,
												is_calc: undefined,
												is_trend: undefined,
												is_recom: undefined,
												fixdate: now
											});
											A_success.push(pactid + "_" + billDate);
										}
								}

								if (0 < A_success.length) {
									A_success = array_unique(A_success);

									for (var sucval of Object.values(A_success)) {
										fwrite(dlfp, sucval + "\n");
									}

									A_success = Array();
								}
							}

							if ("" == H_clampData[compType][pactid][detailno].pass_changedate || false == this.chkExpirePass(H_clampData[compType][pactid][detailno].pass_changedate, H_clampData[compType][pactid][detailno].pass_interval)) //セッションＩＤを取得
								//パスワード変更画面へ
								//セッションＩＤを取得
								//ダミーパスワードで更新(確認画面)
								//セッションＩＤを取得
								//セッションＩＤを取得
								//ダミーパスワードで更新(更新)
								//元のパスワードに戻す
								//セッションＩＤを取得
								//パスワード変更画面へ
								//セッションＩＤを取得
								//元のパスワードで更新(確認画面)
								//セッションＩＤを取得
								//セッションＩＤを取得
								//元のパスワードで更新(更新)
								//パスワード更新したことをＤＢに反映
								//$rtn = $O_ClampModel->updatePassChgDate($pactid,$detailno,$this->getSetting()->CARID,$this->get_DB()->getNow());
								{
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdMenu(keyFile, keyPass, sessid);
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdConfirm(keyFile, keyPass, sessid, H_clampData[compType][pactid][detailno].clamppasswd, this.getSetting().DUMMY_PASSWORD);
									sessid = this.getSessid(rtn);
									var updateCnt = this.getUpdateCnt(rtn);
									rtn = this.doPasswdChg(keyFile, keyPass, sessid, H_clampData[compType][pactid][detailno].clamppasswd, this.getSetting().DUMMY_PASSWORD, updateCnt);
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdMenu(keyFile, keyPass, sessid);
									sessid = this.getSessid(rtn);
									rtn = this.goPasswdConfirm(keyFile, keyPass, sessid, this.getSetting().DUMMY_PASSWORD, H_clampData[compType][pactid][detailno].clamppasswd);
									sessid = this.getSessid(rtn);
									updateCnt = this.getUpdateCnt(rtn);
									rtn = this.doPasswdChg(keyFile, keyPass, sessid, this.getSetting().DUMMY_PASSWORD, H_clampData[compType][pactid][detailno].clamppasswd, updateCnt);
									O_ClampModel.updatePassChgDate(pactid, detailno, this.getSetting().CARID, this.get_DB().getNow());
								}
						}
				}
			}
		}

		this.doImport(H_outClampError, "clamp_error_tb");
		this.doImport(H_outClampIndex, "clamp_index_tb");
		fclose(dlfp);
		this.endScript();
	}

	endScript() //スクリプトの二重起動防止ロック解除
	//終了
	//$this->infoOut($this->getSetting()->AU_DOWNLOAD . "終了\n",1);	// メール削減のためコメントアウト 20091120miya
	{
		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
		throw die(0);
	}

	splitNow() //現在時を取得
	{
		var now = this.get_DB().getNow();
		return split(" ", now);
	}

	splitDate(A_date) {
		return split("-", A_date);
	}

	splitTime(A_time) {
		return split(":", A_time);
	}

	getHh() {
		var A_now = this.splitNow();
		var A_time = this.splitTime(A_now[1]);
		return A_time[0];
	}

	getYyyyMm(arrayFlg = false) //文字列で返す
	{
		var A_now = this.splitNow();
		var A_date = this.splitDate(A_now[0]);

		if (false == arrayFlg) //配列で返す
			{
				var YyyyMm = A_date[0] + A_date[1];
				return YyyyMm;
			} else {
			return A_date.slice(0, 2);
		}
	}

	getBillDate(months) //ダウンロード対象は１年まで
	//請求年月リスト作成
	{
		var A_billDate = Array();

		if (12 < months) {
			months = 12;
		}

		var A_date = this.getYyyyMm(true);

		for (var count = 0; count < months; count++) {
			var year = A_date[0];
			var month = A_date[1] - count;

			if (1 > month) {
				year -= 1;
				month += 12;
			}

			if (10 > month) {
				month = "0" + month;
			}

			A_billDate.push(year + month);
		}

		return A_billDate;
	}

	setOptions(handle, sslKey, sslPass, params, cookieFlg = false) //2015-02-18 証明書不要になったので削除
	//		curl_setopt($handle, CURLOPT_SSLCERT, $sslKey);
	//		curl_setopt($handle, CURLOPT_SSLCERTPASSWD, $sslPass);	// ブラウザでなければ無くても通るようだが一応入れておく
	{
		curl_setopt(handle, CURLOPT_VERBOSE, this.getSetting().VERBOSE);
		curl_setopt(handle, CURLOPT_SSL_VERIFYHOST, this.getSetting().VERIFYHOST);
		curl_setopt(handle, CURLOPT_SSL_VERIFYPEER, this.getSetting().VERIFYPEER);
		curl_setopt(handle, CURLOPT_SSLVERSION, this.getSetting().SSLVERSION);
		curl_setopt(handle, CURLOPT_RETURNTRANSFER, this.getSetting().RETURNTRANSFER);
		curl_setopt(handle, CURLOPT_FOLLOWLOCATION, this.getSetting().FOLLOWLOCATION);
		curl_setopt(handle, CURLOPT_POST, this.getSetting().POST);
		curl_setopt(handle, CURLOPT_POSTFIELDS, params);

		if (this.getSetting().existsKey("PROXY") && this.getSetting().PROXY) {
			curl_setopt(handle, CURLOPT_PROXY, this.getSetting().PROXY);
			curl_setopt(handle, CURLOPT_HTTPPROXYTUNNEL, true);

			if (this.getSetting().existsKey("PROXY_PORT") && this.getSetting().PROXY_PORT) {
				curl_setopt(handle, CURLOPT_PROXYPORT, this.getSetting().PROXY_PORT);
			}

			if (this.getSetting().existsKey("PROXY_USER") && this.getSetting().PROXY_USER && this.getSetting().existsKey("PROXY_PASSWORD") && this.getSetting().PROXY_PASSWORD) {
				var userpwd = this.getSetting().PROXY_USER + ":" + this.getSetting().PROXY_PASSWORD;
				curl_setopt(handle, CURLOPT_PROXYUSERPWD, userpwd);
			}
		}

		if (true == cookieFlg) {
			curl_setopt(handle, CURLOPT_COOKIEJAR, this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/au_cookie/cookie");
			curl_setopt(handle, CURLOPT_COOKIEFILE, this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/au_cookie/tmp");
		}
	}

	goLogin(sslKey, sslPass) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//接続ハンドルクローズ
	{
		var params = {
			action: "769",
			disp: "",
			loginchk: "off"
		};
		var handle = curl_init(this.getSetting().URL_GO_LOGIN);
		this.setOptions(handle, sslKey, sslPass, params, false);
		var rtn = curl_exec(handle);
		curl_close(handle);
		return rtn;
	}

	doLogin(loginid, passwd, recCode, sslKey, sslPass) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//接続ハンドルクローズ
	{
		var params = {
			action: "769",
			screen_title: "769",
			reqCD: recCode,
			userID: loginid,
			password: passwd
		};
		var fp = fopen(this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/au_cookie/tmp", "w");
		var handle = curl_init(this.getSetting().URL_DO_LOGIN);
		this.setOptions(handle, sslKey, sslPass, params, false);
		curl_setopt(handle, CURLOPT_COOKIEJAR, this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/au_cookie/cookie");
		curl_setopt(handle, CURLOPT_WRITEHEADER, fp);
		var rtn = curl_exec(handle);
		fclose(fp);
		curl_close(handle);
		return rtn;
	}

	getSessid(source) {
		var result = strstr(source, this.getSetting().SESSION_NAME);
		var A_lineData = result.split("\n");
		var target = A_lineData[0];
		var A_data = target.split("\"");
		return A_data[2];
	}

	getUpdateCnt(source) {
		var result = strstr(source, "updateKaisu");
		var A_lineData = result.split("\n");
		var target = A_lineData[0];
		var A_data = target.split("'");
		return A_data[1];
	}

	goDownloadMenu(sslKey, sslPass, sessid) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//接続ハンドルクローズ
	{
		var params = {
			[this.getSetting().SESSION_NAME]: sessid,
			dispFrame: "1",
			dispMenu: "",
			action: "1793",
			disp: "",
			command: "check"
		};
		var handle = curl_init(this.getSetting().URL_GO_DOWNLOAD);
		this.setOptions(handle, sslKey, sslPass, params, true);
		var rtn = curl_exec(handle);
		curl_close(handle);
		return rtn;
	}

	chgBillDate(sslKey, sslPass, sessid, billDate) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//接続ハンドルクローズ
	{
		var params = {
			[this.getSetting().SESSION_NAME]: sessid,
			action: "1793",
			command: "chgdate",
			"dclkFnEmail.disp": "true",
			"dclkFnEmail.viewString": "\u6D77\u5916\u3067\u306EE\u30E1\u30FC\u30EB\u3054\u5229\u7528\u306B\u3064\u3044\u3066",
			"dclkFnEmail.urlLink": "https://bross.kddi.com/global.html",
			screen_title: "1793",
			taisyoDate: billDate
		};
		var handle = curl_init(this.getSetting().URL_CHG_BILLDATE);
		this.setOptions(handle, sslKey, sslPass, params, true);
		var rtn = curl_exec(handle);
		curl_close(handle);
		return rtn;
	}

	doDownload(sslKey, sslPass, sessid, billDate, eleNo, filePath, A_zipRtn) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//ファイルが取得できない場合は失敗扱いにする
	//ZIPじゃなければ中止するようにしたからとめておく
	//		$errCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
	//		if ("200" != curl_getinfo($handle, CURLINFO_HTTP_CODE)) {
	//			$this->infoOut("ファイルがありませんでした(".$errCode.")\n");
	//			$A_zipRtn = array();
	//			$rtn = 0;
	//	//		return $rtn;
	//		}
	//接続ハンドルクローズ
	{
		var params = {
			[this.getSetting().SESSION_NAME]: sessid,
			action: "1793",
			command: "download",
			"dclkFnEmail.disp": "true",
			"dclkFnEmail.viewString": "\u6D77\u5916\u3067\u306EE\u30E1\u30FC\u30EB\u3054\u5229\u7528\u306B\u3064\u3044\u3066",
			"dclkFnEmail.urlLink": "https://bross.kddi.com/global.html",
			screen_title: "1793",
			taisyoDate: billDate,
			["monthlyDataList[" + eleNo + "].downloadFlg"]: "1",
			["monthlyDataList[" + eleNo + "].downloadKbn"]: "1"
		};
		var handle = curl_init(this.getSetting().URL_DO_DOWNLOAD);
		var fp = fopen(filePath + "/downloaded-file.zip", "w");
		this.setOptions(handle, sslKey, sslPass, params, true);
		var rtn = curl_exec(handle);
		fwrite(fp, rtn);
		fclose(fp);

		if (file_exists(filePath + "/downloaded-file.zip")) {
			var zipCheckCode = exec("/usr/bin/unzip -t " + filePath + "/downloaded-file.zip");

			if (preg_match("/^No errors detected/", zipCheckCode)) {
				exec("/usr/bin/unzip -o -d " + filePath + " " + filePath + "/downloaded-file.zip", A_zipRtn);
			} else {
				A_zipRtn = Array();
			}

			unlink(filePath + "/downloaded-file.zip");
		} else {
			this.infoOut(filePath + "/downloaded-file.zip\u304C\u3042\u308A\u307E\u305B\u3093\n\n", 1);
		}

		curl_close(handle);
		return rtn;
	}

	goPasswdMenu(sslKey, sslPass, sessid) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//接続ハンドルクローズ
	{
		var params = {
			[this.getSetting().SESSION_NAME]: sessid,
			dispFrame: "1",
			dispMenu: "",
			action: "1537",
			disp: "",
			command: "check"
		};
		var handle = curl_init(this.getSetting().URL_GO_PASSWD);
		this.setOptions(handle, sslKey, sslPass, params, true);
		var rtn = curl_exec(handle);
		curl_close(handle);
		return rtn;
	}

	goPasswdConfirm(sslKey, sslPass, sessid, oldPasswd, newPasswd) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//接続ハンドルクローズ
	{
		var params = {
			[this.getSetting().SESSION_NAME]: sessid,
			action: "1537",
			errFlag: "",
			command: "CHECK",
			pswdKbn: "F",
			updateKaisu: "0",
			screen_title: "1537",
			oldPass: oldPasswd,
			newPass: newPasswd,
			newPassCnf: newPasswd
		};
		var handle = curl_init(this.getSetting().URL_CONFIRM_PASSWD);
		this.setOptions(handle, sslKey, sslPass, params, true);
		var rtn = curl_exec(handle);
		curl_close(handle);
		return rtn;
	}

	doPasswdChg(sslKey, sslPass, sessid, oldPasswd, newPasswd, updateCnt) //POST パラメータ設定
	//接続ハンドル作成
	//オプション設定
	//http リクエスト
	//接続ハンドルクローズ
	{
		var params = {
			[this.getSetting().SESSION_NAME]: sessid,
			action: "1537",
			errFlag: "",
			command: "SAVE",
			pswdKbn: "F",
			updateKaisu: updateCnt,
			screen_title: "1537",
			oldPass: oldPasswd,
			newPass: newPasswd,
			newPassCnf: newPasswd
		};
		var handle = curl_init(this.getSetting().URL_CHG_PASSWD);
		this.setOptions(handle, sslKey, sslPass, params, true);
		var rtn = curl_exec(handle);
		curl_close(handle);
		return rtn;
	}

	doImport(H_inputData, table) //トランザクション開始
	//clamp_index_tbへデータ取込
	{
		this.get_DB().beginTransaction();

		if (0 != H_inputData.length) //アップデート可能なテーブル、これを設定しないとclamp_index_tb用のデータでclamp_error_tbにUPDATEしようとする 20091201miya
			//データがあれば最終更新日上書き 20091126miya
			//取込失敗
			{
				var A_updatable = ["clamp_index_tb"];
				var indcnt = 0;

				if (true == (-1 !== A_updatable.indexOf(table))) //$A_updatableを条件追加 20091201miya
					//SBの関数流用 20091130miya
					{
						indcnt = this.O_SB_Model.getClampIndexCount(H_inputData);
					}

				if (true == 0 < indcnt && true == (-1 !== A_updatable.indexOf(table))) //$A_updatableを条件追加 20091201miya
					//SBの関数流用 20091130miya
					{
						var rtn = this.O_SB_Model.updateClampIndexFixdate(H_inputData);
					} else {
					rtn = this.get_DB().pgCopyFromArray(table, H_inputData);
				}

				if (rtn == false) //取込成功
					{
						this.get_DB().rollback();
						this.errorOut(1000, "\n" + table + " \u3078\u306E\u30C7\u30FC\u30BF\u53D6\u8FBC\u306B\u5931\u6557\u3057\u307E\u3057\u305F\n", 0, "", "");
						throw die(-1);
					} else //$this->infoOut($table . " へデーターインポート完了\n",1);	// メール削減のためコメントアウト 20091120miya
					{}
			}

		this.get_DB().commit();
	}

	getMonthEndDay(year, month) {
		var day = mktime(0, 0, 0, month + 1, 0, year);
		return date("d", day);
	}

	chkExpirePass(date, month) //有効期限残り１ヶ月以内
	{
		if (1 > month) {
			month = 1;
		}

		var A_date = split("-", date);
		A_date[1] += month - 1;
		var endDay = this.getMonthEndDay(A_date[0], A_date[1]);

		if (A_date[2] > endDay) {
			A_date[2] = endDay;
		}

		var A_now = this.splitNow();
		var A_nowDate = split("-", A_now[0]);

		if (mktime(0, 0, 0, A_date[1], A_date[2], A_date[0]) <= mktime(0, 0, 0, A_nowDate[1], A_nowDate[2], A_nowDate[0])) //有効期限まだ大丈夫
			{
				return false;
			} else {
			return true;
		}
	}

	chkRetry(A_date) //ダウンロード日付の降順でソート
	{
		rsort(A_date);
		var A_dlDate = split("-", A_date[0]);
		var A_now = this.splitNow();
		var A_nowDate = split("-", A_now[0]);

		if (this.getSetting().RETRY_DAY < this.compareDate(A_nowDate[0], A_nowDate[1], A_nowDate[2], A_dlDate[0], A_dlDate[1], A_dlDate[2])) {
			return false;
		} else {
			return true;
		}
	}

	compareDate(year1, month1, day1, year2, month2, day2) //1日は86400秒
	{
		var date1 = mktime(0, 0, 0, month1, day1, year1);
		var date2 = mktime(0, 0, 0, month2, day2, year2);
		var diff = date1 - date2;
		var diffDay = diff / 86400;
		return diffDay;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};