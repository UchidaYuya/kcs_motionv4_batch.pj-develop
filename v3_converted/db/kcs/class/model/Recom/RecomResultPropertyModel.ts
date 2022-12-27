//
//シミュレーション結果用プロパティモデル
//
//@uses RecomPropertyModel
//@filesource
//@package Model
//@subpackage Recom
//@author kitamura
//@since 2010/02/19
//
//
//シミュレーション結果用プロパティモデル
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
//H_self
//
//@var array
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
//@return RecomResultPropertyModel
//
//
//パブリックセッションから値を設定
//
//@author kitamura
//@since 2010/02/19
//
//@param array $H_session
//@access public
//@return RecomResultPropertyModel
//
//
//セルフセッションから値を設定
//
//@author kitamura
//@since 2010/02/19
//
//@param array $H_session
//@access public
//@return RecomResultPropertyModel
//
//
//現在の部署IDを取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return integer
//
//
//データをこのオブジェクト用に整形する
//
//@author kitamura
//@since 2010/02/19
//
//@param array $H_options
//@access protected
//@return RecomResultPropertyModel
//
class RecomResultPropertyModel extends RecomPropertyModel {
	static G_SESS = "g_sess";
	static P_SESS = "p_sess";
	static S_SESS = "s_sess";

	setGlobalSession(H_session) {
		if (true == (undefined !== H_session.pactid)) {
			this.setPactId(H_session.pactid);
		}

		if (true == (undefined !== H_session.postid)) {
			this.setPostId(H_session.postid);
		}

		if (true == (undefined !== H_session.language)) {
			this.setLanguage(H_session.language);
		} else {
			this.setLanguage("JPN");
		}

		this.H_global = H_session;
		return this;
	}

	setPublicSession(H_session) {
		if (true == (undefined !== H_session.year)) {
			this.setYear(+H_session.year);
		}

		if (true == (undefined !== H_session.month)) {
			this.setMonth(+H_session.month);
		}

		this.H_public = H_session;
		return this;
	}

	setSelfSession(H_session) {
		if (true == (undefined !== H_session.post.range)) {
			this.setRange(H_session.post.range);
		}

		if (true == (undefined !== H_session.post.telno)) {
			this.setTelno(H_session.post.telno);
		}

		if (true == (undefined !== H_session.post.buysel)) {
			var changecourse = H_session.post.buysel === "on" ? true : false;
			this.setChangeCourse(changecourse);
		} else {
			this.setChangeCourse(false);
		}

		if (true == (undefined !== H_session.post.division)) {
			this.setDivision(H_session.post.division);
		}

		if (true == (undefined !== H_session.post.carid)) {
			this.setCarId(H_session.post.carid);
		}

		if (true == (undefined !== H_session.post.period)) {
			this.setMonthCnt(H_session.post.period);
		}

		if (true == (undefined !== H_session.post.pakefree)) {
			var changePacketFree = H_session.post.pakefree;
			this.setChangePacketFree(changePacketFree);
		}

		if (false == !H_session.post.disp_point) {
			this.setSimId(H_session.post.disp_point);
		}

		if (true == (undefined !== H_session.ptn.border_sel)) {
			var allFlag = H_session.ptn.border_sel === "all" ? true : false;
			this.setAllFlag(allFlag);
		}

		if (true == (undefined !== H_session.ptn.border)) {
			this.setBorder(H_session.ptn.border);
		}

		if (true == (undefined !== H_session.ptn.slash)) {
			this.setSlash(H_session.ptn.slash);
		}

		if (true == (undefined !== H_session.ptn.limit)) {
			this.setLimit(H_session.ptn.limit);
		}

		if (false == !H_session.get.s) {
			this.setSort(H_session.get.s);
		}

		if (true == (undefined !== H_session.get.p)) {
			this.setPage(H_session.get.p);
		}

		this.H_self = H_session;
		return this;
	}

	getCurrentPostId() {
		if (!this.isCurrentPostId()) {
			if (true == !this.H_self.post.disp_point) {
				this.setCurrentPostId(this.H_global.current_postid);
			} else {
				this.setCurrentPostId(this.H_self.post.postid);
			}
		}

		return this.__call("getCurrentPostId", Array());
	}

	_parse(H_options) {
		for (var key in H_options) {
			var H_option = H_options[key];

			switch (key) {
				case RecomResultPropertyModel.G_SESS:
					this.setGlobalSession(H_option);
					break;

				case RecomResultPropertyModel.P_SESS:
					this.setPublicSession(H_option);
					break;

				case RecomResultPropertyModel.S_SESS:
					this.setSelfSession(H_option);
					break;

				default:
					this.getOut().errorOut(11, "\u672A\u77E5\u306E\u30CF\u30C3\u30B7\u30E5", 0);
					break;
			}
		}

		return this;
	}

};