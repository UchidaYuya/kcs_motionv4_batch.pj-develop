//
//ドコモ二段階認証
//
//更新履歴：<br>
//2018/05/25 森原浩司 作成
//
//@package script
//@author morihara<morihara@motion.ne.jp>
//@filesource
//@uses ProcessBaseBatch
//@uses DocomoTerminalRegistView
//@uses PactModel
//@uses ClampModel
//@uses DocomoTerminalRegistModel
//@uses MtSetting
//@since 2018/05/25
//
//
//error_reporting(E_ALL|E_STRICT);

require("process/ProcessBaseBatch.php");

require("view/script/DocomoTerminalRegistView.php");

require("model/PactModel.php");

require("model/ClampModel.php");

require("model/DocomoTerminalRegistModel.php");

require("MtSetting.php");

//
//設定オブジェクト
//
//@var MtSetting
//@access protected
//
//
//
//Viewオブジェクト
//
//@var DocomoTerminalRegistView
//@access protected
//
//
//
//pact_tbへのアクセスを行うモデル
//
//@var PactModel
//@access protected
//
//
//
//clamp_tbへのアクセスを行うモデル
//
//@var ClampModel
//@access protected
//
//
//
//コンストラクタ
//
//@author morihara
//@since 2018/05/25
//
//@param array $H_param
//@access public
//@return void
//
//
//
//メインの処理
//
//@author morihara
//@since 2018/05/25
//
//@param array $H_param
//@access public
//@return void
//
//
//
//あるクランプIDに対して、二段階認証を行う
//
//@author morihara
//@since 2018/05/25
//
//@param array $H_clamp clamp_tbのレコード一個
//@access protected
//@return void
//
//
//
//モデルの戻り値をチェックする
//
//@author morihara
//@since 2018/05/25
//
//@param integer $rval $O_modelのメソッドの戻り値
//@return boolean 処理を打ち切る場合はfalse
//
//
//
//デストラクタ
//
//@author morihara
//@since 2018/05/25
//
//@access public
//@return void
//
//
class DocomoTerminalRegistProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //設定インスタンスの作成
	//view作成
	//pact_tbへのDBアクセスモデル作成
	//clamp_tbへのDBアクセスモデル作成
	{
		super(H_param);
		this.O_setting = MtSetting.singleton();
		this.O_setting.loadConfig("common");
		this.O_view = new DocomoTerminalRegistView();
		this.O_pact = new PactModel();
		this.O_table = new ClampModel();
	}

	doExecute(H_param: {} | any[] = Array()) //スクリプトの二重起動防止ロック
	//$this->lockProcess($this->O_view->get_ScriptName());
	//処理するpactidを決定する
	//pactidに対してループする
	//スクリプトの二重起動防止ロック解除
	//$this->unLockProcess($this->O_view->get_ScriptName());
	//終了
	{
		var A_pactid = Array();

		if ("all" === this.O_view.get_HArgv("-p")) {
			var H_clamp = this.O_table.getClampList(1);

			for (var H_item of Object.values(H_clamp)) {
				for (var pactid in H_item) {
					var dummy = H_item[pactid];
					A_pactid.push(pactid);
				}
			}
		} else {
			A_pactid.push(0 + this.O_view.get_HArgv("-p"));
		}

		for (var pactid of Object.values(A_pactid)) //社名を表示する
		{
			this.getOut().infoOut(this.O_pact.getCompname(pactid) + "\n");

			while (true) //clamp_tbから、該当する情報を取り出す
			//信頼端末登録済なら、更新するか確認する
			{
				var A_clamp = this.O_table.getClamps(pactid, 1);

				if (!A_clamp.length) {
					this.getOut().infoOut(this.O_pact.getCompname(pactid) + "\u306B\u306F\u30AF\u30E9\u30F3\u30D7ID\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\n");
					break;
				}

				this.getOut().infoOut("\u30ED\u30B0\u30A4\u30F3\u51E6\u7406\u3092\u884C\u3046clampid\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044(\u3053\u306E\u9867\u5BA2\u306E\u51E6\u7406\u3092\u7D42\u4E86\u3059\u308B\u306B\u306Fq)" + "\n");

				for (var cnt = 0; cnt < A_clamp.length; ++cnt) {
					H_clamp = A_clamp[cnt];
					var msg = 1 + cnt + ":" + H_clamp.clampid;

					if (H_clamp.terminal_regist_date.length) {
						msg += "(";
						var A_match = Array();
						preg_match("/([0-9]+)-([0-9]+)-([0-9]+)/", H_clamp.terminal_regist_date, A_match);
						msg += A_match[1] + "\u5E74" + A_match[2] + "\u6708" + A_match[3] + "\u65E5";
						msg += "\u306B\u4FE1\u983C\u7AEF\u672B\u767B\u9332\u6E08";
						msg += ")";
					}

					this.getOut().infoOut(msg + "\n");
				}

				var in = fgets(STDIN).trim();

				if ("q" === in || "Q" === in) {
					break;
				}

				var idx = in - 1;

				if (!(undefined !== A_clamp[idx])) {
					continue;
				}

				H_clamp = A_clamp[idx];

				if (H_clamp.terminal_regist_date.length) {
					A_match = Array();
					preg_match("/([0-9]+)-([0-9]+)-([0-9]+)/", H_clamp.terminal_regist_date, A_match);
					msg = "\u30AF\u30E9\u30F3\u30D7ID" + in + "\u306F";
					msg += A_match[1] + "\u5E74" + A_match[2] + "\u6708" + A_match[3] + "\u65E5";
					msg += "\u306B\u4FE1\u983C\u7AEF\u672B\u767B\u9332\u3092\u884C\u3063\u3066\u304A\u308A\u307E\u3059\u304C\u3001\u66F4\u65B0\u3057\u307E\u3059\u304B(y|n)";
					this.getOut().infoOut(msg + "\n");
					in = fgets(STDIN).trim();

					if ("y" !== in && "Y" !== in) {
						continue;
					}
				}

				try {
					this.doExecuteClamp(H_clamp);
				} catch (ex) {
					if (ex instanceof MtExcept) //Motion拡張例外はここで受ける、コンストラクターの例外など
						{
							console.log(ex);
						} else if (true) //一般的な例外はここで受ける、基本的には来ないはず
						{
							console.log(ex);
						}
				}
			}
		}

		this.set_ScriptEnd();
		throw die(0);
	}

	doExecuteClamp(H_clamp: {} | any[]) //モデルを作成する(clampidごとに新しいインスタンスを作る)
	//proxy関連の情報を設定から読み出す
	//クランプサイトにログインする
	//$rval = $O_model->loginClamp($H_clamp["clampid"], $H_clamp["clamppasswd"]);
	{
		var H_param = Array();

		if (this.O_setting.existsKey("PROXY") && this.O_setting.PROXY.length) {
			H_param.proxy_host = this.O_setting.PROXY;
		}

		if (this.O_setting.existsKey("PROXY_PORT") && this.O_setting.PROXY_PORT.length) {
			H_param.proxy_port = this.O_setting.PROXY_PORT;
		}

		if (this.O_setting.existsKey("PROXY_USER") && this.O_setting.PROXY_USER.length) {
			H_param.proxy_user = this.O_setting.PROXY_USER;
		}

		if (this.O_setting.existsKey("PROXY_PASSWORD") && this.O_setting.PROXY_PASSWORD.length) {
			H_param.proxy_password = this.O_setting.PROXY_PASSWORD;
		}

		var O_model = new DocomoTerminalRegistModel(H_param);
		this.getOut().infoOut("\u30ED\u30B0\u30A4\u30F3\u4E2D..." + "\n");
		var rval = O_model.loginClamp(H_clamp.clampid);

		if (!this.checkRval(rval)) {
			return;
		}

		if (DocomoTerminalRegistModel.RESULT_PRE == rval) //$msg = "このアカウントは二段階認証が有効になっていませんが、有効にしますか(y|n)";
			//			$this->getOut()->infoOut($msg . "\n");
			//			$in = trim(fgets(STDIN));
			//			if ("y" !== $in && "Y" !== $in) {
			//				return;
			//			}
			//			//二段階認証を開始する
			//			$this->getOut()->infoOut("二段階認証を開始中..." . "\n");
			//			$O_model->recreate();
			//			$rval = $O_model->beginRegist($H_clamp["clampid"], $H_clamp["clamppasswd"]);
			//			if ( ! $this->checkRval($rval)) {
			//				return;
			//			}
			//			$msg = "ワンタイムパスワードが送信されました。メールボックスを確認してください(数分かかることがあります)";
			//			$this->getOut()->infoOut($msg . "\n");
			//			$this->getOut()->infoOut("ワンタイムパスワードを入力してください(処理を中断するなら何も入力せず改行)" . "\n");
			//			$in = trim(fgets(STDIN));
			//			if ( ! strlen($in)) {
			//				return;
			//			}
			//			$this->getOut()->infoOut("ワンタイムパスワードを送信中..." . "\n");
			//			$rval = $O_model->endRegist($in);
			//			if ( ! $this->checkRval($rval)) {
			//				return;
			//			}
			//			//クランプサイトにログインしなおす
			//			$O_model->recreate();
			//			$this->getOut()->infoOut("ログイン中..." . "\n");
			//			$rval = $O_model->loginClamp($H_clamp["clampid"], $H_clamp["clamppasswd"]);
			//			if ( ! $this->checkRval($rval)) {
			//				return;
			//			}
			//			if (DocomoTerminalRegistModel::RESULT_PRE == $rval) {
			//				$this->getOut()->infoOut("このアカウントは二段階認証を有効にできません" . "\n");
			//				return;
			//			}
			{
				this.getOut().infoOut("\u5BFE\u8C61\u306E\u30A2\u30AB\u30A6\u30F3\u30C8\u306F\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u304C\u6709\u52B9\u306B\u306A\u3063\u3066\u3044\u306A\u3044\u305F\u3081\u7D42\u4E86\n");
				return;
			}

		var msg = "\u30EF\u30F3\u30BF\u30A4\u30E0\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9001\u4FE1\u3055\u308C\u307E\u3057\u305F\u3002\u30E1\u30FC\u30EB\u30DC\u30C3\u30AF\u30B9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044(\u6570\u5206\u304B\u304B\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059)";
		this.getOut().infoOut(msg + "\n");
		this.getOut().infoOut("\u30EF\u30F3\u30BF\u30A4\u30E0\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(\u51E6\u7406\u3092\u4E2D\u65AD\u3059\u308B\u306A\u3089\u4F55\u3082\u5165\u529B\u305B\u305A\u6539\u884C)" + "\n");
		var in = fgets(STDIN).trim();

		if (!in.length) {
			return;
		}

		this.getOut().infoOut("\u30EF\u30F3\u30BF\u30A4\u30E0\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u9001\u4FE1\u4E2D..." + "\n");
		var cookie = "";
		rval = O_model.getCookie(H_clamp.clamppasswd, in, cookie);

		if (!this.checkRval(rval)) {
			return;
		}

		this.O_table.updateCookie(H_clamp.pactid, H_clamp.carid, H_clamp.detailno, cookie);
		this.getOut().infoOut(H_clamp.clampid + "\u306E\u4FE1\u983C\u7AEF\u672B\u51E6\u7406\u304C\u51FA\u6765\u307E\u3057\u305F\uFF01\uFF01" + "\n\n");
	}

	checkRval(rval) {
		if (DocomoTerminalRegistModel.RESULT_CONNECT == rval) {
			this.getOut().infoOut("\u901A\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u6642\u9593\u3092\u304A\u3044\u3066\u518D\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044" + "\n");
			return false;
		}

		if (DocomoTerminalRegistModel.RESULT_FAIL == rval) {
			this.getOut().infoOut("\u30ED\u30B0\u30A4\u30F3\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002ID\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044" + "\n");
			return false;
		}

		if (DocomoTerminalRegistModel.RESULT_BADPASS == rval) {
			this.getOut().infoOut("\u30EF\u30F3\u30BF\u30A4\u30E0\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u9593\u9055\u3063\u3066\u3044\u307E\u3059\u3002\u6700\u521D\u304B\u3089\u51E6\u7406\u3092\u3084\u308A\u76F4\u3057\u3066\u304F\u3060\u3055\u3044" + "\n");
			return false;
		}

		return true;
	}

	__destruct() {
		super.__destruct();
	}

};