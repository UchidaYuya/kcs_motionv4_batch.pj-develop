require("MtRounding.php");

//
//税率判定日
//
//@author web
//@since 2014/03/05
//
//@param mixed $date
//@static
//@access public
//@return void
//
//
//税率取得
//
//@author web
//@since 2014/03/05
//
//@param mixed $date
//@static
//@access public
//@return void
//
//
//getTaxRate & check に相当する JS 処理を出力する
//
//@author web
//@since 2014/03/06
//
//@static
//@access public
//@return void
//
//
//_taxPrice を呼び、値を四捨五入する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access public
//@return void
//
//
//価格から税金を取得
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access private
//@return void
//
//
//_priceWithoutTax を呼び、値を四捨五入する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access public
//@return void
//
//
//税込金額から、税金を抜いた価格を取得する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access private
//@return void
//
//
//_priceWithTax  を呼び、値を四捨五入する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access public
//@return void
//
//
//外税金額を内税金額に変換する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access private
//@return void
//
//
//_taxSplitInPrice を呼び、値を四捨五入する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access public
//@return void
//
//
//内税金額から税金を取得する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access private
//@return void
//
//
//_tax を呼び、値を四捨五入する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access public
//@return void
//
//
//外税金額から税額を算出する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access private
//@return void
//
//
//値を四捨五入する
//
//@author web
//@since 2014/03/05
//
//@param mixed $price
//@static
//@access private
//@return void
//
//
//引数の日付から、対応する税率を取得する
//
//@author web
//@since 2014/03/05
//
//@param mixed $date
//@static
//@access private
//@return void
//
class MtTax {
	static def;
	static setting;
	static date;

	static setDate(date) {
		MtTax.date = date;
	}

	static getTaxRate(date = undefined) {
		if (is_null(MtTax.def) || is_null(MtTax.setting)) {
			var s = MtSetting.singleton();
			s.loadConfig("H_tax");
			MtTax.def = s.H_tax.tax;
			var temp = Array();
			tt;

			for (var value of Object.values(s.H_tax.A_tax)) {
				var d, t;
				[d, t] = value.split(":");
				d = strtotime(d);

				if (is_null(tt)) {
					var tt = d;
				} else {
					if (tt > d) {
						throw new Error("H_tax.ini \x1B$B$N=q<0$,0c$&\x1B(B");
					}

					tt = d;
				}

				temp[d] = t;
			}

			MtTax.setting = temp;
		}

		if (is_null(date)) {
			if (is_null(MtTax.date)) {
				date = date("Y-m-d H:i:s");
			} else {
				date = MtTax.date;
			}
		}

		date = strtotime(date);
		return MtTax.check(date);
	}

	static exportJs() {
		MtTax.getTaxRate();
		var temp = Array();
		{
			let _tmp_0 = MtTax.setting;

			for (var key in _tmp_0) {
				var value = _tmp_0[key];
				temp.push("\"" + key + "\" : \"" + value + "\"");
			}
		}
		header("Content-type: application/javascript");
		echo("function getTaxRate(targetDate)\n{\n\tvar def = " + MtTax.def + ";\n\tvar taxSetting = {\n");
		echo("\t\t" + temp.join(", \n\t\t") + "\n");
		echo("\t};\n\tif ('' == targetDate)\n\t{\n\t\ttargetDate = new Date().getTime() / 1000;\n\t}\n\telse\n\t{\n\t\ttargetDate = new Date(targetDate).getTime() / 1000;\n\t}\n\n\tvar def;\n\tfor (var i in taxSetting)\n\t{\n\t\tif (targetDate > i)\n\t\t{\n\t\t\tdef = taxSetting[i];\n\t\t}\n\t}\n\treturn def;\n\t");
		echo("\n}\n\n");
	}

	static taxPrice(price) {
		return MtTax._tweek(MtTax._taxPrice(price));
	}

	static _taxPrice(price) {
		return price * MtTax.getTaxRate() / 100;
	}

	static priceWithoutTax(price) {
		return MtTax._tweek(MtTax._priceWithoutTax(price));
	}

	static _priceWithoutTax(price) {
		return price / (100 + MtTax.getTaxRate()) * 100;
	}

	static priceWithTax(price) {
		return MtTax._tweek(MtTax._priceWithTax(price));
	}

	static _priceWithTax(price) {
		return price + MtTax._taxPrice(price);
	}

	static taxSplitInPrice(price) {
		return MtTax._tweek(MtTax._taxSpritInPrice(price));
	}

	static _taxSpritInPrice(price) {
		return MtTax.getTaxRate() * price / (100 + MtTax.getTaxRate());
	}

	static tax(price) {
		return MtTax._tweek(MtTax._tax(price));
	}

	static _tax(price) {
		return price * MtTax.getTaxRate() / 100;
	}

	static _tweek(price) {
		return MtRounding.tweek(price);
	}

	static check(date) {
		var res = MtTax.def;
		{
			let _tmp_1 = MtTax.setting;

			for (var key in _tmp_1) {
				var value = _tmp_1[key];

				if (!(date < key)) {
					res = value;
				} else {
					break;
				}
			}
		}
		return res;
	}

};