//
//全て一覧詳細画面View
//
//更新履歴：<br>
//2008/04/04 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/04
//
//
//error_reporting(E_ALL);
//
//全て一覧細画面のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/04/04
//

require("view/Management/ManagementDetailViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2008/04/04
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//checkCGIParam
//
//@author houshiyama
//@since 2008/04/04
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/04/04
//
//@access public
//@return void
//
class ManagementDetailView extends ManagementDetailViewBase {
	constructor() {
		super();
	}

	checkCGIParam() {
		if (undefined !== _GET.id == true) //IDが電話ならば電話詳細へ
			{
				var A_id = split(":", _GET.id);

				if (A_id[0] == ManagementDetailView.TELMID) {
					MtExceptReload.raise("/Management/Tel/TelDetail.php?id=" + A_id[1] + ":" + A_id[2]);
				} else if (A_id[0] == ManagementDetailView.ETCMID) {
					MtExceptReload.raise("/Management/ETC/EtcDetail.php?id=" + A_id[1]);
				} else if (A_id[0] == ManagementDetailView.PURCHMID) {
					MtExceptReload.raise("/Management/Purchase/PurchaseDetail.php?id=" + A_id[1] + ":" + A_id[2]);
				} else if (A_id[0] == ManagementDetailView.COPYMID) {
					MtExceptReload.raise("/Management/Copy/CopyDetail.php?id=" + A_id[1] + ":" + A_id[2]);
				} else if (A_id[0] == ManagementDetailView.ASSMID) {
					MtExceptReload.raise("/Management/Assets/AssetsDetail.php?id=" + A_id[2]);
				} else if (A_id[0] == ManagementDetailView.TRANMID) {
					MtExceptReload.raise("/Management/Transit/TransitDetail.php?id=" + A_id[1] + ":" + A_id[2]);
				} else if (A_id[0] == ManagementDetailView.EVMID) {
					MtExceptReload.raise("/Management/Ev/EvDetail.php?id=" + A_id[1] + ":" + A_id[2]);
				} else if (A_id[0] == ManagementDetailView.HEALTHMID) {
					MtExceptReload.raise("/Management/Healthcare/HealthcareDetail.php?id=" + A_id[1] + ":" + A_id[2]);
				}
			} else {
			this.errorOut(8, "\u76F4\u30A2\u30AF\u30BB\u30B9", false, "/Management/menu.php");
			throw die();
		}
	}

	__destruct() {
		super.__destruct();
	}

};