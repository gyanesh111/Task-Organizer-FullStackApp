import NoTasks from "../components/NoTasks"
import { useDispatch, useSelector } from "react-redux";
import ViewTasks from "../components/ViewTasks";
import { fetchAllTask, selectTask } from "../redux/taskReducer";
import { useEffect } from "react";

export default function Dashboard() {
  const { tasks } = useSelector(selectTask);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllTask());
  }, [dispatch])
  return (
    <div>
      {tasks.length > 0 ? <ViewTasks /> : <NoTasks />}
    </div>
  );
}
