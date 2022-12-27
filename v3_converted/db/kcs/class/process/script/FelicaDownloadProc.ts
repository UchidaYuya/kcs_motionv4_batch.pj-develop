//
//ダウンロードプロセス
//
//更新履歴：<br>
//2010/04/22 宮澤龍彦 作成
//
//@uses ProcessBaseBatch
//@package FelicaDownload
//@filesource
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/04/22
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ダウンロードプロセス
//
//@uses ProcessBaseBatch
//@package FelicaDownload
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2010/04/22
//

require("process/ProcessBaseBatch.php");

require("model/script/FelicaDownloadModel.php");

require("view/script/FelicaDownloadView.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2010/04/22
//
//@param array $H_param
//@param array $H_argv
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author miyazawa
//@since 2010/04/22
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2010/04/22
//
//@access public
//@return void
//
class FelicaDownloadProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //// view の生成
	//// model の生成
	{
		super(H_param);
		this.getSetting().loadConfig("felica");
		this.O_View = new FelicaDownloadView(this.getSetting(), this.getOut());
		this.O_Model = new FelicaDownloadModel(this.get_DB());
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//$this->infoOut("自動ダウンロード処理開始\n",1);	// メール削減のためコメントアウト 20091120miya
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//実行時間制限がある場合
	//請求年月指定なしフラグ
	//3日前の日付 20091126miya
	//今月1日の日付 20091210miya
	//エラーメール出力用配列
	//ダウンロードエラーメール送信用テーブル
	//クラウズサーバが生きているかヘルスチェック
	//リトライ機能つけた 20170816伊達
	//ヘルスチェックに失敗したらここでストップ
	//調査の為ログの出力 2015-06-04 終了
	//リトライ機能つけた 20170818伊達
	//ダウンロードに失敗したらここでストップ
	//終了
	//$this->infoOut("自動ダウンロード処理終了\n",1);	// メール削減のためコメントアウト 20091120miya
	{
		this.set_Dirs(this.O_View.get_ScriptName());
		this.lockProcess(this.O_View.get_ScriptName());
		this.BillDate = this.O_View.get_HArgv("-y");
		this.PactId = this.O_View.get_HArgv("-p");
		this.EndFlg = this.O_View.get_HArgv("-s");

		if ("Y" == this.EndFlg) //現在時を取得
			//終了時間が過ぎている場合
			//ループを抜けて終了処理へ
			{
				var hour = this.getHh();

				if (hour >= this.getSetting().ENDHOUR) //中断する旨 DBに書き込む？
					//スクリプトの二重起動防止ロック解除
					//スクリプト終了処理
					{
						this.infoOut("\n\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5236\u9650\u6642\u9593(0\u6642\uFF5E" + this.getSetting().ENDHOUR + "\u6642)\u5916\u306E\u70BA\u3001\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
						this.unLockProcess(this.O_View.get_ScriptName());
						this.set_ScriptEnd();
						throw die(-1);
					}
			}

		if ("all" == this.PactId) {
			this.PactId = "";
		}

		var BillDateNoneFlg = false;

		if ("none" == this.BillDate) {
			var thismonth = date("Y,m,d", mktime(0, 0, 0, date("n"), date("j"), date("Y")));
			var A_tm = preg_split("/,/", thismonth);
			this.BillDate = A_tm[0] + A_tm[1] + A_tm[2];
			BillDateNoneFlg = true;
		}

		var now = this.get_DB().getNow();
		var daysago3 = date("Y-m-d", strtotime("-3 day"));
		var days1st = date("Y-m") + "-01";
		var H_outClampError = Array();
		var checkresult = false;

		for (var i = 0; i < 10; i++) {
			var server_status = this.O_View.checkHealth(this.getSetting().CHECK_URL, "POST");

			if (false != server_status) {
				if (200 == server_status) //$this->infoOut("\n" . "クラウズサーバ接続確認成功\n\n",1);	// メール削減のためコメントアウト 20100924miya
					{
						if (i > 0) //リトライでの成功の場合はメール出す
							{
								this.infoOut("\n" + "\u30AF\u30E9\u30A6\u30BA\u30B5\u30FC\u30D0\u63A5\u7D9A\u78BA\u8A8D\u6210\u529F\n\n", 1);
							}

						checkresult = true;
						break;
					} else if (500 == server_status) {
					this.infoOut("\n" + "\u30AF\u30E9\u30A6\u30BA\u30B5\u30FC\u30D0\u63A5\u7D9A\u78BA\u8A8D\u6642\u30B5\u30FC\u30D0\u5185\u30A8\u30E9\u30FC\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
				} else {
					this.infoOut("\n" + "\u30AF\u30E9\u30A6\u30BA\u30B5\u30FC\u30D0\u63A5\u7D9A\u78BA\u8A8D\u5931\u6557\u3002\u672A\u77E5\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u30B3\u30FC\u30C9\uFF08" + server_status + "\uFF09\u3067\u3059\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
				}
			} else {
				this.infoOut("\n" + "\u30AF\u30E9\u30A6\u30BA\u30B5\u30FC\u30D0\u63A5\u7D9A\u78BA\u8A8D\u5931\u6557\u3002\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
			}

			sleep(5);
		}

		if (false == checkresult) //スクリプトの二重起動防止ロック解除
			//終了処理へ
			{
				this.unLockProcess(this.O_View.get_ScriptName());
				this.set_ScriptEnd();
				throw die(-1);
			}

		var dlresult = false;
		H_param = {
			key: this.getSetting().API_KEY,
			ver: this.getSetting().API_VERSION
		};

		if ("" != this.BillDate && true != BillDateNoneFlg) {
			H_param.created = this.BillDate;
		}

		if ("" != this.PactId) {
			H_param.group = this.PactId;
		}

		var _tmplogfile = this.getSetting().KCS_DIR + "/log/felica_download.log";

		var _tmplog = fopen(_tmplogfile, "a");

		fwrite(_tmplog, "---------- pactid=" + (undefined !== H_param.group ? H_param.group : "all") + " \u51E6\u7406\u30B9\u30BF\u30FC\u30C8 " + date("Y-m-d H:i:s") + " -----------\n");
		fwrite(_tmplog, "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u958B\u59CB: " + date("Y-m-d H:i:s") + "\n");

		for (i = 0;; i < 10; i++) {
			var H_dl = this.O_View.doRequest(this.getSetting().DOWNLOAD_URL, H_param);

			if (true == Array.isArray(H_dl)) {
				if ("200" == H_dl.code) //$this->infoOut("\n" . "クラウズサーバダウンロード実行成功\n\n",1);	// メール削減のためコメントアウト 20100924miya
					{
						if (i > 0) {
							this.infoOut("\n" + "\u30AF\u30E9\u30A6\u30BA\u30B5\u30FC\u30D0\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B9F\u884C\u6210\u529F\n\n", 1);
						}

						dlresult = true;
						break;
					} else {
					if ("403" == H_dl.code) {
						var errmsg = "key/ver\u306E\u5024\u304C\u4E0D\u6B63\u3067\u3042\u308A\u3001\u6B63\u3057\u304F\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u306A\u3044\u3053\u3068\u304C\u8003\u3048\u3089\u308C\u307E\u3059\uFF08" + H_dl.code + "\uFF09\u3002";
					} else if ("412" == H_dl.code) {
						errmsg = "key/ver/created/format/enc\u306E\u3069\u308C\u304B\u304C\u6B63\u3057\u304F\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u3053\u3068\u304C\u8003\u3048\u3089\u308C\u307E\u3059\uFF08" + H_dl.code + "\uFF09\u3002";
					} else if ("500" == H_dl.code) {
						errmsg = "\u30B5\u30FC\u30D0\u5185\u30A8\u30E9\u30FC\u304C\u8003\u3048\u3089\u308C\u307E\u3059\uFF08" + H_dl.code + "\uFF09\u3002";
					} else {
						errmsg = "\u672A\u77E5\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u30B3\u30FC\u30C9\uFF08" + H_dl.code + "\uFF09\u3067\u3059\u3002";
					}

					this.infoOut("\n" + "\u30AF\u30E9\u30A6\u30BA\u30B5\u30FC\u30D0\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B9F\u884C\u5931\u6557\u3002" + errmsg + "\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
				}
			} else //$this->infoOut("\n" . "クラウズサーバダウンロード実行失敗。処理を終了します\n\n",1);	// メール削減のためコメントアウト 20100924miya
				//調査の為ログの出力 2015-06-04 開始
				//調査の為ログの出力 2015-06-04 終了
				{
					fwrite(_tmplog, "\u63A5\u7D9A\u5931\u6557: " + date("Y-m-d H:i:s") + "\n");
				}

			sleep(5);
		}

		if (false == dlresult) //スクリプトの二重起動防止ロック解除
			//調査の為ログの出力 2015-06-04 開始
			//調査の為ログの出力 2015-06-04 終了
			//終了処理へ
			{
				this.unLockProcess(this.O_View.get_ScriptName());
				fwrite(_tmplog, "\u63A5\u7D9A\u5931\u6557: " + date("Y-m-d H:i:s") + "\n");
				this.set_ScriptEnd();
				throw die(-1);
			}

		if ("" != H_dl.data) //ダウンロードに成功していたらファイルとして保存
			{
				if (true == dlresult) //調査の為ログの出力 2015-06-04 開始
					//調査の為ログの出力 2015-06-04 終了
					{
						var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.BillDate.substr(0, 6) + this.getSetting().FELICA_DIR + "/";

						if (false == file_exists(dataDir)) {
							mkdir(dataDir, 755, true);
						}

						var filename = dataDir + "felica_download_" + this.PactId + "_" + this.BillDate + ".txt";
						file_put_contents(filename, H_dl.data);
						fwrite(_tmplog, "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B8C\u4E86: " + date("Y-m-d H:i:s") + "\n");
					}
			}

		var H_falselist = this.O_Model.checkICCardIndex();

		if (0 < H_falselist.length) {
			for (var val of Object.values(H_falselist)) //YYYY-MM-DDのハイフン抜く
			//調査の為ログの出力 2015-06-04 開始
			//調査の為ログの出力 2015-06-04 終了
			//ダウンロードに失敗したらここでストップ
			{
				H_param.created = ereg_replace("-", "", val.dataday);
				H_param.group = val.pactid;
				_tmplogfile = this.getSetting().KCS_DIR + "/log/felica_download.log";
				_tmplog = fopen(_tmplogfile, "a");
				fwrite(_tmplog, "---------- pactid=" + val.pactid + " \u51E6\u7406\u30B9\u30BF\u30FC\u30C8 " + date("Y-m-d H:i:s") + " -----------\n");
				fwrite(_tmplog, "\u518D\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u958B\u59CB: " + date("Y-m-d H:i:s") + "\n");
				H_dl = this.O_View.doRequest(this.getSetting().DOWNLOAD_URL, H_param);

				if (true == Array.isArray(H_dl)) {
					if ("200" == H_dl.code) //$this->infoOut("\n" . "クラウズサーバダウンロード実行成功\n\n",1);	// メール削減のためコメントアウト 20100924miya
						{
							dlresult = true;
						} else {
						if ("403" == H_dl.code) {
							errmsg = "key/ver\u306E\u5024\u304C\u4E0D\u6B63\u3067\u3042\u308A\u3001\u6B63\u3057\u304F\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u306A\u3044\u3053\u3068\u304C\u8003\u3048\u3089\u308C\u307E\u3059\uFF08" + H_dl.code + "\uFF09\u3002";
						} else if ("412" == H_dl.code) {
							errmsg = "key/ver/created/format/enc\u306E\u3069\u308C\u304B\u304C\u6B63\u3057\u304F\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u3053\u3068\u304C\u8003\u3048\u3089\u308C\u307E\u3059\uFF08" + H_dl.code + "\uFF09\u3002";
						} else if ("500" == H_dl.code) {
							errmsg = "\u30B5\u30FC\u30D0\u5185\u30A8\u30E9\u30FC\u304C\u8003\u3048\u3089\u308C\u307E\u3059\uFF08" + H_dl.code + "\uFF09\u3002";
						} else {
							errmsg = "\u672A\u77E5\u306E\u30B9\u30C6\u30FC\u30BF\u30B9\u30B3\u30FC\u30C9\uFF08" + H_dl.code + "\uFF09\u3067\u3059\u3002";
						}

						this.infoOut("\n" + "\u30AF\u30E9\u30A6\u30BA\u30B5\u30FC\u30D0\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B9F\u884C\u5931\u6557\u3002" + errmsg + "\u51E6\u7406\u3092\u7D42\u4E86\u3057\u307E\u3059\n\n", 1);
					}
				} else //$this->infoOut("\n" . "クラウズサーバダウンロード実行失敗。処理を終了します\n\n",1);	// メール削減のためコメントアウト 20100924miya
					//調査の為ログの出力 2015-06-04 開始
					//調査の為ログの出力 2015-06-04 終了
					{
						fwrite(_tmplog, "\u63A5\u7D9A\u5931\u6557: " + date("Y-m-d H:i:s") + "\n");
					}

				if (false == dlresult) //スクリプトの二重起動防止ロック解除
					//調査の為ログの出力 2015-06-04 開始
					//調査の為ログの出力 2015-06-04 終了
					//終了処理へ
					{
						this.unLockProcess(this.O_View.get_ScriptName());
						fwrite(_tmplog, "\u518D\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5931\u6557: " + date("Y-m-d H:i:s") + "\n");
						this.set_ScriptEnd();
						throw die(-1);
					}

				if ("" != H_dl.data) //ダウンロードに成功していたらファイルとして保存
					{
						if (true == dlresult) //調査の為ログの出力 2015-06-04 開始
							//調査の為ログの出力 2015-06-04 終了
							{
								dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + H_param.created.substr(0, 6) + this.getSetting().FELICA_DIR + "/";

								if (false == file_exists(dataDir)) {
									mkdir(dataDir, 755, true);
								}

								filename = dataDir + "felica_download_" + H_param.group + "_" + H_param.created + ".txt";
								file_put_contents(filename, H_dl.data);
								fwrite(_tmplog, "\u518D\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B8C\u4E86: " + date("Y-m-d H:i:s") + "\n");
							}
					}
			}
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};