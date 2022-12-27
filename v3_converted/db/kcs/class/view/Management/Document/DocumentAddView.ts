//
//運送ID新規登録のView
//
//更新履歴：<br>
//2010/02/19 宝子山浩平 作成
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@uses ManagementAddViewBase
//@uses QuickFormUtil
//@uses ViewFinish
//
//
//error_reporting(E_ALL);
//
//運送ID新規登録のView
//
//@package Management
//@subpackage View
//@author houshiyama
//@since 2010/02/19
//@uses ManagementAddViewBase
//@uses QuickFormUtil
//@uses ViewFinish
//

require("view/Management/ManagementAddViewBase.php");

//
//コンストラクタ <br>
//
//ディレクトリ名とファイル名の決定<br>
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//@uses ManagementUtil
//
//
//各ページ用各権限チェック
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//運送一覧固有のsetDeraultSession
//
//@author houshiyama
//@since 2010/02/19
//
//@access protected
//@return void
//
//
//運送一覧固有のcheckCGIParam
//
//@author houshiyama
//@since 2010/02/19
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
//運送IDの新規登録フォームを作成する<br>
//
//基底クラスから新規、変更共通フォーム要素取得<br>
//新規登録固有の要素追加<br>
//フォームのオブジェクト生成<br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param object $O_manage
//@param object $O_model
//@param array $H_sess
//@access public
//@return void
//@uses QuickFormUtil
//
//
//運送ID新規登録フォームのエラーチェック作成
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
//
//全て一覧固有のdisplaySmarty
//
//@author date
//@since 2015/08/14
//
//@param mixed $H_session
//@param mixed $H_tree
//@param mixed $A_data
//@access public
//@return void
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
//@access public
//@return void
//@uses HTML_QuickForm_Renderer_ArraySmarty
//
//
//パンくずリンク用配列を返す
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return array
//
//
//ヘッダーに埋め込むjavascriptを返す
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
//
//完了画面表示 <br>
//
//セッションクリア <br>
//2重登録防止メソッド呼び出し <br>
//完了画面表示 <br>
//
//@author houshiyama
//@since 2010/02/19
//
//@param array $H_sess
//@access protected
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2010/02/19
//
//@access public
//@return void
//
class DocumentAddView extends ManagementAddViewBase {
	constructor() {
		super();
	}

	checkCustomAuth() {
		var A_auth = this.getAllAuth();

		if (-1 !== A_auth.indexOf("fnc_document_manage_up") == false) {
			this.errorOut(6, "\u6A29\u9650\u304C\u7121\u3044", false, "./menu.php");
		}
	}

	setDefaultSessionPeculiar() {}

	checkCGIParamPeculiar() {}

	getAddFormElement(O_manage, O_model, H_sess) //日付入力フォーマット
	//フォーム要素の配列作成
	//ユニーク文字列生成用
	{
		var year = date("Y");
		var H_date = O_manage.getDateFormat(year);
		var A_formelement = [{
			name: "comment",
			label: "\u8AAC\u660E\u6587",
			inputtype: "textarea",
			options: {
				id: "memo",
				cols: "35",
				rows: "5"
			}
		}, {
			name: "file",
			label: "\u6DFB\u4ED8\u30D5\u30A1\u30A4\u30EB",
			inputtype: "file"
		}, {
			name: "enddate",
			label: "\u63B2\u8F09\u671F\u9650",
			inputtype: "date",
			data: H_date
		}, {
			name: "use_header",
			label: "\u30BF\u30A4\u30C8\u30EB\u884C\u306E\u6709\u7121",
			inputtype: "checkbox"
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

	makeAddForm(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォーム要素取得
	//クイックフォームオブジェクト生成
	{
		var A_formelement = this.getAddFormElement(O_manage, O_model, H_sess);
		var A_tmp = {
			name: "addsubmit",
			label: this.NextName,
			inputtype: "submit"
		};
		A_formelement.push(A_tmp);
		A_tmp = {
			name: "flag",
			label: "",
			inputtype: "hidden"
		};
		A_formelement.push(A_tmp);
		this.H_View.O_AddFormUtil = new QuickFormUtil("form");
		this.H_View.O_AddFormUtil.setFormElement(A_formelement);
		this.O_AddForm = this.H_View.O_AddFormUtil.makeFormObject();
	}

	makeAddRule(O_manage, O_model, H_sess: {} | any[]) //基底クラスから新規登録フォームルール取得
	//ここで使用する自作関数の読込
	{
		var A_rule = [{
			name: "file",
			mess: "\u30D5\u30A1\u30A4\u30EB\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "enddate",
			mess: "\u63B2\u8F09\u671F\u9650\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
			type: "required",
			format: undefined,
			validation: "client"
		}, {
			name: "enddate",
			mess: "\u63B2\u8F09\u671F\u9650\u306F\u5E74\u6708\u65E5\u3059\u3079\u3066\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u5B58\u5728\u3057\u306A\u3044\u65E5\u4ED8\u306E\u6307\u5B9A\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRCheckdate",
			format: undefined,
			validation: "client"
		}, {
			name: "enddate",
			mess: "\u63B2\u8F09\u671F\u9650\u306F\u904E\u53BB\u306E\u65E5\u4ED8\u306F\u9078\u629E\u3067\u304D\u307E\u305B\u3093\u3002",
			type: "QRManagementDateBefore",
			format: undefined,
			validation: "client"
		}];
		var A_orgrule = ["QRCheckDate", "QRIntNumeric", "QRalnumRegex"];
		this.H_View.O_AddFormUtil.registerOriginalRules(A_orgrule);
		this.H_View.O_AddFormUtil.setJsWarningsWrapper("\u4EE5\u4E0B\u306E\u9805\u76EE\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\n", "\n\u6B63\u3057\u304F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044");
		this.H_View.O_AddFormUtil.setRequiredNoteWrapper("<font color=red>\u203B\u306F\u5FC5\u9808\u9805\u76EE\u3067\u3059</font>");
		this.H_View.O_AddFormUtil.makeFormRule(A_rule);
	}

	displaySmartyPeculiar(H_sess: {} | any[], A_auth: {} | any[]) {}

	displaySmarty(H_sess: {} | any[], A_auth: {} | any[], warning = "") //QuickFormとSmartyの合体
	//表示用部署名
	//部署名
	//assign
	//ページ固有の表示処理
	//display
	{
		var O_renderer = new HTML_QuickForm_Renderer_ArraySmarty(this.get_Smarty());
		this.O_AddForm.accept(O_renderer);
		var O_post = new MtPostUtil();
		var recogpostname = O_post.getPostTreeBand(this.O_Sess.pactid, this.O_Sess.postid, H_sess.SELF.post.recogpostid, "", " -> ", "", 1, true, false);
		this.get_Smarty().assign("upload", H_sess.SELF.upload);
		this.get_Smarty().assign("su", this.O_Sess.su);
		this.get_Smarty().assign("page_path", this.H_View.pankuzu_link);
		this.get_Smarty().assign("O_form", O_renderer.toArray());
		this.get_Smarty().assign("propcnt", this.H_Prop.length);
		this.get_Smarty().assign("H_tree", this.H_View.H_tree);
		this.get_Smarty().assign("js", this.H_View.js);
		this.get_Smarty().assign("post_name", recogpostname);
		this.get_Smarty().assign("A_auth", A_auth);
		this.get_Smarty().assign("warning", warning);
		this.displaySmartyPeculiar(H_sess, A_auth);
		this.get_Smarty().display(this.getDefaultTemplate());
	}

	makePankuzuLinkHash() {
		var H_link = {
			"/Management/Document/menu.php": "\u7BA1\u7406\u60C5\u5831",
			"": "\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9"
		};
		return H_link;
	}

	getHeaderJS() {}

	uploadFile(pactid, userid) //ユニークファイル名を生成
	////	ファイルを置くディレクトリ
	//   	    $up_dir = KCS_DIR . "/files/" . $pactid . "/";
	//        if(file_exists($up_dir) == false || is_dir($up_dir) == false){
	//			//	そのディレクトリは存在しないのでtmpにする
	//   	        @mkdir($up_dir);
	//        }
	//ファイルは保持しないことになったのでtmpにおいてしまう
	//ファイル名の生成
	//ファイル情報の取得(元ファイル名など入ってる)
	//一意なファイル名を生成する
	//
	//リネームする
	//添付ファイルがある場合はファイルを/files以下に保存
	//セッション
	//$this->H_Dir["upload"] = $H_file_attr;
	//$this->O_Sess->setPub( self::PUB, $this->H_Dir );
	{
		var message = Array();

		if (_FILES.file.name == "") {
			return "";
		}

		if (_FILES.file.name != "" && preg_match("/\\.(csv|tsv)$/i", _FILES.file.name) == false) {
			message.push("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u53EF\u80FD\u306A\u62E1\u5F35\u5B50\u306Fcsv\u3001tsv\u306E\u307F\u3067\u3059");
		}

		if (_FILES.file.size >= 1024 * 1024 * 3) {
			message.push("\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u53EF\u80FD\u306A\u30B5\u30A4\u30BA\u306F3Mbyte\u4EE5\u4E0B\u306B\u306A\u308A\u307E\u3059\u3002");
		}

		if (!!message) {
			return message;
		}

		var upload_info = Array();
		mkdir(up_dir);
		var getfile = pathinfo(_FILES.file.name);
		var tmpf_name = tempnam(up_dir, "upload_" + userid + "_");
		var f_name = tmpf_name + "." + getfile.extension;
		rename(tmpf_name, f_name);

		if (move_uploaded_file(_FILES.file.tmp_name, f_name) == true) //添付のファイルサイズを取得
			{
				var up_filesize = _FILES.file.size;

				if (up_filesize > 1024) {
					if (up_filesize > 1024 * 1024) {
						up_filesize = sprintf("%0.1f", up_filesize / (1024 * 1024)) + " Mbyte";
					} else {
						up_filesize = sprintf("%0.1f", up_filesize / 1024) + " Kbyte";
					}
				}

				var H_file_attr = {
					up_file: f_name,
					up_type: up_type,
					up_filesize: up_filesize,
					up_name: _FILES.file.name,
					filestat: _FILES.file.error
				};
			} else //失敗した
			{
				H_file_attr = {
					filestat: _FILES.file.error
				};
			}

		this.H_Local.upload = H_file_attr;
		this.O_Sess.setSelfAll(this.H_Local);
		return message;
	}

	endAddView(H_sess: {} | any[]) //セッションクリア
	//2重登録防止メソッド
	//完了画面表示
	{
		this.O_Sess.clearSessionSelf();
		this.writeLastForm();
		var O_finish = new ViewFinish();
		O_finish.displayFinish("\u6DFB\u4ED8\u8CC7\u6599\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9", "/Management/Document/menu.php", "\u4E00\u89A7\u753B\u9762\u3078");
	}

	__destruct() {
		super.__destruct();
	}

};