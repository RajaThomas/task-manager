import "../styles/task.scss";
import { useState } from "react";

export default function Task(props) {
  const { addTask, deleteTask, moveTask, task } = props;

  const [urgencyLevel, setUrgencyLevel] = useState( task ? task.urgency : '');
  const [collapsed, setCollapsed] = useState(task ? task.isCollapsed : false);
  const [formAction, setFormAction] = useState("");
  const [deadline, setDeadline] = useState();
  const [imageBase64, setImageBase64] = useState();
  const [imageName, setImageName] = useState('');
  const [type, setType] = useState('text');

  function setUrgency(event) {
    setUrgencyLevel(event.target.attributes.urgency.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formAction === "save") {
      if (collapsed) {
        setCollapsed(false);
      } else {
        let newTask = {
          id: task.id,
          name: event.target.elements.name.value,
          description: event.target.elements.description.value,
          urgency: urgencyLevel,
          status: task.status,
          isCollapsed: true,
          deadline: deadline,
          imageBase64: imageBase64,
          fileName: imageName
        };

        addTask(newTask);
        setCollapsed(true);
      }
    }

    if (formAction === "delete") {
      deleteTask(task.id);
    }
  }

  function handleMoveLeft() {
    let newStatus = "";

    if (task.status === "In Progress") {
      newStatus = "ToDo";
    } else if (task.status === "Done") {
      newStatus = "In Progress";
    }

    if (newStatus !== "") {
      moveTask(task.id, newStatus);
    }
  }

  function handleMoveRight() {
    let newStatus = "";

    if (task.status === "ToDo") {
      newStatus = "In Progress";
    } else if (task.status === "In Progress") {
      newStatus = "Done";
    }

    if (newStatus !== "") {
      moveTask(task.id, newStatus);
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const covertToBase64 = (e) => {
    const file = e.target.files[0];

    getBase64(file).then(base64 => {
      task.imageBase64 = '';
      setImageBase64(base64);
      setImageName(file.name);
    });
  }

  const handleDateChange = (event) => {
    const { value } = event.target;
    setDeadline(value);
  };

  if(task){
    return (
      <div className={`task ${collapsed ? "collapsedTask" : ""}`}>
        <button onClick={handleMoveLeft} className="button moveTask">
          &#171;
        </button>
        <form onSubmit={handleSubmit} className={collapsed ? "collapsed" : ""}>
          <input
            type="text"
            className="name input"
            name="name"
            placeholder="Enter name"
            disabled={collapsed}
            defaultValue={task ? task.name : ''}
          />
          <textarea
            rows="2"
            className="description input"
            name="description"
            placeholder="Enter Description"
            defaultValue={task ? task.description : ''}
          />
          <input
            placeholder="Enter deadline"
            className="deadline input"
            defaultValue={task ? task.deadline : ''}
            onFocus={() => setType('date')} 
            onChange={(e) => handleDateChange(e)}
            type={type}
          />
          <input
            type="file"
            id="imageFile"
            name='imageBase64'
            //defaultValue={task.fileName ? task.fileName : imageBase64}
            className="taskImage input"
            onChange={(file) => covertToBase64(file)} />

            <img width="100%" className="imageDisplay" src={task && task.imageBase64 ? task.imageBase64 : imageBase64}/>
          <div className="urgencyLabels">
            <label className={`low ${urgencyLevel === "low" ? "selected" : ""}`}>
              <input
                urgency="low"
                onChange={setUrgency}
                type="radio"
                name="urgency"
              />
              low
            </label>
            <label
              className={`medium ${urgencyLevel === "medium" ? "selected" : ""}`}
            >
              <input
                urgency="medium"
                onChange={setUrgency}
                type="radio"
                name="urgency"
              />
              medium
            </label>
            <label
              className={`high ${urgencyLevel === "high" ? "selected" : ""}`}
            >
              <input
                urgency="high"
                onChange={setUrgency}
                type="radio"
                name="urgency"
              />
              high
            </label>
          </div>
          <button
            onClick={() => {
              setFormAction("save");
            }}
            className="button"
          >
            {collapsed ? "Edit" : "Save"}
          </button>
          {collapsed && (
            <button
              onClick={() => {
                setFormAction("delete");
              }}
              className="button delete"
            >
              X
            </button>
          )}
        </form>
        <button onClick={handleMoveRight} className="button moveTask">
          &#187;
        </button>
      </div>
    );
  }
 
}