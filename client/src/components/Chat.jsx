import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Chat.css'

export default function Chat() {
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:3000/messages', {
          message
        });

        if (response.status === 200) {
          setQuestions([...questions, message]);
          setAnswers([...answers, response.data.answer]);
          setMessage('');
        } else {
          alert('Failed to send message.');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('An error occurred while sending the message.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please type a message before sending.');
    }
  };

  return (
    <div className='w-full h-[90vh] mt-12 p-5 flex items-center justify-center'>
      <div className="flex flex-col h-[80vh] w-[70vw] mx-auto bg-gray-100">
        <div className="rounded-t-lg bg-success text-white p-4 text-center text-xl font-bold">
          Khedut Saathi
        </div>
        <div className="flex-1 p-4 overflow-auto bg-gray-200">
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((que, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <div className="self-end max-w-xs p-3 bg-green-200 text-gray-800 rounded-lg shadow-md">
                    {que}
                  </div>
                  <div className="self-start max-w-xs p-3 bg-white text-gray-800 rounded-lg shadow-md">
                    {answers[index]}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No messages yet.</p>
            )}
          </div>
        </div>
        <form className="bg-white p-4 flex items-center border-t border-gray-300">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg border-gray-300 bg-white focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />

          <button 
          type='submit'
            className={`ml-4 py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-success hover:bg-blue-600'} transition`}
            onClick={handleSendMessage}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
