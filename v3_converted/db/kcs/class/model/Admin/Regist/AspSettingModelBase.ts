//
//ASP使用料設定基底モデル
//
//更新履歴：
//2009/03/12 北村俊士 作成
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@filesource
//@uses ModelBase
//
//
//
//ASP使用料設定基底モデル
//
//@package Admin
//@subpackage Regist
//@author kitamura
//@since 2009/03/12
//@uses ModelBase
//
//

require("model/ModelBase.php");

//
//接続するテーブル名
//
//@var string
//@access private
//
//
//
//固有のカラム名
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
//IDをキーとする名称の配列を取得
//
//@author kitamura
//@since 2009/03/12
//
//@access public
//@return array
//
//
//
//ASP使用料の取得
//
//@author kitamura
//@since 2009/03/12
//
//@param integer $pact_id
//@access public
//@return array
//
//
//
//ASP使用料の設定
//
//@author kitamura
//@since 2009/03/12
//
//@param integer $pact_id
//@param array $A_inputs
//@access public
//@return boolean
//
//
//
//ASP使用料の変更
//
//@author kitamura
//@since 2009/03/12
//
//@param string $table_name
//@param integer $pact_id
//@param array $A_inputs
//@access protected
//@return boolean
//
//
//
//ASP使用料の取得
//
//@author kitamura
//@since 2009/03/12
//
//@param string $table_name
//@param integer $pact_id
//@access protected
//@return array
//
//
//
//ASP使用料の追加
//
//@author kitamura
//@since 2009/03/12
//
//@param string $table_name
//@param integer $pact_id
//@param array $A_inserts
//@access protected
//@return void
//
//
//
//ASP使用料の変更
//
//@author kitamura
//@since 2009/03/12
//
//@param string $table_name
//@param integer $pact_id
//@param array $A_inserts
//@access protected
//@return void
//
//
//
//必須プロパティの確認
//
//@author kitamura
//@since 2009/03/13
//
//@access protected
//@return void
//
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
//
class AspSettingModelBase extends ModelBase {
	constructor() {
		super();
	}

	getAspCharge(pact_id) //設定されているプロパティの確認
	//ASP使用料の項目
	//ASP使用料の現在の設定
	//表示用配列を生成
	{
		this.checkProperty();
		var A_name = this.getNameList();
		var A_charge = this.selectAspCharge(this.table_name, this.coid_name, pact_id);
		var result = Array();

		for (var key in A_name) //ASP使用料が設定されている場合
		{
			var value = A_name[key];

			if (true == (undefined !== A_charge[key])) //ASP使用料が設定されていない場合
				{
					result[key] = {
						name: value,
						charge: A_charge[key],
						set: true
					};
				} else {
				result[key] = {
					name: value,
					charge: 0,
					set: false
				};
			}
		}

		return result;
	}

	setAspCharge(pact_id, A_save_data) //設定されているプロパティの確認
	{
		this.checkProperty();
		var result = this.saveAspCharge(this.table_name, this.coid_name, pact_id, A_save_data);
		return result;
	}

	saveAspCharge(table_name, coid_name, pact_id, A_save_data) //実行
	{
		var A_current = this.getAspCharge(pact_id);

		try //トランザクション開始
		//追加・更新
		//コミット
		//管理記録
		{
			this.getDB().beginTransaction();

			for (var key in A_current) //設定がない場合は不正アクセスとみなす
			{
				var value = A_current[key];

				if (true == (undefined !== A_save_data[key])) //未設定の場合
					{
						if (false == value.set) //設定済みで使用料が変更されている場合
							{
								this.insertAspCharge(table_name, coid_name, pact_id, key, A_save_data[key]);
							} else if (true == value.set && value.charge != A_save_data[key]) {
							this.updateAspCharge(table_name, coid_name, pact_id, key, A_save_data[key]);
						}
					} else {
					throw new Error("Undefined index: " + key);
				}
			}

			this.getDB().commit();
			var mng_log = {
				shopid: _SESSION.admin_shopid,
				shopname: _SESSION.admin_name,
				username: _SESSION.admin_personname,
				kind: "Regist",
				type: "\u5909\u66F4",
				comment: "ASP\u4F7F\u7528\u6599\u5909\u66F4(" + pact_id + ")"
			};
			this.getOut().writeAdminMnglog(mng_log);
			return true;
		} catch (e) //ロールバック
		//エラーログ
		{
			this.getDB().rollback();
			this.errorOut(0, e.getMessage(), 1, "", "\u9589\u3058\u308B");
			return false;
		}
	}

	selectAspCharge(table_name, coid_name, pact_id) //SQL
	{
		var sql_temp = "SELECT %s, charge FROM %s WHERE pactid = %d AND manual = true";
		var sql = sprintf(sql_temp, coid_name, table_name, pact_id);
		return this.getDB().queryAssoc(sql);
	}

	insertAspCharge(table_name, coid_name, pact_id, coid, charge) //SQL
	{
		var sql = "INSERT INTO " + table_name + "(pactid, charge, " + coid_name + ", manual)" + " VALUES(" + pact_id + ", " + charge + ", " + coid + ", true)";
		var result = this.getDB().exec(sql);

		if (1 != result) {
			throw new Error("Insert failed: " + sql);
		}
	}

	updateAspCharge(table_name, coid_name, pact_id, coid, charge) //SQL
	//selectAspChargeでmanual=trueを条件に設定があるかどうか見てるのでここでも指定 20100714miya
	{
		var sql = "UPDATE " + table_name + " SET" + " charge = " + charge + " WHERE" + " pactid = " + pact_id + " AND " + coid_name + " = " + coid + " AND manual=true";
		var result = this.getDB().exec(sql);

		if (1 != result) {
			throw new Error("Update failed: " + sql);
		}
	}

	checkProperty() {
		if (false == (undefined !== this.table_name) || false == (undefined !== this.coid_name)) {
			throw new Error("Not isset: table_name or coid_name");
		}
	}

	__destruct() {
		super.__destruct();
	}

};