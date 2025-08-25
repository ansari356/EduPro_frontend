import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function QuestionModal({
  show,
  onClose,
  onSubmit,
  questionForm,
  setQuestionForm,
  selectedQuestion,
  isLoading = false
}) {
  if (!show) return null;

  // Option management functions
  const handleAddOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [...prev.options, { option_text: "", is_correct: false }]
    }));
  };

  const handleRemoveOption = (index) => {
    if (questionForm.options.length > 2) {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOptionChange = (index, field, value) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const resetForm = () => {
    setQuestionForm({
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      order: 1,
      explanation: "",
      image: null,
      options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false }
      ]
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {selectedQuestion ? "Edit Question" : "Add New Question"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isLoading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Question Text *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question_text: e.target.value }))}
                  required
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Question Type</label>
                    <select
                      className="form-select"
                      value={questionForm.question_type}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, question_type: e.target.value }))}
                      disabled={isLoading}
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True/False</option>
                      <option value="short_answer">Short Answer</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Points</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={questionForm.points}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={questionForm.order}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Explanation (Optional)</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                  placeholder="Provide an explanation for the correct answer..."
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Question Image (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, image: e.target.files[0] || null }))}
                  disabled={isLoading}
                />
                <small className="text-muted">Upload an image to accompany the question (optional)</small>
              </div>
              
              {(questionForm.question_type === "multiple_choice" || questionForm.question_type === "true_false") && (
                <div className="mb-3">
                  <label className="form-label">Options</label>
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Option ${index + 1}`}
                        value={option.option_text}
                        onChange={(e) => handleOptionChange(index, "option_text", e.target.value)}
                        disabled={isLoading}
                      />
                      <div className="input-group-text">
                        <input
                          type="radio"
                          name="correct_option"
                          checked={option.is_correct}
                          onChange={() => {
                            setQuestionForm(prev => ({
                              ...prev,
                              options: prev.options.map((opt, i) => ({
                                ...opt,
                                is_correct: i === index
                              }))
                            }));
                          }}
                          disabled={isLoading}
                        />
                      </div>
                      {questionForm.options.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleRemoveOption(index)}
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleAddOption}
                    disabled={isLoading}
                  >
                    <Plus size={16} className="me-1" />
                    Add Option
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-edit-profile"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {selectedQuestion ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  selectedQuestion ? "Update Question" : "Add Question"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
