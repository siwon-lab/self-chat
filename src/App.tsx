import { useEffect, useRef, useState } from 'react';
import './App.css';

interface Chat {
   id: number;
   message: string;
   sender: 'me' | 'you' | 'narration';
}

interface ChatProps {
   chat: Chat;
   onDoubleClick: () => void;
   onContextMenu: () => void;
}

function App() {
   const [chats, setChats] = useState<Chat[]>([]);
   const [sender, setSender] = useState<'me' | 'you'>('me');
   const [input, setInput] = useState('');
   const [editingId, setEditingId] = useState<number | null>(null);
   const [warningClass, setWarningClass] = useState('invisible');

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Tab') {
            e.preventDefault();
            setSender((prev) => (prev === 'me' ? 'you' : 'me'));
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   const bottomRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [chats]);

   return (
      <div className="flex h-full w-full items-center justify-center bg-[#eee]">
         <div className="flex h-140 w-100 flex-col rounded-xl bg-sky-300 px-4 pt-8 shadow-md">
            <div
               className="-mt-1 flex w-full grow flex-col overflow-y-auto"
               // style={{ scrollbarWidth: 'none' }}
            >
               {chats.map((chat) => (
                  <Chat
                     chat={chat}
                     onDoubleClick={() => {
                        if (chat.sender !== 'narration') {
                           setEditingId(chat.id);
                           setInput(chat.message);
                           setSender(chat.sender);
                        }
                     }}
                     onContextMenu={() => {}}
                     key={chat.id}
                  />
               ))}
               <div ref={bottomRef} />
            </div>
            <div className="w-full">
               <div className="w-full pr-2 pb-1">
                  <p className="text-right text-sm font-semibold">
                     보내는 사람: {sender === 'me' && '나'}
                     {sender === 'you' && '너'}
                  </p>
               </div>
               <div className="h-12 w-full">
                  <input
                     className={`h-full w-full rounded-lg p-2 shadow-sm transition-shadow duration-300 outline-none hover:shadow-md ${editingId ? 'bg-yellow-200' : 'bg-white'}`}
                     type="text"
                     value={input}
                     onChange={(e) => {
                        setInput(e.target.value);
                        if (!e.target.value && editingId) {
                           setWarningClass('');
                        } else {
                           setWarningClass('invisible');
                        }
                     }}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                           const trimmed = input.trim();
                           if (!trimmed) {
                              if (editingId) {
                                 setWarningClass('invisible');
                                 setChats((prev) =>
                                    prev.filter(
                                       (chat) => chat.id !== editingId,
                                    ),
                                 );
                              } else {
                                 return;
                              }
                           }

                           const isNarration = trimmed.startsWith('> ');
                           const message = trimmed.replace(/^>\s/, '').trim();

                           if (editingId === null) {
                              setChats((prev) => [
                                 ...prev,
                                 {
                                    id: Date.now(),
                                    message: message,
                                    sender: isNarration ? 'narration' : sender,
                                 },
                              ]);
                           } else {
                              setChats((prev) =>
                                 prev.map((chat) =>
                                    chat.id === editingId
                                       ? {
                                            ...chat,
                                            message: input,
                                            sender: sender,
                                         }
                                       : chat,
                                 ),
                              );
                              setEditingId(null);
                           }

                           setInput('');
                        }
                     }}
                  />
               </div>
               <p
                  className={`${warningClass} h-4 text-center text-xs font-semibold text-red-500`}
               >
                  빈 칸으로 남겨둘 시 메시지가 삭제됩니다.
               </p>
            </div>
         </div>
      </div>
   );
}

function Chat({ chat, onDoubleClick, onContextMenu }: ChatProps) {
   if (chat.sender === 'narration') {
      return (
         <div className="my-2 flex w-full justify-center">
            <div
               className="min-w-40 rounded-full bg-gray-600/20 px-4"
               onContextMenu={(e) => {
                  e.preventDefault();
                  onContextMenu();
               }}
            >
               <p className="text-center break-all text-gray-700">
                  {chat.message}
               </p>
            </div>
         </div>
      );
   }
   return (
      <div
         className={`my-1 flex max-w-72 items-center rounded-xl px-2.5 py-1.5 ${chat.sender === 'me' && 'mr-4 ml-auto bg-yellow-300'} ${chat.sender === 'you' && 'mr-auto ml-4 bg-white'}`}
         onDoubleClick={(e) => {
            e.preventDefault();
            onDoubleClick();
         }}
         onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu();
         }}
      >
         <p className="break-all">{chat.message}</p>
      </div>
   );
}

export default App;
