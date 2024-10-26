import React from 'react'
import duplicate_icon from '../../assets/duplicate.svg';
import share_icon from '../../assets/share.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Referrals = ({userData}) => {

  return (
    <div className='bg-[#11101C] text-white min-h-screen p-4'>
      <div className="mt-12">
        <h1 className="text-2xl font-bold mb-4">Referrals</h1>
        <ToastContainer />

        <div className="flex justify-around">
          <div className="flex-initial w-40 border rounded-2xl border-[#383A46] py-4 pl-4">
            <p className="text-sm">Referrals</p>
            <p className="font-bold text-2xl">{userData.numberOfReferrals}</p>
          </div>
          <div className="flex-initial w-40 border rounded-2xl border-[#383A46] py-4 pl-4">
            <p className="text-sm">Points earned</p>
            <p className="font-bold text-2xl">{userData.farmedPoints??0}</p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-bold text-base mb-2">Share referral link</h2>
          <div className="flex space-x-1 items-center">
            <div className="flex-1">
              <input type="text" value={`https://t.me/app?refCode=${userData.userId}`} className="bg-transparent border border-[#383A46] text-white text-sm font-normal w-full px-4 py-[0.9rem] rounded-xl" readonly />
            </div>
            <div className="flex-none w-12 h-12">
              <div className="bg-[#A3FF12] h-12 flex justify-center rounded-xl"
              onClick={() => {
                navigator.clipboard.writeText(`https://t.me/app?refCode=${userData.userId}`); 
                toast("Copied.")
              }
            }
              >
                <img className="w-4" src={duplicate_icon} alt="" srcset="" />
              </div>
            </div>
            {/* <div className="flex-none w-12 h-12">
              <div className="bg-[#A3FF12] h-12 flex justify-center rounded-xl">
                <img className="w-4" src={share_icon} alt="" srcset="" />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Referrals