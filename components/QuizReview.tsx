import React from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../types';

interface ReviewItem {
    question: Question;
    selectedOption: number;
    isCorrect: boolean;
}

interface QuizReviewProps {
    topic: string;
    date: string;
    scorePercentage: number;
    items: ReviewItem[];
    onBack: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({
    topic,
    date,
    scorePercentage,
    items,
    onBack,
}) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-indigo-600 font-bold mb-6 hover:text-indigo-800 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Profile
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Review: {topic}</h1>
                    <div className="flex gap-4 opacity-90">
                        <span>{date}</span>
                        <span>•</span>
                        <span>Score: {scorePercentage}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-start gap-3 mb-4">
                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full font-bold text-sm">
                                {index + 1}
                            </span>
                            <h3 className="text-lg font-bold text-gray-800 pt-1">{item.question.question}</h3>
                        </div>

                        <div className="grid gap-3 ml-11">
                            {item.question.options.map((option, optIndex) => {
                                const isSelected = optIndex === item.selectedOption;
                                const isCorrect = optIndex === item.question.correctIndex;

                                let optionClass = "p-4 rounded-xl border-2 transition-all ";

                                if (isCorrect) {
                                    optionClass += "bg-green-50 border-green-500 text-green-700";
                                } else if (isSelected && !isCorrect) {
                                    optionClass += "bg-red-50 border-red-500 text-red-700";
                                } else {
                                    optionClass += "border-gray-100 text-gray-600";
                                }

                                return (
                                    <div key={optIndex} className={optionClass}>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{option}</span>
                                            {isCorrect && <CheckCircle size={20} className="text-green-600" />}
                                            {isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 ml-11 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm">
                            <span className="font-bold block mb-1">Explanation:</span>
                            {item.question.explanation}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizReview;
