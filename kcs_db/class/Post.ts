//部署用クラス
//
//作成者：前田

import DBUtil from './DBUtil';
import ErrorUtil from './ErrorUtil';
import { DB_FETCHMODE_ASSOC } from './MtDBUtil';

export default class Post {
	systempostidtree_str: string | number;
	H_postrel!: string | any[];
	post_tb: string | undefined;
	post_relation_tb: string | undefined;
	H_post!: string;
	posttree_str: string | undefined;
	constructor() {
		this.systempostidtree_str = "";
	}

	Post() {
		if (global.GO_db == false) {
			global.GO_db = new DBUtil();
		}

		if (global.GO_errlog == false) {
			global.GO_errlog = new ErrorUtil();
		}
	}

	getPostNameCode(pactid: number, table: string, userpostidflg = 1) //検索結果を部署ＩＤをキーとした連想配列へ部署名（顧客用部署ＩＤ）を追加
	{
		var sql_str = "select postid,postname,userpostid " + "from " + table + " " + "where pactid = " + pactid + " " + "order by cast(postid as int4)";
		var O_result = global.GO_db.query(sql_str);
		let value_str: string;
		let H_return
		O_result.forEach((result: { userpostid: string | undefined; postname: string; postid: string | number; }) => {
			if (result.userpostid == "" || result.userpostid == undefined || userpostidflg == 0) {
				value_str = htmlspecialchars(result.postname);
			} else {
				value_str = htmlspecialchars(result.postname) + "(" + result.userpostid + ")";
			}

			H_return[result.postid] = value_str;
		});
		return H_return;


	}

	getPostrelation(pactid: number, table: string) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
	{
		var sql_str = "select postidparent,postidchild " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
		var O_result = global.GO_db.query(sql_str);

		let H_return;
		O_result.forEach((result: { postidchild: string | number; postidparent: any; }) => {
			H_return[result.postidchild] = result.postidparent;
		});
		return H_return;
		
	}

	getPostrelationLevel(pactid: number, table: string) //検索結果を子部署ＩＤをキーとした連想配列へ親部署ＩＤを追加
	{
		var sql_str = "select postidparent,postidchild,level " + "from " + table + " " + "where pactid = " + pactid + " and " + "postidparent != postidchild " + "order by postidchild";
		var O_result = global.GO_db.query(sql_str);
		let H_return: { [x: string]: { postidparent: any; level: any; }; };
		O_result.forEach(result => {
			H_return[result.postidchild] = {
				postidparent: result.postidparent,
				level: result.level
			};
			return H_return;
		});

	}

	getPostidparent(postidchild: number) //指定された部署ＩＤが連想配列のキーとして存在している場合
	{
		if (!this.H_postrel[postidchild] == false) //親部署ＩＤを返す
			{
				return this.H_postrel[postidchild];
			} else {
			return false;
		}
	}

	getParentList(postid: number) //postid基準で自分以上の部署を取得
	//重複排除
	{
		var level:any = "";
		var child = postid;
		A_parentlist.push(postid);

		while (level == "" || level != 0) {
			var lv_sql = "SELECT postidparent,level FROM post_relation_tb WHERE postidchild=" + child;
			var H_parent = global.GO_db.getRow(lv_sql);

			if (H_parent != "") {
				child = H_parent[0];
				A_parentlist.push(H_parent[0]);
				level = H_parent[1];
			} else {
				level = 0;
			}
		}

		var A_parentlist:any = A_parentlist.filter(function (value: any, index: any, self: string | any[]) {
			return self.indexOf(value) === index;
		});
		return A_parentlist;
	}

	getPosttreebandUrl(src: string, postid: number, curpostid: number, targetpostid: number) {
		return src;
	}

	getPosttreeband(pactid: number, curpostid: number, targetpostid: number, posttable = "post_tb", postreltable = "post_relation_tb", joint = " -> ", userpostidflg = 1, errflg = 1) //メンバー変数を書き換える　2009/01/09 houshi
	{
		this.post_tb = posttable;
		this.post_relation_tb = postreltable;

		if (this.H_post.length == 0) //部署ＩＤをキー、部署名（顧客用部署ＩＤ）を値とした連想配列を取得
			{
				this.H_post = this.getPostNameCode(pactid, posttable, userpostidflg);
			}

		if (this.H_postrel.length == 0) //子部署ＩＤをキー、親部署ＩＤを値とした連想配列を取得
			{
				this.H_postrel = this.getPostrelation(pactid, postreltable);
			}

		if (this.posttree_str == "") //20040527森原修正
			{
				this.posttree_str = this.getPosttreebandUrl(this.H_post[targetpostid], targetpostid, curpostid, targetpostid);
			}

		if (curpostid == targetpostid) {
			return this.posttree_str;
		} else //親部署ＩＤが取得できた場合
			{
				var parentid = this.getPostidparent(targetpostid);

				if (parentid != false) //所属部署と親部署が違う場合
					{
						if (curpostid != parentid) //20040527森原修正	//20040629miya修正
							{
								this.posttree_str = this.getPosttreebandUrl(this.H_post[parentid], parentid, curpostid, targetpostid) + joint + this.posttree_str;
								this.getPosttreeband(pactid, curpostid, parentid, posttable, postreltable, joint, userpostidflg);
							} else if (curpostid == parentid) //これ以上親部署を捜す必要がないので部署ツリー文字列を返す
							{
								this.posttree_str = this.getPosttreebandUrl(this.H_post[curpostid], curpostid, curpostid, targetpostid) + joint + this.posttree_str;
								return this.posttree_str;
							}
					} else {
					if (errflg == 1) {
						global.GO_errlog.errorOut(12, "pactcd: " + pactid + "curpost: " + curpostid + "targetpost: " + targetpostid);
					} else {
						return errflg;
					}
				}

				return this.posttree_str;
			}
	}

	getSystempostidtreeband(pactid: number, curpostid: number, targetpostid: number, posttable = "post_tb", postreltable = "post_relation_tb", joint = " -> ") //子部署ＩＤをキー、親部署ＩＤを値とした連想配列が存在しないとき
	{
		if (this.H_postrel.length == 0) //子部署ＩＤをキー、親部署ＩＤを値とした連想配列を取得
			{
				this.H_postrel = this.getPostrelation(pactid, postreltable);
			}

		if (this.systempostidtree_str == "") {
			this.systempostidtree_str = targetpostid;
		}

		if (curpostid == targetpostid) //部署構成情報がない場合は-1をかえす
			{
				if (this.H_postrel.length == 0) {
					return -1;
				} else {
					return this.systempostidtree_str;
				}
			} else //親部署ＩＤが取得できた場合
			{
				var parentid = this.getPostidparent(targetpostid);

				if (parentid != false) //所属部署と親部署が違う場合
					{
						if (curpostid != parentid) //再度親部署を捜す
							{
								this.systempostidtree_str = parentid + joint + this.systempostidtree_str;
								this.getSystempostidtreeband(pactid, curpostid, parentid, posttable, postreltable, joint);
							} else if (curpostid == parentid) //これ以上親部署を捜す必要がないので部署ツリー文字列を返す
							{
								this.systempostidtree_str = curpostid + joint + this.systempostidtree_str;
								return this.systempostidtree_str;
							}
					}

				return this.systempostidtree_str;
			}
	}

	getPostData(pactid: string, postid: string, table = "post_tb") {
		var sql_str = "select * from " + table + " where pactid = " + pactid + " and postid = " + postid;
		var H_result = global.GO_db.getRowHash(sql_str);
		return H_result;
	}

	getRootPostid(pactid: number) {
		var sql_str = "select postidparent from post_relation_tb where pactid = " + pactid + " and " + "postidparent = postidchild and " + "level = 0";
		var rootpostid = global.GO_db.getOne(sql_str);
		return rootpostid;
	}

	getTargetRootPostid(pactid: number, curpostid: any, postreltable: string, level: number) //部署構成を取得
	{
		var H_postrellevel = this.getPostrelationLevel(pactid, postreltable);
		var targetpostid = curpostid;
		var targetlevel = -1;

		while (level != targetlevel) //指定された部署ＩＤが連想配列のキーとして存在している場合
		{
			if (!H_postrellevel[targetpostid] == false) //親部署ＩＤを返す
				{
					targetlevel = H_postrellevel[targetpostid].level;
					targetpostid = H_postrellevel[targetpostid].postidparent;
				} else {
				return curpostid;
			}
		}

		return targetpostid;
	}

};

function htmlspecialchars(text: string) {
	return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

