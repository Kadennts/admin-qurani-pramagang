"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Plus, Paperclip, Bold, Italic, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, ImageIcon, Link as LinkIcon, 
  List, ListOrdered, Undo
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAppPreferences } from "@/components/providers/app-preferences-provider";

export default function NewTicketPage() {
  const router = useRouter();
  const { profile } = useAppPreferences();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    tags: "",
    contact: "Nothing selected",
    assignee: "Nothing selected",
    name: "",
    email: "",
    priority: "Medium",
    service: "Nothing select",
    department: "Nothing selected",
    cc: "",
    body: "",
  });

  const generateTicketIdStr = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateTicket = async () => {
    if (!formData.subject || (!formData.body && formData.body.trim() === "")) {
      alert("Subject and Body are required!");
      return;
    }

    setIsLoading(true);
    
    // Default fallback name for display if empty
    const contactName = formData.name || (formData.contact !== "Nothing selected" ? formData.contact : "Guest Contact");

    const newTicket = {
      subject: formData.subject,
      contact_name: contactName,
      department: formData.department !== "Nothing selected" ? formData.department : "TECHNICAL",
      priority: formData.priority,
      status: "Open",
      ticket_id_str: generateTicketIdStr(),
      last_reply_at: null
    };

    const { data, error } = await supabase
      .from('support_tickets')
      .insert([newTicket])
      .select();

    setIsLoading(false);

    if (error) {
      alert("Error creating ticket: " + error.message);
    } else if (data && data.length > 0) {
      router.push(`/dashboard/support/tickets/${data[0].id}`);
    } else {
      router.push('/dashboard/support/tickets');
    }
  };

  const handlePredefinedReply = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const newLine = formData.body ? formData.body + "\n\n" + e.target.value : e.target.value;
      setFormData({ ...formData, body: newLine });
      e.target.value = ""; // reset dropdown explicitly via controlled value if needed
    }
  };

  const handleKnowledgeBase = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const newLine = formData.body ? formData.body + "\n" + e.target.value : e.target.value;
      setFormData({ ...formData, body: newLine });
      e.target.value = ""; // reset dropdown
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white min-h-[85vh] rounded-2xl shadow-sm border border-slate-100 flex flex-col mb-10 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
        <Link href="/dashboard/support/tickets" className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          Ticket Information
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Mail size={16} className="text-[#059669]" /> Ticket without contact
          </span>
        </h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
        
        {/* Row 1: Subject, Tags */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Subject</label>
            <input 
              type="text" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#059669]/50 text-sm transition-colors"
            />
          </div>
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span> Tags
            </label>
            <input 
              type="text" 
              placeholder="Tag"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full border border-transparent rounded-xl px-4 py-3 outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        {/* Row 2: Contact, Assign ticket */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Contact</label>
            <select 
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-600 focus:border-[#059669]/50 text-sm transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat"
            >
              <option>Nothing selected</option>
              <option>Amir</option>
              <option>Aisyah</option>
            </select>
          </div>
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Assign ticket (default is current user)</label>
            <select 
              value={formData.assignee}
              onChange={(e) => setFormData({...formData, assignee: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-600 focus:border-[#059669]/50 text-sm transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat shadow-sm"
            >
              <option>Nothing selected</option>
              <option>02_Alvia Agustin</option>
              <option>Alisha Zahra</option>
              <option>Ardi Ajalah</option>
              <option>{profile.name}</option>
            </select>
          </div>
        </div>

        {/* Row 3: Name, Email, Priority, Service */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#059669]/50 text-sm transition-colors"
            />
          </div>
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Email address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#059669]/50 text-sm transition-colors"
            />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Priority</label>
            <select 
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-600 focus:border-[#059669]/50 text-sm transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat shadow-sm"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Service</label>
            <div className="flex items-center gap-2">
              <select 
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-600 focus:border-[#059669]/50 text-sm transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat"
              >
                <option>Nothing select</option>
                <option>Hosting</option>
                <option>Server</option>
              </select>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl w-10 h-[46px] flex items-center justify-center transition-colors shrink-0">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: Department, CC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Department</label>
            <select 
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-600 focus:border-[#059669]/50 text-sm transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat shadow-sm"
            >
              <option>Nothing selected</option>
              <option>Marketing</option>
              <option>Technical</option>
              <option>Product</option>
              <option>Engineering</option>
              <option>Data</option>
              <option>Audio</option>
              <option>Sales</option>
              <option>Support</option>
            </select>
          </div>
          <div className="md:col-span-6 flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">CC</label>
            <input 
              type="text" 
              value={formData.cc}
              onChange={(e) => setFormData({...formData, cc: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#059669]/50 text-sm transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 my-6"></div>

        {/* Ticket Body Section */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-1">
            Ticket Body <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select 
                defaultValue=""
                onChange={handlePredefinedReply}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-600 text-sm transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat shadow-sm"
              >
                <option value="" disabled hidden>Insert predefined reply</option>
                <option value="Thank you for contacting us. We will follow up on your report soon.">Thank you for contacting us. We will follow up on your repor...</option>
                <option value="We apologize for any inconvenience. Our team is working on this.">We apologize for any inconvenience. Our team is working on t...</option>
                <option value="Please try the following steps to resolve your issue.">Please try the following steps to resolve your issue...</option>
              </select>
            </div>
            <div className="relative">
              <select 
                defaultValue=""
                onChange={handleKnowledgeBase}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-slate-600 text-sm transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[position:right_16px_center] bg-no-repeat shadow-sm"
              >
                <option value="" disabled hidden>Insert knowledge base link</option>
                <option value="KB: How to Reset Password">How to Reset Password</option>
                <option value="KB: Memorization Feature FAQ">Memorization Feature FAQ</option>
                <option value="KB: Sync Guide">Sync Guide</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50/50 border-b border-slate-200 p-2 flex items-center gap-1 overflow-x-auto hide-scrollbar">
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><Bold size={16} /></button>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><Italic size={16} /></button>
              <div className="w-px h-5 bg-slate-300 mx-1"></div>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><AlignLeft size={16} /></button>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><AlignCenter size={16} /></button>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><AlignRight size={16} /></button>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><AlignJustify size={16} /></button>
              <div className="w-px h-5 bg-slate-300 mx-1"></div>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><ImageIcon size={16} /></button>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><LinkIcon size={16} /></button>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><List size={16} /></button>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><ListOrdered size={16} /></button>
              <div className="w-px h-5 bg-slate-300 mx-1"></div>
              <button className="p-2 hover:bg-slate-200 text-slate-500 rounded"><Undo size={16} /></button>
            </div>
            <textarea 
              value={formData.body}
              onChange={(e) => setFormData({...formData, body: e.target.value})}
              className="w-full min-h-[220px] p-5 outline-none resize-none text-sm text-slate-700"
              placeholder="Write ticket body here..."
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              <Paperclip size={16} /> Attach File
            </button>
            <button 
              onClick={handleCreateTicket}
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Opening..." : "Open Ticket"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
