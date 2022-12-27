//
//他のページへ遷移するための例外
//
//@uses MtExcept
//@package Base
//@subpackage Exception
//@filesource
//@author nakanita
//@since 2008/02/08
//
//
//
//他のページへ遷移するための例外
//
//@uses MtExcept
//@package Base
//@subpackage Exception
//@author nakanita
//@since 2008/02/08
//

require("MtExcept.php");

//
//異動先のURL
//
//@var string
//@access private
//
//
//コンストラクター
//
//@author nakanita
//@since 2008/02/08
//
//@param string $url 戻り先のURL、空文字列だった場合、戻り先は自分自身となる
//@param array $H_param
//@access public
//@return void
//
//
//例外を送出する
//外の記述を短くするための便利関数
//
//@author nakanita
//@since 2008/02/08
//
//@param string $url 戻り先のURL
//@param array $H_param
//@static
//@access public
//@return void
//
class MtExceptReload extends MtExcept {
	getURL() {
		return this.Url;
	}

	constructor(url, H_param: {} | any[] = Array()) //url の指定が無ければ、自身に飛ぶこととする
	{
		this.Url = url;

		if (is_null(this.Url) || this.Url == "") {
			this.Url = _SERVER.PHP_SELF;
		}

		super("reload", H_param);
	}

	static raise(url = "", H_param: {} | any[] = Array()) {
		throw new self(url, H_param);
	}

};