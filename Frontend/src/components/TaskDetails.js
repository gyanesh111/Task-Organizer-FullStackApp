import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdFlag, MdAccessTime, MdChecklist, MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectTask } from "../redux/taskReducer";
import './TaskDetails.css';

export default function TaskDetails() {
  const { id } = useParams();
  const { tasks } = useSelector(selectTask);
  const task = tasks.find((t) => t.id === id);
  const navigate = useNavigate();

  if (!task) {
    return (
      <div className="task-details-wrapper container mt-4">
        <h4 className="text-center">No Task Selected</h4>
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate(-1)}
        >
          <MdArrowBack /> Back to Tasks
        </button>
      </div>
    );
  }

  const calculateProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completedSubtasks = subtasks.filter(
      (subtask) => subtask.status === "Completed"
    ).length;
    return (completedSubtasks / subtasks.length) * 100;
  };

  const progress = calculateProgress(task.subTasks);

  return (
    <div className="task-details-wrapper container mt-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        <MdArrowBack /> Back to Tasks
      </button>
      <div className="task-details-card p-4 shadow-lg rounded bg-light">
        <h2 className="task-title">{task.title}</h2>
        <p className="task-description text-muted">{task.description}</p>

        <div className="task-meta d-flex flex-wrap justify-content-between mb-3">
          <div className="priority-box d-flex align-items-center mb-2 mb-sm-0 m-3 bg-secondary col-12 col-md-5">
            <MdFlag className="icon text-danger me-2 text-light" />
            <span className="text-uppercase text-light">Priority: {task.priority}</span>
          </div>
          <div className="deadline-box d-flex align-items-center mb-2 mb-sm-0 m-3 bg-success col-12 col-md-5">
            <MdAccessTime className="icon text-warning me-2 text-light" />
            <span className="text-uppercase text-light">Deadline: {task.deadLine}</span>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="subtasks-section mb-4">
          <h5 className="subtasks-title d-flex align-items-center">
            <MdChecklist className="icon me-2" /> Subtasks
          </h5>

          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped table-hover">
              <thead>
                <tr>
                  <th className="subtask-name">Subtask Name</th>
                  <th className="status">Status</th>
                </tr>
              </thead>
              <tbody>
                {task.subTasks && task.subTasks.length > 0 ? (
                  task.subTasks.map((subtask, index) => (
                    <tr key={index} className={'bg-light'}>
                      <td>{index + 1}. {subtask.title}</td>
                      <td>
                        <span
                          className={` ${subtask.status === "Completed" ? "text-success" : "text-danger"}`}
                        >
                          {subtask.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No Subtasks Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <h5>Progress</h5>
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
