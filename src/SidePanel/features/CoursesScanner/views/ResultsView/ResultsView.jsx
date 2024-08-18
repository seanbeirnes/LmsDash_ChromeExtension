import PrimaryCardLayout from "../../../../components/shared/cards/PrimaryCardLayout.jsx";

function ResultsView({taskId, scanAgainCallback})
{

  return (
    <PrimaryCardLayout>
      <p>Results view...</p>
      <button onClick={scanAgainCallback}>Button</button>
    </PrimaryCardLayout>
  )
}

export default ResultsView;