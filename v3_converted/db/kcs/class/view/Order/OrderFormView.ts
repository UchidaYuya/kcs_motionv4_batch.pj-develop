//
//注文フォームViewの基底クラス
//
//更新履歴：<br>
//2008/05/19 宮澤龍彦 作成
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/19
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//require_once("view/ViewSmarty.php");
//20090402miya
//定数を使用する
//定数を使用する
//その他の内容の取得
//D054 池袋引越し終わったらコメント外そう
//
//注文フォームViewの基底クラス
//
//@package Order
//@subpackage View
//@author miyazawa
//@since 2008/05/19
//@uses MtSetting
//@uses MtSession
//

require("OrderViewBase.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("MtPostUtil.php");

require("view/QuickFormUtil.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("view/Rule/OrderRule.php");

require("model/UserModel.php");

require("model/BuySelectModel.php");

require("model/PostModel.php");

require("model/PrefectureModel.php");

require("model/Order/fjpModel.php");

require("model/Sessionning/OrderByCategory.php");

require("model/HolidayModel.php");

require("model/MiscModel.php");

require("ManagementRule.php");

//
//submitボタン名
//
//
//submitボタン名（確認画面用）
//
//
//submitボタン名（確認画面からの戻り用）
//
//
//submitボタン名（購入リストに入れる）
//
//
//セッションオブジェクト
//
//@var mixed
//@access protected
//
//
//ディレクトリ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//protected $H_Dir;
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//protected $H_Local;
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//protected $H_View;
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//protected $O_Set;
//
//買い物カゴに使う配列
//
//@var mixed
//@access protected
//
//
//雛型のマスクに使う配列
//
//@var mixed
//@access protected
//
//
//デフォルトでフリーズに使う配列
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return void
//
//
//パンくずリンク用配列を返す
//
//@author miyazawa
//@since 2008/05/13
//
//@access public
//@return array
//
//
//CSSを返す
//
//@author miyazawa
//@since 2008/03/07
//
//@access public
//@return string
//
//
//POSTをsessionにセットする<br>
//
//@author igarashi
//@since 2008/06/09
//
//@access public
//@return none
//
//
//getLocalSession
//
//@author web
//@since 2012/06/21
//
//@access public
//@return void
//
//
//ディレクトリセッションに注文パターンの文言を入れる
//
//@author miyazawa
//@since 2008/09/08
//
//@param mixed $H_orderpatern
//@access public
//@return void
//
//
//ディレクトリセッションにshopidを入れる
//
//@author miyazawa
//@since 2008/09/13
//
//@param mixed $H_orderpatern
//@access public
//@return void
//
//
//ディレクトリセッションにカゴの情報を入れる
//
//@author miyazawa
//@since 2008/08/18
//
//@param mixed $H_product
//@access public
//@return void
//
//
//ディレクトリセッションに付属品直接入力の情報を入れる
//
//@author miyazawa
//@since 2008/08/18
//
//@param mixed $H_product
//@access public
//@return void
//
//
//ディレクトリセッションに電話詳細情報を入れる
//
//@author miyazawa
//@since 2008/08/18
//
//@param mixed $H_product
//@access public
//@return void
//
//
//セッションにデフォルト雛型のIDを入れる
//
//@author miyazawa
//@since 2008/09/26
//
//@param mixed $H_product
//@access public
//@return void
//
//
//セッションに英語化のtrue/falseを入れる
//
//@author miyazawa
//@since 2009/03/04
//
//@param boolean $eng
//@access public
//@return void
//
//
//注文フォームのルール作成
//
//@author miyazawa
//@since 2008/04/03
//
//@param mixed $H_rules
//@param mixed $telcnt
//@param mixed $A_auth
//@access protected
//@return void
//
//
//QuickFormUtilオブジェクトができているか確認する<br>
//オブジェクトがなければ作成するが、引数にfalseが指定されているときは作成しない<br>
//オブジェクトは返り値ではないので注意($this->H_View["O_OrderFormUtil"]に格納）
//
//@author igarashi
//@since 2008/05/30
//
//@param $flg(default:false)
//
//@access protected
//@return boolean
//
//
//getOrderForm
//Formの取得。
//@author date
//@since 2017/11/20
//
//@param string $H_sess
//@param string $H_sess
//@param string $H_sess
//@access public
//@return void
//
//
//getOrderRule
//ルールの追加
//@author 伊達
//@since 2017/11/20
//
//@param mixed $type
//@param mixed $carid
//@param mixed $cirid
//@param mixed $telcount
//@access public
//@return void
//
//
//注文フォームを作成する<br>
//
//@author miyazawa
//@since 2008/05/20
//
//@param mixed $O_order
//@param array $H_items
//@param array $H_dir
//@param array $H_g_sess
//@param int $telcount
//@param array $A_telitemmask
//@param array $H_product
//@param array $H_view
//@param array $tempdef 雛型の変更時のデフォ値 20141201date
//@access public
//@return void
//
//
//フォーム表示項目作成<br>
//selectboxのQuickFormを作成する<br>
//makeorderformitemから分割したもの。<br>
//できればcaseの中もmethod化したい
//
//@author igarashi
//@since 2008/05/29
//
//@param object $O_form_model(form作成用class)
//@param object $O_telinfo_model(電話情報取得用class)
//@param array $H_dir(オーダー情報。carid,cirid,arid,pactid,発注種別,承認部署)
//@param array $H_items(DBから取得したQuickForm作成関数に必要な引数）
//
//@access protected
//@return void
//
//
//フォーム表示項目作成<br>
//checkboxのQuickFormを作成する<br>
//makeorderformitemから分割したもの<br>
//できればcase、carid毎にmethod化したい
//
//@author igarashi
//@since 2008/05/29
//
//@param object $O_form_model(form作成用class)
//@param object $O_telinfo_model(電話情報取得用class)
//@param array $H_dir(オーダー情報。carid,cirid,arid,pactid,発注種別,承認部署)
//@param array $H_items(DBから取得したQuickForm作成関数に必要な引数）
//
//@access protected
//@return void
//
//
//フォーム表示項目作成<br>
//checkboxのQuickFormを作成する<br>
//makeorderformitemから分割したもの。<br>
//できればcarid毎の処理をmethod化したい
//
//@author igarashi
//@since 2008/05/29
//
//@param object $O_form_model(form作成用class)
//@param object $O_telinfo_model(電話情報取得用class)
//@param array $H_dir(オーダー情報。carid,cirid,arid,pactid,発注種別,承認部署)
//@param array $H_items(DBから取得したQuickForm作成関数に必要な引数）
//
//@access protected
//@return void
//
//
//かご部分の商品別項目作成
//
//@author igarashi
//@since 2008/06/18
//
//@param object $O_model(OrderFormModel)
//@param int $H_sess(セッション情報)
//
//@access public
//@return boolean
//
//
//かご部分の計算ボタンと付属品別項目作成
//
//@author igarashi
//@since 2008/06/18
//
//@param array $H_sess
//@param array $H_order
//@access protected
//@return void
//
//
//かご部分の商品別項目に渡すQuickFormオプション
//
//@author igarashi
//@since 2008/06/18
//
//@param array $H_sess
//@access protected
//@return void
//
//
//フォーム表示項目のうち必要なものを電話詳細表示用に名前を変える
//
//@author miyazawa
//@since 2008/06/10
//
//@param array $H_items
//@param int $telcount
//@access protected
//@return mixed
//
//
//フォーム表示項目作成
//
//@author miyazawa
//@since 2008/05/20
//
//@param mixed $O_order
//@param array $H_items
//@param array $H_dir
//@param array $H_g_sess
//@param int $telcount
//@param array $H_product
//@access protected
//@return void
//
//
//マスクされた項目のルールを取り除く（作りかけ）
//
//@author miyazawa
//@since 2008/11/10
//
//@param mixed $H_rule
//@param mixed $H_mask
//
//@access public
//@return mixed
//
//
//承認者メール送付先選択のフォームを作成
//
//@author date
//@since 20141114
//
//@access public
//@return なし
//
//
//代行注文のコメントフォームを作成
//
//@author miyazawa
//@since 2008/11/11
//
//@access public
//@return mixed
//
//
//一括プラン変更フォーム要素作成
//
//@author miyazawa
//@since 2009/01/28
//
//@param mixed $H_sub // $H_order["sub"]
//@param mixed $H_area // 地域会社リスト
//@param mixed $A_nodisp // hiddenにする電話番号リスト
//@access public
//@return void
//
//
//購入方式をidから名称に修正<br>（buyselect_tbができたので不要になった）
//
//@author igarashi
//@since 2008/06/10
//
//@param int $carid
//@param int $selid(購入方式プルダウンのvalue)
//
//@access public
//@return mixed
//
//
//購入方式整形 （buyselect_tbができたので不要になった）
//
//@author miyazawa
//@since 2008/08/07
//
//@param int $cource
//@access public
//@return $string
//
//
//割賦回数のidを回数に修正する
//
//@author igarashi
//@since 2008/06/10
//
//@param int $loan(割賦回数プルダウンのvalue)
//@access public
//@return mixed
//
//
//freeze処理をする <br>
//
//ボタン名の変更 <br>
//エラーチェックを外す <br>
//freezeする <br>
//
//@author miyazawa
//@since 2008/03/11
//
//@access public
//@return void
//
//
//freezeさせない時の処理 <br>
//
//ボタン名の変更 <br>
//
//@author houshiyama
//@since 2008/03/12
//
//@access public
//@return void
//
//
//スタティック表示 <br>
//
//@author miyazawa
//@since 2008/06/16
//
//@param mixed $H_g_sess
//@param mixed $H_order（注文履歴と揃えるために追加）
//@param mixed $H_view（第二階層対応のために追加）
//@access public
//@return void
//
//
//注文フォームのデフォルト値作成
//
//@author miyazawa
//@since 2008/04/11
//
//@param mixed $H_g_sess
//@param mixed $H_sess
//@param mixed $O_form_model
//@param mixed $H_view
//@param mixed $H_product
//@access protected
//@return mixed
//
//
//登録部署をセッションにセット
//
//@author miyazawa
//@since 2008/06/12
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access public
//@return int
//
//
//発送先住所の配列を作る
//
//@author miyazawa
//@since 2008/06/12
//
//@param mixed $H_g_sess
//@param mixed $O_form_model
//@param mixed $H_view
//@access protected
//@return mixed
//
//
//部署のツリーをstringで取得
//
//@author miyazawa
//@since 2008/06/12
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@param mixed $H_view
//@param mixed $A_auth
//@access protected
//@return string
//
//
//会社名を取得してセット（第二階層対応）
//
//@author miyazawa
//@since 2008/09/22
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@param mixed $H_view
//@param mixed $A_auth
//@access protected
//@return string
//
//
//明日の日付の配列を作る
//
//@author miyazawa
//@since 2008/06/12
//
//@access protected
//@return mixed
//
//
//翌月1日の日付の配列を作る
//
//@author miyazawa
//@since 2009/10/19
//
//@access protected
//@return mixed
//
//
//電話詳細情報の電話番号表示部分作成
//
//@author miyazawa
//@since 2008/06/17
//
//@param mixed $H_telinfo
//@access public
//@return mixed
//
//
//電話詳細情報のMNPアラート表示部分作成
//
//@author miyazawa
//@since 2008/09/01
//
//@param mixed $H_telinfo
//@access public
//@return mixed
//
//
//電話の違約金表示部分作成
//
//@author miyazawa
//@since 2008/08/20
//
//@param mixed $H_telinfo
//@access public
//@return mixed
//
//
//雛型のvalueの整形
//
//@author miyazawa
//@since 2008/04/11
//
//@param mixed $H_value
//@param int $telcount
//@access protected
//@return mixed
//
//
//表示に使用する物を格納する配列を返す
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return mixed
//
//
//買い物かごにポイント入力欄を表示するか判定する
//
//@author igarashi
//@since 2008/08/28
//
//@param $H_sess
//
//@access protected
//@return boolean
//
//
//雛型に入っている色名を言語に合わせる<br>
//日本語の雛型を英語ユーザが使うことを想定（もしくはその逆）
//
//@author miyazawa
//@since 2009/05/08
//
//@access public
//@return mixed
//
//
//雛型に入っている購入方式名を言語に合わせる<br>
//日本語の雛型を英語ユーザが使うことを想定（もしくはその逆）
//
//@author miyazawa
//@since 2009/05/08
//
//@access public
//@return mixed
//
//
//雛型作成画面の商品リセットボタン <br>
//
//@author miyazawa
//@since 2009/01/16
//
//@access public
//@return void
//
//
//雛形選択をさせたい権限がついてる場合
//
//
//Smartyを用いた画面表示<br>
//
//QuickFormとSmartyを合体<br>
//各データをSmartyにassign<br>
//各ページ固有の表示処理<br>
//Smartyで画面表示<br>
//
//@author houshiyama
//@since 2008/02/20
//
//@param array $H_sesstion（CGIパラメータ）
//@param array $A_auth（権限一覧）
//@param array $H_Product（カゴの情報）
//@param array $H_message（画面表示するエラーメッセージ）
//@param array $H_g_sess（グローバル変数）
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author miyazawa
//@since 2008/06/27
//
//@access public
//@param int $orderid
//@param bool $orderid_disp（完了画面への受付番号表示フラグ）
//@param str $site_flg（販売店かどうか）
//@param str $frompage（シミュレーションから来たら戻り先が違う）
//@param int $groupid
//@return void
//
//
//getReceptionTimeLimit
//受付時間の期限を取得
//@author web
//@since 2019/03/05
//
//@access private
//@return void
//
//
//isIkebukuro
//池袋の民ですか
//@author web
//@since 2019/03/05
//
//@access private
//@return void
//
//
//dealingWithIkebururo
//池袋のドコモ切替開始時間を操作する
//@author 伊達
//@since 2019/03/29
//
//@param mixed $H_items
//@param mixed $groupid
//@access public
//@return void
//
//
//displayFinishWithSendMail
//注文完了時、メール送信フォーム画面表示
//@author hanashima
//@since 2020/03/18
//
//@param mixed $message
//@param mixed $backurl
//@param mixed $buttonstr
//@param mixed $outtxtafter
//@param mixed $language
//@param mixed $mailData
//@access public
//@return void
//
//
//デストラクタ
//
//@author miyazawa
//@since 2008/04/09
//
//@access public
//@return void
//
class OrderFormView extends OrderViewBase {
	static NEXTNAME = "\u78BA\u8A8D\u753B\u9762\u3078";
	static NEXTNAME_ENG = "To Confirmation Screen";
	static RECNAME = "\u6CE8\u6587\u3059\u308B";
	static RECNAME_ENG = "Order";
	static BACKNAME = "\u5165\u529B\u753B\u9762\u306B\u623B\u308B";
	static BACKNAME_ENG = "Back to Entry Screen";
	static LISTNAME = "\u8CFC\u5165\u30EA\u30B9\u30C8\u306B\u5165\u308C\u308B";
	static LISTNAME_ENG = "Add to purchase list";
	static FNC_FJP_CO = "fnc_fjp_co";

	constructor(H_param = Array()) //$this->O_Sess =& MtSession::singleton();
	//$this->H_Dir = $this->O_Sess->getPub( self::PUB );
	//$this->H_Local = $this->O_Sess->getSelfAll();
	//$this->O_Set = MtSetting::singleton();
	{
		super(H_param);
		this.A_ordinput = ["applyprice", "acce", "pointradio", "point", "submitName"];
		this.A_boxinput = ["productname", "purchase", "color", "pay_frequency", "boxopen"];
	}

	getHeaderJS() {}

	makePankuzuLinkHash() {
		var H_link = {
			"": this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname
		};
		return H_link;
	}

	getCSS(site_flg = "") {
		if (site_flg == OrderFormView.SITE_SHOP) {
			return "actorderDetail";
		} else {
			return "csOrder";
		}
	}

	checkCGIParam() //GETパラメータ
	//リセット
	//価格表を開く
	{
		if (_GET.r != "") //商品情報消す
			//リセットするときは雛型もクリア 20090508miya
			//同上 20090508miya
			{
				delete this.H_Dir.price_detailid;
				delete this.H_Dir.free_acce;
				delete this.H_Dir.tempid;
				delete this.H_Local.tempid;
				this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
				header("Location: " + _SERVER.PHP_SELF);
				throw die();
			}

		this.switchCarrier(_POST);

		if (undefined !== _POST.othercarid) {
			this.H_Local.othercarid = _POST.othercarid;
		}

		var H_sim = this.O_Sess.GetPub("/Recom/RecomOrder.php");

		if (true == (undefined !== H_sim) && true == Array.isArray(H_sim)) {
			this.H_Local.plan = H_sim.post.recplanid;
			this.H_Local.packet = H_sim.post.recpacketid;
			this.H_Local.planradio = H_sim.post.planradio;
			this.H_Local.packetradio = H_sim.post.packetradio;
		}

		var infcnt = 0;

		for (var key in _POST) //買い物カゴ
		{
			var val = _POST[key];

			if (true == (-1 !== this.A_boxinput.indexOf(key))) {
				infcnt++;
			}

			this.H_Local[key] = val;
		}

		if (undefined !== this.H_Local.accQuantPrivate && !(undefined !== this.H_Local.submitName)) {
			this.H_Local.submitName = this.H_Local.accQuantPrivate;
			delete this.H_Local.accQuantPrivate;
		}

		if (undefined != this.H_Local.tempid) //unset($this->H_Local["tempid"]);
			//price_detailidを消す
			//付属品直接入力を消す
			{
				this.H_Dir.tempid = this.H_Local.tempid;
				delete this.H_Dir.price_detailid;
				delete this.H_Dir.free_acce;
			}

		if (this.H_Dir.type == "A") //電話から来たとき
			{
				if (this.H_Local.acceradio == "fromtel" && String(this.H_Local.telno != "")) //シリーズ・機種から来たとき
					{
						this.H_Local.boxopen = true;
					} else if (this.H_Local.acceradio == "fromproduct" && String(this.H_Local.series != "" || String(this.H_Local.telproduct != ""))) {
					this.H_Local.boxopen = true;
				}

				if (true == (undefined !== this.H_Local.free_productname) && 0 < this.H_Local.free_productname.length || true == (undefined !== this.H_Local.free_count) && 0 < this.H_Local.free_count.length || true == (undefined !== this.H_Local.free_property) && 0 < this.H_Local.free_property.length) //確認画面に行ったときは自由記入欄のパラメータを無視
					{
						if (false == (undefined !== this.H_Local.submitName) || "" == this.H_Local.submitName) {
							var H_free_acce = {
								free_productname: this.H_Local.free_productname,
								free_count: this.H_Local.free_count,
								free_property: this.H_Local.free_property
							};
						}

						delete _POST.free_productname;
						delete _POST.free_count;
						delete _POST.free_property;
						delete this.H_Local.free_productname;
						delete this.H_Local.free_count;
						delete this.H_Local.free_property;
					}

				if (undefined != this.H_Dir.free_acce && true == Array.isArray(this.H_Dir.free_acce)) {
					for (var frcnt = 0; frcnt < this.H_Dir.free_acce.length; frcnt++) {
						if (true == (undefined !== this.H_Local["free_acce" + frcnt]) && true == is_integer(+this.H_Local["free_acce" + frcnt])) {
							this.H_Dir.free_acce[frcnt].free_count = this.H_Local["free_acce" + frcnt];
						}
					}
				}
			} else {
			if (true == (-1 !== ["N", "Nmnp", "C", "S"].indexOf(this.H_Dir.type))) //POSTで飛んでくるhandopenとboxopenの二つのフラグでカゴとカゴ以降の表示・非表示を切り替えている
				//初期はhandopen==0、boxopen==0（「価格表」「直接入力」のボタンが二つ表示されているだけの状態）
				{
					if (false == Array.isArray(this.H_Local) || 1 > this.H_Local.length) //手入力ならhandopen==1、boxopen==0。price_detailidを消す
						{
							if (true == (undefined !== this.H_Dir.price_detailid)) //価格表から戻ってきたら購入方式と割賦回数をデフォルトセット
								{
									this.H_Local.handopen = 0;
									this.H_Local.boxopen = 1;

									if (true == (undefined !== this.H_Dir.H_product.tel.buyselid)) {
										this.H_Local.purchase = this.H_Dir.H_product.tel.buyselid;
									}

									if (true == (undefined !== this.H_Dir.H_product.tel.paycnt)) {
										this.H_Local.pay_frequency = this.H_Dir.H_product.tel.paycnt;
									}
								} else {
								this.H_Local.handopen = 0;
								this.H_Local.boxopen = 0;
							}
						} else {
						if (+(this.H_Local.handopen == 1 && +(this.H_Local.boxopen == 0))) //unset($this->H_Local["color"]);
							//手入力フォームの「購入リストに入れる」を押したとき
							{
								delete this.H_Dir.price_detailid;
								delete this.H_Local.productid;
								delete this.H_Local.productname;
								this.H_Local.color = "\u9078\u629E\u306A\u3057";
								delete this.H_Local.buyselid;
								delete this.H_Local.buytype1;
								delete this.H_Local.buytype2;
								delete this.H_Local.downmoney;
								delete this.H_Local.onepay;
								delete this.H_Local.totalprice;
								delete this.H_Local.purchase;
								delete this.H_Local.pay_frequency;
							} else if (+(this.H_Local.handopen == 0 && +(this.H_Local.boxopen == 1))) //それ以外はhandopen==0、boxopen==1
							{
								delete this.H_Local.productid;
								delete this.H_Local.buyselid;
								delete this.H_Local.buytype1;
								delete this.H_Local.buytype2;
								delete this.H_Local.downmoney;
								delete this.H_Local.onepay;
								delete this.H_Local.totalprice;
							} else {
							this.H_Local.handopen = 0;
							this.H_Local.boxopen = 1;
						}
					}
				} else {
				this.H_Local.handopen = undefined;
				this.H_Local.boxopen = undefined;
			}
		}

		this.H_Dir.carid = +this.H_Dir.carid;
		this.H_Dir.cirid = +this.H_Dir.cirid;

		if (true == (undefined !== this.H_Local.applyprice)) {
			this.H_Local.applyprice = +this.H_Local.applyprice;
		}

		if (true == (undefined !== this.H_Local.point)) {
			this.H_Local.point = +this.H_Local.point;
		}

		if (true == (undefined !== H_free_acce)) {
			this.H_Dir.free_acce.push(H_free_acce);
		}

		this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
		this.O_Sess.SetSelfAll(this.H_Local);

		if (_POST.open == "list") //header("Location: order_price.php?open=list&type=" . $_POST["type"] . "&carid=" . $_POST["carid"] . "&cirid=" . $_POST["cirid"] . "&ppid=" . $_POST["ppid"]);
			//header("Location: order_price.php");
			{
				throw die();
			}
	}

	getLocalSession() {
		var sess = super.getLocalSession();

		if ("Nmnp" == sess[OrderFormView.PUB].type) {
			for (var i = 0; i < 10; i++) {
				if (undefined !== sess[OrderFormView.PUB].telinfo["telno" + i]) {
					sess[OrderFormView.PUB].telinfo["telno" + i].kousi = undefined;
				}
			}
		}

		return sess;
	}

	setPtnWord(H_orderpatern: {} | any[]) {
		this.H_Dir.carname = H_orderpatern.carname;
		this.H_Dir.ptnname = H_orderpatern.ptnname;
		this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
	}

	setShop(H_orderpatern: {} | any[]) {
		this.H_Dir.shopid = H_orderpatern.shopid;
		this.H_Dir.memid = H_orderpatern.memid;
		this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
	}

	setProductInfo(H_product: {} | any[]) {
		this.H_Dir.H_product = H_product;
		this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
	}

	setFreeAcce(H_free_acce: {} | any[]) {
		this.H_Dir.free_acce = H_free_acce;
		this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
	}

	setTelInfo(H_telinfo: {} | any[]) {
		this.H_Dir.telinfo = H_telinfo;
		this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
	}

	setDefaultTemplate(tempid) {
		this.H_Local.tempid = tempid;
		this.O_Sess.SetSelfAll(this.H_Local);
	}

	setEnglish(eng = false) {
		this.H_Dir.eng = eng;
		this.O_Sess.SetPub(OrderFormView.PUB, this.H_Dir);
	}

	makeOrderRule(H_rules, telcnt = 0, A_auth = Array(), ptuni = 0) //QuickFormオブジェクトが作成されているか確認
	//注文の独自ルールをregist
	//clientで表示させる
	//英語化 20090402miya
	//DBから取得したルール配列をフォームオブジェクトに入れる
	//公私分計権限
	{
		this.checkQuickFormObject();
		var A_order_rules = ["CheckboxCompare", "CheckboxCompareMulti", "CheckdateRule", "DateBefore", "RadioCompareExSixElement", "RadioCompareExMulti", "RadioCompareExReverse", "checkMultiple", "dateComp"];
		this.H_View.O_OrderFormUtil.registerOriginalRules(A_order_rules);

		if (true == this.H_Dir.eng) {
			this.H_View.O_OrderFormUtil.setDefaultWarningNoteEng();
		} else {
			this.H_View.O_OrderFormUtil.setDefaultWarningNote();
		}

		for (var i = 0; i < H_rules.length; i++) //rule_elementが配列だったらevalでPHPの関数として解釈させている
		{
			if (strpos(H_rules[i].name, "array") === 0) //公私分計だったら電話件数分ルール作成
				//公私分計だったら権限見て、なかったら除去
				//端末削除だったら権限見て、なかったら除去 20090318miya
				{
					if (strpos(H_rules[i].name, "kousi") > 0 && strpos(H_rules[i].name, "kousiradio") > 0) {
						if (-1 !== A_auth.indexOf("fnc_kousi") != true) {
							H_rules[i] = undefined;
							continue;
						} else {
							var H_rules_kousi = Array();

							for (var ki = 0; ki < telcnt; ki++) {
								var kousi_str = H_rules[i].name;
								kousi_str = str_replace("kousiradio", "temp_", kousi_str);
								kousi_str = str_replace("kousi", "kousi_" + ki, kousi_str);
								kousi_str = str_replace("temp_", "kousiradio_" + ki, kousi_str);
								var H_onerow = H_rules[i];
								H_onerow.name = eval("return " + kousi_str + ";");
								H_rules_kousi.push(H_onerow);
							}

							H_rules[i] = undefined;
							continue;
						}
					} else {
						H_rules[i].name = eval("return " + H_rules[i].name + ";");
					}
				} else if ("terminal_del" == H_rules[i].name) {
				if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_co") != true) {
					H_rules[i] = undefined;
					continue;
				}
			} else if ("simcardno" == H_rules[i].name) //simcardnoのルールについて
				{
					H_rules_kousi = Array();

					for (ki = 0;; ki < telcnt; ki++) {
						H_onerow = H_rules[i];
						H_onerow.name = "simcardno_" + ki;
						H_rules.push(H_onerow);
					}

					H_rules[i] = undefined;
				} else if ("passwd" == H_rules[i].name) //FOMAに移行する時、暗証番号必須フラグを外す
				{
					if (this.H_Dir.type == "S" && this.H_Dir.carid == 1 && this.H_Dir.cirid == 1 && H_rules[i].type == "required") {
						H_rules[i] = undefined;
						continue;
					}
				} else if ("point" == H_rules[i].name && "checkMultiple" == H_rules[i].type && this.H_Dir.carid == 1) {
				H_rules[i].format = ptuni;
				H_rules[i].mess = str_replace("100", ptuni, H_rules[i].mess);
			}

			if (strpos(H_rules[i].format, "array") === 0) {
				H_rules[i].format = eval("return " + H_rules[i].format + ";");
			}
		}

		if (-1 !== A_auth.indexOf("fnc_kousi") == true) //公私分計のルールがあったらここで追加
			{
				if (0 < H_rules_kousi.length) {
					H_rules = array_merge(H_rules, H_rules_kousi);
				}
			}

		var H_rules_tmp = Array();

		if (Array.isArray(H_rules)) {
			for (var key in H_rules) {
				var val = H_rules[key];

				if ("" != String(key && "" != val)) //キャストしないと$key==0が""に合致してはねられてしまう 20090403miya
					{
						H_rules_tmp.push(val);
					}
			}

			H_rules = H_rules_tmp;
			this.H_View.O_OrderFormUtil.makeFormRule(H_rules);
		}
	}

	checkQuickFormObject(flg = true) {
		if (true == ("object" === typeof this.H_View.O_OrderFormUtil)) {
			return true;
		}

		if (true == flg) {
			this.H_View.O_OrderFormUtil = new QuickFormUtil("form");
			return true;
		}

		return false;
	}

	getOrderForm(type, carid, cirid, telcount, A_Auth = Array()) //
	////	
	//		$res[] = array (
	//						"itemname" => "MNP予約番号有効日",
	//						"itemgrade" => 0,
	//						"inputtype" => "date",
	//						"inputname" => "mnp_enable_date",
	//						"inputdef" => "",
	//						"usertype" => "all",
	//						"property" => serialize(
	//										array(
	//											"minYear" => $year - 1, 
	//											"maxYear" => $year + 1, 
	//											"addEmptyOption" => true, 
	//											"format" => "Y 年 m 月 d 日",
	//											"language" => "ja",
	//											"emptyOptionValue" => "",
	//											"emptyOptionText" => "--" )
	//							));
	//解約、MNP、名義変更(法個)の場合、電話管理から消すかどうか設定できる
	{
		var temp = Array();

		if (type == "Nmnp") {
			if (-1 !== A_Auth.indexOf("fnc_mnp_date_show")) {
				var year = date("Y");
				temp.push({
					itemname: "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5",
					itemgrade: 0,
					inputtype: "date",
					inputname: "mnp_enable_date",
					inputdef: "",
					usertype: "all",
					property: serialize({
						minYear: year - 1,
						maxYear: year + 1,
						addEmptyOption: true,
						format: "Y \u5E74 m \u6708 d \u65E5",
						language: "ja",
						emptyOptionValue: "",
						emptyOptionText: "--"
					})
				});
			}
		}

		var res = Array();

		for (var i = 0; i < telcount; i++) {
			for (var value of Object.values(temp)) {
				value.inputname += "_" + i;
				res.push(value);
			}
		}

		res.push({
			itemname: "\u5165\u529B\u62C5\u5F53\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
			itemgrade: 0,
			inputtype: "text",
			inputname: "chargermail",
			inputdef: "",
			usertype: "all",
			property: serialize({
				size: 40,
				maxlength: 255
			})
		});
		temp = ["D", "Nmnp", "Tcp"];
		var is_select = false;

		if (-1 !== temp.indexOf(type)) //解約で残すかどうか選択する権限があるなら選択フォームを出す
			{
				if (type == "D" && -1 !== A_Auth.indexOf("fnc_order_not_delete_tel_select")) {
					is_select = true;
				}
			}

		if (is_select) //残すかどうか選択させる
			{
				res.push({
					itemname: "\u89E3\u7D04\u5F8C\u306E\u7AEF\u672B\u306E\u7BA1\u7406",
					itemtext: "\u96FB\u8A71\u7BA1\u7406\u306B\u6B8B\u3059",
					itemgrade: 0,
					inputtype: "checkbox",
					inputname: "is_not_delete_tel",
					inputdef: "",
					usertype: "all"
				});
			} else //hiddenとする
			{
				res.push({
					itemname: "",
					itemtext: "\u96FB\u8A71\u7BA1\u7406\u306B\u6B8B\u3059",
					itemgrade: 0,
					inputtype: "hidden",
					inputname: "is_not_delete_tel",
					inputdef: "",
					usertype: "all"
				});
			}

		return res;
	}

	getOrderRule(type, carid, cirid, telcount, A_auth, arg_pactid = undefined) //顧客入力者担当メール
	//顧客入力者担当メールは権限により必須
	//pactidがnullであってもエラーにならないようにする
	{
		var temp = Array();

		if (type == "Nmnp") {
			temp.push({
				name: "mnp_enable_date",
				mess: "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5\u304C\u7121\u52B9\u306A\u65E5\u4ED8\u3067\u3059",
				type: "QRCheckDate",
				format: undefined,
				validation: "client",
				reset: false,
				force: false
			});

			if (-1 !== A_auth.indexOf("fnc_mnp_req")) {
				temp.push({
					name: "mnpno",
					mess: "MNP\u4E88\u7D04\u756A\u53F7\u306F\u5FC5\u9808\u3067\u3059",
					type: "required",
					format: undefined,
					validation: "client",
					reset: false,
					force: false
				});

				if (-1 !== A_auth.indexOf("fnc_mnp_date_show")) {
					temp.push({
						name: "mnp_enable_date",
						mess: "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5\u306F\u5FC5\u9808\u3067\u3059",
						type: "required",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});
					temp.push({
						name: "mnp_enable_date",
						mess: "MNP\u4E88\u7D04\u756A\u53F7\u6709\u52B9\u65E5\u306F\u5FC5\u9808\u3067\u3059",
						type: "QRCheckDateEmptyYMD",
						format: undefined,
						validation: "client",
						reset: false,
						force: false
					});
				}
			}
		}

		var res = Array();

		for (var i = 0; i < telcount; i++) {
			for (var value of Object.values(temp)) {
				value.name += "_" + i;
				res.push(value);
			}
		}

		res.push({
			name: "chargermail",
			mess: "\u5165\u529B\u62C5\u5F53\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u66F8\u5F0F\u304C\u9055\u3044\u307E\u3059",
			type: "email",
			format: undefined,
			validation: "client",
			reset: false,
			force: false
		});

		if (-1 !== A_auth.indexOf("fnc_chargermail_req") && -1 !== A_auth.indexOf("fnc_chargermail_edit") && this.getSiteMode() == OrderFormView.SITE_USER) {
			res.push({
				name: "chargermail",
				mess: "\u5165\u529B\u62C5\u5F53\u8005\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u5FC5\u9808\u3067\u3059",
				type: "required",
				format: undefined,
				validation: "client",
				reset: false,
				force: false
			});
		}

		var pactid = !arg_pactid ? this.O_Sess.pactid : arg_pactid;

		if (!!pactid && -1 !== ["N", "Nmnp", "C", "S", "M"].indexOf(type)) //ルールの取得
			//ルールを設定する対象
			//注文時必須の項目にルールつける
			{
				var mid = 1;
				var req_rules = ManagementRule.getRules(pactid, mid);
				var item = ManagementRule.getItem(mid);

				for (var key in req_rules) {
					var value = req_rules[key];

					if (value.is_order_req && undefined !== item[value.name]) {
						var label = item[value.name].label;
						var data = {
							name: "",
							mess: "",
							type: "required",
							format: undefined,
							validation: "client",
							reset: false,
							force: false
						};

						for (i = 0;; i < telcount; i++) {
							var name = value.name == "username" ? "telusername" : value.name;
							data.name = name + "_" + i;
							data.mess = "\u96FB\u8A71\u8A73\u7D30\u60C5\u5831" + (i + 1) + "\u306E" + label + "\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044";
							res.push(data);
						}
					}
				}
			}

		return res;
	}

	makeOrderForm(O_order, O_form_model: OrderFormModel, O_telinfo_model: OrderTelInfoModel, H_items: {} | any[], H_dir: {} | any[], H_g_sess: {} | any[], telcount = 1, A_telitemmask = Array(), H_product = Array(), H_view = Array(), H_tempdef = Array()) //電話詳細情報のマスクがあればここで変数にセット
	//$this->H_View["O_OrderFormUtil"]->setFormElement( $H_items );	// 注文は特殊な処理が多いのでそのままじゃ使えない
	{
		if (0 < A_telitemmask.length) {
			for (var val of Object.values(A_telitemmask)) {
				this.A_mask.push(HTML_QuickForm.createElement("checkbox", val, undefined));
			}
		}

		this.checkQuickFormObject();
		this.makeOrderFormItem(O_order, O_form_model, O_telinfo_model, H_items, H_dir, H_g_sess, telcount, H_product, H_view, H_tempdef);
		this.O_OrderForm = this.H_View.O_OrderFormUtil.makeFormObject();
	}

	makeFormItemSelect(O_form_model, O_telinfo_model, H_dir, H_items, H_product, H_view, H_g_sess, H_tempdef = Array()) //英語化権限 20090210miya
	//電話詳細情報のナンバリングを外す
	{
		if (true == this.H_Dir.eng) {
			var eng = true;
			var noselstr = "Not specify";
			var plzselstr = "--please select--";
			var ptnselstr = "Enter pattern";
			var defkousistr = "Company default setting";
			var language = "ENG";
		} else {
			eng = false;
			noselstr = "\u6307\u5B9A\u306A\u3057";
			plzselstr = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
			ptnselstr = "\u4F7F\u7528\u3059\u308B\u30D1\u30BF\u30FC\u30F3\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
			defkousistr = "\u4F1A\u793E\u521D\u671F\u8A2D\u5B9A";
			language = "JPN";
		}

		var H_selectdef = {
			"": plzselstr
		};
		var inputname = str_replace(["_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9"], ["", "", "", "", "", "", "", "", "", ""], H_items.inputname);
		var itemname = H_items.itemname;

		switch (inputname) {
			case "userid":
				var H_selectval = {
					"": noselstr
				};
				var O_usermodel = new UserModel();

				if (undefined != H_dir.pactid && undefined != H_view.applypostid) {
					H_selectval += O_usermodel.getUserKeyHash(H_dir.pactid, H_view.applypostid);
				}

				if (undefined != H_dir.pactid && undefined != H_view.recogpostid) {
					H_selectval += O_usermodel.getUserKeyHash(H_dir.pactid, H_view.recogpostid);
				}

				break;

			case "plan":
				H_selectval = H_selectdef + O_form_model.getOrderPlan(H_dir, H_product, eng, H_view, this.withoutorderview);
				H_items.property = {
					id: "plan"
				};
				break;

			case "packet":
				H_selectval = H_selectdef + O_form_model.getOrderPacket(H_dir, H_product, eng);

				if (1 == H_selectval.length && undefined !== H_selectval[""]) {
					this.elementDisp[inputname] = "none";
				}

				break;

			case "parent":
				H_selectval = H_selectdef + O_form_model.getParentTelno(H_dir.pactid, H_dir.carid);
				break;

			case "kousi":
				H_selectdef = {
					"": ptnselstr
				};
				var H_kousi = Array();
				var H_kousitmp = O_telinfo_model.getKousi(H_dir.pactid, H_dir.carid);

				for (var key in H_kousitmp) {
					var value = H_kousitmp[key];

					if (value.kousiflg != "" && value.kousiflg == 0) //kousiflg（0はする、1はしない。nullはデフォルト設定ではない）
						{
							value.patternname = "\u25CE" + value.patternname + "\uFF08" + defkousistr + "\uFF09";
						}

					H_kousi[value.patternid] = value.patternname;
				}

				H_selectval = Array.from(H_selectdef + Array.from(H_kousi));
				break;

			case "formercarid":
				H_selectval = H_selectdef + O_telinfo_model.getPortableCarrier(H_dir.carid, eng);
				break;

			case "addr1":
				H_selectval = Array();
				var O_prefmodel = new PrefectureModel();
				H_selectval = O_prefmodel.getPrefecture(language);
				H_selectval = Array.from(H_selectdef + Array.from(H_selectval));
				break;

			case "misctype":
				var groupid = undefined !== H_g_sess.groupid ? H_g_sess.groupid : _SESSION.groupid;
				{
					var O_misc = new MiscModel();
					H_selectval = O_misc.getMiscTypeForSelect(groupid, H_dir.pactid, H_dir.carid);
				}
				break;

			case "fjpcommflag":
				H_selectval = this._getfjpModel().getOptionCommFlag();
				break;

			case "switchcarid":
			case "othercarid":
				H_selectval = O_form_model.getOtherCarrierList(H_g_sess.pactid, H_g_sess.postid, true);
				break;

			case "smartphonetype":
				H_selectval = O_form_model.getSmartPhoneTypeList(true, language);
				break;

			case "datechangeH":
				H_selectval = {
					"11": 11,
					"15": 15
				};
				break;

			case "select1":
			case "select2":
			case "select3":
			case "select4":
			case "select5":
			case "select6":
			case "select7":
			case "select8":
			case "select9":
			case "select10":
				//$no[1]に番号入る
				//書式は「title:item1,item2,item3」
				//titleの部分
				//itemの部分
				//承認詳細と承認内容変更
				//管理項目を設定
				//(電話管理編集用)現在の管理項目にない値が雛型にあった場合は追加する
				{
					var no = H_items.inputname.split("_");
					var temp = H_items.itemname.split(":");
					itemname = temp[0];
					temp = temp[1].split(",");
					H_selectval = Array();

					if (undefined !== H_dir.telinfo[no[1]][inputname]) {
						if (!is_null(H_dir.telinfo[no[1]][inputname])) {
							var select = H_dir.telinfo[no[1]][inputname];

							if (!(-1 !== temp.indexOf(select))) {
								if (preg_match("/detail/i", _SERVER.PHP_SELF)) //承認詳細
									{
										H_selectval[select] = select;
									} else //承認内容変更
									{
										H_selectval[select] = select;
									}
							}
						}
					} else if (undefined !== H_dir.telinfo["telno" + no[1]][inputname]) {
						select = H_dir.telinfo["telno" + no[1]][inputname];

						if (!is_null(select)) {
							if (!(-1 !== temp.indexOf(select))) {
								H_selectval[select] = select;
							}
						}
					}

					H_selectval[""] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";

					for (var key in temp) {
						var value = temp[key];
						H_selectval[value] = value;
					}

					if (undefined !== H_view.H_templatevalue[inputname]) {
						var tempvalue = H_view.H_templatevalue[inputname];

						if (!(-1 !== temp.indexOf(tempvalue))) {
							H_selectval[tempvalue] = tempvalue;
						}
					}

					if (undefined !== H_tempdef[inputname]) {
						tempvalue = H_tempdef[inputname];

						if (!(-1 !== temp.indexOf(tempvalue))) {
							H_selectval[tempvalue] = tempvalue;
						}
					}
				}
				break;

			default:
				H_selectval = H_selectdef;
				break;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement(H_items.inputtype, H_items.inputname, itemname, H_selectval, H_items.property);
	}

	makeFormItemCheckbox(O_form_model, O_telinfo_model, H_dir, H_items, H_product) //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var eng = true;
			var option_str = "Option";
			var waribiki_str = "Discount Service";
		} else {
			eng = false;
			option_str = "\u30AA\u30D7\u30B7\u30E7\u30F3";
			waribiki_str = "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9";
		}

		switch (H_items.inputname) {
			case "option":
				var H_option = O_form_model.getOrderOption(H_dir, H_product, eng);
				var H_waribiki = H_option;

				for (var key in H_option) {
					var value = H_option[key];

					if (+(value.discountflg == 1)) {
						delete H_option[key];
					}
				}

				for (var key in H_waribiki) {
					var value = H_waribiki[key];

					if (+(value.discountflg != 1)) {
						delete H_waribiki[key];
					}
				}

				if (0 == H_option.length) {
					this.elementDisp[H_items.inputname] = "none";
				}

				if (0 == H_waribiki.length) {
					this.elementDisp.waribiki = "none";
				}

				for (var key in H_waribiki) {
					var value = H_waribiki[key];
					A_waribiki.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:160px\">" + value.opname + "</span>"));
				}

				this.H_View.O_OrderFormUtil.O_Form.addGroup(A_waribiki, "waribiki", waribiki_str, ["&nbsp;", "<br />"]);

				if (H_dir.carid == 4) {
					var H_vodalive = Array();
					var H_vodayuryo = Array();

					for (var key in H_option) {
						var value = H_option[key];

						if (-1 !== this.O_Set.A_voda_live_op.indexOf(value.opid) == true) {
							H_vodalive[key] = value;
							delete H_option[key];
						} else if (-1 !== this.O_Set.A_voda_yuryo_op.indexOf(value.opid) == true) {
							H_vodayuryo[key] = value;
							delete H_option[key];
						}
					}

					for (var key in H_vodalive) {
						var value = H_vodalive[key];
						A_vodalive.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:250px\">" + value.opname + "</span>"));
					}

					for (var key in H_vodayuryo) {
						var value = H_vodayuryo[key];
						A_vodayuryo.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:250px\">" + value.opname + "</span>"));
					}

					this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodalive, "vodalive", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "<br />"]);
					this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodayuryo, "vodayuryo", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "<br />"]);
				}

				for (var key in H_option) {
					var value = H_option[key];
					A_option.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:160px\">" + value.opname + "</span>"));
				}

				if (H_templatevalue != "" && H_templatevalue.option[7] == 0) //これ動いてない
					{
						H_opt_def[7] = 0;
					} else //これ動いてない
					{
						H_opt_def[7] = 1;
					}

				if (H_templatevalue != "" && H_templatevalue.option[17] == 0) //これ動いてない
					{
						H_opt_def[17] = 0;
					} else //これ動いてない
					{
						H_opt_def[17] = 1;
					}

				this.H_View.O_OrderFormUtil.O_Form.addGroup(A_option, "option", option_str, ["&nbsp;", "<br />"]);
				break;

			case "service":
				var H_service = O_form_model.getOrderService(H_dir);

				for (var key in H_service) {
					var value = H_service[key];
					A_service.push(HTML_QuickForm.createElement("checkbox", value.opid, undefined, "<span style=\"width:160px\">" + value.opname + "</span>"));
				}

				if (true == this.H_Dir.eng) {
					var service_str = "Service";
				} else {
					service_str = "\u30B5\u30FC\u30D3\u30B9";
				}

				this.H_View.O_OrderFormUtil.O_Form.addGroup(A_service, "service", service_str, ["&nbsp;", "<br />"]);
				break;

			case "mask":
				this.A_mask.push(HTML_QuickForm.createElement("checkbox", H_items.inputdef, undefined));
				break;

			default:
				this.H_View.O_OrderFormUtil.O_Form.addElement("checkbox", H_items.inputname, H_items.itemname, H_items.itemtext, H_items.property);
				break;
		}
	}

	makeFormItemRadio(O_form_model, O_telinfo_model, H_dir, H_items, H_product) //英語化権限 20090210miya
	//割引サービス
	//vodafoneのボーダフォンライブ！とアフターサービス
	//オプションのデフォルト値
	//割引サービスのデフォルト値
	//softbank Yahoo!ケータイのデフォルト値
	//softbank 有料サービスのデフォルト値
	//オプションがラジオボタンであることを示すフラグ（フォームに初期値を入れるときに使う）
	{
		if (true == this.H_Dir.eng) {
			var eng = true;
			var option_str = "Option";
			var waribiki_str = "Discount Service";
			var stay_str = "No Change";
			var put_str = "Add";
			var remove_str = "Remove";
		} else {
			eng = false;
			option_str = "\u30AA\u30D7\u30B7\u30E7\u30F3";
			waribiki_str = "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9";
			stay_str = "\u5909\u66F4\u306A\u3057";
			put_str = "\u3064\u3051\u308B";
			remove_str = "\u5916\u3059";
		}

		var H_option = O_form_model.getOrderOption(H_dir, H_product, eng);
		var H_waribiki = H_option;

		for (var key in H_option) {
			var value = H_option[key];

			if (+(value.discountflg == 1)) {
				delete H_option[key];
			}
		}

		for (var key in H_waribiki) {
			var value = H_waribiki[key];

			if (+(value.discountflg != 1)) {
				delete H_waribiki[key];
			}
		}

		for (var key in H_waribiki) {
			var value = H_waribiki[key];
			A_wariradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, stay_str, "stay"));
			A_wariradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, put_str, "put"));
			A_wariradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, remove_str, "remove"));
			H_wari_def[value.opid] = "stay";
		}

		this.H_View.O_OrderFormUtil.O_Form.addGroup(A_wariradio, "waribiki", waribiki_str, ["&nbsp;", "&nbsp;", "<br />"]);

		if (H_dir.carid == 4) {
			var H_vodalive = Array();
			var H_vodayuryo = Array();

			for (var key in H_option) {
				var value = H_option[key];

				if (-1 !== this.O_Set.A_voda_live_op.indexOf(value.opid) == true) {
					H_vodalive[key] = value;
					delete H_option[key];
				} else if (-1 !== this.O_Set.A_voda_yuryo_op.indexOf(value.opid) == true) {
					H_vodayuryo[key] = value;
					delete H_option[key];
				}
			}

			for (var key in H_vodalive) {
				var value = H_vodalive[key];
				A_vodaliveradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, stay_str, "stay"));
				A_vodaliveradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, put_str, "put"));
				A_vodaliveradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, remove_str, "remove"));
				H_vodalive_def[value.opid] = "stay";
			}

			this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodaliveradio, "vodalive", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "&nbsp;", "<br />"]);

			for (var key in H_vodayuryo) {
				var value = H_vodayuryo[key];
				A_vodayuryoradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, stay_str, "stay"));
				A_vodayuryoradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, put_str, "put"));
				A_vodayuryoradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, remove_str, "remove"));
				H_vodayuryo_def[value.opid] = "stay";
			}

			this.H_View.O_OrderFormUtil.O_Form.addGroup(A_vodayuryoradio, "vodayuryo", "\u30AA\u30D7\u30B7\u30E7\u30F3", ["&nbsp;", "&nbsp;", "<br />"]);
		}

		for (var key in H_option) {
			var value = H_option[key];
			A_optradio.push(HTML_QuickForm.createElement("radio", value.opid, value.opname, stay_str, "stay"));
			A_optradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, put_str, "put"));
			A_optradio.push(HTML_QuickForm.createElement("radio", value.opid, undefined, remove_str, "remove"));
			H_opt_def[value.opid] = "stay";
		}

		this.H_View.O_OrderFormUtil.O_Form.addGroup(A_optradio, "option", option_str, ["&nbsp;", "&nbsp;", "<br />"]);
		this.H_View.H_opt_def = H_opt_def;
		this.H_View.H_wari_def = H_wari_def;
		this.H_View.H_vodalive_def = H_vodalive_def;
		this.H_View.H_vodayuryo_def = H_vodayuryo_def;
		var option_is_radio = true;
	}

	makeOrderBoxInputForm(O_model, H_sess, site, H_templatevalue = Array()) //カゴの情報
	//英語化権限 20090210miya
	//全キャリア共通
	//価格表からの注文
	//付属品
	//かご部分の計算ボタンと付属品別項目作成
	//QuickFormUtilObjectがあるかチェック
	{
		var H_order = H_sess[OrderFormView.PUB].H_product;

		if (false == Array.isArray(H_order)) {
			H_order = Array();
		}

		if (site == 1) {
			var listbtn_jsname = "openProductListAct";
		} else {
			listbtn_jsname = "openProductList";
		}

		if (true == this.H_Dir.eng) {
			var eng = true;
			var listbtn_str = "Order from Price List";
			var handbtn_str = "Enter Directly";
			var handbtn_acce_str = "Enter Directly";
			var applyprc_str = "Total";
			var purchase_str = "Method of Purchase";
			var payfreq_str = "No. of Installments";
			var listnamestr = OrderFormView.LISTNAME_ENG;
			var colorstr = "Color";
			var productnamestr = "Model";
			var telno_str = "Mobile Number";
			var property_str = "Please select";
			var property_any = "Any color";
		} else //$handbtn_acce_str = "直接入力";
			{
				eng = false;
				listbtn_str = "\u4FA1\u683C\u8868\u304B\u3089\u9078\u629E\u3057\u3066\u6CE8\u6587";
				handbtn_str = "\u76F4\u63A5\u5165\u529B\u3067\u6CE8\u6587";
				handbtn_acce_str = "\u5546\u54C1\u78BA\u5B9A";
				applyprc_str = "\u7533\u8ACB\u91D1\u984D";
				purchase_str = "\u8CFC\u5165\u65B9\u5F0F";
				payfreq_str = "\u5272\u8CE6\u56DE\u6570";
				listnamestr = OrderFormView.LISTNAME;
				colorstr = "\u8272";
				productnamestr = "\u6A5F\u7A2E";
				telno_str = "\u643A\u5E2F\u756A\u53F7";
				property_str = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
				property_any = "\u6307\u5B9A\u306A\u3057";
			}

		var A_form = [{
			name: "productid",
			inputtype: "hidden"
		}, {
			name: "buyselid",
			inputtype: "hidden"
		}, {
			name: "buytype1",
			inputtype: "hidden"
		}, {
			name: "buytype2",
			inputtype: "hidden"
		}, {
			name: "downmoney",
			inputtype: "hidden"
		}, {
			name: "onepay",
			inputtype: "hidden"
		}, {
			name: "totalprice",
			inputtype: "hidden"
		}, {
			name: "listbtn",
			label: listbtn_str,
			inputtype: "button",
			options: {
				onClick: listbtn_jsname + "('" + H_sess[OrderFormView.PUB].type + "'," + H_sess[OrderFormView.PUB].carid + "," + H_sess[OrderFormView.PUB].cirid + "," + H_sess[OrderFormView.PUB].ppid + ")"
			}
		}, {
			name: "handbtn",
			label: handbtn_str,
			inputtype: "button",
			options: {
				onClick: "enableHand('" + H_sess[OrderFormView.PUB].type + "')"
			}
		}, {
			name: "applyrpice",
			label: applyprc_str,
			inputtype: "text"
		}, {
			name: "insbox",
			label: listnamestr,
			inputtype: "button",
			options: {
				onClick: "checkOrderInput(" + H_sess[OrderFormView.PUB].carid + ")"
			}
		}];

		if (true == (undefined !== H_sess[OrderFormView.PUB].price_detailid)) {
			if (true == (undefined !== H_order.tel.productid)) //2013-11-06
				//色はselect
				//機種名はhidden
				{
					var A_disable = {
						disabled: "true"
					};
					var colorlists = Array.from(O_model.getProductProperty(H_order.tel.productid));
					A_form.push({
						name: "color",
						label: colorstr,
						inputtype: "select",
						data: {
							"": property_str,
							[property_any]: property_any
						} + colorlists
					});
					A_form.push({
						name: "productname",
						inputtype: "hidden"
					});
				}
		} else {
			A_disable = {
				disabled: "false"
			};

			if ("M" != H_sess[OrderFormView.PUB].type) //機種名はtext
				{
					A_form.push({
						name: "productname",
						label: productnamestr,
						inputtype: "text"
					});
				}

			if (true == (undefined !== H_order.tel.productid)) {
				colorlists = Array.from(O_model.getProductProperty(H_order.tel.productid));

				if (undefined !== colorlists[H_templatevalue.color] || property_any == H_templatevalue.color || "pulldownonly" == H_templatevalue.color || !H_templatevalue.color) //色はselect
					{
						A_form.push({
							name: "color",
							label: colorstr,
							inputtype: "select",
							data: {
								"": property_str,
								[property_any]: property_any
							} + colorlists
						});
					} else //色はtext
					{
						A_form.push({
							name: "color",
							label: colorstr,
							inputtype: "text"
						});
					}
			} else //色はtext
				{
					A_form.push({
						name: "color",
						label: colorstr,
						inputtype: "text"
					});
				}
		}

		if (H_sess[OrderFormView.PUB].type == "A") //DBから取って来れない初期データを作る
			//回線種別・シリーズ・機種ID・機種名を取得、整形
			//シリーズ配列
			//機種配列
			{
				var A_accefrom = {
					fromtel: ["\u643A\u5E2F\u756A\u53F7\u304B\u3089\u6307\u5B9A => "],
					fromproduct: ["\u6A5F\u7A2E\u304B\u3089\u6307\u5B9A => "]
				};
				var H_series = Array();
				var H_product = Array();
				var H_tempproduct = O_model.getTelProduct(H_sess[OrderFormView.PUB]);

				for (var ky in H_tempproduct) {
					var val = H_tempproduct[ky];
					H_series[val.seriesname] = val.seriesname;
					H_product[val.productid] = val.productname;
				}

				A_form.push({
					name: "acceradio",
					label: "",
					inputtype: "radio",
					data: A_accefrom,
					options: {
						fromtel: {
							onClick: "disableAcceRadio()"
						}
					}
				});
				A_form.push({
					name: "telno",
					label: telno_str,
					inputtype: "text",
					options: ""
				});
				A_form.push({
					name: "series",
					label: "\u30B7\u30EA\u30FC\u30BA",
					inputtype: "select",
					data: {
						"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
					} + H_series
				});
				A_form.push({
					name: "telproduct",
					label: "\u6A5F\u7A2E",
					inputtype: "select",
					data: {
						"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
					} + H_product
				});
				A_form.push({
					name: "insacce",
					label: "\u7D5E\u308A\u8FBC\u307F",
					inputtype: "button",
					options: {
						onClick: "openAcceList()"
					}
				});
				A_form.push({
					name: "free_productname",
					label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u5546\u54C1\u540D",
					inputtype: "text",
					options: ""
				});
				A_form.push({
					name: "free_price",
					label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u4FA1\u683C",
					inputtype: "text",
					options: {
						size: "3"
					}
				});
				A_form.push({
					name: "free_count",
					label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u6570\u91CF",
					inputtype: "text",
					options: {
						size: "3",
						[maxlength]: "2"
					}
				});
				A_form.push({
					name: "free_property",
					label: "\u81EA\u7531\u8A18\u5165\u6B04\uFF1A\u5099\u8003",
					inputtype: "text",
					options: {
						size: "60"
					}
				});
				A_form.push({
					name: "free_insacce",
					label: handbtn_acce_str,
					inputtype: "button",
					options: {
						onClick: "insAcceFree()"
					}
				});
			}

		if (H_sess[OrderFormView.PUB].carid != O_Set.car_emobile) //引数にcirid追加 5G対応 20200607 hanashima
			{
				var buyselData = O_model.getPurchaseId(H_sess[OrderFormView.PUB].carid, eng, H_sess[OrderFormView.PUB].cirid);

				if (79 == H_sess[OrderFormView.PUB].cirid) {
					var buyselTemp = buyselData;
					buyselData = Array();

					for (var buyselId in buyselTemp) {
						var buyselName = buyselTemp[buyselId];

						if ("\u30D9\u30FC\u30B7\u30C3\u30AF" != buyselName) {
							buyselData[buyselId] = buyselName;
						}
					}
				}

				var A_temp = [{
					name: "purchase",
					label: purchase_str,
					inputtype: "select",
					data: buyselData,
					options: {
						onChange: "disablePayCount(\"del\")"
					}
				}, {
					name: "pay_frequency",
					label: payfreq_str,
					inputtype: "select",
					data: O_model.getPayCountId(H_sess[OrderFormView.PUB].carid, eng),
					options: A_disable
				}];
				A_form = array_merge(A_form, A_temp);
			}

		if (true == (undefined !== H_sess[OrderFormView.PUB].price_detailid)) //foreach($H_sess["SELF"]["orderlist"] as $key=>$val){
			//				$A_temp = array(
			//					array("name"=>"acce".$idx, "label"=>$val, "inputtype"=>"text", "options"=>$A_attr)
			//				);
			//			}
			//価格表ではなく手動入力での注文
			{
				var idx = 0;
				A_form = array_merge(A_form, A_temp);
			} else {}

		A_form = array_merge(A_form, this.makeOrderBoxDetailForm(H_sess, H_order));
		this.checkQuickFormObject();
		this.H_View.O_OrderFormUtil.setFormElement(A_form);
		this.InputForm = this.H_View.O_OrderFormUtil.makeFormObject();
	}

	makeOrderBoxDetailForm(H_sess, H_order) //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var calc_str = "Calculate";
		} else {
			calc_str = "\u8A08\u7B97\u3059\u308B";
		}

		if (H_sess[OrderFormView.PUB].telcount == 1 || H_sess[OrderFormView.PUB].type == "A") //数量を入力できるのは注文種別が付属品のときだけ
			{
				if (H_sess[OrderFormView.PUB].telcount != "") {
					var telcount = H_sess[OrderFormView.PUB].telcount;
				} else {
					telcount = 0;
				}

				var A_temp = [{
					name: "calc",
					label: calc_str,
					inputtype: "button",
					options: {
						onClick: "calcOrder(3, " + H_sess[OrderFormView.PUB].carid + ", " + telcount + ", '" + H_sess[OrderFormView.PUB].type + "')"
					}
				}];

				if (true == (undefined !== H_order.acce) && H_sess[OrderFormView.PUB].type == "A") {
					if (0 < H_order.acce.length) {
						{
							let _tmp_0 = H_order.acce;

							for (var key in _tmp_0) {
								var val = _tmp_0[key];

								if ("" != val.productid) //20110906
									{
										A_temp.push({
											name: "acce" + val.productid,
											label: val.productname,
											inputtype: "text",
											options: this.makeItemDetailFormOption(val.productid)
										});
									} else {
									A_temp.push({
										name: "acce" + val.productname,
										label: val.productname,
										inputtype: "text",
										options: this.makeItemDetailFormOption(val.productname)
									});
								}
							}
						}
					}
				} else {
					if (0 < H_order.acce.length) {
						{
							let _tmp_1 = H_order.acce;

							for (var key in _tmp_1) {
								var val = _tmp_1[key];

								if ("" != val.productid) {
									A_temp.push({
										name: "acce" + val.productid,
										label: val.productname,
										inputtype: "checkbox",
										options: {
											id: "acce" + val.productid
										}
									});
								} else {
									A_temp.push({
										name: "acce" + val.productname,
										label: val.productname,
										inputtype: "checkbox",
										options: {
											id: "acce" + val.productname
										}
									});
								}
							}
						}
					}
				}
			} else {
			A_temp = [{
				name: "calc",
				label: calc_str,
				inputtype: "button",
				options: {
					onClick: "calcOrder(3, " + H_sess[OrderFormView.PUB].carid + ", " + H_sess[OrderFormView.PUB].telcount + ", '" + H_sess[OrderFormView.PUB].type + "')"
				}
			}];

			if (true == (undefined !== H_order.acce)) {
				if (0 < H_order.acce.length) {
					{
						let _tmp_2 = H_order.acce;

						for (var key in _tmp_2) {
							var val = _tmp_2[key];

							if ("" != val.productid) {
								A_temp.push({
									name: "acce" + val.productid,
									label: val.productname,
									inputtype: "checkbox",
									options: {
										id: "acce" + val.productid
									}
								});
							} else {
								A_temp.push({
									name: "acce" + val.productname,
									label: val.productname,
									inputtype: "checkbox",
									options: {
										id: "acce" + val.productname
									}
								});
							}
						}
					}
				}
			}
		}

		return A_temp;
	}

	makeItemDetailFormOption(idx) {
		return {
			size: "3",
			maxlength: "2",
			id: "acce" + idx
		};
	}

	makeOrderFormItemToTelDetail(H_items: {} | any[], telcount = 1) {
		var A_teldetail_items = ["telusername", "employeecode", "kousi", "kousiradio", "mail", "memo", "mnpno", "formercarid", "mnp_enable_date" + "simcardno"];
		var H_additems = Array();

		for (var i = 0; i < H_items.length; i++) {
			if (true == (-1 !== A_teldetail_items.indexOf(H_items[i].inputname))) {
				for (var cnt = 0; cnt < telcount; cnt++) //公私分計のラジオボタンだったら呼んでるJavaScript名も変えないといけない
				{
					var H_tmp = H_items[i];
					H_tmp.inputname = H_items[i].inputname + "_" + cnt;

					if (H_items[i].inputname == "kousiradio") {
						H_tmp.property = str_replace("disableKousiradio", "disableKousiradio_" + cnt, H_tmp.property);
					}

					H_additems.push(H_tmp);
					delete H_tmp;
				}
			}
		}

		H_items = array_merge(H_items, H_additems);
		return H_items;
	}

	makeOrderFormItem(O_order, O_form_model: OrderFormModel, O_telinfo_model: OrderTelInfoModel, H_items: {} | any[], H_dir: {} | any[], H_g_sess: {} | any[], telcount = 1, H_product, H_view, H_tempdef = Array()) //配列に引数をまとめてしまう
	//キャリアの代表エリア(関東圏)を取得
	//フォーム表示項目のうち必要なものを電話詳細表示用に名前を変える
	//DBから取得した注文ページに表示するフォーム個数分、回す
	//マスクがあればここでセット
	{
		H_dir.pactid = H_g_sess.pactid;
		H_dir.arid = O_telinfo_model.getAreatoCarrier(H_dir.carid);
		H_items = this.makeOrderFormItemToTelDetail(H_items, telcount);
		var cnt = H_items.length;

		for (var i = 0; i < cnt; i++) //入力しないものは最初から確定
		{
			if (H_items[i] == Array()) {
				continue;
			}

			if (H_items[i].inputtype == "select") {
				this.makeFormItemSelect(O_form_model, O_telinfo_model, H_dir, H_items[i], H_product, H_view, H_g_sess, H_tempdef);
			} else if (H_items[i].inputtype == "checkbox") {
				this.makeFormItemCheckbox(O_form_model, O_telinfo_model, H_dir, H_items[i], H_product);
			} else if (H_items[i].inputtype == "radio_child") {
				global[H_items[i].inputname].push(HTML_QuickForm.createElement("radio", undefined, undefined, H_items[i].itemname, H_items[i].inputdef, H_items[i].property));
			} else if (H_items[i].inputtype == "radio") {
				if (H_items[i].inputname == "option") {
					this.makeFormItemRadio(O_form_model, O_telinfo_model, H_dir, H_items[i], H_product);
				} else //下の1行をmakeItemRadioに入れたらなぜかradioボタンが生成できなかった。
					//時間がないのでif文ごと外に出して対応。
					{
						this.H_View.O_OrderFormUtil.O_Form.addGroup(global[H_items[i].inputname], H_items[i].inputname, H_items[i].itemname, H_items[i].property);
					}
			} else {
				var H_property = unserialize(H_items[i].property);

				if (H_property == "") {
					H_property = H_items[i].property;
				}

				if (H_items[i].inputtype == "date") //英語化権限 20090331miya
					//$now = mktime(0, 0, 0, 4, 2, 2011);
					//前後3ヵ月なので3を設定
					//2011-01-04 削除
					//					// 1月だけ前年を表示(他のロジックの方が望ましい)
					//					if(date("n") == 1){
					//						$H_def_year = array("minYear" => date("Y") - 1, "maxYear" => date("Y"));
					//					// 12月には翌年を表示するよう修正 2010.12.01 前田
					//					}elseif(date("n") == 12){
					//						$H_def_year = array("minYear" => date("Y"), "maxYear" => date("Y") + 1);
					//					}else{
					//						$H_def_year = array("minYear" => date("Y"));
					//					}
					{
						if (true == this.H_Dir.eng) {
							if (H_property.format == "Y \u5E74 m \u6708 d \u65E5") {
								H_property.format = "Y / m / d";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5\u307E\u3067") {
								H_property.format = "\\T\\o      Y / m / d";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5 \u4EE5\u964D") {
								H_property.format = "\\F\\r\\o\\m Y / m / d";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5 H \u6642\u307E\u3067") {
								H_property.format = "\\T\\o      Y / m / d H:00";
							} else if (H_property.format == "Y \u5E74 m \u6708 d \u65E5 H \u6642\u4EE5\u964D") {
								H_property.format = "\\F\\r\\o\\m Y / m / d H:00";
							}
						}

						var now = Date.now() / 1000;
						var context = 3;
						var max = mktime(0, 0, 0, date("n", now) + context, 1, date("Y", now));
						var min = mktime(0, 0, 0, date("n", now) - context, 1, date("Y", now));
						var maxY = date("Y", max);
						var minY = date("Y", min);
						var H_def_year = {
							minYear: minY,
							maxYear: maxY
						};
						H_property = Array.from(H_property + Array.from(H_def_year));
					}

				this.H_View.O_OrderFormUtil.O_Form.addElement(H_items[i].inputtype, H_items[i].inputname, H_items[i].itemname, H_property);
			}

			if (H_items[i].inputdef == "frz") {
				this.A_frz.push(H_items[i].inputname);
			}
		}

		if (0 < this.A_mask.length) {
			this.A_mask.push(HTML_QuickForm.createElement("checkbox", "telusername", undefined));
			this.A_mask.push(HTML_QuickForm.createElement("checkbox", "employeecode", undefined));
			this.A_mask.push(HTML_QuickForm.createElement("checkbox", "simcardno", undefined));
			this.A_mask.push(HTML_QuickForm.createElement("checkbox", "mail", undefined));
			this.A_mask.push(HTML_QuickForm.createElement("checkbox", "kousi", undefined));
			this.A_mask.push(HTML_QuickForm.createElement("checkbox", "memo", undefined));
			this.H_View.O_OrderFormUtil.O_Form.addGroup(this.A_mask, "mask", "\u30DE\u30B9\u30AF");
		}
	}

	removeMaskedRules(H_rule = Array(), H_mask = Array()) {
		if (true == 0 < H_rule.length && true == Array.isArray(H_mask) && true == 0 < H_mask.length) //FJP用 2013-09-23
			{
				var A_masked = Object.keys(H_mask);

				if (undefined !== H_mask.h_cfbpostcode == true) {
					A_masked.push("cfbpostcode_second");
				}

				if (undefined !== H_mask.h_pbpostcode == true) {
					A_masked.push("pbpostcode_second");
				}

				if (true == (-1 !== A_masked.indexOf("dateradio"))) {
					A_masked.push("datefrom");
					A_masked.push("dateto");
				}

				if (true == (-1 !== A_masked.indexOf("datechangeradio"))) {
					A_masked.push("datechange");
				}

				if (true == (-1 !== A_masked.indexOf("pointradio"))) {
					A_masked.push("point");
				}

				if (true == (-1 !== A_masked.indexOf("plan"))) {
					A_masked.push("planradio");
				}

				if (true == (-1 !== A_masked.indexOf("packet"))) {
					A_masked.push("packetradio");
				}

				if (true == (-1 !== A_masked.indexOf("discounttel1")) || -1 !== A_masked.indexOf("waribiki")) {
					A_masked.push("discounttel2");
					A_masked.push("discounttel3");
					A_masked.push("discounttel4");
					A_masked.push("discounttel5");
				}

				if (true == (-1 !== A_masked.indexOf("billradio"))) {
					A_masked.push("parent");
					A_masked.push("billaddress");
				}

				if (true == (-1 !== A_masked.indexOf("sendhow"))) {
					A_masked.push("sendname");
					A_masked.push("zip1");
					A_masked.push("zip2");
					A_masked.push("addr1");
					A_masked.push("addr2");
					A_masked.push("sendtel");
				}

				if (true == (-1 !== A_masked.indexOf("kousi"))) {
					A_masked.push("kousiradio");
				}

				if (true == (-1 !== A_masked.indexOf("product"))) {
					A_masked.push("color");
				}

				for (var rlky in H_rule) {
					var rlvl = H_rule[rlky];

					if (true == (-1 !== A_masked.indexOf(rlvl.name))) {
						delete H_rule[rlky];
					} else {
						for (var key of Object.values(A_masked)) {
							if (true == preg_match("/'" + key + "'/", rlvl.name)) {
								delete H_rule[rlky];
							} else if (true == preg_match("/" + key + "\\_/", rlvl.name)) {
								delete H_rule[rlky];
							} else if (true == preg_match("/'" + key + "\\_'/", rlvl.name)) {
								delete H_rule[rlky];
							} else if (true == preg_match("/\"" + key + "\"/", rlvl.name)) {
								delete H_rule[rlky];
							}
						}
					}
				}

				var H_rule_tmp = Array();

				for (var rule of Object.values(H_rule)) {
					H_rule_tmp.push(rule);
				}

				H_rule = H_rule_tmp;
			}

		return H_rule;
	}

	makeSelectRecogMail(recog_list) //販売店回答用にフォームエレメント追加
	//$H_select = array_merge( array("" => "選択してください"),$recog_list );	//	keyの値が0からの連番になってしまう
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("select", "select_recog_mail", "\u627F\u8A8D\u8005(\u30E1\u30FC\u30EB\u9001\u4ED8\u5148)", recog_list);
	}

	makeActorderCommentForm(O_form_model: OrderFormModel, shopid = undefined) //販売店回答用にフォームエレメント追加
	//ショップコメント
	{
		var H_selectdef = {
			"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
		};
		var H_member = Array();

		if ("" != shopid) {
			H_member = O_form_model.getShopMemberSelect(shopid);
		}

		H_member = H_selectdef + H_member;
		this.H_View.O_OrderFormUtil.O_Form.addElement("select", "member", "\u4EE3\u884C\u6CE8\u6587\u8005", H_member);
		this.H_View.O_OrderFormUtil.O_Form.addElement("text", "shopcomment", "\u30B3\u30E1\u30F3\u30C8", {
			size: "80"
		});
		this.H_View.O_OrderFormUtil.O_Form.addRule("shopcomment", "\u30B3\u30E1\u30F3\u30C8\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
		this.H_View.O_OrderFormUtil.O_Form.addRule("member", "\u4EE3\u884C\u6CE8\u6587\u8005\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044", "required", undefined, "client");
	}

	makeBulkPlanForm(H_sub: {} | any[], H_area: {} | any[], A_nodisp: {} | any[] = Array()) //nullは受注完了時にエラーになるので駄目 20100128miya
	//$H_selectdef = array("" => "選択なし");
	//$H_selectval = $H_selectdef + $H_area;
	{
		var H_selectval = H_area;

		for (var val of Object.values(H_sub)) {
			this.H_View.O_OrderFormUtil.O_Form.addElement("select", "arid" + val.telno, "\u5730\u57DF\u4F1A\u793E", H_selectval);
		}

		if (true == A_nodisp.length > 0) {
			for (var telno of Object.values(A_nodisp)) {
				this.H_View.O_OrderFormUtil.O_Form.addElement("hidden", "arid" + telno, "\u5730\u57DF\u4F1A\u793E");
			}
		}
	}

	convPurchaseId(carid, selid) {
		if (false == (undefined !== selid)) {
			return false;
		}

		switch (carid) {
			case this.O_Set.car_docomo:
				if (1 == selid) {
					var result = "\u9078\u629E\u306A\u3057";
				} else if (2 == selid) {
					result = "\u30D0\u30EA\u30E5\u30FC";
				} else if (3 == selid) {
					result = "\u30D9\u30FC\u30B7\u30C3\u30AF";
				}

				break;

			case this.O_Set.car_willcom:
				result = undefined;
				break;

			case this.O_Set.car_au:
				result = undefined;
				break;

			case this.O_Set.car_softbank:
				result = undefined;
				break;

			default:
				result = undefined;
				break;
		}

		return result;
	}

	makeBuyCourceStr(cource) {
		switch (cource) {
			case "value":
				var result = "\u30D0\u30EA\u30E5\u30FC\u30B3\u30FC\u30B9";
				break;

			case "basic":
				result = "\u30D9\u30FC\u30B7\u30C3\u30AF\u30B3\u30FC\u30B9";
				break;

			case "1year":
				result = "1\u5E74\u7E1B\u308A";
				break;

			case "2year":
				result = "2\u5E74\u7E1B\u308A";
				break;

			case "new2year":
				result = "\u65B02\u5E74\u7E1B\u308A";
				break;

			case "acc":
				result = "\u4ED8\u5C5E\u54C1";
				break;

			case "":
				result = "\u8CFC\u5165\u65B9\u5F0F\u306A\u3057";
				break;

			default:
				result = "\u4E0D\u660E\u306A\u8CFC\u5165\u65B9\u5F0F";
				break;
		}

		return result;
	}

	convPayCountId(loan) {
		if (0 == loan) {
			var result = "\u672A\u9078\u629E";
		} else if (1 == loan) {
			result = "1\u56DE";
		} else if (12 == loan) {
			result = "12\u56DE";
		} else if (24 == loan) {
			result = "24\u56DE";
		} else {
			return false;
		}

		return result;
	}

	freezeForm() //英語化権限
	//$this->H_View["O_OrderFormUtil"]->updateElementAttrWrapper( "submit", array( "value" => self::RECNAME ) );
	//$this->H_View["O_OrderFormUtil"]->updateAttributesWrapper( array( "onsubmit" => false ) );
	//ダブルクリック防止
	{
		if (true == this.H_Dir.eng) {
			var recnamestr = OrderFormView.RECNAME_ENG;
			var backnamestr = OrderFormView.BACKNAME_ENG;
		} else {
			recnamestr = OrderFormView.RECNAME;
			backnamestr = OrderFormView.BACKNAME;
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", recnamestr, {
			id: "submitName",
			value: recnamestr
		});
		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "backName", backnamestr, {
			id: "backName",
			value: backnamestr
		});
		this.H_View.O_OrderFormUtil.updateAttributesWrapper({
			onsubmit: "return stop_w_click();"
		});
		this.H_View.O_OrderFormUtil.freezeWrapper();
	}

	unfreezeForm(accQuant = Array()) //英語化権限
	//$this->H_View["O_OrderFormUtil"]->updateElementAttrWrapper( "submit", array( "value" => self::NEXTNAME ) );
	//20110905
	{
		if (true == this.H_Dir.eng) {
			var nextnamestr = OrderFormView.NEXTNAME_ENG;
		} else {
			nextnamestr = OrderFormView.NEXTNAME;
		}

		if (!!accQuant && false !== accQuant) {
			this.H_View.O_OrderFormUtil.O_Form.addElement("button", "checkQuant", nextnamestr, {
				id: "checkQuant",
				value: nextnamestr,
				onClick: "checkRealAccQuant('" + accQuant + "')"
			});
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("submit", "submitName", nextnamestr, {
			id: "submitName",
			value: nextnamestr
		});

		if (this.A_frz.length > 0) {
			this.H_View.O_OrderFormUtil.O_Form.freeze(this.A_frz);
		}
	}

	makeFormStatic(H_g_sess: {} | any[], H_order: {} | any[] = Array(), H_view: {} | any[] = Array()) //スタティック表示部分
	{
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "ptn", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "comp", H_view.compname);
		this.H_View.O_OrderFormUtil.O_Form.addElement("header", "loginname", H_g_sess.loginname);
	}

	makeOrderDefault(H_g_sess: {} | any[], H_sess: {} | any[], O_form_model: OrderFormModel, H_view, A_auth) //デフォルト値配列
	//$H_sess["SELF"]を別変数にコピー
	//上書きしたくない余計なパラメータを抜く
	//明日の日付取得
	//解約の注文の場合はgroupidはnullで渡す
	//プラン変更の場合、翌月一日の日付を使う 20091019miya
	//住所取得
	//部署ツリー文字列に会社名があったら省く
	//価格表からの入力
	//解約、MNP時に電話管理から電話消さない 20190116伊達
	{
		var H_default = Array();
		var H_self = Array.from(H_sess.SELF);

		if (H_self.length > 0 && (H_self.handopen == "" || H_self.handopen != "" && H_self.handopen != 1)) //unset($H_self["color"]);
			//価格表を開くときに使われている変数
			{
				delete H_self.tempid;
				delete H_self.carid;
				delete H_self.cirid;
				delete H_self.type;
				delete H_self.ppid;
				delete H_self.productname;
				delete H_self.submitName;
				delete H_self.handopen;
				delete H_self.boxopen;
				delete H_self.open;

				if (H_self.applyprice == 0) {
					delete H_self.applyprice;
				}

				if (H_self.point == 0) {
					delete H_self.point;
				}
			} else //「直接入力で注文」ボタンが押されて手入力フォームが出たときはフォームの中をきれいにする（ここは役に立ってない？）
			{
				if (H_self.handopen != "" && H_self.handopen == 1) {
					delete H_self.color;
					delete H_self.productname;
					delete H_self.purchase;
					delete H_self.pay_frequency;
				}
			}

		var groupid = H_sess["/MTOrder"].type == "D" ? undefined : H_g_sess.groupid;
		var A_tom = this.makeTomorrow(groupid);
		var A_nextmonth_1st = this.makeNext1stDay();
		var H_addr = this.makeAddr(H_g_sess, O_form_model, H_view);

		if ("" != H_g_sess.compname && "" != H_view.posttreestr) {
			H_view.posttreestr = mb_ereg_replace(H_g_sess.compname, "", H_view.posttreestr);
		}

		var H_tmpslf = H_self;
		delete H_tmpslf.purchase;
		delete H_tmpslf.pay_frequency;
		delete H_tmpslf.csrfid;

		for (var slfkey in H_tmpslf) {
			var slfval = H_tmpslf[slfkey];

			if (preg_match("/^h_/", slfkey) || "smartphonetype" == slfkey) {
				delete H_tmpslf[slfkey];
			}
		}

		if (H_tmpslf.length > 0) //2014-03-27
			//代行注文
			{
				H_default = H_self;

				if (undefined !== H_view.H_templatevalue && H_view.H_templatevalue != false && H_view.H_templatevalue.length > 0) {
					var H_tempval = Array();
					{
						let _tmp_3 = H_view.H_templatevalue;

						for (var key in _tmp_3) {
							var val = _tmp_3[key];

							if (undefined !== _POST.productname) {
								if (strpos(key, "acce") !== 0) {
									H_tempval[key] = val;
								}
							} else //if($key != "option" && $key != "waribiki" && !preg_match("/^acce[0-9]+$/", $key)){
								{
									if (key != "option" && key != "waribiki" && strpos(key, "acce") !== 0) {
										H_tempval[key] = val;
									}
								}
						}
					}
					H_default = H_self + H_tempval;
				}

				if (H_default.ciridradio == "") {
					H_default.ciridradio = H_sess[OrderFormView.PUB].cirid;
				}

				if (H_default.contractor == "") {
					H_default.contractor = H_view.compname;
				}

				if (H_default.datefrom == "") {
					H_default.datefrom = {
						Y: A_tom[0],
						m: A_tom[1],
						d: A_tom[2],
						H: 12
					};
				}

				if (H_default.dateradio == "") {
					if (true == (-1 !== ["P", "Ppl", "Pop", "Pdc"].indexOf(H_sess[OrderFormView.PUB].type))) //$H_default["dateradio"] = "reserve";
						{
							H_default.dateradio = "not_specify";
						}
				}

				if (H_default.datechangeradio == "") {
					if (true == (-1 !== ["T", "Tpc", "Tcp", "Tcc"].indexOf(H_sess[OrderFormView.PUB].type))) //$H_default["dateradio"] = "reserve";
						{
							H_default.datechangeradio = "not_specify";
						}
				}

				if (H_default.dateto == "") {
					if (true == (-1 !== ["P", "Ppl", "Pop", "Pdc"].indexOf(H_sess[OrderFormView.PUB].type))) {
						if ("reserve" == H_default.dateradio) {
							H_default.dateto = {
								Y: A_nextmonth_1st[0],
								m: A_nextmonth_1st[1],
								d: A_nextmonth_1st[2],
								H: 12
							};
						}
					} else {
						if ("not_specify" != H_default.dateradio) {
							H_default.dateto = {
								Y: A_tom[0],
								m: A_tom[1],
								d: A_tom[2],
								H: 12
							};
						}
					}
				}

				if (H_default.datechange == "") {
					H_default.datechange = {
						Y: A_tom[0],
						m: A_tom[1],
						d: A_tom[2],
						H: 12
					};
				}

				if (H_default.option == "") {
					H_default.option = this.H_View.H_opt_def;
				}

				if (H_default.waribiki == "") {
					H_default.waribiki = this.H_View.H_wari_def;
				}

				if (H_default.vodalive == "") {
					H_default.vodalive = this.H_View.H_vodalive_def;
				}

				if (H_default.vodayuryo == "") {
					H_default.vodayuryo = this.H_View.H_vodayuryo_def;
				}

				if (H_default.billaddress == "") {
					H_default.billaddress = H_addr.zip1 + "-" + H_addr.zip2 + "\n" + H_addr.addr1 + H_addr.addr2 + " " + H_addr.building + "\n" + H_view.compname + " " + H_view.posttreestr.trim();
				}

				if (H_default.sendname == "" && H_default.sendpost == "" && H_default.zip1 == "" && H_default.zip2 == "" && H_default.addr1 == "" && H_default.addr2 == "" && H_default.building == "" && H_default.sendtel == "") {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.sendname = H_view.compname;
						H_default.sendpost = H_view.posttreestr.trim();
						H_default.zip1 = H_addr.zip1;
						H_default.zip2 = H_addr.zip2;
						H_default.addr1 = H_addr.addr1;
						H_default.addr2 = H_addr.addr2;
						H_default.building = H_addr.building;
						H_default.sendtel = H_addr.telno;
					}
				}

				{
					let _tmp_4 = H_sess[OrderFormView.PUB];

					for (var key in _tmp_4) {
						var val = _tmp_4[key];

						if (true == preg_match("/^mnpno_/", key)) {
							if (H_default[key] == "") {
								H_default[key] = val;
							}
						}

						if (true == preg_match("/^mnp_enable_date_/", key)) {
							var temp = H_default[key];
							temp = temp.Y + temp.m + temp.d;

							if (temp == "") {
								H_default[key] = val;
							}
						}

						if (true == preg_match("/^formercarid_/", key)) {
							if (H_default[key] == "") {
								H_default[key] = val;
							}
						}
					}
				}
				delete H_self.carid;

				if (true == ereg("MTActorder", getcwd())) //カレントディレクトリを見る
					{
						if ("" == H_self.member) {
							if ("" != H_g_sess.personname) {
								H_default.member = H_g_sess.personname;
							}
						}

						if ("" == H_self.shopcomment) {
							H_default.shopcomment = "\u4EE3\u884C\u6CE8\u6587";
						}
					}
			} else //雛型があったら整形
			//FJP購入オーダ雛形の値を保存しておく
			//代行注文ならコメント欄にもセット
			//デフォルト値に入力値を上書きする
			{
				if (true == (undefined !== H_view.H_templatevalue) && 0 < H_view.H_templatevalue.length) {
					var H_adjusted_template = this.adjustTemplateValue(H_view.H_templatevalue, H_sess[OrderFormView.PUB].telcount);
					H_default = H_adjusted_template;
				}

				H_default.postid = H_view.recogpostid;
				H_default.ciridradio = H_sess[OrderFormView.PUB].cirid;

				if (H_adjusted_template.h_ioecode != "") {
					H_default.tmp_ioecode = H_adjusted_template.h_ioecode;
				}

				if (H_adjusted_template.pbpostcode_first != "") {
					H_default.tmp_pbpostcode_first = H_adjusted_template.pbpostcode_first;
				}

				if (H_adjusted_template.pbpostcode_second != "") {
					H_default.tmp_pbpostcode_second = H_adjusted_template.pbpostcode_second;
				}

				if (H_adjusted_template.pbpostname != "") {
					H_default.tmp_pbpostname = H_adjusted_template.pbpostname;
				}

				if (H_adjusted_template.planradio != "") {
					H_default.planradio = H_adjusted_template.planradio;
				}

				if (H_adjusted_template.packetradio != "") {
					H_default.packetradio = H_adjusted_template.packetradio;
				}

				if (H_adjusted_template.plan != "") {
					H_default.plan = H_adjusted_template.plan;
				}

				if (H_adjusted_template.packet != "") {
					H_default.packet = H_adjusted_template.packet;
				}

				if (H_adjusted_template.dateradio != "") {
					H_default.dateradio = H_adjusted_template.dateradio;
				}

				if (H_adjusted_template.datechangeradio != "") {
					H_default.datechangeradio = H_adjusted_template.datechangeradio;
				}

				if (H_adjusted_template.note != "") {
					H_default.note = H_adjusted_template.note;
				}

				if (H_adjusted_template.reason != "") {
					H_default.reason = H_adjusted_template.reason;
				}

				if (H_adjusted_template.contractor != "") {
					H_default.contractor = H_adjusted_template.contractor;
				} else {
					H_default.contractor = H_view.compname;
				}

				if (H_adjusted_template.option != "") {
					H_default.option = H_adjusted_template.option + Array.from(this.H_View.H_opt_def);
				} else {
					H_default.option = this.H_View.H_opt_def;
				}

				if (H_adjusted_template.waribiki != "") {
					H_default.waribiki = H_adjusted_template.waribiki + Array.from(this.H_View.H_wari_def);
				} else {
					H_default.waribiki = this.H_View.H_wari_def;
				}

				if (H_adjusted_template.vodalive != "") {
					H_default.vodalive = H_adjusted_template.vodalive + Array.from(this.H_View.H_vodalive_def);
				} else {
					H_default.vodalive = this.H_View.H_vodalive_def;
				}

				if (H_adjusted_template.vodayuryo != "") {
					H_default.vodayuryo = H_adjusted_template.vodayuryo + Array.from(this.H_View.H_vodayuryo_def);
				} else {
					H_default.vodayuryo = this.H_View.H_vodayuryo_def;
				}

				if (H_adjusted_template.pointradio != "") {
					H_default.pointradio = H_adjusted_template.pointradio;
				} else {
					H_default.pointradio = "maximam";
				}

				if (H_adjusted_template.billaddress != "") {
					H_default.billaddress = H_adjusted_template.billaddress;
				} else {
					H_default.billaddress = H_addr.zip1 + "-" + H_addr.zip2 + "\n" + H_addr.addr1 + H_addr.addr2 + " " + H_addr.building + "\n" + H_view.compname + " " + H_view.posttreestr.trim();
				}

				if (H_adjusted_template.sendname != "") {
					H_default.sendname = H_adjusted_template.sendname;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.sendname = H_view.compname;
					}
				}

				if (H_adjusted_template.sendpost != "") {
					H_default.sendpost = H_adjusted_template.sendpost;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.sendpost = H_view.posttreestr.trim();
					}
				}

				if (H_adjusted_template.zip1 != "") {
					H_default.zip1 = H_adjusted_template.zip1;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.zip1 = H_addr.zip1;
					}
				}

				if (H_adjusted_template.zip2 != "") {
					H_default.zip2 = H_adjusted_template.zip2;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.zip2 = H_addr.zip2;
					}
				}

				if (H_adjusted_template.addr1 != "") {
					H_default.addr1 = H_adjusted_template.addr1;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.addr1 = H_addr.addr1;
					}
				}

				if (H_adjusted_template.addr2 != "") {
					H_default.addr2 = H_adjusted_template.addr2;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.addr2 = H_addr.addr2;
					}
				}

				if (H_adjusted_template.building != "") {
					H_default.building = H_adjusted_template.building;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.building = H_addr.building;
					}
				}

				if (H_adjusted_template.sendtel != "") {
					H_default.sendtel = H_adjusted_template.sendtel;
				} else {
					if ("M" != H_sess[OrderFormView.PUB].type) {
						H_default.sendtel = H_addr.telno;
					}
				}

				if (H_adjusted_template.datefrom != "" && "" != H_adjusted_template.datefrom.Y && "" != H_adjusted_template.datefrom.m && "" != H_adjusted_template.datefrom.d) //雛型の日付が空白だったときのために条件追加 20091021miya
					{
						H_default.datefrom = H_adjusted_template.datefrom;
					} else {
					H_default.datefrom = {
						Y: A_tom[0],
						m: A_tom[1],
						d: A_tom[2],
						H: 12
					};
				}

				if (H_adjusted_template.dateto != "" && "" != H_adjusted_template.dateto.Y && "" != H_adjusted_template.dateto.m && "" != H_adjusted_template.dateto.d) //雛型の日付が空白だったときのために条件追加 20091021miya
					{
						H_default.dateto = H_adjusted_template.dateto;
					} else //プラン変更の場合は最短がデフォルト
					{
						if (true == (-1 !== ["P", "Ppl", "Pop", "Pdc"].indexOf(H_sess[OrderFormView.PUB].type))) {
							if ("" == H_default.dateradio) //雛型に入っててもデフォ値を入れてしまっていたので修正 20100311miya
								//$H_default["dateradio"] = "reserve";
								{
									H_default.dateradio = "not_specify";
								}

							H_default.dateto = {
								Y: A_nextmonth_1st[0],
								m: A_nextmonth_1st[1],
								d: A_nextmonth_1st[2],
								H: 12
							};
						} else {
							H_default.dateto = {
								Y: A_tom[0],
								m: A_tom[1],
								d: A_tom[2],
								H: 12
							};
						}
					}

				if (H_adjusted_template.datechange != "" && "" != H_adjusted_template.datechange.Y && "" != H_adjusted_template.datechange.m && "" != H_adjusted_template.datechange.d) //雛型の日付が空白だったときのために条件追加 20091021miya
					{
						H_default.datechange = H_adjusted_template.datechange;
					} else //$H_default["datechange"] = array("Y" => $A_tom[0], "m" => $A_tom[1], "d" => $A_tom[2], "H" => 12);
					//プラン変更の場合は最短がデフォルト
					{
						if (true == (-1 !== ["T", "Tpc", "Tcp", "Tcc"].indexOf(H_sess[OrderFormView.PUB].type))) {
							if ("" == H_default.datechangeradio) //雛型に入っててもデフォ値を入れてしまっていたので修正 20100311miya
								//$H_default["dateradio"] = "reserve";
								{
									H_default.datechangeradio = "not_specify";
								}

							H_default.datechange = {
								Y: A_nextmonth_1st[0],
								m: A_nextmonth_1st[1],
								d: A_nextmonth_1st[2],
								H: 12
							};
						} else {
							H_default.datechange = {
								Y: A_tom[0],
								m: A_tom[1],
								d: A_tom[2],
								H: 12
							};
						}
					}

				if (true == ereg("MTActorder", getcwd())) //カレントディレクトリを見る
					{
						if ("" != H_g_sess.personname) {
							H_default.member = H_g_sess.personname;
						}

						H_default.shopcomment = "\u4EE3\u884C\u6CE8\u6587";
					}

				if (H_adjusted_template.webreliefservice != "") {
					H_default.webreliefservice = H_adjusted_template.webreliefservice;
				} else {
					if (preg_match("/^N/", H_sess[OrderFormView.PUB].type)) {
						H_default.webreliefservice = "\u52A0\u5165\u306A\u3057";
					} else {
						H_default.webreliefservice = "stay";
					}
				}

				H_default = H_default + H_sess[OrderFormView.PUB];
			}

		if (true == (undefined !== H_sess[OrderFormView.PUB].price_detailid) && true == Array.isArray(H_sess[OrderFormView.PUB].H_product)) {
			var H_product = H_sess[OrderFormView.PUB].H_product;

			if ("" != H_product.tel.buyselid) {
				H_default.purchase = H_product.tel.buyselid;
			}

			if ("" != H_product.tel.paycnt) {
				H_default.pay_frequency = H_product.tel.paycnt;
			}
		} else //雛型が選ばれたら
			{
				if (true == (undefined !== H_view.H_templateproduct) && true == Array.isArray(H_view.H_templateproduct)) //カゴの情報
					{
						H_product = H_view.H_templateproduct;
					} else if (true == (undefined !== H_sess[OrderFormView.PUB].H_product) && 0 < H_sess[OrderFormView.PUB].H_product.length) {
					H_product = H_sess[OrderFormView.PUB].H_product;
				} else {
					H_product = Array();
				}
			}

		if (true == (undefined !== H_product)) {
			H_default.productname = H_product.tel.productname;
			H_default.productid = H_product.tel.productid;
			H_default.buyselid = H_product.tel.buyselid;
			H_default.buytype1 = H_product.tel.buytype1;
			H_default.buytype2 = H_product.tel.buytype2;
			H_default.downmoney = H_product.tel.downmoney;
			H_default.onepay = H_product.tel.onepay;
			H_default.totalprice = H_product.tel.totalprice;

			if ("" == H_default.pay_frequency && "" != H_product.tel.paycnt) {
				H_default.pay_frequency = H_product.tel.paycnt;
			}

			if ("" == H_default.purchase && "" != H_product.tel.buyselid) {
				H_default.purchase = H_product.tel.buyselid;
			}
		}

		if (!(-1 !== [this.O_Set.car_docomo, this.O_Set.car_willcom, this.O_Set.car_au, this.O_Set.car_softbank, this.O_Set.car_emobile, this.O_Set.car_smartphone].indexOf(H_sess[OrderFormView.PUB].carid))) {
			H_default.pointradio = "nouse";
		}

		if (undefined !== this.H_Local.chargermail) //POSTの値を使う
			{
				H_default.chargermail = this.H_Local.chargermail;
			} else //値がないので取得して入れる
			{
				if (!H_g_sess.userid) {
					H_default.chargermail = "";
				} else {
					var H_userinfo = O_form_model.getUserInfo(H_g_sess.pactid, H_g_sess.userid);
					H_default.chargermail = H_userinfo.mail;
				}
			}

		if (H_tmpslf.length > 0) //submitされてるので、前画面の情報を引継ぐ
			{
				if (undefined !== this.H_Local.is_not_delete_tel) {
					H_default.is_not_delete_tel = this.H_Local.is_not_delete_tel;
				}
			} else //初期値の設定
			//解約で、電話を残す設定をしている
			{
				if (-1 !== A_auth.indexOf("fnc_order_not_delete_tel_dis") && -1 !== ["D"].indexOf(H_sess[OrderFormView.PUB].type)) //初期値は残す
					{
						H_default.is_not_delete_tel = "1";
					}

				if (-1 !== A_auth.indexOf("fnc_order_not_delete_tel_etc") && -1 !== ["T", "Tcp", "Tpc", "Nmnp"].indexOf(H_sess[OrderFormView.PUB].type)) //初期値は残す
					{
						H_default.is_not_delete_tel = "1";
					}
			}

		return H_default;
	}

	makeRecogPostid(H_sess, H_g_sess) //代行注文ならordermenuで設定されたapplypostidを取得 20100608miya
	{
		if (true == ereg("MTActorder", getcwd()) && true == (undefined !== H_sess[OrderFormView.PUB].applypostid)) //このif文が不明 2013-09-17
			//ユーザ側と同じ変数にした → バグなので戻す
			//$recogpostid = $H_sess[self::PUB]["recogpostid"];
			{
				var recogpostid = H_sess[OrderFormView.PUB].applypostid;
			} else //機種変更、移行、付属品は電話の所属部署の住所を取得（付属品は電話番号入力が独立していないので除外していたが、第二階層のためにまた入れた 20060508miya）
			//解約が抜けてた！ 20100120miya
			//一件のとき→電話の所属部署を取得
			//複数件のとき→ログインユーザの部署を取得
			//※第二階層権限を持つユーザはデフォルト値を第二階層部署の住所とする	***** ←未実装 *****
			{
				var type = H_sess[OrderFormView.PUB].type;
				var telcount = H_sess[OrderFormView.PUB].telcount;
				var telinfo_postid = H_sess[OrderFormView.PUB].telinfo.telno0.postid;

				if (telinfo_postid != "" && -1 !== ["C", "S", "P", "D", "A", "M"].indexOf(type) == true && telcount == 1) {
					recogpostid = telinfo_postid;
				} else if (H_sess[OrderFormView.PUB].recogpostid != "" && -1 !== ["N", "Nmnp"].indexOf(type) == true) {
					recogpostid = H_sess[OrderFormView.PUB].recogpostid;
				} else {
					recogpostid = H_g_sess.postid;
				}
			}

		return recogpostid;
	}

	makeAddr(H_g_sess, O_form_model: OrderFormModel, H_view) //英語化権限 20090210miya
	//データ整形
	//都道府県名ファイル開いて配列作成
	//$contents = file_get_contents(KCS_DIR . "/conf/area.master");
	//$H_lines = preg_split ('/[\r\n]+/', $contents);
	//英語化に伴い都道府県モデルにした 20090402miya
	//マッチング完了フラグ 20090402miya
	//addr1に都道府県が含まれていたら、それ以外の部分を切り出してaddr2にくっつける
	{
		if (true == this.H_Dir.eng) {
			var language = "ENG";
		} else {
			language = "JPN";
		}

		var H_addr = Array();
		H_addr = O_form_model.getPostAddr(H_g_sess.pactid, H_view.recogpostid);

		for (var key in H_addr) {
			var val = H_addr[key];
			H_addr.key = val.trim();
		}

		var zip = H_addr.zip;

		if (zip != "") {
			zip = str_replace("-", "", zip);
		}

		if (zip != "" && 7 == zip.length) {
			H_addr.zip1 = zip.substr(0, 3);
			H_addr.zip2 = zip.substr(3, 4);
		}

		delete H_addr.zip;
		var O_prefmodel = new PrefectureModel();
		var H_pref = O_prefmodel.getPrefecture(language);
		var H_lines = Object.keys(H_pref);
		var H_lines_eng = Object.values(H_pref);
		var matched = false;

		if ("" != H_addr.addr1 && undefined != H_addr.addr1) //日本語でマッチング
			//日本語でマッチングしなかったら英語でマッチング 20090402miya
			{
				for (var tdfk of Object.values(H_lines)) {
					if (true == preg_match("/^" + tdfk + "/", H_addr.addr1)) //日本語で入っていた住所の県名を英語化 20090402miya
						{
							if (undefined == H_addr.addr2) {
								H_addr.addr2 = "";
							}

							H_addr.addr2 = preg_replace("/" + tdfk + "/", "", H_addr.addr1) + H_addr.addr2;

							if (true == this.H_Dir.eng) {
								H_addr.addr1 = H_pref[tdfk];
							} else {
								H_addr.addr1 = tdfk;
							}

							matched = true;
							break;
						}
				}

				if (true == this.H_Dir.eng && false == matched) {
					for (var tdfk_eng of Object.values(H_lines_eng)) {
						if (true == preg_match("/^" + tdfk_eng + "/", H_addr.addr1)) //都道府県の配列を反転して、英名から日本語名を引く 20090402miya
							{
								if (undefined == H_addr.addr2) {
									H_addr.addr2 = "";
								}

								H_addr.addr2 = preg_replace("/" + tdfk_eng + "/", "", H_addr.addr1) + H_addr.addr2;
								var H_pref_flip = array_flip(H_pref);
								H_addr.addr1 = H_pref_flip[tdfk_eng];
								matched = true;
								break;
							}
					}
				}
			}

		return H_addr;
	}

	makePosttreeband(H_sess, H_g_sess, H_view, A_auth = Array()) //第二階層権限
	//部署ツリー文字列の中身と会社名が同じだったら部署ツリー文字列消す
	{
		this.H_View.O_PostUtil = new MtPostUtil();

		if (-1 !== A_auth.indexOf("fnc_not_view_root") == true) //部署ツリー文字列
			//第二階層部署IDを取得
			{
				var rootpostid = this.H_View.O_PostUtil.getTargetLevelPostid(H_view.recogpostid, 1);
			}

		if ("" == rootpostid) {
			rootpostid = H_view.rootpostid;
		}

		var posttreestr = this.H_View.O_PostUtil.getPosttreeband(H_g_sess.pactid, rootpostid, H_view.recogpostid, "", " ", "", 0, true, false);

		if (posttreestr == H_view.postname) {
			posttreestr = "";
		}

		if ("" != H_view.compname && "" != posttreestr) {
			posttreestr = str_replace(H_view.compname, "", posttreestr);
		}

		return posttreestr;
	}

	makeCompname(H_sess, H_g_sess, H_view, A_auth = Array()) //第二階層権限
	{
		var compname = H_g_sess.compname;
		this.H_View.O_PostUtil = new MtPostUtil();
		var O_post = new PostModel();

		if (-1 !== A_auth.indexOf("fnc_not_view_root") == true) {
			var rootpostid = this.H_View.O_PostUtil.getTargetLevelPostid(H_view.recogpostid, 1);

			if ("" != rootpostid) {
				var rootpostname = O_post.getPostNameOne(rootpostid);
				compname = rootpostname;
			}
		}

		return compname;
	}

	makeTomorrow(groupid = undefined) //16時以降は翌々日
	//if ( 16 <= (int)date("G") ) {
	//$tomorrow = date("Y,n,j", mktime(0,0,0,date("n"),date("j")+2,date("Y")));
	//} else {
	//$tomorrow = date("Y,n,j", mktime(0,0,0,date("n"),date("j")+1,date("Y")));
	//}
	//今日＋N営業日を算出
	{
		var groupAddDateIni = "group_add_date_" + groupid;

		if (true == this.O_Set.existsKey(groupAddDateIni) and !is_null(groupid)) {
			var addDay = 16 <= +(date("G") ? this.O_Set[groupAddDateIni] + 1 : this.O_Set[groupAddDateIni]);
		} else {
			addDay = 16 <= +(date("G") ? 2 : 1);
		}

		var O_holiday = new HolidayModel(this.O_Sess.groupid);
		var time = O_holiday.getWorkdayAfter(strtotime(date("Y-m-d")), addDay);
		var tomorrow = date("Y,n,j", time);
		var A_tom = preg_split("/,/", tomorrow);
		return A_tom;
	}

	makeNext1stDay() {
		var firstday = date("Y,n,j", mktime(0, 0, 0, date("n") + 1, 1, date("Y")));
		var A_1stday = preg_split("/,/", firstday);
		return A_1stday;
	}

	makeTelInfoDisplay(H_telinfo: {} | any[]) {
		var H_teldisplay = Array();

		if (H_telinfo.length > 0) {
			for (var key in H_telinfo) {
				var val = H_telinfo[key];
				var cnt = str_replace("telno", "", key);
				H_teldisplay[cnt] = val.telno_view;
			}
		}

		return H_teldisplay;
	}

	makeTelInfoMNPAlert(H_telinfo: {} | any[]) {
		var H_mnpalert = Array();

		if (H_telinfo.length > 0) {
			for (var key in H_telinfo) {
				var val = H_telinfo[key];
				var cnt = str_replace("telno", "", key);
				H_mnpalert[cnt] = val.mnpalert;
			}
		}

		return H_mnpalert;
	}

	makeTelPenalty(H_telinfo: {} | any[]) //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) //$penatxt5 = "※Penalty may be incurred because of the purchase date is not registered.";
			//20171005 購入日が未設定なら空欄
			{
				var penatxt0 = "\u203BPenalty may be incurred due to the applied billing plan.";
				var penatxt1 = "\u203BPenalty may be incurred due to the applied options and discount service.";
				var penatxt2_1 = "\u203B ";
				var penatxt2_2 = " yen of penalty may be incurred due to the applied purchase method.";
				var penatxt3 = "\u203BPenalty may be incurred due to the applied purchase method.";
				var penatxt4 = "\u203BPenalty may be incurred because of the purchase method is not registered.";
				var penatxt5 = "";
			} else //$penatxt5 = "※購入日が設定されていないため違約金が発生する可能性があります";
			{
				penatxt0 = "\u203B\u30D7\u30E9\u30F3\u306B\u3088\u308B\u9055\u7D04\u91D1\u304C\u767A\u751F\u3059\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059";
				penatxt1 = "\u203B\u30AA\u30D7\u30B7\u30E7\u30F3\u30FB\u5272\u5F15\u30B5\u30FC\u30D3\u30B9\u306B\u3088\u308B\u9055\u7D04\u91D1\u304C\u767A\u751F\u3059\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059";
				penatxt2_1 = "\u203B\u8CFC\u5165\u65B9\u5F0F\u306B\u3088\u308B\u9055\u7D04\u91D1 ";
				penatxt2_2 = " \u5186\u304C\u767A\u751F\u3059\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059";
				penatxt3 = "\u203B\u8CFC\u5165\u65B9\u5F0F\u306B\u3088\u308B\u9055\u7D04\u91D1\u304C\u767A\u751F\u3059\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059";
				penatxt4 = "\u203B\u8CB7\u3044\u65B9\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u9055\u7D04\u91D1\u304C\u767A\u751F\u3059\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059";
				penatxt5 = "";
			}

		var H_telpenalty = Array();

		if (H_telinfo.length > 0) {
			for (var key in H_telinfo) //購入日追加 20090831miya
			{
				var val = H_telinfo[key];
				var A_pena = Array();

				if (val.telno_view != "") {
					A_pena.telno_view = val.telno_view;
				} else {
					A_pena.telno_view = val.telno;
				}

				A_pena.extensionno = val.extensionno;
				A_pena.telusername = val.telusername;
				A_pena.employeecode = val.employeecode;

				if ("" != val.telorderdate) {
					A_pena.orderdate = strftime("%Y/%m/%d", strtotime(val.telorderdate));
				} else if ("" != val.orderdate) {
					A_pena.orderdate = strftime("%Y/%m/%d", strtotime(val.orderdate));
				} else if ("N" != this.H_Dir.type) {
					A_pena.orderdate = penatxt5;
				}

				if (val.penalty != undefined && true == Array.isArray(val.penalty)) {
					var A_penatxt = Array();

					if (val.penalty.plan.judge == 1) {
						A_penatxt.push(penatxt0);
					}

					if (val.penalty.option.judge == 1) {
						A_penatxt.push(penatxt1);
					}

					if (val.penalty.buyselect.judge == 1) {
						if (String(val.penalty.buyselect.charge != "")) {
							A_penatxt.push(penatxt2_1 + number_format(val.penalty.buyselect.charge) + penatxt2_2);
						} else {
							A_penatxt.push(penatxt3);
						}
					} else {
						if ("" == val.buyselid) {
							A_penatxt.push(penatxt4);
						}
					}

					if (0 < A_penatxt.length) {
						var penalty = join("<BR>", A_penatxt);
					} else {
						penalty = "&nbsp;";
					}
				} else {
					penalty = "&nbsp;";
				}

				A_pena.penalty = penalty;
				var cnt = str_replace("telno", "", key);
				H_telpenalty[cnt] = A_pena;
			}
		}

		return H_telpenalty;
	}

	adjustTemplateValue(H_value, telcount = 1) //電話の件数が0の場合、最低1（付属品のとき）
	{
		if (1 > telcount) {
			telcount = 1;
		}

		var H_adjusted = Array();

		if (true == Array.isArray(H_value)) {
			for (var key in H_value) //電話詳細のデフォルト値を件数分作成
			{
				var val = H_value[key];

				if (true == (-1 !== this.A_teldetail_colname.indexOf(key))) {
					var i = 0;

					for (i = 0;; i < telcount; i++) {
						H_adjusted[key + "_" + i] = val;
					}
				} else {
					H_adjusted[key] = val;
				}
			}
		}

		if (true == is_numeric(H_value.point)) {
			H_adjusted.point = telcount * H_value.point;
		}

		return H_adjusted;
	}

	get_View() {
		return this.H_View;
	}

	checkPointUseType(H_sess) {
		switch (H_sess.carid) {
			case this.O_Set.car_docomo:
				var A_temp = ["N", "C", "S", "Nmnp", "A"];

				if (true == (-1 !== A_temp.indexOf(H_sess.type))) {
					return true;
				}

				break;

			case this.O_Set.car_au:
				A_temp = ["N", "C", "S", "Nmnp", "A"];

				if (true == (-1 !== A_temp.indexOf(H_sess.type))) {
					return true;
				}

				break;

			case this.O_Set.car_softbank:
				A_temp = ["N", "C", "Nmnp", "A"];

				if (true == (-1 !== A_temp.indexOf(H_sess.type))) {
					return true;
				}

				break;

			case this.O_set.car_emobile:
			case this.O_set.car_willcom:
			case this.O_set.car_smartphone:
				return false;
				break;

			default:
				A_temp = ["N", "C", "Nmnp", "A"];

				if (true == (-1 !== A_temp.indexOf(H_sess.type))) {
					return true;
				}

				break;
		}

		return false;
	}

	changeTemplateValueLanguage(H_templatevalue) {
		if (true == Array.isArray(H_templatevalue) && true == (undefined !== H_templatevalue.color)) {
			if ("\u6307\u5B9A\u306A\u3057" == H_templatevalue.color.trim() || "Any Color" == H_templatevalue.color.trim()) {
				if (true == this.H_Dir.eng) {
					H_templatevalue.color = "Any Color";
				} else {
					H_templatevalue.color = "\u6307\u5B9A\u306A\u3057";
				}
			}
		}

		return H_templatevalue;
	}

	changeTemplateProductLangage(H_templateproduct) {
		if (true == Array.isArray(H_templateproduct.tel) && true == (undefined !== H_templateproduct.tel.buyselid)) {
			var O_buysel = new BuySelectModel();

			if (true == this.H_Dir.eng) {
				H_templateproduct.tel.buyselname = O_buysel.getBuySelectNameEng(H_templateproduct.tel.buyselid);
			} else {
				H_templateproduct.tel.buyselname = O_buysel.getBuySelectName(H_templateproduct.tel.buyselid);
			}
		}

		return H_templateproduct;
	}

	makeProductResetButton() //英語化権限 20090210miya
	{
		if (true == this.H_Dir.eng) {
			var resetstr = "Clear Model";
			var confirmstr = "Are you sure you want to reset the template registered model?";
		} else {
			resetstr = "\u5546\u54C1\u30AF\u30EA\u30A2";
			confirmstr = "\u73FE\u5728\u96DB\u578B\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u5546\u54C1\u3092\u30EA\u30BB\u30C3\u30C8\u3057\u307E\u3059\u3002\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F";
		}

		this.H_View.O_OrderFormUtil.O_Form.addElement("button", "productreset", resetstr, {
			onClick: "javascript:if(confirm('" + confirmstr + "')) return location.href='?pr=1'"
		});
	}

	checkTemplateRequired(H_sess: {} | any[], A_auth: {} | any[]) {
		if (-1 !== A_auth.indexOf("fnc_required_template") && -1 !== ["N", "C", "S", "P", "Nmnp", "A"].indexOf(this.H_Dir.type) && !(undefined !== H_sess.SELF.productname) && H_sess.SELF.handopen != 1 && !(undefined !== H_sess[OrderFormView.PUB].H_product.tel.productname) && !(undefined !== this.H_Dir.price_detailid) && this.H_View.H_templatelist.length > 0) {
			return true;
		}

		return false;
	}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], H_product: {} | any[], H_message: {} | any[] = Array(), H_g_sess: {} | any[] = Array(), ptuni) //プランの時だけ表示用端末買い方を取得する
	//個人別請求権限
	//公私分計権限
	//資産管理権限 20090317miya
	//$this->get_Smarty()->assign( "postname", $H_sess["SELF"]["post"]["recogpostname"] );
	//$this->get_Smarty()->assign( "boxopen", $H_sess["SELF"]["boxopen"]);
	//S178テンプレート必須化権限date 20141204
	//暫定
	//暫定
	//暫定
	//資産管理権限 20090317miya
	//直接入力は計算ボタンを消すのでprice_detailidを渡す 20091030miya
	//MotionとHotlineの表示分けのため 20100325miya
	//雛形で機種が設定されていたら機種変更できないようにする
	//承認者選択
	//権限をまるごと渡す
	//電話詳細に必須事項があるかどうか
	//雛形必須化  20141204 date
	//S224 解約注文時電話詳細項目表示 hanashima 20200717
	//if(is_null($smarty_template)){
	//$this->getOut()->displayError("ご指定の電話番号は受付ができません");
	//}
	{
		this.getOut().debugOut("view/Order/OrderFormView::displaySmarty()", false);

		if ("P" == H_sess["/MTOrder"].type) {
			var O_buysel = new BuySelectModel();

			if ("" != H_sess[OrderFormView.PUB].buyselid) {
				if (true == this.H_Dir.eng) {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectNameEng(H_sess[OrderFormView.PUB].buyselid));
				} else {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectName(H_sess[OrderFormView.PUB].buyselid));
				}
			} else {
				if (true == this.H_Dir.eng) {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectNameFromTelnoEng(H_sess["/MTOrder"].telinfo.telno0.telno));
				} else {
					this.get_Smarty().assign("buyselname", O_buysel.getBuySelectNameFromTelno(H_sess["/MTOrder"].telinfo.telno0.telno));
				}
			}
		}

		if (!(-1 !== A_auth.indexOf("fnc_chargermail_edit"))) {
			this.O_OrderForm.freeze("chargermail");
		}

		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_OrderForm.accept(O_renderer);

		if (-1 !== A_auth.indexOf("fnc_kojinbetu_vw") == true) {
			var useCharge = true;
		} else {
			useCharge = false;
		}

		if (-1 !== A_auth.indexOf("fnc_kousi") == true) {
			var kousiFlg = true;
		} else {
			kousiFlg = false;
		}

		if (-1 !== A_auth.indexOf("fnc_assets_manage_adm_co") == true) {
			var assetsFlg = true;
		} else {
			assetsFlg = false;
		}

		if (-1 !== A_auth.indexOf(OrderFormView.FNC_FJP_CO)) {
			this.get_Smarty().assign("fjpco", true);
		}

		this.get_Smarty().assign("tax", MtTax.getTaxRate());
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("postname", H_sess[OrderFormView.PUB].recogpostname);
		this.get_Smarty().assign("css", this.H_View.css);
		this.get_Smarty().assign("cssTh", this.H_View.css + "Th");
		this.get_Smarty().assign("handopen", H_sess.SELF.handopen);
		var boxopen = H_sess.SELF.boxopen;

		if (this.checkTemplateRequired(H_sess, A_auth)) {
			if (H_sess[OrderFormView.PUB].tempid == -1) //
				//$this->get_Smarty()->assign( "template_selected_error",true );
				{
					boxopen = 0;
				}

			if (H_sess[OrderFormView.PUB].tempid == "") //if( $H_sess["SELF"]["tempid"] == "" ){
				{
					this.get_Smarty().assign("invisible_car_select", true);
				}
		}

		this.get_Smarty().assign("boxopen", boxopen);
		this.get_Smarty().assign("ordinfo", H_product);
		this.get_Smarty().assign("teldisplay", this.H_View.teldisplay);
		this.get_Smarty().assign("telpenalty", this.H_View.telpenalty);
		this.get_Smarty().assign("mnpalert", this.H_View.mnpalert);

		if ("M" == H_sess[OrderFormView.PUB].type) {
			this.get_Smarty().assign("telcount", 1);
		} else {
			this.get_Smarty().assign("telcount", H_sess[OrderFormView.PUB].telcount);
		}

		this.get_Smarty().assign("telpropertyjsflg", 1);
		this.get_Smarty().assign("telproperty", "on");
		this.get_Smarty().assign("smartphone", true);
		this.get_Smarty().assign("type", H_sess[OrderFormView.PUB].type);
		this.get_Smarty().assign("carid", H_sess[OrderFormView.PUB].carid);
		this.get_Smarty().assign("cirid", H_sess[OrderFormView.PUB].cirid);
		this.get_Smarty().assign("type", H_sess[OrderFormView.PUB].type);
		this.get_Smarty().assign("point_flg", this.checkPointUseType(H_sess[OrderFormView.PUB]));
		this.get_Smarty().assign("usept", ptuni);
		this.get_Smarty().assign("H_free_acce", this.H_Dir.free_acce);
		this.get_Smarty().assign("H_message", H_message);
		this.get_Smarty().assign("pactid", H_g_sess.pactid);
		this.get_Smarty().assign("loginpostid", H_g_sess.postid);
		this.get_Smarty().assign("useCharge", useCharge);
		this.get_Smarty().assign("kousiFlg", kousiFlg);
		this.get_Smarty().assign("assetsFlg", assetsFlg);
		this.get_Smarty().assign("eng", this.H_Dir.eng);
		this.get_Smarty().assign("telusername", H_sess["/MTOrder"].telinfo.telno0.telusername);
		this.get_Smarty().assign("employeecode", H_sess["/MTOrder"].telinfo.telno0.employeecode);
		this.get_Smarty().assign("price_detailid", H_sess[OrderFormView.PUB].price_detailid);
		this.get_Smarty().assign("pacttype", H_g_sess.pacttype);
		this.get_Smarty().assign("elementDisp", this.elementDisp);

		if ("shop" == MT_SITE) //代行注文なら代行注文フラグ
			{
				this.get_Smarty().assign("title", this.H_Dir.carname + "&nbsp;" + this.H_Dir.ptnname);
				this.get_Smarty().assign("shop_submenu", this.H_View.pankuzu_link);
				this.get_Smarty().assign("shop_person", this.gSess().name + " " + this.gSess().personname);
				this.get_Smarty().assign("shopflg", 1);

				if (true == ereg("MTActorder", getcwd())) //カレントディレクトリを見る
					{
						this.get_Smarty().assign("actflg", 1);
					}
			}

		this.get_Smarty().assign("tempid", this.H_Dir.tempid);
		this.get_Smarty().assign("templatesize", this.H_View.H_templatelist.length);
		this.get_Smarty().assign("templateform", this.H_View.templateform);
		this.get_Smarty().assign("templatemask", this.H_View.H_templatemask);

		if ("" != this.H_View.H_templateproduct.tel.productname) {
			this.get_Smarty().assign("no_product_change", 1);
		}

		if ("" != H_sess[OrderFormView.PUB].frompage) {
			this.get_Smarty().assign("frompage", H_sess[OrderFormView.PUB].frompage);
		}

		if (this.O_fjp.getSendhowEdit()) {
			this.get_Smarty().assign("sendhowedit", true);
		}

		this.get_Smarty().assign("extension", this.O_fjp.getSelectExtension(H_sess[OrderFormView.PUB].type));
		this.get_Smarty().assign("userid", this.O_fjp.getClaimViewer(H_g_sess, H_g_sess, H_sess));
		this.get_Smarty().assign("fjpcommflag_value", this.H_View.H_templatevalue.fjpcommflag);

		if (-1 !== A_auth.indexOf("fnc_select_recog_mail") && undefined !== this.H_View.recog_mail_null_flg) {
			if (this.H_View.select_recog_mail_flg) //承認者選択
				//承認者がメールを受取れないフラグ(申請メール受取らない設定などの場合)
				{
					this.get_Smarty().assign("select_recog_mail_flg", true);
					this.get_Smarty().assign("recog_mail_null_flg", this.H_View.recog_mail_null_flg);
				} else {
				this.get_Smarty().assign("select_recog_mail_flg", false);
			}
		} else {
			this.get_Smarty().assign("select_recog_mail_flg", false);
		}

		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("is_view_tel_property", this.H_View.is_view_tel_property);

		if (-1 !== A_auth.indexOf("fnc_required_template")) {
			this.get_Smarty().assign("required_template", true);
		} else {
			this.get_Smarty().assign("required_template", false);
		}

		if (undefined !== this.H_View.deleteOrderDisplayTelDetaile) {
			this.get_Smarty().assign("deleteOrderDisplayTelDetaile", this.H_View.deleteOrderDisplayTelDetaile);
		}

		if (undefined !== this.H_View.orderShippingMask) {
			this.get_Smarty().assign("orderShippingMask", this.H_View.orderShippingMask);
		}

		var temps = this.gSess().getPub("/OrderAttach");

		if (!is_null(temps)) {
			if (undefined !== temps.order and Array.isArray(temps.order)) {
				this.get_Smarty().assign("fileCount", temps.length);
				this.get_Smarty().assign("tempFiles", temps);
			}
		}

		var smarty_template = this.H_View.smarty_template;
		this.get_Smarty().display(smarty_template);
	}

	endOrderFormView(orderid, orderid_disp = false, site_flg = "", frompage = "", groupid = "", mailData = undefined) //英語化権限 20090210miya
	//代行注文の場合、用途区分がある顧客かどうか判定する
	//シミュレーションからの一括プラン変更で無ければ用途区分をクリアする
	//完了画面表示
	//戻りボタンの文言
	//シミュレーションからの戻り
	//池袋でドコモなら処理を変えよう(´･ω･`)
	//超簡易処理なので、あとで必ず変更すること
	{
		if (true == this.H_Dir.eng) {
			var backbtn0 = "To Menu";
			var backbtn1 = "To Simulation";
			var outtxt0_1 = "Ordering closed for the day at ";
			var outtxt0_2 = ":00.";
			var outtxt1 = "Please note that order confirmation and transactions will be completed tomorrow or later.";
			var fintxt0_1 = "Order No.  ";
			var fintxt0_2 = " <BR>Your order or request";
			var fintxt1 = "Your order or request";
			var language = "ENG";
		} else {
			backbtn0 = "\u30E1\u30CB\u30E5\u30FC\u3078";
			backbtn1 = "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u306B\u623B\u308B";
			outtxt0_1 = "\u672C\u65E5\u306E\u53D7\u4ED8\u306F";
			outtxt0_2 = "\u6642\u3067\u7D42\u4E86\u3044\u305F\u3057\u307E\u3057\u305F\u3002";
			outtxt1 = "\u304A\u7533\u3057\u8FBC\u307F\u6234\u3044\u305F\u3054\u6CE8\u6587\u306F\u3001\u660E\u65E5\u4EE5\u964D\u306E\u300C\u53D7\u4ED8\u78BA\u8A8D\u300D\u300C\u51E6\u7406\u300D<BR>\u3068\u306A\u308A\u307E\u3059\u306E\u3067\u3054\u4E86\u627F\u6234\u304D\u307E\u3059\u3088\u3046\u304A\u9858\u3044\u7533\u3057\u4E0A\u3052\u307E\u3059\u3002";
			fintxt0_1 = "\u6CE8\u6587\u756A\u53F7 ";
			fintxt0_2 = " <BR>\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C";
			fintxt1 = "\u3054\u6CE8\u6587\u30FB\u3054\u4F9D\u983C\u306E\u7533\u8ACB";
			language = "JPN";
		}

		var is_shop_division = false;

		if (undefined !== _SESSION["/MTActorder"].division && _SESSION["/MTActorder"].division.length) {
			is_shop_division = true;
		}

		this.O_Sess.clearSessionSelf();

		if (!strcmp("", frompage)) {
			delete _SESSION[SessionningOrderByCategory.NAME];
		}

		this.writeLastForm();
		var tomenu_str = backbtn0;

		if (site_flg == OrderFormView.SITE_SHOP) //代行注文なら代行注文メニュー
			{
				if (true == ereg("MTActorder", getcwd())) //カレントディレクトリを見る
					//用途区分があれば、戻り先に顧客クリアを指示する
					{
						if (is_shop_division) {
							var menu = "/Shop/MTActorder/menu.php?clear=1";
						} else {
							menu = "/Shop/MTActorder/ordermenu.php";
						}

						tomenu_str = "\u4EE3\u884C\u6CE8\u6587\u30E1\u30CB\u30E5\u30FC\u3078";
					} else {
					menu = "/Shop/menu.php";
				}
			} else {
			menu = "/Menu/menu.php";
		}

		if ("" != frompage) {
			menu = frompage;
			tomenu_str = backbtn1;
		}

		var outtxtafter = "";

		if (this.isIkebukuro(groupid, this.H_Dir.shopid) && this.H_Dir.carid == 1) //池袋でドコモの場合、受付時間が15時終わり
			//ここで終わり
			{
				var limittime = 15;

				if (limittime <= +date("G")) {
					outtxtafter = "</font></h2><h3><font color='red'>" + "\u5546\u54C1\u3092\u4F34\u3046\u3054\u6CE8\u6587\u306F15\u6642\u3067\u7D42\u4E86\u3044\u305F\u3057\u307E\u3057\u305F<br>" + "\u5546\u54C1\u3092\u4F34\u308F\u306A\u3044\u3054\u6CE8\u6587\u306F16\u6642\u3067\u7D42\u4E86\u3044\u305F\u3057\u307E\u3059" + " </h3>" + "</font><font><h2>";
				}
			} else //このif文の中身が通常処理です
			//受付時間の取得
			//完了画面に出すメッセージ（フォントのサイズ、色をタグで指定している）
			{
				limittime = this.getReceptionTimeLimit(groupid, this.H_Dir.shopid, this.H_Dir.carid);

				if (limittime <= +date("G")) {
					outtxtafter = "</font></h2><h3><font color='red'>" + outtxt0_1 + limittime + outtxt0_2 + "</h3>\n\t\t\t\t<font size=2><BR>" + outtxt1 + "</font></font><font><h2>";
				}
			}

		if (true == orderid_disp) {
			var fintxt = fintxt0_1 + str_pad(orderid, 10, "0", STR_PAD_LEFT) + fintxt0_2;
		} else {
			fintxt = fintxt1;
			outtxtafter = "";
		}

		if (!!mailData) //注文時メール配信機能 20200316 hanashima
			{
				this.displayFinishWithSendMail(fintxt, menu, tomenu_str, outtxtafter, language, mailData);
			} else {
			var O_finish = new ViewFinish();
			O_finish.displayFinish(fintxt, menu, tomenu_str, outtxtafter, language);
		}
	}

	getReceptionTimeLimit(groupid, shopid, carid = 0) //INIファイルから販売店ごとのlimittimeを取得
	{
		var limittime = 23;
		var shop_order_limittime_ini = "shop_order_limittime_" + shopid;

		if (true == this.O_Set.existsKey(shop_order_limittime_ini)) {
			limittime = this.O_Set[shop_order_limittime_ini];
		} else //販売店の設定がなければグループ設定を取得
			{
				var group_order_limittime_ini = "group_order_limittime_" + groupid;

				if (true == this.O_Set.existsKey(group_order_limittime_ini)) //なければデフォルト設定
					{
						limittime = this.O_Set[group_order_limittime_ini];
					} else {
					limittime = this.O_Set.default_order_limittime;
				}
			}

		return limittime;
	}

	isIkebukuro(groupid, shopid) //kcsの人のみ対象
	//池袋民？
	{
		if (groupid != 1) {
			return false;
		}

		if (!this.O_Set.existsKey("shop_ikebukuro")) //池袋の民の設定されてない
			{
				return false;
			}

		var shopid_list = this.O_Set.shop_ikebukuro.split(",");

		if (-1 !== shopid_list.indexOf(shopid)) {
			return true;
		}

		return false;
	}

	dealingWithIkebururo(ordertype, H_items, groupid) //池袋、超簡易対応
	//後々、ショップごとに切替時間を設定できる機能を追加したほうがよろしいかと・・。
	//ドコモ以外ならそのまま返す
	{
		if (this.H_Dir.carid != 1) {
			return H_items;
		}

		if (!(-1 !== ["Nmnp", "C", "S"].indexOf(ordertype))) {
			return H_items;
		}

		if (!this.isIkebukuro(groupid, this.H_Dir.shopid)) {
			return H_items;
		}

		for (var key in H_items) //切替開始時間以外はcontinue
		//シリアライズして上書き
		//変更したので終わり
		{
			var value = H_items[key];

			if (value.inputname != "datechange") {
				continue;
			}

			var temp = unserialize(value.property);
			temp.maxHour = 16;
			H_items[key].property = serialize(temp);
			break;
		}

		return H_items;
	}

	displayFinishWithSendMail(message, backurl, buttonstr, outtxtafter, language = "JPN", mailData = undefined) //フォーム送信許可
	//画面出力
	{
		this.clearLastForm();
		var site = "user";

		if (true == preg_match("/^\\/Admin/", _SERVER.PHP_SELF)) {
			this.get_Smarty().assign("finish_site", "admin");
		} else if (true == preg_match("/^\\/Shop/", _SERVER.PHP_SELF)) {
			this.get_Smarty().assign("finish_site", "shop");
		}

		this.get_Smarty().assign("Message", message);
		this.get_Smarty().assign("BackUrl", backurl);
		this.get_Smarty().assign("BackBtn", buttonstr);
		this.get_Smarty().assign("OutTxtAfter", outtxtafter);
		this.get_Smarty().assign("MailData", mailData);
		var tpl = KCS_DIR + "/template";
		tpl += language == "ENG" ? "/eng/" : "/";
		tpl += "MTOrder/finish_with_send_mail.tpl";
		this.get_Smarty().display(tpl);
	}

	__destruct() {
		super.__destruct();
	}

};