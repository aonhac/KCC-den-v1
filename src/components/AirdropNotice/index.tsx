import { Button, Modal } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
export interface AirdropNoticeProps {
  show: boolean
}

const AirdropNotice: React.FunctionComponent<AirdropNoticeProps> = ({ show }) => {
  const { t } = useTranslation()
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false)

  const text = '系统监测到你的目标地址没有kcs，稍后将赠送你 0.001 kcs作为手续费体验金。'

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  React.useEffect(() => {
    setIsModalVisible(() => show)
  }, [show])

  return (
    <Modal
      title={t('App Tips')}
      centered
      footer={[
        <Button key="back" type="primary" onClick={handleCancel}>
          {t(`Confirm`)}
        </Button>,
      ]}
      cancelText={null}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>{text}</p>
    </Modal>
  )
}

export default AirdropNotice
