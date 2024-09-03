import React from 'react';

interface MessageProps {
  variant?: string;
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant = 'info', children }) => {
  return (
    <div className={`alert alert-${variant} p-4 mb-4`}>
      {children}
    </div>
  );
};

export default Message;
