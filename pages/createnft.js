import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Footer, Header } from "../components";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const Create = () => {

  const [nftDetails, setNftDetails] = useState({
    amount:"1"
  });

  const [loading, setLoading] = useState(false);

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      ContractABI.abi,
      signer
    );
    return contract;
  };

  const mintNFTs = async () => {
    try {
      const { amount } = nftDetails;

      const contract = await getContract();

      let mintPrice = await contract.getMintPrice();
      let totalPrice = mintPrice * amount;
      totalPrice = totalPrice.toString();

      let transaction = await contract.createToken( amount , {
        value: totalPrice,
      });
      await transaction.wait();

      setLoading(false);

      toast.success("Minted Successfully");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", error);
      setLoading(false);
    }
  };

  return (
    <div className="font-body">
      <Head>
        <title>Create NFT || Mumbai Punks </title>
        <link rel="shortcut icon" href="punks.png" />
      </Head>

      <Header />

      <h1 className="text-center">Mumbai Punks Create NFT</h1>

      <div className="relative overflow-hidden">
        <section className="max-w-[1024px] my-20 mx-auto grid grid-cols-2  gap-10 font-body  overflow-hidden top-7 md:gap-10 medium md:px-5 sm:grid-cols-1 sm:h-full relative ">
          
          <div className="flex flex-col">
            <label className="text-2xl my-1 font-semibold">Amount</label>
            <input
              type="number"
              placeholder="Input amount as you want to mint MPNK"
              className="px-5 py-3 rounded-xl
              placeholder:text-slate-400 outline-none border-none  bg-[#272D37]/60 placeholder:font-body font-body"
              value={nftDetails.amount}
              onChange={(e) =>
                setNftDetails({ ...nftDetails, amount: e.target.value })
              }
            />
          </div>
          <button
            type="button"
            className="bg-[#1E50FF] outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer transition duration-250 ease-in-out  hover:drop-shadow-xl hover:shadow-sky-600 w-auto focus:scale-90"
            onClick={mintNFTs}
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Mint"}
          </button>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Create;
