"use client";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import Location from "@/components/basics/location";
export default function Footer() {
  const [showLocation, setShowLocation] = useState(false);
  const [mapUrl, setMapUrl] = useState("");

  const handleOpenLocation = (url: string) => {
    setMapUrl(url);
    setShowLocation(true);
  };

  const handleCloseLocation = () => {
    setShowLocation(false);
  };
  return (
    <div className="flex flex-col mt-12 pt-8 w-full border-solid bg-gray-800 border-t-[5px] border-zinc-300 max-md:max-w-full">
      <div className="flex flex-col px-16 w-full max-md:px-4 max-md:max-w-full">
        <div className="max-md:mr-1.5 max-md:max-w-full">
          <div className="flex gap-4 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[67%] max-md:ml-0 max-md:w-full">
              <div className="max-md:max-w-full">
                <div className="flex gap-4 max-md:flex-col max-md:gap-0">
                  <div className="flex flex-col w-[30%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col grow text-sm text-neutral-100 ">
                      <div className="text-sm font-bold text-white">
                        Customer Support
                      </div>
                      <Link
                        href="#"
                        className="mt-4 underline md:no-underline hover:underline"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col ml-4 w-[35%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col text-sm text-neutral-100 max-md:mt-8">
                      <div className="text-sm font-bold text-white">
                        About Us
                      </div>
                      <div className="mt-4 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 mr-2 text-gray-200"
                        >
                          <path d="M22 5v4l-10 4L2 9V5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1zM2 11.154V19a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-7.846l-10 4z" />
                        </svg>
                        <div className="text-gray-200 font-medium font-bold">
                          Email:
                        </div>
                      </div>
                      <div className="mt-2">admin@curcus.store</div>
                      <div className="mt-4 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-6 h-6 mr-2 text-gray-200"
                        >
                          <path d="M21.384,17.752a2.108,2.108,0,0,1-.522,3.359,7.543,7.543,0,0,1-5.476.642C10.5,20.523,3.477,13.5,2.247,8.614a7.543,7.543,0,0,1,.642-5.476,2.108,2.108,0,0,1,3.359-.522L8.333,4.7a2.094,2.094,0,0,1,.445,2.328A3.877,3.877,0,0,1,8,8.2c-2.384,2.384,5.417,10.185,7.8,7.8a3.877,3.877,0,0,1,1.173-.781,2.092,2.092,0,0,1,2.328.445Z" />
                        </svg>
                        <div className="text-gray-200 font-medium font-bold">
                          Phone:
                        </div>
                      </div>
                      <div className="mt-2">(+84) 123456789</div>
                    </div>
                  </div>
                  <div className="flex flex-col ml-4 w-[23%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col text-sm text-neutral-200 max-md:mt-8">
                      <div className="text-sm font-bold text-white">
                        Address
                      </div>
                      <div
                        className="mt-4 flex items-center no-underline hover:underline cursor-pointer"
                        onClick={() =>
                          handleOpenLocation(
                            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.540073034032!2d106.83739671086674!3d10.846466057852783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317521af4730391f%3A0xfa0bd6efed6cc3f9!2sS10.06%20Origami%2C%20Vinhomes%20Grandpark!5e0!3m2!1svi!2s!4v1721408031290!5m2!1svi!2s"
                          )
                        }
                      >
                        <svg
                          viewBox="0 0 48 48"
                          className="w-6 h-6 mr-2 text-gray-200"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                          <path d="M0 0h48v48h-48z" fill="none" />
                        </svg>
                        <div className="text-gray-200 font-medium font-bold">
                          Quan 9
                        </div>
                      </div>
                      <div className="mt-2">Vinhome grand park, S10.06</div>
                      <div
                        className="mt-4 flex items-center no-underline hover:underline cursor-pointer"
                        onClick={() =>
                          handleOpenLocation(
                            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.984863448347!2d106.7833512108672!3d10.888754557066415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d94cad4c6827%3A0xa995be83e3f54f52!2sChung%20c%C6%B0%20HT%20Pearl!5e0!3m2!1svi!2s!4v1721408746581!5m2!1svi!2s"
                          )
                        }
                      >
                        <svg
                          viewBox="0 0 48 48"
                          className="w-6 h-6 mr-2 text-gray-200"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                          <path d="M0 0h48v48h-48z" fill="none" />
                        </svg>
                        <div className="text-gray-200 font-medium font-bold">
                          Bình Dương
                        </div>
                      </div>
                      <div className="mt-4">HT PEARL, A06.17</div>
                      <div
                        className="mt-4 flex items-center no-underline hover:underline cursor-pointer"
                        onClick={() =>
                          handleOpenLocation(
                            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.6524982885437!2d106.80923926960885!3d10.841128916501571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1718106331955!5m2!1svi!2s"
                          )
                        }
                      >
                        <svg
                          viewBox="0 0 48 48"
                          className="w-6 h-6 mr-2 text-gray-200"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M24 4c-7.73 0-14 6.27-14 14 0 10.5 14 26 14 26s14-15.5 14-26c0-7.73-6.27-14-14-14zm0 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                          <path d="M0 0h48v48h-48z" fill="none" />
                        </svg>
                        <div className="text-gray-200 font-medium font-bold">
                          Khu công nghệ cao
                        </div>
                      </div>
                      <div className="mt-2">Đại học FPT</div>
                    </div>
                  </div>
                </div>
              </div>
              <Location
                show={showLocation}
                onClose={handleCloseLocation}
                mapUrl={mapUrl}
              />
            </div>

            <div className="flex flex-col ml-4 w-[33%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow max-md:mt-8">
                <div className="flex items-center py-3 border-b text-white text-sm md:text-2xl md:mr-32 ">
                  <h2 className="font-bold ">Garams</h2>
                </div>
                <div className="mt-2 text-lg text-white">
                  We are the top gara service
                </div>
                <Link
                  href={"#"}
                  className="justify-center self-start hover:bg-gray-700 hover:text-black transition duration-300 p-7 mt-6 text-xl text-center text-white max-md:mt-10 bg-black no-underline hover:underline"
                >
                  Our Service
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8 max-w-full w-[767px] max-md:flex-wrap max-md:mt-8">
          <Link href="/term" className="flex-auto text-xs text-stone-500 max-md:max-w-full">
            Term And Policy
          </Link>
        </div>
      </div>

    </div>
  );
}
