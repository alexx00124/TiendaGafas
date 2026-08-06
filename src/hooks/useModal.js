import { useCallback, useState } from 'react';

const useModal = () => {
  const [isOpenModal, setModalOpen] = useState(false);

  const onOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return { isOpenModal, onOpenModal, onCloseModal };
};

export default useModal;
