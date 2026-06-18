import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * QuestionCard Component
 * Displays the current question, its category badge, and list of options.
 * Handles the selection highlights and correct/incorrect answer states after submission.
 */
export default function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  isSubmitted
}) {
  const { question: questionText, options, answer, category } = question;

  // Helper to determine category color badge styling
  const getCategoryStyles = (cat) => {
    switch (cat) {
      case 'Web Development':
        return 'bg-blue-50 text-blue-600 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40';
      case 'Programming':
        return 'bg-violet-50 text-violet-600 border-violet-200/60 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800/40';
      case 'Science':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40';
      case 'History & Art':
        return 'bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40';
      case 'Geography':
        return 'bg-cyan-50 text-cyan-600 border-cyan-200/60 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800/40';
      case 'Computer Science':
        return 'bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/60 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800/40';
    }
  };

  return (
    <div className="w-full flex flex-col text-left">
      {/* Category Tag */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 shadow-sm ${getCategoryStyles(category)}`}>
          {category}
        </span>
      </div>

      {/* Question Text */}
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-relaxed mb-6 transition-colors">
        {questionText}
      </h2>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-4.5 w-full">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === answer;
          
          let btnClass = "";
          let icon = null;

          if (!isSubmitted) {
            // Interactive pre-submission state
            btnClass = isSelected
              ? "border-2 border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/30 dark:text-indigo-100 shadow-md shadow-indigo-100 dark:shadow-none scale-[1.01]"
              : "border border-slate-200 bg-white hover:bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm";
          } else {
            // Evaluated post-submission state
            if (isCorrect) {
              // Highlight the correct answer in green
              btnClass = "border-2 border-emerald-500 bg-emerald-50/60 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-100 shadow-sm shadow-emerald-50 dark:shadow-none font-medium";
              icon = <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
            } else if (isSelected) {
              // Highlight the incorrect selected option in red
              btnClass = "border-2 border-rose-500 bg-rose-50/60 text-rose-950 dark:border-rose-400 dark:bg-rose-950/30 dark:text-rose-100 shadow-sm shadow-rose-50 dark:shadow-none font-medium";
              icon = <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
            } else {
              // Dim down all other non-selected, non-correct answers
              btnClass = "border border-slate-200/50 bg-slate-50/30 text-slate-400 dark:border-slate-800/40 dark:bg-slate-900/10 dark:text-slate-600 cursor-not-allowed opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => onSelectOption(option)}
              className={`w-full text-left p-4.5 rounded-xl flex items-center justify-between transition-all duration-300 outline-none group cursor-pointer text-base md:text-lg ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-300 
                  ${!isSubmitted 
                    ? isSelected 
                      ? "bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-950" 
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700" 
                    : isCorrect 
                      ? "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950" 
                      : isSelected 
                        ? "bg-rose-500 text-white dark:bg-rose-400 dark:text-slate-950" 
                        : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium">{option}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
