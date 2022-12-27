//
//Felicaカード登録Proccess
//
//更新履歴：<br>
//2010/04/27 宮澤龍彦 作成
//
//@package Clouds
//@subpackage Proccess
//@author miyazawa
//@since 2010/04/27
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//Felicaカード登録Proccess
//
//@package ICCard
//@subpackage Proccess
//@author miyazawa
//@since 2010/04/27
//@filesource
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/Clouds/FelicaAddModel.php");

require("view/Clouds/FelicaAddView.php");

//
//ディレクトリ名
//
//
//コンストラクター
//
//@author miyazawa
//@since 2010/04/27
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのViewオブジェクト取得
//
//@author miyazawa
//@since 2010/04/27
//
//@access protected
//@return void
//@uses FelicaAddView
//
//
//
//各ページのModelオブジェクト取得
//
//@author miyazawa
//@since 2010/04/27
//
//@author miyazawa
//@since 2010/04/27
//@access protected
//@return void
//
//
//
//プロセス処理のメイン<br>
//
//viewオブジェクトの生成 <br>
//ログインチェック <br>
//セッション情報取得（グローバル） <br>
//管理情報用の関数集のオブジェクト生成 <br>
//modelオブジェクト生成 <br>
//セッション情報取得（ローカル） <br>
//パラメータのエラーチェック <br>
//権限一覧取得 <br>
//表示するデータ取得 <br>
//Smartyによる表示 <br>
//
//@author miyazawa
//@since 2010/04/27
//
//@param array $H_param
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class FelicaAddProc extends ProcessBaseHtml {
	static PUB = "/Clouds";

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("felica");
	}

	get_View() {
		return new FelicaAddView();
	}

	get_Model() {
		return new FelicaAddModel();
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//modelオブジェクトの生成
	//$O_model->testLog(0);	// 開発用●
	//CGIパラメータを配列に入れる
	//$O_model->testLog(1);
	//パラメータのエラーチェック
	//$O_model->testLog(2);
	//パラメータの配列を持ってくる
	//$O_model->testLog(3);
	//社員番号登録チェック
	//$O_model->testLog(4);
	//カードID重複チェック
	//$O_model->testLog(5);
	//トランザクション開始
	//$O_model->testLog(6);
	//エラー文字列
	//KCS Motionにカード仮登録
	//$O_model->testLog(7);
	//仮登録に失敗したらエラー返す
	//コミット
	{
		var O_view = this.get_View();
		var O_model = this.get_Model();
		O_view.checkCGIParam();
		O_view.checkParamError();
		var H_view = O_view.get_View();
		O_model.checkEmployee(H_view);
		O_model.checkDuplicate(H_view);
		this.get_DB().beginTransaction();
		var err_str = "";
		var tmp_result = O_model.addCardTemp(H_view);

		if (true != tmp_result && true == Array.isArray(tmp_result)) //ロールバック
			//エラーのパラメータ返す
			//仮登録に成功したらクラウズに接続
			{
				for (var key in tmp_result) {
					var val = tmp_result[key];
					err_str += key + "=" + val + "&";
				}

				this.get_DB().rollback();
				echo(err_str);
				throw die();
			} else //クラウズに通信
			//クラウズ登録成功
			{
				var c_res = O_view.sendToClouds(this.getSetting().CARDADD_URL, this.getSetting().API_KEY, H_view);

				if (200 == c_res.code) //KCS Motionに本登録
					//成功のパラメータ返す
					//クラウズ登録失敗
					{
						var result = O_model.addCard(H_view);
						echo("r=0");
					} else //ロールバック
					//エラーのパラメータ返す
					//KCSMotionのエラーログ 20100914miya
					{
						this.get_DB().rollback();

						if (403 === c_res.code) {
							msg += "\u8A8D\u8A3C\u5931\u6557";
						} else if (409 === c_res.code) {
							msg += "\u30AB\u30FC\u30C9ID\u91CD\u8907";
						} else if (412 === c_res.code) {
							msg += "\u30D1\u30E9\u30E1\u30FC\u30BF\u4E0D\u6B63";
						} else if (413 === c_res.code) {
							msg += "\u30D1\u30E9\u30E1\u30FC\u30BF\u6587\u5B57\u6570\u8D85\u904E";
						} else if (500 === c_res.code) {
							msg += "\u30B5\u30FC\u30D0\u5185\u90E8\u30A8\u30E9\u30FC";
						} else if (999 === c_res.code) {
							msg += "\u30B5\u30FC\u30D0\u63A5\u7D9A\u5931\u6557";
						} else {
							msg += "\u4E0D\u660E\u306A\u30A8\u30E9\u30FC";
						}

						err_str = "r=1&e=" + String(c_res.code + "&m=" + mb_convert_encoding(msg, "UTF-8"));
						echo(err_str);
						this.errorOut(11, "Felica\u30AB\u30FC\u30C9\u767B\u9332\u5931\u6557\uFF1A" + String(c_res.code + " " + msg), 0);
						throw die();
					}
			}

		this.get_DB().commit();
	}

	__destruct() {
		super.__destruct();
	}

};