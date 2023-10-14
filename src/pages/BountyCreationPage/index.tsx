import React, { FormEvent, useState } from "react";
import { Layout } from "../../components/Layout";

export const BountyCreationPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minReputation, setMinReputation] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = {
      name,
      description,
      minReputation,
      tokenAddress,
      tokenAmount,
    };
    console.log('Form Data:', formData);
  };

  return (
    <Layout>
        <div className="flex flex-col py-10 gap-5 bg-colorSecondaryDark w-11/12 sm:w-9/12 md:w-7/12 rounded-lg my-10 mx-auto">
            <span className="text-6xl font-extrabold px-10 pb-5 text-center text-colorPrimaryLight">Create your Bounty</span>
            <form className="px-10" onSubmit={handleSubmit}>
                <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-md font-semibold text-white text-left">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                    placeholder="Random"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                </div>
                <div className="mb-6">
                <label htmlFor="desc" className="block mb-2 text-md font-semibold text-white text-left">
                    Description
                </label>
                <textarea
                    rows={4}
                    id="desc"
                    className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                    placeholder="Hello World"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                </div>
                <div className="mb-6">
                <label htmlFor="reputation" className="block mb-2 text-md font-semibold text-white text-left">
                    Min Reputation Required
                </label>
                <input
                    type="number"
                    id="reputation"
                    className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                    placeholder="100"
                    value={minReputation}
                    onChange={(e) => setMinReputation(e.target.value)}
                    required
                />
                </div>
                <div className="mb-6">
                <label htmlFor="contractAddress" className="block mb-2 text-md font-semibold text-white text-left">
                    Required Token Contract Address
                </label>
                <input
                    type="text"
                    id="contractAddress"
                    className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                    placeholder="0xabc..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    required
                />
                </div>
                <div className="mb-6">
                <label htmlFor="amount" className="block mb-2 text-md font-semibold text-white text-left">
                    Token Amount
                </label>
                <input
                    type="number"
                    id="amount"
                    className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                    placeholder="100"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    required
                />
                </div>
                <button
                        type="submit"
                        className="bg-colorPrimaryLight text-colorSecondaryDark py-3 px-5 text-lg border border-2 border-solid border-colorSecondaryDark hover:bg-colorPrimaryLight hover:opacity-75 hover:text-colorSecondaryDark hover:cursor-pointer"
                >
                Submit
                </button>
            </form>
        </div>
    </Layout>
  );
};
