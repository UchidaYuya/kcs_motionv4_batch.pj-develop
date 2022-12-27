//
//配送先リストモデル
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
//配送先リストモデル
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

require("model/ModelBase.php");

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
//getShiptoList
//
//@author maeda
//@since 2008/08/07
//
//@param mixed $pactid 契約ＩＤ
//@param mixed $unitType 管理単位
//@param mixed $unitId 管理単位ＩＤ
//@param mixed $shiptoid 配送先ＩＤ（一行取るときのみ入ってくる）
//@access public
//@return 成功:配送先登録データ連想配列、失敗:false
//
//
//addShipto
//
//@author maeda
//@since 2008/08/07
//
//@param mixed $unitType 管理単位
//@param mixed $unitId 管理単位ＩＤ
//@param mixed $H_addData 登録するデータ
//@access public
//@return 成功:登録時に採番された配送先ＩＤ、失敗:false
//
//
//配送先リストの削除
//
//@author maeda
//@since 2008/08/07
//
//@param mixed $pactid 契約ＩＤ
//@param mixed $unitType 管理単位
//@param mixed $unitId 管理単位ＩＤ（postidまたはshopid）
//@param mixed $shiptoid 配送先ＩＤ
//@access public
//@return 成功:true、失敗:false
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
class ShiptoModel extends ModelBase {
	constructor(O_db = undefined) //親のコンストラクタを必ず呼ぶ
	{
		super(O_db);
	}

	getShiptoList(pactid, unitType, unitId, shiptoid = undefined) //パラメータチェック
	//検索成功
	{
		if ("" == +(pactid || "" == String(unitType || "" == +unitId))) {
			return false;
		}

		var sql = "SELECT st.shiptoid,st.pactid,st.unittype,st.unitid,st.username,st.postname," + "st.ziphead,st.ziptail,pr.pref,pr.pref_eng,st.addr,st.building,st.telno,st.recdate,st.fixdate " + "FROM shipto_tb st " + "LEFT JOIN prefecture_tb pr ON st.pref=pr.pref " + "WHERE st.pactid = " + pactid + " " + "AND st.unittype = '" + unitType + "' " + "AND st.unitid = " + unitId + " ";

		if (shiptoid != "") {
			sql += "AND st.shiptoid = " + shiptoid + " ";
		}

		sql += "ORDER BY st.shiptoid";
		var H_rtn = this.getDB().queryHash(sql);

		if (PEAR.isError(H_rtn) == false) //検索失敗
			{
				return H_rtn;
			} else {
			return false;
		}
	}

	addShipto(unitType, unitId, H_addData) //パラメータチェック
	//現在時刻を取得
	//登録成功
	{
		if ("" == String(unitType || "" == +(unitId || undefined !== H_addData.pactid == false))) //登録データ整形
			{
				return false;
			} else {
			if (undefined !== H_addData.username == false || "" == H_addData.username) {
				var username = "null";
			} else {
				username = "'" + H_addData.username + "'";
			}

			if (undefined !== H_addData.postname == false || "" == H_addData.postname) {
				var postname = "null";
			} else {
				postname = "'" + H_addData.postname + "'";
			}

			if (undefined !== H_addData.ziphead == false || "" == H_addData.ziphead) {
				var ziphead = "null";
			} else {
				ziphead = "'" + H_addData.ziphead + "'";
			}

			if (undefined !== H_addData.ziptail == false || "" == H_addData.ziptail) {
				var ziptail = "null";
			} else {
				ziptail = "'" + H_addData.ziptail + "'";
			}

			if (undefined !== H_addData.pref == false || "" == H_addData.pref) {
				var pref = "null";
			} else {
				pref = "'" + H_addData.pref + "'";
			}

			if (undefined !== H_addData.addr == false || "" == H_addData.addr) {
				var addr = "null";
			} else {
				addr = "'" + H_addData.addr + "'";
			}

			if (undefined !== H_addData.building == false || "" == H_addData.building) {
				var building = "null";
			} else {
				building = "'" + H_addData.building + "'";
			}

			if (undefined !== H_addData.telno == false || "" == H_addData.telno) {
				var telno = "null";
			} else {
				telno = "'" + H_addData.telno + "'";
			}
		}

		var now = this.get_DB().getNow();
		var sql = "insert into shipto_tb " + "(pactid,unittype,unitid,username,postname,ziphead," + "ziptail,pref,addr,building,telno,recdate,fixdate) " + "values(" + H_addData.pactid + "," + "'" + unitType + "'," + unitId + "," + username + "," + postname + "," + ziphead + "," + ziptail + "," + pref + "," + addr + "," + building + "," + telno + "," + "'" + now + "'," + "'" + now + "')";
		var rtn = this.getDB().exec(sql);

		if (PEAR.isError(rtn) == false && 1 == rtn) //登録時に採番された配送先ＩＤを取得
			//登録失敗
			{
				sql = "select currval('shipto_tb_shiptoid_seq')";
				return this.getDB().queryOne(sql);
			} else {
			return false;
		}
	}

	delShipto(pactid, unitType, unitId, shiptoid) //パラメータチェック
	//削除成功
	{
		if ("" == +(pactid || "" == String(unitType || "" == +(unitId || "" == +shiptoid)))) {
			return false;
		}

		var sql = "delete from shipto_tb " + "where pactid = " + pactid + " " + "and unittype = '" + unitType + "' " + "and unitid = " + unitId + " " + "and shiptoid = " + shiptoid;
		var rtn = this.getDB().exec(sql);

		if (PEAR.isError(rtn) == false && 1 == rtn) //削除失敗
			{
				return true;
			} else {
			return false;
		}
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};