import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Footer, Header, MyNFTContainer } from "../components";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { ethers } from "ethers";
import axios from "axios";
import cors from "cors";
import { truncateEthAddress } from "../utils/truncAddress";

const Profile = () => {
  const [nfts, setNts] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getNfts();
  }, []);

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

  const getNfts = async () => {
    try {
      const contract = await getContract();

      const data = await contract.fetchMyNFTs();

      const items = await Promise.all(
        data?.map(async (i) => {
          const tokenURI = await contract.tokenURI(i.tokenId);

          let meta;
          await fetch(tokenURI)
            .then((res) => res.json())
            .then((data) => {
              meta = data;
            });
          console.log(meta.name);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");

          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: "Mumbai " + meta.name.split(" ")[1] + " " + meta.name.split(" ")[2],
            description: meta.description,
            tokenURI,
          };
          return item;
        })
      );
      setNts(items);
      setLoading(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", error);
    }
  };

  if (!loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center ">
        <img src="/punks.png" alt="punks" className="h-[160px] animate-bounce" />
        <h2 className="text-5xl main-color font-semibold ">Loading...</h2>
      </div>
    );


  return (
    <div className="relative  ">
      <Head>
        <title> My Profile || Mumbai Punks </title>
        <link rel="shortcut icon" href="punks.png" />
      </Head>
      <Header />

      <div className="bg-[#1242ef] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full md:w-[300px]"></div>
      {!nfts.length ? (
        <div className="w-full h-50 flex flex-col items-center justify-center ">
          <h2 className="text-6xl main-color font-semibold">No NFTs in Marketplace</h2>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <h1 className="text-center text-6xl main-color">My NFTs</h1>
          <section className="max-w-[1200px] my-20 mx-auto grid grid-cols-3 md:grid-cols-2 gap-6 overflow-hidden top-7 md:gap-5 medium md:px-5 sm:grid-cols-1 sm:h-full relative justify-center items-center">
            {nfts?.map((nft, i) => (
              <MyNFTContainer key={nft.tokenId} nft={nft} />
            ))}
          </section>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Profile;
