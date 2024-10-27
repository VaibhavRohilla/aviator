"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChangeAvatarPopupProps {
  onClose: () => void;
  onAvatarSelect: (avatarUrl: string) => void;
  selectedAvatarUrl: string | null;
}

const avatars = [
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
  "./logo.png",
];

const ChangeAvatarPopup: React.FC<ChangeAvatarPopupProps> = ({
  onClose,
  onAvatarSelect,
  selectedAvatarUrl,
}) => {
  const handleAvatarClick = (avatarUrl: string) => {
    onAvatarSelect(avatarUrl);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] w-full bg-[#2c2d30] border-gray-700 rounded-lg p-0">
        <div className="bg-[#0f0f11] border-b border-gray-700 flex justify-between items-center p-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
            Choose Game Avatar
          </DialogTitle>
          <DialogClose className="text-white hover:text-gray-400 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </DialogClose>
        </div>

        {selectedAvatarUrl && (
          <div className="flex justify-center my-4">
            <img
              src={selectedAvatarUrl}
              alt="Selected Avatar"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-600"
            />
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4 bg-[#1b1c1d] overflow-y-auto max-h-[50vh] ">
          {avatars.map((avatarUrl, index) => (
            <div
              key={index}
              onClick={() => handleAvatarClick(avatarUrl)}
              className="flex justify-center transition-transform transform hover:scale-110 cursor-pointer"
            >
              <img
                src={avatarUrl}
                alt={`Avatar ${index + 1}`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-600 hover:border-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4 pb-4">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 text-sm sm:text-base text-white bg-red-600 rounded hover:bg-red-500 transition"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAvatarPopup;
