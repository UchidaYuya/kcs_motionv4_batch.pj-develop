//
//部署データ取込処理 （Model）
//
//更新履歴：<br>
//2012/02/17 宝子山浩平 作成
//
//ImportPostDataModel
//
//@package script
//@subpackage Model
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2012/02/17
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//ImportPostDataModel
//
//@uses ModelBase
//@package
//@author web
//@since 2012/02/27
//

require("model/ModelBase.php");

require("model/PostModel.php");

//
//__construct
//
//@author houshiyama
//@since 2012/02/17
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//対象テーブル決定
//
//@author web
//@since 2012/02/27
//
//@param mixed $trgDate
//@access protected
//@return void
//
//
//データディレクトリ取得
//
//@author
//@since 2012/02/17
//
//@param mixed $trgDate
//@access public
//@return void
//
//
//データファイルの中身を取得
//
//@author web
//@since 2012/03/08
//
//@param mixed $path
//@access public
//@return void
//
//
//プロテクトファイルの中身を取得
//
//@author web
//@since 2012/02/21
//
//@param mixed $dir
//@access public
//@return void
//
//
//userpostid一覧取得（rootと不明部署は除外）
//
//@author web
//@since 2012/02/27
//
//@param mixed $pactid
//@access public
//@return void
//
//
//不明部署の存在チェック
//
//@author web
//@since 2012/02/28
//
//@param mixed $pactid
//@access public
//@return void
//
//
//不明部署作成
//
//@author web
//@since 2012/02/28
//
//@param mixed $pactid
//@access public
//@return void
//
//
//postids1にあってpostids2に無い部署取得
//diffフラグで逆の部署取得
//
//@author web
//@since 2012/02/28
//
//@param mixed $postids1
//@param mixed $postids2
//@param mixed $diff
//@access public
//@return void
//
//
//post_tbに外部参照してるテーブル一覧
//
//@author web
//@since 2012/02/27
//
//@param mixed $table
//@access public
//@return void
//
//
//部署削除の為の準備
//
//@author web
//@since 2012/03/02
//
//@param mixed $data
//@param mixed $unknownPostid
//@access public
//@return void
//
//
//部署削除処理
//
//@author web
//@since 2012/02/29
//
//@param mixed $data
//@access public
//@return void
//
//
//部署追加処理
//
//@author web
//@since 2012/02/29
//
//@param mixed $data
//@access public
//@return void
//
//
//部署変更処理
//
//@author web
//@since 2012/02/29
//
//@param mixed $data
//@access public
//@return void
//
//
//階層構造再構築
//
//@author web
//@since 2012/02/29
//
//@param mixed $data
//@param mixed $protectPosts
//@access public
//@return void
//
//
//承認先部署設定
//
//@author web
//@since 2012/03/06
//
//@param mixed $data
//@param mixed $unknownPostid
//@access public
//@return void
//
//
//承認先部署設定
//
//@author web
//@since 2012/03/06
//
//@param mixed $data
//@access protected
//@return void
//
//
//指定テーブルに対して外部参照している元を取得する
//
//@author web
//@since 2012/02/20
//
//@access public
//@return void
//
//
//root部署のuserpostid取得
//
//@author web
//@since 2012/03/02
//
//@param mixed $pactid
//@param mixed $trgDate
//@access public
//@return void
//
//
//userpostidから部署情報取得
//
//@author web
//@since 2012/03/05
//
//@param mixed $pactid
//@param mixed $userpostids
//@access public
//@return void
//
//
//StatusLogファイルポインタ設定
//
//@author web
//@since 2012/02/28
//
//@param mixed $fp
//@access public
//@return void
//
//
//beginのラッパー
//
//@author web
//@since 2012/02/29
//
//@access public
//@return void
//
//
//commitのラッパー
//
//@author web
//@since 2012/02/29
//
//@access public
//@return void
//
//
//rollbackのラッパー
//
//@author web
//@since 2012/02/29
//
//@access public
//@return void
//
//
//inTransactionのラッパー
//
//@author web
//@since 2012/03/02
//
//@access public
//@return void
//
//
//PostModel取得
//
//@author
//@since 2012/02/17
//
//@access protected
//@return void
//
//
//insert時のpostid取得
//現在：シーケンス
//過去：現在テーブルから取得
//
//@author web
//@since 2012/03/01
//
//@param mixed $pactid
//@param mixed $userpostid
//@access protected
//@return void
//
//
//オーダーをキャンセルする
//
//@author web
//@since 2012/03/06
//
//@param mixed $pactid
//@param mixed $userpostid
//@param mixed $orderid
//@access protected
//@return void
//
//
//_cancelOrder
//取り消しにする
//@author date
//@since 2015/05/26
//
//@param mixed $pactid
//@param mixed $userpostid
//@param mixed $orderid
//@access protected
//@return void
//
//
//承認先部署取得 <br>
//ファイルに無ければ親部署を遡ってDBから取得
//
//@author web
//@since 2012/03/06
//
//@access protected
//@return void
//
//
//承認先部署取得 <br>
//ファイルに無ければ親部署を遡ってDBから取得
//
//@author web
//@since 2012/03/07
//
//@access protected
//@return void
//
//
//ショップのmemid取得
//
//@author web
//@since 2012/03/07
//
//@param mixed $shopid
//@access protected
//@return void
//
//
//post_relation_tb系にデータがあるか調べる
//
//@author web
//@since 2012/03/15
//
//@param mixed $pactid
//@param mixed $postidparent
//@param mixed $postidchild
//@access protected
//@return void
//
//
//queryのオーバーライト
//
//@author web
//@since 2012/03/05
//
//@param mixed $sql
//@param mixed $flag
//@access protected
//@return void
//
//
//__destruct
//
//@author houshiyama
//@since 2012/02/17
//
//@access public
//@return void
//
class ImportPostDataModel extends ModelBase {
	static DEBUG = true;
	static UNKNOWNPOSTNAME = "\u4E0D\u660E\u90E8\u7F72";
	static ORDERSTATUS_CANCEL = 230;
	static ORDERSTATUS_DELETE = 220;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
	}

	setTargetTables(trgDate) {
		this._trgDate = trgDate;

		if (trgDate == date("Ym")) {
			this._post_tb = "post_tb";
			this._postrel_tb = "post_relation_tb";
		} else //対象テーブル番号を取得
			{
				this._tableNo = MtTableUtil.getTableNo(trgDate, true);
				this._post_tb = "post_" + this._tableNo + "_tb";
				this._postrel_tb = "post_relation_" + this._tableNo + "_tb";
			}
	}

	getDataDir(trgDate) {
		var dataDir = this.getSetting().KCS_DIR + this.getSetting().KCS_DATA + "/" + trgDate + this.getSetting().POSTDATA_DIR + "/";
		return dataDir;
	}

	getDataFileContents(path) {
		if (!is_file(path)) {
			throw new Error(path + " \u306F\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
		}

		var contents = file_get_contents(path);
		contents = mb_convert_encoding(contents, "UTF-8", "auto");
		return contents;
	}

	getProtectFileContents(path) {
		var contents;

		if (!(contents = file(path, FILE_IGNORE_NEW_LINES))) {
			contents = Array();
		}

		return contents;
	}

	getUserPostids(pactid) {
		var postname = pactid + "unknown";
		var unknownPost = this.getSetting()[postname];
		var sql = "select p.userpostid from " + this._post_tb + " p" + " inner join " + this._postrel_tb + " pl on p.postid = pl.postidchild" + " where p.pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and p.userpostid!=" + this.getDB().dbQuote(unknownPost, "text", true) + " and pl.level!=0";
		var postids = this.getDB().queryCol(sql);
		return postids;
	}

	checkUnknownPostExists(pactid) {
		var postid;
		var postname = pactid + "unknown";
		var unknownPost = this.getSetting()[postname];
		var sql = "select postid from " + this._post_tb + " where pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and userpostid=" + this.getDB().dbQuote(unknownPost, "text", true);

		if (!(postid = this.getDB().queryOne(sql))) {
			return false;
		}

		return postid;
	}

	makeUnknownPost(pactid) {
		var postid;
		var postname = pactid + "unknown";
		var unknownPost = this.getSetting()[postname];

		if (!(postid = this._getInsertPostid(pactid, unknownPost))) {
			throw new Error(pactid + "\tprepare\t" + this._trgDate + "\t" + unknownPost + "\tpost_tb\u304B\u3089postid\u3092\u53D6\u5F97\u51FA\u6765\u307E\u305B\u3093\u3067\u3057\u305F\n");
		}

		var sql = "insert into " + this._post_tb + " (pactid,postid,userpostid,postname,recdate,fixdate) values " + "(" + this.getDB().dbQuote(pactid, "integer", true) + "," + this.getDB().dbQuote(postid, "integer", true) + "," + this.getDB().dbQuote(unknownPost, "text", true) + "," + this.getDB().dbQuote(ImportPostDataModel.UNKNOWNPOSTNAME, "text", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ")";

		if (!(res = this._query(sql, false))) {
			throw new Error(pactid + "\t" + this._trgDate + "\t" + unknownPost + "\t\u4E0D\u660E\u90E8\u7F72\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F (" + sql + ")\n");
		}

		var postModel = this._getPostModel();

		var rootPostid = postModel.getRootPostid(pactid, 0, this._tableNo);
		sql = "insert into " + this._postrel_tb + " values " + "(" + this.getDB().dbQuote(pactid, "integer", true) + "," + this.getDB().dbQuote(rootPostid, "integer", true) + "," + this.getDB().dbQuote(postid, "integer", true) + ",1)";

		if (!(res = this._query(sql, false))) {
			throw new Error(pactid + "\t" + this._trgDate + "\t" + unknownPost + "\t\u4E0D\u660E\u90E8\u7F72\u306E\u4F5C\u6210\u306B\u5931\u6557\u3057\u307E\u3057\u305F (" + sql + ")\n");
		}

		return postid;
	}

	getDifferencePosts(postids1, postids2, diff = true) {
		var targets = Array();
		var notargets = Array();

		for (var postid of Object.values(postids2)) {
			if (!(-1 !== postids1.indexOf(postid))) {
				targets.push(postid);
			} else {
				notargets.push(postid);
			}
		}

		if (!diff) {
			return notargets;
		} else {
			return targets;
		}
	}

	getPostFkTables() {
		return this.getFkTables(this._post_tb);
	}

	prepareDeletePosts(data, unknownPostid) {
		var tables = this.getPostFkTables();
		var mess = "";

		for (var row of Object.values(data)) //削除不可部署ならばスキップ
		{
			if (row.fix_flag) {
				continue;
			}

			if (this._trgDate == date("Ym")) {
				var select = "select orderid,status from mt_order_tb " + " where " + " pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and postid=" + this.getDB().dbQuote(row.postid, "integer", true) + " and status < 131";
				var orders = this.getDB().queryHash(select);

				if (PEAR.isError(orders)) {
					mess += row.pactid + "\tdel\t" + this._trgDate + "\t" + row.userpostid + "\t" + select + "\t" + orders.getDebugInfo() + "\n";
					continue;
				}

				if (orders.length > 0) {
					for (var order of Object.values(orders)) //申請却下は無視
					{
						if (order.status == 30) ///						continue 2;			//	20150821 申請却下の注文がある場合、不明部署への移動が行われなれずに
							//抜けてしまうため、continueは1にする
							//販売店前（キャンセル）
							{
								continue;
							} else if (order.status < 50) //$orderResult = $this->_cancelOrder($row["pactid"], $row["userpostid"], $order["orderid"]);
							{
								var orderResult = this._deleteOrder(row.pactid, row.userpostid, order.orderid);

								if ("string" === typeof orderResult) {
									mess += orderResult;
									continue;
								}
							} else {
							var update = "update mt_order_tb set " + "postid=" + this.getDB().dbQuote(unknownPostid, "integer", true) + " where " + " pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and orderid=" + this.getDB().dbQuote(order.orderid, "integer", true);

							var res = this._query(update, false);

							if (PEAR.isError(res, false)) {
								mess += row.pactid + "\tdel\t" + this._trgDate + "\t" + row.userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
								continue;
							}
						}
					}
				}
			}

			for (var table of Object.values(tables)) //20130510森原変更ここから
			//今まで更新・削除対象が1件以上なら更新・削除のSQLを
			//実行していたが、件数にかかわらず更新・削除するようにした
			//$res = $this->getDB()->queryOne($select, false);
			//if (PEAR::isError($res)) {
			//$mess .= $row["pactid"] . "\tdel\t" . $this->_trgDate . "\t" . $row["userpostid"] . "\t" . $select . "\t" . $res->getDebugInfo() . "\n";
			//continue;
			//}
			//if ($res > 0) {
			//削除条件
			//}
			//20130510森原変更ここまで
			{
				var where = " where " + " pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and " + table.from_column + "=" + this.getDB().dbQuote(row.postid, "integer", true);
				select = "select count(*) from " + table.tablename + where;

				if (table.from_column == "postidchild" || table.from_column == "postidfrom" || table.tablename == "faq_rel_pact_tb" || table.tablename == "info_relation_tb" || table.tablename == "post_rel_shop_info_tb" || table.tablename == "shop_relation_tb" || table.tablename == "iccard_close_tb") {
					var delete = "delete from " + table.tablename + where;
					res = this._query(delete, false);

					if (PEAR.isError(res)) {
						mess += row.pactid + "\tdel\t" + this._trgDate + "\t" + row.userpostid + "\t" + delete + "\t" + res.getDebugInfo() + "\n";
						continue;
					}
				} else {
					update = "update " + table.tablename + " set " + table.from_column + "=" + this.getDB().dbQuote(unknownPostid, "integer", true) + where;
					res = this._query(update, false);

					if (PEAR.isError(res)) {
						mess += row.pactid + "\tdel\t" + this._trgDate + "\t" + row.userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
						continue;
					}
				}
			}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	deletePosts(data) //レベルで並び替え（降順）
	{
		for (var key in data) {
			var row = data[key];
			level[key] = row.level;
		}

		array_multisort(level, SORT_DESC, data);
		var mess = "";

		for (var row of Object.values(data)) //削除不可部署ならばスキップ
		{
			if (row.fix_flag) {
				continue;
			}

			var sql = "delete from " + this._post_tb + " where " + "pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and postid=" + this.getDB().dbQuote(row.postid, "integer", true);

			var res = this._query(sql, false);

			if (PEAR.isError(res)) {
				mess += row.pactid + "\tdel\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + res.getDebugInfo() + "\n";
			}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	insertPosts(data) //レベルで並び替え（昇順）
	{
		for (var key in data) {
			var row = data[key];
			level[key] = row.level;
		}

		array_multisort(level, SORT_ASC, data);
		var mess = "";

		for (var row of Object.values(data)) {
			if (!(row.postid = this._getInsertPostid(row.pactid, row.userpostid))) {
				mess += row.pactid + "\tadd\t" + this._trgDate + "\t" + row.userpostid + "\n";
			}

			var sql = "insert into " + this._post_tb + " (pactid,postid,userpostid,postname,recdate,fixdate) values " + "(" + this.getDB().dbQuote(row.pactid, "integer", true) + "," + this.getDB().dbQuote(row.postid, "integer", true) + "," + this.getDB().dbQuote(row.userpostid, "text", true) + "," + this.getDB().dbQuote(row.postname, "text", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + "," + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + ")";

			var res = this._query(sql, false);

			if (PEAR.isError(res)) {
				mess += row.pactid + "\tadd\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + res.getDebugInfo() + "\n";
			}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	modifyPosts(data) {
		var mess = "";

		for (var row of Object.values(data)) {
			if (!(row.postid = this._getPostModel().getPostidFromUserpostid(row.pactid, row.userpostid))) {
				return false;
			}

			var sql = "select postname from " + this._post_tb + " where " + "pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and postid=" + this.getDB().dbQuote(row.postid, "integer", true);
			var postname = this.getDB().queryOne(sql, false);

			if (PEAR.isError(postname)) {
				mess += row.pactid + "\tmod\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + postname.getDebugInfo() + "\n";
			}

			if (postname != row.postname) {
				sql = "update " + this._post_tb + " set " + "postname=" + this.getDB().dbQuote(row.postname, "text", true) + ",fixdate=" + this.getDB().dbQuote(this.getDB().getNow(), "timestamp", true) + " where " + "pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and postid=" + this.getDB().dbQuote(row.postid, "integer", true);

				var res = this._query(sql, false);

				if (PEAR.isError(res)) {
					mess += row.pactid + "\tmod\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + res.getDebugInfo() + "\n";
				}
			}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	rebuildPostRelation(data, protectPosts) //削除不能部署のpostid取得
	{
		var protectids = Array();
		var sql = "select postid from " + this._post_tb + " where " + "pactid=" + this.getDB().dbQuote(data[0].pactid, "integer", true) + " and (userpostid in ('" + protectPosts.join("','") + "')" + " or fix_flag=true)";
		var ids = this.getDB().queryCol(sql);

		if (!!ids) {
			protectids = ids;
		}

		for (var row of Object.values(data)) {
			row.postid = this._getPostModel().getPostidFromUserpostid(row.pactid, row.userpostid, this._tableNo);

			if (!(row.pre_postidparent = this._getPostModel().getParent(row.postid))) {
				row.pre_postidparent = undefined;
			}
		}

		var postname = data[0].pactid + "unknown";
		var unknownPost = this.getSetting()[postname];

		var unknownPostid = this._getPostModel().getPostidFromUserpostid(data[0].pactid, unknownPost, this._tableNo);

		var rootPostid = this._getPostModel().getRootPostid(data[0].pactid, 0, this._tableNo);

		protectids.push(unknownPostid);
		protectids.push(rootPostid);
		sql = "delete from " + this._postrel_tb + " where " + "pactid=" + this.getDB().dbQuote(data[0].pactid, "integer", true) + " and postidchild not in (" + protectids.join(",") + ")";

		var res = this._query(sql, false);

		if (PEAR.isError(res)) {
			throw new Error(data[0].pactid + "\trebuild post_relation\t" + this._trgDate + "\t" + this._postrel_tb + "\t" + sql + "\t" + res.getDebugInfo());
		}

		var mess = "";

		for (var row of Object.values(data)) {
			if (Math.round(row.level) == 1) {
				row.postidparent = rootPostid;
			} else {
				row.postidparent = this._getPostModel().getPostidFromUserpostid(row.pactid, row.userpostid_parent, this._tableNo);
			}

			if (!row.postid || !row.postidparent) {
				if (!row.postid) {
					mess += row.pactid + "\trebuild post_relation\t" + this._trgDate + "\t" + row.userpostid + "\tpostid\u53D6\u5F97\u3067\u304D\u305A\n";
				}

				if (!row.postidparent) {
					mess += row.pactid + "\trebuild post_relation\t" + this._trgDate + "\t" + row.userpostid_parent + "\t\u89AApostid\u53D6\u5F97\u3067\u304D\u305A\n";
				}
			} else {
				if (this._checkPostRelationExists(row.pactid, row.postidparent, row.postid)) {
					continue;
				}

				sql = "insert into " + this._postrel_tb + " values " + "(" + this.getDB().dbQuote(row.pactid, "integer", true) + "," + this.getDB().dbQuote(row.postidparent, "integer", true) + "," + this.getDB().dbQuote(row.postid, "integer", true) + "," + this.getDB().dbQuote(row.level, "integer", true) + ")";
				res = this._query(sql, false);

				if (PEAR.isError(res)) {
					mess += row.pactid + "\trebuild post_relation\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + res.getDebugInfo() + "\n";
					return mess;
				}
			}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	rebuildRecognize(data, unknownPostid) {
		var mess = "";

		for (var row of Object.values(data)) {
			var sql = "select postidto from recognize_tb" + " where pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and postidfrom=" + this.getDB().dbQuote(row.postid, "integer", true);
			var oldPostidto = this.getDB().queryOne(sql, false);

			if (PEAR.isError(oldPostidto)) {
				return false;
			}

			if (!row.recogpostid && undefined !== row.pre_postidparent && row.postidparent == row.pre_postidparent && oldPostidto != unknownPostid) {
				continue;
			}

			var postidto = this._getRecogPostid(row);

			if (!postidto) {
				continue;
			}

			if (is_null(oldPostidto)) {
				sql = "insert into recognize_tb values " + "(" + this.getDB().dbQuote(row.pactid, "integer", true) + "," + this.getDB().dbQuote(row.postid, "integer", true) + "," + this.getDB().dbQuote(postidto, "integer", true) + ")";
			} else {
				sql = "update recognize_tb set " + "postidto=" + this.getDB().dbQuote(postidto, "integer", true) + " where " + "pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and postidfrom=" + this.getDB().dbQuote(row.postid, "integer", true);
			}

			var res = this._query(sql, false);

			if (PEAR.isError(res)) {
				mess += row.pactid + "\trebuild recognize\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + res.getDebugInfo() + "\n";
			}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	rebuildShopRelation(data) {
		var mess = "";

		for (var row of Object.values(data)) {
			if (!row.shopinfo && undefined !== row.pre_postidparent && row.postidparent == row.pre_postidparent) {
				continue;
			}

			var shopinfo = this._getShopInfo(row);

			if (!shopinfo) {
				continue;
			}

			var sql = "delete from shop_relation_tb" + " where pactid=" + this.getDB().dbQuote(row.pactid, "integer", true) + " and postid=" + this.getDB().dbQuote(row.postid, "integer", true);

			var res = this._query(sql, false);

			if (PEAR.isError(res)) {
				mess += row.pactid + "\trebuild shop_relation\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + res.getDebugInfo() + "\n";
				continue;
			}

			for (var line of Object.values(shopinfo)) {
				sql = "insert into shop_relation_tb values " + "(" + this.getDB().dbQuote(row.pactid, "integer", true) + "," + this.getDB().dbQuote(row.postid, "integer", true) + "," + this.getDB().dbQuote(line.shopid, "integer", true) + "," + this.getDB().dbQuote(line.carid, "integer", true) + "," + this.getDB().dbQuote(line.memid, "integer", true) + ")";
				res = this._query(sql, false);

				if (PEAR.isError(res)) {
					mess += data[0].pactid + "\trebuild shop_relation\t" + this._trgDate + "\t" + row.userpostid + "\t" + sql + "\t" + res.getDebugInfo() + "\n";
					continue;
				}
			}
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	getFkTables(table) //指定テーブルに外部参照しているテーブル・カラム一覧
	{
		var row;
		var sql = "select " + " c.relname," + " a.attname," + " a_c.attname as column_name," + " co.conname " + " from " + " pg_catalog.pg_constraint co" + " inner join pg_class c on co.conrelid = c.oid " + " inner join pg_attribute as a on c.oid=a.attrelid and a.attnum=any(co.conkey) " + " inner join pg_class c_c on co.confrelid = c_c.oid " + " inner join pg_attribute as a_c on c_c.oid=a_c.attrelid and a_c.attnum=any(co.confkey) " + " where " + " co.confrelid = (select a.attrelid from " + " pg_catalog.pg_attribute a " + " inner join pg_class c on a.attrelid=c.oid " + " where " + " c.relname = '" + table + "' " + " and " + " a.attnum > 0 " + " and " + " not a.attisdropped " + " group by attrelid) " + " and " + " a.attnum > 0 " + " and " + " not a_c.attisdropped " + " order by a_c.attnum,c.relname ";
		var result = pg_query(this.getDB().connection(), sql);
		var fktables = Array();

		while (row = pg_fetch_assoc(result)) {
			var fcols = Array();
			fcols.tablename = row.relname;
			fcols.from_column = row.attname;
			fcols.to_column = row.column_name;
			fcols.conname = row.conname;
			fktables.push(fcols);
		}

		return fktables;
	}

	getRootUserpostid(pactid, trgDate) {
		if (trgDate == date("Ym")) {
			var post_tb = "post_tb";
		} else //対象テーブル番号を取得
			{
				this._tableNo = MtTableUtil.getTableNo(trgDate, true);
				post_tb = "post_" + this._tableNo + "_tb";
			}

		var sql = "select userpostid from " + post_tb + " where pactid=" + this.getDB().dbQuote(pactid, "integer", true);

		if (!(userpostid = this.getDB().queryOne(sql))) {
			return false;
		}

		return userpostid;
	}

	getTargetPostData(pactid, userpostids) {
		var sql = "select p.pactid,p.postid,p.userpostid,p.postname,p.fix_flag,pl.level from " + this._post_tb + " p" + " inner join " + this._postrel_tb + " pl on p.pactid=pl.pactid and p.postid=pl.postidchild " + " where p.pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and p.userpostid in ('" + userpostids.join("','") + "')";

		if (!(userpostids = this.getDB().queryHash(sql))) {
			return false;
		}

		return userpostids;
	}

	setStatusLog(fp) {
		this._fp = fp;
	}

	begin() {
		return this.getDB().beginTransaction();
	}

	commit() {
		this.getDB().commit();
	}

	rollback() {
		this.getDB().rollback();
	}

	inTransaction() {
		return this.getDB().inTransaction();
	}

	_getPostModel() {
		if (!this._postModel instanceof PostModel) {
			this._postModel = new PostModel();
		}

		return this._postModel;
	}

	_getInsertPostid(pactid, userpostid) {
		if (this._trgDate != date("Ym")) {
			var postid;

			if (!(postid = this._getPostModel().getPostidFromUserpostid(pactid, userpostid))) {
				return false;
			}
		} else {
			this.getDB().setResultType(false);
			var sql = "select nextval('post_tb_postid_seq'::regclass)";

			if (PEAR.isError(postid = this.getDB().queryOne(sql))) {
				throw new Error(pactid + "\t_getInsertPostid\t" + this._trgDate + "\t" + userpostid + "\tpost_tb\u304B\u3089postid\u3092\u53D6\u5F97\u51FA\u6765\u307E\u305B\u3093\u3067\u3057\u305F " + postid.getUserinfo() + "\n");
			}

			this.getDB().setResultType(true);

			if (!postid) {
				return false;
			}
		}

		return postid;
	}

	_cancelOrder(pactid, userpostid, orderid) {
		var mess = "";
		var where = " where orderid=" + this.getDB().dbQuote(orderid, "integer", true);
		var update = "update mt_order_teldetail_tb set substatus=" + ImportPostDataModel.ORDERSTATUS_CANCEL + where;

		var res = this._query(update, false);

		if (PEAR.isError(res)) {
			mess += pactid + "\tdel\t" + this._trgDate + "\t" + userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
		}

		update = "update mt_order_sub_tb set substatus=" + ImportPostDataModel.ORDERSTATUS_CANCEL + where;
		res = this._query(update, false);

		if (PEAR.isError(res)) {
			mess += pactid + "\tdel\t" + this._trgDate + "\t" + userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
		}

		update = "update mt_order_tb set status=" + ImportPostDataModel.ORDERSTATUS_CANCEL + where;
		res = this._query(update, false);

		if (PEAR.isError(res)) {
			mess += pactid + "\tdel\t" + this._trgDate + "\t" + userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	_deleteOrder(pactid, userpostid, orderid) {
		var mess = "";
		var where = " where orderid=" + this.getDB().dbQuote(orderid, "integer", true);
		var update = "update mt_order_teldetail_tb set substatus=" + ImportPostDataModel.ORDERSTATUS_DELETE + where;

		var res = this._query(update, false);

		if (PEAR.isError(res)) {
			mess += pactid + "\tdel\t" + this._trgDate + "\t" + userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
		}

		update = "update mt_order_sub_tb set substatus=" + ImportPostDataModel.ORDERSTATUS_DELETE + where;
		res = this._query(update, false);

		if (PEAR.isError(res)) {
			mess += pactid + "\tdel\t" + this._trgDate + "\t" + userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
		}

		update = "update mt_order_tb set status=" + ImportPostDataModel.ORDERSTATUS_DELETE + where;
		res = this._query(update, false);

		if (PEAR.isError(res)) {
			mess += pactid + "\tdel\t" + this._trgDate + "\t" + userpostid + "\t" + update + "\t" + res.getDebugInfo() + "\n";
		}

		if (mess == "") {
			return true;
		} else {
			return mess;
		}
	}

	_getRecogPostid(data) {
		if (undefined !== data.recogpostid && !!data.recogpostid) {
			var postid;

			if (!(postid = this._getPostModel().getPostidFromUserpostid(data.pactid, data.recogpostid))) {
				return false;
			}
		} else //親部署から引続
			{
				var basepostid = data.postid;

				do {
					var sql = "select postidparent from " + this._postrel_tb + " where postidchild=" + this.getDB().dbQuote(basepostid, "integer", true);
					var postidparent = this.getDB().queryOne(sql);

					if (!postidparent || !is_numeric(postidparent)) {
						return false;
					}

					sql = "select postidto from recognize_tb " + " where postidfrom=" + this.getDB().dbQuote(postidparent, "integer", true);
					postid = this.getDB().queryOne(sql);

					if (postidparent == basepostid) {
						return false;
					} else {
						basepostid = postidparent;
					}
				} while (!is_numeric(postid));
			}

		return postid;
	}

	_getShopInfo(data) {
		var mess = "";

		if (undefined !== data.shopinfo && !!data.shopinfo) {
			var info = data.shopinfo.split("|");

			if (!Array.isArray(info)) {
				return false;
			}

			var shopinfo = Array();

			for (var row of Object.values(info)) {
				var tmp = row.split(":");

				if (!Array.isArray(tmp)) {
					return false;
				}

				if (!(memid = this._getShopMemberid(row.pactid, row.postid, row.shopid, row.carid))) {
					this.infoOut(row.pactid + "\tpostid:" + row.postid + ",shopid:" + row.shopid + ",carid:" + row.carid + "\u306Ememid\u304C\u53D6\u5F97\u51FA\u6765\u307E\u305B\u3093\u3067\u3057\u305F\n", 0);
					return false;
				}

				tmphash.carid = tmp[0];
				tmphash.shopid = tmp[1];
				tmphash.memid = memid;
				shopinfo.push(tmphash);
			}
		} else //親部署から引続
			{
				var basepostid = data.postid;

				do {
					var sql = "select postidparent from " + this._postrel_tb + " where postidchild=" + this.getDB().dbQuote(basepostid, "integer", true);
					var postidparent = this.getDB().queryOne(sql);

					if (!postidparent || !is_numeric(postidparent)) {
						return false;
					}

					sql = "select carid,shopid,memid from shop_relation_tb " + " where postid=" + this.getDB().dbQuote(postidparent, "integer", true);
					shopinfo = this.getDB().queryHash(sql);

					if (postidparent == basepostid) {
						return false;
					} else {
						basepostid = postidparent;
					}
				} while (!shopinfo);
			}

		return shopinfo;
	}

	_getShopMemberid(pactid, postid, shopid, carid) {
		var sql = "select memid from shop_relation_tb" + " where pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and postid=" + this.getDB().dbQuote(postid, "integer", true) + " and shopid=" + this.getDB().dbQuote(shopid, "integer", true) + " and carid=" + this.getDB().dbQuote(carid, "integer", true);
		var memid = this.getDB().queryOne(sql);

		if (!is_numeric(memid)) {
			return false;
		}

		return memid;
	}

	_checkPostRelationExists(pactid, postidparent, postidchild) {
		var sql = "select count(*) from " + this._postrel_tb + " where " + " pactid=" + this.getDB().dbQuote(pactid, "integer", true) + " and postidparent=" + this.getDB().dbQuote(postidparent, "integer", true) + " and postidchild=" + this.getDB().dbQuote(postidchild, "integer", true);
		var count = this.getDB().queryOne(sql);

		if (!is_numeric(count)) {
			throw new Error("\u30A8\u30E9\u30FC" + sql);
		}

		if (count > 0) {
			return true;
		} else {
			return false;
		}
	}

	_query(sql, flag = true) {
		if (ImportPostDataModel.DEBUG == true) {
			this.infoOut(sql, 0);
		}

		var res = this.getDB().query(sql, flag);

		if (ImportPostDataModel.DEBUG == true) {
			this.infoOut(res, 0);
		}

		return res;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};