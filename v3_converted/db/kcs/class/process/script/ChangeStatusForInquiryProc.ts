//
//お問合わせのステータス自動更新
//
//更新履歴：<br>
//2011/03/09 K49 実装 石崎
//
//@package script
//@subpackage Process
//@author ishizaki
//@filesource
//@since 2011/03/09
//
//error_reporting(E_ALL|E_STRICT);
//
//お問合わせのステータス自動更新
//
//@uses ProcessBaseBatch
//@package script
//@author ishizaki
//@since 2011/03/09
//

require("process/ProcessBaseBatch.php");

require("view/script/ChangeStatusForInquiryView.php");

require("model/FAQ/FaqLightModel.php");

//
//コンストラクタ
//
//@author houshiyama
//@since 2011/03/02
//
//@param array $H_param
//@access public
//@return void
//
//
//doExecute
//
//@author houshiyama
//@since 2011/03/02
//
//@param array $H_param
//@access protected
//@return void
//
//
//_scriptEnd
//
//@author
//@since 2011/03/02
//
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2011/03/02
//
//@access public
//@return void
//
class ChangeStatusForInquiryProc extends ProcessBaseBatch {
	static FINISH = 50;

	constructor(H_param: {} | any[] = Array()) //親のコンストラクタを必ず呼ぶ
	//View,Modelの生成
	{
		super(H_param);
		this._view = new ChangeStatusForInquiryView();
		this._model = new FaqLightModel();
	}

	doExecute(H_param: {} | any[] = Array()) //固有ログディレクトリの作成取得
	//処理開始
	//スクリプトの二重起動防止ロック
	{
		this.set_Dirs(this._view.get_ScriptName());
		this.infoOut("\u304A\u554F\u5408\u308F\u305B\u306E\u81EA\u52D5\u5B8C\u4E86\u30B9\u30AF\u30EA\u30D7\u30C8\u958B\u59CB\n", 1);
		this.lockProcess(this._view.get_ScriptName());

		try {
			var inquiryids = this._model.getChangeStatusInquiryIds();

			if (Array.isArray(inquiryids) && 0 < inquiryids.length) {
				this.infoOut("\u5BFE\u8C61\u304A\u554F\u3044\u5408\u308F\u305B\u756A\u53F7:" + inquiryids.join(", ") + "\n", 1);

				this._model.changeInquiryStatus(inquiryids, ChangeStatusForInquiryProc.FINISH);
			} else {
				this.infoOut("\u5BFE\u8C61\u306A\u3057\n", 1);
			}
		} catch (e) {
			this.infoOut(e.getMessage() + "\n", 1);
		}

		this._scriptEnd();
	}

	_scriptEnd() //スクリプトの二重起動防止ロック解除
	//スクリプト終了処理
	{
		this.unLockProcess(this._view.get_ScriptName());
		this.set_ScriptEnd();
		this.infoOut("\u304A\u554F\u5408\u308F\u305B\u306E\u81EA\u52D5\u5B8C\u4E86\u30B9\u30AF\u30EA\u30D7\u30C8\u7D42\u4E86\n", 1);
		throw die();
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};