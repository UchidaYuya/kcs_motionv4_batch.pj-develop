//===========================================================================
//�@�\�F�V�~�����[�V�����̃\�t�g�o���N��
//
//�쐬�F�X��
//===========================================================================
//===========================================================================
//�@�\�F���v��񂩂�V�~�����[�V�������s��(�\�t�g�o���N��p)

//�����v�Z�ł̑O���ƌ��Ȃ����t
//�g�тŎ��Ј��ƌ��Ȃ��䗦�̃f�t�H���g�l
//�������Ȃ�
//�������o�����[(�V�X�[�p�[�{�[�i�X�Ȃ�)
//�������x�[�V�b�N(�V�X�[�p�[�{�[�i�X)
//�\�t�g�o���N�̃L�����AID
//�\�t�g�o���N�g�т̉�����
//�������ԗ��p���̃f�t�H���g�l
//�R���X�g���N�^
//-----------------------------------------------------------------------
//�@�\�F���݂̔���������A�������ߌ�̔�������z��ɓ���ĕԂ�
//�@�\�F���L�����A���ɓ��Ă͂߂�����ʂ�Ԃ�
//-----------------------------------------------------------------------
//�@�\�F�������v�Z���ĕԂ�
//�Ԓl�F�������������Ȃ����false��Ԃ�
//-----------------------------------------------------------------------
//�@�\�F�ʘb�ʐM�������߂�(�p�P�b�g�p�b�N����)
//�@�\�F�ʘb�ʐM�������߂�(�p�P�b�g�p�b�N����)
//�@�\�F�ʘb�ʐM�������߂�(�p�P�b�g�p�b�N����)�f�[�^��p�ȊO
//�@�\�F�ʘb�ʐM�������߂�(�p�P�b�g�p�b�N����)�f�[�^��p
class UpdateRecomSoftbank extends UpdateRecomBase {
	static g_penalty_limit = 32;
	static g_ratio_same_carrier = 50;
	static g_buysel_empty = 10;
	static g_buysel_value = 12;
	static g_buysel_basic = 11;
	static g_carid = 4;
	static g_cirid_tel = 11;
	static g_ratio_daytime = 70;

	constructor(listener: ScriptLogBase, db: ScriptDB, table_no: TableNo, O_inserter_log: TableInserterBase, assert) //���v��񕽋ϒl�̃f�t�H���g�l
	{
		var A_buysel = [UpdateRecomSoftbank.g_buysel_empty, UpdateRecomSoftbank.g_buysel_basic, UpdateRecomSoftbank.g_buysel_value];
		super(listener, db, table_no, O_inserter_log, assert, UpdateRecomSoftbank.g_carid, [UpdateRecomSoftbank.g_cirid_tel], [UpdateRecomSoftbank.g_cirid_tel], A_buysel, UpdateRecomSoftbank.g_penalty_limit, {
			ratio_same_carrier: UpdateRecomSoftbank.g_ratio_same_carrier
		});
		this.m_H_ave_trend_default = {
			timezone: {
				0: Math.round(UpdateRecomSoftbank.g_ratio_daytime),
				1: Math.round(100 - UpdateRecomSoftbank.g_ratio_daytime)
			},
			timezone_digi: {
				0: Math.round(UpdateRecomSoftbank.g_ratio_daytime),
				1: Math.round(100 - UpdateRecomSoftbank.g_ratio_daytime)
			},
			ismobile: {
				0: 50,
				1: 50
			},
			avetime: {
				0: Math.round(300),
				1: Math.round(300)
			}
		};
	}

	get_buysel(is_penalty, H_tel: {} | any[], buysel_before, is_change_course, is_change_carrier) //�����͏�Ɍv�Z���Ȃ�
	{
		is_penalty = false;

		if (is_change_carrier) //���L�����A�Ԃł���
			//�o�����[�Ƃ���
			{
				return [UpdateRecomSoftbank.g_buysel_value];
			}

		if (is_change_course) //��������ύX����ꍇ
			{
				switch (buysel_before) {
					case UpdateRecomSoftbank.g_buysel_basic:
						return [UpdateRecomSoftbank.g_buysel_basic, UpdateRecomSoftbank.g_buysel_value];

					case UpdateRecomSoftbank.g_buysel_value:
						return [UpdateRecomSoftbank.g_buysel_value];

					default:
						return [UpdateRecomSoftbank.g_buysel_value, UpdateRecomSoftbank.g_buysel_empty];
				}
			} else //��������ύX���Ȃ��ꍇ
			{
				return [buysel_before];
			}
	}

	get_cirid_change_carrier() //�\�t�g�o���N�g�тƂ���
	{
		return UpdateRecomSoftbank.g_cirid_tel;
	}

	calc_penalty(penalty, H_tel: {} | any[], cur_date) //�����͏��null�Ƃ���
	{
		penalty = undefined;
		return false;
	}

	calc_talkcomm_w_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], H_tgt_packet: {} | any[], raw_talk, raw_comm, H_other) //�ʘb�ʐM�������������o���Ă���
	//�ʘb����(�����ʘb���f��)
	//:= �ʘb�� * (1 - �d�b�P�ʂ̒ʘb�ʐM��������) + �ʘb���̑�
	//- �����ʘb
	//�������A�ڋq�P�ʂ̒ʘb�ʐM��������������ꍇ�͒ʘb���������̓[��
	//�������[�������ɂ͂Ȃ�Ȃ�
	//�ʘb����(�ڋq�P�ʂ̒ʘb�ʐM�����f��)
	//:= ���ʘb���� * (1 - �ڋq�P�ʂ̒ʘb�ʐM��������)
	//�ʐM����(�����ʐM�����f��)
	//:= �����p�P�b�g�ʐM + �����f�W�^���ʐM - �����ʐM��
	//�������[�������ɂ͂Ȃ�Ȃ�
	//�ʘb�ʐM��
	//:= (�ʘb�� + �ʐM��) + �p�P�b�g��z��
	//(���ےʘb�E���ۃf�W�^���ʐM�E���ۃp�P�b�g�ʐM)
	{
		var disratio = 0;
		var is_all = this.calc_disratio_talkcomm(disratio, H_log, H_ave, H_param, H_disratio, H_tgt_plan.cirid);
		var disratio_pact = is_all ? disratio : 0;
		var disratio_tel = is_all ? 0 : disratio;
		var talk = Math.round(raw_talk * (100 - disratio_tel) / 100);
		talk += H_other.talk_other;
		talk -= H_tgt_plan.free;
		if (talk < 0) talk = 0;
		this.insert_log(H_log, "talk_disratio_free_w_packet", 0, talk, "", UpdateRecomSoftbank.g_log_talkcomm);
		talk = Math.round(talk * (100 - disratio_pact) / 100);
		this.insert_log(H_log, "talk_disratio_free_disratiopact_w_packet", 0, talk, "", UpdateRecomSoftbank.g_log_talkcomm);
		var comm = raw_comm + H_other.comm_domestic_digi;
		comm = comm - H_tgt_packet.freecharge;
		if (comm < 0) comm = 0;
		this.insert_log(H_log, "comm_free_w_packet", 0, comm, "", UpdateRecomSoftbank.g_log_talkcomm);
		var talkcomm = talk + comm;
		talkcomm += H_tgt_packet.fixcharge;
		this.insert_log(H_log, "talkcomm_w_packet", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
		talkcomm += H_other.talk_abroad;
		talkcomm += H_other.comm_abroad_digi;
		talkcomm += H_other.comm_abroad_packet;
		this.insert_log(H_log, "talkcomm", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
		return talkcomm;
	}

	calc_talkcomm_wo_packet(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], raw_talk, raw_comm, H_other) {
		if (this.getValue(H_tgt_plan, "is_data", false)) return this.calc_talkcomm_wo_packet_data(H_log, H_ave, H_param, H_disratio, H_tgt_plan, raw_talk, raw_comm, H_other);else return this.calc_talkcomm_wo_packet_not_data(H_log, H_ave, H_param, H_disratio, H_tgt_plan, raw_talk, raw_comm, H_other);
	}

	calc_talkcomm_wo_packet_not_data(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], raw_talk, raw_comm, H_other) //�ʘb�ʐM�������������o���Ă���
	//�������K�p��ʘb����
	//:= (�ʘb�� * (1 - �d�b�P�ʂ̒ʘb�ʐM��������) + �ʘb���̑�)
	//�������A�ڋq�P�ʂ̒ʘb�ʐM��������������ꍇ�͒ʘb���������̓[��
	//�����ʘb�����f��ʘb����
	//:= (���������K�p��ʘb���� - �����ʘb)
	//���ےʘb�E���ۃf�W�^���ʐM�E���ۃp�P�b�g�ʐM�����Z����
	{
		var disratio = 0;
		var is_all = this.calc_disratio_talkcomm(disratio, H_log, H_ave, H_param, H_disratio, H_tgt_plan.cirid);
		var disratio_pact = is_all ? disratio : 0;
		var disratio_tel = is_all ? 0 : disratio;
		var talk = Math.round(raw_talk * (100 - disratio_tel) / 100);
		talk += H_other.talk_other;
		this.insert_log(H_log, "talk_disratio_wo_packet", 0, talk, "", UpdateRecomSoftbank.g_log_talkcomm);
		talk -= H_tgt_plan.free;
		this.insert_log(H_log, "talk_disratio_free_wo_packet", 0, talk, "", UpdateRecomSoftbank.g_log_talkcomm);

		if (0 <= talk) //�ڋq�P�ʒʘb�ʐM���K�p��ʘb��
			//:= �������ʘb�����f��ʘb����
			// (1 - �ڋq�P�ʂ̒ʘb�ʐM��������)
			//�ʘb�ʐM�� := ���ʘb�� + �����p�P�b�g�ʐM + �����f�W�^���ʐM
			{
				talk = Math.round(talk * (100 - disratio_pact) / 100);
				this.insert_log(H_log, "talk_disratio_free_disratiopact_wo_packet", 0, talk, "", UpdateRecomSoftbank.g_log_talkcomm);
				var talkcomm = Math.round(talk + raw_comm + H_other.comm_domestic_digi);
				this.insert_log(H_log, "talkcomm_wo_packet", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
			} else //�ڋq�P�ʂ̒ʘb�ʐM���������͓K�p�ł��Ȃ�
			//�ʘb�ʐM�� := �������ʘb���K�p��ʘb���� + �ʐM��
			//�������A�[�������ɂ͂Ȃ�Ȃ�
			{
				talkcomm = Math.round(talk + raw_comm);
				if (talkcomm < 0) talkcomm = 0;
				this.insert_log(H_log, "talkcomm_wo_packet", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
			}

		talkcomm += H_other.talk_abroad;
		talkcomm += H_other.comm_abroad_digi;
		talkcomm += H_other.comm_abroad_packet;
		this.insert_log(H_log, "talkcomm", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
		return talkcomm;
	}

	calc_talkcomm_wo_packet_data(H_log: {} | any[], H_ave: {} | any[], H_param: {} | any[], H_disratio: {} | any[], H_tgt_plan: {} | any[], raw_talk, raw_comm, H_other) //�ʘb�ʐM�������������o���Ă���
	//�d�b�P�ʊ������K�p��ʘb�ʐM��
	//:= ((�ʘb�� + �����p�P�b�g�ʐM + �����f�W�^���ʐM)
	// (1 - �d�b�P�ʂ̒ʘb�ʐM��������) + �ʘb���̑�)
	//�������A�ڋq�P�ʂ̒ʘb�ʐM��������������ꍇ�͒ʘb���������̓[��
	//�����ʘb�����f��ʘb�ʎj�ɗ���
	//:= (���������K�p��ʘb�ʐM���� - �����ʘb)
	//�ڋq�P�ʒʘb�ʐM���K�p��ʘb��
	//:= �������ʘb�����f��ʘb����
	// (1 - �ڋq�P�ʂ̒ʘb�ʐM��������)
	//�������A�[�������ɂ͂Ȃ�Ȃ�
	{
		var disratio = 0;
		var is_all = this.calc_disratio_talkcomm(disratio, H_log, H_ave, H_param, H_disratio, H_tgt_plan.cirid);
		var disratio_pact = is_all ? disratio : 0;
		var disratio_tel = is_all ? 0 : disratio;
		var talkcomm = raw_talk + raw_comm + H_other.comm_domestic_digi;
		talkcomm = Math.round(talkcomm * (100 - disratio_tel) / 100);
		talkcomm += H_other.talk_other;
		this.insert_log(H_log, "talkcomm_disratio_wo_packet_data", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
		talkcomm -= H_tgt_plan.free;
		this.insert_log(H_log, "talkcomm_disratio_free_wo_packet_data", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
		talkcomm = Math.round(talkcomm * (100 - disratio_pact) / 100);
		this.insert_log(H_log, "talkcomm_disratio_free_disratiopact_wo_packet_data", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
		if (talkcomm < 0) talkcomm = 0;
		talkcomm += H_other.talk_abroad;
		talkcomm += H_other.comm_abroad_digi;
		talkcomm += H_other.comm_abroad_packet;
		this.insert_log(H_log, "talkcomm", 0, talkcomm, "", UpdateRecomSoftbank.g_log_talkcomm);
		return talkcomm;
	}

};