//
//ASP使用料設定モデル
//
//更新履歴：
//2009/03/12 北村俊士 作成
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@filesource
//@uses AspSettingTelModel
//@uses AspSettingCardModel
//@uses AspSettingPurchaseModel
//@uses AspSettingCopyModel
//@uses PactModel
//
//
//交通費対応 20100707miya
//
//ASP使用料設定モデル
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@uses AspSettingTelModel
//@uses AspSettingCardModel
//@uses AspSettingPurchaseModel
//@uses AspSettingCopyModel
//@uses AspSettingICCardModel
//@uses PactModel
//
//

require("model/Admin/Regist/AspSettingTelModel.php");

require("model/Admin/Regist/AspSettingCardModel.php");

require("model/Admin/Regist/AspSettingPurchaseModel.php");

require("model/Admin/Regist/AspSettingCopyModel.php");

require("model/Admin/Regist/AspSettingICCardModel.php");

require("model/PactModel.php");

//
//各Modelのインスタンス
//
//@var array
//@access private
//
//
//
//デフォルトで呼び出すメソッド名
//
//@var string
//@access private
//
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
//
//ASP使用料の個別処理を実行する
//
//@author kitamura
//@since 2009/03/16
//
//@param string $method
//@param array $arg
//@access public
//@return mixed
//
//
//
//__callから呼び出すクラスを設定
//
//@author kitamura
//@since 2009/03/16
//
//@param string $default_class
//@access public
//@return void
//
//
//
//pactidが登録されているか確認
//
//@author kitamura
//@since 2009/03/13
//
//@access public
//@return boolean
//
//
//
//AspSettingTelModelの取得
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return AspSettingTelModel
//
//
//
//AspSettingCardModelの取得
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return AspSettingCardModel
//
//
//
//AspSettingPurchaseModelの取得
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return AspSettingPurchaseModel
//
//
//
//AspSettingCopyModelの取得
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return AspSettingCopyModel
//
//
//
//AspSettingICCardModelの取得
//
//@author miyazawa
//@since 2010/07/07
//
//@access public
//@return AspSettingICCardModel
//
//
//
//各Modelのインスタンスを取得
//
//@author kitamura
//@since 2009/03/12
//
//@param string $class_name
//@access private
//@return object
//
//
class AspSettingModel {
	constructor(default_class = undefined) {
		if (true == (undefined !== default_class)) {
			this.setDefaultClass(default_class);
		}
	}

	__call(method, arg) {
		var call_back = [this.getModelInstance(this.default_class), method];
		return call_user_func_array(call_back, arg);
	}

	setDefaultClass(default_class) {
		if (true == ("function" === typeof global[default_class])) {
			this.default_class = default_class;
		} else {
			throw new Error("Undefined class: " + default_class);
		}
	}

	checkPactId(pact_id) {
		var return = false;

		if (true == is_numeric(pact_id)) {
			var result = this.getModelInstance("PactModel").getCompname(pact_id);

			if (undefined !== result) {
				return = true;
			}
		}

		return return;
	}

	getTelModel() {
		return this.getModelInstance("AspSettingTelModel");
	}

	getCardModel() {
		return this.getModelInstance("AspSettingCardModel");
	}

	getPurchaseModel() {
		return this.getModelInstance("AspSettingPurchaseModel");
	}

	getCopyModel() {
		return this.getModelInstance("AspSettingCopyModel");
	}

	getICCardModel() {
		return this.getModelInstance("AspSettingICCardModel");
	}

	getModelInstance(class_name) {
		if (false == (undefined !== this.A_model[class_name])) {
			this.A_model[class_name] = new class_name();
		}

		return this.A_model[class_name];
	}

};