//
//シミュレーションプロパティモデル
//
//@uses ModelBase
//@filesource
//@package Model
//@subpackage Reom
//@author kitamura
//@since 2010/02/18
//
//
//シミュレーションプロパティモデル
//
//@uses ModelBase
//@package Model
//@subpackage Recom
//@author kitamura
//@since 2010/02/18
//

require("model/ModelBase.php");

require("model/PostModel.php");

//
//プロパティ
//
//@var array
//@access protected
//
//
//PostModel
//
//@var PostModel
//@access protected
//
//
//プロパティの変更有無
//
//@var boolean
//@access protected
//
//
//ダウンロードかどうか
//
//@var boolena
//@access protected
//
//
//コンストラクタ
//
//@author kitamura
//@since 2010/02/18
//
//@param array $H_options
//@access public
//@return void
//
//
//設定
//
//@author kitamura
//@since 2010/02/18
//
//@param array $H_options
//@access public
//@return RecomPropertyModel
//
//
//プロパティの変更有無を設定
//
//@author kitamura
//@since 2010/02/22
//
//@param boolean $renew
//@access public
//@return RecomPropertyModel
//
//
//プロパティの変更有無を取得
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return boolean
//
//
//ダウンロードかどうか
//
//@author kitamura
//@since 2010/02/22
//
//@access public
//@return boolena
//
//
//電話番号の設定
//
//@author kitamura
//@since 2010/02/19
//
//@param string $telNo
//@access public
//@return RecomPropertyModel
//
//
//Offsetの取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return integer
//
//
//最新月のtel_tbの取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return string
//
//
//英語かどうか
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return boolean
//
//
//ルート部署かどうか
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return boolean
//
//
//PostModelの取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return PostModel
//
//
//配下部署を取得
//
//@author kitamura
//@since 2010/02/19
//
//@access public
//@return array
//
//
//プロパティのsetter, getter
//
//@author kitamura
//@since 2010/02/18
//
//@param string $method
//@param array $A_arg
//@access public
//@return mixed
//
//
//データをこのオブジェクト用に整形する
//
//@author kitamura
//@since 2010/02/18
//
//@param array $H_options
//@access public
//@return mixed
//
class RecomPropertyModel extends ModelBase {
	constructor(H_options: {} | any[] = Array()) {
		super();
		this.renew = true;
		this.isDownload = false;
		this.setOptions(H_options);
	}

	setOptions(H_options) {
		this._parse(H_options);

		return this;
	}

	setRenew(renew) {
		this.renew = Bool(renew);
		return this;
	}

	getRenew() {
		return this.renew;
	}

	isDownload() {
		return this.isDownload;
	}

	setTelNo(telNo) {
		telNo = str_replace(["-", "(", ")"], "", telNo.trim());
		return this.__call("setTelNo", [telNo]);
	}

	getOffset() {
		return (this.getPage() - 1) * this.getLimit();
	}

	getNewestTelTb() {
		var month = this.getMonth();

		if (--month < 1) {
			month += 12;
		}

		return sprintf("tel_%02d_tb", month);
	}

	isEng() {
		return this.getLanguage() === "ENG";
	}

	isRoot() {
		var O_post = this.getPostModel();
		var rootPostId = O_post.getRootPostId(this.getPactId());
		return rootPostId == this.getCurrentPostId();
	}

	getPostModel() {
		if (false == (undefined !== this.O_postModel)) {
			this.O_postModel = new PostModel();
		}

		return this.O_postModel;
	}

	getChildList() {
		var pactid = this.getPactId();
		var postid = this.getCurrentPostId();
		return this.getPostModel().getChildList(pactid, postid);
	}

	__call(method, A_arg) {
		var A_property = ["pactid", "postid", "carid", "simid", "currentpostid", "telno", "allflag", "slash", "border", "changecourse", "limit", "language", "year", "month", "monthcnt", "range", "sort", "page", "changepacketfree", "division"];
		var pattern = "/^(set|get|is)(" + A_property.join("|") + ")$/";

		if (0 == preg_match(pattern, method.toLowerCase(), matches)) {
			this.getOut().errorOut(11, "\u30E1\u30BD\u30C3\u30C9\u304C\u306A\u3044:" + method, 0);
		}

		switch (matches[1]) {
			case "set":
				this.H_var[matches[2]] = A_arg[0];
				this.setRenew(true);
				return this;

			case "get":
				if (false == (undefined !== this.H_var[matches[2]])) {
					this.getOut().errorOut(15, "\u30D1\u30E9\u30E1\u30FC\u30BF\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044:" + matches[2]);
				}

				return this.H_var[matches[2]];

			case "is":
				return undefined !== this.H_var[matches[2]];

			default:
				this.getOut().errorOut(11, "set|get|is\u3067\u306F\u306A\u3044", 0);
				break;
		}
	}

};