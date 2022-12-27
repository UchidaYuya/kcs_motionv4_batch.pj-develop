//請求DLエラーメール
//2009/07/03 宮澤龍彦 作成
import ProcessBaseBatch from "../ProcessBaseBatch";
import DLErrorMailModel from "../../model/script/DLErrorMailModel";
import DLErrorMailView from "../../view/script/DLErrorMailView";
import MtScriptAmbient from "../../MtScriptAmbient";
import MtSetting from "../../MtSetting";
import MtMailUtil from "../../MtMailUtil";
import PostModel from "../../model/PostModel";
import GroupModel from "../../model/GroupModel";

export default class DLErrorMailProc extends ProcessBaseBatch {
	O_view: DLErrorMailView;
	O_mail: MtMailUtil;
	O_model: DLErrorMailModel;
	O_set: MtSetting;
	H_change_status: any[];
	H_mail: any[];
	mail_dir: string;
	O_group: GroupModel;
	constructor(H_param: {} | any[] = Array()) //view作成
	{
		super(H_param);
		this.O_view = new DLErrorMailView();
		this.O_model = new DLErrorMailModel();
		this.O_mail = new MtMailUtil();
		this.O_set = MtSetting.singleton();
		this.H_mail = Array();
		this.H_change_status = Array();
		this.mail_dir = "/kcs/web_script/SendList/";
		this.O_group = new GroupModel();
	}

	async doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	{
		this.set_Dirs(this.O_view.get_ScriptName());
		this.lockProcess(this.O_view.get_ScriptName());
		this.getOut().infoOut("メール未送信のエラー一覧を取得");
		var H_errorlist = Array();
		H_errorlist = await this.O_model.getDLErrorList();
		var count_error = H_errorlist.length;

		if (0 < count_error) //販売店用の配列と管理者用の配列に分ける
			{
				this.getOut().infoOut("対象件数" + count_error);
				var H_to_shop = Array();
				var H_to_Admin = Array();
				this.H_mail = Array();
				var H_to_pact = Array();
				var H_hand_pact_carid = this.O_model.getHandInfo();
				var H_hand_pact_addr = this.O_model.getHandAddr();

				for (var key in H_errorlist) {
					var val = H_errorlist[key];

					if ("logintest" == val.error_type) //ログインテストに失敗→管理者へ
						{
							H_to_Admin.push(val);
						} else if ("prtelno" == val.error_type || "login" == val.error_type && false === val.message.indexOf("ダウンロード制限時間")) //ログインに失敗→販売店へ
						//手動入力による送信先切り替え追加20101129morihara
						{
							if (undefined !== H_hand_pact_carid[val.pactid] && -1 !== H_hand_pact_carid[val.pactid].indexOf(val.carid)) {
								if (!(undefined !== H_to_pact[val.pactid])) H_to_pact[val.pactid] = Array();
								H_to_pact[val.pactid].push(val);
								continue;
							}

							if (true == !isNaN(Number(val.shopid))) {
								H_to_shop.push(val);
							} else //販売店がない場合は管理者へ
								{
									H_to_Admin.push(val);
								}
						} else if ("DL" == val.error_type) //ダウンロードに失敗→管理者へ
						{
							H_to_Admin.push(val);
						} else //どれにも当てはまらなければ管理者へ
						{
							H_to_Admin.push(val);
						}
				}

				if (0 < H_to_pact.length) {
					for (var pactid in H_to_pact) //ステータスを変更する
					{
						var A_info = H_to_pact[pactid];

						if (!(undefined !== H_hand_pact_addr[pactid])) //送信先の管理者メールアドレスが存在しない
							{
								this.infoOut("管理者メールアドレスが存在しない/pactid:=" + pactid);

								for (var H_info of A_info) H_to_Admin.push(H_info);

								continue;
							}

						var A_addr = H_hand_pact_addr[pactid];

						for (var addr of A_addr) {
							if (!(undefined !== this.H_mail[addr])) {
								this.H_mail[addr] = {
									is_hand: true,
									to_name: "",
									message: ""
								};
							}

							for (var H_info of A_info) {
								this.H_mail[addr].message = this.H_mail[addr].message + (this.H_mail[addr].message.length ? "\n" : "") + H_info.carname + "\t" + H_info.message;
							}
						}

						for (var H_info of A_info) {
							this.H_change_status.push({
								pactid: H_info.pactid,
								carid: H_info.carid,
								error_type: H_info.error_type,
								message: H_info.message
							});
						}
					}
				}

				if (0 < H_to_shop.length) {
					for (var shkey in H_to_shop) //部署ID取得
					{
						var shval = H_to_shop[shkey];
						var postid = await this.O_model.getRelPostid(shval.pactid, shval.shopid, shval.carid, 0);

						if ("" == postid) //ルート部署で取得できなかったら第二階層
							//部署ID取得
							{
								postid = this.O_model.getRelPostid(shval.pactid, shval.shopid, shval.carid, 1);
							}

						if ("" == postid) //それでも取得できなかったら管理者へ
							{
								H_to_Admin.push(shval);
							} else {
							var to_mail = await this.O_model.getDLErrorMemMail(shval.shopid);
							var to_name = this.O_model.getDLErrorMemName(shval.pactid, postid, shval.shopid, shval.carid);

							if ("" == to_mail) //メールアドレスが設定されていなかったら管理者へ
								{
									H_to_Admin.push(shval);
								} else //設定されていたらここでようやく宛先が確定される
								//宛先ごとにメッセージをまとめる
								//ステータス変更用配列に必要項目をセット
								{
									if (true == (undefined !== this.H_mail[to_mail].message)) {
										var mess_str = this.H_mail[to_mail].message + "\n" + shval.carname + "\t" + shval.compname + "(" + shval.pactid + "):\t" + shval.message;
									} else {
										mess_str = shval.carname + "\t" + shval.compname + "(" + shval.pactid + "):\t" + shval.message;
									}

									this.H_mail[to_mail] = {
										to_name: to_name,
										message: mess_str
									};
									this.H_change_status.push({
										pactid: shval.pactid,
										carid: shval.carid,
										error_type: shval.error_type,
										message: shval.message
									});
								}
						}
					}
				}

				if (0 < H_to_Admin.length) {
					to_mail = this.O_set.get("mail_def_errorto");
					to_name = this.O_set.get("mail_error_to_name");

					for (var adval of H_to_Admin) //宛先は一つなのでメッセージをまとめる
					//ステータス変更用配列に必要項目をセット
					{
						if (true == (undefined !== this.H_mail[to_mail].message)) {
							mess_str = this.H_mail[to_mail].message + "\n" + adval.carname + "\t" + adval.compname + "(" + adval.pactid + "):\t" + adval.message;
						} else {
							mess_str = adval.carname + "\t" + adval.compname + "(" + adval.pactid + "):\t" + adval.message;
						}

						this.H_mail[to_mail] = {
							to_name: to_name,
							message: mess_str
						};
						this.H_change_status.push({
							pactid: adval.pactid,
							carid: adval.carid,
							error_type: adval.error_type,
							message: adval.message
						});
					}
				}

				if (0 < this.H_mail.length) {
					this.errorMailSend();
				} else {
					this.getOut().infoOut("メール送信対象ユーザがいません。");
				}

				this.O_model.updateErrorStatus(this.H_change_status);
			} else {
			this.getOut().infoOut("エラー件数0");
		}

		this.unLockProcess(this.O_view.get_ScriptName());
		this.set_ScriptEnd();
		throw process.exit(0);// 2022cvt_009
	}

	errorMailSend() //管理者に飛ばしたが必要ないので（Agent環境移行の後猪口さんから管理者に飛ばさないでくれと要望あり）Motionにだけ飛ばすように変更 20100701miya
	{
		this.getOut().infoOut("エラーメール送信");
		this.O_mail = new MtMailUtil();
		var A_send = Array();
		{
			let _tmp_0 = this.H_mail;

			for (var mail in _tmp_0) {
				var H_value = _tmp_0[mail];

				if ("" != H_value.message && false == (-1 !== A_send.indexOf(H_value.message))) //$H_to[] = array("to" => $mail, "to_name" => $H_value["to_name"]);
					//手動入力による送信先切り替え追加20101129morihara
					//メール送信しないフラグ追加20101129morihara
					//送信済みリストに入れる
					{
						var H_to:any = Array();

						if (undefined !== H_value.is_hand && H_value.is_hand) {
							H_to = {
								to: mail,
								to_name: H_value.to_name
							};
						} else H_to.push({
							to: "batch_error@kcs-next-dev.com",
							to_name: "株式会社モーション"
						});

						var message = H_value.message;
  						var O_conf  : any;
						var subject = "請求ダウンロードエラーのお知らせ " + O_conf.get("FULL_DOMAIN");
						var from = this.O_set.get("mail_error_from");
						var from_name = this.O_set.get("mail_error_from_name");

						if (this.O_view.is_dump) {
							message = "テストモードにつきメール送信せず\n" + "from:" + from + "\n" + "from_name:" + from_name + "\n" + "subject:" + subject + "\n" + console.log(H_to, true) + message + "\n";
							this.infoOut(message);
						} else //メール送信
							{
								this.O_mail.multiSend(H_to, message, from, subject, from_name);
							}

						A_send.push(message);
					}
			}
		}
	}
};
