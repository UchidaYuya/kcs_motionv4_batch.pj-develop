//
//請求DLエラーメール
//
//更新履歴：<br>
//2009/07/03 宮澤龍彦 作成
//
//@package script
//@subpackage Process
//
//@filesource
//@uses ProcessBaseBatch
//@uses PriceMailModel
//@uses PriceMailView
//@uses MtScriptAmbient
//@uses MtSetting
//@uses MtMailUtil
//@uses UserPriceModel
//@uses PricePatternModel
//@uses PostModel
//@uses GroupModel
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/07/03
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表お知らせメール
//
//@package Shop
//@subpackage Process
//@author miyazawa<miyazawa@motion.co.jp>
//@since 2009/07/03
//

require("process/ProcessBaseBatch.php");

require("model/script/DLErrorMailModel.php");

require("view/script/DLErrorMailView.php");

require("MtScriptAmbient.php");

require("MtSetting.php");

require("MtMailUtil.php");

require("model/PostModel.php");

require("model/GroupModel.php");

//
//mail_dir
//
//@var mixed
//@access private
//
//
//H_mail
//
//@var mixed
//@access protected
//
//
//H_change_status
//
//@var mixed
//@access protected
//
//
//Viewオブジェクト
//
//@var DLViewErrorMailView
//@access protected
//
//
//Modelオブジェクト
//
//@var DLErrorMailModel
//@access protected
//
//
//メール
//
//@var mixed
//@access protected
//
//
//O_Set
//
//@var mixed
//@access protected
//
//
//実行中のスクリプト固有のログディレクトリ
//
//@var string
//@access protected
//
//
//コンストラクター
//
//必要オブジェクトをメンバーに確保
//
//@author miyazawa
//@since 2009/07/03
//
//@param array $H_param
//@access public
//@return void
//
//
//プロセス処理の実質的なメイン
//
//1.固有ログディレクトリの取得<br>
//2.スクリプトロック<br>
//3.メール未送信のエラー一覧を取得<br>
//4.販売店ごとにエラーを分ける<br>
//5.DLエラーは販売店、取込エラーは管理者のリストに入れる（Hotlineかそうでないかは区別しない）
//
//@author miyazawa
//@since 2009/07/03
//
//@param array $H_param
//@access protected
//@return void
//
//
//エラーメールを送信する
//
//@author miyazawa
//@since 2009/07/03
//
//@access private
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2009/07/03
//
//@access public
//@return void
//
class DLErrorMailProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //view作成
	//model作成
	//メールオブジェクト
	//セッティング
	//送信するメール情報
	//ステータス変更用配列
	//メールファイルディレクトリ
	//本番$this->mail_dir = "/nfs/web/kcs/web_script/SendList/";
	//グループオブジェクト
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

	doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//スクリプトの二重起動防止ロック解除
	//終了
	{
		this.set_Dirs(this.O_view.get_ScriptName());
		this.lockProcess(this.O_view.get_ScriptName());
		this.getOut().infoOut("\u30E1\u30FC\u30EB\u672A\u9001\u4FE1\u306E\u30A8\u30E9\u30FC\u4E00\u89A7\u3092\u53D6\u5F97", false);
		var H_errorlist = Array();
		H_errorlist = this.O_model.getDLErrorList();
		var count_error = H_errorlist.length;

		if (0 < count_error) //販売店用の配列と管理者用の配列に分ける
			//送信用の配列（宛先ごとにまとめる
			//手動入力による送信先切り替え追加20101129morihara
			//手動入力による送信先切り替え追加20101129morihara
			//処理済みのメールのステータスを変更
			{
				this.getOut().infoOut("\u5BFE\u8C61\u4EF6\u6570" + count_error, false);
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
						} else if ("prtelno" == val.error_type || "login" == val.error_type && false === strpos(val.message, "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5236\u9650\u6642\u9593")) //ログインに失敗→販売店へ
						//手動入力による送信先切り替え追加20101129morihara
						{
							if (undefined !== H_hand_pact_carid[val.pactid] && -1 !== H_hand_pact_carid[val.pactid].indexOf(val.carid)) {
								if (!(undefined !== H_to_pact[val.pactid])) H_to_pact[val.pactid] = Array();
								H_to_pact[val.pactid].push(val);
								continue;
							}

							if (true == is_numeric(val.shopid)) {
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
								this.infoOut("\u7BA1\u7406\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u5B58\u5728\u3057\u306A\u3044/pactid:=" + pactid);

								for (var H_info of Object.values(A_info)) H_to_Admin.push(H_info);

								continue;
							}

						var A_addr = H_hand_pact_addr[pactid];

						for (var addr of Object.values(A_addr)) {
							if (!(undefined !== this.H_mail[addr])) {
								this.H_mail[addr] = {
									is_hand: true,
									to_name: "",
									message: ""
								};
							}

							for (var H_info of Object.values(A_info)) {
								this.H_mail[addr].message = this.H_mail[addr].message + (this.H_mail[addr].message.length ? "\n" : "") + H_info.carname + "\t" + H_info.message;
							}
						}

						for (var H_info of Object.values(A_info)) {
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
						var postid = this.O_model.getRelPostid(shval.pactid, shval.shopid, shval.carid, 0);

						if ("" == postid) //ルート部署で取得できなかったら第二階層
							//部署ID取得
							{
								postid = this.O_model.getRelPostid(shval.pactid, shval.shopid, shval.carid, 1);
							}

						if ("" == postid) //それでも取得できなかったら管理者へ
							{
								H_to_Admin.push(shval);
							} else {
							var to_mail = this.O_model.getDLErrorMemMail(shval.shopid);
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
					to_mail = this.O_set.mail_def_errorto;
					to_name = this.O_set.mail_error_to_name;

					for (var adval of Object.values(H_to_Admin)) //宛先は一つなのでメッセージをまとめる
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
					this.getOut().infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u5BFE\u8C61\u30E6\u30FC\u30B6\u304C\u3044\u307E\u305B\u3093\u3002", false);
				}

				this.O_model.updateErrorStatus(this.H_change_status);
			} else {
			this.getOut().infoOut("\u30A8\u30E9\u30FC\u4EF6\u65700", false);
		}

		this.unLockProcess(this.O_view.get_ScriptName());
		this.set_ScriptEnd();
		throw die(0);
	}

	errorMailSend() //管理者に飛ばしたが必要ないので（Agent環境移行の後猪口さんから管理者に飛ばさないでくれと要望あり）Motionにだけ飛ばすように変更 20100701miya
	{
		this.getOut().infoOut("\u30A8\u30E9\u30FC\u30E1\u30FC\u30EB\u9001\u4FE1", false);
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
						var H_to = Array();

						if (undefined !== H_value.is_hand && H_value.is_hand) {
							H_to = {
								to: mail,
								to_name: H_value.to_name
							};
						} else H_to.push({
							to: "batch_error@kcs-next-dev.com",
							to_name: "\u682A\u5F0F\u4F1A\u793E\u30E2\u30FC\u30B7\u30E7\u30F3"
						});

						var message = H_value.message;
						var subject = "\u8ACB\u6C42\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30A8\u30E9\u30FC\u306E\u304A\u77E5\u3089\u305B " + FULL_DOMAIN;
						var from = this.O_set.mail_error_from;
						var from_name = this.O_set.mail_error_from_name;

						if (this.O_view.is_dump) {
							message = "\u30C6\u30B9\u30C8\u30E2\u30FC\u30C9\u306B\u3064\u304D\u30E1\u30FC\u30EB\u9001\u4FE1\u305B\u305A\n" + "from:" + from + "\n" + "from_name:" + from_name + "\n" + "subject:" + subject + "\n" + print_r(H_to, true) + message + "\n";
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

	__destruct() {
		super.__destruct();
	}

};