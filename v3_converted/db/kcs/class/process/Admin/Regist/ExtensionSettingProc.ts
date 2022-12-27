//
//内線番号設定プロセス
//
//更新履歴：
//2011/10/13 宝子山浩平 作成
//
//@package Admin
//@subpackage Regist
//@author houshiyama
//@since 2011/10/13
//@filesource
//@uses ProcessBaseHtml
//@uses ExtensionSettingModel.php
//@uses ExtensionSettingView.php
//
//
//内線番号設定プロセス
//
//@package Admin
//@subpackage Regist
//@author houshiyama
//@since 2011/10/13
//@uses ProcessBaseHtml
//@uses ExtensionSettingModel.php
//@uses ExtensionSettingView.php
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Regist/ExtensionSettingModel.php");

require("view/Admin/Regist/ExtensionSettingView.php");

//
//内線番号設定モデル
//
//@var ExtensionSettingModel
//@access protected
//
//
//内線番号設定ビュー
//
//@var ExtensionSettingView
//@access protected
//
//
//pactid
//
//@var integer
//@access protected
//
//
//内線番号設定ページの種類
//
//@var string
//@access protected
//
//
//コンストラクタ
//
//@author houshiyama
//@since 2011/10/13
//
//@access public
//@return void
//
//
//メイン処理
//
//@author houshiyama
//@since 2011/10/13
//
//@access protected
//@return void
//
//
//入力画面処理
//
//@author houshiyama
//@since 2011/10/13
//
//@access protected
//@return void
//
//
//完了画面処理
//
//@author houshiyama
//@since 2011/10/13
//
//@access protected
//@return void
//
//
//エラー画面処理
//
//@author houshiyama
//@since 2011/10/13
//
//@access protected
//@return void
//
//
//呼び出すモデルのクラス名を取得
//
//@author houshiyama
//@since 2011/10/13
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2011/10/13
//
//@access public
//@return void
//
class ExtensionSettingProc extends ProcessBaseHtml {
	constructor() //内線番号設定モデルのインスタンスを生成
	//内線番号設定ビューのインスタンスを生成
	//pactidの設定
	{
		super();
		this.O_model = new ExtensionSettingModel();
		this.O_view = new ExtensionSettingView();
		this.pact_id = this.O_view.getPactId();
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//パラメータが正しい場合
	{
		this.O_view.startCheck();

		if (true == this.O_model.checkPactId(this.pact_id)) //__callを使用してアクセスするクラスの設定
			//処理の分岐
			{
				this.O_model.setDefaultClass(this.getModelName());

				switch (this.O_view.getCurrentStatus()) {
					case ExtensionSettingView.INPUT_STATUS:
						this.inputExecute();
						break;

					case ExtensionSettingView.FINISH_STATUS:
						this.finishExecute();
						break;

					case ExtensionSettingView.ERROR_STATUS:
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

	inputExecute() //内線番号の現在の設定
	{
		var A_list = this.O_model.getExtensionSetting(this.pact_id);
		var digit_number = !A_list ? undefined : A_list[0].digit_number;

		if (!!_POST) {
			digit_number = _POST.digit_number;

			for (var key in A_list) {
				var H_val = A_list[key];
				A_list[key].min_no = _POST.min_no[H_val.carid];
				A_list[key].max_no = _POST.max_no[H_val.carid];
			}
		}

		this.O_view.assign("A_list", A_list);
		this.O_view.assign("digit_number", digit_number);
		this.O_view.assign("pact_id", this.pact_id);
		this.O_view.display();
	}

	finishExecute() //内線管理の設定
	//完了
	//入力画面処理に移譲
	{
		var result = this.O_model.setExtension(this.pact_id, this.O_view.getSaveData());

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
		return "ExtensionSettingModel";
	}

	__destruct() {
		super.__destruct();
	}

};