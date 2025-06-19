import React from "react";
import EmojiPicker from "emoji-picker-react";

interface EmojiPickerDialogProps {
  open: boolean;
  onEmojiClick: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPickerDialog({
  open,
  onEmojiClick,
  onClose,
}: EmojiPickerDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <EmojiPicker
          onEmojiClick={(emojiData) => {
            onEmojiClick(emojiData.emoji);
            onClose();
          }}
          width={300}
          height={350}
        />
        <button className="mt-3 text-xs text-gray-500" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
