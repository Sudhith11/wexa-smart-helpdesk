import { useState } from 'react';
import { useAuth } from '../store/authStore';

export default function Login(){
  const {login} = useAuth();
  const [email,setEmail]=useState('user@helpdesk.com');
  const [password,setPassword]=useState('user123');
  const onSubmit = async (e)=>{ e.preventDefault(); await login(email,password); window.location.href='/tickets'; }
  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-4 flex flex-col gap-3">
      <input className="border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-black text-white p-2">Login</button>
    </form>
  );
}
