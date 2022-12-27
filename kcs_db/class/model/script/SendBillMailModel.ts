
import MtMailUtil from "../../MtMailUtil";
import ModelBase from "../ModelBase";


export class SendBillMailModel extends ModelBase {
	O_mail: MtMailUtil;
	constructor() //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_mail = new MtMailUtil();
		this.O_mail.setUseReturnPathFlag(false);
	}

	getMailHistory() //メール送信対象は以下のもの
	{
		const sql = "select" + " hist.id" + ",hist.username" + ",hist.mail" + ",hist.subject" + ",hist.comment" + ",hist.group_flag" + ",hist.type" + ",hist.mail_target" + ",hist.executive_cc_flag" + " from bill_mail_history_tb as hist" + " join bill_mail_to_tb mto on mto.status = 0 and mto.hid = hist.id" + " where" + " ( coalesce(mto.mail,'') != '') or (((mto.employee_class=1 and hist.executive_cc_flag = true) or (hist.type=3 and hist.mail_target=1)) and ( coalesce(mto.executive_mail,'') != ''))" + "limit 1";
		return this.get_DB().queryRowHash(sql);
	}

	getMailTo(id: number) //指定されたbill_mail_history_tb.idで
	{
		const sql = "select" + " mto.username" + ",mto.mail" + ",mto.carid" + ",mto.telno" + ",mto.telno_view" + ",mto.orderid" + ",mto.postname" + ",mto.employee_class" + ",mto.executive_mail" + ",mto.executive_name" + " from bill_mail_to_tb as mto" + " join bill_mail_history_tb hist on hist.id = mto.hid" + " where" + " mto.hid=" + this.get_DB().dbQuote(id, "integer", true) + " and mto.status = 0" + " and (( coalesce(mto.mail,'') != '') or (((mto.employee_class=1 and hist.executive_cc_flag = true) or (hist.type=3 and hist.mail_target=1)) and ( coalesce(mto.executive_mail,'') != '')))" + " order by" + " mto.executive_mail";
		return this.get_DB().queryHash(sql);
	}

	saveSendMail(type: number, id: number, carid: number, telno: number, mail: string, executive_mail: string, orderid: number, group_flag: number) //type=1:電話管理
	{
		let sql = "update bill_mail_to_tb set status = 1 where " + " hid=" + this.get_DB().dbQuote(id, "integer", true) + " and mail=" + this.get_DB().dbQuote(mail, "text", true) + " and status=0";

		if (group_flag) //グループフラグが有効
			{
				if (!!executive_mail) //幹部社員CCメールが一致するユーザーを対象にする
					{
						sql += " and " + "(" + "coalesce(executive_mail,'') = ''" + " or executive_mail=" + this.get_DB().dbQuote(executive_mail, "text", true) + ")";
					}
			} else //グループフラグが無効であれば、電話番号ごとにメールをする
			{
				switch (type) {
					case 1:
					case 2:
						sql += " and carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true);
						break;

					case 3:
						sql += " and orderid=" + this.get_DB().dbQuote(orderid, "integer", true);
						break;
				}
			}

		const res = this.get_DB().query(sql);

		if (!res) {
			return false;
		}

		return true;
	}

	SendMail(comment: string, from_mail: string, subject: string, from_username: string, executive_cc_flag: boolean, to_data: any) //-------------------------------------------------------------
	//送信先の設定
	{
		var _subject = subject.replace("<DEPT>", to_data.postname);

		_subject = _subject.replace("<USER>", to_data.username);
		_subject = _subject.replace("<TEL>", to_data.telno_view);

		var _comment = comment.replace("<DEPT>", to_data.postname);

		_comment = _comment.replace("<USER>", to_data.username);
		_comment = _comment.replace("<TEL>", to_data.telno_view);
		_comment = _comment.replace("\r\n", "\n");
		_comment = _comment.replace("\r", "\n");
		var A_to = Array();

		if (!!to_data.mail) //送信先の設定(To)
			{
				A_to.push({
					type: "To",
					mail: to_data.mail,
					name: to_data.username
				});
			}

		if (executive_cc_flag === true && !!to_data.executive_mail) //送信先のタイプの指定。
			{
				var type = !A_to ? "To" : "Cc";
				A_to.push({
					type: type,
					mail: to_data.executive_mail,
					name: to_data.executive_name
				});
			}

		if (!!A_to) {
			this.O_mail.multiSend2(A_to, _comment, from_mail, _subject, from_username);
		}
	}

	async updateMail() //有効なメール送信のやつを取得
	{
		const history = await this.getMailHistory();

		if (!(undefined !== history)) //送信対象はないです
			{
				return false;
			}

		const to = await this.getMailTo(history.id);
		const mail_check = Array();

		for (var value of to) //CCフラグがtrue、もしくは注文履歴の申請者にメールの場合は幹部社員にメールをする。
		{
			let executive_cc_flag:boolean;
			if (history.executive_cc_flag === true || history.type === 3 && history.mail_target === 1) {
				executive_cc_flag = true;
			} else {
				executive_cc_flag = false;
			}

			if (history.group_flag) //----------------------------------------------------------
				{
					var to_mail = "";
					var cc_mail = undefined;

					if (history.executive_cc_flag === true || history.type === 3 && history.mail_target === 1) //幹部社員にCCする
						//幹部社員にCCする
						{
							if (!!value.mail) //メールアドレスがあるなら、それを使う
								{
									to_mail = value.mail;
								} else //所有者、注文申請者のメールアドレスがない場合
								{
									if (history.type === 3 && history.mail_target === 1) //注文の申請者にメールする時に
										//メールアドレスがないなら、電話番号を使う
										{
											to_mail = value.orderid;
										} else //電話管理、電話請求の時は電話番号で送信管理する(送信したらmail_checkに積んでいく)
										//メールアドレスがないなら、電話番号を使う
										{
											to_mail = value.telno;
										}
								}

							cc_mail = value.executive_mail;
						} else //幹部社員にCCしない
						{
							to_mail = value.mail;
						}

					if (undefined !== mail_check[to_mail]) //指定のtoには送信済みだが、幹部社員が違う場合はCCして送信する
						{
							if (!cc_mail) //$to宛に送信済み、幹部社員CCなしなら送信しない
								{
									continue;
								} else if (cc_mail && !(-1 !== mail_check[to_mail].indexOf(cc_mail))) //幹部社員にCCしてメールする
								{
									mail_check[to_mail].push(cc_mail);
								} else //既に送信済みなので、送信しない
								{
									continue;
								}
						} else //CCメールを登録
						{
							mail_check[to_mail] = Array();

							if (cc_mail) //幹部社員CCメールが登録
								{
									mail_check[to_mail].push(cc_mail);
								}
						}
				}

			this.SendMail(history.comment, history.mail, history.subject, history.username, executive_cc_flag, value);
			this.get_DB().beginTransaction();
			const res = this.saveSendMail(history.type, history.id, value.carid, value.telno, value.mail, value.executive_mail, value.orderid, history.group_flag);

			if (!res) 
				{
					this.get_DB().rollback();
					this.infoOut("メール送信の記録に失敗(" + history.id + "," + value.telno + "," + value.carid + ")\n", 1);
					break;
				}

			this.get_DB().commit();
		}

		return true;
	}
};
