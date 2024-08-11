import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import CustomerInfoCard from "src/components/CustomerInfoCard";
import {
  ImageResponse,
  UserResponse,
} from "src/components/CustomerDetails/index.interface";

const CustomerDetails = () => {
  const [customers, setCustomers] = useState<UserResponse[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<null | number>(
    null
  );
  const [selectedCustomer, setSelectedCustomer] = useState<null | UserResponse>(
    null
  );
  const [customerImages, setCustomerImages] = useState<ImageResponse[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  let currentImages;

  // re-setting the interval when a new customer is selected from the list
  useEffect(() => {
    if (customerImages) {
      const interval = setInterval(() => {
        setCurrentBatch((prevBatch) => {
          const newBatchValue =
            (prevBatch + 1) % Math.floor(customerImages.length / 9);
          return newBatchValue;
        });
      }, 10000); // Change batch every 10 seconds

      return () => clearInterval(interval); // Clean up on unmount
    }
  }, [customerImages]);

  // getting first 9 images from the array "customerImages", based in currentBatch value (initiallly 0, then
  // 1, 2 then again 0)
  const getImagesForCurrentBatch = () => {
    const startIndex = currentBatch * 9;
    return customerImages!.slice(startIndex, startIndex + 9);
  };

  if (customerImages.length !== 0) {
    currentImages = getImagesForCurrentBatch();
  }

  // getting the user data form "https://randomuser.me" api
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("https://randomuser.me/api/?results=1000");
      const customerData = await res.json();
      setCustomers(customerData.results);
    };

    getData();
  }, []);

  //getting images form "https://picsum.photos/" api from a random page between page number 1 and 33 because
  //after page 33 there are not sufficient images in the api response.
  // We fetch the images first on page load then every time when "selectedCardIndex" changes, i.e when user
  // clicks on a customer card from the list
  useEffect(() => {
    const getImages = async () => {
      const randomPageNumber = Math.floor(Math.random() * 33) + 1; //generate a random number between 1 and 33, both inclusive
      const imagesData = await fetch(
        `https://picsum.photos/v2/list?page=${randomPageNumber}`
      );
      const images = await imagesData.json();
      setCustomerImages(images);
    };

    getImages();
  }, [selectedCardIndex]);

  const getSelectedCustomerData = (email: string) => {
    const selectedCustomer = customers.filter(
      (customer) => customer.email === email
    );
    setSelectedCustomer(selectedCustomer[0]);
  };

  return (
    <div className={styles["contianer"]}>
      <div className={styles["heading"]}>Customer Details</div>
      <div className={styles["data"]}>
        <div className={styles["customer-list"]}>
          {customers.length !== 0 ? (
            customers.map((customer, index) => (
              <CustomerInfoCard
                name={customer.name}
                onClick={() => {
                  getSelectedCustomerData(customer.email);
                  setSelectedCardIndex(index);
                }}
                selectedCardIndex={selectedCardIndex}
                index={index}
                key={index}
              />
            ))
          ) : (
            <p>Fetching data....</p>
          )}
        </div>
        <div className={styles["details-container"]}>
          {selectedCustomer !== null ? (
            <div className={styles["customer-details"]}>
              <span className={styles["customer-details-heading"]}>
                {selectedCustomer.name.title}. {selectedCustomer.name.first}{" "}
                {selectedCustomer.name.last}
              </span>
              <p className={styles["details"]}>
                <p>
                  <span className={styles["details-sub-heading"]}>
                    Address:
                  </span>{" "}
                  Street No. {selectedCustomer.location.street.number},{" "}
                  {selectedCustomer.location.street.name},{" "}
                  {selectedCustomer.location.city},{" "}
                  {selectedCustomer.location.state},{" "}
                  {selectedCustomer.location.country}.
                </p>
                <p>
                  <span className={styles["details-sub-heading"]}>
                    Postcode:-{" "}
                  </span>
                  {selectedCustomer.location.postcode}
                </p>
              </p>
              {/* using ! after currentImages because we know it will not be undefined */}
              <div className={styles["flex-container"]}>
                {customerImages.length !== 0 &&
                  currentImages!.map((image, index) => (
                    <div className={styles["flex-item"]} key={index}>
                      <img src={image.download_url} alt="customer-image" />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <p className={styles["select-customer-label"]}>
              Select a person to see their details
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
