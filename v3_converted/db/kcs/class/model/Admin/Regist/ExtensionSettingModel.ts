//
//内線番号設定モデル
//
//更新履歴：
//2011/10/13 宝子山浩平 作成
//
//@package Admin
//@subpackage Regist
//@author houshiyama
//@since 2011/10/13
//@filesource
//@uses ModelBase
//@uses ExtensionSettingModel
//@uses CarrierModel
//
//
//内線番号設定モデル
//
//@package Admin
//@subpackage Regist
//@author houshiyama
//@since 2011/10/13
//@uses ModelBase
//@uses ExtensionSettingModel
//@uses CarrierModel
//

require("model/ModelBase.php");

require("model/ExtensionSettingTbModel.php");

require("model/CarrierModel.php");

//
//関連モデルのインスタンス
//
//@var CarrierModel
//@access private
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
//__callから呼び出すクラスを設定
//
//@author houshiyama
//@since 2011/10/13
//
//@param string $default_class
//@access public
//@return void
//
//
//内線番号設定の取得
//
//@author houshiyama
//@since 2011/10/13
//
//@param integer $pactid
//@access public
//@return array
//
//
//pactidが登録されているか確認
//
//@author houshiyama
//@since 2011/10/13
//
//@access public
//@return boolean
//
//
//setExtension
//
//@author nakanita
//@since 2011/10/14
//
//@param mixed $pactid
//@param mixed $H_data
//@access public
//@return void
//
//
//各Modelのインスタンスを取得
//
//@author houshiyama
//@since 2011/10/13
//
//@param string $class_name
//@access private
//@return object
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
class ExtensionSettingModel extends ModelBase {
	constructor() //関連モデルのインスタンス
	{
		super();
		this.O_model = new ExtensionSettingTbModel();
	}

	setDefaultClass(default_class) {
		if (true == ("function" === typeof global[default_class])) {
			this.default_class = default_class;
		} else {
			throw new Error("Undefined class: " + default_class);
		}
	}

	getExtensionSetting(pactid) {
		var H_setting = this.O_model.getPactSetting(pactid);
		var O_carrier = new CarrierModel();
		var H_carrier = O_carrier.getCarrierKeyHash();
		var A_list = Array();

		for (var carid in H_carrier) {
			var carname = H_carrier[carid];
			var A_tmp = {
				carid: carid,
				carname: carname
			};

			if (carid in H_setting) {
				A_tmp += H_setting[carid];
			}

			A_list.push(A_tmp);
		}

		return A_list;
	}

	checkPactId(pactid) {
		var return = false;

		if (true == is_numeric(pactid)) {
			var result = this.getModelInstance("PactModel").getCompname(pactid);

			if (undefined !== result) {
				return = true;
			}
		}

		return return;
	}

	setExtension(pactid, H_data) {
		{
			let _tmp_0 = H_data.min_no;

			for (var carid in _tmp_0) {
				var val = _tmp_0[carid];

				if ("" != H_data.min_no[carid] && "" != H_data.max_no[carid]) {
					var H_val = Array();
					H_val.digit_number = H_data.digit_number;
					H_val.min_no = H_data.min_no[carid];
					H_val.max_no = H_data.max_no[carid];

					if (!this.getModelInstance("ExtensionSettingTbModel").saveExtensionSetting(pactid, carid, H_val)) {
						return false;
					}
				} else if ("" == H_data.min_no[carid] && "" == H_data.max_no[carid]) {
					if (!this.getModelInstance("ExtensionSettingTbModel").clearExtensionSetting(pactid, carid)) {
						return false;
					}
				}
			}
		}
		return true;
	}

	getModelInstance(class_name) {
		if (false == (undefined !== this.A_model[class_name])) {
			this.A_model[class_name] = new class_name();
		}

		return this.A_model[class_name];
	}

	__destruct() {
		super.__destruct();
	}

};