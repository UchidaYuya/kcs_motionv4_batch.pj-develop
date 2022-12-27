//ClampTaskの監視
//error_reporting(E_ALL|E_STRICT);

require("process/ProcessBaseBatch.php");

require("view/script/ReorgnizationView.php");

require("model/ReorgnizationModel.php");

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
//writePersonnel
//データの反映するぽよ
//@author web
//@since 2018/02/21
//
//@param mixed $pactid
//@access private
//@return void
//
//
//readPersonnel
//指定されたpactidにてデータの取込を行う
//@author web
//@since 2018/02/21
//
//@param mixed $pactid
//@access private
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
class ReorgnizationProc extends ProcessBaseBatch {
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
	//スクリプトの二重起動防止ロック
	//$this->lockProcess($O_view->get_ScriptName());
	//固有ログディレクトリの作成取得(これは必要なさそうな気もする)
	{
		var O_view = new ReorgnizationView();
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

		switch (mode) {
			case "read":
				this.readPersonnel(pactid, tbno);
				break;

			case "reorg":
				this.execReorganization(pactid, undefined, tbno);
				break;

			case "reorg2":
				if (this.readPersonnel(pactid, tbno)) {
					this.execReorganization(pactid, undefined, tbno);
				}

				break;

			default:
				echo("\u6709\u52B9\u3067\u306F\u306A\u3044\u30E2\u30FC\u30C9(" + mode + ")");
				break;
		}

		throw die(0);
	}

	execReorganization(pactid, id = undefined, ym = undefined) ////	idがない場合は最新のデータを反映するようにした
	//		if( is_null( $id ) ){
	//			echo "-idを指定してください";
	//			return false;		
	//		}
	//人事モデルの作成
	//反映する
	//エラー表示
	{
		var O_temp = new ReorgnizationModel("");
		var res = O_temp.execReorganization(pactid, undefined, ym);

		if (!res.result) {
			{
				let _tmp_0 = res.error;

				for (var key in _tmp_0) {
					var value = _tmp_0[key];
					echo(value + "\n");
				}
			}
			this.infoOut("\u4EEE\u90E8\u7F72\u53CD\u6620\u5931\u6557\n", 1);
			return false;
		} else {
			this.infoOut("\u4EEE\u90E8\u7F72\u53CD\u6620\u7D42\u308F\u308A\n", 1);
		}

		return true;
	}

	readPersonnel(pactid, tbno) //人事モデルの作成
	//部署データ読み込み
	//エラー表示
	{
		var O_temp = new ReorgnizationModel("");
		var filename = KCS_DIR + "/data/reorgnization/" + pactid + "/post.csv";
		var post_source = this.readPostData(filename);

		if (post_source === false) {
			this.infoOut(filename + "\u304C\u306A\u3044\u3067\u3059\n", 1);
			return false;
		}

		filename = KCS_DIR + "/data/reorgnization/" + pactid + "/user.csv";
		var user_source = this.readUserData(filename);

		if (user_source === false) {
			this.infoOut(filename + "\u304C\u306A\u3044\u3067\u3059\n", 1);
			return false;
		}

		filename = KCS_DIR + "/data/reorgnization/" + pactid + "/tel.csv";
		var tel_source = this.readTelData(filename);

		if (tel_source === false) {
			this.infoOut(filename + "\u304C\u306A\u3044\u3067\u3059\n", 1);
			return false;
		}

		var res = O_temp.insertPersonnel(pactid, post_source, user_source, tel_source, tbno);

		if (!res.result) {
			{
				let _tmp_1 = res.error;

				for (var key in _tmp_1) {
					var value = _tmp_1[key];
					echo(value + "\n");
				}
			}
			this.infoOut("\u4EEE\u90E8\u7F72\u767B\u9332\u5931\u6557\n", 1);
			return false;
		}

		this.infoOut("\u4EEE\u90E8\u7F72\u767B\u9332\u7D42\u308F\u308A(id=" + res.id + ")\n", 1);
		return true;
	}

	readPostData(filename) //ファイルの存在確認
	//エラーチェック
	{
		if (!file_exists(filename)) {
			return false;
		}

		var filedata = file(filename);

		if (filedata === false) {
			return false;
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
			data[ReorgnizationModel.POST_IDX_USERPOSTID] = line[ReorgnizationProc.POST_IDX_USERPOSTID];
			data[ReorgnizationModel.POST_IDX_POSTNAME] = line[ReorgnizationProc.POST_IDX_POSTNAME];
			data[ReorgnizationModel.POST_IDX_USERPOSTID_PARENT] = line[ReorgnizationProc.POST_IDX_USERPOSTID_PARENT];
			data[ReorgnizationModel.POST_IDX_USERPOSTID_RECOG] = line[ReorgnizationProc.POST_IDX_USERPOSTID_RECOG];
			data[ReorgnizationModel.POST_IDX_COLUMN_DEF] = line[ReorgnizationProc.POST_IDX_COLUMN_DEF];
			source.push(data);
		}

		return source;
	}

	readUserData(filename) //ファイルの存在確認
	//エラーチェック
	{
		if (!file_exists(filename)) {
			return false;
		}

		var filedata = file(filename);

		if (filedata === false) {
			return false;
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
			data[ReorgnizationModel.USER_IDX_USERNAME] = line[ReorgnizationProc.USER_IDX_USERNAME];
			data[ReorgnizationModel.USER_IDX_EMPLOYEECODE] = line[ReorgnizationProc.USER_IDX_EMPLOYEECODE];
			data[ReorgnizationModel.USER_IDX_LOGINID] = line[ReorgnizationProc.USER_IDX_LOGINID];
			data[ReorgnizationModel.USER_IDX_PASSWORD] = line[ReorgnizationProc.USER_IDX_PASSWORD];
			data[ReorgnizationModel.USER_IDX_USERPOSTID] = line[ReorgnizationProc.USER_IDX_USERPOSTID];
			data[ReorgnizationModel.USER_IDX_MAIL] = line[ReorgnizationProc.USER_IDX_MAIL];
			data[ReorgnizationModel.USER_IDX_LANGUAGE] = line[ReorgnizationProc.USER_IDX_LANGUAGE];
			data[ReorgnizationModel.USER_IDX_FUNC] = line[ReorgnizationProc.USER_IDX_FUNC];
			data[ReorgnizationModel.USER_IDX_ACCEPTMAIL1] = line[ReorgnizationProc.USER_IDX_ACCEPTMAIL1];
			data[ReorgnizationModel.USER_IDX_ACCEPTMAIL2] = line[ReorgnizationProc.USER_IDX_ACCEPTMAIL2];
			data[ReorgnizationModel.USER_IDX_ACCEPTMAIL3] = line[ReorgnizationProc.USER_IDX_ACCEPTMAIL3];
			data[ReorgnizationModel.USER_IDX_ACCEPTMAIL4] = line[ReorgnizationProc.USER_IDX_ACCEPTMAIL4];
			data[ReorgnizationModel.USER_IDX_ACCEPTMAIL5] = line[ReorgnizationProc.USER_IDX_ACCEPTMAIL5];
			source.push(data);
		}

		return source;
	}

	readTelData(filename) //ファイルの存在確認
	//エラーチェック
	{
		if (!file_exists(filename)) {
			return false;
		}

		var filedata = file(filename);

		if (filedata === false) {
			return false;
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
			data[ReorgnizationModel.TEL_IDX_USERPOSTID] = line[ReorgnizationProc.TEL_IDX_USERPOSTID];
			data[ReorgnizationModel.TEL_IDX_EMPLOYEECODE] = line[ReorgnizationProc.TEL_IDX_EMPLOYEECODE];
			data[ReorgnizationModel.TEL_IDX_USERNAME] = line[ReorgnizationProc.TEL_IDX_USERNAME];
			data[ReorgnizationModel.TEL_IDX_MAIL] = line[ReorgnizationProc.TEL_IDX_MAIL];
			data[ReorgnizationModel.TEL_IDX_COLUMN_DEF] = line[ReorgnizationProc.TEL_IDX_COLUMN_DEF];
			data[ReorgnizationModel.TEL_IDX_SORT] = sort;
			source.push(data);
		}

		return source;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};