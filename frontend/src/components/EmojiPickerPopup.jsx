import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      {/* Trigger Button */}
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition"
        >
          {icon ? (
            <img src={icon} alt="Icon" className="w-6 h-6 rounded" />
          ) : (
            <LuImage className="w-5 h-5" />
          )}
          <span>{icon ? "Change Icon" : "Pick Icon"}</span>
        </button>
      </div>

      {/* Emoji Picker Modal */}
      {isOpen && (
        <div className="relative mt-2 bg-white border border-gray-200 p-4 rounded shadow-md w-fit">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <LuX className="w-5 h-5" />
          </button>

          <EmojiPicker
            open={isOpen}
            onEmojiClick={(emoji) => {
              onSelect(emoji?.imageUrl || "");
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
