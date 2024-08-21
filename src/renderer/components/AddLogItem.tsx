import { FormEvent, useState } from "react";
import { z } from "zod";

import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { type TLog } from "./App";

const logSchema = z.object({
  text: z.string().min(1, { message: "Text is required" }),
  user: z.string().min(1, { message: "User is required" }),
  priority: z.enum(["Low", "Moderate", "High"]),
});

// type TLogSchema = z.infer<typeof logSchema>;

export type TLogWithoutId = Omit<TLog, "_id">;

export function AddLogItem({
  addItem,
}: {
  addItem: (log: TLogWithoutId) => void;
}) {
  const [text, setText] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [priority, setPriority] = useState<
    "Low" | "Moderate" | "High" | string
  >("Low");

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    const result = logSchema.safeParse({ text, user, priority });

    if (!result.success) {
      console.log("Hey no", result.error.format());
      return;
    }

    const validatedData = result.data;

    let log = {
      text: validatedData.text,
      user: validatedData.user,
      priority: validatedData.priority,
      created: new Date().toString(),
    };

    addItem(log);
  };

  return (
    <Card className="mt-5 mb-3">
      <Card.Body>
        <Form onSubmit={handleOnSubmit}>
          <Row className="my-3">
            <Col>
              <Form.Control
                placeholder="Log"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                placeholder="User"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="0">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </Form.Control>
            </Col>
          </Row>
          <Row className="my-3">
            <Col>
              <Button type="submit" variant="secondary">
                Add Log
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}
