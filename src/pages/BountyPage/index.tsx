import { FormEvent, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useParams } from "react-router-dom";
import { IBounty, useAppContext } from "../../contexts/AppContext";
import { timestampToDateTimeStrings } from "../../helpers";

export const BountyPage = () => {
  const { activeBounties, finishedBounties } = useAppContext(); // Use the AppContext to access data
  const { bountyId } = useParams(); // Get the bountyId from the URL
  const [isLoading, setIsLoading] = useState(true);
  const [bountyData, setBountyData] = useState<IBounty>({} as IBounty);
  const [bountyStatus, setBountyStatus] = useState('');
  const [submissionGithubRepoUrl, setSubmissionGithubRepoUrl] = useState('');

  console.log(bountyStatus);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = {
      submissionGithubRepoUrl
    };
    console.log('Form Data:', formData);
  };

  useEffect(() => {
    if (!bountyId) return;
    // Check if the bountyId exists in activeBounties
    if (activeBounties[bountyId]) {
      setBountyData(activeBounties[bountyId]);
      setBountyStatus("Active");
      setIsLoading(false);
      return;
    }

    // Check if the bountyId exists in finishedBounties
    if (finishedBounties[bountyId]) {
      setBountyData(finishedBounties[bountyId]);
      setBountyStatus("Finished");
      setIsLoading(false);
      return;
    }
  }, [activeBounties, finishedBounties, bountyId]);

  return (
    <Layout>
      {isLoading ? (
        // Show a loader while loading
        <div className="flex justify-center items-center h-[80vh]">
          <span className="h-10 animate-bounce text-5xl font-bold">Loading...</span>
        </div>
      ) : (
        // Render the content once loading is complete
        <div className="pt-16">
          <div className="flex gap-10">
            <div 
              className="flex grow bg-colorSecondaryDark items-center gap-10 p-4 py-10 rounded-md font-medium text-md text-white" 
            >
              <div className="flex flex-col px-5 w-full text-left gap-4">
                <span className="text-5xl font-bold text-colorPrimaryLight">Bounty Details</span>
                <span className="text-2xl font-bold text-colorPrimaryLight pt-8"><span className="text-white font-medium">Name:</span> {bountyData.name}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Description:</span> {bountyData.description}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Rewards:</span> {bountyData.rewards}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Start Timeme:</span> {timestampToDateTimeStrings(bountyData.startTimestamp).date}, {timestampToDateTimeStrings(bountyData.startTimestamp).time}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">End Time</span> {timestampToDateTimeStrings(bountyData.endTimestamp).date}, {timestampToDateTimeStrings(bountyData.endTimestamp).time}</span>
                <span className="text-2xl font-bold text-colorPrimaryLight"><span className="text-white font-medium">Status:</span> {bountyStatus}</span>
              </div>
            </div>
            <div
              className="flex bg-colorSecondaryDark items-center gap-10 py-4 rounded-md font-medium text-md text-white min-w-[400px] h-[200px]"
            >
              {bountyStatus === "Active" 
                ?
                <form className="px-5 w-full" onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="githubRepoUrl" className="block mb-2 text-md font-semibold text-white text-left">
                        GitHub Repo URL
                    </label>
                    <input
                        type="text"
                        id="githubRepoUrl"
                        className="bg-colorSecondaryLight border-2 border-colorPrimaryLight text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                        placeholder="https://github.com/username/reponame"
                        value={submissionGithubRepoUrl}
                        onChange={(e) => setSubmissionGithubRepoUrl(e.target.value)}
                        required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-colorPrimaryLight text-colorSecondaryDark py-3 px-5 text-lg hover:bg-colorPrimaryLight hover:opacity-75 hover:text-colorSecondaryDark hover:cursor-pointer"
                  >
                    Submit
                  </button>
                </form>
                :
                <div className="flex flex-col px-5 w-full">
                  <span className="text-3xl font-bold text-colorPrimaryLight text-left">Submissions</span>
                  <span className="text-2xl font-medium py-5 text-center">Coming Soon...</span>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
