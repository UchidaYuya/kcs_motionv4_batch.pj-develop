//グループ対応に関わる処理で、多用するものを格納

import MtSetting from "../MtSetting";
import ModelBase from "../model/ModelBase";

export default class GroupModel extends ModelBase {
	static DEF_LANG = "JPN";
	O_Set: MtSetting;
	Language: string;
	H_default_title: any;

	constructor(O_db = undefined) {
		super(O_db);
		this.O_Set = MtSetting.singleton();
		this.O_Set.loadConfig("group");
		this.Language = "JPN";
		this.H_default_title.M = "KCS Motion";
		this.H_default_title.H = "KCS Motion ホットライン";
		this.H_default_title.S = "KCS Motion 販売店";
		this.H_default_title.A = "KCS Motion 管理者";
	}

	getGroupName(groupid: number) {
		var groupname = this.O_Set.existsKey("groupid" + groupid);

		if (false === groupname) {
			return groupname;
		} else {
			return this.O_Set["groupid" + groupid];
		}
	}

	getShopGroupAuth(groupid: number, type = "US") {
		var a_name = "A_shopauthmask" + groupid;
		var is_mask = true;

		if (false === this.O_Set.existsKey(a_name)) //// echo "getShopGroupAuth: $a_name is not exist!<br>";
			{
				is_mask = false;
			} else {
			var A_auth = this.O_Set[a_name];

			if (false === Array.isArray(A_auth) || A_auth.length == 0) //// echo "getShopGroupAuth: $a_name is not array!<br>";
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

	getGroupSystemname(groupid: number) {
		var systemname = this.O_Set.existsKey("systemname" + groupid);

		if (false === systemname) {
			return systemname;
		} else {
			return this.O_Set["systemname" + groupid];
		}
	}

	getGroupTitle(groupid: number, type = "M", language = "") //フル指定
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

	_getAdminMailaddressForGroup(groupid: number) {
		var sql = "SELECT " + "sm.mail " + "FROM " + "shop_tb AS st " + "INNER JOIN " + "shop_member_tb AS sm ON st.memid = sm.memid " + "WHERE " + "st.groupid = " + this.getDB().dbQuote(groupid, "integer", true) + " AND " + "st.type = 'A'";
		return this.getDB().queryOne(sql);
	}
};