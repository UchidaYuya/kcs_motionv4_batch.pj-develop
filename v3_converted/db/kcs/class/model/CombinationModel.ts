//
//料金プラン、パケットプラン、オプション等の組み合わせチェック用モデル
//
//@filesource
//@package Base
//@subpackage Model
//@author maeda
//@since 2008/08/07
//@uses ModelBase
//@uses MtDBUtil
//@uses MtSetting
//@uses MtOutput
//
//
//
//料金プラン、パケットプラン、オプション等の組み合わせチェック用モデル
//
//@uses ModelBase
//@package Base
//@subpackage Model
//@author maeda
//@since 2008/08/07
//

require("MtDBUtil.php");

require("MtOutput.php");

require("MtSetting.php");

require("ModelBase.php");

//
//コンストラクタ
//
//@author maeda
//@since 2008/08/07
//
//@param mixed $O_db
//@access public
//@return void
//
//
//combination_pattern_tbに登録されているルール一覧を取得する
//
//@author maeda
//@since 2008/08/07
//
//@param mixed $type 組み合わせタイプ
//@param mixed $id 組み合わせＩＤ
//@access public
//@return 成功 array(type => array(id => rule))
//@return 失敗 false
//
//
//chkCombination
//
//@author maeda
//@since 2008/08/07
//
//@param mixed $type1 組み合わせタイプ１
//@param mixed $id1 組み合わせＩＤ１
//@param mixed $type2 組み合わせタイプ２
//@param mixed $id2 組み合わせＩＤ２
//@access public
//@return 成功 ルールがある場合はルール結果、無い場合はnothing
//@return 失敗 false
//
//
//購入種別とプラン、オプションとの組み合わせチェック
//
//@author miyazawa
//@since 2008/08/09
//
//@param int $buyselid 購入方法ID
//@param int $planid プランID
//@param mixed $A_op_put つけるオプションID
//@param mixed $A_op_remove 外すオプションID
//@param text $language 言語
//@access public
//@return array NG/必須の警告文字列を納めた配列
//
//
//プランとパケット、オプションとの組み合わせチェック
//
//@author miyazawa
//@since 2008/08/09
//
//@param int $planid プランID
//@param int $planid パケットID
//@param mixed $A_op_put つけるオプションID
//@param mixed $A_op_remove 外すオプションID
//@param text $language 言語
//@access public
//@return array NG/必須の警告文字列を納めた配列
//
//
//オプションとオプションとの組み合わせチェック
//
//@author miyazawa
//@since 2008/08/09
//
//@param mixed $A_op_put つけるオプションID
//@param mixed $A_op_remove 外すオプションID
//@param text $language 言語
//@access public
//@return array NG/必須の警告文字列を納めた配列
//
//
//__destruct
//
//@author maeda
//@since 2008/08/07
//
//@access public
//@return void
//
class CombinationModel extends ModelBase {
	constructor(O_db = undefined) //親のコンストラクタを必ず呼ぶ
	{
		super(O_db);
	}

	getCombiList(type, id) //パラメータチェック
	//検索成功
	{
		var H_rtn = Array();

		if ("" == String(type || "" == +id)) {
			return false;
		}

		var sql = "select type1 as type,id1 as id,rule " + "from combination_pattern_tb " + "where type2 = '" + type + "' " + "and id2 = " + id + " " + "union " + "select type2 as type,id2 as id,rule " + "from combination_pattern_tb " + "where type1 = '" + type + "' " + "and id1 = " + id + " " + "order by type,id";
		var H_result = this.getDB().queryHash(sql);

		if (PEAR.isError(H_result) == false) //レコード数
			//１行ずつ処理し連想配列に格納する array(type => array(id => rule))
			//検索失敗
			{
				var recCnt = H_result.length;

				for (var recCounter = 0; recCounter < recCnt; recCounter++) {
					H_rtn[H_result[recCounter].type][H_result[recCounter].id] = H_result[recCounter].rule;
				}

				return H_rtn;
			} else {
			return false;
		}
	}

	chkCombination(type1, id1, type2, id2) //パラメータチェック
	//検索成功
	{
		if ("" == String(type1 || "" == +(id1 || "" == String(type2 || "" == +id2)))) {
			return false;
		}

		var sql = "select rule " + "from combination_pattern_tb " + "where type1 = '" + type1 + "' " + "and id1 = " + id1 + " " + "and type2 = '" + type2 + "' " + "and id2 = " + id2 + " " + "union " + "select rule " + "from combination_pattern_tb " + "where type1 = '" + type2 + "' " + "and id1 = " + id2 + " " + "and type2 = '" + type1 + "' " + "and id2 = " + id1;
		var H_result = this.getDB().queryHash(sql);

		if (PEAR.isError(H_result) == false) //１件登録あり
			//検索失敗
			{
				if (1 == H_result.length) //ルールが複数ある場合はエラー（登録間違い）
					{
						return H_result[0].rule;
					} else if (1 < H_result.length) //登録なし
					{
						return false;
					} else {
					return "nothing";
				}
			} else {
			return false;
		}
	}

	chkCombinationBuysel(buyselid, planid = undefined, A_op_put: {} | any[] = Array(), A_op_remove: {} | any[] = Array(), language = "JPN") //NGチェック
	//プランのチェック
	{
		var A_rule = Array();

		if (planid != undefined) {
			var planresult = this.chkCombination("buyselid", buyselid, "planid", planid);

			if (planresult == "ng") {
				if ("ENG" == language) {
					var sql = "SELECT bs.buyselname_eng AS buyselname, pl.planname_eng AS planname FROM buyselect_tb bs, plan_tb pl WHERE bs.buyselid=" + buyselid + " AND pl.planid=" + planid;
					var A_plan_ng = this.getDB().queryRowHash(sql);
					A_rule.push("For " + A_plan_ng.buyselname + ", " + A_plan_ng.planname + " can not be selected.");
				} else {
					sql = "SELECT bs.buyselname, pl.planname FROM buyselect_tb bs, plan_tb pl WHERE bs.buyselid=" + buyselid + " AND pl.planid=" + planid;
					A_plan_ng = this.getDB().queryRowHash(sql);
					A_rule.push(A_plan_ng.buyselname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_plan_ng.planname + "\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093");
				}
			}
		}

		if (A_op_put != undefined) {
			for (var opid of Object.values(A_op_put)) {
				var opresult = this.chkCombination("buyselid", buyselid, "opid", opid);

				if (opresult == "ng") {
					if ("ENG" == language) {
						sql = "SELECT bs.buyselname_eng AS buyselname, op.opname_eng AS opname FROM buyselect_tb bs, option_tb op WHERE bs.buyselid=" + buyselid + " AND op.opid=" + opid;
						var A_op_ng = this.getDB().queryRowHash(sql);
						A_rule.push("For " + A_op_ng.buyselname + ", " + A_op_ng.opname + " can not be selected.");
					} else {
						sql = "SELECT bs.buyselname, op.opname FROM buyselect_tb bs, option_tb op WHERE bs.buyselid=" + buyselid + " AND op.opid=" + opid;
						A_op_ng = this.getDB().queryRowHash(sql);
						A_rule.push(A_op_ng.buyselname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_op_ng.opname + "\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093");
					}
				}
			}
		}

		var H_rule = this.getCombiList("buyselid", buyselid);

		if (true == Array.isArray(H_rule)) {
			for (var key in H_rule) {
				var value = H_rule[key];

				if (true == Array.isArray(value)) {
					for (var id in value) {
						var rule = value[id];

						if (rule == "req") //プラン
							{
								if (key == "planid") {
									if (id != planid) {
										if ("ENG" == language) {
											sql = "SELECT bs.buyselname_eng AS buyselname, pl.planname_eng AS planname FROM buyselect_tb bs, plan_tb pl WHERE bs.buyselid=" + buyselid + " AND pl.planid=" + id;
											A_plan_ng = this.getDB().queryRowHash(sql);
											A_rule.push("Select " + A_plan_ng.planname + " for " + A_plan_ng.buyselname + ".");
										} else {
											sql = "SELECT bs.buyselname, pl.planname FROM buyselect_tb bs, plan_tb pl WHERE bs.buyselid=" + buyselid + " AND pl.planid=" + id;
											A_plan_ng = this.getDB().queryRowHash(sql);
											A_rule.push(A_plan_ng.buyselname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_plan_ng.planname + "\u3092\u5FC5\u305A\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
										}
									}
								} else if (key == "opid") {
									if (true == (-1 !== A_op_remove.indexOf(id)) || false == (-1 !== A_op_put.indexOf(id))) {
										if ("ENG" == language) {
											sql = "SELECT bs.buyselname_eng AS buyselname, op.opname_eng AS opname FROM buyselect_tb bs, option_tb op WHERE bs.buyselid=" + buyselid + " AND op.opid=" + id;
											A_op_ng = this.getDB().queryRowHash(sql);
											A_rule.push("Select " + A_op_ng.opname + " for " + A_op_ng.buyselname + ".");
										} else {
											sql = "SELECT bs.buyselname, op.opname FROM buyselect_tb bs, option_tb op WHERE bs.buyselid=" + buyselid + " AND op.opid=" + id;
											A_op_ng = this.getDB().queryRowHash(sql);
											A_rule.push(A_op_ng.buyselname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_op_ng.opname + "\u3092\u5FC5\u305A\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
										}
									}
								}
							}
					}
				}
			}
		}

		return A_rule;
	}

	chkCombinationPlan(planid = undefined, packetid = undefined, A_op_put: {} | any[] = Array(), A_op_remove: {} | any[] = Array(), language = "JPN") //NGチェック
	//パケットのチェック
	{
		var A_rule = Array();

		if (packetid != undefined) {
			var packetresult = this.chkCombination("planid", planid, "packetid", packetid);

			if (packetresult == "ng") {
				if ("ENG" == language) {
					var sql = "SELECT pl.planname_eng AS planname, pk.packetname_eng AS packetname FROM plan_tb pl, packet_tb pk WHERE pl.planid=" + planid + " AND pk.packetid=" + packetid;
					var A_packet_ng = this.getDB().queryRowHash(sql);
					A_rule.push("For " + A_packet_ng.planname + ", " + A_packet_ng.packetname + " can not be selected.");
				} else {
					sql = "SELECT pl.planname, pk.packetname FROM plan_tb pl, packet_tb pk WHERE pl.planid=" + planid + " AND pk.packetid=" + packetid;
					A_packet_ng = this.getDB().queryRowHash(sql);
					A_rule.push(A_packet_ng.planname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_packet_ng.packetname + "\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093");
				}
			}
		}

		if (A_op_put != undefined) {
			for (var opid of Object.values(A_op_put)) {
				var opresult = this.chkCombination("planid", planid, "opid", opid);

				if (opresult == "ng") {
					if ("ENG" == language) {
						sql = "SELECT pl.planname_eng AS planname, op.opname_eng AS opname FROM plan_tb pl, option_tb op WHERE pl.planid=" + planid + " AND op.opid=" + opid;
						var A_op_ng = this.getDB().queryRowHash(sql);
						A_rule.push("For " + A_op_ng.planname + ", " + A_op_ng.opname + " can not be selected.");
					} else {
						sql = "SELECT pl.planname, op.opname FROM plan_tb pl, option_tb op WHERE pl.planid=" + planid + " AND op.opid=" + opid;
						A_op_ng = this.getDB().queryRowHash(sql);
						A_rule.push(A_op_ng.planname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_op_ng.opname + "\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093");
					}
				}
			}
		}

		var H_rule = this.getCombiList("planid", planid);

		if (true == Array.isArray(H_rule)) {
			for (var key in H_rule) {
				var value = H_rule[key];

				if (true == Array.isArray(value)) {
					for (var id in value) {
						var rule = value[id];

						if (rule == "req") //パケット
							{
								if (key == "packetid") {
									if (id != packetid) {
										if ("ENG" == language) {
											sql = "SELECT pl.planname_eng AS planname, pk.packetname_eng AS packetname FROM plan_tb pl, packet_tb pk WHERE pl.planid=" + planid + " AND pk.packetid=" + id;
											var A_plan_ng = this.getDB().queryRowHash(sql);
											A_rule.push("Select " + A_plan_ng.packetname + " for " + A_plan_ng.planname + ".");
										} else {
											sql = "SELECT pl.planname, pk.packetname FROM plan_tb pl, packet_tb pk WHERE pl.planid=" + planid + " AND pk.packetid=" + id;
											A_plan_ng = this.getDB().queryRowHash(sql);
											A_rule.push(A_plan_ng.planname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_plan_ng.packetname + "\u3092\u5FC5\u305A\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
										}
									}
								} else if (key == "opid") {
									if (true == (-1 !== A_op_remove.indexOf(id)) || false == (-1 !== A_op_put.indexOf(id))) {
										if ("ENG" == language) {
											sql = "SELECT pl.planname_eng AS planname, op.opname_eng AS opname FROM plan_tb pl, option_tb op WHERE pl.planid=" + planid + " AND op.opid=" + id;
											A_op_ng = this.getDB().queryRowHash(sql);
											A_rule.push("Select " + A_op_ng.opname + " for " + A_op_ng.planname + ".");
										} else {
											sql = "SELECT pl.planname, op.opname FROM plan_tb pl, option_tb op WHERE pl.planid=" + planid + " AND op.opid=" + id;
											A_op_ng = this.getDB().queryRowHash(sql);
											A_rule.push(A_op_ng.planname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_op_ng.opname + "\u3092\u5FC5\u305A\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
										}
									}
								}
							}
					}
				}
			}
		}

		return A_rule;
	}

	chkCombinationOption(A_op_put: {} | any[] = Array(), A_op_remove: {} | any[] = Array(), language = "JPN") //NGチェック
	//オプションのチェック
	//一度チェックしたopidをスキップするための配列
	{
		var A_rule = Array();
		var A_op_chk = A_op_put;
		var A_skip = Array();

		if (A_op_put != undefined) {
			for (var opid of Object.values(A_op_put)) {
				for (var chkid of Object.values(A_op_chk)) {
					if (false == (-1 !== A_skip.indexOf(chkid))) //もうチェックしたIDは飛ばす
						{
							var opresult = this.chkCombination("opid", opid, "opid", chkid);

							if (opresult == "ng") {
								if ("ENG" == language) {
									var sql = "SELECT op.opname_eng AS opname, chk.opname_eng AS chkname FROM option_tb op, option_tb chk WHERE op.opid=" + opid + " AND chk.opid=" + chkid;
									var A_op_ng = this.getDB().queryRowHash(sql);
									A_rule.push("For " + A_op_ng.opname + ", " + A_op_ng.chkname + " can not be selected.");
								} else {
									sql = "SELECT op.opname, chk.opname AS chkname FROM option_tb op, option_tb chk WHERE op.opid=" + opid + " AND chk.opid=" + chkid;
									A_op_ng = this.getDB().queryRowHash(sql);
									A_rule.push(A_op_ng.opname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_op_ng.chkname + "\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093");
								}
							}
						}
				}

				A_skip.push(opid);
			}
		}

		for (var opid of Object.values(A_op_put)) {
			var H_rule = this.getCombiList("opid", opid);

			if (true == Array.isArray(H_rule)) {
				for (var key in H_rule) {
					var value = H_rule[key];

					if (true == Array.isArray(value)) {
						for (var id in value) {
							var rule = value[id];

							if (rule == "req") {
								if (key == "opid") {
									if (true == (-1 !== A_op_remove.indexOf(id)) || false == (-1 !== A_op_put.indexOf(id))) {
										if ("ENG" == language) {
											sql = "SELECT op.opname_eng AS opname, chk.opname_eng AS chkname FROM option_tb op, option_tb chk WHERE op.opid=" + opid + " AND chk.opid=" + id;
											A_op_ng = this.getDB().queryRowHash(sql);
											A_rule.push("Select " + A_op_ng.chkname + " for " + A_op_ng.opname + ".");
										} else {
											sql = "SELECT op.opname, chk.opname AS chkname FROM option_tb op, option_tb chk WHERE op.opid=" + opid + " AND chk.opid=" + id;
											A_op_ng = this.getDB().queryRowHash(sql);
											A_rule.push(A_op_ng.opname + "\u3092\u9078\u3076\u3068\u304D\u306F\u3001" + A_op_ng.chkname + "\u3092\u5FC5\u305A\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044");
										}
									}
								}
							}
						}
					}
				}
			}
		}

		return A_rule;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};