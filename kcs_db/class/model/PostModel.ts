import ModelBase from './ModelBase';
import TelModel from './TelModel';
import MtTableUtil from '../MtTableUtil';

export default class PostModel extends ModelBase {
	static FILENAME = "model/PostModel";

	constructor(O_db0 = undefined) {
		super(O_db0);
	}

	getParent(postid: number) {
		if (isNaN(Number(postid))) {
			this.getOut().errorOut(0, "PostModel::getParent() postidが正しく指定されていません", 0);
		}

		var sql = "select " + "postidparent " + "from " + "post_relation_tb " + "where " + "postidchild = " + postid;
		return this.getDB().queryOne(sql);
	}

	getPostHash(pactid: number, shopid: number, type: string, carid: number | string = "") {
		var where_car = "";

		if ("" != carid) {
			where_car = "and srel.carid = " + this.getDB().dbQuote(carid, "integer", true) + " ";
		}

		var post_sql = "select " + "po.postid," + "po.postname " + "from " + "shop_relation_tb srel inner join post_tb po on srel.postid = po.postid " + "where " + "srel.shopid = " + this.getDB().dbQuote(shopid, "integer", true) + " " + "and srel.pactid = " + this.getDB().dbQuote(pactid, "integer", true) + " " + where_car + "group by po.postid,po.postname " + "order by po.postid";

		if (type == "assoc") {
			return this.getDB().queryAssoc(post_sql);
		} else if (type == "col") {
			return this.getDB().queryCol(post_sql);
		} else {
			return this.getDB().getHash(post_sql);
		}
	}

	async getParentList(postid: number, tableno: string = "") //※PostgreSQLのみ使用可能(DB変更の際は実装を変更すること)
	//再帰SQLを使用するためにストアドファンクション(connectby)を使用
	//$sql = "select " .
	//					"postidparent " .
	//				"from " .
	//					"connectby(" .
	//								"'" . $tablename . "', " .
	//								"'postidparent', " .
	//								"'postidchild', " .
	//								$postid . "::text, " .
	//								"0" .
	//							") as prel (" .
	//								"postidparent integer, " .
	//								"postidchild integer, " .
	//								"level integer" .
	//							") " .
	//				"order by " .
	//					"level desc," .
	//					"postidchild";
	//		$A_result = $this->getDB()->queryCol($sql);
	{
		if (isNaN(Number(postid))) {
			this.getOut().errorOut(0, "PostModel::getParentList() postidが正しく指定されていません", 0);
		}

		var tablename = MtTableUtil.makeTableName("post_relation_tb", tableno);
		var sql = "select pactid,level,postidparent from " + tablename + " where postidchild = " + postid;
		var [pactid, level, postidparent] = await this.getDB().queryRow(sql);

		if (isNaN(Number(pactid))) {
			return false;
		}

		sql = "select postidparent,postidchild,level" + " from " + tablename + " where " + " pactid = " + pactid + " and level < " + level + " order by level desc";
		var A_post = await this.getDB().queryHash(sql);
		var A_result = [postid];

		if (true == Array.isArray(A_post)) {
			var cur_level = level;

			for (var cnt = 0; cnt < A_post.length; cnt++) {
				if (A_post[cnt].level < level) {
					if (A_post[cnt].postidchild == postidparent) {
						A_result.unshift(postidparent);
						postidparent = A_post[cnt].postidparent;
						level--;
					}
				}
			}
		}

		return A_result;
	}

	async getChildList(pactid: number, postid: number, tableno: string = "") //※PostgreSQLのみ使用可能(DB変更の際は実装を変更すること)
	//再帰SQLを使用するためにストアドファンクション(connectby)を使用
	//部署が多いと凄くsqlが遅くなるので変更
	//		$sql = "select " .
	//					"postidchild " .
	//				"from " .
	//					"connectby(" .
	//								"'" . $tablename . "', " .
	//								"'postidchild', " .
	//								"'postidparent', " .
	//								$postid . "::text, " .
	//								"0" .
	//							") as prel (" .
	//								"postidchild integer, " .
	//								"postidparent integer, " .
	//								"level integer" .
	//							") " .
	//				"order by " .
	//					"level," .
	//					"postidchild";
	//		$A_result = $this->getDB()->queryCol($sql);
	{
		if (isNaN(Number(pactid))) {
			this.getOut().errorOut(0, "PostModel::getChildList() postidが正しく指定されていません", 0);
		}

		var tablename = MtTableUtil.makeTableName("post_relation_tb", tableno);
		var sql = "select postidparent,postidchild,level" + " from " + tablename + " where " + " pactid=" + pactid + " order by level";
		var H_post = await this.getDB().queryHash(sql);
		var H_postid = Array();
		var A_result = Array();
		var chk = false;

		for (var cnt = 0; cnt < H_post.length; cnt++) {
			var lvl = H_post[cnt].level;
			var pid = H_post[cnt].postidparent;
			var cid = H_post[cnt].postidchild;

			if (chk == false) {
				if (cid == postid) {
					chk = true;
					var level = lvl;
					H_postid[cid] = true;
					A_result.push(cid);
				}
			} else {
				if (lvl > level) {
					if (undefined !== H_postid[pid] == true && H_postid[pid] == true) {
						H_postid[cid] = true;
						A_result.push(cid);
					}
				}
			}
		}

		// delete H_postid;
		H_postid = [];
		return A_result;
	}

	getPostData(postid: number | boolean, tableno:string | string = "") {
		if (isNaN(Number(postid))) {
			this.getOut().errorOut(0, "PostModel::getPostData() postidが正しく指定されていません", 0);
		}

		var tablename = MtTableUtil.makeTableName("post_tb", tableno);
		var sql = "select " + "postname," + "userpostid " + "from " + tablename + " " + "where " + "postid = " + postid;
		return this.getDB().queryRowHash(sql);
	}

	getPostDataList(A_postid: any, tableno:string | string = "") {
		var tablename = MtTableUtil.makeTableName("post_tb", tableno);
		var sql = "select " + "postid," + "postname," + "userpostid " + "from " + tablename + " " + "where " + "postid in (" + A_postid.join(",") + ")";
		return this.getDB().queryKeyAssoc(sql);
	}

	getRootPostid(pactid: number, level: number = 0, tableno:string = "") //入力パラメータのエラーチェック
	{
		if (isNaN(Number(pactid))) {
			this.getOut().errorOut(0, "PostModel::getRootPostid() pactidが正しく指定されていません", false);
		}

		var tablename = MtTableUtil.makeTableName("post_relation_tb", tableno);
		var sql = "select " + "postidparent " + "from " + tablename + " " + "where " + "pactid = " + pactid + " " + "and postidparent = postidchild " + "and level = 0";
		return this.getDB().queryOne(sql);
	}

	getPostidFromTel(telno_view: number | string, pactid: number, carid: number, tableno = "") //入力パラメータのエラーチェック
	//電話番号から不要な文字列を削除する(telno_view -> telno)
	{
		if (telno_view == "") {
			this.getOut().errorOut(0, "PostModel::getPostidFromTel() telno_viewがありません", false);
		}

		if (isNaN(Number(pactid))) {
			this.getOut().errorOut(0, "PostModel::getPostidFromTel() pactidが正しく指定されていません", false);
		}

		if (isNaN(Number(carid))) {
			this.getOut().errorOut(0, "PostModel::getPostidFromTel() caridが正しく指定されていません", false);
		}

		var tablename = MtTableUtil.makeTableName("tel_tb", tableno);
		var telno = TelModel.telnoFromTelview(telno_view);
		var sql = "select " + "postid " + "from " + tablename + " " + "where " + "pactid = " + pactid + " " + "and carid = " + carid + " " + "and telno = '" + telno + "'";
		return this.getDB().queryOne(sql);
	}

	getPostidFromUser(userid: string, pactid: number) //入力パラメータのエラーチェック
	{
		if (isNaN(Number(userid))) {
			this.getOut().errorOut(0, "PostModel::getPostidFromUser() useridが正しく指定されていません", false);
		}

		if (isNaN(Number(pactid))) {
			this.getOut().errorOut(0, "PostModel::getPostidFromUser() pactidが正しく指定されていません", false);
		}

		var sql = "select " + "postid " + "from " + "user_tb " + "where " + "pactid = " + pactid + " " + "and userid = " + userid;
		return this.getDB().queryOne(sql);
	}

	getPostNameOne(postid: number, tb = "post_tb") {
		var sql = "select postname from " + tb + " where postid=" + this.getDB().dbQuote(postid, "integer", true, "postid");
		return this.getDB().queryOne(sql);
	}

	getCarRelShopFromPost(postid: number) {
		this.getOut().debugOut(PostModel.FILENAME + "::getCarRelShopFromPost(" + postid + ")", 0);
		var sql = "SELECT carid, shopid FROM shop_relation_tb WHERE postid = " + this.getDB().dbQuote(postid, "integer", true);
		this.getOut().debugOut(PostModel.FILENAME + "::getCarRelShopFromPost():sql->" + sql, 0);
		return this.getDB().queryAssoc(sql);
	}

	async checkPostExist(postid: number, tb = "post_tb") {
		var sql = "select count(postid) from " + tb + " where postid=" + this.getDB().dbQuote(postid, "integer", true);
		var res = await this.getDB().queryOne(sql);

		if (res > 0) {
			return true;
		} else {
			return false;
		}
	}

	getUpperLevelPostidList(pactid: number, level: number, tableno: number) {
		var sql = "select postidchild from post_relation_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "level < " + level;
		return this.getDB().queryCol(sql);
	}

	getLevelPostidList(pactid: number, level: number, tableno: number) {
		var sql = "select postidchild from post_relation_" + tableno + "_tb " + "where pactid = " + pactid + " and " + "level = " + level;
		return this.getDB().queryCol(sql);
	}

	async getPostrelationLevel(pactid:number, table:number) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
	{
		var H_return:any;
		var sql_str = "select postidparent,postidchild,level " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
		var O_result = await this.getDB().query(sql_str);

		O_result.forEach(result => {
			H_return[result.postidchild] = {
				postidparent: result.postidparent,
				level: result.level
			};
		});

		return H_return;
	}

	async getTargetRootPostid(pactid:number, curpostid:number, postreltable:number, level:number) //部署構成を取得
	{
		var H_postrellevel:any = await this.getPostrelationLevel(pactid, postreltable);
		var targetpostid = curpostid;
		var targetlevel = -1;

		while (level != targetlevel) //指定された部署ＩＤが連想配列のキーとして存在している場合
		{
			if (!H_postrellevel[targetpostid] == false) //親部署ＩＤを返す
				//指定された部署ＩＤが連想配列のキーとして存在しない場合はカレント部署ＩＤを（ルート部署になるよう）返す
				{
					targetlevel = H_postrellevel[targetpostid].level;
					targetpostid = H_postrellevel[targetpostid].postidparent;
				} else {
				return curpostid;
			}
		}

		return targetpostid;
	}

	async getPostidFromUserpostid(pactid:number, userpostid:number | string, tableno = "") {
		if (userpostid == "") {
			this.getOut().errorOut(0, "PostModel::getPostidFromUserpostid() userpostidが正しく指定されていません", false);
		}

		var post_tb = MtTableUtil.makeTableName("post_tb", tableno);
		var sql = "select postid from " + post_tb + " where pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and userpostid=" + this.getDB().dbQuote(userpostid, "text", true);
		var postid = await this.getDB().queryOne(sql);

		if (!postid || isNaN(Number(postid))) {
			return false;
		}

		return postid;
	}
};