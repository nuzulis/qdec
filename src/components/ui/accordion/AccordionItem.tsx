import React from "react";

type AccordionItemProps = {
  title: string;
  content: any;
  isOpen: boolean;
  onClick: () => void;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="border rounded-xl overflow-hidden mb-1">
      <button
        onClick={onClick}
        className="w-full text-left px-4 py-3 bg-gray-500/25 hover:bg-gray-400 rounded-xl font-medium flex justify-between items-center"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`px-4 bg-gray-50 transition-all duration-300 overflow-hidden ${
          isOpen ? "py-3" : "max-h-0"
        }`}
      >
        {/* <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        /> */}
        {content}
      </div>
    </div>
  );
};

export default AccordionItem;
