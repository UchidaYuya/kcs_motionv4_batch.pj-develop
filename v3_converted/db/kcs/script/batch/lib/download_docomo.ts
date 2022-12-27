//===========================================================================
/// @file download_docomo.php
///
/// @brief ドコモ新サイト(2007/07～)対応のクランプダウンロード
///
/// @author morihara
//===========================================================================
//require_once("HTTP/Client.php");
//クランプ新サイトのURL(セキュア)
//クランプ新サイトのURL(プレーン)
//クランプ新サイトのディレクトリのうち、最上位
//スクリプトの文字コード
//ダウンロード対象のファイルの有無チェック用ログ 20151006伊達
//月次のファイル種別・フォームのtype・解説
//MB	M	400	請求
//RMF	F	501	FOMA通信明細
//RMA	A	503	FOMAパケット通信明細
//RMW	W	502	WORLD CALL通信明細(FOMA)
//RMJ	J	504	WORLD WING通信明細(FOMA)
//RMG	G	505	WORLD WINGパケット通信明細(FOMA)
//RMT	T	506	mova料金明細
//RMP	D	510	パケット通信明細（mova）
//RMK	K	507	WORLD CALL通信明細（mova）
//RMN	N	508	WORLD WING通信明細(mova)
//RMR	R	509	WORLD WINGパケット通信明細(mova)
//RMS	S	511	廃止(PHS料金明細)
//RML	-	-	廃止(WorldWalker携帯海外から)
//RMI	-	-	情報料
//BL	-	-	請求書情報
//日次のファイル種別・フォームのtype・解説
//PA	A	請求内訳・内訳項目パターン(2009/10以降)
//PB	B	請求内訳・標準パターン
//PC	C	請求内訳・料金分類パターン
//PD	D	請求内訳・内訳項目パターン(2009/09まで)AとDが入れ替わった
//RF	1	請求明細・FOMA通信料
//RA	2	請求明細・FOMAパケット通信量
//RW	3	請求明細・WORLD CALL通信料(FOMA)
//RT	5	請求明細・mova通話料
//RD	6	請求明細・パケット通信量(mova)
//RK	7	請求明細・WORLD CALL通信料(mova)
//RS	B	請求明細・廃止(PHS通話料)
//HTTP_Request_Listenerを使っても最大メモリ削減効果がなくなったので、
//利用を取りやめた。
//○情報料以外の明細のダウンロード画面の挙動
//5秒ごとにjavascriptで画面をリロードして、
//ファイルの準備ができたらダウンロードボタンが出現する。
//
//○情報料の明細のダウンロード画面の挙動
//ダウンロードボタンを押すと、postパラメータを付けて同じ画面に戻る。
//ただし、ページロード時のjavascriptがダウンロードフォームを自動実行する。
//このフォームがある事を確認して自動実行すればダウンロードが可能。
//
//○データが無い年月・種別の明細を取得しようとした時の挙動
//404NotFoundである。
//
//○パスワードが違っている場合の挙動
//ログインPOST実行後のcookieの要素数がゼロ(成功なら2)。
//ログイン直後のページのタイトルが
//「法人向けサービスサイト入口（ログイン）【ドコモビジネスプレミアクラブ】」
//になっている。成功した場合は「ドコモビジネスプレミアクラブ」
//===========================================================================
/// @brief SAXハンドラの基底型

require("HttpClient2.php");

require("XML/XML_HTMLSax.php");

require("lib/script_log.php");

require("lib/script_common.php");

const DOCOMO_CLAMP_URL = "https://www.mydocomo.com";
const DOCOMO_CLAMP_URL_PLAIN = "http://www.mydocomo.com";
const DOCOMO_CLAMP_PATH_TOP = "/dcm";
const SCRIPT_CODE = "UTF-8";

function __write_log(log) {
	var dir = KCS_DIR + "/log/dl_docomo";

	if (file_exists(dir) == false) {
		mkdir(dir);
	}

	dir += "/" + date("Ym");

	if (file_exists(dir) == false) {
		mkdir(dir);
	}

	var file = fopen(dir + "/" + date("Ymd") + ".log", "a");
	fputs(file, log);
	fclose(file);
};

/// @brief コンストラクタ
/// @brief パーサにハンドラを設定する
/// @brief タグが開いた
/// @brief タグが閉じた
/// @brief テキスト(タグに囲まれた部分)
/// @brief エスケープ(HTMLのコメントなど)
/// @brief PHPソースがあらわれた
/// @brief JavaScriptが現れた
class download_docomo_sax_listener_base_type {
	download_docomo_sax_listener_base_type() {}

	set_handler(O_parser) {
		O_parser.set_object(this);
		O_parser.set_element_handler("on_open", "on_close");
		O_parser.set_data_handler("on_text");
		O_parser.set_escape_handler("on_escape");
		O_parser.set_pi_handler("on_php");
		O_parser.set_jasp_handler("on_script");
	}

	on_open(O_parser, name, H_attr) {}

	on_close(O_parser, name) {}

	on_text(O_parser, data) {}

	on_escape(O_parser, data) {}

	on_php(O_parser, target, data) {}

	on_script(O_parser, data) {}

};

/// @brief 蓄積結果
/// @brief コンストラクタ
/// @brief 内容を初期化する
/// @brief 保存している内容を返す
///
/// このメソッドが返すのは配列。
/// 配列の各要素はXML_HTMLSaxから受け取った構成要素で、
/// 以下の要素を持つハッシュである。
/// <table>
///  <tr><th>キー</th><th>値</th></tr>
///  <tr><td>type</td>
///   <td>open,close,text,escape,php,scriptのいずれか</td></tr>
///  <tr><td>data</td><td>構成要素の内容</td></tr>
///  <tr><td>attr</td>
///   <td>タグのパラメータのハッシュ(typeがopenのみ存在)</td></tr>
///  <tr><td>target</td>
///   <td>言語のパラメータ(typeがphpのみ存在)</td></tr>
/// </table>
/// @brief タグが開いた
/// @brief タグが閉じた
/// @brief テキスト(タグに囲まれた部分)
/// @brief エスケープ(HTMLのコメントなど)
/// @brief PHPソースがあらわれた
/// @brief JavaScriptが現れた
class download_docomo_sax_listener_type extends download_docomo_sax_listener_base_type {
	download_docomo_sax_listener_type() {
		this.download_docomo_sax_listener_base_type();
		this.clear();
	}

	clear() {
		this.m_A_body = Array();
	}

	get_result() {
		return this.m_A_body;
	}

	on_open(O_parser, name, H_attr) {
		this.m_A_body.push({
			type: "open",
			data: name,
			attr: H_attr
		});
	}

	on_close(O_parser, name) {
		this.m_A_body.push({
			type: "close",
			data: name
		});
	}

	on_text(O_parser, data) {
		this.m_A_body.push({
			type: "text",
			data: data
		});
	}

	on_escape(O_parser, data) {
		this.m_A_body.push({
			type: "escape",
			data: data
		});
	}

	on_php(O_parser, target, data) {
		this.m_A_body.push({
			type: "php",
			data: data,
			target: target
		});
	}

	on_script(O_parser, data) {
		this.m_A_body.push({
			type: "script",
			data: data
		});
	}

};

/// @brief download_docomo_sax_listener_typeの解析結果
/// @brief 解析前の本文
/// @brief コンストラクタ
/// @brief HTMLのうち、タグを除いた本文だけを返す
/// @brief 解析結果がジャンプページならtrueを返す
/// @brief hrefタグから、特定の文字列を含むURLを抜き出す
/// @return URLを返す(見つからなければ空文字列を返す)
/// @brief ページのタイトルを返す
/// @brief フォームを取り出して、最初のフォームから
/// 目的地のURLとパラメータを取り出す
/// @return 正常処理できたらtrueを返す
/// @brief フォームをすべて取り出す
///
/// このメソッドの返値は、配列。
/// 配列の各要素は、一個のフォームの情報を保持するハッシュ。
/// ハッシュの構成は以下の通り。
/// <table>
///  <tr><th>キー</th><th>値</th></tr>
///  <tr><td>input</td><td>要素ハッシュ</td></tr>
///  <tr><td>select</td><td>選択要素配列</td></tr>
///  <tr><td>それ以外(小文字に変換済)</td>
///   <td>formタグのパラメータ</td></tr>
/// </table>
/// 要素ハッシュは、formに含まれるformタグに含まれる
/// パラメータを含む。要素ハッシュのキーは小文字に変換済。<br>
/// 選択要素配列は、以下のハッシュが、selectの個数だけ存在する。
/// <table>
///  <tr><th>キー</th><th>値</th></tr>
///  <tr><td>option</td>
///   <td>select内部のoption要素のパラメータ配列</td></tr>
///  <tr><td>それ以外(小文字に変換済)</td>
///   <td>selectタグのパラメータ</td></tr>
/// </table>
/// @brief フォームを一個渡して、目的地のURLとinputパラメータを返す
///
/// inputパラメータは、HIDDEN,TEXT,SELECTのみ対応している。
/// @return 正常処理できたらtrueを返す
/// @brief フォームを一個渡して、selectに含まれる選択肢をすべて取り出す
/// @return 正常処理できたらtrueを返す
/// @brief 最初のフォームに対してparse_form_selectを実行する
/// @return 正常処理できたらtrueを返す
/// @brief 最初のフォームのselectから年月をすべて取り出す
/// @return 正常処理できたらtrueを返す
/// @brief データ集計分析メニューから、目的のリンクを探し出す
/// @brief 確定情報・請求別・料金明細へのURLを捜す
/// @brief 日次情報・請求別・請求内訳へのURLを探す
/// @brief 日次情報・請求別・料金明細へのURLを探す
/// @brief 請求書情報へのURLを捜す
/// @brief ログインが割り込まれたらtrueを返す
class download_docomo_html_parser_type {
	download_docomo_html_parser_type(body) //ZIPならHTMLではないのでファイルサイズをゼロにする
	//パーサを作成する
	//ハンドラを作成する
	//解析する
	//パーサ内部の循環参照を解決する
	//XML_HTMLSax2.1.2の段階での内部構成に依存している
	//パーサを解放する
	{
		this.m_A_body = Array();
		if (2 <= body.length && !strcmp("PK", body.substr(0, 2))) body = "";
		var enc = mb_detect_encoding(body);
		body = mb_convert_encoding(body, SCRIPT_CODE, enc);
		this.m_original_body = body;
		var O_parser = new XML_HTMLSax();
		O_parser.set_option("XML_OPTION_TRIM_DATA_NODES");
		var O_listener = new download_docomo_sax_listener_type();
		O_listener.set_handler(O_parser);
		O_parser.parse(body);
		this.m_A_body = O_listener.get_result();
		O_parser.state_parser = undefined;
		O_parser = undefined;
		O_listener = undefined;
	}

	get_text(is_original = false) {
		if (is_original) return this.m_original_body;
		var text = "";
		var is_script = false;

		for (var H_item of Object.values(this.m_A_body)) //JavaScript開始なら、蓄積を中止する
		{
			if (!strcmp("open", H_item.type) && !strcasecmp("script", H_item.data)) is_script = true;
			if (!strcmp("close", H_item.type) && !strcasecmp("script", H_item.data)) is_script = false;

			if (!strcmp("text", H_item.type)) {
				if (!is_script) text += H_item.data;
			}
		}

		return text;
	}

	is_jump() //解析結果から、本文だけを取り出す
	//蓄積済みの本文から空白を取り除く
	//本文がゼロバイトならtrueを返す
	{
		var text = this.get_text();
		text = text.trim();
		return 0 == text.length;
	}

	find_url(url) //見つからなかったので空文字列を返す
	{
		for (var H_item of Object.values(this.m_A_body)) //Aタグなら内部を処理する
		{
			if (!strcmp("open", H_item.type) && !strcasecmp("a", H_item.data)) {
				{
					let _tmp_0 = H_item.attr;

					for (var key in _tmp_0) //hrefパラメータがあれば内部を処理する
					{
						var value = _tmp_0[key];

						if (!strcasecmp(key, "href")) //検索内容がURLに含まれていなければ無視する
							{
								if (false === strpos(value, url)) continue;
								return value;
							}
					}
				}
			}
		}

		return "";
	}

	get_title() //蓄積した内容を返す
	{
		var title = "";
		var is_title = false;

		for (var H_item of Object.values(this.m_A_body)) //title開始なら、蓄積を開始する
		{
			if (!strcmp("open", H_item.type) && !strcasecmp("title", H_item.data)) is_title = true;
			if (!strcmp("close", H_item.type) && !strcasecmp("title", H_item.data)) break;
			if (!strcmp("close", H_item.type) && !strcasecmp("head", H_item.data)) break;
			if (!strcmp("open", H_item.type) && !strcasecmp("body", H_item.data)) break;
			if (!strcmp("text", H_item.type) && is_title) title += H_item.data;
		}

		return title;
	}

	parse_form_1st(url, H_param, is_H_param_first = false) //フォームを取り出す
	{
		url = "";
		H_param = Array();
		var A_form = this.get_form();
		if (1 != A_form.length) return false;
		return this.parse_form(url, H_param, A_form[0], is_H_param_first);
	}

	get_form() {
		var A_form = Array();
		var H_cur = Array();
		var H_select = Array();

		for (var H_item of Object.values(this.m_A_body)) {
			if (!strcmp("open", H_item.type) && !strcasecmp("form", H_item.data)) //フォーム開始である
				{
					H_cur.input = Array();
					H_cur.select = Array();
					{
						let _tmp_1 = H_item.attr;

						for (var key in _tmp_1) {
							var value = _tmp_1[key];
							H_cur[key.toLowerCase()] = value;
						}
					}
				}

			if (!strcmp("close", H_item.type) && !strcasecmp("form", H_item.data)) //フォーム終了である
				{
					A_form.push(H_cur);
					H_cur = Array();
				}

			if (!strcmp("open", H_item.type) && !strcasecmp("input", H_item.data)) //入力項目である
				{
					var H_param = Array();
					{
						let _tmp_2 = H_item.attr;

						for (var key in _tmp_2) {
							var value = _tmp_2[key];
							H_param[key.toLowerCase()] = value;
						}
					}
					H_cur.input.push(H_param);
				}

			if (!strcmp("open", H_item.type) && !strcasecmp("select", H_item.data)) //選択要素開始である
				{
					H_select = Array();
					{
						let _tmp_3 = H_item.attr;

						for (var key in _tmp_3) {
							var value = _tmp_3[key];
							H_select[key.toLowerCase()] = value;
						}
					}
					H_select.option = Array();
				}

			if (!strcmp("close", H_item.type) && !strcasecmp("select", H_item.data)) //選択要素終了である
				{
					H_cur.select.push(H_select);
					H_select = Array();
				}

			if (!strcmp("open", H_item.type) && !strcasecmp("option", H_item.data)) //選択要素の要素である
				{
					var H_attr = Array();
					{
						let _tmp_4 = H_item.attr;

						for (var key in _tmp_4) {
							var value = _tmp_4[key];
							H_attr[key.toLowerCase()] = value;
						}
					}
					H_select.option.push(H_attr);
				}
		}

		if (H_select.length && undefined !== H_cur.select) H_cur.select.push(H_select);
		if (H_cur.length) A_form.push(H_cur);
		return A_form;
	}

	parse_form(url, H_param, H_form, is_H_param_first = false) //URLを取り出す(無ければfalseを返す)
	//selectに対してループする
	{
		url = "";
		H_param = Array();
		url = undefined !== H_form.action ? H_form.action : "";
		if (0 == url.length) return false;

		for (var H_attr of Object.values(H_form.input)) {
			var type = undefined !== H_attr.type ? H_attr.type : "";
			if (strcasecmp(type, "hidden") && strcasecmp(type, "text")) continue;
			var name = undefined !== H_attr.name ? H_attr.name : "";
			if (0 == name.length) continue;
			var value = undefined !== H_attr.value ? H_attr.value : "";
			if (is_H_param_first && undefined !== H_param[name]) continue;
			H_param[name] = value;
		}

		for (var H_select of Object.values(H_form.select)) //selectに含まれたoptionに対してループする
		//結果を保存する
		{
			name = undefined !== H_select.name ? H_select.name : "";
			if (0 == name.length) continue;
			if (!(undefined !== H_select.option) || !Array.isArray(H_select.option)) continue;
			var selected = "";

			for (var H_option of Object.values(H_select.option)) {
				value = undefined !== H_option.value ? H_option.value : "";
				if (0 == value.length) continue;
				if (0 == selected.length) selected = value;

				if (undefined !== H_option.selected) {
					selected = value;
					break;
				}
			}

			H_param[name] = selected;
		}

		return true;
	}

	parse_form_select(A_value, H_form, name) //selectに対してループする
	{
		A_value = Array();

		for (var H_select of Object.values(H_form.select)) {
			var value = undefined !== H_select.name ? H_select.name : "";
			if (strcmp(name, value)) continue;

			for (var H_option of Object.values(H_select.option)) {
				value = undefined !== H_option.value ? H_option.value : "";
				if (0 == value.length) continue;
				A_value.push(value);
			}

			break;
		}

		return true;
	}

	parse_form_select_1st(A_value, name) //フォームを取り出す
	{
		A_value = Array();
		var A_form = this.get_form();
		if (1 != A_form.length) return false;
		return this.parse_form_select(A_value, A_form[0], name);
	}

	parse_ym_1st(A_ym, name) //年月を日付順にソートする
	{
		var A_value = Array();
		if (!this.parse_form_select_1st(A_value, name)) return false;
		A_ym = Array();

		for (var value of Object.values(A_value)) {
			var value = value.trim();
			if (6 != value.length) continue;
			var year = value.substr(0, 4);
			var month = value.substr(4, 2);
			if (!ctype_digit(year) || !ctype_digit(month)) continue;
			if (month <= 0 || 12 < month) continue;
			var A_item = {
				year: year,
				month: month
			};
			if (false !== array_search(A_item, A_ym)) continue;
			A_ym.push(A_item);
		}

		var A_src = A_ym;
		A_ym = Array();
		var A_idx = Array();

		while (A_idx.length < A_src.length) //最も古い年月を選ぶ
		{
			var idx = 0;

			for (var cnt = 0; cnt < A_src.length; ++cnt) {
				if (-1 !== A_idx.indexOf(cnt)) continue;
				idx = cnt;
				break;
			}

			for (cnt = 1;; cnt < A_src.length; ++cnt) {
				if (-1 !== A_idx.indexOf(cnt)) continue;
				var A_0 = A_src[idx];
				var A_1 = A_src[cnt];
				if (A_0.year < A_1.year) continue;
				if (A_0.year == A_1.year && A_0.month <= A_1.month) continue;
				idx = cnt;
			}

			A_ym.push(A_src[idx]);
			A_idx.push(idx);
		}

		return true;
	}

	find_link(key_1, key_2) //リンクを捜す
	//目的のリンクが無いので空文字列を返す
	//末尾からカンマを捜し、二つに分割する
	//無ければ空文字列を返す
	//分割した文字列の前後のカンマを取り除く
	//前後の文字列をアンドでつないで返す
	{
		var on_click = "";

		for (var H_item of Object.values(this.m_A_body)) //Aタグなら内部を処理する
		{
			if (!strcmp("open", H_item.type) && !strcasecmp("a", H_item.data)) //全パラメータから、hrefとonclickを抜き出す
				//hrefとonclickが無ければ無視する
				{
					var href = "";
					var onclick = "";
					{
						let _tmp_5 = H_item.attr;

						for (var key in _tmp_5) {
							var value = _tmp_5[key];
							if (!strcasecmp("href", key)) href = value;
							if (!strcasecmp("onclick", key)) onclick = value;
						}
					}
					if (0 == href.length || 0 == onclick.length || strcmp("#", href)) continue;
					if (false === strpos(onclick, key_1)) continue;
					if (false === strpos(onclick, key_2)) continue;
					on_click = onclick;
					break;
				}
		}

		if (0 == on_click.length) return "";
		var begin = strpos(on_click, "(");
		var end = strpos(on_click, ")");
		if (false === begin || false === end) return "";
		on_click = on_click.substr(begin + 1, end - begin - 1);
		var pos = strrpos(on_click, ",");
		if (false === pos) return "";
		var A_str = Array();
		A_str[0] = on_click.substr(0, pos);
		A_str[1] = on_click.substr(pos + 1);

		for (var cnt = 0; cnt < A_str.length; ++cnt) {
			var str = A_str[cnt];
			if (str.length && "'" == str[0]) str = str.substr(1);
			if (str.length && "'" == str[str.length - 1]) str = str.substr(0, str.length - 1);
			A_str[cnt] = str;
		}

		return A_str[0] + "&" + A_str[1];
	}

	find_info() {
		return this.find_link("ghbdp001.srv", "&YKID=2&BSID=2");
	}

	find_p() {
		return this.find_link("ghbbp001.srv", "&YKID=1&BSID=2");
	}

	find_daily() {
		return this.find_link("ghbdp001.srv", "&YKID=1&BSID=2");
	}

	find_bill() {
		return this.find_link("ghdbp001.srv", "scid=GHDAGW001&BSID=2");
	}

	is_break() {
		var title = this.get_title();
		if (false !== strpos(title, "\u5165\u53E3\uFF08\u30ED\u30B0\u30A4\u30F3\uFF09")) return true;
		if (false !== strpos(title, "docomo \u30ED\u30B0\u30A4\u30F3")) return true;
		return false;
	}

};

/// @brief (HTTP_Client) ダウンロードインスタンス
/// @brief (download_docomo_html_parser_type) SAXパーサ
/// @brief コンストラクタ
/// @brief 二段階認証のクッキーを登録する
/// @brief 内容をファイルに保存する
/// @brief POSTする
/// @brief GETする
/// @brief 取得したデータをSAXを使って解析する
/// @brief パーサを返す
/// @brief 現在のURLを設定する
/// @brief 取得したURLを返す
/// @brief URLを補う
/// @brief URLにGETパラメータを追加して返すする
/// @brief 取得したファイルの本体を返す
/// @brief 取得したファイルがzipファイルならtrueを返す
/// @brief クッキーのハッシュを返す
/// @brief ジャンプページを読み飛ばす
/// @return ジャンプに成功したら1を、
/// 上限までジャンプしたか不明なページに迷い込んだら0を、
/// 継続利用が必要なら3を、
/// ログインが割り込まれたら2を返す
class download_docomo_client_type {
	download_docomo_client_type(proxy_host, proxy_port, proxy_param = Array()) //FJプロキシ対応(これ必要？)
	//$this->m_O_client->setDefaultHeader("User-Agent", " HTTP_Request2/2.0.0RC1");
	{
		var H_param = {
			timeout: 3600,
			ssl_verify_peer: false,
			ssl_verify_host: false
		};

		if (proxy_host.length && proxy_port.length) {
			H_param.proxy_host = proxy_host;
			H_param.proxy_port = proxy_port;

			for (var key in proxy_param) {
				var value = proxy_param[key];
				H_param[key] = value;
			}
		}

		this.m_O_client = new HTTP_Client(H_param);
		this.m_O_parser = new download_docomo_html_parser_type("");
	}

	addRegistCookie(cookie1) {
		var O_cookie = this.m_O_client.getCookieManager();
		O_cookie.addCookie({
			name: "g_smt_omitbrowser",
			value: cookie1,
			domain: ".smt.docomo.ne.jp",
			path: "/",
			secure: "1"
		});
	}

	save(fname) {
		var fp = fopen(fname, "wb");
		if (false === fp) return false;
		fwrite(fp, this.get_body());
		fclose(fp);
		return true;
	}

	post(url, H_param, pre_encoded = false) {
		if (!url.length) throw new Error("download_docomo_client_type::post('')");
		this.m_O_client.post(url, H_param, pre_encoded);
		this.parse();
	}

	get(url, H_param) {
		if (!url.length) throw new Error("download_docomo_client_type::get('')");
		this.m_O_client.get(url, H_param);
		this.parse();
	}

	parse() {
		this.m_O_parser = new download_docomo_html_parser_type(this.get_body());
	}

	get_parser() {
		return this.m_O_parser;
	}

	set_url(url) {
		this.m_O_client.setDefaultHeader("Referer", url);
	}

	get_url() {
		if (undefined !== this.m_O_client) {
			var H_header = this.m_O_client.getDefaultHeader();
			if (undefined !== H_header.Referer) return H_header.Referer;
		}

		return "";
	}

	replenish_url(url, current = "") {
		if (0 == current.length) current = this.get_url();
		if (0 == url.length) return current;

		if (!strcmp("/", url[0])) {
			var H_url = parse_url(current);
			var prefix = H_url.scheme;
			if (prefix.length) prefix += "://";
			prefix += H_url.host;
			return prefix + url;
		}

		if (false === strpos(url, "/") || !strcmp(".", url[0])) //URLのスラッシュ以前を補う
			{
				prefix = current;
				var pos = strrpos(prefix, "/");

				if (false !== pos) {
					return prefix.substr(0, pos + 1) + url;
				}
			}

		return url;
	}

	add_get_param(url, key, value) {
		if (0 == key.length) return url;
		if (value.length) key = key + "=" + value;
		if (false === strpos(url, "?")) url += "?";else url += "&";
		url += key;
		return url;
	}

	get_body() {
		var H_response = this.m_O_client.currentResponse();
		if (undefined !== H_response.body) return H_response.body;
		return "";
	}

	is_zip() //ファイル本体の先頭2バイトが「PK」ならZIPファイルである
	{
		var body = this.get_body();
		if (body.length < 2) return false;
		var prefix = body.substr(0, 2);
		return !strcmp(prefix, "PK");
	}

	get_cookie() {
		var O_cookie = this.m_O_client.getCookieManager();
		if (!(undefined !== O_cookie)) return Array();
		return O_cookie.getCookies();
	}

	skip_jumppage(limit) //上限まで行ったのでfalseを返す
	{
		for (var cnt = 0; cnt < limit; ++cnt) //割り込まれたら処理終了する
		{
			var O_parser = this.get_parser();
			if (O_parser.is_break()) return 2;
			if (!O_parser.is_jump()) return 1;
			var url = "";
			var H_param = Array();
			if (!O_parser.parse_form_1st(url, H_param)) return 0;
			if (0 == url.length) return 0;

			if (!strcmp("/", url[0])) {
				var post = url;
				var H_url = parse_url(this.get_url());
				url = H_url.scheme;
				if (url.length) url += "://";
				url += H_url.host;
				url = url + post;
			}

			this.post(url, H_param);
		}

		return 0;
	}

};

/// @brief (download_docomo_client_type) ダウンロード機能
/// @brief ユーザID
/// @brief パスワード
/// @brief 情報料以外と情報料の分岐ページのURL
/// @brief 情報料以外と情報料の分岐ページの情報料以外のURL
/// @brief 情報料以外と情報料の分岐ページの情報料のURL
/// @brief 分岐ページの請求書情報のURL
/// @brief 情報料以外のリファラ
/// @brief 情報料以外のURL
/// @brief 情報料以外のPOSTパラメータ
/// @brief 情報料以外のダウンロード可能な年月
/// @brief 情報料のリファラ
/// @brief 情報料のURL
/// @brief 情報料のPOSTパラメータ
/// @brief 情報料のダウンロード可能な年月
/// @brief 請求書情報のリファラ
/// @brief 請求書情報のURL
/// @brief 請求書情報のPOSTパラメータ
/// @brief 請求書情報のダウンロード可能な年月
/// @brief 日次請求内訳のリファラ
/// @brief 日次請求内訳のURL
/// @brief 日次請求内訳のPOSTパラメータ
/// @brief 日次料金内訳のリファラ
/// @brief 日次料金内訳のURL
/// @brief 日次料金内訳のPOSTパラメータ
/// @brief ネットワーク暗証番号
/// @brief コンストラクタ
/// @brief 請求明細のファイル種別を配列で返す
/// @brief 通話料明細のファイル種別を配列で返す
/// @brief 情報料明細のファイル種別を配列で返す
/// @brief 請求書情報のファイル種別を配列で返す
/// @brief 日次情報・請求内訳のファイル種別を配列で返す
/// @brief 日次情報・料金明細のファイル種別を配列で返す
/// @brief ログインする
/// @return ログインできたら0を、
/// パスワード不正なら1を、
/// ログインが割り込まれたら2を、
/// ログイン処理中にHTTPS通信が切れたら4を、
/// IDがロックされていたら5を、
/// 申込が未完了なら6を、
/// 二段階認証が有効になっているが、端末登録されていないなら7を、
/// 二段階認証が有効だが、端末クッキーが無効になっているなら8を、
/// その他の理由で失敗したら3を返す
/// @brief ログインに失敗した時に、目的のURLが存在するか確認する
/// @return 接続に失敗したらfalseを返す
/// @brief 情報料以外のダウンロードの準備をする
/// @return 準備できたら0を、パスワード不正なら1を、
/// ログインが割り込まれたら2を、
/// その他の理由で失敗したら3を返す
/// @brief 請求書情報のダウンロードの準備をする
/// @return 準備できたら0を、パスワード不正なら1を、
/// ログインが割り込まれたら2を、
/// その他の理由で失敗したら3を返す
/// @brief 情報料のダウンロードの準備をする
/// @return 準備できたら0を、パスワード不正なら1を、
/// ログインが割り込まれたら2を、
/// その他の理由で失敗したら3を、
/// ネットワーク暗証番号が不正なら4を返す
/// @brief 日次請求内訳のダウンロードの準備をする
/// @return 準備できたら0を、パスワード不正なら1を、
/// ログインが割り込まれたら2を、
/// その他の理由で失敗したら3を返す
/// @brief 日次料金内訳のダウンロードの準備をする
/// @return 準備できたら0を、パスワード不正なら1を、
/// ログインが割り込まれたら2を、
/// その他の理由で失敗したら3を、
/// ネットワーク暗証番号不正なら4を返す
/// @brief 情報料以外のファイルをダウンロードする
/// @return ダウンロードできたら0を、
/// ファイルが無ければ1を、
/// ログインに割り込まれたら2を、
/// その他のエラーが発生したら3を、
/// ネットワーク暗証番号が不正なら4を返す
/// @brief 請求書情報のファイルをダウンロードする
/// @return ダウンロードできたら0を、
/// ファイルが無ければ1を、
/// ログインに割り込まれたら2を、
/// その他のエラーが発生したら3を返す
/// @brief 情報料のファイルをダウンロードする
/// @return ダウンロードできたら0を、
/// ファイルが無ければ1を、
/// ログインに割り込まれたら2を、
/// その他のエラーが発生したら3を返す
/// @brief 日次情報・請求内訳をダウンロードする
/// @return ダウンロードできたら0を、
/// ファイルが無ければ1を、
/// ログインに割り込まれたら2を、
/// その他のエラーが発生したら3を返す
/// @brief 日次情報・料金明細のファイルをダウンロードする
/// @return ダウンロードできたら0を、
/// ファイルが無ければ1を、
/// ログインに割り込まれたら2を、
/// その他のエラーが発生したら3を返す
/// @brief ZIPファイルを解凍する
///
/// ZIPファイルに複数のファイルが含まれていれば、
/// 一個に連結される。ZIPファイルの削除は行わない。
/// @return 解凍に失敗したらfalseを返す
/// @brief ファイルを取得する
/// @return ダウンロードできたら0を、
/// ファイルが無ければ1を、
/// ログインに割り込まれたら2を、
/// その他のエラーが発生したら3を返す
/// @brief 渡された年月の前月の月末の日付を返す
/// @brief 渡された年月の月末の日付を返す
/// @brief URLから、crmを取り除く(2018/05から適用された)
class download_docomo_type extends ScriptLogAdaptor {
	download_docomo_type(O_listener, proxy_host, proxy_port, proxy_param = Array()) {
		this.ScriptLogAdaptor(O_listener, true);
		this.m_O_client = new download_docomo_client_type(proxy_host, proxy_port, proxy_param);
	}

	get_type_details() {
		return G_CLAMP_DOCOMO_TEL_TYPE.split(",");
	}

	get_type_comm() {
		return G_CLAMP_DOCOMO_COMM_TYPE.split(",");
	}

	get_type_info() {
		return G_CLAMP_DOCOMO_INFO_TYPE.split(",");
	}

	get_type_bill() {
		return G_CLAMP_DOCOMO_BILL_TYPE.split(",");
	}

	get_type_p() {
		return "PA,PB,PC".split(",");
	}

	get_type_daily() {
		return "RF,RA,RW,RT,RD,RK,RS".split(",");
	}

	login(userid, password, cookie1, pin, is_primary = false) //IDを送信する
	//パスワードを送信してログインする
	//ログインできたら、クッキーがある筈
	//申込が終わっていない
	//料金明細画面とデータ集計分析へのURLを取得する
	{
		this.m_userid = userid;
		this.m_password = password;
		this.m_pin = pin;
		var url = "";
		var H_param = Array();

		if (is_primary) //トップページ(主ID)を取得する
			//ページタイトルは、
			//ドコモビジネスプレミアクラブ会員様専用入口（ログイン）
			//【ドコモビジネスプレミアクラブ】
			//トップページのログインフォームを取り出す
			{
				this.m_O_client.get(DOCOMO_CLAMP_URL + DOCOMO_CLAMP_PATH_TOP + "/dfw/web/pub1/top/", Array());
				var O_parser = this.m_O_client.get_parser();

				if (!O_parser.parse_form_1st(url, H_param)) {
					this.putError(G_SCRIPT_DEBUG, "\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8\u30D5\u30A9\u30FC\u30E0\u7121\u3057(\u4E3BID)" + this.m_userid);
					return 3;
				}
			} else //トップページ(副ID)を取得する
			//ページタイトルは、
			//法人向けサービスサイト入口（ログイン）
			//【ドコモビジネスプレミアクラブ】
			//トップページのログインフォームを取り出す
			{
				this.m_O_client.get(DOCOMO_CLAMP_URL + DOCOMO_CLAMP_PATH_TOP + "/dfw/billing/bbilling/srv/ghadp001.srv", Array());
				O_parser = this.m_O_client.get_parser();
				var A_form = O_parser.get_form();

				if (A_form.length < 1 || !O_parser.parse_form(url, H_param, A_form[0])) {
					this.putError(G_SCRIPT_DEBUG, "\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8\u30D5\u30A9\u30FC\u30E0\u7121\u3057(\u526FID)" + this.m_userid);
					return 3;
				}
			}

		if (cookie1.length) this.m_O_client.addRegistCookie(cookie1);
		url = this.m_O_client.replenish_url(url);
		H_param.authid = this.m_userid;
		this.m_O_client.post(url, H_param);
		O_parser = this.m_O_client.get_parser();
		A_form = O_parser.get_form();

		if (A_form.length < 1 || !O_parser.parse_form(url, H_param, A_form[0])) {
			if (cookie1.length) {
				this.putError(G_SCRIPT_DEBUG, "\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u304C\u6709\u52B9\u3060\u304C\u3001\u7AEF\u672B\u30AF\u30C3\u30AD\u30FC\u304C\u7121\u52B9\u306B\u306A\u3063\u3066\u3044\u308B" + this.m_userid);
				return 8;
			} else {
				this.putError(G_SCRIPT_DEBUG, "\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u304C\u6709\u52B9\u306B\u306A\u3063\u3066\u3044\u308B\u304C\u3001\u7AEF\u672B\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044" + this.m_userid);
				return 7;
			}
		}

		url = this.m_O_client.replenish_url(url);
		H_param.authpass = this.m_password;
		this.m_O_client.post(url, H_param);
		var A_cookie = this.m_O_client.get_cookie();
		var is_cookie = false;

		for (var H of Object.values(A_cookie)) {
			for (var key in H) {
				var value = H[key];

				if ("name" === key) {
					if ("chkck" === value || "g_smt_authmanipulate" == value || "g_smt_omitbrowser" == value) //これらは、ログイン失敗時も存在するので無視する
						{} else //ログインできた
						{
							is_cookie = true;
						}
				}
			}
		}

		if (!is_cookie) //IDがロックされていないか確認する
			{
				O_parser = this.m_O_client.get_parser();

				if (false !== strpos(O_parser.get_text(), "\u30ED\u30C3\u30AF\u3055\u308C\u3066\u3044\u308B\u305F\u3081")) {
					this.putError(G_SCRIPT_DEBUG, "ID\u304C\u30ED\u30C3\u30AF\u3055\u308C\u3066\u3044\u308B" + this.m_userid);
					return 5;
				}

				A_form = O_parser.get_form();

				if (!A_form.length) //フォームが無いので、HTTPS通信失敗と見なす
					{
						this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5F8C\u306E\u753B\u9762\u306B\u30D5\u30A9\u30FC\u30E0\u304C\u7121\u3044" + this.m_userid);
						return 4;
					}

				this.putError(G_SCRIPT_DEBUG, "\u30D1\u30B9\u30EF\u30FC\u30C9\u304B\u30E6\u30FC\u30B6ID\u4E0D\u6B63" + this.m_userid);
				return 1;
			}

		O_parser = this.m_O_client.get_parser();

		if (false !== strpos(O_parser.get_title(), "\u7D99\u7D9A\u5229\u7528\u6848\u5185")) {
			this.putError(G_SCRIPT_DEBUG, "\u7D99\u7D9A\u5229\u7528\u304C\u5FC5\u8981\u3067\u3059" + this.m_userid);
			return 6;
		}

		this.m_O_client.get(DOCOMO_CLAMP_URL + DOCOMO_CLAMP_PATH_TOP + "/dfw/billing/bbilling/srv/ghadp001.srv", Array());
		var pagename = "(\u8ACB\u6C42\u66F8\u30C7\u30FC\u30BF\u66F4\u65B0\u72B6\u6CC1)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		O_parser = this.m_O_client.get_parser();

		if (false !== strpos(O_parser.get_text(), "\u304A\u7533\u3057\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059") || false !== strpos(O_parser.get_title(), "\u3054\u5229\u7528\u898F\u7D04")) {
			this.putError(G_SCRIPT_DEBUG, "\u304A\u7533\u3057\u8FBC\u307F\u304C\u5FC5\u8981\u3067\u3059" + this.m_userid);
			return 6;
		}

		var url_root = this.m_O_client.get_url();
		O_parser = this.m_O_client.get_parser();
		var url_details = O_parser.find_url("ghibp001.srv");

		if (0 == url_details.length) //二段階認証を有効にしているが、端末登録されていないか確認する
			{
				if (false !== strpos(this.m_O_client.get_body(), "<input type=\"hidden\" name=\"arcv\" value=\"")) {
					if (cookie1.length) {
						this.putError(G_SCRIPT_DEBUG, "\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u304C\u6709\u52B9\u3060\u304C\u3001\u7AEF\u672B\u30AF\u30C3\u30AD\u30FC\u304C\u7121\u52B9\u306B\u306A\u3063\u3066\u3044\u308B" + pagename + this.m_userid);
						return 8;
					} else {
						this.putError(G_SCRIPT_DEBUG, "\u4E8C\u6BB5\u968E\u8A8D\u8A3C\u304C\u6709\u52B9\u306B\u306A\u3063\u3066\u3044\u308B\u304C\u3001\u7AEF\u672B\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044" + pagename + this.m_userid);
						return 7;
					}
				}

				this.putError(G_SCRIPT_DEBUG, "\u6599\u91D1\u660E\u7D30\u753B\u9762\u30EA\u30F3\u30AF\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
				return 3;
			}

		var url_info = O_parser.find_url("ghbap001.srv");

		if (0 == url_info.length) {
			this.putError(G_SCRIPT_DEBUG, "\u30C7\u30FC\u30BF\u96C6\u8A08\u5206\u6790\u30EA\u30F3\u30AF\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 3;
		}

		var url_bill = O_parser.find_url("ghdap001.srv");

		if (0 == url_bill.length) //見つからなくても正常動作とする
			{}

		this.m_url_root = url_root;
		this.m_url_root_details = this.m_O_client.replenish_url(url_details);
		this.m_url_root_info = this.m_O_client.replenish_url(url_info);
		if (url_bill.length) this.m_url_root_bill = this.m_O_client.replenish_url(url_bill);else this.m_url_root_bill = "";
		return 0;
	}

	check_connection() {
		var url = DOCOMO_CLAMP_URL_PLAIN;
		var O_request = new HTTP_Request("", {
			timeout: 3600,
			readTimeout: [3600, 0]
		});
		O_request.setURL(url);
		var O_response = O_request.sendRequest();
		if (PEAR.isError(O_response)) return false;
		O_response = undefined;
		O_request = undefined;
		return true;
	}

	prepare_details() //料金明細画面へ
	//ページタイトルは、明細データダウンロード選択
	//全て
	{
		this.m_O_client.set_url(this.m_url_root);
		var url = this.m_url_root_details;
		this.m_O_client.get(url, Array());
		var pagename = "(\u660E\u7D30\u30C7\u30FC\u30BF\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u9078\u629E)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		var O_parser = this.m_O_client.get_parser();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u4E0D\u6B63" + pagename + this.m_userid);
			return 3;
		}

		url = this.m_O_client.add_get_param(url, "root_GHIBGW001SubmitZipDownload=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.root_GHIBGW001_SHIBORIKOMIHANNI = "ALL";
		this.m_referer_details = this.m_O_client.get_url();
		this.m_url_details = url;
		this.m_H_param_details = H_param;
		var A_ym = Array();

		if (!O_parser.parse_form_select_1st(A_ym, "root_GHIBGW001_SEIKYUNENGETSU")) {
			this.putError(G_SCRIPT_DEBUG, "\u6708\u6B21\u8ACB\u6C42\u306E\u5E74\u6708\u9078\u629E\u80A2\u5B58\u5728\u305B\u305A" + pagename + this.m_userid);
			return 3;
		}

		this.m_H_ym_details = A_ym;
		return 0;
	}

	prepare_bill() //請求書情報へのリンクがなければ、準備が出来た事にする
	//請求書情報フォーム画面へ
	//フォームを取り出す
	//圧縮ダウンロード
	//請求書内訳情報
	//全て
	{
		if (!this.m_url_root_bill.length) return 0;
		this.m_O_client.set_url(this.m_url_root);
		var url = this.m_url_root_bill;
		this.m_O_client.get(url, Array());
		var pagename = "(\u8ACB\u6C42\u66F8\u60C5\u5831\u30EA\u30F3\u30AF\u9078\u629E\u753B\u9762)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		var O_parser = this.m_O_client.get_parser();

		if (false !== strpos(O_parser.get_text(), "\u3053\u306E\u753B\u9762\u3092\u8868\u793A\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093\u3002")) {
			this.m_url_root_bill = "";
			return 0;
		}

		var H_param = Array();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 2;
		}

		url = O_parser.find_bill();

		if (!url.length) {
			this.putError(G_SCRIPT_DEBUG, "\u30EA\u30F3\u30AF\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 2;
		}

		url = this.m_O_client.replenish_url(url);
		pagename = "(\u8ACB\u6C42\u66F8\u60C5\u5831\u30D5\u30A9\u30FC\u30E0\u753B\u9762)";
		this.m_O_client.post(url, H_param);

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		O_parser = this.m_O_client.get_parser();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 2;
		}

		var A_ym = Array();

		if (!O_parser.parse_form_select_1st(A_ym, "root_GHDBGW001_HOUJINHYOJITAISHONENGETSU")) {
			this.putError(G_SCRIPT_DEBUG, "\u5E74\u6708\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 3;
		}

		url = this.m_O_client.add_get_param(url, "root_GHDBGW001SubmitCompDownLoad=", "");
		url = this.m_O_client.replenish_url(url);

		if (false === strpos(url, "?")) {
			url += "?BSID=2";
		} else {
			var pos = strpos(url, "?");
			url = url.substr(0, pos) + "?BSID=2&" + url.substr(pos + 1, url.length);
		}

		H_param.root_GHDBGW001_UCHIWAKESHUBETSU = 1;
		H_param.root_GHDBGW001_HYOJIOYADENWABANGO = " ";
		this.m_referer_bill = this.m_O_client.get_url();
		this.m_url_bill = url;
		this.m_H_param_bill = H_param;
		this.m_H_ym_bill = A_ym;
		return 0;
	}

	prepare_info() //リファラを元に戻す
	//データ集計分析へ
	//ページタイトルは、データ集計分析メニュー
	//確定情報・請求別・料金明細へ
	//ページタイトルは、料金明細検索条件指定
	//ネットワーク暗証番号を入力する
	//全て
	{
		this.m_O_client.set_url(this.m_url_root);
		var url = this.m_url_root_info;
		url = this.m_O_client.replenish_url(url);
		this.m_O_client.get(url, Array());
		var pagename = "(\u30C7\u30FC\u30BF\u96C6\u8A08\u5206\u6790\u30E1\u30CB\u30E5\u30FC)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		var O_parser = this.m_O_client.get_parser();
		url = O_parser.find_info();

		if (0 == url.length) {
			this.putError(G_SCRIPT_DEBUG, "\u30EA\u30F3\u30AF\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 3;
		}

		var url_next = url;

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u4E0D\u6B63" + pagename + this.m_userid);
			return 3;
		}

		url = url_next;
		url = this.m_O_client.replenish_url(url);
		this.m_O_client.post(url, H_param);
		O_parser = this.m_O_client.get_parser();

		if (false !== strpos(O_parser.get_text(), "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B")) {
			if (!O_parser.parse_form_1st(url, H_param)) {
				this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				__write_log("\t\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				return 3;
			}

			H_param.nwTextBox = this.m_pin;
			url = this.m_O_client.replenish_url(url);
			this.m_O_client.post(url, H_param);
			pagename = "(\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B\u5F8C\uFF1A\u60C5\u5831\u6599)";
			O_parser = this.m_O_client.get_parser();

			if (false !== strpos(O_parser.get_title(), "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B\u30A8\u30E9\u30FC")) {
				this.putError(G_SCRIPT_DEBUG, "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u4E0D\u6B63" + pagename + this.m_userid);

				__write_log("\t\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u4E0D\u6B63" + pagename + this.m_userid);

				return 4;
			}
		}

		pagename = "(\u6599\u91D1\u660E\u7D30\u691C\u7D22\u6761\u4EF6\u6307\u5B9A:\u60C5\u5831\u6599)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		O_parser = this.m_O_client.get_parser();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u4E0D\u6B63" + pagename + this.m_userid);
			return 3;
		}

		var postfix = "";

		if (false !== strrpos(url, "?")) {
			var pos = strpos(url, "?");
			postfix = url.substr(pos + 1);
			url = url.substr(0, pos);
		}

		url = this.m_O_client.add_get_param(url, "YKID", 2);
		url = this.m_O_client.add_get_param(url, "BSID", 2);
		url = this.m_O_client.add_get_param(url, postfix, "");
		url = this.m_O_client.add_get_param(url, "root_GHBDGW001SubmitCompDownLoad", "");
		url = this.m_O_client.replenish_url(url);
		H_param.root_GHBDGW001_HYOJIOYADENWABANGO = " ";
		this.m_referer_info = this.m_O_client.get_url();
		this.m_url_info = url;
		this.m_H_param_info = H_param;
		var A_ym = Array();

		if (!O_parser.parse_form_select_1st(A_ym, "root_GHBDGW001_HOUJINHYOJITAISHONENGETSU")) {
			this.putError(G_SCRIPT_DEBUG, "\u6708\u6B21\u60C5\u5831\u306E\u5E74\u6708\u9078\u629E\u80A2\u5B58\u5728\u305B\u305A" + pagename + this.m_userid);
			return 3;
		}

		this.m_H_ym_info = A_ym;
		return 0;
	}

	prepare_p(A_ym) //リファラを元に戻す
	//データ集計分析へ
	//ページタイトルは、データ集計分析メニュー
	//日次情報・請求別・請求明細へ
	//ページタイトルは、請求内訳検索条件指定
	//リファラ・目的URL・POSTパラメータを保存する
	//電話番号一覧
	//電話番号の昇順
	//全て
	//削除する
	//残りは請求年月と科目パターン
	{
		A_ym = Array();
		this.m_O_client.set_url(this.m_url_root);
		var url = this.m_url_root_info;
		url = this.m_O_client.replenish_url(url);
		this.m_O_client.get(url, Array());
		var pagename = "(\u30C7\u30FC\u30BF\u96C6\u8A08\u5206\u6790\u30E1\u30CB\u30E5\u30FC/\u65E5\u6B21\u60C5\u5831\u30FB\u8ACB\u6C42\u5225\u30FB\u8ACB\u6C42\u5185\u8A33)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		var O_parser = this.m_O_client.get_parser();
		url = O_parser.find_p();

		if (0 == url.length) {
			this.putError(G_SCRIPT_DEBUG, "\u30EA\u30F3\u30AF\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 3;
		}

		var url_next = url;

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u4E0D\u6B63" + pagename + this.m_userid);
			return 3;
		}

		url = url_next;
		url = this.m_O_client.replenish_url(url);
		this.m_O_client.post(url, H_param);
		pagename = "(\u8ACB\u6C42\u5185\u8A33\u691C\u7D22\u6761\u4EF6\u6307\u5B9A:\u65E5\u6B21\u60C5\u5831)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		O_parser = this.m_O_client.get_parser();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u4E0D\u6B63" + pagename + this.m_userid);
			return 3;
		}

		O_parser.parse_ym_1st(A_ym, "root_GHBBGW001_HOUJINHYOJITAISHONENGETSU");
		var postfix = "";

		if (false !== strrpos(url, "?")) {
			var pos = strpos(url, "?");
			postfix = url.substr(pos + 1);
			url = url.substr(0, pos);
		}

		url = this.m_O_client.add_get_param(url, "YKID", 1);
		url = this.m_O_client.add_get_param(url, "BSID", 2);
		url = this.m_O_client.add_get_param(url, postfix, "");
		url = this.m_O_client.add_get_param(url, "root_GHBBGW001SubmitZipDownload=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.root_GHBBGW001_UCHIWAKESHUBETSU = "2";
		H_param.root_GHBBGW001_NARABIJUN = "4";
		H_param.root_GHBBGW001_HYOJIOYADENWABANGO = " ";
		delete H_param.root_GHBBGW001_NARABIJUNDETA;
		this.m_referer_p = this.m_O_client.get_url();
		this.m_url_p = url;
		this.m_H_param_p = H_param;
		return 0;
	}

	prepare_daily(A_ym) //リファラを元に戻す
	//データ集計分析へ
	//ページタイトルは、データ集計分析メニュー
	//日次情報・請求別・料金明細へ
	//ページタイトルは、料金明細検索条件指定
	//ネットワーク暗証番号を入力する
	//リファラ・目的URL・POSTパラメータを保存する
	//全て
	{
		this.m_O_client.set_url(this.m_url_root);
		var url = this.m_url_root_info;
		url = this.m_O_client.replenish_url(url);
		this.m_O_client.get(url, Array());
		var pagename = "(\u30C7\u30FC\u30BF\u96C6\u8A08\u5206\u6790\u30E1\u30CB\u30E5\u30FC/\u65E5\u6B21\u60C5\u5831\u30FB\u8ACB\u6C42\u5225\u30FB\u6599\u91D1\u5185\u8A33)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		var O_parser = this.m_O_client.get_parser();
		url = O_parser.find_daily();

		if (0 == url.length) {
			this.putError(G_SCRIPT_DEBUG, "\u30EA\u30F3\u30AF\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 3;
		}

		var url_next = url;

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u4E0D\u6B63" + pagename + this.m_userid);
			return 3;
		}

		url = url_next;
		url = this.m_O_client.replenish_url(url);
		this.m_O_client.post(url, H_param);
		O_parser = this.m_O_client.get_parser();

		if (false !== strpos(O_parser.get_text(), "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B")) {
			if (!O_parser.parse_form_1st(url, H_param)) {
				this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				__write_log("\t\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				return 3;
			}

			H_param.nwTextBox = this.m_pin;
			url = this.m_O_client.replenish_url(url);
			this.m_O_client.post(url, H_param);
			pagename = "(\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B\u5F8C\uFF1A\u65E5\u6B21)";
			O_parser = this.m_O_client.get_parser();

			if (false !== strpos(O_parser.get_title(), "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B\u30A8\u30E9\u30FC")) {
				this.putError(G_SCRIPT_DEBUG, "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u4E0D\u6B63" + pagename + this.m_userid);

				__write_log("\t\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u4E0D\u6B63" + pagename + this.m_userid);

				return 4;
			}
		}

		pagename = "(\u6599\u91D1\u660E\u7D30\u691C\u7D22\u6761\u4EF6\u6307\u5B9A:\u65E5\u6B21\u60C5\u5831)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		O_parser = this.m_O_client.get_parser();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u4E0D\u6B63" + pagename + this.m_userid);
			return 3;
		}

		O_parser.parse_ym_1st(A_ym, "root_GHBDGW001_HOUJINHYOJITAISHONENGETSU");
		var postfix = "";

		if (false !== strrpos(url, "?")) {
			var pos = strpos(url, "?");
			postfix = url.substr(pos + 1);
			url = url.substr(0, pos);
		}

		url = this.m_O_client.add_get_param(url, "YKID", 1);
		url = this.m_O_client.add_get_param(url, "BSID", 2);
		url = this.m_O_client.add_get_param(url, postfix, "");
		url = this.m_O_client.add_get_param(url, "root_GHBDGW001SubmitCompDownLoad=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.root_GHBDGW001_HYOJIOYADENWABANGO = " ";
		this.m_referer_daily = this.m_O_client.get_url();
		this.m_url_daily = url;
		this.m_H_param_daily = H_param;
		return 0;
	}

	get_details(year, month, type, tgtname, A_fname) //フォーム実行する
	//当月のデータがまだ無い場合は、ページタイトルはBusiness Online-Error
	//当月のデータはあるが、該当のファイル種別だけが無い場合は、
	//本文に「対象データが存在しません」との文言があり、
	//以後の遷移も可能だが、ZIPファイルのかわりにHTMLファイルが来て、
	//そのタイトルが「404 Not Found」であり、また
	//ダウンロード直前のページタイトルが「Business Online-Error」
	//URLからcrmを取り除く
	//POSTデータをクランプサイトが受け入れ可能な形式に並び替える
	{
		A_fname = Array();
		var url = "";
		var H_param = Array();
		var type_orig = type;

		switch (type) {
			case "MB":
				type = "400";
				break;

			case "RMF":
				type = "501";
				break;

			case "RMA":
				type = "503";
				break;

			case "RMW":
				type = "502";
				break;

			case "RMJ":
				type = "504";
				break;

			case "RMG":
				type = "505";
				break;

			case "RMT":
				type = "506";
				break;

			case "RMP":
				type = "510";
				break;

			case "RMK":
				type = "507";
				break;

			case "RMN":
				type = "508";
				break;

			case "RMR":
				type = "509";
				break;

			case "RMS":
				return 1;

			case "RML":
				return 1;

			default:
				this.putError(G_SCRIPT_WARNING, "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB\u7A2E\u5225" + type);
				return 3;
		}

		__write_log("\n" + date("Y-m-d H:i:s"));

		__write_log("\tget_details");

		__write_log("\t" + type_orig);

		this.m_O_client.set_url(this.m_referer_details);
		url = this.m_url_details;
		this.eraseCrm(url, this.m_referer_details);
		var ym = sprintf("%04d%02d", year, month);
		H_param = this.m_H_param_details;
		H_param.root_GHIBGW001_FAIRUKUBUN = type;
		H_param.root_GHIBGW001_SEIKYUNENGETSU = ym;
		var idx = -1;

		for (var cnt = 0; cnt < this.m_H_ym_details.length; ++cnt) {
			if (!strcmp(this.m_H_ym_details[cnt], ym)) {
				idx = cnt;
				break;
			}
		}

		if (-1 == idx) //年月が選択肢にない
			{
				__write_log("\t\u5E74\u6708\u304C\u9078\u629E\u80A2\u306B\u306A\u3044(" + ym + ")");

				return 1;
			}

		H_param.root_selectedLine = idx;

		if (!(undefined !== H_param.watool_txSequence) || !(undefined !== H_param.root_GHIBGW001_SHIBORIKOMIHANNI)) {
			this.putError(G_SCRIPT_WARNING, "\u6708\u6B21\u8ACB\u6C42\u306E\u5FC5\u9808POST\u9805\u76EE\u304C\u7121\u3044");

			__write_log("\t\u6708\u6B21\u8ACB\u6C42\u306E\u5FC5\u9808POST\u9805\u76EE\u304C\u7121\u3044");

			return 3;
		}

		var param = "watool_txSequence=" + str_replace("!", "%21", H_param.watool_txSequence);
		param += "&root_GHIBGW001_FAIRUKUBUN=" + H_param.root_GHIBGW001_FAIRUKUBUN;
		param += "&root_GHIBGW001_SEIKYUNENGETSU=" + H_param.root_GHIBGW001_SEIKYUNENGETSU;
		param += "&root_GHIBGW001_SHIBORIKOMIHANNI=" + H_param.root_GHIBGW001_SHIBORIKOMIHANNI;
		param += "&root_selectedLine=" + H_param.root_selectedLine;
		param += "&root_GHIBGW001_SEIKYUNENGETSU=watoolEmptyValue";
		param += "&root_GHIBGW001_SHIBORIKOMIHANNI=watoolEmptyValue";
		param += "&root_GHIBGW001_FAIRUKUBUN=watoolEmptyValue";
		this.m_O_client.post(url, param, true);
		var pagename = "(\u8ACB\u6C42\u660E\u7D30\u53D6\u5F97\u30D5\u30A9\u30FC\u30E0\u5B9F\u884C\u5F8C)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);

				__write_log("\t\u4E0D\u660E\u306A\u30DA\u30FC\u30B8");

				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		var O_parser = this.m_O_client.get_parser();

		if (false !== strpos(O_parser.get_title(), "Business Online-Error")) {
			__write_log("\tBusiness Online-Error");

			return 1;
		}

		if (false !== strpos(O_parser.get_text(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093")) {
			__write_log("\t\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");

			return 1;
		}

		if (false !== strpos(O_parser.get_text(), "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B")) {
			if (!O_parser.parse_form_1st(url, H_param, true)) {
				this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				__write_log("\t\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				return 3;
			}

			H_param.nwTextBox = this.m_pin;
			url = this.m_O_client.replenish_url(url);
			this.m_O_client.post(url, H_param);
			pagename = "(\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B\u5F8C)";
			O_parser = this.m_O_client.get_parser();

			if (false !== strpos(O_parser.get_title(), "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u5165\u529B\u30A8\u30E9\u30FC")) {
				this.putError(G_SCRIPT_DEBUG, "\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u4E0D\u6B63" + pagename + this.m_userid);

				__write_log("\t\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u6697\u8A3C\u756A\u53F7\u4E0D\u6B63" + pagename + this.m_userid);

				return 4;
			}

			switch (this.m_O_client.skip_jumppage(4)) {
				case 0:
					this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);

					__write_log("\t\u4E0D\u660E\u306A\u30DA\u30FC\u30B8");

					return 3;

				case 2:
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
					return 2;
			}

			O_parser = this.m_O_client.get_parser();

			if (false !== strpos(O_parser.get_title(), "Business Online-Error")) {
				__write_log("\tBusiness Online-Error");

				return 1;
			}

			if (false !== strpos(O_parser.get_text(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093")) {
				__write_log("\t\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093");

				return 1;
			}
		}

		var is_ready = false;
		var A_timeout = [1, 4, 5];

		for (cnt = 0;; cnt < 181; ++cnt) {
			if (60 == cnt) this.putError(G_SCRIPT_DEBUG, "clamp\u5074\u306E\u30D5\u30A1\u30A4\u30EB\u6E96\u5099\u30675\u5206\u4EE5\u4E0A\u7D4C\u904E" + "/\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u51E6\u7406\u306F\u7D99\u7D9A\u4E2D");
			pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30DC\u30BF\u30F3\u5F85\u6A5F" + cnt + ")";
			var timeout = undefined !== A_timeout[cnt] ? A_timeout[cnt] : A_timeout[A_timeout.length - 1];
			sleep(timeout);
			O_parser = this.m_O_client.get_parser();

			if (O_parser.is_break()) {
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				__write_log("\t\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				return 2;
			}

			if (!O_parser.parse_form_1st(url, H_param)) {
				this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				__write_log("\t\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

				return 3;
			}

			url = this.m_O_client.add_get_param(url, "root_GHIBGW002SubmitRefresh=", "");
			url = this.m_O_client.replenish_url(url);
			this.m_O_client.post(url, H_param);

			switch (this.m_O_client.skip_jumppage(4)) {
				case 0:
					this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8(1)" + pagename + this.m_userid);

					__write_log("\t\u4E0D\u660E\u306A\u30DA\u30FC\u30B8(1)" + pagename + this.m_userid);

					return 3;

				case 2:
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

					__write_log("\t\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

					return 2;
			}

			O_parser = this.m_O_client.get_parser();
			var title = O_parser.get_title();

			if (false === strpos(title, "\u30B7\u30B9\u30C6\u30E0\u7528\u30C7\u30FC\u30BF\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9") && false === strpos(O_parser.get_text(true), "\u30B7\u30B9\u30C6\u30E0\u7528\u30C7\u30FC\u30BF\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9")) {
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8(2)" + pagename + this.m_userid);

				__write_log("\t\u4E0D\u660E\u306A\u30DA\u30FC\u30B8(2)" + pagename + this.m_userid);

				return 3;
			}

			if (false !== strpos(O_parser.get_text(true), "root_GHIBGW003SubmitDownload")) {
				is_ready = true;
				break;
			}

			if (false !== strpos(title, "\u5B8C\u4E86")) {
				is_ready = true;
				break;
			}
		}

		if (!is_ready) {
			this.putError(G_SCRIPT_DEBUG, "clamp\u5074\u3067\u306E\u30D5\u30A1\u30A4\u30EB\u6E96\u5099\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8/\u51E6\u7406\u7D9A\u884C/" + type + "/" + this.m_userid);

			__write_log("\tclamp\u5074\u3067\u306E\u30D5\u30A1\u30A4\u30EB\u6E96\u5099\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8/\u51E6\u7406\u7D9A\u884C/" + type + "/" + this.m_userid);

			return 1;
		}

		O_parser = this.m_O_client.get_parser();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

			__write_log("\t\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

			return 3;
		}

		url = this.m_O_client.add_get_param(url, "root_GHIBGW003SubmitDownload=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.root_selectedLine = "0";
		this.m_O_client.post(url, H_param);
		pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u81EA\u52D5\u5B9F\u884C)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);

				__write_log("\t\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);

				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				__write_log("\t\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				return 2;
		}

		O_parser = this.m_O_client.get_parser();

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

			__write_log("\t\u30D5\u30A9\u30FC\u30E0\u7121\u3057" + pagename + this.m_userid);

			return 3;
		}

		url = this.m_O_client.add_get_param(url, "root_GHIBGW003SubmitDownload=&BisAutoSubmissionREQUEST=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.alreadyAutoSubmit = "true";
		this.m_O_client.post(url, H_param);
		pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8ACB\u6C42ZIP)";

		if (!this.m_O_client.is_zip()) //ダウンロードしたのがZIPではない
			{
				O_parser = this.m_O_client.get_parser();

				if (O_parser.is_break()) {
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

					__write_log("\t\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

					return 2;
				}

				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB" + pagename + this.m_userid);

				__write_log("\t\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB" + pagename + this.m_userid);

				return 3;
			}

		var fname = sprintf(tgtname, 0);

		if (!this.m_O_client.save(fname)) {
			this.putError(G_SCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + fname + ")" + this.m_userid);

			__write_log("\t\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + fname + ")" + this.m_userid);

			return 3;
		}

		__write_log("\tOK  " + fname);

		A_fname.push(fname);
		return 0;
	}

	get_bill(year, month, tgtname, A_fname) {
		A_fname = Array();
		var url = "";
		var H_param = Array();
		if (!this.m_url_root_bill.length) return 1;
		this.m_O_client.set_url(this.m_referer_bill);
		url = this.m_url_bill;
		H_param = this.m_H_param_bill;
		var A_ym = this.m_H_ym_bill;
		var ym = sprintf("%04d%02d", year, month);
		var idx = -1;

		__write_log("\n" + date("Y-m-d H:i:s"));

		__write_log("\tget_bill");

		for (var cnt = 0; cnt < this.m_H_ym_bill.length; ++cnt) {
			if (!strcmp(this.m_H_ym_bill[cnt], ym)) {
				idx = cnt;
				break;
			}
		}

		if (-1 == idx) //年月が選択肢にない
			{
				__write_log("\t\u5E74\u6708\u304C\u9078\u629E\u80A2\u306B\u306A\u3044(" + ym + ")");

				return 1;
			}

		H_param.root_GHDBGW001_HOUJINHYOJITAISHONENGETSU = ym;
		this.m_O_client.post(url, H_param);
		var O_parser = this.m_O_client.get_parser();
		var pagename = "(\u8ACB\u6C42\u66F8\u60C5\u5831\u53D6\u5F97\u30D5\u30A9\u30FC\u30E0\u5B9F\u884C\u5F8C)";

		if (false !== strpos(O_parser.get_title(), "Business Online-Error") || false !== strpos(O_parser.get_title(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093") || false !== strpos(O_parser.get_title(), "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F")) {
			__write_log("\tBusiness Online-Error");

			return 1;
		}

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);

				__write_log("\t\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);

				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				__write_log("\t\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				return 2;
		}

		if (false !== strpos(O_parser.get_title(), "Business Online-Error") || false !== strpos(O_parser.get_title(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093") || false !== strpos(O_parser.get_title(), "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F")) {
			__write_log("\tBusiness Online-Error" + pagename + this.m_userid);

			return 1;
		}

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);

			__write_log("\t\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);

			return 3;
		}

		var postfix = "";

		if (false !== strrpos(url, "?")) {
			var pos = strpos(url, "?");
			postfix = url.substr(pos + 1);
			url = url.substr(0, pos);
		}

		url = this.m_O_client.add_get_param(url, postfix, "");
		url = this.m_O_client.add_get_param(url, "root_GHDBGW001SubmitCompDownLoad=", "");
		url = this.m_O_client.add_get_param(url, "BisAutoSubmissionREQUEST=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.alreadyAutoSubmit = "true";
		this.m_O_client.post(url, H_param);
		pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8ACB\u6C42\u66F8\u60C5\u5831ZIP)";
		var A_timeout = [1, 4, 5];
		var is_ready = false;

		for (cnt = 0;; cnt < 181; ++cnt) {
			if (60 == cnt) this.putError(G_SCRIPT_DEBUG, "clamp\u5074\u306E\u30D5\u30A1\u30A4\u30EB\u6E96\u5099\u30675\u5206\u4EE5\u4E0A\u7D4C\u904E" + "/\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u51E6\u7406\u306F\u7D99\u7D9A\u4E2D");
			pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u8ACB\u6C42\u66F8\u60C5\u5831ZIP\u5F85\u6A5F" + cnt + ")";
			var timeout = undefined !== A_timeout[cnt] ? A_timeout[cnt] : A_timeout[A_timeout.length - 1];
			sleep(timeout);

			if (this.m_O_client.is_zip()) {
				is_ready = true;
				break;
			}

			O_parser = this.m_O_client.get_parser();

			if (false !== strpos(O_parser.get_title(), "Business Online-Error") || false !== strpos(O_parser.get_title(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093") || false !== strpos(O_parser.get_title(), "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F")) {
				__write_log("\tBusiness Online-Error");

				return 1;
			}

			if (O_parser.is_break()) {
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				__write_log("\t\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);

				return 2;
			}

			if (false !== strpos(O_parser.get_text(), "\u672C\u65E5\u304A\u7533\u3057\u8FBC\u307F\u3044\u305F\u3060\u3044\u305F\u304A\u5BA2\u69D8")) {
				this.putError(G_SCRIPT_INFO, "\u5951\u7D04\u76F4\u5F8C\u3067\u30AF\u30E9\u30F3\u30D7\u30B5\u30A4\u30C8\u306B\u307E\u3060\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u306A\u3044" + pagename + this.m_userid);

				__write_log("\t\u5951\u7D04\u76F4\u5F8C\u3067\u30AF\u30E9\u30F3\u30D7\u30B5\u30A4\u30C8\u306B\u307E\u3060\u30D5\u30A1\u30A4\u30EB\u304C\u5B58\u5728\u3057\u306A\u3044" + pagename + this.m_userid);

				return 1;
			}

			if (!O_parser.parse_form_1st(url, H_param)) {
				this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);

				__write_log("\t\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);

				return 3;
			}

			if (";" === url.substr(0, 1)) {
				url = "ghdbp001.srv" + url;
			}

			postfix = "";

			if (false !== strrpos(url, "?")) {
				pos = strpos(url, "?");
				postfix = url.substr(pos + 1);
				url = url.substr(0, pos);
			}

			url = this.m_O_client.add_get_param(url, postfix, "");
			url = this.m_O_client.add_get_param(url, "root_GHDBGW001SubmitCompDownLoad=", "");
			url = this.m_O_client.add_get_param(url, "BisAutoSubmissionREQUEST=", "");
			url = this.m_O_client.replenish_url(url);
			H_param.alreadyAutoSubmit = "true";
			this.m_O_client.post(url, H_param);
		}

		if (!is_ready) {
			this.putError(G_SCRIPT_DEBUG, "\u30C7\u30FC\u30BF\u6E96\u5099\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8" + pagename + this.m_userid);

			__write_log("\t\u30C7\u30FC\u30BF\u6E96\u5099\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\n" + pagename + this.m_userid);

			return 3;
		}

		var fname = sprintf(tgtname, 0);

		if (!this.m_O_client.save(fname)) {
			this.putError(G_SCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + fname + ")" + this.m_userid);

			__write_log("\t\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + fname + ")" + this.m_userid);

			return 3;
		}

		__write_log("\tOK " + fname);

		A_fname.push(fname);
		return 0;
	}

	get_info(year, month, tgtname, A_fname) //フォーム実行する
	//当月のデータが無ければ、ページタイトルが「Business Online-Error」
	//当月のデータはあるが、情報料だけが無い場合は、
	//本文に「検索対象のデータが存在しません。」との文言がある。
	//以後の遷移は可能だが、ZIPファイルではなくHTMLファイルが
	//ダウンロードされ、そのページタイトルが「Business Online-Error」
	//URLからcrmを取り除く
	//前月の月末の日付を入れる
	{
		A_fname = Array();
		var url = "";
		var H_param = Array();
		this.m_O_client.set_url(this.m_referer_info);
		url = this.m_url_info;
		this.eraseCrm(url, this.m_referer_info);
		var ym = sprintf("%04d%02d", year, month);
		var idx = -1;

		for (var cnt = 0; cnt < this.m_H_ym_info.length; ++cnt) {
			if (!strcmp(this.m_H_ym_info[cnt], ym)) {
				idx = cnt;
				break;
			}
		}

		if (-1 == idx) //年月が選択肢にない
			{
				return 1;
			}

		H_param = this.m_H_param_info;
		H_param.root_GHBDGW001_HYOKIYOSHUKEITAISHOTARGETDETA = "A";
		H_param.root_GHBDGW001_HOUJINHYOJITAISHONENGETSU = ym;
		H_param.root_GHBDGW001_TAISHOKIKANSHURYOBI = this.get_last_date(year, month);
		this.m_O_client.post(url, H_param);
		var pagename = "(\u60C5\u5831\u660E\u7D30\u53D6\u5F97\u30D5\u30A9\u30FC\u30E0\u5B9F\u884C\u5F8C)";

		switch (this.m_O_client.skip_jumppage(4)) {
			case 0:
				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
				return 3;

			case 2:
				this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
				return 2;
		}

		var O_parser = this.m_O_client.get_parser();

		if (false !== strpos(O_parser.get_title(), "Business Online-Error")) {
			return 1;
		}

		if (false !== strpos(O_parser.get_text(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002") || false !== strpos(O_parser.get_text(), "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002")) {
			return 1;
		}

		if (!O_parser.parse_form_1st(url, H_param)) {
			this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
			return 3;
		}

		var postfix = "";

		if (false !== strrpos(url, "?")) {
			var pos = strpos(url, "?");
			postfix = url.substr(pos + 1);
			url = url.substr(0, pos);
		}

		url = this.m_O_client.add_get_param(url, "YKID", 2);
		url = this.m_O_client.add_get_param(url, "BSID", 2);
		url = this.m_O_client.add_get_param(url, postfix, "");
		url = this.m_O_client.add_get_param(url, "root_GHBDGW001SubmitCompDownLoad=", "");
		url = this.m_O_client.add_get_param(url, "BisAutoSubmissionREQUEST=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.alreadyAutoSubmit = "true";
		this.m_O_client.post(url, H_param);
		pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u60C5\u5831\u6599ZIP)";

		if (!this.m_O_client.is_zip()) //ダウンロードしたのがZIPではない
			{
				O_parser = this.m_O_client.get_parser();

				if (O_parser.is_break()) {
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
					return 2;
				}

				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB" + pagename + this.m_userid);
				return 3;
			}

		var fname = sprintf(tgtname, 0);

		if (!this.m_O_client.save(fname)) {
			this.putError(G_SCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + fname + ")" + this.m_userid);
			return 3;
		}

		A_fname.push(fname);
		return 0;
	}

	get_p(year, month, type, tgtname, A_fname) //削除する
	{
		A_fname = Array();
		var url = "";
		var H_param = Array();
		var type_orig = type;

		switch (type) {
			case "PA":
				type = "A";
				break;

			case "PB":
				type = "B";
				break;

			case "PC":
				type = "C";
				break;

			case "PD":
				type = "D";
				return 1;

			default:
				this.putError(G_SCRIPT_WARNING, "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB\u7A2E\u5225" + type);
				return 3;
		}

		this.m_O_client.set_url(this.m_referer_p);
		url = this.m_url_p;
		H_param = this.m_H_param_p;
		H_param.root_GHBBGW001_HOUJINKAMOKUPATAN = type;
		H_param.root_GHBBGW001_HOUJINHYOJITAISHONENGETSU = sprintf("%04d%02d", year, month);
		var is_ready = false;
		var A_timeout = [1, 4, 5];

		for (var cnt = 0; cnt < 181; ++cnt) {
			if (60 == cnt) this.putError(G_SCRIPT_DEBUG, "clamp\u5074\u306E\u30D5\u30A1\u30A4\u30EB\u6E96\u5099\u30675\u5206\u4EE5\u4E0A\u7D4C\u904E" + "/\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u51E6\u7406\u306F\u7D99\u7D9A\u4E2D");
			var pagename = "(\u65E5\u6B21\u60C5\u5831\u8ACB\u6C42\u5185\u8A33\u53D6\u5F97\u30D5\u30A9\u30FC\u30E0\u5B9F\u884C\u5F8C" + cnt + ")";
			var timeout = undefined !== A_timeout[cnt] ? A_timeout[cnt] : A_timeout[A_timeout.length - 1];
			sleep(timeout);
			this.m_O_client.post(url, H_param);

			switch (this.m_O_client.skip_jumppage(4)) {
				case 0:
					this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
					return 3;

				case 2:
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
					return 2;
			}

			var O_parser = this.m_O_client.get_parser();

			if (false !== strpos(O_parser.get_title(), "Business Online-Error")) {
				return 1;
			}

			if (false !== strpos(O_parser.get_text(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002")) {
				return 1;
			}

			if (!O_parser.parse_form_1st(url, H_param)) {
				this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
				return 3;
			}

			if (false === strpos(O_parser.get_text(), "\u4F5C\u6210\u4E2D")) {
				is_ready = true;
				break;
			}

			var postfix = "";

			if (false !== strrpos(url, "?")) {
				var pos = strpos(url, "?");
				postfix = url.substr(pos + 1);
				url = url.substr(0, pos);
			}

			url = this.m_O_client.add_get_param(url, "YKID", 1);
			url = this.m_O_client.add_get_param(url, "BSID", 2);
			url = this.m_O_client.add_get_param(url, postfix, "");
			url = this.m_O_client.add_get_param(url, "root_GHBDGW001SubmitZipDownLoad=", "");
			url = this.m_O_client.add_get_param(url, "BisAutoSubmissionREQUEST=", "");
			url = this.m_O_client.replenish_url(url);
			H_param.alreadyAutoSubmit = "true";
			H_param.root_GHBBGW001_UCHIWAKESHUBETSU = "2";
			H_param.root_GHBBGW001_NARABIJUN = "4";
			H_param.root_GHBBGW001_HYOJIOYADENWABANGO = " ";
			H_param.root_GHBBGW001_HOUJINKAMOKUPATAN = type;
			H_param.root_GHBBGW001_HOUJINHYOJITAISHONENGETSU = sprintf("%04d%02d", year, month);
			delete H_param.root_GHBBGW001_NARABIJUNDETA;
		}

		if (!is_ready) {
			this.putError(G_SCRIPT_DEBUG, "\u30C7\u30FC\u30BF\u6E96\u5099\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8" + pagename + this.m_userid);
			return 3;
		}

		pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u65E5\u6B21\u60C5\u5831\u8ACB\u6C42\u5185\u8A33ZIP)";
		postfix = "";

		if (false !== strrpos(url, "?")) {
			pos = strpos(url, "?");
			postfix = url.substr(pos + 1);
			url = url.substr(0, pos);
		}

		url = this.m_O_client.add_get_param(url, "YKID", 1);
		url = this.m_O_client.add_get_param(url, "BSID", 2);
		url = this.m_O_client.add_get_param(url, postfix, "");
		url = this.m_O_client.add_get_param(url, "root_GHBBGW001SubmitZipDownload=", "");
		url = this.m_O_client.add_get_param(url, "BisAutoSubmissionREQUEST=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.alreadyAutoSubmit = "true";
		delete H_param.root_GHBBGW001_NARABIJUNDETA;
		this.m_O_client.post(url, H_param);

		if (!this.m_O_client.is_zip()) //ダウンロードしたのがZIPではない
			{
				O_parser = this.m_O_client.get_parser();

				if (O_parser.is_break()) {
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename);
					return 2;
				}

				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB" + pagename);
				return 3;
			}

		var fname = sprintf(tgtname, 0);

		if (!this.m_O_client.save(fname)) {
			this.putError(G_SCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + fname + ")" + this.m_userid);
			return 3;
		}

		A_fname.push(fname);
		return 0;
	}

	get_daily(year, month, type, tgtname, A_fname) //URLからcrmを取り除く
	{
		A_fname = Array();
		var url = "";
		var H_param = Array();

		switch (type) {
			case "RF":
				type = "1";
				break;

			case "RA":
				type = "2";
				break;

			case "RW":
				type = "3";
				break;

			case "RT":
				return 1;

			case "RD":
				return 1;

			case "RK":
				return 1;

			case "RS":
				return 1;

			default:
				this.putError(G_SCRIPT_WARNING, "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB\u7A2E\u5225" + type);
				return 3;
		}

		this.m_O_client.set_url(this.m_referer_daily);
		url = this.m_url_daily;
		this.eraseCrm(url, this.m_referer_daily);
		H_param = this.m_H_param_daily;
		H_param.root_GHBDGW001_HYOKIYOSHUKEITAISHOTARGETDETA = type;
		H_param.root_GHBDGW001_HOUJINHYOJITAISHONENGETSU = sprintf("%04d%02d", year, month);
		H_param.root_GHBDGW001_TAISHOKIKANKAISHIBI = "01";
		H_param.root_GHBDGW001_TAISHOKIKANSHURYOBI = this.get_last_date(year, month);
		var is_ready = false;
		var A_timeout = [1, 4, 5];

		for (var cnt = 0; cnt < 181; ++cnt) {
			if (60 == cnt) this.putError(G_SCRIPT_DEBUG, "clamp\u5074\u306E\u30D5\u30A1\u30A4\u30EB\u6E96\u5099\u30675\u5206\u4EE5\u4E0A\u7D4C\u904E" + "/\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u51E6\u7406\u306F\u7D99\u7D9A\u4E2D");
			var pagename = "(\u65E5\u6B21\u60C5\u5831\u6599\u91D1\u660E\u7D30\u53D6\u5F97\u30D5\u30A9\u30FC\u30E0\u5B9F\u884C\u5F8C" + cnt + ")";
			var timeout = undefined !== A_timeout[cnt] ? A_timeout[cnt] : A_timeout[A_timeout.length - 1];
			sleep(timeout);
			this.m_O_client.post(url, H_param);

			switch (this.m_O_client.skip_jumppage(4)) {
				case 0:
					this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30DA\u30FC\u30B8" + pagename + this.m_userid);
					return 3;

				case 2:
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
					return 2;
			}

			var O_parser = this.m_O_client.get_parser();

			if (false !== strpos(O_parser.get_title(), "Business Online-Error")) {
				return 1;
			}

			if (false !== strpos(O_parser.get_text(), "\u30C7\u30FC\u30BF\u304C\u5B58\u5728\u3057\u307E\u305B\u3093\u3002")) {
				return 1;
			}

			if (!O_parser.parse_form_1st(url, H_param)) {
				this.putError(G_SCRIPT_DEBUG, "\u30D5\u30A9\u30FC\u30E0\u898B\u3064\u304B\u3089\u305A" + pagename + this.m_userid);
				return 3;
			}

			if (false === strpos(O_parser.get_text(), "\u4F5C\u6210\u4E2D")) {
				is_ready = true;
				break;
			}

			var postfix = "";

			if (false !== strrpos(url, "?")) {
				var pos = strpos(url, "?");
				postfix = url.substr(pos + 1);
				url = url.substr(0, pos);
			}

			url = this.m_O_client.add_get_param(url, "YKID", 1);
			url = this.m_O_client.add_get_param(url, "BSID", 2);
			url = this.m_O_client.add_get_param(url, postfix, "");
			url = this.m_O_client.add_get_param(url, "root_GHBDGW001SubmitCompDownLoad=", "");
			url = this.m_O_client.add_get_param(url, "BisAutoSubmissionREQUEST=", "");
			url = this.m_O_client.replenish_url(url);
			H_param.alreadyAutoSubmit = "true";
		}

		if (!is_ready) {
			this.putError(G_SCRIPT_DEBUG, "\u30C7\u30FC\u30BF\u6E96\u5099\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8" + pagename + this.m_userid);
			return 3;
		}

		postfix = "";

		if (false !== strrpos(url, "?")) {
			pos = strpos(url, "?");
			postfix = url.substr(pos + 1);
			url = url.substr(0, pos);
		}

		url = this.m_O_client.add_get_param(url, "YKID", 1);
		url = this.m_O_client.add_get_param(url, "BSID", 2);
		url = this.m_O_client.add_get_param(url, postfix, "");
		url = this.m_O_client.add_get_param(url, "root_GHBDGW001SubmitCompDownLoad=", "");
		url = this.m_O_client.add_get_param(url, "BisAutoSubmissionREQUEST=", "");
		url = this.m_O_client.replenish_url(url);
		H_param.alreadyAutoSubmit = "true";
		this.m_O_client.post(url, H_param);
		pagename = "(\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u65E5\u6B21\u60C5\u5831\u6599\u91D1\u660E\u7D30ZIP)";

		if (!this.m_O_client.is_zip()) //ダウンロードしたのがZIPではない
			{
				O_parser = this.m_O_client.get_parser();

				if (O_parser.is_break()) {
					this.putError(G_SCRIPT_DEBUG, "\u30ED\u30B0\u30A4\u30F3\u5272\u308A\u8FBC\u307F" + pagename + this.m_userid);
					return 2;
				}

				this.putError(G_SCRIPT_DEBUG, "\u4E0D\u660E\u306A\u30D5\u30A1\u30A4\u30EB" + pagename + this.m_userid);
				return 3;
			}

		var fname = sprintf(tgtname, 0);

		if (!this.m_O_client.save(fname)) {
			this.putError(G_SCRIPT_WARNING, "\u30D5\u30A1\u30A4\u30EB\u66F8\u304D\u8FBC\u307F\u5931\u6557(" + fname + ")" + this.m_userid);
			return 3;
		}

		A_fname.push(fname);
		return 0;
	}

	unzip_file(tgtname, srcname) {
		if (0 == srcname.length || 0 == tgtname.length) return false;
		var rval = 0;
		var cmd = "unzip -p " + srcname + " > " + tgtname;
		system(cmd, rval);
		rval = 0 == rval;
		if (!rval) this.putError(G_SCRIPT_DEBUG, "ZIP\u89E3\u51CD\u5931\u6557(" + this.m_userid + ")" + cmd);
		return rval;
	}

	get_file(A_fname, year, month, type, tgtname, tempdir) //ファイル取得に失敗したらファイルを消して終了する
	//ZIPファイルを削除する
	{
		A_fname = Array();
		var A_zip = Array();
		var rval = 0;
		var zipname = tempdir + "%02d" + ".zip";

		if (-1 !== this.get_type_bill().indexOf(type)) //請求書情報を取り込む
			{
				rval = this.get_bill(year, month, zipname, A_zip);
			} else if (-1 !== this.get_type_info().indexOf(type)) //情報料を取り込む
			{
				rval = this.get_info(year, month, zipname, A_zip);
			} else if (-1 !== this.get_type_p().indexOf(type)) //日次情報・請求内訳を取り込む
			{
				rval = this.get_p(year, month, type, zipname, A_zip);
			} else if (-1 !== this.get_type_daily().indexOf(type)) //日次情報・料金明細を取り込む
			{
				rval = this.get_daily(year, month, type, zipname, A_zip);
			} else //情報料以外を取り込む
			{
				rval = this.get_details(year, month, type, zipname, A_zip);
			}

		if (rval) {
			for (var fname of Object.values(A_zip)) unlink(fname);

			return rval;
		}

		var cnt = 0;

		for (var srcname of Object.values(A_zip)) {
			tgtname = sprintf(tgtname, cnt);
			++cnt;

			if (!this.unzip_file(tgtname, srcname)) {
				for (var srcname of Object.values(A_zip)) unlink(srcname);

				return 3;
			}

			A_fname.push(tgtname);
		}

		for (var srcname of Object.values(A_zip)) unlink(srcname);

		return rval;
	}

	get_last_date(year, month) //前月にする
	{
		--month;

		if (0 == month) {
			--year;
			month = 12;
		}

		return this.get_cur_date(year, month);
	}

	get_cur_date(year, month) //うるう月の処理を行う
	{
		var A_date = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var date = A_date[month - 1];

		if (2 == month) //4で割り切れたらうるう年
			{
				if (0 == year % 4) date = 29;
				if (0 == year % 100) date = 28;
				if (2000 == year) date = 29;
			}

		return date;
	}

	eraseCrm(url, referer) {
		var num = strpos(referer, ".srv") - 8;
		var before = referer.substr(0, num);

		if (false !== strpos(before, "/crm/")) {
			before = str_replace("/crm/", "/", before);
		}

		num = strpos(url, ".srv") - 8;
		var after = "";

		if (0 == num) {
			after = url;
		} else {
			after = url.substr(num);
		}

		url = before + after;
	}

};