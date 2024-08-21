import { Badge, Button } from "react-bootstrap";
import { type TLog } from "./App";
import { assertUnreachable } from "../types/Log";
import { format } from "date-fns";

export function LogItem({
  log,
  deleteLog,
}: {
  log: TLog;
  deleteLog: (_id: number) => void;
}) {
  const setVariant = (): string => {
    switch (log.priority) {
      case "Low":
        return "success";
      case "Moderate":
        return "warning";
      case "High":
        return "danger";
      default:
        assertUnreachable(log.priority);
    }
  };

  return (
    <tr>
      <td>
        <Badge bg={setVariant()}>
          {log.priority.charAt(0).toUpperCase() + log.priority.slice(1)}
        </Badge>
      </td>
      <td>{log.text}</td>
      <td>{log.user}</td>
      <td>{format(new Date(log.created), "yyyy-MM-dd")}</td>
      <td>
        <Button variant="danger" size="sm" onClick={() => deleteLog(log._id)}>
          x
        </Button>
      </td>
    </tr>
  );
}
