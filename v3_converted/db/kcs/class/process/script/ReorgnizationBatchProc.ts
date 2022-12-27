//ClampTaskの監視
//error_reporting(E_ALL|E_STRICT);

require("process/ProcessBaseBatch.php");

require("view/script/ReorgnizationBatchView.php");

require("model/ReorgnizationModel2.php");

require("MtTableUtil.php");

//部署のcsvの中身(通常版)
//ユーザー部署ID
//親部署
//部署名
//承認部署
//追加管理項目
//ユーザーcsv中身
//ユーザー名
//社員番号
//ログインID
//パスワード
//ユーザー部署ID
//メール
//言語
//権限区分
//標準のお知らせを受け取る
//重要なお知らせを受け取る
//価格表メールを受け取る
//申請・承認関連メール
//注文時販売店からのメール
//電話のcsv中身
//ユーザー部署ID
//社員コード
//ユーザー名
//ユーザー名
//追加管理項目
//
//__construct
//
//@author web
//@since 2017/12/14
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author web
//@since 2017/12/14
//
//@param array $H_param
//@access protected
//@return void
//
//
//readPostData
//部署データの読み込みと加工
//@author web
//@since 2018/01/23
//
//@param mixed $filename
//@access private
//@return void
//
//
//readUserData
//ユーザー読み込み
//@author web
//@since 2018/01/23
//
//@param mixed $filename
//@access private
//@return void
//
//
//readTelData
//ユーザー読み込み
//@author web
//@since 2018/01/23
//
//@param mixed $filename
//@access private
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2017/12/14
//
//@access public
//@return void
//
class ReorgnizationBatchProc extends ProcessBaseBatch {
	static POST_IDX_USERPOSTID = 0;
	static POST_IDX_USERPOSTID_PARENT = 1;
	static POST_IDX_POSTNAME = 2;
	static POST_IDX_USERPOSTID_RECOG = 3;
	static POST_IDX_COLUMN_DEF = 4;
	static USER_IDX_USERNAME = 0;
	static USER_IDX_EMPLOYEECODE = 1;
	static USER_IDX_LOGINID = 2;
	static USER_IDX_PASSWORD = 3;
	static USER_IDX_USERPOSTID = 4;
	static USER_IDX_MAIL = 5;
	static USER_IDX_LANGUAGE = 6;
	static USER_IDX_FUNC = 7;
	static USER_IDX_ACCEPTMAIL1 = 8;
	static USER_IDX_ACCEPTMAIL2 = 9;
	static USER_IDX_ACCEPTMAIL3 = 10;
	static USER_IDX_ACCEPTMAIL4 = 11;
	static USER_IDX_ACCEPTMAIL5 = 12;
	static TEL_IDX_USERPOSTID = 0;
	static TEL_IDX_EMPLOYEECODE = 1;
	static TEL_IDX_USERNAME = 2;
	static TEL_IDX_MAIL = 3;
	static TEL_IDX_COLUMN_DEF = 4;

	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //viewの作成
	//引数チェックエラー
	//固有ログディレクトリの作成取得(これは必要なさそうな気もする)
	//人事モデルの作成
	//部署データ読み込み
	//ユーザーデータ読み込み
	//電話読み込み
	//エラーあれば終わり・・
	{
		var O_view = new ReorgnizationView();

		if (O_view.checkArgError()) {
			throw die();
		}

		var pactid = O_view.getArg("pactid");
		var mode = O_view.getArg("mode");
		var ym = O_view.getArg("ym");

		if (is_null(ym)) {
			var tbno = "";
		} else {
			var tb_util = new MtTableUtil();
			tbno = tb_util.getTableNo(ym);

			if (tbno === false) {
				echo("-y\u306E\u6307\u5B9A\u3092\u898B\u76F4\u3057\u3066\u304F\u3060\u3055\u3044\n");
				throw die(0);
			}
		}

		this.set_Dirs(O_view.get_ScriptName());
		var filename = KCS_DIR + "/data/reorgnization/" + pactid + "/post.csv";
		var post_source = this.readPostData(filename);
		filename = KCS_DIR + "/data/reorgnization/" + pactid + "/user.csv";
		var user_source = this.readUserData(filename);
		filename = KCS_DIR + "/data/reorgnization/" + pactid + "/tel.csv";
		var tel_source = this.readTelData(filename);
		var O_reorg = new ReorgnizationModel2();
		O_reorg.initialize(pactid, Array(), tbno);
		var res = O_reorg.makeData(post_source, user_source, tel_source);

		if (res !== true) {
			for (var value of Object.values(res)) {
				echo(value + "\n");
			}

			throw die(0);
		}

		switch (mode) {
			case "update":
				res = O_reorg.outputUpdateTelInfo();

				if (res == 0) {
					echo("\u66F4\u65B0\u3059\u308B\u3082\u306E\u304C\u306A\u3044\u306E\u3067\u7D42\u308F\u308A\n");
					break;
				}

				res = O_reorg.getError();

				if (res.result) //エラーあるので終了
					//終わり
					{
						this.checkResult(res);
						echo("\u66F4\u65B0\u5931\u6557\n");
						break;
					}

				var stdin = undefined;

				while (1) {
					echo("\u5B9F\u884C\u3059\u308B?(y/n)\n");
					stdin = fgets(STDIN).trim();

					if (-1 !== ["y", "n"].indexOf(stdin)) {
						break;
					}
				}

				if (stdin == "n") {
					break;
				}

				res = O_reorg.update();

				if (!res.result) {
					this.checkResult(res);
					break;
				}

				echo("\u66F4\u65B0\u3057\u307E\u3057\u305F\n");
				break;

			case "test":
				res = O_reorg.outputUpdateTelInfo();
				break;

			default:
				res = undefined;
				break;
		}

		throw die(0);
	}

	checkResult(result) //エラーありますか・・
	{
		if (!result.result) {
			echo("\n");
			echo("\n");
			echo("!!----error----!!\n");
			{
				let _tmp_0 = result.error;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					echo(value + "\n");
				}
			}
			return false;
		}

		return true;
	}

	readPostData(filename) //ファイルの存在確認
	//エラーチェック
	{
		if (!file_exists(filename)) {
			return undefined;
		}

		var filedata = file(filename);

		if (filedata === false) {
			return undefined;
		}

		var source = Array();

		for (var line of Object.values(filedata)) //ユーザー部署ID
		//部署名
		//親部署
		//承認部署
		//追加部署情報
		//追加
		{
			var line = line.trim();
			line = line.split(",");
			var data = Array();
			data[ReorgnizationModel2.POST_IDX_USERPOSTID] = line[ReorgnizationBatchProc.POST_IDX_USERPOSTID];
			data[ReorgnizationModel2.POST_IDX_POSTNAME] = line[ReorgnizationBatchProc.POST_IDX_POSTNAME];
			data[ReorgnizationModel2.POST_IDX_USERPOSTID_PARENT] = line[ReorgnizationBatchProc.POST_IDX_USERPOSTID_PARENT];
			data[ReorgnizationModel2.POST_IDX_USERPOSTID_RECOG] = line[ReorgnizationBatchProc.POST_IDX_USERPOSTID_RECOG];
			data[ReorgnizationModel2.POST_IDX_COLUMN_DEF] = line[ReorgnizationBatchProc.POST_IDX_COLUMN_DEF];
			source.push(data);
		}

		if (!source) {
			return undefined;
		}

		return source;
	}

	readUserData(filename) //ファイルの存在確認
	//エラーチェック
	{
		if (!file_exists(filename)) {
			return undefined;
		}

		var filedata = file(filename);

		if (filedata === false) {
			return undefined;
		}

		var source = Array();

		for (var line of Object.values(filedata)) //ユーザー名
		//社員番号
		//ログインID
		//パスワード
		//ユーザー部署ID
		//メール
		//言語
		//権限区分
		//標準のお知らせを受け取る
		//重要なお知らせを受け取る
		//価格表メールを受け取る
		//申請・承認関連メール
		//注文販売店を受け取る
		//追加
		{
			var line = line.trim();
			line = line.split(",");
			var data = Array();
			data[ReorgnizationModel2.USER_IDX_USERNAME] = line[ReorgnizationBatchProc.USER_IDX_USERNAME];
			data[ReorgnizationModel2.USER_IDX_EMPLOYEECODE] = line[ReorgnizationBatchProc.USER_IDX_EMPLOYEECODE];
			data[ReorgnizationModel2.USER_IDX_LOGINID] = line[ReorgnizationBatchProc.USER_IDX_LOGINID];
			data[ReorgnizationModel2.USER_IDX_PASSWORD] = line[ReorgnizationBatchProc.USER_IDX_PASSWORD];
			data[ReorgnizationModel2.USER_IDX_USERPOSTID] = line[ReorgnizationBatchProc.USER_IDX_USERPOSTID];
			data[ReorgnizationModel2.USER_IDX_MAIL] = line[ReorgnizationBatchProc.USER_IDX_MAIL];
			data[ReorgnizationModel2.USER_IDX_LANGUAGE] = line[ReorgnizationBatchProc.USER_IDX_LANGUAGE];
			data[ReorgnizationModel2.USER_IDX_FUNC] = line[ReorgnizationBatchProc.USER_IDX_FUNC];
			data[ReorgnizationModel2.USER_IDX_ACCEPTMAIL1] = line[ReorgnizationBatchProc.USER_IDX_ACCEPTMAIL1];
			data[ReorgnizationModel2.USER_IDX_ACCEPTMAIL2] = line[ReorgnizationBatchProc.USER_IDX_ACCEPTMAIL2];
			data[ReorgnizationModel2.USER_IDX_ACCEPTMAIL3] = line[ReorgnizationBatchProc.USER_IDX_ACCEPTMAIL3];
			data[ReorgnizationModel2.USER_IDX_ACCEPTMAIL4] = line[ReorgnizationBatchProc.USER_IDX_ACCEPTMAIL4];
			data[ReorgnizationModel2.USER_IDX_ACCEPTMAIL5] = line[ReorgnizationBatchProc.USER_IDX_ACCEPTMAIL5];
			source.push(data);
		}

		if (!source) {
			return undefined;
		}

		return source;
	}

	readTelData(filename) //ファイルの存在確認
	//エラーチェック
	{
		if (!file_exists(filename)) {
			return undefined;
		}

		var filedata = file(filename);

		if (filedata === false) {
			return undefined;
		}

		var source = Array();

		for (var sort in filedata) //ユーザー部署ID
		//社員コード
		//ユーザー名
		//電話番号
		//電話番号
		//追加
		{
			var line = filedata[sort];
			var line = line.trim();
			line = line.split(",");
			var data = Array();
			data[ReorgnizationModel2.TEL_IDX_USERPOSTID] = line[ReorgnizationBatchProc.TEL_IDX_USERPOSTID];
			data[ReorgnizationModel2.TEL_IDX_EMPLOYEECODE] = line[ReorgnizationBatchProc.TEL_IDX_EMPLOYEECODE];
			data[ReorgnizationModel2.TEL_IDX_USERNAME] = line[ReorgnizationBatchProc.TEL_IDX_USERNAME];
			data[ReorgnizationModel2.TEL_IDX_MAIL] = line[ReorgnizationBatchProc.TEL_IDX_MAIL];
			data[ReorgnizationModel2.TEL_IDX_COLUMN_DEF] = line[ReorgnizationBatchProc.TEL_IDX_COLUMN_DEF];
			data[ReorgnizationModel2.TEL_IDX_SORT] = sort;
			source.push(data);
		}

		if (!source) {
			return undefined;
		}

		return source;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};