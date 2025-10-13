import { useState } from "react";
import NavBar from "./navbar";
import MailList from "./maillist";
import MailDetail from "./maildetail";

export default function Home() {
  const [selected, setSelected] = useState("Inbox");
  const [activeMail, setActiveMail] = useState(null);
  const [navExpanded, setNavExpanded] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Navbar */}
      <NavBar
        selected={selected}
        setSelected={setSelected}
        navExpanded={navExpanded}
        setNavExpanded={setNavExpanded}
      />

      {/* MailList */}
      <MailList
        selected={selected}
        activeMail={activeMail}
        setActiveMail={setActiveMail}
        navExpanded={navExpanded}
      />

      {/* MailDetail */}
      <MailDetail activeMail={activeMail} setActiveMail={setActiveMail} selected={selected} setSelected={setSelected}/>
    </div>
  );
}
