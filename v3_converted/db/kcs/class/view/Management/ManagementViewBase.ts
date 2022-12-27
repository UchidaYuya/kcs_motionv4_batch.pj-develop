//
//管理情報Viewの基底クラス
//
//更新履歴：<br>
//2008/03/14 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/14
//@filesource
//@uses MtSetting
//@uses MtSession
//
//
//error_reporting(E_ALL);
//
//管理情報Viewの基底クラス
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2008/03/14
//@uses MtSetting
//@uses MtSession
//

require("view/ViewSmarty.php");

require("MtSetting.php");

require("MtOutput.php");

require("MtSession.php");

require("ManagementUtil.php");

require("view/QuickFormUtil.php");

require("view/Rule/ManagementRule.php");

require("HTML/QuickForm/Renderer/ArraySmarty.php");

require("model/Management/Assets/ManagementAssetsModel.php");

require("MtUniqueString.php");

//
//ディレクトリ名
//
//
//電話管理プルダウン初期値
//
//
//管理種別ID
//
//VOLTA対応 s.maeda 2010/07/15
//
//予約モード
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
//
//ページ固有のセッションを格納する配列
//
//@var mixed
//@access protected
//
//
//表示に使う要素を格納する配列
//
//@var mixed
//@access protected
//
//
//セッティングオブジェクト
//
//@var mixed
//@access protected
//
//
//ユーザ設定項目
//
//@var mixed
//@access protected
//
//
//日付
//
//@var mixed
//@access protected
//
//
//コンストラクタ <br>
//
//@author houshiyama
//@since 2008/03/03
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//セッションのpactidを返す
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
//セッションのpostidを返す
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
//
//ローカルセッションを取得する
//
//@author houshiyama
//@since 2008/03/11
//
//@access public
//@return void
//
//
//表示に使用する物を格納する配列を返す
//
//@author houshiyama
//@since 2008/03/07
//
//@access public
//@return mixed
//
//
//ユーザ設定項目のフォーム用配列生成
//
//@author houshiyama
//@since 2008/03/21
//
//@param mixed $H_prop
//@param mixed $H_date
//@access protected
//@return array
//
//
//ユーザ設定項目のルール用配列生成
//
//@author houshiyama
//@since 2008/03/21
//
//@param mixed $H_prop
//@access protected
//@return array
//
//
//ユーザ設定項目のルール用配列生成
//
//@author date
//@since 2014/11/12
//
//@param mixed $H_prop
//@access protected
//@return array
//
//
//ユーザ設定項目を項目毎の配列にする
//
//@author houshiyama
//@since 2008/03/25
//
//@param mixed $H_prop
//@access protected
//@return void
//
//
//表示しているものが当月ならばtrue <br>
//表示しているものが当月以外ならばfalse <br>
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $cym
//@access protected
//@return void
//
//
//削除フォーム用のルール作成（基本やる事はない）
//
//@author houshiyama
//@since 2008/06/19
//
//@param mixed $O_manage
//@param mixed $O_model
//@param mixed $H_sess
//@access public
//@return void
//
//
//電話新規登録、変更フォーム要素作成
//
//@author houshiyama
//@since 2008/05/30
//
//@param mixed $O_manage
//@param mixed $O_model
//@param array $H_sess
//@access protected
//@return void
//
//
//電話新規登録、変更フォームのルール取得
//
//@author houshiyama
//@since 2008/05/30
//
//@access protected
//@return void
//
//
//ETCカード新規登録、変更フォーム要素作成
//
//@author houshiyama
//@since 2008/04/02
//
//@param mixed $O_manage
//@param mixed $O_model
//@param mixed $H_sess
//@access protected
//@return void
//
//
//ETC新規登録、変更フォームのルール取得
//
//@author houshiyama
//@since 2008/04/03
//
//@access protected
//@return void
//
//
//FJP新規登録、変更フォームのルール取得
//
//@author ishizaki
//@since 2011/08/22
//
//@access protected
//@return void
//
//
//購買ID新規登録、変更フォーム要素作成
//
//@author houshiyama
//@since 2008/04/02
//
//@param mixed $O_manage
//@param mixed $O_model
//@access protected
//@return void
//
//
//購買ID新規登録、変更フォームのルール取得
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//コピー機新規登録、変更フォーム要素作成
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $O_manage
//@param mixed $O_model
//@access protected
//@return void
//
//
//コピー機ID新規登録、変更フォームのルール取得
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//資産新規登録、変更フォーム要素作成（資産管理用）
//
//@author houshiyama
//@since 2008/05/14
//
//@param mixed $O_manage
//@param mixed $O_model
//@param array $H_sess
//@access protected
//@return void
//
//
//FJP項目の新規登録、変更フォーム要素作成
//
//@author ishizaki
//@since 2011/05/31
//
//@access protected
//@return array
//
//
//電話管理新規登録・変更の用途区分フォーム取得
//
//@author ishizaki
//@since 2013/09/11
//
//@access protected
//@return void
//
//
//電話管理新規登録・変更の用途区分フォームのルール取得
//
//@author ishizaki
//@since 2013/09/19
//
//@access protected
//@return void
//
//
//資産新規登録、変更フォームのルール取得（資産管理用）
//
//@author houshiyama
//@since 2008/08/18
//
//@access protected
//@return void
//
//
//運送ID新規登録、変更フォーム要素作成
//
//@author houshiyama
//@since 2010/02/19
//
//@param mixed $O_manage
//@param mixed $O_model
//@access protected
//@return void
//
//
//運送ID新規登録、変更フォームのルール取得
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//EV ID新規登録フォーム要素作成
//
//@author maeda
//@since 2010/07/23
//
//@param mixed $O_manage
//@param mixed $O_model
//@access protected
//@return void
//
//
//EV ID新規登録フォームのルール取得
//
//@author maeda
//@since 2010/07/23
//
//@access protected
//@return void
//
//
//EV ID変更フォーム要素作成
//
//@author maeda
//@since 2010/08/04
//
//@param mixed $O_manage
//@param mixed $O_model
//@access protected
//@return void
//
//
//EV ID変更フォームのルール取得
//
//@author maeda
//@since 2010/08/04
//
//@access protected
//@return void
//
//
//ヘルスケアID新規登録、変更フォーム要素作成
//
//@author date
//@since 2015/06/08
//
//@param mixed $O_manage
//@param mixed $O_model
//@access protected
//@return void
//
//
//運送ID新規登録、変更フォームのルール取得
//
//@author houshiyama
//@since 2008/04/02
//
//@access protected
//@return void
//
//
//最低限必要なセッション情報が無ければエラー表示
//
//@author houshiyama
//@since 2008/04/04
//
//@param mixed $H_sess
//@param mixed $H_g_sess
//@access protected
//@return void
//
//
//管理毎のスタイルシートを決定する
//
//@author houshiyama
//@since 2008/03/27
//
//@param mixed $mid
//@access protected
//@return void
//
//
//カンマ区切りの文字列をグループチェックボックス用の配列にする
//
//@author houshiyama
//@since 2008/06/11
//
//@param mixed $str
//@access public
//@return void
//
//
//予約種別フラグを日本語に変換
//
//@author houshiyama
//@since 2008/08/28
//
//@param mixed $flg
//@access public
//@return void
//
//
//予約種別フラグを英語に変換
//
//@author houshiyama
//@since 2009/04/14
//
//@param mixed $flg
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return void
//
class ManagementViewBase extends ViewSmarty {
		static PUB = "/Management";
		static TEL_SELECT_TOP = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
		static TEL_SELECT_DEFAULT = "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
		static TEL_SELECT_TOP_ENG = "--Please select--";
		static TEL_SELECT_DEFAULT_ENG = "--please select a carrier--";
		static TELMID = 1;
		static ETCMID = 2;
		static PURCHMID = 3;
		static COPYMID = 4;
		static ASSMID = 5;
		static TRANMID = 6;
		static EVMID = 7;
		static HEALTHMID = 8;
		static ADDMODE = 0;
		static MODMODE = 1;
		static MOVEMODE = 2;
		static DELMODE = 3;

		constructor() {
				this.O_Sess = MtSession.singleton();
				var H_param = Array();
				H_param.language = this.O_Sess.language;
				super(H_param);
				this.H_Dir = this.O_Sess.getPub(ManagementViewBase.PUB);
				this.H_Local = this.O_Sess.getSelfAll();
				this.O_Set = MtSetting.singleton();
				this.Now = this.getDateUtil().getNow();
				this.Today = this.getDateUtil().getToday();
				this.A_Time = split("-| |:", this.Now);
				this.YM = this.A_Time[0] + this.A_Time[1];

				if (is_numeric(this.O_Sess.pactid) == true) {
						this.O_Auth = MtAuthority.singleton(this.O_Sess.pactid);
				} else {
						this.errorOut(10, "\u30BB\u30C3\u30B7\u30E7\u30F3\u306Bpactid\u304C\u7121\u3044", false);
				}
		}

		get_Pactid() {
				return this.pactid;
		}

		get_Postid() {
				return this.postid;
		}

		getLocalSession() {
				var H_sess = {
						[ManagementViewBase.PUB]: this.O_Sess.getPub(ManagementViewBase.PUB),
						SELF: this.O_Sess.getSelfAll()
				};
				return H_sess;
		}

		get_View() {
				return this.H_View;
		}

		makePropertyForm(H_prop, H_date, H_sess = undefined) {
				var A_propform = Array();

				for (var name in H_prop) {
						var label = H_prop[name];

						if (preg_match("/^date/", name) == true) {
								var A_tmp = {
										name: name,
										label: label,
										inputtype: "date",
										data: H_date
								};
						} else if (preg_match("/^int/", name) == true) {
								A_tmp = {
										name: name,
										label: label,
										inputtype: "text",
										options: {
												id: name,
												size: 35,
												maxlength: "9"
										}
								};
						} else if (preg_match("/^select/", name) == true) {
								var temp = label.split(":");

								var _items = temp[1].split(",");

								var items = {
										"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"
								};
								var selected = H_sess[SELF].post[name];

								for (var key in _items) {
										var value = _items[key];
										items[value] = value;
								}

								if (!is_null(selected)) {
										if (!(-1 !== items.indexOf(selected))) {
												items = array_merge(items, {
														[selected]: selected
												});
										}
								}

								A_tmp = {
										name: name,
										label: temp[0],
										inputtype: "select",
										data: items,
										options: {
												id: name
										}
								};
						} else {
								A_tmp = {
										name: name,
										label: label,
										inputtype: "text",
										options: {
												id: name,
												size: 35
										}
								};
						}

						A_propform.push(A_tmp);
				}

				return A_propform;
		}

		makePropertyRule(H_prop) {
				var A_proprule = Array();

				for (var name in H_prop) //表示言語分岐
				{
						var label = H_prop[name];

						if (this.O_Sess.language == "ENG") {
								if (preg_match("/^int/", name) == true) {
										var A_tmp = {
												name: name,
												mess: "Please enter for " + label + " half-wide letter",
												type: "QRIntNumeric",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);
								} else if (preg_match("/^date/", name) == true) {
										A_tmp = {
												name: name,
												mess: "Please select the date for" + label,
												type: "QRCheckdate",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);
								} else if (preg_match("/^mail/", name) == true) {
										A_tmp = {
												name: name,
												mess: "Please enter " + label + " as email address format",
												type: "email",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);
								} else if (preg_match("/^url/", name) == true) {
										A_tmp = {
												name: name,
												mess: "Please enter " + label + " as URL format",
												type: "regex",
												format: "/^(file|ldap|http|https|ftp):\\/\\/(([-a-z0-9])+\\.)+([a-z]{2,6}|([a-z\\/]+[a-z\\/]{2,6}))$/",
												validation: "client"
										};
										A_proprule.push(A_tmp);
								}
						} else {
								if (preg_match("/^int/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
												type: "QRIntNumeric",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);
								} else if (preg_match("/^date/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002",
												type: "QRCheckdate",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);
								} else if (preg_match("/^mail/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
												type: "email",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);
								} else if (preg_match("/^url/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306FURL\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
												type: "regex",
												format: "/^(file|ldap|http|https|ftp):\\/\\/(([-a-z0-9])+\\.)+([a-z]{2,6}|([a-z\\/]+[a-z\\/]{2,6}))$/",
												validation: "client"
										};
										A_proprule.push(A_tmp);
								}
						}
				}

				return A_proprule;
		}

		makePropertyRule2(H_prop) {
				var A_proprule = Array();

				for (var key in H_prop) //表示言語分岐
				{
						var value = H_prop[key];
						var name = key;
						var label = value.colname;
						var required = value.requiredflg;

						if (this.O_Sess.language == "ENG") {
								if (preg_match("/^int/", name) == true) {
										var A_tmp = {
												name: name,
												mess: "Please enter for " + label + " half-wide letter",
												type: "QRIntNumeric",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + ": Please enter.",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^date/", name) == true) {
										A_tmp = {
												name: name,
												mess: "Please select the date for" + label,
												type: "QRCheckdate",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + ": Please enter.",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
												A_proprule.push({
														name: name,
														mess: label + ": Please enter.",
														type: "QRCheckDateEmptyYMD",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^mail/", name) == true) {
										A_tmp = {
												name: name,
												mess: "Please enter " + label + " as email address format",
												type: "email",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + ": Please enter.",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^url/", name) == true) {
										A_tmp = {
												name: name,
												mess: "Please enter " + label + " as URL format",
												type: "regex",
												format: "/^(file|ldap|http|https|ftp):\\/\\/(([-a-z0-9])+\\.)+([a-z]{2,6}|([a-z\\/]+[a-z\\/]{2,6}))$/",
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + ": Please enter.",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^text/", name) == true) {
										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + ": Please enter.",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^select/", name) == true) {
										if (required == true) {
												var temp = label.split(":");
												A_proprule.push({
														name: name,
														mess: temp[0] + ": Please select.",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								}
						} else {
								if (preg_match("/^int/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306F\u534A\u89D2\u6570\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
												type: "QRIntNumeric",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + "\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^date/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306F\u5E74\u6708\u65E5\u3092\u5168\u3066\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u51FA\u6765\u307E\u305B\u3093\u3002",
												type: "QRCheckdate",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + "\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
												A_proprule.push({
														name: name,
														mess: label + "\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
														type: "QRCheckDateEmptyYMD",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^mail/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
												type: "email",
												format: undefined,
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + "\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^url/", name) == true) {
										A_tmp = {
												name: name,
												mess: label + "\u306FURL\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
												type: "regex",
												format: "/^(file|ldap|http|https|ftp):\\/\\/(([-a-z0-9])+\\.)+([a-z]{2,6}|([a-z\\/]+[a-z\\/]{2,6}))$/",
												validation: "client"
										};
										A_proprule.push(A_tmp);

										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + "\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^text/", name) == true) {
										if (required == true) {
												A_proprule.push({
														name: name,
														mess: label + "\u3092\u5165\u529B\u3057\u3066\u4E0B\u3055\u3044",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								} else if (preg_match("/^select/", name) == true) {
										if (required == true) {
												temp = label.split(":");
												A_proprule.push({
														name: name,
														mess: temp[0] + "\u3092\u9078\u629E\u3057\u3066\u4E0B\u3055\u3044",
														type: "required",
														format: undefined,
														validation: "client",
														reset: false,
														force: false
												});
										}
								}
						}
				}

				return A_proprule;
		}

		makeSearchPropertyElement(H_prop) //表示言語分岐
		{
				var H_res = Array();

				if (this.O_Sess.language == "ENG") //20150305　プルダウン漏れ
						{
								var H_text = {
										"": ManagementViewBase.TEL_SELECT_TOP_ENG
								};
								var H_int = {
										"": ManagementViewBase.TEL_SELECT_TOP_ENG
								};
								var H_date = {
										"": ManagementViewBase.TEL_SELECT_TOP_ENG
								};
								var H_mail = {
										"": ManagementViewBase.TEL_SELECT_TOP_ENG
								};
								var H_url = {
										"": ManagementViewBase.TEL_SELECT_TOP_ENG
								};
								var H_select = {
										"": ManagementViewBase.TEL_SELECT_TOP_ENG
								};
						} else //20150305    プルダウン漏れ
						{
								H_text = {
										"": ManagementViewBase.TEL_SELECT_TOP
								};
								H_int = {
										"": ManagementViewBase.TEL_SELECT_TOP
								};
								H_date = {
										"": ManagementViewBase.TEL_SELECT_TOP
								};
								H_mail = {
										"": ManagementViewBase.TEL_SELECT_TOP
								};
								H_url = {
										"": ManagementViewBase.TEL_SELECT_TOP
								};
								H_select = {
										"": ManagementViewBase.TEL_SELECT_TOP
								};
						}

				for (var name in H_prop) //文字列プルダウン作成
				{
						var label = H_prop[name];

						if (preg_match("/^text/", name) == true) {
								H_text[name] = label;
						} else if (preg_match("/^int/", name) == true) {
								H_int[name] = label;
						} else if (preg_match("/^date/", name) == true) {
								H_date[name] = label;
						} else if (preg_match("/^mail/", name) == true) {
								H_mail[name] = label;
						} else if (preg_match("/^url/", name) == true) //URLプルダウン作成
								{
										H_url[name] = label;
								} else if (preg_match("/^select/", name) == true) {
								H_select[name] = label;
						}
				}

				H_res.text = H_text;
				H_res.int = H_int;
				H_res.date = H_date;
				H_res.mail = H_mail;
				H_res.url = H_url;
				H_res.select = H_select;
				return H_res;
		}

		getThisMonthFlg(cym) {
				if (this.YM == cym) {
						return true;
				} else {
						return false;
				}
		}

		makeDelRule(O_manage, O_model, H_sess) {}

		getTelAddModFormElement(O_manage, O_model, H_sess) //関連項目の数
		//キャリア取得
		//キャリアの指定がある時
		//表示言語分岐
		//ユーザ設定項目を取得する
		//使用者名の背景を灰色にするぽよ
		//$username_background = in_array( "fnc_tel_username_gray", $O_model->A_Auth ) ? "#ebebe4;" : "white;";
		//表示言語分岐
		//ユニーク文字列生成用
		{
				this.H_View.reltelcnt = 1;
				var H_car = O_model.getCarrierData();

				if (undefined !== H_sess.SELF.post.carid == true && H_sess.SELF.post.carid != "") //回線の指定あり
						//購入方式の指定あり
						//購入方式取得
						//プラン取得
						//パケット取得
						//ポイントサービス取得
						//割引サービス取得
						//オプション取得
						//地域会社取得
						//公私権限あり
						{
								var carid = H_sess.SELF.post.carid;
								var cirid = "";

								if (undefined !== H_sess.SELF.post.cirid == true && H_sess.SELF.post.cirid != "") {
										cirid = H_sess.SELF.post.cirid;
								}

								var buyselid = "";

								if (undefined !== H_sess.SELF.post.buyselid == true && H_sess.SELF.post.buyselid != "") {
										buyselid = H_sess.SELF.post.buyselid;
								}

								var past = false;

								if (H_sess[ManagementViewBase.PUB].cym != date("Ym")) {
										past = true;
								}

								var H_cir = O_model.getCircuitData(carid);
								var H_buysel = O_model.getBuySelData(carid);
								var H_plan = O_model.getPlanData(carid, cirid, buyselid, past, H_sess.SELF.post.planid);
								var H_packet = O_model.getPacketData(carid, cirid, past, H_sess.SELF.post.packetid);
								var H_point = O_model.getPointData(carid, cirid);
								var H_discount = O_model.getDiscountData(carid, cirid, past);
								var H_option = O_model.getOptionData(carid, cirid, past);
								var H_area = O_model.getAreaData(carid);

								if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
										var H_kousi = O_model.getKousiPtnData(this.O_Sess.pactid, carid, cirid);
								}

								var H_webrelief = Array();

								if (4 == carid) {
										H_webrelief = O_model.getWebReliefService();
								}
						} else //表示言語分岐
						{
								if (this.O_Sess.language == "ENG") //回線種別の配列を生成
										//購入方式の配列を生成
										//プランの配列を生成
										//パケットの配列を生成
										//ポイントサービスの配列を生成
										//割引サービスの配列を生成
										//オプションの配列を生成
										//地域会社の配列を生成
										//公私権限あり
										{
												H_cir = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
												};
												H_buysel = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
												};
												H_plan = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
												};
												H_packet = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
												};
												H_point = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
												};
												H_discount = Array();
												H_option = Array();
												H_area = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
												};

												if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
														H_kousi = {
																"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
														};
												}

												H_webrelief = Array();
										} else //回線種別の配列を生成
										//購入方式の配列を生成
										//プランの配列を生成
										//パケットの配列を生成
										//ポイントサービスの配列を生成
										//割引サービスの配列を生成
										//オプションの配列を生成
										//地域会社の配列を生成
										//公私権限あり
										{
												H_cir = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT
												};
												H_buysel = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT
												};
												H_plan = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT
												};
												H_packet = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT
												};
												H_point = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT
												};
												H_discount = Array();
												H_option = Array();
												H_area = {
														"": ManagementViewBase.TEL_SELECT_DEFAULT
												};

												if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
														H_kousi = {
																"": ManagementViewBase.TEL_SELECT_DEFAULT
														};
												}

												H_webrelief = Array();
										}
						}

				if (this.O_Sess.language == "ENG") //日付型のフォーマット配列を生成
						{
								var H_date = O_manage.getDateFormatEng();
								var H_datex = O_manage.getDateFormatEng(undefined, 1);
								var H_datey = O_manage.getDateFormatEng("1979", 1);
						} else //日付型のフォーマット配列を生成
						{
								H_date = O_manage.getDateFormat();
								H_datex = O_manage.getDateFormat(undefined, 1);
								H_datey = O_manage.getDateFormat("1979", 1);
						}

				this.H_Prop = O_model.getManagementProperty(ManagementViewBase.TELMID);
				this.H_Prop2 = O_model.getManagementPropertyForRequired(ManagementViewBase.TELMID);
				var username_background = -1 !== O_model.A_Auth.indexOf("fnc_tel_username_gray") ? "lightgray;" : "white;";

				if (this.O_Sess.language == "ENG") //フォーム要素の配列作成
						//公私権限あり
						{
								var A_formelement = [{
										name: "telno_view",
										label: "Phone number",
										inputtype: "text",
										options: {
												id: "telno_view",
												size: "35"
										}
								}, {
										name: "mail",
										label: "E-mail address",
										inputtype: "text",
										options: {
												id: "mail",
												size: "35"
										}
								}, {
										name: "carid",
										label: "Carrier",
										inputtype: "select",
										data: H_car,
										options: {
												id: "carid",
												onChange: "javascript:execTelAjax('carid');"
										}
								}, {
										name: "cirid",
										label: "Service type",
										inputtype: "select",
										data: H_cir,
										options: {
												id: "cirid",
												onChange: "javascript:execTelAjax('cirid');"
										}
								}, {
										name: "ciraj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "ciraj"
										}
								}, {
										name: "buyselid",
										label: "Payment method",
										inputtype: "select",
										data: H_buysel,
										options: {
												id: "buyselid",
												onChange: "javascript:execTelAjax('buyselid');"
										}
								}, {
										name: "buyselaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "buyselaj"
										}
								}, {
										name: "planid",
										label: "Billing plan",
										inputtype: "select",
										data: H_plan,
										options: {
												id: "planid",
												onChange: "javascript:setHiddenValue('plan');"
										}
								}, {
										name: "planaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "planaj"
										}
								}, {
										name: "packetid",
										label: "Packetpack",
										inputtype: "select",
										data: H_packet,
										options: {
												id: "packetid",
												onChange: "javascript:setHiddenValue('packet');"
										}
								}, {
										name: "packetaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "packetaj"
										}
								}, {
										name: "pointid",
										label: "Point service",
										inputtype: "select",
										data: H_point,
										options: {
												id: "pointid",
												onChange: "javascript:setHiddenValue('point');"
										}
								}, {
										name: "pointaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "pointaj"
										}
								}, {
										name: "arid",
										label: "Region",
										inputtype: "select",
										data: H_area,
										options: {
												id: "arid",
												onChange: "javascript:setHiddenValue('ar');"
										}
								}, {
										name: "araj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "araj"
										}
								}, {
										name: "discountid",
										label: "Discount service",
										inputtype: "groupcheckbox",
										data: H_discount,
										options: {
												onChange: "javascript:setHiddenCheckBox('discount', this.name);"
										}
								}, {
										name: "discountaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "discountaj"
										}
								}, {
										name: "opid",
										label: "Option",
										inputtype: "groupcheckbox",
										data: H_option,
										options: {
												onChange: "javascript:setHiddenCheckBox('op', this.name);"
										}
								}, {
										name: "opaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "opaj"
										}
								}, {
										name: "username",
										label: "User",
										inputtype: "text",
										options: {
												id: "username",
												size: "35",
												style: "background-color:" + username_background
										}
								}, {
										name: "employeecode",
										label: "Employee number",
										inputtype: "text",
										options: {
												id: "employeecode",
												size: "35"
										}
								}, {
										name: "contractdate",
										label: "Contracted date",
										inputtype: "date",
										data: H_datey
								}, {
										name: "orderdate",
										label: "Date of purchase of latest model",
										inputtype: "date",
										data: H_datex
								}, {
										name: "simcardno",
										label: "USIM number",
										inputtype: "text",
										options: {
												id: "simcardno",
												size: "35"
										}
								}, {
										name: "memo",
										label: "Memo",
										inputtype: "textarea",
										options: {
												id: "memo",
												cols: "35",
												rows: "5"
										}
								}, {
										name: "cancel",
										label: "Cancel",
										inputtype: "button",
										options: {
												onClick: "javascript:ask_cancel()"
										}
								}, {
										name: "reset",
										label: "Reset",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='?r=1'"
										}
								}, {
										name: "back",
										label: "To entry screen",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
										}
								}, {
										name: "recogpostid",
										label: "",
										inputtype: "hidden"
								}, {
										name: "recogpostname",
										label: "",
										inputtype: "hidden"
								}, {
										name: "get_ass_info",
										label: "Refer to handset detail from admin number ",
										inputtype: "button",
										options: {
												id: "get_ass_info",
												onClick: "return getAssetsInfo(this);"
										}
								}, {
										name: "get_ass_info_flg",
										inputtype: "hidden",
										data: "",
										options: {
												id: "get_ass_info_flg"
										}
								}, {
										name: "rel_telno_view",
										label: "Phone number",
										inputtype: "text",
										options: {
												id: "rel_telno_view",
												size: "35"
										}
								}, {
										name: "rel_carid",
										label: "Carrier",
										inputtype: "select",
										data: H_car,
										options: {
												id: "rel_carid"
										}
								}, {
										name: "webrelief",
										label: "Safeguarding",
										inputtype: "radio",
										data: H_webrelief,
										options: {
												id: "webrelief"
										}
								}, {
										name: "webreliefaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "webreliefaj"
										}
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
										var A_tmp = {
												name: "kousiflg",
												label: "Business and private classification",
												inputtype: "radio",
												data: O_manage.getKousiRadioHashEng()
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnid",
												label: "Pattern used",
												inputtype: "select",
												data: H_kousi,
												options: {
														id: "kousiptnid",
														onChange: "javascript:setHiddenValue('kousiptn');"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnaj",
												inputtype: "hidden",
												data: "",
												options: {
														id: "kousiptnaj"
												}
										};
										A_formelement.push(A_tmp);
								}

								if (-1 !== O_model.A_Auth.indexOf("fnc_kojinbetu_vw") == true) //元のユーザの指定あり
										{
												if (undefined !== H_sess.SELF.post.userid == true && H_sess.SELF.post.userid != "") {
														var H_userid = O_model.getUserSelect(H_sess.SELF.post.recogpostid, H_sess.SELF.post.userid);
												} else {
														H_userid = O_model.getUserSelect(H_sess.SELF.post.recogpostid);
												}

												A_tmp = {
														name: "userid",
														label: "Billing viewer",
														inputtype: "select",
														data: H_userid,
														options: {
																id: "userid"
														}
												};
												A_formelement.push(A_tmp);
										}

								if (-1 !== O_model.A_Auth.indexOf("fnc_extension_tel_co") == true) {
										A_tmp = {
												name: "extensionno",
												label: "\u5185\u7DDA\u756A\u53F7",
												inputtype: "text",
												options: {
														id: "extensionno",
														size: "35"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "get_extensionno",
												label: "\u81EA\u52D5\u53D6\u5F97",
												inputtype: "button",
												options: {
														id: "get_extensionno",
														onClick: "return getExtensionNo(this);"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "extensionno_submit",
												inputtype: "hidden",
												data: "",
												options: {
														id: "extensionno_submit"
												}
										};
										A_formelement.push(A_tmp);
								}

								A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date, H_sess));
						} else //フォーム要素の配列作成
						//公私権限あり
						{
								A_formelement = [{
										name: "telno_view",
										label: "\u96FB\u8A71\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "telno_view",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "mail",
										label: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
										inputtype: "text",
										options: {
												id: "mail",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "carid",
										label: "\u96FB\u8A71\u4F1A\u793E",
										inputtype: "select",
										data: H_car,
										options: {
												id: "carid",
												onChange: "javascript:execTelAjax('carid');"
										}
								}, {
										name: "cirid",
										label: "\u56DE\u7DDA\u7A2E\u5225",
										inputtype: "select",
										data: H_cir,
										options: {
												id: "cirid",
												onChange: "javascript:execTelAjax('cirid');"
										}
								}, {
										name: "ciraj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "ciraj"
										}
								}, {
										name: "buyselid",
										label: "\u8CFC\u5165\u65B9\u5F0F",
										inputtype: "select",
										data: H_buysel,
										options: {
												id: "buyselid",
												onChange: "javascript:execTelAjax('buyselid');"
										}
								}, {
										name: "buyselaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "buyselaj"
										}
								}, {
										name: "planid",
										label: "\u30D7\u30E9\u30F3",
										inputtype: "select",
										data: H_plan,
										options: {
												id: "planid",
												onChange: "javascript:setHiddenValue('plan');"
										}
								}, {
										name: "planaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "planaj"
										}
								}, {
										name: "packetid",
										label: "\u30D1\u30B1\u30C3\u30C8\u30D1\u30C3\u30AF",
										inputtype: "select",
										data: H_packet,
										options: {
												id: "packetid",
												onChange: "javascript:setHiddenValue('packet');"
										}
								}, {
										name: "packetaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "packetaj"
										}
								}, {
										name: "pointid",
										label: "\u30DD\u30A4\u30F3\u30C8\u30B5\u30FC\u30D3\u30B9",
										inputtype: "select",
										data: H_point,
										options: {
												id: "pointid",
												onChange: "javascript:setHiddenValue('point');"
										}
								}, {
										name: "pointaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "pointaj"
										}
								}, {
										name: "arid",
										label: "\u5730\u57DF\u4F1A\u793E",
										inputtype: "select",
										data: H_area,
										options: {
												id: "arid",
												onChange: "javascript:setHiddenValue('ar');"
										}
								}, {
										name: "araj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "araj"
										}
								}, {
										name: "discountid",
										label: "\u5272\u5F15\u30B5\u30FC\u30D3\u30B9",
										inputtype: "groupcheckbox",
										data: H_discount,
										options: {
												onChange: "javascript:setHiddenCheckBox('discount', this.name);"
										}
								}, {
										name: "discountaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "discountaj"
										}
								}, {
										name: "opid",
										label: "\u30AA\u30D7\u30B7\u30E7\u30F3",
										inputtype: "groupcheckbox",
										data: H_option,
										options: {
												onChange: "javascript:setHiddenCheckBox('op', this.name);"
										}
								}, {
										name: "opaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "opaj"
										}
								}, {
										name: "username",
										label: "\u4F7F\u7528\u8005\u540D",
										inputtype: "text",
										options: {
												id: "username",
												size: "35",
												maxlength: "255",
												style: " background-color:" + username_background
										}
								}, {
										name: "employeecode",
										label: "\u793E\u54E1\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "employeecode",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "contractdate",
										label: "\u5951\u7D04\u65E5",
										inputtype: "date",
										data: H_datey
								}, {
										name: "orderdate",
										label: "\u6700\u65B0\u6A5F\u7A2E\u8CFC\u5165\u65E5",
										inputtype: "date",
										data: H_datex
								}, {
										name: "simcardno",
										label: "SIM\u30AB\u30FC\u30C9\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "simcardno",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "memo",
										label: "\u30E1\u30E2",
										inputtype: "textarea",
										options: {
												id: "memo",
												cols: "35",
												rows: "5"
										}
								}, {
										name: "cancel",
										label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
										inputtype: "button",
										options: {
												onClick: "javascript:ask_cancel()"
										}
								}, {
										name: "reset",
										label: "\u30EA\u30BB\u30C3\u30C8",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='?r=1'"
										}
								}, {
										name: "back",
										label: "\u5165\u529B\u753B\u9762\u3078",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
										}
								}, {
										name: "recogpostid",
										label: "",
										inputtype: "hidden"
								}, {
										name: "recogpostname",
										label: "",
										inputtype: "hidden"
								}, {
										name: "get_ass_info",
										label: "\u7AEF\u672B\u60C5\u5831\u53D6\u5F97",
										inputtype: "button",
										options: {
												id: "get_ass_info",
												onClick: "return getAssetsInfo(this);"
										}
								}, {
										name: "get_ass_info_flg",
										inputtype: "hidden",
										data: "",
										options: {
												id: "get_ass_info_flg"
										}
								}, {
										name: "rel_telno_view",
										label: "\u96FB\u8A71\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "rel_telno_view",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "rel_carid",
										label: "\u96FB\u8A71\u4F1A\u793E",
										inputtype: "select",
										data: H_car,
										options: {
												id: "rel_carid"
										}
								}, {
										name: "webrelief",
										label: "\u30A6\u30A7\u30D6\u5B89\u5FC3\u30B5\u30FC\u30D3\u30B9",
										inputtype: "radio",
										data: H_webrelief,
										options: {
												id: "webrelief"
										}
								}, {
										name: "webreliefaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "webreliefaj"
										}
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_kousi") == true && -1 !== O_model.A_Auth.indexOf("fnc_usr_kousi") == true) {
										A_tmp = {
												name: "kousiflg",
												label: "\u516C\u79C1\u5206\u8A08",
												inputtype: "radio",
												data: O_manage.getKousiRadioHash()
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnid",
												label: "\u4F7F\u7528\u3059\u308B\u30D1\u30BF\u30FC\u30F3",
												inputtype: "select",
												data: H_kousi,
												options: {
														id: "kousiptnid",
														onChange: "javascript:setHiddenValue('kousiptn');"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "kousiptnaj",
												inputtype: "hidden",
												data: "",
												options: {
														id: "kousiptnaj"
												}
										};
										A_formelement.push(A_tmp);
								}

								if (-1 !== O_model.A_Auth.indexOf("fnc_kojinbetu_vw") == true) //元のユーザの指定あり
										{
												if (undefined !== H_sess.SELF.post.userid == true && H_sess.SELF.post.userid != "") {
														H_userid = O_model.getUserSelect(H_sess.SELF.post.recogpostid, H_sess.SELF.post.userid);
												} else {
														H_userid = O_model.getUserSelect(H_sess.SELF.post.recogpostid);
												}

												A_tmp = {
														name: "userid",
														label: "\u8ACB\u6C42\u95B2\u89A7\u8005",
														inputtype: "select",
														data: H_userid,
														options: {
																id: "userid"
														}
												};
												A_formelement.push(A_tmp);
										}

								if (-1 !== O_model.A_Auth.indexOf("fnc_extension_tel_co") == true) {
										A_tmp = {
												name: "extensionno",
												label: "\u5185\u7DDA\u756A\u53F7",
												inputtype: "text",
												options: {
														id: "extensionno",
														size: "35"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "get_extensionno",
												label: "\u81EA\u52D5\u53D6\u5F97",
												inputtype: "button",
												options: {
														id: "get_extensionno",
														onClick: "return getExtensionNo(this);"
												}
										};
										A_formelement.push(A_tmp);
										A_tmp = {
												name: "extensionno_submit",
												inputtype: "hidden",
												data: "",
												options: {
														id: "extensionno_submit"
												}
										};
										A_formelement.push(A_tmp);
								}

								A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date, H_sess));
						}

				var O_unique = MtUniqueString.singleton();

				if (!(undefined !== H_sess.SELF.post.uniqueid)) {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: O_unique.getNewUniqueId(),
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				} else {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: H_sess.SELF.post.uniqueid,
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				}

				return A_formelement;
		}

		getTelAddModFormRule(O_model = undefined) //表示言語分岐
		//20141112 S178管理項目必須化
		//$A_rule = array_merge( $A_rule, $this->makePropertyRule( $this->H_Prop ) );
		{
				if (O_model == undefined || -1 !== O_model.A_Auth.indexOf("fnc_tel_telmod") == true) {
						if (this.O_Sess.language == "ENG") {
								var A_rule1 = [{
										name: "telno_view",
										mess: "Enter Phone number",
										type: "required",
										format: undefined,
										validation: "client"
								}, {
										name: "telno_view",
										mess: "Enter Phone number",
										type: "QRalnumRegex",
										format: undefined,
										validation: "client"
								}, {
										name: "telno_view",
										mess: "Only single-byte English characters are accepted for the Phone number",
										type: "regex",
										format: "/^[A-Za-z0-9\\!\\#$\\%\\&\\(\\)\\-\\=\\^\\~\\|\\@\\`\\[\\{\\+\\*\\]\\}\\,\\<\\.\\>\\/\\?\\_\\s]+$/",
										validation: "client"
								}, {
										name: "carid",
										mess: "Select telephone carrier",
										type: "required",
										format: undefined,
										validation: "client"
								}, {
										name: "ciraj",
										mess: "Select service type",
										type: "required",
										format: undefined,
										validation: "client"
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_extension_tel_co")) {
										A_rule1.push({
												name: "extensionno",
												mess: "\u5185\u7DDA\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u3059",
												type: "regex",
												format: "/^(\\d)+$/",
												validation: "client"
										});
								}
						} else {
								A_rule1 = [{
										name: "telno_view",
										mess: "\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
										type: "required",
										format: undefined,
										validation: "client"
								}, {
										name: "telno_view",
										mess: "\u96FB\u8A71\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
										type: "QRalnumRegex",
										format: undefined,
										validation: "client"
								}, {
										name: "telno_view",
										mess: "\u96FB\u8A71\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u8A18\u53F7\u306E\u307F\u3067\u3059",
										type: "regex",
										format: "/^[A-Za-z0-9\\!\\#$\\%\\&\\(\\)\\-\\=\\^\\~\\|\\@\\`\\[\\{\\+\\*\\]\\}\\,\\<\\.\\>\\/\\?\\_\\s]+$/",
										validation: "client"
								}, {
										name: "carid",
										mess: "\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
										type: "required",
										format: undefined,
										validation: "client"
								}, {
										name: "ciraj",
										mess: "\u56DE\u7DDA\u7A2E\u5225\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
										type: "required",
										format: undefined,
										validation: "client"
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_extension_tel_co")) {
										A_rule1.push({
												name: "extensionno",
												mess: "\u5185\u7DDA\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u3059",
												type: "regex",
												format: "/^(\\d)+$/",
												validation: "client"
										});
								}
						}
				} else {
						A_rule1 = Array();
				}

				if (this.O_Sess.language == "ENG") {
						var A_rule2 = [{
								name: "mail",
								mess: "Email address is invalid",
								type: "email",
								format: undefined,
								validation: "client"
						}, {
								name: "orderdate",
								mess: "Specify the purchase date of the latest model in full date, month, and year.  Non-existent dates are not allowed",
								type: "QRCheckdate",
								format: undefined,
								validation: "client"
						}, {
								name: "contractdate",
								mess: "Specify a contract date in full date, month, and year.  Non-existent dates are not allowed",
								type: "QRCheckdate",
								format: undefined,
								validation: "client"
						}, {
								name: "rel_telno_view",
								mess: "Only single-byte English characters are accepted for the Phone number",
								type: "regex",
								format: "/^[A-Za-z0-9\\!\\#$\\%\\&\\(\\)\\-\\=\\^\\~\\|\\@\\`\\[\\{\\+\\*\\]\\}\\,\\<\\.\\>\\/\\?\\_\\s]+$/",
								validation: "client"
						}, {
								name: "rel_telno_view",
								mess: "Select both telephone and telephone carrier for the related category.",
								type: "QRRelFormInput",
								format: undefined,
								validation: "client"
						}];
				} else {
						A_rule2 = [{
								name: "mail",
								mess: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u304C\u4E0D\u6B63\u3067\u3059",
								type: "email",
								format: undefined,
								validation: "client"
						}, {
								name: "orderdate",
								mess: "\u6700\u65B0\u6A5F\u7A2E\u8CFC\u5165\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093",
								type: "QRCheckdate",
								format: undefined,
								validation: "client"
						}, {
								name: "contractdate",
								mess: "\u5951\u7D04\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093",
								type: "QRCheckdate",
								format: undefined,
								validation: "client"
						}, {
								name: "rel_telno_view",
								mess: "\u96FB\u8A71\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u8A18\u53F7\u306E\u307F\u3067\u3059",
								type: "regex",
								format: "/^[A-Za-z0-9\\!\\#$\\%\\&\\(\\)\\-\\=\\^\\~\\|\\@\\`\\[\\{\\+\\*\\]\\}\\,\\<\\.\\>\\/\\?\\_\\s]+$/",
								validation: "client"
						}, {
								name: "rel_telno_view",
								mess: "\u95A2\u9023\u9805\u76EE\u306F\u96FB\u8A71\u3068\u96FB\u8A71\u4F1A\u793E\u4E21\u65B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
								type: "QRRelFormInput",
								format: undefined,
								validation: "client"
						}];
				}

				var A_rule = array_merge(A_rule1, A_rule2);
				A_rule = array_merge(A_rule, this.makePropertyRule2(this.H_Prop2));
				return A_rule;
		}

		getEtcAddModFormElement(O_manage, O_model, H_sess) //管理種別の配列を生成
		//日付型のフォーマット配列を生成
		//ユーザ設定項目を取得する
		//フォーム要素の配列作成
		//個人別請求一覧権限ありの時
		//ユニーク文字列生成用
		{
				var H_co = O_model.getEtcCoData();
				var H_date = O_manage.getDateFormat();
				this.H_Prop = O_model.getManagementProperty(ManagementViewBase.ETCMID);
				var A_formelement = [{
						name: "cardno_view",
						label: "\u30AB\u30FC\u30C9\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "cardno",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "cardcoid",
						label: "\u30AB\u30FC\u30C9\u4F1A\u793E",
						inputtype: "select",
						data: H_co
				}, {
						name: "card_meigi",
						label: "\u30AB\u30FC\u30C9\u540D\u7FA9",
						inputtype: "text",
						options: {
								id: "card_meigi",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "bill_cardno_view",
						label: "\u30AB\u30FC\u30C9\u756A\u53F72",
						inputtype: "text",
						options: {
								id: "bill_cardno",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "card_corpno",
						label: "\u6CD5\u4EBA\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "card_corpno",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "card_corpname",
						label: "\u30AB\u30FC\u30C9\u6CD5\u4EBA\u540D",
						inputtype: "text",
						options: {
								id: "card_corpname",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "card_membername",
						label: "\u30AB\u30FC\u30C9\u4F1A\u54E1\u540D\u79F0",
						inputtype: "text",
						options: {
								id: "card_membername",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "username",
						label: "\u4F7F\u7528\u8005\u540D",
						inputtype: "text",
						options: {
								id: "username",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "employeecode",
						label: "\u793E\u54E1\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "employeecode",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "car_no",
						label: "\u8ECA\u4E21\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "car_no",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "memo",
						label: "\u30E1\u30E2",
						inputtype: "textarea",
						options: {
								id: "memo",
								cols: "35",
								rows: "5"
						}
				}, {
						name: "cancel",
						label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
						inputtype: "button",
						options: {
								onClick: "javascript:ask_cancel()"
						}
				}, {
						name: "reset",
						label: "\u30EA\u30BB\u30C3\u30C8",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='?r=1'"
						}
				}, {
						name: "back",
						label: "\u5165\u529B\u753B\u9762\u3078",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
						}
				}, {
						name: "recogpostid",
						label: "",
						inputtype: "hidden"
				}, {
						name: "recogpostname",
						label: "",
						inputtype: "hidden"
				}];

				if (-1 !== O_model.A_Auth.indexOf("fnc_card_billperson") == true) //元のユーザの指定あり
						{
								if (undefined !== H_sess.SELF.post.userid == true && H_sess.SELF.post.userid != "") {
										var H_userid = O_model.getUserSelect(H_sess.SELF.post.recogpostid, H_sess.SELF.post.userid);
								} else {
										H_userid = O_model.getUserSelect(H_sess.SELF.post.recogpostid);
								}

								var A_tmp = {
										name: "userid",
										label: "\u8ACB\u6C42\u95B2\u89A7\u8005",
										inputtype: "select",
										data: H_userid
								};
								A_formelement.push(A_tmp);
						}

				A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
				var O_unique = MtUniqueString.singleton();

				if (!(undefined !== H_sess.SELF.post.uniqueid)) {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: O_unique.getNewUniqueId(),
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				} else {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: H_sess.SELF.post.uniqueid,
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				}

				return A_formelement;
		}

		getEtcAddModFormRule() {
				var A_rule = [{
						name: "cardno_view",
						mess: "\u30AB\u30FC\u30C9\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "cardno_view",
						mess: "\u30AB\u30FC\u30C9\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "QRalnumRegex",
						format: undefined,
						validation: "client"
				}, {
						name: "cardno_view",
						mess: "\u30AB\u30FC\u30C9\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u534A\u89D2\u30B9\u30DA\u30FC\u30B9\u3001\u300C-\u300D\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9\\-\\s]+$/",
						validation: "client"
				}, {
						name: "bill_cardno_view",
						mess: "\u30AB\u30FC\u30C9\u756A\u53F72\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u534A\u89D2\u30B9\u30DA\u30FC\u30B9\u3001\u300C-\u300D\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9\\-\\s]+$/",
						validation: "client"
				}, {
						name: "card_corpno",
						mess: "\u304A\u5BA2\u69D8\u756A\u53F7\uFF08\u6CD5\u4EBA\u756A\u53F7\uFF09\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[0-9]+$/",
						validation: "client"
				}];
				A_rule = array_merge(A_rule, this.makePropertyRule(this.H_Prop));
				return A_rule;
		}

		getFjpAddModFormRule() {
				var A_rule = [{
						name: "pbpostcode_view",
						mess: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "cfbpostcode_view",
						mess: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "coecode",
						mess: "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "commflag",
						mess: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "pbpostcode_second",
						mess: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u300C-\u300D\u300C(\u300D\u300C)\u300D\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9\\-\\(\\)]+$/",
						validation: "client"
				}, {
						name: "cfbpostcode_second",
						mess: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u300C-\u300D\u300C(\u300D\u300C)\u300D\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9\\-\\(\\)]+$/",
						validation: "client"
				}, {
						name: "ioecode",
						mess: "\u8CFC\u5165\u30AA\u30FC\u30C0\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u300C-\u300D\u300C(\u300D\u300C)\u300D\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9\\-\\(\\)]+$/",
						validation: "client"
				}, {
						name: "coecode",
						mess: "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u300C-\u300D\u300C(\u300D\u300C)\u300D\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9\\-\\(\\)]+$/",
						validation: "client"
				}];
				return A_rule;
		}

		getPurchaseAddModFormElement(O_manage, O_model, H_sess) //購買先の配列を生成
		//日付型のフォーマット配列を生成
		//ユーザ設定項目を取得する
		//フォーム要素の配列作成
		//ユニーク文字列生成用
		{
				var H_co = O_model.getPurchCoData();
				var H_date = O_manage.getDateFormat();
				this.H_Prop = O_model.getManagementProperty(ManagementViewBase.PURCHMID);
				var A_formelement = [{
						name: "purchid",
						label: "\u8CFC\u8CB7ID",
						inputtype: "text",
						options: {
								id: "purchid",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "purchcoid",
						label: "\u8CFC\u8CB7\u5148",
						inputtype: "select",
						data: H_co
				}, {
						name: "loginid",
						label: "\u30ED\u30B0\u30A4\u30F3ID",
						inputtype: "text",
						options: {
								id: "loginid",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registcomp",
						label: "\u767B\u9332\u4F1A\u793E\u540D",
						inputtype: "text",
						options: {
								id: "registcomp",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registpost",
						label: "\u767B\u9332\u90E8\u7F72\u540D",
						inputtype: "text",
						options: {
								id: "registpost",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registzip",
						label: "\u767B\u9332\u90F5\u4FBF\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "registaddr1",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registaddr1",
						label: "\u767B\u9332\u4F4F\u6240\uFF08\u90FD\u9053\u5E9C\u770C\uFF09",
						inputtype: "text",
						options: {
								id: "registaddr1",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registaddr2",
						label: "\u767B\u9332\u4F4F\u6240\uFF08\u5E02\u533A\u753A\u6751\u3001\u756A\u5730\uFF09",
						inputtype: "text",
						options: {
								id: "registaddr2",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registbuilding",
						label: "\u767B\u9332\u4F4F\u6240\uFF08\u5EFA\u7269\uFF09",
						inputtype: "text",
						options: {
								id: "registbuilding",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registtelno",
						label: "\u767B\u9332\u96FB\u8A71\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "registtelno",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registfaxno",
						label: "\u767B\u9332FAX\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "registfaxno",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registemail",
						label: "\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
						inputtype: "text",
						options: {
								id: "registemail",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "registdate",
						label: "\u767B\u9332\u65E5",
						inputtype: "date",
						data: H_date
				}, {
						name: "username",
						label: "\u62C5\u5F53",
						inputtype: "text",
						options: {
								id: "username",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "employeecode",
						label: "\u793E\u54E1\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "employeecode",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "memo",
						label: "\u30E1\u30E2",
						inputtype: "textarea",
						options: {
								id: "memo",
								cols: "35",
								rows: "5"
						}
				}, {
						name: "cancel",
						label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
						inputtype: "button",
						options: {
								onClick: "javascript:ask_cancel()"
						}
				}, {
						name: "reset",
						label: "\u30EA\u30BB\u30C3\u30C8",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='?r=1'"
						}
				}, {
						name: "back",
						label: "\u5165\u529B\u753B\u9762\u3078",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
						}
				}, {
						name: "recogpostid",
						label: "",
						inputtype: "hidden"
				}, {
						name: "recogpostname",
						label: "",
						inputtype: "hidden"
				}];
				A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
				var O_unique = MtUniqueString.singleton();

				if (!(undefined !== H_sess.SELF.post.uniqueid)) {
						var A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: O_unique.getNewUniqueId(),
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				} else {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: H_sess.SELF.post.uniqueid,
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				}

				return A_formelement;
		}

		getPurchaseAddModFormRule() {
				var A_rule = [{
						name: "purchid",
						mess: "\u8CFC\u8CB7ID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "purchid",
						mess: "\u8CFC\u8CB7ID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "QRalnumRegex",
						format: undefined,
						validation: "client"
				}, {
						name: "purchid",
						mess: "\u8CFC\u8CB7ID\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9]+$/",
						validation: "client"
				}, {
						name: "purchcoid",
						mess: "\u8CFC\u8CB7\u5148\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "registemail",
						mess: "\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "email",
						format: undefined,
						validation: "client"
				}, {
						name: "registdate",
						mess: "\u767B\u9332\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
						type: "QRCheckdate",
						format: undefined,
						validation: "client"
				}];
				A_rule = array_merge(A_rule, this.makePropertyRule(this.H_Prop));
				return A_rule;
		}

		getCopyAddModFormElement(O_manage, O_model, H_sess) //管理種別の配列を生成
		//日付型のフォーマット配列を生成
		//ユーザ設定項目を取得する
		//フォーム要素の配列作成
		//ユニーク文字列生成用
		{
				var H_co = O_model.getCopyCoData();
				var H_date = O_manage.getDateFormat();
				this.H_Prop = O_model.getManagementProperty(ManagementViewBase.COPYMID);
				var A_formelement = [{
						name: "copyid",
						label: "\u30B3\u30D4\u30FC\u6A5FID",
						inputtype: "text",
						options: {
								id: "copyid",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "copycoid",
						label: "\u30E1\u30FC\u30AB\u30FC",
						inputtype: "select",
						data: H_co
				}, {
						name: "copyname",
						label: "\u6A5F\u7A2E",
						inputtype: "text",
						options: {
								id: "copyname",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "username",
						label: "\u62C5\u5F53",
						inputtype: "text",
						options: {
								id: "username",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "employeecode",
						label: "\u793E\u54E1\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "employeecode",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "memo",
						label: "\u30E1\u30E2",
						inputtype: "textarea",
						options: {
								id: "memo",
								cols: "35",
								rows: "5"
						}
				}, {
						name: "cancel",
						label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
						inputtype: "button",
						options: {
								onClick: "javascript:ask_cancel()"
						}
				}, {
						name: "reset",
						label: "\u30EA\u30BB\u30C3\u30C8",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='?r=1'"
						}
				}, {
						name: "back",
						label: "\u5165\u529B\u753B\u9762\u3078",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
						}
				}, {
						name: "recogpostid",
						label: "",
						inputtype: "hidden"
				}, {
						name: "recogpostname",
						label: "",
						inputtype: "hidden"
				}];
				A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
				var O_unique = MtUniqueString.singleton();

				if (!(undefined !== H_sess.SELF.post.uniqueid)) {
						var A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: O_unique.getNewUniqueId(),
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				} else {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: H_sess.SELF.post.uniqueid,
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				}

				return A_formelement;
		}

		getCopyAddModFormRule() {
				var A_rule = [{
						name: "copyid",
						mess: "\u30B3\u30D4\u30FC\u6A5FID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "copyid",
						mess: "\u30B3\u30D4\u30FC\u6A5FID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "QRalnumRegex",
						format: undefined,
						validation: "client"
				}, {
						name: "copyid",
						mess: "\u30B3\u30D4\u30FC\u6A5FID\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3068\u30CF\u30A4\u30D5\u30F3\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9\\-]+$/",
						validation: "client"
				}, {
						name: "copycoid",
						mess: "\u30E1\u30FC\u30AB\u30FC\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "registemail",
						mess: "\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "email",
						format: undefined,
						validation: "client"
				}, {
						name: "registdate",
						mess: "\u767B\u9332\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
						type: "QRCheckdate",
						format: undefined,
						validation: "client"
				}];
				A_rule = array_merge(A_rule, this.makePropertyRule(this.H_Prop));
				return A_rule;
		}

		getAssetsAddModFormElement(O_manage, O_model, H_sess, mode = "tel", type = "add", H_data = undefined) //キャリア取得
		//キャリアの指定がある時
		//端末種別取得
		//表示言語分岐
		{
				var H_car = O_model.getCarrierData();

				if (undefined !== H_sess.SELF.post.searchcarid == true && H_sess.SELF.post.searchcarid != "") //回線の指定あり
						//シリーズの指定あり
						//シリーズの配列を生成
						//製品の配列を生成
						//色の配列を生成
						{
								var carid = H_sess.SELF.post.searchcarid;
								var cirid = "";

								if (undefined !== H_sess.SELF.post.searchcirid == true && H_sess.SELF.post.searchcirid != "") {
										cirid = H_sess.SELF.post.searchcirid;
								}

								var seriesid = "";

								if (undefined !== H_sess.SELF.post.seriesid == true && H_sess.SELF.post.seriesid != "") {
										seriesid = H_sess.SELF.post.seriesid;
								}

								if (undefined !== H_sess.SELF.post.productid == true && H_sess.SELF.post.productid != "") {
										var productid = H_sess.SELF.post.productid;
								}

								var H_cir = O_model.getCircuitData(carid);
								var H_series = O_model.getProductSeriesData(carid, cirid);
								var H_products = O_model.getProductIdNameData(carid, cirid, seriesid);
								var H_branch = O_model.getBranchIdNameData(productid);
						} else //表示言語分岐
						{
								if (this.O_Sess.language == "ENG") {
										H_cir = {
												"": ManagementViewBase.TEL_SELECT_DEFAULT_ENG
										};
										H_series = {
												"": "--Please select a service type--"
										};
										H_products = {
												"": "--Please select a series--"
										};
										H_branch = {
												"": "--Please select a product name--"
										};
								} else {
										H_cir = {
												"": ManagementViewBase.TEL_SELECT_DEFAULT
										};
										H_series = {
												"": "--\u56DE\u7DDA\u7A2E\u5225\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
										};
										H_products = {
												"": "--\u30B7\u30EA\u30FC\u30BA\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
										};
										H_branch = {
												"": "--\u88FD\u54C1\u540D\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
										};
								}
						}

				var H_smpcirid = O_model.getSmartCircuitData();

				if (this.O_Sess.language == "ENG") //日付型のフォーマット配列を生成
						//フォーム要素の配列作成
						//S185	20150204date
						{
								var H_date_ter = O_manage.getDateFormatEng(undefined, 1);
								var H_month_ter = O_manage.getMonthFormatEng();
								var H_date = O_manage.getDateFormatEng();
								var A_formelement = [{
										name: "assetsid",
										inputtype: "hidden",
										data: ""
								}, {
										name: "assetsno",
										label: "Admin number",
										inputtype: "text",
										options: {
												id: "assetsno",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "pre_assetsno",
										inputtype: "hidden",
										data: ""
								}, {
										name: "searchcarid",
										label: "Carrier",
										inputtype: "select",
										data: H_car,
										options: {
												id: "searchcarid",
												onChange: "javascript:execAssetsAjax(this.name);"
										}
								}, {
										name: "searchcirid",
										label: "Service type",
										inputtype: "select",
										data: H_cir,
										options: {
												id: "searchcirid",
												onChange: "javascript:execAssetsAjax(this.name);"
										}
								}, {
										name: "searchciraj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "searchciraj"
										}
								}, {
										name: "serialno",
										label: "IMEI number",
										inputtype: "text",
										options: {
												id: "serialno",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "seriesid",
										label: "Series",
										inputtype: "select",
										options: {
												id: "seriesid",
												onChange: "javascript:execAssetsAjax(this.name);"
										},
										data: H_series
								}, {
										name: "seriesaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "seriesaj"
										}
								}, {
										name: "productid",
										label: "Product name",
										inputtype: "select",
										options: {
												id: "productid",
												onChange: "javascript:execAssetsAjax(this.name);"
										},
										data: H_products
								}, {
										name: "productaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "productaj"
										}
								}, {
										name: "branchid",
										label: "Color",
										inputtype: "select",
										options: {
												id: "branchid",
												onChange: "javascript:setHiddenValueAss(this.name);"
										},
										data: H_branch
								}, {
										name: "branchaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "branchaj"
										}
								}, {
										name: "productname",
										label: "Product name",
										inputtype: "text",
										options: {
												id: "productname",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "property",
										label: "Color",
										inputtype: "text",
										options: {
												id: "property",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "bought_price",
										label: "Purchase cost",
										inputtype: "text",
										options: {
												id: "bought_price",
												size: "35",
												maxlength: "9"
										}
								}, {
										name: "bought_date",
										label: "Purchase date",
										inputtype: "date",
										options: {
												id: "bought_date",
												size: "35",
												maxlength: "255"
										},
										data: H_date_ter
								}, {
										name: "pay_startdate",
										label: "First month of installment month",
										inputtype: "date",
										options: {
												id: "pay_startdate"
										},
										data: H_month_ter
								}, {
										name: "pay_frequency",
										label: "At the time of installment payment",
										inputtype: "text",
										options: {
												id: "pay_frequency",
												size: "35",
												maxlength: "9"
										}
								}, {
										name: "pay_monthly_sum",
										label: "Payment of monthly installment",
										inputtype: "text",
										options: {
												id: "pay_monthly_sum",
												size: "35",
												maxlength: "9"
										}
								}, {
										name: "firmware",
										label: "Firmware",
										inputtype: "text",
										options: {
												id: "firmware",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "version",
										label: "Version",
										inputtype: "text",
										options: {
												id: "version",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "smpcirid",
										label: "Handset type",
										inputtype: "select",
										options: {
												id: "smpcirid"
										},
										data: H_smpcirid
								}, {
										name: "accessory",
										label: "Accessories",
										inputtype: "textarea",
										options: {
												id: "accessory",
												cols: "35",
												rows: "5"
										}
								}, {
										name: "username",
										label: "User",
										inputtype: "text",
										options: {
												id: "username",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "employeecode",
										label: "Employee number",
										inputtype: "text",
										options: {
												id: "employeecode",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "note",
										label: "Memo",
										inputtype: "textarea",
										options: {
												id: "note",
												cols: "35",
												rows: "5"
										}
								}, {
										name: "cancel",
										label: "Cancel",
										inputtype: "button",
										options: {
												onClick: "javascript:ask_cancel()"
										}
								}, {
										name: "reset",
										label: "Reset",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='?r=1'"
										}
								}, {
										name: "back",
										label: "To entry screen",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
										}
								}, {
										name: "recogpostid",
										label: "",
										inputtype: "hidden"
								}, {
										name: "recogpostname",
										label: "",
										inputtype: "hidden"
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_receipt")) {
										if ("string" === typeof H_sess.SELF.post.receiptdate_0) //初期値
												{
														var year_min = H_sess.SELF.post.receiptdate_0.substr(0, 4);
												} else if (Array.isArray(H_sess.SELF.post.receiptdate_0)) {
												year_min = H_sess.SELF.post.receiptdate_0.Y;
										}

										if (!year_min || year_min > date("Y") - 3) {
												year_min = date("Y") - 3;
										}

										A_formelement.push({
												name: "receiptdate",
												label: "\u53D7\u9818\u65E5",
												inputtype: "date",
												data: {
														minYear: year_min,
														maxYear: date("Y") + 3,
														addEmptyOption: true,
														emptyOptionText: "--",
														format: "Y \u5E74 m \u6708 d \u65E5",
														id: "receipt_date",
														language: "ja"
												}
										});
								}

								if ("ass" == mode) //資産種別の配列を生成
										//資産種別
										//ユーザ設定項目
										{
												var H_type = O_model.getAssetsTypeData();

												if ("add" == type) {
														var A_assetstype = {
																name: "assetstypeid",
																label: "Property type",
																inputtype: "select",
																options: {
																		id: "assetstypeid",
																		onChange: "javascript:showKeitaiForm();"
																},
																data: H_type
														};
												} else {
														A_assetstype = {
																name: "assetstypeid",
																label: "Property type",
																inputtype: "select",
																options: {
																		id: "assetstypeid",
																		onChange: "javascript:notChange(" + H_sess.SELF.post.assetstypeid + ");"
																},
																data: H_type
														};
												}

												A_formelement.push(A_assetstype);
												this.H_Prop = O_model.getManagementProperty(ManagementViewBase.ASSMID);
												A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
										} else //端末管理している（変更時）
										//資産種別
										{
												var A_get_flg = {
														name: "get_flg",
														inputtype: "hidden",
														data: "0",
														options: {
																id: "get_flg"
														}
												};
												A_formelement.push(A_get_flg);

												if ("mod" === type && -1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_co") == true && -1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) //端末関連付けに関するチェックボックス
														{
																var A_mainflg = {
																		name: "main_flg",
																		label: "Active",
																		inputtype: "radio",
																		data: [["Active", "onClick=javascript:checkMainflgRadioStatus(this);"]]
																};

																if (this.O_Sess.language == "ENG") {
																		var H_ass_type = O_manage.getAssRelCheckEng();
																} else {
																		H_ass_type = O_manage.getAssRelCheck();
																}

																var A_ass_check = {
																		name: "ass_rel_check",
																		label: "\u7AEF\u672B\u306E\u4F7F\u7528\u306B\u95A2\u3057\u3066",
																		inputtype: "groupcheckbox",
																		data: H_ass_type,
																		options: {
																				id: "ass_rel_check"
																		}
																};
																A_formelement.push(A_ass_check);
														} else //主端末はhiddenn
														{
																A_mainflg = {
																		name: "main_flg",
																		data: "true",
																		inputtype: "hidden"
																};
														}

												A_formelement.push(A_mainflg);
												A_assetstype = {
														name: "assetstypeid",
														inputtype: "hidden",
														data: 1
												};
												A_formelement.push(A_assetstype);
										}
						} else //日付型のフォーマット配列を生成
						//フォーム要素の配列作成
						//S185 20150204 date
						{
								H_date_ter = O_manage.getDateFormat(undefined, 1);
								H_month_ter = O_manage.getMonthFormat();
								H_date = O_manage.getDateFormat();
								A_formelement = [{
										name: "assetsid",
										inputtype: "hidden",
										data: ""
								}, {
										name: "assetsno",
										label: "\u7BA1\u7406\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "assetsno",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "pre_assetsno",
										inputtype: "hidden",
										data: ""
								}, {
										name: "searchcarid",
										label: "\u96FB\u8A71\u4F1A\u793E",
										inputtype: "select",
										data: H_car,
										options: {
												id: "searchcarid",
												onChange: "javascript:execAssetsAjax(this.name);"
										}
								}, {
										name: "searchcirid",
										label: "\u56DE\u7DDA\u7A2E\u5225",
										inputtype: "select",
										data: H_cir,
										options: {
												id: "searchcirid",
												onChange: "javascript:execAssetsAjax(this.name);"
										}
								}, {
										name: "searchciraj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "searchciraj"
										}
								}, {
										name: "serialno",
										label: "\u88FD\u9020\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "serialno",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "seriesid",
										label: "\u30B7\u30EA\u30FC\u30BA",
										inputtype: "select",
										options: {
												id: "seriesid",
												onChange: "javascript:execAssetsAjax(this.name);"
										},
										data: H_series
								}, {
										name: "seriesaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "seriesaj"
										}
								}, {
										name: "productid",
										label: "\u88FD\u54C1\u540D",
										inputtype: "select",
										options: {
												id: "productid",
												onChange: "javascript:execAssetsAjax(this.name);"
										},
										data: H_products
								}, {
										name: "productaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "productaj"
										}
								}, {
										name: "branchid",
										label: "\u8272",
										inputtype: "select",
										options: {
												id: "branchid",
												onChange: "javascript:setHiddenValueAss(this.name);"
										},
										data: H_branch
								}, {
										name: "branchaj",
										inputtype: "hidden",
										data: "",
										options: {
												id: "branchaj"
										}
								}, {
										name: "productname",
										label: "\u88FD\u54C1\u540D",
										inputtype: "text",
										options: {
												id: "productname",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "property",
										label: "\u8272",
										inputtype: "text",
										options: {
												id: "property",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "bought_price",
										label: "\u53D6\u5F97\u4FA1\u683C",
										inputtype: "text",
										options: {
												id: "bought_price",
												size: "35",
												maxlength: "9"
										}
								}, {
										name: "bought_date",
										label: "\u8CFC\u5165\u65E5",
										inputtype: "date",
										options: {
												id: "bought_date",
												size: "35",
												maxlength: "255"
										},
										data: H_date_ter
								}, {
										name: "pay_startdate",
										label: "\u5272\u8CE6\u958B\u59CB\u6708",
										inputtype: "date",
										options: {
												id: "pay_startdate"
										},
										data: H_month_ter
								}, {
										name: "pay_frequency",
										label: "\u5272\u8CE6\u56DE\u6570",
										inputtype: "text",
										options: {
												id: "pay_frequency",
												size: "35",
												maxlength: "9"
										}
								}, {
										name: "pay_monthly_sum",
										label: "\u5272\u8CE6\u6708\u984D",
										inputtype: "text",
										options: {
												id: "pay_monthly_sum",
												size: "35",
												maxlength: "9"
										}
								}, {
										name: "firmware",
										label: "\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2",
										inputtype: "text",
										options: {
												id: "firmware",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "version",
										label: "\u30D0\u30FC\u30B8\u30E7\u30F3",
										inputtype: "text",
										options: {
												id: "version",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "smpcirid",
										label: "\u7AEF\u672B\u7A2E\u5225",
										inputtype: "select",
										options: {
												id: "smpcirid"
										},
										data: H_smpcirid
								}, {
										name: "accessory",
										label: "\u4ED8\u5C5E\u54C1",
										inputtype: "textarea",
										options: {
												id: "accessory",
												cols: "35",
												rows: "5"
										}
								}, {
										name: "username",
										label: "\u4F7F\u7528\u8005",
										inputtype: "text",
										options: {
												id: "username",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "employeecode",
										label: "\u793E\u54E1\u756A\u53F7",
										inputtype: "text",
										options: {
												id: "employeecode",
												size: "35",
												maxlength: "255"
										}
								}, {
										name: "note",
										label: "\u30E1\u30E2",
										inputtype: "textarea",
										options: {
												id: "note",
												cols: "35",
												rows: "5"
										}
								}, {
										name: "cancel",
										label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
										inputtype: "button",
										options: {
												onClick: "javascript:ask_cancel()"
										}
								}, {
										name: "reset",
										label: "\u30EA\u30BB\u30C3\u30C8",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='?r=1'"
										}
								}, {
										name: "back",
										label: "\u5165\u529B\u753B\u9762\u3078",
										inputtype: "button",
										options: {
												onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
										}
								}, {
										name: "recogpostid",
										label: "",
										inputtype: "hidden"
								}, {
										name: "recogpostname",
										label: "",
										inputtype: "hidden"
								}];

								if (-1 !== O_model.A_Auth.indexOf("fnc_receipt")) {
										if ("string" === typeof H_sess.SELF.post.receiptdate_0) //初期値
												{
														year_min = H_sess.SELF.post.receiptdate_0.substr(0, 4);
												} else if (Array.isArray(H_sess.SELF.post.receiptdate_0)) {
												year_min = H_sess.SELF.post.receiptdate_0.Y;
										}

										if (!year_min || year_min > date("Y") - 3) {
												year_min = date("Y") - 3;
										}

										A_formelement.push({
												name: "receiptdate",
												label: "\u53D7\u9818\u65E5",
												inputtype: "date",
												data: {
														minYear: year_min,
														maxYear: date("Y") + 3,
														addEmptyOption: true,
														emptyOptionText: "--",
														format: "Y \u5E74 m \u6708 d \u65E5",
														id: "receipt_date",
														language: "ja"
												}
										});
								}

								if ("ass" == mode) //資産種別の配列を生成
										//資産種別
										//ユーザ設定項目
										{
												H_type = O_model.getAssetsTypeData();

												if ("add" == type) {
														A_assetstype = {
																name: "assetstypeid",
																label: "\u8CC7\u7523\u7A2E\u5225",
																inputtype: "select",
																options: {
																		id: "assetstypeid",
																		onChange: "javascript:showKeitaiForm();"
																},
																data: H_type
														};
												} else {
														A_assetstype = {
																name: "assetstypeid",
																label: "\u8CC7\u7523\u7A2E\u5225",
																inputtype: "select",
																options: {
																		id: "assetstypeid",
																		onChange: "javascript:notChange(" + H_sess.SELF.post.assetstypeid + ");"
																},
																data: H_type
														};
												}

												A_formelement.push(A_assetstype);
												this.H_Prop = O_model.getManagementProperty(ManagementViewBase.ASSMID);
												A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
										} else //端末管理している（変更時）
										//資産種別
										{
												A_get_flg = {
														name: "get_flg",
														inputtype: "hidden",
														data: "0",
														options: {
																id: "get_flg"
														}
												};
												A_formelement.push(A_get_flg);

												if ("mod" === type && -1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_co") == true && -1 !== O_model.A_Auth.indexOf("fnc_assets_manage_adm_us") == true) //端末関連付けに関するチェックボックス
														{
																A_mainflg = {
																		name: "main_flg",
																		label: "\u4F7F\u7528\u4E2D",
																		inputtype: "radio",
																		data: [["\u4F7F\u7528\u4E2D", "onClick=javascript:checkMainflgRadioStatus(this);"]]
																};
																H_ass_type = O_manage.getAssRelCheck();
																A_ass_check = {
																		name: "ass_rel_check",
																		label: "\u7AEF\u672B\u306E\u4F7F\u7528\u306B\u95A2\u3057\u3066",
																		inputtype: "groupcheckbox",
																		data: H_ass_type,
																		options: {
																				id: "ass_rel_check"
																		}
																};
																A_formelement.push(A_ass_check);
														} else //主端末はhiddenn
														{
																A_mainflg = {
																		name: "main_flg",
																		data: "true",
																		inputtype: "hidden"
																};
														}

												A_formelement.push(A_mainflg);
												A_assetstype = {
														name: "assetstypeid",
														inputtype: "hidden",
														data: 1
												};
												A_formelement.push(A_assetstype);
										}
						}

				if ("ass" == mode) //ユニーク文字列生成用
						{
								var O_unique = MtUniqueString.singleton();

								if (!(undefined !== H_sess.SELF.post.uniqueid)) {
										var A_tmp = {
												name: "uniqueid",
												inputtype: "hidden",
												data: O_unique.getNewUniqueId(),
												options: {
														id: "uniqueid"
												}
										};
										A_formelement.push(A_tmp);
								} else {
										A_tmp = {
												name: "uniqueid",
												inputtype: "hidden",
												data: H_sess.SELF.post.uniqueid,
												options: {
														id: "uniqueid"
												}
										};
										A_formelement.push(A_tmp);
								}
						}

				return A_formelement;
		}

		getFjpAddModFormElement() {
				var A_formelement = [{
						name: "recogname_view",
						label: "\u627F\u8A8D\u8005\u540D",
						inputtype: "text",
						options: {
								id: "recogname_view",
								size: 25,
								maxlength: "255"
						}
				}, {
						name: "recogname",
						label: "\u627F\u8A8D\u8005\u540D",
						inputtype: "hidden",
						options: {
								id: "recogname"
						}
				}, {
						name: "recogcode_view",
						label: "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9",
						inputtype: "text",
						options: {
								id: "recogcode_view",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "recogcode",
						label: "\u627F\u8A8D\u8005\u30B3\u30FC\u30C9",
						inputtype: "hidden",
						options: {
								id: "recogcode"
						}
				}, {
						name: "pbpostname_view",
						label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "text",
						options: {
								id: "pbpostname_view",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "pbpostname",
						label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "hidden",
						options: {
								id: "pbpostname"
						}
				}, {
						name: "pbpostcode_view",
						label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "text",
						options: {
								id: "pbpostcode_view",
								size: 6,
								maxlength: "6"
						}
				}, {
						name: "pbpostcode_first",
						label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "hidden",
						options: {
								id: "pbpostcode_first"
						}
				}, {
						name: "pbpostcode_second",
						label: "\u8CFC\u5165\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "text",
						options: {
								id: "pbpostcode_second",
								size: 3,
								maxlength: 3
						}
				}, {
						name: "cfbpostname_view",
						label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "text",
						options: {
								id: "cfbpostname_view",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "cfbpostname",
						label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "hidden",
						options: {
								id: "cfbpostname"
						}
				}, {
						name: "cfbpostcode_view",
						label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "text",
						options: {
								id: "cfbpostcode_view",
								size: 6,
								maxlength: "6"
						}
				}, {
						name: "cfbpostcode_first",
						label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "hidden",
						options: {
								id: "cfbpostcode_first"
						}
				}, {
						name: "cfbpostcode_second",
						label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5143\u8077\u5236",
						inputtype: "text",
						options: {
								id: "cfbpostcode_second",
								size: 3,
								maxlength: 3
						}
				}, {
						name: "ioecode",
						label: "\u8CFC\u5165\u30AA\u30FC\u30C0",
						inputtype: "text",
						options: {
								id: "ioecode",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "coecode",
						label: "\u901A\u4FE1\u8CBB\u30AA\u30FC\u30C0",
						inputtype: "text",
						options: {
								id: "coecode",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "commflag",
						label: "\u901A\u4FE1\u8CBB\u8CA0\u62C5\u5909\u66F4\u30D5\u30E9\u30B0",
						inputtype: "select",
						data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								auto: "\u81EA\u52D5\u66F4\u65B0\u3059\u308B",
								manual: "\u81EA\u52D5\u66F4\u65B0\u3057\u306A\u3044"
						},
						options: {
								id: "commflag"
						}
				}, {
						name: "employee_class",
						label: "\u793E\u54E1\u533A\u5206",
						inputtype: "select",
						data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								"1": "\u4E00\u822C\u793E\u54E1",
								"2": "\u5E79\u90E8\u793E\u54E1"
						},
						options: {
								id: "employee_class"
						}
				}, {
						name: "executive_no",
						label: "\u5E79\u90E8\u793E\u54E1\u5F93\u696D\u54E1\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "executive_no",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "executive_name",
						label: "\u5E79\u90E8\u793E\u54E1\u6C0F\u540D",
						inputtype: "text",
						options: {
								id: "executive_name",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "executive_mail",
						label: "\u5E79\u90E8\u793E\u54E1\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
						inputtype: "text",
						options: {
								id: "executive_mail",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "salary_source_name",
						label: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u540D",
						inputtype: "text",
						options: {
								id: "salary_source_name",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "salary_source_code",
						label: "\u7D66\u4E0E\u8CA0\u62C5\u5143\u8077\u5236\u30B3\u30FC\u30C9",
						inputtype: "text",
						options: {
								id: "salary_source_code",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "office_code",
						label: "\u4E8B\u696D\u6240\u30B3\u30FC\u30C9",
						inputtype: "text",
						options: {
								id: "office_code",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "office_name",
						label: "\u4E8B\u696D\u6240\u540D",
						inputtype: "text",
						options: {
								id: "office_name",
								size: 35,
								maxlength: "255"
						}
				}, {
						name: "building_name",
						label: "\u30D3\u30EB\u540D",
						inputtype: "text",
						options: {
								id: "building_name",
								size: 35,
								maxlength: "255"
						}
				}];
				return A_formelement;
		}

		getDivisionAddModFormElement() {
				var A_formelement = [{
						name: "division",
						label: "\u7528\u9014",
						inputtype: "select",
						data: {
								"": "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044",
								"1": "\u696D\u52D9\u7528",
								"2": "\u30C7\u30E2\u7528"
						},
						options: {
								id: "division"
						}
				}];
				return A_formelement;
		}

		getDivisionAddModFormRule() {
				var rules = [{
						name: "division",
						mess: "\u7528\u9014\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}];
				return rules;
		}

		getAssetsAddModFormRule(mode = "tel") //S185 date
		//表示言語分岐
		{
				var fnc = this.O_Auth.getPactFunc();
				fnc = Object.keys(fnc);

				if (this.O_Sess.language == "ENG") //S185 20150204 date
						{
								var A_rule = [{
										name: "assetsno",
										mess: "Only single-byte English characters and \"-\" are valid for Management No",
										type: "regex",
										format: "/^[A-Za-z0-9\\-]+$/",
										validation: "client"
								}, {
										name: "bought_date",
										mess: "Please specify the full date, month, and year for purchase date.  Non-existent dates are not allowed",
										type: "QRCheckDate",
										format: undefined,
										validation: "client"
								}, {
										name: "pay_startdate",
										mess: "Specify month and year for starting month of installment payment",
										type: "QRCheckMonth",
										format: undefined,
										validation: "client"
								}, {
										name: "bought_price",
										mess: "Only single-byte numbers are valid for purchase cost",
										type: "regex",
										format: "/^(\\d)+$/",
										validation: "client"
								}, {
										name: "pay_frequency",
										mess: "Only single-byte numbers are valid for number of installments",
										type: "regex",
										format: "/^(\\d)+$/",
										validation: "client"
								}, {
										name: "pay_monthly_sum",
										mess: "Only single-byte numbers are valid for monthly installment amount",
										type: "regex",
										format: "/^(\\d)+$/",
										validation: "client"
								}];

								if (-1 !== fnc.indexOf("fnc_receipt") && mode == "tel") {
										A_rule.push({
												name: "receiptdate",
												mess: "\u53D7\u9818\u65E5\u304C\u7121\u52B9\u3067\u3059\u3002",
												type: "QRCheckDate",
												format: undefined,
												validation: "client",
												reset: false,
												force: false
										});
								}

								if ("ass" == mode) {
										var A_tmp = {
												name: "assetsno",
												mess: "Enter admin number",
												type: "required",
												format: undefined,
												validation: "client"
										};
										A_rule.push(A_tmp);
										A_tmp = {
												name: "assetsno",
												mess: "Enter admin number",
												type: "QRalnumRegex",
												format: undefined,
												validation: "client"
										};
										A_rule.push(A_tmp);
										A_tmp = {
												name: "assetstypeid",
												mess: "Enter admin type",
												type: "required",
												format: undefined,
												validation: "client"
										};
										A_rule.push(A_tmp);
								}
						} else //S185  20150204date
						{
								A_rule = [{
										name: "assetsno",
										mess: "\u7BA1\u7406\u756A\u53F7\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u3001\u300C-\u300D\u306E\u307F\u3067\u3059",
										type: "regex",
										format: "/^[A-Za-z0-9\\-]+$/",
										validation: "client"
								}, {
										name: "bought_date",
										mess: "\u8CFC\u5165\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
										type: "QRCheckDate",
										format: undefined,
										validation: "client"
								}, {
										name: "pay_startdate",
										mess: "\u5272\u8CE6\u958B\u59CB\u6708\u306F\u5E74\u6708\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044",
										type: "QRCheckMonth",
										format: undefined,
										validation: "client"
								}, {
										name: "bought_price",
										mess: "\u53D6\u5F97\u4FA1\u683C\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u3059",
										type: "regex",
										format: "/^(\\d)+$/",
										validation: "client"
								}, {
										name: "pay_frequency",
										mess: "\u5272\u8CE6\u56DE\u6570\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u3059",
										type: "regex",
										format: "/^(\\d)+$/",
										validation: "client"
								}, {
										name: "pay_monthly_sum",
										mess: "\u5272\u8CE6\u6708\u984D\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u3059",
										type: "regex",
										format: "/^(\\d)+$/",
										validation: "client"
								}];

								if (-1 !== fnc.indexOf("fnc_receipt") && mode == "tel") {
										A_rule.push({
												name: "receiptdate",
												mess: "\u53D7\u9818\u65E5\u304C\u7121\u52B9\u3067\u3059\u3002",
												type: "QRCheckDate",
												format: undefined,
												validation: "client",
												reset: false,
												force: false
										});
								}

								if ("ass" == mode) {
										A_tmp = {
												name: "assetsno",
												mess: "\u7BA1\u7406\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
												type: "required",
												format: undefined,
												validation: "client"
										};
										A_rule.push(A_tmp);
										A_tmp = {
												name: "assetsno",
												mess: "\u7BA1\u7406\u756A\u53F7\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
												type: "QRalnumRegex",
												format: undefined,
												validation: "client"
										};
										A_rule.push(A_tmp);
										A_tmp = {
												name: "assetstypeid",
												mess: "\u7BA1\u7406\u7A2E\u5225\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
												type: "required",
												format: undefined,
												validation: "client"
										};
										A_rule.push(A_tmp);
								}
						}

				A_rule = array_merge(A_rule, this.makePropertyRule(this.H_Prop));
				return A_rule;
		}

		getTransitAddModFormElement(O_manage, O_model, H_sess) //運送会社の配列を生成
		//ユーザ設定項目を取得する
		//フォーム要素の配列作成
		//日付入力フォーマット
		//ユニーク文字列生成用
		{
				var H_co = O_model.getTranCoData();
				this.H_Prop = O_model.getManagementProperty(ManagementViewBase.TRANMID);
				var A_formelement = [{
						name: "tranid",
						label: "\u904B\u9001ID",
						inputtype: "text",
						options: {
								id: "tranid",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "trancoid",
						label: "\u4F1A\u793E",
						inputtype: "select",
						data: H_co
				}, {
						name: "username",
						label: "\u62C5\u5F53",
						inputtype: "text",
						options: {
								id: "username",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "employeecode",
						label: "\u793E\u54E1\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "employeecode",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "memo",
						label: "\u30E1\u30E2",
						inputtype: "textarea",
						options: {
								id: "memo",
								cols: "35",
								rows: "5"
						}
				}, {
						name: "cancel",
						label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
						inputtype: "button",
						options: {
								onClick: "javascript:ask_cancel()"
						}
				}, {
						name: "reset",
						label: "\u30EA\u30BB\u30C3\u30C8",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='?r=1'"
						}
				}, {
						name: "back",
						label: "\u5165\u529B\u753B\u9762\u3078",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
						}
				}, {
						name: "recogpostid",
						label: "",
						inputtype: "hidden"
				}, {
						name: "recogpostname",
						label: "",
						inputtype: "hidden"
				}];
				var H_date = O_manage.getDateFormat();
				A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
				var O_unique = MtUniqueString.singleton();

				if (!(undefined !== H_sess.SELF.post.uniqueid)) {
						var A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: O_unique.getNewUniqueId(),
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				} else {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: H_sess.SELF.post.uniqueid,
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				}

				return A_formelement;
		}

		getTransitAddModFormRule() {
				var A_rule = [{
						name: "tranid",
						mess: "\u904B\u9001ID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "tranid",
						mess: "\u904B\u9001ID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "QRalnumRegex",
						format: undefined,
						validation: "client"
				}, {
						name: "tranid",
						mess: "\u904B\u9001ID\u3067\u4F7F\u7528\u3067\u304D\u308B\u6587\u5B57\u306F\u534A\u89D2\u82F1\u6570\u306E\u307F\u3067\u3059",
						type: "regex",
						format: "/^[A-Za-z0-9]+$/",
						validation: "client"
				}, {
						name: "trancoid",
						mess: "\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "registemail",
						mess: "\u767B\u9332\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306F\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u306E\u5F62\u5F0F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "email",
						format: undefined,
						validation: "client"
				}, {
						name: "registdate",
						mess: "\u767B\u9332\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
						type: "QRCheckdate",
						format: undefined,
						validation: "client"
				}];
				return A_rule;
		}

		getEvAddFormElement(O_manage, O_model, H_sess) //キャリアの配列を生成
		//ユーザ設定項目を取得する
		//フォーム要素の配列作成
		//日付入力フォーマット
		//ユニーク文字列生成用
		{
				var H_co = O_model.getEvCoData();
				this.H_Prop = O_model.getManagementProperty(ManagementViewBase.EVMID);
				var A_formelement = [{
						name: "evid",
						label: "ID",
						inputtype: "text",
						options: {
								id: "evid",
								size: "35",
								maxlength: "9"
						}
				}, {
						name: "evcoid",
						label: "\u30AD\u30E3\u30EA\u30A2",
						inputtype: "select",
						data: H_co
				}, {
						name: "memo",
						label: "\u30E1\u30E2",
						inputtype: "textarea",
						options: {
								id: "memo",
								cols: "35",
								rows: "5"
						}
				}, {
						name: "cancel",
						label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
						inputtype: "button",
						options: {
								onClick: "javascript:ask_cancel()"
						}
				}, {
						name: "reset",
						label: "\u30EA\u30BB\u30C3\u30C8",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='?r=1'"
						}
				}, {
						name: "back",
						label: "\u5165\u529B\u753B\u9762\u3078",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
						}
				}, {
						name: "recogpostid",
						label: "",
						inputtype: "hidden"
				}, {
						name: "recogpostname",
						label: "",
						inputtype: "hidden"
				}];
				var H_date = O_manage.getDateFormat();
				A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
				var O_unique = MtUniqueString.singleton();

				if (!(undefined !== H_sess.SELF.post.uniqueid)) {
						var A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: O_unique.getNewUniqueId(),
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				} else {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: H_sess.SELF.post.uniqueid,
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				}

				return A_formelement;
		}

		getEvAddFormRule() {
				var A_rule = [{
						name: "evid",
						mess: "ID\uFF08\uFF19\u6841\uFF09\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "evid",
						mess: "ID\u306F\u534A\u89D2\u6570\u5B57\uFF19\u6841\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044",
						type: "regex",
						format: "/^[0-9]{9}/",
						validation: "client"
				}, {
						name: "evcoid",
						mess: "\u30AD\u30E3\u30EA\u30A2\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}];
				A_rule = array_merge(A_rule, this.makePropertyRule(this.H_Prop));
				return A_rule;
		}

		getEvModFormElement(O_manage, O_model) //キャリアの配列を生成
		//ユーザ設定項目を取得する
		//フォーム要素の配列作成
		//日付入力フォーマット
		{
				var H_co = O_model.getEvCoData();
				this.H_Prop = O_model.getManagementProperty(ManagementViewBase.EVMID);
				var A_formelement = [{
						name: "memo",
						label: "\u30E1\u30E2",
						inputtype: "textarea",
						options: {
								id: "memo",
								cols: "35",
								rows: "5"
						}
				}, {
						name: "cancel",
						label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
						inputtype: "button",
						options: {
								onClick: "javascript:ask_cancel()"
						}
				}, {
						name: "reset",
						label: "\u30EA\u30BB\u30C3\u30C8",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='?r=1'"
						}
				}, {
						name: "back",
						label: "\u5165\u529B\u753B\u9762\u3078",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
						}
				}, {
						name: "recogpostid",
						label: "",
						inputtype: "hidden"
				}, {
						name: "recogpostname",
						label: "",
						inputtype: "hidden"
				}, {
						name: "sync_flg",
						label: "",
						inputtype: "hidden"
				}];
				var H_date = O_manage.getDateFormat();
				A_formelement = array_merge(A_formelement, this.makePropertyForm(this.H_Prop, H_date));
				return A_formelement;
		}

		getEvModFormRule() {
				var A_rule = Array();
				A_rule = array_merge(A_rule, this.makePropertyRule(this.H_Prop));
				return A_rule;
		}

		getHealthcareAddModFormElement(O_manage, O_model, H_sess) //運送会社の配列を生成
		//フォーム要素の配列作成
		//ユニーク文字列生成用
		{
				var H_co = O_model.getHealthcareCoData();
				var H_date = O_manage.getDateFormat();
				var A_formelement = [{
						name: "employeecode",
						label: "\u793E\u54E1\u756A\u53F7",
						inputtype: "text",
						options: {
								id: "employeecode",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "healthid",
						label: "\u30D8\u30EB\u30B9\u30B1\u30A2ID",
						inputtype: "text",
						options: {
								id: "healthid",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "username",
						label: "\u4F7F\u7528\u8005",
						inputtype: "text",
						options: {
								id: "username",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "healthcoid",
						label: "\u53D6\u5F97\u5148",
						inputtype: "select",
						data: H_co
				}, {
						name: "registdate",
						label: "\u767B\u9332\u65E5",
						inputtype: "date",
						data: H_date
				}, {
						name: "remarks",
						label: "\u5099\u8003",
						inputtype: "text",
						options: {
								id: "remarks",
								size: "35",
								maxlength: "255"
						}
				}, {
						name: "cancel",
						label: "\u30AD\u30E3\u30F3\u30BB\u30EB",
						inputtype: "button",
						options: {
								onClick: "javascript:ask_cancel()"
						}
				}, {
						name: "reset",
						label: "\u30EA\u30BB\u30C3\u30C8",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='?r=1'"
						}
				}, {
						name: "recogpostid",
						label: "",
						inputtype: "hidden"
				}, {
						name: "recogpostname",
						label: "",
						inputtype: "hidden"
				}, {
						name: "back",
						label: "\u5165\u529B\u753B\u9762\u3078",
						inputtype: "button",
						options: {
								onClick: "javascript:location.href='" + _SERVER.PHP_SELF + "';"
						}
				}];
				var O_unique = MtUniqueString.singleton();

				if (!(undefined !== H_sess.SELF.post.uniqueid)) {
						var A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: O_unique.getNewUniqueId(),
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				} else {
						A_tmp = {
								name: "uniqueid",
								inputtype: "hidden",
								data: H_sess.SELF.post.uniqueid,
								options: {
										id: "uniqueid"
								}
						};
						A_formelement.push(A_tmp);
				}

				return A_formelement;
		}

		getHealthcareAddModFormRule() {
				var A_rule = [{
						name: "healthid",
						mess: "\u30D8\u30EB\u30B9\u30B1\u30A2ID\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
						type: "required",
						format: undefined,
						validation: "client"
				}, {
						name: "registdate",
						mess: "\u767B\u9332\u65E5\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
						type: "QRCheckdate",
						format: undefined,
						validation: "client"
				}];
				return A_rule;
		}

		checkBaseParamError(H_sess, H_g_sess) //最低限必要なセッションが無ければエラー
		{
				if (undefined !== H_sess[ManagementViewBase.PUB].cym == false || undefined !== H_sess[ManagementViewBase.PUB].current_postid == false || undefined !== H_sess[ManagementViewBase.PUB].posttarget == false) {
						this.errorOut(8, "session\u304C\u7121\u3044", false);
						throw die();
				}
		}

		getManagementCss(mid) {
				if (ManagementViewBase.TELMID == mid) {
						var css = "csManageTel";
				} else if (ManagementViewBase.ETCMID == mid) {
						css = "csManageEtc";
				} else if (ManagementViewBase.PURCHMID == mid) {
						css = "csManagePurch";
				} else if (ManagementViewBase.COPYMID == mid) {
						css = "csManageCopy";
				} else if (ManagementViewBase.ASSMID == mid) {
						css = "csManageAssets";
				} else if (ManagementViewBase.TRANMID == mid) {
						css = "csManageTran";
				} else if (ManagementViewBase.EVMID == mid) {
						css = "csManageEv";
				} else {
						css = "csManage";
				}

				return css;
		}

		convertCheckBoxValue(str) {
				var A_data = Array();
				var A_id = split(",", str);

				for (var cnt = 0; cnt < A_id.length; cnt++) {
						if (A_id[cnt] != "") {
								A_data[A_id[cnt]] = "1";
						}
				}

				return A_data;
		}

		convertReserveType(flg) {
				if (flg == ManagementViewBase.ADDMODE) {
						return "\u65B0\u898F\u767B\u9332";
				} else if (flg == ManagementViewBase.MODMODE) {
						return "\u5909\u66F4";
				} else if (flg == ManagementViewBase.MOVEMODE) {
						return "\u79FB\u52D5";
				} else if (flg == ManagementViewBase.DELMODE) {
						return "\u524A\u9664";
				}
		}

		convertReserveTypeEng(flg) {
				if (flg == ManagementViewBase.ADDMODE) {
						return "New registration";
				} else if (flg == ManagementViewBase.MODMODE) {
						return "Edit";
				} else if (flg == ManagementViewBase.MOVEMODE) {
						return "Shift";
				} else if (flg == ManagementViewBase.DELMODE) {
						return "Delete";
				}
		}

		__destruct() {
				super.__destruct();
		}

};