//
//管理者：商品マスターAJAX
//
//更新履歴：<br>
//2008/07/15 上杉勝史	作成
//
//@uses ProcessBaseHtml
//@package Product
//@subpackage process
//@filesource
//@author katsushi
//@since 2008/07/15
//@uses ProcessBaseHtml
//@uses CircuitModel
//
//
//error_reporting(E_ALL|E_STRICT);
//
//商品マスターAJAX
//
//@uses ProcessBaseHtml
//@package Product
//@subpackage process
//@author katsushi
//@since 2008/07/15
//@uses ProcessBaseHtml
//

require("process/ProcessBaseHtml.php");

require("model/Admin/Product/AdminProductModel.php");

require("view/Admin/Product/AdminProductAjaxView.php");

require("model/CircuitModel.php");

require("model/PlanModel.php");

require("model/PacketModel.php");

require("model/OptionModel.php");

//
//O_cir
//
//@var mixed
//@access private
//
//
//O_model
//
//@var mixed
//@access private
//
//
//O_view
//
//@var mixed
//@access private
//
//
//コンストラクター
//
//@author katsushi
//@since 2008/07/15
//
//@param array $H_param
//@access public
//@return void
//
//
//makeViewObj
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//
//
//makeModelObj
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//
//
//getView
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//
//
//getModel
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//
//
//プロセス処理のメイン<br>
//
//１．Viewオブジェクト作成
//２．ログインチェック
//３．Modelオブジェクト
//４．現在有効である価格表の取得
//５．価格表表示
//
//@author ishizaki
//@since 2008/06/26
//
//@param array $H_param
//@access protected
//@return void
//
//
//setResponseType
//
//@author katsushi
//@since 2008/07/15
//
//@access protected
//@return void
//@uses CircuitModel::getCircuitKeyHash()
//
//
//デストラクタ
//
//@author ishizaki
//@since 2008/04/10
//
//@access public
//@return void
//
class AdminProductAjaxProc extends ProcessBaseHtml {
	constructor(H_param: {} | any[] = Array()) {
		super(H_param);
	}

	makeViewObj() {
		this.O_view = new AdminProductAjaxView();
	}

	makeModelObj() //modelオブジェクトの生成
	{
		this.O_model = new AdminProductModel();
		this.O_cir = new CircuitModel();
		this.O_plan = new PlanModel();
		this.O_packet = new PacketModel();
		this.O_option = new OptionModel();
	}

	getView() {
		return this.O_view;
	}

	getModel() {
		return this.O_model;
	}

	doExecute(H_param: {} | any[] = Array()) //ログインチェック
	//JSON形式で出力
	{
		this.makeViewObj();
		this.makeModelObj();
		this.getView().startCheck();
		this.setResponseType();
		this.getView().putJSON();
	}

	setResponseType() //エラーの場合HTTPのレスポンスにnullを返す
	{
		var H_param = this.getView().getData();

		if (undefined !== H_param.type == false) {
			this.getView().setResponse(undefined);
			return false;
		}

		var res = undefined;

		switch (H_param.type) {
			case "cir":
				if (undefined !== H_param.val == true && is_numeric(H_param.val) == true) {
					var H_cir = this.O_cir.getCircuitKeyHash(H_param.val);
					res = Array();

					for (var cirid in H_cir) {
						var cirname = H_cir[cirid];
						res.push({
							cirid: cirid,
							cirname: cirname
						});
					}
				}

				break;

			case "plan":
				if (undefined !== H_param.val == true && strpos(H_param.val, ",") !== false) //$carid = $this->O_cir->getCarid($H_param["val"]);
					//$H_plan = $this->O_plan->getPlanKeyHash($carid, $cirid);
					//					$res = array();
					//					foreach($H_plan as $planid => $planname){
					//						array_push($res, array("planid" => $planid, "planname" => $planname));
					//					}
					{
						var carid, cirid;
						[carid, cirid] = H_param.val.split(",");
						var H_plan = this.O_plan.getPlanWithBuyselname(carid, cirid);
						res = Array();

						for (var planid in H_plan) {
							var planname = H_plan[planid];
							res.push({
								planid: planid,
								planname: planname
							});
						}
					}

				break;

			case "packet":
				if (undefined !== H_param.val == true && strpos(H_param.val, ",") !== false) //$carid = $this->O_cir->getCarid($H_param["val"]);
					{
						[carid, cirid] = H_param.val.split(",");
						var H_packet = this.O_packet.getPacketKeyHash(carid, cirid);
						res = Array();

						for (var packetid in H_packet) {
							var packetname = H_packet[packetid];
							res.push({
								packetid: packetid,
								packetname: packetname
							});
						}
					}

				break;

			case "option":
				if (undefined !== H_param.val == true && strpos(H_param.val, ",") !== false) //$carid = $this->O_cir->getCarid($H_param["val"]);
					{
						[carid, cirid] = H_param.val.split(",");
						var H_option = this.O_option.getOptionKeyHash(carid, cirid);
						res = Array();

						for (var opid in H_option) {
							var opname = H_option[opid];
							res.push({
								opid: opid,
								opname: opname
							});
						}
					}

				break;

			case "service":
				if (undefined !== H_param.val == true && strpos(H_param.val, ",") !== false) //$carid = $this->O_cir->getCarid($H_param["val"]);
					{
						[carid, cirid] = H_param.val.split(",");
						H_option = this.O_option.getDiscountKeyHash(carid, cirid);
						res = Array();

						for (var opid in H_option) {
							var opname = H_option[opid];
							res.push({
								opid: opid,
								opname: opname
							});
						}
					}

				break;

			case "preladd":
				if (undefined !== H_param.val == true && strpos(H_param.val, ",") !== false) {
					var ppi, pi;
					[ppi, pi] = H_param.val.split(",");

					if (false === this.O_model.chkProductId(this.O_view.gSess().admin_groupid, ppi) || false === this.O_model.chkProductId(this.O_view.gSess().admin_groupid, pi)) {
						res = undefined;
						break;
					}

					var ins_res = this.O_model.addProductRelation(ppi, pi);

					if (ins_res != -1) {
						res = 1;
					} else {
						res = undefined;
					}
				}

				break;

			case "preldel":
				if (undefined !== H_param.val == true && strpos(H_param.val, ",") !== false) {
					[ppi, pi] = H_param.val.split(",");

					if (false === this.O_model.chkProductId(this.O_view.gSess().admin_groupid, ppi) || false === this.O_model.chkProductId(this.O_view.gSess().admin_groupid, pi)) {
						res = undefined;
						break;
					}

					var del_res = this.O_model.delProductRelation(ppi, pi);

					if (del_res != -1) {
						res = 1;
					} else {
						res = undefined;
					}
				}

				break;

			default:
				break;
		}

		this.getView().setResponse(res);
	}

	__destruct() {
		super.__destruct();
	}

};