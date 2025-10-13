import SignInUp from './components/firstPage';
import Home from './components/home';
import Settings from './components/settings';
import Help from './components/help';
import Forget from './components/forget';
import Admin from './admin_components/admin';
import UserMails from './admin_components/usermails';
import FullMailDetail from './admin_components/fullmaildetail';
import { Routes, Route } from "react-router-dom";
import AdminLogin from './admin_components/adminlogin';

export default function App(){
  return(
  <Routes>
    <Route path="/" element={<SignInUp/>}/>
    <Route path="/forget" element={<Forget/>}/>
    <Route path="/home" element={<Home/>}/>
    <Route path="/settings" element={<Settings/>}/>
    <Route path="/help" element={<Help/>}/>
    <Route path="/admin/login" element={<AdminLogin/>}/>
    <Route path="/admin/home" element={<Admin/>}/>
    <Route path="/admin/mails" element={<UserMails/>}/>
    <Route path="/admin/full_mail_detail" element={<FullMailDetail/>}/>
  </Routes>
  );
}