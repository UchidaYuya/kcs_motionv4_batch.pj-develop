//
//オーダー取得・更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/04/01
//@uses OrderModel
//@uses OrderUtil
//
//
//
//注文フォーム用Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/04/01
//

require("OrderModelBase.php");

require("OrderUtil.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_manage
//@access public
//@return void
//
//
//指定した会社、部署、回線種別、キャリア、地域に登録されたひな形を取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $pactid
//@param $A_postid(自部署より上の部署一覧)
//@param $type(発注種別)
//@param $cirid(回線種別)
//@param $carid
//@param $arid(地域ID)
//
//@access public
//@return hash
//
//
//指定した会社、部署、回線種別、キャリア、地域のデフォルトに設定されたひな形を取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $pactid
//@param $A_postid(自部署より上の部署一覧)
//@param $type(発注種別)
//@param $cirid(回線種別)
//@param $carid
//@param $arid(地域ID)
//
//@access public
//@return hash
//
//
//ひな形の詳細を取得する
//
//@author igarashi
//@since 2008/05/21
//
//@param $tempid(ひな形ID)
//@param $pactid
//
//@access public
//@return hash
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class OrderTemplateModel extends OrderModelBase {
	constructor(O_db0, H_g_sess, site_flg) {
		super(O_db0, H_g_sess, site_flg);
	}

	getOrderTemplate(pactid, A_postid, type, cirid, carid, arid = "") //MかH
	{
		var division = "";

		if (this.orderByCategoryPatternName) {
			division = "_" + this.orderByCategoryPatternName;
		}

		var otsql = "SELECT type FROM pact_tb WHERE pactid=" + pactid;
		var ordtype = this.get_DB().queryOne(otsql);
		var H_template = Array();

		if (true == Array.isArray(A_postid)) //重複を除いて、配列から文字列へ
			//付属品はとその他は回線種別で絞り込めない
			{
				var A_postlist = array_unique(A_postid);
				var postlist_str = join(",", A_postlist);
				var sql = "SELECT tempid, defflg || tempname FROM mt_template" + division + "_tb WHERE pactid=" + pactid + " AND type='" + type + "'" + " AND carid=" + carid;

				if (!(-1 !== ["A", "M"].indexOf(type))) {
					sql += " AND cirid=" + cirid;
				}

				sql += " AND postid IN(" + postlist_str + ")";

				if ("" != arid) {
					sql += " AND (arid=" + arid + " OR arid=0)";
				}

				sql += " AND (ordtype IS NULL OR (ordtype IS NOT NULL";

				if ("H" == ordtype) {
					sql += " AND ordtype = 'HL'";
				} else {
					sql += " AND ordtype != 'HL'";
				}

				sql += "))";
				sql += " ORDER BY tempid";
				H_template = this.get_DB().queryAssoc(sql);
			}

		return H_template;
	}

	getOrderDefTemplate(pactid, A_postlist, type, cirid, carid, arid = "") //MかH
	{
		var division = "";

		if (this.orderByCategoryPatternName) {
			division = "_" + this.orderByCategoryPatternName;
		}

		var otsql = "SELECT type FROM pact_tb WHERE pactid=" + pactid;
		var ordtype = this.get_DB().queryOne(otsql);
		var loop = A_postlist.length;

		for (var idx = 0; idx < loop; idx++) //SQL文
		//付属品は回線種別で絞り込めない
		//既定雛型を部署優先に 20091124miya
		{
			var sql = "SELECT tempid FROM mt_template" + division + "_tb WHERE pactid=" + pactid + " AND type='" + type + "'" + " AND carid=" + carid;

			if (!(-1 !== ["A", "M"].indexOf(type))) {
				sql += " AND cirid=" + cirid;
			}

			if (arid != "") {
				sql += " AND arid IN (0," + arid + ")";
			}

			sql += " AND postid=" + A_postlist[idx] + " AND defflg=1 AND (ordtype IS NULL OR (ordtype IS NOT NULL";

			if ("H" == ordtype) {
				sql += " AND ordtype = 'HL'";
			} else {
				sql += " AND ordtype != 'HL'";
			}

			sql += ")) ORDER BY arid DESC";
			var result = this.get_DB().queryOne(sql);

			if (result != "") //break;
				{
					var deftemp = result;
				}
		}

		return deftemp;
	}

	getOrderTemplateDetail(tempid, pactid) {
		var division = "";

		if (this.orderByCategoryPatternName) {
			division = "_" + this.orderByCategoryPatternName;
		}

		var sql = "SELECT mask, value, product, free_acce, defflg, cirid, ppid FROM mt_template" + division + "_tb " + "WHERE pactid=" + pactid + " AND tempid=" + tempid;
		return this.get_DB().queryRowHash(sql);
	}

	__destruct() {
		super.__destruct();
	}

};