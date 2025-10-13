import { FiSearch } from "react-icons/fi";
import MailBlock from "./mailblock";
import { useState, useEffect } from "react";
import axios from "axios";
import { decryptString } from "../crypto/crypto";
import JSONbig from "json-bigint";
export default function MailList({
  selected,
  activeMail,
  setActiveMail,
  navExpanded,
}) {
  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getMails = async () => {
      try {
        const id = localStorage.getItem("userId"); //user id
        const response = await axios.get(
          `http://127.0.0.1:8000/get_mail/${id}/${selected}`
        );
        const keyDetail = JSONbig.parse(localStorage.getItem("keys"));

        const decryptedMails = response.data.map((mail) => {
          // Parse the stringified array from Django if needed
          const encryptedArray = Array.isArray(mail.message)
            ? mail.message
            : JSON.parse(mail.message);

          // Ensure each number is BigInt
          const encryptedBigIntArray = encryptedArray.map((num) => BigInt(num));

          // Ensure keys are BigInt
          const privateKeyBigInt = BigInt(keyDetail.privateKey);
          const NBigInt = BigInt(keyDetail.N);

          return {
            ...mail,
            message: decryptString(
              encryptedBigIntArray,
              privateKeyBigInt,
              NBigInt
            ),
          };
        });

        setEmails(decryptedMails);
      } catch (error) {
        console.error("error in fetching data", error);
      }
    };

    getMails();
  }, [selected]);

  const filteredEmails = emails.filter((mail) => {
    const fullName = `${mail.first_name} ${mail.last_name}`.toLowerCase();
    const emailAddress = mail.email.toLowerCase();
    const searchTerm = search.toLowerCase();
    return fullName.includes(searchTerm) || emailAddress.includes(searchTerm);
  });

  const grouped = groupByMonth(filteredEmails);

  return (
    <div
      className="bg-main_bg border-r border-gray-300  h-full overflow-y-auto transition-all duration-300 font-aldrich"
      style={{
        width: navExpanded ? "350px" : "400px", // shrinks from left when navbar expands
      }}
    >
      {/* Header */}
      <div className="bg-secondary text-white p-4 font-aldrich pb-10">
        <h1 className="text-3xl font-bold">{selected}</h1>
        <div className="relative mt-2">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200" />
          <input
            type="text"
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md pl-10 pr-3 py-2 text-black outline-none"
          />
        </div>
      </div>

      {/* List: grouped by month-year */}
      <div className=" space-y-4 overflow-y-auto h-[calc(100%-100px)]">
        {Object.entries(grouped).map(([month, mails]) => (
          <div key={month}>
            <h2 className="text-white font-semibold mb-2 bg-primary p-2">
              {month}
            </h2>
            <div className="space-y-2">
              {mails.map((mail) => {
                const d = new Date(mail.date_time);
                return (
                  <MailBlock
                    key={mail.id}
                    data={{
                      id: mail.id,
                      firstName: mail.first_name,
                      lastName: mail.last_name,
                      photo: mail.photo,
                      email: mail.email,
                      subject: mail.subject,
                      message: mail.message,
                      starred: mail.starred,
                      archived: mail.archived,
                      time: formatTime(d),
                      attachments: normalizeAttachments(mail.file_path),
                    }}
                    onClick={() => setActiveMail(mail)}
                    isActive={activeMail?.id === mail.id} // highlight if active
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- helper functions

function monthLabel(date) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeAttachments(filepath) {
  if (!filepath) return [];
  return Array.isArray(filepath) ? filepath : [filepath];
}

function groupByMonth(emails) {
  return emails.reduce((acc, mail) => {
    const d = new Date(mail.date_time);
    const label = monthLabel(d);
    if (!acc[label]) acc[label] = [];
    acc[label].push(mail);
    return acc;
  }, {});
}
