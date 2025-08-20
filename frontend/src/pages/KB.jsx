import {useEffect,useState} from 'react';
import api from '../lib/api';

export default function KB(){
  const [query,setQuery]=useState('');
  const [results,setResults]=useState([]);
  const search=async()=>{ const {data}=await api.get(`/kb?query=${encodeURIComponent(query)}`); setResults(data); };
  useEffect(()=>{ search(); },[]);
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-3">
        <input className="border p-2 flex-1" placeholder="Search KB" value={query} onChange={e=>setQuery(e.target.value)} />
        <button onClick={search} className="bg-blue-600 text-white px-3">Search</button>
      </div>
      <ul className="space-y-2">
        {results.map(r=>(
          <li key={r._id} className="border p-2">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-gray-600">{r.tags?.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
