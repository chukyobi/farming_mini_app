import React, { useState, useEffect } from "react";
import profile_image from "../assets/default-profile-img.svg";
import wallet_icon from "../assets/wallet-icon.svg";
import edit_icon from "../assets/edit-icon.svg";
import delete_icon from "../assets/delete-icon.svg";
import success_check_icon from "../assets/success-check-icon.svg"
import "./header.css";
import api from "../../api";

const Header = ({ userData, setUserData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'connect', 'edit', 'delete', or 'view'
  const [walletAddress, setWalletAddress] = useState(
    userData.walletAddress || ""
  );
  const [originalWalletAddress, setOriginalWalletAddress] = useState(
    userData.walletAddress || ""
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWalletContainerClick = () => {
    if (!userData.walletAddress) {
      setModalType("connect");
      setIsModalOpen(true);
    } else {
      setModalType("view");
      setIsModalOpen(true);
    }
  };

  const handleEditClick = () => {
    setOriginalWalletAddress(walletAddress);
    setModalType("edit");
  };

  const handleDeleteClick = () => {
    setModalType("delete");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setWalletAddress(originalWalletAddress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/dashboard/update-wallet", {
        userId: userData.userId,
        walletAddress: walletAddress,
      });

      if (response.data && response.data.user) {
        setLoading(false);
        setSuccess(true);
        setUserData((prevData) => ({
          ...prevData,
          walletAddress: response.data.user.walletAddress,
        }));
        setOriginalWalletAddress(response.data.user.walletAddress);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating wallet address:", error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await api.post("/dashboard/delete-wallet", {
        userId: userData.userId,
      });

      if (response.data && response.data.user) {
        setLoading(false);
        setSuccess(true);
        setUserData((prevData) => ({
          ...prevData,
          walletAddress: null,
        }));
        setWalletAddress("");
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting wallet address:", error);
      setLoading(false);
    }
  };

  // Function to truncate wallet address and add ellipses
  const truncateWalletAddress = (address) => {
    if (!address) return "Connect Wallet";
    const maxLength = 8;
    return address.length > maxLength
      ? `${address.substring(0, maxLength)}...`
      : address;
  };

  useEffect(() => {
    setWalletAddress(userData.walletAddress || "");
    setOriginalWalletAddress(userData.walletAddress || "");
  }, [userData.walletAddress]);

  return (
    <div className="bg-[#11101C] px-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={profile_image} alt="profile_image" className="w-12 h-12 rounded-full border-4 border-[#1F1D32]" />
          <div className="ml-2">
            <h2 className="font-normal text-[16px] text-white leading-6">{userData.firstname}</h2>
            <p className="font-medium text-[#9493AC] text-xs">@{userData.username}</p>
          </div>
        </div>
        <div>
          <div className="wallet_container" onClick={handleWalletContainerClick}>
            <img src={wallet_icon} alt="wallet_icon" className="w-3 mr-1" />
            <span className="wallet_id text-black font-semibold">
              {truncateWalletAddress(userData.walletAddress)}
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content bg-[#11101C]">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            {loading ? (
              <div className="spinner">Loading...</div>
            ) : success ? (
              <div className="success-message">
                <img src={success_check_icon} className="w-12" />
                <p className="text-white mt-4 text-sm">
                  {modalType === "connect"
                    ? "Wallet connected successfully!"
                    : modalType === "edit"
                      ? "Wallet address updated successfully!"
                      : "Wallet address deleted successfully!"}
                </p>
              </div>
            ) : modalType === "connect" ? (
              <form className="mt-6" onSubmit={handleSubmit}>
                <label className="block mb-2 text-xs font-medium text-start">Wallet Address</label>
                <input
                  type="text"
                  className="bg-transparent border border-[#383A46] text-white text-sm font-normal w-full px-4 py-[0.7rem] rounded-xl"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
                <button className="bg-[#A3FF12] text-black text-sm font-medium w-full py-2 mt-2 rounded-lg" type="submit">Submit</button>
              </form>
            ) : modalType === "edit" ? (
              <form className="mt-6" onSubmit={handleSubmit}>
                <label className="block mb-2 text-xs font-medium text-start">Edit Wallet Address</label>
                <input
                  type="text"
                  className="bg-transparent border border-[#383A46] text-white text-sm font-normal w-full px-4 py-[0.7rem] rounded-xl"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-[#A3FF12] text-black text-sm font-medium w-full py-2 mt-2 rounded-lg"
                  disabled={walletAddress === originalWalletAddress}
                >
                  Update
                </button>
              </form>
            ) : modalType === "delete" ? (
              <div className="delete_pop text-center">
                <p className="mb-2 text-xs font-medium">Are you sure you want to delete your wallet address?</p>
                <button onClick={handleDelete} className="bg-[#A3FF12] text-black text-sm font-medium w-full py-2 mt-2 rounded-lg">
                  Yes, Delete
                </button>
                <button onClick={handleCloseModal} className="bg-transparent text-white text-sm font-normal w-full px-4 py-[0.7rem] rounded-xl">Cancel</button>
              </div>
            ) : modalType === "view" ? (
              <div className="wallet-details">
                <img
                  src={wallet_icon}
                  alt="wallet_icon"
                  className="wallet_icon_modal"
                />
                <span className="font-bold text-lg">{`${userData.walletAddress.substring(0, 20)}***`}</span>
                <button onClick={handleEditClick} className="bg-[#A3FF12] text-black text-sm font-medium w-full py-2 mt-4 rounded-lg">
                  Edit
                </button>
                <button onClick={handleDeleteClick} className="bg-transparent text-white text-sm font-normal w-full px-4 py-[0.7rem] rounded-xl">Delete</button>
                {/* <div className="modal-icons">
                  <span onClick={handleEditClick}>
                    <img src={edit_icon} alt="edit_icon" /> Edit
                  </span>
                  <span className="space"></span>
                  <span onClick={handleDeleteClick}>
                    <img src={delete_icon} alt="delete_icon" /> Delete
                  </span>
                </div> */}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
