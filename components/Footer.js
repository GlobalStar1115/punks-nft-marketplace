import React from "react";

const Footer = () => {
  return (
    <footer className="relative">
      <section className="max-w-[1240px] mt-20 mb-10 mx-auto  gap-2  top-7 md:p-10">
        <div className="grid footer justify-between gap-[88px] md:grid-cols-2 md:gap-6 ">
          <div className="col-span-1">
            <div className="flex items-center justify-start gap-1">
              <img src="punks.png" alt="Punks" className="w-[40px] h-[40px]" />
              <h4 className="">Mumbai Punks</h4>
            </div>
            <p className="text-lg second-color">
              The world’s first and largest digital marketplace for crypto
              collectibles and non-fungible tokens (NFTs). Buy, sell, and
              discover exclusive digital items.
            </p>
          </div>
          <div>
            <p className="second-color">Help Center</p>
            <p className="second-color">Platform Status</p>
            <p className="second-color">Partners</p>
            <p className="second-color">Gas-Free Marketplace</p>
            <p className="second-color">Blog</p>
          </div>
          <div>
            <p className="second-color">Our Team</p>
            <p className="second-color">About Us</p>
            <p className="second-color">Partners</p>
            <p className="second-color">Contact Us</p>
            <p className="second-color">Career</p>
          </div>
          <div>
            <p className="second-color">
              2715 Ash Dr. San Jose, <br /> South Dakota 83475
            </p>
          </div>
        </div>
        <div>
          <h3>{new Date().getFullYear()} All Right Reserved</h3>
          <p>
            Designed and Developed By{" "}
            <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              {" "}
              BigStarTeam{" "}
            </span>
          </p>
        </div>
      </section>

      <div className="bg-[#1242ef] absolute left-[-380px] top-[222.18px] h-[352px] w-[652px] blur-[350px] rounded-full"></div>
    </footer>
  );
};

export default Footer;
