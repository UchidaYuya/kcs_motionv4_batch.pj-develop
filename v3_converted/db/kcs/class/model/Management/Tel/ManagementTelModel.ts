//
//電話管理用モデル
//
//@package Management
//@subpackage Model
//@filesource
//@author houshiyama
//@since 2008/05/21
//@uses ManagementModelBase
//@uses ManagementAssetsModel
//@uses CarrierModel
//@uses CircuitModel
//@uses PlanModel
//@uses PacketModel
//@uses PointModel
//@uses OptionModel
//@uses BuySelectModel
//@uses AreaModel
//@uses KousiPatternModel
//@uses ProductModel
//@uses ExtensionTelModel
//
//
//
//電話管理用モデル
//
//@package Management
//@subpackage Model
//@author houshiyama
//@since 2008/05/21
//@uses CarrierModel
//@uses ManagementAssetsModel
//@uses CarrierModel
//@uses CircuitModel
//@uses PlanModel
//@uses PacketModel
//@uses PointModel
//@uses OptionModel
//@uses BuySelectModel
//@uses AreaModel
//

require("model/Management/ManagementModelBase.php");

require("model/Management/Assets/ManagementAssetsModel.php");

require("model/Management/Assets/AssetsAddModel.php");

require("model/Management/Assets/AssetsModModel.php");

require("model/CarrierModel.php");

require("model/CircuitModel.php");

require("model/PlanModel.php");

require("model/PacketModel.php");

require("model/PointModel.php");

require("model/OptionModel.php");

require("model/BuySelectModel.php");

require("model/AreaModel.php");

require("model/KousiPatternModel.php");

require("model/ProductModel.php");

require("model/ExtensionTelModel.php");

//
//電話管理プルダウン初期値
//
//
//端末管理オブジェクト
//
//
//コンストラクター
//
//@author houshiyama
//@since 2008/05/21
//
//@param objrct $O_db0
//@param array $H_g_sess
//@param objrct $O_Out0
//@access public
//@return void
//
//
//電話会社一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return array
//@uses CarrierModel
//
//
//電話会社一覧データ取得（使用中のもののみ）
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $A_post（部署一覧）
//@param mixed $cym
//@param array $H_post（CGIパラメータ）
//@access public
//@return void
//
//
//回線種別一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@access public
//@return array
//@uses CircuitModel
//
//
//プラン一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $buyselid
//@param mixed $past
//@access public
//@return array
//@uses PlanModel
//
//
//パケット一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $past
//@access public
//@return array
//@uses PacketModel
//
//
//ポイントサービス一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return array
//@uses PointModel
//
//
//割引サービス一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $past
//@access public
//@return array
//@uses OptionModel
//
//
//オプション一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $past
//@access public
//@return array
//@uses OptionModel
//
//
//オプション、割引サービス一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $past
//@access public
//@return array
//@uses OptionModel
//
//
//購入方式一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@access public
//@return array
//@uses AreaModel
//
//
//地域会社一覧データ取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $carid
//@access public
//@return array
//@uses AreaModel
//
//
//公私分計一覧データ取得
//
//@author houshiyama
//@since 2008/06/20
//
//@param mixed $carid
//@access public
//@return array
//@uses AreaModel
//
//
//シリーズ一覧データ取得
//
//@author houshiyama
//@since 2008/07/25
//
//@param mixed $carid
//@param mixed $cirid
//@access public
//@return array
//@uses PlanModel
//
//
//指定した電話番号の情報取得SQL文作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//指定した電話番号の予約情報取得SQL文作成
//
//@author houshiyama
//@since 2008/08/25
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date
//@param mixed $flg
//@access public
//@return void
//
//
//tel_tbへの固定的なwhere句作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $delflg
//@access protected
//@return void
//
//
//tel_tbへの固定的なwhere句（テーブル名付き）作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@access protected
//@return void
//
//
//前月に電話があるかチェック
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//DBにその電話があるかチェック
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//DBにその電話の予約があるかチェック
//
//@author houshiyama
//@since 2008/08/06
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $date（予約日）
//@param mixed $flg
//@access public
//@return void
//
//
//DBに電話と端末の関連があるかチェック
//
//@author houshiyama
//@since 2008/08/06
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $assetsid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//DBにその電話の関連電話があるかチェック
//
//@author houshiyama
//@since 2008/08/06
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//DBに関連させようとしている関連電話がすでにあるかチェック
//
//@author houshiyama
//@since 2008/08/06
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre（前月チェックフラグ）
//@access public
//@return void
//
//
//削除済みで同じIDがあるかチェック
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//削除済みIDがあるかチェック
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@access private
//@return void
//
//
//登録時に必要なSQL文を作る <br>
//
//テーブル名決定 <br>
//削除済みに無いかチェック <br>
//SQL文作成 <br>
//前月に登録する時 <br>
//前月に無いかチェック <br>
//前月用SQL文作成 <br>
//
//@author houshiyama
//@since 2008/06/06
//
//@param mixed $H_sess
//@access public
//@return array
//
//
//変更時に必要なSQL文を作る <br>
//(delete-insert) <br>
//
//@author houshiyama
//@since 2008/03/26
//
//@param array $H_sess
//@param mixed $cym
//@access public
//@return void
//
//
//変更時に必要なSQL文を作る <br>
//(update)
//
//テーブル名決定 <br>
//SQL文作成 <br>
//前月も変更する時 <br>
//前月用SQL文作成 <br>
//
//@author houshiyama
//@since 2008/03/21
//
//@param array $H_sess
//@param mixed $cym
//access public
//@return array
//
//
//端末テーブルへの更新文ＳＱＬを作成
//
//@author houshiyama
//@since 2008/07/29
//
//@param array $H_sess
//@param mixed $O_assets
//@param array $A_sql
//@param array $chgflg（キー変更フラグ）
//@access private
//@return void
//
//
//端末テーブルへの更新文ＳＱＬを作成
//
//@author houshiyama
//@since 2008/07/29
//
//@param array $H_sess
//@param mixed $O_assets
//@param array $A_sql
//@param array $chgflg（キー変更フラグ）
//@access private
//@return void
//
//
//予約を削除する一連の処理（端末）
//
//@author houshiyama
//@since 2008/08/14
//
//@param mixed $O_assets
//@param mixed $A_reserve
//@param mixed $mess1
//@param mixed $mess2
//@param mixed $date
//@access protected
//@return void
//
//
//インサート文を作成する
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@param boolean $pre
//@access public
//@return void
//
//
//指定した電話を削除
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//電話のインサート文作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@param mixed $tb
//@access public
//@return void
//
//
//電話予約のインサート文作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@param mixed $tb
//@access public
//@return void
//
//
//電話のupdate文作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//tel_X_tbテーブルから電話を削除 <br>
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $tb
//@access public
//@return void
//
//
//指定した電話を削除（tel_rel_assets_X_tbから）
//
//@author houshiyama
//@since 2008/08/12
//
//@param mixed $H_post
//@param mixed $pre
//@access protected
//@return void
//
//
//指定した電話を削除（tel_rel_tel_X_tbから）
//
//@author houshiyama
//@since 2008/08/12
//
//@param mixed $H_post
//@param mixed $pre
//@access protected
//@return void
//
//
//select句作成
//
//@author houshiyama
//@since 2008/05/21
//
//@access protected
//@return string
//
//@param string $mode
//@access protected
//@return void
//
//
//セレクト用カラムにテーブル（エイリアス）名を付ける
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $val
//@access private
//@return void
//
//
//更新に使うカラム決定
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $type
//@access protected
//@return $A_col
//protected function makeColumns( $type="insert" ){
//$A_col = array( "pactid",
//"postid",
//"telno_view",
//"telno",
//"mail",
//"userid",
//"carid",
//"arid",
//"cirid",
//"planid",
//"planalert",
//"packetid",
//"packetalert",
//"pointstage",
//"buyselid",
//"options",
//"discounts",
//"username",
//"employeecode",
//"simcardno",
//"memo",
//"orderdate",
//"contractdate",
//"text1",
//"text2",
//"text3",
//"text4",
//"text5",
//"text6",
//"text7",
//"text8",
//"text9",
//"text10",
//"text11",
//"text12",
//"text13",
//"text14",
//"text15",
//"int1",
//"int2",
//"int3",
//"int4",
//"int5",
//"int6",
//"date1",
//"date2",
//"date3",
//"date4",
//"date5",
//"date6",
//"mail1",
//"mail2",
//"mail3",
//"url1",
//"url2",
//"url3",
//"fixdate",
//"kousiflg",
//"kousiptn",
//"pre_telno",
//"pre_carid",
//"dummy_flg" );
//
//// 新規のみの項目
//if( "insert" == $type ){
//array_push( $A_col, "recdate" );
//}
//// 予約のみの項目
//elseif( "reserve" == $type ){
//array_push( $A_col, "movepostid" );
//array_push( $A_col, "moveteldate" );
//array_push( $A_col, "schedule_person_name" );
//array_push( $A_col, "schedule_person_userid" );
//array_push( $A_col, "reserve_date" );
//array_push( $A_col, "add_edit_flg" );
//array_push( $A_col, "exe_postid" );
//array_push( $A_col, "exe_userid" );
//array_push( $A_col, "exe_name" );
//array_push( $A_col, "recdate" );
//}
//
//return $A_col;
//}
//
//
//更新に使うvalue決定
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_post
//@param mixed $type
//@access protected
//@return $A_val
//
//
//一覧データ取得（移動・削除画面用メソッド）
//
//@author houshiyama
//@since 2008/05/21
//
//@param array $H_sess
//@param array $H_trg
//@access public
//@return void
//
//
//配列の各要素を分解
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_trg
//@access protected
//@return $A_rows
//
//
//移動、削除画面用一覧のwhere句作成
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_row
//@param mixed $type
//@access protected
//@return void
//
//
//請求があればtrue <br>
//請求が無ければfalse <br>
//
//対象が今月ならば前月をチェック <br>
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//指定した会社の請求数を取得
//
//@author houshiyama
//@since 2008/08/15
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre
//@access protected
//@return void
//
//
//指定したIDの請求数を取得
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre
//@access protected
//@return void
//
//
//前月に指定の電話があるかチェック
//
//@author houshiyama
//@since 2008/05/21
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $A_prepost
//@access protected
//@return void
//
//
//前月に指定の部署があるかuserpostidでチェック
//
//@author houshiyama
//@since 2011/08/12
//
//@param mixed $userpostid
//@access protected
//@return void
//
//
//マスターデータを生成する <br>
//
//@author houshiyama
//@since 2008/05/28
//
//@param array $H_sess（CGIパラメータ）
//@param array $A_post（部署ID）
//@param mixed $dounload
//@access private
//@return string
//
//
//電話と端末のリレーションテーブルへのインサート文を作成する
//
//@author houshiyama
//@since 2008/07/30
//
//@param mixed $H_post
//@param mixed $assetsid
//@access protected
//@return void
//
//
//電話と端末のリレーションテーブルへのインサート文を作成する（予約用）
//
//@author houshiyama
//@since 2008/07/30
//
//@param mixed $H_post
//@param mixed $assetsid
//@access protected
//@return void
//
//
//電話と端末のリレーションテーブルへのインサート文を作成する（予約用）
//
//@author houshiyama
//@since 2008/06/09
//
//@param mixed $H_post
//@param mixed $assetsid
//@access protected
//@return void
//
//
//プランアラートを決定し返す
//
//@author houshiyama
//@since 2008/06/09
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $planid
//@access protected
//@return flg（アラートフラグ）
//@uses PlanModel
//
//
//パケットアラートを決定し返す
//
//@author houshiyama
//@since 2008/06/09
//
//@param mixed $carid
//@param mixed $cirid
//@param mixed $packetid
//@access protected
//@return flg（アラートフラグ）
//@uses PacketModel
//
//
//電話1、端末nのデータをフォーム用に組み立てなおす
//
//@author houshiyama
//@since 2008/06/12
//
//@param mixed $H_res
//@param mixed $view（表示のみのに使われる項目を表示するか否か）
//@access protected
//@return void
//
//
//端末フォームに入力があればtrue、無ければfalse <br>
//
//@author houshiyama
//@since 2008/06/13
//
//@param mixed $H_post
//@access public
//@return void
//
//
//主端末ラジオボタンの値があれば"true"、無ければ"false" <br>
//SQL用なので返り値は文字列 <br>
//
//@author houshiyama
//@since 2008/06/13
//
//@param mixed $H_post
//@access protected
//@return void
//
//
//管理番号から端末を取得する
//
//@author houshiyama
//@since 2008/07/31
//
//@param mixed $assetsno
//@access public
//@return void
//
//
//関連電話のデータを整形する（移動、削除）
//返り値は特殊な配列
//
//@author houshiyama
//@since 2008/08/07
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $A_data
//@param mixed $A_post
//@access public
//@return void
//
//
//関連電話のデータを整形する（詳細）
//返り値は普通の配列
//
//@author houshiyama
//@since 2008/08/07
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $H_data
//@access public
//@return void
//
//
//電話予約データ整形
//
//@author houshiyama
//@since 2008/08/20
//
//@param mixed $A_data
//@access public
//@return void
//
//
//機種一覧データ取得（資産モデルのコピペ）
//
//@author houshiyama
//@since 2008/08/08
//
//@param mixed $carid
//@param mixed $cirid
//@param string $seriesid
//@access public
//@return void
//
//
//色一覧データ取得（資産モデルのコピペ）
//
//@author houshiyama
//@since 2008/08/08
//
//@param string $productid
//@access public
//@return void
//
//
//親番号一覧取得
//
//@author houshiyama
//@since 2008/08/12
//
//@access public
//@return void
//
//
//管理記録用insert文作成
//
//@author houshiyama
//@since 2008/04/03
//
//@param array $H_post
//@access public
//@return void
//
//
//管理記録用insert文作成（新規予約）
//
//@author houshiyama
//@since 2008/04/03
//
//@param array $H_post
//@access public
//@return void
//
//
//管理記録用insert文作成（変更予約）
//
//@author houshiyama
//@since 2008/04/03
//
//@param array $H_post
//@access public
//@return void
//
//
//オプションや割引サービスのシリアライズを
//表示用の日本語にする
//
//@author houshiyama
//@since 2008/08/15
//
//@param mixed $H_op
//@param mixed $option
//@access public
//@return void
//
//
//電話関連テーブルからの削除（一気に実行）
//
//@author houshiyama
//@since 2008/08/21
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $rel_telno
//@param mixed $tel_carid
//@access public
//@return void
//
//
//tel_rel_assets_tbへのupdate文作成
//
//@author houshiyama
//@since 2008/08/24
//
//@param mixed $H_sess
//@access public
//@return void
//
//
//表示用電話番号取得
//
//@author houshiyama
//@since 2008/09/12
//
//@param mixed $telno
//@param mixed $carid
//@access public
//@return void
//
//
//表示用に全てのオプションデータ取得
//
//@author houshiyama
//@since 2009/03/09
//
//@access private
//@return void
//
//
//表示用に全てのオプションデータ取得（英語）
//
//@author houshiyama
//@since 2009/03/09
//
//@access private
//@return void
//
//
//シリアライズデータを表示用に変換 変数個別版
//
//@author katsushi
//@since 2020/07/17
//
//@param mixed $data
//@param mixed $H_view
//@param mixed $separator
//@access public
//@return void
//
//
//シリアライズデータを表示用に変換
//
//@author houshiyama
//@since 2009/03/03
//
//@param mixed $A_data
//@param mixed $H_view
//@param mixed $separator
//@access public
//@return void
//
//
//シリアライズデータを表示用に変換（英語）
//
//@author houshiyama
//@since 2009/03/03
//
//@param mixed $A_data
//@param mixed $H_view
//@param mixed $separator
//@access public
//@return void
//
//
//その端末が主端末か否か？チェック
//主ならtrue、否ならfalse
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $assetsid
//@param mixed $pre
//@access public
//@return void
//
//
//主端末フラグをリセットする
//
//@author houshiyama
//@since 2009/06/30
//
//@param mixed $H_val
//@access private
//@return void
//
//
//電話に紐付くtel_rel_assets_tbのデータ取得
//
//@author houshiyama
//@since 2009/06/30
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre
//@access private
//@return void
//
//
//電話に紐付くtel_rel_assets_tbのデータ取得
//
//@author houshiyama
//@since 2009/06/30
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre
//@access private
//@return void
//
//
//電話が所属している部署を取得
//
//@author
//@since 2010/04/14
//
//@param mixed $telno
//@param mixed $carid
//@param mixed $pre
//@access protected
//@return void
//
//
//ウェブサービス用要素
//
//@author
//@since 2010/12/07
//
//@access public
//@return void
//
//
//translateWebService
//
//@author
//@since 2010/12/10
//
//@param mixed $data
//@access public
//@return void
//
//
//checkShopReceivingOrder
//
//@author web
//@since 2015/08/13
//
//@param mixed $telno
//@param mixed $carid
//@access public
//@return void
//
//
//デストラクタ
//
//@author houshiyama
//@since 2008/05/21
//
//@access public
//@return void
//
class ManagementTelModel extends ManagementModelBase {
	static TEL_SELECT_TOP = "--\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
	static TEL_SELECT_TOP_ENG = "--Please select--";
	static TEL_SELECT_DEFAULT = "--\u96FB\u8A71\u4F1A\u793E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--";
	static TEL_SELECT_DEFAULT_ENG = "--Please select carrier--";

	constructor(O_db0, H_g_sess, O_manage) {
		super(O_db0, H_g_sess, O_manage);
	}

	getCarrierData() {
		var O_model = new CarrierModel();

		if (this.H_G_Sess.language == "ENG") {
			var H_data = {
				"": ManagementTelModel.TEL_SELECT_TOP_ENG
			};
			var H_res = O_model.getPactCarrierEngKeyHash(this.H_G_Sess.pactid);
		} else {
			H_data = {
				"": ManagementTelModel.TEL_SELECT_TOP
			};
			H_res = O_model.getPactCarrierKeyHash(this.H_G_Sess.pactid);
		}

		H_data += H_res;
		return H_data;
	}

	getUseCarrierData(A_post, cym, H_post) //テーブル名決定
	//検索値があれば加える
	{
		this.setTableName(cym);
		var carid = undefined;

		if (undefined !== H_post.carid == true && H_post.carid != "") {
			carid = H_post.carid;
		}

		var O_model = new CarrierModel();

		if (this.H_G_Sess.language == "ENG") {
			var H_data = {
				"": ManagementTelModel.TEL_SELECT_TOP_ENG
			};
			var H_res = O_model.getUseCarrierEngKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.tel_tb, carid);
		} else {
			H_data = {
				"": ManagementTelModel.TEL_SELECT_TOP
			};
			H_res = O_model.getUseCarrierKeyHash(this.H_G_Sess.pactid, A_post, this.H_Tb.tel_tb, carid);
		}

		H_data += H_res;
		return H_data;
	}

	getCircuitData(carid) {
		if (carid != "") {
			var O_model = new CircuitModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
				var H_res = O_model.getCircuitEngKeyHash(carid);
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
				H_res = O_model.getCircuitKeyHash(carid);
			}

			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT
				};
			}
		}

		return H_data;
	}

	getPlanData(carid, cirid = "", buyselid = "", past, default_planid = 0) {
		if (carid != "") {
			var O_model = new PlanModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
				var H_res = O_model.getPlanEngKeyHash(carid, cirid, buyselid, past, default_planid);
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
				H_res = O_model.getPlanKeyHash(carid, cirid, buyselid, past, default_planid);
			}

			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT
				};
			}
		}

		return H_data;
	}

	getPacketData(carid, cirid, past, default_packetid = 0) {
		if (carid != "") {
			var O_model = new PacketModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
				var H_res = O_model.getPacketEngKeyHash(carid, cirid, past, default_packetid);
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
				H_res = O_model.getPacketKeyHash(carid, cirid, past, default_packetid);
			}

			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT
				};
			}
		}

		return H_data;
	}

	getPointData(carid, cirid) {
		if (carid != "") {
			var O_model = new PointModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
				var H_res = O_model.getPointEngKeyHash(carid, cirid);
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
				H_res = O_model.getPointKeyHash(carid, cirid);
			}

			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT
				};
			}
		}

		return H_data;
	}

	getDiscountData(carid, cirid, past) {
		var H_data = Array();

		if (carid != "") {
			var O_model = new OptionModel();

			if (this.H_G_Sess.language == "ENG") {
				H_data = O_model.getDiscountEngKeyHash(carid, cirid, past);
			} else {
				H_data = O_model.getDiscountKeyHash(carid, cirid, past);
			}
		}

		return H_data;
	}

	getOptionData(carid, cirid, past) {
		var H_data = Array();

		if (carid != "") {
			var O_model = new OptionModel();

			if (this.H_G_Sess.language == "ENG") {
				H_data = O_model.getOptionEngKeyHash(carid, cirid, past);
			} else {
				H_data = O_model.getOptionKeyHash(carid, cirid, past);
			}
		}

		return H_data;
	}

	getOptionDiscountData(carid, cirid, past) {
		var H_data = Array();

		if (carid != "") //言語分岐
			{
				var O_model = new OptionModel();

				if (this.H_G_Sess.language == "ENG") {
					H_data = O_model.getOptionDiscountKeyHashEng(carid, cirid, past);
				} else {
					H_data = O_model.getOptionDiscountKeyHash(carid, cirid, past);
				}
			}

		return H_data;
	}

	getBuySelData(carid) {
		if (carid != "") {
			var O_model = new BuySelectModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
				var H_res = O_model.getBuySelectEngKeyHash(carid);
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
				H_res = O_model.getBuySelectKeyHash(carid);
			}

			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT
				};
			}
		}

		return H_data;
	}

	getAreaData(carid) {
		if (carid != "") {
			var O_model = new AreaModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
				var H_res = O_model.getAreaEngKeyHash(carid);
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
				H_res = O_model.getAreaKeyHash(carid);
			}

			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT
				};
			}
		}

		return H_data;
	}

	getKousiPtnData(pactid, carid) {
		if (carid != "") {
			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
			}

			var O_model = new KousiPtnModel();
			var H_res = O_model.getKousiPtnKeyHash(pactid, carid);
			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_DEFAULT
				};
			}
		}

		return H_data;
	}

	getProductSeriesData(carid, cirid) {
		if (carid != "" && cirid != "") {
			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP
				};
			}

			var O_model = new ProductModel();
			var H_res = O_model.getSeriesHash(this.H_G_Sess.groupid, carid, cirid);
			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": "--Please select a service type--"
				};
			} else {
				H_data = {
					"": "--\u56DE\u7DDA\u7A2E\u5225\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};
			}
		}

		return H_data;
	}

	makeTelSelectOneSQL(telno, carid, pre = false) {
		if (true === pre) {
			var tb = "pre";
		} else {
			tb = "now";
		}

		var sql = "select " + this.makeTelSelectSQL() + " from " + this.makeTelFromSQL(tb) + " where " + this.makeCommonTelAliasWhere(telno, carid) + " order by tra.main_flg desc,ass.recdate desc";
		return sql;
	}

	makeTelReserveSelectOneSQL(telno, carid, date, flg) {
		var sql = "select " + this.makeTelSelectSQL("reserve") + " from " + this.makeTelReserveFromSQL() + " where " + this.makeCommonTelAliasWhere(telno, carid) + " and te.reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true, "reserve_date") + " and te.add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true, "add_edit_flg") + " order by tra.main_flg desc,ass.recdate desc";
		return sql;
	}

	makeCommonTelWhere(telno, carid) {
		var sql = " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and telno=" + this.get_DB().dbQuote(telno, "text", true) + " and carid=" + this.get_DB().dbQuote(carid, "integer", true);
		return sql;
	}

	makeCommonTelAliasWhere(telno, carid) {
		var sql = " te.pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and te.telno=" + this.get_DB().dbQuote(telno, "text", true) + " and te.carid=" + this.get_DB().dbQuote(carid, "integer", true);
		return sql;
	}

	checkPastExist(H_post: {} | any[]) {
		var res = this.checkTelExist(this.O_Manage.convertNoView(H_post.telno_view), H_post.carid, true);
		return res;
	}

	checkTelExist(telno, carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_tb;
		} else {
			tb = this.H_Tb.tel_tb;
		}

		var sql = "select count(telno) from " + tb + " where " + this.makeCommonTelWhere(this.O_Manage.convertNoView(telno), carid);

		if (this.get_DB().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkTelReserveExist(telno, carid, date = "", flg = "") //予約日
	{
		var sql = "select count(telno) from " + this.H_Tb.tel_reserve_tb + " where " + this.makeCommonTelWhere(telno, carid) + " and " + " exe_state=0";

		if (date != "") {
			sql += " and " + " reserve_date=" + this.get_DB().dbQuote(date, "timestamp", true);
		}

		if (flg != "") {
			sql += " and " + " add_edit_flg=" + this.get_DB().dbQuote(flg, "integer", true);
		}

		if (this.get_DB().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkRelAssetsExist(telno, carid, assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "select count(telno) from " + tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and " + " assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true);

		if (this.get_DB().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkRelTelExist(telno, carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_tel_tb;
		} else {
			tb = this.H_Tb.tel_rel_tel_tb;
		}

		var sql = "select count(telno) from " + tb + " where " + " (telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true) + ")" + " or " + " (rel_telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " rel_carid=" + this.get_DB().dbQuote(carid, "integer", true) + ")";

		if (this.get_DB().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkTelRelTelExist(telno, carid, rel_telno, rel_carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_tel_tb;
		} else {
			tb = this.H_Tb.tel_rel_tel_tb;
		}

		var sql = "select count(telno) from " + tb + " where " + " (telno=" + this.get_DB().dbQuote(telno, "text", true, "telno") + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true, "carid") + " and " + " rel_telno=" + this.get_DB().dbQuote(rel_telno, "text", true, "rel_telno") + " and " + " rel_carid=" + this.get_DB().dbQuote(rel_carid, "integer", true, "rel_carid") + ")" + " or " + " (rel_telno=" + this.get_DB().dbQuote(telno, "text", true, "rel_telno") + " and " + " rel_carid=" + this.get_DB().dbQuote(carid, "integer", true, "rel_carid") + " and " + " telno=" + this.get_DB().dbQuote(rel_telno, "text", true, "telno") + " and " + " carid=" + this.get_DB().dbQuote(rel_carid, "integer", true, "carid") + ")";

		if (this.get_DB().queryOne(sql) < 1) {
			return false;
		} else {
			return true;
		}
	}

	checkDeleteExist(H_post) {
		var res = this.checkDeleteTelExist(this.O_Manage.convertNoView(H_post.telno_view), H_post.carid);
		return res;
	}

	checkDeleteTelExist(telno, carid) {
		var sql = "select count(telno) from tel_tb " + " where " + this.makeCommonTelWhere(telno, carid);

		if (this.get_DB().queryOne(sql) > 0) {
			return true;
		} else {
			return false;
		}
	}

	makeAddSQL(H_sess: {} | any[]) //名前が長いので・・・
	//機種名と色をtel_tbへ
	//端末用クラスオブジェクトの生成
	//予約登録の時
	//内線電話がある時
	{
		var H_val = H_sess.SELF.post;
		H_val.telno = this.O_Manage.convertNoView(H_val.telno_view);
		H_val.machine = H_val.productname_0;
		H_val.color = H_val.property_0;
		var O_assets = new ManagementAssetsModel(this.O_db, this.H_G_Sess, this.O_Manage);
		this.setTableName(this.YM);
		O_assets.setTableName(this.YM);
		var A_sql = Array();

		if (H_val.addtype == "reserve") //既に予約があれば消す
			//まずtel_reserve_tbに予約があるか調べる
			//tel_reserve_tbへのインサート文作成
			//tel_rel_tel_reserve_tbへの更新文作成
			//資産種別追加
			//フォームに入力があるかチェック
			{
				var A_reserve = this.getTelReserveList(H_val.telno, H_val.carid);

				if (A_reserve.length > 0) {
					var A_delres = this.deleteReserveProc(A_reserve, "\u96FB\u8A71\u65B0\u898F\u767B\u9332\u4E88\u7D04\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "Reservation deletion due to reservation of new phone registration", "\u4E88\u7D04\u524A\u9664");

					if (A_delres.length > 0) {
						A_sql = array_merge(A_sql, A_delres);
					}
				}

				H_val.add_edit_flg = ManagementTelModel.ADDMODE;
				H_val.reserve_date = this.O_Manage.convertDatetime(H_val.adddate);
				A_sql.push(this.makeInsertTelReserveSQL(H_val));

				if (undefined != this.makeAddRelationTelReserveSQL(H_val, "reserve")) {
					A_sql.push(this.makeAddRelationTelReserveSQL(H_val, "reserve"));
				}

				var H_post = this.O_Manage.getOneAssFormValue(H_val, 0);
				H_post.assetstypeid = 1;

				if (this.checkAssFormInput(H_post) == true) //足り無い情報があるのでセッションから取得
					//既にある端末か調べる
					{
						H_post.add_edit_flg = ManagementTelModel.ADDMODE;
						H_post.reserve_date = this.O_Manage.convertDatetime(H_val.adddate);
						H_post.recogpostid = H_val.recogpostid;
						H_post.telno = H_val.telno;
						H_post.telno_view = H_val.telno_view;
						H_post.carid = H_val.carid;
						H_post.rel_flg = 0;

						if (undefined !== H_post.assetsid == true && H_post.assetsid != "" && O_assets.checkAssetsExist(H_post.assetsid) == true) //assets_reserve_tbへのインサート文作成
							//tel_rel_assets_reserve_tbへのインサート文作成
							{
								A_sql.push(O_assets.makeInsertAssetsReserveSQL(H_post, H_post.assetsid, "reserve"));
								A_sql.push(this.makeAddRelationAssetsReserveSQL(H_post, H_post.assetsid, "reserve"));
							} else //端末のシーケンスID取得
							//assets_reserve_tbへのインサート文作成
							//tel_rel_assets_reserve_tbへのインサート文作成
							{
								var assetsid = O_assets.getNextAssetsid();
								A_sql.push(O_assets.makeInsertAssetsReserveSQL(H_post, assetsid, "reserve"));
								A_sql.push(this.makeAddRelationAssetsReserveSQL(H_post, assetsid, "reserve"));
							}
					}

				A_sql.push(this.makeAddReserveLogSQL(H_val));
			} else //既に予約があれば消す
			//まずtel_reserve_tbに予約があるか調べる
			//tel_rel_tel_tbへの更新文作成
			//資産種別は携帯端末
			//フォームに入力があるかチェック
			{
				A_reserve = this.getTelReserveList(H_val.telno, H_val.carid);

				if (A_reserve.length > 0) {
					A_delres = this.deleteReserveProc(A_reserve, "\u96FB\u8A71\u65B0\u898F\u767B\u9332\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "Reservation deletion due to new handset registration", "\u4E88\u7D04\u524A\u9664");

					if (A_delres.length > 0) {
						A_sql = array_merge(A_sql, A_delres);
					}
				}

				A_sql.push(this.makeAddManageSQL(H_val));

				if (undefined != this.makeAddRelationTelSQL(H_val)) {
					A_sql.push(this.makeAddRelationTelSQL(H_val));
				}

				H_post = this.O_Manage.getOneAssFormValue(H_val, 0);
				H_post.assetstypeid = 1;

				if (this.checkAssFormInput(H_post) == true) //足り無い情報があるのでセッションから取得
					//既にある端末か調べる
					{
						H_post.recogpostid = H_val.recogpostid;
						H_post.telno = H_val.telno;
						H_post.telno_view = H_val.telno_view;
						H_post.carid = H_val.carid;

						if (undefined !== H_post.assetsid == true && H_post.assetsid != "" && O_assets.checkAssetsExist(H_post.assetsid) == true) //assets_tbへのupdate文作成
							//tel_rel_assets_tbへのインサート文作成
							{
								H_tmp.SELF.post = H_post;
								A_sql.push(O_assets.makeModManageSQL(H_tmp));
								A_sql.push(this.makeAddRelationAssetsSQL(H_post, H_post.assetsid));
							} else //端末のシーケンスID取得
							//現在に既に削除フラグが立った同一キーがあるかチェック
							//tel_rel_assets_tbへのインサート文作成
							{
								assetsid = O_assets.getNextAssetsid();

								if (O_assets.checkDeleteNoExist(H_post) == true) {
									A_sql.push(O_assets.makeDelAssetsNoSQL(H_post.assetsno));
								}

								A_sql.push(O_assets.makeAddManageSQL(H_post, assetsid));
								A_sql.push(this.makeAddRelationAssetsSQL(H_post, assetsid));
							}
					}

				var firstdate = this.YM + "01";
				var contractdate = this.O_Manage.convertDatetime(H_val.contractdate).replace(/-/g, "");

				if (this.O_Set.manage_clamp_date > this.A_Time[2] && contractdate != "" && contractdate < firstdate) //前月に無ければ前月にも登録
					{
						if (this.checkPastExist(H_val) == false && this.O_Post.checkPostExist(H_val.recogpostid, this.H_Tb.pre_post_tb) == true) //tel_tbへのインサート文作成
							//tel_rel_tel_tbへの更新文作成
							{
								A_sql.push(this.makeAddManageSQL(H_val, true));

								if (undefined != this.makeAddRelationTelSQL(H_val, true)) {
									A_sql.push(this.makeAddRelationTelSQL(H_val, true));
								}

								if (this.checkAssFormInput(H_post) == true) //既にある端末か調べる
									{
										if (undefined !== H_post.assetsid == true && H_post.assetsid != "" && O_assets.checkAssetsExist(H_post.assetsid, true) == true) //assets_tbへのupdate文作成
											//tel_rel_assets_tbへのインサート文作成
											{
												H_tmp.SELF.post = H_post;
												A_sql.push(O_assets.makeModManageSQL(H_tmp, true));
												A_sql.push(this.makeAddRelationAssetsSQL(H_post, H_post.assetsid, true));
											} else //同番号の資産が無ければ追加
											{
												if (O_assets.checkAssetsNoExist(H_post.assetsno, "add", true) == false) //assets_tbへのインサート文作成
													//tel_rel_assets_tbへのインサート文作成
													{
														A_sql.push(O_assets.makeAddManageSQL(H_post, assetsid, true));
														A_sql.push(this.makeAddRelationAssetsSQL(H_post, assetsid, true));
													}
											}
									}
							}
					}

				A_sql.push(this.makeAddLogSQL(H_val));
			}

		if (!!H_val.extensionno) //前月も変更する時
			{
				var O_extension = new ExtensionTelModel();
				O_extension.setTableNo(this.H_Tb.tableno);
				A_sql.push(O_extension.makeActivateExtensionNoSQL(this.H_G_Sess.pactid, H_val.extensionno, H_val.carid));

				if (this.O_Set.manage_clamp_date > this.A_Time[2] && contractdate != "" && contractdate < firstdate) {
					if (this.checkPastExist(H_val) == false && this.O_Post.checkPostExist(H_val.recogpostid, this.H_Tb.pre_post_tb) == true) {
						O_extension.setTableNo(this.H_Tb.pretableno);
						A_sql.push(O_extension.makeActivateExtensionNoSQL(this.H_G_Sess.pactid, H_val.extensionno, H_val.carid));
					}
				}
			}

		return A_sql;
	}

	makeDelInsertSQL(H_sess: {} | any[]) //機種名と色をtel_tbへ
	//資産管理している
	//名前が長いので・・・
	//端末用クラスオブジェクトの生成
	//予約変更の時
	{
		if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == true) {
			{
				let _tmp_0 = H_sess.SELF.post;

				for (var tkey in _tmp_0) {
					var tval = _tmp_0[tkey];

					if (preg_match("/^main_flg_/", tkey) == true) //プルダウン優先
						{
							var tnum = tkey.replace(/^main_flg_/g, "");

							if ("" != H_sess.SELF.post["productid_" + tnum]) {
								var A_tmp = split(":", H_sess.SELF.post["productid_" + tnum]);
								H_sess.SELF.post.machine = A_tmp[1];
							} else {
								H_sess.SELF.post.machine = H_sess.SELF.post["productname_" + tnum];
							}

							if ("" != H_sess.SELF.post["branchid_" + tnum]) {
								A_tmp = split(":", H_sess.SELF.post["branchid_" + tnum]);
								H_sess.SELF.post.color = A_tmp[1];
							} else {
								H_sess.SELF.post.color = H_sess.SELF.post["property_" + tnum];
							}

							break;
						}
				}
			}
		} else {
			H_sess.SELF.post.machine = H_sess.SELF.post.productname_0;
			H_sess.SELF.post.color = H_sess.SELF.post.property_0;
		}

		var H_val = H_sess.SELF.post;
		H_val.telno = this.O_Manage.convertNoView(H_val.telno_view);
		var O_assets = new AssetsModModel(this.O_db, this.H_G_Sess, this.O_Manage);
		this.setTableName(H_sess[ManagementTelModel.PUB].cym);
		O_assets.setTableName(H_sess[ManagementTelModel.PUB].cym);
		var A_sql = Array();

		if (H_val.modtype == "reserve") //tel_reserve_tbへのインサート文作成
			//端末の予約処理
			//管理記録
			{
				H_val.reserve_date = this.O_Manage.convertDatetime(H_val.moddate);
				var H_tmp = H_val;
				H_tmp.telno = H_sess.SELF.get.manageno;
				H_tmp.telno_view = this.getTelNoView(H_sess.SELF.get.manageno, H_sess.SELF.get.coid);
				H_tmp.carid = H_sess.SELF.get.coid;
				H_tmp.pre_telno = H_sess.SELF.get.manageno;
				H_tmp.pre_carid = H_sess.SELF.get.coid;
				H_tmp.add_edit_flg = ManagementTelModel.DELMODE;
				A_sql.push(this.makeInsertTelReserveSQL(H_tmp));
				H_val.add_edit_flg = ManagementTelModel.ADDMODE;
				A_sql.push(this.makeInsertTelReserveSQL(H_val));
				this.makeTerminalReserveSQL(H_sess, O_assets, A_sql);
				A_sql.push(this.makeModReserveLogSQL(H_val));
			} else //change_post_tb更新
			//tel_X_tbからの削除
			//maketerminalsqlで更新します
			//			// tel_rel_assets_X_tbを更新
			//			$A_tmp = $this->makeModRelAssetsSQL( $H_val );
			//			if( count( $A_tmp ) > 0 ){
			//				$A_sql = array_merge( $A_sql, $A_tmp );
			//			}
			//tel_rel_tel_X_tbを更新
			//前月も変更する時
			//管理記録
			{
				H_val.postid = H_val.recogpostid;
				A_sql.push(this.makeInsertChangePostSQL(H_val, this.NowTime));
				A_sql.push(this.makeDelManageSQL(H_val));
				A_tmp = this.makeModRelTelSQL(H_val);

				if (A_tmp.length > 0) {
					A_sql = array_merge(A_sql, A_tmp);
				}

				A_sql.push(this.makeAddManageSQL(H_val));

				if (undefined !== H_val.pastflg == true && H_val.pastflg == 1) //tel_X_tbからの削除
					//maketerminalsqlで更新します
					//				// tel_rel_assets_X_tbを更新
					//				$A_tmp = $this->makeModRelAssetsSQL( $H_val );
					//				if( count( $A_tmp ) > 0 ){
					//					array_merge( $A_sql, $A_tmp );
					//				}
					//tel_rel_tel_X_tbを更新
					{
						A_sql.push(this.makeDelManageSQL(H_val, true));
						A_tmp = this.makeModRelTelSQL(H_val);

						if (A_tmp.length > 0) {
							array_merge(A_sql, A_tmp);
						}

						A_sql.push(this.makeAddManageSQL(H_val, true));
					}

				this.makeTerminalSQL(H_sess, O_assets, A_sql, true);
				A_sql.push(this.makeModLogSQL(H_val, H_sess[ManagementTelModel.PUB].cym));
			}

		return A_sql;
	}

	makeModSQL(H_sess: {} | any[]) //機種名と色をtel_tbへ
	//資産管理している
	//名前が長いので・・・
	//端末用クラスオブジェクトの生成
	//予約変更の時
	//内線電話処理
	{
		if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == true) {
			{
				let _tmp_1 = H_sess.SELF.post;

				for (var tkey in _tmp_1) {
					var tval = _tmp_1[tkey];

					if (preg_match("/^main_flg_/", tkey) == true) //プルダウン優先
						{
							var tnum = tkey.replace(/^main_flg_/g, "");

							if ("" != H_sess.SELF.post["productid_" + tnum]) {
								var A_tmp = split(":", H_sess.SELF.post["productid_" + tnum]);
								H_sess.SELF.post.machine = A_tmp[1];
							} else {
								H_sess.SELF.post.machine = H_sess.SELF.post["productname_" + tnum];
							}

							if ("" != H_sess.SELF.post["branchid_" + tnum]) {
								A_tmp = split(":", H_sess.SELF.post["branchid_" + tnum]);
								H_sess.SELF.post.color = A_tmp[1];
							} else {
								H_sess.SELF.post.color = H_sess.SELF.post["property_" + tnum];
							}

							break;
						}
				}
			}
		} else {
			H_sess.SELF.post.machine = H_sess.SELF.post.productname_0;
			H_sess.SELF.post.color = H_sess.SELF.post.property_0;
		}

		var H_val = H_sess.SELF.post;
		H_val.telno = this.O_Manage.convertNoView(H_val.telno_view);
		var O_assets = new AssetsModModel(this.O_db, this.H_G_Sess, this.O_Manage);
		var A_sql = Array();

		if (H_val.modtype == "reserve") //tel_reserve_tbへのインサート文作成
			//tel_rel_tel_reserve_tbへの更新文作成
			//管理記録
			{
				this.setTableName(this.YM);
				O_assets.setTableName(this.YM);
				H_val.add_edit_flg = ManagementTelModel.MODMODE;
				H_val.reserve_date = this.O_Manage.convertDatetime(H_val.moddate);
				A_sql.push(this.makeInsertTelReserveSQL(H_val));

				if (undefined != this.makeAddRelationTelReserveSQL(H_val, "reserve")) {
					A_sql.push(this.makeAddRelationTelReserveSQL(H_val, "reserve"));
				}

				this.makeTerminalReserveSQL(H_sess, O_assets, A_sql);
				A_sql.push(this.makeModReserveLogSQL(H_val));
			} else //tel_tbへの更新文作成
			//tel_rel_tel_tbへの更新文作成
			//管理記録
			{
				this.setTableName(H_sess[ManagementTelModel.PUB].cym);
				O_assets.setTableName(H_sess[ManagementTelModel.PUB].cym);
				A_sql.push(this.makeModManageSQL(H_sess));

				if (undefined != this.makeAddRelationTelSQL(H_val)) {
					A_sql.push(this.makeAddRelationTelSQL(H_val));
				}

				if (undefined !== H_val.pastflg == true && H_val.pastflg == 1) //tel_tbへの更新文作成
					//tel_rel_tel_tbへの更新文作成
					{
						A_sql.push(this.makeModManageSQL(H_sess, true));

						if (undefined != this.makeAddRelationTelSQL(H_val, true)) {
							A_sql.push(this.makeAddRelationTelSQL(H_val, true));
						}
					}

				this.makeTerminalSQL(H_sess, O_assets, A_sql);
				A_sql.push(this.makeModLogSQL(H_val, H_sess[ManagementTelModel.PUB].cym));
			}

		if (H_sess.SELF.pre_extensionno != H_val.extensionno) {
			var O_extension = this.getExtensionTelModel();
			O_extension.setTableNo(this.H_Tb.tableno);

			if (!!H_val.extensionno) {
				A_sql.push(O_extension.makeActivateExtensionNoSQL(this.H_G_Sess.pactid, H_val.extensionno, H_val.carid));
			}

			if (H_val.modtype != "reserve" && !!H_sess.SELF.pre_extensionno) {
				A_sql.push(O_extension.makeDisactivateExtensionNoSQL(this.H_G_Sess.pactid, H_sess.SELF.pre_extensionno));
			}

			if (undefined !== H_val.pastflg == true && H_val.pastflg == 1) {
				O_extension.setTableNo(this.H_Tb.pretableno);

				if (!!H_val.extensionno) {
					A_sql.push(O_extension.makeActivateExtensionNoSQL(this.H_G_Sess.pactid, H_val.extensionno, H_val.carid));
				}

				if (H_val.modtype != "reserve" && !!H_sess.SELF.pre_extensionno) {
					A_sql.push(O_extension.makeDisactivateExtensionNoSQL(this.H_G_Sess.pactid, H_sess.SELF.pre_extensionno));
				}
			}
		}

		return A_sql;
	}

	makeTerminalSQL(H_sess: {} | any[], O_assets, A_sql, chgflg = false) //名前が長いので
	//tel_rel_assets_tbのフラグリセット
	//前月も変更する時
	{
		var H_val = H_sess.SELF.post;
		H_val.telno = this.O_Manage.convertNoView(H_val.telno_view);
		var main_cnt = 0;
		this.resetMainflg(H_val, A_sql);

		if (undefined !== H_val.pastflg == true && H_val.pastflg == 1) {
			this.resetMainflg(H_val, A_sql, true);
		}

		for (var cnt = 0; cnt < H_val.asscnt; cnt++) //端末フォームの印を取り一台分だけ抜き取る
		//管理種別
		//フォームに入力があるかチェック
		//主端末があればカウント
		{
			var H_post = this.O_Manage.getOneAssFormValue(H_val, cnt);
			H_post.postid = H_val.recogpostid;
			H_post.postname = this.getPostName(H_val.recogpostid);
			H_post.telno = H_val.telno;
			H_post.carid = H_val.carid;
			H_post.assetstypeid = 1;

			if (this.checkAssFormInput(H_post) == false) //端末管理していない場合はフォームは一つのはずなのでコンテニューさせない（主端末無しになってしまうから）
				{
					if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == true) {} else {
						if (undefined !== H_post.assetsid == true && H_post.assetsid != "") //この端末の紐付き一覧取得
							//紐付き削除
							//予約があれば予約一覧取得（資産予約テーブル）
							//あれば削除
							//あれば削除
							{
								var A_rel = O_assets.getAllTelRelAssetsList(H_post.assetsid);

								if (A_rel.length > 0) {
									for (var lcnt = 0; lcnt < A_rel.length; lcnt++) {
										A_sql.push(this.makeDelTelRelAssetsSQL(A_rel[lcnt].telno, A_rel[lcnt].carid, H_post.assetsid));
									}
								}

								A_sql.push(O_assets.makeDelManageSQL(H_post));
								var A_reserve = this.getAllAssetsReserveList(H_post.assetsid);

								if (A_reserve.length > 0) {
									for (var acnt = 0; acnt < A_reserve.length; acnt++) //予約削除のログ
									{
										A_sql.push(this.makeDelAssetsReserveSQL(A_reserve[acnt].assetsid, A_reserve[acnt].reserve_date, A_reserve[acnt].add_edit_flg));
										A_sql.push(this.makeDelAssetsReserveLogSQL(A_reserve[acnt], "\u643A\u5E2F\u7AEF\u672B\u524A\u9664\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "\u524A\u9664"));
									}
								}

								var A_relreserve = this.getAllTelRelAssetsReserveList(H_post.assetsid);

								if (A_relreserve.length > 0) {
									for (var rcnt = 0; rcnt < A_relreserve.length; rcnt++) {
										A_sql.push(this.makeDelTelRelAssetsReserveSQL(A_relreserve[rcnt].telno, A_relreserve[rcnt].carid, A_relreserve[rcnt].assetsid, A_relreserve[rcnt].reserve_date, A_relreserve[rcnt].add_edit_flg));
									}
								}
							}

						if (undefined !== H_val.pastflg == true && H_val.pastflg == 1) {
							if (undefined !== H_post.assetsid == true && H_post.assetsid != "") //前月もその紐付きがあるか調べる
								{
									if (this.checkRelAssetsExist(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post.assetsid, true) === true) //紐付き削除
										//端末削除
										{
											A_sql.push(this.makeDelTelRelAssetsSQL(H_post.telno, H_post.carid, H_post.assetsid, true));
											A_sql.push(O_assets.makeDelManageSQL(H_post, true));
										}
								}
						}
					}

					continue;
				}

			if (H_val.asscnt == 1) {
				H_post.main_flg = "true";
			} else //端末管理している場合はラジオがあるものを主端末にする
				{
					if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == true) {
						H_post.main_flg = this.getMainflgStatus(H_post);
					} else {
						if (0 == cnt) {
							H_post.main_flg = "true";
						} else {
							H_post.main_flg = "false";
						}
					}
				}

			if (H_post.main_flg == "true") {
				main_cnt++;
			}

			if (H_val.asscnt == cnt && 0 == main_cnt) {
				H_post.main_flg = "true";
			}

			if (undefined !== H_post.ass_rel_check === true && "1" === H_post.ass_rel_check["2"]) //この端末の紐付き一覧取得
				//紐付き削除
				//予約があれば予約一覧取得（資産予約テーブル）
				//あれば削除
				//あれば削除
				//前月も変更する時
				{
					A_rel = O_assets.getAllTelRelAssetsList(H_post.assetsid);

					if (A_rel.length > 0) {
						for (lcnt = 0;; lcnt < A_rel.length; lcnt++) {
							A_sql.push(this.makeDelTelRelAssetsSQL(A_rel[lcnt].telno, A_rel[lcnt].carid, H_post.assetsid));
						}
					}

					A_sql.push(O_assets.makeDelManageSQL(H_post));
					A_reserve = this.getAllAssetsReserveList(H_post.assetsid);

					if (A_reserve.length > 0) {
						for (acnt = 0;; acnt < A_reserve.length; acnt++) //予約削除のログ
						{
							A_sql.push(this.makeDelAssetsReserveSQL(A_reserve[acnt].assetsid, A_reserve[acnt].reserve_date, A_reserve[acnt].add_edit_flg));
							A_sql.push(this.makeDelAssetsReserveLogSQL(A_reserve[acnt], "\u643A\u5E2F\u7AEF\u672B\u524A\u9664\u306B\u3088\u308B\u4E88\u7D04\u524A\u9664", "\u524A\u9664"));
						}
					}

					A_relreserve = this.getAllTelRelAssetsReserveList(H_post.assetsid);

					if (A_relreserve.length > 0) {
						for (rcnt = 0;; rcnt < A_relreserve.length; rcnt++) {
							A_sql.push(this.makeDelTelRelAssetsReserveSQL(A_relreserve[rcnt].telno, A_relreserve[rcnt].carid, A_relreserve[rcnt].assetsid, A_relreserve[rcnt].reserve_date, A_relreserve[rcnt].add_edit_flg));
						}
					}

					A_sql.push(this.makeAssetsDelLogSQL(H_post, H_post, cym));

					if (undefined !== H_val.pastflg == true && H_val.pastflg == 1) //前月もその紐付きがあるか調べる（かつ主端末ではない）
						{
							if (this.checkRelAssetsExist(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post.assetsid, true) === true && this.checkRelAssetsMainFlg(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post.assetsid, true) === false) //紐付き削除
								//端末削除
								{
									A_sql.push(this.makeDelTelRelAssetsSQL(H_post.telno, H_post.carid, H_post.assetsid, true));
									A_sql.push(O_assets.makeDelManageSQL(H_post, true));
								}
						}
				} else if (undefined !== H_post.ass_rel_check === true && "1" === H_post.ass_rel_check["1"]) //delete文作成
				//他で使われている端末か調べる
				{
					A_sql.push(this.makeDelTelRelAssetsSQL(H_post.telno, H_post.carid, H_post.assetsid));

					if (this.checkUsedTerminal(this.O_Manage.convertNoView(H_val.telno_view), H_val.carid, H_post.assetsid) === false) //どの回線にも使われていないのでダミー電話番号作成
						//tel_rel_assets_tbへのインサート文作成
						{
							var telno = this.makeDummyTelNo();
							var H_dummy = H_post;
							H_dummy.telno = telno;
							A_sql.push(this.makeDummyTelSQL(H_val, telno));
							A_sql.push(this.makeAddRelationAssetsSQL(H_dummy, H_dummy.assetsid));
						}

					if (undefined !== H_val.pastflg == true && H_val.pastflg == 1) //前月もその紐付きがあるか調べる（かつ主端末ではない）
						{
							if (this.checkRelAssetsExist(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post.assetsid, true) === true && this.checkRelAssetsMainFlg(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post.assetsid, true) === false) //delete文作成
								//他で使われている端末か調べる
								{
									A_sql.push(this.makeDelTelRelAssetsSQL(H_post.telno, H_post.carid, H_post.assetsid, true));

									if (this.checkUsedTerminal(this.O_Manage.convertNoView(H_val.telno_view), H_val.carid, H_post.assetsid) === false) //どの回線にも使われていないのでダミー電話番号作成
										//tel_rel_assets_tbへのインサート文作成
										{
											A_sql.push(this.makeDummyTelSQL(H_val, telno, true));
											A_sql.push(this.makeAddRelationAssetsSQL(H_post, H_post.assetsid, true));
										}
								}
						}
				} else //足り無い情報るのでセッションから取得
				//assets_tbへの更新文作成（新規）
				{
					H_post.recogpostid = H_val.recogpostid;
					H_post.telno = H_val.telno;
					H_post.telno_view = H_val.telno_view;
					H_post.carid = H_val.carid;

					if (H_post.assetsid == "") //削除フラグの立ったデータがあるか調べる
						//insert文作成
						//tel_rel_assets_tbへのインサート文作成
						//前月も変更する時
						{
							if (O_assets.checkDeleteNoExist(H_post) == true) {
								A_sql.push(O_assets.makeDelAssetsNoSQL(H_post.assetsno));
							}

							var assetsid = O_assets.getNextAssetsid();
							A_sql.push(O_assets.makeAddManageSQL(H_post, assetsid));
							A_sql.push(this.makeAddRelationAssetsSQL(H_post, assetsid));

							if (undefined !== H_val.pastflg == true && H_val.pastflg == "1") //前月に存在するか？
								{
									var H_apost = H_post;
									H_apost.recogpostid = this.getTelPostid(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, true);

									if (false == O_assets.checkAssetsNoExist(H_apost, "add", true)) //削除フラグの立ったデータがあるか調べる
										//tel_rel_assets_tbへのインサート文作成
										{
											if (O_assets.checkDeleteNoExist(H_apost, true) == true) {
												A_sql.push(O_assets.makeDelAssetsNoSQL(H_apost.assetsno, true));
											}

											A_sql.push(O_assets.makeAddManageSQL(H_apost, assetsid, true));
											A_sql.push(this.makeAddRelationAssetsSQL(H_apost, assetsid, true));
										}
								}
						} else //update文作成
						//既存と紐付けた時
						//前月も変更する時
						{
							var H_tmp = Array();
							H_tmp.SELF.post = H_post;
							A_sql.push(O_assets.makeModManageSQL(H_tmp));

							if (H_post.get_flg == "1") //tel_rel_assets_tbへのインサート文作成
								{
									A_sql.push(this.makeAddRelationAssetsSQL(H_post, H_post.assetsid));
								} else {
								A_sql.push(this.makeUpdateTelRelAssetsSQL(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post));
							}

							if (undefined !== H_val.pastflg == true && H_val.pastflg == "1") //前月に存在するか？
								{
									if (true == O_assets.checkAssetsExist(H_post.assetsid, true)) //削除フラグの立ったデータがあるか調べる
										//前月にひもづきが無い
										{
											if (O_assets.checkDeleteNoExist(H_post, true) == true) {
												A_sql.push(O_assets.makeDelAssetsNoSQL(H_post.assetsno, true));
											}

											A_sql.push(O_assets.makeModManageSQL(H_tmp, true));

											if (this.checkRelAssetsExist(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post.assetsid, true) == false) //tel_rel_assets_tbへのインサート文作成
												{
													A_sql.push(this.makeAddRelationAssetsSQL(H_post, H_post.assetsid, true));
												} else {
												A_sql.push(this.makeUpdateTelRelAssetsSQL(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, H_post, true));
											}
										} else //insert文作成
										//tel_rel_assets_tbへのインサート文作成
										{
											H_apost = H_post;
											H_apost.recogpostid = this.getTelPostid(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, true);
											A_sql.push(O_assets.makeAddManageSQL(H_apost, H_apost.assetsid, true));
											A_sql.push(this.makeAddRelationAssetsSQL(H_apost, H_apost.assetsid, true));
										}
								}
						}
				}
		}
	}

	makeTerminalReserveSQL(H_sess: {} | any[], O_assets, A_sql, chgflg = false) //名前が長いので
	//端末フォーム数分ループ
	{
		var H_val = H_sess.SELF.post;
		H_val.telno = this.O_Manage.convertNoView(H_val.telno_view);
		var main_cnt = 0;

		for (var cnt = 0; cnt < H_val.asscnt; cnt++) //端末フォームの印を取り一台分だけ抜き取る
		//管理種別
		//フォームに入力があるかチェック
		//主端末があればカウント
		//assets_tbへの更新文作成（新規）
		{
			var H_post = this.O_Manage.getOneAssFormValue(H_val, cnt);
			H_post.telno = H_val.telno;
			H_post.carid = H_val.carid;
			H_post.assetstypeid = 1;

			if (this.checkAssFormInput(H_post) == false) {
				continue;
			}

			if (H_val.asscnt == 1) {
				H_post.main_flg = "true";
			} else //端末管理している場合はラジオがあるものを主端末にする
				{
					if (-1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_us") == true && -1 !== this.A_Auth.indexOf("fnc_assets_manage_adm_co") == true) {
						H_post.main_flg = this.getMainflgStatus(H_post);
					} else {
						if (0 == cnt) {
							H_post.main_flg = "true";
						} else {
							H_post.main_flg = "false";
						}
					}
				}

			if (H_post.main_flg == "true") {
				main_cnt++;
			}

			if (H_val.asscnt == cnt && 0 == main_cnt) {
				H_post.main_flg = "true";
			}

			if (undefined !== H_post.ass_rel_check === true && "1" === H_post.ass_rel_check["2"]) {
				H_post.rel_flg = "2";
			} else if (undefined !== H_post.ass_rel_check === true && "1" === H_post.ass_rel_check["1"]) {
				H_post.rel_flg = "1";
			} else {
				H_post.rel_flg = "0";
			}

			if (H_post.assetsid == "") //足り無い情報はセッションから取得
				//端末のシーケンスID取得
				//assets_reserve_tbへのインサート文作成
				//tel_rel_assets_reserve_tbへのインサート文作成
				{
					H_post.recogpostid = H_val.recogpostid;
					H_post.telno_view = H_val.telno_view;
					H_post.carid = H_val.carid;
					H_post.add_edit_flg = ManagementTelModel.MODMODE;
					H_post.reserve_date = this.O_Manage.convertDatetime(H_val.moddate);
					var assetsid = O_assets.getNextAssetsid();
					A_sql.push(O_assets.makeInsertAssetsReserveSQL(H_post, assetsid, "reserve"));
					A_sql.push(this.makeAddRelationAssetsReserveSQL(H_post, assetsid, "reserve"));
				} else //足り無い情報はセッションから取得
				//assets_reserve_tbへのインサート文作成
				//tel_rel_assets_reserve_tbへのインサート文作成
				//前月も変更する時
				{
					H_post.recogpostid = H_val.recogpostid;
					H_post.carid = H_val.carid;
					H_post.add_edit_flg = ManagementTelModel.MODMODE;
					H_post.reserve_date = this.O_Manage.convertDatetime(H_val.moddate);
					A_sql.push(O_assets.makeInsertAssetsReserveSQL(H_post, H_post.assetsid, "reserve"));
					A_sql.push(this.makeAddRelationAssetsReserveSQL(H_post, H_post.assetsid, "reserve"));

					if (undefined !== H_val.pastflg == true && H_post.pastflg == 1) //tel_tbへの更新文作成
						{
							A_sql.push(this.makeModManageSQL(H_post, true));
						}
				}
		}
	}

	deleteAssetsReserveProc(O_assets, A_reserve, mess1, mess2, date = undefined) //あれば消す
	{
		var A_sql = Array();

		for (var cnt = 0; cnt < A_reserve.length; cnt++) //削除文作成
		//管理記録作成
		//その予約に関連電話予約があるか調べる
		//その予約に端末予約があるか調べる
		//あれば消す
		{
			A_sql.push(this.makeDelTelReserveSQL(A_reserve[cnt].telno, A_reserve[cnt].carid, A_reserve[cnt].reserve_date, A_reserve[cnt].add_edit_flg));
			A_sql.push(this.makeDelReserveLogSQL(A_reserve[cnt], mess1, mess2));
			var A_reltelreserve = this.getTelRelTelReserveList(A_reserve[cnt].telno, A_reserve[cnt].carid, A_reserve[cnt].reserve_date, A_reserve[cnt].add_edit_flg);
			var A_relreserve = this.getTelRelAssetsReserveList(A_reserve[cnt].telno, A_reserve[cnt].carid, A_reserve[cnt].reserve_date, A_reserve[cnt].add_edit_flg);

			for (var rcnt = 0; rcnt < A_relreserve.length; rcnt++) //削除文作成
			//そこに紐付く端末予約の取得
			{
				A_sql.push(this.makeDelTelRelAssetsReserveSQL(A_relreserve[cnt].telno, A_relreserve[cnt].carid, A_relreserve[rcnt].assetsid, A_relreserve[cnt].reserve_date, A_relreserve[cnt].add_edit_flg));
				var A_assreserve = O_assets.getAssetsReserveList(A_relreserve[cnt].assetsid, A_relreserve[cnt].reserve_date, A_relreserve[cnt].add_edit_flg);

				for (var acnt = 0; acnt < A_assreserve.length; acnt++) //削除文作成
				{
					A_sql.push(this.makeDelAssetsReserveSQL(A_assreserve[acnt].assetsid, A_assreserve[acnt].reserve_date, A_assreserve[acnt].add_edit_flg));
				}
			}
		}

		return A_sql;
	}

	makeAddManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_tb;
		} else {
			tb = this.H_Tb.tel_tb;
		}

		var sql = this.makeInsertTelSQL(H_post, tb);
		return sql;
	}

	makeDelManageSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_tb;
		} else {
			tb = this.H_Tb.tel_tb;
		}

		var sql = this.makeDelTelSQL(this.O_Manage.convertNoView(H_post.telno_view), H_post.carid, tb);
		return sql;
	}

	makeInsertTelSQL(H_post, tb) {
		var sql = "insert into " + tb + " (" + this.makeColumns().join(",") + ") values (" + this.makeValues(H_post).join(",") + ")";
		return sql;
	}

	makeInsertTelReserveSQL(H_post) {
		var sql = "insert into " + this.H_Tb.tel_reserve_tb + " (" + this.makeColumns("reserve").join(",") + ") values (" + this.makeValues(H_post, "reserve").join(",") + ")";
		return sql;
	}

	makeUpdateTelSQL(H_sess, tb) {
		var sql = "update " + tb + " set " + this.makeUpdateSetSQL(this.makeColumns("update"), this.makeValues(H_sess.post, "update")) + " where " + this.makeCommonTelWhere(H_sess.get.manageno, H_sess.get.coid, "false");
		return sql;
	}

	makeDelTelSQL(telno, carid, tb) {
		var sql = "delete from " + tb + " where " + this.makeCommonTelWhere(telno, carid);
		return sql;
	}

	makeModRelAssetsSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "select assetsid from " + tb + " where " + this.makeCommonTelWhere(this.O_Manage.convertNoView(H_post.pre_telno_view), H_post.pre_carid);
		var H_res = this.get_DB().queryHash(sql);
		var A_sql = Array();

		for (var cnt = 0; cnt < H_res.length; cnt++) {
			sql = "update " + tb + " set " + " telno=" + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.telno_view), "text", true) + "," + " carid=" + this.get_DB().dbQuote(H_post.carid, "integer", true) + " where " + this.makeCommonTelWhere(H_post.pre_telno_view, H_post.pre_carid) + " and " + " assetsid=" + this.get_DB().dbQuote(H_res[cnt].assetsid, "integer", true);
			A_sql.push(sql);
		}

		return A_sql;
	}

	makeModRelTelSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_tel_tb;
		} else {
			tb = this.H_Tb.tel_rel_tel_tb;
		}

		var sql = "select telno,carid,rel_telno,rel_carid from " + tb + " where " + " ( telno=" + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.pre_telno_view), "text", true) + " and " + " carid=" + this.get_DB().dbQuote(H_post.pre_carid, "integer", true) + ")" + " or " + " ( rel_telno=" + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.pre_telno_view), "text", true) + " and " + " rel_carid=" + this.get_DB().dbQuote(H_post.pre_carid, "integer", true) + ")";
		var H_res = this.get_DB().queryHash(sql);
		var A_sql = Array();

		for (var cnt = 0; cnt < H_res.length; cnt++) //元が自分
		{
			sql = "update " + tb + " set ";

			if (H_res[cnt].telno == this.O_Manage.convertNoView(H_post.pre_telno_view) && H_res[cnt].carid == H_post.pre_carid) {
				sql += " telno=" + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.telno_view), "text", true) + "," + " carid=" + this.get_DB().dbQuote(H_post.carid, "integer", true);
			} else {
				sql += " rel_telno=" + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.telno_view), "text", true) + "," + " rel_carid=" + this.get_DB().dbQuote(H_post.carid, "integer", true);
			}

			sql += " where " + " telno=" + this.get_DB().dbQuote(H_res[cnt].telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(H_res[cnt].carid, "integer", true) + " and " + " rel_telno=" + this.get_DB().dbQuote(H_res[cnt].rel_telno, "text", true) + " and " + " rel_carid=" + this.get_DB().dbQuote(H_res[cnt].rel_carid, "integer", true);
			A_sql.push(sql);
		}

		return A_sql;
	}

	makeTelSelectSQL(mode = "now") //予約のカラム
	{
		var A_col = ["te.postid", this.H_Tb.post_tb + ".userpostid", this.H_Tb.post_tb + ".postname", "te.telno", "te.telno_view", "te.mail", "te.carid", "carrier_tb.carname", "carrier_tb.carname_eng", "te.cirid", "circuit_tb.cirname", "circuit_tb.cirname_eng", "te.buyselid", "buyselect_tb.buyselname", "buyselect_tb.buyselname_eng", "te.planid", "plan_tb.planname", "plan_tb.planname_eng", "te.planalert", "te.packetid", "packet_tb.packetname", "packet_tb.packetname_eng", "te.packetalert", "te.pointstage as pointid", "point_tb.pointname", "point_tb.pointname_eng", "te.arid", "area_tb.arname", "area_tb.arname_eng", "te.discounts", "te.options", "te.machine", "te.color", "te.username", "te.employeecode", "te.userid", "us.username as billusername", "te.memo", "te.orderdate", "te.contractdate", "coalesce(te.kousiflg,'2') as kousiflg", "te.kousiptn", "kp.patternname", "te.text1", "te.text2", "te.text3", "te.text4", "te.text5", "te.text6", "te.text7", "te.text8", "te.text9", "te.text10", "te.text11", "te.text12", "te.text13", "te.text14", "te.text15", "te.int1", "te.int2", "te.int3", "te.int4", "te.int5", "te.int6", "te.date1", "te.date2", "te.date3", "te.date4", "te.date5", "te.date6", "te.mail1", "te.mail2", "te.mail3", "te.url1", "te.url2", "te.url3", "te.select1", "te.select2", "te.select3", "te.select4", "te.select5", "te.select6", "te.select7", "te.select8", "te.select9", "te.select10", "te.description1", "te.description2", "te.description3", "te.simcardno", "te.dummy_flg", "te.extensionno", "ass.assetsid", "ass.assetsno", "ass.assetstypeid", "case when att1.assetstypeid is not null then att1.assetstypename else att2.assetstypename end as assetstypename", "ass.serialno", "ass.seriesname", "ass.productid", "ass.productname", "ass.branchid", "ass.property", "ass.search_carid", "asscar.carname as search_carname", "ass.search_cirid", "asscir.cirname as search_cirname", "ass.bought_date", "ass.bought_price", "ass.pay_startdate", "ass.pay_frequency", "ass.pay_monthly_sum", "ass.firmware", "ass.version", "ass.smpcirid", "ass.receiptdate", "smart_circuit_tb.smpcirname", "smart_circuit_tb.smpcirname_eng", "ass.accessory", "ass.memo as note", "coalesce(tra.main_flg,true) as main_flg", "te.webreliefservice", "recogu.username as recogname", "te.recogcode", "pbpo.postname as pbpostname", "te.pbpostcode", "cfbpo.postname as cfbpostname", "te.cfbpostcode", "te.ioecode", "te.coecode", "te.pbpostcode_first", "te.pbpostcode_second", "te.cfbpostcode_first", "te.cfbpostcode_second", "te.commflag", "te.division", "case when prd.productname is null then ass.productname else prd.productname end as productname_now", "te.employee_class", "te.executive_no", "te.executive_name", "te.executive_mail", "te.salary_source_name", "te.salary_source_code", "te.office_code", "te.office_name", "te.building_name"];

		if ("reserve" === mode) {
			var A_r_col = ["te.add_edit_flg", "te.reserve_date", "te.movepostid", "te.exe_state", "te.exe_date", "te.exe_postid", "exe_po.postname as exe_postname", "te.exe_userid", "exe_us.username as exe_username", "te.exe_name"];
			A_col = array_merge(A_col, A_r_col);
		}

		return A_col.join(",");
	}

	putTableAlias(val) {
		var res = "te." + val;
		return res;
	}

	makeValues(H_post, type = "insert") //ユーザ設定項目
	//契約日整形
	//地域会社（空なら地域会社無）
	//新規のみの項目
	{
		H_post = this.makePropValue(H_post);

		if (undefined !== H_post.orderdate === true && Array.isArray(H_post.orderdate) === true) {
			H_post.orderdate = this.O_Manage.convertDatetime(H_post.orderdate);
		}

		if (undefined !== H_post.contractdate === true && Array.isArray(H_post.contractdate) === true) {
			H_post.contractdate = this.O_Manage.convertDatetime(H_post.contractdate);
		}

		for (var cnt = 1; cnt <= 6; cnt++) {
			H_post["date" + cnt] = this.O_Manage.convertDatetime(H_post["date" + cnt]);
		}

		if (H_post.arid == "") {
			H_post.arid = 100;
		}

		H_post.recogcode = !(undefined !== H_post.recogcode) ? "" : H_post.recogcode;
		H_post.pbpostcode_first = !(undefined !== H_post.pbpostcode_first) ? "" : H_post.pbpostcode_first;
		H_post.pbpostcode_second = !(undefined !== H_post.pbpostcode_second) ? "" : H_post.pbpostcode_second;
		H_post.cfbpostcode_first = !(undefined !== H_post.cfbpostcode_first) ? "" : H_post.cfbpostcode_first;
		H_post.cfbpostcode_second = !(undefined !== H_post.cfbpostcode_second) ? "" : H_post.cfbpostcode_second;
		H_post.ioecode = !(undefined !== H_post.ioecode) ? "" : H_post.ioecode;
		H_post.coecode = !(undefined !== H_post.coecode) ? "" : H_post.coecode;
		H_post.pbpostcode = H_post.pbpostcode_first + H_post.pbpostcode_second;
		H_post.cfbpostcode = H_post.cfbpostcode_first + H_post.cfbpostcode_second;
		H_post.commflag = !(undefined !== H_post.commflag) ? "" : H_post.commflag;
		H_post.division = !(undefined !== H_post.division) ? undefined : H_post.division;
		var A_val = [this.get_DB().dbQuote(H_post.telno_view, "text", true, "telno_view"), this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.telno_view), "text", true, "telno"), this.get_DB().dbQuote(H_post.mail, "text"), this.get_DB().dbQuote(H_post.userid, "integer"), this.get_DB().dbQuote(H_post.carid, "integer", true, "carid"), this.get_DB().dbQuote(H_post.arid, "integer"), this.get_DB().dbQuote(H_post.cirid, "integer", true, "cirid"), this.get_DB().dbQuote(H_post.planid, "integer"), this.get_DB().dbQuote(this.getPlanAlertFlg(H_post.carid, H_post.cirid, H_post.planid), "text"), this.get_DB().dbQuote(H_post.packetid, "integer"), this.get_DB().dbQuote(this.getPacketAlertFlg(H_post.carid, H_post.cirid, H_post.packetid), "text"), this.get_DB().dbQuote(H_post.pointid, "integer"), this.get_DB().dbQuote(H_post.buyselid, "integer"), this.get_DB().dbQuote(serialize(H_post.opid), "text"), this.get_DB().dbQuote(serialize(H_post.discountid), "text"), this.get_DB().dbQuote(H_post.username, "text"), this.get_DB().dbQuote(H_post.employeecode, "text"), this.get_DB().dbQuote(H_post.simcardno, "text"), this.get_DB().dbQuote(H_post.memo, "text"), this.get_DB().dbQuote(H_post.orderdate, "timestamp"), this.get_DB().dbQuote(H_post.contractdate, "timestamp"), this.get_DB().dbQuote(H_post.machine, "text"), this.get_DB().dbQuote(H_post.color, "text"), this.get_DB().dbQuote(H_post.webrelief, "text", false), this.get_DB().dbQuote(H_post.recogcode, "text", false), this.get_DB().dbQuote(H_post.pbpostcode, "text", false), this.get_DB().dbQuote(H_post.pbpostcode_first, "text", false), this.get_DB().dbQuote(H_post.pbpostcode_second, "text", false), this.get_DB().dbQuote(H_post.cfbpostcode, "text", false), this.get_DB().dbQuote(H_post.cfbpostcode_first, "text", false), this.get_DB().dbQuote(H_post.cfbpostcode_second, "text", false), this.get_DB().dbQuote(H_post.ioecode, "text", false), this.get_DB().dbQuote(H_post.coecode, "text", false), this.get_DB().dbQuote(H_post.commflag, "text", false), this.get_DB().dbQuote(H_post.division, "int", false), this.get_DB().dbQuote(H_post.text1, "text"), this.get_DB().dbQuote(H_post.text2, "text"), this.get_DB().dbQuote(H_post.text3, "text"), this.get_DB().dbQuote(H_post.text4, "text"), this.get_DB().dbQuote(H_post.text5, "text"), this.get_DB().dbQuote(H_post.text6, "text"), this.get_DB().dbQuote(H_post.text7, "text"), this.get_DB().dbQuote(H_post.text8, "text"), this.get_DB().dbQuote(H_post.text9, "text"), this.get_DB().dbQuote(H_post.text10, "text"), this.get_DB().dbQuote(H_post.text11, "text"), this.get_DB().dbQuote(H_post.text12, "text"), this.get_DB().dbQuote(H_post.text13, "text"), this.get_DB().dbQuote(H_post.text14, "text"), this.get_DB().dbQuote(H_post.text15, "text"), this.get_DB().dbQuote(H_post.int1, "integer"), this.get_DB().dbQuote(H_post.int2, "integer"), this.get_DB().dbQuote(H_post.int3, "integer"), this.get_DB().dbQuote(H_post.int4, "integer"), this.get_DB().dbQuote(H_post.int5, "integer"), this.get_DB().dbQuote(H_post.int6, "integer"), this.get_DB().dbQuote(H_post.date1, "timestamp"), this.get_DB().dbQuote(H_post.date2, "timestamp"), this.get_DB().dbQuote(H_post.date3, "timestamp"), this.get_DB().dbQuote(H_post.date4, "timestamp"), this.get_DB().dbQuote(H_post.date5, "timestamp"), this.get_DB().dbQuote(H_post.date6, "timestamp"), this.get_DB().dbQuote(H_post.mail1, "text"), this.get_DB().dbQuote(H_post.mail2, "text"), this.get_DB().dbQuote(H_post.mail3, "text"), this.get_DB().dbQuote(H_post.url1, "text"), this.get_DB().dbQuote(H_post.url2, "text"), this.get_DB().dbQuote(H_post.url3, "text"), this.get_DB().dbQuote(H_post.select1, "text"), this.get_DB().dbQuote(H_post.select2, "text"), this.get_DB().dbQuote(H_post.select3, "text"), this.get_DB().dbQuote(H_post.select4, "text"), this.get_DB().dbQuote(H_post.select5, "text"), this.get_DB().dbQuote(H_post.select6, "text"), this.get_DB().dbQuote(H_post.select7, "text"), this.get_DB().dbQuote(H_post.select8, "text"), this.get_DB().dbQuote(H_post.select9, "text"), this.get_DB().dbQuote(H_post.select10, "text"), this.get_DB().dbQuote(this.NowTime, "timestamp", true), this.get_DB().dbQuote(H_post.kousiflg, "text"), this.get_DB().dbQuote(H_post.kousiptnid, "integer"), this.get_DB().dbQuote(H_post.pre_telno, "text"), this.get_DB().dbQuote(H_post.pre_carid, "text"), this.get_DB().dbQuote(H_post.extensionno, "text"), "'f'", this.get_DB().dbQuote(H_post.employee_class, "integer"), this.get_DB().dbQuote(H_post.executive_no, "text"), this.get_DB().dbQuote(H_post.executive_name, "text"), this.get_DB().dbQuote(H_post.executive_mail, "text"), this.get_DB().dbQuote(H_post.salary_source_name, "text"), this.get_DB().dbQuote(H_post.salary_source_code, "text"), this.get_DB().dbQuote(H_post.office_code, "text"), this.get_DB().dbQuote(H_post.office_name, "text"), this.get_DB().dbQuote(H_post.building_name, "text")];

		if ("insert" == type) {
			A_val.push(this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid"));
			A_val.push(this.get_DB().dbQuote(H_post.recogpostid, "integer", true, "postid"));
			A_val.push(this.get_DB().dbQuote(this.NowTime, "timestamp", true));
		} else if ("reserve" == type) {
			A_val.push(this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true, "pactid"));
			A_val.push(this.get_DB().dbQuote(H_post.recogpostid, "integer", true, "postid"));
			A_val.push(this.get_DB().dbQuote(H_post.movepostid, "integer", false, "postid"));
			A_val.push(this.get_DB().dbQuote(H_post.reserve_date, "timestamp", true, "reserve_date"));
			A_val.push(this.get_DB().dbQuote(this.H_G_Sess.loginname, "text", true, "exe_username"));
			A_val.push(this.get_DB().dbQuote(this.H_G_Sess.userid, "integer", true, "exe_userid"));
			A_val.push(this.get_DB().dbQuote(H_post.reserve_date, "timestamp", true, "reserve_date"));
			A_val.push(this.get_DB().dbQuote(H_post.add_edit_flg, "integer", true, "add_edit_flg"));
			A_val.push(this.get_DB().dbQuote(this.H_G_Sess.postid, "integer", true, "postid"));
			A_val.push(this.get_DB().dbQuote(this.H_G_Sess.userid, "integer", true, "userid"));
			A_val.push(this.get_DB().dbQuote(this.H_G_Sess.loginname, "text", true, "username"));
			A_val.push(this.get_DB().dbQuote(this.NowTime, "timestamp", true, "recdate"));
			A_val.push(this.get_DB().dbQuote(H_post.delete_type, "integer", false, "delete_type"));
		}

		return A_val;
	}

	getList(H_sess: {} | any[], H_trg: {} | any[], A_post: {} | any[]) //menuからの値を配列に整形
	//tel_tbから取得
	//配下の対象が無ければエラー
	{
		this.setTableName(H_sess.cym);
		var A_data = Array();
		var A_rows = this.splitArrrayRow(H_trg);

		for (var cnt = 0; cnt < A_rows.length; cnt++) //電話データ
		//現在指定ならば
		//電話データと合体
		{
			var A_tel = this.get_DB().queryRowHash(this.makeTelListSQL(A_post, A_rows[cnt]));

			if (H_sess.cym === this.YM) //予約データ
				//電話データと合体
				{
					var A_res = this.get_DB().queryHash(this.makeReserveTelListSQL(A_post, A_rows[cnt]));

					if (Array.isArray(A_res) === true && A_res.length > 0) {
						var A_res_data = this.makeReserveTelData(A_res);
						A_tel = array_merge(A_tel, A_res_data);
					}
				}

			var A_rel = this.get_DB().queryHash(this.makeRelTelListSQL(A_rows[cnt].telno, A_rows[cnt].carid));
			var A_rel_data = this.makeRelTelData(A_rows[cnt].telno, A_rows[cnt].carid, A_rel, A_post);

			if (Array.isArray(A_rel_data) === true && A_rel_data.length > 0) {
				A_tel = array_merge(A_tel, A_rel_data);
			}

			A_data.push(A_tel);
		}

		if (A_data.length === 0) {
			this.errorOut(19, "\u51E6\u7406\u5BFE\u8C61\u304C\u914D\u4E0B\u306B\u7121\u3044", false, "./menu.php");
			throw die();
		}

		return A_data;
	}

	splitArrrayRow(H_trg: {} | any[]) {
		var A_rows = Array();

		for (var key in H_trg) {
			var value = H_trg[key];
			var A_line = Array();

			if (preg_match("/^id/", key) == true) {
				var A_tmp = split(":", value);
				A_line.postid = A_tmp[0];
				A_line.telno = A_tmp[1];
				A_line.carid = A_tmp[2];
				A_rows.push(A_line);
			}
		}

		return A_rows;
	}

	makeTelWhereSQL(H_row, type = "now") {
		var sql = " and " + "te.telno=" + this.get_DB().dbQuote(H_row.telno, "text", true) + " and " + "te.carid=" + this.get_DB().dbQuote(H_row.carid, "text", true);

		if ("reserve" === type) {
			sql += " and " + "te.exe_state=0";
		}

		return sql;
	}

	checkBillExist(H_sess) //テーブル名の決定
	//対象が今月
	{
		this.setTableName(H_sess[ManagementTelModel.PUB].cym);
		var billflg = false;

		if (this.YM == H_sess[ManagementTelModel.PUB].cym) //会社全体の請求数取得
			//まだ請求が上がっていないなら消せない
			{
				var pact_bill = this.getPactBillCnt(this.H_G_Sess.pactid, true);

				if (0 == pact_bill) {
					var bill_flg = false;
				} else //前月も変更のフラグあり（変更画面）
					{
						if (undefined !== H_sess.SELF.post.pastflg == true && 1 == H_sess.SELF.post.pastflg) //前月の請求無し
							{
								if (this.getBillCnt(H_sess.SELF.get.manageno, H_sess.SELF.get.coid, true) == 0) {
									billflg = false;
								} else {
									billflg = true;
								}
							}

						if (undefined !== H_sess.SELF.post.deldate == true) {
							if (Array.isArray(H_sess.SELF.post.deldate) == true) {
								var deldate = this.O_Manage.convertDatetime(H_sess.SELF.post.deldate, "");
							} else {
								deldate = H_sess.SELF.post.deldate.replace(/-/g, "");
							}

							var firstdate = this.YM + "01";

							if (deldate < firstdate) {
								billflg = false;
								{
									let _tmp_2 = H_sess.SELF.trg_list;

									for (var key in _tmp_2) {
										var val = _tmp_2[key];

										if (preg_match("/^id/", key) == true) //ひとつでも請求があればエラー
											{
												var A_val = split(":", val);

												if (this.getBillCnt(A_val[1], A_val[2], true) > 0) {
													billflg = true;
													break;
												}
											}
									}
								}
							}
						}
					}
			} else //会社全体の請求数取得
			//まだ請求が上がっていないなら消せない
			{
				pact_bill = this.getPactBillCnt(this.H_G_Sess.pactid);

				if (0 == pact_bill) {
					bill_flg = false;
				} else //削除の時
					{
						if (undefined !== H_sess.SELF.trg_list === true) {
							billflg = false;
							{
								let _tmp_3 = H_sess.SELF.trg_list;

								for (var key in _tmp_3) {
									var val = _tmp_3[key];

									if (preg_match("/^id/", key) == true) //ひとつでも請求があればエラー
										{
											A_val = split(":", val);

											if (this.getBillCnt(A_val[1], A_val[2]) > 0) {
												billflg = true;
												break;
											}
										}
								}
							}
						} else //請求無し
							{
								if (this.getBillCnt(H_sess.SELF.get.manageno, H_sess.SELF.get.coid) == 0) {
									billflg = false;
								} else {
									billflg = true;
								}
							}
					}
			}

		return billflg;
	}

	getPactBillCnt(pactid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_details_tb;
		} else {
			tb = this.H_Tb.tel_details_tb;
		}

		var sql = "select count(telno) from " + tb + " where " + " pactid=" + this.get_DB().dbQuote(pactid, "integer", true);
		return this.get_DB().queryOne(sql);
	}

	getBillCnt(telno, carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_details_tb;
		} else {
			tb = this.H_Tb.tel_details_tb;
		}

		var sql = "select count(telno) from " + tb + " where " + this.makeCommonTelWhere(telno, carid, undefined);
		return this.get_DB().queryOne(sql);
	}

	checkPreTelAuth(telno, carid, A_prepost) {
		var sql = "select count(telno) from " + this.H_Tb.pre_tel_tb + " where " + this.makeCommonTelWhere(telno, carid, "false");

		if (A_prepost.length > 0) {
			sql += " and " + " postid in (" + A_prepost.join(",") + ")";
		}

		return this.get_DB().queryOne(sql);
	}

	checkPreUserPostidAuth(userpostid) //件数を返す
	{
		var sql = "select count(postid) from " + this.H_Tb.pre_post_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " userpostid=" + this.get_DB().dbQuote(userpostid, "text", true);
		return this.get_DB().queryOne(sql);
	}

	getMastersList(H_sess) //キャリアと回線
	//現在の操作かどうか（メニューは全て過去扱い）
	//購入方式取得
	//プラン取得
	//パケット取得
	//ポイントサービス取得
	//地域会社取得
	//割引サービス取得
	//オプション取得
	//公私分計パターン取得
	//ウェブ安心サービス
	{
		var H_data = Array();
		var carid = H_sess.SELF.post.carid;
		var cirid = H_sess.SELF.post.cirid;
		var buyselid = H_sess.SELF.post.buyselid;
		var past = false;

		if (H_sess[ManagementTelModel.PUB].cym != date("Ym") || preg_match("/menu\\.php$/", _SERVER.HTTP_REFERER) == true) {
			past = true;
		}

		H_data.cirid = this.getCircuitData(carid);
		H_data.buyselid = this.getBuySelData(carid);
		H_data.planid = this.getPlanData(carid, cirid, buyselid, past);
		H_data.packetid = this.getPacketData(carid, cirid, past);
		H_data.pointid = this.getPointData(carid, cirid);
		H_data.arid = this.getAreaData(carid);
		H_data.discountid = this.getDiscountData(carid, cirid, past);
		H_data.opid = this.getOptionData(carid, cirid, past);
		H_data.kousiptnid = this.getKousiPtnData(this.H_G_Sess.pactid, carid);

		if (4 == carid) {
			H_data.webrelief = this.getWebReliefService();
		}

		return H_data;
	}

	makeAddRelationTelSQL(H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_tel_tb;
		} else {
			tb = this.H_Tb.tel_rel_tel_tb;
		}

		var sql = undefined;

		if (H_post.rel_telno_view != "" && H_post.rel_carid != "") {
			sql = "insert into " + tb + " (pactid,telno,carid,rel_telno,rel_carid) " + " values " + " (" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + "," + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.telno_view), "text", true) + "," + this.get_DB().dbQuote(H_post.carid, "integer", true) + "," + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.rel_telno_view), "text", true) + "," + this.get_DB().dbQuote(H_post.rel_carid, "integer", true) + ")";
		}

		return sql;
	}

	makeAddRelationTelReserveSQL(H_post) {
		var sql = undefined;

		if (H_post.rel_telno_view != "" && H_post.rel_carid != "") {
			sql = "insert into " + this.H_Tb.tel_rel_tel_reserve_tb + " (pactid,telno,carid,rel_telno,rel_carid,add_edit_flg,reserve_date,exe_state) " + " values " + " (" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + "," + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.telno_view), "text", true) + "," + this.get_DB().dbQuote(H_post.carid, "integer", true) + "," + this.get_DB().dbQuote(this.O_Manage.convertNoView(H_post.rel_telno_view), "text", true) + "," + this.get_DB().dbQuote(H_post.rel_carid, "integer", true) + "," + this.get_DB().dbQuote(H_post.add_edit_flg, "integer", true) + "," + this.get_DB().dbQuote(H_post.reserve_date, "timestamp", true) + "," + "0" + ")";
		}

		return sql;
	}

	makeAddRelationAssetsReserveSQL(H_post, assetsid) {
		var sql = "insert into " + this.H_Tb.tel_rel_assets_reserve_tb + " (pactid,telno,carid,assetsid,main_flg,reserve_date,add_edit_flg,exe_state) " + " values " + " (" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + "," + this.get_DB().dbQuote(H_post.telno, "text", true) + "," + this.get_DB().dbQuote(H_post.carid, "integer", true) + "," + this.get_DB().dbQuote(assetsid + "", "integer", true) + "," + this.get_DB().dbQuote(H_post.main_flg, "boolean", true) + "," + this.get_DB().dbQuote(H_post.reserve_date, "timestamp", true) + "," + this.get_DB().dbQuote(H_post.add_edit_flg, "integer", true) + "," + "0" + ")";
		return sql;
	}

	getPlanAlertFlg(carid, cirid, planid) //プラン未選択
	{
		var flg = "0";

		if (planid == "" || planid == undefined) //プラン数取得
			//プランがあるのに未選択ならアラート
			{
				var cnt = PlanModel.getPlanCnt(carid, cirid);

				if (cnt > 0) {
					flg = "1";
				}
			}

		return flg;
	}

	getPacketAlertFlg(carid, cirid, packetid) //パケット未選択
	{
		var flg = "0";

		if (packetid == "") //パケット数取得
			//パケットがあるのに未選択ならアラート
			{
				var cnt = PacketModel.getPacketCnt(carid, cirid);

				if (cnt > 0) {
					flg = "1";
				}
			}

		return flg;
	}

	putOneTelData(A_res, view = false) //select文の要素をループ
	//assets_tbのカラムにmain_flg追加
	//#53 現在の機種名追加
	//電話部分
	//端末数分ループ
	{
		var A_telcol = ["pointid", "recogname", "pbpostname", "cfbpostname"];
		var A_asscol = ["pre_assetsno", "note"];
		var H_data = Array();
		var A_tmp = split(",", this.makeTelSelectSQL());

		for (var ccnt = 0; ccnt < A_tmp.length; ccnt++) //tel_tbのカラムのみを取得
		{
			if (preg_match("/te\\.|po\\.|carrier_tb\\.|circuit_tb\\.|buyselect_tb\\.|plan_tb\\.|packet_tb\\.|us\\./", A_tmp[ccnt]) == true) {
				A_telcol.push(A_tmp[ccnt].replace(/te\.|po\.|carrier_tb\.|circuit_tb\.|buyselect_tb\.|plan_tb\.|packet_tb\.|us\.|coalesce\(/g, ""));
			}

			if (preg_match("/ass\\.|smart_circuit_tb\\./", A_tmp[ccnt]) == true) {
				A_asscol.push(A_tmp[ccnt].replace(/ass\.|smart_circuit_tb\./g, ""));
			}
		}

		for (var cnt = 0; cnt < A_asscol.length; cnt++) {
			if (preg_match("/coalesce/", A_asscol[cnt]) == true) {
				delete A_asscol[cnt];
			}
		}

		A_asscol.push("main_flg");
		A_asscol.push("productname_now");
		{
			let _tmp_4 = A_res[0];

			for (var key in _tmp_4) {
				var val = _tmp_4[key];

				if (-1 !== A_telcol.indexOf(key) == true) {
					H_data[key] = val;
				}
			}
		}

		for (cnt = 0;; cnt < A_res.length; cnt++) //productidがありsearchcaridが空
		{
			{
				let _tmp_5 = A_res[cnt];

				for (var key in _tmp_5) //主端末フラグだけ処理必要
				{
					var val = _tmp_5[key];

					if ("main_flg" == key) {
						if (true == val) {
							var val = "0";
						} else {
							continue;
						}
					}

					if (-1 !== A_asscol.indexOf(key) == true) //キャリアと回線と色
						{
							var new_key = key + "_" + strval(cnt);

							if ("search_carid" == key && "" != val) {
								H_data["searchcarid_" + strval(cnt)] = val;
							} else if ("search_cirid" == key && "" != val) {
								H_data["searchcirid_" + strval(cnt)] = val;
								H_data["searchciraj_" + strval(cnt)] = val;
							} else if ("seriesname" == key && "" != val) {
								H_data["seriesid_" + strval(cnt)] = val;
								H_data["seriesaj_" + strval(cnt)] = val;
								H_data[new_key] = val;
							} else if ("productid" == key && "" != val) {
								H_data[new_key] = val + ":" + A_res[cnt].productname_now;
								H_data["productaj_" + strval(cnt)] = val + ":" + A_res[cnt].productname_now;
							} else if ("branchid" == key && "" != val) {
								H_data[new_key] = val + ":" + A_res[cnt].property;
								H_data["property_" + strval(cnt)] = "";
								H_data["branchaj_" + strval(cnt)] = val + ":" + A_res[cnt].property;
							} else {
								H_data[new_key] = val;
							}
						}
				}
			}

			if ((H_data["productid_" + strval(cnt)] != undefined || H_data["productid_" + strval(cnt)] != "") && (H_data["searchcarid_" + strval(cnt)] == undefined || H_data["searchcarid_" + strval(cnt)] == "")) {
				var O_model = new ProductModel();
				H_data["searchcarid_" + strval(cnt)] = O_model.getSearchcaridFromProductid(A_res[cnt].productid);
			}

			if ((H_data["productid_" + strval(cnt)] != undefined || H_data["productid_" + strval(cnt)] != "") && (H_data["searchcirid_" + strval(cnt)] == undefined || H_data["searchcirid_" + strval(cnt)] == "")) {
				O_model = new ProductModel();
				H_data["searchcirid_" + strval(cnt)] = O_model.getSearchciridFromProductid(A_res[cnt].productid);
				H_data["searchciraj_" + strval(cnt)] = H_data["searchcirid_" + strval(cnt)];
			}

			if ((H_data["productid_" + strval(cnt)] != undefined || H_data["productid_" + strval(cnt)] != "") && (H_data["seriesid_" + strval(cnt)] == undefined || H_data["seriesid_" + strval(cnt)] == "")) {
				O_model = new ProductModel();
				H_data["seriesid_" + strval(cnt)] = O_model.getSeriesnameFromProductid(A_res[cnt].productid);
				H_data["seriesaj_" + strval(cnt)] = H_data["seriesid_" + strval(cnt)];
				H_data["seriesname_" + strval(cnt)] = H_data["seriesid_" + strval(cnt)];
			}

			if (false === view) //プルダウンの値があればテキストの値は要らない
				{
					if (H_data["productid_" + strval(cnt)] != "") {
						H_data["productname_" + strval(cnt)] = "";
					}

					if (H_data["branchid_" + strval(cnt)] != "") {
						H_data["property_" + strval(cnt)] = "";
					}
				}

			H_data["pre_assetsno_" + strval(cnt)] = H_data["assetsno_" + strval(cnt)];
		}

		return H_data;
	}

	checkAssFormInput(H_post) //元々値が入っている、無視するカラム
	//入力があればtrueを返す
	{
		var A_excol = ["postid", "postname", "telno", "carid", "assetstypeid", "assetsid", "searchcarid", "searchcirid", "searchciraj", "main_flg", "get_flg", "pre_assetsno", "pre_assetsid"];

		for (var key in H_post) //日付型などの配列の時
		{
			var val = H_post[key];

			if (Array.isArray(val) == true) {
				if (-1 !== A_excol.indexOf(key) == false) {
					for (var ckey in val) {
						var cval = val[ckey];

						if (cval != "") {
							return true;
						}
					}
				}
			} else {
				if (-1 !== A_excol.indexOf(key) == false && val != "") {
					return true;
				}
			}
		}

		return false;
	}

	getMainflgStatus(H_post) {
		for (var key in H_post) {
			var val = H_post[key];

			if ("main_flg" == key) {
				return "true";
			}
		}

		return "false";
	}

	getAssetsInfoByAssetsNo(assetsno) //結果は１件でなければエラー
	{
		var sql = "select " + " assetsid,assetsno,seriesname,productid,productname,branchid,property" + ",search_carid,search_cirid,serialno,bought_price,bought_date,pay_startdate,pay_frequency" + ",pay_monthly_sum,firmware,version,smpcirid,accessory,memo " + " from " + this.H_Tb.assets_tb + " where " + " pactid=" + this.getDB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " assetsno=" + this.getDB().dbQuote(assetsno, "text", true) + " and " + " assetstypeid=1" + " and " + " delete_flg=false";
		var H_res = this.getDB().queryHash(sql);

		if (H_res.length != 1) {
			return false;
		} else {
			return H_res[0];
		}
	}

	makeRelTelData(telno, carid, A_data, A_post) {
		var A_res = Array();

		if (Array.isArray(A_data) == true && A_data.length > 0) {
			A_res.rel_tel = Array();
			var A_tmp = Array();

			for (var cnt = 0; cnt < A_data.length; cnt++) //重複していない方が関連電話（telno、rel_telnoのいずれかは自身と同じなので）
			{
				var H_res = Array();

				if (A_data[cnt].telno == telno && A_data[cnt].carid == carid) {
					H_res.telno = A_data[cnt].rel_telno;
					H_res.carid = A_data[cnt].rel_carid;
					H_res.carname = A_data[cnt].rel_carname;
					H_res.carname_eng = A_data[cnt].rel_carname_eng;

					if (-1 !== A_post.indexOf(A_data[cnt].rel_postid) == false) //表示言語分岐
						{
							if (this.H_G_Sess.language == "ENG") {
								A_tmp.push(A_data[cnt].rel_telno_view + "(" + A_data[cnt].rel_carname_eng + ")<font class=\"alert\">\u203B\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tTelephone not authorized</font>");
							} else {
								A_tmp.push(A_data[cnt].rel_telno_view + "(" + A_data[cnt].rel_carname + ")<font class=\"alert\">\u203B\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\u6A29\u9650\u4E0B\u306B\u7121\u3044\u96FB\u8A71\u3067\u3059</font>");
							}
						} else //表示言語分岐
						{
							if (this.H_G_Sess.language == "ENG") {
								A_tmp.push(A_data[cnt].rel_telno_view + "(" + A_data[cnt].rel_carname_eng + ")");
							} else {
								A_tmp.push(A_data[cnt].rel_telno_view + "(" + A_data[cnt].rel_carname + ")");
							}
						}
				} else if (A_data[cnt].rel_telno == telno && A_data[cnt].rel_carid == carid) {
					H_res.telno = A_data[cnt].telno;
					H_res.carid = A_data[cnt].carid;
					H_res.carname = A_data[cnt].carname;
					H_res.carname_eng = A_data[cnt].carname_eng;

					if (-1 !== A_post.indexOf(A_data[cnt].postid) == false) //表示言語分岐
						{
							if (this.H_G_Sess.language == "ENG") {
								A_tmp.push(A_data[cnt].telno_view + "(" + A_data[cnt].carname_eng + ")<font class=\"alert\">\u203B\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tTelephone not authorized</font>");
							} else {
								A_tmp.push(A_data[cnt].telno_view + "(" + A_data[cnt].carname + ")<font class=\"alert\">\u203B\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\u6A29\u9650\u4E0B\u306B\u7121\u3044\u96FB\u8A71\u3067\u3059</font>");
							}
						} else //表示言語分岐
						{
							if (this.H_G_Sess.language == "ENG") {
								A_tmp.push(A_data[cnt].telno_view + "(" + A_data[cnt].carname_eng + ")");
							} else {
								A_tmp.push(A_data[cnt].telno_view + "(" + A_data[cnt].carname + ")");
							}
						}
				}

				A_res.rel_tel.push(H_res);
			}

			A_res.rel_view = A_tmp.join("<br>");
		}

		return A_res;
	}

	makeRelTelDataArray(telno, carid, A_data) {
		var A_res = Array();
		var A_tmp = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) //重複していない方が関連電話（telno、rel_telnoのいずれかは自身と同じなので）
		{
			var H_res = Array();

			if (A_data[cnt].telno == telno && A_data[cnt].carid == carid) {
				H_res.telno = A_data[cnt].rel_telno;
				H_res.telno_view = A_data[cnt].rel_telno_view;
				H_res.carid = A_data[cnt].rel_carid;
				H_res.carname = A_data[cnt].rel_carname;
				H_res.carname_eng = A_data[cnt].rel_carname_eng;
				A_tmp.push(A_data[cnt].rel_telno_view + "(" + A_data[cnt].rel_carname + ")");
			} else if (A_data[cnt].rel_telno == telno && A_data[cnt].rel_carid == carid) {
				H_res.telno = A_data[cnt].telno;
				H_res.telno_view = A_data[cnt].telno_view;
				H_res.carid = A_data[cnt].carid;
				H_res.carname = A_data[cnt].carname;
				H_res.carname_eng = A_data[cnt].carname_eng;
				A_tmp.push(A_data[cnt].telno_view + "(" + A_data[cnt].carname + ")");
			}

			A_res.push(H_res);
		}

		return A_res;
	}

	makeReserveTelData(A_data) {
		var A_res = Array();
		A_res.reserve = Array();
		var A_tmp = Array();
		var A_tmp_eng = Array();

		for (var cnt = 0; cnt < A_data.length; cnt++) //予約の種類表示用
		{
			H_tmp.telno = A_data[cnt].telno;
			H_tmp.carid = A_data[cnt].carid;
			H_tmp.reserve_date = A_data[cnt].reserve_date;
			H_tmp.add_edit_flg = A_data[cnt].add_edit_flg;
			var date_view = A_data[cnt].reserve_date.substr(0, 4) + "\u5E74" + A_data[cnt].reserve_date.substr(5, 2) + "\u6708" + A_data[cnt].reserve_date.substr(8, 2);
			var date_view_eng = A_data[cnt].reserve_date.substr(0, 4) + "-" + A_data[cnt].reserve_date.substr(5, 2) + "-" + A_data[cnt].reserve_date.substr(8, 2);

			if (A_data[cnt].add_edit_flg == ManagementTelModel.ADDMODE) {
				A_tmp.push(date_view + "\uFF08\u65B0\u898F\uFF09");
				A_tmp_eng.push(date_view_eng + "(New register)");
			} else if (A_data[cnt].add_edit_flg == ManagementTelModel.MODMODE) {
				A_tmp.push(date_view + "\uFF08\u5909\u66F4\uFF09");
				A_tmp_eng.push(date_view_eng + "(Change)");
			} else if (A_data[cnt].add_edit_flg == ManagementTelModel.MOVEMODE) {
				A_tmp.push(date_view + "\uFF08\u79FB\u52D5\uFF09");
				A_tmp_eng.push(date_view_eng + "(Shift)");
			} else if (A_data[cnt].add_edit_flg == ManagementTelModel.DELMODE) {
				A_tmp.push(date_view + "\uFF08\u524A\u9664\uFF09");
				A_tmp_eng.push(date_view_eng + "(Delete)");
			}

			A_res.reserve.push(H_tmp);
		}

		A_res.reserve_view = A_tmp.join("<br>");
		A_res.reserve_view_eng = A_tmp_eng.join("<br>");
		return A_res;
	}

	getProductIdNameData(carid, cirid, seriesid = "") {
		if (seriesid != "") {
			var O_model = new ProductModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.SELECT_TOP
				};
			}

			var H_res = O_model.getProductIdNameKeyHash(this.H_G_Sess.groupid, carid, cirid, seriesid);
			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": "--Please select a series--"
				};
			} else {
				H_data = {
					"": "--\u30B7\u30EA\u30FC\u30BA\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};
			}
		}

		return H_data;
	}

	getBranchIdNameData(productid = "") {
		if (productid != "") {
			var O_model = new ProductModel();

			if (this.H_G_Sess.language == "ENG") {
				var H_data = {
					"": ManagementTelModel.TEL_SELECT_TOP_ENG
				};
			} else {
				H_data = {
					"": ManagementTelModel.SELECT_TOP
				};
			}

			var H_res = O_model.getBranchIdNameKeyHash(productid);
			H_data += H_res;
		} else {
			if (this.H_G_Sess.language == "ENG") {
				H_data = {
					"": "--Please select a product name--"
				};
			} else {
				H_data = {
					"": "--\u88FD\u54C1\u540D\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044--"
				};
			}
		}

		return H_data;
	}

	getPrtelno() //親番号一覧取得
	{
		var sql = "select carid,prtelno from bill_prtel_tb where pactid=" + this.H_G_Sess.pactid;
		var A_prtelno = this.get_DB().queryHash(sql);
		return A_prtelno;
	}

	makeAddLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var A_val = [ManagementTelModel.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, this.O_Manage.convertNoView(H_post.telno_view), H_post.telno_view, H_post.purchcoid, "\u96FB\u8A71\u65B0\u898F\u767B\u9332", "new phone", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u65B0\u898F\u767B\u9332", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeAddReserveLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var reservedate_view = H_post.reserve_date.substr(0, 4) + "\u5E74" + H_post.reserve_date.substr(5, 2) + "\u6708" + H_post.reserve_date.substr(8, 2) + "\u65E5";
		var reservedate_view_eng = H_post.reserve_date.substr(0, 4) + "-" + H_post.reserve_date.substr(5, 2) + "-" + H_post.reserve_date.substr(8, 2);
		var A_val = [ManagementTelModel.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, this.O_Manage.convertNoView(H_post.telno_view), H_post.telno_view, H_post.purchcoid, "\u96FB\u8A71\u65B0\u898F\u767B\u9332\u4E88\u7D04\uFF08" + reservedate_view + "\uFF09", "New phone reserve\uFF08" + reservedate_view_eng + "\uFF09", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u65B0\u898F\u767B\u9332\u4E88\u7D04", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	makeModReserveLogSQL(H_post: {} | any[]) {
		if ("" == H_post.recogpostname) {
			H_post.recogpostname = this.getPostName(H_post.recogpostid);
		}

		var reservedate_view = H_post.reserve_date.substr(0, 4) + "\u5E74" + H_post.reserve_date.substr(5, 2) + "\u6708" + H_post.reserve_date.substr(8, 2) + "\u65E5";
		var reservedate_view_eng = H_post.reserve_date.substr(0, 4) + "-" + H_post.reserve_date.substr(5, 2) + "-" + H_post.reserve_date.substr(8, 2);
		var A_val = [ManagementTelModel.TELMID, this.H_G_Sess.pactid, this.H_G_Sess.postid, this.H_G_Sess.userid, this.H_G_Sess.loginname, this.O_Manage.convertNoView(H_post.telno_view), H_post.telno_view, H_post.purchcoid, "\u96FB\u8A71\u5909\u66F4\u4E88\u7D04\uFF08" + reservedate_view + "\uFF09", "Tel mod reserve\uFF08" + reservedate_view_eng + "\uFF09", H_post.recogpostid, "", H_post.recogpostname, "", this.H_G_Sess.joker, "\u5909\u66F4\u4E88\u7D04", this.NowTime];
		return this.makeInsertLogSQL(A_val);
	}

	convertOptionView(H_op, option, str = "&nbsp;&nbsp;&nbsp;") {
		var H_data = unserialize(option);
		var A_str = Array();

		if (H_data !== false && H_data !== undefined) //オプション一覧をループ
			{
				for (var key in H_op) //データーをループ
				{
					var val = H_op[key];

					for (var dkey in H_data) {
						var dval = H_data[dkey];

						if (key === dkey) {
							A_str.push(val);
						}
					}
				}
			}

		return A_str.join(str);
	}

	deleteTelRelTelProc(telno, carid, rel_telno, rel_carid) //元先の組合せでdelete文を作る
	//元先を入れ替えてdelete文を作る
	{
		var sql = "delete from " + this.H_Tb.tel_rel_tel_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and " + " rel_telno=" + this.get_DB().dbQuote(rel_telno, "text", true) + " and " + " rel_carid=" + this.get_DB().dbQuote(rel_carid, "integer", true);
		var res1 = this.get_DB().exec(sql);
		sql = "delete from " + this.H_Tb.tel_rel_tel_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno=" + this.get_DB().dbQuote(rel_telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(rel_carid, "integer", true) + " and " + " rel_telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " rel_carid=" + this.get_DB().dbQuote(carid, "integer", true);
		var res2 = this.get_DB().exec(sql);
		return res1 + res2;
	}

	makeUpdateTelRelAssetsSQL(telno, carid, H_post, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "update " + tb + " set " + "telno=" + this.get_DB().dbQuote(H_post.telno, "text", true) + ",carid=" + this.get_DB().dbQuote(H_post.carid, "integer", true) + ",main_flg=" + this.get_DB().dbQuote(H_post.main_flg, "boolean", true) + " where " + " telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true) + " and " + " assetsid=" + this.get_DB().dbQuote(H_post.assetsid, "integer", true);
		return sql;
	}

	getTelNoView(telno, carid) {
		var sql = "select telno_view from " + this.H_Tb.tel_tb + " where " + " pactid=" + this.get_DB().dbQuote(this.H_G_Sess.pactid, "integer", true) + " and " + " telno=" + this.get_DB().dbQuote(telno, "text", true) + " and " + " carid=" + this.get_DB().dbQuote(carid, "integer", true);
		var telno_view = this.get_DB().queryOne(sql);
		return telno_view;
	}

	getAllOptionDiscount() {
		var O_option = new OptionModel();
		var H_op = O_option.getAllOptionDiscountKeyHash();
		return H_op;
	}

	getAllOptionDiscountEng() {
		var O_option = new OptionModel();
		var H_op = O_option.getAllOptionDiscountKeyHashEng();
		return H_op;
	}

	convertSerializeRow(data, H_view, separator) //オプションを日本語文字列に変換
	{
		var op = "";
		var A_op = unserialize(data);

		if (Array.isArray(A_op) && A_op.length > 0) {
			ksort(A_op);
			var A_tmp = Array();

			for (var key in A_op) {
				var val = A_op[key];
				A_tmp.push(H_view[key]);
			}

			op = A_tmp.join(separator);
		}

		return op;
	}

	convertSerialize(A_data, H_view, separator) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			if (A_data[cnt].options != undefined) //オプションを日本語文字列に変換
				//d22オプションの並び順のソート
				{
					var op = "";
					var A_op = unserialize(A_data[cnt].options);
					ksort(A_op);

					if (A_op.length > 0) {
						var A_tmp = Array();

						for (var key in A_op) {
							var val = A_op[key];
							A_tmp.push(H_view[key]);
						}

						op = A_tmp.join(separator);
					}

					A_data[cnt].options_view = op;
				}

			if (A_data[cnt].discounts != undefined) //割引サービスを日本語文字列に変換
				//d22オプションの並び順のソート
				{
					var dis = "";
					var A_dis = unserialize(A_data[cnt].discounts);
					ksort(A_dis);

					if (A_dis.length > 0) {
						A_tmp = Array();

						for (var key in A_dis) {
							var val = A_dis[key];
							A_tmp.push(H_view[key]);
						}

						dis = A_tmp.join(separator);
					}

					A_data[cnt].discounts_view = dis;
				}
		}

		return A_data;
	}

	convertSerializeEng(A_data, H_view, separator) {
		for (var cnt = 0; cnt < A_data.length; cnt++) {
			if (A_data[cnt].options != undefined) //オプションを日本語文字列に変換
				{
					var op = "";
					var A_op = unserialize(A_data[cnt].options);

					if (A_op.length > 0) {
						var A_tmp = Array();

						for (var key in A_op) {
							var val = A_op[key];
							A_tmp.push(H_view[key]);
						}

						op = A_tmp.join(separator);
					}

					A_data[cnt].options_view_eng = op;
				}

			if (A_data[cnt].discounts != undefined) //割引サービスを日本語文字列に変換
				{
					var dis = "";
					var A_dis = unserialize(A_data[cnt].discounts);

					if (A_dis.length > 0) {
						A_tmp = Array();

						for (var key in A_dis) {
							var val = A_dis[key];
							A_tmp.push(H_view[key]);
						}

						dis = A_tmp.join(separator);
					}

					A_data[cnt].discounts_view_eng = dis;
				}
		}

		return A_data;
	}

	checkRelAssetsMainFlg(telno, carid, assetsid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "select main_flg from " + tb + " where " + " assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true) + " and " + this.makeCommonTelWhere(telno, carid);
		var main_flg = this.get_DB().queryOne(sql);

		if (main_flg == "true") {
			return true;
		}

		return false;
	}

	resetMainflg(H_val, A_sql, pre = false) {
		var A_res = this.getAllTelRelAssetsListFromTelno(H_val.telno, H_val.carid, pre);

		if (!A_res == false) {
			for (var cnt = 0; cnt < A_res.length; cnt++) {
				A_sql.push(this.updateTelRelAssetsMainflgSQL(A_res[cnt].telno, A_res[cnt].carid, A_res[cnt].assetsid, "false", pre));
			}
		}

		return A_sql;
	}

	updateTelRelAssetsMainflgSQL(telno, carid, assetsid, flg, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "update " + tb + " set main_flg=" + this.get_DB().dbQuote(flg, "boolean", true) + " where " + " assetsid=" + this.get_DB().dbQuote(assetsid, "integer", true) + " and " + this.makeCommonTelWhere(telno, carid);
		return sql;
	}

	getAllTelRelAssetsListFromTelno(telno, carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_rel_assets_tb;
		} else {
			tb = this.H_Tb.tel_rel_assets_tb;
		}

		var sql = "select telno,carid,assetsid,main_flg from " + tb + " where " + this.makeCommonTelWhere(telno, carid);
		return this.get_DB().queryHash(sql);
	}

	getTelPostid(telno, carid, pre = false) {
		if (true == pre) {
			var tb = this.H_Tb.pre_tel_tb;
		} else {
			tb = this.H_Tb.tel_tb;
		}

		var sql = "select postid from " + tb + " where " + this.makeCommonTelWhere(telno, carid);
		return this.get_DB().queryOne(sql);
	}

	getWebReliefService() {
		var column = "itemname";

		if (this.H_G_Sess.language == "ENG") {
			column = "itemname_eng";
		}

		var sql = "SELECT itemname, itemname_eng " + "FROM " + "mt_order_item_tb " + "WHERE " + "carid=4" + " AND type='N'" + " AND inputname='webreliefservice'" + " AND inputtype='radio_child' " + "GROUP BY " + "itemname, itemname_eng, show_order " + "ORDER BY " + "show_order";
		var H_name = this.get_DB().queryHash(sql);

		for (var key in H_name) {
			var val = H_name[key];
			H_service[val.itemname] = [val[column], {
				id: "webrel_" + (key + 1),
				onChange: "javascript:setHiddenRadio('webrel_" + (key + 1) + "', 'webreliefaj')"
			}];
		}

		return H_service;
	}

	translateWebService(data) {
		var sql = "SELECT itemname_eng " + "FROM " + "mt_order_item_tb " + "WHERE " + "carid=4" + " AND cirid=11" + " AND type='N'" + " AND itemname=" + this.get_DB().dbQuote(data, "text", false);
		return this.get_DB().queryOne(sql);
	}

	checkShopReceivingOrder(telno, carid) {
		var sql = "select " + "count(d.telno) " + "from " + "mt_order_tb o inner join mt_order_teldetail_tb d on o.orderid=d.orderid " + "where " + "d.telno=" + this.get_DB().dbQuote(telno, "text", true) + " " + "and o.carid=" + this.get_DB().dbQuote(carid, "integer", true) + " " + "and o.status >= 50 " + "and o.status not in (210, 220, 230)";
		return this.get_DB().queryOne(sql);
	}

	__destruct() {
		super.__destruct();
	}

};