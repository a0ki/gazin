import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';

const CustomModal = ({ isOpen, onClose, title, content, actions }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
        <ModalBody>
          {content}
        </ModalBody>
        <ModalFooter>
          {actions.map((action, actionIndex) => (
            <Button
              key={actionIndex}
              variant={action.variant}
              className={action.className}
              color={action.color}
              onPress={async () => {
                await action.callback();
                onClose();
              }}
            >
              {action.label}
            </Button>
          ))}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { CustomModal };