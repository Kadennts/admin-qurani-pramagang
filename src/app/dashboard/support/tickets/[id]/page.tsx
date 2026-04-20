"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Paperclip, Plus, Bell, FileText, CheckSquare, Layers, 
  Trash2, X, ChevronDown, AlignLeft, GripVertical, Check, MessageSquare, Clock, AlertCircle
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAppPreferences } from "@/components/providers/app-preferences-provider";

export default function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;
  
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("add_reply");
  
  // Tasks State
  const [tasks, setTasks] = useState<{id: number, text: string, completed: boolean}[]>([]);
  const [newTask, setNewTask] = useState("");

  const { profile } = useAppPreferences();
  const [replyText, setReplyText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyStatus, setReplyStatus] = useState("Answered");
  const [replies, setReplies] = useState<{ id: string; author: string; created_at: string; text: string; attachments: File[] }[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchTicket = async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .single();
      
      if (data) {
        setTicket(data);
        if (data.status) setReplyStatus(data.status);
      }
      setIsLoading(false);
    };
    fetchTicket();
  }, [ticketId, supabase]);

  const handleStatusChange = async (newStatus: string) => {
    setReplyStatus(newStatus);
    if (!ticket) return;
    setTicket((prev: any) => ({ ...prev, status: newStatus }));
    await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticketId);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim() && attachments.length === 0) return;
    
    // Update ticket status dynamically if changed from dropdown (though now handled by handleStatusChange immediately)
    const updates: any = { last_reply_at: new Date().toISOString() };
    if (replyStatus !== ticket?.status) {
      updates.status = replyStatus;
      setTicket((prev: any) => ({ ...prev, status: replyStatus }));
    }
    await supabase.from('support_tickets').update(updates).eq('id', ticketId);

    const newReply = {
      id: Date.now().toString(),
      author: profile.name,
      created_at: new Date().toISOString(),
      text: replyText,
      attachments: [...attachments],
    };

    setReplies((prev) => [newReply, ...prev]);
    setReplyText("");
    setAttachments([]);
  };

  const updatePriority = async (newPriority: string) => {
    if (!ticket) return;
    setTicket((prev: any) => ({ ...prev, priority: newPriority }));
    await supabase.from('support_tickets').update({ priority: newPriority }).eq('id', ticketId);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const tabs = [
    { id: "add_reply", label: "Add Reply", icon: AlignLeft, badge: null },
    { id: "notes", label: "Notes", icon: FileText, badge: null },
    { id: "reminders", label: "Reminders", icon: Bell, badge: null },
    { id: "related", label: "Related Tickets", icon: Layers, badge: null },
    { id: "tasks", label: "Tasks", icon: CheckSquare, badge: tasks.length },
  ];

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'Answered':
        return { bg: 'bg-[#eff6ff]', text: 'text-[#3b82f6]', border: 'border-[#bfdbfe]', hover: 'hover:bg-blue-100', icon: <MessageSquare size={16} className="text-[#3b82f6]" /> };
      case 'Open':
        return { bg: 'bg-[#fef2f2]', text: 'text-[#ef4444]', border: 'border-[#fecaca]', hover: 'hover:bg-red-100', icon: <AlertCircle size={16} className="text-[#ef4444]" /> };
      case 'In Progress':
        return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', hover: 'hover:bg-slate-200', icon: <Clock size={16} className="text-slate-500" /> };
      case 'On Hold':
        return { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-300', hover: 'hover:bg-slate-100', icon: <Clock size={16} className="text-slate-400" /> };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', hover: 'hover:bg-slate-200', icon: <MessageSquare size={16} className="text-slate-500" /> };
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      
      {/* ── Header ── */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <Link href="/dashboard/support/tickets" className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        {isLoading ? (
           <div className="h-8 bg-slate-100 rounded-lg w-1/2 animate-pulse" />
        ) : (
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
             {ticket?.ticket_id_str || `#${ticketId}`} <span className="text-slate-300 font-light">|</span> <span className="text-slate-700">{ticket?.subject}</span>
           </h1>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── Main Content (Left) ── */}
        <div className="lg:col-span-8 flex flex-col min-h-[500px]">
          
          {/* Tabs Navigation */}
          <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto hide-scrollbar mb-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-all whitespace-nowrap text-sm font-bold ${
                    isActive ? "border-[#059669] text-[#059669]" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#059669]" : "text-slate-400"} />
                  {tab.label}
                  {tab.badge !== null && tab.badge > 0 && (
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Wrapper */}
          <div className="flex-1">
            
            {/* TAB: ADD REPLY */}
            {activeTab === "add_reply" && (
              <div className="space-y-6">
                {/* Reply Editor */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-700 text-sm">
                    Reply to Ticket
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full min-h-[140px] p-5 outline-none text-slate-700 placeholder:text-slate-400 text-sm resize-none"
                    placeholder="Enter your reply here..."
                  />
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 px-5 pb-3">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                          <img src={URL.createObjectURL(file)} alt="attachment" className="w-full h-full object-cover" />
                          <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center w-16 h-16 rounded-xl border border-dashed border-slate-300 text-slate-400 hover:bg-slate-50 cursor-pointer">
                        <Plus size={16} />
                        <span className="text-[10px] font-medium mt-1">Add</span>
                        <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => { if(e.target.files) setAttachments([...attachments, ...Array.from(e.target.files)]) }} />
                      </label>
                    </div>
                  )}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <label className="text-slate-400 hover:text-slate-700 p-2 rounded-lg transition-colors cursor-pointer">
                      <Paperclip size={18} />
                      <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => { if(e.target.files) setAttachments([...attachments, ...Array.from(e.target.files)]) }} />
                    </label>
                    {attachments.length > 0 && (
                      <span className="text-xs font-semibold text-slate-500 mr-auto ml-2 flex items-center gap-1">
                        <Paperclip size={12} /> {attachments.length} files
                      </span>
                    )}

                    <div className={`flex items-center gap-3 ${attachments.length === 0 ? "ml-auto" : ""}`}>
                      <div className="relative">
                        <select 
                          value={replyStatus}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="appearance-none bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg px-4 py-2 pr-10 outline-none hover:border-slate-400 cursor-pointer"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Answered">Answered</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                      <button onClick={handleReplySubmit} className="bg-slate-400 hover:bg-slate-500 text-white font-bold text-sm px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {replies.map((reply) => (
                  <div key={reply.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col items-start p-5 gap-4">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                        {reply.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{reply.author} <span className="font-normal text-slate-500">replied</span></div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">
                          {new Date(reply.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    {reply.text && <p className="text-slate-700 text-sm whitespace-pre-wrap">{reply.text}</p>}
                    {reply.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reply.attachments.map((file, idx) => (
                          <img key={idx} src={URL.createObjectURL(file)} className="w-20 h-20 rounded-xl object-cover border border-slate-200" alt="attachment" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}



                
              </div>
            )}

            {/* TAB: NOTES */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    className="w-full min-h-[120px] p-5 pr-16 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm text-sm text-slate-700 placeholder:text-slate-400 resize-none focus:border-[#059669]/30"
                    placeholder="Add an internal note..."
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center rounded-xl transition-colors">
                    <Plus size={20} />
                  </button>
                </div>

                {/* Notes List */}
                <div className="py-8 text-center text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  No internal notes added yet.
                </div>
              </div>
            )}

            {/* TAB: REMINDERS */}
            {activeTab === "reminders" && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6">Add Reminder</h3>
                  <div className="space-y-4">
                    <input type="text" placeholder="Reminder title..." className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm focus:border-[#059669]/50 transition-colors" />
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input type="datetime-local" className="flex-1 bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm text-slate-600 focus:border-[#059669]/50 transition-colors" />
                      <input type="text" placeholder="Staff..." className="flex-1 bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm focus:border-[#059669]/50 transition-colors" />
                    </div>
                    <button className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm">
                      Create Reminder
                    </button>
                  </div>
                </div>

                {/* Reminder Item */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start justify-between group shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-slate-400">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">testing</h4>
                      <p className="text-slate-500 text-xs mt-1">17 Apr 2026 21:47 • refan</p>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-lg">
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: RELATED TICKETS */}
            {activeTab === "related" && (
              <div className="py-12 flex items-center justify-center text-slate-400 font-medium text-sm border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                No related tickets found.
              </div>
            )}

            {/* TAB: TASKS */}
            {activeTab === "tasks" && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    placeholder="New task..." 
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none text-sm focus:border-[#059669]/50 transition-colors shadow-sm" 
                  />
                  <button onClick={addTask} className="bg-[#059669] hover:bg-[#047857] text-white w-12 rounded-xl flex items-center justify-center transition-colors shadow-sm shrink-0">
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="group flex flex-col sm:flex-row items-center border border-slate-200 bg-white hover:border-[#059669]/30 rounded-xl px-4 py-3.5 transition-all shadow-sm cursor-pointer"
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="flex items-center flex-1 gap-4 w-full">
                        <div 
                          className={`w-5 h-5 rounded overflow-hidden flex items-center justify-center border transition-all shrink-0 ${
                            task.completed ? "bg-[#059669] border-[#059669]" : "border-slate-300 bg-white"
                          }`}
                        >
                          {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm font-medium transition-all select-none ${
                          task.completed ? "text-slate-400 line-through" : "text-slate-700"
                        }`}>
                          {task.text}
                        </span>
                      </div>
                      <div className="sm:opacity-0 group-hover:opacity-100 transition-opacity mt-3 sm:mt-0 ml-auto w-full sm:w-auto flex justify-end">
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                          className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-sm italic">
                      No tasks added yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status Box */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2">STATUS</h4>
            <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center gap-2 shadow-sm">
              {(() => {
                const s = getStatusDisplay(ticket?.status || 'Open');
                return (
                  <div className={`flex-1 flex items-center gap-2 px-3 py-2 font-bold text-sm rounded-lg border cursor-pointer transition-colors ${s.bg} ${s.text} ${s.border} ${s.hover}`}>
                    {s.icon} {ticket?.status || 'Open'}
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Priority Box */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2">PRIORITY</h4>
            <div className="bg-slate-100/80 p-1 rounded-xl flex items-center shadow-inner border border-slate-200/60">
              <button onClick={() => updatePriority("Low")} className={`flex-1 py-2 text-sm transition-colors rounded-lg ${ticket?.priority === 'Low' ? 'font-bold text-slate-900 bg-white shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-700'}`}>Low</button>
              <button onClick={() => updatePriority("Medium")} className={`flex-1 py-2 text-sm transition-colors rounded-lg ${ticket?.priority === 'Medium' ? 'font-bold text-slate-900 bg-white shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-700'}`}>Medium</button>
              <button onClick={() => updatePriority("High")} className={`flex-1 py-2 text-sm transition-colors rounded-lg ${ticket?.priority === 'High' ? 'font-bold text-slate-900 bg-white shadow-sm' : 'font-semibold text-slate-500 hover:text-slate-700'}`}>High</button>
            </div>
          </div>

          <div className="my-6 border-b border-slate-200" />

          {/* Details Box */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-4">DETAILS</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Department</span>
                <span className="font-bold text-slate-800">{ticket?.department || 'TECHNICAL'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Contact</span>
                <span className="text-slate-800 font-medium">{ticket?.contact_name || '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-800 font-medium">{ticket?.created_at ? new Date(ticket.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</span>
              </div>
            </div>
          </div>

          <div className="my-6 border-b border-slate-200" />

          {/* Tags Box */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-3">TAGS</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-200">#support</span>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-md border border-slate-200">#bug</span>
            </div>
          </div>

          <div className="my-6 border-b border-slate-200" />

          {/* Assignee Box */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-2">ASSIGNEE</h4>
            <div className="relative">
              <select className="appearance-none w-full bg-white border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl px-4 py-3 outline-none hover:border-slate-300 transition-colors shadow-sm cursor-pointer">
                <option>Unassigned</option>
                <option>Admin Qurani</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
