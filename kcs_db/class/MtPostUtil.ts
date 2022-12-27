//部署関連のユーティリティ
//
//更新履歴：<br>
//2008/04/02 上杉勝史 作成
//
import PostModel from "./model/PostModel";
import MtOutput from "./MtOutput";
import MtHtmlUtil from "./MtHtmlUtil";

export default class MtPostUtil {
	O_Out: MtOutput;
	O_PostModel: PostModel;
	O_Html: any;
	constructor() //$this->O_Html = new MtHtmlUtil();
	{
		this.O_Out = MtOutput.singleton();
		this.O_PostModel = new PostModel();
	}

	getOut() {
		return this.O_Out;
	}

	gPost() {
		return this.O_PostModel;
	}

	gHtml() {
		return this.O_Html;
	}

	async getPostTreeBand(pactid: number, postid: number, target_postid: number, tableno = "", joint = " -> ", cssclass = "", userpostid = 1, errout = true, link = true, parent_view = false) //入力パラメータのエラーチェック
	//ユーザー部署コードの種別判定
	//自分の所属部署以下を加えるためのフラグ
	{
		if (!isNaN(Number(pactid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getPostTreeBand() pactidが正しく指定されていません", false);
		}

		if (!isNaN(Number(postid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getPostTreeBand() postidが正しく指定されていません", false);
		}

		if (!isNaN(Number(target_postid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getPostTreeBand() target_postidが正しく指定されていません", false);
		}

		var A_parent_list = await this.gPost().getParentList(target_postid, tableno);

		if (A_parent_list == false) {
			return false;
		}

		if (-1 !== A_parent_list.indexOf(postid) == false) {
			if (errout == true) {
				this.getOut().errorOut(12, "MtPostUtil::getPostTreeBand() target_postidが正しく指定されていません", false);
			} else {
				return false;
			}
		}

		var H_parent_data = await this.gPost().getPostDataList(A_parent_list, tableno);

		switch (userpostid) {
			case 0:
				var bracket_s:any = false;
				var bracket_e:any = false;
				break;

			case 1:
				bracket_s = "(";
				bracket_e = ")";
				break;

			case 2:
				bracket_s = "[";
				bracket_e = "]";
				break;

			case 3:
				bracket_s = "<";
				bracket_e = ">";
				break;

			default:
				bracket_s = "(";
				bracket_e = ")";
		}

		var A_str = Array();
		var writeflg = false;

		if (true == parent_view) {
			writeflg = true;
		}

		for (var i = 0; i < A_parent_list.length; i++) //自分の所属部署が出てきたら書き込み開始
		{
			if (postid == A_parent_list[i] && parent_view == false) {
				writeflg = true;
			}

			if (true === writeflg) //ユーザー部署コードを整形
				//対象部署はリンクを張らない
				{
					if (userpostid == 0) {
						var linksrc = H_parent_data[A_parent_list[i]].postname;
					} else {
						linksrc = H_parent_data[A_parent_list[i]].postname + bracket_s + H_parent_data[A_parent_list[i]].userpostid + bracket_e;
					}

					if (A_parent_list[i] == target_postid || link == false) {
						var htmlstr = linksrc;
					} else {
						htmlstr = MtHtmlUtil.makePostLink(A_parent_list[i] + '', linksrc);
					}

					A_str.push(htmlstr);
				}
		}

		return A_str.join(joint);
	}

	async getTargetLevelPostid(target_postid: number, level = 0, tableno = "") {
		if (!isNaN(Number(target_postid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostid()target_postidが正しく指定されていません", false);
		}

		var A_parent_list = await this.gPost().getParentList(target_postid, tableno);

		if (A_parent_list == false) {
			return false;
		}

		if (undefined !== A_parent_list[level] == false) //↓このエラー処理は末端で実装するように変更
			//$this->getOut()->warningOut(0, "MtPostUtil::getTargetLevelPostid() 指定された階層の部署は見つかりません");
			{
				return false;
			}

		return A_parent_list[level];
	}

	async getTargetLevelPostidFromTel(telno_view: string, pactid: number, carid: number, level = 0, tableno = "") {
		if (telno_view == "") {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromTel() telno_viewがありません", false);
		}

		if (!isNaN(Number(pactid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromTel() pactidが正しく指定されていません", false);
		}

		if (!isNaN(Number(carid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromTel() caridが正しく指定されていません", false);
		}

		var target_postid = await this.gPost().getPostidFromTel(telno_view, pactid, carid, tableno);
		return this.getTargetLevelPostid(target_postid, level, tableno);
	}

	async getTargetLevelPostidFromUser(userid: string, pactid: number, level = 0) {
		if (userid == "") {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromUser() useridがありません", false);
		}

		if (!isNaN(Number(userid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromUser() useridが正しく指定されていません", false);
		}

		if (!isNaN(Number(pactid)) == false) {
			this.getOut().errorOut(0, "MtPostUtil::getTargetLevelPostidFromUser() pactidが正しく指定されていません", false);
		}

		var target_postid = await this.gPost().getPostidFromUser(userid, pactid);
		return this.getTargetLevelPostid(target_postid, level);
	}
};