//
//グループ対応に関わる処理で、多用するものを格納
//
//@filesource
//@uses MtSetting
//@package Base
//@subpackage Model
//@author ishizaki
//@since 2008/11/26
//
//
//
//グループ対応に関わる処理で、多用するものを格納
//
//@package Base
//@subpackage Model
//@author ishizaki
//@since 2008/11/26
//

require("MtSetting.php");

require("MtDBUtil.php");

require("ModelBase.php");

//
//初期設定言語
//
//
//O_Set
//
//@var mixed
//@access private
//
//
//H_default_title
//
//@var mixed
//@access private
//
//
//Language
//
//@var text
//@access private
//
//
//__construct
//
//@author ishizaki
//@since 2008/11/26
//
//@access public
//@return void
//
//
//渡されたgroupid のgroupname をかえす
//
//@author ishizaki
//@since 2008/11/26
//
//@param mixed $groupid
//@access public
//@return mixid
//
//
//groupに対応する販売店権限を返す<br/>
//販売店権限は、group.ini 内の A_shopauth + groupid に記述されている。
//
//@author nakanita
//@since 2008/12/03
//
//@param integer $groupid
//@param String $type
//@access public
//@return array
//
//
//getGroupSystemname
//
//@author ishizaki
//@since 2008/11/28
//
//@param mixed $groupid
//@access public
//@return void
//
//
//getGroupTile
//
//@author ishizaki
//@since 2009/03/09
//
//@param mixed $groupid
//@param string $language
//@access public
//@return void
//
//
//指定したグループの管理者のメールアドレスを取得
//
//@author ishizaki
//@since 2009/09/04
//
//@param mixed $groupip
//@access public
//@return void
//
//
//__destruct
//
//@author ishizaki
//@since 2008/11/26
//
//@access public
//@return void
//
class GroupModel extends ModelBase {
	static DEF_LANG = "JPN";

	constructor(O_db = undefined) {
		super(O_db);
		this.O_Set = MtSetting.singleton();
		this.O_Set.loadConfig("group");
		this.Language = "JPN";
		this.H_default_title.M = "KCS Motion";
		this.H_default_title.H = "KCS Motion \u30DB\u30C3\u30C8\u30E9\u30A4\u30F3";
		this.H_default_title.S = "KCS Motion \u8CA9\u58F2\u5E97";
		this.H_default_title.A = "KCS Motion \u7BA1\u7406\u8005";
	}

	getGroupName(groupid) {
		var groupname = this.O_Set.existsKey("groupid" + groupid);

		if (false === groupname) {
			return groupname;
		} else {
			return this.O_Set["groupid" + groupid];
		}
	}

	getShopGroupAuth(groupid, type = "US") {
		var a_name = "A_shopauthmask" + groupid;
		var is_mask = true;

		if (false === this.O_Set.existsKey(a_name)) //echo "getShopGroupAuth: $a_name is not exist!<br>";
			{
				is_mask = false;
			} else {
			var A_auth = this.O_Set[a_name];

			if (false === Array.isArray(A_auth) || A_auth.length == 0) //echo "getShopGroupAuth: $a_name is not array!<br>";
				{
					is_mask = false;
				}
		}

		var sql = "select fncid,fncname,memo,ininame from shop_function_tb" + " where type='" + type + "'" + " and enable=true";

		if (is_mask == true) //マスクされた権限を除く
			{
				sql += " and fncid not in (" + A_auth.join(",") + ")";
			}

		return this.getDB().queryHash(sql);
	}

	getGroupSystemname(groupid) {
		var systemname = this.O_Set.existsKey("systemname" + groupid);

		if (false === systemname) {
			return systemname;
		} else {
			return this.O_Set["systemname" + groupid];
		}
	}

	getGroupTitle(groupid, type = "M", language = "") //フル指定
	{
		var grouptitle = "";
		var grouptitlecode = "";
		grouptitlecode = "grouptitle_" + groupid + "_" + type + "_" + language;

		if (true === this.O_Set.existsKey(grouptitlecode)) {
			grouptitle = this.O_Set[grouptitlecode];
		} else //フル指定でキーが存在しなかったらデフォルト言語で取得を試みる
			{
				grouptitlecode = "grouptitle_" + groupid + "_" + type + "_" + this.Language;

				if (true == this.O_Set.existsKey(grouptitlecode)) {
					grouptitle = this.O_Set[grouptitlecode];
				} else //それでもない場合はグループIDの初期値をみる
					{
						grouptitlecode = "grouptitle_" + groupid;

						if (true === this.O_Set.existsKey(grouptitlecode)) {
							grouptitle = this.O_Set[grouptitlecode];
						} else //まだない場合はシステム共通の初期値をみる
							{
								grouptitle = this.H_default_title[type];
							}
					}
			}

		return grouptitle;
	}

	_getAdminMailaddressForGroup(groupid) {
		var sql = "SELECT " + "sm.mail " + "FROM " + "shop_tb AS st " + "INNER JOIN " + "shop_member_tb AS sm ON st.memid = sm.memid " + "WHERE " + "st.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "st.type = 'A'";
		return this.getDB().queryOne(sql);
	}

	__destruct() {}

};