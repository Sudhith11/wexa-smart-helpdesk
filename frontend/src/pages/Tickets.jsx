import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Link } from 'react-router-dom';

export default function Tickets(){
  const [tickets,setTickets]=useState([]);
  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');

  const load=async()=>{ const {data}=await api.get('/tickets?mine=true'); setTickets(data); };
  useEffect(()=>{ load(); },[]);

  const create = async (e)=>{ e.preventDefault();
    await api.post('/tickets',{title,description});
    setTitle(''); setDescription('');
    setTimeout(load, 900);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">My Tickets</h1>
      <form onSubmit={create} className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 flex-1" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <button className="bg-blue-600 text-white px-3">Create</button>
      </form>
      <ul className="space-y-2">
        {tickets.map(t=>(
          <li key={t._id} className="border p-2 flex justify-between">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-gray-600">{t.status} • {t.category}</div>
            </div>
            <Link className="text-blue-600" to={`/tickets/${t._id}`}>Open</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
