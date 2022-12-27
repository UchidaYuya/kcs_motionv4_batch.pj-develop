//
//ASP使用料設定プロセス
//
//更新履歴：
//2009/03/12 北村俊士 作成
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@filesource
//@uses ProcessBaseHtml
//@uses AspSettingModel.php
//@uses AspSettingView.php
//
//
//ASP使用料設定プロセス
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@uses ProcessBaseHtml
//@uses AspSettingModel.php
//@uses AspSettingView.php
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Regist/AspSettingModel.php");

require("view/Admin/Regist/AspSettingView.php");

//
//ASP使用料設定モデル
//
//@var AspSettingModel
//@access protected
//
//
//ASP使用料設定ビュー
//
//@var AspSettingView
//@access protected
//
//
//pactid
//
//@var integer
//@access protected
//
//
//ASP使用料設定ページの種類
//
//@var string
//@access protected
//
//
//コンストラクタ
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return void
//
//
//メイン処理
//
//@author kitamura
//@since 2009/03/12
//
//@access protected
//@return void
//
//
//入力画面処理
//
//@author kitamura
//@since 2009/03/13
//
//@access protected
//@return void
//
//
//完了画面処理
//
//@author kitamura
//@since 2009/03/13
//
//@access protected
//@return void
//
//
//エラー画面処理
//
//@author kitamura
//@since 2009/03/17
//
//@access protected
//@return void
//
//
//呼び出すモデルのクラス名を取得
//
//@author kitamura
//@since 2009/03/16
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return void
//
class AspSettingProc extends ProcessBaseHtml {
	constructor() //ASP使用料設定モデルのインスタンスを生成
	//ASP使用料設定ビューのインスタンスを生成
	//pactidの設定
	//アクセスされたASP使用料ページを設定
	{
		super();
		this.O_model = new AspSettingModel();
		this.O_view = new AspSettingView();
		this.pact_id = this.O_view.getPactId();
		this.access_type = this.O_view.getAccessType();
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//パラメータが正しい場合
	{
		this.O_view.startCheck();

		if (true == this.O_model.checkPactId(this.pact_id) && true == this.O_view.checkAccessType()) //__callを使用してアクセスするクラスの設定
			//処理の分岐
			{
				this.O_model.setDefaultClass(this.getModelName());

				switch (this.O_view.getCurrentStatus()) {
					case AspSettingView.INPUT_STATUS:
						this.inputExecute();
						break;

					case AspSettingView.FINISH_STATUS:
						this.finishExecute();
						break;

					case AspSettingView.ERROR_STATUS:
						this.errorExecute();
						break;

					default:
						this.inputExecute();
						break;
				}
			} else {
			this.O_view.paramError();
		}
	}

	inputExecute() //ASP使用料の現在の設定
	//テンプレート設定
	{
		var A_list = this.O_model.getAspCharge(this.pact_id);
		this.O_view.assign("A_list", A_list);
		this.O_view.assign("pact_id", this.pact_id);
		this.O_view.assign("access_type", this.access_type);
		this.O_view.display();
	}

	finishExecute() //ASP使用料の設定
	//完了
	//入力画面処理に移譲
	{
		var result = this.O_model.setAspCharge(this.pact_id, this.O_view.getSaveData());

		if (true == result) //エラー
			{
				this.O_view.setFinishMessage(true);
			} else {
			this.O_view.setFinishMessage(false);
		}

		this.inputExecute();
	}

	errorExecute() //入力画面処理に移譲
	{
		this.inputExecute();
	}

	getModelName() {
		switch (this.O_view.getAccessType()) {
			case AspSettingView.ACCESS_TYPE_TEL:
				var model_name = "AspSettingTelModel";
				break;

			case AspSettingView.ACCESS_TYPE_CARD:
				model_name = "AspSettingCardModel";
				break;

			case AspSettingView.ACCESS_TYPE_PURCHASE:
				model_name = "AspSettingPurchaseModel";
				break;

			case AspSettingView.ACCESS_TYPE_COPY:
				model_name = "AspSettingCopyModel";
				break;

			case AspSettingView.ACCESS_TYPE_ICCARD:
				model_name = "AspSettingICCardModel";
				break;

			default:
				model_name = undefined;
				break;
		}

		return model_name;
	}

	__destruct() {
		super.__destruct();
	}

};