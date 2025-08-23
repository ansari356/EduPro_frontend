import React, { useState } from 'react';
import { Clock, Edit, Trash2, Eye } from 'lucide-react';
import getLessonList from '../../apis/hooks/educator/getLessonList';
import AddLessonPopup from './LessonPopup/AddLessonPopup';

export default function ModuleItem({ module, selectedModuleId, setSelectedModuleId, handleEditClick }) {
  const {
    isLoading: lessonLoading,
    error: lessonError,
    data: lessonData,
    mutate,
  } = getLessonList(module.id);
  const [isAddLessonPopupOpen, setIsAddLessonPopupOpen] = useState(false);

  const handleAddLessonClick = () => {
    setIsAddLessonPopupOpen(true);
  };

  const handleCloseAddLessonPopup = () => {
    setIsAddLessonPopupOpen(false);
  };

  const handleLessonAdded = () => {
    mutate(); // Re-fetch the lesson list
  };

  return (
    <div key={module.id} className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            className="flex-grow-1"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedModuleId(module.id)}
          >
            <h4 className={`about-subtitle mb-1 ${selectedModuleId === module.id ? 'text-primary' : ''}`}>
              {module.title}
            </h4>
            <div className="d-flex gap-3 mb-2">
              <small className="profile-joined">
                <i className="bi bi-list-ol me-1"></i>
                Order: {module.order}
              </small>
              <small className="profile-joined">
                <i className="bi bi-play-circle me-1"></i>
                {lessonData?.length||module.total_lessons} lessons
              </small>
              <small className="profile-joined">
                <Clock size={12} className="me-1" />
			{(() => {
                                const totalSeconds = lessonData?.reduce((total, lesson) => total + lesson.duration, 0);
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                return totalSeconds ? `${hours}h ${minutes}m` : '0h 0m';
                              })()}
              </small>
              <small className={`${module.is_free ? 'text-success' : 'text-primary'}`}>
                <i className={`bi ${module.is_free ? 'bi-unlock' : 'bi-lock'} me-1`}></i>
                {module.is_free ? 'Free' : `$${module.price}`}
              </small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn-edit-profile d-flex align-items-center"
              onClick={() => handleEditClick(module)}
            >
              <Edit size={14} className="me-1" />
              Edit
            </button>
            <button className="btn-edit-profile d-flex align-items-center" onClick={handleAddLessonClick}>
              <i className="bi bi-plus me-1"></i>
              Add Lesson
            </button>
          </div>
        </div>

        {/* Module Lessons: Show only when module is selected */}
        {selectedModuleId === module.id && (
          <div className="ms-3">
            {lessonLoading ? (
              <div className="text-center py-2">
                <small className="profile-joined">Loading lessons...</small>
              </div>
            ) : lessonError || !lessonData || !Array.isArray(lessonData) || lessonData.length === 0 ? (
              <div className="about-bubble mb-2 text-center">
                <span className="profile-joined">
                  <i className="bi bi-info-circle me-2"></i>
                  No lessons available for this module
                </span>
              </div>
            ) : (
              lessonData
                ?.sort((a, b) => a.order - b.order)
                ?.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="about-bubble mb-2 d-flex justify-content-between align-items-center"
                  >
                    <div className="flex-grow-1">
                      <span className="d-flex align-items-center">
                        <i className="bi bi-play-circle me-2"></i>
                        <span className="me-2">{lesson.title}</span>
                        <small className="profile-joined me-2">
                          ({Math.floor(lesson.duration / 60)}min)
                        </small>
                        <small className={`badge ${lesson.is_published ? 'bg-success' : 'bg-warning'}`}>
                          {lesson.is_published ? 'Published' : 'Draft'}
                        </small>
                      </span>
                      {lesson.description && (
                        <div className="mt-1">
                          <small className="profile-joined d-block">
                            {lesson.description}
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="d-flex gap-1">
                      <button
                        className="btn p-0 border-0"
                        style={{ backgroundColor: 'transparent' }}
                        title="Edit Lesson"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        className="btn p-0 border-0"
                        style={{ backgroundColor: 'transparent' }}
                        title="Preview Lesson"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        className="btn p-0 border-0 text-danger"
                        style={{ backgroundColor: 'transparent' }}
                        title="Delete Lesson"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Module Summary */}
        <div className="mt-3 pt-2 border-top">
          <div className="row text-center">
            <div className="col-md-3">
              <small className="profile-joined d-block">Lessons</small>
              <strong className="text-primary">{lessonData?.length||module.total_lessons}</strong>
            </div>
            <div className="col-md-3">
              <small className="profile-joined d-block">Duration</small>
              <strong className="text-primary">
				{(() => {
                                const totalSeconds = lessonData?.reduce((total, lesson) => total + lesson.duration, 0);
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                return totalSeconds ? `${hours}h ${minutes}m` : '0h 0m';
                              })()}
              </strong>
            </div>
            <div className="col-md-3">
              <small className="profile-joined d-block">Price</small>
              <strong className="text-primary">
                {module.is_free ? 'Free' : `$${module.price}`}
              </strong>
            </div>
            <div className="col-md-3">
              <small className="profile-joined d-block">Order</small>
              <strong className="text-primary">{module.order}</strong>
            </div>
          </div>
        </div>
      </div>
      {isAddLessonPopupOpen && (
        <AddLessonPopup
          module={module}
          onClose={handleCloseAddLessonPopup}
          onLessonAdded={handleLessonAdded}
        />
      )}
    </div>
  );
}
