//
//$B2A3JI=<oJL7?(B
//
//@package Price
//@subpackage Model
//@users MtDBUtil
//@filesource
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/12/11
//
//
//
//$B2A3JI=<oJL7?(B
//
//@package Price
//@subpackage Model
//@author ishizaki<ishizaki@motion.co.jp>
//@since 2008/12/11
//

require("MtDBUtil.php");

//
//$B<+J,<+?H(B
//
//@var mixed
//@access private
//
//
//O_db
//
//@var mixed
//@access private
//
//
//H_ppid
//
//@var mixed
//@access public
//
//
//__construct
//
//@author ishizaki
//@since 2008/12/11
//
//@param mixed $pactid
//@param mixed $postid
//@access public
//@return void
//
//
//&singleton
//
//@author ishizaki
//@since 2008/12/11
//
//@static
//@access public
//@return void
//
//
//ppid 0 $B0J30$N(Bpricepattrn$B$rJV$9(B
//
//@author ishizaki
//@since 2008/12/11
//
//@access public
//@return void
//
//
//$B%G%9%H%i%/%?(B
//
//@author ishizaki
//@since 2008/12/11
//
//@access public
//@return void
//
class PricePatternModel {
	static myself;

	constructor() {
		this.O_db = MtDBUtil.singleton();
		this.H_ppid = this.getPatternList();
	}

	static singleton() {
		if (true == is_null(PricePatternModel.myself)) {
			PricePatternModel.myself = new PricePatternModel();
		}

		return PricePatternModel.myself;
	}

	getPatternList() {
		var sql = "SELECT " + "ppid, carid " + "FROM " + "price_pattern_tb " + "WHERE " + "ppid != 0 " + "ORDER BY " + "ppid ";
		var AH_temp = this.O_db.queryHash(sql);
		var count_temp = AH_temp.length;

		if (1 > count_temp) {
			return false;
		} else //$H_return[ppid][ppid];
			//$H_return[ppid][carid];
			{
				var H_return = Array();

				for (var cnt = 0; cnt < count_temp; cnt++) {
					H_return[AH_temp[cnt].ppid].ppid = AH_temp[cnt].ppid;
					H_return[AH_temp[cnt].ppid].carid = AH_temp[cnt].carid;
				}
			}

		return H_return;
	}

	__destruct() {}

};