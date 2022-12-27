//
//シミュレーション結果ダウンロード用プロパティモデル
//
//@uses RecomPropertyModel
//@filesource
//@package Model
//@subpackage Recom
//@author kitamura
//@since 2010/02/19
//
//
//シミュレーション結果ダウンロード用プロパティモデル
//
//@uses RecomPropertyModel
//@package Model
//@subpackage Recom
//@author kitamura
//@since 2010/02/19
//

require("model/Recom/RecomPropertyModel.php");

//
//H_global
//
//@var array
//@access protected
//
//
//H_public
//
//@var array
//@access protected
//
//
//ダウンロードかどうか
//
//@var boolean
//@access protected
//
//
//グローバルセッションから値を設定
//
//@author kitamura
//@since 2010/02/19
//
//@param array $H_session
//@access public
//@return RecomDownloadPropertyModel
//
//
//DB取得した値から設定
//
//@author kitamura
//@since 2010/02/19
//
//@param array $H_cond
//@access public
//@return RecomDownloadPropertyModel
//
//
//データをこのオブジェクト用に整形する
//
//@author kitamura
//@since 2010/02/19
//
//@param array $H_options
//@access protected
//@return RecomDownloadPropertyModel
//
class RecomDownloadPropertyModel extends RecomPropertyModel {
	constructor() {
		super(...arguments);
		this.isDownload = true;
	}

	static G_SESS = "g_sess";
	static COND = "cond";

	setGlobalSession(H_session) {
		if (true == (undefined !== H_session.pactid)) {
			this.setPactId(H_session.pactid);
		}

		if (true == (undefined !== H_session.postid)) {
			this.setPostId(H_session.postid);
		}

		if (true == (undefined !== H_session.current_postid)) {
			this.setCurrentPostId(H_session.current_postid);
		}

		if (true == (undefined !== H_session.language)) {
			this.setLanguage(H_session.language);
		} else {
			this.setLanguage("JPN");
		}

		this.H_global = H_session;
		return this;
	}

	setCondition(H_cond) //以下は適当な値を設定
	{
		this.setCarId(H_cond.carid_before).setSimId(H_cond.simid).setSlash(H_cond.slash).setBorder(H_cond.border).setYear(H_cond.year).setMonth(H_cond.month).setChangeCourse(H_cond.is_change_course).setChangePacketFree(H_cond.change_packet_free_mode).setMonthCnt(H_cond.monthcnt).setRange("all").setAllFlag(H_cond.is_all == true ? true : false).setTelNo(H_cond.telno);
		this.setLimit(10).setSort("1|a").setPage(1);
		this.H_cond = H_cond;
		return this;
	}

	_parse(H_options) {
		for (var key in H_options) {
			var H_option = H_options[key];

			switch (key) {
				case RecomDownloadPropertyModel.G_SESS:
					this.setGlobalSession(H_option);
					break;

				case RecomDownloadPropertyModel.COND:
					this.setCondition(H_option);
					break;

				default:
					this.getOut().errorOut(15, "\u672A\u77E5\u306E\u30CF\u30C3\u30B7\u30E5", 0);
					break;
			}
		}

		return this;
	}

};