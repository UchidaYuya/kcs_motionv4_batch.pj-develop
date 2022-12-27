//
//受領日
//
//更新履歴：<br>
//2015/01/22 date 作成
//
///**
//
//受領日入力
//
//@subpackage Model
//@author date
//@since 2008/03/14
//

require("model/ModelBase.php");

require("MtAuthority.php");

require("MtTableUtil.php");

require("model/PostModel.php");

require("MtPostUtil.php");

require("TreeAJAX.php");

require("ListAJAX.php");

require("view/ViewError.php");

require("model/SmartCircuitModel.php");

require("model/UserModel.php");

//
//権限オブジェクト
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
//グローバルセッション
//
//@var mixed
//@access protected
//
//
//権限一覧を取得する
//
//@author houshiyama
//@since 2008/03/14
//
//@access public
//@return array
//
//mt_order_sub_tb取得
//mt_order_teldetail_tb取得
//保存します
//mt_order_sub_tbとmt_order_teldetail_tbをマージしたもの
//
//権限一覧のゲッター
//
//@author date
//@since 20150122
//
//@access public
//@return void
//
//
//デストラクタ
//
//@author date
//@since 20150122
//
//@access public
//@return void
//
class OrderReceiptFormModel extends ModelBase {
	constructor(O_db0, H_g_sess: {} | any[]) //shop側では使用しない
	{
		super(O_db0);
		this.H_G_Sess = H_g_sess;

		if (undefined !== this.H_G_Sess.pactid == true) {
			this.O_Auth = MtAuthority.singleton(this.H_G_Sess.pactid);
		}

		this.O_Set = MtSetting.singleton();
		this.setAllAuthIni();
	}

	setAllAuthIni() //shop側では使用しない
	{
		if (undefined !== this.H_G_Sess.pactid == true) {
			var super = false;

			if (undefined !== this.H_G_Sess.su == true && this.H_G_Sess.su == 1) {
				super = true;
			}

			var A_userauth = this.O_Auth.getUserFuncIni(this.H_G_Sess.userid);
			var A_pactauth = this.O_Auth.getPactFuncIni();
			this.A_Auth = array_merge(A_userauth, A_pactauth);
		} else {
			this.A_Auth = Array();
		}
	}

	getOrderSub(orderid) {
		var sql = "select ordersubid,productname,substatus,machineflg,receiptdate,detail_sort  from " + "mt_order_sub_tb " + "where orderid=" + orderid + " " + "ORDER BY detail_sort";
		var res = this.get_DB().queryHash(sql);
		return res;
	}

	getOrderTelDetail(orderid) {
		var sql = "select ordersubid,substatus,receiptdate,detail_sort,telno  from " + "mt_order_teldetail_tb " + "where orderid=" + orderid + " " + "ORDER BY detail_sort";
		var res = this.get_DB().queryHash(sql);
		return res;
	}

	updateReceiptDate(orderid, H_g_sess, H_sess, H_SubDetail) //transaction開始
	//オーダーごとに保存していくよ
	{
		this.get_DB().beginTransaction();

		for (var key in H_SubDetail) //キャンセルは無視する
		//設定する日付。配列になっているのでpsqlの書式に直すよ
		//----------------------------------------------------------------------------
		//mt_order_teldetail_tbまたはmt_order_subの更新
		//SQL発行
		//SQL実行するやで
		//----------------------------------------------------------------------------
		//assets_tbの更新販売店処理済み以降なら反映する。
		{
			var value = H_SubDetail[key];
			if (value.substatus == 230) continue;
			var temp = H_sess.SELF.post["receipt_date_" + value.detail_sort];

			if (temp.Y == "" && temp.m == "" && temp.d == "") //設定なし
				{
					var receiptdate = "NULL";
				} else //日付が設定されているお！
				{
					receiptdate = "'" + date("Y-m-d", mktime(0, 0, 0, temp.m, temp.d, temp.Y)) + "'";
				}

			if (value.machineflg == true) //端末なのでmt_order_teldetail_tbに追加
				{
					var table = "mt_order_teldetail_tb";
				} else //付属品なのでmt_order_sub_tbに追加
				{
					table = "mt_order_sub_tb";
				}

			var sql = "update " + table + " set " + " receiptdate = " + receiptdate + " where orderid = " + orderid + " and detail_sort = " + value.detail_sort;
			this.get_DB().exec(sql);
			var status = [120, 130, 140, 150, 160, 170, 180, 190, 200, 210];

			if (value.machineflg == true && -1 !== status.indexOf(value.substatus)) {
				sql = "select * from tel_rel_assets_tb" + " where" + " pactid=" + H_g_sess.pactid + " and telno='" + value.telno + "'" + " and carid=" + H_sess["/MTOrder"].carid + " and main_flg=true";
				var res = this.get_DB().queryHash(sql);

				if (!!res) //SQL発行
					//SQL実行するやで
					{
						sql = "update assets_tb" + " set " + "receiptdate=" + receiptdate + " where" + " assetsid=" + res[0].assetsid;
						this.get_DB().exec(sql);
					}
			}
		}

		this.get_DB().commit();
		return true;
	}

	getSubDetail(H_sess) {
		var orderid = H_sess["/MTOrder"].orderid;
		var type = H_sess["/MTOrder"].type;
		var sub = this.getOrderSub(orderid);
		var tel = this.getOrderTelDetail(orderid);
		var result = Array();

		for (var sub_key in sub) {
			var sub_val = sub[sub_key];

			if (sub_val.machineflg == true) //注文種別が付属品の時は無視しよう(ダミー端末が入っている)
				{
					if (type != "A") {
						for (var tel_key in tel) {
							var tel_val = tel[tel_key];

							if (tel_val.ordersubid == sub_val.ordersubid) {
								result.push(array_merge(sub_val, tel_val));
							}
						}
					}
				} else {
				result.push(sub_val);
			}
		}

		return result;
	}

	get_AuthIni() {
		return this.A_Auth;
	}

	__destruct() {
		super.__destruct();
	}

};