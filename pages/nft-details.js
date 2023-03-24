import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../components";
import { truncateEthAddress } from "../utils/truncAddress";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const NFTDetails = () => {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const [addr, setAddr] = useState("");

  const [nft, setNft] = useState({
    price: "",
    tokenId: "",
    seller: "",
    owner: "",
    image: "",
    description: "",
    tokenURI: "",
  });

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router?.query);

    setIsLoading(false);
  }, [router.isReady]);

  useEffect(() => {
    const addr = localStorage.getItem("walletAddress");
    setAddr(addr);
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

  const buyNft = async (n) => {
    try {
      const contract = await getContract();
      const price = ethers.utils.parseUnits(n.price.toString(), "ether");
      let tx = await contract.createMarketSale(n.tokenId, { value: price });
      await tx.wait();
      toast.success(`Bought NFT🎉`);
      await router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(`You Can't Buy This Look At the Price 😂 ${error}`);
    }
  };

  const sellNFT = async (nft) => {
    router.push(`sellnft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  };

  return (
    <div>
      <Head>
        <title>{nft.name} || Mumbai Punks</title>
        <link rel="shortcut icon" href="punks.png" />
      </Head>

      <Header />
      <div className="bg-[#1242ef] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full "></div>
      <div className="relative overflow-hidden">
        <section className="grid grid-cols-2 max-w-[1240px] mx-auto my-2 gap-4  sm:grid-cols-1 p-5">
          <div className="p-3 sm:p-0">
            <div className="w-full h-[508px] border border-solid border-sky-500   rounded-xl ">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full rounded-xl "
              />
            </div>
          </div>
          <div className="">
            <h1 className="main-color ">
              {nft.name}
            </h1>
            <p className="second-color">Description: <span className="main-color"> {nft.description}</span> </p>
            <div>
              <h2 className="second-color">Pirce: <span className="main-color">{nft.price} MATIC</span></h2>
            </div>
            <div>
              <h2 className="ssm:text-sm text-transparent font-bold second-color">Owner Address:
                <span className="main-color"> {truncateEthAddress(nft.owner)}</span>
              </h2>
            </div>

            {nft.seller.startsWith("0x0") ? null : (
              <div>
                <h2 className="ssm:text-sm text-transparent font-bold second-color">Seller:
                  <span className="main-color"> {truncateEthAddress(nft.seller)}</span>
                </h2>
              </div>
            )}

            <div>
              <h2 className="ssm:text-sm text-transparent font-bold second-color">Blockchain:
                <span className="main-color"> Poygon ⟠</span>
              </h2>
            </div>

            <button
              className="main-btn-bg outline-none border-none py-2 px-10 rounded-xl text-white text-lg main-family  cursor-pointer  "
              onClick={() => {
                addr === nft.owner.toLocaleLowerCase()
                  ? sellNFT(nft)
                  : buyNft(nft);
              }}
            >
              {addr === nft.owner.toLocaleLowerCase() ? "Sell NFT" : "Buy NFT"}
            </button>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default NFTDetails;
