import {Message} from "../../shared/models/Message.js";
import {useQuery} from "@tanstack/react-query";
import Security from "../../shared/utils/Security.js";

export default function useTaskById(taskId) {
  async function fetchTasks({queryKey})
  {
    const [_key, {taskType}] = queryKey;
    const msgRequest = new Message(Message.Target.SERVICE_WORKER,
        Message.Sender.SIDE_PANEL,
        Message.Type.Task.Request.BY_ID,
        "Task by id request",
        taskId)
    await msgRequest.setSignature();
    const msgResponse = await chrome.runtime.sendMessage(msgRequest)

    Security.compare.messages(msgRequest, msgResponse);

    return msgResponse.data;
  }

  return useQuery({
    queryKey: ["get-task-by-id", {taskId}],
    queryFn: fetchTasks
  })
}