//
//受注詳細お客様情報更新用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/07/21
//@uses ShopOrderDetail
//
//
//
//受注詳細お客様情報更新用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/07/21
//

require("Post.php");

require("OrderUtil.php");

require("ShopOrderModelBase.php");

//
//お客様情報を取得する
//
//@author igarashi
//@since 2008/07/22
//
//@param $H_info
//@return $hash
//
//
//order_tbのユーザー情報を更新する
//
//@author igarashi
//@since 2008/07/31
//
//@access public
//@return hash
//
//
//取得した情報からQuickFormのデフォルト値を取得する<br>
//お客様情報・フリーワード用
//
//@author igarashi
//@since 2008/09/04
//
//@param $H_order
//
//@access public
//@return hash
//
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/17
//
//@access public
//@return none
//
class ShopOrderUserInfoModel extends ShopOrderDetailModel {
	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderUserInfoModel.SITE_SHOP);
	}

	getUserInfomation(H_info, flg = false) //企業コード追加 0100416miya
	//オーダー情報からお客様情報を取得
	//usr.mailをord.chargermail as mailに変更 D024
	//order_tbに入っていなければ上書きって言われてたけど、いらないそうです（山田さん）
	//$O_post = new Post();
	//if(true == $flg){
	//// 第2階層権限を持っていたら第2階層部署から情報を取得する
	//$postid = $O_post->getTargetRootPostId($H_info["pactid"], $H_info["postid"], "post_relation_tb", 2);
	////			$postid = $O_post->getRootPostId($H_info["pactid"]);
	//}
	//// それ以外はroot部署から
	//else{
	//$postid = $O_post->getRootPostId($H_info["pactid"]);
	//}
	//
	//// お客様情報の元データを取得
	//$sql = "SELECT ".
	//"prels.pactcode, prels.salepost, prels.aobnumber, prels.signed, prels.signeddate, prels.knowledge, prels.tdbcode, ".
	//"prels.worldtel, prels.accountcomment, prels.existcircuit ".
	//"prels.tdbcode, prels.knowledge ".
	//"FROM ".
	//"post_rel_shop_info_tb prels ".
	//"WHERE ".
	//"prels.postid=" .$postid. " AND prels.shopid=". $H_info["shopid"]. " AND prels.pactid=". $H_info["pactid"];
	//
	//$H_post = $this->get_DB()->queryRowHash($sql);
	//
	//// オーダー情報で欠けてるものをお客様情報から補完
	//foreach($H_over as $key=>$val){
	//if((false == isset($H_order[$val])) || ("" == $H_order[$val])){
	//if(true == isset($H_post[$key])){
	//$H_order[$val] = $H_post[$key];
	//}
	//}
	//}
	{
		var H_over = {
			pactcode: "destinationcode",
			salepost: "salepost",
			aobnumber: "matterno",
			signed: "certificate",
			signeddate: "certificatelimit",
			knowledge: "knowledge",
			tdbcode: "tdbcode",
			worldtel: "worldtel",
			accountcomment: "accountcomment",
			existcircuit: "existcircuit",
			tdbcode: "tdbcode"
		};
		var sql = "SELECT " + "ord.shopnote, ord.salepost, ord.matterno, ord.destinationcode, " + "ord.certificate, ord.certificatelimit, ord.knowledge, ord.tdbcode," + "prel.pactcode, usr.telno as usrtelno, usr.faxno as usrfaxno, usr.zip as usrzip, " + "usr.addr1 as usraddr1, usr.addr2 as usraddr2, usr.building as usrbuil, ord.chargermail as mail,usr.acceptmail5, " + "post.telno, post.faxno, ord.worldtel, ord.accountcomment, ord.existcircuit " + "FROM " + ShopOrderUserInfoModel.ORD_TB + " ord " + "INNER JOIN pact_rel_shop_tb prel ON prel.pactid=ord.pactid " + "INNER JOIN post_tb post ON post.postid=ord.postid " + "LEFT JOIN user_tb usr ON usr.userid=ord.chargerid " + "WHERE " + "ord.orderid=" + H_info.orderid;
		var H_order = this.get_DB().queryRowHash(sql);
		return H_order;
	}

	makeUserInfomationSQL(H_info, orderid) //端末分ループ. フリーワード用のupdate文を作る
	//お客様情報用のupdate文
	{
		var idx = 0;

		if (this.O_order.type_blp != H_info.dbget.order.order.ordertype && this.O_order.type_acc != H_info.dbget.order.order.ordertype && Array.isArray(H_info.free_up)) {
			{
				let _tmp_0 = H_info.free_up;

				for (var key in _tmp_0) {
					var val = _tmp_0[key];
					H_sql[key] = "UPDATE " + ShopOrderUserInfoModel.ORD_DET_TB + " " + "SET " + "freeword1=" + this.get_DB().dbQuote(val["free_one" + idx], "text", false) + ", " + "freeword2=" + this.get_DB().dbQuote(val["free_two" + idx], "text", false) + ", " + "freeword3=" + this.get_DB().dbQuote(val["free_the" + idx], "text", false) + ", " + "freeword4=" + this.get_DB().dbQuote(val["free_for" + idx], "text", false) + " " + "WHERE " + "orderid=" + orderid + " AND detail_sort=" + idx;
					idx++;
				}
			}
		} else {
			var H_sql = this.O_order.A_empty;
		}

		var sql = "UPDATE " + ShopOrderUserInfoModel.ORD_TB + " " + "SET " + "matterno=" + this.get_DB().dbQuote(H_info.update.matterno, "text", false) + ", " + "destinationcode=" + this.get_DB().dbQuote(H_info.update.destinationcode, "text", false) + ", " + "salepost=" + this.get_DB().dbQuote(H_info.update.salepost, "text", false) + ", " + "knowledge=" + this.get_DB().dbQuote(H_info.update.knowledge, "text", false) + ", " + "shopnote=" + this.get_DB().dbQuote(H_info.update.shopnote, "text", false) + ", " + "certificate=" + this.get_DB().dbQuote(H_info.update.certificate, "text", false) + ", " + "worldtel=" + this.get_DB().dbQuote(H_info.update.worldtel, "text", false) + ", " + "accountcomment=" + this.get_DB().dbQuote(H_info.update.accountcomment, "text", false) + ", " + "existcircuit=" + this.get_DB().dbQuote(H_info.update.existcircuit, "text", false) + ", " + "tdbcode=" + this.get_DB().dbQuote(H_info.update.tdbcode, "text", false) + " " + "WHERE orderid=" + orderid;
		H_sql.push(sql);
		return H_sql;
	}

	getFreewordDefault(H_order) {
		if (undefined == H_order) {
			return false;
		}

		for (var key in H_order) {
			var val = H_order[key];
			H_result["free_one" + key] = val.free_one;
			H_result["free_two" + key] = val.free_two;
			H_result["free_the" + key] = val.free_the;
			H_result["free_for" + key] = val.free_for;
		}

		return H_result;
	}

	__destruct() {
		super.__destruct();
	}

};