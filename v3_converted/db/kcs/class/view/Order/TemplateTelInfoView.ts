//
//電話詳細情報表示View（雛型用）
//
//更新履歴：<br>
//2008/04/17 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//電話詳細情報表示View（雛型用）
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/04/17
//@uses MtSetting
//@uses MtSession
//

require("view/Order/OrderTelInfoView.php");

//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//電話詳細情報入力フォーム要素作成（雛形の場合は1回のみ回す。またinputnameの後にナンバリングしない）
//
//@author miyazawa
//@since 2008/04/17
//
//@param mixed $H_telproperty
//@param int $telcount
//@param mixed $H_items
//@access public
//@return array
//
//
//電話詳細情報入力フォーム要素作成（雛形用)
//
//@author date
//@since 2014/11/04
//
//@param mixed $H_telproperty
//@param int $telcount
//@param mixed $H_items
//@access public
//@return array
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
class TemplateTelInfoView extends OrderTelInfoView {
	constructor() {
		super();
	}

	makeTelInfoForm(H_telproperty: {} | any[], telcount = 1, language = "JPN") //マスク用の名前を入れる配列
	//アイテムとマスクの両方をこれに入れて返す
	//雛形は電話番号数は必ず１
	//雛形の場合はアイテム名に枝番をつけない
	{
		var H_telitems, H_telitemrules;
		var A_telitems_for_mask = Array();
		var H_item_and_mask = Array();
		[H_telitems, H_telitemrules] = super.makeTelInfoForm(H_telproperty, 1, language);

		for (var i = 0; i < H_telitems.length; i++) {
			H_telitems[i].inputname = H_telitems[i].inputname.replace(/_0$/g, "");
			A_telitems_for_mask.push(H_telitems[i].inputname);
		}

		for (var ruleCnt = 0; ruleCnt < H_telitemrules.length; ruleCnt++) {
			H_telitemrules[ruleCnt].name = H_telitemrules[ruleCnt].name.replace(/_0$/g, "");
		}

		H_item_and_mask.item = H_telitems;
		H_item_and_mask.mask = A_telitems_for_mask;
		H_item_and_mask.rule = H_telitemrules;
		return H_item_and_mask;
	}

	makeTelInfoForm2(H_telproperty: {} | any[], telcount = 1, language = "JPN") //マスク用の名前を入れる配列
	//アイテムとマスクの両方をこれに入れて返す
	//雛形は電話番号数は必ず１
	//雛形の場合はアイテム名に枝番をつけない
	{
		var H_telitems, H_telitemrules;
		var A_telitems_for_mask = Array();
		var H_item_and_mask = Array();
		[H_telitems, H_telitemrules] = super.makeTelInfoFormForTemplate(H_telproperty, 1, language);

		for (var i = 0; i < H_telitems.length; i++) {
			H_telitems[i].inputname = H_telitems[i].inputname.replace(/_0$/g, "");
			A_telitems_for_mask.push(H_telitems[i].inputname);
		}

		for (var ruleCnt = 0; ruleCnt < H_telitemrules.length; ruleCnt++) {
			H_telitemrules[ruleCnt].name = H_telitemrules[ruleCnt].name.replace(/_0$/g, "");
		}

		H_item_and_mask.item = H_telitems;
		H_item_and_mask.mask = A_telitems_for_mask;
		H_item_and_mask.rule = H_telitemrules;
		return H_item_and_mask;
	}

	__destruct() {
		super.__destruct();
	}

};