import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function TicketDetail(){
  const {id} = useParams();
  const [ticket,setTicket]=useState(null);
  const [audit,setAudit]=useState([]);
  const [suggestion,setSuggestion]=useState(null);

  const load=async()=>{
    const t = await api.get(`/tickets/${id}`); setTicket(t.data);
    const a = await api.get(`/tickets/${id}/audit`); setAudit(a.data);
    const s = await api.get(`/agent/suggestion/${id}`); setSuggestion(s.data);
  };
  useEffect(()=>{ load(); const iv=setInterval(load, 1500); return ()=>clearInterval(iv); },[id]);

  if(!ticket) return <div className="p-4">Loading...</div>;
  return (
    <div className="p-4 grid md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">{ticket.title}</h2>
        <p className="mb-2">{ticket.description}</p>
        <div className="text-sm text-gray-700">Status: {ticket.status} | Category: {ticket.category}</div>
        {suggestion && (
          <div className="mt-4 border p-3">
            <div className="font-semibold">Agent Suggestion</div>
            <div className="whitespace-pre-wrap text-sm mt-2">{suggestion.draftReply}</div>
            <div className="text-xs mt-2 text-gray-500">Confidence: {suggestion.confidence}</div>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Audit</h3>
        <ul className="space-y-2 text-sm">
          {audit.map(log=>(
            <li key={log._id} className="border p-2">
              <div>{log.action}</div>
              <div className="text-gray-500">{new Date(log.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
