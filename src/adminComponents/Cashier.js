import React, { useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Card, Button } from "@material-ui/core";
import logo from "../images/logo.jfif";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  item: {
    marginTop: 20,
  },
  itemName: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 12,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: "bold",
  },
  separator: {
    borderTop: "1pt solid black",
    marginTop: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  paymentMethod: {
    fontSize: 12,
    marginTop: 10,
  },
  orderNumber: {
    fontSize: 12,
    marginTop: 5,
  },
  additionalInfo: {
    fontSize: 12,
    marginTop: 10,
  },
  thankYouMessage: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 20,
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
  },
  gridItem: {
    marginVertical: 5,
  },
});

const Cashier = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      restaurantName: "Restaurant XYZ",

      dateTime: "September 15, 2023, 7:30 PM",
      items: [
        { name: "Grilled Salmon", price: 19.99, quantity: 1 },
        { name: "Caesar Salad", price: 8.99, quantity: 2 },
      ],
      subtotal: 37.97,
      taxes: 3.8,
      totalAmount: 41.77,
      paymentMethod: "Credit Card",
      orderNumber: "123456",
      additionalInfo: "Special instructions: No onions",
    },
    {
      id: 2,
      restaurantName: "Restaurant XYZ",

      dateTime: "September 15, 2023, 7:30 PM",
      items: [
        { name: "Grilled Salmon", price: 19.99, quantity: 1 },
        { name: "Caesar Salad", price: 8.99, quantity: 2 },
      ],
      subtotal: 37.97,
      taxes: 3.8,
      totalAmount: 41.77,
      paymentMethod: "Credit Card",
      orderNumber: "123456",
      additionalInfo: "Special instructions: No onions",
    },
    {
      id: 3,
      restaurantName: "Restaurant XYZ",

      dateTime: "September 15, 2023, 7:30 PM",
      items: [
        { name: "Grilled Salmon", price: 19.99, quantity: 1 },
        { name: "Caesar Salad", price: 8.99, quantity: 2 },
      ],
      subtotal: 37.97,
      taxes: 3.8,
      totalAmount: 41.77,
      paymentMethod: "Credit Card",
      orderNumber: "123456",
      additionalInfo: "Special instructions: No onions",
    },
  ]);

  const [selectedMenuItems, setSelectedMenuItems] = useState([]);

  const handleMenuItemSelect = (menuItem) => {
    const updatedMenuItems = menuItems.map((item) => {
      if (item.id === menuItem.id) {
        return {
          ...item,
          status: "approved",
        };
      }
      return item;
    });

    setMenuItems(updatedMenuItems);

    const transaction = {
      id: menuItem.id,
      price: menuItem.totalAmount,
      category: menuItem.category,
      date: menuItem.date,
      description: menuItem.description,
    };

    setSelectedMenuItems([...selectedMenuItems, transaction]);
    console.log("Transaction:", transaction);
  };

  const Receipt = ({ menuItem }) => {
    const customPageSize = {
      width: 220, // Specify the width in millimeters
      height: 400, // Specify the height in millimeters
    };

    return (
      <Document>
        <Page size="A6" style={styles.page}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.title}>{menuItem.restaurantName}</Text>
          <Text>{menuItem.dateTime}</Text>

          <View style={styles.item}>
            <Text style={styles.subtitle}>Itemized List</Text>
            <View style={styles.gridContainer}>
              <Text style={styles.gridItem}>Description</Text>
              <Text style={styles.gridItem}>Price</Text>
              <Text style={styles.gridItem}>Quantity</Text>
              {menuItem.items.map((item, index) => (
                <React.Fragment key={index}>
                  <Text style={styles.gridItem}>{item.name}</Text>
                  <Text style={styles.gridItem}>${item.price.toFixed(2)}</Text>
                  <Text style={styles.gridItem}>{item.quantity}</Text>
                </React.Fragment>
              ))}
            </View>
          </View>

          <Text style={styles.subtitle}>
            Subtotal: ${menuItem.subtotal.toFixed(2)}
          </Text>
          <Text style={styles.subtitle}>
            Taxes and Fees: ${menuItem.taxes.toFixed(2)}
          </Text>
          <Text style={styles.subtitle}>
            Total Amount: ${menuItem.totalAmount.toFixed(2)}
          </Text>

          <Text style={styles.paymentMethod}>
            Payment Method: {menuItem.paymentMethod}
          </Text>
          <Text style={styles.orderNumber}>
            Order Number: {menuItem.orderNumber}
          </Text>
          <Text style={styles.additionalInfo}>{menuItem.additionalInfo}</Text>

          <Text style={styles.thankYouMessage}>
            Thank you for dining with us!
          </Text>
        </Page>
      </Document>
    );
  };

  const handlePrintReceipt = (menuItem) => {
    const transaction = {
      id: menuItem.id,
      dishname: menuItem.dishname,
      price: menuItem.price,
      category: menuItem.category,
      date: menuItem.date,
      description: menuItem.description,
    };

    return (
      <PDFDownloadLink
        document={<Receipt menuItem={menuItem} />}
        fileName={`receipt-${menuItem.id}.pdf`}>
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>
    );
  };

  const sortedMenuItems = menuItems.sort((a, b) => {
    if (a.status === "approved" && b.status !== "approved") {
      return 1;
    }
    if (a.status !== "approved" && b.status === "approved") {
      return -1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col justify-items-center p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
      <h2>Menu Items</h2>
      <div className="flex justify-between">
        <div>
          <Card variant="outlined" className="p-4 bg-white shadow-md">
            <h3 className="mb-4">Non-Approved Items</h3>
            {sortedMenuItems.map(
              (menuItem) =>
                menuItem.status !== "approved" && (
                  <div
                    key={menuItem.id}
                    className="p-4 border border-gray-300 rounded bg-red-500 text-white mb-4">
                    <p>{menuItem.dishname}</p>
                    <Button
                      onClick={() => handleMenuItemSelect(menuItem)}
                      disabled={menuItem.status === "approved"}
                      variant="contained"
                      className="mt-2 bg-thirtiary">
                      Approve Transaction
                    </Button>
                  </div>
                )
            )}
          </Card>
        </div>

        <div>
          <Card variant="outlined" className="p-4 bg-white shadow-md">
            <h3 className="mb-4">Approved Items</h3>
            {sortedMenuItems.map(
              (menuItem) =>
                menuItem.status === "approved" && (
                  <div
                    key={menuItem.id}
                    className="p-4 border border-gray-300 rounded bg-thirtiary mb-4">
                    <p>{menuItem.dishname}</p>
                    {handlePrintReceipt(menuItem)}
                  </div>
                )
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Cashier;
