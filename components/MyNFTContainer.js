import { useRouter } from "next/router";
import React from "react";
import { truncateEthAddress } from "../utils/truncAddress";

const MyNFTContainer = ({ nft }) => {
  const router = useRouter();

  return (
    <div key={nft.tokenId} className="w-full h-[536px] sm:h-full ssm:h-max">
      <div
        className="w-full h-full ssm:h-max main-card-bg rounded-2xl flex flex-col p-6 sm:h-max cursor-pointer"
        onClick={() => {
          router.push({
            pathname: "/nft-details",
            query: nft,
          });
        }}
      >
        <div className="relative transition duration-150 ease-in-out delay-150">
          <img
            src={nft?.image}
            alt="mock"
            className="w-full h-[352px] ssm:h-max rounded-2xl "
          />
          <div className="absolute top-0 left-0  bg-white/40  backdrop-blur-xl w-full h-full z-[20] rounded-2xl opacity-0 hover:opacity-100">
            <div className="flex items-center justify-center h-full ">
              <button
                className="main-btn-bg text-white text-lg main-family outline-none border-none py-2 px-5 rounded-xl  cursor-pointer w-auto "
                onClick={() => {
                  router.push({
                    pathname: "/nft-details",
                    query: nft,
                  });
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <h1 className="main-color">{nft.name}</h1>
          <div className="h-[56px] flex justify-between">
            <div className="flex flex-row gap-2">
              <div>
                <p className="my-1 text-base second-color">Creator </p>
                <h4 className="my-0 ssm:text-sm text-transparent font-bold main-color">
                  {truncateEthAddress(nft.owner)}
                </h4>
              </div>
            </div>
            <div>
              <p className="my-1 second-color">Current Price</p>
              <h4 className="my-0 main-color">{nft.price} MATIC</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNFTContainer;
