//
//ポイント調整　インポート(process)
//
//更新履歴：<br>
//2008/03/05 石崎公久 作成
//
//@uses ProcessBaseBatch
//@package SUO
//@subpackage Process
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/05
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ポイント調整　インポート(process)
//
//@uses ProcessBaseBatch
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/05
//

require("process/ProcessBaseBatch.php");

require("model/script/TweakPointImportModel.php");

require("view/script/TweakPointImportView.php");

require("MtScriptAmbient.php");

//
//インポートプロセス用Viewオブジェクト
//
//@var TweakPointImportView
//@access protected
//
//
//インポートプロセス用Modelオブジェクト
//
//@var TweakPointImportModel
//@access protected
//
//
//データディレクトリまでのパス
//
//@var text
//@access protected
//
//
//顧客IDの一覧を入れる
//
//@var mixed
//@access protected
//
//
//実行中のスクリプト固有のログディレクトリ
//
//@var text
//@access protected
//
//
//コンストラクター
//
//@author ishizaki
//@since 2008/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//@author ishizaki
//@since 2008/03/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//mergePointHash
//
//@author ishizaki
//@since 2008/04/28
//
//@param mixed $pactid
//@param mixed $H_point
//@param mixed $H_allpoint
//@param mixed $H_risepoint
//@access private
//@return void
//
//
//インポートファイルのパスを作成
//
//@author ishizaki
//@since 2008/03/18
//
//@param integer $pactid
//@param String $setfile
//@access protected
//@return void
//
//
//ポイントをインポートしハッシュにして返す
//
//１．インポートファイルの存在確認
//２．インポートファイルの文字コードチェック（未実装）
//３．インポートファイルのフォーマット確認
//４．インポートファイルのデータをハッシュ化して返す
//
//@author ishizaki
//@since 2008/03/18
//
//@param integer $pactid
//@param String $import_file
//@access protected
//@return array
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
class TweakPointImport extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //view の生成
	//引数確認の処理が終わっている
	//model作成
	//データディレクトリの取得
	{
		super(H_param);
		this.getSetting().loadConfig("SUO");
		this.O_View = new TweakPointImportView();
		this.O_Model = new TweakPointImportModel(this.get_MtScriptAmbient());
		this.DataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + this.O_View.get_HArgv("-y") + this.getSetting().suo_file_dir + this.getSetting().suo_point_dir;
	}

	doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//データディレクトリの存在確認
	//対象Pactidのリストが１件に満たない（つまり０件）の場合は、
	//エラー表示をして終了します。
	//pactidごとの処理
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		var post_level = this.getSetting().suo_cd_post_level + 1;
		this.set_Dirs(this.O_View.get_ScriptName());

		if (false == this.isDirCheck(this.DataDir)) {
			this.errorOut(1000, "SUO\u30DD\u30A4\u30F3\u30C8\u8ABF\u6574\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\uFF08" + this.DataDir + "\uFF09\u304C\u5B58\u5728\u3057\u306A\u3044\u3001\u53C8\u306F\u8AAD\u307F\u8FBC\u307F\u30FB\u66F8\u304D\u8FBC\u307F\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\n");
			throw die(-1);
		}

		this.A_Pact = this.getPactList(this.DataDir, this.O_View.get_HArgv("-p"));

		if (this.A_Pact.length < 1) {
			this.errorOut(0, "\u5BFE\u8C61\u3068\u306A\u308B\u9867\u5BA2\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002" + this.DataDir + " \u914D\u4E0B\u306B\u3001\u9867\u5BA2\u7528\u306E\u30D5\u30A9\u30EB\u30C0\u3092\u4F5C\u6210\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n");
			throw die(-1);
		}

		this.lockProcess(this.O_View.get_ScriptName());

		for (var pactid of Object.values(this.A_Pact)) //インポートファイルのパス
		//インポート処理 ハッシュで受け取り
		//false が返ってきたときは、ディレクトリにインポートファイルが存在しなかったので
		//処理を飛ばして次の pactid に移る
		//先月の累計ポイントの取得(枝番まで）
		//今月の獲得ポイントを取得（枝番まで）
		//ポイントのマージ（枝番まで）
		//インサートアップデート
		{
			this.infoOut("pactid:" + pactid + " \u51E6\u7406\u958B\u59CB\n");
			var import_file = this.makeImportPath(pactid, this.getSetting().suo_point_file);
			var H_point = this.importPoint(pactid, import_file);

			if (false === H_point) {
				continue;
			}

			H_point = this.O_Model.pointPostFromTel(H_point, pactid, this.O_View.get_HArgv("-y"));
			var H_allpoint = this.O_Model.selectAllPoint(pactid, this.O_View.get_HArgv("-y"), true);
			var H_risepoint = this.O_Model.selectRisePoint(pactid, this.O_View.get_HArgv("-y"), false);
			H_point = this.mergePointHash(pactid, H_point, H_allpoint, H_risepoint);
			var res = this.O_Model.insertUpdate(H_point);
		}

		this.unLockProcess(this.O_View.get_ScriptName());
		this.set_ScriptEnd();
	}

	mergePointHash(pactid, H_point, H_allpoint, H_risepoint) //処理するポストIDの一覧を作成する。
	//部署ごとの値を生成する
	{
		var H_tmp = Array();
		var A_postid_list = Array();
		var billdate = this.O_Model.yyyymmConcierge(this.O_View.get_HArgv("-y"), false);

		for (var telno in H_point) {
			var value = H_point[telno];
			A_postid_list.push(telno);
		}

		for (var telno in H_allpoint) {
			var value = H_allpoint[telno];
			A_postid_list.push(telno);
		}

		for (var telno in H_risepoint) {
			var value = H_risepoint[telno];
			A_postid_list.push(telno);
		}

		A_postid_list = array_unique(A_postid_list);
		A_postid_list.sort();

		for (var cnt = 0; cnt < A_postid_list.length; cnt++) //d_thispoint
		//au_thispoint
		//d_usepoint
		//au_usepoint
		//d_allpoint
		//au_allpoint
		{
			var postid = A_postid_list[cnt];
			H_tmp[cnt].pactid = pactid;
			H_tmp[cnt].postid = postid;
			H_tmp[cnt].billdate = billdate;

			if (false == (undefined !== H_risepoint[postid].d_thispoint)) {
				var d_thispoint = 0;
			} else {
				d_thispoint = H_risepoint[postid].d_thispoint;
			}

			if (false == (undefined !== H_risepoint[postid].au_thispoint)) {
				var au_thispoint = 0;
			} else {
				au_thispoint = H_risepoint[postid].au_thispoint;
			}

			if (false == (undefined !== H_point[postid].d_usepoint)) {
				var d_usepoint = 0;
			} else {
				d_usepoint = H_point[postid].d_usepoint;
			}

			if (false == (undefined !== H_point[postid].au_usepoint)) {
				var au_usepoint = 0;
			} else {
				au_usepoint = H_point[postid].au_usepoint;
			}

			if (false == (undefined !== H_allpoint[postid].d_allpoint)) {
				var d_allpoint = 0;
			} else {
				d_allpoint = H_allpoint[postid].d_allpoint;
			}

			if (false == (undefined !== H_allpoint[postid].au_allpoint)) {
				var au_allpoint = 0;
			} else {
				au_allpoint = H_allpoint[postid].au_allpoint;
			}

			H_tmp[cnt].d_thispoint = d_thispoint;
			H_tmp[cnt].au_thispoint = au_thispoint;
			H_tmp[cnt].d_usepoint = d_usepoint;
			H_tmp[cnt].au_usepoint = au_usepoint;
			H_tmp[cnt].d_allpoint = d_allpoint + d_thispoint - d_usepoint;
			H_tmp[cnt].au_allpoint = au_allpoint + au_thispoint - au_usepoint;
		}

		return H_tmp;
	}

	makeImportPath(pactid, setfile) {
		return this.DataDir + "/" + pactid + setfile;
	}

	importPoint(pactid, import_file) //インポートファイルの存在／読み込み／書き込み　権限確認
	{
		var check_result = this.isFileCheck(import_file);

		if ("nothing" === check_result) {
			this.infoOut("pactid " + pactid + ":" + import_file + " \u304C\u5B58\u5728\u3057\u306A\u304B\u3063\u305F\u306E\u3067\u6B21\u306E\u4F1A\u793E\u306E\u51E6\u7406\u306B\u79FB\u884C\u3057\u307E\u3059\u3002\n");
			return false;
		} else if ("diswrite" === check_result || "disread" === check_result) {
			this.errorOut(1000, "pactid " + pactid + ":" + import_file + " \u8AAD\u307F\u8FBC\u307F\u3001\u307E\u305F\u306F\u66F8\u304D\u8FBC\u307F\u6A29\u9650\u304C\u7121\u3044\u306E\u3067\u3001\u51E6\u7406\u3067\u304D\u307E\u305B\u3093\u3002\n");
			return false;
		}

		return this.O_Model.get_ImportDataCSVHash(import_file);
	}

	__destruct() {
		super.__destruct();
	}

};