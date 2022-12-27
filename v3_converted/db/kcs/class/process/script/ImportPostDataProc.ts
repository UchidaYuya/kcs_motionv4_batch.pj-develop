//
//部署データ取込処理 （Process）
//
//更新履歴：<br>
//2012/02/14/ 宝子山浩平 作成
//
//ImportPostDataProc
//
//@package script
//@subpackage Process
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2012/02/17
//@uses MtTableUtil
//@uses PactModel
//@uses ProcessBaseBatch
//@uses ImportPostDataView
//@uses ImportPostDataModel
//
//
//error_reporting(E_ALL|E_STRICT);

require("MtTableUtil.php");

require("model/PactModel.php");

require("process/ProcessBaseBatch.php");

require("view/script/ImportPostDataView.php");

require("model/script/ImportPostDataModel.php");

//処理が終了した pactid を格納するための配列
//
//コンストラクタ
//
//@author houshiyama
//@since 2012/02/17
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2012/02/17
//
//@param array $H_param
//@access protected
//@return void
//
//
//初期処理
//
//@author
//@since 2012/02/17
//
//@access protected
//@return void
//
//
//終了処理
//
//@author
//@since 2012/02/17
//
//@access protected
//@return void
//
//
//取込処理
//
//@author web
//@since 2012/03/01
//
//@param mixed $pactid
//@param mixed $date
//@param mixed $data
//@access protected
//@return void
//
//
//ファイルのデータを整形し配列に
//
//@author web
//@since 2012/02/29
//
//@param mixed $pactid
//@param mixed $contents
//@access protected
//@return void
//
//
//ファイルの正当性チェック
//
//@author web
//@since 2012/02/29
//
//@param mixed $contents
//@access protected
//@return void
//
//
//PactModel取得
//
//@author
//@since 2012/02/17
//
//@access protected
//@return void
//
//
//データディレクトリ取得
//
//@author
//@since 2012/02/17
//
//@access protected
//@return void
//
//
//データディレクトリ取得
//
//@author web
//@since 2012/02/27
//
//@param mixed $pactid
//@access protected
//@return void
//
//
//処理対象のpactid取得
//
//@author
//@since 2012/02/17
//
//@param mixed $dir
//@param mixed $pactid
//@access protected
//@return void
//
//
//ステータスログの書き込み
//
//@author web
//@since 2012/02/28
//
//@access protected
//@return void
//
//
//更新対象部署のファイル内の情報取得
//
//@author web
//@since 2012/02/29
//
//@param mixed $contents
//@param mixed $list
//@access protected
//@return void
//
//
//削除対象からプロテクトを除く
//
//@author web
//@since 2012/03/08
//
//@param mixed $data
//@param mixed $protect
//@access protected
//@return void
//
//
//ファイル移動処理
//
//@author web
//@since 2012/03/02
//
//@param mixed $pactid
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2012/02/17
//
//@access public
//@return void
//
class ImportPostDataProc extends ProcessBaseBatch {
	static SCRIPTNAME = "ImportPostData";
	static DATAFILE = "post.csv";
	static PROTECTFILE = "protect.txt";

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//Viewの生成
	//Modelの生成
	{
		super(H_param);
		this._pactDone = Array();
		this.getSetting().loadConfig("postdata");
		this._view = new ImportPostDataView();
		this._model = new ImportPostDataModel(this.get_MtScriptAmbient());
	}

	doExecute(H_param: {} | any[] = Array()) {
		try //初期処理
		//エラーがあったらメールを飛ばす
		//バッチ自体のステータスを書きこむ
		{
			this._preExecute();

			var status = "ok";

			for (var pactid of Object.values(this._pactids)) {
				this.infoOut(pactid + "\t\u90E8\u7F72\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 0);

				try //データファイル取得
				//データファイルの中身取得
				//データファイルの正当性チェック
				{
					var files = this._getDataFile(pactid);

					var datafile = files[0];
					var protectfile = files[1];

					var contents = this._model.getDataFileContents(datafile);

					var data = this._toArrayFileContents(pactid, contents);

					data.push(this._model.getProtectFileContents(protectfile));

					var res = this._checkContents(data[0]);

					if ("string" === typeof res) {
						throw new Error(res);
					}

					this._model.begin();

					for (var i = 0; i <= this._monthNum; i++) //対象テーブルセット
					{
						if (i == 0) {
							var trgDate = this._trgDate;
						} else {
							trgDate = date("Ym", mktime(0, 0, 0, date("m") - i, date("d"), date("Y")));
						}

						this._model.setTargetTables(trgDate);

						this._import(pactid, trgDate, data);
					}

					this._moveDataFile(pactid);

					this._model.commit();
				} catch (e) {
					if (this._model.inTransaction()) {
						this._model.rollback();
					}

					this._writeStatusLog(e.getMessage());

					this.infoOut(e.getMessage(), 0);
					status = "ng";
				}

				this.infoOut(pactid + "\t\u90E8\u7F72\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 0);
			}

			this.getOut().flushMessage();

			this._writeStatusLog(pactid + "\tstatus\t" + status);
		} catch (e) //エラーがあったらメールを飛ばす
		{
			this.errorOut(1000, e.getMessage(), 0, "", "");
		}

		this._postExecute();
	}

	_preExecute() //固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	//引数の値をメンバーに
	//データディレクトリを取得
	//処理する契約ＩＤを取得する
	//statuslogセット
	{
		this.set_Dirs(this._view.get_ScriptName());
		this.infoOut("\u90E8\u7F72\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u958B\u59CB\n", 1);
		this.lockProcess(this._view.get_ScriptName());
		this._pactId = this._view.get_HArgv("-p");
		this._trgDate = date("Ym");
		this._monthNum = this._view.get_HArgv("-n");

		if (this._monthNum > 24) {
			throw new Error("-n \u306F0\u304B\u308924\u306E\u9593\u306E\u6574\u6570\u3067\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\n");
		}

		var str = "php " + ImportPostDataProc.SCRIPTNAME + " -p=" + this._pactId + " -n=" + this._monthNum;

		if (this._view.issetHArgv("-l")) {
			this._statusLog = this._view.get_HArgv("-l");

			if (!(this._fp = fopen(this._statusLog, "w"))) {
				throw new Error("\u30ED\u30B0\u30D5\u30A1\u30A4\u30EB\u304C\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F\n");
			}

			str += " -l=" + this._statusLog;
		}

		this.infoOut(str + "\n", 0);
		this._dataDir = this._getDataDir(this._trgDate);
		this._pactids = this._getPactList(this._dataDir, this._pactId);

		this._model.setStatusLog(this._fp);
	}

	_postExecute() //終了していないトランザクションがあればロールバック
	//ログファイルを閉じる
	{
		if (this._model.inTransaction()) {
			this._model.rollback();
		}

		this.unLockProcess(this._view.get_ScriptName());

		if (this._view.issetHArgv("-l")) {
			fclose(this._fp);
		}

		this.set_ScriptEnd();
		this.infoOut("\u90E8\u7F72\u30C7\u30FC\u30BF\u30A4\u30F3\u30DD\u30FC\u30C8\u7D42\u4E86\n", 1);
	}

	_import(pactid, date, data) //データファイルの中身取得
	//DBに登録済みの部署一覧取得（rootと不明部署以外）
	//DBから削除対象になる部署一覧取得（protectのものは除外）
	//DBに追加対象になる部署一覧取得
	//DBに更新対象になる部署一覧取得
	//不明部署取得（なければ作成）
	//部署削除
	{
		var unknownPostid;
		var contents = data[0];
		var fileUserPostids = data[1];
		var protectPostids = data[2];

		var dbUserPostids = this._model.getUserPostids(pactid);

		var deletePostids = this._model.getDifferencePosts(fileUserPostids, dbUserPostids);

		deletePostids = this._getDeletePostids(deletePostids, protectPostids);

		var insertPostids = this._model.getDifferencePosts(dbUserPostids, fileUserPostids);

		var modifyPostids = this._model.getDifferencePosts(dbUserPostids, fileUserPostids, false);

		if (!(unknownPostid = this._model.checkUnknownPostExists(pactid))) {
			unknownPostid = this._model.makeUnknownPost(pactid);
		}

		var return = "";

		if (!!deletePostids) {
			this.infoOut("\u90E8\u7F72\u524A\u9664\u51E6\u7406\u958B\u59CB\n", 0);
			data = this._model.getTargetPostData(pactid, deletePostids);

			this._model.prepareDeletePosts(data, unknownPostid);

			var deleteReturn = this._model.deletePosts(data);

			if ("string" === typeof deleteReturn) {
				this.infoOut("\u90E8\u7F72\u524A\u9664\u51E6\u7406\u30A8\u30E9\u30FC\n", 0);
				return += deleteReturn;
				throw new Error(return);
			}
		}

		if (!!insertPostids) {
			this.infoOut("\u90E8\u7F72\u8FFD\u52A0\u51E6\u7406\u958B\u59CB\n", 0);
			data = this._getTargetPostData(contents, insertPostids);

			var insertReturn = this._model.insertPosts(data);

			if ("string" === typeof insertReturn) {
				this.infoOut("\u90E8\u7F72\u8FFD\u52A0\u51E6\u7406\u30A8\u30E9\u30FC\n", 0);
				return += insertReturn;
				throw new Error(return);
			}
		}

		if (!!modifyPostids) {
			this.infoOut("\u90E8\u7F72\u66F4\u65B0\u51E6\u7406\u958B\u59CB\n", 0);
			data = this._getTargetPostData(contents, modifyPostids);

			var modifyReturn = this._model.modifyPosts(data);

			if ("string" === typeof modifyReturn) {
				this.infoOut("\u90E8\u7F72\u66F4\u65B0\u51E6\u7406\u30A8\u30E9\u30FC\n", 0);
				return += modifyReturn;
				throw new Error(return);
			}
		}

		this.infoOut("\u90E8\u7F72\u30C4\u30EA\u30FC\u66F4\u65B0\u51E6\u7406\u958B\u59CB\n", 0);
		return = this._model.rebuildPostRelation(contents, protectPostids);

		if ("string" === typeof return) {
			this.infoOut("\u90E8\u7F72\u30C4\u30EA\u30FC\u66F4\u65B0\u51E6\u7406\u30A8\u30E9\u30FC\n", 0);
			throw new Error(return);
		}

		if (date == date("Ym")) //承認先部署更新
			{
				return = "";
				this.infoOut("\u627F\u8A8D\u30C4\u30EA\u30FC\u66F4\u65B0\u51E6\u7406\u958B\u59CB\n", 0);

				var returnRecog = this._model.rebuildRecognize(contents, unknownPostid);

				if ("string" === typeof returnRecog) {
					this.infoOut("\u627F\u8A8D\u30C4\u30EA\u30FC\u66F4\u65B0\u51E6\u7406\u30A8\u30E9\u30FC\n", 0);
					return += returnRecog;
					throw new Error(return);
				}

				this.infoOut("\u30B7\u30E7\u30C3\u30D7\u60C5\u5831\u66F4\u65B0\u51E6\u7406\u958B\u59CB\n", 0);

				var returnShop = this._model.rebuildShopRelation(contents);

				if ("string" === typeof returnShop) {
					this.infoOut("\u30B7\u30E7\u30C3\u30D7\u60C5\u5831\u66F4\u65B0\u51E6\u7406\u30A8\u30E9\u30FC\n", 0);
					return += returnShop;
					throw new Error(return);
				}
			}

		return true;
	}

	_toArrayFileContents(pactid, contents) {
		var lines = contents.split("\n");
		var data1 = Array();
		var data2 = Array();

		for (var i = 1; i < lines.length; i++) {
			var tmp = lines[i].split(",");

			if (tmp[0] != "") {
				var line = Array();
				line.pactid = pactid;
				line.userpostid = trim(tmp[0], "\"");
				line.userpostid_parent = trim(tmp[1], "\"");
				line.postname = trim(tmp[2], "\"");
				line.level = trim(tmp[3], "\"");
				line.recogpostid = trim(tmp[4], "\"");
				line.shopinfo = trim(tmp[5], "\"");

				if (!(-1 !== data2.indexOf(trim(tmp[0], "\"")))) {
					data2.push(trim(tmp[0], "\""));
				}

				data1.push(line);
			}
		}

		return [data1, data2];
	}

	_checkContents(contents) {
		var mess = "";

		for (var i = 0; i < contents.length; i++) {
			if (contents[i].userpostid == "") {
				mess += contents[i].pactid + "\t" + i + "\u884C\u76EE\tuserpostid\u304C\u7A7A\u3067\u3059\n";
				continue;
			}

			if (contents[i].userpostid_parent == "" && contents[i].level != "1") {
				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\tuserpostid_parent\u304C\u7A7A\u3067\u3059\n";
				continue;
			}

			if (contents[i].postname == "") {
				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\tpostname\u304C\u7A7A\u3067\u3059\n";
				continue;
			}

			if (contents[i].level == "") {
				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\tlevel\u304C\u7A7A\u3067\u3059\n";
				continue;
			}

			if (Math.round(contents[i].level) > 1) {
				for (var row of Object.values(contents)) {
					if (row.userpostid == contents[i].userpostid_parent && row.level == Math.round(contents[i].level) - 1) {
						continue;
					}
				}

				mess += contents[i].pactid + "\t" + contents[i].userpostid + "\t\u89AA\u90E8\u7F72\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\n";
				continue;
			} else {}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	_getPactModel() {
		if (!this._pactModel instanceof PactModel) {
			this._pactModel = new PactModel();
		}

		return this._pactModel;
	}

	_getDataDir(date) //データディレクトリを取得
	//データディレクトリチェック（スクリプト終了）
	{
		var dataDir = this._model.getDataDir(date);

		if (this.isDirCheck(dataDir, "rw") == false) {
			throw new Error(this.getSetting().POSTDATA + "\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + dataDir + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
		}

		return dataDir;
	}

	_getDataFile(pactid) {
		var trgFile = this._dataDir + pactid + "/" + ImportPostDataProc.DATAFILE;

		if (!is_file(trgFile)) {
			throw new Error(this.getSetting().POSTDATA + "\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + trgFile + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
		}

		var protectFile = this._dataDir + pactid + "/" + ImportPostDataProc.PROTECTFILE;

		if (!is_file(protectFile)) {
			this.infoOut(this.getSetting().POSTDATA + "\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\uFF08" + protectFile + "\uFF09\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n", 0);
		}

		return [trgFile, protectFile];
	}

	_getPactList(dir, pactid) //処理する契約ＩＤを取得する
	//処理する契約ＩＤが１件もない場合（スクリプト終了）
	{
		var pactids = super.getPactList(dir, pactid);
		pactids.sort();

		if (0 == pactids.length) {
			throw new Error("\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
		}

		return pactids;
	}

	_writeStatusLog(mess) {
		if (this._view.issetHArgv("-l")) {
			fwrite(this._fp, mess);
		}
	}

	_getTargetPostData(contents, list) {
		var data = Array();

		for (var row of Object.values(contents)) {
			if (-1 !== list.indexOf(row.userpostid)) {
				data.push(row);
			}
		}

		return data;
	}

	_getDeletePostids(data, protect) {
		return array_diff(data, protect);
	}

	_moveDataFile(pactid) {
		var finDir = this._dataDir + pactid + "/fin/";

		if (!is_dir(finDir)) {
			if (!mkdir(finDir)) {
				throw new Error(finDir + " \u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3092\u4F5C\u6210\u51FA\u6765\u307E\u305B\u3093\u3067\u3057\u305F\n");
			}
		}

		var oldFiles = this._getDataFile(pactid);

		for (var oldFile of Object.values(oldFiles)) {
			if (is_file(oldFile)) {
				var res;
				var newFile = finDir + basename(oldFile) + date("YmdHis");

				if (!(res = rename(oldFile, newFile))) {
					throw new Error("\u30C7\u30FC\u30BF\u30D5\u30A1\u30A4\u30EB\u306E\u79FB\u52D5\u304C\u51FA\u6765\u307E\u305B\u3093\u3067\u3057\u305F\n");
				}
			}
		}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};