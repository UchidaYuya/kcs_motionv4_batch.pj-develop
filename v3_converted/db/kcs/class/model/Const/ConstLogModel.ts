require("MtAuthority.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

//
//getTreeJS
//部署ツリーの作成
//@author web
//@since 2015/12/15
//
//@param mixed $pactid
//@param mixed $postid
//@param mixed $current_postid
//@access public
//@return void
//
//
//makeManagementLogSearchSQL
//検索項目のSQLを作成
//@author web
//@since 2016/03/23
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//makeWhereSql
//
//@author date
//@since 2016/03/24
//
//@param mixed $login_flg
//@param mixed $operate_flg
//@access private
//@return void
//
class ConstLogModel {
    getTreeJS(pactid, postid, current_postid) {
        var H_tree = Array();
        var tb_no = "";
        H_tree.js = TreeAJAX.treeJs() + ListAJAX.xlistJs();
        var O_post = new MtPostUtil();
        H_tree.post_name = O_post.getPostTreeBand(pactid, postid, current_postid, tb_no, " -> ", "", 1, false);
        var O_tree = new TreeAJAX();
        O_tree.post_tb = "post_tb";
        O_tree.post_relation_tb = "post_relation_tb";
        H_tree.tree_str = O_tree.makeTree(postid);
        var O_xlist = new ListAJAX();
        O_xlist.post_tb = "post_tb";
        O_xlist.post_relation_tb = "post_relation_tb";
        H_tree.xlist_str = O_xlist.makeList();
        return H_tree;
    }

    makeLogSearchSQL(pactid, search) //部署
    //$temp = array("mnglog_tb.recdate >= '" . date("Y-m-d H:i:s", mktime(0, 0, 0, date("n") - 12, 1, date("Y"))) . "'");
    {
        var sql = Array();
        var res = Array();

        if (search.pid != "" && search.post_condition == "multi") {
            var O_post = new PostModel();
            var A_postid_list = O_post.getChildList(pactid, search.pid);
            sql.push("targetpostid in (" + A_postid_list.join(",") + ")");
        }

        var temp = Array();

        if (search.comment_sel != "") {
            temp.push("(" + " mnglog_tb.comment1 like '%" + search.comment_sel + "%'" + " or mnglog_tb.comment2 like '%" + search.comment_sel + "%'" + ")");
        }

        if (search.comment != "") {
            temp.push("(" + "mnglog_tb.comment1 like '%" + search.comment + "%'" + " or mnglog_tb.comment2 like '%" + search.comment + "%'" + ")");
        }

        if (!!temp) {
            sql.push("(" + temp.join(" and ") + ")");
        }

        if (search.username != "") {
            sql.push("mnglog_tb.username like '%" + search.username + "%'");
        }

        temp = Array();

        if (search.recdate_from.Y != "" && search.recdate_from.m != "" && search.recdate_from.d != "" && search.recdate_from.H != "" && search.recdate_from.i != "") {
            var recdate_from = sprintf("'%02d-%02d-%02d %02d:%02d:00'", +search.recdate_from.Y, +search.recdate_from.m, +search.recdate_from.d, +search.recdate_from.H, +search.recdate_from.i);
            temp.push("mnglog_tb.recdate >= " + recdate_from);
        }

        if (search.recdate_to.Y != "" && search.recdate_to.m != "" && search.recdate_to.d != "" && search.recdate_to.H != "" && search.recdate_to.i != "") {
            var recdate_to = sprintf("'%02d-%02d-%02d %02d:%02d:59'", +search.recdate_to.Y, +search.recdate_to.m, +search.recdate_to.d, +search.recdate_to.H, +search.recdate_to.i);
            temp.push("mnglog_tb.recdate <= " + recdate_to);
        }

        if (!!temp) {
            sql.push("(" + temp.join(" AND ") + ")");
            res.date = true;
        }

        if (!!sql) {
            res.sql = " AND (" + sql.join(" " + search.search_condition + " ") + ")";
        } else {
            res.sql = "";
        }

        return res;
    }

    makeWhereSql(login_flg, operate_flg) //成り代わりログイン記録非表示権限がある時（成り代わりの記録を表示しない） 20070611 houshiyama
    //ログイン記録表示がonの時
    {
        var A_where = Array();

        if (_SESSION.chk == "on") {
            if (login_flg == true) {
                A_where.push(" (joker_flag = 0 and kind = 'L') ");
            } else {
                A_where.push(" (kind = 'L') ");
            }
        }

        if (operate_flg == true) {
            A_where.push(" (joker_flag = 0 and (kind = 'U' or kind = 'P' or kind = 'D')) ");
        } else {
            A_where.push(" (kind = 'U' or kind = 'P' or kind = 'D') ");
        }

        var where = " (" + A_where.join(" or ") + ") ";
        return where;
    }

};