import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface CourseProps {
  title: string;
  description?: string;
  feedback?: string;
}

const LessonDesc: React.FC<CourseProps> = ({ description = "", feedback = "" }) => {
  return (
    <div className="text-base text-gray-400 text-left pb-20">
      <div>
        <MarkdownRenderer content={description} />
      </div>
      {feedback && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Feedback</h3>
          <MarkdownRenderer content={feedback} />
        </div>
      )}
    </div>
  );
}

export default LessonDesc;