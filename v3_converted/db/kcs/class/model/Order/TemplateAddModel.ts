//
//注文雛型新規作成Model
//
//@package Order
//@subpackage Model
//@filesource
//@author miyazawa
//@since 2008/07/08
//@uses OrderModel
//@uses OrderUtil
//
//
//
//注文雛型新規作成Model
//
//@uses ModelBase
//@package Order
//@author miyazawa
//@since 2008/07/08
//

require("OrderFormModel.php");

require("model/PostModel.php");

//
//コンストラクター
//
//@author miyazawa
//@since 2008/04/01
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_order
//@access public
//@return void
//
//
//注文雛型画面に表示する入力項目をcirid,carid,発注種別をもとに取得する（typeの前に「T」がついただけ）
//
//@author miyazawa
//@since 2008/07/09
//
//@param $type(発注種別)
//@param $cirid(キャリアID)
//@param $carid(回線種別)
//
//@access public
//@return hash
//
//
//フォーム入力ルール取得 （typeの前に「T」がついただけ）
//
//@author miyazawa
//@since 2008/07/13
//
//@param mixed $H_sess
//@access public
//@return
//
//
//注文雛型用ツリー作成
//
//@author miyazawa
//@since 2008/07/14
//
//@param array $H_Dir
//@access public
//@return mixed
//
//
//部署名の取得
//
//@author miyazawa
//@since 2008/07/14
//
//@param mixed $postid
//@access public
//@return string
//
//
//checkGevinProduct
//
//@author
//@since 2010/12/16
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//checkGivenProduct
//
//@author
//@since 2011/01/28
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/01
//
//@access public
//@return void
//
class TemplateAddModel extends OrderFormModel {
	constructor(O_db0, H_g_sess, site_flg = OrderModelBase.SITE_USER) {
		super(O_db0, H_g_sess, site_flg);
	}

	getOrderItem(H_info) //英語化権限 20090210miya
	//sql
	{
		if (true == Array.isArray(H_info) && true == H_info.eng) {
			var itemname_str = "itemname_eng AS itemname";
		} else {
			itemname_str = "itemname";
		}

		var sql = "SELECT " + itemname_str + ", itemgrade, inputtype, inputname, inputdef, usertype, property " + "FROM mt_order_item_tb WHERE type='T" + H_info.type + "' AND cirid='" + H_info.cirid + "' AND carid='" + H_info.carid + "' " + "ORDER BY itemgrade DESC, show_order, inputdef, inputname, inputtype";
		return this.get_DB().queryHash(sql);
	}

	getRule(H_info) //英語化権限 20090210miya
	{
		if (true == H_info.eng) {
			var messstr = "rule_message_eng";
		} else {
			messstr = "rule_message";
		}

		var sql = "SELECT rule_element AS name, " + messstr + " AS mess, rule_type AS type, rule_format AS format, rule_validation AS validation, " + "rule_reset AS reset, rule_force AS force FROM mt_addrule_tb " + "WHERE type='T" + H_info.type + "' AND cirid=" + H_info.cirid + " AND carid=" + H_info.carid + " ORDER BY sort;";
		return this.get_DB().queryHash(sql);
	}

	getOrderTreeJS(H_Dir: {} | any[]) //部署設定型
	{
		var O_tree = new TreeAJAX();
		var O_xlist = new ListAJAX();
		H_tree.js = O_tree.treeJs();
		O_tree.setPost = true;
		O_tree.current_postid = this.H_G_Sess.current_postid;
		H_tree.tree_str = O_tree.makeTreeOrderForm(this.H_G_Sess.postid, "", H_Dir.carid);
		O_xlist.type = "setpost";
		H_tree.xlist_str = O_xlist.makeList();
		return H_tree;
	}

	getPostNameString(postid) {
		var H_post = PostModel.getPostData(postid);
		var postname_str = H_post.postname;

		if (H_post.userpostid) {
			postname_str += "(" + H_post.userpostid + ")";
		}

		return postname_str;
	}

	checkGivenProduct(H_sess) //価格表も直接入力もマスク(醜いから2段に分けた)
	//個別にマスクが同時にされた場合
	{
		var result = true;

		if (undefined !== H_sess.SELF.mask.listbtn && undefined !== H_sess.SELF.mask.handbtn) {
			if ("1" == H_sess.SELF.mask.listbtn && "1" == H_sess.SELF.mask.handbtn) {
				result = this.checkGivenProductDetail(H_sess, 0);
			}
		} else if ("1" == H_sess.SELF.mask.product) {
			result = this.checkGivenProductDetail(H_sess, 1);
		}

		return result;
	}

	checkGivenProductDetail(H_sess, pattern) {
		var result = true;
		var error_target = "\u300C\u4FA1\u683C\u8868\u304B\u3089\u9078\u629E\u300D\u3001\u300C\u76F4\u63A5\u5165\u529B\u3067\u6CE8\u6587\u300D\u3092\u30DE\u30B9\u30AF\u3059\u308B\u306B\u306F";

		if (1 == pattern) {
			error_target = "\u5546\u54C1\u3092\u56FA\u5B9A\u3059\u308B\u306B\u306F";
		}

		if (Array() == H_sess[TemplateAddModel.PUB].H_product && "A" != H_sess[TemplateAddModel.PUB].type) {
			result = error_target + "\u5546\u54C1\u3092\u6307\u5B9A\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059";
		} else if ("A" == H_sess[TemplateAddModel.PUB].type) //価格表
			{
				if (undefined !== H_sess[TemplateAddModel.PUB].H_product.acce && Array.isArray(H_sess[TemplateAddModel.PUB].H_product.acce)) {
					for (var val of Object.values(H_sess[TemplateAddModel.PUB].H_product.acce)) {
						if (undefined !== H_sess.SELF["acce" + val.productid] && 1 > H_sess.SELF["acce" + val.productid]) {
							result = error_target + "\u6570\u91CF\u3092\u6307\u5B9A\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059";
							break;
						}
					}
				}

				if (undefined !== H_sess[TemplateAddModel.PUB].free_acce && Array.isArray(H_sess[TemplateAddModel.PUB].free_acce)) {
					for (var val of Object.values(H_sess[TemplateAddModel.PUB].free_acce)) {
						if (undefined !== val.free_count && 1 > val.free_count) {
							result = error_target + "\u6570\u91CF\u3092\u6307\u5B9A\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059";
							break;
						}
					}
				}
			} else if (!(undefined !== H_sess[TemplateAddModel.PUB].H_product.tel.productname) || !H_sess[TemplateAddModel.PUB].H_product.tel.productname) {
			result = error_target + "\u5546\u54C1\u3092\u6307\u5B9A\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059";
		} else if (!(undefined !== H_sess.SELF.color) || !H_sess.SELF.color) {
			result = error_target + "\u8272\u3092\u6307\u5B9A\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059";
		}

		return result;
	}

	__destruct() {
		super.__destruct();
	}

};