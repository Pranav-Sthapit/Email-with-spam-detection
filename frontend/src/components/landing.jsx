import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen text-center text-white">
      
      <section className="flex flex-col items-center justify-center flex-grow bg-gradient-to-b from-primary via-secondary/60 to-white px-6 py-20">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xl">
            C
          </div>
          <h1 className="text-3xl font-bold text-white">Cleanix Mail</h1>
        </div>

        
        <p className="text-gray-200 max-w-md mb-8">
          Experience secure and seamless communication with encrypted emails, file sharing, 
          and intelligent spam detection — all in one inbox.
        </p>

     
        <button
          onClick={() => navigate("/sign")}
          className="bg-secondary hover:bg-blue-500 px-6 py-2 rounded-md text-lg font-medium transition-all text-white shadow-md"
        >
          Get Started
        </button>
      </section>

      
      <section className="bg-white text-[#0a192f] py-16 px-6">
        <h2 className="text-2xl font-bold mb-10">Why Choose Cleanix Mail?</h2>

        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-secondary">🔒 Secure Encryption</h3>
            <p className="text-gray-600">
              Your messages are protected with automatic encryption, ensuring privacy and peace of mind.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-secondary">📂 File Sharing</h3>
            <p className="text-gray-600">
              Share files instantly with no need for external storage links.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-2 text-secondary">🚫 Spam Detection</h3>
            <p className="text-gray-600">
              Built-in smart filtering keeps spam out of your inbox, so you can focus on what matters.
            </p>
          </div>
        </div>
      </section>

      
      <section className="bg-[#f8fafc] text-[#0a192f] py-16 px-6">
        <h2 className="text-2xl font-bold mb-6">Built for Productivity</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-8">
          Cleanix Mail is designed for simplicity and speed. Whether you're managing personal or professional
          communication, our intuitive interface keeps you efficient and organized.
        </p>
        <button
          onClick={() => navigate("/sign")}
          className="bg-secondary hover:bg-blue-600 text-white px-6 py-2 rounded-md text-lg font-medium transition-all shadow-md"
        >
          Create Your Account
        </button>
      </section>

      
      <footer className="bg-primary text-gray-400 py-6 text-sm">
        <p>© {new Date().getFullYear()} Cleanix Mail — Simple. Secure. Smart.</p>
      </footer>
    </div>
  );
}
