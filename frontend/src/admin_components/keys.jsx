import { useEffect, useState } from "react";
import { getKeys } from "../crypto/crypto";
import axios from "axios";
import { FiCopy } from "react-icons/fi";

export default function Keys() {
  const [generator, setGenerator] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [N, setN] = useState("");

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/admin_view/get_generator/"
        );
        setGenerator(response.data.unique_string);
        const keys = getKeys(response.data.unique_string);
        setPublicKey(keys.publicKey);
        setPrivateKey(keys.privateKey);
        setN(keys.N);
      } catch (err) {
        console.error("Error fetching keys:", err);
      }
    };
    fetchKeys();
  }, []);

  const generate = () => {
    const keys = getKeys(generator);
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
    setN(keys.N);
  };

  const saveKeys = async () => {
    try {
      const formData = new FormData();
      formData.append("generator", generator);
      formData.append("publicKey", publicKey.toString());
      formData.append("privateKey", privateKey.toString());
      formData.append("N", N.toString());

      const response = await axios.post(
        "http://127.0.0.1:8000/admin_view/set_generator/",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      console.error("error in sending data", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">
          Key Generator
        </h1>

        {/* Generator Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Generator
          </label>
          <input
            type="text"
            value={generator}
            onChange={(e) => setGenerator(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={generate}
            className="flex-1 bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-lg transition"
          >
            Generate Keys
          </button>
          <button
            onClick={saveKeys}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-lg transition"
          >
            Save Keys
          </button>
        </div>

        {/* Keys Display */}
        <div className="space-y-4">
          {/* Public Key */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-primary">Public Key</p>
              <p className="text-gray-800 break-all text-sm">{publicKey}</p>
            </div>
            <button
              onClick={() => copyToClipboard(publicKey)}
              className="text-gray-500 hover:text-primary transition"
            >
              <FiCopy size={18} />
            </button>
          </div>

          {/* Private Key */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-primary">Private Key</p>
              <p className="text-gray-800 break-all text-sm">{privateKey}</p>
            </div>
            <button
              onClick={() => copyToClipboard(privateKey)}
              className="text-gray-500 hover:text-primary transition"
            >
              <FiCopy size={18} />
            </button>
          </div>

          {/* N */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-primary">N</p>
              <p className="text-gray-800 break-all text-sm">{N}</p>
            </div>
            <button
              onClick={() => copyToClipboard(N)}
              className="text-gray-500 hover:text-primary transition"
            >
              <FiCopy size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
