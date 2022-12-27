//価格表お知らせメール

import ProcessBaseBatch from '../ProcessBaseBatch';
import PriceMailView from '../../view/script/PriceMailView';
import PriceMailModel from '../../model/script/PriceMailModel';
import MtScriptAmbient from '../../MtScriptAmbient';
import MtMailUtil from '../../MtMailUtil';
import MtAuthority from '../../MtAuthority';
import UserPriceModel from '../../model/Price/UserPriceModel';
import PostModel from '../../model/PostModel';
import GroupModel from '../../model/GroupModel';
import MtSetting from '../../MtSetting';
import PricePatternModel from '../../model/PricePatternModel';

const fs = require('fs');
export default class PriceMailProc extends ProcessBaseBatch {
	O_view: PriceMailView;
	O_model: PriceMailModel;
	O_set: MtSetting;
	O_mail: MtMailUtil;
	O_pattern: PricePatternModel;
	H_mail: any[];
	O_post: PostModel;
	mail_dir: string;
	A_pricelistid: any[];
	O_group: GroupModel;
	A_dis_pricelistid: any;
	constructor(H_param: {} | any[] = Array()) //view作成
	{
		super(H_param);
		this.O_view = new PriceMailView();
		this.O_model = new PriceMailModel();
		this.O_mail = new MtMailUtil();
		this.O_set = MtSetting.singleton();
		this.H_mail = Array();
		this.O_pattern = PricePatternModel.singleton();
		this.O_post = new PostModel();
		this.A_pricelistid = Array();
		this.mail_dir = this.O_set.get("write_mail_dir");
		this.O_group = new GroupModel();
	}

	async doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	{
		this.set_Dirs(this.O_view.get_ScriptName());
		this.lockProcess(this.O_view.get_ScriptName());
		this.getOut().infoOut("管理者初期値をもつ企業の一覧を取得");
		var A_pactlist = Array();
		A_pactlist = await this.O_model.getPactlistOfPricetype("fnc_mt_price_admin");
		var count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //各顧客に現在有効な価格表がメール送信希望状態かをチェック
			{
				this.getOut().infoOut("対象件数" + count_pactlist);
				this.checkPricelistTypeAdminDefault(A_pactlist);
			} else {
			this.getOut().infoOut("該当する企業無し");
		}

		this.getOut().infoOut("販売店初期値をもつ企業の一覧を取得");
		A_pactlist = Array();
		A_pactlist = await this.O_model.getPactlistOfPricetype("fnc_mt_price_shop");
		count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //販売店初期値の価格表をつかう
			{
				this.getOut().infoOut("対象件数" + count_pactlist);
				this.checkPricelistTypeShop(A_pactlist, "fnc_mt_price_shop");
			} else {
			this.getOut().infoOut("該当する企業無し");
		}

		this.getOut().infoOut("顧客初期値をもつ企業の一覧を取得");
		A_pactlist = Array();
		A_pactlist = await this.O_model.getPactlistOfPricetype("fnc_mt_price_pact");
		count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //顧客初期値
			{
				this.getOut().infoOut("対象件数" + count_pactlist);
				this.checkPricelistTypeShop(A_pactlist, "fnc_mt_price_pact");
			} else {
			this.getOut().infoOut("該当する企業無し");
		}

		this.getOut().infoOut("部署初期値をもつ企業の一覧を取得");
		A_pactlist = Array();
		A_pactlist = await this.O_model.getPactlistOfPricetype("fnc_mt_price_post");
		count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //部署初期値
			{
				this.getOut().infoOut("対象件数" + count_pactlist);
				this.checkPricelistTypeShop(A_pactlist, "fnc_mt_price_post");
			} else {
			this.getOut().infoOut("該当する企業無し");
		}

		if (0 < this.H_mail.length) {
			this.mailSendFlow();
		} else {
			this.getOut().infoOut("メール送信対象ユーザがいません。");
		}

		if (0 < this.A_pricelistid.length) //公開中かつ、メール送信フラグがたっている。
			//しかし、メール送信さきの顧客がない価格表のIDを取得
			{
				this.A_dis_pricelistid = this.O_model.checkDisPricelist(this.A_pricelistid);

				this.O_model.updateMailStatus(this.A_pricelistid, 2);
			}

		this.unLockProcess(this.O_view.get_ScriptName());
		this.set_ScriptEnd();
		throw process.exit(0);
	}

	async checkPricelistTypeAdminDefault(A_pactlist: any[]) {
		var max = A_pactlist.length;

		for (var cnt = 0; cnt < max; cnt++) //全ppid をループ
		{
			var O_price = new UserPriceModel(A_pactlist[cnt].pactid);
			this.getOut().infoOut("pactid = " + A_pactlist[cnt].pactid);
			{
				let _tmp_0: any = this.O_pattern.H_ppid;

				for (var ppid in _tmp_0) //特定のパターンの価格表が存在しない場合
				{
					var value = _tmp_0[ppid];
					var pricelistid = await O_price.getPricelistID(ppid, 0, A_pactlist[cnt].groupid, "fnc_mt_price_admin", A_pactlist[cnt].pactid);

					if (pricelistid) //1以外はメール送信しない
						{
							var mailstatus = await O_price.returnMailStatus(pricelistid);

							if (1 === mailstatus) //その企業に属する価格表メールを受け取るユーザの情報を取得
								//処理済みリストに価格表IDを追加
								{
									this.getOut().infoOut("メール情報を取得");
									this.O_model.getUserlistInThisPact(A_pactlist[cnt].pactid, this.H_mail);
									this.A_pricelistid.push(pricelistid);
								}
						}
				}
			}
		}
	}

	async checkPricelistTypeShop(A_pactlist: any[], type: string) {
		var max = A_pactlist.length;

		for (var cnt = 0; cnt < max; cnt++) {
			var O_price = new UserPriceModel(A_pactlist[cnt].pactid);
			this.getOut().infoOut("pactid = " + A_pactlist[cnt].pactid);
			var A_postlist = await this.O_post.getChildList(A_pactlist[cnt].pactid, await this.O_post.getRootPostid(A_pactlist[cnt].pactid));
			var count_post = A_postlist.length;

			for (var i = 0; i < count_post; i++) {
				this.getOut().infoOut("\tpostid = " + A_postlist[i]);
				O_price.setPostID(A_postlist[i]);
				{
					let _tmp_1: any = this.O_pattern.H_ppid;

					for (var ppid in _tmp_1) {
						var value = _tmp_1[ppid];
						var H_shopid = await O_price.getCarrierShop(value.carid);

						if (H_shopid) //特定のパターンの価格表が存在しない場合
						{
							var pricelistid = await O_price.getPricelistID(ppid, H_shopid.shopid, A_pactlist[cnt].groupid, type, A_pactlist[cnt].pactid);

							if (pricelistid) //1以外はメール送信しない
							{
								var mailstatus = await O_price.returnMailStatus(pricelistid);

								if (1 === mailstatus) //その企業に属する価格表メールを受け取るユーザの情報を取得
									//処理済みリストに価格表IDを追加
									{
										this.getOut().infoOut("メール情報を取得");
										this.O_model.getUserlistInThisPost(A_postlist[i], this.H_mail);
										this.A_pricelistid.push(pricelistid);
									}
							}
						}
					}
				}
			}
		}
	}

	mailSendFlow() {
		this.getOut().infoOut("メール送信対象ユーザがいません。");
		var pacts = Array();
		{
			let _tmp_2 = this.H_mail;

			for (var userid in _tmp_2) //送信用元データファイルを生成
			{
				var value = _tmp_2[userid];
				var H_temp: any = Array();
				H_temp.to = value.mail;
				H_temp.to_name = value.username;
				H_temp.groupid = value.groupid;
				H_temp.groupname = this.O_group.getGroupName(value.groupid);
				H_temp.pactid = value.pactid;
				var auth: any = MtAuthority.singleton(value.pactid);

				if (!(-1 !== pacts.indexOf(value.pactid)) && auth.chkPactFuncIni("fnc_pact_login")) {
					pacts.push(value.pactid);
				}

				if (-1 !== pacts.indexOf(value.pactid)) {
					H_temp.userid_ini = value.userid_ini;
				}

				H_temp.type = value.type;
				var mail_file = this.mail_dir + value.userid + "_" + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split("-").join("").split(":").join("").split(" ").join("") + ".lst";
				this.getOut().infoOut(mail_file + "の作成");
				var fp = fs.openSync(mail_file, "x");
				// var lock = flock(fp, LOCK_EX);
				fs.writeSync(fp, "<?php\n");
				fs.writeSync(fp, "$ml_list = '" + JSON.stringify([H_temp]) + "';\n");
				fs.writeSync(fp, "$title = '価格表更新のお知らせ Notice of price list update';\n");

				if (value.groupid <= 1) {
					fs.writeSync(fp, "$from = '" + this.O_set.get("mail_def_from") + "';\n");
					fs.writeSync(fp, "$from_name = '" + this.O_set.get("mail_def_from_name") + "';\n");
				} else {
					fs.writeSync(fp, "$from_name = '" + this.O_group.getGroupSystemname(value.groupid) + " 運営係';\n");
					fs.writeSync(fp, "$from = '" + this.O_group._getAdminMailaddressForGroup(value.groupid) + "';\n");
				}

				fs.writeSync(fp, "$status = 2;\n");
				fs.writeSync(fp, "?>\n");
				fs.closeSync(fp);
			}
		}
	}

};
