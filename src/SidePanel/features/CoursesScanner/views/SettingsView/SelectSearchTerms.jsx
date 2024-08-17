import ButtonPrimary from "../../../../components/shared/buttons/ButtonPrimary.jsx";
import PrimaryCard from "../../../../components/shared/cards/PrimaryCard.jsx";
import SearchTermInput from "./SearchTermInput.jsx";

function SelectSearchTerms({searchTerms, setSearchTerms})
{
  function canAddTerm()
  {
    if(searchTerms[0].length < 2) return false;
    if(searchTerms.length > 9) return false;
    for(let i = 0; i < searchTerms.length; i++)
    {
      if(searchTerms[i].trim().length < 2) return false;
    }
    return true;
  }

  function updateSearchTerm(index, value)
  {
    setSearchTerms(searchTerms.map((term, i) =>
    {
      if(i === index) return value;
      return term;
    }))
  }

  function removeSearchTerm(index)
  {
    setSearchTerms(searchTerms.filter((term, i) => i !== index));
  }

  return (
    <PrimaryCard fixedWidth={true}>
      <div className="grid grid-cols-1 grid-flow-row start justify-start content-start gap-2">
        <h3 className="text-gray-700 text-xl text-center">Search Terms</h3>
        <div className={`flex flex-col gap-2 max-h-56 ${searchTerms.length > 5 ? "overflow-y-scroll" : ""}`}>
          {
            searchTerms.map((term, index) =>
            {
              return <SearchTermInput index={index}
                                      value={term}
                                      updateSearchTerm={updateSearchTerm}
                                      removeSearchTerm={removeSearchTerm}
                                      key={"search-term" + index}
                                      deleteDisabled={searchTerms.length < 2}/>
            })
          }
        </div>
      </div>
      <div className="self-end mt-2">
        <ButtonPrimary onClick={() => {if(canAddTerm()) setSearchTerms([...searchTerms, ""]);}}
                       disabled={!canAddTerm()}>
          <span>+</span>
        </ButtonPrimary>
      </div>
    </PrimaryCard>
  )
}

export default SelectSearchTerms