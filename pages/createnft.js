import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import mockartist from "../constants/mock-artist.json";
import { Footer, Header } from "../components";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const Create = () => {

  const [nftDetails, setNftDetails] = useState({
    amount: "1"
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
      setLoading(true);

      const { amount } = nftDetails;

      const contract = await getContract();

      let mintPrice = await contract.getMintPrice();
      let totalPrice = mintPrice * amount;
      totalPrice = totalPrice.toString();

      let transaction = await contract.createToken(amount, {
        value: totalPrice,
      });
      await transaction.wait();

      toast.success("Minted Successfully");

      setLoading(false);

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", error);
      setLoading(false);
    }
  };

  // if (!loading)
  //   return (
  //     <div className="w-full h-screen flex flex-col items-center justify-center ">
  //       <img src="/punks.png" alt="punks" className="h-[160px] animate-bounce" />
  //       <h2 className="text-6xl main-color font-semibold ">Loading...</h2>
  //     </div>
  //   );


  return (
    <div className="">
      <Head>
        <title>Create NFT || Mumbai Punks </title>
        <link rel="shortcut icon" href="punks.png" />
      </Head>

      <Header />
      <div className="bg-[#1242ef] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full md:w-[300px]"></div>
      <h1 className="text-center text-6xl main-color">Mumbai Punks Create NFT</h1>

      <div className="relative overflow-hidden">
        <section className="max-w-[1024px] mb-20 mx-auto overflow-hidden top-7 medium md:px-5 sm:grid-cols-1 sm:h-full relative ">
          <div className="flex items-center justify-between w-full sm:flex-col">
            <label className="text-2xl my-1 mr-2 main-color font-semibold">Amount</label>
            <input
              type="number"
              placeholder="Input amount as you want to mint MPNK"
              className="px-5 py-3 mr-3 sm:my-4 sm:mr-0 rounded-xl w-full main-color text-lg main-family
              placeholder:text-slate-400 outline-none border-none  main-card-bg placeholder: "
              value={nftDetails.amount}
              onChange={(e) =>
                setNftDetails({ ...nftDetails, amount: e.target.value })
              }
            />
            <button
              type="button"
              className="main-btn-bg text-white text-lg main-family outline-none border-none py-3 px-5 rounded-xl w-[300px] cursor-pointer sm:w-full"
              onClick={mintNFTs}
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Mint"}
            </button>
          </div>
        </section>
        <section className="max-w-[1240px] my-20 mx-auto  gap-2  top-7 ">
          <h2 className="main-color text-4xl text-center sm:text-center md:mx-10">Featured Artist </h2>
          <div className="grid grid-cols-4 gap-6 sm:gap-y-8 md:grid-cols-2 sm:grid-cols-1 sm:p-0 md:mx-10">
            {mockartist.map((data) => (
              <div
                key={data.id}
                className="w-full main-card-bg flex flex-col justify-center items-center p-3 rounded-xl"
              >
                <div className="w-full relative">
                  <img
                    src={data.bgImage}
                    alt={data.name}
                    layout="responsive"
                    className="w-full rounded-2xl h-[225px]"
                  />
                  <img
                    src={data.image}
                    alt={data.name}
                    layout="intrinsic"
                    className="absolute -bottom-[40px] left-0 right-0 mx-auto h-[104px] w-[104px] bg-[#272D37] rounded-full"
                  />
                </div>
                <div className="w-full text-center mt-8 font-bold">
                  <h3 className="second-color">{data.name}</h3>
                  <p className="main-color text-2xl mb-0">{data.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default Create;
