import PrimaryCardLayout from "../../../../components/shared/cards/PrimaryCardLayout.jsx";
import useTaskById from "../../../../hooks/useTaskById.js";
import ProgressSpinner from "../../../../components/shared/progress/ProgressSpinner.jsx";

function ResultsView({taskId, scanAgainCallback})
{
  const {isPending, isError, data, error} = useTaskById(taskId);

  if(isPending || !data)
  {
    return (
      <ProgressSpinner />
    )
  }

  return (
    <PrimaryCardLayout>
      <p>Results view...</p>
      <button onClick={scanAgainCallback}>Button</button>
      <p>{JSON.stringify(data)}</p>
    </PrimaryCardLayout>
  )
}

export default ResultsView;