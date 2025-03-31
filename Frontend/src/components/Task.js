import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/taskReducer";
import {
  MdTaskAlt,
  MdOutlineSubtitles,
  MdPriorityHigh,
  MdOutlineDateRange,
} from "react-icons/md";
import { AiOutlinePlusCircle, AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function Task() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
    subTasks: [{ title: "", status: "" }],
    deadLine: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubTaskChange = (index, field, value) => {
    const newSubTasks = [...task.subTasks];
    newSubTasks[index][field] = value;
    setTask({ ...task, subTasks: newSubTasks });
  };

  const addSubTask = () => {
    setTask({ ...task, subTasks: [...task.subTasks, { title: "", status: "" }] });
  };

  const removeSubTask = (index) => {
    const newSubTasks = task.subTasks.filter((_, i) => i !== index);
    setTask({ ...task, subTasks: newSubTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Task Submitted: ", task);
    try {
      await dispatch(addTask(task)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.log("Error from the task.js", err);
    }
  };

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: "800px" }}>
      <form
        onSubmit={handleSubmit}
        className="shadow p-4 rounded bg-light"
      >
        <h4 className="text-center text-success mb-3">
          <MdTaskAlt className="me-1" /> Create Task
        </h4>

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
              <option value="">Select Priority</option>
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
                <option value="">Status</option>
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
          <button type="button" className="btn btn-primary" onClick={addSubTask}>
            <AiOutlinePlusCircle className="me-1" /> Add Subtask
          </button>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-success px-4">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
