require("common.php");

require("DBUtil.php");

require("HTML/TreeMenu.php");

class ListSelect {
	makeSelect(postid = false, H_option = Array()) //$icon = "folder.gif";
	//空ツリー作成
	//連想配列に部署名などをいれる
	//部署リレーションを連想配列に入れる
	//$treeMenu->printMenu();
	{
		var icon = "";
		var O_menu = new HTML_TreeMenu();
		var O_root = new HTML_TreeNode({
			text: "",
			link: "",
			icon: icon,
			cssClass: "treeTxt"
		});

		if (postid != false) {
			var busyo = "pos" + postid;
		}

		var tree_sql = "select " + "postid," + "compname," + "postname," + "userpostid " + "from " + "post_tb inner join pact_tb on post_tb.pactid=pact_tb.pactid " + "where " + "post_tb.pactid=" + _SESSION.pactid;
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
						pname: pname + " \uFF08" + userpostid + "\uFF09"
					}
				};
			}

			H_post = array_merge(H_post, A_tmp);
		}

		O_post_res.free();
		var rel_sql = "select " + "postidparent," + "postidchild," + "level " + "from " + "post_relation_tb " + "where " + "pactid=" + _SESSION.pactid + " " + "order by " + "level," + "postidparent," + "postidchild";
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

			if (busyo == true) //カレント部署と指定された部署が同じ場合
				{
					if (cid == busyo) {
						global[cid] = O_root.addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: child,
							icon: icon,
							cssClass: "treeTxt"
						}));
					} else {
						if (undefined !== global[pid] == true) {
							global[cid] = global[pid].addItem(new HTML_TreeNode({
								text: a1 + H_post[cid].pname + a2,
								link: child,
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
							link: child,
							icon: icon,
							cssClass: "treeTxt"
						}));
					} else {
						global[cid] = global[pid].addItem(new HTML_TreeNode({
							text: a1 + H_post[cid].pname + a2,
							link: child,
							icon: icon,
							cssClass: "treeTxt"
						}));
					}
				}
		}

		O_menu.addItem(O_root);
		var treeMenu = new HTML_TreeMenu_Listbox(O_menu, H_option);
		return treeMenu.returnMenu();
	}

};