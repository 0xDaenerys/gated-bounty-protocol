import { FormEvent, useState } from 'react'
import { Layout } from '../../components/Layout'
import {
  Condition,
  ConditionType,
  PushAPI,
  SignerType,
} from '@pushprotocol/restapi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants'
import { useWalletClient } from 'wagmi'
import { writeContract } from '@wagmi/core'
import { CONTRACTS } from '../../config'
import { BountyFactoryAbi } from '../../abi'
import { parseGwei } from 'viem'
import { useNavigate } from 'react-router-dom'

type ChainId = 5 | 80001 | 534351 | 5001

export const BountyCreationPage = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [minReputation, setMinReputation] = useState('')
  const [hackerKycChecked, setHackerKycChecked] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [rewards, setRewards] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: walletClient } = useWalletClient()
  const navigate = useNavigate()

  /**
   * Note:- Simple Grps are used for `Scroll` and `Mantle` since Push does not support Gating on these networks (yet)
   * @param user PushAPI instance
   */
  const createPushGroup = async (user: PushAPI) => {
    const groupImage =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg=='

    const createdGrp = await user.chat.group.create(`GBP Bounty <> ${name}`, {
      description: description,
      image: groupImage,
      members: [],
      admins: [],
      private: false,
    })
    return createdGrp.chatId
  }

  const createPushTokenGatedGroup = async (
    user: PushAPI,
    chainId: number,
    reputationContractAddress: string,
    kyhContractAddress: string
  ) => {
    const groupImage =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg=='

    const allConditions: Condition[] = []
    if (+minReputation > 0) {
      allConditions.push({
        type: ConditionType.PUSH, // define type that rules engine should go for
        category: 'ERC20', // define it's ERC20 token that you want to check, supports ERC721 as well
        subcategory: 'holder', // define if you are checking 'holder' or 'owner'
        data: {
          contract: `eip155:${chainId}:${reputationContractAddress}`,
          comparison: '>=', // what comparison needs to pass
          amount: +minReputation, // amount that needs to passed
          decimals: 18, // the decimals for the token
        },
      })
    }
    if (hackerKycChecked) {
      allConditions.push({
        type: ConditionType.PUSH, // define type that rules engine should go for
        category: 'ERC721', // define it's ERC20 token that you want to check, supports ERC721 as well
        subcategory: 'holder', // define if you are checking 'holder' or 'owner'
        data: {
          contract: `eip155:${chainId}:${kyhContractAddress}`,
          comparison: '>=', // what comparison needs to pass
          amount: 1, // amount that needs to passed
          decimals: 18, // the decimals for the token
        },
      })
    }

    const createdGrp = await user.chat.group.create(`GBP Bounty <> ${name}`, {
      description: description,
      image: groupImage,
      members: [],
      admins: [],
      private: false,
      rules:
        allConditions.length > 0
          ? {
              entry: {
                conditions: {
                  all: allConditions,
                },
              },
              chat: { conditions: [] },
            }
          : null,
    })
    return createdGrp.chatId
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!walletClient) {
      alert('Please connect your wallet first')
      return
    }

    try {
      setLoading(true)
      const chainId: ChainId = (await walletClient.getChainId()) as ChainId
      const bountyFactoryContractAddress = CONTRACTS[chainId].bountyFactory
      const reputationContractAddress = CONTRACTS[chainId].erc20Reputation
      const kyhContractAddress = CONTRACTS[chainId].erc721KYH
      let chatId: string

      // Create Bounty Group
      const user = await PushAPI.initialize(walletClient as SignerType, {
        env: ENV.PROD,
      })

      if (chainId !== 5 && chainId !== 80001) {
        chatId = await createPushGroup(user)
      } else {
        chatId = await createPushTokenGatedGroup(
          user,
          chainId,
          reputationContractAddress,
          kyhContractAddress
        )
      }

      // Create a new Bounty
      // Upload Data to IPFS
      const metaData = JSON.stringify({
        name,
        description,
      })

      const startDate = new Date(startTime)
      const endDate = new Date(endTime)
      // Get the epoch timestamp in milliseconds
      const startTimeStamp = startDate.getTime()
      const endTimeStamp = endDate.getTime()

      await writeContract({
        address: bountyFactoryContractAddress,
        abi: BountyFactoryAbi,
        functionName: 'createBounty',
        args: [
          +minReputation,
          hackerKycChecked,
          metaData,
          startTimeStamp,
          endTimeStamp,
          chatId,
        ],
        value: parseGwei(rewards),
      })

      setTimeout(() => {
        navigate('/bounties')
      }, 5000)
    } catch (err) {
      setLoading(false)
      alert(err)
    }
  }

  return (
    <Layout>
      <div className="flex drop-shadow-2xl flex-col py-10 gap-5 bg-colorSecondaryDark w-11/12 sm:w-9/12 md:w-7/12 rounded-lg my-10 mx-auto">
        <span className="text-6xl font-extrabold px-10 pb-5 text-center text-colorPrimaryLight">
          Create your Bounty
        </span>
        <form className="px-10" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-md font-semibold text-white text-left"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
              placeholder="Bounty Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="desc"
              className="block mb-2 text-md font-semibold text-white text-left"
            >
              Description
            </label>
            <textarea
              rows={4}
              id="desc"
              className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
              placeholder="Bounty Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="reputation"
              className="block mb-2 text-md font-semibold text-white text-left"
            >
              Min Reputation Required
            </label>
            <label className="block mb-2 font-light text-white text-left">
              Note :- Creator Reputation must be greater than or equal to this
              value
            </label>
            <input
              type="number"
              id="reputation"
              className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
              placeholder="100"
              value={minReputation}
              onChange={(e) => {
                const inputValue = e.target.value
                if (+inputValue >= 0) {
                  setMinReputation(inputValue)
                } else {
                  // Optionally, you can handle invalid input here, for example, displaying an error message.
                  // You can also reset the value to the previous valid value.
                  // In this example, I'm just setting it to zero for simplicity.
                  setMinReputation('0')
                }
              }}
              required
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <label className="text-md font-semibold text-white mr-2">
                Allow Hackers with Verified KYC Only
              </label>
              <input
                type="checkbox"
                id="hackerKycCheckbox"
                checked={hackerKycChecked}
                onChange={() => setHackerKycChecked(!hackerKycChecked)}
                className="w-5 h-5"
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginRight: '4px',
                  marginLeft: '8px', // Add a left margin of 8px
                }}
              />
            </div>
            <label className="block mb-2 font-light text-white text-left">
              Note :- Creator must have verified KYC to set this value
            </label>
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <label
                className="text-md font-semibold text-white text-left"
                style={{ width: '120px' }}
              >
                Start Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-colorPrimaryDark rounded-lg p-2 text-colorPrimaryLight"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center text-left">
              <label
                className="text-md font-semibold text-white"
                style={{ width: '120px' }}
              >
                End Time
              </label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-colorPrimaryDark rounded-lg p-2 text-colorPrimaryLight"
                required
              />
            </div>
            <div className="mb-6 mt-5">
              <label
                htmlFor="reward"
                className="block mb-2 text-md font-semibold text-white text-left"
              >
                Bounty Reward ( in GWei )
              </label>
              <input
                type="string"
                id="reward"
                className="bg-colorSecondaryLight border border-colorPrimaryDark text-colorPrimaryLight text-md font-semibold rounded-lg focus:border-colorPrimaryLight focus:outline-colorPrimaryLight block w-full p-2.5 placeholder-gray-400"
                placeholder=""
                value={rewards}
                onChange={(e) => {
                  const inputValue = e.target.value
                  if (+inputValue >= 0) {
                    setRewards(inputValue)
                  } else {
                    // Optionally, you can handle invalid input here, for example, displaying an error message.
                    // You can also reset the value to the previous valid value.
                    // In this example, I'm just setting it to zero for simplicity.
                    setRewards('0')
                  }
                }}
                required
              />
            </div>
          </div>

          {!loading && (
            <button
              type="submit"
              className="bg-colorPrimaryLight text-colorSecondaryDark py-3 px-5 text-lg border border-2 border-solid border-colorSecondaryDark hover:bg-colorPrimaryLight hover:opacity-75 hover:text-colorSecondaryDark hover:cursor-pointer"
            >
              Submit
            </button>
          )}

          {loading && (
            <div className="flex items-center justify-center ">
              <div className="w-12 h-12 border-b-4 border-white-900 rounded-full animate-spin"></div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  )
}
