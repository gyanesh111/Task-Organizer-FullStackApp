import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTask, removeTask } from "../redux/taskReducer";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal"; // Import the modal component
import {
  MdAddTask,
  MdEdit,
  MdDelete,
  MdRemoveRedEye,
  MdFlag,
  MdAccessTime,
  MdSearch
} from "react-icons/md";
import "./Viewtasks.css";

export default function ViewTasks() {
  const { tasks } = useSelector(selectTask);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddTask = () => {
    navigate("/task");
  };

  const handleEditTask = (id) => {
    navigate(`/task/${id}`);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task); // Store the task to be deleted
    setShowModal(true); // Open the modal
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      dispatch(removeTask(taskToDelete)); // Dispatch delete action
    }
    setShowModal(false); // Close the modal
    setTaskToDelete(null); // Clear the selected task
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setTaskToDelete(null); // Clear the selected task
  };

  const handleDetailedView = (task) => {
    navigate(`/task-details/${task.id}`);
  }

  const calculateProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completedSubtasks = subtasks.filter(
      (subtask) => subtask.status === "Completed"
    ).length;
    return (completedSubtasks / subtasks.length) * 100;
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="view-tasks-wrapper">
      {/* Add Task Button */}
      <div className="d-flex justify-content-between m-1 d">
        <button
          className="btn btn-success add-task-btn-top text-white fs-6 rounded-3"
          onClick={handleAddTask}
        >
          <MdAddTask />
          <span className="fs-6">Add Task</span>
        </button>
        <div className="search-container fs-6 d">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input fs-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="tasks-container d">
        {filteredTasks &&
          filteredTasks.map((task, index) => {
            const progress = calculateProgress(task.subTasks);

            return (
              <div key={index} className="task-card">
                <div className="title-wrapper">
                  <h4 className="task-title fs-5">{task.title}</h4>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="d-flex justify-content-between mb-3">
                  <div className="priority-box">
                    <MdFlag className="icon" />
                    {task.priority}
                  </div>
                  <div className="deadline-box">
                    <MdAccessTime className="icon" />
                    {task.deadLine}
                  </div>
                </div>
                <div className="circles-container">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="circle"></span>
                  ))}
                </div>
                <button className="btn btn-outline-dark w-100 mb-3"
                  onClick={() => handleDetailedView(task)}
                >
                  <MdRemoveRedEye />
                  <span className="ms-2">Detailed View</span>
                </button>

                {/* Progress Bar */}
                <div className="progress mb-3">
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

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditTask(task.id)}
                  >
                    <MdEdit />
                    <span className="ms-2">Edit</span>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(task)}
                  >
                    <MdDelete />
                    <span className="ms-2">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}

        {/* Add Task Card */}
        <div className="task-card add-task-card">
          <button
            className="btn text-success fs-5 rounded-3"
            onClick={handleAddTask}
          >
            <MdAddTask />
            <span className="ms-2">Add Task</span>
          </button>
        </div>
      </div>
      {showModal && <ConfirmationModal
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        heading="Delete Task"
        message={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
        suggestions="This action cannot be undone. Deleting a task will permanently remove it."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />}
    </div>
  );
}
