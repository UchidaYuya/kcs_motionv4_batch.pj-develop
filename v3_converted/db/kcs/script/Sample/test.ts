//備考、出向コード、新テーブルへ洗い替え
//1.pact_rel_shop_tb から pactidと、knowledge、pactcode

require("MtDBUtil.php");

var O_db = MtDBUtil.singleton();
var sql = "SELECT pactid, shopid, knowledge, pactcode FROM pact_rel_shop_tb GROUP BY pactid, shopid, knowledge, pactcode";
var H_tmp = O_db.queryHash(sql);

for (var cnt in H_tmp) {
	var H_value = H_tmp[cnt];
	var tmp_sql = "SELECT postidparent FROM post_relation_tb where pactid = " + H_value.pactid + " AND level = 0";
	var top_postid = O_db.queryOne(tmp_sql);
	var update_sql = "INSERT INTO post_rel_shop_info_tb (pactid, postid, shopid, knowledge, pactcode) values (" + H_value.pactid + ", " + top_postid + ", " + H_value.shopid + ", " + O_db.dbQuote(H_value.knowledge, "text") + ", " + O_db.dbQuote(H_value.pactcode, "text") + ")";
	O_db.exec(update_sql);
}

echo("\n");