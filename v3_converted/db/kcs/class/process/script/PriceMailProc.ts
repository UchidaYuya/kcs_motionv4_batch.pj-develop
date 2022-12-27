//
//価格表お知らせメール
//
//更新履歴：<br>
//2008/08/20 石崎公久 作成
//
//@package Shop
//@subpackage Process
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
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/08/20
//
//
//error_reporting(E_ALL|E_STRICT);
//
//価格表お知らせメール
//
//@package Shop
//@subpackage Process
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/03/28
//

require("process/ProcessBaseBatch.php");

require("model/script/PriceMailModel.php");

require("view/script/PriceMailView.php");

require("MtScriptAmbient.php");

require("MtSetting.php");

require("MtMailUtil.php");

require("MtAuthority.php");

require("model/Price/UserPriceModel.php");

require("model/PricePatternModel.php");

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
//A_ppid
//
//@var mixed
//@access protected
//
//
//A_pricelistid
//
//@var mixed
//@access protected
//
//
//A_dis_pricelistid
//
//@var mixed
//@access protected
//
//
//max_ppid
//
//@var mixed
//@access protected
//
//
//Viewオブジェクト
//
//@var TweakCalcPointView
//@access protected
//
//
//Modelオブジェクト
//
//@var TweakCalcPointModel
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
//O_pattern
//
//@var mixed
//@access protected
//
//
//O_post
//
//@var mixed
//@access protected
//
//
//O_group
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
//@author ishizaki
//@since 2008/08/05
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
//管理者初期値の処理
//
//@author ishizaki
//@since 2008/12/11
//
//@param mixed $A_pactlist
//@access public
//@return void
//
//
//販売店初期値の処理
//
//@author ishizaki
//@since 2008/12/11
//
//@param mixed $A_pactlist
//@access public
//@return void
//
//
//メンバーのメール情報にあるユーザに価格表お知らせメールを送信する為のファイルの生成
//
//@author ishizaki
//@since 2008/12/12
//
//@access private
//@return void
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
class PriceMailProc extends ProcessBaseBatch {
	constructor(H_param: {} | any[] = Array()) //view作成
	//model作成
	//メールオブジェクト
	//セッティング
	//送信するメール情報
	//プライスパターンオブジェクト
	//ポストモデル
	//メールが送信された価格表
	//メールファイルディレクトリ
	//グループオブジェクト
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
		this.mail_dir = this.O_set.write_mail_dir;
		this.O_group = new GroupModel();
	}

	doExecute(H_param: {} | any[] = Array()) //固有ディレクトリの作成取得
	//スクリプトの二重起動防止ロック
	//メールファイルをKCS_DIR . web_script/SendList/以下に作成
	//終了
	{
		this.set_Dirs(this.O_view.get_ScriptName());
		this.lockProcess(this.O_view.get_ScriptName());
		this.getOut().infoOut("\u7BA1\u7406\u8005\u521D\u671F\u5024\u3092\u3082\u3064\u4F01\u696D\u306E\u4E00\u89A7\u3092\u53D6\u5F97", false);
		var A_pactlist = Array();
		A_pactlist = this.O_model.getPactlistOfPricetype("fnc_mt_price_admin", false);
		var count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //各顧客に現在有効な価格表がメール送信希望状態かをチェック
			{
				this.getOut().infoOut("\u5BFE\u8C61\u4EF6\u6570" + count_pactlist, false);
				this.checkPricelistTypeAdminDefault(A_pactlist);
			} else {
			this.getOut().infoOut("\u8A72\u5F53\u3059\u308B\u4F01\u696D\u7121\u3057", false);
		}

		this.getOut().infoOut("\u8CA9\u58F2\u5E97\u521D\u671F\u5024\u3092\u3082\u3064\u4F01\u696D\u306E\u4E00\u89A7\u3092\u53D6\u5F97", false);
		A_pactlist = Array();
		A_pactlist = this.O_model.getPactlistOfPricetype("fnc_mt_price_shop", false);
		count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //販売店初期値の価格表をつかう
			{
				this.getOut().infoOut("\u5BFE\u8C61\u4EF6\u6570" + count_pactlist, false);
				this.checkPricelistTypeShop(A_pactlist, "fnc_mt_price_shop");
			} else {
			this.getOut().infoOut("\u8A72\u5F53\u3059\u308B\u4F01\u696D\u7121\u3057", false);
		}

		this.getOut().infoOut("\u9867\u5BA2\u521D\u671F\u5024\u3092\u3082\u3064\u4F01\u696D\u306E\u4E00\u89A7\u3092\u53D6\u5F97", false);
		A_pactlist = Array();
		A_pactlist = this.O_model.getPactlistOfPricetype("fnc_mt_price_pact", false);
		count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //顧客初期値
			{
				this.getOut().infoOut("\u5BFE\u8C61\u4EF6\u6570" + count_pactlist, false);
				this.checkPricelistTypeShop(A_pactlist, "fnc_mt_price_pact");
			} else {
			this.getOut().infoOut("\u8A72\u5F53\u3059\u308B\u4F01\u696D\u7121\u3057", false);
		}

		this.getOut().infoOut("\u90E8\u7F72\u521D\u671F\u5024\u3092\u3082\u3064\u4F01\u696D\u306E\u4E00\u89A7\u3092\u53D6\u5F97", false);
		A_pactlist = Array();
		A_pactlist = this.O_model.getPactlistOfPricetype("fnc_mt_price_post", false);
		count_pactlist = A_pactlist.length;

		if (0 < count_pactlist) //部署初期値
			{
				this.getOut().infoOut("\u5BFE\u8C61\u4EF6\u6570" + count_pactlist, false);
				this.checkPricelistTypeShop(A_pactlist, "fnc_mt_price_post");
			} else {
			this.getOut().infoOut("\u8A72\u5F53\u3059\u308B\u4F01\u696D\u7121\u3057", false);
		}

		if (0 < this.H_mail.length) {
			this.mailSendFlow();
		} else {
			this.getOut().infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u5BFE\u8C61\u30E6\u30FC\u30B6\u304C\u3044\u307E\u305B\u3093\u3002", false);
		}

		if (0 < this.A_pricelistid.length) //公開中かつ、メール送信フラグがたっている。
			//しかし、メール送信さきの顧客がない価格表のIDを取得
			//未処理価格表がある。
			{
				this.A_dis_pricelistid = this.O_model.checkDisPricelist(this.A_pricelistid);

				if (false == is_null(this.A_dis_pricelistid)) //これと言って何もしない。
					{}

				this.O_model.updateMailStatus(this.A_pricelistid, 2);
			}

		this.unLockProcess(this.O_view.get_ScriptName());
		this.set_ScriptEnd();
		throw die(0);
	}

	checkPricelistTypeAdminDefault(A_pactlist) {
		var max = A_pactlist.length;

		for (var cnt = 0; cnt < max; cnt++) //全ppid をループ
		{
			var O_price = new UserPriceModel(A_pactlist[cnt].pactid);
			this.getOut().infoOut("pactid = " + A_pactlist[cnt].pactid, false);
			{
				let _tmp_0 = this.O_pattern.H_ppid;

				for (var ppid in _tmp_0) //特定のパターンの価格表が存在しない場合
				{
					var value = _tmp_0[ppid];
					var pricelistid = O_price.getPricelistID(ppid, 0, A_pactlist[cnt].groupid, "fnc_mt_price_admin", A_pactlist[cnt].pactid);

					if (false === is_null(pricelistid)) //1以外はメール送信しない
						{
							var mailstatus = O_price.returnMailStatus(pricelistid);

							if (1 === mailstatus) //その企業に属する価格表メールを受け取るユーザの情報を取得
								//処理済みリストに価格表IDを追加
								{
									this.getOut().infoOut("\u30E1\u30FC\u30EB\u60C5\u5831\u3092\u53D6\u5F97", false);
									this.O_model.getUserlistInThisPact(A_pactlist[cnt].pactid, this.H_mail);
									this.A_pricelistid.push(pricelistid);
								}
						}
				}
			}
		}
	}

	checkPricelistTypeShop(A_pactlist, type) {
		var max = A_pactlist.length;

		for (var cnt = 0; cnt < max; cnt++) {
			var O_price = new UserPriceModel(A_pactlist[cnt].pactid);
			this.getOut().infoOut("pactid = " + A_pactlist[cnt].pactid, false);
			var A_postlist = this.O_post.getChildList(A_pactlist[cnt].pactid, this.O_post.getRootPostid(A_pactlist[cnt].pactid));
			var count_post = A_postlist.length;

			for (var i = 0; i < count_post; i++) {
				this.getOut().infoOut("\tpostid = " + A_postlist[i], false);
				O_price.setPostID(A_postlist[i]);
				{
					let _tmp_1 = this.O_pattern.H_ppid;

					for (var ppid in _tmp_1) {
						var value = _tmp_1[ppid];
						var H_shopid = O_price.getCarrierShop(value.carid);

						if (false == is_null(H_shopid)) //特定のパターンの価格表が存在しない場合
							{
								var pricelistid = O_price.getPricelistID(ppid, H_shopid.shopid, A_pactlist[cnt].groupid, type, A_pactlist[cnt].pactid);

								if (false === is_null(pricelistid)) //1以外はメール送信しない
									{
										var mailstatus = O_price.returnMailStatus(pricelistid);

										if (1 === mailstatus) //その企業に属する価格表メールを受け取るユーザの情報を取得
											//処理済みリストに価格表IDを追加
											{
												this.getOut().infoOut("\u30E1\u30FC\u30EB\u60C5\u5831\u3092\u53D6\u5F97", false);
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
		this.getOut().infoOut("\u30E1\u30FC\u30EB\u9001\u4FE1\u30D5\u30ED\u30FC", false);
		var pacts = Array();
		{
			let _tmp_2 = this.H_mail;

			for (var userid in _tmp_2) //送信用元データファイルを生成
			{
				var value = _tmp_2[userid];
				var H_temp = Array();
				H_temp.to = value.mail;
				H_temp.to_name = value.username;
				H_temp.groupid = value.groupid;
				H_temp.groupname = this.O_group.getGroupName(value.groupid);
				H_temp.pactid = value.pactid;
				var auth = MtAuthority.singleton(value.pactid);

				if (!(-1 !== pacts.indexOf(value.pactid)) && auth.chkPactFuncIni("fnc_pact_login")) {
					pacts.push(value.pactid);
				}

				if (-1 !== pacts.indexOf(value.pactid)) {
					H_temp.userid_ini = value.userid_ini;
				}

				H_temp.type = value.type;
				var mail_file = this.mail_dir + value.userid + "_" + date("Ymdhis") + ".lst";
				this.getOut().infoOut(mail_file + "\u306E\u4F5C\u6210", false);
				var fp = fopen(mail_file, "x");
				var lock = flock(fp, LOCK_EX);
				fputs(fp, "<?php\n");
				fputs(fp, "$ml_list = '" + serialize([H_temp]) + "';\n");
				fputs(fp, "$title = '\u4FA1\u683C\u8868\u66F4\u65B0\u306E\u304A\u77E5\u3089\u305B Notice of price list update';\n");

				if (value.groupid <= 1) {
					fputs(fp, "$from = '" + this.O_set.mail_def_from + "';\n");
					fputs(fp, "$from_name = '" + this.O_set.mail_def_from_name + "';\n");
				} else {
					fputs(fp, "$from_name = '" + this.O_group.getGroupSystemname(value.groupid) + " \u904B\u55B6\u4FC2';\n");
					fputs(fp, "$from = '" + this.O_group._getAdminMailaddressForGroup(value.groupid) + "';\n");
				}

				fputs(fp, "$status = 2;\n");
				fputs(fp, "?>\n");
				fclose(fp);
			}
		}
	}

	__destruct() {
		super.__destruct();
	}

};