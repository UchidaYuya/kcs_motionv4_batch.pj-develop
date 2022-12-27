require("common.php");

require("DBUtil.php");

require("HTML/TreeMenu.php");

//$postid：起点となる部署
//$submit：ツリーノードをクリックしたときのツリー表示／非表示切り替え
//$radio：ツリーノードにラジオボタンを付けるか／付けないか切り替え
//$posttable：検索対象部署テーブル名
//$postreltable：検索対象部署構成テーブル名
//$curpostpast_sessionname：カレント部署ＩＤを書き込むセッション名
//$imgflg：ツリー表示／非表示用の画像を付けるか／付けないか切り替え
//$dividname <div>のid名
//$postid：起点となる部署
//$submit：ツリーノードをクリックしたときのツリー表示／非表示切り替え
//$radio：ツリーノードにラジオボタンを付けるか／付けないか切り替え
//$posttable：検索対象部署テーブル名
//$postreltable：検索対象部署構成テーブル名
//$curpostpast_sessionname：カレント部署ＩＤを書き込むセッション名
//$imgflg：ツリー表示／非表示用の画像を付けるか／付けないか切り替え
//$dividname <div>のid名
//部署ツリー全開対応 2006/02/16 前田
//$postid：起点となる部署
//$submit：ツリーノードをクリックしたときのツリー表示／非表示切り替え
//$radio：ツリーノードにラジオボタンを付けるか／付けないか切り替え
//$posttable：検索対象部署テーブル名
//$postreltable：検索対象部署構成テーブル名
//$curpostpast_sessionname：カレント部署ＩＤを書き込むセッション名
//$imgflg：ツリー表示／非表示用の画像を付けるか／付けないか切り替え
//$dividname <div>のid名
//$postid：起点となる部署
//$submit：ツリーノードをクリックしたときのツリー表示／非表示切り替え
//$radio：ツリーノードにラジオボタンを付けるか／付けないか切り替え
//$posttable：検索対象部署テーブル名
//$postreltable：検索対象部署構成テーブル名
//$curpostpast_sessionname：カレント部署ＩＤを書き込むセッション名
//$imgflg：ツリー表示／非表示用の画像を付けるか／付けないか切り替え
//$dividname <div>のid名
//機能：渡された契約IDの全部署データをツリー構造状にしてハッシュで返す
//引数：pactid
//戻値：$A[要素番号]["postid"]
//$A[要素番号]["postname"]
//$A[要素番号]["level"]
//$A[要素番号]["userpostid"]
//2006/10/16 石崎
//2006/12/08 石崎　戻値にユーザー部署ID追加
//機能：受け取った全部署ツリー
//引数：全部署データ、作成中部署ツリー、postidchild、ループ開始位置、ループ最大値
//戻値：$A[要素番号]["postid"]
//$A[要素番号]["postname"]
//$A[要素番号]["level"]
//備考：この関数は getPostTreeHash から呼ばれることを前提として作られており、
//生成されたオブジェクトから直接呼び出される事を想定していません。
//直接呼ばないでください。
//2006/10/16 石崎
class Tree {
	makeTree(postid = false, submit = false, radio = false, posttable = "post_tb", postreltable = "post_relation_tb", curpostpast_sessionname = "", imgflg = true, dividname = "Maintree") //$icon = "folder.gif";
	//カレント部署ＩＤセッション名の指定が無い場合は $_SESSION["current_postid"] を使用
	//空ツリー作成
	//連想配列に部署名などをいれる
	//部署リレーションを連想配列に入れる
	//$O_menu->addItem(${$root});
	{
		if (curpostpast_sessionname == "") {
			curpostpast_sessionname = _SESSION.current_postid;
		}

		if (_SESSION.treeopen == "op") {
			delete _SESSION.treeopen;
			GLOBALS.treeview = "show";
			return Tree.makeTreeOpen(postid, submit, radio, posttable, postreltable, curpostpast_sessionname, imgflg, dividname);
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeRoot"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var tree_sql = "select " + "postid," + "compname," + "postname," + "userpostid " + "from " + posttable + " po inner join pact_tb pa on po.pactid=pa.pactid " + "where " + "po.pactid=" + _SESSION.pactid;
		var O_post_res = GLOBALS.GO_db.query(tree_sql);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (radio == true) {
				pname = "<input type=radio name=post>" + pname;
				icon = "";
			}

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		O_post_res.free();
		var rel_sql = "select " + "r.postidparent," + "r.postidchild," + "r.level " + "from " + postreltable + " r left join " + posttable + " p on r.postidchild=p.postid " + "where " + "r.pactid=" + _SESSION.pactid + " " + "order by " + "r.level," + "p.userpostid," + "r.postidparent," + "r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(rel_sql);
		var cnt_h_rel = H_rel.length;

		for (var i = 0; i < cnt_h_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//ルート部署を指定されている場合
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && curpostpast_sessionname == "") {
				curpostpast_sessionname = child;
			}

			if (curpostpast_sessionname == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			if (submit == "chgPost") {
				var link = "javascript:chgPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "', true, '" + dividname + "');";
			} else if (submit == "setPost") {
				link = "javascript:setPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "');";
			} else {
				link = "?pid=" + child;
			}

			if (busyo == true) //カレント部署と指定された部署が同じ場合
				{
					if (cid == busyo) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						if (undefined !== global[pid] == true) {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								link: link,
								icon: icon,
								cssClass: "treeTxt"
							}));
						}
					}
				} else //レベルが「0」の部署はルート部署とする
				{
					if (H_rel[i][2] == 0) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							cssClass: "treeTxt"
						}));
					}
				}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";

		if (submit == false) //$treeMenu->printMenu();
			//
			//			if($imgflg == true){
			//				$rtn_str = $rtn_str .
			//									"</td>
			//								</tr>
			//							</table></div>
			//						</td>
			//						<td valign=\"top\">
			//							<a href=\"javascript:ShowHide('" . $dividname . "');\"><img src=\"/images/tree.gif\" border=\"0\"></a>
			//						</td>
			//					</tr>
			//				</table></div>\n";
			//			}else{
			//
			//}	***
			{
				var rtn_str = "<div style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n" + "<a class=\"csButton\" href=\"javascript:ShowHide('Maintree');\">\u9589\u3058\u308B</a>\n\t&nbsp;&nbsp;&nbsp;<a class=\"csButton\" href=\"javascript:location.href='?tr=op'\">\u30C4\u30EA\u30FC\u3092\u958B\u304F</a>\n\t<br><br>\n" + treeMenu.returnMenu();
				rtn_str = rtn_str + "</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table></div>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table></div>\n";
				return rtn_str;
			} else {
			if (dividname == "Maintree") {
				var topposition = 100;
			} else {
				topposition = 200;
			}

			return "<div style=\"z-index:2; position:absolute; top:" + topposition + "; left:0;\">\n\t\t<div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t<a class=\"csButton\" href=\"javascript:ShowHide('" + dividname + "');\">\u9589\u3058\u308B</a>\n\t&nbsp;&nbsp;&nbsp;<a class=\"csButton\" href=\"javascript:confOpen();\">\u30C4\u30EA\u30FC\u3092\u958B\u304F</a>\n\t<br><br>\n" + treeMenu.returnMenu() + "</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n</div>\n";
		}
	}

	makeTreeOpen(postid = false, submit = false, radio = false, posttable = "post_tb", postreltable = "post_relation_tb", curpostpast_sessionname = "", imgflg = true, dividname = "Maintree") //$icon = "folder.gif";
	//カレント部署ＩＤセッション名の指定が無い場合は $_SESSION["current_postid"] を使用
	//空ツリー作成
	//連想配列に部署名などをいれる
	//部署リレーションを連想配列に入れる
	//$O_menu->addItem(${$root});
	{
		if (curpostpast_sessionname == "") {
			curpostpast_sessionname = _SESSION.current_postid;
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeRoot"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var tree_sql = "select " + "postid," + "compname," + "postname," + "userpostid " + "from " + posttable + " po inner join pact_tb pa on po.pactid=pa.pactid " + "where " + "po.pactid=" + _SESSION.pactid;
		var O_post_res = GLOBALS.GO_db.query(tree_sql);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (radio == true) {
				pname = "<input type=radio name=post>" + pname;
				icon = "";
			}

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		O_post_res.free();
		var rel_sql = "select " + "r.postidparent," + "r.postidchild," + "r.level " + "from " + postreltable + " r left join " + posttable + " p on r.postidchild=p.postid " + "where " + "r.pactid=" + _SESSION.pactid + " " + "order by " + "r.level," + "p.userpostid," + "r.postidparent," + "r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(rel_sql);
		var cnt_h_rel = H_rel.length;

		for (var i = 0; i < cnt_h_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//ルート部署を指定されている場合
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && curpostpast_sessionname == "") {
				curpostpast_sessionname = child;
			}

			if (curpostpast_sessionname == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			if (submit == "chgPost") {
				var link = "javascript:chgPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "', true, '" + dividname + "');";
			} else if (submit == "setPost") {
				link = "javascript:setPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "');";
			} else {
				link = "?pid=" + child;
			}

			if (busyo == true) //カレント部署と指定された部署が同じ場合
				{
					if (cid == busyo) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						if (undefined !== global[pid] == true) {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								link: link,
								icon: icon,
								expanded: true,
								cssClass: "treeTxt"
							}));
						}
					}
				} else //レベルが「0」の部署はルート部署とする
				{
					if (H_rel[i][2] == 0) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					}
				}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";

		if (submit == false) //$treeMenu->printMenu();
			//
			//			if($imgflg == true){
			//				$rtn_str = $rtn_str .
			//									"</td>
			//								</tr>
			//							</table></div>
			//						</td>
			//						<td valign=\"top\">
			//							<a href=\"javascript:ShowHide('" . $dividname . "');\"><img src=\"/images/tree.gif\" border=\"0\"></a>
			//						</td>
			//					</tr>
			//				</table></div>\n";
			//			}else{
			//
			//}	***
			{
				var rtn_str = "<div style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n" + "<a class=\"csButton\" href=\"javascript:ShowHide('Maintree');\">\u9589\u3058\u308B</a>\n\t<br><br>\n" + treeMenu.returnMenu();
				rtn_str = rtn_str + "</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table></div>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table></div>\n";
				return rtn_str;
			} else {
			if (dividname == "Maintree") {
				var topposition = 100;
			} else {
				topposition = 200;
			}

			return "<div style=\"z-index:2; position:absolute; top:" + topposition + "; left:0;\">\n\t\t<div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t<a class=\"csButton\" href=\"javascript:ShowHide('" + dividname + "');\">\u9589\u3058\u308B</a><br><br>\n" + treeMenu.returnMenu() + "</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n</div>\n";
		}
	}

	makeTreeRecog(pactid = "", postid = "", show_hide = true, postnew = false) //$postnew : 新規登録なら true 、部署変更なら false
	//空ツリー作成
	//連想配列に部署名などをいれる
	//承認部署として指定可能な部署ＩＤのリストを取得する
	//（条件）・承認先が指定されている部署であること
	//・承認先に指定しようとしている部署に承認権限をもったユーザが存在すること
	//部署リレーションを連想配列に入れる
	{
		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (_SESSION.treeopen == "op") {
			delete _SESSION.treeopen;
			GLOBALS.treeview = "show";
			return Tree.makeTreeRecogOpen(pactid, postid, show_hide, postnew);
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeMenuDefault"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var sql_str = "select po.postid, pa.compname, po.postname, po.userpostid " + "from post_tb po inner join pact_tb pa on po.pactid = pa.pactid " + "where po.pactid = " + pactid;
		var O_post_res = GLOBALS.GO_db.query(sql_str);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		sql_str = "select rec.postidfrom " + "from recognize_tb rec inner join user_tb us on rec.pactid = us.pactid and rec.postidfrom = us.postid " + "inner join fnc_relation_tb frl on frl.pactid = us.pactid and frl.userid = us.userid " + "inner join post_tb po on us.pactid = po.pactid and  us.postid = po.postid " + "where rec.pactid = " + pactid + " and " + "frl.fncid = " + RECOG;

		if (postnew == false) {
			sql_str = sql_str + " union " + "select us.postid " + "from user_tb us inner join fnc_relation_tb frl on us.pactid = frl.pactid and us.userid = frl.userid " + "inner join post_tb po on us.pactid = po.pactid and us.postid = po.postid " + "where us.pactid = " + pactid + " and " + "us.postid = " + _SESSION.current_postid + " and " + "frl.fncid = " + RECOG;
		}

		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		var cnt_A_pickup_postid = A_pickup_postid.length;
		O_post_res.free();
		sql_str = "select r.postidparent, r.postidchild, r.level " + "from post_relation_tb r left join post_tb p on r.postidchild=p.postid " + "where r.pactid = " + pactid + " " + "order by r.level, p.userpostid, r.postidparent, r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(sql_str);
		var cnt_H_rel = H_rel.length;

		for (var i = 0; i < cnt_H_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//起点となる部署が指定されている場合
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && _SESSION.current_postid == "") {
				_SESSION.current_postid = child;
			}

			if (_SESSION.current_postid == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			var linkflg = "false";

			for (var cnt = 0; cnt < cnt_A_pickup_postid; cnt++) {
				if (A_pickup_postid[cnt] == child) {
					linkflg = "true";
					break;
				}
			}

			if (show_hide == true) {
				var hide = ",true";
			} else {
				hide = "";
			}

			if (busyo == true) //カレント部署と指定された部署が同じ場合
				{
					if (cid == busyo) {
						if (linkflg == "true") {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + "\u25CE" + H_post[cid].pname + a2,
								link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
								icon: icon,
								cssClass: "treeTxt",
								expanded: true
							}));
						} else {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								icon: icon,
								cssClass: "treeEnable",
								expanded: true
							}));
						}
					} else {
						if (linkflg == "true") {
							if (undefined !== global[pid] == true) {
								global[cid] = global[pid].addItem(new HTML_TreeNode({
									text: a1 + "\u25CE" + H_post[cid].pname + a2,
									link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
									icon: icon,
									cssClass: "treeTxt"
								}));
							}
						} else {
							if (undefined !== global[pid] == true) {
								global[cid] = global[pid].addItem(new HTML_TreeNode({
									text: a1 + H_post[cid].pname + a2,
									icon: icon,
									cssClass: "treeEnable"
								}));
							}
						}
					}
				} else //レベルが「0」の部署はルート部署とする
				{
					if (H_rel[i][2] == 0) {
						if (linkflg == "true") {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + "\u25CE" + H_post[cid].pname + a2,
								link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
								icon: icon,
								cssClass: "treeTxt",
								expanded: true
							}));
						} else {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								icon: icon,
								cssClass: "treeEnable",
								expanded: true
							}));
						}
					} else {
						if (linkflg == "true") {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + "\u25CE" + H_post[cid].pname + a2,
								link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
								icon: icon,
								cssClass: "treeTxt"
							}));
						} else {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								icon: icon,
								cssClass: "treeEnable"
							}));
						}
					}
				}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";
		return "<div id=\"Maintree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n                    <table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\">\n                        <tr>\n\t\t\t\t\t\t\t<td><a class=\"csButton\" href=\"javascript:ShowHide()\">\u9589\u3058\u308B</a>&nbsp;&nbsp;&nbsp;<span class=\"treeAlert\">\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD</span>\n&nbsp;\n<p><a class=\"treeAlert\" href=\"javascript:setRecog('','',true)\">\u627F\u8A8D\u5148\u3092\u6307\u5B9A\u3057\u306A\u3044</a>&nbsp;&nbsp;&nbsp;<a class=\"csButton\" href=\"javascript:confOpen();\">\u30C4\u30EA\u30FC\u3092\u958B\u304F</a>" + treeMenu.returnMenu() + "</td>\n                        </tr>\n                    </table>\n        </div>\n";
	}

	makeTreeRecogOpen(pactid = "", postid = "", show_hide = true, postnew = false) //$postnew : 新規登録なら true 、部署変更なら false
	//空ツリー作成
	//連想配列に部署名などをいれる
	//承認部署として指定可能な部署ＩＤのリストを取得する
	//（条件）・承認先が指定されている部署であること
	//・承認先に指定しようとしている部署に承認権限をもったユーザが存在すること
	//部署リレーションを連想配列に入れる
	{
		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeMenuDefault"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var sql_str = "select po.postid, pa.compname, po.postname, po.userpostid " + "from post_tb po inner join pact_tb pa on po.pactid = pa.pactid " + "where po.pactid = " + pactid;
		var O_post_res = GLOBALS.GO_db.query(sql_str);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		sql_str = "select rec.postidfrom " + "from recognize_tb rec inner join user_tb us on rec.pactid = us.pactid and rec.postidfrom = us.postid " + "inner join fnc_relation_tb frl on frl.pactid = us.pactid and frl.userid = us.userid " + "inner join post_tb po on us.pactid = po.pactid and  us.postid = po.postid " + "where rec.pactid = " + pactid + " and " + "frl.fncid = " + RECOG;

		if (postnew == false) {
			sql_str = sql_str + " union " + "select us.postid " + "from user_tb us inner join fnc_relation_tb frl on us.pactid = frl.pactid and us.userid = frl.userid " + "inner join post_tb po on us.pactid = po.pactid and us.postid = po.postid " + "where us.pactid = " + pactid + " and " + "us.postid = " + _SESSION.current_postid + " and " + "frl.fncid = " + RECOG;
		}

		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		var cnt_A_pickup_postid = A_pickup_postid.length;
		O_post_res.free();
		sql_str = "select r.postidparent, r.postidchild, r.level " + "from post_relation_tb r left join post_tb p on r.postidchild=p.postid " + "where r.pactid = " + pactid + " " + "order by r.level, p.userpostid, r.postidparent, r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(sql_str);
		var cnt_H_rel = H_rel.length;

		for (var i = 0; i < cnt_H_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//起点となる部署が指定されている場合
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && _SESSION.current_postid == "") {
				_SESSION.current_postid = child;
			}

			if (_SESSION.current_postid == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			var linkflg = "false";

			for (var cnt = 0; cnt < cnt_A_pickup_postid; cnt++) {
				if (A_pickup_postid[cnt] == child) {
					linkflg = "true";
					break;
				}
			}

			if (show_hide == true) {
				var hide = ",true";
			} else {
				hide = "";
			}

			if (busyo == true) //カレント部署と指定された部署が同じ場合
				{
					if (cid == busyo) {
						if (linkflg == "true") {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + "\u25CE" + H_post[cid].pname + a2,
								link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
								icon: icon,
								cssClass: "treeTxt",
								expanded: true
							}));
						} else {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								icon: icon,
								cssClass: "treeEnable",
								expanded: true
							}));
						}
					} else {
						if (linkflg == "true") {
							if (undefined !== global[pid] == true) {
								global[cid] = global[pid].addItem(new HTML_TreeNode({
									text: a1 + "\u25CE" + H_post[cid].pname + a2,
									link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
									icon: icon,
									expanded: true,
									cssClass: "treeTxt"
								}));
							}
						} else {
							if (undefined !== global[pid] == true) {
								global[cid] = global[pid].addItem(new HTML_TreeNode({
									text: a1 + H_post[cid].pname + a2,
									icon: icon,
									expanded: true,
									cssClass: "treeEnable"
								}));
							}
						}
					}
				} else //レベルが「0」の部署はルート部署とする
				{
					if (H_rel[i][2] == 0) {
						if (linkflg == "true") {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + "\u25CE" + H_post[cid].pname + a2,
								link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
								icon: icon,
								cssClass: "treeTxt",
								expanded: true
							}));
						} else {
							global[cid] = O_root.addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								icon: icon,
								cssClass: "treeEnable",
								expanded: true
							}));
						}
					} else {
						if (linkflg == "true") {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + "\u25CE" + H_post[cid].pname + a2,
								link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
								icon: icon,
								expanded: true,
								cssClass: "treeTxt"
							}));
						} else {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								icon: icon,
								expanded: true,
								cssClass: "treeEnable"
							}));
						}
					}
				}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";
		return "<div id=\"Maintree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n                    <table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\">\n                        <tr>\n\t\t\t\t\t\t\t<td><a class=\"csButton\" href=\"javascript:ShowHide()\">\u9589\u3058\u308B</a>&nbsp;&nbsp;&nbsp;<span class=\"treeAlert\">\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD</span>\n&nbsp;\n<p><a class=\"treeAlert\" href=\"javascript:setRecog('','',true)\">\u627F\u8A8D\u5148\u3092\u6307\u5B9A\u3057\u306A\u3044</a>\n" + treeMenu.returnMenu() + "</td>\n                        </tr>\n                    </table>\n        </div>\n";
	}

	makeTreeRegist(pactid = "", postid = "", carid = "", show_hide = true) //空ツリー作成
	//連想配列に部署名などをいれる
	//登録部署として指定可能な部署ＩＤのリストを取得する
	//（条件）・販売店が紐付いている部署
	//部署リレーションを連想配列に入れる
	{
		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		if (_SESSION.treeopen == "op") {
			delete _SESSION.treeopen;
			GLOBALS.treeview = "show";
			return Tree.makeTreeRegistOpen(pactid, postid, carid, show_hide);
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeMenuDefault"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var sql_str = "select po.postid, pa.compname, po.postname, po.userpostid " + "from post_tb po inner join pact_tb pa on po.pactid = pa.pactid " + "where po.pactid = " + pactid;
		var O_post_res = GLOBALS.GO_db.query(sql_str);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		sql_str = "SELECT postid FROM shop_relation_tb WHERE pactid=" + pactid + " AND carid=" + carid;
		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		var cnt_A_pickup_postid = A_pickup_postid.length;
		O_post_res.free();
		sql_str = "select r.postidparent, r.postidchild, r.level " + "from post_relation_tb r left join post_tb p on r.postidchild=p.postid " + "where r.pactid = " + pactid + " " + "order by r.level, p.userpostid, r.postidparent, r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(sql_str);
		var cnt_H_rel = H_rel.length;

		for (var i = 0; i < cnt_H_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//ルート部署が指定されているのでこの条件はコメントアウト
		//if($busyo == true){
		//カレント部署と指定された部署が同じ場合
		//}
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && _SESSION.current_postid == "") {
				_SESSION.current_postid = child;
			}

			if (_SESSION.current_postid == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			var linkflg = "false";

			for (var cnt = 0; cnt < cnt_A_pickup_postid; cnt++) {
				if (A_pickup_postid[cnt] == child) {
					linkflg = "true";
					break;
				}
			}

			if (show_hide == true) {
				var hide = ",true";
			} else {
				hide = "";
			}

			if (cid == busyo) {
				if (linkflg == "true") {
					global[cid] = O_root.addItem(new HTML_TreeNode({
						text: a1 + "\u25CE" + H_post[cid].pname + a2,
						link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
						icon: icon,
						expanded: true,
						cssClass: "treeTxt"
					}));
				} else {
					global[cid] = O_root.addItem(new HTML_TreeNode({
						text: a1 + H_post[cid].pname + a2,
						icon: icon,
						cssClass: "treeEnable",
						expanded: true
					}));
				}
			} else {
				if (undefined !== global[pid] == true) {
					if (linkflg == "true") {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + "\u25CE" + H_post[cid].pname + a2,
							link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
							icon: icon,
							cssClass: "treeTxt"
						}));
					} else {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2 + "\uFF08\u8CA9\u58F2\u5E97\u304C\u95A2\u9023\u4ED8\u3051\u3089\u308C\u3066\u3044\u307E\u305B\u3093\uFF09",
							icon: icon,
							cssClass: "treeEnable"
						}));
					}
				}
			}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";
		return "<div id=\"Maintree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n                    <table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\">\n                        <tr>\n                            <td><a class=\"csButton\" href=\"javascript:ShowHide()\">\u9589\u3058\u308B</a>\n                            &nbsp;&nbsp;&nbsp;<a class=\"csButton\" href=\"javascript:confOpenNotConfirm();\">\u30C4\u30EA\u30FC\u3092\u958B\u304F</a><br><br>\n                            &nbsp;&nbsp;&nbsp;<span class=\"treeAlert\">\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD</span>&nbsp;<br>" + treeMenu.returnMenu() + "</td>\n                        </tr>\n                    </table>\n        </div>\n";
	}

	makeTreeRegistOpen(pactid = "", postid = "", carid = "", show_hide = true) //空ツリー作成
	//連想配列に部署名などをいれる
	//登録部署として指定可能な部署ＩＤのリストを取得する
	//（条件）・販売店が紐付いている部署
	//部署リレーションを連想配列に入れる
	{
		if (pactid == "") {
			pactid = _SESSION.pactid;
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeMenuDefault"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var sql_str = "select po.postid, pa.compname, po.postname, po.userpostid " + "from post_tb po inner join pact_tb pa on po.pactid = pa.pactid " + "where po.pactid = " + pactid;
		var O_post_res = GLOBALS.GO_db.query(sql_str);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		sql_str = "SELECT postid FROM shop_relation_tb WHERE pactid=" + pactid + " AND carid=" + carid;
		var A_pickup_postid = GLOBALS.GO_db.getCol(sql_str);
		var cnt_A_pickup_postid = A_pickup_postid.length;
		O_post_res.free();
		sql_str = "select r.postidparent, r.postidchild, r.level " + "from post_relation_tb r left join post_tb p on r.postidchild=p.postid " + "where r.pactid = " + pactid + " " + "order by r.level, p.userpostid, r.postidparent, r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(sql_str);
		var cnt_H_rel = H_rel.length;

		for (var i = 0; i < cnt_H_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//ルート部署が指定されているのでこの条件はコメントアウト
		//if($busyo == true){
		//カレント部署と指定された部署が同じ場合
		//}
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && _SESSION.current_postid == "") {
				_SESSION.current_postid = child;
			}

			if (_SESSION.current_postid == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			var linkflg = "false";

			for (var cnt = 0; cnt < cnt_A_pickup_postid; cnt++) {
				if (A_pickup_postid[cnt] == child) {
					linkflg = "true";
					break;
				}
			}

			if (show_hide == true) {
				var hide = ",true";
			} else {
				hide = "";
			}

			if (cid == busyo) {
				if (linkflg == "true") {
					global[cid] = O_root.addItem(new HTML_TreeNode({
						text: a1 + "\u25CE" + H_post[cid].pname + a2,
						link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
						icon: icon,
						expanded: true,
						cssClass: "treeTxt"
					}));
				} else {
					global[cid] = O_root.addItem(new HTML_TreeNode({
						text: a1 + H_post[cid].pname + a2,
						icon: icon,
						cssClass: "treeEnable",
						expanded: true
					}));
				}
			} else {
				if (undefined !== global[pid] == true) {
					if (linkflg == "true") {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + "\u25CE" + H_post[cid].pname + a2,
							link: "javascript:setRecog('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "'" + hide + ")",
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2 + "\uFF08\u8CA9\u58F2\u5E97\u304C\u95A2\u9023\u4ED8\u3051\u3089\u308C\u3066\u3044\u307E\u305B\u3093\uFF09",
							icon: icon,
							expanded: true,
							cssClass: "treeEnable"
						}));
					}
				}
			}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";
		return "<div id=\"Maintree\" style=\"z-index:100; position:absolute; top:100; left:0;\">\n                    <table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\">\n                        <tr>\n                            <td><a class=\"csButton\" href=\"javascript:ShowHide()\">\u9589\u3058\u308B</a>&nbsp;&nbsp;&nbsp;<span class=\"treeAlert\">\u25CE\u306E\u3064\u3044\u305F\u90E8\u7F72\u306E\u307F\u6307\u5B9A\u53EF\u80FD</span>&nbsp;<br>" + treeMenu.returnMenu() + "</td>\n                        </tr>\n                    </table>\n        </div>\n";
	}

	treeJs() {
		return "<script language=\"Javascript\" src=\"/js/tree.js\"></script>\n";
	}

	makeTreePast(postid = false, submit = false, radio = false, posttable = "post_tb", postreltable = "post_relation_tb", curpostpast_sessionname = "", imgflg = true, dividname = "Maintree") //$icon = "folder.gif";
	//カレント部署ＩＤセッション名の指定が無い場合は $_SESSION["current_postid"] を使用
	//空ツリー作成
	//連想配列に部署名などをいれる
	//部署リレーションを連想配列に入れる
	//$O_menu->addItem(${$root});
	{
		if (curpostpast_sessionname == "") {
			curpostpast_sessionname = _SESSION.current_postid;
		}

		if (_SESSION.treeopen2 == "op") {
			delete _SESSION.treeopen2;
			GLOBALS.treeview2 = "show";
			return Tree.makeTreePastOpen(postid, submit, radio, posttable, postreltable, curpostpast_sessionname, imgflg, dividname);
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeRoot"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var tree_sql = "select " + "postid," + "compname," + "postname," + "userpostid " + "from " + posttable + " po inner join pact_tb pa on po.pactid=pa.pactid " + "where " + "po.pactid=" + _SESSION.pactid;
		var O_post_res = GLOBALS.GO_db.query(tree_sql);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (radio == true) {
				pname = "<input type=radio name=post>" + pname;
				icon = "";
			}

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		O_post_res.free();
		var rel_sql = "select " + "r.postidparent," + "r.postidchild," + "r.level " + "from " + postreltable + " r left join " + posttable + " p on r.postidchild=p.postid " + "where " + "r.pactid=" + _SESSION.pactid + " " + "order by " + "r.level," + "p.userpostid," + "r.postidparent," + "r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(rel_sql);
		var cnt_h_rel = H_rel.length;

		for (var i = 0; i < cnt_h_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//ルート部署を指定されている場合
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && curpostpast_sessionname == "") {
				curpostpast_sessionname = child;
			}

			if (curpostpast_sessionname == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			if (submit == "chgPost") {
				var link = "javascript:chgPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "', true, '" + dividname + "');";
			} else if (submit == "setPost") {
				link = "javascript:setPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "');";
			} else {
				link = "?pid=" + child;
			}

			if (busyo == true) //カレント部署と指定された部署が同じ場合
				{
					if (cid == busyo) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						if (undefined !== global[pid] == true) {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								link: link,
								icon: icon,
								cssClass: "treeTxt"
							}));
						}
					}
				} else //レベルが「0」の部署はルート部署とする
				{
					if (H_rel[i][2] == 0) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							cssClass: "treeTxt"
						}));
					}
				}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";

		if (submit == false) //$treeMenu->printMenu();
			//
			//			if($imgflg == true){
			//				$rtn_str = $rtn_str .
			//									"</td>
			//								</tr>
			//							</table></div>
			//						</td>
			//						<td valign=\"top\">
			//							<a href=\"javascript:ShowHide('" . $dividname . "');\"><img src=\"/images/tree.gif\" border=\"0\"></a>
			//						</td>
			//					</tr>
			//				</table></div>\n";
			//			}else{
			//
			//}	***
			{
				var rtn_str = "<div style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n" + "<a class=\"csButton\" href=\"javascript:ShowHide('Maintree');\">\u9589\u3058\u308B</a>\n\t&nbsp;&nbsp;&nbsp;<a class=\"csButton\" href=\"javascript:location.href='?tr2=op'\">\u30C4\u30EA\u30FC\u3092\u958B\u304F</a>\n\t<br><br>\n" + treeMenu.returnMenu();
				rtn_str = rtn_str + "</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table></div>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table></div>\n";
				return rtn_str;
			} else {
			if (dividname == "Maintree") {
				var topposition = 100;
			} else {
				topposition = 200;
			}

			return "<div style=\"z-index:2; position:absolute; top:" + topposition + "; left:0;\">\n\t\t<div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t<a class=\"csButton\" href=\"javascript:ShowHide('" + dividname + "');\">\u9589\u3058\u308B</a>\n\t&nbsp;&nbsp;&nbsp;<a class=\"csButton\" href=\"javascript:confOpen2();\">\u30C4\u30EA\u30FC\u3092\u958B\u304F</a>\n\t<br><br>\n" + treeMenu.returnMenu() + "</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n</div>\n";
		}
	}

	makeTreePastOpen(postid = false, submit = false, radio = false, posttable = "post_tb", postreltable = "post_relation_tb", curpostpast_sessionname = "", imgflg = true, dividname = "Maintree") //$icon = "folder.gif";
	//カレント部署ＩＤセッション名の指定が無い場合は $_SESSION["current_postid"] を使用
	//空ツリー作成
	//連想配列に部署名などをいれる
	//部署リレーションを連想配列に入れる
	//$O_menu->addItem(${$root});
	{
		if (curpostpast_sessionname == "") {
			curpostpast_sessionname = _SESSION.current_postid;
		}

		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: undefined,
			cssClass: "treeRoot"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var tree_sql = "select " + "postid," + "compname," + "postname," + "userpostid " + "from " + posttable + " po inner join pact_tb pa on po.pactid=pa.pactid " + "where " + "po.pactid=" + _SESSION.pactid;
		var O_post_res = GLOBALS.GO_db.query(tree_sql);
		var H_post = Array();

		while (A_result = O_post_res.fetchRow(DB_FETCHMODE_ASSOC)) {
			postid = A_result.postid;
			var hpostid = "pos" + postid;
			var pname = htmlspecialchars(A_result.postname);
			var userpostid = A_result.userpostid;

			if (radio == true) {
				pname = "<input type=radio name=post>" + pname;
				icon = "";
			}

			if (userpostid == "" or userpostid == undefined) {
				var A_tmp = {
					[hpostid]: {
						pname: pname
					}
				};
			} else {
				A_tmp = {
					[hpostid]: {
						pname: pname + " (" + userpostid + ")"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		O_post_res.free();
		var rel_sql = "select " + "r.postidparent," + "r.postidchild," + "r.level " + "from " + postreltable + " r left join " + posttable + " p on r.postidchild=p.postid " + "where " + "r.pactid=" + _SESSION.pactid + " " + "order by " + "r.level," + "p.userpostid," + "r.postidparent," + "r.postidchild";
		var H_rel = GLOBALS.GO_db.getAll(rel_sql);
		var cnt_h_rel = H_rel.length;

		for (var i = 0; i < cnt_h_rel; i++) //if($H_rel[$i][1] == "*-*"){ $i++; }
		//親部署ID
		//親部署認識ID
		//子部署ID
		//子部署認識ID
		//ルート部署を指定されている場合
		{
			var parent = H_rel[i][0];
			var pid = "pos" + parent;
			var child = H_rel[i][1];
			var cid = "pos" + child;

			if (H_rel[i][2] == 0 && curpostpast_sessionname == "") {
				curpostpast_sessionname = child;
			}

			if (curpostpast_sessionname == child) {
				var a1 = "<span class='this'>";
				var a2 = "</span>";
				_SESSION.current_postname = H_post[cid].pname;
			} else {
				a1 = "";
				a2 = "";
			}

			if (submit == "chgPost") {
				var link = "javascript:chgPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "', true, '" + dividname + "');";
			} else if (submit == "setPost") {
				link = "javascript:setPost('" + child + "', '" + htmlspecialchars(H_post[cid].pname).replace(/"/g, "\u201D").replace(/'/g, "\u2019") + "');";
			} else {
				link = "?pid=" + child;
			}

			if (busyo == true) //カレント部署と指定された部署が同じ場合
				{
					if (cid == busyo) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						if (undefined !== global[pid] == true) {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								link: link,
								icon: icon,
								expanded: true,
								cssClass: "treeTxt"
							}));
						}
					}
				} else //レベルが「0」の部署はルート部署とする
				{
					if (H_rel[i][2] == 0) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					} else {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: link,
							icon: icon,
							expanded: true,
							cssClass: "treeTxt"
						}));
					}
				}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_DHTML(O_menu, {
			images: "/images/tree",
			defaultClass: "treeMenuDefault",
			0: false
		});
		treeMenu.images = "/images/tree";

		if (submit == false) //$treeMenu->printMenu();
			//
			//			if($imgflg == true){
			//				$rtn_str = $rtn_str .
			//									"</td>
			//								</tr>
			//							</table></div>
			//						</td>
			//						<td valign=\"top\">
			//							<a href=\"javascript:ShowHide('" . $dividname . "');\"><img src=\"/images/tree.gif\" border=\"0\"></a>
			//						</td>
			//					</tr>
			//				</table></div>\n";
			//			}else{
			//
			//}	***
			{
				var rtn_str = "<div style=\"z-index:2; position:absolute; top:100; left:0;\">\n\t<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n\t<tr>\n\t\t<td><div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n" + "<a class=\"csButton\" href=\"javascript:ShowHide('Maintree');\">\u9589\u3058\u308B</a>\n\t<br><br>\n" + treeMenu.returnMenu();
				rtn_str = rtn_str + "</td>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</table></div>\n\t\t\t\t\t\t</td>\n\t\t\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table></div>\n";
				return rtn_str;
			} else {
			if (dividname == "Maintree") {
				var topposition = 100;
			} else {
				topposition = 200;
			}

			return "<div style=\"z-index:2; position:absolute; top:" + topposition + "; left:0;\">\n\t\t<div id=\"" + dividname + "\">\n\t\t\t<table border=\"1\" bordercolor=\"#000066\" cellspacing=\"0\" cellpadding=\"10\" bgcolor=\"#ffffff\" height=\"120\">\n\t\t\t<tr>\n\t\t\t\t<td valign=\"top\">\n\t\t\t\t\t<a class=\"csButton\" href=\"javascript:ShowHide('" + dividname + "');\">\u9589\u3058\u308B</a><br><br>\n" + treeMenu.returnMenu() + "</td>\n\t\t\t</tr>\n\t\t\t</table></div>\n</div>\n";
		}
	}

	getPostTreeHash(pactid) //返り値用ハッシュ
	//pactid の全部署を深度、部署ID、親部署ID、子部署IDでソート
	//全部署数
	//深度0を返り値用ハッシュの要素番号0へ代入
	{
		var H_res_return = Array();
		var post_sql = "select " + "r.postidparent,r.postidchild,p.postname,r.level,p.userpostid " + "from " + "post_relation_tb r left join post_tb p on r.postidchild=p.postid " + "where " + "r.pactid = " + pactid + " " + "order by " + "r.level,p.userpostid,r.postidparent,r.postidchild";
		var H_res = GLOBALS.GO_db.getHash(post_sql);
		var h_res_all = H_res.length;
		H_res_return[0].postidchild = H_res[0].postidchild;
		H_res_return[0].postname = H_res[0].postname;
		H_res_return[0].level = H_res[0].level;
		H_res_return[0].userpostid = H_res[0].level;

		if (h_res_all > 1) //部署が１件以上あったら（親部署（深度0）含まない）
			{
				H_res_return = this.getDirTree(H_res, H_res_return, H_res[0].postidchild, 1, h_res_all);
			}

		return H_res_return;
	}

	getDirTree(H_res, H_res_return, postidchild, lp_count, lp_max) //全部署データを引数のループ開始位置から残りをループで処理
	//（０番目は一番上の親部署でが入っており、必ず処理済みなので除外）
	{
		for (lp_count; lp_count < lp_max; lp_count++) //受け取ったループ開始番号の親部署ID と 引数の子部署IDと等しい場合
		//関数呼び元部署の子部署であるので、次部署へ追加
		{
			if (H_res[lp_count].postidparent == postidchild) {
				var this_h_count = H_res_return.length;
				H_res_return[this_h_count].postidchild = H_res[lp_count].postidchild;
				H_res_return[this_h_count].postname = H_res[lp_count].postname;
				H_res_return[this_h_count].level = H_res[lp_count].level;
				H_res_return[this_h_count].userpostid = H_res[lp_count].userpostid;
				H_res_return = this.getDirTree(H_res, H_res_return, H_res[lp_count].postidchild, lp_count + 1, lp_max);
			}
		}

		return H_res_return;
	}

};