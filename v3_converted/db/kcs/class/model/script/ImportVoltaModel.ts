//
//Voltaデータ取込処理 （Model）
//
//更新履歴：<br>
//2010/08/05 宝子山浩平 作成
//
//@package script
//@subpackage Model
//@author houshiyama<houshiyama@motion.co.jp>
//@filesource
//@since 2010/08/05
//@uses ModelBase
//
//
//error_reporting(E_ALL|E_STRICT);
//
//Voltaデータ取込処理 （Model）
//
//@uses ModelBase
//@package script
//@author houshiyama
//@since 2010/08/05
//

require("model/ModelBase.php");

require("model/PactModel.php");

require("model/EvModel.php");

//
//EvTbモデル
//
//@var EvModel
//@access protected
//
//
//__construct
//
//@author houshiyama
//@since 2010/08/05
//
//@param MtScriptAmbient $O_MtScriptAmbient
//@access public
//@return void
//
//
//pactの引数の処理
//
//@author houshiyama
//@since 2010/08/06
//
//@param mixed $pactid
//@access public
//@return void
//
//
//
//
//@author
//@since 2010/08/06
//
//@param mixed $agentid
//@param mixed $pactcode
//@access public
//@return void
//
//
//PactModel取得
//
//@author houshiyama
//@since 2010/08/06
//
//@access protected
//@return void
//
//
//EvModel取得
//
//@author ishizaki
//@since 2010/08/06
//
//@access protected
//@return EvModel
//
class ImportVoltaModel extends ModelBase {
	static EV_CO_ID = 1;

	constructor(O_MtScriptAmbient: MtScriptAmbient) //親のコンストラクタを必ず呼ぶ
	{
		super();
		this.O_msa = O_MtScriptAmbient;
	}

	getPactIds(pactid) {
		var O_Pact = this.getPactModel();
		var A_pact = Array();

		if ("all" == pactid.toLowerCase()) {
			var A_res;

			if (!(A_res = O_Pact.getAllEvPact())) {
				throw new Error("pactcode\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
			}

			for (var cnt = 0; cnt < A_res.length; cnt++) {
				A_pact[cnt].pactid = A_res[cnt].pactid;
				A_pact[cnt].ev_pactcode = A_res[cnt].ev_pactcode;
			}
		} else {
			A_pact[0].pactid = pactid;

			if (!(A_pact[0].ev_pactcode = O_Pact.getPactCodeFromPactId(pactid))) {
				throw new Error("pactcode\u304C\u307F\u3064\u304B\u308A\u307E\u305B\u3093\n");
			}
		}

		return A_pact;
	}

	getPactidRootPostIdFromAgentIdPactcode(agentid, pactcode) {
		return this.O_Pact.getPactidRootPostIdFromAgentIdPactcode(agentid, pactcode);
	}

	getPactModel() {
		if (!this.O_Pact instanceof PactModel) {
			this.O_Pact = new PactModel();
		}

		return this.O_Pact;
	}

	getEvModel() {
		if (!this.O_Ev instanceof EvModel) {
			this.O_Ev = new EvModel();
		}

		return this.O_Ev;
	}

};