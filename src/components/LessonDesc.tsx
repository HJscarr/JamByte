import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface CourseProps {
  title: string;
  description?: string;
}

const LessonDesc: React.FC<CourseProps> = ({ description = "" }) => {

  return (
    <div className="text-base text-gray-400 text-left pb-20">
      <div>
        <MarkdownRenderer content={description} />
      </div>
    </div>
  );
}

export default LessonDesc;