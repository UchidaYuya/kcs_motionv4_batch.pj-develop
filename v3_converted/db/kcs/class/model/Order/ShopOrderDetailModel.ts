//
//受注詳細用Model
//
//@package Order
//@subpackage Model
//@filesource
//@author igarashi
//@since 2008/04/01
//@uses OrderModel
//@uses OrderUtil
//
//
//別ドメイン対応 20090819miya
//require_once("model/Management/Tel/ManagementTelModel.php");
//require_once("model/Shop/Product/ShopProductModel.php");
//require_once("model/Price/UserPriceModel.php");
//
//受注詳細用Model
//
//@uses ModelBase
//@package Order
//@author igarashi
//@since 2008/04/01
//

require("MtDateUtil.php");

require("MtMailUtil.php");

require("MtSession.php");

require("ManagementUtil.php");

require("OrderUtil.php");

require("model/FuncModel.php");

require("model/TelModel.php");

require("ShopOrderModelBase.php");

require("model/Price/UserPriceModel.php");

require("model/Shop/Product/ShopProductModel.php");

require("model/Management/ManagementModelBase.php");

require("model/Order/ShopOrderMenuModel.php");

require("model/GroupModel.php");

require("Post.php");

require("MtSetting.php");

require("MtUniqueString.php");

//
//コンストラクター
//
//@author igarashi
//@since 2008/07/02
//
//@param objrct $O_db0
//@param array $H_g_sess
//@access public
//@return void
//
//
//getTelDetail
//tel_detailsを返す
//何度もSQLを発行しないように一度取得した情報を返すようにした
//@author 伊達
//@since 2019/04/05
//
//@param mixed $orderid
//@param int $detail_sort
//@access public
//@return void
//
//
//getManagementPropertys
//追加管理項目取得
//@author web
//@since 2019/04/05
//
//@param mixed $pactid
//@param mixed $ordview
//@access protected
//@return void
//
//
//getArrayDate
//
//@author web
//@since 2019/04/16
//
//@access protected
//@return void
//
//
//振替えられた受注明細を取得する
//
//@author igarasi
//@since 2008/11/17
//
//@param $orderid
//@param $shopid
//
//@access public
//@return hash
//
//
//振替えられた受注明細を取得する
//
//@author igarasi
//@since 2008/11/17
//
//@param $orderid
//@param $shopid
//
//@access public
//@return hash
//
//
//販売店一覧を取得する
//
//@author igarashi
//@since 2008/11/21
//
//@param $H_g_sess
//
//@access public
//@return hash
//
//
//キャリアのポイント使用単位とレートを取得する
//
//@author igarashi
//@since 2008/07/18
//
//@access public
//@return hash
//
//
//getPointRate
//
//@author igarashi
//@since 2009/07/06
//
//@param mixed $H_view
//@access public
//@return void
//
// 1オーダーのうち、端末の件数を取得する
//
// @author igarashi
// @since 2008/07/18
//
// @param $orderid
//
// @access public
// @return integer
//
//受注情報を取得する
//
//@author igarashi
//@since 2008/07/02
//
//@param $orderid
//@param $shopid (操作している販売店id)
//@param $A_shopid (包括販売店の場合、配下の販売店id)
//
//@access public
//@return hash
//
//tel_detail_tbとsub_tbをマージする
//
// @author igarashi
// @since 2008/07/17
//
// @param $H_detail(mt_order_teldetail_tb)
// @param $H_sub(mt_order_sub_tb)
//
// @access public
// @return hash
//
//受注更新履歴を取得する
//
//@author igarashi
//@since 2008/09/18
//
//@param $orderid
//
//@access public
//@return hash
//
//
//渡された受注情報を端末とそれ以外の情報にわける
//
//@author igarashi
//@since  2008/08/19
//
//@param $H_order
//
//@access protected
//@return hash
//
//
//存在しないデータを指定した文字列で補完(追加)する
//
//@author igarashi
//@since 2008/07/30
//
//@param $H_data(補完する元データ)
//@param $name(補完したいキー名)
//@param $repair(格納される文字列)
//@param $dimflg(trueなら二次元配列として処理)
//@param $empflg(trueなら空文字("")も置き換える)
//
//@access public
//@return hash
//
//
//渡された配列の要素をstring型にして返す
//
//@author igarashi
//@since 2008/07/03
//
//@param mixed
//@return mixed
//
//
//1オーダーに含まれる件数を取得する
//
//@author igarashi
//@since 2008/07/16
//
//@param $orderid
//@return integer
//
//
//
//
//@author igarashi
//@since 2008/09/12
//
//
//
//受注詳細で選択できるステータスを取得する
//
//@author igarashi
//@since 2008/07/16
//
//@param $flg
//
//@access public
//@return hash
//
//
//販売店担当者を取得する
//
//@author igarashi
//@since 2008/08/12
//
//@param $shopid
//
//@access public
//@return hash
//
//
//決済方法の選択肢を取得する
//
//@author igarashi
//@since 2008/07/25
//
//@access public
//@return array
//
//
//支払い方法を振替先販売店の表示用に成形する
//
//@author igarashi
//@since 2008/11/22
//
//@param name
//
//@access public
//@return string
//
//
//振替先販売店を返す
//
//@author igarashi
//@since 2008/09/30
//
//@param $orderid
//@param $mode
//@param
//
//@access public
//@return mixed
//
//
//メール送信用の情報を成形する
//
//@author igarashi
//@since 2008/10/02
//
//@param $H_sess
//@param $H_order
//@param $mode
//
//@access protected
//@return hash
//
//
//メール送信用の情報を取得して送信する
//
//@author igarashi
//@since 2009/10/01
//
//@param $H_sess
//@param $H_order(注文情報)
//
//@access public
//@return bool
//
//
//メール本文作成<br>
//ほぼV2時代のものを移植
//
//@author igarashi
//@since 2008/08/12
//
//@param $H_sess
//@param $H_mailparam：メールに使用するパラメータの配列
//
//@access public
//@return hash
//
//
//メールに載せるURLをgroupidごとに返す
//
//@author igarashi
//@since 2008/11/--
//
//@param $groupid
//@param $mode
//
//@access public
//@retrn string
//
//k76 orderidを取得しよう
//k76 納品のメール送信
//K76 納品日のメール通知 20150128 date
//K76 20150218 date
//ruleのオプションに渡す値を取得する
//
//状況に応じたSQLを作成する
//
//@author igarashi
//@since 2008/08/23
//
//
//@access public
//@return array
//
//指定された電話番号が電話管理にない場合エラーを返す
//指定された電話番号が存在している場合エラーを返す
//
//management_log_tb書き込み用sqlを返す
//
//@author igarashi
//@since 2008/09/29
//
//@param $H_g_sess
//@param $H_order
//@param $H_permit
//@param $nowtime
//
//@access protected
//@return string
//
//
//management_log_tbに記入される内容を発注種別毎に作成する
//
//@author igarashi
//@since 2008/09/29
//
//@param $ordertype
//@param $postid
//
//@access protected
//@return array
//
//
//management_log_tbに記入される内容を発注種別毎に作成する
//
//@author igarashi
//@since 2009/03/05
//
//@param mixed $ordertype
//@param mixed $postid
//@param mixed $resflg
//@access protected
//@return void
//
//
//電話管理のupdate、insert文を作成する
//
//@author igarashi
//@since 2008/08/27
//
//@param $H_permit (更新可能な受注サブデータ)
//@param $H_order (共通受注データ)
//@param $nowtime
//
//@acces public
//@return array
//
//
//電話管理の登録日、契約日を更新する
//
//@author igarashi
//@since 2009/01/21
//
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $H_permit
//@access public
//@return void
//
//
//makeAssetsManagementDateSQL
//
//@author igarashi
//@since 2009/12/15
//
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $H_permit
//@access public
//@return void
//
//
//insert文作成処理の呼出し(2カ所から呼ぶので関数化しただけ)
//
//@author igarashi
//@since 3008/11/14
//
//@param
//@param
//@param
//
//@access protected
//@return string
//
//
//解約処理実行時の予約バッチ実行useridを取得する<br>
//
//
//@author igarashi
//@since 2008/10/04
//
//
//
//端末管理のupdate、insert文を作成する
//
//@author igarashi
//@since 2008/08/22
//
//@param
//
//@access public
//@return array
//
//
//電話詳細情報のSET句を作る
//
//@author igarashi
//@since 2008/08/28
//
//@param $H_permit(更新が可能な受注情報)
//
//@access protected
//@return string
//
//
//渡された2つの日付で、第1引数のほうが過去ならtrue<br>
//未来ならfalse.それ以外は""
//
//@author igarashi
//@since 2009/10/19
//
//@param mixed $past
//@param string $future
//@access public
//@return void
//
//
//受注情報に更新内容が入っていればそのカラムをupdate
//
//@author igarashi
//@since 2008/08/27
//
//
//@access protected
//@return string
//
//
//makeTelFjpSQL
//
//@author web
//@since 2013/11/07
//
//@param mixed $H_order
//@access protected
//@return void
//
//
//一括プラン変更用update文作成
//
//@author igarashi
//@since 2008/10/ 02
//
//
//@access protected
//@return string
//
//
//受注のoptionをtel_tb用に変換
//
//@author igarashi
//@since 2008/08/27
//
//@param
//@param
//
//@access protected
//@return string
//
//
//planidをベーシック<->バリューで切り替える
//
//@author igarashi
//@since 2008/08/27
//
//@access protected
//@return int
//
//k76
//
//mt_order_tbに保存するdeliverydate_typeを取得します。
//mt_order_tbに保存するsend_deliverydate_flgを取得します。
//
//order_tbのupdate文を作成する(サブ用)
//
//@author igarashi
//@since 2008/08/22
//
//@param $H_order
//
//@access public
//@return array
//
//
//渡された値が0以下なら0にして返す<br>
//空やnullも0にして返す
//
//@author igarashi
//@since 2008/09/29
//
//@param $num
//@param $mode(小数点以下の扱い up=切上 down=切捨 round=四捨五入)
//
//@access public
//@return int
//
//
//納品日と処理日を入れる →k76により処理日だけになりました(date)
//
//@author igarashi
//@since 2009/01/21
//
//@param mixed $H_order
//@param mixed $H_permit
//@param mixed $H_sess
//@param mixed $nowtime
//@access protected
//@return void
//
//
//sub_tbの日時空欄を防ぐ<br>
//検索でよけいな空白をヒットさせないようにする
//
//@author igarashi
//@since 2009/03/12
//
//@param mixed $H_sss
//@param mixed $H_order
//@access protected
//@return void
//
//
//mt_order_teldetail_tbのset句を作る
//
//@author igarashi
//@since 2009/01/21
//
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $H_permit
//@param mixed $ordertype
//@param mixed $nowtime
//@access protected
//@return void
//
//
//電話管理から受注を受けた電話情報を取得
//
//@author igarashi
//@since 2008/08/24
//
//
//
//
//
//既に使用している管理番号を取得する
//
//@author igarashi
//@since 2009/03/24
//
//@param mixed $H_sess
//@param mixed $H_order
//@access protected
//@return void
//
//
//渡されたカラム名のデータに1つにまとめる
//もともと電話番号なので、端末以外は商品名を取得する
//
//@author igarashi
//@since 2008/07/29
//
//@param $H_order
//@param $A_sort
//@param $key
//
//@access public
//@return str
//
//
//電話番号だけを1データにまとめる
//
//@author igarashi
//@since 2009/05/12
//
//@param mixed $H_order
//@param mixed $A_sort
//
//@access public
//@return void
//
//
//サブステータス画面に入った明細の状態表示
//
//@author igarashi
//@since 2008/12/19
//
//@param mixed $H_order
//@param mixed $A_sort
//@param mixed $H_view
//@param mixed $A_shopid
//@param mixed $key
//
//@access public
//@return void
//
//
//電話管理に未登録の受注情報を抽出
//
//@author igarashi
//@since 2008/08/24
//
//
//@access protected
//@return hash
//
//
//機種変更がtel_tb登録時に動作する形式を取得
//
//@author igarashi
//@since 2008/09/26
//
//@param $H_sess
//@param $H_order
//@param $pacttype
//@param $H_permit
//@param $A_telno
//
//@access protected
//@return hash
//
//
//checkAssetsDuplication
//
//@author igarashi
//@since 2009/03/24
//
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $pacttype
//@param mixed $H_permit
//@param mixed $A_telno
//@access protected
//@return void
//
//
//optionカラムの内容を割引サービスとにわける
//
//@author igarashi
//@since 2008/09/22
//
//@param $H_option
//@param $ordertype
//
//@access public
//@return hash
//
//
//電話番号が入力されている受注を抽出する
//
//@author igarashi
//@since 2008/08/24
//
//
//
//処理済より前には戻せない
//
//@author igarashi
//@since 2088/09/11
//
//@param
//
//
//
//プランが「現状引継」で、tel_tbにプランがないものを弾く
//
//@author igarashi
//@since 2008/08/27
//
//@access protected
//@return hash
//
//
//プラン引き継ぎチェック
//
//@author igarashi
//@since 2009/05/21
//
//@param mixed $H_order
//@param mixed $H_machine
//@access public
//@return void
//
//
//受注情報のplan,post,packetがマスターに存在するか確認
//
//@author igarashi
//@since 2008/09/24
//
//@param $H_order
//@param $H_permit
//
//@access protected
//@return hash
//
//
//電話管理へのinsert文を作成する<br>
//新規・MNPで使用<br>
//tel_tbからの削除を行う前に呼ぶ必要がある
//
//@author igarashi
//@since 2008/08/14
//
//@param $H_sess
//@param $H_order
//
//@access public
//@return hash
//
//
//docomoのポイントステージを返す
//
//@author igarashi
//@since 2008/08/29
//
//@param $H_order
//
//
//
//
//orderidとdetail_sortから電話詳細情報を取得する
//
//@author igarashi
//@since 2008/10/17
//
//
//
//getReserveTelInfo
//
//@author igarashi
//@since 2009/10/20
//
//@param mixed $H_order
//@param mixed $telno
//@access public
//@return void
//
//
//getTelManageOrderDate
//
//@author igarashi
//@since 2009/07/16
//
//@param mixed $H_info
//@access public
//@return void
//
//
//makeTelPropertyInfo
//
//@author igarashi
//@since 2009/06/30
//
//@param mixed $H_sess
//@param mixed $H_teldetail
//@access public
//@return void
//
//
//変更なし以外のオプションをオプション名、状態の配列にして返す
//
//@author igarashi
//@since 2008/09/-3
//
//@access protected
//@return array
//
//
//サービスの名前を取得して配列に入れて返す
//
//@author igarashi
//@since 2008/09/25
//
//@param $service
//
//@access public
//@return array
//
//
//地域会社統合後の社名に変更する
//
//@author igarashi
//@since 2008/09/22
//
//@param $carid
//@param $H_regist
//
//@access public
//@return string
//
//
//シリアライズされた情報を配列にして返す
//
//@author igarashi
//@since 2008/09/22
//
//@param $H_order
//@param $search アンシリアライズするカラム名
//@param $key
//
//@access public
//@reutrn hash
//
//
//渡されたbuyselidが割賦販売に対応していたらtrueを返す
//
//@author igarashi
//@since 2008/10/22
//
//@param $buyselid
//
//@access public
//@return boolean
//
//
//QuickFormのデフォルト表示を取得・作成<br>
//受注詳細用
//
//@author igarashi
//@since 2008/09/03
//
//@param $H_info
//
//@access public
//@return hash
//
//
//getStockSelected
//
//@author igarashi
//@since 2009/07/03
//
//@param mixed $H_info
//@access public
//@return void
//
//
//価格表から現在の価格を取得して返す
//
//@author igarashi
//@since 2008/09/
//
//@param $H_view
//
//@access public
//@return array
//
//
//最終承認部署通過時の価格を税抜き編集
//
//@author igarashi
//@since 2008/11/18
//
//@param $H_regist
//@param $taxflg
//
//@access public
//@return void
//
//
//「選択なし」のbuyselidを取得する
//
//@author igarashi
//@since 2008/09/25
//
//@param $carid
//
//@access protected
//@return
//
//
//販売店の所属するgroupidを取得する
//
//@auhtor igarashi
//@since
//
//@param $shopid
//
//@access public
//@return int
//
//
//ハイフン付き電話番号を作る
//
//@author igarashi
//@since 2008/09/14
//
//@param $telno
//
//@access protected
//@return str
//
//
//在庫管理
//
//
//
//
//
//
//
//execStockManagementProc
//
//@author igarashi
//@since 2008/12/29
//
//@param mixed $H_info
//@param mixed $H_target
//@param mixed $shopid
//
//@access protected
//@return void
//
//
//getStockTarget
//
//@author igarashi
//@since 2008/12/29
//
//@param mixed $H_sess
//
//@access protected
//@return void
//
//
//出荷済みかどうか調べる
//
//@author igarashi
//@since 2008/10/25
//
//@param $nowstat
//@param $exestat
//
//@access public
//@return bool
//
//
//現在のステータスが出荷済前かつ変更後のステータスが出荷済以降か調べる<br>
//
//@author igarashi
//@since 2008/10/01
//
//@param $chgstat (変更後のステータス)
//@param $nowstat (変更前のステータス)
//@param $mode
//
//@access protected
//@return boolean
//
//
//電話管理に反映後ならtrueを返す
//$compareが指定されていればその値と現在のステータスを比較
//
//@author igarashi
//@since 2009/09/15
//
//@param mixed $status
//@param int $compare
//
//@access public
//@return void
//
//
//現在のステータスが出荷済かつ変更後のステータスが出荷済以降か調べる<br>
//modeをprocにすると処理済みを基準に判定する
//完了、キャンセルは出荷済み以降に含めない
//
//@author igarashi
//@since 2008/10/01
//
//@param $chgstat (変更後のステータス)
//@param $nowstat (変更前のステータス)
//@param $mode
//
//@access protected
//@return boolean
//
//
//ユーザーが入力した電話番号が重複していないかチェックする
//
//@author igarashi
//@since 2008/10/17
//
//@param $H_sess
//@param $H_order
//
//@access public
//@return mix
//
//
//checkUserInputSerialno
//
//@author igarashi
//@since 2009/01/01
//
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//checkUserInputSimno
//
//@author igarashi
//@since 2010/02/25
//
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//checkInputExpectDate
//
//@author igarashi
//@since 2009/12/15
//
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//checkInputDeliveryDate
//
//@author igarashi
//@since 2009/12/15
//
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//受注データで日付が指定されていなければ当日を入れる
//
//@author igarashi
//@since 2008/10/23
//
//@param $H_permit
//@pram $nowtime
//
//@access public
//@return hash
//
//
//公私分計のon/offを変換する
//
//@author igarashi
//@since 2008/10/24
//
//@param $H_permit
//
//@access protected
//@return string
//
//
//simcardnoをSESSIONかDBから取得する<br>
//優先されるのはSESSION
//
//@author igarashi
//@since 2008/10/24
//
//@param $H_sess
//@param $H_permit
//
//@access protected
//@return int
//
//
//getStartDate
//
//@author igarashi
//@since 2008/10/24
//
//@param mixed $H_sess
//@param mixed $H_permit
//@param mixed $target
//@access protected
//@return void
//
//
//受注完了ログsqlを作成する
//
//@author igarashi
//@since 2008/08/30
//
//
//
//
//失敗したSQLを保存しておく
//
//@author igarashi
//@since 2009/02/25
//
//@param mixed $H_info
//@access public
//@return void
//
//
//渡された配列をorderidでまとめる
//
//@author igarashi
//@since 2008/10/28
//
//@param $H_info
//
//@access public
//@return array
//
//
//包括販売店かチェックする
//
//@author igarashi
//@since 2008/10/31
//
//
//
//抱括配下なら包括販売店を配列で返す
//
//@author igarashi
//@since 2008/12/24
//
//@param mixed $shopid
//
//@access public
//@return hash
//
//
//配下の販売店を取得する
//
//@author igarashi
//@since 2008/11/01
//
//@param mixed $H_g_sess
//@param mixed $flg
//@param mixed $opt
//
//@access public
//@return void
//
//
//第2階層権限が付いた会社ならtrueを返す
//
//@author igarashi
//@since 2008/11/01
//
//@param mixed $pactid
//
//@access public
//@return void
//
//
//getExecDate
//
//@author igarashi
//@since 2009/10/27
//
//@param mixed $H_order
//@param mixed $H_permit
//@param mixed $nowtime
//@access public
//@return void
//
//
//割賦方式を選択できない買い方idを取得
//
//@author igarashi
//@since 2008/01a01/
//
//@access public
//@return void
//
//
//端末の利用期間を計算して配列に入れて返す
//
//@author igarashi
//@since 2008/11/14
//
//@param $H_machine
//
//@access public
//
//
//税率を返す
//
//@author igarashi
//@since 2008/11/14
//
//@access public
//@erturn float
//
//
//販売店用のmng_logに書き込む
//
//@author igarashi
//@since 2008/11/26
//
//
//@access public
//@return hash
//
//
//第2階層部署なら発注名義を上書きする
//
//@author igarashi
//@since 2008/11/30
//
//@param $H_info
//
//@access public
//@return none
//
//
//解約時も電話管理から削除しない場合は削除しない
//
//@author igarashi
//@since 2008/11/30
//
//@access public
//@return boolean
//
//
//振替えられていない明細は振替先で表示しない(ステータス部分)
//
//@author igarashi
//@since 2008/12/09
//
//@param $H_g_sess
//@param $H_view
//@param $A_shopid
//
//@access public
//@return void
//
//
//包括販売店の場合、受注情報と販売店が結びつかないため、
//受注元の販売店を確保しておく
//
//@author igarashi
//@since 2008/12/09
//
//@param $H_view
//
//@access public
//@return int
//
//
//振替時の画像ファイル名を返す
//
//@author igarashi
//@since 2008/12/24
//
//@param mixed $type
//@param mixed $status
//@param mixed $mode
//
//@access public
//@return void
//
//
//地域会社一覧をaridをkeyにした連想配列で返す
//
//@author igarashi
//@since 2008/12/19
//
//@param mixed $carid
//
//@access public
//@return void
//
//
//受注元でも抱括配下でも振替先でもなければ見せない
//
//@author igarashi
//@since 2008/12/22
//
//@param mixed $H_g_sess
//@param mixed $H_view
//@param mixed $A_shopid
//@access public
//@return void
//
//
//回線移行時のoptionidを返す
//
//@author igarashi
//@since 2008/12/31
//
//@param mixed $H_option
//@access protected
//@return void
//
//
//ステータスを堪能にしても一部変更負荷だった場合、ステータスを部分に切り替える
//
//@author igarashi
//@since 2008/12/31
//
//@param mixed $status
//
//@access protected
//@return int
//
//
//orderidから電話番号を取得する<br>
//電話情報が更新に必要のない発注種別用(付属品、その他)
//
//@author igarashi
//@since 2009/01/14
//
//@param mixed $H_view
//@access public
//@return void
//
//
//更新に端末情報が必要ない発注種別は行数を減らす
//
//@author igarashi
//@since 2009/01/14
//
//@param mixed $H_view
//@access public
//@return void
//
//
//一括プラン表示用に修正する(地域会社ごとにまとめる)
//
//@author igarashi
//@since 2009/01/28
//
//@param mixed $H_view
//@access public
//@return void
//
//
//getReserveDuplication
//
//@author igarashi
//@since 2009/07/15
//
//@param mixed $H_order
//@param mixed $H_permit
//@param mixed $carid
//@param mixed $execdate
//@access protected
//@return void
//
//
//削除指定日移行の未実行予約件数を返す
//
//@author igarashi
//@since 2009/01/21
//
//@param mixed $H_order
//@param mixed $H_permit
//@param mixed $carid
//@param mixed $execdate
//@access protected
//@return void
//
//
//操作中の販売店が担当している受注明細番号を返す
//
//@author igarashi
//@since 2009/01/19
//
//@param mixed $H_g_sess
//@param mixed $H_view
//@param mixed $H_mergedata
//@access public
//@return void
//
//
//getDispStatusFlag
//
//@author igarashi
//@since 2009/05/26
//
//@param mixed $H_order
//@param mixed $H_shop
//@access public
//@return void
//
//
//getTelnoOnly
//
//@author igarashi
//@since 2009/06/25
//
//@param mixed $orderid
//@access public
//@return void
//
//
//管理情報項目名と内容を返す
//
//@author igarashi
//@since 2009/06/25
//
//@param mixed $H_telno
//@param mixed $H_order
//@access public
//@return void
//
//
//makeTelPropertySQL
//
//@author igarashi
//@since 2009/06/30
//
//@param mixed $H_sess
//@param mixed $H_order
//@param mixed $H_permit
//@access public
//@return void
//
//
//isTransfer
//
//@author igarashi
//@since 2009/07/13
//
//@param mixed $H_view
//@access public
//@return void
//
//
//getStockTarget
//
//@author igarashi
//@since 2009/07/14
//
//@param mixed $target
//@access public
//@return void
//
//
//setOrderTelno
//
//@author igarashi
//@since 2009/07/16
//
//@param mixed $H_info
//@access public
//@return void
//
//
//プラン翌月反映用のsqlを作る
//
//@author igarashi
//@since 2009/10/20
//
//@param mixed $H_order
//@param mixed $H_permit
//@param mixed $H_tel
//@access public
//@return void
//
//
//翌月指定なら当翌月1日を返す。<br>
//それ以外は先頭から10文字を返す
//
//@author igarashi
//@since 2009/10/21
//
//@param mixed $type
//@param mixed $reserve
//@param string $nowtime
//@access public
//@return void
//
//
//第1引数がnullや空なら第2引数を返す
//
//@author igarashi
//@since 2009/10/20
//
//@param mixed $primary
//@param mixed $secondary
//@access public
//@return void
//
//
//振替時の受注情報を取得して返す
//
//@author igarashi
//@since 2009/10/26
//
//@param mixed $H_order
//@access protected
//@return void
//
//
//振替先／元の販売店コード、受注の受付担当者名を返す<br>
//detail_sortが一番若いものしか返さない
//
//@author igarashi
//@since 2009/10/28
//
//@param mixed $H_order
//@access public
//@return void
//
//
//販売店コードを返す
//
//@author igarashi
//@since 2009/10/28
//
//@param mixed $shopid
//@access protected
//@return void
//
//
//makeCompleteDateSql
//
//@author igarashi
//@since 2010/01/25
//
//@param mixed $nowtime
//@access private
//@return void
//
//
//getTargetDate
//
//@author igarashi
//@since 2010/01/25
//
//@param mixed $H_date
//@param mixed $nowdate
//@access public
//@return void
//
//
//setDateArray
//
//@author igarashi
//@since 2010/01/25
//
//@param int $year
//@param int $month
//@param int $day
//@param string $date
//@access public
//@return void
//
//
//checkSerialNoDigit
//
//@author igarashi
//@since 2010/02/25
//
//@param mixed $A_serno
//@param mixed $H_order
//@access public
//@return void
//
//
//checkSimnoDigit
//
//@author igarashi
//@since 2010/02/25
//
//@param mixed $A_simno
//@param mixed $H_order
//@access protected
//@return void
//
//
//getSerialDigit
//
//@author igarashi
//@since 2010/02/25
//
//@param int $carid
//@access protected
//@return void
//
//
//getSimnoDigit
//
//@author igarashi
//@since 2010/02/25
//
//@param int $carid
//@access protected
//@return void
//
//
//checkLuhnFormula
//
//@author igarashi
//@since 2010/02/25
//
//@access protected
//@return void
//
//
//getTargetColumn
//
//@author igarashi
//@since 2010/03/14
//
//@param mixed $H_data
//@param mixed $target
//@access public
//@return void
//
//
//updateTransferCount
//
//@author igarashi
//@since 2010/03/17
//
//@param mixed $H_order
//@access private
//@return void
//
//
//getRegistType
//
//@author
//@since 2010/10/01
//
//@access public
//@return void
//
//
//setRegistType
//
//@author
//@since 2010/10/01
//
//@param mixed $pactid
//@param string $site
//@access public
//@return void
//
//
//setOperationUser
//
//@author
//@since 2010/10/03
//
//@access public
//@return void
//
//
//getShopUser
//
//@author
//@since 2010/10/03
//
//@access public
//@return void
//
//
//getRegistFlg
//
//@author
//@since 2010/10/12
//
//@access protected
//@return void
//
//
//checkPostID
//
//@author
//@since 2010/10/07
//
//@param mixed $postid
//@access public
//@return void
//
//
//getRootPost
//
//@author
//@since 2010/10/07
//
//@access public
//@return void
//
//
//setPostID
//
//@author
//@since 2010/10/07
//
//@param mixed $postid
//@access public
//@return void
//
//
//getPostID
//
//@author
//@since 2010/10/07
//
//@access public
//@return void
//
//
//setfjpModelObject
//
//@author igarashi
//@since 2011/07/07
//
//@param mixed $fjp
//@access public
//@return void
//
//
//registrationPast
//
//@author igarashi
//@since 2011/07/20
//
//@param mixed $H_sess
//@param mixed $sql
//@access public
//@return void
//
//
//checkExists
//
//@author igarashi
//@since 2011/07/28
//
//@param mixed $H_order
//@access public
//@return void
//
//
//checkExtensionNo
//
//@author igarashi
//@since 2011/10/24
//
//@param mixed $H_sess
//@param mixed $H_order
//@access public
//@return void
//
//
//getPastMonth
//
//@author igarashi
//@since 2011/10/26
//
//@param mixed $H_sess
//@param mixed $H_order
//@access protected
//@return void
//
//
//makeReserveExtension
//
//@author igarashi
//@since 2011/10/27
//
//@param mixed $H_extension
//@access protected
//@return void
//
//
//getExtensionTelModel
//
//@author igarashi
//@since 2011/10/27
//
//@access protected
//@return void
//
//
//regetExtensionNo
//
//@author igarashi
//@since 2011/11/08
//
//@param mixed $orderid
//@access public
//@return void
//
//
//releaseExtensionNo
//
//@author igarashi
//@since 2011/11/08
//
//@param mixed $H_order
//@access protected
//@return void
//
//
//checkExtensionNoFunction
//
//@author igarashi
//@since 2011/12/08
//
//@access public
//@return void
//
//
//getShopAdminAuth
//
//@author igarashi
//@since 2011/12/21
//
//@param mixed $viewObject
//@param mixed $memid
//@access public
//@return void
//
//
//createAuthObjectForShopAdmin
//
//@author igarashi
//@since 2011/12/21
//
//@param mixed $memid
//@access public
//@return void
//
//
//checkShopAdminFuncId
//
//@author igarashi
//@since 2011/12/21
//
//@param mixed $fncid
//@access public
//@return void
//
//
//checkShopFuncId
//
//@author date
//@since 2014/10/1
//@param $memid
//@param mixed $fncid
//@access public
//@return bool
//
//
//getMailContents
//
//@author igarashi
//@since 2012/01/16
//
//@param mixed $orderid
//@access protected
//@return void
//
// 改番ボタン押した時のアップデート
//
// @author date
// @since 2015/01/16
//
// @param mixed $orderid
// @access protected
// @return void
// 改番取消しボタン押した時のアップデート
//
// @author date
// @since 2015/01/16
//
// @param mixed $orderid
// @access protected
// @return void
//  この注文にて発注された電話番号が電話管理にあるか調べる
//改番を行うかどうか
//
//デストラクタ
//
//@author igarashi
//@since 2008/07/04
//
//@access public
//@return void
//
class ShopOrderDetailModel extends ShopOrderModelBase {
	static FNC_SECROOT = 60;
	static FNC_PACT_LOGIN = 206;
	static FNC_EXT_NO = 158;
	static FNC_PRINT_ALWAYS = 27;
	static FNC_PRINT_UPDATE = 28;
	static FNC_ORDERMAIL_SEND = 29;
	static FNC_ASSETS = 130;

	constructor(O_db0, H_g_sess) {
		super(O_db0, H_g_sess, ShopOrderDetailModel.SITE_SHOP);
		this.insertPastMonth = true;
		this.procReserveExtension = Array();
		this.A_tel_detail = Array();
		this.A_management_property = Array();
		this.O_Set.loadConfig("stock");
		this.O_Set.loadConfig("shop_sales");
		this.O_Sess = MtSession.singleton();
	}

	getTelDetails(orderid, detail_sort = undefined) //mt_order_tel_detailsを取得する関数については、全てこれに置き換えたい・・a
	//20190426 一括ステータス変更対応のため、orderidごとに値を保持するように修正
	//初期化済みかのチェックを行う
	{
		if (!(undefined !== this.A_tel_detail[orderid])) //全カラム取得
			//detail_sortをkeyにする
			{
				var sql = "SELECT * FROM " + ShopOrderDetailModel.ORD_DET_TB + " WHERE " + " orderid=" + orderid + " ORDER BY" + " detail_sort";
				var details = this.get_DB().queryHash(sql);
				var temp = Array();

				if (!!details) {
					for (var key in details) {
						var value = details[key];
						temp[value.detail_sort] = value;
					}
				}

				this.A_tel_detail[orderid] = temp;
			}

		if (is_null(detail_sort)) {
			return this.A_tel_detail[orderid];
		}

		if (undefined !== this.A_tel_detail[orderid][detail_sort]) {
			return this.A_tel_detail[orderid][detail_sort];
		}

		return false;
	}

	getManagementPropertys(pactid) //追加管理項目の取得
	//20190426 一括ステータス変更対応のため、pactidごとに値を保持するように修正
	//mangement_propertyの取得について、順次置き換えていきたい・・
	{
		if (!(undefined !== this.A_management_property[pactid])) //全カラム取得
			//text1やint1をkeyにする
			{
				var sql = "SELECT *  FROM" + " management_property_tb" + " WHERE " + " mid=1 " + " AND pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " ORDER BY sort";
				var propertys = this.get_DB().queryHash(sql);
				var temp = Array();

				if (!!propertys) {
					for (var key in propertys) {
						var value = propertys[key];
						temp[value.col] = value;
					}
				}

				this.A_management_property[pactid] = temp;
			}

		return this.A_management_property[pactid];
	}

	getDate_StringToArray(date_string) //空ならnullを返す・・
	{
		if (!date_string) {
			return undefined;
		}

		var date_array = Array();
		date_array.Y = date_string.substr(0, 4);
		date_array.y = date_array.Y;
		date_array.m = date_string.substr(5, 2);
		date_array.d = date_string.substr(8, 2);
		return date_array;
	}

	getToTransferDetail(orderid, shopid) {
		if (false == Array.isArray(shopid)) {
			shopid = [shopid];
		}

		var sql = "SELECT " + "detail_sort, ordersubid, toshopid, fromshopid, transfer_type, transfer_status " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + orderid + " AND toshopid IN (" + shopid.join(", ") + ") " + "GROUP BY " + "detail_sort, ordersubid, toshopid, fromshopid, transfer_type, transfer_status, transfer_level " + "ORDER BY " + "detail_sort, transfer_level";
		var H_temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_temp)) {
			H_result.gif[val.detail_sort].ordersubid = val.ordersubid;
			H_result.gif[val.detail_sort].toshopid = val.toshopid;
			H_result.gif[val.detail_sort].fromshopid = val.fromshopid;
			H_result.gif[val.detail_sort].transfer_type = val.transfer_type;
			H_result.gif[val.detail_sort].transfer_status = val.transfer_status;
			H_result.name[val.detail_sort][val.fromshopid] = val.fromshopid;
		}

		return H_result;
	}

	getFromTransferDetail(orderid, shopid) {
		if (false == Array.isArray(shopid)) {
			shopid = [shopid];
		}

		var sql = "SELECT " + "detail_sort, ordersubid, toshopid, fromshopid, transfer_type, transfer_status " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + orderid + " AND fromshopid IN (" + shopid.join(", ") + ") " + "GROUP BY " + "detail_sort, ordersubid, toshopid, fromshopid, transfer_type, transfer_status, transfer_level " + "ORDER BY " + "detail_sort, transfer_level";
		var H_temp = this.get_DB().queryHash(sql);

		for (var val of Object.values(H_temp)) {
			H_result.gif[val.detail_sort].ordersubid = val.ordersubid;
			H_result.gif[val.detail_sort].toshopid = val.toshopid;
			H_result.gif[val.detail_sort].fromshopid = val.fromshopid;
			H_result.gif[val.detail_sort].transfer_type = val.transfer_type;
			H_result.gif[val.detail_sort].transfer_status = val.transfer_status;
			H_result.name[val.detail_sort][val.toshopid] = val.toshopid;
		}

		return H_result;
	}

	getShopList(H_g_sess, groupid) {
		var O_menu = new ShopOrderMenuModel(O_db0, H_g_sess);
		return O_menu.getShopList(groupid);
	}

	getCarrierPointInfo(carid) {
		var sql = "SELECT unit, rate FROM carrier_tb WHERE carid=" + carid;
		var A_result = this.get_DB().queryRowHash(sql);

		if (undefined == A_result.unit) {
			A_result.unit = 0;
		}

		if (undefined == A_result.rate) {
			A_result.rate = 0;
		} else //$A_result["rate"] = ceil($A_result["unit"] * ($A_result["rate"] / 100));
			{
				A_result.rate = A_result.rate / 100;
			}

		return A_result;
	}

	getPointRate(H_view) {
		H_view.pnt_rate.calc = Math.round(H_view.pnt_rate.unit * H_view.pnt_rate.rate);
	}

	getOrderMachineNumber(orderid, ordertype = "") {
		if (this.O_order.type_mis != ordertype) {
			var sql = "SELECT telcnt" + " FROM " + ShopOrderDetailModel.ORD_TB + " WHERE orderid=" + orderid;
		} else {
			sql = "SELECT number" + " FROM " + ShopOrderDetailModel.ORD_SUB_TB + " WHERE orderid=" + orderid;
		}

		return this.get_DB().queryOne(sql);
	}

	getOrderInfo(H_g_sess, orderid, shopid, A_shopid = Array(), A_arid = "") //if($this->O_order->type_blp == $ordertype){
	//			$subfrom .= "LEFT JOIN mt_transfer_tb tran ON (tran.orderid=ord.orderid AND tran.detail_sort=det.detail_sort AND tran.transfer_level=1) ";
	//		}else{
	//			$subfrom .= "LEFT JOIN mt_transfer_tb tran ON (tran.orderid=ord.orderid) ";
	//		}
	//if($this->O_order->type_blp == $ordertype){
	//			$detfrom .= "LEFT JOIN mt_transfer_tb tran ON (ord.orderid=tran.orderid AND det.detail_sort=tran.detail_sort AND tran.transfer_level=1) ";
	//		}else{
	//			$detfrom .= "LEFT JOIN mt_transfer_tb tran ON (ord.orderid=tran.orderid) ";
	//		}
	{
		var lang = this.getBillView().getLangLists("billhow");
		var ordertype = this.get_DB().queryOne("SELECT ordertype FROM " + ShopOrderDetailModel.ORD_TB + " where orderid=" + orderid);
		var ordsql = "SELECT " + "distinct(ord.orderid), stat.forcustomer, car.carname, ptn.ptnname, ord.pactid, " + "ord.postid, ord.zip1, ord.zip2, ord.telcnt, ord.misctype, " + "ord.postname, ord.ordertype, ord.status, ord.shopid, ord.recdate, ord.settlement, " + "ord.cirid, ord.chargername, ord.chargerid, ord.carid, ord.pointradio, ord.point, " + "ord.billradio, ord.parent, ord.billaddress, ord.dateradio, ord.datefrom, ord.dateto, " + "ord.datechangeradio, ord.datechange, ord.note, ord.sendhow, ord.sendname, ord.sendpost, ord.addr1, " + "ord.addr2, ord.building, ord.sendtel, ord.reason, ord.shopnote, ord.billtotal, ord.billsubtotal, " + "ord.fee, ord.applyprice, ord.chpostid, ord.chpostname, ord.nextpostid, ord.nextpostname, " + "ord.anspost, ord.ansuser, ord.ansdate, ord.transfer, ord.buyselid, ord.terminal_del, " + "ptn.tplfile, pa.compname, pa.userid_ini, cir.cirname, shmem.name as memname, " + "buy.buyselname, stat.forshop, prsi.signeddate, " + "ord.receipt, ord.paymentprice, ord.slipno, ord.message, ord.pay_point, ord.service, " + "ord.pacttype, ord.pointsum, ord.recogmail, prtel.prtelno, prtel.prtelname, ord.transfer_type, " + "ord.disfee, ord.disfeecharge, ord.webreliefservice, ord.smartphonetype, ord.attachedfile, ord.attachedshop, " + "ord.recogcode, ord.pbpostcode, ord.pbpostcode_first, ord.pbpostcode_second, " + "ord.cfbpostcode, ord.cfbpostcode_first, ord.cfbpostcode_second, ord.ioecode, ord.coecode, ord.commflag, " + "u.username, p1.postname AS pbpostname, p2.postname AS cfbpostname, ord.billname, ord.billpost, ord.receiptname, " + "ord.billzip1, ord.billzip2, ord.billaddr1, ord.billaddr2, ord.billbuild, ord.billtel, ord.finishdate, ord.deliverydate_type, ord.send_deliverydate_flg," + "CASE billhow " + "WHEN 'card' THEN '" + lang.card.JPN + "' " + "WHEN 'bank' THEN '" + lang.bank.JPN + "' " + "WHEN 'cash' THEN '" + lang.cash.JPN + "' " + "ELSE '" + lang.misc.JPN + "' END AS billhowview, " + "ord.division, ord.billtotal2, " + "ord.is_not_delete_tel, " + "CASE " + "WHEN ord.phone_management_leave = true THEN '1' " + "WHEN ord.phone_management_leave = false THEN '2' " + "ELSE '0' END as phone_management_leave ";
		var ordfrom = "FROM " + ShopOrderDetailModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderDetailModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid " + "INNER JOIN mt_status_tb stat ON ord.status=stat.status " + "INNER JOIN mt_order_pattern_tb ptn ON (ord.ordertype=ptn.type AND ord.carid=ptn.carid AND ord.cirid=ptn.cirid) " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "LEFT JOIN bill_prtel_tb prtel ON (ord.parent=prtel.prtelno AND ord.pactid=prtel.pactid AND ord.carid=prtel.carid) ";
		ordfrom += "LEFT JOIN pact_tb pa ON ord.pactid=pa.pactid " + "LEFT JOIN circuit_tb cir ON ord.cirid=cir.cirid " + "LEFT JOIN buyselect_tb buy ON ord.buyselid=buy.buyselid " + "LEFT JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "LEFT JOIN post_rel_shop_info_tb prsi ON (prsi.pactid=ord.pactid AND prsi.shopid=ord.shopid) " + "LEFT JOIN post_tb p1 ON ord.pbpostcode_first=p1.userpostid AND ord.pactid=p1.pactid " + "LEFT JOIN post_tb p2 ON ord.cfbpostcode_first=p2.userpostid AND ord.pactid=p2.pactid " + "LEFT JOIN user_tb u ON ord.recoguserid=u.userid ";
		var subsql = "SELECT " + "sub.orderid, sub.ordersubid, sub.expectdate, sub.fixdate, sub.memory, sub.recovery, sub.substatus, stat.forshop, " + "stat.forsub, sub.machineflg, sub.expectflg, sub.productid, sub.productname, sub.property, sub.anspassprice, " + "sub.saleprice, sub.shoppoint, sub.shoppoint2, sub.number, sub.subcomment, sub.branchid, sub.pricelistid, " + "sub.deliverydate, sub.stockflg, sub.detail_sort,sub.deliverydate_type,sub.send_deliverydate_flg ";
		var subfrom = "FROM " + ShopOrderDetailModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderDetailModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid " + "LEFT JOIN " + ShopOrderDetailModel.ORD_DET_TB + " det ON ord.orderid=det.orderid " + "INNER JOIN mt_status_tb stat ON sub.substatus=stat.status ";
		var detsql = "SELECT " + "det.orderid, det.ordersubid, det.contractor, det.mnpno, det.formercarid,det.mnp_enable_date, formercar.carname as formercarname, " + "det.planradio, det.plan, det.packetradio, det.packet, det.passwd, det.userid, det.discounttel, " + "det.machineflg, det.telno, det.option, det.registdate, det.employeecode, det.telusername, " + "det.holdername, det.kousiradio, det.kousi as kousiid, kousi.patternname as kousiname, det.simcardno, " + "det.pay_startdate, det.pay_monthly_sum, det.pay_frequency, det.contractdate, det.serialno, " + "plan.planname, plan.viewflg as planview, packet.packetname, usr.username, det.arid, det.mail, det.registflg, ";

		if (this.O_order.type_blp != ordertype) {
			detsql += "det.freeword1 as free_one, det.freeword2 as free_two, det.freeword3 as free_the, det.freeword4 as free_for, det.freeword5 as free_fiv, ";
		}

		detsql += "det.buytype1, det.buytype2, det.substatus, stat.forshop, det.saleprice, det.shoppoint, det.shoppoint2, det.cirid, cir.cirname, " + "det.bef_plan, befplan.planname as befplanname, det.bef_packet, befpack.packetname as befpacketname, det.telno_view, " + "det.postid, post.postname, det.waribiki, det.deliverydate, det.expectdate, det.subcomment, det.sale_monthly_sum, " + "stat.forsub, det.productid, sub.branchid, det.stockflg, det.detail_sort, det.extensionno,det.receiptdate,det.deliverydate_type,det.send_deliverydate_flg,det.kaiban_telno,det.kaiban_telno_view ";
		var detfrom = "FROM " + ShopOrderDetailModel.ORD_TB + " ord " + "INNER JOIN " + ShopOrderDetailModel.ORD_SUB_TB + " sub ON ord.orderid=sub.orderid " + "LEFT JOIN " + ShopOrderDetailModel.ORD_DET_TB + " det ON (ord.orderid=det.orderid AND det.ordersubid=sub.ordersubid) " + "INNER JOIN mt_status_tb stat ON det.substatus=stat.status ";
		detfrom += "LEFT JOIN plan_tb plan ON det.plan=plan.planid " + "LEFT JOIN plan_tb befplan ON det.bef_plan=befplan.planid " + "LEFT JOIN circuit_tb cir ON det.cirid=cir.cirid " + "LEFT JOIN packet_tb packet ON det.packet=packet.packetid " + "LEFT JOIN packet_tb befpack ON det.bef_packet=befpack.packetid " + "LEFT JOIN user_tb usr ON det.userid=usr.userid " + "LEFT JOIN kousi_pattern_tb kousi ON det.kousi=kousi.patternid " + "LEFT JOIN post_tb post ON det.postid=post.postid " + "LEFT JOIN tel_tb tel ON (det.telno=tel.telno AND ord.carid=tel.carid AND ord.pactid=tel.pactid) " + "LEFT JOIN tel_rel_assets_tb tra ON (tel.telno=tra.telno AND ord.carid=tra.carid AND ord.pactid=tra.pactid) " + "LEFT JOIN assets_tb asts ON asts.assetsid=tra.assetsid " + "LEFT JOIN carrier_tb formercar ON det.formercarid=formercar.carid ";
		var where = "WHERE " + "ord.orderid=" + orderid + " ";

		if (true == Array.isArray(A_arid) && this.O_order.type_blp == ordertype) {
			where += " AND det.arid IN (" + A_arid.join(", ") + ") ";
		}

		if (false == this.checkUnifyShop(H_g_sess, shopid)) //$where .= " AND (ord.shopid= " .$shopid. " OR  tran.toshopid=" .$shopid. ") ";
			{}

		var ordsub = "GROUP BY " + "sub.orderid, sub.ordersubid, sub.expectdate, sub.fixdate, sub.memory, sub.recovery, sub.substatus, stat.forshop, " + "stat.forsub, sub.machineflg, sub.expectflg, sub.productid, sub.productname, sub.property, sub.anspassprice, " + "sub.saleprice, sub.shoppoint, sub.shoppoint2, sub.number, sub.subcomment, sub.branchid, sub.pricelistid, " + "sub.deliverydate, sub.stockflg, sub.detail_sort,sub.deliverydate_type,sub.send_deliverydate_flg " + "ORDER BY " + "sub.detail_sort";
		var orddet = "GROUP BY " + "det.orderid, det.ordersubid, det.contractor, det.mnpno, det.formercarid,det.mnp_enable_date, formercarname, " + "det.planradio, det.plan, det.packetradio, det.packet, det.passwd, det.userid, det.discounttel, " + "det.machineflg, det.telno, det.option, det.registdate, det.employeecode, det.telusername, " + "det.holdername, det.kousiradio, kousiid, kousiname, det.simcardno, " + "det.pay_startdate, det.pay_monthly_sum, det.pay_frequency, det.contractdate, det.serialno, " + "plan.planname, planview, packet.packetname, usr.username, det.arid, det.mail, " + "det.freeword1, det.freeword2, det.freeword3, det.freeword4, det.freeword5, " + "det.buytype1, det.buytype2, det.substatus, stat.forshop, det.saleprice, det.shoppoint, det.shoppoint2, det.cirid, cir.cirname, " + "det.bef_plan, befplanname, det.bef_packet, befpacketname, det.telno_view, det.postid, post.postname, " + "det.waribiki, det.deliverydate, det.expectdate, det.subcomment, det.sale_monthly_sum, " + "stat.forsub, det.productid, sub.branchid, det.stockflg, det.registflg, det.detail_sort, det.extensionno,det.receiptdate,det.deliverydate_type,det.send_deliverydate_flg,det.kaiban_telno,det.kaiban_telno_view ";

		if (this.O_order.type_blp != ordertype) {
			orddet += "ORDER BY " + "det.detail_sort";
		} else //$orddet .= ", tran.toshopid ";
			//$orddet .= "ORDER BY ".
			//"tran.toshopid, det.cirid, det.detail_sort";
			{}

		var H_detail = this.get_DB().queryHash(detsql + detfrom + where + orddet);
		var H_sub = this.get_DB().queryHash(subsql + subfrom + where + ordsub);

		if (0 < H_detail.length) {
			H_data.sub = this.mergeOrderData(H_detail, H_sub, ordertype, ShopOrderDetailModel.SITE_SHOP);
		} else {
			H_data.sub = H_sub;
		}

		var H_result = this.pergeMachineOrAcce(H_data.sub);
		H_result.order = this.get_DB().queryRowHash(ordsql + ordfrom + where);

		if (this.O_order.type_blp != ordertype) {
			if (0 < H_detail.length) {
				H_result.regist = this.mergeOrderDataRegister(H_detail, H_sub, H_result.order.ordertype);
			} else {
				H_result.regist = H_sub;
			}
		}

		H_result.order.contractor = H_detail[0].contractor;

		if (!H_result.machine) {
			H_result.acce[0].telno = H_detail[0].telno;
		}

		return H_result;
	}

	mergeOrderDataRegister(H_detail, H_sub, ordertype) {
		var subcnt = H_sub.length;
		var detmax = H_detail.length;
		var A_temp = this.O_order.A_empty;
		var A_log = this.O_order.A_empty;

		for (var idx = 0; idx < detmax; idx++) {
			for (var loop = 0; loop < subcnt; loop++) //subidが一緒ならマージしても大丈夫
			{
				if (false == (-1 !== A_log.indexOf(H_sub[loop].ordersubid))) {
					if (H_sub[loop].ordersubid == H_detail[idx].ordersubid) {
						if (true == H_sub[loop].machineflg) //付属品は端末情報いらない
							{
								if (this.O_order.type_acc != ordertype) {
									A_result[H_sub[loop].detail_sort] = H_sub[loop] + H_detail[idx];
								}
							} else {
							A_result[H_sub[loop].detail_sort] = H_sub[loop];
						}

						A_log.push(H_sub[loop].ordersubid);
					} else {
						A_result[H_sub[loop].detail_sort] = H_sub[loop];
						A_log.push(H_sub[loop].ordersubid);
					}
				}
			}
		}

		ksort(A_result);
		return A_result;
	}

	getOrderHistory(orderid) {
		var sql = "SELECT " + "orderid, chdate, shopperson, shopcomment " + "FROM " + "mt_order_history_tb " + "WHERE " + "orderid=" + orderid + " " + "AND shopid IS NOT NULL " + "AND shopcomment IS NOT NULL " + "ORDER BY " + "chdate";
		return this.get_DB().queryHash(sql);
	}

	pergeMachineOrAcce(H_order) {
		H_data.machine = this.O_order.A_empty;
		H_data.acce = this.O_order.A_empty;

		for (var key in H_order) {
			var val = H_order[key];

			if (true == val.machineflg) {
				H_data.machine.push(val);
			} else {
				H_data.acce.push(val);
			}
		}

		return H_data;
	}

	repairOrderData(H_data, name, repair, dimflg = false, empflg = false) {
		if (undefined == H_data) {
			return H_data;
		}

		if (true == dimflg) {
			for (var key in H_data) {
				var val = H_data[key];

				if (undefined == val[name] || true == empflg && "" == val[name]) {
					H_data[key][name] = repair;
				}
			}
		} else {
			if (false == (-1 !== H_data.indexOf(name))) {
				H_data[name] = repair;
			} else if (true == empflg && "" == H_data[name]) {
				H_data[name] = repair;
			}
		}

		return H_data;
	}

	castArraytoStr(H_hash) {
		for (var key in H_hash) {
			var val = H_hash[key];
			H_hash[key] = String(val);
		}

		return H_hash;
	}

	convOrderInfo(H_order) {
		return H_order;
	}

	getOrderSubCount(orderid, mode = "count") {
		if ("count" == mode) {
			var sql = "SELECT sum(number) FROM " + ShopOrderDetailModel.ORD_SUB_TB + " WHERE orderid=" + orderid;
			return this.get_DB().queryOne(sql);
		} else if ("line" == mode) {
			sql = "SELECT COUNT(orderid) FROM " + ShopOrderDetailModel.ORD_SUB_TB + " WHERE orderid=" + orderid;
			return this.get_DB().queryOne(sql);
		} else if ("telline" == mode) {
			sql = "SELECT COUNT(orderid) FROM " + ShopOrderDetailModel.ORD_DET_TB + " WHERE orderid=" + orderid;
			return this.get_DB().queryOne(sql);
		} else if ("array" == mode) {
			sql = "SELECT ordersubid FROM " + ShopOrderDetailModel.ORD_SUB_TB + " WHERE orderid=" + orderid + " " + "ORDER BY ordersubid";
			return this.get_DB().queryCol(sql);
		}
	}

	getOrderDetailCount(orderid, mode = "all", level = 1) {
		if ("all" == mode) {
			var sql = "SELECT detail_sort, ordersubid, orderid FROM " + ShopOrderDetailModel.ORD_SUB_TB + " WHERE orderid=" + orderid + " AND machineflg=false " + "ORDER BY detail_sort";
			var H_sub = this.get_DB().queryHash(sql);
			sql = "SELECT detail_sort, ordersubid, orderid FROM " + ShopOrderDetailModel.ORD_DET_TB + " WHERE orderid=" + orderid + " " + "ORDER BY detail_sort";
			var H_detail = this.get_DB().queryHash(sql);
			return this.mergeCheckArray(H_detail, H_sub);
		} else if ("trans" == mode) {
			sql = "SELECT detail_sort, ordersubid, orderid FROM mt_transfer_tb WHERE orderid=" + orderid + " AND transfer_level=" + level;
			"ORDER BY detail_sort";
			return this.get_DB().queryHash(sql);
		}
	}

	getShopOrderStatus(flg = false) {
		var sql = "SELECT status, forshop, shopflg FROM mt_status_tb WHERE shopflg=true AND subflg=false AND status NOT IN (190, 200) ORDER BY sort";
		var H_result = this.get_DB().queryAssoc(sql);

		if (true == flg) {
			H_result[0] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
		}

		return H_result;
	}

	getShopMember(shopid, flg = false) {
		var sql = "SELECT memid, name FROM shop_member_tb WHERE shopid=" + shopid + " ORDER BY memid";
		var H_result = this.get_DB().queryAssoc(sql);

		if (true == flg) {
			H_result[0] = "\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044";
		}

		return H_result;
	}

	getSettlement() {
		var header = "<span style=\"font-size:12px\">";
		var footer = "</span>";
		return {
			cash: [header + "\u73FE\u91D1\u6C7A\u6E08" + footer],
			card: [header + "\u30AF\u30EC\u30B8\u30C3\u30C8\u6C7A\u6E08" + fotter],
			bill: [header + "\u8ACB\u6C42\u66F8\u6255" + footer],
			window: [header + "\u7A93\u53E3\u5373\u7D0D" + footer]
		};
	}

	convTlementView(name) {
		switch (name) {
			case "cash":
				var result = "\u73FE\u91D1\u6C7A\u6E08";
				break;

			case "card":
				result = "\u30AF\u30EC\u30B8\u30C3\u30C8\u6C7A\u6E08";
				break;

			case "bill":
				result = "\u8ACB\u6C42\u66F8\u6255\u3044";
				break;

			case "window":
				result = "\u7A93\u53E3\u5373\u7D0D";
				break;

			default:
				result = "";
				break;
		}

		return result;
	}

	getToTransferShop(orderid, mode = "hash") {
		var sql = "SELECT " + "trns.transfer_level, trns.toshopid, trns.detail_sort, shop.name, shop.postcode " + "FROM " + "mt_transfer_tb trns " + "INNER JOIN shop_tb shop ON trns.toshopid=shop.shopid " + "WHERE " + "trns.orderid=" + orderid + " " + "ORDER BY transfer_level";
		var H_trns = this.get_DB().queryHash(sql);

		if ("hash" == mode) {
			return H_trns;
		} else if ("code" == mode) {
			var result = "";

			if (0 < H_trns.length) {
				for (var val of Object.values(H_trns)) {
					result += val.postcode + "<br>";
				}
			}

			return result;
		}
	}

	makeMailMaterialData(H_sess, H_order, mode) {
		if ("indiv" == mode) {
			H_result.chgstatus = +H_sess.status;
			H_result.nowstatus = H_order.order.status;
			H_result.orderid = H_order.order.orderid;
			H_result.type = H_order.order.ordertype;
			H_result.carid = H_order.order.carid;
			H_result.cirid = H_order.order.cirid;
		} else if ("lump" == mode) {
			H_result.chgstatus = +H_sess.lumpstatus;
			H_result.nowstatus = H_order.status;
			H_result.orderid = H_order.orderid;
			H_result.type = H_order.ordertype;
			H_result.carid = H_order.carid;
			H_result.cirid = H_order.cirid;
		}

		return H_result;
	}

	sendOrderFinishMail(H_sess, H_order, mode = "indiv", showfjp = false) //完了orキャンセル以外はメールを送らない
	//過去に名前が変更される修正をしたようだけど、不要なので削除 20160907
	//$sql = "SELECT name FROM shop_member_tb WHERE type='SU' AND shopid=(SELECT shopid FROM mt_order_tb WHERE orderid=".$orderid.")";
	//$H_mail["addr"][0]["name"] = $this->get_DB()->queryOne($sql);
	//申請者と承認者が同じなら申請者いらない
	{
		var H_data = this.makeMailMaterialData(H_sess, H_order, mode);

		if (false == this.checkEndStatus(H_data.chgstatus, H_data.nowstatus) || this.O_order.st_complete > H_data.chgstatus) {
			return false;
		}

		if (true == (undefined !== H_order.order.orderid)) {
			var orderid = H_order.order.orderid;
		} else if (true == (undefined !== H_order.orderid)) {
			orderid = H_order.orderid;
		} else {
			return false;
		}

		var O_mail = new MtMailUtil();
		var H_recog = this.get_DB().queryRowHash("SELECT his.chuserid, his.chname, his.chpostname " + "FROM mt_order_history_tb his INNER JOIN user_tb use ON his.chuserid=use.userid " + "WHERE his.chpostid IS NOT NULL AND his.orderid=" + orderid + " AND his.status=" + this.O_order.st_unsest);
		var H_apply = this.get_DB().queryRowHash("SELECT ord.applyuserid " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord INNER JOIN user_tb use ON ord.applyuserid=use.userid " + "WHERE orderid=" + orderid);
		var sql = "SELECT " + "ord.recogmail, ord.applymail, shmem.name, shmem.mail " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord " + "INNER JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "WHERE " + "ord.orderid=" + H_data.orderid;
		H_mail.addr = this.O_order.A_empty;
		H_mail.addr.push(this.get_DB().queryRowHash(sql));

		if (undefined != H_recog) {
			var recflg = this.get_DB().queryOne("SELECT acceptmail5 FROM user_tb WHERE userid=" + H_recog.chuserid);
		} else {
			var recfgl = 0;
		}

		if (H_apply != undefined && H_recog.chuserid != H_apply.applyuserid) {
			var applyflg = this.get_DB().queryOne("SELECT acceptmail5 FROM user_tb WHERE userid=" + H_apply.applyuserid);
		} else {
			applyflg = 0;
		}

		var A_to = this.O_order.A_empty;

		if (1 == recflg) {
			sql = "SELECT pact.compname " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "WHERE ord.orderid=" + orderid;
			var H_usedata = this.get_DB().queryRowHash(sql);

			if ("" != H_mail.addr[0].recogmail && undefined != H_mail.addr[0].recogmail) {
				A_to.push({
					to: H_mail.addr[0].recogmail,
					to_name: H_usedata.compname + " " + H_recog.chpostname + " " + H_recog.chname + "\u69D8"
				});
			}
		}

		if (1 == applyflg) {
			sql = "SELECT pact.compname, ord.postname, ord.chargername " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "WHERE orderid=" + orderid;
			H_usedata = this.get_DB().queryRowHash(sql);

			if ("" != H_mail.addr[0].applymail && undefined != H_mail.addr[0].applymail) {
				A_to.push({
					to: H_mail.addr[0].applymail,
					to_name: H_usedata.join(" ") + "\u69D8"
				});
			}
		}

		var pacttype = H_order.order.pacttype;
		var pactid = H_order.order.pactid;

		if (is_null(pacttype) || !pacttype) {
			pacttype = H_order.pacttype;
			pactid = H_order.pactid;
		}

		if (!is_null(pacttype)) //k-42
			{
				H_mail.cont = this.makeOrderMailContents(H_data, H_recog, H_apply, pacttype, pactid, showfjp);

				if (undefined != H_mail.cont) {
					O_mail.multiSend(A_to, H_mail.cont[0].message, H_mail.addr[0].mail, H_mail.cont[0].subject, H_mail.addr[0].name);
				}
			}

		return true;
	}

	makeOrderMailContents(H_data, H_recog, H_user, pacttype, pactid = "", showfjp = false) //ステータスによって送信する内容を変更する
	//受注種別とキャリアと回線種別
	//受付番号桁揃え
	//url取得
	//k-42
	//振り分け
	//complete		:	完了（最終承認者と申請者に飛ぶ）
	//ordercancell	:	キャンセル（最終承認者と申請者に飛ぶ）
	//完了（最終承認者と申請者に飛ぶ）
	{
		var O_group = new GroupModel(O_db);

		if (this.O_order.st_cancel == H_data.chgstatus) {
			var mailtype = "ordercancell";
		} else if (this.O_order.st_complete == H_data.chgstatus) {
			mailtype = "complete";
		} else {
			return undefined;
		}

		var ptn_sql = "SELECT " + "usertypename " + "FROM " + "mt_order_pattern_tb " + "WHERE " + "type = '" + H_data.type + "' " + "AND carid = " + H_data.carid + " " + "AND cirid = " + H_data.cirid;
		var usertypename = this.get_DB().queryOne(ptn_sql);
		var orderidstr = str_pad(H_data.orderid, 10, "0", STR_PAD_LEFT);
		var urlname = this.getReturnURL(this.O_Sess.groupid, "user", pacttype, O_group.getGroupName(this.O_Sess.groupid), pactid);
		var sysname = O_group.getGroupSystemName(this.O_Sess.groupid);
		var subject = message = undefined;

		if (mailtype == "complete") {
			subject = sysname + "\uFF1A" + usertypename + "\u306E\u6CE8\u6587\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\uFF08" + orderidstr + "\uFF09";
			subject += sysname + " order completed.";
			message = "<< " + sysname + " : \u53D7\u6CE8\u5B8C\u4E86\u306E\u304A\u77E5\u3089\u305B >>\n" + "-------------------------------------------------------------\n" + usertypename + "\u306E\u6CE8\u6587\u306E\u51E6\u7406\u3092\u5B8C\u4E86\u3057\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n" + "\n" + sysname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n" + "\u53D7\u4ED8\u756A\u53F7\u306F " + orderidstr + " \u3067\u3059\u3002\n" + "\n" + urlname + "\n" + "-------------------------------------------------------------\n" + "\n\n" + "<<" + sysname + " Order Completed>>\n" + "-------------------------------------------------------------\n" + sysname + " order transaction completed.\n" + "\n" + "Please access the " + sysname + " website to confirm the details.\n" + "Order ID is " + orderidstr + ".\n" + "\n" + urlname + "\n" + "-------------------------------------------------------------\n";
		} else if (mailtype == "ordercancell") //$sysname. "のサイトにアクセスして、詳細をご確認ください。\n".
			{
				subject = sysname + "\uFF1A" + usertypename + "\u306E\u6CE8\u6587\u304C\u30AD\u30E3\u30F3\u30BB\u30EB\u3055\u308C\u307E\u3057\u305F\uFF08" + orderidstr + "\uFF09";
				subject += sysname + ": Order Cancelled.";
				message = "<< " + sysname + " : \u53D7\u6CE8\u30AD\u30E3\u30F3\u30BB\u30EB\u306E\u304A\u77E5\u3089\u305B >>\n" + "-------------------------------------------------------------\n" + usertypename + "\u306E\u6CE8\u6587\u304C\u30AD\u30E3\u30F3\u30BB\u30EB\u3055\u308C\u307E\u3057\u305F\u3053\u3068\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n" + "\n";

				if (true === showfjp) {
					message += "\uFF1C\u30AD\u30E3\u30F3\u30BB\u30EB\u7406\u7531\u306E\u78BA\u8A8D\u624B\u9806\uFF1E\n" + "FJP \u56DE\u7DDA\u7BA1\u7406\u30B5\u30FC\u30D3\u30B9\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3001\u4E0B\u8A18\u624B\u9806\u306B\u3066\u51E6\u7406\u3092\u304A\u9858\u3044\u3057\u307E\u3059\u3002\n" + "(1)\u300C\u3054\u6CE8\u6587\u300D\u21D2\u300C\u3054\u6CE8\u6587\u5C65\u6B74\u300D\n" + "(2)\u30B9\u30C6\u30FC\u30BF\u30B9\u3067\u300C\u767A\u6CE8\u30AD\u30E3\u30F3\u30BB\u30EB\u300D\u3092\u9078\u629E\u21D2\u300C\u3053\u306E\u6761\u4EF6\u3067\u691C\u7D22\u3059\u308B\u300D\u3092\u62BC\u4E0B\n" + "(3)\u5BFE\u8C61\u306E\u6CE8\u6587\u306E\u300C\u53D7\u4ED8\u756A\u53F7\u300D\u3092\u62BC\u4E0B\n" + "(4)\u300C\u8CA9\u58F2\u5E97\u304B\u3089\u306E\u4F1D\u8A00\u300D\u3092\u78BA\u8A8D\n";
				} else {
					message += sysname + "\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n";
				}

				message += "\n" + "\u53D7\u4ED8\u756A\u53F7\u306F " + orderidstr + " \u3067\u3059\u3002\n" + "\n" + urlname + "\n" + "-------------------------------------------------------------\n" + "\n\n" + "<<" + sysname + " Order Cancelled>>\n" + "\n" + sysname + " order has been cancelled.\n" + "\n" + "Please access the " + sysname + " website to confirm the details.\n" + "Order ID is " + orderidstr + ".\n" + "-------------------------------------------------------------\n";
			}

		delete orderidstr;

		if (undefined != subject && undefined != message) {
			var H_mailcontent = this.O_order.A_empty;
			H_mailcontent.push({
				subject: subject,
				message: message
			});
		} else {
			H_mailcontent = undefined;
		}

		return H_mailcontent;
	}

	getReturnURL(groupid, mode = "shop", pacttype = "M", grpname = "kcs", pactid = "") //別ドメイン対応 20090819miya
	{
		var O_conf = MtSetting.singleton();
		O_conf.loadConfig("group");

		if (true == O_conf.existsKey("groupid" + groupid + "_is_original_domain") && true == O_conf["groupid" + groupid + "_is_original_domain"]) {
			var original_domain = true;
		} else {
			original_domain = false;
		}

		if ("user" == mode) {
			if (!!pactid) {
				this.setAuth(pactid);

				if ("object" === typeof this.O_UserAuth && this.O_UserAuth.chkPactFuncId(ShopOrderDetailModel.FNC_PACT_LOGIN)) {
					var sql = "SELECT userid_ini FROM pact_tb WHERE pactid=" + this.get_DB().dbQuote(pactid, "int", true);
					var ini_name = this.get_DB().queryOne(sql);
				}
			}

			if ("M" == pacttype) {
				if (true == original_domain) {
					var result = "https://" + _SERVER.SERVER_NAME + "/";

					if (!!ini_name) {
						result += grpname + "/" + ini_name + "/";
					}
				} else {
					if (3 > groupid) {
						result = "https://" + _SERVER.SERVER_NAME + "/";

						if (!!ini_name) {
							result += grpname + "/" + ini_name + "/";
						}
					} else {
						result = "https://" + _SERVER.SERVER_NAME + "/" + grpname + "/";

						if (!!ini_name) {
							result += ini_name + "/";
						}
					}
				}
			} else {
				if (true == original_domain) {
					result = "https://" + _SERVER.SERVER_NAME + "/Hotline/index.php";
				} else {
					if (3 > groupid) {
						result = "https://" + _SERVER.SERVER_NAME + "/Hotline/index.php";
					} else {
						result = "https://" + _SERVER.SERVER_NAME + "/" + grpname + "/hotline.php";
					}
				}
			}
		} else if ("shop" == mode) {
			if (true == original_domain) {
				result = "https://" + _SERVER.SERVER_NAME + "/index_shop.php";
			} else {
				if (3 > groupid) {
					result = "https://" + _SERVER.SERVER_NAME + "/index_shop.php";
				} else {
					result = "https://" + _SERVER.SERVER_NAME + "/" + grpname + "/index_shop.php";
				}
			}
		}

		return result;
	}

	getOrderId(H_order) //オーダーIDの取得
	{
		if (true == (undefined !== H_order.order.orderid)) {
			return H_order.order.orderid;
		} else if (true == (undefined !== H_order.orderid)) {
			return H_order.orderid;
		}

		return 0;
	}

	sendDeliveryDateMail(H_sess, H_order) ////  DB更新後のデータを取得します。
	//        $type = $this->getOrderDeliveryDateType($H_order);
	//        $bSend = false;
	//        if( $type == 2 ){
	//            if( $H_order["order"]["deliverydate_type"] != 2 ) {
	//                $bSend = true;
	//            }
	//        }else if( $type == 1 ){
	//            $bSend = true;
	//        }
	//メール送信対象があるか調べる
	//送信対象があるようなら送信する
	{
		var bSend = false;
		{
			let _tmp_0 = H_order.deliverydate_type;

			for (var key in _tmp_0) //送信フラグをチェックします
			{
				var value = _tmp_0[key];

				if (value.update_send == true && value.send_flg == 1) {
					bSend = true;
					break;
				}

				if (value.type == 1) {
					bSend = true;
					break;
				}
			}
		}

		if (bSend == true) {
			this.execSendDeliveryDateMail(H_sess, H_order);
		}
	}

	execSendDeliveryDateMail(H_sess, H_view) //ユーザー情報や販売店の名前とメールアドレスを取得する
	{
		var H_order = H_view.order;
		var orderdate_type = H_order.orderdate_type;
		var orderid = this.getOrderId(H_order);
		var H_data = this.makeMailMaterialData(H_sess, H_order, "indiv");
		var sql = "SELECT " + "ord.recogmail, use.mail as usermail, shmem.name as from_name, shmem.mail as from_mail " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord " + "INNER JOIN shop_member_tb shmem ON ord.shopmemid=shmem.memid " + "INNER JOIN user_tb use ON ord.applyuserid=use.userid " + "WHERE ord.orderid=" + orderid;
		var H_mail = this.get_DB().queryRowHash(sql);

		if (H_order.ordertype != "A") //更新された情報を取得したいので、電話の情報を取り直そう。
			{
				sql = "SELECT sub.productname,det.telno_view,det.deliverydate,det.deliverydate_type,det.detail_sort " + "FROM " + ShopOrderDetailModel.ORD_DET_TB + " det " + "INNER JOIN " + ShopOrderDetailModel.ORD_SUB_TB + " sub ON sub.orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " and det.ordersubid=sub.ordersubid " + "WHERE " + "det.orderid=" + orderid + " and det.substatus != " + this.get_DB().dbQuote(this.O_order.st_cancel, "int", true) + " ORDER BY det.detail_sort";
				var H_machine = this.get_DB().queryHash(sql);
			}

		sql = "SELECT deliverydate_type,productname,deliverydate,detail_sort " + "FROM " + ShopOrderDetailModel.ORD_SUB_TB + " " + "WHERE " + "orderid=" + orderid + "and machineflg=false and substatus!=230 " + "ORDER BY detail_sort";
		var H_acce = this.get_DB().queryHash(sql);
		var O_mail = new MtMailUtil();
		var pacttype = H_order.pacttype;
		var pactid = H_order.pactid;

		if (!is_null(pacttype)) //商品名、日付、未定予定日確定日を足していくよ
			//端末の予定日確定日をいれていくよ
			//送信元名(販売店担当者の名前)
			//件名
			//k-42
			//メッセージの作成
			//ユーザーのデータを取得します。
			//ユーザーのメールアドレス
			//ユーザーの名前
			//メールの送信
			{
				var order_item = "";

				if (!!H_machine && H_order.order.ordertype != "A") {
					for (var key in H_machine) //確定日になったものは送らない
					////  確定日を送るのは一度だけ
					//                    if ($deliverydate_type["type"] == 2) {
					//                        if ($deliverydate_type["update_send"] == false) continue;
					//                        if ($deliverydate_type["send_flg"] == 0)     continue;
					//                    }
					//納品日の設定
					{
						var value = H_machine[key];
						var deliverydate_type = H_view.deliverydate_type[value.detail_sort];
						order_item += value.productname + "   ";

						if (!value.telno_view) {
							order_item += "\u96FB\u8A71\u756A\u53F7\u672A\u8A2D\u5B9A";
						} else {
							order_item += value.telno_view;
						}

						order_item += "   ";

						if (is_null(value.deliverydate) || value.deliverydate_type == 0) //まだ納品日が設定されてないです。
							{
								order_item += "\u672A\u5B9A";
							} else //納品日が設定されている。
							//予定、未定、確定日の設定
							{
								order_item += date("Y\u5E74m\u6708d\u65E5", strtotime(value.deliverydate));
								order_item += "\u3000";

								switch (value.deliverydate_type) {
									case 1:
										order_item += "\u4E88\u5B9A";
										break;

									case 2:
										order_item += "\u51FA\u8377\u5B8C\u4E86";
										break;
								}
							}

						order_item += "\n";
					}
				}

				if (!!H_acce) {
					for (var key in H_acce) //確定日になったものは送らない
					//納品日の設定
					{
						var value = H_acce[key];
						deliverydate_type = H_view.deliverydate_type[value.detail_sort];

						if (deliverydate_type.type == 2) {
							if (deliverydate_type.update_send == false) continue;
							if (deliverydate_type.send_flg == 0) continue;
						}

						order_item += value.productname;

						if (is_null(value.deliverydate) || value.deliverydate_type == 0) //まだ納品日が設定されてないです。
							{
								order_item += " \u672A\u5B9A";
							} else //納品日が設定されている。
							//予定、未定、確定日の設定
							{
								order_item += "  ";
								order_item += date("Y\u5E74m\u6708d\u65E5", strtotime(value.deliverydate));
								order_item += "\u3000";

								switch (value.deliverydate_type) {
									case 1:
										order_item += "\u4E88\u5B9A";
										break;

									case 2:
										order_item += "\u51FA\u8377\u5B8C\u4E86";
										break;
								}
							}

						order_item += "\n";
					}
				}

				if (order_item == "") {
					return false;
				}

				var from = H_mail.mail;
				var from_name = H_mail.name;
				var subject = "[" + H_order.compname + "] \u53D7\u6CE8#" + H_order.orderid + "/" + H_order.carname + " \u7D0D\u54C1\u65E5\u306E\u304A\u77E5\u3089\u305B/KCS Motion";
				var O_group = new GroupModel(O_db0);
				var urlname = this.getReturnURL(this.O_Sess.groupid, "user", pacttype, O_group.getGroupName(this.O_Sess.groupid), H_order.order.pactid);
				var message = "\u672C\u30E1\u30FC\u30EB\u306F\u914D\u4FE1\u5C02\u7528\u3067\u3059\u3002\u3053\u306E\u30E1\u30FC\u30EB\u306B\u5BFE\u3057\u3066\u8FD4\u4FE1\u3057\u306A\u3044\u3088\u3046\u304A\u9858\u3044\u3057\u307E\u3059\u3002\n\n" + "<< KCS Motion : \u7D0D\u54C1\u65E5\u306E\u304A\u77E5\u3089\u305B >>\n" + "-------------------------------------------------------------\n" + "\u53D7\u6CE8#" + H_order.orderid + "\u306E\u7D0D\u54C1\u65E5\u3092\u304A\u77E5\u3089\u305B\u3057\u307E\u3059\u3002\n" + "-------------------------------------------------------------\n" + "\u4F1A\u793E : " + H_order.compname + "\n" + "\u767B\u9332\u90E8\u7F72 : " + H_order.postname + "\n" + "-------------------------------------------------------------\n" + H_order.carname + " " + H_order.ptnname + "\n" + "-------------------------------------------------------------\n" + "\n" + order_item + "\n" + "-------------------------------------------------------------\n" + "KCS Motion\u306E\u30B5\u30A4\u30C8\u306B\u30A2\u30AF\u30BB\u30B9\u3057\u3066\u3001\u8A73\u7D30\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\n" + "\n" + urlname + "\n" + "-------------------------------------------------------------\n";
				sql = "SELECT pact.compname, ord.postname, ord.chargername " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord INNER JOIN pact_tb pact ON ord.pactid=pact.pactid " + "WHERE orderid=" + orderid;
				var H_usedata = this.get_DB().queryRowHash(sql);
				var to = H_mail.usermail;
				var to_name = H_usedata.compname + " " + H_usedata.postname + " " + H_usedata.chargername + "\u69D8";
				O_mail.send(to, message, from, subject, from_name, to_name);
			}

		return true;
	}

	getRecvDeliveryMailRuleOptions(H_order) //オーダーIDの取得
	//メールと販売店からのメールを受取るかの情報を取得するよ
	{
		if (true == (undefined !== H_order.order.orderid)) {
			var orderid = H_order.order.orderid;
		} else if (true == (undefined !== H_order.orderid)) {
			orderid = H_order.orderid;
		} else {
			return false;
		}

		var res = this.get_DB().queryRowHash("SELECT use.mail,use.acceptmail5 " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord INNER JOIN user_tb use ON ord.applyuserid=use.userid " + "WHERE orderid=" + orderid);
		return res;
	}

	makeUpdateSQLCtrl(H_g_sess, H_sess, H_order) //新規なら電話管理に既存の情報がないか確認
	//付属品情報をくっつけ
	//変更できる受注情報から電話番号だけ取得
	//日付取得
	//SQL作成処理開始
	{
		var A_deletetel = [this.O_order.type_del, this.O_order.type_mnp];
		H_permit.unperm = this.O_order.A_empty;
		var ordertype = H_order.order.order.ordertype;

		if (this.O_order.type_new == ordertype) //電話番号の製品番号を謝意列で取得する
			//電話管理から既存の電話情報を取得
			{
				if (undefined == H_sess.SELF.telno) //$A_telno = $this->extractOrderColumn($H_order["order"]["machine"], "telno");
					{
						var A_telno = this.setOrderTelno(H_order.order);
						var A_serno = this.extractOrderColumn(H_order.order.machine, "serialno");
					} else //入力された番号の取得をする
					{
						A_telno = H_sess.SELF.telno;
						var A_selno = H_sess.SELF.serial;
					}

				var A_duptel = this.getTelInfomation(A_telno, H_order.order);

				if (true == this.checkEndSubStatus(H_sess.SELF.status, H_order.order.order.status, "proc")) //登録済みの電話はupdate対象から外す
					//電話番号が入力済みか確認
					//受注情報がマスターに存在するか確認 キャンセルの場合は必要ない
					{
						var H_permit = this.checkOrderDuplication(A_telno, H_order.order.machine, H_order.order.order.pacttype, H_permit, A_duptel);
						H_permit = this.checkInputTelno(H_sess.SELF, H_permit);

						if (this.O_order.st_cancel != H_sess.SELF.status) {
							H_permit = this.checkOrderInfoMasterData(H_order.order.order, H_permit);
						}
					} else //現在のステータスを取得
					//処理済み前の明細があれば電話番号の重複チェックをする
					{
						var A_status = this.extractOrderColumn(H_order.order.machine, "substatus");
						var checkflg = false;

						for (var val of Object.values(A_status)) {
							if (true == this.checkEndSubStatus(H_sess.SELF.status, val, "proc")) {
								checkflg = true;
							}
						}

						if (true == checkflg) {
							H_permit = this.checkOrderDuplication(A_telno, H_order.order.machine, H_order.order.order.pacttype, H_permit, A_duptel);
						} else {
							H_permit.permit = H_order.order.machine;
						}
					}
			} else if (this.O_order.type_chn == ordertype || this.O_order.type_shi == ordertype || this.O_order.type_mnp == ordertype || this.O_order.type_tpc == ordertype) {
			A_serno = H_sess.SELF.serial;
			A_telno = this.setOrderTelno(H_order.order);
			A_duptel = this.getTelInfomation(A_telno, H_order.order);
			var A_dupser = this.getAssetsInfomation(A_serno, H_order.order);
			H_permit = this.checkOrderNotDuplication(A_telno, H_order.order.machine, H_order.order.order.pacttype, H_permit, A_duptel);

			if ("230" != H_sess.SELF.status) {
				H_permit = this.checkStayPlanCont(H_order.order, H_permit);
			}

			H_permit = this.checkOrderInfoMasterData(H_order.order.order, H_permit);
		} else {
			H_permit.permit = H_order.order.machine;

			if (this.O_order.type_acc != H_order.order.order.ordertype) {
				if (this.O_order.st_cancel != H_sess.SELF.status) {
					H_permit = this.checkOrderInfoMasterData(H_order.order.order, H_permit);
				}
			}

			if (this.O_order.type_mis == H_order.order.order.ordertype) {
				{
					let _tmp_1 = H_permit.permit;

					for (var key in _tmp_1) //管理番号と製造番号を電話管理に入れるため
					{
						var val = _tmp_1[key];
						H_permit.permit[key].orderid = H_order.order.order.orderid;
						H_permit.permit[key].machineflg = true;
					}
				}
			}
		}

		if (this.O_order.type_acc != H_order.order.order.ordertype && 0 < H_order.order.acce.length) {
			H_permit.permit = array_merge(H_permit.permit, H_order.order.acce);
		} else if (this.O_order.type_acc == H_order.order.order.ordertype) {
			H_permit.permit = H_order.order.acce;
		}

		H_permit = this.checkOrderStatus(H_sess, H_permit, H_order.order.order);
		A_telno = this.extractOrderColumn(H_permit, "telno");
		var nowtime = MtDateUtil.getNow();
		var nowdate = this.O_order.today;
		var maxlp = H_permit.permit.length;
		var totalpt = +H_sess.SELF.paypoint;
		var shopoint2 = 0;

		if (0 < maxlp) //mt_order_sub_tbのordersubid=0に、mt_order_teldetail_tbのキャンセルではない日付を入れる
			//管理ログを記録
			{
				var idx = 0;
				{
					let _tmp_2 = H_permit.permit;

					for (var key in _tmp_2) //オーダー系
					{
						var val = _tmp_2[key];
						totalpt += val.shoppoint;
						totalpt += val.shoppoint2;
						shoppoint2 += val.shoppoint2;
						H_sess.SELF.shoppoint2 = shoppoint2;

						if (true != (undefined !== A_sql[val.orderid])) {
							A_sql[val.orderid] = this.makeOrderUpdateSQL(H_g_sess, H_sess, H_order.order, val, H_permit.unperm, ordertype, nowtime, idx, maxlp, totalpt);
						} else {
							A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.makeOrderUpdateSQL(H_g_sess, H_sess, H_order.order, val, H_permit.unperm, ordertype, nowtime, idx, maxlp, totalpt));
						}

						if (Array() != this.procReserveExtension) {
							A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.makeUpdateExtension(this.procReserveExtension));
						}

						if (220 <= H_sess.SELF.status) {
							A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.releaseExtensionNo(H_order.order.order, val));
						}

						if (true == val.machineflg) {
							if (true == this.checkEndSubStatus(H_sess.SELF.status, val.substatus, "proc")) //電話管理更新SQL作成
								//端末管理を更新SQL作成
								//mng_logを記録 解約は予約バッチが書き込むので処理しない
								{
									A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.makeTelUpdateSQL(H_g_sess, H_sess, val, H_order.order.order, nowtime));
									A_sql[val.orderid] = array_merge(A_sql[val.orderid], this.makeAssetsUpdateSQL(H_sess.SELF, val, H_order.order, H_order.assets, nowtime));

									if (this.O_order.type_del != ordertype) {
										A_sql[val.orderid].push(this.makeManagementLogSQL(H_g_sess, H_sess, H_order.order.order, val, nowtime, false));
									}
								}

							var teldateSql = this.makeTelManagementDateSQL(H_sess, H_order.order, val);

							if (Array.isArray(teldateSql)) {
								A_sql[val.orderid] = array_merge(A_sql[val.orderid], teldateSql);
							}

							A_sql[val.orderid].push(this.makeAssetsManagementDateSQL(H_sess, H_order.order, val));
						} else {
							if (this.O_order.type_acc == H_order.order.order.ordertype && true == this.checkEndSubStatus(H_sess.SELF.status, val.substatus, "proc")) //電話管理更新SQL作成
								{
									var orderInfo = H_order.order.order;
									var telInfo = this.getTelManageInfoAcc([this.getOrderTelno(H_order.order)], H_order.order);
									var temp_sql = "UPDATE tel_tb SET fixdate = " + this.get_DB().dbQuote(nowtime, "text", true) + " ";
									var sql = this.makeTelFjpSQL(H_order.order.order);

									if ("" != sql && !is_null(telInfo)) {
										var temp_where = " WHERE " + "telno='" + telInfo.telno + "' AND pactid=" + orderInfo.pactid + " AND carid=" + telInfo.carid;
										A_sql[val.orderid].push(temp_sql + sql + temp_where);
									}
								}
						}

						idx++;
					}
				}
				var orderid = this.get_DB().dbQuote(H_order.order.order.orderid, "integer", true);
				sql = "update mt_order_sub_tb" + " set deliverydate = (select deliverydate from mt_order_teldetail_tb where" + " orderid = " + orderid + " and substatus != 230" + " order by detail_sort limit 1 ) " + " where " + " orderid = " + orderid + " and ( select count(*) from mt_order_teldetail_tb where orderid = " + orderid + " and substatus != 230 ) > 0" + " and ordersubid = 0";
				A_sql[H_order.order.order.orderid].push(sql);
				var debagsql = this.makeOrderLogSQL(H_permit[0], H_order.order.order, A_sql, nowtime);
			}

		if (!Array.isArray(A_sql)) {
			var A_sql = Array();
		}

		H_result.err = H_permit.unperm;

		if (undefined != debagsql) {
			A_sql[H_order.order.order.orderid].push(debagsql);
		}

		if (this.O_order.type_acc == H_order.order.order.ordertype) {
			var A_dummydate = this.insertDummyDate(H_sess, H_order.order);
			A_sql[H_order.order.order.orderid].push(A_dummydate[0], A_dummydate[1]);
		}

		if (this.O_order.st_cancel == H_sess.SELF.status) {
			if (!Array.isArray(A_sql[H_order.order.order.orderid])) {
				A_sql[H_order.order.order.orderid] = Array();
			}

			A_sql[H_order.order.order.orderid].push(this.updateTransferCount(H_order.order));
		}

		H_result.sql = A_sql;
		return H_result;
	}

	checkTelnoRegist(pactid, carid, teldetail, telno) {
		var err = "";

		for (var key in teldetail) {
			var value = teldetail[key];
			if (!(undefined !== telno[value.detail_sort])) continue;
			var sql = "SELECT count(*) from tel_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "text", true) + " and telno=" + this.get_DB().dbQuote(value.telno, "text", true);
			var ret = this.get_DB().queryOne(sql);

			if (ret == 0) {
				if (!!err) err += ",";
				err += value.telno;
			}
		}

		var result = Array();
		result.err = err;

		if (!err) {
			result.result = true;
		} else {
			result.result = false;
			result.err += "\u306E\u756A\u53F7\u304C\u96FB\u8A71\u7BA1\u7406\u306B\u3042\u308A\u307E\u305B\u3093\u3002\u6539\u756A\u306E\u53D6\u6D88\u3057\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002";
		}

		return result;
	}

	checkTelnoNotRegist(pactid, carid, teldetail, telno) {
		var err = "";

		for (var key in teldetail) {
			var value = teldetail[key];
			if (!(undefined !== telno[value.detail_sort])) continue;
			var sql = "SELECT count(*) from tel_tb" + " where" + " pactid=" + this.get_DB().dbQuote(pactid, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "text", true) + " and telno=" + this.get_DB().dbQuote(value.kaiban_telno, "text", true);
			var ret = this.get_DB().queryOne(sql);

			if (ret > 0) {
				if (!!err) err += ",";
				err += value.telno;
			}
		}

		var result = Array();
		result.err = err;

		if (!err) {
			result.result = true;
		} else {
			result.result = false;
			result.err += "\u306E\u756A\u53F7\u304C\u65E2\u306B\u96FB\u8A71\u7BA1\u7406\u306B\u5B58\u5728\u3057\u307E\u3059\u3002\u5225\u306E\u756A\u53F7\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
		}

		return result;
	}

	makeUpdateSQLCtrl_kaibanSave(orderid, teldetail) {
		var A_sql = Array();

		for (var key in teldetail) {
			var value = teldetail[key];
			var sql = "UPDATE mt_order_teldetail_tb" + " set" + " kaiban_telno=" + this.get_DB().dbQuote(value.kaiban_telno, "text", false) + ",kaiban_telno_view=" + this.get_DB().dbQuote(value.kaiban_telno_view, "text", false) + "where " + "orderid=" + orderid + " and detail_sort=" + value.detail_sort;
			A_sql.push(sql);
		}

		var result = {
			err: err,
			sql: {
				[orderid]: A_sql
			}
		};
		return result;
	}

	makeManagementLogSQL(H_g_sess, H_sess, H_order, H_permit, nowtime, resflg = false) {
		if (!this.getRegistType() || this.O_order.type_mis == H_order.ordertype || this.O_order.type_tpc == H_order.ordertype) {
			return "";
		}

		var O_mutil = new ManagementUtil();
		var O_manage = new ManagementModelBase(O_db0, H_g_sess, O_mutil);
		var A_msg = this.makeManagementLogMessage(H_order.ordertype, H_order.postid, resflg);
		var A_eng = this.makeManagementLogEngMessage(H_order.ordertype, H_order.postid, resflg);
		var telno = H_permit.telno;

		if (undefined == telno) {
			telno = H_sess.SELF.telno[H_permit.detail_sort];
		}

		var A_col = [1, H_order.pactid, H_order.postid, 0, "\u30B7\u30B9\u30C6\u30E0", telno, this.makeTelnoView(telno), H_order.carid, A_msg.message, A_eng.message, H_order.postid, undefined, A_msg.postname, undefined, 0, A_msg.type, nowtime];
		return O_manage.makeInsertLogSQL(A_col);
	}

	makeManagementLogMessage(ordertype, postid, resflg) {
		var sql = "SELECT postname FROM post_tb WHERE postid=" + postid;

		switch (ordertype) {
			case this.O_order.type_new:
			case this.O_order.type_mnp:
				var A_msg = {
					message: "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u96FB\u8A71\u65B0\u898F\u767B\u9332",
					postname: this.get_DB().queryOne(sql),
					type: "\u65B0\u898F"
				};
				break;

			case this.O_order.type_shi:
			case this.O_order.type_chn:
				A_msg = {
					message: "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u96FB\u8A71\u5909\u66F4(\u8CB7\u3044\u5897\u3057\uFF0F\u6A5F\u7A2E\u5909\u66F4)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_mnp:
				A_msg = {
					message: "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u96FB\u8A71\u5909\u66F4(MNP)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_pln:
			case this.O_order.type_opt:
			case this.O_order.type_dsc:
			case this.O_order.type_blp:
				A_msg = {
					message: "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u96FB\u8A71\u5909\u66F4(\u30D7\u30E9\u30F3/\u30AA\u30D7\u30B7\u30E7\u30F3/\u5272\u5F15\u30B5\u30FC\u30D3\u30B9)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_tcc:
			case this.O_order.type_tpc:
			case this.O_order.type_tcp:
				A_msg = {
					message: "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u96FB\u8A71\u5909\u66F4(\u540D\u7FA9)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_del:
				if (true == resflg) {
					A_msg = {
						message: "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u96FB\u8A71\u7BA1\u7406\u4E88\u7D04\u524A\u9664",
						postname: this.get_DB().queryOne(sql),
						type: "\u5909\u66F4"
					};
				} else {
					A_msg = {
						message: "\u30B7\u30B9\u30C6\u30E0\u306B\u3088\u308B\u96FB\u8A71\u7BA1\u7406\u524A\u9664",
						postname: this.get_DB().queryOne(sql),
						type: "\u5909\u66F4"
					};
				}

				break;
		}

		return A_msg;
	}

	makeManagementLogEngMessage(ordertype, postid, resflg) {
		var sql = "SELECT postname FROM post_tb WHERE postid=" + postid;

		switch (ordertype) {
			case this.O_order.type_new:
			case this.O_order.type_mnp:
				var A_msg = {
					message: "New phone registration by system",
					postname: this.get_DB().queryOne(sql),
					type: "\u65B0\u898F"
				};
				break;

			case this.O_order.type_shi:
			case this.O_order.type_chn:
				A_msg = {
					message: "Phone change by system(additional handset purchase / model change)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_mnp:
				A_msg = {
					message: "Phone change bye system(MNP)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_pln:
			case this.O_order.type_opt:
			case this.O_order.type_dsc:
			case this.O_order.type_blp:
				A_msg = {
					message: "Phone change by system(plan / option / discount service)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_tcc:
			case this.O_order.type_tpc:
			case this.O_order.type_tcp:
				A_msg = {
					message: "Phone change by system(subscriber name)",
					postname: this.get_DB().queryOne(sql),
					type: "\u5909\u66F4"
				};
				break;

			case this.O_order.type_del:
				if (true == resflg) {
					A_msg = {
						message: "Deletion by system",
						postname: this.get_DB().queryOne(sql),
						type: "\u5909\u66F4"
					};
				} else {
					A_msg = {
						message: "Phone deletion by system",
						postname: this.get_DB().queryOne(sql),
						type: "\u5909\u66F4"
					};
				}

				break;
		}

		return A_msg;
	}

	makeTelUpdateSQL(H_g_sess, H_sess, H_permit, H_order, nowtime) //共通where句
	{
		var A_sql = this.O_order.A_empty;
		var where = "WHERE " + "telno='" + H_permit.telno + "' AND pactid=" + H_order.pactid + " AND carid=" + H_order.carid;
		var sql = "SELECT telno_view, carid, cirid, planid, packetid, options, discounts, buyselid FROM tel_tb " + where;
		var H_tel = this.get_DB().queryRowHash(sql);

		if (undefined == H_tel.discounts) {
			H_tel.discounts = serialize(this.O_order.A_empty);
		}

		if ((this.O_order.type_del == H_order.ordertype || this.O_order.type_tcp == H_order.ordertype || this.O_order.type_mnp == H_order.ordertype) && true == H_permit.machineflg) //削除するキャリアを指定　MNPは以前のキャリアから削除
			//caridがとれなければ削除しない(Hotlineの場合ありえる)
			{
				if (this.O_order.type_mnp != H_order.ordertype) {
					var carid = H_order.carid;
				} else {
					carid = H_permit.formercarid;
				}

				if (undefined != carid) //端末削除の判定
					{
						var delflg = 1;

						if (false == H_order.terminal_del) //0で端末は削除しない
							{
								delflg = 0;
							}

						if (this.getRegistType()) //解約でも削除しない会社であればsqlを登録しない
							{
								if (true == this.checkDeleteTelPact(H_order)) //処理日を削除予約日にする (2013-08-13)
									{
										var execdate = this.getExecDate(H_order, H_permit, nowtime);

										if (undefined !== H_sess.SELF.expectdate) {
											var expectdate = H_sess.SELF.expectdate.Y + "-" + H_sess.SELF.expectdate.m + "-" + H_sess.SELF.expectdate.d;
											var expecttime = strtotime(expectdate);
											var exectime = strtotime(execdate);

											if (expecttime > exectime) {
												execdate = expectdate;
											}
										}

										var H_user = this.getExecReserveUserID(H_order, H_permit);

										if (0 == this.getReserveDuplication(H_order, H_permit, carid, 3, execdate)) {
											sql = "INSERT INTO tel_reserve_tb " + "(pactid, postid, telno, telno_view, carid, add_edit_flg, reserve_date, " + "exe_postid, exe_userid, exe_name, order_flg, delete_type, recdate, fixdate, division) " + "VALUES(" + this.get_DB().dbQuote(H_order.pactid, "int", true) + ", " + this.get_DB().dbQuote(H_order.postid, "int", true) + ", " + this.get_DB().dbQuote(H_permit.telno, "text", true) + ", " + this.get_DB().dbQuote(H_permit.telno_view, "text", true) + ", " + this.get_DB().dbQuote(carid, "int", true) + ", " + this.get_DB().dbQuote(3, "int", true) + ", " + this.get_DB().dbQuote(execdate, "date", true) + ", " + this.get_DB().dbQuote(H_order.pactid, "int", true) + ", " + this.get_DB().dbQuote(H_user.userid, "int", true) + ", " + this.get_DB().dbQuote(H_user.username, "text", true) + ", " + this.get_DB().dbQuote(true, "boolean", true) + ", " + this.get_DB().dbQuote(delflg, "int", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(H_order.division, "int") + ")";
											A_sql.push(sql);

											if (true == H_sess.SELF.phone_management_leave && H_order.fee == "\u5206\u5272\u652F\u6255") //コメントに追記する(k89で追加　20200129 hanashima)
												{
													var history = "INSERT INTO mt_order_history_tb " + "(orderid, chdate, shopid, shopname, shopperson, shopcomment, status,is_shop_comment) " + "VALUES (" + this.get_DB().dbQuote(H_permit.orderid, "int", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(H_g_sess.shopid, "int", false) + ", " + this.get_DB().dbQuote(H_g_sess.shopname, "text", false) + ", " + this.get_DB().dbQuote(H_g_sess.personname, "text", false) + ", " + this.get_DB().dbQuote("\u5272\u8CE6\u6B8B\u91D1\u304C\u3042\u308B\u5834\u5408\u306E\u6E05\u7B97\u65B9\u6CD5\u3092\u5206\u5272\u652F\u6255\u3068\u3057\u3066\u51E6\u7406", "text", false) + ", " + this.get_DB().dbQuote(H_sess.SELF.status, "int", true) + "," + "true" + ")";
												}

											A_sql.push(history);
										}

										if (0 < this.getReserveEndTarget(H_order, H_permit, carid, execdate)) //管理予約を削除することをmng_logに書いておく
											{
												var res_del_sql = "DELETE FROM tel_reserve_tb " + "WHERE " + "exe_state=0" + " AND pactid=" + H_order.pactid + " AND carid=" + carid + " AND telno='" + H_permit.telno + "'" + " AND reserve_date >'" + execdate + "'";
												var mnglogsql = this.makeManagementLogSQL(H_g_sess, H_sess, H_order, H_permit, nowtime, true);
												A_sql.push(res_del_sql, mnglogsql);
											}
									}
							}
					}
			}

		var reservemode = false;
		var A_reservetype = [this.O_order.type_pln, this.O_order.type_opt, this.O_order.type_dsc, this.O_order.type_blp];

		if (true == (-1 !== A_reservetype.indexOf(H_order.ordertype))) //翌月予約、希望変更日が未来なら電話管理の予約に登録
			{
				if ("reserve" == H_order.dateradio || false == this.checkPastDate(H_order.dateto)) {
					reservemode = true;
					A_sql.push(this.makeReservePlanSql(H_order, H_permit, this.getReserveTelInfo(H_order, H_permit.telno)));
				}
			}

		sql = "";

		if (true == (-1 !== this.O_order.A_contractchng.indexOf(H_order.ordertype))) //予約処理済みは処理しない
			{
				if (!reservemode) {
					if (this.getRegistType()) {
						if (false == (undefined !== H_permit.dbmode) || undefined == H_permit.dbmode || "update" == H_permit.dbmode) //. ", ".
							//次の電話詳細情報追加でsqlConnectの誤判定を防ぐ為に1クッション置いてる
							{
								sql = "UPDATE tel_tb " + "SET ";
								var tmpsql = this.makeTelUpdatePhrase(H_sess, H_tel, H_permit, H_order);
								sql += tmpsql;

								if (this.O_order.type_new == H_order.ordertype || this.O_order.type_mnp == H_order.ordertype || this.O_order.type_chn == H_order.ordertype || this.O_order.type_shi == H_order.ordertype) {
									sql += this.sqlConnect(tmpsql, ", ") + this.makeTelDetailInfo(H_sess, H_permit, "update") + " ";
								}

								sql += " " + where;
							} else if (this.O_order.type_chn == H_order.ordertype) //20110720
							{
								sql = this.makeInsertTelManagement(H_sess.SELF, H_order, H_permit, H_permit.telno);
								var pastsql = this.registrationPast(H_sess.SELF, H_order, H_permit, sql);
							}
					}
				}
			} else if (this.O_order.type_blp == H_order.ordertype) {
			if (this.getRegistType()) //SET句作成
				{
					if (!reservemode) {
						var setwords = this.makeBulkPlanUpdatePhrase(H_tel, H_permit, H_order);
					}

					if ("" != setwords) {
						sql = "UPDATE tel_tb " + "SET " + setwords + " " + where;
					}
				}
		} else if (true == (-1 !== this.O_order.A_teladd.indexOf(H_order.ordertype))) {
			if (this.O_order.type_tpc != H_order.ordertype) {
				if (this.O_order.st_sub_prcfin <= +H_sess.SELF.status && this.O_order.st_cancel != +H_sess.SELF.status) //20110720
					{
						sql = this.callInsertProc(H_sess, H_order, H_permit);
						pastsql = this.registrationPast(H_sess.SELF, H_order, H_permit, sql);
					}
			}
		} else if (this.O_order.type_mis == H_order.ordertype) //受注テーブルから取得
			//sessionを優先させる
			//$prosql = $this->makeTelPropertySQL($H_sess["SELF"], $H_permit);
			//--追加管理項目の更新修正 20190405 伊達------------------------------------------------------------------
			//mt_order_tel_details取得
			//property取得
			//h_sessのpropertyに、販売店で修正不可なカラムを追加する
			//prosqlが空でなければSQLに追記する
			{
				var serial = this.getSimcardNo(H_sess, H_permit, "serialno");

				if (undefined !== H_sess.serial) {
					serial = this.getSimcardNo(H_sess, H_permit, "serial");
				}

				var simno = this.getSimcardNo(H_sess.SELF, H_permit, "simno");

				if (undefined === simno) {
					simno = this.getSimcardNo(H_sess.SELF, H_permit, "simcardno");
				}

				sql = "UPDATE tel_tb " + "SET " + "simcardno=" + this.get_DB().dbQuote(simno, "text", false);
				var details = this.getTelDetails(H_order.orderid, H_permit.detail_sort);
				var propertys = this.getManagementPropertys(H_order.pactid);
				var temp = H_sess.SELF;

				if (!!propertys) //並び順取得
					//管理追加項目がないor管理項目が全て販売店修正不可の場合は、この配列が存在しないので初期化しておく
					{
						var detail_sort = H_permit.detail_sort;

						if (!(undefined !== temp.telproperty[detail_sort])) {
							temp.telproperty[detail_sort] = Array();
						}

						for (var col in propertys) //販売店で修正可能な項目は飛ばす(既に値があるので)
						{
							var value = propertys[col];

							if (value.ordviewflg) {
								continue;
							}

							if (details !== false) {
								if (preg_match("/date[0-9]/", value.col)) {
									temp.telproperty[detail_sort][col] = this.getDate_StringToArray(details[col]);
								} else {
									temp.telproperty[detail_sort][col] = details[col];
								}
							}
						}
					}

				var prosql = this.makeTelPropertySQL(temp, H_permit);

				if ("" != prosql) //空ではないとき
					{
						sql += ", " + prosql;
					}

				if (details !== false) //電話使用者
					//電話社員番号
					//メール、メモについては注文時は入力できるが、注文履歴での表示、受注内容変更で編集できなくなっている・・
					//mt_order_teldetail_tb
					//公私分計、メール、メモについては注文時は入力できるが、mt_order_tel_details
					//$sql .= ",".$db->dbQuote($details["kousiradio"],"text" );
					//$sql .= ",".$db->dbQuote($details["kousi"],"integer" );
					{
						var db = this.get_DB();
						sql += ",username=" + db.dbQuote(details.telusername, "text");
						sql += ",employeecode=" + db.dbQuote(details.employeecode, "text");
						sql += ",mail=" + db.dbQuote(details.mail, "text");
						sql += ",memo=" + db.dbQuote(details.memo, "text");
					}

				sql += this.makeTelFjpSQL(H_order) + " ";
				sql += " " + where;
				A_sql.push(sql);
				var asid = this.getAssetsID(H_permit.telno, H_order.carid, H_order.pactid);

				if (undefined != asid) {
					sql = "UPDATE assets_tb " + "SET " + "serialno=" + this.get_DB().dbQuote(serial, "text", false) + " " + "WHERE " + "assetsid=" + this.get_DB().dbQuote(asid, "int", true);
					A_sql.push(sql);
				}

				sql = "";
			} else {
			if (this.getRegistType()) {
				if (true == (undefined !== H_sess.SELF.telproperty)) {
					var prop = this.makeTelPropertySQL(H_sess.SELF, H_permit);

					if (!!prop) {
						sql = "UPDATE tel_tb SET " + (sql += prop + " " + where);
					}
				}
			}
		}

		A_sql.push(sql);

		if ("string" === typeof pastsql) {
			A_sql.push(pastsql);
		}

		return A_sql;
	}

	makeTelManagementDateSQL(H_sess, H_order, H_permit) {
		var telTableFlag = true;

		if (this.getRegistType()) //電話番号がsessionになければDBのものを使う
			//telnoがなければupdateできない
			//追加
			{
				if (true == (undefined !== H_sess.SELF.telno[H_permit.detail_sort])) {
					var telno = H_sess.SELF.telno[H_permit.detail_sort];
				} else {
					telno = H_permit.telno;
				}

				if ("" == telno.replace(/-/g, "")) {
					telTableFlag = false;
				}

				if (this.O_order.type_mnp == H_order.order.ordertype && this.O_order.st_sub_prcfin > H_permit.substatus) {
					var carid = H_permit.formercarid;
				} else {
					carid = H_order.order.carid;
				}

				var sql = "SELECT " + "telno " + "FROM " + "tel_tb ";
				var footer = "WHERE " + "pactid=" + H_order.order.pactid + " AND carid=" + carid + " AND telno='" + telno + "'";

				if (undefined == this.get_DB().queryOne(sql)) {
					return "";
				}

				var header = "UPDATE tel_tb SET ";
				var orderheader = "UPDATE mt_order_teldetail_tb SET ";
				sql = ordersql = "";

				if ("1" == H_sess.SELF.contractup || true !== H_permit.registflg) {
					if ("" != H_sess.SELF.contractdate.Y && "" != H_sess.SELF.contractdate.m && "" != H_sess.SELF.contractdate.d) {
						if (telTableFlag) {
							sql += "contractdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.contractdate, false), "date", "false") + " ";
						}

						ordersql += "contractdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.contractdate, false), "date", "false") + ", " + "telcontractdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.contractdate, false), "date", "false") + " ";
					}
				}

				if ("1" == H_sess.SELF.registup || true !== H_permit.registflg) {
					if ("" != H_sess.SELF.registdate.Y && "" != H_sess.SELF.registdate.m && "" != H_sess.SELF.registdate.d) {
						if (telTableFlag) {
							sql += this.sqlConnect(sql, ", ") + "orderdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.registdate, false), "date", "false") + " ";
						}

						ordersql += this.sqlConnect(ordersql, ", ") + "registdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.registdate, false), "date", "false") + ", " + "telorderdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.registdate, false), "date", "false") + " ";
					}
				}

				if ("" != sql) {
					sql = header + sql + footer;
				}

				if (!!ordersql) {
					ordersql = orderheader + ordersql + " WHERE orderid=" + this.getDB().dbQuote(H_permit.orderid, "int", true) + " AND detail_sort=" + this.getDB().dbQuote(H_permit.detail_sort, "int", true);
				}
			}

		return [sql, ordersql];
	}

	makeAssetsManagementDateSQL(H_sess, H_order, H_permit) //電話番号がsessionになければDBのものを使う
	//telnoがなければupdateできない
	//更新指定がされていればupdate
	{
		if (true == (undefined !== H_sess.SELF.telno[H_permit.detail_sort])) {
			var telno = H_sess.SELF.telno[H_permit.detail_sort];
		} else {
			telno = H_permit.telno;
		}

		if ("" == telno.replace(/-/g, "")) {
			return "";
		}

		if (this.O_order.type_mnp == H_order.order.ordertype && this.O_order.st_sub_prcfin > H_permit.substatus) {
			var carid = H_permit.formercarid;
		} else {
			carid = H_order.order.carid;
		}

		var sql = "SELECT " + "assetsid " + "FROM " + "tel_rel_assets_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND main_flg=" + this.get_DB().dbQuote(true, "bool", true) + " AND telno=" + this.get_DB().dbQuote(telno, "text", true);
		var asid = this.get_DB().queryOne(sql);

		if (undefined == asid) {
			return "";
		}

		var header = "UPDATE " + "assets_tb " + "SET ";
		sql = "";

		if ("1" == H_sess.SELF.registup && true == (undefined !== H_sess.SELF.registdate) && true == (undefined !== H_sess.SELF.allproc)) {
			if ("" != H_sess.SELF.registdate.Y && "" != H_sess.SELF.registdate.m && "" != H_sess.SELF.registdate.d) {
				sql += this.sqlConnect(sql, ", ") + "bought_date=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.registdate, false), "date", "false") + " ";
			}
		}

		if ("" != sql) {
			sql = header + sql + "WHERE assetsid=" + this.get_DB().dbQuote(asid, "int", true);
		}

		return sql;
	}

	callInsertProc(H_sess, H_order, H_permit) {
		if (H_order.ordertype != this.O_order.type_new && H_order.ordertype != this.O_order.type_tpc) //新規、名義変更ではないときは元々の番号を使う
			{
				var instelno = H_permit.telno;
			} else if (undefined == H_sess.SELF.telno[H_permit.detail_sort]) {
			instelno = H_permit.telno;
		} else {
			instelno = H_sess.SELF.telno[H_permit.detail_sort];
		}

		return this.makeInsertTelManagement(H_sess.SELF, H_order, H_permit, instelno);
	}

	getExecReserveUserID(H_order, H_permit) {
		var H_result = {
			userid: H_permit.userid,
			username: H_permit.username
		};

		if (undefined == H_permit.userid || undefined == H_permit.username) {
			var sql = "SELECT " + "userid, username " + "FROM " + "user_tb " + "WHERE " + "type='SU' " + "AND pactid=" + H_order.pactid;
			H_result = this.get_DB().queryRowHash(sql);
		}

		return H_result;
	}

	makeAssetsUpdateSQL(H_sess, H_permit, H_order, auth, nowtime) //処理済み前なら端末管理に影響しない
	//=====================================================
	//main_flgは書き換え
	//=====================================================
	{
		if (true == (undefined !== H_sess.status) && this.O_order.st_sub_prcfin > +H_sess.status) {
			return false;
		} else if (true == (undefined !== H_sess.lumpstatus) && this.O_order.st_prcfin > +H_sess.lumpstatus) {
			return false;
		}

		var A_sql = this.O_order.A_empty;
		var seqsql = "SELECT nextval('assets_parent_tb_assetsid_seq')";

		if (undefined != H_sess.telno[H_permit.detail_sort]) {
			var telno = this.O_order.convertNoView(H_sess.telno[H_permit.detail_sort]);
		} else if (undefined != H_sess.dbget.order.machine[H_permit.detail_sort.telno]) {
			telno = this.O_order.convertNoView(H_sess.dbget.order.machine[H_permit.detail_sort.telno]);
		} else {
			telno = this.O_order.convertNoView(H_permit.telno);
		}

		if (this.getRegistType()) {
			var A_mainflg = [this.O_order.type_chn, this.O_order.type_mnp, this.O_order.type_shi];

			if (true == (-1 !== A_mainflg.indexOf(H_order.order.ordertype))) {
				var sql = "UPDATE tel_rel_assets_tb " + "SET " + "main_flg=false " + "WHERE " + "pactid=" + H_order.order.pactid + " AND carid=" + H_order.order.carid + " AND main_flg=true" + " AND telno='" + telno + "'";
				A_sql.push(sql);
			}
		}

		if (true == (-1 !== this.O_order.A_machineadd.indexOf(H_order.order.ordertype))) {
			if (this.O_order.type_tpc != H_order.order.ordertype) //日付データを補完
				//DB格納前に完了まで言った時の為の対応だよ
				//sessionを優先させる
				//名義変更はbuyselid持ってない
				{
					var seqid = this.get_DB().queryOne(seqsql);
					var H_date = this.makeInsertDateData(H_permit, H_sess, nowtime);
					var saleprice = this.getSimcardNo(H_sess, H_permit, "saleprice");

					if (undefined === saleprice) {
						saleprice = this.getSimcardNo(H_sess, H_permit, "price");
					}

					var serial = this.getSimcardNo(H_sess, H_permit, "serialno");

					if (undefined !== H_sess.serial) {
						serial = this.getSimcardNo(H_sess, H_permit, "serial");
					}

					var accname = this.extractOrderColumn(H_order.acce, "productname").join("\r\n");

					if (this.O_order.type_tpc != H_order.order.ordertype) {
						var loanflg = this.checkLoanBuyType(H_order.order.buyselid);
					}

					if (this.O_order.buy_not_loan == loanflg) {
						var payfreq = undefined;
						var startdate = undefined;
						var pay_monthly_sum = undefined;
					} else //割賦回数が1回なら開始月は入れない
						{
							payfreq = H_sess.pay_frequency;

							if (1 < payfreq) {
								startdate = this.getStartDate(H_sess, H_permit, "pay_startdate");

								if (false == startdate) {
									startdate = nowtime;
								}
							} else {
								var stardate = undefined;
							}

							pay_monthly_sum = H_sess.pay_monthly_sum;
						}

					if (this.getRegistType()) //同じ管理番号で削除フラグが経っていれば消し
						//S185受領日取得 20150121 date
						//関連付けも増やす
						{
							var chksql = "SELECT assetsid FROM assets_tb " + "WHERE assetsno='" + serial + "' AND pactid=" + H_order.order.pactid + " AND delete_flg=true AND assetstypeid=1";
							var delid = this.get_DB().queryOne(chksql);

							if (undefined != delid) {
								sql = "DELETE FROM tel_rel_assets_tb WHERE assetsid=" + delid;
								A_sql.push(sql);
								sql = "DELETE FROM assets_tb WHERE assetsid=" + delid;
								A_sql.push(sql);
							}

							if (H_order.order.terminal_del) //$sql = "SELECT COUNT(*) FROM fnc_relation_tb WHERE pactid=".$H_order["order"]["pactid"]." AND fncid=".self::FNC_ASSETS;
								//if (0 < $this->get_DB()->queryOne($sql)) {
								//}
								{
									for (var tel of Object.values(H_order.machine)) {
										if (undefined !== H_sess.pagename && "sub" == H_sess.pagename) {
											if (!(undefined !== H_sess.uptarget[tel.detail_sort])) {
												continue;
											}
										}

										if (120 <= tel.substatus) {
											continue;
										}

										sql = "SELECT assetsid FROM tel_rel_assets_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + " AND telno=" + this.get_DB().dbQuote(tel.telno, "text", true) + " AND carid=" + this.get_DB().dbQuote(H_order.order.carid, "int", true);
										var delids = this.get_DB().queryCol(sql);

										if (0 < delids.length) {
											var asql = "DELETE FROM assets_tb WHERE assetsid in (" + ", ".join(delids) + ")";
											var rsql = "DELETE FROM tel_rel_assets_tb WHERE assetsid in (" + ", ".join(delids) + ")";
											A_sql.push(rsql, asql);
										}
									}
								}

							var series = undefined;
							var smpcirid = undefined;

							if (is_numeric(H_permit.productid)) {
								var sptsql = "SELECT smart_type FROM product_tb WHERE productid=" + this.get_DB().dbQuote(H_permit.productid, "int", false);
								smpcirid = this.get_DB().queryOne(sptsql);
								sptsql = "SELECT smpcirid FROM smart_circuit_tb WHERE smpcirname=" + this.get_DB().dbQuote(smpcirid, "text", false);
								smpcirid = this.get_DB().queryOne(sptsql);
							} else {
								smpcirid = H_sess.smarttypehidden;

								if (!smpcirid) {
									smpcirid = H_order.order.smartphonetype;
								}
							}

							if (true == (undefined !== H_sess.expectdate)) {
								var expectdate = this.makeDateString(H_sess.expectdate);
							} else if (H_permit.expectdate) {
								expectdate = H_permit.expectdate.substr(0, 10);
							} else {
								expectdate = nowtime.substr(0, 10);
							}

							var receiptdate = H_order.machine[H_permit.detail_sort].receiptdate;
							sql = "INSERT INTO assets_tb " + "(assetsid, pactid, postid, assetsno, assetstypeid, serialno, productid, seriesname, productname, accessory, " + "branchid, property, search_carid, search_cirid, bought_date, bought_price, pay_startdate, pay_frequency, pay_monthly_sum, smpcirid, " + "delete_flg, dummy_flg, fixdate, recdate,receiptdate) " + "VALUES (" + this.get_DB().dbQuote(seqid, "int", true) + ", " + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + ", " + this.get_DB().dbQuote(this.getPostID(), "int", true) + ", " + this.get_DB().dbQuote(serial, "text", false) + ", " + this.get_DB().dbQuote(1, "int", true) + ", " + this.get_DB().dbQuote(serial, "text", false) + ", " + this.get_DB().dbQuote(H_permit.productid, "int", false) + ", " + this.get_DB().dbQuote(series, "text", false) + ", " + this.get_DB().dbQuote(H_permit.productname, "text", false) + ", " + this.get_DB().dbQuote(accname, "text", false) + ", " + this.get_DB().dbQuote(H_permit.branchid, "int", false) + ", " + this.get_DB().dbQuote(H_permit.property, "text", false) + ", " + this.get_DB().dbQuote(H_order.order.carid, "int", false) + ", " + this.get_DB().dbQuote(H_order.order.cirid, "int", false) + ", " + this.get_DB().dbQuote(expectdate, "date", true) + ", " + this.get_DB().dbQuote(saleprice, "int", false) + ", " + this.get_DB().dbQuote(startdate, "date", false) + ", " + this.get_DB().dbQuote(payfreq, "int", false) + ", " + this.get_DB().dbQuote(pay_monthly_sum, "int", false) + ", " + this.get_DB().dbQuote(smpcirid, "int", false) + ", " + this.get_DB().dbQuote(false, "boolean", true) + ", " + this.get_DB().dbQuote(false, "boolean", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(receiptdate, "date", false) + ")";
							A_sql.push(sql);
							sql = "INSERT INTO tel_rel_assets_tb " + "(pactid, telno, carid, assetsid, main_flg) " + "VALUES (" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + ", " + this.get_DB().dbQuote(telno, "text", true) + ", " + this.get_DB().dbQuote(H_order.order.carid, "int", true) + ", " + this.get_DB().dbQuote(seqid, "int", true) + ", " + this.get_DB().dbQuote(true, "boolean", true) + ")";
							A_sql.push(sql);
						}
				}
		}

		return A_sql;
	}

	makeTelDetailInfo(H_sess, H_permit, mode = "insert") //更新できる受注の電話詳細情報を取得
	//DBから取得した物より画面入力を優先
	{
		var sql = "SELECT " + "det.text1, det.text2, det.text3, det.text4, det.text5, det.text6, det.text7, det.text8, det.text9, " + "det.text10, det.text11, det.text12, det.text13, det.text14, det.text15, det.int1, det.int2, det.int3, " + "det.int4, det.int5, det.int6, det.date1, det.date2, det.date3, det.date4, det.date5, det.date6, " + "det.mail, det.mail1, det.mail2, det.mail3, det.url1, det.url2, det.url3, det.memo, det.employeecode, " + "det.select1, det.select2, det.select3, det.select4, det.select5, " + "det.select6, det.select7, det.select8, det.select9, det.select10, " + "det.telusername as username, det.kousiradio as kousiflg, det.kousi as kousiptn " + "FROM " + ShopOrderDetailModel.ORD_DET_TB + " det " + "WHERE " + "det.orderid=" + H_permit.orderid + " AND det.telno='" + H_permit.telno + "'";
		var H_detail = this.get_DB().queryRowHash(sql);
		this.makeTelPropertyInfo(H_sess.SELF, H_permit, H_detail);

		if ("update" == mode) //SET句を作る
			{
				sql = "";

				for (var key in H_detail) //数値
				{
					var val = H_detail[key];

					if (preg_match("/int[0-9]/", key) || "kousiptn" == key) {
						sql += this.sqlConnect(sql, ", ") + key + "=" + this.get_DB().dbQuote(val, "int", false);
					} else if (true == preg_match("/date[0-9]/", key)) {
						sql += this.sqlConnect(sql, ", ") + key + "=" + this.get_DB().dbQuote(val, "date", false);
					} else if ("kousiflg" == key) {
						if ("on" == val) {
							var flg = 0;
						} else if ("off" == val) {
							flg = 1;
						} else {
							flg = undefined;
						}

						sql += this.sqlConnect(sql, ", ") + key + "=" + this.get_DB().dbQuote(flg, "text", false);
					} else {
						sql += this.sqlConnect(sql, ", ") + key + "=" + this.get_DB().dbQuote(val, "text", false);
					}
				}
			} else if ("insert" == mode) {}

		return sql;
	}

	checkPastDate(past, future = "") {
		if ("" == future) {
			var H_nowday = this.makeDateHash(MtDateUtil.getToday());
			var futuretime = mktime(0, 0, 0, H_nowday.m, H_nowday.d, H_nowday.y);
		} else {
			var H_future = this.makeDateHash(future);

			if (false == H_future.y || false == H_future.m || H_future.d) {
				return "error";
			}

			futuretime = mktime(0, 0, 0, H_future.m, H_future.d, H_future.y);
		}

		var H_past = this.makeDateHash(past);

		if (false == H_past.y || false == H_past.m || false == H_past.d) {
			return "error";
		}

		var pasttime = mktime(0, 0, 0, H_past.m, H_past.d, H_past.y);

		if (pasttime <= futuretime) {
			return true;
		} else {
			return false;
		}
	}

	makeTelUpdatePhrase(H_sess, H_tel, H_permit, H_order) //プランがかわるならオーダー情報をそのままtel_tbに反映
	{
		var sql = "";

		if ("change" == H_permit.planradio) {
			sql += "planid=" + this.sqlConnect(sql, ", ") + this.get_DB().dbQuote(H_permit.plan, "int", true);
		} else if ("stay" == H_permit.planradio) //キャリアがdocomoなら引継可能か判別する
			{
				if (this.O_Set.car_docomo == H_order.carid) //購入方式が変わったor mova<-->FOMA移行なら引継planをコンバート
					{
						if (H_order.buyselid != H_tel.buyselid && (this.O_order.type_shi == H_order.ordertype || this.O_order.type_chn == H_order.ordertype)) {
							sql += "planid=" + this.sqlConnect(sql, ", ") + this.get_DB().dbQuote(this.convDocomoPlan(H_tel.planid, H_order.buyselid), "int", false);
						} else {
							sql += "planid=" + this.sqlConnect(sql, ", ") + this.get_DB().dbQuote(H_tel.planid, "int", false);
						}
					} else {
					sql += "planid=" + this.sqlConnect(sql, ", ") + this.get_DB().dbQuote(H_tel.planid, "int", false);
				}
			} else if ((this.O_order.type_chn == H_order.ordertype || this.O_order.type_shi == H_order.ordertype) && "" != H_permit.plan) {
			sql += "planid=" + this.sqlConnect(sql, ", ") + this.get_DB().dbQuote(H_permit.plan, "int", true);
		}

		if (this.O_order.type_chn == H_order.ordertype || this.O_order.type_shi == H_order.ordertype) {
			sql += this.sqlConnect(sql, ", ") + "machine=" + this.get_DB().dbQuote(H_permit.productname, "text", false);
			sql += this.sqlConnect(sql, ", ") + "color=" + this.get_DB().dbQuote(H_permit.property, "text", false);
		}

		if (this.O_Set.car_willcom != H_order.carid && this.O_Set.car_emobile != H_order.carid) {
			if ("stay" != H_permit.packetradio && "" != H_permit.packet) {
				sql += this.sqlConnect(sql, ", ") + "packetid=" + H_permit.packet;
			}
		}

		if (this.O_order.type_chn == H_order.ordertype || this.O_order.type_shi == H_order.ordertype) {
			var simno = this.getSimcardNo(H_sess.SELF, H_permit, "simno");

			if (undefined === simno) {
				simno = this.getSimcardNo(H_sess.SELF, H_permit, "simcardno");
			}

			sql += this.sqlConnect(sql, ", ") + "simcardno=" + this.get_DB().dbQuote(simno, "text", false);
		}

		if (this.O_order.type_mnp == H_order.ordertype) {
			sql += this.sqlConnect(sql, ", ") + "carid=" + this.get_DB().dbQuote(H_order.carid, "int", true);
		}

		if (this.O_order.type_shi == H_order.ordertype) {
			sql += this.sqlConnect(sql, ", ") + "cirid=" + this.get_DB().dbQuote(H_order.cirid, "int", true);
		}

		if (true == (undefined !== H_sess.SELF.area[H_permit.detail_sort])) {
			sql += this.sqlConnect(sql, ", ") + "arid=" + this.get_DB().dbQuote(H_sess.SELF.area[H_permit.detail_sort], "int", false);
		}

		if (this.O_order.type_chn == H_order.ordertype || this.O_order.type_shi == H_order.ordertype) {
			var nowdate = MtDateUtil.getNow();
			var H_date = this.makeInsertDateData(H_permit, H_sess, nowdate);

			if (true == (undefined !== H_sess.SELF.expectdate)) //追加
				{
					var expectdate = this.makeDateString(H_sess.SELF.expectdate);
				} else if (!!H_permit.expectdate) //ここまで
				{
					expectdate = H_permit.expectdate;
				} else {
				expectdate = nowdate;
			}

			sql += this.sqlConnect(sql, ", ") + "orderdate=" + this.get_DB().dbQuote(expectdate, "date", true) + ", " + "buyselid=" + this.get_DB().dbQuote(H_order.buyselid, "int", false) + ", " + "fixdate=" + this.get_DB().dbQuote(nowdate, "date", false);
		}

		if ("" != H_permit.option) {
			if (this.O_order.type_shi == H_order.ordertype) {
				var option = this.remakeOptions(unserialize(H_permit.option), this.getShiftOptionID(unserialize(H_tel.options)));
			} else {
				option = this.remakeOptions(unserialize(H_permit.option), unserialize(H_tel.options));
			}

			sql += this.sqlConnect(sql, ", ") + "options='" + option + "' ";
		}

		if ("" != H_permit.waribiki) {
			if (this.O_order.type_shi == H_order.ordertype) {
				var discount = this.remakeOptions(unserialize(H_permit.waribiki), this.getShiftOptionID(unserialize(H_tel.discounts)));
			} else {
				discount = this.remakeOptions(unserialize(H_permit.waribiki), unserialize(H_tel.discounts));
			}

			sql += this.sqlConnect(sql, ", ") + "discounts='" + discount + "' ";
		}

		if (this.O_Set.car_softbank == H_order.carid) {
			if (undefined !== H_order.webreliefservice && !!H_order.webreliefservice) {
				if ("stay" != H_order.webreliefservice) {
					sql += this.sqlConnect(sql, ", ") + "webreliefservice=" + this.get_DB().dbQuote(H_order.webreliefservice, "text", false);
				}
			}
		}

		if (!!H_order.recogcode) {
			sql += this.sqlConnect(sql, ", ") + "recogcode=" + this.get_DB().dbQuote(H_order.recogcode, "text", false);
		}

		if (!!H_order.pbpostcode) {
			sql += this.sqlConnect(sql, ", ") + "pbpostcode=" + this.get_DB().dbQuote(H_order.pbpostcode, "text", false);
		}

		if (!!H_order.pbpostcode_first) {
			sql += this.sqlConnect(sql, ", ") + "pbpostcode_first=" + this.get_DB().dbQuote(H_order.pbpostcode_first, "text", false);
		}

		if (!!H_order.pbpostcode_second) {
			sql += this.sqlConnect(sql, ", ") + "pbpostcode_second=" + this.get_DB().dbQuote(H_order.pbpostcode_second, "text", false);
		}

		if (!!H_order.cfbpostcode) {
			sql += this.sqlConnect(sql, ", ") + "cfbpostcode=" + this.get_DB().dbQuote(H_order.cfbpostcode, "text", false);
		}

		if (!!H_order.cfbpostcode_first) {
			sql += this.sqlConnect(sql, ", ") + "cfbpostcode_first=" + this.get_DB().dbQuote(H_order.cfbpostcode_first, "text", false);
		}

		if (!!H_order.cfbpostcode_second) {
			sql += this.sqlConnect(sql, ", ") + "cfbpostcode_second=" + this.get_DB().dbQuote(H_order.cfbpostcode_second, "text", false);
		}

		if (!!H_order.ioecode) {
			sql += this.sqlConnect(sql, ", ") + "ioecode=" + this.get_DB().dbQuote(H_order.ioecode, "text", false);
		}

		if (!!H_order.coecode) {
			sql += this.sqlConnect(sql, ", ") + "coecode=" + this.get_DB().dbQuote(H_order.coecode, "text", false);
		}

		if (!!H_order.commflag) {
			sql += this.sqlConnect(sql, ", ") + "commflag=" + this.get_DB().dbQuote(H_order.commflag, "text", false);
		}

		return sql;
	}

	makeTelFjpSQL(H_order) {
		var sql = "";

		if (!!H_order.recogcode) {
			sql += this.sqlConnect(sql, ", ") + "recogcode=" + this.get_DB().dbQuote(H_order.recogcode, "text", false);
		}

		if (!!H_order.pbpostcode) {
			sql += this.sqlConnect(sql, ", ") + "pbpostcode=" + this.get_DB().dbQuote(H_order.pbpostcode, "text", false);
		}

		if (!!H_order.pbpostcode_first) {
			sql += this.sqlConnect(sql, ", ") + "pbpostcode_first=" + this.get_DB().dbQuote(H_order.pbpostcode_first, "text", false);
		}

		if (!!H_order.pbpostcode_second) {
			sql += this.sqlConnect(sql, ", ") + "pbpostcode_second=" + this.get_DB().dbQuote(H_order.pbpostcode_second, "text", false);
		}

		if (!!H_order.cfbpostcode) {
			sql += this.sqlConnect(sql, ", ") + "cfbpostcode=" + this.get_DB().dbQuote(H_order.cfbpostcode, "text", false);
		}

		if (!!H_order.cfbpostcode_first) {
			sql += this.sqlConnect(sql, ", ") + "cfbpostcode_first=" + this.get_DB().dbQuote(H_order.cfbpostcode_first, "text", false);
		}

		if (!!H_order.cfbpostcode_second) {
			sql += this.sqlConnect(sql, ", ") + "cfbpostcode_second=" + this.get_DB().dbQuote(H_order.cfbpostcode_second, "text", false);
		}

		if (!!H_order.ioecode) {
			sql += this.sqlConnect(sql, ", ") + "ioecode=" + this.get_DB().dbQuote(H_order.ioecode, "text", false);
		}

		if (!!H_order.coecode) {
			sql += this.sqlConnect(sql, ", ") + "coecode=" + this.get_DB().dbQuote(H_order.coecode, "text", false);
		}

		if (!!H_order.commflag) {
			sql += this.sqlConnect(sql, ", ") + "commflag=" + this.get_DB().dbQuote(H_order.commflag, "text", false);
		}

		if ("" != sql) {
			sql = ", " + sql;
		}

		return sql;
	}

	makeBulkPlanUpdatePhrase(H_tel, H_permit, H_order) //プランがかわるならオーダー情報をそのままtel_tbに反映
	{
		var sql = "";

		if ("" != H_permit.plan) {
			sql += "planid=" + this.sqlConnect(sql, ", ") + this.get_DB().dbQuote(H_permit.plan, "int", true);
		}

		if (this.O_Set.car_willcom != H_order.carid && this.O_Set.car_emobile != H_order.carid) {
			if ("" != H_permit.packet) {
				var packet = H_permit.packet;
			} else {
				packet = "";
			}

			sql += this.sqlConnect(sql, ", ") + "packetid=" + this.get_DB().dbQuote(packet, "int", false);
		}

		return sql;
	}

	remakeOptions(H_ordopt, H_telopt) {
		var H_result = undefined;

		if (true == Array.isArray(H_ordopt)) {
			for (var key in H_ordopt) {
				var val = H_ordopt[key];

				if ("stay" == val) {
					if (true == H_telopt[key]) {
						H_result[key] = "1";
					}
				} else if ("put" == val) {
					H_result[key] = "1";
				} else if ("1" === val) {
					H_result[key] = "1";
				}
			}
		}

		if (undefined == H_result) {
			return H_result;
		}

		return serialize(H_result);
	}

	convDocomoPlan(planid, buyselid) {
		if (undefined == planid || "" == planid) {
			return "";
		}

		if (buyselid == 3) {
			buyselid = 1;
		}

		var sql = "SELECT toplan FROM docomo_plan_shift_tb WHERE fromplan=" + planid + " AND buyselid=" + buyselid;
		var result = this.get_DB().queryOne(sql);

		if (undefined == result) {
			result = planid;
		}

		return result;
	}

	getDeliveryDateType(H_sess, sub, auth) //deliverydate_typeは受注詳細画面にあるよ
	//納品日のtypeを個別に設定するものがあるかどうか
	//全体に設定する納品日と予定日
	//個別に反映するもの
	//権限がない模様
	//個別に反映する値を決める
	//値の大きいほうを使うよ。値が同じ場合は全体変更のほうを優先するよ
	//値が有効かチェックします
	////  日付が更新されていなかった場合のチェック・・・でも後回し
	//        $deliverydate = NULL;
	//        if(("1" == isset($H_sess["SELF"]["allproc"]))  && (true == isset($H_order["workdetail"][$H_permit["detail_sort"]]))){
	//            //  納品日の設定
	//            if (("specifies" == $H_sess["SELF"]["endsel"]) && (true == isset($H_sess["SELF"]["deliverydate"]))) {
	//                //  納品日を指定する
	//                $deliverydate = $this->get_DB()->dbQuote($this->makeDateString($H_sess["SELF"]["deliverydate"], true), "date", false);
	//            } elseif ("after" == $H_sess["SELF"]["endsel"]) {
	//                //  納品日は未定
	//                $deliverydate = $this->get_DB()->dbQuote("1999-01-01 00:00:00", "date", false);
	//            }
	//        }
	//        elseif("10" == $H_sess["SELF"]["allproc"]){
	//            $deliverydate = $this->get_DB()->dbQuote($this->makeDateString($H_sess["SELF"]["deliverydate"], true), "date", false);
	//        }
	//メール送信が選択されたかチェック
	{
		var all = -1;
		var local = -1;
		var res = Array();

		if (auth == false) {
			return {
				update_type: false,
				update_date: true,
				update_send: false,
				type: sub.deliverydate_type,
				send_flg: sub.send_deliverydate_flg
			};
		}

		if (sub.deliverydate_type == 2) //納品日の状態の更新有無
			//納品日の更新有無
			//未定、予定、確定日
			//メールの送信について
			{
				res.update_type = false;
				res.update_date = false;
				res.type = sub.deliverydate_type;

				if (sub.send_deliverydate_flg == 0 && H_sess.SELF.send_deliverydate == "true") //送信していない状態で送信しますが選択された
					{
						res.update_send = true;
						res.send_flg = 1;
					} else //既に送信済みもしくは、送信しないが選択された
					{
						res.update_send = false;
						res.send_flg = sub.send_deliverydate_flg;
					}

				return res;
			}

		var type = H_sess.SELF.deliverydate_type_all;

		if (is_null(type) || type == "") //POSTの値がないみたい
			{
				all = -1;
			} else //0-2の値が入っている
			{
				all = type;
			}

		type = H_sess.SELF.deliverydate_type[sub.detail_sort];

		if (is_null(type) || type == "") //POSTの値がないみたい
			{
				local = -1;
			} else //0-2の値が設定されている
			{
				local = type;
			}

		if (local == 2) {
			res.type = local;
			res.update_date = false;
		} else if ("after" == H_sess.SELF.endsel) {
			res.type = 0;
			res.update_date = true;
		} else if (all >= local) //allの値を使用する
			{
				res.type = all;
				res.update_date = true;
			} else //個別の値を使用する
			{
				res.type = local;
				res.update_date = false;
			}

		if (res.type < 0) {
			res.type = sub.deliverydate_type;
			res.update_date = true;
		}

		if (res.type == sub.deliverydate_type) //変更なし
			{
				res.update_type = false;
			} else //変更あり
			{
				res.update_type = true;
			}

		if (H_sess.SELF.send_deliverydate == "true") //メールを送信します
			{
				res.update_send = true;
				res.send_flg = 1;
			} else //メールを送信しません
			{
				res.update_send = true;
				res.send_flg = 0;
			}

		return res;
	}

	getDeliveryDateTypeInfo(H_sess, H_order) {
		var auth = -1 !== H_order.user_auth.indexOf("fnc_recv_delivery_mail");
		var res = Array();

		if (H_order.order.order.ordertype != "A") {
			{
				let _tmp_3 = H_order.order.machine;

				for (var key in _tmp_3) {
					var value = _tmp_3[key];

					if (value.substatus != this.O_order.st_cancel) {
						res[value.detail_sort] = this.getDeliveryDateType(H_sess, value, auth);
					}
				}
			}
		}

		{
			let _tmp_4 = H_order.order.acce;

			for (var key in _tmp_4) {
				var value = _tmp_4[key];

				if (value.substatus != this.O_order.st_cancel) {
					res[value.detail_sort] = this.getDeliveryDateType(H_sess, value, auth);
				}
			}
		}
		return res;
	}

	getOrderDeliveryDateType(H_order) //未定義の場合は既存のものを返す
	//設定する値
	//全て確定日？
	{
		var kakutei_check = true;
		var yotei_check = false;

		if (undefined !== H_order.deliverydate_type == false) {
			return H_order.order.deliverydate_type;
		}

		{
			let _tmp_5 = H_order.deliverydate_type;

			for (var key in _tmp_5) //端末の予定日確定日をいれていくよ
			{
				var value = _tmp_5[key];
				if (value.type != 2) kakutei_check = false;
				if (value.type != 0) yotei_check = true;
			}
		}

		if (kakutei_check == true) {
			return 2;
		} else if (yotei_check == true) //予定日がある
			{
				return 1;
			} else //未定日しかない
			{
				return 0;
			}

		return 0;
	}

	getSendDeliveryDateFlag(H_order) //デフォルトは送信
	//送信済みかどうか
	{
		if (!(undefined !== H_order.deliverydate_type)) {
			return H_order.order.send_deliverydate_flg;
		}

		var send_flg = 1;
		{
			let _tmp_6 = H_order.deliverydate_type;

			for (var key in _tmp_6) //端末の予定日確定日をいれていくよ
			{
				var value = _tmp_6[key];

				if (value.send_flg == 0) //送信してないものがあれば0にする
					{
						send_flg = 0;
						break;
					}
			}
		}
		return send_flg;
	}

	makeOrderUpdateSQL(H_g_sess, H_sess, H_order, H_permit, H_unperm, ordertype, nowtime, idx, maxloop, totalpt) //エラーがあればステータスに細工
	//mt_order_teldetail_tb
	{
		var A_sql = this.O_order.A_empty;
		var where = " WHERE " + "orderid=" + H_permit.orderid + " AND detail_sort=";

		if (this.O_order.type_acc == H_order.order.ordertype) {
			var price = +H_sess.SELF.price[H_permit.ordersubid - 1];
			var point = +H_sess.SELF.point[H_permit.ordersubid - 1];
			var expoint = +H_sess.SELF.expoint[H_permit.ordersubid - 1];
		} else if (this.O_order.type_mis == H_order.order.ordertype) {
			price = +H_sess.SELF.price[0];
			point = +H_sess.SELF.point[0];
			expoint = +H_sess.SELF.expoint[0];
		} else {
			price = +H_sess.SELF.price[H_permit.detail_sort];
			point = +H_sess.SELF.point[H_permit.detail_sort];
			expoint = +H_sess.SELF.expoint[H_permit.detail_sort];
		}

		var number = +H_permit.number;
		var stockupflg = false;

		if (1 == H_sess.SELF.allproc) {
			var H_stctag = this.getUpdateStockValue(H_sess.SELF.allreserve);
		}

		var statsql = "";
		var substatsql = "";

		if (false == (undefined !== H_sess.SELF.status) || undefined == H_sess.SELF.status) {
			var status = H_permit.substatus;
		} else {
			status = H_sess.SELF.status;
		}

		if (true == (undefined !== H_unperm[0])) {
			status = this.getPartErrorStatus(ordertype, H_sess.SELF.status, H_permit.substatus);
		}

		if (undefined != status) {
			statsql = "status=" + this.get_DB().dbQuote(status, "int", true) + " ";
			substatsql = "sub" + statsql;
		}

		var finishsql = "";

		if (true == this.checkEndOutStatus(status)) {
			var finishdate = this.get_DB().queryOne("SELECT finishdate FROM mt_order_tb WHERE orderid = " + H_permit.orderid);

			if (is_null(finishdate)) {
				var sub_detail_finishdate = this.get_DB().queryOne("select max(expectdate) from (select expectdate from mt_order_sub_tb where orderid = " + H_permit.orderid + " union select expectdate from mt_order_teldetail_tb where orderid = " + H_permit.orderid + ") as a");

				if (!is_null(sub_detail_finishdate)) {
					finishsql = "finishdate=" + this.get_DB().dbQuote(sub_detail_finishdate, "date", false);
				}
			} else if (true == this.checkEndSubStatus(status, H_permit.substatus, "ship")) {
				finishsql = "finishdate=" + this.get_DB().dbQuote(nowtime, "date", false);
			}

			if (true == (undefined !== H_sess.SELF.expectdate) && "desig" == H_sess.SELF.expectup) {
				finishsql = "finishdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false);
			} else if (true == (undefined !== H_sess.SELF.expectdate) && "spec" == H_sess.SELF.dayswitch) {
				finishsql = "finishdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false);
			}
		}

		if (true == (undefined !== H_sess.SELF.expectdate) && "spec" == H_sess.SELF.dayswitch) //受注一括ステータス変更
			{
				var subsql = "UPDATE " + ShopOrderDetailModel.ORD_SUB_TB + " " + "SET " + substatsql;
				var tmp = "";
				tmp = this.addUpdateSubDateType(H_order, H_permit, H_sess, nowtime);

				if ("" != tmp) {
					subsql += ", " + tmp;
				}

				if ("230" == H_sess.SELF.status) {
					subsql += ", number=0 ";
				}

				subsql += ",fixdate=" + this.get_DB().dbQuote(nowtime, "date", true);

				if ("" != finishsql) {
					subsql += ", " + finishsql;
				}

				subsql += " WHERE orderid=" + H_permit.orderid;
			} else //一括プラン変更ではない？
			{
				if (this.O_order.type_blp != H_order.order.ordertype) //一括プラン変更ではない
					{
						subsql = "UPDATE " + ShopOrderDetailModel.ORD_SUB_TB + " " + "SET " + substatsql + this.sqlConnect(statsql, ", ");

						if ("" != finishsql) {
							subsql += finishsql + ", ";
						}

						subsql += "saleprice=" + this.get_DB().dbQuote(price, "int", true) + ", " + "shoppoint=" + this.get_DB().dbQuote(point, "int", true) + ", " + "shoppoint2=" + this.get_DB().dbQuote(expoint, "int", true) + ", " + "fixedsubtotal=" + this.get_DB().dbQuote(MtRounding.tweek(price * number), "int", false) + ", " + "fixedtotal=" + this.get_DB().dbQuote(MtRounding.tweek(price * number - point * number), "int", false) + ", " + "fixedtaxprice=" + this.get_DB().dbQuote(MtTax.taxPrice(price * number - point * number), "int", false) + ", ";

						if (true == H_stctag.upflg) {
							subsql += "stockflg=" + this.get_DB().dbQuote(H_stctag.target, "bool", false) + ", ";
						}

						if ("230" == H_sess.SELF.status) {
							subsql += "number=0, ";
						}

						subsql += "fixdate=" + this.get_DB().dbQuote(nowtime, "date", true);
						tmp = this.addUpdateSubDateType(H_order, H_permit, H_sess, nowtime);
						subsql += this.sqlConnect(tmp, ", ") + tmp + where + H_permit.detail_sort;
					} else //一括プラン変更
					{
						if (true != this.makesubupflg) {
							this.makesubupflg = true;
							subsql = "UPDATE " + ShopOrderDetailModel.ORD_SUB_TB + " " + "SET " + substatsql;
							tmp = this.addUpdateSubDateType(H_order, H_permit, H_sess, nowtime);
							tmp += this.sqlConnect(tmp, ", ") + "fixdate=" + this.get_DB().dbQuote(nowtime, "date", true);
							subsql += this.sqlConnect(substatsql, ", ") + tmp;

							if ("230" == H_sess.SELF.status) {
								subsql += ", number=0 ";
							}

							subsql += " WHERE orderid=" + H_permit.orderid;
						}
					}
			}

		if (true == H_permit.machineflg) {
			var detsql = "UPDATE " + ShopOrderDetailModel.ORD_DET_TB + " " + "SET ";

			if (false == (undefined !== H_sess.SELF.expectdate) || false == (undefined !== H_sess.SELF.dayswitch)) //dayswitchは一括受注ステータス変更の処理日選択のもの
				//完了以降のステータスならステータスは更新しない
				{
					if (this.O_order.st_complete > H_permit.substatus) {
						detsql += substatsql + this.sqlConnect(statsql, ", ");
					}

					detsql += "saleprice=" + this.get_DB().dbQuote(price, "int", true) + ", " + "shoppoint=" + this.get_DB().dbQuote(point, "int", true) + ", " + "shoppoint2=" + this.get_DB().dbQuote(expoint, "int", true) + ", " + "pay_frequency=" + this.get_DB().dbQuote(H_sess.SELF.pay_frequency, "int", false) + ", " + "pay_monthly_sum=" + this.get_DB().dbQuote(H_sess.SELF.pay_monthly_sum, "int", false);

					if (true == H_stctag.upflg) {
						detsql += ", stockflg=" + this.get_DB().dbQuote(H_stctag.target, "bool", false);
					}

					if (this.checkProcFinish(H_permit.substatus, H_sess.SELF.status)) {
						detsql += ", registflg=" + this.get_DB().dbQuote(this.getRegistFlg(), "bool", true);
					}

					detsql += ", fixdate=" + this.get_DB().dbQuote(nowtime, "date", true);
					detsql += this.sqlConnectEx(detsql, this.makeTelPropertySQL(H_sess.SELF, H_permit), ", ", true);
					detsql += this.sqlConnectEx(detsql, this.addUpdateTelDetailDateType(H_sess, H_order, H_permit, ordertype, nowtime), ", ", true) + where + H_permit.detail_sort;
				} else {
				if (this.checkProcFinish(H_permit.substatus, H_sess.SELF.status)) {
					if (this.getRegistType()) {
						detsql += "registflg=true, ";
					} else {
						detsql += "registflg=false, ";
					}
				}

				if (this.O_order.st_complete > H_permit.substatus) {
					detsql += this.addUpdateTelDetailDateType(H_sess, H_order, H_permit, ordertype, nowtime) + ", " + substatsql + where + H_permit.detail_sort;
				} else {
					detsql += this.addUpdateTelDetailDateType(H_sess, H_order, H_permit, ordertype, nowtime) + where + H_permit.detail_sort;
				}
			}
		} else if (this.O_order.type_acc == H_order.order.ordertype) {
			if ("desig" == H_sess.SELF.expectup && true == (undefined !== H_sess.SELF.expectdate)) {
				detsql = "UPDATE " + ShopOrderDetailModel.ORD_DET_TB + " SET ";
				detsql += "registdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate), "date", false) + " ";

				if (this.checkProcFinish(H_permit.substatus, H_sess.SELF.status)) {
					detsql += ", registflg=" + this.get_DB().dbQuote(this.getRegistFlg(), "bool", true) + " ";
				}

				detsql += where + "0";
			} else if ("undecid" == H_sess.SELF.expectup) {
				detsql = "UPDATE " + ShopOrderDetailModel.ORD_DET_TB + " SET ";
				detsql += "registdate=" + this.get_DB().dbQuote("1999-01-01 00:00:00", "date", false) + " ";
				detsql += where + "0";
			}
		} else if (this.O_order.type_mis == H_order.order.ordertype) {
			detsql = "UPDATE " + ShopOrderDetailModel.ORD_DET_TB + " " + "SET " + substatsql + ", ";

			if (this.checkProcFinish(H_permit.substatus, H_sess.SELF.status)) {
				substatsql += ", registflg=" + this.get_DB().dbQuote(this.getRegistFlg(), "bool", true) + ", ";
			}

			substatsql += "pay_monthly_sum=" + this.get_DB().dbQuote(H_sess.SELF.pay_monthly_sum, "int", false);
			detsql += this.sqlConnectEx(substatsql, this.addUpdateTelDetailDateType(H_sess, H_order, H_permit, ordertype, nowtime), ", ", true) + where + H_permit.detail_sort;
		} else if (true == (undefined !== H_sess.SELF.expectdate) && "spec" == H_sess.SELF.dayswitch) {
			detsql = "UPDATE " + ShopOrderDetailModel.ORD_DET_TB + " " + "SET " + substatsql + (detsql += this.sqlConnectEx(substatsql, this.addUpdateTelDetailDateType(H_sess, H_order, H_permit, ordertype, nowtime), ", ", true));

			if (this.checkProcFinish(H_permit.substatus, H_sess.SELF.status)) {
				detsql += ", registflg=" + this.get_DB().dbQuote(this.getRegistFlg(), "bool", true) + " ";
			}

			detsql += " WHERE orderid=" + H_permit.orderid;
		}

		var smptype = H_sess.SELF.smarttypehidden;

		if (!smptype && "0" != smptype) {
			smptype = H_order.order.smartphonetype;
		}

		if (maxloop - 1 == idx) //statusがNULLじゃなければ更新する
			//コメント
			//k76 納品予定日変更コメント
			{
				var targetdate = nowtime.substr(0, 8) + "01";
				var completesql = this.makeCompleteDateSql(status, H_permit.substatus, this.getTargetDate(this.setDateArray(0, 3, 0, targetdate)));
				var sql = "UPDATE " + ShopOrderDetailModel.ORD_TB + " " + "SET " + receiptsql + this.sqlConnect(receiptsql, ", ");

				if (!is_null(H_sess.SELF.status)) {
					sql += statsql + this.sqlConnect(statsql, ", ");
				}

				if ("" != finishsql) {
					sql += finishsql + ", ";
				}

				sql += "billtotal=" + this.get_DB().dbQuote(H_sess.SELF.billtotal, "int", false) + ", " + "billsubtotal=" + this.get_DB().dbQuote(H_sess.SELF.billsubtotal, "int", false) + ", " + "pointsum=" + this.get_DB().dbQuote(totalpt, "int", false) + ", " + "fixdate=" + this.get_DB().dbQuote(nowtime, "date", true) + ", " + "pay_point=" + this.get_DB().dbQuote(H_sess.SELF.pay_point, "int", false) + ", " + "paymentprice=" + this.get_DB().dbQuote(H_sess.SELF.termprice, "int", false) + ", " + "slipno=" + this.get_DB().dbQuote(H_sess.SELF.slipno, "text", false) + ", " + "message=" + this.get_DB().dbQuote(H_sess.SELF.message, "text", false) + ", " + "smartphonetype=" + this.get_DB().dbQuote(smptype, "int", false) + ", " + "settlement=" + this.get_DB().dbQuote(H_sess.SELF.settlement, "text", false) + ", " + "billtotal2=" + this.get_DB().dbQuote(H_sess.SELF.billtotal2, "int", false) + ", " + "deliverydate_type=" + this.get_DB().dbQuote(this.getOrderDeliveryDateType(H_order), "int", false) + ", " + "send_deliverydate_flg=" + this.get_DB().dbQuote(this.getSendDeliveryDateFlag(H_order), "int", false) + " ";

				if ("" != completesql) {
					sql += ", " + completesql + " ";
				}

				if ("230" == H_sess.SELF.status) {
					sql += ", telcnt=0 ";
				}

				if (undefined !== H_sess.SELF.phone_management_leave && "boolean" === typeof H_sess.SELF.phone_management_leave && !is_null(H_sess.SELF.phone_management_leave)) {
					sql += ", phone_management_leave=" + this.get_DB().dbQuote(H_sess.SELF.phone_management_leave, "boolean") + " ";
				}

				sql += "WHERE " + "orderid=" + H_permit.orderid;
				var history = "INSERT INTO mt_order_history_tb " + "(orderid, chdate, shopid, shopname, shopperson, shopcomment, status,is_shop_comment) " + "VALUES (" + this.get_DB().dbQuote(H_permit.orderid, "int", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(H_g_sess.shopid, "int", false) + ", " + this.get_DB().dbQuote(H_g_sess.shopname, "text", false) + ", " + this.get_DB().dbQuote(H_g_sess.personname, "text", false) + ", " + this.get_DB().dbQuote(H_sess.SELF.comment, "text", false) + ", " + this.get_DB().dbQuote(status, "int", true) + "," + "true" + ")";
				A_sql.push(subsql, detsql, sql, history);

				if (H_sess.SELF.send_deliverydate == "true") //メールを送信しますか
					{
						var comment_deliverydate_flg = false;
						var kakuteibi = true;
						{
							let _tmp_7 = H_order.deliverydate_type;

							for (var key in _tmp_7) //メール送信フラグがたっている？
							{
								var value = _tmp_7[key];

								if (value.update_send == true && value.send_flg == 1) {
									comment_deliverydate_flg = true;
								}

								if (value.type != 2) {
									kakuteibi = false;
								}
							}
						}

						if (comment_deliverydate_flg == true) //メール送信します
							//コメントの内容
							//SQL作成
							{
								var comment = "";

								if (kakuteibi == true) {
									comment += "\u51FA\u8377\u5B8C\u4E86\u9001\u4FE1\u6E08\u307F";
								} else {
									comment += "\u672A\u5B9A\u3001\u4E88\u5B9A\u65E5\u3042\u308A";
								}

								history = "INSERT INTO mt_order_history_tb " + "(orderid, chdate, shopid, shopname, shopperson, shopcomment, status) " + "VALUES (" + this.get_DB().dbQuote(H_permit.orderid, "int", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(H_g_sess.shopid, "int", false) + ", " + this.get_DB().dbQuote(H_g_sess.shopname, "text", false) + ", " + this.get_DB().dbQuote(H_g_sess.personname, "text", false) + ", " + this.get_DB().dbQuote(comment, "text", false) + ", " + this.get_DB().dbQuote(status, "int", true) + ")";
								A_sql.push(history);
							}
					}
			} else {
			A_sql.push(subsql, detsql);
		}

		return A_sql;
	}

	correctNumeric(num, mode) {
		if ("" == num || undefined == num || 0 > num) {
			return 0;
		}

		if ("up" == mode) {
			var temp = Math.ceil(num);
		} else if ("down" == mode) {
			temp = +num;
		} else if ("round" == mode) {
			temp = Math.round(num);
		}

		if (0 < temp) {
			return temp;
		} else {
			return 0;
		}
	}

	addUpdateSubDateType(H_order, H_permit, H_sess, nowtime) //メモ
	//ordersubidではなく、detail_sortでmt_order_sub_tbは更新される。
	//つまり、端末を10台注文した場合、この関数は10回呼ばれるが実際に更新されるのはH_permit[detail_sort]が0の時のみである・・
	//k76 納品日の予定日確定日 20150304date
	//端末の場合、キャンセルではないものを選択する
	//k76 納品日の予定日確定日 20150304date
	{
		var deliverydate_type = H_order.deliverydate_type[H_permit.detail_sort];

		if (H_permit.machineflg) {
			for (var machine of Object.values(H_order.machine)) //キャンセルは無視する
			{
				if (machine.substatus == 230) {
					continue;
				}

				deliverydate_type = H_order.deliverydate_type[machine.detail_sort];
				break;
			}
		}

		var sql = "";

		if ("1" == (undefined !== H_sess.SELF.allproc) && true == (undefined !== H_order.workdetail[H_permit.detail_sort])) //k76 納品日が確定日になっている場合は更新しない 20150304date
			{
				if (deliverydate_type.update_date == true) //納品日の設定
					{
						if ("specifies" == H_sess.SELF.endsel && true == (undefined !== H_sess.SELF.deliverydate)) //納品日を指定する
							{
								sql = "deliverydate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.deliverydate, true), "date", false) + " ";
							} else if ("after" == H_sess.SELF.endsel) //納品日は未定
							{
								sql = "deliverydate=" + this.get_DB().dbQuote("1999-01-01 00:00:00", "date", false) + " ";
							}
					}

				if ("1" == H_sess.SELF.allproc && true == (undefined !== H_sess.SELF.expectdate)) {
					if ("desig" == H_sess.SELF.expectup && true == (undefined !== H_sess.SELF.expectdate)) {
						sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
					}
				} else if ("undecid" == H_sess.SELF.expectup) {
					sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote("1999-01-01 00:00:00", "date", false) + " ";
				}
			} else if ("10" == H_sess.SELF.allproc) //k76 納品日が確定日になっている場合は更新しない 20150304date
			{
				if (deliverydate_type.update_date == true) //納品日の設定
					{
						sql = "deliverydate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.deliverydate, true), "date", false) + " ";
					}

				if ("spec" == H_sess.SELF.dayswitch) {
					sql += this.sqlConnect(sql, ", ") + " expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
				}
			} else {
			if (true == (undefined !== H_sess.SELF.dbget) && "spec" == H_sess.SELF.dayswitch) {
				sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
			}
		}

		if (deliverydate_type.update_type == true) {
			sql += this.sqlConnect(sql, ", ") + "deliverydate_type=" + deliverydate_type.type + " ";
		}

		if (deliverydate_type.update_send == true) {
			sql += this.sqlConnect(sql, ", ") + "send_deliverydate_flg=" + deliverydate_type.send_flg + " ";
		}

		return sql;
	}

	insertDummyDate(H_sess, H_order) {
		if ("1" == (undefined !== H_sess.SELF.allproc)) {
			var subsql = "UPDATE " + ShopOrderDetailModel.ORD_SUB_TB + " SET ";
			var detsql = "UPDATE " + ShopOrderDetailModel.ORD_DET_TB + " SET ";
			var upsql = "";
			var flg = false;

			if ("specifies" == H_sess.SELF.endsel && true == (undefined !== H_sess.SELF.deliverydate)) {
				flg = true;
				upsql += "deliverydate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.deliverydate, true), "date", false) + " ";
			}

			if ("1" == H_sess.SELF.allproc && true == (undefined !== H_sess.SELF.expectdate)) {
				flg = true;
				upsql += this.sqlConnect(upsql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
			}
		}

		if (true == flg) {
			var A_sql = this.O_order.A_empty;
			subsql += upsql + "WHERE orderid=" + H_order.order.orderid;
			detsql += upsql + "WHERE orderid=" + H_order.order.orderid;
			A_sql.push(subsql, detsql);
			return A_sql;
		}

		return undefined;
	}

	addUpdateTelDetailDateType(H_sess, H_order, H_permit, ordertype, nowtime) //k76 納品日の予定日確定日 20150304date
	{
		var deliverydate_type = H_order.deliverydate_type[H_permit.detail_sort];
		var sql = "";

		if (this.O_order.type_new == ordertype) //if(null != ($H_sess["SELF"]["telno"][$H_permit["detail_sort"]])){
			{
				if (true == (undefined !== H_sess.SELF.telno[H_permit.detail_sort])) {
					sql += this.sqlConnect(sql, ", ") + "telno=" + this.get_DB().dbQuote(this.O_order.convertNoView(H_sess.SELF.telno[H_permit.detail_sort]), "text", false);
					sql += this.sqlConnect(sql, ", ") + "telno_view=" + this.get_DB().dbQuote(this.makeTelnoView(H_sess.SELF.telno[H_permit.detail_sort]), "text", false);
				}
			}

		if (this.O_order.type_new == ordertype || this.O_order.type_mnp == ordertype) {
			if (true == (undefined !== H_sess.SELF.extensionno[H_permit.detail_sort])) {
				sql += this.sqlConnect(sql, ", ") + "extensionno=" + this.get_DB().dbQuote(H_sess.SELF.extensionno[H_permit.detail_sort], "text", false);

				if (H_permit.extensionno != H_sess.SELF.extensionno[H_permit.detail_sort]) {
					this.procReserveExtension = {
						ensure: H_sess.SELF.extensionno[H_permit.detail_sort],
						release: H_permit.extensionno,
						pactid: H_order.order.pactid,
						carid: H_order.order.carid
					};
				}
			}
		}

		if (true == (-1 !== [this.O_order.type_new, this.O_order.type_mnp, this.O_order.type_chn, this.O_order.type_shi, this.O_order.type_mis].indexOf(ordertype))) {
			if (true == (undefined !== H_sess.SELF.simno[H_permit.detail_sort])) {
				sql += this.sqlConnect(sql, ", ") + "simcardno=" + this.get_DB().dbQuote(H_sess.SELF.simno[H_permit.detail_sort], "text", false);
			}
		}

		if (true == (-1 !== [this.O_order.type_new, this.O_order.type_mnp, this.O_order.type_shi, this.O_order.type_chn, this.O_order.type_tpc, this.O_order.type_mis].indexOf(ordertype))) {
			if (true == (undefined !== H_sess.SELF.serial[H_permit.detail_sort])) {
				sql += this.sqlConnect(sql, ", ") + "serialno=" + this.get_DB().dbQuote(H_sess.SELF.serial[H_permit.detail_sort], "text", false);
			}

			if ("" != H_sess.SELF.pay_startdate[H_permit.detail_sort].Y && "" != H_sess.SELF.pay_startdate[H_permit.detail_sort].m) {
				sql += this.sqlConnect(sql, ", ") + "pay_startdate=" + this.get_DB().dbQuote(H_sess.SELF.pay_startdate[H_permit.detail_sort].Y + "-" + H_sess.SELF.pay_startdate[H_permit.detail_sort].m + "-01:00:00:00", "date", false);
			}
		}

		if (this.O_order.type_blp != ordertype && true == (undefined !== H_sess.SELF.area[H_permit.detail_sort])) {
			sql += this.sqlConnect(sql, ", ") + "arid=" + this.get_DB().dbQuote(H_sess.SELF.area[H_permit.detail_sort], "int", false);
		}

		if (true == (undefined !== H_sess.SELF.allproc) && true == (undefined !== H_order.workdetail[H_permit.detail_sort])) //直接指定
			{
				if ("1" == H_sess.SELF.contractup && true == (undefined !== H_sess.SELF.contractdate)) {
					if ("" != H_sess.SELF.contractdate.Y && "" != H_sess.SELF.contractdate.m && "" != H_sess.SELF.contractdate.d) {
						sql += this.sqlConnect(sql, ", ") + "contractdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.contractdate, false), "date", false) + " ";
						sql += this.sqlConnect(sql, ", ") + "telcontractdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.contractdate, false), "date", false) + " ";
					}
				} else if (is_null(H_permit.contractdate) || !H_permit.contractdate) {
					if ("" != H_sess.SELF.expectdate.Y && "" != H_sess.SELF.expectdate.m && "" != H_sess.SELF.expectdate.d) {
						sql += this.sqlConnect(sql, ", ") + "contractdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, false), "date", false) + " ";
						sql += this.sqlConnect(sql, ", ") + "telcontractdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, false), "date", false) + " ";
					}
				}

				if ("desig" == H_sess.SELF.expectup && true == (undefined !== H_sess.SELF.expectdate)) //購入日が未入力なら処理日で更新　機種変更は常に更新
					{
						if ("C" == H_order.order.ordertype || is_null(H_permit.registdate) || !H_permit.registdate) {
							sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";

							if ("1" != H_sess.SELF.registup) {
								sql += this.sqlConnect(sql, ", ") + "registdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate), "date", false) + ", " + "telorderdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate), "date", false) + " ";
							}
						} else {
							sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
						}
					} else if ("undecid" == H_sess.SELF.expectup) {
					sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote("1999-01-01 00:00:00", "date", false) + ", " + "registdate=" + this.get_DB().dbQuote("1999-01-01 00:00:00", "date", false) + " ";
				}

				if (deliverydate_type.update_date == true) {
					if ("specifies" == H_sess.SELF.endsel && true == (undefined !== H_sess.SELF.deliverydate)) {
						sql += this.sqlConnect(sql, ", ") + "deliverydate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.deliverydate, true), "date", false) + " ";
					} else if ("after" == H_sess.SELF.endsel) {
						sql += this.sqlConnect(sql, ", ") + "deliverydate=" + this.get_DB().dbQuote("1999-01-01 00:00:00", "date", false) + " ";
					}
				}
			} else if ("10" == H_sess.SELF.allproc) //k76納品日が確定日になっている場合は更新しない20150304date
			{
				if (deliverydate_type.update_date == true) {
					sql += this.sqlConnect(sql, ", ") + "deliverydate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.deliverydate, true), "date", false) + " ";
				}

				sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
			} else if (true == (undefined !== H_sess.SELF.expectdate) && "spec" == H_sess.SELF.dayswitch) {
			sql += this.sqlConnect(sql, ", ") + "expectdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
		}

		if (true == this.checkEndOutStatus(H_sess.SELF.status)) {
			var finishsql = "";

			if (true == this.checkEndSubStatus(H_sess.SELF.status, H_permit.substatus, "ship")) {
				finishsql = this.sqlConnect(sql, ", ") + "finishdate=" + this.get_DB().dbQuote(nowtime, "date", false) + " ";
			}

			if ("desig" == H_sess.SELF.expectup && true == (undefined !== H_sess.SELF.expectdate)) {
				finishsql = this.sqlConnect(sql, ", ") + "finishdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
			} else if (true == (undefined !== H_sess.SELF.expectdate) && "spec" == H_sess.SELF.dayswitch) {
				finishsql = this.sqlConnect(sql, ", ") + "finishdate=" + this.get_DB().dbQuote(this.makeDateString(H_sess.SELF.expectdate, true), "date", false) + " ";
			}

			sql += finishsql;
		}

		if (deliverydate_type.update_type == true) {
			sql += this.sqlConnect(sql, ",") + "deliverydate_type=" + deliverydate_type.type;
		}

		if (deliverydate_type.update_send == true) {
			sql += this.sqlConnect(sql, ", ") + "send_deliverydate_flg=" + deliverydate_type.send_flg + " ";
		}

		return sql;
	}

	getTelInfomation(H_sess, H_order) {
		var A_telno = this.O_order.A_empty;

		for (var val of Object.values(H_sess)) //記号を除外
		{
			var telno = val.replace(/[^0-9a-zA-Z]/g, "");

			if ("" != telno) {
				A_telno.push(telno);
			}
		}

		var sql = "SELECT " + "telno " + "FROM " + "tel_tb " + "WHERE " + "pactid=" + H_order.order.pactid + " AND carid=" + H_order.order.carid + " AND telno IN ('" + A_telno.join("', '") + "')";
		var H_result = this.get_DB().queryCol(sql);
		return H_result;
	}

	getAssetsInfomation(H_sess, H_order) //空ならやらない
	{
		var A_serno = this.O_order.A_empty;
		var insflg = false;

		if (undefined != H_sess) //配列に製造番号が入っていれば取得
			{
				for (var val of Object.values(H_sess)) //記号を除外
				{
					var serno = val.replace(/[^0-9a-zA-Z]\-/g, "");

					if ("" != serno) {
						A_serno.push(serno);
						insflg = true;
					}
				}

				if (true == insflg) {
					var sql = "SELECT " + "assetsno " + "FROM " + "assets_tb " + "WHERE " + "pactid=" + H_order.order.pactid + " AND delete_flg=false" + " AND assetstypeid=1" + " AND assetsno IN ('" + A_serno.join("', '") + "')";
					return this.get_DB().queryCol(sql);
				}
			}

		return undefined;
	}

	summaryValue(H_order, A_sort, key) {
		var A_detail = this.O_order.A_empty;

		for (var val of Object.values(A_sort)) {
			A_detail.push(+val.sort);
		}

		var str = "";

		for (var val of Object.values(H_order)) {
			if (true == (-1 !== A_detail.indexOf(val.detail_sort))) {
				if (true == (undefined !== val[key])) {
					str += val[key] + "<br>";
				} else if (true == preg_match("/telno/", key)) {
					if (true == val.machineflg) {
						str += "\u672A\u5165\u529B<br>";
					} else {
						str += val.productname + "<br>";
					}
				}
			}
		}

		return str;
	}

	summaryTelno(H_order, A_sort) {
		var A_detail = this.O_order.A_empty;

		for (var val of Object.values(A_sort)) {
			A_detail.push(+val.sort);
		}

		var str = "";

		for (var val of Object.values(H_order)) {
			if ("" != val.telno_view) {
				if (val.substatus != this.O_order.st_cancel) {
					str += val.telno_view + "<br>";
				} else {
					str += "<s>" + val.telno_view + "</s><br>";
				}
			} else if ("" != val.telno) {
				if (val.substatus != this.O_order.st_cancel) {
					str += val.telno + "<br>";
				} else {
					str += "<s>" + val.telno + "</s><br>";
				}
			} else {
				if (val.substatus != this.O_order.st_cancel) {
					str += "\u672A\u5165\u529B<br>";
				} else {
					str += "<s>\u672A\u5165\u529B</s><br>";
				}
			}
		}

		return str;
	}

	summarySubStat(H_order, A_sort, H_view, A_shopid, key) {
		var A_detail = this.O_order.A_empty;

		for (var val of Object.values(A_sort)) {
			A_detail.push(+val.sort);
		}

		var str = "";

		for (var val of Object.values(H_order)) {
			var flg = false;

			if (true == (-1 !== A_detail.indexOf(val.detail_sort))) {
				if (true == (undefined !== val[key])) {
					if (true == (-1 !== A_shopid.indexOf(H_view.order.transto.gif[val.detail_sort].toshopid))) {
						var gifname = this.getTransferImage(H_view.order.order.transfer_type, H_view.order.transto.gif[val.detail_sort].transfer_status, "in");

						for (var shid of Object.values(H_view.order.transto.name[val.detail_sort])) {
							shopname += H_view.shoplist[shid] + "<br>";
						}

						str += "<img src=\"../../images/" + gifname + ".gif\"" + " onmouseover=\"return overlib('" + shopname + "');\" onmouseout=\"nd();\">";
						flg = true;
					}

					str += val[key];
					var shopname = "";

					if (true == (-1 !== A_shopid.indexOf(H_view.order.transfrom.gif[val.detail_sort].fromshopid))) {
						gifname = this.getTransferImage(H_view.order.order.transfer_type, H_view.order.transfrom.gif[val.detail_sort].transfer_status, "out");

						for (var shid of Object.values(H_view.order.transfrom.name[val.detail_sort])) {
							shopname += H_view.shoplist[shid] + "<br>";
						}

						str += "<img src=\"../../images/" + gifname + ".gif\"" + " onmouseover=\"return overlib('" + shopname + "');\" onmouseout=\"nd();\">";
						flg = true;
					}

					str += "<br>";
				}
			}
		}

		return str;
	}

	checkOrderDuplication(H_sess, H_order, pacttype, H_permit, A_telno) {
		H_permit.permit = this.O_order.A_empty;

		if (undefined != A_telno) {
			for (var key in H_sess) {
				var val = H_sess[key];

				if (undefined != val) {
					var val = this.O_order.convertNoView(val);

					if (true == (-1 !== A_telno.indexOf(val))) {
						if ("M" == pacttype) {
							H_permit.unperm.push({
								keyname: "\u96FB\u8A71\u756A\u53F7",
								orderid: this.makeTelnoView(val),
								err: "\u65E2\u306B\u540C\u3058\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059"
							});
						}
					}
				}
			}
		}

		for (var key in H_order) //sessionにない(入力フォームが未入力)についてはcheckInputTelNoで見てるのでif条件から除外
		//if((false == in_array($H_sess[$val["detail_sort"]], $A_telno)) && (null != $H_sess[$val["detail_sort"]])){
		{
			var val = H_order[key];

			if (undefined == A_telno || false == (-1 !== A_telno.indexOf(this.O_order.convertNoView(H_sess[val.detail_sort])))) {
				H_permit.permit.push(val);
			} else if (false == (-1 !== A_telno.indexOf(val.telno)) && undefined != val.telno) {
				H_permit.permit.push(val);
			} else {
				if ("H" == pacttype) {
					val.dbmode = "update";
					H_permit.permit.push(val);
				}
			}
		}

		return H_permit;
	}

	checkOrderNotDuplication(H_sess, H_order, pacttype, H_permit, A_telno) {
		H_permit.permit = this.O_order.A_empty;

		if (1 > A_telno.length) {
			for (var key in H_order) {
				var val = H_order[key];
				val.dbmode = "insert";
				H_permit.permit.push(val);
			}
		} else {
			for (var key in H_order) {
				var val = H_order[key];

				if (false == (-1 !== A_telno.indexOf(val.telno))) {
					val.dbmode = "insert";
				} else {
					val.dbmode = "update";
				}

				H_permit.permit.push(val);
			}
		}

		return H_permit;
	}

	checkAssetsDuplication(H_permit, A_dupser) //使用済みの管理番号があったらupdateやめる
	{
		H_result.permit = this.O_order.A_empty;
		H_result.unperm = this.O_order.A_empty;

		if (undefined != A_dupser) {
			H_result.unperm.push({
				keyname: "\u96FB\u8A71\u756A\u53F7",
				orderid: this.makeTelnoView(val),
				err: "\u65E2\u306B\u540C\u3058\u7BA1\u7406\u756A\u53F7(\u88FD\u9020\u756A\u53F7)\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059<br>" + A_dupser.join(", ")
			});
			return H_result;
		}

		return H_permit;
	}

	getOptionDiscountService(H_option, ordertype) {
		if (1 > H_option.length) {
			return this.O_order.A_empty;
		}

		H_result.option = this.O_order.A_empty;
		H_result.discnt = this.O_order.A_empty;

		for (var val of Object.values(H_option)) {
			if (0 == val.flg) {
				H_result.option.push(val.name);
			} else {
				H_result.discnt.push(val.name);
			}
		}

		return H_result;
	}

	checkInputTelno(H_sess, H_order) {
		H_result.permit = this.O_order.A_empty;

		if (this.O_order.st_sub_shipfin <= +H_sess.status) {
			for (var val of Object.values(H_order.permit)) {
				if ("" != H_sess.telno[val.detail_sort].replace(/[^0-9]/g, "") || undefined != val.telno) {
					H_result.permit.push(val);
				} else //表示用にdetail_sortには1を足しておく(0台目から始まっちゃうから)
					{
						H_order.unperm.push({
							keyname: "",
							orderid: val.detail_sort + 1 + "\u53F0\u76EE",
							err: "\u96FB\u8A71\u756A\u53F7\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093"
						});
					}
			}
		} else {
			var H_result = H_order;
		}

		H_result.unperm = H_order.unperm;
		return H_result;
	}

	checkOrderStatus(H_sess, H_permit, H_order) //メインステータスがない場合はSESSIONが空なので素通り
	{
		if (undefined != H_sess.SELF.status) {
			if (this.O_order.st_sub_prcfin <= +H_order.status && this.O_order.st_sub_prcfin > +H_sess.SELF.status) {
				H_permit.unperm.push({
					keyname: "\u53D7\u6CE8\u756A\u53F7\uFF1A",
					orderid: H_order.orderid,
					err: "\u51E6\u7406\u6E08\u307F\u3088\u308A\u524D\u306B\u306F\u623B\u305B\u307E\u305B\u3093"
				});
			} else if (this.O_order.st_receiptreq == H_sess.SELF.status && 2 == H_order.receipt) {
				H_permit.unperm.push({
					keyname: "\u53D7\u6CE8\u756A\u53F7\uFF1A",
					orderid: H_order.orderid,
					err: "\u53D7\u9818\u78BA\u8A8D\u6E08\u307F\u306E\u53D7\u6CE8\u3092\u3001\u53D7\u9818\u78BA\u8A8D\u4F9D\u983C\u306B\u306F\u3067\u304D\u307E\u305B\u3093"
				});
			} else if (this.O_order.st_cancel == H_order.status && this.O_order.st_cancel != H_sess.SELF.status) {
				H_permit.unperm.push({
					keyname: "\u53D7\u6CE8\u756A\u53F7\uFF1A",
					orderid: H_order.orderid,
					err: "\u30AD\u30E3\u30F3\u30BB\u30EB\u304B\u3089\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
				});
			} else if (this.O_order.st_complete == H_order.status && this.O_order.st_complete != H_sess.SELF.status) {
				H_permit.unperm.push({
					keyname: "\u53D7\u6CE8\u756A\u53F7\uFF1A",
					orderid: H_order.orderid,
					err: "\u5B8C\u4E86\u304B\u3089\u30B9\u30C6\u30FC\u30BF\u30B9\u3092\u5909\u66F4\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093"
				});
			} else {
				H_result.permit = H_permit.permit;
			}
		} else {
			H_result.permit = H_permit.permit;
		}

		H_result.unperm = H_permit.unperm;
		return H_result;
	}

	checkStayPlanCont(H_order, H_permit) {
		H_result.permit = this.O_order.A_empty;

		for (var val of Object.values(H_permit.permit)) //ドコモで引継ならチェックする
		{
			if (this.O_Set.car_docomo == H_order.order.carid && "stay" == val.planradio) //電話管理にプランが登録されていれば引継可能かチェックする
				{
					var sql = "SELECT telno_view, carid, cirid, planid, packetid, options, discounts, buyselid " + "FROM tel_tb " + "WHERE telno='" + val.telno + "' AND carid=" + H_order.order.carid + " AND pactid=" + H_order.order.pactid;
					var H_tel = this.get_DB().queryRowHash(sql);

					if (true == (undefined !== H_tel.planid) && undefined != H_tel.planid) //買い方が変わらなければチェックしない
						{
							if (H_order.order.buyselid == H_tel.buyselid) {
								H_result.permit.push(val);
							} else //引継テーブルになければ引継できない
								{
									sql = "SELECT COUNT(fromplan) FROM docomo_plan_shift_tb WHERE fromplan=" + H_tel.planid;

									if (0 < this.get_DB().queryOne(sql)) {
										H_result.permit.push(val);
									} else {
										H_permit.unperm.push({
											keyname: "\u53D7\u6CE8\u756A\u53F7\uFF1A",
											orderid: val.telno,
											err: "\u5F15\u7D99\u306E\u3067\u304D\u306A\u3044\u30D7\u30E9\u30F3\u3067\u3059"
										});
									}
								}
						} else //ただし、hotlineならチェックしない
						{
							if ("H" != H_order.order.pacttype) {
								H_permit.unperm.push({
									keyname: "\u53D7\u6CE8\u756A\u53F7\uFF1A",
									orderid: val.telno,
									err: "\u96FB\u8A71\u306B\u30D7\u30E9\u30F3\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093"
								});
							} else {
								H_result.permit.push(val);
							}
						}
				} else {
				H_result.permit.push(val);
			}
		}

		H_result.unperm = H_permit.unperm;
		return H_result;
	}

	checkStayPlanLight(H_order, H_machine, H_sess) {
		var result = "";

		if ("230" != H_sess.status) {
			for (var val of Object.values(H_machine)) //ドコモで引継ならチェックする
			{
				if (this.O_Set.car_docomo == H_order.order.carid && "stay" == val.planradio) {
					if (this.O_order.type_shi == H_order.order.ordertype || this.O_order.type_chn == H_order.order.ordertype) //電話管理にプランが登録されていれば引継可能かチェックする
						{
							var sql = "SELECT telno_view, carid, cirid, planid, packetid, options, discounts, buyselid " + "FROM tel_tb " + "WHERE telno='" + val.telno + "' AND carid=" + H_order.order.carid + " AND pactid=" + H_order.order.pactid;
							var H_tel = this.get_DB().queryRowHash(sql);

							if (true == (undefined !== H_tel.planid) && undefined != H_tel.planid) {
								if (H_order.order.buyselid != H_tel.buyselid) //引継テーブルになければ引継できない
									{
										sql = "SELECT COUNT(fromplan) FROM docomo_plan_shift_tb WHERE fromplan=" + H_tel.planid;

										if (0 == this.get_DB().queryOne(sql)) {
											result = "\u5F15\u7D99\u306E\u51FA\u6765\u306A\u3044\u30D7\u30E9\u30F3\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059\u3002<br>\u53D7\u6CE8\u5185\u5BB9\u5909\u66F4\u753B\u9762\u304B\u3089\u30D7\u30E9\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044";
										}
									}
							} else //ただし、hotlineならチェックしない
								{
									if ("H" != H_order.order.pacttype) {
										result = "\u96FB\u8A71\u306B\u30D7\u30E9\u30F3\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002<br>\u53D7\u6CE8\u5185\u5BB9\u5909\u66F4\u753B\u9762\u304B\u3089\u30D7\u30E9\u30F3\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044";
									}
								}
						}
				}
			}
		}

		return result;
	}

	checkOrderInfoMasterData(H_order, H_permit) {
		var errmsg = "";
		var pacterr = false;
		H_result.permit = this.O_order.A_empty;
		var sql = "SELECT postid FROM post_tb " + "WHERE pactid=" + H_order.pactid + " AND postid=" + H_order.postid;

		if (undefined == this.get_DB().queryOne(sql)) {
			pacterr = true;
			errmsg += "\u6307\u5B9A\u3055\u308C\u305F\u90E8\u7F72\u304C\u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728\u3057\u307E\u305B\u3093<br>";
		}

		{
			let _tmp_8 = H_permit.permit;

			for (var key in _tmp_8) //planチェック
			{
				var val = _tmp_8[key];
				var errflg = false;

				if (true == (undefined !== val.plan) && "" != val.plan) {
					sql = "SELECT planid FROM plan_tb " + "WHERE planid=" + val.plan;

					if (undefined == this.get_DB().queryOne(sql)) {
						errflg = true;
						errmsg += "<br>\u6307\u5B9A\u3055\u308C\u305F\u30D7\u30E9\u30F3\u304C\u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728\u3057\u307E\u305B\u3093 (" + val.telno_view + ")";
					}
				}

				if (true == (undefined !== val.packet) && "" != val.packet) {
					sql = "SELECT packetid FROM packet_tb " + "WHERE packetid=" + val.packet;

					if (undefined == this.get_DB().queryOne(sql)) {
						errflg = true;
						errmsg += "<br>\u6307\u5B9A\u3055\u308C\u305F\u30D1\u30B1\u30C3\u30C8\u304C\u30DE\u30B9\u30BF\u30FC\u306B\u5B58\u5728\u3057\u307E\u305B\u3093 (" + val.telno_view + ")";
					}
				}

				if (false == errflg && false == pacterr) {
					H_result.permit.push(val);
				} else {
					H_permit.unperm.push({
						keyname: "\u53D7\u6CE8\u756A\u53F7\uFF1A",
						orderid: val.orderid,
						err: errmsg
					});
				}
			}
		}
		H_result.unperm = H_permit.unperm;
		return H_result;
	}

	makeInsertTelManagement(H_sess, H_order, H_permit, telno) //tel_tbの更新は出荷済み以降。ただし、既に出荷済み以降のものは処理しない
	{
		if (undefined == H_sess.extensionno[H_permit.detail_sort]) {
			var extensionno = H_permit.extensionno;
		} else {
			extensionno = H_sess.extensionno[H_permit.detail_sort];
		}

		var nowdate = MtDateUtil.getNow();
		telno = this.O_order.convertNoView(telno);

		if (true == (-1 !== this.O_order.A_machineadd.indexOf(H_order.ordertype))) //電話詳細情報を取得
			//smartphoneキャリアでの注文は[dummy]をつける & dummy_flgをたてる
			{
				var H_teldetail = this.getTelDetailInfo(H_permit.orderid, H_permit.detail_sort);
				this.makeTelPropertyInfo(H_sess, H_permit, H_teldetail);

				if (this.O_Set.car_smartphone == H_order.carid) {
					telno = "dummy" + telno;
					var dummyflg = true;
				} else {
					dummyflg = false;
				}

				var H_arid = {
					arid: {
						[H_permit.detail_sort]: H_sess.area[H_permit.detail_sort]
					}
				};
				var arid = this.getSimcardNo(H_arid, H_permit, "arid");

				if (this.getRegistType()) {
					if ("update" == H_permit.dbmode) //order_tbのkousiflgをtel_tb用に置き換え
						//sessionにsimcardnoがなければorder_tbから取得
						{
							var kousiflg = this.getKousiFlg(H_permit);
							var simcardno = this.getSimcardNo(H_sess, H_permit, "simno");
							var packetid = this.getSimcardNo(H_sess, H_permit, "packet");
							var telnosql = "";
							var sql = "UPDATE tel_tb SET " + "pactid=" + this.get_DB().dbQuote(H_order.pactid, "integer", true) + ", " + "postid=" + this.get_DB().dbQuote(H_order.postid, "integer", true) + ", " + "userid=" + this.get_DB().dbQuote(H_permit.userid, "integer", false) + ", " + "carid=" + this.get_DB().dbQuote(H_order.carid, "integer", true) + ", " + "arid=" + this.get_DB().dbQuote(arid, "integer", true) + ", " + "cirid=" + this.get_DB().dbQuote(H_order.cirid, "integer", true) + ", " + "machine=" + this.get_DB().dbQuote(H_permit.productname, "text", false) + ", " + "color=" + this.get_DB().dbQuote(H_permit.property, "text", false) + ", " + "planid=" + this.get_DB().dbQuote(H_permit.plan, "int", false) + ", ";

							if ("" != packetid) {
								sql += "packetid=" + this.get_DB().dbQuote(packetid, "int", false) + ", ";
							}

							sql += "pointstage=" + this.get_DB().dbQuote(this.getPointStage(H_order), "integer", false) + ", " + "employeecode=" + this.get_DB().dbQuote(H_permit.employeecode, "text", false) + ", " + "username=" + this.get_DB().dbQuote(H_permit.telusername, "text", false) + ", " + "memo=" + this.get_DB().dbQuote(H_teldetail.memo, "text", false) + ", " + "options=" + this.get_DB().dbQuote(H_permit.option, "text", false) + ", " + "buyselid=" + this.get_DB().dbQuote(H_order.buyselid, "integer", false) + ", " + "discounts=" + this.get_DB().dbQuote(H_permit.waribiki, "text", false) + ", " + "simcardno=" + this.get_DB().dbQuote(simcardno, "text", false) + ", " + "dummy_flg=" + this.get_DB().dbQuote(dummyflg, "bool", true) + ", " + "kousiflg=" + this.get_DB().dbQuote(kousiflg, "text", false) + ", " + "kousiptn=" + this.get_DB().dbQuote(H_permit.kousiid, "int", false) + ", " + "handflg=" + this.get_DB().dbQuote(false, "bool", true) + ", " + "webreliefservice=" + this.get_DB().dbQuote(H_order.webreliefservice, "text", false) + ", " + "text1=" + this.get_DB().dbQuote(H_teldetail.text1, "text", false) + ", " + "text2=" + this.get_DB().dbQuote(H_teldetail.text2, "text", false) + ", " + "text3=" + this.get_DB().dbQuote(H_teldetail.text3, "text", false) + ", " + "text4=" + this.get_DB().dbQuote(H_teldetail.text4, "text", false) + ", " + "text5=" + this.get_DB().dbQuote(H_teldetail.text5, "text", false) + ", " + "text6=" + this.get_DB().dbQuote(H_teldetail.text6, "text", false) + ", " + "text7=" + this.get_DB().dbQuote(H_teldetail.text7, "text", false) + ", " + "text8=" + this.get_DB().dbQuote(H_teldetail.text8, "text", false) + ", " + "text9=" + this.get_DB().dbQuote(H_teldetail.text9, "text", false) + ", " + "text10=" + this.get_DB().dbQuote(H_teldetail.text10, "text", false) + ", " + "text11=" + this.get_DB().dbQuote(H_teldetail.text11, "text", false) + ", " + "text12=" + this.get_DB().dbQuote(H_teldetail.text12, "text", false) + ", " + "text13=" + this.get_DB().dbQuote(H_teldetail.text13, "text", false) + ", " + "text14=" + this.get_DB().dbQuote(H_teldetail.text14, "text", false) + ", " + "text15=" + this.get_DB().dbQuote(H_teldetail.text15, "text", false) + ", " + "int1=" + this.get_DB().dbQuote(H_teldetail.int1, "int", false) + ", " + "int2=" + this.get_DB().dbQuote(H_teldetail.int2, "int", false) + ", " + "int3=" + this.get_DB().dbQuote(H_teldetail.int3, "int", false) + ", " + "int4=" + this.get_DB().dbQuote(H_teldetail.int4, "int", false) + ", " + "int5=" + this.get_DB().dbQuote(H_teldetail.int5, "int", false) + ", " + "int6=" + this.get_DB().dbQuote(H_teldetail.int6, "int", false) + ", " + "date1=" + this.get_DB().dbQuote(H_teldetail.date1, "date", false) + ", " + "date2=" + this.get_DB().dbQuote(H_teldetail.date2, "date", false) + ", " + "date3=" + this.get_DB().dbQuote(H_teldetail.date3, "date", false) + ", " + "date4=" + this.get_DB().dbQuote(H_teldetail.date4, "date", false) + ", " + "date5=" + this.get_DB().dbQuote(H_teldetail.date5, "date", false) + ", " + "date6=" + this.get_DB().dbQuote(H_teldetail.date6, "date", false) + ", " + "mail1=" + this.get_DB().dbQuote(H_teldetail.mail1, "text", false) + ", " + "mail2=" + this.get_DB().dbQuote(H_teldetail.mail2, "text", false) + ", " + "mail3=" + this.get_DB().dbQuote(H_teldetail.mail3, "text", false) + ", " + "url1=" + this.get_DB().dbQuote(H_teldetail.url1, "text", false) + ", " + "url2=" + this.get_DB().dbQuote(H_teldetail.url2, "text", false) + ", " + "url3=" + this.get_DB().dbQuote(H_teldetail.url3, "text", false) + ", " + "select1=" + this.get_DB().dbQuote(H_teldetail.select1, "text", false) + ", " + "select2=" + this.get_DB().dbQuote(H_teldetail.select2, "text", false) + ", " + "select3=" + this.get_DB().dbQuote(H_teldetail.select3, "text", false) + ", " + "select4=" + this.get_DB().dbQuote(H_teldetail.select4, "text", false) + ", " + "select5=" + this.get_DB().dbQuote(H_teldetail.select5, "text", false) + ", " + "select6=" + this.get_DB().dbQuote(H_teldetail.select6, "text", false) + ", " + "select7=" + this.get_DB().dbQuote(H_teldetail.select7, "text", false) + ", " + "select8=" + this.get_DB().dbQuote(H_teldetail.select8, "text", false) + ", " + "select9=" + this.get_DB().dbQuote(H_teldetail.select9, "text", false) + ", " + "select10=" + this.get_DB().dbQuote(H_teldetail.select10, "text", false) + ", " + "mail=" + this.get_DB().dbQuote(H_teldetail.mail, "text", false) + ", " + "fixdate=" + this.get_DB().dbQuote(nowdate, "date", false) + ", " + "division=" + this.get_DB().dbQuote(H_order.division, "int") + ", " + "extensionno=" + this.get_DB().dbQuote(extensionno, "text", false) + " " + "WHERE ";

							if (!!H_permit.telno) {
								telnosql = this.get_DB().dbQuote(H_permit.telno, "text", true);
							} else {
								telnosql = this.get_DB().dbQuote(H_sess.telno[H_permit.detail_sort], "text", true);
							}

							if ("" != telnosql) {
								sql += "telno=" + telnosql;
							} else {
								this.getOut().errorOut(5, "telno\u306E\u53D6\u5F97\u306B\u5931\u6557", false);
							}

							sql += "AND pactid=" + this.get_DB().dbQuote(H_order.pactid, "int", true) + " " + "AND carid=" + this.get_DB().dbQuote(H_order.carid, "int", true);
						} else //20110720
						//order_tbのkousiflgをtel_tbにように置き換え
						//sessionにsimcardnoがなければorder_tbから取得
						{
							sql = "INSERT INTO tel_tb (" + "pactid, postid, telno, telno_view, userid, carid, arid, cirid, machine, color, " + "planid, packetid, pointstage, employeecode, username, orderdate, memo, options, contractdate, " + "buyselid, discounts, simcardno, dummy_flg, mail, kousiflg, kousiptn, handflg, webreliefservice, " + "text1, text2, text3, text4, text5, text6, text7, text8, text9, text10, " + "text11, text12, text13, text14, text15, " + "int1, int2, int3, int4, int5, int6, date1, date2, date3, date4, date5, date6, " + "mail1, mail2, mail3, url1, url2, url3, " + "select1, select2, select3, select4, select5, select6, select7, select8, select9, select10, " + "recdate, fixdate, recogcode, pbpostcode, cfbpostcode, ioecode, coecode, " + "pbpostcode_first, pbpostcode_second, cfbpostcode_first, cfbpostcode_second, commflag, extensionno, division " + ") ";
							var H_date = this.makeInsertDateData(H_permit, H_sess, nowdate);
							kousiflg = this.getKousiFlg(H_permit);
							simcardno = this.getSimcardNo(H_sess, H_permit, "simno");

							if ("desig" == H_sess.expectup) {
								var expectdate = this.makeDateString(H_sess.expectdate);
							} else if (H_permit.expectdate) {
								expectdate = H_permit.expectdate.substr(0, 10);
							} else {
								expectdate = nowdate.substr(0, 10);
							}

							sql += "VALUES (" + this.get_DB().dbQuote(H_order.pactid, "integer", true) + ", " + this.get_DB().dbQuote(this.getPostID(), "integer", true) + ", " + this.get_DB().dbQuote(telno, "text", true) + ", " + this.get_DB().dbQuote(this.makeTelnoView(telno), "text", true) + ", " + this.get_DB().dbQuote(H_permit.userid, "integer", false) + ", " + this.get_DB().dbQuote(H_order.carid, "integer", true) + ", " + this.get_DB().dbQuote(arid, "integer", true) + ", " + this.get_DB().dbQuote(H_order.cirid, "integer", true) + ", " + this.get_DB().dbQuote(H_permit.productname, "text", false) + ", " + this.get_DB().dbQuote(H_permit.property, "text", false) + ", " + this.get_DB().dbQuote(H_permit.plan, "int", false) + ", " + this.get_DB().dbQuote(H_permit.packet, "int", false) + ", " + this.get_DB().dbQuote(this.getPointStage(H_order), "integer", false) + ", " + this.get_DB().dbQuote(H_permit.employeecode, "text", false) + ", " + this.get_DB().dbQuote(H_permit.telusername, "text", false) + ", " + this.get_DB().dbQuote(expectdate, "date", false) + ", " + this.get_DB().dbQuote(H_teldetail.memo, "text", false) + ", " + this.get_DB().dbQuote(H_permit.option, "text", false) + ", " + this.get_DB().dbQuote(H_date.expectdate, "date", false) + ", " + this.get_DB().dbQuote(H_order.buyselid, "integer", false) + ", " + this.get_DB().dbQuote(H_permit.waribiki, "text", false) + ", " + this.get_DB().dbQuote(simcardno, "text", false) + ", " + this.get_DB().dbQuote(dummyflg, "bool", true) + ", " + this.get_DB().dbQuote(H_teldetail.mail, "text", false) + ", " + this.get_DB().dbQuote(kousiflg, "text", false) + ", " + this.get_DB().dbQuote(H_permit.kousiid, "int", false) + ", " + this.get_DB().dbQuote(false, "bool", true) + ", " + this.get_DB().dbQuote(H_order.webreliefservice, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text1, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text2, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text3, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text4, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text5, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text6, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text7, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text8, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text9, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text10, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text11, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text12, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text13, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text14, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.text15, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.int1, "int", false) + ", " + this.get_DB().dbQuote(H_teldetail.int2, "int", false) + ", " + this.get_DB().dbQuote(H_teldetail.int3, "int", false) + ", " + this.get_DB().dbQuote(H_teldetail.int4, "int", false) + ", " + this.get_DB().dbQuote(H_teldetail.int5, "int", false) + ", " + this.get_DB().dbQuote(H_teldetail.int6, "int", false) + ", " + this.get_DB().dbQuote(H_teldetail.date1, "date", false) + ", " + this.get_DB().dbQuote(H_teldetail.date2, "date", false) + ", " + this.get_DB().dbQuote(H_teldetail.date3, "date", false) + ", " + this.get_DB().dbQuote(H_teldetail.date4, "date", false) + ", " + this.get_DB().dbQuote(H_teldetail.date5, "date", false) + ", " + this.get_DB().dbQuote(H_teldetail.date6, "date", false) + ", " + this.get_DB().dbQuote(H_teldetail.mail1, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.mail2, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.mail3, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.url1, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.url2, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.url3, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select1, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select2, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select3, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select4, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select5, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select6, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select7, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select8, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select9, "text", false) + ", " + this.get_DB().dbQuote(H_teldetail.select10, "text", false) + ", " + this.get_DB().dbQuote(nowdate, "date", false) + ", " + this.get_DB().dbQuote(nowdate, "date", false) + ", " + this.get_DB().dbQuote(H_order.recogcode, "text", false) + ", " + this.get_DB().dbQuote(H_order.pbpostcode, "text", false) + ", " + this.get_DB().dbQuote(H_order.cfbpostcode, "text", false) + ", " + this.get_DB().dbQuote(H_order.ioecode, "text", false) + ", " + this.get_DB().dbQuote(H_order.coecode, "text", false) + ", " + this.get_DB().dbQuote(H_order.pbpostcode_first, "text", false) + ", " + this.get_DB().dbQuote(H_order.pbpostcode_second, "text", false) + ", " + this.get_DB().dbQuote(H_order.cfbpostcode_first, "text", false) + ", " + this.get_DB().dbQuote(H_order.cfbpostcode_second, "text", false) + ", " + this.get_DB().dbQuote(H_order.commflag, "text", false) + ", " + this.get_DB().dbQuote(extensionno, "text", false) + ", " + this.get_DB().dbQuote(H_order.division, "int", false) + " " + ") ";
						}
				}
			}

		return sql;
	}

	getPointStage(H_order) {
		if (this.O_Set.car_docomo == H_order.carid) {
			if (this.O_order.type_new == H_order.ordertype) {
				if (1 == H_order.cirid) {
					return "2";
				} else {
					return "7";
				}
			} else if (true == (-1 !== this.O_order.A_cops.indexOf(H_order.ordertype))) {
				if (1 == H_order.cirid) {
					return "11";
				} else {
					return "12";
				}
			}
		}
	}

	getTelDetailInfo(orderid, sort) {
		var sql = "SELECT " + "telno, memo, mail, text1, text2, text3, text4, text5, " + "text6, text7, text8, text9, text10, " + "text11, text12, text13, text14, text15, " + "int1, int2, int3, int4, int5, int6, " + "date1, date2, date3, date4, date5, date6, " + "mail1, mail2, mail3, url1, url2, url3, " + "select1, select2, select3, select4, select5, select6, select7, select8, select9, select10, " + "receiptdate " + "FROM " + ShopOrderDetailModel.ORD_DET_TB + " " + "WHERE " + "orderid=" + orderid + " AND detail_sort=" + sort;
		return this.get_DB().queryRowHash(sql);
	}

	getReserveTelInfo(H_order, telno) {
		var sql = "SELECT pactid, postid, cirid, arid, planid, packetid, pointstage, buyselid, " + "options, discounts, simcardno, orderdate, contractdate, mail, userid, " + "recogcode, pbpostcode, pbpostcode_first, pbpostcode_second, " + "cfbpostcode, cfbpostcode_first, cfbpostcode_second, " + "ioecode, coecode " + "FROM " + "tel_tb " + "WHERE " + "telno=" + this.get_DB().dbQuote(telno, "text", true) + " AND pactid=" + this.get_DB().dbQuote(H_order.pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(H_order.carid, "int", true);
		return this.get_DB().queryRowHash(sql);
	}

	getTelManageOrderDate(H_info) {
		var carid = H_info.order.carid;

		if (this.O_order.type_mnp == H_info.order.ordertype) {
			if (this.O_order.st_prcfin > H_info.order.status) {
				carid = H_info.regist[0].formercarid;
			}
		}

		var sql = "SELECT telno, orderdate, contractdate " + "FROM " + "tel_tb " + "WHERE " + "carid=" + carid + " AND pactid=" + H_info.order.pactid + " AND telno IN ('" + this.setOrderTelno(H_info).join("', '") + "')";
		return this.get_DB().queryKeyAssoc(sql);
	}

	makeTelPropertyInfo(H_sess, H_permit, H_teldetail) {
		if (true == (undefined !== H_sess.telproperty)) {
			{
				let _tmp_9 = H_sess.telproperty[H_permit.detail_sort];

				for (var key in _tmp_9) {
					var val = _tmp_9[key];

					if (true == preg_match("/date[0-9]/", key)) {
						H_teldetail[key] = this.makeDateString(val, false);
					} else {
						H_teldetail[key] = val;
					}
				}
			}
		}
	}

	getOptionName(H_option, ordertype, carid) //オプションがないときはそのまま返す
	//新規はcheckbox
	{
		if (1 > H_option.length) {
			return H_option;
		}

		H_option = unserialize(H_option);
		var sql = "SELECT opid, opname, discountflg FROM option_tb WHERE opid in (" + Object.keys(H_option).join(", ") + ")";
		var H_name = this.get_DB().queryKeyAssoc(sql);
		var A_result = this.O_order.A_empty;

		if (this.O_order.type_new == ordertype || this.O_order.type_tpc == ordertype || this.O_order.type_mnp == ordertype) {
			for (var key in H_option) {
				var val = H_option[key];

				if ("1" == val) {
					A_result.push({
						opid: key,
						name: H_name[key].opname,
						flg: H_name[key].discountflg
					});
				}
			}
		} else if (this.O_Set.car_au == carid && this.O_order.type_shi == ordertype) {
			for (var key in H_option) {
				var val = H_option[key];

				if ("1" == val) {
					A_result.push({
						opid: key,
						name: H_name[key].opname,
						flg: H_name[key].discountflg
					});
				}
			}
		} else {
			for (var key in H_option) {
				var val = H_option[key];

				if ("put" == val) {
					A_result.push({
						opid: key,
						name: H_name[key].opname,
						stat: "\u3064\u3051\u308B",
						flg: H_name[key].discountflg
					});
				} else if ("remove" == val) {
					A_result.push({
						opid: key,
						name: H_name[key].opname,
						stat: "\u5916\u3059",
						flg: H_name[key].discountflg
					});
				}
			}
		}

		return A_result;
	}

	getServiceName(service) {
		if (undefined == service) {
			return service;
		}

		var H_service = unserialize(service);
		var sql = "SELECT opid, opname FROM service_tb WHERE opid IN (" + H_service.join(", ") + ")";
		H_service = this.get_DB().queryHash(sql);
		var A_result = this.O_order.A_empty;

		for (var val of Object.values(H_service)) {
			A_result.push(val);
		}

		return H_service;
	}

	getUnifyCircuitName(carid, H_regist) {
		if ("" == H_regist.arname && 100 == H_regist.arid) {
			switch (carid) {
				case this.O_Set.car_docomo:
					var arname = "\u4E2D\u592E";
					break;

				case this.O_Set.car_willcom:
					arname = "\u5168\u56FD";
					break;

				case this.O_Set.car_au:
					arname = "\u95A2\u6771";
					break;

				case this.O_Set.car_softbank:
					arname = "\u95A2\u6771\u30FB\u7532\u4FE1\u8D8A";
					break;

				case this.O_Set.car_emobile:
					arname = "Y!mobile(\u65E7EMOBILE)";
					break;

				case this.O_Set.car_smartphone:
					arname = "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3";
					break;

				case this.O_Set.car_other:
					arname = "\u305D\u306E\u4ED6";
					break;
			}
		} else {
			arname = H_regist.arname;
		}

		return arname;
	}

	unserializeArray(H_order, search, key) {
		if ("" == H_order[0][search]) {
			return undefined;
		}

		var H_telno = unserialize(H_order[0][search]);
		var H_result = this.O_order.A_empty;

		for (var val of Object.values(H_telno)) {
			if ("" != val) {
				H_result.push({
					[key]: val
				});
			}
		}

		return H_result;
	}

	checkLoanBuyType(buyselid) {
		var result = 0;

		if (undefined != buyselid) {
			var sql = "SELECT loanflg FROM buyselect_tb " + "WHERE buyselid=" + buyselid;
			result = this.get_DB().queryOne(sql);
		}

		return result;
	}

	makeDefaltsForm(H_g_sess, H_sess, H_info, H_price, H_mergedata, A_shopid) //付属品が足りないから足す
	//割賦対応の場合は頭金を入れる
	//表示する中で一番小さい受注明細番号を拾う
	//納品日が指定されていれば入れる
	//処理日が指定されていればいれる
	//購入日があれば入れておく
	//電話管理からとって来れなければ受注のを使う
	//電話管理ユーザー追加項目
	//csrfid設定
	{
		var nowtime = MtDateUtil.getNow();

		if ("" != H_info.order.order.paymentprice && undefined != H_info.order.order.paymentprice) {
			var termprice = H_info.order.order.paymentprice;
		} else //0だとこっち来ちゃう
			{
				if (0 === H_info.order.order.paymentprice) {
					termprice = H_info.order.order.paymentprice;
				} else {
					termprice = H_price[0].totalprice;
				}
			}

		var H_def = {
			termprice: termprice,
			pay_monthly_sum: H_info.order.machine[0].pay_monthly_sum,
			pay_frequency: H_info.order.machine[0].pay_frequency,
			pay_point: H_info.order.order.pay_point,
			settlement: H_info.order.order.settlement,
			status: H_info.order.order.status,
			slipno: H_info.order.order.slipno,
			message: H_info.order.order.message,
			shopnote: H_info.order.order.shopnote,
			endmail: 0,
			receipt: H_info.order.order.receipt,
			limit: H_sess.limit,
			smarttype: H_info.order.order.smartphonetype
		};
		var A_register = this.O_order.A_machinebuy;
		A_register.push(this.O_order.type_acc);

		if (true == (-1 !== A_register.indexOf(H_info.order.order.ordertype))) //価格表から取ってくる
			{
				if (1 == this.checkLoanBuyType(H_info.order.order.buyselid) && 1 != H_info.order.machine[0].pay_frequency) {
					var target = "downmoney";
				} else {
					target = "totalprice";
				}

				var i = 0;

				for (var key in H_price) //編集切替
				{
					var val = H_price[key];

					if (undefined == val || false == val) {
						H_def["price" + i] = 0;
					} else //端末のときは頭金を入れてね
						{
							if (false !== H_info.order.regist[key].machineflg) {
								H_def["price" + i] = val[target];
							} else {
								H_def["price" + i] = val.totalprice;
							}
						}

					if (undefined == H_info.order.order.transfer_type) {
						H_def["regcheck" + i] = 1;
					} else {
						if (true == (-1 !== A_shopid.indexOf(H_info.order.transto.gif[H_info.order.regist[key].detail_sort].toshopid))) {
							H_def["regcheck" + i] = 1;
						}
					}

					i++;
				}
			}

		if (undefined != H_info.order.machine) {
			{
				let _tmp_10 = H_info.order.machine;

				for (var key in _tmp_10) {
					var val = _tmp_10[key];

					if (is_null(val.kaiban_telno) == true) {
						if ("-" == val.telno_view) {
							var telno = "";
						} else {
							telno = val.telno_view;
						}

						H_def["telno" + key] = telno;
					} else {
						H_def["telno" + key] = val.kaiban_telno_view;
					}

					H_def["serial" + key] = val.serialno;
					H_def["simno" + key] = val.simcardno;
					H_def["area" + key] = val.arid;
					H_def["pay_startdate" + key].Y = val.pay_startdate.substr(0, 4);
					H_def["pay_startdate" + key].m = val.pay_startdate.substr(5, 2);
					H_def["extensionno" + key] = val.extensionno;

					if (undefined == H_info.order.order.transfer_type || H_g_sess.shopid == H_info.order.order.shopid) {
						H_def["indicheck" + key] = 1;
					} else {
						if (true == (-1 !== A_shopid.indexOf(H_info.order.transto.gif[val.detail_sort].toshopid))) {
							H_def["indicheck" + key] = 1;
						}
					}
				}
			}
		}

		if (false == (-1 !== this.O_order.A_plancourse.indexOf(H_info.order.order.ordertype)) || this.O_order.type_mis == H_info.order.order.ordertype || this.O_order.type_del == H_info.order.order.ordertype || this.O_order.type_tpc == H_info.order.order.ordertype || this.O_order.type_tcp == H_info.order.order.ordertype || this.O_order.type_tcc == H_info.order.order.ordertype) {
			i = 0;

			if (this.O_order.type_acc != H_info.order.order.ordertype) {
				for (var val of Object.values(H_info.order.machine)) {
					if (true == (undefined !== val.saleprice) && "" !== val.saleprice) {
						H_def["price" + i] = val.saleprice;
					} else if (true == val.machineflg) {
						if (true == (undefined !== val.sale_monthly_sum) && "" != val.sale_monthly_sum) {
							H_def["price" + i] = val.sale_monthly_sum;
						}
					} else if (false == val.machineflg && 0 === val.saleprice) {
						H_def["price" + i] = val.saleprice;
					}

					if (true == (undefined !== val.shoppoint)) {
						H_def["point" + i] = val.shoppoint;
					}

					if (true == (undefined !== val.shoppoint2)) {
						H_def["expoint" + i] = val.shoppoint2;
					}

					i++;
				}
			}

			for (var val of Object.values(H_info.order.acce)) {
				if (true == (undefined !== val.saleprice) && "" !== val.saleprice) {
					H_def["price" + i] = val.saleprice;
				} else if (false == val.machineflg && 0 === val.saleprice) {
					H_def["price" + i] = val.saleprice;
				}

				if (true == (undefined !== val.shoppoint)) {
					H_def["point" + i] = val.shoppoint;
				}

				if (true == (undefined !== val.shoppoint2)) {
					H_def["expoint" + i] = val.shoppoint2;
				}

				i++;
			}
		}

		var stockcnt = 0;

		for (var val of Object.values(H_mergedata)) {
			H_def["execno" + val.ordersubid + "_" + val.detail_sort] = 0;
			var defvalue = 0;

			if (true == val.stockflg) {
				defvalue = 1;
				stockcnt++;
			}

			H_def["stock" + val.ordersubid + "_" + val.detail_sort] = defvalue;
		}

		var workdetail = 0;

		for (var val of Object.values(H_info.order.workdetail)) {
			if (workdetail > val.sort) {
				workdetail = val.sort;
			}
		}

		if (undefined != H_info.order.machine[workdetail].deliverydate) {
			var H_tempdate = this.makeDateHash(H_info.order.machine[workdetail].deliverydate, true);
			H_def.deliverydate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d,
				H: H_tempdate.h
			};
		} else {
			H_tempdate = this.makeDateHash(this.makeNowTimeData(H_info.order.order.dateto, undefined), true);
			H_def.deliverydate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d,
				H: H_tempdate.h
			};
		}

		if (undefined != H_info.order.machine[workdetail].expectdate) {
			H_tempdate = this.makeDateHash(H_info.order.machine[workdetail].expectdate, true);
			H_def.expectdate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d,
				H: H_tempdate.h
			};
		} else if (undefined != H_info.order.order.finishdate) {
			H_tempdate = this.makeDateHash(H_info.order.order.finishdate, true);
			H_def.expectdate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d,
				H: H_tempdate.h
			};
		} else //端末が増えないようなものは希望納品日と同じにする
			{
				if (true == (-1 !== this.O_order.A_plancourse.indexOf(H_info.order.order.ordertype))) {
					H_tempdate = this.makeDateHash(this.makeNowTimeData(H_info.order.order.dateto, undefined), true);
				} else //指定されていなければ希望納品日の1日前
					{
						if (undefined != H_info.order.order.dateto) {
							H_tempdate = this.makeSpecifyDate(H_info.order.order.dateto, {
								y: 0,
								m: 0,
								d: -1
							}, false, true);
						} else {
							H_tempdate = this.makeDateHash(this.makeNowTimeData(undefined, undefined), true);
						}
					}

				H_def.expectdate = {
					Y: H_tempdate.y,
					m: H_tempdate.m,
					d: H_tempdate.d,
					H: H_tempdate.h
				};
			}

		if (undefined != H_info.order.machine[workdetail].registdate) {
			H_tempdate = this.makeDateHash(H_info.order.machine[workdetail].registdate, false);
			H_def.registdate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d
			};
		} else if (undefined != H_info.orderdate[H_info.order.machine[workdetail].telno].orderdate) {
			H_tempdate = this.makeDateHash(H_info.orderdate[H_info.order.machine[workdetail].telno].orderdate, false);
			H_def.registdate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d
			};
		} else {
			H_tempdate = this.makeDateHash(nowtime);
			H_def.registdate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d
			};
		}

		if (undefined != H_info.order.machine[workdetail].contractdate) //契約日があれば入れておく
			{
				H_tempdate = this.makeDateHash(H_info.order.machine[workdetail].contractdate, false);
				H_def.contractdate = {
					Y: H_tempdate.y,
					m: H_tempdate.m,
					d: H_tempdate.d
				};
			} else if (undefined != H_info.orderdate[H_info.order.machine[workdetail].telno].contractdate) {
			H_tempdate = this.makeDateHash(H_info.orderdate[H_info.order.machine[workdetail].telno].contractdate, false);
			H_def.contractdate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d
			};
		} else {
			H_tempdate = this.makeDateHash(nowtime);
			H_def.contractdate = {
				Y: H_tempdate.y,
				m: H_tempdate.m,
				d: H_tempdate.d
			};
		}

		if (true == (undefined !== H_info.property.data)) {
			{
				let _tmp_11 = H_info.property.data;

				for (var key in _tmp_11) {
					var val = _tmp_11[key];

					for (var ckey in val) {
						var cval = val[ckey];
						H_def[key + "_" + ckey] = cval;
					}
				}
			}
		}

		switch (this.getStockSelected(H_info)) {
			case "mixed":
				H_def.allreserve = "stcindi";
				break;

			case "regular":
				H_def.allreserve = "regular";
				break;

			case "reserve":
				H_def.allreserve = "reserve";
				break;

			default:
				H_def.allreserve = "stcindi";
				break;
		}

		if (this.checkShopAdminFuncId(H_g_sess.shopid, ShopOrderDetailModel.FNC_ORDERMAIL_SEND) || -1 !== H_info.user_auth.indexOf("fnc_order_finish_mail")) {
			H_def.endmail = 1;
		}

		if (-1 !== H_info.user_auth.indexOf("fnc_order_finish_mail_gray_out")) {
			H_def.endmail = 0;
		}

		for (var key in H_mergedata) {
			var value = H_mergedata[key];
			H_def.deliverydate_type[value.detail_sort] = value.deliverydate_type;
		}

		if (undefined !== _GET.csrfid) {
			H_def.csrfid = _GET.csrfid;
		}

		return H_def;
	}

	getStockSelected(H_info) {
		var regular;
		var reserve = regular = 0;
		{
			let _tmp_12 = H_info.order.machine;

			for (var key in _tmp_12) {
				var val = _tmp_12[key];

				if (true == val.stockflg) {
					reserve++;
				} else {
					regular++;
				}
			}
		}
		{
			let _tmp_13 = H_info.order.acce;

			for (var key in _tmp_13) {
				var val = _tmp_13[key];

				if (true == val.stockflg) {
					reserve++;
				} else {
					regular++;
				}
			}
		}

		if (0 == reserve && 0 != regular) {
			return "regular";
		} else if (0 != reserve && 0 == regular) {
			return "reserve";
		} else if (0 != reserve && 0 != regular) {
			return "mixed";
		}

		return false;
	}

	getOrderPrice(H_view, A_buyid, taxflg) {
		if (false == (-1 !== this.O_order.A_register.indexOf(H_view.order.ordertype))) {
			return undefined;
		}

		var O_price = new UserPriceModel(H_view.order.pactid, H_view.order.postid);
		var groupid = this.getShopGroupID(H_view.order.shopid);
		var subid = -1;

		if (0 < H_view.machine.length) {
			for (var val of Object.values(H_view.machine)) //前回と異なるidなら配列に価格を追加->端末を個別表示するために解除
			//if($val["ordersubid"] != $subid){
			//ベーシックor割賦回数が1回なら税抜き表示
			//if(1 == $taxflg){
			{
				H_price[val.detail_sort] = O_price.getNowPrice(val.productid, H_view.order.carid, H_view.order.ordertype, val.buytype1, val.buytype2, val.pay_frequency, H_view.order.buyselid, H_view.order.shopid, groupid);

				if (0 < H_price[val.detail_sort].totalprice) {
					H_price[val.detail_sort].totalprice = MtTax.priceWithoutTax(H_price[val.detail_sort].totalprice);
				}

				if (0 < H_price[val.detail_sort].downmoney) {
					H_price[val.detail_sort].downmoney = MtTax.priceWithoutTax(H_price[val.detail_sort].downmoney);
				}

				subid = val.ordersubid;
			}
		}

		if (0 < H_view.acce.length) {
			var buyselid = this.getBuyselID(H_view.order.carid);

			for (var val of Object.values(H_view.acce)) //付属品は常に税抜き表示
			{
				H_price[val.detail_sort] = O_price.getNowPrice(val.productid, H_view.order.carid, "A", 0, 0, 1, buyselid, H_view.order.shopid, groupid);

				if (0 < H_price[val.detail_sort].totalprice) {
					H_price[val.detail_sort].totalprice = MtTax.priceWithoutTax(H_price[val.detail_sort].totalprice);
				}
			}
		}

		return H_price;
	}

	getTaxoutAnserPrice(H_regist, taxflg) {
		for (var key in H_regist) {
			var val = H_regist[key];

			if (undefined != val.anspassprice && 0 < val.anspassprice) //if(1 == $taxflg){
				//					//$H_regist[$key]["anspassprice"] = $this->correctNumeric(($val["anspassprice"] / ($this->O_Set->excise_tax + 1)), "round");
				//					$H_regist[$key]["anspassprice"] = MtRounding::tweek($val["anspassprice"] / ($this->O_Set->excise_tax + 1));
				//				}
				//				elseif(false == $val["machineflg"]){
				//					//$H_regist[$key]["anspassprice"] = $this->correctNumeric(($val["anspassprice"] / ($this->O_Set->excise_tax + 1)), "round");
				//					$H_regist[$key]["anspassprice"] = MtRounding::tweek($val["anspassprice"] / ($this->O_Set->excise_tax + 1));
				//				}
				{
					H_regist[key].anspassprice = MtTax.priceWithoutTax(val.anspassprice);
				}
		}
	}

	getBuyselID(carid) {
		var sql = "SELECT buyselid FROM buyselect_tb " + "WHERE carid=" + carid + " AND buyselname='\u9078\u629E\u306A\u3057'";
		return this.get_DB().queryOne(sql);
	}

	getShopGroupID(shopid) {
		var sql = "SELECT groupid FROM shop_tb WHERE shopid=" + shopid;
		return this.get_DB().queryOne(sql);
	}

	makeTelnoView(telno) {
		var result = telno;

		if ("" != telno && 11 == telno.length) {
			var first = telno.substr(0, 3);
			var second = telno.substr(3, 4);
			var third = telno.substr(7, 4);
			result = first + "-" + second + "-" + third;
		}

		return result;
	}

	updateStockTable(H_g_sess, H_sess, H_order, flg = false) //新規、買い増し、MNP、移行だけ
	{
		if (false == (-1 !== [this.O_order.type_new, this.O_order.type_chn, this.O_order.type_mnp, this.O_order.type_shi].indexOf(H_order.order.ordertype))) {
			return false;
		}

		if (false == this.checkProcFinish(H_order.order.status, H_sess.status)) {
			return false;
		}

		var msg = "";
		var sql = "SELECT detail_sort, toshopid, transfer_status " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + H_order.order.orderid + " " + "ORDER BY " + "transfer_level";
		var H_trans = this.get_DB().queryKeyAssoc(sql);
		{
			let _tmp_14 = H_order.machine;

			for (var key in _tmp_14) {
				var val = _tmp_14[key];

				if (undefined != val.productid && true == this.checkEndSubStatus(H_sess.status, val.substatus, "proc")) //振替えられてたら振替ステータスを見る
					//削除実行
					{
						var shopid = H_order.order.shopid;

						if (true == (undefined !== H_trans[val.detail_sort])) {
							if (H_trans[val.detail_sort.transfer_status] == "both") {
								shopid = H_trans[val.detail_srot.toshopid];
							}
						}

						var H_target = this.getStockTarget(H_sess, val);
						msg += this.execStockManagementProc(val, H_target, shopid, flg);
					} else {
					H_target = this.getStockTarget(H_sess, val);

					if (undefined == val.productid) {
						msg += val.productname + "\u7BA1\u7406\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u5728\u5EAB\u7BA1\u7406\u51E6\u7406\u306F\u884C\u3044\u307E\u305B\u3093<br>";
					}
				}
			}
		}
		{
			let _tmp_15 = H_order.acce;

			for (var key in _tmp_15) {
				var val = _tmp_15[key];

				if (undefined != val.productid && true == this.checkEndSubStatus(H_sess.status, val.substatus, "proc")) //振替えられてたら振替ステータスを見る
					//削除実行
					{
						shopid = H_order.order.shopid;

						if (true == (undefined !== H_trans[val.detail_sort])) {
							if (H_trans[val.detail_sort.transfer_status] == "both") {
								shopid = H_trans[val.detail_srot.toshopid];
							}
						}

						H_target = this.getStockTarget(H_sess, val);
						msg += this.execStockManagementProc(val, H_target, shopid, flg);
					} else {
					H_target = this.getStockTarget(H_sess, val);

					if (undefined == val.productid) {
						msg += val.productname + "\u7BA1\u7406\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u5728\u5EAB\u7BA1\u7406\u51E6\u7406\u306F\u884C\u3044\u307E\u305B\u3093<br>";
					}
				}
			}
		}
		return msg;
	}

	execStockManagementProc(H_info, H_target, shopid, flg) {
		if (undefined != H_info.productid && undefined != H_info.branchid) //実処理はここから
			{
				var O_prod = new ShopProductModel();
				this.get_DB().beginTransaction();
				var result = O_prod.updateInsertStockQuant(H_info.productid, H_info.branchid, shopid, H_target.layaway, H_target.layaway, 1, H_target.stock);

				if (true == flg) {
					this.get_DB().rollback();
					var msg = "debag mode";
				} else if (false == result) {
					this.get_DB().rollback();
					msg = H_info.productname + "\u306E\u5728\u5EAB\u7BA1\u7406\u306E\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002<br>";
				} else {
					this.get_DB().commit();
				}
			} else {
			msg += H_info.productname + "\u306E\u5546\u54C1\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u306A\u3044\u305F\u3081\u3001\u5728\u5EAB\u7BA1\u7406\u51E6\u7406\u306F\u884C\u3044\u307E\u305B\u3093<br>";
		}

		return msg;
	}

	getStockTarget(H_sess, H_info) {
		if (true == (undefined !== H_sess.allproc)) {
			if (true == (undefined !== H_sess.allreserve)) {
				H_target.layaway = -1;
				H_target.stock = 0;
			} else {
				H_target.layaway = 0;
				H_target.stock = -1;
			}
		} else {
			if (true == (undefined !== H_sess.stock[H_info.detail_sort].sort)) {
				H_target.layaway = -1;
				H_target.stock = 0;
			} else {
				H_target.layaway = 0;
				H_target.stock = -1;
			}
		}

		return H_target;
	}

	checkProcFinish(nowstat, exestat) //出荷済み以下orすでに出荷済み以降なら処理しない
	{
		if (+(exestat <= this.O_order.st_prcfin) || +(nowstat > this.O_order.st_prcfin)) {
			return false;
		}

		if (this.O_order.st_delete <= exestat) {
			return false;
		}

		return true;
	}

	checkEndStatus(chgstat, nowstat, mode = "ship") {
		var result = false;

		if ("ship" == mode) {
			if (this.O_order.st_sub_shipfin <= +chgstat && this.O_order.st_sub_shipfin > +nowstat) {
				result = true;
			}
		} else if ("proc" == mode) {
			if (this.O_order.st_sub_prcfin <= +chgstat && this.O_order.st_sub_prcfin > +nowstat) {
				result = true;
			}
		}

		return result;
	}

	checkEndOutStatus(status, compare = undefined) {
		if (undefined == compare) {
			if (this.O_order.st_sub_shipfin <= status) {
				return true;
			}
		} else {
			if (compare <= status) {
				return true;
			}
		}

		return false;
	}

	checkEndSubStatus(chgstat, nowstat, mode = "ship") {
		var result = false;

		if ("ship" == mode) {
			if (this.O_order.st_sub_shipfin <= +chgstat && this.O_order.st_sub_shipfin > +nowstat && this.O_order.st_cancel != +chgstat) {
				result = true;
			}
		} else if ("proc" == mode) {
			if (this.O_order.st_sub_prcfin <= +chgstat && this.O_order.st_sub_prcfin > +nowstat && this.O_order.st_cancel != +chgstat) {
				result = true;
			}
		} else if ("complete" == mode) {
			if (this.O_order.st_complete <= +chgstat && this.O_order.st_complete > +nowstat) {
				result = true;
			}
		}

		return result;
	}

	checkUserInputTelno(H_sess, H_order) //受注詳細内に重複した番号がなければ、tel_tbともチェック
	{
		if (false == this.checkEndSubStatus(H_sess.status, H_order.order.status, "proc")) {
			return result;
		}

		var result = "";
		var A_telno = this.O_order.A_empty;

		if (1 > H_sess.telno.length) {
			return result;
		}

		for (var val of Object.values(H_sess.telno)) {
			A_telno.push(val.replace(/-/g, ""));
		}

		A_telno = array_count_values(A_telno);

		for (var key in A_telno) {
			var val = A_telno[key];

			if ("" != key) {
				if (1 < val) {
					result = "\u96FB\u8A71\u756A\u53F7\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002\u51E6\u7406\u5185\u5BB9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044";
					return result;
				}
			}
		}

		if ("" == result) {
			var A_key = Object.keys(A_telno);
			var sql = "SELECT telno FROM tel_tb " + "WHERE carid=" + H_order.order.carid + " AND pactid=" + H_order.order.pactid + " AND telno IN ('" + A_key.join("', '") + "')";
			var H_dup = this.get_DB().queryCol(sql);

			for (var val of Object.values(H_dup)) {
				result += "\u65E2\u306B\u540C\u3058\u96FB\u8A71\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(" + val + ")";
			}
		}

		return result;
	}

	checkUserInputSerialno(H_sess, H_order) {
		var result = "";

		if (false == this.checkEndSubStatus(H_sess.status, H_order.order.status, "proc")) {
			return result;
		}

		var A_serno = A_trels = this.O_order.A_empty;

		if (1 > H_sess.serial.length) {
			return result;
		}

		{
			let _tmp_16 = H_sess.serial;

			for (var key in _tmp_16) {
				var val = _tmp_16[key];
				A_serno.push(val);
				A_trels.push([val, H_order.machine[key].telno]);
			}
		}
		result = this.checkSerialRegulation(A_trels, H_order.order);

		if ("" != result) {
			return result;
		}

		A_serno = array_count_values(A_serno);

		for (var key in A_serno) {
			var val = A_serno[key];

			if ("" != key) {
				if (1 < val) {
					if (!!val) {
						result = "\u88FD\u9020\u756A\u53F7\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002\u51E6\u7406\u5185\u5BB9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044";
						return result;
					}
				}
			}
		}

		if ("" == result) //登録済みのassetsnoと結びついた電話番号を取得
			{
				var A_key = this.O_order.A_empty;

				for (var key in A_serno) {
					var val = A_serno[key];
					A_key.push(String(key));
				}

				var sql = "SELECT a.assetsno, count(a.assetsno), r.telno FROM assets_tb a " + "LEFT JOIN tel_rel_assets_tb r ON a.assetsid=r.assetsid " + "WHERE a.assetstypeid=1" + " AND a.pactid=" + H_order.order.pactid + " AND a.assetsno IN ('" + A_key.join("', '") + "') " + "GROUP BY a.assetsno, r.telno";
				var H_dup = this.get_DB().queryHash(sql);

				for (var val of Object.values(H_dup)) //assetsnoが登録済みならエラー。ただし、その他は除く
				{
					if (1 <= val.count && "M" != H_order.order.ordertype) {
						result += "\u65E2\u306B\u540C\u3058\u88FD\u9020(\u7AEF\u672B\u7BA1\u7406)\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(" + val.assetsno + ")";
					} else if (1 <= val.count) //登録済みのassetsnoと結びついている番号が他の電話のとき、エラー
						{
							for (var checkvalue of Object.values(A_trels)) {
								if (checkvalue[0] == val.assetsno) {
									if (checkvalue[1] != val.telno) {
										result += "\u65E2\u306B\u540C\u3058\u88FD\u9020(\u7AEF\u672B\u7BA1\u7406)\u756A\u53F7\u304C\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u3059(" + val.assetsno + ")";
									}
								}
							}
						}
				}
			}

		return result;
	}

	checkUserInputSimno(H_sess, H_order) {
		var result = "";
		var A_simno = this.O_order.A_empty;

		if (false == this.checkEndSubStatus(H_sess.status, H_order.order.status, "proc")) {
			return result;
		}

		if (1 > H_sess.simno.length) {
			return result;
		}

		for (var val of Object.values(H_sess.simno)) {
			A_simno.push(val);
		}

		result = this.checkSimnoDigit(A_simno, H_order.order);
		return result;
	}

	checkInputExpectDate(H_sess, H_order) {
		var mac_exp_flg = false;
		var result = "";

		if (true == this.checkEndSubStatus(H_sess.status, H_order.order.status, "proc")) {
			if (this.O_order.type_acc != H_order.order.ordertype) {
				if (this.O_order.A_empty != H_order.machine) {
					for (var val of Object.values(H_order.machine)) {
						if (undefined == val.expectdate) {
							mac_exp_flg = true;
						} else if ("1999-01-01 00:00:00" == val.expectdate) {
							mac_exp_flg = true;
						}
					}
				}
			}

			if (this.O_order.A_empty != H_order.acce) {
				for (var val of Object.values(H_order.acce)) {
					if (undefined == val.expectdate) {
						mac_exp_flg = true;
					} else if ("1999-01-01 00:00:00" == val.expectdate) {
						mac_exp_flg = true;
					}
				}
			}

			if (false == (undefined !== H_sess.expectup) || "desig" != H_sess.expectup) {
				if (true == mac_exp_flg) {
					result += "\u51E6\u7406\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
				}
			}

			if (H_sess.expectup == "undecid") {
				result += "\u51E6\u7406\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
			}
		}

		return result;
	}

	checkInputDeliveryDate(H_sess, H_order) {
		var A_ordertype = [this.O_order.type_pln, this.O_order.type_opt, this.O_order.type_dsc, this.O_order.type_blp, this.O_order.type_del, this.O_order.type_mis, this.O_order.type_tpc, this.O_order.type_tcp, this.O_order.type_tcc];

		if (true == (-1 !== A_ordertype.indexOf(H_order.order.ordertype))) {
			return "";
		}

		var mac_del_flg = false;
		var result = "";

		if (true == this.checkEndSubStatus(H_sess.status, H_order.order.status, "proc")) {
			if (this.O_order.type_acc != H_order.order.ordertype) {
				if (this.O_order.A_empty != H_order.machine) {
					for (var val of Object.values(H_order.machine)) {
						if (undefined == val.deliverydate) {
							mac_del_flg = true;
						} else if ("1999-01-01 00:00:00" == val.deliverydate) {
							mac_del_flg = true;
						}
					}
				}
			}

			if (this.O_order.A_empty != H_order.acce) {
				for (var val of Object.values(H_order.acce)) {
					if (undefined == val.deliverydate) {
						mac_del_flg = true;
					} else if ("1999-01-01 00:00:00" == val.deliverydate) {
						mac_del_flg = true;
					}
				}
			}

			if (false == (undefined !== H_sess.endsel) || "specifies" != H_sess.endsel) {
				if (true == mac_del_flg) {
					result += "\u7D0D\u54C1\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
				}
			}

			if (H_sess.endsel == "after") {
				result += "\u7D0D\u54C1\u65E5\u304C\u5165\u529B\u3055\u308C\u3066\u3044\u307E\u305B\u3093";
			}
		}

		return result;
	}

	makeInsertDateData(H_permit, H_sess, nowtime) {
		var registdate = this.makeDateString(H_sess.registdate);

		if ("" != registdate) {
			H_date.registdate = registdate;
		} else if (undefined == H_permit.registdate) {
			H_date.registdate = nowtime;
		} else {
			H_date.registdate = H_permit.registdate;
		}

		var contractdate = this.makeDateString(H_sess.contractdate);

		if ("" != contractdate) {
			H_date.contractdate = contractdate;
		} else if (undefined == H_permit.contractdate) {
			H_date.contractdate = nowtime;
		} else {
			H_date.contractdate = H_permit.contractdate;
		}

		var expectdate = this.makeDateString(H_sess.expectdate, true);

		if ("" != expectdate) {
			H_date.expectdate = expectdate;
		} else if (undefined == H_permit.expectdate) {
			H_date.expectdate = nowtime;
		} else {
			H_date.expectdate = H_permit.expectdate;
		}

		var deliverydate = this.makeDateString(H_sess.deliverydate, true);

		if ("" != deliverydate) {
			H_date.deliverydate = deliverydate;
		} else if (undefined == H_permit.deliverydate) {
			H_date.deliverydate = this.makeSpecifyDate(nowtime, {
				y: 0,
				m: 0,
				d: 1
			}, true, false);
		} else {
			H_date.deliverydate = H_permit.deliverydate;
		}

		return H_date;
	}

	getKousiFlg(H_permit) {
		if ("on" == H_permit.kousiradio) {
			var kousiflg = "0";
		} else if ("off" == H_permit.kousiradio) {
			kousiflg = "1";
		}

		return kousiflg;
	}

	getSimcardNo(H_sess, H_permit, target) {
		var simcard = undefined;
		simcard = H_sess[target][H_permit.detail_sort];

		if (undefined == simcard && false == Array.isArray(H_sess[target])) {
			simcard = H_sess[target];
		}

		if (undefined == simcard) {
			simcard = H_permit[target];
		}

		return simcard;
	}

	getStartDate(H_sess, H_permit, target) //日付はSESSIONから取ってくると配列になってるので成形
	{
		var startdate = H_sess[target];

		if (true == Array.isArray(startdate)) //空のときは現在時刻を入れる
			{
				if ("" != startdate.Y && "" != startdate.m) {
					var str = startdate.Y + "-";
					str += str_pad(startdate.m, 2, "0", STR_PAD_LEFT) + "-";
					str += "01 00:00:00";
					startdate = str;
				} else {
					startdate = false;
				}
			}

		if (false == startdate) {
			startdate = H_permit[target];
		}

		return startdate;
	}

	makeOrderLogSQL(H_permit, H_order, A_str, nowtime) //$sql = "INSERT INTO mt_order_regist_tel_tb ".
	//			"(orderid, detail_sort, shopid, pactid, postid, ordertype, telno, carid, content, recdate) ".
	//			"VALUES (".
	//				$this->get_DB()->dbQuote($H_order["orderid"], "int", true). ", ".
	//				$this->get_DB()->dbQuote(0, "int", true). ", ".
	//				$this->get_DB()->dbQuote($H_order["shopid"], "int", true). ", ".
	//				$this->get_DB()->dbQuote($H_order["pactid"], "int", true). ", ".
	//				$this->get_DB()->dbQuote($H_order["postid"], "int", false). ", ".
	//				$this->get_DB()->dbQuote($H_order["ordertype"], "text", true). ", ".
	//				$this->get_DB()->dbQuote($H_permit["telno"], "text", false). ", ".
	//				$this->get_DB()->dbQuote($H_order["carid"], "int", false). ", ".
	//				$this->get_DB()->dbQuote($str, "text", false). ", ".
	//				$this->get_DB()->dbQuote($nowtime, "date", false).
	//			")";
	{
		var str = "";

		for (var val of Object.values(A_str[H_order.orderid])) {
			if (undefined != val) {
				str += val + "\n";
			}
		}

		if (preg_match("/order_detail.php$/", _SERVER.PHP_SELF)) {
			var category = "detail";
		} else if (preg_match("/substatus.php$/", _SERVER.PHP_SELF)) {
			category = "sub";
		} else if (preg_match("//", _SERVER.PHP_SELF)) {
			category = "bulk";
		} else {
			category = "unknown";
		}

		var sql = "INSERT INTO order_dummy_tb " + "(uniqueid, content, status, category, pactid, postid, carid, telno, shopid, value, recdate) " + "VALUES (" + this.get_DB().dbQuote(H_order.orderid, "int", true) + ", " + this.get_DB().dbQuote(category, "text", true) + ", " + this.get_DB().dbQuote(H_order.status, "int", true) + ", " + this.get_DB().dbQuote(H_order.ordertype, "text", true) + ", " + this.get_DB().dbQuote(H_order.pactid, "int", true) + ", " + this.get_DB().dbQuote(H_order.postid, "int", false) + ", " + this.get_DB().dbQuote(H_order.carid, "int", false) + ", " + this.get_DB().dbQuote(H_permit.telno, "text", false) + ", " + this.get_DB().dbQuote(H_order.shopid, "int", true) + ", " + this.get_DB().dbQuote(str, "text", false) + ", " + this.get_DB().dbQuote(nowtime, "date", false) + ")";
		return sql;
	}

	makeOrderErrLogSQL(H_info) {
		var sql = "INSERT INTO mt_order_regist_tel_tb " + "(orderid, detail_sort, shopid, pactid, postid, ordertype, telno, carid, content, recdate) " + "VALUES (" + this.get_DB().dbQuote(H_info.order.orderid, "int", true) + ", " + this.get_DB().dbQuote(0, "int", true) + ", " + this.get_DB().dbQuote(H_info.order.shopid, "int", true) + ", " + this.get_DB().dbQuote(H_info.order.pactid, "int", true) + ", " + this.get_DB().dbQuote(H_info.order.postid, "int", false) + ", " + this.get_DB().dbQuote(H_info.order.ordertype, "text", true) + ", " + this.get_DB().dbQuote(H_info.machine[0].telno, "text", false) + ", " + this.get_DB().dbQuote(H_info.carid, "int", false) + ", " + this.get_DB().dbQuote(this.errsql, "text", false) + ", " + this.get_DB().dbQuote(MtDateUtil.getNow(), "date", false) + ")";
		this.get_DB().beginTransaction();

		if (true == PEAR.isError(this.get_DB().exec(sql, false))) {
			this.get_DB().rollback();
		} else {
			this.get_DB().commit();
		}
	}

	makeUniqueArray(H_info) {
		if (0 < H_info.length) {
			var A_id = this.O_order.A_empty;
			var A_result = this.O_order.A_empty;

			for (var val of Object.values(H_info)) {
				if (false == (-1 !== A_id.indexOf(val.orderid))) {
					A_id.push(val.orderid);
					A_result.push(val);
				}
			}
		} else {
			A_result = H_info;
		}

		return A_result;
	}

	checkUnifyShop(H_g_sess, shopid, parent = "parent") {
		if (this.O_order.A_empty == H_g_sess || !Array.isArray(H_g_sess)) {
			return false;
		} else {
			var O_menu = new ShopOrderMenuModel(O_db0, H_g_sess);
		}

		return O_menu.checkUnifyShop(shopid, parent);
	}

	getParentShopID(shopid) {
		var sql = "SELECT " + "sup.parentshop, shop.name " + "FROM " + "support_shop_tb sup " + "INNER JOIN shop_tb shop ON sup.parentshop=shop.shopid " + "WHERE " + "sup.childshop=" + shopid;
		var H_result = this.get_DB().queryKeyAssoc(sql);

		if (undefined != H_result) {
			return H_result;
		}

		return false;
	}

	getChildShopID(H_g_sess, flg, opt = true) {
		var O_menu = new ShopOrderMenuModel(O_db0, H_g_sess);
		return O_menu.getChildShopID(H_g_sess.shopid, H_g_sess.shopname, flg, opt);
	}

	getSecondRootAuth(pactid) {
		var result = false;
		var O_func = new FuncModel();
		var H_func = O_func.getPactFunc(pactid);

		if (true == (-1 !== H_func.indexOf(ShopOrderDetailModel.FNC_SECROOT))) {
			result = true;
		}

		return result;
	}

	getExecDate(H_order, H_permit, nowtime) {
		var O_tel = new TelModel();
		var H_date = this.makeDateHash(nowtime);
		var date = this.makeDateHash(O_tel.getAcquittanceDate(H_order.pactid, H_order.carid, H_permit.telno, H_date));
		nowtime = mktime(0, 0, 0, H_date.m, H_date.d, H_date.y);
		var tempdate = mktime(0, 0, 0, date.m, date.d, date.y);
		date = getdate(tempdate);

		if (nowtime > tempdate) {
			date = getdate(nowtime);
		} else if ("\u4E00\u62EC\u652F\u6255" == H_order.fee) {
			date = getdate(nowtime);
		}

		date = this.makeDateString(this.makeDateHash(date.year + "-" + str_pad(date.mon, 2, "0", STR_PAD_LEFT) + "-" + str_pad(date.mday, 2, "0", STR_PAD_LEFT)));
		return date;
	}

	getNotLoanBuyselID() {
		var sql = "SELECT buyselid FROM buyselect_tb WHERE loanflg IN (0, 2)";
		return this.get_DB().queryCol(sql);
	}

	getTaxFlag(H_order, H_machine, A_id) {
		var flag = 0;

		if (1 == H_machine[0].pay_frequency || true == (-1 !== A_id.indexOf(H_order.buyselid))) {
			flag = 1;
		}

		return flag;
	}

	getPostCode(shopid) {
		var sql = "SELECT " + "postcode " + "FROM " + "shop_tb " + "WHERE " + "shopid=" + shopid;
		return this.get_DB().queryOne(sql);
	}

	calcUseTerm(H_order) {
		if (undefined == H_order.order.machine || this.O_order.type_new == H_order.order.order.ordertype) {
			return this.O_order.A_empty;
		}

		var nowtime = MtDateUtil.getNow();
		{
			let _tmp_17 = H_order.order.machine;

			for (var key in _tmp_17) {
				var val = _tmp_17[key];
				var H_start = this.makeDateHash(H_order.orderdate[val.telno].orderdate);

				for (var cval of Object.values(H_start)) {
					if (false == cval) {
						H_start = this.makeDateHash(nowtime);
						break;
					}
				}

				var H_now = this.makeDateHash(nowtime);
				var year = H_now.y - H_start.y;
				var month = H_now.m - H_start.m;

				if (0 > month) {
					year--;
					month = 12 + month;
				} else if (12 < month) {
					year++;
				}

				H_order.order.machine[key].useterm = String(year * 12 + month);
			}
		}
	}

	getExciseTax() //return $this->O_Set->excise_tax;
	{
		return MtTax.getTaxRate() / 100;
	}

	writeShopMngLog(H_sess, mode = "update") //振替えられてる場合、メインステータスないのよ。
	{
		if ("download" != mode) {
			if (true == (undefined !== H_sess.SELF.status)) {
				var status = this.get_DB().queryOne("SELECT forshop FROM mt_status_tb WHERE status=" + H_sess.SELF.status);
			} else {
				status = this.get_DB().queryOne("SELECT forshop FROM mt_status_tb stat INNER JOIN " + ShopOrderDetailModel.ORD_TB + " ord ON stat.status=ord.status WHERE ord.orderid=" + H_sess[ShopOrderDetailModel.PUB].orderid);
			}
		}

		if ("update" == mode) {
			var comment = "\u53D7\u6CE8\u756A\u53F7\uFF1A" + H_sess[ShopOrderDetailModel.PUB].orderid + "\u3092" + status + "\u306B\u66F4\u65B0";

			if ("1" == H_sess.SELF.endmail) {
				comment += " (mail\u9001)";
			}
		} else if ("reading" == mode) {
			comment = "\u53D7\u6CE8\u756A\u53F7\uFF1A" + H_sess[ShopOrderDetailModel.PUB].orderid + "\u3092\u95B2\u89A7";
		} else if ("print" == mode) {
			comment = "\u53D7\u6CE8\u756A\u53F7\uFF1A" + H_sess[ShopOrderDetailModel.PUB].orderid + "\u306E\u5370\u5237\u753B\u9762\u3092\u8868\u793A";
		} else if ("download" == mode) {
			comment = "\u8CA9\u58F2\u5E97ID\uFF1A" + this.O_Sess.shopid + "\u306E\u53D7\u6CE8\u4E00\u89A7\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9";
		} else if ("update_kaiban" == mode) {
			comment = H_sess.shop_mng_comment;
		}

		var H_data = {
			shopid: this.O_Sess.shopid,
			groupid: this.O_Sess.groupid,
			memid: this.O_Sess.memid,
			name: this.O_Sess.personname,
			postcode: this.O_Sess.postcode,
			comment1: this.O_Sess.memid,
			comment2: comment,
			kind: "MTOrder",
			type: "\u53D7\u6CE8\u66F4\u65B0",
			joker_flg: this.O_Sess.joker
		};
		this.getOut().writeShopMngLog(H_data);
	}

	convSecondRootOverWrite(H_info) {
		if (false == H_info.flg.secondroot) {
			return undefined;
		}

		var O_post = new Post();
		var postid = O_post.getTargetRootPostId(H_info.order.order.pactid, H_info.order.order.postid, "post_relation_tb", 2);
		var sql = "SELECT postname FROM post_tb WHERE postid=" + postid;
		H_info.order.order.compname = this.get_DB().queryOne(sql);
	}

	checkDeleteTelPact(H_order) //基本は削除する
	//H_order.is_not_delete_telがtrueなら削除しない
	{
		var result = true;

		if (H_order.is_not_delete_tel === true) //削除しない
			{
				result = false;
			}

		return result;
	}

	addDispDetailSwitch(H_g_sess, H_view, A_shopid) //付属品もね
	{
		{
			let _tmp_18 = H_view.machine;

			for (var key in _tmp_18) //振替えてないなら表示
			{
				var val = _tmp_18[key];

				if (undefined == H_view.order.transfer_type) {
					H_view.machine[key].registerflg = true;
					H_view.machine[key].registergif = "";
				} else if (true == (-1 !== A_shopid.indexOf(H_view.order.shopid))) {
					H_view.machine[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.machine[key].registgif = "both";
					} else {
						H_view.machine[key].registgif = "work";
					}
				} else if (H_g_sess.shopid == H_view.transto.gif[val.detail_sort].toshopid) {
					H_view.machine[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.machine[key].registgif = "both";
					} else {
						H_view.machine[key].registgif = "work";
					}
				} else if (H_g_sess.shopid == H_view.transfrom.gif[val.detail_sort].fromshopid) {
					H_view.machine[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.machine[key].registgif = "both";
					} else {
						H_view.machine[key].registgif = "work";
					}
				} else if (true == (-1 !== A_shopid.indexOf(H_view.transto.gif[val.detail_sort].toshopid))) {
					H_view.machine[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.machine[key].registgif = "both";
					} else {
						H_view.machine[key].registgif = "work";
					}
				} else if (true == (-1 !== A_shopid.indexOf(H_view.transfrom.gif[val.detail_sort].fromshopid))) {
					H_view.machine[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.machine[key].registgif = "both";
					} else {
						H_view.machine[key].registgif = "work";
					}
				} else {
					H_view.machine[key].registerflg = false;
					H_view.machine[key].registergif = "";
				}
			}
		}
		{
			let _tmp_19 = H_view.acce;

			for (var key in _tmp_19) //振替えてないなら表示
			{
				var val = _tmp_19[key];

				if (undefined == H_view.order.transfer_type) {
					H_view.acce[key].registerflg = true;
					H_view.acce[key].registergif = "";
				} else if (true == (-1 !== A_shopid.indexOf(H_view.order.shopid))) {
					H_view.acce[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.acce[key].registgif = "both";
					} else {
						H_view.acce[key].registgif = "work";
					}
				} else if (H_g_sess.shopid == H_view.transto.gif[val.detail_sort].toshopid) {
					H_view.acce[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.acce[key].registgif = "both";
					} else {
						H_view.acce[key].registgif = "work";
					}
				} else if (H_g_sess.shopid == H_view.transfrom.gif[val.detail_sort].fromshopid) {
					H_view.acce[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.acce[key].registgif = "both";
					} else {
						H_view.acce[key].registgif = "work";
					}
				} else if (true == (-1 !== A_shopid.indexOf(H_view.transto.gif[val.detail_sort].toshopid))) {
					H_view.acce[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.acce[key].registgif = "both";
					} else {
						H_view.acce[key].registgif = "work";
					}
				} else if (true == (-1 !== A_shopid.indexOf(H_view.transfrom.gif[val.detail_sort].fromshopid))) {
					H_view.acce[key].registerflg = true;

					if ("both" == val.transfer_status) {
						H_view.acce[key].registgif = "both";
					} else {
						H_view.acce[key].registgif = "work";
					}
				} else {
					H_view.acce[key].registerflg = false;
					H_view.acce[key].registergif = "";
				}
			}
		}
	}

	setTargetOrderShopID(H_view, A_shopid, shopid) {
		var temp = this.get_DB().queryOne("SELECT shopid FROM " + ShopOrderDetailModel.ORD_TB + " WHERE orderid=" + H_view.order.orderid);

		if (true == (undefined !== A_shopid[temp])) {
			return shopid;
		}

		return shopid;
	}

	getTransferImage(type, status, mode) //全体
	{
		if ("all" == type) //売上とも
			{
				if ("both" == status) {
					if ("in" == mode) {
						var result = "IN4";
					} else if ("out" == mode) {
						result = "OUT2";
					}
				} else if ("work" == status) {
					if ("in" == mode) {
						result = "IN3";
					} else if ("out" == mode) {
						result = "OUT1";
					}
				}
			} else if ("part" == type) {
			if ("both" == status) {
				if ("in" == mode) {
					result = "IN2";
				} else if ("out" == mode) {
					result = "OUT4";
				}
			} else if ("work" == status) {
				if ("in" == mode) {
					result = "IN1";
				} else if ("out" == mode) {
					result = "OUT3";
				}
			}
		}

		return result;
	}

	getAreaList(carid, mode = "") {
		var sql = "SELECT " + "arid, arname " + "FROM " + "area_tb " + "WHERE " + "carid=" + carid + " " + " OR carid=100 " + "ORDER BY " + "sort";
		var H_area = this.get_DB().queryKeyAssoc(sql);

		if ("" != mode) {
			H_area[0] = "\u9078\u629E\u306A\u3057";
		}

		ksort(H_area);
		return H_area;
	}

	exitNoAuth(H_g_sess, H_view, A_shopid) //受注元と操作販売店が一緒なら見える
	{
		if (H_g_sess.shopid == H_view.order.order.shopid) {
			return true;
		} else if (true == H_view.unify && true == (-1 !== A_shopid.indexOf(H_view.order.order.shopid))) {
			return true;
		} else //振替先なら見れる
			{
				for (var val of Object.values(H_view.order.transto.gif)) {
					if (val.toshopid == H_g_sess.shopid) {
						return true;
					} else if (true == H_view.unify && true == (-1 !== A_shopid.indexOf(val.toshopid))) {
						return true;
					}
				}
			}

		this.getOut().errorOut(6, "\u3053\u306E\u53D7\u6CE8\u306E\u95B2\u89A7\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093");
	}

	getShiftOptionID(H_option) {
		if (false != H_option && 0 < H_option.length) {
			var sql = "SELECT toop, fromop FROM docomo_option_shift_tb " + " WHERE fromop IN (" + Object.keys(H_option).join(", ") + ")";
			var result = this.get_DB().queryKeyAssoc(sql);
		} else {
			result = this.O_order.A_empty;
		}

		return result;
	}

	getPartErrorStatus(ordertype, status, nowstatus) //処理済みより前
	{
		if (this.O_order.st_prcfin > status) {
			status = nowstatus;
		} else if (this.O_order.st_prcfin == status) {
			status = this.O_order.st_sub_prcfin;
		} else if (this.O_order.st_shipfin == status) {
			status = this.O_order.st_sub_shipfin;
		} else if (this.O_order.st_shipfin < status) //新規に端末が増えるものは出荷
			{
				var A_temp = [this.O_order.type_new, this.O_order.type_chn, this.O_order.type_mnp, this.O_order.type_shi];

				if (true == (-1 !== A_temp.indexOf(ordertype))) {
					status = this.O_order.st_sub_shipfin;
				} else {
					status = this.O_order.st_sub_prcfin;
				}
			}

		return status;
	}

	getOrderTelno(H_view) {
		var sql = "SELECT telno FROM " + ShopOrderDetailModel.ORD_DET_TB + " WHERE orderid=" + H_view.order.orderid;
		return this.get_DB().queryOne(sql);
	}

	adjustLineCnt(H_view) {
		if (this.O_order.type_acc == H_view.order.order.ordertype) {
			H_view.linecnt--;
		}

		if (true == (-1 !== this.O_order.A_machinebuy.indexOf(H_view.order.order.ordertype))) {
			var sql = "SELECT count(detail_sort) FROM " + ShopOrderDetailModel.ORD_DET_TB + " WHERE " + "orderid=" + this.get_DB().dbQuote(H_view.order.order.orderid, "int", true);
			H_view.linecnt = H_view.linecnt - 1 + this.get_DB().queryOne(sql);
		}
	}

	adjustBalkPlan(H_view) {
		var A_arid = this.getAreaList(H_view.order.order.carid);

		for (var val of Object.values(H_view.order.machine)) {
			if (false == (undefined !== H_view.order.blp[val.arid].forshop)) //break;
				{
					H_view.order.blp[val.arid].arname = A_arid[val.arid];
					H_view.order.blp[val.arid].arid = val.arid;
					H_view.order.blp[val.arid].forshop = val.forshop;
					H_view.order.blp[val.arid].registdate = val.registdate;
					H_view.order.blp[val.arid].deliverydate = val.deliverydate;
					H_view.order.blp[val.arid].expectdate = val.expectdate;
					H_view.order.blp[val.arid].contractdate = val.contractdate;
					H_view.order.blp[val.arid].machineflg = true;
					H_view.order.blp[val.arid].registerflg = val.registerflg;
					H_view.order.blp[val.arid].registgif = val.registgif;
					H_view.order.blp[val.arid].areacnt = 0;
					H_view.order.blp[val.arid].detail_sort = val.detail_sort;
				}
		}

		ksort(H_view.order.blp);

		for (var val of Object.values(H_view.order.machine)) {
			H_view.order.blp[val.arid].sort[val.detail_sort] = val.arid;
			H_view.order.blp[val.arid].areacnt++;
		}
	}

	getReserveDuplication(H_order, H_permit, carid, editflg, execdate) {
		var sql = "SELECT COUNT(*) " + "FROM " + "tel_reserve_tb " + "WHERE " + "exe_state=0" + " AND pactid=" + this.get_DB().dbQuote(H_order.pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND add_edit_flg=" + this.get_DB().dbQuote(editflg, "int", true) + " AND telno=" + this.get_DB().dbQuote(H_permit.telno, "text", true) + " AND reserve_date=" + this.get_DB().dbQuote(execdate, "text", true);
		return this.get_DB().queryOne(sql);
	}

	getReserveEndTarget(H_order, H_permit, carid, execdate) {
		var sql = "SELECT COUNT(*) FROM tel_reserve_tb " + "WHERE " + "exe_state=0" + " AND pactid=" + H_order.pactid + " AND carid=" + carid + " AND telno='" + H_permit.telno + "'" + " AND reserve_date >='" + execdate + "'";
		return this.get_DB().queryOne(sql);
	}

	getWorkDetailNo(H_g_sess, H_view, H_mergedata, A_shopid) //自販売店が受けた受注
	{
		var A_result = this.O_order.A_empty;

		if (H_g_sess.shopid == H_view.order.order.shopid) {
			for (var key in H_mergedata) {
				var val = H_mergedata[key];
				A_result[val.detail_sort].sort = val.detail_sort;
				A_result[val.detail_sort].subid = val.ordersubid;
			}
		} else if (true == (-1 !== A_shopid.indexOf(H_g_sess.shopid))) {
			for (var key in H_mergedata) {
				var val = H_mergedata[key];
				A_result[val.detail_sort].sort = val.detail_sort;
				A_result[val.detail_sort].subid = val.ordersubid;
			}
		} else if (0 < H_view.order.transto.gif.length) {
			{
				let _tmp_20 = H_view.order.transto.gif;

				for (var key in _tmp_20) {
					var val = _tmp_20[key];
					A_result[val.detail_sort].sort = val.detail_sort;
					A_result[val.detail_sort].subid = val.ordersubid;
				}
			}
		}

		return A_result;
	}

	getDispStatusFlag(H_order, H_shop) //受注販売店と操作中の販売店が同じなら表示
	{
		if (this.O_Sess.shopid == H_order.order.shopid) {
			return true;
		}

		if (true == (-1 !== H_shop.indexOf(H_order.order.shopid))) {
			return true;
		}

		if ("part" == H_order.order.transfer_type) {
			return false;
		}

		return true;
	}

	getTelnoOnly(orderid) {
		var sql = "SELECT telno, telno_view, substatus FROM " + ShopOrderDetailModel.ORD_DET_TB + " WHERE orderid=" + orderid + " " + "ORDER BY detail_sort";
		return this.get_DB().queryHash(sql);
	}

	getTelProperty(H_telno, H_order) {
		if (this.O_order.type_new == H_order.ordertype || this.O_order.type_mnp == H_order.ordertype || this.O_order.type_chn == H_order.ordertype || this.O_order.type_shi == H_order.ordertype || this.O_order.type_mis == H_order.ordertype) {
			var sql = "SELECT col, colname " + "FROM " + "management_property_tb " + "WHERE " + "mid=1 " + "AND pactid=" + this.get_DB().dbQuote(H_order.pactid, "int", true) + " " + "AND ordviewflg=true" + " ORDER BY sort";
			H_property.colname = this.get_DB().queryAssoc(sql);

			if (this.O_order.A_empty != H_property.colname) {
				sql = "SELECT detail_sort, " + Object.keys(H_property.colname).join(", ") + " " + "FROM " + ShopOrderDetailModel.ORD_DET_TB + " " + "WHERE " + "orderid=" + H_order.orderid + " " + "ORDER BY detail_sort";
				var H_temp = this.get_DB().queryKeyAssoc(sql);

				if (false == Array.isArray(H_temp[0])) {
					{
						let _tmp_21 = H_property.colname;

						for (var key in _tmp_21) {
							var val = _tmp_21[key];
							var colname = key;
						}
					}

					for (var key in H_temp) {
						var val = H_temp[key];
						H_property.data[key] = {
							[colname]: val
						};
					}
				} else {
					H_property.data = H_temp;
				}

				sql = "SELECT detail_sort, telno, telno_view, substatus " + "FROM " + ShopOrderDetailModel.ORD_DET_TB + " " + "WHERE " + "orderid=" + H_order.orderid + " " + "ORDER BY detail_sort";
				H_property.telno = this.get_DB().queryKeyAssoc(sql);
				return H_property;
			}
		}

		return false;
	}

	makeTelPropertySQL(H_sess, H_permit) {
		var sql = "";

		if (true == (undefined !== H_sess.telproperty[H_permit.detail_sort])) {
			{
				let _tmp_22 = H_sess.telproperty[H_permit.detail_sort];

				for (var key in _tmp_22) {
					var val = _tmp_22[key];

					if ("" != sql) {
						sql += ", ";
					}

					if (true == preg_match("/text[0-9]|url[0-9]|mail[0-9]|select[0-9]/", key)) {
						sql += key + "=" + this.get_DB().dbQuote(val, "text", false);
					} else if (true == preg_match("/int[0-9]/", key)) {
						sql += key + "=" + this.get_DB().dbQuote(val, "int", false);
					} else if (true == preg_match("/date[0-9]/", key)) {
						sql += key + "=" + this.get_DB().dbQuote(this.makeDateString(val, false), "date", false);
					}
				}
			}
		} else if (true == (undefined !== H_sess.uptarget)) {
			var H_temp = this.getTelDetailInfo(H_permit.orderid, H_permit.detail_sort);

			for (var key in H_temp) {
				var val = H_temp[key];

				if ("" != sql) {
					sql += ", ";
				}

				if (true == preg_match("/text[0-9]|url[0-9]|mail[0-9]|select[0-9]/", key)) {
					sql += key + "=" + this.get_DB().dbQuote(val, "text", false);
				} else if (true == preg_match("/int[0-9]/", key)) {
					sql += key + "=" + this.get_DB().dbQuote(val, "int", false);
				} else if (true == preg_match("/date[0-9]/", key)) {
					sql += key + "=" + this.get_DB().dbQuote(this.makeDateString(val, false), "date", false);
				}
			}
		}

		return sql;
	}

	isTransfer(H_view) {
		if (this.O_order.A_empty == H_view.order.transto.gif) {
			H_view.istrans = false;
		} else {
			H_view.istrans = true;
		}
	}

	getUpdateStockValue(target) //取置
	{
		if ("reserve" == target) {
			H_result.target = true;
			H_result.upflg = true;
		} else if ("regular" == target) {
			H_result.target = false;
			H_result.upflg = true;
		} else {
			H_result.target = false;
			H_result.upflg = false;
		}

		return H_result;
	}

	setOrderTelno(H_info) {
		this.O_order.A_ordtelno = this.extractOrderColumn(H_info.machine, "telno");
		return this.O_order.A_ordtelno;
	}

	makeReservePlanSql(H_order, H_permit, H_tel) {
		if (this.getRegistType()) {
			var H_user = this.getExecReserveUserID(H_order, H_permit);
			var nowtime = MtDateUtil.getNow();
			var execdate = this.getReserveDate(H_order.dateradio, H_order.dateto, nowtime);
			var cirid = H_tel.cirid;
			var sql = "";
			var postid = H_tel.postid;
			var arid = H_tel.arid;

			if (undefined == H_tel) {
				postid = H_order.postid;
				arid = H_permit.arid;
			}

			if (undefined == cirid) {
				cirid = H_order.cirid;
			}

			if (!H_order.username) {
				H_order.username = "\u30B7\u30B9\u30C6\u30E0";
			}

			if (this.O_order.type_blp != H_order.ordertype) {
				var option = this.remakeOptions(unserialize(H_permit.option), unserialize(H_tel.options));
				var discount = this.remakeOptions(unserialize(H_permit.waribiki), unserialize(H_tel.discounts));
			} else {
				option = H_tel.options;
				discount = H_tel.discounts;
			}

			var extension = this.O_fjp.setExtensionReserve(H_tel, H_order);

			if (0 == this.getReserveDuplication(H_order, H_permit, H_order.carid, 1, execdate)) {
				sql = "INSERT INTO tel_reserve_tb " + "(pactid, postid, telno_view, telno, carid, cirid, planid, packetid, " + "options, discounts, add_edit_flg, reserve_date, exe_postid, exe_userid, " + "recogcode, " + "exe_name, order_flg, fixdate, recdate, webreliefservice, division) " + "VALUES(" + this.get_DB().dbQuote(H_order.pactid, "int", true) + ", " + this.get_DB().dbQuote(postid, "int", true) + ", " + this.get_DB().dbQuote(H_permit.telno_view, "text", true) + ", " + this.get_DB().dbQuote(H_permit.telno, "text", true) + ", " + this.get_DB().dbQuote(H_order.carid, "int", true) + ", " + this.get_DB().dbQuote(cirid, "int", true) + ", " + this.get_DB().dbQuote(this.selectUpdateContent(H_permit.plan, H_tel.planid), "int", false) + ", " + this.get_DB().dbQuote(this.selectUpdateContent(H_permit.packet, H_tel.packetid), "int", false) + ", " + this.get_DB().dbQuote(option, "text", false) + ", " + this.get_DB().dbQuote(discount, "text", false) + ", " + this.get_DB().dbQuote(1, "int", true) + ", " + this.get_DB().dbQuote(execdate, "date", true) + ", " + this.get_DB().dbQuote(H_order.postid, "int", true) + ", " + this.get_DB().dbQuote(H_user.userid, "int", true) + ", " + this.get_DB().dbQuote(H_order.recogcode, "int") + ", " + this.get_DB().dbQuote(H_order.username, "text", true) + ", " + this.get_DB().dbQuote(true, "bool", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(nowtime, "date", true) + ", " + this.get_DB().dbQuote(H_order.webreliefservice, "text", false) + ", " + this.get_DB().dbQuote(H_order.division, "int") + ")";
			}
		}

		return sql;
	}

	getReserveDate(type, reserve, nowtime = "") {
		if ("reserve" != type) {
			return reserve.substr(0, 10);
		}

		if ("" == nowtime) {
			var H_time = this.makeDateHash(MtDateutil.getToday());
		} else {
			H_time = this.makeDateHash(nowtime);
		}

		reserve = mktime(0, 0, 0, H_time.m + 1, 1, H_time.y);
		return date("Y-m-d", reserve);
	}

	selectUpdateContent(primary, secondary) {
		if (undefined === primary || "" === primary) {
			return secondary;
		}

		return primary;
	}

	getTransferMailInfo(H_order) {
		var sql = "SELECT " + "ord.orderid||'('||car.carname||' '||ty.ptnname||' '||pa.compname||')' " + "FROM " + ShopOrderDetailModel.ORD_TB + " ord " + "INNER JOIN carrier_tb car ON ord.carid=car.carid " + "INNER JOIN mt_order_pattern_tb ty ON ord.ordertype=ty.type AND car.carid=ty.carid AND ord.cirid=ty.cirid " + "INNER JOIN pact_tb pa ON ord.pactid=pa.pactid " + "WHERE " + "ord.orderid IN (" + H_order.join(", ") + ") " + "ORDER BY " + "ord.orderid";
		return this.get_DB().queryCol(sql);
	}

	getDispTransferShop(H_order) {
		if (undefined == H_order.order.orderid) {
			this.getOut().errorOut(5, "orderid\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093", false);
		}

		var sql = "SELECT " + "transfer_level, toshopid, fromshopid " + "FROM " + "mt_transfer_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.orderid, "int", true) + " " + "ORDER BY " + "transfer_level DESC";
		var H_info = this.get_DB().queryRowHash(sql);

		if (this.O_order.A_empty != H_info) {
			H_result.to = this.getShopPostcode(H_info.toshopid);
			H_result.from = this.getShopPostcode(H_info.fromshopid);
		}

		return H_result;
	}

	getShopPostCode(shopid) {
		var sql = "SELECT postcode, name FROM shop_tb WHERE shopid=" + this.get_DB().dbQuote(shopid, "int", true);
		return this.get_DB().queryRowHash(sql);
	}

	makeCompleteDateSql(status, substatus, nowtime) {
		var sql = "";

		if (true == this.checkEndOutStatus(status, this.O_order.st_complete)) {
			if (true == this.checkEndSubStatus(status, substatus, "complete")) {
				sql = "completedate=" + this.get_DB().dbQuote(nowtime.substr(0, 10), "date", false);
			}
		}

		return sql;
	}

	getTargetDate(H_date) {
		var year = H_date.year + H_date.y;
		var month = H_date.month + H_date.m;
		var day = H_date.day + H_date.d;
		return date("Y-m-d", mktime(0, 0, 0, month, day, year));
	}

	setDateArray(year = 0, month = 0, day = 0, date = "") //区切り間違ってたので修正 20101004miya
	{
		if ("" == date) {
			var nowtime = MtDateUtil.getNow();
		}

		H_result.year = date.substr(0, 4);
		H_result.month = date.substr(5, 2);
		H_result.day = date.substr(8, 2);
		H_result.y = year;
		H_result.m = month;
		H_result.d = day;
		return H_result;
	}

	checkSerialRegulation(A_serno, H_order) //if(0 != $A_digit){
	//			if(true == in_array($H_order["carid"], $this->O_Set->A_check_luneformura)){
	//				foreach($A_serno as $val){
	//					$serno = preg_replace("/\s|　/", "", $val[0]);
	//					$digit = strlen($serno);
	//					if(0 != $digit){
	//						if(false == in_array($digit, $A_digit)){
	//							$result .= "製造番号は" .implode($A_digit, "桁, "). "桁で入力してください(" .$val[0]. ")";
	//						}elseif($this->O_Set->car_willcom != $H_order["carid"]){
	//							if(false == $this->checkLuhnFormula($val[0])){
	//								$result .= "入力された値では整合性が取れません(" .$val[0]. ")";
	//							}
	//						}
	//					}
	//				}
	//			}
	//			else{
	//				foreach($A_serno as $val){
	//					$digit = strlen($serno);
	//					if((0 != $digit) && (false == in_array($digit, $A_digit))){
	//						$result .= "製造番号は" .implode($A_digit, "桁, "). "桁で入力してください(" .$val[0]. ")";
	//					}
	//				}
	//			}
	//		}
	{
		var A_digit = this.getSerialDigit(H_order.carid);
		var result = "";

		for (var val of Object.values(A_serno)) {
			var serno = val[0].replace(/\s|　/g, "");
			var digit = serno.length;

			if (0 != A_digit && 0 != digit) {
				if (0 != digit) {
					if (!(-1 !== A_digit.indexOf(digit))) {
						result += "\u88FD\u9020\u756A\u53F7\u306F" + "\u6841, ".join(A_digit) + "\u6841\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(" + val[0] + ")";
						continue;
					}
				}
			}

			if (-1 !== this.O_Set.A_check_luneformura.indexOf(H_order.carid)) {
				if (!this.checkLuhnFormula(val[0])) {
					result += "\u5165\u529B\u3055\u308C\u305F\u5024\u3067\u306F\u6574\u5408\u6027\u304C\u53D6\u308C\u307E\u305B\u3093(" + val[0] + ")";
				}
			}
		}

		return result;
	}

	checkSimnoDigit(A_simno, H_order) {
		var result = "";
		var A_digit = this.getSimnoDigit(H_order.carid);

		if (0 != A_digit) {
			for (var val of Object.values(A_simno)) {
				var simno = val.replace(/\s|　/g, "");
				var digit = simno.length;

				if (0 != digit && false == (-1 !== A_digit.indexOf(digit))) {
					result = "SIM\u756A\u53F7\u306F" + "\u6841, ".join(A_digit) + "\u6841\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044(" + val + ")";
				}
			}
		}

		return result;
	}

	getSerialDigit(carid) {
		if (this.O_Set.car_docomo == carid) {
			return this.O_Set.A_serial_digit_from_docomo;
		} else if (this.O_Set.car_willcom == carid) {
			return this.O_Set.A_serial_digit_from_willcom;
		} else if (this.O_Set.car_au == carid) {
			return this.O_Set.A_serial_digit_from_au;
		} else if (this.O_Set.car_softbank == carid) {
			return this.O_Set.A_serial_digit_from_softbank;
		} else if (this.O_Set.car_emobile == carid) {
			return this.O_Set.A_serial_digit_from_emobile;
		} else {
			return this.O_Set.A_serial_digit_from_other;
		}
	}

	getSimnoDigit(carid) {
		if (this.O_Set.car_docomo == carid) {
			return this.O_Set.A_simno_digit_from_docomo;
		} else if (this.O_Set.car_willcom == carid) {
			return this.O_Set.A_simno_digit_from_willcom;
		} else if (this.O_Set.car_au == carid) {
			return this.O_Set.A_simno_digit_from_au;
		} else if (this.O_Set.car_softbank == carid) {
			return this.O_Set.A_simno_digit_from_softbank;
		} else if (this.O_Set.car_emobile == carid) {
			return this.O_Set.A_simno_digit_from_emobile;
		} else {
			return this.O_Set.A_simno_digit_from_other;
		}
	}

	checkLuhnFormula(str) //10で割った余りが0なら正常値
	{
		var key = str.length - 1;
		var odd = 1;

		for (var i = key; i >= 0; i--) //右端から奇数桁は足す
		{
			if (1 == odd % 2) {
				total += str[i];
			} else //倍にして2桁なら1桁目と2桁目を1桁の数値として足し、結果を加算
				{
					var temp = str[i] * 2;

					if (10 <= temp) {
						total += 1 + (temp - 10);
					} else {
						total += temp;
					}

					temp = 0;
				}

			odd++;
		}

		if (0 == total % 10) {
			return true;
		}

		return false;
	}

	getTargetColumn(H_data, target) {
		var A_result = this.O_order.A_empty;

		for (var array of Object.values(H_data)) {
			for (var key in array) {
				var val = array[key];

				if (target == key) {
					A_result.push(val);
				}
			}
		}

		return A_result;
	}

	updateTransferCount(H_order) {
		var sql = "UPDATE mt_transfer_charge_shop_tb " + "SET " + "maccnt=0, " + "acccnt=0 " + "WHERE " + "orderid=" + this.get_DB().dbQuote(H_order.order.orderid, "int", true);
		return sql;
	}

	getRegistType() {
		return this.registtype;
	}

	setRegistType(pactid, site = "shop") //履歴から来たら無条件で登録　なので、注文履歴からデータを渡すときは「更新していいもの」のみ渡すこと
	{
		if ("shop" != site) {
			this.registtype = true;
		} else //電話管理に反映しない
			{
				var sql = "SELECT orderregisttype FROM pact_tb WHERE pactid=" + this.get_DB().dbQuote(pactid, "int", true);

				if (0 == this.get_DB().queryOne(sql)) {
					this.registtype = false;
				} else {
					this.registtype = true;
				}
			}
	}

	setShopUser(type = true) {
		this.shopuser = type;
	}

	getShopUser() {
		return this.shopuser;
	}

	getRegistFlg() {
		var registflg = false;

		if (this.getShopUser()) {
			if (this.getRegistType()) {
				registflg = true;
			} else {
				registflg = false;
			}
		}

		return registflg;
	}

	checkPostID(postid, pactid = undefined, getflg = false, post_tb = "post_tb") {
		var sql = "SELECT " + "postid " + "FROM " + post_tb + " " + "WHERE " + "postid=" + this.get_DB().dbQuote(postid, "int", true);
		var result = this.get_DB().queryOne(sql);

		if (!result) {
			if (!getflg) {
				return false;
			}

			if (!pactid) {
				sql = "SELECT pactid FROM post_tb WHERE postid=" + this.get_DB().dbQuote(postid, "int", true);
				pactid = this.get_DB().queryOne(sql);
			}

			return this.getRootPost(pactid, postid);
		}

		return postid;
	}

	getRootPost(pactid) {
		require("model/PostModel.php");

		var O_post = new PostModel();
		return O_post.getRootPostid(pactid, 0);
	}

	setPostID(postid) {
		this.postid = postid;
	}

	getPostID() {
		return this.postid;
	}

	getErrMsg() {
		return this.errMsg;
	}

	setfjpModelObject(fjp) {
		require("model/Order/fjpModel.php");

		if (fjp instanceof fjpModel) {
			this.O_fjp = fjp;
		}
	}

	registrationPast(H_sess, H_order, H_permit, sql) {
		var result = false;

		if (preg_match("/^INSERT INTO tel_tb/", sql)) {
			if (is_numeric(this.insertPastMonth)) {
				this.getPastMonth(H_sess, H_order);
			}

			if (is_numeric(this.insertPastMonth)) {
				var postid = this.checkPostID(this.getPostID(), H_order.pactid, true, "post_" + this.insertPastMonth + "_tb");
				result = sql.replace(/^INSERT INTO tel_tb/g, "INSERT INTO tel_" + this.insertPastMonth + "_tb");

				if (this.getPostID() != postid && is_numeric(postid)) {
					result = preg_replace("/" + H_order.pactid + ", " + this.getPostID() + ",/", H_order.pactid + ", " + postid + ",", result, 1);
				}
			}
		}

		return result;
	}

	checkExists(H_order) {
		var telno = Array();

		for (var val of Object.values(H_order.machine)) {
			if (!!val.telno) {
				telno.push(val.telno);
			}
		}

		var sql = "SELECT COUNT(telno) " + "FROM " + "tel_tb " + "WHERE " + "pactid=" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(H_order.order.carid, "int", true) + " AND telno IN ('" + "', '".join(telno) + "')";

		if (0 < this.get_DB().queryOne(sql)) {
			return 1;
		}

		return 0;
	}

	checkExtensionNo(H_sess, H_order) //常にチェックしないと内線番号被る
	//		if (!$this->checkEndSubStatus($H_sess["status"], $H_order["order"]["status"], "proc")){
	//			return "";
	//		}
	{
		if ("230" == H_order.order.status) {
			return;
		}

		if ("N" == H_order.order.ordertype) {
			if (!is_null(H_sess.telno)) {
				var telnos = H_sess.telno;
			} else {
				for (var i = 0; i < H_order.order.telcnt; i++) {
					telnos[i] = i + 1;
				}
			}
		} else if ("Nmnp" == H_order.order.ordertype) {
			telnos = Array();

			for (var val of Object.values(H_order.machine)) {
				telnos.push(val.telno);
			}
		} else {
			return;
		}

		if (is_null(telnos)) {
			return;
		}

		require("MtAuthority.php");

		var O_Auth = MtAuthority.singleton(H_order.order.pactid);
		var result = "";

		if (O_Auth.chkPactFuncId(ShopOrderDetailModel.FUNC_EXTENSION)) {
			var O_Extension = this.getExtensionTelModel();
			this.getPastMonth(H_sess, H_order);
			O_Extension.setTableNo();

			for (var key in telnos) {
				var telno = telnos[key];

				if (undefined !== H_sess.extensionno[key] && !!H_sess.extensionno[key]) {
					var reserved = "";
					var telno = telno.replace(/-/g, "");

					if (!telno) {
						telno = key + 1 + "\u53F0\u76EE";
					}

					if (O_Extension.checkExtensionNoExists(H_order.order.pactid, telno, H_order.order.carid, H_sess.extensionno[key], false)) {
						reserved = telno + "\u306E\u5185\u7DDA\u756A\u53F7\u306F\u65E2\u306B\u4F7F\u7528\u3055\u308C\u3066\u3044\u307E\u3059\u3002<br>";
					}

					if (is_numeric(this.insertPastMonth)) {
						O_Extension.setTableNo(this.insertPastMonth);

						if (O_Extension.checkExtensionNoExists(H_order.order.pactid, telno, H_order.order.carid, H_sess.extensionno[key], false)) {
							reserved += telno + "\u306E\u5185\u7DDA\u756A\u53F7\u306F\u5148\u6708\u306E\u96FB\u8A71\u7BA1\u7406\u3067\u65E2\u306B\u4F7F\u7528\u3055\u308C\u3066\u3044\u307E\u3059\u3002<br>";
						}

						O_Extension.setTableNo();
					}

					if (H_order.machine[key].extensionno != H_sess.extensionno[key]) {
						result += reserved;
					}
				}
			}
		}

		return result;
	}

	getPastMonth(H_sess, H_order) {
		if (undefined !== H_sess.expectdate) {
			var expect = H_sess.expectdate;
			expect.y = expect.Y;
		} else if (undefined !== H_order.machine[0].expectdate) {
			expect = this.makeDateHash(H_order.machine[0].expectdate);
		}

		if (undefined !== expect) {
			var now = this.makeDateHash(this.O_order.today);

			if (mktime(0, 0, 0, expect.m, expect.d, expect.y) < mktime(0, 0, 0, now.m, 1, now.y)) {
				var date = this.makeDateHash(this.O_order.today, false);
				var month = date.m - 1;

				if (1 > month) {
					month = 12;
				}

				this.insertPastMonth = str_pad(month, 2, "0", STR_PAD_LEFT);
			}
		}
	}

	makeUpdateExtension(H_extension) {
		if (Array() != H_extension) {
			var O_Exception = this.getExtensionTelModel();
			var result = Array();
			result.push(O_Exception.makeDeleteExtensionNoSQL(H_extension.pactid, H_extension.release));
			result.push(O_Exception.makeActivateExtensionNoSQL(H_extension.pactid, H_extension.ensure, H_extension.carid));
			this.procReserveExtension = Array();
		}

		return result;
	}

	getExtensionTelModel() {
		require("model/ExtensionTelModel.php");

		if (!this.O_Extension instanceof ExtensionTelModel) {
			this.O_Extension = new ExtensionTelModel();
		}

		return this.O_Extension;
	}

	regetExtensionNo(orderid) {
		var sql = "SELECT extensionno FROM mt_order_teldetail_tb " + "WHERE orderid=" + this.get_DB().dbQuote(orderid, "int", true) + " " + "ORDER BY detail_sort";
		return this.get_DB().queryCol(sql);
	}

	releaseExtensionNo(H_order, H_permit) {
		var result = Array();

		if ("N" == H_order.ordertype || "Nmnp" == H_order.ordertype) {
			if (is_numeric(H_order.pactid) && !is_null(H_permit.extensionno)) {
				var O_extension = this.getExtensionTelModel();
				result.push(O_extension.makeDeleteExtensionNoSQL(H_order.pactid, H_permit.extensionno));
			}
		}

		return result;
	}

	checkExtensionNoFunction(pactid) {
		if (is_numeric(pactid)) {
			var sql = "SELECT COUNT(fncid) FROM fnc_relation_tb WHERE " + "pactid=" + this.get_DB().dbQuote(pactid, "int", true) + " AND fncid=" + this.get_DB().dbQuote(ShopOrderDetailModel.FNC_EXT_NO, "int", true);

			if (1 == this.get_DB().queryOne(sql)) {
				return true;
			}
		}

		return false;
	}

	getShopAdminAuth(viewObject, memid) {}

	createAuthObjectForShopAdmin(shopid) {
		require("MtShopAuthority.php");

		if (!this.O_Shopauth instanceof MtShopAuthority) {
			if (is_numeric(shopid)) {
				this.O_Shopauth = MtShopAuthority.singleton(shopid);
				return true;
			}

			return false;
		}

		return true;
	}

	checkShopAdminFuncId(shopid, fncid) {
		if (is_numeric(shopid) && !is_numeric(this.shopAdminId)) {
			var sql = "SELECT " + "memid " + "FROM " + "shop_member_tb " + "WHERE " + "shopid=" + this.get_DB().dbQuote(shopid, "int", true) + " AND type='SU'" + "ORDER BY " + "memid";
			this.shopAdminId = this.get_DB().queryOne(sql);
		}

		if (this.O_Shopauth instanceof MtShopAuthority) {
			if (this.O_Shopauth.chkUserFuncId(this.shopAdminId, fncid)) {
				return true;
			}

			return false;
		}

		return "error";
	}

	checkShopFuncId(memid, fncid) //メンバーが指定された権限を持っているか調べます
	{
		if (this.O_Shopauth instanceof MtShopAuthority) {
			if (this.O_Shopauth.chkUserFuncId(memid, fncid)) {
				return true;
			}

			return false;
		}

		return "error";
	}

	getMailContents(orderid = undefined, shopid = undefined) {
		var pacttype = undefined;

		if (is_numeric(orderid)) {
			var sql = "SELECT pacttype " + "FROM " + "mt_order_tb " + "WHERE " + "orderid=" + this.get_DB().dbQuote(orderid, "int", true);
			pacttype = this.get_DB().queryOne(sql);
		}

		var groupid = undefined;

		if (is_numeric(shopid)) {
			sql = "SELECT groupid " + "FROM " + "shop_tb " + "WHERE " + "shopid=" + this.get_DB().dbQuote(shopid, "int", true);
			groupid = this.get_DB().queryOne(sql);
		}

		return {
			type: pacttype,
			groupid: groupid
		};
	}

	makeKaibanSQLCtrl(H_sess, H_order) //改番を行う番号を取得します。
	//また、改番を行う電話の番号を空にします。
	//$H_sess[self::PUB] =
	//改番フラグや、番号の退避
	{
		var err = Array();
		var sql = Array();
		var tel = undefined;
		{
			let _tmp_23 = H_order.machine;

			for (var key in _tmp_23) {
				var value = _tmp_23[key];

				if (value.detail_sort == H_sess.SELF.kaiban && is_null(value.kaiban_telno)) {
					tel = value;
					break;
				}
			}
		}

		if (!!tel) //フリー1
			//改番フラグを立てる
			{
				var freeword1 = "";

				if (!is_null(tel.free_one)) {
					freeword1 = tel.free_one;
				}

				freeword1 += "\n" + tel.telno_view;
				sql.push("update mt_order_teldetail_tb set " + "kaiban_telno='" + tel.telno + "'," + "kaiban_telno_view='" + tel.telno_view + "'," + "freeword1='" + freeword1 + "' " + "where " + " orderid=" + tel.orderid + " " + "and detail_sort=" + tel.detail_sort);
			}

		var result = {
			err: err,
			sql: {
				[H_order.order.orderid]: sql
			}
		};
		return result;
	}

	makeKaibanDeleteSQLCtrl(H_sess, H_order) //改番を行う番号を取得します。
	//また、改番を行う電話の番号を空にします。
	//改番フラグや、番号の退避
	{
		var err = Array();
		var sql = Array();
		var tel = undefined;
		{
			let _tmp_24 = H_order.machine;

			for (var key in _tmp_24) {
				var value = _tmp_24[key];

				if (value.detail_sort == H_sess.SELF.kaiban_delete && is_null(value.kaiban_telno) == false) {
					tel = value;
					break;
				}
			}
		}

		if (!!tel) //改番フラグを立てる
			{
				sql[100] = "update mt_order_teldetail_tb set " + "kaiban_telno=NULL," + "kaiban_telno_view=NULL " + "where " + " orderid=" + tel.orderid + " " + "and detail_sort=" + tel.detail_sort;
			}

		var result = {
			err: err,
			sql: {
				[H_order.order.orderid]: sql
			}
		};
		return result;
	}

	getTelRegist(H_order) {
		var result = Array();
		{
			let _tmp_25 = H_order.machine;

			for (var mkey in _tmp_25) //改番
			{
				var mvalue = _tmp_25[mkey];

				if (this.O_order.type_mnp != H_order.order.ordertype) //MNPじゃない時、もしくは改番済みのとき。
					//改番後の場合はcaridは注文のキャリアを参照する
					{
						var carid = H_order.order.carid;
					} else //MNPの時
					{
						if (this.O_order.st_sub_prcfin <= +(mvalue.substatus && this.O_order.st_cancel != +mvalue.substatus)) //ステータスが処理済以降であれば・・
							{
								carid = H_order.order.carid;
							} else //処理済前なら元キャリアを使用する
							{
								carid = mvalue.formercarid;
							}
					}

				if (undefined !== mvalue.kaiban_telno) {
					var telno = mvalue.kaiban_telno;
				} else {
					telno = mvalue.telno;
				}

				var sql = "SELECT COUNT(*) " + "FROM " + "tel_tb " + "WHERE " + " pactid=" + this.get_DB().dbQuote(H_order.order.pactid, "int", true) + " AND carid=" + this.get_DB().dbQuote(carid, "int", true) + " AND telno=" + this.get_DB().dbQuote(telno, "text", true);
				result[mvalue.detail_sort] = this.get_DB().queryOne(sql);
			}
		}
		return result;
	}

	checkKaibanOrder(orderid) {
		var kaiban = this.getTelDetailByKaiban(orderid);

		if (!kaiban == false) {
			return true;
		}

		return false;
	}

	__destruct() {
		super.__destruct();
	}

};