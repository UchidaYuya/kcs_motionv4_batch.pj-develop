//
//
//
//更新履歴：<br>
//2016/03/09 date 作成
//
//
//
//@package SUO
//@subpackage Model
//@author date<date@motion.co.jp>
//@filesource
//@since 2015/06/25
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);

require("model/ModelBase.php");

//
//__construct
//
//@author miyazawa
//@since 2010/02/03
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//public function __construct(MtScriptAmbient $O_MtScriptAmbient){
//
//getMailHistory
//メール送信が残っているbill_mail_hisotry_tbを取得する
//@author web
//@since 2016/11/08
//
//@access private
//@return void
//
//
//getMailTo
//
//@author web
//@since 2016/11/24
//
//@param mixed $id
//@access private
//@return void
//
//
//saveSendMail
//メール送信したことを記録する
//@author web
//@since 2016/11/10
//
//@param mixed $id
//@param mixed $carid
//@param mixed $telno
//@param mixed $mail
//@param mixed $group_flag
//@access private
//@return void
//
//
//sendMail
//メール送信
//@author web
//@since 2016/11/24
//
//@param mixed $to_mail
//@param mixed $comment
//@param mixed $from_mail
//@param mixed $subject
//@param mixed $from_username
//@param mixed $to_username
//@access public
//@return void
//
//
//update
//update
//@author web
//@since 2016/11/04
//
//@access public
//@return void
//
//
//__destruct
//デストラクタ
//@author web
//@since 2016/11/04
//
//@access public
//@return void
//
class SendBillMailModel extends ModelBase {
	constructor() //親のコンストラクタを必ず呼ぶ
	//$this->O_msa = $O_MtScriptAmbient;
	//returnpathつけない
	{
		super();
		this.O_mail = new MtMailUtil();
		this.O_mail.setUseReturnPathFlag(false);
	}

	getMailHistory() //メール送信対象は以下のもの
	//メールが未送信(mto.status=0)かつ
	//((社員区分が幹部社員 and 幹部社員にCCする)もしくは(注文履歴で申請者にメール)) の時に幹部社員のメールアドレスが空ではない
	{
		var sql = "select" + " hist.id" + ",hist.username" + ",hist.mail" + ",hist.subject" + ",hist.comment" + ",hist.group_flag" + ",hist.type" + ",hist.mail_target" + ",hist.executive_cc_flag" + " from bill_mail_history_tb as hist" + " join bill_mail_to_tb mto on mto.status = 0 and mto.hid = hist.id" + " where" + " ( coalesce(mto.mail,'') != '') or (((mto.employee_class=1 and hist.executive_cc_flag = true) or (hist.type=3 and hist.mail_target=1)) and ( coalesce(mto.executive_mail,'') != ''))" + "limit 1";
		return this.get_DB().queryRowHash(sql);
	}

	getMailTo(id) //指定されたbill_mail_history_tb.idで
	//mto.statusが0のもの(未送信)
	//executive_mailに値が入っている物を優先する(先に処理しないとグループ化処理がうまくいかないので・・)
	{
		var sql = "select" + " mto.username" + ",mto.mail" + ",mto.carid" + ",mto.telno" + ",mto.telno_view" + ",mto.orderid" + ",mto.postname" + ",mto.employee_class" + ",mto.executive_mail" + ",mto.executive_name" + " from bill_mail_to_tb as mto" + " join bill_mail_history_tb hist on hist.id = mto.hid" + " where" + " mto.hid=" + this.get_DB().dbQuote(id, "integer", true) + " and mto.status = 0" + " and (( coalesce(mto.mail,'') != '') or (((mto.employee_class=1 and hist.executive_cc_flag = true) or (hist.type=3 and hist.mail_target=1)) and ( coalesce(mto.executive_mail,'') != '')))" + " order by" + " mto.executive_mail";
		return this.get_DB().queryHash(sql);
	}

	saveSendMail(type, id, carid, telno, mail, executive_mail, orderid, group_flag) //type=1:電話管理
	//type=2:請求管理
	//type=3:注文履歴
	//失敗したら元に戻す
	{
		var sql = "update bill_mail_to_tb set status = 1 where " + " hid=" + this.get_DB().dbQuote(id, "integer", true) + " and mail=" + this.get_DB().dbQuote(mail, "text", true) + " and status=0";

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

		var res = this.get_DB().query(sql);

		if (!res) {
			return false;
		}

		return true;
	}

	SendMail(comment, from_mail, subject, from_username, executive_cc_flag, to_data: {} | any[]) //-------------------------------------------------------------
	//各種置換文字の処理
	//件名
	//部署
	//使用者
	//電話番号
	//本文
	//部署
	//使用者
	//電話番号
	//-------------------------------------------------------------
	//送信先の設定
	{
		var _subject = mb_ereg_replace("<DEPT>", to_data.postname, subject);

		_subject = mb_ereg_replace("<USER>", to_data.username, _subject);
		_subject = mb_ereg_replace("<TEL>", to_data.telno_view, _subject);

		var _comment = mb_ereg_replace("<DEPT>", to_data.postname, comment);

		_comment = mb_ereg_replace("<USER>", to_data.username, _comment);
		_comment = mb_ereg_replace("<TEL>", to_data.telno_view, _comment);
		_comment = str_replace("\r\n", "\n", _comment);
		_comment = str_replace("\r", "\n", _comment);
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
			//「使用者、申請者、承認者」のメールアドレスが未登録の場合は、
			//幹部承認者をToとする
			//宛先の指定
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

	updateMail() //有効なメール送信のやつを取得
	//メール送る
	//成功ならtrue(debugとして、falseにすると1件ごとに送る)
	{
		var history = this.getMailHistory();

		if (!(undefined !== history)) //送信対象はないです
			{
				return false;
			}

		var to = this.getMailTo(history.id);
		var mail_check = Array();

		for (var value of Object.values(to)) //CCフラグがtrue、もしくは注文履歴の申請者にメールの場合は幹部社員にメールをする。
		//注文履歴申請の場合は、社員区分に関係なく、幹部社員にメールをする
		//-------------------------------------------------------------
		//グループ化フラグがtrueの場合、既に送ったメールアドレスには送らない
		//トランザクション開始
		//失敗したら元に戻す
		{
			if (history.executive_cc_flag === true || history.type === 3 && history.mail_target === 1) {
				var executive_cc_flag = true;
			} else {
				executive_cc_flag = false;
			}

			if (history.group_flag) //----------------------------------------------------------
				//幹部社員CCフラグのチェック。CCフラグが立っている、もしくは注文履歴の申請者へのメールであればCCする
				//----------------------------------------------------------
				//該当のメールが既に送られているかチェックを行う
				{
					var to_mail = undefined;
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
								} else if (!is_null(cc_mail) && !(-1 !== mail_check[to_mail].indexOf(cc_mail))) //幹部社員にCCしてメールする
								{
									mail_check[to_mail].push(cc_mail);
								} else //既に送信済みなので、送信しない
								{
									continue;
								}
						} else //CCメールを登録
						{
							mail_check[to_mail] = Array();

							if (!is_null(cc_mail)) //幹部社員CCメールが登録
								{
									mail_check[to_mail].push(cc_mail);
								}
						}
				}

			this.SendMail(history.comment, history.mail, history.subject, history.username, executive_cc_flag, value);
			this.get_DB().beginTransaction();
			var res = this.saveSendMail(history.type, history.id, value.carid, value.telno, value.mail, value.executive_mail, value.orderid, history.group_flag);

			if (!res) //$this->errorOut(1000, "\nメール送信の記録に失敗しました\n",0,"","");
				{
					this.get_DB().rollback();
					this.infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u306E\u8A18\u9332\u306B\u5931\u6557(" + history.id + "," + value.telno + "," + value.carid + ")\n", 1);
					break;
				}

			this.get_DB().commit();
		}

		return true;
	}

	__destruct() //親のデストラクタを必ず呼ぶ
	{
		super.__destruct();
	}

};