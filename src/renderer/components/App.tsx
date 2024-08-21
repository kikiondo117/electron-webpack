import { useEffect, useState } from "react";
import { Alert, Container, Table } from "react-bootstrap";
import { LogItem } from "./LogItem";
import { AddLogItem } from "./AddLogItem";
import { ipcRenderer } from "electron";

export type TLog = {
  _id: number;
  text: string;
  priority: "Low" | "Moderate" | "High";
  user: string;
  created: string;
};

export type TLogWithoutId = Omit<TLog, "_id">;

export type TAlert = {
  show: boolean;
  message: string;
  variant: string;
};

export function App() {
  const [logs, setLogs] = useState<[] | TLog[]>([]);
  const [alert, setAlert] = useState<TAlert>({
    show: false,
    message: "",
    variant: "success",
  });

  const addItem = (item: TLogWithoutId) => {
    if (item.text === "" || item.user === "") {
      showAlert({ message: "Please enter all fields", variant: "danger" });
    }

    // setLogs((values) => [...values, item]);
    ipcRenderer.send("logs:add", item);
    showAlert({ message: "Item added" });
  };

  const showAlert = ({
    message,
    variant = "success",
    seconds = 3000,
  }: {
    message: string;
    variant?: string;
    seconds?: number;
  }) => {
    setAlert({
      show: true,
      message,
      variant,
    });

    setTimeout(() => {
      setAlert({
        show: false,
        message: "",
        variant,
      });
    }, seconds);
  };

  const deleteLog = (_id: number) => {
    // setLogs(() => {
    //   return logs.filter((item) => item._id !== _id);
    // });
    ipcRenderer.send("logs:delete", _id);
    showAlert({ message: "Log Removed" });
  };

  useEffect(() => {
    ipcRenderer.send("logs:load");

    ipcRenderer.on("logs:get", (event, logs: string) => {
      setLogs(JSON.parse(logs));
    });

    ipcRenderer.on("logs:clear", () => {
      setLogs([]);
      showAlert({ message: "Logs Cleared" });
    });
  }, []);

  return (
    <Container>
      <AddLogItem addItem={addItem} />
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log Text</th>
            <th>User</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            return (
              <LogItem deleteLog={deleteLog} log={log} key={log._id}></LogItem>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
