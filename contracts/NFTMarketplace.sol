// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsInMarket;

    uint256 listingPrice = 0.025 ether;
    uint256 mintPrice = 0.05 ether;
    address payable owner;
    string public _baseTokenURI = "https://gateway.pinata.cloud/ipfs/QmaADzA23aVCYxxZJwU9prRPRCJXkmaNfjL8NSviFv6oaR/";

    mapping(uint256 => Item) private idToItem;

    struct Item {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event ItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    modifier onlyOwner{
        require(msg.sender == owner, "Invalid owner!");
        _;
    }

    modifier onlyOwnerOf(uint256 _tokenId){
        require(msg.sender == idToItem[_tokenId].owner, "Invalid owner!");
        _;
    }

    constructor() ERC721("Mumbai Punks", "MPNK") {
        owner = payable(msg.sender);
    }

    // Update the listing price of the Contract
    function updateListingPrice(uint _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    // Returns the listing price of the contract
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function updateMintPrice(uint _mintPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        mintPrice = _mintPrice;
    }

    // Returns the mint price of the contract
    function getMintPrice() public view returns (uint256) {
        return mintPrice;
    }

    // Mint the Token and list it in the marketplace
    function createToken(uint256 amount) public payable {
        require(_tokenIds.current() + amount <= 5000, "Mint was completed already");
        require(msg.value >= mintPrice * amount, "Insufficient fund!");
        for (uint256 i = 0; i < amount; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();

            idToItem[newTokenId] = Item(
                newTokenId,
                payable(address(0)),
                payable(msg.sender),
                0,
                false
            );

            _mint(msg.sender, newTokenId);
        }
    }
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, Strings.toString(tokenId), ".json"))
        : "";
    }

    function setBaseURI(string calldata _newURI) external onlyOwner {
        _baseTokenURI = _newURI;
    }

    // create market item
    function createMarketItem(uint256 tokenId, uint256 price) public payable onlyOwnerOf(tokenId) {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idToItem[tokenId] = Item(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _itemsInMarket.increment();

        _transfer(msg.sender, address(this), tokenId);
        emit ItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    // creating market sale
    function createMarketSale(uint256 tokenId) public payable {
        uint price = idToItem[tokenId].price;
        address seller = idToItem[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        idToItem[tokenId].owner = payable(msg.sender);
        idToItem[tokenId].sold = true;
        idToItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _itemsInMarket.decrement();
        _transfer(address(this), msg.sender, tokenId);
        (bool ownersent, ) = payable(owner).call{value: listingPrice}("");
        require(ownersent, "Failed to send");
        (bool sellersent, ) = payable(seller).call{value: msg.value}("");
        require(sellersent, "Failed to send");
    }

    // Returns all unsold market items
    function fetchMarketItems() public view returns (Item[] memory) {
        uint itemCount = _tokenIds.current();
        uint currentIndex = 0;
        // creating an empty array and provinding the size of the array that is unsold items as unsoldItemCount
        Item[] memory items = new Item[](_itemsInMarket.current());
        for (uint i = 0; i < itemCount; i++) {
            if (idToItem[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                Item storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Returns only items that a user has purchased
    function fetchMyNFTs() public view returns (Item[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        // creating an empty array and provinding the size of the array that is my item count as itemCount
        Item[] memory items = new Item[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                Item storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Returns only items a user has listed
    function fetchItemsListed() public view returns (Item[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
        // creating an empty array and provinding the size of the array that is total items as itemCount
        Item[] memory items = new Item[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                Item storage currentItem = idToItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
