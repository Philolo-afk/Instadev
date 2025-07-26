import { useState, useEffect } from 'react'

export const useModal = () => {
  const [modalType, setModalType] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpenModal = (e) => {
      setModalType(e.detail)
      setIsOpen(true)
    }

    document.addEventListener('openModal', handleOpenModal)
    
    return () => {
      document.removeEventListener('openModal', handleOpenModal)
    }
  }, [])

  const openModal = (type) => {
    setModalType(type)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setModalType(null)
  }

  return {
    modalType,
    isOpen,
    openModal,
    closeModal
  }
}