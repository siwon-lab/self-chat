import { useEffect, useState } from 'react';
import './App.css';

interface Chat {
	id: number;
	message: string;
	sender: 'me' | 'you' | 'narration';
}

interface ChatProps {
	chat: Chat;
}

function App() {
	const [chats, setChats] = useState<Chat[]>([]);
	const [sender, setSender] = useState<'me' | 'you'>('me');
	const [input, setInput] = useState<string>('');

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

	return (
		<div className="w-full h-full bg-[#ddd] flex justify-center items-center">
			<div className="w-100 h-140 bg-sky-300 p-4 rounded-xl shadow-md flex flex-col">
				<div className="w-full grow flex flex-col -mt-1">
					{chats.map((chat) => (
						<Chat chat={chat} key={chat.id} />
					))}
				</div>
				<div className="w-full">
					<div className="w-full pr-2 pb-1">
						<p className="text-sm font-semibold text-right">
							보내는 사람: {sender === 'me' && '나'}
							{sender === 'you' && '너'}
						</p>
					</div>
					<div className="w-full h-12">
						<input
							className="w-full h-full bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-300 outline-none"
							type="text"
							value={input}
							onChange={(e) => {
								setInput(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && input.trim()) {
									const isNarration = input.startsWith('>');
									const message = input.replace(/^>/, '');
									setChats((prev) => [
										...prev,
										{
											id: Date.now(),
											message: message,
											sender: isNarration ? 'narration' : sender,
										},
									]);
									setInput('');
								}
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function Chat({ chat }: ChatProps) {
	if (chat.sender === 'narration') {
		return (
			<div className="my-2 w-full flex justify-center">
				<div className="min-w-40 px-2 bg-gray-600/20 rounded-full">
					<p className="text-center text-gray-700">
						{chat.message}
					</p>
				</div>
			</div>
		);
	}
	return (
		<div
			className={`my-1 px-2 py-1 rounded-md flex items-center
					${chat.sender === 'me' && 'bg-yellow-300 ml-auto'}
               ${chat.sender === 'you' && 'bg-white mr-auto'}`}
		>
			<p>{chat.message}</p>
		</div>
	);
}

export default App;
