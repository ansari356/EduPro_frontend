import React, { useState } from 'react';
import { Clock, Edit, Trash2 } from 'lucide-react';
import getLessonList from '../../apis/hooks/educator/getLessonList';
import AddLessonPopup from './LessonPopup/AddLessonPopup';
import deleteLesson from '../../apis/actions/educator/deleteLesson';

export default function ModuleItem({ module, selectedModuleId, setSelectedModuleId, handleEditClick }) {
  const {
    isLoading: lessonLoading,
    error: lessonError,
    data: lessonData,
    mutate,
  } = getLessonList(module.id);
  const [isAddLessonPopupOpen, setIsAddLessonPopupOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const handleAddLessonClick = () => {
    setEditingLesson(null);
    setIsAddLessonPopupOpen(true);
  };

  const handleEditLessonClick = (lesson) => {
    setEditingLesson(lesson);
    setIsAddLessonPopupOpen(true);
  };

  const handleCloseAddLessonPopup = () => {
    setIsAddLessonPopupOpen(false);
  };

  const handleLessonAdded = () => {
    mutate(); // Re-fetch the lesson list
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (window.confirm(`Are you sure you want to delete the lesson "${lessonTitle}"? This action cannot be undone.`)) {
      try {
        await deleteLesson(lessonId);
        mutate(); // Re-fetch the lesson list
        alert('Lesson deleted successfully!');
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Failed to delete lesson. Please try again.');
      }
    }
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
                <i className="bi bi-list-ol me-1" style={{ fontSize: '12px' }}></i>
                Order: {module.order}
              </small>
              <small className="profile-joined">
                <i className="bi bi-play-circle me-1" style={{ fontSize: '12px' }}></i>
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
                <i className={`bi ${module.is_free ? 'bi-unlock' : 'bi-lock'} me-1`} style={{ fontSize: '12px' }}></i>
                {module.is_free ? 'Free' : `$${module.price}`}
              </small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn-edit-profile d-flex align-items-center"
              onClick={() => handleEditClick(module)}
            >
              <Edit size={16} className="me-1" />
              Edit
            </button>
            <button className="btn-edit-profile d-flex align-items-center" onClick={handleAddLessonClick}>
              <i className="bi bi-plus me-1" style={{ fontSize: '16px' }}></i>
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
                    className="mb-2 d-flex justify-content-between align-items-start"
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center flex-wrap mb-2">
                        <i className="bi bi-play-circle me-2" style={{ fontSize: '14px' }}></i>
                        <span className="me-2 fw-semibold">{lesson.title}</span>
                        <small className="profile-joined me-2">
                          ({Math.floor(lesson.duration / 60)}min {lesson.duration % 60}sec)
                        </small>
                        <small className="me-2 fw-bold" style={{ color: lesson.is_published ? 'var(--color-success)' : 'var(--color-warning)' }}>
                          {lesson.is_published ? 'Published' : 'Draft'}
                        </small>
                        {lesson.is_free && (
                          <small className="me-2 fw-bold" style={{ color: 'var(--color-primary-light)' }}>Free</small>
                        )}
                      </div>
                      
                      {/* Lesson metadata */}
                      <div className="d-flex flex-wrap gap-3 mb-2">
                        <small className="profile-joined">
                          <i className="bi bi-list-ol me-1" style={{ fontSize: '10px' }}></i>
                          Order: {lesson.order}
                        </small>
                        <small className="profile-joined">
                          <i className="bi bi-calendar me-1" style={{ fontSize: '10px' }}></i>
                          Created: {new Date(lesson.created_at).toLocaleDateString()}
                        </small>
                        {lesson.document_url && (
                          <small className="profile-joined fw-bold" style={{ color: 'var(--color-primary-light)' }}>
                            <i className="bi bi-file-earmark-text me-1" style={{ fontSize: '10px' }}></i>
                            Has Document
                          </small>
                        )}
                        {lesson.thumbnail_url && (
                          <small className="profile-joined fw-bold" style={{ color: 'var(--color-secondary)' }}>
                            <i className="bi bi-image me-1" style={{ fontSize: '10px' }}></i>
                            Has Thumbnail
                          </small>
                        )}
                        {lesson.otp && (
                          <small className="profile-joined fw-bold" style={{ color: 'var(--color-warning)' }}>
                            <i className="bi bi-shield-lock me-1" style={{ fontSize: '10px' }}></i>
                            OTP Protected
                          </small>
                        )}
                        {lesson.playback_info && (
                          <small className="profile-joined fw-bold" style={{ color: 'var(--color-success)' }}>
                            <i className="bi bi-play-btn me-1" style={{ fontSize: '10px' }}></i>
                            Video Ready
                          </small>
                        )}
                      </div>

                      {lesson.description && (
                        <div className="mt-2">
                          <small className="profile-joined d-block text-muted">
                            <i className="bi bi-info-circle me-1" style={{ fontSize: '10px' }}></i>
                            {lesson.description}
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="d-flex gap-1 ms-2">
                      <button
                        className="btn p-1 border-0"
                        style={{ backgroundColor: 'transparent' }}
                        title="Edit Lesson"
                        onClick={() => handleEditLessonClick(lesson)}
                      >
                        <Edit size={14} style={{ color: 'var(--color-primary-light)' }} />
                      </button>
                      <button
                        className="btn p-1 border-0 text-danger"
                        style={{ backgroundColor: 'transparent' }}
                        title="Delete Lesson"
                        onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                      >
                        <Trash2 size={14} style={{ color: 'var(--color-error)' }} />
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
          lessonsCount={lessonData?.length || 0}
          lesson={editingLesson}
        />
      )}
    </div>
  );
}
