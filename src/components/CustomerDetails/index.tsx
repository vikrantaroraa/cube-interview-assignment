import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import CustomerInfoCard from "src/components/CustomerInfoCard";

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerImages, setCustomerImages] = useState(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  let currentImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBatch((prevBatch) => {
        const newBatchValue =
          (prevBatch + 1) % Math.floor(customerImages.length / 9);
        return newBatchValue;
      });
    }, 10000); // Change batch every 10 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, [customerImages]);

  const getImagesForCurrentBatch = () => {
    const startIndex = currentBatch * 9;
    // console.log(startIndex);
    return customerImages.slice(startIndex, startIndex + 9);
  };

  if (customerImages) {
    currentImages = getImagesForCurrentBatch();
    // console.log("urrent images: ", currentImages);
  }

  // getting the user data form "randomuser.me"
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("https://randomuser.me/api/?results=10");
      const customerData = await res.json();
      setCustomers(customerData.results);
    };

    getData();
  }, []);

  //getting images form a random page between page number 1 and 33 because after page 33 there are not sufficient images in the api response
  useEffect(() => {
    const getImages = async () => {
      const randomPageNumber = Math.floor(Math.random() * 33) + 1; //generate a random number between 1-33, both inclusive
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
    setSelectedCustomer(selectedCustomer);
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
                {selectedCustomer[0].name.title}.{" "}
                {selectedCustomer[0].name.first} {selectedCustomer[0].name.last}
              </span>
              <p className={styles["details"]}>
                <p>
                  <span className={styles["details-sub-heading"]}>
                    Address:
                  </span>{" "}
                  Street No. {selectedCustomer[0].location.street.number},{" "}
                  {selectedCustomer[0].location.street.name},{" "}
                  {selectedCustomer[0].location.city},{" "}
                  {selectedCustomer[0].location.state},{" "}
                  {selectedCustomer[0].location.country}.
                </p>
                <p>
                  <span className={styles["details-sub-heading"]}>
                    Postcode:-{" "}
                  </span>
                  {selectedCustomer[0].location.postcode}
                </p>
              </p>
              <div className={styles["flex-container"]}>
                {customerImages &&
                  currentImages.map((image, index) => (
                    <div className={styles["flex-item"]}>
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
