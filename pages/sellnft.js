import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../components";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const SellNft = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [formData, setFormData] = useState({ price: "0.5", image: "" });

  const router = useRouter();

  const { tokenId, tokenURI } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    fetchNFT();
    setIsLoading(false);
  }, [router.isReady]);

  const fetchNFT = async () => {
    const { data } = await axios.get(tokenURI);
    setFormData((state) => ({
      ...state,
      image: data.image,
      price: 0.5,
    }));
  };

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

  const sellToken = async () => {
    try {
      if (!formData.price) {
        toast.error("Please Enter Your Price For Selling NFT!");
      }
      setBtnLoading(true);
      const contract = await getContract();
      let listingPrice = await contract.getListingPrice();
      const price = ethers.utils.parseUnits(formData.price.toString(), "ether");
      const txt = await contract.createMarketItem(tokenId, price, {
        value: listingPrice,
      });
      await txt.wait();

      setBtnLoading(false);

      setFormData({
        price: "",
        image: "",
      });

      toast.success("Add to market Successfully");

      await router.push("/profile");
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong! ${error}`);
    }
  };

  return (
    <div className="relative ">
      <Head>
        <title> Sell Token || Mumbai Punks </title>
        <link rel="shortcut icon" href="punks.png" />
      </Head>
      <Header />
      <div className="bg-[#1242ef] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full "></div>

      <div className="relative overflow-hidden">
        <section className="mx-w-[1024px] mx-auto my-10 flex flex-col items-center justify-center">
          <div className="w-[30%] md:w-[60%] sm:w-full sm:p-3 ssm:w-full ">
            <div className="w-full h-full  rounded-2xl">
              <img
                src={formData.image}
                alt="image"
                className="w-full h-[450px]  rounded-2xl"
              />
            </div>
            <div className="w-full h-full flex flex-col mt-3">
              <label className="text-2xl my-1 font-semibold ">Price</label>
              <input
                type="number"
                placeholder="Input your price as you want to sell"
                className="px-5 py-3 rounded-xl
               placeholder:text-slate-400 outline-none border-none  bg-[#272D37]/60 placeholder:font-body font-body"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <button
              className="bg-[#1E50FF] outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer  duration-250 ease-in-out hover:transform-x-1 hover:drop-shadow-xl hover:shadow-sky-600 w-full mt-8 transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none "
              onClick={sellToken}
              disabled={btnLoading}
            >
              {btnLoading ? "Selling NFT" : "Sell NFT"}
            </button>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default SellNft;
