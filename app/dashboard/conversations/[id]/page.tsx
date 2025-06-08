/**
 * File: app/dashboard/conversations/[id]/page.tsx
 * Purpose: Renders a detailed conversation view with message history, client information, and AI-powered insights.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Phone, Mail, Calendar, MapPin, Flag, RefreshCw, Sparkles, X, Info, Copy, Check, Download, ThumbsUp, ThumbsDown } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Thread } from "@/app/types/lcp"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';

// Add type declaration for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

/**
 * Logo Component
 * Displays the ACS logo with customizable size and gradient text
 * 
 * @param {Object} props - Component props
 * @param {"sm" | "lg"} props.size - Size variant of the logo
 * @returns {JSX.Element} ACS logo with gradient background and text
 */
function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm">ACS</span>
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent">
        ACS
      </span>
    </div>
  )
}

// Utility to get a color for the EV score (red-yellow-green gradient)
function getEvColor(score: number) {
  if (score <= 39) return '#ef4444'; // red-500
  if (score <= 69) return '#facc15'; // yellow-400
  return '#22c55e'; // green-500
}

/**
 * LoadingSkeleton Component
 * Displays an animated loading state for the conversation detail page
 */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <div className="h-8 w-8 bg-white/50 rounded-lg animate-pulse" />
          <div className="h-8 w-64 bg-white/50 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages section skeleton */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm flex flex-col relative h-[50rem]">
            <div className="p-4 border-b">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="h-16 w-64 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Client info skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* AI Summary skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* EV Score Threshold skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ConversationDetailPage Component
 * Main conversation detail component displaying message history and client information
 * 
 * Features:
 * - Real-time message display
 * - Client information panel
 * - AI-powered conversation summary
 * - Quick action buttons
 * 
 * @returns {JSX.Element} Complete conversation detail view
 */
export default function ConversationDetailPage() {
  const params = useParams()
  const conversationId = params.id as string
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState<number | null>(null)
  const [updatingThreshold, setUpdatingThreshold] = useState(false)
  const [generatingResponse, setGeneratingResponse] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Add CSS for pulsating glow effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulsate {
        0% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(14, 101, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0); }
      }
      .thread-busy {
        animation: pulsate 2s infinite;
        border: 2px solid #0e6537;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add reloadConversation function
  const reloadConversation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lcp/getThreadById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId }),
      });
      const data = await res.json();
      if (data.success) {
        setThread(data.data.thread);
        setMessages(data.data.messages);
        setThreshold(typeof data.data.thread.lcp_flag_threshold === 'number' 
          ? data.data.thread.lcp_flag_threshold 
          : Number(data.data.thread.lcp_flag_threshold) || 0
        );
      }
    } catch (error) {
      console.error('Error reloading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadConversation();
  }, [conversationId]);

  // Fetch feedback for all user messages on load
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!conversationId || !messages.length) return;
      setFeedbackLoading(true);
      try {
        // Get all feedback for this conversation
        const res = await fetch('/api/db/select', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table_name: 'EVDataCollection',
            index_name: 'conversation_id-index',
            key_name: 'conversation_id',
            key_value: conversationId,
          })
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          // Map message_id to flag
          const fb: Record<string, 'like' | 'dislike' | null> = {};
          data.items.forEach((item: any) => {
            if (item.message_id && item.flag) {
              fb[item.message_id] = item.flag;
            }
          });
          setFeedback(fb);
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setFeedbackLoading(false);
      }
    };
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, messages.length]);

  // Find client email from the first inbound message or thread
  const clientEmail =
    messages.find((msg) => msg.type === "inbound-email")?.sender ||
    thread?.associated_account ||
    "Client"

  const leadName = thread?.source_name || clientEmail;

  // Sort messages by timestamp ascending
  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Get the last message to determine if we can generate a response
  const lastMessage = sortedMessages[sortedMessages.length - 1]
  const canGenerateResponse = lastMessage?.type === "inbound-email"

  // Update generateAIResponse function
  const generateAIResponse = async () => {
    if (!canGenerateResponse || !thread) return

    try {
      setGeneratingResponse(true)
      const response = await fetch('/api/lcp/get_llm_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          account_id: thread.associated_account,
          is_first_email: messages.length === 1
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate AI response')
      }

      const data = await response.json()
      if (data.success) {
        // Directly set the response in the text field
        setMessageInput(data.data.response || '')
      } else {
        throw new Error(data.error || 'Failed to generate response')
      }
    } catch (error) {
      console.error('Error generating AI response:', error)
      // You might want to show an error toast here
    } finally {
      setGeneratingResponse(false)
    }
  }

  // Update handleSendResponse function
  const handleSendResponse = async () => {
    if (!thread || !messageInput.trim()) return;

    try {
      setSendingEmail(true);
      const response = await fetch('/api/lcp/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          response_body: messageInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      if (data.success) {
        // Clear the message input
        setMessageInput('');
        // Reload all conversation data
        await reloadConversation();
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  }

  // Add function to format conversation
  const formatConversation = () => {
    if (!thread || !messages.length) return '';

    const header = `Conversation with ${leadName}\n${'='.repeat(50)}\n\n`;
    const clientInfo = `Client Information:\n` +
      `Email: ${clientEmail}\n` +
      (thread.phone ? `Phone: ${thread.phone}\n` : '') +
      (thread.location ? `Location: ${thread.location}\n` : '') +
      '\n';

    const messageHistory = sortedMessages.map(msg => {
      const timestamp = new Date(msg.timestamp).toLocaleString();
      const sender = msg.type === "inbound-email" ? clientEmail : "You";
      const evScore = msg.type === "inbound-email" && msg.ev_score ? ` [EV Score: ${msg.ev_score}]` : '';
      
      return `${sender} (${timestamp})${evScore}:\n${msg.body}\n${'-'.repeat(50)}\n`;
    }).join('\n');

    return header + clientInfo + messageHistory;
  };

  // Add function to handle copy
  const handleCopyConversation = async () => {
    const formattedText = formatConversation();
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Add function to generate PDF
  const generatePDF = async () => {
    if (!thread || !messages.length) return;
    
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add ACS Logo and Header
      doc.setFillColor(14, 101, 55); // ACS green
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('ACS', 20, 25);
      doc.setFontSize(16);
      doc.text('Conversation Report', pageWidth - 20, 25, { align: 'right' });
      
      // Reset text color for content
      doc.setTextColor(0, 0, 0);
      
      // Add Client Information
      doc.setFontSize(14);
      doc.text('Client Information', 20, 60);
      doc.setFontSize(12);
      doc.text(`Name: ${leadName}`, 20, 70);
      doc.text(`Email: ${clientEmail}`, 20, 75);
      if (thread.phone) doc.text(`Phone: ${thread.phone}`, 20, 80);
      if (thread.location) doc.text(`Location: ${thread.location}`, 20, 85);
      
      // Add Conversation Summary
      doc.setFontSize(14);
      doc.text('Conversation Summary', 20, 100);
      doc.setFontSize(12);
      
      // Calculate summary statistics
      const totalMessages = messages.length;
      const inboundMessages = messages.filter(m => m.type === 'inbound-email').length;
      const outboundMessages = messages.filter(m => m.type === 'outbound-email').length;
      const avgEvScore = messages
        .filter(m => m.type === 'inbound-email' && m.ev_score)
        .reduce((acc, m) => acc + Number(m.ev_score), 0) / inboundMessages || 0;
      
      // Add summary table
      autoTable(doc, {
        startY: 105,
        head: [['Metric', 'Value']],
        body: [
          ['Total Messages', totalMessages.toString()],
          ['Inbound Messages', inboundMessages.toString()],
          ['Outbound Messages', outboundMessages.toString()],
          ['Average EV Score', avgEvScore.toFixed(1)],
          ['Conversation Duration', getConversationDuration()],
        ],
        theme: 'grid',
        headStyles: { fillColor: [14, 101, 55] },
        styles: { fontSize: 10 },
      });
      
      // Add AI Summary if available
      if (thread.ai_summary && thread.ai_summary !== 'UNKNOWN') {
        doc.setFontSize(14);
        doc.text('AI Analysis', 20, doc.lastAutoTable.finalY + 20);
        doc.setFontSize(12);
        doc.text(thread.ai_summary, 20, doc.lastAutoTable.finalY + 30, { maxWidth: pageWidth - 40 });
      }
      
      // Add Message History
      doc.setFontSize(14);
      doc.text('Message History', 20, doc.lastAutoTable.finalY + 50);
      
      let yPosition = doc.lastAutoTable.finalY + 60;
      
      sortedMessages.forEach((msg, index) => {
        const sender = msg.type === "inbound-email" ? clientEmail : "You";
        const timestamp = new Date(msg.timestamp).toLocaleString();
        const evScore = msg.type === "inbound-email" && msg.ev_score ? ` [EV Score: ${msg.ev_score}]` : '';
        
        // Prepare message text
        const splitText = doc.splitTextToSize(msg.body, pageWidth - 40);
        const blockHeight = 7 + splitText.length * 7 + 7; // header + text + separator
        if (yPosition + blockHeight > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPosition = 20;
        }
        // Add message header
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`${sender} - ${timestamp}${evScore}`, 20, yPosition);
        // Add message content
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(splitText, 20, yPosition + 7);
        // Add separator
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 7 + (splitText.length * 7), pageWidth - 20, yPosition + 7 + (splitText.length * 7));
        yPosition += blockHeight;
      });
      
      // Add footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`conversation-${conversationId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // Helper function to calculate conversation duration
  const getConversationDuration = () => {
    if (messages.length < 2) return 'N/A';
    const firstMessage = new Date(messages[0].timestamp);
    const lastMessage = new Date(messages[messages.length - 1].timestamp);
    const diffDays = Math.floor((lastMessage.getTime() - firstMessage.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Less than a day';
    return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
  };

  // Helper to get conversation up to a message
  const getConversationToMessage = (messageId: string) => {
    const idx = sortedMessages.findIndex(m => m.response_id === messageId);
    if (idx === -1) return [];
    return sortedMessages.slice(0, idx + 1).map(m => ({
      sender: m.type === 'inbound-email' ? clientEmail : 'You',
      timestamp: new Date(m.timestamp).toLocaleString(),
      body: m.body,
      ev_score: m.ev_score ?? null,
      type: m.type,
      subject: m.subject ?? null,
      summary: m.summary ?? null,
      // Add any other relevant fields here as needed
    }));
  };

  // Handle thumbs up/down click
  const handleFeedback = async (messageId: string, flag: 'like' | 'dislike') => {
    setFeedback(prev => ({ ...prev, [messageId]: flag }));
    try {
      await fetch('/api/db/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_name: 'EVDataCollection',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            message_id: messageId,
            flag,
            conversation: getConversationToMessage(messageId),
          }
        })
      });
    } catch (err) {
      console.error('Error updating feedback:', err);
    }
  };

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10 h-[calc(100vh-48px)]">
        {/* Left: Conversation History */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <Logo />
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gradient-to-r hover:from-[#0e6537]/10 hover:to-[#157a42]/10 transition-all duration-200 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">Conversation with {leadName}</h1>
          </div>
          <div className="bg-white rounded-2xl border shadow-lg p-0 overflow-hidden flex-1">
            <div className="px-8 py-4 border-b bg-[#f7faf9] flex items-center justify-between">
              <h2 className="text-xl font-semibold">Conversation History</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyConversation}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                  title="Copy conversation to clipboard"
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={generatePDF}
                  disabled={generatingPdf}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm disabled:opacity-50"
                  title="Download conversation as PDF"
                >
                  {generatingPdf ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span className="text-sm">PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto px-8 py-6 space-y-8">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 w-full bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : sortedMessages.length === 0 ? (
                <div>No messages found.</div>
              ) : (
                sortedMessages.map((msg, idx) => (
                  <div
                    key={msg.response_id}
                    className={`flex ${msg.type === "outbound-email" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-md w-full flex flex-col gap-1 ${msg.type === "outbound-email" ? "items-end" : "items-start"}`}>
                      <div className={`rounded-xl px-6 py-4 shadow-sm ${msg.type === "outbound-email" ? "bg-gradient-to-br from-[#0e6537] to-[#157a42] text-white" : "bg-gray-50 text-gray-900 border"}`}>
                        <div className="whitespace-pre-line text-base">{msg.body}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{msg.type === "inbound-email" ? clientEmail : "You"}</span>
                        <span>·</span>
                        <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ""}</span>
                        {msg.type === "inbound-email" && typeof msg.ev_score === 'string' && Number(msg.ev_score) >= 0 && Number(msg.ev_score) <= 100 && (
                          <span className="ml-2 flex items-center gap-1">
                            <span className="font-semibold text-green-700">EV {msg.ev_score}</span>
                            {!feedbackLoading && (
                              <>
                                <button
                                  className={`ml-1 p-0.5 rounded-full ${feedback[msg.response_id] === 'like' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-400'}`}
                                  onClick={() => handleFeedback(msg.response_id, 'like')}
                                  aria-label="Thumbs up"
                                >
                                  <ThumbsUp className="w-4 h-4" fill={feedback[msg.response_id] === 'like' ? '#22c55e' : 'none'} />
                                </button>
                                <button
                                  className={`ml-1 p-0.5 rounded-full ${feedback[msg.response_id] === 'dislike' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100 text-gray-400'}`}
                                  onClick={() => handleFeedback(msg.response_id, 'dislike')}
                                  aria-label="Thumbs down"
                                >
                                  <ThumbsDown className="w-4 h-4" fill={feedback[msg.response_id] === 'dislike' ? '#ef4444' : 'none'} />
                                </button>
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Response and widgets grid below */}
        <div className="flex flex-col flex-1">
          <div className="bg-white rounded-2xl border shadow-lg p-0 overflow-hidden w-full mt-11">
            <div className="px-8 py-4 border-b bg-[#f7faf9] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0e6537]" />
              <h2 className="text-lg font-semibold">AI Response</h2>
              <span className="text-xs text-gray-400">(Draft a reply with AI assistance)</span>
            </div>
            <div className="px-8 py-6 flex flex-col gap-4">
              {/* Info banner */}
              <div className="bg-[#0e6537]/5 border border-[#0e6537]/20 rounded-lg p-3 flex items-start gap-2">
                <Info className="h-5 w-5 text-[#0e6537] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#0e6537]">
                  <p className="font-medium mb-1">Email Details</p>
                  <ul className="list-disc list-inside space-y-1 text-[#0e6537]/80">
                    <li>Subject will be automatically generated based on the conversation</li>
                    <li>Your email signature will be appended to the message</li>
                    <li>You can edit the response before sending</li>
                  </ul>
                </div>
              </div>

              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={thread?.busy ? "Email sending in progress..." : "Type or generate your reply..."}
                className="w-full h-40 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537] resize-none text-base"
                disabled={thread?.busy}
              />
              <div className="flex gap-2 justify-between items-center">
                <button
                  onClick={generateAIResponse}
                  disabled={!canGenerateResponse || generatingResponse || thread?.busy}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${canGenerateResponse && !thread?.busy ? 'bg-[#0e6537]/10 text-[#0e6537] hover:bg-[#0e6537]/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  title={thread?.busy ? "Email sending in progress" : canGenerateResponse ? "Generate an AI response" : "Can only generate responses to user messages"}
                >
                  {generatingResponse ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      AI-Generate Response
                    </>
                  )}
                </button>
                <button
                  onClick={handleSendResponse}
                  className="px-6 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!messageInput.trim() || thread?.busy || sendingEmail}
                  title={thread?.busy ? "Email sending in progress" : "Send email"}
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 inline mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Widgets grid below AI Response */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-10 mt-6">
            {/* Client Information */}
            <div className="bg-white rounded-2xl border shadow-lg p-6 flex flex-col items-center text-center min-h-[170px]">
              <div className="w-14 h-14 bg-[#0e6537]/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-semibold text-[#0e6537]">{leadName[0]?.toUpperCase()}</span>
              </div>
              <div className="mb-1 font-bold text-lg">{leadName}</div>
              <div className="text-gray-500 text-sm mb-2">{clientEmail}</div>
              {thread?.phone && <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1"><Phone className="h-4 w-4" />{thread.phone}</div>}
              {thread?.location && <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1"><MapPin className="h-4 w-4" />{thread.location}</div>}
            </div>

            {/* AI Insights */}
            {thread && (() => {
              const aiSummary = thread.ai_summary?.trim();
              const budgetRange = thread.budget_range?.trim();
              const propertyTypes = thread.preferred_property_types?.trim();
              const timeline = thread.timeline?.trim();
              const isEmpty = [aiSummary, budgetRange, propertyTypes, timeline].every((val) => !val || val === 'UNKNOWN');
              if (isEmpty) return null;
              return (
                <div className="bg-white rounded-2xl border shadow-lg p-6 text-left min-h-[170px] flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
                  {aiSummary && aiSummary !== 'UNKNOWN' && (
                    <div className="mb-2 text-gray-700"><span className="font-medium">Summary:</span> {aiSummary}</div>
                  )}
                  {budgetRange && budgetRange !== 'UNKNOWN' && (
                    <div className="mb-2 text-gray-700"><span className="font-medium">Budget:</span> {budgetRange}</div>
                  )}
                  {propertyTypes && propertyTypes !== 'UNKNOWN' && (
                    <div className="mb-2 text-gray-700"><span className="font-medium">Property Types:</span> {propertyTypes}</div>
                  )}
                  {timeline && timeline !== 'UNKNOWN' && (
                    <div className="mb-2 text-gray-700"><span className="font-medium">Timeline:</span> {timeline}</div>
                  )}
                </div>
              );
            })()}

            {/* EV Score Threshold */}
            <div className="bg-white rounded-2xl border shadow-lg p-6 min-h-[170px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-700">EV Score Threshold</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Set the threshold to flag conversations for review when EV score exceeds this value.
              </p>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={threshold ?? 0}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-40 accent-red-600"
                  disabled={updatingThreshold}
                />
                <span className="font-mono text-lg text-red-700">{threshold}</span>
              </div>
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                disabled={updatingThreshold || threshold === thread?.lcp_flag_threshold}
                onClick={async () => {
                  if (!thread) return;
                  setUpdatingThreshold(true);
                  try {
                    const res = await fetch('/api/db/update', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        table_name: 'Threads',
                        key_name: 'conversation_id',
                        key_value: thread.conversation_id,
                        update_data: { lcp_flag_threshold: String(threshold) }
                      })
                    });
                    if (res.ok) {
                      setThread((prev: any) => ({ ...prev, lcp_flag_threshold: threshold }));
                    }
                  } finally {
                    setUpdatingThreshold(false);
                  }
                }}
              >
                {updatingThreshold ? 'Applying...' : 'Apply Threshold'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created conversation detail page with message history
 * - Implemented client information panel
 * - Added AI-powered conversation summary
 * - Integrated quick action buttons
 * - Added responsive design for all screen sizes
 */
