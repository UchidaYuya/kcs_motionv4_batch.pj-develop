//
//メール送信プログラム
//
//更新履歴：<br>
//2009/05/15 石崎公久 作成
//
//@package Mail
//@subpackage Process
//@filesource
//@uses ProcessBaseBatch
//@uses MtMailUtil
//@uses GroupModel
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2009/05/15
//
//
//
//error_reporting(E_ALL|E_STRICT);
//別ドメイン対応 20090819miya
//
//メール送信プログラム
//
//@package Mail
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2009/05/15
//
//

require("process/ProcessBase.php");

require("MtMailUtil.php");

require("model/GroupModel.php");

require("MtSetting.php");

//
//メール
//
//@var mixed
//@access protected
//
//
//
//O_group
//
//@var mixed
//@access protected
//
//
//
//O_conf
//
//別ドメイン対応 20090819miya
//
//@var mixed
//@access protected
//
//
//
//list_dir
//
//@var mixed
//@access protected
//
//
//
//finish_dir
//
//@var mixed
//@access protected
//
//
//
//処理済みファイル数
//
//@var mixed
//@access protected
//
//
//
//lockファイル
//
//@var mixed
//@access protected
//
//
//
//コンストラクター
//
//必要オブジェクトをメンバーに確保
//
//@author ishizaki
//@since 2008/08/05
//
//@param array $H_param
//@access public
//@return void
//
//
//
//プロセス処理の実質的なメイン
//
//1.固有ログディレクトリの取得<br>
//2.スクリプトロック<br>
//3.管理者デフォルトに設定されている企業の一覧を取得<br>
//4.その一覧の企業の有効となっている価格表IDを取得<br>
//5.メール送信フラグがあったらその企業内の価格表メールの受け取りユーザ情報を取得
//
//@author ishizaki
//@since 2008/03/05
//
//@param array $H_param
//@access protected
//@return void
//
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/03/14
//
//@access public
//@return void
//
//
class SendMailMotionProc extends ProcessBase {
	constructor(site = "", H_param: {} | any[] = Array()) //メールオブジェクト
	//メールファイルディレクトリ
	//終わったメールのディレクトリ
	//グループオブジェクト
	//セッティングオブジェクト 別ドメイン対応 20090819miya
	{
		super(MtOutput.SITE_WEB, H_param);
		this.O_mail = new MtMailUtil();
		this.list_dir = KCS_DIR + "/web_script/SendList/";
		this.finish_dir = KCS_DIR + "/web_script/SendFinish/";
		this.O_group = new GroupModel();
		this.O_conf = MtSetting.singleton();
		this.O_conf.loadConfig("group");
		this.file_cnt = 0;
		this.lockfile_path = KCS_DIR + "/web_script/.send.lock";

		if (file_exists(this.lockfile_path)) {
			echo("\u65E2\u306B\u8D77\u52D5\u4E2D\u3067\u3059\n");
			throw die();
		}

		touch(this.lockfile_path);
	}

	doExecute(H_param: {} | any[] = Array()) //ディレクトリ開く
	{
		var dp;

		if ((dp = opendir(this.list_dir)) == true) //ファイルを調べる
			{
				var sendfile;

				while ((sendfile = readdir(dp)) !== false) //送信リストがあったら読み込む
				{
					if (preg_match("/\\.lst$/", sendfile) == true) //ログの書き出し
						//変数クリアしてから読み込む
						//重要なお知らせ
						//1行目は件名
						//2行目以降は本文
						//グループIDごと、モーション、ホットライン、販売店ごとのログインページ切り替え
						//別ドメイン対応 20090819miya
						//グループは一回の動作で共通とは限らないので下記の対応は危険な気がするためコメント下記のforeach内で行うように変更 ishizaki 20101029
						//					if ("" != $A_mail_list[0]["groupid"]) {
						//	 					if ( true == $this->O_conf->existsKey("groupid" . $A_mail_list[0]["groupid"] . "_is_original_domain")  && true == $this->O_conf->{"groupid" . $A_mail_list[0]["groupid"] . "_is_original_domain"}) {
						//	 					    $original_domain = true;
						//	 					} else {
						//	 					    $original_domain = false;
						//	 					}
						//					}
						//送信後はファイルを移動する
						{
							echo(date("Y:m:d H:i:s") + " " + this.list_dir + sendfile + " Include\n");
							delete ml_list;
							delete title;
							delete from;
							delete from_name;
							delete status;
							delete body;
							delete file_name;

							require(this.list_dir + sendfile);

							var A_mail_list = unserialize(ml_list);

							if (status == 1) {
								var A_msg_template = file(KCS_DIR + "/conf_sync/mail_template/important_info.txt");
							} else if (status == 2) {
								A_msg_template = file(KCS_DIR + "/conf_sync/mail_template/price_info.txt");
							} else if (status == 3) {
								A_msg_template = file(KCS_DIR + "/conf_sync/mail_template/system_info.txt");
							} else if (status == 4) {
								A_msg_template = file(KCS_DIR + "/conf_sync/mail_template/certificate_warning.txt");
							} else {
								A_msg_template = file(KCS_DIR + "/conf_sync/mail_template/normal_info.txt");
							}

							var subject = rtrim(A_msg_template.shift()) + " " + title;
							var message = A_msg_template.join("");
							var tmp_count = A_mail_list.length;
							var H_mail_list = Array();

							for (var now = 0; now < tmp_count; now++) {
								if ("" == A_mail_list[now].groupname) {
									A_mail_list[now].groupname = "kcs";
								}

								if ("" == A_mail_list[now].type) {
									A_mail_list[now].type = "M";
								}

								if (false == (undefined !== H_mail_list[A_mail_list[now].groupname][A_mail_list[now].type][A_mail_list[now].pactid]) || false == Array.isArray(H_mail_list[A_mail_list[now].groupname][A_mail_list[now].type][A_mail_list[now].pactid])) //個別ログイン対応 会社ごとじゃないとURLの置換ができないのでpactidを追加 20101104iga
									//$H_mail_list[$A_mail_list[$now]["groupname"]][$A_mail_list[$now]["type"]] = array();
									{
										H_mail_list[A_mail_list[now].groupname][A_mail_list[now].type][A_mail_list[now].pactid] = Array();
									}

								var temp = Array();
								temp.to = A_mail_list[now].to;
								temp.to_name = A_mail_list[now].to_name;
								temp.groupid = A_mail_list[now].groupid;

								if (undefined !== A_mail_list[now].userid_ini) {
									temp.userid_ini = A_mail_list[now].userid_ini;
								}

								H_mail_list[A_mail_list[now].groupname][A_mail_list[now].type][A_mail_list[now].pactid].push(temp);
							}

							for (var groupname in H_mail_list) //foreach($H_pacttype as $pacttype => $H_maildata){
							{
								var H_pacttype = H_mail_list[groupname];

								for (var pacttype in H_pacttype) //個別ログイン対応 H_mail_listの次元にpactidが増えたのでforeachも1ループ追加 20101104iga
								{
									var H_pactid = H_pacttype[pacttype];

									for (var key in H_pactid) //オリジナルドメインの処理をここに修正移動
									//取りあえずホスト名を置換
									//別ドメイン対応で条件追加 20091020miya
									//existKeyの条件間違えてたので修正 20091106miya
									//if (true == $original_domain && true == $this->O_conf->existsKey("groupid" . $A_mail_list[0]["groupid"] . "_hostname")) {
									//groupid をそのメールごとに取得しないと何のために$H_maildataにグループIDが入っているのか不明になってしまうので変更 ishizaki 20101029
									//オリジナルドメインの処理をここに修正移動 使用後に取得でいいの？上に移動しておく 20101104iga
									//fromとfrom_nameも別ドメイン対応 20091030miya
									//本文SERVICE置換
									//$message_tmp = str_replace("{SERVICE}", $this->O_group->getGroupSystemname($H_maildata[0]["groupid"]), $message_tmp);
									//ishizaki修正
									//本文メッセージ置換 20100618miya
									//タイトルを置換
									//メール送信
									{
										var H_maildata = H_pactid[key];

										if ("" != H_maildata[0].groupid) {
											if (true == this.O_conf.existsKey("groupid" + H_maildata[0].groupid + "_is_original_domain") && true == this.O_conf["groupid" + H_maildata[0].groupid + "_is_original_domain"]) {
												var original_domain = true;
											} else {
												original_domain = false;
											}
										} else {
											original_domain = false;
										}

										if (true == original_domain && true == this.O_conf.existsKey("groupid" + H_maildata[0].groupid + "_hostname")) {
											var message_tmp = str_replace("{HOSTNAME}", this.O_conf["groupid" + H_maildata[0].groupid + "_hostname"], message);
										} else {
											message_tmp = str_replace("{HOSTNAME}", FULL_DOMAIN, message);
										}

										if (true == original_domain && true == this.O_conf.existsKey("mail_def_from_" + H_maildata[0].groupid)) {
											var from = this.O_conf["mail_def_from_" + H_maildata[0].groupid];
										}

										if (true == original_domain && true == this.O_conf.existsKey("mail_def_from_name_" + H_maildata[0].groupid)) {
											var from_name = this.O_conf["mail_def_from_name_" + H_maildata[0].groupid];
										}

										if (groupname != "kcs" && false == original_domain) //$message_tmp = str_replace("{groupname}", $groupname."/{groupname}", $message_tmp); // この置換、ひどい 20101104iga
											//userid_iniがある場合はここで置換しない 20101104iga
											{
												if (!(undefined !== H_maildata[0].userid_ini)) {
													message_tmp = str_replace("{groupname}", groupname + "/", message_tmp);
												}
											}

										if ("H" == pacttype) //kcsグループのホットライン
											//別ドメイン対応で条件追加 20090819miya
											{
												if ("kcs" == groupname || true == original_domain) {
													message_tmp = str_replace("{groupname}", "Hotline", message_tmp);
												} else {
													message_tmp = str_replace("{groupname}", "hotline.php", message_tmp);
												}
											} else if ("S" == pacttype) {
											message_tmp = str_replace("{groupname}", "index_shop.php", message_tmp);
										} else {
											if (undefined !== H_maildata[0].userid_ini) //個別ログイン20101104iga
												{
													message_tmp = str_replace("{groupname}", groupname + "/" + H_maildata[0].userid_ini + "/", message_tmp);
												} else {
												message_tmp = str_replace("{groupname}", "", message_tmp);
											}
										}

										message_tmp = str_replace("{SERVICE}", this.O_group.getGroupSystemname(H_maildata[0].groupid), message_tmp);

										if (undefined !== mailtext) {
											message_tmp = str_replace("{mailtext}", mailtext, message_tmp);
										}

										if (undefined !== body) {
											var body_tmp = "\n" + body + "\n";

											if (undefined !== file_name) {
												body_tmp += "\n\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB\u6709(" + file_name + ")" + "\n";
											}

											message_tmp = str_replace("{BODY}", body_tmp, message_tmp);
										} else //本文がないので{BODY}を消す s182 20150223 date
											{
												message_tmp = str_replace("{BODY}", "", message_tmp);
											}

										if ("kcs" == groupname) {
											var subject_tmp = str_replace("{SERVICE}", "KCS Motion \u30B5\u30FC\u30D3\u30B9", subject);
										} else //$subject = str_replace("{SERVICE}", $ithis->O_group->getGroupSystemname($value["groupid"]), $subject);
											//$subject_tmp = str_replace("{SERVICE}", $this->O_group->getGroupTitle($H_maildata[0]["groupid"], $pacttype), $subject);
											{
												subject_tmp = str_replace("{SERVICE}", this.O_group.getGroupTitle(H_maildata[0].groupid, pacttype), subject);
											}

										this.O_mail.multiSend(H_maildata, message_tmp, from, subject_tmp, from_name);
									}
								}
							}

							rename(this.list_dir + sendfile, this.finish_dir + sendfile);
							echo(date("Y:m:d H:i:s") + " " + this.list_dir + sendfile + " Send OK\n");
							this.file_cnt++;
						}
				}
			}

		if (this.file_cnt > 0) {
			echo(date("Y:m:d H:i:s") + " " + "Send Total " + this.file_cnt + "files\n");
			echo(date("Y:m:d H:i:s") + " " + "Mail Send: End\n");
		} else {
			echo(date("Y:m:d H:i:s") + " " + "No files\n");
			echo(date("Y:m:d H:i:s") + " " + "Mail Send: End\n");
		}

		unlink(this.lockfile_path);
		throw die(0);
	}

	__destruct() {
		super.__destruct();
	}

};