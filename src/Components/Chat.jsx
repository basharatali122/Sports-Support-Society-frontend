import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { requestId } = useParams();
  const [message, setMessage] = useState([{ text: "hello world" }]);
  console.log(requestId);

  return (
    <div className="w-1/2 mx-auto m-5 border border-gray-600 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>

      <div className="flex-1 overflow-auto p-5">
        {/* Display messages */}
        {message.map((msg, index) => {
          return (
            <React.Fragment key={index}>
              <div className="chat chat-start">
                <div className="chat-header">...</div>
                <div className="chat-bubble">You were the Chosen One!</div>
                <div className="chat-footer opacity-50">Seen</div>
              </div>

              <div className="chat chat-start">
                <div className="chat-header">
                  Obi-Wan Kenobi
                  <time className="text-xs opacity-50">2 hour ago</time>
                </div>
                <div className="chat-bubble">I loved you.</div>
                <div className="chat-footer opacity-50">Delivered</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-400 rounded py-2 text-white"
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
