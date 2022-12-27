//
//ポイント表示メニューProccess基底
//
//更新履歴：<br>
//2008/04/10 石崎公久 作成
//
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//@filesource
//@uses ProcessBaseHtml
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ポイント表示メニューProccess基底
//
//@package SUO
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/04/10
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/PostModel.php");

//
//コンストラクター
//
//@author ishizaki
//@since 2008/04/10
//
//@param array $H_param
//@access public
//@return void
//
//
//各ページのview取得
//
//@author ishizaki
//@since 2008/04/10
//
//@abstract
//@access protected
//@return void
//
//
//各ページのモデル取得
//
//@author ishizaki
//@since 2008/04/10
//
//@abstract
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//１．Viewオブジェクト作成
//２．ログインチェック
//３．Modelオブジェクト
//４．現在ログイン中のユーザが所属する部署の一覧を取得
//５．
//
//@author ishizaki
//@since 2008/04/10
//
//@param array $H_param
//@access protected
//@return void
//@uses TweakPointUtil
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class TweakPointMenuProcBase extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
		this.getSetting().loadConfig("SUO");
	}

	doExecute(H_param: {} | any[] = Array()) //viewオブジェクトの生成
	//ログインチェック
	//modelオブジェクトの生成
	//現在ログイン中のユーザが所属する部署以下の一覧
	//システム部署IDからユーザ部署IDへ
	//所属部署のポイント管理状況の確認
	//ポイント管理をする部署だけ表示
	{
		var O_view = this.get_View();
		O_view.startCheck();
		var O_model = this.get_Model();
		var A_post_list = Array();
		var O_postmodel = new PostModel();
		var A_system_post_list = O_postmodel.getChildList(O_view.gSess().pactid, O_view.gSess().postid);
		A_post_list = O_model.changePostidUserpostid(A_system_post_list, O_view.gSess().pactid);
		var point_mng_flag = O_model.checkViewPointOfPost(O_view.gSess().pactid, O_view.gSess().userid);

		if (true == point_mng_flag) //ログインユーザの所属部署以下のポイント一覧を取得
			{
				var A_point_list = O_model.getPointList(O_view.gSess().pactid, A_post_list);
				O_view.setBilldate(O_model.getBilldate(O_view.gSess().pactid));
				O_view.setPointList(A_point_list);
			}

		O_view.displaySmarty();
	}

	__destruct() {
		super.__destruct();
	}

};