'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import type { GeneratedItinerary, PlannerFormData } from './plannerTypes';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  suggestions?: string[];
}

interface ItineraryChatbotProps {
  itinerary: GeneratedItinerary;
  formData: PlannerFormData;
  onRemoveStop: (stopId: string) => void;
}

// Rule-based response engine
function getBotResponse(
  input: string,
  itinerary: GeneratedItinerary,
  formData: PlannerFormData,
): { text: string; suggestions?: string[] } {
  const q = input.toLowerCase().trim();

  // Budget questions
  if (q.includes('budget') || q.includes('cost') || q.includes('money') || q.includes('expensive') || q.includes('cheap')) {
    const isOver = itinerary.surplus < 0;
    if (isOver) {
      return {
        text: `Your plan is ₹${Math.abs(itinerary.surplus).toLocaleString()} over your ₹${itinerary.budget.toLocaleString()} budget. Try removing the most expensive stop or use the swap button to find a cheaper alternative nearby. The Budget Tracker above shows which stops are optional.`,
        suggestions: ['Which stop is most expensive?', 'How to save money?', 'Swap a stop'],
      };
    }
    return {
      text: `You're within budget! Total spend is ₹${itinerary.costBreakdown.total.toLocaleString()} out of ₹${itinerary.budget.toLocaleString()}. You have ₹${itinerary.surplus.toLocaleString()} remaining — enough for snacks or a small souvenir!`,
      suggestions: ['Add another stop', 'What can I do with remaining budget?', 'Show cost breakdown'],
    };
  }

  // Stop/place questions
  if (q.includes('stop') || q.includes('place') || q.includes('visit') || q.includes('how many')) {
    const stopNames = itinerary.stops.map((s, i) => `${i + 1}. ${s.placeName} (${s.area})`).join('\n');
    return {
      text: `Your itinerary has ${itinerary.stops.length} stops:\n${stopNames}\n\nEach stop is chosen based on your preferences and time of day. You can remove any stop using the Budget Tracker.`,
      suggestions: ['Tell me about the first stop', 'Which stop has an offer?', 'Remove a stop'],
    };
  }

  // Time / duration questions
  if (q.includes('time') || q.includes('duration') || q.includes('long') || q.includes('hours') || q.includes('when')) {
    const hours = Math.floor(itinerary.totalDuration / 60);
    const mins = itinerary.totalDuration % 60;
    return {
      text: `Your outing runs from ${itinerary.startTime} to ${itinerary.endTime} — about ${hours}h ${mins}m total including travel. You'll be back well before your return time. Each stop has a suggested duration so you won't feel rushed.`,
      suggestions: ['Which stop takes longest?', 'Can I add more time?', 'What if I run late?'],
    };
  }

  // Transport questions
  if (q.includes('transport') || q.includes('travel') || q.includes('cab') || q.includes('auto') || q.includes('walk') || q.includes('how to reach') || q.includes('get there')) {
    const method = formData.transportMethod;
    const methodLabel: Record<string, string> = {
      walk: 'walking 🚶', auto: 'auto-rickshaw 🛺', cab: 'cab/Ola 🚕', bike: 'bike 🏍️', own_vehicle: 'your own car 🚗',
    };
    return {
      text: `You're travelling by ${methodLabel[method] || method}. Transport cost for the whole outing is ₹${itinerary.costBreakdown.transport.toLocaleString()}. Travel time between stops is around 12–20 minutes. Tip: book your cab in advance on weekends!`,
      suggestions: ['How much is transport?', 'Change transport mode', 'Parking available?'],
    };
  }

  // Food / cuisine questions
  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('cuisine') || q.includes('hungry') || q.includes('meal') || q.includes('lunch') || q.includes('dinner') || q.includes('breakfast')) {
    const foodStops = itinerary.stops.filter((s) => s.costCategory === 'food');
    if (foodStops.length === 0) {
      return {
        text: `Your current plan doesn't have a dedicated food stop. Try replanning with a cuisine preference to add a restaurant or café to your route!`,
        suggestions: ['Add a food stop', 'Replan with cuisine', 'Show all stops'],
      };
    }
    const names = foodStops.map((s) => `${s.placeName} (${s.area})`).join(' and ');
    return {
      text: `Your food stops are: ${names}. Total food budget: ₹${itinerary.costBreakdown.food.toLocaleString()}. These are picked based on your ${formData.flavorPreference} flavor preference and ${formData.cuisine || 'any'} cuisine choice.`,
      suggestions: ['Any offers at food stops?', 'Vegetarian options?', 'Best rated food stop'],
    };
  }

  // Offers / discounts
  if (q.includes('offer') || q.includes('discount') || q.includes('deal') || q.includes('coupon') || q.includes('save')) {
    const offerStops = itinerary.stops.filter((s) => s.hasOffer);
    if (offerStops.length === 0) {
      return {
        text: `No active offers at your current stops right now. But check back — offers change daily! You can also explore the Offers & Events page for live deals nearby.`,
        suggestions: ['Show all stops', 'How to find deals?', 'What is trending?'],
      };
    }
    const offerList = offerStops.map((s) => `• ${s.placeName}: ${s.offerLabel}`).join('\n');
    return {
      text: `Great news! You have ${offerStops.length} active offer(s) on your route:\n${offerList}\n\nMake sure to mention the offer when you arrive or show it on your phone.`,
      suggestions: ['How to use the offer?', 'Any more deals?', 'Show cost breakdown'],
    };
  }

  // Reservation / booking
  if (q.includes('reserv') || q.includes('book') || q.includes('table') || q.includes('seat')) {
    const reservable = itinerary.stops.filter((s) => s.reservationAvailable);
    if (reservable.length === 0) {
      return {
        text: `None of your current stops require advance reservations — you can walk in! For popular spots on weekends, arriving 15–20 minutes early is always a good idea.`,
        suggestions: ['What are my stops?', 'Best time to visit?', 'Show itinerary'],
      };
    }
    const names = reservable.map((s) => s.placeName).join(', ');
    return {
      text: `You can make reservations at: ${names}. Use the "Reserve" button on each stop card to send a booking request. You'll get a confirmation within 15 minutes.`,
      suggestions: ['How to reserve?', 'Walk-in only stops?', 'Show all stops'],
    };
  }

  // Group / people
  if (q.includes('group') || q.includes('people') || q.includes('person') || q.includes('friend') || q.includes('family') || q.includes('how many people')) {
    return {
      text: `Your outing is planned for ${formData.groupSize} ${formData.groupSize === 1 ? 'person' : 'people'}. Per-person cost is ₹${Math.round(itinerary.costBreakdown.total / formData.groupSize).toLocaleString()}. If your group size changes, use the Replan button to regenerate the itinerary.`,
      suggestions: ['Change group size', 'Per person cost', 'Split the bill'],
    };
  }

  // Swap / alternative
  if (q.includes('swap') || q.includes('alternative') || q.includes('replace') || q.includes('different') || q.includes('another option') || q.includes('similar')) {
    return {
      text: `To swap a stop, click the 🔄 swap icon next to any stop in the Budget Tracker. The system will suggest a similar place in the same area that fits your remaining budget. You can also use the Replan button to generate a completely fresh itinerary.`,
      suggestions: ['Show Budget Tracker', 'Replan itinerary', 'Remove a stop'],
    };
  }

  // Help / what can you do
  if (q.includes('help') || q.includes('what can') || q.includes('how do') || q.includes('guide') || q.includes('explain') || q.includes('feature')) {
    return {
      text: `I'm your outing assistant! Here's what I can help with:\n\n💰 Budget — check if you're over/under budget\n🗺️ Stops — info about each place on your route\n⏰ Time — duration, arrival times, travel\n🍽️ Food — cuisine, restaurants, offers\n🔄 Swap — find alternatives for any stop\n📅 Reserve — book tables at restaurants\n\nJust ask me anything about your plan!`,
      suggestions: ['Check my budget', 'Show all stops', 'Any offers today?', 'How long is my outing?'],
    };
  }

  // Greeting
  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q === '') {
    return {
      text: `Hi there! 👋 I'm your FEASTYmap outing assistant. I can help you understand your itinerary, check your budget, find offers, swap stops, and plan better. What would you like to know?`,
      suggestions: ['Check my budget', 'Show all stops', 'Any offers?', 'How long is my outing?'],
    };
  }

  // Rating / best place
  if (q.includes('best') || q.includes('rating') || q.includes('popular') || q.includes('recommend') || q.includes('top')) {
    const sorted = [...itinerary.stops].sort((a, b) => b.rating - a.rating);
    const top = sorted[0];
    return {
      text: `The highest-rated stop on your route is ${top.placeName} in ${top.area} with a ${top.rating}⭐ rating. ${top.hasOffer ? `It also has an active offer: ${top.offerLabel}!` : 'It\'s a crowd favourite — definitely worth the visit!'}`,
      suggestions: ['Tell me more about it', 'Show all ratings', 'Any offers there?'],
    };
  }

  // Default fallback
  return {
    text: `I'm not sure about that, but I'm here to help with your outing plan! You can ask me about your budget, stops, travel time, food options, offers, or how to swap a place. What would you like to know?`,
    suggestions: ['Check my budget', 'Show all stops', 'Any offers?', 'Help me plan'],
  };
}

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'bot',
  text: `Hi! 👋 I'm your FEASTYmap assistant. Ask me anything about your itinerary — budget, stops, offers, travel time, or how to swap a place!`,
  suggestions: ['Check my budget', 'Show all stops', 'Any offers today?', 'How long is my outing?'],
};

export default function ItineraryChatbot({ itinerary, formData, onRemoveStop }: ItineraryChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getBotResponse(text, itinerary, formData);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: response.text,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
          isOpen
            ? 'bg-foreground text-background'
            : 'bg-primary text-primary-foreground shadow-primary/40'
        }`}
        aria-label="Open outing assistant"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={22} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <Sparkles size={9} className="text-white" />
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up max-h-[520px]">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-none">Outing Assistant</p>
              <p className="text-2xs opacity-75 mt-0.5">Ask me anything about your plan</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                  msg.role === 'bot' ?'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
                }`}>
                  {msg.role === 'bot' ? <Bot size={13} /> : <User size={13} />}
                </div>

                <div className={`flex flex-col gap-1.5 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === 'bot' ?'bg-muted text-foreground rounded-tl-sm' :'bg-primary text-primary-foreground rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Suggestions */}
                  {msg.role === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="px-2.5 py-1 bg-primary/8 text-primary border border-primary/20 rounded-full text-2xs font-medium hover:bg-primary/15 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={13} className="text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border bg-muted/20">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your plan..."
              className="flex-1 bg-input border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
