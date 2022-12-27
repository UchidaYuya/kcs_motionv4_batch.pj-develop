//error_reporting(E_ALL|E_STRICT);
//
//FlatEverySecondMonthAddProc
//隔月の平準化パターン
//@uses ProcessBaseHtml
//@package
//@author date
//@since 2015/09/17
//

require("process/ProcessBaseHtml.php");

require("view/Admin/Regist/FlatEverySecondMonthModView.php");

require("view/MakePankuzuLink.php");

require("view/MakePageLink.php");

require("model/Admin/Regist/FlatEverySecondMonthModModel.php");

require("MtUtil.php");

//
//__construct
//
//@author houshiyama
//@since 2009/01/08
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//メイン処理
//@author date
//@since 2015/09/17
//
//@param array $H_param
//@access protected
//@return void
//
//
//__destruct
//
//@author date
//@since 2015/09/17
//
//@access public
//@return void
//
class FlatEverySecondMonthModProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	doExecute(H_param: {} | any[] = Array()) //view の生成
	//共通のCGIチェック
	//権限一覧取得（fncid）
	//model の生成
	//関数集のオブジェクトの生成
	//セッション情報取得（ローカル）
	//表示に必要なものを格納する配列を取得
	//管理記録絞込みフォームの作成(現状はドコモ岳)
	//フォームのデフォルト値作成
	//フォームのデフォルト値をセット
	////	除外リストの登録数を取得
	//		$O_view->setAssign(	"exclude_1_1_cnt",$O_model->getExcludeCount($esm_data["flatid"],1,1 ));
	//		$O_view->setAssign(	"exclude_1_2_cnt",$O_model->getExcludeCount($esm_data["flatid"],1,2 ));
	//		$O_view->setAssign(	"exclude_1_3_cnt",$O_model->getExcludeCount($esm_data["flatid"],1,3 ));
	//		$O_view->setAssign(	"exclude_1_4_cnt",$O_model->getExcludeCount($esm_data["flatid"],1,4 ));
	//	
	//		//	親番号の登録
	//		$O_view->setAssign(	"prtel_1_1_cnt",$O_model->getPrtelCount($esm_data["flatid"],1,1 ));
	//		$O_view->setAssign(	"prtel_1_2_cnt",$O_model->getPrtelCount($esm_data["flatid"],1,2 ));
	//		$O_view->setAssign(	"prtel_1_3_cnt",$O_model->getPrtelCount($esm_data["flatid"],1,3 ));
	//		$O_view->setAssign(	"prtel_1_4_cnt",$O_model->getPrtelCount($esm_data["flatid"],1,4 ));
	//アップロードされたファイルの処理を行う。
	//主に除外ファイルのアップロードの処理。
	//アップロードされた場合、値はセッションに入るのでローカルセッションを取り直す必要があるよ
	//パンくずリンクの生成
	//$O_view->setAssign( "admin_submenu", MakePankuzuLink::makePankuzuLinkHTML( array( "" => "管理記録" ), "admin" ) );
	//その他assign
	//Smartyによる表示
	{
		var O_view = new FlatEverySecondMonthModView();
		O_view.startCheck();
		var A_auth = O_view.getAuthBase();
		var O_model = new FlatEverySecondMonthModModel();
		var O_util = new MtUtil();
		var H_sess = O_view.getLocalSession();
		var H_view = O_view.get_View();
		var bill_parent = O_model.getBillParent(H_sess.pactid, 1);
		O_view.makeForm(H_sess.post.uniqueid, bill_parent);
		O_view.makeAddRule(bill_parent);
		var esm_data = O_model.getEsmData(H_sess.pactid);
		var prtel_data = O_model.getParentTelData(esm_data.flatid);
		var H_default = O_view.makeDefaultValue(H_sess, esm_data, prtel_data);
		H_view.O_FormUtil.setDefaultsWrapper(H_default);
		var flats = O_view.getFlatTypes();

		for (var id in flats) {
			var data = flats[id];
			O_view.setExcludeCount(id, O_model.getExcludeCount(esm_data.flatid, 1, id));
			O_view.setPrtelCount(id, O_model.getPrtelCount(esm_data.flatid, 1, id));
		}

		if (O_view.uploadFiles() == true) {
			H_sess = O_view.getLocalSession();
		}

		if (H_view.O_FormUtil.validateWrapper() == true) {
			if (H_sess.post.submit == O_view.NextName) //フォームをフリーズする
				{
					O_view.freezeForm();
				} else if (H_sess.post.submit == O_view.RecName) //CSRF
				//$O_unique = MtUniqueString::singleton();
				//$O_unique->validate($H_sess["post"]["uniqueid"]);
				//sql文を作成
				//DB更新成功
				{
					var A_sql = O_model.makeModSQL(H_sess);

					if (O_model.execDB(A_sql) == true) //完了画面
						{
							O_view.endAddView(H_sess);
							throw die();
						} else //エラー画面
						{
							this.errorOut(1, "SQL\u30A8\u30E9\u30FC", false, "./Admin/menu.php");
						}
				}
		} else //フォームをフリーズさせない
			{
				O_view.unfreezeForm();
			}

		O_view.setAssign("admin_submenu", MakePankuzuLink.makePankuzuLinkHTML({
			"/Admin/Regist/regist_list.php": "\u4F1A\u793E\u4E00\u89A7",
			"/Admin/Regist/flat_menu.php": "\u5E73\u6E96\u5316\u30E1\u30CB\u30E5\u30FC",
			"": "\u5E73\u6E96\u5316\u9694\u6708\u30D1\u30BF\u30FC\u30F3\u5909\u66F4"
		}, "admin"));
		O_view.setAssign("css", "csMnglog");
		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};