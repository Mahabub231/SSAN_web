import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bot, Send, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function SafetyChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'আসসালামু আলাইকুম! Hello! I\'m your AI Safety Assistant for Bangladesh. I can help you with emergency guidance, safety tips, and legal information. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  
  // 1. Ref for the invisible bottom anchor instead of the scroll container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 2. Smoothly scroll to the anchor whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('emergency') || lowerMessage.includes('999')) {
      return 'In case of immediate danger, call 999 immediately (Bangladesh National Emergency Service). If you\'re in a safe location, stay there until help arrives. Make sure to provide your exact location to the operator. You can also contact:\n• Police: 999\n• Fire Service: 999\n• Ambulance: 999\n• RAB: 999';
    } else if (lowerMessage.includes('safety') || lowerMessage.includes('tip')) {
      return 'Here are some safety tips for Bangladesh:\n1. Always be aware of your surroundings, especially in crowded areas\n2. Trust your instincts\n3. Keep your phone charged\n4. Share your location with trusted contacts\n5. Avoid isolated areas at night\n6. During monsoon, avoid waterlogged areas\n7. Keep emergency numbers saved';
    } else if (lowerMessage.includes('law') || lowerMessage.includes('legal') || lowerMessage.includes('rights')) {
      return 'Your legal rights in Bangladesh:\n1. Right to remain silent during interrogation\n2. Right to legal representation\n3. Right to be informed of charges against you\n4. Right to medical attention if injured\n5. Right to file FIR (First Information Report) at any police station\n6. Women can seek help from Women and Children Affairs desks';
    } else if (lowerMessage.includes('police') || lowerMessage.includes('report')) {
      return 'To report an incident in Bangladesh:\n1. Call 999 for emergencies\n2. Visit nearest Police Station for non-urgent matters\n3. File an FIR (First Information Report)\n4. Use our incident reporting feature in the app\n5. Contact RAB (Rapid Action Battalion) for serious crimes: 999\n6. Gather evidence safely (photos, videos)\n7. Note time, location, and details';
    } else if (lowerMessage.includes('fire')) {
      return 'Fire Safety in Bangladesh:\n1. Call 999 immediately for Fire Service\n2. Evacuate the building quickly\n3. Don\'t use elevators\n4. Stay low to avoid smoke\n5. Meet at designated assembly point\n6. Bangladesh Fire Service & Civil Defence: 999';
    } else if (lowerMessage.includes('medical') || lowerMessage.includes('health') || lowerMessage.includes('hospital')) {
      return 'For medical emergencies in Bangladesh:\n1. Call 999 for ambulance\n2. Major hospitals: Dhaka Medical College, Square Hospital, Apollo Hospital\n3. Use the Emergency Service Locator in the app\n4. Provide clear symptoms to dispatcher\n5. Don\'t move injured persons unless necessary\n6. Apply first aid if trained';
    } else if (lowerMessage.includes('traffic') || lowerMessage.includes('accident')) {
      return 'In case of traffic accident:\n1. Call 999 immediately\n2. Move to safe location if possible\n3. Don\'t leave the scene\n4. Exchange information with other parties\n5. Take photos of damage\n6. Contact your insurance company\n7. File a General Diary (GD) at police station if needed';
    } else if (lowerMessage.includes('flood') || lowerMessage.includes('monsoon') || lowerMessage.includes('weather')) {
      return 'Monsoon and flood safety:\n1. Avoid walking through waterlogged areas\n2. Don\'t drive through flooded roads\n3. Stay updated with weather warnings\n4. Keep emergency supplies ready\n5. Know evacuation routes\n6. Contact local authorities: 999';
    } else {
      return 'I understand you need help. Could you please be more specific? You can ask me about:\n• Emergency procedures (999)\n• Safety tips\n• Legal rights in Bangladesh\n• Reporting incidents\n• Fire safety\n• Medical emergencies\n• Traffic accidents\n• Monsoon/flood safety';
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // 3. Added overflow-hidden to strict constraint the card
    <Card className="flex flex-col h-[500px] sm:h-[600px] overflow-hidden">
      <CardHeader className="p-3 sm:p-6 border-b shrink-0 bg-white z-10">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
          AI Safety Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0 bg-gray-50 overflow-hidden">
        
        {/* 4. Native scrolling div instead of ScrollArea */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                ) : (
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 shadow-sm border ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-gray-900 border-gray-200'
                }`}
              >
                <p className="text-xs sm:text-sm whitespace-pre-line break-words">{message.text}</p>
                <span className={`text-[10px] sm:text-xs mt-1 block ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          {/* 5. The invisible anchor to scroll to */}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        <div className="p-3 sm:p-4 border-t bg-white shrink-0 z-10">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about safety, emergencies..."
              className="text-sm bg-white"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSend} size="icon" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}