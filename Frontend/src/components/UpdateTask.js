import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTask, updateTask } from "../redux/taskReducer";
import {
  MdOutlineSubtitles,
  MdPriorityHigh,
  MdOutlineDateRange,
} from "react-icons/md";
import { AiOutlinePlusCircle, AiFillCloseCircle } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTask() {
  const { id } = useParams();
  const { tasks } = useSelector(selectTask);
  const taskToEdit = tasks.find((task) => task.id === id);
  const [task, setTask] = useState(taskToEdit || null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskToEdit) {
      navigate("/dashboard");
    }
  }, [taskToEdit, navigate]);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubTaskChange = (index, field, value) => {
    const newSubTasks = task.subTasks.map((subTask, i) => {
      if (i === index) {
        return { ...subTask, [field]: value }; // Create a new object for the updated subtask
      }
      return subTask; // Leave other subtasks unchanged
    });
    setTask({ ...task, subTasks: newSubTasks });
  };


  const addSubTask = () => {
    setTask({
      ...task,
      subTasks: [...task.subTasks, { title: "", status: "Pending" }],
    });
  };

  const removeSubTask = (index) => {
    const newSubTasks = task.subTasks.filter((_, i) => i !== index);
    setTask({ ...task, subTasks: newSubTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTask(task)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (!task) {
    return null;
  }

  return (
    <div
      className="container mt-1 pt-4 update-task"
      style={{ maxWidth: "800px" }}
    >
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <h4 className="text-center text-success mb-3">
          <FiEdit3 className="me-1" /> Edit Task
        </h4>

        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="fs-5 d-flex align-items-center">
            <MdOutlineSubtitles className="me-1" /> Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            className="form-control"
            placeholder="Enter title"
            value={task.title}
            onChange={handleTaskChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="fs-5 d-flex align-items-center">
            <MdOutlineSubtitles className="me-1" /> Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Enter description"
            value={task.description}
            onChange={handleTaskChange}
            rows="3"
            required
          ></textarea>
        </div>

        {/* Priority and Deadline */}
        <div className="row mb-3">
          <div className="col-6">
            <label htmlFor="priority" className="fs-5 d-flex align-items-center">
              <MdPriorityHigh className="me-1" /> Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={task.priority}
              onChange={handleTaskChange}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="col-6">
            <label htmlFor="deadline" className="fs-5 d-flex align-items-center">
              <MdOutlineDateRange className="me-1" /> Deadline
            </label>
            <input
              id="deadline"
              type="date"
              name="deadLine"
              className="form-control"
              value={task.deadLine}
              onChange={handleTaskChange}
              required
            />
          </div>
        </div>

        {/* Subtasks */}
        <div className="mb-3">
          <h5 className="text-success mb-2">
            <AiOutlinePlusCircle className="me-1" /> Subtasks
          </h5>
          {task.subTasks.map((subTask, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Title"
                value={subTask.title}
                onChange={(e) =>
                  handleSubTaskChange(index, "title", e.target.value)
                }
                required
              />
              <select
                className="form-select me-2"
                value={subTask.status}
                onChange={(e) =>
                  handleSubTaskChange(index, "status", e.target.value)
                }
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeSubTask(index)}
              >
                <AiFillCloseCircle />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={addSubTask}
          >
            <AiOutlinePlusCircle className="me-1" /> Add Subtask
          </button>
        </div>

        {/* Buttons */}
        <div className="text-center">
          <button type="submit" className="btn btn-success px-4 m-4">
            Update
          </button>
          <button
            type="button"
            className="btn btn-danger px-4"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
